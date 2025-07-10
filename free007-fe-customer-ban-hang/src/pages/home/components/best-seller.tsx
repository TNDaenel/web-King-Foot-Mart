import { Heading } from '@/components'
import { Product } from '@/components/product'
import { useGetProductsQuery } from '@/store'

export const BestSeller = () => {
  const { data: productData } = useGetProductsQuery()
  return (
    <div className='w-full pb-20 mt-5 md:mt-0'>
      <Heading heading='Our Bestsellers' />
      <div className='grid w-full gap-6 grid-cols-2 lg:grid-cols-5 xl:grid-cols-4'>
        {productData &&
          productData?.products.slice(0, 20)?.map((product) => (
            <Product
              key={product._id}
              _id={product._id}
              img={product.image[0]}
              productName={product.name}
              price={product.price}
              // color='Blank and White'
              badge={true}
              des={product.description}
              oldPrice={product.hot_sale}
              size={product.listQuantityRemain[0].nameColor}
              maxQuantity={product.quantity}
            />
          ))}
      </div>
    </div>
  )
}
