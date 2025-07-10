import { CommentType } from '@/types/comment.type'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, List, Popconfirm, Space, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

interface ReviewListProps {
  reviews: CommentType[]
  onEdit: (review: CommentType) => void
  onDelete: (id: string) => void
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onEdit, onDelete }) => {
  return (
    <List
      itemLayout='vertical'
      dataSource={reviews}
      renderItem={(review) => (
        <List.Item
          actions={[
            <Button icon={<EditOutlined />} onClick={() => onEdit(review)}>
              Chỉnh sửa
            </Button>,
            <Popconfirm
              title='Bạn có chắc chắn muốn xóa đánh giá này?'
              onConfirm={() => onDelete(review._id)}
              okText='Có'
              cancelText='Không'
            >
              <Button icon={<DeleteOutlined />} danger className='!text-red-500'>
                Xóa
              </Button>
            </Popconfirm>
          ]}
        >
          <List.Item.Meta
            title={review.fullname}
            description={
              <Space direction='vertical'>
                <Text>{review.content}</Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  )
}

export default ReviewList
