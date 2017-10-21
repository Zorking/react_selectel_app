import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {
  Table,
  // Button,
  // Label,
  Glyphicon,
  Panel,
  Accordion,
} from 'react-bootstrap';

const servers = [{
  'id': '442d3f41-7204-477d-bc9e-4de6c55717bd',
  'serverName': 'Deidre',
  'tags': [],
  'projectName': 'Freya',
  'region_name': 'ru-1',
  'image_id': '210f6963-58c0-4607-b657-887597fb90fa',
  'description': 'Deidre',
  'flavor_id': 'f3528e1a-973a-4128-b961-ea13d4ce07f7',
  'ip': '192.168.0.4',
  'volume_id': '5b567559-ebf2-438e-bca4-0eb3f914c795'
}, {
  'id': 'f883c690-a797-4de7-84a8-846058296560',
  'serverName': 'Catherine',
  'tags': [],
  'projectName': 'it_works',
  'region_name': 'ru-1',
  'image_id': '210f6963-58c0-4607-b657-887597fb90fa',
  'description': 'Catherine',
  'flavor_id': '051d0688-5dfc-41e1-bfec-0eefad0b4e33',
  'ip': '192.168.0.4',
  'volume_id': 'eb151d58-b238-457f-a05b-9e605898ec49'
}, {
  'id': 'f6a56cf4-d02a-49c7-a555-1b887ac96df9',
  'serverName': 'Vitalik',
  'tags': ['asd', 'jjj', 'tes8t'],
  'projectName': 'it_works',
  'region_name': 'ru-1',
  'image_id': '210f6963-58c0-4607-b657-887597fb90fa',
  'description': 'Fuking good Server',
  'flavor_id': '0487332d-ac86-4c8f-a05c-b068c21e68f8',
  'ip': '77.244.216.218',
  'volume_id': '52679d68-a2f6-4da7-baa4-ed23dae3ba5c'
}];
const panels = (server) => {
  return (
    <div>
      <Panel collapsible header={
        <h4>
          <Glyphicon
            title={server.status}
            className={server.status === 'active' ? 'green' : 'red'}
            glyph={server.status === 'active' ? 'ok-circle' : 'ban-circle'}
          /> {server.serverName}
          <small>({server.tags.join(', ')})</small>
        </h4>
      }>
        <Table>
          <tbody>
          <tr>
            <td><Glyphicon glyph='tag'>{server.id}</Glyphicon></td>
            <td>{server.region}</td>
          </tr>
          <tr>
            <td>{server.os}</td>
            <td>{server.dataCenter}</td>
          </tr>
          <tr>
            <td>{server.cpus} vCPU, Память {server.ram} МБ</td>
            <td>{server.addr}</td>
          </tr>
          </tbody>
        </Table>
      </Panel>

    </div>
  )
};
const accordion = (panels) => {
  return (<Accordion>{panels}</Accordion>)
};
const base = (
  <h1>Servers</h1>
);

class App extends Component {
  render() {
    return [
      base,
      accordion(servers.map((server) => panels(server)))
    ];
  }
}

export default App;
