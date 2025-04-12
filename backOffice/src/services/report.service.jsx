import axios from "axios";

export const getTopmenu = () => {
  return axios.get('/api/backoffice/getBestSell').then((res) => {
    return {
      status: res.data.status, 
      data: res.data.data
    }
  })
}

export const getPureDataTopmenu = () => {
  return axios.get('/api/backoffice/puredataTopmenu').then((res) => {
    return {
      status: res.data.status,
      orderList: res.data.orderList,
      foods: res.data.foods
    }
  })
}