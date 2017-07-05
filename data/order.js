// 加载数据模板

import orderData from './order.json';
import Mock from 'mockjs';

Mock.mock('/', orderData);
