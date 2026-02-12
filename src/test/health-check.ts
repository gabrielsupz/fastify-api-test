import { app } from '@/server'

export function healthcheckRoutes() {
  app.get('/healthcheck', (req, res) => {
    res.send({ message: 'Success' })
  })
}
