import { createSlice } from '@reduxjs/toolkit'

const storedCart = localStorage.getItem('agro_cart')

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [],
}

const persist = (state) => {
  localStorage.setItem('agro_cart', JSON.stringify(state.items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.product.id === action.payload.product.id)
      if (existing) {
        existing.quantity += action.payload.quantity || 1
      } else {
        state.items.push({ ...action.payload })
      }
      persist(state)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
      persist(state)
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const target = state.items.find((item) => item.product.id === id)
      if (target && quantity > 0) {
        target.quantity = quantity
      }
      persist(state)
    },
    clearCart(state) {
      state.items = []
      persist(state)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer







