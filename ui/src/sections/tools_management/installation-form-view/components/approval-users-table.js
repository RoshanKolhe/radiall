import { Box, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function ApprovalUsersSection({ validators, productionHeads}) {
    const [tableData, setTableData] = useState([]);
    const columnNames = [
        {value: 'user', label: 'User'},
        {value: 'department', label: 'Department'},
        {value: 'role', label: 'Role'},
        {value: 'remark', label: 'Remark'},
        {value: 'status', label: 'Status'}
    ];

    useEffect(() => {
        if (validators?.length > 0) {
            const data = validators.map((user) => ({
                id: user?.id,
                user: `${user?.user?.firstName} ${user?.user?.lastName ? user?.user?.lastName : ''}`,
                role: 'Validator',
                department: user?.user?.department?.name || '',
                remark: user?.remark || '',
                status: user?.isApproved ? 'Approved' : 'Pending'
            }));
    
            setTableData((prevData) => {
                // Merge new data with existing table data, avoiding duplicates based on ID
                const existingIds = new Set(prevData.map(item => item.id));
                const newEntries = data.filter(item => !existingIds.has(item.id));
    
                return [...prevData, ...newEntries];
            });
        }
    }, [validators]);
    
    useEffect(() => {
        if (productionHeads?.length > 0) {
            const data = productionHeads.map((user) => ({
                id: user?.id,
                user: `${user?.user?.firstName} ${user?.user?.lastName ? user?.user?.lastName : ''}`,
                role: 'Production Head',
                department: user?.user?.department?.name || '',
                remark: user?.remark || '',
                status: user?.isApproved ? 'Approved' : 'Pending'
            }));
    
            setTableData((prevData) => {
                // Merge new data with existing table data, avoiding duplicates based on ID
                const existingIds = new Set(prevData.map(item => item.id));
                const newEntries = data.filter(item => !existingIds.has(item.id));
    
                return [...prevData, ...newEntries];
            });
        }
    }, [productionHeads]);
    

    return(
        <Card sx={{ p: 3, mt: 2 }}>
            <Grid item xs={12} md={12}>
                <Box component='div' sx={{width : '100%', py: 2, px: 1, borderBottom: '2px solid lightGray'}}>
                    <Typography variant='h5'>Approval Users</Typography>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                columnNames?.length > 0 && columnNames?.map((col) => (
                                    <TableCell key={col.value}>{col.label}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData?.length > 0 && tableData?.map((item) => (
                            <TableRow key={item?.id}>
                                <TableCell>
                                    {item?.user}
                                </TableCell>
                                <TableCell>
                                    {item?.department}
                                </TableCell>
                                <TableCell>
                                    {item?.role}
                                </TableCell>
                                <TableCell>
                                    {item?.remark}
                                </TableCell>
                                <TableCell>
                                    {item?.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        </Card>
    )
}

ApprovalUsersSection.propTypes = {
    validators: PropTypes.array,
    productionHeads : PropTypes.array,
};
