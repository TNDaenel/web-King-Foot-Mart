import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer, Header, HeaderBottom, SpecialCase } from './components'
import ChatWidget from './components/chat-widget'

export const AdminLayout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  )
}
