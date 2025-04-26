import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import AIrec from "./pages/AIrec"
import Browse from "./pages/Browse"
import MyTrip from "./pages/MyTrip"
import NoPage from "./pages/NoPage"
import Profile from "./pages/Profile"
import TripDetail from "./pages/TripDetail"
import MyTripDetail from "./pages/MyTripDetail"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/AIrecommendation" element={<AIrec />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/mytrip" element={<MyTrip />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/mytrip/:id" element={<MyTripDetail />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
