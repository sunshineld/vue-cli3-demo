import { base } from './baseUrl'
import axios from "axios";

// 登录
export const userLogin = params => { return axios.get("/api/user/login", { params: params }); };
// export const userLogin = params => { return axios.post(`${base}/users/login`, params); };

// 退出登录
export const userLoginout = params => { return axios.get("/api/user/loginOut", { params: params }); };
// export const userLoginout = params => { return axios.delete(`${base}/users/login`, { params: params }); };

//搜索菜单
export const getMyMenuLeaves = params => { return axios.get(`${base}/menus/myMenuLeaves`, { params: params }); };
//获取下拉项
export const getOptions = params => { return axios.get(`${base}/types/common`, { params: params }); };
//上传base64图片
export const uploadBase64 = params => { return axios.post(`${base}/uploadWxHead`, params); };
//验证码
export const getCationCode = params => { return axios.get(`${base}/captcha`, { params: params }); };
//修改密码
export const putPwd = params => { return axios.put(`${base}/users/password`, params); };

// 左侧菜单
export const getUserMenu = params => { return axios.get("/api/user/menu", { params: params }); };
// export const getUserMenu = params => { return axios.get(`${base}/users/menu`, { params: params }); };


// 日志列表
export const getSysLogs = params => { return axios.get("/api/sysLogs", { params: params }); };

// 管理员用户管理
export const getUserList = params => { return axios.get("/api/users", { params: params }); };

// 角色管理
export const getRoleList = params => { return axios.get("/api/roles", { params: params }); };

// 获取角色菜单 
export const getRoleMenu = params => { return axios.get("/api/roles/menus", { params: params }); };

// 菜单 新增
export const postMenu = params => { return axios.post("/api/menus", params ); };
// 菜单 列表
export const getMenu = params => { return axios.get("/api/menus", { params: params } ); };


// 行政区划管理
export const getAreasTree = params => { return axios.get("/api/areaMag", { params: params } ); };

// 党组织管理
export const getPartyOrgsTree = params => { return axios.get("/api/partyOrgMag", { params: params } ); };

// 数据字典管理
export const getTypeGroupList = params => { return axios.get("/api/typeGroups", { params: params }); };
