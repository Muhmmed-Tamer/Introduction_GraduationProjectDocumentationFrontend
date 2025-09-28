import { useEffect, useState } from "react";
import parseJwt from "../../Configuration/Token/decodeToken";
import { getCookie } from "../../Configuration/Cookies/cookiesConfiguration";

const UserDetails = ()=>{
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            const decoded = parseJwt(token);
            setUserDetails(decoded);
        }
    }, []);

    if (!userDetails) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading user details...</p>
            </div>
        );
    }

    return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <div className="card shadow-lg border-0">
                    <div className="card-header bg-primary text-white py-4">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                                    style={{width: '60px', height: '60px'}}>
                                    <i className="fas fa-user text-primary fs-4"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h2 className="card-title mb-1">User Profile</h2>
                                <p className="card-text opacity-75 mb-0">Personal Information</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-body p-4">
                        <div className="row g-3">

                            <div className="col-12">
                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-user-circle text-primary fs-5 me-3"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <label className="form-label text-muted small mb-1">Full Name</label>
                                        <p className="mb-0 fw-semibold fs-6 text-dark">
                                            {userDetails['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-envelope text-primary fs-5 me-3"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <label className="form-label text-muted small mb-1">Email Address</label>
                                        <p className="mb-0 fw-semibold fs-6 text-dark">
                                            {userDetails['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-id-card text-primary fs-5 me-3"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <label className="form-label text-muted small mb-1">User ID</label>
                                        <p className="mb-0 fw-semibold fs-6 text-dark font-monospace small">
                                            {userDetails['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};
export default UserDetails;