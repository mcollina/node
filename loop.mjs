import { SynchronousWorker} from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const atStart = process.memoryUsage()

function printDiff (title, before, now) {
  console.log(title, {
    rss: (now.rss - before.rss) / 1024 / 1024,
    heapTotal: (now.heapTotal - before.heapTotal) / 1024 / 1024,
    heapUsed: (now.heapUsed - before.heapUsed) / 1024 / 1024,
    external: (now.external - before.external) / 1024 / 1024,
    arrayBuffers: (now.arrayBuffers - before.arrayBuffers) / 1024 / 1024
  })
}

async function run () {
  for (let i = 0; i < 1000; i++) {
    const w = new SynchronousWorker({
      sharedEventLoop: true,
      sharedMicrotaskQueue: true
    });
    w.runInWorkerScope(() => {
      const req = w.createRequire(__filename)
      req(join(__dirname, 'wrap.js'))
    })

    await w.stop();
  }
  gc()
}
await run()

const inBetween = process.memoryUsage()

printDiff('diff vs start', atStart, inBetween)

await run()

const secondRun = process.memoryUsage()

printDiff('diff vs second run', inBetween, secondRun)

await run()

const thirdRun = process.memoryUsage()
printDiff('diff vs third run', secondRun, thirdRun)

await run()

const fourthRun = process.memoryUsage()
printDiff('diff vs fourth run', thirdRun, fourthRun)
