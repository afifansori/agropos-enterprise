import React from 'react'
import { Plus, Leaf, AlertCircle, TrendingDown } from 'lucide-react'
import { Product } from '@/types/product'
import { useCartStore } from '@/stores/use-cart-store'

interface PosProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function PosProductCard({ product, onAdd }: PosProductCardProps) {
  const { priceMode } = useCartStore()
  const isOutOfStock = product.totalStock <= 0
  const isLowStock = product.totalStock <= product.minStock
  const showWholesale = priceMode === 'wholesale'

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-4 text-left transition ${
        isOutOfStock
          ? 'cursor-not-allowed border-slate-100 opacity-60 bg-slate-50'
          : 'border-slate-200/80 hover:border-emerald-500 hover:shadow-lg'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
            <Leaf size={19} />
          </div>
          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          SKU: {product.sku}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        {/* Harga Eceran */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Harga Eceran</div>
            <div className={`text-sm font-extrabold ${showWholesale ? 'text-slate-400 line-through' : 'text-[#166534]'}`}>
              Rp {product.sellPrice.toLocaleString('id-ID')}
            </div>
          </div>
          <span
            className={`flex size-8 items-center justify-center rounded-xl transition ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400'
                : 'bg-emerald-50 text-[#166534] group-hover:bg-[#166534] group-hover:text-white'
            }`}
          >
            <Plus size={16} />
          </span>
        </div>

        {/* Harga Grosir */}
        <div className={`mt-1.5 flex items-center gap-1.5 rounded-lg px-2 py-1 ${showWholesale ? 'bg-emerald-50' : 'bg-slate-50'}`}>
          <TrendingDown size={11} className={showWholesale ? 'text-emerald-600' : 'text-slate-400'} />
          <span className={`text-[10px] font-bold ${showWholesale ? 'text-emerald-700' : 'text-slate-400'}`}>
            Grosir ≥{product.wholesaleMinQty} {product.unit}:
          </span>
          <span className={`text-[10px] font-black ${showWholesale ? 'text-emerald-700' : 'text-slate-400'}`}>
            Rp {product.wholesalePrice.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className={`font-semibold flex items-center gap-1 ${
            isOutOfStock
              ? 'text-red-500'
              : isLowStock
              ? 'text-amber-600'
              : 'text-slate-500'
          }`}>
            {isLowStock && !isOutOfStock && <AlertCircle size={12} />}
            Stok: {product.totalStock} {product.unit}
          </span>
          <span className="text-slate-400">FEFO Ready</span>
        </div>
      </div>
    </button>
  )
}
