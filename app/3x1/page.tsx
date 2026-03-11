"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Pizza3x1Card } from "@/components/pizza-3x1-card"
import { especialidades3x1 } from "@/config/menu.config"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function Pizza3x1Page() {
  const router = useRouter()
  const selectedPizza = especialidades3x1[0]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-orange-700 font-bold mb-1">Especialidades 3x1</h1>
            <p className="text-2xl text-orange-300">¡Tres pizzas al precio de una!</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Pizza3x1Card
              especialidad={selectedPizza}
              allEspecialidades={especialidades3x1.map((e) => e.name)}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={() => router.push("/2x1")}
              variant="outline"
              size="lg"
              className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ver Promoción 2x1</span>
            </Button>
            <Button
              onClick={() => router.push("/pizzas")}
              size="lg"
              className="gap-2"
            >
              <span>Volver a Pizzas</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
