import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchGoodsIfNeeded, changeFilterCondition, doFilter, changeFilterWhat, filterClean } from '../../actions/';
// import List from '../../component/List/List'
import { Table, Icon, Radio, Form, Input, Button } from 'antd';

// 每一项的展开项


// 默认的condition配置
import goodsDefaultConditionConfig from '../../filterConfig/goodsDefaultConditionConfig';

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
    // 由于jsx必须写在React域中，所以没想到怎么抽象
    const goodsTableConfig = {

    }
    /*
     *  初始化的过滤条件、展示table的表头配置、改变filter.what
     */
    dispatch(changeFilterWhat('goods'))
    // 初始化配置条件
    // 做一个深拷贝，这样，保留默认配置，在清空和初始化的时候要用到
    const obj = JSON.parse(JSON.stringify((goodsDefaultConditionConfig)))
    dispatch(changeFilterCondition(obj, []))
    dispatch(fetchGoodsIfNeeded());
    this.state = {
      tableConfig: goodsTableConfig,
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

  /*
   *  以下，定义过滤函数
  */


  /*
   *  以下是事件处理函数
   */


  render () {
    // 定义订单orders表头
    const { filter, dispatch } = this.props;
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