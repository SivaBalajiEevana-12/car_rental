import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // change to your backend URL

// Generic request function
export const sendRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error making request:", error);
    throw error;
  }
};



export const registerUser = (data) => {
  return sendRequest("POST", "/auth/register", data);
};

export const loginUser = (data) => {
  return sendRequest("POST", "/auth/login", data);
};



export const getCars = () => {
  return sendRequest("GET", "/cars");
};

export const getCarById = (id) => {
  return sendRequest("GET", `/cars/${id}`);
};



export const bookCar = (data) => {
  return sendRequest("POST", "/booking", data);
};