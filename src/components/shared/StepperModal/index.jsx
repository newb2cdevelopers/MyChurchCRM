import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const INACTIVE = 'inactive';
const ACTIVE = 'active';
const COMPLETED = 'completed';

function StepIcon({ status, number }) {
  if (status === COMPLETED) {
    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckIcon sx={{ fontSize: 20, color: 'primary.contrastText' }} />
      </Box>
    );
  }

  if (status === ACTIVE) {
    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s',
        }}
      >
        <Typography
          sx={{ color: 'primary.contrastText', fontWeight: 700, fontSize: 14 }}
        >
          {number}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        bgcolor: '#dae2fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 14 }}
      >
        {number}
      </Typography>
    </Box>
  );
}

function ProgressDots({ total, active }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: i === active ? 'primary.main' : '#c9c4d8',
            transition: 'background-color 0.3s',
          }}
        />
      ))}
    </Box>
  );
}

function StepperModal({
  open,
  onClose,
  title,
  description,
  steps = [],
  onStepSubmit,
  onStepClick,
  onFinish,
  fullScreen = false,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [accumulatedData, setAccumulatedData] = useState({});

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setActiveStep(0);
    setAccumulatedData({});
    onClose?.();
  }, [isLoading, onClose]);

  const handleBack = useCallback(() => {
    if (isFirstStep) return;
    setActiveStep(prev => prev - 1);
  }, [isFirstStep]);

  const handleStepClick = useCallback(
    async index => {
      if (index === activeStep || isLoading) return;
      if (onStepClick) {
        const ok = await onStepClick(activeStep, index);
        if (!ok) return;
      }
      setActiveStep(index);
    },
    [activeStep, isLoading, onStepClick],
  );

  const handleNext = useCallback(async () => {
    if (isLoading) return;

    if (isLastStep) {
      setIsLoading(true);
      try {
        if (onFinish) {
          await onFinish(accumulatedData);
        }
        setActiveStep(0);
        setAccumulatedData({});
        onClose?.();
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (onStepSubmit) {
      setIsLoading(true);
      try {
        const result = await onStepSubmit(activeStep, accumulatedData);
        if (result) {
          setAccumulatedData(prev => ({ ...prev, ...result }));
        }
        setActiveStep(prev => prev + 1);
      } catch {
        // Validation errors handled by step components — do not advance
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  }, [
    activeStep,
    isLastStep,
    isLoading,
    onStepSubmit,
    onFinish,
    accumulatedData,
    onClose,
  ]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: fullScreen ? '100%' : 860,
          maxWidth: fullScreen ? '100%' : 860,
          height: fullScreen ? '100%' : 640,
          maxHeight: fullScreen ? '100%' : 640,
          borderRadius: fullScreen ? 0 : 3,
          overflow: 'hidden',
          boxShadow: fullScreen
            ? 'none'
            : '0 24px 48px -12px rgba(19, 27, 46, 0.08)',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {!fullScreen && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              bgcolor: '#f2f3ff',
              borderRight: '1px solid',
              borderColor: 'divider',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: '18px',
                  color: 'text.secondary',
                }}
              >
                {description}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: 1,
              }}
            >
              {steps.map((step, index) => {
                let status = INACTIVE;
                if (index === activeStep) status = ACTIVE;
                else if (index < activeStep) status = COMPLETED;

                const canClick = status !== ACTIVE && !isLoading;

                return (
                  <Box
                    key={step.id}
                    onClick={
                      canClick ? () => handleStepClick(index) : undefined
                    }
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      opacity: status === INACTIVE ? 0.6 : 1,
                      transition: 'opacity 0.3s',
                      cursor: canClick ? 'pointer' : 'default',
                    }}
                  >
                    <StepIcon status={status} number={index + 1} />
                    <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: status === ACTIVE ? 700 : 500,
                          color:
                            status === ACTIVE ? 'primary.main' : 'text.primary',
                          lineHeight: '20px',
                          mb: 0.25,
                          textAlign: 'left',
                          wordBreak: 'break-word',
                        }}
                      >
                        {step.title}
                      </Typography>
                      {step.description && (
                        <Typography
                          sx={{
                            fontSize: 13,
                            lineHeight: '18px',
                            color: 'text.secondary',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%',
                            wordBreak: 'break-word',
                          }}
                        >
                          {step.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: '#ffffff',
          }}
        >
          {fullScreen ? (
            <Box
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                borderBottom: '1px solid',
                borderColor: 'divider',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Paso {activeStep + 1} de {steps.length}
                </Typography>
                <IconButton
                  onClick={handleClose}
                  size="small"
                  disabled={isLoading}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: '28px',
                  textAlign: 'left',
                }}
              >
                {currentStep?.title}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 20,
                    lineHeight: '28px',
                    textAlign: 'left',
                  }}
                >
                  {currentStep?.title}
                </Typography>
                {currentStep?.description && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: '18px',
                      color: 'text.secondary',
                      mt: 0.25,
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {currentStep.description}
                  </Typography>
                )}
              </Box>
              <IconButton
                onClick={handleClose}
                size="small"
                disabled={isLoading}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          {fullScreen && (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                px: { xs: 2, md: 3 },
                pt: 1.5,
                pb: 0.5,
                flexShrink: 0,
              }}
            >
              {steps.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    bgcolor:
                      index <= activeStep
                        ? 'primary.main'
                        : 'surface-container-high',
                    transition: 'background-color 0.3s',
                  }}
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              px: 3,
              py: 3,
            }}
          >
            {steps.map((step, index) => (
              <Box
                key={step.id}
                sx={{ display: index === activeStep ? 'block' : 'none' }}
              >
                {step.content}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          height: 72,
          px: { xs: 1.5, md: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        {!fullScreen && (
          <ProgressDots total={steps.length} active={activeStep} />
        )}

        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1.5 } }}>
          <Button
            variant="text"
            onClick={handleClose}
            disabled={isLoading}
            sx={{ color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          {!isFirstStep && (
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isLoading}
              startIcon={<ArrowBackIcon />}
              aria-label="Anterior"
            >
              {fullScreen ? null : 'Anterior'}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isLoading}
            endIcon={
              isLoading ? (
                <CircularProgress size={16} sx={{ color: 'common.white' }} />
              ) : isLastStep ? undefined : (
                <ArrowForwardIcon />
              )
            }
          >
            {isLoading
              ? 'Guardando...'
              : isLastStep
                ? 'Finalizar'
                : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default StepperModal;
