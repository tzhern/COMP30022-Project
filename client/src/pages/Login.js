import React from 'react';
// material
import { styled } from '@material-ui/core/styles';
import { Stack, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { LoginForm } from '../components/authentication/login';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login" style={{ backgroundColor: '#fffef4' }}>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h1" gutterBottom sx={{ color: '#5d3b6b' }}>
              Sign in to
            </Typography>
            <Typography variant="h4" gutterBottom>
              AITI CRM :)
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
