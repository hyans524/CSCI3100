
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TableSortLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Map as MapIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { userApi, authApi } from '../../src/utils/api';
import constantCheckAdmin from '../CheckAdmin/CheckAdmin';
import constantCheckLoggedIn from '../CheckLoggedIn/CheckLoggedIn';

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isAdmin: ''
  })
  constantCheckLoggedIn()
  constantCheckAdmin()

  // Fetch user data 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersResponse = await userApi.getAll();
        setUsers(usersResponse.data);
        setLoading(false);

      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    const checkAuth = () => {
      const isAuth = authApi.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setIsAdmin(authApi.isAdmin());
      }
      return isAuth;
    };

    checkAuth();
    fetchData();
  }, [isAuthenticated]);

  // Admin functions
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin
    });
    setDialogOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await userApi.update(editingUser._id, formData);
        const usersResponse = await userApi.getAll();
        setUsers(usersResponse.data);

      } else {
        const response = await userApi.create(formData);
        const usersResponse = await userApi.getAll();
        setUsers(usersResponse.data);
      }
      setDialogOpen(false);
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        isAdmin: ''
      });
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleChangePage = (user, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (user) => {
    setRowsPerPage(parseInt(user.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (user) => {
    setSearchTerm(user.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          User List
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  username: '',
                  password: '',
                  isAdmin: ''
                });
                setDialogOpen(true);
              }}
            >
              Add User
            </Button>
          )}
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Password(hashed)</TableCell>
                <TableCell>isAdmin</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.isAdmin === false ? 'false' : 'true'}</TableCell>
                    <TableCell align="center">
                      {isAdmin && (
                        <>
                          <IconButton
                            onClick={() => handleEdit(user)}
                            color="primary"
                            title="Edit User"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(user._id)}
                            color="error"
                            title="Delete User"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="username"
            fullWidth
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
                    <TextField
            margin="dense"
            label="isAdmin"
            fullWidth
            value={formData.isAdmin}
            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Admin