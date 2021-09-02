const _ = require('underscore')
const s = require('underscore.string')
const m = require('moment')

module.exports = function ($) {
    const repl = require('repl').start({
        useGlobal: true,
        ignoreUndefined: true,
        prompt: 'express-server > '
    })

    const context = repl.context

    context.u = _
    context.s = s
    context.m = m

    context.cb = function (err, result) {
        context.err = err
        context.result = result
    }

    _.extend(context, _.omit($, 'console'))

    return context
}
