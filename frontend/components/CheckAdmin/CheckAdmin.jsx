import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../src/utils/api';

function constantCheckAdmin() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = authApi.isAdmin()
    if (admin) {
      setIsAdmin(authApi.isAdmin());
    }
    else {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('useroid');
        localStorage.removeItem('username');
        localStorage.removeItem('license');
        sessionStorage.clear()
      }
      catch (error) {
        console.error('Cannot remove current user info:', err);
        setError('Cannot clear data for someone who attempts to access Admin page with no authority');
      }
      window.location.href = '/LoginSignup'
    }
  }, []);
}

export default constantCheckAdmin