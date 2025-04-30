import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import { safelyGetResponseData, getErrorMessage } from './utils/apiHelper';
import { saveAuthData, isAuthenticated } from './utils/storage';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://ocoursems.netlify.app" target='_blank'>
        Online Course Management System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = React.useState(isAuthenticated());

  React.useEffect(() => {
    if(isAuthenticated()){
      // navigate('/dashboard');
    }
  }, [isLoggedIn]);

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const signinData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    
    // Set loading indicator
    setLoading(true);
    setError('');
    
    axios.post(`${API_BASE_URL}/user/login`, signinData)
      .then((resp) => {
        console.log("Login response:", resp);
        
        // Safely extract data from response
        if (resp && resp.data) {
          const responseData = resp.data.data || resp.data;
          const token = responseData.token;
          const user = responseData.user;
          
          if (token && user) {
            // Store token and user data using the utility function
            if (saveAuthData({ token, user })) {
              // Navigate to dashboard
              navigate('/dashboard', {
                state: {
                  user: responseData
                }
              });
            } else {
              setError("Failed to save authentication data");
            }
          } else {
            console.error("Missing token or user in response:", responseData);
            setError("Login failed: Invalid response structure");
          }
        } else {
          console.error("Unexpected response format:", resp);
          setError("Login failed: Unexpected server response");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          if (err.response.data && err.response.data.error) {
            setError(err.response.data.error);
          } else if (err.response.status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError("Login failed: " + (err.response.data?.message || "Unknown error"));
          }
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("Login failed: " + err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            {error && (
              <Typography color="error" align="center" variant="body2">
                {error}
              </Typography>
            )}
            <Grid container >
              <Grid item xs container justifyContent={'flex-end'}>
                <ButtonBase 
                  style={{
                    color: 'red',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate("/forgot_password")}>{"Forgot Password?"}</ButtonBase>
              </Grid>
              <Grid item container justifyContent={'flex-end'}>
                <ButtonBase 
                  sx={{mt: 1, mb: 1}}
                  style={{
                    color: 'blue',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate("/signup")}>{"Don't have an account? Sign Up"}</ButtonBase>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}