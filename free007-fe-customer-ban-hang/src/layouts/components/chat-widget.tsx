'use client'

import { isAuthenticated } from '@/routes'
import { MessageOutlined, SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Input, List, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const { Text } = Typography

interface Message {
  id: string
  content: string
  sender: string
  createdAt: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = isAuthenticated()

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`http://localhost:8080/api/conversations`)
      const data = await res.json()
      setMessages(
        data.conversations.filter(
          (item: any) =>
            (item.sender && item.sender._id === user?._id && item && item.receiver === '666033d8716f7449d5d91e95') ||
            (item.receiver && item.receiver === user?._id && item && item.sender._id === '666033d8716f7449d5d91e95')
        )
      )
    })()
  }, [user._id])

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
      newSocket.emit('user_connected', user._id)
    })

    newSocket.on('new_message', (msg: Message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...msg,
          sender: msg.sender === user._id ? user._id : 'store'
        }
      ])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [user._id])

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      const messageData = {
        senderId: user._id, // Replace with actual customer ID
        receiverId: '666033d8716f7449d5d91e95', // Replace with actual store ID
        content: newMessage
      }
      socket.emit('send_message', messageData)
      setNewMessage('')
    }
  }

  return (
    <>
      {isOpen && (
        <Card
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            padding: 0
          }}
          className='overflow-y-scroll'
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Text strong>Chat với cửa hàng</Text>
          </div>
          <List
            style={{ flex: 1, overflowY: 'auto', padding: '16px' }}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                style={{
                  justifyContent:
                    message.sender._id === user._id || message.sender === user._id ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', maxWidth: '80%' }}>
                  {message.sender === 'store' && <Avatar style={{ marginRight: '8px' }}>C</Avatar>}
                  <div
                    style={{
                      background:
                        message.sender._id === user._id || message.sender === user._id ? '#1890ff' : '#f0f0f0',
                      color:
                        message.sender._id === user._id || message.sender === user._id
                          ? 'white'
                          : 'rgba(0, 0, 0, 0.85)',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      maxWidth: '100%'
                    }}
                  >
                    <Text style={{ color: 'inherit' }}>{message.content}</Text>
                    <div>
                      <Text type='secondary' style={{ fontSize: '12px' }}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </div>
                  </div>
                  {message.sender === user._id && <Avatar style={{ marginLeft: '8px' }}>K</Avatar>}
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }} className='sticky bottom-0 left-0 bg-white'>
            <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Nhập tin nhắn của bạn...'
                style={{ flex: 1, marginRight: '8px' }}
              />
              <Button type='primary' className='bg-blue-600' htmlType='submit' icon={<SendOutlined />} />
            </form>
          </div>
        </Card>
      )}
      <Button
        type='primary'
        shape='circle'
        className='bg-blue-600'
        icon={<MessageOutlined />}
        size='large'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px'
        }}
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  )
}
