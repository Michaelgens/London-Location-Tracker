import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Slide,
  Alert,
  Stack,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
  Lock,
  Person,
  DirectionsCar,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'signin' | 'signup' | 'forgot';

interface FormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  rememberMe: boolean;
}

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading, error, signUp, signIn, signInWithGoogle, resetPassword, clearError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    rememberMe: false,
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw {
            code: 'passwords_not_match',
            message: 'Passwords do not match. Please try again.'
          };
        }
        if (formData.password.length < 6) {
          throw {
            code: 'weak_password',
            message: 'Password must be at least 6 characters long.'
          };
        }
        await signUp(formData.email, formData.password, formData.name || '');
      } else if (mode === 'signin') {
        await signIn(formData.email, formData.password);
      }
      // Navigation will be handled by the useEffect hook when user state changes
    } catch (err) {
      // Error is already handled by useAuth hook
      if (process.env.NODE_ENV === 'development') {
        console.error('Authentication error:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // Navigation will be handled by the useEffect hook
    } catch (err) {
      // Error is already handled by useAuth hook
      if (process.env.NODE_ENV === 'development') {
        console.error('Google sign in error:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      return; // resetPassword will handle the error
    }
    setIsSubmitting(true);
    try {
      await resetPassword(formData.email);
      alert('Password reset email sent. Please check your inbox.');
      setMode('signin');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Password reset error:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: 4,
            position: 'relative',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              p: 4,
              pb: 0,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2.5,
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 12px 28px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <DirectionsCar sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: -0.5 }}>
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {mode === 'signin' && 'Sign in to continue to London Congestion Checker'}
              {mode === 'signup' && 'Join us to start managing your congestion charges'}
              {mode === 'forgot' && 'Enter your email to receive reset instructions'}
            </Typography>
          </Box>

          {/* Back Button */}
          {mode !== 'signin' && (
            <IconButton
              onClick={() => {
                setMode('signin');
                clearError();
              }}
              sx={{
                position: 'absolute',
                top: 24,
                left: 24,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}

          {/* Form Container */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 24,
                  },
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {error.message}
                </Typography>
                {process.env.NODE_ENV === 'development' && error.technical && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                    Technical details: {error.technical}
                  </Typography>
                )}
              </Alert>
            )}

            <form onSubmit={mode === 'forgot' ? handleForgotPassword : handleSubmit}>
              <Stack spacing={2.5}>
                {/* Name Field - Sign Up Only */}
                <Slide direction="down" in={mode === 'signup'} mountOnEnter unmountOnExit>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required={mode === 'signup'}
                    error={mode === 'signup' && !formData.name?.trim()}
                    helperText={mode === 'signup' && !formData.name?.trim() ? 'Full name is required' : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                          },
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        paddingLeft: 3,
                      },
                    }}
                  />
                </Slide>

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      paddingLeft: 3,
                    },
                  }}
                />

                {/* Password Fields - Sign In and Sign Up Only */}
                {mode !== 'forgot' && (
                  <>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isSubmitting}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          paddingLeft: 3,
                        },
                      }}
                    />

                    {mode === 'signup' && (
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2.5,
                            '&.Mui-focused': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 2,
                              },
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            paddingLeft: 3,
                          },
                        }}
                      />
                    )}
                  </>
                )}

                {/* Remember Me and Forgot Password - Sign In Only */}
                {mode === 'signin' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          sx={{
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}  
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          Remember me
                        </Typography>
                      }
                    />
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => {
                        setMode('forgot');
                        clearError();
                      }}
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                      disabled={isSubmitting}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    py: 1.8,
                    mt: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: (theme) => `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                    },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </>
                  )}
                </Button>

                {/* Google Sign In - Sign In and Sign Up Only */}
                {mode !== 'forgot' && (
                  <>
                    <Divider sx={{ my: 2 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          px: 2,
                          fontWeight: 500,
                        }}
                      >
                        OR
                      </Typography>
                    </Divider>

                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={handleGoogleSignIn}
                      startIcon={<GoogleIcon />}
                      disabled={isSubmitting}
                      sx={{
                        py: 1.8,
                        borderRadius: 2.5,
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                        color: 'text.primary',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      Continue with Google
                    </Button>
                  </>
                )}

                {/* Switch Mode Link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  {mode === 'signin' ? (
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => {
                          setMode('signup');
                          clearError();
                        }}
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        disabled={isSubmitting}
                      >
                        Sign up
                      </Link>
                    </Typography>
                  ) : mode === 'signup' ? (
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => {
                          setMode('signin');
                          clearError();
                        }}
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        disabled={isSubmitting}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => {
                          setMode('signin');
                          clearError();
                        }}
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          fontWeight: 600,
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        disabled={isSubmitting}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
