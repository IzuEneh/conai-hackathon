export interface Transaction {
  depositTransaction: {
    transactionType: string
    description: string
    amount: number
    debitCreditMemo: 'DEBIT' | 'CREDIT'
    status: string
    transactionTimestamp: string
    payee?: string
  }
}
