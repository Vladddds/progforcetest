import { APIURL } from './common';

/*
    Класс для работы с Api
*/
class Api {
  constructor() {}
  /*
  Return Promise
*/
  requestUserGoods() {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL,
        method: 'get',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
  Return Promise
*/
  requestAdminCreateGoods(data) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL,
        data: data,
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
  Return Promise
*/
  requestAdminGoodsbyId(id) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL + id,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
  Return Promise
*/
  requestAdminEditGoods(data) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL + data['id'],
        data: data,
        method: 'PUT',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
Return Promise
*/
  requestAdminAddGoods(id) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL + id,
        data: { forsale: 'true' },
        method: 'PUT',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
Return Promise
*/
  requestAdminRemoveGoods(id) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL + id,
        data: { forsale: 'false' },
        method: 'PUT',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
  /*
Return Promise
*/
  requestAdminDeleteGoods(id) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: APIURL + id,
        method: 'DELETE',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(xhr) {
          reject(xhr);
        },
      });
    });
  }
}
export { Api };
