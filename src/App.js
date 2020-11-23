import './App.css';
import React from 'react';
import Upload from './component/upload';
import Header from './component/header';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Footer from './component/footer';

function App() {
  const [isAPIAlive, setApiAlive] = React.useState(false);

  React.useEffect(() => {
    fetch('http://localhost:9000/testAPI')
      .then(res => res.text())
      .then(() => setApiAlive(true))
      .catch(() => setApiAlive(false))
  }, [isAPIAlive]);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    }
  }));

  const classes = useStyles();



  if (!isAPIAlive) return <p>API is alive.</p>
  return(
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container container maxWidth="auto" className={classes.container}>

            <Upload />

          </Container>
        </main>
      </div>
      <Footer title='Footer' description="Something here to give the footer a purpose!"/>
    </React.Fragment>
  )
}

export default App;