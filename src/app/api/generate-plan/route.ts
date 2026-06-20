import { NextResponse } from 'next/server'
import { generateStudyPlan } from '@/lib/groq'
import { generatePlanSchema } from '@/lib/validations'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Validation
    const { subject, topics, examDate } = generatePlanSchema.parse({
      ...body,
      examDate: new Date(body.examDate)
    })

    const formattedDate = new Date(examDate).toLocaleDateString()
    const plan = await generateStudyPlan(subject, topics, formattedDate)

    return NextResponse.json({ success: true, plan })
  } catch (error: any) {
    console.error('Error generating plan:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
