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
      // .then(res => res.text())
      // .then(res => this.setState({ apiResponse: res }))
      // .catch(err => err);
  }

  componentDidMount() {
    this._asyncRequest = this.callAPI().then(externalData => externalData.text()).then(res => {
      this._asyncRequest = null;
      this.setState({apiResponse: res});
    })
  }
    // this.callAPI();
  // }

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