"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Swal from "sweetalert2"
import {pizzas2x1,complementos} from "@/config/menu2x1.config"


interface ProductCarouselProps {
  category?: "2x1" | "complementos"
}

export function ProductCarousel({ category = "2x1" }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")
  const { addItem } = useCart()

  const products = category === "2x1" ? pizzas2x1 : complementos

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    const price = "sizes" in product ? product.sizes[selectedSize] : product.price
    const itemName = "sizes" in product ? `${product.name} (${selectedSize})` : product.name

    addItem({
      id: `${product.id}-${selectedSize}`,
      name: itemName,
      description: product.description,
      price,
      image: "image" in product ? product.image : "/delicious-pizza.png",
    })

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${itemName} ha sido agregado`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    })
  }

  const visibleProducts = [
    products[(currentIndex - 1 + products.length) % products.length],
    products[currentIndex],
    products[(currentIndex + 1) % products.length],
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">
          {category === "2x1" ? "Pizzas 2x1 - Especialita Della Casa" : "Paquetes de Spaguetti"}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {category === "2x1" && (
        <div className="flex justify-center gap-2 mb-4">
          {(["CH", "MED", "GDE", "FAM"] as const).map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((product, idx) => (
            <Card
              key={product.id}
              className={`transition-all duration-300 ${idx === 1 ? "md:scale-110 shadow-xl" : "md:scale-95 opacity-70"}`}
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  {category === "2x1" && (
                    <Badge className="absolute top-2 right-2 z-10 bg-green-600" variant="default">
                      2x1
                    </Badge>
                  )}
                  <img
                    src={
                      "image" in product ? product.image : `/placeholder.svg?height=300&width=400&query=${product.name}`
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-card-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-primary">
                      ${"sizes" in product ? product.sizes[selectedSize] : product.price}
                    </span>
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
