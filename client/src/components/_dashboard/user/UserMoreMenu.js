import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { useNavigate } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Button
} from '@material-ui/core';
import { Form, Space, InputNumber } from 'antd';
import NativeSelect from '@material-ui/core/NativeSelect';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from '../../../commons/axios';

// ----------------------------------------------------------------------

export default function UserMoreMenu(customer) {
  const {
    givenName,
    familyName,
    emailAddress,
    phoneNumber,
    companyName,
    abn,
    address,
    notes,
    _id
  } = customer.customer;
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newEmailAddress, setNewEmailAddress] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newAbn, setNewAbn] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(true);
  };

  const handleIsClose = () => {
    setIsOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openDeleteDialog, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const [openEditDialog, setEditDialogOpen] = useState(false);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const [openDetailsDialog, setDetailsDialogOpen] = useState(false);

  const handleDetailsDialogOpen = () => {
    setDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
  };

  // Handle delete of the customer
  const submitDelete = () => {
    axios
      .delete(`/customer/${_id}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('customer delete success');
        } else {
          console.log('customer delete fail');
        }
      })
      .catch(() => {
        console.log('customer delete fail2');
      });
  };

  function DeleteCustomerDialog(props) {
    const { onClose, open } = props;
    const handleClose = () => {
      onClose(true);
    };

    return (
      <Dialog onClose={handleClose} aria-labelledby="delete-customer-dialog" open={open}>
        <DialogTitle id="delete-customer-dialog">Delete the Customer </DialogTitle>
        <DialogContent>
          <DialogContentText> Are you sure you want to delete this customer?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              submitDelete();
              handleClose();
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  DeleteCustomerDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  // Update customer profile
  const submitUpdate = () => {
    axios
      .put(
        `/customer/${_id}`,
        {
          givenName: newGivenName,
          familyName: newFamilyName,
          emailAddress: newEmailAddress,
          phoneNumber: newPhoneNumber,
          companyName: newCompanyName,
          abn: newAbn,
          address: newAddress,
          notes: newNotes
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('customer update success');
        }
      })
      .catch(() => {
        alert('customer update failed!');
      });
  };

  // see customer details popup
  function CustomerDetailsDialog(props) {
    const { onClose, open } = props;
    const handleClose = () => {
      onClose(true);
    };

    return (
      <Dialog onClose={handleClose} aria-labelledby="customer-details-dialog" open={open}>
        <DialogTitle id="customer-details-dialog">
          {givenName} {familyName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Company: {companyName}</DialogContentText>
          <DialogContentText>
            Email: <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
          </DialogContentText>
          <DialogContentText>Phone: {phoneNumber}</DialogContentText>
          <DialogContentText>ABN: {abn}</DialogContentText>
          <DialogContentText>Address: {address}</DialogContentText>
          <DialogContentText>Notes: {notes}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  CustomerDetailsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  function AddOrderDialog(props) {
    // eslint-disable-next-line
    const { onClose, open } = props;

    const handleClose = () => {
      onClose(true);
    };
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="edit-dialog-title">Edit your order </DialogTitle>
        <DialogContent>
          <DialogContentText> Adding a new order to {givenName}...</DialogContentText>
        </DialogContent>
        <DialogContent>
          <AddDetail />
        </DialogContent>
      </Dialog>
    );
  }

  function AddDetail() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [form] = Form.useForm();

    const onFinish = (values) => {
      console.log('Received values of form:', values.product);
      axios
        .post(
          `/order/${emailAddress}`,
          { cart: JSON.stringify(values.product) },
          // { name: values.name, price: values.price, quantity: values.quantity },
          { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
        )
        .then((response) => {
          if (response.status === 200) {
            window.location.reload(false);
            console.log('order info is updated');
          } else {
            console.log('order info update fail');
          }
        })
        .catch(() => {
          console.log('update fail');
        });
    };

    // Get all orders
    useEffect(() => {
      if (Cookies.get('token')) {
        axios
          .get('/product/available', {
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
      } else {
        navigate('/404', { replace: true });
      }
    }, [navigate]);

    return (
      <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
        <Form.List name="product">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.price !== curValues.price ||
                      prevValues.product !== curValues.product ||
                      prevValues.quantity !== curValues.quantity
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label="product"
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true, message: 'Missing product' }]}
                      >
                        <NativeSelect label="product">
                          <option> </option>
                          {products.map((item) => (
                            // eslint-disable-next-line
                            <option value={item.name}>{item.name}</option>
                          ))}
                        </NativeSelect>
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="Price"
                    name={[field.name, 'price']}
                    fieldKey={[field.fieldKey, 'price']}
                    rules={[{ required: true, message: 'Missing price' }]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="quantity"
                    name={[field.name, 'quantity']}
                    fieldKey={[field.fieldKey, 'quantity']}
                    rules={[{ required: true, message: 'Missing quantity' }]}
                  >
                    <InputNumber />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}

              <Form.Item>
                <div style={{ textAlign: 'center' }}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add product
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }

  return (
    <>
      <Tooltip title="Add a new order">
        <IconButton ref={ref} onClick={handleClickOpen}>
          <Icon icon="carbon:add-alt" width={20} height={20} />
        </IconButton>
      </Tooltip>
      <AddOrderDialog open={open} onClose={handleClose} />

      <IconButton ref={ref} onClick={handleIsOpen}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={handleIsClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem button="true" onClick={handleDetailsDialogOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon="mdi:card-account-details" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Details" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <CustomerDetailsDialog
          open={openDetailsDialog}
          onClose={handleDetailsDialogClose}
          customer={customer}
        />
        <MenuItem button="true" onClick={handleDeleteDialogOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <DeleteCustomerDialog open={openDeleteDialog} onClose={handleDeleteDialogClose} />

        <MenuItem button="true" onClick={handleEditDialogOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          onClose={handleEditDialogClose}
          aria-labelledby="change-customer-dialog"
          open={openEditDialog}
        >
          <DialogTitle id="change-customer-dialog">Change Customer Details</DialogTitle>
          <DialogContent>
            <DialogContentText> Enter new details of this customer delow. </DialogContentText>
            <TextField
              margin="dense"
              id="customer-first-name"
              label="Given Name"
              type="text"
              defaultValue={givenName}
              fullWidth
              onChange={(e) => setNewGivenName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-last-name"
              label="Family Name"
              type="text"
              defaultValue={familyName}
              fullWidth
              onChange={(e) => setNewFamilyName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-email"
              label="Email"
              type="text"
              defaultValue={emailAddress}
              fullWidth
              onChange={(e) => setNewEmailAddress(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-phone-number"
              label="Phone Number"
              type="number"
              defaultValue={phoneNumber}
              fullWidth
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-company-name"
              label="Company Name"
              type="text"
              defaultValue={companyName}
              fullWidth
              onChange={(e) => setNewCompanyName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-abn"
              label="ABN"
              type="number"
              defaultValue={abn}
              fullWidth
              onChange={(e) => setNewAbn(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              margin="dense"
              id="customer-address"
              label="Address"
              type="text"
              defaultValue={address}
              fullWidth
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <TextField
              multiline
              rows="5"
              margin="dense"
              id="customer-notes"
              label="Notes"
              type="text"
              defaultValue={notes}
              fullWidth
              onChange={(e) => setNewNotes(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                submitUpdate();
                handleEditDialogClose();
              }}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Menu>
    </>
  );
}
