"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Home, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export function ServiceSelector() {
  const [serviceType, setServiceType] = useState<"delivery" | "restaurant" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (serviceType === "delivery") {
      router.push("/direccion")
    } else if (serviceType === "restaurant") {
      Swal.fire({
        title: "¿Qué deseas ordenar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Pizzas 2x1",
        cancelButtonText: "Paquetes",
        confirmButtonColor: "#ea580c",
        cancelButtonColor: "#f97316",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/2x1")
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          router.push("/paquetes")
        }
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona tu servicio</CardTitle>
        <CardDescription>Elige cómo deseas recibir tu pedido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={serviceType || ""}
          onValueChange={(value) => setServiceType(value as "delivery" | "restaurant")}
        >
          <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Servicio a Domicilio</p>
                <p className="text-sm text-muted-foreground">Recibe tu pedido en tu dirección</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors cursor-pointer">
            <RadioGroupItem value="restaurant" id="restaurant" />
            <Label htmlFor="restaurant" className="flex items-center gap-3 cursor-pointer flex-1 font-normal">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Recoger en Restaurante</p>
                <p className="text-sm text-muted-foreground">Pasa por tu pedido a la sucursal</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <Button onClick={handleContinue} disabled={!serviceType} className="w-full" size="lg">
          Continuar
        </Button>
      </CardContent>
    </Card>
  )
}
