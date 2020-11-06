import './App.css';
import React from 'react';
import Upload from './component/upload';


function App() {
  const [isAPIAlive, setApiAlive] = React.useState(false);
  const [isAPIModelResponse, setAPIModelResponse] = React.useState(false);

  React.useEffect(() => {
    fetch('http://localhost:9000/testAPI')
      .then(res => res.text())
      .then(res => setApiAlive(true))
      .catch(err => setApiAlive(false))
  }, [isAPIAlive]);

  if (!isAPIAlive) return <p>API is alive.</p>
  return(
    <div className="Card">
      <Upload />
    </div>
  )
}

export default App;