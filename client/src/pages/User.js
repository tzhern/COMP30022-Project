import { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField
} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// components
import Cookies from 'js-cookie';
import axios from '../commons/axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'givenName', label: 'Customer Name', alignRight: false },
  { id: 'companyName', label: 'Company', alignRight: false },
  { id: 'emailAssress', label: 'Email', alignRight: false },
  { id: 'phoneNumber', label: 'Phone', alignRight: false },
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
      (_user) => _user.givenName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const nevigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [newGivenName, setGivenName] = useState('');
  const [newFamilyName, setFamilyName] = useState('');
  const [newEmailAddress, setEmailAddress] = useState('');
  const [newPhoneNumber, setPhoneNumber] = useState('');
  const [newCompanyName, setCompanyName] = useState('');
  const [newAbn, setAbn] = useState('');
  const [newAddress, setAddress] = useState('');
  const [newDescription, setDescription] = useState('');

  const handleInsertOpen = () => {
    setOpen(true);
  };
  const handleInsertClose = () => {
    setOpen(false);
  };

  // Get all customers
  useEffect(() => {
    if (Cookies.get('token')) {
      axios
        .get('/customer', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          if (response.status === 200) {
            setCustomers(response.data);
          }
        })
        .catch(() => {
          console.log('get customers failed');
        });
    } else {
      nevigate('/404', { replace: true });
    }
  }, [nevigate]);

  // insert new customer
  const insert = () => {
    axios
      .post(
        '/customer',
        {
          givenName: newGivenName,
          familyName: newFamilyName,
          emailAddress: newEmailAddress,
          phoneNumber: newPhoneNumber,
          companyName: newCompanyName,
          abn: newAbn,
          address: newAddress,
          notes: newDescription
        },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setGivenName();
          setFamilyName();
          setEmailAddress();
          setPhoneNumber();
          setCompanyName();
          window.location.reload(false);
        }
      })
      .catch(() => {
        alert('Fail insert!');
      });
  };

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
      const newSelecteds = customers.map((n) => n._id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0;

  const filteredUsers = applySortFilter(customers, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Dashboard: Customer">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Customer
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleInsertOpen}
          >
            New Customer
          </Button>
          <Dialog onClose={handleInsertClose} aria-labelledby="add-customer-dialog" open={open}>
            <DialogTitle id="add-customer-dialog">Add New Customer</DialogTitle>
            <DialogContent>
              <DialogContentText> Enter details of new customer delow. </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="customer-given-name"
                label="Given Name"
                type="text"
                value={newGivenName}
                onChange={(e) => setGivenName(e.target.value)}
                fullWidth
                placeholder="givenName"
              />
              <TextField
                margin="dense"
                id="customer-family-name"
                label="Family Name"
                type="text"
                value={newFamilyName}
                onChange={(e) => setFamilyName(e.target.value)}
                fullWidth
                placeholder="familyName"
              />
              <TextField
                margin="dense"
                id="customer-email"
                label="Email"
                type="text"
                value={newEmailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                fullWidth
                placeholder="emailAddress"
              />
              <TextField
                margin="dense"
                id="customer-phone-number"
                label="Phone Number"
                type="number"
                value={newPhoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                placeholder="phoneNumber"
              />
              <TextField
                margin="dense"
                id="customer-company-name"
                label="Company Name"
                type="text"
                value={newCompanyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                placeholder="companyName"
              />
              <TextField
                margin="dense"
                id="customer-abn"
                label="ABN"
                type="number"
                value={newAbn}
                onChange={(e) => setAbn(e.target.value)}
                fullWidth
                placeholder="ABN"
              />
              <TextField
                margin="dense"
                id="customer-address"
                label="Address"
                type="text"
                value={newAddress}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                placeholder="Address"
              />
              <TextField
                multiline
                rows="5"
                margin="dense"
                id="customer-description"
                label="Desctiption"
                type="text"
                value={newDescription}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                placeholder="Desctiption"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleInsertClose} color="primary">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  insert();
                  handleInsertClose();
                }}
                color="primary"
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
        {customers.length > 0 ? (
          <Card>
            {/* search bar to search the customers */}
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              customerlist={selected}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={customers.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          givenName,
                          familyName,
                          emailAddress,
                          phoneNumber,
                          companyName,
                          _id
                        } = row;
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
                                onChange={(event) => handleClick(event, _id)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="normal">
                              <Typography variant="subtitle2" noWrap>
                                {givenName} {familyName}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{companyName}</TableCell>
                            <TableCell align="left">{emailAddress}</TableCell>
                            <TableCell align="left">{phoneNumber}</TableCell>
                            <TableCell align="right">
                              <UserMoreMenu customer={row} />
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
                  {isUserNotFound && (
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

            {/* display amount, change page and change row per page */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        ) : (
          <div style={{ textAlign: 'center' }}>
            It's loading... or currently you've got no customers
          </div>
        )}
      </Container>
    </Page>
  );
}
