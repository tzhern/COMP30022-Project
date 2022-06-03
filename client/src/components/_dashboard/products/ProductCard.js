import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  FormControlLabel,
  Switch,
  IconButton,
  Button,
  TextField
} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ColorizeIcon from '@material-ui/icons/Colorize';
import DeleteIcon from '@material-ui/icons/Delete';
import { styled } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import axios from '../../../commons/axios';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------
ShopProductCard.propTypes = {
  product: PropTypes.object
};

// Product card function
export default function ShopProductCard({ product }) {
  const { tag, name, available, description } = product;
  const [displayLabel, setDisplay] = useState(available);
  const [openEdit, setEditOpen] = useState(false);
  const [newName, setName] = useState('');
  const [newDescription, setDescription] = useState('');
  const [openDelete, setDeleteOpen] = useState(false);

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  // Handle avaliability
  const handleLabel = () => {
    setDisplay(!displayLabel);
    axios
      .put(
        `/product/${tag}`,
        { available: !available },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('avaliability is updated');
        } else {
          console.log('update fail');
        }
      })
      .catch(() => {
        console.log('update fail');
      });
  };

  // Handle update
  const submitUpdate = () => {
    axios
      .put(
        `/product/${tag}`,
        { name: newName, description: newDescription },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('product info is updated');
        } else {
          console.log('info update fail');
        }
      })
      .catch(() => {
        console.log('update fail');
      });
  };

  // Handle delete
  const submitDelete = () => {
    axios
      .delete(`/product/${tag}`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('product delete success');
        } else {
          console.log('delete fail');
        }
      })
      .catch(() => {
        console.log('delete fail');
      });
  };

  // Dialog
  function DeleteDialog(props) {
    // eslint-disable-next-line
    const { onClose, open } = props;
    const handleClose = () => {
      onClose(true);
    };
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">
          Are you sure you want to delete this product?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              submitDelete();
              handleClose();
            }}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt={name} src="/static/product.png" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Switch checked={displayLabel} onChange={handleLabel} />}
            label="Available"
          />
          <IconButton
            aria-label="delete"
            sx={{
              zIndex: 9,
              bottom: 25,
              right: 50,
              position: 'absolute'
            }}
            onClick={handleEditOpen}
          >
            <ColorizeIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            sx={{
              zIndex: 9,
              bottom: 25,
              right: 16,
              position: 'absolute'
            }}
            onClick={handleDeleteOpen}
          >
            <DeleteIcon />
          </IconButton>
          <Dialog onClose={handleEditClose} aria-labelledby="simple-dialog-title" open={openEdit}>
            <DialogTitle id="simple-dialog-title">Edit Product</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="name"
                label="Name"
                type="text"
                defaultValue={name}
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                id="name"
                label="Description"
                type="text"
                defaultValue={description}
                fullWidth
                onChange={(e) => setDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose} color="primary">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  submitUpdate();
                  handleEditClose();
                }}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <DeleteDialog open={openDelete} onClose={handleDeleteClose} />
        </Stack>
      </Stack>
    </Card>
  );
}
