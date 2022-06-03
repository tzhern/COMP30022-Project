import { useRef, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { alpha } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Box,
  Divider,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment
} from '@material-ui/core';
// components
import Cookies from 'js-cookie';
import axios from '../../commons/axios';
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------
export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [givenName, setGivenName] = useState();
  const [familyName, setFamilyName] = useState();
  const [email, setEmail] = useState();
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setConfirmPassword] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openDialog, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Get user information
  useEffect(() => {
    if (Cookies.get('token')) {
      axios
        .get('/profile', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          if (response.status === 200) {
            setGivenName(response.data.user.givenName);
            setFamilyName(response.data.user.familyName);
            setEmail(response.data.user.emailAddress);
          }
        })
        .catch(() => {
          console.log('cant get user info');
        });
      setNewGivenName(givenName);
      setNewFamilyName(familyName);
      setNewEmail(email);
      setNewPassword();
      setConfirmPassword();
    } else {
      navigate('/404', { replace: true });
    }
  }, [email, familyName, givenName, navigate]);

  // Update profile
  const submitUpdate = () => {
    if (newPassword && newConfirmPassword && newPassword !== newConfirmPassword) {
      alert('Password update fail! Make sure you enter the password corretly!');
      return;
    }
    axios
      .put(
        '/profile',
        {
          givenName: newGivenName,
          familyName: newFamilyName,
          emailAddress: newEmail,
          password: newPassword
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
          console.log('profile update success');
        }
      })
      .catch(() => {
        alert('Profile update failed!');
      });
    if (newEmail) {
      alert('Please login in again with your new email address!');
      navigate('/', { replace: true });
    }
  };

  // Logout
  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/', { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          marginTop: 2,
          padding: 0,
          width: 60,
          height: 60,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar
          src="/static/mock-images/avatars/user.png"
          alt="photoURL"
          sx={{ width: 60, height: 60 }}
        />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {givenName}
            {familyName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={() => {
              handleClose();
              handleDialogOpen();
            }}
          >
            Edit Profile
          </Button>
        </Box>
        <Box sx={{ p: 2, pt: 0.25 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
      <Dialog onClose={handleDialogClose} aria-labelledby="simple-dialog-title" open={openDialog}>
        <DialogTitle id="simple-dialog-title">Update personal information</DialogTitle>
        <DialogContent>
          <DialogContentText> Enter a new name below.</DialogContentText>
          <TextField
            margin="dense"
            label="First name"
            type="text"
            defaultValue={givenName}
            onChange={(e) => setNewGivenName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last name"
            type="text"
            defaultValue={familyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            You will be kicked out after changing email, login again with new email!
          </DialogContentText>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            defaultValue={email}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            If you don't want to change your password, just skip.
          </DialogContentText>
          <TextField
            margin="dense"
            label="New password"
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="dense"
            label="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              submitUpdate();
              handleDialogClose();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
