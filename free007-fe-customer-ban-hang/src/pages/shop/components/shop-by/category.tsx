import { ImPlus } from 'react-icons/im'
import { NavTitle } from '.'
import { useGetCategoriesQuery } from '@/store'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

interface CategoryProps {
  onFilterCategory: (category: string) => void
}

export const Category = ({ onFilterCategory }: CategoryProps) => {
  const { isError, isFetching, data } = useGetCategoriesQuery()
  const [searchParams] = useSearchParams()
  const searchParamsCategory = searchParams.get('category')

  const [showSubCatOne, setShowSubCatOne] = useState<boolean>(false)

  if (isError) return <p>Error</p>
  if (isFetching) return <p>Loading...</p>
  if (!data) return <p>No data</p>
  return (
    <div className='w-full'>
      <NavTitle title='Shop by Category' icons={false} />
      <div>
        <ul className='flex flex-col gap-4 text-sm lg:text-base text-[#767676]'>
          {data.data.map(({ _id, name, image }) => (
            <Link key={_id} to={`/shop?category=${_id}`}>
              <li
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex justify-between items-center cursor-pointer transition-all ${searchParamsCategory === _id ? 'text-primeColor font-medium ' : ''}`}
                onClick={() => {
                  onFilterCategory(_id)
                }}
              >
                <div className='flex gap-x-3 items-center '>
                  <img src={image[0]} alt='' className='w-12 h-12 object-cover rounded-full' />
                  {name}
                </div>
                {true && (
                  <span
                    onClick={() => setShowSubCatOne(!showSubCatOne)}
                    className='text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300'
                  >
                    <ImPlus />
                  </span>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}
