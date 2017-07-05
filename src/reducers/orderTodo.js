import {
  CHANGE_STYLIST,
  CHANGE_LEVEL,
  INVALTDATE_ORDERS,
  REQUEST_ORDERS,
  RECEIVE_ORDERS
} from '../actions';

// store结构
// let data = {
//   orders: {
//     isFetching: false,
//     didInvalidate: false,
//     fetchedPageCount: 10,
//     nextPageUrl: '',
//     items: []
//   },
//   goods: {
//     isFetching: false,
//     didInvalidate: false,
//     fetchedPageCount: 10,
//     nextPageUrl: '',
//     item: []
//   },
//   filter: {
//     what: '',
//     condition: {},
//     result: []
//   }
// };

// 对orders的状态操作
function ordersStatus(state = {
  isFetching: false,
  didInvalidate: false,
  // fetchedPageCount: 10,
  // nextPageUrl: '',
  items: []
}, action) {
  switch (action.type) {
    case INVALTDATE_ORDERS:
      return Object.assign({}, state, {
        didInvalidate: true
      })

    // 请求/接收orders测试成功
    case REQUEST_ORDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_ORDERS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.orders,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

// TODO: 以后分组再优化
// 要初始化数据
function orders(state = {
  isFetching: false,
  didInvalidate: true,
  items: [],
}, action) {
  switch (action.type) {
    case CHANGE_STYLIST:
      state.orders[action.orderIndex].stylistIndex = action.stylistIndex;
      return [
        ...state,
      ]
    case CHANGE_LEVEL:
      state.orders[action.orderIndex].order_level = action.orderLevel;
      return [
        ...state,
      ]
    case INVALTDATE_ORDERS:
    case REQUEST_ORDERS:
    case RECEIVE_ORDERS:
      return Object.assign({}, state, {
        ...ordersStatus(state.orders, action)
      })
    default:
      return state
  }
}

export default orders;