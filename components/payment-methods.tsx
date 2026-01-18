"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, Banknote, Building2, Copy, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

type PaymentMethod = "card" | "voucher" | "cash" | "transfer"

export function PaymentMethods() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [cashAmount, setCashAmount] = useState("")
  const [transferFolio, setTransferFolio] = useState("")
  const [copiedCLABE, setCopiedCLABE] = useState(false)
  const [copiedFolio, setCopiedFolio] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon")
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon))
    }

    const handleStorageChange = () => {
      const updatedCoupon = localStorage.getItem("appliedCoupon")
      if (updatedCoupon) {
        setAppliedCoupon(JSON.parse(updatedCoupon))
      } else {
        setAppliedCoupon(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return (getTotal() * appliedCoupon.discount) / 100
  }

  const getFinalTotal = () => {
    return getTotal() - calculateDiscount()
  }

  const CLABE = "123456789012345678"

  const generateFolio = () => {
    if (!transferFolio) {
      const folio = Math.random().toString(36).substring(2, 10).toUpperCase()
      setTransferFolio(folio)
    }
  }

  const copyToClipboard = async (text: string, type: "clabe" | "folio") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "clabe") {
        setCopiedCLABE(true)
        setTimeout(() => setCopiedCLABE(false), 2000)
      } else {
        setCopiedFolio(true)
        setTimeout(() => setCopiedFolio(false), 2000)
      }
    } catch (err) {
      console.error("[v0] Failed to copy:", err)
    }
  }

  const handleFinishOrder = () => {
    if (!paymentMethod) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un método de pago",
        text: "Debes elegir cómo deseas pagar tu pedido",
      })
      return
    }

    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Agrega productos a tu carrito",
      })
      return
    }

    if (paymentMethod === "cash" && cashAmount) {
      const amount = Number.parseFloat(cashAmount)
      const total = getFinalTotal()
      if (amount < total) {
        Swal.fire({
          icon: "error",
          title: "Cantidad insuficiente",
          text: `El monto debe ser al menos $${total.toFixed(2)}`,
        })
        return
      }
    }

    localStorage.setItem("selectedPaymentMethod", paymentMethod)
    if (paymentMethod === "cash" && cashAmount) {
      localStorage.setItem("cashAmount", cashAmount)
    }
    if (paymentMethod === "transfer" && transferFolio) {
      localStorage.setItem("transferFolio", transferFolio)
    }

    router.push("/confirmar-pedido")
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
        <CardDescription>Selecciona cómo deseas pagar tu pedido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod || ""} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
          {/* Credit/Debit Card */}
          <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium text-card-foreground">Tarjeta de Débito/Crédito</span>
            </Label>
          </div>

          {/* Electronic Vouchers */}
          <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
            <RadioGroupItem value="voucher" id="voucher" />
            <Label htmlFor="voucher" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-medium text-card-foreground">Vales Electrónicos</span>
            </Label>
          </div>

          {/* Cash */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
                <Banknote className="h-5 w-5 text-primary" />
                <span className="font-medium text-card-foreground">Efectivo</span>
              </Label>
            </div>

            {paymentMethod === "cash" && (
              <Card className="border-primary/50">
                <CardContent className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-card-foreground">Nota:</strong> Se aceptan billetes de hasta $1000
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="cashAmount">¿Con cuánto vas a pagar?</Label>
                    <Input
                      id="cashAmount"
                      type="number"
                      placeholder="$500, $200, $100"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                    />
                  </div>
                  {cashAmount && (
                    <p className="text-sm text-primary font-medium">
                      Cambio: ${Number.parseFloat(cashAmount) - getFinalTotal()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Transfer */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
              <RadioGroupItem
                value="transfer"
                id="transfer"
                onClick={() => {
                  generateFolio()
                }}
              />
              <Label htmlFor="transfer" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-medium text-card-foreground">Transferencia</span>
              </Label>
            </div>

            {paymentMethod === "transfer" && (
              <Card className="border-primary/50">
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>CLABE Interbancaria</Label>
                    <div className="flex gap-2">
                      <Input value={CLABE} readOnly className="font-mono" />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(CLABE, "clabe")}
                      >
                        {copiedCLABE ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Folio de Referencia</Label>
                    <div className="flex gap-2">
                      <Input value={transferFolio} readOnly className="font-mono font-bold" />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(transferFolio, "folio")}
                      >
                        {copiedFolio ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usa este folio al realizar la transferencia para rastrear tu pago
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </RadioGroup>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">${getTotal()}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Descuento ({appliedCoupon.discount}%):</span>
              <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">GRATIS</span>
          </div>

          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span className="text-card-foreground">Total a Pagar:</span>
            <span className="text-primary">${getFinalTotal().toFixed(2)}</span>
          </div>

          <Button onClick={handleFinishOrder} className="w-full" size="lg">
            Finalizar Pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
