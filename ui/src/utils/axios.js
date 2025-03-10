import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/me',
    login: '/login',
    register: '/register',
  },
  user: {
    list: '/api/users/list',
    notifications: '/notifications',
    filterNotificationList: (filter) => `/notifications?${filter}`,
    filterList: (filter) => `/api/users/list?${filter}`,
    details: (id) => `/api/users/${id}`,
    search: '/api/user/search',
    getDashboradCounts: '/getDashboardCounts',
  },
  department: {
    list: '/departments',
    filterList: (filter) => `/departments?${filter}`,
    details: (id) => `/departments/${id}`,
  },
};
