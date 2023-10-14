export interface QueryData {
  where?: {
    category?: {
      name?: any // mode not included in types for some reason
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
