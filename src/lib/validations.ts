import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const generatePlanSchema = z.object({
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  topics: z.string().min(5, 'Please provide more details about the topics'),
  examDate: z.date({
    message: "Exam date is required",
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type GeneratePlanFormData = z.infer<typeof generatePlanSchema>
