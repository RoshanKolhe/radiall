/* eslint-disable no-else-return */
import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ToolsTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const navigate = useNavigate();
  const { individualSerialNumber, id, meanSerialNumber, partNumber, modelNumber, productionMeans, isMaintaincePlanNeeded, calibration, manufacturer, supplier, toolFamily, criticalLevel, installationChecklist, technicalDrawing, quantity, assetNumber, createdAt, installationStatus, isActive, internalValidationStatus, status, storageLocation, toolsDepartment, station, remark, isInternalValidationNeeded } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const getColorCode = (data) => {
    if (data === 'pending') {
      return 'warning';
    } else if (data === 'approved') {
      return 'success';
    } else if (data === 'rejected') {
      return 'error';
    }
    return 'default'; // or any fallback value
  };
  
  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap', pr:'150px'}}>{id}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{partNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{modelNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{productionMeans}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{quantity}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', pr:'150px' }}>{meanSerialNumber || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', pr:'150px' }}>{individualSerialNumber || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{assetNumber || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{installationChecklist || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{technicalDrawing || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{toolFamily || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{criticalLevel || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{isMaintaincePlanNeeded || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{calibration || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{storageLocation || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{toolsDepartment?.toolDepartment || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{station?.station || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{manufacturer?.manufacturer || 'NA'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{supplier?.supplier || 'NA'}</TableCell>
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(isActive && 'success') || (!isActive && 'error') || 'default'}
          >
            {isActive ? 'Active' : 'Non-Active'}
          </Label>
        </TableCell>        
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={(status === 'Operational' && 'success') || (status !== 'Operational' && 'error') || 'default'}
          >
            {status}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={getColorCode(installationStatus)}
          >
            {installationStatus}
          </Label>
        </TableCell >
        <TableCell sx={{px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Installation Form" placement="top" arrow>
              <IconButton
                onClick={() => {
                  navigate(paths.dashboard.tools.installationForm(row.id));
                }}
              >
                <Iconify icon="carbon:view-filled" />
              </IconButton>
          </Tooltip>
        </TableCell>
        {isInternalValidationNeeded ? 
          <>
            <TableCell sx={{pr:'80px'}}>
              <Label
                variant="soft"
                color={getColorCode(internalValidationStatus)}
              >
                {internalValidationStatus}
              </Label>
            </TableCell>
            <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
              <Tooltip title="Internal Validation Form" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      navigate(paths.dashboard.tools.internalValidationForm(row.id));
                    }}
                  >
                    <Iconify icon="carbon:view-filled" />
                  </IconButton>
              </Tooltip>
            </TableCell>
          </> 
          : 
          <>
                      <TableCell>NA</TableCell>
                      <TableCell>{' '}</TableCell>
          </>
        }

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{remark || 'NA'}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Passport" placement="top" arrow>
            <IconButton
              onClick={() => {
                navigate(paths.dashboard.tools.view(row.id));
              }}
            >
              <Iconify icon="fa-solid:passport" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color="default"
              onClick={() => {
                navigate(paths.dashboard.tools.edit(row.id));
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
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
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ToolsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
