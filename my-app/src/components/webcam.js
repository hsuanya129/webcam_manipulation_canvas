import React from 'react';
import './../App.css';
import Canvas from './canvas';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "", //show messages and indicate the errors -string message
            streamState: "", //indicate current stream is active or not -boolean
            camera: "" //indicate which camera is currently in use -string device's id
        }

        this.camVideo = React.createRef(); //video DOM element
    }

    // after component mounted, set up contraints and start the stream.
    componentDidMount() {

        //reason that make it to member is we'll set device constraint while selecting devices
        this.constraints = {
            audio: false,
            video: {
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080, max: 1080 },
            }
        }
        this.startStream();
    }

    // to end video stream
    endStream = () => {
        this.videoTracks[0].stop();
        this.stream.removeTrack(this.videoTracks[0]);
        this.camVideo.current.srcObject = null;
        this.setState({
            streamState: false,
        });
    }

    // to start a new video stream
    startStream = () => {
        this.getUserMedia();
    }

    // to get videoDevices
    getVideoDevices = () => {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                this.videoDevices = devices.filter((device) => {
                    return (device.kind === "videoinput");
                });

                if (this.videoDevices) {
                    let camera;
                    this.options = this.videoDevices.map((device) => {
                        if (device.label === this.videoTracks[0].label) { //if the deivce is currently in use, save its id to state
                            camera = device.deviceId;
                        }
                        return <option key={device.deviceId} value={device.deviceId} >{device.label}</option> //save devices info, and render them in options 
                    })
                    this.setState({ camera, streamState: true });
                }

            })

            .catch((err) => {
                this.setState({
                    errorMsg: "Error message: " + (err.message ? err.message : err.name)
                });
            })
    }

    // to get media stream
    getUserMedia = () => {
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then((stream) => {
                this.stream = stream;
                this.videoTracks = stream.getVideoTracks();
                this.camVideo.current.srcObject = stream;
                window.camVideo = this.camVideo.current;
                window.videoTracks = this.videoTracks;
                this.getVideoDevices();

            })
            .catch((err) => {
                this.setState({
                    errorMsg: "Error message: " + (err.message ? err.message : err.name)
                });
            })
    }

    // handling changes of camera
    cameraSwitch = (e) => {
        this.constraints.video.deviceId = { exact: e.target.value };
        this.setState({ camera: e.target.value });
        this.endStream();
        this.startStream();
    }

    render() {
        console.log("render");
        let options = this.options;
   
        return (
            <div>
                {this.state.errorMsg ? (<p> {this.state.errorMsg} </p>) :
                    (
                        <div>
                            <video controls={true} className="webcam" ref={this.camVideo} autoPlay playsInline hidden={false}></video>
                            <br />
                            <button onClick={this.startStream} hidden={this.state.streamState}>create stream</button>
                            <button onClick={this.endStream} hidden={!this.state.streamState}>release stream</button>
                            <select onChange={this.cameraSwitch} value={this.state.camera}>
                                {options}
                            </select>
                            <br />
                            <Canvas streamState={this.state.streamState} />
                        </div>

                    )
                }
            </div>
        )
    }

}

export default Webcam; 