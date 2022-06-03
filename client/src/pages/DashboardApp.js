import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Cookies from 'js-cookie';
import Page from '../components/Page';
import {
  AppTotalSales,
  AppNewUsers,
  AppProduct,
  AppItemOrders,
  AppOrderTimeline,
  AppOrderCondition,
  AppEachProductsSales
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get('token')) {
      console.log('success');
    } else {
      navigate('/404', { replace: true });
    }
  }, [navigate]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalSales />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppProduct />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppOrderCondition />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppEachProductsSales />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
