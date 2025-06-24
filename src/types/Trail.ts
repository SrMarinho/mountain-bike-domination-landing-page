import { TrailDifficulty } from '@/types/trail_difficulty'

export type Trail = {
  image?: string
  title: string
  description: string
  total_distance: number
  descent: number
  difficulty: TrailDifficulty
}
