/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
// @mui
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function InventoryTableRow({ row, selected, handleInEntry }) {
  const {
    moNumber,
    moQuantity,
    department,
    issuedByUser,
    user,
    issuedDate,
    requiredDays,
    status,
    createdAt,
  } = row;
  const issuedDateObj = issuedDate ? new Date(issuedDate) : null;
  const today = new Date();
  const isOverdue =
    status === 0 &&
    issuedDateObj &&
    (today.getTime() - issuedDateObj.getTime()) / (1000 * 60 * 60 * 24) > requiredDays;
  const popover = usePopover();

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{moNumber}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{moQuantity}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{department}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${issuedByUser?.firstName} ${
        issuedByUser?.lastName ? issuedByUser?.lastName : ''
      }`}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${user?.firstName} ${
        user?.lastName ? user?.lastName : ''
      }`}</TableCell>
      <TableCell>
        <ListItemText
          primary={format(new Date(issuedDate), 'dd MMM yyyy')}
          secondary={format(new Date(issuedDate), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        {/* <ListItemText
            primary={createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA'}
            secondary={createdAt ? format(new Date(createdAt), 'p') : ''}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          /> */}{' '}
        NA
      </TableCell>
      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            status === 1
              ? 'success' // Returned
              : isOverdue
              ? 'error' // Overdue
              : 'warning' // Out
          }
        >
          {status === 1 ? 'Returned' : isOverdue ? 'Overdue' : 'Out'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="In Entry" placement="top" arrow>
          <IconButton
            color="default"
            onClick={() => {
              handleInEntry(row);
            }}
          >
            <Iconify icon="lets-icons:in" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

InventoryTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleInEntry: PropTypes.func,
};
