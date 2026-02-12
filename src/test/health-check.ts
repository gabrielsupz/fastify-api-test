import { app } from '@/server'

export function healthcheckRoutes() {
  app.get('/healthcheck', { schema: { tags: ['healthcheck'] } }, (req, res) => {
    res.send({ message: 'Success' })
  })
}
