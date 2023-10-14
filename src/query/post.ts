import { type Post, PrismaClient } from '@prisma/client'
import { type ReqPost } from '../types'
import { type QueryData } from './types'
import { throwNewError } from '../utils'

const prisma = new PrismaClient()

export const getPostByIdQuery = async (id: string): Promise<Post | undefined | null> => {
  try {
    return await prisma.post.findUnique({
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
  } catch (e) {
    throwNewError('Error getting post from database', e)
  }
}

export const getPostByTitleQuery = async (title: string): Promise<Post | null | undefined> => {
  try {
    const foundPost = await prisma.post.findUnique({
      where: {
        title
      }
    })
    return foundPost
  } catch (e) {
    throwNewError('Error getting post from database', e)
  }
}

export const getPostCountQuery = async (): Promise<number | null | undefined> => {
  try {
    return await prisma.post.count()
  } catch (e) {
    throwNewError('Error getting post count from database', e)
  }
}

export const getPostListQuery = async (req: ReqPost): Promise<Post[] | undefined> => {
  try {
    const queryData: QueryData = {
      where: {
        category: {
          name: {
            equals: req.category,
            mode: 'insensitive'
          }
        }
      },
      take: req.take,
      skip: req.skip,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        subcategory: {
          select: {
            name: true
          }
        }
      }
    }

    if (req.category === 'all') {
      queryData.where = {}
    }
    const postList = await prisma.post.findMany(queryData)

    return postList
  } catch (e) {
    throwNewError('Error getting post list from database', e)
  }
}
