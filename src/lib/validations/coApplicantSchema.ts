import { z } from 'zod';

export const coApplicantSchema = z.object({
  coApplicantName: z.string().optional(),
  coApplicantEmail: z.string().optional(),
  relationshipToPrimary: z.string().optional(),
});

export type CoApplicantValues = z.infer<typeof coApplicantSchema>;
