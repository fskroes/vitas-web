import './App.css';
import React from 'react';
import Upload from './component/upload'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiResponse: '',
      apiModelResponse: ''
    };
  }

  callAPI() {
    fetch('http://localhost:9000/testAPI')
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }

  componentWillMount() {
    this.callAPI();
  }

  render() {
    return (
      <div className="App">
        <p className='App-intro'>
          {this.state.apiResponse}
          {this.state.apiModelResponse}
        </p>
        <div className="Card">
          <Upload />
        </div>
      </div>
    );
  }
}

export default App;