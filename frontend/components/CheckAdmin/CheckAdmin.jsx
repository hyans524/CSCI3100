import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../src/utils/api';

function constantCheckAdmin() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin) {
      setIsAdmin(authApi.isAdmin());
    }
    else {
      navigate('/LoginSignup');
    }
  }, []);
}

export default constantCheckAdmin