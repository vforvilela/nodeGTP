export const functions = [
  {
    name: 'getPrice',
    description: 'get bitcoin price in currency',
    parameters: {
      type: 'object',
      properties: {
        currency: { type: 'string', enum: ['USDT', 'EUR', 'GBP', 'JPY', 'KRW', 'CNY', 'RUB'] },
        timestamp: { type: 'integer', description: 'unix timestamp' },
      },
    },
    run: async ({ currency, timestamp }) => {
      if (!currency || currency == 'USD') currency = 'USDT'

      if (!timestamp) {
        const url = `https://api.binance.com/api/v3/ticker/price?symbol=BTC${currency}`
        console.log(`\t# ${url}`)
        const { price } = await fetch(url).then((res) => res.json())

        return `${price.toLocaleString()} ${currency}`
      }

      const url = `https://api.binance.com/api/v3/klines?symbol=BTC${currency}&interval=1h&startTime=${
        timestamp * 1000
      }&endTime=${timestamp * 1000}`
      console.log(`\t# ${url}`)

      const [[_, price]] = await fetch(url).then((res) => res.json())

      return price
    },
  },
]
