/* mockapi.io готовый бесплатный Api*/
const APIURL = 'http://5bdd3e7433f2d100131fc462.mockapi.io/v1/api/goods/';

/* Закрываем модальные окна. */
function closeAllModale() {
  document.querySelector('.modal-create').classList.remove('modal-show');
  document.querySelector('.modal-edit').classList.remove('modal-show');
  document.querySelector('.modal-overlay').classList.add('visually-hidden');
}

/* Helpers Metods*/
/* по URL различаем админ клиент.*/
function isAdmin() {
  return document.URL.indexOf('client.html') === -1;
}
export { APIURL, closeAllModale, isAdmin };
