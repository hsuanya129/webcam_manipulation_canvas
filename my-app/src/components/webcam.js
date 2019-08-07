import React from 'react';
import './../App.css';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            buttonLabel: "release stream",
        }

        this.camVideo = React.createRef();
        this.cameraSelect = React.createRef();
        this.c1 = React.createRef();
        this.c2 = React.createRef();
    }

    // to switch on/off video stream
    videoSwitch = () => {
        if (this.stream.active === true) {
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
            buttonLabel: "create stream"
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
                    return device.kind === "videoinput";
                });
                console.log(this.videoDevices[0].getCapabilities()); //TODO2: filter useless devices
            })
            .then(this.getUserMedia())
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
                this.setState({
                    buttonLabel: "release stream"
                })
                this.processor();

            })
            .catch((err) => {
                this.setState({
                    errorMsg: "Error message: " + (err.message ? err.message : err.name)
                });
            })
    }


    componentDidMount() {
        this.constraints = {
            audio: false,
            video: {
                width: { min: 640, ideal: 1920, max: 1920 },
                height: { min: 400, ideal: 1080, max: 1080 },
                aspectRatio: 1.777777778,
            }
        }
        this.startStream();
    }

    // handling changes of camera
    cameraSwitch = () => {
        this.constraints.video.deviceId = {exact:this.cameraSelect.current.value};
        console.log(this.stream);
        console.log(this.videoTracks);
        this.endStream();
        this.startStream();
    }


    //whenever the video play, call timerCallback
    processor = () => {
        // console.log(this.c1.current.getContext('2d'));
        this.camVideo.current.addEventListener('play', () => {
            this.timerCallback();
        }, false);
    }


    timerCallback = () => {
        if (this.camVideo.current.ended) {
            return;
        }
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback(); // TODO3: Need to be more familiar how it works,
        }, 0);
    }

    //Drawing video into canvas
    computeFrame = () => {
        let context1 = this.c1.current.getContext('2d');
        context1.drawImage(this.camVideo.current, 0, 0, 320, 200);
    }





    render() {
        let options;
        if (this.videoDevices) {
            options = this.videoDevices.map((device) => {
                return <option value={device.deviceId} selected ={(this.videoTracks[0].label === device.label) ? true : false}>{device.label}</option>
            })
        }
        return (
            <div>
                {this.state.errorMsg ? (<p> {this.state.errorMsg} </p>) :
                    (
                        <div>
                            <video controls={true} className="webcam" ref={this.camVideo} loop autoPlay></video>
                            <br />
                            <button onClick={this.videoSwitch}>{this.state.buttonLabel}</button>
                            <select ref={this.cameraSelect} onChange={this.cameraSwitch}>
                                {options}
                            </select>
                            <br />
                            <canvas className="c1" ref={this.c1} width={320} height={200}></canvas>
                            <canvas className="c2" ref={this.c2} width={320} height={200}></canvas>
                        </div>

                    )
                }
            </div>
        )
    }

}

export default Webcam; 