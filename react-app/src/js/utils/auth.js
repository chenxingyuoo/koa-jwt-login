/* eslint-disable*/

import cookies from './cookie'

export const TOKEN_KEY = 'token'

export function getToken() {
  return cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  return cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return cookies.remove(TOKEN_KEY)
}
