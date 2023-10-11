import { type Express } from 'express'
import { deleteOnePostController, getOnePost, getPostList, updateOrCreatePostController } from '../controllers/postController'
import { type ReqPost } from '../types'
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 1024 * 1024 * 10 // 10 MB
  }
})

export const routes = (app: Express): void => {
  app.get('/api/post', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const query: ReqPost = {
      take: Number(req.query.take),
      skip: Number(req.query.skip),
      category
    }

    getPostList(query)
      .then(postList => {
        res.send(postList)
      })
      .catch(e => {
        res.send({ Message: 'Error getting posts from the database' })
      })
  })

  app.get('/api/post/:id', (req, res) => {
    const id = req.params.id

    // validations

    getOnePost(id)
      .then(post => {
        res.send(post)
      })
      .catch(e => {
        res.send({ Message: 'Error getting posts from the database' })
      })
  })

  app.post('/api/post', upload.single('featuredImage'), (req, res) => {
    if (req.file != null) {
      updateOrCreatePostController(req.body, req.file)
        .then(createdPost => {
          res.send(createdPost)
        })
        .catch(e => {
          res.status(500).send('Error saving the post')
        })
    }
  })

  app.delete('/api/post/delete/:id', (req, res) => {
    deleteOnePostController(Number(req.params.id))
      .then(postIsDeleted => {
        res.send(postIsDeleted)
      }).catch(e => {
        res.status(500).send('Error deleting post')
      })
  })
}
