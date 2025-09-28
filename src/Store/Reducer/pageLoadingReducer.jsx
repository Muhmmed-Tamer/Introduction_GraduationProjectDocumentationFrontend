const initialState = {
    isLoading: false
};

export function pageLoadingReducer(state=initialState,action){
    switch(action.type){
        case "PAGE_IS_LOADING":
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
}
