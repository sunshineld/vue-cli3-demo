import axios from "axios";
export const base = 'http://localhost:8080';

// 登录
// export const userLogin = params => { return axios.get("https://easy-mock.com/mock/5d7f309d26434a41a65fff91/example/user/login", { params: params }); };

export const userLogin = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/users/login", { params: params }); };


// 菜单
// export const getUserMenu = params => { return axios.get("https://easy-mock.com/mock/5d7f309d26434a41a65fff91/example/users/menu", { params: params }); };
export const getUserMenu = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/user/menu", { params: params }); };