export interface INews {
  _id: string
  tieude: string
  noidung: string
  image: string[]
  trang_thai: 'active' | 'deactive'
  createdAt: string
  updatedAt: string
}
