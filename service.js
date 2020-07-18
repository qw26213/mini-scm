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

service.saveUser = (data) => {
  let apiUrl = api + '/drp/mm/customer/save'
  return http.post(apiUrl, data);
}

service.getByOpenId = (data) => {
  let apiUrl = api + '/drp/mm/customer/getByOpenId'
  return http.post(apiUrl,data);
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
service.orderList = (data) => {
  let apiUrl = api + '/drp/mm/salesOrder/getResPageData'
  return http.post(apiUrl, data);
}

//订单详情
service.orderInfo = (data) => {
  let apiUrl = api + '/drp/mm/salesOrder/getByHeaderId'
  return http.post(apiUrl, data);
}

//订单详情
service.orderDel = (data) => {
  let apiUrl = api + '/drp/mm/salesOrder/deleteByHeaderId'
  return http.post(apiUrl, data);
}

//提交订单
service.orderSave = (data) => {
  let apiUrl = api + '/drp/mm/salesOrder/save'
  return http.post(apiUrl, data);
}

//地址列表
service.addrlist = (data) => {
  let apiUrl = api + '/drp/mm/customerAddr/getByBookIdOpenId'
  return http.post(apiUrl, data);
}

//添加地址
service.addrSave = (data) => {
  let apiUrl = api + '/drp/mm/customerAddr/save'
  return http.post(apiUrl, data);
}
//添加地址
service.addrGet = (data) => {
  let apiUrl = api + '/drp/mm/customerAddr/getById'
  return http.post(apiUrl, data);
}

//删除地址
service.addrDel = (data) => {
  let apiUrl = api + '/drp/mm/customerAddr/deleteById'
  return http.post(apiUrl, data);
}

//默认地址
service.addrDefault = (data) => {
  let apiUrl = api + '/drp/mm/customerAddr/updateIsDefaultById'
  return http.post(apiUrl, data);
}


module.exports = {
  service: service
}