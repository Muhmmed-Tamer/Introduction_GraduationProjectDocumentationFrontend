import { useState } from "react";
import Swal from 'sweetalert2'
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

    console.log('Redux Store:', selector);
    console.log('PageIsLoading state:', selector.PageIsLoading);

    const [LoginUser, SetLoginUser] = useState({
        email: "",
        password: ""
    });
    const [error, SetError] = useState({
        emailError: null,
        passwordError: null
    });

    const UserInputChanges = (event) => {
        var targetInput = event.target;
        switch (targetInput.name) {
            case "email":
                if (targetInput.value.length === 0) {
                    SetError({ ...error, emailError: "Email is required" });
                }
                else if (!emailRegex.test(targetInput.value)) {
                    SetError({ ...error, emailError: "Invalid email address" });
                }
                else {
                    SetError({ ...error, emailError: null });
                    SetLoginUser({ ...LoginUser, email: targetInput.value });
                }
                break;
            case "password":
                if (targetInput.value.length === 0) {
                    SetError({ ...error, passwordError: "Password is required" });
                }
                else if (targetInput.value.length < 6) {
                    SetError({ ...error, passwordError: "Password must be at least 6 characters" });
                }
                else {
                    SetError({ ...error, passwordError: null });
                    SetLoginUser({ ...LoginUser, password: targetInput.value });
                }
                break;
            default:
                break;
        }
    }
    

    const handleLoginSubmit = (e)=>{
        e.preventDefault();

        axiosinstance.post('api/Auth/Login', {
            email: LoginUser.email,
            password: LoginUser.password
        })
        .then(function (response) {
            setAuthCookies(response.data.data.accessToken,response.data.data.refreshToken,response.data.data.expiration);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500
            });
        store.dispatch(userIsLogin(true));
        navigator("/home",{replace:true});
        })
        .catch(function (error) {
        var responseErrors = [""];
        responseErrors = error.response?.data.errors;
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
        <div className="container-fluid vh-100 bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="row justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title fw-bold text-primary mb-2">Login Page</h2>
                                <p className="text-muted mb-0">Login to your account</p>
                            </div>

                            <form method="post" onSubmit={(e)=>{
                                handleLoginSubmit(e);
                            }}>
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
                                
                                <div className="mb-4">
                                    <label htmlFor="exampleInputEmail1" className="form-label fw-semibold text-dark">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        className={`form-control form-control-lg ${error.emailError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="exampleInputEmail1" 
                                        aria-describedby="emailHelp" 
                                        name="email" 
                                        onChange={(e) => { UserInputChanges(e) }} 
                                        required 
                                        placeholder="Enter your email"
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
                                    <label htmlFor="exampleInputPassword1" className="form-label fw-semibold text-dark">
                                        Password
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`form-control form-control-lg ${error.passwordError ? 'is-invalid border-danger' : 'border-2'}`}
                                        id="exampleInputPassword1" 
                                        name="password" 
                                        onChange={(e) => { UserInputChanges(e) }} 
                                        required 
                                        minLength={6}
                                        placeholder="Enter your password"
                                    />
                                    {error.passwordError && (
                                        <div className="invalid-feedback d-block fw-semibold">
                                            {error.passwordError}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm"
                                    disabled={error.emailError || error.passwordError || !LoginUser.email || !LoginUser.password}
                                >
                                    Login
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