import request from '@/utils/myrequest'
import {
    getCookieData
} from '@/utils/auth' // 쿠키설정

// get all order data
export function getOrders(data) {
    return request({
        url: 'orders',
        method: 'get',
        params: data
    })
}

// get total price, weight order data
export function getOrderTotalPrice(data) {
    return request({
        url: 'orders/priceStat',
        method: 'get',
        params: data
    })
}

// get order detail data by orderid
export function getOrderDetail(orderid) {
    return request({
        url: `orders/${orderid}`,
        method: 'get'
    })
}

// get delivery status
export function getDeliveryStatus(orderid, suborderid, deliveryno) {
    return request({
        url: `orders/delivery/${orderid}/${suborderid}/${deliveryno}`,
        method: 'get'
    })
}

// cancel order
export function setCancelOrder(orderid, data) {
    return request({
        url: `orders/cancel/${orderid}`,
        method: 'put',
        data
    })
}

// get shipping company
export function getCompanyInfo() {
    return request({
        url: 'deliveries/company',
        method: 'get'
    })
}

// refund order
export function setRefundOrder(orderid, data) {
    return request({
        url: `orders/refund/${orderid}`,
        method: 'put',
        data
    })
}

// send shipping info
export function setSendShipping(orderid, data) {
    return request({
        url: `orders/delivery/${orderid}`,
        method: 'put',
        data
    })
}

// add delivery company data
export function setAddDeliveryCompany(orderid, data) {
    return request({
        url: `orders/delivery/append/${orderid}`,
        method: 'put',
        data
    })
}

// get Order number of payed
export function getOrderNumberByPayed() {
    return request({
        url: 'orders/pendingNum',
        method: 'get'
    })
}

// get order data of payed
export function getOrderPayed(data) {
    return request({
        url: 'orders/pending',
        method: 'get',
        params: data
    })
}

// get all order status
export function getOrderStatus() {
    return request({
        url: 'base/orderStatus',
        method: 'get'
    })
}

// order finish
export function setFinishOrder(orderid) {
    return request({
        url: `orders/done/${orderid}`,
        method: 'put'
    })
}

// order send delivery
export function setSendDelivery(orderid) {
    return request({
        url: `orders/runner/${orderid}`,
        method: 'put'
    })
}

// order auto send shipping
export function setAutoSendShipping(orderNo, subOrderNo) {
    return request({
        url: `orders/kd100Print/${orderNo}/${subOrderNo}`,
        method: 'put'
    })
}

// print batch status
export function setBatchPrint(data) {
    return request({
        url: `orders/printStatus`,
        method: 'put',
        data
    })
}

// get order print normal info
export function getOrderPrintInfo(data) {
    return request({
        url: `orders/print`,
        method: 'put',
        data
    })
}

// get order multiprint normal info
export function setMultiPrintInfo(data) {
    return request({
        url: `orders/picking`,
        method: 'put',
        data
    })
}

// order batch read
export function setOrderBatchRead(data) {
    return request({
        url: `orders/read`,
        method: 'put',
        data
    })
}

// order single read
export function setOrderSingleRead(orderId) {
    return request({
        url: `orders/read/${orderId}`,
        method: 'put'
    })
}

// set order ready delivery status
export function setOrderReadyDeliveryStatus(data) {
    return request({
        url: `orders/readyDelivery`,
        method: 'put',
        data
    })
}

// set export before settlement data
export function setExportOrderData(data) {
    return request({
        url: 'orders/export',
        method: 'get',
        params: data
    })
}

// set add order warning info
export function setAddWarningInfo(orderId, data) {
    return request({
        url: `orders/warning/${orderId}`,
        method: 'post',
        data
    })
}

// get order warning info
export function getOrderWarningInfo(orderId) {
    return request({
        url: `orders/warning/${orderId}`,
        method: 'get'
    })
}

// change order delivery address
export function setOrderDeliveryAddress(orderNo, data) {
    return request({
        url: `orders/deliveryChange/${orderNo}`,
        method: 'put',
        data
    })
}

// refund by one order product
export function setRefundSingleOrder(orderid, goodsid, data) {
    return request({
        url: `orders/refund/${orderid}/${goodsid}`,
        method: 'put',
        data
    })
}

// confirm future for delivery
export function setConfirmFutureDelivery(data) {
    return request({
        url: `orders/futureDelivery`,
        method: 'put',
        data
    })
}

// confirm order warning for delivery
export function setConfirmWarningDelivery(data) {
    return request({
        url: `orders/warningDelivery`,
        method: 'put',
        data
    })
}

// confirm warning for delivery form future
export function setConfirmWarningDeliveryFromFuture(data) {
    return request({
        url: `orders/warningDeliveryFromFuture`,
        method: 'put',
        data
    })
}

// confirm order ready for delivery from warning
export function setConfirmWarningOrderReady(data) {
    return request({
        url: `orders/notReadyDeliveryFromWarning`,
        method: 'put',
        data
    })
}

// order goods export
export function setExportOrderGoods() {
    return request({
        url: 'orders/goods/export',
        method: 'get'
    })
}

// get order num of played & not delivery
export function getDeliveryStatusNum() {
    return request({
        url: 'orders/pending/deliveryStatusNum',
        method: 'get'
    })
}

// get order time out data
export function getOrderTimeout(data) {
    return request({
        url: 'orders/timeout',
        method: 'get',
        params: data
    })
}

// download order delivery controll
export function exportOrderDeliveryControll(deliveryStatus) {
    return request({
        url: `orders/deliveryControl/${deliveryStatus}/export`,
        method: 'get'
    })
}

// order force init
export function setOrderForceInit(orderNo) {
    return request({
        url: `orders/forceInit/${orderNo}`,
        method: 'put'
    })
}