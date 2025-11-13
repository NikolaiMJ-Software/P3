import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThemeBrowser from "./components/Theme/ThemeBrowser.jsx";
import SubmitSSPage from "./components/SubmitSSPage.jsx";
import AdminPage from "./pages/AdminPage.jsx"
import ThemeVoting from "./pages/ThemeVoting.jsx"
import AdminSound from "./pages/AdminSSPage.jsx"

import Header from "./components/Header.jsx";
import WheelOfFortunePage from "./pages/WheelOfFortunePage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";

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
                    <Route element={<ProtectRoute/>}>
                        <Route path="/messages/:username" element={<MessagesPage />} />
                        <Route path="/themes/:username" element={<ThemeBrowser />} />
                        <Route path="/submit/:username" element={<SubmitSSPage />}/>
                        {/* User logged in paths */}
                        <Route path="/:username" element={<HomePage />} />
                        <Route path="/admin/:username" element={<AdminPage/>} />
                        <Route path="/admin/wheel/:username" element={<WheelOfFortunePage/>} />
                        <Route path="/admin/sound-sample/:username" element={<AdminSound/>}/>
                        <Route path="/admin/voting/:username" element={<ThemeVoting />}/>
                        <Route path="/faq/:username" element={<FAQPage/>}/>
                    </Route>
                </Route>

                {/* Routes that don't have the header */}
                <Route path="/login" element={<LoginPage />} />

            </Routes>
        </BrowserRouter>
    );
}
