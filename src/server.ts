import { app } from './app'
import { connectDatabase } from './database/database'

export async function initServer() {
  try {
    await connectDatabase()

    app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
      console.log('🚀 App server running on http://localhost:3333')
      console.log('📘 Swagger UI: http://localhost:3333/swagger')
      console.log('✨ Scalar Docs: http://localhost:3333/docs')
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

initServer()
