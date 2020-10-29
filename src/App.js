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
    return fetch('http://localhost:9000/testAPI')
  }

  // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  componentDidMount() {
    this._asyncRequest = this.callAPI().then(externalData => externalData.text()).then(res => {
      this._asyncRequest = null;
      this.setState({apiResponse: res});
    })
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
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