import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThemeBrowser from "./pages/ThemeBrowser.jsx";
import SubmitSSTestPage from "./pages/SubmitSSTestPage.jsx";

import Header from "./components/Header.jsx";

function Layout() {
    return(
        <>
            <Header />
            <Outlet/>
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
                    <Route path="/themes/:username" element={<ThemeBrowser />} />
                    <Route path="/submit" element={<SubmitSSTestPage />}/>
                    {/* User logged in paths */}
                    <Route path="/:username" element={<HomePage />} />
                </Route>

                {/* Routes that don't have the header */}
                <Route path="/login" element={<LoginPage />} />

            </Routes>
        </BrowserRouter>
    );
}
