import { type Post, PrismaClient } from '@prisma/client'
import { type ReqPost } from '../types'
import { type QueryData } from './types'

const prisma = new PrismaClient()

export const findPost = async (title: string): Promise<Post | null> => {
  try {
    const foundPost = await prisma.post.findUnique({
      where: {
        title
      }
    })
    return foundPost
  } catch (e) {
    console.error('Error finding post', e)
    return null
  }
}

export const getPostCount = async (): Promise<number | null> => {
  try {
    return await prisma.post.count()
  } catch (e) {
    console.error('Counting posts', e)
    return null
  }
}

export const getPostListFromDb = async (req: ReqPost): Promise<Post[]> => {
  try {
    const queryData: QueryData = {
      where: {
        category: {
          name: req.category
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
        }
      }
    }

    if (req.category === 'all') {
      queryData.where = {}
    }
    const postList = await prisma.post.findMany(queryData)

    return postList
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw new Error('An unknown error occurred getting post list from the database')
    }
  }
}
