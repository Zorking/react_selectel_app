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
    axios.post('https://itjustworks.me:8443/servers/detail/?viewer_id=1', this.props.server, {'headers':{'Authorization':'123'}})
      .then((response) => {
      let qwer = Object.assign({}, response.data, this.props.server);
        this.setState({serverDetail: qwer});
      })
  }
  runAction(actionName){
    axios.post('https://itjustworks.me:8443/servers/' + this.props.server.id + '/' + actionName, {'project_name': this.props.server.project_name}, {'headers':{'Authorization':'123'}})
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
    };
  }

  componentWillMount() {
    this.getServers();
  }

  getServers() {
    axios.get('https://itjustworks.me:8443/servers/?viewer_id=1', {'headers':{'Authorization':'123'}})
    .then((response) => {
      this.setState({servers: response.data});
    })
  }

  render() {
    return [
      <h1>Servers</h1>,
      <Accordion>
        {this.state.servers.map((s) => <Panels key={s.id} server={s}/>)}
      </Accordion>
    ];
  }
}

export default App;
