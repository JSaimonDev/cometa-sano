import express from 'express'
import { routes } from './routes/route'
import cors from 'cors'
import config from './config'

// const Router = express.Router()

const app = express()
// TODO: Move config variables

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(cors())
app.use(express.static('public'))

routes(app)

// TODO: use router
// Router.use('/post', routes)
// app.use('/api', Router)

// TODO: Check if it is necessary (cors)

// this didn't seem to be doing anything. Create a prover API_KEY validation
// app.use((req, res, next) => {
//   if (req.body.apiKey === config.API_KEY) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   }
//   next()
// })

app.listen(config.PORT, () => {
  console.log('Viviendo healthy listening in port 3000')
})
