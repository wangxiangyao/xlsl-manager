import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOrdersIfNeeded, changeFilterCondition, doFilter, changeFilterWhat, filterClean } from '../../actions/';
// import List from '../../component/List/List'
import { Table, Icon, Radio, Form, Input, Button } from 'antd';

// 每一项的展开项
import SubList from '../../component/List/SubList.js';

// 默认的condition配置
import orderDefaultConditionConfig from '../../filterConfig/ordersDefaultConditionConfig';

import './listStage.css';

const FormItem = Form.Item;

// 开始构建ListStage对象
/*
 *    请求orders数据，调用filterConfig，listConfig
 *      请求数据：order,good、admin？
 *      filterConfig配置了默认的某种数据的所有过滤条件的参数
 *      listConfig配置了，
 */
class ListStage extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = this.props
    // 定义了每种表格（ordersList/goodsList/adminsList）的配置项
    // 表头配置项，写在了render()函数中
    // 由于jsx必须写在React域中，所以没想到怎么抽象抽象
    const orderTableConfig = {
      bordered: false,
      loading: this.props.orders.isFetching,
      pagination: true,
      selectedOrderStylist: 'all',
      expandedRowRender: record => <SubList baby={record.baby} key={record.baby}></SubList>,
      title: () => '订单列表',
      rowSelection: {},
      scroll: undefined,

    }
    /*
     *  初始化的过滤条件、展示table的表头配置、改变filter.what
     */
    dispatch(changeFilterWhat('orders'))
    // 初始化配置条件
    // 做一个深拷贝，这样，保留默认配置，在清空和初始化的时候要用到
    const obj = JSON.parse(JSON.stringify((orderDefaultConditionConfig)))
    dispatch(changeFilterCondition(obj, [
      {
        type: 'member_phone',
        action: this.searchMemberPhone,
      },
    ]))
    dispatch(fetchOrdersIfNeeded());
    this.state = {
      tableConfig: orderTableConfig,
    }
  }

  // componentWillMount () {
  //
  //
  // }

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

  handleFilterOrderLevelChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ order_level: e.target.value }))
  }
  handleFilterOrderStylistChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ order_stylist: e.target.value }))
  }
  handleCleanFilter = (e) => {
    const{ dispatch } = this.props;
    const obj = JSON.parse(JSON.stringify((orderDefaultConditionConfig)))
    dispatch(filterClean(obj))
    dispatch(doFilter())
  }



  render () {
    // 定义订单orders表头
    const { filter,dispatch } = this.props;
    console.log(filter);
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
            <FormItem label="设计师">
              <Radio.Group size="default" value='' onChange={this.handleFilterOrderStylistChange}>
                <Radio.Button value="">all</Radio.Button>
                <Radio.Button value="0">钱晓峰</Radio.Button>
                <Radio.Button value="1">王相尧</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem label="订单状态">
              <Radio.Group size="default" value='' onChange={this.handleFilterOrderLevelChange}>
                <Radio.Button value="">all</Radio.Button>
                <Radio.Button value="0">待搭配</Radio.Button>
                <Radio.Button value="1">待发货</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem label="">
              <Button type="primary" onClick={this.handleCleanFilter}>清 空</Button>
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