import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import StatusModal from './StatusModal';
import axiosInstance from '../../../constraints/axios/adminAxios';
import Spinner from '../../Spinner/Spinner';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Styling for the Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[800],
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[700],
  },
}));

// Styling for the Search Input
const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[600],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    color: theme.palette.common.white, 
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[400], 
  },
}));

// Styling for the Toggle Button
const ToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  marginRight: theme.spacing(1),
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[600],
  color: active ? theme.palette.common.white : theme.palette.common.black,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[700],
  },
}));

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

export default function CustomizedTables() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [spinner, setSpinner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/admin/userlist');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setSpinner(false);
      }
    };
    fetchData();
  }, []);

  // Handle table pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleStatusUpdated = async (newStatus: boolean) => {
    if (selectedUser) {
      try {
        await axiosInstance.post('/admin/changeStatus', {
          email: selectedUser.email,
          isBlocked: newStatus,
        });
        setRows(() => 
          rows.map((row) => {
            return row.email === selectedUser.email
              ? { ...row, isBlocked: newStatus }
              : row;
          })
        );
        handleCloseModal();
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  const filteredRows = rows.filter((row) =>
    (showBlocked ? row.isBlocked : !row.isBlocked) &&
    (row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', overflowX: 'auto', flexDirection: 'column', backgroundColor: '#213547', minHeight: '100vh' }}
        >
          {/* Search Input */}
          <SearchInput
            label="Search by Name or Email"
            variant="outlined"
            sx={{ width: '50%', mt: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Toggle Buttons */}
          <Box sx={{ mt: 2 }}>
            <ToggleButton
              variant="contained"
              onClick={() => setShowBlocked(false)}
              active={!showBlocked} // Highlight if showing unblocked users
            >
              Show Unblocked Users
            </ToggleButton>
            <ToggleButton
              variant="contained"
              onClick={() => setShowBlocked(true)}
              active={showBlocked} // Highlight if showing blocked users
            >
              Show Blocked Users
            </ToggleButton>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxWidth: '100%', mt: 3, backgroundColor: '#424242', borderRadius: '8px' }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sl No.</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Email Address</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRows.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {page * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton color="inherit" onClick={() => handleOpenModal(row)}>
                        <MoreVertTwoToneIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          {/* Status Modal */}
          {selectedUser && (
            <StatusModal
              open={open}
              handleClose={handleCloseModal}
              userName={selectedUser.name}
              userEmail={selectedUser.email}
              isBlocked={selectedUser.isBlocked}
              handleStatusUpdated={(status) => handleStatusUpdated(status)}
            />
          )}
        </Box>
      )}
    </>
  );
}
