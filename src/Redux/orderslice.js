import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.title === action.payload.title);
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          state.items.push({ ...action.payload, quantity: 1 });
      }
  },
    incrementItem: (state, action) => {
      const item = state.items.find(item => item.title === action.payload.title);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementItem: (state, action) => {
      const item = state.items.find(item => item.title === action.payload.title);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.title !== action.payload.title);
      }
    },
    toggleIron: (state, action) => {
      const item = state.items.find(item => item.title === action.payload.title);
      if (item) {
        item.ironCloth = !item.ironCloth; // Toggle the ironing option
      }
    }
  }
});

export default orderSlice.reducer;