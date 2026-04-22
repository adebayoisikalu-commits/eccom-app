import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-g5xv.onrender.com/api",
});

export default api;