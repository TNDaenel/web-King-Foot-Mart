//add tintuc
import 'react-quill/dist/quill.snow.css'

import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddTintucMutation } from '@/api/news'
import UpLoand from '@/components/ImagePreview/UploadImageTintuc'
import { Button, Form, Input, notification, Select } from 'antd'
import TitlePage from '@/components/TitlePage/TitlePage'
import { Itintuc } from '@/interfaces'
import ReactQuill from 'react-quill'
import { container, formats } from '@/utils/ReactQuill'

const AddNew = () => {
  const navigate = useNavigate()
  const [addtintuc] = useAddTintucMutation()
  const [img, setImg] = useState<string[]>([])
  const reactQuillRef = useRef<ReactQuill>(null)

  const handleImage = (url: string) => {
    setImg([...img, url])
  }
  const handleImageRemove = (url: string) => {
    setImg((prevImg) => prevImg.filter((imageUrl: string) => imageUrl !== url))
  }
  const { TextArea } = Input
  const onFinish = (tintucs: Omit<Itintuc, '_id'>) => {
    // console.log(tintucs)
    // return
    const product = {
      tieude: tintucs.tieude,
      noidung: tintucs.noidung,
      image: img,
      trang_thai: 'active'
    }

    addtintuc(product)

    navigate('/admin/news')
    notification.success({
      message: 'Success',
      description: 'Thêm tin tức thành công'
    })
  }
  return (
    <div>
      <TitlePage title='Thêm tin tức' />
      <Form
        name='basic'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 800, margin: '0 auto' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Tiêu Đề Tin tức '
          name='tieude'
          rules={[{ required: true, message: 'Please input your tieu de!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Trạng thái' name='trang_thai'>
          <Select>
            <Select.Option value='active'>Công khai</Select.Option>{' '}
            <Select.Option value='deactive'>Riêng tư</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='Image' name='image'>
          <UpLoand onImageUpLoad={handleImage} onImageRemove={handleImageRemove} />
        </Form.Item>
        <Form.Item label='Nội Dung' name='noidung'>
          {/* <TextArea rows={4} /> */}
          <ReactQuill
            className='h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
            ref={reactQuillRef}
            theme='snow'
            placeholder='Start writing...'
            modules={{
              toolbar: {
                container: container
              },
              clipboard: {
                matchVisual: false
              }
            }}
            formats={formats}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type='primary'
            htmlType='submit'
            style={{ backgroundColor: '#1890ff', color: '#fff' }}
            onMouseEnter={(e: any) => (e.target.style.backgroundColor = 'red')} // Khi di chuột vào
          >
            Thêm Mới Tin Tức
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddNew
