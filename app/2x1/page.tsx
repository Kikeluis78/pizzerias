"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Pizza2x1Card } from "@/components/pizza-2x1-card"
import { especialidades2x1 } from "@/config/menu.config"

export default function Pizza2x1Page() {
  // For now, display the first pizza as the default
  // You can later enhance this to filter based on localStorage or route params
  const selectedPizza = especialidades2x1[0]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-red-700 font-bold mb-1">Especialidades 2x1</h1>
            <p className="text-2x1 text-orange-300">Dos pizzas al precio de una</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Pizza2x1Card
              especialidad={selectedPizza}
              allEspecialidades={especialidades2x1.map((e) => e.name)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
