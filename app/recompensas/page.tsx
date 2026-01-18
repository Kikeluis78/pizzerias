"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Star, Trophy, Facebook, Instagram, Twitter, Youtube, Check } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

interface RewardsData {
  points: number
  completedOnce: string[]
  dailyTasks: {
    [key: string]: string
  }
}

export default function RecompensasPage() {
  const [mounted, setMounted] = useState(false)
  const [rewards, setRewards] = useState<RewardsData>({
    points: 0,
    completedOnce: [],
    dailyTasks: {},
  })

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("rewardsData")
    if (saved) {
      setRewards(JSON.parse(saved))
    }
  }, [])

  const saveRewards = (newRewards: RewardsData) => {
    setRewards(newRewards)
    localStorage.setItem("rewardsData", JSON.stringify(newRewards))
  }

  const handleFollowTask = (platform: string, points: number) => {
    if (rewards.completedOnce.includes(platform)) {
      return
    }

    const socialUrls: { [key: string]: string } = {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://x.com",
      youtube: "https://youtube.com",
    }

    window.open(socialUrls[platform], "_blank")

    setTimeout(() => {
      Swal.fire({
        title: "¡Verificando!",
        text: `Por favor, sigue nuestra página en ${platform}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ya seguí la página",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const newRewards = {
            ...rewards,
            points: rewards.points + points,
            completedOnce: [...rewards.completedOnce, platform],
          }
          saveRewards(newRewards)
          Swal.fire({
            title: "¡Puntos ganados!",
            text: `Has ganado ${points} puntos`,
            icon: "success",
          })
        }
      })
    }, 1000)
  }

  const handleDailyLike = (platform: string, points: number) => {
    const today = new Date().toDateString()
    const taskKey = `like-${platform}`

    if (rewards.dailyTasks[taskKey] === today) {
      Swal.fire({
        title: "Ya completaste esta tarea",
        text: "Vuelve mañana para ganar más puntos",
        icon: "info",
      })
      return
    }

    const socialUrls: { [key: string]: string } = {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://x.com",
      youtube: "https://youtube.com",
    }

    window.open(socialUrls[platform], "_blank")

    setTimeout(() => {
      Swal.fire({
        title: "¡Dale like a nuestra última publicación!",
        text: `Visita nuestra página en ${platform}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ya di like",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const newRewards = {
            ...rewards,
            points: rewards.points + points,
            dailyTasks: {
              ...rewards.dailyTasks,
              [taskKey]: today,
            },
          }
          saveRewards(newRewards)
          Swal.fire({
            title: "¡Puntos ganados!",
            text: `Has ganado ${points} puntos`,
            icon: "success",
          })
        }
      })
    }, 1000)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Recompensas</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Puntos Acumulados
                </CardTitle>
                <CardDescription>Tus puntos de fidelidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{rewards.points} puntos</div>
                <p className="text-sm text-muted-foreground mt-2">Gana puntos completando tareas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Nivel Actual
                </CardTitle>
                <CardDescription>Tu estado de membresía</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {rewards.points < 500 ? "Bronce" : rewards.points < 1500 ? "Plata" : "Oro"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Completa tareas para subir de nivel</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Síguenos en Redes Sociales
                </CardTitle>
                <CardDescription>Gana 500 puntos por cada red social (solo una vez)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => handleFollowTask("facebook", 500)}
                    disabled={rewards.completedOnce.includes("facebook")}
                    className="justify-between"
                    variant={rewards.completedOnce.includes("facebook") ? "secondary" : "default"}
                  >
                    <span className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </span>
                    {rewards.completedOnce.includes("facebook") ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge variant="secondary">+500</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleFollowTask("instagram", 500)}
                    disabled={rewards.completedOnce.includes("instagram")}
                    className="justify-between"
                    variant={rewards.completedOnce.includes("instagram") ? "secondary" : "default"}
                  >
                    <span className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </span>
                    {rewards.completedOnce.includes("instagram") ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge variant="secondary">+500</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleFollowTask("twitter", 500)}
                    disabled={rewards.completedOnce.includes("twitter")}
                    className="justify-between"
                    variant={rewards.completedOnce.includes("twitter") ? "secondary" : "default"}
                  >
                    <span className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />X (Twitter)
                    </span>
                    {rewards.completedOnce.includes("twitter") ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge variant="secondary">+500</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleFollowTask("youtube", 500)}
                    disabled={rewards.completedOnce.includes("youtube")}
                    className="justify-between"
                    variant={rewards.completedOnce.includes("youtube") ? "secondary" : "default"}
                  >
                    <span className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </span>
                    {rewards.completedOnce.includes("youtube") ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge variant="secondary">+500</Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Tareas Diarias
                </CardTitle>
                <CardDescription>Dale like a nuestra última publicación (100 puntos por red social)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => handleDailyLike("facebook", 100)}
                    disabled={rewards.dailyTasks[`like-facebook`] === new Date().toDateString()}
                    className="justify-between"
                    variant={
                      rewards.dailyTasks[`like-facebook`] === new Date().toDateString() ? "secondary" : "outline"
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Like en Facebook
                    </span>
                    {rewards.dailyTasks[`like-facebook`] === new Date().toDateString() ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge>+100</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDailyLike("instagram", 100)}
                    disabled={rewards.dailyTasks[`like-instagram`] === new Date().toDateString()}
                    className="justify-between"
                    variant={
                      rewards.dailyTasks[`like-instagram`] === new Date().toDateString() ? "secondary" : "outline"
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Like en Instagram
                    </span>
                    {rewards.dailyTasks[`like-instagram`] === new Date().toDateString() ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge>+100</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDailyLike("twitter", 100)}
                    disabled={rewards.dailyTasks[`like-twitter`] === new Date().toDateString()}
                    className="justify-between"
                    variant={rewards.dailyTasks[`like-twitter`] === new Date().toDateString() ? "secondary" : "outline"}
                  >
                    <span className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Like en X
                    </span>
                    {rewards.dailyTasks[`like-twitter`] === new Date().toDateString() ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge>+100</Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDailyLike("youtube", 100)}
                    disabled={rewards.dailyTasks[`like-youtube`] === new Date().toDateString()}
                    className="justify-between"
                    variant={rewards.dailyTasks[`like-youtube`] === new Date().toDateString() ? "secondary" : "outline"}
                  >
                    <span className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      Like en YouTube
                    </span>
                    {rewards.dailyTasks[`like-youtube`] === new Date().toDateString() ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Badge>+100</Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recompensas Disponibles */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Recompensas Disponibles
                </CardTitle>
                <CardDescription>Canjea tus puntos por premios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Pizza Gratis</h3>
                      <p className="text-sm text-muted-foreground">Pizza mediana de tu elección</p>
                    </div>
                    <Badge>500 puntos</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Refresco 2L Gratis</h3>
                      <p className="text-sm text-muted-foreground">Refresco de 2 litros</p>
                    </div>
                    <Badge>200 puntos</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Descuento 20%</h3>
                      <p className="text-sm text-muted-foreground">En tu próxima compra</p>
                    </div>
                    <Badge>300 puntos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
