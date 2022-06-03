import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button
} from '@material-ui/core';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Cookies from 'js-cookie';
import axios from '../../../commons/axios';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, height: 60, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `#F3F0EF !important`
  }
}));

// ----------------------------------------------------------------------

OrderListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

// eslint-disable-next-line
export default function OrderListToolbar({ numSelected, filterName, onFilterName, orderids }) {
  const [openDeleteDialog, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handle delete
  const submitDelete = () => {
    console.log(`orders`);
    console.log(JSON.stringify(orderids));
    console.log(Cookies.get('token'));
    axios
      .put(
        `/order`,
        {
          orderid: orderids
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('orders delete success');
        } else {
          console.log('orders delete fail');
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('orders delete fail2');
      });
  };

  function DeleteDialog(props) {
    // eslint-disable-next-line
    const { onClose, open } = props;

    const handleClose = () => {
      onClose(true);
    };
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Delete Orders </DialogTitle>
        <DialogContent>
          <DialogContentText> Are you sure you want to delete selected orders?</DialogContentText>
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

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search order..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteDialogOpen}>
              <Icon icon={trash2Fill} />
            </IconButton>
          </Tooltip>
          <DeleteDialog open={openDeleteDialog} onClose={handleDeleteDialogClose} />
        </>
      ) : (
        <div> </div>
      )}
    </RootStyle>
  );
}
