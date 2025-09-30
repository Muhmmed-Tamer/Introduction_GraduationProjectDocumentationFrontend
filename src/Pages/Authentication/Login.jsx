import { useState } from "react";
import Swal from 'sweetalert2';
import { axiosinstance } from "../../Configuration/axios/axiosConfiguration";
import { store } from "../../Store/Store";
import { userIsLogin } from "../../Store/Actions/userIsLogin";
import { useSelector } from "react-redux";
import { setAuthCookies } from "../../Configuration/Cookies/cookiesConfiguration";
import { useNavigate } from "react-router";


const Login = () => {
    const navigator = useNavigate();
    const selector = useSelector((state) => state);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    
    const isLoading = selector.PageIsLoading?.isLoading ?? false;

    const [LoginUser, SetLoginUser] = useState({
        email: "",
        password: ""
    });
    
    
    const [error, SetError] = useState({
        emailError: "Email is required", 
        passwordError: "Password is required"
    });

    
    const isFormValid = !error.emailError && !error.passwordError && LoginUser.email && LoginUser.password;

    
    const UserInputChanges = (event) => {
        const { name, value } = event.target;
        let newError = null;

        if (name === "email") {
            if (value.length === 0) {
                newError = "Email is required";
            } else if (!emailRegex.test(value)) {
                newError = "Invalid email address";
            }
        } else if (name === "password") {
            if (value.length === 0) {
                newError = "Password is required";
            } else if (value.length < 6) {
                newError = "Password must be at least 6 characters";
            }
        }
        
        SetError(prevError => ({ 
            ...prevError, 
            [`${name}Error`]: newError 
        }));

        SetLoginUser(prevLoginUser => ({
            ...prevLoginUser,
            [name]: value 
        }));
    };
    
    /**
     */
    const handleLoginSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid || isLoading) {
            Swal.fire({
                icon: "warning",
                title: "Please correct the form errors.",
                showConfirmButton: false,
                timer: 1500
            });
            return; 
        }

        
        axiosinstance.post('api/Auth/Login', LoginUser)
        .then(function (response) {
            setAuthCookies(response.data.data.accessToken, response.data.data.refreshToken, response.data.data.expiration);
            
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500
            });
            
            store.dispatch(userIsLogin(true));
            navigator("/home", {replace: true});
        })
        .catch(function (error) {
            
            let alertTitle = "An unexpected error occurred. Please try again.";
            const responseErrors = error.response?.data?.errors;

            if (Array.isArray(responseErrors) && responseErrors.length > 0) {
                alertTitle = responseErrors.join(". "); 
            } else if (error.message && error.message !== "Network Error") {
                alertTitle = `Login failed: ${error.message}`;
            }

            Swal.fire({
                position: "top-end",
                icon: "error",
                title: alertTitle,
                showConfirmButton: false,
                timer: 3000 
            });
        });
    }

    return (
        <div className="container-fluid vh-100 bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="row justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title fw-bold text-primary mb-2">Login Page</h2>
                                <p className="text-muted mb-0">Login to your account</p>
                            </div>

                            <form onSubmit={handleLoginSubmit}>
                                
                                <div className="mb-4">
                                    <label htmlFor="emailInput" className="form-label fw-semibold text-dark">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        className={`form-control form-control-lg ${error.emailError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="emailInput" 
                                        aria-describedby="emailHelp" 
                                        name="email" 
                                        value={LoginUser.email}
                                        onChange={UserInputChanges} 
                                        required 
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                    <div id="emailHelp" className="form-text text-muted small mt-2">
                                        We'll never share your email with anyone else.
                                    </div>
                                    {error.emailError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.emailError}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="passwordInput" className="form-label fw-semibold text-dark">
                                        Password
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${error.passwordError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="passwordInput" 
                                        name="password" 
                                        value={LoginUser.password}
                                        onChange={UserInputChanges} 
                                        required 
                                        minLength={6}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    {error.passwordError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" disabled={isLoading} />
                                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    {/* Added Forgot Password Link for better UX */}
                                    <a href="/auth/forgot-password" className="text-decoration-none small text-primary fw-semibold">
                                        Forgot password?
                                    </a>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm"
                                    disabled={!isFormValid || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Logging In...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Don't have an account?{" "}
                                    <a href="/auth/register" className="text-decoration-none fw-bold text-primary">
                                        Sign up here
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

export default Login;