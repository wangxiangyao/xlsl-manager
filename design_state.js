// {
//   orders: {
//     // 优化: 记录每次分页请求的orders，每组orders都记录是否销毁。
//     isFetching: true,
//     didInvalidate: false// 是否应该销毁，数据是否新鲜
//     fetchedPageCount: 10// 默认是10个
//     nextPageUrl: '/orders?offset=10' // 偏移量
//     items: ['所有的order']  // 每个Order需要store的状态，可再优化
//   }
//   goods: {
//     isFetching: false,
//     didInvalidate: false,
//     lastUpdated: 1439478405547,
//     fetchedPageCount: 10, // 默认是10个
//     nextPageUrl: '/orders?offset=10', // 偏移量
//     item: ['所有goods']
//   }
//   filter: {
//     what: 'order/good'
//     condition: {
//       '类别名': {
//          一些主要的信息
//        }
//       ...
//     }
//     actions: [
//            {
//              type: 表示此操作对应哪个过滤条件
//               action: 处理函数
//             }
//          ]
//     result: ['过滤的order/good']
//     dataSource: ['过滤数据源，一般是fetch请求来的数据']
//   }
// }