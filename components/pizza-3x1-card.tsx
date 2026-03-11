"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/hooks/use-cart"
import Swal from "sweetalert2"
import { Plus } from "lucide-react"

interface Pizza3x1CardProps {
  especialidad: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  }
  allEspecialidades: string[]
}

// Función para calcular precio de orilla
const getEdgeCheesePrice = (size: "CH" | "MED" | "GDE" | "FAM"): number => {
  const prices = { CH: 30, MED: 40, GDE: 50, FAM: 60 }
  return prices[size]
}

// Type guard para CheckedState
const getCheckedValue = (checked: string | boolean): boolean => {
  if (typeof checked === "boolean") return checked
  if (checked === "indeterminate") return false
  return Boolean(checked)
}

export function Pizza3x1Card({ especialidad, allEspecialidades }: Pizza3x1CardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [size, setSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")

  // Primera pizza
  const [pizza1Type, setPizza1Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza1Mitad2, setPizza1Mitad2] = useState("")
  const [pizza1EdgeCheese, setPizza1EdgeCheese] = useState(false)

  // Segunda pizza
  const [pizza2Type, setPizza2Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza2Name, setPizza2Name] = useState("")
  const [pizza2Mitad2, setPizza2Mitad2] = useState("")
  const [pizza2EdgeCheese, setPizza2EdgeCheese] = useState(false)

  // Tercera pizza
  const [pizza3Type, setPizza3Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza3Name, setPizza3Name] = useState("")
  const [pizza3Mitad2, setPizza3Mitad2] = useState("")
  const [pizza3EdgeCheese, setPizza3EdgeCheese] = useState(false)

  // Complementos
  const [selectedComplementos, setSelectedComplementos] = useState<string[]>([])

  const [anotaciones, setAnotaciones] = useState("")

  const isPizzaType = (val: string): val is "completa" | "mitad-y-mitad" => val === "completa" || val === "mitad-y-mitad"

  const price = especialidad.prices[size]
  const mitadYMitadExtra = 25
  const extraTotal = (pizza1Type === "mitad-y-mitad" ? mitadYMitadExtra : 0) + (pizza2Type === "mitad-y-mitad" ? mitadYMitadExtra : 0) + (pizza3Type === "mitad-y-mitad" ? mitadYMitadExtra : 0)
  const edgeCheeseExtra = (pizza1EdgeCheese ? getEdgeCheesePrice(size) : 0) + (pizza2EdgeCheese ? getEdgeCheesePrice(size) : 0) + (pizza3EdgeCheese ? getEdgeCheesePrice(size) : 0)
  const finalPrice = price + extraTotal + edgeCheeseExtra

  const handleAddToCart = () => {
    if (pizza1Type === "mitad-y-mitad" && !pizza1Mitad2) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda mitad de la primera pizza",
      })
      return
    }

    if (!pizza2Name) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda pizza del 3x1",
      })
      return
    }

    if (pizza2Type === "mitad-y-mitad" && !pizza2Mitad2) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda mitad de la segunda pizza",
      })
      return
    }

    if (!pizza3Name) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la tercera pizza del 3x1",
      })
      return
    }

    if (pizza3Type === "mitad-y-mitad" && !pizza3Mitad2) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Selecciona la segunda mitad de la tercera pizza",
      })
      return
    }

    // Build description
    let description = `PROMOCIÓN 3X1 - Tamaño: ${size}\n\n`
    if (extraTotal > 0 || edgeCheeseExtra > 0) {
      description += `💡 Extras:\n`
      if (extraTotal > 0) {
        description += `  • Mitad y mitad: +$${extraTotal}\n`
      }
      if (edgeCheeseExtra > 0) {
        description += `  • Orilla de Queso: +$${edgeCheeseExtra}\n`
      }
    }

    description += `\n🔴 Primera Pizza: ${especialidad.name}\n`
    if (pizza1Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${especialidad.name}\n`
      description += `  • ${pizza1Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }
    if (pizza1EdgeCheese) {
      description += `  🧀 Orilla de Queso: +$${getEdgeCheesePrice(size)}\n`
    }

    description += `\n🔴 Segunda Pizza: ${pizza2Name}\n`
    if (pizza2Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${pizza2Name}\n`
      description += `  • ${pizza2Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }
    if (pizza2EdgeCheese) {
      description += `  🧀 Orilla de Queso: +$${getEdgeCheesePrice(size)}\n`
    }

    description += `\n🔴 Tercera Pizza: ${pizza3Name}\n`
    if (pizza3Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${pizza3Name}\n`
      description += `  • ${pizza3Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }
    if (pizza3EdgeCheese) {
      description += `  🧀 Orilla de Queso: +$${getEdgeCheesePrice(size)}\n`
    }

    if (anotaciones.trim()) {
      description += `\n📝 Anotaciones: ${anotaciones}`
    }

    if (selectedComplementos.length > 0) {
      description += `\n\n🥤 Complementos: ${selectedComplementos.join(", ")}`
    }

    const cleanId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const p1Part = pizza1Type === "mitad-y-mitad" ? `${cleanId(especialidad.name)}-${cleanId(pizza1Mitad2)}` : cleanId(especialidad.name)
    const p1EdgePart = pizza1EdgeCheese ? `-edge1` : ''
    const p2Part = pizza2Type === "mitad-y-mitad" ? `${cleanId(pizza2Name)}-${cleanId(pizza2Mitad2)}` : cleanId(pizza2Name)
    const p2EdgePart = pizza2EdgeCheese ? `-edge2` : ''
    const p3Part = pizza3Type === "mitad-y-mitad" ? `${cleanId(pizza3Name)}-${cleanId(pizza3Mitad2)}` : cleanId(pizza3Name)
    const p3EdgePart = pizza3EdgeCheese ? `-edge3` : ''
    const notesPart = anotaciones.trim() ? `-${cleanId(anotaciones)}` : ''
    
    const deterministicId = `3x1-${size}-${p1Part}${p1EdgePart}-${p2Part}${p2EdgePart}-${p3Part}${p3EdgePart}${notesPart}`

    addItem({
      id: deterministicId,
      name: `3x1: ${especialidad.name} + ${pizza2Name} + ${pizza3Name}`,
      description,
      price: finalPrice,
      image: "/delicious-pizza.png",
    })

    // Add complementos as separate items
    selectedComplementos.forEach((comp) => {
      if (comp.includes("Refresco 2L")) {
        addItem({
          id: `comp-refresco-2lt-${Date.now()}`,
          name: "Refresco de Sabor 2 Lts",
          description: "",
          price: 45,
          image: "/placeholder.svg?height=100&width=100",
        })
      } else if (comp.includes("Coca Cola")) {
        addItem({
          id: `comp-coca-${Date.now()}`,
          name: "Coca Cola 2 Lts",
          description: "",
          price: 49,
          image: "/placeholder.svg?height=100&width=100",
        })
      } else if (comp.includes("Lata")) {
        addItem({
          id: `comp-lata-${Date.now()}`,
          name: "Refresco de Lata",
          description: "",
          price: 28,
          image: "/placeholder.svg?height=100&width=100",
        })
      }
    })

    Swal.fire({
      icon: "success",
      title: "¡Agregado al carrito!",
      text: "Tu promoción 3x1 se ha agregado correctamente",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      router.push("/carrito")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Promoción 3x1</span>
          <Badge variant="default" className="ml-2">Tres pizzas al precio de una</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Tamaño */}
        <div>
          <Label className="text-base font-semibold mb-2 block">Tamaño</Label>
          <RadioGroup value={size} onValueChange={(val) => val && setSize(val as any)}>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(especialidad.prices).map(([key, value]) => (
                <div key={key}>
                  <RadioGroupItem value={key} id={`size-${key}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${key}`}
                    className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground flex h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-input bg-muted transition-all hover:bg-accent"
                  >
                    <span className="font-bold">{key}</span> ${value}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Primera Pizza */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-red-500">Primera Pizza (3x1)</Label>

          <div>
            <Label className="text-xs">Tipo</Label>
            <RadioGroup
              value={pizza1Type}
              onValueChange={(v) => {
                if (isPizzaType(v)) setPizza1Type(v)
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completa" id="p1-completa" />
                <Label htmlFor="p1-completa">Pizza completa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mitad-y-mitad" id="p1-mitad" />
                <Label htmlFor="p1-mitad">Mitad y mitad</Label>
              </div>
            </RadioGroup>
          </div>

          {pizza1Type === "mitad-y-mitad" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades1">
                <AccordionTrigger>Seleccionar segunda mitad</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    Primera mitad: <strong>{especialidad.name}</strong>
                  </div>
                  <div>
                    <Label className="text-xs">Segunda mitad</Label>
                    <Select value={pizza1Mitad2} onValueChange={setPizza1Mitad2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Checkbox 
              id="pizza1-edge-cheese" 
              checked={pizza1EdgeCheese}
              onCheckedChange={(checked) => setPizza1EdgeCheese(getCheckedValue(checked))}
            />
            <Label htmlFor="pizza1-edge-cheese" className="cursor-pointer font-semibold">
              🧀 Orilla de Queso +${getEdgeCheesePrice(size)}
            </Label>
          </div>
        </div>

        {/* Segunda Pizza */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-green-500">Segunda Pizza (3x1)</Label>

          <div>
            <Label className="text-xs">Especialidad</Label>
            <Select value={pizza2Name} onValueChange={setPizza2Name}>
              <SelectTrigger>
                <SelectValue placeholder="Elegir especialidad" />
              </SelectTrigger>
              <SelectContent>
                {allEspecialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RadioGroup
            value={pizza2Type}
            onValueChange={(v) => {
              if (isPizzaType(v)) setPizza2Type(v)
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id="p2-completa" />
              <Label htmlFor="p2-completa">Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id="p2-mitad" />
              <Label htmlFor="p2-mitad">Mitad y mitad</Label>
            </div>
          </RadioGroup>

          {pizza2Type === "mitad-y-mitad" && pizza2Name && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades2">
                <AccordionTrigger>Seleccionar segunda mitad</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    Primera mitad: <strong>{pizza2Name}</strong>
                  </div>
                  <div>
                    <Label className="text-xs">Segunda mitad</Label>
                    <Select value={pizza2Mitad2} onValueChange={setPizza2Mitad2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Checkbox 
              id="pizza2-edge-cheese" 
              checked={pizza2EdgeCheese}
              onCheckedChange={(checked) => setPizza2EdgeCheese(getCheckedValue(checked))}
            />
            <Label htmlFor="pizza2-edge-cheese" className="cursor-pointer font-semibold">
              🧀 Orilla de Queso +${getEdgeCheesePrice(size)}
            </Label>
          </div>
        </div>

        {/* Tercera Pizza */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-blue-500">Tercera Pizza (3x1)</Label>

          <div>
            <Label className="text-xs">Especialidad</Label>
            <Select value={pizza3Name} onValueChange={setPizza3Name}>
              <SelectTrigger>
                <SelectValue placeholder="Elegir especialidad" />
              </SelectTrigger>
              <SelectContent>
                {allEspecialidades.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RadioGroup
            value={pizza3Type}
            onValueChange={(v) => {
              if (isPizzaType(v)) setPizza3Type(v)
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id="p3-completa" />
              <Label htmlFor="p3-completa">Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id="p3-mitad" />
              <Label htmlFor="p3-mitad">Mitad y mitad</Label>
            </div>
          </RadioGroup>

          {pizza3Type === "mitad-y-mitad" && pizza3Name && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades3">
                <AccordionTrigger>Seleccionar segunda mitad</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                    Primera mitad: <strong>{pizza3Name}</strong>
                  </div>
                  <div>
                    <Label className="text-xs">Segunda mitad</Label>
                    <Select value={pizza3Mitad2} onValueChange={setPizza3Mitad2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elegir especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Checkbox 
              id="pizza3-edge-cheese" 
              checked={pizza3EdgeCheese}
              onCheckedChange={(checked) => setPizza3EdgeCheese(getCheckedValue(checked))}
            />
            <Label htmlFor="pizza3-edge-cheese" className="cursor-pointer font-semibold">
              🧀 Orilla de Queso +${getEdgeCheesePrice(size)}
            </Label>
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold">Anotaciones Especiales</Label>
          <Textarea
            placeholder="Agrega o quita ingredientes ejemplo: Sin cebolla, extra queso, orilla de queso, etc."
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 pt-4 flex gap-2">
        <Button onClick={() => router.push("/pizzas")} variant="outline" className="flex-1">
          Volver
        </Button>
        <Button onClick={handleAddToCart} className="flex-1">
          Agregar al Carrito - ${finalPrice}
        </Button>
      </CardFooter>
    </Card>
  )
}
