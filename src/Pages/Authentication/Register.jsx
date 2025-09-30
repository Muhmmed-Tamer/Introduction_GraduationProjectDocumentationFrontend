import { useEffect, useState } from "react";
import { axiosinstance } from "../../Configuration/axios/axiosConfiguration";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Register = () => {
    const navigator = useNavigate();
    const selector = useSelector((state) => state);
    
    
    const isLoading = selector.PageIsLoading?.isLoading ?? false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{6,}$/; 

    const [RegisterUser, SetRegisterUser] = useState({
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPassword: "",
        userConfirmPassword: ""
    });

    const [error, setError] = useState({
        userFirstNameError: "First Name Is Required",
        userLastNameError: "Last Name Is Required",
        userEmailError: "Email Is Required",
        userPasswordError: "Password Is Required",
        userConfirmPasswordError: "Confirm Password Is Required"
    });

    
    useEffect(() => {
        const password = RegisterUser.userPassword;
        const confirmPassword = RegisterUser.userConfirmPassword;
        
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            setError(prev => ({ ...prev, userConfirmPasswordError: "Confirm Password Must Match Password" }));
        } else if (confirmPassword.length > 0 && password === confirmPassword) {
            setError(prev => ({ ...prev, userConfirmPasswordError: null }));
        } else if (confirmPassword.length === 0 && password.length > 0) {
            setError(prev => ({ ...prev, userConfirmPasswordError: "Confirm Password Is Required" }));
        }
    }, [RegisterUser.userPassword, RegisterUser.userConfirmPassword]);

    
    const UserInputChanges = (event) => {
        const { name, value } = event.target;
        let newError = null;

        if (name === "userFirstName" || name === "userLastName") {
            if (value.length === 0) {
                newError = `${name.replace('user', '').replace('Name', ' Name')} Is Required`;
            } else if (value.length < 3) {
                newError = "Minimum Length Is 3 Characters";
            }
        } else if (name === "userEmail") {
            if (value.length === 0) {
                newError = "Email Is Required";
            } else if (!emailRegex.test(value)) {
                newError = "Invalid Email Format (e.g., realEmail@domain.com)";
            }
        } else if (name === "userPassword") {
            if (value.length === 0) {
                newError = "Password Is Required";
            } else if (!passwordRegex.test(value)) {
                newError = "Password Must Have at least one (UpperCase, LowerCase, Special Character, & Number) with a Minimum Length of 6 Characters";
            }
        } else if (name === "userConfirmPassword") {
            if (value.length === 0) {
                newError = "Confirm Password Is Required";
            } else if (value !== RegisterUser.userPassword) {
                newError = "Confirm Password Must Match Password";
            }
        }

        setError(prevError => ({
            ...prevError,
            [`${name}Error`]: newError
        }));
        
        SetRegisterUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    
    const isFormValid = Object.values(error).every(err => err === null) &&
                        Object.values(RegisterUser).every(val => val.length > 0);

    
    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        const termsChecked = e.target.elements.termsCheck.checked;

        if (!isFormValid || !termsChecked || isLoading) {
            Swal.fire({
                icon: "warning",
                title: "Please complete the form correctly and agree to terms.",
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }


        const submissionData = {
            userFirstName: RegisterUser.userFirstName,
            userLastName: RegisterUser.userLastName,
            userEmail: RegisterUser.userEmail,
            userPassword: RegisterUser.userPassword 
        };

        axiosinstance.post('api/Auth/Register', submissionData)
        .then(function (response) {

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Account Created Successfully! Please log in.",
                showConfirmButton: false,
                timer: 2000
            });
            navigator("/auth/login", { replace: true });
        })
        .catch(function (error) {
            
            let alertTitle = "An unexpected registration error occurred. Please try again.";
            const responseErrors = error.response?.data?.errors;

            if (Array.isArray(responseErrors) && responseErrors.length > 0) {
                alertTitle = responseErrors.join(". "); 
            } else if (error.message && error.message !== "Network Error") {
                alertTitle = `Registration failed: ${error.message}`;
            }

            Swal.fire({
                position: "top-end",
                icon: "error",
                title: alertTitle,
                showConfirmButton: false,
                timer: 3500 
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

                            <form onSubmit={handleRegisterSubmit}>
                                
                                <fieldset disabled={isLoading}>
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
                                            value={RegisterUser.userFirstName}
                                            onChange={UserInputChanges}
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
                                            value={RegisterUser.userLastName}
                                            onChange={UserInputChanges}
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
                                        value={RegisterUser.userEmail}
                                        onChange={UserInputChanges}
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
                                        value={RegisterUser.userPassword}
                                        onChange={UserInputChanges}
                                        required
                                        minLength={6}
                                        placeholder="Create a strong password"
                                    />
                                    <div className="form-text text-muted small mt-2">
                                        Must contain uppercase, lowercase, number, and special character (min 6 chars).
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
                                        value={RegisterUser.userConfirmPassword}
                                        onChange={UserInputChanges}
                                        required
                                        minLength={6}
                                        disabled={!RegisterUser.userPassword || !!error.userPasswordError} 
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
                                            I agree to the <a href="/terms" className="text-primary fw-semibold">terms and conditions</a>
                                        </label>
                                        <div className="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>
                                </fieldset>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm"
                                    disabled={!isFormValid || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Registering...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
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