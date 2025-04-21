import { ListItemText } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import Label from 'src/components/label';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// sections
import CommonToolsListView from 'src/sections/common-tool-list/view/common-tools-list-view';

// ----------------------------------------------------------------------

export default function ScrapToolListPage() {
  const router = useRouter();

  const TABLE_HEAD = [
    { id: 'partNumber', label: 'Tool part number' },
    { id: 'meanSerialNumber', label: 'Serial Number' },
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
    { id: 'quantity', label: 'QTY' },
    {
      id: 'isActive',
      label: 'Tool Status',
      render: (value) => (
        <Label variant="soft" color={(value && 'success') || (!value && 'error') || 'default'}>
          {value ? 'Active' : 'Non-Active'}
        </Label>
      ),
    },
    {
      id: 'levelTwoMaintainance.status',
      label: 'Maintainance Status',
      render: (value, row) => {
        const revalidationDate = row.revalidationDate ? new Date(row.revalidationDate) : null;
        const currentDate = new Date();
    
        let status = 'No Maintenance';
        let color = 'default';
        // let daysLeft = '';
    
        if (revalidationDate) {
          const diffDays = differenceInDays(revalidationDate, currentDate);
    
          if (diffDays > 22) {
            status = `Operation (${diffDays} days left)`;
            color = 'success';
          } else if (diffDays > 2) {
            status = `Caution (${diffDays} days left)`;
            color = 'warning';
          } else if (diffDays >= 0) {
            status = `Due Today`;
            color = 'error';
          } else {
            status = `Overdue (${Math.abs(diffDays)} days ago)`;
            color = 'error';
          }
        }
    
        return (
          <Label variant="soft" color={color}>
            {status}
          </Label>
        );
      },
    },
    {
      id: 'revalidationDate',
      label: 'Revalidation Date',
      render: (value) => (
        <ListItemText
          primary={value ? format(new Date(value), 'dd MMM yyyy') : 'NA'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      ),
    },
    { id: '', width: 88 },
  ];

  const ACTIONS = [
    {
      icon: 'ep:list',
      label: 'Maintainance Entries',
      onClick: (row) => {
        router.push(paths.dashboard.maintainancePlan.entries(row.id));
      },
    },
    {
      icon: 'mdi:plus-box',
      label: 'Maintainance Plan',
      onClick: (row) => {
        router.push(paths.dashboard.maintainancePlan.newPlan(row.id));
      },
    },
  ];

  const breadCrumb = [
    { name: 'Dashboard', href: paths.dashboard.root },
    { name: 'Tools', href: paths.dashboard.scrap.root },
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
