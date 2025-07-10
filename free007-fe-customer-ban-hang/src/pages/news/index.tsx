import { useGetNewsQuery } from '@/store/services/news.service'
import { INews } from '@/types/news.type'
import { Avatar, Button, Card, Modal } from 'antd'
import { useState } from 'react'
import moment from 'moment'
// import parse from 'html-react-parser'
type Props = {}
const { Meta } = Card

export default function NewsPage({}: Props) {
  const { data: news } = useGetNewsQuery()
  const [isOpen, setIsOpen] = useState(false)
  const [newsDetail, setNewsDetail] = useState<INews | null>(null)

  return (
    <div className='max-w-container mx-auto px-4'>
      <div className='text-3xl font-semibold pt-6'>News</div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-x-[20px] gap-y-[30px] my-[30px]'>
        {news &&
          news
            .filter((newsItem) => newsItem.trang_thai !== 'deactive')
            .reverse()
            .map((newsItem) => (
              <Card
                key={newsItem._id}
                onClick={() => {
                  setNewsDetail(newsItem)
                  setIsOpen(true)
                }}
                hoverable
                className='w-[calc(50% - 8px)] bg-[#f5f5f5] hover:bg-[#fff]'
                cover={<img className='w-full max-h-[200px] object-cover' src={newsItem.image[0]} />}
              >
                <Meta
                  className='custom-title  mb-5'
                  avatar={<Avatar src='/orebiLogo.png' />}
                  title={newsItem?.tieude}
                  // description={
                  //   <div
                  //     className='line-clamp-3 text-base '
                  //     dangerouslySetInnerHTML={{ __html: newsItem?.noidung }}
                  //   ></div>
                  // }
                />
                <Button className='mt-[25px] hover:!text-primeColor hover:bg-transparent hover:!border-primeColor  text-[#fff] bg-primeColor'>
                  Chi tiết
                </Button>
              </Card>
            ))}
      </div>

      <Modal width={1000} open={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
        <div className=''>
          <div className='mb-4'>
            <h2 className='font-semibold  text-2xl text-primeColor'>{newsDetail?.tieude}</h2>
            <div className='text-gray-600'>Ngày đăng: {moment(newsDetail?.createdAt).format('DD/MM/YYYY')}</div>
          </div>
          <img src={newsDetail?.image[0]} alt='news image' className='rounded-md' />
          <div className='mt-4 text-base  '>
            <p
              dangerouslySetInnerHTML={{
                __html: newsDetail?.noidung || ''
              }}
            ></p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
