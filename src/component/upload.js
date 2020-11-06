import React from "react";
import Dropzone from "../component/dropzone";
import "./upload.css";
import Progress from "../component/progress";
import 'whatwg-fetch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';



class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      TFpredictions: [],
      CVpredictions: []
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderPredictions = this.renderPredictions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    try {
      this.state.files.forEach(file => {
        const formData = new FormData();
        formData.append("file", file, file.name);

        fetch('http://localhost:9000/upload', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(json => {
          this.setState({TFpredictions: json.dataTF.top5 })
          this.setState({CVpredictions: json.dataCV.top5_customvision})
        })
        .catch(err => console.log(err));
      });
      
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  renderPredictions() {
    if (this.state.TFpredictions.length > 0 || this.state.CVpredictions.length > 0) {
      return (
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>TensorFlow Class</TableCell>
                <TableCell>TensorFlow Prediction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.TFpredictions.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell>{d.class}</TableCell>
                  <TableCell>{parseInt(d.prob * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      );
    }
  }

  renderPredictionsCustomVision() {
    if (this.state.TFpredictions.length > 0 || this.state.CVpredictions.length > 0) {
      return (
        <Table>
            <TableHead>
              <TableRow>
                <TableCell>Custom Vision Class</TableCell>
                <TableCell>Custom Vision Prediction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.CVpredictions.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell>{d.class}</TableCell>
                  <TableCell>{parseInt(d.prob * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      );
    }
  }

  

  render() {
    return (
      // <div>
      //   {/* <span className="Title">Upload Files</span> */}
      //   <div>
      //     <div>
      //       <Dropzone
      //         onFilesAdded={this.onFilesAdded}
      //         disabled={this.state.uploading || this.state.successfullUploaded}
      //       />
      //     </div>
      //     <div className="Files">
      //       {this.state.files.map(file => {
      //         return (
      //           <div key={file.name} className="Row">
                  
      //             <span className="Filename">{file.name}</span>
      //             {this.renderProgress(file)}
      //           </div>
      //         );
      //       })}
      //     </div>      
      //   </div>
      //   <div className="Actions">{this.renderActions()}</div>
      //   <div>
      //       {this.state.files.map(file => {
      //         return (
      //             <img key={file.name} src={URL.createObjectURL(file)} alt='' />
      //           );
      //       })}
      //   </div>
      //   {this.renderPredictions()}
      //   {this.renderPredictionsCustomVision()}
      // </div>
      <div className='root'>
        <CssBaseline />

        <main className='content'>
          
          <div className='appBarSpacer' />
          <Container maxWidth="lg" className='container'>
            
            <Grid container spacing={3}>

              <Grid item xs={12} md={8} lg={9}>
                <Paper className='paper; fixedHeight'>
                  {/* <Chart /> */}
                    <Dropzone
                      onFilesAdded={this.onFilesAdded}
                      disabled={this.state.uploading || this.state.successfullUploaded}
                    />
                    {this.state.files.map(file => {
                      return (
                        <div key={file.name} className="Row">
                          
                          <span className="Filename">{file.name}</span>
                          {this.renderProgress(file)}
                        </div>
                      );
                    })}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper className='paper; fixedHeight'>
                  {/* <Deposits /> */}
                  {this.state.files.map(file => {
                    return (
                        <img key={file.name} src={URL.createObjectURL(file)} alt='' />
                      );
                  })}
                </Paper>
                <div className="Actions">{this.renderActions()}</div>
              </Grid>

              <Grid item xs={12}>
                <Paper className='paper'>
                  {/* <Orders /> */}
                  {this.renderPredictions()}
                  {this.renderPredictionsCustomVision()}
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              {/* <Copyright /> */}
            </Box>
          </Container>
        </main>
    </div>
    );
  }
}

export default Upload;
