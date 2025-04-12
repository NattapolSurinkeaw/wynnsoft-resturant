import axios from "axios";

// start หมวดหมู่เมนู
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
        data: res.data.data,
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

// start เมนูอาหาร
export const getFood = () => {
  return axios.get("/api/backoffice/foods").then((res) => {
    return { status: res.data.status, foods: res.data.data };
  });
};

export const getUpdateBestSellerFood = (id, params) => {
  return axios.put(`/api/backoffice/food-status/${id}`, params).then((res) => {
    return { res: res.data };
  });
};

export const getDeleteFood = (id) => {
  return axios
    .delete(`/api/backoffice/food/${id}`)
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

export const getCreateFood = (formData) => {
  return axios
    .post("/api/backoffice/food", formData)
    .then((res) => {
      return {
        status: res.data.status,
        description: res.data.description,
        title: res.data.title,
        data: res.data.data,
      };
    })
    .catch((err) => {
      console.log(err)
      throw {
        status: err.response.data.status,
        description: err.response.data.description,
        title: err.response.data.title,
      };
    });
};

export const getUpdateFood = (id, formData) => {
  return axios
    .post(`/api/backoffice/food/${id}`, formData)
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

export const getCheckBillOrder = (formData) => {
  return axios.post('/api/backoffice/checkbillOrder', formData).then((res) => {
    return {
      status: res.data.status
    }
  })
}

export const getCallStaff = () => {
  return axios.get('/api/backoffice/getCallStaff').then((res) => {
    return {
      status: res.data.status,
      messageCall: res.data.messageCall
    }
  })
}

export const getAcceptCall = (params) => {
  return axios.post('/api/backoffice/getAcceptCall', params).then((res) => {
    return {
      status: res.data.status,
      
    }
  })
}

export const getHistoryOrder = () => {
  return axios.get('/api/backoffice/getOrderHistory').then((res) => {
    return {
      status: res.data.status,
      order: res.data.data,
      description: res.data.description,
    }
  })
}