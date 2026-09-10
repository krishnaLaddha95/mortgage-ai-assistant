import z from 'zod';

export const propertySchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  location: z.string().min(1, 'Location is required'),
  purchasePrice: z
    .string()
    .min(1, 'Purchase price is required')
    .refine(
      (val) => Number(val) > 0,
      'Purchase price must be a positive number'
    ),
  downPayment: z
    .string()
    .min(1, 'Down payment is required')
    .refine((val) => Number(val) > 0, 'Down payment must be a positive number'),
});

export type PropertyValues = z.infer<typeof propertySchema>;
