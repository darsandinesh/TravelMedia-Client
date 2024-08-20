import * as React from 'react';
import { useState, useEffect } from 'react';
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
import StatusModal from './StatusModal'; // Import the modal component
// import axios from 'axios'; // Import axios for data fetching
import axiosInstance from '../Auth/axios';
import Spinner from '../../Spinner/Spinner';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// const API_URL = 'http://localhost:4000/admin/userlist'; // Replace with your backend API URL

export default function CustomizedTables() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any[]>([]); // State to store fetched data
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store selected user data
  const [spinner, setSpinner] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinner((prev) => !prev);
        const response = await axiosInstance.get('/admin/userlist');
        console.log(response);
        setRows(response.data); // Update rows with fetched data
        setSpinner((prev) => !prev);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle the page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle the rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open modal and set selected user
  const handleOpenModal = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };


  // Toggle user status
  const handleStatusUpdated = async (newStatus: boolean) => {
    if (selectedUser) {
      try {
        // Update local state
        setRows(rows.map((row) =>
          row.id === selectedUser.id
            ? { ...row, isBlocked: newStatus }
            : row
        ));
        handleCloseModal();
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  // Slice the rows array to only show the current page's rows
  const displayedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      {
        spinner
          ?
          <Spinner />
          :
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: '100%', overflowX: 'auto', marginLeft: '40%' }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', mt: 3 }}>
              <Table sx={{ minWidth: 800 }} aria-label="customized table">
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>

            {/* Modal Component */}
            {selectedUser && (
              <StatusModal
                open={open}
                handleClose={handleCloseModal}
                userName={selectedUser.name}
                userEmail={selectedUser.email}
                isBlocked={selectedUser.isBlocked}
                handleStatusUpdated={handleStatusUpdated} // Pass the correct function to update status
              />
            )}
          </Box>
      }
    </>

  );
}
