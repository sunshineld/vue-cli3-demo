"use strict";

import Vue from 'vue';
import axios from "axios";
import {Loading, Message} from 'element-ui';
const md5 = require('js-md5');

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control,
};
function parseParam(obj){
  let url="";
  let kvArr = Object.entries(obj);
  kvArr.forEach(v=>{
  if(Object.prototype.toString.call(v[1]) =='[object Object]')
    {
      arguments.callee(v[1]);
    }else{
            url += v.join('=')+'&'
    }
  })
  return url.substring(0,url.length-1);
}

const _axios = axios.create(config);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (localStorage.voucher) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.voucher = `${localStorage.voucher}`;
    }
    config.headers.source = '5';//管理端渠道标识
    let unsign = "";
    if(config.method=='get'){
        unsign = ((typeof(config.params) == "undefined"||config.params == null)?"em":parseParam(config.params))
    }else{
        unsign = JSON.stringify(config.data);
    }
    config.headers.sign=md5.hex(unsign+'godisafatgirl');
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
