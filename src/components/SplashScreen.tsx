import { Box, Typography, Container, keyframes, styled } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useEffect, useState } from 'react';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

// Styled components
const AnimatedLogo = styled(Box)(({ theme }) => ({
  position: 'relative',
  animation: `${pulse} 2s infinite ease-in-out`,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
    animation: `${ripple} 2s infinite`,
  }
}));

const AnimatedText = styled(Typography)`
  animation: ${fadeIn} 1s ease-out forwards;
`;

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content with a slight delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Trigger onFinish after animation
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <AnimatedLogo
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 3,
          }}
        >
          <LocationOn
            sx={{
              fontSize: 40,
              color: 'primary.main',
            }}
          />
        </AnimatedLogo>

        {showContent && (
          <>
            <AnimatedText
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                opacity: 0,
              }}
            >
              London Congestion
              <br />
              Checker
            </AnimatedText>

            <AnimatedText
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                mt: 1,
                opacity: 0,
                animationDelay: '0.3s',
              }}
            >
              Your Smart City Companion
            </AnimatedText>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SplashScreen; 