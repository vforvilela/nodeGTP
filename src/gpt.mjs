import * as dotenv from 'dotenv'
dotenv.config()

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function gpt(messages, functions) {
  const prompt = {
    role: 'system',
    content: `Answer exclusively based on the function call responses.`,
  }

  console.log(messages)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    // temperature: 0,
    messages: [prompt, ...messages],
    functions: functions.map(({ run, ...rest }) => rest),
  })

  const { message, finish_reason } = response.choices[0]

  if (finish_reason === 'function_call') {
    const { name: functionName, arguments: args } = message.function_call

    let functionResponse = 'NOT AVAILABLE'

    try {
      console.log(`\t# ${functionName}(${args.replace(/\s/g, '')})`)

      functionResponse = await functions
        .find(({ name }) => name === functionName)
        .run(JSON.parse(args))

      console.log(functionResponse)
    } catch {}

    messages.push({
      role: 'assistant',
      content: null,
      function_call: {
        name: functionName,
        arguments: args,
      },
    })

    messages.push({
      role: 'function',
      name: functionName,
      content: JSON.stringify(functionResponse),
    })

    return gpt(messages, functions)
  }

  return message.content
}
