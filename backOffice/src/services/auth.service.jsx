import axios from "axios";

export const getTest = () => {
  return axios.get('/test').then((res) => {
    return { message: res.data.message}
  })
}

export const getRegister = (formData) => {
  return axios.post('/api/admin/register', formData).then((res) => {
    return { status: res.data.status, message: res.data.message, description: res.data.description}
  }).catch((err) => err)
}

export const getLogin = (formData) => {
  return axios.post('/api/admin/signin', formData).then((res) => {
    return { 
      status: res.data.status, 
      message: res.data.message, 
      description: res.data.description,
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token
    }
  })
}