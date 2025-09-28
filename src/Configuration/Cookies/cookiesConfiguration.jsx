import Cookies from "universal-cookie";
export const userCookies = new Cookies();

export const clearAuthCookies = () => {
    userCookies.remove('token',{ 
            path: '/', 
            secure: true, 
            sameSite: 'none' 
        });
    userCookies.remove('refreshToken',{
            path: '/', 
            secure: true, 
            sameSite: 'none' 
        }
    );
};

export const setAuthCookies = (token, refreshToken, expiration) => {
    userCookies.set('token', token, { 
        path: '/',
        expires: new Date(expiration),
        secure: true,
        sameSite: 'none'
    });
    userCookies.set('refreshToken', refreshToken, { 
        path: '/',
        expires: new Date(expiration),
        secure: true,
        sameSite: 'none'
    });
};

export const getCookie = (cookieName)=>{
    const cookieThatWantToGet = userCookies.get(cookieName,{ 
        path: '/', 
        secure: true, 
        sameSite: 'none' 
    });
    return cookieThatWantToGet?cookieThatWantToGet:"";
}