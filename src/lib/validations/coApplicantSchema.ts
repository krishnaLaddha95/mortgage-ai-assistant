import { z } from 'zod';
import { personalInfoSchema } from './personalInfoSchema';

export const coApplicantSchema = z.object({
  coApplicantName: z.string().min(1, 'Co-applicant name is required'),
  coApplicantEmail: z
    .string()
    .min(1, 'Co-applicant email is required')
    .email('Please enter a valid email address'),
  relationshipToPrimary: z
    .string()
    .min(1, 'Relationship to primary applicant is required'),
});

export type CoApplicantValues = z.infer<typeof coApplicantSchema>;
