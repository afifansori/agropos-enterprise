export interface CashTransaction {
  id: string
  code: string
  type: 'in' | 'out'
  category: 'penjualan' | 'pembelian' | 'operasional' | 'piutang' | 'hutang' | 'payroll'
  title: string
  amount: number
  date: string
  branchName: string
  status: 'completed' | 'scheduled'
  notes?: string
}

export interface FinancialSummary {
  cashAndBank: number
  revenueMonth: number
  expenseMonth: number
  netProfit: number
  totalPayable: number
  totalReceivable: number
}

