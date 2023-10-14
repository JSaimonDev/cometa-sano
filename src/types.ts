import { type Prisma } from '@prisma/client'

export interface OutputPost {
  title: string
  content: string
  featuredImage?: string
  category: string
  subcategory: string
  tags?: string
}

export interface CreatePost {
  title: string
  content: string
  featuredImage: string
  category: string
  subcategory: string
  tags?: string
}

export interface CommandPost {
  id: string
  title: string
  content?: string
  description: string
  featuredImage?: string
  altFeaturedImage?: string
  altContent: string
  category?: string
  subcategory?: string
  tags?: string
}

export interface ReqPost {
  skip: number
  take: number
  category?: string
  subcategory?: string
}

export interface QueryPost {
  take: number
  skip: number
  orderBy: {
    createdAt: Prisma.SortOrder
  }
  include?: {
    category?: {
      select?: {
        name?: boolean
      }
    }
  }
}
