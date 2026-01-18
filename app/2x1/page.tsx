"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Pizza2x1Card } from "@/components/pizza-2x1-card"
import { especialidades2x1 } from "@/config/menu.config"

export default function Pizza2x1Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-red-700 font-bold mb-1">Especialidades 2x1</h1>
            <p className="text-2x1 text-orange-300">Dos pizzas al precio de una</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {especialidades2x1.map((especialidad) => (
              <Pizza2x1Card
                key={especialidad.name}
                especialidad={especialidad}
                allEspecialidades={especialidades2x1.map((e) => e.name)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
