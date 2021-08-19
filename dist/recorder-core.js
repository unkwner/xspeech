/*
录音
https://github.com/xiangyuecn/Recorder
src: recorder-core.js
*/
!function(h){"use strict";var d=function(){},F=function(e){return new t(e)};F.IsOpen=function(){var e=F.Stream;if(e){var t=e.getTracks&&e.getTracks()||e.audioTracks||[],n=t[0];if(n){var r=n.readyState;return"live"==r||r==n.LIVE}}return!1},F.BufferSize=4096,F.Destroy=function(){for(var e in A("Recorder Destroy"),g(),n)n[e]()};var n={};F.BindDestroy=function(e,t){n[e]=t},F.Support=function(){var e=h.AudioContext;if(e||(e=h.webkitAudioContext),!e)return!1;var t=navigator.mediaDevices||{};return t.getUserMedia||(t=navigator).getUserMedia||(t.getUserMedia=t.webkitGetUserMedia||t.mozGetUserMedia||t.msGetUserMedia),!!t.getUserMedia&&(F.Scope=t,F.Ctx&&"closed"!=F.Ctx.state||(F.Ctx=new e,F.BindDestroy("Ctx",function(){var e=F.Ctx;e&&e.close&&(e.close(),F.Ctx=0)})),!0)};var S=function(e){var t=(e=e||F).BufferSize||F.BufferSize,n=F.Ctx,r=e.Stream,a=r._m=n.createMediaStreamSource(r),o=r._p=(n.createScriptProcessor||n.createJavaScriptNode).call(n,t,1,1);a.connect(o),o.connect(n.destination);var f=r._call;o.onaudioprocess=function(e){for(var t in f){for(var n=e.inputBuffer.getChannelData(0),r=n.length,a=new Int16Array(r),o=0,s=0;s<r;s++){var i=Math.max(-1,Math.min(1,n[s]));i=i<0?32768*i:32767*i,a[s]=i,o+=Math.abs(i)}for(var c in f)f[c](a,o);return}}},g=function(e){var t=(e=e||F)==F,n=e.Stream;if(n&&(n._m&&(n._m.disconnect(),n._p.disconnect(),n._p.onaudioprocess=n._p=n._m=null),t)){for(var r=n.getTracks&&n.getTracks()||n.audioTracks||[],a=0;a<r.length;a++){var o=r[a];o.stop&&o.stop()}n.stop&&n.stop()}e.Stream=0};F.SampleData=function(e,t,n,r,a){r||(r={});var o=r.index||0,s=r.offset||0,i=r.frameNext||[];a||(a={});var c=a.frameSize||1;a.frameType&&(c="mp3"==a.frameType?1152:1);for(var f=0,u=o;u<e.length;u++)f+=e[u].length;f=Math.max(0,f-Math.floor(s));var l=t/n;1<l?f=Math.floor(f/l):(l=1,n=t),f+=i.length;for(var v=new Int16Array(f),p=0,u=0;u<i.length;u++)v[p]=i[u],p++;for(var m=e.length;o<m;o++){for(var h=e[o],u=s,d=h.length;u<d;){var S=Math.floor(u),g=Math.ceil(u),_=u-S,y=h[S],I=g<d?h[g]:(e[o+1]||[y])[0]||0;v[p]=y+(I-y)*_,p++,u+=l}s=u-d}i=null;var M=v.length%c;if(0<M){var x=2*(v.length-M);i=new Int16Array(v.buffer.slice(x)),v=new Int16Array(v.buffer.slice(0,x))}return{index:o,offset:s,frameNext:i,sampleRate:n,data:v}},F.PowerLevel=function(e,t){var n=e/t||0;return n<1251?Math.round(n/1250*10):Math.round(Math.min(100,Math.max(0,100*(1+Math.log(n/1e4)/Math.log(10)))))};var A=function(e,t){var n=new Date,r=("0"+n.getMinutes()).substr(-2)+":"+("0"+n.getSeconds()).substr(-2)+"."+("00"+n.getMilliseconds()).substr(-3),a=["["+r+" Recorder]"+e],o=arguments,s=2,i=console.log;for("number"==typeof t?i=1==t?console.error:3==t?console.warn:i:s=1;s<o.length;s++)a.push(o[s]);i.apply(console,a)};F.CLog=A;var r=0;function t(e){this.id=++r,F.Traffic&&F.Traffic();var t={type:"mp3",bitRate:16,sampleRate:16e3,onProcess:d};for(var n in e)t[n]=e[n];this.set=t,this._S=9,this.Sync={O:9,C:9}}F.Sync={O:9,C:9},F.prototype=t.prototype={_streamStore:function(){return this.set.sourceStream?this:F},open:function(e,n){var t=this,r=t._streamStore();e=e||d;var a=function(e,t){A("录音open失败："+e+",isUserNotAllow:"+(t=!!t),1),n&&n(e,t)},o=function(){A("open成功"),e(),t._SO=0},s=r.Sync,i=++s.O,c=s.C;t._O=t._O_=i,t._SO=t._S;var f=function(){if(c!=s.C||!t._O){var e="open被取消";return i==s.O?t.close():e="open被中断",a(e),!0}},u=t.envCheck({envName:"H5",canProcess:!0});if(u)a("不能录音："+u);else if(t.set.sourceStream){if(!F.Support())return void a("不支持此浏览器从流中获取录音");g(r),t.Stream=t.set.sourceStream,t.Stream._call={};try{S(r)}catch(e){return void a("从流中打开录音失败："+e.message)}o()}else{var l=function(e,t){try{h.top.a}catch(e){return void a('无权录音(跨域，请尝试给iframe添加麦克风访问策略，如allow="camera;microphone")')}/Permission|Allow/i.test(e)?a("用户拒绝了录音权限",!0):!1===h.isSecureContext?a("无权录音(需https)"):/Found/i.test(e)?a(t+"，无可用麦克风"):a(t)};if(F.IsOpen())o();else if(F.Support()){var v=function(e){(F.Stream=e)._call={},f()||setTimeout(function(){f()||(F.IsOpen()?(S(),o()):a("录音功能无效：无音频流"))},100)},p=function(e){var t=e.name||e.message||e.code+":"+e;A("请求录音权限错误",1,e),l(t,"无法录音："+t)},m=F.Scope.getUserMedia({audio:t.set.audioTrackSet||!0},v,p);m&&m.then&&m.then(v)[e&&"catch"](p)}else l("","此浏览器不支持录音")}},close:function(e){e=e||d;var t=this._streamStore();this._stop();var n=t.Sync;if(this._O=0,this._O_!=n.O)return A("close被忽略",3),void e();n.C++,g(t),A("close"),e()},mock:function(e,t){var n=this;return n._stop(),n.isMock=1,n.mockEnvInfo=null,n.buffers=[e],n.recSize=e.length,n.srcSampleRate=t,n},envCheck:function(e){var t,n=this.set;return t||(this[n.type+"_envCheck"]?t=this[n.type+"_envCheck"](e,n):n.takeoffEncodeChunk&&(t=n.type+"类型不支持设置takeoffEncodeChunk")),t||""},envStart:function(e,t){var n=this,r=n.set;if(n.isMock=e?1:0,n.mockEnvInfo=e,n.buffers=[],n.recSize=0,n.envInLast=0,n.envInFirst=0,n.envInFix=0,n.envInFixTs=[],r.sampleRate=Math.min(t,r.sampleRate),n.srcSampleRate=t,n.engineCtx=0,n[r.type+"_start"]){var a=n.engineCtx=n[r.type+"_start"](r);a&&(a.pcmDatas=[],a.pcmSize=0)}},envResume:function(){this.envInFixTs=[]},envIn:function(e,t){var a=this,o=a.set,s=a.engineCtx,n=a.srcSampleRate,r=e.length,i=F.PowerLevel(t,r),c=a.buffers,f=c.length;c.push(e);var u=c,l=f,v=Date.now(),p=Math.round(r/n*1e3);a.envInLast=v,1==a.buffers.length&&(a.envInFirst=v-p);var m=a.envInFixTs;m.splice(0,0,{t:v,d:p});for(var h=v,d=0,S=0;S<m.length;S++){var g=m[S];if(3e3<v-g.t){m.length=S;break}h=g.t,d+=g.d}var _=m[1],y=v-h;if(y/3<y-d&&(_&&1e3<y||6<=m.length)){var I=v-_.t-p;if(p/5<I){var M=!o.disableEnvInFix;if(A("["+v+"]"+(M?"":"未")+"补偿"+I+"ms",3),a.envInFix+=I,M){var x=new Int16Array(I*n/1e3);r+=x.length,c.push(x)}}}var k=a.recSize,C=r,R=k+C;if(a.recSize=R,s){var w=F.SampleData(c,n,o.sampleRate,s.chunkInfo);s.chunkInfo=w,R=(k=s.pcmSize)+(C=w.data.length),s.pcmSize=R,c=s.pcmDatas,f=c.length,c.push(w.data),n=w.sampleRate}var b=Math.round(R/n*1e3),T=c.length,z=u.length,O=function(){for(var e=D?0:-C,t=null==c[0],n=f;n<T;n++){var r=c[n];null==r?t=1:(e+=r.length,s&&r.length&&a[o.type+"_encode"](s,r))}if(t&&s)for(n=l,u[0]&&(n=0);n<z;n++)u[n]=null;t&&(e=D?C:0,c[0]=null),s?s.pcmSize+=e:a.recSize+=e},D=o.onProcess(c,i,b,n,f,O);if(!0===D){var U=0;for(S=f;S<T;S++)null==c[S]?U=1:c[S]=new Int16Array(0);U?A("未进入异步前不能清除buffers",3):s?s.pcmSize-=C:a.recSize-=C}else O()},start:function(){var e=this,t=F.Ctx,n=1;if(e.set.sourceStream?e.Stream||(n=0):F.IsOpen()||(n=0),n)if(A("开始录音"),e._stop(),e.state=0,e.envStart(null,t.sampleRate),e._SO&&e._SO+1!=e._S)A("start被中断",3);else{e._SO=0;var r=function(){e.state=1,e.resume()};"suspended"==t.state?t.resume().then(function(){A("ctx resume"),r()}):r()}else A("未open",1)},pause:function(){this.state&&(this.state=2,A("pause"),delete this._streamStore().Stream._call[this.id])},resume:function(){var n=this;n.state&&(n.state=1,A("resume"),n.envResume(),n._streamStore().Stream._call[n.id]=function(e,t){1==n.state&&n.envIn(e,t)})},_stop:function(e){var t=this,n=t.set;t.isMock||t._S++,t.state&&(t.pause(),t.state=0),!e&&t[n.type+"_stop"]&&(t[n.type+"_stop"](t.engineCtx),t.engineCtx=0)},stop:function(n,t,e){var r,a=this,o=a.set;A("Stop "+(a.envInLast?a.envInLast-a.envInFirst+"ms 补"+a.envInFix+"ms":"-"));var s=function(){a._stop(),e&&a.close()},i=function(e){A("结束录音失败："+e,1),t&&t(e),s()},c=function(e,t){if(A("结束录音 编码"+(Date.now()-r)+"ms 音频"+t+"ms/"+e.size+"b"),o.takeoffEncodeChunk)A("启用takeoffEncodeChunk后stop返回的blob长度为0不提供音频数据",3);else if(e.size<Math.max(100,t/2))return void i("生成的"+o.type+"无效");n&&n(e,t),s()};if(!a.isMock){if(!a.state)return void i("未开始录音");a._stop(!0)}var f=a.recSize;if(f)if(a.buffers[0])if(a[o.type]){if(a.isMock){var u=a.envCheck(a.mockEnvInfo||{envName:"mock",canProcess:!1});if(u)return void i("录音错误："+u)}var l=a.engineCtx;if(a[o.type+"_complete"]&&l){var v=Math.round(l.pcmSize/o.sampleRate*1e3);return r=Date.now(),void a[o.type+"_complete"](l,function(e){c(e,v)},i)}r=Date.now();var p=F.SampleData(a.buffers,a.srcSampleRate,o.sampleRate);o.sampleRate=p.sampleRate;var m=p.data;v=Math.round(m.length/o.sampleRate*1e3),A("采样"+f+"->"+m.length+" 花:"+(Date.now()-r)+"ms"),setTimeout(function(){r=Date.now(),a[o.type](m,function(e){c(e,v)},function(e){i(e)})})}else i("未加载"+o.type+"编码器");else i("音频被释放");else i("未采集到录音")}},h.Recorder&&h.Recorder.Destroy(),(h.Recorder=F).LM="2021-08-03 20:01:03",F.TrafficImgUrl="//ia.51.la/go1?id=20469973&pvFlag=1",F.Traffic=function(){var e=F.TrafficImgUrl;if(e){var t=F.Traffic,n=location.href.replace(/#.*/,"");if(0==e.indexOf("//")&&(e=/^https:/i.test(n)?"https:"+e:"http:"+e),!t[n]){t[n]=1;var r=new Image;r.src=e,A("Traffic Analysis Image: Recorder.TrafficImgUrl="+F.TrafficImgUrl)}}}}(window),"function"==typeof define&&define.amd&&define(function(){return Recorder}),"object"==typeof module&&module.exports&&(module.exports=Recorder);