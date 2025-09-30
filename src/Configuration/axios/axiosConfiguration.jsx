import axios from 'axios';
import { store } from '../../Store/Store';
import { PageIsLoading } from '../../Store/Actions/pageIsLoading';

export const axiosinstance = axios.create({
    baseURL: 'https://introductiongraduationprojectapi.runasp.net/',
    withCredentials: true
});

axiosinstance.interceptors.request.use(function (config) {
    store.dispatch(PageIsLoading(true));
    return config;
}, function (error) {
    store.dispatch(PageIsLoading(false));
    return Promise.reject(error);
});

axiosinstance.interceptors.response.use(function (response) {
    store.dispatch(PageIsLoading(false));
    return response;
}, function (error) {
    store.dispatch(PageIsLoading(false));
    return Promise.reject(error);
});