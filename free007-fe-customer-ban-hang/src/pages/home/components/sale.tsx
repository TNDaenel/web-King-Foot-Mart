import { Image } from '@/components'
import { Link } from 'react-router-dom'
import Slider, { Settings, CustomArrowProps } from 'react-slick'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import './sale.css'

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => (
  <MdKeyboardArrowLeft
    {...props}
    className={'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')}
    aria-hidden='true'
    aria-disabled={currentSlide === 0 ? true : false}
  />
)

const SlickArrowRight = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => (
  <MdKeyboardArrowRight
    {...props}
    className={'slick-next slick-arrow' + (currentSlide === slideCount! - 1 ? ' slick-disabled' : '')}
    aria-hidden='true'
    aria-disabled={currentSlide === slideCount! - 1 ? true : false}
  />
)

export const Sale = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />
  }
  return (
    <div className='lg:px-10 lg:pt-10 px-3 pt-5'>
      <Slider {...settings}>
        <div>
          <Image
            imgSrc='https://kingfoodmart.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fonelife-public%2Fmedia%2Fimages%2F2024%2F10%2Fh1uJVgblob&w=1920&q=75'
            className='rounded-xl h-[150px] md:h-auto'
          />
        </div>
        <div>
          <Image
            imgSrc='https://kingfoodmart.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fonelife-public%2Fmedia%2Fimages%2F2024%2F10%2FypuSbAblob&w=1920&q=75'
            className='rounded-xl  h-[150px] md:h-auto'
          />
        </div>
        <div>
          <Image
            imgSrc='https://kingfoodmart.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fonelife-public%2Fmedia%2Fimages%2F2024%2F09%2F6ReuBAblob&w=1920&q=75'
            className='rounded-xl  h-[150px] md:h-auto'
          />
        </div>
        <div>
          <Image
            imgSrc='https://kingfoodmart.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fonelife-public%2Fmedia%2Fimages%2F2024%2F10%2FvtuvdAblob&w=1920&q=75'
            className='rounded-xl  h-[150px] md:h-auto'
          />
        </div>
        <div>
          <Image
            imgSrc='https://kingfoodmart.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fonelife-public%2Fmedia%2Fimages%2F2024%2F10%2FPtrTqwblob&w=1920&q=75'
            className='rounded-xl  h-[150px] md:h-auto'
          />
        </div>
      </Slider>
      <div className='flex flex-col items-center justify-between gap-4 py-10 md:flex-row lg:gap-5'>
        <div className='flex flex-col w-full h-auto gap-4 md:w-2/3 lg:w-1/2 lg:gap-5'>
          <div className='w-full'>
            <Link to='/shop'>
              <Image
                className='object-cover w-full h-full'
                imgSrc='https://storage.googleapis.com/onelife-public/media/images/2024/07/6Oihqwblob'
              />
            </Link>
          </div>
          <div className='w-full h-1/2'>
            <Link to='/shop'>
              <Image
                className='object-cover w-full h-full'
                imgSrc={'https://storage.googleapis.com/onelife-public/cate_banner/2.RCQ.jpg'}
              />
            </Link>
          </div>
        </div>
        <div className='flex flex-col w-full h-auto gap-4 md:w-2/3 lg:w-1/2 lg:gap-5'>
          <div className='w-full h-1/2'>
            <Link to='/shop'>
              <Image
                className='object-cover w-full h-full'
                imgSrc='https://storage.googleapis.com/onelife-public/cate_banner/3.Thit.jpg'
              />
            </Link>
          </div>
          <div className='w-full h-1/2'>
            <Link to='/shop'>
              <Image
                className='object-cover w-full h-full'
                imgSrc={'https://storage.googleapis.com/onelife-public/media/images/2024/07/V5MoeQblob'}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
