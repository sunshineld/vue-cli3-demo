import { base } from './baseUrl'
import axios from "axios";

// 村情简介
// 获取
export const getAreaInfo = params => { return axios.get("/api/village/areas/brief", { params: params }); };