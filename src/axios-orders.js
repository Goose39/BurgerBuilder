import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://react-burger-builder-f87e9.firebaseio.com/'
});

export default axiosInstance;