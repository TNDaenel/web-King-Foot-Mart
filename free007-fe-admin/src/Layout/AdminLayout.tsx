import { Layout, theme } from 'antd'
import React, { useState } from 'react'

import { Outlet } from 'react-router-dom'
import Header from './Component/Header/Header'
import Sidebar from './Component/Sidebar/Sidebar'

const { Content, Footer } = Layout

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout className='h-screen overflow-hidden' hasSider>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className='overflow-auto'>
        <Content style={{ margin: '0 12px' }} className='flex flex-col justify-between h-screen'>
          <Header />

          <div style={{ padding: 15, background: colorBgContainer }} className='flex-1'>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
