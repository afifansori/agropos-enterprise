export interface StockAdjustment {
  id: string
  referenceNumber: string
  productId: string
  productName: string
  batchNumber: string
  branchName: string
  previousStock: number
  adjustedStock: number
  reason: 'rusak' | 'hilang' | 'kedaluwarsa' | 'koreksi_opname'
  adjustedBy: string
  date: string
}

export interface StockTransfer {
  id: string
  transferNumber: string
  sourceBranch: string
  targetBranch: string
  productName: string
  batchNumber: string
  quantity: number
  status: 'draft' | 'in_transit' | 'received' | 'rejected'
  createdAt: string
}

