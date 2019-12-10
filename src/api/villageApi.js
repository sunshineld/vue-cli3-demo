import { base } from './baseUrl'
import axios from "axios";

// 村情简介
// 获取
export const getAreaInfo = params => { return axios.get("/api/village/areas/brief", { params: params }); };

// 任务管理

// 任务列表
export const getSystemTaskRecords = params => { return axios.get(`/api/village/systemTaskRecords/mine`, { params: params }); };
// 上报信息列表
export const getInformationReports = params => { return axios.get(`/api/village/informationReports/mine`, { params: params }); };