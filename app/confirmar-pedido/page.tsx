"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, CreditCard, ShoppingBag, MessageCircle, CheckCircle, X, User, Hash } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { pizzeriaConfig } from "@/config/pizzeria.config"

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

// Función para generar folio único
const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetter = letters[Math.floor(Math.random() * letters.length)]
  
  return `ORD-${randomLetter}${timestamp}${random}`
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
  const [orderId, setOrderId] = useState<string>("") // <-- NUEVO: Folio único

  // ========== EFFECTS ==========
  useEffect(() => {
    setMounted(true)
    // Generar folio único al montar el componente
    setOrderId(generateOrderId())
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userAccount = localStorage.getItem("userAccount")
    if (!userAccount) {
      setIsGuest(true)
    }

    // Cargar datos guardados
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

  // ========== CÁLCULOS ==========
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

  // ========== MENSAJE WHATSAPP ==========
  const generateWhatsAppMessage = () => {
    const userAccount = localStorage.getItem("userAccount")
    let user

    if (isGuest) {
      user = guestData
    } else {
      user = userAccount ? JSON.parse(userAccount) : { name: "Cliente", phone: "" }
    }

    let message = `*🍕 NUEVO PEDIDO - ${pizzeriaConfig.nombre.toUpperCase()}*\n\n`
    message += `*📋 FOLIO:* ${orderId}\n` // <-- NUEVO: Agregar folio
    message += `*Cliente:* ${user.name}\n`
    message += `*Teléfono:* ${user.phone || address?.phone || "No especificado"}\n\n`

    message += `*📦 PRODUCTOS:*\n`
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      if (item.description) {
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

    message += `\n*📅 FECHA Y HORA:* ${new Date().toLocaleString("es-MX")}`
    message += `\n_Folio generado automáticamente: ${orderId}_`

    return message
  }

  // ========== HANDLERS ==========
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
    // Validar datos de invitado
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

    // Guardar pedido en localStorage (opcional, para historial)
    const orderData = {
      id: orderId,
      items,
      total: getFinalTotal(),
      date: new Date().toISOString(),
      customer: isGuest ? guestData : JSON.parse(localStorage.getItem("userAccount") || '{}'),
      address,
      paymentMethod,
      coupon: appliedCoupon
    }

    // Guardar en historial de pedidos
    const ordersHistory = JSON.parse(localStorage.getItem("ordersHistory") || "[]")
    ordersHistory.push(orderData)
    localStorage.setItem("ordersHistory", JSON.stringify(ordersHistory))

    // Generar y enviar mensaje por WhatsApp
    const phoneNumber = pizzeriaConfig.whatsapp.replace(/\s+/g, '')
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, "_blank")

    // Limpiar datos
    clearCart()
    localStorage.removeItem("selectedAddress")
    localStorage.removeItem("selectedPaymentMethod")
    localStorage.removeItem("cashAmount")
    localStorage.removeItem("transferFolio")
    localStorage.removeItem("appliedCoupon")

    // Mostrar confirmación con folio
    Swal.fire({
      icon: "success",
      title: "¡Pedido Enviado!",
      html: `
        <div class="text-center">
          <p>Tu pedido ha sido enviado por WhatsApp</p>
          <p class="mt-2 font-bold text-lg text-primary">Folio: ${orderId}</p>
          <p class="text-sm text-muted-foreground mt-1">Guarda este folio para seguimiento</p>
        </div>
      `,
      confirmButtonText: "Volver al inicio",
    }).then(() => {
      router.push("/home")
    })
  }

  // ========== RENDER CONDICIONAL ==========
  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  // ========== COMPONENTES ==========
  const OrderHeader = () => (
    <Card className="mb-6 border-dashed border-primary">
      <CardHeader className="bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Folio del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-primary tracking-wider">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-1">Este folio será tu referencia de seguimiento</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(orderId)
              Swal.fire({
                icon: 'success',
                title: 'Copiado',
                text: 'Folio copiado al portapapeles',
                timer: 1500,
                showConfirmButton: false
              })
            }}
          >
            Copiar Folio
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const GuestDataForm = () => (
    <Card className="border-primary mb-6">
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
  )

  const UserInfoSection = () => {
    // Si ya tenemos dirección con nombre, usamos eso
    if (address?.userName) {
      return (
        <Card className="mb-6 border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nombre</Label>
                <p className="font-medium text-lg">{address.userName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</Label>
                <p className="font-medium text-lg">{address.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Si es invitado y no hay dirección (ej. recoger en tienda), mostramos formulario
    if (isGuest) {
      return <GuestDataForm />
    }

    // Si hay cuenta de usuario pero no dirección seleccionada (raro pero posible)
    const userAccount = localStorage.getItem("userAccount")
    if (userAccount) {
      const user = JSON.parse(userAccount)
      return (
        <Card className="mb-6 border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nombre</Label>
                <p className="font-medium text-lg">{user.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</Label>
                <p className="font-medium text-lg">{user.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  const OrderSummary = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Detalle del Pedido
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
  )

  const PaymentMethod = () => (
    <Card className="mb-6">
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
  )

  const DeliveryAddress = () => {
    if (!address) return null
    
    return (
      <Card className="mb-6">
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
    )
  }

  const ConfirmationButtons = () => (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Verifica antes de Enviar Pedido
        </CardTitle>
        <CardDescription>
          ¡Una vez enviado tu pedido no hay cambios!<br/>
          <span className="font-semibold text-primary">Folio: {orderId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleConfirmOrder} className="w-full" size="lg">
          <MessageCircle className="h-5 w-5 mr-2" />
          Confirmar y Enviar por WhatsApp
        </Button>
        <Button onClick={handleCancelOrder} variant="outline" className="w-full bg-transparent" size="lg">
          <X className="h-5 w-5 mr-2 text-red-700" />
          Cancelar Pedido
        </Button>
      </CardContent>
    </Card>
  )

  // ========== RENDER PRINCIPAL ==========
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Confirmar Pedido</h1>
              <p className="text-muted-foreground">Revisa todos los detalles antes de enviar</p>
            </div>
          </div>

          {/* Secciones en orden lógico */}
          <div className="space-y-6">
            {/* 0. Folio del pedido */}
            <OrderHeader />

            {/* 1. Datos del cliente (Dinámico: Formulario o Info estática) */}
            <UserInfoSection />

            {/* 2. Detalle del pedido */}
            <OrderSummary />

            {/* 3. Método de pago */}
            <PaymentMethod />

            {/* 4. Dirección de entrega */}
            <DeliveryAddress />

            {/* 5. Botones de confirmación */}
            <ConfirmationButtons />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}