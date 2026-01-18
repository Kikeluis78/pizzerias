"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SettingsPanel } from "@/components/settings-panel"

export default function AjustesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Ajustes</h1>
          <SettingsPanel />
        </div>
      </main>
      <Footer />
    </>
  )
}
