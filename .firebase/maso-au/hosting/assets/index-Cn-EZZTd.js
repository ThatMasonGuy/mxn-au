(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();/**
* @vue/shared v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function od(t,e){const n=new Set(t.split(","));return r=>n.has(r)}const st={},ci=[],gn=()=>{},yI=()=>!1,pc=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),ad=t=>t.startsWith("onUpdate:"),vt=Object.assign,ld=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},vI=Object.prototype.hasOwnProperty,Ve=(t,e)=>vI.call(t,e),fe=Array.isArray,ui=t=>gc(t)==="[object Map]",fy=t=>gc(t)==="[object Set]",Ee=t=>typeof t=="function",dt=t=>typeof t=="string",Us=t=>typeof t=="symbol",it=t=>t!==null&&typeof t=="object",py=t=>(it(t)||Ee(t))&&Ee(t.then)&&Ee(t.catch),gy=Object.prototype.toString,gc=t=>gy.call(t),wI=t=>gc(t).slice(8,-1),my=t=>gc(t)==="[object Object]",cd=t=>dt(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,To=od(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),mc=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},EI=/-(\w)/g,Kn=mc(t=>t.replace(EI,(e,n)=>n?n.toUpperCase():"")),bI=/\B([A-Z])/g,Mi=mc(t=>t.replace(bI,"-$1").toLowerCase()),_c=mc(t=>t.charAt(0).toUpperCase()+t.slice(1)),Iu=mc(t=>t?`on${_c(t)}`:""),Gr=(t,e)=>!Object.is(t,e),pl=(t,e)=>{for(let n=0;n<t.length;n++)t[n](e)},_y=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},rh=t=>{const e=parseFloat(t);return isNaN(e)?t:e},II=t=>{const e=dt(t)?Number(t):NaN;return isNaN(e)?t:e};let eg;const yy=()=>eg||(eg=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Kr(t){if(fe(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=dt(r)?SI(r):Kr(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(dt(t)||it(t))return t}const TI=/;(?![^(]*\))/g,CI=/:([^]+)/,AI=/\/\*[^]*?\*\//g;function SI(t){const e={};return t.replace(AI,"").split(TI).forEach(n=>{if(n){const r=n.split(CI);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function $t(t){let e="";if(dt(t))e=t;else if(fe(t))for(let n=0;n<t.length;n++){const r=$t(t[n]);r&&(e+=r+" ")}else if(it(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function sh(t){if(!t)return null;let{class:e,style:n}=t;return e&&!dt(e)&&(t.class=$t(e)),n&&(t.style=Kr(n)),t}const RI="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",PI=od(RI);function vy(t){return!!t||t===""}const Vr=t=>dt(t)?t:t==null?"":fe(t)||it(t)&&(t.toString===gy||!Ee(t.toString))?JSON.stringify(t,wy,2):String(t),wy=(t,e)=>e&&e.__v_isRef?wy(t,e.value):ui(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[Tu(r,i)+" =>"]=s,n),{})}:fy(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Tu(n))}:Us(e)?Tu(e):it(e)&&!fe(e)&&!my(e)?String(e):e,Tu=(t,e="")=>{var n;return Us(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let In;class Ey{constructor(e=!1){this.detached=e,this._active=!0,this.effects=[],this.cleanups=[],this.parent=In,!e&&In&&(this.index=(In.scopes||(In.scopes=[])).push(this)-1)}get active(){return this._active}run(e){if(this._active){const n=In;try{return In=this,e()}finally{In=n}}}on(){In=this}off(){In=this.parent}stop(e){if(this._active){let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.scopes)for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0,this._active=!1}}}function xI(t){return new Ey(t)}function kI(t,e=In){e&&e.active&&e.effects.push(t)}function NI(){return In}let Is;class ud{constructor(e,n,r,s){this.fn=e,this.trigger=n,this.scheduler=r,this.active=!0,this.deps=[],this._dirtyLevel=4,this._trackId=0,this._runnings=0,this._shouldSchedule=!1,this._depsLength=0,kI(this,s)}get dirty(){if(this._dirtyLevel===2||this._dirtyLevel===3){this._dirtyLevel=1,es();for(let e=0;e<this._depsLength;e++){const n=this.deps[e];if(n.computed&&(DI(n.computed),this._dirtyLevel>=4))break}this._dirtyLevel===1&&(this._dirtyLevel=0),ts()}return this._dirtyLevel>=4}set dirty(e){this._dirtyLevel=e?4:0}run(){if(this._dirtyLevel=0,!this.active)return this.fn();let e=Br,n=Is;try{return Br=!0,Is=this,this._runnings++,tg(this),this.fn()}finally{ng(this),this._runnings--,Is=n,Br=e}}stop(){this.active&&(tg(this),ng(this),this.onStop&&this.onStop(),this.active=!1)}}function DI(t){return t.value}function tg(t){t._trackId++,t._depsLength=0}function ng(t){if(t.deps.length>t._depsLength){for(let e=t._depsLength;e<t.deps.length;e++)by(t.deps[e],t);t.deps.length=t._depsLength}}function by(t,e){const n=t.get(e);n!==void 0&&e._trackId!==n&&(t.delete(e),t.size===0&&t.cleanup())}let Br=!0,ih=0;const Iy=[];function es(){Iy.push(Br),Br=!1}function ts(){const t=Iy.pop();Br=t===void 0?!0:t}function hd(){ih++}function dd(){for(ih--;!ih&&oh.length;)oh.shift()()}function Ty(t,e,n){if(e.get(t)!==t._trackId){e.set(t,t._trackId);const r=t.deps[t._depsLength];r!==e?(r&&by(r,t),t.deps[t._depsLength++]=e):t._depsLength++}}const oh=[];function Cy(t,e,n){hd();for(const r of t.keys()){let s;r._dirtyLevel<e&&(s??(s=t.get(r)===r._trackId))&&(r._shouldSchedule||(r._shouldSchedule=r._dirtyLevel===0),r._dirtyLevel=e),r._shouldSchedule&&(s??(s=t.get(r)===r._trackId))&&(r.trigger(),(!r._runnings||r.allowRecurse)&&r._dirtyLevel!==2&&(r._shouldSchedule=!1,r.scheduler&&oh.push(r.scheduler)))}dd()}const Ay=(t,e)=>{const n=new Map;return n.cleanup=t,n.computed=e,n},Pl=new WeakMap,Ts=Symbol(""),ah=Symbol("");function nn(t,e,n){if(Br&&Is){let r=Pl.get(t);r||Pl.set(t,r=new Map);let s=r.get(n);s||r.set(n,s=Ay(()=>r.delete(n))),Ty(Is,s)}}function ar(t,e,n,r,s,i){const o=Pl.get(t);if(!o)return;let a=[];if(e==="clear")a=[...o.values()];else if(n==="length"&&fe(t)){const c=Number(r);o.forEach((u,h)=>{(h==="length"||!Us(h)&&h>=c)&&a.push(u)})}else switch(n!==void 0&&a.push(o.get(n)),e){case"add":fe(t)?cd(n)&&a.push(o.get("length")):(a.push(o.get(Ts)),ui(t)&&a.push(o.get(ah)));break;case"delete":fe(t)||(a.push(o.get(Ts)),ui(t)&&a.push(o.get(ah)));break;case"set":ui(t)&&a.push(o.get(Ts));break}hd();for(const c of a)c&&Cy(c,4);dd()}function OI(t,e){const n=Pl.get(t);return n&&n.get(e)}const MI=od("__proto__,__v_isRef,__isVue"),Sy=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Us)),rg=LI();function LI(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...n){const r=Ue(this);for(let i=0,o=this.length;i<o;i++)nn(r,"get",i+"");const s=r[e](...n);return s===-1||s===!1?r[e](...n.map(Ue)):s}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...n){es(),hd();const r=Ue(this)[e].apply(this,n);return dd(),ts(),r}}),t}function VI(t){Us(t)||(t=String(t));const e=Ue(this);return nn(e,"has",t),e.hasOwnProperty(t)}class Ry{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?QI:Ny:i?ky:xy).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=fe(e);if(!s){if(o&&Ve(rg,n))return Reflect.get(rg,n,r);if(n==="hasOwnProperty")return VI}const a=Reflect.get(e,n,r);return(Us(n)?Sy.has(n):MI(n))||(s||nn(e,"get",n),i)?a:zt(a)?o&&cd(n)?a:a.value:it(a)?s?Oy(a):Li(a):a}}class Py extends Ry{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];if(!this._isShallow){const c=Ho(i);if(!xl(r)&&!Ho(r)&&(i=Ue(i),r=Ue(r)),!fe(e)&&zt(i)&&!zt(r))return c?!1:(i.value=r,!0)}const o=fe(e)&&cd(n)?Number(n)<e.length:Ve(e,n),a=Reflect.set(e,n,r,s);return e===Ue(s)&&(o?Gr(r,i)&&ar(e,"set",n,r):ar(e,"add",n,r)),a}deleteProperty(e,n){const r=Ve(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&ar(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!Us(n)||!Sy.has(n))&&nn(e,"has",n),r}ownKeys(e){return nn(e,"iterate",fe(e)?"length":Ts),Reflect.ownKeys(e)}}class FI extends Ry{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const UI=new Py,BI=new FI,$I=new Py(!0);const fd=t=>t,yc=t=>Reflect.getPrototypeOf(t);function Za(t,e,n=!1,r=!1){t=t.__v_raw;const s=Ue(t),i=Ue(e);n||(Gr(e,i)&&nn(s,"get",e),nn(s,"get",i));const{has:o}=yc(s),a=r?fd:n?md:Wo;if(o.call(s,e))return a(t.get(e));if(o.call(s,i))return a(t.get(i));t!==s&&t.get(e)}function el(t,e=!1){const n=this.__v_raw,r=Ue(n),s=Ue(t);return e||(Gr(t,s)&&nn(r,"has",t),nn(r,"has",s)),t===s?n.has(t):n.has(t)||n.has(s)}function tl(t,e=!1){return t=t.__v_raw,!e&&nn(Ue(t),"iterate",Ts),Reflect.get(t,"size",t)}function sg(t){t=Ue(t);const e=Ue(this);return yc(e).has.call(e,t)||(e.add(t),ar(e,"add",t,t)),this}function ig(t,e){e=Ue(e);const n=Ue(this),{has:r,get:s}=yc(n);let i=r.call(n,t);i||(t=Ue(t),i=r.call(n,t));const o=s.call(n,t);return n.set(t,e),i?Gr(e,o)&&ar(n,"set",t,e):ar(n,"add",t,e),this}function og(t){const e=Ue(this),{has:n,get:r}=yc(e);let s=n.call(e,t);s||(t=Ue(t),s=n.call(e,t)),r&&r.call(e,t);const i=e.delete(t);return s&&ar(e,"delete",t,void 0),i}function ag(){const t=Ue(this),e=t.size!==0,n=t.clear();return e&&ar(t,"clear",void 0,void 0),n}function nl(t,e){return function(r,s){const i=this,o=i.__v_raw,a=Ue(o),c=e?fd:t?md:Wo;return!t&&nn(a,"iterate",Ts),o.forEach((u,h)=>r.call(s,c(u),c(h),i))}}function rl(t,e,n){return function(...r){const s=this.__v_raw,i=Ue(s),o=ui(i),a=t==="entries"||t===Symbol.iterator&&o,c=t==="keys"&&o,u=s[t](...r),h=n?fd:e?md:Wo;return!e&&nn(i,"iterate",c?ah:Ts),{next(){const{value:f,done:g}=u.next();return g?{value:f,done:g}:{value:a?[h(f[0]),h(f[1])]:h(f),done:g}},[Symbol.iterator](){return this}}}}function br(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function jI(){const t={get(i){return Za(this,i)},get size(){return tl(this)},has:el,add:sg,set:ig,delete:og,clear:ag,forEach:nl(!1,!1)},e={get(i){return Za(this,i,!1,!0)},get size(){return tl(this)},has:el,add:sg,set:ig,delete:og,clear:ag,forEach:nl(!1,!0)},n={get(i){return Za(this,i,!0)},get size(){return tl(this,!0)},has(i){return el.call(this,i,!0)},add:br("add"),set:br("set"),delete:br("delete"),clear:br("clear"),forEach:nl(!0,!1)},r={get(i){return Za(this,i,!0,!0)},get size(){return tl(this,!0)},has(i){return el.call(this,i,!0)},add:br("add"),set:br("set"),delete:br("delete"),clear:br("clear"),forEach:nl(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(i=>{t[i]=rl(i,!1,!1),n[i]=rl(i,!0,!1),e[i]=rl(i,!1,!0),r[i]=rl(i,!0,!0)}),[t,n,e,r]}const[qI,HI,WI,zI]=jI();function pd(t,e){const n=e?t?zI:WI:t?HI:qI;return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(Ve(n,s)&&s in r?n:r,s,i)}const GI={get:pd(!1,!1)},KI={get:pd(!1,!0)},YI={get:pd(!0,!1)};const xy=new WeakMap,ky=new WeakMap,Ny=new WeakMap,QI=new WeakMap;function XI(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function JI(t){return t.__v_skip||!Object.isExtensible(t)?0:XI(wI(t))}function Li(t){return Ho(t)?t:gd(t,!1,UI,GI,xy)}function Dy(t){return gd(t,!1,$I,KI,ky)}function Oy(t){return gd(t,!0,BI,YI,Ny)}function gd(t,e,n,r,s){if(!it(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=s.get(t);if(i)return i;const o=JI(t);if(o===0)return t;const a=new Proxy(t,o===2?r:n);return s.set(t,a),a}function Co(t){return Ho(t)?Co(t.__v_raw):!!(t&&t.__v_isReactive)}function Ho(t){return!!(t&&t.__v_isReadonly)}function xl(t){return!!(t&&t.__v_isShallow)}function My(t){return t?!!t.__v_raw:!1}function Ue(t){const e=t&&t.__v_raw;return e?Ue(e):t}function ZI(t){return Object.isExtensible(t)&&_y(t,"__v_skip",!0),t}const Wo=t=>it(t)?Li(t):t,md=t=>it(t)?Oy(t):t;class Ly{constructor(e,n,r,s){this.getter=e,this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this.effect=new ud(()=>e(this._value),()=>gl(this,this.effect._dirtyLevel===2?2:3)),this.effect.computed=this,this.effect.active=this._cacheable=!s,this.__v_isReadonly=r}get value(){const e=Ue(this);return(!e._cacheable||e.effect.dirty)&&Gr(e._value,e._value=e.effect.run())&&gl(e,4),Vy(e),e.effect._dirtyLevel>=2&&gl(e,2),e._value}set value(e){this._setter(e)}get _dirty(){return this.effect.dirty}set _dirty(e){this.effect.dirty=e}}function eT(t,e,n=!1){let r,s;const i=Ee(t);return i?(r=t,s=gn):(r=t.get,s=t.set),new Ly(r,s,i||!s,n)}function Vy(t){var e;Br&&Is&&(t=Ue(t),Ty(Is,(e=t.dep)!=null?e:t.dep=Ay(()=>t.dep=void 0,t instanceof Ly?t:void 0)))}function gl(t,e=4,n){t=Ue(t);const r=t.dep;r&&Cy(r,e)}function zt(t){return!!(t&&t.__v_isRef===!0)}function he(t){return Fy(t,!1)}function tT(t){return Fy(t,!0)}function Fy(t,e){return zt(t)?t:new nT(t,e)}class nT{constructor(e,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?e:Ue(e),this._value=n?e:Wo(e)}get value(){return Vy(this),this._value}set value(e){const n=this.__v_isShallow||xl(e)||Ho(e);e=n?e:Ue(e),Gr(e,this._rawValue)&&(this._rawValue=e,this._value=n?e:Wo(e),gl(this,4))}}function qe(t){return zt(t)?t.value:t}const rT={get:(t,e,n)=>qe(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return zt(s)&&!zt(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function Uy(t){return Co(t)?t:new Proxy(t,rT)}function sT(t){const e=fe(t)?new Array(t.length):{};for(const n in t)e[n]=oT(t,n);return e}class iT{constructor(e,n,r){this._object=e,this._key=n,this._defaultValue=r,this.__v_isRef=!0}get value(){const e=this._object[this._key];return e===void 0?this._defaultValue:e}set value(e){this._object[this._key]=e}get dep(){return OI(Ue(this._object),this._key)}}function oT(t,e,n){const r=t[e];return zt(r)?r:new iT(t,e,n)}/**
* @vue/runtime-core v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function $r(t,e,n,r){try{return r?t(...r):t()}catch(s){vc(s,e,n)}}function mn(t,e,n,r){if(Ee(t)){const s=$r(t,e,n,r);return s&&py(s)&&s.catch(i=>{vc(i,e,n)}),s}if(fe(t)){const s=[];for(let i=0;i<t.length;i++)s.push(mn(t[i],e,n,r));return s}}function vc(t,e,n,r=!0){const s=e?e.vnode:null;if(e){let i=e.parent;const o=e.proxy,a=`https://vuejs.org/error-reference/#runtime-${n}`;for(;i;){const u=i.ec;if(u){for(let h=0;h<u.length;h++)if(u[h](t,o,a)===!1)return}i=i.parent}const c=e.appContext.config.errorHandler;if(c){es(),$r(c,null,10,[t,o,a]),ts();return}}aT(t,n,s,r)}function aT(t,e,n,r=!0){console.error(t)}let zo=!1,lh=!1;const Ht=[];let Bn=0;const hi=[];let Pr=null,gs=0;const By=Promise.resolve();let _d=null;function wc(t){const e=_d||By;return t?e.then(this?t.bind(this):t):e}function lT(t){let e=Bn+1,n=Ht.length;for(;e<n;){const r=e+n>>>1,s=Ht[r],i=Go(s);i<t||i===t&&s.pre?e=r+1:n=r}return e}function yd(t){(!Ht.length||!Ht.includes(t,zo&&t.allowRecurse?Bn+1:Bn))&&(t.id==null?Ht.push(t):Ht.splice(lT(t.id),0,t),$y())}function $y(){!zo&&!lh&&(lh=!0,_d=By.then(qy))}function cT(t){const e=Ht.indexOf(t);e>Bn&&Ht.splice(e,1)}function uT(t){fe(t)?hi.push(...t):(!Pr||!Pr.includes(t,t.allowRecurse?gs+1:gs))&&hi.push(t),$y()}function lg(t,e,n=zo?Bn+1:0){for(;n<Ht.length;n++){const r=Ht[n];if(r&&r.pre){if(t&&r.id!==t.uid)continue;Ht.splice(n,1),n--,r()}}}function jy(t){if(hi.length){const e=[...new Set(hi)].sort((n,r)=>Go(n)-Go(r));if(hi.length=0,Pr){Pr.push(...e);return}for(Pr=e,gs=0;gs<Pr.length;gs++)Pr[gs]();Pr=null,gs=0}}const Go=t=>t.id==null?1/0:t.id,hT=(t,e)=>{const n=Go(t)-Go(e);if(n===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return n};function qy(t){lh=!1,zo=!0,Ht.sort(hT);try{for(Bn=0;Bn<Ht.length;Bn++){const e=Ht[Bn];e&&e.active!==!1&&$r(e,null,14)}}finally{Bn=0,Ht.length=0,jy(),zo=!1,_d=null,(Ht.length||hi.length)&&qy()}}function dT(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||st;let s=n;const i=e.startsWith("update:"),o=i&&e.slice(7);if(o&&o in r){const h=`${o==="modelValue"?"model":o}Modifiers`,{number:f,trim:g}=r[h]||st;g&&(s=n.map(m=>dt(m)?m.trim():m)),f&&(s=n.map(rh))}let a,c=r[a=Iu(e)]||r[a=Iu(Kn(e))];!c&&i&&(c=r[a=Iu(Mi(e))]),c&&mn(c,t,6,s);const u=r[a+"Once"];if(u){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,mn(u,t,6,s)}}function Hy(t,e,n=!1){const r=e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!Ee(t)){const c=u=>{const h=Hy(u,e,!0);h&&(a=!0,vt(o,h))};!n&&e.mixins.length&&e.mixins.forEach(c),t.extends&&c(t.extends),t.mixins&&t.mixins.forEach(c)}return!i&&!a?(it(t)&&r.set(t,null),null):(fe(i)?i.forEach(c=>o[c]=null):vt(o,i),it(t)&&r.set(t,o),o)}function Ec(t,e){return!t||!pc(e)?!1:(e=e.slice(2).replace(/Once$/,""),Ve(t,e[0].toLowerCase()+e.slice(1))||Ve(t,Mi(e))||Ve(t,e))}let bt=null,bc=null;function kl(t){const e=bt;return bt=t,bc=t&&t.type.__scopeId||null,e}function fT(t){bc=t}function pT(){bc=null}function pe(t,e=bt,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&wg(-1);const i=kl(e);let o;try{o=t(...s)}finally{kl(i),r._d&&wg(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Cu(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:c,render:u,renderCache:h,props:f,data:g,setupState:m,ctx:C,inheritAttrs:R}=t,x=kl(t);let L,F;try{if(n.shapeFlag&4){const N=s||r,Q=N;L=Un(u.call(Q,N,h,f,m,g,C)),F=a}else{const N=e;L=Un(N.length>1?N(f,{attrs:a,slots:o,emit:c}):N(f,null)),F=e.props?a:gT(a)}}catch(N){xo.length=0,vc(N,t,1),L=re(Zt)}let B=L;if(F&&R!==!1){const N=Object.keys(F),{shapeFlag:Q}=B;N.length&&Q&7&&(i&&N.some(ad)&&(F=mT(F,i)),B=ur(B,F,!1,!0))}return n.dirs&&(B=ur(B,null,!1,!0),B.dirs=B.dirs?B.dirs.concat(n.dirs):n.dirs),n.transition&&(B.transition=n.transition),L=B,kl(x),L}const gT=t=>{let e;for(const n in t)(n==="class"||n==="style"||pc(n))&&((e||(e={}))[n]=t[n]);return e},mT=(t,e)=>{const n={};for(const r in t)(!ad(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function _T(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:c}=e,u=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?cg(r,o,u):!!o;if(c&8){const h=e.dynamicProps;for(let f=0;f<h.length;f++){const g=h[f];if(o[g]!==r[g]&&!Ec(u,g))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?cg(r,o,u):!0:!!o;return!1}function cg(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(e[i]!==t[i]&&!Ec(n,i))return!0}return!1}function yT({vnode:t,parent:e},n){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===t&&(r.el=t.el),r===t)(t=e.vnode).el=n,e=e.parent;else break}}const vd="components";function Nt(t,e){return zy(vd,t,!0,e)||t}const Wy=Symbol.for("v-ndc");function oi(t){return dt(t)?zy(vd,t,!1)||t:t||Wy}function zy(t,e,n=!0,r=!1){const s=bt||Dt;if(s){const i=s.type;if(t===vd){const a=hC(i,!1);if(a&&(a===e||a===Kn(e)||a===_c(Kn(e))))return i}const o=ug(s[t]||i[t],e)||ug(s.appContext[t],e);return!o&&r?i:o}}function ug(t,e){return t&&(t[e]||t[Kn(e)]||t[_c(Kn(e))])}const vT=t=>t.__isSuspense;function wT(t,e){e&&e.pendingBranch?fe(t)?e.effects.push(...t):e.effects.push(t):uT(t)}const ET=Symbol.for("v-scx"),bT=()=>kn(ET);function Cs(t,e){return wd(t,null,e)}const sl={};function _n(t,e,n){return wd(t,e,n)}function wd(t,e,{immediate:n,deep:r,flush:s,once:i,onTrack:o,onTrigger:a}=st){if(e&&i){const $=e;e=(...A)=>{$(...A),Q()}}const c=Dt,u=$=>r===!0?$:_s($,r===!1?1:void 0);let h,f=!1,g=!1;if(zt(t)?(h=()=>t.value,f=xl(t)):Co(t)?(h=()=>u(t),f=!0):fe(t)?(g=!0,f=t.some($=>Co($)||xl($)),h=()=>t.map($=>{if(zt($))return $.value;if(Co($))return u($);if(Ee($))return $r($,c,2)})):Ee(t)?e?h=()=>$r(t,c,2):h=()=>(m&&m(),mn(t,c,3,[C])):h=gn,e&&r){const $=h;h=()=>_s($())}let m,C=$=>{m=B.onStop=()=>{$r($,c,4),m=B.onStop=void 0}},R;if(Rc)if(C=gn,e?n&&mn(e,c,3,[h(),g?[]:void 0,C]):h(),s==="sync"){const $=bT();R=$.__watcherHandles||($.__watcherHandles=[])}else return gn;let x=g?new Array(t.length).fill(sl):sl;const L=()=>{if(!(!B.active||!B.dirty))if(e){const $=B.run();(r||f||(g?$.some((A,y)=>Gr(A,x[y])):Gr($,x)))&&(m&&m(),mn(e,c,3,[$,x===sl?void 0:g&&x[0]===sl?[]:x,C]),x=$)}else B.run()};L.allowRecurse=!!e;let F;s==="sync"?F=L:s==="post"?F=()=>Jt(L,c&&c.suspense):(L.pre=!0,c&&(L.id=c.uid),F=()=>yd(L));const B=new ud(h,gn,F),N=NI(),Q=()=>{B.stop(),N&&ld(N.effects,B)};return e?n?L():x=B.run():s==="post"?Jt(B.run.bind(B),c&&c.suspense):B.run(),R&&R.push(Q),Q}function IT(t,e,n){const r=this.proxy,s=dt(t)?t.includes(".")?Gy(r,t):()=>r[t]:t.bind(r,r);let i;Ee(e)?i=e:(i=e.handler,n=e);const o=ya(this),a=wd(s,i.bind(r),n);return o(),a}function Gy(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}function _s(t,e=1/0,n){if(e<=0||!it(t)||t.__v_skip||(n=n||new Set,n.has(t)))return t;if(n.add(t),e--,zt(t))_s(t.value,e,n);else if(fe(t))for(let r=0;r<t.length;r++)_s(t[r],e,n);else if(fy(t)||ui(t))t.forEach(r=>{_s(r,e,n)});else if(my(t))for(const r in t)_s(t[r],e,n);return t}function Ky(t,e){if(bt===null)return t;const n=Pc(bt)||bt.proxy,r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,c=st]=e[s];i&&(Ee(i)&&(i={mounted:i,updated:i}),i.deep&&_s(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:c}))}return t}function ls(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let c=a.dir[r];c&&(es(),mn(c,n,8,[t.el,a,t,e]),ts())}}const xr=Symbol("_leaveCb"),il=Symbol("_enterCb");function TT(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return On(()=>{t.isMounted=!0}),Ed(()=>{t.isUnmounting=!0}),t}const fn=[Function,Array],Yy={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:fn,onEnter:fn,onAfterEnter:fn,onEnterCancelled:fn,onBeforeLeave:fn,onLeave:fn,onAfterLeave:fn,onLeaveCancelled:fn,onBeforeAppear:fn,onAppear:fn,onAfterAppear:fn,onAppearCancelled:fn},CT={name:"BaseTransition",props:Yy,setup(t,{slots:e}){const n=Sc(),r=TT();return()=>{const s=e.default&&Xy(e.default(),!0);if(!s||!s.length)return;let i=s[0];if(s.length>1){for(const g of s)if(g.type!==Zt){i=g;break}}const o=Ue(t),{mode:a}=o;if(r.isLeaving)return Au(i);const c=hg(i);if(!c)return Au(i);const u=ch(c,o,r,n);uh(c,u);const h=n.subTree,f=h&&hg(h);if(f&&f.type!==Zt&&!ms(c,f)){const g=ch(f,o,r,n);if(uh(f,g),a==="out-in"&&c.type!==Zt)return r.isLeaving=!0,g.afterLeave=()=>{r.isLeaving=!1,n.update.active!==!1&&(n.effect.dirty=!0,n.update())},Au(i);a==="in-out"&&c.type!==Zt&&(g.delayLeave=(m,C,R)=>{const x=Qy(r,f);x[String(f.key)]=f,m[xr]=()=>{C(),m[xr]=void 0,delete u.delayedLeave},u.delayedLeave=R})}return i}}},AT=CT;function Qy(t,e){const{leavingVNodes:n}=t;let r=n.get(e.type);return r||(r=Object.create(null),n.set(e.type,r)),r}function ch(t,e,n,r){const{appear:s,mode:i,persisted:o=!1,onBeforeEnter:a,onEnter:c,onAfterEnter:u,onEnterCancelled:h,onBeforeLeave:f,onLeave:g,onAfterLeave:m,onLeaveCancelled:C,onBeforeAppear:R,onAppear:x,onAfterAppear:L,onAppearCancelled:F}=e,B=String(t.key),N=Qy(n,t),Q=(y,v)=>{y&&mn(y,r,9,v)},$=(y,v)=>{const T=v[1];Q(y,v),fe(y)?y.every(S=>S.length<=1)&&T():y.length<=1&&T()},A={mode:i,persisted:o,beforeEnter(y){let v=a;if(!n.isMounted)if(s)v=R||a;else return;y[xr]&&y[xr](!0);const T=N[B];T&&ms(t,T)&&T.el[xr]&&T.el[xr](),Q(v,[y])},enter(y){let v=c,T=u,S=h;if(!n.isMounted)if(s)v=x||c,T=L||u,S=F||h;else return;let b=!1;const E=y[il]=De=>{b||(b=!0,De?Q(S,[y]):Q(T,[y]),A.delayedLeave&&A.delayedLeave(),y[il]=void 0)};v?$(v,[y,E]):E()},leave(y,v){const T=String(t.key);if(y[il]&&y[il](!0),n.isUnmounting)return v();Q(f,[y]);let S=!1;const b=y[xr]=E=>{S||(S=!0,v(),E?Q(C,[y]):Q(m,[y]),y[xr]=void 0,N[T]===t&&delete N[T])};N[T]=t,g?$(g,[y,b]):b()},clone(y){return ch(y,e,n,r)}};return A}function Au(t){if(Ic(t))return t=ur(t),t.children=null,t}function hg(t){if(!Ic(t))return t;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&Ee(n.default))return n.default()}}function uh(t,e){t.shapeFlag&6&&t.component?uh(t.component.subTree,e):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Xy(t,e=!1,n){let r=[],s=0;for(let i=0;i<t.length;i++){let o=t[i];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:i);o.type===at?(o.patchFlag&128&&s++,r=r.concat(Xy(o.children,e,a))):(e||o.type!==Zt)&&r.push(a!=null?ur(o,{key:a}):o)}if(s>1)for(let i=0;i<r.length;i++)r[i].patchFlag=-2;return r}/*! #__NO_SIDE_EFFECTS__ */function Ln(t,e){return Ee(t)?vt({name:t.name},e,{setup:t}):t}const Ao=t=>!!t.type.__asyncLoader,Ic=t=>t.type.__isKeepAlive;function ST(t,e){Jy(t,"a",e)}function RT(t,e){Jy(t,"da",e)}function Jy(t,e,n=Dt){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(Tc(e,r,n),n){let s=n.parent;for(;s&&s.parent;)Ic(s.parent.vnode)&&PT(r,e,n,s),s=s.parent}}function PT(t,e,n,r){const s=Tc(e,t,r,!0);Cc(()=>{ld(r[e],s)},n)}function Tc(t,e,n=Dt,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{if(n.isUnmounted)return;es();const a=ya(n),c=mn(e,n,t,o);return a(),ts(),c});return r?s.unshift(i):s.push(i),i}}const gr=t=>(e,n=Dt)=>(!Rc||t==="sp")&&Tc(t,(...r)=>e(...r),n),xT=gr("bm"),On=gr("m"),kT=gr("bu"),NT=gr("u"),Ed=gr("bum"),Cc=gr("um"),DT=gr("sp"),OT=gr("rtg"),MT=gr("rtc");function LT(t,e=Dt){Tc("ec",t,e)}function Ei(t,e,n,r){let s;const i=n;if(fe(t)||dt(t)){s=new Array(t.length);for(let o=0,a=t.length;o<a;o++)s[o]=e(t[o],o,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let o=0;o<t;o++)s[o]=e(o+1,o,void 0,i)}else if(it(t))if(t[Symbol.iterator])s=Array.from(t,(o,a)=>e(o,a,void 0,i));else{const o=Object.keys(t);s=new Array(o.length);for(let a=0,c=o.length;a<c;a++){const u=o[a];s[a]=e(t[u],u,a,i)}}else s=[];return s}function St(t,e,n={},r,s){if(bt.isCE||bt.parent&&Ao(bt.parent)&&bt.parent.isCE)return e!=="default"&&(n.name=e),re("slot",n,r&&r());let i=t[e];i&&i._c&&(i._d=!1),se();const o=i&&Zy(i(n)),a=gt(at,{key:n.key||o&&o.key||`_${e}`},o||(r?r():[]),o&&t._===1?64:-2);return a.scopeId&&(a.slotScopeIds=[a.scopeId+"-s"]),i&&i._c&&(i._d=!0),a}function Zy(t){return t.some(e=>Dl(e)?!(e.type===Zt||e.type===at&&!Zy(e.children)):!0)?t:null}const hh=t=>t?gv(t)?Pc(t)||t.proxy:hh(t.parent):null,So=vt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>hh(t.parent),$root:t=>hh(t.root),$emit:t=>t.emit,$options:t=>bd(t),$forceUpdate:t=>t.f||(t.f=()=>{t.effect.dirty=!0,yd(t.update)}),$nextTick:t=>t.n||(t.n=wc.bind(t.proxy)),$watch:t=>IT.bind(t)}),Su=(t,e)=>t!==st&&!t.__isScriptSetup&&Ve(t,e),VT={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:c}=t;let u;if(e[0]!=="$"){const m=o[e];if(m!==void 0)switch(m){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(Su(r,e))return o[e]=1,r[e];if(s!==st&&Ve(s,e))return o[e]=2,s[e];if((u=t.propsOptions[0])&&Ve(u,e))return o[e]=3,i[e];if(n!==st&&Ve(n,e))return o[e]=4,n[e];dh&&(o[e]=0)}}const h=So[e];let f,g;if(h)return e==="$attrs"&&nn(t.attrs,"get",""),h(t);if((f=a.__cssModules)&&(f=f[e]))return f;if(n!==st&&Ve(n,e))return o[e]=4,n[e];if(g=c.config.globalProperties,Ve(g,e))return g[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return Su(s,e)?(s[e]=n,!0):r!==st&&Ve(r,e)?(r[e]=n,!0):Ve(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,propsOptions:i}},o){let a;return!!n[o]||t!==st&&Ve(t,o)||Su(e,o)||(a=i[0])&&Ve(a,o)||Ve(r,o)||Ve(So,o)||Ve(s.config.globalProperties,o)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:Ve(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function FT(){return UT().attrs}function UT(){const t=Sc();return t.setupContext||(t.setupContext=_v(t))}function dg(t){return fe(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let dh=!0;function BT(t){const e=bd(t),n=t.proxy,r=t.ctx;dh=!1,e.beforeCreate&&fg(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:c,inject:u,created:h,beforeMount:f,mounted:g,beforeUpdate:m,updated:C,activated:R,deactivated:x,beforeDestroy:L,beforeUnmount:F,destroyed:B,unmounted:N,render:Q,renderTracked:$,renderTriggered:A,errorCaptured:y,serverPrefetch:v,expose:T,inheritAttrs:S,components:b,directives:E,filters:De}=e;if(u&&$T(u,r,null),o)for(const Ie in o){const _e=o[Ie];Ee(_e)&&(r[Ie]=_e.bind(n))}if(s){const Ie=s.call(n,n);it(Ie)&&(t.data=Li(Ie))}if(dh=!0,i)for(const Ie in i){const _e=i[Ie],He=Ee(_e)?_e.bind(n,n):Ee(_e.get)?_e.get.bind(n,n):gn,Tt=!Ee(_e)&&Ee(_e.set)?_e.set.bind(n):gn,mt=Be({get:He,set:Tt});Object.defineProperty(r,Ie,{enumerable:!0,configurable:!0,get:()=>mt.value,set:We=>mt.value=We})}if(a)for(const Ie in a)ev(a[Ie],r,n,Ie);if(c){const Ie=Ee(c)?c.call(n):c;Reflect.ownKeys(Ie).forEach(_e=>{Po(_e,Ie[_e])})}h&&fg(h,t,"c");function Me(Ie,_e){fe(_e)?_e.forEach(He=>Ie(He.bind(n))):_e&&Ie(_e.bind(n))}if(Me(xT,f),Me(On,g),Me(kT,m),Me(NT,C),Me(ST,R),Me(RT,x),Me(LT,y),Me(MT,$),Me(OT,A),Me(Ed,F),Me(Cc,N),Me(DT,v),fe(T))if(T.length){const Ie=t.exposed||(t.exposed={});T.forEach(_e=>{Object.defineProperty(Ie,_e,{get:()=>n[_e],set:He=>n[_e]=He})})}else t.exposed||(t.exposed={});Q&&t.render===gn&&(t.render=Q),S!=null&&(t.inheritAttrs=S),b&&(t.components=b),E&&(t.directives=E)}function $T(t,e,n=gn){fe(t)&&(t=fh(t));for(const r in t){const s=t[r];let i;it(s)?"default"in s?i=kn(s.from||r,s.default,!0):i=kn(s.from||r):i=kn(s),zt(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function fg(t,e,n){mn(fe(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function ev(t,e,n,r){const s=r.includes(".")?Gy(n,r):()=>n[r];if(dt(t)){const i=e[t];Ee(i)&&_n(s,i)}else if(Ee(t))_n(s,t.bind(n));else if(it(t))if(fe(t))t.forEach(i=>ev(i,e,n,r));else{const i=Ee(t.handler)?t.handler.bind(n):e[t.handler];Ee(i)&&_n(s,i,t)}}function bd(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let c;return a?c=a:!s.length&&!n&&!r?c=e:(c={},s.length&&s.forEach(u=>Nl(c,u,o,!0)),Nl(c,e,o)),it(e)&&i.set(e,c),c}function Nl(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&Nl(t,i,n,!0),s&&s.forEach(o=>Nl(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=jT[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const jT={data:pg,props:gg,emits:gg,methods:_o,computed:_o,beforeCreate:Xt,created:Xt,beforeMount:Xt,mounted:Xt,beforeUpdate:Xt,updated:Xt,beforeDestroy:Xt,beforeUnmount:Xt,destroyed:Xt,unmounted:Xt,activated:Xt,deactivated:Xt,errorCaptured:Xt,serverPrefetch:Xt,components:_o,directives:_o,watch:HT,provide:pg,inject:qT};function pg(t,e){return e?t?function(){return vt(Ee(t)?t.call(this,this):t,Ee(e)?e.call(this,this):e)}:e:t}function qT(t,e){return _o(fh(t),fh(e))}function fh(t){if(fe(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Xt(t,e){return t?[...new Set([].concat(t,e))]:e}function _o(t,e){return t?vt(Object.create(null),t,e):e}function gg(t,e){return t?fe(t)&&fe(e)?[...new Set([...t,...e])]:vt(Object.create(null),dg(t),dg(e??{})):e}function HT(t,e){if(!t)return e;if(!e)return t;const n=vt(Object.create(null),t);for(const r in e)n[r]=Xt(t[r],e[r]);return n}function tv(){return{app:null,config:{isNativeTag:yI,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let WT=0;function zT(t,e){return function(r,s=null){Ee(r)||(r=vt({},r)),s!=null&&!it(s)&&(s=null);const i=tv(),o=new WeakSet;let a=!1;const c=i.app={_uid:WT++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:fC,get config(){return i.config},set config(u){},use(u,...h){return o.has(u)||(u&&Ee(u.install)?(o.add(u),u.install(c,...h)):Ee(u)&&(o.add(u),u(c,...h))),c},mixin(u){return i.mixins.includes(u)||i.mixins.push(u),c},component(u,h){return h?(i.components[u]=h,c):i.components[u]},directive(u,h){return h?(i.directives[u]=h,c):i.directives[u]},mount(u,h,f){if(!a){const g=re(r,s);return g.appContext=i,f===!0?f="svg":f===!1&&(f=void 0),h&&e?e(g,u):t(g,u,f),a=!0,c._container=u,u.__vue_app__=c,Pc(g.component)||g.component.proxy}},unmount(){a&&(t(null,c._container),delete c._container.__vue_app__)},provide(u,h){return i.provides[u]=h,c},runWithContext(u){const h=Ro;Ro=c;try{return u()}finally{Ro=h}}};return c}}let Ro=null;function Po(t,e){if(Dt){let n=Dt.provides;const r=Dt.parent&&Dt.parent.provides;r===n&&(n=Dt.provides=Object.create(r)),n[t]=e}}function kn(t,e,n=!1){const r=Dt||bt;if(r||Ro){const s=r?r.parent==null?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:Ro._context.provides;if(s&&t in s)return s[t];if(arguments.length>1)return n&&Ee(e)?e.call(r&&r.proxy):e}}const nv={},rv=()=>Object.create(nv),sv=t=>Object.getPrototypeOf(t)===nv;function GT(t,e,n,r=!1){const s={},i=rv();t.propsDefaults=Object.create(null),iv(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:Dy(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function KT(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=Ue(s),[c]=t.propsOptions;let u=!1;if((r||o>0)&&!(o&16)){if(o&8){const h=t.vnode.dynamicProps;for(let f=0;f<h.length;f++){let g=h[f];if(Ec(t.emitsOptions,g))continue;const m=e[g];if(c)if(Ve(i,g))m!==i[g]&&(i[g]=m,u=!0);else{const C=Kn(g);s[C]=ph(c,a,C,m,t,!1)}else m!==i[g]&&(i[g]=m,u=!0)}}}else{iv(t,e,s,i)&&(u=!0);let h;for(const f in a)(!e||!Ve(e,f)&&((h=Mi(f))===f||!Ve(e,h)))&&(c?n&&(n[f]!==void 0||n[h]!==void 0)&&(s[f]=ph(c,a,f,void 0,t,!0)):delete s[f]);if(i!==a)for(const f in i)(!e||!Ve(e,f))&&(delete i[f],u=!0)}u&&ar(t.attrs,"set","")}function iv(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let c in e){if(To(c))continue;const u=e[c];let h;s&&Ve(s,h=Kn(c))?!i||!i.includes(h)?n[h]=u:(a||(a={}))[h]=u:Ec(t.emitsOptions,c)||(!(c in r)||u!==r[c])&&(r[c]=u,o=!0)}if(i){const c=Ue(n),u=a||st;for(let h=0;h<i.length;h++){const f=i[h];n[f]=ph(s,c,f,u[f],t,!Ve(u,f))}}return o}function ph(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=Ve(o,"default");if(a&&r===void 0){const c=o.default;if(o.type!==Function&&!o.skipFactory&&Ee(c)){const{propsDefaults:u}=s;if(n in u)r=u[n];else{const h=ya(s);r=u[n]=c.call(null,e),h()}}else r=c}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===Mi(n))&&(r=!0))}return r}function ov(t,e,n=!1){const r=e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let c=!1;if(!Ee(t)){const h=f=>{c=!0;const[g,m]=ov(f,e,!0);vt(o,g),m&&a.push(...m)};!n&&e.mixins.length&&e.mixins.forEach(h),t.extends&&h(t.extends),t.mixins&&t.mixins.forEach(h)}if(!i&&!c)return it(t)&&r.set(t,ci),ci;if(fe(i))for(let h=0;h<i.length;h++){const f=Kn(i[h]);mg(f)&&(o[f]=st)}else if(i)for(const h in i){const f=Kn(h);if(mg(f)){const g=i[h],m=o[f]=fe(g)||Ee(g)?{type:g}:vt({},g);if(m){const C=vg(Boolean,m.type),R=vg(String,m.type);m[0]=C>-1,m[1]=R<0||C<R,(C>-1||Ve(m,"default"))&&a.push(f)}}}const u=[o,a];return it(t)&&r.set(t,u),u}function mg(t){return t[0]!=="$"&&!To(t)}function _g(t){return t===null?"null":typeof t=="function"?t.name||"":typeof t=="object"&&t.constructor&&t.constructor.name||""}function yg(t,e){return _g(t)===_g(e)}function vg(t,e){return fe(e)?e.findIndex(n=>yg(n,t)):Ee(e)&&yg(e,t)?0:-1}const av=t=>t[0]==="_"||t==="$stable",Id=t=>fe(t)?t.map(Un):[Un(t)],YT=(t,e,n)=>{if(e._n)return e;const r=pe((...s)=>Id(e(...s)),n);return r._c=!1,r},lv=(t,e,n)=>{const r=t._ctx;for(const s in t){if(av(s))continue;const i=t[s];if(Ee(i))e[s]=YT(s,i,r);else if(i!=null){const o=Id(i);e[s]=()=>o}}},cv=(t,e)=>{const n=Id(e);t.slots.default=()=>n},QT=(t,e)=>{const n=t.slots=rv();if(t.vnode.shapeFlag&32){const r=e._;r?(vt(n,e),_y(n,"_",r,!0)):lv(e,n)}else e&&cv(t,e)},XT=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=st;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:(vt(s,e),!n&&a===1&&delete s._):(i=!e.$stable,lv(e,s)),o=e}else e&&(cv(t,e),o={default:1});if(i)for(const a in s)!av(a)&&o[a]==null&&delete s[a]};function gh(t,e,n,r,s=!1){if(fe(t)){t.forEach((g,m)=>gh(g,e&&(fe(e)?e[m]:e),n,r,s));return}if(Ao(r)&&!s)return;const i=r.shapeFlag&4?Pc(r.component)||r.component.proxy:r.el,o=s?null:i,{i:a,r:c}=t,u=e&&e.r,h=a.refs===st?a.refs={}:a.refs,f=a.setupState;if(u!=null&&u!==c&&(dt(u)?(h[u]=null,Ve(f,u)&&(f[u]=null)):zt(u)&&(u.value=null)),Ee(c))$r(c,a,12,[o,h]);else{const g=dt(c),m=zt(c);if(g||m){const C=()=>{if(t.f){const R=g?Ve(f,c)?f[c]:h[c]:c.value;s?fe(R)&&ld(R,i):fe(R)?R.includes(i)||R.push(i):g?(h[c]=[i],Ve(f,c)&&(f[c]=h[c])):(c.value=[i],t.k&&(h[t.k]=c.value))}else g?(h[c]=o,Ve(f,c)&&(f[c]=o)):m&&(c.value=o,t.k&&(h[t.k]=o))};o?(C.id=-1,Jt(C,n)):C()}}}const Jt=wT;function JT(t){return ZT(t)}function ZT(t,e){const n=yy();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:c,setText:u,setElementText:h,parentNode:f,nextSibling:g,setScopeId:m=gn,insertStaticContent:C}=t,R=(w,I,k,V=null,M=null,W=null,ee=void 0,K=null,X=!!I.dynamicChildren)=>{if(w===I)return;w&&!ms(w,I)&&(V=O(w),We(w,M,W,!0),w=null),I.patchFlag===-2&&(X=!1,I.dynamicChildren=null);const{type:q,ref:ne,shapeFlag:le}=I;switch(q){case Ac:x(w,I,k,V);break;case Zt:L(w,I,k,V);break;case ml:w==null&&F(I,k,V,ee);break;case at:b(w,I,k,V,M,W,ee,K,X);break;default:le&1?Q(w,I,k,V,M,W,ee,K,X):le&6?E(w,I,k,V,M,W,ee,K,X):(le&64||le&128)&&q.process(w,I,k,V,M,W,ee,K,X,te)}ne!=null&&M&&gh(ne,w&&w.ref,W,I||w,!I)},x=(w,I,k,V)=>{if(w==null)r(I.el=a(I.children),k,V);else{const M=I.el=w.el;I.children!==w.children&&u(M,I.children)}},L=(w,I,k,V)=>{w==null?r(I.el=c(I.children||""),k,V):I.el=w.el},F=(w,I,k,V)=>{[w.el,w.anchor]=C(w.children,I,k,V,w.el,w.anchor)},B=({el:w,anchor:I},k,V)=>{let M;for(;w&&w!==I;)M=g(w),r(w,k,V),w=M;r(I,k,V)},N=({el:w,anchor:I})=>{let k;for(;w&&w!==I;)k=g(w),s(w),w=k;s(I)},Q=(w,I,k,V,M,W,ee,K,X)=>{I.type==="svg"?ee="svg":I.type==="math"&&(ee="mathml"),w==null?$(I,k,V,M,W,ee,K,X):v(w,I,M,W,ee,K,X)},$=(w,I,k,V,M,W,ee,K)=>{let X,q;const{props:ne,shapeFlag:le,transition:ae,dirs:oe}=w;if(X=w.el=o(w.type,W,ne&&ne.is,ne),le&8?h(X,w.children):le&16&&y(w.children,X,null,V,M,Ru(w,W),ee,K),oe&&ls(w,null,V,"created"),A(X,w,w.scopeId,ee,V),ne){for(const Le in ne)Le!=="value"&&!To(Le)&&i(X,Le,null,ne[Le],W,w.children,V,M,Se);"value"in ne&&i(X,"value",null,ne.value,W),(q=ne.onVnodeBeforeMount)&&Fn(q,V,w)}oe&&ls(w,null,V,"beforeMount");const ce=eC(M,ae);ce&&ae.beforeEnter(X),r(X,I,k),((q=ne&&ne.onVnodeMounted)||ce||oe)&&Jt(()=>{q&&Fn(q,V,w),ce&&ae.enter(X),oe&&ls(w,null,V,"mounted")},M)},A=(w,I,k,V,M)=>{if(k&&m(w,k),V)for(let W=0;W<V.length;W++)m(w,V[W]);if(M){let W=M.subTree;if(I===W){const ee=M.vnode;A(w,ee,ee.scopeId,ee.slotScopeIds,M.parent)}}},y=(w,I,k,V,M,W,ee,K,X=0)=>{for(let q=X;q<w.length;q++){const ne=w[q]=K?kr(w[q]):Un(w[q]);R(null,ne,I,k,V,M,W,ee,K)}},v=(w,I,k,V,M,W,ee)=>{const K=I.el=w.el;let{patchFlag:X,dynamicChildren:q,dirs:ne}=I;X|=w.patchFlag&16;const le=w.props||st,ae=I.props||st;let oe;if(k&&cs(k,!1),(oe=ae.onVnodeBeforeUpdate)&&Fn(oe,k,I,w),ne&&ls(I,w,k,"beforeUpdate"),k&&cs(k,!0),q?T(w.dynamicChildren,q,K,k,V,Ru(I,M),W):ee||_e(w,I,K,null,k,V,Ru(I,M),W,!1),X>0){if(X&16)S(K,I,le,ae,k,V,M);else if(X&2&&le.class!==ae.class&&i(K,"class",null,ae.class,M),X&4&&i(K,"style",le.style,ae.style,M),X&8){const ce=I.dynamicProps;for(let Le=0;Le<ce.length;Le++){const Ke=ce[Le],pt=le[Ke],sn=ae[Ke];(sn!==pt||Ke==="value")&&i(K,Ke,pt,sn,M,w.children,k,V,Se)}}X&1&&w.children!==I.children&&h(K,I.children)}else!ee&&q==null&&S(K,I,le,ae,k,V,M);((oe=ae.onVnodeUpdated)||ne)&&Jt(()=>{oe&&Fn(oe,k,I,w),ne&&ls(I,w,k,"updated")},V)},T=(w,I,k,V,M,W,ee)=>{for(let K=0;K<I.length;K++){const X=w[K],q=I[K],ne=X.el&&(X.type===at||!ms(X,q)||X.shapeFlag&70)?f(X.el):k;R(X,q,ne,null,V,M,W,ee,!0)}},S=(w,I,k,V,M,W,ee)=>{if(k!==V){if(k!==st)for(const K in k)!To(K)&&!(K in V)&&i(w,K,k[K],null,ee,I.children,M,W,Se);for(const K in V){if(To(K))continue;const X=V[K],q=k[K];X!==q&&K!=="value"&&i(w,K,q,X,ee,I.children,M,W,Se)}"value"in V&&i(w,"value",k.value,V.value,ee)}},b=(w,I,k,V,M,W,ee,K,X)=>{const q=I.el=w?w.el:a(""),ne=I.anchor=w?w.anchor:a("");let{patchFlag:le,dynamicChildren:ae,slotScopeIds:oe}=I;oe&&(K=K?K.concat(oe):oe),w==null?(r(q,k,V),r(ne,k,V),y(I.children||[],k,ne,M,W,ee,K,X)):le>0&&le&64&&ae&&w.dynamicChildren?(T(w.dynamicChildren,ae,k,M,W,ee,K),(I.key!=null||M&&I===M.subTree)&&uv(w,I,!0)):_e(w,I,k,ne,M,W,ee,K,X)},E=(w,I,k,V,M,W,ee,K,X)=>{I.slotScopeIds=K,w==null?I.shapeFlag&512?M.ctx.activate(I,k,V,ee,X):De(I,k,V,M,W,ee,X):ot(w,I,X)},De=(w,I,k,V,M,W,ee)=>{const K=w.component=aC(w,V,M);if(Ic(w)&&(K.ctx.renderer=te),lC(K),K.asyncDep){if(M&&M.registerDep(K,Me),!w.el){const X=K.subTree=re(Zt);L(null,X,I,k)}}else Me(K,w,I,k,M,W,ee)},ot=(w,I,k)=>{const V=I.component=w.component;if(_T(w,I,k))if(V.asyncDep&&!V.asyncResolved){Ie(V,I,k);return}else V.next=I,cT(V.update),V.effect.dirty=!0,V.update();else I.el=w.el,V.vnode=I},Me=(w,I,k,V,M,W,ee)=>{const K=()=>{if(w.isMounted){let{next:ne,bu:le,u:ae,parent:oe,vnode:ce}=w;{const hn=hv(w);if(hn){ne&&(ne.el=ce.el,Ie(w,ne,ee)),hn.asyncDep.then(()=>{w.isUnmounted||K()});return}}let Le=ne,Ke;cs(w,!1),ne?(ne.el=ce.el,Ie(w,ne,ee)):ne=ce,le&&pl(le),(Ke=ne.props&&ne.props.onVnodeBeforeUpdate)&&Fn(Ke,oe,ne,ce),cs(w,!0);const pt=Cu(w),sn=w.subTree;w.subTree=pt,R(sn,pt,f(sn.el),O(sn),w,M,W),ne.el=pt.el,Le===null&&yT(w,pt.el),ae&&Jt(ae,M),(Ke=ne.props&&ne.props.onVnodeUpdated)&&Jt(()=>Fn(Ke,oe,ne,ce),M)}else{let ne;const{el:le,props:ae}=I,{bm:oe,m:ce,parent:Le}=w,Ke=Ao(I);if(cs(w,!1),oe&&pl(oe),!Ke&&(ne=ae&&ae.onVnodeBeforeMount)&&Fn(ne,Le,I),cs(w,!0),le&&ze){const pt=()=>{w.subTree=Cu(w),ze(le,w.subTree,w,M,null)};Ke?I.type.__asyncLoader().then(()=>!w.isUnmounted&&pt()):pt()}else{const pt=w.subTree=Cu(w);R(null,pt,k,V,w,M,W),I.el=pt.el}if(ce&&Jt(ce,M),!Ke&&(ne=ae&&ae.onVnodeMounted)){const pt=I;Jt(()=>Fn(ne,Le,pt),M)}(I.shapeFlag&256||Le&&Ao(Le.vnode)&&Le.vnode.shapeFlag&256)&&w.a&&Jt(w.a,M),w.isMounted=!0,I=k=V=null}},X=w.effect=new ud(K,gn,()=>yd(q),w.scope),q=w.update=()=>{X.dirty&&X.run()};q.id=w.uid,cs(w,!0),q()},Ie=(w,I,k)=>{I.component=w;const V=w.vnode.props;w.vnode=I,w.next=null,KT(w,I.props,V,k),XT(w,I.children,k),es(),lg(w),ts()},_e=(w,I,k,V,M,W,ee,K,X=!1)=>{const q=w&&w.children,ne=w?w.shapeFlag:0,le=I.children,{patchFlag:ae,shapeFlag:oe}=I;if(ae>0){if(ae&128){Tt(q,le,k,V,M,W,ee,K,X);return}else if(ae&256){He(q,le,k,V,M,W,ee,K,X);return}}oe&8?(ne&16&&Se(q,M,W),le!==q&&h(k,le)):ne&16?oe&16?Tt(q,le,k,V,M,W,ee,K,X):Se(q,M,W,!0):(ne&8&&h(k,""),oe&16&&y(le,k,V,M,W,ee,K,X))},He=(w,I,k,V,M,W,ee,K,X)=>{w=w||ci,I=I||ci;const q=w.length,ne=I.length,le=Math.min(q,ne);let ae;for(ae=0;ae<le;ae++){const oe=I[ae]=X?kr(I[ae]):Un(I[ae]);R(w[ae],oe,k,null,M,W,ee,K,X)}q>ne?Se(w,M,W,!0,!1,le):y(I,k,V,M,W,ee,K,X,le)},Tt=(w,I,k,V,M,W,ee,K,X)=>{let q=0;const ne=I.length;let le=w.length-1,ae=ne-1;for(;q<=le&&q<=ae;){const oe=w[q],ce=I[q]=X?kr(I[q]):Un(I[q]);if(ms(oe,ce))R(oe,ce,k,null,M,W,ee,K,X);else break;q++}for(;q<=le&&q<=ae;){const oe=w[le],ce=I[ae]=X?kr(I[ae]):Un(I[ae]);if(ms(oe,ce))R(oe,ce,k,null,M,W,ee,K,X);else break;le--,ae--}if(q>le){if(q<=ae){const oe=ae+1,ce=oe<ne?I[oe].el:V;for(;q<=ae;)R(null,I[q]=X?kr(I[q]):Un(I[q]),k,ce,M,W,ee,K,X),q++}}else if(q>ae)for(;q<=le;)We(w[q],M,W,!0),q++;else{const oe=q,ce=q,Le=new Map;for(q=ce;q<=ae;q++){const Kt=I[q]=X?kr(I[q]):Un(I[q]);Kt.key!=null&&Le.set(Kt.key,q)}let Ke,pt=0;const sn=ae-ce+1;let hn=!1,zi=0;const yr=new Array(sn);for(q=0;q<sn;q++)yr[q]=0;for(q=oe;q<=le;q++){const Kt=w[q];if(pt>=sn){We(Kt,M,W,!0);continue}let dn;if(Kt.key!=null)dn=Le.get(Kt.key);else for(Ke=ce;Ke<=ae;Ke++)if(yr[Ke-ce]===0&&ms(Kt,I[Ke])){dn=Ke;break}dn===void 0?We(Kt,M,W,!0):(yr[dn-ce]=q+1,dn>=zi?zi=dn:hn=!0,R(Kt,I[dn],k,null,M,W,ee,K,X),pt++)}const Ks=hn?tC(yr):ci;for(Ke=Ks.length-1,q=sn-1;q>=0;q--){const Kt=ce+q,dn=I[Kt],Ys=Kt+1<ne?I[Kt+1].el:V;yr[q]===0?R(null,dn,k,Ys,M,W,ee,K,X):hn&&(Ke<0||q!==Ks[Ke]?mt(dn,k,Ys,2):Ke--)}}},mt=(w,I,k,V,M=null)=>{const{el:W,type:ee,transition:K,children:X,shapeFlag:q}=w;if(q&6){mt(w.component.subTree,I,k,V);return}if(q&128){w.suspense.move(I,k,V);return}if(q&64){ee.move(w,I,k,te);return}if(ee===at){r(W,I,k);for(let le=0;le<X.length;le++)mt(X[le],I,k,V);r(w.anchor,I,k);return}if(ee===ml){B(w,I,k);return}if(V!==2&&q&1&&K)if(V===0)K.beforeEnter(W),r(W,I,k),Jt(()=>K.enter(W),M);else{const{leave:le,delayLeave:ae,afterLeave:oe}=K,ce=()=>r(W,I,k),Le=()=>{le(W,()=>{ce(),oe&&oe()})};ae?ae(W,ce,Le):Le()}else r(W,I,k)},We=(w,I,k,V=!1,M=!1)=>{const{type:W,props:ee,ref:K,children:X,dynamicChildren:q,shapeFlag:ne,patchFlag:le,dirs:ae}=w;if(K!=null&&gh(K,null,k,w,!0),ne&256){I.ctx.deactivate(w);return}const oe=ne&1&&ae,ce=!Ao(w);let Le;if(ce&&(Le=ee&&ee.onVnodeBeforeUnmount)&&Fn(Le,I,w),ne&6)Ce(w.component,k,V);else{if(ne&128){w.suspense.unmount(k,V);return}oe&&ls(w,null,I,"beforeUnmount"),ne&64?w.type.remove(w,I,k,M,te,V):q&&(W!==at||le>0&&le&64)?Se(q,I,k,!1,!0):(W===at&&le&384||!M&&ne&16)&&Se(X,I,k),V&&et(w)}(ce&&(Le=ee&&ee.onVnodeUnmounted)||oe)&&Jt(()=>{Le&&Fn(Le,I,w),oe&&ls(w,null,I,"unmounted")},k)},et=w=>{const{type:I,el:k,anchor:V,transition:M}=w;if(I===at){U(k,V);return}if(I===ml){N(w);return}const W=()=>{s(k),M&&!M.persisted&&M.afterLeave&&M.afterLeave()};if(w.shapeFlag&1&&M&&!M.persisted){const{leave:ee,delayLeave:K}=M,X=()=>ee(k,W);K?K(w.el,W,X):X()}else W()},U=(w,I)=>{let k;for(;w!==I;)k=g(w),s(w),w=k;s(I)},Ce=(w,I,k)=>{const{bum:V,scope:M,update:W,subTree:ee,um:K}=w;V&&pl(V),M.stop(),W&&(W.active=!1,We(ee,w,I,k)),K&&Jt(K,I),Jt(()=>{w.isUnmounted=!0},I),I&&I.pendingBranch&&!I.isUnmounted&&w.asyncDep&&!w.asyncResolved&&w.suspenseId===I.pendingId&&(I.deps--,I.deps===0&&I.resolve())},Se=(w,I,k,V=!1,M=!1,W=0)=>{for(let ee=W;ee<w.length;ee++)We(w[ee],I,k,V,M)},O=w=>w.shapeFlag&6?O(w.component.subTree):w.shapeFlag&128?w.suspense.next():g(w.anchor||w.el);let z=!1;const G=(w,I,k)=>{w==null?I._vnode&&We(I._vnode,null,null,!0):R(I._vnode||null,w,I,null,null,null,k),z||(z=!0,lg(),jy(),z=!1),I._vnode=w},te={p:R,um:We,m:mt,r:et,mt:De,mc:y,pc:_e,pbc:T,n:O,o:t};let Ae,ze;return{render:G,hydrate:Ae,createApp:zT(G,Ae)}}function Ru({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function cs({effect:t,update:e},n){t.allowRecurse=e.allowRecurse=n}function eC(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function uv(t,e,n=!1){const r=t.children,s=e.children;if(fe(r)&&fe(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=kr(s[i]),a.el=o.el),n||uv(o,a)),a.type===Ac&&(a.el=o.el)}}function tC(t){const e=t.slice(),n=[0];let r,s,i,o,a;const c=t.length;for(r=0;r<c;r++){const u=t[r];if(u!==0){if(s=n[n.length-1],t[s]<u){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<u?i=a+1:o=a;u<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function hv(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:hv(e)}const nC=t=>t.__isTeleport,at=Symbol.for("v-fgt"),Ac=Symbol.for("v-txt"),Zt=Symbol.for("v-cmt"),ml=Symbol.for("v-stc"),xo=[];let Sn=null;function se(t=!1){xo.push(Sn=t?null:[])}function rC(){xo.pop(),Sn=xo[xo.length-1]||null}let Ko=1;function wg(t){Ko+=t}function dv(t){return t.dynamicChildren=Ko>0?Sn||ci:null,rC(),Ko>0&&Sn&&Sn.push(t),t}function ye(t,e,n,r,s,i){return dv(Z(t,e,n,r,s,i,!0))}function gt(t,e,n,r,s){return dv(re(t,e,n,r,s,!0))}function Dl(t){return t?t.__v_isVNode===!0:!1}function ms(t,e){return t.type===e.type&&t.key===e.key}const fv=({key:t})=>t??null,_l=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?dt(t)||zt(t)||Ee(t)?{i:bt,r:t,k:e,f:!!n}:t:null);function Z(t,e=null,n=null,r=0,s=null,i=t===at?0:1,o=!1,a=!1){const c={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&fv(e),ref:e&&_l(e),scopeId:bc,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:bt};return a?(Cd(c,n),i&128&&t.normalize(c)):n&&(c.shapeFlag|=dt(n)?8:16),Ko>0&&!o&&Sn&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&Sn.push(c),c}const re=sC;function sC(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===Wy)&&(t=Zt),Dl(t)){const a=ur(t,e,!0);return n&&Cd(a,n),Ko>0&&!i&&Sn&&(a.shapeFlag&6?Sn[Sn.indexOf(t)]=a:Sn.push(a)),a.patchFlag|=-2,a}if(dC(t)&&(t=t.__vccOpts),e){e=pv(e);let{class:a,style:c}=e;a&&!dt(a)&&(e.class=$t(a)),it(c)&&(My(c)&&!fe(c)&&(c=vt({},c)),e.style=Kr(c))}const o=dt(t)?1:vT(t)?128:nC(t)?64:it(t)?4:Ee(t)?2:0;return Z(t,e,n,r,s,o,i,!0)}function pv(t){return t?My(t)||sv(t)?vt({},t):t:null}function ur(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:c}=t,u=e?Hn(s||{},e):s,h={__v_isVNode:!0,__v_skip:!0,type:t.type,props:u,key:u&&fv(u),ref:e&&e.ref?n&&i?fe(i)?i.concat(_l(e)):[i,_l(e)]:_l(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==at?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:c,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&ur(t.ssContent),ssFallback:t.ssFallback&&ur(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return c&&r&&(h.transition=c.clone(h)),h}function Qe(t=" ",e=0){return re(Ac,null,t,e)}function Td(t,e){const n=re(ml,null,t);return n.staticCount=e,n}function Cn(t="",e=!1){return e?(se(),gt(Zt,null,t)):re(Zt,null,t)}function Un(t){return t==null||typeof t=="boolean"?re(Zt):fe(t)?re(at,null,t.slice()):typeof t=="object"?kr(t):re(Ac,null,String(t))}function kr(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:ur(t)}function Cd(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if(fe(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),Cd(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!sv(e)?e._ctx=bt:s===3&&bt&&(bt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Ee(e)?(e={default:e,_ctx:bt},n=32):(e=String(e),r&64?(n=16,e=[Qe(e)]):n=8);t.children=e,t.shapeFlag|=n}function Hn(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=$t([e.class,r.class]));else if(s==="style")e.style=Kr([e.style,r.style]);else if(pc(s)){const i=e[s],o=r[s];o&&i!==o&&!(fe(i)&&i.includes(o))&&(e[s]=i?[].concat(i,o):o)}else s!==""&&(e[s]=r[s])}return e}function Fn(t,e,n,r=null){mn(t,e,7,[n,r])}const iC=tv();let oC=0;function aC(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||iC,i={uid:oC++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,scope:new Ey(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:ov(r,s),emitsOptions:Hy(r,s),emit:null,emitted:null,propsDefaults:st,inheritAttrs:r.inheritAttrs,ctx:st,data:st,props:st,attrs:st,slots:st,refs:st,setupState:st,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=dT.bind(null,i),t.ce&&t.ce(i),i}let Dt=null;const Sc=()=>Dt||bt;let Ol,mh;{const t=yy(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};Ol=e("__VUE_INSTANCE_SETTERS__",n=>Dt=n),mh=e("__VUE_SSR_SETTERS__",n=>Rc=n)}const ya=t=>{const e=Dt;return Ol(t),t.scope.on(),()=>{t.scope.off(),Ol(e)}},Eg=()=>{Dt&&Dt.scope.off(),Ol(null)};function gv(t){return t.vnode.shapeFlag&4}let Rc=!1;function lC(t,e=!1){e&&mh(e);const{props:n,children:r}=t.vnode,s=gv(t);GT(t,n,s,e),QT(t,r);const i=s?cC(t,e):void 0;return e&&mh(!1),i}function cC(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,VT);const{setup:r}=n;if(r){const s=t.setupContext=r.length>1?_v(t):null,i=ya(t);es();const o=$r(r,t,0,[t.props,s]);if(ts(),i(),py(o)){if(o.then(Eg,Eg),e)return o.then(a=>{bg(t,a,e)}).catch(a=>{vc(a,t,0)});t.asyncDep=o}else bg(t,o,e)}else mv(t,e)}function bg(t,e,n){Ee(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:it(e)&&(t.setupState=Uy(e)),mv(t,n)}let Ig;function mv(t,e,n){const r=t.type;if(!t.render){if(!e&&Ig&&!r.render){const s=r.template||bd(t).template;if(s){const{isCustomElement:i,compilerOptions:o}=t.appContext.config,{delimiters:a,compilerOptions:c}=r,u=vt(vt({isCustomElement:i,delimiters:a},o),c);r.render=Ig(s,u)}}t.render=r.render||gn}{const s=ya(t);es();try{BT(t)}finally{ts(),s()}}}const uC={get(t,e){return nn(t,"get",""),t[e]}};function _v(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,uC),slots:t.slots,emit:t.emit,expose:e}}function Pc(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(Uy(ZI(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in So)return So[n](t)},has(e,n){return n in e||n in So}}))}function hC(t,e=!0){return Ee(t)?t.displayName||t.name:t.name||e&&t.__name}function dC(t){return Ee(t)&&"__vccOpts"in t}const Be=(t,e)=>eT(t,e,Rc);function di(t,e,n){const r=arguments.length;return r===2?it(e)&&!fe(e)?Dl(e)?re(t,null,[e]):re(t,e):re(t,null,e):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&Dl(n)&&(n=[n]),re(t,e,n))}const fC="3.4.27";/**
* @vue/runtime-dom v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const pC="http://www.w3.org/2000/svg",gC="http://www.w3.org/1998/Math/MathML",Nr=typeof document<"u"?document:null,Tg=Nr&&Nr.createElement("template"),mC={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?Nr.createElementNS(pC,t):e==="mathml"?Nr.createElementNS(gC,t):Nr.createElement(t,n?{is:n}:void 0);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>Nr.createTextNode(t),createComment:t=>Nr.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Nr.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{Tg.innerHTML=r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t;const a=Tg.content;if(r==="svg"||r==="mathml"){const c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Ir="transition",oo="animation",Yo=Symbol("_vtc"),xc=(t,{slots:e})=>di(AT,_C(t),e);xc.displayName="Transition";const yv={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};xc.props=vt({},Yy,yv);const us=(t,e=[])=>{fe(t)?t.forEach(n=>n(...e)):t&&t(...e)},Cg=t=>t?fe(t)?t.some(e=>e.length>1):t.length>1:!1;function _C(t){const e={};for(const b in t)b in yv||(e[b]=t[b]);if(t.css===!1)return e;const{name:n="v",type:r,duration:s,enterFromClass:i=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:c=i,appearActiveClass:u=o,appearToClass:h=a,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:g=`${n}-leave-active`,leaveToClass:m=`${n}-leave-to`}=t,C=yC(s),R=C&&C[0],x=C&&C[1],{onBeforeEnter:L,onEnter:F,onEnterCancelled:B,onLeave:N,onLeaveCancelled:Q,onBeforeAppear:$=L,onAppear:A=F,onAppearCancelled:y=B}=e,v=(b,E,De)=>{hs(b,E?h:a),hs(b,E?u:o),De&&De()},T=(b,E)=>{b._isLeaving=!1,hs(b,f),hs(b,m),hs(b,g),E&&E()},S=b=>(E,De)=>{const ot=b?A:F,Me=()=>v(E,b,De);us(ot,[E,Me]),Ag(()=>{hs(E,b?c:i),Tr(E,b?h:a),Cg(ot)||Sg(E,r,R,Me)})};return vt(e,{onBeforeEnter(b){us(L,[b]),Tr(b,i),Tr(b,o)},onBeforeAppear(b){us($,[b]),Tr(b,c),Tr(b,u)},onEnter:S(!1),onAppear:S(!0),onLeave(b,E){b._isLeaving=!0;const De=()=>T(b,E);Tr(b,f),Tr(b,g),EC(),Ag(()=>{b._isLeaving&&(hs(b,f),Tr(b,m),Cg(N)||Sg(b,r,x,De))}),us(N,[b,De])},onEnterCancelled(b){v(b,!1),us(B,[b])},onAppearCancelled(b){v(b,!0),us(y,[b])},onLeaveCancelled(b){T(b),us(Q,[b])}})}function yC(t){if(t==null)return null;if(it(t))return[Pu(t.enter),Pu(t.leave)];{const e=Pu(t);return[e,e]}}function Pu(t){return II(t)}function Tr(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t[Yo]||(t[Yo]=new Set)).add(e)}function hs(t,e){e.split(/\s+/).forEach(r=>r&&t.classList.remove(r));const n=t[Yo];n&&(n.delete(e),n.size||(t[Yo]=void 0))}function Ag(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let vC=0;function Sg(t,e,n,r){const s=t._endId=++vC,i=()=>{s===t._endId&&r()};if(n)return setTimeout(i,n);const{type:o,timeout:a,propCount:c}=wC(t,e);if(!o)return r();const u=o+"end";let h=0;const f=()=>{t.removeEventListener(u,g),i()},g=m=>{m.target===t&&++h>=c&&f()};setTimeout(()=>{h<c&&f()},a+1),t.addEventListener(u,g)}function wC(t,e){const n=window.getComputedStyle(t),r=C=>(n[C]||"").split(", "),s=r(`${Ir}Delay`),i=r(`${Ir}Duration`),o=Rg(s,i),a=r(`${oo}Delay`),c=r(`${oo}Duration`),u=Rg(a,c);let h=null,f=0,g=0;e===Ir?o>0&&(h=Ir,f=o,g=i.length):e===oo?u>0&&(h=oo,f=u,g=c.length):(f=Math.max(o,u),h=f>0?o>u?Ir:oo:null,g=h?h===Ir?i.length:c.length:0);const m=h===Ir&&/\b(transform|all)(,|$)/.test(r(`${Ir}Property`).toString());return{type:h,timeout:f,propCount:g,hasTransform:m}}function Rg(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,r)=>Pg(n)+Pg(t[r])))}function Pg(t){return t==="auto"?0:Number(t.slice(0,-1).replace(",","."))*1e3}function EC(){return document.body.offsetHeight}function bC(t,e,n){const r=t[Yo];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const Ml=Symbol("_vod"),vv=Symbol("_vsh"),IC={beforeMount(t,{value:e},{transition:n}){t[Ml]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):ao(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:r}){!e!=!n&&(r?e?(r.beforeEnter(t),ao(t,!0),r.enter(t)):r.leave(t,()=>{ao(t,!1)}):ao(t,e))},beforeUnmount(t,{value:e}){ao(t,e)}};function ao(t,e){t.style.display=e?t[Ml]:"none",t[vv]=!e}const TC=Symbol(""),CC=/(^|;)\s*display\s*:/;function AC(t,e,n){const r=t.style,s=dt(n);let i=!1;if(n&&!s){if(e)if(dt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&yl(r,a,"")}else for(const o in e)n[o]==null&&yl(r,o,"");for(const o in n)o==="display"&&(i=!0),yl(r,o,n[o])}else if(s){if(e!==n){const o=r[TC];o&&(n+=";"+o),r.cssText=n,i=CC.test(n)}}else e&&t.removeAttribute("style");Ml in t&&(t[Ml]=i?r.display:"",t[vv]&&(r.display="none"))}const xg=/\s*!important$/;function yl(t,e,n){if(fe(n))n.forEach(r=>yl(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=SC(t,e);xg.test(n)?t.setProperty(Mi(r),n.replace(xg,""),"important"):t[r]=n}}const kg=["Webkit","Moz","ms"],xu={};function SC(t,e){const n=xu[e];if(n)return n;let r=Kn(e);if(r!=="filter"&&r in t)return xu[e]=r;r=_c(r);for(let s=0;s<kg.length;s++){const i=kg[s]+r;if(i in t)return xu[e]=i}return e}const Ng="http://www.w3.org/1999/xlink";function RC(t,e,n,r,s){if(r&&e.startsWith("xlink:"))n==null?t.removeAttributeNS(Ng,e.slice(6,e.length)):t.setAttributeNS(Ng,e,n);else{const i=PI(e);n==null||i&&!vy(n)?t.removeAttribute(e):t.setAttribute(e,i?"":n)}}function PC(t,e,n,r,s,i,o){if(e==="innerHTML"||e==="textContent"){r&&o(r,s,i),t[e]=n??"";return}const a=t.tagName;if(e==="value"&&a!=="PROGRESS"&&!a.includes("-")){const u=a==="OPTION"?t.getAttribute("value")||"":t.value,h=n??"";(u!==h||!("_value"in t))&&(t.value=h),n==null&&t.removeAttribute(e),t._value=n;return}let c=!1;if(n===""||n==null){const u=typeof t[e];u==="boolean"?n=vy(n):n==null&&u==="string"?(n="",c=!0):u==="number"&&(n=0,c=!0)}try{t[e]=n}catch{}c&&t.removeAttribute(e)}function ti(t,e,n,r){t.addEventListener(e,n,r)}function xC(t,e,n,r){t.removeEventListener(e,n,r)}const Dg=Symbol("_vei");function kC(t,e,n,r,s=null){const i=t[Dg]||(t[Dg]={}),o=i[e];if(r&&o)o.value=r;else{const[a,c]=NC(e);if(r){const u=i[e]=MC(r,s);ti(t,a,u,c)}else o&&(xC(t,a,o,c),i[e]=void 0)}}const Og=/(?:Once|Passive|Capture)$/;function NC(t){let e;if(Og.test(t)){e={};let r;for(;r=t.match(Og);)t=t.slice(0,t.length-r[0].length),e[r[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Mi(t.slice(2)),e]}let ku=0;const DC=Promise.resolve(),OC=()=>ku||(DC.then(()=>ku=0),ku=Date.now());function MC(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;mn(LC(r,n.value),e,5,[r])};return n.value=t,n.attached=OC(),n}function LC(t,e){if(fe(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(r=>s=>!s._stopped&&r&&r(s))}else return e}const Mg=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,VC=(t,e,n,r,s,i,o,a,c)=>{const u=s==="svg";e==="class"?bC(t,r,u):e==="style"?AC(t,n,r):pc(e)?ad(e)||kC(t,e,n,r,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):FC(t,e,r,u))?PC(t,e,r,i,o,a,c):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),RC(t,e,r,u))};function FC(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&Mg(e)&&Ee(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Mg(e)&&dt(n)?!1:e in t}const Lg=t=>{const e=t.props["onUpdate:modelValue"]||!1;return fe(e)?n=>pl(e,n):e};function UC(t){t.target.composing=!0}function Vg(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Nu=Symbol("_assign"),BC={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t[Nu]=Lg(s);const i=r||s.props&&s.props.type==="number";ti(t,e?"change":"input",o=>{if(o.target.composing)return;let a=t.value;n&&(a=a.trim()),i&&(a=rh(a)),t[Nu](a)}),n&&ti(t,"change",()=>{t.value=t.value.trim()}),e||(ti(t,"compositionstart",UC),ti(t,"compositionend",Vg),ti(t,"change",Vg))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,modifiers:{lazy:n,trim:r,number:s}},i){if(t[Nu]=Lg(i),t.composing)return;const o=(s||t.type==="number")&&!/^0\d/.test(t.value)?rh(t.value):t.value,a=e??"";o!==a&&(document.activeElement===t&&t.type!=="range"&&(n||r&&t.value.trim()===a)||(t.value=a))}},$C=vt({patchProp:VC},mC);let Fg;function jC(){return Fg||(Fg=JT($C))}const qC=(...t)=>{const e=jC().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=WC(r);if(!s)return;const i=e._component;!Ee(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.innerHTML="";const o=n(s,!1,HC(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e};function HC(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function WC(t){return dt(t)?document.querySelector(t):t}function wv(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t))for(e=0;e<t.length;e++)t[e]&&(n=wv(t[e]))&&(r&&(r+=" "),r+=n);else for(e in t)t[e]&&(r&&(r+=" "),r+=e);return r}function zC(){for(var t,e,n=0,r="";n<arguments.length;)(t=arguments[n++])&&(e=wv(t))&&(r&&(r+=" "),r+=e);return r}const Ug=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,Bg=zC,Ev=(t,e)=>n=>{var r;if((e==null?void 0:e.variants)==null)return Bg(t,n==null?void 0:n.class,n==null?void 0:n.className);const{variants:s,defaultVariants:i}=e,o=Object.keys(s).map(u=>{const h=n==null?void 0:n[u],f=i==null?void 0:i[u];if(h===null)return null;const g=Ug(h)||Ug(f);return s[u][g]}),a=n&&Object.entries(n).reduce((u,h)=>{let[f,g]=h;return g===void 0||(u[f]=g),u},{}),c=e==null||(r=e.compoundVariants)===null||r===void 0?void 0:r.reduce((u,h)=>{let{class:f,className:g,...m}=h;return Object.entries(m).every(C=>{let[R,x]=C;return Array.isArray(x)?x.includes({...i,...a}[R]):{...i,...a}[R]===x})?[...u,f,g]:u},[]);return Bg(t,o,c,n==null?void 0:n.class,n==null?void 0:n.className)};function GC(t,e){const n=typeof t=="string"&&!e?`${t}Context`:e,r=Symbol(n);return[s=>{const i=kn(r,s);if(i||i===null)return i;throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(t)?`one of the following components: ${t.join(", ")}`:`\`${t}\``}`)},s=>(Po(r,s),s)]}function KC(t){let e=!1,n;const r=xI(!0);return(...s)=>(e||(n=r.run(()=>t(...s)),e=!0),n)}function YC(t){return typeof t=="function"?t():qe(t)}typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;function QC(t){var e;const n=YC(t);return(e=n==null?void 0:n.$el)!=null?e:n}function bv(t){return t?t.flatMap(e=>e.type===at?bv(e.children):[e]):[]}function kc(){const t=Sc(),e=he(),n=Be(()=>{var o,a;return["#text","#comment"].includes((o=e.value)==null?void 0:o.$el.nodeName)?(a=e.value)==null?void 0:a.$el.nextElementSibling:QC(e)}),r=Object.assign({},t.exposed),s={};for(const o in t.props)Object.defineProperty(s,o,{enumerable:!0,configurable:!0,get:()=>t.props[o]});if(Object.keys(r).length>0)for(const o in r)Object.defineProperty(s,o,{enumerable:!0,configurable:!0,get:()=>r[o]});Object.defineProperty(s,"$el",{enumerable:!0,configurable:!0,get:()=>t.vnode.el}),t.exposed=s;function i(o){e.value=o,!(o instanceof Element||!o)&&(Object.defineProperty(s,"$el",{enumerable:!0,configurable:!0,get:()=>o.$el}),t.exposed=s)}return{forwardRef:i,currentRef:e,currentElement:n}}const XC=Ln({name:"PrimitiveSlot",inheritAttrs:!1,setup(t,{attrs:e,slots:n}){return()=>{var r,s;if(!n.default)return null;const i=bv(n.default()),o=i.findIndex(h=>h.type!==Zt);if(o===-1)return i;const a=i[o];(r=a.props)==null||delete r.ref;const c=a.props?Hn(e,a.props):e;e.class&&(s=a.props)!=null&&s.class&&delete a.props.class;const u=ur(a,c);for(const h in c)h.startsWith("on")&&(u.props||(u.props={}),u.props[h]=c[h]);return i.length===1?u:(i[o]=u,i)}}}),va=Ln({name:"Primitive",inheritAttrs:!1,props:{asChild:{type:Boolean,default:!1},as:{type:[String,Object],default:"div"}},setup(t,{attrs:e,slots:n}){const r=t.asChild?"template":t.as;return typeof r=="string"&&["area","img","input"].includes(r)?()=>di(r,e):r!=="template"?()=>di(t.as,e,{default:n.default}):()=>di(XC,e,{default:n.default})}});Li({layersRoot:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set});KC(()=>he([]));const[Iv,JC]=GC("AvatarRoot"),ZC=Ln({__name:"AvatarRoot",props:{asChild:{type:Boolean},as:{default:"span"}},setup(t){return kc(),JC({imageLoadingStatus:he("loading")}),(e,n)=>(se(),gt(qe(va),{"as-child":e.asChild,as:e.as},{default:pe(()=>[St(e.$slots,"default")]),_:3},8,["as-child","as"]))}});function eA(t){const e=he("idle"),n=he(!1),r=s=>()=>{n.value&&(e.value=s)};return On(()=>{n.value=!0,_n(t,s=>{if(!s)e.value="error";else{const i=new window.Image;e.value="loading",i.onload=r("loaded"),i.onerror=r("error"),i.src=s}},{immediate:!0})}),Cc(()=>{n.value=!1}),e}const tA=Ln({__name:"AvatarImage",props:{src:{},asChild:{type:Boolean},as:{default:"img"}},emits:["loadingStatusChange"],setup(t,{emit:e}){const n=t,r=e,{src:s}=sT(n);kc();const i=Iv(),o=eA(s);return _n(o,a=>{r("loadingStatusChange",a),a!=="idle"&&(i.imageLoadingStatus.value=a)},{immediate:!0}),(a,c)=>Ky((se(),gt(qe(va),{role:"img","as-child":a.asChild,as:a.as,src:qe(s)},{default:pe(()=>[St(a.$slots,"default")]),_:3},8,["as-child","as","src"])),[[IC,qe(o)==="loaded"]])}}),nA=Ln({__name:"AvatarFallback",props:{delayMs:{default:0},asChild:{type:Boolean},as:{default:"span"}},setup(t){const e=t,n=Iv();kc();const r=he(!1);let s;return _n(n.imageLoadingStatus,i=>{i==="loading"&&(r.value=!1,e.delayMs?s=setTimeout(()=>{r.value=!0,clearTimeout(s)},e.delayMs):r.value=!0)},{immediate:!0}),(i,o)=>r.value&&qe(n).imageLoadingStatus.value!=="loaded"?(se(),gt(qe(va),{key:0,"as-child":i.asChild,as:i.as},{default:pe(()=>[St(i.$slots,"default")]),_:3},8,["as-child","as"])):Cn("",!0)}}),rA=Ln({__name:"Label",props:{for:{},asChild:{type:Boolean},as:{default:"label"}},setup(t){const e=t;return kc(),(n,r)=>(se(),gt(qe(va),Hn(e,{onMousedown:r[0]||(r[0]=s=>{!s.defaultPrevented&&s.detail>1&&s.preventDefault()})}),{default:pe(()=>[St(n.$slots,"default")]),_:3},16))}});function sA(){if(typeof matchMedia=="function")return matchMedia("(pointer:coarse)").matches?"coarse":"fine"}sA();function Tv(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(e=0;e<s;e++)t[e]&&(n=Tv(t[e]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function iA(){for(var t,e,n=0,r="",s=arguments.length;n<s;n++)(t=arguments[n])&&(e=Tv(t))&&(r&&(r+=" "),r+=e);return r}const Ad="-";function oA(t){const e=lA(t),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=t;function s(o){const a=o.split(Ad);return a[0]===""&&a.length!==1&&a.shift(),Cv(a,e)||aA(o)}function i(o,a){const c=n[o]||[];return a&&r[o]?[...c,...r[o]]:c}return{getClassGroupId:s,getConflictingClassGroupIds:i}}function Cv(t,e){var o;if(t.length===0)return e.classGroupId;const n=t[0],r=e.nextPart.get(n),s=r?Cv(t.slice(1),r):void 0;if(s)return s;if(e.validators.length===0)return;const i=t.join(Ad);return(o=e.validators.find(({validator:a})=>a(i)))==null?void 0:o.classGroupId}const $g=/^\[(.+)\]$/;function aA(t){if($g.test(t)){const e=$g.exec(t)[1],n=e==null?void 0:e.substring(0,e.indexOf(":"));if(n)return"arbitrary.."+n}}function lA(t){const{theme:e,prefix:n}=t,r={nextPart:new Map,validators:[]};return uA(Object.entries(t.classGroups),n).forEach(([i,o])=>{_h(o,r,i,e)}),r}function _h(t,e,n,r){t.forEach(s=>{if(typeof s=="string"){const i=s===""?e:jg(e,s);i.classGroupId=n;return}if(typeof s=="function"){if(cA(s)){_h(s(r),e,n,r);return}e.validators.push({validator:s,classGroupId:n});return}Object.entries(s).forEach(([i,o])=>{_h(o,jg(e,i),n,r)})})}function jg(t,e){let n=t;return e.split(Ad).forEach(r=>{n.nextPart.has(r)||n.nextPart.set(r,{nextPart:new Map,validators:[]}),n=n.nextPart.get(r)}),n}function cA(t){return t.isThemeGetter}function uA(t,e){return e?t.map(([n,r])=>{const s=r.map(i=>typeof i=="string"?e+i:typeof i=="object"?Object.fromEntries(Object.entries(i).map(([o,a])=>[e+o,a])):i);return[n,s]}):t}function hA(t){if(t<1)return{get:()=>{},set:()=>{}};let e=0,n=new Map,r=new Map;function s(i,o){n.set(i,o),e++,e>t&&(e=0,r=n,n=new Map)}return{get(i){let o=n.get(i);if(o!==void 0)return o;if((o=r.get(i))!==void 0)return s(i,o),o},set(i,o){n.has(i)?n.set(i,o):s(i,o)}}}const Av="!";function dA(t){const e=t.separator,n=e.length===1,r=e[0],s=e.length;return function(o){const a=[];let c=0,u=0,h;for(let R=0;R<o.length;R++){let x=o[R];if(c===0){if(x===r&&(n||o.slice(R,R+s)===e)){a.push(o.slice(u,R)),u=R+s;continue}if(x==="/"){h=R;continue}}x==="["?c++:x==="]"&&c--}const f=a.length===0?o:o.substring(u),g=f.startsWith(Av),m=g?f.substring(1):f,C=h&&h>u?h-u:void 0;return{modifiers:a,hasImportantModifier:g,baseClassName:m,maybePostfixModifierPosition:C}}}function fA(t){if(t.length<=1)return t;const e=[];let n=[];return t.forEach(r=>{r[0]==="["?(e.push(...n.sort(),r),n=[]):n.push(r)}),e.push(...n.sort()),e}function pA(t){return{cache:hA(t.cacheSize),splitModifiers:dA(t),...oA(t)}}const gA=/\s+/;function mA(t,e){const{splitModifiers:n,getClassGroupId:r,getConflictingClassGroupIds:s}=e,i=new Set;return t.trim().split(gA).map(o=>{const{modifiers:a,hasImportantModifier:c,baseClassName:u,maybePostfixModifierPosition:h}=n(o);let f=r(h?u.substring(0,h):u),g=!!h;if(!f){if(!h)return{isTailwindClass:!1,originalClassName:o};if(f=r(u),!f)return{isTailwindClass:!1,originalClassName:o};g=!1}const m=fA(a).join(":");return{isTailwindClass:!0,modifierId:c?m+Av:m,classGroupId:f,originalClassName:o,hasPostfixModifier:g}}).reverse().filter(o=>{if(!o.isTailwindClass)return!0;const{modifierId:a,classGroupId:c,hasPostfixModifier:u}=o,h=a+c;return i.has(h)?!1:(i.add(h),s(c,u).forEach(f=>i.add(a+f)),!0)}).reverse().map(o=>o.originalClassName).join(" ")}function _A(){let t=0,e,n,r="";for(;t<arguments.length;)(e=arguments[t++])&&(n=Sv(e))&&(r&&(r+=" "),r+=n);return r}function Sv(t){if(typeof t=="string")return t;let e,n="";for(let r=0;r<t.length;r++)t[r]&&(e=Sv(t[r]))&&(n&&(n+=" "),n+=e);return n}function yA(t,...e){let n,r,s,i=o;function o(c){const u=e.reduce((h,f)=>f(h),t());return n=pA(u),r=n.cache.get,s=n.cache.set,i=a,a(c)}function a(c){const u=r(c);if(u)return u;const h=mA(c,n);return s(c,h),h}return function(){return i(_A.apply(null,arguments))}}function nt(t){const e=n=>n[t]||[];return e.isThemeGetter=!0,e}const Rv=/^\[(?:([a-z-]+):)?(.+)\]$/i,vA=/^\d+\/\d+$/,wA=new Set(["px","full","screen"]),EA=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,bA=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,IA=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,TA=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,CA=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;function er(t){return ys(t)||wA.has(t)||vA.test(t)}function Cr(t){return Vi(t,"length",DA)}function ys(t){return!!t&&!Number.isNaN(Number(t))}function ol(t){return Vi(t,"number",ys)}function lo(t){return!!t&&Number.isInteger(Number(t))}function AA(t){return t.endsWith("%")&&ys(t.slice(0,-1))}function Te(t){return Rv.test(t)}function Ar(t){return EA.test(t)}const SA=new Set(["length","size","percentage"]);function RA(t){return Vi(t,SA,Pv)}function PA(t){return Vi(t,"position",Pv)}const xA=new Set(["image","url"]);function kA(t){return Vi(t,xA,MA)}function NA(t){return Vi(t,"",OA)}function co(){return!0}function Vi(t,e,n){const r=Rv.exec(t);return r?r[1]?typeof e=="string"?r[1]===e:e.has(r[1]):n(r[2]):!1}function DA(t){return bA.test(t)&&!IA.test(t)}function Pv(){return!1}function OA(t){return TA.test(t)}function MA(t){return CA.test(t)}function LA(){const t=nt("colors"),e=nt("spacing"),n=nt("blur"),r=nt("brightness"),s=nt("borderColor"),i=nt("borderRadius"),o=nt("borderSpacing"),a=nt("borderWidth"),c=nt("contrast"),u=nt("grayscale"),h=nt("hueRotate"),f=nt("invert"),g=nt("gap"),m=nt("gradientColorStops"),C=nt("gradientColorStopPositions"),R=nt("inset"),x=nt("margin"),L=nt("opacity"),F=nt("padding"),B=nt("saturate"),N=nt("scale"),Q=nt("sepia"),$=nt("skew"),A=nt("space"),y=nt("translate"),v=()=>["auto","contain","none"],T=()=>["auto","hidden","clip","visible","scroll"],S=()=>["auto",Te,e],b=()=>[Te,e],E=()=>["",er,Cr],De=()=>["auto",ys,Te],ot=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],Me=()=>["solid","dashed","dotted","double","none"],Ie=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],_e=()=>["start","end","center","between","around","evenly","stretch"],He=()=>["","0",Te],Tt=()=>["auto","avoid","all","avoid-page","page","left","right","column"],mt=()=>[ys,ol],We=()=>[ys,Te];return{cacheSize:500,separator:":",theme:{colors:[co],spacing:[er,Cr],blur:["none","",Ar,Te],brightness:mt(),borderColor:[t],borderRadius:["none","","full",Ar,Te],borderSpacing:b(),borderWidth:E(),contrast:mt(),grayscale:He(),hueRotate:We(),invert:He(),gap:b(),gradientColorStops:[t],gradientColorStopPositions:[AA,Cr],inset:S(),margin:S(),opacity:mt(),padding:b(),saturate:mt(),scale:mt(),sepia:He(),skew:We(),space:b(),translate:b()},classGroups:{aspect:[{aspect:["auto","square","video",Te]}],container:["container"],columns:[{columns:[Ar]}],"break-after":[{"break-after":Tt()}],"break-before":[{"break-before":Tt()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...ot(),Te]}],overflow:[{overflow:T()}],"overflow-x":[{"overflow-x":T()}],"overflow-y":[{"overflow-y":T()}],overscroll:[{overscroll:v()}],"overscroll-x":[{"overscroll-x":v()}],"overscroll-y":[{"overscroll-y":v()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[R]}],"inset-x":[{"inset-x":[R]}],"inset-y":[{"inset-y":[R]}],start:[{start:[R]}],end:[{end:[R]}],top:[{top:[R]}],right:[{right:[R]}],bottom:[{bottom:[R]}],left:[{left:[R]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",lo,Te]}],basis:[{basis:S()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",Te]}],grow:[{grow:He()}],shrink:[{shrink:He()}],order:[{order:["first","last","none",lo,Te]}],"grid-cols":[{"grid-cols":[co]}],"col-start-end":[{col:["auto",{span:["full",lo,Te]},Te]}],"col-start":[{"col-start":De()}],"col-end":[{"col-end":De()}],"grid-rows":[{"grid-rows":[co]}],"row-start-end":[{row:["auto",{span:[lo,Te]},Te]}],"row-start":[{"row-start":De()}],"row-end":[{"row-end":De()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",Te]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",Te]}],gap:[{gap:[g]}],"gap-x":[{"gap-x":[g]}],"gap-y":[{"gap-y":[g]}],"justify-content":[{justify:["normal",..._e()]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal",..._e(),"baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":[..._e(),"baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[F]}],px:[{px:[F]}],py:[{py:[F]}],ps:[{ps:[F]}],pe:[{pe:[F]}],pt:[{pt:[F]}],pr:[{pr:[F]}],pb:[{pb:[F]}],pl:[{pl:[F]}],m:[{m:[x]}],mx:[{mx:[x]}],my:[{my:[x]}],ms:[{ms:[x]}],me:[{me:[x]}],mt:[{mt:[x]}],mr:[{mr:[x]}],mb:[{mb:[x]}],ml:[{ml:[x]}],"space-x":[{"space-x":[A]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[A]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",Te,e]}],"min-w":[{"min-w":[Te,e,"min","max","fit"]}],"max-w":[{"max-w":[Te,e,"none","full","min","max","fit","prose",{screen:[Ar]},Ar]}],h:[{h:[Te,e,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[Te,e,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[Te,e,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[Te,e,"auto","min","max","fit"]}],"font-size":[{text:["base",Ar,Cr]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",ol]}],"font-family":[{font:[co]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractons"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",Te]}],"line-clamp":[{"line-clamp":["none",ys,ol]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",er,Te]}],"list-image":[{"list-image":["none",Te]}],"list-style-type":[{list:["none","disc","decimal",Te]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[t]}],"placeholder-opacity":[{"placeholder-opacity":[L]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[t]}],"text-opacity":[{"text-opacity":[L]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...Me(),"wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",er,Cr]}],"underline-offset":[{"underline-offset":["auto",er,Te]}],"text-decoration-color":[{decoration:[t]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:b()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",Te]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",Te]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[L]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...ot(),PA]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",RA]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},kA]}],"bg-color":[{bg:[t]}],"gradient-from-pos":[{from:[C]}],"gradient-via-pos":[{via:[C]}],"gradient-to-pos":[{to:[C]}],"gradient-from":[{from:[m]}],"gradient-via":[{via:[m]}],"gradient-to":[{to:[m]}],rounded:[{rounded:[i]}],"rounded-s":[{"rounded-s":[i]}],"rounded-e":[{"rounded-e":[i]}],"rounded-t":[{"rounded-t":[i]}],"rounded-r":[{"rounded-r":[i]}],"rounded-b":[{"rounded-b":[i]}],"rounded-l":[{"rounded-l":[i]}],"rounded-ss":[{"rounded-ss":[i]}],"rounded-se":[{"rounded-se":[i]}],"rounded-ee":[{"rounded-ee":[i]}],"rounded-es":[{"rounded-es":[i]}],"rounded-tl":[{"rounded-tl":[i]}],"rounded-tr":[{"rounded-tr":[i]}],"rounded-br":[{"rounded-br":[i]}],"rounded-bl":[{"rounded-bl":[i]}],"border-w":[{border:[a]}],"border-w-x":[{"border-x":[a]}],"border-w-y":[{"border-y":[a]}],"border-w-s":[{"border-s":[a]}],"border-w-e":[{"border-e":[a]}],"border-w-t":[{"border-t":[a]}],"border-w-r":[{"border-r":[a]}],"border-w-b":[{"border-b":[a]}],"border-w-l":[{"border-l":[a]}],"border-opacity":[{"border-opacity":[L]}],"border-style":[{border:[...Me(),"hidden"]}],"divide-x":[{"divide-x":[a]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[a]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[L]}],"divide-style":[{divide:Me()}],"border-color":[{border:[s]}],"border-color-x":[{"border-x":[s]}],"border-color-y":[{"border-y":[s]}],"border-color-t":[{"border-t":[s]}],"border-color-r":[{"border-r":[s]}],"border-color-b":[{"border-b":[s]}],"border-color-l":[{"border-l":[s]}],"divide-color":[{divide:[s]}],"outline-style":[{outline:["",...Me()]}],"outline-offset":[{"outline-offset":[er,Te]}],"outline-w":[{outline:[er,Cr]}],"outline-color":[{outline:[t]}],"ring-w":[{ring:E()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[t]}],"ring-opacity":[{"ring-opacity":[L]}],"ring-offset-w":[{"ring-offset":[er,Cr]}],"ring-offset-color":[{"ring-offset":[t]}],shadow:[{shadow:["","inner","none",Ar,NA]}],"shadow-color":[{shadow:[co]}],opacity:[{opacity:[L]}],"mix-blend":[{"mix-blend":[...Ie(),"plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":Ie()}],filter:[{filter:["","none"]}],blur:[{blur:[n]}],brightness:[{brightness:[r]}],contrast:[{contrast:[c]}],"drop-shadow":[{"drop-shadow":["","none",Ar,Te]}],grayscale:[{grayscale:[u]}],"hue-rotate":[{"hue-rotate":[h]}],invert:[{invert:[f]}],saturate:[{saturate:[B]}],sepia:[{sepia:[Q]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[n]}],"backdrop-brightness":[{"backdrop-brightness":[r]}],"backdrop-contrast":[{"backdrop-contrast":[c]}],"backdrop-grayscale":[{"backdrop-grayscale":[u]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[h]}],"backdrop-invert":[{"backdrop-invert":[f]}],"backdrop-opacity":[{"backdrop-opacity":[L]}],"backdrop-saturate":[{"backdrop-saturate":[B]}],"backdrop-sepia":[{"backdrop-sepia":[Q]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[o]}],"border-spacing-x":[{"border-spacing-x":[o]}],"border-spacing-y":[{"border-spacing-y":[o]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",Te]}],duration:[{duration:We()}],ease:[{ease:["linear","in","out","in-out",Te]}],delay:[{delay:We()}],animate:[{animate:["none","spin","ping","pulse","bounce",Te]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[N]}],"scale-x":[{"scale-x":[N]}],"scale-y":[{"scale-y":[N]}],rotate:[{rotate:[lo,Te]}],"translate-x":[{"translate-x":[y]}],"translate-y":[{"translate-y":[y]}],"skew-x":[{"skew-x":[$]}],"skew-y":[{"skew-y":[$]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",Te]}],accent:[{accent:["auto",t]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",Te]}],"caret-color":[{caret:[t]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":b()}],"scroll-mx":[{"scroll-mx":b()}],"scroll-my":[{"scroll-my":b()}],"scroll-ms":[{"scroll-ms":b()}],"scroll-me":[{"scroll-me":b()}],"scroll-mt":[{"scroll-mt":b()}],"scroll-mr":[{"scroll-mr":b()}],"scroll-mb":[{"scroll-mb":b()}],"scroll-ml":[{"scroll-ml":b()}],"scroll-p":[{"scroll-p":b()}],"scroll-px":[{"scroll-px":b()}],"scroll-py":[{"scroll-py":b()}],"scroll-ps":[{"scroll-ps":b()}],"scroll-pe":[{"scroll-pe":b()}],"scroll-pt":[{"scroll-pt":b()}],"scroll-pr":[{"scroll-pr":b()}],"scroll-pb":[{"scroll-pb":b()}],"scroll-pl":[{"scroll-pl":b()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",Te]}],fill:[{fill:[t,"none"]}],"stroke-w":[{stroke:[er,Cr,ol]}],stroke:[{stroke:[t,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}}const VA=yA(LA);function Nc(...t){return VA(iA(t))}const Sd={__name:"Button",props:{variant:{type:null,required:!1},size:{type:null,required:!1},class:{type:null,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(t){const e=t;return(n,r)=>(se(),gt(qe(va),{as:t.as,"as-child":t.asChild,class:$t(qe(Nc)(qe(FA)({variant:t.variant,size:t.size}),e.class))},{default:pe(()=>[St(n.$slots,"default")]),_:3},8,["as","as-child","class"]))}},FA=Ev("inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary-foreground underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",xs:"h-7 rounded px-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),UA={__name:"Avatar",props:{class:{type:null,required:!1},size:{type:null,required:!1,default:"sm"},shape:{type:null,required:!1,default:"circle"}},setup(t){const e=t;return(n,r)=>(se(),gt(qe(ZC),{class:$t(qe(Nc)(qe(jA)({size:t.size,shape:t.shape}),e.class))},{default:pe(()=>[St(n.$slots,"default")]),_:3},8,["class"]))}},BA={__name:"AvatarImage",props:{src:{type:String,required:!0},asChild:{type:Boolean,required:!1},as:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(se(),gt(qe(tA),Hn(e,{class:"h-full w-full object-cover"}),null,16))}},$A={__name:"AvatarFallback",props:{delayMs:{type:Number,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(se(),gt(qe(nA),sh(pv(e)),{default:pe(()=>[St(n.$slots,"default")]),_:3},16))}},jA=Ev("inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden",{variants:{size:{sm:"h-10 w-10 text-xs",base:"h-16 w-16 text-2xl",lg:"h-32 w-32 text-5xl"},shape:{circle:"rounded-full",square:"rounded-md"}}});function qA(t,e){return se(),ye("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[Z("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"}),Z("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"})])}function HA(t,e){return se(),ye("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[Z("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"})])}function WA(t,e){return se(),ye("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[Z("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"})])}var zA=Object.defineProperty,GA=(t,e,n)=>e in t?zA(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,Qt=(t,e,n)=>(GA(t,typeof e!="symbol"?e+"":e,n),n);function KA(t){if(typeof document>"u")return;let e=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",e.appendChild(n),n.styleSheet?n.styleSheet.cssText=t:n.appendChild(document.createTextNode(t))}KA("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999}[data-sonner-toaster][data-x-position=right]{right:max(var(--offset),env(safe-area-inset-right))}[data-sonner-toaster][data-x-position=left]{left:max(var(--offset),env(safe-area-inset-left))}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:max(var(--offset),env(safe-area-inset-top))}[data-sonner-toaster][data-y-position=bottom]{bottom:max(var(--offset),env(safe-area-inset-bottom))}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;will-change:transform,opacity,height;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast] [data-description]{font-weight:400;line-height:1.4;color:inherit}[data-sonner-toast] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast] [data-icon]>*{flex-shrink:0}[data-sonner-toast] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast] [data-content]{display:flex;flex-direction:column;gap:2px;transform:translateZ(0)}[data-sonner-toast] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toast][data-theme=dark] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;background:var(--gray1);color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]:before{content:'';position:absolute;left:0;right:0;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]:before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]:before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]:before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast]:after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]:before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount,0));transition:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation:swipe-out .2s ease-out forwards}@keyframes swipe-out{from{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));opacity:1}to{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;--mobile-offset:16px;right:var(--mobile-offset);left:var(--mobile-offset);width:100%}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - 32px)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset)}[data-sonner-toaster][data-y-position=bottom]{bottom:20px}[data-sonner-toaster][data-y-position=top]{top:20px}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset);right:var(--mobile-offset);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 91%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 91%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 91%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 100%, 12%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 12%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-rich-colors=true] [data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true] [data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true] [data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true] [data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true] [data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true] [data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true] [data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true] [data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");let yh=0;class YA{constructor(){Qt(this,"subscribers"),Qt(this,"toasts"),Qt(this,"subscribe",e=>(this.subscribers.push(e),()=>{const n=this.subscribers.indexOf(e);this.subscribers.splice(n,1)})),Qt(this,"publish",e=>{this.subscribers.forEach(n=>n(e))}),Qt(this,"addToast",e=>{this.publish(e),this.toasts=[...this.toasts,e]}),Qt(this,"create",e=>{var n;const{message:r,...s}=e,i=typeof e.id=="number"||e.id&&((n=e.id)==null?void 0:n.length)>0?e.id:yh++,o=this.toasts.find(c=>c.id===i),a=e.dismissible===void 0?!0:e.dismissible;return o?this.toasts=this.toasts.map(c=>c.id===i?(this.publish({...c,...e,id:i,title:r}),{...c,...e,id:i,dismissible:a,title:r}):c):this.addToast({title:r,...s,dismissible:a,id:i}),i}),Qt(this,"dismiss",e=>(e||this.toasts.forEach(n=>{this.subscribers.forEach(r=>r({id:n.id,dismiss:!0}))}),this.subscribers.forEach(n=>n({id:e,dismiss:!0})),e)),Qt(this,"message",(e,n)=>this.create({...n,message:e,type:"default"})),Qt(this,"error",(e,n)=>this.create({...n,type:"error",message:e})),Qt(this,"success",(e,n)=>this.create({...n,type:"success",message:e})),Qt(this,"info",(e,n)=>this.create({...n,type:"info",message:e})),Qt(this,"warning",(e,n)=>this.create({...n,type:"warning",message:e})),Qt(this,"loading",(e,n)=>this.create({...n,type:"loading",message:e})),Qt(this,"promise",(e,n)=>{if(!n)return;let r;n.loading!==void 0&&(r=this.create({...n,promise:e,type:"loading",message:n.loading,description:typeof n.description!="function"?n.description:void 0}));const s=e instanceof Promise?e:e();let i=r!==void 0;return s.then(o=>{if(o&&typeof o.ok=="boolean"&&!o.ok){i=!1;const a=typeof n.error=="function"?n.error(`HTTP error! status: ${response.status}`):n.error,c=typeof n.description=="function"?n.description(`HTTP error! status: ${response.status}`):n.description;this.create({id:r,type:"error",message:a,description:c})}else if(n.success!==void 0){i=!1;const a=typeof n.success=="function"?n.success(o):n.success,c=typeof n.description=="function"?n.description(o):n.description;this.create({id:r,type:"success",message:a,description:c})}}).catch(o=>{if(n.error!==void 0){i=!1;const a=typeof n.error=="function"?n.error(o):n.error,c=typeof n.description=="function"?n.description(o):n.description;this.create({id:r,type:"error",message:a,description:c})}}).finally(()=>{var o;i&&(this.dismiss(r),r=void 0),(o=n.finally)==null||o.call(n)}),r}),Qt(this,"custom",(e,n)=>{const r=(n==null?void 0:n.id)||yh++;return this.publish({component:e,id:r,...n}),r}),this.subscribers=[],this.toasts=[]}}const Tn=new YA,QA=(t,e)=>{const n=(e==null?void 0:e.id)||yh++;return Tn.create({message:t,id:n,type:"default",...e}),n},XA=QA,$n=Object.assign(XA,{success:Tn.success,info:Tn.info,warning:Tn.warning,error:Tn.error,custom:Tn.custom,message:Tn.message,promise:Tn.promise,dismiss:Tn.dismiss,loading:Tn.loading}),wa=(t,e)=>{const n=t.__vccOpts||t;for(const[r,s]of e)n[r]=s;return n},JA={},ZA={xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stoke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},eS=Z("line",{x1:"18",y1:"6",x2:"6",y2:"18"},null,-1),tS=Z("line",{x1:"6",y1:"6",x2:"18",y2:"18"},null,-1),nS=[eS,tS];function rS(t,e){return se(),ye("svg",ZA,nS)}const sS=wa(JA,[["render",rS]]),iS=()=>{const t=he(!1);return Cs(()=>{const e=()=>{t.value=document.hidden};return document.addEventListener("visibilitychange",e),()=>window.removeEventListener("visibilitychange",e)}),{isDocumentHidden:t}},oS=["aria-live","data-styled","data-mounted","data-promise","data-removed","data-visible","data-y-position","data-x-position","data-index","data-front","data-swiping","data-dismissible","data-type","data-invert","data-swipe-out","data-expanded"],aS=["aria-label","data-disabled"],lS={key:0,"data-icon":""},cS={"data-content":""},uS=4e3,hS=14,dS=20,fS=200,pS=Ln({__name:"Toast",props:{toast:{},toasts:{},index:{},expanded:{type:Boolean},invert:{type:Boolean},heights:{},gap:{},position:{},visibleToasts:{},expandByDefault:{type:Boolean},closeButton:{type:Boolean},interacting:{type:Boolean},duration:{},descriptionClass:{},style:{},cancelButtonStyle:{},actionButtonStyle:{},unstyled:{type:Boolean},loadingIcon:{},class:{},classes:{},icons:{},closeButtonAriaLabel:{},pauseWhenPageIsHidden:{type:Boolean},cn:{type:Function}},emits:["update:heights","removeToast"],setup(t,{emit:e}){const n=e,r=t,s=he(!1),i=he(!1),o=he(!1),a=he(!1),c=he(0),u=he(0),h=he(null),f=he(null),g=Be(()=>r.index===0),m=Be(()=>r.index+1<=r.visibleToasts),C=Be(()=>r.toast.type),R=Be(()=>r.toast.dismissible!==!1),x=Be(()=>{var U,Ce,Se,O,z,G,te;return r.cn((U=r.classes)==null?void 0:U.toast,(Se=(Ce=r.toast)==null?void 0:Ce.classes)==null?void 0:Se.toast,(O=r.classes)==null?void 0:O.default,(z=r.classes)==null?void 0:z[r.toast.type||"default"],(te=(G=r.toast)==null?void 0:G.classes)==null?void 0:te[r.toast.type||"default"])}),L=r.toast.style||{},F=Be(()=>r.heights.findIndex(U=>U.toastId===r.toast.id)||0),B=Be(()=>r.toast.closeButton??r.closeButton),N=Be(()=>r.toast.duration||r.duration||uS),Q=he(0),$=he(0),A=he(N.value),y=he(0),v=he(null),T=Be(()=>r.position.split("-")),S=Be(()=>T.value[0]),b=Be(()=>T.value[1]),E=typeof r.toast.title!="string",De=typeof r.toast.description!="string",ot=Be(()=>r.heights.reduce((U,Ce,Se)=>Se>=F.value?U:U+Ce.height,0)),Me=iS(),Ie=Be(()=>r.toast.invert||r.invert),_e=Be(()=>C.value==="loading");On(()=>{if(!s.value)return;const U=f.value,Ce=U==null?void 0:U.style.height;U.style.height="auto";const Se=U.getBoundingClientRect().height;U.style.height=Ce,u.value=Se;let O;r.heights.find(z=>z.toastId===r.toast.id)?O=r.heights.map(z=>z.toastId===r.toast.id?{...z,height:Se}:z):O=[{toastId:r.toast.id,height:Se,position:r.toast.position},...r.heights],n("update:heights",O)});const He=()=>{i.value=!0,c.value=$.value;const U=r.heights.filter(Ce=>Ce.toastId!==r.toast.id);n("update:heights",U),setTimeout(()=>{n("removeToast",r.toast)},fS)},Tt=()=>{var U,Ce;_e.value||!R.value||(He(),(Ce=(U=r.toast).onDismiss)==null||Ce.call(U,r.toast))},mt=U=>{_e.value||!R.value||(h.value=new Date,c.value=$.value,U.target.setPointerCapture(U.pointerId),U.target.tagName!=="BUTTON"&&(o.value=!0,v.value={x:U.clientX,y:U.clientY}))},We=U=>{var Ce,Se,O,z;if(a.value)return;v.value=null;const G=Number(((Ce=f.value)==null?void 0:Ce.style.getPropertyValue("--swipe-amount").replace("px",""))||0),te=new Date().getTime()-h.value.getTime(),Ae=Math.abs(G)/te;if(Math.abs(G)>=dS||Ae>.11){c.value=$.value,(O=(Se=r.toast).onDismiss)==null||O.call(Se,r.toast),He(),a.value=!0;return}(z=f.value)==null||z.style.setProperty("--swipe-amount","0px"),o.value=!1},et=U=>{var Ce;if(!v.value)return;const Se=U.clientY-v.value.y,O=U.clientX-v.value.x,z=(T.value[0]==="top"?Math.min:Math.max)(0,Se),G=U.pointerType==="touch"?10:2;Math.abs(z)>G?(Ce=f.value)==null||Ce.style.setProperty("--swipe-amount",`${Se}px`):Math.abs(O)>G&&(v.value=null)};return Cs(()=>{$.value=F.value*hS+ot.value}),Cs(U=>{if(r.toast.promise&&C.value==="loading"||r.toast.duration===1/0||r.toast.type==="loading")return;let Ce;const Se=()=>{if(y.value<Q.value){const z=new Date().getTime()-Q.value;A.value=A.value-z}y.value=new Date().getTime()},O=()=>{Q.value=new Date().getTime(),Ce=setTimeout(()=>{var z,G;(G=(z=r.toast).onAutoClose)==null||G.call(z,r.toast),He()},A.value)};r.expanded||r.interacting||r.pauseWhenPageIsHidden&&Me?Se():O(),U(()=>{clearTimeout(Ce)})}),Cs(()=>{r.toast.delete&&He()}),On(()=>{if(f.value){const U=f.value.getBoundingClientRect().height;u.value=U;const Ce=[{toastId:r.toast.id,height:U,position:r.toast.position},...r.heights];n("update:heights",Ce)}s.value=!0}),Cc(()=>{if(f.value){const U=r.heights.filter(Ce=>Ce.toastId!==r.toast.id);n("update:heights",U)}}),(U,Ce)=>{var Se,O,z,G,te,Ae,ze,w,I,k,V,M;return se(),ye("li",{"aria-live":U.toast.important?"assertive":"polite","aria-atomic":"true",role:"status",tabindex:"0",ref_key:"toastRef",ref:f,"data-sonner-toast":"",class:$t(x.value),"data-styled":!(U.toast.component||(Se=U.toast)!=null&&Se.unstyled||U.unstyled),"data-mounted":s.value,"data-promise":!!U.toast.promise,"data-removed":i.value,"data-visible":m.value,"data-y-position":S.value,"data-x-position":b.value,"data-index":U.index,"data-front":g.value,"data-swiping":o.value,"data-dismissible":R.value,"data-type":C.value,"data-invert":Ie.value,"data-swipe-out":a.value,"data-expanded":!!(U.expanded||U.expandByDefault&&s.value),style:Kr({"--index":U.index,"--toasts-before":U.index,"--z-index":U.toasts.length-U.index,"--offset":`${i.value?c.value:$.value}px`,"--initial-height":U.expandByDefault?"auto":`${u.value}px`,...U.style,...qe(L)}),onPointerdown:mt,onPointerup:We,onPointermove:et},[B.value&&!U.toast.component?(se(),ye("button",{key:0,"aria-label":U.closeButtonAriaLabel||"Close toast","data-disabled":_e.value,"data-close-button":"",class:$t(U.cn((O=U.classes)==null?void 0:O.closeButton,(G=(z=U.toast)==null?void 0:z.classes)==null?void 0:G.closeButton)),onClick:Tt},[re(sS)],10,aS)):Cn("",!0),U.toast.component?(se(),gt(oi(U.toast.component),Hn({key:1},U.toast.componentProps,{onCloseToast:He}),null,16)):(se(),ye(at,{key:2},[C.value!=="default"||U.toast.icon||U.toast.promise?(se(),ye("div",lS,[(U.toast.promise||C.value==="loading")&&!U.toast.icon?St(U.$slots,"loading-icon",{key:0}):Cn("",!0),U.toast.icon?(se(),gt(oi(U.toast.icon),{key:1})):(se(),ye(at,{key:2},[C.value==="success"?St(U.$slots,"success-icon",{key:0}):C.value==="error"?St(U.$slots,"error-icon",{key:1}):C.value==="warning"?St(U.$slots,"warning-icon",{key:2}):C.value==="info"?St(U.$slots,"info-icon",{key:3}):Cn("",!0)],64))])):Cn("",!0),Z("div",cS,[Z("div",{"data-title":"",class:$t(U.cn((te=U.classes)==null?void 0:te.title,(Ae=U.toast.classes)==null?void 0:Ae.title))},[E?(se(),gt(oi(U.toast.title),sh(Hn({key:0},U.toast.componentProps)),null,16)):(se(),ye(at,{key:1},[Qe(Vr(U.toast.title),1)],64))],2),U.toast.description?(se(),ye("div",{key:0,"data-description":"",class:$t(U.cn(U.descriptionClass,U.toast.descriptionClass,(ze=U.classes)==null?void 0:ze.description,(w=U.toast.classes)==null?void 0:w.description))},[De?(se(),gt(oi(U.toast.description),sh(Hn({key:0},U.toast.componentProps)),null,16)):(se(),ye(at,{key:1},[Qe(Vr(U.toast.description),1)],64))],2)):Cn("",!0)]),U.toast.cancel?(se(),ye("button",{key:1,class:$t(U.cn((I=U.classes)==null?void 0:I.cancelButton,(k=U.toast.classes)==null?void 0:k.cancelButton)),"data-button":"","data-cancel":"",onClick:Ce[0]||(Ce[0]=()=>{var W;He(),(W=U.toast.cancel)!=null&&W.onClick&&U.toast.cancel.onClick()})},Vr(U.toast.cancel.label),3)):Cn("",!0),U.toast.action?(se(),ye("button",{key:2,class:$t(U.cn((V=U.classes)==null?void 0:V.actionButton,(M=U.toast.classes)==null?void 0:M.actionButton)),"data-button":"",onClick:Ce[1]||(Ce[1]=W=>{var ee;(ee=U.toast.action)==null||ee.onClick(W),!W.defaultPrevented&&He()})},Vr(U.toast.action.label),3)):Cn("",!0)],64))],46,oS)}}}),gS=["data-visible"],mS={class:"sonner-spinner"},_S=Ln({__name:"Loader",props:{visible:{type:Boolean}},setup(t){const e=Array(12).fill(0);return(n,r)=>(se(),ye("div",{class:"sonner-loading-wrapper","data-visible":n.visible},[Z("div",mS,[(se(!0),ye(at,null,Ei(qe(e),s=>(se(),ye("div",{key:`spinner-bar-${s}`,class:"sonner-loading-bar"}))),128))])],8,gS))}}),yS={},vS={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},wS=Z("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z","clip-rule":"evenodd"},null,-1),ES=[wS];function bS(t,e){return se(),ye("svg",vS,ES)}const IS=wa(yS,[["render",bS]]),TS={},CS={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},AS=Z("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z","clip-rule":"evenodd"},null,-1),SS=[AS];function RS(t,e){return se(),ye("svg",CS,SS)}const PS=wa(TS,[["render",RS]]),xS={},kS={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},NS=Z("path",{"fill-rule":"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z","clip-rule":"evenodd"},null,-1),DS=[NS];function OS(t,e){return se(),ye("svg",kS,DS)}const MS=wa(xS,[["render",OS]]),LS={},VS={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},FS=Z("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z","clip-rule":"evenodd"},null,-1),US=[FS];function BS(t,e){return se(),ye("svg",VS,US)}const $S=wa(LS,[["render",BS]]),jS=["aria-label"],qS=["dir","data-theme","data-rich-colors","data-y-position","data-x-position"],HS=3,qg="32px",WS=4e3,zS=356,Hg=14,GS=typeof window<"u"&&typeof document<"u",KS=Ln({name:"Toaster",inheritAttrs:!1,__name:"Toaster",props:{invert:{type:Boolean,default:!1},theme:{default:"light"},position:{default:"bottom-right"},hotkey:{default:()=>["altKey","KeyT"]},richColors:{type:Boolean,default:!1},expand:{type:Boolean,default:!1},duration:{default:WS},gap:{default:Hg},visibleToasts:{default:HS},closeButton:{type:Boolean,default:!1},toastOptions:{default:()=>({})},class:{default:""},style:{default:()=>({})},offset:{default:qg},dir:{default:"auto"},icons:{},containerAriaLabel:{default:"Notifications"},pauseWhenPageIsHidden:{type:Boolean,default:!1},cn:{}},setup(t){function e(...N){return N.filter(Boolean).join(" ")}function n(){if(typeof window>"u"||typeof document>"u")return"ltr";const N=document.documentElement.getAttribute("dir");return N==="auto"||!N?window.getComputedStyle(document.documentElement).direction:N}const r=t,s=FT(),i=he([]),o=Be(()=>{const N=i.value.filter(Q=>Q.position).map(Q=>Q.position);return N.length>0?Array.from(new Set([r.position].concat(N))):[r.position]}),a=he([]),c=he(!1),u=he(!1),h=he(r.theme!=="system"?r.theme:typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),f=Be(()=>r.cn||e),g=he(null),m=he(null),C=he(!1),R=r.hotkey.join("+").replace(/Key/g,"").replace(/Digit/g,"");function x(N){i.value=i.value.filter(({id:Q})=>Q!==N.id)}const L=N=>{var Q,$;C.value&&!(($=(Q=N.currentTarget)==null?void 0:Q.contains)!=null&&$.call(Q,N.relatedTarget))&&(C.value=!1,m.value&&(m.value.focus({preventScroll:!0}),m.value=null))},F=N=>{N.target instanceof HTMLElement&&N.target.dataset.dismissible==="false"||C.value||(C.value=!0,m.value=N.relatedTarget)},B=N=>{N.target&&N.target instanceof HTMLElement&&N.target.dataset.dismissible==="false"||(u.value=!1)};return Cs(N=>{const Q=Tn.subscribe($=>{if($.dismiss){i.value=i.value.map(A=>A.id===$.id?{...A,delete:!0}:A);return}wc(()=>{const A=i.value.findIndex(y=>y.id===$.id);A!==-1?i.value.splice(A,1,$):i.value=[$,...i.value]})});N(()=>{Q()})}),_n(()=>r.theme,N=>{if(N!=="system"){h.value=N;return}N==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?h.value="dark":h.value="light"),!(typeof window>"u")&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",({matches:Q})=>{Q?h.value="dark":h.value="light"})}),_n(()=>g.value,()=>{if(g.value)return()=>{m.value&&(m.value.focus({preventScroll:!0}),m.value=null,C.value=!1)}}),Cs(()=>{i.value.length<=1&&(c.value=!1)}),Cs(N=>{function Q($){const A=r.hotkey.every(T=>$[T]||$.code===T),y=Array.isArray(g.value)?g.value[0]:g.value;A&&(c.value=!0,y==null||y.focus());const v=document.activeElement===g.value||(y==null?void 0:y.contains(document.activeElement));$.code==="Escape"&&v&&(c.value=!1)}GS&&(document.addEventListener("keydown",Q),N(()=>{document.removeEventListener("keydown",Q)}))}),(N,Q)=>(se(),ye("section",{"aria-label":`${N.containerAriaLabel} ${qe(R)}`,tabIndex:-1},[(se(!0),ye(at,null,Ei(o.value,($,A)=>{var y;return se(),ye("ol",Hn({key:$,ref_for:!0,ref_key:"listRef",ref:g,"data-sonner-toaster":"",class:N.class,dir:N.dir==="auto"?n():N.dir,tabIndex:-1,"data-theme":N.theme,"data-rich-colors":N.richColors,"data-y-position":$.split("-")[0],"data-x-position":$.split("-")[1],style:{"--front-toast-height":`${(y=a.value[0])==null?void 0:y.height}px`,"--offset":typeof N.offset=="number"?`${N.offset}px`:N.offset||qg,"--width":`${zS}px`,"--gap":`${Hg}px`,...N.style,...qe(s).style},onBlur:L,onFocus:F,onMouseenter:Q[1]||(Q[1]=v=>c.value=!0),onMousemove:Q[2]||(Q[2]=v=>c.value=!0),onMouseleave:Q[3]||(Q[3]=()=>{u.value||(c.value=!1)}),onPointerdown:B,onPointerup:Q[4]||(Q[4]=v=>u.value=!1)},N.$attrs),[(se(!0),ye(at,null,Ei(i.value.filter(v=>!v.position&&A===0||v.position===N.position),(v,T)=>{var S,b,E,De,ot,Me,Ie,_e,He;return se(),gt(pS,{key:v.id,index:T,toast:v,duration:((S=N.toastOptions)==null?void 0:S.duration)??N.duration,class:$t((b=N.toastOptions)==null?void 0:b.class),descriptionClass:(E=N.toastOptions)==null?void 0:E.descriptionClass,invert:N.invert,visibleToasts:N.visibleToasts,closeButton:((De=N.toastOptions)==null?void 0:De.closeButton)??N.closeButton,interacting:u.value,position:N.position,style:Kr((ot=N.toastOptions)==null?void 0:ot.style),unstyled:(Me=N.toastOptions)==null?void 0:Me.unstyled,classes:(Ie=N.toastOptions)==null?void 0:Ie.classes,cancelButtonStyle:(_e=N.toastOptions)==null?void 0:_e.cancelButtonStyle,actionButtonStyle:(He=N.toastOptions)==null?void 0:He.actionButtonStyle,toasts:i.value,expandByDefault:N.expand,gap:N.gap,expanded:c.value,pauseWhenPageIsHidden:N.pauseWhenPageIsHidden,cn:f.value,heights:a.value,"onUpdate:heights":Q[0]||(Q[0]=Tt=>a.value=Tt),onRemoveToast:x},{"loading-icon":pe(()=>[St(N.$slots,"loading-icon",{},()=>[re(_S,{visible:v.type==="loading"},null,8,["visible"])])]),"success-icon":pe(()=>[St(N.$slots,"success-icon",{},()=>[re(IS)])]),"error-icon":pe(()=>[St(N.$slots,"error-icon",{},()=>[re($S)])]),"warning-icon":pe(()=>[St(N.$slots,"warning-icon",{},()=>[re(MS)])]),"info-icon":pe(()=>[St(N.$slots,"info-icon",{},()=>[re(PS)])]),_:2},1032,["index","toast","duration","class","descriptionClass","invert","visibleToasts","closeButton","interacting","position","style","unstyled","classes","cancelButtonStyle","actionButtonStyle","toasts","expandByDefault","gap","expanded","pauseWhenPageIsHidden","cn","heights"])}),128))],16,qS)}),128))],8,jS))}});/*!
  * vue-router v4.3.2
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */const ni=typeof document<"u";function YS(t){return t.__esModule||t[Symbol.toStringTag]==="Module"}const Ge=Object.assign;function Du(t,e){const n={};for(const r in e){const s=e[r];n[r]=Mn(s)?s.map(t):t(s)}return n}const ko=()=>{},Mn=Array.isArray,xv=/#/g,QS=/&/g,XS=/\//g,JS=/=/g,ZS=/\?/g,kv=/\+/g,eR=/%5B/g,tR=/%5D/g,Nv=/%5E/g,nR=/%60/g,Dv=/%7B/g,rR=/%7C/g,Ov=/%7D/g,sR=/%20/g;function Rd(t){return encodeURI(""+t).replace(rR,"|").replace(eR,"[").replace(tR,"]")}function iR(t){return Rd(t).replace(Dv,"{").replace(Ov,"}").replace(Nv,"^")}function vh(t){return Rd(t).replace(kv,"%2B").replace(sR,"+").replace(xv,"%23").replace(QS,"%26").replace(nR,"`").replace(Dv,"{").replace(Ov,"}").replace(Nv,"^")}function oR(t){return vh(t).replace(JS,"%3D")}function aR(t){return Rd(t).replace(xv,"%23").replace(ZS,"%3F")}function lR(t){return t==null?"":aR(t).replace(XS,"%2F")}function Qo(t){try{return decodeURIComponent(""+t)}catch{}return""+t}const cR=/\/$/,uR=t=>t.replace(cR,"");function Ou(t,e,n="/"){let r,s={},i="",o="";const a=e.indexOf("#");let c=e.indexOf("?");return a<c&&a>=0&&(c=-1),c>-1&&(r=e.slice(0,c),i=e.slice(c+1,a>-1?a:e.length),s=t(i)),a>-1&&(r=r||e.slice(0,a),o=e.slice(a,e.length)),r=pR(r??e,n),{fullPath:r+(i&&"?")+i+o,path:r,query:s,hash:Qo(o)}}function hR(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Wg(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function dR(t,e,n){const r=e.matched.length-1,s=n.matched.length-1;return r>-1&&r===s&&bi(e.matched[r],n.matched[s])&&Mv(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function bi(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function Mv(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!fR(t[n],e[n]))return!1;return!0}function fR(t,e){return Mn(t)?zg(t,e):Mn(e)?zg(e,t):t===e}function zg(t,e){return Mn(e)?t.length===e.length&&t.every((n,r)=>n===e[r]):t.length===1&&t[0]===e}function pR(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),r=t.split("/"),s=r[r.length-1];(s===".."||s===".")&&r.push("");let i=n.length-1,o,a;for(o=0;o<r.length;o++)if(a=r[o],a!==".")if(a==="..")i>1&&i--;else break;return n.slice(0,i).join("/")+"/"+r.slice(o).join("/")}var Xo;(function(t){t.pop="pop",t.push="push"})(Xo||(Xo={}));var No;(function(t){t.back="back",t.forward="forward",t.unknown=""})(No||(No={}));function gR(t){if(!t)if(ni){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),uR(t)}const mR=/^[^#]+#/;function _R(t,e){return t.replace(mR,"#")+e}function yR(t,e){const n=document.documentElement.getBoundingClientRect(),r=t.getBoundingClientRect();return{behavior:e.behavior,left:r.left-n.left-(e.left||0),top:r.top-n.top-(e.top||0)}}const Dc=()=>({left:window.scrollX,top:window.scrollY});function vR(t){let e;if("el"in t){const n=t.el,r=typeof n=="string"&&n.startsWith("#"),s=typeof n=="string"?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!s)return;e=yR(s,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function Gg(t,e){return(history.state?history.state.position-e:-1)+t}const wh=new Map;function wR(t,e){wh.set(t,e)}function ER(t){const e=wh.get(t);return wh.delete(t),e}let bR=()=>location.protocol+"//"+location.host;function Lv(t,e){const{pathname:n,search:r,hash:s}=e,i=t.indexOf("#");if(i>-1){let a=s.includes(t.slice(i))?t.slice(i).length:1,c=s.slice(a);return c[0]!=="/"&&(c="/"+c),Wg(c,"")}return Wg(n,t)+r+s}function IR(t,e,n,r){let s=[],i=[],o=null;const a=({state:g})=>{const m=Lv(t,location),C=n.value,R=e.value;let x=0;if(g){if(n.value=m,e.value=g,o&&o===C){o=null;return}x=R?g.position-R.position:0}else r(m);s.forEach(L=>{L(n.value,C,{delta:x,type:Xo.pop,direction:x?x>0?No.forward:No.back:No.unknown})})};function c(){o=n.value}function u(g){s.push(g);const m=()=>{const C=s.indexOf(g);C>-1&&s.splice(C,1)};return i.push(m),m}function h(){const{history:g}=window;g.state&&g.replaceState(Ge({},g.state,{scroll:Dc()}),"")}function f(){for(const g of i)g();i=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",h)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",h,{passive:!0}),{pauseListeners:c,listen:u,destroy:f}}function Kg(t,e,n,r=!1,s=!1){return{back:t,current:e,forward:n,replaced:r,position:window.history.length,scroll:s?Dc():null}}function TR(t){const{history:e,location:n}=window,r={value:Lv(t,n)},s={value:e.state};s.value||i(r.value,{back:null,current:r.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function i(c,u,h){const f=t.indexOf("#"),g=f>-1?(n.host&&document.querySelector("base")?t:t.slice(f))+c:bR()+t+c;try{e[h?"replaceState":"pushState"](u,"",g),s.value=u}catch(m){console.error(m),n[h?"replace":"assign"](g)}}function o(c,u){const h=Ge({},e.state,Kg(s.value.back,c,s.value.forward,!0),u,{position:s.value.position});i(c,h,!0),r.value=c}function a(c,u){const h=Ge({},s.value,e.state,{forward:c,scroll:Dc()});i(h.current,h,!0);const f=Ge({},Kg(r.value,c,null),{position:h.position+1},u);i(c,f,!1),r.value=c}return{location:r,state:s,push:a,replace:o}}function CR(t){t=gR(t);const e=TR(t),n=IR(t,e.state,e.location,e.replace);function r(i,o=!0){o||n.pauseListeners(),history.go(i)}const s=Ge({location:"",base:t,go:r,createHref:_R.bind(null,t)},e,n);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>e.state.value}),s}function AR(t){return typeof t=="string"||t&&typeof t=="object"}function Vv(t){return typeof t=="string"||typeof t=="symbol"}const Sr={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},Fv=Symbol("");var Yg;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Yg||(Yg={}));function Ii(t,e){return Ge(new Error,{type:t,[Fv]:!0},e)}function tr(t,e){return t instanceof Error&&Fv in t&&(e==null||!!(t.type&e))}const Qg="[^/]+?",SR={sensitive:!1,strict:!1,start:!0,end:!0},RR=/[.+*?^${}()[\]/\\]/g;function PR(t,e){const n=Ge({},SR,e),r=[];let s=n.start?"^":"";const i=[];for(const u of t){const h=u.length?[]:[90];n.strict&&!u.length&&(s+="/");for(let f=0;f<u.length;f++){const g=u[f];let m=40+(n.sensitive?.25:0);if(g.type===0)f||(s+="/"),s+=g.value.replace(RR,"\\$&"),m+=40;else if(g.type===1){const{value:C,repeatable:R,optional:x,regexp:L}=g;i.push({name:C,repeatable:R,optional:x});const F=L||Qg;if(F!==Qg){m+=10;try{new RegExp(`(${F})`)}catch(N){throw new Error(`Invalid custom RegExp for param "${C}" (${F}): `+N.message)}}let B=R?`((?:${F})(?:/(?:${F}))*)`:`(${F})`;f||(B=x&&u.length<2?`(?:/${B})`:"/"+B),x&&(B+="?"),s+=B,m+=20,x&&(m+=-8),R&&(m+=-20),F===".*"&&(m+=-50)}h.push(m)}r.push(h)}if(n.strict&&n.end){const u=r.length-1;r[u][r[u].length-1]+=.7000000000000001}n.strict||(s+="/?"),n.end?s+="$":n.strict&&(s+="(?:/|$)");const o=new RegExp(s,n.sensitive?"":"i");function a(u){const h=u.match(o),f={};if(!h)return null;for(let g=1;g<h.length;g++){const m=h[g]||"",C=i[g-1];f[C.name]=m&&C.repeatable?m.split("/"):m}return f}function c(u){let h="",f=!1;for(const g of t){(!f||!h.endsWith("/"))&&(h+="/"),f=!1;for(const m of g)if(m.type===0)h+=m.value;else if(m.type===1){const{value:C,repeatable:R,optional:x}=m,L=C in u?u[C]:"";if(Mn(L)&&!R)throw new Error(`Provided param "${C}" is an array but it is not repeatable (* or + modifiers)`);const F=Mn(L)?L.join("/"):L;if(!F)if(x)g.length<2&&(h.endsWith("/")?h=h.slice(0,-1):f=!0);else throw new Error(`Missing required param "${C}"`);h+=F}}return h||"/"}return{re:o,score:r,keys:i,parse:a,stringify:c}}function xR(t,e){let n=0;for(;n<t.length&&n<e.length;){const r=e[n]-t[n];if(r)return r;n++}return t.length<e.length?t.length===1&&t[0]===80?-1:1:t.length>e.length?e.length===1&&e[0]===80?1:-1:0}function kR(t,e){let n=0;const r=t.score,s=e.score;for(;n<r.length&&n<s.length;){const i=xR(r[n],s[n]);if(i)return i;n++}if(Math.abs(s.length-r.length)===1){if(Xg(r))return 1;if(Xg(s))return-1}return s.length-r.length}function Xg(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const NR={type:0,value:""},DR=/[a-zA-Z0-9_]/;function OR(t){if(!t)return[[]];if(t==="/")return[[NR]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(m){throw new Error(`ERR (${n})/"${u}": ${m}`)}let n=0,r=n;const s=[];let i;function o(){i&&s.push(i),i=[]}let a=0,c,u="",h="";function f(){u&&(n===0?i.push({type:0,value:u}):n===1||n===2||n===3?(i.length>1&&(c==="*"||c==="+")&&e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`),i.push({type:1,value:u,regexp:h,repeatable:c==="*"||c==="+",optional:c==="*"||c==="?"})):e("Invalid state to consume buffer"),u="")}function g(){u+=c}for(;a<t.length;){if(c=t[a++],c==="\\"&&n!==2){r=n,n=4;continue}switch(n){case 0:c==="/"?(u&&f(),o()):c===":"?(f(),n=1):g();break;case 4:g(),n=r;break;case 1:c==="("?n=2:DR.test(c)?g():(f(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--);break;case 2:c===")"?h[h.length-1]=="\\"?h=h.slice(0,-1)+c:n=3:h+=c;break;case 3:f(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--,h="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${u}"`),f(),o(),s}function MR(t,e,n){const r=PR(OR(t.path),n),s=Ge(r,{record:t,parent:e,children:[],alias:[]});return e&&!s.record.aliasOf==!e.record.aliasOf&&e.children.push(s),s}function LR(t,e){const n=[],r=new Map;e=em({strict:!1,end:!0,sensitive:!1},e);function s(h){return r.get(h)}function i(h,f,g){const m=!g,C=VR(h);C.aliasOf=g&&g.record;const R=em(e,h),x=[C];if("alias"in h){const B=typeof h.alias=="string"?[h.alias]:h.alias;for(const N of B)x.push(Ge({},C,{components:g?g.record.components:C.components,path:N,aliasOf:g?g.record:C}))}let L,F;for(const B of x){const{path:N}=B;if(f&&N[0]!=="/"){const Q=f.record.path,$=Q[Q.length-1]==="/"?"":"/";B.path=f.record.path+(N&&$+N)}if(L=MR(B,f,R),g?g.alias.push(L):(F=F||L,F!==L&&F.alias.push(L),m&&h.name&&!Zg(L)&&o(h.name)),C.children){const Q=C.children;for(let $=0;$<Q.length;$++)i(Q[$],L,g&&g.children[$])}g=g||L,(L.record.components&&Object.keys(L.record.components).length||L.record.name||L.record.redirect)&&c(L)}return F?()=>{o(F)}:ko}function o(h){if(Vv(h)){const f=r.get(h);f&&(r.delete(h),n.splice(n.indexOf(f),1),f.children.forEach(o),f.alias.forEach(o))}else{const f=n.indexOf(h);f>-1&&(n.splice(f,1),h.record.name&&r.delete(h.record.name),h.children.forEach(o),h.alias.forEach(o))}}function a(){return n}function c(h){let f=0;for(;f<n.length&&kR(h,n[f])>=0&&(h.record.path!==n[f].record.path||!Uv(h,n[f]));)f++;n.splice(f,0,h),h.record.name&&!Zg(h)&&r.set(h.record.name,h)}function u(h,f){let g,m={},C,R;if("name"in h&&h.name){if(g=r.get(h.name),!g)throw Ii(1,{location:h});R=g.record.name,m=Ge(Jg(f.params,g.keys.filter(F=>!F.optional).concat(g.parent?g.parent.keys.filter(F=>F.optional):[]).map(F=>F.name)),h.params&&Jg(h.params,g.keys.map(F=>F.name))),C=g.stringify(m)}else if(h.path!=null)C=h.path,g=n.find(F=>F.re.test(C)),g&&(m=g.parse(C),R=g.record.name);else{if(g=f.name?r.get(f.name):n.find(F=>F.re.test(f.path)),!g)throw Ii(1,{location:h,currentLocation:f});R=g.record.name,m=Ge({},f.params,h.params),C=g.stringify(m)}const x=[];let L=g;for(;L;)x.unshift(L.record),L=L.parent;return{name:R,path:C,params:m,matched:x,meta:UR(x)}}return t.forEach(h=>i(h)),{addRoute:i,resolve:u,removeRoute:o,getRoutes:a,getRecordMatcher:s}}function Jg(t,e){const n={};for(const r of e)r in t&&(n[r]=t[r]);return n}function VR(t){return{path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:void 0,beforeEnter:t.beforeEnter,props:FR(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}}}function FR(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const r in t.components)e[r]=typeof n=="object"?n[r]:n;return e}function Zg(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function UR(t){return t.reduce((e,n)=>Ge(e,n.meta),{})}function em(t,e){const n={};for(const r in t)n[r]=r in e?e[r]:t[r];return n}function Uv(t,e){return e.children.some(n=>n===t||Uv(t,n))}function BR(t){const e={};if(t===""||t==="?")return e;const r=(t[0]==="?"?t.slice(1):t).split("&");for(let s=0;s<r.length;++s){const i=r[s].replace(kv," "),o=i.indexOf("="),a=Qo(o<0?i:i.slice(0,o)),c=o<0?null:Qo(i.slice(o+1));if(a in e){let u=e[a];Mn(u)||(u=e[a]=[u]),u.push(c)}else e[a]=c}return e}function tm(t){let e="";for(let n in t){const r=t[n];if(n=oR(n),r==null){r!==void 0&&(e+=(e.length?"&":"")+n);continue}(Mn(r)?r.map(i=>i&&vh(i)):[r&&vh(r)]).forEach(i=>{i!==void 0&&(e+=(e.length?"&":"")+n,i!=null&&(e+="="+i))})}return e}function $R(t){const e={};for(const n in t){const r=t[n];r!==void 0&&(e[n]=Mn(r)?r.map(s=>s==null?null:""+s):r==null?r:""+r)}return e}const jR=Symbol(""),nm=Symbol(""),Pd=Symbol(""),xd=Symbol(""),Eh=Symbol("");function uo(){let t=[];function e(r){return t.push(r),()=>{const s=t.indexOf(r);s>-1&&t.splice(s,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function Dr(t,e,n,r,s,i=o=>o()){const o=r&&(r.enterCallbacks[s]=r.enterCallbacks[s]||[]);return()=>new Promise((a,c)=>{const u=g=>{g===!1?c(Ii(4,{from:n,to:e})):g instanceof Error?c(g):AR(g)?c(Ii(2,{from:e,to:g})):(o&&r.enterCallbacks[s]===o&&typeof g=="function"&&o.push(g),a())},h=i(()=>t.call(r&&r.instances[s],e,n,u));let f=Promise.resolve(h);t.length<3&&(f=f.then(u)),f.catch(g=>c(g))})}function Mu(t,e,n,r,s=i=>i()){const i=[];for(const o of t)for(const a in o.components){let c=o.components[a];if(!(e!=="beforeRouteEnter"&&!o.instances[a]))if(qR(c)){const h=(c.__vccOpts||c)[e];h&&i.push(Dr(h,n,r,o,a,s))}else{let u=c();i.push(()=>u.then(h=>{if(!h)return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${o.path}"`));const f=YS(h)?h.default:h;o.components[a]=f;const m=(f.__vccOpts||f)[e];return m&&Dr(m,n,r,o,a,s)()}))}}return i}function qR(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function rm(t){const e=kn(Pd),n=kn(xd),r=Be(()=>{const c=qe(t.to);return e.resolve(c)}),s=Be(()=>{const{matched:c}=r.value,{length:u}=c,h=c[u-1],f=n.matched;if(!h||!f.length)return-1;const g=f.findIndex(bi.bind(null,h));if(g>-1)return g;const m=sm(c[u-2]);return u>1&&sm(h)===m&&f[f.length-1].path!==m?f.findIndex(bi.bind(null,c[u-2])):g}),i=Be(()=>s.value>-1&&GR(n.params,r.value.params)),o=Be(()=>s.value>-1&&s.value===n.matched.length-1&&Mv(n.params,r.value.params));function a(c={}){return zR(c)?e[qe(t.replace)?"replace":"push"](qe(t.to)).catch(ko):Promise.resolve()}return{route:r,href:Be(()=>r.value.href),isActive:i,isExactActive:o,navigate:a}}const HR=Ln({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:rm,setup(t,{slots:e}){const n=Li(rm(t)),{options:r}=kn(Pd),s=Be(()=>({[im(t.activeClass,r.linkActiveClass,"router-link-active")]:n.isActive,[im(t.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const i=e.default&&e.default(n);return t.custom?i:di("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},i)}}}),WR=HR;function zR(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function GR(t,e){for(const n in e){const r=e[n],s=t[n];if(typeof r=="string"){if(r!==s)return!1}else if(!Mn(s)||s.length!==r.length||r.some((i,o)=>i!==s[o]))return!1}return!0}function sm(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const im=(t,e,n)=>t??e??n,KR=Ln({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const r=kn(Eh),s=Be(()=>t.route||r.value),i=kn(nm,0),o=Be(()=>{let u=qe(i);const{matched:h}=s.value;let f;for(;(f=h[u])&&!f.components;)u++;return u}),a=Be(()=>s.value.matched[o.value]);Po(nm,Be(()=>o.value+1)),Po(jR,a),Po(Eh,s);const c=he();return _n(()=>[c.value,a.value,t.name],([u,h,f],[g,m,C])=>{h&&(h.instances[f]=u,m&&m!==h&&u&&u===g&&(h.leaveGuards.size||(h.leaveGuards=m.leaveGuards),h.updateGuards.size||(h.updateGuards=m.updateGuards))),u&&h&&(!m||!bi(h,m)||!g)&&(h.enterCallbacks[f]||[]).forEach(R=>R(u))},{flush:"post"}),()=>{const u=s.value,h=t.name,f=a.value,g=f&&f.components[h];if(!g)return om(n.default,{Component:g,route:u});const m=f.props[h],C=m?m===!0?u.params:typeof m=="function"?m(u):m:null,x=di(g,Ge({},C,e,{onVnodeUnmounted:L=>{L.component.isUnmounted&&(f.instances[h]=null)},ref:c}));return om(n.default,{Component:x,route:u})||x}}});function om(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const YR=KR;function QR(t){const e=LR(t.routes,t),n=t.parseQuery||BR,r=t.stringifyQuery||tm,s=t.history,i=uo(),o=uo(),a=uo(),c=tT(Sr);let u=Sr;ni&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const h=Du.bind(null,O=>""+O),f=Du.bind(null,lR),g=Du.bind(null,Qo);function m(O,z){let G,te;return Vv(O)?(G=e.getRecordMatcher(O),te=z):te=O,e.addRoute(te,G)}function C(O){const z=e.getRecordMatcher(O);z&&e.removeRoute(z)}function R(){return e.getRoutes().map(O=>O.record)}function x(O){return!!e.getRecordMatcher(O)}function L(O,z){if(z=Ge({},z||c.value),typeof O=="string"){const I=Ou(n,O,z.path),k=e.resolve({path:I.path},z),V=s.createHref(I.fullPath);return Ge(I,k,{params:g(k.params),hash:Qo(I.hash),redirectedFrom:void 0,href:V})}let G;if(O.path!=null)G=Ge({},O,{path:Ou(n,O.path,z.path).path});else{const I=Ge({},O.params);for(const k in I)I[k]==null&&delete I[k];G=Ge({},O,{params:f(I)}),z.params=f(z.params)}const te=e.resolve(G,z),Ae=O.hash||"";te.params=h(g(te.params));const ze=hR(r,Ge({},O,{hash:iR(Ae),path:te.path})),w=s.createHref(ze);return Ge({fullPath:ze,hash:Ae,query:r===tm?$R(O.query):O.query||{}},te,{redirectedFrom:void 0,href:w})}function F(O){return typeof O=="string"?Ou(n,O,c.value.path):Ge({},O)}function B(O,z){if(u!==O)return Ii(8,{from:z,to:O})}function N(O){return A(O)}function Q(O){return N(Ge(F(O),{replace:!0}))}function $(O){const z=O.matched[O.matched.length-1];if(z&&z.redirect){const{redirect:G}=z;let te=typeof G=="function"?G(O):G;return typeof te=="string"&&(te=te.includes("?")||te.includes("#")?te=F(te):{path:te},te.params={}),Ge({query:O.query,hash:O.hash,params:te.path!=null?{}:O.params},te)}}function A(O,z){const G=u=L(O),te=c.value,Ae=O.state,ze=O.force,w=O.replace===!0,I=$(G);if(I)return A(Ge(F(I),{state:typeof I=="object"?Ge({},Ae,I.state):Ae,force:ze,replace:w}),z||G);const k=G;k.redirectedFrom=z;let V;return!ze&&dR(r,te,G)&&(V=Ii(16,{to:k,from:te}),mt(te,te,!0,!1)),(V?Promise.resolve(V):T(k,te)).catch(M=>tr(M)?tr(M,2)?M:Tt(M):_e(M,k,te)).then(M=>{if(M){if(tr(M,2))return A(Ge({replace:w},F(M.to),{state:typeof M.to=="object"?Ge({},Ae,M.to.state):Ae,force:ze}),z||k)}else M=b(k,te,!0,w,Ae);return S(k,te,M),M})}function y(O,z){const G=B(O,z);return G?Promise.reject(G):Promise.resolve()}function v(O){const z=U.values().next().value;return z&&typeof z.runWithContext=="function"?z.runWithContext(O):O()}function T(O,z){let G;const[te,Ae,ze]=XR(O,z);G=Mu(te.reverse(),"beforeRouteLeave",O,z);for(const I of te)I.leaveGuards.forEach(k=>{G.push(Dr(k,O,z))});const w=y.bind(null,O,z);return G.push(w),Se(G).then(()=>{G=[];for(const I of i.list())G.push(Dr(I,O,z));return G.push(w),Se(G)}).then(()=>{G=Mu(Ae,"beforeRouteUpdate",O,z);for(const I of Ae)I.updateGuards.forEach(k=>{G.push(Dr(k,O,z))});return G.push(w),Se(G)}).then(()=>{G=[];for(const I of ze)if(I.beforeEnter)if(Mn(I.beforeEnter))for(const k of I.beforeEnter)G.push(Dr(k,O,z));else G.push(Dr(I.beforeEnter,O,z));return G.push(w),Se(G)}).then(()=>(O.matched.forEach(I=>I.enterCallbacks={}),G=Mu(ze,"beforeRouteEnter",O,z,v),G.push(w),Se(G))).then(()=>{G=[];for(const I of o.list())G.push(Dr(I,O,z));return G.push(w),Se(G)}).catch(I=>tr(I,8)?I:Promise.reject(I))}function S(O,z,G){a.list().forEach(te=>v(()=>te(O,z,G)))}function b(O,z,G,te,Ae){const ze=B(O,z);if(ze)return ze;const w=z===Sr,I=ni?history.state:{};G&&(te||w?s.replace(O.fullPath,Ge({scroll:w&&I&&I.scroll},Ae)):s.push(O.fullPath,Ae)),c.value=O,mt(O,z,G,w),Tt()}let E;function De(){E||(E=s.listen((O,z,G)=>{if(!Ce.listening)return;const te=L(O),Ae=$(te);if(Ae){A(Ge(Ae,{replace:!0}),te).catch(ko);return}u=te;const ze=c.value;ni&&wR(Gg(ze.fullPath,G.delta),Dc()),T(te,ze).catch(w=>tr(w,12)?w:tr(w,2)?(A(w.to,te).then(I=>{tr(I,20)&&!G.delta&&G.type===Xo.pop&&s.go(-1,!1)}).catch(ko),Promise.reject()):(G.delta&&s.go(-G.delta,!1),_e(w,te,ze))).then(w=>{w=w||b(te,ze,!1),w&&(G.delta&&!tr(w,8)?s.go(-G.delta,!1):G.type===Xo.pop&&tr(w,20)&&s.go(-1,!1)),S(te,ze,w)}).catch(ko)}))}let ot=uo(),Me=uo(),Ie;function _e(O,z,G){Tt(O);const te=Me.list();return te.length?te.forEach(Ae=>Ae(O,z,G)):console.error(O),Promise.reject(O)}function He(){return Ie&&c.value!==Sr?Promise.resolve():new Promise((O,z)=>{ot.add([O,z])})}function Tt(O){return Ie||(Ie=!O,De(),ot.list().forEach(([z,G])=>O?G(O):z()),ot.reset()),O}function mt(O,z,G,te){const{scrollBehavior:Ae}=t;if(!ni||!Ae)return Promise.resolve();const ze=!G&&ER(Gg(O.fullPath,0))||(te||!G)&&history.state&&history.state.scroll||null;return wc().then(()=>Ae(O,z,ze)).then(w=>w&&vR(w)).catch(w=>_e(w,O,z))}const We=O=>s.go(O);let et;const U=new Set,Ce={currentRoute:c,listening:!0,addRoute:m,removeRoute:C,hasRoute:x,getRoutes:R,resolve:L,options:t,push:N,replace:Q,go:We,back:()=>We(-1),forward:()=>We(1),beforeEach:i.add,beforeResolve:o.add,afterEach:a.add,onError:Me.add,isReady:He,install(O){const z=this;O.component("RouterLink",WR),O.component("RouterView",YR),O.config.globalProperties.$router=z,Object.defineProperty(O.config.globalProperties,"$route",{enumerable:!0,get:()=>qe(c)}),ni&&!et&&c.value===Sr&&(et=!0,N(s.location).catch(Ae=>{}));const G={};for(const Ae in Sr)Object.defineProperty(G,Ae,{get:()=>c.value[Ae],enumerable:!0});O.provide(Pd,z),O.provide(xd,Dy(G)),O.provide(Eh,c);const te=O.unmount;U.add(O),O.unmount=function(){U.delete(O),U.size<1&&(u=Sr,E&&E(),E=null,c.value=Sr,et=!1,Ie=!1),te()}}};function Se(O){return O.reduce((z,G)=>z.then(()=>v(G)),Promise.resolve())}return Ce}function XR(t,e){const n=[],r=[],s=[],i=Math.max(e.matched.length,t.matched.length);for(let o=0;o<i;o++){const a=e.matched[o];a&&(t.matched.find(u=>bi(u,a))?r.push(a):n.push(a));const c=t.matched[o];c&&(e.matched.find(u=>bi(u,c))||s.push(c))}return[n,r,s]}function JR(){return kn(xd)}const ZR="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='37.07'%20height='36'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20198'%3e%3cpath%20fill='%2341B883'%20d='M204.8%200H256L128%20220.8L0%200h97.92L128%2051.2L157.44%200h47.36Z'%3e%3c/path%3e%3cpath%20fill='%2341B883'%20d='m0%200l128%20220.8L256%200h-51.2L128%20132.48L50.56%200H0Z'%3e%3c/path%3e%3cpath%20fill='%2335495E'%20d='M50.56%200L128%20133.12L204.8%200h-47.36L128%2051.2L97.92%200H50.56Z'%3e%3c/path%3e%3c/svg%3e",Xn=(t,e)=>{const n=t.__vccOpts||t;for(const[r,s]of e)n[r]=s;return n},e1={components:{Button:Sd,Avatar:UA,AvatarFallback:$A,AvatarImage:BA,UserCircleIcon:WA},setup(){const t=JR(),e=Be(()=>t.meta&&t.meta.title||"Default Title");return On(()=>{$n.success(`Welcome to ${e.value}`)}),_n(()=>t.path,n=>{$n.success(`Transitioned to ${e.value}`)}),{currentPageTitle:e}}},t1={class:"fixed top-0 left-0 right-0 z-50 backdrop-blur-lg text-black shadow-2xl py-3 px-4 h-[--header-height]"},n1={class:"flex justify-between"},r1={class:"flex justify-between items-center"},s1={class:"text-3xl font-bold absolute ml-20 text-[--text-50] drop-shadow-[0_5px_30px_rgba(255,255,255,0.35)]"},i1={class:"flex text-md items-center font-bold text-[--text-50]"};function o1(t,e,n,r,s,i){const o=Nt("Button"),a=Nt("router-link"),c=Nt("UserCircleIcon"),u=Nt("AvatarFallback"),h=Nt("Avatar");return se(),ye("header",t1,[Z("nav",null,[Z("div",n1,[Z("div",r1,[Z("img",{src:ZR,alt:"Logo image",class:"h-16 w-16 justify-center items-center object-cover cursor-pointer",onClick:e[0]||(e[0]=f=>t.$router.push("/"))}),Z("span",s1,Vr(r.currentPageTitle),1)]),Z("ul",i1,[Z("li",null,[re(a,{to:"/home"},{default:pe(()=>[re(o,{variant:"link"},{default:pe(()=>[Qe("Home")]),_:1})]),_:1})]),Z("li",null,[re(a,{to:"/about"},{default:pe(()=>[re(o,{variant:"link"},{default:pe(()=>[Qe("About")]),_:1})]),_:1})]),Z("li",null,[re(a,{to:"/contact"},{default:pe(()=>[re(o,{variant:"link"},{default:pe(()=>[Qe("Contact")]),_:1})]),_:1})]),Z("li",null,[re(a,{to:"/websites"},{default:pe(()=>[re(o,{variant:"link",class:"mr-4"},{default:pe(()=>[Qe("Websites")]),_:1})]),_:1})]),Z("li",null,[re(a,{to:"/login"},{default:pe(()=>[re(h,null,{default:pe(()=>[Cn(' <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" /> '),re(u,null,{default:pe(()=>[re(c,{class:"h-6 w-6"})]),_:1})]),_:1})]),_:1})])])])])])}const a1=Xn(e1,[["render",o1]]);var am={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bv={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y=function(t,e){if(!t)throw Fi(e)},Fi=function(t){return new Error("Firebase Database ("+Bv.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $v=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},l1=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],a=t[n++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},kd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,a=o?t[s+1]:0,c=s+2<t.length,u=c?t[s+2]:0,h=i>>2,f=(i&3)<<4|a>>4;let g=(a&15)<<2|u>>6,m=u&63;c||(m=64,o||(g=64)),r.push(n[h],n[f],n[g],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray($v(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):l1(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const u=s<t.length?n[t.charAt(s)]:64;++s;const f=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||a==null||u==null||f==null)throw new c1;const g=i<<2|a>>4;if(r.push(g),u!==64){const m=a<<4&240|u>>2;if(r.push(m),f!==64){const C=u<<6&192|f;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class c1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const jv=function(t){const e=$v(t);return kd.encodeByteArray(e,!0)},Ll=function(t){return jv(t).replace(/\./g,"")},Vl=function(t){try{return kd.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u1(t){return qv(void 0,t)}function qv(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!h1(n)||(t[n]=qv(t[n],e[n]));return t}function h1(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f1=()=>d1().__FIREBASE_DEFAULTS__,p1=()=>{if(typeof process>"u"||typeof am>"u")return;const t=am.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},g1=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Vl(t[1]);return e&&JSON.parse(e)},Oc=()=>{try{return f1()||p1()||g1()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Hv=t=>{var e,n;return(n=(e=Oc())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Nd=t=>{const e=Hv(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Wv=()=>{var t;return(t=Oc())===null||t===void 0?void 0:t.config},zv=t=>{var e;return(e=Oc())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gv(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Ll(JSON.stringify(n)),Ll(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Dd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Lt())}function m1(){var t;const e=(t=Oc())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Kv(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Yv(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function _1(){const t=Lt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Qv(){return Bv.NODE_ADMIN===!0}function y1(){return!m1()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Xv(){try{return typeof indexedDB=="object"}catch{return!1}}function Jv(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}function v1(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w1="FirebaseError";class En extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=w1,Object.setPrototypeOf(this,En.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Bs.prototype.create)}}class Bs{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?E1(i,r):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new En(s,a,r)}}function E1(t,e){return t.replace(b1,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const b1=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(t){return JSON.parse(t)}function Rt(t){return JSON.stringify(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zv=function(t){let e={},n={},r={},s="";try{const i=t.split(".");e=Jo(Vl(i[0])||""),n=Jo(Vl(i[1])||""),s=i[2],r=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:r,signature:s}},I1=function(t){const e=Zv(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},T1=function(t){const e=Zv(t).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Ss(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function bh(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Fl(t,e,n){const r={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(r[s]=e.call(n,t[s],s,t));return r}function Zo(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if(lm(i)&&lm(o)){if(!Zo(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function lm(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ui(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function yo(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function vo(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C1{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const r=this.W_;if(typeof e=="string")for(let f=0;f<16;f++)r[f]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let f=0;f<16;f++)r[f]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let f=16;f<80;f++){const g=r[f-3]^r[f-8]^r[f-14]^r[f-16];r[f]=(g<<1|g>>>31)&4294967295}let s=this.chain_[0],i=this.chain_[1],o=this.chain_[2],a=this.chain_[3],c=this.chain_[4],u,h;for(let f=0;f<80;f++){f<40?f<20?(u=a^i&(o^a),h=1518500249):(u=i^o^a,h=1859775393):f<60?(u=i&o|a&(i|o),h=2400959708):(u=i^o^a,h=3395469782);const g=(s<<5|s>>>27)+u+c+h+r[f]&4294967295;c=a,a=o,o=(i<<30|i>>>2)&4294967295,i=s,s=g}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+i&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const r=n-this.blockSize;let s=0;const i=this.buf_;let o=this.inbuf_;for(;s<n;){if(o===0)for(;s<=r;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<n;)if(i[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(i),o=0;break}}else for(;s<n;)if(i[o]=e[s],++o,++s,o===this.blockSize){this.compress_(i),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=n&255,n/=256;this.compress_(this.buf_);let r=0;for(let s=0;s<5;s++)for(let i=24;i>=0;i-=8)e[r]=this.chain_[s]>>i&255,++r;return e}}function A1(t,e){const n=new S1(t,e);return n.subscribe.bind(n)}class S1{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");R1(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=Lu),s.error===void 0&&(s.error=Lu),s.complete===void 0&&(s.complete=Lu);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function R1(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Lu(){}function ew(t,e){return`${t} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P1=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);if(s>=55296&&s<=56319){const i=s-55296;r++,Y(r<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(r)-56320;s=65536+(i<<10)+o}s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):s<65536?(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Lc=function(t){let e=0;for(let n=0;n<t.length;n++){const r=t.charCodeAt(n);r<128?e++:r<2048?e+=2:r>=55296&&r<=56319?(e+=4,n++):e+=3}return e};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x1=1e3,k1=2,N1=4*60*60*1e3,D1=.5;function cm(t,e=x1,n=k1){const r=e*Math.pow(n,t),s=Math.round(D1*r*(Math.random()-.5)*2);return Math.min(N1,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(t){return t&&t._delegate?t._delegate:t}class un{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O1{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Mc;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(L1(e))try{this.getOrInitializeService({instanceIdentifier:fs})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=fs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=fs){return this.instances.has(e)}getOptions(e=fs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);r===a&&o.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:M1(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=fs){return this.component?this.component.multipleInstances?e:fs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function M1(t){return t===fs?void 0:t}function L1(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V1{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new O1(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tw=[];var ke;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ke||(ke={}));const F1={debug:ke.DEBUG,verbose:ke.VERBOSE,info:ke.INFO,warn:ke.WARN,error:ke.ERROR,silent:ke.SILENT},U1=ke.INFO,B1={[ke.DEBUG]:"log",[ke.VERBOSE]:"log",[ke.INFO]:"info",[ke.WARN]:"warn",[ke.ERROR]:"error"},$1=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=B1[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ea{constructor(e){this.name=e,this._logLevel=U1,this._logHandler=$1,this._userLogHandler=null,tw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ke))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?F1[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ke.DEBUG,...e),this._logHandler(this,ke.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ke.VERBOSE,...e),this._logHandler(this,ke.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ke.INFO,...e),this._logHandler(this,ke.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ke.WARN,...e),this._logHandler(this,ke.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ke.ERROR,...e),this._logHandler(this,ke.ERROR,...e)}}function j1(t){tw.forEach(e=>{e.setLogLevel(t)})}const q1=(t,e)=>e.some(n=>t instanceof n);let um,hm;function H1(){return um||(um=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function W1(){return hm||(hm=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const nw=new WeakMap,Ih=new WeakMap,rw=new WeakMap,Vu=new WeakMap,Od=new WeakMap;function z1(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(jr(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&nw.set(n,t)}).catch(()=>{}),Od.set(e,t),e}function G1(t){if(Ih.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Ih.set(t,e)}let Th={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ih.get(t);if(e==="objectStoreNames")return t.objectStoreNames||rw.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return jr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function K1(t){Th=t(Th)}function Y1(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Fu(this),e,...n);return rw.set(r,e.sort?e.sort():[e]),jr(r)}:W1().includes(t)?function(...e){return t.apply(Fu(this),e),jr(nw.get(this))}:function(...e){return jr(t.apply(Fu(this),e))}}function Q1(t){return typeof t=="function"?Y1(t):(t instanceof IDBTransaction&&G1(t),q1(t,H1())?new Proxy(t,Th):t)}function jr(t){if(t instanceof IDBRequest)return z1(t);if(Vu.has(t))return Vu.get(t);const e=Q1(t);return e!==t&&(Vu.set(t,e),Od.set(e,t)),e}const Fu=t=>Od.get(t);function sw(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),a=jr(o);return r&&o.addEventListener("upgradeneeded",c=>{r(jr(o.result),c.oldVersion,c.newVersion,jr(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",u=>s(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}const X1=["get","getKey","getAll","getAllKeys","count"],J1=["put","add","delete","clear"],Uu=new Map;function dm(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Uu.get(e))return Uu.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=J1.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||X1.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,s?"readwrite":"readonly");let u=c.store;return r&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),s&&c.done]))[0]};return Uu.set(e,i),i}K1(t=>({...t,get:(e,n,r)=>dm(e,n)||t.get(e,n,r),has:(e,n)=>!!dm(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z1{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(eP(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function eP(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ch="@firebase/app",fm="0.10.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rs=new Ea("@firebase/app"),tP="@firebase/app-compat",nP="@firebase/analytics-compat",rP="@firebase/analytics",sP="@firebase/app-check-compat",iP="@firebase/app-check",oP="@firebase/auth",aP="@firebase/auth-compat",lP="@firebase/database",cP="@firebase/database-compat",uP="@firebase/functions",hP="@firebase/functions-compat",dP="@firebase/installations",fP="@firebase/installations-compat",pP="@firebase/messaging",gP="@firebase/messaging-compat",mP="@firebase/performance",_P="@firebase/performance-compat",yP="@firebase/remote-config",vP="@firebase/remote-config-compat",wP="@firebase/storage",EP="@firebase/storage-compat",bP="@firebase/firestore",IP="@firebase/vertexai-preview",TP="@firebase/firestore-compat",CP="firebase",AP="10.12.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah="[DEFAULT]",SP={[Ch]:"fire-core",[tP]:"fire-core-compat",[rP]:"fire-analytics",[nP]:"fire-analytics-compat",[iP]:"fire-app-check",[sP]:"fire-app-check-compat",[oP]:"fire-auth",[aP]:"fire-auth-compat",[lP]:"fire-rtdb",[cP]:"fire-rtdb-compat",[uP]:"fire-fn",[hP]:"fire-fn-compat",[dP]:"fire-iid",[fP]:"fire-iid-compat",[pP]:"fire-fcm",[gP]:"fire-fcm-compat",[mP]:"fire-perf",[_P]:"fire-perf-compat",[yP]:"fire-rc",[vP]:"fire-rc-compat",[wP]:"fire-gcs",[EP]:"fire-gcs-compat",[bP]:"fire-fst",[TP]:"fire-fst-compat",[IP]:"fire-vertex","fire-js":"fire-js",[CP]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul=new Map,RP=new Map,Sh=new Map;function pm(t,e){try{t.container.addComponent(e)}catch(n){Rs.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function vn(t){const e=t.name;if(Sh.has(e))return Rs.debug(`There were multiple attempts to register component ${e}.`),!1;Sh.set(e,t);for(const n of Ul.values())pm(n,t);for(const n of RP.values())pm(n,t);return!0}function mr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function jn(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PP={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},qr=new Bs("app","Firebase",PP);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xP{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new un("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw qr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $s=AP;function iw(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Ah,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw qr.create("bad-app-name",{appName:String(s)});if(n||(n=Wv()),!n)throw qr.create("no-options");const i=Ul.get(s);if(i){if(Zo(n,i.options)&&Zo(r,i.config))return i;throw qr.create("duplicate-app",{appName:s})}const o=new V1(s);for(const c of Sh.values())o.addComponent(c);const a=new xP(n,r,o);return Ul.set(s,a),a}function ba(t=Ah){const e=Ul.get(t);if(!e&&t===Ah&&Wv())return iw();if(!e)throw qr.create("no-app",{appName:t});return e}function Wt(t,e,n){var r;let s=(r=SP[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const a=[`Unable to register library "${s}" with version "${e}":`];i&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Rs.warn(a.join(" "));return}vn(new un(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}function kP(t){j1(t)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NP="firebase-heartbeat-database",DP=1,ea="firebase-heartbeat-store";let Bu=null;function ow(){return Bu||(Bu=sw(NP,DP,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ea)}catch(n){console.warn(n)}}}}).catch(t=>{throw qr.create("idb-open",{originalErrorMessage:t.message})})),Bu}async function OP(t){try{const n=(await ow()).transaction(ea),r=await n.objectStore(ea).get(aw(t));return await n.done,r}catch(e){if(e instanceof En)Rs.warn(e.message);else{const n=qr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Rs.warn(n.message)}}}async function gm(t,e){try{const r=(await ow()).transaction(ea,"readwrite");await r.objectStore(ea).put(e,aw(t)),await r.done}catch(n){if(n instanceof En)Rs.warn(n.message);else{const r=qr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Rs.warn(r.message)}}}function aw(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MP=1024,LP=30*24*60*60*1e3;class VP{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new UP(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=mm();if(!(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)))return this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=LP}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=mm(),{heartbeatsToSend:r,unsentEntries:s}=FP(this._heartbeatsCache.heartbeats),i=Ll(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function mm(){return new Date().toISOString().substring(0,10)}function FP(t,e=MP){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),_m(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),_m(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class UP{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Xv()?Jv().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await OP(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return gm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return gm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function _m(t){return Ll(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BP(t){vn(new un("platform-logger",e=>new Z1(e),"PRIVATE")),vn(new un("heartbeat",e=>new VP(e),"PRIVATE")),Wt(Ch,fm,t),Wt(Ch,fm,"esm2017"),Wt("fire-js","")}BP("");var ym={};const vm="@firebase/database",wm="1.0.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lw="";function $P(t){lw=t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jP{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Rt(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:Jo(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qP{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return Vn(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cw=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new jP(e)}}catch{}return new qP},vs=cw("localStorage"),HP=cw("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fi=new Ea("@firebase/database"),uw=function(){let t=1;return function(){return t++}}(),hw=function(t){const e=P1(t),n=new C1;n.update(e);const r=n.digest();return kd.encodeByteArray(r)},Ia=function(...t){let e="";for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)||r&&typeof r=="object"&&typeof r.length=="number"?e+=Ia.apply(null,r):typeof r=="object"?e+=Rt(r):e+=r,e+=" "}return e};let Do=null,Em=!0;const WP=function(t,e){Y(!e,"Can't turn on custom loggers persistently."),fi.logLevel=ke.VERBOSE,Do=fi.log.bind(fi)},jt=function(...t){if(Em===!0&&(Em=!1,Do===null&&HP.get("logging_enabled")===!0&&WP()),Do){const e=Ia.apply(null,t);Do(e)}},Ta=function(t){return function(...e){jt(t,...e)}},Rh=function(...t){const e="FIREBASE INTERNAL ERROR: "+Ia(...t);fi.error(e)},hr=function(...t){const e=`FIREBASE FATAL ERROR: ${Ia(...t)}`;throw fi.error(e),new Error(e)},ln=function(...t){const e="FIREBASE WARNING: "+Ia(...t);fi.warn(e)},zP=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&ln("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Md=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},GP=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},Ti="[MIN_NAME]",Ps="[MAX_NAME]",Bi=function(t,e){if(t===e)return 0;if(t===Ti||e===Ps)return-1;if(e===Ti||t===Ps)return 1;{const n=bm(t),r=bm(e);return n!==null?r!==null?n-r===0?t.length-e.length:n-r:-1:r!==null?1:t<e?-1:1}},KP=function(t,e){return t===e?0:t<e?-1:1},ho=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+Rt(e))},Ld=function(t){if(typeof t!="object"||t===null)return Rt(t);const e=[];for(const r in t)e.push(r);e.sort();let n="{";for(let r=0;r<e.length;r++)r!==0&&(n+=","),n+=Rt(e[r]),n+=":",n+=Ld(t[e[r]]);return n+="}",n},dw=function(t,e){const n=t.length;if(n<=e)return[t];const r=[];for(let s=0;s<n;s+=e)s+e>n?r.push(t.substring(s,n)):r.push(t.substring(s,s+e));return r};function rn(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const fw=function(t){Y(!Md(t),"Invalid JSON number");const e=11,n=52,r=(1<<e-1)-1;let s,i,o,a,c;t===0?(i=0,o=0,s=1/t===-1/0?1:0):(s=t<0,t=Math.abs(t),t>=Math.pow(2,1-r)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),r),i=a+r,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(i=0,o=Math.round(t/Math.pow(2,1-r-n))));const u=[];for(c=n;c;c-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)u.push(i%2?1:0),i=Math.floor(i/2);u.push(s?1:0),u.reverse();const h=u.join("");let f="";for(c=0;c<64;c+=8){let g=parseInt(h.substr(c,8),2).toString(16);g.length===1&&(g="0"+g),f=f+g}return f.toLowerCase()},YP=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},QP=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function XP(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const r=new Error(t+" at "+e._path.toString()+": "+n);return r.code=t.toUpperCase(),r}const JP=new RegExp("^-?(0*)\\d{1,10}$"),ZP=-2147483648,ex=2147483647,bm=function(t){if(JP.test(t)){const e=Number(t);if(e>=ZP&&e<=ex)return e}return null},Ca=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw ln("Exception was thrown by user callback.",n),e},Math.floor(0))}},tx=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Oo=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nx{constructor(e,n){this.appName_=e,this.appCheckProvider=n,this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(r=>this.appCheck=r)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((n,r)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(r=>r.addTokenListener(e))}notifyForInvalidToken(){ln(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rx{constructor(e,n,r){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=r,this.auth_=null,this.auth_=r.getImmediate({optional:!0}),this.auth_||r.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(jt("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,r)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',ln(e)}}class vl{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}vl.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="5",pw="v",gw="s",mw="r",_w="f",yw=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,vw="ls",ww="p",Ph="ac",Ew="websocket",bw="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(e,n,r,s,i=!1,o="",a=!1,c=!1){this.secure=n,this.namespace=r,this.webSocketOnly=s,this.nodeAdmin=i,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=vs.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&vs.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function sx(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function Tw(t,e,n){Y(typeof e=="string","typeof type must == string"),Y(typeof n=="object","typeof params must == object");let r;if(e===Ew)r=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===bw)r=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);sx(t)&&(n.ns=t.namespace);const s=[];return rn(n,(i,o)=>{s.push(i+"="+o)}),r+s.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ix{constructor(){this.counters_={}}incrementCounter(e,n=1){Vn(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return u1(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $u={},ju={};function Fd(t){const e=t.toString();return $u[e]||($u[e]=new ix),$u[e]}function ox(t,e){const n=t.toString();return ju[n]||(ju[n]=e()),ju[n]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ax{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const r=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<r.length;++s)r[s]&&Ca(()=>{this.onMessage_(r[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im="start",lx="close",cx="pLPCommand",ux="pRTLPCB",Cw="id",Aw="pw",Sw="ser",hx="cb",dx="seg",fx="ts",px="d",gx="dframe",Rw=1870,Pw=30,mx=Rw-Pw,_x=25e3,yx=3e4;class ai{constructor(e,n,r,s,i,o,a){this.connId=e,this.repoInfo=n,this.applicationId=r,this.appCheckToken=s,this.authToken=i,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Ta(e),this.stats_=Fd(n),this.urlFn=c=>(this.appCheckToken&&(c[Ph]=this.appCheckToken),Tw(n,bw,c))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new ax(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(yx)),GP(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Ud((...i)=>{const[o,a,c,u,h]=i;if(this.incrementIncomingBytes_(i),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===Im)this.id=a,this.password=c;else if(o===lx)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...i)=>{const[o,a]=i;this.incrementIncomingBytes_(i),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const r={};r[Im]="t",r[Sw]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(r[hx]=this.scriptTagHolder.uniqueCallbackIdentifier),r[pw]=Vd,this.transportSessionId&&(r[gw]=this.transportSessionId),this.lastSessionId&&(r[vw]=this.lastSessionId),this.applicationId&&(r[ww]=this.applicationId),this.appCheckToken&&(r[Ph]=this.appCheckToken),typeof location<"u"&&location.hostname&&yw.test(location.hostname)&&(r[mw]=_w);const s=this.urlFn(r);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){ai.forceAllow_=!0}static forceDisallow(){ai.forceDisallow_=!0}static isAvailable(){return ai.forceAllow_?!0:!ai.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!YP()&&!QP()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=Rt(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=jv(n),s=dw(r,mx);for(let i=0;i<s.length;i++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[i]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const r={};r[gx]="t",r[Cw]=e,r[Aw]=n,this.myDisconnFrame.src=this.urlFn(r),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=Rt(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class Ud{constructor(e,n,r,s){this.onDisconnect=r,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=uw(),window[cx+this.uniqueCallbackIdentifier]=e,window[ux+this.uniqueCallbackIdentifier]=n,this.myIFrame=Ud.createIFrame_();let i="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(i='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+i+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){jt("frame writing exception"),a.stack&&jt(a.stack),jt(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||jt("No IE domain setting required")}catch{const r=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+r+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Cw]=this.myID,e[Aw]=this.myPW,e[Sw]=this.currentSerial;let n=this.urlFn(e),r="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Pw+r.length<=Rw;){const o=this.pendingSegs.shift();r=r+"&"+dx+s+"="+o.seg+"&"+fx+s+"="+o.ts+"&"+px+s+"="+o.d,s++}return n=n+r,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,r){this.pendingSegs.push({seg:e,ts:n,d:r}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const r=()=>{this.outstandingRequests.delete(n),this.newRequest_()},s=setTimeout(r,Math.floor(_x)),i=()=>{clearTimeout(s),r()};this.addTag(e,i)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const r=this.myIFrame.doc.createElement("script");r.type="text/javascript",r.async=!0,r.src=e,r.onload=r.onreadystatechange=function(){const s=r.readyState;(!s||s==="loaded"||s==="complete")&&(r.onload=r.onreadystatechange=null,r.parentNode&&r.parentNode.removeChild(r),n())},r.onerror=()=>{jt("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(r)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vx=16384,wx=45e3;let Bl=null;typeof MozWebSocket<"u"?Bl=MozWebSocket:typeof WebSocket<"u"&&(Bl=WebSocket);class An{constructor(e,n,r,s,i,o,a){this.connId=e,this.applicationId=r,this.appCheckToken=s,this.authToken=i,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Ta(this.connId),this.stats_=Fd(n),this.connURL=An.connectionURL_(n,o,a,s,r),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,r,s,i){const o={};return o[pw]=Vd,typeof location<"u"&&location.hostname&&yw.test(location.hostname)&&(o[mw]=_w),n&&(o[gw]=n),r&&(o[vw]=r),s&&(o[Ph]=s),i&&(o[ww]=i),Tw(e,Ew,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,vs.set("previous_websocket_failure",!0);try{let r;Qv(),this.mySock=new Bl(this.connURL,[],r)}catch(r){this.log_("Error instantiating WebSocket.");const s=r.message||r.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=r=>{this.handleIncomingFrame(r)},this.mySock.onerror=r=>{this.log_("WebSocket error.  Closing connection.");const s=r.message||r.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){An.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,r=navigator.userAgent.match(n);r&&r.length>1&&parseFloat(r[1])<4.4&&(e=!0)}return!e&&Bl!==null&&!An.forceDisallow_}static previouslyFailed(){return vs.isInMemoryStorage||vs.get("previous_websocket_failure")===!0}markConnectionHealthy(){vs.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const r=Jo(n);this.onMessage(r)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(Y(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const r=this.extractFrameCount_(n);r!==null&&this.appendFrame_(r)}}send(e){this.resetKeepAlive();const n=Rt(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=dw(n,vx);r.length>1&&this.sendString_(String(r.length));for(let s=0;s<r.length;s++)this.sendString_(r[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(wx))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}An.responsesRequiredToBeHealthy=2;An.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[ai,An]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const n=An&&An.isAvailable();let r=n&&!An.previouslyFailed();if(e.webSocketOnly&&(n||ln("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),r=!0),r)this.transports_=[An];else{const s=this.transports_=[];for(const i of ta.ALL_TRANSPORTS)i&&i.isAvailable()&&s.push(i);ta.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}ta.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ex=6e4,bx=5e3,Ix=10*1024,Tx=100*1024,qu="t",Tm="d",Cx="s",Cm="r",Ax="e",Am="o",Sm="a",Rm="n",Pm="p",Sx="h";class Rx{constructor(e,n,r,s,i,o,a,c,u,h){this.id=e,this.repoInfo_=n,this.applicationId_=r,this.appCheckToken_=s,this.authToken_=i,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=c,this.onKill_=u,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Ta("c:"+this.id+":"),this.transportManager_=new ta(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),r=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,r)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=Oo(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Tx?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Ix?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(qu in e){const n=e[qu];n===Sm?this.upgradeIfSecondaryHealthy_():n===Cm?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===Am&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=ho("t",e),r=ho("d",e);if(n==="c")this.onSecondaryControl_(r);else if(n==="d")this.pendingDataMessages.push(r);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Pm,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Sm,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Rm,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=ho("t",e),r=ho("d",e);n==="c"?this.onControl_(r):n==="d"&&this.onDataMessage_(r)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=ho(qu,e);if(Tm in e){const r=e[Tm];if(n===Sx){const s=Object.assign({},r);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(n===Rm){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===Cx?this.onConnectionShutdown_(r):n===Cm?this.onReset_(r):n===Ax?Rh("Server Error: "+r):n===Am?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Rh("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,r=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),Vd!==r&&ln("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),r=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,r),Oo(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Ex))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Oo(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(bx))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Pm,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(vs.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xw{put(e,n,r,s){}merge(e,n,r,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,r){}onDisconnectMerge(e,n,r){}onDisconnectCancel(e,n){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kw{constructor(e){this.allowedEvents_=e,this.listeners_={},Y(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const r=[...this.listeners_[e]];for(let s=0;s<r.length;s++)r[s].callback.apply(r[s].context,n)}}on(e,n,r){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:r});const s=this.getInitialEvent(e);s&&n.apply(r,s)}off(e,n,r){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let i=0;i<s.length;i++)if(s[i].callback===n&&(!r||r===s[i].context)){s.splice(i,1);return}}validateEventType_(e){Y(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l extends kw{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Dd()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new $l}getInitialEvent(e){return Y(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xm=32,km=768;class Xe{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let r=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[r]=this.pieces_[s],r++);this.pieces_.length=r,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function je(){return new Xe("")}function Re(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function Yr(t){return t.pieces_.length-t.pieceNum_}function Je(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new Xe(t.pieces_,e)}function Nw(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function Px(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function Dw(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function Ow(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new Xe(e,0)}function wt(t,e){const n=[];for(let r=t.pieceNum_;r<t.pieces_.length;r++)n.push(t.pieces_[r]);if(e instanceof Xe)for(let r=e.pieceNum_;r<e.pieces_.length;r++)n.push(e.pieces_[r]);else{const r=e.split("/");for(let s=0;s<r.length;s++)r[s].length>0&&n.push(r[s])}return new Xe(n,0)}function xe(t){return t.pieceNum_>=t.pieces_.length}function en(t,e){const n=Re(t),r=Re(e);if(n===null)return e;if(n===r)return en(Je(t),Je(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function Bd(t,e){if(Yr(t)!==Yr(e))return!1;for(let n=t.pieceNum_,r=e.pieceNum_;n<=t.pieces_.length;n++,r++)if(t.pieces_[n]!==e.pieces_[r])return!1;return!0}function Rn(t,e){let n=t.pieceNum_,r=e.pieceNum_;if(Yr(t)>Yr(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[r])return!1;++n,++r}return!0}class xx{constructor(e,n){this.errorPrefix_=n,this.parts_=Dw(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let r=0;r<this.parts_.length;r++)this.byteLength_+=Lc(this.parts_[r]);Mw(this)}}function kx(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=Lc(e),Mw(t)}function Nx(t){const e=t.parts_.pop();t.byteLength_-=Lc(e),t.parts_.length>0&&(t.byteLength_-=1)}function Mw(t){if(t.byteLength_>km)throw new Error(t.errorPrefix_+"has a key path longer than "+km+" bytes ("+t.byteLength_+").");if(t.parts_.length>xm)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+xm+") or object contains a cycle "+ps(t))}function ps(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $d extends kw{constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const r=!document[e];r!==this.visible_&&(this.visible_=r,this.trigger("visible",r))},!1)}static getInstance(){return new $d}getInitialEvent(e){return Y(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fo=1e3,Dx=60*5*1e3,Nm=30*1e3,Ox=1.3,Mx=3e4,Lx="server_kill",Dm=3;class lr extends xw{constructor(e,n,r,s,i,o,a,c){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=r,this.onConnectStatus_=s,this.onServerInfoUpdate_=i,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=c,this.id=lr.nextPersistentConnectionId_++,this.log_=Ta("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=fo,this.maxReconnectDelay_=Dx,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c&&!Qv())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");$d.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&$l.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,r){const s=++this.requestNumber_,i={r:s,a:e,b:n};this.log_(Rt(i)),Y(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(i),r&&(this.requestCBHash_[s]=r)}get(e){this.initConnection_();const n=new Mc,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(i),n.promise}listen(e,n,r,s){this.initConnection_();const i=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+i),this.listens.has(o)||this.listens.set(o,new Map),Y(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),Y(!this.listens.get(o).has(i),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:n,query:e,tag:r};this.listens.get(o).set(i,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,r=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(r)})}sendListen_(e){const n=e.query,r=n._path.toString(),s=n._queryIdentifier;this.log_("Listen on "+r+" for "+s);const i={p:r},o="q";e.tag&&(i.q=n._queryObject,i.t=e.tag),i.h=e.hashFn(),this.sendRequest(o,i,a=>{const c=a.d,u=a.s;lr.warnOnListenWarnings_(c,n),(this.listens.get(r)&&this.listens.get(r).get(s))===e&&(this.log_("listen response",a),u!=="ok"&&this.removeListen_(r,s),e.onComplete&&e.onComplete(u,c))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&Vn(e,"w")){const r=Ss(e,"w");if(Array.isArray(r)&&~r.indexOf("no_index")){const s='".indexOn": "'+n._queryParams.getIndex().toString()+'"',i=n._path.toString();ln(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${i} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||T1(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Nm)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=I1(e)?"auth":"gauth",r={cred:e};this.authOverride_===null?r.noauth=!0:typeof this.authOverride_=="object"&&(r.authvar=this.authOverride_),this.sendRequest(n,r,s=>{const i=s.s,o=s.d||"error";this.authToken_===e&&(i==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(i,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,r=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,r)})}unlisten(e,n){const r=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+r+" "+s),Y(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(r,s)&&this.connected_&&this.sendUnlisten_(r,s,e._queryObject,n)}sendUnlisten_(e,n,r,s){this.log_("Unlisten on "+e+" for "+n);const i={p:e},o="n";s&&(i.q=r,i.t=s),this.sendRequest(o,i)}onDisconnectPut(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:r})}onDisconnectMerge(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:r})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,r,s){const i={p:n,d:r};this.log_("onDisconnect "+e,i),this.sendRequest(e,i,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,n,r,s){this.putInternal("p",e,n,r,s)}merge(e,n,r,s){this.putInternal("m",e,n,r,s)}putInternal(e,n,r,s,i){this.initConnection_();const o={p:n,d:r};i!==void 0&&(o.h=i),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,r=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,r,i=>{this.log_(n+" response",i),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(i.s,i.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,r=>{if(r.s!=="ok"){const i=r.d;this.log_("reportStats","Error sending stats: "+i)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Rt(e));const n=e.r,r=this.requestCBHash_[n];r&&(delete this.requestCBHash_[n],r(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Rh("Unrecognized action received from server: "+Rt(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){Y(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=fo,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=fo,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Mx&&(this.reconnectDelay_=fo),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Ox)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),r=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+lr.nextConnectionId_++,i=this.lastSessionId;let o=!1,a=null;const c=function(){a?a.close():(o=!0,r())},u=function(f){Y(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(f)};this.realtime_={close:c,sendRequest:u};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[f,g]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?jt("getToken() completed but was canceled"):(jt("getToken() completed. Creating connection."),this.authToken_=f&&f.accessToken,this.appCheckToken_=g&&g.token,a=new Rx(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,r,m=>{ln(m+" ("+this.repoInfo_.toString()+")"),this.interrupt(Lx)},i))}catch(f){this.log_("Failed to get token: "+f),o||(this.repoInfo_.nodeAdmin&&ln(f),c())}}}interrupt(e){jt("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){jt("Resuming connection for reason: "+e),delete this.interruptReasons_[e],bh(this.interruptReasons_)&&(this.reconnectDelay_=fo,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let r;n?r=n.map(i=>Ld(i)).join("$"):r="default";const s=this.removeListen_(e,r);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,n){const r=new Xe(e).toString();let s;if(this.listens.has(r)){const i=this.listens.get(r);s=i.get(n),i.delete(n),i.size===0&&this.listens.delete(r)}else s=void 0;return s}onAuthRevoked_(e,n){jt("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Dm&&(this.reconnectDelay_=Nm,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){jt("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Dm&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+lw.replace(/\./g,"-")]=1,Dd()?e["framework.cordova"]=1:Yv()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=$l.getInstance().currentlyOnline();return bh(this.interruptReasons_)&&e}}lr.nextPersistentConnectionId_=0;lr.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new Pe(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const r=new Pe(Ti,e),s=new Pe(Ti,n);return this.compare(r,s)!==0}minPost(){return Pe.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let al;class Lw extends Vc{static get __EMPTY_NODE(){return al}static set __EMPTY_NODE(e){al=e}compare(e,n){return Bi(e.name,n.name)}isDefinedOn(e){throw Fi("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return Pe.MIN}maxPost(){return new Pe(Ps,al)}makePost(e,n){return Y(typeof e=="string","KeyIndex indexValue must always be a string."),new Pe(e,al)}toString(){return".key"}}const pi=new Lw;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ll=class{constructor(e,n,r,s,i=null){this.isReverse_=s,this.resultGenerator_=i,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?r(e.key,n):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},an=class wo{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??wo.RED,this.left=s??qn.EMPTY_NODE,this.right=i??qn.EMPTY_NODE}copy(e,n,r,s,i){return new wo(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return i<0?s=s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s=s.copy(null,n,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return qn.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let r,s;if(r=this,n(e,r.key)<0)!r.left.isEmpty()&&!r.left.isRed_()&&!r.left.left.isRed_()&&(r=r.moveRedLeft_()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed_()&&(r=r.rotateRight_()),!r.right.isEmpty()&&!r.right.isRed_()&&!r.right.left.isRed_()&&(r=r.moveRedRight_()),n(e,r.key)===0){if(r.right.isEmpty())return qn.EMPTY_NODE;s=r.right.min_(),r=r.copy(s.key,s.value,null,null,r.right.removeMin_())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,wo.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,wo.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};an.RED=!0;an.BLACK=!1;class Vx{copy(e,n,r,s,i){return this}insert(e,n,r){return new an(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let qn=class wl{constructor(e,n=wl.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new wl(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,an.BLACK,null,null))}remove(e){return new wl(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,an.BLACK,null,null))}get(e){let n,r=this.root_;for(;!r.isEmpty();){if(n=this.comparator_(e,r.key),n===0)return r.value;n<0?r=r.left:n>0&&(r=r.right)}return null}getPredecessorKey(e){let n,r=this.root_,s=null;for(;!r.isEmpty();)if(n=this.comparator_(e,r.key),n===0){if(r.left.isEmpty())return s?s.key:null;for(r=r.left;!r.right.isEmpty();)r=r.right;return r.key}else n<0?r=r.left:n>0&&(s=r,r=r.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ll(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new ll(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new ll(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new ll(this.root_,null,this.comparator_,!0,e)}};qn.EMPTY_NODE=new Vx;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fx(t,e){return Bi(t.name,e.name)}function jd(t,e){return Bi(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xh;function Ux(t){xh=t}const Vw=function(t){return typeof t=="number"?"number:"+fw(t):"string:"+t},Fw=function(t){if(t.isLeafNode()){const e=t.val();Y(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Vn(e,".sv"),"Priority must be a string or number.")}else Y(t===xh||t.isEmpty(),"priority of unexpected type.");Y(t===xh||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Om;class Ct{constructor(e,n=Ct.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,Y(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Fw(this.priorityNode_)}static set __childrenNodeConstructor(e){Om=e}static get __childrenNodeConstructor(){return Om}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Ct(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Ct.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return xe(e)?this:Re(e)===".priority"?this.priorityNode_:Ct.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:Ct.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const r=Re(e);return r===null?n:n.isEmpty()&&r!==".priority"?this:(Y(r!==".priority"||Yr(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(r,Ct.__childrenNodeConstructor.EMPTY_NODE.updateChild(Je(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Vw(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=fw(this.value_):e+=this.value_,this.lazyHash_=hw(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Ct.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Ct.__childrenNodeConstructor?-1:(Y(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,r=typeof this.value_,s=Ct.VALUE_TYPE_ORDER.indexOf(n),i=Ct.VALUE_TYPE_ORDER.indexOf(r);return Y(s>=0,"Unknown leaf type: "+n),Y(i>=0,"Unknown leaf type: "+r),s===i?r==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:i-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}Ct.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Uw,Bw;function Bx(t){Uw=t}function $x(t){Bw=t}class jx extends Vc{compare(e,n){const r=e.node.getPriority(),s=n.node.getPriority(),i=r.compareTo(s);return i===0?Bi(e.name,n.name):i}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return Pe.MIN}maxPost(){return new Pe(Ps,new Ct("[PRIORITY-POST]",Bw))}makePost(e,n){const r=Uw(e);return new Pe(n,new Ct("[PRIORITY-POST]",r))}toString(){return".priority"}}const lt=new jx;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qx=Math.log(2);class Hx{constructor(e){const n=i=>parseInt(Math.log(i)/qx,10),r=i=>parseInt(Array(i+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const s=r(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const jl=function(t,e,n,r){t.sort(e);const s=function(c,u){const h=u-c;let f,g;if(h===0)return null;if(h===1)return f=t[c],g=n?n(f):f,new an(g,f.node,an.BLACK,null,null);{const m=parseInt(h/2,10)+c,C=s(c,m),R=s(m+1,u);return f=t[m],g=n?n(f):f,new an(g,f.node,an.BLACK,C,R)}},i=function(c){let u=null,h=null,f=t.length;const g=function(C,R){const x=f-C,L=f;f-=C;const F=s(x+1,L),B=t[x],N=n?n(B):B;m(new an(N,B.node,R,null,F))},m=function(C){u?(u.left=C,u=C):(h=C,u=C)};for(let C=0;C<c.count;++C){const R=c.nextBitIsOne(),x=Math.pow(2,c.count-(C+1));R?g(x,an.BLACK):(g(x,an.BLACK),g(x,an.RED))}return h},o=new Hx(t.length),a=i(o);return new qn(r||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Hu;const ei={};class rr{constructor(e,n){this.indexes_=e,this.indexSet_=n}static get Default(){return Y(ei&&lt,"ChildrenNode.ts has not been loaded"),Hu=Hu||new rr({".priority":ei},{".priority":lt}),Hu}get(e){const n=Ss(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof qn?n:null}hasIndex(e){return Vn(this.indexSet_,e.toString())}addIndex(e,n){Y(e!==pi,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const r=[];let s=!1;const i=n.getIterator(Pe.Wrap);let o=i.getNext();for(;o;)s=s||e.isDefinedOn(o.node),r.push(o),o=i.getNext();let a;s?a=jl(r,e.getCompare()):a=ei;const c=e.toString(),u=Object.assign({},this.indexSet_);u[c]=e;const h=Object.assign({},this.indexes_);return h[c]=a,new rr(h,u)}addToIndexes(e,n){const r=Fl(this.indexes_,(s,i)=>{const o=Ss(this.indexSet_,i);if(Y(o,"Missing index implementation for "+i),s===ei)if(o.isDefinedOn(e.node)){const a=[],c=n.getIterator(Pe.Wrap);let u=c.getNext();for(;u;)u.name!==e.name&&a.push(u),u=c.getNext();return a.push(e),jl(a,o.getCompare())}else return ei;else{const a=n.get(e.name);let c=s;return a&&(c=c.remove(new Pe(e.name,a))),c.insert(e,e.node)}});return new rr(r,this.indexSet_)}removeFromIndexes(e,n){const r=Fl(this.indexes_,s=>{if(s===ei)return s;{const i=n.get(e.name);return i?s.remove(new Pe(e.name,i)):s}});return new rr(r,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let po;class ge{constructor(e,n,r){this.children_=e,this.priorityNode_=n,this.indexMap_=r,this.lazyHash_=null,this.priorityNode_&&Fw(this.priorityNode_),this.children_.isEmpty()&&Y(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return po||(po=new ge(new qn(jd),null,rr.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||po}updatePriority(e){return this.children_.isEmpty()?this:new ge(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?po:n}}getChild(e){const n=Re(e);return n===null?this:this.getImmediateChild(n).getChild(Je(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(Y(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const r=new Pe(e,n);let s,i;n.isEmpty()?(s=this.children_.remove(e),i=this.indexMap_.removeFromIndexes(r,this.children_)):(s=this.children_.insert(e,n),i=this.indexMap_.addToIndexes(r,this.children_));const o=s.isEmpty()?po:this.priorityNode_;return new ge(s,o,i)}}updateChild(e,n){const r=Re(e);if(r===null)return n;{Y(Re(e)!==".priority"||Yr(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(r).updateChild(Je(e),n);return this.updateImmediateChild(r,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let r=0,s=0,i=!0;if(this.forEachChild(lt,(o,a)=>{n[o]=a.val(e),r++,i&&ge.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):i=!1}),!e&&i&&s<2*r){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Vw(this.getPriority().val())+":"),this.forEachChild(lt,(n,r)=>{const s=r.hash();s!==""&&(e+=":"+n+":"+s)}),this.lazyHash_=e===""?"":hw(e)}return this.lazyHash_}getPredecessorChildName(e,n,r){const s=this.resolveIndex_(r);if(s){const i=s.getPredecessorKey(new Pe(e,n));return i?i.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.minKey();return r&&r.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new Pe(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.maxKey();return r&&r.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new Pe(n,this.children_.get(n)):null}forEachChild(e,n){const r=this.resolveIndex_(e);return r?r.inorderTraversal(s=>n(s.name,s.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,Pe.Wrap);let i=s.peek();for(;i!=null&&n.compare(i,e)<0;)s.getNext(),i=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,Pe.Wrap);let i=s.peek();for(;i!=null&&n.compare(i,e)>0;)s.getNext(),i=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Aa?-1:0}withIndex(e){if(e===pi||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new ge(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===pi||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const r=this.getIterator(lt),s=n.getIterator(lt);let i=r.getNext(),o=s.getNext();for(;i&&o;){if(i.name!==o.name||!i.node.equals(o.node))return!1;i=r.getNext(),o=s.getNext()}return i===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===pi?null:this.indexMap_.get(e.toString())}}ge.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Wx extends ge{constructor(){super(new qn(jd),ge.EMPTY_NODE,rr.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return ge.EMPTY_NODE}isEmpty(){return!1}}const Aa=new Wx;Object.defineProperties(Pe,{MIN:{value:new Pe(Ti,ge.EMPTY_NODE)},MAX:{value:new Pe(Ps,Aa)}});Lw.__EMPTY_NODE=ge.EMPTY_NODE;Ct.__childrenNodeConstructor=ge;Ux(Aa);$x(Aa);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zx=!0;function kt(t,e=null){if(t===null)return ge.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),Y(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new Ct(n,kt(e))}if(!(t instanceof Array)&&zx){const n=[];let r=!1;if(rn(t,(o,a)=>{if(o.substring(0,1)!=="."){const c=kt(a);c.isEmpty()||(r=r||!c.getPriority().isEmpty(),n.push(new Pe(o,c)))}}),n.length===0)return ge.EMPTY_NODE;const i=jl(n,Fx,o=>o.name,jd);if(r){const o=jl(n,lt.getCompare());return new ge(i,kt(e),new rr({".priority":o},{".priority":lt}))}else return new ge(i,kt(e),rr.Default)}else{let n=ge.EMPTY_NODE;return rn(t,(r,s)=>{if(Vn(t,r)&&r.substring(0,1)!=="."){const i=kt(s);(i.isLeafNode()||!i.isEmpty())&&(n=n.updateImmediateChild(r,i))}}),n.updatePriority(kt(e))}}Bx(kt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gx extends Vc{constructor(e){super(),this.indexPath_=e,Y(!xe(e)&&Re(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const r=this.extractChild(e.node),s=this.extractChild(n.node),i=r.compareTo(s);return i===0?Bi(e.name,n.name):i}makePost(e,n){const r=kt(e),s=ge.EMPTY_NODE.updateChild(this.indexPath_,r);return new Pe(n,s)}maxPost(){const e=ge.EMPTY_NODE.updateChild(this.indexPath_,Aa);return new Pe(Ps,e)}toString(){return Dw(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kx extends Vc{compare(e,n){const r=e.node.compareTo(n.node);return r===0?Bi(e.name,n.name):r}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return Pe.MIN}maxPost(){return Pe.MAX}makePost(e,n){const r=kt(e);return new Pe(n,r)}toString(){return".value"}}const Yx=new Kx;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $w(t){return{type:"value",snapshotNode:t}}function Ci(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function na(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function ra(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function Qx(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(e){this.index_=e}updateChild(e,n,r,s,i,o){Y(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(s).equals(r.getChild(s))&&a.isEmpty()===r.isEmpty()||(o!=null&&(r.isEmpty()?e.hasChild(n)?o.trackChildChange(na(n,a)):Y(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Ci(n,r)):o.trackChildChange(ra(n,r,a))),e.isLeafNode()&&r.isEmpty())?e:e.updateImmediateChild(n,r).withIndex(this.index_)}updateFullNode(e,n,r){return r!=null&&(e.isLeafNode()||e.forEachChild(lt,(s,i)=>{n.hasChild(s)||r.trackChildChange(na(s,i))}),n.isLeafNode()||n.forEachChild(lt,(s,i)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(i)||r.trackChildChange(ra(s,i,o))}else r.trackChildChange(Ci(s,i))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?ge.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(e){this.indexedFilter_=new qd(e.getIndex()),this.index_=e.getIndex(),this.startPost_=sa.getStartPost_(e),this.endPost_=sa.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,r=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&r}updateChild(e,n,r,s,i,o){return this.matches(new Pe(n,r))||(r=ge.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,r,s,i,o)}updateFullNode(e,n,r){n.isLeafNode()&&(n=ge.EMPTY_NODE);let s=n.withIndex(this.index_);s=s.updatePriority(ge.EMPTY_NODE);const i=this;return n.forEachChild(lt,(o,a)=>{i.matches(new Pe(o,a))||(s=s.updateImmediateChild(o,ge.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xx{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const r=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?r<=0:r<0},this.withinEndPost=n=>{const r=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?r<=0:r<0},this.rangedFilter_=new sa(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,r,s,i,o){return this.rangedFilter_.matches(new Pe(n,r))||(r=ge.EMPTY_NODE),e.getImmediateChild(n).equals(r)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,r,s,i,o):this.fullLimitUpdateChild_(e,n,r,i,o)}updateFullNode(e,n,r){let s;if(n.isLeafNode()||n.isEmpty())s=ge.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){s=ge.EMPTY_NODE.withIndex(this.index_);let i;this.reverse_?i=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):i=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;i.hasNext()&&o<this.limit_;){const a=i.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=n.withIndex(this.index_),s=s.updatePriority(ge.EMPTY_NODE);let i;this.reverse_?i=s.getReverseIterator(this.index_):i=s.getIterator(this.index_);let o=0;for(;i.hasNext();){const a=i.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,ge.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,r,s,i){let o;if(this.reverse_){const f=this.index_.getCompare();o=(g,m)=>f(m,g)}else o=this.index_.getCompare();const a=e;Y(a.numChildren()===this.limit_,"");const c=new Pe(n,r),u=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(c);if(a.hasChild(n)){const f=a.getImmediateChild(n);let g=s.getChildAfterChild(this.index_,u,this.reverse_);for(;g!=null&&(g.name===n||a.hasChild(g.name));)g=s.getChildAfterChild(this.index_,g,this.reverse_);const m=g==null?1:o(g,c);if(h&&!r.isEmpty()&&m>=0)return i!=null&&i.trackChildChange(ra(n,r,f)),a.updateImmediateChild(n,r);{i!=null&&i.trackChildChange(na(n,f));const R=a.updateImmediateChild(n,ge.EMPTY_NODE);return g!=null&&this.rangedFilter_.matches(g)?(i!=null&&i.trackChildChange(Ci(g.name,g.node)),R.updateImmediateChild(g.name,g.node)):R}}else return r.isEmpty()?e:h&&o(u,c)>=0?(i!=null&&(i.trackChildChange(na(u.name,u.node)),i.trackChildChange(Ci(n,r))),a.updateImmediateChild(n,r).updateImmediateChild(u.name,ge.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hd{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=lt}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return Y(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return Y(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Ti}hasEnd(){return this.endSet_}getIndexEndValue(){return Y(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return Y(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Ps}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return Y(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===lt}copy(){const e=new Hd;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Jx(t){return t.loadsAllData()?new qd(t.getIndex()):t.hasLimit()?new Xx(t):new sa(t)}function Mm(t){const e={};if(t.isDefault())return e;let n;if(t.index_===lt?n="$priority":t.index_===Yx?n="$value":t.index_===pi?n="$key":(Y(t.index_ instanceof Gx,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=Rt(n),t.startSet_){const r=t.startAfterSet_?"startAfter":"startAt";e[r]=Rt(t.indexStartValue_),t.startNameSet_&&(e[r]+=","+Rt(t.indexStartName_))}if(t.endSet_){const r=t.endBeforeSet_?"endBefore":"endAt";e[r]=Rt(t.indexEndValue_),t.endNameSet_&&(e[r]+=","+Rt(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function Lm(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==lt&&(e.i=t.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ql extends xw{constructor(e,n,r,s){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=r,this.appCheckTokenProvider_=s,this.log_=Ta("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(Y(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,n,r,s){const i=e._path.toString();this.log_("Listen called for "+i+" "+e._queryIdentifier);const o=ql.getListenId_(e,r),a={};this.listens_[o]=a;const c=Mm(e._queryParams);this.restRequest_(i+".json",c,(u,h)=>{let f=h;if(u===404&&(f=null,u=null),u===null&&this.onDataUpdate_(i,f,!1,r),Ss(this.listens_,o)===a){let g;u?u===401?g="permission_denied":g="rest_error:"+u:g="ok",s(g,null)}})}unlisten(e,n){const r=ql.getListenId_(e,n);delete this.listens_[r]}get(e){const n=Mm(e._queryParams),r=e._path.toString(),s=new Mc;return this.restRequest_(r+".json",n,(i,o)=>{let a=o;i===404&&(a=null,i=null),i===null?(this.onDataUpdate_(r,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,n={},r){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,i])=>{s&&s.accessToken&&(n.auth=s.accessToken),i&&i.token&&(n.ac=i.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Ui(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(r&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let c=null;if(a.status>=200&&a.status<300){try{c=Jo(a.responseText)}catch{ln("Failed to parse JSON response for "+o+": "+a.responseText)}r(null,c)}else a.status!==401&&a.status!==404&&ln("Got unsuccessful REST response for "+o+" Status: "+a.status),r(a.status);r=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zx{constructor(){this.rootNode_=ge.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hl(){return{value:null,children:new Map}}function jw(t,e,n){if(xe(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const r=Re(e);t.children.has(r)||t.children.set(r,Hl());const s=t.children.get(r);e=Je(e),jw(s,e,n)}}function kh(t,e,n){t.value!==null?n(e,t.value):ek(t,(r,s)=>{const i=new Xe(e.toString()+"/"+r);kh(s,i,n)})}function ek(t,e){t.children.forEach((n,r)=>{e(r,n)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tk{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&rn(this.last_,(r,s)=>{n[r]=n[r]-s}),this.last_=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vm=10*1e3,nk=30*1e3,rk=5*60*1e3;class sk{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new tk(e);const r=Vm+(nk-Vm)*Math.random();Oo(this.reportStats_.bind(this),Math.floor(r))}reportStats_(){const e=this.statsListener_.get(),n={};let r=!1;rn(e,(s,i)=>{i>0&&Vn(this.statsToReport_,s)&&(n[s]=i,r=!0)}),r&&this.server_.reportStats(n),Oo(this.reportStats_.bind(this),Math.floor(Math.random()*2*rk))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pn;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Pn||(Pn={}));function qw(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Wd(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function zd(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e,n,r){this.path=e,this.affectedTree=n,this.revert=r,this.type=Pn.ACK_USER_WRITE,this.source=qw()}operationForChild(e){if(xe(this.path)){if(this.affectedTree.value!=null)return Y(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new Xe(e));return new Wl(je(),n,this.revert)}}else return Y(Re(this.path)===e,"operationForChild called for unrelated child."),new Wl(Je(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e,n){this.source=e,this.path=n,this.type=Pn.LISTEN_COMPLETE}operationForChild(e){return xe(this.path)?new ia(this.source,je()):new ia(this.source,Je(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e,n,r){this.source=e,this.path=n,this.snap=r,this.type=Pn.OVERWRITE}operationForChild(e){return xe(this.path)?new xs(this.source,je(),this.snap.getImmediateChild(e)):new xs(this.source,Je(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa{constructor(e,n,r){this.source=e,this.path=n,this.children=r,this.type=Pn.MERGE}operationForChild(e){if(xe(this.path)){const n=this.children.subtree(new Xe(e));return n.isEmpty()?null:n.value?new xs(this.source,je(),n.value):new oa(this.source,je(),n)}else return Y(Re(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new oa(this.source,Je(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e,n,r){this.node_=e,this.fullyInitialized_=n,this.filtered_=r}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(xe(e))return this.isFullyInitialized()&&!this.filtered_;const n=Re(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ik{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function ok(t,e,n,r){const s=[],i=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&i.push(Qx(o.childName,o.snapshotNode))}),go(t,s,"child_removed",e,r,n),go(t,s,"child_added",e,r,n),go(t,s,"child_moved",i,r,n),go(t,s,"child_changed",e,r,n),go(t,s,"value",e,r,n),s}function go(t,e,n,r,s,i){const o=r.filter(a=>a.type===n);o.sort((a,c)=>lk(t,a,c)),o.forEach(a=>{const c=ak(t,a,i);s.forEach(u=>{u.respondsTo(a.type)&&e.push(u.createEvent(c,t.query_))})})}function ak(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function lk(t,e,n){if(e.childName==null||n.childName==null)throw Fi("Should only compare child_ events.");const r=new Pe(e.childName,e.snapshotNode),s=new Pe(n.childName,n.snapshotNode);return t.index_.compare(r,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fc(t,e){return{eventCache:t,serverCache:e}}function Mo(t,e,n,r){return Fc(new ks(e,n,r),t.serverCache)}function Hw(t,e,n,r){return Fc(t.eventCache,new ks(e,n,r))}function Nh(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function Ns(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wu;const ck=()=>(Wu||(Wu=new qn(KP)),Wu);class rt{constructor(e,n=ck()){this.value=e,this.children=n}static fromObject(e){let n=new rt(null);return rn(e,(r,s)=>{n=n.set(new Xe(r),s)}),n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:je(),value:this.value};if(xe(e))return null;{const r=Re(e),s=this.children.get(r);if(s!==null){const i=s.findRootMostMatchingPathAndValue(Je(e),n);return i!=null?{path:wt(new Xe(r),i.path),value:i.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(xe(e))return this;{const n=Re(e),r=this.children.get(n);return r!==null?r.subtree(Je(e)):new rt(null)}}set(e,n){if(xe(e))return new rt(n,this.children);{const r=Re(e),i=(this.children.get(r)||new rt(null)).set(Je(e),n),o=this.children.insert(r,i);return new rt(this.value,o)}}remove(e){if(xe(e))return this.children.isEmpty()?new rt(null):new rt(null,this.children);{const n=Re(e),r=this.children.get(n);if(r){const s=r.remove(Je(e));let i;return s.isEmpty()?i=this.children.remove(n):i=this.children.insert(n,s),this.value===null&&i.isEmpty()?new rt(null):new rt(this.value,i)}else return this}}get(e){if(xe(e))return this.value;{const n=Re(e),r=this.children.get(n);return r?r.get(Je(e)):null}}setTree(e,n){if(xe(e))return n;{const r=Re(e),i=(this.children.get(r)||new rt(null)).setTree(Je(e),n);let o;return i.isEmpty()?o=this.children.remove(r):o=this.children.insert(r,i),new rt(this.value,o)}}fold(e){return this.fold_(je(),e)}fold_(e,n){const r={};return this.children.inorderTraversal((s,i)=>{r[s]=i.fold_(wt(e,s),n)}),n(e,this.value,r)}findOnPath(e,n){return this.findOnPath_(e,je(),n)}findOnPath_(e,n,r){const s=this.value?r(n,this.value):!1;if(s)return s;if(xe(e))return null;{const i=Re(e),o=this.children.get(i);return o?o.findOnPath_(Je(e),wt(n,i),r):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,je(),n)}foreachOnPath_(e,n,r){if(xe(e))return this;{this.value&&r(n,this.value);const s=Re(e),i=this.children.get(s);return i?i.foreachOnPath_(Je(e),wt(n,s),r):new rt(null)}}foreach(e){this.foreach_(je(),e)}foreach_(e,n){this.children.inorderTraversal((r,s)=>{s.foreach_(wt(e,r),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,r)=>{r.value&&e(n,r.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this.writeTree_=e}static empty(){return new Nn(new rt(null))}}function Lo(t,e,n){if(xe(e))return new Nn(new rt(n));{const r=t.writeTree_.findRootMostValueAndPath(e);if(r!=null){const s=r.path;let i=r.value;const o=en(s,e);return i=i.updateChild(o,n),new Nn(t.writeTree_.set(s,i))}else{const s=new rt(n),i=t.writeTree_.setTree(e,s);return new Nn(i)}}}function Fm(t,e,n){let r=t;return rn(n,(s,i)=>{r=Lo(r,wt(e,s),i)}),r}function Um(t,e){if(xe(e))return Nn.empty();{const n=t.writeTree_.setTree(e,new rt(null));return new Nn(n)}}function Dh(t,e){return js(t,e)!=null}function js(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(en(n.path,e)):null}function Bm(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(lt,(r,s)=>{e.push(new Pe(r,s))}):t.writeTree_.children.inorderTraversal((r,s)=>{s.value!=null&&e.push(new Pe(r,s.value))}),e}function Hr(t,e){if(xe(e))return t;{const n=js(t,e);return n!=null?new Nn(new rt(n)):new Nn(t.writeTree_.subtree(e))}}function Oh(t){return t.writeTree_.isEmpty()}function Ai(t,e){return Ww(je(),t.writeTree_,e)}function Ww(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let r=null;return e.children.inorderTraversal((s,i)=>{s===".priority"?(Y(i.value!==null,"Priority writes must always be leaf nodes"),r=i.value):n=Ww(wt(t,s),i,n)}),!n.getChild(t).isEmpty()&&r!==null&&(n=n.updateChild(wt(t,".priority"),r)),n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gd(t,e){return Yw(e,t)}function uk(t,e,n,r,s){Y(r>t.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),t.allWrites.push({path:e,snap:n,writeId:r,visible:s}),s&&(t.visibleWrites=Lo(t.visibleWrites,e,n)),t.lastWriteId=r}function hk(t,e){for(let n=0;n<t.allWrites.length;n++){const r=t.allWrites[n];if(r.writeId===e)return r}return null}function dk(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);Y(n>=0,"removeWrite called with nonexistent writeId.");const r=t.allWrites[n];t.allWrites.splice(n,1);let s=r.visible,i=!1,o=t.allWrites.length-1;for(;s&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&fk(a,r.path)?s=!1:Rn(r.path,a.path)&&(i=!0)),o--}if(s){if(i)return pk(t),!0;if(r.snap)t.visibleWrites=Um(t.visibleWrites,r.path);else{const a=r.children;rn(a,c=>{t.visibleWrites=Um(t.visibleWrites,wt(r.path,c))})}return!0}else return!1}function fk(t,e){if(t.snap)return Rn(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&Rn(wt(t.path,n),e))return!0;return!1}function pk(t){t.visibleWrites=zw(t.allWrites,gk,je()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function gk(t){return t.visible}function zw(t,e,n){let r=Nn.empty();for(let s=0;s<t.length;++s){const i=t[s];if(e(i)){const o=i.path;let a;if(i.snap)Rn(n,o)?(a=en(n,o),r=Lo(r,a,i.snap)):Rn(o,n)&&(a=en(o,n),r=Lo(r,je(),i.snap.getChild(a)));else if(i.children){if(Rn(n,o))a=en(n,o),r=Fm(r,a,i.children);else if(Rn(o,n))if(a=en(o,n),xe(a))r=Fm(r,je(),i.children);else{const c=Ss(i.children,Re(a));if(c){const u=c.getChild(Je(a));r=Lo(r,je(),u)}}}else throw Fi("WriteRecord should have .snap or .children")}}return r}function Gw(t,e,n,r,s){if(!r&&!s){const i=js(t.visibleWrites,e);if(i!=null)return i;{const o=Hr(t.visibleWrites,e);if(Oh(o))return n;if(n==null&&!Dh(o,je()))return null;{const a=n||ge.EMPTY_NODE;return Ai(o,a)}}}else{const i=Hr(t.visibleWrites,e);if(!s&&Oh(i))return n;if(!s&&n==null&&!Dh(i,je()))return null;{const o=function(u){return(u.visible||s)&&(!r||!~r.indexOf(u.writeId))&&(Rn(u.path,e)||Rn(e,u.path))},a=zw(t.allWrites,o,e),c=n||ge.EMPTY_NODE;return Ai(a,c)}}}function mk(t,e,n){let r=ge.EMPTY_NODE;const s=js(t.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(lt,(i,o)=>{r=r.updateImmediateChild(i,o)}),r;if(n){const i=Hr(t.visibleWrites,e);return n.forEachChild(lt,(o,a)=>{const c=Ai(Hr(i,new Xe(o)),a);r=r.updateImmediateChild(o,c)}),Bm(i).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}else{const i=Hr(t.visibleWrites,e);return Bm(i).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}}function _k(t,e,n,r,s){Y(r||s,"Either existingEventSnap or existingServerSnap must exist");const i=wt(e,n);if(Dh(t.visibleWrites,i))return null;{const o=Hr(t.visibleWrites,i);return Oh(o)?s.getChild(n):Ai(o,s.getChild(n))}}function yk(t,e,n,r){const s=wt(e,n),i=js(t.visibleWrites,s);if(i!=null)return i;if(r.isCompleteForChild(n)){const o=Hr(t.visibleWrites,s);return Ai(o,r.getNode().getImmediateChild(n))}else return null}function vk(t,e){return js(t.visibleWrites,e)}function wk(t,e,n,r,s,i,o){let a;const c=Hr(t.visibleWrites,e),u=js(c,je());if(u!=null)a=u;else if(n!=null)a=Ai(c,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],f=o.getCompare(),g=i?a.getReverseIteratorFrom(r,o):a.getIteratorFrom(r,o);let m=g.getNext();for(;m&&h.length<s;)f(m,r)!==0&&h.push(m),m=g.getNext();return h}else return[]}function Ek(){return{visibleWrites:Nn.empty(),allWrites:[],lastWriteId:-1}}function zl(t,e,n,r){return Gw(t.writeTree,t.treePath,e,n,r)}function Kd(t,e){return mk(t.writeTree,t.treePath,e)}function $m(t,e,n,r){return _k(t.writeTree,t.treePath,e,n,r)}function Gl(t,e){return vk(t.writeTree,wt(t.treePath,e))}function bk(t,e,n,r,s,i){return wk(t.writeTree,t.treePath,e,n,r,s,i)}function Yd(t,e,n){return yk(t.writeTree,t.treePath,e,n)}function Kw(t,e){return Yw(wt(t.treePath,e),t.writeTree)}function Yw(t,e){return{treePath:t,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ik{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,r=e.childName;Y(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),Y(r!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(r);if(s){const i=s.type;if(n==="child_added"&&i==="child_removed")this.changeMap.set(r,ra(r,e.snapshotNode,s.snapshotNode));else if(n==="child_removed"&&i==="child_added")this.changeMap.delete(r);else if(n==="child_removed"&&i==="child_changed")this.changeMap.set(r,na(r,s.oldSnap));else if(n==="child_changed"&&i==="child_added")this.changeMap.set(r,Ci(r,e.snapshotNode));else if(n==="child_changed"&&i==="child_changed")this.changeMap.set(r,ra(r,e.snapshotNode,s.oldSnap));else throw Fi("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(r,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tk{getCompleteChild(e){return null}getChildAfterChild(e,n,r){return null}}const Qw=new Tk;class Qd{constructor(e,n,r=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=r}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const r=this.optCompleteServerCache_!=null?new ks(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Yd(this.writes_,e,r)}}getChildAfterChild(e,n,r){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Ns(this.viewCache_),i=bk(this.writes_,s,n,1,r,e);return i.length===0?null:i[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ck(t){return{filter:t}}function Ak(t,e){Y(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),Y(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function Sk(t,e,n,r,s){const i=new Ik;let o,a;if(n.type===Pn.OVERWRITE){const u=n;u.source.fromUser?o=Mh(t,e,u.path,u.snap,r,s,i):(Y(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered()&&!xe(u.path),o=Kl(t,e,u.path,u.snap,r,s,a,i))}else if(n.type===Pn.MERGE){const u=n;u.source.fromUser?o=Pk(t,e,u.path,u.children,r,s,i):(Y(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered(),o=Lh(t,e,u.path,u.children,r,s,a,i))}else if(n.type===Pn.ACK_USER_WRITE){const u=n;u.revert?o=Nk(t,e,u.path,r,s,i):o=xk(t,e,u.path,u.affectedTree,r,s,i)}else if(n.type===Pn.LISTEN_COMPLETE)o=kk(t,e,n.path,r,i);else throw Fi("Unknown operation type: "+n.type);const c=i.getChanges();return Rk(e,o,c),{viewCache:o,changes:c}}function Rk(t,e,n){const r=e.eventCache;if(r.isFullyInitialized()){const s=r.getNode().isLeafNode()||r.getNode().isEmpty(),i=Nh(t);(n.length>0||!t.eventCache.isFullyInitialized()||s&&!r.getNode().equals(i)||!r.getNode().getPriority().equals(i.getPriority()))&&n.push($w(Nh(e)))}}function Xw(t,e,n,r,s,i){const o=e.eventCache;if(Gl(r,n)!=null)return e;{let a,c;if(xe(n))if(Y(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=Ns(e),h=u instanceof ge?u:ge.EMPTY_NODE,f=Kd(r,h);a=t.filter.updateFullNode(e.eventCache.getNode(),f,i)}else{const u=zl(r,Ns(e));a=t.filter.updateFullNode(e.eventCache.getNode(),u,i)}else{const u=Re(n);if(u===".priority"){Y(Yr(n)===1,"Can't have a priority with additional path components");const h=o.getNode();c=e.serverCache.getNode();const f=$m(r,n,h,c);f!=null?a=t.filter.updatePriority(h,f):a=o.getNode()}else{const h=Je(n);let f;if(o.isCompleteForChild(u)){c=e.serverCache.getNode();const g=$m(r,n,o.getNode(),c);g!=null?f=o.getNode().getImmediateChild(u).updateChild(h,g):f=o.getNode().getImmediateChild(u)}else f=Yd(r,u,e.serverCache);f!=null?a=t.filter.updateChild(o.getNode(),u,f,h,s,i):a=o.getNode()}}return Mo(e,a,o.isFullyInitialized()||xe(n),t.filter.filtersNodes())}}function Kl(t,e,n,r,s,i,o,a){const c=e.serverCache;let u;const h=o?t.filter:t.filter.getIndexedFilter();if(xe(n))u=h.updateFullNode(c.getNode(),r,null);else if(h.filtersNodes()&&!c.isFiltered()){const m=c.getNode().updateChild(n,r);u=h.updateFullNode(c.getNode(),m,null)}else{const m=Re(n);if(!c.isCompleteForPath(n)&&Yr(n)>1)return e;const C=Je(n),x=c.getNode().getImmediateChild(m).updateChild(C,r);m===".priority"?u=h.updatePriority(c.getNode(),x):u=h.updateChild(c.getNode(),m,x,C,Qw,null)}const f=Hw(e,u,c.isFullyInitialized()||xe(n),h.filtersNodes()),g=new Qd(s,f,i);return Xw(t,f,n,s,g,a)}function Mh(t,e,n,r,s,i,o){const a=e.eventCache;let c,u;const h=new Qd(s,e,i);if(xe(n))u=t.filter.updateFullNode(e.eventCache.getNode(),r,o),c=Mo(e,u,!0,t.filter.filtersNodes());else{const f=Re(n);if(f===".priority")u=t.filter.updatePriority(e.eventCache.getNode(),r),c=Mo(e,u,a.isFullyInitialized(),a.isFiltered());else{const g=Je(n),m=a.getNode().getImmediateChild(f);let C;if(xe(g))C=r;else{const R=h.getCompleteChild(f);R!=null?Nw(g)===".priority"&&R.getChild(Ow(g)).isEmpty()?C=R:C=R.updateChild(g,r):C=ge.EMPTY_NODE}if(m.equals(C))c=e;else{const R=t.filter.updateChild(a.getNode(),f,C,g,h,o);c=Mo(e,R,a.isFullyInitialized(),t.filter.filtersNodes())}}}return c}function jm(t,e){return t.eventCache.isCompleteForChild(e)}function Pk(t,e,n,r,s,i,o){let a=e;return r.foreach((c,u)=>{const h=wt(n,c);jm(e,Re(h))&&(a=Mh(t,a,h,u,s,i,o))}),r.foreach((c,u)=>{const h=wt(n,c);jm(e,Re(h))||(a=Mh(t,a,h,u,s,i,o))}),a}function qm(t,e,n){return n.foreach((r,s)=>{e=e.updateChild(r,s)}),e}function Lh(t,e,n,r,s,i,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,u;xe(n)?u=r:u=new rt(null).setTree(n,r);const h=e.serverCache.getNode();return u.children.inorderTraversal((f,g)=>{if(h.hasChild(f)){const m=e.serverCache.getNode().getImmediateChild(f),C=qm(t,m,g);c=Kl(t,c,new Xe(f),C,s,i,o,a)}}),u.children.inorderTraversal((f,g)=>{const m=!e.serverCache.isCompleteForChild(f)&&g.value===null;if(!h.hasChild(f)&&!m){const C=e.serverCache.getNode().getImmediateChild(f),R=qm(t,C,g);c=Kl(t,c,new Xe(f),R,s,i,o,a)}}),c}function xk(t,e,n,r,s,i,o){if(Gl(s,n)!=null)return e;const a=e.serverCache.isFiltered(),c=e.serverCache;if(r.value!=null){if(xe(n)&&c.isFullyInitialized()||c.isCompleteForPath(n))return Kl(t,e,n,c.getNode().getChild(n),s,i,a,o);if(xe(n)){let u=new rt(null);return c.getNode().forEachChild(pi,(h,f)=>{u=u.set(new Xe(h),f)}),Lh(t,e,n,u,s,i,a,o)}else return e}else{let u=new rt(null);return r.foreach((h,f)=>{const g=wt(n,h);c.isCompleteForPath(g)&&(u=u.set(h,c.getNode().getChild(g)))}),Lh(t,e,n,u,s,i,a,o)}}function kk(t,e,n,r,s){const i=e.serverCache,o=Hw(e,i.getNode(),i.isFullyInitialized()||xe(n),i.isFiltered());return Xw(t,o,n,r,Qw,s)}function Nk(t,e,n,r,s,i){let o;if(Gl(r,n)!=null)return e;{const a=new Qd(r,e,s),c=e.eventCache.getNode();let u;if(xe(n)||Re(n)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=zl(r,Ns(e));else{const f=e.serverCache.getNode();Y(f instanceof ge,"serverChildren would be complete if leaf node"),h=Kd(r,f)}h=h,u=t.filter.updateFullNode(c,h,i)}else{const h=Re(n);let f=Yd(r,h,e.serverCache);f==null&&e.serverCache.isCompleteForChild(h)&&(f=c.getImmediateChild(h)),f!=null?u=t.filter.updateChild(c,h,f,Je(n),a,i):e.eventCache.getNode().hasChild(h)?u=t.filter.updateChild(c,h,ge.EMPTY_NODE,Je(n),a,i):u=c,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=zl(r,Ns(e)),o.isLeafNode()&&(u=t.filter.updateFullNode(u,o,i)))}return o=e.serverCache.isFullyInitialized()||Gl(r,je())!=null,Mo(e,u,o,t.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dk{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const r=this.query_._queryParams,s=new qd(r.getIndex()),i=Jx(r);this.processor_=Ck(i);const o=n.serverCache,a=n.eventCache,c=s.updateFullNode(ge.EMPTY_NODE,o.getNode(),null),u=i.updateFullNode(ge.EMPTY_NODE,a.getNode(),null),h=new ks(c,o.isFullyInitialized(),s.filtersNodes()),f=new ks(u,a.isFullyInitialized(),i.filtersNodes());this.viewCache_=Fc(f,h),this.eventGenerator_=new ik(this.query_)}get query(){return this.query_}}function Ok(t){return t.viewCache_.serverCache.getNode()}function Mk(t,e){const n=Ns(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!xe(e)&&!n.getImmediateChild(Re(e)).isEmpty())?n.getChild(e):null}function Hm(t){return t.eventRegistrations_.length===0}function Lk(t,e){t.eventRegistrations_.push(e)}function Wm(t,e,n){const r=[];if(n){Y(e==null,"A cancel should cancel all event registrations.");const s=t.query._path;t.eventRegistrations_.forEach(i=>{const o=i.createCancelEvent(n,s);o&&r.push(o)})}if(e){let s=[];for(let i=0;i<t.eventRegistrations_.length;++i){const o=t.eventRegistrations_[i];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(t.eventRegistrations_.slice(i+1));break}}t.eventRegistrations_=s}else t.eventRegistrations_=[];return r}function zm(t,e,n,r){e.type===Pn.MERGE&&e.source.queryId!==null&&(Y(Ns(t.viewCache_),"We should always have a full cache before handling merges"),Y(Nh(t.viewCache_),"Missing event cache, even though we have a server cache"));const s=t.viewCache_,i=Sk(t.processor_,s,e,n,r);return Ak(t.processor_,i.viewCache),Y(i.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=i.viewCache,Jw(t,i.changes,i.viewCache.eventCache.getNode(),null)}function Vk(t,e){const n=t.viewCache_.eventCache,r=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(lt,(i,o)=>{r.push(Ci(i,o))}),n.isFullyInitialized()&&r.push($w(n.getNode())),Jw(t,r,n.getNode(),e)}function Jw(t,e,n,r){const s=r?[r]:t.eventRegistrations_;return ok(t.eventGenerator_,e,n,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yl;class Fk{constructor(){this.views=new Map}}function Uk(t){Y(!Yl,"__referenceConstructor has already been defined"),Yl=t}function Bk(){return Y(Yl,"Reference.ts has not been loaded"),Yl}function $k(t){return t.views.size===0}function Xd(t,e,n,r){const s=e.source.queryId;if(s!==null){const i=t.views.get(s);return Y(i!=null,"SyncTree gave us an op for an invalid query."),zm(i,e,n,r)}else{let i=[];for(const o of t.views.values())i=i.concat(zm(o,e,n,r));return i}}function jk(t,e,n,r,s){const i=e._queryIdentifier,o=t.views.get(i);if(!o){let a=zl(n,s?r:null),c=!1;a?c=!0:r instanceof ge?(a=Kd(n,r),c=!1):(a=ge.EMPTY_NODE,c=!1);const u=Fc(new ks(a,c,!1),new ks(r,s,!1));return new Dk(e,u)}return o}function qk(t,e,n,r,s,i){const o=jk(t,e,r,s,i);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),Lk(o,n),Vk(o,n)}function Hk(t,e,n,r){const s=e._queryIdentifier,i=[];let o=[];const a=Qr(t);if(s==="default")for(const[c,u]of t.views.entries())o=o.concat(Wm(u,n,r)),Hm(u)&&(t.views.delete(c),u.query._queryParams.loadsAllData()||i.push(u.query));else{const c=t.views.get(s);c&&(o=o.concat(Wm(c,n,r)),Hm(c)&&(t.views.delete(s),c.query._queryParams.loadsAllData()||i.push(c.query)))}return a&&!Qr(t)&&i.push(new(Bk())(e._repo,e._path)),{removed:i,events:o}}function Zw(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function gi(t,e){let n=null;for(const r of t.views.values())n=n||Mk(r,e);return n}function e0(t,e){if(e._queryParams.loadsAllData())return Uc(t);{const r=e._queryIdentifier;return t.views.get(r)}}function t0(t,e){return e0(t,e)!=null}function Qr(t){return Uc(t)!=null}function Uc(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ql;function Wk(t){Y(!Ql,"__referenceConstructor has already been defined"),Ql=t}function zk(){return Y(Ql,"Reference.ts has not been loaded"),Ql}let Gk=1;class Gm{constructor(e){this.listenProvider_=e,this.syncPointTree_=new rt(null),this.pendingWriteTree_=Ek(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function n0(t,e,n,r,s){return uk(t.pendingWriteTree_,e,n,r,s),s?Sa(t,new xs(qw(),e,n)):[]}function li(t,e,n=!1){const r=hk(t.pendingWriteTree_,e);if(dk(t.pendingWriteTree_,e)){let i=new rt(null);return r.snap!=null?i=i.set(je(),!0):rn(r.children,o=>{i=i.set(new Xe(o),!0)}),Sa(t,new Wl(r.path,i,n))}else return[]}function Bc(t,e,n){return Sa(t,new xs(Wd(),e,n))}function Kk(t,e,n){const r=rt.fromObject(n);return Sa(t,new oa(Wd(),e,r))}function Yk(t,e){return Sa(t,new ia(Wd(),e))}function Qk(t,e,n){const r=Zd(t,n);if(r){const s=ef(r),i=s.path,o=s.queryId,a=en(i,e),c=new ia(zd(o),a);return tf(t,i,c)}else return[]}function Vh(t,e,n,r,s=!1){const i=e._path,o=t.syncPointTree_.get(i);let a=[];if(o&&(e._queryIdentifier==="default"||t0(o,e))){const c=Hk(o,e,n,r);$k(o)&&(t.syncPointTree_=t.syncPointTree_.remove(i));const u=c.removed;if(a=c.events,!s){const h=u.findIndex(g=>g._queryParams.loadsAllData())!==-1,f=t.syncPointTree_.findOnPath(i,(g,m)=>Qr(m));if(h&&!f){const g=t.syncPointTree_.subtree(i);if(!g.isEmpty()){const m=Zk(g);for(let C=0;C<m.length;++C){const R=m[C],x=R.query,L=i0(t,R);t.listenProvider_.startListening(Vo(x),Xl(t,x),L.hashFn,L.onComplete)}}}!f&&u.length>0&&!r&&(h?t.listenProvider_.stopListening(Vo(e),null):u.forEach(g=>{const m=t.queryToTagMap.get($c(g));t.listenProvider_.stopListening(Vo(g),m)}))}eN(t,u)}return a}function Xk(t,e,n,r){const s=Zd(t,r);if(s!=null){const i=ef(s),o=i.path,a=i.queryId,c=en(o,e),u=new xs(zd(a),c,n);return tf(t,o,u)}else return[]}function Jk(t,e,n,r){const s=Zd(t,r);if(s){const i=ef(s),o=i.path,a=i.queryId,c=en(o,e),u=rt.fromObject(n),h=new oa(zd(a),c,u);return tf(t,o,h)}else return[]}function Km(t,e,n,r=!1){const s=e._path;let i=null,o=!1;t.syncPointTree_.foreachOnPath(s,(g,m)=>{const C=en(g,s);i=i||gi(m,C),o=o||Qr(m)});let a=t.syncPointTree_.get(s);a?(o=o||Qr(a),i=i||gi(a,je())):(a=new Fk,t.syncPointTree_=t.syncPointTree_.set(s,a));let c;i!=null?c=!0:(c=!1,i=ge.EMPTY_NODE,t.syncPointTree_.subtree(s).foreachChild((m,C)=>{const R=gi(C,je());R&&(i=i.updateImmediateChild(m,R))}));const u=t0(a,e);if(!u&&!e._queryParams.loadsAllData()){const g=$c(e);Y(!t.queryToTagMap.has(g),"View does not exist, but we have a tag");const m=tN();t.queryToTagMap.set(g,m),t.tagToQueryMap.set(m,g)}const h=Gd(t.pendingWriteTree_,s);let f=qk(a,e,n,h,i,c);if(!u&&!o&&!r){const g=e0(a,e);f=f.concat(nN(t,e,g))}return f}function Jd(t,e,n){const s=t.pendingWriteTree_,i=t.syncPointTree_.findOnPath(e,(o,a)=>{const c=en(o,e),u=gi(a,c);if(u)return u});return Gw(s,e,i,n,!0)}function Sa(t,e){return r0(e,t.syncPointTree_,null,Gd(t.pendingWriteTree_,je()))}function r0(t,e,n,r){if(xe(t.path))return s0(t,e,n,r);{const s=e.get(je());n==null&&s!=null&&(n=gi(s,je()));let i=[];const o=Re(t.path),a=t.operationForChild(o),c=e.children.get(o);if(c&&a){const u=n?n.getImmediateChild(o):null,h=Kw(r,o);i=i.concat(r0(a,c,u,h))}return s&&(i=i.concat(Xd(s,t,r,n))),i}}function s0(t,e,n,r){const s=e.get(je());n==null&&s!=null&&(n=gi(s,je()));let i=[];return e.children.inorderTraversal((o,a)=>{const c=n?n.getImmediateChild(o):null,u=Kw(r,o),h=t.operationForChild(o);h&&(i=i.concat(s0(h,a,c,u)))}),s&&(i=i.concat(Xd(s,t,r,n))),i}function i0(t,e){const n=e.query,r=Xl(t,n);return{hashFn:()=>(Ok(e)||ge.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return r?Qk(t,n._path,r):Yk(t,n._path);{const i=XP(s,n);return Vh(t,n,null,i)}}}}function Xl(t,e){const n=$c(e);return t.queryToTagMap.get(n)}function $c(t){return t._path.toString()+"$"+t._queryIdentifier}function Zd(t,e){return t.tagToQueryMap.get(e)}function ef(t){const e=t.indexOf("$");return Y(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new Xe(t.substr(0,e))}}function tf(t,e,n){const r=t.syncPointTree_.get(e);Y(r,"Missing sync point for query tag that we're tracking");const s=Gd(t.pendingWriteTree_,e);return Xd(r,n,s,null)}function Zk(t){return t.fold((e,n,r)=>{if(n&&Qr(n))return[Uc(n)];{let s=[];return n&&(s=Zw(n)),rn(r,(i,o)=>{s=s.concat(o)}),s}})}function Vo(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(zk())(t._repo,t._path):t}function eN(t,e){for(let n=0;n<e.length;++n){const r=e[n];if(!r._queryParams.loadsAllData()){const s=$c(r),i=t.queryToTagMap.get(s);t.queryToTagMap.delete(s),t.tagToQueryMap.delete(i)}}}function tN(){return Gk++}function nN(t,e,n){const r=e._path,s=Xl(t,e),i=i0(t,n),o=t.listenProvider_.startListening(Vo(e),s,i.hashFn,i.onComplete),a=t.syncPointTree_.subtree(r);if(s)Y(!Qr(a.value),"If we're adding a query, it shouldn't be shadowed");else{const c=a.fold((u,h,f)=>{if(!xe(u)&&h&&Qr(h))return[Uc(h).query];{let g=[];return h&&(g=g.concat(Zw(h).map(m=>m.query))),rn(f,(m,C)=>{g=g.concat(C)}),g}});for(let u=0;u<c.length;++u){const h=c[u];t.listenProvider_.stopListening(Vo(h),Xl(t,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new nf(n)}node(){return this.node_}}class rf{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=wt(this.path_,e);return new rf(this.syncTree_,n)}node(){return Jd(this.syncTree_,this.path_)}}const rN=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Ym=function(t,e,n){if(!t||typeof t!="object")return t;if(Y(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return sN(t[".sv"],e,n);if(typeof t[".sv"]=="object")return iN(t[".sv"],e);Y(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},sN=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:Y(!1,"Unexpected server value: "+t)}},iN=function(t,e,n){t.hasOwnProperty("increment")||Y(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const r=t.increment;typeof r!="number"&&Y(!1,"Unexpected increment value: "+r);const s=e.node();if(Y(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return r;const o=s.getValue();return typeof o!="number"?r:o+r},oN=function(t,e,n,r){return sf(e,new rf(n,t),r)},o0=function(t,e,n){return sf(t,new nf(e),n)};function sf(t,e,n){const r=t.getPriority().val(),s=Ym(r,e.getImmediateChild(".priority"),n);let i;if(t.isLeafNode()){const o=t,a=Ym(o.getValue(),e,n);return a!==o.getValue()||s!==o.getPriority().val()?new Ct(a,kt(s)):t}else{const o=t;return i=o,s!==o.getPriority().val()&&(i=i.updatePriority(new Ct(s))),o.forEachChild(lt,(a,c)=>{const u=sf(c,e.getImmediateChild(a),n);u!==c&&(i=i.updateImmediateChild(a,u))}),i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{constructor(e="",n=null,r={children:{},childCount:0}){this.name=e,this.parent=n,this.node=r}}function jc(t,e){let n=e instanceof Xe?e:new Xe(e),r=t,s=Re(n);for(;s!==null;){const i=Ss(r.node.children,s)||{children:{},childCount:0};r=new of(s,r,i),n=Je(n),s=Re(n)}return r}function qs(t){return t.node.value}function af(t,e){t.node.value=e,Fh(t)}function a0(t){return t.node.childCount>0}function aN(t){return qs(t)===void 0&&!a0(t)}function qc(t,e){rn(t.node.children,(n,r)=>{e(new of(n,t,r))})}function l0(t,e,n,r){n&&!r&&e(t),qc(t,s=>{l0(s,e,!0,r)}),n&&r&&e(t)}function lN(t,e,n){let r=t.parent;for(;r!==null;){if(e(r))return!0;r=r.parent}return!1}function Ra(t){return new Xe(t.parent===null?t.name:Ra(t.parent)+"/"+t.name)}function Fh(t){t.parent!==null&&cN(t.parent,t.name,t)}function cN(t,e,n){const r=aN(n),s=Vn(t.node.children,e);r&&s?(delete t.node.children[e],t.node.childCount--,Fh(t)):!r&&!s&&(t.node.children[e]=n.node,t.node.childCount++,Fh(t))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uN=/[\[\].#$\/\u0000-\u001F\u007F]/,hN=/[\[\].#$\u0000-\u001F\u007F]/,zu=10*1024*1024,c0=function(t){return typeof t=="string"&&t.length!==0&&!uN.test(t)},u0=function(t){return typeof t=="string"&&t.length!==0&&!hN.test(t)},dN=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),u0(t)},fN=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!Md(t)||t&&typeof t=="object"&&Vn(t,".sv")},lf=function(t,e,n){const r=n instanceof Xe?new xx(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+ps(r));if(typeof e=="function")throw new Error(t+"contains a function "+ps(r)+" with contents = "+e.toString());if(Md(e))throw new Error(t+"contains "+e.toString()+" "+ps(r));if(typeof e=="string"&&e.length>zu/3&&Lc(e)>zu)throw new Error(t+"contains a string greater than "+zu+" utf8 bytes "+ps(r)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,i=!1;if(rn(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(i=!0,!c0(o)))throw new Error(t+" contains an invalid key ("+o+") "+ps(r)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);kx(r,o),lf(t,a,r),Nx(r)}),s&&i)throw new Error(t+' contains ".value" child '+ps(r)+" in addition to actual children.")}},h0=function(t,e,n,r){if(!u0(n))throw new Error(ew(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},pN=function(t,e,n,r){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),h0(t,e,n)},gN=function(t,e){if(Re(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},mN=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!c0(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!dN(n))throw new Error(ew(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _N{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function d0(t,e){let n=null;for(let r=0;r<e.length;r++){const s=e[r],i=s.getPath();n!==null&&!Bd(i,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:i}),n.events.push(s)}n&&t.eventLists_.push(n)}function f0(t,e,n){d0(t,n),p0(t,r=>Bd(r,e))}function ns(t,e,n){d0(t,n),p0(t,r=>Rn(r,e)||Rn(e,r))}function p0(t,e){t.recursionDepth_++;let n=!0;for(let r=0;r<t.eventLists_.length;r++){const s=t.eventLists_[r];if(s){const i=s.path;e(i)?(yN(t.eventLists_[r]),t.eventLists_[r]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function yN(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const r=n.getEventRunner();Do&&jt("event: "+n.toString()),Ca(r)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vN="repo_interrupt",wN=25;class EN{constructor(e,n,r,s){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=r,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new _N,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Hl(),this.transactionQueueTree_=new of,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function bN(t,e,n){if(t.stats_=Fd(t.repoInfo_),t.forceRestClient_||tx())t.server_=new ql(t.repoInfo_,(r,s,i,o)=>{Qm(t,r,s,i,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>Xm(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Rt(n)}catch(r){throw new Error("Invalid authOverride provided: "+r)}}t.persistentConnection_=new lr(t.repoInfo_,e,(r,s,i,o)=>{Qm(t,r,s,i,o)},r=>{Xm(t,r)},r=>{TN(t,r)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(r=>{t.server_.refreshAuthToken(r)}),t.appCheckProvider_.addTokenChangeListener(r=>{t.server_.refreshAppCheckToken(r.token)}),t.statsReporter_=ox(t.repoInfo_,()=>new sk(t.stats_,t.server_)),t.infoData_=new Zx,t.infoSyncTree_=new Gm({startListening:(r,s,i,o)=>{let a=[];const c=t.infoData_.getNode(r._path);return c.isEmpty()||(a=Bc(t.infoSyncTree_,r._path,c),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),uf(t,"connected",!1),t.serverSyncTree_=new Gm({startListening:(r,s,i,o)=>(t.server_.listen(r,i,s,(a,c)=>{const u=o(a,c);ns(t.eventQueue_,r._path,u)}),[]),stopListening:(r,s)=>{t.server_.unlisten(r,s)}})}function IN(t){const n=t.infoData_.getNode(new Xe(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function cf(t){return rN({timestamp:IN(t)})}function Qm(t,e,n,r,s){t.dataUpdateCount++;const i=new Xe(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(s)if(r){const c=Fl(n,u=>kt(u));o=Jk(t.serverSyncTree_,i,c,s)}else{const c=kt(n);o=Xk(t.serverSyncTree_,i,c,s)}else if(r){const c=Fl(n,u=>kt(u));o=Kk(t.serverSyncTree_,i,c)}else{const c=kt(n);o=Bc(t.serverSyncTree_,i,c)}let a=i;o.length>0&&(a=ff(t,i)),ns(t.eventQueue_,a,o)}function Xm(t,e){uf(t,"connected",e),e===!1&&CN(t)}function TN(t,e){rn(e,(n,r)=>{uf(t,n,r)})}function uf(t,e,n){const r=new Xe("/.info/"+e),s=kt(n);t.infoData_.updateSnapshot(r,s);const i=Bc(t.infoSyncTree_,r,s);ns(t.eventQueue_,r,i)}function g0(t){return t.nextWriteId_++}function CN(t){hf(t,"onDisconnectEvents");const e=cf(t),n=Hl();kh(t.onDisconnect_,je(),(s,i)=>{const o=oN(s,i,t.serverSyncTree_,e);jw(n,s,o)});let r=[];kh(n,je(),(s,i)=>{r=r.concat(Bc(t.serverSyncTree_,s,i));const o=NN(t,s);ff(t,o)}),t.onDisconnect_=Hl(),ns(t.eventQueue_,je(),r)}function AN(t,e,n){let r;Re(e._path)===".info"?r=Km(t.infoSyncTree_,e,n):r=Km(t.serverSyncTree_,e,n),f0(t.eventQueue_,e._path,r)}function SN(t,e,n){let r;Re(e._path)===".info"?r=Vh(t.infoSyncTree_,e,n):r=Vh(t.serverSyncTree_,e,n),f0(t.eventQueue_,e._path,r)}function RN(t){t.persistentConnection_&&t.persistentConnection_.interrupt(vN)}function hf(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),jt(n,...e)}function PN(t,e,n,r,s,i){hf(t,"transaction on "+e);const o={path:e,update:n,onComplete:r,status:null,order:uw(),applyLocally:i,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=df(t,e,void 0);o.currentInputSnapshot=a;const c=o.update(a.val());if(c===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{lf("transaction failed: Data returned ",c,o.path),o.status=0;const u=jc(t.transactionQueueTree_,e),h=qs(u)||[];h.push(o),af(u,h);let f;typeof c=="object"&&c!==null&&Vn(c,".priority")?(f=Ss(c,".priority"),Y(fN(f),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):f=(Jd(t.serverSyncTree_,e)||ge.EMPTY_NODE).getPriority().val();const g=cf(t),m=kt(c,f),C=o0(m,a,g);o.currentOutputSnapshotRaw=m,o.currentOutputSnapshotResolved=C,o.currentWriteId=g0(t);const R=n0(t.serverSyncTree_,e,C,o.currentWriteId,o.applyLocally);ns(t.eventQueue_,e,R),Hc(t,t.transactionQueueTree_)}}function df(t,e,n){return Jd(t.serverSyncTree_,e,n)||ge.EMPTY_NODE}function Hc(t,e=t.transactionQueueTree_){if(e||Wc(t,e),qs(e)){const n=_0(t,e);Y(n.length>0,"Sending zero length transaction queue"),n.every(s=>s.status===0)&&xN(t,Ra(e),n)}else a0(e)&&qc(e,n=>{Hc(t,n)})}function xN(t,e,n){const r=n.map(u=>u.currentWriteId),s=df(t,e,r);let i=s;const o=s.hash();for(let u=0;u<n.length;u++){const h=n[u];Y(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const f=en(e,h.path);i=i.updateChild(f,h.currentOutputSnapshotRaw)}const a=i.val(!0),c=e;t.server_.put(c.toString(),a,u=>{hf(t,"transaction put response",{path:c.toString(),status:u});let h=[];if(u==="ok"){const f=[];for(let g=0;g<n.length;g++)n[g].status=2,h=h.concat(li(t.serverSyncTree_,n[g].currentWriteId)),n[g].onComplete&&f.push(()=>n[g].onComplete(null,!0,n[g].currentOutputSnapshotResolved)),n[g].unwatcher();Wc(t,jc(t.transactionQueueTree_,e)),Hc(t,t.transactionQueueTree_),ns(t.eventQueue_,e,h);for(let g=0;g<f.length;g++)Ca(f[g])}else{if(u==="datastale")for(let f=0;f<n.length;f++)n[f].status===3?n[f].status=4:n[f].status=0;else{ln("transaction at "+c.toString()+" failed: "+u);for(let f=0;f<n.length;f++)n[f].status=4,n[f].abortReason=u}ff(t,e)}},o)}function ff(t,e){const n=m0(t,e),r=Ra(n),s=_0(t,n);return kN(t,s,r),r}function kN(t,e,n){if(e.length===0)return;const r=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const c=e[a],u=en(n,c.path);let h=!1,f;if(Y(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)h=!0,f=c.abortReason,s=s.concat(li(t.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=wN)h=!0,f="maxretry",s=s.concat(li(t.serverSyncTree_,c.currentWriteId,!0));else{const g=df(t,c.path,o);c.currentInputSnapshot=g;const m=e[a].update(g.val());if(m!==void 0){lf("transaction failed: Data returned ",m,c.path);let C=kt(m);typeof m=="object"&&m!=null&&Vn(m,".priority")||(C=C.updatePriority(g.getPriority()));const x=c.currentWriteId,L=cf(t),F=o0(C,g,L);c.currentOutputSnapshotRaw=C,c.currentOutputSnapshotResolved=F,c.currentWriteId=g0(t),o.splice(o.indexOf(x),1),s=s.concat(n0(t.serverSyncTree_,c.path,F,c.currentWriteId,c.applyLocally)),s=s.concat(li(t.serverSyncTree_,x,!0))}else h=!0,f="nodata",s=s.concat(li(t.serverSyncTree_,c.currentWriteId,!0))}ns(t.eventQueue_,n,s),s=[],h&&(e[a].status=2,function(g){setTimeout(g,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(f==="nodata"?r.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):r.push(()=>e[a].onComplete(new Error(f),!1,null))))}Wc(t,t.transactionQueueTree_);for(let a=0;a<r.length;a++)Ca(r[a]);Hc(t,t.transactionQueueTree_)}function m0(t,e){let n,r=t.transactionQueueTree_;for(n=Re(e);n!==null&&qs(r)===void 0;)r=jc(r,n),e=Je(e),n=Re(e);return r}function _0(t,e){const n=[];return y0(t,e,n),n.sort((r,s)=>r.order-s.order),n}function y0(t,e,n){const r=qs(e);if(r)for(let s=0;s<r.length;s++)n.push(r[s]);qc(e,s=>{y0(t,s,n)})}function Wc(t,e){const n=qs(e);if(n){let r=0;for(let s=0;s<n.length;s++)n[s].status!==2&&(n[r]=n[s],r++);n.length=r,af(e,n.length>0?n:void 0)}qc(e,r=>{Wc(t,r)})}function NN(t,e){const n=Ra(m0(t,e)),r=jc(t.transactionQueueTree_,e);return lN(r,s=>{Gu(t,s)}),Gu(t,r),l0(r,s=>{Gu(t,s)}),n}function Gu(t,e){const n=qs(e);if(n){const r=[];let s=[],i=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(Y(i===o-1,"All SENT items should be at beginning of queue."),i=o,n[o].status=3,n[o].abortReason="set"):(Y(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),s=s.concat(li(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&r.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));i===-1?af(e,void 0):n.length=i+1,ns(t.eventQueue_,Ra(e),s);for(let o=0;o<r.length;o++)Ca(r[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DN(t){let e="";const n=t.split("/");for(let r=0;r<n.length;r++)if(n[r].length>0){let s=n[r];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function ON(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const r=n.split("=");r.length===2?e[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):ln(`Invalid query segment '${n}' in query '${t}'`)}return e}const Jm=function(t,e){const n=MN(t),r=n.namespace;n.domain==="firebase.com"&&hr(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!r||r==="undefined")&&n.domain!=="localhost"&&hr("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||zP();const s=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new Iw(n.host,n.secure,r,s,e,"",r!==n.subdomain),path:new Xe(n.pathString)}},MN=function(t){let e="",n="",r="",s="",i="",o=!0,a="https",c=443;if(typeof t=="string"){let u=t.indexOf("//");u>=0&&(a=t.substring(0,u-1),t=t.substring(u+2));let h=t.indexOf("/");h===-1&&(h=t.length);let f=t.indexOf("?");f===-1&&(f=t.length),e=t.substring(0,Math.min(h,f)),h<f&&(s=DN(t.substring(h,f)));const g=ON(t.substring(Math.min(t.length,f)));u=e.indexOf(":"),u>=0?(o=a==="https"||a==="wss",c=parseInt(e.substring(u+1),10)):u=e.length;const m=e.slice(0,u);if(m.toLowerCase()==="localhost")n="localhost";else if(m.split(".").length<=2)n=m;else{const C=e.indexOf(".");r=e.substring(0,C).toLowerCase(),n=e.substring(C+1),i=r}"ns"in g&&(i=g.ns)}return{host:e,port:c,domain:n,subdomain:r,secure:o,scheme:a,pathString:s,namespace:i}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LN{constructor(e,n,r,s){this.eventType=e,this.eventRegistration=n,this.snapshot=r,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Rt(this.snapshot.exportVal())}}class VN{constructor(e,n,r){this.eventRegistration=e,this.error=n,this.path=r}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FN{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return Y(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{constructor(e,n,r,s){this._repo=e,this._path=n,this._queryParams=r,this._orderByCalled=s}get key(){return xe(this._path)?null:Nw(this._path)}get ref(){return new _r(this._repo,this._path)}get _queryIdentifier(){const e=Lm(this._queryParams),n=Ld(e);return n==="{}"?"default":n}get _queryObject(){return Lm(this._queryParams)}isEqual(e){if(e=ft(e),!(e instanceof pf))return!1;const n=this._repo===e._repo,r=Bd(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return n&&r&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+Px(this._path)}}class _r extends pf{constructor(e,n){super(e,n,new Hd,!1)}get parent(){const e=Ow(this._path);return e===null?null:new _r(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class aa{constructor(e,n,r){this._node=e,this.ref=n,this._index=r}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new Xe(e),r=Uh(this.ref,e);return new aa(this._node.getChild(n),r,lt)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(r,s)=>e(new aa(s,Uh(this.ref,r),lt)))}hasChild(e){const n=new Xe(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function UN(t,e){return t=ft(t),t._checkNotDeleted("ref"),Uh(t._root,e)}function Uh(t,e){return t=ft(t),Re(t._path)===null?pN("child","path",e):h0("child","path",e),new _r(t._repo,wt(t._path,e))}class gf{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const r=n._queryParams.getIndex();return new LN("value",this,new aa(e.snapshotNode,new _r(n._repo,n._path),r))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new VN(this,e,n):null}matches(e){return e instanceof gf?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function BN(t,e,n,r,s){const i=new FN(n,void 0),o=new gf(i);return AN(t._repo,t,o),()=>SN(t._repo,t,o)}function v0(t,e,n,r){return BN(t,"value",e)}Uk(_r);Wk(_r);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $N="FIREBASE_DATABASE_EMULATOR_HOST",Bh={};let jN=!1;function qN(t,e,n,r){t.repoInfo_=new Iw(`${e}:${n}`,!1,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0),r&&(t.authTokenProvider_=r)}function HN(t,e,n,r,s){let i=r||t.options.databaseURL;i===void 0&&(t.options.projectId||hr("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),jt("Using default host for project ",t.options.projectId),i=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=Jm(i,s),a=o.repoInfo,c;typeof process<"u"&&ym&&(c=ym[$N]),c?(i=`http://${c}?ns=${a.namespace}`,o=Jm(i,s),a=o.repoInfo):o.repoInfo.secure;const u=new rx(t.name,t.options,e);mN("Invalid Firebase Database URL",o),xe(o.path)||hr("Database URL must point to the root of a Firebase Database (not including a child path).");const h=zN(a,t,u,new nx(t.name,n));return new GN(h,t)}function WN(t,e){const n=Bh[e];(!n||n[t.key]!==t)&&hr(`Database ${e}(${t.repoInfo_}) has already been deleted.`),RN(t),delete n[t.key]}function zN(t,e,n,r){let s=Bh[e.name];s||(s={},Bh[e.name]=s);let i=s[t.toURLString()];return i&&hr("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),i=new EN(t,jN,n,r),s[t.toURLString()]=i,i}class GN{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(bN(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new _r(this._repo,je())),this._rootInternal}_delete(){return this._rootInternal!==null&&(WN(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&hr("Cannot call "+e+" on a deleted database.")}}function KN(t=ba(),e){const n=mr(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const r=Nd("database");r&&YN(n,...r)}return n}function YN(t,e,n,r={}){t=ft(t),t._checkNotDeleted("useEmulator"),t._instanceStarted&&hr("Cannot call useEmulator() after instance has already been initialized.");const s=t._repoInternal;let i;if(s.repoInfo_.nodeAdmin)r.mockUserToken&&hr('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),i=new vl(vl.OWNER);else if(r.mockUserToken){const o=typeof r.mockUserToken=="string"?r.mockUserToken:Gv(r.mockUserToken,t.app.options.projectId);i=new vl(o)}qN(s,e,n,i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QN(t){$P($s),vn(new un("database",(e,{instanceIdentifier:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),i=e.getProvider("app-check-internal");return HN(r,s,i,n)},"PUBLIC").setMultipleInstances(!0)),Wt(vm,wm,t),Wt(vm,wm,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XN{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function JN(t,e,n){var r;if(t=ft(t),gN("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const s=(r=void 0)!==null&&r!==void 0?r:!0,i=new Mc,o=(c,u,h)=>{let f=null;c?i.reject(c):(f=new aa(h,new _r(t._repo,t._path),lt),i.resolve(new XN(u,f)))},a=v0(t,()=>{});return PN(t._repo,t._path,e,o,a,s),i.promise}lr.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};lr.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};QN();var ZN="firebase",eD="10.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Wt(ZN,eD,"app");const w0="@firebase/installations",mf="0.6.7";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E0=1e4,b0=`w:${mf}`,I0="FIS_v2",tD="https://firebaseinstallations.googleapis.com/v1",nD=60*60*1e3,rD="installations",sD="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iD={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Ds=new Bs(rD,sD,iD);function T0(t){return t instanceof En&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C0({projectId:t}){return`${tD}/projects/${t}/installations`}function A0(t){return{token:t.token,requestStatus:2,expiresIn:aD(t.expiresIn),creationTime:Date.now()}}async function S0(t,e){const r=(await e.json()).error;return Ds.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function R0({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function oD(t,{refreshToken:e}){const n=R0(t);return n.append("Authorization",lD(e)),n}async function P0(t){const e=await t();return e.status>=500&&e.status<600?t():e}function aD(t){return Number(t.replace("s","000"))}function lD(t){return`${I0} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cD({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=C0(t),s=R0(t),i=e.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const o={fid:n,authVersion:I0,appId:t.appId,sdkVersion:b0},a={method:"POST",headers:s,body:JSON.stringify(o)},c=await P0(()=>fetch(r,a));if(c.ok){const u=await c.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:A0(u.authToken)}}else throw await S0("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x0(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uD(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hD=/^[cdef][\w-]{21}$/,$h="";function dD(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=fD(t);return hD.test(n)?n:$h}catch{return $h}}function fD(t){return uD(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k0=new Map;function N0(t,e){const n=zc(t);D0(n,e),pD(n,e)}function D0(t,e){const n=k0.get(t);if(n)for(const r of n)r(e)}function pD(t,e){const n=gD();n&&n.postMessage({key:t,fid:e}),mD()}let ws=null;function gD(){return!ws&&"BroadcastChannel"in self&&(ws=new BroadcastChannel("[Firebase] FID Change"),ws.onmessage=t=>{D0(t.data.key,t.data.fid)}),ws}function mD(){k0.size===0&&ws&&(ws.close(),ws=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _D="firebase-installations-database",yD=1,Os="firebase-installations-store";let Ku=null;function _f(){return Ku||(Ku=sw(_D,yD,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Os)}}})),Ku}async function Jl(t,e){const n=zc(t),s=(await _f()).transaction(Os,"readwrite"),i=s.objectStore(Os),o=await i.get(n);return await i.put(e,n),await s.done,(!o||o.fid!==e.fid)&&N0(t,e.fid),e}async function O0(t){const e=zc(t),r=(await _f()).transaction(Os,"readwrite");await r.objectStore(Os).delete(e),await r.done}async function Gc(t,e){const n=zc(t),s=(await _f()).transaction(Os,"readwrite"),i=s.objectStore(Os),o=await i.get(n),a=e(o);return a===void 0?await i.delete(n):await i.put(a,n),await s.done,a&&(!o||o.fid!==a.fid)&&N0(t,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yf(t){let e;const n=await Gc(t.appConfig,r=>{const s=vD(r),i=wD(t,s);return e=i.registrationPromise,i.installationEntry});return n.fid===$h?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function vD(t){const e=t||{fid:dD(),registrationStatus:0};return M0(e)}function wD(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Ds.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=ED(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:bD(t)}:{installationEntry:e}}async function ED(t,e){try{const n=await cD(t,e);return Jl(t.appConfig,n)}catch(n){throw T0(n)&&n.customData.serverCode===409?await O0(t.appConfig):await Jl(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function bD(t){let e=await Zm(t.appConfig);for(;e.registrationStatus===1;)await x0(100),e=await Zm(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await yf(t);return r||n}return e}function Zm(t){return Gc(t,e=>{if(!e)throw Ds.create("installation-not-found");return M0(e)})}function M0(t){return ID(t)?{fid:t.fid,registrationStatus:0}:t}function ID(t){return t.registrationStatus===1&&t.registrationTime+E0<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TD({appConfig:t,heartbeatServiceProvider:e},n){const r=CD(t,n),s=oD(t,n),i=e.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const o={installation:{sdkVersion:b0,appId:t.appId}},a={method:"POST",headers:s,body:JSON.stringify(o)},c=await P0(()=>fetch(r,a));if(c.ok){const u=await c.json();return A0(u)}else throw await S0("Generate Auth Token",c)}function CD(t,{fid:e}){return`${C0(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vf(t,e=!1){let n;const r=await Gc(t.appConfig,i=>{if(!L0(i))throw Ds.create("not-registered");const o=i.authToken;if(!e&&RD(o))return i;if(o.requestStatus===1)return n=AD(t,e),i;{if(!navigator.onLine)throw Ds.create("app-offline");const a=xD(i);return n=SD(t,a),a}});return n?await n:r.authToken}async function AD(t,e){let n=await e_(t.appConfig);for(;n.authToken.requestStatus===1;)await x0(100),n=await e_(t.appConfig);const r=n.authToken;return r.requestStatus===0?vf(t,e):r}function e_(t){return Gc(t,e=>{if(!L0(e))throw Ds.create("not-registered");const n=e.authToken;return kD(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function SD(t,e){try{const n=await TD(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await Jl(t.appConfig,r),n}catch(n){if(T0(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await O0(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Jl(t.appConfig,r)}throw n}}function L0(t){return t!==void 0&&t.registrationStatus===2}function RD(t){return t.requestStatus===2&&!PD(t)}function PD(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+nD}function xD(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function kD(t){return t.requestStatus===1&&t.requestTime+E0<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ND(t){const e=t,{installationEntry:n,registrationPromise:r}=await yf(e);return r?r.catch(console.error):vf(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DD(t,e=!1){const n=t;return await OD(n),(await vf(n,e)).token}async function OD(t){const{registrationPromise:e}=await yf(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MD(t){if(!t||!t.options)throw Yu("App Configuration");if(!t.name)throw Yu("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw Yu(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function Yu(t){return Ds.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V0="installations",LD="installations-internal",VD=t=>{const e=t.getProvider("app").getImmediate(),n=MD(e),r=mr(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},FD=t=>{const e=t.getProvider("app").getImmediate(),n=mr(e,V0).getImmediate();return{getId:()=>ND(n),getToken:s=>DD(n,s)}};function UD(){vn(new un(V0,VD,"PUBLIC")),vn(new un(LD,FD,"PRIVATE"))}UD();Wt(w0,mf);Wt(w0,mf,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl="analytics",BD="firebase_id",$D="origin",jD=60*1e3,qD="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",wf="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tn=new Ea("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HD={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},cn=new Bs("analytics","Analytics",HD);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WD(t){if(!t.startsWith(wf)){const e=cn.create("invalid-gtag-resource",{gtagURL:t});return tn.warn(e.message),""}return t}function F0(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function zD(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function GD(t,e){const n=zD("firebase-js-sdk-policy",{createScriptURL:WD}),r=document.createElement("script"),s=`${wf}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function KD(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function YD(t,e,n,r,s,i){const o=r[s];try{if(o)await e[o];else{const c=(await F0(n)).find(u=>u.measurementId===s);c&&await e[c.appId]}}catch(a){tn.error(a)}t("config",s,i)}async function QD(t,e,n,r,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const a=await F0(n);for(const c of o){const u=a.find(f=>f.measurementId===c),h=u&&e[u.appId];if(h)i.push(h);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),t("event",r,s||{})}catch(i){tn.error(i)}}function XD(t,e,n,r){async function s(i,...o){try{if(i==="event"){const[a,c]=o;await QD(t,e,n,a,c)}else if(i==="config"){const[a,c]=o;await YD(t,e,n,r,a,c)}else if(i==="consent"){const[a]=o;t("consent","update",a)}else if(i==="get"){const[a,c,u]=o;t("get",a,c,u)}else if(i==="set"){const[a]=o;t("set",a)}else t(i,...o)}catch(a){tn.error(a)}}return s}function JD(t,e,n,r,s){let i=function(...o){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=XD(i,t,e,n),{gtagCore:i,wrappedGtag:window[s]}}function ZD(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(wf)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eO=30,tO=1e3;class nO{constructor(e={},n=tO){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const U0=new nO;function rO(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function sO(t){var e;const{appId:n,apiKey:r}=t,s={method:"GET",headers:rO(r)},i=qD.replace("{app-id}",n),o=await fetch(i,s);if(o.status!==200&&o.status!==304){let a="";try{const c=await o.json();!((e=c.error)===null||e===void 0)&&e.message&&(a=c.error.message)}catch{}throw cn.create("config-fetch-failed",{httpStatus:o.status,responseMessage:a})}return o.json()}async function iO(t,e=U0,n){const{appId:r,apiKey:s,measurementId:i}=t.options;if(!r)throw cn.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:r};throw cn.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new lO;return setTimeout(async()=>{a.abort()},jD),B0({appId:r,apiKey:s,measurementId:i},o,a,e)}async function B0(t,{throttleEndTimeMillis:e,backoffCount:n},r,s=U0){var i;const{appId:o,measurementId:a}=t;try{await oO(r,e)}catch(c){if(a)return tn.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:a};throw c}try{const c=await sO(t);return s.deleteThrottleMetadata(o),c}catch(c){const u=c;if(!aO(u)){if(s.deleteThrottleMetadata(o),a)return tn.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:o,measurementId:a};throw c}const h=Number((i=u==null?void 0:u.customData)===null||i===void 0?void 0:i.httpStatus)===503?cm(n,s.intervalMillis,eO):cm(n,s.intervalMillis),f={throttleEndTimeMillis:Date.now()+h,backoffCount:n+1};return s.setThrottleMetadata(o,f),tn.debug(`Calling attemptFetch again in ${h} millis`),B0(t,f,r,s)}}function oO(t,e){return new Promise((n,r)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(n,s);t.addEventListener(()=>{clearTimeout(i),r(cn.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function aO(t){if(!(t instanceof En)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class lO{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function cO(t,e,n,r,s){if(s&&s.global){t("event",n,r);return}else{const i=await e,o=Object.assign(Object.assign({},r),{send_to:i});t("event",n,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uO(){if(Xv())try{await Jv()}catch(t){return tn.warn(cn.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return tn.warn(cn.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function hO(t,e,n,r,s,i,o){var a;const c=iO(t);c.then(m=>{n[m.measurementId]=m.appId,t.options.measurementId&&m.measurementId!==t.options.measurementId&&tn.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${m.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(m=>tn.error(m)),e.push(c);const u=uO().then(m=>{if(m)return r.getId()}),[h,f]=await Promise.all([c,u]);ZD(i)||GD(i,h.measurementId),s("js",new Date);const g=(a=o==null?void 0:o.config)!==null&&a!==void 0?a:{};return g[$D]="firebase",g.update=!0,f!=null&&(g[BD]=f),s("config",h.measurementId,g),h.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dO{constructor(e){this.app=e}_delete(){return delete Fo[this.app.options.appId],Promise.resolve()}}let Fo={},t_=[];const n_={};let Qu="dataLayer",fO="gtag",r_,$0,s_=!1;function pO(){const t=[];if(Kv()&&t.push("This is a browser extension environment."),v1()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,s)=>`(${s+1}) ${r}`).join(" "),n=cn.create("invalid-analytics-context",{errorInfo:e});tn.warn(n.message)}}function gO(t,e,n){pO();const r=t.options.appId;if(!r)throw cn.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)tn.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw cn.create("no-api-key");if(Fo[r]!=null)throw cn.create("already-exists",{id:r});if(!s_){KD(Qu);const{wrappedGtag:i,gtagCore:o}=JD(Fo,t_,n_,Qu,fO);$0=i,r_=o,s_=!0}return Fo[r]=hO(t,t_,n_,e,r_,Qu,n),new dO(t)}function mO(t=ba()){t=ft(t);const e=mr(t,Zl);return e.isInitialized()?e.getImmediate():_O(t)}function _O(t,e={}){const n=mr(t,Zl);if(n.isInitialized()){const s=n.getImmediate();if(Zo(e,n.getOptions()))return s;throw cn.create("already-initialized")}return n.initialize({options:e})}function yO(t,e,n,r){t=ft(t),cO($0,Fo[t.app.options.appId],e,n,r).catch(s=>tn.error(s))}const i_="@firebase/analytics",o_="0.10.3";function vO(){vn(new un(Zl,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return gO(r,s,n)},"PUBLIC")),vn(new un("analytics-internal",t,"PRIVATE")),Wt(i_,o_),Wt(i_,o_,"esm2017");function t(e){try{const n=e.getProvider(Zl).getImmediate();return{logEvent:(r,s,i)=>yO(n,r,s,i)}}catch(n){throw cn.create("interop-component-reg-failed",{reason:n})}}}vO();var a_=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var As,j0;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,y){function v(){}v.prototype=y.prototype,A.D=y.prototype,A.prototype=new v,A.prototype.constructor=A,A.C=function(T,S,b){for(var E=Array(arguments.length-2),De=2;De<arguments.length;De++)E[De-2]=arguments[De];return y.prototype[S].apply(T,E)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,y,v){v||(v=0);var T=Array(16);if(typeof y=="string")for(var S=0;16>S;++S)T[S]=y.charCodeAt(v++)|y.charCodeAt(v++)<<8|y.charCodeAt(v++)<<16|y.charCodeAt(v++)<<24;else for(S=0;16>S;++S)T[S]=y[v++]|y[v++]<<8|y[v++]<<16|y[v++]<<24;y=A.g[0],v=A.g[1],S=A.g[2];var b=A.g[3],E=y+(b^v&(S^b))+T[0]+3614090360&4294967295;y=v+(E<<7&4294967295|E>>>25),E=b+(S^y&(v^S))+T[1]+3905402710&4294967295,b=y+(E<<12&4294967295|E>>>20),E=S+(v^b&(y^v))+T[2]+606105819&4294967295,S=b+(E<<17&4294967295|E>>>15),E=v+(y^S&(b^y))+T[3]+3250441966&4294967295,v=S+(E<<22&4294967295|E>>>10),E=y+(b^v&(S^b))+T[4]+4118548399&4294967295,y=v+(E<<7&4294967295|E>>>25),E=b+(S^y&(v^S))+T[5]+1200080426&4294967295,b=y+(E<<12&4294967295|E>>>20),E=S+(v^b&(y^v))+T[6]+2821735955&4294967295,S=b+(E<<17&4294967295|E>>>15),E=v+(y^S&(b^y))+T[7]+4249261313&4294967295,v=S+(E<<22&4294967295|E>>>10),E=y+(b^v&(S^b))+T[8]+1770035416&4294967295,y=v+(E<<7&4294967295|E>>>25),E=b+(S^y&(v^S))+T[9]+2336552879&4294967295,b=y+(E<<12&4294967295|E>>>20),E=S+(v^b&(y^v))+T[10]+4294925233&4294967295,S=b+(E<<17&4294967295|E>>>15),E=v+(y^S&(b^y))+T[11]+2304563134&4294967295,v=S+(E<<22&4294967295|E>>>10),E=y+(b^v&(S^b))+T[12]+1804603682&4294967295,y=v+(E<<7&4294967295|E>>>25),E=b+(S^y&(v^S))+T[13]+4254626195&4294967295,b=y+(E<<12&4294967295|E>>>20),E=S+(v^b&(y^v))+T[14]+2792965006&4294967295,S=b+(E<<17&4294967295|E>>>15),E=v+(y^S&(b^y))+T[15]+1236535329&4294967295,v=S+(E<<22&4294967295|E>>>10),E=y+(S^b&(v^S))+T[1]+4129170786&4294967295,y=v+(E<<5&4294967295|E>>>27),E=b+(v^S&(y^v))+T[6]+3225465664&4294967295,b=y+(E<<9&4294967295|E>>>23),E=S+(y^v&(b^y))+T[11]+643717713&4294967295,S=b+(E<<14&4294967295|E>>>18),E=v+(b^y&(S^b))+T[0]+3921069994&4294967295,v=S+(E<<20&4294967295|E>>>12),E=y+(S^b&(v^S))+T[5]+3593408605&4294967295,y=v+(E<<5&4294967295|E>>>27),E=b+(v^S&(y^v))+T[10]+38016083&4294967295,b=y+(E<<9&4294967295|E>>>23),E=S+(y^v&(b^y))+T[15]+3634488961&4294967295,S=b+(E<<14&4294967295|E>>>18),E=v+(b^y&(S^b))+T[4]+3889429448&4294967295,v=S+(E<<20&4294967295|E>>>12),E=y+(S^b&(v^S))+T[9]+568446438&4294967295,y=v+(E<<5&4294967295|E>>>27),E=b+(v^S&(y^v))+T[14]+3275163606&4294967295,b=y+(E<<9&4294967295|E>>>23),E=S+(y^v&(b^y))+T[3]+4107603335&4294967295,S=b+(E<<14&4294967295|E>>>18),E=v+(b^y&(S^b))+T[8]+1163531501&4294967295,v=S+(E<<20&4294967295|E>>>12),E=y+(S^b&(v^S))+T[13]+2850285829&4294967295,y=v+(E<<5&4294967295|E>>>27),E=b+(v^S&(y^v))+T[2]+4243563512&4294967295,b=y+(E<<9&4294967295|E>>>23),E=S+(y^v&(b^y))+T[7]+1735328473&4294967295,S=b+(E<<14&4294967295|E>>>18),E=v+(b^y&(S^b))+T[12]+2368359562&4294967295,v=S+(E<<20&4294967295|E>>>12),E=y+(v^S^b)+T[5]+4294588738&4294967295,y=v+(E<<4&4294967295|E>>>28),E=b+(y^v^S)+T[8]+2272392833&4294967295,b=y+(E<<11&4294967295|E>>>21),E=S+(b^y^v)+T[11]+1839030562&4294967295,S=b+(E<<16&4294967295|E>>>16),E=v+(S^b^y)+T[14]+4259657740&4294967295,v=S+(E<<23&4294967295|E>>>9),E=y+(v^S^b)+T[1]+2763975236&4294967295,y=v+(E<<4&4294967295|E>>>28),E=b+(y^v^S)+T[4]+1272893353&4294967295,b=y+(E<<11&4294967295|E>>>21),E=S+(b^y^v)+T[7]+4139469664&4294967295,S=b+(E<<16&4294967295|E>>>16),E=v+(S^b^y)+T[10]+3200236656&4294967295,v=S+(E<<23&4294967295|E>>>9),E=y+(v^S^b)+T[13]+681279174&4294967295,y=v+(E<<4&4294967295|E>>>28),E=b+(y^v^S)+T[0]+3936430074&4294967295,b=y+(E<<11&4294967295|E>>>21),E=S+(b^y^v)+T[3]+3572445317&4294967295,S=b+(E<<16&4294967295|E>>>16),E=v+(S^b^y)+T[6]+76029189&4294967295,v=S+(E<<23&4294967295|E>>>9),E=y+(v^S^b)+T[9]+3654602809&4294967295,y=v+(E<<4&4294967295|E>>>28),E=b+(y^v^S)+T[12]+3873151461&4294967295,b=y+(E<<11&4294967295|E>>>21),E=S+(b^y^v)+T[15]+530742520&4294967295,S=b+(E<<16&4294967295|E>>>16),E=v+(S^b^y)+T[2]+3299628645&4294967295,v=S+(E<<23&4294967295|E>>>9),E=y+(S^(v|~b))+T[0]+4096336452&4294967295,y=v+(E<<6&4294967295|E>>>26),E=b+(v^(y|~S))+T[7]+1126891415&4294967295,b=y+(E<<10&4294967295|E>>>22),E=S+(y^(b|~v))+T[14]+2878612391&4294967295,S=b+(E<<15&4294967295|E>>>17),E=v+(b^(S|~y))+T[5]+4237533241&4294967295,v=S+(E<<21&4294967295|E>>>11),E=y+(S^(v|~b))+T[12]+1700485571&4294967295,y=v+(E<<6&4294967295|E>>>26),E=b+(v^(y|~S))+T[3]+2399980690&4294967295,b=y+(E<<10&4294967295|E>>>22),E=S+(y^(b|~v))+T[10]+4293915773&4294967295,S=b+(E<<15&4294967295|E>>>17),E=v+(b^(S|~y))+T[1]+2240044497&4294967295,v=S+(E<<21&4294967295|E>>>11),E=y+(S^(v|~b))+T[8]+1873313359&4294967295,y=v+(E<<6&4294967295|E>>>26),E=b+(v^(y|~S))+T[15]+4264355552&4294967295,b=y+(E<<10&4294967295|E>>>22),E=S+(y^(b|~v))+T[6]+2734768916&4294967295,S=b+(E<<15&4294967295|E>>>17),E=v+(b^(S|~y))+T[13]+1309151649&4294967295,v=S+(E<<21&4294967295|E>>>11),E=y+(S^(v|~b))+T[4]+4149444226&4294967295,y=v+(E<<6&4294967295|E>>>26),E=b+(v^(y|~S))+T[11]+3174756917&4294967295,b=y+(E<<10&4294967295|E>>>22),E=S+(y^(b|~v))+T[2]+718787259&4294967295,S=b+(E<<15&4294967295|E>>>17),E=v+(b^(S|~y))+T[9]+3951481745&4294967295,A.g[0]=A.g[0]+y&4294967295,A.g[1]=A.g[1]+(S+(E<<21&4294967295|E>>>11))&4294967295,A.g[2]=A.g[2]+S&4294967295,A.g[3]=A.g[3]+b&4294967295}r.prototype.u=function(A,y){y===void 0&&(y=A.length);for(var v=y-this.blockSize,T=this.B,S=this.h,b=0;b<y;){if(S==0)for(;b<=v;)s(this,A,b),b+=this.blockSize;if(typeof A=="string"){for(;b<y;)if(T[S++]=A.charCodeAt(b++),S==this.blockSize){s(this,T),S=0;break}}else for(;b<y;)if(T[S++]=A[b++],S==this.blockSize){s(this,T),S=0;break}}this.h=S,this.o+=y},r.prototype.v=function(){var A=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);A[0]=128;for(var y=1;y<A.length-8;++y)A[y]=0;var v=8*this.o;for(y=A.length-8;y<A.length;++y)A[y]=v&255,v/=256;for(this.u(A),A=Array(16),y=v=0;4>y;++y)for(var T=0;32>T;T+=8)A[v++]=this.g[y]>>>T&255;return A};function i(A,y){var v=a;return Object.prototype.hasOwnProperty.call(v,A)?v[A]:v[A]=y(A)}function o(A,y){this.h=y;for(var v=[],T=!0,S=A.length-1;0<=S;S--){var b=A[S]|0;T&&b==y||(v[S]=b,T=!1)}this.g=v}var a={};function c(A){return-128<=A&&128>A?i(A,function(y){return new o([y|0],0>y?-1:0)}):new o([A|0],0>A?-1:0)}function u(A){if(isNaN(A)||!isFinite(A))return f;if(0>A)return x(u(-A));for(var y=[],v=1,T=0;A>=v;T++)y[T]=A/v|0,v*=4294967296;return new o(y,0)}function h(A,y){if(A.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(A.charAt(0)=="-")return x(h(A.substring(1),y));if(0<=A.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=u(Math.pow(y,8)),T=f,S=0;S<A.length;S+=8){var b=Math.min(8,A.length-S),E=parseInt(A.substring(S,S+b),y);8>b?(b=u(Math.pow(y,b)),T=T.j(b).add(u(E))):(T=T.j(v),T=T.add(u(E)))}return T}var f=c(0),g=c(1),m=c(16777216);t=o.prototype,t.m=function(){if(R(this))return-x(this).m();for(var A=0,y=1,v=0;v<this.g.length;v++){var T=this.i(v);A+=(0<=T?T:4294967296+T)*y,y*=4294967296}return A},t.toString=function(A){if(A=A||10,2>A||36<A)throw Error("radix out of range: "+A);if(C(this))return"0";if(R(this))return"-"+x(this).toString(A);for(var y=u(Math.pow(A,6)),v=this,T="";;){var S=N(v,y).g;v=L(v,S.j(y));var b=((0<v.g.length?v.g[0]:v.h)>>>0).toString(A);if(v=S,C(v))return b+T;for(;6>b.length;)b="0"+b;T=b+T}},t.i=function(A){return 0>A?0:A<this.g.length?this.g[A]:this.h};function C(A){if(A.h!=0)return!1;for(var y=0;y<A.g.length;y++)if(A.g[y]!=0)return!1;return!0}function R(A){return A.h==-1}t.l=function(A){return A=L(this,A),R(A)?-1:C(A)?0:1};function x(A){for(var y=A.g.length,v=[],T=0;T<y;T++)v[T]=~A.g[T];return new o(v,~A.h).add(g)}t.abs=function(){return R(this)?x(this):this},t.add=function(A){for(var y=Math.max(this.g.length,A.g.length),v=[],T=0,S=0;S<=y;S++){var b=T+(this.i(S)&65535)+(A.i(S)&65535),E=(b>>>16)+(this.i(S)>>>16)+(A.i(S)>>>16);T=E>>>16,b&=65535,E&=65535,v[S]=E<<16|b}return new o(v,v[v.length-1]&-2147483648?-1:0)};function L(A,y){return A.add(x(y))}t.j=function(A){if(C(this)||C(A))return f;if(R(this))return R(A)?x(this).j(x(A)):x(x(this).j(A));if(R(A))return x(this.j(x(A)));if(0>this.l(m)&&0>A.l(m))return u(this.m()*A.m());for(var y=this.g.length+A.g.length,v=[],T=0;T<2*y;T++)v[T]=0;for(T=0;T<this.g.length;T++)for(var S=0;S<A.g.length;S++){var b=this.i(T)>>>16,E=this.i(T)&65535,De=A.i(S)>>>16,ot=A.i(S)&65535;v[2*T+2*S]+=E*ot,F(v,2*T+2*S),v[2*T+2*S+1]+=b*ot,F(v,2*T+2*S+1),v[2*T+2*S+1]+=E*De,F(v,2*T+2*S+1),v[2*T+2*S+2]+=b*De,F(v,2*T+2*S+2)}for(T=0;T<y;T++)v[T]=v[2*T+1]<<16|v[2*T];for(T=y;T<2*y;T++)v[T]=0;return new o(v,0)};function F(A,y){for(;(A[y]&65535)!=A[y];)A[y+1]+=A[y]>>>16,A[y]&=65535,y++}function B(A,y){this.g=A,this.h=y}function N(A,y){if(C(y))throw Error("division by zero");if(C(A))return new B(f,f);if(R(A))return y=N(x(A),y),new B(x(y.g),x(y.h));if(R(y))return y=N(A,x(y)),new B(x(y.g),y.h);if(30<A.g.length){if(R(A)||R(y))throw Error("slowDivide_ only works with positive integers.");for(var v=g,T=y;0>=T.l(A);)v=Q(v),T=Q(T);var S=$(v,1),b=$(T,1);for(T=$(T,2),v=$(v,2);!C(T);){var E=b.add(T);0>=E.l(A)&&(S=S.add(v),b=E),T=$(T,1),v=$(v,1)}return y=L(A,S.j(y)),new B(S,y)}for(S=f;0<=A.l(y);){for(v=Math.max(1,Math.floor(A.m()/y.m())),T=Math.ceil(Math.log(v)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),b=u(v),E=b.j(y);R(E)||0<E.l(A);)v-=T,b=u(v),E=b.j(y);C(b)&&(b=g),S=S.add(b),A=L(A,E)}return new B(S,A)}t.A=function(A){return N(this,A).h},t.and=function(A){for(var y=Math.max(this.g.length,A.g.length),v=[],T=0;T<y;T++)v[T]=this.i(T)&A.i(T);return new o(v,this.h&A.h)},t.or=function(A){for(var y=Math.max(this.g.length,A.g.length),v=[],T=0;T<y;T++)v[T]=this.i(T)|A.i(T);return new o(v,this.h|A.h)},t.xor=function(A){for(var y=Math.max(this.g.length,A.g.length),v=[],T=0;T<y;T++)v[T]=this.i(T)^A.i(T);return new o(v,this.h^A.h)};function Q(A){for(var y=A.g.length+1,v=[],T=0;T<y;T++)v[T]=A.i(T)<<1|A.i(T-1)>>>31;return new o(v,A.h)}function $(A,y){var v=y>>5;y%=32;for(var T=A.g.length-v,S=[],b=0;b<T;b++)S[b]=0<y?A.i(b+v)>>>y|A.i(b+v+1)<<32-y:A.i(b+v);return new o(S,A.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,j0=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=h,As=o}).apply(typeof a_<"u"?a_:typeof self<"u"?self:typeof window<"u"?window:{});var cl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var q0,H0,Eo,W0,El,jh,z0,G0,K0;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,d,p){return l==Array.prototype||l==Object.prototype||(l[d]=p.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof cl=="object"&&cl];for(var d=0;d<l.length;++d){var p=l[d];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function s(l,d){if(d)e:{var p=r;l=l.split(".");for(var _=0;_<l.length-1;_++){var P=l[_];if(!(P in p))break e;p=p[P]}l=l[l.length-1],_=p[l],d=d(_),d!=_&&d!=null&&e(p,l,{configurable:!0,writable:!0,value:d})}}function i(l,d){l instanceof String&&(l+="");var p=0,_=!1,P={next:function(){if(!_&&p<l.length){var D=p++;return{value:d(D,l[D]),done:!1}}return _=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}s("Array.prototype.values",function(l){return l||function(){return i(this,function(d,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function c(l){var d=typeof l;return d=d!="object"?d:l?Array.isArray(l)?"array":d:"null",d=="array"||d=="object"&&typeof l.length=="number"}function u(l){var d=typeof l;return d=="object"&&l!=null||d=="function"}function h(l,d,p){return l.call.apply(l.bind,arguments)}function f(l,d,p){if(!l)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,_),l.apply(d,P)}}return function(){return l.apply(d,arguments)}}function g(l,d,p){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:f,g.apply(null,arguments)}function m(l,d){var p=Array.prototype.slice.call(arguments,1);return function(){var _=p.slice();return _.push.apply(_,arguments),l.apply(this,_)}}function C(l,d){function p(){}p.prototype=d.prototype,l.aa=d.prototype,l.prototype=new p,l.prototype.constructor=l,l.Qb=function(_,P,D){for(var J=Array(arguments.length-2),Ye=2;Ye<arguments.length;Ye++)J[Ye-2]=arguments[Ye];return d.prototype[P].apply(_,J)}}function R(l){const d=l.length;if(0<d){const p=Array(d);for(let _=0;_<d;_++)p[_]=l[_];return p}return[]}function x(l,d){for(let p=1;p<arguments.length;p++){const _=arguments[p];if(c(_)){const P=l.length||0,D=_.length||0;l.length=P+D;for(let J=0;J<D;J++)l[P+J]=_[J]}else l.push(_)}}class L{constructor(d,p){this.i=d,this.j=p,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function F(l){return/^[\s\xa0]*$/.test(l)}function B(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function N(l){return N[" "](l),l}N[" "]=function(){};var Q=B().indexOf("Gecko")!=-1&&!(B().toLowerCase().indexOf("webkit")!=-1&&B().indexOf("Edge")==-1)&&!(B().indexOf("Trident")!=-1||B().indexOf("MSIE")!=-1)&&B().indexOf("Edge")==-1;function $(l,d,p){for(const _ in l)d.call(p,l[_],_,l)}function A(l,d){for(const p in l)d.call(void 0,l[p],p,l)}function y(l){const d={};for(const p in l)d[p]=l[p];return d}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(l,d){let p,_;for(let P=1;P<arguments.length;P++){_=arguments[P];for(p in _)l[p]=_[p];for(let D=0;D<v.length;D++)p=v[D],Object.prototype.hasOwnProperty.call(_,p)&&(l[p]=_[p])}}function S(l){var d=1;l=l.split(":");const p=[];for(;0<d&&l.length;)p.push(l.shift()),d--;return l.length&&p.push(l.join(":")),p}function b(l){a.setTimeout(()=>{throw l},0)}function E(){var l=He;let d=null;return l.g&&(d=l.g,l.g=l.g.next,l.g||(l.h=null),d.next=null),d}class De{constructor(){this.h=this.g=null}add(d,p){const _=ot.get();_.set(d,p),this.h?this.h.next=_:this.g=_,this.h=_}}var ot=new L(()=>new Me,l=>l.reset());class Me{constructor(){this.next=this.g=this.h=null}set(d,p){this.h=d,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let Ie,_e=!1,He=new De,Tt=()=>{const l=a.Promise.resolve(void 0);Ie=()=>{l.then(mt)}};var mt=()=>{for(var l;l=E();){try{l.h.call(l.g)}catch(p){b(p)}var d=ot;d.j(l),100>d.h&&(d.h++,l.next=d.g,d.g=l)}_e=!1};function We(){this.s=this.s,this.C=this.C}We.prototype.s=!1,We.prototype.ma=function(){this.s||(this.s=!0,this.N())},We.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function et(l,d){this.type=l,this.g=this.target=d,this.defaultPrevented=!1}et.prototype.h=function(){this.defaultPrevented=!0};var U=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,d=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const p=()=>{};a.addEventListener("test",p,d),a.removeEventListener("test",p,d)}catch{}return l}();function Ce(l,d){if(et.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var p=this.type=l.type,_=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=d,d=l.relatedTarget){if(Q){e:{try{N(d.nodeName);var P=!0;break e}catch{}P=!1}P||(d=null)}}else p=="mouseover"?d=l.fromElement:p=="mouseout"&&(d=l.toElement);this.relatedTarget=d,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:Se[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&Ce.aa.h.call(this)}}C(Ce,et);var Se={2:"touch",3:"pen",4:"mouse"};Ce.prototype.h=function(){Ce.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var O="closure_listenable_"+(1e6*Math.random()|0),z=0;function G(l,d,p,_,P){this.listener=l,this.proxy=null,this.src=d,this.type=p,this.capture=!!_,this.ha=P,this.key=++z,this.da=this.fa=!1}function te(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function Ae(l){this.src=l,this.g={},this.h=0}Ae.prototype.add=function(l,d,p,_,P){var D=l.toString();l=this.g[D],l||(l=this.g[D]=[],this.h++);var J=w(l,d,_,P);return-1<J?(d=l[J],p||(d.fa=!1)):(d=new G(d,this.src,D,!!_,P),d.fa=p,l.push(d)),d};function ze(l,d){var p=d.type;if(p in l.g){var _=l.g[p],P=Array.prototype.indexOf.call(_,d,void 0),D;(D=0<=P)&&Array.prototype.splice.call(_,P,1),D&&(te(d),l.g[p].length==0&&(delete l.g[p],l.h--))}}function w(l,d,p,_){for(var P=0;P<l.length;++P){var D=l[P];if(!D.da&&D.listener==d&&D.capture==!!p&&D.ha==_)return P}return-1}var I="closure_lm_"+(1e6*Math.random()|0),k={};function V(l,d,p,_,P){if(Array.isArray(d)){for(var D=0;D<d.length;D++)V(l,d[D],p,_,P);return null}return p=ae(p),l&&l[O]?l.K(d,p,u(_)?!!_.capture:!!_,P):M(l,d,p,!1,_,P)}function M(l,d,p,_,P,D){if(!d)throw Error("Invalid event type");var J=u(P)?!!P.capture:!!P,Ye=ne(l);if(Ye||(l[I]=Ye=new Ae(l)),p=Ye.add(d,p,_,J,D),p.proxy)return p;if(_=W(),p.proxy=_,_.src=l,_.listener=p,l.addEventListener)U||(P=J),P===void 0&&(P=!1),l.addEventListener(d.toString(),_,P);else if(l.attachEvent)l.attachEvent(X(d.toString()),_);else if(l.addListener&&l.removeListener)l.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return p}function W(){function l(p){return d.call(l.src,l.listener,p)}const d=q;return l}function ee(l,d,p,_,P){if(Array.isArray(d))for(var D=0;D<d.length;D++)ee(l,d[D],p,_,P);else _=u(_)?!!_.capture:!!_,p=ae(p),l&&l[O]?(l=l.i,d=String(d).toString(),d in l.g&&(D=l.g[d],p=w(D,p,_,P),-1<p&&(te(D[p]),Array.prototype.splice.call(D,p,1),D.length==0&&(delete l.g[d],l.h--)))):l&&(l=ne(l))&&(d=l.g[d.toString()],l=-1,d&&(l=w(d,p,_,P)),(p=-1<l?d[l]:null)&&K(p))}function K(l){if(typeof l!="number"&&l&&!l.da){var d=l.src;if(d&&d[O])ze(d.i,l);else{var p=l.type,_=l.proxy;d.removeEventListener?d.removeEventListener(p,_,l.capture):d.detachEvent?d.detachEvent(X(p),_):d.addListener&&d.removeListener&&d.removeListener(_),(p=ne(d))?(ze(p,l),p.h==0&&(p.src=null,d[I]=null)):te(l)}}}function X(l){return l in k?k[l]:k[l]="on"+l}function q(l,d){if(l.da)l=!0;else{d=new Ce(d,this);var p=l.listener,_=l.ha||l.src;l.fa&&K(l),l=p.call(_,d)}return l}function ne(l){return l=l[I],l instanceof Ae?l:null}var le="__closure_events_fn_"+(1e9*Math.random()>>>0);function ae(l){return typeof l=="function"?l:(l[le]||(l[le]=function(d){return l.handleEvent(d)}),l[le])}function oe(){We.call(this),this.i=new Ae(this),this.M=this,this.F=null}C(oe,We),oe.prototype[O]=!0,oe.prototype.removeEventListener=function(l,d,p,_){ee(this,l,d,p,_)};function ce(l,d){var p,_=l.F;if(_)for(p=[];_;_=_.F)p.push(_);if(l=l.M,_=d.type||d,typeof d=="string")d=new et(d,l);else if(d instanceof et)d.target=d.target||l;else{var P=d;d=new et(_,l),T(d,P)}if(P=!0,p)for(var D=p.length-1;0<=D;D--){var J=d.g=p[D];P=Le(J,_,!0,d)&&P}if(J=d.g=l,P=Le(J,_,!0,d)&&P,P=Le(J,_,!1,d)&&P,p)for(D=0;D<p.length;D++)J=d.g=p[D],P=Le(J,_,!1,d)&&P}oe.prototype.N=function(){if(oe.aa.N.call(this),this.i){var l=this.i,d;for(d in l.g){for(var p=l.g[d],_=0;_<p.length;_++)te(p[_]);delete l.g[d],l.h--}}this.F=null},oe.prototype.K=function(l,d,p,_){return this.i.add(String(l),d,!1,p,_)},oe.prototype.L=function(l,d,p,_){return this.i.add(String(l),d,!0,p,_)};function Le(l,d,p,_){if(d=l.i.g[String(d)],!d)return!0;d=d.concat();for(var P=!0,D=0;D<d.length;++D){var J=d[D];if(J&&!J.da&&J.capture==p){var Ye=J.listener,Pt=J.ha||J.src;J.fa&&ze(l.i,J),P=Ye.call(Pt,_)!==!1&&P}}return P&&!_.defaultPrevented}function Ke(l,d,p){if(typeof l=="function")p&&(l=g(l,p));else if(l&&typeof l.handleEvent=="function")l=g(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:a.setTimeout(l,d||0)}function pt(l){l.g=Ke(()=>{l.g=null,l.i&&(l.i=!1,pt(l))},l.l);const d=l.h;l.h=null,l.m.apply(null,d)}class sn extends We{constructor(d,p){super(),this.m=d,this.l=p,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:pt(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function hn(l){We.call(this),this.h=l,this.g={}}C(hn,We);var zi=[];function yr(l){$(l.g,function(d,p){this.g.hasOwnProperty(p)&&K(d)},l),l.g={}}hn.prototype.N=function(){hn.aa.N.call(this),yr(this)},hn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ks=a.JSON.stringify,Kt=a.JSON.parse,dn=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function Ys(){}Ys.prototype.h=null;function cp(l){return l.h||(l.h=l.i())}function up(){}var Gi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function cu(){et.call(this,"d")}C(cu,et);function uu(){et.call(this,"c")}C(uu,et);var ss={},hp=null;function Ua(){return hp=hp||new oe}ss.La="serverreachability";function dp(l){et.call(this,ss.La,l)}C(dp,et);function Ki(l){const d=Ua();ce(d,new dp(d))}ss.STAT_EVENT="statevent";function fp(l,d){et.call(this,ss.STAT_EVENT,l),this.stat=d}C(fp,et);function Yt(l){const d=Ua();ce(d,new fp(d,l))}ss.Ma="timingevent";function pp(l,d){et.call(this,ss.Ma,l),this.size=d}C(pp,et);function Yi(l,d){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},d)}function Qi(){this.g=!0}Qi.prototype.xa=function(){this.g=!1};function Yb(l,d,p,_,P,D){l.info(function(){if(l.g)if(D)for(var J="",Ye=D.split("&"),Pt=0;Pt<Ye.length;Pt++){var Fe=Ye[Pt].split("=");if(1<Fe.length){var Vt=Fe[0];Fe=Fe[1];var Ft=Vt.split("_");J=2<=Ft.length&&Ft[1]=="type"?J+(Vt+"="+Fe+"&"):J+(Vt+"=redacted&")}}else J=null;else J=D;return"XMLHTTP REQ ("+_+") [attempt "+P+"]: "+d+`
`+p+`
`+J})}function Qb(l,d,p,_,P,D,J){l.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+P+"]: "+d+`
`+p+`
`+D+" "+J})}function Qs(l,d,p,_){l.info(function(){return"XMLHTTP TEXT ("+d+"): "+Jb(l,p)+(_?" "+_:"")})}function Xb(l,d){l.info(function(){return"TIMEOUT: "+d})}Qi.prototype.info=function(){};function Jb(l,d){if(!l.g)return d;if(!d)return null;try{var p=JSON.parse(d);if(p){for(l=0;l<p.length;l++)if(Array.isArray(p[l])){var _=p[l];if(!(2>_.length)){var P=_[1];if(Array.isArray(P)&&!(1>P.length)){var D=P[0];if(D!="noop"&&D!="stop"&&D!="close")for(var J=1;J<P.length;J++)P[J]=""}}}}return Ks(p)}catch{return d}}var Ba={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},gp={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},hu;function $a(){}C($a,Ys),$a.prototype.g=function(){return new XMLHttpRequest},$a.prototype.i=function(){return{}},hu=new $a;function vr(l,d,p,_){this.j=l,this.i=d,this.l=p,this.R=_||1,this.U=new hn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new mp}function mp(){this.i=null,this.g="",this.h=!1}var _p={},du={};function fu(l,d,p){l.L=1,l.v=Wa(Jn(d)),l.m=p,l.P=!0,yp(l,null)}function yp(l,d){l.F=Date.now(),ja(l),l.A=Jn(l.v);var p=l.A,_=l.R;Array.isArray(_)||(_=[String(_)]),Np(p.i,"t",_),l.C=0,p=l.j.J,l.h=new mp,l.g=Qp(l.j,p?d:null,!l.m),0<l.O&&(l.M=new sn(g(l.Y,l,l.g),l.O)),d=l.U,p=l.g,_=l.ca;var P="readystatechange";Array.isArray(P)||(P&&(zi[0]=P.toString()),P=zi);for(var D=0;D<P.length;D++){var J=V(p,P[D],_||d.handleEvent,!1,d.h||d);if(!J)break;d.g[J.key]=J}d=l.H?y(l.H):{},l.m?(l.u||(l.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,d)):(l.u="GET",l.g.ea(l.A,l.u,null,d)),Ki(),Yb(l.i,l.u,l.A,l.l,l.R,l.m)}vr.prototype.ca=function(l){l=l.target;const d=this.M;d&&Zn(l)==3?d.j():this.Y(l)},vr.prototype.Y=function(l){try{if(l==this.g)e:{const Ft=Zn(this.g);var d=this.g.Ba();const Zs=this.g.Z();if(!(3>Ft)&&(Ft!=3||this.g&&(this.h.h||this.g.oa()||Up(this.g)))){this.J||Ft!=4||d==7||(d==8||0>=Zs?Ki(3):Ki(2)),pu(this);var p=this.g.Z();this.X=p;t:if(vp(this)){var _=Up(this.g);l="";var P=_.length,D=Zn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){is(this),Xi(this);var J="";break t}this.h.i=new a.TextDecoder}for(d=0;d<P;d++)this.h.h=!0,l+=this.h.i.decode(_[d],{stream:!(D&&d==P-1)});_.length=0,this.h.g+=l,this.C=0,J=this.h.g}else J=this.g.oa();if(this.o=p==200,Qb(this.i,this.u,this.A,this.l,this.R,Ft,p),this.o){if(this.T&&!this.K){t:{if(this.g){var Ye,Pt=this.g;if((Ye=Pt.g?Pt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!F(Ye)){var Fe=Ye;break t}}Fe=null}if(p=Fe)Qs(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,gu(this,p);else{this.o=!1,this.s=3,Yt(12),is(this),Xi(this);break e}}if(this.P){p=!0;let bn;for(;!this.J&&this.C<J.length;)if(bn=Zb(this,J),bn==du){Ft==4&&(this.s=4,Yt(14),p=!1),Qs(this.i,this.l,null,"[Incomplete Response]");break}else if(bn==_p){this.s=4,Yt(15),Qs(this.i,this.l,J,"[Invalid Chunk]"),p=!1;break}else Qs(this.i,this.l,bn,null),gu(this,bn);if(vp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ft!=4||J.length!=0||this.h.h||(this.s=1,Yt(16),p=!1),this.o=this.o&&p,!p)Qs(this.i,this.l,J,"[Invalid Chunked Response]"),is(this),Xi(this);else if(0<J.length&&!this.W){this.W=!0;var Vt=this.j;Vt.g==this&&Vt.ba&&!Vt.M&&(Vt.j.info("Great, no buffering proxy detected. Bytes received: "+J.length),Eu(Vt),Vt.M=!0,Yt(11))}}else Qs(this.i,this.l,J,null),gu(this,J);Ft==4&&is(this),this.o&&!this.J&&(Ft==4?zp(this.j,this):(this.o=!1,ja(this)))}else mI(this.g),p==400&&0<J.indexOf("Unknown SID")?(this.s=3,Yt(12)):(this.s=0,Yt(13)),is(this),Xi(this)}}}catch{}finally{}};function vp(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function Zb(l,d){var p=l.C,_=d.indexOf(`
`,p);return _==-1?du:(p=Number(d.substring(p,_)),isNaN(p)?_p:(_+=1,_+p>d.length?du:(d=d.slice(_,_+p),l.C=_+p,d)))}vr.prototype.cancel=function(){this.J=!0,is(this)};function ja(l){l.S=Date.now()+l.I,wp(l,l.I)}function wp(l,d){if(l.B!=null)throw Error("WatchDog timer not null");l.B=Yi(g(l.ba,l),d)}function pu(l){l.B&&(a.clearTimeout(l.B),l.B=null)}vr.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(Xb(this.i,this.A),this.L!=2&&(Ki(),Yt(17)),is(this),this.s=2,Xi(this)):wp(this,this.S-l)};function Xi(l){l.j.G==0||l.J||zp(l.j,l)}function is(l){pu(l);var d=l.M;d&&typeof d.ma=="function"&&d.ma(),l.M=null,yr(l.U),l.g&&(d=l.g,l.g=null,d.abort(),d.ma())}function gu(l,d){try{var p=l.j;if(p.G!=0&&(p.g==l||mu(p.h,l))){if(!l.K&&mu(p.h,l)&&p.G==3){try{var _=p.Da.g.parse(d)}catch{_=null}if(Array.isArray(_)&&_.length==3){var P=_;if(P[0]==0){e:if(!p.u){if(p.g)if(p.g.F+3e3<l.F)Qa(p),Ka(p);else break e;wu(p),Yt(18)}}else p.za=P[1],0<p.za-p.T&&37500>P[2]&&p.F&&p.v==0&&!p.C&&(p.C=Yi(g(p.Za,p),6e3));if(1>=Ip(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else as(p,11)}else if((l.K||p.g==l)&&Qa(p),!F(d))for(P=p.Da.g.parse(d),d=0;d<P.length;d++){let Fe=P[d];if(p.T=Fe[0],Fe=Fe[1],p.G==2)if(Fe[0]=="c"){p.K=Fe[1],p.ia=Fe[2];const Vt=Fe[3];Vt!=null&&(p.la=Vt,p.j.info("VER="+p.la));const Ft=Fe[4];Ft!=null&&(p.Aa=Ft,p.j.info("SVER="+p.Aa));const Zs=Fe[5];Zs!=null&&typeof Zs=="number"&&0<Zs&&(_=1.5*Zs,p.L=_,p.j.info("backChannelRequestTimeoutMs_="+_)),_=p;const bn=l.g;if(bn){const Ja=bn.g?bn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ja){var D=_.h;D.g||Ja.indexOf("spdy")==-1&&Ja.indexOf("quic")==-1&&Ja.indexOf("h2")==-1||(D.j=D.l,D.g=new Set,D.h&&(_u(D,D.h),D.h=null))}if(_.D){const bu=bn.g?bn.g.getResponseHeader("X-HTTP-Session-Id"):null;bu&&(_.ya=bu,tt(_.I,_.D,bu))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-l.F,p.j.info("Handshake RTT: "+p.R+"ms")),_=p;var J=l;if(_.qa=Yp(_,_.J?_.ia:null,_.W),J.K){Tp(_.h,J);var Ye=J,Pt=_.L;Pt&&(Ye.I=Pt),Ye.B&&(pu(Ye),ja(Ye)),_.g=J}else Hp(_);0<p.i.length&&Ya(p)}else Fe[0]!="stop"&&Fe[0]!="close"||as(p,7);else p.G==3&&(Fe[0]=="stop"||Fe[0]=="close"?Fe[0]=="stop"?as(p,7):vu(p):Fe[0]!="noop"&&p.l&&p.l.ta(Fe),p.v=0)}}Ki(4)}catch{}}var eI=class{constructor(l,d){this.g=l,this.map=d}};function Ep(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function bp(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function Ip(l){return l.h?1:l.g?l.g.size:0}function mu(l,d){return l.h?l.h==d:l.g?l.g.has(d):!1}function _u(l,d){l.g?l.g.add(d):l.h=d}function Tp(l,d){l.h&&l.h==d?l.h=null:l.g&&l.g.has(d)&&l.g.delete(d)}Ep.prototype.cancel=function(){if(this.i=Cp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function Cp(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let d=l.i;for(const p of l.g.values())d=d.concat(p.D);return d}return R(l.i)}function tI(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(c(l)){for(var d=[],p=l.length,_=0;_<p;_++)d.push(l[_]);return d}d=[],p=0;for(_ in l)d[p++]=l[_];return d}function nI(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(c(l)||typeof l=="string"){var d=[];l=l.length;for(var p=0;p<l;p++)d.push(p);return d}d=[],p=0;for(const _ in l)d[p++]=_;return d}}}function Ap(l,d){if(l.forEach&&typeof l.forEach=="function")l.forEach(d,void 0);else if(c(l)||typeof l=="string")Array.prototype.forEach.call(l,d,void 0);else for(var p=nI(l),_=tI(l),P=_.length,D=0;D<P;D++)d.call(void 0,_[D],p&&p[D],l)}var Sp=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rI(l,d){if(l){l=l.split("&");for(var p=0;p<l.length;p++){var _=l[p].indexOf("="),P=null;if(0<=_){var D=l[p].substring(0,_);P=l[p].substring(_+1)}else D=l[p];d(D,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function os(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof os){this.h=l.h,qa(this,l.j),this.o=l.o,this.g=l.g,Ha(this,l.s),this.l=l.l;var d=l.i,p=new eo;p.i=d.i,d.g&&(p.g=new Map(d.g),p.h=d.h),Rp(this,p),this.m=l.m}else l&&(d=String(l).match(Sp))?(this.h=!1,qa(this,d[1]||"",!0),this.o=Ji(d[2]||""),this.g=Ji(d[3]||"",!0),Ha(this,d[4]),this.l=Ji(d[5]||"",!0),Rp(this,d[6]||"",!0),this.m=Ji(d[7]||"")):(this.h=!1,this.i=new eo(null,this.h))}os.prototype.toString=function(){var l=[],d=this.j;d&&l.push(Zi(d,Pp,!0),":");var p=this.g;return(p||d=="file")&&(l.push("//"),(d=this.o)&&l.push(Zi(d,Pp,!0),"@"),l.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&l.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&l.push("/"),l.push(Zi(p,p.charAt(0)=="/"?oI:iI,!0))),(p=this.i.toString())&&l.push("?",p),(p=this.m)&&l.push("#",Zi(p,lI)),l.join("")};function Jn(l){return new os(l)}function qa(l,d,p){l.j=p?Ji(d,!0):d,l.j&&(l.j=l.j.replace(/:$/,""))}function Ha(l,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);l.s=d}else l.s=null}function Rp(l,d,p){d instanceof eo?(l.i=d,cI(l.i,l.h)):(p||(d=Zi(d,aI)),l.i=new eo(d,l.h))}function tt(l,d,p){l.i.set(d,p)}function Wa(l){return tt(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function Ji(l,d){return l?d?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function Zi(l,d,p){return typeof l=="string"?(l=encodeURI(l).replace(d,sI),p&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function sI(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var Pp=/[#\/\?@]/g,iI=/[#\?:]/g,oI=/[#\?]/g,aI=/[#\?@]/g,lI=/#/g;function eo(l,d){this.h=this.g=null,this.i=l||null,this.j=!!d}function wr(l){l.g||(l.g=new Map,l.h=0,l.i&&rI(l.i,function(d,p){l.add(decodeURIComponent(d.replace(/\+/g," ")),p)}))}t=eo.prototype,t.add=function(l,d){wr(this),this.i=null,l=Xs(this,l);var p=this.g.get(l);return p||this.g.set(l,p=[]),p.push(d),this.h+=1,this};function xp(l,d){wr(l),d=Xs(l,d),l.g.has(d)&&(l.i=null,l.h-=l.g.get(d).length,l.g.delete(d))}function kp(l,d){return wr(l),d=Xs(l,d),l.g.has(d)}t.forEach=function(l,d){wr(this),this.g.forEach(function(p,_){p.forEach(function(P){l.call(d,P,_,this)},this)},this)},t.na=function(){wr(this);const l=Array.from(this.g.values()),d=Array.from(this.g.keys()),p=[];for(let _=0;_<d.length;_++){const P=l[_];for(let D=0;D<P.length;D++)p.push(d[_])}return p},t.V=function(l){wr(this);let d=[];if(typeof l=="string")kp(this,l)&&(d=d.concat(this.g.get(Xs(this,l))));else{l=Array.from(this.g.values());for(let p=0;p<l.length;p++)d=d.concat(l[p])}return d},t.set=function(l,d){return wr(this),this.i=null,l=Xs(this,l),kp(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[d]),this.h+=1,this},t.get=function(l,d){return l?(l=this.V(l),0<l.length?String(l[0]):d):d};function Np(l,d,p){xp(l,d),0<p.length&&(l.i=null,l.g.set(Xs(l,d),R(p)),l.h+=p.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],d=Array.from(this.g.keys());for(var p=0;p<d.length;p++){var _=d[p];const D=encodeURIComponent(String(_)),J=this.V(_);for(_=0;_<J.length;_++){var P=D;J[_]!==""&&(P+="="+encodeURIComponent(String(J[_]))),l.push(P)}}return this.i=l.join("&")};function Xs(l,d){return d=String(d),l.j&&(d=d.toLowerCase()),d}function cI(l,d){d&&!l.j&&(wr(l),l.i=null,l.g.forEach(function(p,_){var P=_.toLowerCase();_!=P&&(xp(this,_),Np(this,P,p))},l)),l.j=d}function uI(l,d){const p=new Qi;if(a.Image){const _=new Image;_.onload=m(Er,p,"TestLoadImage: loaded",!0,d,_),_.onerror=m(Er,p,"TestLoadImage: error",!1,d,_),_.onabort=m(Er,p,"TestLoadImage: abort",!1,d,_),_.ontimeout=m(Er,p,"TestLoadImage: timeout",!1,d,_),a.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=l}else d(!1)}function hI(l,d){const p=new Qi,_=new AbortController,P=setTimeout(()=>{_.abort(),Er(p,"TestPingServer: timeout",!1,d)},1e4);fetch(l,{signal:_.signal}).then(D=>{clearTimeout(P),D.ok?Er(p,"TestPingServer: ok",!0,d):Er(p,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(P),Er(p,"TestPingServer: error",!1,d)})}function Er(l,d,p,_,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),_(p)}catch{}}function dI(){this.g=new dn}function fI(l,d,p){const _=p||"";try{Ap(l,function(P,D){let J=P;u(P)&&(J=Ks(P)),d.push(_+D+"="+encodeURIComponent(J))})}catch(P){throw d.push(_+"type="+encodeURIComponent("_badmap")),P}}function to(l){this.l=l.Ub||null,this.j=l.eb||!1}C(to,Ys),to.prototype.g=function(){return new za(this.l,this.j)},to.prototype.i=function(l){return function(){return l}}({});function za(l,d){oe.call(this),this.D=l,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(za,oe),t=za.prototype,t.open=function(l,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=d,this.readyState=1,ro(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(d.body=l),(this.D||a).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,no(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,ro(this)),this.g&&(this.readyState=3,ro(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Dp(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function Dp(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var d=l.value?l.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!l.done}))&&(this.response=this.responseText+=d)}l.done?no(this):ro(this),this.readyState==3&&Dp(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,no(this))},t.Qa=function(l){this.g&&(this.response=l,no(this))},t.ga=function(){this.g&&no(this)};function no(l){l.readyState=4,l.l=null,l.j=null,l.v=null,ro(l)}t.setRequestHeader=function(l,d){this.u.append(l,d)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],d=this.h.entries();for(var p=d.next();!p.done;)p=p.value,l.push(p[0]+": "+p[1]),p=d.next();return l.join(`\r
`)};function ro(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(za.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function Op(l){let d="";return $(l,function(p,_){d+=_,d+=":",d+=p,d+=`\r
`}),d}function yu(l,d,p){e:{for(_ in p){var _=!1;break e}_=!0}_||(p=Op(p),typeof l=="string"?p!=null&&encodeURIComponent(String(p)):tt(l,d,p))}function ut(l){oe.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(ut,oe);var pI=/^https?$/i,gI=["POST","PUT"];t=ut.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,d,p,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);d=d?d.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():hu.g(),this.v=this.o?cp(this.o):cp(hu),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(d,String(l),!0),this.B=!1}catch(D){Mp(this,D);return}if(l=p||"",p=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var P in _)p.set(P,_[P]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const D of _.keys())p.set(D,_.get(D));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(p.keys()).find(D=>D.toLowerCase()=="content-type"),P=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(gI,d,void 0))||_||P||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[D,J]of p)this.g.setRequestHeader(D,J);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Fp(this),this.u=!0,this.g.send(l),this.u=!1}catch(D){Mp(this,D)}};function Mp(l,d){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=d,l.m=5,Lp(l),Ga(l)}function Lp(l){l.A||(l.A=!0,ce(l,"complete"),ce(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,ce(this,"complete"),ce(this,"abort"),Ga(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ga(this,!0)),ut.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Vp(this):this.bb())},t.bb=function(){Vp(this)};function Vp(l){if(l.h&&typeof o<"u"&&(!l.v[1]||Zn(l)!=4||l.Z()!=2)){if(l.u&&Zn(l)==4)Ke(l.Ea,0,l);else if(ce(l,"readystatechange"),Zn(l)==4){l.h=!1;try{const J=l.Z();e:switch(J){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var p;if(!(p=d)){var _;if(_=J===0){var P=String(l.D).match(Sp)[1]||null;!P&&a.self&&a.self.location&&(P=a.self.location.protocol.slice(0,-1)),_=!pI.test(P?P.toLowerCase():"")}p=_}if(p)ce(l,"complete"),ce(l,"success");else{l.m=6;try{var D=2<Zn(l)?l.g.statusText:""}catch{D=""}l.l=D+" ["+l.Z()+"]",Lp(l)}}finally{Ga(l)}}}}function Ga(l,d){if(l.g){Fp(l);const p=l.g,_=l.v[0]?()=>{}:null;l.g=null,l.v=null,d||ce(l,"ready");try{p.onreadystatechange=_}catch{}}}function Fp(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function Zn(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<Zn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var d=this.g.responseText;return l&&d.indexOf(l)==0&&(d=d.substring(l.length)),Kt(d)}};function Up(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function mI(l){const d={};l=(l.g&&2<=Zn(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<l.length;_++){if(F(l[_]))continue;var p=S(l[_]);const P=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const D=d[P]||[];d[P]=D,D.push(p)}A(d,function(_){return _.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function so(l,d,p){return p&&p.internalChannelParams&&p.internalChannelParams[l]||d}function Bp(l){this.Aa=0,this.i=[],this.j=new Qi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=so("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=so("baseRetryDelayMs",5e3,l),this.cb=so("retryDelaySeedMs",1e4,l),this.Wa=so("forwardChannelMaxRetries",2,l),this.wa=so("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new Ep(l&&l.concurrentRequestLimit),this.Da=new dI,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Bp.prototype,t.la=8,t.G=1,t.connect=function(l,d,p,_){Yt(0),this.W=l,this.H=d||{},p&&_!==void 0&&(this.H.OSID=p,this.H.OAID=_),this.F=this.X,this.I=Yp(this,null,this.W),Ya(this)};function vu(l){if($p(l),l.G==3){var d=l.U++,p=Jn(l.I);if(tt(p,"SID",l.K),tt(p,"RID",d),tt(p,"TYPE","terminate"),io(l,p),d=new vr(l,l.j,d),d.L=2,d.v=Wa(Jn(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(d.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=d.v,p=!0),p||(d.g=Qp(d.j,null),d.g.ea(d.v)),d.F=Date.now(),ja(d)}Kp(l)}function Ka(l){l.g&&(Eu(l),l.g.cancel(),l.g=null)}function $p(l){Ka(l),l.u&&(a.clearTimeout(l.u),l.u=null),Qa(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function Ya(l){if(!bp(l.h)&&!l.s){l.s=!0;var d=l.Ga;Ie||Tt(),_e||(Ie(),_e=!0),He.add(d,l),l.B=0}}function _I(l,d){return Ip(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=d.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=Yi(g(l.Ga,l,d),Gp(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const P=new vr(this,this.j,l);let D=this.o;if(this.S&&(D?(D=y(D),T(D,this.S)):D=this.S),this.m!==null||this.O||(P.H=D,D=null),this.P)e:{for(var d=0,p=0;p<this.i.length;p++){t:{var _=this.i[p];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(d+=_,4096<d){d=p;break e}if(d===4096||p===this.i.length-1){d=p+1;break e}}d=1e3}else d=1e3;d=qp(this,P,d),p=Jn(this.I),tt(p,"RID",l),tt(p,"CVER",22),this.D&&tt(p,"X-HTTP-Session-Id",this.D),io(this,p),D&&(this.O?d="headers="+encodeURIComponent(String(Op(D)))+"&"+d:this.m&&yu(p,this.m,D)),_u(this.h,P),this.Ua&&tt(p,"TYPE","init"),this.P?(tt(p,"$req",d),tt(p,"SID","null"),P.T=!0,fu(P,p,null)):fu(P,p,d),this.G=2}}else this.G==3&&(l?jp(this,l):this.i.length==0||bp(this.h)||jp(this))};function jp(l,d){var p;d?p=d.l:p=l.U++;const _=Jn(l.I);tt(_,"SID",l.K),tt(_,"RID",p),tt(_,"AID",l.T),io(l,_),l.m&&l.o&&yu(_,l.m,l.o),p=new vr(l,l.j,p,l.B+1),l.m===null&&(p.H=l.o),d&&(l.i=d.D.concat(l.i)),d=qp(l,p,1e3),p.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),_u(l.h,p),fu(p,_,d)}function io(l,d){l.H&&$(l.H,function(p,_){tt(d,_,p)}),l.l&&Ap({},function(p,_){tt(d,_,p)})}function qp(l,d,p){p=Math.min(l.i.length,p);var _=l.l?g(l.l.Na,l.l,l):null;e:{var P=l.i;let D=-1;for(;;){const J=["count="+p];D==-1?0<p?(D=P[0].g,J.push("ofs="+D)):D=0:J.push("ofs="+D);let Ye=!0;for(let Pt=0;Pt<p;Pt++){let Fe=P[Pt].g;const Vt=P[Pt].map;if(Fe-=D,0>Fe)D=Math.max(0,P[Pt].g-100),Ye=!1;else try{fI(Vt,J,"req"+Fe+"_")}catch{_&&_(Vt)}}if(Ye){_=J.join("&");break e}}}return l=l.i.splice(0,p),d.D=l,_}function Hp(l){if(!l.g&&!l.u){l.Y=1;var d=l.Fa;Ie||Tt(),_e||(Ie(),_e=!0),He.add(d,l),l.v=0}}function wu(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=Yi(g(l.Fa,l),Gp(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,Wp(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=Yi(g(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Yt(10),Ka(this),Wp(this))};function Eu(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function Wp(l){l.g=new vr(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var d=Jn(l.qa);tt(d,"RID","rpc"),tt(d,"SID",l.K),tt(d,"AID",l.T),tt(d,"CI",l.F?"0":"1"),!l.F&&l.ja&&tt(d,"TO",l.ja),tt(d,"TYPE","xmlhttp"),io(l,d),l.m&&l.o&&yu(d,l.m,l.o),l.L&&(l.g.I=l.L);var p=l.g;l=l.ia,p.L=1,p.v=Wa(Jn(d)),p.m=null,p.P=!0,yp(p,l)}t.Za=function(){this.C!=null&&(this.C=null,Ka(this),wu(this),Yt(19))};function Qa(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function zp(l,d){var p=null;if(l.g==d){Qa(l),Eu(l),l.g=null;var _=2}else if(mu(l.h,d))p=d.D,Tp(l.h,d),_=1;else return;if(l.G!=0){if(d.o)if(_==1){p=d.m?d.m.length:0,d=Date.now()-d.F;var P=l.B;_=Ua(),ce(_,new pp(_,p)),Ya(l)}else Hp(l);else if(P=d.s,P==3||P==0&&0<d.X||!(_==1&&_I(l,d)||_==2&&wu(l)))switch(p&&0<p.length&&(d=l.h,d.i=d.i.concat(p)),P){case 1:as(l,5);break;case 4:as(l,10);break;case 3:as(l,6);break;default:as(l,2)}}}function Gp(l,d){let p=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(p*=2),p*d}function as(l,d){if(l.j.info("Error code "+d),d==2){var p=g(l.fb,l),_=l.Xa;const P=!_;_=new os(_||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||qa(_,"https"),Wa(_),P?uI(_.toString(),p):hI(_.toString(),p)}else Yt(2);l.G=0,l.l&&l.l.sa(d),Kp(l),$p(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),Yt(2)):(this.j.info("Failed to ping google.com"),Yt(1))};function Kp(l){if(l.G=0,l.ka=[],l.l){const d=Cp(l.h);(d.length!=0||l.i.length!=0)&&(x(l.ka,d),x(l.ka,l.i),l.h.i.length=0,R(l.i),l.i.length=0),l.l.ra()}}function Yp(l,d,p){var _=p instanceof os?Jn(p):new os(p);if(_.g!="")d&&(_.g=d+"."+_.g),Ha(_,_.s);else{var P=a.location;_=P.protocol,d=d?d+"."+P.hostname:P.hostname,P=+P.port;var D=new os(null);_&&qa(D,_),d&&(D.g=d),P&&Ha(D,P),p&&(D.l=p),_=D}return p=l.D,d=l.ya,p&&d&&tt(_,p,d),tt(_,"VER",l.la),io(l,_),_}function Qp(l,d,p){if(d&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=l.Ca&&!l.pa?new ut(new to({eb:p})):new ut(l.pa),d.Ha(l.J),d}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Xp(){}t=Xp.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Xa(){}Xa.prototype.g=function(l,d){return new on(l,d)};function on(l,d){oe.call(this),this.g=new Bp(d),this.l=l,this.h=d&&d.messageUrlParams||null,l=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(l?l["X-WebChannel-Content-Type"]=d.messageContentType:l={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(l?l["X-WebChannel-Client-Profile"]=d.va:l={"X-WebChannel-Client-Profile":d.va}),this.g.S=l,(l=d&&d.Sb)&&!F(l)&&(this.g.m=l),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!F(d)&&(this.g.D=d,l=this.h,l!==null&&d in l&&(l=this.h,d in l&&delete l[d])),this.j=new Js(this)}C(on,oe),on.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},on.prototype.close=function(){vu(this.g)},on.prototype.o=function(l){var d=this.g;if(typeof l=="string"){var p={};p.__data__=l,l=p}else this.u&&(p={},p.__data__=Ks(l),l=p);d.i.push(new eI(d.Ya++,l)),d.G==3&&Ya(d)},on.prototype.N=function(){this.g.l=null,delete this.j,vu(this.g),delete this.g,on.aa.N.call(this)};function Jp(l){cu.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var d=l.__sm__;if(d){e:{for(const p in d){l=p;break e}l=void 0}(this.i=l)&&(l=this.i,d=d!==null&&l in d?d[l]:void 0),this.data=d}else this.data=l}C(Jp,cu);function Zp(){uu.call(this),this.status=1}C(Zp,uu);function Js(l){this.g=l}C(Js,Xp),Js.prototype.ua=function(){ce(this.g,"a")},Js.prototype.ta=function(l){ce(this.g,new Jp(l))},Js.prototype.sa=function(l){ce(this.g,new Zp)},Js.prototype.ra=function(){ce(this.g,"b")},Xa.prototype.createWebChannel=Xa.prototype.g,on.prototype.send=on.prototype.o,on.prototype.open=on.prototype.m,on.prototype.close=on.prototype.close,K0=function(){return new Xa},G0=function(){return Ua()},z0=ss,jh={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ba.NO_ERROR=0,Ba.TIMEOUT=8,Ba.HTTP_ERROR=6,El=Ba,gp.COMPLETE="complete",W0=gp,up.EventType=Gi,Gi.OPEN="a",Gi.CLOSE="b",Gi.ERROR="c",Gi.MESSAGE="d",oe.prototype.listen=oe.prototype.K,Eo=up,H0=to,ut.prototype.listenOnce=ut.prototype.L,ut.prototype.getLastError=ut.prototype.Ka,ut.prototype.getLastErrorCode=ut.prototype.Ba,ut.prototype.getStatus=ut.prototype.Z,ut.prototype.getResponseJson=ut.prototype.Oa,ut.prototype.getResponseText=ut.prototype.oa,ut.prototype.send=ut.prototype.ea,ut.prototype.setWithCredentials=ut.prototype.Ha,q0=ut}).apply(typeof cl<"u"?cl:typeof self<"u"?self:typeof window<"u"?window:{});const l_="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Bt.UNAUTHENTICATED=new Bt(null),Bt.GOOGLE_CREDENTIALS=new Bt("google-credentials-uid"),Bt.FIRST_PARTY=new Bt("first-party-uid"),Bt.MOCK_USER=new Bt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $i="10.12.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ms=new Ea("@firebase/firestore");function mo(){return Ms.logLevel}function ie(t,...e){if(Ms.logLevel<=ke.DEBUG){const n=e.map(Ef);Ms.debug(`Firestore (${$i}): ${t}`,...n)}}function dr(t,...e){if(Ms.logLevel<=ke.ERROR){const n=e.map(Ef);Ms.error(`Firestore (${$i}): ${t}`,...n)}}function Si(t,...e){if(Ms.logLevel<=ke.WARN){const n=e.map(Ef);Ms.warn(`Firestore (${$i}): ${t}`,...n)}}function Ef(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(t="Unexpected state"){const e=`FIRESTORE (${$i}) INTERNAL ASSERTION FAILED: `+t;throw dr(e),new Error(e)}function Ze(t,e){t||ve()}function be(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class de extends En{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y0{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class wO{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Bt.UNAUTHENTICATED))}shutdown(){}}class EO{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class bO{constructor(e){this.t=e,this.currentUser=Bt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){let r=this.i;const s=c=>this.i!==r?(r=this.i,n(c)):Promise.resolve();let i=new Wr;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Wr,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},a=c=>{ie("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit(c=>a(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?a(c):(ie("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Wr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(ie("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ze(typeof r.accessToken=="string"),new Y0(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return Ze(e===null||typeof e=="string"),new Bt(e)}}class IO{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=Bt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class TO{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new IO(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(Bt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class CO{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class AO{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){const r=i=>{i.error!=null&&ie("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,ie("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{ie("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):ie("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Ze(typeof n.token=="string"),this.R=n.token,new CO(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SO(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q0{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=SO(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<n&&(r+=e.charAt(s[i]%e.length))}return r}}function $e(t,e){return t<e?-1:t>e?1:0}function Ri(t,e,n){return t.length===e.length&&t.every((r,s)=>n(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new de(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new de(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new de(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new de(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return It.fromMillis(Date.now())}static fromDate(e){return It.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new It(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?$e(this.nanoseconds,e.nanoseconds):$e(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.timestamp=e}static fromTimestamp(e){return new we(e)}static min(){return new we(new It(0,0))}static max(){return new we(new It(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e,n,r){n===void 0?n=0:n>e.length&&ve(),r===void 0?r=e.length-n:r>e.length-n&&ve(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return la.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof la?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let s=0;s<r;s++){const i=e.get(s),o=n.get(s);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ht extends la{construct(e,n,r){return new ht(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new de(H.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new ht(n)}static emptyPath(){return new ht([])}}const RO=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ot extends la{construct(e,n,r){return new Ot(e,n,r)}static isValidIdentifier(e){return RO.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ot.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ot(["__name__"])}static fromServerFormat(e){const n=[];let r="",s=0;const i=()=>{if(r.length===0)throw new de(H.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new de(H.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new de(H.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(r+=a,s++):(i(),s++)}if(i(),o)throw new de(H.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ot(n)}static emptyPath(){return new Ot([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this.path=e}static fromPath(e){return new ue(ht.fromString(e))}static fromName(e){return new ue(ht.fromString(e).popFirst(5))}static empty(){return new ue(ht.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ht.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ht.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ue(new ht(e.slice()))}}function PO(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,s=we.fromTimestamp(r===1e9?new It(n+1,0):new It(n,r));return new Xr(s,ue.empty(),e)}function xO(t){return new Xr(t.readTime,t.key,-1)}class Xr{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Xr(we.min(),ue.empty(),-1)}static max(){return new Xr(we.max(),ue.empty(),-1)}}function kO(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=ue.comparator(t.documentKey,e.documentKey),n!==0?n:$e(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NO="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class DO{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pa(t){if(t.code!==H.FAILED_PRECONDITION||t.message!==NO)throw t;ie("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&ve(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new j((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(n,i).next(r,s)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof j?n:j.resolve(n)}catch(n){return j.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):j.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):j.reject(n)}static resolve(e){return new j((n,r)=>{n(e)})}static reject(e){return new j((n,r)=>{r(e)})}static waitFor(e){return new j((n,r)=>{let s=0,i=0,o=!1;e.forEach(a=>{++s,a.next(()=>{++i,o&&i===s&&n()},c=>r(c))}),o=!0,i===s&&n()})}static or(e){let n=j.resolve(!1);for(const r of e)n=n.next(s=>s?j.resolve(s):r());return n}static forEach(e,n){const r=[];return e.forEach((s,i)=>{r.push(n.call(this,s,i))}),this.waitFor(r)}static mapArray(e,n){return new j((r,s)=>{const i=e.length,o=new Array(i);let a=0;for(let c=0;c<i;c++){const u=c;n(e[u]).next(h=>{o[u]=h,++a,a===i&&r(o)},h=>s(h))}})}static doWhile(e,n){return new j((r,s)=>{const i=()=>{e()===!0?n().next(()=>{i()},s):r()};i()})}}function OO(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function xa(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}bf.oe=-1;function Kc(t){return t==null}function ec(t){return t===0&&1/t==-1/0}function MO(t){return typeof t=="number"&&Number.isInteger(t)&&!ec(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c_(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function ji(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function X0(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e,n){this.comparator=e,this.root=n||xt.EMPTY}insert(e,n){return new ct(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,xt.BLACK,null,null))}remove(e){return new ct(this.comparator,this.root.remove(e,this.comparator).copy(null,null,xt.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ul(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ul(this.root,e,this.comparator,!1)}getReverseIterator(){return new ul(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ul(this.root,e,this.comparator,!0)}}class ul{constructor(e,n,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?r(e.key,n):1,n&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class xt{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??xt.RED,this.left=s??xt.EMPTY,this.right=i??xt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,s,i){return new xt(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return xt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return xt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,xt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,xt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw ve();const e=this.left.check();if(e!==this.right.check())throw ve();return e+(this.isRed()?0:1)}}xt.EMPTY=null,xt.RED=!0,xt.BLACK=!1;xt.EMPTY=new class{constructor(){this.size=0}get key(){throw ve()}get value(){throw ve()}get color(){throw ve()}get left(){throw ve()}get right(){throw ve()}copy(e,n,r,s,i){return this}insert(e,n,r){return new xt(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e){this.comparator=e,this.data=new ct(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new u_(this.data.getIterator())}getIteratorFrom(e){return new u_(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Mt)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Mt(this.comparator);return n.data=e,n}}class u_{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this.fields=e,e.sort(Ot.comparator)}static empty(){return new xn([])}unionWith(e){let n=new Mt(Ot.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new xn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ri(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new J0("Invalid base64 string: "+i):i}}(e);return new Gt(n)}static fromUint8Array(e){const n=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new Gt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $e(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Gt.EMPTY_BYTE_STRING=new Gt("");const LO=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Jr(t){if(Ze(!!t),typeof t=="string"){let e=0;const n=LO.exec(t);if(Ze(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:yt(t.seconds),nanos:yt(t.nanos)}}function yt(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Ls(t){return typeof t=="string"?Gt.fromBase64String(t):Gt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Tf(t){const e=t.mapValue.fields.__previous_value__;return If(e)?Tf(e):e}function ca(t){const e=Jr(t.mapValue.fields.__local_write_time__.timestampValue);return new It(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VO{constructor(e,n,r,s,i,o,a,c,u){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=c,this.useFetchStreams=u}}class ua{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new ua("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ua&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hl={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function Vs(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?If(t)?4:FO(t)?9007199254740991:10:ve()}function Yn(t,e){if(t===e)return!0;const n=Vs(t);if(n!==Vs(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return ca(t).isEqual(ca(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=Jr(s.timestampValue),a=Jr(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(s,i){return Ls(s.bytesValue).isEqual(Ls(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(s,i){return yt(s.geoPointValue.latitude)===yt(i.geoPointValue.latitude)&&yt(s.geoPointValue.longitude)===yt(i.geoPointValue.longitude)}(t,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return yt(s.integerValue)===yt(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=yt(s.doubleValue),a=yt(i.doubleValue);return o===a?ec(o)===ec(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return Ri(t.arrayValue.values||[],e.arrayValue.values||[],Yn);case 10:return function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(c_(o)!==c_(a))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(a[c]===void 0||!Yn(o[c],a[c])))return!1;return!0}(t,e);default:return ve()}}function ha(t,e){return(t.values||[]).find(n=>Yn(n,e))!==void 0}function Pi(t,e){if(t===e)return 0;const n=Vs(t),r=Vs(e);if(n!==r)return $e(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return $e(t.booleanValue,e.booleanValue);case 2:return function(i,o){const a=yt(i.integerValue||i.doubleValue),c=yt(o.integerValue||o.doubleValue);return a<c?-1:a>c?1:a===c?0:isNaN(a)?isNaN(c)?0:-1:1}(t,e);case 3:return h_(t.timestampValue,e.timestampValue);case 4:return h_(ca(t),ca(e));case 5:return $e(t.stringValue,e.stringValue);case 6:return function(i,o){const a=Ls(i),c=Ls(o);return a.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const a=i.split("/"),c=o.split("/");for(let u=0;u<a.length&&u<c.length;u++){const h=$e(a[u],c[u]);if(h!==0)return h}return $e(a.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const a=$e(yt(i.latitude),yt(o.latitude));return a!==0?a:$e(yt(i.longitude),yt(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return function(i,o){const a=i.values||[],c=o.values||[];for(let u=0;u<a.length&&u<c.length;++u){const h=Pi(a[u],c[u]);if(h)return h}return $e(a.length,c.length)}(t.arrayValue,e.arrayValue);case 10:return function(i,o){if(i===hl.mapValue&&o===hl.mapValue)return 0;if(i===hl.mapValue)return 1;if(o===hl.mapValue)return-1;const a=i.fields||{},c=Object.keys(a),u=o.fields||{},h=Object.keys(u);c.sort(),h.sort();for(let f=0;f<c.length&&f<h.length;++f){const g=$e(c[f],h[f]);if(g!==0)return g;const m=Pi(a[c[f]],u[h[f]]);if(m!==0)return m}return $e(c.length,h.length)}(t.mapValue,e.mapValue);default:throw ve()}}function h_(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return $e(t,e);const n=Jr(t),r=Jr(e),s=$e(n.seconds,r.seconds);return s!==0?s:$e(n.nanos,r.nanos)}function xi(t){return qh(t)}function qh(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Jr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Ls(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return ue.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",s=!0;for(const i of n.values||[])s?s=!1:r+=",",r+=qh(i);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${qh(n.fields[o])}`;return s+"}"}(t.mapValue):ve()}function Hh(t){return!!t&&"integerValue"in t}function Cf(t){return!!t&&"arrayValue"in t}function d_(t){return!!t&&"nullValue"in t}function f_(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function bl(t){return!!t&&"mapValue"in t}function Uo(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return ji(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Uo(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Uo(t.arrayValue.values[n]);return e}return Object.assign({},t)}function FO(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e){this.value=e}static empty(){return new pn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!bl(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Uo(n)}setAll(e){let n=Ot.emptyPath(),r={},s=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const c=this.getFieldsMap(n);this.applyChanges(c,r,s),r={},s=[],n=a.popLast()}o?r[a.lastSegment()]=Uo(o):s.push(a.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,r,s)}delete(e){const n=this.field(e.popLast());bl(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Yn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=n.mapValue.fields[e.get(r)];bl(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,r){ji(n,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new pn(Uo(this.value))}}function Z0(t){const e=[];return ji(t.fields,(n,r)=>{const s=new Ot([n]);if(bl(r)){const i=Z0(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new xn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e,n,r,s,i,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new qt(e,0,we.min(),we.min(),we.min(),pn.empty(),0)}static newFoundDocument(e,n,r,s){return new qt(e,1,n,we.min(),r,s,0)}static newNoDocument(e,n){return new qt(e,2,n,we.min(),we.min(),pn.empty(),0)}static newUnknownDocument(e,n){return new qt(e,3,n,we.min(),we.min(),pn.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=pn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=pn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof qt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new qt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(e,n){this.position=e,this.inclusive=n}}function p_(t,e,n){let r=0;for(let s=0;s<t.position.length;s++){const i=e[s],o=t.position[s];if(i.field.isKeyField()?r=ue.comparator(ue.fromName(o.referenceValue),n.key):r=Pi(o,n.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function g_(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Yn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(e,n="asc"){this.field=e,this.dir=n}}function UO(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{}class Et extends eE{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new $O(e,n,r):n==="array-contains"?new HO(e,r):n==="in"?new WO(e,r):n==="not-in"?new zO(e,r):n==="array-contains-any"?new GO(e,r):new Et(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new jO(e,r):new qO(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Pi(n,this.value)):n!==null&&Vs(this.value)===Vs(n)&&this.matchesComparison(Pi(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ve()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Qn extends eE{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new Qn(e,n)}matches(e){return tE(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function tE(t){return t.op==="and"}function nE(t){return BO(t)&&tE(t)}function BO(t){for(const e of t.filters)if(e instanceof Qn)return!1;return!0}function Wh(t){if(t instanceof Et)return t.field.canonicalString()+t.op.toString()+xi(t.value);if(nE(t))return t.filters.map(e=>Wh(e)).join(",");{const e=t.filters.map(n=>Wh(n)).join(",");return`${t.op}(${e})`}}function rE(t,e){return t instanceof Et?function(r,s){return s instanceof Et&&r.op===s.op&&r.field.isEqual(s.field)&&Yn(r.value,s.value)}(t,e):t instanceof Qn?function(r,s){return s instanceof Qn&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,o,a)=>i&&rE(o,s.filters[a]),!0):!1}(t,e):void ve()}function sE(t){return t instanceof Et?function(n){return`${n.field.canonicalString()} ${n.op} ${xi(n.value)}`}(t):t instanceof Qn?function(n){return n.op.toString()+" {"+n.getFilters().map(sE).join(" ,")+"}"}(t):"Filter"}class $O extends Et{constructor(e,n,r){super(e,n,r),this.key=ue.fromName(r.referenceValue)}matches(e){const n=ue.comparator(e.key,this.key);return this.matchesComparison(n)}}class jO extends Et{constructor(e,n){super(e,"in",n),this.keys=iE("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class qO extends Et{constructor(e,n){super(e,"not-in",n),this.keys=iE("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function iE(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>ue.fromName(r.referenceValue))}class HO extends Et{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Cf(n)&&ha(n.arrayValue,this.value)}}class WO extends Et{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ha(this.value.arrayValue,n)}}class zO extends Et{constructor(e,n){super(e,"not-in",n)}matches(e){if(ha(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!ha(this.value.arrayValue,n)}}class GO extends Et{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Cf(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>ha(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KO{constructor(e,n=null,r=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.ue=null}}function m_(t,e=null,n=[],r=[],s=null,i=null,o=null){return new KO(t,e,n,r,s,i,o)}function Af(t){const e=be(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Wh(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),Kc(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>xi(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>xi(r)).join(",")),e.ue=n}return e.ue}function Sf(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!UO(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!rE(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!g_(t.startAt,e.startAt)&&g_(t.endAt,e.endAt)}function zh(t){return ue.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yc{constructor(e,n=null,r=[],s=[],i=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function YO(t,e,n,r,s,i,o,a){return new Yc(t,e,n,r,s,i,o,a)}function Rf(t){return new Yc(t)}function __(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function QO(t){return t.collectionGroup!==null}function Bo(t){const e=be(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Mt(Ot.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(u=>{u.isInequality()&&(a=a.add(u.field))})}),a})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new nc(i,r))}),n.has(Ot.keyField().canonicalString())||e.ce.push(new nc(Ot.keyField(),r))}return e.ce}function Wn(t){const e=be(t);return e.le||(e.le=XO(e,Bo(t))),e.le}function XO(t,e){if(t.limitType==="F")return m_(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new nc(s.field,i)});const n=t.endAt?new tc(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new tc(t.startAt.position,t.startAt.inclusive):null;return m_(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function Gh(t,e,n){return new Yc(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Qc(t,e){return Sf(Wn(t),Wn(e))&&t.limitType===e.limitType}function oE(t){return`${Af(Wn(t))}|lt:${t.limitType}`}function ri(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(s=>sE(s)).join(", ")}]`),Kc(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(s=>xi(s)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(s=>xi(s)).join(",")),`Target(${r})`}(Wn(t))}; limitType=${t.limitType})`}function Xc(t,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):ue.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(t,e)&&function(r,s){for(const i of Bo(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(t,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(t,e)&&function(r,s){return!(r.startAt&&!function(o,a,c){const u=p_(o,a,c);return o.inclusive?u<=0:u<0}(r.startAt,Bo(r),s)||r.endAt&&!function(o,a,c){const u=p_(o,a,c);return o.inclusive?u>=0:u>0}(r.endAt,Bo(r),s))}(t,e)}function JO(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function aE(t){return(e,n)=>{let r=!1;for(const s of Bo(t)){const i=ZO(s,e,n);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function ZO(t,e,n){const r=t.field.isKeyField()?ue.comparator(e.key,n.key):function(i,o,a){const c=o.data.field(i),u=a.data.field(i);return c!==null&&u!==null?Pi(c,u):ve()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return ve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,n]);s.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[n]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ji(this.inner,(n,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return X0(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eM=new ct(ue.comparator);function fr(){return eM}const lE=new ct(ue.comparator);function bo(...t){let e=lE;for(const n of t)e=e.insert(n.key,n);return e}function cE(t){let e=lE;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function Es(){return $o()}function uE(){return $o()}function $o(){return new qi(t=>t.toString(),(t,e)=>t.isEqual(e))}const tM=new ct(ue.comparator),nM=new Mt(ue.comparator);function Ne(...t){let e=nM;for(const n of t)e=e.add(n);return e}const rM=new Mt($e);function sM(){return rM}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hE(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ec(e)?"-0":e}}function dE(t){return{integerValue:""+t}}function iM(t,e){return MO(e)?dE(e):hE(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(){this._=void 0}}function oM(t,e,n){return t instanceof rc?function(s,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&If(i)&&(i=Tf(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof da?pE(t,e):t instanceof fa?gE(t,e):function(s,i){const o=fE(s,i),a=y_(o)+y_(s.Pe);return Hh(o)&&Hh(s.Pe)?dE(a):hE(s.serializer,a)}(t,e)}function aM(t,e,n){return t instanceof da?pE(t,e):t instanceof fa?gE(t,e):n}function fE(t,e){return t instanceof sc?function(r){return Hh(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class rc extends Jc{}class da extends Jc{constructor(e){super(),this.elements=e}}function pE(t,e){const n=mE(e);for(const r of t.elements)n.some(s=>Yn(s,r))||n.push(r);return{arrayValue:{values:n}}}class fa extends Jc{constructor(e){super(),this.elements=e}}function gE(t,e){let n=mE(e);for(const r of t.elements)n=n.filter(s=>!Yn(s,r));return{arrayValue:{values:n}}}class sc extends Jc{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function y_(t){return yt(t.integerValue||t.doubleValue)}function mE(t){return Cf(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function lM(t,e){return t.field.isEqual(e.field)&&function(r,s){return r instanceof da&&s instanceof da||r instanceof fa&&s instanceof fa?Ri(r.elements,s.elements,Yn):r instanceof sc&&s instanceof sc?Yn(r.Pe,s.Pe):r instanceof rc&&s instanceof rc}(t.transform,e.transform)}class cM{constructor(e,n){this.version=e,this.transformResults=n}}class cr{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new cr}static exists(e){return new cr(void 0,e)}static updateTime(e){return new cr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Il(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Zc{}function _E(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new vE(t.key,cr.none()):new ka(t.key,t.data,cr.none());{const n=t.data,r=pn.empty();let s=new Mt(Ot.comparator);for(let i of e.fields)if(!s.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Hs(t.key,r,new xn(s.toArray()),cr.none())}}function uM(t,e,n){t instanceof ka?function(s,i,o){const a=s.value.clone(),c=w_(s.fieldTransforms,i,o.transformResults);a.setAll(c),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof Hs?function(s,i,o){if(!Il(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=w_(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(yE(s)),c.setAll(a),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function jo(t,e,n,r){return t instanceof ka?function(i,o,a,c){if(!Il(i.precondition,o))return a;const u=i.value.clone(),h=E_(i.fieldTransforms,c,o);return u.setAll(h),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(t,e,n,r):t instanceof Hs?function(i,o,a,c){if(!Il(i.precondition,o))return a;const u=E_(i.fieldTransforms,c,o),h=o.data;return h.setAll(yE(i)),h.setAll(u),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(f=>f.field))}(t,e,n,r):function(i,o,a){return Il(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function hM(t,e){let n=null;for(const r of t.fieldTransforms){const s=e.data.field(r.field),i=fE(r.transform,s||null);i!=null&&(n===null&&(n=pn.empty()),n.set(r.field,i))}return n||null}function v_(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ri(r,s,(i,o)=>lM(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class ka extends Zc{constructor(e,n,r,s=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Hs extends Zc{constructor(e,n,r,s,i=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function yE(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function w_(t,e,n){const r=new Map;Ze(t.length===n.length);for(let s=0;s<n.length;s++){const i=t[s],o=i.transform,a=e.data.field(i.field);r.set(i.field,aM(o,a,n[s]))}return r}function E_(t,e,n){const r=new Map;for(const s of t){const i=s.transform,o=n.data.field(s.field);r.set(s.field,oM(i,o,e))}return r}class vE extends Zc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class dM extends Zc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fM{constructor(e,n,r,s){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&uM(i,e,r[s])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=jo(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=jo(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=uE();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=n.has(s.key)?null:a;const c=_E(o,a);c!==null&&r.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(we.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),Ne())}isEqual(e){return this.batchId===e.batchId&&Ri(this.mutations,e.mutations,(n,r)=>v_(n,r))&&Ri(this.baseMutations,e.baseMutations,(n,r)=>v_(n,r))}}class Pf{constructor(e,n,r,s){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=s}static from(e,n,r){Ze(e.mutations.length===r.length);let s=function(){return tM}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new Pf(e,n,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pM{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gM{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _t,Oe;function mM(t){switch(t){default:return ve();case H.CANCELLED:case H.UNKNOWN:case H.DEADLINE_EXCEEDED:case H.RESOURCE_EXHAUSTED:case H.INTERNAL:case H.UNAVAILABLE:case H.UNAUTHENTICATED:return!1;case H.INVALID_ARGUMENT:case H.NOT_FOUND:case H.ALREADY_EXISTS:case H.PERMISSION_DENIED:case H.FAILED_PRECONDITION:case H.ABORTED:case H.OUT_OF_RANGE:case H.UNIMPLEMENTED:case H.DATA_LOSS:return!0}}function wE(t){if(t===void 0)return dr("GRPC error has no .code"),H.UNKNOWN;switch(t){case _t.OK:return H.OK;case _t.CANCELLED:return H.CANCELLED;case _t.UNKNOWN:return H.UNKNOWN;case _t.DEADLINE_EXCEEDED:return H.DEADLINE_EXCEEDED;case _t.RESOURCE_EXHAUSTED:return H.RESOURCE_EXHAUSTED;case _t.INTERNAL:return H.INTERNAL;case _t.UNAVAILABLE:return H.UNAVAILABLE;case _t.UNAUTHENTICATED:return H.UNAUTHENTICATED;case _t.INVALID_ARGUMENT:return H.INVALID_ARGUMENT;case _t.NOT_FOUND:return H.NOT_FOUND;case _t.ALREADY_EXISTS:return H.ALREADY_EXISTS;case _t.PERMISSION_DENIED:return H.PERMISSION_DENIED;case _t.FAILED_PRECONDITION:return H.FAILED_PRECONDITION;case _t.ABORTED:return H.ABORTED;case _t.OUT_OF_RANGE:return H.OUT_OF_RANGE;case _t.UNIMPLEMENTED:return H.UNIMPLEMENTED;case _t.DATA_LOSS:return H.DATA_LOSS;default:return ve()}}(Oe=_t||(_t={}))[Oe.OK=0]="OK",Oe[Oe.CANCELLED=1]="CANCELLED",Oe[Oe.UNKNOWN=2]="UNKNOWN",Oe[Oe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Oe[Oe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Oe[Oe.NOT_FOUND=5]="NOT_FOUND",Oe[Oe.ALREADY_EXISTS=6]="ALREADY_EXISTS",Oe[Oe.PERMISSION_DENIED=7]="PERMISSION_DENIED",Oe[Oe.UNAUTHENTICATED=16]="UNAUTHENTICATED",Oe[Oe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Oe[Oe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Oe[Oe.ABORTED=10]="ABORTED",Oe[Oe.OUT_OF_RANGE=11]="OUT_OF_RANGE",Oe[Oe.UNIMPLEMENTED=12]="UNIMPLEMENTED",Oe[Oe.INTERNAL=13]="INTERNAL",Oe[Oe.UNAVAILABLE=14]="UNAVAILABLE",Oe[Oe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _M(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yM=new As([4294967295,4294967295],0);function b_(t){const e=_M().encode(t),n=new j0;return n.update(e),new Uint8Array(n.digest())}function I_(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new As([n,r],0),new As([s,i],0)]}class xf{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Io(`Invalid padding: ${n}`);if(r<0)throw new Io(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Io(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Io(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=As.fromNumber(this.Ie)}Ee(e,n,r){let s=e.add(n.multiply(As.fromNumber(r)));return s.compare(yM)===1&&(s=new As([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=b_(e),[r,s]=I_(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);if(!this.de(o))return!1}return!0}static create(e,n,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new xf(i,s,n);return r.forEach(a=>o.insert(a)),o}insert(e){if(this.Ie===0)return;const n=b_(e),[r,s]=I_(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Io extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,n,r,s,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const s=new Map;return s.set(e,Na.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new eu(we.min(),s,new ct($e),fr(),Ne())}}class Na{constructor(e,n,r,s,i){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new Na(r,n,Ne(),Ne(),Ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e,n,r,s){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=s}}class EE{constructor(e,n){this.targetId=e,this.me=n}}class bE{constructor(e,n,r=Gt.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=s}}class T_{constructor(){this.fe=0,this.ge=A_(),this.pe=Gt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}Ce(){let e=Ne(),n=Ne(),r=Ne();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:n=n.add(s);break;case 1:r=r.add(s);break;default:ve()}}),new Na(this.pe,this.ye,e,n,r)}ve(){this.we=!1,this.ge=A_()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Ze(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class vM{constructor(e){this.Le=e,this.Be=new Map,this.ke=fr(),this.qe=C_(),this.Qe=new ct($e)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.ve(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:ve()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,s)=>{this.ze(s)&&n(s)})}He(e){const n=e.targetId,r=e.me.count,s=this.Je(n);if(s){const i=s.target;if(zh(i))if(r===0){const o=new ue(i.path);this.Ue(n,o,qt.newNoDocument(o,we.min()))}else Ze(r===1);else{const o=this.Ye(n);if(o!==r){const a=this.Ze(e),c=a?this.Xe(a,e,o):1;if(c!==0){this.je(n);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,u)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=n;let o,a;try{o=Ls(r).toUint8Array()}catch(c){if(c instanceof J0)return Si("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{a=new xf(o,s,i)}catch(c){return Si(c instanceof Io?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return a.Ie===0?null:a}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let s=0;return r.forEach(i=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.Ue(n,i,null),s++)}),s}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const a=this.Je(o);if(a){if(i.current&&zh(a.target)){const c=new ue(a.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,qt.newNoDocument(c,e))}i.be&&(n.set(o,i.Ce()),i.ve())}});let r=Ne();this.qe.forEach((i,o)=>{let a=!0;o.forEachWhile(c=>{const u=this.Je(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(r=r.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const s=new eu(e,n,this.Qe,this.ke,r);return this.ke=fr(),this.qe=C_(),this.Qe=new ct($e),s}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,n)?s.Fe(n,1):s.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).Ce();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new T_,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Mt($e),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||ie("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new T_),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function C_(){return new ct(ue.comparator)}function A_(){return new ct(ue.comparator)}const wM={asc:"ASCENDING",desc:"DESCENDING"},EM={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},bM={and:"AND",or:"OR"};class IM{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Kh(t,e){return t.useProto3Json||Kc(e)?e:{value:e}}function ic(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function IE(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function TM(t,e){return ic(t,e.toTimestamp())}function zn(t){return Ze(!!t),we.fromTimestamp(function(n){const r=Jr(n);return new It(r.seconds,r.nanos)}(t))}function kf(t,e){return Yh(t,e).canonicalString()}function Yh(t,e){const n=function(s){return new ht(["projects",s.projectId,"databases",s.database])}(t).child("documents");return e===void 0?n:n.child(e)}function TE(t){const e=ht.fromString(t);return Ze(PE(e)),e}function Qh(t,e){return kf(t.databaseId,e.path)}function Xu(t,e){const n=TE(e);if(n.get(1)!==t.databaseId.projectId)throw new de(H.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new de(H.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new ue(AE(n))}function CE(t,e){return kf(t.databaseId,e)}function CM(t){const e=TE(t);return e.length===4?ht.emptyPath():AE(e)}function Xh(t){return new ht(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function AE(t){return Ze(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function S_(t,e,n){return{name:Qh(t,e),fields:n.value.mapValue.fields}}function AM(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:ve()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(u,h){return u.useProto3Json?(Ze(h===void 0||typeof h=="string"),Gt.fromBase64String(h||"")):(Ze(h===void 0||h instanceof Buffer||h instanceof Uint8Array),Gt.fromUint8Array(h||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(u){const h=u.code===void 0?H.UNKNOWN:wE(u.code);return new de(h,u.message||"")}(o);n=new bE(r,s,i,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Xu(t,r.document.name),i=zn(r.document.updateTime),o=r.document.createTime?zn(r.document.createTime):we.min(),a=new pn({mapValue:{fields:r.document.fields}}),c=qt.newFoundDocument(s,i,o,a),u=r.targetIds||[],h=r.removedTargetIds||[];n=new Tl(u,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Xu(t,r.document),i=r.readTime?zn(r.readTime):we.min(),o=qt.newNoDocument(s,i),a=r.removedTargetIds||[];n=new Tl([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Xu(t,r.document),i=r.removedTargetIds||[];n=new Tl([],i,s,null)}else{if(!("filter"in e))return ve();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new gM(s,i),a=r.targetId;n=new EE(a,o)}}return n}function SM(t,e){let n;if(e instanceof ka)n={update:S_(t,e.key,e.value)};else if(e instanceof vE)n={delete:Qh(t,e.key)};else if(e instanceof Hs)n={update:S_(t,e.key,e.data),updateMask:LM(e.fieldMask)};else{if(!(e instanceof dM))return ve();n={verify:Qh(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(i,o){const a=o.transform;if(a instanceof rc)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof da)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof fa)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof sc)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw ve()}(0,r))),e.precondition.isNone||(n.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:TM(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:ve()}(t,e.precondition)),n}function RM(t,e){return t&&t.length>0?(Ze(e!==void 0),t.map(n=>function(s,i){let o=s.updateTime?zn(s.updateTime):zn(i);return o.isEqual(we.min())&&(o=zn(i)),new cM(o,s.transformResults||[])}(n,e))):[]}function PM(t,e){return{documents:[CE(t,e.path)]}}function xM(t,e){const n={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=CE(t,s);const i=function(u){if(u.length!==0)return RE(Qn.create(u,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(u){if(u.length!==0)return u.map(h=>function(g){return{field:si(g.field),direction:DM(g.dir)}}(h))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Kh(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{_t:n,parent:s}}function kM(t){let e=CM(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){Ze(r===1);const h=n.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];n.where&&(i=function(f){const g=SE(f);return g instanceof Qn&&nE(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(f){return f.map(g=>function(C){return new nc(ii(C.field),function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(g))}(n.orderBy));let a=null;n.limit&&(a=function(f){let g;return g=typeof f=="object"?f.value:f,Kc(g)?null:g}(n.limit));let c=null;n.startAt&&(c=function(f){const g=!!f.before,m=f.values||[];return new tc(m,g)}(n.startAt));let u=null;return n.endAt&&(u=function(f){const g=!f.before,m=f.values||[];return new tc(m,g)}(n.endAt)),YO(e,s,o,i,a,"F",c,u)}function NM(t,e){const n=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ve()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function SE(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=ii(n.unaryFilter.field);return Et.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=ii(n.unaryFilter.field);return Et.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ii(n.unaryFilter.field);return Et.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ii(n.unaryFilter.field);return Et.create(o,"!=",{nullValue:"NULL_VALUE"});default:return ve()}}(t):t.fieldFilter!==void 0?function(n){return Et.create(ii(n.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return ve()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Qn.create(n.compositeFilter.filters.map(r=>SE(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return ve()}}(n.compositeFilter.op))}(t):ve()}function DM(t){return wM[t]}function OM(t){return EM[t]}function MM(t){return bM[t]}function si(t){return{fieldPath:t.canonicalString()}}function ii(t){return Ot.fromServerFormat(t.fieldPath)}function RE(t){return t instanceof Et?function(n){if(n.op==="=="){if(f_(n.value))return{unaryFilter:{field:si(n.field),op:"IS_NAN"}};if(d_(n.value))return{unaryFilter:{field:si(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(f_(n.value))return{unaryFilter:{field:si(n.field),op:"IS_NOT_NAN"}};if(d_(n.value))return{unaryFilter:{field:si(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:si(n.field),op:OM(n.op),value:n.value}}}(t):t instanceof Qn?function(n){const r=n.getFilters().map(s=>RE(s));return r.length===1?r[0]:{compositeFilter:{op:MM(n.op),filters:r}}}(t):ve()}function LM(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function PE(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,n,r,s,i=we.min(),o=we.min(),a=Gt.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=c}withSequenceNumber(e){return new Fr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Fr(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Fr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Fr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VM{constructor(e){this.ct=e}}function FM(t){const e=kM({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Gh(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UM{constructor(){this._n=new BM}addToCollectionParentIndex(e,n){return this._n.add(n),j.resolve()}getCollectionParents(e,n){return j.resolve(this._n.getEntries(n))}addFieldIndex(e,n){return j.resolve()}deleteFieldIndex(e,n){return j.resolve()}deleteAllFieldIndexes(e){return j.resolve()}createTargetIndexes(e,n){return j.resolve()}getDocumentsMatchingTarget(e,n){return j.resolve(null)}getIndexType(e,n){return j.resolve(0)}getFieldIndexes(e,n){return j.resolve([])}getNextCollectionGroupToUpdate(e){return j.resolve(null)}getMinOffset(e,n){return j.resolve(Xr.min())}getMinOffsetFromCollectionGroup(e,n){return j.resolve(Xr.min())}updateCollectionGroup(e,n,r){return j.resolve()}updateIndexEntries(e,n){return j.resolve()}}class BM{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n]||new Mt(ht.comparator),i=!s.has(r);return this.index[n]=s.add(r),i}has(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Mt(ht.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e){this.On=e}next(){return this.On+=2,this.On}static Nn(){return new ki(0)}static Ln(){return new ki(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $M{constructor(){this.changes=new qi(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,qt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?j.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jM{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qM{constructor(e,n,r,s){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,n))).next(s=>(r!==null&&jo(r.mutation,s,xn.empty(),It.now()),s))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,Ne()).next(()=>r))}getLocalViewOfDocuments(e,n,r=Ne()){const s=Es();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,r).next(i=>{let o=bo();return i.forEach((a,c)=>{o=o.insert(a,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=Es();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,Ne()))}populateOverlays(e,n,r){const s=[];return r.forEach(i=>{n.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,r,s){let i=fr();const o=$o(),a=function(){return $o()}();return n.forEach((c,u)=>{const h=r.get(u.key);s.has(u.key)&&(h===void 0||h.mutation instanceof Hs)?i=i.insert(u.key,u):h!==void 0?(o.set(u.key,h.mutation.getFieldMask()),jo(h.mutation,u,h.mutation.getFieldMask(),It.now())):o.set(u.key,xn.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((u,h)=>o.set(u,h)),n.forEach((u,h)=>{var f;return a.set(u,new jM(h,(f=o.get(u))!==null&&f!==void 0?f:null))}),a))}recalculateAndSaveOverlays(e,n){const r=$o();let s=new ct((o,a)=>o-a),i=Ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(c=>{const u=n.get(c);if(u===null)return;let h=r.get(c)||xn.empty();h=a.applyToLocalView(u,h),r.set(c,h);const f=(s.get(a.batchId)||Ne()).add(c);s=s.insert(a.batchId,f)})}).next(()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const c=a.getNext(),u=c.key,h=c.value,f=uE();h.forEach(g=>{if(!i.has(g)){const m=_E(n.get(g),r.get(g));m!==null&&f.set(g,m),i=i.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,u,f))}return j.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,s){return function(o){return ue.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):QO(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,s):this.getDocumentsMatchingCollectionQuery(e,n,r,s)}getNextDocuments(e,n,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,s-i.size):j.resolve(Es());let a=-1,c=i;return o.next(u=>j.forEach(u,(h,f)=>(a<f.largestBatchId&&(a=f.largestBatchId),i.get(h)?j.resolve():this.remoteDocumentCache.getEntry(e,h).next(g=>{c=c.insert(h,g)}))).next(()=>this.populateOverlays(e,u,i)).next(()=>this.computeViews(e,c,u,Ne())).next(h=>({batchId:a,changes:cE(h)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new ue(n)).next(r=>{let s=bo();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,n,r,s){const i=n.collectionGroup;let o=bo();return this.indexManager.getCollectionParents(e,i).next(a=>j.forEach(a,c=>{const u=function(f,g){return new Yc(g,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)}(n,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,u,r,s).next(h=>{h.forEach((f,g)=>{o=o.insert(f,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,i,s))).next(o=>{i.forEach((c,u)=>{const h=u.getKey();o.get(h)===null&&(o=o.insert(h,qt.newInvalidDocument(h)))});let a=bo();return o.forEach((c,u)=>{const h=i.get(c);h!==void 0&&jo(h.mutation,u,xn.empty(),It.now()),Xc(n,u)&&(a=a.insert(c,u))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HM{constructor(e){this.serializer=e,this.cr=new Map,this.lr=new Map}getBundleMetadata(e,n){return j.resolve(this.cr.get(n))}saveBundleMetadata(e,n){return this.cr.set(n.id,function(s){return{id:s.id,version:s.version,createTime:zn(s.createTime)}}(n)),j.resolve()}getNamedQuery(e,n){return j.resolve(this.lr.get(n))}saveNamedQuery(e,n){return this.lr.set(n.name,function(s){return{name:s.name,query:FM(s.bundledQuery),readTime:zn(s.readTime)}}(n)),j.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WM{constructor(){this.overlays=new ct(ue.comparator),this.hr=new Map}getOverlay(e,n){return j.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Es();return j.forEach(n,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((s,i)=>{this.ht(e,n,i)}),j.resolve()}removeOverlaysForBatchId(e,n,r){const s=this.hr.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.hr.delete(r)),j.resolve()}getOverlaysForCollection(e,n,r){const s=Es(),i=n.length+1,o=new ue(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const c=a.getNext().value,u=c.getKey();if(!n.isPrefixOf(u.path))break;u.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return j.resolve(s)}getOverlaysForCollectionGroup(e,n,r,s){let i=new ct((u,h)=>u-h);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===n&&u.largestBatchId>r){let h=i.get(u.largestBatchId);h===null&&(h=Es(),i=i.insert(u.largestBatchId,h)),h.set(u.getKey(),u)}}const a=Es(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((u,h)=>a.set(u,h)),!(a.size()>=s)););return j.resolve(a)}ht(e,n,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.hr.get(s.largestBatchId).delete(r.key);this.hr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new pM(n,r));let i=this.hr.get(n);i===void 0&&(i=Ne(),this.hr.set(n,i)),this.hr.set(n,i.add(r.key))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(){this.Pr=new Mt(At.Ir),this.Tr=new Mt(At.Er)}isEmpty(){return this.Pr.isEmpty()}addReference(e,n){const r=new At(e,n);this.Pr=this.Pr.add(r),this.Tr=this.Tr.add(r)}dr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Ar(new At(e,n))}Rr(e,n){e.forEach(r=>this.removeReference(r,n))}Vr(e){const n=new ue(new ht([])),r=new At(n,e),s=new At(n,e+1),i=[];return this.Tr.forEachInRange([r,s],o=>{this.Ar(o),i.push(o.key)}),i}mr(){this.Pr.forEach(e=>this.Ar(e))}Ar(e){this.Pr=this.Pr.delete(e),this.Tr=this.Tr.delete(e)}gr(e){const n=new ue(new ht([])),r=new At(n,e),s=new At(n,e+1);let i=Ne();return this.Tr.forEachInRange([r,s],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new At(e,0),r=this.Pr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class At{constructor(e,n){this.key=e,this.pr=n}static Ir(e,n){return ue.comparator(e.key,n.key)||$e(e.pr,n.pr)}static Er(e,n){return $e(e.pr,n.pr)||ue.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zM{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.yr=1,this.wr=new Mt(At.Ir)}checkEmpty(e){return j.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,s){const i=this.yr;this.yr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new fM(i,n,r,s);this.mutationQueue.push(o);for(const a of s)this.wr=this.wr.add(new At(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return j.resolve(o)}lookupMutationBatch(e,n){return j.resolve(this.Sr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,s=this.br(r),i=s<0?0:s;return j.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return j.resolve(this.mutationQueue.length===0?-1:this.yr-1)}getAllMutationBatches(e){return j.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new At(n,0),s=new At(n,Number.POSITIVE_INFINITY),i=[];return this.wr.forEachInRange([r,s],o=>{const a=this.Sr(o.pr);i.push(a)}),j.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Mt($e);return n.forEach(s=>{const i=new At(s,0),o=new At(s,Number.POSITIVE_INFINITY);this.wr.forEachInRange([i,o],a=>{r=r.add(a.pr)})}),j.resolve(this.Dr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,s=r.length+1;let i=r;ue.isDocumentKey(i)||(i=i.child(""));const o=new At(new ue(i),0);let a=new Mt($e);return this.wr.forEachWhile(c=>{const u=c.key.path;return!!r.isPrefixOf(u)&&(u.length===s&&(a=a.add(c.pr)),!0)},o),j.resolve(this.Dr(a))}Dr(e){const n=[];return e.forEach(r=>{const s=this.Sr(r);s!==null&&n.push(s)}),n}removeMutationBatch(e,n){Ze(this.Cr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.wr;return j.forEach(n.mutations,s=>{const i=new At(s.key,n.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.wr=r})}Mn(e){}containsKey(e,n){const r=new At(n,0),s=this.wr.firstAfterOrEqual(r);return j.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,j.resolve()}Cr(e,n){return this.br(e)}br(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Sr(e){const n=this.br(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GM{constructor(e){this.vr=e,this.docs=function(){return new ct(ue.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,s=this.docs.get(r),i=s?s.size:0,o=this.vr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return j.resolve(r?r.document.mutableCopy():qt.newInvalidDocument(n))}getEntries(e,n){let r=fr();return n.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():qt.newInvalidDocument(s))}),j.resolve(r)}getDocumentsMatchingQuery(e,n,r,s){let i=fr();const o=n.path,a=new ue(o.child("")),c=this.docs.getIteratorFrom(a);for(;c.hasNext();){const{key:u,value:{document:h}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||kO(xO(h),r)<=0||(s.has(h.key)||Xc(n,h))&&(i=i.insert(h.key,h.mutableCopy()))}return j.resolve(i)}getAllFromCollectionGroup(e,n,r,s){ve()}Fr(e,n){return j.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new KM(this)}getSize(e){return j.resolve(this.size)}}class KM extends $M{constructor(e){super(),this.ar=e}applyChanges(e){const n=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?n.push(this.ar.addEntry(e,s)):this.ar.removeEntry(r)}),j.waitFor(n)}getFromCache(e,n){return this.ar.getEntry(e,n)}getAllFromCache(e,n){return this.ar.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YM{constructor(e){this.persistence=e,this.Mr=new qi(n=>Af(n),Sf),this.lastRemoteSnapshotVersion=we.min(),this.highestTargetId=0,this.Or=0,this.Nr=new Nf,this.targetCount=0,this.Lr=ki.Nn()}forEachTarget(e,n){return this.Mr.forEach((r,s)=>n(s)),j.resolve()}getLastRemoteSnapshotVersion(e){return j.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return j.resolve(this.Or)}allocateTargetId(e){return this.highestTargetId=this.Lr.next(),j.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Or&&(this.Or=n),j.resolve()}qn(e){this.Mr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.Lr=new ki(n),this.highestTargetId=n),e.sequenceNumber>this.Or&&(this.Or=e.sequenceNumber)}addTargetData(e,n){return this.qn(n),this.targetCount+=1,j.resolve()}updateTargetData(e,n){return this.qn(n),j.resolve()}removeTargetData(e,n){return this.Mr.delete(n.target),this.Nr.Vr(n.targetId),this.targetCount-=1,j.resolve()}removeTargets(e,n,r){let s=0;const i=[];return this.Mr.forEach((o,a)=>{a.sequenceNumber<=n&&r.get(a.targetId)===null&&(this.Mr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)}),j.waitFor(i).next(()=>s)}getTargetCount(e){return j.resolve(this.targetCount)}getTargetData(e,n){const r=this.Mr.get(n)||null;return j.resolve(r)}addMatchingKeys(e,n,r){return this.Nr.dr(n,r),j.resolve()}removeMatchingKeys(e,n,r){this.Nr.Rr(n,r);const s=this.persistence.referenceDelegate,i=[];return s&&n.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),j.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Nr.Vr(n),j.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Nr.gr(n);return j.resolve(r)}containsKey(e,n){return j.resolve(this.Nr.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QM{constructor(e,n){this.Br={},this.overlays={},this.kr=new bf(0),this.qr=!1,this.qr=!0,this.referenceDelegate=e(this),this.Qr=new YM(this),this.indexManager=new UM,this.remoteDocumentCache=function(s){return new GM(s)}(r=>this.referenceDelegate.Kr(r)),this.serializer=new VM(n),this.$r=new HM(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.qr=!1,Promise.resolve()}get started(){return this.qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new WM,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.Br[e.toKey()];return r||(r=new zM(n,this.referenceDelegate),this.Br[e.toKey()]=r),r}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.$r}runTransaction(e,n,r){ie("MemoryPersistence","Starting transaction:",e);const s=new XM(this.kr.next());return this.referenceDelegate.Ur(),r(s).next(i=>this.referenceDelegate.Wr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Gr(e,n){return j.or(Object.values(this.Br).map(r=>()=>r.containsKey(e,n)))}}class XM extends DO{constructor(e){super(),this.currentSequenceNumber=e}}class Df{constructor(e){this.persistence=e,this.zr=new Nf,this.jr=null}static Hr(e){return new Df(e)}get Jr(){if(this.jr)return this.jr;throw ve()}addReference(e,n,r){return this.zr.addReference(r,n),this.Jr.delete(r.toString()),j.resolve()}removeReference(e,n,r){return this.zr.removeReference(r,n),this.Jr.add(r.toString()),j.resolve()}markPotentiallyOrphaned(e,n){return this.Jr.add(n.toString()),j.resolve()}removeTarget(e,n){this.zr.Vr(n.targetId).forEach(s=>this.Jr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(s=>{s.forEach(i=>this.Jr.add(i.toString()))}).next(()=>r.removeTargetData(e,n))}Ur(){this.jr=new Set}Wr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return j.forEach(this.Jr,r=>{const s=ue.fromPath(r);return this.Yr(e,s).next(i=>{i||n.removeEntry(s,we.min())})}).next(()=>(this.jr=null,n.apply(e)))}updateLimboDocument(e,n){return this.Yr(e,n).next(r=>{r?this.Jr.delete(n.toString()):this.Jr.add(n.toString())})}Kr(e){return 0}Yr(e,n){return j.or([()=>j.resolve(this.zr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Gr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Of{constructor(e,n,r,s){this.targetId=e,this.fromCache=n,this.qi=r,this.Qi=s}static Ki(e,n){let r=Ne(),s=Ne();for(const i of n.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Of(e,n.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JM{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZM{constructor(){this.$i=!1,this.Ui=!1,this.Wi=100,this.Gi=function(){return y1()?8:OO(Lt())>0?6:4}()}initialize(e,n){this.zi=e,this.indexManager=n,this.$i=!0}getDocumentsMatchingQuery(e,n,r,s){const i={result:null};return this.ji(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Hi(e,n,s,r).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new JM;return this.Ji(e,n,o).next(a=>{if(i.result=a,this.Ui)return this.Yi(e,n,o,a.size)})}).next(()=>i.result)}Yi(e,n,r,s){return r.documentReadCount<this.Wi?(mo()<=ke.DEBUG&&ie("QueryEngine","SDK will not create cache indexes for query:",ri(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Wi,"documents"),j.resolve()):(mo()<=ke.DEBUG&&ie("QueryEngine","Query:",ri(n),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Gi*s?(mo()<=ke.DEBUG&&ie("QueryEngine","The SDK decides to create cache indexes for query:",ri(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Wn(n))):j.resolve())}ji(e,n){if(__(n))return j.resolve(null);let r=Wn(n);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(n.limit!==null&&s===1&&(n=Gh(n,null,"F"),r=Wn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const o=Ne(...i);return this.zi.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,r).next(c=>{const u=this.Zi(n,a);return this.Xi(n,u,o,c.readTime)?this.ji(e,Gh(n,null,"F")):this.es(e,u,n,c)}))})))}Hi(e,n,r,s){return __(n)||s.isEqual(we.min())?j.resolve(null):this.zi.getDocuments(e,r).next(i=>{const o=this.Zi(n,i);return this.Xi(n,o,r,s)?j.resolve(null):(mo()<=ke.DEBUG&&ie("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),ri(n)),this.es(e,o,n,PO(s,-1)).next(a=>a))})}Zi(e,n){let r=new Mt(aE(e));return n.forEach((s,i)=>{Xc(e,i)&&(r=r.add(i))}),r}Xi(e,n,r,s){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ji(e,n,r){return mo()<=ke.DEBUG&&ie("QueryEngine","Using full collection scan to execute query:",ri(n)),this.zi.getDocumentsMatchingQuery(e,n,Xr.min(),r)}es(e,n,r,s){return this.zi.getDocumentsMatchingQuery(e,r,s).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eL{constructor(e,n,r,s){this.persistence=e,this.ts=n,this.serializer=s,this.ns=new ct($e),this.rs=new qi(i=>Af(i),Sf),this.ss=new Map,this.os=e.getRemoteDocumentCache(),this.Qr=e.getTargetCache(),this.$r=e.getBundleCache(),this._s(r)}_s(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new qM(this.os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.os.setIndexManager(this.indexManager),this.ts.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.ns))}}function tL(t,e,n,r){return new eL(t,e,n,r)}async function xE(t,e){const n=be(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let s;return n.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,n._s(e),n.mutationQueue.getAllMutationBatches(r))).next(i=>{const o=[],a=[];let c=Ne();for(const u of s){o.push(u.batchId);for(const h of u.mutations)c=c.add(h.key)}for(const u of i){a.push(u.batchId);for(const h of u.mutations)c=c.add(h.key)}return n.localDocuments.getDocuments(r,c).next(u=>({us:u,removedBatchIds:o,addedBatchIds:a}))})})}function nL(t,e){const n=be(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=n.os.newChangeBuffer({trackRemovals:!0});return function(a,c,u,h){const f=u.batch,g=f.keys();let m=j.resolve();return g.forEach(C=>{m=m.next(()=>h.getEntry(c,C)).next(R=>{const x=u.docVersions.get(C);Ze(x!==null),R.version.compareTo(x)<0&&(f.applyToRemoteDocument(R,u),R.isValidDocument()&&(R.setReadTime(u.commitVersion),h.addEntry(R)))})}),m.next(()=>a.mutationQueue.removeMutationBatch(c,f))}(n,r,e,i).next(()=>i.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(a){let c=Ne();for(let u=0;u<a.mutationResults.length;++u)a.mutationResults[u].transformResults.length>0&&(c=c.add(a.batch.mutations[u].key));return c}(e))).next(()=>n.localDocuments.getDocuments(r,s))})}function kE(t){const e=be(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Qr.getLastRemoteSnapshotVersion(n))}function rL(t,e){const n=be(t),r=e.snapshotVersion;let s=n.ns;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.os.newChangeBuffer({trackRemovals:!0});s=n.ns;const a=[];e.targetChanges.forEach((h,f)=>{const g=s.get(f);if(!g)return;a.push(n.Qr.removeMatchingKeys(i,h.removedDocuments,f).next(()=>n.Qr.addMatchingKeys(i,h.addedDocuments,f)));let m=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?m=m.withResumeToken(Gt.EMPTY_BYTE_STRING,we.min()).withLastLimboFreeSnapshotVersion(we.min()):h.resumeToken.approximateByteSize()>0&&(m=m.withResumeToken(h.resumeToken,r)),s=s.insert(f,m),function(R,x,L){return R.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=3e8?!0:L.addedDocuments.size+L.modifiedDocuments.size+L.removedDocuments.size>0}(g,m,h)&&a.push(n.Qr.updateTargetData(i,m))});let c=fr(),u=Ne();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(i,h))}),a.push(sL(i,o,e.documentUpdates).next(h=>{c=h.cs,u=h.ls})),!r.isEqual(we.min())){const h=n.Qr.getLastRemoteSnapshotVersion(i).next(f=>n.Qr.setTargetsMetadata(i,i.currentSequenceNumber,r));a.push(h)}return j.waitFor(a).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,c,u)).next(()=>c)}).then(i=>(n.ns=s,i))}function sL(t,e,n){let r=Ne(),s=Ne();return n.forEach(i=>r=r.add(i)),e.getEntries(t,r).next(i=>{let o=fr();return n.forEach((a,c)=>{const u=i.get(a);c.isFoundDocument()!==u.isFoundDocument()&&(s=s.add(a)),c.isNoDocument()&&c.version.isEqual(we.min())?(e.removeEntry(a,c.readTime),o=o.insert(a,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(a,c)):ie("LocalStore","Ignoring outdated watch update for ",a,". Current version:",u.version," Watch version:",c.version)}),{cs:o,ls:s}})}function iL(t,e){const n=be(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function oL(t,e){const n=be(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return n.Qr.getTargetData(r,e).next(i=>i?(s=i,j.resolve(s)):n.Qr.allocateTargetId(r).next(o=>(s=new Fr(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Qr.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=n.ns.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.ns=n.ns.insert(r.targetId,r),n.rs.set(e,r.targetId)),r})}async function Jh(t,e,n){const r=be(t),s=r.ns.get(e),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,o=>r.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!xa(o))throw o;ie("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.ns=r.ns.remove(e),r.rs.delete(s.target)}function R_(t,e,n){const r=be(t);let s=we.min(),i=Ne();return r.persistence.runTransaction("Execute query","readwrite",o=>function(c,u,h){const f=be(c),g=f.rs.get(h);return g!==void 0?j.resolve(f.ns.get(g)):f.Qr.getTargetData(u,h)}(r,o,Wn(e)).next(a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,r.Qr.getMatchingKeysForTargetId(o,a.targetId).next(c=>{i=c})}).next(()=>r.ts.getDocumentsMatchingQuery(o,e,n?s:we.min(),n?i:Ne())).next(a=>(aL(r,JO(e),a),{documents:a,hs:i})))}function aL(t,e,n){let r=t.ss.get(e)||we.min();n.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),t.ss.set(e,r)}class P_{constructor(){this.activeTargetIds=sM()}As(e){this.activeTargetIds=this.activeTargetIds.add(e)}Rs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ds(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class lL{constructor(){this.no=new P_,this.ro={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e){return this.no.As(e),this.ro[e]||"not-current"}updateQueryState(e,n,r){this.ro[e]=n}removeLocalQueryTarget(e){this.no.Rs(e)}isLocalQueryTarget(e){return this.no.activeTargetIds.has(e)}clearQueryState(e){delete this.ro[e]}getAllActiveQueryTargets(){return this.no.activeTargetIds}isActiveQueryTarget(e){return this.no.activeTargetIds.has(e)}start(){return this.no=new P_,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cL{io(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x_{constructor(){this.so=()=>this.oo(),this._o=()=>this.ao(),this.uo=[],this.co()}io(e){this.uo.push(e)}shutdown(){window.removeEventListener("online",this.so),window.removeEventListener("offline",this._o)}co(){window.addEventListener("online",this.so),window.addEventListener("offline",this._o)}oo(){ie("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.uo)e(0)}ao(){ie("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.uo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dl=null;function Ju(){return dl===null?dl=function(){return 268435456+Math.round(2147483648*Math.random())}():dl++,"0x"+dl.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uL={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hL{constructor(e){this.lo=e.lo,this.ho=e.ho}Po(e){this.Io=e}To(e){this.Eo=e}Ao(e){this.Ro=e}onMessage(e){this.Vo=e}close(){this.ho()}send(e){this.lo(e)}mo(){this.Io()}fo(){this.Eo()}po(e){this.Ro(e)}yo(e){this.Vo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut="WebChannelConnection";class dL extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.wo=r+"://"+n.host,this.So=`projects/${s}/databases/${i}`,this.bo=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Do(){return!1}Co(n,r,s,i,o){const a=Ju(),c=this.vo(n,r.toUriEncodedString());ie("RestConnection",`Sending RPC '${n}' ${a}:`,c,s);const u={"google-cloud-resource-prefix":this.So,"x-goog-request-params":this.bo};return this.Fo(u,i,o),this.Mo(n,c,u,s).then(h=>(ie("RestConnection",`Received RPC '${n}' ${a}: `,h),h),h=>{throw Si("RestConnection",`RPC '${n}' ${a} failed with error: `,h,"url: ",c,"request:",s),h})}xo(n,r,s,i,o,a){return this.Co(n,r,s,i,o)}Fo(n,r,s){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+$i}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,o)=>n[o]=i),s&&s.headers.forEach((i,o)=>n[o]=i)}vo(n,r){const s=uL[n];return`${this.wo}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Mo(e,n,r,s){const i=Ju();return new Promise((o,a)=>{const c=new q0;c.setWithCredentials(!0),c.listenOnce(W0.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case El.NO_ERROR:const h=c.getResponseJson();ie(Ut,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(h)),o(h);break;case El.TIMEOUT:ie(Ut,`RPC '${e}' ${i} timed out`),a(new de(H.DEADLINE_EXCEEDED,"Request time out"));break;case El.HTTP_ERROR:const f=c.getStatus();if(ie(Ut,`RPC '${e}' ${i} failed with status:`,f,"response text:",c.getResponseText()),f>0){let g=c.getResponseJson();Array.isArray(g)&&(g=g[0]);const m=g==null?void 0:g.error;if(m&&m.status&&m.message){const C=function(x){const L=x.toLowerCase().replace(/_/g,"-");return Object.values(H).indexOf(L)>=0?L:H.UNKNOWN}(m.status);a(new de(C,m.message))}else a(new de(H.UNKNOWN,"Server responded with status "+c.getStatus()))}else a(new de(H.UNAVAILABLE,"Connection failed."));break;default:ve()}}finally{ie(Ut,`RPC '${e}' ${i} completed.`)}});const u=JSON.stringify(s);ie(Ut,`RPC '${e}' ${i} sending request:`,s),c.send(n,"POST",u,r,15)})}Oo(e,n,r){const s=Ju(),i=[this.wo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=K0(),a=G0(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.xmlHttpFactory=new H0({})),this.Fo(c.initMessageHeaders,n,r),c.encodeInitMessageHeaders=!0;const h=i.join("");ie(Ut,`Creating RPC '${e}' stream ${s}: ${h}`,c);const f=o.createWebChannel(h,c);let g=!1,m=!1;const C=new hL({lo:x=>{m?ie(Ut,`Not sending because RPC '${e}' stream ${s} is closed:`,x):(g||(ie(Ut,`Opening RPC '${e}' stream ${s} transport.`),f.open(),g=!0),ie(Ut,`RPC '${e}' stream ${s} sending:`,x),f.send(x))},ho:()=>f.close()}),R=(x,L,F)=>{x.listen(L,B=>{try{F(B)}catch(N){setTimeout(()=>{throw N},0)}})};return R(f,Eo.EventType.OPEN,()=>{m||(ie(Ut,`RPC '${e}' stream ${s} transport opened.`),C.mo())}),R(f,Eo.EventType.CLOSE,()=>{m||(m=!0,ie(Ut,`RPC '${e}' stream ${s} transport closed`),C.po())}),R(f,Eo.EventType.ERROR,x=>{m||(m=!0,Si(Ut,`RPC '${e}' stream ${s} transport errored:`,x),C.po(new de(H.UNAVAILABLE,"The operation could not be completed")))}),R(f,Eo.EventType.MESSAGE,x=>{var L;if(!m){const F=x.data[0];Ze(!!F);const B=F,N=B.error||((L=B[0])===null||L===void 0?void 0:L.error);if(N){ie(Ut,`RPC '${e}' stream ${s} received error:`,N);const Q=N.status;let $=function(v){const T=_t[v];if(T!==void 0)return wE(T)}(Q),A=N.message;$===void 0&&($=H.INTERNAL,A="Unknown error status: "+Q+" with message "+N.message),m=!0,C.po(new de($,A)),f.close()}else ie(Ut,`RPC '${e}' stream ${s} received:`,F),C.yo(F)}}),R(a,z0.STAT_EVENT,x=>{x.stat===jh.PROXY?ie(Ut,`RPC '${e}' stream ${s} detected buffering proxy`):x.stat===jh.NOPROXY&&ie(Ut,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{C.fo()},0),C}}function Zu(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(t){return new IM(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NE{constructor(e,n,r=1e3,s=1.5,i=6e4){this.oi=e,this.timerId=n,this.No=r,this.Lo=s,this.Bo=i,this.ko=0,this.qo=null,this.Qo=Date.now(),this.reset()}reset(){this.ko=0}Ko(){this.ko=this.Bo}$o(e){this.cancel();const n=Math.floor(this.ko+this.Uo()),r=Math.max(0,Date.now()-this.Qo),s=Math.max(0,n-r);s>0&&ie("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.qo=this.oi.enqueueAfterDelay(this.timerId,s,()=>(this.Qo=Date.now(),e())),this.ko*=this.Lo,this.ko<this.No&&(this.ko=this.No),this.ko>this.Bo&&(this.ko=this.Bo)}Wo(){this.qo!==null&&(this.qo.skipDelay(),this.qo=null)}cancel(){this.qo!==null&&(this.qo.cancel(),this.qo=null)}Uo(){return(Math.random()-.5)*this.ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DE{constructor(e,n,r,s,i,o,a,c){this.oi=e,this.Go=r,this.zo=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=c,this.state=0,this.jo=0,this.Ho=null,this.Jo=null,this.stream=null,this.Yo=new NE(e,n)}Zo(){return this.state===1||this.state===5||this.Xo()}Xo(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.e_()}async stop(){this.Zo()&&await this.close(0)}t_(){this.state=0,this.Yo.reset()}n_(){this.Xo()&&this.Ho===null&&(this.Ho=this.oi.enqueueAfterDelay(this.Go,6e4,()=>this.r_()))}i_(e){this.s_(),this.stream.send(e)}async r_(){if(this.Xo())return this.close(0)}s_(){this.Ho&&(this.Ho.cancel(),this.Ho=null)}o_(){this.Jo&&(this.Jo.cancel(),this.Jo=null)}async close(e,n){this.s_(),this.o_(),this.Yo.cancel(),this.jo++,e!==4?this.Yo.reset():n&&n.code===H.RESOURCE_EXHAUSTED?(dr(n.toString()),dr("Using maximum backoff delay to prevent overloading the backend."),this.Yo.Ko()):n&&n.code===H.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.__(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ao(n)}__(){}auth(){this.state=1;const e=this.a_(this.jo),n=this.jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.jo===n&&this.u_(r,s)},r=>{e(()=>{const s=new de(H.UNKNOWN,"Fetching auth token failed: "+r.message);return this.c_(s)})})}u_(e,n){const r=this.a_(this.jo);this.stream=this.l_(e,n),this.stream.Po(()=>{r(()=>this.listener.Po())}),this.stream.To(()=>{r(()=>(this.state=2,this.Jo=this.oi.enqueueAfterDelay(this.zo,1e4,()=>(this.Xo()&&(this.state=3),Promise.resolve())),this.listener.To()))}),this.stream.Ao(s=>{r(()=>this.c_(s))}),this.stream.onMessage(s=>{r(()=>this.onMessage(s))})}e_(){this.state=5,this.Yo.$o(async()=>{this.state=0,this.start()})}c_(e){return ie("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}a_(e){return n=>{this.oi.enqueueAndForget(()=>this.jo===e?n():(ie("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class fL extends DE{constructor(e,n,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}l_(e,n){return this.connection.Oo("Listen",e,n)}onMessage(e){this.Yo.reset();const n=AM(this.serializer,e),r=function(i){if(!("targetChange"in i))return we.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?we.min():o.readTime?zn(o.readTime):we.min()}(e);return this.listener.h_(n,r)}P_(e){const n={};n.database=Xh(this.serializer),n.addTarget=function(i,o){let a;const c=o.target;if(a=zh(c)?{documents:PM(i,c)}:{query:xM(i,c)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=IE(i,o.resumeToken);const u=Kh(i,o.expectedCount);u!==null&&(a.expectedCount=u)}else if(o.snapshotVersion.compareTo(we.min())>0){a.readTime=ic(i,o.snapshotVersion.toTimestamp());const u=Kh(i,o.expectedCount);u!==null&&(a.expectedCount=u)}return a}(this.serializer,e);const r=NM(this.serializer,e);r&&(n.labels=r),this.i_(n)}I_(e){const n={};n.database=Xh(this.serializer),n.removeTarget=e,this.i_(n)}}class pL extends DE{constructor(e,n,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i,this.T_=!1}get E_(){return this.T_}start(){this.T_=!1,this.lastStreamToken=void 0,super.start()}__(){this.T_&&this.d_([])}l_(e,n){return this.connection.Oo("Write",e,n)}onMessage(e){if(Ze(!!e.streamToken),this.lastStreamToken=e.streamToken,this.T_){this.Yo.reset();const n=RM(e.writeResults,e.commitTime),r=zn(e.commitTime);return this.listener.A_(r,n)}return Ze(!e.writeResults||e.writeResults.length===0),this.T_=!0,this.listener.R_()}V_(){const e={};e.database=Xh(this.serializer),this.i_(e)}d_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>SM(this.serializer,r))};this.i_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gL extends class{}{constructor(e,n,r,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.m_=!1}f_(){if(this.m_)throw new de(H.FAILED_PRECONDITION,"The client has already been terminated.")}Co(e,n,r,s){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Co(e,Yh(n,r),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new de(H.UNKNOWN,i.toString())})}xo(e,n,r,s,i){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.xo(e,Yh(n,r),s,o,a,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new de(H.UNKNOWN,o.toString())})}terminate(){this.m_=!0,this.connection.terminate()}}class mL{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.g_=0,this.p_=null,this.y_=!0}w_(){this.g_===0&&(this.S_("Unknown"),this.p_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.p_=null,this.b_("Backend didn't respond within 10 seconds."),this.S_("Offline"),Promise.resolve())))}D_(e){this.state==="Online"?this.S_("Unknown"):(this.g_++,this.g_>=1&&(this.C_(),this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.S_("Offline")))}set(e){this.C_(),this.g_=0,e==="Online"&&(this.y_=!1),this.S_(e)}S_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}b_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.y_?(dr(n),this.y_=!1):ie("OnlineStateTracker",n)}C_(){this.p_!==null&&(this.p_.cancel(),this.p_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _L{constructor(e,n,r,s,i){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.v_=[],this.F_=new Map,this.M_=new Set,this.x_=[],this.O_=i,this.O_.io(o=>{r.enqueueAndForget(async()=>{Ws(this)&&(ie("RemoteStore","Restarting streams for network reachability change."),await async function(c){const u=be(c);u.M_.add(4),await Da(u),u.N_.set("Unknown"),u.M_.delete(4),await nu(u)}(this))})}),this.N_=new mL(r,s)}}async function nu(t){if(Ws(t))for(const e of t.x_)await e(!0)}async function Da(t){for(const e of t.x_)await e(!1)}function OE(t,e){const n=be(t);n.F_.has(e.targetId)||(n.F_.set(e.targetId,e),Ff(n)?Vf(n):Hi(n).Xo()&&Lf(n,e))}function Mf(t,e){const n=be(t),r=Hi(n);n.F_.delete(e),r.Xo()&&ME(n,e),n.F_.size===0&&(r.Xo()?r.n_():Ws(n)&&n.N_.set("Unknown"))}function Lf(t,e){if(t.L_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(we.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Hi(t).P_(e)}function ME(t,e){t.L_.xe(e),Hi(t).I_(e)}function Vf(t){t.L_=new vM({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.F_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Hi(t).start(),t.N_.w_()}function Ff(t){return Ws(t)&&!Hi(t).Zo()&&t.F_.size>0}function Ws(t){return be(t).M_.size===0}function LE(t){t.L_=void 0}async function yL(t){t.N_.set("Online")}async function vL(t){t.F_.forEach((e,n)=>{Lf(t,e)})}async function wL(t,e){LE(t),Ff(t)?(t.N_.D_(e),Vf(t)):t.N_.set("Unknown")}async function EL(t,e,n){if(t.N_.set("Online"),e instanceof bE&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const a of i.targetIds)s.F_.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.F_.delete(a),s.L_.removeTarget(a))}(t,e)}catch(r){ie("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await oc(t,r)}else if(e instanceof Tl?t.L_.Ke(e):e instanceof EE?t.L_.He(e):t.L_.We(e),!n.isEqual(we.min()))try{const r=await kE(t.localStore);n.compareTo(r)>=0&&await function(i,o){const a=i.L_.rt(o);return a.targetChanges.forEach((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.F_.get(u);h&&i.F_.set(u,h.withResumeToken(c.resumeToken,o))}}),a.targetMismatches.forEach((c,u)=>{const h=i.F_.get(c);if(!h)return;i.F_.set(c,h.withResumeToken(Gt.EMPTY_BYTE_STRING,h.snapshotVersion)),ME(i,c);const f=new Fr(h.target,c,u,h.sequenceNumber);Lf(i,f)}),i.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(r){ie("RemoteStore","Failed to raise snapshot:",r),await oc(t,r)}}async function oc(t,e,n){if(!xa(e))throw e;t.M_.add(1),await Da(t),t.N_.set("Offline"),n||(n=()=>kE(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{ie("RemoteStore","Retrying IndexedDB access"),await n(),t.M_.delete(1),await nu(t)})}function VE(t,e){return e().catch(n=>oc(t,n,e))}async function ru(t){const e=be(t),n=Zr(e);let r=e.v_.length>0?e.v_[e.v_.length-1].batchId:-1;for(;bL(e);)try{const s=await iL(e.localStore,r);if(s===null){e.v_.length===0&&n.n_();break}r=s.batchId,IL(e,s)}catch(s){await oc(e,s)}FE(e)&&UE(e)}function bL(t){return Ws(t)&&t.v_.length<10}function IL(t,e){t.v_.push(e);const n=Zr(t);n.Xo()&&n.E_&&n.d_(e.mutations)}function FE(t){return Ws(t)&&!Zr(t).Zo()&&t.v_.length>0}function UE(t){Zr(t).start()}async function TL(t){Zr(t).V_()}async function CL(t){const e=Zr(t);for(const n of t.v_)e.d_(n.mutations)}async function AL(t,e,n){const r=t.v_.shift(),s=Pf.from(r,e,n);await VE(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await ru(t)}async function SL(t,e){e&&Zr(t).E_&&await async function(r,s){if(function(o){return mM(o)&&o!==H.ABORTED}(s.code)){const i=r.v_.shift();Zr(r).t_(),await VE(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await ru(r)}}(t,e),FE(t)&&UE(t)}async function k_(t,e){const n=be(t);n.asyncQueue.verifyOperationInProgress(),ie("RemoteStore","RemoteStore received new credentials");const r=Ws(n);n.M_.add(3),await Da(n),r&&n.N_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.M_.delete(3),await nu(n)}async function RL(t,e){const n=be(t);e?(n.M_.delete(2),await nu(n)):e||(n.M_.add(2),await Da(n),n.N_.set("Unknown"))}function Hi(t){return t.B_||(t.B_=function(n,r,s){const i=be(n);return i.f_(),new fL(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Po:yL.bind(null,t),To:vL.bind(null,t),Ao:wL.bind(null,t),h_:EL.bind(null,t)}),t.x_.push(async e=>{e?(t.B_.t_(),Ff(t)?Vf(t):t.N_.set("Unknown")):(await t.B_.stop(),LE(t))})),t.B_}function Zr(t){return t.k_||(t.k_=function(n,r,s){const i=be(n);return i.f_(),new pL(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Po:()=>Promise.resolve(),To:TL.bind(null,t),Ao:SL.bind(null,t),R_:CL.bind(null,t),A_:AL.bind(null,t)}),t.x_.push(async e=>{e?(t.k_.t_(),await ru(t)):(await t.k_.stop(),t.v_.length>0&&(ie("RemoteStore",`Stopping write stream with ${t.v_.length} pending writes`),t.v_=[]))})),t.k_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,n,r,s,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Wr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,s,i){const o=Date.now()+r,a=new Uf(e,n,o,s,i);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new de(H.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Bf(t,e){if(dr("AsyncQueue",`${e}: ${t}`),xa(t))return new de(H.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(e){this.comparator=e?(n,r)=>e(n,r)||ue.comparator(n.key,r.key):(n,r)=>ue.comparator(n.key,r.key),this.keyedMap=bo(),this.sortedSet=new ct(this.comparator)}static emptySet(e){return new mi(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof mi)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new mi;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(){this.q_=new ct(ue.comparator)}track(e){const n=e.doc.key,r=this.q_.get(n);r?e.type!==0&&r.type===3?this.q_=this.q_.insert(n,e):e.type===3&&r.type!==1?this.q_=this.q_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.q_=this.q_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.q_=this.q_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.q_=this.q_.remove(n):e.type===1&&r.type===2?this.q_=this.q_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.q_=this.q_.insert(n,{type:2,doc:e.doc}):ve():this.q_=this.q_.insert(n,e)}Q_(){const e=[];return this.q_.inorderTraversal((n,r)=>{e.push(r)}),e}}class Ni{constructor(e,n,r,s,i,o,a,c,u){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,n,r,s,i){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new Ni(e,n,mi.emptySet(n),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Qc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==r[s].type||!n[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PL{constructor(){this.K_=void 0,this.U_=[]}W_(){return this.U_.some(e=>e.G_())}}class xL{constructor(){this.queries=new qi(e=>oE(e),Qc),this.onlineState="Unknown",this.z_=new Set}}async function kL(t,e){const n=be(t);let r=3;const s=e.query;let i=n.queries.get(s);i?!i.W_()&&e.G_()&&(r=2):(i=new PL,r=e.G_()?0:1);try{switch(r){case 0:i.K_=await n.onListen(s,!0);break;case 1:i.K_=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const a=Bf(o,`Initialization of query '${ri(e.query)}' failed`);return void e.onError(a)}n.queries.set(s,i),i.U_.push(e),e.j_(n.onlineState),i.K_&&e.H_(i.K_)&&$f(n)}async function NL(t,e){const n=be(t),r=e.query;let s=3;const i=n.queries.get(r);if(i){const o=i.U_.indexOf(e);o>=0&&(i.U_.splice(o,1),i.U_.length===0?s=e.G_()?0:1:!i.W_()&&e.G_()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function DL(t,e){const n=be(t);let r=!1;for(const s of e){const i=s.query,o=n.queries.get(i);if(o){for(const a of o.U_)a.H_(s)&&(r=!0);o.K_=s}}r&&$f(n)}function OL(t,e,n){const r=be(t),s=r.queries.get(e);if(s)for(const i of s.U_)i.onError(n);r.queries.delete(e)}function $f(t){t.z_.forEach(e=>{e.next()})}var Zh,D_;(D_=Zh||(Zh={})).J_="default",D_.Cache="cache";class ML{constructor(e,n,r){this.query=e,this.Y_=n,this.Z_=!1,this.X_=null,this.onlineState="Unknown",this.options=r||{}}H_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Ni(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Z_?this.ea(e)&&(this.Y_.next(e),n=!0):this.ta(e,this.onlineState)&&(this.na(e),n=!0),this.X_=e,n}onError(e){this.Y_.error(e)}j_(e){this.onlineState=e;let n=!1;return this.X_&&!this.Z_&&this.ta(this.X_,e)&&(this.na(this.X_),n=!0),n}ta(e,n){if(!e.fromCache||!this.G_())return!0;const r=n!=="Offline";return(!this.options.ra||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ea(e){if(e.docChanges.length>0)return!0;const n=this.X_&&this.X_.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}na(e){e=Ni.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Z_=!0,this.Y_.next(e)}G_(){return this.options.source!==Zh.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BE{constructor(e){this.key=e}}class $E{constructor(e){this.key=e}}class LL{constructor(e,n){this.query=e,this.la=n,this.ha=null,this.hasCachedResults=!1,this.current=!1,this.Pa=Ne(),this.mutatedKeys=Ne(),this.Ia=aE(e),this.Ta=new mi(this.Ia)}get Ea(){return this.la}da(e,n){const r=n?n.Aa:new N_,s=n?n.Ta:this.Ta;let i=n?n.mutatedKeys:this.mutatedKeys,o=s,a=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,u=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((h,f)=>{const g=s.get(h),m=Xc(this.query,f)?f:null,C=!!g&&this.mutatedKeys.has(g.key),R=!!m&&(m.hasLocalMutations||this.mutatedKeys.has(m.key)&&m.hasCommittedMutations);let x=!1;g&&m?g.data.isEqual(m.data)?C!==R&&(r.track({type:3,doc:m}),x=!0):this.Ra(g,m)||(r.track({type:2,doc:m}),x=!0,(c&&this.Ia(m,c)>0||u&&this.Ia(m,u)<0)&&(a=!0)):!g&&m?(r.track({type:0,doc:m}),x=!0):g&&!m&&(r.track({type:1,doc:g}),x=!0,(c||u)&&(a=!0)),x&&(m?(o=o.add(m),i=R?i.add(h):i.delete(h)):(o=o.delete(h),i=i.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),i=i.delete(h.key),r.track({type:1,doc:h})}return{Ta:o,Aa:r,Xi:a,mutatedKeys:i}}Ra(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,s){const i=this.Ta;this.Ta=e.Ta,this.mutatedKeys=e.mutatedKeys;const o=e.Aa.Q_();o.sort((h,f)=>function(m,C){const R=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ve()}};return R(m)-R(C)}(h.type,f.type)||this.Ia(h.doc,f.doc)),this.Va(r),s=s!=null&&s;const a=n&&!s?this.ma():[],c=this.Pa.size===0&&this.current&&!s?1:0,u=c!==this.ha;return this.ha=c,o.length!==0||u?{snapshot:new Ni(this.query,e.Ta,i,o,e.mutatedKeys,c===0,u,!1,!!r&&r.resumeToken.approximateByteSize()>0),fa:a}:{fa:a}}j_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ta:this.Ta,Aa:new N_,mutatedKeys:this.mutatedKeys,Xi:!1},!1)):{fa:[]}}ga(e){return!this.la.has(e)&&!!this.Ta.has(e)&&!this.Ta.get(e).hasLocalMutations}Va(e){e&&(e.addedDocuments.forEach(n=>this.la=this.la.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.la=this.la.delete(n)),this.current=e.current)}ma(){if(!this.current)return[];const e=this.Pa;this.Pa=Ne(),this.Ta.forEach(r=>{this.ga(r.key)&&(this.Pa=this.Pa.add(r.key))});const n=[];return e.forEach(r=>{this.Pa.has(r)||n.push(new $E(r))}),this.Pa.forEach(r=>{e.has(r)||n.push(new BE(r))}),n}pa(e){this.la=e.hs,this.Pa=Ne();const n=this.da(e.documents);return this.applyChanges(n,!0)}ya(){return Ni.fromInitialDocuments(this.query,this.Ta,this.mutatedKeys,this.ha===0,this.hasCachedResults)}}class VL{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class FL{constructor(e){this.key=e,this.wa=!1}}class UL{constructor(e,n,r,s,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Sa={},this.ba=new qi(a=>oE(a),Qc),this.Da=new Map,this.Ca=new Set,this.va=new ct(ue.comparator),this.Fa=new Map,this.Ma=new Nf,this.xa={},this.Oa=new Map,this.Na=ki.Ln(),this.onlineState="Unknown",this.La=void 0}get isPrimaryClient(){return this.La===!0}}async function BL(t,e,n=!0){const r=GE(t);let s;const i=r.ba.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.ya()):s=await jE(r,e,n,!0),s}async function $L(t,e){const n=GE(t);await jE(n,e,!0,!1)}async function jE(t,e,n,r){const s=await oL(t.localStore,Wn(e)),i=s.targetId,o=n?t.sharedClientState.addLocalQueryTarget(i):"not-current";let a;return r&&(a=await jL(t,e,i,o==="current",s.resumeToken)),t.isPrimaryClient&&n&&OE(t.remoteStore,s),a}async function jL(t,e,n,r,s){t.Ba=(f,g,m)=>async function(R,x,L,F){let B=x.view.da(L);B.Xi&&(B=await R_(R.localStore,x.query,!1).then(({documents:A})=>x.view.da(A,B)));const N=F&&F.targetChanges.get(x.targetId),Q=F&&F.targetMismatches.get(x.targetId)!=null,$=x.view.applyChanges(B,R.isPrimaryClient,N,Q);return M_(R,x.targetId,$.fa),$.snapshot}(t,f,g,m);const i=await R_(t.localStore,e,!0),o=new LL(e,i.hs),a=o.da(i.documents),c=Na.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",s),u=o.applyChanges(a,t.isPrimaryClient,c);M_(t,n,u.fa);const h=new VL(e,n,o);return t.ba.set(e,h),t.Da.has(n)?t.Da.get(n).push(e):t.Da.set(n,[e]),u.snapshot}async function qL(t,e,n){const r=be(t),s=r.ba.get(e),i=r.Da.get(s.targetId);if(i.length>1)return r.Da.set(s.targetId,i.filter(o=>!Qc(o,e))),void r.ba.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Jh(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Mf(r.remoteStore,s.targetId),ed(r,s.targetId)}).catch(Pa)):(ed(r,s.targetId),await Jh(r.localStore,s.targetId,!0))}async function HL(t,e){const n=be(t),r=n.ba.get(e),s=n.Da.get(r.targetId);n.isPrimaryClient&&s.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Mf(n.remoteStore,r.targetId))}async function WL(t,e,n){const r=JL(t);try{const s=await function(o,a){const c=be(o),u=It.now(),h=a.reduce((m,C)=>m.add(C.key),Ne());let f,g;return c.persistence.runTransaction("Locally write mutations","readwrite",m=>{let C=fr(),R=Ne();return c.os.getEntries(m,h).next(x=>{C=x,C.forEach((L,F)=>{F.isValidDocument()||(R=R.add(L))})}).next(()=>c.localDocuments.getOverlayedDocuments(m,C)).next(x=>{f=x;const L=[];for(const F of a){const B=hM(F,f.get(F.key).overlayedDocument);B!=null&&L.push(new Hs(F.key,B,Z0(B.value.mapValue),cr.exists(!0)))}return c.mutationQueue.addMutationBatch(m,u,L,a)}).next(x=>{g=x;const L=x.applyToLocalDocumentSet(f,R);return c.documentOverlayCache.saveOverlays(m,x.batchId,L)})}).then(()=>({batchId:g.batchId,changes:cE(f)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(o,a,c){let u=o.xa[o.currentUser.toKey()];u||(u=new ct($e)),u=u.insert(a,c),o.xa[o.currentUser.toKey()]=u}(r,s.batchId,n),await Oa(r,s.changes),await ru(r.remoteStore)}catch(s){const i=Bf(s,"Failed to persist write");n.reject(i)}}async function qE(t,e){const n=be(t);try{const r=await rL(n.localStore,e);e.targetChanges.forEach((s,i)=>{const o=n.Fa.get(i);o&&(Ze(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.wa=!0:s.modifiedDocuments.size>0?Ze(o.wa):s.removedDocuments.size>0&&(Ze(o.wa),o.wa=!1))}),await Oa(n,r,e)}catch(r){await Pa(r)}}function O_(t,e,n){const r=be(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const s=[];r.ba.forEach((i,o)=>{const a=o.view.j_(e);a.snapshot&&s.push(a.snapshot)}),function(o,a){const c=be(o);c.onlineState=a;let u=!1;c.queries.forEach((h,f)=>{for(const g of f.U_)g.j_(a)&&(u=!0)}),u&&$f(c)}(r.eventManager,e),s.length&&r.Sa.h_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function zL(t,e,n){const r=be(t);r.sharedClientState.updateQueryState(e,"rejected",n);const s=r.Fa.get(e),i=s&&s.key;if(i){let o=new ct(ue.comparator);o=o.insert(i,qt.newNoDocument(i,we.min()));const a=Ne().add(i),c=new eu(we.min(),new Map,new ct($e),o,a);await qE(r,c),r.va=r.va.remove(i),r.Fa.delete(e),jf(r)}else await Jh(r.localStore,e,!1).then(()=>ed(r,e,n)).catch(Pa)}async function GL(t,e){const n=be(t),r=e.batch.batchId;try{const s=await nL(n.localStore,e);WE(n,r,null),HE(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Oa(n,s)}catch(s){await Pa(s)}}async function KL(t,e,n){const r=be(t);try{const s=await function(o,a){const c=be(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let h;return c.mutationQueue.lookupMutationBatch(u,a).next(f=>(Ze(f!==null),h=f.keys(),c.mutationQueue.removeMutationBatch(u,f))).next(()=>c.mutationQueue.performConsistencyCheck(u)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(u,h,a)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,h)).next(()=>c.localDocuments.getDocuments(u,h))})}(r.localStore,e);WE(r,e,n),HE(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Oa(r,s)}catch(s){await Pa(s)}}function HE(t,e){(t.Oa.get(e)||[]).forEach(n=>{n.resolve()}),t.Oa.delete(e)}function WE(t,e,n){const r=be(t);let s=r.xa[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(n?i.reject(n):i.resolve(),s=s.remove(e)),r.xa[r.currentUser.toKey()]=s}}function ed(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Da.get(e))t.ba.delete(r),n&&t.Sa.ka(r,n);t.Da.delete(e),t.isPrimaryClient&&t.Ma.Vr(e).forEach(r=>{t.Ma.containsKey(r)||zE(t,r)})}function zE(t,e){t.Ca.delete(e.path.canonicalString());const n=t.va.get(e);n!==null&&(Mf(t.remoteStore,n),t.va=t.va.remove(e),t.Fa.delete(n),jf(t))}function M_(t,e,n){for(const r of n)r instanceof BE?(t.Ma.addReference(r.key,e),YL(t,r)):r instanceof $E?(ie("SyncEngine","Document no longer in limbo: "+r.key),t.Ma.removeReference(r.key,e),t.Ma.containsKey(r.key)||zE(t,r.key)):ve()}function YL(t,e){const n=e.key,r=n.path.canonicalString();t.va.get(n)||t.Ca.has(r)||(ie("SyncEngine","New document in limbo: "+n),t.Ca.add(r),jf(t))}function jf(t){for(;t.Ca.size>0&&t.va.size<t.maxConcurrentLimboResolutions;){const e=t.Ca.values().next().value;t.Ca.delete(e);const n=new ue(ht.fromString(e)),r=t.Na.next();t.Fa.set(r,new FL(n)),t.va=t.va.insert(n,r),OE(t.remoteStore,new Fr(Wn(Rf(n.path)),r,"TargetPurposeLimboResolution",bf.oe))}}async function Oa(t,e,n){const r=be(t),s=[],i=[],o=[];r.ba.isEmpty()||(r.ba.forEach((a,c)=>{o.push(r.Ba(c,e,n).then(u=>{if((u||n)&&r.isPrimaryClient&&r.sharedClientState.updateQueryState(c.targetId,u!=null&&u.fromCache?"not-current":"current"),u){s.push(u);const h=Of.Ki(c.targetId,u);i.push(h)}}))}),await Promise.all(o),r.Sa.h_(s),await async function(c,u){const h=be(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",f=>j.forEach(u,g=>j.forEach(g.qi,m=>h.persistence.referenceDelegate.addReference(f,g.targetId,m)).next(()=>j.forEach(g.Qi,m=>h.persistence.referenceDelegate.removeReference(f,g.targetId,m)))))}catch(f){if(!xa(f))throw f;ie("LocalStore","Failed to update sequence numbers: "+f)}for(const f of u){const g=f.targetId;if(!f.fromCache){const m=h.ns.get(g),C=m.snapshotVersion,R=m.withLastLimboFreeSnapshotVersion(C);h.ns=h.ns.insert(g,R)}}}(r.localStore,i))}async function QL(t,e){const n=be(t);if(!n.currentUser.isEqual(e)){ie("SyncEngine","User change. New user:",e.toKey());const r=await xE(n.localStore,e);n.currentUser=e,function(i,o){i.Oa.forEach(a=>{a.forEach(c=>{c.reject(new de(H.CANCELLED,o))})}),i.Oa.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Oa(n,r.us)}}function XL(t,e){const n=be(t),r=n.Fa.get(e);if(r&&r.wa)return Ne().add(r.key);{let s=Ne();const i=n.Da.get(e);if(!i)return s;for(const o of i){const a=n.ba.get(o);s=s.unionWith(a.view.Ea)}return s}}function GE(t){const e=be(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=qE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=XL.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=zL.bind(null,e),e.Sa.h_=DL.bind(null,e.eventManager),e.Sa.ka=OL.bind(null,e.eventManager),e}function JL(t){const e=be(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=GL.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=KL.bind(null,e),e}class L_{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=tu(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,n){return null}createIndexBackfillerScheduler(e,n){return null}createLocalStore(e){return tL(this.persistence,new ZM,e.initialUser,this.serializer)}createPersistence(e){return new QM(Df.Hr,this.serializer)}createSharedClientState(e){return new lL}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class ZL{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>O_(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=QL.bind(null,this.syncEngine),await RL(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new xL}()}createDatastore(e){const n=tu(e.databaseInfo.databaseId),r=function(i){return new dL(i)}(e.databaseInfo);return function(i,o,a,c){return new gL(i,o,a,c)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,s,i,o,a){return new _L(r,s,i,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>O_(this.syncEngine,n,0),function(){return x_.D()?new x_:new cL}())}createSyncEngine(e,n){return function(s,i,o,a,c,u,h){const f=new UL(s,i,o,a,c,u);return h&&(f.La=!0),f}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e;await async function(r){const s=be(r);ie("RemoteStore","RemoteStore shutting down."),s.M_.add(5),await Da(s),s.O_.shutdown(),s.N_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eV{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Ka(this.observer.next,e)}error(e){this.observer.error?this.Ka(this.observer.error,e):dr("Uncaught Error in snapshot listener:",e.toString())}$a(){this.muted=!0}Ka(e,n){this.muted||setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tV{constructor(e,n,r,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=s,this.user=Bt.UNAUTHENTICATED,this.clientId=Q0.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(r,async i=>{ie("FirestoreClient","Received user=",i.uid),await this.authCredentialListener(i),this.user=i}),this.appCheckCredentials.start(r,i=>(ie("FirestoreClient","Received new app check token=",i),this.appCheckCredentialListener(i,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new de(H.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Wr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Bf(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function eh(t,e){t.asyncQueue.verifyOperationInProgress(),ie("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async s=>{r.isEqual(s)||(await xE(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function V_(t,e){t.asyncQueue.verifyOperationInProgress();const n=await rV(t);ie("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>k_(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,s)=>k_(e.remoteStore,s)),t._onlineComponents=e}function nV(t){return t.name==="FirebaseError"?t.code===H.FAILED_PRECONDITION||t.code===H.UNIMPLEMENTED:!(typeof DOMException<"u"&&t instanceof DOMException)||t.code===22||t.code===20||t.code===11}async function rV(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){ie("FirestoreClient","Using user provided OfflineComponentProvider");try{await eh(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!nV(n))throw n;Si("Error using user provided cache. Falling back to memory cache: "+n),await eh(t,new L_)}}else ie("FirestoreClient","Using default OfflineComponentProvider"),await eh(t,new L_);return t._offlineComponents}async function KE(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(ie("FirestoreClient","Using user provided OnlineComponentProvider"),await V_(t,t._uninitializedComponentsProvider._online)):(ie("FirestoreClient","Using default OnlineComponentProvider"),await V_(t,new ZL))),t._onlineComponents}function sV(t){return KE(t).then(e=>e.syncEngine)}async function iV(t){const e=await KE(t),n=e.eventManager;return n.onListen=BL.bind(null,e.syncEngine),n.onUnlisten=qL.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=$L.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=HL.bind(null,e.syncEngine),n}function oV(t,e,n={}){const r=new Wr;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,u){const h=new eV({next:g=>{o.enqueueAndForget(()=>NL(i,f));const m=g.docs.has(a);!m&&g.fromCache?u.reject(new de(H.UNAVAILABLE,"Failed to get document because the client is offline.")):m&&g.fromCache&&c&&c.source==="server"?u.reject(new de(H.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(g)},error:g=>u.reject(g)}),f=new ML(Rf(a.path),h,{includeMetadataChanges:!0,ra:!0});return kL(i,f)}(await iV(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YE(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F_=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aV(t,e,n){if(!n)throw new de(H.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function lV(t,e,n,r){if(e===!0&&r===!0)throw new de(H.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function U_(t){if(!ue.isDocumentKey(t))throw new de(H.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function qf(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":ve()}function pa(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new de(H.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=qf(t);throw new de(H.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new de(H.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new de(H.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}lV("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=YE((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new de(H.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new de(H.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new de(H.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Hf{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new B_({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new de(H.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new de(H.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new B_(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new wO;switch(r.type){case"firstParty":return new TO(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new de(H.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=F_.get(n);r&&(ie("ComponentProvider","Removing Datastore"),F_.delete(n),r.terminate())}(this),Promise.resolve()}}function cV(t,e,n,r={}){var s;const i=(t=pa(t,Hf))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Si("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),r.mockUserToken){let a,c;if(typeof r.mockUserToken=="string")a=r.mockUserToken,c=Bt.MOCK_USER;else{a=Gv(r.mockUserToken,(s=t._app)===null||s===void 0?void 0:s.options.projectId);const u=r.mockUserToken.sub||r.mockUserToken.user_id;if(!u)throw new de(H.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Bt(u)}t._authCredentials=new EO(new Y0(a,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Wf(this.firestore,e,this._query)}}class yn{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ga(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new yn(this.firestore,e,this._key)}}class ga extends Wf{constructor(e,n,r){super(e,n,Rf(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new yn(this.firestore,null,new ue(e))}withConverter(e){return new ga(this.firestore,e,this._path)}}function QE(t,e,...n){if(t=ft(t),arguments.length===1&&(e=Q0.newId()),aV("doc","path",e),t instanceof Hf){const r=ht.fromString(e,...n);return U_(r),new yn(t,null,new ue(r))}{if(!(t instanceof yn||t instanceof ga))throw new de(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ht.fromString(e,...n));return U_(r),new yn(t.firestore,t instanceof ga?t.converter:null,new ue(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uV{constructor(){this.iu=Promise.resolve(),this.su=[],this.ou=!1,this._u=[],this.au=null,this.uu=!1,this.cu=!1,this.lu=[],this.Yo=new NE(this,"async_queue_retry"),this.hu=()=>{const n=Zu();n&&ie("AsyncQueue","Visibility state changed to "+n.visibilityState),this.Yo.Wo()};const e=Zu();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.hu)}get isShuttingDown(){return this.ou}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pu(),this.Iu(e)}enterRestrictedMode(e){if(!this.ou){this.ou=!0,this.cu=e||!1;const n=Zu();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.hu)}}enqueue(e){if(this.Pu(),this.ou)return new Promise(()=>{});const n=new Wr;return this.Iu(()=>this.ou&&this.cu?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.su.push(e),this.Tu()))}async Tu(){if(this.su.length!==0){try{await this.su[0](),this.su.shift(),this.Yo.reset()}catch(e){if(!xa(e))throw e;ie("AsyncQueue","Operation failed with retryable error: "+e)}this.su.length>0&&this.Yo.$o(()=>this.Tu())}}Iu(e){const n=this.iu.then(()=>(this.uu=!0,e().catch(r=>{this.au=r,this.uu=!1;const s=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(r);throw dr("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.uu=!1,r))));return this.iu=n,n}enqueueAfterDelay(e,n,r){this.Pu(),this.lu.indexOf(e)>-1&&(n=0);const s=Uf.createAndSchedule(this,e,n,r,i=>this.Eu(i));return this._u.push(s),s}Pu(){this.au&&ve()}verifyOperationInProgress(){}async du(){let e;do e=this.iu,await e;while(e!==this.iu)}Au(e){for(const n of this._u)if(n.timerId===e)return!0;return!1}Ru(e){return this.du().then(()=>{this._u.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this._u)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.du()})}Vu(e){this.lu.push(e)}Eu(e){const n=this._u.indexOf(e);this._u.splice(n,1)}}class zf extends Hf{constructor(e,n,r,s){super(e,n,r,s),this.type="firestore",this._queue=function(){return new uV}(),this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||JE(this),this._firestoreClient.terminate()}}function hV(t,e){const n=typeof t=="object"?t:ba(),r=typeof t=="string"?t:"(default)",s=mr(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Nd("firestore");i&&cV(s,...i)}return s}function XE(t){return t._firestoreClient||JE(t),t._firestoreClient.verifyNotTerminated(),t._firestoreClient}function JE(t){var e,n,r;const s=t._freezeSettings(),i=function(a,c,u,h){return new VO(a,c,u,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,YE(h.experimentalLongPollingOptions),h.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,s);t._firestoreClient=new tV(t._authCredentials,t._appCheckCredentials,t._queue,i),!((n=s.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._firestoreClient._uninitializedComponentsProvider={_offlineKind:s.localCache.kind,_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Di(Gt.fromBase64String(e))}catch(n){throw new de(H.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Di(Gt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gf{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new de(H.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ot(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZE{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new de(H.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new de(H.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return $e(this._lat,e._lat)||$e(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dV=/^__.*__$/;class fV{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Hs(e,this.data,this.fieldMask,n,this.fieldTransforms):new ka(e,this.data,n,this.fieldTransforms)}}function eb(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ve()}}class Yf{constructor(e,n,r,s,i,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.mu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get fu(){return this.settings.fu}gu(e){return new Yf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}pu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.gu({path:r,yu:!1});return s.wu(e),s}Su(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.gu({path:r,yu:!1});return s.mu(),s}bu(e){return this.gu({path:void 0,yu:!0})}Du(e){return ac(e,this.settings.methodName,this.settings.Cu||!1,this.path,this.settings.vu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}mu(){if(this.path)for(let e=0;e<this.path.length;e++)this.wu(this.path.get(e))}wu(e){if(e.length===0)throw this.Du("Document fields must not be empty");if(eb(this.fu)&&dV.test(e))throw this.Du('Document fields cannot begin and end with "__"')}}class pV{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||tu(e)}Fu(e,n,r,s=!1){return new Yf({fu:e,methodName:n,vu:r,path:Ot.emptyPath(),yu:!1,Cu:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function gV(t){const e=t._freezeSettings(),n=tu(t._databaseId);return new pV(t._databaseId,!!e.ignoreUndefinedProperties,n)}function mV(t,e,n,r,s,i={}){const o=t.Fu(i.merge||i.mergeFields?2:0,e,n,s);sb("Data must be an object, but it was:",o,r);const a=nb(r,o);let c,u;if(i.merge)c=new xn(o.fieldMask),u=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const f of i.mergeFields){const g=_V(e,f,n);if(!o.contains(g))throw new de(H.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);vV(h,g)||h.push(g)}c=new xn(h),u=o.fieldTransforms.filter(f=>c.covers(f.field))}else c=null,u=o.fieldTransforms;return new fV(new pn(a),c,u)}function tb(t,e){if(rb(t=ft(t)))return sb("Unsupported field value:",e,t),nb(t,e);if(t instanceof ZE)return function(r,s){if(!eb(s.fu))throw s.Du(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Du(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.yu&&e.fu!==4)throw e.Du("Nested arrays are not supported");return function(r,s){const i=[];let o=0;for(const a of r){let c=tb(a,s.bu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(t,e)}return function(r,s){if((r=ft(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return iM(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=It.fromDate(r);return{timestampValue:ic(s.serializer,i)}}if(r instanceof It){const i=new It(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ic(s.serializer,i)}}if(r instanceof Kf)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Di)return{bytesValue:IE(s.serializer,r._byteString)};if(r instanceof yn){const i=s.databaseId,o=r.firestore._databaseId;if(!o.isEqual(i))throw s.Du(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:kf(r.firestore._databaseId||s.databaseId,r._key.path)}}throw s.Du(`Unsupported field value: ${qf(r)}`)}(t,e)}function nb(t,e){const n={};return X0(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ji(t,(r,s)=>{const i=tb(s,e.pu(r));i!=null&&(n[r]=i)}),{mapValue:{fields:n}}}function rb(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof It||t instanceof Kf||t instanceof Di||t instanceof yn||t instanceof ZE)}function sb(t,e,n){if(!rb(n)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(n)){const r=qf(n);throw r==="an object"?e.Du(t+" a custom object"):e.Du(t+" "+r)}}function _V(t,e,n){if((e=ft(e))instanceof Gf)return e._internalPath;if(typeof e=="string")return ib(t,e);throw ac("Field path arguments must be of type string or ",t,!1,void 0,n)}const yV=new RegExp("[~\\*/\\[\\]]");function ib(t,e,n){if(e.search(yV)>=0)throw ac(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Gf(...e.split("."))._internalPath}catch{throw ac(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function ac(t,e,n,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new de(H.INVALID_ARGUMENT,a+t+c)}function vV(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,n,r,s,i){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new yn(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new wV(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(ab("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class wV extends ob{data(){return super.data()}}function ab(t,e){return typeof e=="string"?ib(t,e):e instanceof Gf?e._internalPath:e._delegate._internalPath}class EV{convertValue(e,n="none"){switch(Vs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return yt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Ls(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 10:return this.convertObject(e.mapValue,n);default:throw ve()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return ji(e,(s,i)=>{r[s]=this.convertValue(i,n)}),r}convertGeoPoint(e){return new Kf(yt(e.latitude),yt(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Tf(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(ca(e));default:return null}}convertTimestamp(e){const n=Jr(e);return new It(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=ht.fromString(e);Ze(PE(r));const s=new ua(r.get(1),r.get(3)),i=new ue(r.popFirst(5));return s.isEqual(n)||dr(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bV(t,e,n){let r;return r=t?t.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IV{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class lb extends ob{constructor(e,n,r,s,i,o){super(e,n,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new TV(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(ab("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class TV extends lb{data(e={}){return super.data(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cb(t){t=pa(t,yn);const e=pa(t.firestore,zf);return oV(XE(e),t._key).then(n=>SV(e,t,n))}class CV extends EV{constructor(e){super(),this.firestore=e}convertBytes(e){return new Di(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new yn(this.firestore,null,n)}}function ub(t,e,n){t=pa(t,yn);const r=pa(t.firestore,zf),s=bV(t.converter,e);return AV(r,[mV(gV(r),"setDoc",t._key,s,t.converter!==null,n).toMutation(t._key,cr.none())])}function AV(t,e){return function(r,s){const i=new Wr;return r.asyncQueue.enqueueAndForget(async()=>WL(await sV(r),s,i)),i.promise}(XE(t),e)}function SV(t,e,n){const r=n.docs.get(e._key),s=new CV(t);return new lb(t,s,e._key,r,new IV(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(s){$i=s})($s),vn(new un("firestore",(r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),a=new zf(new bO(r.getProvider("auth-internal")),new AO(r.getProvider("app-check-internal")),function(u,h){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new de(H.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ua(u.options.projectId,h)}(o,s),o);return i=Object.assign({useFetchStreams:n},i),a._setSettings(i),a},"PUBLIC").setMultipleInstances(!0)),Wt(l_,"4.6.2",e),Wt(l_,"4.6.2","esm2017")})();function Qf(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]]);return n}function hb(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const RV=hb,db=new Bs("auth","Firebase",hb());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lc=new Ea("@firebase/auth");function PV(t,...e){lc.logLevel<=ke.WARN&&lc.warn(`Auth (${$s}): ${t}`,...e)}function Cl(t,...e){lc.logLevel<=ke.ERROR&&lc.error(`Auth (${$s}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(t,...e){throw Jf(t,...e)}function Dn(t,...e){return Jf(t,...e)}function Xf(t,e,n){const r=Object.assign(Object.assign({},RV()),{[e]:n});return new Bs("auth","Firebase",r).create(e,{appName:t.name})}function zr(t){return Xf(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function xV(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&wn(t,"argument-error"),Xf(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jf(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return db.create(t,...e)}function me(t,e,...n){if(!t)throw Jf(e,...n)}function sr(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Cl(e),new Error(e)}function pr(t,e){t||sr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function td(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function kV(){return $_()==="http:"||$_()==="https:"}function $_(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NV(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(kV()||Kv()||"connection"in navigator)?navigator.onLine:!0}function DV(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ma{constructor(e,n){this.shortDelay=e,this.longDelay=n,pr(n>e,"Short delay should be less than long delay!"),this.isMobile=Dd()||Yv()}get(){return NV()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zf(t,e){pr(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fb{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;sr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;sr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;sr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OV={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MV=new Ma(3e4,6e4);function zs(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function rs(t,e,n,r,s={}){return pb(t,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const a=Ui(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();return c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode),fb.fetch()(gb(t,t.config.apiHost,n,a),Object.assign({method:e,headers:c,referrerPolicy:"no-referrer"},i))})}async function pb(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},OV),e);try{const s=new VV(t),i=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw fl(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[c,u]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw fl(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw fl(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw fl(t,"user-disabled",o);const h=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Xf(t,h,u);wn(t,h)}}catch(s){if(s instanceof En)throw s;wn(t,"network-request-failed",{message:String(s)})}}async function su(t,e,n,r,s={}){const i=await rs(t,e,n,r,s);return"mfaPendingCredential"in i&&wn(t,"multi-factor-auth-required",{_serverResponse:i}),i}function gb(t,e,n,r){const s=`${e}${n}?${r}`;return t.config.emulator?Zf(t.config,s):`${t.config.apiScheme}://${s}`}function LV(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class VV{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Dn(this.auth,"network-request-failed")),MV.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function fl(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=Dn(t,e,r);return s.customData._tokenResponse=n,s}function j_(t){return t!==void 0&&t.enterprise!==void 0}class FV{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return LV(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function UV(t,e){return rs(t,"GET","/v2/recaptchaConfig",zs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function BV(t,e){return rs(t,"POST","/v1/accounts:delete",e)}async function mb(t,e){return rs(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qo(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function $V(t,e=!1){const n=ft(t),r=await n.getIdToken(e),s=ep(r);me(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:qo(th(s.auth_time)),issuedAtTime:qo(th(s.iat)),expirationTime:qo(th(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function th(t){return Number(t)*1e3}function ep(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Cl("JWT malformed, contained fewer than 3 sections"),null;try{const s=Vl(n);return s?JSON.parse(s):(Cl("Failed to decode base64 JWT payload"),null)}catch(s){return Cl("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function q_(t){const e=ep(t);return me(e,"internal-error"),me(typeof e.exp<"u","internal-error"),me(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ma(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof En&&jV(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function jV({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qV{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=qo(this.lastLoginAt),this.creationTime=qo(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cc(t){var e;const n=t.auth,r=await t.getIdToken(),s=await ma(t,mb(n,{idToken:r}));me(s==null?void 0:s.users.length,n,"internal-error");const i=s.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?_b(i.providerUserInfo):[],a=WV(t.providerData,o),c=t.isAnonymous,u=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),h=c?u:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new nd(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(t,f)}async function HV(t){const e=ft(t);await cc(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function WV(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function _b(t){return t.map(e=>{var{providerId:n}=e,r=Qf(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zV(t,e){const n=await pb(t,{},async()=>{const r=Ui({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=gb(t,s,"/v1/token",`key=${i}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",fb.fetch()(o,{method:"POST",headers:a,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function GV(t,e){return rs(t,"POST","/v2/accounts:revokeToken",zs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){me(e.idToken,"internal-error"),me(typeof e.idToken<"u","internal-error"),me(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):q_(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){me(e.length!==0,"internal-error");const n=q_(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(me(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:i}=await zV(e,n);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:i}=n,o=new _i;return r&&(me(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(me(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(me(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new _i,this.toJSON())}_performRefresh(){return sr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rr(t,e){me(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ir{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,i=Qf(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new qV(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new nd(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await ma(this,this.stsTokenManager.getToken(this.auth,e));return me(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return $V(this,e)}reload(){return HV(this)}_assign(e){this!==e&&(me(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ir(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){me(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await cc(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(jn(this.auth.app))return Promise.reject(zr(this.auth));const e=await this.getIdToken();return await ma(this,BV(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,s,i,o,a,c,u,h;const f=(r=n.displayName)!==null&&r!==void 0?r:void 0,g=(s=n.email)!==null&&s!==void 0?s:void 0,m=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,C=(o=n.photoURL)!==null&&o!==void 0?o:void 0,R=(a=n.tenantId)!==null&&a!==void 0?a:void 0,x=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,L=(u=n.createdAt)!==null&&u!==void 0?u:void 0,F=(h=n.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:B,emailVerified:N,isAnonymous:Q,providerData:$,stsTokenManager:A}=n;me(B&&A,e,"internal-error");const y=_i.fromJSON(this.name,A);me(typeof B=="string",e,"internal-error"),Rr(f,e.name),Rr(g,e.name),me(typeof N=="boolean",e,"internal-error"),me(typeof Q=="boolean",e,"internal-error"),Rr(m,e.name),Rr(C,e.name),Rr(R,e.name),Rr(x,e.name),Rr(L,e.name),Rr(F,e.name);const v=new ir({uid:B,auth:e,email:g,emailVerified:N,displayName:f,isAnonymous:Q,photoURL:C,phoneNumber:m,tenantId:R,stsTokenManager:y,createdAt:L,lastLoginAt:F});return $&&Array.isArray($)&&(v.providerData=$.map(T=>Object.assign({},T))),x&&(v._redirectEventId=x),v}static async _fromIdTokenResponse(e,n,r=!1){const s=new _i;s.updateFromServerResponse(n);const i=new ir({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await cc(i),i}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];me(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?_b(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),a=new _i;a.updateFromIdToken(r);const c=new ir({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),u={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new nd(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,u),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_=new Map;function or(t){pr(t instanceof Function,"Expected a class definition");let e=H_.get(t);return e?(pr(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,H_.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yb{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}yb.type="NONE";const W_=yb;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Al(t,e,n){return`firebase:${t}:${e}:${n}`}class yi{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Al(this.userKey,s.apiKey,i),this.fullPersistenceKey=Al("persistence",s.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?ir._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new yi(or(W_),e,r);const s=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let i=s[0]||or(W_);const o=Al(r,e.config.apiKey,e.name);let a=null;for(const u of n)try{const h=await u._get(o);if(h){const f=ir._fromJSON(e,h);u!==i&&(a=f),i=u;break}}catch{}const c=s.filter(u=>u._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new yi(i,e,r):(i=c[0],a&&await i._set(o,a.toJSON()),await Promise.all(n.map(async u=>{if(u!==i)try{await u._remove(o)}catch{}})),new yi(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z_(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Eb(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(vb(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ib(e))return"Blackberry";if(Tb(e))return"Webos";if(tp(e))return"Safari";if((e.includes("chrome/")||wb(e))&&!e.includes("edge/"))return"Chrome";if(bb(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function vb(t=Lt()){return/firefox\//i.test(t)}function tp(t=Lt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function wb(t=Lt()){return/crios\//i.test(t)}function Eb(t=Lt()){return/iemobile/i.test(t)}function bb(t=Lt()){return/android/i.test(t)}function Ib(t=Lt()){return/blackberry/i.test(t)}function Tb(t=Lt()){return/webos/i.test(t)}function iu(t=Lt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function KV(t=Lt()){var e;return iu(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function YV(){return _1()&&document.documentMode===10}function Cb(t=Lt()){return iu(t)||bb(t)||Tb(t)||Ib(t)||/windows phone/i.test(t)||Eb(t)}function QV(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ab(t,e=[]){let n;switch(t){case"Browser":n=z_(Lt());break;case"Worker":n=`${z_(Lt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${$s}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XV{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=i=>new Promise((o,a)=>{try{const c=e(i);o(c)}catch(c){a(c)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function JV(t,e={}){return rs(t,"GET","/v2/passwordPolicy",zs(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZV=6;class e2{constructor(e){var n,r,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:ZV,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,s,i,o,a;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(a=c.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),c}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t2{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new G_(this),this.idTokenSubscription=new G_(this),this.beforeStateQueue=new XV(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=db,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=or(n)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await yi.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await mb(this,{idToken:e}),r=await ir._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(jn(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===a)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return me(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await cc(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=DV()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(jn(this.app))return Promise.reject(zr(this));const n=e?ft(e):null;return n&&me(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&me(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return jn(this.app)?Promise.reject(zr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return jn(this.app)?Promise.reject(zr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(or(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await JV(this),n=new e2(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Bs("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await GV(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&or(e)||this._popupRedirectResolver;me(n,this,"argument-error"),this.redirectPersistenceManager=await yi.create(this,[or(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(me(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,r,s);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return me(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ab(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(n["X-Firebase-AppCheck"]=s),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&PV(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Gs(t){return ft(t)}class G_{constructor(e){this.auth=e,this.observer=null,this.addObserver=A1(n=>this.observer=n)}get next(){return me(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ou={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function n2(t){ou=t}function Sb(t){return ou.loadJS(t)}function r2(){return ou.recaptchaEnterpriseScript}function s2(){return ou.gapiScript}function i2(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const o2="recaptcha-enterprise",a2="NO_RECAPTCHA";class l2{constructor(e){this.type=o2,this.auth=Gs(e)}async verify(e="verify",n=!1){async function r(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{UV(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const u=new FV(c);return i.tenantId==null?i._agentRecaptchaConfig=u:i._tenantRecaptchaConfigs[i.tenantId]=u,o(u.siteKey)}}).catch(c=>{a(c)})})}function s(i,o,a){const c=window.grecaptcha;j_(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(u=>{o(u)}).catch(()=>{o(a2)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{r(this.auth).then(a=>{if(!n&&j_(window.grecaptcha))s(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=r2();c.length!==0&&(c+=a),Sb(c).then(()=>{s(a,i,o)}).catch(u=>{o(u)})}}).catch(a=>{o(a)})})}}async function K_(t,e,n,r=!1){const s=new l2(t);let i;try{i=await s.verify(n)}catch{i=await s.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Y_(t,e,n,r){var s;if(!((s=t._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await K_(t,e,n,n==="getOobCode");return r(t,i)}else return r(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await K_(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c2(t,e){const n=mr(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),i=n.getOptions();if(Zo(i,e??{}))return s;wn(s,"already-initialized")}return n.initialize({options:e})}function u2(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(or);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function h2(t,e,n){const r=Gs(t);me(r._canInitEmulator,r,"emulator-config-failed"),me(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Rb(e),{host:o,port:a}=d2(e),c=a===null?"":`:${a}`;r.config.emulator={url:`${i}//${o}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),f2()}function Rb(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function d2(t){const e=Rb(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:Q_(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:Q_(o)}}}function Q_(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function f2(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return sr("not implemented")}_getIdTokenResponse(e){return sr("not implemented")}_linkToIdToken(e,n){return sr("not implemented")}_getReauthenticationResolver(e){return sr("not implemented")}}async function p2(t,e){return rs(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function g2(t,e){return su(t,"POST","/v1/accounts:signInWithPassword",zs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function m2(t,e){return su(t,"POST","/v1/accounts:signInWithEmailLink",zs(t,e))}async function _2(t,e){return su(t,"POST","/v1/accounts:signInWithEmailLink",zs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _a extends np{constructor(e,n,r,s=null){super("password",r),this._email=e,this._password=n,this._tenantId=s}static _fromEmailAndPassword(e,n){return new _a(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new _a(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Y_(e,n,"signInWithPassword",g2);case"emailLink":return m2(e,{email:this._email,oobCode:this._password});default:wn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Y_(e,r,"signUpPassword",p2);case"emailLink":return _2(e,{idToken:n,email:this._email,oobCode:this._password});default:wn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vi(t,e){return su(t,"POST","/v1/accounts:signInWithIdp",zs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y2="http://localhost";class Fs extends np{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Fs(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):wn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,i=Qf(n,["providerId","signInMethod"]);if(!r||!s)return null;const o=new Fs(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return vi(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,vi(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,vi(e,n)}buildRequest(){const e={requestUri:y2,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ui(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v2(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function w2(t){const e=yo(vo(t)).link,n=e?yo(vo(e)).deep_link_id:null,r=yo(vo(t)).deep_link_id;return(r?yo(vo(r)).link:null)||r||n||e||t}class rp{constructor(e){var n,r,s,i,o,a;const c=yo(vo(e)),u=(n=c.apiKey)!==null&&n!==void 0?n:null,h=(r=c.oobCode)!==null&&r!==void 0?r:null,f=v2((s=c.mode)!==null&&s!==void 0?s:null);me(u&&h&&f,"argument-error"),this.apiKey=u,this.operation=f,this.code=h,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=c.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const n=w2(e);try{return new rp(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(){this.providerId=Wi.PROVIDER_ID}static credential(e,n){return _a._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=rp.parseLink(n);return me(r,"argument-error"),_a._fromEmailAndCode(e,r.code,r.tenantId)}}Wi.PROVIDER_ID="password";Wi.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Wi.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La extends sp{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or extends La{constructor(){super("facebook.com")}static credential(e){return Fs._fromParams({providerId:Or.PROVIDER_ID,signInMethod:Or.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Or.credentialFromTaggedObject(e)}static credentialFromError(e){return Or.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Or.credential(e.oauthAccessToken)}catch{return null}}}Or.FACEBOOK_SIGN_IN_METHOD="facebook.com";Or.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr extends La{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Fs._fromParams({providerId:nr.PROVIDER_ID,signInMethod:nr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return nr.credentialFromTaggedObject(e)}static credentialFromError(e){return nr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return nr.credential(n,r)}catch{return null}}}nr.GOOGLE_SIGN_IN_METHOD="google.com";nr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr extends La{constructor(){super("github.com")}static credential(e){return Fs._fromParams({providerId:Mr.PROVIDER_ID,signInMethod:Mr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Mr.credentialFromTaggedObject(e)}static credentialFromError(e){return Mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Mr.credential(e.oauthAccessToken)}catch{return null}}}Mr.GITHUB_SIGN_IN_METHOD="github.com";Mr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr extends La{constructor(){super("twitter.com")}static credential(e,n){return Fs._fromParams({providerId:Lr.PROVIDER_ID,signInMethod:Lr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Lr.credentialFromTaggedObject(e)}static credentialFromError(e){return Lr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Lr.credential(n,r)}catch{return null}}}Lr.TWITTER_SIGN_IN_METHOD="twitter.com";Lr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const i=await ir._fromIdTokenResponse(e,r,s),o=X_(r);return new Oi({user:i,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=X_(r);return new Oi({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function X_(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc extends En{constructor(e,n,r,s){var i;super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,uc.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new uc(e,n,r,s)}}function Pb(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?uc._fromErrorAndOperation(t,i,e,r):i})}async function E2(t,e,n=!1){const r=await ma(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Oi._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b2(t,e,n=!1){const{auth:r}=t;if(jn(r.app))return Promise.reject(zr(r));const s="reauthenticate";try{const i=await ma(t,Pb(r,s,e,t),n);me(i.idToken,r,"internal-error");const o=ep(i.idToken);me(o,r,"internal-error");const{sub:a}=o;return me(t.uid===a,r,"user-mismatch"),Oi._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&wn(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xb(t,e,n=!1){if(jn(t.app))return Promise.reject(zr(t));const r="signIn",s=await Pb(t,r,e),i=await Oi._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(i.user),i}async function I2(t,e){return xb(Gs(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function T2(t){const e=Gs(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function C2(t,e,n){return jn(t.app)?Promise.reject(zr(t)):I2(ft(t),Wi.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&T2(t),r})}function A2(t,e,n,r){return ft(t).onIdTokenChanged(e,n,r)}function S2(t,e,n){return ft(t).beforeAuthStateChanged(e,n)}function R2(t,e,n,r){return ft(t).onAuthStateChanged(e,n,r)}const hc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(hc,"1"),this.storage.removeItem(hc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P2(){const t=Lt();return tp(t)||iu(t)}const x2=1e3,k2=10;class Nb extends kb{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=P2()&&QV(),this.fallbackToPolling=Cb(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}const r=e.key;if(n?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(r);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(r,e.newValue):this.storage.removeItem(r);else if(this.localCache[r]===e.newValue&&!n)return}const s=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);YV()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,k2):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},x2)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Nb.type="LOCAL";const N2=Nb;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Db extends kb{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Db.type="SESSION";const Ob=Db;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D2(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new au(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:i}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const a=Array.from(o).map(async u=>u(n.origin,i)),c=await D2(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}au.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ip(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O2{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((a,c)=>{const u=ip("",20);s.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(f){const g=f;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(g.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gn(){return window}function M2(t){Gn().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mb(){return typeof Gn().WorkerGlobalScope<"u"&&typeof Gn().importScripts=="function"}async function L2(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function V2(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function F2(){return Mb()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lb="firebaseLocalStorageDb",U2=1,dc="firebaseLocalStorage",Vb="fbase_key";class Va{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function lu(t,e){return t.transaction([dc],e?"readwrite":"readonly").objectStore(dc)}function B2(){const t=indexedDB.deleteDatabase(Lb);return new Va(t).toPromise()}function rd(){const t=indexedDB.open(Lb,U2);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(dc,{keyPath:Vb})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(dc)?e(r):(r.close(),await B2(),e(await rd()))})})}async function J_(t,e,n){const r=lu(t,!0).put({[Vb]:e,value:n});return new Va(r).toPromise()}async function $2(t,e){const n=lu(t,!1).get(e),r=await new Va(n).toPromise();return r===void 0?null:r.value}function Z_(t,e){const n=lu(t,!0).delete(e);return new Va(n).toPromise()}const j2=800,q2=3;class Fb{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await rd(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>q2)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Mb()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=au._getInstance(F2()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await L2(),!this.activeServiceWorker)return;this.sender=new O2(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||V2()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await rd();return await J_(e,hc,"1"),await Z_(e,hc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>J_(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>$2(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Z_(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=lu(s,!1).getAll();return new Va(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),j2)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Fb.type="LOCAL";const H2=Fb;new Ma(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ub(t,e){return e?or(e):(me(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class op extends np{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return vi(e,this._buildIdpRequest())}_linkToIdToken(e,n){return vi(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return vi(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function W2(t){return xb(t.auth,new op(t),t.bypassAuthState)}function z2(t){const{auth:e,user:n}=t;return me(n,e,"internal-error"),b2(n,new op(t),t.bypassAuthState)}async function G2(t){const{auth:e,user:n}=t;return me(n,e,"internal-error"),E2(n,new op(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bb{constructor(e,n,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return W2;case"linkViaPopup":case"linkViaRedirect":return G2;case"reauthViaPopup":case"reauthViaRedirect":return z2;default:wn(this.auth,"internal-error")}}resolve(e){pr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){pr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K2=new Ma(2e3,1e4);async function Y2(t,e,n){if(jn(t.app))return Promise.reject(Dn(t,"operation-not-supported-in-this-environment"));const r=Gs(t);xV(t,e,sp);const s=Ub(r,n);return new bs(r,"signInViaPopup",e,s).executeNotNull()}class bs extends Bb{constructor(e,n,r,s,i){super(e,n,s,i),this.provider=r,this.authWindow=null,this.pollId=null,bs.currentPopupAction&&bs.currentPopupAction.cancel(),bs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return me(e,this.auth,"internal-error"),e}async onExecution(){pr(this.filter.length===1,"Popup operations only handle one event");const e=ip();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Dn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Dn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,bs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Dn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,K2.get())};e()}}bs.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q2="pendingRedirect",Sl=new Map;class X2 extends Bb{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Sl.get(this.auth._key());if(!e){try{const r=await J2(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Sl.set(this.auth._key(),e)}return this.bypassAuthState||Sl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function J2(t,e){const n=tF(e),r=eF(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function Z2(t,e){Sl.set(t._key(),e)}function eF(t){return or(t._redirectPersistence)}function tF(t){return Al(Q2,t.config.apiKey,t.name)}async function nF(t,e,n=!1){if(jn(t.app))return Promise.reject(zr(t));const r=Gs(t),s=Ub(r,e),o=await new X2(r,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rF=10*60*1e3;class sF{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!iF(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!$b(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(Dn(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=rF&&this.cachedEventUids.clear(),this.cachedEventUids.has(ey(e))}saveEventToCache(e){this.cachedEventUids.add(ey(e)),this.lastProcessedEventTime=Date.now()}}function ey(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function $b({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function iF(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return $b(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oF(t,e={}){return rs(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aF=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,lF=/^https?/;async function cF(t){if(t.config.emulator)return;const{authorizedDomains:e}=await oF(t);for(const n of e)try{if(uF(n))return}catch{}wn(t,"unauthorized-domain")}function uF(t){const e=td(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!lF.test(n))return!1;if(aF.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hF=new Ma(3e4,6e4);function ty(){const t=Gn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function dF(t){return new Promise((e,n)=>{var r,s,i;function o(){ty(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ty(),n(Dn(t,"network-request-failed"))},timeout:hF.get()})}if(!((s=(r=Gn().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Gn().gapi)===null||i===void 0)&&i.load)o();else{const a=i2("iframefcb");return Gn()[a]=()=>{gapi.load?o():n(Dn(t,"network-request-failed"))},Sb(`${s2()}?onload=${a}`).catch(c=>n(c))}}).catch(e=>{throw Rl=null,e})}let Rl=null;function fF(t){return Rl=Rl||dF(t),Rl}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pF=new Ma(5e3,15e3),gF="__/auth/iframe",mF="emulator/auth/iframe",_F={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},yF=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function vF(t){const e=t.config;me(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Zf(e,mF):`https://${t.config.authDomain}/${gF}`,r={apiKey:e.apiKey,appName:t.name,v:$s},s=yF.get(t.config.apiHost);s&&(r.eid=s);const i=t._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${Ui(r).slice(1)}`}async function wF(t){const e=await fF(t),n=Gn().gapi;return me(n,t,"internal-error"),e.open({where:document.body,url:vF(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:_F,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=Dn(t,"network-request-failed"),a=Gn().setTimeout(()=>{i(o)},pF.get());function c(){Gn().clearTimeout(a),s(r)}r.ping(c).then(c,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EF={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},bF=500,IF=600,TF="_blank",CF="http://localhost";class ny{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function AF(t,e,n,r=bF,s=IF){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},EF),{width:r.toString(),height:s.toString(),top:i,left:o}),u=Lt().toLowerCase();n&&(a=wb(u)?TF:n),vb(u)&&(e=e||CF,c.scrollbars="yes");const h=Object.entries(c).reduce((g,[m,C])=>`${g}${m}=${C},`,"");if(KV(u)&&a!=="_self")return SF(e||"",a),new ny(null);const f=window.open(e||"",a,h);me(f,t,"popup-blocked");try{f.focus()}catch{}return new ny(f)}function SF(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RF="__/auth/handler",PF="emulator/auth/handler",xF=encodeURIComponent("fac");async function ry(t,e,n,r,s,i){me(t.config.authDomain,t,"auth-domain-config-required"),me(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:$s,eventId:s};if(e instanceof sp){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",bh(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,f]of Object.entries({}))o[h]=f}if(e instanceof La){const h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const c=await t._getAppCheckToken(),u=c?`#${xF}=${encodeURIComponent(c)}`:"";return`${kF(t)}?${Ui(a).slice(1)}${u}`}function kF({config:t}){return t.emulator?Zf(t,PF):`https://${t.authDomain}/${RF}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nh="webStorageSupport";class NF{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ob,this._completeRedirectFn=nF,this._overrideRedirectResult=Z2}async _openPopup(e,n,r,s){var i;pr((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await ry(e,n,r,td(),s);return AF(e,o,ip())}async _openRedirect(e,n,r,s){await this._originValidation(e);const i=await ry(e,n,r,td(),s);return M2(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:i}=this.eventManagers[n];return s?Promise.resolve(s):(pr(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await wF(e),r=new sF(e);return n.register("authEvent",s=>(me(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(nh,{type:nh},s=>{var i;const o=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[nh];o!==void 0&&n(!!o),wn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=cF(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Cb()||tp()||iu()}}const DF=NF;var sy="@firebase/auth",iy="1.7.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OF{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){me(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MF(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function LF(t){vn(new un("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;me(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ab(t)},u=new t2(r,s,i,c);return u2(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),vn(new un("auth-internal",e=>{const n=Gs(e.getProvider("auth").getImmediate());return(r=>new OF(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Wt(sy,iy,MF(t)),Wt(sy,iy,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VF=5*60,FF=zv("authIdTokenMaxAge")||VF;let oy=null;const UF=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>FF)return;const s=n==null?void 0:n.token;oy!==s&&(oy=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function BF(t=ba()){const e=mr(t,"auth");if(e.isInitialized())return e.getImmediate();const n=c2(t,{popupRedirectResolver:DF,persistence:[H2,N2,Ob]}),r=zv("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=UF(i.toString());S2(n,o,()=>o(n.currentUser)),A2(n,a=>o(a))}}const s=Hv("auth");return s&&h2(n,`http://${s}`),n}function $F(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}n2({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const i=Dn("internal-error");i.customData=s,n(i)},r.type="text/javascript",r.charset="UTF-8",$F().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});LF("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jF="type.googleapis.com/google.protobuf.Int64Value",qF="type.googleapis.com/google.protobuf.UInt64Value";function jb(t,e){const n={};for(const r in t)t.hasOwnProperty(r)&&(n[r]=e(t[r]));return n}function sd(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>sd(e));if(typeof t=="function"||typeof t=="object")return jb(t,e=>sd(e));throw new Error("Data cannot be encoded in JSON: "+t)}function fc(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case jF:case qF:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>fc(e)):typeof t=="function"||typeof t=="object"?jb(t,e=>fc(e)):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ap="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class wi extends En{constructor(e,n,r){super(`${ap}/${e}`,n||""),this.details=r}}function HF(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function WF(t,e){let n=HF(t),r=n,s;try{const i=e&&e.error;if(i){const o=i.status;if(typeof o=="string"){if(!ay[o])return new wi("internal","internal");n=ay[o],r=o}const a=i.message;typeof a=="string"&&(r=a),s=i.details,s!==void 0&&(s=fc(s))}}catch{}return n==="ok"?null:new wi(n,r,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zF{constructor(e,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||r.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const n=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(e){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const id="us-central1";function GF(t){let e=null;return{promise:new Promise((n,r)=>{e=setTimeout(()=>{r(new wi("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class KF{constructor(e,n,r,s,i=id,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new zF(n,r,s),this.cancelAllRequests=new Promise(a=>{this.deleteService=()=>Promise.resolve(a())});try{const a=new URL(i);this.customDomain=a.origin,this.region=id}catch{this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function YF(t,e,n){t.emulatorOrigin=`http://${e}:${n}`}function QF(t,e,n){return r=>JF(t,e,r,{})}async function XF(t,e,n,r){n["Content-Type"]="application/json";let s;try{s=await r(t,{method:"POST",body:JSON.stringify(e),headers:n})}catch{return{status:0,json:null}}let i=null;try{i=await s.json()}catch{}return{status:s.status,json:i}}function JF(t,e,n,r){const s=t._url(e);return ZF(t,s,n,r)}async function ZF(t,e,n,r){n=sd(n);const s={data:n},i={},o=await t.contextProvider.getContext(r.limitedUseAppCheckTokens);o.authToken&&(i.Authorization="Bearer "+o.authToken),o.messagingToken&&(i["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(i["X-Firebase-AppCheck"]=o.appCheckToken);const a=r.timeout||7e4,c=GF(a),u=await Promise.race([XF(e,s,i,t.fetchImpl),c.promise,t.cancelAllRequests]);if(c.cancel(),!u)throw new wi("cancelled","Firebase Functions instance was deleted.");const h=WF(u.status,u.json);if(h)throw h;if(!u.json)throw new wi("internal","Response is not valid JSON object.");let f=u.json.data;if(typeof f>"u"&&(f=u.json.result),typeof f>"u")throw new wi("internal","Response is missing data field.");return{data:fc(f)}}const ly="@firebase/functions",cy="0.11.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e4="auth-internal",t4="app-check-internal",n4="messaging-internal";function r4(t,e){const n=(r,{instanceIdentifier:s})=>{const i=r.getProvider("app").getImmediate(),o=r.getProvider(e4),a=r.getProvider(n4),c=r.getProvider(t4);return new KF(i,o,a,c,s,t)};vn(new un(ap,n,"PUBLIC").setMultipleInstances(!0)),Wt(ly,cy,e),Wt(ly,cy,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qb(t=ba(),e=id){const r=mr(ft(t),ap).getImmediate({identifier:e}),s=Nd("functions");return s&&s4(r,...s),r}function s4(t,e,n){YF(ft(t),e,n)}function i4(t,e,n){return QF(ft(t),e)}r4(fetch.bind(self));const o4={apiKey:"AIzaSyBOI-UrNeKCWryN01GflbncbJDVZl2hrEE",authDomain:"maso-au.firebaseapp.com",databaseURL:"https://maso-au-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"maso-au",storageBucket:"maso-au.appspot.com",messagingSenderId:"888141867225",appId:"1:888141867225:web:8b9e99ec26456f034af6c8",measurementId:"G-18X1GQKWHY"},Fa=iw(o4);kP("warning");mO(Fa);const Hb=hV(Fa),lp=BF(Fa),a4=KN(Fa);qb(Fa);const l4={components:{Cog8ToothIcon:qA,QuestionMarkCircleIcon:HA},setup(){const t=he(0),e=UN(a4,"websiteViews");return v0(e,n=>{const r=n.val();t.value=r||0}),On(()=>{JN(e,r=>(r||0)+1).catch(r=>{console.error("Error updating view count:",r)})}),{viewCount:t}}},c4={class:"bg-gray-800 text-white bottom-0 left-0 z-30 flex justify-between items-center w-full p-4 drop-shadow-2xl h-[--footer-height]"},u4=Z("p",null,"© 2024 Mason Bartholomai. All rights reserved.",-1),h4={class:"mr-2 flex items-center"},d4={class:"mr-4"};function f4(t,e,n,r,s,i){return se(),ye("footer",c4,[u4,Z("div",h4,[Z("p",d4,"Website Views: "+Vr(r.viewCount),1),(se(),gt(oi("Cog8ToothIcon"),{class:"w-6 h-6 inline-block mr-2 cursor-pointer"})),(se(),gt(oi("QuestionMarkCircleIcon"),{class:"w-6 h-6 inline-block cursor-pointer"}))])])}const p4=Xn(l4,[["render",f4]]),g4={__name:"Sonner",props:{invert:{type:Boolean,required:!1},theme:{type:String,required:!1},position:{type:String,required:!1},hotkey:{type:Array,required:!1},richColors:{type:Boolean,required:!1},expand:{type:Boolean,required:!1},duration:{type:Number,required:!1},gap:{type:Number,required:!1},visibleToasts:{type:Number,required:!1},closeButton:{type:Boolean,required:!1},toastOptions:{type:Object,required:!1},class:{type:String,required:!1},style:{type:Object,required:!1},offset:{type:[String,Number],required:!1},dir:{type:String,required:!1},icons:{type:Object,required:!1},containerAriaLabel:{type:String,required:!1},pauseWhenPageIsHidden:{type:Boolean,required:!1},cn:{type:Function,required:!1}},setup(t){const e=t;return(n,r)=>(se(),gt(qe(KS),Hn({class:"toaster group"},e,{"toast-options":{classes:{toast:"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",description:"group-[.toast]:text-muted-foreground",actionButton:"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",cancelButton:"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"}}}),null,16))}},m4={components:{Header:a1,Footer:p4,Toaster:g4}},_4={id:"app",class:"flex flex-col"},y4=Z("div",{clas:"flex-grow"},null,-1);function v4(t,e,n,r,s,i){const o=Nt("Toaster"),a=Nt("Header"),c=Nt("router-view"),u=Nt("Footer");return se(),ye("div",_4,[re(o,{position:"bottom-right",richColors:""}),t.$route.meta.requiresOverlay?(se(),gt(a,{key:0})):Cn("v-if",!0),re(c,{class:$t(["flex",{"pt-[--header-height]":t.$route.meta.requiresOverlay}])},null,8,["class"]),y4,t.$route.meta.requiresOverlay?(se(),gt(u,{key:1})):Cn("v-if",!0)])}const w4=Xn(m4,[["render",v4]]),E4=t=>(fT("data-v-cab8439f"),t=t(),pT(),t),b4={class:"min-h-screen pt-[var(--header-height)] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600"},I4={class:"container mx-auto px-4 py-12"},T4=E4(()=>Z("h1",{class:"text-4xl font-bold mb-8 text-center text-[var(--text-50)]"}," Mason Bartholomai ",-1)),C4={class:"max-w-7xl mx-auto"},A4={class:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"},S4=["src","alt"],R4=["src"],P4={__name:"Home",setup(t){const e=he([{src:"https://images.unsplash.com/photo-1687938641915-4338bf1ba124?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 1"},{src:"https://images.unsplash.com/photo-1687938310683-b6824667ab73?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 2"},{src:"https://images.unsplash.com/photo-1687938214619-a96bd6391809?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 3"},{src:"https://images.unsplash.com/photo-1687938133945-477129b34b42?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 4"},{src:"https://images.unsplash.com/photo-1687856265836-60f5bc77d736?q=80&w=2733&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 5"},{src:"https://images.unsplash.com/photo-1687855480803-afb87cc0b760?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 6"},{src:"https://images.unsplash.com/photo-1687854763118-93fbaa46f068?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 7"},{src:"https://images.unsplash.com/photo-1665199439045-b301573908c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 8"},{src:"https://images.unsplash.com/photo-1665199368875-17a658b47668?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 9"},{src:"https://images.unsplash.com/photo-1665197501864-8300c5cfcabe?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 10"}]);return(n,r)=>(se(),ye("div",b4,[Z("div",I4,[T4,Z("div",C4,[Z("div",A4,[(se(!0),ye(at,null,Ei(e.value,(s,i)=>(se(),ye("div",{key:i,class:"relative w-full h-48 sm:h-64 lg:h-80 rounded-lg hover:scale-[1.01] transition-transform duration-300"},[Z("img",{src:s.src,alt:s.alt,class:"w-full h-full object-cover rounded-lg clear-blur"},null,8,S4),Z("img",{src:s.src,class:"w-full h-full object-cover absolute inset-0 rounded-lg opacity-0 hover:opacity-50 transition-opacity duration-300 blurred-image"},null,8,R4)]))),128))])])])]))}},x4=Xn(P4,[["__scopeId","data-v-cab8439f"]]),k4={setup(){return{}}},N4={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-blue-500 from-20% via-yellow-400 to-orange-500"},D4=Td('<div class="flex-grow container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-8 text-center">Welcome to the About Us Page</h1><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><p class="text-lg mb-4">This is the about page content. You can provide information about your company or organization here.</p><p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est.</p></div><div><img src="https://source.unsplash.com/random/2" alt="Random Image" class="w-[600px] h-[400px] image-cover overflow-hidden rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div></div></div>',1),O4=[D4];function M4(t,e,n,r,s,i){return se(),ye("div",N4,O4)}const L4=Xn(k4,[["render",M4]]),V4={name:"Contact"},F4={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-blue-500 from-20% via-yellow-400 to-orange-500"},U4=Td('<div class="flex-grow container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-8 text-center">Contact Us</h1><div class="max-w-lg mx-auto"><p class="text-lg mb-8 text-center">This is the contact page content. You can provide contact information or a contact form here.</p><form class="grid grid-cols-1 gap-6"><div><label for="name" class="block text-gray-700 font-bold mb-2">Name</label><input type="text" id="name" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" placeholder="Your Name"></div><div><label for="email" class="block text-gray-700 font-bold mb-2">Email</label><input type="email" id="email" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" placeholder="Your Email"></div><div><label for="message" class="block text-gray-700 font-bold mb-2">Message</label><textarea id="message" rows="4" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" placeholder="Your Message"></textarea></div><div><button type="submit" class="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none">Submit</button></div></form></div></div>',1),B4=[U4];function $4(t,e,n,r,s,i){return se(),ye("div",F4,B4)}const j4=Xn(V4,[["render",$4]]),q4={setup(){const t=he([{title:"Mxn",url:"https://mxn.au",description:"Description of Mxn website"},{title:"Xbx",url:"https://xbx.au",description:"Description of Xbx website"},{title:"Maso",url:"https://maso.au",description:"Description of Maso website"},{title:"Dxv",url:"https://dxv.ai",description:"Description of Dxv website"},{title:"Tempest Games",url:"https://tempestgames.au",description:"Description of Tempest Games website"},{title:"Studio Tempest",url:"https://studio-tempest.com",description:"Description of Studio Tempest website"},{title:"That Mason Guy",url:"https://thatmasonguy.com",description:"Description of That Mason Guy website"}]),e=["bg-red-500","bg-blue-500","bg-green-500","bg-yellow-500","bg-indigo-500","bg-purple-500","bg-pink-500","bg-gray-500","bg-teal-500","bg-cyan-500"],n=s=>{for(let i=s.length-1;i>0;i--){const o=Math.floor(Math.random()*(i+1));[s[i],s[o]]=[s[o],s[i]]}},r=()=>{n(e),t.value=t.value.map((s,i)=>({...s,color:e[i%e.length]})),console.log("Assigned colors:",t.value)};return On(()=>{r()}),{links:t}}},H4={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-blue-500 from-20% via-yellow-400 to-orange-500"},W4={class:"flex-grow container mx-auto px-6 py-8"},z4=Z("h1",{class:"text-4xl font-bold mb-8 text-center text-gray-800"}," Welcome to the Home Page ",-1),G4={class:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"},K4=["href"],Y4={class:"text-2xl font-bold mb-4 text-white"},Q4={class:"text-white"};function X4(t,e,n,r,s,i){return se(),ye("div",H4,[Z("main",W4,[z4,Z("div",G4,[(se(!0),ye(at,null,Ei(r.links,(o,a)=>(se(),ye("div",{key:a,class:$t(o.color+" rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition duration-300")},[Z("a",{href:o.url,target:"_blank",rel:"noopener noreferrer",class:"block text-center"},[Z("div",Y4,Vr(o.title),1),Z("div",Q4,Vr(o.description),1)],8,K4)],2))),128))])])])}const J4=Xn(q4,[["render",X4]]);typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Z4=t=>typeof t<"u";function eU(t){return JSON.parse(JSON.stringify(t))}function tU(t,e,n,r={}){var s,i,o;const{clone:a=!1,passive:c=!1,eventName:u,deep:h=!1,defaultValue:f,shouldEmit:g}=r,m=Sc(),C=n||(m==null?void 0:m.emit)||((s=m==null?void 0:m.$emit)==null?void 0:s.bind(m))||((o=(i=m==null?void 0:m.proxy)==null?void 0:i.$emit)==null?void 0:o.bind(m==null?void 0:m.proxy));let R=u;R=R||`update:${e.toString()}`;const x=B=>a?typeof a=="function"?a(B):eU(B):B,L=()=>Z4(t[e])?x(t[e]):f,F=B=>{g?g(B)&&C(R,B):C(R,B)};if(c){const B=L(),N=he(B);let Q=!1;return _n(()=>t[e],$=>{Q||(Q=!0,N.value=x($),wc(()=>Q=!1))}),_n(N,$=>{!Q&&($!==t[e]||h)&&F($)},{deep:h}),N}else return Be({get(){return L()},set(B){F(B)}})}const Wb={__name:"Input",props:{defaultValue:{type:[String,Number],required:!1},modelValue:{type:[String,Number],required:!1},class:{type:null,required:!1}},emits:["update:modelValue"],setup(t,{emit:e}){const n=t,s=tU(n,"modelValue",e,{passive:!0,defaultValue:n.defaultValue});return(i,o)=>Ky((se(),ye("input",{"onUpdate:modelValue":o[0]||(o[0]=a=>zt(s)?s.value=a:null),class:$t(qe(Nc)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",n.class))},null,2)),[[BC,qe(s)]])}},zb={__name:"Label",props:{for:{type:String,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},setup(t){const e=t,n=Be(()=>{const{class:r,...s}=e;return s});return(r,s)=>(se(),gt(qe(rA),Hn(n.value,{class:qe(Nc)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",e.class)}),{default:pe(()=>[St(r.$slots,"default")]),_:3},16,["class"]))}},nU=qb(),rU=i4(nU,"createUser"),sU=new nr,iU=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,oU=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/;R2(lp,async t=>{if(t)try{const e=QE(Hb,"users",t.uid);(await cb(e)).exists()||await ub(e,{firstName:"",lastName:"",userName:"",emailAddress:t.email,phoneNumber:"",dateOfBirth:"",avatarUrl:""});const r=Ur.currentRoute.value;r.meta.requiresAuth&&r.meta.requiresAuth&&!t&&Ur.push("/login")}catch(e){console.error("Error in onAuthStateChanged:",e)}else Ur.currentRoute.value.meta.requiresAuth&&Ur.push("/login")});const aU=async(t,e,n,r,s,i,o,a)=>{try{if(console.log("Validating user input"),!iU.test(r))throw new Error("Invalid email format");if(!oU.test(o))throw new Error("Password must be at least 8 characters long, contain at least 1 symbol, 1 number, 1 capital, and 1 lowercase letter");if(o!==a)throw new Error("Passwords do not match");const c=new Date;if(c.setFullYear(c.getFullYear()-12),new Date(i)>c)throw new Error("You must be at least 12 years old to sign up");console.log("Trimming input fields"),t=t.trim(),e=e.trim(),n=n.trim(),r=r.trim(),s=s.trim(),console.log("Calling createUser Cloud Function");const h=await rU({firstName:t,lastName:e,userName:n,emailAddress:r,phoneNumber:s,dateOfBirth:i,password:o});console.log("User created successfully"),Ur.push("/home")}catch(c){throw console.error("Error creating user:",c),c}},lU=async(t,e)=>{try{await C2(lp,t,e),Ur.push("/home")}catch(n){throw console.error("Error signing in:",n),n}},Gb=async()=>{try{const e=(await Y2(lp,sU)).user,n=QE(Hb,"users",e.uid);(await cb(n)).exists()||await ub(n,{firstName:"",lastName:"",userName:"",emailAddress:e.email,phoneNumber:"",dateOfBirth:"",avatarUrl:""}),Ur.push("/home")}catch(t){throw console.error("Error signing in with Google:",t),t}},cU={components:{Button:Sd,Input:Wb,Label:zb},setup(){const t=he("https://source.unsplash.com/random/1"),e=he("https://source.unsplash.com/random/2"),n=he(""),r=he(""),s=()=>{e.value=`https://source.unsplash.com/random/${Date.now()}`;const a=t.value;t.value=e.value,e.value=a};return On(()=>{setInterval(s,8e3)}),{currentImage:t,nextImage:e,email:n,password:r,handleEmailLogin:async()=>{try{await lU(n.value,r.value),$n.success("Login successful!")}catch(a){$n.error(a.message)}},handleGoogleLogin:async()=>{try{await Gb(),$n.success("Login successful!")}catch(a){$n.error(a.message)}}}}},uU={class:"w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen"},hU={class:"flex flex-col items-center justify-center py-12 px-4 mx-auto"},dU={class:"mx-auto grid w-[350px] gap-6"},fU=Z("div",{class:"grid gap-2 text-center"},[Z("h1",{class:"text-3xl font-bold mb-6"},"Login"),Z("p",{class:"text-balance text-muted-foreground"}," Enter your email below to login to your account ")],-1),pU={class:"grid gap-4"},gU={class:"grid gap-2"},mU={class:"grid gap-2"},_U={class:"flex items-center"},yU=Z("a",{href:"/forgot-password",class:"ml-auto inline-block text-sm underline"}," Forgot your password? ",-1),vU=Z("div",{class:"mt-4 text-center text-sm"},[Qe(" Don't have an account? "),Z("a",{href:"/signup",class:"underline"}," Sign up ")],-1),wU={class:"bg-gray-500 lg:block relative overflow-hidden"},EU=["src"],bU=["src"];function IU(t,e,n,r,s,i){const o=Nt("Button"),a=Nt("router-link"),c=Nt("Label"),u=Nt("Input");return se(),ye("div",uU,[Z("div",hU,[re(a,{to:"/"},{default:pe(()=>[re(o,{href:"/",class:"absolute top-2 left-2 z-20"},{default:pe(()=>[Qe("Return Home")]),_:1})]),_:1}),re(a,{to:"/"},{default:pe(()=>[re(o,{href:"/",class:"absolute top-2 right-2 z-20"},{default:pe(()=>[Qe("Dark Mode")]),_:1})]),_:1}),Z("div",dU,[fU,Z("div",pU,[Z("div",gU,[re(c,{for:"email"},{default:pe(()=>[Qe("Email")]),_:1}),re(u,{id:"email",type:"email",placeholder:"example@gmail.com",required:"",modelValue:r.email,"onUpdate:modelValue":e[0]||(e[0]=h=>r.email=h)},null,8,["modelValue"])]),Z("div",mU,[Z("div",_U,[re(c,{for:"password"},{default:pe(()=>[Qe("Password")]),_:1}),yU]),re(u,{id:"password",type:"password",required:"",modelValue:r.password,"onUpdate:modelValue":e[1]||(e[1]=h=>r.password=h)},null,8,["modelValue"])]),re(o,{type:"submit",class:"w-full",onClick:r.handleEmailLogin},{default:pe(()=>[Qe(" Login ")]),_:1},8,["onClick"]),re(o,{variant:"outline",class:"w-full",onClick:r.handleGoogleLogin},{default:pe(()=>[Qe(" Login with Google ")]),_:1},8,["onClick"])]),vU])]),Z("div",wU,[re(xc,{name:"fade",mode:"in-out","enter-active-class":"transition-opacity duration-1000","leave-active-class":"transition-opacity duration-1000","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:pe(()=>[(se(),ye("img",{key:r.currentImage,src:r.currentImage,alt:"Current Image",class:"object-cover w-full h-full absolute inset-0"},null,8,EU))]),_:1}),Z("img",{src:r.nextImage,alt:"Next Image",class:"object-cover w-full h-full absolute inset-0 opacity-0"},null,8,bU)])])}const TU=Xn(cU,[["render",IU]]),CU={setup(){return{}}},AU={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-blue-500 from-20% via-yellow-400 to-orange-500"},SU=Td('<div class="flex-grow container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-8 text-center">Welcome to the Home Page</h1><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><img src="https://images.unsplash.com/photo-1687938641915-4338bf1ba124?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687938310683-b6824667ab73?q=80&amp;w=2573&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687938214619-a96bd6391809?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687938133945-477129b34b42?q=80&amp;w=2573&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687856265836-60f5bc77d736?q=80&amp;w=2733&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687855480803-afb87cc0b760?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1687854763118-93fbaa46f068?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1665199439045-b301573908c0?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1665199368875-17a658b47668?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div><img src="https://images.unsplash.com/photo-1665197501864-8300c5cfcabe?q=80&amp;w=2670&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Random Image" class="w-[600px] h-[400px] object-cover rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div><div class="col-span-2 text-center"><p class="text-lg mb-4 font-semibold">This is the home page content. You can add more content here.</p><p class="text-lg mb-4"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est. </p></div></div></div>',1),RU=[SU];function PU(t,e,n,r,s,i){return se(),ye("div",AU,RU)}const xU=Xn(CU,[["render",PU]]),kU={components:{Button:Sd,Input:Wb,Label:zb},setup(){const t=he("https://source.unsplash.com/random/3"),e=he("https://source.unsplash.com/random/4"),n=he(""),r=he(""),s=he(""),i=he(""),o=he(""),a=he(""),c=he(""),u=he(""),h=()=>{e.value=`https://source.unsplash.com/random/${Date.now()}`;const m=t.value;t.value=e.value,e.value=m};return On(()=>{setInterval(h,8e3)}),{currentImage:t,nextImage:e,firstName:n,lastName:r,userName:s,email:i,phoneNumber:o,dateOfBirth:a,password:c,confirmPassword:u,handleSignUp:async()=>{try{console.log("Initiating user sign up"),await aU(n.value,r.value,s.value,i.value,o.value,a.value,c.value,u.value),console.log("Sign up successful"),$n.success("Sign up successful!")}catch(m){console.error("Error during sign up:",m),$n.error(m.message)}},handleGoogleSignUp:async()=>{try{console.log("Initiating Google sign up"),await Gb(),console.log("Google sign up successful"),$n.success("Sign up successful!")}catch(m){console.error("Error during Google sign up:",m),$n.error(m.message)}}}}},NU={class:"w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen"},DU={class:"flex items-center justify-center py-12 px-4 mx-auto"},OU={class:"mx-auto grid w-[350px] gap-6"},MU=Z("div",{class:"grid gap-2 text-center"},[Z("h1",{class:"text-3xl font-bold mb-6"},"Sign up"),Z("p",{class:"text-balance text-muted-foreground"}," Enter your details below to create your account ")],-1),LU={class:"grid gap-4"},VU={class:"grid gap-2"},FU={class:"grid grid-cols-2 gap-4"},UU={class:"grid gap-2"},BU={class:"grid gap-2"},$U={class:"grid gap-2"},jU={class:"grid gap-2"},qU={class:"grid gap-2"},HU={class:"grid grid-cols-2 gap-4"},WU={class:"grid gap-2"},zU={class:"flex items-center"},GU={class:"grid gap-2"},KU={class:"flex items-center"},YU=Z("div",{class:"mt-4 text-center text-sm"},[Qe(" Already have an account? "),Z("a",{href:"/login",class:"underline"}," Login ")],-1),QU={class:"bg-gray-500 lg:block relative overflow-hidden"},XU=["src"],JU=["src"];function ZU(t,e,n,r,s,i){const o=Nt("Button"),a=Nt("router-link"),c=Nt("Label"),u=Nt("Input");return se(),ye("div",NU,[Z("div",DU,[Z("div",OU,[re(a,{to:"/"},{default:pe(()=>[re(o,{href:"/",class:"absolute top-2 left-2 z-20"},{default:pe(()=>[Qe("Return Home")]),_:1})]),_:1}),re(a,{to:"/"},{default:pe(()=>[re(o,{href:"/",class:"absolute top-2 right-2 z-20"},{default:pe(()=>[Qe("Dark Mode")]),_:1})]),_:1}),MU,Z("div",LU,[Z("div",VU,[re(c,{for:"userName"},{default:pe(()=>[Qe("Username")]),_:1}),re(u,{id:"userName",type:"text",required:"",modelValue:r.userName,"onUpdate:modelValue":e[0]||(e[0]=h=>r.userName=h)},null,8,["modelValue"])]),Z("div",FU,[Z("div",UU,[re(c,{for:"firstName"},{default:pe(()=>[Qe("First Name")]),_:1}),re(u,{id:"firstName",type:"text",required:"",modelValue:r.firstName,"onUpdate:modelValue":e[1]||(e[1]=h=>r.firstName=h)},null,8,["modelValue"])]),Z("div",BU,[re(c,{for:"lastName"},{default:pe(()=>[Qe("Last Name")]),_:1}),re(u,{id:"lastName",type:"text",required:"",modelValue:r.lastName,"onUpdate:modelValue":e[2]||(e[2]=h=>r.lastName=h)},null,8,["modelValue"])])]),Z("div",$U,[re(c,{for:"email"},{default:pe(()=>[Qe("Email")]),_:1}),re(u,{id:"email",type:"email",placeholder:"example@email.com",required:"",modelValue:r.email,"onUpdate:modelValue":e[3]||(e[3]=h=>r.email=h)},null,8,["modelValue"])]),Z("div",jU,[re(c,{for:"phoneNumber"},{default:pe(()=>[Qe("Phone Number")]),_:1}),re(u,{id:"phoneNumber",type:"tel",modelValue:r.phoneNumber,"onUpdate:modelValue":e[4]||(e[4]=h=>r.phoneNumber=h)},null,8,["modelValue"])]),Z("div",qU,[re(c,{for:"dateOfBirth"},{default:pe(()=>[Qe("Date of Birth")]),_:1}),re(u,{id:"dateOfBirth",type:"date",modelValue:r.dateOfBirth,"onUpdate:modelValue":e[5]||(e[5]=h=>r.dateOfBirth=h)},null,8,["modelValue"])]),Z("div",HU,[Z("div",WU,[Z("div",zU,[re(c,{for:"password"},{default:pe(()=>[Qe("Password")]),_:1})]),re(u,{id:"password",type:"password",required:"",modelValue:r.password,"onUpdate:modelValue":e[6]||(e[6]=h=>r.password=h)},null,8,["modelValue"])]),Z("div",GU,[Z("div",KU,[re(c,{for:"confirmPassword"},{default:pe(()=>[Qe("Confirm Password")]),_:1})]),re(u,{id:"confirmPassword",type:"password",required:"",modelValue:r.confirmPassword,"onUpdate:modelValue":e[7]||(e[7]=h=>r.confirmPassword=h)},null,8,["modelValue"])])]),re(o,{type:"submit",class:"w-full",onClick:r.handleSignUp},{default:pe(()=>[Qe(" Sign up ")]),_:1},8,["onClick"]),re(o,{variant:"outline",class:"w-full",onClick:r.handleGoogleSignUp},{default:pe(()=>[Qe(" Sign up with Google ")]),_:1},8,["onClick"])]),YU])]),Z("div",QU,[re(xc,{name:"fade",mode:"in-out","enter-active-class":"transition-opacity duration-1000","leave-active-class":"transition-opacity duration-1000","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:pe(()=>[(se(),ye("img",{key:r.currentImage,src:r.currentImage,alt:"Current Image",class:"object-cover w-full h-full absolute inset-0"},null,8,XU))]),_:1}),Z("img",{src:r.nextImage,alt:"Next Image",class:"object-cover w-full h-full absolute inset-0 opacity-0"},null,8,JU)])])}const e9=Xn(kU,[["render",ZU]]),t9={class:"bg-[--background-900] w-screen rounded-lg shadow-2xl m-4"},uy=170,hy=170,ds=16,dy=32,n9={__name:"HomePanel",setup(t){const e=Li([]),n=he({}),r=he({}),s=he(null),i=()=>{if(s.value){const a=s.value.clientWidth-dy,c=s.value.clientHeight-dy,u=Math.floor((a+ds)/(uy+ds)),h=Math.floor((c+ds)/(hy+ds)),f=(a-(u-1)*ds)/u,g=(c-(h-1)*ds)/h;r.value={width:`${f}px`,height:`${g}px`},n.value={gridTemplateColumns:`repeat(auto-fit, minmax(${uy}px, 1fr))`,gridAutoRows:`minmax(${hy}px, ${g}px)`,gap:`${ds}px`};const m=u*h;if(e.length<m){const C=m-e.length;for(let R=0;R<C;R++)e.push(`Item ${e.length+1}`)}else e.length>m&&e.splice(m)}},o=()=>{i()};return On(()=>{i(),window.addEventListener("resize",o)}),Ed(()=>{window.removeEventListener("resize",o)}),(a,c)=>(se(),ye("div",t9,[Z("div",{ref_key:"gridContainer",ref:s,class:"grid gap-4 rounded-lg w-full h-full shadow-xl p-4",style:Kr(n.value)},[(se(!0),ye(at,null,Ei(e,(u,h)=>(se(),ye("div",{key:h,class:"bg-gray-800 rounded-lg flex items-center justify-center text-3xl cursor-pointer text-white",style:Kr(r.value)}," + ",4))),128))],4)]))}},r9={class:"min-h-[--adjusted-height] bg-[--background-700] flex-grow"},s9={__name:"Protected",setup(t){return(e,n)=>(se(),ye("div",r9,[re(n9)]))}},i9=[{path:"/",alias:["/","/index",""],name:"Landing",component:xU,meta:{requiresAuth:!1,title:"Landing",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/home",alias:"/Home",name:"Photography",component:x4,meta:{requiresAuth:!0,title:"Photography",requiresOverlay:!0,requiresAuthOverlay:!0}},{path:"/about",alias:"/about-us",name:"About",component:L4,meta:{requiresAuth:!1,title:"About",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/contact",alias:"/contact-us",name:"Contact",component:j4,meta:{requiresAuth:!1,title:"Contact",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/websites",alias:"/websites",name:"Websites",component:J4,meta:{requiresAuth:!1,title:"Websites",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/login",alias:"/signin",name:"Login",component:TU,meta:{requiresAuth:!1,title:"Login",requiresOverlay:!1,requiresAuthOverlay:!1}},{path:"/signup",alias:["/create-account","/sign-up"],name:"Sign Up",component:e9,meta:{requiresAuth:!1,title:"Sign Up",requiresOverlay:!1,requiresAuthOverlay:!1}},{path:"/protected",alias:"/protected",name:"Protected",component:s9,meta:{requiresAuth:!0,title:"Protected",requiresOverlay:!0,requiresAuthOverlay:!0}}],Ur=QR({history:CR(),routes:i9}),Kb=qC(w4);Kb.use(Ur);Kb.mount("#app");
