# Plan: Finish PR #50590 — `module: add import map support`

**Original PR:** https://github.com/nodejs/node/pull/50590
**Author:** @wesleytodd (Wes Todd)
**Status:** Open, CONFLICTING, CHANGES_REQUESTED
**Last updated:** 2025-08-04 (last commit from 2023-11-17)

---

## Context

This PR adds experimental support for [import maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps) behind
`--experimental-import-map=<path>`. Import maps allow remapping module specifiers
(e.g. `import 'foo'` -> `./vendor/foo/index.mjs`) and scoped overrides, per the
WICG/WHATWG spec used by browsers.

The PR has been stalled since late 2023. The ESM loader infrastructure has changed
significantly since then (removal of `loadESM`, new `module.registerHooks()` system,
new resolve/load caching, `require(esm)` support, etc.). A clean rewrite on top of
current `main` is more practical than a mechanical rebase.

---

## Step 0: Rebase / Fresh Branch

The PR is marked CONFLICTING against `main`. The files it touches have changed
substantially:

| PR file | Current state |
|---|---|
| `lib/internal/modules/run_main.js` | `runMainESM()` replaced by `executeUserEntryPoint()` + `runEntryPointWithESMLoader()` |
| `lib/internal/modules/esm/loader.js` | `ModuleLoader` class restructured: new resolve caching, sync hooks, `require(esm)` support |
| `lib/internal/modules/esm/resolve.js` | `defaultResolve()` mostly intact but signatures changed; `moduleResolve()` still exists |
| `lib/internal/process/esm_loader.js` | `loadESM()` pattern removed |
| `lib/internal/modules/helpers.js` | Still exists; `shouldBeTreatedAsRelativeOrAbsolutePath` already exists in `resolve.js` |
| `src/node_options.cc` / `.h` | Structure intact, line numbers shifted |

**Action:** Create a fresh branch from current `main` and cherry-pick the conceptual
changes, adapting to the new infrastructure.

---

## Step 1: C++ — Add the `--experimental-import-map` CLI flag

Files: `src/node_options.h`, `src/node_options.cc`

- Add `std::string import_map_specifier;` to `EnvironmentOptions` in `node_options.h`
- Add the option in `node_options.cc`:
  ```cpp
  AddOption("--experimental-import-map",
            "load an import map",
            &EnvironmentOptions::import_map_specifier,
            kAllowedInEnvvar);
  ```
