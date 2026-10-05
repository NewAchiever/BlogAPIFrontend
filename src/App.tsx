import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router }   from './routes/routes.config.tsx';


export default function App() {
    return <RouterProvider router={router} />;
  }
