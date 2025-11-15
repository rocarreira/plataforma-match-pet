'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { AnimalCard } from '@/components/AnimalCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  User, 
  Settings, 
  LogOut, 
  Filter,
  Sparkles,
  PawPrint
} from 'lucide-react'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'

interface Animal {
  id: string
  name: string
  species: string
  breed: string | null
  age: number | null
  location: string | null
  behavior: string | null
  photo_url: string | null
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    checkUser()
    loadAnimals()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/auth')
      return
    }
    setUser(currentUser)
  }

  const loadAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setAnimals(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar animais')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || currentIndex >= animals.length) return

    const animal = animals[currentIndex]
    
    try {
      await supabase.from('matches').insert({
        user_id: user.id,
        animal_id: animal.id,
        liked: true,
      })

      setMatchCount(prev => prev + 1)
      toast.success(`Você curtiu ${animal.name}! 💖`)
      setCurrentIndex(prev => prev + 1)
    } catch (error: any) {
      toast.error('Erro ao registrar match')
    }
  }

  const handleDislike = async () => {
    if (!user || currentIndex >= animals.length) return

    const animal = animals[currentIndex]
    
    try {
      await supabase.from('matches').insert({
        user_id: user.id,
        animal_id: animal.id,
        liked: false,
      })

      setCurrentIndex(prev => prev + 1)
    } catch (error: any) {
      toast.error('Erro ao registrar ação')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-bounce">
            <PawPrint className="w-16 h-16 text-pink-500 mx-auto" />
          </div>
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const currentAnimal = animals[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                PetMatch
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {matchCount} matches
              </Badge>
              
              <Button variant="ghost" size="icon" className="rounded-full">
                <Filter className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {currentAnimal ? (
          <div className="relative h-[600px] sm:h-[700px]">
            <AnimatePresence>
              <AnimalCard
                key={currentAnimal.id}
                animal={currentAnimal}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </AnimatePresence>
          </div>
        ) : (
          <Card className="p-12 text-center shadow-xl">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-full">
                  <Heart className="w-16 h-16 text-white" fill="white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Você viu todos os pets!
                </h2>
                <p className="text-gray-600 text-lg">
                  Volte mais tarde para ver novos amiguinhos
                </p>
              </div>
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => {
                    setCurrentIndex(0)
                    loadAnimals()
                  }}
                >
                  Recarregar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        {currentAnimal && (
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Arraste para os lados ou use os botões
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <X className="w-4 h-4 text-red-500" /> Não curti
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-pink-500" /> Curti
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
