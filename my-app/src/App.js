import { useEffect } from "react";
import Navbar from "./Components/navbar.jsx";
import Body from "./Components/body.jsx";
import Footer from "./Components/footer.jsx";
import Blank from "./Components/blank.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/login.jsx";
import AdminLogin from "./Components/adminLogin.jsx";
import AdminDashboard from "./Components/adminDashboard.jsx";

function App() {
  useEffect(() => {
    console.warn = function () {};
    console.error = function () {};
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login part={"login"} />} />
          <Route
            exact
            path="/"
            element={
              <>
                <Navbar />
                <Blank part={"blank"} />
                <Footer />
              </>
            }
          />
          <Route
            exact
            path="/site"
            element={
              <>
                <Navbar />
                <Body part={"body"} />
                <Footer />
              </>
            }
          />
          <Route exact path="/admin" element={<AdminLogin />} />
          <Route
            exact
            path="/admindashboard"
            element={
              <>
                <AdminDashboard />
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
