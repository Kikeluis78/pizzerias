"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Swal from "sweetalert2"
import { paquetes } from "@/config/menu.config"

export default function PaquetesPage() {
  const { addItem } = useCart()

  const handleAddToCart = (pkg: (typeof paquetes)[0]) => {
    addItem({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      quantity: 1,
      image: pkg.image,
      description: pkg.description,
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${pkg.name} ha sido agregado al carrito`,
      timer: 2000,
      showConfirmButton: false,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Paquetes Especiales</h1>
          <p className="text-muted-foreground">
            Disfruta de nuestros paquetes especiales con las mejores combinaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paquetes.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                  <Button onClick={() => handleAddToCart(pkg)} className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
