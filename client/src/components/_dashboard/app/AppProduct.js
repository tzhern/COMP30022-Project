import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import Cookies from 'js-cookie';
import { fShortenNumber } from '../../../utils/formatNumber';
import axios from '../../../commons/axios';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
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
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppBugReports() {
  const [products, setProducts] = useState([]);
  // Get all products
  useEffect(() => {
    if (Cookies.get('token')) {
      axios
        .get('/product', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          if (response.status === 200) {
            setProducts(response.data);
          }
        })
        .catch(() => {
          console.log('get products failed');
        });
    }
  }, []);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon="gridicons:product" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(products.length)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total Products
      </Typography>
    </RootStyle>
  );
}
