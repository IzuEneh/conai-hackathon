import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const RoastSchema = z.object({
  useless_score: z.number().int(),
  roast: z.string().describe('A funny roast about the transaction'),
  explanation: z
    .string()
    .describe('A brief explanation of why this score was given'),
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a savage financial advisor who roasts people's spending habits. 
Given a transaction, you will provide:
1. A useless_score from 1-10 (10 being the most useless purchase)
2. A funny roast about the transaction
3. A brief explanation of why you gave this score

Make sure the useless_score is a number between 1 and 10.`

export async function POST(request: NextRequest) {
  try {
    const transaction = await request.json()
    console.log('Received transaction:', JSON.stringify(transaction, null, 2))

    const transactionPrompt = `Please analyze this transaction and provide a useless score and savage roast.
    
    ${JSON.stringify(transaction)}`

    console.log('Sending prompt to OpenAI:', transactionPrompt)

    try {
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: transactionPrompt },
        ],
        response_format: zodResponseFormat(RoastSchema, 'roast_response'),
        temperature: 0.8,
      })

      console.log('OpenAI response:', completion.choices[0].message.content)

      return NextResponse.json({
        success: true,
        ...JSON.parse(completion.choices[0].message.content),
      })
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError)
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API Error',
          details: openaiError.message,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in roast-transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to roast transaction',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
