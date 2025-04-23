import axios from "axios";

export const getOrderAll = () => {
  return axios.get('/api/backoffice/orderall').then((res) => {
    return {
      status: res.data.status,
      orders: res.data.data
    }
  })
}

export const getOrderCurrent = () => {
  return axios.get('/api/backoffice/orderallCurrent').then((res) => {
    return {
      status: res.data.status,
      orders: res.data.data
    }
  })
}

export const getOrderListTopmenu = () => {
  return axios.get('/api/backoffice/getOrderlistTopmenu').then((res) => {
    return {
      status: res.data.status,
      orderList: res.data.orderList
    }
  })
}

export const getOrderById = (id) => {
  return axios.get(`/api/backoffice/order/${id}`).then((res) => {
    return {
      status: res.data.status,
      order: res.data.data
    }
  })
}


export const getCountOrder = () => {
  return axios.get('/api/backoffice/getCountOrder').then((res) => {
    return {
      status: res.data.status,
      orderWait: res.data.orderWait
    }
  })
}