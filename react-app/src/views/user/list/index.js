import React, {Component} from 'react';
import {Table, Modal, message, Button, Form, Input, Icon} from 'antd';
import {fetchUserList, deleteOneUser, saveUser} from '../../../api/user';
import SidebarLayout from '../../layout/sidebarLayout';

const confirm = Modal.confirm;
const Search = Input.Search;

class UserForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <Form className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Password" />
            )}
          </Form.Item>
        </Form>

    )
  }
}

function mapPropsToFields(props) {
  return {
    username: Form.createFormField({
      value: props.selectUser ? props.selectUser.username : '',
    }),
    password: Form.createFormField({
      value: props.selectUser ? props.selectUser.password : '',
    })
  }
}

const UserFormComponent = Form.create({mapPropsToFields})(UserForm);


class UserFormModal extends Component {
  constructor() {
    super()

    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }
  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    let self = this

    this.setState({
      confirmLoading: true
    });

    this.refs.UserForm.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        saveUser({
          id: self.props.selectUser ? self.props.selectUser.id : null,
          ...values
        }).then(() => {
          message.success('保存成功')

          self.setState({
            visible: false,
            confirmLoading: false,
          });

          self.props.getUserList()
        }).catch(() => {
          self.setState({
            confirmLoading: false
          });
        })
      } else {
        self.setState({
          confirmLoading: false
        });
      }
    });
  }

  handleCancel() {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
        <Modal
            title="Edit"
            visible={this.state.visible}
            onOk={this.handleOk.bind(this)}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel.bind(this)}
        >
          <UserFormComponent selectUser={this.props.selectUser} ref='UserForm'></UserFormComponent>
        </Modal>

    )
  }
}


class UserList extends Component {
  constructor() {
    super()

    this.state = {
      selectUser: null,
      params: {
        keyword: '',
        currentPage: 1,
        pageSize: 10
      },
      data: {
        list: [],
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getList()
  }

  showModal(user) {
    this.setState({
      selectUser: user
    })
    this.refs.UserFormModal.showModal()
  }



  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'username',
    }, {
      title: 'Password',
      dataIndex: 'password',
    }, {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record, index) => {
        return (
            <span>
              <a onClick={this.deleteUser.bind(this, record, index)} style={{marginRight: '10px'}}>delete</a>
              <a onClick={this.showModal.bind(this, record, index)}>update</a>
            </span>
        )
      },
    }];
    return (
        <SidebarLayout>
          <div className="App">

            <UserFormModal ref='UserFormModal' selectUser={this.state.selectUser}  getUserList={this.getList.bind(this)}></UserFormModal>

            <Search
                placeholder="input keyword"
                onSearch={this.onSearch.bind(this)}
                style={{ width: 200, marginRight: 10 }}
            />
            <Button type="primary" onClick={this.showModal.bind(this, null)} style={{marginBottom: '10px'}}>add</Button>
            <Table dataSource={this.state.data.list} columns={columns} pagination={{total: this.state.data.total, showTotal : total => `Total ${total} items`, onChange: this.pageChange.bind(this)}}/>

          </div>
        </SidebarLayout>
    );
  }

  onSearch (val) {
    this.state.params.keyword = val
    this.setState({
      params: this.state.params
    })
    this.getList()
  }

  getList() {
    fetchUserList(this.state.params).then((res) => {
      this.setState({
        data: res.data
      })
    })
  }

  pageChange(val){
    this.state.params.currentPage = val
    this.setState({
      params: this.state.params
    })
    this.getList()
  }

  deleteUser(record, index) {
    confirm({
      title: 'Do you Want to delete these items?',
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        deleteOneUser({id: record.id}).then((data) => {
          message.success('删除成功')
          this.getList()
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }
}

export default UserList;
