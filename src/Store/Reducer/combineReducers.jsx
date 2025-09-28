import { combineReducers } from "redux";
import { userIsLoginReducer } from "./userLoginReducer";
import { pageLoadingReducer } from "./pageLoadingReducer";

export const combineReducer =  combineReducers({
    UserIsLogin: userIsLoginReducer,
    PageIsLoading: pageLoadingReducer
});