import style from './main.css';

import { isAdmin, closeAllModale } from './js/common.js';
import { Admin } from './js/admin.js';
import { Client } from './js/client.js';

$('document').ready(function() {
  if (isAdmin()) {
    let admin = new Admin();
  } else {
    let client = new Client();
  }
  // по Esc закрываем модалки, доступность без мышки
  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 27) closeAllModale(evt);
  });
});

/* обертка на api методы.*/
jQuery.each(['put', 'delete'], function(i, method) {
  jQuery[method] = function(url, data, callback, type) {
    if (jQuery.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    }
    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback,
    });
  };
});
