import express from 'express'
import { deletePost, getPostById, getPostList, updateOrCreatePost } from '../../controllers/postController'
import { type ReqPost } from '../../types'
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 1024 * 1024 * 10 // 10 MB
  }
})

const router = express.Router()

router.get('', (req, res) => {
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
      console.error(e)
      res.status(500).send({ Message: 'Error getting post list from the database' })
    })
})

router.get(':id', (req, res) => {
  const id = req.params.id

  getPostById(id)
    .then(post => {
      res.send(post)
    })
    .catch(e => {
      console.error(e)
      res.status(500).send({ Message: 'Error getting posts from the database' })
    })
})

router.post('', upload.single('featuredImage'), (req, res) => {
  if (req.file != null) {
    updateOrCreatePost(req.body, req.file)
      .then(createdPost => {
        res.send(createdPost)
      })
      .catch(e => {
        console.error(e)
        res.status(500).send('Error saving the post')
      })
  }
})

router.delete('delete/:id', (req, res) => {
  deletePost(Number(req.params.id))
    .then(postIsDeleted => {
      res.send(postIsDeleted)
    }).catch(e => {
      console.error(e)
      res.status(500).send('Error deleting post')
    })
})

export default router
