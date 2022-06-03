// material
import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { RegisterForm } from '../components/authentication/register';

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

export default function Register() {
  return (
    <RootStyle title="Register" style={{ backgroundColor: '#fffef4' }}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" gutterBottom>
              Manage the job more effectively
            </Typography>
            <Typography variant="h4" gutterBottom>
              with AITI CRM
            </Typography>
          </Box>
          <RegisterForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
