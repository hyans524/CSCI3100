import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../src/utils/api';

function constantCheckLoggedIn() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(authApi.isAdmin());
    }
    else {
      navigate('/LoginSignup');
    }
  }, []);
}

export default constantCheckLoggedIn
// only for copy, not for export
