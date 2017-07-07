import fetch from 'isomorphic-fetch';
// 定义本项目的各种共享数据的操作

// 订单action
export const CHANGE_STYLIST = 'CHANGE_STYLIST';
export const CHANGE_LEVEL = 'CHANGE_LEVEL';
export const INVALTDATE_ORDERS = 'INVALTDATE_ORDERS';
// 过滤action
export const CHANGE_FILTER_WHAT = "CHANGE_FILTER_WHAT"
export const DO_FILTER = "DO_FILTER";
export const FILTER_CLEAN = "FILTER_CLEAN";
export const CHANGE_FILTER_CONDITION = "CHANGE_FILTER_CONDITION";

// 商品action
export const ADD_GOODS = "ADD_GOODS";
export const CHANGE_GOODS = "CHANGE_GOODS";
export const DELET_GOODS = "DELET_GOODS";
export const INVALTDATE_GOODS = 'INVALTDATE_GOODS';


// fetch请求action
// 请求orders
export const REQUEST_ORDERS = 'REQUEST_ORDERS';
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
// 请求goods
export const REQUEST_GOODS = 'REQUEST_GOODS';
export const RECEIVE_GOODS = 'RECEIVE_GOODS';


// 以下是定义具体的action生成函数
/*
 * 描述：指定设计师
 * 参数：orderIndex(Number) order在result状态数组中的index
 *       stylistIndex(Number) 设计师编号
*/
export const changeStylist = (orderIndex, stylistIndex) => {
  return {
    type: CHANGE_STYLIST,
    orderIndex,
    stylistIndex,
  }
}
/*
 * 描述：改变订单状态
 * 参数：orderIndex(Number) order在result状态数组中的index
 *       orderLevel(Number) 订单状态码
 */
export const changeLevel = (orderIndex, orderLevel) => {
  return {
    type: CHANGE_LEVEL,
    orderIndex,
    orderLevel,
  }
}

// 销毁请求到的orders数组
// TODO: 暂时先这样，如果orders分组了，再分组销毁
export const invaltdateOrders = () => {
  return {
    type: INVALTDATE_ORDERS
  }
}

/*
 * 描述：过滤
 * 参数：condition(Object) 可能的值：
 *    stylistIndex(Number) 设计师编号
 *    user_phoneNum(String) 用户手机号
 *    order_level(Number) 订单状态
 *    order_sendTime(String) 配送时间
 * TODO: 明确过滤条件
 */
// const filter = (condition) => {
//   return {
//     type: FILTER,
//     ...condition,
//   }
// }

// 过滤条件清空
/*
 * 条件：默认的某种filter的condition
 */

export const filterClean = (defaultCondition) => {
  return {
    type: FILTER_CLEAN,
    defaultCondition,
  }
}
// 改变过滤条件
// 参数： changedCondition(Object) 参数结构如下：
// changedCondition: {
//   条件名: {
//     ... 各种属性
//   }
// }
// myAction(不必须): 对象/数组
// {
//   type: 对应的条件名
//   action: 函数，处理函数
// }
export const changeFilterCondition = (changedCondition, myAction) => {
  return {
    type: CHANGE_FILTER_CONDITION,
    changedCondition,
    myAction,
  }
}

// 开始过滤 会执行每个条件处理函数，然后返回一个处理后的数组。
export const doFilter = () => {
  return {
    type: DO_FILTER,
  }
}
export const changeFilterWhat = (what, data) => {
  return {
    type: CHANGE_FILTER_WHAT,
    what,
    data,
  }
}

/*
 * 描述：请求orders
 * 参数：无
 */
function requestOrders () {
  return {
    type: REQUEST_ORDERS,
  }
}

/*
 * 描述：接收orders
 * 参数：无
 */
function receiveOrders (json) {
  return {
    type: RECEIVE_ORDERS,
    orders: json.data.orders,
    receivedAt: Date.now()
  }
}

// 暴露给外部的方法：向服务器放松请求
export function fetchOrders() {
  return function (dispatch) {
    dispatch(requestOrders())
    return fetch('/getOrders')
      .then(
        (response) => {
          return response.json()
        }, error => console.log('一个错误:', error)
      )
      .then(
        (json) => {
          console.log(json);
          dispatch(receiveOrders(json))
          dispatch(doFilter())
          // 根据当前过滤条件，初始化过滤数组dataSource
        })
      .catch(e => {
        console.log(e)
      })
  }
}

// 判断是否应该向服务器请求数据
function shouldFetchOrders(state) {
  const orders = state.orders;
  // if (JSON.stringify(orders) === "{}") {
  //   return true;
  // }
  // 初始化时候直接设置数据需要被销毁，上边的判空不要了。
  if (orders.isFetching) {
    return false;
  } else {
    return orders.didInvalidate;
  }
}

// 暴露给外部的方法：自动判断是否请求(本地是否缓存）
export function fetchOrdersIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchOrders(getState())) {
      return dispatch(fetchOrders())
    } else {
      dispatch(changeFilterWhat("orders", getState().orders.items))
      dispatch(doFilter())
      return Promise.resolve()
    }
  }
}

/*
 * 描述：请求goods
 * 参数：无
 */
function requestGoods () {
  return {
    type: REQUEST_GOODS,
  }
}

/*
 * 描述：接收orders
 * 参数：无
 */
function receiveGoods (json) {
  return {
    type: RECEIVE_GOODS,
    goods: json.data.goods,
    receivedAt: Date.now()
  }
}

// 暴露给外部的方法：向服务器放松请求
export function fetchGoods() {
  return function (dispatch) {
    dispatch(requestGoods())
    return fetch('/getGoods')
      .then(
        (response) => {
          return response.json()
        }, error => console.log('一个错误:', error)
      )
      .then(
        (json) => {
          console.log(json);
          dispatch(receiveGoods(json))
          dispatch(doFilter())
          // 根据当前过滤条件，初始化过滤数组dataSource
        })
      .catch(e => {
        console.log(e)
      })
  }
}

// 判断是否应该向服务器请求数据
function shouldFetchGoods(state) {
  const goods = state.goods;
  // if (JSON.stringify(orders) === "{}") {
  //   return true;
  // }
  // 初始化时候直接设置数据需要被销毁，上边的判空不要了。
  if (goods.isFetching) {
    return false;
  } else {
    return goods.didInvalidate;
  }
}

// 暴露给外部的方法：自动判断是否请求(本地是否缓存）
export function fetchGoodsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchGoods(getState())) {
      return dispatch(fetchGoods())
    } else {
      dispatch(changeFilterWhat("goods", getState().goods.items))
      dispatch(doFilter())
      return Promise.resolve()
    }
  }
}




