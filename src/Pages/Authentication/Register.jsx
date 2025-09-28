import { useEffect, useState } from "react";
import { axiosinstance } from "../../Configuration/axios/axiosConfiguration";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Register = () => {
    const selector = useSelector((state) => state);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{6,}$/;

    const navigator = useNavigate();
    
    const [RegisterUser, SetRegisterUser] = useState({
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPassword: "",
        userConfirmPassword: ""
    });

    const [error, setError] = useState({
        userFirstNameError: null,
        userLastNameError: null,
        userEmailError: null,
        userPasswordError: null,
        userConfirmPasswordError: null
    });

    useEffect(() => {
        if (RegisterUser.userConfirmPassword && RegisterUser.userPassword) {
            if (RegisterUser.userConfirmPassword !== RegisterUser.userPassword) {
                setError(prev => ({ ...prev, userConfirmPasswordError: "Confirm Password Not Matched with Password" }));
            } else {
                setError(prev => ({ ...prev, userConfirmPasswordError: null }));
            }
        }
    }, [RegisterUser.userPassword, RegisterUser.userConfirmPassword]);

    const UserInputChanges = (event) => {
        var targetInput = event.target;
        switch (targetInput.name) {
            case "userFirstName":
                if (targetInput.value.length === 0) {
                    setError({ ...error, userFirstNameError: "First Name Is Required" });
                }
                else if (targetInput.value.length < 3) {
                    setError({ ...error, userFirstNameError: "Minimum Length Is 3 Characters" });
                }
                else {
                    setError({ ...error, userFirstNameError: null })
                    SetRegisterUser({ ...RegisterUser, userFirstName: targetInput.value });
                }
                break;
            case "userLastName":
                if (targetInput.value.length === 0) {
                    setError({ ...error, userLastNameError: "Last Name Is Required" });
                }
                else if (targetInput.value.length < 3) {
                    setError({ ...error, userLastNameError: "Minimum Length Is 3 Characters" });
                }
                else {
                    setError({ ...error, userLastNameError: null })
                    SetRegisterUser({ ...RegisterUser, userLastName: targetInput.value });
                }
                break;
            case "userEmail":
                if (targetInput.value.length === 0) {
                    setError({ ...error, userEmailError: "Email Is Required" });
                }
                else if (!emailRegex.test(targetInput.value)) {
                    setError({ ...error, userEmailError: "InCorrect Email Format (realEmail@gmail.com)" });
                }
                else {
                    setError({ ...error, userEmailError: null });
                    SetRegisterUser({ ...RegisterUser, userEmail: targetInput.value });
                }
                break;
            case "userPassword":
                if (targetInput.value.length === 0) {
                    setError({ ...error, userPasswordError: "Password Is Required" })
                }
                else if (!passwordRegex.test(targetInput.value)) {
                    setError({ ...error, userPasswordError: "Password Must Have at least one (UpperCase & LowerCase & Special Character & Number) With Minimum Length 6 Character" })
                }
                else {
                    setError({ ...error, userPasswordError: null });
                    SetRegisterUser({ ...RegisterUser, userPassword: targetInput.value });
                }
                break;
            case "userConfirmPassword":
                if (targetInput.value.length === 0) {
                    setError({ ...error, userConfirmPasswordError: "Confirm Password Is Required" });
                }
                else if (targetInput.value !== RegisterUser.userPassword) {
                    setError({ ...error, userConfirmPasswordError: "Confirm Password Not Matched with Password" });
                }
                else {
                    setError({ ...error, userConfirmPasswordError: null })
                    SetRegisterUser({ ...RegisterUser, userConfirmPassword: targetInput.value })
                }
                break;
            default:
                break;
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        axiosinstance.post('api/Auth/Register', {
            userFirstName: RegisterUser.userFirstName,
            userLastName: RegisterUser.userLastName,
            userEmail: RegisterUser.userEmail,
            userPassword: RegisterUser.userPassword
        }).then(function (response) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Account Created Successfully",
                showConfirmButton: false,
                timer: 1500
            });
            navigator("/auth/login")
        }).catch(function (error) {
            var responseErrors = [""];
            responseErrors = error.response.data.errors;
            var alertTitle = responseErrors.join(",");
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: alertTitle,
                showConfirmButton: false,
                timer: 1500
            });
        });
    }

    return (
        <div className="container-fluid vh-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="row justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title fw-bold text-primary mb-2">Create Account</h2>
                                <p className="text-muted mb-0">Sign up for a new account</p>
                            </div>

                            <form method="post" onSubmit={(e) => { handleRegisterSubmit(e) }}>
                                {
                                    selector.PageIsLoading.isLoading===true ?(
                                        <div className="loading-overlay" style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 9999
                                        }}>
                                            <div className="text-center">
                                                <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2 text-dark fw-semibold">Logging in...</p>
                                            </div>
                                        </div>
                                    ):
                                    <></>
                                }
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="userFirstName" className="form-label fw-semibold text-dark">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${error.userFirstNameError ? 'is-invalid border-danger' : 'border-2'}`}
                                            id="userFirstName"
                                            name="userFirstName"
                                            onChange={(e) => { UserInputChanges(e) }}
                                            required
                                            minLength={3}
                                            placeholder="Enter your first name"
                                        />
                                        {error.userFirstNameError && (
                                            <div className="invalid-feedback d-block fw-semibold">
                                                {error.userFirstNameError}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="userLastName" className="form-label fw-semibold text-dark">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg ${error.userLastNameError ? 'is-invalid border-danger' : 'border-2'}`}
                                            id="userLastName"
                                            name="userLastName"
                                            onChange={(e) => { UserInputChanges(e) }}
                                            required
                                            minLength={3}
                                            placeholder="Enter your last name"
                                        />
                                        {error.userLastNameError && (
                                            <div className="invalid-feedback d-block fw-semibold">
                                                {error.userLastNameError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="userEmail" className="form-label fw-semibold text-dark">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control form-control-lg ${error.userEmailError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="userEmail"
                                        name="userEmail"
                                        onChange={(e) => { UserInputChanges(e) }}
                                        required
                                        placeholder="Enter your email"
                                    />
                                    <div id="emailHelp" className="form-text text-muted small mt-2">
                                        We'll never share your email with anyone else.
                                    </div>
                                    {error.userEmailError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.userEmailError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="userPassword" className="form-label fw-semibold text-dark">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control form-control-lg ${error.userPasswordError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="userPassword"
                                        name="userPassword"
                                        onChange={(e) => { UserInputChanges(e) }}
                                        required
                                        minLength={6}
                                        placeholder="Enter your password"
                                    />
                                    <div className="form-text text-muted small mt-2">
                                        Password must contain uppercase, lowercase, number, and special character.
                                    </div>
                                    {error.userPasswordError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.userPasswordError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="userConfirmPassword" className="form-label fw-semibold text-dark">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control form-control-lg ${error.userConfirmPasswordError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="userConfirmPassword"
                                        name="userConfirmPassword"
                                        onChange={(e) => { UserInputChanges(e) }}
                                        required
                                        minLength={6}
                                        disabled={RegisterUser.userPassword === "" || error.userPasswordError}
                                        placeholder="Confirm your password"
                                    />
                                    {error.userConfirmPasswordError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.userConfirmPasswordError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="termsCheck" required />
                                        <label className="form-check-label text-muted" htmlFor="termsCheck">
                                            I agree to the terms and conditions
                                        </label>
                                        <div className="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm"
                                    disabled={
                                        error.userFirstNameError ||
                                        error.userLastNameError ||
                                        error.userEmailError ||
                                        error.userPasswordError ||
                                        error.userConfirmPasswordError ||
                                        !RegisterUser.userFirstName ||
                                        !RegisterUser.userLastName ||
                                        !RegisterUser.userEmail ||
                                        !RegisterUser.userPassword ||
                                        !RegisterUser.userConfirmPassword
                                    }
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Already have an account?{" "}
                                    <a href="/auth/login" className="text-decoration-none fw-bold text-primary">
                                        Login here
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;