- Keep the `--experimental-` prefix per reviewer consensus (aduh95: "let's not repeat
  what we've done for `--experimental-loader`")

---

## Step 2: JS — Add `ERR_INVALID_IMPORT_MAP` error code

File: `lib/internal/errors.js`

- Add error code following existing pattern:
  ```js
  E('ERR_INVALID_IMPORT_MAP', 'Invalid import map: %s', Error);
  ```

---

## Step 3: JS — Create `lib/internal/modules/esm/import_map.js`

This is the core new file. Based on the PR's latest revision + reviewer feedback:

### Design decisions (settled in PR discussion):
- `imports` and `scopes` are **private** (`#imports`, `#scopes`) — don't expose SafeMap
- Getters for `imports`/`scopes` return **plain objects** converted from SafeMap (per
  guybedford + wesleytodd Slack convo) to avoid mutation issues
- `baseURL` stays **private** with a getter
- Uses **primordials** throughout (StringPrototypeStartsWith, etc.)
- Uses **indexed for-loops** over ObjectEntries (not for-of on iterators)
- `null` check before `typeof === 'object'` checks
- `scopes` is **optional** (not required) per the spec — the original PR required it,
  but the spec says both `imports` and `scopes` are optional
- No `debugger` statements (leftover in the PR's latest push)
- Remove underscore-prefixed variable names (anonrig feedback)
- `process()` method should not take unused `baseURL` parameter
- Variable naming: rename `hasSlash` to something clearer (e.g. `slashIndex`)

### Import map spec compliance:
- Parse and validate the JSON structure
- Normalize specifier keys and values as URLs relative to baseURL
- Sort scopes by specificity (longest path first)
- Support: bare specifier remapping, scoped remapping, data URIs, prefix matching
  with trailing `/`
- Bare specifier -> bare specifier remapping is allowed (confirmed by WPT)
- No CommonJS support in this PR (deferred to follow-up per discussion)

### Caching:
- Cache resolved specifiers in `#specifiers` SafeMap (the `#getMappedSpecifier` pattern
  from the PR's last revision)

---

## Step 4: JS — Integrate import map loading at startup

File: `lib/internal/modules/run_main.js`

The old PR hooked into `loadESM()` which no longer exists. New integration point:

- In `runEntryPointWithESMLoader()` or `asyncRunEntryPointWithESMLoader()`:
  1. Read `--experimental-import-map` option value
  2. If set, read the import map file **synchronously** with `fs.readFileSync` + `JSON.parse`
     (simpler than the old approach of using the ESM loader to import it as JSON module;
     avoids chicken-and-egg bootstrapping issues)
  3. Resolve the specifier relative to CWD to get the file path and base URL
  4. Construct `new ImportMap(parsed, baseURL)`
  5. Store it on the `ModuleLoader` instance (e.g. `cascadedLoader.importMap = importMap`)

**Why sync read instead of ESM import:** The old PR used `esmLoader.resolve()` then
`esmLoader.import()` to load the import map as a JSON module. This was problematic
(double-resolve, chicken-and-egg with the import map affecting its own loading). A
sync `readFileSync` + `JSON.parse` is simpler, avoids bootstrapping issues, and is what
the import map spec intends (the map is loaded before any module resolution begins).

---

## Step 5: JS — Hook import map resolution into the resolver

File: `lib/internal/modules/esm/resolve.js`

In `defaultResolve(specifier, context)`, **before** calling `moduleResolve()`:

```js
// If an import map is active, try to resolve through it first
if (context.importMap) {
  const mapped = context.importMap.resolve(specifier, parentURL);
  if (mapped !== specifier) {
    // If mapped to a URL, use it directly
    if (isURL(mapped)) {
      return { __proto__: null, url: mapped.href, format: undefined };
    }
    // If mapped to another bare specifier, continue resolution with remapped specifier
    specifier = typeof mapped === 'string' ? mapped : mapped.href;
  }
}
```

**Key design:** Import maps do NOT replace the resolution algorithm — they alter the
specifier and then pass it back to normal resolution. If the map resolves to a full
URL/path, that's used directly. If it resolves to another bare specifier, normal
`moduleResolve()` runs on the remapped specifier.

### Passing the import map through context:

File: `lib/internal/modules/esm/loader.js`

- Store `importMap` on `ModuleLoader` as a property
- Pass it through the resolve context: in `#cachedDefaultResolve()` or wherever context
  is assembled, add `importMap: this.importMap`
- **Do NOT pass it to custom loader hooks / worker threads** — it's not transferable
  (per aduh95 feedback). Strip it from context before sending to hook workers.

---

## Step 6: Tests

File: `test/es-module/test-import-map.mjs` (not `test-importmap.mjs` per GeoffreyBooth)

Fixture dir: `test/fixtures/es-module-loaders/import-maps/` (hyphenated per GeoffreyBooth)

### From the PR's existing tests (adapt to current test patterns):
- [x] Unit tests for `ImportMap` class parsing and validation
- [x] Unit tests for `ImportMap.resolve()` — simple, scoped, nested scopes, data URIs
- [x] Integration: `--experimental-import-map` flag with spawned child process
- [x] Integration: invalid import map throws on startup
- [x] Integration: bare specifier remapping
- [x] Integration: scoped remapping

### Outstanding test items from PR checklist:
- [ ] **WPT data-driven tests** — use tests from
  `test/fixtures/wpt/import-maps/data-driven/resources/` (guybedford: "Can we please
  unmark the WPT checkbox until all those data-driven tests pass?")
- [ ] Test with **custom loaders** — verify import maps work when `--experimental-loader`
  or `module.registerHooks()` is also active (aduh95: "Can you add a test with a loader?")
- [ ] Benchmarks for **startup impact** (PR checklist item)
- [ ] Tests for `bare/sub-path` in imports (wesleytodd noted this gap)

### Reviewer feedback on tests:
- Don't check error messages in assertions, only error codes (anonrig)
- Use `fixtures.path()` / `fixtures.fileURL()` helpers (GeoffreyBooth)
- Don't use primordials in test files (GeoffreyBooth)
- Add trailing newlines to all fixture JSON files (aduh95)

---

## Step 7: Documentation

File: `doc/api/esm.md` (and possibly `doc/api/cli.md`)

- Document `--experimental-import-map=<path>` flag
- Describe import map JSON format (`imports`, `scopes`)
- Explain resolution behavior: maps run before standard resolution, unmapped specifiers
  fall through to normal resolution
- Note: ESM only (no CommonJS support yet)
- Note: Experimental status

File: `doc/api/errors.md`

- Document `ERR_INVALID_IMPORT_MAP`

---

## Step 8: Address remaining open design questions

### From PR checklist (still unresolved):

1. **Loader interop** — Do we pass the import map to custom loaders?
   Current consensus: **No**, strip from context before sending to workers.
   Loaders can implement their own resolution; import maps run before hooks.

2. **Import map generation workflow** — nodejs/node#49443 (comment 2470856409) raised
   concern about how import map generation is intended to work. Need to document the
   expected workflow (likely: build tool generates `importmap.json`, user passes path
   to Node).

3. **Well-known location** — Auto-loading from `node_modules/importmap.json` is a future
   follow-up, not in this PR.

4. **`scopes` optionality** — The spec says `scopes` is optional. The PR currently
   requires it. Should be made optional.

---

## Execution Order

1. Create fresh branch from `main`
2. Step 1: C++ flag (small, isolated)
3. Step 2: Error code (small, isolated)
4. Step 3: `import_map.js` core implementation
5. Step 4: Startup integration in `run_main.js`
6. Step 5: Resolver integration in `resolve.js` + `loader.js`
7. Step 6: Tests (can start alongside steps 3-5)
8. Step 7: Docs
9. Build and run: `./configure && make -j4 && tools/test.py test/es-module/test-import-map.mjs`
10. Run linter: `make lint`
11. Validate commit: `npx core-validate-commit`

---

## Risks

- **Startup perf:** Sync reading + parsing the import map adds to startup time. Need
  benchmarks to quantify.
- **Spec drift:** The import maps spec may have evolved since the PR was written. Need
  to re-check https://html.spec.whatwg.org/multipage/webappapis.html#import-maps
- **Interaction with `require(esm)`:** The PR was written before `require(esm)` landed.
  Import maps currently only affect ESM resolution. Need to decide if `require()` of
  ESM modules should also consult the import map.
- **`module.registerHooks()` interaction:** Custom resolve hooks may conflict with or
  duplicate import map behavior. Need clear ordering semantics.
