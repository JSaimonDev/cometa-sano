import { PrismaClient, type Post } from '@prisma/client'
import { type ReqPost, type CommandPost } from '../types'
import dotenv from 'dotenv'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { createOrUpdateFeaturedImage, extractAndSaveImg } from '../utils'
import { updatePostInDb, createPostInDb, deletePostInDb } from '../command/post'
import { findPost, getPostCount, getPostListFromDb } from '../query/post'

dotenv.config()

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

const prisma = new PrismaClient()

export const updateOrCreatePostController = async (newPost: CommandPost, file: Express.Multer.File): Promise<Post | undefined> => {
  try {
    if (newPost.content !== undefined) {
      // featured image
      newPost.featuredImage = await createOrUpdateFeaturedImage(file, newPost.title)

      // content images
      const noBase64Html = await extractAndSaveImg(newPost.content, `public/images/posts/${newPost.title}/`, newPost.title, newPost.altFeaturedImage)
      newPost.content = DOMPurify.sanitize(noBase64Html)

      const postFound = await findPost(newPost.title)
      let post
      if (postFound != null) {
        post = await updatePostInDb(newPost, postFound.id)
      } else {
        post = await createPostInDb(newPost)
      }
      return post
    }
  } catch (e) {
    console.error('Controller error', e)
  }
}

export const getPostList = async (req: ReqPost): Promise<{ postList: Post[], postCount: number | null }> => {
  try {
    const postList = await getPostListFromDb(req)
    const postCount = await getPostCount()
    return { postList, postCount }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw new Error('An unknown error occurred')
    }
  }
}

export const getOnePost = async (id: string): Promise<Post> => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })
    if (post == null) {
      throw new Error('Post not found')
    }
    return post
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw new Error('An unknown error occurred')
    }
  }
}

export const deleteOnePostController = async (id: number): Promise<boolean> => {
  try {
    if (id != null) {
      return await deletePostInDb(id)
    }
    return false
  } catch (e) {
    console.error('Error deleting post', e)
    return false
  }
}
