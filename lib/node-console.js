/* global process */
const _ = require('underscore')
const s = require('underscore.string')
const m = require('moment')
const path = require('path')
const EOL = require('os').EOL

module.exports = function ($, extendFn) {
    const repl = require('repl').start({
        useGlobal: true,
        ignoreUndefined: true,
        prompt: 'express-server > '
    })
    repl.setupHistory(path.join(process.env.PWD, '.repl_node_history'), function (err) {
        if (err) { console.log('Repl history error:', err) }
    })

    const context = repl.context

    context.u = _
    context.s = s
    context.m = m

    context.cb = function (err, result) {
        context.err = err
        context.result = result
        repl.displayPrompt()
    }

    // assign err or result to var name in context
    context.cba = function (varName) {
        const interval = setInterval(function () {
            process.stdout.write('.')
        }, 250)

        global.domain.active.on('error', () => {
            if (interval) { clearInterval(interval) }
        })

        return function (err, result) {
            if (interval) { clearInterval(interval) }
            process.stdout.write(EOL)
            context[varName] = err || result
            repl.displayPrompt()
        }
    }

    // print error and/or result only
    context.cbp = function () {
        const interval = setInterval(function () {
            process.stdout.write('.')
        }, 250)

        global.domain.active.on('error', () => {
            if (interval) { clearInterval(interval) }
        })

        return function (err, result) {
            if (interval) { clearInterval(interval) }
            if (err) {
                process.stdout.write(EOL)
                console.error(err)
                process.stdout.write(EOL)
            }
            process.stdout.write(EOL)
            console.log(result)
            process.stdout.write(EOL)
            repl.displayPrompt()
        }
    }

    _.extend(context, _.omit($, 'console'))
    if (extendFn) extendFn(repl)
}
