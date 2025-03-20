import axios from "axios";

export const getOrderList = () => {
  return axios.get('/api/backoffice/new-menufood').then((res) => {
    return {
      status: res.data.status,
      orderList: res.data.orderList
    }
  })
}

export const getAllOutFoods = () => {
  return axios.get('/api/backoffice/outfoodAll').then((res) => {
    return {
      status: res.data.status,
      outFoods: res.data.outFood
    }
  })
}