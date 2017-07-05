import {
  DO_FILTER,
  FILTER_CLEAN,
  CHANGE_FILTER_CONDITION,
  RECEIVE_ORDERS,
  CHANGE_FILTER_WHAT,
} from '../actions';

// 合并changedCondition
// 实质是两个对象的合并，后一个对象的值覆盖前一个对象
const mergeCondition = (oldCondition, changedCondition) => {
  for( let [key, val] of Object.entries(changedCondition)) {
    if (oldCondition.hasOwnProperty(key)) {
      if(typeof oldCondition[key] === 'object') {
        mergeCondition(oldCondition[key], val)
      } else {
        oldCondition[key] = val;
      }
    } else {
        oldCondition[key] = val;
    }
  }
}

// 处理所有的过滤
const filterProcessor = (filter) => {
  const { actions, condition ,dataSource} = filter;
  let arr = [...dataSource];
  for (let i = 0, len = actions.length; i < len; i++) {
    let someAction = actions[i];
    arr = arr.map((item) => {
      return someAction.action(item, condition[someAction.type]);
    })
  }
  return arr.filter(record => !!record );
}

// 设置好初始状态
export default function filter(state = {
  what:'',
  condition: {

  },
  result: [],
  dataSource: [],
  actions: [],

}, action) {
  // 初始化filter状态
  const myAction = action.myAction
  const changedCondition = action.changedCondition
  let { actions, condition } = state;
  let objState = {} // 合并的目标对象
  switch (action.type) {
    case CHANGE_FILTER_CONDITION:
      if (changedCondition) {
        mergeCondition(condition, changedCondition)
        Object.assign(objState, state)
      }
      if (myAction) {
        if (typeof myAction.action === 'function' && typeof myAction.type === 'string') {
          // 如果只传入了一个函数
          for (let i = 0, len = actions.length; i <= len; i++) {
            if (i >= len) {
              actions.push(myAction);
              break;
            }
            if (actions[i].type === myAction.type) {
              actions[i] = myAction;
              break;
            }
          }
        } else {
          // 如果传入了一个数组
          // 每一项是一个对象，都有type,action属性
          // 一次传入多种属性的处理函数
          // TODO:此处可以优化
          if (actions.length) {
            for(let i = 0, len = myAction.length; i <= len; i++) {
              for (let j = 0, len1 = actions.length; j <= len1; j++) {
                if (j >= len1) {
                  actions.push(myAction[j]);
                  break;
                }
                if (actions[j].type === myAction[i].type) {
                  actions[i] = myAction[i];
                  break;
                }
              }
            }
          } else {
            actions = myAction
          }
        }
        Object.assign(objState, state, {
          actions,
        })
      }
      return objState
    case FILTER_CLEAN:
      console.log("FILTER_CLEAN", action.defaultCondition)
      return Object.assign({}, state, {
        condition: action.defaultCondition,
      })
    case DO_FILTER:
      return Object.assign({}, state, {
        result: filterProcessor(state)
      })
    case RECEIVE_ORDERS:
      return Object.assign({}, state, {
        dataSource: action.orders
      })
    case CHANGE_FILTER_WHAT:
      return Object.assign({},state, {
        what: action.what,
      })
    default:
      return state
  }
}