// All your roasting logic goes here

import { Transaction } from '../features/transactions/types'

export interface RoastResult {
  roastScore: number
  roastMessage: string
}

export function roastTransaction(transaction: Transaction): RoastResult {
  // ... rest of your roasting logic
}

export function analyzeAllTransactions(data: { transactions: Transaction[] }) {
  // ... rest of your analysis logic
}
