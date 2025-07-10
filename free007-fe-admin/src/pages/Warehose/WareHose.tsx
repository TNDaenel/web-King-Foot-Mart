import { useDeleteWareHouseMutation, useGetallWareHousesQuery } from '@/api/warehouse'
import TitlePage from '@/components/TitlePage/TitlePage'
import { Button, Input, InputRef, Modal, Popconfirm, Space, Table, notification } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'

import { IWareHose } from '@/interfaces'
import AddWare from './Add'
import Highlighter from 'react-highlight-words'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined } from '@ant-design/icons'

export default function WareHose() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [dataEdit, setDataEdit] = useState<IWareHose>()
  const { data: warehouseList } = useGetallWareHousesQuery()
  const [deleteWareHouse, wareHouseRes] = useDeleteWareHouseMutation()

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

  useEffect(() => {
    setIsModalVisible(isModalVisible)
  }, [])

  useEffect(() => {
    if (wareHouseRes.error) {
      notification.error({
        message: 'Error',
        description: (wareHouseRes.error as any).data.message
      })
    }
  }, [wareHouseRes.error])

  const handleDelete = async (id: string) => {
    try {
      deleteWareHouse(id).then(({ data }: any) => {
        if (data.data) {
          notification.success({
            message: 'Success',
            description: 'Xóa nhà cung cấp thành công'
          })
        }
      })
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Xóa nhà cung cấp không thành công'
      })
    }
  }
  const dataSource = warehouseList?.map((product) => ({
    key: product._id,
    name: product.name,
    allInventory: product.productId.reduce((acc, cur) => acc + cur.listQuantityRemain[0].quantity, 0),
    address: product.address,
    status: product.status,
    totalSoldOuts: product.totalSoldOuts,
    phoneNumber: product.phoneNumber
  }))

  const columns = [
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'SL Tồn',
      dataIndex: 'allInventory',
      key: 'allInventory'
    },
    // {
    //   title: 'SL Đã bán',
    //   dataIndex: 'totalSoldOuts',
    //   key: 'totalSoldOuts'
    // },

    {
      title: 'Số ĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status'
    },

    {
      title: 'Action',
      key: 'action',
      render: ({ key: _id }: { key: string }) => {
        return (
          <>
            <div className='space-x-2'>
              <Button
                type='primary'
                className='bg-blue-600'
                onClick={() => {
                  setIsModalVisible(true)
                  warehouseList && setDataEdit(warehouseList?.find((data) => data._id === _id))
                }}
              >
                <AiTwotoneEdit />
              </Button>

              <Popconfirm title='Bạn có muốn xóa' onConfirm={() => handleDelete(_id)} okText='Yes' cancelText='No'>
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
    <>
      <header className='flex items-center justify-between mb-4'>
        <TitlePage title='Quản lý nhà cung cấp' />
        <Button
          type='default'
          className='text-base flex items-center bg-[#2eb236] text-white font-semibold'
          onClick={() => {
            setIsModalVisible(true), setDataEdit(undefined)
          }}
        >
          Thêm Kho hàng
        </Button>
      </header>
      <Table bordered dataSource={dataSource} columns={columns} />
      <Modal
        destroyOnClose
        title={dataEdit ? 'Sửa kho hàng' : 'Thêm kho hàng'}
        open={isModalVisible}
        width='50%'
        footer={false}
        onCancel={() => setIsModalVisible(false)}
      >
        <AddWare dataSource={dataEdit ?? dataEdit} setIsModalVisible={setIsModalVisible} />
      </Modal>
    </>
  )
}
