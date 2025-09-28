import { Navbar, Nav, Container } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../../Store/Store';
import { userIsLogin } from '../../Store/Actions/userIsLogin';
import { clearAuthCookies, getCookie } from '../../Configuration/Cookies/cookiesConfiguration';
import parseJwt from '../../Configuration/Token/decodeToken';
const Header = ()=>{
    var userDetails;
    const state = useSelector((state)=>state)
    if(state.UserIsLogin.isLogin){
        userDetails = parseJwt(getCookie('token'));
    }

    const navigator = useNavigate();
    
    const logoutActions=()=>{
        clearAuthCookies();
        store.dispatch(userIsLogin(false));
    }

    const logoutFromApp = ()=>{
        Swal.fire({
            title: "Are you sure Logout?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!"
            }).then((result) => {
            if (result.isConfirmed) {
                logoutActions();
                Swal.fire({
                title: "Logged out!",
                text: "You have been Logout.",
                icon: "success"
                });
                navigator("/auth/login")
                }
});
    }

    const selector = useSelector((state)=>state);
    return(
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand>Graduation Project</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="me-auto mb-2 mb-lg-0">
                        <Nav.Link as={Link} to="/home" className="active" aria-current="page">
                            Home
                        </Nav.Link>
                    </Nav>
                    <Nav className="d-flex">
                        {
                        selector.UserIsLogin.isLogin ===true? 
                            <>
                                <Nav.Link as={Link} to="/user/details" className="m-2">
                                    {userDetails['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}
                                </Nav.Link>
                                <Nav.Link as={Link} to="/auth/logout" className="m-2" onClick={()=>{logoutFromApp()}}>
                                    LogOut
                                </Nav.Link>
                            </>
                            :
                        <>
                            <Nav.Link as={Link} to="/auth/register" className="m-2">
                                Register
                            </Nav.Link>
                            <Nav.Link as={Link} to="/auth/login" className="m-2">
                                Login
                            </Nav.Link>
                        </>
                        } 
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    );
};
export default Header;