import axios from "axios";

export const getTopmenu = () => {
  return axios.get('/api/backoffice/getBestSell').then((res) => {
    return {
      status: res.data.status, 
      data: res.data.data
    }
  })
}