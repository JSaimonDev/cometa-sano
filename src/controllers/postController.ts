import { type Post } from '@prisma/client'
import { type ReqPost, type CommandPost } from '../types'
import dotenv from 'dotenv'
import { throwNewError } from '../utils'
import { updatePostCommand, createPostCommand, deletePostCommand } from '../command/post'
import { getPostByIdQuery, getPostCountQuery, getPostListQuery } from '../query/post'
import { manageImages } from './utils'

dotenv.config()

export const createPost = async (newPost: CommandPost, file: Express.Multer.File): Promise<Post | undefined> => {
  try {
    if (newPost.content !== undefined) {
      newPost = await manageImages(newPost, file)
      return await createPostCommand(newPost)
    } else {
      throw new Error('Missing content')
    }
  } catch (e) {
    throwNewError('Error creating or updating a post', e)
  }
}

export const updatePost = async (newPost: CommandPost, id: string, file: Express.Multer.File | undefined): Promise<Post | undefined> => {
  const postFound = await getPostById(id)
  if (postFound != null) {
    if (newPost.content !== undefined) {
      newPost = await manageImages(newPost, file)
    }
    return await updatePostCommand(newPost, postFound.id)
  } else {
    throw new Error('Post not found')
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
