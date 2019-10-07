import { Api } from './api.js';
import { goodsItem } from './goodsItem';
import { User } from './user';
import style from '../main.css';

/*
    Класс Admin - наследует функционал User
*/
class Admin extends User {
  static apiAdmin = new Api();
  // modals
  modalCreateElement = document.querySelector('.modal-create');
  modalEditElement = document.querySelector('.modal-edit');
  modalOverlay = document.querySelector('.modal-overlay');
  //forms
  createFormElement = $('.create-form');
  editFormElement = $('.edit-form');

  // property: поле для отображения ошибок в формах, Getter/Setter modalNotice property
  _modalNotice = '';
  get modalNotice() {
    return this._modalNotice;
  }
  set modalNotice(newValue) {
    if (newValue === '') $('p.form-notice').addClass('visually-hidden');
    else $('p.form-notice').removeClass('visually-hidden');
    $('p.form-notice').html(newValue);
    this._modalNotice = newValue;
  }
  constructor() {
    super();
    // Users Event . Вешаем кастомный обработчик на загрузку данных с API
    $('ul.goods-list').on('dataLoads', () => this.renderList());

    this.createFormElement.on('submit', evt => this.submitCreateForm(evt));
    this.editFormElement.on('submit', evt => this.submitEditForm(evt));
    $('form.goods-filter input:radio').on('change', this.applyAvialableFilter);
    //Bind  Buttons
    $('button#create-item').on('click', evt => this.clickCreateItem(evt));
  }
  /* 
  Override Method for Admin
  */
  /*
  отрисовка одного элемента товаров.
  на входе структура типа<goodsItem> на выходе html
  input Type<goodsItem> : item
  */
  renderItem(item) {
    let out = '';
    out += '<li class="goods-item-container">';
    out += '<article class="goods-item">';
    out += '<div class="columns columns-id">' + item.id + '</div>';
    out += '<div class="columns columns-name">' + item.name + '</div>';
    out += '<div class="columns columns-description">' + item.description + '</div>';
    out += '<div class="columns columns-cost">' + item.cost + '</div>';
    out += '<div class="columns colomns-checkbox">';
    out +=
      item.available == true || item.available == 'true'
        ? '<input class="visually-hidden" id="cb' + item.id + '" type="checkbox" checked disabled /><label for="cb' + item.id + '"></label>'
        : '<input class="visually-hidden" id="cb' + item.id + '" type="checkbox" disabled /><label for="cb' + item.id + '"></label>';
    out += '</div>';
    out += '<div class="columns columns-img">';
    out += '<a href="#"><img class="goods_miniature" src="' + item.img + '" alt="' + item.description + '"></a>';
    out += '</div>';
    out += '<div class="button-columns">';
    out += '<button id="edit-item" data-article="' + item.id + '">Edit</button>';
    out +=
      item.forsale == true || item.forsale == 'true'
        ? '<button id="remove-item" data-article="' + item.id + '">Remove</button>'
        : '<button id="add-item" data-article="' + item.id + '">Add</button>';
    out += '<button id="delete-item" data-article="' + item.id + '">Delete</button>';
    out += '</div>';
    out += '</article>';
    out += '</li>';
    return out;
  }
  /*
  отрисовка списка товаров.
  */
  renderList() {
    let out = '';
    this.waitloading = false;
    this.goodsData.map(item => (out += this.renderItem(new goodsItem(item))));
    this.goodsListElement.html(out);
    // обработчки на админские кнопки.
    $('button#edit-item').on('click', evt => this.clickEditItem(evt));
    $('button#add-item').on('click', evt => this.clickAddItem(evt));
    $('button#remove-item').on('click', evt => this.clickRemoveItem(evt));
    $('button#delete-item').on('click', evt => this.clickDeleteItem(evt));
  }
  /*  Модалка создания нового товара.
      Для админа открывает модалку с формой создания нового товара.
  */
  clickCreateItem(event) {
    event.preventDefault();
    this.modalCreateElement.classList.add('modal-show');
    document.querySelector('.modal-overlay').classList.remove('visually-hidden');
    $('form.create-form')[0].reset();
    this.modalNotice = '';
  }
  /* Модалка изменение товара.
     получаем id товара на который кликнули,
     с api дергаем данные этого товара, ложим в editedItem и генерируем форму.
  */
  clickEditItem(event) {
    event.preventDefault();
    let articule = $(event.target).attr('data-article'); // Артикул id товара
    if (articule <= 0) return;
    // По умолчанию проставляем существующие данные.
    this.getAdminGoodsbyId(articule);
  }
  /*
    Админ сабмитит созданый товар. валидация цены на int или float
    onSuccess  закрывает модалку.
  */
  submitCreateForm(event) {
    event.preventDefault();
    let submitCreateData = {};
    if (this.createFormElement.find('input[name="name"]').val() !== '') submitCreateData['name'] = this.createFormElement.find('input[name="name"]').val();
    if (this.createFormElement.find('input[name="description"]').val() !== '') submitCreateData['description'] = this.createFormElement.find('input[name="description"]').val();
    if (this.createFormElement.find('input[name="cost"]').val() !== '') {
      submitCreateData['cost'] = this.createFormElement.find('input[name="cost"]').val();
      // Check cost int || float
      var rx = new RegExp(/^\d+(?:\.\d{1,2})?$/);
      this.modalNotice = rx.test(submitCreateData['cost']) ? '' : 'Input Float';
    }
    submitCreateData['available'] = this.createFormElement.find('input[name="available"]').is(':checked');
    if (this.modalNotice !== '') return;
    this.sendAdminCreateGoods(submitCreateData);
  }
  /*
     метод отправляем измененую Админом форму на api
  */
  submitEditForm(event) {
    event.preventDefault();
    let d = {};
    // Тут йобнутый автоформатер раскидывает если делать $(editForm).find().val
    if ($('input.edit-input-text[name="id"]').val() !== '') d['id'] = $('input.edit-input-text[name="id"]').val();
    if ($('input.edit-input-text[name="name"]').val() !== '') d['name'] = $('input.edit-input-text[name="name"]').val();
    if ($('input.edit-input-text[name="description"]').val() !== '') d['description'] = $('input.edit-input-text[name="description"]').val();
    if ($('input.edit-input-text[name="cost"]').val() !== '') d['cost'] = $('input.edit-input-text[name="cost"]').val();
    d['img'] = $('img#edit-img').attr('src');
    d['available'] = $('input#edit-avialable[name="available"]').is(':checked');
    // Check cost int || float
    var rx = new RegExp(/^\d+(?:\.\d{1,2})?$/);
    this.modalNotice = rx.test(Number(d['cost'])) ? '' : 'Input Float';
    if (this.modalNotice !== '') return;
    this.sendEditForm(d);
  }
  /*
    Админ добавляет товар в продажу, после этого доступен на странице клиента.
    по Api у товара обновляем флаг forsale = true  , есть в продаже
  */
  clickAddItem(event) {
    event.preventDefault();
    let buttonEvent = event.target;
    let idItem = $(buttonEvent).attr('data-article'); // артикул id
    if (idItem <= 0) return;
    this.sendAddItem(idItem);
  }
  /*
    Админ убирает товар из продажи, товар остаетя у админа но недосутпен для покупки клиентом.
    по Api у товара обновляем флаг forsale = false  ,нет в продаже
  */
  clickRemoveItem() {
    event.preventDefault();
    let buttonEvent = event.target;
    let idItem = $(buttonEvent).attr('data-article'); // артикул id
    if (idItem <= 0) return;
    this.sendRemoveItem(idItem);
  }
  /*
    Админ удаляет товар, 
  */
  clickDeleteItem() {
    event.preventDefault();
    let buttonEvent = event.target;
    let idItem = $(buttonEvent).attr('data-article'); // артикул id
    if (idItem <= 0) return;
    this.sendDeleteItem(idItem);
  }
  /*  ------------ Admin wrapper APi method ------------- */
  /*  
     Получения информации по id товара.
  */
  getAdminGoodsbyId(id) {
    let editedItem = {};
    Admin.apiAdmin
      .requestAdminGoodsbyId(id)
      .then(data => {
        editedItem = data;
        this.modalEditElement.classList.add('modal-show');
        document.querySelector('.modal-overlay').classList.remove('visually-hidden');
      })
      .catch(function(reason) {
        console.log(reason);
      })
      .finally(function() {
        // полученными данными заполняем input, img , checkbox
        for (let dataEntity in editedItem) $('input.edit-input-text[name="' + dataEntity + '"]').val(editedItem[dataEntity]);

        if (editedItem['available'] === 'true') $('input#edit-avialable[name="available"]:checkbox').prop('checked', true);
        else $('input#edit-avialable[name="available"]:checkbox').prop('checked', false);
        $('img#edit-img').attr('src', editedItem['img']);
      });
  }
  /*
    отправка на создания новго товара.
  */
  sendAdminCreateGoods(data) {
    Admin.apiAdmin
      .requestAdminCreateGoods(data)
      .then(result => {
        if (result['id'] > 0) {
          this.modalCreateElement.classList.remove('modal-show');
          this.modalOverlay.classList.add('visually-hidden');
          this.getGoodsList();
        }
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }
  /*
  изменение товара.
  */
  sendEditForm(data) {
    Admin.apiUser
      .requestAdminEditGoods(data)
      .then(() => {
        this.getGoodsList();
        this.closeAllModale();
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }
  /*
  Добаввления товара в продажу,
  */
  sendAddItem(idItem) {
    Admin.apiUser
      .requestAdminAddGoods(idItem)
      .then(() => {
        // onSuccess -  меняем кнопку Add на Remove без дергания api
        $('button#add-item[data-article="' + idItem + '"]').replaceWith('<button id="remove-item" data-article="' + idItem + '">Remove</button>');
        $('button#add-item').on('click', evt => this.clickAddItem(evt));
        $('button#remove-item').on('click', evt => this.clickRemoveItem(evt));
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }
  /*
  Убирание товара из продажи.
  */
  sendRemoveItem(idItem) {
    Admin.apiUser
      .requestAdminRemoveGoods(idItem)
      .then(() => {
        // onSuccess -  меняем кнопку remove на Add без дергания api
        $('button#remove-item[data-article="' + idItem + '"]').replaceWith('<button id="add-item" data-article="' + idItem + '">Add</button>');
        $('button#add-item').on('click', evt => this.clickAddItem(evt));
        $('button#remove-item').on('click', evt => this.clickRemoveItem(evt));
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }
  /*
  физическое удаление товара.
  */
  sendDeleteItem(idItem) {
    Admin.apiUser
      .requestAdminDeleteGoods(idItem)
      .then(() => {
        this.getGoodsList();
      })
      .catch(function(reason) {
        console.log(reason);
      });
  }

  /*-------------- End api Method ------------*/

  /* Фильтр Показать все/ Показать то что в наличии 
      способом jQuery смотрим куда нажат checkbox в фильтре, и просто в списке делаем show() или hide() у кого есть флажок наличия.
  */

  applyAvialableFilter() {
    let filterValue = $('input[name=avialble-type]:checked', 'form.goods-filter').val();
    if (filterValue === 'avialable-only') {
      $('article.goods-item')
        .find('input:checkbox:not(:checked)')
        .closest('article')
        .hide();
    } else if (filterValue === 'avialable-all') {
      $('article.goods-item')
        .find('input:checkbox:not(:checked)')
        .closest('article')
        .show();
    }
  }
}

/*
TODO : если надо сортировка по колонкам таблицы делается в api goods?sortBy=cost&order=asc
*/
// End Admin region
export { Admin };
