import { z } from 'zod';

function isAtLeast18(dateString: string): boolean {
  const dob = new Date(dateString);
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return dob <= eighteenYearsAgo;
}

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isAtLeast18, 'You must be at least 18 years old'),
  nationality: z.string().min(1, 'Please select your nationality'),
  passportNumber: z.string().min(1, 'Passport or ID number is required'),
  email: z
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Please enter a valid phone number'),
  applicationType: z.enum(['individual', 'joint'], {
    message: 'Please select an application type',
  }),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
