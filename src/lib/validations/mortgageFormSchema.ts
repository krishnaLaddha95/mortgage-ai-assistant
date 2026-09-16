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

const debtSchema = z.object({
  type: z.string().min(1, 'Debt type is required'),
  monthlyPayment: z
    .string()
    .min(1, 'Monthly payment is required')
    .refine(
      (val) => Number(val) > 0,
      'Monthly payment must be a positive number'
    ),
});

const debtsSchema = z.object({
  debts: z.array(debtSchema).optional(),
});

const documentsSchema = z.object({
  idProof: z.array(z.any()).min(1, 'ID proof is required'),
  salaryOrTradeLicence: z.array(z.any()).min(1, 'This document is required'),
  bankStatements: z.array(z.any()).min(1, 'At least one bank statement is required'),
  propertyDocuments: z.array(z.any()).min(1, 'Property documents are required'),
});

export const mortgageFormSchema = z
  .object({
    personalInfo: personalInfoSchema,
    employment: employmentInfoSchema,
    coApplicant: coApplicantSchema.optional(),
    property: propertySchema,
    debts: z.array(debtSchema).optional(),
    documents: documentsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.employment.employmentStatus === 'employed') {
      if (!data.employment.employerName)
        ctx.addIssue({
          code: 'custom',
          message: 'Employer name is required',
          path: ['employerName'],
        });
      if (!data.employment.jobTitle)
        ctx.addIssue({
          code: 'custom',
          message: 'Job title is required',
          path: ['jobTitle'],
        });
    }
    if (data.employment.employmentStatus === 'self-employed') {
      if (!data.employment.businessName)
        ctx.addIssue({
          code: 'custom',
          message: 'Business name is required',
          path: ['businessName'],
        });
      if (!data.employment.yearsInOperation)
        ctx.addIssue({
          code: 'custom',
          message: 'Years in operation is required',
          path: ['yearsInOperation'],
        });
    }

    if (data.personalInfo.applicationType === 'joint' && data.coApplicant) {
      if (!data.coApplicant.coApplicantName) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant name is required',
          path: ['coApplicantName'],
        });
      }
      if (!data.coApplicant.coApplicantEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant email is required',
          path: ['coApplicantEmail'],
        });
      } else if (!/^\S+@\S+\.\S+$/.test(data.coApplicant.coApplicantEmail)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please enter a valid email address',
          path: ['coApplicantEmail'],
        });
      } else if (data.coApplicant.coApplicantEmail === data.personalInfo.email) {
        ctx.addIssue({
          code: 'custom',
          message: 'Co-applicant email must be different from your own',
          path: ['coApplicantEmail'],
        });
      }
      if (!data.coApplicant.relationshipToPrimary) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select the relationship to the applicant',
          path: ['relationshipToPrimary'],
        });
      }
      if (Number(data.property.downPayment) >= Number(data.property.purchasePrice)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Down payment must be less than the purchase price',
          path: ['downPayment'],
        });
      }
    }
  });

export type MortgageFormValues = z.infer<typeof mortgageFormSchema>;
