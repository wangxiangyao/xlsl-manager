import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchGoodsIfNeeded, changeFilterCondition, doFilter, changeFilterWhat, filterClean } from '../../actions/';
// import List from '../../component/List/List'
import { Card, Icon, Radio, Form, Input, Button, Row, Col, Select, Checkbox, InputNumber } from 'antd';
import './xinanListStage.css';

// 默认的condition配置
import goodsDefaultConditionConfig from '../../filterConfig/goodsDefaultConditionConfig';
import './listStage.css';

const {Option, OptGroup} = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

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
    // 初始化配置条件
    // 做一个深拷贝，这样，保留默认配置，在清空和初始化的时候要用到
    const obj = JSON.parse(JSON.stringify((goodsDefaultConditionConfig)))
    dispatch(changeFilterCondition(obj, [{
      type: "size",
      action: this.filterSize,
    }, {
      type: "sex",
      action: this.filterSex,
    }, {
      type: "season",
      action: this.filterSeason,
    }, {
      type: "category",
      action: this.filterCategory,
    }, {
      type: "price",
      action: this.filterPrice,
    }, {
      type: "color",
      action: this.filterColor,
    }]))
    dispatch(fetchGoodsIfNeeded());
    this.state = {
      tableConfig: goodsTableConfig,
      categorySelected: [],
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
   *  以下，定义过滤函数,过滤函数均以filter开头
   *  参数，record数据源的每一项，condition，注册时候匹配的condition
   */

  /*
   *  过滤尺码和价格，思路是一样的，拿到值，比较是否在最大最小之间，如果是，就返回数据，不是，就返回null
   *
   */
  // 过滤尺码 condition是 size 是个数组[最小值， 最大值]
  filterSize = (record, size) => {
    if (record.size >= size[0] && record.size <= size[1]) {
      return record;
    }
    return null;
  }
  // 过滤价格
  filterPrice = (record, price) => {
    if (record.price >= price[record.category][0] && price[record.category][1]) {
      return record;
    }
    return null
  }

  /*
   *  过滤季节和性别的思路是一样的，拿到值，比较是否等于某个过滤参数，等于返回数据，否则返回null
   *
   */
  // 过滤性别
  filterSex = (record, sex) => {
    if (sex === "all") {
      return record
    }
    if (record.sex === sex) {
      return record;
    }
    return null;
  }

  // 过滤季节
  filterSeason = (record, season) => {
    if (season.length === 0) {
      // 当过滤条件没有时候，所有都不选择
      return null
    }
    if (record.season === '四季') {
      return record
    }
    if (season.findIndex((val) => record.season === val) === -1 ) {
      return null
    }
    return record
  }

  /*
   *
   *
   */
  filterCategory = (record, category) => {
    if (category.length === 0) {
      return record
    }
    if (category.findIndex((val) => record.category_sub === val) === -1 ) {
      return null
    }
    return record
  }

  // 过滤颜色
  filterColor = (record, color) => {
    // TODO:此处应该可以优化，使用Set或者Map数据结构
    // 这个arr的长度，来判断是否匹配
    if (color.length === 0) {
      return record
    }
    let arr = record.color.map((val) => {
      if ((color.findIndex((value) => val === value)) === -1 ) {
        return null
      }
      return true
    }).filter((i) => i)

    if (arr.length === 0) {
      return null
    }
    return record;
  }

  /*
   *  以下是事件处理函数
   */

  // 尺码处理函数
  onMinSizeChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ size: [value, filter.condition.size[1]]}))
  }
  onMaxSizeChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ size: [filter.condition.size[0], value]}))
  }
  // 尺码处理函数结束

  // 性别改变
  handleSexChange = (e) => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ sex: e.target.value}))
  }

  // 季节改变
  handleSeasonChange = (checkedValues) => {
    console.log(checkedValues);
    const { dispatch } = this.props;
    dispatch(changeFilterCondition({ season: [...checkedValues]}))
  }

  // 价格过滤
  // 全身装
  onMinSuitPriceChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ price: {
      "全身装": [value, filter.condition.price["全身装"][1]]
    }}))
  }
  onMaxSuitPriceChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ price: {
      "全身装": [filter.condition.price["全身装"][0], value]
    }}))
  }

  // 上装
  onMinUpPriceChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ price: {
      "上装": [value, filter.condition.price["上装"][1]]
    }}))
  }
  onMaxUpPriceChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ price: {
      "上装": [filter.condition.price["上装"][0], value]
    }}))
  }

  // 下装
  onMinDownPriceChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ price: {
      "下装": [value, filter.condition.price["下装"][1]]
    }}))
  }
  onMaxDownPriceChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ price: {
      "下装": [filter.condition.price["下装"][0], value]
    }}))
  }

  // 泳装
  onMinSwimsuitPriceChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ price: {
      "泳装": [value, filter.condition.price["泳装"][1]]
    }}))
  }
  onMaxSwimsuitPriceChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ price: {
      "泳装": [filter.condition.price["泳装"][0], value]
    }}))
  }

  // 配饰
  onMinAccPriceChange = (value) => {
    const { dispatch, filter } = this.props;
    if (!value) {
      value = 0;
    }
    dispatch(changeFilterCondition({ price: {
      "配饰": [value, filter.condition.price["配饰"][1]]
    }}))
  }
  onMaxAccPriceChange = (value) => {
    if (!value) {
      value = Infinity;
    }
    const { dispatch, filter } = this.props;
    dispatch(changeFilterCondition({ price: {
      "配饰": [filter.condition.price["配饰"][0], value]
    }}))
  }

  /*
  下边的过滤，基本都是过滤条件为数组类型的过滤，思路是，取到filter中的对应数组，然后深拷贝，变换过滤条件，再重新
  赋值到filter中。
  */
  // 选择种类的过滤
  onSelectCategory = (value) => {
    // 因为维护的最关键是次级种类，而这个是一个数组，没有设计重复数据覆盖的模式，而是整体覆盖。
    // 所以要在这里维护一个选择数组，然后整体覆盖
    const { dispatch, filter } = this.props;
    // 重新构建一个列表，然后覆盖
    let oldCategory = JSON.parse(JSON.stringify(filter.condition.category));
    oldCategory.push(value);
    dispatch(changeFilterCondition({ category: oldCategory }))
  }
  onDeselectCategory = (value) => {
    const { dispatch, filter } = this.props;
    // 重新构建一个列表，然后覆盖
    let oldCategory = JSON.parse(JSON.stringify(filter.condition.category));
    oldCategory.splice(oldCategory.findIndex(val => val === value ), 1);
    dispatch(changeFilterCondition({ category: oldCategory }))
  }

  // 选择颜色的过滤
  onSelectColor = (value) => {
    const { dispatch, filter } = this.props;
    // 重新构建一个列表，然后覆盖
    let oldColor = JSON.parse(JSON.stringify(filter.condition.color));
    oldColor.push(value);
    dispatch(changeFilterCondition({ color: oldColor }))
  }
  onDeselectColor = (value) => {
    const { dispatch, filter } = this.props;
    // 重新构建一个列表，然后覆盖
    let oldColor = JSON.parse(JSON.stringify(filter.condition.color));
    oldColor.splice(oldColor.findIndex(val => val === value ), 1);
    dispatch(changeFilterCondition({ color: oldColor }))
  }

  // TODO:面料过滤 ，都有什么面料？
  // TODO: 元素过滤，都有什么元素？


  // 触发过滤
  handleFilter = () => {
    const { dispatch } = this.props;
    dispatch(doFilter());
  }

  // 清空过滤条件
  handleCleanFilter = () => {
    const { dispatch } = this.props;
    dispatch(changeFilterCondition(goodsDefaultConditionConfig))
    dispatch(doFilter());
  }

  /*
  下面开始渲染组件
  */
  render (){
    const { filter } = this.props;
    const seasonOptions = ["春秋","夏季","冬季"];
    return (
      <div>
        <div className="components-table-demo-control-bar">
            <Form layout="horizontal">
              {/*搜索尺码，性别，适合季节*/}
              <Row gutter={16} type="flex" justify="start">
                <Col span={12}>
                  {/*尺码*/}
                  <Col span={8}>
                    <FormItem label="尺码"
                      // labelCol={{
                      //   xs: {
                      //     span: 3,
                      //   },
                      //   sm: {
                      //     span: 3,
                      //   }
                      // }}
                      // wrapperCol={{
                      //   span: 21
                      // }}
                    >
                      <InputNumber min={0} max={filter.condition.size[1]} placeholder="min" defaultValue={filter.condition.size[0]} onChange={this.onMinSizeChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        defaultValue={filter.condition.size[1]}
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxSizeChange.bind(this)}
                      />
                    </FormItem>
                  </Col >
                  {/*性别*/}
                  <Col span={8}>
                    <FormItem label="适合的性别"
                      // labelCol={{
                      //   span: 5
                      // }}
                      // wrapperCol={{
                      //   span: 19
                      // }}
                    >
                      <Radio.Group size="default" defaultValue='all' onChange={this.handleSexChange.bind(this)}>
                        <Radio.Button value="all">ALL</Radio.Button>
                        <Radio.Button value="男">男</Radio.Button>
                        <Radio.Button value="女">女</Radio.Button>
                      </Radio.Group>
                    </FormItem>
                  </Col>
                  {/*季节*/}
                  <Col span={8}>
                    <FormItem label="季节"
                      // labelCol={{
                      //   span: 3
                      // }}
                      // wrapperCol={{
                      //   span: 21
                      // }}
                    >
                      <CheckboxGroup options={seasonOptions} defaultValue={["春秋","夏季","冬季"]} onChange={this.handleSeasonChange.bind(this)} />
                    </FormItem>
                  </Col>
                </Col>

                {/*价格*/}
                <Col span={12}>
                  <Col>价 格：</Col>
                  <Col span={5}>
                    <FormItem label="上装价格">
                      <InputNumber placeholder="min" min={0} max={filter.condition.size[1]} onChange={this.onMinSuitPriceChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxSuitPriceChange.bind(this)}
                      />
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="全身装">
                      <InputNumber min={0} max={filter.condition.size[1]} placeholder="min" onChange={this.onMinUpPriceChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxUpPriceChange.bind(this)}
                      />
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="下装">
                      <InputNumber min={0} max={filter.condition.size[1]} placeholder="min" onChange={this.onMinDownPriceChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxDownPriceChange.bind(this)}
                      />
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="泳装">
                      <InputNumber min={0} max={filter.condition.size[1]} placeholder="min" onChange={this.onMinSwimsuitPriceChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxSwimsuitPriceChange.bind(this)}
                      />
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem label="配饰">
                      <InputNumber min={0} max={filter.condition.size[1]} placeholder="min" onChange={this.onMinAccPriceChange.bind(this)} className="sizeSearch size-min"/>
                      <InputNumber
                        placeholder="max"
                        min={filter.condition.size[0]}
                        className="sizeSearch size-max"
                        onChange={this.onMaxAccPriceChange.bind(this)}
                      />
                    </FormItem>
                  </Col>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={24}>
                  <FormItem label="选种类" style={{ width: "100%"}}
                            labelCol={{
                              span: 2
                            }}
                            wrapperCol={{
                              span: 21
                            }}
                  >
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      tokenSeparators={[",", "/"]}
                      allowClear={false}
                      onSelect={this.onSelectCategory.bind(this)}
                      onDeselect={this.onDeselectCategory.bind(this)}
                    >
                        {/*<div  key={1}>*/}
                      <OptGroup label="全身装" style={{width: "50%", fontSize: "200px"}} key={1} className="kindGroup">
                        <Option key="短袖连衣裙">短袖连衣裙</Option>
                        <Option key="无袖连衣裙">无袖连衣裙</Option>
                        <Option key="长袖连衣裙">长袖连衣裙</Option>
                        <Option key="西服套装">西服套装</Option>
                        <Option key="套装">套装</Option>
                      </OptGroup>
                      <OptGroup label="上装" key={2}>
                        <Option key="长袖T恤">长袖T恤</Option>
                        <Option key="短袖T恤">短袖T恤</Option>
                        <Option key="背心">背心</Option>
                        <Option key="长袖衬衫">长袖衬衫</Option>
                        <Option key="短袖衬衫">短袖衬衫</Option>
                        <Option key="毛衣">毛衣</Option>
                        <Option key="针织衫">针织衫</Option>
                        <Option key="大衣">大衣</Option>
                        <Option key="斗篷">斗篷</Option>
                        <Option key="牛仔衣">牛仔衣</Option>
                        <Option key="卫衣">卫衣</Option>
                        <Option key="羽绒服">羽绒服</Option>
                        <Option key="夹克">夹克</Option>
                      </OptGroup>
                      <OptGroup label="下装" key={3}>
                        <Option key="背带裤">背带裤</Option>
                        <Option key="背带裙">背带裙</Option>
                        <Option key="打底裤">打底裤</Option>
                        <Option key="短裤">短裤</Option>
                        <Option key="短裙">短裙</Option>
                        <Option key="牛仔裤">牛仔裤</Option>
                        <Option key="休闲裤">休闲裤</Option>
                        <Option key="运动裤">运动裤</Option>
                      </OptGroup>
                      <OptGroup label="泳装" key={4}>
                        <Option key="比基尼">比基尼</Option>
                        <Option key="连体衣">连体衣</Option>
                        <Option key="沙滩裤">沙滩裤</Option>
                      </OptGroup>
                      <OptGroup label="配饰" key={5}>
                        <Option key="连裤袜">连裤袜</Option>
                        <Option key="中筒袜">中筒袜</Option>
                        <Option key="短袜">短袜</Option>
                        <Option key="船袜">船袜</Option>
                        <Option key="饰品">饰品</Option>
                        <Option key="包包">包包</Option>
                        <Option key="帽子">帽子</Option>
                        <Option key="手套">手套</Option>
                        <Option key="头饰">头饰</Option>
                        <Option key="围巾">围巾</Option>
                        <Option key="领带">领带</Option>
                      </OptGroup>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="选颜色" style={{ width: "100%"}}
                            labelCol={{
                              span: 2
                            }}
                            wrapperCol={{
                              span: 21
                            }}
                  >
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      tokenSeparators={[",", "/"]}
                      onSelect={this.onSelectColor.bind(this)}
                      onDeselect={this.onDeselectColor.bind(this)}
                      defaultValut={filter.condition.color}
                    >
                      <Option key="黑色">黑色</Option>
                      <Option key="深灰">深灰</Option>
                      <Option key="银色">银色</Option>
                      <Option key="浅灰">浅灰</Option>
                      <Option key="灰色">灰色</Option>
                      <Option key="深棕">深棕</Option>
                      <Option key="浅棕">浅棕</Option>
                      <Option key="棕色">棕色</Option>
                      <Option key="咖啡">咖啡</Option>
                      <Option key="卡其">卡其</Option>
                      <Option key="藏青">藏青</Option>
                      <Option key="蓝色">蓝色</Option>
                      <Option key="墨绿">墨绿</Option>
                      <Option key="军绿">军绿</Option>
                      <Option key="深绿">深绿</Option>
                      <Option key="浅绿">浅绿</Option>
                      <Option key="绿色">绿色</Option>
                      <Option key="土黄">土黄</Option>
                      <Option key="黄色">黄色</Option>
                      <Option key="金色">金色</Option>
                      <Option key="米黄">米黄</Option>
                      <Option key="紫色">紫色</Option>
                      <Option key="淡紫">淡紫</Option>
                      <Option key="深紫">深紫</Option>
                      <Option key="红色">红色</Option>
                      <Option key="深红">深红</Option>
                      <Option key="粉红">粉红</Option>
                      <Option key="粉蓝">粉蓝</Option>
                      <Option key="橙色">橙色</Option>
                      <Option key="淡橙">淡橙</Option>
                      <Option key="彩虹">彩虹</Option>
                      <Option key="白色">白色</Option>
                      <Option key="裸色">裸色</Option>
                      <Option key="透明">透明</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="选面料" style={{ width: "100%"}}
                            labelCol={{
                              span: 2
                            }}
                            wrapperCol={{
                              span: 21
                            }}
                  >
                    <Select
                      mode="multiple"
                      defaultValue="面料都有啥，有点懵逼"
                      style={{ width: "100%" }}
                      tokenSeparators={[",", "/"]}
                    >
                      <OptGroup label="Manager">
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                      </OptGroup>
                      <OptGroup label="Engineer">
                        <Option value="Yiminghe">yiminghe</Option>
                      </OptGroup>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="选品牌" style={{ width: "100%"}}
                            labelCol={{
                              span: 2
                            }}
                            wrapperCol={{
                              span: 21
                            }}
                  >
                    <Select
                      mode="multiple"
                      defaultValue="需要中文么？"
                      style={{ width: "100%" }}
                      tokenSeparators={[",", "/"]}
                    >
                      <Option key="Aileier">Aileier</Option>
                      <Option key="And">And</Option>
                      <Option key="Appaman">Appaman</Option>
                      <Option key="Baby boden">Baby boden</Option>
                      <Option key="Barque">Barque</Option>
                      <Option key="?Biscotti and ...?">?Biscotti and ...?</Option>
                      <Option key="Boboli">Boboli</Option>
                      <Option key="?Bottega Bambi...">?Bottega Bambi..</Option>
                      <Option key="Calibeth">Calibeth</Option>
                      <Option key="Chaboukie">Chaboukie</Option>
                      <Option key="Dala">Dala</Option>
                      <Option key="Davida">Davida</Option>
                      <Option key="Doe a Dear">Doe a Dear</Option>
                      <Option key="?Dolls and Div...">?Dolls and Div...</Option>
                      <Option key="Dong Da Meng">Dong Da Meng</Option>
                      <Option key="Dorga">Dorga</Option>
                      <Option key="Dorissa Girl">Dorissa Girl</Option>
                      <Option key="Du Pareil">Du Pareil</Option>
                      <Option key="?Du praeil au...">?Du praeil au...</Option>
                      <Option key="EGG">EGG</Option>
                      <Option key="Elodie">Elodie</Option>
                      <Option key="Eyee">Eyee</Option>
                      <Option key="Flap Happy">Flap Happy</Option>
                      <Option key="Frenchie MC">Frenchie MC</Option>
                      <Option key="Hailey">Hailey</Option>
                      <Option key="Hana Anna">Hana Anna</Option>
                      <Option key="?Holly & B...">?Holly & B...</Option>
                      <Option key="Janie and Jack">Janie and Jack</Option>
                      <Option key="Kinderkind">Kinderkind</Option>
                      <Option key="LaLooLoo">LaLooLoo</Option>
                      <Option key="Little Horn">Little Horn</Option>
                      <Option key="Little Junie">Little Junie</Option>
                      <Option key="Mayoral">Mayoral</Option>
                      <Option key="Mini Boden">Mini Boden</Option>
                      <Option key="Mini Dressing">Mini Dressing</Option>
                      <Option key="Monnalisa">Monnalisa</Option>
                      <Option key="Nena">Nena</Option>
                      <Option key="Next">Next</Option>
                      <Option key="Oba">Oba</Option>
                      <Option key="Pai">Pai</Option>
                      <Option key="Sara Sara">Sara Sara</Option>
                      <Option key="Siaomimi">Siaomimi</Option>
                      <Option key="Sierra Julian">Sierra Julian</Option>
                      <Option key="Standard Issue">Standard Issue</Option>
                      <Option key="Stella Cove">Stella Cove</Option>
                      <Option key="Super Pretty">Super Pretty</Option>
                      <Option key="Ubang">Ubang</Option>
                      <Option key="Wee ones">Wee ones</Option>
                      <Option key="iLuff">iLuff</Option>
                      <Option key="iZar">iZar</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="选元素" style={{ width: "100%"}}
                            labelCol={{
                              span: 2
                            }}
                            wrapperCol={{
                              span: 21
                            }}
                  >
                    <Select
                      mode="tags"
                      defaultValue="lucy"
                      style={{ width: "100%" }}
                      tokenSeparators={[",", "/"]}
                    >
                      <OptGroup label="Manager">
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                      </OptGroup>
                      <OptGroup label="Engineer">
                        <Option value="Yiminghe">yiminghe</Option>
                      </OptGroup>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify='end' gutter={16}>
                <Col>
                  <Button type="primary" onClick={this.handleCleanFilter}>清 空</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={this.handleFilter}>过 滤</Button>
                </Col>
                {/*隐藏功能*/}
                {/*<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>*/}
                {/*Collapse <Icon type={this.state.expand ? 'up' : 'down'} />*/}
                {/*</a>*/}
              </Row>
          </Form>
        </div>
        <Row gutter={32} className='card-stage'>
          {
            filter.result.map((record, index) => {
             return (
               <Col span={12} sm={6} key={index}>
                 <Card style={{margin: "10px 0"}} loading={filter.isFetching} bodyStyle={{padding: 0}} bordered={false} key={index}>
                   <div className="custom-image" >
                     <img alt="example" width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                   </div>
                   <div className="custom-card">
                     <h3>{record.item_no}</h3>
                     <p>{record.fabric}</p>
                     <p>零售价：<span style={{color: "rgb( 121, 16, 57)", fontWeight: 900}}>{record.price}</span></p>
                   </div>
                 </Card>
               </Col>
             )

            })
          }
        </Row>
      </div>
    );
  };
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