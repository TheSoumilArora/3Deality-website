import { Truck } from "lucide-react"
import { formatINR } from "@/lib/money"

export default function FreeShipBanner({ rupeeSubtotal }: { rupeeSubtotal: number }) {
  const left = 1000 - rupeeSubtotal
  if (left <= 0) return null            // already eligible → nothing

  return (
    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-sm">
      <Truck className="w-4 h-4 text-primary" />
      <span>
        Add {formatINR(left)} more for <b>FREE shipping</b>!
      </span>
    </div>
  )
}