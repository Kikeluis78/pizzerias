"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { useState } from "react"
import Swal from "sweetalert2"
import { cupones } from "@/config/menu.config"

export function ShoppingCartView() {
  const { items, updateQuantity, removeItem, getTotal } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const validateCoupon = () => {
    const code = couponCode.toUpperCase().trim()

    if (cupones[code]) {
      const couponData = { code, discount: cupones[code].discount }
      setAppliedCoupon(couponData)
      localStorage.setItem("appliedCoupon", JSON.stringify(couponData))
      Swal.fire({
        title: "Cupón aplicado",
        text: `Has obtenido ${cupones[code].discount}% de descuento`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      Swal.fire({
        title: "Cupón inválido",
        text: "El cupón ingresado no es válido",
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    localStorage.removeItem("appliedCoupon")
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return (getTotal() * appliedCoupon.discount) / 100
  }

  const getFinalTotal = () => {
    return getTotal() - calculateDiscount()
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">Tu carrito está vacío</h3>
          <p className="text-muted-foreground mb-6">Agrega productos para comenzar tu pedido</p>
          <Link href="/home">
            <Button>Ver Productos</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />

            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="text-lg font-bold text-primary mt-2">${item.price}</p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">Cupón de descuento</h3>
          </div>

          {!appliedCoupon ? (
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa tu cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={validateCoupon} variant="outline">
                Aplicar
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {appliedCoupon.code} - {appliedCoupon.discount}% descuento
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-red-600 hover:text-red-700">
                Quitar
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold text-card-foreground">${getTotal()}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-lg text-green-600 dark:text-green-400">
              <span>Descuento ({appliedCoupon.discount}%):</span>
              <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Envío:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">GRATIS</span>
          </div>

          <div className="flex justify-between text-2xl font-bold pt-2 border-t">
            <span className="text-card-foreground">Total:</span>
            <span className="text-primary">${getFinalTotal().toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
