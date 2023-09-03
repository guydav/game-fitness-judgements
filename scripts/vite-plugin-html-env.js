const { loadEnv } = require('vite')
const path = require('path')
const fs = require('fs')

const _omit = (obj = {}, uselessKeys = []) =>
  Object.keys(obj || {}).reduce(
    (cur, key) =>
      uselessKeys.includes(key) ? cur : { ...cur, [key]: obj[key] },
    {}
  )

const _pick = (obj, defaultConfig = {}) =>
  Object.keys(obj).length
    ? Object.keys(defaultConfig).reduce(
        (cur, key) => ({
          ...cur,
          [key]: obj[key] || defaultConfig[key],
        }),
        defaultConfig
      )
    : defaultConfig

const _resolve = (dir) => path.resolve(__dirname, dir)

const _loadEnv = (envPath = '.env') => {
  const envFilePath = _resolve(`${process.cwd()}/${envPath}`)
  try {
    const res = {}

    if (!fs.existsSync(envFilePath)) {
      return {}
    }
    const data = fs.readFileSync(envFilePath, 'utf8')
    data.split('\n').forEach((kv) => {
      const [k, ...values] = kv.split('=')
      const key = k.replace(/\s+/g, '')
      const value = values.join('=').trim()

      if (key) {
        res[key] = value
      }
    })

    return res
  } catch (err) {
    console.error(err)
  }
}

const _getModeEnvPath = () => {
  const argvList = process.argv.slice(2)
  const modeIndex = argvList.findIndex(
    (arg) => arg === '-m' || arg === '--mode'
  )
  const modeFuzzyIndex = argvList.findIndex(
    (arg) => arg.indexOf('-m') > -1 || arg.indexOf('--mode') > -1
  )

  if (
    modeIndex !== -1 &&
    modeIndex === modeFuzzyIndex &&
    !!argvList[modeIndex + 1] // both null vs empty
  )
    return `.env.${argvList[modeIndex + 1]}`

  if (modeFuzzyIndex !== -1 && !!argvList[modeFuzzyIndex])
    return `.env.${argvList[modeFuzzyIndex].split('=')[1]}`
}

const modeEnvPath = _getModeEnvPath()
const envConfig = {
  ..._loadEnv('env/.env.git.local'),
  ...(!!modeEnvPath && _loadEnv(modeEnvPath)),
}

const DEFAULT_CONFIG = {
  prefix: '<{',
  suffix: '}>',
  envPrefixes: 'VITE_',
}

function vitePluginHtmlEnv(config) {
  return {
    name: 'rollup-plugin-html-env',

    transformIndexHtml(html, ctx) {
      config = config || {}
      const { prefix, suffix, envPrefixes } = _pick(config, DEFAULT_CONFIG)
      let ctxEnvConfig = {}
      // Use the loadEnv method provided by vite, because the code checks that it is a dev environment
      if (ctx.server) {
        ctxEnvConfig =
          loadEnv(
            ctx.server.config.mode,
            process.cwd(),
            envPrefixes || 'VITE_'
          ) || {}
      } else {
        Object.assign(ctxEnvConfig, envConfig)
      }

      const map = {
        ...ctxEnvConfig,
        ..._omit(config, Object.keys(DEFAULT_CONFIG)),
      }
      const reg = new RegExp(`(${prefix}|<%)\\s+(\\w+)\\s+(${suffix}|\/>)`, 'g')
      return html.replace(reg, (...arg) => {
        const key = arg[2]
        return `${map[key]}`
      })
    },
  }
}

module.exports = vitePluginHtmlEnv
