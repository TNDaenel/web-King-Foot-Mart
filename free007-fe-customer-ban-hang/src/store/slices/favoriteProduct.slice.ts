import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  favoriteProduct: {
    _id: string
    img: string
    productName: string
    price: number
    oldPrice?: number
  }[]
}

const favoriteProductSlice = createSlice({
  name: 'favoriteProduct',
  initialState: {
    favoriteProduct: []
  } as InitialStateType,
  reducers: {
    addFavoriteProduct: (state, action: PayloadAction<InitialStateType['favoriteProduct'][0]>) => {
      state.favoriteProduct.push(action.payload)
    },
    removeFavoriteProduct: (state, action: PayloadAction<string>) => {
      const index = state.favoriteProduct.findIndex((item) => item._id === action.payload)
      if (index !== -1) {
        state.favoriteProduct.splice(index, 1)
      }
    }
  }
})

export const { addFavoriteProduct, removeFavoriteProduct } = favoriteProductSlice.actions
const favoriteProductReducer = favoriteProductSlice.reducer
export default favoriteProductReducer
