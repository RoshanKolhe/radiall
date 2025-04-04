import { Card, CardContent, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";

export default function ToolInfoCard({toolData}){
    return(
        <Card>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Part Number : </strong> {toolData?.partNumber}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Serial Number :</strong> {toolData?.meanSerialNumber}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Asset Number :</strong> {toolData?.assetNumber ? toolData?.assetNumber : 'NA'}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Manufacturer :</strong> {toolData?.manufacturer?.manufacturer}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Supplier :</strong> {toolData?.supplier?.supplier}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Location :</strong> {toolData?.storageLocation}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                        <strong>Date :</strong>{' '}
                        {toolData && toolData?.createdAt ? format(new Date(toolData?.createdAt), 'dd MMM yyyy') : 'NA'}
                    </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
};

ToolInfoCard.propTypes = {
    toolData : PropTypes.object,
}