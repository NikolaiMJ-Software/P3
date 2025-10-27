import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HeaderTestPage from "./pages/HeaderTestPage.jsx"
import ThemeBrowser from "./pages/ThemeBrowser.jsx";

import Header from "./components/Header.jsx";

function Layout() {
    return(
        <>
            <Header />
            <main className="pt-32">
                <Outlet/>
            </main>
        </>
    );
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Routes that share the header */}
                <Route element={<Layout/>}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/messages/:username" element={<MessagesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/header" element={<HeaderTestPage />} />
                    <Route path="/themes/:username" element={<ThemeBrowser />} />
                </Route>

                {/* Routes that don't have the header */}
                {/* User logged in paths */}
                <Route path="/:username" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}
