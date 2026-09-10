import { z } from 'zod';
import { personalInfoSchema } from './personalInfoSchema';
import { coApplicantSchema } from './coApplicantSchema';
import { propertySchema } from './propertySchema';

function isNotFutureDate(dateString: string): boolean {
  return new Date(dateString) <= new Date();
}

const employmentInfoSchema = z.object({
  employmentStatus: z.enum(['employed', 'self-employed'], {
    message: 'Please select your employment status',
  }),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  businessName: z.string().optional(),
  yearsInOperation: z.string().optional(),
  monthlyIncome: z
    .string()
    .min(1, 'Monthly income is required')
    .refine(
      (val) => Number(val) > 0,
      'Monthly income must be a positive number'
    ),
  employmentStartDate: z
    .string()
    .min(1, 'Employment start date is required')
    .refine(isNotFutureDate, 'Employment start date cannot be a future date'),
});

export const mortgageFormSchema = personalInfoSchema
  .extend(employmentInfoSchema.shape)
  .extend(coApplicantSchema.shape)
  .extend(propertySchema.shape)
  .superRefine((data, ctx) => {
    if (data.employmentStatus === 'employed') {
      if (!data.employerName)
        ctx.addIssue({
          code: 'custom',
          message: 'Employer name is required',
          path: ['employerName'],
        });
      if (!data.jobTitle)
        ctx.addIssue({
          code: 'custom',
          message: 'Job title is required',
          path: ['jobTitle'],
        });
    }
    if (data.employmentStatus === 'self-employed') {
      if (!data.businessName)
        ctx.addIssue({
          code: 'custom',
          message: 'Business name is required',
          path: ['businessName'],
        });
      if (!data.yearsInOperation)
        ctx.addIssue({
          code: 'custom',
          message: 'Years in operation is required',
          path: ['yearsInOperation'],
        });
    }

    if (data.applicationType === 'joint') {
      if (!data.coApplicantName) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant name is required',
          path: ['coApplicantName'],
        });
      }
      if (!data.coApplicantEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant email is required',
          path: ['coApplicantEmail'],
        });
      } else if (!/^\S+@\S+\.\S+$/.test(data.coApplicantEmail)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please enter a valid email address',
          path: ['coApplicantEmail'],
        });
      } else if (data.coApplicantEmail === data.email) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant email must be different from your own',
          path: ['coApplicantEmail'],
        });
      }
      if (!data.relationshipToPrimary) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select the relationship to the applicant',
          path: ['relationshipToPrimary'],
        });
      }
      if (Number(data.downPayment) >= Number(data.purchasePrice)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Down payment must be less than the purchase price',
          path: ['downPayment'],
        });
      }
    }
  });

export type MortgageFormValues = z.infer<typeof mortgageFormSchema>;
