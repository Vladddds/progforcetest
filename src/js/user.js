import { Api } from './api';
/*
Абстрактный класс пользователя, 
содержит вируальные методы обшие для админа клиента.
*/

class User {
  static apiUser = new Api();

  goodsListElement = $('ul.goods-list');

  _waitloadingElement = $('section#wait-loading');
  // property :_waitloading - флаг часики с загрузкой
  _waitloading = true;
  get waitloading() {
    return this._waitloadingElement.hasClass('visually-hidden');
  }
  set waitloading(newValue) {
    if (newValue) this._waitloadingElement.removeClass('visually-hidden');
    else this._waitloadingElement.addClass('visually-hidden');
    this._waitloading = newValue;
  }
  // property :_goodsData - массив с товарами.
  _goodsData = null;
  get goodsData() {
    return this._goodsData;
  }
  set goodsData(newValue) {
    this._goodsData = newValue;
  }

  constructor() {
    // стандартные для всех пользователей обработчики.
    $('button.modal-close').on('click', evt => this.closeAllModale(evt));
    this.getGoodsList();
  }
  /*
    Common Methods Load and create Event then complite
*/
  getGoodsList() {
    return User.apiUser
      .requestUserGoods()
      .then(data => {
        this._goodsData = data;

        $('ul.goods-list').trigger('dataLoads');
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }
  /* Закрываем модальные окна. */
  closeAllModale() {
    document.querySelector('.modal-create').classList.remove('modal-show');
    document.querySelector('.modal-edit').classList.remove('modal-show');
    document.querySelector('.modal-overlay').classList.add('visually-hidden');
  }
}
export { User };
