import axios from "axios";
export const base = '';

// 登录
// export const userLogin = params => { return axios.get("https://easy-mock.com/mock/5d7f309d26434a41a65fff91/example/user/login", { params: params }); };
export const userLogin = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/users/login", { params: params }); };

// 退出登录
export const userLoginout = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/users/loginOut", { params: params }); };

// 左侧菜单
// export const getUserMenu = params => { return axios.get("https://easy-mock.com/mock/5d7f309d26434a41a65fff91/example/users/menu", { params: params }); };
export const getUserMenu = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/user/menu", { params: params }); };

// 日志列表
export const getSysLogs = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/sysLogs", { params: params }); };

// 管理员用户管理
export const getUserList = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/users", { params: params }); };

// 角色管理
export const getRoleList = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/roles", { params: params }); };

// 获取角色菜单 
export const getRoleMenu = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/roles/menus", { params: params }); };

// 菜单 新增
export const postMenu = params => { return axios.post("/api/menus", params ); };
// 菜单 列表
export const getMenu = params => { return axios.get("/api/menus", { params: params } ); };

// 数据字典管理

export const getTypeGroupList = params => { return axios.get("http://yapi.demo.qunar.com/mock/96920/typeGroups", { params: params }); };
