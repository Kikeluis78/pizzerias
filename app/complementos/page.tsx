"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComplementoCard } from "@/components/complemento-card"
import { complementos } from "@/config/menu.config"

export default function ComplementosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Complementos</h1>
            <p className="text-muted-foreground text-lg">Acompaña tu pedido con bebidas y spaguetti</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Bebidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complementos.bebidas.map((item) => (
                  <ComplementoCard key={item.id} complemento={item} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Spaguetti</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complementos.spaguetti.map((item) => (
                  <ComplementoCard key={item.id} complemento={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
