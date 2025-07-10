import { useGetCategorysQuery, useRemoveCategoryMutation } from '@/api/category'
import TitlePage from '@/components/TitlePage/TitlePage'
import { pathRouter } from '@/constants/pathRouter'
import { ICategory } from '@/interfaces/category'

import { Alert, Button, Input, InputRef, Popconfirm, Skeleton, Space, Table } from 'antd'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'

const AdminCategoryList = () => {
  const { data: categorytData, error, isLoading } = useGetCategorysQuery()
  const [removeCategory, { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess }] = useRemoveCategoryMutation()

  const confirm = (id: string) => {
    removeCategory(id)
  }

  /*Search */
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: any) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm mã đơn hàng`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  /*End Search */

  const dataSource = categorytData?.data.map(({ _id, name, desciption, image }: ICategory) => ({
    key: _id || '',
    name,
    desciption,
    image
  }))

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Mô tả',
      dataIndex: 'desciption',
      key: 'desciption'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (images: string) => <img className='image' src={images[0]} alt='image of product' width={100} />
    },
    {
      title: 'Action',
      key: 'action',
      render: ({ key: _id }: { key: string }) => {
        return (
          <>
            <div className='space-x-2'>
              <Link to={`/${pathRouter.admin}/${pathRouter.categoryList}/edit/${_id}`}>
                <Button type='primary' className='bg-blue-600'>
                  <AiTwotoneEdit />
                </Button>
              </Link>
              <Popconfirm title='Bạn có muốn xóa' onConfirm={() => confirm(_id)} okText='Yes' cancelText='No'>
                <Button type='primary' danger className='bg-red-600'>
                  <AiTwotoneDelete />
                </Button>
              </Popconfirm>
            </div>
          </>
        )
      }
    }
  ]
  return (
    <div>
      <header className='mb-4 flex justify-between items-center'>
        <TitlePage title='Quản lý danh mục' />
        <Button type='primary' danger>
          <Link to={`/${pathRouter.admin}/${pathRouter.categoryAdd}`}>Thêm danh mục</Link>
        </Button>
      </header>

      {isRemoveSuccess && <Alert message='Xóa thành công' type='success' />}
      {isLoading || isRemoveLoading ? (
        <Skeleton />
      ) : (
        <Table dataSource={dataSource?.reverse() || []} columns={columns} />
      )}
    </div>
  )
}

export default AdminCategoryList
