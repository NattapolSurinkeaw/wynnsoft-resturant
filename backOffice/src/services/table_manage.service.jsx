import axios from "axios";

export const getTableall = () => {
  return axios.get('/api/backoffice/alltables').then((res) => {
    return {
      status: res.data.status,
      tables: res.data.tables
    }
  })
}

export const getCreateTable = (params) => {
  return axios.post('/api/backoffice/createTable', params).then((res) => {
    return {
      status: res.data.status,
      table: res.data.table
    }
  })
}

export const getBookingTable = (params) => {
  return axios.post('/api/backoffice/bookingtable', params).then((res) => {
    return {
      status: res.data.status,
      description: res.data.description
    }
  })
}

export const getGenerateQr = (id) => {
  return axios.get(`/api/backoffice/generate-qrcode/${id}`).then((res) => {
    return {
      status: res.data.status,
      token: res.data.token,
      description: res.data.description
    }
  })
}