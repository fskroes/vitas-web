
import React from 'react';
import clsx from 'clsx';
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




const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
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
  const [, setOpen] = React.useState(true);
  
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

        fetch('http://localhost:9000/upload', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(json => {
          // Opmerking Tjardo: setState is een async functie; let hierom op dat je de state niet  meerdere malen tergelijkertijd update!.
          // Ik heb onderstaand 1 setState gemaakt van de twee die er stonden.
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
    // const uploadProgress = uploadProgress[file.name];
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
        <Paper className="paper">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>TensorFlow Class</TableCell>
                <TableCell>TensorFlow Prediction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TFpredictions.map((d, idx) => (
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

  function renderPredictionsCustomVision() {
    if (CVpredictions.length > 0) {
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
              {CVpredictions.map((d, idx) => (
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

  return(
    <div>
      {/* Dropzone */}
      <Grid container spacing={3}>
        {!files.length && (
          <Dropzone
            onFilesAdded={onFilesAdded}
            disabled={uploading || successfullUploaded}
          />
        )}
      </Grid>
      
      {/* Image preview */}
      <Grid container spacing={3} item xs={12} md={4} center={'auto'}>
        {files.map(file => {
          return(
          <div key={file.name} className="imgContainer">
            <img src={URL.createObjectURL(file)} alt="" />
            <span className="Filename">{file.name}</span>
            
            {renderProgress(file)}
          </div>
          )
        })}
      </Grid>
      
      {/* Machine learning predictions */}
      <Grid>
        {renderPredictions()}
        {renderPredictionsCustomVision()}
      </Grid>
      
      
      <div className="Actions">{renderActions()}</div>
    </div>
  );
}


// class Upload extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       files: [],
//       uploading: false,
//       uploadProgress: {},
//       successfullUploaded: false,
//       TFpredictions: [],
//       CVpredictions: []
//     };

//     /**
//      * Opmerking Tjardo: binden hoeft niet mits je arrow functions gebruikt (zie onFilesAdded).
//      * Arrow functions zijn ES6 (javascript 6) die 'this' niet bindt aan de scope van de functie zelf.
//      * ES6 is momenteel niet ondersteund door browsers; frameworks zoals React gebruiken een polyfill voor ES6.
//      */
//     // this.onFilesAdded = this.onFilesAdded.bind(this);

//     this.uploadFiles = this.uploadFiles.bind(this);
//     this.renderActions = this.renderActions.bind(this);
//     this.renderPredictions = this.renderPredictions.bind(this);
//   }

//   onFilesAdded = (files) => {
//     this.setState(prevState => ({
//       files: prevState.files.concat(files)
//     }));
//   }

//   async uploadFiles() {
//     this.setState({ uploadProgress: {}, uploading: true });
//     try {
//       this.state.files.forEach(file => {
//         const formData = new FormData();
//         formData.append("file", file, file.name);

//         fetch('http://localhost:9000/upload', {
//           method: 'POST',
//           body: formData
//         })
//         .then(res => res.json())
//         .then(json => {
//           // Opmerking Tjardo: setState is een async functie; let hierom op dat je de state niet  meerdere malen tergelijkertijd update!.
//           // Ik heb onderstaand 1 setState gemaakt van de twee die er stonden.
//           this.setState({TFpredictions: json.dataTF.top5, CVpredictions: json.dataCV.top5_customvision })
//         })
//         .catch(err => console.log(err));
//       });

//       this.setState({ successfullUploaded: true, uploading: false });
//     } catch (e) {
//       // Not Production ready! Do some error handling here instead...
//       this.setState({ successfullUploaded: true, uploading: false });
//     }
//   }

//   renderProgress(file) {
//     const uploadProgress = this.state.uploadProgress[file.name];
//     if (this.state.uploading || this.state.successfullUploaded) {
//       return (
//         <div className="ProgressWrapper">
//           <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
//           <img
//             className="CheckIcon"
//             alt="done"
//             src="baseline-check_circle_outline-24px.svg"
//             style={{
//               opacity:
//                 uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
//             }}
//           />
//         </div>
//       );
//     }
//   }

//   renderActions() {
//     if (this.state.successfullUploaded) {
//       return (
//         <button
//           onClick={() =>
//             this.setState({ files: [], successfullUploaded: false })
//           }
//         >
//           Clear
//         </button>
//       );
//     } else {
//       return (
//         <button
//           disabled={this.state.files.length < 0 || this.state.uploading}
//           onClick={this.uploadFiles}
//         >
//           Upload
//         </button>
//       );
//     }
//   }

//   renderPredictions() {
//     if (this.state.TFpredictions.length > 0) {
//       return (
//         <Paper className="paper">
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>TensorFlow Class</TableCell>
//                 <TableCell>TensorFlow Prediction</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {this.state.TFpredictions.map((d, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{d.class}</TableCell>
//                   <TableCell>{parseInt(d.prob * 100)}%</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>
//       );
//     }
//   }

//   renderPredictionsCustomVision() {
//     if (this.state.CVpredictions.length > 0) {
//       return (
//         <Paper className="paper">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Custom Vision Class</TableCell>
//                 <TableCell>Custom Vision Prediction</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {this.state.CVpredictions.map((d, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{d.class}</TableCell>
//                   <TableCell>{parseInt(d.prob * 100)}%</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>
//       );
//     }
//   }

//   render() {
//     return (
//       <div className="root">
//         <CssBaseline />

//         <main className="content">

//           <div className="appBarSpacer"></div>

//           <Container maxWidth="lg" className="container">
//             {!this.state.files.length && (
//               <Paper className="paper fixedHeight">
//                 <Dropzone
//                   onFilesAdded={this.onFilesAdded}
//                   disabled={this.state.uploading || this.state.successfullUploaded}
//                 />
//               </Paper>
//             )}

//             {!!this.state.files.length && (
//               <div className={(this.state.TFpredictions.length || this.state.CVpredictions.length) ? 'flex' : ''}>
//                 <div className="left">
//                   <Paper className="paper images">
//                     {this.state.files.map(file => {
//                       return (
//                         <div key={file.name} className="imgContainer">
//                           <img src={URL.createObjectURL(file)} alt="" />
//                           <span className="Filename">{file.name}</span>
//                           {this.renderProgress(file)}
//                         </div>
//                       );
//                     })}
//                   </Paper>
//                 </div>
//                 <div className="right">
//                   {this.renderPredictions()}
//                   {this.renderPredictionsCustomVision()}
//                 </div>
//               </div>
//             )}

//             <div className="Actions">{this.renderActions()}</div>
//           </Container>
//         </main>
//       </div>
//     );
//   }
// }

export default Upload;
