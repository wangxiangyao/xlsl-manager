import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOrdersIfNeeded, changeFilterCondition, doFilter, changeFilterWhat } from '../../actions/';
// import List from '../../component/List/List'
import { Table, Icon, Radio, Form, Input, Button } from 'antd';

import SubList from '../../component/List/SubList.js';
import orderDefaultConditionConfig from '../../filterConfig/ordersDefaultConditionConfig';

import './listStage.css';

const FormItem = Form.Item;

// 开始构建ListStage对象
/*
 *    根据路由参数（orders/goods/admins），去请求对应数据，调用filterConfig，listConfig
 *      请求数据：order,good、admin？
 *      filterConfig配置了默认的某种数据的所有过滤条件的参数
 *      listConfig配置了，
 */
class ListStage extends Component {
  constructor(props) {
    super(props)
    const { match, dispatch } = this.props
    /*
     *  根据what选择初始化的过滤条件，和展示table的表头配置
     */
    const what = match.params.what
    switch (what) {
      case 'orders':
      case 'goods':
      case 'admins':
        dispatch(changeFilterWhat(what))
        return
      default:
        return;
    }
    // 初始化的过滤条件都在filter中，把filter存入store
    // dispatch(changeFilterCondition(filter));

    // 目前state主要用来配置table
    // TODO:定义三种List的state
  }

  componentWillMount () {
    const { dispatch ,filter} = this.props
    const what = filter.what

    // 定义了每种表格（ordersList/goodsList/adminsList）的表头配置项
    // 由于jsx必须写在React域中，所以没想到怎么抽象抽象
    const orderTableConfig = {
      bordered: false,
      loading: this.props.orders.isFetching,
      pagination: true,
      selectedOrderStylist: 'all',
      expandedRowRender: record => <SubList baby={record.baby} key={record.baby}></SubList>,
      title: '订单列表',
      rowSelection: {},
      scroll: undefined,

    }
    // 根据filter.what初始化过滤条件
    switch (what) {
      case 'orders':
        dispatch(changeFilterWhat(what))
        // 初始化配置条件
        dispatch(changeFilterCondition(orderDefaultConditionConfig, [
          {
            type: 'member_phone',
            action: this.searchMemberPhone,
          },
        ]))
        dispatch(fetchOrdersIfNeeded());
        this.state = {
          tableConfig: orderTableConfig,
        }
        return
      // 还需要下边的这些
      // TODO:完善goods、admins的检查和初始化
      // case 'goods':
      // case 'admins':
      //   dispatch(changeFilterWhat(what))
      //   return
      default:
        return;
    }
  }

  // TODO: 在更新的时候，检查过滤
  // componentDidUpdate(prevProps) {
  //   if (this.props)
  // }

  // 以下，定义过滤函数
  searchMemberPhone = (record, condition) => {
    const reg = new RegExp(condition.searchText, 'gi');
    console.log(reg);
    const match = record.member_phone.match(reg)
    console.log(match);
    if (!match) {
      return null;
    }
    return {
      ...record,
      member_phone: (
        <span>
              {
                record.member_phone.split(reg).map(
                  (text, i) => (i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text)
                )
              }
            </span>
      ),
    };
  }



  // 以下，事件处理函数
  onMemberPhoneInputChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({
      member_phone: {
        searchText: e.target.value
      }
    }))
  }

  onSearchMemberPhone = () => {
    const { dispatch } = this.props;
    const { searchText } = this.props.filter.condition.member_phone;
    const { result } = this.props.filter.result;
    console.log(result);
    dispatch(changeFilterCondition(
      {
        member_phone: {
          filterDropdownVisible: false,
          filtered: !!searchText,
        }
      }))
    dispatch(doFilter());
  }

  // 事件处理函数
  handleFilterOrderLevelChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ order_level: e.target.value }))
  }
  handleFilterOrderStylistChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ order_stylist: e.target.value }))
  }



  render () {
    // 定义订单orders表头
    const { orders, filter,dispatch } = this.props;
    const state = this.state;
    const orderColumns = [
      {
        title: '用户手机',
        dataIndex: 'member_phone',
        key: 'member_phone',
        // 定义筛选下拉框
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              placeholder="Search member-phone"
              value={this.props.filter.condition.member_phone.searchText}
              onChange={this.onMemberPhoneInputChange}
              onPressEnter={this.onSearchMemberPhone}
            />
            <Button type="primary" onClick={this.onSearchMemberPhone}>Search</Button>
          </div>
        ),
        filterIcon: <Icon type="smile-o" style={{ color: filter.condition.member_phone.filtered ? '#108ee9' : '#aaa' }}/>,
        filterDropdownVisible: filter.condition.member_phone.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          dispatch(changeFilterCondition({
            member_phone: {
              filterDropdownVisible: visible,
            }
          }))
        },
        render: text => <a href="#">{text}</a>,
        // TODO: 点击查看用户详情
      },
      {
        title: '下次配送时间',
        dataIndex: 'next_send_time',
      }, {
        title: '订单状态',
        dataIndex: 'order_level',
      },
      {
        title: '设计师',
        dataIndex: 'order_stylist',
      },
      {
        title: '操作',
        key: 'action',
        width: 360,
        render: (text, record) => (
          <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
        ),
      },
    ];
    console.log('渲染页面')
    return (
      <div>
        <div className="components-table-demo-control-bar">
          <Form layout="inline">
            <FormItem label="订单状态">
              <Radio.Group size="default" value={filter.order_level} onChange={this.handleFilterOrderLevelChange}>
                <Radio.Button value="">all</Radio.Button>
                <Radio.Button value="0">待搭配</Radio.Button>
                <Radio.Button value="1">待发货</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem label="设计师">
              <Radio.Group size="default" value={filter.order_stylist} onChange={this.handleFilterOrderStylistChange}>
                <Radio.Button value="all">all</Radio.Button>
                <Radio.Button value="0">钱晓峰</Radio.Button>
                <Radio.Button value="1">王相尧</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </div>
        <Table {...state.tableConfig} columns={orderColumns} dataSource={filter.result}
               rowKey={record => {
                 return record.id;
               }}/>
      </div>
    );
  }
}

ListStage.propTypes = {
  orders: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    ...state,
  }
}

export default connect(mapStateToProps)(ListStage)