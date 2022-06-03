import { useState, useEffect } from 'react';
// material
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, Button, TextField } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// components
import Cookies from 'js-cookie';
import axios from '../commons/axios';
import Page from '../components/Page';
import { ProductList } from '../components/_dashboard/products';

// ----------------------------------------------------------------------
export default function EcommerceShop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setName] = useState('');
  const [newDescription, setDescription] = useState('');
  const handleInsertOpen = () => {
    setOpen(true);
  };
  const handleInsertClose = () => {
    setOpen(false);
  };

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
    } else {
      navigate('/404', { replace: true });
    }
  }, [navigate]);

  // insert new product
  const insert = () => {
    axios
      .post(
        '/product',
        { name: newName, description: newDescription, avaliable: true },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log('Product is inserted!');
          setName();
          setDescription();
          window.location.reload(false);
        }
      })
      .catch(() => {
        alert('Fail insert! Remember you cant have products with the same name!');
      });
  };

  return (
    <Page title="Dashboard: Products">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Products
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleInsertOpen}
          >
            New Product
          </Button>
          <Dialog onClose={handleInsertClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Add New Product</DialogTitle>
            <DialogContent>
              <img src="/static/product.png" alt="product cover" height={350} width={400} />
              <DialogContentText> Enter the name of your new product below. </DialogContentText>
              <TextField
                rows="1"
                value={newName}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                placeholder="name"
              />
              <DialogContentText> Enter description of your new product below. </DialogContentText>
              <TextField
                multiline
                rows="3"
                value={newDescription}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                placeholder="description"
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
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            It's loading... or currently you've got no products
          </div>
        )}
      </Container>
    </Page>
  );
}
