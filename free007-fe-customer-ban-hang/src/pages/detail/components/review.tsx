import { isAuthenticated } from '@/routes'
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useUpdateCommentMutation
} from '@/store/services/comment.service'
import { CommentType } from '@/types/comment.type'
import { Button, Form, Input, Typography, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewList from './review-list'

const { Title } = Typography
const { TextArea } = Input

const ProductReview: React.FC = () => {
  const [form] = Form.useForm()
  const [reviews, setReviews] = useState<CommentType[]>([])
  const [editingReview, setEditingReview] = useState<CommentType | null>(null)
  const { id } = useParams()

  const result = useMemo(() => {
    const user = isAuthenticated()
    if (Object.keys(user).length === 0) {
      return { _id: '', name: '' }
    }
    return { _id: user._id, name: user.fullname }
  }, [])

  const [createCommentMutation] = useCreateCommentMutation()
  const { data: comments } = useGetCommentsQuery()
  const [deleteCommentMutation] = useDeleteCommentMutation()
  const [updateCommentMutation] = useUpdateCommentMutation()
  const onFinish = (values: { comment: string }) => {
    if (!editingReview) {
      createCommentMutation({
        content: values.comment,
        fullname: result.name,
        userId: result._id,
        productId: id as string
      })
      form.resetFields()
    } else {
      console.log({
        ...editingReview,
        content: values.comment
      })
      updateCommentMutation({
        ...editingReview,
        content: values.comment
      })
      setEditingReview(null)
      form.resetFields()
    }
  }

  const handleEdit = (review: CommentType) => {
    setEditingReview(review)
    form.setFieldsValue({
      comment: review.content
    })
  }

  const handleDelete = async (id: string) => {
    await deleteCommentMutation(id)
    setReviews(reviews.filter((review) => review._id !== id))
    message.success('Đã xóa đánh giá thành công')
  }

  useEffect(() => {
    if (comments) {
      setReviews(comments)
    }
  }, [comments])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: 20 }}>
      {result._id !== '' && (
        <>
          <Title level={2}>{editingReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}</Title>
          <Form form={form} onFinish={onFinish} layout='vertical'>
            <Form.Item
              name='comment'
              label='Nội dung đánh giá'
              rules={[{ required: true, message: 'Vui lòng viết đánh giá của bạn' }]}
            >
              <TextArea rows={4} placeholder='Viết chi tiết đánh giá của bạn ở đây' />
            </Form.Item>
            <div className='flex justify-end w-full'>
              <Button
                className='!rounded !h-10 flex w-fit items-center justify-center font-medium bg-primeColor/25 text-primeColor hover:!bg-transparent hover:!text-primeColor hover:!border-primeColor w-full'
                size='large'
                htmlType='submit'
              >
                {editingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
              </Button>
              {editingReview && (
                <Button
                  className='!rounded !h-10'
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    setEditingReview(null)
                    form.resetFields()
                  }}
                >
                  Hủy chỉnh sửa
                </Button>
              )}
            </div>
          </Form>
        </>
      )}

      <Title level={3} style={{ marginTop: 40 }}>
        Danh sách đánh giá
      </Title>
      <ReviewList
        reviews={reviews?.filter((review) => review.productId === id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default ProductReview
