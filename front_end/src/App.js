import React, { useState } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AccountCreationForm } from "./Register/AccountCreationForm";
import{TermsAndConditions} from "./Terms/TermsAndConditions"
import SignIn from "./SignIn/SignIn";
import Pending from "./Register/Pending";
import MyDonations from "./Donators/MyDonations";
import DonatorHistory from "./Donators/DonatorHistory";
import { Create_Donation } from "./Donators/Create_Donation";
import {HomePage} from "./Home/HomePage";
import {AdminDashboard} from "./Admins/AdminDashboard";
import DonatorList from "./Admins/DonatorList";
import NGOList from "./Admins/NGOList";
import NGOHome from "./Ngos/NgoHome";
import NgoRequests from "./Ngos/NgoRequests";
import ForgetEmail from "./ForgetPass/forgetEmail";
import ForgetPassword from "./ForgetPass/forgetPassword";
import Aboutus from "./Home/AboutUs";
import Navbar from "./Navbar/Navbar";
import UpdateHeader from "./Profile/updateHeader";
import ProfilePage from "./Profile/profilePage";
import NgoChatPage from "./Chat/NgoChatPage";
import DonatorChatPage from "./Chat/DonatorChatPage";
function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ForgetEmail" element={<ForgetEmail />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/DonatorList" element={<DonatorList />} />
          <Route path="/NGOList" element={<NGOList />} />
          <Route path="/AboutUs" element={<Aboutus />} />
          <Route path="/forgetEmail" element={<ForgetEmail />} />
          <Route path="/resetPassword" element={<ForgetPassword />} />
          <Route path="/NGOHome" element={<NGOHome />} />
          <Route path="/NgoRequests" element={<NgoRequests/>} />
          <Route path="/AccountCreationForm" element={<AccountCreationForm />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Pending" element={<Pending />} />
          <Route path="/MyDonations" element={<MyDonations />} />
          <Route path="/DonatorHistory" element={<DonatorHistory />} />
          <Route path="/Create_Donation" element={<Create_Donation />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/UpdateHeader" element={<UpdateHeader />} /> 
          <Route path="/NgoChatPage" element={<NgoChatPage />} />
          <Route path="/DonatorChatPage" element={<DonatorChatPage />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;