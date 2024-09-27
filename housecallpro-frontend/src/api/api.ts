// src/api/api.ts

import axios, { AxiosInstance } from 'axios';

const serverApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default serverApi;
