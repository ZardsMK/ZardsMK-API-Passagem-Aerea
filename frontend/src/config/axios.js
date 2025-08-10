import axios from 'axios';
import { baseApiURL, userKey } from '../global';

export const axiosInstance = axios.create({
  baseURL: baseApiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const user = JSON.parse(localStorage.getItem(userKey));
if (user && user.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
}

axiosInstance.interceptors.request.use(config => {
  const storedUser = JSON.parse(localStorage.getItem(userKey));
  if (storedUser && storedUser.token) {
    config.headers['Authorization'] = `Bearer ${storedUser.token}`;
  }
  return config;
});

export default { axiosInstance, user };