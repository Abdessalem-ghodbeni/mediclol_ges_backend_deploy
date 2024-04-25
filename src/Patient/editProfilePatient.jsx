import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { base_url } from "../baseUrl";
import { format, isBefore, parseISO, endOfDay } from "date-fns";

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

function EditProfilePatient() {
  const updateProfile = JSON.parse(localStorage.getItem("updateProfile"));
  const twoFactorQrCode = localStorage.getItem("twoFactorQrCode");
  const isTwoFactorEnabled = JSON.parse(
    localStorage.getItem("isTwoFactorEnabled")
  );

  const [user, setUser] = useState({});
  const [gall, setGall] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
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
      const response = await axios.get(`${base_url}/patient/getById/${userId}`);
      setUser({
        ...response.data.data,
        // Utilisez format de date-fns pour formater la date
        dateNaissance: response.data.data.dateNaissance
          ? format(new Date(response.data.data.dateNaissance), "yyyy-MM-dd")
          : "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const onchange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onchangeGender = (e) => {
    setUser({ ...user, sexe: e.target.value });
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
    if (!user.dateNaissance.trim()) {
      errors.dateNaissance = "Date of birth is required.";
    } else if (!isBefore(parseISO(user.dateNaissance), endOfDay(new Date()))) {
      // Ici, on vérifie si la date de naissance est postérieure à la fin de la journée actuelle.
      errors.dateNaissance = "Date of birth must be in the past.";
    }
    if (!user.sexe.trim()) errors.specialite = "Gender is required.";

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

  const validateTwoFactorAuthentication = () => {
    let errors = {};

    if (!verificationCode) {
      errors.verificationCode = "Verification code is required.";
    } else if (verificationCode.length !== 6) {
      errors.verificationCode = "Verification code must be 6 digits long.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Retourne true si aucune erreur
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    const userId = localStorage.getItem("USER_ID");

    const formData = new FormData();
    formData.append("nom", user?.nom);
    formData.append("prenom", user?.prenom);
    formData.append("telephone", user?.telephone);
    formData.append("sexe", user?.sexe);
    formData.append("dateNaissance", user?.dateNaissance);
    formData.append("email", user?.email);
    for (let i = 0; i < gall.length; i++) {
      formData.append("photo", gall[i]);
    }

    axios
      .put(`${base_url}/patient/update/${userId}`, formData)
      .then((res) => {
        const currentUser = JSON.parse(localStorage.getItem("USER"));
        const updatedUser = res.data;
        const newUser = { ...currentUser, ...updatedUser };

        localStorage.setItem("USER", JSON.stringify(newUser));
        localStorage.setItem("updateProfile", JSON.stringify(true));
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
      .put(`${base_url}/patient/updatePassword/${userId}`, dataToSend, {
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

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!validateTwoFactorAuthentication()) return;

    const userId = localStorage.getItem("USER_ID");

    try {
      const response = await axios.post(
        `${base_url}/authentification/verify2fa/${userId}`,
        {
          token: verificationCode, // Envoyez verificationCode comme token
        }
      );

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
        title: "Two-Factor Authentication verified successfully!",
      });

      localStorage.setItem("isTwoFactorEnabled", JSON.stringify(true));

      setVerificationCode("");
      navigate(0);
    } catch (error) {
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
        title: "Please ensure the code is correct and try again.",
      });
      console.error("Erreur lors de la vérification de 2FA", error);
    }
  };

  const handleDisable2FA = async () => {
    const userId = localStorage.getItem("USER_ID");
    try {
      const response = await axios.post(
        `${base_url}/authentification/disable2fa/${userId}`
      );

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
        title: "Two-Factor Authentication successfully disabled",
      });

      localStorage.setItem("isTwoFactorEnabled", JSON.stringify(false));
      navigate(0);
    } catch (error) {
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
        title: "An error occurred while disabling two-factor authentication.",
      });
      console.error("Erreur lors de l'désactivation de 2FA", error);
    }
  };

  return (
    <>
      <section className="pt-0">
        <div className="container vstack gap-4">
          {/* Title START */}
          <div className="row">
            <div className="col-12">
              <h1 className="fs-4 mb-0">
                <i className="bi bi-gear fa-fw me-1"></i>Settings
              </h1>
            </div>
          </div>

          {/* Verified message */}
          {!updateProfile && (
            <div className="bg-light rounded p-3">
              {/* Progress bar */}
              <div className="overflow-hidden">
                <h6>Complete Your Profile</h6>
                <div className="progress progress-sm bg-success bg-opacity-10">
                  <div
                    className="progress-bar bg-success aos"
                    role="progressbar"
                    data-aos="slide-right"
                    data-aos-delay={200}
                    data-aos-duration={1000}
                    data-aos-easing="ease-in-out"
                    style={{ width: "60%" }}
                    aria-valuenow={60}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span className="progress-percent-simple h6 fw-light ms-auto">
                      60%
                    </span>
                  </div>
                </div>
                <p className="mb-0">
                  Get the most out of access to all the platform's features by
                  adding the remaining details!
                </p>
              </div>
              {/* Content */}
              <div className="bg-body rounded p-3 mt-3">
                <ul className="list-inline hstack flex-wrap gap-2 justify-content-between mb-0">
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <a>
                      <i className="bi bi-check-circle-fill text-success me-2" />
                      Verified Email
                    </a>
                  </li>
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <a>
                      <i className="bi bi-check-circle-fill text-success me-2" />
                      The account has been confirmed by the administrator
                    </a>
                  </li>
                  <li className="list-inline-item h6 fw-normal mb-0">
                    <Link to="/patient/editProfile" className="text-primary">
                      <i className="bi bi-plus-circle-fill me-2" />
                      Complete Basic Info
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Title END */}
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
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link mb-0"
                        data-bs-toggle="tab"
                        href="#tab-3"
                      >
                        <i className="bi bi-shield-lock-fill fa-fw me-2" />
                        Two-Factor Authentication (2FA)
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
                      <div className="col-12">
                        <div className="card border">
                          {/* Card header */}
                          <div className="card-header border-bottom">
                            <h4 className="card-header-title">
                              Personal Information
                            </h4>
                          </div>
                          {/* Card body START */}
                          <div className="card-body">
                            {/* Form START */}
                            <form
                              className="row g-3"
                              onSubmit={handleProfileUpdate}
                            >
                              {/* Profile photo */}
                              <div className="col-12">
                                <label className="form-label">
                                  Upload your profile photo
                                  <span className="text-danger">*</span>
                                </label>
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
                              </div>
                              {/* Name */}
                              <div className="col-md-6">
                                <label className="form-label">
                                  First name
                                  <span className="text-danger">*</span>
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
                              {/* Name */}
                              <div className="col-md-6">
                                <label className="form-label">
                                  Last name
                                  <span className="text-danger">*</span>
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
                              {/* Email */}
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
                              {/* Mobile */}
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
                              {/* Date of birth */}
                              <div className="col-md-6">
                                <label className="form-label">
                                  Date of Birth
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="dateNaissance"
                                  value={user.dateNaissance || ""}
                                  onChange={onchange}
                                />
                                {formErrors.dateNaissance && (
                                  <div className="text-danger mt-1">
                                    <i className="bi bi-exclamation-triangle"></i>{" "}
                                    {formErrors.dateNaissance}
                                  </div>
                                )}
                              </div>
                              {/* Gender Selection */}
                              <div className="col-md-6">
                                <label className="form-label">
                                  Select Gender
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="d-flex gap-4">
                                  <div className="form-check radio-bg-light">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="sexe"
                                      id="flexRadioDefault1"
                                      value="Male"
                                      checked={user.sexe === "Male"}
                                      onChange={onchangeGender}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexRadioDefault1"
                                    >
                                      Male
                                    </label>
                                  </div>
                                  <div className="form-check radio-bg-light">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="sexe"
                                      id="flexRadioDefault2"
                                      value="Female"
                                      checked={user.sexe === "Female"}
                                      onChange={onchangeGender}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexRadioDefault2"
                                    >
                                      Female
                                    </label>
                                  </div>
                                </div>
                                {formErrors.sexe && (
                                  <div className="text-danger mt-1">
                                    <i className="bi bi-exclamation-triangle"></i>{" "}
                                    {formErrors.sexe}
                                  </div>
                                )}
                              </div>
                              {/* Button */}
                              <div className="col-12 text-end">
                                <button
                                  type="submit"
                                  className="btn btn-primary mb-0"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                            {/* Form END */}
                          </div>
                          {/* Card body END */}
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
                                    isPasswordVisible
                                      ? "fa-eye"
                                      : "fa-eye-slash"
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
                                    isPasswordVisible
                                      ? "fa-eye"
                                      : "fa-eye-slash"
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
                  {/* Tab content 3 START */}
                  <div className="tab-pane" id="tab-3">
                    <div className="col-lg-12">
                      <div className="card shadow">
                        <div className="card-header border-bottom">
                          <h5 className="card-header-title">
                            Two-Factor Authentication
                          </h5>
                        </div>
                        {/* Card body START */}
                        <div
                          className="alert alert-light mt-4 me-4 ms-4 mb-4"
                          role="alert"
                        >
                          {/* Title */}
                          <div className="d-sm-flex align-items-center mb-3">
                            <h5 className="alert-heading mb-0">
                              Two-Factor Authentication (2FA)
                            </h5>
                          </div>
                          {/* Content */}
                          <p className="mb-3">
                            2FA increases the security of your account. Even if
                            someone guesses your password, they won’t be able to
                            access your account.
                          </p>
                          <div>
                            <h6 className="mb-2">Authenticator app</h6>
                            <p className="mb-3">
                              Authenticator apps and browser extensions like{" "}
                              <a href="https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid">
                                Google Authenticator
                              </a>
                              ,{" "}
                              <a href="https://www.microsoft.com/en-us/security/mobile-authenticator-app">
                                Microsoft Authenticator
                              </a>
                              , etc. generate one-time passwords that are used
                              as a second factor to verify your identity when
                              prompted during sign-in.
                            </p>
                          </div>
                          <div>
                            <h6 className="mb-2">Scan the QR code</h6>
                            <p className="mb-3">
                              Use an authenticator app or browser extension to
                              scan.
                            </p>
                          </div>
                          <div className="d-flex justify-content-center">
                            <img
                              src={twoFactorQrCode}
                              alt="QR Code for 2FA"
                              style={{ width: "25%", height: "auto" }}
                              className="mb-3 rounded"
                            />
                          </div>
                          <div className="mb-3 mt-3 col-4">
                            <h6 className="mb-2">
                              Verify the code from the app
                              <span className="text-danger">*</span>
                            </h6>
                            <input
                              className="form-control mb-3"
                              placeholder="XXXXXX"
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(e.target.value)
                              }
                              disabled={isTwoFactorEnabled}
                            />
                            {formErrors.verificationCode && (
                              <div className="text-danger mt-1">
                                <i className="bi bi-exclamation-triangle"></i>{" "}
                                {formErrors.verificationCode}
                              </div>
                            )}
                          </div>
                          {/* Button and price */}
                          <div className="d-sm-flex align-items-center">
                            <button
                              className="btn btn-sm btn-success mb-2 mb-sm-0 me-3"
                              onClick={handleVerify2FA}
                              disabled={isTwoFactorEnabled}
                            >
                              Save
                            </button>
                            {isTwoFactorEnabled && (
                              <button
                                className="btn btn-sm btn-danger mb-2 mb-sm-0 me-3"
                                onClick={handleDisable2FA}
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Card body END */}
                      </div>
                    </div>
                  </div>
                  {/* Tab content 3 END */}
                </div>
              </div>
            </div>
            {/* Tabs Content END */}
          </div>
        </div>
      </section>
    </>
  );
}

export default EditProfilePatient;
