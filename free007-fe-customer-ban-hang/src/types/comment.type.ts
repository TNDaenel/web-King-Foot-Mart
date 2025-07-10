export type CommentType = {
  _id: string
  content: string
  fullname: string
  userId: string
  productId: string
  createdAt: string
  updatedAt: string
}

export type CreateCommentType = {
  content: string
  fullname: string
  userId: string
  productId: string
}
