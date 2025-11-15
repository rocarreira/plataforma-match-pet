'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, X, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'

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

interface AnimalCardProps {
  animal: Animal
  onLike: () => void
  onDislike: () => void
}

export function AnimalCard({ animal, onLike, onDislike }: AnimalCardProps) {
  const [exitX, setExitX] = useState(0)

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      setExitX(1000)
      onLike()
    } else if (info.offset.x < -threshold) {
      setExitX(-1000)
      onDislike()
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute w-full"
    >
      <Card className="overflow-hidden shadow-2xl border-2 hover:shadow-3xl transition-shadow">
        <div className="relative h-96 sm:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
          {animal.photo_url ? (
            <Image
              src={animal.photo_url}
              alt={animal.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
              🐾
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-bold">{animal.name}</h2>
              {animal.age && (
                <Badge variant="secondary" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {animal.age} {animal.age === 1 ? 'ano' : 'anos'}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {animal.species} {animal.breed && `• ${animal.breed}`}
              </p>
              
              {animal.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{animal.location}</span>
                </div>
              )}
              
              {animal.behavior && (
                <p className="text-sm opacity-90 line-clamp-2">{animal.behavior}</p>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 border-2 border-red-500 hover:bg-red-50 hover:scale-110 transition-all"
              onClick={onDislike}
            >
              <X className="w-8 h-8 text-red-500" />
            </Button>
            
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-110 transition-all shadow-lg"
              onClick={onLike}
            >
              <Heart className="w-8 h-8" fill="white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
