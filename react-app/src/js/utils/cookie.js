/* eslint-disable*/

export default {
  /**
   * 获取cookie
   * @param {String} name
   * @returns {String}
   */
  get(name){
    let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  /**
   * 设置cookie
   * @param {string} name
   * @param {string} value
   * @param {number} time
   */
  set(name, value, time){
    let cookie;
    if (time) {
      let date = new Date();
      date.setTime(date.getTime() + Number(time));
      cookie = name + '=' + escape(value) + '; expires=' + date.toUTCString();
    } else {
      cookie = name + '=' + escape(value) + ';';
    }

    document.cookie = cookie;
  },
  /**
   * 清除cookie
   * @param name
   */
  remove(name){
    this.set(name, '', -1);
  }
}