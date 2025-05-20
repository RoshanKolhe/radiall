import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { useGetSparesWithFilter } from 'src/api/spare';
import { _roles, COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import { useGetTool } from 'src/api/tools';
import { Box, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import axiosInstance from 'src/utils/axios';
import SpareTableRow from '../spare-table-row';
import SpareTableToolbar from '../spare-table-toolbar';
import SpareTableFiltersResult from '../spare-table-filters-result';
import SpareQuickEditForm from '../spare-quick-edit-form';
import SpareQuickViewForm from '../spare-quick-view-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...COMMON_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'partNumber', label: 'Part Number' },
  { id: 'description', label: 'Description' },
  { id: 'stock', label: 'Qty safety stock' },
  { id: 'stockInHand', label: 'Stock In Hand' },
  { id: 'unit', label: 'Unit' },
  { id: 'comment', label: 'Comment' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'alarm', label: 'Alarm', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function SpareListView() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const { id: toolId } = params;

  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [quickEditRow, setQuickEditRow] = useState();

  const quickEdit = useBoolean();

  const [quickViewRow, setQuickViewRow] = useState();

  const quickView = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const filter = JSON.stringify({ where: { toolsId : toolId } });
  const encodedFilter = encodeURIComponent(filter);

  const { tool } = useGetTool(toolId);
  const { filteredSpares: spares, refreshFilterSpares: refreshSpares } =
    useGetSparesWithFilter(encodedFilter);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleQuickEditRow = useCallback(
    (row) => {
      setQuickEditRow(row);
      quickEdit.onTrue();
    },
    [quickEdit]
  );

  const handleQuickViewRow = useCallback(
    (row) => {
      setQuickViewRow(row);
      quickView.onTrue();
    },
    [quickView]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    if (spares) {
      setTableData(spares);
    }
  }, [spares]);

  const handleDownloadSpareList = async(id) => {
    try {
      const response = await axiosInstance.get(`/download-spare-list/${id}`, {
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'spare-list.xlsx'); 
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      enqueueSnackbar(`${error?.message || 'No records found'}`, {variant : 'error'});
      console.error('Error while downloading spare list', error);
    }
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tool List', href: paths.dashboard.spare.root },
            { name: 'List' },
          ]}
          action={
            <Box sx={{width: '100%', textAlign: {xs: 'left', md: 'right'}, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'end'}} component='div'>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => {
                  setQuickEditRow(null);
                  quickEdit.onTrue();
                }}
              >
                New Spare
              </Button>
              <Button sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} variant='contained' onClick={() => handleDownloadSpareList(tool?.id)} >
                <Iconify icon="mdi:download" width={18}/>            
                Download
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Part Number : </strong> {tool?.partNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Serial Number :</strong> {tool?.meanSerialNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Asset Number :</strong> {tool?.assetNumber ? tool?.assetNumber : 'NA'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Manufacturer :</strong> {tool?.manufacturer?.manufacturer}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Supplier :</strong> {tool?.supplier?.supplier}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Location :</strong> {tool?.storageLocation?.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Date :</strong>{' '}
              {tool && tool?.createdAt ? format(new Date(tool?.createdAt), 'dd MMM yyyy') : 'NA'}
            </Typography>
          </Grid>
        </Grid>

        <Card sx={{ marginTop: '10px' }}>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '1' && 'success') ||
                      (tab.value === '0' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData.length}
                    {tab.value === '1' && tableData.filter((spare) => spare.isActive).length}

                    {tab.value === '0' && tableData.filter((spare) => !spare.isActive).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <SpareTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_roles}
          />

          {canReset && (
            <SpareTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  showCheckbox={false}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <SpareTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        handleQuickEditRow={(user) => {
                          handleQuickEditRow(user);
                        }}
                        handleQuickViewRow={(user) => {
                          handleQuickViewRow(user);
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      {quickEdit.value && (
        <SpareQuickEditForm
          currentSpare={quickEditRow}
          open={quickEdit.value}
          onClose={() => {
            setQuickEditRow(null);
            quickEdit.onFalse();
          }}
          refreshSpares={refreshSpares}
          toolId={toolId}
          tool={tool}
        />
      )}

      {quickView.value && quickViewRow && (
        <SpareQuickViewForm
          currentSpare={quickViewRow}
          open={quickView.value}
          onClose={() => {
            setQuickViewRow(null);
            quickView.onFalse();
          }}
          refreshSpares={refreshSpares}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  const roleMapping = {
    production_head: 'Production Head',
    initiator: 'Initiator',
    validator: 'Validator',
  };
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((spare) =>
      Object.values(spare).some((value) => String(value).toLowerCase().includes(name.toLowerCase()))
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((spare) => (status === '1' ? spare.isActive : !spare.isActive));
  }

  if (role.length) {
    inputData = inputData.filter(
      (spare) =>
        spare.permissions &&
        spare.permissions.some((spareRole) => {
          console.log(spareRole);
          const mappedRole = roleMapping[spareRole];
          console.log('Mapped Role:', mappedRole); // Check the mapped role
          return mappedRole && role.includes(mappedRole);
        })
    );
  }

  return inputData;
}
