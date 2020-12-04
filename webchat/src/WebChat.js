import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

let client = null;

class WebChat extends React.Component {

  constructor(props) {
    super(props);
    this.usersList = [];
  }

  onMessage() {

  }

  onNewUser() {

  }

  onUserExit() {

  }

  connect() {
    client = new W3CWebSocket(config.websocketAddress);
    client.onopen = () => {
      console.log('Connected to Websocket');
      client.send(JSON.stringify({action: 'register', userName: localStorage.getItem('userName')}));      
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.action) {
        
      }
    };
    client.onclose = (() => this.connect());
  }

  componentDidMount() {
    this.connect();
  }

  render() {

  }

}

export default WebChat;