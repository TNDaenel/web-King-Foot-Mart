'use client'

import { SendOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Input, Layout, List, Typography } from 'antd'
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const { Header, Sider, Content } = Layout
const { Search } = Input
const { Title, Text } = Typography
interface Customer {
  _id: string
  name: string
  lastMessage: string
  unreadCount: number
}

interface Message {
  id: string
  content: string
  sender: 'customer' | 'admin'
  timestamp: Date
}

export default function AdminChat() {
  const [customers, setCustomers] = useState([])
  console.log('🚀 ~ AdminChat ~ customers:', customers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messageList, setMessageList] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : {}

  useEffect(() => {
    ;(async () => {
      const resUser = await fetch('http://localhost:8080/api/conversations/users')
      const dataUser = await resUser.json()
      const users = dataUser.users?.filter((item: any) => item._id !== user?._id)
      setCustomers(users)
    })()
  }, [])

  const handleGetMessages = async () => {
    const res = await fetch(`http://localhost:8080/api/conversations`)
    const data = await res.json()
    const messages = data?.conversations?.filter(
      (item: any) =>
        (item.receiver === selectedCustomer?._id && item.sender._id === user?._id) ||
        (item && item.receiver === user?._id && item.sender && item.sender._id === selectedCustomer?._id)
    )
    return messages
  }

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      // Assuming we have a way to get the user ID, replace 'customer_id' with the actual ID
      newSocket.emit('user_connected', '666033d8716f7449d5d91e95')
    })

    newSocket.on('new_message', (msg: Message) => {
      setMessageList((prevMessages: any) => [...prevMessages, msg] as never[])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const handleCustomerSelect = async (customer: any) => {
    const messages = await handleGetMessages()
    setSelectedCustomer(customer)
    setMessageList(messages)
    if (socket) {
      socket.emit('get_customer_messages', customer._id)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && selectedCustomer) {
      const messageData = {
        senderId: user?._id, // Replace with actual admin ID
        receiverId: selectedCustomer._id,
        content: newMessage
      }
      socket.emit('send_message', messageData)
      setNewMessage('')
    }
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme='light'>
        <List
          dataSource={customers}
          renderItem={(customer: any) => (
            <List.Item onClick={() => handleCustomerSelect(customer)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={customer.name}
                description={customer.lastMessage}
              />
              {customer.unreadCount > 0 && (
                <Avatar style={{ backgroundColor: '#1890ff' }}>{customer.unreadCount}</Avatar>
              )}
            </List.Item>
          )}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Title level={4}>
            {selectedCustomer ? `Chat với ${selectedCustomer.name}` : 'Chọn một khách hàng để bắt đầu chat'}
          </Title>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          {selectedCustomer ? (
            <Card
              style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ flex: 1, overflow: 'auto' }}
            >
              <List
                dataSource={messageList}
                renderItem={(message: any) => (
                  <List.Item
                    style={{
                      justifyContent:
                        message?.sender?._id === user?._id || message?.sender === user?._id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Card
                      style={{
                        maxWidth: '70%',
                        backgroundColor:
                          message?.sender?._id === user?._id || message?.sender === user?._id ? '#1890ff' : '#f0f0f0',
                        color:
                          message?.sender?._id === user?._id || message?.sender === user?._id
                            ? 'white'
                            : 'rgba(0, 0, 0, 0.85)'
                      }}
                    >
                      <p>{message.content}</p>
                      <Text type='secondary' style={{ fontSize: '12px' }}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </Text>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          ) : (
            <Card>
              <Text>Vui lòng chọn một khách hàng để xem tin nhắn</Text>
            </Card>
          )}
        </Content>
        {selectedCustomer && (
          <div style={{ padding: '16px' }}>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 32px)' }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                placeholder='Nhập tin nhắn...'
              />
              <Button className='bg-blue-600' type='primary' icon={<SendOutlined />} onClick={handleSendMessage} />
            </Input.Group>
          </div>
        )}
      </Layout>
    </Layout>
  )
}
