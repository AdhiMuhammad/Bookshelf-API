import Hapi from '@hapi/hapi'
import routes from './routes.js'

const init = async () => {
  // initialize the server
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // add routes
  server.route(routes)

  // start the server
  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
