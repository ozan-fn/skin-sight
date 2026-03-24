import { NavbarDemo } from '@/components/navbar';
import { Outlet } from 'react-router';

export default function Layout() {
    return (
        <div className="min-h-screen flex  flex-col">
            <NavbarDemo />
            <Outlet />
        </div>
    );
}
