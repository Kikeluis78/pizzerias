"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const packages = [
  {
    id: "pkg-1",
    name: "Paquete Familiar",
    description: "Pizza Grande + Bebida 2L",
    image: "/family-pizza-package-with-drinks.jpg",
    price: 399,
  },
  {
    id: "pkg-2",
    name: "Paquete Pareja",
    description: "Pizza Mediana + 2 Refrescos",
    image: "/two-for-one-pizza-deal.jpg",
    price: 299,
  },
  {
    id: "pkg-3",
    name: "Paquete Corazón",
    description: "Pizza en Forma de Corazón + Bebida",
    image: "/heart-shaped-pizza.jpg",
    price: 349,
  },
]

export function PackageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % packages.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + packages.length) % packages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % packages.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <Card className="border-2">
          <CardContent className="p-0">
            <div className="relative aspect-video md:aspect-[21/9]">
              <Image
                src={packages[currentIndex].image || "/placeholder.svg"}
                alt={packages[currentIndex].name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{packages[currentIndex].name}</h3>
                <p className="text-lg mb-2">{packages[currentIndex].description}</p>
                <p className="text-3xl font-bold text-primary">${packages[currentIndex].price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="flex justify-center gap-2 mt-4">
        {packages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
