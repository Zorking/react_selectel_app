import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {
  Table,
  Button,
  FormControl,
  Glyphicon,
  Panel,
  Accordion,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import Metric from "./Metric";


class Panels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      serverDetail: [],
    };
  }
  getServerDetail() {
    axios.post('https://itjustworks.me:8443/servers/detail/?viewer_id=1', this.props.server, {'headers':{'Authorization':this.props.token}})
      .then((response) => {
      let qwer = Object.assign({}, response.data, this.props.server);
        this.setState({serverDetail: qwer});
      })
  }
  runAction(actionName){
    axios.post('https://itjustworks.me:8443/servers/' + this.props.server.id + '/' + actionName, {'project_name': this.props.server.project_name}, {'headers':{'Authorization':this.props.token}})
      .then((response) => {
        console.log('Done')
      })
  }

  render() {
    const server = this.props.server;

    return (
      <div>
        <Panel collapsible header={<div>
          <h4 onClick={() => {this.setState({showDetail: !this.state.showDetail}); this.getServerDetail()} }>
            <Glyphicon
              title={server.status}
              className={server.status === 'active' ? 'green' : 'red'}
              glyph={server.status === 'active' ? 'ok-circle' : 'ban-circle'}
            /> {server.serverName}
            <small>({server.tags.join(', ')})</small>
          </h4>
          <DropdownButton bsStyle='Danger' title='Actions'>
            <MenuItem onClick={() => this.runAction('reboot/hard/?viewer_id=1')}>Hard Reboot</MenuItem>
            <MenuItem >Soft Reboot</MenuItem>
            <MenuItem >Pause</MenuItem>
            <MenuItem >Unpause</MenuItem>
            <MenuItem >Start</MenuItem>
            <MenuItem >Stop</MenuItem>
          </DropdownButton>
        </div>
        }>
          {this.state.showDetail && <ServerTable serverDetail={this.state.serverDetail}/>}
        </Panel>
      </div>
    )
  }
}

class ServerTable extends Component {
  render() {
    const serverDetail = this.props.serverDetail;
    return (
      <Table>
        <tbody>
        <tr>
          <td><Glyphicon glyph='tag'>{serverDetail.id}</Glyphicon></td>
          <td>{serverDetail.region_name}</td>
        </tr>
        <tr>
          <td>{serverDetail.os}</td>
          <td></td>
        </tr>
        <tr>
          <td>{serverDetail.cpus} vCPU, Память {serverDetail.ram} МБ</td>
          <td></td>
        </tr>
        </tbody>
      </Table>
    )
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      token: null,
    };
  }

  componentWillMount() {
    this.getToken();
    this.getServers();
  }

  async getToken() {
    let token = await localStorage.getItem('token');
    if (!!token) this.setState({token: token});
  }

  getServers() {
    axios.get('https://itjustworks.me:8443/servers/?viewer_id=1', {'headers':{'Authorization':this.state.token}})
    .then((response) => {
      this.setState({servers: response.data});
    })
  }

  render() {
    console.log(this.state.token);
    if (!this.state.token) {
      return <Login/>
    } else {
      return [
        <h1>Servers</h1>,
        <Accordion>
          {this.state.servers.map((s) => <Panels token={this.state.token} key={s.id} server={s}/>)}
        </Accordion>
      ];
    }
  }
}

export default App;


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: '',
    };
    this.login.bind(this);
  }

  login() {
    axios.post('https://itjustworks.me:8443/register/'+window.location.search, {'api_token': this.state.apiKey})
    .then((response) => localStorage.setItem('token', response.data.token))
  }

  render() {
    return (
      <div>
        <FormControl
          type="text"
          value={this.state.apiKey}
          placeholder="Enter API-KEY"
          onChange={(e) => this.setState({ apiKey: e.target.value })}
        >
        </FormControl>
        <Button bsStyle="primary" onClick={()=>this.login()}>Login</Button>
      </div>
    )
  }
}