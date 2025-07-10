import { useGetUserQuery, useRemoveUserMutation } from '@/api/user'
import TitlePage from '@/components/TitlePage/TitlePage'
import { pathRouter } from '@/constants/pathRouter'
import { IUser } from '@/interfaces/user'
import { Alert, Button, Input, InputRef, notification, Popconfirm, Skeleton, Space, Table, Tabs } from 'antd'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { render } from 'bizcharts/lib/g-components'
import moment from 'moment'
import { useRef, useState } from 'react'
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/es/list'
import Highlighter from 'react-highlight-words'

interface Props {
  userData: IUser[]
  isLoading: boolean
  confirm: (id: string) => void
}

const LayoutComponent = ({ isLoading, userData, confirm }: Props) => {
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

  const dataSource = userData?.map((user: IUser) => ({
    key: user._id,
    name: user.name,
    fullname: user.fullname,
    ngaysinh: user.ngaysinh,
    email: user.email,
    password: user.password,
    role: user?.role?.role_name,
    trang_thai: user.trang_thai
  }))

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      key: 'fullname',
      ...getColumnSearchProps('fullname')
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      key: 'ngaysinh',
      render: (data: string) => <span>{data ? moment(data).format('DD-MM-YYYY') : ''}</span>
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
      render: (data: string) => <span className='capitalize'>{data}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai'
    },
    {
      title: 'Action',
      key: 'action',
      render: (data: any) => (
        <>
          <div className='space-x-2'>
            <Link to={`/${pathRouter.admin}/${pathRouter.userList}/edit/${data?.key}`}>
              <Button type='primary' className='bg-blue-600'>
                <AiTwotoneEdit />
              </Button>
            </Link>
            <Popconfirm
              title='Bạn có muốn xóa'
              onConfirm={() => {
                if (data.role !== 'admin') {
                  confirm(data.key)
                }
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button type='primary' danger className='bg-red-600' disabled={data.role === 'admin'}>
                <AiTwotoneDelete />
              </Button>
            </Popconfirm>
          </div>
        </>
      )
    }
  ]
  return <>{isLoading ? <Skeleton /> : <Table dataSource={dataSource} columns={columns} />}</>
}

const AdminUser = () => {
  const { data: userData, isLoading } = useGetUserQuery()
  const [removeUser, { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess }] = useRemoveUserMutation()

  const handleFillterUser = (role: string) => {
    return userData?.users.filter((item) => item?.role?.role_name === role) || []
  }

  const confirm = (id: number | string) => {
    removeUser(id)
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Xóa thành công'
        })
      })
      .catch(() => {
        notification.error({
          message: 'Xóa thất bại'
        })
      })
  }
  const items = [
    {
      key: '1',
      label: 'Tất cả khách hàng',
      children: (
        <LayoutComponent
          userData={handleFillterUser('user')}
          confirm={confirm}
          isLoading={isLoading || isRemoveLoading}
        />
      )
    },
    {
      key: '2',
      label: 'Tất cả nhân viên',
      children: (
        <LayoutComponent
          userData={handleFillterUser('quản lý')}
          confirm={confirm}
          isLoading={isLoading || isRemoveLoading}
        />
      )
    },
    {
      key: '3',
      label: 'Admin',
      children: (
        <LayoutComponent
          userData={handleFillterUser('admin')}
          confirm={confirm}
          isLoading={isLoading || isRemoveLoading}
        />
      )
    }
  ]

  return (
    <div>
      <header className='flex items-center justify-between mb-4'>
        <TitlePage title='Quản lý người dùng' />
        <Button type='primary' danger>
          <Link to={`/${pathRouter.admin}/${pathRouter.userAdd}`}>Thêm người dùng</Link>
        </Button>
      </header>
      <div>
        <Tabs defaultActiveKey='1' items={items} className='text-white' />
        {isRemoveSuccess && <Alert message='Success Text' type='success' />}
      </div>
    </div>
  )
}

export default AdminUser
