import { Api } from './api.js';
import { goodsItem } from './goodsItem';
import { User } from './user';
import style from '../main.css';
/*Класс описывающий функицонал клиента, наследует функционал user*/
class Client extends User {
  static apiClient = new Api();
  /* Корзина в в виде  {id , count}
   */
  cart = {};

  constructor() {
    super();
    // Если есть корзина в Localstorage то пользуем ее.
    this.checkCart();

    $('ul.goods-list').on('dataLoads', () => this.renderList());
    $('button#show-cart').on('click', () => this.clickShowCart());
    $('button#show-goods').on('click', () => this.clickShowGoods());
    $('button#clear-cart').on('click', () => this.clickClearCart());
  }
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
    if (this.cart[item.id] > 0) out += '<h2 id="quantity-buy" class="quantity-item">' + this.cart[item.id] + '</h2>';
    else out += '<h2 id="quantity-buy" class="quantity-item"> 0 </h2>';
    if (item.available == true || item.available == 'true') out += '<button id="buy-item" data-article="' + item.id + '">Buy +1</button>';
    else out += '<button id="wait-item" data-article="' + item.id + '">Wait List</button>';
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
    this.goodsData.map(item => {
      if (item.forsale) out += this.renderItem(new goodsItem(item));
    });
    this.goodsListElement.html(out);
    $('button#buy-item').on('click', evt => this.clickBuyItem(evt));
  }
  /*
отрисовка корзины
*/
  renderCart() {
    let out = '';
    let foundObj = {};
    //  сообщаяем если корзина пуста.
    if (jQuery.isEmptyObject(this.cart))
      $('div#cart')
        .find('h2')
        .replaceWith('<h2>Моя корзина : Пусто !!! </h2>');
    else
      $('div#cart')
        .find('h2')
        .replaceWith('<h2>Моя корзина </h2>');
    for (var cartItem in this.cart) {
      this.goodsData.map(function(key) {
        if (key['id'] === cartItem) foundObj = key;
      });
      out += '<li class="goods-item-container">';
      out += '<article class="goods-item">';
      out += '<div class="columns columns-id">' + foundObj['id'] + '</div>';
      out += '<div class="columns columns-name">' + foundObj['name'] + '</div>';
      out += '<div class="columns columns-description">' + foundObj['description'] + '</div>';
      out += '<div class="columns columns-cost">' + foundObj['cost'] + '</div>';
      out += '<div class="columns columns-img">';
      out += '<a href="#"><img class="goods_miniature" src="' + foundObj['img'] + '" alt="' + foundObj['description'] + '"></a>';
      out += '</div>';
      out += '<div class="button-columns">';
      if (this.cart[cartItem] > 0) out += '<h2 id="quantity-buy" class="quantity-item">' + this.cart[cartItem] + '</h2>';
      else out += '<h2 id="quantity-buy" class="quantity-item"> 0 </h2>';
      out += '</div>';
      out += '</article>';
      out += '</li>';
    }
    $('ul.cart-list').html(out);
  }
  /*
    Init метод вызываемый при загрузке страницы, если в localStorage есть корзина то пользуем ее.
*/
  checkCart() {
    if (localStorage.getItem('cart') != null) {
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }
  }
  /*
    Обработчик кнопки перехода в корзину, прячем товары показываем корзину.
*/
  clickShowCart() {
    $('div#shoping').hide();
    $('div#cart').removeClass('visually-hidden');
    $('div#cart').show();
    this.renderCart();
    this.calculateCartAmount();
  }
  /**
   *  Обрабочик кнопки перехода назажж к выбору товара, прячем корзину показывам товары.
   */
  clickShowGoods() {
    this.renderList();
    $('div#shoping').show();
    $('div#cart').hide();
  }
  /*
    Кнопка очистки корзины
*/
  clickClearCart() {
    this.cart = {};
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateCartAmount();
    this.renderCart();
  }
  /*
    Кнопка добавления +1 товара в корзину. добавляет в cart[id] +1 к значению.
*/
  clickBuyItem(event) {
    event.preventDefault();
    let articule = $(event.target).attr('data-article'); // Артикул id товара
    if (articule <= 0) return;
    if (this.cart[articule] != undefined) this.cart[articule]++;
    else this.cart[articule] = 1;
    $(event.target)
      .prev()
      .replaceWith('<h2 id="quantity-buy" class="quantity-item">' + this.cart[articule] + '</h2>');
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  /*
  TODO: Уменьшения кол-ва заказаного товара нет.
  Можно только очистить корзину.
*/
  /*
    Расчет стоимости товара в корзине, пробегаем по товарам корзине, но так как в корзине нет цен, то смотрим цену в goodsData,
*/
  calculateCartAmount() {
    let totalAmount = 0;
    let itemPrice = 0;
    for (var cartItem in this.cart) {
      itemPrice = 0;
      this.goodsData.map(function(key) {
        if (key['id'] === cartItem) itemPrice = key['cost'];
      });
      totalAmount += this.cart[cartItem] * itemPrice;
    }
    totalAmount = Math.round(totalAmount * 100) / 100;
    $('p#totalAmount').html('Total Price = ' + totalAmount);
    if (totalAmount === 0) $('button#pay-cart').hide();
    else $('button#pay-cart').show();
  }
}
export { Client };
