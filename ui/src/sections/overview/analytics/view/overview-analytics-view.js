import { useEffect, useState } from 'react';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import axiosInstance from 'src/utils/axios';
import SvgColor from 'src/components/svg-color';
//
import { Box, Card, CardContent, ListItemText } from '@mui/material';
import Label from 'src/components/label';
import { format } from 'date-fns';
import CommonToolsListView from 'src/sections/common-tool-list/view/common-tools-list-view';
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  scrap: icon('ic_scrap'),
  toolType: icon('ic_toolType'),
}

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const [data, setData] = useState(null);
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
      {
        id: 'installationStatus',
        label: 'Installation Status',
        render: (value) => (
          <Label variant="soft" color={(value === 'approved' && 'success') || (value === 'rejected' && 'error') || 'warning'}>
            {value}
          </Label>
        ),
      },
      {
        id: 'internalValidationStatus',
        label: 'Internal Validation Status',
        render: (value) => (
          <Label variant="soft" color={(value === 'approved' && 'success') || (value === 'rejected' && 'error') || 'warning'}>
            {value}
          </Label>
        ),
      },
      { id: '', width: 88 },
    ];

  const fetchCardsData = async () => {
    try{
      const response = await axiosInstance.get('/analytics/cards-data');
      if(response?.data){
        setData(response?.data);
      }
    }catch(error){
      console.error('Error while fetching cards data', error);
    }
  }

  useEffect(() => {
    fetchCardsData();
  },[])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Active Tools"
            total={data?.activeToolsCount}
            icon={ICONS.toolType}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Installation Pending"
            total={data?.installationPendingToolsCount}
            color="info"
            icon={ICONS.toolType}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Internal Validation Pending"
            total={data?.internalValidationPendingToolsCount}
            color="warning"
            icon={ICONS.toolType}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Scrapped Tools"
            total={data?.scrappedToolsCount}
            color="error"
            icon={ICONS.scrap}
          />
        </Grid>
      </Grid>
      <Box sx={{mt: 4}}>
        <CommonToolsListView
          tableHead={TABLE_HEAD}
        />
      </Box>
    </Container>
  );
}
