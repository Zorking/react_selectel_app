import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {
  Table,
  Button,
  // Label,
  Glyphicon,
  Panel,
  Accordion,
  DropdownButton,
  MenuItem,
  ButtonToolbar,
  FormControl
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
    axios.post('https://itjustworks.me:8443/servers/detail/'+localStorage.getItem('location'), this.props.server, {'headers':{'Authorization':localStorage.getItem('token')}})
      .then((response) => {
        let qwer = Object.assign({}, response.data, this.props.server);
        this.setState({serverDetail: qwer});
      })
  }

  render() {
    const server = this.props.server;

    return (
      <Panel collapsible header={
        <h4 onClick={() => {
          this.setState({showDetail: !this.state.showDetail});
          this.getServerDetail()
        }}>
          <label>Имя сервера:</label> {server.serverName}
          <label>Теги:</label> {server.tags.join(', ')}
          <label>Статус:</label> {server.status}
        </h4>
      }>
        {this.state.showDetail && <ServerTable serverDetail={this.state.serverDetail}/>}
      </Panel>
    )
  }
}

class ServerTable extends Component {
  runAction(actionName){
    axios.post('https://itjustworks.me:8443/servers/' + this.props.server.id + '/' + actionName, {'project_name': this.props.server.project_name}, {'headers':{'Authorization':localStorage.getItem('token')}})
      .then((response) => {
        console.log('Done')
      })
  }
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
        <ButtonToolbar>
          <Button bsStyle="danger" onClick={() => this.runAction('reboot/hard/'+localStorage.getItem('location'))}>Hard Reboot</Button>
          <Button bsStyle="warning" onClick={() => this.runAction('reboot/soft/'+localStorage.getItem('location'))}>Soft Reboot</Button>
          <Button bsStyle="warning" onClick={() => this.runAction('pause/'+localStorage.getItem('location'))}>Pause</Button>
          <Button bsStyle="success" onClick={() => this.runAction('unpause/'+localStorage.getItem('location'))}>Unpause</Button>
          <Button bsStyle="success" onClick={() => this.runAction('start/'+localStorage.getItem('location'))}>Start</Button>
          <Button bsStyle="danger" onClick={() => this.runAction('stop/'+localStorage.getItem('location'))}>Stop</Button>
        </ButtonToolbar>

      </Table>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: [],
    };
  }

  componentWillMount() {
    this.getServers();
  }

  getServers() {
    axios.get('https://itjustworks.me:8443/servers/'+localStorage.getItem('location'), {'headers':{'Authorization':localStorage.getItem('token')}})
    .then((response) => {
      this.setState({servers: response.data});
    }).catch(()=>{ console.log('ups')})
  }

  render() {
    if (!localStorage.getItem('token')) {
      return <Login/>
    } else {
      return [
        <h1>Сервера</h1>,
        <Accordion>
          {this.state.servers.map((s) => <Panels server={s}/>)}
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
  }

  login() {
    axios.post('https://itjustworks.me:8443/register/'+window.location.search, {'api_token': this.state.apiKey})
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('location', window.location.search);
      console.log(response.data.token);
    });
    
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