
const initialState = {
    isLogin: false
};

export function userIsLoginReducer(state=initialState,action){
    switch(action.type){
        case "USER_IS_LOGIN":
            return{...state, isLogin: action.payload};
        default:
            return state;
    }
}