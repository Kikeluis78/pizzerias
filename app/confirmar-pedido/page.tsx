"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, CreditCard, ShoppingBag, MessageCircle, CheckCircle, X, User } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface Address {
  userName: string
  addressType: string
  street: string
  number: string
  neighborhood: string
  postalCode: string
  phone: string
  references: string
}

interface GuestData {
  name: string
  phone: string
}

export default function ConfirmarPedidoPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cashAmount, setCashAmount] = useState("")
  const [transferFolio, setTransferFolio] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [guestData, setGuestData] = useState<GuestData>({ name: "", phone: "" })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userAccount = localStorage.getItem("userAccount")
    if (!userAccount) {
      setIsGuest(true)
    }

    const savedAddress = localStorage.getItem("selectedAddress")
    const savedPayment = localStorage.getItem("selectedPaymentMethod")
    const savedCash = localStorage.getItem("cashAmount")
    const savedFolio = localStorage.getItem("transferFolio")
    const savedCoupon = localStorage.getItem("appliedCoupon")

    if (savedAddress) setAddress(JSON.parse(savedAddress))
    if (savedPayment) setPaymentMethod(savedPayment)
    if (savedCash) setCashAmount(savedCash)
    if (savedFolio) setTransferFolio(savedFolio)
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon))

    if (items.length === 0) {
      router.push("/home")
    }
  }, [mounted, items, router])

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return (getTotal() * appliedCoupon.discount) / 100
  }

  const getFinalTotal = () => {
    return getTotal() - calculateDiscount()
  }

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return "Tarjeta de Débito/Crédito"
      case "voucher":
        return "Vales Electrónicos"
      case "cash":
        return "Efectivo"
      case "transfer":
        return "Transferencia Bancaria"
      default:
        return "No especificado"
    }
  }

  const generateWhatsAppMessage = () => {
    const userAccount = localStorage.getItem("userAccount")
    let user

    if (isGuest) {
      user = guestData
    } else {
      user = userAccount ? JSON.parse(userAccount) : { name: "Cliente", phone: "" }
    }

    let message = `*🍕 NUEVO PEDIDO - DELLA CASA*\n\n`
    message += `*Cliente:* ${user.name}\n`
    message += `*Teléfono:* ${user.phone || address?.phone || "No especificado"}\n\n`

    message += `*📦 PRODUCTOS:*\n`
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      if (item.description) {
        // Show description with proper formatting
        const lines = item.description.split("\n")
        lines.forEach((line) => {
          if (line.trim()) {
            message += `   ${line}\n`
          }
        })
      }
      message += `   - Cantidad: ${item.quantity}\n`
      message += `   - Precio unitario: $${item.price}\n`
      message += `   - Subtotal: $${item.price * item.quantity}\n\n`
    })

    message += `*💰 RESUMEN:*\n`
    message += `Subtotal: $${getTotal()}\n`

    if (appliedCoupon) {
      message += `Descuento (${appliedCoupon.code} - ${appliedCoupon.discount}%): -$${calculateDiscount().toFixed(2)}\n`
    }

    message += `Envío: GRATIS\n`
    message += `*TOTAL: $${getFinalTotal().toFixed(2)}*\n\n`

    message += `*💳 MÉTODO DE PAGO:*\n${getPaymentMethodName()}\n`
    if (paymentMethod === "cash" && cashAmount) {
      message += `Pago con: $${cashAmount}\n`
      message += `Cambio: $${(Number.parseFloat(cashAmount) - getFinalTotal()).toFixed(2)}\n`
    }
    if (paymentMethod === "transfer" && transferFolio) {
      message += `Folio de referencia: ${transferFolio}\n`
    }
    message += `\n`

    if (address) {
      message += `*📍 DIRECCIÓN DE ENTREGA:*\n`
      message += `${address.street} #${address.number}\n`
      message += `Colonia: ${address.neighborhood}\n`
      message += `CP: ${address.postalCode}\n`
      message += `Tipo: ${address.addressType}\n`
      if (address.references) {
        message += `Referencias: ${address.references}\n`
      }
    } else {
      message += `*🏪 RECOGER EN RESTAURANTE*\n`
    }

    message += `\n_Pedido realizado: ${new Date().toLocaleString("es-MX")}_`

    return encodeURIComponent(message)
  }

  const handleCancelOrder = () => {
    Swal.fire({
      title: "¿Cancelar pedido?",
      text: "Volverás al carrito de compras",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/carrito")
      }
    })
  }

  const handleConfirmOrder = () => {
    if (isGuest) {
      if (!guestData.name.trim() || !guestData.phone.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Datos incompletos",
          text: "Por favor ingresa tu nombre y teléfono para continuar",
        })
        return
      }
    }

    const phoneNumber = "5215526212166"
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    window.open(whatsappUrl, "_blank")

    clearCart()
    localStorage.removeItem("selectedAddress")
    localStorage.removeItem("selectedPaymentMethod")
    localStorage.removeItem("cashAmount")
    localStorage.removeItem("transferFolio")
    localStorage.removeItem("appliedCoupon")

    Swal.fire({
      icon: "success",
      title: "¡Pedido Enviado!",
      text: "Tu pedido ha sido enviado por WhatsApp correctamente",
      confirmButtonText: "Volver al inicio",
    }).then(() => {
      router.push("/home")
    })
  }

  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Confirmar Pedido</h1>
          </div>

          <div className="space-y-6">
            {isGuest && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Tus Datos
                  </CardTitle>
                  <CardDescription>Ingresa tus datos para completar el pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Nombre completo *</Label>
                    <Input
                      id="guestName"
                      type="text"
                      placeholder="Juan Pérez"
                      value={guestData.name}
                      onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Teléfono *</Label>
                    <Input
                      id="guestPhone"
                      type="tel"
                      placeholder="5512345678"
                      value={guestData.phone}
                      onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">${item.price * item.quantity}</p>
                  </div>
                ))}

                <div className="pt-4 space-y-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">${getTotal()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Descuento ({appliedCoupon.discount}%):</span>
                      <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">GRATIS</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total:</span>
                    <span className="text-primary">${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-card-foreground">{getPaymentMethodName()}</p>
                {paymentMethod === "cash" && cashAmount && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Pagarás con: ${cashAmount}</p>
                    <p>Cambio: ${(Number.parseFloat(cashAmount) - getFinalTotal()).toFixed(2)}</p>
                  </div>
                )}
                {paymentMethod === "transfer" && transferFolio && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Folio de referencia: {transferFolio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold text-card-foreground">{address.userName}</p>
                    <p className="text-muted-foreground">
                      {address.street} #{address.number}
                    </p>
                    <p className="text-muted-foreground">
                      {address.neighborhood}, CP {address.postalCode}
                    </p>
                    <p className="text-muted-foreground capitalize">Tipo: {address.addressType}</p>
                    {address.references && (
                      <p className="text-sm text-muted-foreground mt-2">Referencias: {address.references}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirmar y Enviar Pedido */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Confirmar y Enviar Pedido
                </CardTitle>
                <CardDescription>Tu pedido será enviado directamente por WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleConfirmOrder} className="w-full" size="lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Confirmar
                </Button>
                <Button onClick={handleCancelOrder} variant="outline" className="w-full bg-transparent" size="lg">
                  <X className="h-5 w-5 mr-2" />
                  Cancelar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
