import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";
import PropTypes, { object } from "prop-types";

export default function EntriesTable({entries}){
    const columnNames = [
        {value: 'returnBy', label: 'Return By' },
        {value: 'receivedFrom', label: 'Received from' },
        {value: 'returnDate', label: 'Return Date' },
        {value: 'quantity', label: 'Quantity' },
        {value: 'remark', label: 'Remark' },
    ];
    return(
        <Card sx={{mt : 2}}>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columnNames?.map((col) => (
                                <TableCell key={col?.value}>{col?.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries?.length > 0 && entries?.map((entry) => (
                            <TableRow key={entry?.id}> 
                                <TableCell>
                                    {`${entry.returnByUser?.firstName} ${entry.returnByUser?.lastName ? entry.returnByUser?.lastName : ''}`}
                                </TableCell>
                                <TableCell>
                                    {`${entry.receivedFromUser?.firstName} ${entry.receivedFromUser?.lastName ? entry.receivedFromUser?.lastName : ''}`}
                                </TableCell>
                                <TableCell>
                                    {entry?.createdAt ? format(new Date(entry?.createdAt), 'dd MM yyyy') : ''}
                                </TableCell>
                                <TableCell>
                                    {entry?.quantity}
                                </TableCell>
                                <TableCell>
                                    {entry?.remark}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

EntriesTable.propTypes = {
  entries: PropTypes.arrayOf(object),
};