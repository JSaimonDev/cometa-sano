import { type Post, PrismaClient } from '@prisma/client'
import { type CommandPost } from '../types'
import { fieldsInObject, commaStringToArray, throwNewError } from '../utils'

const prisma = new PrismaClient()

export const createPostCommand = async (post: CommandPost): Promise<Post | undefined> => {
  let tagsArray
  if (post.tags !== undefined) tagsArray = commaStringToArray(post.tags)
  const createData: any = ({
    data: {
      title: post.title,
      content: post.content,
      description: post.description,
      category: {
        connectOrCreate: {
          where: { name: post.category },
          create: { name: post.category }
        }
      },
      subcategory: {
        connectOrCreate: {
          where: {
            name: post.subcategory
          },
          create: {
            name: post.subcategory,
            category: {
              connectOrCreate: {
                where: {
                  name: post.category
                },
                create: {
                  name: post.category
                }
              }
            }
          }
        }
      },
      featuredImage: post.featuredImage,
      altFeaturedImage: post.altFeaturedImage,
      altContent: post.altContent
    }
  })
  if (tagsArray !== undefined && tagsArray.length > 0) {
    createData.data.tags = {
      connectOrCreate: tagsArray.map((name: string) => {
        return {
          where: { name },
          create: { name }
        }
      })
    }
  }
  const missingFields = fieldsInObject(post, ['title', 'content', 'category', 'subcategory'])
  try {
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${JSON.stringify(missingFields)}`)
    }
    return await prisma.post.create(createData)
  } catch (e) {
    throwNewError('Error creating post in database', e)
  }
}

export const updatePostCommand = async (post: CommandPost, id: number): Promise<Post | undefined> => {
  let tagsArray
  if (post.tags !== undefined) tagsArray = commaStringToArray(post.tags)
  const updateData: any = ({
    where: {
      id
    },
    data: {
      title: post.title,
      content: post.content,
      category: {
        connectOrCreate: {
          where: { name: post.category },
          create: { name: post.category }
        }
      },
      subcategory: {
        connectOrCreate: {
          where: {
            name: post.subcategory
          },
          create: {
            name: post.subcategory,
            category: {
              connectOrCreate: {
                where: {
                  name: post.category
                },
                create: {
                  name: post.category
                }
              }
            }
          }
        }
      },
      featuredImage: post.featuredImage,
      altFeaturedImage: post.altFeaturedImage
    }
  }
  )

  if (tagsArray !== undefined && tagsArray.length > 0) {
    updateData.data.tags = {
      connectOrCreate: tagsArray.map((name: string) => {
        return {
          where: { name },
          create: { name }
        }
      })
    }
  }
  const missingFields = fieldsInObject(post, ['title', 'content', 'category', 'subcategory'])
  try {
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${JSON.stringify(missingFields)}`)
    }
    return await prisma.post.update(updateData)
  } catch (e) {
    throwNewError('Error updating post in database', e)
  }
}

export const deletePostCommand = async (id: number): Promise<Post | undefined> => {
  try {
    return await prisma.post.delete({
      where: {
        id
      }
    })
  } catch (e) {
    throwNewError('Error deleting post in database', e)
  }
}
