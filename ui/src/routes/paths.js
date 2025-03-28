// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/admin/login`,
      register: `${ROOTS.AUTH}/admin/register`,
      forgotPassword: `${ROOTS.AUTH}/admin/forgot-password`,
      newPassword: `${ROOTS.AUTH}/admin/new-password`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    profile: `${ROOTS.DASHBOARD}/profile`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    // USER
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/user/${id}/view`,
    },
    // TOOLTYPE
    toolType: {
      root: `${ROOTS.DASHBOARD}/toolType`,
      new: `${ROOTS.DASHBOARD}/toolType/new`,
      list: `${ROOTS.DASHBOARD}/toolType/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/toolType/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/toolType/${id}/view`,
    },
    // MANUFACTURER
    manufacturer: {
      root: `${ROOTS.DASHBOARD}/manufacturer`,
      new: `${ROOTS.DASHBOARD}/manufacturer/new`,
      list: `${ROOTS.DASHBOARD}/manufacturer/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/manufacturer/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/manufacturer/${id}/view`,
    },
    // SUPPLIER
    supplier: {
      root: `${ROOTS.DASHBOARD}/supplier`,
      new: `${ROOTS.DASHBOARD}/supplier/new`,
      list: `${ROOTS.DASHBOARD}/supplier/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/supplier/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/supplier/${id}/view`,
    },
    // STORAGE LOCATION
    storageLocation: {
      root: `${ROOTS.DASHBOARD}/storageLocation`,
      new: `${ROOTS.DASHBOARD}/storageLocation/new`,
      list: `${ROOTS.DASHBOARD}/storageLocation/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/storageLocation/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/storageLocation/${id}/view`,
    },
    // STATION
    station: {
      root: `${ROOTS.DASHBOARD}/station`,
      new: `${ROOTS.DASHBOARD}/station/new`,
      list: `${ROOTS.DASHBOARD}/station/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/station/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/station/${id}/view`,
    },
    // TOOLS
    tools: {
      root: `${ROOTS.DASHBOARD}/tools`,
      new: `${ROOTS.DASHBOARD}/tools/new`,
      list: `${ROOTS.DASHBOARD}/tools/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/tools/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/tools/${id}/view`,
      installationForm: (id) => `${ROOTS.DASHBOARD}/tools/${id}/installation-form`,
      internalValidationForm: (id) => `${ROOTS.DASHBOARD}/tools/${id}/internal-validation-form`,
    },
    // SPARE
    spare: {
      root: `${ROOTS.DASHBOARD}/spare`,
      toolList: `${ROOTS.DASHBOARD}/spare/toolList`,
      new: (toolId) => `${ROOTS.DASHBOARD}/spare/${toolId}/new`,
      list: (toolId) => `${ROOTS.DASHBOARD}/spare/${toolId}/list`,
      edit: (toolId, id) => `${ROOTS.DASHBOARD}/spare/${toolId}/edit/${id}`,
      view: (toolId, id) => `${ROOTS.DASHBOARD}/spare/${toolId}/view/${id}`,
    },
    // SCRAP
    scrap: {
      root: `${ROOTS.DASHBOARD}/scrap`,
      toolList: `${ROOTS.DASHBOARD}/scrap/toolList`,
      scrappingForm: (id) => `${ROOTS.DASHBOARD}/scrap/${id}/scrapping-form`
    },
    
    // INVENTORY
    inventory: {
      root: `${ROOTS.DASHBOARD}/inventory`,
      toolList: `${ROOTS.DASHBOARD}/inventory/toolList`,
      new: `${ROOTS.DASHBOARD}/inventory/new`,
      list: (toolId) => `${ROOTS.DASHBOARD}/inventory/${toolId}/list`,
      edit: (toolId, id) => `${ROOTS.DASHBOARD}/inventory/${toolId}/edit/${id}`,
      view: (toolId, id) => `${ROOTS.DASHBOARD}/inventory/${toolId}/view/${id}`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
