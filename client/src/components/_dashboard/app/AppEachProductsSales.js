import { useState, useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
import Cookies from 'js-cookie';
import axios from '../../../commons/axios';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppEachProductsSales() {
  // Get all products and orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

  const getAllProductsName = (products) => {
    const names = [];
    for (let i = 0; i < products.length; i += 1) {
      names.push(products[i].name);
    }
    return names;
  };

  const getProductsSales = (orders, products) => {
    const dict = {};
    for (let a = 0; a < products.length; a += 1) {
      dict[products[a].name] = 0;
    }
    for (let i = 0; i < orders.length; i += 1) {
      for (let j = 0; j < orders[i].details.length; j += 1) {
        dict[orders[i].details[j].name] += orders[i].details[j].quantity;
      }
    }
    const quantity = Object.values(dict);
    return quantity;
  };

  const chartData = [{ data: getProductsSales(orders, products) }];

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: getAllProductsName(products)
    }
  });

  return (
    <Card>
      <CardHeader title="Products' Sales" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
