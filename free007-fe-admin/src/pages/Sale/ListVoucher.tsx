import { useGetAllSalesQuery, useGetSaleByIdQuery, useRemoveSaleMutation } from '@/api/sale'
import TitlePage from '@/components/TitlePage/TitlePage'
import { ISale } from '@/interfaces/sale'
import { Button, Input, InputRef, Popconfirm, Space, Table } from 'antd'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import FormSale from '@/components/FormSale/FormSale'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'
import Highlighter from 'react-highlight-words'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined } from '@ant-design/icons'

type DataType = {
  key: string
} & ISale

export default function ListVoucher() {
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [isModalOpenCreate, setIsModalOpenCreate] = useState<boolean>(false)
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false)
  const [idUpdate, setIdUpdate] = useState<string | null>()
  const { data: sales, isFetching } = useGetAllSalesQuery()
  const [removeSale] = useRemoveSaleMutation()
  const { data: sale } = useGetSaleByIdQuery(idUpdate as string, { skip: !idUpdate })

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

  const handleRemoveSale = (id: string) => {
    removeSale(id)
      .unwrap()
      .then(() => {
        toast.success('Xóa mã giảm giá thành công !')
      })
      .catch((error) => toast.error('Xóa thất bại ' + error.message))
  }

  const handleUpdate = (record: ISale) => {
    setIdUpdate(record._id)
    setIsModalOpenUpdate(true)
  }

  useEffect(() => {
    const _dataSource = sales?.data?.map((item, index) => ({
      key: item._id,
      index: index + 1,
      ...item
    }))
    setDataSource(_dataSource as DataType[])
  }, [sales])

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên mã giảm giá',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (name) => <div className='text-[#1e5460] text-center font-semibold'>{name}</div>
    },
    {
      title: 'Mã code',
      dataIndex: 'code',
      key: 'code',
      ...getColumnSearchProps('code'),
      render: (code) => <div className='text-[#1e5460] text-center font-semibold'>{code}</div>
    },
    {
      title: 'Thông tin giảm giá',
      key: 'sale',
      render: (sale) => (
        <div className='text-center'>
          - {sale.sale} {sale.type === 'cash' ? 'Vnd' : '%'}{' '}
        </div>
      )
    },
    {
      title: 'Số lần dùng',
      dataIndex: 'usageLimit',
      key: 'usageLimit',
      sorter: (a, b) => a.usageLimit - b.usageLimit,
      render: (usageLimit) => <div className='text-green-500 text-center'>{usageLimit}</div>
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      width: 150,
      render: (expirationDate) => (
        <div className='flex flex-col'>
          <span style={{ color: '#64748b', fontWeight: '600', fontSize: '15px' }}>
            {moment(expirationDate).format('DD-MM-yyyy')}
          </span>
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt) => (
        <div className='flex flex-col'>
          <span style={{ color: '#64748b', fontWeight: '600', fontSize: '15px' }}>
            {moment(createdAt).format('DD-MM-yyyy')}
          </span>

          <span className='text-sm mt-0.5' style={{ color: '#64748b', fontWeight: '500' }}>
            {moment(createdAt).format('HH:mm:ss')}
          </span>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        return (
          <div className='flex justify-center gap-2'>
            <Button className='ml-4 bg-blue-600' type='primary' onClick={() => handleUpdate(record)}>
              <AiTwotoneEdit />
            </Button>
            <Popconfirm
              placement='topRight'
              title='Xóa mã giảm giá?'
              description='Bạn có chắc chắn xóa mã giảm giá này không?'
              onConfirm={() => handleRemoveSale(record._id)}
              cancelText='Không'
            >
              <Button type='primary' danger className='bg-red-600'>
                <AiTwotoneDelete />
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <header className='flex items-center justify-between mb-4'>
        <TitlePage title='Quản lý Voucher' />
        <Button
          onClick={() => setIsModalOpenCreate(true)}
          className='text-base flex items-center bg-[#2eb236] text-white font-semibold'
        >
          <PlusOutlined />
          Thêm
        </Button>
      </header>
      <div className='mt-6'>
        <Table loading={isFetching} columns={columns} dataSource={dataSource} />
      </div>

      <FormSale isModalOpen={isModalOpenCreate} setIsModalOpen={setIsModalOpenCreate} mode='create' />

      <FormSale
        isModalOpen={isModalOpenUpdate}
        setIsModalOpen={setIsModalOpenUpdate}
        mode='edit'
        defaultValues={sale?.data}
      />
    </div>
  )
}
