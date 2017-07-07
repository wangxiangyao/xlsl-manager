import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import Navigation from '../component/Nav';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import ordersListStage from '../containers/ListStage/ordersListStage.js';
import goodsListStage from '../containers/ListStage/goodsListStage.js';
import adminsListStage from '../containers/ListStage/adminsListStage.js';
import xinanListStage from '../containers/ListStage/xinanListStage.js';
import configureStore from '../stores';

const store = configureStore()
const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Layout className="layout">
            <Header>
              <Navigation/>
            </Header>
            <Content style={{ padding: "10px 20px 0" }}>
              <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
                <Route exact path="/" render={() => (<Redirect to="/orders"/>)} />
                <Route exact path="/orders" component={ordersListStage}/>
                {/*<Route exact path="/goods" component={goodsListStage}/>*/}
                {/*<Route exact path="/admins" component={adminsListStage}/>*/}
                <Route exact path="/xinan" component={xinanListStage}/>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              小鹿森林 ©2016-2017 page Created by wxy
            </Footer>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
