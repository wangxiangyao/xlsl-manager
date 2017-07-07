import {

  INVALTDATE_GOODS,
  REQUEST_GOODS,
  RECEIVE_GOODS
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
function goodsStatus(state = {
  isFetching: false,
  didInvalidate: false,
  // fetchedPageCount: 10,
  // nextPageUrl: '',
  items: []
}, action) {
  switch (action.type) {
    case INVALTDATE_GOODS:
      return Object.assign({}, state, {
        didInvalidate: true
      })

    // 请求/接收orders测试成功
    case REQUEST_GOODS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_GOODS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.goods,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

// TODO: 以后分组再优化
// 要初始化数据
function goods(state = {
  isFetching: false,
  didInvalidate: true,
  items: [],
}, action) {
  switch (action.type) {
    case INVALTDATE_GOODS:
    case REQUEST_GOODS:
    case RECEIVE_GOODS:
      return Object.assign({}, state, {
        ...goodsStatus(state.goods, action)
      })
    default:
      return state
  }
}

export default goods;