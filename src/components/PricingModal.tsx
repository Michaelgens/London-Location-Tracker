import { 
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Fade,
  Backdrop,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { Close, Check, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useState } from 'react';
import { PlanType } from '../contexts/PricingContext';

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  plans: PlanType[];
}

const PricingModal = ({ open, onClose, currentPlanId, onSelectPlan, plans }: PricingModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0); // Start with free trial

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, plans.length - 1));
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan && planId !== currentPlanId) {
      onSelectPlan(planId);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <Container 
          maxWidth="sm" 
          sx={{ 
            outline: 'none',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: { xs: 2, sm: 3 },
              maxHeight: '90vh',
              overflow: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary',
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
              <Typography 
                variant="h5"
                component="h2" 
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Choose Your Plan
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                Select the perfect plan for your London travel needs
              </Typography>
            </Box>

            {/* Mobile Navigation Dots */}
            {isMobile && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1,
                mb: 2 
              }}>
                {plans.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: activeStep === index ? 'primary.main' : 'action.disabled',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Plans Container */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Navigation Arrows for Mobile */}
              {isMobile && (
                <>
                  {activeStep > 0 && (
                    <IconButton
                      onClick={handlePrev}
                      sx={{
                        position: 'absolute',
                        left: -12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                  )}
                  {activeStep < plans.length - 1 && (
                    <IconButton
                      onClick={handleNext}
                      sx={{
                        position: 'absolute',
                        right: -12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  )}
                </>
              )}

              {/* Plans Grid */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  transform: isMobile ? `translateX(-${activeStep * 100}%)` : 'none',
                  transition: 'transform 0.3s ease',
                  px: isMobile ? 1 : 0,
                }}
              >
                {plans.map((plan, index) => (
                  <Box
                    key={plan.id}
                    sx={{
                      flex: '0 0 100%',
                      minWidth: 0,
                      opacity: isMobile ? (activeStep === index ? 1 : 0.3) : 1,
                      transform: isMobile ? (activeStep === index ? 'scale(1)' : 'scale(0.95)') : 'scale(1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      border: '2px solid',
                      borderColor: plan.recommended ? plan.color : 'divider',
                      borderRadius: 2,
                      p: 2,
                      bgcolor: 'background.paper',
                      boxShadow: plan.recommended ? 4 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {plan.recommended && (
                      <Chip
                        label="Recommended"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -5,
                          right: 16,
                          bgcolor: plan.color,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          zIndex: 1,
                        }}
                      />
                    )}

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {plan.name}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h4"
                        component="span"
                        sx={{ 
                          fontWeight: 700, 
                          color: plan.color,
                          fontSize: { xs: '1.75rem', sm: '2rem' }
                        }}
                      >
                        £{plan.price}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 1, fontSize: '0.875rem' }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>

                    <Stack spacing={1.5} sx={{ mb: 3, flex: 1 }}>
                      {plan.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Check sx={{ color: plan.color, fontSize: 18 }} />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontSize: '0.8125rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {plan.id === currentPlanId ? (
                      <Box
                        sx={{
                          py: 1.25,
                          textAlign: 'center',
                          bgcolor: 'action.selected',
                          borderRadius: 1,
                          color: 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        Plan Selected
                      </Box>
                    ) : (
                      <Button
                        variant={plan.recommended ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => handleSelectPlan(plan.id)}
                        sx={{
                          bgcolor: plan.recommended ? plan.color : 'transparent',
                          borderColor: plan.color,
                          color: plan.recommended ? 'white' : plan.color,
                          py: 1.25,
                          '&:hover': {
                            bgcolor: plan.recommended ? plan.color : 'transparent',
                            opacity: 0.9,
                          }
                        }}
                      >
                        Select Plan
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Footer */}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ 
                mt: 3,
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              All plans include VAT. Cancel or change your plan anytime.
            </Typography>
          </Box>
        </Container>
      </Fade>
    </Modal>
  );
};

export default PricingModal; 