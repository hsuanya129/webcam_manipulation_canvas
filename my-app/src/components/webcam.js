import React from 'react';
import './../App.css';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            streamState: true, //

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
                this.setState({
                    streamState: true,
                });
                this.processor();
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

    // after component mounted, set up contraints and start the stream.
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


    videoEffect = (e) => {
        
        this.effectType = e.target.value;
        (e.target.value === "grayscale") ? this.grayScale() : (e.target.value === "blur") ? (this.blur()) : this.original();
        
    }

    // whenever the video play, call original
    processor = () => {
        console.log(this.c1.current.getContext('2d'));
        this.context = this.c1.current.getContext('2d');
        this.effectType = "original";
        this.camVideo.current.addEventListener('play', () => {
            this.original();
        }, false);
        
    }

    // call self and redo computeFrame every 30 milliseconds
    original = () => {
        console.log(this.effectType);
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "original") {
            return;
        }
        // let height = this.camVideo.current.offsetHeight;
        // let width = this.camVideo.current.offsetWidth;

        this.context.drawImage(this.camVideo.current, 0, 0, 320, 200);
        setTimeout(() => {
            this.original();
        }, 30);
    }

    // grayscale
    grayScale = () => {
        console.log(this.effectType);
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "grayscale") {
            return;
        }
        this.context.drawImage(this.camVideo.current, 0, 0, 320, 200);
        let imageData = this.context.getImageData(0, 0, 320, 200);
        let data = imageData.data;
        let l = data.length; // divided by 4 because rgba 
        for (let i = 0; i < l; i +=4) {
            let y =data[i]*0.30 + data[i + 1]*0.59 + data[i + 2]*0.11;
            data[i] =y; // red
            data[i + 1] =y; // green
            data[i + 2] =y; // blue
        }
        this.context.putImageData(imageData, 0, 0);

        setTimeout(() => {
            this.grayScale();
        }, 0);
    }

    blur = () => {
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "blur") {
            return;
        }
        this.context.drawImage(this.camVideo.current, 0, 0, 320, 200);
        let imageData = this.context.getImageData(0, 0, 320, 200);
        let data = imageData.data;
        let l = data.length; 
        for (let i = 0; i < l; i +=64) {
            for(let j=0;j<64;j+=4){
                data[i+j] =data[i] ;
                data[i+j+1] =data[i + 1] ;
                data[i+j+2] =data[i + 2];
            } 
        }
        this.context.putImageData(imageData, 0, 0);

        setTimeout(() => {
            this.blur();
        }, 0);
    }

    saveFrame = () => {
        console.log("save");
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

                            {this.state.streamState ?
                                (<div>
                                    <canvas className="c1" ref={this.c1} width={320} height={200}></canvas>
                                    <br />
                                    <select onChange={this.videoEffect} defaultValue="original">
                                        <option value="original">Original</option>
                                        <option value="grayscale">Grayscale</option>
                                        <option value="blur">Blur</option>
                                    </select>
                                    <button onClick={this.saveFrame}> Save </button>
                                </div>) :
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