import React from "react";
import Dropzone from "../component/dropzone";
import "./upload.css";
import Progress from "../component/progress";
import 'whatwg-fetch'


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
    // this.sendRequest = this.sendRequest.bind(this);
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
    // const promises = [];
    // this.state.files.forEach(file => {
    //   promises.push(this.sendRequest(file));
    // });
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
      


      // await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  // sendRequest(file) {
  //   return new Promise((resolve, reject) => {
  //     const req = new XMLHttpRequest();

  //     req.upload.addEventListener("progress", event => {
  //       if (event.lengthComputable) {
  //         const copy = { ...this.state.uploadProgress };
  //         copy[file.name] = {
  //           state: "pending",
  //           percentage: (event.loaded / event.total) * 100
  //         };
  //         this.setState({ uploadProgress: copy });
  //       }
  //     });

  //     req.upload.addEventListener("load", event => {
  //       const copy = { ...this.state.uploadProgress };
  //       copy[file.name] = { state: "done", percentage: 100 };
  //       this.setState({ uploadProgress: copy });
  //       resolve(req.response);
  //     });

  //     req.upload.addEventListener("error", event => {
  //       const copy = { ...this.state.uploadProgress };
  //       copy[file.name] = { state: "error", percentage: 0 };
  //       this.setState({ uploadProgress: copy });
  //       reject(req.response);
  //     });

  //     const formData = new FormData();
  //     formData.append("file", file, file.name);

  //     req.open("POST", "http://localhost:9000/upload");
  //     req.send(formData);
  //   });
  // }

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
        <div>
          TensorFlow predictions: 
          {this.state.TFpredictions.map(function(d, idx){
            return (<li key={idx}>Class: {d.class} - probability: {(d.prob * 100)}</li>)
          })}
          
          Custom Vision predictions: 
          {this.state.CVpredictions.map(function(d, idx){
            return (<li key={idx}>Class: {d.class} - probability: {(d.prob * 100)}</li>)
          })}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="Upload">
        <span className="Title">Upload Files</span>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => {
              return (
                <div key={file.name} className="Row">
                  
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>      
        </div>
        <div className="Actions">{this.renderActions()}</div>
        <div>
            {this.state.files.map(file => {
              return (
                  <img key={file.name} src={URL.createObjectURL(file)} alt='' />
                );
            })}
        </div>
        {this.renderPredictions()}
      </div>
    );
  }
}

export default Upload;
