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

export const getUpdateStatusOrderList = (params) => {
  return axios.post('/api/backoffice/update-statusOrderList', params).then((res) => {
    return {
      status: res.data.status,

    }
  })
}