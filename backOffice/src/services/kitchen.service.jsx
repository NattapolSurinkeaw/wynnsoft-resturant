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

export const getUpdateNoteOutFood = (id, params) => {
  return axios.post(`/api/backoffice/updatenote-outfood/${id}`, params).then((res) => {
    return {
      status: res.data.status,
      food: res.data.food,
      message: res.data.message
    }
  })
}

export const getCancelOutFood = (id) => {
  return axios.get(`/api/backoffice/canceloutfood/${id}`).then((res) => {
    return {
      status: res.data.status,
      message: res.data.message
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

export const getCallStaff = (type) => {
  return axios.post(`/api/backoffice/onCallStaff/${type}`).then((res) => {
    return {
      status: res.data.status
    }
  })
}

export const getReportOutFood = (id) => {
  return axios.post(`/api/backoffice/status-outfood/${id}`).then((res) => {
    return {
      status: res.data.status
    }
  })
}

export const getChangeStatusOrderList = (params) => {
  return axios.post('/api/backoffice/changestatusOrderlist', params).then((res) => {
    return {
      status: res.data.status,
      
    }
  })
}

export const getDeleteOrderList = (id) => {
  return axios.post(`/api/backoffice/deleteorderlist/${id}`).then((res) => {
    return {
      status: res.data.status,
      message: res.data.message
    }
  })
}

export const getDeleteOrder = (params) => {
  return axios.post('/api/backoffice/deleteOrder', params).then((res) => {
    return {
      status: res.data.status,
      
    }
  })
}