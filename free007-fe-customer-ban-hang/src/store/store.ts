import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import orderApi from './services/order.service'

import { newsApi } from '@/store/services/news.service'
import favoriteProductReducer from '@/store/slices/favoriteProduct.slice'
import { setupListeners } from '@reduxjs/toolkit/query'
import storage from 'redux-persist/lib/storage'
import { productApi } from '.'
import authApi from './services/auth.service'
import { categoryApi } from './services/categoriy.service'
import commentApi from './services/comment.service'
import paymentApi from './services/paymentServices'
import productApiReducer from './services/product.service'
import saleApi from './services/sale'
import sizeApi from './services/sizeApi'
import authReducer from './slices/auth.slice'
import cartReducer from './slices/cart.slice'
const rootReducer = combineReducers({
  [productApi.reducerPath]: productApiReducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [saleApi.reducerPath]: saleApi.reducer,
  [sizeApi.reducerPath]: sizeApi.reducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,

  // slice
  cart: cartReducer,
  user: authReducer,
  favoriteProduct: favoriteProductReducer
})

const middleware = [
  productApi.middleware,
  categoryApi.middleware,
  authApi.middleware,
  orderApi.middleware,
  paymentApi.middleware,
  saleApi.middleware,
  sizeApi.middleware,
  newsApi.middleware,
  commentApi.middleware
]

// lưu lại cart thôi
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'user', 'favoriteProduct']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middleware)
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
