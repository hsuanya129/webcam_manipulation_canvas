import React from 'react';
import './App.css';
import Webcam from './components/webcam';
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Webcam />
      </div>
    );
  }
}

export default App;
