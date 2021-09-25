import{V as e,S as t,R as n,B as o,a as i,C as r,b as l,c as s,N as a,M as d,D as c,d as u,P as h,W as f,e as m}from"./vendor.ef4446d9.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const p=new e,g=new t,b=new n,w=document.getElementById("link");function $(e,t){let n=t.clone();n.sub(e.position),e.rotation.y=-Math.atan2(n.x,-n.z),e.rotation.x=Math.atan2(n.y,Math.sqrt(n.x*n.x+n.z*n.z)),e.rotation.z=0}function v(e,t,n,i,r,l,s){let a=[[e+r,t],[e+r+n,t],[e+r,t-r],[e+r+n,t-r]],d=[[e+r+n,t-r],[e+r+n+n,t-r],[e+r+n,t],[e+r+n+n,t]],c=[[e,t-r],[e+r,t-r],[e,t-r-i],[e+r,t-r-i]],u=[[e+r,t-r],[e+n+r,t-r],[e+r,t-r-i],[e+n+r,t-r-i]],h=[[e+r+n,t-r],[e+r+r+n,t-r],[e+r+n,t-r-i],[e+r+r+n,t-r-i]],f=[[e+r+n+r,t-r],[e+r+n+r+n,t-r],[e+r+n+r,t-r-i],[e+r+n+r+n,t-r-i]],m=[];for(let o of h)m.push(o[0]/l),m.push(o[1]/s);for(let o of c)m.push(o[0]/l),m.push(o[1]/s);for(let o of a)m.push(o[0]/l),m.push(o[1]/s);for(let o of d)m.push(o[0]/l),m.push(o[1]/s);for(let o of u)m.push(o[0]/l),m.push(o[1]/s);for(let o of f)m.push(o[0]/l),m.push(o[1]/s);return new o(new Float32Array(m),2)}let y=window.innerWidth,S=window.innerHeight;const C=new i;C.background=new r(3684408);const x=v(0,64,8,8,8,64,64),E=new l;E.setAttribute("uv",x);const L=v(32,64,8,8,8,64,64),M=new l;M.setAttribute("uv",L);const k=document.createElement("canvas");k.width=64,k.height=64;const T=k.getContext("2d"),I=document.createElement("img");I.src="../img/neferupitou.png",I.addEventListener("load",(()=>{null==T||T.drawImage(I,0,0),_()}));const P=new s(k);P.minFilter=a,P.magFilter=a;const R=new d({color:16777215,transparent:!1,map:P,alphaTest:.5,depthWrite:!0,depthTest:!0,side:c}),B=new u(E,R);C.add(B);const X=new u(M,R);X.scale.multiplyScalar(9/8),C.add(X);const F=new h(75,y/S,.1,1e3);F.rotation.order="ZYX",F.position.set(1.1,1.1,1.1);const z=new f;z.setSize(y,S),document.body.appendChild(z.domElement);const A=document.getElementById("color-result").getContext("2d"),D=document.getElementById("color-h"),G=D.getContext("2d"),j=document.getElementById("color-s"),N=j.getContext("2d"),W=document.getElementById("color-l"),q=W.getContext("2d"),H=document.getElementById("color-r"),K=H.getContext("2d"),O=document.getElementById("color-g"),Y=O.getContext("2d"),U=document.getElementById("color-b"),V=U.getContext("2d"),Z={h:0,s:0,l:0},J={r:0,g:0,b:0},Q=new r;function _(){R.map.needsUpdate=!0}function ee(e,t,n,o){t=Math.floor(t),n=Math.floor(n),o=Math.floor(o),"hsl"===e&&(Z.h=t,Z.s=n,Z.l=o,Q.set(`hsl(${t}, ${n}%, ${o}%)`),J.r=255*Q.r,J.g=255*Q.g,J.b=255*Q.b),"rgb"===e&&(J.r=t,J.g=n,J.b=o,Q.set(`rgb(${t}, ${n}, ${o})`),Q.getHSL(Z),Z.h*=360,Z.s*=100,Z.l*=100),A.fillStyle=Q.getStyle(),A.fillRect(0,0,256,32),function(e,t,n){const o=G.createLinearGradient(0,0,D.width,0);o.addColorStop(0,`hsl(0, ${t}%, ${n}%)`),o.addColorStop(.15,`hsl(60, ${t}%, ${n}%)`),o.addColorStop(.33,`hsl(120, ${t}%, ${n}%)`),o.addColorStop(.49,`hsl(180, ${t}%, ${n}%)`),o.addColorStop(.67,`hsl(240, ${t}%, ${n}%)`),o.addColorStop(.84,`hsl(300, ${t}%, ${n}%)`),o.addColorStop(1,`hsl(360, ${t}%, ${n}%)`),G.fillStyle=o,G.fillRect(0,0,256,32),G.beginPath(),G.moveTo(256*e/360,0),G.lineTo(256*e/360,32),G.stroke()}(Z.h,Z.s,Z.l),function(e,t,n){const o=N.createLinearGradient(0,0,j.width,0);o.addColorStop(0,`hsl(${e}, 0%, ${n}%)`),o.addColorStop(1,`hsl(${e}, 100%, ${n}%)`),N.fillStyle=o,N.fillRect(0,0,256,32),N.beginPath(),N.moveTo(256*t/100,0),N.lineTo(256*t/100,32),N.stroke()}(Z.h,Z.s,Z.l),function(e,t,n){const o=q.createLinearGradient(0,0,W.width,0);o.addColorStop(0,`hsl(${e}, ${t}%, 0%)`),o.addColorStop(.5,`hsl(${e}, ${t}%, 50%)`),o.addColorStop(1,`hsl(${e}, ${t}%, 100%)`),q.fillStyle=o,q.fillRect(0,0,256,32),q.beginPath(),q.moveTo(256*n/100,0),q.lineTo(256*n/100,32),q.stroke()}(Z.h,Z.s,Z.l),function(e,t,n){const o=K.createLinearGradient(0,0,H.width,0);o.addColorStop(0,`rgb(0, ${t}, ${n})`),o.addColorStop(1,`rgb(255, ${t}, ${n})`),K.fillStyle=o,K.fillRect(0,0,256,32),K.beginPath(),K.moveTo(e,0),K.lineTo(e,32),K.stroke()}(J.r,J.g,J.b),function(e,t,n){const o=Y.createLinearGradient(0,0,O.width,0);o.addColorStop(0,`rgb(${e}, 0, ${n})`),o.addColorStop(1,`rgb(${e}, 255, ${n})`),Y.fillStyle=o,Y.fillRect(0,0,256,32),Y.beginPath(),Y.moveTo(t,0),Y.lineTo(t,32),Y.stroke()}(J.r,J.g,J.b),function(e,t,n){const o=V.createLinearGradient(0,0,U.width,0);o.addColorStop(0,`rgb(${e}, ${t}, 0)`),o.addColorStop(1,`rgb(${e}, ${t}, 255)`),V.fillStyle=o,V.fillRect(0,0,256,32),V.beginPath(),V.moveTo(n,0),V.lineTo(n,32),V.stroke()}(J.r,J.g,J.b)}ee("hsl",0,100,50);const te=new m;let ne=!1,oe=!1,ie="",re=-1;let le=!1;function se(e){ne=e}function ae(e){oe=e}function de(e){ie=e}function ce(e){le=e}function ue(e){de("h"),ee("hsl",360*e/256,Z.s,Z.l)}function he(e){de("s"),ee("hsl",Z.h,100*e/256,Z.l)}function fe(e){de("l"),ee("hsl",Z.h,Z.s,100*e/256)}function me(e){de("r"),ee("rgb",e/256*255,J.g,J.b)}function pe(e){de("g"),ee("rgb",J.r,e/256*255,J.b)}function ge(e){de("b"),ee("rgb",J.r,J.g,e/256*255)}document.addEventListener("mousemove",(function(e){if(te.x=e.clientX/y*2-1,te.y=-e.clientY/S*2+1,ne&&0==re)if("h"===ie)ue(Math.min(Math.max(0,e.clientX),256));else if("s"===ie)he(Math.min(Math.max(0,e.clientX),256));else if("l"===ie)fe(Math.min(Math.max(0,e.clientX),256));else if("r"===ie)me(Math.min(Math.max(0,e.clientX),256));else if("g"===ie)pe(Math.min(Math.max(0,e.clientX),256));else if("b"===ie)ge(Math.min(Math.max(0,e.clientX),256));else if(oe){b.setFromCamera(te,F);const e=b.intersectObjects(C.children);if(e.length>0){let t;t=!le&&X.visible?e[0]:e[1];const n=Math.floor(64*t.uv.x),o=Math.floor(64*t.uv.y);T.fillStyle=Q.getStyle(),null==T||T.fillRect(n,64-o-1,1,1),_()}}else!function(e,t){var n,o,i;g.setFromVector3(F.position),o=.007*t,i=.007*e,(n=g).theta-=i,n.phi=n.phi-o;let r=0,l=.01;g.phi<l&&(r=l-g.phi),g.phi>Math.PI-l&&(r=Math.PI-l-g.phi),g.phi+=r,F.position.setFromSpherical(g),$(F,p)}(e.movementX,e.movementY)})),document.addEventListener("mousedown",(function(e){e.preventDefault(),b.setFromCamera(te,F);b.intersectObjects(C.children).length>0&&ae(!0);se(!0),t=e.button,re=t;var t})),document.addEventListener("mouseup",(function(e){e.preventDefault(),se(!1),ae(!1),de("")})),document.addEventListener("keydown",(function(e){e.ctrlKey&&"KeyS"==e.code&&(w.setAttribute("download","skin.png"),w.setAttribute("href",k.toDataURL("image/png").replace("image/png","image/octet-stream")),w.click());"Tab"==e.code&&(X.visible=!X.visible);"Shift"==e.key&&ce(!0);e.preventDefault()})),document.addEventListener("keyup",(function(e){"Shift"==e.key&&ce(!1);e.preventDefault()})),window.addEventListener("resize",(function(){e=window.innerWidth,y=e,function(e){S=e}(window.innerHeight),z.setSize(y,S),F.aspect=y/S,F.updateProjectionMatrix();var e})),D.addEventListener("mousedown",(e=>ue(e.x))),j.addEventListener("mousedown",(e=>he(e.x))),W.addEventListener("mousedown",(e=>fe(e.x))),H.addEventListener("mousedown",(e=>me(e.x))),O.addEventListener("mousedown",(e=>pe(e.x))),U.addEventListener("mousedown",(e=>ge(e.x))),$(F,p);const be=function(){requestAnimationFrame(be),z.render(C,F)};be();