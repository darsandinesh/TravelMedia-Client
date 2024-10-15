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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: '1rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
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
  const [searchQuery, setSearchQuery] = useState(''); // Add search state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/admin/userlist');
        console.log(response)
        setRows(response.data); // Update rows with fetched data
        if (response.data) {
          setSpinner(prev => !prev)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setSpinner(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
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
        // Update status in the backend
        await axiosInstance.post('/admin/changeStatus', {
          email: selectedUser.email,
          isBlocked: newStatus,
        });

        // Update local state
        setRows(rows.map((row) =>
          row.id === selectedUser.id
            ? { ...row, isBlocked: newStatus }
            : row
        ));
        handleCloseModal();
      } catch (error) {
        console.error('Error updating user status:', error);
        // Optionally show an error message to the user
      }
    }
  };

  // Filter rows based on the search query
  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          sx={{ width: '100%', overflowX: 'auto', flexDirection: 'column' }}
        >
          {/* Search Input */}
          <TextField
            label="Search by Name or Email"
            variant="outlined"
            sx={{ width: '50%', mt: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <TableContainer component={Paper} sx={{ maxWidth: '100%', mt: 3 }}>
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
