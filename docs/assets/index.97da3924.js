var e,t,n,o,l,a,r,i;import{V as c,S as A,R as s,B as d,a as u,b as h,C as g,c as f,d as m,N as p,M as w,D as E,e as b,P as v,W as C,f as y}from"./vendor.1630b8ff.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const S=new c,B=new A,L=new s,x=document.getElementById("link");function I(e,t){let n=t.clone();n.sub(e.position),e.rotation.y=-Math.atan2(n.x,-n.z),e.rotation.x=Math.atan2(n.y,Math.sqrt(n.x*n.x+n.z*n.z)),e.rotation.z=0}function R(e,t,n,o,l,a,r){let i=[[e+l,t],[e+l+n,t],[e+l,t-l],[e+l+n,t-l]],c=[[e+l+n,t-l],[e+l+n+n,t-l],[e+l+n,t],[e+l+n+n,t]],A=[[e,t-l],[e+l,t-l],[e,t-l-o],[e+l,t-l-o]],s=[[e+l,t-l],[e+n+l,t-l],[e+l,t-l-o],[e+n+l,t-l-o]],u=[[e+l+n,t-l],[e+l+l+n,t-l],[e+l+n,t-l-o],[e+l+l+n,t-l-o]],h=[[e+l+n+l,t-l],[e+l+n+l+n,t-l],[e+l+n+l,t-l-o],[e+l+n+l+n,t-l-o]],g=[];for(let d of u)g.push(d[0]/a),g.push(d[1]/r);for(let d of A)g.push(d[0]/a),g.push(d[1]/r);for(let d of i)g.push(d[0]/a),g.push(d[1]/r);for(let d of c)g.push(d[0]/a),g.push(d[1]/r);for(let d of s)g.push(d[0]/a),g.push(d[1]/r);for(let d of h)g.push(d[0]/a),g.push(d[1]/r);return new d(new Float32Array(g),2)}function M(){x.setAttribute("download",(""===Ae.value.trim()?"skin":Ae.value)+".png"),x.setAttribute("href",ae.toDataURL("image/png").replace("image/png","image/octet-stream")),x.click()}const k=new u;let U=!1,Y=!1,D=!1,Q=!1,N="",j=-1;let X=!1;function T(e){U=e}function F(e){Y=e}function H(e){D=e}function K(e){Q=e}function J(e){N=e}function z(e){j=e}function q(e){X=e}let G=window.innerWidth,W=window.innerHeight;const O=new h;O.background=new g(3684408);const V=R(0,64,8,8,8,64,64),Z=new f;Z.setAttribute("uv",V);const $=R(32,64,8,8,8,64,64),P=new f;P.setAttribute("uv",$);let _=0;const ee=[],te=[],ne=document.getElementById("layers"),oe=[],le=[],ae=document.createElement("canvas");ae.width=64,ae.height=64;const re=ae.getContext("2d"),ie=document.createElement("canvas");ie.width=64,ie.height=64;const ce=ie.getContext("2d"),Ae=document.getElementById("skin-name-input"),se=document.getElementById("save"),de=document.getElementById("texture-canvas"),ue=de.getContext("2d");ue.imageSmoothingEnabled=!1;let he=1,ge={x:0,y:0};const fe={x:0,y:0},me=document.createElement("img");me.src="data:image/png;base64,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",me.addEventListener("load",(()=>{tt()}));const pe=new m(ae);pe.minFilter=p,pe.magFilter=p;const we=new w({color:16777215,map:pe,depthWrite:!0,depthTest:!0,side:E}),Ee=new w({color:16777215,transparent:!0,map:pe,depthWrite:!0,depthTest:!0,side:E}),be=new b(Z,we);O.add(be);const ve=new b(P,Ee);ve.scale.multiplyScalar(9/8),O.add(ve);const Ce=new v(75,G/W,.1,1e3);Ce.rotation.order="ZYX",Ce.position.set(1.1,1.1,1.1);const ye=new C;ye.setSize(G,W),ye.domElement.id="dom-element",document.body.appendChild(ye.domElement);const Se=document.getElementById("color-result"),Be=Se.getContext("2d"),Le=document.getElementById("color-h"),xe=Le.getContext("2d"),Ie=document.getElementById("color-s"),Re=Ie.getContext("2d"),Me=document.getElementById("color-l"),ke=Me.getContext("2d"),Ue=document.getElementById("color-r"),Ye=Ue.getContext("2d"),De=document.getElementById("color-g"),Qe=De.getContext("2d"),Ne=document.getElementById("color-b"),je=Ne.getContext("2d"),Xe=document.getElementById("color-a"),Te=Xe.getContext("2d"),Fe=document.getElementById("color-picker"),He={h:0,s:0,l:0},Ke={r:0,g:0,b:0};let Je=0;const ze=document.getElementById("hotbar"),qe=document.createElement("img");qe.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAAWCAYAAABt7GbqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF4SURBVGhD7dtBboJQEAbgwTR1h01NPAo36G3gNByBBQt2bHsDF97AsHXDAWya0L4HWt44XYyPLjr+X/JHwT8TFyOJCSRENHwHwBS/2IfDwR8cj0f/Onc6naZ3AP9DURTjYjdNQ23bjmcjbLdb6vuesiyj/X4/nb0f5sV51HlVVYWLXdf1+1iRrddE5zPR0zPR58d0cibP87f5F8W8EOaF/mqeW+zVdO5qt9v9ms1mfH19uf3MJU3TacoPqXcJ5oXBvOXm3Sw2gAV+sfEHEazBFRtMwmKDSVhsMAmLDSZhscEkLDaYFCx2ksSFkzqacFJHE07qaMJJHU04qaMJJ3U04aSOJpzU0WQOV2wwKVjsYYgLJ3U04aSOJpzU0YSTOppwUkcTTupowkkdTTipo8kcrthgEhYbTFp0sVerZX8nmBfnkee5/5JDWZb+6RnpNkKtruv8/bWYdx/Mi+PmXR80cIvtbvReyuVJhqVgXpxHm3dd7PEQwAqiL+N5Z5to8ZQOAAAAAElFTkSuQmCC",qe.addEventListener("load",(()=>{$e(Je)}));const Ge=document.createElement("img");Ge.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC1SURBVEhL7ZUxCsMgFIZfuzt7Ek/hnlN4nJzC2RNk9RDOzoKO1jyTELvYxlgo+IGoT3gfIvg/ACCm0Q0UJHATQsD5jLV2W32H1hqmacoC7z0opfJJI4QQcM7Bsiwwz3MpWIutcM4LwcoqiFLKKIRofg9jzLlXfOZyP1Bw9SE/4Tc36MkQVBmCKkNQ5f8ElNJtlcHASX84RhxjLFcvsjffw+tItF1wJ4UgJdAtcfnOIcjbHgC8APM0YRoSC87fAAAAAElFTkSuQmCC",Ge.addEventListener("load",(()=>{$e(Je)}));const We=ze.getContext("2d"),Oe=[{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255},{color:new g(1,0,0),alpha:255}];function Ve(){ee.push(document.createElement("canvas")),ee[ee.length-1].width=64,ee[ee.length-1].height=64,ee[ee.length-1].id="layer"+(ee.length-1)+"-canvas",ee[ee.length-1].className="layer-canvas",te.push(ee[ee.length-1].getContext("2d"));const e=document.createElement("div");e.id="layer"+(ee.length-1),e.className="layer";const t=document.createElement("p");t.innerHTML="Layer "+(ee.length-1),t.id="layer"+(ee.length-1)+"-label",t.className="layer-label",e.appendChild(t),e.appendChild(ee[ee.length-1]);const n=ee.length-1;e.addEventListener("mousedown",(e=>{Ze(n)})),ne.prepend(e),oe.push([]),le.push([])}function Ze(e){ee[_].parentElement.style.backgroundColor="rgb(30, 30, 30)",_=e,ee[_].parentElement.style.backgroundColor="rgb(10, 10, 10)"}function $e(e){Je=e,We.imageSmoothingEnabled=!1,We.clearRect(0,0,ze.width,ze.height),We.drawImage(qe,1,1),We.drawImage(Ge,20*Je,0);for(let t=0;t<Oe.length;t++)We.fillStyle=Oe[t].color.getStyle(),We.fillRect(20*t+4,4,16,16);lt("rgb",255*Oe[Je].color.r,255*Oe[Je].color.g,255*Oe[Je].color.b)}$e(Je);function Pe(e){G=e;const t=Math.min(.3*window.innerWidth,.5*window.innerHeight);de.width=Math.min(.3*window.innerWidth,.5*window.innerHeight),document.getElementById("texture-checker").width=t,Ae.parentElement.style.width=t+"px",Ae.style.width=t-35+"px",ne.style.width=t+6+"px",$e(Je),nt()}function _e(e){W=e;const t=Math.min(.3*window.innerWidth,.5*window.innerHeight);de.height=t,document.getElementById("texture-checker").height=t,ne.style.height=t-37+"px",nt()}function et(e){Oe[Je].alpha=e}function tt(){var e,t;null==(e=te[0])||e.clearRect(0,0,64,64),null==(t=te[0])||t.drawImage(me,0,0),nt()}function nt(){L.setFromCamera(k,Ce);const e=L.intersectObjects(O.children);if(e.length>0){if(!X&&ve.visible){const t=e[0].uv;ot(Math.floor(64*t.x),Math.floor(64*t.y))}else if(e[1].object===be){const t=e[1].uv;ot(Math.floor(64*t.x),Math.floor(64*t.y))}}else ot()}function ot(e,t){we.map.needsUpdate=!0,Ee.map.needsUpdate=!0,null==re||re.clearRect(0,0,64,64);for(const n of ee)null==re||re.drawImage(n,0,0);null==ce||ce.clearRect(0,0,64,64),null==ce||ce.drawImage(ae,0,0),"number"==typeof e&&"number"==typeof t&&(e=8*Math.floor(e/8),t=8*Math.floor((64-t-1)/8),ce.fillStyle="rgba(255, 255, 0, 0.5)",ce.fillRect(e,t,8,8)),ue.imageSmoothingEnabled=!1,null==ue||ue.clearRect(0,0,de.width,de.height),null==ue||ue.drawImage(ie,ge.x,ge.y,64/he,64/he,0,0,de.width,de.height)}function lt(e,t,n,o){switch(t=Math.floor(t),n=Math.floor(n),o=Math.floor(o),e){case"hsl":He.h=t,He.s=n,He.l=o,Oe[Je].color.set(`hsl(${t}, ${n}%, ${o}%)`),Ke.r=Math.floor(255*Oe[Je].color.r),Ke.g=Math.floor(255*Oe[Je].color.g),Ke.b=Math.floor(255*Oe[Je].color.b);break;case"rgb":Ke.r=t,Ke.g=n,Ke.b=o,Oe[Je].color.set(`rgb(${t}, ${n}, ${o})`),Oe[Je].color.getHSL(He),He.h=Math.floor(360*He.h),He.s=Math.floor(100*He.s),He.l=Math.floor(100*He.l);break;case"hex":Oe[Je].color.set(t),Oe[Je].color.getHSL(He),He.h=Math.floor(360*He.h),He.s=Math.floor(100*He.s),He.l=Math.floor(100*He.l),Ke.r=Math.floor(255*Oe[Je].color.r),Ke.g=Math.floor(255*Oe[Je].color.g),Ke.b=Math.floor(255*Oe[Je].color.b)}Be.clearRect(0,0,Se.width,Se.height),Be.fillStyle=`rgba(${255*Oe[Je].color.r}, ${255*Oe[Je].color.g}, ${255*Oe[Je].color.b}, ${Oe[Je].alpha/255})`,Be.fillRect(0,0,256,32),We.fillStyle=Oe[Je].color.getStyle(),We.fillRect(20*Je+4,4,16,16),function(e,t,n){const o=xe.createLinearGradient(0,0,Le.width,0);o.addColorStop(0,`hsl(0, ${t}%, ${n}%)`),o.addColorStop(.15,`hsl(60, ${t}%, ${n}%)`),o.addColorStop(.33,`hsl(120, ${t}%, ${n}%)`),o.addColorStop(.49,`hsl(180, ${t}%, ${n}%)`),o.addColorStop(.67,`hsl(240, ${t}%, ${n}%)`),o.addColorStop(.84,`hsl(300, ${t}%, ${n}%)`),o.addColorStop(1,`hsl(360, ${t}%, ${n}%)`),xe.fillStyle=o,xe.fillRect(0,0,256,32),xe.beginPath(),xe.moveTo(256*e/360,0),xe.lineTo(256*e/360,32),xe.stroke(),document.getElementById("input-h").value=`${e}`}(He.h,He.s,He.l),function(e,t,n){const o=Re.createLinearGradient(0,0,Ie.width,0);o.addColorStop(0,`hsl(${e}, 0%, ${n}%)`),o.addColorStop(1,`hsl(${e}, 100%, ${n}%)`),Re.fillStyle=o,Re.fillRect(0,0,256,32),Re.beginPath(),Re.moveTo(256*t/100,0),Re.lineTo(256*t/100,32),Re.stroke(),document.getElementById("input-s").value=`${t}`}(He.h,He.s,He.l),function(e,t,n){const o=ke.createLinearGradient(0,0,Me.width,0);o.addColorStop(0,`hsl(${e}, ${t}%, 0%)`),o.addColorStop(.5,`hsl(${e}, ${t}%, 50%)`),o.addColorStop(1,`hsl(${e}, ${t}%, 100%)`),ke.fillStyle=o,ke.fillRect(0,0,256,32),ke.beginPath(),ke.moveTo(256*n/100,0),ke.lineTo(256*n/100,32),ke.stroke(),document.getElementById("input-l").value=`${n}`}(He.h,He.s,He.l),function(e,t,n){const o=Ye.createLinearGradient(0,0,Ue.width,0);o.addColorStop(0,`rgb(0, ${t}, ${n})`),o.addColorStop(1,`rgb(255, ${t}, ${n})`),Ye.fillStyle=o,Ye.fillRect(0,0,256,32),Ye.beginPath(),Ye.moveTo(e,0),Ye.lineTo(e,32),Ye.stroke(),document.getElementById("input-r").value=`${e}`}(Ke.r,Ke.g,Ke.b),function(e,t,n){const o=Qe.createLinearGradient(0,0,De.width,0);o.addColorStop(0,`rgb(${e}, 0, ${n})`),o.addColorStop(1,`rgb(${e}, 255, ${n})`),Qe.fillStyle=o,Qe.fillRect(0,0,256,32),Qe.beginPath(),Qe.moveTo(t,0),Qe.lineTo(t,32),Qe.stroke(),document.getElementById("input-g").value=`${t}`}(Ke.r,Ke.g,Ke.b),function(e,t,n){const o=je.createLinearGradient(0,0,Ne.width,0);o.addColorStop(0,`rgb(${e}, ${t}, 0)`),o.addColorStop(1,`rgb(${e}, ${t}, 255)`),je.fillStyle=o,je.fillRect(0,0,256,32),je.beginPath(),je.moveTo(n,0),je.lineTo(n,32),je.stroke(),document.getElementById("input-b").value=`${n}`}(Ke.r,Ke.g,Ke.b),function(e,t,n,o){const l=Te.createLinearGradient(0,0,Xe.width,0);l.addColorStop(0,`rgba(${255*e}, ${255*t}, ${255*n}, 0)`),l.addColorStop(1,`rgba(${255*e}, ${255*t}, ${255*n}, 255)`),Te.clearRect(0,0,Xe.width,Xe.height),Te.fillStyle=l,Te.fillRect(0,0,256,32),Te.beginPath(),Te.moveTo(o,0),Te.lineTo(o,32),Te.stroke(),document.getElementById("input-a").value=`${o}`}(Oe[Je].color.r,Oe[Je].color.g,Oe[Je].color.b,Oe[Je].alpha),document.getElementById("input-result").value=Oe[Je].color.getHexString()+Oe[Je].alpha.toString(16)}Pe(window.innerWidth),_e(window.innerHeight),Ve(),Ve(),Ve(),Ze(0);const at={},rt={},it={x:-1,y:-1};function ct(){L.setFromCamera(k,Ce);const e=L.intersectObjects(O.children);if(e.length>0){let t;if(!X&&ve.visible)t=e[0];else if(t=e[1],t.object===ve)return;dt(Math.floor(64*t.uv.x),64-Math.floor(64*t.uv.y)-1),nt()}}function At(){L.setFromCamera(k,Ce);const e=L.intersectObjects(O.children);if(e.length>0){let t;!X&&ve.visible?st(e[0])||st(e[1]):(t=e[1],st(t))}}function st(e){var t;const n=Math.floor(64*e.uv.x),o=64-Math.floor(64*e.uv.y)-1,l=null==(t=te[_])?void 0:t.getImageData(n,o,1,1).data;return et(l[3]),lt("rgb",l[0],l[1],l[2]),0!==Oe[Je].alpha}function dt(e,t,n=!1){var o,l;(it.x<0||it.y<0)&&(it.x=e,it.y=t,ht(oe[_]),le[_]=[]),null==(o=te[_])||o.clearRect(e,t,1,1),n&&function(e,t,n,o){var l;const a=n-e,r=o-t,i=Math.sqrt(a*a+r*r);for(let c=0;c<i;c++)null==(l=te[_])||l.clearRect(Math.floor(e+a*c/i),Math.floor(t+r*c/i),1,1)}(e,t,it.x,it.y),0===j&&(te[_].fillStyle=`rgb(${255*Oe[Je].color.r}, ${255*Oe[Je].color.g}, ${255*Oe[Je].color.b}, ${Oe[Je].alpha/255})`,n&&function(e,t,n,o){var l;const a=n-e,r=o-t,i=Math.sqrt(a*a+r*r);for(let c=0;c<i;c++)null==(l=te[_])||l.fillRect(Math.floor(e+a*c/i),Math.floor(t+r*c/i),1,1)}(e,t,it.x,it.y),null==(l=te[_])||l.fillRect(e,t,1,1)),it.x=e,it.y=t,nt()}function ut(e,t){!function(e,t){fe.x=e,fe.y=t}(64*e/de.width/he+ge.x,64*t/de.height/he+ge.y),Q&&(1===j?function(e,t){const n=null==re?void 0:re.getImageData(e,t,1,1).data;et(n[3]),lt("rgb",n[0],n[1],n[2])}(Math.floor(fe.x),Math.floor(fe.y)):dt(Math.floor(fe.x),Math.floor(fe.y),!0))}function ht(e,t){var n,o,l;const a=document.createElement("canvas");a.width=64,a.height=64,null==(n=a.getContext("2d"))||n.drawImage(ee[_],0,0),e.push(a),t&&(null==(o=te[_])||o.clearRect(0,0,64,64),null==(l=te[_])||l.drawImage(t,0,0))}document.addEventListener("mousemove",(function(e){if(k.x=e.clientX/G*2-1,k.y=-e.clientY/W*2+1,Y&&(0===j||1===j||2===j))switch(N){case"h":ft(mt,y(e.clientX-Fe.clientLeft,0,256),360);break;case"s":ft(pt,y(e.clientX-Fe.clientLeft,0,256),100);break;case"l":ft(wt,y(e.clientX-Fe.clientLeft,0,256),100);break;case"r":ft(Et,y(e.clientX-Fe.clientLeft,0,256),255);break;case"g":ft(bt,y(e.clientX-Fe.clientLeft,0,256),255);break;case"b":ft(vt,y(e.clientX-Fe.clientLeft,0,256),255);break;case"a":ft(Ct,y(e.clientX-Fe.clientLeft,0,256),255);break;default:D&&(0===j||2===j?ct():At())}U&&0===j&&function(e,t){var n,o,l;B.setFromVector3(Ce.position),o=.007*t,l=.007*e,(n=B).theta-=l,n.phi=n.phi-o;let a=0,r=.01;B.phi<r&&(a=r-B.phi),B.phi>Math.PI-r&&(a=Math.PI-r-B.phi),B.phi+=a,Ce.position.setFromSpherical(B),I(Ce,S)}(e.movementX,e.movementY)})),de.addEventListener("mousemove",(function(e){ut(e.offsetX,e.offsetY)})),de.addEventListener("mousedown",(function(e){z(e.button),(0===e.button||1===e.button||2===e.button)&&(K(!0),ut(e.offsetX,e.offsetY))})),document.addEventListener("contextmenu",(function(e){e.preventDefault()})),document.addEventListener("wheel",(e=>{var t,n,o;e.ctrlKey||$e((t=Je+(e.deltaY>0?1:-1),n=0,t>(o=8)?n+t-o-1:t<n?o-(n-t-1):t))})),ye.domElement.addEventListener("wheel",(function(e){e.ctrlKey&&!(Ce.position.length()<1.2&&e.deltaY<0||Ce.position.length()>5&&e.deltaY>0)&&Ce.position.multiplyScalar(Math.pow(Math.pow(2,1/4),e.deltaY/100));e.preventDefault()})),de.addEventListener("wheel",(function(e){e.ctrlKey&&(!function(e){const t=y(he*Math.pow(Math.pow(2,1/4),e),1,8),n=ge.x,o=ge.y,l=fe.x,a=fe.y,r=64/t;ge={x:he/t*(n-l)+l,y:he/t*(o-a)+a},ge.x=y(ge.x,0,64-r),ge.y=y(ge.y,0,64-r),he=t}(e.deltaY/-100),nt());e.preventDefault()})),ye.domElement.addEventListener("mousemove",(e=>{nt()})),ye.domElement.addEventListener("mousedown",(function(e){z(e.button),L.setFromCamera(k,Ce);const t=L.intersectObjects(O.children);!e.ctrlKey&&t.length>0?(H(!0),0===e.button||2===e.button?ct():1===e.button&&At()):T(!0)})),document.addEventListener("mousedown",(function(e){F(!0),z(e.button)})),document.addEventListener("mouseup",(function(e){T(!1),F(!1),H(!1),K(!1),J(""),it.x=-1,it.y=-1})),document.addEventListener("keydown",(function(e){e.ctrlKey&&("KeyS"===e.code&&(M(),e.preventDefault()),"KeyZ"===e.code&&(e.shiftKey?function(){if(le[_].length>0){const e=le[_].pop();ht(oe[_],e)}}():function(){if(oe[_].length>0){const e=oe[_].pop();ht(le[_],e)}}()));"Tab"===e.code&&(ve.visible=!ve.visible,e.preventDefault());"Shift"===e.key&&(q(!0),e.preventDefault());nt(),at[e.key]=!0,rt[e.code]=!0})),document.addEventListener("keyup",(function(e){"Shift"===e.key&&q(!1);nt(),at[e.key]=!1,rt[e.code]=!1})),document.addEventListener("dragover",(e=>{e.preventDefault()}));const gt=new FileReader;function ft(e,t,n){e(t*n/256)}function mt(e){lt("hsl",e,He.s,He.l)}function pt(e){lt("hsl",He.h,e,He.l)}function wt(e){lt("hsl",He.h,He.s,e)}function Et(e){lt("rgb",e,Ke.g,Ke.b)}function bt(e){lt("rgb",Ke.r,e,Ke.b)}function vt(e){lt("rgb",Ke.r,Ke.g,e)}function Ct(e){et(Math.floor(e)),lt("rgb",Ke.r,Ke.g,Ke.b)}gt.addEventListener("load",(function(){me.src=gt.result,tt()}),!1),document.addEventListener("drop",(e=>{var t;if(e.preventDefault(),null==(t=e.dataTransfer)?void 0:t.items){if("file"===e.dataTransfer.items[0].kind){const t=e.dataTransfer.items[0].getAsFile();(null==t?void 0:t.name.endsWith(".png"))&&gt.readAsDataURL(t)}}else{const t=e.dataTransfer.files[0];t.name.endsWith("png")&&gt.readAsDataURL(t)}})),se.addEventListener("mouseenter",(e=>{se.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACJSURBVChTY2RgYPgPxPgASA0DE4jYevA/GP//D8EwNogGAjABVggCly+eYvj16xcYw9ggGqYYrhAZFKYbQFkMDPW1ZWCaBUxCgbVrDZQFASEhIVAWBPwHGg8Gly9fRsEgYGJXCrIbYTXITWpqaigYJAYDKG68desWCkYGcDeiuw8dEBPgQMDAAAApbl3gtKADlwAAAABJRU5ErkJggg=="})),se.addEventListener("mouseleave",(e=>{se.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACDSURBVChTjZCxDcAgDAQ/UWahYgAKxHhULEDDVFSMQkOwMYikiHLS2w96YYsDQOv6gjI4qcQYWa011vTUO/wQB4lSCmqtrOmpz/AK7njvxQEpJe4XV8E5J25grRW3BUMIyDnLaaC1hjGG/RpNOymlHqK7yWNHWn7Xzhr93u/Nnw/vADdsY0M0wsX8pgAAAABJRU5ErkJggg=="})),se.addEventListener("mousedown",(e=>{M()})),ze.addEventListener("mousedown",(function(e){const t=ze.clientWidth*(1/184),n=ze.clientWidth*(20/184);$e(y(Math.floor((e.offsetX-t)/n),0,8))})),window.addEventListener("resize",(function(){Pe(window.innerWidth),_e(window.innerHeight),ye.setSize(G,W),Ce.aspect=G/W,Ce.updateProjectionMatrix()})),Le.addEventListener("mousedown",(e=>{J("h"),ft(mt,e.offsetX,360)})),Ie.addEventListener("mousedown",(e=>{J("s"),ft(pt,e.offsetX,100)})),Me.addEventListener("mousedown",(e=>{J("l"),ft(wt,e.offsetX,100)})),Ue.addEventListener("mousedown",(e=>{J("r"),ft(Et,e.offsetX,255)})),De.addEventListener("mousedown",(e=>{J("g"),ft(bt,e.offsetX,255)})),Ne.addEventListener("mousedown",(e=>{J("b"),ft(vt,e.offsetX,255)})),Xe.addEventListener("mousedown",(e=>{J("a"),ft(Ct,e.offsetX,255)})),null==(e=document.getElementById("input-h"))||e.addEventListener("input",(function(e){mt(y(Number(this.value),0,360))})),null==(t=document.getElementById("input-s"))||t.addEventListener("input",(function(e){pt(y(Number(this.value),0,100))})),null==(n=document.getElementById("input-l"))||n.addEventListener("input",(function(e){wt(y(Number(this.value),0,100))})),null==(o=document.getElementById("input-r"))||o.addEventListener("input",(function(e){Et(y(Number(this.value),0,255))})),null==(l=document.getElementById("input-g"))||l.addEventListener("input",(function(e){bt(y(Number(this.value),0,255))})),null==(a=document.getElementById("input-b"))||a.addEventListener("input",(function(e){vt(y(Number(this.value),0,255))})),null==(r=document.getElementById("input-a"))||r.addEventListener("input",(function(e){Ct(y(Number(this.value),0,255))}));const yt=document.getElementsByClassName("up");for(const Mt of yt)Mt.addEventListener("mousedown",Bt),Mt.addEventListener("mouseenter",(function(e){this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAHCAYAAADebrddAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABXSURBVChTY8AK2O3+Q1kEAFDh1oP//2PTwASlIQCkcNdBhssXTzGYmJtj2MAIpVEUwsCaNWsYzpw8ycDw8xBYHUQxFoUwgKyBEZeJ6ACkAawYyicAGBgA8SEyl/0Y258AAAAASUVORK5CYII="})),Mt.addEventListener("mouseleave",(function(e){this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAHCAYAAADebrddAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVChThYzBEYAwCATRpqiVfvjQAs3E4QQHkzju5zhmgT4YmS/OzM4QESRaY5YhujsxMzq2yZEZPGKhqmRmMcIreRGLfhDy9uNMHEC+6x9EF8paKsuTxLiWAAAAAElFTkSuQmCC"}));const St=document.getElementsByClassName("down");for(const Mt of St)Mt.addEventListener("mousedown",Lt),Mt.addEventListener("mouseenter",(function(e){this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAHCAYAAADebrddAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABcSURBVChTY2Rgt/vPQCQAK9666yCUiwCXL56CshgY1qxZw3Dm5EmgYhCAakBWAAMwhQw/DzFCFIMAFg3ICqFCSACk4eD//x2TTv43sSv9T9g/UA2EFcIAVoUMDABzgTWRDJWebQAAAABJRU5ErkJggg=="})),Mt.addEventListener("mouseleave",(function(e){this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAHCAYAAADebrddAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABPSURBVChTjY9bCgAgCAS3+5/A+/jjFbxMpWVID2hAUZj92AKg9vnCZSIaX0JV5wUwM0TEZcMDWQhC7JSQjSOQxbUSK7CLLyxgpb+LX0SgAXA+LsskBDiEAAAAAElFTkSuQmCC"}));function Bt(e){switch(this.classList[1]){case"arrow-h":mt(y(He.h+1,0,360));break;case"arrow-s":pt(y(He.s+1,0,100));break;case"arrow-l":wt(y(He.l+1,0,100));break;case"arrow-r":Et(y(Ke.r+1,0,255));break;case"arrow-g":bt(y(Ke.g+1,0,255));break;case"arrow-b":vt(y(Ke.b+1,0,255));break;case"arrow-a":Ct(y(Oe[Je].alpha+1,0,255))}}function Lt(e){switch(this.classList[1]){case"arrow-h":mt(y(He.h-1,0,360));break;case"arrow-s":pt(y(He.s-1,0,100));break;case"arrow-l":wt(y(He.l-1,0,100));break;case"arrow-r":Et(y(Ke.r-1,0,255));break;case"arrow-g":bt(y(Ke.g-1,0,255));break;case"arrow-b":vt(y(Ke.b-1,0,255));break;case"arrow-a":Ct(y(Oe[Je].alpha-1,0,255))}}null==(i=document.getElementById("input-result"))||i.addEventListener("input",(function(e){lt("hex",(t=this.value,n=Oe[Je].color.getHex(),6!==t.length?n:Number("0x"+t)),0,0);var t,n}));const xt=document.getElementsByTagName("img");for(const Mt of xt)Mt.onmousedown=It;function It(e){e.preventDefault()}I(Ce,S);const Rt=function(){requestAnimationFrame(Rt),ye.render(O,Ce)};Rt();