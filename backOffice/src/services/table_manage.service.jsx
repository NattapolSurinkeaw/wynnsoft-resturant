import axios from "axios";

export const getGenerateQr = (id) => {
  return axios.get(`/api/backoffice/generate-qrcode/${id}`).then((res) => {
    return {
      status: res.data.status,
      token: res.data.token,
      description: res.data.description
    }
  })
}