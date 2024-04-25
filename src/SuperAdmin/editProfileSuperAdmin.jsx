import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";

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

function EditProfileSuperAdmin() {
  const [user, setUser] = useState({});
  const [gall, setGall] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userId = localStorage.getItem("USER_ID");

    try {
      const response = await axios.get(
        `${base_url}/superAdmin/getById/${userId}`
      );
      setUser({
        ...response.data.data,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const onchange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!user.nom.trim()) errors.nom = "Last name is required.";
    if (!user.prenom.trim()) errors.prenom = "First name is required.";
    if (!user.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(user.email)) {
      errors.email = "Email is not valid.";
    }
    if (!user.telephone.trim()) errors.telephone = "Phone number is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    let errors = {};

    if (!user.oldPassword) {
      errors.oldPassword = "Current Password is required";
    } else if (user.oldPassword.length < 6) {
      errors.oldPassword = "Current Password must be at least 6 characters";
    }

    if (!user.newPassword) {
      errors.newPassword = "New Password is required";
    } else if (user.newPassword.length < 6) {
      errors.newPassword = "New Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    const userId = localStorage.getItem("USER_ID");

    const formData = new FormData();
    formData.append("nom", user?.nom);
    formData.append("prenom", user?.prenom);
    formData.append("telephone", user?.telephone);
    formData.append("email", user?.email);
    for (let i = 0; i < gall.length; i++) {
      formData.append("photo", gall[i]);
    }

    axios
      .put(`${base_url}/superAdmin/update/${userId}`, formData)
      .then((res) => {
        const currentUser = JSON.parse(localStorage.getItem("USER"));
        const updatedUser = res.data;
        const newUser = { ...currentUser, ...updatedUser };

        localStorage.setItem("USER", JSON.stringify(newUser));
        console.log(res.data);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Your profile has been successfully updated.",
        });

        fetchProfileData();
      })
      .catch((err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "An error occurred, please try again later.",
        });
        console.log(err);
      });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const userId = localStorage.getItem("USER_ID");

    // Préparer le corps de la requête au format JSON
    const dataToSend = {
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };

    axios
      .put(`${base_url}/superAdmin/updatePassword/${userId}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Your password has been successfully updated.",
        });

        setUser({ ...user, oldPassword: "", newPassword: "" });
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data.message === "Old password is incorrect"
        ) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: "Old password is incorrect.",
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: "An error occurred, please try again later.",
          });

          console.log(err);
        }
      });
  };

  const handleImage = (e) => {
    setGall(e.target.files);
  };

  return (
    <>
      <div className="page-content-wrapper p-xxl-4">
        {/* Title */}
        <div className="row">
          <div className="col-12 mb-4 mb-sm-5">
            <h1 className="h3 mb-0">
              <i className="bi bi-gear fa-fw me-1"></i>Settings
            </h1>
          </div>
        </div>

        <div>
          {/* Tabs START */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="bg-light pb-0 px-2 px-lg-0 rounded-top">
                <ul
                  className="nav nav-tabs nav-bottom-line nav-responsive border-0 nav-justified"
                  role="tablist"
                >
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link mb-0 active"
                      data-bs-toggle="tab"
                      href="#tab-1"
                    >
                      <i className="fas fa-address-card fa-fw me-2" />
                      Edit Profile
                    </a>{" "}
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link mb-0"
                      data-bs-toggle="tab"
                      href="#tab-2"
                    >
                      <i className="fas fa-key fa-fw me-2" />
                      Edit Password
                    </a>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Tabs END */}
          {/* Tabs Content START */}
          <div className="row g-4">
            <div className="col-12">
              <div className="tab-content">
                {/* Tab content 1 START */}
                <div className="tab-pane show active" id="tab-1">
                  <div className="row g-4">
                    {/* Edit profile START */}
                    <div className="col-lg-12">
                      <div className="card shadow">
                        <div className="card-header border-bottom">
                          <h5 className="card-header-title">
                            Personal Information
                          </h5>
                        </div>
                        <form
                          onSubmit={handleProfileUpdate}
                          className="card-body row g-3"
                        >
                          {/* Profile picture */}
                          <div className="mb-3">
                            <label className="form-label">
                              Upload your profile photo
                              <span className="text-danger">*</span>
                            </label>
                            {/* Avatar upload START */}
                            <div className="d-flex align-items-center">
                              <label
                                className="position-relative me-4"
                                htmlFor="uploadfile-1"
                                title="Replace this pic"
                              >
                                {/* Avatar place holder */}
                                <span className="avatar avatar-xl">
                                  <img
                                    id="uploadfile-1-preview"
                                    className="avatar-img rounded-circle border border-white border-3 shadow"
                                    src={user.image}
                                  />
                                </span>
                              </label>
                              {/* Upload button */}
                              <label
                                className="btn btn-sm btn-primary-soft mb-0"
                                htmlFor="uploadfile-1"
                              >
                                Change
                              </label>
                              <input
                                id="uploadfile-1"
                                className="form-control d-none"
                                type="file"
                                name="image"
                                onChange={handleImage}
                              />
                            </div>
                            {/* Avatar upload END */}
                          </div>
                          {/* First Name */}
                          <div className="col-md-6">
                            <label className="form-label">
                              First name<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="prenom"
                              value={user.prenom || ""}
                              onChange={onchange}
                            />
                            {formErrors.prenom && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.prenom}
                              </div>
                            )}
                          </div>
                          {/* Last Name */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Last name<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="nom"
                              value={user.nom || ""}
                              onChange={onchange}
                            />
                            {formErrors.nom && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.nom}
                              </div>
                            )}
                          </div>
                          {/* Email id */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Email address
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={user.email || ""}
                              onChange={onchange}
                            />
                            {formErrors.email && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.email}
                              </div>
                            )}
                          </div>
                          {/* Mobile number */}
                          <div className="col-md-6">
                            <label className="form-label">
                              Phone number
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="telephone"
                              value={user.telephone || ""}
                              onChange={onchange}
                            />
                            {formErrors.telephone && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.telephone}
                              </div>
                            )}
                          </div>
                          {/* Save button */}
                          <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn btn-primary">
                              Save change
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* Edit profile END */}
                  </div>
                </div>
                {/* Tab content 1 END */}
                {/* Tab content 2 START */}
                <div className="tab-pane" id="tab-2">
                  <div className="col-lg-12">
                    <div className="card shadow">
                      <div className="card-header border-bottom">
                        <h5 className="card-header-title">Update Password</h5>
                      </div>
                      {/* Card body START */}
                      <form
                        className="card-body"
                        onSubmit={handlePasswordUpdate}
                      >
                        {/* Old password */}
                        <div className="mb-3">
                          <label htmlFor="pswo-input" className="form-label">
                            {" "}
                            Current password
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="pswo-input"
                              name="oldPassword"
                              value={user.oldPassword || ""}
                              onChange={onchange}
                            />
                            <span
                              className="input-group-text p-0 bg-transparent"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`fakepasswordicon fas ${
                                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                } cursor-pointer p-2`}
                              />
                            </span>
                          </div>
                          {formErrors.oldPassword && (
                            <div className="text-danger mt-1">
                              <i className="bi bi-exclamation-triangle"></i>{" "}
                              {formErrors.oldPassword}
                            </div>
                          )}
                        </div>
                        {/* New password */}
                        <div className="mb-3">
                          <label htmlFor="psw-input" className="form-label">
                            {" "}
                            Enter new password
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              className="form-control fakepassword"
                              type={isPasswordVisible ? "text" : "password"}
                              id="psw-input"
                              name="newPassword"
                              value={user.newPassword || ""}
                              onChange={onchange}
                            />
                            <span
                              className="input-group-text p-0 bg-transparent"
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`fakepasswordicon fas ${
                                  isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                                } cursor-pointer p-2`}
                              />
                            </span>
                          </div>
                          {formErrors.newPassword && (
                            <div className="text-danger mt-1">
                              <i className="bi bi-exclamation-triangle"></i>{" "}
                              {formErrors.newPassword}
                            </div>
                          )}
                        </div>
                        <div className="text-end mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary mb-0"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                      {/* Card body END */}
                    </div>
                  </div>
                </div>
                {/* Tab content 2 END */}
              </div>
            </div>
          </div>
          {/* Tabs Content END */}
        </div>
      </div>
    </>
  );
}

export default EditProfileSuperAdmin;
