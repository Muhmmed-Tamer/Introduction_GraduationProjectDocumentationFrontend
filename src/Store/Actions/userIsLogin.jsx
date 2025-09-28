export function userIsLogin(data){
    return({
        type: "USER_IS_LOGIN",
        payload: data
    });
}