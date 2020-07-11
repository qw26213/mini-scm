import {constant} from 'utils/constant';
import {http} from 'utils/http';
let service = {};
let api = constant.apiUrl;


// ---------------------------login--------------
service.login = (data) => {
  let apiUrl = api + '/drp/mm/enterpriseInfo/login'
  return http.post(apiUrl, data);
}

service.enterpriseInfo = () => {
  let apiUrl = api + '/drp/mm/enterpriseInfo/getInfo'
  return http.post(apiUrl);
}
// -------------------------------------------product---------------------------------

// 产品列表
service.productlist = (data) => {
  let apiUrl = api + '/drp/mm/goods/getAll'
  return http.post(apiUrl, data);
}

service.tablist = (data) => {
  let apiUrl = api + '/drp/mm/tabs/getAll'
  return http.post(apiUrl, data);
}

// 产品内容
service.productDetail = (data) => {
  let apiUrl = api + '/drp/mm/goodsDetail/getByHeaderId'
  return http.post(apiUrl, data);
}

// 产品图片
service.getGoodsById = (data) => {
  let apiUrl = api + '/drp/mm/goods/getById'
  return http.post(apiUrl, data);
}

// 产品图片
service.goodsAttachment = (data) => {
  let apiUrl = api + '/drp/mm/goodsAttachment/getByHeaderId'
  return http.post(apiUrl, data)
}

// -------------------------------------------cart-----------------------------------

service.cartlist = (data) => {
	let apiUrl = api + '/drp/mm/customerCart/getAll'
	return http.post(apiUrl, data)
}

service.cartsave = (data) => {
	let apiUrl = api + '/drp/mm/customerCart/save'
	return http.post(apiUrl, data)
}

service.cartdel = (data) => {
	let apiUrl = api + '/drp/mm/customerCart/deleteByDetailId'
	return http.post(apiUrl, data)
}

// -------------------------------------------order-----------------------------------

//订单列表
service.orderlist = (data) => {
  let apiUrl = api + '/order/orderList.json'
  return http.post(apiUrl, data);
}

//订单详情
service.orderInfo = (data) => {
  let apiUrl = api + '/order/info.json'
  return http.post(apiUrl, data);
}

module.exports = {
  service: service
}