

import request from '../js/utils/request';

export const login = (data = {}) => {
  return request.post({
    url: '/user/login',
    data: data
  })
}

export const registered = (data = {}) => {
  return request.post({
    url: '/user/register',
    data: data
  })
}

export const saveUser = (data = {}) => {
  return request.post({
    url: '/user/save',
    data: data
  })
}

export const updateUser = (data = {}) => {
  return request.post({
    url: '/user/update/' + data.id,
    data: {}
  })
}

export const fetchUserInfo = (data = {}) => {
  return request.get({
    url: '/user/info',
    data: data
  })
}

export const fetchUserList = (data = {}) => {
  return request.get({
    url: '/user/list',
    data: data
  })
}

export const deleteOneUser = (data = {}) => {
  return request.post({
    url: '/user/delete',
    data: data
  })
}