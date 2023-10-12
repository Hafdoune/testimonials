import { createBrowserRouter, Navigate } from 'react-router-dom';
import Testimonials from './views/testimonials.jsx';
import Admin from './views/Admin';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Testimonials />
    },

    {
        path: '/admin',
        element: <Admin />
    }
])

export default router;