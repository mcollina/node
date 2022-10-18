const async_hooks = require('async_hooks')

global.lastSeenPromiseId = -1
async_hooks.createHook({
  init: (asyncId, type, triggerAsyncId, resource) => {
    process._rawDebug('>>> ', asyncId, type, triggerAsyncId)
    if (type === 'PROMISE') {
      global.lastSeenPromiseId = asyncId
    }
  }
}).enable()
