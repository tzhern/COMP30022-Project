import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material
import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Container,
  Stack,
  Typography
} from '@material-ui/core';

// components
import Moment from 'react-moment';
import Cookies from 'js-cookie';
import axios from '../commons/axios';
import Page from '../components/Page';
import { OrderListToolBar, OrderListHead, OrderMoreMenu } from '../components/_dashboard/order';

// components
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerId', label: 'Name', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'updateTime', label: 'LastUpdated', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_order) => _order.customerId.givenName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Order() {
  const navigate = useNavigate();
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
            console.log(response.data);
            setOrders(response.data);
          }
        })
        .catch(() => {
          console.log('get orders failed');
        });
    } else {
      navigate('/404', { replace: true });
    }
  }, [navigate]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredOrders = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isOrderNotFound = filteredOrders.length === 0;

  return (
    <Page title="order">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Order
          </Typography>
        </Stack>

        {orders.length > 0 ? (
          <Card>
            <OrderListToolBar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              orderids={selected}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <OrderListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={orders.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredOrders
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { updateTime, customerId, total, status, _id } = row;
                        const isItemSelected = selected.indexOf(_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, row._id)}
                              />
                            </TableCell>
                            <TableCell id="customerId" component="th" scope="row" padding="normal">
                              {customerId.givenName}
                            </TableCell>
                            <TableCell align="left">{total}</TableCell>
                            <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  (status === 'ongoing' && 'error') ||
                                  (status === 'cancelled' && 'error') ||
                                  'success'
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                            <TableCell align="left">
                              <Moment format="dddd DD.MM.YYYY HH:mm">{updateTime}</Moment>
                            </TableCell>

                            <TableCell align="right">
                              <OrderMoreMenu order={row} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isOrderNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        ) : (
          <div style={{ textAlign: 'center' }}>
            It's loading... or currently you've got no orders
          </div>
        )}
      </Container>
    </Page>
  );
}
