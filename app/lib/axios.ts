import axios from 'axios';
import { API_GATEWAY_URL } from '../config.server';

// find a way to get gateway url from env in client also
const api = axios.create({
  baseURL: API_GATEWAY_URL || 'https://127.0.0.1:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

export {
  api
}

export interface SuccessResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}