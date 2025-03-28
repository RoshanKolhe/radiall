import { Box, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function ApprovalUsersSection({ validators, productionHeads, approvalUser}) {
    const [tableData, setTableData] = useState([]);
    const columnNames = [
        {value: 'user', label: 'User'},
        {value: 'department', label: 'Department'},
        {value: 'role', label: 'Role'},
        {value: 'remark', label: 'Remark'},
        {value: 'approvedDate', label: 'Approved Date'},
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
                approvedDate: user?.approvalDate ? format(new Date(user?.approvalDate), "dd MMMM yyyy") : '',
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
                approvedDate: user?.approvalDate ? format(new Date(user?.approvalDate), "dd MMMM yyyy") : '',
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

    useEffect(() => {
        if (approvalUser) {
            const data = {
                id: approvalUser?.id,
                user: `${approvalUser?.user?.firstName} ${approvalUser?.user?.lastName || ''}`,
                role: 'User',
                department: approvalUser?.user?.department?.name || '',
                remark: approvalUser?.remark || '',
                approvedDate: approvalUser?.approvalDate ? format(new Date(approvalUser?.approvalDate), "dd MMMM yyyy") : '',
                status: approvalUser?.isApproved ? 'Approved' : 'Pending'
            };
    
            setTableData((prevData) => {
                // Merge new data with existing table data, avoiding duplicates based on ID
                const existingIds = new Set(prevData.map(item => item.id));
    
                // Check if the ID already exists
                if (!existingIds.has(data.id)) {
                    return [...prevData, data]; // ✅ Add only if it's not already in the array
                }
    
                return prevData; // ✅ Return unchanged if duplicate
            });
        }
    }, [approvalUser]);
    
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
                                    {item?.approvedDate}
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
    approvalUser: PropTypes.object,
};
