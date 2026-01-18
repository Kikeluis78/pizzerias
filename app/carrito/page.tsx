"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShoppingCartView } from "@/components/shopping-cart-view"
import { PaymentMethods } from "@/components/payment-methods"

export default function CarritoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Carrito de Compras</h1>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ShoppingCartView />
            </div>
            <div>
              <PaymentMethods />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
