import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
export default function Logout() {
    const navigate = useNavigate();
    const { callAPI, setUser } = useAuth();
    useEffect(() => {
      const logout = async () => {
          const response = await callAPI(`/auth/logout`,{
              method: 'GET',
              credentials: 'include',
          });
          console.log("response logout", response);
          if(!response.isSessionActive){
            setUser(null);
            navigate('/login');
          }

          
      };
      logout();
    }, []);
    return (
    <></>
  )
}
