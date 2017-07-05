import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd';

// 定义展开列表的表头
const columns = [
  { title: '宝宝名字', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '性别', dataIndex: 'sex', key: 'sex'},
  { title: '身高', dataIndex: 'height' ,key: 'height' },
  { title: '体重', dataIndex: 'weight', key: 'weight' },
  // {
  //   title: 'Action',
  //   dataIndex: 'operation',
  //   key: 'operation',
  //   render: () => (
  //     <span className={'table-operation'}>
  //           <a href="#">Pause</a>
  //           <a href="#">Stop</a>
  //           <Dropdown overlay={menu}>
  //             <a href="#">
  //               More <Icon type="down" />
  //             </a>
  //           </Dropdown>
  //         </span>
  //   ),
  // },
];
export default class SubList extends Component {


  render() {
    const { baby } = this.props
    console.log(this.props)
    return (
      <Table
        columns={columns}
        dataSource={baby}
        pagination={false}
        rowKey={record => {
          return record.baby_id
        }}
      />
    );
  }
}


SubList.propTypes = {
  baby: PropTypes.array.isRequired,
}
