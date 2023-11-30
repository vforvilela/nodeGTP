import request from 'request'
const { readFileSync } = await import('fs')

const time2str = (time) => new Date(time * 1000).toISOString()

export const functions = [
  {
    name: 'getCurrentBlock',
    description: 'current/best block information',
    parameters: {
      type: 'object',
      properties: {},
    },
    run: async () => {
      return fix(await rpc('getBlock', [await rpc('getBestBlockHash')]))
    },
  },
  {
    name: 'getBlockByHash',
    description: 'block information from block hash',
    parameters: {
      type: 'object',
      properties: {
        hash: { type: 'string' },
      },
    },
    run: async ({ hash }) => {
      const data = fix(await rpc('getBlock', [hash]))
      return data
    },
  },
  {
    name: 'getBlockByHeight',
    description: 'block information from block height',
    parameters: {
      type: 'object',
      properties: {
        height: { type: 'integer' },
      },
    },
    run: async ({ height }) => {
      const data = fix(await rpc('getBlock', [await rpc('getBlockHash', [height])]))
      data.tx = data.tx.length
      return data
    },
  },
  {
    name: 'getHalvings',
    description: 'information about past and future halvings',
    parameters: {
      type: 'object',
      properties: {
        height: { type: 'integer' },
      },
    },
    run: async () => {
      const { height: currentHeight, time: currentTime } = await rpc('getBlock', [
        await rpc('getBestBlockHash'),
      ])

      const halvingInterval = 210000

      const past = []
      let height = 0
      let subsidy = 50e8
      for (; height < currentHeight; height += halvingInterval) {
        const { time } = await rpc('getBlock', [await rpc('getBlockHash', [height])])
        past.push({
          height,
          time: time2str(time),
          event: height == 0 ? 'genesis' : 'halving',
          subsidy,
        })
        subsidy = Math.floor(subsidy / 2)
      }

      const future = []
      for (; height <= 6_930_000; height += halvingInterval) {
        const time = new Date((currentTime + (height - currentHeight) * 600) * 1000)
        future.push({ height, time: time.toISOString(), subsidy })
        subsidy = Math.floor(subsidy / 2)
      }
      return { currentHeight, currentTime: time2str(currentTime), past, future }
    },
  },
]

function fix(data) {
  for (const key of Object.keys(data)) {
    // Help GTP to understand
    if (key.includes('time')) {
      data[key] = new Date(data[key] * 1000).toISOString()
    }

    // Too large
    if (key == 'tx') {
      data[key] = data[key].length
    }
  }
  return data
}

export async function rpc(method, params = []) {
  // console.log(`\t# bitcoin-cli ${method.toLowerCase()} ${params.join(' ')}`)

  let credentials = ''

  if (process.env.RPC_USER && process.env.RPC_PASS) {
    const user = process.env.RPC_USER
    const pass = process.env.RPC_PASS
    credentials = `${user}:${pass}@`
  } else {
    try {
      const home = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']

      const [user, pass] = readFileSync(
        `${home}/.bitcoin/.cookie` || process.env.RPC_COOKIE_PATH,
        'utf8',
      ).split(':')
      credentials = `${user}:${pass}@`
    } catch (e) {
      console.error(e)
    }
  }

  const host = process.env.RPC_HOST || 'localhost'
  const port = process.env.RPC_PORT || 8332
  const url = `http://${credentials}${host}:${port}`

  const dataString = `{"jsonrpc":"1.0","id":"X","method":"${method.toLowerCase()}","params":${JSON.stringify(
    params,
  )}}`

  const options = {
    url,
    method: 'POST',
    headers: {
      'content-type': 'text/plain;',
    },
    body: dataString,
  }

  return new Promise(function (resolve, reject) {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        try {
          const data = JSON.parse(body)
          resolve(data.result)
        } catch {
          resolve(body)
        }
      } else {
        reject([error, response?.statusCode])
      }
    })
  })
}
