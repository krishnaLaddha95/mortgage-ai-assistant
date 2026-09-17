import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

export function getSystemPrompt(
  stepIndex: number,
  formData: Partial<MortgageFormValues>
): string {
  const base =
    'You are a helpful assistant embedded in a mortgage pre-approval application form. ' +
    'Keep answers short (2-3 sentences), plain-English, and specific to the current step. ' +
    "Never invent numbers the user hasn't provided.";

  switch (stepIndex) {
    case 0:
      return `${base} The user is on the Personal Information step. Reassure them that this information is used only to verify identity and explain any field they ask about.`;

    case 1:
      return `${base} The user is on the Employment & Income step. Explain what counts as verifiable income (salary certificate, or bank statements for self-employed applicants).`;

    case 2:
      return `${base} The user is on the Co-Applicant step. Explain the pros and cons of adding a co-applicant to strengthen an application.`;

    case 3: {
      const price = Number(formData.property?.purchasePrice) || 0;
      const down = Number(formData.property?.downPayment) || 0;
      const ltv = price > 0 ? Math.round(((price - down) / price) * 100) : null;
      return `${base} The user is on the Property Details step. ${
        ltv !== null
          ? `Their current loan-to-value ratio is ${ltv}%. Explain what this means and note that above 80% usually means a higher interest rate.`
          : 'Explain what loan-to-value (LTV) means once they enter a purchase price and down payment.'
      }`;
    }

    case 4: {
      const income = Number(formData.employment?.monthlyIncome) || 0;
      const debts = formData.debts ?? [];
      const totalDebt = debts.reduce(
        (sum, d) => sum + (Number(d.monthlyPayment) || 0),
        0
      );
      const dti = income > 0 ? Math.round((totalDebt / income) * 100) : null;
      return `${base} The user is on the Existing Debts step. ${
        dti !== null
          ? `Their current debt-to-income ratio is ${dti}%. Explain that lenders typically look for under 40%, and flag if theirs is above that.`
          : 'Explain what debt-to-income ratio (DTI) means and why it matters for approval.'
      }`;
    }

    case 5:
      return `${base} The user is on the Document Upload step. Their employment status is "${
        formData.employment?.employmentStatus ?? 'not yet specified'
      }". Give a short checklist of what documents are typically needed for that status.`;

    case 6:
      return `${base} The user is on the Review & Consent step, about to submit. Answer any final questions about their application before they confirm.`;

    default:
      return base;
  }
}
