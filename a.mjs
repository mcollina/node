import asyncHooks from 'async_hooks'

process._rawDebug('The current asyncId:', asyncHooks.executionAsyncId())
process._rawDebug(lastSeenPromiseId)
