"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { especialidades2x1 } from "@/config/menu.config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Pizza } from "lucide-react"
import { useState } from "react"
import { PizzaSelectionModal } from "@/components/pizza-selection-modal"

export default function PizzasPage() {
    const router = useRouter()
    const [selectedPizza, setSelectedPizza] = useState<(typeof especialidades2x1)[0] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handlePizzaClick = (pizza: typeof especialidades2x1[0]) => {
        setSelectedPizza(pizza)
        setIsModalOpen(true)
    }

    const handleViewPaquetes = () => {
        router.push("/paquetes")
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                              Elige Qué quieres
                          
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            Elige tu pizza favorita y selecciona tu promoción
                        </p>
                        <Button
                            onClick={handleViewPaquetes}
                            variant="outline"
                            size="lg"
                            className="font-semibold border-2 border-primary text-primary hover:bg-primary/10"
                        >
                            Ver Paquetes Especiales
                        </Button>
                    </div>

                    {/* Pizza Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {especialidades2x1.map((especialidad, index) => (
                            <Card
                                key={especialidad.name}
                                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 hover:border-primary animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => handlePizzaClick(especialidad)}
                            >
                                <CardHeader className="bg-gradient-to-br from-primary/10 to-blue-500/10 pb-4">
                                    <div className="flex items-center justify-center mb-3">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Pizza className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-center text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        {especialidad.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 pb-5">
                                    <p className="text-sm text-muted-foreground text-center mb-3 line-clamp-2">
                                        {especialidad.ingredients}
                                    </p>
                                    <div className="flex justify-center gap-2 text-xs font-semibold text-primary">
                                        <span>CH ${especialidad.prices.CH}</span>
                                        <span>•</span>
                                        <span>MED ${especialidad.prices.MED}</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Ver Opciones
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Info Section */}
                    <div className="mt-12 text-center">
                        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                            <CardContent className="pt-6 pb-6">
                                <h3 className="text-xl font-bold mb-3 text-primary">Promoción 2x1 y Más</h3>
                                <p className="text-muted-foreground">
                                    Selecciona cualquier especialidad para ver las opciones disponibles: 
                                    Promoción 2x1 o Pizza Individual personalizada a tu gusto.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
            
            <PizzaSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pizza={selectedPizza}
                allEspecialidades={especialidades2x1.map(e => e.name)}
            />
        </>
    )
}
