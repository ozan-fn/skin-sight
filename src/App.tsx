import { Route, Routes } from "react-router";
import Layout from "./pages/(home)/_layout";
import { lazy } from "react";

const Home = lazy(() => import("./pages/(home)/home"));
const TentangKami = lazy(() => import("./pages/(home)/tentang-kami"));
const Deteksi = lazy(() => import("./pages/(home)/deteksi"));
const Ensiklopedia = lazy(() => import("./pages/(home)/ensiklopedia/index"));
const EnsiklopediaDetail = lazy(() => import("./pages/(home)/ensiklopedia/detail"));
const Docs = lazy(() => import("./pages/(home)/docs"));
const Login = lazy(() => import("./pages/(auth)/login"));
const Register = lazy(() => import("./pages/(auth)/register"));
const AdminDashboard = lazy(() => import("./pages/(admin)/dashboard"));
const AdminUsers = lazy(() => import("./pages/(admin)/users"));

const AdminDiseases = lazy(() => import("./pages/(admin)/diseases/index"));
const CreateDisease = lazy(() => import("./pages/(admin)/diseases/create"));
const EditDisease = lazy(() => import("./pages/(admin)/diseases/edit"));

const AdminDrugs = lazy(() => import("./pages/(admin)/drugs/index"));
const CreateDrug = lazy(() => import("./pages/(admin)/drugs/create"));
const EditDrug = lazy(() => import("./pages/(admin)/drugs/edit"));

const Profile = lazy(() => import("./pages/profile"));

import { GuestRoute, AdminRoute, ProtectedRoute } from "./components/route-guard";

const App = () => {
    return (
        <Routes>
            {/* Root */}
            {/* Client Routes with Layout */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tentang-kami" element={<TentangKami />} />
                <Route path="/deteksi" element={<Deteksi />} />
                <Route path="/ensiklopedia" element={<Ensiklopedia />} />
                <Route path="/ensiklopedia/:type/:slug" element={<EnsiklopediaDetail />} />

                {/* Protected Routes inside Layout */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Guest Routes (Login/Register) - No Layout */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Admin Routes (Admin Only) */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />

                {/* Diseases */}
                <Route path="/admin/diseases" element={<AdminDiseases />} />
                <Route path="/admin/diseases/create" element={<CreateDisease />} />
                <Route path="/admin/diseases/edit/:id" element={<EditDisease />} />

                {/* Drugs */}
                <Route path="/admin/drugs" element={<AdminDrugs />} />
                <Route path="/admin/drugs/create" element={<CreateDrug />} />
                <Route path="/admin/drugs/edit/:id" element={<EditDrug />} />
            </Route>

            {/* Documentation */}
            <Route path="/docs" element={<Docs />} />
        </Routes>
    );
};

export default App;
