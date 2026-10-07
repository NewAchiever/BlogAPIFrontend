import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router }   from './routes/routes.config.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/navBar.tsx';

export default function App() {
    return (
    <AuthProvider>
      
      <RouterProvider router={router} />
    </AuthProvider>
    );
  }
