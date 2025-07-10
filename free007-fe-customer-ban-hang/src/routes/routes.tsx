import { AdminLayout } from '@/layouts'
import AccountLayout from '@/layouts/account-layout'
import { SigninPage, SignupPage } from '@/pages'
import { CartPage } from '@/pages/cart'
import { DetailPage } from '@/pages/detail'
import HomePage from '@/pages/home/home-page'
import Orderr from '@/pages/order/Order'
import OrderHistory from '@/pages/OrderHistory'
import FavoriteProduct from '@/pages/profile/favorite-product'
import OrderDetail from '@/pages/profile/order-detail'
import Profile from '@/pages/profile/profile'

import NewsPage from '@/pages/news'
import PaymentResult from '@/pages/order/ResultOrder'
import ShopPage from '@/pages/shop/shop-page'
import { createBrowserRouter, Navigate } from 'react-router-dom'

export const isAuthenticated = () => {
  const userString = localStorage.getItem('user_client')
  const user = userString ? JSON.parse(userString) : {}

  return user
}
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to='/' />
}

export const routers = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: 'shop',
        element: <ShopPage />
      },
      {
        path: 'product/:id',
        element: <DetailPage />
      },
      {
        path: 'news',
        element: <NewsPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: '/order',
        element: <Orderr />
      },
      {
        path: '/order-history',
        element: <OrderHistory />
      },
      { path: 'my-order/:id', element: <OrderDetail /> },
      {
        path: '/products/checkout/payment-result',
        element: <PaymentResult />
      }
    ]
  },
  {
    path: '/profile',
    element: <PrivateRoute element={<AccountLayout />} />,
    children: [
      { index: true, element: <Profile /> },
      { path: 'favorite-product', element: <FavoriteProduct /> },
      { path: 'my-order', element: <OrderHistory /> }
      // { path: 'change-password', element: <ChangePassword /> }
    ]
  },
  {
    path: 'signin',
    element: <SigninPage />
  },
  {
    path: 'signup',
    element: <SignupPage />
  }
])
