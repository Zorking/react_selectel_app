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
  ButtonToolbar
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
    axios.post('https://itjustworks.me:8443/servers/detail/?viewer_id=1', this.props.server, {'headers': {'Authorization': '123'}})
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

  runAction(actionName) {
    axios.post('https://itjustworks.me:8443/servers/' + this.props.serverDetail.id + '/' + actionName,
      JSON.stringify({project_name: this.props.serverDetail.projectName}),
      {'headers': {'Authorization': '123', 'Content-Type': 'application/json'}}
    )
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
          <Button bsStyle="danger" onClick={() => this.runAction('reboot/hard/?viewer_id=1')}>Hard Reboot</Button>
          <Button bsStyle="warning" onClick={() => this.runAction('reboot/soft/?viewer_id=1')}>Soft Reboot</Button>
          <Button bsStyle="warning" onClick={() => this.runAction('pause/?viewer_id=1')}>Pause</Button>
          <Button bsStyle="success" onClick={() => this.runAction('unpause/?viewer_id=1')}>Unpause</Button>
          <Button bsStyle="success" onClick={() => this.runAction('start/?viewer_id=1')}>Start</Button>
          <Button bsStyle="danger" onClick={() => this.runAction('stop/?viewer_id=1')}>Stop</Button>
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
    axios.get('https://itjustworks.me:8443/servers/?viewer_id=1', {'headers': {'Authorization': '123'}})
      .then((response) => {
        this.setState({servers: response.data});
      })
  }

  render() {
    return [
      <h1>Сервера</h1>,
      <Accordion>
        {this.state.servers.map((s) => <Panels server={s}/>)}
      </Accordion>
    ];
  }
}

export default App;
