import { Product } from '@/components/product'
import { useAppSelector } from '@/store'
import { Empty } from 'antd'

type Props = {}

export default function FavoriteProduct({}: Props) {
  const { favoriteProduct } = useAppSelector((state) => state.favoriteProduct)
  return (
    <>
      <div className='grid grid-cols-3 gap-4'>
        {favoriteProduct &&
          favoriteProduct.length > 0 &&
          favoriteProduct?.map((item) => (
            <Product
              key={item._id}
              _id={item._id}
              img={item.img}
              price={item.price}
              productName={item.productName}
              oldPrice={item.oldPrice}
              badge
              des=''
            />
          ))}
        {favoriteProduct.length === 0 && (
          <div className='col-span-3 flex items-center justify-center min-h-[500px]'>
            <Empty description='Sản phẩm yêu thích trống!' />
          </div>
        )}
      </div>
    </>
  )
}
