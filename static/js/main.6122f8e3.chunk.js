(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,a){},16:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(8),c=a.n(r),o=(a(15),a(1)),s=a(2),l=a(4),d=a(3),m=a(5),u=(a(6),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(d.a)(t).call(this,e))).initCanvas=function(){a.context=a.c1.current.getContext("2d"),a.effectType="original",a.height=400;var e=window.videoTracks[0].getSettings();a.width=e.aspectRatio?parseInt(a.height*e.aspectRatio):parseInt(e.width/e.height*a.height),a.c1.current.width=a.width,a.c1.current.height=a.height,a.original()},a.videoEffect=function(e){console.log(e.target.value),a.effectType=e.target.value,"grayscale"===e.target.value?a.grayScale():"blur"===e.target.value?a.blur():"mosaic"===e.target.value?a.mosaic():a.original()},a.original=function(){console.log("original"),null!==window.camVideo.srcObject&&"original"===a.effectType&&(a.context.drawImage(window.camVideo,0,0,a.width,a.height),setTimeout(function(){a.original()},40))},a.grayScale=function(){if("ended"!==window.videoTracks[0].readyState&&"grayscale"===a.effectType){a.context.drawImage(window.camVideo,0,0,a.width,a.height);for(var e=a.context.getImageData(0,0,a.width,a.height),t=e.data,n=a.height*a.width*4,i=0;i<n;i+=4){var r=.3*t[i]+.59*t[i+1]+.11*t[i+2];t[i]=r,t[i+1]=r,t[i+2]=r}a.context.putImageData(e,0,0),setTimeout(function(){a.grayScale()},40)}},a.mosaic=function(){if("ended"!==window.videoTracks[0].readyState&&"mosaic"===a.effectType){a.context.drawImage(window.camVideo,0,0,a.width,a.height);for(var e=a.context.getImageData(0,0,a.width,a.height),t=e.data,n=4*a.width,i=a.height,r=0;r<i;r+=24)for(var c=void 0,o=void 0,s=void 0,l=0;l<n;l+=4){l%96===0&&r%24===0&&(t[r*n+l+3]=240,c=t[r*n+l],o=t[r*n+l+1],s=t[r*n+l+2]);for(var d=0;d<24;d++)t[(r+d)*n+l]=c,t[(r+d)*n+l+1]=o,t[(r+d)*n+l+2]=s}a.context.putImageData(e,0,0),setTimeout(function(){a.mosaic()},40)}},a.blur=function(){if("ended"!==window.videoTracks[0].readyState&&"blur"===a.effectType){a.context.drawImage(window.camVideo,0,0,a.width,a.height);for(var e,t,n,i,r=a.context.getImageData(0,0,a.width,a.height),c=r.data,o=a.width*a.height*4,s=0;s<o;s+=4){for(var l=s-16;l<s+16;l+=4)c[l]>=0&&Math.abs(l%(4*a.width)-s%(4*a.width))<=a.width&&(e+=c[l],t+=c[l+1],n+=c[l+2],i+=1);c[s]=parseInt(e/i),c[s+1]=parseInt(t/i),c[s+2]=parseInt(n/i),e=t=n=i=0}a.context.putImageData(r,0,0),setTimeout(function(){a.blur()},40)}},a.saveFrame=function(){var e=a.c1.current.toDataURL("image/png"),t=document.createElement("a");t.href=e,t.download=a.effectType+".png",t.dispatchEvent(new MouseEvent("click"))},a.c1=i.a.createRef(),a}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.initCanvas()}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement("canvas",{className:"c1",ref:this.c1}),i.a.createElement("br",null),i.a.createElement("select",{onChange:this.videoEffect,defaultValue:"original"},i.a.createElement("option",{value:"original"},"Original"),i.a.createElement("option",{value:"grayscale"},"Grayscale"),i.a.createElement("option",{value:"blur"},"Blur"),i.a.createElement("option",{value:"mosaic"},"Mosaic")),i.a.createElement("button",{onClick:this.saveFrame}," Save "))}}]),t}(i.a.Component)),h=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(d.a)(t).call(this,e))).videoSwitch=function(){!0===a.state.streamState?a.endStream():a.startStream()},a.endStream=function(){a.videoTracks[0].stop(),a.stream.removeTrack(a.videoTracks[0]),a.camVideo.current.srcObject=null,a.setState({streamState:!1})},a.startStream=function(){a.getUserMedia()},a.getVideoDevices=function(){navigator.mediaDevices.enumerateDevices().then(function(e){var t;(a.videoDevices=e.filter(function(e){return"videoinput"===e.kind}),a.videoDevices)&&(a.options=a.videoDevices.map(function(e){return e.label===a.videoTracks[0].label&&(t=e.deviceId),i.a.createElement("option",{key:e.deviceId,value:e.deviceId},e.label)}),a.setState({camera:t,streamState:!0}))}).catch(function(e){a.setState({errorMsg:"Error message: "+(e.message?e.message:e.name)})})},a.getUserMedia=function(){navigator.mediaDevices.getUserMedia(a.constraints).then(function(e){a.stream=e,a.videoTracks=e.getVideoTracks(),a.camVideo.current.srcObject=e,window.camVideo=a.camVideo.current,window.videoTracks=a.videoTracks,a.getVideoDevices()}).catch(function(e){a.setState({errorMsg:"Error message: "+(e.message?e.message:e.name)})})},a.cameraSwitch=function(e){a.constraints.video.deviceId={exact:e.target.value},a.setState({camera:e.target.value}),a.endStream(),a.startStream()},a.state={errorMsg:"",streamState:"",camera:""},a.camVideo=i.a.createRef(),a}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.constraints={audio:!1,video:{width:{min:640,ideal:1920,max:1920},height:{min:400,ideal:1080,max:1080}}},this.startStream()}},{key:"render",value:function(){console.log("render");var e=this.options;return i.a.createElement("div",null,this.state.errorMsg?i.a.createElement("p",null," ",this.state.errorMsg," "):i.a.createElement("div",null,i.a.createElement("video",{controls:!0,className:"webcam",ref:this.camVideo,autoPlay:!0,playsInline:!0,hidden:!1}),i.a.createElement("br",null),i.a.createElement("button",{onClick:this.startStream,hidden:this.state.streamState},"create stream"),i.a.createElement("button",{onClick:this.endStream,hidden:!this.state.streamState},"release stream"),i.a.createElement("select",{onChange:this.cameraSwitch,value:this.state.camera},e),i.a.createElement("br",null),this.state.streamState?i.a.createElement(u,null):i.a.createElement("p",null," Create stream first ")))}}]),t}(i.a.Component),g=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{className:"App"},i.a.createElement(h,null))}}]),t}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},6:function(e,t,a){},9:function(e,t,a){e.exports=a(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.6122f8e3.chunk.js.map