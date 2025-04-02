import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  spare: icon('ic_spare'),
  toolType: icon('ic_toolType'),
  manufacturer: icon('ic_manufacturer'),
  supplier: icon('ic_supplier'),
  station: icon('ic_station'),
  storageLocation: icon('ic_storageLocation'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  scrap: icon('ic_scrap'),
  maintainance: icon('ic_maintainance')
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [{ title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: ['production_head'],
            children: [
              { title: t('list'), path: paths.dashboard.user.list, roles: ['production_head'] },
              { title: t('create'), path: paths.dashboard.user.new, roles: ['production_head'] },
            ],
          },
          {
            title: t('Production Means'),
            path: paths.dashboard.tools.root,
            icon: ICONS.toolType,
            roles: ['production_head', 'validator'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.tools.list,
                roles: ['production_head', 'validator'],
              },
              {
                title: t('create'),
                path: paths.dashboard.tools.new,
                roles: ['production_head', 'validator'],
              },
            ],
          },
          {
            title: t('spare'),
            path: paths.dashboard.spare.root,
            icon: ICONS.spare,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.spare.toolList,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('scrap master'),
            path: paths.dashboard.scrap.root,
            icon: ICONS.scrap,
            roles: ['production_head', 'validator', 'initiator'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.scrap.toolList,
                roles: ['production_head', 'validator', 'initiator'],
              }
            ]
          },
          {
            title: t('inventory'),
            path: paths.dashboard.inventory.root,
            icon: ICONS.spare,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.inventory.toolList,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('maintainance'),
            path: paths.dashboard.maintainancePlan.root,
            icon: ICONS.maintainance,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.maintainancePlan.toolList,
                roles: ['production_head'],
              },
            ],
          },
        ],
      },
      {
        subheader: t('masters'),
        items: [
          // Tool Type
          {
            title: t('Tool Type Master'),
            path: paths.dashboard.toolType.root,
            icon: ICONS.toolType,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.toolType.list,
                roles: ['production_head'],
              },
              {
                title: t('create'),
                path: paths.dashboard.toolType.new,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('Manufacturer Master'),
            path: paths.dashboard.manufacturer.root,
            icon: ICONS.manufacturer,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.manufacturer.list,
                roles: ['production_head'],
              },
              {
                title: t('create'),
                path: paths.dashboard.manufacturer.new,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('Supplier Master'),
            path: paths.dashboard.supplier.root,
            icon: ICONS.supplier,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.supplier.list,
                roles: ['production_head'],
              },
              {
                title: t('create'),
                path: paths.dashboard.supplier.new,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('Tools Department Master'),
            path: paths.dashboard.toolsDepartment.root,
            icon: ICONS.storageLocation,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.toolsDepartment.list,
                roles: ['production_head'],
              },
              {
                title: t('create'),
                path: paths.dashboard.toolsDepartment.new,
                roles: ['production_head'],
              },
            ],
          },
          {
            title: t('Station Master'),
            path: paths.dashboard.station.root,
            icon: ICONS.station,
            roles: ['production_head'],
            children: [
              {
                title: t('list'),
                path: paths.dashboard.station.list,
                roles: ['production_head'],
              },
              {
                title: t('create'),
                path: paths.dashboard.station.new,
                roles: ['production_head'],
              },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
