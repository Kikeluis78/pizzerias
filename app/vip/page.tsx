"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles, Gift, Star, Lock } from "lucide-react"

export default function VIPPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-12 w-12 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Zona V.I.P
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Acceso exclusivo a descuentos y cupones especiales
            </p>
          </div>

          <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <Lock className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
                  <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">En Construcción</CardTitle>
              <CardDescription className="text-lg">
                Estamos trabajando en una experiencia exclusiva para nuestros clientes V.I.P
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Gift className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Descuentos Exclusivos</h3>
                  <p className="text-sm text-muted-foreground">
                    Obtén descuentos especiales solo para miembros V.I.P
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Star className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Cupones Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Accede a cupones exclusivos no disponibles para el público general
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Beneficios Únicos</h3>
                  <p className="text-sm text-muted-foreground">
                    Disfruta de beneficios especiales por ser cliente V.I.P
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t text-center">
                <p className="text-muted-foreground mb-4">
                  La zona V.I.P estará disponible próximamente. 
                  <br />
                  Mantente al tanto de nuestras actualizaciones.
                </p>
                <Button 
                  onClick={() => window.history.back()} 
                  variant="outline"
                  className="border-2"
                >
                  Volver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
