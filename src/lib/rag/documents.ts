export interface RagDocument {
  id: string;
  title: string;
  content: string;
}

export const ragDocuments: RagDocument[] = [
  {
    id: 'ltv-guidance',
    title: 'Understanding Loan-to-Value (LTV) Ratio',
    content: `The loan-to-value ratio compares your loan amount to the property's purchase price. 
It is calculated as (purchase price minus down payment) divided by purchase price. A lower LTV, 
achieved through a larger down payment, generally results in better interest rates and terms. 
Many lenders consider an LTV above 80% higher risk, which can mean a higher interest rate or 
additional requirements such as mortgage insurance. First-time buyers are sometimes offered more 
flexible LTV thresholds than repeat buyers.`,
  },
  {
    id: 'dti-guidance',
    title: 'Understanding Debt-to-Income (DTI) Ratio',
    content: `Debt-to-income ratio measures your total monthly debt payments against your gross 
monthly income. Lenders use this to assess whether you can comfortably take on additional loan 
repayments. Most lenders prefer a DTI below 40%, though thresholds vary by institution and loan 
type. Existing debts such as car loans, credit cards, and personal loans all count toward this 
calculation. Reducing existing debt before applying can improve your DTI and your approval odds.`,
  },
  {
    id: 'required-documents',
    title: 'Documents Typically Required for a Mortgage Application',
    content: `Employed applicants are generally asked for a recent salary certificate, an employment 
contract, and the last three to six months of bank statements. Self-employed applicants typically 
need a valid trade licence, audited financial statements or tax returns, and bank statements covering 
a longer period, often six to twelve months. All applicants usually need a valid passport or national 
ID, and proof of the source of any down payment funds if it comes from savings, a gift, or another asset.`,
  },
  {
    id: 'joint-applications',
    title: 'Joint and Co-Applicant Mortgage Applications',
    content: `Adding a co-applicant, such as a spouse or family member, can combine both applicants' 
incomes to qualify for a larger loan amount or improve approval odds. However, both applicants' credit 
history and existing debts are typically considered, so a co-applicant with significant debt may not 
always improve the outcome. Lenders usually require both applicants to provide full documentation, 
including identification, income proof, and consent to a credit check.`,
  },
  {
    id: 'down-payment',
    title: 'Down Payment Requirements',
    content: `A down payment is the portion of the purchase price paid upfront, not financed through 
the loan. Minimum down payment requirements vary by lender, property type, and buyer status, but a 
larger down payment reduces your loan-to-value ratio and can lead to more favorable loan terms. Funds 
for a down payment can typically come from personal savings, the sale of another asset, or, in some 
cases, a documented gift from a family member.`,
  },
];