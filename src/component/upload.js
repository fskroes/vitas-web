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

    /**
     * Opmerking Tjardo: binden hoeft niet mits je arrow functions gebruikt (zie onFilesAdded).
     * Arrow functions zijn ES6 (javascript 6) die 'this' niet bindt aan de scope van de functie zelf.
     * ES6 is momenteel niet ondersteund door browsers; frameworks zoals React gebruiken een polyfill voor ES6.
     */
    // this.onFilesAdded = this.onFilesAdded.bind(this);

    this.uploadFiles = this.uploadFiles.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderPredictions = this.renderPredictions.bind(this);
  }

  onFilesAdded = (files) => {
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
          // Opmerking Tjardo: setState is een async functie; let hierom op dat je de state niet  meerdere malen tergelijkertijd update!.
          // Ik heb onderstaand 1 setState gemaakt van de twee die er stonden.
          this.setState({TFpredictions: json.dataTF.top5, CVpredictions: json.dataCV.top5_customvision })
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
    if (this.state.TFpredictions.length > 0) {
      return (
        <Paper className="paper">
          <Table size="small">
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
        </Paper>
      );
    }
  }

  renderPredictionsCustomVision() {
    if (this.state.CVpredictions.length > 0) {
      return (
        <Paper className="paper">
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
        </Paper>
      );
    }
  }

  render() {
    return (
      <div className="root">
        <CssBaseline />

        <main className="content">

          <div className="appBarSpacer"></div>

          <Container maxWidth="lg" className="container">
            {!this.state.files.length && (
              <Paper className="paper fixedHeight">
                <Dropzone
                  onFilesAdded={this.onFilesAdded}
                  disabled={this.state.uploading || this.state.successfullUploaded}
                />
              </Paper>
            )}

            {!!this.state.files.length && (
              <div className={(this.state.TFpredictions.length || this.state.CVpredictions.length) ? 'flex' : ''}>
                <div className="left">
                  <Paper className="paper images">
                    {this.state.files.map(file => {
                      return (
                        <div key={file.name} className="imgContainer">
                          <img src={URL.createObjectURL(file)} alt="" />
                          <span className="Filename">{file.name}</span>
                          {this.renderProgress(file)}
                        </div>
                      );
                    })}
                  </Paper>
                </div>
                <div className="right">
                  {this.renderPredictions()}
                  {this.renderPredictionsCustomVision()}
                </div>
              </div>
            )}

            <div className="Actions">{this.renderActions()}</div>
          </Container>
        </main>
      </div>
    );
  }
}

export default Upload;
