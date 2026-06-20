import { Groq } from 'groq-sdk'

// Initialize the Groq client
// It will automatically use the GROQ_API_KEY environment variable
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateStudyPlan(subject: string, topics: string, examDate: string) {
  const prompt = `Generate a detailed study plan using:
Subject: ${subject}
Topics: ${topics}
Exam Date: ${examDate}

Requirements:
1. Break into daily schedule.
2. Prioritize difficult topics.
3. Include revision days.
4. Include practice sessions.
5. Include final revision.
6. Provide estimated study hours.

OUTPUT FORMAT (Must exactly follow this pattern for each day):
Day 1:
Topics: [Topics to cover]
Hours: [Number]

Day 2:
Topics: [Topics to cover]
Hours: [Number]
`

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert academic planner and study strategist. Provide direct, formatting-compliant output without any conversational filler.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 2048,
  })

  return chatCompletion.choices[0]?.message?.content || ''
}
