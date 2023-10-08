export interface QueryData {
  where?: {
    category?: {
      name?: string
    }
  }
  take?: number
  skip?: number
  orderBy?: {
    createdAt?: 'asc' | 'desc'
  }
  include?: {
    category?: {
      select?: {
        name?: boolean
      }
    }
  }
}
