import { useGetRoleQuery, useRemoveRoleMutation } from '@/api/role'
import TitlePage from '@/components/TitlePage/TitlePage'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'

import { IRole } from '@/interfaces/role'
import { Alert, Button, Input, InputRef, Popconfirm, Skeleton, Space, Table } from 'antd'
import { Link } from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'

const RoleList = () => {
  const { data: roleData, error, isLoading } = useGetRoleQuery()
  const [removeRole, { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess }] = useRemoveRoleMutation()

  const confirm = (_id: string) => {
    removeRole(_id)
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

  const dataSource = roleData?.map((role: IRole) => ({
    key: role._id,
    description: role.description,
    role_name: role.role_name,
    trang_thai: role.trang_thai
  }))

  const columns = [
    {
      title: 'Tên vai trò',
      dataIndex: 'role_name',
      key: 'role_name',
      ...getColumnSearchProps('role_name')
    },
    {
      title: 'Mô tả vai trò',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai'
    },
    {
      render: ({ key: id }: { key: string }) => {
        return (
          <>
            <div className='flex space-x-2'>
              <Button className='bg-blue-600' type='primary'>
                <Link to={`/admin/role/update/${id}`}>
                  <AiTwotoneEdit />
                </Link>
              </Button>
              <Popconfirm title='Bạn muốn xóa không?' onConfirm={() => confirm(id)} okText='Yes' cancelText='No'>
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
      <header className='flex items-center justify-between mb-4'>
        <TitlePage title='Quản lý vai trò' />

        <Button type='primary' danger>
          <Link to='/admin/role/add'> Thêm Vai trò</Link>
        </Button>
      </header>
      {isRemoveSuccess && <Alert message='Success Text' type='success' />}
      {isLoading ? <Skeleton /> : <Table dataSource={dataSource} columns={columns} />}
    </div>
  )
}
export default RoleList
