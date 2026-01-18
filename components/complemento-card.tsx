"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import Swal from "sweetalert2"
import { ShoppingCart } from "lucide-react"

interface ComplementoCardProps {
  complemento: {
    id: string
    name: string
    price: number
    description: string
  }
}

export function ComplementoCard({ complemento }: ComplementoCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: complemento.id,
      name: complemento.name,
      description: complemento.description,
      price: complemento.price,
      image: "/placeholder.svg?height=100&width=100",
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${complemento.name} ha sido agregado`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    })
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{complemento.name}</CardTitle>
        {complemento.description && <p className="text-sm text-muted-foreground">{complemento.description}</p>}
      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="flex flex-col gap-2">
        <div className="text-2xl font-bold text-primary text-center w-full">${complemento.price}</div>
        <Button onClick={handleAddToCart} className="w-full" size="lg">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
