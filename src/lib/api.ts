import axios from "axios";

const apiAirsite = axios.create({
  baseURL: process.env.API_MANAGER,
  timeout: 1000,
});

export { apiAirsite };
