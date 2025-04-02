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

export default function MaintainanceTableRow({ row, selected, handleQuickEditRow, handleQuickViewRow }) {
  const { maintainancePlan, createdAt } = row;
  const { responsibleUser, description, level, periodicity} = maintainancePlan;

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{description}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{level === 1 ? 'level 1' : 'level 2' || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{periodicity}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${responsibleUser?.firstName} ${responsibleUser?.lastName}`}</TableCell>
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
        {/* <TableCell>
          <Label
            variant="soft"
            color={(isActive && 'success') || (!isActive && 'error') || 'default'}
          >
            {isActive ? 'Active' : 'Non-Active'}
          </Label>
        </TableCell> */}

        {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color="default"
              onClick={() => {
                handleQuickEditRow(row);
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View" placement="top" arrow>
            <IconButton
              onClick={() => {
                handleQuickViewRow(row);
              }}
            >
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleQuickEditRow(row);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}

MaintainanceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleQuickEditRow: PropTypes.func,
  handleQuickViewRow: PropTypes.func,
};
