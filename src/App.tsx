import { Route, Routes } from "react-router";
import Layout from "./pages/(home)/_layout";
import { lazy } from "react";

const Home = lazy(() => import("./pages/(home)/home"));
const TentangKami = lazy(() => import("./pages/(home)/tentang-kami"));
const Deteksi = lazy(() => import("./pages/(home)/deteksi"));
const Docs = lazy(() => import("./pages/(home)/docs"));

const App = () => {
    return (
        <Routes>
            {/* Root */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tentang-kami" element={<TentangKami />} />
                <Route path="/deteksi" element={<Deteksi />} />
            </Route>

            {/* Documentation */}
            <Route path="/docs" element={<Docs />} />
        </Routes>
    );
};

export default App;
