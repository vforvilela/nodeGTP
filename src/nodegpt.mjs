import readline from 'readline'
import { gpt } from './gpt.mjs'
import { functions as nodeFunctions } from './node.mjs'
import { functions as priceFunctions } from './price.mjs'

const messages = []
while (true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  const question = await new Promise((resolve) =>
    rl.question('> ', (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
  messages.push({ role: 'user', content: question })

  const answer = await gpt(messages, [
    {
      name: 'getTime',
      description: 'get current time',
      parameters: {
        type: 'object',
        properties: {},
      },
      run: () => new Date().toISOString(),
    },
    ...nodeFunctions,
    ...priceFunctions,
  ])

  console.log('<', answer)
  messages.push({ role: 'assistant', content: answer })
}
