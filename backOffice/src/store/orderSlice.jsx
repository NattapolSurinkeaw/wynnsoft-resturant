import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: 0,
  payment: 0,
  waitServe: 0,
};

const orderSlice = createSlice({
  name: 'orderStatus',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
    },
    setWaitServe: (state, action) => {
      state.waitServe = action.payload;
    },
    resetOrderStatus: () => initialState,
  },
});

export const { setOrder, setPayment, setWaitServe, resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;