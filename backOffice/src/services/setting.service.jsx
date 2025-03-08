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
    return { status: res.data.status, user: res.data.admin, permission: res.data.permission}
  }) 
}