import mongoose from 'mongoose'

import { env } from '@/env'

export async function connectDatabase() {
  try {
    await mongoose.connect(env.DATABASE_URL)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ Error connecting to mongo:', error)
    process.exit(1)
  }
}
