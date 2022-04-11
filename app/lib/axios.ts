import axios from 'axios';
import { API_GATEWAY_URL } from '../config.server';

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
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