
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dropzone from "../component/dropzone";
import "./upload.css";
import Progress from "../component/progress";
import 'whatwg-fetch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableContainer } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 850,
  },
  control: {
    padding: theme.spacing(2),
  },
}));


function Upload() {
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [successfullUploaded, setSuccessfullUploaded] = React.useState(false);
  const [TFpredictions, setTFpredictions] = React.useState([]);
  const [CVpredictions, setCVpredictions] = React.useState([]);
  
  const classes = useStyles();

  React.useEffect(() => {
    console.log(files)
  }, [files]);

  function onFilesAdded(file) {
    const old_files = [...files, ...file];
    setFiles(old_files);
  }


  async function uploadFiles() {
    setUploadProgress({});
    setUploading(true);
    try {
      files.forEach(file => {
        const formData = new FormData();
        formData.append("file", file, file.name);

        fetch('https://vitas-ml-api.azurewebsites.net/api/upload', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(json => {
          setCVpredictions(json.dataCV.top5_customvision)
          setTFpredictions(json.dataTF.top5)
        })
        .catch(err => console.log(err));
      });

      setSuccessfullUploaded(true);
      setUploading(false);
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      setSuccessfullUploaded(true);
      setUploading(false);
    }
  }

  function renderProgress(file) {
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress[file.name] ? uploadProgress[file.name].percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress[file.name] && uploadProgress[file.name].state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  function clear() {
    setFiles([]);
    setSuccessfullUploaded(false);
    setTFpredictions([])
    setCVpredictions([])
  }

  function renderActions() {
    if (successfullUploaded) {
      return (
        <button
          onClick={ clear }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={files.length < 0 || uploading}
          onClick={uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  function renderPredictions() {
    if (TFpredictions.length > 0) {
      return (
        <div style={{ padding: 20 }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>TensorFlow Class</TableCell>
                <TableCell align="right">TensorFlow Prediction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TFpredictions.map((d, idx) => (
                <TableRow key={idx} style={ idx % 2? { background : "#fdffe0" }:{ background : "white" }}>
                  <TableCell component="th" scope="row">
                    {d.class}
                  </TableCell>
                  <TableCell align="right">
                    {parseInt(d.prob * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        
      );
    }
  }

  function renderPredictionsCustomVision() {
    if (CVpredictions.length > 0) {
      return (
        <div style={{ padding: 20 }}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Custom Vision Class</TableCell>
                  <TableCell align="right">Custom Vision Prediction</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {CVpredictions.map((d, idx) => (
                <TableRow key={idx} style={ idx % 2? { background : "#fdffe0" }:{ background : "white" }}>
                  <TableCell component="th" scope="row">
                    {d.class}
                  </TableCell>
                  <TableCell align="right">
                    {parseInt(d.prob * 100)}%
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        
      );
    }
  }

  return(
    <React.Fragment>
      {/* Dropzone */}
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        {!files.length && (
          <Dropzone
            onFilesAdded={onFilesAdded}
            disabled={uploading || successfullUploaded}
          />
        )}
      </Grid>
      
      {/* Image preview */}
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        {files.map(file => {
          return(
            <Grid key={file.name} item xs={3}> 
              <img src={URL.createObjectURL(file)} alt="" width='300px' height='300px'/>
              <span className='fileName'>{file.name}</span>
              {renderProgress(file)}
            </Grid>
          )
        })}
      </Grid>
      
      {/* Machine learning predictions */}
        <Grid container spacing={0} direction="column" alignItems="center" justify="center">
          {renderPredictions()}
        </Grid>

        <Grid container spacing={0} direction="column" alignItems="center" justify="center">
          {renderPredictionsCustomVision()}
        </Grid>
      
      
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <div style={{ padding: 20 }}>{renderActions()}</div>
        {/* <div className="Actions">{renderActions()}</div> */}
      </Grid>
      
    </React.Fragment>
  );
}

export default Upload;
