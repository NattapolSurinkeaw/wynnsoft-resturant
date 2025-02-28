import axios from "axios";

export const getCategoryFoods = () => {
  return axios.get('/api/backoffice/catefood').then((res) => {
    return { status: res.data.status, cateFood: res.data.data}
  })
}