import axios from 'axios';
import { API_GATEWAY_URL } from '../config.server';

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

const base = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export {
  api,
  base
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