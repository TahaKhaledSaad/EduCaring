import { Route, Routes } from "react-router-dom";

// -------------------------------------------
// --------------- Dashboard -----------------
// -------------------------------------------

// 3- Dashboard
import Dashboard from "./dashboard/Dashboard.jsx";

// 5- Events
import Events from "./dashboard/events/Events.jsx";
import CreateEvent from "./dashboard/events/CreateEvent.jsx";
import UpdateEvent from "./dashboard/events/UpdateEvent.jsx";

// 6- Users && Speakers
import Users from "./dashboard/Users.jsx";
import Admins from "./dashboard/Admins.jsx";
import Speakers from "./dashboard/Speakers.jsx";
import { PrimeReactProvider } from "primereact/api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SendMessage from "./dashboard/SendMessage.jsx";

import ContactUs from "./dashboard/ContactUs.jsx";
import Support from "./dashboard/Support.jsx";
import LandingSponsers from "./dashboard/LandingSponsers.jsx";
import LandingText from "./dashboard/LandingText.jsx";
import LandingSpeakers from "./dashboard/LandingSpeakers.jsx";
import LandingAboutUs from "./dashboard/LandingAboutUs.jsx";

// -------------------------------------------
// --------------- Website -------------------
// -------------------------------------------

// Auth
import Login from "./components/Website/Auth/Login.jsx";
import AttendanceReg from "./components/Website/Auth/AttendanceReg.jsx";
import SpeakerReg from "./components/Website/Auth/SpeakerReg.jsx";
import RequireAuth from "./components/Website/Auth/RequireAuth.jsx";
import SpeakerAuth from "./components/Website/Auth/SpeakerAuth.jsx";
import UserAuth from "./components/Website/Auth/UserAuth.jsx";
import AdminAuth from "./components/Website/Auth/AdminAuth.jsx";

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
import RequireBack from "./components/Website/Auth/RequireBack.jsx";
import Session from "./components/Website/session/Session.jsx";
import Recommendations from "./components/Website/recommendations/Recommendations.jsx";
import Copouns from "./dashboard/PromoCodes.jsx";
import AffiliateCode from "./dashboard/AffiliateCode.jsx";

function App() {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  return (
    <PrimeReactProvider>
      <Routes>
        {/* TODO Website */}
        {/* Puplic Routes */}
        <Route path="/" element={<LandingPage />} />
        {/* Auth */}
        <Route element={<RequireBack />}>
          <Route path="login" element={<Login />} />
          <Route path="register-attendance" element={<AttendanceReg />} />
          <Route path="register-speaker" element={<SpeakerReg />} />
        </Route>
        {/* Testing */}

        <Route element={<RequireAuth />}>
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
              <Route
                path="update-user-profile"
                element={<UpdateUserProfile />}
              />
            </Route>
            <Route element={<SpeakerAuth />}>
              <Route
                path="update-speaker-profile"
                element={<UpdateSpeakerProfile />}
              />
            </Route>
          </Route>
        </Route>

        {/* TODO Dashboard */}
        <Route element={<AdminAuth />}>
          <Route
            path="dashboard"
            element={
              <Dashboard isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
            }
          >
            <Route path="events" element={<Events isEnglish={isEnglish} />} />
            <Route
              path="event/create"
              element={<CreateEvent isEnglish={isEnglish} />}
            />
            <Route path="messages" element={<SendMessage />} />
            <Route path="contactus" element={<ContactUs />} />
            <Route path="affiliate" element={<AffiliateCode />} />
            <Route path="copouns" element={<Copouns />} />
            <Route path="support" element={<Support />} />
            <Route
              path="events/:id"
              element={<UpdateEvent isEnglish={isEnglish} />}
            />
            <Route path="users" element={<Users isEnglish={isEnglish} />} />
            <Route path="admins" element={<Admins isEnglish={isEnglish} />} />
            <Route
              path="landing-speakers"
              element={<LandingSpeakers isEnglish={isEnglish} />}
            />
            <Route
              path="landing-sponsers"
              element={<LandingSponsers isEnglish={isEnglish} />}
            />
            <Route
              path="landing-text"
              element={<LandingText isEnglish={isEnglish} />}
            />
            <Route
              path="landing-aboutus"
              element={<LandingAboutUs isEnglish={isEnglish} />}
            />
            <Route
              path="speakers"
              element={<Speakers isEnglish={isEnglish} />}
            />
          </Route>
        </Route>
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
