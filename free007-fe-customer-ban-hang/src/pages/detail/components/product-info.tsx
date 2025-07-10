import { IListQuantityRemain, IProduct } from '@/types'

import { useAppDispatch, useAppSelector } from '@/store'
import { addProductToCart } from '@/store/slices/cart.slice'
import { addFavoriteProduct, removeFavoriteProduct } from '@/store/slices/favoriteProduct.slice'
import { clsxm } from '@/utils'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa6'

interface ProductInfoProps {
  productInfo: IProduct
}
export const ProductInfo = ({ productInfo }: ProductInfoProps) => {
  const [quantiry, setQuantiry] = useState(1)
  const [sizeSelected, setSizeSelected] = useState<IListQuantityRemain | null>(productInfo.listQuantityRemain[0])

  const [isFavorite, setIsFavorite] = useState(false)
  const { favoriteProduct } = useAppSelector((state) => state.favoriteProduct)

  const [description, setDescription] = useState(productInfo.description?.slice(0, 200))

  useEffect(() => {
    if (favoriteProduct && favoriteProduct.length > 0) {
      const findProduct = favoriteProduct.find((item) => item._id === productInfo._id)
      if (findProduct) {
        setIsFavorite(true)
      }
    }
  }, [favoriteProduct])

  const handleLoadMoreDescription = () => {
    setDescription(productInfo.description)
  }

  const handleFavoriteProduct = (type: 'add' | 'remove') => {
    if (type === 'add') {
      dispatch(
        addFavoriteProduct({
          _id: productInfo._id,
          img: productInfo.image[0],
          price: productInfo.price,
          productName: productInfo.name,
          oldPrice: productInfo.hot_sale
        })
      )
      setIsFavorite(true)
    }
    if (type === 'remove') {
      dispatch(removeFavoriteProduct(productInfo._id))
      setIsFavorite(false)
    }
    message.success(
      type === 'add'
        ? 'Thêm sản phẩm vào danh sách yêu thích thành công!'
        : 'Xóa sản phẩm khỏi danh sách yêu thích thành công!'
    )
  }

  // console.log(cart, 'ahihii')
  // console.log(productInfo, 'productInfo')

  const dispatch = useAppDispatch()
  // giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    if (quantiry > 1) {
      setQuantiry(quantiry - 1)
    }
  }

  // tăng số lượng sản phẩm
  const increaseQuantity = () => {
    if (sizeSelected === null) {
      message.error('Bạn chưa chọn size sản phẩm!')
      return
    }

    // return;

    if (quantiry >= productInfo.listQuantityRemain[0]?.quantity) {
      message.error('Số lượng sản phẩm không đủ!')
      return
    }
    setQuantiry(quantiry + 1)
  }

  // add to cart
  const handleAddToCart = () => {
    if (!sizeSelected) {
      message.error('Bạn chưa chọn size sản phẩm!')
      return
    }

    // if (findProduct && quantiry + findProduct.quantity > sizeSelected.quantity) {
    //   message.error('Số lượng sản phẩm không đủ!')
    //   return
    // }

    const data = {
      _id: productInfo._id,
      nameProduct: productInfo.name,
      // nameSize: sizeSelected.nameSize,
      quantity: quantiry,
      nameColor: sizeSelected.nameColor,
      price: productInfo.price,
      image: productInfo.image[0],
      maxQuantity: sizeSelected.quantity
    }

    dispatch(addProductToCart(data))
    message.success('Thêm sản phẩm vào giỏ hàng thành công!')
  }

  return (
    <div className='flex flex-col gap-5 select-none'>
      <h2 className='flex items-center gap-5 text-4xl font-semibold'>
        <span>{productInfo.name}</span>
      </h2>
      <p className='items-center gap-4 text-xl font-semibold flext'>
        <span>{productInfo.price.toLocaleString()}₫</span>
        {productInfo?.hot_sale && (
          <span className='m-2 text-sm font-medium text-center rounded-full '>
            {'Sale '}
            {Math.round(((productInfo?.hot_sale - productInfo.price) / productInfo?.hot_sale) * 100)} %
          </span>
        )}
      </p>
      <p className='text-base text-gray-600'>
        {description}
        ...
        <span
          className={clsxm('cursor-pointer ml-3 font-medium text-black', {
            '!hidden': productInfo.description.length === description.length
          })}
          onClick={handleLoadMoreDescription}
        >
          Load More
        </span>
      </p>
      <p className='text-sm'>Be the first to leave a review.</p>
      {/* <p className='text-lg font-medium'>
        <span className='font-normal'>Size:</span>{' '}
        {productInfo.listQuantityRemain.map((size, index) => (
          <button
            key={index}
            disabled={size.quantity == 0}
            className={clsxm('px-2 py-1 mx-1 border border-gray-300 rounded-md cursor-pointer', {
              'bg-primeColor text-white': size === sizeSelected,
              'opacity-[0.6] cursor-not-allowed': size.quantity == 0
            })}
            onClick={() => setSizeSelected(size)}
          >
            {size.nameSize}
          </button>
        ))}
      </p> */}
      <p className=''>Số lượng: {productInfo.listQuantityRemain[0]?.quantity}</p>
      <div className='flex items-center border-2 border-gray-300 rounded-md py-3 px-5 w-full max-w-[150px] justify-around'>
        <button className='' onClick={decreaseQuantity}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
          </svg>
        </button>

        <div className=''>{quantiry}</div>

        <button className='' onClick={increaseQuantity}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>
      </div>
      <div className='flex gap-x-5'>
        <button
          className='w-max px-20 py-4 text-lg text-white duration-300 bg-primeColor hover:bg-black font-titleFont'
          onClick={handleAddToCart}
          disabled={productInfo.listQuantityRemain[0]?.quantity === 0}
        >
          Add to Cart
        </button>
        <button
          className=' rounded-md px-5 shadow-sm bg-white'
          onClick={() => {
            handleFavoriteProduct(isFavorite ? 'remove' : 'add')
          }}
        >
          <FaHeart size={25} className={`${isFavorite ? 'text-primeColor' : 'text-gray-500'} `} />
        </button>
      </div>
      {/* <p className='text-sm font-normal'>
        <span className='text-base font-medium'> Categories:</span> Spring collection, Streetwear, Women Tags: featured
        SKU: N/A
      </p> */}
    </div>
  )
}
