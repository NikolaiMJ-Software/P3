import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThemeBrowser from "./components/ThemeBrowser.jsx";
import SubmitSSTestPage from "./pages/SubmitSSTestPage.jsx";
import AdminPage from "./pages/AdminPage.jsx"
import ThemeVoting from "./pages/ThemeVoting.jsx"

import Header from "./components/Header.jsx";
import WheelOfFortunePage from "./pages/WheelOfFortunePage.jsx";

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
                    <Route path="/submit/:username" element={<SubmitSSTestPage />}/>
                    <Route path="/voting/:username" element={<ThemeVoting />}/>
                    {/* User logged in paths */}
                    <Route path="/:username" element={<HomePage />} />
                    <Route path="/admin/:username" element={<AdminPage/>} />
                    <Route path="/wheel/:username" element={<WheelOfFortunePage/>} />
                </Route>

                {/* Routes that don't have the header */}
                <Route path="/login" element={<LoginPage />} />

            </Routes>
        </BrowserRouter>
    );
}
