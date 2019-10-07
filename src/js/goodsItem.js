/*
  структура товара 
*/
class goodsItem {
  constructor(item) {
    this.id = item['id'];
    this.name = item['name'];
    this.img = item['img'];
    this.cost = item['cost'];
    this.description = item['description'];
    this.available = item['available'];
    this.forsale = item['forsale'];

    return this;
  }
}
export { goodsItem };
