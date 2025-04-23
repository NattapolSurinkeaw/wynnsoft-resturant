import axios from "axios";

// ดึงข้อมูลโต๊ะและการจอง
export const getTableall = () => {
  return axios.get('/api/backoffice/alltables').then((res) => {
    return {
      status: res.data.status,
      tables: res.data.tables
    }
  })
}

export const getTableOnly = () => {
  return axios.get('/api/backoffice/onlyTable').then((res) => {
    return {
      status: res.data.status,
      tables: res.data.table
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

export const getAddBillPayment = (params) => {
  return axios.post('/api/backoffice/getAddBill', params).then((res) => {
    return {
      status: res.data.status,
      
    }
  })
}

export const getEditTable = (id, params) => {
  return axios.post(`/api/backoffice/edittable/${id}`, params).then((res) => {
    return {
      status: res.data.status,
      table: res.data.table
    }
  })
}

export const getChangeTable = (params) => {
  return axios.post('/api/backoffice/changeTable', params).then((res) => {
    return {
      status: res.data.status,
      table: res.data.table
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

export const getAddOrderFood = (params) => {
  return axios.post('/api/frontoffice/orderfood', params).then((res) => {
    return {
      status: res.data.status,
      description: res.data.description
    }
  })
}