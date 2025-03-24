import { ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import Label from 'src/components/label';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// sections
import CommonToolsListView from 'src/sections/common-tool-list/view/common-tools-list-view';

// ----------------------------------------------------------------------

export default function InventoryToolListPage() {
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'partNumber', label: 'Tool part number' },
    { id: 'meanSerialNumber', label: 'Serial Number' },
    { id: 'toolType.toolType', label: 'Tool type' },
    { id: 'quantity', label: 'QTY' },
    {
      id: 'createdAt',
      label: 'Created At',
      render: (value) => (
        <ListItemText
          primary={format(new Date(value), 'dd MMM yyyy')}
          secondary={format(new Date(value), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      ),
    },
    {
      id: 'isActive',
      label: 'Status',
      render: (value) => (
        <Label variant="soft" color={(value && 'success') || (!value && 'error') || 'default'}>
          {value ? 'Active' : 'Non-Active'}
        </Label>
      ),
    },
    { id: '', width: 88 },
  ];

  const ACTIONS = [
    {
      icon: 'ep:list',
      label: 'Inventory List',
      onClick: (row) => {
        router.push(paths.dashboard.inventory.list(row.id));
      },
    },
  ];

  const breadCrumb = [
    { name: 'Dashboard', href: paths.dashboard.root },
    { name: 'Tools', href: paths.dashboard.spare.root },
    { name: 'List' },
  ];

  return (
    <>
      <Helmet>
        <title> Dashboard: Tools List</title>
      </Helmet>

      <CommonToolsListView
        tableHead={TABLE_HEAD}
        tableRowActions={ACTIONS}
        breadCrumb={breadCrumb}
      />
    </>
  );
}
