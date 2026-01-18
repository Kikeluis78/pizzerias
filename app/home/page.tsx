"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceSelector } from "@/components/service-selector"
import { PackageCarousel } from "@/components/package-carousel"
import { pizzeriaConfig } from "@/config/pizzeria.config"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-12">
          <section className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">Bienvenido a {pizzeriaConfig.nombre}</h1>
              <p className="text-muted-foreground text-lg">{pizzeriaConfig.slogan}</p>
            </div>

            <PackageCarousel />
          </section>

          <section className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Selecciona tu Servicio</h2>
            <ServiceSelector />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
