import Anthropic from '@anthropic-ai/sdk'
import type { ExamKeywords } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface GenerateQuestionsParams {
  difficulty1: number
  difficulty2: number
  targetLevel: string
  keywords: ExamKeywords
  criteria: string
  actualQuestions: { content: string; category: string; difficulty: number }[]
}

export async function generateExamQuestions(params: GenerateQuestionsParams) {
  const { difficulty1, difficulty2, targetLevel, keywords, criteria, actualQuestions } = params

  const session1Count = 7
  const session2Count = difficulty2 <= 2 ? 5 : 8

  const systemPrompt = `You are an OPIc exam question generator. Generate exam questions in Korean based on the provided keywords and difficulty settings.

Generation criteria:
${criteria}

Rules:
- Self-introduction is always the first question
- Questions should match the selected keywords and difficulty level
- Mix question types: role-play, description, comparison, past experience
- Output ONLY valid JSON array, no markdown
- Target level: ${targetLevel}

Reference actual OPIc questions for style:
${actualQuestions.slice(0, 10).map(q => `- [${q.category}] ${q.content}`).join('\n')}`

  const userPrompt = `Generate ${session1Count + session2Count} OPIc questions in Korean JSON format.

User profile:
- Occupation: ${keywords.occupation || '없음'}
- Student: ${keywords.isStudent ? '예' : '아니오'}
- Residence: ${keywords.residence || '없음'}
- Leisure: ${keywords.leisure?.join(', ') || '없음'}
- Hobbies: ${keywords.hobbies?.join(', ') || '없음'}
- Sports: ${keywords.sports?.join(', ') || '없음'}
- Vacation: ${keywords.vacation?.join(', ') || '없음'}

Session 1 (difficulty ${difficulty1}): ${session1Count} questions (first must be self-introduction)
Session 2 (difficulty ${difficulty2}): ${session2Count} questions

Return JSON array:
[
  {
    "content": "Question text in Korean",
    "category": "Category (자기소개/거주지/여가활동/취미/운동/여행/롤플레이/돌발)",
    "session": 1
  }
]`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Failed to parse questions from Claude response')

  return JSON.parse(jsonMatch[0]) as { content: string; category: string; session: 1 | 2 }[]
}
