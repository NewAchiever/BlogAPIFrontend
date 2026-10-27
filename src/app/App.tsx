import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router }   from '@/routes/routes.config.tsx';
import { AuthProvider } from './context/AuthContext.tsx';


export default function App() {
    return (
    <AuthProvider>
      
      <RouterProvider router={router} />
    </AuthProvider>
    );
  }
