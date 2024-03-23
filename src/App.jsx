import { Route, Routes } from "react-router-dom";

// Auth
import Login from "./components/Website/Auth/Login.jsx";
import AttendanceReg from "./components/Website/Auth/AttendanceReg.jsx";
import SpeakerReg from "./components/Website/Auth/SpeakerReg.jsx";
import RequireAuth from "./components/Website/Auth/RequireAuth.jsx";
import SpeakerAuth from "./components/Website/Auth/SpeakerAuth.jsx";
import UserAuth from "./components/Website/Auth/UserAuth.jsx";
import Verfication from "./components/Website/verfiy-number/Verfication.jsx";

// Profile
import UpdateSpeakerProfile from "./components/Website/Profile/UpdateSpeakerProfile.jsx";
import UpdateUserProfile from "./components/Website/Profile/UpdateUserProfile.jsx";
import SpeakerProfile from "./components/Website/speakerProfile/SpeakerProfile.jsx";

// Main Page
import LandingPage from "./components/Website/LandingPage/LandingPage.jsx";
import MyEvents from "./components/Website/myEvents/MyEvents.jsx";
import Home from "./components/Website/home/Home.jsx";
import Community from "./components/Website/community/Community.jsx";
import Event from "./components/Website/Event/Event.jsx";
import Payment from "./components/Website/payment/Payment.jsx";
import Test from "./components/Test.jsx";
import RequireBack from "./components/Website/Auth/RequireBack.jsx";
import Session from "./components/Website/session/Session.jsx";
import Recommendations from "./components/Website/recommendations/Recommendations.jsx";
//

function App() {
  return (
    <div>
      <Routes>
        {/* Puplic Routes */}
        <Route path="/" element={<LandingPage />}></Route>
        {/* Auth */}
        <Route element={<RequireBack />}>
          <Route path="login" element={<Login />}></Route>
          <Route path="register-attendance" element={<AttendanceReg />}></Route>
          <Route path="register-speaker" element={<SpeakerReg />}></Route>
        </Route>

        {/* Testing */}
        <Route path="test" element={<Test />} />

        <Route element={<RequireAuth />}>
          <Route path="verification" element={<Verfication />} />

          <Route path="/home" element={<Home />}>
            <Route path="event/:eventId" element={<Event />} />
            <Route
              path="speakerProfile/:eventId/:eventDayId/:speakerId"
              element={<SpeakerProfile />}
            />
            <Route path="myevents" element={<MyEvents />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="community" element={<Community />} />
            <Route path="payment/:eventId" element={<Payment />} />
            <Route path="session/:eventId/:eventDayId" element={<Session />} />

            <Route element={<UserAuth />}>
              <Route path="update-user-profile" element={<UpdateUserProfile />} />
            </Route>

            <Route element={<SpeakerAuth />}>
              <Route path="update-speaker-profile" element={<UpdateSpeakerProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
