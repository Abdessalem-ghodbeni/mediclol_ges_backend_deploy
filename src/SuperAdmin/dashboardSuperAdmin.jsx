import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { base_url } from "../baseUrl";
import Logout from "../Authentification/logout";
import { ProjectOutlined, FormOutlined } from "@ant-design/icons";
// import { Link, Outlet,  } from "react-router-dom";
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

function DashboardSuperAdmin() {
  const [theme, setTheme] = useTheme();

  const location = useLocation();

  // Fonction pour déterminer si le chemin est actif
  const isActive = (path) => location.pathname.includes(path);

  const { logout } = Logout();

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${base_url}/superAdmin/getById/${userId}`
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
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        {/* Sidebar START */}
        <nav className="navbar sidebar navbar-expand-xl navbar-light">
          {/* Navbar brand for xl START */}
          <div className="d-flex align-items-center">
            <a className="navbar-brand">
              <img
                className="light-mode-item navbar-brand-item"
                src="assets/images/logo.png"
                style={{ height: "70px" }}
                alt="logo"
              />
              <img
                className="dark-mode-item navbar-brand-item"
                src="assets/images/logo.png"
                style={{ height: "70px" }}
                alt="logo"
              />
            </a>
          </div>
          {/* Navbar brand for xl END */}
          <div
            className="offcanvas offcanvas-start flex-row custom-scrollbar h-100"
            data-bs-backdrop="true"
            tabIndex={-1}
            id="offcanvasSidebar"
          >
            <div className="offcanvas-body sidebar-content d-flex flex-column pt-4">
              {/* Sidebar menu START */}
              <ul className="navbar-nav flex-column" id="navbar-sidebar">
                <div>
                  {/* Menu item */}
                  <li className="nav-item">
                    {" "}
                    <Link
                      className={`nav-link ${
                        isActive("dashboard") ? "active" : ""
                      }`}
                      to="dashboard"
                    >
                      <i className="bi bi-house fa-fw me-1"></i>Dashboard
                    </Link>
                  </li>
                  {/* Title */}
                  <li className="nav-item ms-2 my-2">Pages</li>
                </div>

                {/* Menu item */}
                <li className="nav-item">
                  {" "}
                  <Link
                    className={`nav-link ${
                      isActive("domaineProfessionnel") ? "active" : ""
                    }`}
                    to="domaineProfessionnel"
                  >
                    <i className="bi bi-envelope-at fa-fw me-1"></i>Professional
                    Domain
                  </Link>
                </li>
                {/* Menu item */}
                <li className="nav-item">
                  {" "}
                  <Link
                    className={`nav-link ${
                      isActive("listInternaute") ? "active" : ""
                    }`}
                    to="listInternaute"
                  >
                    <i className="bi bi-card-list fa-fw me-1"></i>Health
                    Professionals List
                  </Link>
                </li>
                {/* Menu item */}
                <li className="nav-item">
                  {" "}
                  <Link
                    className={`nav-link ${
                      isActive("listPatient") ? "active" : ""
                    }`}
                    to="listPatient"
                  >
                    <i className="bi bi-list fa-fw me-1"></i>Patient List
                  </Link>
                </li>

                {/* Menu item */}
                <li className="nav-item">
                  {" "}
                  <Link
                    className={`nav-link ${
                      isActive("listPublications") ? "active" : ""
                    }`}
                    to="listPublications"
                  >
                    <i className="bi bi-card-heading fa-fw me-1"></i>
                    Publications List
                  </Link>
                </li>

                <li className="nav-item">
                  {" "}
                  <div
                    className="nav-link d-flex jutify-content-center align-items-center"
                    to="listPatient"
                    onClick={() => navigate("/superAdmin/forms/liste")}
                    style={{ cursor: "pointer" }}
                  >
                    <FormOutlined className="me-2" /> Forms List
                  </div>
                </li>
                <li className="nav-item">
                  {" "}
                  <div
                    className="nav-link d-flex jutify-content-center align-items-center"
                    to="listPatient"
                    onClick={() => navigate("/superAdmin/projets/liste")}
                    style={{ cursor: "pointer" }}
                  >
                    <ProjectOutlined className="me-2" /> Project List
                  </div>
                </li>
                {/* Menu item */}
                <li className="nav-item">
                  {" "}
                  <Link
                    className={`nav-link ${
                      isActive("feedbacklist") ? "active" : ""
                    }`}
                    to="feedbacklist"
                  >
                    <i className="bi bi-clipboard-data fa-fw me-1"></i>Feedback
                    List
                  </Link>
                </li>

                {/* Menu item **Organization Management** */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="collapse"
                    href="#collapsebooking"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapsebooking"
                  >
                    <i className="bi bi-hospital fa-fw me-1"></i>Organization
                  </a>
                  {/* Submenu */}
                  <ul
                    className="nav collapse flex-column"
                    id="collapsebooking"
                    data-bs-parent="#navbar-sidebar"
                  >
                    <li className="nav-item">
                      {" "}
                      <Link
                        className={`nav-link ${
                          isActive("organizationlist") ? "active" : ""
                        }`}
                        to="organizationlist"
                      >
                        Organization List
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      {" "}
                      <a className="nav-link" href="/organization/details">
                        Organization Details
                      </a>
                    </li> */}
                    <li className="nav-item">
                      {" "}
                      <Link
                        className={`nav-link ${
                          isActive("categorylist") ? "active" : ""
                        }`}
                        to="categorylist"
                      >
                        Category List
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        href="/organization/category/details"
                      >
                        Category Details
                      </a>
                    </li> */}
                  </ul>
                </li>

                {/* Menu item */}
                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="collapse"
                    href="#collapsebooking"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapsebooking"
                  >
                    test
                  </a>
                  {/* Submenu */}
                {/* <ul
                    className="nav collapse flex-column"
                    id="collapsebooking"
                    data-bs-parent="#navbar-sidebar"
                  >
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link">test1</a>
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link">test2</a>
                    </li>
                  </ul>
                </li> */}
              </ul>
              {/* Sidebar menu end */}
              {/* Sidebar footer START */}
              <div className="d-flex align-items-center justify-content-center text-primary-hover mt-auto p-3">
                <button
                  className="h6 fw-light mb-0 text-body nav-link"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  aria-label="Sign out"
                  onClick={logout}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" /> Log out
                </button>
              </div>
              {/* Sidebar footer END */}
            </div>
          </div>
        </nav>
        {/* Sidebar END */}
        {/* Page content START */}
        <div className="page-content">
          {/* Top bar START */}
          <nav className="navbar top-bar navbar-light py-0 py-xl-3">
            <div className="container-fluid p-0">
              <div className="d-flex align-items-center w-100">
                {/* Logo START */}
                <div className="d-flex align-items-center d-xl-none">
                  <a className="navbar-brand">
                    <img
                      className="navbar-brand-item h-40px"
                      src="assets/images/logo2C.png"
                    />
                  </a>
                </div>
                {/* Logo END */}
                {/* Toggler for sidebar START */}
                <div className="navbar-expand-xl sidebar-offcanvas-menu">
                  <button
                    className="navbar-toggler me-auto p-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSidebar"
                    aria-controls="offcanvasSidebar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    data-bs-auto-close="outside"
                  >
                    <i
                      className="bi bi-list text-primary fa-fw"
                      data-bs-target="#offcanvasMenu"
                    />
                  </button>
                </div>
                {/* Toggler for sidebar END */}
                {/* Top bar left */}
                <div className="navbar-expand-lg ms-auto ms-xl-0">
                  {/* Toggler for menubar START */}
                  <button
                    className="navbar-toggler ms-auto p-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTopContent"
                    aria-controls="navbarTopContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  ></button>
                  {/* Toggler for menubar END */}
                </div>
                {/* Top bar left END */}
                {/* Top bar right START */}
                <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
                  {/* Dark mode options START */}
                  <li className="nav-item dropdown ms-3">
                    <button
                      className="nav-notification lh-0 btn btn-light p-0 mb-0"
                      id="bd-theme"
                      type="button"
                      aria-expanded="false"
                      data-bs-toggle="dropdown"
                      data-bs-display="static"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-circle-half fa-fw theme-icon-active"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                        <use />
                      </svg>
                    </button>
                    <ul
                      className="dropdown-menu min-w-auto dropdown-menu-end"
                      aria-labelledby="bd-theme"
                    >
                      <li className="mb-1">
                        <button
                          type="button"
                          className={`dropdown-item d-flex align-items-center ${
                            theme === "light" ? "active" : ""
                          }`}
                          data-bs-theme-value="light"
                          onClick={() => setTheme("light")}
                        >
                          <svg
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-brightness-high-fill fa-fw mode-switch me-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                            <use />
                          </svg>
                          Light
                        </button>
                      </li>
                      <li className="mb-1">
                        <button
                          type="button"
                          className={`dropdown-item d-flex align-items-center ${
                            theme === "dark" ? "active" : ""
                          }`}
                          data-bs-theme-value="dark"
                          onClick={() => setTheme("dark")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="bi bi-moon-stars-fill fa-fw mode-switch me-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                            <use />
                          </svg>
                          Dark
                        </button>
                      </li>
                    </ul>
                  </li>
                  {/* Dark mode options END*/}
                  {/* Profile dropdown START */}
                  <li
                    className="nav-item ms-3 dropdown"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Click here"
                  >
                    {/* Avatar */}
                    <a
                      className="avatar avatar-sm p-0"
                      id="profileDropdown"
                      role="button"
                      data-bs-auto-close="outside"
                      data-bs-display="static"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        className="avatar-img rounded-2"
                        src={user.image}
                        alt="avatar"
                      />
                    </a>
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
                    </ul>
                  </li>
                  {/* Profile dropdown END */}
                </ul>
                {/* Top bar right END */}
              </div>
            </div>
          </nav>
          {/* Top bar END */}
          {/* Page main content START */}
          <Outlet></Outlet>
          {/* Page main content END */}
        </div>
        {/* Page content END */}
      </main>
      {/* **************** MAIN CONTENT END **************** */}
    </>
  );
}

export default DashboardSuperAdmin;
