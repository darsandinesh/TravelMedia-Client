import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// import axios from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../Auth/axios';

interface StatusModalProps {
  open: boolean;
  handleClose: () => void;
  userName: string;
  userEmail: string;
  isBlocked: boolean;
  handleStatusUpdated: (status: boolean) => void; // Callback to update status in the parent component
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDialogContent-root': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDialogActions-root': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiButton-root': {
    borderRadius: '4px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '&.MuiButton-containedSecondary': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const StatusModal: React.FC<StatusModalProps> = ({
  open,
  handleClose,
  userName,
  userEmail,
  isBlocked,
  handleStatusUpdated,
}) => {
  const handleChangeStatus = async () => {
    try {
      const response = await axiosInstance.post('/admin/changeStatus', {
        email: userEmail,
        isBlocked: !isBlocked,
      });
      console.log(response, '---------------------response in handel change')
      if (response.data.success) {
        // Notify parent component of status change
        toast.success(response.data.message)
        handleStatusUpdated(!isBlocked);
        handleClose();
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>{`User Status for ${userName}`}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.primary">
          Email: {userEmail}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Status: {isBlocked ? 'Blocked' : 'Active'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={handleClose} variant="contained" color="primary">
          Close
        </StyledButton>
        <StyledButton onClick={handleChangeStatus} variant="contained" color="secondary">
          {isBlocked ? 'Unblock User' : 'Block User'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default StatusModal;
