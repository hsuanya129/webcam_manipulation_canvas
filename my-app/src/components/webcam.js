import React from 'react';
import './../App.css';

class Webcam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            buttonLabel: "release stream"
        }

        this.camVideo = React.createRef();
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

        // TODO1: Need to be more familiar how it works
        let constraints = {
            audio:false,
            video:{
                width:{exact:640},
                height:{exact:400},
                aspectRatio: 1.777777778,
            }
        }

        //it returns a Promise object
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                console.log(stream);
                stream.onremovetrack = function () {
                    console.log('Stream ended');
                };

                this.stream = stream;
                this.videoTracks = stream.getVideoTracks();
                console.log("Using device: "+this.videoTracks[0].label); // TODO2: try to make it more flexiable
                this.camVideo.current.srcObject = stream;
                this.camVideo.current.play()
                .then(this.setState({
                    buttonLabel: "release stream"
                }))
                .then(this.processor());
                
            })
            .catch((err) => {
                this.setState({
                    errorMsg: "Error message: " + err.message
                });
            })
    }

    componentDidMount() {
        this.startStream();
    }

    //whenever the video play, call timerCallback
    processor = () => {
        console.log(this.c1.current.getContext('2d'));
        this.camVideo.current.addEventListener('play',()=>{
            this.timerCallback();
        },false);
    }

    
    timerCallback = () => {
        if(this.camVideo.current.ended){
            return;
        }
        this.computeFrame();  
        setTimeout(() => {
            this.timerCallback(); // TODO3: Need to be more familiar how it works,
        }, 0);
    }

    //Drawing video into canvas
    computeFrame = () => {
        let context1=this.c1.current.getContext('2d');
        context1.drawImage(this.camVideo.current,0,0,320,200);
    }



    render() {
        return (
            <div>
                {this.state.errorMsg ? (<p> {this.state.errorMsg} </p>) :
                    (
                        <div>
                            <video className="webcam" ref={this.camVideo} ></video>
                            <br />
                            <button onClick={this.videoSwitch}>{this.state.buttonLabel}</button>
                            <br/>
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