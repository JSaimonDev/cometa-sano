import { type Post } from '@prisma/client'
import { type ReqPost, type CommandPost } from '../types'
import dotenv from 'dotenv'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { throwNewError } from '../utils'
import { updatePostCommand, createPostCommand, deletePostCommand } from '../command/post'
import { getPostByTitleQuery, getPostByIdQuery, getPostCountQuery, getPostListQuery } from '../query/post'
import { createOrUpdateFeaturedImage, extractAndSaveImg } from './utils'

dotenv.config()

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export const updateOrCreatePost = async (newPost: CommandPost, file: Express.Multer.File): Promise<Post | undefined> => {
  try {
    if (newPost.content !== undefined) {
      // featured image
      newPost.featuredImage = await createOrUpdateFeaturedImage(file, newPost.title)

      // content images
      const noBase64Html = await extractAndSaveImg(newPost.content, `public/images/posts/${newPost.title}/`, newPost.title, newPost.altContent)
      newPost.content = DOMPurify.sanitize(noBase64Html)

      const postFound = await getPostByTitleQuery(newPost.title)
      let post
      if (postFound != null) {
        post = await updatePostCommand(newPost, postFound.id)
      } else {
        post = await createPostCommand(newPost)
      }
      return post
    }
  } catch (e) {
    throwNewError('Error creating or updating a post', e)
  }
}

export const getPostList = async (req: ReqPost): Promise<{ postList: Post[] | undefined, postCount: number | null | undefined } | undefined> => {
  try {
    const postList = await getPostListQuery(req)
    const postCount = await getPostCountQuery()
    return { postList, postCount }
  } catch (e) {
    throwNewError('Error getting the post list', e)
  }
}

export const getPostById = async (id: string): Promise<Post | undefined> => {
  try {
    const post = await getPostByIdQuery(id)
    if (post == null) {
      throw new Error('Post not found')
    }
    return post
  } catch (e) {
    throwNewError('Error getting a post', e)
  }
}

export const deletePost = async (id: number): Promise<Post | undefined> => {
  try {
    if (id != null) {
      return await deletePostCommand(id)
    } else throw new Error()
  } catch (e) {
    throwNewError('Error deleting a post', e)
  }
}
