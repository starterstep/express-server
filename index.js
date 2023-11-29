const nodeConsole = require('./lib/node-console')
const _ = require('underscore')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const s = require('underscore.string')
const yamlConfig = require('yaml-config')
const ejs = require('ejs')

const $ = module.exports = {}

const dirs = ['config', 'logs', 'db', 'templates', 'views', 'lib', 'helpers', 'settings', 'plugins', 'schemas', 'models', 'managers', 'orchestrators', 'controllers', 'routers', 'routes', 'events', 'jobs']
_.each(dirs, function (dir) {
    $[dir] = function () { return _.isFunction($[dir].index) && $[dir].index.apply(this, arguments) }
})

$.express = require('express')
$.server = $.express()

const mapRequire = function (moduleName, dirs) {
    const log = []
    _.each(dirs, function (files) {
        const module = $[moduleName]
        const indexes = []

        const splitRefFile = function (ref, split, file, isIndex) {
            if (file.indexOf('.yaml') !== -1) {
                ref[split] = ref[split] || {}
                return _.extend(ref[split], yamlConfig.readConfig(path.resolve(file)))
            }
            if (file.indexOf('.ejs') !== -1) {
                const readFile = fs.readFileSync(path.resolve(file), { encoding: 'utf8' })
                return (ref[split] = ejs.compile(readFile))
            }

            const module = require(path.resolve(file))
            ref[split] = module

            if (isIndex) {
                _.extend(ref, module)
            }
        }

        const doFile = function (name, file, isIndex) {
            const splits = name.split('/')
            let ref = module
            if (splits.length > 1) {
                _.each(splits, function (split, index) {
                    split = s.camelize(split)
                    if (index === splits.length - 1) {
                        splitRefFile(ref, split, file, isIndex)
                    } else {
                        const localRef = ref
                        ref = ref[split] || (ref[split] = function () {
                            return _.isFunction(localRef[split].index) && localRef[split].index.apply(this, arguments)
                        })
                    }
                })
            } else {
                const split = s.camelize(name)
                splitRefFile(ref, split, file, isIndex)
            }
        }

        _.each(files, function (name, file) {
            if (file.indexOf('index.js') !== -1) {
                return indexes.push({ name, file })
            }
            log.push(name)
            // console.log('!!!!files loading', name, file);
            doFile(name, file)
        })

        _.each(indexes, function (index) {
            log.push(index.name)
            // console.log('!!!!indexes loading', index);
            doFile(index.name, index.file, true)
        })
    })
    // console.log('loaded', moduleName, _.uniq(log));
}

const pathReduce = function (files) {
    if (Object.keys(files).length === 1) {
        const file = Object.keys(files)[0]
        files[file] = path.basename(file)
        return files
    }

    const keys = []
    for (const file in files) {
        keys.push(files[file].split('/'))
    }

    let common = 0
    while (keys.every((key) => key[common] === keys[0][common])) {
        common++
    }
    common = `${keys[0].slice(0, common).join('/')}/`

    for (const file in files) {
        files[file] = files[file].substring(common.length)
    }
    return files
}

const stripExt = function (files) {
    const filenames = Object.keys(files)
    // contains map of stripped filenames
    const conflicts = {}
    for (let i = 0, l = filenames.length; i < l; i++) {
        (function (file, key) {
            const newKey = key.substr(0, key.length - path.extname(key).length)
            // if already file with same stripping
            if (_.has(conflicts, newKey)) {
                // check if first conflict
                if (conflicts[newKey] !== false) {
                    // revert previous file stripping
                    files[conflicts[newKey][0]] = conflicts[newKey][1]
                    conflicts[newKey] = false
                }
            } else {
                // strip key
                files[file] = newKey
                // remember for possible later conflicts
                conflicts[newKey] = [file, key]
            }
        })(filenames[i], files[filenames[i]])
    }
    return files
}

$.load = function (dirs) {
    dirs = dirs || [path.resolve(__dirname, '..', '..')]

    _.each(_.keys($), function (moduleName) {
        if (['load', 'console', 'start', 'express', 'server'].indexOf(moduleName) !== -1) {
            return
        }

        const globbedDirs = []
        _.each(dirs, function (dir) {
            const files = glob.sync(`${dir}/${moduleName}/**/*{.js,.yaml,.ejs}`)
            if (!files.length) {
                return
            }
            const mapped = _.reduce(files, function (hash, file) {
                hash[file] = file
                return hash
            }, {})
            // console.log('\nmapped = ', mapped);
            const pathReduced = pathReduce(mapped)
            // console.log('pathReduced = ', pathReduced);
            const strippedExt = stripExt(pathReduced)
            // console.log('strippedExt = ', strippedExt);
            globbedDirs.push(strippedExt)
        })
        mapRequire(moduleName, globbedDirs)
    })

    return $
}

$.console = function (extendFn) {
    nodeConsole($, extendFn)
    return $
}

$.start = function (callback) {
    $.http = $.server.listen($.server.get('port'), function () {
        console.log(`express-server listening on port ${$.server.get('port')}`)
        return callback && callback(null, $)
    })
    return $
}
