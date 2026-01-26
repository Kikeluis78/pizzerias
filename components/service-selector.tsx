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
      localStorage.removeItem("selectedAddress")
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
          router.push("/pizzas")
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          router.push("/paquetes")
        }
      })
    }
  }

  return (
    <Card className="overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10 pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Selecciona tu servicio
        </CardTitle>
        <CardDescription className="text-base">Elige cómo deseas recibir tu pedido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <RadioGroup
          value={serviceType || ""}
          onValueChange={(value) => setServiceType(value as "delivery" | "restaurant")}
        >
          <div
            className={`group relative flex items-center space-x-4 space-y-0 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 overflow-hidden ${serviceType === "delivery"
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-md scale-[1.02]"
                : "border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-[1.01]"
              }`}
            onClick={() => setServiceType("delivery")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <RadioGroupItem value="delivery" id="delivery" className="z-10" />
            <Label htmlFor="delivery" className="flex items-center gap-4 cursor-pointer flex-1 font-normal z-10">
              <div className={`flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 ${serviceType === "delivery"
                  ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-lg"
                  : "bg-gradient-to-br from-orange-100 to-red-100 group-hover:from-orange-200 group-hover:to-red-200"
                }`}>
                <Home className={`h-7 w-7 transition-colors duration-300 ${serviceType === "delivery" ? "text-white" : "text-orange-600"
                  }`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground mb-1">Servicio a Domicilio</p>
                <p className="text-sm text-muted-foreground">Recibe tu pedido en tu dirección</p>
              </div>
            </Label>
          </div>

          <div
            className={`group relative flex items-center space-x-4 space-y-0 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 overflow-hidden ${serviceType === "restaurant"
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-md scale-[1.02]"
                : "border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-[1.01]"
              }`}
            onClick={() => setServiceType("restaurant")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <RadioGroupItem value="restaurant" id="restaurant" className="z-10" />
            <Label htmlFor="restaurant" className="flex items-center gap-4 cursor-pointer flex-1 font-normal z-10">
              <div className={`flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 ${serviceType === "restaurant"
                  ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-lg"
                  : "bg-gradient-to-br from-orange-100 to-red-100 group-hover:from-orange-200 group-hover:to-red-200"
                }`}>
                <Store className={`h-7 w-7 transition-colors duration-300 ${serviceType === "restaurant" ? "text-white" : "text-orange-600"
                  }`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground mb-1">Recoger en Restaurante</p>
                <p className="text-sm text-muted-foreground">Pasa por tu pedido a la sucursal</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <Button
          onClick={handleContinue}
          disabled={!serviceType}
          className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          Continuar con mi pedido
        </Button>
      </CardContent>
    </Card>
  )
}
