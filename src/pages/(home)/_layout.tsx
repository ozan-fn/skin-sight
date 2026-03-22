import { NavbarDemo } from '@/components/navbar';
import { Outlet } from 'react-router';

export default function Layout() {
    return (
        <div className="overflow-auto min-h-screen flex h-screen flex-col">
            <NavbarDemo />
            <Outlet />
        </div>
    );
}
