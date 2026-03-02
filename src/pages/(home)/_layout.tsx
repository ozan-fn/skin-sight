import { NavbarDemo } from "@/components/navbar";
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <div className="">
            <NavbarDemo />
            <Outlet />
        </div>
    );
}
