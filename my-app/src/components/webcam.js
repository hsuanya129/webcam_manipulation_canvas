import React from 'react';
import './../App.css';
import Canvas from './canvas';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            streamState: ""
        }

        this.camVideo = React.createRef();
        this.cameraSelect = React.createRef();

    }

    // after component mounted, set up contraints and start the stream.
    componentDidMount() {
        this.constraints = {
            audio: false,
            video: {
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080, max: 1080 },
            }
        }
        this.startStream();
    }

    // to switch on/off video stream
    videoSwitch = () => {
        if (this.state.streamState === true) {
            this.endStream();
        } else {
            this.startStream();
        }
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
        this.getVideoDevices();
    }

    // to get videoDevices
    getVideoDevices = () => {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                this.videoDevices = devices.filter((device) => {
                    return (device.kind === "videoinput");
                });
                this.getUserMedia();
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
                this.setState({
                    streamState: true,
                });
            })
            .catch((err) => {
                this.setState({
                    errorMsg: "Error message: " + (err.message ? err.message : err.name)
                });
            })
    }

    // handling changes of camera
    cameraSwitch = () => {
        this.constraints.video.deviceId = { exact: this.cameraSelect.current.value };
        this.endStream();
        this.startStream();
    }

    render() {
        console.log("render");
        let options;
        if (this.videoTracks) {
            options = this.videoDevices.map((device) => {
                return <option key={device.deviceId} value={device.deviceId} selected={(this.videoTracks[0].label === device.label) ? true : false}>{device.label}</option>
            })
        }

        return (
            <div>
                {this.state.errorMsg ? (<p> {this.state.errorMsg} </p>) :
                    (
                        <div>
                            <video controls={true} className="webcam" ref={this.camVideo} autoPlay playsInline hidden={true}></video>
                            <br />
                            <button onClick={this.startStream} hidden={this.state.streamState}>create stream</button>
                            <button onClick={this.endStream} hidden={!this.state.streamState}>release stream</button>
                            <select ref={this.cameraSelect} onChange={this.cameraSwitch} >
                                {options}
                            </select>
                            <br />

                            {(this.state.streamState) ? <Canvas streamState={this.state.streamState} /> :
                                <p> Create stream first </p>
                            }

                        </div>

                    )
                }
            </div>
        )
    }

}

export default Webcam; 