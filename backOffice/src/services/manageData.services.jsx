import axios from "axios";

export const getCategoryFoods = () => {
  return axios.get("/api/backoffice/catefood").then((res) => {
    return { status: res.data.status, cateFood: res.data.data };
  });
};

export const getCreateCategoryFood = (formData) => {
  return axios
    .post("/api/backoffice/catefood", formData)
    .then((res) => {
      return {
        status: res.data.status,
        description: res.data.description,
        title: res.data.title,
        data: res.data.data
      };
    })
    .catch((err) => {
      throw {
        status: err.response.data.status,
        description: err.response.data.description,
        title: err.response.data.title,
      };
    });
};

export const getUpdateCategoryFood = (id, formData) => {
  return axios
    .post(`/api/backoffice/catefood/${id}`, formData)
    .then((res) => {
      return {
        status: res.data.status,
        description: res.data.description,
        title: res.data.title,
      };
    })
    .catch((err) => {
      throw {
        status: err.response.data.status,
        description: err.response.data.description,
        title: err.response.data.title,
      };
    });
};

export const getDeleteCategoryFood = (id) => {
  return axios
    .delete(`/api/backoffice/catefood/${id}`)
    .then((res) => {
      return {
        status: res.data.status,
        description: res.data.description,
        title: res.data.title,
      };
    })
    .catch((err) => {
      throw {
        status: err.response.data.status,
        description: err.response.data.description,
        title: err.response.data.title,
      };
    });
};

export const getUpdateDisplayCatefood = (id, params) => {
  return axios
    .put(`/api/backoffice/catefood-status/${id}`, params)
    .then((res) => {
      return { res: res.data };
    });
};
