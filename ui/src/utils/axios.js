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
  toolType: {
    list: '/tool-types',
    filterList: (filter) => `/tool-types?${filter}`,
    details: (id) => `/tool-types/${id}`,
  },
  manufacturer: {
    list: '/manufacturers',
    filterList: (filter) => `/manufacturers?${filter}`,
    details: (id) => `/manufacturers/${id}`,
  },
  supplier: {
    list: '/suppliers',
    filterList: (filter) => `/suppliers?${filter}`,
    details: (id) => `/suppliers/${id}`,
  },
  spare: {
    list: '/spares',
    filterList: (filter) => `/spares?${filter}`,
    details: (id) => `/spares/${id}`,
  },
  inventory: {
    list: '/inventorys',
    filterList: (filter) => `/inventorys?${filter}`,
    details: (id) => `/inventorys/${id}`,
  },
  station: {
    list: '/stations',
    filterList: (filter) => `/stations?${filter}`,
    details: (id) => `/stations/${id}`,
  },
  storageLocation: {
    list: '/storage-locations',
    filterList: (filter) => `/storage-locations?${filter}`,
    details: (id) => `/storage-locations/${id}`,
  },
  // TOOLS
  tools: {
    list: '/tools/list',
    details: (id) => `/tools/${id}`,
    filterList: (filter) => `/tools?${filter}`,
  },
  // INSTALLATION FORM
  installationForm: {
    details: (toolId) => `/installation-form/form-by-toolId/${toolId}`
  },
  // INTERNAL VALIDATION FORM
  internalValidationForm: {
    details: (toolId) => `/internal-validation-form/form-by-toolId/${toolId}`
  },
  // SCRAPPING FORM
  scrappingForm: {
    details: (toolId) => `/scrapping-form/form-by-toolId/${toolId}`
  },
  // TOOLS DEPARTMENT MASTER
  toolDepartment: {
    list: '/tools-departments',
    filterList: (filter) => `/tools-departments?${filter}`,
    details: (id) => `/tools-departments/${id}`,
  },
};
