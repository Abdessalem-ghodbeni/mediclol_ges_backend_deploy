import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { base_url } from "../baseUrl";
import Logout from "../Authentification/logout";
import { useTheme } from "/src/Authentification/useTheme.jsx";

// Configurez Axios pour inclure le token dans toutes les requêtes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function DashboardPatient() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour déterminer si le chemin est actif
  const isActive = (path) => location.pathname.includes(path);

  const { logout } = Logout();

  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/patient/getById/${userId}`
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <>
      <div className="dashboard">
        {/* Header START */}
        <header className="navbar-light header-sticky">
          {/* Logo Nav START */}
          <nav className="navbar navbar-expand-xl">
            <div className="container">
              {/* Logo START */}
              <a className="navbar-brand">
                <img
                  className="light-mode-item navbar-brand-item"
                  src="assets/images/logo.png"
                  style={{ height: "60px" }}
                  alt="logo"
                />
                <img
                  className="dark-mode-item navbar-brand-item"
                  src="assets/images/logo.png"
                  style={{ height: "60px" }}
                  alt="logo"
                />
              </a>
              {/* Logo END */}
              {/* Profile and Notification START */}
              <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
                {/* Notification dropdown START */}
                <li className="nav-item ms-0 ms-md-3 dropdown">
                  {/* Notification button */}
                  <a
                    className="nav-link p-0"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-auto-close="outside"
                  >
                    <i className="bi bi-bell fa-fw fs-5" />
                  </a>
                  {/* Notification dote */}
                  <span className="notif-badge animation-blink" />
                  {/* Notification dropdown menu START */}
                  <div className="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg">
                    <div className="card bg-transparent">
                      {/* Card header */}
                      <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom">
                        <h6 className="m-0">
                          Notifications{" "}
                          <span className="badge bg-danger bg-opacity-10 text-danger ms-2">
                            4 new
                          </span>
                        </h6>
                        <a className="small">Clear all</a>
                      </div>
                      {/* Card body START */}
                      <div className="card-body p-0">
                        <ul className="list-group list-group-flush list-unstyled p-2">
                          {/* Notification item */}
                          <li>
                            <a className="list-group-item list-group-item-action rounded notif-unread border-0 mb-1 p-3">
                              <h6 className="mb-2">
                                New! Booking flights from New York ✈️
                              </h6>
                              <p className="mb-0 small">
                                Find the flexible ticket on flights around the
                                world. Start searching today
                              </p>
                              <span>Wednesday</span>
                            </a>
                          </li>
                          {/* Notification item */}
                          <li>
                            <a className="list-group-item list-group-item-action rounded border-0 mb-1 p-3">
                              <h6 className="mb-2">
                                Sunshine saving are here 🌞 save 30% or more on
                                a stay
                              </h6>
                              <span>15 Nov 2022</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* Card body END */}
                      {/* Card footer */}
                      <div className="card-footer bg-transparent text-center border-top">
                        <a className="btn btn-sm btn-link mb-0 p-0">
                          See all incoming activity
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Notification dropdown menu END */}
                </li>
                {/* Notification dropdown END */}
                {/* Profile dropdown START */}
                <li
                  className="nav-item ms-3 dropdown"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Click here"
                >
                  {/* Avatar */}
                  <a
                    className="avatar avatar-xs p-0"
                    id="profileDropdown"
                    role="button"
                    data-bs-auto-close="outside"
                    data-bs-display="static"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="avatar-img rounded-circle"
                      src={user.image}
                      alt="avatar"
                    />
                  </a>
                  {/* Profile dropdown START */}
                  <ul
                    className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
                    aria-labelledby="profileDropdown"
                  >
                    {/* Profile info */}
                    <li className="px-3 mb-3">
                      <div className="d-flex align-items-center">
                        {/* Avatar */}
                        <div className="avatar me-3">
                          <img
                            className="avatar-img rounded-circle shadow"
                            src={user.image}
                            alt="avatar"
                          />
                        </div>
                        <div>
                          <a className="h6 mt-2 mt-sm-0">
                            {user.prenom} {user.nom}
                          </a>
                          <p className="small m-0">{user.email}</p>
                        </div>
                      </div>
                    </li>
                    {/* Links */}
                    <li>
                      {" "}
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        to="profile"
                        className={`dropdown-item ${
                          isActive("profile") ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-person fa-fw me-2"></i> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="editProfile"
                        className={`dropdown-item ${
                          isActive("editProfile") ? "active" : ""
                        }`}
                      >
                        <i className="bi bi-gear fa-fw me-2"></i> Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item bg-danger-soft-hover"
                        onClick={logout}
                      >
                        <i className="bi bi-power fa-fw me-2" />
                        Sign Out
                      </button>
                    </li>
                    <li>
                      {" "}
                      <hr className="dropdown-divider" />
                    </li>
                    {/* Dark mode options START */}
                    <li>
                      <div className="nav-pills-primary-soft theme-icon-active d-flex align-items-center p-2 pb-0">
                        <span className="me-5">Mode:</span>
                        <button
                          type="button"
                          className={`btn btn-link nav-link text-primary-hover me-3 mb-0 p-0 ${
                            theme === "light" ? "active" : ""
                          }`}
                          data-bs-theme-value="light"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-title="Light"
                          onClick={() => setTheme("light")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-sun fa-fw mode-switch"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                            <use />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-link nav-link text-primary-hover mb-0 p-0 ${
                            theme === "dark" ? "active" : ""
                          }`}
                          data-bs-theme-value="dark"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-title="Dark"
                          onClick={() => setTheme("dark")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-moon-stars fa-fw mode-switch"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                            <use />
                          </svg>
                        </button>
                      </div>
                    </li>
                    {/* Dark mode options END*/}
                  </ul>
                  {/* Profile dropdown END */}
                </li>
                {/* Profile dropdown END */}
              </ul>
              {/* Profile and Notification START */}
            </div>
          </nav>
          {/* Logo Nav END */}
        </header>
        {/* Header END */}
        {/* **************** MAIN CONTENT START **************** */}
        <main>
          {/* =======================
Content START */}
          <section className="pt-3">
            <div className="container">
              <div className="row">
                {/* Sidebar START */}
                <div className="col-lg-4 col-xl-3">
                  {/* Responsive offcanvas body START */}
                  <div
                    className="offcanvas-lg offcanvas-end"
                    tabIndex={-1}
                    id="offcanvasSidebar"
                  >
                    {/* Offcanvas header */}
                    <div className="offcanvas-header justify-content-end pb-2">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        data-bs-target="#offcanvasSidebar"
                        aria-label="Close"
                      />
                    </div>
                    {/* Offcanvas body */}
                    <div className="offcanvas-body p-3 p-lg-0">
                      <div className="card bg-light w-100">
                        {/* Card body START */}
                        <div className="card-body p-3">
                          {/* Avatar and content */}
                          <div className="text-center mb-3">
                            {/* Avatar */}
                            <div className="avatar avatar-xl mb-2">
                              <img
                                className="avatar-img rounded-circle border border-2 border-white"
                                src={user.image}
                              />
                            </div>
                            <h6 className="mb-0">
                              {user.prenom} {user.nom}
                            </h6>
                            <a className="text-reset text-primary-hover small">
                              {user.email}
                            </a>
                            <hr />
                          </div>
                          {/* Sidebar menu item START */}
                          <ul className="nav nav-pills-primary-soft flex-column">
                            <li className="nav-item">
                              <a
                                className={`nav-link ${
                                  isActive("liste") ? "active" : ""
                                }`}
                                onClick={() => navigate("liste")}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="bi bi-journals fa-fw me-1" />
                                Liste projets
                              </a>
                            </li>

                            <li className="nav-item">
                              <a
                                className={`nav-link ${
                                  isActive("forms/liste") ? "active" : ""
                                }`}
                                onClick={() => navigate("forms/liste")}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="bi bi-journals fa-fw me-1" />
                                Mes Contributions
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                className={`nav-link ${
                                  isActive("listResponse") ? "active" : ""
                                }`}
                                onClick={() => navigate("listResponse")}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="bi bi-journals fa-fw me-1" />
                                Mes reponses
                              </a>
                            </li>
                            <li className="nav-item">
                              <button
                                className="nav-link text-danger bg-danger-soft-hover"
                                onClick={logout}
                              >
                                <i className="fas fa-sign-out-alt fa-fw me-2" />
                                Sign Out
                              </button>
                            </li>
                          </ul>
                          {/* Sidebar menu item END */}
                        </div>
                        {/* Card body END */}
                      </div>
                    </div>
                  </div>
                  {/* Responsive offcanvas body END */}
                </div>
                {/* Sidebar END */}
                {/* Main content START */}
                <div className="col-lg-8 col-xl-9">
                  {/* Offcanvas menu button */}
                  <div className="d-grid mb-0 d-lg-none w-100">
                    <button
                      className="btn btn-primary mb-4"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasSidebar"
                      aria-controls="offcanvasSidebar"
                    >
                      <i className="fas fa-sliders-h" /> Menu
                    </button>
                  </div>
                  <Outlet></Outlet>
                </div>

                {/* Main content END */}
              </div>
            </div>
          </section>
          {/* =======================
Content END */}
        </main>
        {/* **************** MAIN CONTENT END **************** */}
        {/* =======================
Footer START */}
        <footer className="bg-dark p-3">
          <div className="container">
            <div className="row align-items-center">
              {/* Widget */}
              <div className="col-md-4">
                <div className="text-center text-md-start mb-3 mb-md-0">
                  <a>
                    {" "}
                    <img
                      src="assets/images/logo.png"
                      style={{ height: "75px" }}
                      alt="logo"
                    />{" "}
                  </a>
                </div>
              </div>
              {/* Widget */}
              <div className="col-md-8">
                <div className="text-center text-body-secondary text-primary-hover mb-3">
                  {" "}
                  Copyrights ©2024 CoMediC. Build by{" "}
                  <a href="https://esprit.tn/" className="text-body-secondary">
                    ESPRIT
                  </a>
                  .{" "}
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* =======================
Footer END */}
      </div>
    </>
  );
}

export default DashboardPatient;
