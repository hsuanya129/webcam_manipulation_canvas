import React from 'react';
import './../App.css';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            streamState: true,
        }

        this.camVideo = React.createRef();
        this.cameraSelect = React.createRef();
        this.c1 = React.createRef();
        this.download = React.createRef();
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
                this.setState({
                    streamState: true,
                });
                this.initCanvas(); //initialize data we need in canvas
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
            }
        }
        this.startStream();
    }

    // handling selection of videoEffects
    videoEffect = (e) => {
        console.log(e.target.value);
        this.effectType = e.target.value;
        (e.target.value === "grayscale") ? this.grayScale() : (e.target.value === "blur") ? this.blur() : (e.target.value === "mosaic") ? this.mosaic() : this.original();
    }

    // saving canvas data to component member and set the size
    initCanvas = () => {
        this.context = this.c1.current.getContext('2d');
        this.effectType = "original";
        this.camVideo.current.addEventListener('play', () => {
            // this.height = this.camVideo.current.videoHeight; it lags to much at blur effect so we set smaller size 
            // this.width = this.camVideo.current.videoWidth;
            // let setting = this.videoTracks[0].getSettings();
            this.height = 400;
            this.width = 640;
            // this.width = parseInt(this.height * setting.aspectRatio);
            this.c1.current.width = this.width;
            this.c1.current.height = this.height;
            this.original();
        }, false);

    }

    // original effect- call self and redo every 30 milliseconds
    original = () => {
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "original") {
            return;
        }

        this.context.drawImage(this.camVideo.current, 0, 0, this.width, this.height);
        setTimeout(() => {
            this.original();
        }, 30);
    }

    // grayscale
    grayScale = () => {
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "grayscale") {
            return;
        }
        this.context.drawImage(this.camVideo.current, 0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        let dimension = this.height * this.width * 4; //mulitple by 4 because one pixel contains r,g,b,a

        for (let i = 0; i < dimension; i += 4) {
            let y = data[i] * 0.30 + data[i + 1] * 0.59 + data[i + 2] * 0.11; //according to the grayscale formula
            data[i] = y; //r
            data[i + 1] = y; //g
            data[i + 2] = y; //b
        }

        this.context.putImageData(imageData, 0, 0);
        setTimeout(() => {
            this.grayScale();
        }, 30);
    }

    //mosaic only vertical blur, move to right a little
    mosaic = () => {
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "mosaic") {
            return;
        }
        this.context.drawImage(this.camVideo.current, 0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        let w = this.width * 4;
        let h = this.height;

        for (let i = 0; i < h; i++) {
            let r, g, b;
            for (let j = 0; j < w; j += 4) {
                if (j % 24 === 0 && j % 48 < 24) {
                    data[i * w + j + 3] = 128;
                    r = data[i * w + j];
                    g = data[i * w + j + 1];
                    b = data[i * w + j + 2];
                }
                data[i * w + j] = r;
                data[i * w + j + 1] = g;
                data[i * w + j + 2] = b;
                data[i * w + j + 3] = 250;
            }
        }

        this.context.putImageData(imageData, 0, 0);
        setTimeout(() => {
            this.mosaic();
        }, 30);
    }

    //blur, need to be more efficient, easily lag
    blur = () => {
        if (this.camVideo.current.ended || this.state.streamState === false || this.effectType !== "blur") {
            return;
        }
        this.context.drawImage(this.camVideo.current, 0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        let dimension = this.width * this.height * 4;
        let step = 3 * 3 * 4;
        let r, g, b, count;


        //iterate all pixels and mix its 6*6 pixels surrounded 
        for (let i = 0; i < dimension; i += 4) { //i represent the central pixel
            for (let k = i - step; k < i + step; k += 4) { //k represent surrounded pixels
                if (data[k] >= 0 && Math.abs(k % (4 * this.width) - i % (4 * this.width)) <= this.width) { //to avoid border pixels mix 
                    r += data[k];
                    g += data[k + 1];
                    b += data[k + 2];
                    count += 1;
                }
            }
            data[i] = parseInt(r / count);
            data[i + 1] = parseInt(g / count);
            data[i + 2] = parseInt(b / count);
            r = g = b = count = 0;
        }

        this.context.putImageData(imageData, 0, 0);
        setTimeout(() => {
            this.blur();
        }, 30);
    }

    saveFrame = () => {
        this.download.current.href=this.c1.current.toDataURL("image/png");
        this.download.current.click();
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
                            <video controls={true} className="webcam" ref={this.camVideo} autoPlay playsInline hidden={false}></video>
                            <br />
                            <button onClick={this.startStream} hidden={this.state.streamState}>create stream</button>
                            <button onClick={this.endStream} hidden={!this.state.streamState}>release stream</button>
                            <select ref={this.cameraSelect} onChange={this.cameraSwitch} >
                                {options}
                            </select>
                            <br />

                            {/* TODO:seperate below to another component */}
                            {(this.state.streamState) ?
                                (<div>
                                    <canvas className="c1" ref={this.c1} width={this.width} height={this.height}></canvas>
                                    <br />
                                    <select onChange={this.videoEffect} defaultValue="original">
                                        <option value="original">Original</option>
                                        <option value="grayscale">Grayscale</option>
                                        <option value="blur">Blur</option>
                                        <option value="mosaic">Mosaic</option>
                                    </select>
                                    <button onClick={this.saveFrame}> Save </button>
                                    <a ref={this.download} download="download.png"></a>
                                    
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