import {BrowserRouter as Router, Routes, Route, Outlet} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import {useAuthListener} from "./hooks/useAuthListener.ts";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import Quizzes from "./pages/PostFunny/Quizzes.tsx";
import Ads from "./pages/PostFunny/Ads.tsx";
import Default from "./pages/Default.tsx";
import Unauthorized from "./pages/OtherPage/Unauthorized.tsx";
import {constants} from "./utils/constants.ts";
import Info from "./pages/PostFunny/Info.tsx";

export default function App() {
  useAuthListener();
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>

            <Route element={<AppLayout />}>
              <Route path="/" element={<Default />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute requiredRoles={[constants.ROLES.ADMIN,
            constants.ROLES.SUPER_ADMIN]}><Outlet /></ProtectedRoute>}>

            <Route element={<AppLayout />}>
              {/* PostFunny */}
              <Route path="post-funny/info" element={<Info />} />
              <Route path="post-funny/quizzes" element={<Quizzes />} />
              <Route path="post-funny/ads" element={<Ads />} />


            </Route>
          </Route>
          <Route element={<ProtectedRoute requiredRoles={[constants.ROLES.SUPER_ADMIN]}><Outlet /></ProtectedRoute>}>
            <Route element={<AppLayout />}>
              {/* Showcases */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route index path="/dashboard" element={<Home />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
