import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import Cookies from 'js-cookie';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import axios from '../../../commons/axios';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppItemOrders() {
  const [orders, setOrders] = useState([]);
  // Get all orders
  useEffect(() => {
    if (Cookies.get('token')) {
      axios
        .get('/order', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          if (response.status === 200) {
            setOrders(response.data);
          }
        })
        .catch(() => {
          console.log('get orders failed');
        });
    }
  }, []);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon="icon-park-outline:transaction-order" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(orders.length)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total Orders
      </Typography>
    </RootStyle>
  );
}
