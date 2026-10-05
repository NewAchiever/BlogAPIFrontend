import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
      const logout = async () => {
          const response = await fetch('http://localhost/blog_api/public/logout',{
              method: 'GET',
              credentials: 'include',
          });
          if(response.status === 200 || response.status === 401){
            navigate('/login');
          }
          else{
            navigate(-1);
          }
      };
      logout();
    }, []);
    return (
    <></>
  )
}
