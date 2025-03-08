import axios from "axios";

export const getWebinfoSetting = () => {
  return axios.get('/api/backoffice/webinfo').then((res) => {
    return { 
      status: res.data.status,
      webinfo: res.data.webinfo,
      webinfotype: res.data.webinfotype,
    }
  })
}
export const getUserAll = () => {
  return axios.get('/api/admin/get').then((res) => {
    return { 
      status: res.data.status, 
      user: res.data.admin, 
      permission: res.data.permission
    }
  }) 
}

export const getEditShopData = (params) => {
  return axios.post('/api/backoffice/editshopdata', params).then((res) => {
    return { 
      status: res.data.status, 
      description: res.data.description
    }
  })
}

export const getUpdateTaxService = (params) => {
  return axios.post('/api/backoffice/edittaxservice', params).then((res) => {
    return { 
      status: res.data.status,
      description: res.data.description
    }
  })
}

export const getBankAccount = () => {
  return axios.get('/abi/backoffice/getbank').then((res) => {
    return { 
      status: res.data.status,
      bank: res.data.bank
    }
  })
}

export const getUpdateBank = (id, formData) => {
  return axios.post(`/api/backoffice/updatebank/${id}`, formData).then((res) => {
    return { 
      status: res.data.status,
      message: res.data.message
    }
  })
}