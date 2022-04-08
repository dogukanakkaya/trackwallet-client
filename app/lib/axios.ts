import axios from 'axios';

const request = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export {
  request
}