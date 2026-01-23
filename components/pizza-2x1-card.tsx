"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import Swal from "sweetalert2"
import { Plus } from "lucide-react"

interface Pizza2x1CardProps {
  especialidad: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  }
  allEspecialidades: string[]
}

export function Pizza2x1Card({ especialidad, allEspecialidades }: Pizza2x1CardProps) {
  const { addItem } = useCart()
  const [size, setSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")

  // Primera pizza
  const [pizza1Type, setPizza1Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza1Mitad2, setPizza1Mitad2] = useState("")

  // Segunda pizza
  const [pizza2Type, setPizza2Type] = useState<"completa" | "mitad-y-mitad">("completa")
  const [pizza2Name, setPizza2Name] = useState("")
  const [pizza2Mitad2, setPizza2Mitad2] = useState("")

  // Complementos
  const [selectedComplementos, setSelectedComplementos] = useState<string[]>([])

  const [anotaciones, setAnotaciones] = useState("")

  const price = especialidad.prices[size]

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
        text: "Selecciona la segunda pizza del 2x1",
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

    // Build description
    let description = `PROMOCIÓN 2X1 - Tamaño: ${size}\n\n`

    description += `🔴 Primera Pizza: ${especialidad.name}\n`
    if (pizza1Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${especialidad.name}\n`
      description += `  • ${pizza1Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }

    description += `\n🔴 Segunda Pizza: ${pizza2Name}\n`
    if (pizza2Type === "mitad-y-mitad") {
      description += `  Mitad y Mitad:\n`
      description += `  • ${pizza2Name}\n`
      description += `  • ${pizza2Mitad2}\n`
    } else {
      description += `  (Pizza completa)\n`
    }

    if (anotaciones.trim()) {
      description += `\n📝 Anotaciones: ${anotaciones}`
    }

    if (selectedComplementos.length > 0) {
      description += `\n\n🥤 Complementos: ${selectedComplementos.join(", ")}`
    }

    const itemId = `2x1-${especialidad.name}-${pizza2Name}-${size}-${Date.now()}`

    addItem({
      id: itemId,
      name: `2x1: ${especialidad.name} + ${pizza2Name}`,
      description,
      price,
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
      title: "Agregado al carrito",
      text: `Tu promoción 2x1 ha sido agregada`,
      timer: 2000,
      showConfirmButton: false,
    })

    // Reset form
    setPizza1Type("completa")
    setPizza1Mitad2("")
    setPizza2Type("completa")
    setPizza2Name("")
    setPizza2Mitad2("")
    setSelectedComplementos([])
    setAnotaciones("")
  }

  const toggleComplemento = (comp: string) => {
    setSelectedComplementos((prev) => (prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]))
  }

  return (
    <Card className="flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fadeIn">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardTitle className="text-xl text-balance">{especialidad.name}</CardTitle>
        <p className="text-sm text-muted-foreground text-pretty">{especialidad.ingredients}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Size selector */}
        <div className="space-y-2">
          <Label className="text-[50px] font-semibold">Tamaño</Label>
          <div className="grid grid-cols-4 gap-2">
            {(["CH", "MED", "GDE", "FAM"] as const).map((s) => (
              <Button
                key={s}
                variant={size === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSize(s)}
                className="flex flex-col h-auto py-2 transition-all duration-200 hover:scale-105"
              >
                <span className="font-bold">{s}</span>
                <span className="text-xs">${especialidad.prices[s]}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-green-500">Primera Pizza: {especialidad.name}</Label>

          <RadioGroup value={pizza1Type} onValueChange={(v) => setPizza1Type(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id={`p1-completa-${especialidad.name}`} />
              <Label htmlFor={`p1-completa-${especialidad.name}`}>Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id={`p1-mitad-${especialidad.name}`} />
              <Label htmlFor={`p1-mitad-${especialidad.name}`}>Mitad y mitad</Label>
            </div>
          </RadioGroup>

          {pizza1Type === "mitad-y-mitad" && (
            <Accordion type="single" collapsible>
              <AccordionItem value="mitades">
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
        </div>

        {/* Segunda Pizza */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold text-green-500">Segunda Pizza (2x1)</Label>

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

          <RadioGroup value={pizza2Type} onValueChange={(v) => setPizza2Type(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completa" id={`p2-completa-${especialidad.name}`} />
              <Label htmlFor={`p2-completa-${especialidad.name}`}>Pizza completa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mitad-y-mitad" id={`p2-mitad-${especialidad.name}`} />
              <Label htmlFor={`p2-mitad-${especialidad.name}`}>Mitad y mitad</Label>
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
        </div>

        {/* Complementos
        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold">Agregar Complementos</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedComplementos.includes("Refresco 2L") ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => toggleComplemento("Refresco 2L")}
            >
              {selectedComplementos.includes("Refresco 2L") && <Plus className="h-3 w-3 mr-1" />}
              Refresco 2L +$45
            </Badge>
            <Badge
              variant={selectedComplementos.includes("Coca Cola 2L") ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => toggleComplemento("Coca Cola 2L")}
            >
              {selectedComplementos.includes("Coca Cola 2L") && <Plus className="h-3 w-3 mr-1" />}
              Coca Cola 2L +$49
            </Badge>
            <Badge
              variant={selectedComplementos.includes("Refresco Lata") ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => toggleComplemento("Refresco Lata")}
            >
              {selectedComplementos.includes("Refresco Lata") && <Plus className="h-3 w-3 mr-1" />}
              Refresco Lata +$28
            </Badge>
          </div>
        </div>  */}


        <div className="space-y-3 border-t pt-3">
          <Label className="text-base font-semibold">Anotaciones Especiales</Label>
          <Textarea
            placeholder="Agraga o quita ingredientes ejemplo:  Sin cebolla, extra queso, orilla de queso, etc."
            value={anotaciones}
            onChange={(e) => setAnotaciones(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground text-right">{anotaciones.length}/200</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-2xl font-bold text-primary text-center w-full">${price}</div>
        <Button onClick={handleAddToCart} className="w-full transition-all duration-200 hover:scale-105" size="lg">
          Agregar 2x1 al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
