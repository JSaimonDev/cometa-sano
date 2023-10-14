import express from 'express'
import postRouter from './routes/post/routes'
import cors from 'cors'
import config from './config'

const app = express()

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(cors())

app.use('/api/post', postRouter)

app.listen(config.PORT, () => {
  console.log(`Sano sanote listening in port ${config.PORT}`)
})
