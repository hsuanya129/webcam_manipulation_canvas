import React from 'react';
import './../App.css';

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.c1 = React.createRef();
    }

    componentDidMount() {
        this.initCanvas();
    }

    // saving canvas data to component member and set the size
    initCanvas = () => {
        this.context = this.c1.current.getContext('2d');
        this.effectType = "original";
        this.height = 400;
        let setting = window.videoTracks[0].getSettings();
        this.width = (setting.aspectRatio) ? parseInt(this.height * setting.aspectRatio) : parseInt(setting.width / setting.height * this.height);
        this.c1.current.width = this.width;
        this.c1.current.height = this.height;
        this.original();
    }

    // handling selection of videoEffects
    videoEffect = (e) => {
        console.log(e.target.value);
        this.effectType = e.target.value;
        (e.target.value === "grayscale") ? this.grayScale() : (e.target.value === "blur") ? this.blur() : (e.target.value === "mosaic") ? this.mosaic() : this.original();
    }

    // original effect- call self and redo every 30 milliseconds
    original = () => {
        console.log("original");
        if (window.camVideo.srcObject === null || this.effectType !== "original") {
            return;
        }

        this.context.drawImage(window.camVideo, 0, 0, this.width, this.height);
        setTimeout(() => {
            this.original();
        }, 30);
    }

    // grayscale
    grayScale = () => {
        if (window.videoTracks[0].readyState === "ended" || this.effectType !== "grayscale") {
            return;
        }

        this.context.drawImage(window.camVideo, 0, 0, this.width, this.height);
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

    //mosaic 
    mosaic = () => {
        if (window.videoTracks[0].readyState === "ended" || this.effectType !== "mosaic") {
            return;
        }
        this.context.drawImage(window.camVideo, 0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        let w = this.width * 4;
        let h = this.height;

        for (let i = 0; i < h; i += 6) {
            let r,g,b;
            for (let j = 0; j < w; j += 4) {
                if (j % 24 === 0  && i % 6 === 0) {
                    r = data[i * w + j];
                    g = data[i * w + j + 1];
                    b = data[i * w + j + 2];
                }
                for (let k = 0; k <6; k++) {
                    data[(i+k) * w + j] = r;
                    data[(i+k) * w + j + 1] = g;
                    data[(i+k) * w + j + 2] = b;
                }

            }
        }

        this.context.putImageData(imageData, 0, 0);
        setTimeout(() => {
            this.mosaic();
        }, 30);
    }

    //blur, need to be more efficient, easily lag
    blur = () => {
        if (window.videoTracks[0].readyState === "ended" || this.effectType !== "blur") {
            return;
        }

        this.context.drawImage(window.camVideo, 0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        let dimension = this.width * this.height * 4;
        let step = 2 * 2 * 4;
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
        let url = this.c1.current.toDataURL("image/png");
        let a = document.createElement('a');
        a.href = url;
        a.download = this.effectType + ".png";
        a.dispatchEvent(new MouseEvent('click')); //fire a.click event
    }

    render() {

        return (
            <div>
                <canvas className="c1" ref={this.c1}></canvas>
                <br />
                <select onChange={this.videoEffect} defaultValue="original">
                    <option value="original">Original</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="blur">Blur</option>
                    <option value="mosaic">Mosaic</option>
                </select>
                <button onClick={this.saveFrame}> Save </button>

            </div>
        )
    }
}

export default Canvas; 