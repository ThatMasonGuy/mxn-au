(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();/**
* @vue/shared v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function xd(t,e){const n=new Set(t.split(","));return r=>n.has(r)}const lt={},bi=[],Cn=()=>{},uT=()=>!1,Dc=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),kd=t=>t.startsWith("onUpdate:"),Tt=Object.assign,Nd=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},hT=Object.prototype.hasOwnProperty,je=(t,e)=>hT.call(t,e),ge=Array.isArray,Ii=t=>Mc(t)==="[object Map]",Ky=t=>Mc(t)==="[object Set]",Ie=t=>typeof t=="function",pt=t=>typeof t=="string",Qs=t=>typeof t=="symbol",rt=t=>t!==null&&typeof t=="object",Qy=t=>(rt(t)||Ie(t))&&Ie(t.then)&&Ie(t.catch),Yy=Object.prototype.toString,Mc=t=>Yy.call(t),dT=t=>Mc(t).slice(8,-1),Jy=t=>Mc(t)==="[object Object]",Od=t=>pt(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,Lo=xd(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Lc=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},fT=/-(\w)/g,Rn=Lc(t=>t.replace(fT,(e,n)=>n?n.toUpperCase():"")),pT=/\B([A-Z])/g,Gi=Lc(t=>t.replace(pT,"-$1").toLowerCase()),Vc=Lc(t=>t.charAt(0).toUpperCase()+t.slice(1)),Nl=Lc(t=>t?`on${Vc(t)}`:""),rs=(t,e)=>!Object.is(t,e),Ol=(t,e)=>{for(let n=0;n<t.length;n++)t[n](e)},Xy=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},Ch=t=>{const e=parseFloat(t);return isNaN(e)?t:e},mT=t=>{const e=pt(t)?Number(t):NaN;return isNaN(e)?t:e};let Rm;const Zy=()=>Rm||(Rm=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function vr(t){if(ge(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=pt(r)?vT(r):vr(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(pt(t)||rt(t))return t}const gT=/;(?![^(]*\))/g,_T=/:([^]+)/,yT=/\/\*[^]*?\*\//g;function vT(t){const e={};return t.replace(yT,"").split(gT).forEach(n=>{if(n){const r=n.split(_T);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function Ct(t){let e="";if(pt(t))e=t;else if(ge(t))for(let n=0;n<t.length;n++){const r=Ct(t[n]);r&&(e+=r+" ")}else if(rt(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function Oi(t){if(!t)return null;let{class:e,style:n}=t;return e&&!pt(e)&&(t.class=Ct(e)),n&&(t.style=vr(n)),t}const wT="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",ET=xd(wT);function ev(t){return!!t||t===""}const Lt=t=>pt(t)?t:t==null?"":ge(t)||rt(t)&&(t.toString===Yy||!Ie(t.toString))?JSON.stringify(t,tv,2):String(t),tv=(t,e)=>e&&e.__v_isRef?tv(t,e.value):Ii(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[ju(r,i)+" =>"]=s,n),{})}:Ky(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>ju(n))}:Qs(e)?ju(e):rt(e)&&!ge(e)&&!Jy(e)?String(e):e,ju=(t,e="")=>{var n;return Qs(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let pn;class nv{constructor(e=!1){this.detached=e,this._active=!0,this.effects=[],this.cleanups=[],this.parent=pn,!e&&pn&&(this.index=(pn.scopes||(pn.scopes=[])).push(this)-1)}get active(){return this._active}run(e){if(this._active){const n=pn;try{return pn=this,e()}finally{pn=n}}}on(){pn=this}off(){pn=this.parent}stop(e){if(this._active){let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.scopes)for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0,this._active=!1}}}function rv(t){return new nv(t)}function bT(t,e=pn){e&&e.active&&e.effects.push(t)}function sv(){return pn}function IT(t){pn&&pn.cleanups.push(t)}let Os;class Dd{constructor(e,n,r,s){this.fn=e,this.trigger=n,this.scheduler=r,this.active=!0,this.deps=[],this._dirtyLevel=4,this._trackId=0,this._runnings=0,this._shouldSchedule=!1,this._depsLength=0,bT(this,s)}get dirty(){if(this._dirtyLevel===2||this._dirtyLevel===3){this._dirtyLevel=1,us();for(let e=0;e<this._depsLength;e++){const n=this.deps[e];if(n.computed&&(TT(n.computed),this._dirtyLevel>=4))break}this._dirtyLevel===1&&(this._dirtyLevel=0),hs()}return this._dirtyLevel>=4}set dirty(e){this._dirtyLevel=e?4:0}run(){if(this._dirtyLevel=0,!this.active)return this.fn();let e=Yr,n=Os;try{return Yr=!0,Os=this,this._runnings++,Pm(this),this.fn()}finally{xm(this),this._runnings--,Os=n,Yr=e}}stop(){this.active&&(Pm(this),xm(this),this.onStop&&this.onStop(),this.active=!1)}}function TT(t){return t.value}function Pm(t){t._trackId++,t._depsLength=0}function xm(t){if(t.deps.length>t._depsLength){for(let e=t._depsLength;e<t.deps.length;e++)iv(t.deps[e],t);t.deps.length=t._depsLength}}function iv(t,e){const n=t.get(e);n!==void 0&&e._trackId!==n&&(t.delete(e),t.size===0&&t.cleanup())}let Yr=!0,Ah=0;const ov=[];function us(){ov.push(Yr),Yr=!1}function hs(){const t=ov.pop();Yr=t===void 0?!0:t}function Md(){Ah++}function Ld(){for(Ah--;!Ah&&Sh.length;)Sh.shift()()}function av(t,e,n){if(e.get(t)!==t._trackId){e.set(t,t._trackId);const r=t.deps[t._depsLength];r!==e?(r&&iv(r,t),t.deps[t._depsLength++]=e):t._depsLength++}}const Sh=[];function lv(t,e,n){Md();for(const r of t.keys()){let s;r._dirtyLevel<e&&(s??(s=t.get(r)===r._trackId))&&(r._shouldSchedule||(r._shouldSchedule=r._dirtyLevel===0),r._dirtyLevel=e),r._shouldSchedule&&(s??(s=t.get(r)===r._trackId))&&(r.trigger(),(!r._runnings||r.allowRecurse)&&r._dirtyLevel!==2&&(r._shouldSchedule=!1,r.scheduler&&Sh.push(r.scheduler)))}Ld()}const cv=(t,e)=>{const n=new Map;return n.cleanup=t,n.computed=e,n},Kl=new WeakMap,Ds=Symbol(""),Rh=Symbol("");function cn(t,e,n){if(Yr&&Os){let r=Kl.get(t);r||Kl.set(t,r=new Map);let s=r.get(n);s||r.set(n,s=cv(()=>r.delete(n))),av(Os,s)}}function gr(t,e,n,r,s,i){const o=Kl.get(t);if(!o)return;let a=[];if(e==="clear")a=[...o.values()];else if(n==="length"&&ge(t)){const c=Number(r);o.forEach((u,h)=>{(h==="length"||!Qs(h)&&h>=c)&&a.push(u)})}else switch(n!==void 0&&a.push(o.get(n)),e){case"add":ge(t)?Od(n)&&a.push(o.get("length")):(a.push(o.get(Ds)),Ii(t)&&a.push(o.get(Rh)));break;case"delete":ge(t)||(a.push(o.get(Ds)),Ii(t)&&a.push(o.get(Rh)));break;case"set":Ii(t)&&a.push(o.get(Ds));break}Md();for(const c of a)c&&lv(c,4);Ld()}function CT(t,e){const n=Kl.get(t);return n&&n.get(e)}const AT=xd("__proto__,__v_isRef,__isVue"),uv=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Qs)),km=ST();function ST(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...n){const r=He(this);for(let i=0,o=this.length;i<o;i++)cn(r,"get",i+"");const s=r[e](...n);return s===-1||s===!1?r[e](...n.map(He)):s}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...n){us(),Md();const r=He(this)[e].apply(this,n);return Ld(),hs(),r}}),t}function RT(t){Qs(t)||(t=String(t));const e=He(this);return cn(e,"has",t),e.hasOwnProperty(t)}class hv{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?BT:mv:i?pv:fv).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=ge(e);if(!s){if(o&&je(km,n))return Reflect.get(km,n,r);if(n==="hasOwnProperty")return RT}const a=Reflect.get(e,n,r);return(Qs(n)?uv.has(n):AT(n))||(s||cn(e,"get",n),i)?a:Dt(a)?o&&Od(n)?a:a.value:rt(a)?s?_v(a):Ys(a):a}}class dv extends hv{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];if(!this._isShallow){const c=sa(i);if(!Ql(r)&&!sa(r)&&(i=He(i),r=He(r)),!ge(e)&&Dt(i)&&!Dt(r))return c?!1:(i.value=r,!0)}const o=ge(e)&&Od(n)?Number(n)<e.length:je(e,n),a=Reflect.set(e,n,r,s);return e===He(s)&&(o?rs(r,i)&&gr(e,"set",n,r):gr(e,"add",n,r)),a}deleteProperty(e,n){const r=je(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&gr(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!Qs(n)||!uv.has(n))&&cn(e,"has",n),r}ownKeys(e){return cn(e,"iterate",ge(e)?"length":Ds),Reflect.ownKeys(e)}}class PT extends hv{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const xT=new dv,kT=new PT,NT=new dv(!0);const Vd=t=>t,Fc=t=>Reflect.getPrototypeOf(t);function fl(t,e,n=!1,r=!1){t=t.__v_raw;const s=He(t),i=He(e);n||(rs(e,i)&&cn(s,"get",e),cn(s,"get",i));const{has:o}=Fc(s),a=r?Vd:n?$d:ia;if(o.call(s,e))return a(t.get(e));if(o.call(s,i))return a(t.get(i));t!==s&&t.get(e)}function pl(t,e=!1){const n=this.__v_raw,r=He(n),s=He(t);return e||(rs(t,s)&&cn(r,"has",t),cn(r,"has",s)),t===s?n.has(t):n.has(t)||n.has(s)}function ml(t,e=!1){return t=t.__v_raw,!e&&cn(He(t),"iterate",Ds),Reflect.get(t,"size",t)}function Nm(t){t=He(t);const e=He(this);return Fc(e).has.call(e,t)||(e.add(t),gr(e,"add",t,t)),this}function Om(t,e){e=He(e);const n=He(this),{has:r,get:s}=Fc(n);let i=r.call(n,t);i||(t=He(t),i=r.call(n,t));const o=s.call(n,t);return n.set(t,e),i?rs(e,o)&&gr(n,"set",t,e):gr(n,"add",t,e),this}function Dm(t){const e=He(this),{has:n,get:r}=Fc(e);let s=n.call(e,t);s||(t=He(t),s=n.call(e,t)),r&&r.call(e,t);const i=e.delete(t);return s&&gr(e,"delete",t,void 0),i}function Mm(){const t=He(this),e=t.size!==0,n=t.clear();return e&&gr(t,"clear",void 0,void 0),n}function gl(t,e){return function(r,s){const i=this,o=i.__v_raw,a=He(o),c=e?Vd:t?$d:ia;return!t&&cn(a,"iterate",Ds),o.forEach((u,h)=>r.call(s,c(u),c(h),i))}}function _l(t,e,n){return function(...r){const s=this.__v_raw,i=He(s),o=Ii(i),a=t==="entries"||t===Symbol.iterator&&o,c=t==="keys"&&o,u=s[t](...r),h=n?Vd:e?$d:ia;return!e&&cn(i,"iterate",c?Rh:Ds),{next(){const{value:d,done:p}=u.next();return p?{value:d,done:p}:{value:a?[h(d[0]),h(d[1])]:h(d),done:p}},[Symbol.iterator](){return this}}}}function Nr(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function OT(){const t={get(i){return fl(this,i)},get size(){return ml(this)},has:pl,add:Nm,set:Om,delete:Dm,clear:Mm,forEach:gl(!1,!1)},e={get(i){return fl(this,i,!1,!0)},get size(){return ml(this)},has:pl,add:Nm,set:Om,delete:Dm,clear:Mm,forEach:gl(!1,!0)},n={get(i){return fl(this,i,!0)},get size(){return ml(this,!0)},has(i){return pl.call(this,i,!0)},add:Nr("add"),set:Nr("set"),delete:Nr("delete"),clear:Nr("clear"),forEach:gl(!0,!1)},r={get(i){return fl(this,i,!0,!0)},get size(){return ml(this,!0)},has(i){return pl.call(this,i,!0)},add:Nr("add"),set:Nr("set"),delete:Nr("delete"),clear:Nr("clear"),forEach:gl(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(i=>{t[i]=_l(i,!1,!1),n[i]=_l(i,!0,!1),e[i]=_l(i,!1,!0),r[i]=_l(i,!0,!0)}),[t,n,e,r]}const[DT,MT,LT,VT]=OT();function Fd(t,e){const n=e?t?VT:LT:t?MT:DT;return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(je(n,s)&&s in r?n:r,s,i)}const FT={get:Fd(!1,!1)},UT={get:Fd(!1,!0)},$T={get:Fd(!0,!1)};const fv=new WeakMap,pv=new WeakMap,mv=new WeakMap,BT=new WeakMap;function jT(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function qT(t){return t.__v_skip||!Object.isExtensible(t)?0:jT(dT(t))}function Ys(t){return sa(t)?t:Ud(t,!1,xT,FT,fv)}function gv(t){return Ud(t,!1,NT,UT,pv)}function _v(t){return Ud(t,!0,kT,$T,mv)}function Ud(t,e,n,r,s){if(!rt(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=s.get(t);if(i)return i;const o=qT(t);if(o===0)return t;const a=new Proxy(t,o===2?r:n);return s.set(t,a),a}function Vo(t){return sa(t)?Vo(t.__v_raw):!!(t&&t.__v_isReactive)}function sa(t){return!!(t&&t.__v_isReadonly)}function Ql(t){return!!(t&&t.__v_isShallow)}function yv(t){return t?!!t.__v_raw:!1}function He(t){const e=t&&t.__v_raw;return e?He(e):t}function HT(t){return Object.isExtensible(t)&&Xy(t,"__v_skip",!0),t}const ia=t=>rt(t)?Ys(t):t,$d=t=>rt(t)?_v(t):t;class vv{constructor(e,n,r,s){this.getter=e,this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this.effect=new Dd(()=>e(this._value),()=>Dl(this,this.effect._dirtyLevel===2?2:3)),this.effect.computed=this,this.effect.active=this._cacheable=!s,this.__v_isReadonly=r}get value(){const e=He(this);return(!e._cacheable||e.effect.dirty)&&rs(e._value,e._value=e.effect.run())&&Dl(e,4),wv(e),e.effect._dirtyLevel>=2&&Dl(e,2),e._value}set value(e){this._setter(e)}get _dirty(){return this.effect.dirty}set _dirty(e){this.effect.dirty=e}}function WT(t,e,n=!1){let r,s;const i=Ie(t);return i?(r=t,s=Cn):(r=t.get,s=t.set),new vv(r,s,i||!s,n)}function wv(t){var e;Yr&&Os&&(t=He(t),av(Os,(e=t.dep)!=null?e:t.dep=cv(()=>t.dep=void 0,t instanceof vv?t:void 0)))}function Dl(t,e=4,n){t=He(t);const r=t.dep;r&&lv(r,e)}function Dt(t){return!!(t&&t.__v_isRef===!0)}function ae(t){return Ev(t,!1)}function zT(t){return Ev(t,!0)}function Ev(t,e){return Dt(t)?t:new GT(t,e)}class GT{constructor(e,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?e:He(e),this._value=n?e:ia(e)}get value(){return wv(this),this._value}set value(e){const n=this.__v_isShallow||Ql(e)||sa(e);e=n?e:He(e),rs(e,this._rawValue)&&(this._rawValue=e,this._value=n?e:ia(e),Dl(this,4))}}function j(t){return Dt(t)?t.value:t}const KT={get:(t,e,n)=>j(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return Dt(s)&&!Dt(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function bv(t){return Vo(t)?t:new Proxy(t,KT)}function Bd(t){const e=ge(t)?new Array(t.length):{};for(const n in t)e[n]=Iv(t,n);return e}class QT{constructor(e,n,r){this._object=e,this._key=n,this._defaultValue=r,this.__v_isRef=!0}get value(){const e=this._object[this._key];return e===void 0?this._defaultValue:e}set value(e){this._object[this._key]=e}get dep(){return CT(He(this._object),this._key)}}class YT{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0}get value(){return this._getter()}}function JT(t,e,n){return Dt(t)?t:Ie(t)?new YT(t):rt(t)&&arguments.length>1?Iv(t,e,n):ae(t)}function Iv(t,e,n){const r=t[e];return Dt(r)?r:new QT(t,e,n)}/**
* @vue/runtime-core v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Jr(t,e,n,r){try{return r?t(...r):t()}catch(s){Uc(s,e,n)}}function An(t,e,n,r){if(Ie(t)){const s=Jr(t,e,n,r);return s&&Qy(s)&&s.catch(i=>{Uc(i,e,n)}),s}if(ge(t)){const s=[];for(let i=0;i<t.length;i++)s.push(An(t[i],e,n,r));return s}}function Uc(t,e,n,r=!0){const s=e?e.vnode:null;if(e){let i=e.parent;const o=e.proxy,a=`https://vuejs.org/error-reference/#runtime-${n}`;for(;i;){const u=i.ec;if(u){for(let h=0;h<u.length;h++)if(u[h](t,o,a)===!1)return}i=i.parent}const c=e.appContext.config.errorHandler;if(c){us(),Jr(c,null,10,[t,o,a]),hs();return}}XT(t,n,s,r)}function XT(t,e,n,r=!0){console.error(t)}let oa=!1,Ph=!1;const Qt=[];let Gn=0;const Ti=[];let $r=null,Cs=0;const Tv=Promise.resolve();let jd=null;function tr(t){const e=jd||Tv;return t?e.then(this?t.bind(this):t):e}function ZT(t){let e=Gn+1,n=Qt.length;for(;e<n;){const r=e+n>>>1,s=Qt[r],i=aa(s);i<t||i===t&&s.pre?e=r+1:n=r}return e}function qd(t){(!Qt.length||!Qt.includes(t,oa&&t.allowRecurse?Gn+1:Gn))&&(t.id==null?Qt.push(t):Qt.splice(ZT(t.id),0,t),Cv())}function Cv(){!oa&&!Ph&&(Ph=!0,jd=Tv.then(Sv))}function eC(t){const e=Qt.indexOf(t);e>Gn&&Qt.splice(e,1)}function tC(t){ge(t)?Ti.push(...t):(!$r||!$r.includes(t,t.allowRecurse?Cs+1:Cs))&&Ti.push(t),Cv()}function Lm(t,e,n=oa?Gn+1:0){for(;n<Qt.length;n++){const r=Qt[n];if(r&&r.pre){if(t&&r.id!==t.uid)continue;Qt.splice(n,1),n--,r()}}}function Av(t){if(Ti.length){const e=[...new Set(Ti)].sort((n,r)=>aa(n)-aa(r));if(Ti.length=0,$r){$r.push(...e);return}for($r=e,Cs=0;Cs<$r.length;Cs++)$r[Cs]();$r=null,Cs=0}}const aa=t=>t.id==null?1/0:t.id,nC=(t,e)=>{const n=aa(t)-aa(e);if(n===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return n};function Sv(t){Ph=!1,oa=!0,Qt.sort(nC);try{for(Gn=0;Gn<Qt.length;Gn++){const e=Qt[Gn];e&&e.active!==!1&&Jr(e,null,14)}}finally{Gn=0,Qt.length=0,Av(),oa=!1,jd=null,(Qt.length||Ti.length)&&Sv()}}function rC(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||lt;let s=n;const i=e.startsWith("update:"),o=i&&e.slice(7);if(o&&o in r){const h=`${o==="modelValue"?"model":o}Modifiers`,{number:d,trim:p}=r[h]||lt;p&&(s=n.map(g=>pt(g)?g.trim():g)),d&&(s=n.map(Ch))}let a,c=r[a=Nl(e)]||r[a=Nl(Rn(e))];!c&&i&&(c=r[a=Nl(Gi(e))]),c&&An(c,t,6,s);const u=r[a+"Once"];if(u){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,An(u,t,6,s)}}function Rv(t,e,n=!1){const r=e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!Ie(t)){const c=u=>{const h=Rv(u,e,!0);h&&(a=!0,Tt(o,h))};!n&&e.mixins.length&&e.mixins.forEach(c),t.extends&&c(t.extends),t.mixins&&t.mixins.forEach(c)}return!i&&!a?(rt(t)&&r.set(t,null),null):(ge(i)?i.forEach(c=>o[c]=null):Tt(o,i),rt(t)&&r.set(t,o),o)}function $c(t,e){return!t||!Dc(e)?!1:(e=e.slice(2).replace(/Once$/,""),je(t,e[0].toLowerCase()+e.slice(1))||je(t,Gi(e))||je(t,e))}let Rt=null,Bc=null;function Yl(t){const e=Rt;return Rt=t,Bc=t&&t.type.__scopeId||null,e}function sC(t){Bc=t}function iC(){Bc=null}function te(t,e=Rt,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&Ym(-1);const i=Yl(e);let o;try{o=t(...s)}finally{Yl(i),r._d&&Ym(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function qu(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:c,render:u,renderCache:h,props:d,data:p,setupState:g,ctx:v,inheritAttrs:S}=t,P=Yl(t);let M,F;try{if(n.shapeFlag&4){const N=s||r,G=N;M=zn(u.call(G,N,h,d,g,p,v)),F=a}else{const N=e;M=zn(N.length>1?N(d,{attrs:a,slots:o,emit:c}):N(d,null)),F=e.props?a:oC(a)}}catch(N){qo.length=0,Uc(N,t,1),M=J(on)}let U=M;if(F&&S!==!1){const N=Object.keys(F),{shapeFlag:G}=U;N.length&&G&7&&(i&&N.some(kd)&&(F=aC(F,i)),U=wr(U,F,!1,!0))}return n.dirs&&(U=wr(U,null,!1,!0),U.dirs=U.dirs?U.dirs.concat(n.dirs):n.dirs),n.transition&&(U.transition=n.transition),M=U,Yl(P),M}const oC=t=>{let e;for(const n in t)(n==="class"||n==="style"||Dc(n))&&((e||(e={}))[n]=t[n]);return e},aC=(t,e)=>{const n={};for(const r in t)(!kd(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function lC(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:c}=e,u=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?Vm(r,o,u):!!o;if(c&8){const h=e.dynamicProps;for(let d=0;d<h.length;d++){const p=h[d];if(o[p]!==r[p]&&!$c(u,p))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?Vm(r,o,u):!0:!!o;return!1}function Vm(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(e[i]!==t[i]&&!$c(n,i))return!0}return!1}function cC({vnode:t,parent:e},n){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===t&&(r.el=t.el),r===t)(t=e.vnode).el=n,e=e.parent;else break}}const Hd="components";function ut(t,e){return xv(Hd,t,!0,e)||t}const Pv=Symbol.for("v-ndc");function vi(t){return pt(t)?xv(Hd,t,!1)||t:t||Pv}function xv(t,e,n=!0,r=!1){const s=Rt||Ut;if(s){const i=s.type;if(t===Hd){const a=oA(i,!1);if(a&&(a===e||a===Rn(e)||a===Vc(Rn(e))))return i}const o=Fm(s[t]||i[t],e)||Fm(s.appContext[t],e);return!o&&r?i:o}}function Fm(t,e){return t&&(t[e]||t[Rn(e)]||t[Vc(Rn(e))])}const uC=t=>t.__isSuspense;function hC(t,e){e&&e.pendingBranch?ge(t)?e.effects.push(...t):e.effects.push(t):tC(t)}const dC=Symbol.for("v-scx"),fC=()=>$n(dC);function _n(t,e){return Wd(t,null,e)}const yl={};function It(t,e,n){return Wd(t,e,n)}function Wd(t,e,{immediate:n,deep:r,flush:s,once:i,onTrack:o,onTrigger:a}=lt){if(e&&i){const B=e;e=(...A)=>{B(...A),G()}}const c=Ut,u=B=>r===!0?B:Ss(B,r===!1?1:void 0);let h,d=!1,p=!1;if(Dt(t)?(h=()=>t.value,d=Ql(t)):Vo(t)?(h=()=>u(t),d=!0):ge(t)?(p=!0,d=t.some(B=>Vo(B)||Ql(B)),h=()=>t.map(B=>{if(Dt(B))return B.value;if(Vo(B))return u(B);if(Ie(B))return Jr(B,c,2)})):Ie(t)?e?h=()=>Jr(t,c,2):h=()=>(g&&g(),An(t,c,3,[v])):h=Cn,e&&r){const B=h;h=()=>Ss(B())}let g,v=B=>{g=U.onStop=()=>{Jr(B,c,4),g=U.onStop=void 0}},S;if(zc)if(v=Cn,e?n&&An(e,c,3,[h(),p?[]:void 0,v]):h(),s==="sync"){const B=fC();S=B.__watcherHandles||(B.__watcherHandles=[])}else return Cn;let P=p?new Array(t.length).fill(yl):yl;const M=()=>{if(!(!U.active||!U.dirty))if(e){const B=U.run();(r||d||(p?B.some((A,y)=>rs(A,P[y])):rs(B,P)))&&(g&&g(),An(e,c,3,[B,P===yl?void 0:p&&P[0]===yl?[]:P,v]),P=B)}else U.run()};M.allowRecurse=!!e;let F;s==="sync"?F=M:s==="post"?F=()=>rn(M,c&&c.suspense):(M.pre=!0,c&&(M.id=c.uid),F=()=>qd(M));const U=new Dd(h,Cn,F),N=sv(),G=()=>{U.stop(),N&&Nd(N.effects,U)};return e?n?M():P=U.run():s==="post"?rn(U.run.bind(U),c&&c.suspense):U.run(),S&&S.push(G),G}function pC(t,e,n){const r=this.proxy,s=pt(t)?t.includes(".")?kv(r,t):()=>r[t]:t.bind(r,r);let i;Ie(e)?i=e:(i=e.handler,n=e);const o=Oa(this),a=Wd(s,i.bind(r),n);return o(),a}function kv(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}function Ss(t,e=1/0,n){if(e<=0||!rt(t)||t.__v_skip||(n=n||new Set,n.has(t)))return t;if(n.add(t),e--,Dt(t))Ss(t.value,e,n);else if(ge(t))for(let r=0;r<t.length;r++)Ss(t[r],e,n);else if(Ky(t)||Ii(t))t.forEach(r=>{Ss(r,e,n)});else if(Jy(t))for(const r in t)Ss(t[r],e,n);return t}function zd(t,e){if(Rt===null)return t;const n=Gc(Rt)||Rt.proxy,r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,c=lt]=e[s];i&&(Ie(i)&&(i={mounted:i,updated:i}),i.deep&&Ss(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:c}))}return t}function ys(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let c=a.dir[r];c&&(us(),An(c,n,8,[t.el,a,t,e]),hs())}}const Br=Symbol("_leaveCb"),vl=Symbol("_enterCb");function mC(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return un(()=>{t.isMounted=!0}),Hc(()=>{t.isUnmounting=!0}),t}const In=[Function,Array],Nv={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:In,onEnter:In,onAfterEnter:In,onEnterCancelled:In,onBeforeLeave:In,onLeave:In,onAfterLeave:In,onLeaveCancelled:In,onBeforeAppear:In,onAppear:In,onAfterAppear:In,onAppearCancelled:In},gC={name:"BaseTransition",props:Nv,setup(t,{slots:e}){const n=nr(),r=mC();return()=>{const s=e.default&&Dv(e.default(),!0);if(!s||!s.length)return;let i=s[0];if(s.length>1){for(const p of s)if(p.type!==on){i=p;break}}const o=He(t),{mode:a}=o;if(r.isLeaving)return Hu(i);const c=Um(i);if(!c)return Hu(i);const u=xh(c,o,r,n);kh(c,u);const h=n.subTree,d=h&&Um(h);if(d&&d.type!==on&&!As(c,d)){const p=xh(d,o,r,n);if(kh(d,p),a==="out-in"&&c.type!==on)return r.isLeaving=!0,p.afterLeave=()=>{r.isLeaving=!1,n.update.active!==!1&&(n.effect.dirty=!0,n.update())},Hu(i);a==="in-out"&&c.type!==on&&(p.delayLeave=(g,v,S)=>{const P=Ov(r,d);P[String(d.key)]=d,g[Br]=()=>{v(),g[Br]=void 0,delete u.delayedLeave},u.delayedLeave=S})}return i}}},_C=gC;function Ov(t,e){const{leavingVNodes:n}=t;let r=n.get(e.type);return r||(r=Object.create(null),n.set(e.type,r)),r}function xh(t,e,n,r){const{appear:s,mode:i,persisted:o=!1,onBeforeEnter:a,onEnter:c,onAfterEnter:u,onEnterCancelled:h,onBeforeLeave:d,onLeave:p,onAfterLeave:g,onLeaveCancelled:v,onBeforeAppear:S,onAppear:P,onAfterAppear:M,onAppearCancelled:F}=e,U=String(t.key),N=Ov(n,t),G=(y,w)=>{y&&An(y,r,9,w)},B=(y,w)=>{const T=w[1];G(y,w),ge(y)?y.every(R=>R.length<=1)&&T():y.length<=1&&T()},A={mode:i,persisted:o,beforeEnter(y){let w=a;if(!n.isMounted)if(s)w=S||a;else return;y[Br]&&y[Br](!0);const T=N[U];T&&As(t,T)&&T.el[Br]&&T.el[Br](),G(w,[y])},enter(y){let w=c,T=u,R=h;if(!n.isMounted)if(s)w=P||c,T=M||u,R=F||h;else return;let I=!1;const b=y[vl]=Ve=>{I||(I=!0,Ve?G(R,[y]):G(T,[y]),A.delayedLeave&&A.delayedLeave(),y[vl]=void 0)};w?B(w,[y,b]):b()},leave(y,w){const T=String(t.key);if(y[vl]&&y[vl](!0),n.isUnmounting)return w();G(d,[y]);let R=!1;const I=y[Br]=b=>{R||(R=!0,w(),b?G(v,[y]):G(g,[y]),y[Br]=void 0,N[T]===t&&delete N[T])};N[T]=t,p?B(p,[y,I]):I()},clone(y){return xh(y,e,n,r)}};return A}function Hu(t){if(jc(t))return t=wr(t),t.children=null,t}function Um(t){if(!jc(t))return t;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&Ie(n.default))return n.default()}}function kh(t,e){t.shapeFlag&6&&t.component?kh(t.component.subTree,e):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Dv(t,e=!1,n){let r=[],s=0;for(let i=0;i<t.length;i++){let o=t[i];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:i);o.type===ct?(o.patchFlag&128&&s++,r=r.concat(Dv(o.children,e,a))):(e||o.type!==on)&&r.push(a!=null?wr(o,{key:a}):o)}if(s>1)for(let i=0;i<r.length;i++)r[i].patchFlag=-2;return r}/*! #__NO_SIDE_EFFECTS__ */function et(t,e){return Ie(t)?Tt({name:t.name},e,{setup:t}):t}const Fo=t=>!!t.type.__asyncLoader,jc=t=>t.type.__isKeepAlive;function yC(t,e){Mv(t,"a",e)}function vC(t,e){Mv(t,"da",e)}function Mv(t,e,n=Ut){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(qc(e,r,n),n){let s=n.parent;for(;s&&s.parent;)jc(s.parent.vnode)&&wC(r,e,n,s),s=s.parent}}function wC(t,e,n,r){const s=qc(e,t,r,!0);Ki(()=>{Nd(r[e],s)},n)}function qc(t,e,n=Ut,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{if(n.isUnmounted)return;us();const a=Oa(n),c=An(e,n,t,o);return a(),hs(),c});return r?s.unshift(i):s.push(i),i}}const Cr=t=>(e,n=Ut)=>(!zc||t==="sp")&&qc(t,(...r)=>e(...r),n),EC=Cr("bm"),un=Cr("m"),bC=Cr("bu"),IC=Cr("u"),Hc=Cr("bum"),Ki=Cr("um"),TC=Cr("sp"),CC=Cr("rtg"),AC=Cr("rtc");function SC(t,e=Ut){qc("ec",t,e)}function ss(t,e,n,r){let s;const i=n;if(ge(t)||pt(t)){s=new Array(t.length);for(let o=0,a=t.length;o<a;o++)s[o]=e(t[o],o,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let o=0;o<t;o++)s[o]=e(o+1,o,void 0,i)}else if(rt(t))if(t[Symbol.iterator])s=Array.from(t,(o,a)=>e(o,a,void 0,i));else{const o=Object.keys(t);s=new Array(o.length);for(let a=0,c=o.length;a<c;a++){const u=o[a];s[a]=e(t[u],u,a,i)}}else s=[];return s}function Re(t,e,n={},r,s){if(Rt.isCE||Rt.parent&&Fo(Rt.parent)&&Rt.parent.isCE)return e!=="default"&&(n.name=e),J("slot",n,r&&r());let i=t[e];i&&i._c&&(i._d=!1),H();const o=i&&Lv(i(n)),a=Ae(ct,{key:n.key||o&&o.key||`_${e}`},o||(r?r():[]),o&&t._===1?64:-2);return a.scopeId&&(a.slotScopeIds=[a.scopeId+"-s"]),i&&i._c&&(i._d=!0),a}function Lv(t){return t.some(e=>Xl(e)?!(e.type===on||e.type===ct&&!Lv(e.children)):!0)?t:null}const Nh=t=>t?Jv(t)?Gc(t)||t.proxy:Nh(t.parent):null,Uo=Tt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Nh(t.parent),$root:t=>Nh(t.root),$emit:t=>t.emit,$options:t=>Gd(t),$forceUpdate:t=>t.f||(t.f=()=>{t.effect.dirty=!0,qd(t.update)}),$nextTick:t=>t.n||(t.n=tr.bind(t.proxy)),$watch:t=>pC.bind(t)}),Wu=(t,e)=>t!==lt&&!t.__isScriptSetup&&je(t,e),RC={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:c}=t;let u;if(e[0]!=="$"){const g=o[e];if(g!==void 0)switch(g){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(Wu(r,e))return o[e]=1,r[e];if(s!==lt&&je(s,e))return o[e]=2,s[e];if((u=t.propsOptions[0])&&je(u,e))return o[e]=3,i[e];if(n!==lt&&je(n,e))return o[e]=4,n[e];Oh&&(o[e]=0)}}const h=Uo[e];let d,p;if(h)return e==="$attrs"&&cn(t.attrs,"get",""),h(t);if((d=a.__cssModules)&&(d=d[e]))return d;if(n!==lt&&je(n,e))return o[e]=4,n[e];if(p=c.config.globalProperties,je(p,e))return p[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return Wu(s,e)?(s[e]=n,!0):r!==lt&&je(r,e)?(r[e]=n,!0):je(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,propsOptions:i}},o){let a;return!!n[o]||t!==lt&&je(t,o)||Wu(e,o)||(a=i[0])&&je(a,o)||je(r,o)||je(Uo,o)||je(s.config.globalProperties,o)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:je(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function PC(){return xC().attrs}function xC(){const t=nr();return t.setupContext||(t.setupContext=Zv(t))}function $m(t){return ge(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Oh=!0;function kC(t){const e=Gd(t),n=t.proxy,r=t.ctx;Oh=!1,e.beforeCreate&&Bm(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:c,inject:u,created:h,beforeMount:d,mounted:p,beforeUpdate:g,updated:v,activated:S,deactivated:P,beforeDestroy:M,beforeUnmount:F,destroyed:U,unmounted:N,render:G,renderTracked:B,renderTriggered:A,errorCaptured:y,serverPrefetch:w,expose:T,inheritAttrs:R,components:I,directives:b,filters:Ve}=e;if(u&&NC(u,r,null),o)for(const Ce in o){const ve=o[Ce];Ie(ve)&&(r[Ce]=ve.bind(n))}if(s){const Ce=s.call(n,n);rt(Ce)&&(t.data=Ys(Ce))}if(Oh=!0,i)for(const Ce in i){const ve=i[Ce],Ge=Ie(ve)?ve.bind(n,n):Ie(ve.get)?ve.get.bind(n,n):Cn,xt=!Ie(ve)&&Ie(ve.set)?ve.set.bind(n):Cn,wt=we({get:Ge,set:xt});Object.defineProperty(r,Ce,{enumerable:!0,configurable:!0,get:()=>wt.value,set:Ke=>wt.value=Ke})}if(a)for(const Ce in a)Vv(a[Ce],r,n,Ce);if(c){const Ce=Ie(c)?c.call(n):c;Reflect.ownKeys(Ce).forEach(ve=>{Bo(ve,Ce[ve])})}h&&Bm(h,t,"c");function $e(Ce,ve){ge(ve)?ve.forEach(Ge=>Ce(Ge.bind(n))):ve&&Ce(ve.bind(n))}if($e(EC,d),$e(un,p),$e(bC,g),$e(IC,v),$e(yC,S),$e(vC,P),$e(SC,y),$e(AC,B),$e(CC,A),$e(Hc,F),$e(Ki,N),$e(TC,w),ge(T))if(T.length){const Ce=t.exposed||(t.exposed={});T.forEach(ve=>{Object.defineProperty(Ce,ve,{get:()=>n[ve],set:Ge=>n[ve]=Ge})})}else t.exposed||(t.exposed={});G&&t.render===Cn&&(t.render=G),R!=null&&(t.inheritAttrs=R),I&&(t.components=I),b&&(t.directives=b)}function NC(t,e,n=Cn){ge(t)&&(t=Dh(t));for(const r in t){const s=t[r];let i;rt(s)?"default"in s?i=$n(s.from||r,s.default,!0):i=$n(s.from||r):i=$n(s),Dt(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function Bm(t,e,n){An(ge(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function Vv(t,e,n,r){const s=r.includes(".")?kv(n,r):()=>n[r];if(pt(t)){const i=e[t];Ie(i)&&It(s,i)}else if(Ie(t))It(s,t.bind(n));else if(rt(t))if(ge(t))t.forEach(i=>Vv(i,e,n,r));else{const i=Ie(t.handler)?t.handler.bind(n):e[t.handler];Ie(i)&&It(s,i,t)}}function Gd(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let c;return a?c=a:!s.length&&!n&&!r?c=e:(c={},s.length&&s.forEach(u=>Jl(c,u,o,!0)),Jl(c,e,o)),rt(e)&&i.set(e,c),c}function Jl(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&Jl(t,i,n,!0),s&&s.forEach(o=>Jl(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=OC[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const OC={data:jm,props:qm,emits:qm,methods:Po,computed:Po,beforeCreate:nn,created:nn,beforeMount:nn,mounted:nn,beforeUpdate:nn,updated:nn,beforeDestroy:nn,beforeUnmount:nn,destroyed:nn,unmounted:nn,activated:nn,deactivated:nn,errorCaptured:nn,serverPrefetch:nn,components:Po,directives:Po,watch:MC,provide:jm,inject:DC};function jm(t,e){return e?t?function(){return Tt(Ie(t)?t.call(this,this):t,Ie(e)?e.call(this,this):e)}:e:t}function DC(t,e){return Po(Dh(t),Dh(e))}function Dh(t){if(ge(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function nn(t,e){return t?[...new Set([].concat(t,e))]:e}function Po(t,e){return t?Tt(Object.create(null),t,e):e}function qm(t,e){return t?ge(t)&&ge(e)?[...new Set([...t,...e])]:Tt(Object.create(null),$m(t),$m(e??{})):e}function MC(t,e){if(!t)return e;if(!e)return t;const n=Tt(Object.create(null),t);for(const r in e)n[r]=nn(t[r],e[r]);return n}function Fv(){return{app:null,config:{isNativeTag:uT,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let LC=0;function VC(t,e){return function(r,s=null){Ie(r)||(r=Tt({},r)),s!=null&&!rt(s)&&(s=null);const i=Fv(),o=new WeakSet;let a=!1;const c=i.app={_uid:LC++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:lA,get config(){return i.config},set config(u){},use(u,...h){return o.has(u)||(u&&Ie(u.install)?(o.add(u),u.install(c,...h)):Ie(u)&&(o.add(u),u(c,...h))),c},mixin(u){return i.mixins.includes(u)||i.mixins.push(u),c},component(u,h){return h?(i.components[u]=h,c):i.components[u]},directive(u,h){return h?(i.directives[u]=h,c):i.directives[u]},mount(u,h,d){if(!a){const p=J(r,s);return p.appContext=i,d===!0?d="svg":d===!1&&(d=void 0),h&&e?e(p,u):t(p,u,d),a=!0,c._container=u,u.__vue_app__=c,Gc(p.component)||p.component.proxy}},unmount(){a&&(t(null,c._container),delete c._container.__vue_app__)},provide(u,h){return i.provides[u]=h,c},runWithContext(u){const h=$o;$o=c;try{return u()}finally{$o=h}}};return c}}let $o=null;function Bo(t,e){if(Ut){let n=Ut.provides;const r=Ut.parent&&Ut.parent.provides;r===n&&(n=Ut.provides=Object.create(r)),n[t]=e}}function $n(t,e,n=!1){const r=Ut||Rt;if(r||$o){const s=r?r.parent==null?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:$o._context.provides;if(s&&t in s)return s[t];if(arguments.length>1)return n&&Ie(e)?e.call(r&&r.proxy):e}}const Uv={},$v=()=>Object.create(Uv),Bv=t=>Object.getPrototypeOf(t)===Uv;function FC(t,e,n,r=!1){const s={},i=$v();t.propsDefaults=Object.create(null),jv(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:gv(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function UC(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=He(s),[c]=t.propsOptions;let u=!1;if((r||o>0)&&!(o&16)){if(o&8){const h=t.vnode.dynamicProps;for(let d=0;d<h.length;d++){let p=h[d];if($c(t.emitsOptions,p))continue;const g=e[p];if(c)if(je(i,p))g!==i[p]&&(i[p]=g,u=!0);else{const v=Rn(p);s[v]=Mh(c,a,v,g,t,!1)}else g!==i[p]&&(i[p]=g,u=!0)}}}else{jv(t,e,s,i)&&(u=!0);let h;for(const d in a)(!e||!je(e,d)&&((h=Gi(d))===d||!je(e,h)))&&(c?n&&(n[d]!==void 0||n[h]!==void 0)&&(s[d]=Mh(c,a,d,void 0,t,!0)):delete s[d]);if(i!==a)for(const d in i)(!e||!je(e,d))&&(delete i[d],u=!0)}u&&gr(t.attrs,"set","")}function jv(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let c in e){if(Lo(c))continue;const u=e[c];let h;s&&je(s,h=Rn(c))?!i||!i.includes(h)?n[h]=u:(a||(a={}))[h]=u:$c(t.emitsOptions,c)||(!(c in r)||u!==r[c])&&(r[c]=u,o=!0)}if(i){const c=He(n),u=a||lt;for(let h=0;h<i.length;h++){const d=i[h];n[d]=Mh(s,c,d,u[d],t,!je(u,d))}}return o}function Mh(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=je(o,"default");if(a&&r===void 0){const c=o.default;if(o.type!==Function&&!o.skipFactory&&Ie(c)){const{propsDefaults:u}=s;if(n in u)r=u[n];else{const h=Oa(s);r=u[n]=c.call(null,e),h()}}else r=c}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===Gi(n))&&(r=!0))}return r}function qv(t,e,n=!1){const r=e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let c=!1;if(!Ie(t)){const h=d=>{c=!0;const[p,g]=qv(d,e,!0);Tt(o,p),g&&a.push(...g)};!n&&e.mixins.length&&e.mixins.forEach(h),t.extends&&h(t.extends),t.mixins&&t.mixins.forEach(h)}if(!i&&!c)return rt(t)&&r.set(t,bi),bi;if(ge(i))for(let h=0;h<i.length;h++){const d=Rn(i[h]);Hm(d)&&(o[d]=lt)}else if(i)for(const h in i){const d=Rn(h);if(Hm(d)){const p=i[h],g=o[d]=ge(p)||Ie(p)?{type:p}:Tt({},p);if(g){const v=Gm(Boolean,g.type),S=Gm(String,g.type);g[0]=v>-1,g[1]=S<0||v<S,(v>-1||je(g,"default"))&&a.push(d)}}}const u=[o,a];return rt(t)&&r.set(t,u),u}function Hm(t){return t[0]!=="$"&&!Lo(t)}function Wm(t){return t===null?"null":typeof t=="function"?t.name||"":typeof t=="object"&&t.constructor&&t.constructor.name||""}function zm(t,e){return Wm(t)===Wm(e)}function Gm(t,e){return ge(e)?e.findIndex(n=>zm(n,t)):Ie(e)&&zm(e,t)?0:-1}const Hv=t=>t[0]==="_"||t==="$stable",Kd=t=>ge(t)?t.map(zn):[zn(t)],$C=(t,e,n)=>{if(e._n)return e;const r=te((...s)=>Kd(e(...s)),n);return r._c=!1,r},Wv=(t,e,n)=>{const r=t._ctx;for(const s in t){if(Hv(s))continue;const i=t[s];if(Ie(i))e[s]=$C(s,i,r);else if(i!=null){const o=Kd(i);e[s]=()=>o}}},zv=(t,e)=>{const n=Kd(e);t.slots.default=()=>n},BC=(t,e)=>{const n=t.slots=$v();if(t.vnode.shapeFlag&32){const r=e._;r?(Tt(n,e),Xy(n,"_",r,!0)):Wv(e,n)}else e&&zv(t,e)},jC=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=lt;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:(Tt(s,e),!n&&a===1&&delete s._):(i=!e.$stable,Wv(e,s)),o=e}else e&&(zv(t,e),o={default:1});if(i)for(const a in s)!Hv(a)&&o[a]==null&&delete s[a]};function Lh(t,e,n,r,s=!1){if(ge(t)){t.forEach((p,g)=>Lh(p,e&&(ge(e)?e[g]:e),n,r,s));return}if(Fo(r)&&!s)return;const i=r.shapeFlag&4?Gc(r.component)||r.component.proxy:r.el,o=s?null:i,{i:a,r:c}=t,u=e&&e.r,h=a.refs===lt?a.refs={}:a.refs,d=a.setupState;if(u!=null&&u!==c&&(pt(u)?(h[u]=null,je(d,u)&&(d[u]=null)):Dt(u)&&(u.value=null)),Ie(c))Jr(c,a,12,[o,h]);else{const p=pt(c),g=Dt(c);if(p||g){const v=()=>{if(t.f){const S=p?je(d,c)?d[c]:h[c]:c.value;s?ge(S)&&Nd(S,i):ge(S)?S.includes(i)||S.push(i):p?(h[c]=[i],je(d,c)&&(d[c]=h[c])):(c.value=[i],t.k&&(h[t.k]=c.value))}else p?(h[c]=o,je(d,c)&&(d[c]=o)):g&&(c.value=o,t.k&&(h[t.k]=o))};o?(v.id=-1,rn(v,n)):v()}}}const rn=hC;function qC(t){return HC(t)}function HC(t,e){const n=Zy();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:c,setText:u,setElementText:h,parentNode:d,nextSibling:p,setScopeId:g=Cn,insertStaticContent:v}=t,S=(E,C,k,$=null,V=null,Q=null,se=void 0,Z=null,ne=!!C.dynamicChildren)=>{if(E===C)return;E&&!As(E,C)&&($=D(E),Ke(E,V,Q,!0),E=null),C.patchFlag===-2&&(ne=!1,C.dynamicChildren=null);const{type:z,ref:oe,shapeFlag:de}=C;switch(z){case Wc:P(E,C,k,$);break;case on:M(E,C,k,$);break;case Ml:E==null&&F(C,k,$,se);break;case ct:I(E,C,k,$,V,Q,se,Z,ne);break;default:de&1?G(E,C,k,$,V,Q,se,Z,ne):de&6?b(E,C,k,$,V,Q,se,Z,ne):(de&64||de&128)&&z.process(E,C,k,$,V,Q,se,Z,ne,ie)}oe!=null&&V&&Lh(oe,E&&E.ref,Q,C||E,!C)},P=(E,C,k,$)=>{if(E==null)r(C.el=a(C.children),k,$);else{const V=C.el=E.el;C.children!==E.children&&u(V,C.children)}},M=(E,C,k,$)=>{E==null?r(C.el=c(C.children||""),k,$):C.el=E.el},F=(E,C,k,$)=>{[E.el,E.anchor]=v(E.children,C,k,$,E.el,E.anchor)},U=({el:E,anchor:C},k,$)=>{let V;for(;E&&E!==C;)V=p(E),r(E,k,$),E=V;r(C,k,$)},N=({el:E,anchor:C})=>{let k;for(;E&&E!==C;)k=p(E),s(E),E=k;s(C)},G=(E,C,k,$,V,Q,se,Z,ne)=>{C.type==="svg"?se="svg":C.type==="math"&&(se="mathml"),E==null?B(C,k,$,V,Q,se,Z,ne):w(E,C,V,Q,se,Z,ne)},B=(E,C,k,$,V,Q,se,Z)=>{let ne,z;const{props:oe,shapeFlag:de,transition:ue,dirs:ce}=E;if(ne=E.el=o(E.type,Q,oe&&oe.is,oe),de&8?h(ne,E.children):de&16&&y(E.children,ne,null,$,V,zu(E,Q),se,Z),ce&&ys(E,null,$,"created"),A(ne,E,E.scopeId,se,$),oe){for(const Be in oe)Be!=="value"&&!Lo(Be)&&i(ne,Be,null,oe[Be],Q,E.children,$,V,ke);"value"in oe&&i(ne,"value",null,oe.value,Q),(z=oe.onVnodeBeforeMount)&&Wn(z,$,E)}ce&&ys(E,null,$,"beforeMount");const fe=WC(V,ue);fe&&ue.beforeEnter(ne),r(ne,C,k),((z=oe&&oe.onVnodeMounted)||fe||ce)&&rn(()=>{z&&Wn(z,$,E),fe&&ue.enter(ne),ce&&ys(E,null,$,"mounted")},V)},A=(E,C,k,$,V)=>{if(k&&g(E,k),$)for(let Q=0;Q<$.length;Q++)g(E,$[Q]);if(V){let Q=V.subTree;if(C===Q){const se=V.vnode;A(E,se,se.scopeId,se.slotScopeIds,V.parent)}}},y=(E,C,k,$,V,Q,se,Z,ne=0)=>{for(let z=ne;z<E.length;z++){const oe=E[z]=Z?jr(E[z]):zn(E[z]);S(null,oe,C,k,$,V,Q,se,Z)}},w=(E,C,k,$,V,Q,se)=>{const Z=C.el=E.el;let{patchFlag:ne,dynamicChildren:z,dirs:oe}=C;ne|=E.patchFlag&16;const de=E.props||lt,ue=C.props||lt;let ce;if(k&&vs(k,!1),(ce=ue.onVnodeBeforeUpdate)&&Wn(ce,k,C,E),oe&&ys(C,E,k,"beforeUpdate"),k&&vs(k,!0),z?T(E.dynamicChildren,z,Z,k,$,zu(C,V),Q):se||ve(E,C,Z,null,k,$,zu(C,V),Q,!1),ne>0){if(ne&16)R(Z,C,de,ue,k,$,V);else if(ne&2&&de.class!==ue.class&&i(Z,"class",null,ue.class,V),ne&4&&i(Z,"style",de.style,ue.style,V),ne&8){const fe=C.dynamicProps;for(let Be=0;Be<fe.length;Be++){const Je=fe[Be],vt=de[Je],dn=ue[Je];(dn!==vt||Je==="value")&&i(Z,Je,vt,dn,V,E.children,k,$,ke)}}ne&1&&E.children!==C.children&&h(Z,C.children)}else!se&&z==null&&R(Z,C,de,ue,k,$,V);((ce=ue.onVnodeUpdated)||oe)&&rn(()=>{ce&&Wn(ce,k,C,E),oe&&ys(C,E,k,"updated")},$)},T=(E,C,k,$,V,Q,se)=>{for(let Z=0;Z<C.length;Z++){const ne=E[Z],z=C[Z],oe=ne.el&&(ne.type===ct||!As(ne,z)||ne.shapeFlag&70)?d(ne.el):k;S(ne,z,oe,null,$,V,Q,se,!0)}},R=(E,C,k,$,V,Q,se)=>{if(k!==$){if(k!==lt)for(const Z in k)!Lo(Z)&&!(Z in $)&&i(E,Z,k[Z],null,se,C.children,V,Q,ke);for(const Z in $){if(Lo(Z))continue;const ne=$[Z],z=k[Z];ne!==z&&Z!=="value"&&i(E,Z,z,ne,se,C.children,V,Q,ke)}"value"in $&&i(E,"value",k.value,$.value,se)}},I=(E,C,k,$,V,Q,se,Z,ne)=>{const z=C.el=E?E.el:a(""),oe=C.anchor=E?E.anchor:a("");let{patchFlag:de,dynamicChildren:ue,slotScopeIds:ce}=C;ce&&(Z=Z?Z.concat(ce):ce),E==null?(r(z,k,$),r(oe,k,$),y(C.children||[],k,oe,V,Q,se,Z,ne)):de>0&&de&64&&ue&&E.dynamicChildren?(T(E.dynamicChildren,ue,k,V,Q,se,Z),(C.key!=null||V&&C===V.subTree)&&Qd(E,C,!0)):ve(E,C,k,oe,V,Q,se,Z,ne)},b=(E,C,k,$,V,Q,se,Z,ne)=>{C.slotScopeIds=Z,E==null?C.shapeFlag&512?V.ctx.activate(C,k,$,se,ne):Ve(C,k,$,V,Q,se,ne):ht(E,C,ne)},Ve=(E,C,k,$,V,Q,se)=>{const Z=E.component=nA(E,$,V);if(jc(E)&&(Z.ctx.renderer=ie),rA(Z),Z.asyncDep){if(V&&V.registerDep(Z,$e),!E.el){const ne=Z.subTree=J(on);M(null,ne,C,k)}}else $e(Z,E,C,k,V,Q,se)},ht=(E,C,k)=>{const $=C.component=E.component;if(lC(E,C,k))if($.asyncDep&&!$.asyncResolved){Ce($,C,k);return}else $.next=C,eC($.update),$.effect.dirty=!0,$.update();else C.el=E.el,$.vnode=C},$e=(E,C,k,$,V,Q,se)=>{const Z=()=>{if(E.isMounted){let{next:oe,bu:de,u:ue,parent:ce,vnode:fe}=E;{const En=Gv(E);if(En){oe&&(oe.el=fe.el,Ce(E,oe,se)),En.asyncDep.then(()=>{E.isUnmounted||Z()});return}}let Be=oe,Je;vs(E,!1),oe?(oe.el=fe.el,Ce(E,oe,se)):oe=fe,de&&Ol(de),(Je=oe.props&&oe.props.onVnodeBeforeUpdate)&&Wn(Je,ce,oe,fe),vs(E,!0);const vt=qu(E),dn=E.subTree;E.subTree=vt,S(dn,vt,d(dn.el),D(dn),E,V,Q),oe.el=vt.el,Be===null&&cC(E,vt.el),ue&&rn(ue,V),(Je=oe.props&&oe.props.onVnodeUpdated)&&rn(()=>Wn(Je,ce,oe,fe),V)}else{let oe;const{el:de,props:ue}=C,{bm:ce,m:fe,parent:Be}=E,Je=Fo(C);if(vs(E,!1),ce&&Ol(ce),!Je&&(oe=ue&&ue.onVnodeBeforeMount)&&Wn(oe,Be,C),vs(E,!0),de&&Qe){const vt=()=>{E.subTree=qu(E),Qe(de,E.subTree,E,V,null)};Je?C.type.__asyncLoader().then(()=>!E.isUnmounted&&vt()):vt()}else{const vt=E.subTree=qu(E);S(null,vt,k,$,E,V,Q),C.el=vt.el}if(fe&&rn(fe,V),!Je&&(oe=ue&&ue.onVnodeMounted)){const vt=C;rn(()=>Wn(oe,Be,vt),V)}(C.shapeFlag&256||Be&&Fo(Be.vnode)&&Be.vnode.shapeFlag&256)&&E.a&&rn(E.a,V),E.isMounted=!0,C=k=$=null}},ne=E.effect=new Dd(Z,Cn,()=>qd(z),E.scope),z=E.update=()=>{ne.dirty&&ne.run()};z.id=E.uid,vs(E,!0),z()},Ce=(E,C,k)=>{C.component=E;const $=E.vnode.props;E.vnode=C,E.next=null,UC(E,C.props,$,k),jC(E,C.children,k),us(),Lm(E),hs()},ve=(E,C,k,$,V,Q,se,Z,ne=!1)=>{const z=E&&E.children,oe=E?E.shapeFlag:0,de=C.children,{patchFlag:ue,shapeFlag:ce}=C;if(ue>0){if(ue&128){xt(z,de,k,$,V,Q,se,Z,ne);return}else if(ue&256){Ge(z,de,k,$,V,Q,se,Z,ne);return}}ce&8?(oe&16&&ke(z,V,Q),de!==z&&h(k,de)):oe&16?ce&16?xt(z,de,k,$,V,Q,se,Z,ne):ke(z,V,Q,!0):(oe&8&&h(k,""),ce&16&&y(de,k,$,V,Q,se,Z,ne))},Ge=(E,C,k,$,V,Q,se,Z,ne)=>{E=E||bi,C=C||bi;const z=E.length,oe=C.length,de=Math.min(z,oe);let ue;for(ue=0;ue<de;ue++){const ce=C[ue]=ne?jr(C[ue]):zn(C[ue]);S(E[ue],ce,k,null,V,Q,se,Z,ne)}z>oe?ke(E,V,Q,!0,!1,de):y(C,k,$,V,Q,se,Z,ne,de)},xt=(E,C,k,$,V,Q,se,Z,ne)=>{let z=0;const oe=C.length;let de=E.length-1,ue=oe-1;for(;z<=de&&z<=ue;){const ce=E[z],fe=C[z]=ne?jr(C[z]):zn(C[z]);if(As(ce,fe))S(ce,fe,k,null,V,Q,se,Z,ne);else break;z++}for(;z<=de&&z<=ue;){const ce=E[de],fe=C[ue]=ne?jr(C[ue]):zn(C[ue]);if(As(ce,fe))S(ce,fe,k,null,V,Q,se,Z,ne);else break;de--,ue--}if(z>de){if(z<=ue){const ce=ue+1,fe=ce<oe?C[ce].el:$;for(;z<=ue;)S(null,C[z]=ne?jr(C[z]):zn(C[z]),k,fe,V,Q,se,Z,ne),z++}}else if(z>ue)for(;z<=de;)Ke(E[z],V,Q,!0),z++;else{const ce=z,fe=z,Be=new Map;for(z=fe;z<=ue;z++){const Zt=C[z]=ne?jr(C[z]):zn(C[z]);Zt.key!=null&&Be.set(Zt.key,z)}let Je,vt=0;const dn=ue-fe+1;let En=!1,so=0;const Rr=new Array(dn);for(z=0;z<dn;z++)Rr[z]=0;for(z=ce;z<=de;z++){const Zt=E[z];if(vt>=dn){Ke(Zt,V,Q,!0);continue}let bn;if(Zt.key!=null)bn=Be.get(Zt.key);else for(Je=fe;Je<=ue;Je++)if(Rr[Je-fe]===0&&As(Zt,C[Je])){bn=Je;break}bn===void 0?Ke(Zt,V,Q,!0):(Rr[bn-fe]=z+1,bn>=so?so=bn:En=!0,S(Zt,C[bn],k,null,V,Q,se,Z,ne),vt++)}const oi=En?zC(Rr):bi;for(Je=oi.length-1,z=dn-1;z>=0;z--){const Zt=fe+z,bn=C[Zt],ai=Zt+1<oe?C[Zt+1].el:$;Rr[z]===0?S(null,bn,k,ai,V,Q,se,Z,ne):En&&(Je<0||z!==oi[Je]?wt(bn,k,ai,2):Je--)}}},wt=(E,C,k,$,V=null)=>{const{el:Q,type:se,transition:Z,children:ne,shapeFlag:z}=E;if(z&6){wt(E.component.subTree,C,k,$);return}if(z&128){E.suspense.move(C,k,$);return}if(z&64){se.move(E,C,k,ie);return}if(se===ct){r(Q,C,k);for(let de=0;de<ne.length;de++)wt(ne[de],C,k,$);r(E.anchor,C,k);return}if(se===Ml){U(E,C,k);return}if($!==2&&z&1&&Z)if($===0)Z.beforeEnter(Q),r(Q,C,k),rn(()=>Z.enter(Q),V);else{const{leave:de,delayLeave:ue,afterLeave:ce}=Z,fe=()=>r(Q,C,k),Be=()=>{de(Q,()=>{fe(),ce&&ce()})};ue?ue(Q,fe,Be):Be()}else r(Q,C,k)},Ke=(E,C,k,$=!1,V=!1)=>{const{type:Q,props:se,ref:Z,children:ne,dynamicChildren:z,shapeFlag:oe,patchFlag:de,dirs:ue}=E;if(Z!=null&&Lh(Z,null,k,E,!0),oe&256){C.ctx.deactivate(E);return}const ce=oe&1&&ue,fe=!Fo(E);let Be;if(fe&&(Be=se&&se.onVnodeBeforeUnmount)&&Wn(Be,C,E),oe&6)Pe(E.component,k,$);else{if(oe&128){E.suspense.unmount(k,$);return}ce&&ys(E,null,C,"beforeUnmount"),oe&64?E.type.remove(E,C,k,V,ie,$):z&&(Q!==ct||de>0&&de&64)?ke(z,C,k,!1,!0):(Q===ct&&de&384||!V&&oe&16)&&ke(ne,C,k),$&&st(E)}(fe&&(Be=se&&se.onVnodeUnmounted)||ce)&&rn(()=>{Be&&Wn(Be,C,E),ce&&ys(E,null,C,"unmounted")},k)},st=E=>{const{type:C,el:k,anchor:$,transition:V}=E;if(C===ct){q(k,$);return}if(C===Ml){N(E);return}const Q=()=>{s(k),V&&!V.persisted&&V.afterLeave&&V.afterLeave()};if(E.shapeFlag&1&&V&&!V.persisted){const{leave:se,delayLeave:Z}=V,ne=()=>se(k,Q);Z?Z(E.el,Q,ne):ne()}else Q()},q=(E,C)=>{let k;for(;E!==C;)k=p(E),s(E),E=k;s(C)},Pe=(E,C,k)=>{const{bum:$,scope:V,update:Q,subTree:se,um:Z}=E;$&&Ol($),V.stop(),Q&&(Q.active=!1,Ke(se,E,C,k)),Z&&rn(Z,C),rn(()=>{E.isUnmounted=!0},C),C&&C.pendingBranch&&!C.isUnmounted&&E.asyncDep&&!E.asyncResolved&&E.suspenseId===C.pendingId&&(C.deps--,C.deps===0&&C.resolve())},ke=(E,C,k,$=!1,V=!1,Q=0)=>{for(let se=Q;se<E.length;se++)Ke(E[se],C,k,$,V)},D=E=>E.shapeFlag&6?D(E.component.subTree):E.shapeFlag&128?E.suspense.next():p(E.anchor||E.el);let Y=!1;const X=(E,C,k)=>{E==null?C._vnode&&Ke(C._vnode,null,null,!0):S(C._vnode||null,E,C,null,null,null,k),Y||(Y=!0,Lm(),Av(),Y=!1),C._vnode=E},ie={p:S,um:Ke,m:wt,r:st,mt:Ve,mc:y,pc:ve,pbc:T,n:D,o:t};let xe,Qe;return{render:X,hydrate:xe,createApp:VC(X,xe)}}function zu({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function vs({effect:t,update:e},n){t.allowRecurse=e.allowRecurse=n}function WC(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function Qd(t,e,n=!1){const r=t.children,s=e.children;if(ge(r)&&ge(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=jr(s[i]),a.el=o.el),n||Qd(o,a)),a.type===Wc&&(a.el=o.el)}}function zC(t){const e=t.slice(),n=[0];let r,s,i,o,a;const c=t.length;for(r=0;r<c;r++){const u=t[r];if(u!==0){if(s=n[n.length-1],t[s]<u){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<u?i=a+1:o=a;u<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function Gv(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Gv(e)}const GC=t=>t.__isTeleport,jo=t=>t&&(t.disabled||t.disabled===""),Km=t=>typeof SVGElement<"u"&&t instanceof SVGElement,Qm=t=>typeof MathMLElement=="function"&&t instanceof MathMLElement,Vh=(t,e)=>{const n=t&&t.to;return pt(n)?e?e(n):null:n},KC={name:"Teleport",__isTeleport:!0,process(t,e,n,r,s,i,o,a,c,u){const{mc:h,pc:d,pbc:p,o:{insert:g,querySelector:v,createText:S,createComment:P}}=u,M=jo(e.props);let{shapeFlag:F,children:U,dynamicChildren:N}=e;if(t==null){const G=e.el=S(""),B=e.anchor=S("");g(G,n,r),g(B,n,r);const A=e.target=Vh(e.props,v),y=e.targetAnchor=S("");A&&(g(y,A),o==="svg"||Km(A)?o="svg":(o==="mathml"||Qm(A))&&(o="mathml"));const w=(T,R)=>{F&16&&h(U,T,R,s,i,o,a,c)};M?w(n,B):A&&w(A,y)}else{e.el=t.el;const G=e.anchor=t.anchor,B=e.target=t.target,A=e.targetAnchor=t.targetAnchor,y=jo(t.props),w=y?n:B,T=y?G:A;if(o==="svg"||Km(B)?o="svg":(o==="mathml"||Qm(B))&&(o="mathml"),N?(p(t.dynamicChildren,N,w,s,i,o,a),Qd(t,e,!0)):c||d(t,e,w,T,s,i,o,a,!1),M)y?e.props&&t.props&&e.props.to!==t.props.to&&(e.props.to=t.props.to):wl(e,n,G,u,1);else if((e.props&&e.props.to)!==(t.props&&t.props.to)){const R=e.target=Vh(e.props,v);R&&wl(e,R,null,u,0)}else y&&wl(e,B,A,u,1)}Kv(e)},remove(t,e,n,r,{um:s,o:{remove:i}},o){const{shapeFlag:a,children:c,anchor:u,targetAnchor:h,target:d,props:p}=t;if(d&&i(h),o&&i(u),a&16){const g=o||!jo(p);for(let v=0;v<c.length;v++){const S=c[v];s(S,e,n,g,!!S.dynamicChildren)}}},move:wl,hydrate:QC};function wl(t,e,n,{o:{insert:r},m:s},i=2){i===0&&r(t.targetAnchor,e,n);const{el:o,anchor:a,shapeFlag:c,children:u,props:h}=t,d=i===2;if(d&&r(o,e,n),(!d||jo(h))&&c&16)for(let p=0;p<u.length;p++)s(u[p],e,n,2);d&&r(a,e,n)}function QC(t,e,n,r,s,i,{o:{nextSibling:o,parentNode:a,querySelector:c}},u){const h=e.target=Vh(e.props,c);if(h){const d=h._lpa||h.firstChild;if(e.shapeFlag&16)if(jo(e.props))e.anchor=u(o(t),e,a(t),n,r,s,i),e.targetAnchor=d;else{e.anchor=o(t);let p=d;for(;p;)if(p=o(p),p&&p.nodeType===8&&p.data==="teleport anchor"){e.targetAnchor=p,h._lpa=e.targetAnchor&&o(e.targetAnchor);break}u(d,e,h,n,r,s,i)}Kv(e)}return e.anchor&&o(e.anchor)}const YC=KC;function Kv(t){const e=t.ctx;if(e&&e.ut){let n=t.children[0].el;for(;n&&n!==t.targetAnchor;)n.nodeType===1&&n.setAttribute("data-v-owner",e.uid),n=n.nextSibling;e.ut()}}const ct=Symbol.for("v-fgt"),Wc=Symbol.for("v-txt"),on=Symbol.for("v-cmt"),Ml=Symbol.for("v-stc"),qo=[];let Ln=null;function H(t=!1){qo.push(Ln=t?null:[])}function JC(){qo.pop(),Ln=qo[qo.length-1]||null}let la=1;function Ym(t){la+=t}function Qv(t){return t.dynamicChildren=la>0?Ln||bi:null,JC(),la>0&&Ln&&Ln.push(t),t}function he(t,e,n,r,s,i){return Qv(L(t,e,n,r,s,i,!0))}function Ae(t,e,n,r,s){return Qv(J(t,e,n,r,s,!0))}function Xl(t){return t?t.__v_isVNode===!0:!1}function As(t,e){return t.type===e.type&&t.key===e.key}const Yv=({key:t})=>t??null,Ll=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?pt(t)||Dt(t)||Ie(t)?{i:Rt,r:t,k:e,f:!!n}:t:null);function L(t,e=null,n=null,r=0,s=null,i=t===ct?0:1,o=!1,a=!1){const c={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Yv(e),ref:e&&Ll(e),scopeId:Bc,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:Rt};return a?(Yd(c,n),i&128&&t.normalize(c)):n&&(c.shapeFlag|=pt(n)?8:16),la>0&&!o&&Ln&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&Ln.push(c),c}const J=XC;function XC(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===Pv)&&(t=on),Xl(t)){const a=wr(t,e,!0);return n&&Yd(a,n),la>0&&!i&&Ln&&(a.shapeFlag&6?Ln[Ln.indexOf(t)]=a:Ln.push(a)),a.patchFlag|=-2,a}if(aA(t)&&(t=t.__vccOpts),e){e=Na(e);let{class:a,style:c}=e;a&&!pt(a)&&(e.class=Ct(a)),rt(c)&&(yv(c)&&!ge(c)&&(c=Tt({},c)),e.style=vr(c))}const o=pt(t)?1:uC(t)?128:GC(t)?64:rt(t)?4:Ie(t)?2:0;return L(t,e,n,r,s,o,i,!0)}function Na(t){return t?yv(t)||Bv(t)?Tt({},t):t:null}function wr(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:c}=t,u=e?ft(s||{},e):s,h={__v_isVNode:!0,__v_skip:!0,type:t.type,props:u,key:u&&Yv(u),ref:e&&e.ref?n&&i?ge(i)?i.concat(Ll(e)):[i,Ll(e)]:Ll(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==ct?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:c,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&wr(t.ssContent),ssFallback:t.ssFallback&&wr(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return c&&r&&(h.transition=c.clone(h)),h}function Ue(t=" ",e=0){return J(Wc,null,t,e)}function ZC(t,e){const n=J(Ml,null,t);return n.staticCount=e,n}function sn(t="",e=!1){return e?(H(),Ae(on,null,t)):J(on,null,t)}function zn(t){return t==null||typeof t=="boolean"?J(on):ge(t)?J(ct,null,t.slice()):typeof t=="object"?jr(t):J(Wc,null,String(t))}function jr(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:wr(t)}function Yd(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if(ge(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),Yd(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Bv(e)?e._ctx=Rt:s===3&&Rt&&(Rt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Ie(e)?(e={default:e,_ctx:Rt},n=32):(e=String(e),r&64?(n=16,e=[Ue(e)]):n=8);t.children=e,t.shapeFlag|=n}function ft(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=Ct([e.class,r.class]));else if(s==="style")e.style=vr([e.style,r.style]);else if(Dc(s)){const i=e[s],o=r[s];o&&i!==o&&!(ge(i)&&i.includes(o))&&(e[s]=i?[].concat(i,o):o)}else s!==""&&(e[s]=r[s])}return e}function Wn(t,e,n,r=null){An(t,e,7,[n,r])}const eA=Fv();let tA=0;function nA(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||eA,i={uid:tA++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,scope:new nv(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:qv(r,s),emitsOptions:Rv(r,s),emit:null,emitted:null,propsDefaults:lt,inheritAttrs:r.inheritAttrs,ctx:lt,data:lt,props:lt,attrs:lt,slots:lt,refs:lt,setupState:lt,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=rC.bind(null,i),t.ce&&t.ce(i),i}let Ut=null;const nr=()=>Ut||Rt;let Zl,Fh;{const t=Zy(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};Zl=e("__VUE_INSTANCE_SETTERS__",n=>Ut=n),Fh=e("__VUE_SSR_SETTERS__",n=>zc=n)}const Oa=t=>{const e=Ut;return Zl(t),t.scope.on(),()=>{t.scope.off(),Zl(e)}},Jm=()=>{Ut&&Ut.scope.off(),Zl(null)};function Jv(t){return t.vnode.shapeFlag&4}let zc=!1;function rA(t,e=!1){e&&Fh(e);const{props:n,children:r}=t.vnode,s=Jv(t);FC(t,n,s,e),BC(t,r);const i=s?sA(t,e):void 0;return e&&Fh(!1),i}function sA(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,RC);const{setup:r}=n;if(r){const s=t.setupContext=r.length>1?Zv(t):null,i=Oa(t);us();const o=Jr(r,t,0,[t.props,s]);if(hs(),i(),Qy(o)){if(o.then(Jm,Jm),e)return o.then(a=>{Xm(t,a,e)}).catch(a=>{Uc(a,t,0)});t.asyncDep=o}else Xm(t,o,e)}else Xv(t,e)}function Xm(t,e,n){Ie(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:rt(e)&&(t.setupState=bv(e)),Xv(t,n)}let Zm;function Xv(t,e,n){const r=t.type;if(!t.render){if(!e&&Zm&&!r.render){const s=r.template||Gd(t).template;if(s){const{isCustomElement:i,compilerOptions:o}=t.appContext.config,{delimiters:a,compilerOptions:c}=r,u=Tt(Tt({isCustomElement:i,delimiters:a},o),c);r.render=Zm(s,u)}}t.render=r.render||Cn}{const s=Oa(t);us();try{kC(t)}finally{hs(),s()}}}const iA={get(t,e){return cn(t,"get",""),t[e]}};function Zv(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,iA),slots:t.slots,emit:t.emit,expose:e}}function Gc(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(bv(HT(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in Uo)return Uo[n](t)},has(e,n){return n in e||n in Uo}}))}function oA(t,e=!0){return Ie(t)?t.displayName||t.name:t.name||e&&t.__name}function aA(t){return Ie(t)&&"__vccOpts"in t}const we=(t,e)=>WT(t,e,zc);function Ms(t,e,n){const r=arguments.length;return r===2?rt(e)&&!ge(e)?Xl(e)?J(t,null,[e]):J(t,e):J(t,null,e):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&Xl(n)&&(n=[n]),J(t,e,n))}const lA="3.4.27";/**
* @vue/runtime-dom v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const cA="http://www.w3.org/2000/svg",uA="http://www.w3.org/1998/Math/MathML",qr=typeof document<"u"?document:null,eg=qr&&qr.createElement("template"),hA={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?qr.createElementNS(cA,t):e==="mathml"?qr.createElementNS(uA,t):qr.createElement(t,n?{is:n}:void 0);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>qr.createTextNode(t),createComment:t=>qr.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>qr.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{eg.innerHTML=r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t;const a=eg.content;if(r==="svg"||r==="mathml"){const c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Or="transition",vo="animation",ca=Symbol("_vtc"),Kc=(t,{slots:e})=>Ms(_C,dA(t),e);Kc.displayName="Transition";const ew={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};Kc.props=Tt({},Nv,ew);const ws=(t,e=[])=>{ge(t)?t.forEach(n=>n(...e)):t&&t(...e)},tg=t=>t?ge(t)?t.some(e=>e.length>1):t.length>1:!1;function dA(t){const e={};for(const I in t)I in ew||(e[I]=t[I]);if(t.css===!1)return e;const{name:n="v",type:r,duration:s,enterFromClass:i=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:c=i,appearActiveClass:u=o,appearToClass:h=a,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:p=`${n}-leave-active`,leaveToClass:g=`${n}-leave-to`}=t,v=fA(s),S=v&&v[0],P=v&&v[1],{onBeforeEnter:M,onEnter:F,onEnterCancelled:U,onLeave:N,onLeaveCancelled:G,onBeforeAppear:B=M,onAppear:A=F,onAppearCancelled:y=U}=e,w=(I,b,Ve)=>{Es(I,b?h:a),Es(I,b?u:o),Ve&&Ve()},T=(I,b)=>{I._isLeaving=!1,Es(I,d),Es(I,g),Es(I,p),b&&b()},R=I=>(b,Ve)=>{const ht=I?A:F,$e=()=>w(b,I,Ve);ws(ht,[b,$e]),ng(()=>{Es(b,I?c:i),Dr(b,I?h:a),tg(ht)||rg(b,r,S,$e)})};return Tt(e,{onBeforeEnter(I){ws(M,[I]),Dr(I,i),Dr(I,o)},onBeforeAppear(I){ws(B,[I]),Dr(I,c),Dr(I,u)},onEnter:R(!1),onAppear:R(!0),onLeave(I,b){I._isLeaving=!0;const Ve=()=>T(I,b);Dr(I,d),Dr(I,p),gA(),ng(()=>{I._isLeaving&&(Es(I,d),Dr(I,g),tg(N)||rg(I,r,P,Ve))}),ws(N,[I,Ve])},onEnterCancelled(I){w(I,!1),ws(U,[I])},onAppearCancelled(I){w(I,!0),ws(y,[I])},onLeaveCancelled(I){T(I),ws(G,[I])}})}function fA(t){if(t==null)return null;if(rt(t))return[Gu(t.enter),Gu(t.leave)];{const e=Gu(t);return[e,e]}}function Gu(t){return mT(t)}function Dr(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t[ca]||(t[ca]=new Set)).add(e)}function Es(t,e){e.split(/\s+/).forEach(r=>r&&t.classList.remove(r));const n=t[ca];n&&(n.delete(e),n.size||(t[ca]=void 0))}function ng(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let pA=0;function rg(t,e,n,r){const s=t._endId=++pA,i=()=>{s===t._endId&&r()};if(n)return setTimeout(i,n);const{type:o,timeout:a,propCount:c}=mA(t,e);if(!o)return r();const u=o+"end";let h=0;const d=()=>{t.removeEventListener(u,p),i()},p=g=>{g.target===t&&++h>=c&&d()};setTimeout(()=>{h<c&&d()},a+1),t.addEventListener(u,p)}function mA(t,e){const n=window.getComputedStyle(t),r=v=>(n[v]||"").split(", "),s=r(`${Or}Delay`),i=r(`${Or}Duration`),o=sg(s,i),a=r(`${vo}Delay`),c=r(`${vo}Duration`),u=sg(a,c);let h=null,d=0,p=0;e===Or?o>0&&(h=Or,d=o,p=i.length):e===vo?u>0&&(h=vo,d=u,p=c.length):(d=Math.max(o,u),h=d>0?o>u?Or:vo:null,p=h?h===Or?i.length:c.length:0);const g=h===Or&&/\b(transform|all)(,|$)/.test(r(`${Or}Property`).toString());return{type:h,timeout:d,propCount:p,hasTransform:g}}function sg(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,r)=>ig(n)+ig(t[r])))}function ig(t){return t==="auto"?0:Number(t.slice(0,-1).replace(",","."))*1e3}function gA(){return document.body.offsetHeight}function _A(t,e,n){const r=t[ca];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const ec=Symbol("_vod"),tw=Symbol("_vsh"),yA={beforeMount(t,{value:e},{transition:n}){t[ec]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):wo(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:r}){!e!=!n&&(r?e?(r.beforeEnter(t),wo(t,!0),r.enter(t)):r.leave(t,()=>{wo(t,!1)}):wo(t,e))},beforeUnmount(t,{value:e}){wo(t,e)}};function wo(t,e){t.style.display=e?t[ec]:"none",t[tw]=!e}const vA=Symbol(""),wA=/(^|;)\s*display\s*:/;function EA(t,e,n){const r=t.style,s=pt(n);let i=!1;if(n&&!s){if(e)if(pt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Vl(r,a,"")}else for(const o in e)n[o]==null&&Vl(r,o,"");for(const o in n)o==="display"&&(i=!0),Vl(r,o,n[o])}else if(s){if(e!==n){const o=r[vA];o&&(n+=";"+o),r.cssText=n,i=wA.test(n)}}else e&&t.removeAttribute("style");ec in t&&(t[ec]=i?r.display:"",t[tw]&&(r.display="none"))}const og=/\s*!important$/;function Vl(t,e,n){if(ge(n))n.forEach(r=>Vl(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=bA(t,e);og.test(n)?t.setProperty(Gi(r),n.replace(og,""),"important"):t[r]=n}}const ag=["Webkit","Moz","ms"],Ku={};function bA(t,e){const n=Ku[e];if(n)return n;let r=Rn(e);if(r!=="filter"&&r in t)return Ku[e]=r;r=Vc(r);for(let s=0;s<ag.length;s++){const i=ag[s]+r;if(i in t)return Ku[e]=i}return e}const lg="http://www.w3.org/1999/xlink";function IA(t,e,n,r,s){if(r&&e.startsWith("xlink:"))n==null?t.removeAttributeNS(lg,e.slice(6,e.length)):t.setAttributeNS(lg,e,n);else{const i=ET(e);n==null||i&&!ev(n)?t.removeAttribute(e):t.setAttribute(e,i?"":n)}}function TA(t,e,n,r,s,i,o){if(e==="innerHTML"||e==="textContent"){r&&o(r,s,i),t[e]=n??"";return}const a=t.tagName;if(e==="value"&&a!=="PROGRESS"&&!a.includes("-")){const u=a==="OPTION"?t.getAttribute("value")||"":t.value,h=n??"";(u!==h||!("_value"in t))&&(t.value=h),n==null&&t.removeAttribute(e),t._value=n;return}let c=!1;if(n===""||n==null){const u=typeof t[e];u==="boolean"?n=ev(n):n==null&&u==="string"?(n="",c=!0):u==="number"&&(n=0,c=!0)}try{t[e]=n}catch{}c&&t.removeAttribute(e)}function pi(t,e,n,r){t.addEventListener(e,n,r)}function CA(t,e,n,r){t.removeEventListener(e,n,r)}const cg=Symbol("_vei");function AA(t,e,n,r,s=null){const i=t[cg]||(t[cg]={}),o=i[e];if(r&&o)o.value=r;else{const[a,c]=SA(e);if(r){const u=i[e]=xA(r,s);pi(t,a,u,c)}else o&&(CA(t,a,o,c),i[e]=void 0)}}const ug=/(?:Once|Passive|Capture)$/;function SA(t){let e;if(ug.test(t)){e={};let r;for(;r=t.match(ug);)t=t.slice(0,t.length-r[0].length),e[r[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Gi(t.slice(2)),e]}let Qu=0;const RA=Promise.resolve(),PA=()=>Qu||(RA.then(()=>Qu=0),Qu=Date.now());function xA(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;An(kA(r,n.value),e,5,[r])};return n.value=t,n.attached=PA(),n}function kA(t,e){if(ge(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(r=>s=>!s._stopped&&r&&r(s))}else return e}const hg=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,NA=(t,e,n,r,s,i,o,a,c)=>{const u=s==="svg";e==="class"?_A(t,r,u):e==="style"?EA(t,n,r):Dc(e)?kd(e)||AA(t,e,n,r,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):OA(t,e,r,u))?TA(t,e,r,i,o,a,c):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),IA(t,e,r,u))};function OA(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&hg(e)&&Ie(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return hg(e)&&pt(n)?!1:e in t}const dg=t=>{const e=t.props["onUpdate:modelValue"]||!1;return ge(e)?n=>Ol(e,n):e};function DA(t){t.target.composing=!0}function fg(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Yu=Symbol("_assign"),nw={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t[Yu]=dg(s);const i=r||s.props&&s.props.type==="number";pi(t,e?"change":"input",o=>{if(o.target.composing)return;let a=t.value;n&&(a=a.trim()),i&&(a=Ch(a)),t[Yu](a)}),n&&pi(t,"change",()=>{t.value=t.value.trim()}),e||(pi(t,"compositionstart",DA),pi(t,"compositionend",fg),pi(t,"change",fg))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,modifiers:{lazy:n,trim:r,number:s}},i){if(t[Yu]=dg(i),t.composing)return;const o=(s||t.type==="number")&&!/^0\d/.test(t.value)?Ch(t.value):t.value,a=e??"";o!==a&&(document.activeElement===t&&t.type!=="range"&&(n||r&&t.value.trim()===a)||(t.value=a))}},MA=["ctrl","shift","alt","meta"],LA={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>MA.some(n=>t[`${n}Key`]&&!e.includes(n))},VA=(t,e)=>{const n=t._withMods||(t._withMods={}),r=e.join(".");return n[r]||(n[r]=(s,...i)=>{for(let o=0;o<e.length;o++){const a=LA[e[o]];if(a&&a(s,e))return}return t(s,...i)})},FA=Tt({patchProp:NA},hA);let pg;function UA(){return pg||(pg=qC(FA))}const $A=(...t)=>{const e=UA().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=jA(r);if(!s)return;const i=e._component;!Ie(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.innerHTML="";const o=n(s,!1,BA(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e};function BA(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function jA(t){return pt(t)?document.querySelector(t):t}function rw(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t))for(e=0;e<t.length;e++)t[e]&&(n=rw(t[e]))&&(r&&(r+=" "),r+=n);else for(e in t)t[e]&&(r&&(r+=" "),r+=e);return r}function qA(){for(var t,e,n=0,r="";n<arguments.length;)(t=arguments[n++])&&(e=rw(t))&&(r&&(r+=" "),r+=e);return r}const mg=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,gg=qA,sw=(t,e)=>n=>{var r;if((e==null?void 0:e.variants)==null)return gg(t,n==null?void 0:n.class,n==null?void 0:n.className);const{variants:s,defaultVariants:i}=e,o=Object.keys(s).map(u=>{const h=n==null?void 0:n[u],d=i==null?void 0:i[u];if(h===null)return null;const p=mg(h)||mg(d);return s[u][p]}),a=n&&Object.entries(n).reduce((u,h)=>{let[d,p]=h;return p===void 0||(u[d]=p),u},{}),c=e==null||(r=e.compoundVariants)===null||r===void 0?void 0:r.reduce((u,h)=>{let{class:d,className:p,...g}=h;return Object.entries(g).every(v=>{let[S,P]=v;return Array.isArray(P)?P.includes({...i,...a}[S]):{...i,...a}[S]===P})?[...u,d,p]:u},[]);return gg(t,o,c,n==null?void 0:n.class,n==null?void 0:n.className)};function Jd(t,e){const n=typeof t=="string"&&!e?`${t}Context`:e,r=Symbol(n);return[s=>{const i=$n(r,s);if(i||i===null)return i;throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(t)?`one of the following components: ${t.join(", ")}`:`\`${t}\``}`)},s=>(Bo(r,s),s)]}function iw(t,e,n){const r=n.originalEvent.target,s=new CustomEvent(t,{bubbles:!1,cancelable:!0,detail:n});e&&r.addEventListener(t,e,{once:!0}),r.dispatchEvent(s)}function ow(t){return sv()?(IT(t),!0):!1}function HA(t){let e=!1,n;const r=rv(!0);return(...s)=>(e||(n=r.run(()=>t(...s)),e=!0),n)}function WA(t){let e=0,n,r;const s=()=>{e-=1,r&&e<=0&&(r.stop(),n=void 0,r=void 0)};return(...i)=>(e+=1,n||(r=rv(!0),n=r.run(()=>t(...i))),ow(s),n)}function Xd(t){return typeof t=="function"?t():j(t)}const Js=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const zA=t=>typeof t<"u",GA=Object.prototype.toString,KA=t=>GA.call(t)==="[object Object]",QA=()=>{},_g=YA();function YA(){var t,e;return Js&&((t=window==null?void 0:window.navigator)==null?void 0:t.userAgent)&&(/iP(ad|hone|od)/.test(window.navigator.userAgent)||((e=window==null?void 0:window.navigator)==null?void 0:e.maxTouchPoints)>2&&/iPad|Macintosh/.test(window==null?void 0:window.navigator.userAgent))}function JA(t){return nr()}function XA(t,e){JA()&&Hc(t,e)}function Qc(t){var e;const n=Xd(t);return(e=n==null?void 0:n.$el)!=null?e:n}const aw=Js?window:void 0;function lw(...t){let e,n,r,s;if(typeof t[0]=="string"||Array.isArray(t[0])?([n,r,s]=t,e=aw):[e,n,r,s]=t,!e)return QA;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const i=[],o=()=>{i.forEach(h=>h()),i.length=0},a=(h,d,p,g)=>(h.addEventListener(d,p,g),()=>h.removeEventListener(d,p,g)),c=It(()=>[Qc(e),Xd(s)],([h,d])=>{if(o(),!h)return;const p=KA(d)?{...d}:d;i.push(...n.flatMap(g=>r.map(v=>a(h,g,v,p))))},{immediate:!0,flush:"post"}),u=()=>{c(),o()};return ow(u),u}function ZA(t){return typeof t=="function"?t:typeof t=="string"?e=>e.key===t:Array.isArray(t)?e=>t.includes(e.key):()=>!0}function eS(...t){let e,n,r={};t.length===3?(e=t[0],n=t[1],r=t[2]):t.length===2?typeof t[1]=="object"?(e=!0,n=t[0],r=t[1]):(e=t[0],n=t[1]):(e=!0,n=t[0]);const{target:s=aw,eventName:i="keydown",passive:o=!1,dedupe:a=!1}=r,c=ZA(e);return lw(s,i,u=>{u.repeat&&Xd(a)||c(u)&&n(u)},o)}function tS(){const t=ae(!1),e=nr();return e&&un(()=>{t.value=!0},e),t}function nS(t){return JSON.parse(JSON.stringify(t))}function rS(t,e,n,r={}){var s,i,o;const{clone:a=!1,passive:c=!1,eventName:u,deep:h=!1,defaultValue:d,shouldEmit:p}=r,g=nr(),v=n||(g==null?void 0:g.emit)||((s=g==null?void 0:g.$emit)==null?void 0:s.bind(g))||((o=(i=g==null?void 0:g.proxy)==null?void 0:i.$emit)==null?void 0:o.bind(g==null?void 0:g.proxy));let S=u;S=S||`update:${e.toString()}`;const P=U=>a?typeof a=="function"?a(U):nS(U):U,M=()=>zA(t[e])?P(t[e]):d,F=U=>{p?p(U)&&v(S,U):v(S,U)};if(c){const U=M(),N=ae(U);let G=!1;return It(()=>t[e],B=>{G||(G=!0,N.value=P(B),tr(()=>G=!1))}),It(N,B=>{!G&&(B!==t[e]||h)&&F(B)},{deep:h}),N}else return we({get(){return M()},set(U){F(U)}})}function Zd(t){return t?t.flatMap(e=>e.type===ct?Zd(e.children):[e]):[]}function Ju(t){if(t===null||typeof t!="object")return!1;const e=Object.getPrototypeOf(t);return e!==null&&e!==Object.prototype&&Object.getPrototypeOf(e)!==null||Symbol.iterator in t?!1:Symbol.toStringTag in t?Object.prototype.toString.call(t)==="[object Module]":!0}function Uh(t,e,n=".",r){if(!Ju(e))return Uh(t,{},n);const s=Object.assign({},e);for(const i in t){if(i==="__proto__"||i==="constructor")continue;const o=t[i];o!=null&&(Array.isArray(o)&&Array.isArray(s[i])?s[i]=[...o,...s[i]]:Ju(o)&&Ju(s[i])?s[i]=Uh(o,s[i],(n?`${n}.`:"")+i.toString()):s[i]=o)}return s}function sS(t){return(...e)=>e.reduce((n,r)=>Uh(n,r,""),{})}const iS=sS(),[cw,jB]=Jd("ConfigProvider");let oS="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",aS=(t=21)=>{let e="",n=t;for(;n--;)e+=oS[Math.random()*64|0];return e};const lS=WA(()=>{const t=ae(new Map),e=ae(),n=we(()=>{for(const o of t.value.values())if(o)return!0;return!1}),r=cw({scrollBody:ae(!0)});let s=null;const i=()=>{document.body.style.paddingRight="",document.body.style.marginRight="",document.body.style.pointerEvents="",document.body.style.removeProperty("--scrollbar-width"),document.body.style.overflow=e.value??"",_g&&(s==null||s()),e.value=void 0};return It(n,(o,a)=>{var c;if(!Js)return;if(!o){a&&i();return}e.value===void 0&&(e.value=document.body.style.overflow);const u=window.innerWidth-document.documentElement.clientWidth,h={padding:u,margin:0},d=(c=r.scrollBody)!=null&&c.value?typeof r.scrollBody.value=="object"?iS({padding:r.scrollBody.value.padding===!0?u:r.scrollBody.value.padding,margin:r.scrollBody.value.margin===!0?u:r.scrollBody.value.margin},h):h:{padding:0,margin:0};u>0&&(document.body.style.paddingRight=`${d.padding}px`,document.body.style.marginRight=`${d.margin}px`,document.body.style.setProperty("--scrollbar-width",`${u}px`),document.body.style.overflow="hidden"),_g&&(s=lw(document,"touchmove",p=>{var g;p.target===document.documentElement&&(p.touches.length>1||(g=p.preventDefault)==null||g.call(p))},{passive:!1})),tr(()=>{document.body.style.pointerEvents="none",document.body.style.overflow="hidden"})},{immediate:!0,flush:"sync"}),t});function cS(t){const e=aS(6),n=lS();n.value.set(e,t);const r=we({get:()=>n.value.get(e)??!1,set:s=>n.value.set(e,s)});return XA(()=>{n.value.delete(e)}),r}function Yc(t){const e=nr(),n=e==null?void 0:e.type.emits,r={};return n!=null&&n.length||console.warn(`No emitted event found. Please check component: ${e==null?void 0:e.type.__name}`),n==null||n.forEach(s=>{r[Nl(Rn(s))]=(...i)=>t(s,...i)}),r}function ef(t){const e=nr(),n=Object.keys((e==null?void 0:e.type.props)??{}).reduce((s,i)=>{const o=(e==null?void 0:e.type.props[i]).default;return o!==void 0&&(s[i]=o),s},{}),r=JT(t);return we(()=>{const s={},i=(e==null?void 0:e.vnode.props)??{};return Object.keys(i).forEach(o=>{s[Rn(o)]=i[o]}),Object.keys({...n,...s}).reduce((o,a)=>(r.value[a]!==void 0&&(o[a]=r.value[a]),o),{})})}function uw(t,e){const n=ef(t),r=e?Yc(e):{};return we(()=>({...n.value,...r}))}function Xt(){const t=nr(),e=ae(),n=we(()=>{var o,a;return["#text","#comment"].includes((o=e.value)==null?void 0:o.$el.nodeName)?(a=e.value)==null?void 0:a.$el.nextElementSibling:Qc(e)}),r=Object.assign({},t.exposed),s={};for(const o in t.props)Object.defineProperty(s,o,{enumerable:!0,configurable:!0,get:()=>t.props[o]});if(Object.keys(r).length>0)for(const o in r)Object.defineProperty(s,o,{enumerable:!0,configurable:!0,get:()=>r[o]});Object.defineProperty(s,"$el",{enumerable:!0,configurable:!0,get:()=>t.vnode.el}),t.exposed=s;function i(o){e.value=o,!(o instanceof Element||!o)&&(Object.defineProperty(s,"$el",{enumerable:!0,configurable:!0,get:()=>o.$el}),t.exposed=s)}return{forwardRef:i,currentRef:e,currentElement:n}}var uS=function(t){if(typeof document>"u")return null;var e=Array.isArray(t)?t[0]:t;return e.ownerDocument.body},di=new WeakMap,El=new WeakMap,bl={},Xu=0,hw=function(t){return t&&(t.host||hw(t.parentNode))},hS=function(t,e){return e.map(function(n){if(t.contains(n))return n;var r=hw(n);return r&&t.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",t,". Doing nothing"),null)}).filter(function(n){return!!n})},dS=function(t,e,n,r){var s=hS(e,Array.isArray(t)?t:[t]);bl[n]||(bl[n]=new WeakMap);var i=bl[n],o=[],a=new Set,c=new Set(s),u=function(d){!d||a.has(d)||(a.add(d),u(d.parentNode))};s.forEach(u);var h=function(d){!d||c.has(d)||Array.prototype.forEach.call(d.children,function(p){if(a.has(p))h(p);else{var g=p.getAttribute(r),v=g!==null&&g!=="false",S=(di.get(p)||0)+1,P=(i.get(p)||0)+1;di.set(p,S),i.set(p,P),o.push(p),S===1&&v&&El.set(p,!0),P===1&&p.setAttribute(n,"true"),v||p.setAttribute(r,"true")}})};return h(e),a.clear(),Xu++,function(){o.forEach(function(d){var p=di.get(d)-1,g=i.get(d)-1;di.set(d,p),i.set(d,g),p||(El.has(d)||d.removeAttribute(r),El.delete(d)),g||d.removeAttribute(n)}),Xu--,Xu||(di=new WeakMap,di=new WeakMap,El=new WeakMap,bl={})}},fS=function(t,e,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(t)?t:[t]),s=uS(t);return s?(r.push.apply(r,Array.from(s.querySelectorAll("[aria-live]"))),dS(r,s,n,"aria-hidden")):function(){return null}};function pS(t){let e;It(()=>Qc(t),n=>{n?e=fS(n):e&&e()}),Ki(()=>{e&&e()})}let mS=0;function $h(t,e="radix"){const{useId:n}=cw({useId:void 0});return n&&typeof n=="function"?`${e}-${n()}`:`${e}-${++mS}`}function gS(t,e){const n=ae(t);function r(s){return e[n.value][s]??n.value}return{state:n,dispatch:s=>{n.value=r(s)}}}const _S=et({name:"PrimitiveSlot",inheritAttrs:!1,setup(t,{attrs:e,slots:n}){return()=>{var r,s;if(!n.default)return null;const i=Zd(n.default()),o=i.findIndex(h=>h.type!==on);if(o===-1)return i;const a=i[o];(r=a.props)==null||delete r.ref;const c=a.props?ft(e,a.props):e;e.class&&(s=a.props)!=null&&s.class&&delete a.props.class;const u=wr(a,c);for(const h in c)h.startsWith("on")&&(u.props||(u.props={}),u.props[h]=c[h]);return i.length===1?u:(i[o]=u,i)}}}),kn=et({name:"Primitive",inheritAttrs:!1,props:{asChild:{type:Boolean,default:!1},as:{type:[String,Object],default:"div"}},setup(t,{attrs:e,slots:n}){const r=t.asChild?"template":t.as;return typeof r=="string"&&["area","img","input"].includes(r)?()=>Ms(r,e):r!=="template"?()=>Ms(t.as,e,{default:n.default}):()=>Ms(_S,e,{default:n.default})}});function yS(t,e){const n=ae({}),r=ae("none"),s=t.value?"mounted":"unmounted",{state:i,dispatch:o}=gS(s,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}}),a=p=>{var g;if(Js){const v=new CustomEvent(p,{bubbles:!1,cancelable:!1});(g=e.value)==null||g.dispatchEvent(v)}};It(t,async(p,g)=>{var v;const S=g!==p;if(await tr(),S){const P=r.value,M=Il(e.value);p?(o("MOUNT"),a("enter"),M==="none"&&a("after-enter")):M==="none"||((v=n.value)==null?void 0:v.display)==="none"?(o("UNMOUNT"),a("leave"),a("after-leave")):g&&P!==M?(o("ANIMATION_OUT"),a("leave")):(o("UNMOUNT"),a("after-leave"))}},{immediate:!0});const c=p=>{const g=Il(e.value),v=g.includes(p.animationName),S=i.value==="mounted"?"enter":"leave";p.target===e.value&&v&&(a(`after-${S}`),o("ANIMATION_END")),p.target===e.value&&g==="none"&&o("ANIMATION_END")},u=p=>{p.target===e.value&&(r.value=Il(e.value))},h=It(e,(p,g)=>{p?(n.value=getComputedStyle(p),p.addEventListener("animationstart",u),p.addEventListener("animationcancel",c),p.addEventListener("animationend",c)):(o("ANIMATION_END"),g==null||g.removeEventListener("animationstart",u),g==null||g.removeEventListener("animationcancel",c),g==null||g.removeEventListener("animationend",c))},{immediate:!0}),d=It(i,()=>{const p=Il(e.value);r.value=i.value==="mounted"?p:"none"});return Ki(()=>{h(),d()}),{isPresent:we(()=>["mounted","unmountSuspended"].includes(i.value))}}function Il(t){return t&&getComputedStyle(t).animationName||"none"}const dw=et({name:"Presence",props:{present:{type:Boolean,required:!0},forceMount:{type:Boolean}},slots:{},setup(t,{slots:e,expose:n}){var r;const{present:s,forceMount:i}=Bd(t),o=ae(),{isPresent:a}=yS(s,o);n({present:a});let c=e.default({present:a});c=Zd(c||[]);const u=nr();if(c&&(c==null?void 0:c.length)>1){const h=(r=u==null?void 0:u.parent)!=null&&r.type.name?`<${u.parent.type.name} />`:"component";throw new Error([`Detected an invalid children for \`${h}\` for  \`Presence\` component.`,"","Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.","You can apply a few solutions:",["Provide a single child element so that `presence` directive attach correctly.","Ensure the first child is an actual element instead of a raw text node or comment node."].map(d=>`  - ${d}`).join(`
`)].join(`
`))}return()=>i.value||s.value||a.value?Ms(e.default({present:a})[0],{ref:h=>{const d=Qc(h);return typeof(d==null?void 0:d.hasAttribute)>"u"||(d!=null&&d.hasAttribute("data-radix-popper-content-wrapper")?o.value=d.firstElementChild:o.value=d),d}}):null}}),[rr,vS]=Jd("DialogRoot"),wS=et({__name:"DialogRoot",props:{open:{type:Boolean,default:void 0},defaultOpen:{type:Boolean,default:!1},modal:{type:Boolean,default:!0}},emits:["update:open"],setup(t,{emit:e}){const n=t,r=rS(n,"open",e,{defaultValue:n.defaultOpen,passive:n.open===void 0}),s=ae(),i=ae(),{modal:o}=Bd(n);return vS({open:r,modal:o,openModal:()=>{r.value=!0},onOpenChange:a=>{r.value=a},onOpenToggle:()=>{r.value=!r.value},contentId:"",titleId:"",descriptionId:"",triggerElement:s,contentElement:i}),(a,c)=>Re(a.$slots,"default",{open:j(r)})}}),ES=et({__name:"DialogTrigger",props:{asChild:{type:Boolean},as:{default:"button"}},setup(t){const e=t,n=rr(),{forwardRef:r,currentElement:s}=Xt();return n.contentId||(n.contentId=$h(void 0,"radix-vue-dialog-content")),un(()=>{n.triggerElement.value=s.value}),(i,o)=>(H(),Ae(j(kn),ft(e,{ref:j(r),type:i.as==="button"?"button":void 0,"aria-haspopup":"dialog","aria-expanded":j(n).open.value||!1,"aria-controls":j(n).open.value?j(n).contentId:void 0,"data-state":j(n).open.value?"open":"closed",onClick:j(n).onOpenToggle}),{default:te(()=>[Re(i.$slots,"default")]),_:3},16,["type","aria-expanded","aria-controls","data-state","onClick"]))}}),bS=et({__name:"Teleport",props:{to:{default:"body"},disabled:{type:Boolean},forceMount:{type:Boolean}},setup(t){const e=tS();return(n,r)=>j(e)||n.forceMount?(H(),Ae(YC,{key:0,to:n.to,disabled:n.disabled},[Re(n.$slots,"default")],8,["to","disabled"])):sn("",!0)}}),IS=et({__name:"DialogPortal",props:{to:{},disabled:{type:Boolean},forceMount:{type:Boolean}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(bS),Oi(Na(e)),{default:te(()=>[Re(n.$slots,"default")]),_:3},16))}}),TS="dismissableLayer.pointerDownOutside",CS="dismissableLayer.focusOutside";function fw(t,e){const n=e.closest("[data-dismissable-layer]"),r=t.dataset.dismissableLayer===""?t:t.querySelector("[data-dismissable-layer]"),s=Array.from(t.ownerDocument.querySelectorAll("[data-dismissable-layer]"));return!!(n&&r===n||s.indexOf(r)<s.indexOf(n))}function AS(t,e){var n;const r=((n=e==null?void 0:e.value)==null?void 0:n.ownerDocument)??(globalThis==null?void 0:globalThis.document),s=ae(!1),i=ae(()=>{});return _n(o=>{if(!Js)return;const a=async u=>{const h=u.target;if(e!=null&&e.value){if(fw(e.value,h)){s.value=!1;return}if(u.target&&!s.value){let d=function(){iw(TS,t,p)};const p={originalEvent:u};u.pointerType==="touch"?(r.removeEventListener("click",i.value),i.value=d,r.addEventListener("click",i.value,{once:!0})):d()}else r.removeEventListener("click",i.value);s.value=!1}},c=window.setTimeout(()=>{r.addEventListener("pointerdown",a)},0);o(()=>{window.clearTimeout(c),r.removeEventListener("pointerdown",a),r.removeEventListener("click",i.value)})}),{onPointerDownCapture:()=>s.value=!0}}function SS(t,e){var n;const r=((n=e==null?void 0:e.value)==null?void 0:n.ownerDocument)??(globalThis==null?void 0:globalThis.document),s=ae(!1);return _n(i=>{if(!Js)return;const o=async a=>{e!=null&&e.value&&(await tr(),!(!e.value||fw(e.value,a.target))&&a.target&&!s.value&&iw(CS,t,{originalEvent:a}))};r.addEventListener("focusin",o),i(()=>r.removeEventListener("focusin",o))}),{onFocusCapture:()=>s.value=!0,onBlurCapture:()=>s.value=!1}}const lr=Ys({layersRoot:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),RS=et({__name:"DismissableLayer",props:{disableOutsidePointerEvents:{type:Boolean,default:!1},asChild:{type:Boolean},as:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","dismiss"],setup(t,{emit:e}){const n=t,r=e,{forwardRef:s,currentElement:i}=Xt(),o=we(()=>{var v;return((v=i.value)==null?void 0:v.ownerDocument)??globalThis.document}),a=we(()=>lr.layersRoot),c=we(()=>i.value?Array.from(a.value).indexOf(i.value):-1),u=we(()=>lr.layersWithOutsidePointerEventsDisabled.size>0),h=we(()=>{const v=Array.from(a.value),[S]=[...lr.layersWithOutsidePointerEventsDisabled].slice(-1),P=v.indexOf(S);return c.value>=P}),d=AS(async v=>{const S=[...lr.branches].some(P=>P.contains(v.target));!h.value||S||(r("pointerDownOutside",v),r("interactOutside",v),await tr(),v.defaultPrevented||r("dismiss"))},i),p=SS(v=>{[...lr.branches].some(S=>S.contains(v.target))||(r("focusOutside",v),r("interactOutside",v),v.defaultPrevented||r("dismiss"))},i);eS("Escape",v=>{c.value===a.value.size-1&&(r("escapeKeyDown",v),v.defaultPrevented||r("dismiss"))});let g;return _n(v=>{i.value&&(n.disableOutsidePointerEvents&&(lr.layersWithOutsidePointerEventsDisabled.size===0&&(g=o.value.body.style.pointerEvents,o.value.body.style.pointerEvents="none"),lr.layersWithOutsidePointerEventsDisabled.add(i.value)),a.value.add(i.value),v(()=>{n.disableOutsidePointerEvents&&lr.layersWithOutsidePointerEventsDisabled.size===1&&(o.value.body.style.pointerEvents=g)}))}),_n(v=>{v(()=>{i.value&&(a.value.delete(i.value),lr.layersWithOutsidePointerEventsDisabled.delete(i.value))})}),(v,S)=>(H(),Ae(j(kn),{ref:j(s),"as-child":v.asChild,as:v.as,"data-dismissable-layer":"",style:vr({pointerEvents:u.value?h.value?"auto":"none":void 0}),onFocusCapture:j(p).onFocusCapture,onBlurCapture:j(p).onBlurCapture,onPointerdownCapture:j(d).onPointerDownCapture},{default:te(()=>[Re(v.$slots,"default")]),_:3},8,["as-child","as","style","onFocusCapture","onBlurCapture","onPointerdownCapture"]))}}),Zu="focusScope.autoFocusOnMount",eh="focusScope.autoFocusOnUnmount",yg={bubbles:!1,cancelable:!0};function PS(t,{select:e=!1}={}){const n=document.activeElement;for(const r of t)if(Ur(r,{select:e}),document.activeElement!==n)return!0}function xS(t){const e=pw(t),n=vg(e,t),r=vg(e.reverse(),t);return[n,r]}function pw(t){const e=[],n=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const s=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||s?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)e.push(n.currentNode);return e}function vg(t,e){for(const n of t)if(!kS(n,{upTo:e}))return n}function kS(t,{upTo:e}){if(getComputedStyle(t).visibility==="hidden")return!0;for(;t;){if(e!==void 0&&t===e)return!1;if(getComputedStyle(t).display==="none")return!0;t=t.parentElement}return!1}function NS(t){return t instanceof HTMLInputElement&&"select"in t}function Ur(t,{select:e=!1}={}){if(t&&t.focus){const n=document.activeElement;t.focus({preventScroll:!0}),t!==n&&NS(t)&&e&&t.select()}}const OS=HA(()=>ae([]));function DS(){const t=OS();return{add(e){const n=t.value[0];e!==n&&(n==null||n.pause()),t.value=wg(t.value,e),t.value.unshift(e)},remove(e){var n;t.value=wg(t.value,e),(n=t.value[0])==null||n.resume()}}}function wg(t,e){const n=[...t],r=n.indexOf(e);return r!==-1&&n.splice(r,1),n}function MS(t){return t.filter(e=>e.tagName!=="A")}const LS=et({__name:"FocusScope",props:{loop:{type:Boolean,default:!1},trapped:{type:Boolean,default:!1},asChild:{type:Boolean},as:{}},emits:["mountAutoFocus","unmountAutoFocus"],setup(t,{emit:e}){const n=t,r=e,{currentRef:s,currentElement:i}=Xt(),o=ae(null),a=DS(),c=Ys({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}});_n(h=>{if(!Js)return;const d=i.value;if(!n.trapped)return;function p(P){if(c.paused||!d)return;const M=P.target;d.contains(M)?o.value=M:Ur(o.value,{select:!0})}function g(P){if(c.paused||!d)return;const M=P.relatedTarget;M!==null&&(d.contains(M)||Ur(o.value,{select:!0}))}function v(P){d.contains(o.value)||Ur(d)}document.addEventListener("focusin",p),document.addEventListener("focusout",g);const S=new MutationObserver(v);d&&S.observe(d,{childList:!0,subtree:!0}),h(()=>{document.removeEventListener("focusin",p),document.removeEventListener("focusout",g),S.disconnect()})}),_n(async h=>{const d=i.value;if(await tr(),!d)return;a.add(c);const p=document.activeElement;if(!d.contains(p)){const g=new CustomEvent(Zu,yg);d.addEventListener(Zu,v=>r("mountAutoFocus",v)),d.dispatchEvent(g),g.defaultPrevented||(PS(MS(pw(d)),{select:!0}),document.activeElement===p&&Ur(d))}h(()=>{d.removeEventListener(Zu,S=>r("mountAutoFocus",S));const g=new CustomEvent(eh,yg),v=S=>{r("unmountAutoFocus",S)};d.addEventListener(eh,v),d.dispatchEvent(g),setTimeout(()=>{g.defaultPrevented||Ur(p??document.body,{select:!0}),d.removeEventListener(eh,v),a.remove(c)},0)})});function u(h){if(!n.loop&&!n.trapped||c.paused)return;const d=h.key==="Tab"&&!h.altKey&&!h.ctrlKey&&!h.metaKey,p=document.activeElement;if(d&&p){const g=h.currentTarget,[v,S]=xS(g);v&&S?!h.shiftKey&&p===S?(h.preventDefault(),n.loop&&Ur(v,{select:!0})):h.shiftKey&&p===v&&(h.preventDefault(),n.loop&&Ur(S,{select:!0})):p===g&&h.preventDefault()}}return(h,d)=>(H(),Ae(j(kn),{ref_key:"currentRef",ref:s,tabindex:"-1","as-child":h.asChild,as:h.as,onKeydown:u},{default:te(()=>[Re(h.$slots,"default")]),_:3},8,["as-child","as"]))}});function VS(t){return t?"open":"closed"}const mw=et({__name:"DialogContentImpl",props:{forceMount:{type:Boolean},trapFocus:{type:Boolean},disableOutsidePointerEvents:{type:Boolean},asChild:{type:Boolean},as:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","openAutoFocus","closeAutoFocus"],setup(t,{emit:e}){const n=t,r=e,s=rr(),{forwardRef:i,currentElement:o}=Xt();return s.titleId||(s.titleId=$h(void 0,"radix-vue-dialog-title")),s.descriptionId||(s.descriptionId=$h(void 0,"radix-vue-dialog-description")),un(()=>{s.contentElement=o,document.activeElement!==document.body&&(s.triggerElement.value=document.activeElement)}),(a,c)=>(H(),Ae(j(LS),{"as-child":"",loop:"",trapped:n.trapFocus,onMountAutoFocus:c[5]||(c[5]=u=>r("openAutoFocus",u)),onUnmountAutoFocus:c[6]||(c[6]=u=>r("closeAutoFocus",u))},{default:te(()=>[J(j(RS),ft({id:j(s).contentId,ref:j(i),as:a.as,"as-child":a.asChild,"disable-outside-pointer-events":a.disableOutsidePointerEvents,role:"dialog","aria-describedby":j(s).descriptionId,"aria-labelledby":j(s).titleId,"data-state":j(VS)(j(s).open.value)},a.$attrs,{onDismiss:c[0]||(c[0]=u=>j(s).onOpenChange(!1)),onEscapeKeyDown:c[1]||(c[1]=u=>r("escapeKeyDown",u)),onFocusOutside:c[2]||(c[2]=u=>r("focusOutside",u)),onInteractOutside:c[3]||(c[3]=u=>r("interactOutside",u)),onPointerDownOutside:c[4]||(c[4]=u=>r("pointerDownOutside",u))}),{default:te(()=>[Re(a.$slots,"default")]),_:3},16,["id","as","as-child","disable-outside-pointer-events","aria-describedby","aria-labelledby","data-state"])]),_:3},8,["trapped"]))}}),FS=et({__name:"DialogContentModal",props:{forceMount:{type:Boolean},trapFocus:{type:Boolean},disableOutsidePointerEvents:{type:Boolean},asChild:{type:Boolean},as:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","openAutoFocus","closeAutoFocus"],setup(t,{emit:e}){const n=t,r=e,s=rr(),i=Yc(r),{forwardRef:o,currentElement:a}=Xt();return pS(a),(c,u)=>(H(),Ae(mw,ft({...n,...j(i)},{ref:j(o),"trap-focus":j(s).open.value,"disable-outside-pointer-events":!0,onCloseAutoFocus:u[0]||(u[0]=h=>{var d;r("closeAutoFocus",h),h.defaultPrevented||(h.preventDefault(),(d=j(s).triggerElement.value)==null||d.focus())}),onPointerDownOutside:u[1]||(u[1]=h=>{const d=h.detail.originalEvent,p=d.button===0&&d.ctrlKey===!0;(d.button===2||p)&&h.preventDefault()}),onFocusOutside:u[2]||(u[2]=h=>{h.preventDefault()}),onOpenAutoFocus:u[3]||(u[3]=h=>r("openAutoFocus",h))}),{default:te(()=>[Re(c.$slots,"default")]),_:3},16,["trap-focus"]))}}),US=et({__name:"DialogContentNonModal",props:{forceMount:{type:Boolean},trapFocus:{type:Boolean},disableOutsidePointerEvents:{type:Boolean},asChild:{type:Boolean},as:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","openAutoFocus","closeAutoFocus"],setup(t,{emit:e}){const n=t,r=e,s=Yc(r);Xt();const i=rr(),o=ae(!1),a=ae(!1);return(c,u)=>(H(),Ae(mw,ft({...n,...j(s)},{"trap-focus":!1,"disable-outside-pointer-events":!1,onCloseAutoFocus:u[0]||(u[0]=h=>{var d;r("closeAutoFocus",h),h.defaultPrevented||(o.value||(d=j(i).triggerElement.value)==null||d.focus(),h.preventDefault()),o.value=!1,a.value=!1}),onInteractOutside:u[1]||(u[1]=h=>{var d;h.defaultPrevented||(o.value=!0,h.detail.originalEvent.type==="pointerdown"&&(a.value=!0));const p=h.target;(d=j(i).triggerElement.value)!=null&&d.contains(p)&&h.preventDefault(),h.detail.originalEvent.type==="focusin"&&a.value&&h.preventDefault()})}),{default:te(()=>[Re(c.$slots,"default")]),_:3},16))}}),$S=et({__name:"DialogContent",props:{forceMount:{type:Boolean},trapFocus:{type:Boolean},disableOutsidePointerEvents:{type:Boolean},asChild:{type:Boolean},as:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","openAutoFocus","closeAutoFocus"],setup(t,{emit:e}){const n=t,r=e,s=rr(),i=Yc(r),{forwardRef:o}=Xt();return(a,c)=>(H(),Ae(j(dw),{present:a.forceMount||j(s).open.value},{default:te(()=>[j(s).modal.value?(H(),Ae(FS,ft({key:0,ref:j(o)},{...n,...j(i),...a.$attrs},{onOpenAutoFocus:c[0]||(c[0]=u=>r("openAutoFocus",u))}),{default:te(()=>[Re(a.$slots,"default")]),_:3},16)):(H(),Ae(US,ft({key:1,ref:j(o)},{...n,...j(i),...a.$attrs}),{default:te(()=>[Re(a.$slots,"default")]),_:3},16))]),_:3},8,["present"]))}}),BS=et({__name:"DialogOverlayImpl",props:{asChild:{type:Boolean},as:{}},setup(t){const e=rr();return cS(!0),Xt(),(n,r)=>(H(),Ae(j(kn),{as:n.as,"as-child":n.asChild,"data-state":j(e).open.value?"open":"closed",style:{"pointer-events":"auto"}},{default:te(()=>[Re(n.$slots,"default")]),_:3},8,["as","as-child","data-state"]))}}),jS=et({__name:"DialogOverlay",props:{forceMount:{type:Boolean},asChild:{type:Boolean},as:{}},setup(t){const e=rr(),{forwardRef:n}=Xt();return(r,s)=>{var i;return(i=j(e))!=null&&i.modal.value?(H(),Ae(j(dw),{key:0,present:r.forceMount||j(e).open.value},{default:te(()=>[J(BS,ft(r.$attrs,{ref:j(n),as:r.as,"as-child":r.asChild}),{default:te(()=>[Re(r.$slots,"default")]),_:3},16,["as","as-child"])]),_:3},8,["present"])):sn("",!0)}}}),qS=et({__name:"DialogClose",props:{asChild:{type:Boolean},as:{default:"button"}},setup(t){const e=t;Xt();const n=rr();return(r,s)=>(H(),Ae(j(kn),ft(e,{type:r.as==="button"?"button":void 0,onClick:s[0]||(s[0]=i=>j(n).onOpenChange(!1))}),{default:te(()=>[Re(r.$slots,"default")]),_:3},16,["type"]))}}),HS=et({__name:"DialogTitle",props:{asChild:{type:Boolean},as:{default:"h2"}},setup(t){const e=t,n=rr();return Xt(),(r,s)=>(H(),Ae(j(kn),ft(e,{id:j(n).titleId}),{default:te(()=>[Re(r.$slots,"default")]),_:3},16,["id"]))}}),WS=et({__name:"DialogDescription",props:{asChild:{type:Boolean},as:{default:"p"}},setup(t){const e=t;Xt();const n=rr();return(r,s)=>(H(),Ae(j(kn),ft(e,{id:j(n).descriptionId}),{default:te(()=>[Re(r.$slots,"default")]),_:3},16,["id"]))}}),[gw,zS]=Jd("AvatarRoot"),GS=et({__name:"AvatarRoot",props:{asChild:{type:Boolean},as:{default:"span"}},setup(t){return Xt(),zS({imageLoadingStatus:ae("loading")}),(e,n)=>(H(),Ae(j(kn),{"as-child":e.asChild,as:e.as},{default:te(()=>[Re(e.$slots,"default")]),_:3},8,["as-child","as"]))}});function KS(t){const e=ae("idle"),n=ae(!1),r=s=>()=>{n.value&&(e.value=s)};return un(()=>{n.value=!0,It(t,s=>{if(!s)e.value="error";else{const i=new window.Image;e.value="loading",i.onload=r("loaded"),i.onerror=r("error"),i.src=s}},{immediate:!0})}),Ki(()=>{n.value=!1}),e}const QS=et({__name:"AvatarImage",props:{src:{},asChild:{type:Boolean},as:{default:"img"}},emits:["loadingStatusChange"],setup(t,{emit:e}){const n=t,r=e,{src:s}=Bd(n);Xt();const i=gw(),o=KS(s);return It(o,a=>{r("loadingStatusChange",a),a!=="idle"&&(i.imageLoadingStatus.value=a)},{immediate:!0}),(a,c)=>zd((H(),Ae(j(kn),{role:"img","as-child":a.asChild,as:a.as,src:j(s)},{default:te(()=>[Re(a.$slots,"default")]),_:3},8,["as-child","as","src"])),[[yA,j(o)==="loaded"]])}}),YS=et({__name:"AvatarFallback",props:{delayMs:{default:0},asChild:{type:Boolean},as:{default:"span"}},setup(t){const e=t,n=gw();Xt();const r=ae(!1);let s;return It(n.imageLoadingStatus,i=>{i==="loading"&&(r.value=!1,e.delayMs?s=setTimeout(()=>{r.value=!0,clearTimeout(s)},e.delayMs):r.value=!0)},{immediate:!0}),(i,o)=>r.value&&j(n).imageLoadingStatus.value!=="loaded"?(H(),Ae(j(kn),{key:0,"as-child":i.asChild,as:i.as},{default:te(()=>[Re(i.$slots,"default")]),_:3},8,["as-child","as"])):sn("",!0)}}),JS=et({__name:"Label",props:{for:{},asChild:{type:Boolean},as:{default:"label"}},setup(t){const e=t;return Xt(),(n,r)=>(H(),Ae(j(kn),ft(e,{onMousedown:r[0]||(r[0]=s=>{!s.defaultPrevented&&s.detail>1&&s.preventDefault()})}),{default:te(()=>[Re(n.$slots,"default")]),_:3},16))}});function XS(){if(typeof matchMedia=="function")return matchMedia("(pointer:coarse)").matches?"coarse":"fine"}XS();function _w(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(e=0;e<s;e++)t[e]&&(n=_w(t[e]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function ZS(){for(var t,e,n=0,r="",s=arguments.length;n<s;n++)(t=arguments[n])&&(e=_w(t))&&(r&&(r+=" "),r+=e);return r}const tf="-";function eR(t){const e=nR(t),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=t;function s(o){const a=o.split(tf);return a[0]===""&&a.length!==1&&a.shift(),yw(a,e)||tR(o)}function i(o,a){const c=n[o]||[];return a&&r[o]?[...c,...r[o]]:c}return{getClassGroupId:s,getConflictingClassGroupIds:i}}function yw(t,e){var o;if(t.length===0)return e.classGroupId;const n=t[0],r=e.nextPart.get(n),s=r?yw(t.slice(1),r):void 0;if(s)return s;if(e.validators.length===0)return;const i=t.join(tf);return(o=e.validators.find(({validator:a})=>a(i)))==null?void 0:o.classGroupId}const Eg=/^\[(.+)\]$/;function tR(t){if(Eg.test(t)){const e=Eg.exec(t)[1],n=e==null?void 0:e.substring(0,e.indexOf(":"));if(n)return"arbitrary.."+n}}function nR(t){const{theme:e,prefix:n}=t,r={nextPart:new Map,validators:[]};return sR(Object.entries(t.classGroups),n).forEach(([i,o])=>{Bh(o,r,i,e)}),r}function Bh(t,e,n,r){t.forEach(s=>{if(typeof s=="string"){const i=s===""?e:bg(e,s);i.classGroupId=n;return}if(typeof s=="function"){if(rR(s)){Bh(s(r),e,n,r);return}e.validators.push({validator:s,classGroupId:n});return}Object.entries(s).forEach(([i,o])=>{Bh(o,bg(e,i),n,r)})})}function bg(t,e){let n=t;return e.split(tf).forEach(r=>{n.nextPart.has(r)||n.nextPart.set(r,{nextPart:new Map,validators:[]}),n=n.nextPart.get(r)}),n}function rR(t){return t.isThemeGetter}function sR(t,e){return e?t.map(([n,r])=>{const s=r.map(i=>typeof i=="string"?e+i:typeof i=="object"?Object.fromEntries(Object.entries(i).map(([o,a])=>[e+o,a])):i);return[n,s]}):t}function iR(t){if(t<1)return{get:()=>{},set:()=>{}};let e=0,n=new Map,r=new Map;function s(i,o){n.set(i,o),e++,e>t&&(e=0,r=n,n=new Map)}return{get(i){let o=n.get(i);if(o!==void 0)return o;if((o=r.get(i))!==void 0)return s(i,o),o},set(i,o){n.has(i)?n.set(i,o):s(i,o)}}}const vw="!";function oR(t){const e=t.separator,n=e.length===1,r=e[0],s=e.length;return function(o){const a=[];let c=0,u=0,h;for(let S=0;S<o.length;S++){let P=o[S];if(c===0){if(P===r&&(n||o.slice(S,S+s)===e)){a.push(o.slice(u,S)),u=S+s;continue}if(P==="/"){h=S;continue}}P==="["?c++:P==="]"&&c--}const d=a.length===0?o:o.substring(u),p=d.startsWith(vw),g=p?d.substring(1):d,v=h&&h>u?h-u:void 0;return{modifiers:a,hasImportantModifier:p,baseClassName:g,maybePostfixModifierPosition:v}}}function aR(t){if(t.length<=1)return t;const e=[];let n=[];return t.forEach(r=>{r[0]==="["?(e.push(...n.sort(),r),n=[]):n.push(r)}),e.push(...n.sort()),e}function lR(t){return{cache:iR(t.cacheSize),splitModifiers:oR(t),...eR(t)}}const cR=/\s+/;function uR(t,e){const{splitModifiers:n,getClassGroupId:r,getConflictingClassGroupIds:s}=e,i=new Set;return t.trim().split(cR).map(o=>{const{modifiers:a,hasImportantModifier:c,baseClassName:u,maybePostfixModifierPosition:h}=n(o);let d=r(h?u.substring(0,h):u),p=!!h;if(!d){if(!h)return{isTailwindClass:!1,originalClassName:o};if(d=r(u),!d)return{isTailwindClass:!1,originalClassName:o};p=!1}const g=aR(a).join(":");return{isTailwindClass:!0,modifierId:c?g+vw:g,classGroupId:d,originalClassName:o,hasPostfixModifier:p}}).reverse().filter(o=>{if(!o.isTailwindClass)return!0;const{modifierId:a,classGroupId:c,hasPostfixModifier:u}=o,h=a+c;return i.has(h)?!1:(i.add(h),s(c,u).forEach(d=>i.add(a+d)),!0)}).reverse().map(o=>o.originalClassName).join(" ")}function hR(){let t=0,e,n,r="";for(;t<arguments.length;)(e=arguments[t++])&&(n=ww(e))&&(r&&(r+=" "),r+=n);return r}function ww(t){if(typeof t=="string")return t;let e,n="";for(let r=0;r<t.length;r++)t[r]&&(e=ww(t[r]))&&(n&&(n+=" "),n+=e);return n}function dR(t,...e){let n,r,s,i=o;function o(c){const u=e.reduce((h,d)=>d(h),t());return n=lR(u),r=n.cache.get,s=n.cache.set,i=a,a(c)}function a(c){const u=r(c);if(u)return u;const h=uR(c,n);return s(c,h),h}return function(){return i(hR.apply(null,arguments))}}function ot(t){const e=n=>n[t]||[];return e.isThemeGetter=!0,e}const Ew=/^\[(?:([a-z-]+):)?(.+)\]$/i,fR=/^\d+\/\d+$/,pR=new Set(["px","full","screen"]),mR=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,gR=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,_R=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,yR=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,vR=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;function cr(t){return Rs(t)||pR.has(t)||fR.test(t)}function Mr(t){return Qi(t,"length",SR)}function Rs(t){return!!t&&!Number.isNaN(Number(t))}function Tl(t){return Qi(t,"number",Rs)}function Eo(t){return!!t&&Number.isInteger(Number(t))}function wR(t){return t.endsWith("%")&&Rs(t.slice(0,-1))}function Se(t){return Ew.test(t)}function Lr(t){return mR.test(t)}const ER=new Set(["length","size","percentage"]);function bR(t){return Qi(t,ER,bw)}function IR(t){return Qi(t,"position",bw)}const TR=new Set(["image","url"]);function CR(t){return Qi(t,TR,PR)}function AR(t){return Qi(t,"",RR)}function bo(){return!0}function Qi(t,e,n){const r=Ew.exec(t);return r?r[1]?typeof e=="string"?r[1]===e:e.has(r[1]):n(r[2]):!1}function SR(t){return gR.test(t)&&!_R.test(t)}function bw(){return!1}function RR(t){return yR.test(t)}function PR(t){return vR.test(t)}function xR(){const t=ot("colors"),e=ot("spacing"),n=ot("blur"),r=ot("brightness"),s=ot("borderColor"),i=ot("borderRadius"),o=ot("borderSpacing"),a=ot("borderWidth"),c=ot("contrast"),u=ot("grayscale"),h=ot("hueRotate"),d=ot("invert"),p=ot("gap"),g=ot("gradientColorStops"),v=ot("gradientColorStopPositions"),S=ot("inset"),P=ot("margin"),M=ot("opacity"),F=ot("padding"),U=ot("saturate"),N=ot("scale"),G=ot("sepia"),B=ot("skew"),A=ot("space"),y=ot("translate"),w=()=>["auto","contain","none"],T=()=>["auto","hidden","clip","visible","scroll"],R=()=>["auto",Se,e],I=()=>[Se,e],b=()=>["",cr,Mr],Ve=()=>["auto",Rs,Se],ht=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],$e=()=>["solid","dashed","dotted","double","none"],Ce=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],ve=()=>["start","end","center","between","around","evenly","stretch"],Ge=()=>["","0",Se],xt=()=>["auto","avoid","all","avoid-page","page","left","right","column"],wt=()=>[Rs,Tl],Ke=()=>[Rs,Se];return{cacheSize:500,separator:":",theme:{colors:[bo],spacing:[cr,Mr],blur:["none","",Lr,Se],brightness:wt(),borderColor:[t],borderRadius:["none","","full",Lr,Se],borderSpacing:I(),borderWidth:b(),contrast:wt(),grayscale:Ge(),hueRotate:Ke(),invert:Ge(),gap:I(),gradientColorStops:[t],gradientColorStopPositions:[wR,Mr],inset:R(),margin:R(),opacity:wt(),padding:I(),saturate:wt(),scale:wt(),sepia:Ge(),skew:Ke(),space:I(),translate:I()},classGroups:{aspect:[{aspect:["auto","square","video",Se]}],container:["container"],columns:[{columns:[Lr]}],"break-after":[{"break-after":xt()}],"break-before":[{"break-before":xt()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...ht(),Se]}],overflow:[{overflow:T()}],"overflow-x":[{"overflow-x":T()}],"overflow-y":[{"overflow-y":T()}],overscroll:[{overscroll:w()}],"overscroll-x":[{"overscroll-x":w()}],"overscroll-y":[{"overscroll-y":w()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[S]}],"inset-x":[{"inset-x":[S]}],"inset-y":[{"inset-y":[S]}],start:[{start:[S]}],end:[{end:[S]}],top:[{top:[S]}],right:[{right:[S]}],bottom:[{bottom:[S]}],left:[{left:[S]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",Eo,Se]}],basis:[{basis:R()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",Se]}],grow:[{grow:Ge()}],shrink:[{shrink:Ge()}],order:[{order:["first","last","none",Eo,Se]}],"grid-cols":[{"grid-cols":[bo]}],"col-start-end":[{col:["auto",{span:["full",Eo,Se]},Se]}],"col-start":[{"col-start":Ve()}],"col-end":[{"col-end":Ve()}],"grid-rows":[{"grid-rows":[bo]}],"row-start-end":[{row:["auto",{span:[Eo,Se]},Se]}],"row-start":[{"row-start":Ve()}],"row-end":[{"row-end":Ve()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",Se]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",Se]}],gap:[{gap:[p]}],"gap-x":[{"gap-x":[p]}],"gap-y":[{"gap-y":[p]}],"justify-content":[{justify:["normal",...ve()]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal",...ve(),"baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":[...ve(),"baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[F]}],px:[{px:[F]}],py:[{py:[F]}],ps:[{ps:[F]}],pe:[{pe:[F]}],pt:[{pt:[F]}],pr:[{pr:[F]}],pb:[{pb:[F]}],pl:[{pl:[F]}],m:[{m:[P]}],mx:[{mx:[P]}],my:[{my:[P]}],ms:[{ms:[P]}],me:[{me:[P]}],mt:[{mt:[P]}],mr:[{mr:[P]}],mb:[{mb:[P]}],ml:[{ml:[P]}],"space-x":[{"space-x":[A]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[A]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",Se,e]}],"min-w":[{"min-w":[Se,e,"min","max","fit"]}],"max-w":[{"max-w":[Se,e,"none","full","min","max","fit","prose",{screen:[Lr]},Lr]}],h:[{h:[Se,e,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[Se,e,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[Se,e,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[Se,e,"auto","min","max","fit"]}],"font-size":[{text:["base",Lr,Mr]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",Tl]}],"font-family":[{font:[bo]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractons"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",Se]}],"line-clamp":[{"line-clamp":["none",Rs,Tl]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",cr,Se]}],"list-image":[{"list-image":["none",Se]}],"list-style-type":[{list:["none","disc","decimal",Se]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[t]}],"placeholder-opacity":[{"placeholder-opacity":[M]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[t]}],"text-opacity":[{"text-opacity":[M]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...$e(),"wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",cr,Mr]}],"underline-offset":[{"underline-offset":["auto",cr,Se]}],"text-decoration-color":[{decoration:[t]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:I()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",Se]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",Se]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[M]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...ht(),IR]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",bR]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},CR]}],"bg-color":[{bg:[t]}],"gradient-from-pos":[{from:[v]}],"gradient-via-pos":[{via:[v]}],"gradient-to-pos":[{to:[v]}],"gradient-from":[{from:[g]}],"gradient-via":[{via:[g]}],"gradient-to":[{to:[g]}],rounded:[{rounded:[i]}],"rounded-s":[{"rounded-s":[i]}],"rounded-e":[{"rounded-e":[i]}],"rounded-t":[{"rounded-t":[i]}],"rounded-r":[{"rounded-r":[i]}],"rounded-b":[{"rounded-b":[i]}],"rounded-l":[{"rounded-l":[i]}],"rounded-ss":[{"rounded-ss":[i]}],"rounded-se":[{"rounded-se":[i]}],"rounded-ee":[{"rounded-ee":[i]}],"rounded-es":[{"rounded-es":[i]}],"rounded-tl":[{"rounded-tl":[i]}],"rounded-tr":[{"rounded-tr":[i]}],"rounded-br":[{"rounded-br":[i]}],"rounded-bl":[{"rounded-bl":[i]}],"border-w":[{border:[a]}],"border-w-x":[{"border-x":[a]}],"border-w-y":[{"border-y":[a]}],"border-w-s":[{"border-s":[a]}],"border-w-e":[{"border-e":[a]}],"border-w-t":[{"border-t":[a]}],"border-w-r":[{"border-r":[a]}],"border-w-b":[{"border-b":[a]}],"border-w-l":[{"border-l":[a]}],"border-opacity":[{"border-opacity":[M]}],"border-style":[{border:[...$e(),"hidden"]}],"divide-x":[{"divide-x":[a]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[a]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[M]}],"divide-style":[{divide:$e()}],"border-color":[{border:[s]}],"border-color-x":[{"border-x":[s]}],"border-color-y":[{"border-y":[s]}],"border-color-t":[{"border-t":[s]}],"border-color-r":[{"border-r":[s]}],"border-color-b":[{"border-b":[s]}],"border-color-l":[{"border-l":[s]}],"divide-color":[{divide:[s]}],"outline-style":[{outline:["",...$e()]}],"outline-offset":[{"outline-offset":[cr,Se]}],"outline-w":[{outline:[cr,Mr]}],"outline-color":[{outline:[t]}],"ring-w":[{ring:b()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[t]}],"ring-opacity":[{"ring-opacity":[M]}],"ring-offset-w":[{"ring-offset":[cr,Mr]}],"ring-offset-color":[{"ring-offset":[t]}],shadow:[{shadow:["","inner","none",Lr,AR]}],"shadow-color":[{shadow:[bo]}],opacity:[{opacity:[M]}],"mix-blend":[{"mix-blend":[...Ce(),"plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":Ce()}],filter:[{filter:["","none"]}],blur:[{blur:[n]}],brightness:[{brightness:[r]}],contrast:[{contrast:[c]}],"drop-shadow":[{"drop-shadow":["","none",Lr,Se]}],grayscale:[{grayscale:[u]}],"hue-rotate":[{"hue-rotate":[h]}],invert:[{invert:[d]}],saturate:[{saturate:[U]}],sepia:[{sepia:[G]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[n]}],"backdrop-brightness":[{"backdrop-brightness":[r]}],"backdrop-contrast":[{"backdrop-contrast":[c]}],"backdrop-grayscale":[{"backdrop-grayscale":[u]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[h]}],"backdrop-invert":[{"backdrop-invert":[d]}],"backdrop-opacity":[{"backdrop-opacity":[M]}],"backdrop-saturate":[{"backdrop-saturate":[U]}],"backdrop-sepia":[{"backdrop-sepia":[G]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[o]}],"border-spacing-x":[{"border-spacing-x":[o]}],"border-spacing-y":[{"border-spacing-y":[o]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",Se]}],duration:[{duration:Ke()}],ease:[{ease:["linear","in","out","in-out",Se]}],delay:[{delay:Ke()}],animate:[{animate:["none","spin","ping","pulse","bounce",Se]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[N]}],"scale-x":[{"scale-x":[N]}],"scale-y":[{"scale-y":[N]}],rotate:[{rotate:[Eo,Se]}],"translate-x":[{"translate-x":[y]}],"translate-y":[{"translate-y":[y]}],"skew-x":[{"skew-x":[B]}],"skew-y":[{"skew-y":[B]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",Se]}],accent:[{accent:["auto",t]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",Se]}],"caret-color":[{caret:[t]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":I()}],"scroll-mx":[{"scroll-mx":I()}],"scroll-my":[{"scroll-my":I()}],"scroll-ms":[{"scroll-ms":I()}],"scroll-me":[{"scroll-me":I()}],"scroll-mt":[{"scroll-mt":I()}],"scroll-mr":[{"scroll-mr":I()}],"scroll-mb":[{"scroll-mb":I()}],"scroll-ml":[{"scroll-ml":I()}],"scroll-p":[{"scroll-p":I()}],"scroll-px":[{"scroll-px":I()}],"scroll-py":[{"scroll-py":I()}],"scroll-ps":[{"scroll-ps":I()}],"scroll-pe":[{"scroll-pe":I()}],"scroll-pt":[{"scroll-pt":I()}],"scroll-pr":[{"scroll-pr":I()}],"scroll-pb":[{"scroll-pb":I()}],"scroll-pl":[{"scroll-pl":I()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",Se]}],fill:[{fill:[t,"none"]}],"stroke-w":[{stroke:[cr,Mr,Tl]}],stroke:[{stroke:[t,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}}const kR=dR(xR);function sr(...t){return kR(ZS(t))}const Jc={__name:"Button",props:{variant:{type:null,required:!1},size:{type:null,required:!1},class:{type:null,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(kn),{as:t.as,"as-child":t.asChild,class:Ct(j(sr)(j(NR)({variant:t.variant,size:t.size}),e.class))},{default:te(()=>[Re(n.$slots,"default")]),_:3},8,["as","as-child","class"]))}},NR=sw("inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary-foreground underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",xs:"h-7 rounded px-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),OR={__name:"Avatar",props:{class:{type:null,required:!1},size:{type:null,required:!1,default:"sm"},shape:{type:null,required:!1,default:"circle"}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(GS),{class:Ct(j(sr)(j(LR)({size:t.size,shape:t.shape}),e.class))},{default:te(()=>[Re(n.$slots,"default")]),_:3},8,["class"]))}},DR={__name:"AvatarImage",props:{src:{type:String,required:!0},asChild:{type:Boolean,required:!1},as:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(QS),ft(e,{class:"h-full w-full object-cover"}),null,16))}},MR={__name:"AvatarFallback",props:{delayMs:{type:Number,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(YS),Oi(Na(e)),{default:te(()=>[Re(n.$slots,"default")]),_:3},16))}},LR=sw("inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden",{variants:{size:{sm:"h-10 w-10 text-xs",base:"h-16 w-16 text-2xl",lg:"h-32 w-32 text-5xl"},shape:{circle:"rounded-full",square:"rounded-md"}}});function VR(t,e){return H(),he("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[L("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"}),L("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"})])}function FR(t,e){return H(),he("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[L("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"})])}function UR(t,e){return H(),he("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[L("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"})])}var $R=Object.defineProperty,BR=(t,e,n)=>e in t?$R(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,tn=(t,e,n)=>(BR(t,typeof e!="symbol"?e+"":e,n),n);function jR(t){if(typeof document>"u")return;let e=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",e.appendChild(n),n.styleSheet?n.styleSheet.cssText=t:n.appendChild(document.createTextNode(t))}jR("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999}[data-sonner-toaster][data-x-position=right]{right:max(var(--offset),env(safe-area-inset-right))}[data-sonner-toaster][data-x-position=left]{left:max(var(--offset),env(safe-area-inset-left))}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:max(var(--offset),env(safe-area-inset-top))}[data-sonner-toaster][data-y-position=bottom]{bottom:max(var(--offset),env(safe-area-inset-bottom))}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;will-change:transform,opacity,height;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast] [data-description]{font-weight:400;line-height:1.4;color:inherit}[data-sonner-toast] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast] [data-icon]>*{flex-shrink:0}[data-sonner-toast] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast] [data-content]{display:flex;flex-direction:column;gap:2px;transform:translateZ(0)}[data-sonner-toast] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toast][data-theme=dark] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;background:var(--gray1);color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]:before{content:'';position:absolute;left:0;right:0;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]:before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]:before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]:before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast]:after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]:before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount,0));transition:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation:swipe-out .2s ease-out forwards}@keyframes swipe-out{from{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));opacity:1}to{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;--mobile-offset:16px;right:var(--mobile-offset);left:var(--mobile-offset);width:100%}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - 32px)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset)}[data-sonner-toaster][data-y-position=bottom]{bottom:20px}[data-sonner-toaster][data-y-position=top]{top:20px}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset);right:var(--mobile-offset);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 91%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 91%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 91%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 100%, 12%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 12%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-rich-colors=true] [data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true] [data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true] [data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true] [data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true] [data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true] [data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true] [data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true] [data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");let jh=0;class qR{constructor(){tn(this,"subscribers"),tn(this,"toasts"),tn(this,"subscribe",e=>(this.subscribers.push(e),()=>{const n=this.subscribers.indexOf(e);this.subscribers.splice(n,1)})),tn(this,"publish",e=>{this.subscribers.forEach(n=>n(e))}),tn(this,"addToast",e=>{this.publish(e),this.toasts=[...this.toasts,e]}),tn(this,"create",e=>{var n;const{message:r,...s}=e,i=typeof e.id=="number"||e.id&&((n=e.id)==null?void 0:n.length)>0?e.id:jh++,o=this.toasts.find(c=>c.id===i),a=e.dismissible===void 0?!0:e.dismissible;return o?this.toasts=this.toasts.map(c=>c.id===i?(this.publish({...c,...e,id:i,title:r}),{...c,...e,id:i,dismissible:a,title:r}):c):this.addToast({title:r,...s,dismissible:a,id:i}),i}),tn(this,"dismiss",e=>(e||this.toasts.forEach(n=>{this.subscribers.forEach(r=>r({id:n.id,dismiss:!0}))}),this.subscribers.forEach(n=>n({id:e,dismiss:!0})),e)),tn(this,"message",(e,n)=>this.create({...n,message:e,type:"default"})),tn(this,"error",(e,n)=>this.create({...n,type:"error",message:e})),tn(this,"success",(e,n)=>this.create({...n,type:"success",message:e})),tn(this,"info",(e,n)=>this.create({...n,type:"info",message:e})),tn(this,"warning",(e,n)=>this.create({...n,type:"warning",message:e})),tn(this,"loading",(e,n)=>this.create({...n,type:"loading",message:e})),tn(this,"promise",(e,n)=>{if(!n)return;let r;n.loading!==void 0&&(r=this.create({...n,promise:e,type:"loading",message:n.loading,description:typeof n.description!="function"?n.description:void 0}));const s=e instanceof Promise?e:e();let i=r!==void 0;return s.then(o=>{if(o&&typeof o.ok=="boolean"&&!o.ok){i=!1;const a=typeof n.error=="function"?n.error(`HTTP error! status: ${response.status}`):n.error,c=typeof n.description=="function"?n.description(`HTTP error! status: ${response.status}`):n.description;this.create({id:r,type:"error",message:a,description:c})}else if(n.success!==void 0){i=!1;const a=typeof n.success=="function"?n.success(o):n.success,c=typeof n.description=="function"?n.description(o):n.description;this.create({id:r,type:"success",message:a,description:c})}}).catch(o=>{if(n.error!==void 0){i=!1;const a=typeof n.error=="function"?n.error(o):n.error,c=typeof n.description=="function"?n.description(o):n.description;this.create({id:r,type:"error",message:a,description:c})}}).finally(()=>{var o;i&&(this.dismiss(r),r=void 0),(o=n.finally)==null||o.call(n)}),r}),tn(this,"custom",(e,n)=>{const r=(n==null?void 0:n.id)||jh++;return this.publish({component:e,id:r,...n}),r}),this.subscribers=[],this.toasts=[]}}const Dn=new qR,HR=(t,e)=>{const n=(e==null?void 0:e.id)||jh++;return Dn.create({message:t,id:n,type:"default",...e}),n},WR=HR,gn=Object.assign(WR,{success:Dn.success,info:Dn.info,warning:Dn.warning,error:Dn.error,custom:Dn.custom,message:Dn.message,promise:Dn.promise,dismiss:Dn.dismiss,loading:Dn.loading}),Da=(t,e)=>{const n=t.__vccOpts||t;for(const[r,s]of e)n[r]=s;return n},zR={},GR={xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stoke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},KR=L("line",{x1:"18",y1:"6",x2:"6",y2:"18"},null,-1),QR=L("line",{x1:"6",y1:"6",x2:"18",y2:"18"},null,-1),YR=[KR,QR];function JR(t,e){return H(),he("svg",GR,YR)}const XR=Da(zR,[["render",JR]]),ZR=()=>{const t=ae(!1);return _n(()=>{const e=()=>{t.value=document.hidden};return document.addEventListener("visibilitychange",e),()=>window.removeEventListener("visibilitychange",e)}),{isDocumentHidden:t}},e1=["aria-live","data-styled","data-mounted","data-promise","data-removed","data-visible","data-y-position","data-x-position","data-index","data-front","data-swiping","data-dismissible","data-type","data-invert","data-swipe-out","data-expanded"],t1=["aria-label","data-disabled"],n1={key:0,"data-icon":""},r1={"data-content":""},s1=4e3,i1=14,o1=20,a1=200,l1=et({__name:"Toast",props:{toast:{},toasts:{},index:{},expanded:{type:Boolean},invert:{type:Boolean},heights:{},gap:{},position:{},visibleToasts:{},expandByDefault:{type:Boolean},closeButton:{type:Boolean},interacting:{type:Boolean},duration:{},descriptionClass:{},style:{},cancelButtonStyle:{},actionButtonStyle:{},unstyled:{type:Boolean},loadingIcon:{},class:{},classes:{},icons:{},closeButtonAriaLabel:{},pauseWhenPageIsHidden:{type:Boolean},cn:{type:Function}},emits:["update:heights","removeToast"],setup(t,{emit:e}){const n=e,r=t,s=ae(!1),i=ae(!1),o=ae(!1),a=ae(!1),c=ae(0),u=ae(0),h=ae(null),d=ae(null),p=we(()=>r.index===0),g=we(()=>r.index+1<=r.visibleToasts),v=we(()=>r.toast.type),S=we(()=>r.toast.dismissible!==!1),P=we(()=>{var q,Pe,ke,D,Y,X,ie;return r.cn((q=r.classes)==null?void 0:q.toast,(ke=(Pe=r.toast)==null?void 0:Pe.classes)==null?void 0:ke.toast,(D=r.classes)==null?void 0:D.default,(Y=r.classes)==null?void 0:Y[r.toast.type||"default"],(ie=(X=r.toast)==null?void 0:X.classes)==null?void 0:ie[r.toast.type||"default"])}),M=r.toast.style||{},F=we(()=>r.heights.findIndex(q=>q.toastId===r.toast.id)||0),U=we(()=>r.toast.closeButton??r.closeButton),N=we(()=>r.toast.duration||r.duration||s1),G=ae(0),B=ae(0),A=ae(N.value),y=ae(0),w=ae(null),T=we(()=>r.position.split("-")),R=we(()=>T.value[0]),I=we(()=>T.value[1]),b=typeof r.toast.title!="string",Ve=typeof r.toast.description!="string",ht=we(()=>r.heights.reduce((q,Pe,ke)=>ke>=F.value?q:q+Pe.height,0)),$e=ZR(),Ce=we(()=>r.toast.invert||r.invert),ve=we(()=>v.value==="loading");un(()=>{if(!s.value)return;const q=d.value,Pe=q==null?void 0:q.style.height;q.style.height="auto";const ke=q.getBoundingClientRect().height;q.style.height=Pe,u.value=ke;let D;r.heights.find(Y=>Y.toastId===r.toast.id)?D=r.heights.map(Y=>Y.toastId===r.toast.id?{...Y,height:ke}:Y):D=[{toastId:r.toast.id,height:ke,position:r.toast.position},...r.heights],n("update:heights",D)});const Ge=()=>{i.value=!0,c.value=B.value;const q=r.heights.filter(Pe=>Pe.toastId!==r.toast.id);n("update:heights",q),setTimeout(()=>{n("removeToast",r.toast)},a1)},xt=()=>{var q,Pe;ve.value||!S.value||(Ge(),(Pe=(q=r.toast).onDismiss)==null||Pe.call(q,r.toast))},wt=q=>{ve.value||!S.value||(h.value=new Date,c.value=B.value,q.target.setPointerCapture(q.pointerId),q.target.tagName!=="BUTTON"&&(o.value=!0,w.value={x:q.clientX,y:q.clientY}))},Ke=q=>{var Pe,ke,D,Y;if(a.value)return;w.value=null;const X=Number(((Pe=d.value)==null?void 0:Pe.style.getPropertyValue("--swipe-amount").replace("px",""))||0),ie=new Date().getTime()-h.value.getTime(),xe=Math.abs(X)/ie;if(Math.abs(X)>=o1||xe>.11){c.value=B.value,(D=(ke=r.toast).onDismiss)==null||D.call(ke,r.toast),Ge(),a.value=!0;return}(Y=d.value)==null||Y.style.setProperty("--swipe-amount","0px"),o.value=!1},st=q=>{var Pe;if(!w.value)return;const ke=q.clientY-w.value.y,D=q.clientX-w.value.x,Y=(T.value[0]==="top"?Math.min:Math.max)(0,ke),X=q.pointerType==="touch"?10:2;Math.abs(Y)>X?(Pe=d.value)==null||Pe.style.setProperty("--swipe-amount",`${ke}px`):Math.abs(D)>X&&(w.value=null)};return _n(()=>{B.value=F.value*i1+ht.value}),_n(q=>{if(r.toast.promise&&v.value==="loading"||r.toast.duration===1/0||r.toast.type==="loading")return;let Pe;const ke=()=>{if(y.value<G.value){const Y=new Date().getTime()-G.value;A.value=A.value-Y}y.value=new Date().getTime()},D=()=>{G.value=new Date().getTime(),Pe=setTimeout(()=>{var Y,X;(X=(Y=r.toast).onAutoClose)==null||X.call(Y,r.toast),Ge()},A.value)};r.expanded||r.interacting||r.pauseWhenPageIsHidden&&$e?ke():D(),q(()=>{clearTimeout(Pe)})}),_n(()=>{r.toast.delete&&Ge()}),un(()=>{if(d.value){const q=d.value.getBoundingClientRect().height;u.value=q;const Pe=[{toastId:r.toast.id,height:q,position:r.toast.position},...r.heights];n("update:heights",Pe)}s.value=!0}),Ki(()=>{if(d.value){const q=r.heights.filter(Pe=>Pe.toastId!==r.toast.id);n("update:heights",q)}}),(q,Pe)=>{var ke,D,Y,X,ie,xe,Qe,E,C,k,$,V;return H(),he("li",{"aria-live":q.toast.important?"assertive":"polite","aria-atomic":"true",role:"status",tabindex:"0",ref_key:"toastRef",ref:d,"data-sonner-toast":"",class:Ct(P.value),"data-styled":!(q.toast.component||(ke=q.toast)!=null&&ke.unstyled||q.unstyled),"data-mounted":s.value,"data-promise":!!q.toast.promise,"data-removed":i.value,"data-visible":g.value,"data-y-position":R.value,"data-x-position":I.value,"data-index":q.index,"data-front":p.value,"data-swiping":o.value,"data-dismissible":S.value,"data-type":v.value,"data-invert":Ce.value,"data-swipe-out":a.value,"data-expanded":!!(q.expanded||q.expandByDefault&&s.value),style:vr({"--index":q.index,"--toasts-before":q.index,"--z-index":q.toasts.length-q.index,"--offset":`${i.value?c.value:B.value}px`,"--initial-height":q.expandByDefault?"auto":`${u.value}px`,...q.style,...j(M)}),onPointerdown:wt,onPointerup:Ke,onPointermove:st},[U.value&&!q.toast.component?(H(),he("button",{key:0,"aria-label":q.closeButtonAriaLabel||"Close toast","data-disabled":ve.value,"data-close-button":"",class:Ct(q.cn((D=q.classes)==null?void 0:D.closeButton,(X=(Y=q.toast)==null?void 0:Y.classes)==null?void 0:X.closeButton)),onClick:xt},[J(XR)],10,t1)):sn("",!0),q.toast.component?(H(),Ae(vi(q.toast.component),ft({key:1},q.toast.componentProps,{onCloseToast:Ge}),null,16)):(H(),he(ct,{key:2},[v.value!=="default"||q.toast.icon||q.toast.promise?(H(),he("div",n1,[(q.toast.promise||v.value==="loading")&&!q.toast.icon?Re(q.$slots,"loading-icon",{key:0}):sn("",!0),q.toast.icon?(H(),Ae(vi(q.toast.icon),{key:1})):(H(),he(ct,{key:2},[v.value==="success"?Re(q.$slots,"success-icon",{key:0}):v.value==="error"?Re(q.$slots,"error-icon",{key:1}):v.value==="warning"?Re(q.$slots,"warning-icon",{key:2}):v.value==="info"?Re(q.$slots,"info-icon",{key:3}):sn("",!0)],64))])):sn("",!0),L("div",r1,[L("div",{"data-title":"",class:Ct(q.cn((ie=q.classes)==null?void 0:ie.title,(xe=q.toast.classes)==null?void 0:xe.title))},[b?(H(),Ae(vi(q.toast.title),Oi(ft({key:0},q.toast.componentProps)),null,16)):(H(),he(ct,{key:1},[Ue(Lt(q.toast.title),1)],64))],2),q.toast.description?(H(),he("div",{key:0,"data-description":"",class:Ct(q.cn(q.descriptionClass,q.toast.descriptionClass,(Qe=q.classes)==null?void 0:Qe.description,(E=q.toast.classes)==null?void 0:E.description))},[Ve?(H(),Ae(vi(q.toast.description),Oi(ft({key:0},q.toast.componentProps)),null,16)):(H(),he(ct,{key:1},[Ue(Lt(q.toast.description),1)],64))],2)):sn("",!0)]),q.toast.cancel?(H(),he("button",{key:1,class:Ct(q.cn((C=q.classes)==null?void 0:C.cancelButton,(k=q.toast.classes)==null?void 0:k.cancelButton)),"data-button":"","data-cancel":"",onClick:Pe[0]||(Pe[0]=()=>{var Q;Ge(),(Q=q.toast.cancel)!=null&&Q.onClick&&q.toast.cancel.onClick()})},Lt(q.toast.cancel.label),3)):sn("",!0),q.toast.action?(H(),he("button",{key:2,class:Ct(q.cn(($=q.classes)==null?void 0:$.actionButton,(V=q.toast.classes)==null?void 0:V.actionButton)),"data-button":"",onClick:Pe[1]||(Pe[1]=Q=>{var se;(se=q.toast.action)==null||se.onClick(Q),!Q.defaultPrevented&&Ge()})},Lt(q.toast.action.label),3)):sn("",!0)],64))],46,e1)}}}),c1=["data-visible"],u1={class:"sonner-spinner"},h1=et({__name:"Loader",props:{visible:{type:Boolean}},setup(t){const e=Array(12).fill(0);return(n,r)=>(H(),he("div",{class:"sonner-loading-wrapper","data-visible":n.visible},[L("div",u1,[(H(!0),he(ct,null,ss(j(e),s=>(H(),he("div",{key:`spinner-bar-${s}`,class:"sonner-loading-bar"}))),128))])],8,c1))}}),d1={},f1={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},p1=L("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z","clip-rule":"evenodd"},null,-1),m1=[p1];function g1(t,e){return H(),he("svg",f1,m1)}const _1=Da(d1,[["render",g1]]),y1={},v1={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},w1=L("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z","clip-rule":"evenodd"},null,-1),E1=[w1];function b1(t,e){return H(),he("svg",v1,E1)}const I1=Da(y1,[["render",b1]]),T1={},C1={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},A1=L("path",{"fill-rule":"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z","clip-rule":"evenodd"},null,-1),S1=[A1];function R1(t,e){return H(),he("svg",C1,S1)}const P1=Da(T1,[["render",R1]]),x1={},k1={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},N1=L("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z","clip-rule":"evenodd"},null,-1),O1=[N1];function D1(t,e){return H(),he("svg",k1,O1)}const M1=Da(x1,[["render",D1]]),L1=["aria-label"],V1=["dir","data-theme","data-rich-colors","data-y-position","data-x-position"],F1=3,Ig="32px",U1=4e3,$1=356,Tg=14,B1=typeof window<"u"&&typeof document<"u",j1=et({name:"Toaster",inheritAttrs:!1,__name:"Toaster",props:{invert:{type:Boolean,default:!1},theme:{default:"light"},position:{default:"bottom-right"},hotkey:{default:()=>["altKey","KeyT"]},richColors:{type:Boolean,default:!1},expand:{type:Boolean,default:!1},duration:{default:U1},gap:{default:Tg},visibleToasts:{default:F1},closeButton:{type:Boolean,default:!1},toastOptions:{default:()=>({})},class:{default:""},style:{default:()=>({})},offset:{default:Ig},dir:{default:"auto"},icons:{},containerAriaLabel:{default:"Notifications"},pauseWhenPageIsHidden:{type:Boolean,default:!1},cn:{}},setup(t){function e(...N){return N.filter(Boolean).join(" ")}function n(){if(typeof window>"u"||typeof document>"u")return"ltr";const N=document.documentElement.getAttribute("dir");return N==="auto"||!N?window.getComputedStyle(document.documentElement).direction:N}const r=t,s=PC(),i=ae([]),o=we(()=>{const N=i.value.filter(G=>G.position).map(G=>G.position);return N.length>0?Array.from(new Set([r.position].concat(N))):[r.position]}),a=ae([]),c=ae(!1),u=ae(!1),h=ae(r.theme!=="system"?r.theme:typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),d=we(()=>r.cn||e),p=ae(null),g=ae(null),v=ae(!1),S=r.hotkey.join("+").replace(/Key/g,"").replace(/Digit/g,"");function P(N){i.value=i.value.filter(({id:G})=>G!==N.id)}const M=N=>{var G,B;v.value&&!((B=(G=N.currentTarget)==null?void 0:G.contains)!=null&&B.call(G,N.relatedTarget))&&(v.value=!1,g.value&&(g.value.focus({preventScroll:!0}),g.value=null))},F=N=>{N.target instanceof HTMLElement&&N.target.dataset.dismissible==="false"||v.value||(v.value=!0,g.value=N.relatedTarget)},U=N=>{N.target&&N.target instanceof HTMLElement&&N.target.dataset.dismissible==="false"||(u.value=!1)};return _n(N=>{const G=Dn.subscribe(B=>{if(B.dismiss){i.value=i.value.map(A=>A.id===B.id?{...A,delete:!0}:A);return}tr(()=>{const A=i.value.findIndex(y=>y.id===B.id);A!==-1?i.value.splice(A,1,B):i.value=[B,...i.value]})});N(()=>{G()})}),It(()=>r.theme,N=>{if(N!=="system"){h.value=N;return}N==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?h.value="dark":h.value="light"),!(typeof window>"u")&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",({matches:G})=>{G?h.value="dark":h.value="light"})}),It(()=>p.value,()=>{if(p.value)return()=>{g.value&&(g.value.focus({preventScroll:!0}),g.value=null,v.value=!1)}}),_n(()=>{i.value.length<=1&&(c.value=!1)}),_n(N=>{function G(B){const A=r.hotkey.every(T=>B[T]||B.code===T),y=Array.isArray(p.value)?p.value[0]:p.value;A&&(c.value=!0,y==null||y.focus());const w=document.activeElement===p.value||(y==null?void 0:y.contains(document.activeElement));B.code==="Escape"&&w&&(c.value=!1)}B1&&(document.addEventListener("keydown",G),N(()=>{document.removeEventListener("keydown",G)}))}),(N,G)=>(H(),he("section",{"aria-label":`${N.containerAriaLabel} ${j(S)}`,tabIndex:-1},[(H(!0),he(ct,null,ss(o.value,(B,A)=>{var y;return H(),he("ol",ft({key:B,ref_for:!0,ref_key:"listRef",ref:p,"data-sonner-toaster":"",class:N.class,dir:N.dir==="auto"?n():N.dir,tabIndex:-1,"data-theme":N.theme,"data-rich-colors":N.richColors,"data-y-position":B.split("-")[0],"data-x-position":B.split("-")[1],style:{"--front-toast-height":`${(y=a.value[0])==null?void 0:y.height}px`,"--offset":typeof N.offset=="number"?`${N.offset}px`:N.offset||Ig,"--width":`${$1}px`,"--gap":`${Tg}px`,...N.style,...j(s).style},onBlur:M,onFocus:F,onMouseenter:G[1]||(G[1]=w=>c.value=!0),onMousemove:G[2]||(G[2]=w=>c.value=!0),onMouseleave:G[3]||(G[3]=()=>{u.value||(c.value=!1)}),onPointerdown:U,onPointerup:G[4]||(G[4]=w=>u.value=!1)},N.$attrs),[(H(!0),he(ct,null,ss(i.value.filter(w=>!w.position&&A===0||w.position===N.position),(w,T)=>{var R,I,b,Ve,ht,$e,Ce,ve,Ge;return H(),Ae(l1,{key:w.id,index:T,toast:w,duration:((R=N.toastOptions)==null?void 0:R.duration)??N.duration,class:Ct((I=N.toastOptions)==null?void 0:I.class),descriptionClass:(b=N.toastOptions)==null?void 0:b.descriptionClass,invert:N.invert,visibleToasts:N.visibleToasts,closeButton:((Ve=N.toastOptions)==null?void 0:Ve.closeButton)??N.closeButton,interacting:u.value,position:N.position,style:vr((ht=N.toastOptions)==null?void 0:ht.style),unstyled:($e=N.toastOptions)==null?void 0:$e.unstyled,classes:(Ce=N.toastOptions)==null?void 0:Ce.classes,cancelButtonStyle:(ve=N.toastOptions)==null?void 0:ve.cancelButtonStyle,actionButtonStyle:(Ge=N.toastOptions)==null?void 0:Ge.actionButtonStyle,toasts:i.value,expandByDefault:N.expand,gap:N.gap,expanded:c.value,pauseWhenPageIsHidden:N.pauseWhenPageIsHidden,cn:d.value,heights:a.value,"onUpdate:heights":G[0]||(G[0]=xt=>a.value=xt),onRemoveToast:P},{"loading-icon":te(()=>[Re(N.$slots,"loading-icon",{},()=>[J(h1,{visible:w.type==="loading"},null,8,["visible"])])]),"success-icon":te(()=>[Re(N.$slots,"success-icon",{},()=>[J(_1)])]),"error-icon":te(()=>[Re(N.$slots,"error-icon",{},()=>[J(M1)])]),"warning-icon":te(()=>[Re(N.$slots,"warning-icon",{},()=>[J(P1)])]),"info-icon":te(()=>[Re(N.$slots,"info-icon",{},()=>[J(I1)])]),_:2},1032,["index","toast","duration","class","descriptionClass","invert","visibleToasts","closeButton","interacting","position","style","unstyled","classes","cancelButtonStyle","actionButtonStyle","toasts","expandByDefault","gap","expanded","pauseWhenPageIsHidden","cn","heights"])}),128))],16,V1)}),128))],8,L1))}});/*!
  * vue-router v4.3.2
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */const mi=typeof document<"u";function q1(t){return t.__esModule||t[Symbol.toStringTag]==="Module"}const Ye=Object.assign;function th(t,e){const n={};for(const r in e){const s=e[r];n[r]=qn(s)?s.map(t):t(s)}return n}const Ho=()=>{},qn=Array.isArray,Iw=/#/g,H1=/&/g,W1=/\//g,z1=/=/g,G1=/\?/g,Tw=/\+/g,K1=/%5B/g,Q1=/%5D/g,Cw=/%5E/g,Y1=/%60/g,Aw=/%7B/g,J1=/%7C/g,Sw=/%7D/g,X1=/%20/g;function nf(t){return encodeURI(""+t).replace(J1,"|").replace(K1,"[").replace(Q1,"]")}function Z1(t){return nf(t).replace(Aw,"{").replace(Sw,"}").replace(Cw,"^")}function qh(t){return nf(t).replace(Tw,"%2B").replace(X1,"+").replace(Iw,"%23").replace(H1,"%26").replace(Y1,"`").replace(Aw,"{").replace(Sw,"}").replace(Cw,"^")}function eP(t){return qh(t).replace(z1,"%3D")}function tP(t){return nf(t).replace(Iw,"%23").replace(G1,"%3F")}function nP(t){return t==null?"":tP(t).replace(W1,"%2F")}function ua(t){try{return decodeURIComponent(""+t)}catch{}return""+t}const rP=/\/$/,sP=t=>t.replace(rP,"");function nh(t,e,n="/"){let r,s={},i="",o="";const a=e.indexOf("#");let c=e.indexOf("?");return a<c&&a>=0&&(c=-1),c>-1&&(r=e.slice(0,c),i=e.slice(c+1,a>-1?a:e.length),s=t(i)),a>-1&&(r=r||e.slice(0,a),o=e.slice(a,e.length)),r=lP(r??e,n),{fullPath:r+(i&&"?")+i+o,path:r,query:s,hash:ua(o)}}function iP(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Cg(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function oP(t,e,n){const r=e.matched.length-1,s=n.matched.length-1;return r>-1&&r===s&&Di(e.matched[r],n.matched[s])&&Rw(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function Di(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function Rw(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!aP(t[n],e[n]))return!1;return!0}function aP(t,e){return qn(t)?Ag(t,e):qn(e)?Ag(e,t):t===e}function Ag(t,e){return qn(e)?t.length===e.length&&t.every((n,r)=>n===e[r]):t.length===1&&t[0]===e}function lP(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),r=t.split("/"),s=r[r.length-1];(s===".."||s===".")&&r.push("");let i=n.length-1,o,a;for(o=0;o<r.length;o++)if(a=r[o],a!==".")if(a==="..")i>1&&i--;else break;return n.slice(0,i).join("/")+"/"+r.slice(o).join("/")}var ha;(function(t){t.pop="pop",t.push="push"})(ha||(ha={}));var Wo;(function(t){t.back="back",t.forward="forward",t.unknown=""})(Wo||(Wo={}));function cP(t){if(!t)if(mi){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),sP(t)}const uP=/^[^#]+#/;function hP(t,e){return t.replace(uP,"#")+e}function dP(t,e){const n=document.documentElement.getBoundingClientRect(),r=t.getBoundingClientRect();return{behavior:e.behavior,left:r.left-n.left-(e.left||0),top:r.top-n.top-(e.top||0)}}const Xc=()=>({left:window.scrollX,top:window.scrollY});function fP(t){let e;if("el"in t){const n=t.el,r=typeof n=="string"&&n.startsWith("#"),s=typeof n=="string"?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!s)return;e=dP(s,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function Sg(t,e){return(history.state?history.state.position-e:-1)+t}const Hh=new Map;function pP(t,e){Hh.set(t,e)}function mP(t){const e=Hh.get(t);return Hh.delete(t),e}let gP=()=>location.protocol+"//"+location.host;function Pw(t,e){const{pathname:n,search:r,hash:s}=e,i=t.indexOf("#");if(i>-1){let a=s.includes(t.slice(i))?t.slice(i).length:1,c=s.slice(a);return c[0]!=="/"&&(c="/"+c),Cg(c,"")}return Cg(n,t)+r+s}function _P(t,e,n,r){let s=[],i=[],o=null;const a=({state:p})=>{const g=Pw(t,location),v=n.value,S=e.value;let P=0;if(p){if(n.value=g,e.value=p,o&&o===v){o=null;return}P=S?p.position-S.position:0}else r(g);s.forEach(M=>{M(n.value,v,{delta:P,type:ha.pop,direction:P?P>0?Wo.forward:Wo.back:Wo.unknown})})};function c(){o=n.value}function u(p){s.push(p);const g=()=>{const v=s.indexOf(p);v>-1&&s.splice(v,1)};return i.push(g),g}function h(){const{history:p}=window;p.state&&p.replaceState(Ye({},p.state,{scroll:Xc()}),"")}function d(){for(const p of i)p();i=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",h)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",h,{passive:!0}),{pauseListeners:c,listen:u,destroy:d}}function Rg(t,e,n,r=!1,s=!1){return{back:t,current:e,forward:n,replaced:r,position:window.history.length,scroll:s?Xc():null}}function yP(t){const{history:e,location:n}=window,r={value:Pw(t,n)},s={value:e.state};s.value||i(r.value,{back:null,current:r.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function i(c,u,h){const d=t.indexOf("#"),p=d>-1?(n.host&&document.querySelector("base")?t:t.slice(d))+c:gP()+t+c;try{e[h?"replaceState":"pushState"](u,"",p),s.value=u}catch(g){console.error(g),n[h?"replace":"assign"](p)}}function o(c,u){const h=Ye({},e.state,Rg(s.value.back,c,s.value.forward,!0),u,{position:s.value.position});i(c,h,!0),r.value=c}function a(c,u){const h=Ye({},s.value,e.state,{forward:c,scroll:Xc()});i(h.current,h,!0);const d=Ye({},Rg(r.value,c,null),{position:h.position+1},u);i(c,d,!1),r.value=c}return{location:r,state:s,push:a,replace:o}}function vP(t){t=cP(t);const e=yP(t),n=_P(t,e.state,e.location,e.replace);function r(i,o=!0){o||n.pauseListeners(),history.go(i)}const s=Ye({location:"",base:t,go:r,createHref:hP.bind(null,t)},e,n);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>e.state.value}),s}function wP(t){return typeof t=="string"||t&&typeof t=="object"}function xw(t){return typeof t=="string"||typeof t=="symbol"}const Vr={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},kw=Symbol("");var Pg;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Pg||(Pg={}));function Mi(t,e){return Ye(new Error,{type:t,[kw]:!0},e)}function ur(t,e){return t instanceof Error&&kw in t&&(e==null||!!(t.type&e))}const xg="[^/]+?",EP={sensitive:!1,strict:!1,start:!0,end:!0},bP=/[.+*?^${}()[\]/\\]/g;function IP(t,e){const n=Ye({},EP,e),r=[];let s=n.start?"^":"";const i=[];for(const u of t){const h=u.length?[]:[90];n.strict&&!u.length&&(s+="/");for(let d=0;d<u.length;d++){const p=u[d];let g=40+(n.sensitive?.25:0);if(p.type===0)d||(s+="/"),s+=p.value.replace(bP,"\\$&"),g+=40;else if(p.type===1){const{value:v,repeatable:S,optional:P,regexp:M}=p;i.push({name:v,repeatable:S,optional:P});const F=M||xg;if(F!==xg){g+=10;try{new RegExp(`(${F})`)}catch(N){throw new Error(`Invalid custom RegExp for param "${v}" (${F}): `+N.message)}}let U=S?`((?:${F})(?:/(?:${F}))*)`:`(${F})`;d||(U=P&&u.length<2?`(?:/${U})`:"/"+U),P&&(U+="?"),s+=U,g+=20,P&&(g+=-8),S&&(g+=-20),F===".*"&&(g+=-50)}h.push(g)}r.push(h)}if(n.strict&&n.end){const u=r.length-1;r[u][r[u].length-1]+=.7000000000000001}n.strict||(s+="/?"),n.end?s+="$":n.strict&&(s+="(?:/|$)");const o=new RegExp(s,n.sensitive?"":"i");function a(u){const h=u.match(o),d={};if(!h)return null;for(let p=1;p<h.length;p++){const g=h[p]||"",v=i[p-1];d[v.name]=g&&v.repeatable?g.split("/"):g}return d}function c(u){let h="",d=!1;for(const p of t){(!d||!h.endsWith("/"))&&(h+="/"),d=!1;for(const g of p)if(g.type===0)h+=g.value;else if(g.type===1){const{value:v,repeatable:S,optional:P}=g,M=v in u?u[v]:"";if(qn(M)&&!S)throw new Error(`Provided param "${v}" is an array but it is not repeatable (* or + modifiers)`);const F=qn(M)?M.join("/"):M;if(!F)if(P)p.length<2&&(h.endsWith("/")?h=h.slice(0,-1):d=!0);else throw new Error(`Missing required param "${v}"`);h+=F}}return h||"/"}return{re:o,score:r,keys:i,parse:a,stringify:c}}function TP(t,e){let n=0;for(;n<t.length&&n<e.length;){const r=e[n]-t[n];if(r)return r;n++}return t.length<e.length?t.length===1&&t[0]===80?-1:1:t.length>e.length?e.length===1&&e[0]===80?1:-1:0}function CP(t,e){let n=0;const r=t.score,s=e.score;for(;n<r.length&&n<s.length;){const i=TP(r[n],s[n]);if(i)return i;n++}if(Math.abs(s.length-r.length)===1){if(kg(r))return 1;if(kg(s))return-1}return s.length-r.length}function kg(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const AP={type:0,value:""},SP=/[a-zA-Z0-9_]/;function RP(t){if(!t)return[[]];if(t==="/")return[[AP]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(g){throw new Error(`ERR (${n})/"${u}": ${g}`)}let n=0,r=n;const s=[];let i;function o(){i&&s.push(i),i=[]}let a=0,c,u="",h="";function d(){u&&(n===0?i.push({type:0,value:u}):n===1||n===2||n===3?(i.length>1&&(c==="*"||c==="+")&&e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`),i.push({type:1,value:u,regexp:h,repeatable:c==="*"||c==="+",optional:c==="*"||c==="?"})):e("Invalid state to consume buffer"),u="")}function p(){u+=c}for(;a<t.length;){if(c=t[a++],c==="\\"&&n!==2){r=n,n=4;continue}switch(n){case 0:c==="/"?(u&&d(),o()):c===":"?(d(),n=1):p();break;case 4:p(),n=r;break;case 1:c==="("?n=2:SP.test(c)?p():(d(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--);break;case 2:c===")"?h[h.length-1]=="\\"?h=h.slice(0,-1)+c:n=3:h+=c;break;case 3:d(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--,h="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${u}"`),d(),o(),s}function PP(t,e,n){const r=IP(RP(t.path),n),s=Ye(r,{record:t,parent:e,children:[],alias:[]});return e&&!s.record.aliasOf==!e.record.aliasOf&&e.children.push(s),s}function xP(t,e){const n=[],r=new Map;e=Dg({strict:!1,end:!0,sensitive:!1},e);function s(h){return r.get(h)}function i(h,d,p){const g=!p,v=kP(h);v.aliasOf=p&&p.record;const S=Dg(e,h),P=[v];if("alias"in h){const U=typeof h.alias=="string"?[h.alias]:h.alias;for(const N of U)P.push(Ye({},v,{components:p?p.record.components:v.components,path:N,aliasOf:p?p.record:v}))}let M,F;for(const U of P){const{path:N}=U;if(d&&N[0]!=="/"){const G=d.record.path,B=G[G.length-1]==="/"?"":"/";U.path=d.record.path+(N&&B+N)}if(M=PP(U,d,S),p?p.alias.push(M):(F=F||M,F!==M&&F.alias.push(M),g&&h.name&&!Og(M)&&o(h.name)),v.children){const G=v.children;for(let B=0;B<G.length;B++)i(G[B],M,p&&p.children[B])}p=p||M,(M.record.components&&Object.keys(M.record.components).length||M.record.name||M.record.redirect)&&c(M)}return F?()=>{o(F)}:Ho}function o(h){if(xw(h)){const d=r.get(h);d&&(r.delete(h),n.splice(n.indexOf(d),1),d.children.forEach(o),d.alias.forEach(o))}else{const d=n.indexOf(h);d>-1&&(n.splice(d,1),h.record.name&&r.delete(h.record.name),h.children.forEach(o),h.alias.forEach(o))}}function a(){return n}function c(h){let d=0;for(;d<n.length&&CP(h,n[d])>=0&&(h.record.path!==n[d].record.path||!Nw(h,n[d]));)d++;n.splice(d,0,h),h.record.name&&!Og(h)&&r.set(h.record.name,h)}function u(h,d){let p,g={},v,S;if("name"in h&&h.name){if(p=r.get(h.name),!p)throw Mi(1,{location:h});S=p.record.name,g=Ye(Ng(d.params,p.keys.filter(F=>!F.optional).concat(p.parent?p.parent.keys.filter(F=>F.optional):[]).map(F=>F.name)),h.params&&Ng(h.params,p.keys.map(F=>F.name))),v=p.stringify(g)}else if(h.path!=null)v=h.path,p=n.find(F=>F.re.test(v)),p&&(g=p.parse(v),S=p.record.name);else{if(p=d.name?r.get(d.name):n.find(F=>F.re.test(d.path)),!p)throw Mi(1,{location:h,currentLocation:d});S=p.record.name,g=Ye({},d.params,h.params),v=p.stringify(g)}const P=[];let M=p;for(;M;)P.unshift(M.record),M=M.parent;return{name:S,path:v,params:g,matched:P,meta:OP(P)}}return t.forEach(h=>i(h)),{addRoute:i,resolve:u,removeRoute:o,getRoutes:a,getRecordMatcher:s}}function Ng(t,e){const n={};for(const r of e)r in t&&(n[r]=t[r]);return n}function kP(t){return{path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:void 0,beforeEnter:t.beforeEnter,props:NP(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}}}function NP(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const r in t.components)e[r]=typeof n=="object"?n[r]:n;return e}function Og(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function OP(t){return t.reduce((e,n)=>Ye(e,n.meta),{})}function Dg(t,e){const n={};for(const r in t)n[r]=r in e?e[r]:t[r];return n}function Nw(t,e){return e.children.some(n=>n===t||Nw(t,n))}function DP(t){const e={};if(t===""||t==="?")return e;const r=(t[0]==="?"?t.slice(1):t).split("&");for(let s=0;s<r.length;++s){const i=r[s].replace(Tw," "),o=i.indexOf("="),a=ua(o<0?i:i.slice(0,o)),c=o<0?null:ua(i.slice(o+1));if(a in e){let u=e[a];qn(u)||(u=e[a]=[u]),u.push(c)}else e[a]=c}return e}function Mg(t){let e="";for(let n in t){const r=t[n];if(n=eP(n),r==null){r!==void 0&&(e+=(e.length?"&":"")+n);continue}(qn(r)?r.map(i=>i&&qh(i)):[r&&qh(r)]).forEach(i=>{i!==void 0&&(e+=(e.length?"&":"")+n,i!=null&&(e+="="+i))})}return e}function MP(t){const e={};for(const n in t){const r=t[n];r!==void 0&&(e[n]=qn(r)?r.map(s=>s==null?null:""+s):r==null?r:""+r)}return e}const LP=Symbol(""),Lg=Symbol(""),rf=Symbol(""),sf=Symbol(""),Wh=Symbol("");function Io(){let t=[];function e(r){return t.push(r),()=>{const s=t.indexOf(r);s>-1&&t.splice(s,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function Hr(t,e,n,r,s,i=o=>o()){const o=r&&(r.enterCallbacks[s]=r.enterCallbacks[s]||[]);return()=>new Promise((a,c)=>{const u=p=>{p===!1?c(Mi(4,{from:n,to:e})):p instanceof Error?c(p):wP(p)?c(Mi(2,{from:e,to:p})):(o&&r.enterCallbacks[s]===o&&typeof p=="function"&&o.push(p),a())},h=i(()=>t.call(r&&r.instances[s],e,n,u));let d=Promise.resolve(h);t.length<3&&(d=d.then(u)),d.catch(p=>c(p))})}function rh(t,e,n,r,s=i=>i()){const i=[];for(const o of t)for(const a in o.components){let c=o.components[a];if(!(e!=="beforeRouteEnter"&&!o.instances[a]))if(VP(c)){const h=(c.__vccOpts||c)[e];h&&i.push(Hr(h,n,r,o,a,s))}else{let u=c();i.push(()=>u.then(h=>{if(!h)return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${o.path}"`));const d=q1(h)?h.default:h;o.components[a]=d;const g=(d.__vccOpts||d)[e];return g&&Hr(g,n,r,o,a,s)()}))}}return i}function VP(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function Vg(t){const e=$n(rf),n=$n(sf),r=we(()=>{const c=j(t.to);return e.resolve(c)}),s=we(()=>{const{matched:c}=r.value,{length:u}=c,h=c[u-1],d=n.matched;if(!h||!d.length)return-1;const p=d.findIndex(Di.bind(null,h));if(p>-1)return p;const g=Fg(c[u-2]);return u>1&&Fg(h)===g&&d[d.length-1].path!==g?d.findIndex(Di.bind(null,c[u-2])):p}),i=we(()=>s.value>-1&&BP(n.params,r.value.params)),o=we(()=>s.value>-1&&s.value===n.matched.length-1&&Rw(n.params,r.value.params));function a(c={}){return $P(c)?e[j(t.replace)?"replace":"push"](j(t.to)).catch(Ho):Promise.resolve()}return{route:r,href:we(()=>r.value.href),isActive:i,isExactActive:o,navigate:a}}const FP=et({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:Vg,setup(t,{slots:e}){const n=Ys(Vg(t)),{options:r}=$n(rf),s=we(()=>({[Ug(t.activeClass,r.linkActiveClass,"router-link-active")]:n.isActive,[Ug(t.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const i=e.default&&e.default(n);return t.custom?i:Ms("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},i)}}}),UP=FP;function $P(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function BP(t,e){for(const n in e){const r=e[n],s=t[n];if(typeof r=="string"){if(r!==s)return!1}else if(!qn(s)||s.length!==r.length||r.some((i,o)=>i!==s[o]))return!1}return!0}function Fg(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const Ug=(t,e,n)=>t??e??n,jP=et({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const r=$n(Wh),s=we(()=>t.route||r.value),i=$n(Lg,0),o=we(()=>{let u=j(i);const{matched:h}=s.value;let d;for(;(d=h[u])&&!d.components;)u++;return u}),a=we(()=>s.value.matched[o.value]);Bo(Lg,we(()=>o.value+1)),Bo(LP,a),Bo(Wh,s);const c=ae();return It(()=>[c.value,a.value,t.name],([u,h,d],[p,g,v])=>{h&&(h.instances[d]=u,g&&g!==h&&u&&u===p&&(h.leaveGuards.size||(h.leaveGuards=g.leaveGuards),h.updateGuards.size||(h.updateGuards=g.updateGuards))),u&&h&&(!g||!Di(h,g)||!p)&&(h.enterCallbacks[d]||[]).forEach(S=>S(u))},{flush:"post"}),()=>{const u=s.value,h=t.name,d=a.value,p=d&&d.components[h];if(!p)return $g(n.default,{Component:p,route:u});const g=d.props[h],v=g?g===!0?u.params:typeof g=="function"?g(u):g:null,P=Ms(p,Ye({},v,e,{onVnodeUnmounted:M=>{M.component.isUnmounted&&(d.instances[h]=null)},ref:c}));return $g(n.default,{Component:P,route:u})||P}}});function $g(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const qP=jP;function HP(t){const e=xP(t.routes,t),n=t.parseQuery||DP,r=t.stringifyQuery||Mg,s=t.history,i=Io(),o=Io(),a=Io(),c=zT(Vr);let u=Vr;mi&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const h=th.bind(null,D=>""+D),d=th.bind(null,nP),p=th.bind(null,ua);function g(D,Y){let X,ie;return xw(D)?(X=e.getRecordMatcher(D),ie=Y):ie=D,e.addRoute(ie,X)}function v(D){const Y=e.getRecordMatcher(D);Y&&e.removeRoute(Y)}function S(){return e.getRoutes().map(D=>D.record)}function P(D){return!!e.getRecordMatcher(D)}function M(D,Y){if(Y=Ye({},Y||c.value),typeof D=="string"){const C=nh(n,D,Y.path),k=e.resolve({path:C.path},Y),$=s.createHref(C.fullPath);return Ye(C,k,{params:p(k.params),hash:ua(C.hash),redirectedFrom:void 0,href:$})}let X;if(D.path!=null)X=Ye({},D,{path:nh(n,D.path,Y.path).path});else{const C=Ye({},D.params);for(const k in C)C[k]==null&&delete C[k];X=Ye({},D,{params:d(C)}),Y.params=d(Y.params)}const ie=e.resolve(X,Y),xe=D.hash||"";ie.params=h(p(ie.params));const Qe=iP(r,Ye({},D,{hash:Z1(xe),path:ie.path})),E=s.createHref(Qe);return Ye({fullPath:Qe,hash:xe,query:r===Mg?MP(D.query):D.query||{}},ie,{redirectedFrom:void 0,href:E})}function F(D){return typeof D=="string"?nh(n,D,c.value.path):Ye({},D)}function U(D,Y){if(u!==D)return Mi(8,{from:Y,to:D})}function N(D){return A(D)}function G(D){return N(Ye(F(D),{replace:!0}))}function B(D){const Y=D.matched[D.matched.length-1];if(Y&&Y.redirect){const{redirect:X}=Y;let ie=typeof X=="function"?X(D):X;return typeof ie=="string"&&(ie=ie.includes("?")||ie.includes("#")?ie=F(ie):{path:ie},ie.params={}),Ye({query:D.query,hash:D.hash,params:ie.path!=null?{}:D.params},ie)}}function A(D,Y){const X=u=M(D),ie=c.value,xe=D.state,Qe=D.force,E=D.replace===!0,C=B(X);if(C)return A(Ye(F(C),{state:typeof C=="object"?Ye({},xe,C.state):xe,force:Qe,replace:E}),Y||X);const k=X;k.redirectedFrom=Y;let $;return!Qe&&oP(r,ie,X)&&($=Mi(16,{to:k,from:ie}),wt(ie,ie,!0,!1)),($?Promise.resolve($):T(k,ie)).catch(V=>ur(V)?ur(V,2)?V:xt(V):ve(V,k,ie)).then(V=>{if(V){if(ur(V,2))return A(Ye({replace:E},F(V.to),{state:typeof V.to=="object"?Ye({},xe,V.to.state):xe,force:Qe}),Y||k)}else V=I(k,ie,!0,E,xe);return R(k,ie,V),V})}function y(D,Y){const X=U(D,Y);return X?Promise.reject(X):Promise.resolve()}function w(D){const Y=q.values().next().value;return Y&&typeof Y.runWithContext=="function"?Y.runWithContext(D):D()}function T(D,Y){let X;const[ie,xe,Qe]=WP(D,Y);X=rh(ie.reverse(),"beforeRouteLeave",D,Y);for(const C of ie)C.leaveGuards.forEach(k=>{X.push(Hr(k,D,Y))});const E=y.bind(null,D,Y);return X.push(E),ke(X).then(()=>{X=[];for(const C of i.list())X.push(Hr(C,D,Y));return X.push(E),ke(X)}).then(()=>{X=rh(xe,"beforeRouteUpdate",D,Y);for(const C of xe)C.updateGuards.forEach(k=>{X.push(Hr(k,D,Y))});return X.push(E),ke(X)}).then(()=>{X=[];for(const C of Qe)if(C.beforeEnter)if(qn(C.beforeEnter))for(const k of C.beforeEnter)X.push(Hr(k,D,Y));else X.push(Hr(C.beforeEnter,D,Y));return X.push(E),ke(X)}).then(()=>(D.matched.forEach(C=>C.enterCallbacks={}),X=rh(Qe,"beforeRouteEnter",D,Y,w),X.push(E),ke(X))).then(()=>{X=[];for(const C of o.list())X.push(Hr(C,D,Y));return X.push(E),ke(X)}).catch(C=>ur(C,8)?C:Promise.reject(C))}function R(D,Y,X){a.list().forEach(ie=>w(()=>ie(D,Y,X)))}function I(D,Y,X,ie,xe){const Qe=U(D,Y);if(Qe)return Qe;const E=Y===Vr,C=mi?history.state:{};X&&(ie||E?s.replace(D.fullPath,Ye({scroll:E&&C&&C.scroll},xe)):s.push(D.fullPath,xe)),c.value=D,wt(D,Y,X,E),xt()}let b;function Ve(){b||(b=s.listen((D,Y,X)=>{if(!Pe.listening)return;const ie=M(D),xe=B(ie);if(xe){A(Ye(xe,{replace:!0}),ie).catch(Ho);return}u=ie;const Qe=c.value;mi&&pP(Sg(Qe.fullPath,X.delta),Xc()),T(ie,Qe).catch(E=>ur(E,12)?E:ur(E,2)?(A(E.to,ie).then(C=>{ur(C,20)&&!X.delta&&X.type===ha.pop&&s.go(-1,!1)}).catch(Ho),Promise.reject()):(X.delta&&s.go(-X.delta,!1),ve(E,ie,Qe))).then(E=>{E=E||I(ie,Qe,!1),E&&(X.delta&&!ur(E,8)?s.go(-X.delta,!1):X.type===ha.pop&&ur(E,20)&&s.go(-1,!1)),R(ie,Qe,E)}).catch(Ho)}))}let ht=Io(),$e=Io(),Ce;function ve(D,Y,X){xt(D);const ie=$e.list();return ie.length?ie.forEach(xe=>xe(D,Y,X)):console.error(D),Promise.reject(D)}function Ge(){return Ce&&c.value!==Vr?Promise.resolve():new Promise((D,Y)=>{ht.add([D,Y])})}function xt(D){return Ce||(Ce=!D,Ve(),ht.list().forEach(([Y,X])=>D?X(D):Y()),ht.reset()),D}function wt(D,Y,X,ie){const{scrollBehavior:xe}=t;if(!mi||!xe)return Promise.resolve();const Qe=!X&&mP(Sg(D.fullPath,0))||(ie||!X)&&history.state&&history.state.scroll||null;return tr().then(()=>xe(D,Y,Qe)).then(E=>E&&fP(E)).catch(E=>ve(E,D,Y))}const Ke=D=>s.go(D);let st;const q=new Set,Pe={currentRoute:c,listening:!0,addRoute:g,removeRoute:v,hasRoute:P,getRoutes:S,resolve:M,options:t,push:N,replace:G,go:Ke,back:()=>Ke(-1),forward:()=>Ke(1),beforeEach:i.add,beforeResolve:o.add,afterEach:a.add,onError:$e.add,isReady:Ge,install(D){const Y=this;D.component("RouterLink",UP),D.component("RouterView",qP),D.config.globalProperties.$router=Y,Object.defineProperty(D.config.globalProperties,"$route",{enumerable:!0,get:()=>j(c)}),mi&&!st&&c.value===Vr&&(st=!0,N(s.location).catch(xe=>{}));const X={};for(const xe in Vr)Object.defineProperty(X,xe,{get:()=>c.value[xe],enumerable:!0});D.provide(rf,Y),D.provide(sf,gv(X)),D.provide(Wh,c);const ie=D.unmount;q.add(D),D.unmount=function(){q.delete(D),q.size<1&&(u=Vr,b&&b(),b=null,c.value=Vr,st=!1,Ce=!1),ie()}}};function ke(D){return D.reduce((Y,X)=>Y.then(()=>w(X)),Promise.resolve())}return Pe}function WP(t,e){const n=[],r=[],s=[],i=Math.max(e.matched.length,t.matched.length);for(let o=0;o<i;o++){const a=e.matched[o];a&&(t.matched.find(u=>Di(u,a))?r.push(a):n.push(a));const c=t.matched[o];c&&(e.matched.find(u=>Di(u,c))||s.push(c))}return[n,r,s]}function zP(){return $n(sf)}const GP="/assets/favicon-B9NSDGv9.jpg",ir=(t,e)=>{const n=t.__vccOpts||t;for(const[r,s]of e)n[r]=s;return n},KP={components:{Button:Jc,Avatar:OR,AvatarFallback:MR,AvatarImage:DR,UserCircleIcon:UR},setup(){const t=zP(),e=we(()=>t.meta&&t.meta.title||"Default Title");return un(()=>{gn.success(`Welcome to ${e.value}`)}),It(()=>t.path,n=>{gn.success(`Transitioned to ${e.value}`)}),{currentPageTitle:e}}},QP={class:"fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/10 text-black shadow-2xl py-3 px-4 h-[--header-height]"},YP={class:"flex justify-between"},JP={class:"flex justify-between items-center"},XP={class:"text-3xl font-bold absolute ml-20 text-[--text-50] drop-shadow-[0_5px_30px_rgba(255,255,255,0.35)]"},ZP={class:"flex text-md items-center font-bold text-[--text-50]"};function ex(t,e,n,r,s,i){const o=ut("Button"),a=ut("router-link"),c=ut("UserCircleIcon"),u=ut("AvatarFallback"),h=ut("Avatar");return H(),he("header",QP,[L("nav",null,[L("div",YP,[L("div",JP,[L("img",{src:GP,alt:"Logo image",class:"h-16 w-16 justify-center items-center object-cover cursor-pointer rounded-full shadow-xl",onClick:e[0]||(e[0]=d=>t.$router.push("/"))}),L("span",XP,Lt(r.currentPageTitle),1)]),L("ul",ZP,[L("li",null,[J(a,{to:"/home"},{default:te(()=>[J(o,{variant:"link"},{default:te(()=>[Ue("Home")]),_:1})]),_:1})]),L("li",null,[J(a,{to:"/contact"},{default:te(()=>[J(o,{variant:"link"},{default:te(()=>[Ue("Contact")]),_:1})]),_:1})]),L("li",null,[J(a,{to:"/portfolio"},{default:te(()=>[J(o,{variant:"link"},{default:te(()=>[Ue("Portfolio")]),_:1})]),_:1})]),L("li",null,[J(a,{to:"/websites"},{default:te(()=>[J(o,{variant:"link",class:"mr-4"},{default:te(()=>[Ue("Websites")]),_:1})]),_:1})]),L("li",null,[J(a,{to:"/login"},{default:te(()=>[J(h,null,{default:te(()=>[sn(' <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" /> '),J(u,null,{default:te(()=>[J(c,{class:"h-6 w-6"})]),_:1})]),_:1})]),_:1})])])])])])}const tx=ir(KP,[["render",ex]]);var Bg={};/**
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
 */const Ow={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const ee=function(t,e){if(!t)throw Yi(e)},Yi=function(t){return new Error("Firebase Database ("+Ow.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
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
 */const Dw=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},nx=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],a=t[n++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},of={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,a=o?t[s+1]:0,c=s+2<t.length,u=c?t[s+2]:0,h=i>>2,d=(i&3)<<4|a>>4;let p=(a&15)<<2|u>>6,g=u&63;c||(g=64,o||(p=64)),r.push(n[h],n[d],n[p],n[g])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Dw(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):nx(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const u=s<t.length?n[t.charAt(s)]:64;++s;const d=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||a==null||u==null||d==null)throw new rx;const p=i<<2|a>>4;if(r.push(p),u!==64){const g=a<<4&240|u>>2;if(r.push(g),d!==64){const v=u<<6&192|d;r.push(v)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class rx extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Mw=function(t){const e=Dw(t);return of.encodeByteArray(e,!0)},tc=function(t){return Mw(t).replace(/\./g,"")},nc=function(t){try{return of.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function sx(t){return Lw(void 0,t)}function Lw(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!ix(n)||(t[n]=Lw(t[n],e[n]));return t}function ix(t){return t!=="__proto__"}/**
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
 */function ox(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const ax=()=>ox().__FIREBASE_DEFAULTS__,lx=()=>{if(typeof process>"u"||typeof Bg>"u")return;const t=Bg.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},cx=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&nc(t[1]);return e&&JSON.parse(e)},Zc=()=>{try{return ax()||lx()||cx()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Vw=t=>{var e,n;return(n=(e=Zc())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},af=t=>{const e=Vw(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Fw=()=>{var t;return(t=Zc())===null||t===void 0?void 0:t.config},Uw=t=>{var e;return(e=Zc())===null||e===void 0?void 0:e[`_${t}`]};/**
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
 */class eu{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function $w(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[tc(JSON.stringify(n)),tc(JSON.stringify(o)),""].join(".")}/**
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
 */function jt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(jt())}function ux(){var t;const e=(t=Zc())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Bw(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function jw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function hx(){const t=jt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function qw(){return Ow.NODE_ADMIN===!0}function dx(){return!ux()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Hw(){try{return typeof indexedDB=="object"}catch{return!1}}function Ww(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}function fx(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const px="FirebaseError";class Nn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=px,Object.setPrototypeOf(this,Nn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xs.prototype.create)}}class Xs{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?mx(i,r):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new Nn(s,a,r)}}function mx(t,e){return t.replace(gx,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const gx=/\{\$([^}]+)}/g;/**
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
 */function da(t){return JSON.parse(t)}function Ot(t){return JSON.stringify(t)}/**
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
 */const zw=function(t){let e={},n={},r={},s="";try{const i=t.split(".");e=da(nc(i[0])||""),n=da(nc(i[1])||""),s=i[2],r=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:r,signature:s}},_x=function(t){const e=zw(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},yx=function(t){const e=zw(t).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function Hn(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Vs(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function zh(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function rc(t,e,n){const r={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(r[s]=e.call(n,t[s],s,t));return r}function fa(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if(jg(i)&&jg(o)){if(!fa(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function jg(t){return t!==null&&typeof t=="object"}/**
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
 */function Ji(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function xo(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function ko(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}/**
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
 */class vx{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const r=this.W_;if(typeof e=="string")for(let d=0;d<16;d++)r[d]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let d=0;d<16;d++)r[d]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let d=16;d<80;d++){const p=r[d-3]^r[d-8]^r[d-14]^r[d-16];r[d]=(p<<1|p>>>31)&4294967295}let s=this.chain_[0],i=this.chain_[1],o=this.chain_[2],a=this.chain_[3],c=this.chain_[4],u,h;for(let d=0;d<80;d++){d<40?d<20?(u=a^i&(o^a),h=1518500249):(u=i^o^a,h=1859775393):d<60?(u=i&o|a&(i|o),h=2400959708):(u=i^o^a,h=3395469782);const p=(s<<5|s>>>27)+u+c+h+r[d]&4294967295;c=a,a=o,o=(i<<30|i>>>2)&4294967295,i=s,s=p}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+i&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const r=n-this.blockSize;let s=0;const i=this.buf_;let o=this.inbuf_;for(;s<n;){if(o===0)for(;s<=r;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<n;)if(i[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(i),o=0;break}}else for(;s<n;)if(i[o]=e[s],++o,++s,o===this.blockSize){this.compress_(i),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=n&255,n/=256;this.compress_(this.buf_);let r=0;for(let s=0;s<5;s++)for(let i=24;i>=0;i-=8)e[r]=this.chain_[s]>>i&255,++r;return e}}function wx(t,e){const n=new Ex(t,e);return n.subscribe.bind(n)}class Ex{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");bx(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=sh),s.error===void 0&&(s.error=sh),s.complete===void 0&&(s.complete=sh);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function bx(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function sh(){}function Gw(t,e){return`${t} failed: ${e} argument `}/**
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
 */const Ix=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);if(s>=55296&&s<=56319){const i=s-55296;r++,ee(r<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(r)-56320;s=65536+(i<<10)+o}s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):s<65536?(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},tu=function(t){let e=0;for(let n=0;n<t.length;n++){const r=t.charCodeAt(n);r<128?e++:r<2048?e+=2:r>=55296&&r<=56319?(e+=4,n++):e+=3}return e};/**
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
 */const Tx=1e3,Cx=2,Ax=4*60*60*1e3,Sx=.5;function qg(t,e=Tx,n=Cx){const r=e*Math.pow(n,t),s=Math.round(Sx*r*(Math.random()-.5)*2);return Math.min(Ax,r+s)}/**
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
 */function yt(t){return t&&t._delegate?t._delegate:t}class wn{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Is="[DEFAULT]";/**
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
 */class Rx{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new eu;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(xx(e))try{this.getOrInitializeService({instanceIdentifier:Is})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Is){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Is){return this.instances.has(e)}getOptions(e=Is){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);r===a&&o.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Px(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Is){return this.component?this.component.multipleInstances?e:Is:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Px(t){return t===Is?void 0:t}function xx(t){return t.instantiationMode==="EAGER"}/**
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
 */class kx{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Rx(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */const Kw=[];var Me;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(Me||(Me={}));const Nx={debug:Me.DEBUG,verbose:Me.VERBOSE,info:Me.INFO,warn:Me.WARN,error:Me.ERROR,silent:Me.SILENT},Ox=Me.INFO,Dx={[Me.DEBUG]:"log",[Me.VERBOSE]:"log",[Me.INFO]:"info",[Me.WARN]:"warn",[Me.ERROR]:"error"},Mx=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=Dx[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ma{constructor(e){this.name=e,this._logLevel=Ox,this._logHandler=Mx,this._userLogHandler=null,Kw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Me))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Nx[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Me.DEBUG,...e),this._logHandler(this,Me.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Me.VERBOSE,...e),this._logHandler(this,Me.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Me.INFO,...e),this._logHandler(this,Me.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Me.WARN,...e),this._logHandler(this,Me.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Me.ERROR,...e),this._logHandler(this,Me.ERROR,...e)}}function Lx(t){Kw.forEach(e=>{e.setLogLevel(t)})}const Vx=(t,e)=>e.some(n=>t instanceof n);let Hg,Wg;function Fx(){return Hg||(Hg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ux(){return Wg||(Wg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Qw=new WeakMap,Gh=new WeakMap,Yw=new WeakMap,ih=new WeakMap,cf=new WeakMap;function $x(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(Xr(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Qw.set(n,t)}).catch(()=>{}),cf.set(e,t),e}function Bx(t){if(Gh.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Gh.set(t,e)}let Kh={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Gh.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Yw.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Xr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function jx(t){Kh=t(Kh)}function qx(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(oh(this),e,...n);return Yw.set(r,e.sort?e.sort():[e]),Xr(r)}:Ux().includes(t)?function(...e){return t.apply(oh(this),e),Xr(Qw.get(this))}:function(...e){return Xr(t.apply(oh(this),e))}}function Hx(t){return typeof t=="function"?qx(t):(t instanceof IDBTransaction&&Bx(t),Vx(t,Fx())?new Proxy(t,Kh):t)}function Xr(t){if(t instanceof IDBRequest)return $x(t);if(ih.has(t))return ih.get(t);const e=Hx(t);return e!==t&&(ih.set(t,e),cf.set(e,t)),e}const oh=t=>cf.get(t);function Jw(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),a=Xr(o);return r&&o.addEventListener("upgradeneeded",c=>{r(Xr(o.result),c.oldVersion,c.newVersion,Xr(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",u=>s(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}const Wx=["get","getKey","getAll","getAllKeys","count"],zx=["put","add","delete","clear"],ah=new Map;function zg(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ah.get(e))return ah.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=zx.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Wx.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,s?"readwrite":"readonly");let u=c.store;return r&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),s&&c.done]))[0]};return ah.set(e,i),i}jx(t=>({...t,get:(e,n,r)=>zg(e,n)||t.get(e,n,r),has:(e,n)=>!!zg(e,n)||t.has(e,n)}));/**
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
 */class Gx{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Kx(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Kx(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Qh="@firebase/app",Gg="0.10.5";/**
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
 */const Fs=new Ma("@firebase/app"),Qx="@firebase/app-compat",Yx="@firebase/analytics-compat",Jx="@firebase/analytics",Xx="@firebase/app-check-compat",Zx="@firebase/app-check",ek="@firebase/auth",tk="@firebase/auth-compat",nk="@firebase/database",rk="@firebase/database-compat",sk="@firebase/functions",ik="@firebase/functions-compat",ok="@firebase/installations",ak="@firebase/installations-compat",lk="@firebase/messaging",ck="@firebase/messaging-compat",uk="@firebase/performance",hk="@firebase/performance-compat",dk="@firebase/remote-config",fk="@firebase/remote-config-compat",pk="@firebase/storage",mk="@firebase/storage-compat",gk="@firebase/firestore",_k="@firebase/vertexai-preview",yk="@firebase/firestore-compat",vk="firebase",wk="10.12.2";/**
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
 */const Yh="[DEFAULT]",Ek={[Qh]:"fire-core",[Qx]:"fire-core-compat",[Jx]:"fire-analytics",[Yx]:"fire-analytics-compat",[Zx]:"fire-app-check",[Xx]:"fire-app-check-compat",[ek]:"fire-auth",[tk]:"fire-auth-compat",[nk]:"fire-rtdb",[rk]:"fire-rtdb-compat",[sk]:"fire-fn",[ik]:"fire-fn-compat",[ok]:"fire-iid",[ak]:"fire-iid-compat",[lk]:"fire-fcm",[ck]:"fire-fcm-compat",[uk]:"fire-perf",[hk]:"fire-perf-compat",[dk]:"fire-rc",[fk]:"fire-rc-compat",[pk]:"fire-gcs",[mk]:"fire-gcs-compat",[gk]:"fire-fst",[yk]:"fire-fst-compat",[_k]:"fire-vertex","fire-js":"fire-js",[vk]:"fire-js-all"};/**
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
 */const sc=new Map,bk=new Map,Jh=new Map;function Kg(t,e){try{t.container.addComponent(e)}catch(n){Fs.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Pn(t){const e=t.name;if(Jh.has(e))return Fs.debug(`There were multiple attempts to register component ${e}.`),!1;Jh.set(e,t);for(const n of sc.values())Kg(n,t);for(const n of bk.values())Kg(n,t);return!0}function Ar(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Kn(t){return t.settings!==void 0}/**
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
 */const Ik={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Zr=new Xs("app","Firebase",Ik);/**
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
 */class Tk{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new wn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Zr.create("app-deleted",{appName:this._name})}}/**
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
 */const Zs=wk;function Xw(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Yh,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw Zr.create("bad-app-name",{appName:String(s)});if(n||(n=Fw()),!n)throw Zr.create("no-options");const i=sc.get(s);if(i){if(fa(n,i.options)&&fa(r,i.config))return i;throw Zr.create("duplicate-app",{appName:s})}const o=new kx(s);for(const c of Jh.values())o.addComponent(c);const a=new Tk(n,r,o);return sc.set(s,a),a}function La(t=Yh){const e=sc.get(t);if(!e&&t===Yh&&Fw())return Xw();if(!e)throw Zr.create("no-app",{appName:t});return e}function Yt(t,e,n){var r;let s=(r=Ek[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const a=[`Unable to register library "${s}" with version "${e}":`];i&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Fs.warn(a.join(" "));return}Pn(new wn(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}function Ck(t){Lx(t)}/**
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
 */const Ak="firebase-heartbeat-database",Sk=1,pa="firebase-heartbeat-store";let lh=null;function Zw(){return lh||(lh=Jw(Ak,Sk,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(pa)}catch(n){console.warn(n)}}}}).catch(t=>{throw Zr.create("idb-open",{originalErrorMessage:t.message})})),lh}async function Rk(t){try{const n=(await Zw()).transaction(pa),r=await n.objectStore(pa).get(e0(t));return await n.done,r}catch(e){if(e instanceof Nn)Fs.warn(e.message);else{const n=Zr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Fs.warn(n.message)}}}async function Qg(t,e){try{const r=(await Zw()).transaction(pa,"readwrite");await r.objectStore(pa).put(e,e0(t)),await r.done}catch(n){if(n instanceof Nn)Fs.warn(n.message);else{const r=Zr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Fs.warn(r.message)}}}function e0(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Pk=1024,xk=30*24*60*60*1e3;class kk{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Ok(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Yg();if(!(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)))return this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=xk}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Yg(),{heartbeatsToSend:r,unsentEntries:s}=Nk(this._heartbeatsCache.heartbeats),i=tc(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function Yg(){return new Date().toISOString().substring(0,10)}function Nk(t,e=Pk){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Jg(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Jg(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Ok{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Hw()?Ww().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Rk(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Qg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Qg(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Jg(t){return tc(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function Dk(t){Pn(new wn("platform-logger",e=>new Gx(e),"PRIVATE")),Pn(new wn("heartbeat",e=>new kk(e),"PRIVATE")),Yt(Qh,Gg,t),Yt(Qh,Gg,"esm2017"),Yt("fire-js","")}Dk("");var Xg={};const Zg="@firebase/database",e_="1.0.5";/**
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
 */let t0="";function Mk(t){t0=t}/**
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
 */class Lk{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Ot(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:da(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class Vk{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return Hn(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const n0=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Lk(e)}}catch{}return new Vk},Ps=n0("localStorage"),Fk=n0("sessionStorage");/**
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
 */const Ci=new Ma("@firebase/database"),r0=function(){let t=1;return function(){return t++}}(),s0=function(t){const e=Ix(t),n=new vx;n.update(e);const r=n.digest();return of.encodeByteArray(r)},Va=function(...t){let e="";for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)||r&&typeof r=="object"&&typeof r.length=="number"?e+=Va.apply(null,r):typeof r=="object"?e+=Ot(r):e+=r,e+=" "}return e};let zo=null,t_=!0;const Uk=function(t,e){ee(!e,"Can't turn on custom loggers persistently."),Ci.logLevel=Me.VERBOSE,zo=Ci.log.bind(Ci)},Gt=function(...t){if(t_===!0&&(t_=!1,zo===null&&Fk.get("logging_enabled")===!0&&Uk()),zo){const e=Va.apply(null,t);zo(e)}},Fa=function(t){return function(...e){Gt(t,...e)}},Xh=function(...t){const e="FIREBASE INTERNAL ERROR: "+Va(...t);Ci.error(e)},Er=function(...t){const e=`FIREBASE FATAL ERROR: ${Va(...t)}`;throw Ci.error(e),new Error(e)},yn=function(...t){const e="FIREBASE WARNING: "+Va(...t);Ci.warn(e)},$k=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&yn("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},uf=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},Bk=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},Li="[MIN_NAME]",Us="[MAX_NAME]",Xi=function(t,e){if(t===e)return 0;if(t===Li||e===Us)return-1;if(e===Li||t===Us)return 1;{const n=n_(t),r=n_(e);return n!==null?r!==null?n-r===0?t.length-e.length:n-r:-1:r!==null?1:t<e?-1:1}},jk=function(t,e){return t===e?0:t<e?-1:1},To=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+Ot(e))},hf=function(t){if(typeof t!="object"||t===null)return Ot(t);const e=[];for(const r in t)e.push(r);e.sort();let n="{";for(let r=0;r<e.length;r++)r!==0&&(n+=","),n+=Ot(e[r]),n+=":",n+=hf(t[e[r]]);return n+="}",n},i0=function(t,e){const n=t.length;if(n<=e)return[t];const r=[];for(let s=0;s<n;s+=e)s+e>n?r.push(t.substring(s,n)):r.push(t.substring(s,s+e));return r};function hn(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const o0=function(t){ee(!uf(t),"Invalid JSON number");const e=11,n=52,r=(1<<e-1)-1;let s,i,o,a,c;t===0?(i=0,o=0,s=1/t===-1/0?1:0):(s=t<0,t=Math.abs(t),t>=Math.pow(2,1-r)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),r),i=a+r,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(i=0,o=Math.round(t/Math.pow(2,1-r-n))));const u=[];for(c=n;c;c-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)u.push(i%2?1:0),i=Math.floor(i/2);u.push(s?1:0),u.reverse();const h=u.join("");let d="";for(c=0;c<64;c+=8){let p=parseInt(h.substr(c,8),2).toString(16);p.length===1&&(p="0"+p),d=d+p}return d.toLowerCase()},qk=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Hk=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Wk(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const r=new Error(t+" at "+e._path.toString()+": "+n);return r.code=t.toUpperCase(),r}const zk=new RegExp("^-?(0*)\\d{1,10}$"),Gk=-2147483648,Kk=2147483647,n_=function(t){if(zk.test(t)){const e=Number(t);if(e>=Gk&&e<=Kk)return e}return null},Ua=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw yn("Exception was thrown by user callback.",n),e},Math.floor(0))}},Qk=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Go=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
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
 */class Yk{constructor(e,n){this.appName_=e,this.appCheckProvider=n,this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(r=>this.appCheck=r)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((n,r)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(r=>r.addTokenListener(e))}notifyForInvalidToken(){yn(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
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
 */class Jk{constructor(e,n,r){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=r,this.auth_=null,this.auth_=r.getImmediate({optional:!0}),this.auth_||r.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(Gt("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,r)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',yn(e)}}class Fl{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Fl.OWNER="owner";/**
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
 */const df="5",a0="v",l0="s",c0="r",u0="f",h0=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,d0="ls",f0="p",Zh="ac",p0="websocket",m0="long_polling";/**
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
 */class g0{constructor(e,n,r,s,i=!1,o="",a=!1,c=!1){this.secure=n,this.namespace=r,this.webSocketOnly=s,this.nodeAdmin=i,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Ps.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Ps.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function Xk(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function _0(t,e,n){ee(typeof e=="string","typeof type must == string"),ee(typeof n=="object","typeof params must == object");let r;if(e===p0)r=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===m0)r=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Xk(t)&&(n.ns=t.namespace);const s=[];return hn(n,(i,o)=>{s.push(i+"="+o)}),r+s.join("&")}/**
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
 */class Zk{constructor(){this.counters_={}}incrementCounter(e,n=1){Hn(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return sx(this.counters_)}}/**
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
 */const ch={},uh={};function ff(t){const e=t.toString();return ch[e]||(ch[e]=new Zk),ch[e]}function eN(t,e){const n=t.toString();return uh[n]||(uh[n]=e()),uh[n]}/**
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
 */class tN{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const r=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<r.length;++s)r[s]&&Ua(()=>{this.onMessage_(r[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const r_="start",nN="close",rN="pLPCommand",sN="pRTLPCB",y0="id",v0="pw",w0="ser",iN="cb",oN="seg",aN="ts",lN="d",cN="dframe",E0=1870,b0=30,uN=E0-b0,hN=25e3,dN=3e4;class wi{constructor(e,n,r,s,i,o,a){this.connId=e,this.repoInfo=n,this.applicationId=r,this.appCheckToken=s,this.authToken=i,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Fa(e),this.stats_=ff(n),this.urlFn=c=>(this.appCheckToken&&(c[Zh]=this.appCheckToken),_0(n,m0,c))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new tN(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(dN)),Bk(()=>{if(this.isClosed_)return;this.scriptTagHolder=new pf((...i)=>{const[o,a,c,u,h]=i;if(this.incrementIncomingBytes_(i),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===r_)this.id=a,this.password=c;else if(o===nN)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...i)=>{const[o,a]=i;this.incrementIncomingBytes_(i),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const r={};r[r_]="t",r[w0]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(r[iN]=this.scriptTagHolder.uniqueCallbackIdentifier),r[a0]=df,this.transportSessionId&&(r[l0]=this.transportSessionId),this.lastSessionId&&(r[d0]=this.lastSessionId),this.applicationId&&(r[f0]=this.applicationId),this.appCheckToken&&(r[Zh]=this.appCheckToken),typeof location<"u"&&location.hostname&&h0.test(location.hostname)&&(r[c0]=u0);const s=this.urlFn(r);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){wi.forceAllow_=!0}static forceDisallow(){wi.forceDisallow_=!0}static isAvailable(){return wi.forceAllow_?!0:!wi.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!qk()&&!Hk()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=Ot(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=Mw(n),s=i0(r,uN);for(let i=0;i<s.length;i++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[i]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const r={};r[cN]="t",r[y0]=e,r[v0]=n,this.myDisconnFrame.src=this.urlFn(r),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=Ot(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class pf{constructor(e,n,r,s){this.onDisconnect=r,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=r0(),window[rN+this.uniqueCallbackIdentifier]=e,window[sN+this.uniqueCallbackIdentifier]=n,this.myIFrame=pf.createIFrame_();let i="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(i='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+i+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){Gt("frame writing exception"),a.stack&&Gt(a.stack),Gt(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Gt("No IE domain setting required")}catch{const r=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+r+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[y0]=this.myID,e[v0]=this.myPW,e[w0]=this.currentSerial;let n=this.urlFn(e),r="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+b0+r.length<=E0;){const o=this.pendingSegs.shift();r=r+"&"+oN+s+"="+o.seg+"&"+aN+s+"="+o.ts+"&"+lN+s+"="+o.d,s++}return n=n+r,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,r){this.pendingSegs.push({seg:e,ts:n,d:r}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const r=()=>{this.outstandingRequests.delete(n),this.newRequest_()},s=setTimeout(r,Math.floor(hN)),i=()=>{clearTimeout(s),r()};this.addTag(e,i)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const r=this.myIFrame.doc.createElement("script");r.type="text/javascript",r.async=!0,r.src=e,r.onload=r.onreadystatechange=function(){const s=r.readyState;(!s||s==="loaded"||s==="complete")&&(r.onload=r.onreadystatechange=null,r.parentNode&&r.parentNode.removeChild(r),n())},r.onerror=()=>{Gt("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(r)}catch{}},Math.floor(1))}}/**
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
 */const fN=16384,pN=45e3;let ic=null;typeof MozWebSocket<"u"?ic=MozWebSocket:typeof WebSocket<"u"&&(ic=WebSocket);class Mn{constructor(e,n,r,s,i,o,a){this.connId=e,this.applicationId=r,this.appCheckToken=s,this.authToken=i,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Fa(this.connId),this.stats_=ff(n),this.connURL=Mn.connectionURL_(n,o,a,s,r),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,r,s,i){const o={};return o[a0]=df,typeof location<"u"&&location.hostname&&h0.test(location.hostname)&&(o[c0]=u0),n&&(o[l0]=n),r&&(o[d0]=r),s&&(o[Zh]=s),i&&(o[f0]=i),_0(e,p0,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Ps.set("previous_websocket_failure",!0);try{let r;qw(),this.mySock=new ic(this.connURL,[],r)}catch(r){this.log_("Error instantiating WebSocket.");const s=r.message||r.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=r=>{this.handleIncomingFrame(r)},this.mySock.onerror=r=>{this.log_("WebSocket error.  Closing connection.");const s=r.message||r.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){Mn.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,r=navigator.userAgent.match(n);r&&r.length>1&&parseFloat(r[1])<4.4&&(e=!0)}return!e&&ic!==null&&!Mn.forceDisallow_}static previouslyFailed(){return Ps.isInMemoryStorage||Ps.get("previous_websocket_failure")===!0}markConnectionHealthy(){Ps.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const r=da(n);this.onMessage(r)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(ee(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const r=this.extractFrameCount_(n);r!==null&&this.appendFrame_(r)}}send(e){this.resetKeepAlive();const n=Ot(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=i0(n,fN);r.length>1&&this.sendString_(String(r.length));for(let s=0;s<r.length;s++)this.sendString_(r[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(pN))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Mn.responsesRequiredToBeHealthy=2;Mn.healthyTimeout=3e4;/**
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
 */class ma{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[wi,Mn]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const n=Mn&&Mn.isAvailable();let r=n&&!Mn.previouslyFailed();if(e.webSocketOnly&&(n||yn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),r=!0),r)this.transports_=[Mn];else{const s=this.transports_=[];for(const i of ma.ALL_TRANSPORTS)i&&i.isAvailable()&&s.push(i);ma.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}ma.globalTransportInitialized_=!1;/**
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
 */const mN=6e4,gN=5e3,_N=10*1024,yN=100*1024,hh="t",s_="d",vN="s",i_="r",wN="e",o_="o",a_="a",l_="n",c_="p",EN="h";class bN{constructor(e,n,r,s,i,o,a,c,u,h){this.id=e,this.repoInfo_=n,this.applicationId_=r,this.appCheckToken_=s,this.authToken_=i,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=c,this.onKill_=u,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Fa("c:"+this.id+":"),this.transportManager_=new ma(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),r=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,r)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=Go(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>yN?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>_N?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(hh in e){const n=e[hh];n===a_?this.upgradeIfSecondaryHealthy_():n===i_?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===o_&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=To("t",e),r=To("d",e);if(n==="c")this.onSecondaryControl_(r);else if(n==="d")this.pendingDataMessages.push(r);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:c_,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:a_,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:l_,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=To("t",e),r=To("d",e);n==="c"?this.onControl_(r):n==="d"&&this.onDataMessage_(r)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=To(hh,e);if(s_ in e){const r=e[s_];if(n===EN){const s=Object.assign({},r);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(n===l_){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===vN?this.onConnectionShutdown_(r):n===i_?this.onReset_(r):n===wN?Xh("Server Error: "+r):n===o_?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Xh("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,r=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),df!==r&&yn("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),r=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,r),Go(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(mN))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Go(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(gN))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:c_,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Ps.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class I0{put(e,n,r,s){}merge(e,n,r,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,r){}onDisconnectMerge(e,n,r){}onDisconnectCancel(e,n){}reportStats(e){}}/**
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
 */class T0{constructor(e){this.allowedEvents_=e,this.listeners_={},ee(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const r=[...this.listeners_[e]];for(let s=0;s<r.length;s++)r[s].callback.apply(r[s].context,n)}}on(e,n,r){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:r});const s=this.getInitialEvent(e);s&&n.apply(r,s)}off(e,n,r){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let i=0;i<s.length;i++)if(s[i].callback===n&&(!r||r===s[i].context)){s.splice(i,1);return}}validateEventType_(e){ee(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
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
 */class oc extends T0{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!lf()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new oc}getInitialEvent(e){return ee(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const u_=32,h_=768;class Ze{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let r=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[r]=this.pieces_[s],r++);this.pieces_.length=r,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function ze(){return new Ze("")}function Ne(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function is(t){return t.pieces_.length-t.pieceNum_}function tt(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new Ze(t.pieces_,e)}function C0(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function IN(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function A0(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function S0(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new Ze(e,0)}function At(t,e){const n=[];for(let r=t.pieceNum_;r<t.pieces_.length;r++)n.push(t.pieces_[r]);if(e instanceof Ze)for(let r=e.pieceNum_;r<e.pieces_.length;r++)n.push(e.pieces_[r]);else{const r=e.split("/");for(let s=0;s<r.length;s++)r[s].length>0&&n.push(r[s])}return new Ze(n,0)}function De(t){return t.pieceNum_>=t.pieces_.length}function an(t,e){const n=Ne(t),r=Ne(e);if(n===null)return e;if(n===r)return an(tt(t),tt(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function mf(t,e){if(is(t)!==is(e))return!1;for(let n=t.pieceNum_,r=e.pieceNum_;n<=t.pieces_.length;n++,r++)if(t.pieces_[n]!==e.pieces_[r])return!1;return!0}function Vn(t,e){let n=t.pieceNum_,r=e.pieceNum_;if(is(t)>is(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[r])return!1;++n,++r}return!0}class TN{constructor(e,n){this.errorPrefix_=n,this.parts_=A0(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let r=0;r<this.parts_.length;r++)this.byteLength_+=tu(this.parts_[r]);R0(this)}}function CN(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=tu(e),R0(t)}function AN(t){const e=t.parts_.pop();t.byteLength_-=tu(e),t.parts_.length>0&&(t.byteLength_-=1)}function R0(t){if(t.byteLength_>h_)throw new Error(t.errorPrefix_+"has a key path longer than "+h_+" bytes ("+t.byteLength_+").");if(t.parts_.length>u_)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+u_+") or object contains a cycle "+Ts(t))}function Ts(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
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
 */class gf extends T0{constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const r=!document[e];r!==this.visible_&&(this.visible_=r,this.trigger("visible",r))},!1)}static getInstance(){return new gf}getInitialEvent(e){return ee(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const Co=1e3,SN=60*5*1e3,d_=30*1e3,RN=1.3,PN=3e4,xN="server_kill",f_=3;class _r extends I0{constructor(e,n,r,s,i,o,a,c){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=r,this.onConnectStatus_=s,this.onServerInfoUpdate_=i,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=c,this.id=_r.nextPersistentConnectionId_++,this.log_=Fa("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Co,this.maxReconnectDelay_=SN,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c&&!qw())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");gf.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&oc.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,r){const s=++this.requestNumber_,i={r:s,a:e,b:n};this.log_(Ot(i)),ee(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(i),r&&(this.requestCBHash_[s]=r)}get(e){this.initConnection_();const n=new eu,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(i),n.promise}listen(e,n,r,s){this.initConnection_();const i=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+i),this.listens.has(o)||this.listens.set(o,new Map),ee(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),ee(!this.listens.get(o).has(i),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:n,query:e,tag:r};this.listens.get(o).set(i,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,r=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(r)})}sendListen_(e){const n=e.query,r=n._path.toString(),s=n._queryIdentifier;this.log_("Listen on "+r+" for "+s);const i={p:r},o="q";e.tag&&(i.q=n._queryObject,i.t=e.tag),i.h=e.hashFn(),this.sendRequest(o,i,a=>{const c=a.d,u=a.s;_r.warnOnListenWarnings_(c,n),(this.listens.get(r)&&this.listens.get(r).get(s))===e&&(this.log_("listen response",a),u!=="ok"&&this.removeListen_(r,s),e.onComplete&&e.onComplete(u,c))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&Hn(e,"w")){const r=Vs(e,"w");if(Array.isArray(r)&&~r.indexOf("no_index")){const s='".indexOn": "'+n._queryParams.getIndex().toString()+'"',i=n._path.toString();yn(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${i} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||yx(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=d_)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=_x(e)?"auth":"gauth",r={cred:e};this.authOverride_===null?r.noauth=!0:typeof this.authOverride_=="object"&&(r.authvar=this.authOverride_),this.sendRequest(n,r,s=>{const i=s.s,o=s.d||"error";this.authToken_===e&&(i==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(i,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,r=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,r)})}unlisten(e,n){const r=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+r+" "+s),ee(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(r,s)&&this.connected_&&this.sendUnlisten_(r,s,e._queryObject,n)}sendUnlisten_(e,n,r,s){this.log_("Unlisten on "+e+" for "+n);const i={p:e},o="n";s&&(i.q=r,i.t=s),this.sendRequest(o,i)}onDisconnectPut(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:r})}onDisconnectMerge(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:r})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,r,s){const i={p:n,d:r};this.log_("onDisconnect "+e,i),this.sendRequest(e,i,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,n,r,s){this.putInternal("p",e,n,r,s)}merge(e,n,r,s){this.putInternal("m",e,n,r,s)}putInternal(e,n,r,s,i){this.initConnection_();const o={p:n,d:r};i!==void 0&&(o.h=i),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,r=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,r,i=>{this.log_(n+" response",i),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(i.s,i.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,r=>{if(r.s!=="ok"){const i=r.d;this.log_("reportStats","Error sending stats: "+i)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Ot(e));const n=e.r,r=this.requestCBHash_[n];r&&(delete this.requestCBHash_[n],r(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Xh("Unrecognized action received from server: "+Ot(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){ee(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Co,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Co,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>PN&&(this.reconnectDelay_=Co),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*RN)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),r=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+_r.nextConnectionId_++,i=this.lastSessionId;let o=!1,a=null;const c=function(){a?a.close():(o=!0,r())},u=function(d){ee(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(d)};this.realtime_={close:c,sendRequest:u};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[d,p]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?Gt("getToken() completed but was canceled"):(Gt("getToken() completed. Creating connection."),this.authToken_=d&&d.accessToken,this.appCheckToken_=p&&p.token,a=new bN(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,r,g=>{yn(g+" ("+this.repoInfo_.toString()+")"),this.interrupt(xN)},i))}catch(d){this.log_("Failed to get token: "+d),o||(this.repoInfo_.nodeAdmin&&yn(d),c())}}}interrupt(e){Gt("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Gt("Resuming connection for reason: "+e),delete this.interruptReasons_[e],zh(this.interruptReasons_)&&(this.reconnectDelay_=Co,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let r;n?r=n.map(i=>hf(i)).join("$"):r="default";const s=this.removeListen_(e,r);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,n){const r=new Ze(e).toString();let s;if(this.listens.has(r)){const i=this.listens.get(r);s=i.get(n),i.delete(n),i.size===0&&this.listens.delete(r)}else s=void 0;return s}onAuthRevoked_(e,n){Gt("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=f_&&(this.reconnectDelay_=d_,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){Gt("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=f_&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+t0.replace(/\./g,"-")]=1,lf()?e["framework.cordova"]=1:jw()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=oc.getInstance().currentlyOnline();return zh(this.interruptReasons_)&&e}}_r.nextPersistentConnectionId_=0;_r.nextConnectionId_=0;/**
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
 */class Oe{constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new Oe(e,n)}}/**
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
 */class nu{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const r=new Oe(Li,e),s=new Oe(Li,n);return this.compare(r,s)!==0}minPost(){return Oe.MIN}}/**
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
 */let Cl;class P0 extends nu{static get __EMPTY_NODE(){return Cl}static set __EMPTY_NODE(e){Cl=e}compare(e,n){return Xi(e.name,n.name)}isDefinedOn(e){throw Yi("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return Oe.MIN}maxPost(){return new Oe(Us,Cl)}makePost(e,n){return ee(typeof e=="string","KeyIndex indexValue must always be a string."),new Oe(e,Cl)}toString(){return".key"}}const Ai=new P0;/**
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
 */let Al=class{constructor(e,n,r,s,i=null){this.isReverse_=s,this.resultGenerator_=i,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?r(e.key,n):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},mn=class No{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??No.RED,this.left=s??Qn.EMPTY_NODE,this.right=i??Qn.EMPTY_NODE}copy(e,n,r,s,i){return new No(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return i<0?s=s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s=s.copy(null,n,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return Qn.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let r,s;if(r=this,n(e,r.key)<0)!r.left.isEmpty()&&!r.left.isRed_()&&!r.left.left.isRed_()&&(r=r.moveRedLeft_()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed_()&&(r=r.rotateRight_()),!r.right.isEmpty()&&!r.right.isRed_()&&!r.right.left.isRed_()&&(r=r.moveRedRight_()),n(e,r.key)===0){if(r.right.isEmpty())return Qn.EMPTY_NODE;s=r.right.min_(),r=r.copy(s.key,s.value,null,null,r.right.removeMin_())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,No.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,No.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};mn.RED=!0;mn.BLACK=!1;class kN{copy(e,n,r,s,i){return this}insert(e,n,r){return new mn(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let Qn=class Ul{constructor(e,n=Ul.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new Ul(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,mn.BLACK,null,null))}remove(e){return new Ul(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,mn.BLACK,null,null))}get(e){let n,r=this.root_;for(;!r.isEmpty();){if(n=this.comparator_(e,r.key),n===0)return r.value;n<0?r=r.left:n>0&&(r=r.right)}return null}getPredecessorKey(e){let n,r=this.root_,s=null;for(;!r.isEmpty();)if(n=this.comparator_(e,r.key),n===0){if(r.left.isEmpty())return s?s.key:null;for(r=r.left;!r.right.isEmpty();)r=r.right;return r.key}else n<0?r=r.left:n>0&&(s=r,r=r.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Al(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new Al(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new Al(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new Al(this.root_,null,this.comparator_,!0,e)}};Qn.EMPTY_NODE=new kN;/**
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
 */function NN(t,e){return Xi(t.name,e.name)}function _f(t,e){return Xi(t,e)}/**
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
 */let ed;function ON(t){ed=t}const x0=function(t){return typeof t=="number"?"number:"+o0(t):"string:"+t},k0=function(t){if(t.isLeafNode()){const e=t.val();ee(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Hn(e,".sv"),"Priority must be a string or number.")}else ee(t===ed||t.isEmpty(),"priority of unexpected type.");ee(t===ed||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let p_;class kt{constructor(e,n=kt.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,ee(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),k0(this.priorityNode_)}static set __childrenNodeConstructor(e){p_=e}static get __childrenNodeConstructor(){return p_}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new kt(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:kt.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return De(e)?this:Ne(e)===".priority"?this.priorityNode_:kt.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:kt.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const r=Ne(e);return r===null?n:n.isEmpty()&&r!==".priority"?this:(ee(r!==".priority"||is(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(r,kt.__childrenNodeConstructor.EMPTY_NODE.updateChild(tt(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+x0(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=o0(this.value_):e+=this.value_,this.lazyHash_=s0(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===kt.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof kt.__childrenNodeConstructor?-1:(ee(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,r=typeof this.value_,s=kt.VALUE_TYPE_ORDER.indexOf(n),i=kt.VALUE_TYPE_ORDER.indexOf(r);return ee(s>=0,"Unknown leaf type: "+n),ee(i>=0,"Unknown leaf type: "+r),s===i?r==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:i-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}kt.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let N0,O0;function DN(t){N0=t}function MN(t){O0=t}class LN extends nu{compare(e,n){const r=e.node.getPriority(),s=n.node.getPriority(),i=r.compareTo(s);return i===0?Xi(e.name,n.name):i}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return Oe.MIN}maxPost(){return new Oe(Us,new kt("[PRIORITY-POST]",O0))}makePost(e,n){const r=N0(e);return new Oe(n,new kt("[PRIORITY-POST]",r))}toString(){return".priority"}}const dt=new LN;/**
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
 */const VN=Math.log(2);class FN{constructor(e){const n=i=>parseInt(Math.log(i)/VN,10),r=i=>parseInt(Array(i+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const s=r(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const ac=function(t,e,n,r){t.sort(e);const s=function(c,u){const h=u-c;let d,p;if(h===0)return null;if(h===1)return d=t[c],p=n?n(d):d,new mn(p,d.node,mn.BLACK,null,null);{const g=parseInt(h/2,10)+c,v=s(c,g),S=s(g+1,u);return d=t[g],p=n?n(d):d,new mn(p,d.node,mn.BLACK,v,S)}},i=function(c){let u=null,h=null,d=t.length;const p=function(v,S){const P=d-v,M=d;d-=v;const F=s(P+1,M),U=t[P],N=n?n(U):U;g(new mn(N,U.node,S,null,F))},g=function(v){u?(u.left=v,u=v):(h=v,u=v)};for(let v=0;v<c.count;++v){const S=c.nextBitIsOne(),P=Math.pow(2,c.count-(v+1));S?p(P,mn.BLACK):(p(P,mn.BLACK),p(P,mn.RED))}return h},o=new FN(t.length),a=i(o);return new Qn(r||e,a)};/**
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
 */let dh;const fi={};class dr{constructor(e,n){this.indexes_=e,this.indexSet_=n}static get Default(){return ee(fi&&dt,"ChildrenNode.ts has not been loaded"),dh=dh||new dr({".priority":fi},{".priority":dt}),dh}get(e){const n=Vs(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof Qn?n:null}hasIndex(e){return Hn(this.indexSet_,e.toString())}addIndex(e,n){ee(e!==Ai,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const r=[];let s=!1;const i=n.getIterator(Oe.Wrap);let o=i.getNext();for(;o;)s=s||e.isDefinedOn(o.node),r.push(o),o=i.getNext();let a;s?a=ac(r,e.getCompare()):a=fi;const c=e.toString(),u=Object.assign({},this.indexSet_);u[c]=e;const h=Object.assign({},this.indexes_);return h[c]=a,new dr(h,u)}addToIndexes(e,n){const r=rc(this.indexes_,(s,i)=>{const o=Vs(this.indexSet_,i);if(ee(o,"Missing index implementation for "+i),s===fi)if(o.isDefinedOn(e.node)){const a=[],c=n.getIterator(Oe.Wrap);let u=c.getNext();for(;u;)u.name!==e.name&&a.push(u),u=c.getNext();return a.push(e),ac(a,o.getCompare())}else return fi;else{const a=n.get(e.name);let c=s;return a&&(c=c.remove(new Oe(e.name,a))),c.insert(e,e.node)}});return new dr(r,this.indexSet_)}removeFromIndexes(e,n){const r=rc(this.indexes_,s=>{if(s===fi)return s;{const i=n.get(e.name);return i?s.remove(new Oe(e.name,i)):s}});return new dr(r,this.indexSet_)}}/**
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
 */let Ao;class _e{constructor(e,n,r){this.children_=e,this.priorityNode_=n,this.indexMap_=r,this.lazyHash_=null,this.priorityNode_&&k0(this.priorityNode_),this.children_.isEmpty()&&ee(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return Ao||(Ao=new _e(new Qn(_f),null,dr.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Ao}updatePriority(e){return this.children_.isEmpty()?this:new _e(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?Ao:n}}getChild(e){const n=Ne(e);return n===null?this:this.getImmediateChild(n).getChild(tt(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(ee(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const r=new Oe(e,n);let s,i;n.isEmpty()?(s=this.children_.remove(e),i=this.indexMap_.removeFromIndexes(r,this.children_)):(s=this.children_.insert(e,n),i=this.indexMap_.addToIndexes(r,this.children_));const o=s.isEmpty()?Ao:this.priorityNode_;return new _e(s,o,i)}}updateChild(e,n){const r=Ne(e);if(r===null)return n;{ee(Ne(e)!==".priority"||is(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(r).updateChild(tt(e),n);return this.updateImmediateChild(r,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let r=0,s=0,i=!0;if(this.forEachChild(dt,(o,a)=>{n[o]=a.val(e),r++,i&&_e.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):i=!1}),!e&&i&&s<2*r){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+x0(this.getPriority().val())+":"),this.forEachChild(dt,(n,r)=>{const s=r.hash();s!==""&&(e+=":"+n+":"+s)}),this.lazyHash_=e===""?"":s0(e)}return this.lazyHash_}getPredecessorChildName(e,n,r){const s=this.resolveIndex_(r);if(s){const i=s.getPredecessorKey(new Oe(e,n));return i?i.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.minKey();return r&&r.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new Oe(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.maxKey();return r&&r.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new Oe(n,this.children_.get(n)):null}forEachChild(e,n){const r=this.resolveIndex_(e);return r?r.inorderTraversal(s=>n(s.name,s.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,Oe.Wrap);let i=s.peek();for(;i!=null&&n.compare(i,e)<0;)s.getNext(),i=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,Oe.Wrap);let i=s.peek();for(;i!=null&&n.compare(i,e)>0;)s.getNext(),i=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===$a?-1:0}withIndex(e){if(e===Ai||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new _e(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===Ai||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const r=this.getIterator(dt),s=n.getIterator(dt);let i=r.getNext(),o=s.getNext();for(;i&&o;){if(i.name!==o.name||!i.node.equals(o.node))return!1;i=r.getNext(),o=s.getNext()}return i===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Ai?null:this.indexMap_.get(e.toString())}}_e.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class UN extends _e{constructor(){super(new Qn(_f),_e.EMPTY_NODE,dr.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return _e.EMPTY_NODE}isEmpty(){return!1}}const $a=new UN;Object.defineProperties(Oe,{MIN:{value:new Oe(Li,_e.EMPTY_NODE)},MAX:{value:new Oe(Us,$a)}});P0.__EMPTY_NODE=_e.EMPTY_NODE;kt.__childrenNodeConstructor=_e;ON($a);MN($a);/**
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
 */const $N=!0;function Ft(t,e=null){if(t===null)return _e.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),ee(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new kt(n,Ft(e))}if(!(t instanceof Array)&&$N){const n=[];let r=!1;if(hn(t,(o,a)=>{if(o.substring(0,1)!=="."){const c=Ft(a);c.isEmpty()||(r=r||!c.getPriority().isEmpty(),n.push(new Oe(o,c)))}}),n.length===0)return _e.EMPTY_NODE;const i=ac(n,NN,o=>o.name,_f);if(r){const o=ac(n,dt.getCompare());return new _e(i,Ft(e),new dr({".priority":o},{".priority":dt}))}else return new _e(i,Ft(e),dr.Default)}else{let n=_e.EMPTY_NODE;return hn(t,(r,s)=>{if(Hn(t,r)&&r.substring(0,1)!=="."){const i=Ft(s);(i.isLeafNode()||!i.isEmpty())&&(n=n.updateImmediateChild(r,i))}}),n.updatePriority(Ft(e))}}DN(Ft);/**
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
 */class BN extends nu{constructor(e){super(),this.indexPath_=e,ee(!De(e)&&Ne(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const r=this.extractChild(e.node),s=this.extractChild(n.node),i=r.compareTo(s);return i===0?Xi(e.name,n.name):i}makePost(e,n){const r=Ft(e),s=_e.EMPTY_NODE.updateChild(this.indexPath_,r);return new Oe(n,s)}maxPost(){const e=_e.EMPTY_NODE.updateChild(this.indexPath_,$a);return new Oe(Us,e)}toString(){return A0(this.indexPath_,0).join("/")}}/**
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
 */class jN extends nu{compare(e,n){const r=e.node.compareTo(n.node);return r===0?Xi(e.name,n.name):r}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return Oe.MIN}maxPost(){return Oe.MAX}makePost(e,n){const r=Ft(e);return new Oe(n,r)}toString(){return".value"}}const qN=new jN;/**
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
 */function D0(t){return{type:"value",snapshotNode:t}}function Vi(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function ga(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function _a(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function HN(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
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
 */class yf{constructor(e){this.index_=e}updateChild(e,n,r,s,i,o){ee(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(s).equals(r.getChild(s))&&a.isEmpty()===r.isEmpty()||(o!=null&&(r.isEmpty()?e.hasChild(n)?o.trackChildChange(ga(n,a)):ee(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Vi(n,r)):o.trackChildChange(_a(n,r,a))),e.isLeafNode()&&r.isEmpty())?e:e.updateImmediateChild(n,r).withIndex(this.index_)}updateFullNode(e,n,r){return r!=null&&(e.isLeafNode()||e.forEachChild(dt,(s,i)=>{n.hasChild(s)||r.trackChildChange(ga(s,i))}),n.isLeafNode()||n.forEachChild(dt,(s,i)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(i)||r.trackChildChange(_a(s,i,o))}else r.trackChildChange(Vi(s,i))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?_e.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class ya{constructor(e){this.indexedFilter_=new yf(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ya.getStartPost_(e),this.endPost_=ya.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,r=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&r}updateChild(e,n,r,s,i,o){return this.matches(new Oe(n,r))||(r=_e.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,r,s,i,o)}updateFullNode(e,n,r){n.isLeafNode()&&(n=_e.EMPTY_NODE);let s=n.withIndex(this.index_);s=s.updatePriority(_e.EMPTY_NODE);const i=this;return n.forEachChild(dt,(o,a)=>{i.matches(new Oe(o,a))||(s=s.updateImmediateChild(o,_e.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
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
 */class WN{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const r=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?r<=0:r<0},this.withinEndPost=n=>{const r=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?r<=0:r<0},this.rangedFilter_=new ya(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,r,s,i,o){return this.rangedFilter_.matches(new Oe(n,r))||(r=_e.EMPTY_NODE),e.getImmediateChild(n).equals(r)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,r,s,i,o):this.fullLimitUpdateChild_(e,n,r,i,o)}updateFullNode(e,n,r){let s;if(n.isLeafNode()||n.isEmpty())s=_e.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){s=_e.EMPTY_NODE.withIndex(this.index_);let i;this.reverse_?i=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):i=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;i.hasNext()&&o<this.limit_;){const a=i.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=n.withIndex(this.index_),s=s.updatePriority(_e.EMPTY_NODE);let i;this.reverse_?i=s.getReverseIterator(this.index_):i=s.getIterator(this.index_);let o=0;for(;i.hasNext();){const a=i.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,_e.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,r,s,i){let o;if(this.reverse_){const d=this.index_.getCompare();o=(p,g)=>d(g,p)}else o=this.index_.getCompare();const a=e;ee(a.numChildren()===this.limit_,"");const c=new Oe(n,r),u=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(c);if(a.hasChild(n)){const d=a.getImmediateChild(n);let p=s.getChildAfterChild(this.index_,u,this.reverse_);for(;p!=null&&(p.name===n||a.hasChild(p.name));)p=s.getChildAfterChild(this.index_,p,this.reverse_);const g=p==null?1:o(p,c);if(h&&!r.isEmpty()&&g>=0)return i!=null&&i.trackChildChange(_a(n,r,d)),a.updateImmediateChild(n,r);{i!=null&&i.trackChildChange(ga(n,d));const S=a.updateImmediateChild(n,_e.EMPTY_NODE);return p!=null&&this.rangedFilter_.matches(p)?(i!=null&&i.trackChildChange(Vi(p.name,p.node)),S.updateImmediateChild(p.name,p.node)):S}}else return r.isEmpty()?e:h&&o(u,c)>=0?(i!=null&&(i.trackChildChange(ga(u.name,u.node)),i.trackChildChange(Vi(n,r))),a.updateImmediateChild(n,r).updateImmediateChild(u.name,_e.EMPTY_NODE)):e}}/**
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
 */class vf{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=dt}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return ee(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return ee(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Li}hasEnd(){return this.endSet_}getIndexEndValue(){return ee(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return ee(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Us}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return ee(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===dt}copy(){const e=new vf;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function zN(t){return t.loadsAllData()?new yf(t.getIndex()):t.hasLimit()?new WN(t):new ya(t)}function m_(t){const e={};if(t.isDefault())return e;let n;if(t.index_===dt?n="$priority":t.index_===qN?n="$value":t.index_===Ai?n="$key":(ee(t.index_ instanceof BN,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=Ot(n),t.startSet_){const r=t.startAfterSet_?"startAfter":"startAt";e[r]=Ot(t.indexStartValue_),t.startNameSet_&&(e[r]+=","+Ot(t.indexStartName_))}if(t.endSet_){const r=t.endBeforeSet_?"endBefore":"endAt";e[r]=Ot(t.indexEndValue_),t.endNameSet_&&(e[r]+=","+Ot(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function g_(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==dt&&(e.i=t.index_.toString()),e}/**
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
 */class lc extends I0{constructor(e,n,r,s){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=r,this.appCheckTokenProvider_=s,this.log_=Fa("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(ee(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,n,r,s){const i=e._path.toString();this.log_("Listen called for "+i+" "+e._queryIdentifier);const o=lc.getListenId_(e,r),a={};this.listens_[o]=a;const c=m_(e._queryParams);this.restRequest_(i+".json",c,(u,h)=>{let d=h;if(u===404&&(d=null,u=null),u===null&&this.onDataUpdate_(i,d,!1,r),Vs(this.listens_,o)===a){let p;u?u===401?p="permission_denied":p="rest_error:"+u:p="ok",s(p,null)}})}unlisten(e,n){const r=lc.getListenId_(e,n);delete this.listens_[r]}get(e){const n=m_(e._queryParams),r=e._path.toString(),s=new eu;return this.restRequest_(r+".json",n,(i,o)=>{let a=o;i===404&&(a=null,i=null),i===null?(this.onDataUpdate_(r,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,n={},r){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,i])=>{s&&s.accessToken&&(n.auth=s.accessToken),i&&i.token&&(n.ac=i.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Ji(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(r&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let c=null;if(a.status>=200&&a.status<300){try{c=da(a.responseText)}catch{yn("Failed to parse JSON response for "+o+": "+a.responseText)}r(null,c)}else a.status!==401&&a.status!==404&&yn("Got unsuccessful REST response for "+o+" Status: "+a.status),r(a.status);r=null}},a.open("GET",o,!0),a.send()})}}/**
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
 */class GN{constructor(){this.rootNode_=_e.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
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
 */function cc(){return{value:null,children:new Map}}function M0(t,e,n){if(De(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const r=Ne(e);t.children.has(r)||t.children.set(r,cc());const s=t.children.get(r);e=tt(e),M0(s,e,n)}}function td(t,e,n){t.value!==null?n(e,t.value):KN(t,(r,s)=>{const i=new Ze(e.toString()+"/"+r);td(s,i,n)})}function KN(t,e){t.children.forEach((n,r)=>{e(r,n)})}/**
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
 */class QN{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&hn(this.last_,(r,s)=>{n[r]=n[r]-s}),this.last_=e,n}}/**
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
 */const __=10*1e3,YN=30*1e3,JN=5*60*1e3;class XN{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new QN(e);const r=__+(YN-__)*Math.random();Go(this.reportStats_.bind(this),Math.floor(r))}reportStats_(){const e=this.statsListener_.get(),n={};let r=!1;hn(e,(s,i)=>{i>0&&Hn(this.statsToReport_,s)&&(n[s]=i,r=!0)}),r&&this.server_.reportStats(n),Go(this.reportStats_.bind(this),Math.floor(Math.random()*2*JN))}}/**
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
 */var Fn;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Fn||(Fn={}));function L0(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function wf(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ef(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
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
 */class uc{constructor(e,n,r){this.path=e,this.affectedTree=n,this.revert=r,this.type=Fn.ACK_USER_WRITE,this.source=L0()}operationForChild(e){if(De(this.path)){if(this.affectedTree.value!=null)return ee(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new Ze(e));return new uc(ze(),n,this.revert)}}else return ee(Ne(this.path)===e,"operationForChild called for unrelated child."),new uc(tt(this.path),this.affectedTree,this.revert)}}/**
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
 */class va{constructor(e,n){this.source=e,this.path=n,this.type=Fn.LISTEN_COMPLETE}operationForChild(e){return De(this.path)?new va(this.source,ze()):new va(this.source,tt(this.path))}}/**
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
 */class $s{constructor(e,n,r){this.source=e,this.path=n,this.snap=r,this.type=Fn.OVERWRITE}operationForChild(e){return De(this.path)?new $s(this.source,ze(),this.snap.getImmediateChild(e)):new $s(this.source,tt(this.path),this.snap)}}/**
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
 */class wa{constructor(e,n,r){this.source=e,this.path=n,this.children=r,this.type=Fn.MERGE}operationForChild(e){if(De(this.path)){const n=this.children.subtree(new Ze(e));return n.isEmpty()?null:n.value?new $s(this.source,ze(),n.value):new wa(this.source,ze(),n)}else return ee(Ne(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new wa(this.source,tt(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class Bs{constructor(e,n,r){this.node_=e,this.fullyInitialized_=n,this.filtered_=r}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(De(e))return this.isFullyInitialized()&&!this.filtered_;const n=Ne(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class ZN{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function eO(t,e,n,r){const s=[],i=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&i.push(HN(o.childName,o.snapshotNode))}),So(t,s,"child_removed",e,r,n),So(t,s,"child_added",e,r,n),So(t,s,"child_moved",i,r,n),So(t,s,"child_changed",e,r,n),So(t,s,"value",e,r,n),s}function So(t,e,n,r,s,i){const o=r.filter(a=>a.type===n);o.sort((a,c)=>nO(t,a,c)),o.forEach(a=>{const c=tO(t,a,i);s.forEach(u=>{u.respondsTo(a.type)&&e.push(u.createEvent(c,t.query_))})})}function tO(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function nO(t,e,n){if(e.childName==null||n.childName==null)throw Yi("Should only compare child_ events.");const r=new Oe(e.childName,e.snapshotNode),s=new Oe(n.childName,n.snapshotNode);return t.index_.compare(r,s)}/**
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
 */function ru(t,e){return{eventCache:t,serverCache:e}}function Ko(t,e,n,r){return ru(new Bs(e,n,r),t.serverCache)}function V0(t,e,n,r){return ru(t.eventCache,new Bs(e,n,r))}function nd(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function js(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
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
 */let fh;const rO=()=>(fh||(fh=new Qn(jk)),fh);class at{constructor(e,n=rO()){this.value=e,this.children=n}static fromObject(e){let n=new at(null);return hn(e,(r,s)=>{n=n.set(new Ze(r),s)}),n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:ze(),value:this.value};if(De(e))return null;{const r=Ne(e),s=this.children.get(r);if(s!==null){const i=s.findRootMostMatchingPathAndValue(tt(e),n);return i!=null?{path:At(new Ze(r),i.path),value:i.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(De(e))return this;{const n=Ne(e),r=this.children.get(n);return r!==null?r.subtree(tt(e)):new at(null)}}set(e,n){if(De(e))return new at(n,this.children);{const r=Ne(e),i=(this.children.get(r)||new at(null)).set(tt(e),n),o=this.children.insert(r,i);return new at(this.value,o)}}remove(e){if(De(e))return this.children.isEmpty()?new at(null):new at(null,this.children);{const n=Ne(e),r=this.children.get(n);if(r){const s=r.remove(tt(e));let i;return s.isEmpty()?i=this.children.remove(n):i=this.children.insert(n,s),this.value===null&&i.isEmpty()?new at(null):new at(this.value,i)}else return this}}get(e){if(De(e))return this.value;{const n=Ne(e),r=this.children.get(n);return r?r.get(tt(e)):null}}setTree(e,n){if(De(e))return n;{const r=Ne(e),i=(this.children.get(r)||new at(null)).setTree(tt(e),n);let o;return i.isEmpty()?o=this.children.remove(r):o=this.children.insert(r,i),new at(this.value,o)}}fold(e){return this.fold_(ze(),e)}fold_(e,n){const r={};return this.children.inorderTraversal((s,i)=>{r[s]=i.fold_(At(e,s),n)}),n(e,this.value,r)}findOnPath(e,n){return this.findOnPath_(e,ze(),n)}findOnPath_(e,n,r){const s=this.value?r(n,this.value):!1;if(s)return s;if(De(e))return null;{const i=Ne(e),o=this.children.get(i);return o?o.findOnPath_(tt(e),At(n,i),r):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,ze(),n)}foreachOnPath_(e,n,r){if(De(e))return this;{this.value&&r(n,this.value);const s=Ne(e),i=this.children.get(s);return i?i.foreachOnPath_(tt(e),At(n,s),r):new at(null)}}foreach(e){this.foreach_(ze(),e)}foreach_(e,n){this.children.inorderTraversal((r,s)=>{s.foreach_(At(e,r),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,r)=>{r.value&&e(n,r.value)})}}/**
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
 */class Bn{constructor(e){this.writeTree_=e}static empty(){return new Bn(new at(null))}}function Qo(t,e,n){if(De(e))return new Bn(new at(n));{const r=t.writeTree_.findRootMostValueAndPath(e);if(r!=null){const s=r.path;let i=r.value;const o=an(s,e);return i=i.updateChild(o,n),new Bn(t.writeTree_.set(s,i))}else{const s=new at(n),i=t.writeTree_.setTree(e,s);return new Bn(i)}}}function y_(t,e,n){let r=t;return hn(n,(s,i)=>{r=Qo(r,At(e,s),i)}),r}function v_(t,e){if(De(e))return Bn.empty();{const n=t.writeTree_.setTree(e,new at(null));return new Bn(n)}}function rd(t,e){return ei(t,e)!=null}function ei(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(an(n.path,e)):null}function w_(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(dt,(r,s)=>{e.push(new Oe(r,s))}):t.writeTree_.children.inorderTraversal((r,s)=>{s.value!=null&&e.push(new Oe(r,s.value))}),e}function es(t,e){if(De(e))return t;{const n=ei(t,e);return n!=null?new Bn(new at(n)):new Bn(t.writeTree_.subtree(e))}}function sd(t){return t.writeTree_.isEmpty()}function Fi(t,e){return F0(ze(),t.writeTree_,e)}function F0(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let r=null;return e.children.inorderTraversal((s,i)=>{s===".priority"?(ee(i.value!==null,"Priority writes must always be leaf nodes"),r=i.value):n=F0(At(t,s),i,n)}),!n.getChild(t).isEmpty()&&r!==null&&(n=n.updateChild(At(t,".priority"),r)),n}}/**
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
 */function bf(t,e){return j0(e,t)}function sO(t,e,n,r,s){ee(r>t.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),t.allWrites.push({path:e,snap:n,writeId:r,visible:s}),s&&(t.visibleWrites=Qo(t.visibleWrites,e,n)),t.lastWriteId=r}function iO(t,e){for(let n=0;n<t.allWrites.length;n++){const r=t.allWrites[n];if(r.writeId===e)return r}return null}function oO(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);ee(n>=0,"removeWrite called with nonexistent writeId.");const r=t.allWrites[n];t.allWrites.splice(n,1);let s=r.visible,i=!1,o=t.allWrites.length-1;for(;s&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&aO(a,r.path)?s=!1:Vn(r.path,a.path)&&(i=!0)),o--}if(s){if(i)return lO(t),!0;if(r.snap)t.visibleWrites=v_(t.visibleWrites,r.path);else{const a=r.children;hn(a,c=>{t.visibleWrites=v_(t.visibleWrites,At(r.path,c))})}return!0}else return!1}function aO(t,e){if(t.snap)return Vn(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&Vn(At(t.path,n),e))return!0;return!1}function lO(t){t.visibleWrites=U0(t.allWrites,cO,ze()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function cO(t){return t.visible}function U0(t,e,n){let r=Bn.empty();for(let s=0;s<t.length;++s){const i=t[s];if(e(i)){const o=i.path;let a;if(i.snap)Vn(n,o)?(a=an(n,o),r=Qo(r,a,i.snap)):Vn(o,n)&&(a=an(o,n),r=Qo(r,ze(),i.snap.getChild(a)));else if(i.children){if(Vn(n,o))a=an(n,o),r=y_(r,a,i.children);else if(Vn(o,n))if(a=an(o,n),De(a))r=y_(r,ze(),i.children);else{const c=Vs(i.children,Ne(a));if(c){const u=c.getChild(tt(a));r=Qo(r,ze(),u)}}}else throw Yi("WriteRecord should have .snap or .children")}}return r}function $0(t,e,n,r,s){if(!r&&!s){const i=ei(t.visibleWrites,e);if(i!=null)return i;{const o=es(t.visibleWrites,e);if(sd(o))return n;if(n==null&&!rd(o,ze()))return null;{const a=n||_e.EMPTY_NODE;return Fi(o,a)}}}else{const i=es(t.visibleWrites,e);if(!s&&sd(i))return n;if(!s&&n==null&&!rd(i,ze()))return null;{const o=function(u){return(u.visible||s)&&(!r||!~r.indexOf(u.writeId))&&(Vn(u.path,e)||Vn(e,u.path))},a=U0(t.allWrites,o,e),c=n||_e.EMPTY_NODE;return Fi(a,c)}}}function uO(t,e,n){let r=_e.EMPTY_NODE;const s=ei(t.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(dt,(i,o)=>{r=r.updateImmediateChild(i,o)}),r;if(n){const i=es(t.visibleWrites,e);return n.forEachChild(dt,(o,a)=>{const c=Fi(es(i,new Ze(o)),a);r=r.updateImmediateChild(o,c)}),w_(i).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}else{const i=es(t.visibleWrites,e);return w_(i).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}}function hO(t,e,n,r,s){ee(r||s,"Either existingEventSnap or existingServerSnap must exist");const i=At(e,n);if(rd(t.visibleWrites,i))return null;{const o=es(t.visibleWrites,i);return sd(o)?s.getChild(n):Fi(o,s.getChild(n))}}function dO(t,e,n,r){const s=At(e,n),i=ei(t.visibleWrites,s);if(i!=null)return i;if(r.isCompleteForChild(n)){const o=es(t.visibleWrites,s);return Fi(o,r.getNode().getImmediateChild(n))}else return null}function fO(t,e){return ei(t.visibleWrites,e)}function pO(t,e,n,r,s,i,o){let a;const c=es(t.visibleWrites,e),u=ei(c,ze());if(u!=null)a=u;else if(n!=null)a=Fi(c,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],d=o.getCompare(),p=i?a.getReverseIteratorFrom(r,o):a.getIteratorFrom(r,o);let g=p.getNext();for(;g&&h.length<s;)d(g,r)!==0&&h.push(g),g=p.getNext();return h}else return[]}function mO(){return{visibleWrites:Bn.empty(),allWrites:[],lastWriteId:-1}}function hc(t,e,n,r){return $0(t.writeTree,t.treePath,e,n,r)}function If(t,e){return uO(t.writeTree,t.treePath,e)}function E_(t,e,n,r){return hO(t.writeTree,t.treePath,e,n,r)}function dc(t,e){return fO(t.writeTree,At(t.treePath,e))}function gO(t,e,n,r,s,i){return pO(t.writeTree,t.treePath,e,n,r,s,i)}function Tf(t,e,n){return dO(t.writeTree,t.treePath,e,n)}function B0(t,e){return j0(At(t.treePath,e),t.writeTree)}function j0(t,e){return{treePath:t,writeTree:e}}/**
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
 */class _O{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,r=e.childName;ee(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),ee(r!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(r);if(s){const i=s.type;if(n==="child_added"&&i==="child_removed")this.changeMap.set(r,_a(r,e.snapshotNode,s.snapshotNode));else if(n==="child_removed"&&i==="child_added")this.changeMap.delete(r);else if(n==="child_removed"&&i==="child_changed")this.changeMap.set(r,ga(r,s.oldSnap));else if(n==="child_changed"&&i==="child_added")this.changeMap.set(r,Vi(r,e.snapshotNode));else if(n==="child_changed"&&i==="child_changed")this.changeMap.set(r,_a(r,e.snapshotNode,s.oldSnap));else throw Yi("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(r,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class yO{getCompleteChild(e){return null}getChildAfterChild(e,n,r){return null}}const q0=new yO;class Cf{constructor(e,n,r=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=r}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const r=this.optCompleteServerCache_!=null?new Bs(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Tf(this.writes_,e,r)}}getChildAfterChild(e,n,r){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:js(this.viewCache_),i=gO(this.writes_,s,n,1,r,e);return i.length===0?null:i[0]}}/**
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
 */function vO(t){return{filter:t}}function wO(t,e){ee(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),ee(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function EO(t,e,n,r,s){const i=new _O;let o,a;if(n.type===Fn.OVERWRITE){const u=n;u.source.fromUser?o=id(t,e,u.path,u.snap,r,s,i):(ee(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered()&&!De(u.path),o=fc(t,e,u.path,u.snap,r,s,a,i))}else if(n.type===Fn.MERGE){const u=n;u.source.fromUser?o=IO(t,e,u.path,u.children,r,s,i):(ee(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered(),o=od(t,e,u.path,u.children,r,s,a,i))}else if(n.type===Fn.ACK_USER_WRITE){const u=n;u.revert?o=AO(t,e,u.path,r,s,i):o=TO(t,e,u.path,u.affectedTree,r,s,i)}else if(n.type===Fn.LISTEN_COMPLETE)o=CO(t,e,n.path,r,i);else throw Yi("Unknown operation type: "+n.type);const c=i.getChanges();return bO(e,o,c),{viewCache:o,changes:c}}function bO(t,e,n){const r=e.eventCache;if(r.isFullyInitialized()){const s=r.getNode().isLeafNode()||r.getNode().isEmpty(),i=nd(t);(n.length>0||!t.eventCache.isFullyInitialized()||s&&!r.getNode().equals(i)||!r.getNode().getPriority().equals(i.getPriority()))&&n.push(D0(nd(e)))}}function H0(t,e,n,r,s,i){const o=e.eventCache;if(dc(r,n)!=null)return e;{let a,c;if(De(n))if(ee(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=js(e),h=u instanceof _e?u:_e.EMPTY_NODE,d=If(r,h);a=t.filter.updateFullNode(e.eventCache.getNode(),d,i)}else{const u=hc(r,js(e));a=t.filter.updateFullNode(e.eventCache.getNode(),u,i)}else{const u=Ne(n);if(u===".priority"){ee(is(n)===1,"Can't have a priority with additional path components");const h=o.getNode();c=e.serverCache.getNode();const d=E_(r,n,h,c);d!=null?a=t.filter.updatePriority(h,d):a=o.getNode()}else{const h=tt(n);let d;if(o.isCompleteForChild(u)){c=e.serverCache.getNode();const p=E_(r,n,o.getNode(),c);p!=null?d=o.getNode().getImmediateChild(u).updateChild(h,p):d=o.getNode().getImmediateChild(u)}else d=Tf(r,u,e.serverCache);d!=null?a=t.filter.updateChild(o.getNode(),u,d,h,s,i):a=o.getNode()}}return Ko(e,a,o.isFullyInitialized()||De(n),t.filter.filtersNodes())}}function fc(t,e,n,r,s,i,o,a){const c=e.serverCache;let u;const h=o?t.filter:t.filter.getIndexedFilter();if(De(n))u=h.updateFullNode(c.getNode(),r,null);else if(h.filtersNodes()&&!c.isFiltered()){const g=c.getNode().updateChild(n,r);u=h.updateFullNode(c.getNode(),g,null)}else{const g=Ne(n);if(!c.isCompleteForPath(n)&&is(n)>1)return e;const v=tt(n),P=c.getNode().getImmediateChild(g).updateChild(v,r);g===".priority"?u=h.updatePriority(c.getNode(),P):u=h.updateChild(c.getNode(),g,P,v,q0,null)}const d=V0(e,u,c.isFullyInitialized()||De(n),h.filtersNodes()),p=new Cf(s,d,i);return H0(t,d,n,s,p,a)}function id(t,e,n,r,s,i,o){const a=e.eventCache;let c,u;const h=new Cf(s,e,i);if(De(n))u=t.filter.updateFullNode(e.eventCache.getNode(),r,o),c=Ko(e,u,!0,t.filter.filtersNodes());else{const d=Ne(n);if(d===".priority")u=t.filter.updatePriority(e.eventCache.getNode(),r),c=Ko(e,u,a.isFullyInitialized(),a.isFiltered());else{const p=tt(n),g=a.getNode().getImmediateChild(d);let v;if(De(p))v=r;else{const S=h.getCompleteChild(d);S!=null?C0(p)===".priority"&&S.getChild(S0(p)).isEmpty()?v=S:v=S.updateChild(p,r):v=_e.EMPTY_NODE}if(g.equals(v))c=e;else{const S=t.filter.updateChild(a.getNode(),d,v,p,h,o);c=Ko(e,S,a.isFullyInitialized(),t.filter.filtersNodes())}}}return c}function b_(t,e){return t.eventCache.isCompleteForChild(e)}function IO(t,e,n,r,s,i,o){let a=e;return r.foreach((c,u)=>{const h=At(n,c);b_(e,Ne(h))&&(a=id(t,a,h,u,s,i,o))}),r.foreach((c,u)=>{const h=At(n,c);b_(e,Ne(h))||(a=id(t,a,h,u,s,i,o))}),a}function I_(t,e,n){return n.foreach((r,s)=>{e=e.updateChild(r,s)}),e}function od(t,e,n,r,s,i,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,u;De(n)?u=r:u=new at(null).setTree(n,r);const h=e.serverCache.getNode();return u.children.inorderTraversal((d,p)=>{if(h.hasChild(d)){const g=e.serverCache.getNode().getImmediateChild(d),v=I_(t,g,p);c=fc(t,c,new Ze(d),v,s,i,o,a)}}),u.children.inorderTraversal((d,p)=>{const g=!e.serverCache.isCompleteForChild(d)&&p.value===null;if(!h.hasChild(d)&&!g){const v=e.serverCache.getNode().getImmediateChild(d),S=I_(t,v,p);c=fc(t,c,new Ze(d),S,s,i,o,a)}}),c}function TO(t,e,n,r,s,i,o){if(dc(s,n)!=null)return e;const a=e.serverCache.isFiltered(),c=e.serverCache;if(r.value!=null){if(De(n)&&c.isFullyInitialized()||c.isCompleteForPath(n))return fc(t,e,n,c.getNode().getChild(n),s,i,a,o);if(De(n)){let u=new at(null);return c.getNode().forEachChild(Ai,(h,d)=>{u=u.set(new Ze(h),d)}),od(t,e,n,u,s,i,a,o)}else return e}else{let u=new at(null);return r.foreach((h,d)=>{const p=At(n,h);c.isCompleteForPath(p)&&(u=u.set(h,c.getNode().getChild(p)))}),od(t,e,n,u,s,i,a,o)}}function CO(t,e,n,r,s){const i=e.serverCache,o=V0(e,i.getNode(),i.isFullyInitialized()||De(n),i.isFiltered());return H0(t,o,n,r,q0,s)}function AO(t,e,n,r,s,i){let o;if(dc(r,n)!=null)return e;{const a=new Cf(r,e,s),c=e.eventCache.getNode();let u;if(De(n)||Ne(n)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=hc(r,js(e));else{const d=e.serverCache.getNode();ee(d instanceof _e,"serverChildren would be complete if leaf node"),h=If(r,d)}h=h,u=t.filter.updateFullNode(c,h,i)}else{const h=Ne(n);let d=Tf(r,h,e.serverCache);d==null&&e.serverCache.isCompleteForChild(h)&&(d=c.getImmediateChild(h)),d!=null?u=t.filter.updateChild(c,h,d,tt(n),a,i):e.eventCache.getNode().hasChild(h)?u=t.filter.updateChild(c,h,_e.EMPTY_NODE,tt(n),a,i):u=c,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=hc(r,js(e)),o.isLeafNode()&&(u=t.filter.updateFullNode(u,o,i)))}return o=e.serverCache.isFullyInitialized()||dc(r,ze())!=null,Ko(e,u,o,t.filter.filtersNodes())}}/**
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
 */class SO{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const r=this.query_._queryParams,s=new yf(r.getIndex()),i=zN(r);this.processor_=vO(i);const o=n.serverCache,a=n.eventCache,c=s.updateFullNode(_e.EMPTY_NODE,o.getNode(),null),u=i.updateFullNode(_e.EMPTY_NODE,a.getNode(),null),h=new Bs(c,o.isFullyInitialized(),s.filtersNodes()),d=new Bs(u,a.isFullyInitialized(),i.filtersNodes());this.viewCache_=ru(d,h),this.eventGenerator_=new ZN(this.query_)}get query(){return this.query_}}function RO(t){return t.viewCache_.serverCache.getNode()}function PO(t,e){const n=js(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!De(e)&&!n.getImmediateChild(Ne(e)).isEmpty())?n.getChild(e):null}function T_(t){return t.eventRegistrations_.length===0}function xO(t,e){t.eventRegistrations_.push(e)}function C_(t,e,n){const r=[];if(n){ee(e==null,"A cancel should cancel all event registrations.");const s=t.query._path;t.eventRegistrations_.forEach(i=>{const o=i.createCancelEvent(n,s);o&&r.push(o)})}if(e){let s=[];for(let i=0;i<t.eventRegistrations_.length;++i){const o=t.eventRegistrations_[i];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(t.eventRegistrations_.slice(i+1));break}}t.eventRegistrations_=s}else t.eventRegistrations_=[];return r}function A_(t,e,n,r){e.type===Fn.MERGE&&e.source.queryId!==null&&(ee(js(t.viewCache_),"We should always have a full cache before handling merges"),ee(nd(t.viewCache_),"Missing event cache, even though we have a server cache"));const s=t.viewCache_,i=EO(t.processor_,s,e,n,r);return wO(t.processor_,i.viewCache),ee(i.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=i.viewCache,W0(t,i.changes,i.viewCache.eventCache.getNode(),null)}function kO(t,e){const n=t.viewCache_.eventCache,r=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(dt,(i,o)=>{r.push(Vi(i,o))}),n.isFullyInitialized()&&r.push(D0(n.getNode())),W0(t,r,n.getNode(),e)}function W0(t,e,n,r){const s=r?[r]:t.eventRegistrations_;return eO(t.eventGenerator_,e,n,s)}/**
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
 */let pc;class NO{constructor(){this.views=new Map}}function OO(t){ee(!pc,"__referenceConstructor has already been defined"),pc=t}function DO(){return ee(pc,"Reference.ts has not been loaded"),pc}function MO(t){return t.views.size===0}function Af(t,e,n,r){const s=e.source.queryId;if(s!==null){const i=t.views.get(s);return ee(i!=null,"SyncTree gave us an op for an invalid query."),A_(i,e,n,r)}else{let i=[];for(const o of t.views.values())i=i.concat(A_(o,e,n,r));return i}}function LO(t,e,n,r,s){const i=e._queryIdentifier,o=t.views.get(i);if(!o){let a=hc(n,s?r:null),c=!1;a?c=!0:r instanceof _e?(a=If(n,r),c=!1):(a=_e.EMPTY_NODE,c=!1);const u=ru(new Bs(a,c,!1),new Bs(r,s,!1));return new SO(e,u)}return o}function VO(t,e,n,r,s,i){const o=LO(t,e,r,s,i);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),xO(o,n),kO(o,n)}function FO(t,e,n,r){const s=e._queryIdentifier,i=[];let o=[];const a=os(t);if(s==="default")for(const[c,u]of t.views.entries())o=o.concat(C_(u,n,r)),T_(u)&&(t.views.delete(c),u.query._queryParams.loadsAllData()||i.push(u.query));else{const c=t.views.get(s);c&&(o=o.concat(C_(c,n,r)),T_(c)&&(t.views.delete(s),c.query._queryParams.loadsAllData()||i.push(c.query)))}return a&&!os(t)&&i.push(new(DO())(e._repo,e._path)),{removed:i,events:o}}function z0(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function Si(t,e){let n=null;for(const r of t.views.values())n=n||PO(r,e);return n}function G0(t,e){if(e._queryParams.loadsAllData())return su(t);{const r=e._queryIdentifier;return t.views.get(r)}}function K0(t,e){return G0(t,e)!=null}function os(t){return su(t)!=null}function su(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let mc;function UO(t){ee(!mc,"__referenceConstructor has already been defined"),mc=t}function $O(){return ee(mc,"Reference.ts has not been loaded"),mc}let BO=1;class S_{constructor(e){this.listenProvider_=e,this.syncPointTree_=new at(null),this.pendingWriteTree_=mO(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Q0(t,e,n,r,s){return sO(t.pendingWriteTree_,e,n,r,s),s?Ba(t,new $s(L0(),e,n)):[]}function Ei(t,e,n=!1){const r=iO(t.pendingWriteTree_,e);if(oO(t.pendingWriteTree_,e)){let i=new at(null);return r.snap!=null?i=i.set(ze(),!0):hn(r.children,o=>{i=i.set(new Ze(o),!0)}),Ba(t,new uc(r.path,i,n))}else return[]}function iu(t,e,n){return Ba(t,new $s(wf(),e,n))}function jO(t,e,n){const r=at.fromObject(n);return Ba(t,new wa(wf(),e,r))}function qO(t,e){return Ba(t,new va(wf(),e))}function HO(t,e,n){const r=Rf(t,n);if(r){const s=Pf(r),i=s.path,o=s.queryId,a=an(i,e),c=new va(Ef(o),a);return xf(t,i,c)}else return[]}function ad(t,e,n,r,s=!1){const i=e._path,o=t.syncPointTree_.get(i);let a=[];if(o&&(e._queryIdentifier==="default"||K0(o,e))){const c=FO(o,e,n,r);MO(o)&&(t.syncPointTree_=t.syncPointTree_.remove(i));const u=c.removed;if(a=c.events,!s){const h=u.findIndex(p=>p._queryParams.loadsAllData())!==-1,d=t.syncPointTree_.findOnPath(i,(p,g)=>os(g));if(h&&!d){const p=t.syncPointTree_.subtree(i);if(!p.isEmpty()){const g=GO(p);for(let v=0;v<g.length;++v){const S=g[v],P=S.query,M=X0(t,S);t.listenProvider_.startListening(Yo(P),gc(t,P),M.hashFn,M.onComplete)}}}!d&&u.length>0&&!r&&(h?t.listenProvider_.stopListening(Yo(e),null):u.forEach(p=>{const g=t.queryToTagMap.get(ou(p));t.listenProvider_.stopListening(Yo(p),g)}))}KO(t,u)}return a}function WO(t,e,n,r){const s=Rf(t,r);if(s!=null){const i=Pf(s),o=i.path,a=i.queryId,c=an(o,e),u=new $s(Ef(a),c,n);return xf(t,o,u)}else return[]}function zO(t,e,n,r){const s=Rf(t,r);if(s){const i=Pf(s),o=i.path,a=i.queryId,c=an(o,e),u=at.fromObject(n),h=new wa(Ef(a),c,u);return xf(t,o,h)}else return[]}function R_(t,e,n,r=!1){const s=e._path;let i=null,o=!1;t.syncPointTree_.foreachOnPath(s,(p,g)=>{const v=an(p,s);i=i||Si(g,v),o=o||os(g)});let a=t.syncPointTree_.get(s);a?(o=o||os(a),i=i||Si(a,ze())):(a=new NO,t.syncPointTree_=t.syncPointTree_.set(s,a));let c;i!=null?c=!0:(c=!1,i=_e.EMPTY_NODE,t.syncPointTree_.subtree(s).foreachChild((g,v)=>{const S=Si(v,ze());S&&(i=i.updateImmediateChild(g,S))}));const u=K0(a,e);if(!u&&!e._queryParams.loadsAllData()){const p=ou(e);ee(!t.queryToTagMap.has(p),"View does not exist, but we have a tag");const g=QO();t.queryToTagMap.set(p,g),t.tagToQueryMap.set(g,p)}const h=bf(t.pendingWriteTree_,s);let d=VO(a,e,n,h,i,c);if(!u&&!o&&!r){const p=G0(a,e);d=d.concat(YO(t,e,p))}return d}function Sf(t,e,n){const s=t.pendingWriteTree_,i=t.syncPointTree_.findOnPath(e,(o,a)=>{const c=an(o,e),u=Si(a,c);if(u)return u});return $0(s,e,i,n,!0)}function Ba(t,e){return Y0(e,t.syncPointTree_,null,bf(t.pendingWriteTree_,ze()))}function Y0(t,e,n,r){if(De(t.path))return J0(t,e,n,r);{const s=e.get(ze());n==null&&s!=null&&(n=Si(s,ze()));let i=[];const o=Ne(t.path),a=t.operationForChild(o),c=e.children.get(o);if(c&&a){const u=n?n.getImmediateChild(o):null,h=B0(r,o);i=i.concat(Y0(a,c,u,h))}return s&&(i=i.concat(Af(s,t,r,n))),i}}function J0(t,e,n,r){const s=e.get(ze());n==null&&s!=null&&(n=Si(s,ze()));let i=[];return e.children.inorderTraversal((o,a)=>{const c=n?n.getImmediateChild(o):null,u=B0(r,o),h=t.operationForChild(o);h&&(i=i.concat(J0(h,a,c,u)))}),s&&(i=i.concat(Af(s,t,r,n))),i}function X0(t,e){const n=e.query,r=gc(t,n);return{hashFn:()=>(RO(e)||_e.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return r?HO(t,n._path,r):qO(t,n._path);{const i=Wk(s,n);return ad(t,n,null,i)}}}}function gc(t,e){const n=ou(e);return t.queryToTagMap.get(n)}function ou(t){return t._path.toString()+"$"+t._queryIdentifier}function Rf(t,e){return t.tagToQueryMap.get(e)}function Pf(t){const e=t.indexOf("$");return ee(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new Ze(t.substr(0,e))}}function xf(t,e,n){const r=t.syncPointTree_.get(e);ee(r,"Missing sync point for query tag that we're tracking");const s=bf(t.pendingWriteTree_,e);return Af(r,n,s,null)}function GO(t){return t.fold((e,n,r)=>{if(n&&os(n))return[su(n)];{let s=[];return n&&(s=z0(n)),hn(r,(i,o)=>{s=s.concat(o)}),s}})}function Yo(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new($O())(t._repo,t._path):t}function KO(t,e){for(let n=0;n<e.length;++n){const r=e[n];if(!r._queryParams.loadsAllData()){const s=ou(r),i=t.queryToTagMap.get(s);t.queryToTagMap.delete(s),t.tagToQueryMap.delete(i)}}}function QO(){return BO++}function YO(t,e,n){const r=e._path,s=gc(t,e),i=X0(t,n),o=t.listenProvider_.startListening(Yo(e),s,i.hashFn,i.onComplete),a=t.syncPointTree_.subtree(r);if(s)ee(!os(a.value),"If we're adding a query, it shouldn't be shadowed");else{const c=a.fold((u,h,d)=>{if(!De(u)&&h&&os(h))return[su(h).query];{let p=[];return h&&(p=p.concat(z0(h).map(g=>g.query))),hn(d,(g,v)=>{p=p.concat(v)}),p}});for(let u=0;u<c.length;++u){const h=c[u];t.listenProvider_.stopListening(Yo(h),gc(t,h))}}return o}/**
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
 */class kf{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new kf(n)}node(){return this.node_}}class Nf{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=At(this.path_,e);return new Nf(this.syncTree_,n)}node(){return Sf(this.syncTree_,this.path_)}}const JO=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},P_=function(t,e,n){if(!t||typeof t!="object")return t;if(ee(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return XO(t[".sv"],e,n);if(typeof t[".sv"]=="object")return ZO(t[".sv"],e);ee(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},XO=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:ee(!1,"Unexpected server value: "+t)}},ZO=function(t,e,n){t.hasOwnProperty("increment")||ee(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const r=t.increment;typeof r!="number"&&ee(!1,"Unexpected increment value: "+r);const s=e.node();if(ee(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return r;const o=s.getValue();return typeof o!="number"?r:o+r},eD=function(t,e,n,r){return Of(e,new Nf(n,t),r)},Z0=function(t,e,n){return Of(t,new kf(e),n)};function Of(t,e,n){const r=t.getPriority().val(),s=P_(r,e.getImmediateChild(".priority"),n);let i;if(t.isLeafNode()){const o=t,a=P_(o.getValue(),e,n);return a!==o.getValue()||s!==o.getPriority().val()?new kt(a,Ft(s)):t}else{const o=t;return i=o,s!==o.getPriority().val()&&(i=i.updatePriority(new kt(s))),o.forEachChild(dt,(a,c)=>{const u=Of(c,e.getImmediateChild(a),n);u!==c&&(i=i.updateImmediateChild(a,u))}),i}}/**
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
 */class Df{constructor(e="",n=null,r={children:{},childCount:0}){this.name=e,this.parent=n,this.node=r}}function au(t,e){let n=e instanceof Ze?e:new Ze(e),r=t,s=Ne(n);for(;s!==null;){const i=Vs(r.node.children,s)||{children:{},childCount:0};r=new Df(s,r,i),n=tt(n),s=Ne(n)}return r}function ti(t){return t.node.value}function Mf(t,e){t.node.value=e,ld(t)}function eE(t){return t.node.childCount>0}function tD(t){return ti(t)===void 0&&!eE(t)}function lu(t,e){hn(t.node.children,(n,r)=>{e(new Df(n,t,r))})}function tE(t,e,n,r){n&&!r&&e(t),lu(t,s=>{tE(s,e,!0,r)}),n&&r&&e(t)}function nD(t,e,n){let r=t.parent;for(;r!==null;){if(e(r))return!0;r=r.parent}return!1}function ja(t){return new Ze(t.parent===null?t.name:ja(t.parent)+"/"+t.name)}function ld(t){t.parent!==null&&rD(t.parent,t.name,t)}function rD(t,e,n){const r=tD(n),s=Hn(t.node.children,e);r&&s?(delete t.node.children[e],t.node.childCount--,ld(t)):!r&&!s&&(t.node.children[e]=n.node,t.node.childCount++,ld(t))}/**
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
 */const sD=/[\[\].#$\/\u0000-\u001F\u007F]/,iD=/[\[\].#$\u0000-\u001F\u007F]/,ph=10*1024*1024,nE=function(t){return typeof t=="string"&&t.length!==0&&!sD.test(t)},rE=function(t){return typeof t=="string"&&t.length!==0&&!iD.test(t)},oD=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),rE(t)},aD=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!uf(t)||t&&typeof t=="object"&&Hn(t,".sv")},Lf=function(t,e,n){const r=n instanceof Ze?new TN(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+Ts(r));if(typeof e=="function")throw new Error(t+"contains a function "+Ts(r)+" with contents = "+e.toString());if(uf(e))throw new Error(t+"contains "+e.toString()+" "+Ts(r));if(typeof e=="string"&&e.length>ph/3&&tu(e)>ph)throw new Error(t+"contains a string greater than "+ph+" utf8 bytes "+Ts(r)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,i=!1;if(hn(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(i=!0,!nE(o)))throw new Error(t+" contains an invalid key ("+o+") "+Ts(r)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);CN(r,o),Lf(t,a,r),AN(r)}),s&&i)throw new Error(t+' contains ".value" child '+Ts(r)+" in addition to actual children.")}},sE=function(t,e,n,r){if(!rE(n))throw new Error(Gw(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},lD=function(t,e,n,r){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),sE(t,e,n)},cD=function(t,e){if(Ne(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},uD=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!nE(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!oD(n))throw new Error(Gw(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class hD{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function iE(t,e){let n=null;for(let r=0;r<e.length;r++){const s=e[r],i=s.getPath();n!==null&&!mf(i,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:i}),n.events.push(s)}n&&t.eventLists_.push(n)}function oE(t,e,n){iE(t,n),aE(t,r=>mf(r,e))}function ds(t,e,n){iE(t,n),aE(t,r=>Vn(r,e)||Vn(e,r))}function aE(t,e){t.recursionDepth_++;let n=!0;for(let r=0;r<t.eventLists_.length;r++){const s=t.eventLists_[r];if(s){const i=s.path;e(i)?(dD(t.eventLists_[r]),t.eventLists_[r]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function dD(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const r=n.getEventRunner();zo&&Gt("event: "+n.toString()),Ua(r)}}}/**
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
 */const fD="repo_interrupt",pD=25;class mD{constructor(e,n,r,s){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=r,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new hD,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=cc(),this.transactionQueueTree_=new Df,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function gD(t,e,n){if(t.stats_=ff(t.repoInfo_),t.forceRestClient_||Qk())t.server_=new lc(t.repoInfo_,(r,s,i,o)=>{x_(t,r,s,i,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>k_(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Ot(n)}catch(r){throw new Error("Invalid authOverride provided: "+r)}}t.persistentConnection_=new _r(t.repoInfo_,e,(r,s,i,o)=>{x_(t,r,s,i,o)},r=>{k_(t,r)},r=>{yD(t,r)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(r=>{t.server_.refreshAuthToken(r)}),t.appCheckProvider_.addTokenChangeListener(r=>{t.server_.refreshAppCheckToken(r.token)}),t.statsReporter_=eN(t.repoInfo_,()=>new XN(t.stats_,t.server_)),t.infoData_=new GN,t.infoSyncTree_=new S_({startListening:(r,s,i,o)=>{let a=[];const c=t.infoData_.getNode(r._path);return c.isEmpty()||(a=iu(t.infoSyncTree_,r._path,c),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Ff(t,"connected",!1),t.serverSyncTree_=new S_({startListening:(r,s,i,o)=>(t.server_.listen(r,i,s,(a,c)=>{const u=o(a,c);ds(t.eventQueue_,r._path,u)}),[]),stopListening:(r,s)=>{t.server_.unlisten(r,s)}})}function _D(t){const n=t.infoData_.getNode(new Ze(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function Vf(t){return JO({timestamp:_D(t)})}function x_(t,e,n,r,s){t.dataUpdateCount++;const i=new Ze(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(s)if(r){const c=rc(n,u=>Ft(u));o=zO(t.serverSyncTree_,i,c,s)}else{const c=Ft(n);o=WO(t.serverSyncTree_,i,c,s)}else if(r){const c=rc(n,u=>Ft(u));o=jO(t.serverSyncTree_,i,c)}else{const c=Ft(n);o=iu(t.serverSyncTree_,i,c)}let a=i;o.length>0&&(a=Bf(t,i)),ds(t.eventQueue_,a,o)}function k_(t,e){Ff(t,"connected",e),e===!1&&vD(t)}function yD(t,e){hn(e,(n,r)=>{Ff(t,n,r)})}function Ff(t,e,n){const r=new Ze("/.info/"+e),s=Ft(n);t.infoData_.updateSnapshot(r,s);const i=iu(t.infoSyncTree_,r,s);ds(t.eventQueue_,r,i)}function lE(t){return t.nextWriteId_++}function vD(t){Uf(t,"onDisconnectEvents");const e=Vf(t),n=cc();td(t.onDisconnect_,ze(),(s,i)=>{const o=eD(s,i,t.serverSyncTree_,e);M0(n,s,o)});let r=[];td(n,ze(),(s,i)=>{r=r.concat(iu(t.serverSyncTree_,s,i));const o=AD(t,s);Bf(t,o)}),t.onDisconnect_=cc(),ds(t.eventQueue_,ze(),r)}function wD(t,e,n){let r;Ne(e._path)===".info"?r=R_(t.infoSyncTree_,e,n):r=R_(t.serverSyncTree_,e,n),oE(t.eventQueue_,e._path,r)}function ED(t,e,n){let r;Ne(e._path)===".info"?r=ad(t.infoSyncTree_,e,n):r=ad(t.serverSyncTree_,e,n),oE(t.eventQueue_,e._path,r)}function bD(t){t.persistentConnection_&&t.persistentConnection_.interrupt(fD)}function Uf(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),Gt(n,...e)}function ID(t,e,n,r,s,i){Uf(t,"transaction on "+e);const o={path:e,update:n,onComplete:r,status:null,order:r0(),applyLocally:i,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=$f(t,e,void 0);o.currentInputSnapshot=a;const c=o.update(a.val());if(c===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{Lf("transaction failed: Data returned ",c,o.path),o.status=0;const u=au(t.transactionQueueTree_,e),h=ti(u)||[];h.push(o),Mf(u,h);let d;typeof c=="object"&&c!==null&&Hn(c,".priority")?(d=Vs(c,".priority"),ee(aD(d),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):d=(Sf(t.serverSyncTree_,e)||_e.EMPTY_NODE).getPriority().val();const p=Vf(t),g=Ft(c,d),v=Z0(g,a,p);o.currentOutputSnapshotRaw=g,o.currentOutputSnapshotResolved=v,o.currentWriteId=lE(t);const S=Q0(t.serverSyncTree_,e,v,o.currentWriteId,o.applyLocally);ds(t.eventQueue_,e,S),cu(t,t.transactionQueueTree_)}}function $f(t,e,n){return Sf(t.serverSyncTree_,e,n)||_e.EMPTY_NODE}function cu(t,e=t.transactionQueueTree_){if(e||uu(t,e),ti(e)){const n=uE(t,e);ee(n.length>0,"Sending zero length transaction queue"),n.every(s=>s.status===0)&&TD(t,ja(e),n)}else eE(e)&&lu(e,n=>{cu(t,n)})}function TD(t,e,n){const r=n.map(u=>u.currentWriteId),s=$f(t,e,r);let i=s;const o=s.hash();for(let u=0;u<n.length;u++){const h=n[u];ee(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const d=an(e,h.path);i=i.updateChild(d,h.currentOutputSnapshotRaw)}const a=i.val(!0),c=e;t.server_.put(c.toString(),a,u=>{Uf(t,"transaction put response",{path:c.toString(),status:u});let h=[];if(u==="ok"){const d=[];for(let p=0;p<n.length;p++)n[p].status=2,h=h.concat(Ei(t.serverSyncTree_,n[p].currentWriteId)),n[p].onComplete&&d.push(()=>n[p].onComplete(null,!0,n[p].currentOutputSnapshotResolved)),n[p].unwatcher();uu(t,au(t.transactionQueueTree_,e)),cu(t,t.transactionQueueTree_),ds(t.eventQueue_,e,h);for(let p=0;p<d.length;p++)Ua(d[p])}else{if(u==="datastale")for(let d=0;d<n.length;d++)n[d].status===3?n[d].status=4:n[d].status=0;else{yn("transaction at "+c.toString()+" failed: "+u);for(let d=0;d<n.length;d++)n[d].status=4,n[d].abortReason=u}Bf(t,e)}},o)}function Bf(t,e){const n=cE(t,e),r=ja(n),s=uE(t,n);return CD(t,s,r),r}function CD(t,e,n){if(e.length===0)return;const r=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const c=e[a],u=an(n,c.path);let h=!1,d;if(ee(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)h=!0,d=c.abortReason,s=s.concat(Ei(t.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=pD)h=!0,d="maxretry",s=s.concat(Ei(t.serverSyncTree_,c.currentWriteId,!0));else{const p=$f(t,c.path,o);c.currentInputSnapshot=p;const g=e[a].update(p.val());if(g!==void 0){Lf("transaction failed: Data returned ",g,c.path);let v=Ft(g);typeof g=="object"&&g!=null&&Hn(g,".priority")||(v=v.updatePriority(p.getPriority()));const P=c.currentWriteId,M=Vf(t),F=Z0(v,p,M);c.currentOutputSnapshotRaw=v,c.currentOutputSnapshotResolved=F,c.currentWriteId=lE(t),o.splice(o.indexOf(P),1),s=s.concat(Q0(t.serverSyncTree_,c.path,F,c.currentWriteId,c.applyLocally)),s=s.concat(Ei(t.serverSyncTree_,P,!0))}else h=!0,d="nodata",s=s.concat(Ei(t.serverSyncTree_,c.currentWriteId,!0))}ds(t.eventQueue_,n,s),s=[],h&&(e[a].status=2,function(p){setTimeout(p,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(d==="nodata"?r.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):r.push(()=>e[a].onComplete(new Error(d),!1,null))))}uu(t,t.transactionQueueTree_);for(let a=0;a<r.length;a++)Ua(r[a]);cu(t,t.transactionQueueTree_)}function cE(t,e){let n,r=t.transactionQueueTree_;for(n=Ne(e);n!==null&&ti(r)===void 0;)r=au(r,n),e=tt(e),n=Ne(e);return r}function uE(t,e){const n=[];return hE(t,e,n),n.sort((r,s)=>r.order-s.order),n}function hE(t,e,n){const r=ti(e);if(r)for(let s=0;s<r.length;s++)n.push(r[s]);lu(e,s=>{hE(t,s,n)})}function uu(t,e){const n=ti(e);if(n){let r=0;for(let s=0;s<n.length;s++)n[s].status!==2&&(n[r]=n[s],r++);n.length=r,Mf(e,n.length>0?n:void 0)}lu(e,r=>{uu(t,r)})}function AD(t,e){const n=ja(cE(t,e)),r=au(t.transactionQueueTree_,e);return nD(r,s=>{mh(t,s)}),mh(t,r),tE(r,s=>{mh(t,s)}),n}function mh(t,e){const n=ti(e);if(n){const r=[];let s=[],i=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(ee(i===o-1,"All SENT items should be at beginning of queue."),i=o,n[o].status=3,n[o].abortReason="set"):(ee(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),s=s.concat(Ei(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&r.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));i===-1?Mf(e,void 0):n.length=i+1,ds(t.eventQueue_,ja(e),s);for(let o=0;o<r.length;o++)Ua(r[o])}}/**
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
 */function SD(t){let e="";const n=t.split("/");for(let r=0;r<n.length;r++)if(n[r].length>0){let s=n[r];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function RD(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const r=n.split("=");r.length===2?e[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):yn(`Invalid query segment '${n}' in query '${t}'`)}return e}const N_=function(t,e){const n=PD(t),r=n.namespace;n.domain==="firebase.com"&&Er(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!r||r==="undefined")&&n.domain!=="localhost"&&Er("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||$k();const s=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new g0(n.host,n.secure,r,s,e,"",r!==n.subdomain),path:new Ze(n.pathString)}},PD=function(t){let e="",n="",r="",s="",i="",o=!0,a="https",c=443;if(typeof t=="string"){let u=t.indexOf("//");u>=0&&(a=t.substring(0,u-1),t=t.substring(u+2));let h=t.indexOf("/");h===-1&&(h=t.length);let d=t.indexOf("?");d===-1&&(d=t.length),e=t.substring(0,Math.min(h,d)),h<d&&(s=SD(t.substring(h,d)));const p=RD(t.substring(Math.min(t.length,d)));u=e.indexOf(":"),u>=0?(o=a==="https"||a==="wss",c=parseInt(e.substring(u+1),10)):u=e.length;const g=e.slice(0,u);if(g.toLowerCase()==="localhost")n="localhost";else if(g.split(".").length<=2)n=g;else{const v=e.indexOf(".");r=e.substring(0,v).toLowerCase(),n=e.substring(v+1),i=r}"ns"in p&&(i=p.ns)}return{host:e,port:c,domain:n,subdomain:r,secure:o,scheme:a,pathString:s,namespace:i}};/**
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
 */class xD{constructor(e,n,r,s){this.eventType=e,this.eventRegistration=n,this.snapshot=r,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Ot(this.snapshot.exportVal())}}class kD{constructor(e,n,r){this.eventRegistration=e,this.error=n,this.path=r}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class ND{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return ee(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class jf{constructor(e,n,r,s){this._repo=e,this._path=n,this._queryParams=r,this._orderByCalled=s}get key(){return De(this._path)?null:C0(this._path)}get ref(){return new Sr(this._repo,this._path)}get _queryIdentifier(){const e=g_(this._queryParams),n=hf(e);return n==="{}"?"default":n}get _queryObject(){return g_(this._queryParams)}isEqual(e){if(e=yt(e),!(e instanceof jf))return!1;const n=this._repo===e._repo,r=mf(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return n&&r&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+IN(this._path)}}class Sr extends jf{constructor(e,n){super(e,n,new vf,!1)}get parent(){const e=S0(this._path);return e===null?null:new Sr(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ea{constructor(e,n,r){this._node=e,this.ref=n,this._index=r}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new Ze(e),r=cd(this.ref,e);return new Ea(this._node.getChild(n),r,dt)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(r,s)=>e(new Ea(s,cd(this.ref,r),dt)))}hasChild(e){const n=new Ze(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function OD(t,e){return t=yt(t),t._checkNotDeleted("ref"),cd(t._root,e)}function cd(t,e){return t=yt(t),Ne(t._path)===null?lD("child","path",e):sE("child","path",e),new Sr(t._repo,At(t._path,e))}class qf{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const r=n._queryParams.getIndex();return new xD("value",this,new Ea(e.snapshotNode,new Sr(n._repo,n._path),r))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new kD(this,e,n):null}matches(e){return e instanceof qf?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function DD(t,e,n,r,s){const i=new ND(n,void 0),o=new qf(i);return wD(t._repo,t,o),()=>ED(t._repo,t,o)}function dE(t,e,n,r){return DD(t,"value",e)}OO(Sr);UO(Sr);/**
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
 */const MD="FIREBASE_DATABASE_EMULATOR_HOST",ud={};let LD=!1;function VD(t,e,n,r){t.repoInfo_=new g0(`${e}:${n}`,!1,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0),r&&(t.authTokenProvider_=r)}function FD(t,e,n,r,s){let i=r||t.options.databaseURL;i===void 0&&(t.options.projectId||Er("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Gt("Using default host for project ",t.options.projectId),i=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=N_(i,s),a=o.repoInfo,c;typeof process<"u"&&Xg&&(c=Xg[MD]),c?(i=`http://${c}?ns=${a.namespace}`,o=N_(i,s),a=o.repoInfo):o.repoInfo.secure;const u=new Jk(t.name,t.options,e);uD("Invalid Firebase Database URL",o),De(o.path)||Er("Database URL must point to the root of a Firebase Database (not including a child path).");const h=$D(a,t,u,new Yk(t.name,n));return new BD(h,t)}function UD(t,e){const n=ud[e];(!n||n[t.key]!==t)&&Er(`Database ${e}(${t.repoInfo_}) has already been deleted.`),bD(t),delete n[t.key]}function $D(t,e,n,r){let s=ud[e.name];s||(s={},ud[e.name]=s);let i=s[t.toURLString()];return i&&Er("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),i=new mD(t,LD,n,r),s[t.toURLString()]=i,i}class BD{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(gD(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Sr(this._repo,ze())),this._rootInternal}_delete(){return this._rootInternal!==null&&(UD(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&Er("Cannot call "+e+" on a deleted database.")}}function jD(t=La(),e){const n=Ar(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const r=af("database");r&&qD(n,...r)}return n}function qD(t,e,n,r={}){t=yt(t),t._checkNotDeleted("useEmulator"),t._instanceStarted&&Er("Cannot call useEmulator() after instance has already been initialized.");const s=t._repoInternal;let i;if(s.repoInfo_.nodeAdmin)r.mockUserToken&&Er('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),i=new Fl(Fl.OWNER);else if(r.mockUserToken){const o=typeof r.mockUserToken=="string"?r.mockUserToken:$w(r.mockUserToken,t.app.options.projectId);i=new Fl(o)}VD(s,e,n,i)}/**
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
 */function HD(t){Mk(Zs),Pn(new wn("database",(e,{instanceIdentifier:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),i=e.getProvider("app-check-internal");return FD(r,s,i,n)},"PUBLIC").setMultipleInstances(!0)),Yt(Zg,e_,t),Yt(Zg,e_,"esm2017")}/**
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
 */class WD{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function zD(t,e,n){var r;if(t=yt(t),cD("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const s=(r=void 0)!==null&&r!==void 0?r:!0,i=new eu,o=(c,u,h)=>{let d=null;c?i.reject(c):(d=new Ea(h,new Sr(t._repo,t._path),dt),i.resolve(new WD(u,d)))},a=dE(t,()=>{});return ID(t._repo,t._path,e,o,a,s),i.promise}_r.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};_r.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};HD();var GD="firebase",KD="10.12.2";/**
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
 */Yt(GD,KD,"app");const fE="@firebase/installations",Hf="0.6.7";/**
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
 */const pE=1e4,mE=`w:${Hf}`,gE="FIS_v2",QD="https://firebaseinstallations.googleapis.com/v1",YD=60*60*1e3,JD="installations",XD="Installations";/**
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
 */const ZD={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},qs=new Xs(JD,XD,ZD);function _E(t){return t instanceof Nn&&t.code.includes("request-failed")}/**
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
 */function yE({projectId:t}){return`${QD}/projects/${t}/installations`}function vE(t){return{token:t.token,requestStatus:2,expiresIn:tM(t.expiresIn),creationTime:Date.now()}}async function wE(t,e){const r=(await e.json()).error;return qs.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function EE({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function eM(t,{refreshToken:e}){const n=EE(t);return n.append("Authorization",nM(e)),n}async function bE(t){const e=await t();return e.status>=500&&e.status<600?t():e}function tM(t){return Number(t.replace("s","000"))}function nM(t){return`${gE} ${t}`}/**
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
 */async function rM({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=yE(t),s=EE(t),i=e.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const o={fid:n,authVersion:gE,appId:t.appId,sdkVersion:mE},a={method:"POST",headers:s,body:JSON.stringify(o)},c=await bE(()=>fetch(r,a));if(c.ok){const u=await c.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:vE(u.authToken)}}else throw await wE("Create Installation",c)}/**
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
 */function IE(t){return new Promise(e=>{setTimeout(e,t)})}/**
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
 */function sM(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const iM=/^[cdef][\w-]{21}$/,hd="";function oM(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=aM(t);return iM.test(n)?n:hd}catch{return hd}}function aM(t){return sM(t).substr(0,22)}/**
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
 */function hu(t){return`${t.appName}!${t.appId}`}/**
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
 */const TE=new Map;function CE(t,e){const n=hu(t);AE(n,e),lM(n,e)}function AE(t,e){const n=TE.get(t);if(n)for(const r of n)r(e)}function lM(t,e){const n=cM();n&&n.postMessage({key:t,fid:e}),uM()}let xs=null;function cM(){return!xs&&"BroadcastChannel"in self&&(xs=new BroadcastChannel("[Firebase] FID Change"),xs.onmessage=t=>{AE(t.data.key,t.data.fid)}),xs}function uM(){TE.size===0&&xs&&(xs.close(),xs=null)}/**
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
 */const hM="firebase-installations-database",dM=1,Hs="firebase-installations-store";let gh=null;function Wf(){return gh||(gh=Jw(hM,dM,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(Hs)}}})),gh}async function _c(t,e){const n=hu(t),s=(await Wf()).transaction(Hs,"readwrite"),i=s.objectStore(Hs),o=await i.get(n);return await i.put(e,n),await s.done,(!o||o.fid!==e.fid)&&CE(t,e.fid),e}async function SE(t){const e=hu(t),r=(await Wf()).transaction(Hs,"readwrite");await r.objectStore(Hs).delete(e),await r.done}async function du(t,e){const n=hu(t),s=(await Wf()).transaction(Hs,"readwrite"),i=s.objectStore(Hs),o=await i.get(n),a=e(o);return a===void 0?await i.delete(n):await i.put(a,n),await s.done,a&&(!o||o.fid!==a.fid)&&CE(t,a.fid),a}/**
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
 */async function zf(t){let e;const n=await du(t.appConfig,r=>{const s=fM(r),i=pM(t,s);return e=i.registrationPromise,i.installationEntry});return n.fid===hd?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function fM(t){const e=t||{fid:oM(),registrationStatus:0};return RE(e)}function pM(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(qs.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=mM(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:gM(t)}:{installationEntry:e}}async function mM(t,e){try{const n=await rM(t,e);return _c(t.appConfig,n)}catch(n){throw _E(n)&&n.customData.serverCode===409?await SE(t.appConfig):await _c(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function gM(t){let e=await O_(t.appConfig);for(;e.registrationStatus===1;)await IE(100),e=await O_(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await zf(t);return r||n}return e}function O_(t){return du(t,e=>{if(!e)throw qs.create("installation-not-found");return RE(e)})}function RE(t){return _M(t)?{fid:t.fid,registrationStatus:0}:t}function _M(t){return t.registrationStatus===1&&t.registrationTime+pE<Date.now()}/**
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
 */async function yM({appConfig:t,heartbeatServiceProvider:e},n){const r=vM(t,n),s=eM(t,n),i=e.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const o={installation:{sdkVersion:mE,appId:t.appId}},a={method:"POST",headers:s,body:JSON.stringify(o)},c=await bE(()=>fetch(r,a));if(c.ok){const u=await c.json();return vE(u)}else throw await wE("Generate Auth Token",c)}function vM(t,{fid:e}){return`${yE(t)}/${e}/authTokens:generate`}/**
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
 */async function Gf(t,e=!1){let n;const r=await du(t.appConfig,i=>{if(!PE(i))throw qs.create("not-registered");const o=i.authToken;if(!e&&bM(o))return i;if(o.requestStatus===1)return n=wM(t,e),i;{if(!navigator.onLine)throw qs.create("app-offline");const a=TM(i);return n=EM(t,a),a}});return n?await n:r.authToken}async function wM(t,e){let n=await D_(t.appConfig);for(;n.authToken.requestStatus===1;)await IE(100),n=await D_(t.appConfig);const r=n.authToken;return r.requestStatus===0?Gf(t,e):r}function D_(t){return du(t,e=>{if(!PE(e))throw qs.create("not-registered");const n=e.authToken;return CM(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function EM(t,e){try{const n=await yM(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await _c(t.appConfig,r),n}catch(n){if(_E(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await SE(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await _c(t.appConfig,r)}throw n}}function PE(t){return t!==void 0&&t.registrationStatus===2}function bM(t){return t.requestStatus===2&&!IM(t)}function IM(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+YD}function TM(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function CM(t){return t.requestStatus===1&&t.requestTime+pE<Date.now()}/**
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
 */async function AM(t){const e=t,{installationEntry:n,registrationPromise:r}=await zf(e);return r?r.catch(console.error):Gf(e).catch(console.error),n.fid}/**
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
 */async function SM(t,e=!1){const n=t;return await RM(n),(await Gf(n,e)).token}async function RM(t){const{registrationPromise:e}=await zf(t);e&&await e}/**
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
 */function PM(t){if(!t||!t.options)throw _h("App Configuration");if(!t.name)throw _h("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw _h(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function _h(t){return qs.create("missing-app-config-values",{valueName:t})}/**
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
 */const xE="installations",xM="installations-internal",kM=t=>{const e=t.getProvider("app").getImmediate(),n=PM(e),r=Ar(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},NM=t=>{const e=t.getProvider("app").getImmediate(),n=Ar(e,xE).getImmediate();return{getId:()=>AM(n),getToken:s=>SM(n,s)}};function OM(){Pn(new wn(xE,kM,"PUBLIC")),Pn(new wn(xM,NM,"PRIVATE"))}OM();Yt(fE,Hf);Yt(fE,Hf,"esm2017");/**
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
 */const yc="analytics",DM="firebase_id",MM="origin",LM=60*1e3,VM="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Kf="https://www.googletagmanager.com/gtag/js";/**
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
 */const ln=new Ma("@firebase/analytics");/**
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
 */const FM={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},vn=new Xs("analytics","Analytics",FM);/**
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
 */function UM(t){if(!t.startsWith(Kf)){const e=vn.create("invalid-gtag-resource",{gtagURL:t});return ln.warn(e.message),""}return t}function kE(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function $M(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function BM(t,e){const n=$M("firebase-js-sdk-policy",{createScriptURL:UM}),r=document.createElement("script"),s=`${Kf}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function jM(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function qM(t,e,n,r,s,i){const o=r[s];try{if(o)await e[o];else{const c=(await kE(n)).find(u=>u.measurementId===s);c&&await e[c.appId]}}catch(a){ln.error(a)}t("config",s,i)}async function HM(t,e,n,r,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const a=await kE(n);for(const c of o){const u=a.find(d=>d.measurementId===c),h=u&&e[u.appId];if(h)i.push(h);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),t("event",r,s||{})}catch(i){ln.error(i)}}function WM(t,e,n,r){async function s(i,...o){try{if(i==="event"){const[a,c]=o;await HM(t,e,n,a,c)}else if(i==="config"){const[a,c]=o;await qM(t,e,n,r,a,c)}else if(i==="consent"){const[a,c]=o;t("consent",a,c)}else if(i==="get"){const[a,c,u]=o;t("get",a,c,u)}else if(i==="set"){const[a]=o;t("set",a)}else t(i,...o)}catch(a){ln.error(a)}}return s}function zM(t,e,n,r,s){let i=function(...o){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=WM(i,t,e,n),{gtagCore:i,wrappedGtag:window[s]}}function GM(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(Kf)&&n.src.includes(t))return n;return null}/**
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
 */const KM=30,QM=1e3;class YM{constructor(e={},n=QM){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const NE=new YM;function JM(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function XM(t){var e;const{appId:n,apiKey:r}=t,s={method:"GET",headers:JM(r)},i=VM.replace("{app-id}",n),o=await fetch(i,s);if(o.status!==200&&o.status!==304){let a="";try{const c=await o.json();!((e=c.error)===null||e===void 0)&&e.message&&(a=c.error.message)}catch{}throw vn.create("config-fetch-failed",{httpStatus:o.status,responseMessage:a})}return o.json()}async function ZM(t,e=NE,n){const{appId:r,apiKey:s,measurementId:i}=t.options;if(!r)throw vn.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:r};throw vn.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new nL;return setTimeout(async()=>{a.abort()},LM),OE({appId:r,apiKey:s,measurementId:i},o,a,e)}async function OE(t,{throttleEndTimeMillis:e,backoffCount:n},r,s=NE){var i;const{appId:o,measurementId:a}=t;try{await eL(r,e)}catch(c){if(a)return ln.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:a};throw c}try{const c=await XM(t);return s.deleteThrottleMetadata(o),c}catch(c){const u=c;if(!tL(u)){if(s.deleteThrottleMetadata(o),a)return ln.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:o,measurementId:a};throw c}const h=Number((i=u==null?void 0:u.customData)===null||i===void 0?void 0:i.httpStatus)===503?qg(n,s.intervalMillis,KM):qg(n,s.intervalMillis),d={throttleEndTimeMillis:Date.now()+h,backoffCount:n+1};return s.setThrottleMetadata(o,d),ln.debug(`Calling attemptFetch again in ${h} millis`),OE(t,d,r,s)}}function eL(t,e){return new Promise((n,r)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(n,s);t.addEventListener(()=>{clearTimeout(i),r(vn.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function tL(t){if(!(t instanceof Nn)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class nL{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function rL(t,e,n,r,s){if(s&&s.global){t("event",n,r);return}else{const i=await e,o=Object.assign(Object.assign({},r),{send_to:i});t("event",n,o)}}/**
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
 */async function sL(){if(Hw())try{await Ww()}catch(t){return ln.warn(vn.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return ln.warn(vn.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function iL(t,e,n,r,s,i,o){var a;const c=ZM(t);c.then(g=>{n[g.measurementId]=g.appId,t.options.measurementId&&g.measurementId!==t.options.measurementId&&ln.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${g.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(g=>ln.error(g)),e.push(c);const u=sL().then(g=>{if(g)return r.getId()}),[h,d]=await Promise.all([c,u]);GM(i)||BM(i,h.measurementId),s("js",new Date);const p=(a=o==null?void 0:o.config)!==null&&a!==void 0?a:{};return p[MM]="firebase",p.update=!0,d!=null&&(p[DM]=d),s("config",h.measurementId,p),h.measurementId}/**
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
 */class oL{constructor(e){this.app=e}_delete(){return delete Jo[this.app.options.appId],Promise.resolve()}}let Jo={},M_=[];const L_={};let yh="dataLayer",aL="gtag",V_,DE,F_=!1;function lL(){const t=[];if(Bw()&&t.push("This is a browser extension environment."),fx()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,s)=>`(${s+1}) ${r}`).join(" "),n=vn.create("invalid-analytics-context",{errorInfo:e});ln.warn(n.message)}}function cL(t,e,n){lL();const r=t.options.appId;if(!r)throw vn.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)ln.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw vn.create("no-api-key");if(Jo[r]!=null)throw vn.create("already-exists",{id:r});if(!F_){jM(yh);const{wrappedGtag:i,gtagCore:o}=zM(Jo,M_,L_,yh,aL);DE=i,V_=o,F_=!0}return Jo[r]=iL(t,M_,L_,e,V_,yh,n),new oL(t)}function uL(t=La()){t=yt(t);const e=Ar(t,yc);return e.isInitialized()?e.getImmediate():hL(t)}function hL(t,e={}){const n=Ar(t,yc);if(n.isInitialized()){const s=n.getImmediate();if(fa(e,n.getOptions()))return s;throw vn.create("already-initialized")}return n.initialize({options:e})}function dL(t,e,n,r){t=yt(t),rL(DE,Jo[t.app.options.appId],e,n,r).catch(s=>ln.error(s))}const U_="@firebase/analytics",$_="0.10.4";function fL(){Pn(new wn(yc,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return cL(r,s,n)},"PUBLIC")),Pn(new wn("analytics-internal",t,"PRIVATE")),Yt(U_,$_),Yt(U_,$_,"esm2017");function t(e){try{const n=e.getProvider(yc).getImmediate();return{logEvent:(r,s,i)=>dL(n,r,s,i)}}catch(n){throw vn.create("interop-component-reg-failed",{reason:n})}}}fL();var B_=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ls,ME;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,y){function w(){}w.prototype=y.prototype,A.D=y.prototype,A.prototype=new w,A.prototype.constructor=A,A.C=function(T,R,I){for(var b=Array(arguments.length-2),Ve=2;Ve<arguments.length;Ve++)b[Ve-2]=arguments[Ve];return y.prototype[R].apply(T,b)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,y,w){w||(w=0);var T=Array(16);if(typeof y=="string")for(var R=0;16>R;++R)T[R]=y.charCodeAt(w++)|y.charCodeAt(w++)<<8|y.charCodeAt(w++)<<16|y.charCodeAt(w++)<<24;else for(R=0;16>R;++R)T[R]=y[w++]|y[w++]<<8|y[w++]<<16|y[w++]<<24;y=A.g[0],w=A.g[1],R=A.g[2];var I=A.g[3],b=y+(I^w&(R^I))+T[0]+3614090360&4294967295;y=w+(b<<7&4294967295|b>>>25),b=I+(R^y&(w^R))+T[1]+3905402710&4294967295,I=y+(b<<12&4294967295|b>>>20),b=R+(w^I&(y^w))+T[2]+606105819&4294967295,R=I+(b<<17&4294967295|b>>>15),b=w+(y^R&(I^y))+T[3]+3250441966&4294967295,w=R+(b<<22&4294967295|b>>>10),b=y+(I^w&(R^I))+T[4]+4118548399&4294967295,y=w+(b<<7&4294967295|b>>>25),b=I+(R^y&(w^R))+T[5]+1200080426&4294967295,I=y+(b<<12&4294967295|b>>>20),b=R+(w^I&(y^w))+T[6]+2821735955&4294967295,R=I+(b<<17&4294967295|b>>>15),b=w+(y^R&(I^y))+T[7]+4249261313&4294967295,w=R+(b<<22&4294967295|b>>>10),b=y+(I^w&(R^I))+T[8]+1770035416&4294967295,y=w+(b<<7&4294967295|b>>>25),b=I+(R^y&(w^R))+T[9]+2336552879&4294967295,I=y+(b<<12&4294967295|b>>>20),b=R+(w^I&(y^w))+T[10]+4294925233&4294967295,R=I+(b<<17&4294967295|b>>>15),b=w+(y^R&(I^y))+T[11]+2304563134&4294967295,w=R+(b<<22&4294967295|b>>>10),b=y+(I^w&(R^I))+T[12]+1804603682&4294967295,y=w+(b<<7&4294967295|b>>>25),b=I+(R^y&(w^R))+T[13]+4254626195&4294967295,I=y+(b<<12&4294967295|b>>>20),b=R+(w^I&(y^w))+T[14]+2792965006&4294967295,R=I+(b<<17&4294967295|b>>>15),b=w+(y^R&(I^y))+T[15]+1236535329&4294967295,w=R+(b<<22&4294967295|b>>>10),b=y+(R^I&(w^R))+T[1]+4129170786&4294967295,y=w+(b<<5&4294967295|b>>>27),b=I+(w^R&(y^w))+T[6]+3225465664&4294967295,I=y+(b<<9&4294967295|b>>>23),b=R+(y^w&(I^y))+T[11]+643717713&4294967295,R=I+(b<<14&4294967295|b>>>18),b=w+(I^y&(R^I))+T[0]+3921069994&4294967295,w=R+(b<<20&4294967295|b>>>12),b=y+(R^I&(w^R))+T[5]+3593408605&4294967295,y=w+(b<<5&4294967295|b>>>27),b=I+(w^R&(y^w))+T[10]+38016083&4294967295,I=y+(b<<9&4294967295|b>>>23),b=R+(y^w&(I^y))+T[15]+3634488961&4294967295,R=I+(b<<14&4294967295|b>>>18),b=w+(I^y&(R^I))+T[4]+3889429448&4294967295,w=R+(b<<20&4294967295|b>>>12),b=y+(R^I&(w^R))+T[9]+568446438&4294967295,y=w+(b<<5&4294967295|b>>>27),b=I+(w^R&(y^w))+T[14]+3275163606&4294967295,I=y+(b<<9&4294967295|b>>>23),b=R+(y^w&(I^y))+T[3]+4107603335&4294967295,R=I+(b<<14&4294967295|b>>>18),b=w+(I^y&(R^I))+T[8]+1163531501&4294967295,w=R+(b<<20&4294967295|b>>>12),b=y+(R^I&(w^R))+T[13]+2850285829&4294967295,y=w+(b<<5&4294967295|b>>>27),b=I+(w^R&(y^w))+T[2]+4243563512&4294967295,I=y+(b<<9&4294967295|b>>>23),b=R+(y^w&(I^y))+T[7]+1735328473&4294967295,R=I+(b<<14&4294967295|b>>>18),b=w+(I^y&(R^I))+T[12]+2368359562&4294967295,w=R+(b<<20&4294967295|b>>>12),b=y+(w^R^I)+T[5]+4294588738&4294967295,y=w+(b<<4&4294967295|b>>>28),b=I+(y^w^R)+T[8]+2272392833&4294967295,I=y+(b<<11&4294967295|b>>>21),b=R+(I^y^w)+T[11]+1839030562&4294967295,R=I+(b<<16&4294967295|b>>>16),b=w+(R^I^y)+T[14]+4259657740&4294967295,w=R+(b<<23&4294967295|b>>>9),b=y+(w^R^I)+T[1]+2763975236&4294967295,y=w+(b<<4&4294967295|b>>>28),b=I+(y^w^R)+T[4]+1272893353&4294967295,I=y+(b<<11&4294967295|b>>>21),b=R+(I^y^w)+T[7]+4139469664&4294967295,R=I+(b<<16&4294967295|b>>>16),b=w+(R^I^y)+T[10]+3200236656&4294967295,w=R+(b<<23&4294967295|b>>>9),b=y+(w^R^I)+T[13]+681279174&4294967295,y=w+(b<<4&4294967295|b>>>28),b=I+(y^w^R)+T[0]+3936430074&4294967295,I=y+(b<<11&4294967295|b>>>21),b=R+(I^y^w)+T[3]+3572445317&4294967295,R=I+(b<<16&4294967295|b>>>16),b=w+(R^I^y)+T[6]+76029189&4294967295,w=R+(b<<23&4294967295|b>>>9),b=y+(w^R^I)+T[9]+3654602809&4294967295,y=w+(b<<4&4294967295|b>>>28),b=I+(y^w^R)+T[12]+3873151461&4294967295,I=y+(b<<11&4294967295|b>>>21),b=R+(I^y^w)+T[15]+530742520&4294967295,R=I+(b<<16&4294967295|b>>>16),b=w+(R^I^y)+T[2]+3299628645&4294967295,w=R+(b<<23&4294967295|b>>>9),b=y+(R^(w|~I))+T[0]+4096336452&4294967295,y=w+(b<<6&4294967295|b>>>26),b=I+(w^(y|~R))+T[7]+1126891415&4294967295,I=y+(b<<10&4294967295|b>>>22),b=R+(y^(I|~w))+T[14]+2878612391&4294967295,R=I+(b<<15&4294967295|b>>>17),b=w+(I^(R|~y))+T[5]+4237533241&4294967295,w=R+(b<<21&4294967295|b>>>11),b=y+(R^(w|~I))+T[12]+1700485571&4294967295,y=w+(b<<6&4294967295|b>>>26),b=I+(w^(y|~R))+T[3]+2399980690&4294967295,I=y+(b<<10&4294967295|b>>>22),b=R+(y^(I|~w))+T[10]+4293915773&4294967295,R=I+(b<<15&4294967295|b>>>17),b=w+(I^(R|~y))+T[1]+2240044497&4294967295,w=R+(b<<21&4294967295|b>>>11),b=y+(R^(w|~I))+T[8]+1873313359&4294967295,y=w+(b<<6&4294967295|b>>>26),b=I+(w^(y|~R))+T[15]+4264355552&4294967295,I=y+(b<<10&4294967295|b>>>22),b=R+(y^(I|~w))+T[6]+2734768916&4294967295,R=I+(b<<15&4294967295|b>>>17),b=w+(I^(R|~y))+T[13]+1309151649&4294967295,w=R+(b<<21&4294967295|b>>>11),b=y+(R^(w|~I))+T[4]+4149444226&4294967295,y=w+(b<<6&4294967295|b>>>26),b=I+(w^(y|~R))+T[11]+3174756917&4294967295,I=y+(b<<10&4294967295|b>>>22),b=R+(y^(I|~w))+T[2]+718787259&4294967295,R=I+(b<<15&4294967295|b>>>17),b=w+(I^(R|~y))+T[9]+3951481745&4294967295,A.g[0]=A.g[0]+y&4294967295,A.g[1]=A.g[1]+(R+(b<<21&4294967295|b>>>11))&4294967295,A.g[2]=A.g[2]+R&4294967295,A.g[3]=A.g[3]+I&4294967295}r.prototype.u=function(A,y){y===void 0&&(y=A.length);for(var w=y-this.blockSize,T=this.B,R=this.h,I=0;I<y;){if(R==0)for(;I<=w;)s(this,A,I),I+=this.blockSize;if(typeof A=="string"){for(;I<y;)if(T[R++]=A.charCodeAt(I++),R==this.blockSize){s(this,T),R=0;break}}else for(;I<y;)if(T[R++]=A[I++],R==this.blockSize){s(this,T),R=0;break}}this.h=R,this.o+=y},r.prototype.v=function(){var A=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);A[0]=128;for(var y=1;y<A.length-8;++y)A[y]=0;var w=8*this.o;for(y=A.length-8;y<A.length;++y)A[y]=w&255,w/=256;for(this.u(A),A=Array(16),y=w=0;4>y;++y)for(var T=0;32>T;T+=8)A[w++]=this.g[y]>>>T&255;return A};function i(A,y){var w=a;return Object.prototype.hasOwnProperty.call(w,A)?w[A]:w[A]=y(A)}function o(A,y){this.h=y;for(var w=[],T=!0,R=A.length-1;0<=R;R--){var I=A[R]|0;T&&I==y||(w[R]=I,T=!1)}this.g=w}var a={};function c(A){return-128<=A&&128>A?i(A,function(y){return new o([y|0],0>y?-1:0)}):new o([A|0],0>A?-1:0)}function u(A){if(isNaN(A)||!isFinite(A))return d;if(0>A)return P(u(-A));for(var y=[],w=1,T=0;A>=w;T++)y[T]=A/w|0,w*=4294967296;return new o(y,0)}function h(A,y){if(A.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(A.charAt(0)=="-")return P(h(A.substring(1),y));if(0<=A.indexOf("-"))throw Error('number format error: interior "-" character');for(var w=u(Math.pow(y,8)),T=d,R=0;R<A.length;R+=8){var I=Math.min(8,A.length-R),b=parseInt(A.substring(R,R+I),y);8>I?(I=u(Math.pow(y,I)),T=T.j(I).add(u(b))):(T=T.j(w),T=T.add(u(b)))}return T}var d=c(0),p=c(1),g=c(16777216);t=o.prototype,t.m=function(){if(S(this))return-P(this).m();for(var A=0,y=1,w=0;w<this.g.length;w++){var T=this.i(w);A+=(0<=T?T:4294967296+T)*y,y*=4294967296}return A},t.toString=function(A){if(A=A||10,2>A||36<A)throw Error("radix out of range: "+A);if(v(this))return"0";if(S(this))return"-"+P(this).toString(A);for(var y=u(Math.pow(A,6)),w=this,T="";;){var R=N(w,y).g;w=M(w,R.j(y));var I=((0<w.g.length?w.g[0]:w.h)>>>0).toString(A);if(w=R,v(w))return I+T;for(;6>I.length;)I="0"+I;T=I+T}},t.i=function(A){return 0>A?0:A<this.g.length?this.g[A]:this.h};function v(A){if(A.h!=0)return!1;for(var y=0;y<A.g.length;y++)if(A.g[y]!=0)return!1;return!0}function S(A){return A.h==-1}t.l=function(A){return A=M(this,A),S(A)?-1:v(A)?0:1};function P(A){for(var y=A.g.length,w=[],T=0;T<y;T++)w[T]=~A.g[T];return new o(w,~A.h).add(p)}t.abs=function(){return S(this)?P(this):this},t.add=function(A){for(var y=Math.max(this.g.length,A.g.length),w=[],T=0,R=0;R<=y;R++){var I=T+(this.i(R)&65535)+(A.i(R)&65535),b=(I>>>16)+(this.i(R)>>>16)+(A.i(R)>>>16);T=b>>>16,I&=65535,b&=65535,w[R]=b<<16|I}return new o(w,w[w.length-1]&-2147483648?-1:0)};function M(A,y){return A.add(P(y))}t.j=function(A){if(v(this)||v(A))return d;if(S(this))return S(A)?P(this).j(P(A)):P(P(this).j(A));if(S(A))return P(this.j(P(A)));if(0>this.l(g)&&0>A.l(g))return u(this.m()*A.m());for(var y=this.g.length+A.g.length,w=[],T=0;T<2*y;T++)w[T]=0;for(T=0;T<this.g.length;T++)for(var R=0;R<A.g.length;R++){var I=this.i(T)>>>16,b=this.i(T)&65535,Ve=A.i(R)>>>16,ht=A.i(R)&65535;w[2*T+2*R]+=b*ht,F(w,2*T+2*R),w[2*T+2*R+1]+=I*ht,F(w,2*T+2*R+1),w[2*T+2*R+1]+=b*Ve,F(w,2*T+2*R+1),w[2*T+2*R+2]+=I*Ve,F(w,2*T+2*R+2)}for(T=0;T<y;T++)w[T]=w[2*T+1]<<16|w[2*T];for(T=y;T<2*y;T++)w[T]=0;return new o(w,0)};function F(A,y){for(;(A[y]&65535)!=A[y];)A[y+1]+=A[y]>>>16,A[y]&=65535,y++}function U(A,y){this.g=A,this.h=y}function N(A,y){if(v(y))throw Error("division by zero");if(v(A))return new U(d,d);if(S(A))return y=N(P(A),y),new U(P(y.g),P(y.h));if(S(y))return y=N(A,P(y)),new U(P(y.g),y.h);if(30<A.g.length){if(S(A)||S(y))throw Error("slowDivide_ only works with positive integers.");for(var w=p,T=y;0>=T.l(A);)w=G(w),T=G(T);var R=B(w,1),I=B(T,1);for(T=B(T,2),w=B(w,2);!v(T);){var b=I.add(T);0>=b.l(A)&&(R=R.add(w),I=b),T=B(T,1),w=B(w,1)}return y=M(A,R.j(y)),new U(R,y)}for(R=d;0<=A.l(y);){for(w=Math.max(1,Math.floor(A.m()/y.m())),T=Math.ceil(Math.log(w)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),I=u(w),b=I.j(y);S(b)||0<b.l(A);)w-=T,I=u(w),b=I.j(y);v(I)&&(I=p),R=R.add(I),A=M(A,b)}return new U(R,A)}t.A=function(A){return N(this,A).h},t.and=function(A){for(var y=Math.max(this.g.length,A.g.length),w=[],T=0;T<y;T++)w[T]=this.i(T)&A.i(T);return new o(w,this.h&A.h)},t.or=function(A){for(var y=Math.max(this.g.length,A.g.length),w=[],T=0;T<y;T++)w[T]=this.i(T)|A.i(T);return new o(w,this.h|A.h)},t.xor=function(A){for(var y=Math.max(this.g.length,A.g.length),w=[],T=0;T<y;T++)w[T]=this.i(T)^A.i(T);return new o(w,this.h^A.h)};function G(A){for(var y=A.g.length+1,w=[],T=0;T<y;T++)w[T]=A.i(T)<<1|A.i(T-1)>>>31;return new o(w,A.h)}function B(A,y){var w=y>>5;y%=32;for(var T=A.g.length-w,R=[],I=0;I<T;I++)R[I]=0<y?A.i(I+w)>>>y|A.i(I+w+1)<<32-y:A.i(I+w);return new o(R,A.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ME=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=h,Ls=o}).apply(typeof B_<"u"?B_:typeof self<"u"?self:typeof window<"u"?window:{});var Sl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var LE,VE,Oo,FE,$l,dd,UE,$E,BE;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,f,m){return l==Array.prototype||l==Object.prototype||(l[f]=m.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof Sl=="object"&&Sl];for(var f=0;f<l.length;++f){var m=l[f];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var r=n(this);function s(l,f){if(f)e:{var m=r;l=l.split(".");for(var _=0;_<l.length-1;_++){var x=l[_];if(!(x in m))break e;m=m[x]}l=l[l.length-1],_=m[l],f=f(_),f!=_&&f!=null&&e(m,l,{configurable:!0,writable:!0,value:f})}}function i(l,f){l instanceof String&&(l+="");var m=0,_=!1,x={next:function(){if(!_&&m<l.length){var O=m++;return{value:f(O,l[O]),done:!1}}return _=!0,{done:!0,value:void 0}}};return x[Symbol.iterator]=function(){return x},x}s("Array.prototype.values",function(l){return l||function(){return i(this,function(f,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function c(l){var f=typeof l;return f=f!="object"?f:l?Array.isArray(l)?"array":f:"null",f=="array"||f=="object"&&typeof l.length=="number"}function u(l){var f=typeof l;return f=="object"&&l!=null||f=="function"}function h(l,f,m){return l.call.apply(l.bind,arguments)}function d(l,f,m){if(!l)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var x=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(x,_),l.apply(f,x)}}return function(){return l.apply(f,arguments)}}function p(l,f,m){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:d,p.apply(null,arguments)}function g(l,f){var m=Array.prototype.slice.call(arguments,1);return function(){var _=m.slice();return _.push.apply(_,arguments),l.apply(this,_)}}function v(l,f){function m(){}m.prototype=f.prototype,l.aa=f.prototype,l.prototype=new m,l.prototype.constructor=l,l.Qb=function(_,x,O){for(var re=Array(arguments.length-2),Xe=2;Xe<arguments.length;Xe++)re[Xe-2]=arguments[Xe];return f.prototype[x].apply(_,re)}}function S(l){const f=l.length;if(0<f){const m=Array(f);for(let _=0;_<f;_++)m[_]=l[_];return m}return[]}function P(l,f){for(let m=1;m<arguments.length;m++){const _=arguments[m];if(c(_)){const x=l.length||0,O=_.length||0;l.length=x+O;for(let re=0;re<O;re++)l[x+re]=_[re]}else l.push(_)}}class M{constructor(f,m){this.i=f,this.j=m,this.h=0,this.g=null}get(){let f;return 0<this.h?(this.h--,f=this.g,this.g=f.next,f.next=null):f=this.i(),f}}function F(l){return/^[\s\xa0]*$/.test(l)}function U(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function N(l){return N[" "](l),l}N[" "]=function(){};var G=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function B(l,f,m){for(const _ in l)f.call(m,l[_],_,l)}function A(l,f){for(const m in l)f.call(void 0,l[m],m,l)}function y(l){const f={};for(const m in l)f[m]=l[m];return f}const w="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(l,f){let m,_;for(let x=1;x<arguments.length;x++){_=arguments[x];for(m in _)l[m]=_[m];for(let O=0;O<w.length;O++)m=w[O],Object.prototype.hasOwnProperty.call(_,m)&&(l[m]=_[m])}}function R(l){var f=1;l=l.split(":");const m=[];for(;0<f&&l.length;)m.push(l.shift()),f--;return l.length&&m.push(l.join(":")),m}function I(l){a.setTimeout(()=>{throw l},0)}function b(){var l=Ge;let f=null;return l.g&&(f=l.g,l.g=l.g.next,l.g||(l.h=null),f.next=null),f}class Ve{constructor(){this.h=this.g=null}add(f,m){const _=ht.get();_.set(f,m),this.h?this.h.next=_:this.g=_,this.h=_}}var ht=new M(()=>new $e,l=>l.reset());class $e{constructor(){this.next=this.g=this.h=null}set(f,m){this.h=f,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let Ce,ve=!1,Ge=new Ve,xt=()=>{const l=a.Promise.resolve(void 0);Ce=()=>{l.then(wt)}};var wt=()=>{for(var l;l=b();){try{l.h.call(l.g)}catch(m){I(m)}var f=ht;f.j(l),100>f.h&&(f.h++,l.next=f.g,f.g=l)}ve=!1};function Ke(){this.s=this.s,this.C=this.C}Ke.prototype.s=!1,Ke.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ke.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function st(l,f){this.type=l,this.g=this.target=f,this.defaultPrevented=!1}st.prototype.h=function(){this.defaultPrevented=!0};var q=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,f=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const m=()=>{};a.addEventListener("test",m,f),a.removeEventListener("test",m,f)}catch{}return l}();function Pe(l,f){if(st.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var m=this.type=l.type,_=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=f,f=l.relatedTarget){if(G){e:{try{N(f.nodeName);var x=!0;break e}catch{}x=!1}x||(f=null)}}else m=="mouseover"?f=l.fromElement:m=="mouseout"&&(f=l.toElement);this.relatedTarget=f,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:ke[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&Pe.aa.h.call(this)}}v(Pe,st);var ke={2:"touch",3:"pen",4:"mouse"};Pe.prototype.h=function(){Pe.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var D="closure_listenable_"+(1e6*Math.random()|0),Y=0;function X(l,f,m,_,x){this.listener=l,this.proxy=null,this.src=f,this.type=m,this.capture=!!_,this.ha=x,this.key=++Y,this.da=this.fa=!1}function ie(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function xe(l){this.src=l,this.g={},this.h=0}xe.prototype.add=function(l,f,m,_,x){var O=l.toString();l=this.g[O],l||(l=this.g[O]=[],this.h++);var re=E(l,f,_,x);return-1<re?(f=l[re],m||(f.fa=!1)):(f=new X(f,this.src,O,!!_,x),f.fa=m,l.push(f)),f};function Qe(l,f){var m=f.type;if(m in l.g){var _=l.g[m],x=Array.prototype.indexOf.call(_,f,void 0),O;(O=0<=x)&&Array.prototype.splice.call(_,x,1),O&&(ie(f),l.g[m].length==0&&(delete l.g[m],l.h--))}}function E(l,f,m,_){for(var x=0;x<l.length;++x){var O=l[x];if(!O.da&&O.listener==f&&O.capture==!!m&&O.ha==_)return x}return-1}var C="closure_lm_"+(1e6*Math.random()|0),k={};function $(l,f,m,_,x){if(Array.isArray(f)){for(var O=0;O<f.length;O++)$(l,f[O],m,_,x);return null}return m=ue(m),l&&l[D]?l.K(f,m,u(_)?!!_.capture:!!_,x):V(l,f,m,!1,_,x)}function V(l,f,m,_,x,O){if(!f)throw Error("Invalid event type");var re=u(x)?!!x.capture:!!x,Xe=oe(l);if(Xe||(l[C]=Xe=new xe(l)),m=Xe.add(f,m,_,re,O),m.proxy)return m;if(_=Q(),m.proxy=_,_.src=l,_.listener=m,l.addEventListener)q||(x=re),x===void 0&&(x=!1),l.addEventListener(f.toString(),_,x);else if(l.attachEvent)l.attachEvent(ne(f.toString()),_);else if(l.addListener&&l.removeListener)l.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return m}function Q(){function l(m){return f.call(l.src,l.listener,m)}const f=z;return l}function se(l,f,m,_,x){if(Array.isArray(f))for(var O=0;O<f.length;O++)se(l,f[O],m,_,x);else _=u(_)?!!_.capture:!!_,m=ue(m),l&&l[D]?(l=l.i,f=String(f).toString(),f in l.g&&(O=l.g[f],m=E(O,m,_,x),-1<m&&(ie(O[m]),Array.prototype.splice.call(O,m,1),O.length==0&&(delete l.g[f],l.h--)))):l&&(l=oe(l))&&(f=l.g[f.toString()],l=-1,f&&(l=E(f,m,_,x)),(m=-1<l?f[l]:null)&&Z(m))}function Z(l){if(typeof l!="number"&&l&&!l.da){var f=l.src;if(f&&f[D])Qe(f.i,l);else{var m=l.type,_=l.proxy;f.removeEventListener?f.removeEventListener(m,_,l.capture):f.detachEvent?f.detachEvent(ne(m),_):f.addListener&&f.removeListener&&f.removeListener(_),(m=oe(f))?(Qe(m,l),m.h==0&&(m.src=null,f[C]=null)):ie(l)}}}function ne(l){return l in k?k[l]:k[l]="on"+l}function z(l,f){if(l.da)l=!0;else{f=new Pe(f,this);var m=l.listener,_=l.ha||l.src;l.fa&&Z(l),l=m.call(_,f)}return l}function oe(l){return l=l[C],l instanceof xe?l:null}var de="__closure_events_fn_"+(1e9*Math.random()>>>0);function ue(l){return typeof l=="function"?l:(l[de]||(l[de]=function(f){return l.handleEvent(f)}),l[de])}function ce(){Ke.call(this),this.i=new xe(this),this.M=this,this.F=null}v(ce,Ke),ce.prototype[D]=!0,ce.prototype.removeEventListener=function(l,f,m,_){se(this,l,f,m,_)};function fe(l,f){var m,_=l.F;if(_)for(m=[];_;_=_.F)m.push(_);if(l=l.M,_=f.type||f,typeof f=="string")f=new st(f,l);else if(f instanceof st)f.target=f.target||l;else{var x=f;f=new st(_,l),T(f,x)}if(x=!0,m)for(var O=m.length-1;0<=O;O--){var re=f.g=m[O];x=Be(re,_,!0,f)&&x}if(re=f.g=l,x=Be(re,_,!0,f)&&x,x=Be(re,_,!1,f)&&x,m)for(O=0;O<m.length;O++)re=f.g=m[O],x=Be(re,_,!1,f)&&x}ce.prototype.N=function(){if(ce.aa.N.call(this),this.i){var l=this.i,f;for(f in l.g){for(var m=l.g[f],_=0;_<m.length;_++)ie(m[_]);delete l.g[f],l.h--}}this.F=null},ce.prototype.K=function(l,f,m,_){return this.i.add(String(l),f,!1,m,_)},ce.prototype.L=function(l,f,m,_){return this.i.add(String(l),f,!0,m,_)};function Be(l,f,m,_){if(f=l.i.g[String(f)],!f)return!0;f=f.concat();for(var x=!0,O=0;O<f.length;++O){var re=f[O];if(re&&!re.da&&re.capture==m){var Xe=re.listener,Mt=re.ha||re.src;re.fa&&Qe(l.i,re),x=Xe.call(Mt,_)!==!1&&x}}return x&&!_.defaultPrevented}function Je(l,f,m){if(typeof l=="function")m&&(l=p(l,m));else if(l&&typeof l.handleEvent=="function")l=p(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(f)?-1:a.setTimeout(l,f||0)}function vt(l){l.g=Je(()=>{l.g=null,l.i&&(l.i=!1,vt(l))},l.l);const f=l.h;l.h=null,l.m.apply(null,f)}class dn extends Ke{constructor(f,m){super(),this.m=f,this.l=m,this.h=null,this.i=!1,this.g=null}j(f){this.h=arguments,this.g?this.i=!0:vt(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function En(l){Ke.call(this),this.h=l,this.g={}}v(En,Ke);var so=[];function Rr(l){B(l.g,function(f,m){this.g.hasOwnProperty(m)&&Z(f)},l),l.g={}}En.prototype.N=function(){En.aa.N.call(this),Rr(this)},En.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var oi=a.JSON.stringify,Zt=a.JSON.parse,bn=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function ai(){}ai.prototype.h=null;function Vp(l){return l.h||(l.h=l.i())}function Fp(){}var io={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ru(){st.call(this,"d")}v(Ru,st);function Pu(){st.call(this,"c")}v(Pu,st);var ps={},Up=null;function Za(){return Up=Up||new ce}ps.La="serverreachability";function $p(l){st.call(this,ps.La,l)}v($p,st);function oo(l){const f=Za();fe(f,new $p(f))}ps.STAT_EVENT="statevent";function Bp(l,f){st.call(this,ps.STAT_EVENT,l),this.stat=f}v(Bp,st);function en(l){const f=Za();fe(f,new Bp(f,l))}ps.Ma="timingevent";function jp(l,f){st.call(this,ps.Ma,l),this.size=f}v(jp,st);function ao(l,f){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},f)}function lo(){this.g=!0}lo.prototype.xa=function(){this.g=!1};function BI(l,f,m,_,x,O){l.info(function(){if(l.g)if(O)for(var re="",Xe=O.split("&"),Mt=0;Mt<Xe.length;Mt++){var qe=Xe[Mt].split("=");if(1<qe.length){var qt=qe[0];qe=qe[1];var Ht=qt.split("_");re=2<=Ht.length&&Ht[1]=="type"?re+(qt+"="+qe+"&"):re+(qt+"=redacted&")}}else re=null;else re=O;return"XMLHTTP REQ ("+_+") [attempt "+x+"]: "+f+`
`+m+`
`+re})}function jI(l,f,m,_,x,O,re){l.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+x+"]: "+f+`
`+m+`
`+O+" "+re})}function li(l,f,m,_){l.info(function(){return"XMLHTTP TEXT ("+f+"): "+HI(l,m)+(_?" "+_:"")})}function qI(l,f){l.info(function(){return"TIMEOUT: "+f})}lo.prototype.info=function(){};function HI(l,f){if(!l.g)return f;if(!f)return null;try{var m=JSON.parse(f);if(m){for(l=0;l<m.length;l++)if(Array.isArray(m[l])){var _=m[l];if(!(2>_.length)){var x=_[1];if(Array.isArray(x)&&!(1>x.length)){var O=x[0];if(O!="noop"&&O!="stop"&&O!="close")for(var re=1;re<x.length;re++)x[re]=""}}}}return oi(m)}catch{return f}}var el={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},qp={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},xu;function tl(){}v(tl,ai),tl.prototype.g=function(){return new XMLHttpRequest},tl.prototype.i=function(){return{}},xu=new tl;function Pr(l,f,m,_){this.j=l,this.i=f,this.l=m,this.R=_||1,this.U=new En(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Hp}function Hp(){this.i=null,this.g="",this.h=!1}var Wp={},ku={};function Nu(l,f,m){l.L=1,l.v=il(or(f)),l.m=m,l.P=!0,zp(l,null)}function zp(l,f){l.F=Date.now(),nl(l),l.A=or(l.v);var m=l.A,_=l.R;Array.isArray(_)||(_=[String(_)]),om(m.i,"t",_),l.C=0,m=l.j.J,l.h=new Hp,l.g=Tm(l.j,m?f:null,!l.m),0<l.O&&(l.M=new dn(p(l.Y,l,l.g),l.O)),f=l.U,m=l.g,_=l.ca;var x="readystatechange";Array.isArray(x)||(x&&(so[0]=x.toString()),x=so);for(var O=0;O<x.length;O++){var re=$(m,x[O],_||f.handleEvent,!1,f.h||f);if(!re)break;f.g[re.key]=re}f=l.H?y(l.H):{},l.m?(l.u||(l.u="POST"),f["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,f)):(l.u="GET",l.g.ea(l.A,l.u,null,f)),oo(),BI(l.i,l.u,l.A,l.l,l.R,l.m)}Pr.prototype.ca=function(l){l=l.target;const f=this.M;f&&ar(l)==3?f.j():this.Y(l)},Pr.prototype.Y=function(l){try{if(l==this.g)e:{const Ht=ar(this.g);var f=this.g.Ba();const hi=this.g.Z();if(!(3>Ht)&&(Ht!=3||this.g&&(this.h.h||this.g.oa()||fm(this.g)))){this.J||Ht!=4||f==7||(f==8||0>=hi?oo(3):oo(2)),Ou(this);var m=this.g.Z();this.X=m;t:if(Gp(this)){var _=fm(this.g);l="";var x=_.length,O=ar(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ms(this),co(this);var re="";break t}this.h.i=new a.TextDecoder}for(f=0;f<x;f++)this.h.h=!0,l+=this.h.i.decode(_[f],{stream:!(O&&f==x-1)});_.length=0,this.h.g+=l,this.C=0,re=this.h.g}else re=this.g.oa();if(this.o=m==200,jI(this.i,this.u,this.A,this.l,this.R,Ht,m),this.o){if(this.T&&!this.K){t:{if(this.g){var Xe,Mt=this.g;if((Xe=Mt.g?Mt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!F(Xe)){var qe=Xe;break t}}qe=null}if(m=qe)li(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Du(this,m);else{this.o=!1,this.s=3,en(12),ms(this),co(this);break e}}if(this.P){m=!0;let On;for(;!this.J&&this.C<re.length;)if(On=WI(this,re),On==ku){Ht==4&&(this.s=4,en(14),m=!1),li(this.i,this.l,null,"[Incomplete Response]");break}else if(On==Wp){this.s=4,en(15),li(this.i,this.l,re,"[Invalid Chunk]"),m=!1;break}else li(this.i,this.l,On,null),Du(this,On);if(Gp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ht!=4||re.length!=0||this.h.h||(this.s=1,en(16),m=!1),this.o=this.o&&m,!m)li(this.i,this.l,re,"[Invalid Chunked Response]"),ms(this),co(this);else if(0<re.length&&!this.W){this.W=!0;var qt=this.j;qt.g==this&&qt.ba&&!qt.M&&(qt.j.info("Great, no buffering proxy detected. Bytes received: "+re.length),$u(qt),qt.M=!0,en(11))}}else li(this.i,this.l,re,null),Du(this,re);Ht==4&&ms(this),this.o&&!this.J&&(Ht==4?wm(this.j,this):(this.o=!1,nl(this)))}else lT(this.g),m==400&&0<re.indexOf("Unknown SID")?(this.s=3,en(12)):(this.s=0,en(13)),ms(this),co(this)}}}catch{}finally{}};function Gp(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function WI(l,f){var m=l.C,_=f.indexOf(`
`,m);return _==-1?ku:(m=Number(f.substring(m,_)),isNaN(m)?Wp:(_+=1,_+m>f.length?ku:(f=f.slice(_,_+m),l.C=_+m,f)))}Pr.prototype.cancel=function(){this.J=!0,ms(this)};function nl(l){l.S=Date.now()+l.I,Kp(l,l.I)}function Kp(l,f){if(l.B!=null)throw Error("WatchDog timer not null");l.B=ao(p(l.ba,l),f)}function Ou(l){l.B&&(a.clearTimeout(l.B),l.B=null)}Pr.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(qI(this.i,this.A),this.L!=2&&(oo(),en(17)),ms(this),this.s=2,co(this)):Kp(this,this.S-l)};function co(l){l.j.G==0||l.J||wm(l.j,l)}function ms(l){Ou(l);var f=l.M;f&&typeof f.ma=="function"&&f.ma(),l.M=null,Rr(l.U),l.g&&(f=l.g,l.g=null,f.abort(),f.ma())}function Du(l,f){try{var m=l.j;if(m.G!=0&&(m.g==l||Mu(m.h,l))){if(!l.K&&Mu(m.h,l)&&m.G==3){try{var _=m.Da.g.parse(f)}catch{_=null}if(Array.isArray(_)&&_.length==3){var x=_;if(x[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<l.F)ul(m),ll(m);else break e;Uu(m),en(18)}}else m.za=x[1],0<m.za-m.T&&37500>x[2]&&m.F&&m.v==0&&!m.C&&(m.C=ao(p(m.Za,m),6e3));if(1>=Jp(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else _s(m,11)}else if((l.K||m.g==l)&&ul(m),!F(f))for(x=m.Da.g.parse(f),f=0;f<x.length;f++){let qe=x[f];if(m.T=qe[0],qe=qe[1],m.G==2)if(qe[0]=="c"){m.K=qe[1],m.ia=qe[2];const qt=qe[3];qt!=null&&(m.la=qt,m.j.info("VER="+m.la));const Ht=qe[4];Ht!=null&&(m.Aa=Ht,m.j.info("SVER="+m.Aa));const hi=qe[5];hi!=null&&typeof hi=="number"&&0<hi&&(_=1.5*hi,m.L=_,m.j.info("backChannelRequestTimeoutMs_="+_)),_=m;const On=l.g;if(On){const dl=On.g?On.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(dl){var O=_.h;O.g||dl.indexOf("spdy")==-1&&dl.indexOf("quic")==-1&&dl.indexOf("h2")==-1||(O.j=O.l,O.g=new Set,O.h&&(Lu(O,O.h),O.h=null))}if(_.D){const Bu=On.g?On.g.getResponseHeader("X-HTTP-Session-Id"):null;Bu&&(_.ya=Bu,it(_.I,_.D,Bu))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-l.F,m.j.info("Handshake RTT: "+m.R+"ms")),_=m;var re=l;if(_.qa=Im(_,_.J?_.ia:null,_.W),re.K){Xp(_.h,re);var Xe=re,Mt=_.L;Mt&&(Xe.I=Mt),Xe.B&&(Ou(Xe),nl(Xe)),_.g=re}else ym(_);0<m.i.length&&cl(m)}else qe[0]!="stop"&&qe[0]!="close"||_s(m,7);else m.G==3&&(qe[0]=="stop"||qe[0]=="close"?qe[0]=="stop"?_s(m,7):Fu(m):qe[0]!="noop"&&m.l&&m.l.ta(qe),m.v=0)}}oo(4)}catch{}}var zI=class{constructor(l,f){this.g=l,this.map=f}};function Qp(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Yp(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function Jp(l){return l.h?1:l.g?l.g.size:0}function Mu(l,f){return l.h?l.h==f:l.g?l.g.has(f):!1}function Lu(l,f){l.g?l.g.add(f):l.h=f}function Xp(l,f){l.h&&l.h==f?l.h=null:l.g&&l.g.has(f)&&l.g.delete(f)}Qp.prototype.cancel=function(){if(this.i=Zp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function Zp(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let f=l.i;for(const m of l.g.values())f=f.concat(m.D);return f}return S(l.i)}function GI(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(c(l)){for(var f=[],m=l.length,_=0;_<m;_++)f.push(l[_]);return f}f=[],m=0;for(_ in l)f[m++]=l[_];return f}function KI(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(c(l)||typeof l=="string"){var f=[];l=l.length;for(var m=0;m<l;m++)f.push(m);return f}f=[],m=0;for(const _ in l)f[m++]=_;return f}}}function em(l,f){if(l.forEach&&typeof l.forEach=="function")l.forEach(f,void 0);else if(c(l)||typeof l=="string")Array.prototype.forEach.call(l,f,void 0);else for(var m=KI(l),_=GI(l),x=_.length,O=0;O<x;O++)f.call(void 0,_[O],m&&m[O],l)}var tm=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function QI(l,f){if(l){l=l.split("&");for(var m=0;m<l.length;m++){var _=l[m].indexOf("="),x=null;if(0<=_){var O=l[m].substring(0,_);x=l[m].substring(_+1)}else O=l[m];f(O,x?decodeURIComponent(x.replace(/\+/g," ")):"")}}}function gs(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof gs){this.h=l.h,rl(this,l.j),this.o=l.o,this.g=l.g,sl(this,l.s),this.l=l.l;var f=l.i,m=new fo;m.i=f.i,f.g&&(m.g=new Map(f.g),m.h=f.h),nm(this,m),this.m=l.m}else l&&(f=String(l).match(tm))?(this.h=!1,rl(this,f[1]||"",!0),this.o=uo(f[2]||""),this.g=uo(f[3]||"",!0),sl(this,f[4]),this.l=uo(f[5]||"",!0),nm(this,f[6]||"",!0),this.m=uo(f[7]||"")):(this.h=!1,this.i=new fo(null,this.h))}gs.prototype.toString=function(){var l=[],f=this.j;f&&l.push(ho(f,rm,!0),":");var m=this.g;return(m||f=="file")&&(l.push("//"),(f=this.o)&&l.push(ho(f,rm,!0),"@"),l.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&l.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&l.push("/"),l.push(ho(m,m.charAt(0)=="/"?XI:JI,!0))),(m=this.i.toString())&&l.push("?",m),(m=this.m)&&l.push("#",ho(m,eT)),l.join("")};function or(l){return new gs(l)}function rl(l,f,m){l.j=m?uo(f,!0):f,l.j&&(l.j=l.j.replace(/:$/,""))}function sl(l,f){if(f){if(f=Number(f),isNaN(f)||0>f)throw Error("Bad port number "+f);l.s=f}else l.s=null}function nm(l,f,m){f instanceof fo?(l.i=f,tT(l.i,l.h)):(m||(f=ho(f,ZI)),l.i=new fo(f,l.h))}function it(l,f,m){l.i.set(f,m)}function il(l){return it(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function uo(l,f){return l?f?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function ho(l,f,m){return typeof l=="string"?(l=encodeURI(l).replace(f,YI),m&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function YI(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var rm=/[#\/\?@]/g,JI=/[#\?:]/g,XI=/[#\?]/g,ZI=/[#\?@]/g,eT=/#/g;function fo(l,f){this.h=this.g=null,this.i=l||null,this.j=!!f}function xr(l){l.g||(l.g=new Map,l.h=0,l.i&&QI(l.i,function(f,m){l.add(decodeURIComponent(f.replace(/\+/g," ")),m)}))}t=fo.prototype,t.add=function(l,f){xr(this),this.i=null,l=ci(this,l);var m=this.g.get(l);return m||this.g.set(l,m=[]),m.push(f),this.h+=1,this};function sm(l,f){xr(l),f=ci(l,f),l.g.has(f)&&(l.i=null,l.h-=l.g.get(f).length,l.g.delete(f))}function im(l,f){return xr(l),f=ci(l,f),l.g.has(f)}t.forEach=function(l,f){xr(this),this.g.forEach(function(m,_){m.forEach(function(x){l.call(f,x,_,this)},this)},this)},t.na=function(){xr(this);const l=Array.from(this.g.values()),f=Array.from(this.g.keys()),m=[];for(let _=0;_<f.length;_++){const x=l[_];for(let O=0;O<x.length;O++)m.push(f[_])}return m},t.V=function(l){xr(this);let f=[];if(typeof l=="string")im(this,l)&&(f=f.concat(this.g.get(ci(this,l))));else{l=Array.from(this.g.values());for(let m=0;m<l.length;m++)f=f.concat(l[m])}return f},t.set=function(l,f){return xr(this),this.i=null,l=ci(this,l),im(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[f]),this.h+=1,this},t.get=function(l,f){return l?(l=this.V(l),0<l.length?String(l[0]):f):f};function om(l,f,m){sm(l,f),0<m.length&&(l.i=null,l.g.set(ci(l,f),S(m)),l.h+=m.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],f=Array.from(this.g.keys());for(var m=0;m<f.length;m++){var _=f[m];const O=encodeURIComponent(String(_)),re=this.V(_);for(_=0;_<re.length;_++){var x=O;re[_]!==""&&(x+="="+encodeURIComponent(String(re[_]))),l.push(x)}}return this.i=l.join("&")};function ci(l,f){return f=String(f),l.j&&(f=f.toLowerCase()),f}function tT(l,f){f&&!l.j&&(xr(l),l.i=null,l.g.forEach(function(m,_){var x=_.toLowerCase();_!=x&&(sm(this,_),om(this,x,m))},l)),l.j=f}function nT(l,f){const m=new lo;if(a.Image){const _=new Image;_.onload=g(kr,m,"TestLoadImage: loaded",!0,f,_),_.onerror=g(kr,m,"TestLoadImage: error",!1,f,_),_.onabort=g(kr,m,"TestLoadImage: abort",!1,f,_),_.ontimeout=g(kr,m,"TestLoadImage: timeout",!1,f,_),a.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=l}else f(!1)}function rT(l,f){const m=new lo,_=new AbortController,x=setTimeout(()=>{_.abort(),kr(m,"TestPingServer: timeout",!1,f)},1e4);fetch(l,{signal:_.signal}).then(O=>{clearTimeout(x),O.ok?kr(m,"TestPingServer: ok",!0,f):kr(m,"TestPingServer: server error",!1,f)}).catch(()=>{clearTimeout(x),kr(m,"TestPingServer: error",!1,f)})}function kr(l,f,m,_,x){try{x&&(x.onload=null,x.onerror=null,x.onabort=null,x.ontimeout=null),_(m)}catch{}}function sT(){this.g=new bn}function iT(l,f,m){const _=m||"";try{em(l,function(x,O){let re=x;u(x)&&(re=oi(x)),f.push(_+O+"="+encodeURIComponent(re))})}catch(x){throw f.push(_+"type="+encodeURIComponent("_badmap")),x}}function po(l){this.l=l.Ub||null,this.j=l.eb||!1}v(po,ai),po.prototype.g=function(){return new ol(this.l,this.j)},po.prototype.i=function(l){return function(){return l}}({});function ol(l,f){ce.call(this),this.D=l,this.o=f,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}v(ol,ce),t=ol.prototype,t.open=function(l,f){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=f,this.readyState=1,go(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const f={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(f.body=l),(this.D||a).fetch(new Request(this.A,f)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,mo(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,go(this)),this.g&&(this.readyState=3,go(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;am(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function am(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var f=l.value?l.value:new Uint8Array(0);(f=this.v.decode(f,{stream:!l.done}))&&(this.response=this.responseText+=f)}l.done?mo(this):go(this),this.readyState==3&&am(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,mo(this))},t.Qa=function(l){this.g&&(this.response=l,mo(this))},t.ga=function(){this.g&&mo(this)};function mo(l){l.readyState=4,l.l=null,l.j=null,l.v=null,go(l)}t.setRequestHeader=function(l,f){this.u.append(l,f)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],f=this.h.entries();for(var m=f.next();!m.done;)m=m.value,l.push(m[0]+": "+m[1]),m=f.next();return l.join(`\r
`)};function go(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(ol.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function lm(l){let f="";return B(l,function(m,_){f+=_,f+=":",f+=m,f+=`\r
`}),f}function Vu(l,f,m){e:{for(_ in m){var _=!1;break e}_=!0}_||(m=lm(m),typeof l=="string"?m!=null&&encodeURIComponent(String(m)):it(l,f,m))}function gt(l){ce.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}v(gt,ce);var oT=/^https?$/i,aT=["POST","PUT"];t=gt.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,f,m,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);f=f?f.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():xu.g(),this.v=this.o?Vp(this.o):Vp(xu),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(f,String(l),!0),this.B=!1}catch(O){cm(this,O);return}if(l=m||"",m=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var x in _)m.set(x,_[x]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const O of _.keys())m.set(O,_.get(O));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(m.keys()).find(O=>O.toLowerCase()=="content-type"),x=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(aT,f,void 0))||_||x||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[O,re]of m)this.g.setRequestHeader(O,re);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{dm(this),this.u=!0,this.g.send(l),this.u=!1}catch(O){cm(this,O)}};function cm(l,f){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=f,l.m=5,um(l),al(l)}function um(l){l.A||(l.A=!0,fe(l,"complete"),fe(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,fe(this,"complete"),fe(this,"abort"),al(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),al(this,!0)),gt.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?hm(this):this.bb())},t.bb=function(){hm(this)};function hm(l){if(l.h&&typeof o<"u"&&(!l.v[1]||ar(l)!=4||l.Z()!=2)){if(l.u&&ar(l)==4)Je(l.Ea,0,l);else if(fe(l,"readystatechange"),ar(l)==4){l.h=!1;try{const re=l.Z();e:switch(re){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var f=!0;break e;default:f=!1}var m;if(!(m=f)){var _;if(_=re===0){var x=String(l.D).match(tm)[1]||null;!x&&a.self&&a.self.location&&(x=a.self.location.protocol.slice(0,-1)),_=!oT.test(x?x.toLowerCase():"")}m=_}if(m)fe(l,"complete"),fe(l,"success");else{l.m=6;try{var O=2<ar(l)?l.g.statusText:""}catch{O=""}l.l=O+" ["+l.Z()+"]",um(l)}}finally{al(l)}}}}function al(l,f){if(l.g){dm(l);const m=l.g,_=l.v[0]?()=>{}:null;l.g=null,l.v=null,f||fe(l,"ready");try{m.onreadystatechange=_}catch{}}}function dm(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function ar(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<ar(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var f=this.g.responseText;return l&&f.indexOf(l)==0&&(f=f.substring(l.length)),Zt(f)}};function fm(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function lT(l){const f={};l=(l.g&&2<=ar(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<l.length;_++){if(F(l[_]))continue;var m=R(l[_]);const x=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const O=f[x]||[];f[x]=O,O.push(m)}A(f,function(_){return _.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _o(l,f,m){return m&&m.internalChannelParams&&m.internalChannelParams[l]||f}function pm(l){this.Aa=0,this.i=[],this.j=new lo,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_o("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_o("baseRetryDelayMs",5e3,l),this.cb=_o("retryDelaySeedMs",1e4,l),this.Wa=_o("forwardChannelMaxRetries",2,l),this.wa=_o("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new Qp(l&&l.concurrentRequestLimit),this.Da=new sT,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=pm.prototype,t.la=8,t.G=1,t.connect=function(l,f,m,_){en(0),this.W=l,this.H=f||{},m&&_!==void 0&&(this.H.OSID=m,this.H.OAID=_),this.F=this.X,this.I=Im(this,null,this.W),cl(this)};function Fu(l){if(mm(l),l.G==3){var f=l.U++,m=or(l.I);if(it(m,"SID",l.K),it(m,"RID",f),it(m,"TYPE","terminate"),yo(l,m),f=new Pr(l,l.j,f),f.L=2,f.v=il(or(m)),m=!1,a.navigator&&a.navigator.sendBeacon)try{m=a.navigator.sendBeacon(f.v.toString(),"")}catch{}!m&&a.Image&&(new Image().src=f.v,m=!0),m||(f.g=Tm(f.j,null),f.g.ea(f.v)),f.F=Date.now(),nl(f)}bm(l)}function ll(l){l.g&&($u(l),l.g.cancel(),l.g=null)}function mm(l){ll(l),l.u&&(a.clearTimeout(l.u),l.u=null),ul(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function cl(l){if(!Yp(l.h)&&!l.s){l.s=!0;var f=l.Ga;Ce||xt(),ve||(Ce(),ve=!0),Ge.add(f,l),l.B=0}}function cT(l,f){return Jp(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=f.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=ao(p(l.Ga,l,f),Em(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const x=new Pr(this,this.j,l);let O=this.o;if(this.S&&(O?(O=y(O),T(O,this.S)):O=this.S),this.m!==null||this.O||(x.H=O,O=null),this.P)e:{for(var f=0,m=0;m<this.i.length;m++){t:{var _=this.i[m];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(f+=_,4096<f){f=m;break e}if(f===4096||m===this.i.length-1){f=m+1;break e}}f=1e3}else f=1e3;f=_m(this,x,f),m=or(this.I),it(m,"RID",l),it(m,"CVER",22),this.D&&it(m,"X-HTTP-Session-Id",this.D),yo(this,m),O&&(this.O?f="headers="+encodeURIComponent(String(lm(O)))+"&"+f:this.m&&Vu(m,this.m,O)),Lu(this.h,x),this.Ua&&it(m,"TYPE","init"),this.P?(it(m,"$req",f),it(m,"SID","null"),x.T=!0,Nu(x,m,null)):Nu(x,m,f),this.G=2}}else this.G==3&&(l?gm(this,l):this.i.length==0||Yp(this.h)||gm(this))};function gm(l,f){var m;f?m=f.l:m=l.U++;const _=or(l.I);it(_,"SID",l.K),it(_,"RID",m),it(_,"AID",l.T),yo(l,_),l.m&&l.o&&Vu(_,l.m,l.o),m=new Pr(l,l.j,m,l.B+1),l.m===null&&(m.H=l.o),f&&(l.i=f.D.concat(l.i)),f=_m(l,m,1e3),m.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),Lu(l.h,m),Nu(m,_,f)}function yo(l,f){l.H&&B(l.H,function(m,_){it(f,_,m)}),l.l&&em({},function(m,_){it(f,_,m)})}function _m(l,f,m){m=Math.min(l.i.length,m);var _=l.l?p(l.l.Na,l.l,l):null;e:{var x=l.i;let O=-1;for(;;){const re=["count="+m];O==-1?0<m?(O=x[0].g,re.push("ofs="+O)):O=0:re.push("ofs="+O);let Xe=!0;for(let Mt=0;Mt<m;Mt++){let qe=x[Mt].g;const qt=x[Mt].map;if(qe-=O,0>qe)O=Math.max(0,x[Mt].g-100),Xe=!1;else try{iT(qt,re,"req"+qe+"_")}catch{_&&_(qt)}}if(Xe){_=re.join("&");break e}}}return l=l.i.splice(0,m),f.D=l,_}function ym(l){if(!l.g&&!l.u){l.Y=1;var f=l.Fa;Ce||xt(),ve||(Ce(),ve=!0),Ge.add(f,l),l.v=0}}function Uu(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=ao(p(l.Fa,l),Em(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,vm(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=ao(p(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,en(10),ll(this),vm(this))};function $u(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function vm(l){l.g=new Pr(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var f=or(l.qa);it(f,"RID","rpc"),it(f,"SID",l.K),it(f,"AID",l.T),it(f,"CI",l.F?"0":"1"),!l.F&&l.ja&&it(f,"TO",l.ja),it(f,"TYPE","xmlhttp"),yo(l,f),l.m&&l.o&&Vu(f,l.m,l.o),l.L&&(l.g.I=l.L);var m=l.g;l=l.ia,m.L=1,m.v=il(or(f)),m.m=null,m.P=!0,zp(m,l)}t.Za=function(){this.C!=null&&(this.C=null,ll(this),Uu(this),en(19))};function ul(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function wm(l,f){var m=null;if(l.g==f){ul(l),$u(l),l.g=null;var _=2}else if(Mu(l.h,f))m=f.D,Xp(l.h,f),_=1;else return;if(l.G!=0){if(f.o)if(_==1){m=f.m?f.m.length:0,f=Date.now()-f.F;var x=l.B;_=Za(),fe(_,new jp(_,m)),cl(l)}else ym(l);else if(x=f.s,x==3||x==0&&0<f.X||!(_==1&&cT(l,f)||_==2&&Uu(l)))switch(m&&0<m.length&&(f=l.h,f.i=f.i.concat(m)),x){case 1:_s(l,5);break;case 4:_s(l,10);break;case 3:_s(l,6);break;default:_s(l,2)}}}function Em(l,f){let m=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(m*=2),m*f}function _s(l,f){if(l.j.info("Error code "+f),f==2){var m=p(l.fb,l),_=l.Xa;const x=!_;_=new gs(_||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||rl(_,"https"),il(_),x?nT(_.toString(),m):rT(_.toString(),m)}else en(2);l.G=0,l.l&&l.l.sa(f),bm(l),mm(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),en(2)):(this.j.info("Failed to ping google.com"),en(1))};function bm(l){if(l.G=0,l.ka=[],l.l){const f=Zp(l.h);(f.length!=0||l.i.length!=0)&&(P(l.ka,f),P(l.ka,l.i),l.h.i.length=0,S(l.i),l.i.length=0),l.l.ra()}}function Im(l,f,m){var _=m instanceof gs?or(m):new gs(m);if(_.g!="")f&&(_.g=f+"."+_.g),sl(_,_.s);else{var x=a.location;_=x.protocol,f=f?f+"."+x.hostname:x.hostname,x=+x.port;var O=new gs(null);_&&rl(O,_),f&&(O.g=f),x&&sl(O,x),m&&(O.l=m),_=O}return m=l.D,f=l.ya,m&&f&&it(_,m,f),it(_,"VER",l.la),yo(l,_),_}function Tm(l,f,m){if(f&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return f=l.Ca&&!l.pa?new gt(new po({eb:m})):new gt(l.pa),f.Ha(l.J),f}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Cm(){}t=Cm.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function hl(){}hl.prototype.g=function(l,f){return new fn(l,f)};function fn(l,f){ce.call(this),this.g=new pm(f),this.l=l,this.h=f&&f.messageUrlParams||null,l=f&&f.messageHeaders||null,f&&f.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=f&&f.initMessageHeaders||null,f&&f.messageContentType&&(l?l["X-WebChannel-Content-Type"]=f.messageContentType:l={"X-WebChannel-Content-Type":f.messageContentType}),f&&f.va&&(l?l["X-WebChannel-Client-Profile"]=f.va:l={"X-WebChannel-Client-Profile":f.va}),this.g.S=l,(l=f&&f.Sb)&&!F(l)&&(this.g.m=l),this.v=f&&f.supportsCrossDomainXhr||!1,this.u=f&&f.sendRawJson||!1,(f=f&&f.httpSessionIdParam)&&!F(f)&&(this.g.D=f,l=this.h,l!==null&&f in l&&(l=this.h,f in l&&delete l[f])),this.j=new ui(this)}v(fn,ce),fn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},fn.prototype.close=function(){Fu(this.g)},fn.prototype.o=function(l){var f=this.g;if(typeof l=="string"){var m={};m.__data__=l,l=m}else this.u&&(m={},m.__data__=oi(l),l=m);f.i.push(new zI(f.Ya++,l)),f.G==3&&cl(f)},fn.prototype.N=function(){this.g.l=null,delete this.j,Fu(this.g),delete this.g,fn.aa.N.call(this)};function Am(l){Ru.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var f=l.__sm__;if(f){e:{for(const m in f){l=m;break e}l=void 0}(this.i=l)&&(l=this.i,f=f!==null&&l in f?f[l]:void 0),this.data=f}else this.data=l}v(Am,Ru);function Sm(){Pu.call(this),this.status=1}v(Sm,Pu);function ui(l){this.g=l}v(ui,Cm),ui.prototype.ua=function(){fe(this.g,"a")},ui.prototype.ta=function(l){fe(this.g,new Am(l))},ui.prototype.sa=function(l){fe(this.g,new Sm)},ui.prototype.ra=function(){fe(this.g,"b")},hl.prototype.createWebChannel=hl.prototype.g,fn.prototype.send=fn.prototype.o,fn.prototype.open=fn.prototype.m,fn.prototype.close=fn.prototype.close,BE=function(){return new hl},$E=function(){return Za()},UE=ps,dd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},el.NO_ERROR=0,el.TIMEOUT=8,el.HTTP_ERROR=6,$l=el,qp.COMPLETE="complete",FE=qp,Fp.EventType=io,io.OPEN="a",io.CLOSE="b",io.ERROR="c",io.MESSAGE="d",ce.prototype.listen=ce.prototype.K,Oo=Fp,VE=po,gt.prototype.listenOnce=gt.prototype.L,gt.prototype.getLastError=gt.prototype.Ka,gt.prototype.getLastErrorCode=gt.prototype.Ba,gt.prototype.getStatus=gt.prototype.Z,gt.prototype.getResponseJson=gt.prototype.Oa,gt.prototype.getResponseText=gt.prototype.oa,gt.prototype.send=gt.prototype.ea,gt.prototype.setWithCredentials=gt.prototype.Ha,LE=gt}).apply(typeof Sl<"u"?Sl:typeof self<"u"?self:typeof window<"u"?window:{});const j_="@firebase/firestore";/**
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
 */class zt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}zt.UNAUTHENTICATED=new zt(null),zt.GOOGLE_CREDENTIALS=new zt("google-credentials-uid"),zt.FIRST_PARTY=new zt("first-party-uid"),zt.MOCK_USER=new zt("mock-user");/**
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
 */let Zi="10.12.1";/**
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
 */const Ws=new Ma("@firebase/firestore");function Ro(){return Ws.logLevel}function le(t,...e){if(Ws.logLevel<=Me.DEBUG){const n=e.map(Qf);Ws.debug(`Firestore (${Zi}): ${t}`,...n)}}function br(t,...e){if(Ws.logLevel<=Me.ERROR){const n=e.map(Qf);Ws.error(`Firestore (${Zi}): ${t}`,...n)}}function Ui(t,...e){if(Ws.logLevel<=Me.WARN){const n=e.map(Qf);Ws.warn(`Firestore (${Zi}): ${t}`,...n)}}function Qf(t){if(typeof t=="string")return t;try{/**
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
 */function Ee(t="Unexpected state"){const e=`FIRESTORE (${Zi}) INTERNAL ASSERTION FAILED: `+t;throw br(e),new Error(e)}function nt(t,e){t||Ee()}function Te(t,e){return t}/**
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
 */const K={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class me extends Nn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class ts{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
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
 */class jE{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class pL{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(zt.UNAUTHENTICATED))}shutdown(){}}class mL{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class gL{constructor(e){this.t=e,this.currentUser=zt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){let r=this.i;const s=c=>this.i!==r?(r=this.i,n(c)):Promise.resolve();let i=new ts;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ts,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},a=c=>{le("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit(c=>a(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?a(c):(le("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ts)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(le("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(nt(typeof r.accessToken=="string"),new jE(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return nt(e===null||typeof e=="string"),new zt(e)}}class _L{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=zt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class yL{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new _L(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(zt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class vL{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class wL{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){const r=i=>{i.error!=null&&le("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,le("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{le("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):le("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(nt(typeof n.token=="string"),this.R=n.token,new vL(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
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
 */function EL(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
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
 */class qE{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=EL(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<n&&(r+=e.charAt(s[i]%e.length))}return r}}function We(t,e){return t<e?-1:t>e?1:0}function $i(t,e,n){return t.length===e.length&&t.every((r,s)=>n(r,e[s]))}/**
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
 */class Pt{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new me(K.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new me(K.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new me(K.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new me(K.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Pt.fromMillis(Date.now())}static fromDate(e){return Pt.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new Pt(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?We(this.nanoseconds,e.nanoseconds):We(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class be{constructor(e){this.timestamp=e}static fromTimestamp(e){return new be(e)}static min(){return new be(new Pt(0,0))}static max(){return new be(new Pt(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class ba{constructor(e,n,r){n===void 0?n=0:n>e.length&&Ee(),r===void 0?r=e.length-n:r>e.length-n&&Ee(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return ba.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof ba?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let s=0;s<r;s++){const i=e.get(s),o=n.get(s);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class _t extends ba{construct(e,n,r){return new _t(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new me(K.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new _t(n)}static emptyPath(){return new _t([])}}const bL=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class $t extends ba{construct(e,n,r){return new $t(e,n,r)}static isValidIdentifier(e){return bL.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),$t.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new $t(["__name__"])}static fromServerFormat(e){const n=[];let r="",s=0;const i=()=>{if(r.length===0)throw new me(K.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new me(K.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new me(K.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(r+=a,s++):(i(),s++)}if(i(),o)throw new me(K.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new $t(n)}static emptyPath(){return new $t([])}}/**
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
 */class pe{constructor(e){this.path=e}static fromPath(e){return new pe(_t.fromString(e))}static fromName(e){return new pe(_t.fromString(e).popFirst(5))}static empty(){return new pe(_t.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&_t.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return _t.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new pe(new _t(e.slice()))}}function IL(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,s=be.fromTimestamp(r===1e9?new Pt(n+1,0):new Pt(n,r));return new as(s,pe.empty(),e)}function TL(t){return new as(t.readTime,t.key,-1)}class as{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new as(be.min(),pe.empty(),-1)}static max(){return new as(be.max(),pe.empty(),-1)}}function CL(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=pe.comparator(t.documentKey,e.documentKey),n!==0?n:We(t.largestBatchId,e.largestBatchId))}/**
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
 */const AL="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class SL{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function qa(t){if(t.code!==K.FAILED_PRECONDITION||t.message!==AL)throw t;le("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class W{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Ee(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new W((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(n,i).next(r,s)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof W?n:W.resolve(n)}catch(n){return W.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):W.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):W.reject(n)}static resolve(e){return new W((n,r)=>{n(e)})}static reject(e){return new W((n,r)=>{r(e)})}static waitFor(e){return new W((n,r)=>{let s=0,i=0,o=!1;e.forEach(a=>{++s,a.next(()=>{++i,o&&i===s&&n()},c=>r(c))}),o=!0,i===s&&n()})}static or(e){let n=W.resolve(!1);for(const r of e)n=n.next(s=>s?W.resolve(s):r());return n}static forEach(e,n){const r=[];return e.forEach((s,i)=>{r.push(n.call(this,s,i))}),this.waitFor(r)}static mapArray(e,n){return new W((r,s)=>{const i=e.length,o=new Array(i);let a=0;for(let c=0;c<i;c++){const u=c;n(e[u]).next(h=>{o[u]=h,++a,a===i&&r(o)},h=>s(h))}})}static doWhile(e,n){return new W((r,s)=>{const i=()=>{e()===!0?n().next(()=>{i()},s):r()};i()})}}function RL(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ha(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class Yf{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Yf.oe=-1;function fu(t){return t==null}function vc(t){return t===0&&1/t==-1/0}function PL(t){return typeof t=="number"&&Number.isInteger(t)&&!vc(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
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
 */function q_(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function eo(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function HE(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
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
 */class mt{constructor(e,n){this.comparator=e,this.root=n||Vt.EMPTY}insert(e,n){return new mt(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Vt.BLACK,null,null))}remove(e){return new mt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Vt.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Rl(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Rl(this.root,e,this.comparator,!1)}getReverseIterator(){return new Rl(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Rl(this.root,e,this.comparator,!0)}}class Rl{constructor(e,n,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?r(e.key,n):1,n&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Vt{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??Vt.RED,this.left=s??Vt.EMPTY,this.right=i??Vt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,s,i){return new Vt(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Vt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return Vt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Vt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Vt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Ee();const e=this.left.check();if(e!==this.right.check())throw Ee();return e+(this.isRed()?0:1)}}Vt.EMPTY=null,Vt.RED=!0,Vt.BLACK=!1;Vt.EMPTY=new class{constructor(){this.size=0}get key(){throw Ee()}get value(){throw Ee()}get color(){throw Ee()}get left(){throw Ee()}get right(){throw Ee()}copy(e,n,r,s,i){return this}insert(e,n,r){return new Vt(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Bt{constructor(e){this.comparator=e,this.data=new mt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new H_(this.data.getIterator())}getIteratorFrom(e){return new H_(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Bt)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Bt(this.comparator);return n.data=e,n}}class H_{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Un{constructor(e){this.fields=e,e.sort($t.comparator)}static empty(){return new Un([])}unionWith(e){let n=new Bt($t.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Un(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return $i(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
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
 */class WE extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Jt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new WE("Invalid base64 string: "+i):i}}(e);return new Jt(n)}static fromUint8Array(e){const n=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new Jt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return We(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Jt.EMPTY_BYTE_STRING=new Jt("");const xL=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ls(t){if(nt(!!t),typeof t=="string"){let e=0;const n=xL.exec(t);if(nt(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:bt(t.seconds),nanos:bt(t.nanos)}}function bt(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function zs(t){return typeof t=="string"?Jt.fromBase64String(t):Jt.fromUint8Array(t)}/**
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
 */function Jf(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Xf(t){const e=t.mapValue.fields.__previous_value__;return Jf(e)?Xf(e):e}function Ia(t){const e=ls(t.mapValue.fields.__local_write_time__.timestampValue);return new Pt(e.seconds,e.nanos)}/**
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
 */class kL{constructor(e,n,r,s,i,o,a,c,u){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=c,this.useFetchStreams=u}}class Ta{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Ta("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Ta&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Pl={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function Gs(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Jf(t)?4:NL(t)?9007199254740991:10:Ee()}function Zn(t,e){if(t===e)return!0;const n=Gs(t);if(n!==Gs(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Ia(t).isEqual(Ia(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=ls(s.timestampValue),a=ls(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(s,i){return zs(s.bytesValue).isEqual(zs(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(s,i){return bt(s.geoPointValue.latitude)===bt(i.geoPointValue.latitude)&&bt(s.geoPointValue.longitude)===bt(i.geoPointValue.longitude)}(t,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return bt(s.integerValue)===bt(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=bt(s.doubleValue),a=bt(i.doubleValue);return o===a?vc(o)===vc(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return $i(t.arrayValue.values||[],e.arrayValue.values||[],Zn);case 10:return function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(q_(o)!==q_(a))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(a[c]===void 0||!Zn(o[c],a[c])))return!1;return!0}(t,e);default:return Ee()}}function Ca(t,e){return(t.values||[]).find(n=>Zn(n,e))!==void 0}function Bi(t,e){if(t===e)return 0;const n=Gs(t),r=Gs(e);if(n!==r)return We(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return We(t.booleanValue,e.booleanValue);case 2:return function(i,o){const a=bt(i.integerValue||i.doubleValue),c=bt(o.integerValue||o.doubleValue);return a<c?-1:a>c?1:a===c?0:isNaN(a)?isNaN(c)?0:-1:1}(t,e);case 3:return W_(t.timestampValue,e.timestampValue);case 4:return W_(Ia(t),Ia(e));case 5:return We(t.stringValue,e.stringValue);case 6:return function(i,o){const a=zs(i),c=zs(o);return a.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const a=i.split("/"),c=o.split("/");for(let u=0;u<a.length&&u<c.length;u++){const h=We(a[u],c[u]);if(h!==0)return h}return We(a.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const a=We(bt(i.latitude),bt(o.latitude));return a!==0?a:We(bt(i.longitude),bt(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return function(i,o){const a=i.values||[],c=o.values||[];for(let u=0;u<a.length&&u<c.length;++u){const h=Bi(a[u],c[u]);if(h)return h}return We(a.length,c.length)}(t.arrayValue,e.arrayValue);case 10:return function(i,o){if(i===Pl.mapValue&&o===Pl.mapValue)return 0;if(i===Pl.mapValue)return 1;if(o===Pl.mapValue)return-1;const a=i.fields||{},c=Object.keys(a),u=o.fields||{},h=Object.keys(u);c.sort(),h.sort();for(let d=0;d<c.length&&d<h.length;++d){const p=We(c[d],h[d]);if(p!==0)return p;const g=Bi(a[c[d]],u[h[d]]);if(g!==0)return g}return We(c.length,h.length)}(t.mapValue,e.mapValue);default:throw Ee()}}function W_(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return We(t,e);const n=ls(t),r=ls(e),s=We(n.seconds,r.seconds);return s!==0?s:We(n.nanos,r.nanos)}function ji(t){return fd(t)}function fd(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=ls(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return zs(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return pe.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",s=!0;for(const i of n.values||[])s?s=!1:r+=",",r+=fd(i);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${fd(n.fields[o])}`;return s+"}"}(t.mapValue):Ee()}function pd(t){return!!t&&"integerValue"in t}function Zf(t){return!!t&&"arrayValue"in t}function z_(t){return!!t&&"nullValue"in t}function G_(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Bl(t){return!!t&&"mapValue"in t}function Xo(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return eo(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Xo(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Xo(t.arrayValue.values[n]);return e}return Object.assign({},t)}function NL(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class Tn{constructor(e){this.value=e}static empty(){return new Tn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Bl(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Xo(n)}setAll(e){let n=$t.emptyPath(),r={},s=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const c=this.getFieldsMap(n);this.applyChanges(c,r,s),r={},s=[],n=a.popLast()}o?r[a.lastSegment()]=Xo(o):s.push(a.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,r,s)}delete(e){const n=this.field(e.popLast());Bl(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Zn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=n.mapValue.fields[e.get(r)];Bl(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,r){eo(n,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new Tn(Xo(this.value))}}function zE(t){const e=[];return eo(t.fields,(n,r)=>{const s=new $t([n]);if(Bl(r)){const i=zE(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new Un(e)}/**
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
 */class Kt{constructor(e,n,r,s,i,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Kt(e,0,be.min(),be.min(),be.min(),Tn.empty(),0)}static newFoundDocument(e,n,r,s){return new Kt(e,1,n,be.min(),r,s,0)}static newNoDocument(e,n){return new Kt(e,2,n,be.min(),be.min(),Tn.empty(),0)}static newUnknownDocument(e,n){return new Kt(e,3,n,be.min(),be.min(),Tn.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(be.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Tn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Tn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=be.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Kt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Kt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class wc{constructor(e,n){this.position=e,this.inclusive=n}}function K_(t,e,n){let r=0;for(let s=0;s<t.position.length;s++){const i=e[s],o=t.position[s];if(i.field.isKeyField()?r=pe.comparator(pe.fromName(o.referenceValue),n.key):r=Bi(o,n.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Q_(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Zn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class Ec{constructor(e,n="asc"){this.field=e,this.dir=n}}function OL(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class GE{}class St extends GE{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new ML(e,n,r):n==="array-contains"?new FL(e,r):n==="in"?new UL(e,r):n==="not-in"?new $L(e,r):n==="array-contains-any"?new BL(e,r):new St(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new LL(e,r):new VL(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Bi(n,this.value)):n!==null&&Gs(this.value)===Gs(n)&&this.matchesComparison(Bi(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Ee()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class er extends GE{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new er(e,n)}matches(e){return KE(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function KE(t){return t.op==="and"}function QE(t){return DL(t)&&KE(t)}function DL(t){for(const e of t.filters)if(e instanceof er)return!1;return!0}function md(t){if(t instanceof St)return t.field.canonicalString()+t.op.toString()+ji(t.value);if(QE(t))return t.filters.map(e=>md(e)).join(",");{const e=t.filters.map(n=>md(n)).join(",");return`${t.op}(${e})`}}function YE(t,e){return t instanceof St?function(r,s){return s instanceof St&&r.op===s.op&&r.field.isEqual(s.field)&&Zn(r.value,s.value)}(t,e):t instanceof er?function(r,s){return s instanceof er&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,o,a)=>i&&YE(o,s.filters[a]),!0):!1}(t,e):void Ee()}function JE(t){return t instanceof St?function(n){return`${n.field.canonicalString()} ${n.op} ${ji(n.value)}`}(t):t instanceof er?function(n){return n.op.toString()+" {"+n.getFilters().map(JE).join(" ,")+"}"}(t):"Filter"}class ML extends St{constructor(e,n,r){super(e,n,r),this.key=pe.fromName(r.referenceValue)}matches(e){const n=pe.comparator(e.key,this.key);return this.matchesComparison(n)}}class LL extends St{constructor(e,n){super(e,"in",n),this.keys=XE("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class VL extends St{constructor(e,n){super(e,"not-in",n),this.keys=XE("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function XE(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>pe.fromName(r.referenceValue))}class FL extends St{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Zf(n)&&Ca(n.arrayValue,this.value)}}class UL extends St{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Ca(this.value.arrayValue,n)}}class $L extends St{constructor(e,n){super(e,"not-in",n)}matches(e){if(Ca(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Ca(this.value.arrayValue,n)}}class BL extends St{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Zf(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Ca(this.value.arrayValue,r))}}/**
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
 */class jL{constructor(e,n=null,r=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.ue=null}}function Y_(t,e=null,n=[],r=[],s=null,i=null,o=null){return new jL(t,e,n,r,s,i,o)}function ep(t){const e=Te(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>md(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),fu(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>ji(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>ji(r)).join(",")),e.ue=n}return e.ue}function tp(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!OL(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!YE(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Q_(t.startAt,e.startAt)&&Q_(t.endAt,e.endAt)}function gd(t){return pe.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
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
 */class pu{constructor(e,n=null,r=[],s=[],i=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function qL(t,e,n,r,s,i,o,a){return new pu(t,e,n,r,s,i,o,a)}function np(t){return new pu(t)}function J_(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function HL(t){return t.collectionGroup!==null}function Zo(t){const e=Te(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Bt($t.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(u=>{u.isInequality()&&(a=a.add(u.field))})}),a})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Ec(i,r))}),n.has($t.keyField().canonicalString())||e.ce.push(new Ec($t.keyField(),r))}return e.ce}function Yn(t){const e=Te(t);return e.le||(e.le=WL(e,Zo(t))),e.le}function WL(t,e){if(t.limitType==="F")return Y_(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Ec(s.field,i)});const n=t.endAt?new wc(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new wc(t.startAt.position,t.startAt.inclusive):null;return Y_(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function _d(t,e,n){return new pu(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function mu(t,e){return tp(Yn(t),Yn(e))&&t.limitType===e.limitType}function ZE(t){return`${ep(Yn(t))}|lt:${t.limitType}`}function gi(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(s=>JE(s)).join(", ")}]`),fu(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(s=>ji(s)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(s=>ji(s)).join(",")),`Target(${r})`}(Yn(t))}; limitType=${t.limitType})`}function gu(t,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):pe.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(t,e)&&function(r,s){for(const i of Zo(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(t,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(t,e)&&function(r,s){return!(r.startAt&&!function(o,a,c){const u=K_(o,a,c);return o.inclusive?u<=0:u<0}(r.startAt,Zo(r),s)||r.endAt&&!function(o,a,c){const u=K_(o,a,c);return o.inclusive?u>=0:u>0}(r.endAt,Zo(r),s))}(t,e)}function zL(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function eb(t){return(e,n)=>{let r=!1;for(const s of Zo(t)){const i=GL(s,e,n);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function GL(t,e,n){const r=t.field.isKeyField()?pe.comparator(e.key,n.key):function(i,o,a){const c=o.data.field(i),u=a.data.field(i);return c!==null&&u!==null?Bi(c,u):Ee()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return Ee()}}/**
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
 */class to{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,n]);s.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[n]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){eo(this.inner,(n,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return HE(this.inner)}size(){return this.innerSize}}/**
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
 */const KL=new mt(pe.comparator);function Ir(){return KL}const tb=new mt(pe.comparator);function Do(...t){let e=tb;for(const n of t)e=e.insert(n.key,n);return e}function nb(t){let e=tb;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function ks(){return ea()}function rb(){return ea()}function ea(){return new to(t=>t.toString(),(t,e)=>t.isEqual(e))}const QL=new mt(pe.comparator),YL=new Bt(pe.comparator);function Le(...t){let e=YL;for(const n of t)e=e.add(n);return e}const JL=new Bt(We);function XL(){return JL}/**
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
 */function sb(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:vc(e)?"-0":e}}function ib(t){return{integerValue:""+t}}function ZL(t,e){return PL(e)?ib(e):sb(t,e)}/**
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
 */class _u{constructor(){this._=void 0}}function eV(t,e,n){return t instanceof bc?function(s,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Jf(i)&&(i=Xf(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof Aa?ab(t,e):t instanceof Sa?lb(t,e):function(s,i){const o=ob(s,i),a=X_(o)+X_(s.Pe);return pd(o)&&pd(s.Pe)?ib(a):sb(s.serializer,a)}(t,e)}function tV(t,e,n){return t instanceof Aa?ab(t,e):t instanceof Sa?lb(t,e):n}function ob(t,e){return t instanceof Ic?function(r){return pd(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class bc extends _u{}class Aa extends _u{constructor(e){super(),this.elements=e}}function ab(t,e){const n=cb(e);for(const r of t.elements)n.some(s=>Zn(s,r))||n.push(r);return{arrayValue:{values:n}}}class Sa extends _u{constructor(e){super(),this.elements=e}}function lb(t,e){let n=cb(e);for(const r of t.elements)n=n.filter(s=>!Zn(s,r));return{arrayValue:{values:n}}}class Ic extends _u{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function X_(t){return bt(t.integerValue||t.doubleValue)}function cb(t){return Zf(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function nV(t,e){return t.field.isEqual(e.field)&&function(r,s){return r instanceof Aa&&s instanceof Aa||r instanceof Sa&&s instanceof Sa?$i(r.elements,s.elements,Zn):r instanceof Ic&&s instanceof Ic?Zn(r.Pe,s.Pe):r instanceof bc&&s instanceof bc}(t.transform,e.transform)}class rV{constructor(e,n){this.version=e,this.transformResults=n}}class yr{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new yr}static exists(e){return new yr(void 0,e)}static updateTime(e){return new yr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function jl(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class yu{}function ub(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new db(t.key,yr.none()):new Wa(t.key,t.data,yr.none());{const n=t.data,r=Tn.empty();let s=new Bt($t.comparator);for(let i of e.fields)if(!s.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new ni(t.key,r,new Un(s.toArray()),yr.none())}}function sV(t,e,n){t instanceof Wa?function(s,i,o){const a=s.value.clone(),c=ey(s.fieldTransforms,i,o.transformResults);a.setAll(c),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof ni?function(s,i,o){if(!jl(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=ey(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(hb(s)),c.setAll(a),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function ta(t,e,n,r){return t instanceof Wa?function(i,o,a,c){if(!jl(i.precondition,o))return a;const u=i.value.clone(),h=ty(i.fieldTransforms,c,o);return u.setAll(h),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(t,e,n,r):t instanceof ni?function(i,o,a,c){if(!jl(i.precondition,o))return a;const u=ty(i.fieldTransforms,c,o),h=o.data;return h.setAll(hb(i)),h.setAll(u),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(d=>d.field))}(t,e,n,r):function(i,o,a){return jl(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function iV(t,e){let n=null;for(const r of t.fieldTransforms){const s=e.data.field(r.field),i=ob(r.transform,s||null);i!=null&&(n===null&&(n=Tn.empty()),n.set(r.field,i))}return n||null}function Z_(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&$i(r,s,(i,o)=>nV(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Wa extends yu{constructor(e,n,r,s=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class ni extends yu{constructor(e,n,r,s,i=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function hb(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function ey(t,e,n){const r=new Map;nt(t.length===n.length);for(let s=0;s<n.length;s++){const i=t[s],o=i.transform,a=e.data.field(i.field);r.set(i.field,tV(o,a,n[s]))}return r}function ty(t,e,n){const r=new Map;for(const s of t){const i=s.transform,o=n.data.field(s.field);r.set(s.field,eV(i,o,e))}return r}class db extends yu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class oV extends yu{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class aV{constructor(e,n,r,s){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&sV(i,e,r[s])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=ta(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=ta(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=rb();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=n.has(s.key)?null:a;const c=ub(o,a);c!==null&&r.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(be.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),Le())}isEqual(e){return this.batchId===e.batchId&&$i(this.mutations,e.mutations,(n,r)=>Z_(n,r))&&$i(this.baseMutations,e.baseMutations,(n,r)=>Z_(n,r))}}class rp{constructor(e,n,r,s){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=s}static from(e,n,r){nt(e.mutations.length===r.length);let s=function(){return QL}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new rp(e,n,r,s)}}/**
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
 */class lV{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class cV{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
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
 */var Et,Fe;function uV(t){switch(t){default:return Ee();case K.CANCELLED:case K.UNKNOWN:case K.DEADLINE_EXCEEDED:case K.RESOURCE_EXHAUSTED:case K.INTERNAL:case K.UNAVAILABLE:case K.UNAUTHENTICATED:return!1;case K.INVALID_ARGUMENT:case K.NOT_FOUND:case K.ALREADY_EXISTS:case K.PERMISSION_DENIED:case K.FAILED_PRECONDITION:case K.ABORTED:case K.OUT_OF_RANGE:case K.UNIMPLEMENTED:case K.DATA_LOSS:return!0}}function fb(t){if(t===void 0)return br("GRPC error has no .code"),K.UNKNOWN;switch(t){case Et.OK:return K.OK;case Et.CANCELLED:return K.CANCELLED;case Et.UNKNOWN:return K.UNKNOWN;case Et.DEADLINE_EXCEEDED:return K.DEADLINE_EXCEEDED;case Et.RESOURCE_EXHAUSTED:return K.RESOURCE_EXHAUSTED;case Et.INTERNAL:return K.INTERNAL;case Et.UNAVAILABLE:return K.UNAVAILABLE;case Et.UNAUTHENTICATED:return K.UNAUTHENTICATED;case Et.INVALID_ARGUMENT:return K.INVALID_ARGUMENT;case Et.NOT_FOUND:return K.NOT_FOUND;case Et.ALREADY_EXISTS:return K.ALREADY_EXISTS;case Et.PERMISSION_DENIED:return K.PERMISSION_DENIED;case Et.FAILED_PRECONDITION:return K.FAILED_PRECONDITION;case Et.ABORTED:return K.ABORTED;case Et.OUT_OF_RANGE:return K.OUT_OF_RANGE;case Et.UNIMPLEMENTED:return K.UNIMPLEMENTED;case Et.DATA_LOSS:return K.DATA_LOSS;default:return Ee()}}(Fe=Et||(Et={}))[Fe.OK=0]="OK",Fe[Fe.CANCELLED=1]="CANCELLED",Fe[Fe.UNKNOWN=2]="UNKNOWN",Fe[Fe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Fe[Fe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Fe[Fe.NOT_FOUND=5]="NOT_FOUND",Fe[Fe.ALREADY_EXISTS=6]="ALREADY_EXISTS",Fe[Fe.PERMISSION_DENIED=7]="PERMISSION_DENIED",Fe[Fe.UNAUTHENTICATED=16]="UNAUTHENTICATED",Fe[Fe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Fe[Fe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Fe[Fe.ABORTED=10]="ABORTED",Fe[Fe.OUT_OF_RANGE=11]="OUT_OF_RANGE",Fe[Fe.UNIMPLEMENTED=12]="UNIMPLEMENTED",Fe[Fe.INTERNAL=13]="INTERNAL",Fe[Fe.UNAVAILABLE=14]="UNAVAILABLE",Fe[Fe.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function hV(){return new TextEncoder}/**
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
 */const dV=new Ls([4294967295,4294967295],0);function ny(t){const e=hV().encode(t),n=new ME;return n.update(e),new Uint8Array(n.digest())}function ry(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Ls([n,r],0),new Ls([s,i],0)]}class sp{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Mo(`Invalid padding: ${n}`);if(r<0)throw new Mo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Mo(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Mo(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Ls.fromNumber(this.Ie)}Ee(e,n,r){let s=e.add(n.multiply(Ls.fromNumber(r)));return s.compare(dV)===1&&(s=new Ls([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=ny(e),[r,s]=ry(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);if(!this.de(o))return!1}return!0}static create(e,n,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new sp(i,s,n);return r.forEach(a=>o.insert(a)),o}insert(e){if(this.Ie===0)return;const n=ny(e),[r,s]=ry(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(r,s,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Mo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class vu{constructor(e,n,r,s,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const s=new Map;return s.set(e,za.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new vu(be.min(),s,new mt(We),Ir(),Le())}}class za{constructor(e,n,r,s,i){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new za(r,n,Le(),Le(),Le())}}/**
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
 */class ql{constructor(e,n,r,s){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=s}}class pb{constructor(e,n){this.targetId=e,this.me=n}}class mb{constructor(e,n,r=Jt.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=s}}class sy{constructor(){this.fe=0,this.ge=oy(),this.pe=Jt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}Ce(){let e=Le(),n=Le(),r=Le();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:n=n.add(s);break;case 1:r=r.add(s);break;default:Ee()}}),new za(this.pe,this.ye,e,n,r)}ve(){this.we=!1,this.ge=oy()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,nt(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class fV{constructor(e){this.Le=e,this.Be=new Map,this.ke=Ir(),this.qe=iy(),this.Qe=new mt(We)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.ve(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:Ee()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,s)=>{this.ze(s)&&n(s)})}He(e){const n=e.targetId,r=e.me.count,s=this.Je(n);if(s){const i=s.target;if(gd(i))if(r===0){const o=new pe(i.path);this.Ue(n,o,Kt.newNoDocument(o,be.min()))}else nt(r===1);else{const o=this.Ye(n);if(o!==r){const a=this.Ze(e),c=a?this.Xe(a,e,o):1;if(c!==0){this.je(n);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,u)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=n;let o,a;try{o=zs(r).toUint8Array()}catch(c){if(c instanceof WE)return Ui("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{a=new sp(o,s,i)}catch(c){return Ui(c instanceof Mo?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return a.Ie===0?null:a}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let s=0;return r.forEach(i=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.Ue(n,i,null),s++)}),s}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const a=this.Je(o);if(a){if(i.current&&gd(a.target)){const c=new pe(a.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Kt.newNoDocument(c,e))}i.be&&(n.set(o,i.Ce()),i.ve())}});let r=Le();this.qe.forEach((i,o)=>{let a=!0;o.forEachWhile(c=>{const u=this.Je(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(r=r.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const s=new vu(e,n,this.Qe,this.ke,r);return this.ke=Ir(),this.qe=iy(),this.Qe=new mt(We),s}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,n)?s.Fe(n,1):s.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).Ce();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new sy,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Bt(We),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||le("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new sy),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function iy(){return new mt(pe.comparator)}function oy(){return new mt(pe.comparator)}const pV={asc:"ASCENDING",desc:"DESCENDING"},mV={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gV={and:"AND",or:"OR"};class _V{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function yd(t,e){return t.useProto3Json||fu(e)?e:{value:e}}function Tc(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function gb(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function yV(t,e){return Tc(t,e.toTimestamp())}function Jn(t){return nt(!!t),be.fromTimestamp(function(n){const r=ls(n);return new Pt(r.seconds,r.nanos)}(t))}function ip(t,e){return vd(t,e).canonicalString()}function vd(t,e){const n=function(s){return new _t(["projects",s.projectId,"databases",s.database])}(t).child("documents");return e===void 0?n:n.child(e)}function _b(t){const e=_t.fromString(t);return nt(bb(e)),e}function wd(t,e){return ip(t.databaseId,e.path)}function vh(t,e){const n=_b(e);if(n.get(1)!==t.databaseId.projectId)throw new me(K.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new me(K.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new pe(vb(n))}function yb(t,e){return ip(t.databaseId,e)}function vV(t){const e=_b(t);return e.length===4?_t.emptyPath():vb(e)}function Ed(t){return new _t(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function vb(t){return nt(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function ay(t,e,n){return{name:wd(t,e),fields:n.value.mapValue.fields}}function wV(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:Ee()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(u,h){return u.useProto3Json?(nt(h===void 0||typeof h=="string"),Jt.fromBase64String(h||"")):(nt(h===void 0||h instanceof Buffer||h instanceof Uint8Array),Jt.fromUint8Array(h||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(u){const h=u.code===void 0?K.UNKNOWN:fb(u.code);return new me(h,u.message||"")}(o);n=new mb(r,s,i,a||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=vh(t,r.document.name),i=Jn(r.document.updateTime),o=r.document.createTime?Jn(r.document.createTime):be.min(),a=new Tn({mapValue:{fields:r.document.fields}}),c=Kt.newFoundDocument(s,i,o,a),u=r.targetIds||[],h=r.removedTargetIds||[];n=new ql(u,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=vh(t,r.document),i=r.readTime?Jn(r.readTime):be.min(),o=Kt.newNoDocument(s,i),a=r.removedTargetIds||[];n=new ql([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=vh(t,r.document),i=r.removedTargetIds||[];n=new ql([],i,s,null)}else{if(!("filter"in e))return Ee();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new cV(s,i),a=r.targetId;n=new pb(a,o)}}return n}function EV(t,e){let n;if(e instanceof Wa)n={update:ay(t,e.key,e.value)};else if(e instanceof db)n={delete:wd(t,e.key)};else if(e instanceof ni)n={update:ay(t,e.key,e.data),updateMask:xV(e.fieldMask)};else{if(!(e instanceof oV))return Ee();n={verify:wd(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(i,o){const a=o.transform;if(a instanceof bc)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Aa)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Sa)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Ic)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw Ee()}(0,r))),e.precondition.isNone||(n.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:yV(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Ee()}(t,e.precondition)),n}function bV(t,e){return t&&t.length>0?(nt(e!==void 0),t.map(n=>function(s,i){let o=s.updateTime?Jn(s.updateTime):Jn(i);return o.isEqual(be.min())&&(o=Jn(i)),new rV(o,s.transformResults||[])}(n,e))):[]}function IV(t,e){return{documents:[yb(t,e.path)]}}function TV(t,e){const n={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=yb(t,s);const i=function(u){if(u.length!==0)return Eb(er.create(u,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(u){if(u.length!==0)return u.map(h=>function(p){return{field:_i(p.field),direction:SV(p.dir)}}(h))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=yd(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{_t:n,parent:s}}function CV(t){let e=vV(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){nt(r===1);const h=n.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];n.where&&(i=function(d){const p=wb(d);return p instanceof er&&QE(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(d){return d.map(p=>function(v){return new Ec(yi(v.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(v.direction))}(p))}(n.orderBy));let a=null;n.limit&&(a=function(d){let p;return p=typeof d=="object"?d.value:d,fu(p)?null:p}(n.limit));let c=null;n.startAt&&(c=function(d){const p=!!d.before,g=d.values||[];return new wc(g,p)}(n.startAt));let u=null;return n.endAt&&(u=function(d){const p=!d.before,g=d.values||[];return new wc(g,p)}(n.endAt)),qL(e,s,o,i,a,"F",c,u)}function AV(t,e){const n=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Ee()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function wb(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=yi(n.unaryFilter.field);return St.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=yi(n.unaryFilter.field);return St.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=yi(n.unaryFilter.field);return St.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=yi(n.unaryFilter.field);return St.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Ee()}}(t):t.fieldFilter!==void 0?function(n){return St.create(yi(n.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Ee()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return er.create(n.compositeFilter.filters.map(r=>wb(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Ee()}}(n.compositeFilter.op))}(t):Ee()}function SV(t){return pV[t]}function RV(t){return mV[t]}function PV(t){return gV[t]}function _i(t){return{fieldPath:t.canonicalString()}}function yi(t){return $t.fromServerFormat(t.fieldPath)}function Eb(t){return t instanceof St?function(n){if(n.op==="=="){if(G_(n.value))return{unaryFilter:{field:_i(n.field),op:"IS_NAN"}};if(z_(n.value))return{unaryFilter:{field:_i(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(G_(n.value))return{unaryFilter:{field:_i(n.field),op:"IS_NOT_NAN"}};if(z_(n.value))return{unaryFilter:{field:_i(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:_i(n.field),op:RV(n.op),value:n.value}}}(t):t instanceof er?function(n){const r=n.getFilters().map(s=>Eb(s));return r.length===1?r[0]:{compositeFilter:{op:PV(n.op),filters:r}}}(t):Ee()}function xV(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function bb(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
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
 */class Kr{constructor(e,n,r,s,i=be.min(),o=be.min(),a=Jt.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=c}withSequenceNumber(e){return new Kr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Kr(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Kr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Kr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class kV{constructor(e){this.ct=e}}function NV(t){const e=CV({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?_d(e,e.limit,"L"):e}/**
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
 */class OV{constructor(){this._n=new DV}addToCollectionParentIndex(e,n){return this._n.add(n),W.resolve()}getCollectionParents(e,n){return W.resolve(this._n.getEntries(n))}addFieldIndex(e,n){return W.resolve()}deleteFieldIndex(e,n){return W.resolve()}deleteAllFieldIndexes(e){return W.resolve()}createTargetIndexes(e,n){return W.resolve()}getDocumentsMatchingTarget(e,n){return W.resolve(null)}getIndexType(e,n){return W.resolve(0)}getFieldIndexes(e,n){return W.resolve([])}getNextCollectionGroupToUpdate(e){return W.resolve(null)}getMinOffset(e,n){return W.resolve(as.min())}getMinOffsetFromCollectionGroup(e,n){return W.resolve(as.min())}updateCollectionGroup(e,n,r){return W.resolve()}updateIndexEntries(e,n){return W.resolve()}}class DV{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n]||new Bt(_t.comparator),i=!s.has(r);return this.index[n]=s.add(r),i}has(e){const n=e.lastSegment(),r=e.popLast(),s=this.index[n];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Bt(_t.comparator)).toArray()}}/**
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
 */class qi{constructor(e){this.On=e}next(){return this.On+=2,this.On}static Nn(){return new qi(0)}static Ln(){return new qi(-1)}}/**
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
 */class MV{constructor(){this.changes=new to(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Kt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?W.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class LV{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
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
 */class VV{constructor(e,n,r,s){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,n))).next(s=>(r!==null&&ta(r.mutation,s,Un.empty(),Pt.now()),s))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,Le()).next(()=>r))}getLocalViewOfDocuments(e,n,r=Le()){const s=ks();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,r).next(i=>{let o=Do();return i.forEach((a,c)=>{o=o.insert(a,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=ks();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,Le()))}populateOverlays(e,n,r){const s=[];return r.forEach(i=>{n.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,r,s){let i=Ir();const o=ea(),a=function(){return ea()}();return n.forEach((c,u)=>{const h=r.get(u.key);s.has(u.key)&&(h===void 0||h.mutation instanceof ni)?i=i.insert(u.key,u):h!==void 0?(o.set(u.key,h.mutation.getFieldMask()),ta(h.mutation,u,h.mutation.getFieldMask(),Pt.now())):o.set(u.key,Un.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((u,h)=>o.set(u,h)),n.forEach((u,h)=>{var d;return a.set(u,new LV(h,(d=o.get(u))!==null&&d!==void 0?d:null))}),a))}recalculateAndSaveOverlays(e,n){const r=ea();let s=new mt((o,a)=>o-a),i=Le();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(c=>{const u=n.get(c);if(u===null)return;let h=r.get(c)||Un.empty();h=a.applyToLocalView(u,h),r.set(c,h);const d=(s.get(a.batchId)||Le()).add(c);s=s.insert(a.batchId,d)})}).next(()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const c=a.getNext(),u=c.key,h=c.value,d=rb();h.forEach(p=>{if(!i.has(p)){const g=ub(n.get(p),r.get(p));g!==null&&d.set(p,g),i=i.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,u,d))}return W.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,s){return function(o){return pe.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):HL(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,s):this.getDocumentsMatchingCollectionQuery(e,n,r,s)}getNextDocuments(e,n,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,s-i.size):W.resolve(ks());let a=-1,c=i;return o.next(u=>W.forEach(u,(h,d)=>(a<d.largestBatchId&&(a=d.largestBatchId),i.get(h)?W.resolve():this.remoteDocumentCache.getEntry(e,h).next(p=>{c=c.insert(h,p)}))).next(()=>this.populateOverlays(e,u,i)).next(()=>this.computeViews(e,c,u,Le())).next(h=>({batchId:a,changes:nb(h)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new pe(n)).next(r=>{let s=Do();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,n,r,s){const i=n.collectionGroup;let o=Do();return this.indexManager.getCollectionParents(e,i).next(a=>W.forEach(a,c=>{const u=function(d,p){return new pu(p,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)}(n,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,u,r,s).next(h=>{h.forEach((d,p)=>{o=o.insert(d,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,i,s))).next(o=>{i.forEach((c,u)=>{const h=u.getKey();o.get(h)===null&&(o=o.insert(h,Kt.newInvalidDocument(h)))});let a=Do();return o.forEach((c,u)=>{const h=i.get(c);h!==void 0&&ta(h.mutation,u,Un.empty(),Pt.now()),gu(n,u)&&(a=a.insert(c,u))}),a})}}/**
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
 */class FV{constructor(e){this.serializer=e,this.cr=new Map,this.lr=new Map}getBundleMetadata(e,n){return W.resolve(this.cr.get(n))}saveBundleMetadata(e,n){return this.cr.set(n.id,function(s){return{id:s.id,version:s.version,createTime:Jn(s.createTime)}}(n)),W.resolve()}getNamedQuery(e,n){return W.resolve(this.lr.get(n))}saveNamedQuery(e,n){return this.lr.set(n.name,function(s){return{name:s.name,query:NV(s.bundledQuery),readTime:Jn(s.readTime)}}(n)),W.resolve()}}/**
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
 */class UV{constructor(){this.overlays=new mt(pe.comparator),this.hr=new Map}getOverlay(e,n){return W.resolve(this.overlays.get(n))}getOverlays(e,n){const r=ks();return W.forEach(n,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((s,i)=>{this.ht(e,n,i)}),W.resolve()}removeOverlaysForBatchId(e,n,r){const s=this.hr.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.hr.delete(r)),W.resolve()}getOverlaysForCollection(e,n,r){const s=ks(),i=n.length+1,o=new pe(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const c=a.getNext().value,u=c.getKey();if(!n.isPrefixOf(u.path))break;u.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return W.resolve(s)}getOverlaysForCollectionGroup(e,n,r,s){let i=new mt((u,h)=>u-h);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===n&&u.largestBatchId>r){let h=i.get(u.largestBatchId);h===null&&(h=ks(),i=i.insert(u.largestBatchId,h)),h.set(u.getKey(),u)}}const a=ks(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((u,h)=>a.set(u,h)),!(a.size()>=s)););return W.resolve(a)}ht(e,n,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.hr.get(s.largestBatchId).delete(r.key);this.hr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new lV(n,r));let i=this.hr.get(n);i===void 0&&(i=Le(),this.hr.set(n,i)),this.hr.set(n,i.add(r.key))}}/**
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
 */class op{constructor(){this.Pr=new Bt(Nt.Ir),this.Tr=new Bt(Nt.Er)}isEmpty(){return this.Pr.isEmpty()}addReference(e,n){const r=new Nt(e,n);this.Pr=this.Pr.add(r),this.Tr=this.Tr.add(r)}dr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Ar(new Nt(e,n))}Rr(e,n){e.forEach(r=>this.removeReference(r,n))}Vr(e){const n=new pe(new _t([])),r=new Nt(n,e),s=new Nt(n,e+1),i=[];return this.Tr.forEachInRange([r,s],o=>{this.Ar(o),i.push(o.key)}),i}mr(){this.Pr.forEach(e=>this.Ar(e))}Ar(e){this.Pr=this.Pr.delete(e),this.Tr=this.Tr.delete(e)}gr(e){const n=new pe(new _t([])),r=new Nt(n,e),s=new Nt(n,e+1);let i=Le();return this.Tr.forEachInRange([r,s],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new Nt(e,0),r=this.Pr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class Nt{constructor(e,n){this.key=e,this.pr=n}static Ir(e,n){return pe.comparator(e.key,n.key)||We(e.pr,n.pr)}static Er(e,n){return We(e.pr,n.pr)||pe.comparator(e.key,n.key)}}/**
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
 */class $V{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.yr=1,this.wr=new Bt(Nt.Ir)}checkEmpty(e){return W.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,s){const i=this.yr;this.yr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new aV(i,n,r,s);this.mutationQueue.push(o);for(const a of s)this.wr=this.wr.add(new Nt(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return W.resolve(o)}lookupMutationBatch(e,n){return W.resolve(this.Sr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,s=this.br(r),i=s<0?0:s;return W.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return W.resolve(this.mutationQueue.length===0?-1:this.yr-1)}getAllMutationBatches(e){return W.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new Nt(n,0),s=new Nt(n,Number.POSITIVE_INFINITY),i=[];return this.wr.forEachInRange([r,s],o=>{const a=this.Sr(o.pr);i.push(a)}),W.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Bt(We);return n.forEach(s=>{const i=new Nt(s,0),o=new Nt(s,Number.POSITIVE_INFINITY);this.wr.forEachInRange([i,o],a=>{r=r.add(a.pr)})}),W.resolve(this.Dr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,s=r.length+1;let i=r;pe.isDocumentKey(i)||(i=i.child(""));const o=new Nt(new pe(i),0);let a=new Bt(We);return this.wr.forEachWhile(c=>{const u=c.key.path;return!!r.isPrefixOf(u)&&(u.length===s&&(a=a.add(c.pr)),!0)},o),W.resolve(this.Dr(a))}Dr(e){const n=[];return e.forEach(r=>{const s=this.Sr(r);s!==null&&n.push(s)}),n}removeMutationBatch(e,n){nt(this.Cr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.wr;return W.forEach(n.mutations,s=>{const i=new Nt(s.key,n.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.wr=r})}Mn(e){}containsKey(e,n){const r=new Nt(n,0),s=this.wr.firstAfterOrEqual(r);return W.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,W.resolve()}Cr(e,n){return this.br(e)}br(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Sr(e){const n=this.br(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class BV{constructor(e){this.vr=e,this.docs=function(){return new mt(pe.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,s=this.docs.get(r),i=s?s.size:0,o=this.vr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return W.resolve(r?r.document.mutableCopy():Kt.newInvalidDocument(n))}getEntries(e,n){let r=Ir();return n.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Kt.newInvalidDocument(s))}),W.resolve(r)}getDocumentsMatchingQuery(e,n,r,s){let i=Ir();const o=n.path,a=new pe(o.child("")),c=this.docs.getIteratorFrom(a);for(;c.hasNext();){const{key:u,value:{document:h}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||CL(TL(h),r)<=0||(s.has(h.key)||gu(n,h))&&(i=i.insert(h.key,h.mutableCopy()))}return W.resolve(i)}getAllFromCollectionGroup(e,n,r,s){Ee()}Fr(e,n){return W.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new jV(this)}getSize(e){return W.resolve(this.size)}}class jV extends MV{constructor(e){super(),this.ar=e}applyChanges(e){const n=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?n.push(this.ar.addEntry(e,s)):this.ar.removeEntry(r)}),W.waitFor(n)}getFromCache(e,n){return this.ar.getEntry(e,n)}getAllFromCache(e,n){return this.ar.getEntries(e,n)}}/**
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
 */class qV{constructor(e){this.persistence=e,this.Mr=new to(n=>ep(n),tp),this.lastRemoteSnapshotVersion=be.min(),this.highestTargetId=0,this.Or=0,this.Nr=new op,this.targetCount=0,this.Lr=qi.Nn()}forEachTarget(e,n){return this.Mr.forEach((r,s)=>n(s)),W.resolve()}getLastRemoteSnapshotVersion(e){return W.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return W.resolve(this.Or)}allocateTargetId(e){return this.highestTargetId=this.Lr.next(),W.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Or&&(this.Or=n),W.resolve()}qn(e){this.Mr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.Lr=new qi(n),this.highestTargetId=n),e.sequenceNumber>this.Or&&(this.Or=e.sequenceNumber)}addTargetData(e,n){return this.qn(n),this.targetCount+=1,W.resolve()}updateTargetData(e,n){return this.qn(n),W.resolve()}removeTargetData(e,n){return this.Mr.delete(n.target),this.Nr.Vr(n.targetId),this.targetCount-=1,W.resolve()}removeTargets(e,n,r){let s=0;const i=[];return this.Mr.forEach((o,a)=>{a.sequenceNumber<=n&&r.get(a.targetId)===null&&(this.Mr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)}),W.waitFor(i).next(()=>s)}getTargetCount(e){return W.resolve(this.targetCount)}getTargetData(e,n){const r=this.Mr.get(n)||null;return W.resolve(r)}addMatchingKeys(e,n,r){return this.Nr.dr(n,r),W.resolve()}removeMatchingKeys(e,n,r){this.Nr.Rr(n,r);const s=this.persistence.referenceDelegate,i=[];return s&&n.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),W.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Nr.Vr(n),W.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Nr.gr(n);return W.resolve(r)}containsKey(e,n){return W.resolve(this.Nr.containsKey(n))}}/**
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
 */class HV{constructor(e,n){this.Br={},this.overlays={},this.kr=new Yf(0),this.qr=!1,this.qr=!0,this.referenceDelegate=e(this),this.Qr=new qV(this),this.indexManager=new OV,this.remoteDocumentCache=function(s){return new BV(s)}(r=>this.referenceDelegate.Kr(r)),this.serializer=new kV(n),this.$r=new FV(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.qr=!1,Promise.resolve()}get started(){return this.qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new UV,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.Br[e.toKey()];return r||(r=new $V(n,this.referenceDelegate),this.Br[e.toKey()]=r),r}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.$r}runTransaction(e,n,r){le("MemoryPersistence","Starting transaction:",e);const s=new WV(this.kr.next());return this.referenceDelegate.Ur(),r(s).next(i=>this.referenceDelegate.Wr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Gr(e,n){return W.or(Object.values(this.Br).map(r=>()=>r.containsKey(e,n)))}}class WV extends SL{constructor(e){super(),this.currentSequenceNumber=e}}class ap{constructor(e){this.persistence=e,this.zr=new op,this.jr=null}static Hr(e){return new ap(e)}get Jr(){if(this.jr)return this.jr;throw Ee()}addReference(e,n,r){return this.zr.addReference(r,n),this.Jr.delete(r.toString()),W.resolve()}removeReference(e,n,r){return this.zr.removeReference(r,n),this.Jr.add(r.toString()),W.resolve()}markPotentiallyOrphaned(e,n){return this.Jr.add(n.toString()),W.resolve()}removeTarget(e,n){this.zr.Vr(n.targetId).forEach(s=>this.Jr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(s=>{s.forEach(i=>this.Jr.add(i.toString()))}).next(()=>r.removeTargetData(e,n))}Ur(){this.jr=new Set}Wr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return W.forEach(this.Jr,r=>{const s=pe.fromPath(r);return this.Yr(e,s).next(i=>{i||n.removeEntry(s,be.min())})}).next(()=>(this.jr=null,n.apply(e)))}updateLimboDocument(e,n){return this.Yr(e,n).next(r=>{r?this.Jr.delete(n.toString()):this.Jr.add(n.toString())})}Kr(e){return 0}Yr(e,n){return W.or([()=>W.resolve(this.zr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Gr(e,n)])}}/**
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
 */class lp{constructor(e,n,r,s){this.targetId=e,this.fromCache=n,this.qi=r,this.Qi=s}static Ki(e,n){let r=Le(),s=Le();for(const i of n.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new lp(e,n.fromCache,r,s)}}/**
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
 */class zV{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class GV{constructor(){this.$i=!1,this.Ui=!1,this.Wi=100,this.Gi=function(){return dx()?8:RL(jt())>0?6:4}()}initialize(e,n){this.zi=e,this.indexManager=n,this.$i=!0}getDocumentsMatchingQuery(e,n,r,s){const i={result:null};return this.ji(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Hi(e,n,s,r).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new zV;return this.Ji(e,n,o).next(a=>{if(i.result=a,this.Ui)return this.Yi(e,n,o,a.size)})}).next(()=>i.result)}Yi(e,n,r,s){return r.documentReadCount<this.Wi?(Ro()<=Me.DEBUG&&le("QueryEngine","SDK will not create cache indexes for query:",gi(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Wi,"documents"),W.resolve()):(Ro()<=Me.DEBUG&&le("QueryEngine","Query:",gi(n),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Gi*s?(Ro()<=Me.DEBUG&&le("QueryEngine","The SDK decides to create cache indexes for query:",gi(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Yn(n))):W.resolve())}ji(e,n){if(J_(n))return W.resolve(null);let r=Yn(n);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(n.limit!==null&&s===1&&(n=_d(n,null,"F"),r=Yn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const o=Le(...i);return this.zi.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,r).next(c=>{const u=this.Zi(n,a);return this.Xi(n,u,o,c.readTime)?this.ji(e,_d(n,null,"F")):this.es(e,u,n,c)}))})))}Hi(e,n,r,s){return J_(n)||s.isEqual(be.min())?W.resolve(null):this.zi.getDocuments(e,r).next(i=>{const o=this.Zi(n,i);return this.Xi(n,o,r,s)?W.resolve(null):(Ro()<=Me.DEBUG&&le("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),gi(n)),this.es(e,o,n,IL(s,-1)).next(a=>a))})}Zi(e,n){let r=new Bt(eb(e));return n.forEach((s,i)=>{gu(e,i)&&(r=r.add(i))}),r}Xi(e,n,r,s){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ji(e,n,r){return Ro()<=Me.DEBUG&&le("QueryEngine","Using full collection scan to execute query:",gi(n)),this.zi.getDocumentsMatchingQuery(e,n,as.min(),r)}es(e,n,r,s){return this.zi.getDocumentsMatchingQuery(e,r,s).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
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
 */class KV{constructor(e,n,r,s){this.persistence=e,this.ts=n,this.serializer=s,this.ns=new mt(We),this.rs=new to(i=>ep(i),tp),this.ss=new Map,this.os=e.getRemoteDocumentCache(),this.Qr=e.getTargetCache(),this.$r=e.getBundleCache(),this._s(r)}_s(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new VV(this.os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.os.setIndexManager(this.indexManager),this.ts.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.ns))}}function QV(t,e,n,r){return new KV(t,e,n,r)}async function Ib(t,e){const n=Te(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let s;return n.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,n._s(e),n.mutationQueue.getAllMutationBatches(r))).next(i=>{const o=[],a=[];let c=Le();for(const u of s){o.push(u.batchId);for(const h of u.mutations)c=c.add(h.key)}for(const u of i){a.push(u.batchId);for(const h of u.mutations)c=c.add(h.key)}return n.localDocuments.getDocuments(r,c).next(u=>({us:u,removedBatchIds:o,addedBatchIds:a}))})})}function YV(t,e){const n=Te(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=n.os.newChangeBuffer({trackRemovals:!0});return function(a,c,u,h){const d=u.batch,p=d.keys();let g=W.resolve();return p.forEach(v=>{g=g.next(()=>h.getEntry(c,v)).next(S=>{const P=u.docVersions.get(v);nt(P!==null),S.version.compareTo(P)<0&&(d.applyToRemoteDocument(S,u),S.isValidDocument()&&(S.setReadTime(u.commitVersion),h.addEntry(S)))})}),g.next(()=>a.mutationQueue.removeMutationBatch(c,d))}(n,r,e,i).next(()=>i.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(a){let c=Le();for(let u=0;u<a.mutationResults.length;++u)a.mutationResults[u].transformResults.length>0&&(c=c.add(a.batch.mutations[u].key));return c}(e))).next(()=>n.localDocuments.getDocuments(r,s))})}function Tb(t){const e=Te(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Qr.getLastRemoteSnapshotVersion(n))}function JV(t,e){const n=Te(t),r=e.snapshotVersion;let s=n.ns;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.os.newChangeBuffer({trackRemovals:!0});s=n.ns;const a=[];e.targetChanges.forEach((h,d)=>{const p=s.get(d);if(!p)return;a.push(n.Qr.removeMatchingKeys(i,h.removedDocuments,d).next(()=>n.Qr.addMatchingKeys(i,h.addedDocuments,d)));let g=p.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(d)!==null?g=g.withResumeToken(Jt.EMPTY_BYTE_STRING,be.min()).withLastLimboFreeSnapshotVersion(be.min()):h.resumeToken.approximateByteSize()>0&&(g=g.withResumeToken(h.resumeToken,r)),s=s.insert(d,g),function(S,P,M){return S.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:M.addedDocuments.size+M.modifiedDocuments.size+M.removedDocuments.size>0}(p,g,h)&&a.push(n.Qr.updateTargetData(i,g))});let c=Ir(),u=Le();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(i,h))}),a.push(XV(i,o,e.documentUpdates).next(h=>{c=h.cs,u=h.ls})),!r.isEqual(be.min())){const h=n.Qr.getLastRemoteSnapshotVersion(i).next(d=>n.Qr.setTargetsMetadata(i,i.currentSequenceNumber,r));a.push(h)}return W.waitFor(a).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,c,u)).next(()=>c)}).then(i=>(n.ns=s,i))}function XV(t,e,n){let r=Le(),s=Le();return n.forEach(i=>r=r.add(i)),e.getEntries(t,r).next(i=>{let o=Ir();return n.forEach((a,c)=>{const u=i.get(a);c.isFoundDocument()!==u.isFoundDocument()&&(s=s.add(a)),c.isNoDocument()&&c.version.isEqual(be.min())?(e.removeEntry(a,c.readTime),o=o.insert(a,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(a,c)):le("LocalStore","Ignoring outdated watch update for ",a,". Current version:",u.version," Watch version:",c.version)}),{cs:o,ls:s}})}function ZV(t,e){const n=Te(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function e2(t,e){const n=Te(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return n.Qr.getTargetData(r,e).next(i=>i?(s=i,W.resolve(s)):n.Qr.allocateTargetId(r).next(o=>(s=new Kr(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Qr.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=n.ns.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.ns=n.ns.insert(r.targetId,r),n.rs.set(e,r.targetId)),r})}async function bd(t,e,n){const r=Te(t),s=r.ns.get(e),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,o=>r.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Ha(o))throw o;le("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.ns=r.ns.remove(e),r.rs.delete(s.target)}function ly(t,e,n){const r=Te(t);let s=be.min(),i=Le();return r.persistence.runTransaction("Execute query","readwrite",o=>function(c,u,h){const d=Te(c),p=d.rs.get(h);return p!==void 0?W.resolve(d.ns.get(p)):d.Qr.getTargetData(u,h)}(r,o,Yn(e)).next(a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,r.Qr.getMatchingKeysForTargetId(o,a.targetId).next(c=>{i=c})}).next(()=>r.ts.getDocumentsMatchingQuery(o,e,n?s:be.min(),n?i:Le())).next(a=>(t2(r,zL(e),a),{documents:a,hs:i})))}function t2(t,e,n){let r=t.ss.get(e)||be.min();n.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),t.ss.set(e,r)}class cy{constructor(){this.activeTargetIds=XL()}As(e){this.activeTargetIds=this.activeTargetIds.add(e)}Rs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ds(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class n2{constructor(){this.no=new cy,this.ro={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e){return this.no.As(e),this.ro[e]||"not-current"}updateQueryState(e,n,r){this.ro[e]=n}removeLocalQueryTarget(e){this.no.Rs(e)}isLocalQueryTarget(e){return this.no.activeTargetIds.has(e)}clearQueryState(e){delete this.ro[e]}getAllActiveQueryTargets(){return this.no.activeTargetIds}isActiveQueryTarget(e){return this.no.activeTargetIds.has(e)}start(){return this.no=new cy,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class r2{io(e){}shutdown(){}}/**
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
 */class uy{constructor(){this.so=()=>this.oo(),this._o=()=>this.ao(),this.uo=[],this.co()}io(e){this.uo.push(e)}shutdown(){window.removeEventListener("online",this.so),window.removeEventListener("offline",this._o)}co(){window.addEventListener("online",this.so),window.addEventListener("offline",this._o)}oo(){le("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.uo)e(0)}ao(){le("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.uo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let xl=null;function wh(){return xl===null?xl=function(){return 268435456+Math.round(2147483648*Math.random())}():xl++,"0x"+xl.toString(16)}/**
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
 */const s2={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class i2{constructor(e){this.lo=e.lo,this.ho=e.ho}Po(e){this.Io=e}To(e){this.Eo=e}Ao(e){this.Ro=e}onMessage(e){this.Vo=e}close(){this.ho()}send(e){this.lo(e)}mo(){this.Io()}fo(){this.Eo()}po(e){this.Ro(e)}yo(e){this.Vo(e)}}/**
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
 */const Wt="WebChannelConnection";class o2 extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.wo=r+"://"+n.host,this.So=`projects/${s}/databases/${i}`,this.bo=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Do(){return!1}Co(n,r,s,i,o){const a=wh(),c=this.vo(n,r.toUriEncodedString());le("RestConnection",`Sending RPC '${n}' ${a}:`,c,s);const u={"google-cloud-resource-prefix":this.So,"x-goog-request-params":this.bo};return this.Fo(u,i,o),this.Mo(n,c,u,s).then(h=>(le("RestConnection",`Received RPC '${n}' ${a}: `,h),h),h=>{throw Ui("RestConnection",`RPC '${n}' ${a} failed with error: `,h,"url: ",c,"request:",s),h})}xo(n,r,s,i,o,a){return this.Co(n,r,s,i,o)}Fo(n,r,s){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zi}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,o)=>n[o]=i),s&&s.headers.forEach((i,o)=>n[o]=i)}vo(n,r){const s=s2[n];return`${this.wo}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Mo(e,n,r,s){const i=wh();return new Promise((o,a)=>{const c=new LE;c.setWithCredentials(!0),c.listenOnce(FE.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case $l.NO_ERROR:const h=c.getResponseJson();le(Wt,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(h)),o(h);break;case $l.TIMEOUT:le(Wt,`RPC '${e}' ${i} timed out`),a(new me(K.DEADLINE_EXCEEDED,"Request time out"));break;case $l.HTTP_ERROR:const d=c.getStatus();if(le(Wt,`RPC '${e}' ${i} failed with status:`,d,"response text:",c.getResponseText()),d>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const g=p==null?void 0:p.error;if(g&&g.status&&g.message){const v=function(P){const M=P.toLowerCase().replace(/_/g,"-");return Object.values(K).indexOf(M)>=0?M:K.UNKNOWN}(g.status);a(new me(v,g.message))}else a(new me(K.UNKNOWN,"Server responded with status "+c.getStatus()))}else a(new me(K.UNAVAILABLE,"Connection failed."));break;default:Ee()}}finally{le(Wt,`RPC '${e}' ${i} completed.`)}});const u=JSON.stringify(s);le(Wt,`RPC '${e}' ${i} sending request:`,s),c.send(n,"POST",u,r,15)})}Oo(e,n,r){const s=wh(),i=[this.wo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=BE(),a=$E(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.xmlHttpFactory=new VE({})),this.Fo(c.initMessageHeaders,n,r),c.encodeInitMessageHeaders=!0;const h=i.join("");le(Wt,`Creating RPC '${e}' stream ${s}: ${h}`,c);const d=o.createWebChannel(h,c);let p=!1,g=!1;const v=new i2({lo:P=>{g?le(Wt,`Not sending because RPC '${e}' stream ${s} is closed:`,P):(p||(le(Wt,`Opening RPC '${e}' stream ${s} transport.`),d.open(),p=!0),le(Wt,`RPC '${e}' stream ${s} sending:`,P),d.send(P))},ho:()=>d.close()}),S=(P,M,F)=>{P.listen(M,U=>{try{F(U)}catch(N){setTimeout(()=>{throw N},0)}})};return S(d,Oo.EventType.OPEN,()=>{g||(le(Wt,`RPC '${e}' stream ${s} transport opened.`),v.mo())}),S(d,Oo.EventType.CLOSE,()=>{g||(g=!0,le(Wt,`RPC '${e}' stream ${s} transport closed`),v.po())}),S(d,Oo.EventType.ERROR,P=>{g||(g=!0,Ui(Wt,`RPC '${e}' stream ${s} transport errored:`,P),v.po(new me(K.UNAVAILABLE,"The operation could not be completed")))}),S(d,Oo.EventType.MESSAGE,P=>{var M;if(!g){const F=P.data[0];nt(!!F);const U=F,N=U.error||((M=U[0])===null||M===void 0?void 0:M.error);if(N){le(Wt,`RPC '${e}' stream ${s} received error:`,N);const G=N.status;let B=function(w){const T=Et[w];if(T!==void 0)return fb(T)}(G),A=N.message;B===void 0&&(B=K.INTERNAL,A="Unknown error status: "+G+" with message "+N.message),g=!0,v.po(new me(B,A)),d.close()}else le(Wt,`RPC '${e}' stream ${s} received:`,F),v.yo(F)}}),S(a,UE.STAT_EVENT,P=>{P.stat===dd.PROXY?le(Wt,`RPC '${e}' stream ${s} detected buffering proxy`):P.stat===dd.NOPROXY&&le(Wt,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{v.fo()},0),v}}function Eh(){return typeof document<"u"?document:null}/**
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
 */function wu(t){return new _V(t,!0)}/**
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
 */class Cb{constructor(e,n,r=1e3,s=1.5,i=6e4){this.oi=e,this.timerId=n,this.No=r,this.Lo=s,this.Bo=i,this.ko=0,this.qo=null,this.Qo=Date.now(),this.reset()}reset(){this.ko=0}Ko(){this.ko=this.Bo}$o(e){this.cancel();const n=Math.floor(this.ko+this.Uo()),r=Math.max(0,Date.now()-this.Qo),s=Math.max(0,n-r);s>0&&le("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.qo=this.oi.enqueueAfterDelay(this.timerId,s,()=>(this.Qo=Date.now(),e())),this.ko*=this.Lo,this.ko<this.No&&(this.ko=this.No),this.ko>this.Bo&&(this.ko=this.Bo)}Wo(){this.qo!==null&&(this.qo.skipDelay(),this.qo=null)}cancel(){this.qo!==null&&(this.qo.cancel(),this.qo=null)}Uo(){return(Math.random()-.5)*this.ko}}/**
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
 */class Ab{constructor(e,n,r,s,i,o,a,c){this.oi=e,this.Go=r,this.zo=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=c,this.state=0,this.jo=0,this.Ho=null,this.Jo=null,this.stream=null,this.Yo=new Cb(e,n)}Zo(){return this.state===1||this.state===5||this.Xo()}Xo(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.e_()}async stop(){this.Zo()&&await this.close(0)}t_(){this.state=0,this.Yo.reset()}n_(){this.Xo()&&this.Ho===null&&(this.Ho=this.oi.enqueueAfterDelay(this.Go,6e4,()=>this.r_()))}i_(e){this.s_(),this.stream.send(e)}async r_(){if(this.Xo())return this.close(0)}s_(){this.Ho&&(this.Ho.cancel(),this.Ho=null)}o_(){this.Jo&&(this.Jo.cancel(),this.Jo=null)}async close(e,n){this.s_(),this.o_(),this.Yo.cancel(),this.jo++,e!==4?this.Yo.reset():n&&n.code===K.RESOURCE_EXHAUSTED?(br(n.toString()),br("Using maximum backoff delay to prevent overloading the backend."),this.Yo.Ko()):n&&n.code===K.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.__(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ao(n)}__(){}auth(){this.state=1;const e=this.a_(this.jo),n=this.jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.jo===n&&this.u_(r,s)},r=>{e(()=>{const s=new me(K.UNKNOWN,"Fetching auth token failed: "+r.message);return this.c_(s)})})}u_(e,n){const r=this.a_(this.jo);this.stream=this.l_(e,n),this.stream.Po(()=>{r(()=>this.listener.Po())}),this.stream.To(()=>{r(()=>(this.state=2,this.Jo=this.oi.enqueueAfterDelay(this.zo,1e4,()=>(this.Xo()&&(this.state=3),Promise.resolve())),this.listener.To()))}),this.stream.Ao(s=>{r(()=>this.c_(s))}),this.stream.onMessage(s=>{r(()=>this.onMessage(s))})}e_(){this.state=5,this.Yo.$o(async()=>{this.state=0,this.start()})}c_(e){return le("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}a_(e){return n=>{this.oi.enqueueAndForget(()=>this.jo===e?n():(le("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class a2 extends Ab{constructor(e,n,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i}l_(e,n){return this.connection.Oo("Listen",e,n)}onMessage(e){this.Yo.reset();const n=wV(this.serializer,e),r=function(i){if(!("targetChange"in i))return be.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?be.min():o.readTime?Jn(o.readTime):be.min()}(e);return this.listener.h_(n,r)}P_(e){const n={};n.database=Ed(this.serializer),n.addTarget=function(i,o){let a;const c=o.target;if(a=gd(c)?{documents:IV(i,c)}:{query:TV(i,c)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=gb(i,o.resumeToken);const u=yd(i,o.expectedCount);u!==null&&(a.expectedCount=u)}else if(o.snapshotVersion.compareTo(be.min())>0){a.readTime=Tc(i,o.snapshotVersion.toTimestamp());const u=yd(i,o.expectedCount);u!==null&&(a.expectedCount=u)}return a}(this.serializer,e);const r=AV(this.serializer,e);r&&(n.labels=r),this.i_(n)}I_(e){const n={};n.database=Ed(this.serializer),n.removeTarget=e,this.i_(n)}}class l2 extends Ab{constructor(e,n,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,s,o),this.serializer=i,this.T_=!1}get E_(){return this.T_}start(){this.T_=!1,this.lastStreamToken=void 0,super.start()}__(){this.T_&&this.d_([])}l_(e,n){return this.connection.Oo("Write",e,n)}onMessage(e){if(nt(!!e.streamToken),this.lastStreamToken=e.streamToken,this.T_){this.Yo.reset();const n=bV(e.writeResults,e.commitTime),r=Jn(e.commitTime);return this.listener.A_(r,n)}return nt(!e.writeResults||e.writeResults.length===0),this.T_=!0,this.listener.R_()}V_(){const e={};e.database=Ed(this.serializer),this.i_(e)}d_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>EV(this.serializer,r))};this.i_(n)}}/**
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
 */class c2 extends class{}{constructor(e,n,r,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.m_=!1}f_(){if(this.m_)throw new me(K.FAILED_PRECONDITION,"The client has already been terminated.")}Co(e,n,r,s){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Co(e,vd(n,r),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===K.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new me(K.UNKNOWN,i.toString())})}xo(e,n,r,s,i){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.xo(e,vd(n,r),s,o,a,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===K.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new me(K.UNKNOWN,o.toString())})}terminate(){this.m_=!0,this.connection.terminate()}}class u2{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.g_=0,this.p_=null,this.y_=!0}w_(){this.g_===0&&(this.S_("Unknown"),this.p_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.p_=null,this.b_("Backend didn't respond within 10 seconds."),this.S_("Offline"),Promise.resolve())))}D_(e){this.state==="Online"?this.S_("Unknown"):(this.g_++,this.g_>=1&&(this.C_(),this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.S_("Offline")))}set(e){this.C_(),this.g_=0,e==="Online"&&(this.y_=!1),this.S_(e)}S_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}b_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.y_?(br(n),this.y_=!1):le("OnlineStateTracker",n)}C_(){this.p_!==null&&(this.p_.cancel(),this.p_=null)}}/**
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
 */class h2{constructor(e,n,r,s,i){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.v_=[],this.F_=new Map,this.M_=new Set,this.x_=[],this.O_=i,this.O_.io(o=>{r.enqueueAndForget(async()=>{ri(this)&&(le("RemoteStore","Restarting streams for network reachability change."),await async function(c){const u=Te(c);u.M_.add(4),await Ga(u),u.N_.set("Unknown"),u.M_.delete(4),await Eu(u)}(this))})}),this.N_=new u2(r,s)}}async function Eu(t){if(ri(t))for(const e of t.x_)await e(!0)}async function Ga(t){for(const e of t.x_)await e(!1)}function Sb(t,e){const n=Te(t);n.F_.has(e.targetId)||(n.F_.set(e.targetId,e),dp(n)?hp(n):no(n).Xo()&&up(n,e))}function cp(t,e){const n=Te(t),r=no(n);n.F_.delete(e),r.Xo()&&Rb(n,e),n.F_.size===0&&(r.Xo()?r.n_():ri(n)&&n.N_.set("Unknown"))}function up(t,e){if(t.L_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(be.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}no(t).P_(e)}function Rb(t,e){t.L_.xe(e),no(t).I_(e)}function hp(t){t.L_=new fV({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.F_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),no(t).start(),t.N_.w_()}function dp(t){return ri(t)&&!no(t).Zo()&&t.F_.size>0}function ri(t){return Te(t).M_.size===0}function Pb(t){t.L_=void 0}async function d2(t){t.N_.set("Online")}async function f2(t){t.F_.forEach((e,n)=>{up(t,e)})}async function p2(t,e){Pb(t),dp(t)?(t.N_.D_(e),hp(t)):t.N_.set("Unknown")}async function m2(t,e,n){if(t.N_.set("Online"),e instanceof mb&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const a of i.targetIds)s.F_.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.F_.delete(a),s.L_.removeTarget(a))}(t,e)}catch(r){le("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Cc(t,r)}else if(e instanceof ql?t.L_.Ke(e):e instanceof pb?t.L_.He(e):t.L_.We(e),!n.isEqual(be.min()))try{const r=await Tb(t.localStore);n.compareTo(r)>=0&&await function(i,o){const a=i.L_.rt(o);return a.targetChanges.forEach((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.F_.get(u);h&&i.F_.set(u,h.withResumeToken(c.resumeToken,o))}}),a.targetMismatches.forEach((c,u)=>{const h=i.F_.get(c);if(!h)return;i.F_.set(c,h.withResumeToken(Jt.EMPTY_BYTE_STRING,h.snapshotVersion)),Rb(i,c);const d=new Kr(h.target,c,u,h.sequenceNumber);up(i,d)}),i.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(r){le("RemoteStore","Failed to raise snapshot:",r),await Cc(t,r)}}async function Cc(t,e,n){if(!Ha(e))throw e;t.M_.add(1),await Ga(t),t.N_.set("Offline"),n||(n=()=>Tb(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{le("RemoteStore","Retrying IndexedDB access"),await n(),t.M_.delete(1),await Eu(t)})}function xb(t,e){return e().catch(n=>Cc(t,n,e))}async function bu(t){const e=Te(t),n=cs(e);let r=e.v_.length>0?e.v_[e.v_.length-1].batchId:-1;for(;g2(e);)try{const s=await ZV(e.localStore,r);if(s===null){e.v_.length===0&&n.n_();break}r=s.batchId,_2(e,s)}catch(s){await Cc(e,s)}kb(e)&&Nb(e)}function g2(t){return ri(t)&&t.v_.length<10}function _2(t,e){t.v_.push(e);const n=cs(t);n.Xo()&&n.E_&&n.d_(e.mutations)}function kb(t){return ri(t)&&!cs(t).Zo()&&t.v_.length>0}function Nb(t){cs(t).start()}async function y2(t){cs(t).V_()}async function v2(t){const e=cs(t);for(const n of t.v_)e.d_(n.mutations)}async function w2(t,e,n){const r=t.v_.shift(),s=rp.from(r,e,n);await xb(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await bu(t)}async function E2(t,e){e&&cs(t).E_&&await async function(r,s){if(function(o){return uV(o)&&o!==K.ABORTED}(s.code)){const i=r.v_.shift();cs(r).t_(),await xb(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await bu(r)}}(t,e),kb(t)&&Nb(t)}async function hy(t,e){const n=Te(t);n.asyncQueue.verifyOperationInProgress(),le("RemoteStore","RemoteStore received new credentials");const r=ri(n);n.M_.add(3),await Ga(n),r&&n.N_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.M_.delete(3),await Eu(n)}async function b2(t,e){const n=Te(t);e?(n.M_.delete(2),await Eu(n)):e||(n.M_.add(2),await Ga(n),n.N_.set("Unknown"))}function no(t){return t.B_||(t.B_=function(n,r,s){const i=Te(n);return i.f_(),new a2(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Po:d2.bind(null,t),To:f2.bind(null,t),Ao:p2.bind(null,t),h_:m2.bind(null,t)}),t.x_.push(async e=>{e?(t.B_.t_(),dp(t)?hp(t):t.N_.set("Unknown")):(await t.B_.stop(),Pb(t))})),t.B_}function cs(t){return t.k_||(t.k_=function(n,r,s){const i=Te(n);return i.f_(),new l2(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(t.datastore,t.asyncQueue,{Po:()=>Promise.resolve(),To:y2.bind(null,t),Ao:E2.bind(null,t),R_:v2.bind(null,t),A_:w2.bind(null,t)}),t.x_.push(async e=>{e?(t.k_.t_(),await bu(t)):(await t.k_.stop(),t.v_.length>0&&(le("RemoteStore",`Stopping write stream with ${t.v_.length} pending writes`),t.v_=[]))})),t.k_}/**
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
 */class fp{constructor(e,n,r,s,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new ts,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,s,i){const o=Date.now()+r,a=new fp(e,n,o,s,i);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new me(K.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function pp(t,e){if(br("AsyncQueue",`${e}: ${t}`),Ha(t))return new me(K.UNAVAILABLE,`${e}: ${t}`);throw t}/**
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
 */class Ri{constructor(e){this.comparator=e?(n,r)=>e(n,r)||pe.comparator(n.key,r.key):(n,r)=>pe.comparator(n.key,r.key),this.keyedMap=Do(),this.sortedSet=new mt(this.comparator)}static emptySet(e){return new Ri(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Ri)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Ri;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
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
 */class dy{constructor(){this.q_=new mt(pe.comparator)}track(e){const n=e.doc.key,r=this.q_.get(n);r?e.type!==0&&r.type===3?this.q_=this.q_.insert(n,e):e.type===3&&r.type!==1?this.q_=this.q_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.q_=this.q_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.q_=this.q_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.q_=this.q_.remove(n):e.type===1&&r.type===2?this.q_=this.q_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.q_=this.q_.insert(n,{type:2,doc:e.doc}):Ee():this.q_=this.q_.insert(n,e)}Q_(){const e=[];return this.q_.inorderTraversal((n,r)=>{e.push(r)}),e}}class Hi{constructor(e,n,r,s,i,o,a,c,u){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,n,r,s,i){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new Hi(e,n,Ri.emptySet(n),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&mu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==r[s].type||!n[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class I2{constructor(){this.K_=void 0,this.U_=[]}W_(){return this.U_.some(e=>e.G_())}}class T2{constructor(){this.queries=new to(e=>ZE(e),mu),this.onlineState="Unknown",this.z_=new Set}}async function C2(t,e){const n=Te(t);let r=3;const s=e.query;let i=n.queries.get(s);i?!i.W_()&&e.G_()&&(r=2):(i=new I2,r=e.G_()?0:1);try{switch(r){case 0:i.K_=await n.onListen(s,!0);break;case 1:i.K_=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const a=pp(o,`Initialization of query '${gi(e.query)}' failed`);return void e.onError(a)}n.queries.set(s,i),i.U_.push(e),e.j_(n.onlineState),i.K_&&e.H_(i.K_)&&mp(n)}async function A2(t,e){const n=Te(t),r=e.query;let s=3;const i=n.queries.get(r);if(i){const o=i.U_.indexOf(e);o>=0&&(i.U_.splice(o,1),i.U_.length===0?s=e.G_()?0:1:!i.W_()&&e.G_()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function S2(t,e){const n=Te(t);let r=!1;for(const s of e){const i=s.query,o=n.queries.get(i);if(o){for(const a of o.U_)a.H_(s)&&(r=!0);o.K_=s}}r&&mp(n)}function R2(t,e,n){const r=Te(t),s=r.queries.get(e);if(s)for(const i of s.U_)i.onError(n);r.queries.delete(e)}function mp(t){t.z_.forEach(e=>{e.next()})}var Id,fy;(fy=Id||(Id={})).J_="default",fy.Cache="cache";class P2{constructor(e,n,r){this.query=e,this.Y_=n,this.Z_=!1,this.X_=null,this.onlineState="Unknown",this.options=r||{}}H_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Hi(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Z_?this.ea(e)&&(this.Y_.next(e),n=!0):this.ta(e,this.onlineState)&&(this.na(e),n=!0),this.X_=e,n}onError(e){this.Y_.error(e)}j_(e){this.onlineState=e;let n=!1;return this.X_&&!this.Z_&&this.ta(this.X_,e)&&(this.na(this.X_),n=!0),n}ta(e,n){if(!e.fromCache||!this.G_())return!0;const r=n!=="Offline";return(!this.options.ra||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ea(e){if(e.docChanges.length>0)return!0;const n=this.X_&&this.X_.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}na(e){e=Hi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Z_=!0,this.Y_.next(e)}G_(){return this.options.source!==Id.Cache}}/**
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
 */class Ob{constructor(e){this.key=e}}class Db{constructor(e){this.key=e}}class x2{constructor(e,n){this.query=e,this.la=n,this.ha=null,this.hasCachedResults=!1,this.current=!1,this.Pa=Le(),this.mutatedKeys=Le(),this.Ia=eb(e),this.Ta=new Ri(this.Ia)}get Ea(){return this.la}da(e,n){const r=n?n.Aa:new dy,s=n?n.Ta:this.Ta;let i=n?n.mutatedKeys:this.mutatedKeys,o=s,a=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,u=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((h,d)=>{const p=s.get(h),g=gu(this.query,d)?d:null,v=!!p&&this.mutatedKeys.has(p.key),S=!!g&&(g.hasLocalMutations||this.mutatedKeys.has(g.key)&&g.hasCommittedMutations);let P=!1;p&&g?p.data.isEqual(g.data)?v!==S&&(r.track({type:3,doc:g}),P=!0):this.Ra(p,g)||(r.track({type:2,doc:g}),P=!0,(c&&this.Ia(g,c)>0||u&&this.Ia(g,u)<0)&&(a=!0)):!p&&g?(r.track({type:0,doc:g}),P=!0):p&&!g&&(r.track({type:1,doc:p}),P=!0,(c||u)&&(a=!0)),P&&(g?(o=o.add(g),i=S?i.add(h):i.delete(h)):(o=o.delete(h),i=i.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),i=i.delete(h.key),r.track({type:1,doc:h})}return{Ta:o,Aa:r,Xi:a,mutatedKeys:i}}Ra(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,s){const i=this.Ta;this.Ta=e.Ta,this.mutatedKeys=e.mutatedKeys;const o=e.Aa.Q_();o.sort((h,d)=>function(g,v){const S=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Ee()}};return S(g)-S(v)}(h.type,d.type)||this.Ia(h.doc,d.doc)),this.Va(r),s=s!=null&&s;const a=n&&!s?this.ma():[],c=this.Pa.size===0&&this.current&&!s?1:0,u=c!==this.ha;return this.ha=c,o.length!==0||u?{snapshot:new Hi(this.query,e.Ta,i,o,e.mutatedKeys,c===0,u,!1,!!r&&r.resumeToken.approximateByteSize()>0),fa:a}:{fa:a}}j_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ta:this.Ta,Aa:new dy,mutatedKeys:this.mutatedKeys,Xi:!1},!1)):{fa:[]}}ga(e){return!this.la.has(e)&&!!this.Ta.has(e)&&!this.Ta.get(e).hasLocalMutations}Va(e){e&&(e.addedDocuments.forEach(n=>this.la=this.la.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.la=this.la.delete(n)),this.current=e.current)}ma(){if(!this.current)return[];const e=this.Pa;this.Pa=Le(),this.Ta.forEach(r=>{this.ga(r.key)&&(this.Pa=this.Pa.add(r.key))});const n=[];return e.forEach(r=>{this.Pa.has(r)||n.push(new Db(r))}),this.Pa.forEach(r=>{e.has(r)||n.push(new Ob(r))}),n}pa(e){this.la=e.hs,this.Pa=Le();const n=this.da(e.documents);return this.applyChanges(n,!0)}ya(){return Hi.fromInitialDocuments(this.query,this.Ta,this.mutatedKeys,this.ha===0,this.hasCachedResults)}}class k2{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class N2{constructor(e){this.key=e,this.wa=!1}}class O2{constructor(e,n,r,s,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Sa={},this.ba=new to(a=>ZE(a),mu),this.Da=new Map,this.Ca=new Set,this.va=new mt(pe.comparator),this.Fa=new Map,this.Ma=new op,this.xa={},this.Oa=new Map,this.Na=qi.Ln(),this.onlineState="Unknown",this.La=void 0}get isPrimaryClient(){return this.La===!0}}async function D2(t,e,n=!0){const r=$b(t);let s;const i=r.ba.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.ya()):s=await Mb(r,e,n,!0),s}async function M2(t,e){const n=$b(t);await Mb(n,e,!0,!1)}async function Mb(t,e,n,r){const s=await e2(t.localStore,Yn(e)),i=s.targetId,o=n?t.sharedClientState.addLocalQueryTarget(i):"not-current";let a;return r&&(a=await L2(t,e,i,o==="current",s.resumeToken)),t.isPrimaryClient&&n&&Sb(t.remoteStore,s),a}async function L2(t,e,n,r,s){t.Ba=(d,p,g)=>async function(S,P,M,F){let U=P.view.da(M);U.Xi&&(U=await ly(S.localStore,P.query,!1).then(({documents:A})=>P.view.da(A,U)));const N=F&&F.targetChanges.get(P.targetId),G=F&&F.targetMismatches.get(P.targetId)!=null,B=P.view.applyChanges(U,S.isPrimaryClient,N,G);return my(S,P.targetId,B.fa),B.snapshot}(t,d,p,g);const i=await ly(t.localStore,e,!0),o=new x2(e,i.hs),a=o.da(i.documents),c=za.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",s),u=o.applyChanges(a,t.isPrimaryClient,c);my(t,n,u.fa);const h=new k2(e,n,o);return t.ba.set(e,h),t.Da.has(n)?t.Da.get(n).push(e):t.Da.set(n,[e]),u.snapshot}async function V2(t,e,n){const r=Te(t),s=r.ba.get(e),i=r.Da.get(s.targetId);if(i.length>1)return r.Da.set(s.targetId,i.filter(o=>!mu(o,e))),void r.ba.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await bd(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&cp(r.remoteStore,s.targetId),Td(r,s.targetId)}).catch(qa)):(Td(r,s.targetId),await bd(r.localStore,s.targetId,!0))}async function F2(t,e){const n=Te(t),r=n.ba.get(e),s=n.Da.get(r.targetId);n.isPrimaryClient&&s.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),cp(n.remoteStore,r.targetId))}async function U2(t,e,n){const r=z2(t);try{const s=await function(o,a){const c=Te(o),u=Pt.now(),h=a.reduce((g,v)=>g.add(v.key),Le());let d,p;return c.persistence.runTransaction("Locally write mutations","readwrite",g=>{let v=Ir(),S=Le();return c.os.getEntries(g,h).next(P=>{v=P,v.forEach((M,F)=>{F.isValidDocument()||(S=S.add(M))})}).next(()=>c.localDocuments.getOverlayedDocuments(g,v)).next(P=>{d=P;const M=[];for(const F of a){const U=iV(F,d.get(F.key).overlayedDocument);U!=null&&M.push(new ni(F.key,U,zE(U.value.mapValue),yr.exists(!0)))}return c.mutationQueue.addMutationBatch(g,u,M,a)}).next(P=>{p=P;const M=P.applyToLocalDocumentSet(d,S);return c.documentOverlayCache.saveOverlays(g,P.batchId,M)})}).then(()=>({batchId:p.batchId,changes:nb(d)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(o,a,c){let u=o.xa[o.currentUser.toKey()];u||(u=new mt(We)),u=u.insert(a,c),o.xa[o.currentUser.toKey()]=u}(r,s.batchId,n),await Ka(r,s.changes),await bu(r.remoteStore)}catch(s){const i=pp(s,"Failed to persist write");n.reject(i)}}async function Lb(t,e){const n=Te(t);try{const r=await JV(n.localStore,e);e.targetChanges.forEach((s,i)=>{const o=n.Fa.get(i);o&&(nt(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.wa=!0:s.modifiedDocuments.size>0?nt(o.wa):s.removedDocuments.size>0&&(nt(o.wa),o.wa=!1))}),await Ka(n,r,e)}catch(r){await qa(r)}}function py(t,e,n){const r=Te(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const s=[];r.ba.forEach((i,o)=>{const a=o.view.j_(e);a.snapshot&&s.push(a.snapshot)}),function(o,a){const c=Te(o);c.onlineState=a;let u=!1;c.queries.forEach((h,d)=>{for(const p of d.U_)p.j_(a)&&(u=!0)}),u&&mp(c)}(r.eventManager,e),s.length&&r.Sa.h_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function $2(t,e,n){const r=Te(t);r.sharedClientState.updateQueryState(e,"rejected",n);const s=r.Fa.get(e),i=s&&s.key;if(i){let o=new mt(pe.comparator);o=o.insert(i,Kt.newNoDocument(i,be.min()));const a=Le().add(i),c=new vu(be.min(),new Map,new mt(We),o,a);await Lb(r,c),r.va=r.va.remove(i),r.Fa.delete(e),gp(r)}else await bd(r.localStore,e,!1).then(()=>Td(r,e,n)).catch(qa)}async function B2(t,e){const n=Te(t),r=e.batch.batchId;try{const s=await YV(n.localStore,e);Fb(n,r,null),Vb(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Ka(n,s)}catch(s){await qa(s)}}async function j2(t,e,n){const r=Te(t);try{const s=await function(o,a){const c=Te(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let h;return c.mutationQueue.lookupMutationBatch(u,a).next(d=>(nt(d!==null),h=d.keys(),c.mutationQueue.removeMutationBatch(u,d))).next(()=>c.mutationQueue.performConsistencyCheck(u)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(u,h,a)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,h)).next(()=>c.localDocuments.getDocuments(u,h))})}(r.localStore,e);Fb(r,e,n),Vb(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Ka(r,s)}catch(s){await qa(s)}}function Vb(t,e){(t.Oa.get(e)||[]).forEach(n=>{n.resolve()}),t.Oa.delete(e)}function Fb(t,e,n){const r=Te(t);let s=r.xa[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(n?i.reject(n):i.resolve(),s=s.remove(e)),r.xa[r.currentUser.toKey()]=s}}function Td(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Da.get(e))t.ba.delete(r),n&&t.Sa.ka(r,n);t.Da.delete(e),t.isPrimaryClient&&t.Ma.Vr(e).forEach(r=>{t.Ma.containsKey(r)||Ub(t,r)})}function Ub(t,e){t.Ca.delete(e.path.canonicalString());const n=t.va.get(e);n!==null&&(cp(t.remoteStore,n),t.va=t.va.remove(e),t.Fa.delete(n),gp(t))}function my(t,e,n){for(const r of n)r instanceof Ob?(t.Ma.addReference(r.key,e),q2(t,r)):r instanceof Db?(le("SyncEngine","Document no longer in limbo: "+r.key),t.Ma.removeReference(r.key,e),t.Ma.containsKey(r.key)||Ub(t,r.key)):Ee()}function q2(t,e){const n=e.key,r=n.path.canonicalString();t.va.get(n)||t.Ca.has(r)||(le("SyncEngine","New document in limbo: "+n),t.Ca.add(r),gp(t))}function gp(t){for(;t.Ca.size>0&&t.va.size<t.maxConcurrentLimboResolutions;){const e=t.Ca.values().next().value;t.Ca.delete(e);const n=new pe(_t.fromString(e)),r=t.Na.next();t.Fa.set(r,new N2(n)),t.va=t.va.insert(n,r),Sb(t.remoteStore,new Kr(Yn(np(n.path)),r,"TargetPurposeLimboResolution",Yf.oe))}}async function Ka(t,e,n){const r=Te(t),s=[],i=[],o=[];r.ba.isEmpty()||(r.ba.forEach((a,c)=>{o.push(r.Ba(c,e,n).then(u=>{if((u||n)&&r.isPrimaryClient){const h=u&&!u.fromCache;r.sharedClientState.updateQueryState(c.targetId,h?"current":"not-current")}if(u){s.push(u);const h=lp.Ki(c.targetId,u);i.push(h)}}))}),await Promise.all(o),r.Sa.h_(s),await async function(c,u){const h=Te(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",d=>W.forEach(u,p=>W.forEach(p.qi,g=>h.persistence.referenceDelegate.addReference(d,p.targetId,g)).next(()=>W.forEach(p.Qi,g=>h.persistence.referenceDelegate.removeReference(d,p.targetId,g)))))}catch(d){if(!Ha(d))throw d;le("LocalStore","Failed to update sequence numbers: "+d)}for(const d of u){const p=d.targetId;if(!d.fromCache){const g=h.ns.get(p),v=g.snapshotVersion,S=g.withLastLimboFreeSnapshotVersion(v);h.ns=h.ns.insert(p,S)}}}(r.localStore,i))}async function H2(t,e){const n=Te(t);if(!n.currentUser.isEqual(e)){le("SyncEngine","User change. New user:",e.toKey());const r=await Ib(n.localStore,e);n.currentUser=e,function(i,o){i.Oa.forEach(a=>{a.forEach(c=>{c.reject(new me(K.CANCELLED,o))})}),i.Oa.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ka(n,r.us)}}function W2(t,e){const n=Te(t),r=n.Fa.get(e);if(r&&r.wa)return Le().add(r.key);{let s=Le();const i=n.Da.get(e);if(!i)return s;for(const o of i){const a=n.ba.get(o);s=s.unionWith(a.view.Ea)}return s}}function $b(t){const e=Te(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Lb.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=W2.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=$2.bind(null,e),e.Sa.h_=S2.bind(null,e.eventManager),e.Sa.ka=R2.bind(null,e.eventManager),e}function z2(t){const e=Te(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=B2.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=j2.bind(null,e),e}class gy{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=wu(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,n){return null}createIndexBackfillerScheduler(e,n){return null}createLocalStore(e){return QV(this.persistence,new GV,e.initialUser,this.serializer)}createPersistence(e){return new HV(ap.Hr,this.serializer)}createSharedClientState(e){return new n2}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class G2{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>py(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=H2.bind(null,this.syncEngine),await b2(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new T2}()}createDatastore(e){const n=wu(e.databaseInfo.databaseId),r=function(i){return new o2(i)}(e.databaseInfo);return function(i,o,a,c){return new c2(i,o,a,c)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,s,i,o,a){return new h2(r,s,i,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>py(this.syncEngine,n,0),function(){return uy.D()?new uy:new r2}())}createSyncEngine(e,n){return function(s,i,o,a,c,u,h){const d=new O2(s,i,o,a,c,u);return h&&(d.La=!0),d}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e;await async function(r){const s=Te(r);le("RemoteStore","RemoteStore shutting down."),s.M_.add(5),await Ga(s),s.O_.shutdown(),s.N_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate()}}/**
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
 */class K2{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Ka(this.observer.next,e)}error(e){this.observer.error?this.Ka(this.observer.error,e):br("Uncaught Error in snapshot listener:",e.toString())}$a(){this.muted=!0}Ka(e,n){this.muted||setTimeout(()=>{this.muted||e(n)},0)}}/**
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
 */class Q2{constructor(e,n,r,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=s,this.user=zt.UNAUTHENTICATED,this.clientId=qE.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(r,async i=>{le("FirestoreClient","Received user=",i.uid),await this.authCredentialListener(i),this.user=i}),this.appCheckCredentials.start(r,i=>(le("FirestoreClient","Received new app check token=",i),this.appCheckCredentialListener(i,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new me(K.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ts;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=pp(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function bh(t,e){t.asyncQueue.verifyOperationInProgress(),le("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Ib(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function _y(t,e){t.asyncQueue.verifyOperationInProgress();const n=await J2(t);le("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>hy(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,s)=>hy(e.remoteStore,s)),t._onlineComponents=e}function Y2(t){return t.name==="FirebaseError"?t.code===K.FAILED_PRECONDITION||t.code===K.UNIMPLEMENTED:!(typeof DOMException<"u"&&t instanceof DOMException)||t.code===22||t.code===20||t.code===11}async function J2(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){le("FirestoreClient","Using user provided OfflineComponentProvider");try{await bh(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!Y2(n))throw n;Ui("Error using user provided cache. Falling back to memory cache: "+n),await bh(t,new gy)}}else le("FirestoreClient","Using default OfflineComponentProvider"),await bh(t,new gy);return t._offlineComponents}async function Bb(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(le("FirestoreClient","Using user provided OnlineComponentProvider"),await _y(t,t._uninitializedComponentsProvider._online)):(le("FirestoreClient","Using default OnlineComponentProvider"),await _y(t,new G2))),t._onlineComponents}function X2(t){return Bb(t).then(e=>e.syncEngine)}async function Z2(t){const e=await Bb(t),n=e.eventManager;return n.onListen=D2.bind(null,e.syncEngine),n.onUnlisten=V2.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=M2.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=F2.bind(null,e.syncEngine),n}function eF(t,e,n={}){const r=new ts;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,u){const h=new K2({next:p=>{o.enqueueAndForget(()=>A2(i,d));const g=p.docs.has(a);!g&&p.fromCache?u.reject(new me(K.UNAVAILABLE,"Failed to get document because the client is offline.")):g&&p.fromCache&&c&&c.source==="server"?u.reject(new me(K.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(p)},error:p=>u.reject(p)}),d=new P2(np(a.path),h,{includeMetadataChanges:!0,ra:!0});return C2(i,d)}(await Z2(t),t.asyncQueue,e,n,r)),r.promise}/**
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
 */function jb(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */const yy=new Map;/**
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
 */function tF(t,e,n){if(!n)throw new me(K.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function nF(t,e,n,r){if(e===!0&&r===!0)throw new me(K.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function vy(t){if(!pe.isDocumentKey(t))throw new me(K.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function _p(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Ee()}function Ra(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new me(K.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=_p(t);throw new me(K.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */class wy{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new me(K.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new me(K.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}nF("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=jb((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new me(K.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new me(K.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new me(K.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class yp{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new wy({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new me(K.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new me(K.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new wy(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new pL;switch(r.type){case"firstParty":return new yL(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new me(K.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=yy.get(n);r&&(le("ComponentProvider","Removing Datastore"),yy.delete(n),r.terminate())}(this),Promise.resolve()}}function rF(t,e,n,r={}){var s;const i=(t=Ra(t,yp))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Ui("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),r.mockUserToken){let a,c;if(typeof r.mockUserToken=="string")a=r.mockUserToken,c=zt.MOCK_USER;else{a=$w(r.mockUserToken,(s=t._app)===null||s===void 0?void 0:s.options.projectId);const u=r.mockUserToken.sub||r.mockUserToken.user_id;if(!u)throw new me(K.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new zt(u)}t._authCredentials=new mL(new jE(a,c))}}/**
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
 */class vp{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new vp(this.firestore,e,this._query)}}class Sn{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Pa(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Sn(this.firestore,e,this._key)}}class Pa extends vp{constructor(e,n,r){super(e,n,np(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Sn(this.firestore,null,new pe(e))}withConverter(e){return new Pa(this.firestore,e,this._path)}}function qb(t,e,...n){if(t=yt(t),arguments.length===1&&(e=qE.newId()),tF("doc","path",e),t instanceof yp){const r=_t.fromString(e,...n);return vy(r),new Sn(t,null,new pe(r))}{if(!(t instanceof Sn||t instanceof Pa))throw new me(K.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(_t.fromString(e,...n));return vy(r),new Sn(t.firestore,t instanceof Pa?t.converter:null,new pe(r))}}/**
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
 */class sF{constructor(){this.iu=Promise.resolve(),this.su=[],this.ou=!1,this._u=[],this.au=null,this.uu=!1,this.cu=!1,this.lu=[],this.Yo=new Cb(this,"async_queue_retry"),this.hu=()=>{const n=Eh();n&&le("AsyncQueue","Visibility state changed to "+n.visibilityState),this.Yo.Wo()};const e=Eh();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.hu)}get isShuttingDown(){return this.ou}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pu(),this.Iu(e)}enterRestrictedMode(e){if(!this.ou){this.ou=!0,this.cu=e||!1;const n=Eh();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.hu)}}enqueue(e){if(this.Pu(),this.ou)return new Promise(()=>{});const n=new ts;return this.Iu(()=>this.ou&&this.cu?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.su.push(e),this.Tu()))}async Tu(){if(this.su.length!==0){try{await this.su[0](),this.su.shift(),this.Yo.reset()}catch(e){if(!Ha(e))throw e;le("AsyncQueue","Operation failed with retryable error: "+e)}this.su.length>0&&this.Yo.$o(()=>this.Tu())}}Iu(e){const n=this.iu.then(()=>(this.uu=!0,e().catch(r=>{this.au=r,this.uu=!1;const s=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(r);throw br("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.uu=!1,r))));return this.iu=n,n}enqueueAfterDelay(e,n,r){this.Pu(),this.lu.indexOf(e)>-1&&(n=0);const s=fp.createAndSchedule(this,e,n,r,i=>this.Eu(i));return this._u.push(s),s}Pu(){this.au&&Ee()}verifyOperationInProgress(){}async du(){let e;do e=this.iu,await e;while(e!==this.iu)}Au(e){for(const n of this._u)if(n.timerId===e)return!0;return!1}Ru(e){return this.du().then(()=>{this._u.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this._u)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.du()})}Vu(e){this.lu.push(e)}Eu(e){const n=this._u.indexOf(e);this._u.splice(n,1)}}class wp extends yp{constructor(e,n,r,s){super(e,n,r,s),this.type="firestore",this._queue=function(){return new sF}(),this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||Wb(this),this._firestoreClient.terminate()}}function iF(t,e){const n=typeof t=="object"?t:La(),r=typeof t=="string"?t:"(default)",s=Ar(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=af("firestore");i&&rF(s,...i)}return s}function Hb(t){return t._firestoreClient||Wb(t),t._firestoreClient.verifyNotTerminated(),t._firestoreClient}function Wb(t){var e,n,r;const s=t._freezeSettings(),i=function(a,c,u,h){return new kL(a,c,u,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,jb(h.experimentalLongPollingOptions),h.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,s);t._firestoreClient=new Q2(t._authCredentials,t._appCheckCredentials,t._queue,i),!((n=s.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._firestoreClient._uninitializedComponentsProvider={_offlineKind:s.localCache.kind,_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider})}/**
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
 */class Wi{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Wi(Jt.fromBase64String(e))}catch(n){throw new me(K.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Wi(Jt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class Ep{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new me(K.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new $t(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class zb{constructor(e){this._methodName=e}}/**
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
 */class bp{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new me(K.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new me(K.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return We(this._lat,e._lat)||We(this._long,e._long)}}/**
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
 */const oF=/^__.*__$/;class aF{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new ni(e,this.data,this.fieldMask,n,this.fieldTransforms):new Wa(e,this.data,n,this.fieldTransforms)}}function Gb(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Ee()}}class Ip{constructor(e,n,r,s,i,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.mu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get fu(){return this.settings.fu}gu(e){return new Ip(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}pu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.gu({path:r,yu:!1});return s.wu(e),s}Su(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.gu({path:r,yu:!1});return s.mu(),s}bu(e){return this.gu({path:void 0,yu:!0})}Du(e){return Ac(e,this.settings.methodName,this.settings.Cu||!1,this.path,this.settings.vu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}mu(){if(this.path)for(let e=0;e<this.path.length;e++)this.wu(this.path.get(e))}wu(e){if(e.length===0)throw this.Du("Document fields must not be empty");if(Gb(this.fu)&&oF.test(e))throw this.Du('Document fields cannot begin and end with "__"')}}class lF{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||wu(e)}Fu(e,n,r,s=!1){return new Ip({fu:e,methodName:n,vu:r,path:$t.emptyPath(),yu:!1,Cu:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function cF(t){const e=t._freezeSettings(),n=wu(t._databaseId);return new lF(t._databaseId,!!e.ignoreUndefinedProperties,n)}function uF(t,e,n,r,s,i={}){const o=t.Fu(i.merge||i.mergeFields?2:0,e,n,s);Jb("Data must be an object, but it was:",o,r);const a=Qb(r,o);let c,u;if(i.merge)c=new Un(o.fieldMask),u=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const d of i.mergeFields){const p=hF(e,d,n);if(!o.contains(p))throw new me(K.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);fF(h,p)||h.push(p)}c=new Un(h),u=o.fieldTransforms.filter(d=>c.covers(d.field))}else c=null,u=o.fieldTransforms;return new aF(new Tn(a),c,u)}function Kb(t,e){if(Yb(t=yt(t)))return Jb("Unsupported field value:",e,t),Qb(t,e);if(t instanceof zb)return function(r,s){if(!Gb(s.fu))throw s.Du(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Du(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.yu&&e.fu!==4)throw e.Du("Nested arrays are not supported");return function(r,s){const i=[];let o=0;for(const a of r){let c=Kb(a,s.bu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(t,e)}return function(r,s){if((r=yt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return ZL(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Pt.fromDate(r);return{timestampValue:Tc(s.serializer,i)}}if(r instanceof Pt){const i=new Pt(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Tc(s.serializer,i)}}if(r instanceof bp)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Wi)return{bytesValue:gb(s.serializer,r._byteString)};if(r instanceof Sn){const i=s.databaseId,o=r.firestore._databaseId;if(!o.isEqual(i))throw s.Du(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:ip(r.firestore._databaseId||s.databaseId,r._key.path)}}throw s.Du(`Unsupported field value: ${_p(r)}`)}(t,e)}function Qb(t,e){const n={};return HE(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):eo(t,(r,s)=>{const i=Kb(s,e.pu(r));i!=null&&(n[r]=i)}),{mapValue:{fields:n}}}function Yb(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Pt||t instanceof bp||t instanceof Wi||t instanceof Sn||t instanceof zb)}function Jb(t,e,n){if(!Yb(n)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(n)){const r=_p(n);throw r==="an object"?e.Du(t+" a custom object"):e.Du(t+" "+r)}}function hF(t,e,n){if((e=yt(e))instanceof Ep)return e._internalPath;if(typeof e=="string")return Xb(t,e);throw Ac("Field path arguments must be of type string or ",t,!1,void 0,n)}const dF=new RegExp("[~\\*/\\[\\]]");function Xb(t,e,n){if(e.search(dF)>=0)throw Ac(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Ep(...e.split("."))._internalPath}catch{throw Ac(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Ac(t,e,n,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new me(K.INVALID_ARGUMENT,a+t+c)}function fF(t,e){return t.some(n=>n.isEqual(e))}/**
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
 */class Zb{constructor(e,n,r,s,i){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Sn(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new pF(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(eI("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class pF extends Zb{data(){return super.data()}}function eI(t,e){return typeof e=="string"?Xb(t,e):e instanceof Ep?e._internalPath:e._delegate._internalPath}class mF{convertValue(e,n="none"){switch(Gs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return bt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(zs(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 10:return this.convertObject(e.mapValue,n);default:throw Ee()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return eo(e,(s,i)=>{r[s]=this.convertValue(i,n)}),r}convertGeoPoint(e){return new bp(bt(e.latitude),bt(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Xf(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(Ia(e));default:return null}}convertTimestamp(e){const n=ls(e);return new Pt(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=_t.fromString(e);nt(bb(r));const s=new Ta(r.get(1),r.get(3)),i=new pe(r.popFirst(5));return s.isEqual(n)||br(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
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
 */function gF(t,e,n){let r;return r=t?t.toFirestore(e):e,r}/**
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
 */class _F{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class tI extends Zb{constructor(e,n,r,s,i,o){super(e,n,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new yF(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(eI("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class yF extends tI{data(e={}){return super.data(e)}}/**
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
 */function nI(t){t=Ra(t,Sn);const e=Ra(t.firestore,wp);return eF(Hb(e),t._key).then(n=>EF(e,t,n))}class vF extends mF{constructor(e){super(),this.firestore=e}convertBytes(e){return new Wi(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Sn(this.firestore,null,n)}}function rI(t,e,n){t=Ra(t,Sn);const r=Ra(t.firestore,wp),s=gF(t.converter,e);return wF(r,[uF(cF(r),"setDoc",t._key,s,t.converter!==null,n).toMutation(t._key,yr.none())])}function wF(t,e){return function(r,s){const i=new ts;return r.asyncQueue.enqueueAndForget(async()=>U2(await X2(r),s,i)),i.promise}(Hb(t),e)}function EF(t,e,n){const r=n.docs.get(e._key),s=new vF(t);return new tI(t,s,e._key,r,new _F(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(s){Zi=s})(Zs),Pn(new wn("firestore",(r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),a=new wp(new gL(r.getProvider("auth-internal")),new wL(r.getProvider("app-check-internal")),function(u,h){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new me(K.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ta(u.options.projectId,h)}(o,s),o);return i=Object.assign({useFetchStreams:n},i),a._setSettings(i),a},"PUBLIC").setMultipleInstances(!0)),Yt(j_,"4.6.3",e),Yt(j_,"4.6.3","esm2017")})();function Tp(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]]);return n}function sI(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const bF=sI,iI=new Xs("auth","Firebase",sI());/**
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
 */const Sc=new Ma("@firebase/auth");function IF(t,...e){Sc.logLevel<=Me.WARN&&Sc.warn(`Auth (${Zs}): ${t}`,...e)}function Hl(t,...e){Sc.logLevel<=Me.ERROR&&Sc.error(`Auth (${Zs}): ${t}`,...e)}/**
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
 */function xn(t,...e){throw Ap(t,...e)}function jn(t,...e){return Ap(t,...e)}function Cp(t,e,n){const r=Object.assign(Object.assign({},bF()),{[e]:n});return new Xs("auth","Firebase",r).create(e,{appName:t.name})}function ns(t){return Cp(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function TF(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&xn(t,"argument-error"),Cp(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ap(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return iI.create(t,...e)}function ye(t,e,...n){if(!t)throw Ap(e,...n)}function fr(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Hl(e),new Error(e)}function Tr(t,e){t||fr(e)}/**
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
 */function Cd(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function CF(){return Ey()==="http:"||Ey()==="https:"}function Ey(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
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
 */function AF(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(CF()||Bw()||"connection"in navigator)?navigator.onLine:!0}function SF(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class Qa{constructor(e,n){this.shortDelay=e,this.longDelay=n,Tr(n>e,"Short delay should be less than long delay!"),this.isMobile=lf()||jw()}get(){return AF()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Sp(t,e){Tr(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class oI{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;fr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;fr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;fr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const RF={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const PF=new Qa(3e4,6e4);function si(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function fs(t,e,n,r,s={}){return aI(t,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const a=Ji(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();return c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode),oI.fetch()(lI(t,t.config.apiHost,n,a),Object.assign({method:e,headers:c,referrerPolicy:"no-referrer"},i))})}async function aI(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},RF),e);try{const s=new kF(t),i=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw kl(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[c,u]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw kl(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw kl(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw kl(t,"user-disabled",o);const h=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Cp(t,h,u);xn(t,h)}}catch(s){if(s instanceof Nn)throw s;xn(t,"network-request-failed",{message:String(s)})}}async function Iu(t,e,n,r,s={}){const i=await fs(t,e,n,r,s);return"mfaPendingCredential"in i&&xn(t,"multi-factor-auth-required",{_serverResponse:i}),i}function lI(t,e,n,r){const s=`${e}${n}?${r}`;return t.config.emulator?Sp(t.config,s):`${t.config.apiScheme}://${s}`}function xF(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class kF{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(jn(this.auth,"network-request-failed")),PF.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function kl(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=jn(t,e,r);return s.customData._tokenResponse=n,s}function by(t){return t!==void 0&&t.enterprise!==void 0}class NF{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return xF(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function OF(t,e){return fs(t,"GET","/v2/recaptchaConfig",si(t,e))}/**
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
 */async function DF(t,e){return fs(t,"POST","/v1/accounts:delete",e)}async function cI(t,e){return fs(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function na(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function MF(t,e=!1){const n=yt(t),r=await n.getIdToken(e),s=Rp(r);ye(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:na(Ih(s.auth_time)),issuedAtTime:na(Ih(s.iat)),expirationTime:na(Ih(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ih(t){return Number(t)*1e3}function Rp(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Hl("JWT malformed, contained fewer than 3 sections"),null;try{const s=nc(n);return s?JSON.parse(s):(Hl("Failed to decode base64 JWT payload"),null)}catch(s){return Hl("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Iy(t){const e=Rp(t);return ye(e,"internal-error"),ye(typeof e.exp<"u","internal-error"),ye(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function xa(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Nn&&LF(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function LF({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class VF{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ad{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=na(this.lastLoginAt),this.creationTime=na(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Rc(t){var e;const n=t.auth,r=await t.getIdToken(),s=await xa(t,cI(n,{idToken:r}));ye(s==null?void 0:s.users.length,n,"internal-error");const i=s.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?uI(i.providerUserInfo):[],a=UF(t.providerData,o),c=t.isAnonymous,u=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),h=c?u:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Ad(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(t,d)}async function FF(t){const e=yt(t);await Rc(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function UF(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function uI(t){return t.map(e=>{var{providerId:n}=e,r=Tp(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function $F(t,e){const n=await aI(t,{},async()=>{const r=Ji({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=lI(t,s,"/v1/token",`key=${i}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",oI.fetch()(o,{method:"POST",headers:a,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function BF(t,e){return fs(t,"POST","/v2/accounts:revokeToken",si(t,e))}/**
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
 */class Pi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ye(e.idToken,"internal-error"),ye(typeof e.idToken<"u","internal-error"),ye(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Iy(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){ye(e.length!==0,"internal-error");const n=Iy(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(ye(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:i}=await $F(e,n);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:i}=n,o=new Pi;return r&&(ye(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(ye(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(ye(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Pi,this.toJSON())}_performRefresh(){return fr("not implemented")}}/**
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
 */function Fr(t,e){ye(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class pr{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,i=Tp(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new VF(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ad(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await xa(this,this.stsTokenManager.getToken(this.auth,e));return ye(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return MF(this,e)}reload(){return FF(this)}_assign(e){this!==e&&(ye(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new pr(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){ye(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Rc(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Kn(this.auth.app))return Promise.reject(ns(this.auth));const e=await this.getIdToken();return await xa(this,DF(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,s,i,o,a,c,u,h;const d=(r=n.displayName)!==null&&r!==void 0?r:void 0,p=(s=n.email)!==null&&s!==void 0?s:void 0,g=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,v=(o=n.photoURL)!==null&&o!==void 0?o:void 0,S=(a=n.tenantId)!==null&&a!==void 0?a:void 0,P=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,M=(u=n.createdAt)!==null&&u!==void 0?u:void 0,F=(h=n.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:U,emailVerified:N,isAnonymous:G,providerData:B,stsTokenManager:A}=n;ye(U&&A,e,"internal-error");const y=Pi.fromJSON(this.name,A);ye(typeof U=="string",e,"internal-error"),Fr(d,e.name),Fr(p,e.name),ye(typeof N=="boolean",e,"internal-error"),ye(typeof G=="boolean",e,"internal-error"),Fr(g,e.name),Fr(v,e.name),Fr(S,e.name),Fr(P,e.name),Fr(M,e.name),Fr(F,e.name);const w=new pr({uid:U,auth:e,email:p,emailVerified:N,displayName:d,isAnonymous:G,photoURL:v,phoneNumber:g,tenantId:S,stsTokenManager:y,createdAt:M,lastLoginAt:F});return B&&Array.isArray(B)&&(w.providerData=B.map(T=>Object.assign({},T))),P&&(w._redirectEventId=P),w}static async _fromIdTokenResponse(e,n,r=!1){const s=new Pi;s.updateFromServerResponse(n);const i=new pr({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Rc(i),i}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];ye(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?uI(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),a=new Pi;a.updateFromIdToken(r);const c=new pr({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),u={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ad(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,u),c}}/**
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
 */const Ty=new Map;function mr(t){Tr(t instanceof Function,"Expected a class definition");let e=Ty.get(t);return e?(Tr(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Ty.set(t,e),e)}/**
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
 */class hI{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}hI.type="NONE";const Cy=hI;/**
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
 */function Wl(t,e,n){return`firebase:${t}:${e}:${n}`}class xi{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Wl(this.userKey,s.apiKey,i),this.fullPersistenceKey=Wl("persistence",s.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?pr._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new xi(mr(Cy),e,r);const s=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let i=s[0]||mr(Cy);const o=Wl(r,e.config.apiKey,e.name);let a=null;for(const u of n)try{const h=await u._get(o);if(h){const d=pr._fromJSON(e,h);u!==i&&(a=d),i=u;break}}catch{}const c=s.filter(u=>u._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new xi(i,e,r):(i=c[0],a&&await i._set(o,a.toJSON()),await Promise.all(n.map(async u=>{if(u!==i)try{await u._remove(o)}catch{}})),new xi(i,e,r))}}/**
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
 */function Ay(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(pI(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(dI(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(gI(e))return"Blackberry";if(_I(e))return"Webos";if(Pp(e))return"Safari";if((e.includes("chrome/")||fI(e))&&!e.includes("edge/"))return"Chrome";if(mI(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function dI(t=jt()){return/firefox\//i.test(t)}function Pp(t=jt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fI(t=jt()){return/crios\//i.test(t)}function pI(t=jt()){return/iemobile/i.test(t)}function mI(t=jt()){return/android/i.test(t)}function gI(t=jt()){return/blackberry/i.test(t)}function _I(t=jt()){return/webos/i.test(t)}function Tu(t=jt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function jF(t=jt()){var e;return Tu(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function qF(){return hx()&&document.documentMode===10}function yI(t=jt()){return Tu(t)||mI(t)||_I(t)||gI(t)||/windows phone/i.test(t)||pI(t)}function HF(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
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
 */function vI(t,e=[]){let n;switch(t){case"Browser":n=Ay(jt());break;case"Worker":n=`${Ay(jt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Zs}/${r}`}/**
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
 */class WF{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=i=>new Promise((o,a)=>{try{const c=e(i);o(c)}catch(c){a(c)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function zF(t,e={}){return fs(t,"GET","/v2/passwordPolicy",si(t,e))}/**
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
 */const GF=6;class KF{constructor(e){var n,r,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:GF,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,s,i,o,a;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(a=c.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),c}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
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
 */class QF{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Sy(this),this.idTokenSubscription=new Sy(this),this.beforeStateQueue=new WF(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=iI,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=mr(n)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await xi.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await cI(this,{idToken:e}),r=await pr._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Kn(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===a)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return ye(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Rc(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=SF()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Kn(this.app))return Promise.reject(ns(this));const n=e?yt(e):null;return n&&ye(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&ye(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Kn(this.app)?Promise.reject(ns(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Kn(this.app)?Promise.reject(ns(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(mr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await zF(this),n=new KF(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Xs("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await BF(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&mr(e)||this._popupRedirectResolver;ye(n,this,"argument-error"),this.redirectPersistenceManager=await xi.create(this,[mr(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(ye(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,r,s);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ye(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=vI(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(n["X-Firebase-AppCheck"]=s),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&IF(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function ii(t){return yt(t)}class Sy{constructor(e){this.auth=e,this.observer=null,this.addObserver=wx(n=>this.observer=n)}get next(){return ye(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Cu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function YF(t){Cu=t}function wI(t){return Cu.loadJS(t)}function JF(){return Cu.recaptchaEnterpriseScript}function XF(){return Cu.gapiScript}function ZF(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const e4="recaptcha-enterprise",t4="NO_RECAPTCHA";class n4{constructor(e){this.type=e4,this.auth=ii(e)}async verify(e="verify",n=!1){async function r(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{OF(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const u=new NF(c);return i.tenantId==null?i._agentRecaptchaConfig=u:i._tenantRecaptchaConfigs[i.tenantId]=u,o(u.siteKey)}}).catch(c=>{a(c)})})}function s(i,o,a){const c=window.grecaptcha;by(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(u=>{o(u)}).catch(()=>{o(t4)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{r(this.auth).then(a=>{if(!n&&by(window.grecaptcha))s(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=JF();c.length!==0&&(c+=a),wI(c).then(()=>{s(a,i,o)}).catch(u=>{o(u)})}}).catch(a=>{o(a)})})}}async function Ry(t,e,n,r=!1){const s=new n4(t);let i;try{i=await s.verify(n)}catch{i=await s.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Py(t,e,n,r){var s;if(!((s=t._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Ry(t,e,n,n==="getOobCode");return r(t,i)}else return r(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ry(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(i)})}/**
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
 */function r4(t,e){const n=Ar(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),i=n.getOptions();if(fa(i,e??{}))return s;xn(s,"already-initialized")}return n.initialize({options:e})}function s4(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(mr);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function i4(t,e,n){const r=ii(t);ye(r._canInitEmulator,r,"emulator-config-failed"),ye(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=EI(e),{host:o,port:a}=o4(e),c=a===null?"":`:${a}`;r.config.emulator={url:`${i}//${o}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),a4()}function EI(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function o4(t){const e=EI(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:xy(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:xy(o)}}}function xy(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function a4(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class xp{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return fr("not implemented")}_getIdTokenResponse(e){return fr("not implemented")}_linkToIdToken(e,n){return fr("not implemented")}_getReauthenticationResolver(e){return fr("not implemented")}}async function l4(t,e){return fs(t,"POST","/v1/accounts:signUp",e)}/**
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
 */async function c4(t,e){return Iu(t,"POST","/v1/accounts:signInWithPassword",si(t,e))}/**
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
 */async function u4(t,e){return Iu(t,"POST","/v1/accounts:signInWithEmailLink",si(t,e))}async function h4(t,e){return Iu(t,"POST","/v1/accounts:signInWithEmailLink",si(t,e))}/**
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
 */class ka extends xp{constructor(e,n,r,s=null){super("password",r),this._email=e,this._password=n,this._tenantId=s}static _fromEmailAndPassword(e,n){return new ka(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new ka(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Py(e,n,"signInWithPassword",c4);case"emailLink":return u4(e,{email:this._email,oobCode:this._password});default:xn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Py(e,r,"signUpPassword",l4);case"emailLink":return h4(e,{idToken:n,email:this._email,oobCode:this._password});default:xn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function ki(t,e){return Iu(t,"POST","/v1/accounts:signInWithIdp",si(t,e))}/**
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
 */const d4="http://localhost";class Ks extends xp{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ks(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):xn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,i=Tp(n,["providerId","signInMethod"]);if(!r||!s)return null;const o=new Ks(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return ki(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,ki(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ki(e,n)}buildRequest(){const e={requestUri:d4,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ji(n)}return e}}/**
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
 */function f4(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function p4(t){const e=xo(ko(t)).link,n=e?xo(ko(e)).deep_link_id:null,r=xo(ko(t)).deep_link_id;return(r?xo(ko(r)).link:null)||r||n||e||t}class kp{constructor(e){var n,r,s,i,o,a;const c=xo(ko(e)),u=(n=c.apiKey)!==null&&n!==void 0?n:null,h=(r=c.oobCode)!==null&&r!==void 0?r:null,d=f4((s=c.mode)!==null&&s!==void 0?s:null);ye(u&&h&&d,"argument-error"),this.apiKey=u,this.operation=d,this.code=h,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=c.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const n=p4(e);try{return new kp(n)}catch{return null}}}/**
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
 */class ro{constructor(){this.providerId=ro.PROVIDER_ID}static credential(e,n){return ka._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=kp.parseLink(n);return ye(r,"argument-error"),ka._fromEmailAndCode(e,r.code,r.tenantId)}}ro.PROVIDER_ID="password";ro.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ro.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Np{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ya extends Np{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Wr extends Ya{constructor(){super("facebook.com")}static credential(e){return Ks._fromParams({providerId:Wr.PROVIDER_ID,signInMethod:Wr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Wr.credentialFromTaggedObject(e)}static credentialFromError(e){return Wr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Wr.credential(e.oauthAccessToken)}catch{return null}}}Wr.FACEBOOK_SIGN_IN_METHOD="facebook.com";Wr.PROVIDER_ID="facebook.com";/**
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
 */class hr extends Ya{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ks._fromParams({providerId:hr.PROVIDER_ID,signInMethod:hr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return hr.credentialFromTaggedObject(e)}static credentialFromError(e){return hr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return hr.credential(n,r)}catch{return null}}}hr.GOOGLE_SIGN_IN_METHOD="google.com";hr.PROVIDER_ID="google.com";/**
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
 */class zr extends Ya{constructor(){super("github.com")}static credential(e){return Ks._fromParams({providerId:zr.PROVIDER_ID,signInMethod:zr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return zr.credentialFromTaggedObject(e)}static credentialFromError(e){return zr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return zr.credential(e.oauthAccessToken)}catch{return null}}}zr.GITHUB_SIGN_IN_METHOD="github.com";zr.PROVIDER_ID="github.com";/**
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
 */class Gr extends Ya{constructor(){super("twitter.com")}static credential(e,n){return Ks._fromParams({providerId:Gr.PROVIDER_ID,signInMethod:Gr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Gr.credentialFromTaggedObject(e)}static credentialFromError(e){return Gr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Gr.credential(n,r)}catch{return null}}}Gr.TWITTER_SIGN_IN_METHOD="twitter.com";Gr.PROVIDER_ID="twitter.com";/**
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
 */class zi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const i=await pr._fromIdTokenResponse(e,r,s),o=ky(r);return new zi({user:i,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=ky(r);return new zi({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function ky(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class Pc extends Nn{constructor(e,n,r,s){var i;super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Pc.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new Pc(e,n,r,s)}}function bI(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Pc._fromErrorAndOperation(t,i,e,r):i})}async function m4(t,e,n=!1){const r=await xa(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return zi._forOperation(t,"link",r)}/**
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
 */async function g4(t,e,n=!1){const{auth:r}=t;if(Kn(r.app))return Promise.reject(ns(r));const s="reauthenticate";try{const i=await xa(t,bI(r,s,e,t),n);ye(i.idToken,r,"internal-error");const o=Rp(i.idToken);ye(o,r,"internal-error");const{sub:a}=o;return ye(t.uid===a,r,"user-mismatch"),zi._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&xn(r,"user-mismatch"),i}}/**
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
 */async function II(t,e,n=!1){if(Kn(t.app))return Promise.reject(ns(t));const r="signIn",s=await bI(t,r,e),i=await zi._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(i.user),i}async function _4(t,e){return II(ii(t),e)}/**
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
 */async function y4(t){const e=ii(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function v4(t,e,n){return Kn(t.app)?Promise.reject(ns(t)):_4(yt(t),ro.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&y4(t),r})}function w4(t,e,n,r){return yt(t).onIdTokenChanged(e,n,r)}function E4(t,e,n){return yt(t).beforeAuthStateChanged(e,n)}function b4(t,e,n,r){return yt(t).onAuthStateChanged(e,n,r)}const xc="__sak";/**
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
 */class TI{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(xc,"1"),this.storage.removeItem(xc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */function I4(){const t=jt();return Pp(t)||Tu(t)}const T4=1e3,C4=10;class CI extends TI{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=I4()&&HF(),this.fallbackToPolling=yI(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}const r=e.key;if(n?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(r);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(r,e.newValue):this.storage.removeItem(r);else if(this.localCache[r]===e.newValue&&!n)return}const s=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);qF()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,C4):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},T4)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}CI.type="LOCAL";const A4=CI;/**
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
 */class AI extends TI{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}AI.type="SESSION";const SI=AI;/**
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
 */function S4(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Au{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new Au(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:i}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const a=Array.from(o).map(async u=>u(n.origin,i)),c=await S4(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Au.receivers=[];/**
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
 */function Op(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class R4{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((a,c)=>{const u=Op("",20);s.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(d){const p=d;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(p.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function Xn(){return window}function P4(t){Xn().location.href=t}/**
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
 */function RI(){return typeof Xn().WorkerGlobalScope<"u"&&typeof Xn().importScripts=="function"}async function x4(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function k4(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function N4(){return RI()?self:null}/**
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
 */const PI="firebaseLocalStorageDb",O4=1,kc="firebaseLocalStorage",xI="fbase_key";class Ja{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Su(t,e){return t.transaction([kc],e?"readwrite":"readonly").objectStore(kc)}function D4(){const t=indexedDB.deleteDatabase(PI);return new Ja(t).toPromise()}function Sd(){const t=indexedDB.open(PI,O4);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(kc,{keyPath:xI})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(kc)?e(r):(r.close(),await D4(),e(await Sd()))})})}async function Ny(t,e,n){const r=Su(t,!0).put({[xI]:e,value:n});return new Ja(r).toPromise()}async function M4(t,e){const n=Su(t,!1).get(e),r=await new Ja(n).toPromise();return r===void 0?null:r.value}function Oy(t,e){const n=Su(t,!0).delete(e);return new Ja(n).toPromise()}const L4=800,V4=3;class kI{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Sd(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>V4)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return RI()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Au._getInstance(N4()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await x4(),!this.activeServiceWorker)return;this.sender=new R4(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||k4()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Sd();return await Ny(e,xc,"1"),await Oy(e,xc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ny(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>M4(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Oy(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Su(s,!1).getAll();return new Ja(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),L4)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}kI.type="LOCAL";const F4=kI;new Qa(3e4,6e4);/**
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
 */function NI(t,e){return e?mr(e):(ye(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Dp extends xp{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ki(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ki(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ki(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function U4(t){return II(t.auth,new Dp(t),t.bypassAuthState)}function $4(t){const{auth:e,user:n}=t;return ye(n,e,"internal-error"),g4(n,new Dp(t),t.bypassAuthState)}async function B4(t){const{auth:e,user:n}=t;return ye(n,e,"internal-error"),m4(n,new Dp(t),t.bypassAuthState)}/**
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
 */class OI{constructor(e,n,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return U4;case"linkViaPopup":case"linkViaRedirect":return B4;case"reauthViaPopup":case"reauthViaRedirect":return $4;default:xn(this.auth,"internal-error")}}resolve(e){Tr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Tr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const j4=new Qa(2e3,1e4);async function q4(t,e,n){if(Kn(t.app))return Promise.reject(jn(t,"operation-not-supported-in-this-environment"));const r=ii(t);TF(t,e,Np);const s=NI(r,n);return new Ns(r,"signInViaPopup",e,s).executeNotNull()}class Ns extends OI{constructor(e,n,r,s,i){super(e,n,s,i),this.provider=r,this.authWindow=null,this.pollId=null,Ns.currentPopupAction&&Ns.currentPopupAction.cancel(),Ns.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ye(e,this.auth,"internal-error"),e}async onExecution(){Tr(this.filter.length===1,"Popup operations only handle one event");const e=Op();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(jn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(jn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ns.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(jn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,j4.get())};e()}}Ns.currentPopupAction=null;/**
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
 */const H4="pendingRedirect",zl=new Map;class W4 extends OI{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=zl.get(this.auth._key());if(!e){try{const r=await z4(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}zl.set(this.auth._key(),e)}return this.bypassAuthState||zl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function z4(t,e){const n=Q4(e),r=K4(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function G4(t,e){zl.set(t._key(),e)}function K4(t){return mr(t._redirectPersistence)}function Q4(t){return Wl(H4,t.config.apiKey,t.name)}async function Y4(t,e,n=!1){if(Kn(t.app))return Promise.reject(ns(t));const r=ii(t),s=NI(r,e),o=await new W4(r,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
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
 */const J4=10*60*1e3;class X4{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Z4(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!DI(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(jn(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=J4&&this.cachedEventUids.clear(),this.cachedEventUids.has(Dy(e))}saveEventToCache(e){this.cachedEventUids.add(Dy(e)),this.lastProcessedEventTime=Date.now()}}function Dy(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function DI({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Z4(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return DI(t);default:return!1}}/**
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
 */async function eU(t,e={}){return fs(t,"GET","/v1/projects",e)}/**
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
 */const tU=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nU=/^https?/;async function rU(t){if(t.config.emulator)return;const{authorizedDomains:e}=await eU(t);for(const n of e)try{if(sU(n))return}catch{}xn(t,"unauthorized-domain")}function sU(t){const e=Cd(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!nU.test(n))return!1;if(tU.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const iU=new Qa(3e4,6e4);function My(){const t=Xn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function oU(t){return new Promise((e,n)=>{var r,s,i;function o(){My(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{My(),n(jn(t,"network-request-failed"))},timeout:iU.get()})}if(!((s=(r=Xn().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Xn().gapi)===null||i===void 0)&&i.load)o();else{const a=ZF("iframefcb");return Xn()[a]=()=>{gapi.load?o():n(jn(t,"network-request-failed"))},wI(`${XF()}?onload=${a}`).catch(c=>n(c))}}).catch(e=>{throw Gl=null,e})}let Gl=null;function aU(t){return Gl=Gl||oU(t),Gl}/**
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
 */const lU=new Qa(5e3,15e3),cU="__/auth/iframe",uU="emulator/auth/iframe",hU={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dU=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fU(t){const e=t.config;ye(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Sp(e,uU):`https://${t.config.authDomain}/${cU}`,r={apiKey:e.apiKey,appName:t.name,v:Zs},s=dU.get(t.config.apiHost);s&&(r.eid=s);const i=t._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${Ji(r).slice(1)}`}async function pU(t){const e=await aU(t),n=Xn().gapi;return ye(n,t,"internal-error"),e.open({where:document.body,url:fU(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hU,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=jn(t,"network-request-failed"),a=Xn().setTimeout(()=>{i(o)},lU.get());function c(){Xn().clearTimeout(a),s(r)}r.ping(c).then(c,()=>{i(o)})}))}/**
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
 */const mU={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gU=500,_U=600,yU="_blank",vU="http://localhost";class Ly{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wU(t,e,n,r=gU,s=_U){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},mU),{width:r.toString(),height:s.toString(),top:i,left:o}),u=jt().toLowerCase();n&&(a=fI(u)?yU:n),dI(u)&&(e=e||vU,c.scrollbars="yes");const h=Object.entries(c).reduce((p,[g,v])=>`${p}${g}=${v},`,"");if(jF(u)&&a!=="_self")return EU(e||"",a),new Ly(null);const d=window.open(e||"",a,h);ye(d,t,"popup-blocked");try{d.focus()}catch{}return new Ly(d)}function EU(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const bU="__/auth/handler",IU="emulator/auth/handler",TU=encodeURIComponent("fac");async function Vy(t,e,n,r,s,i){ye(t.config.authDomain,t,"auth-domain-config-required"),ye(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Zs,eventId:s};if(e instanceof Np){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",zh(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))o[h]=d}if(e instanceof Ya){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const c=await t._getAppCheckToken(),u=c?`#${TU}=${encodeURIComponent(c)}`:"";return`${CU(t)}?${Ji(a).slice(1)}${u}`}function CU({config:t}){return t.emulator?Sp(t,IU):`https://${t.authDomain}/${bU}`}/**
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
 */const Th="webStorageSupport";class AU{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=SI,this._completeRedirectFn=Y4,this._overrideRedirectResult=G4}async _openPopup(e,n,r,s){var i;Tr((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Vy(e,n,r,Cd(),s);return wU(e,o,Op())}async _openRedirect(e,n,r,s){await this._originValidation(e);const i=await Vy(e,n,r,Cd(),s);return P4(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:i}=this.eventManagers[n];return s?Promise.resolve(s):(Tr(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await pU(e),r=new X4(e);return n.register("authEvent",s=>(ye(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Th,{type:Th},s=>{var i;const o=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Th];o!==void 0&&n(!!o),xn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=rU(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return yI()||Pp()||Tu()}}const SU=AU;var Fy="@firebase/auth",Uy="1.7.4";/**
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
 */class RU{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){ye(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function PU(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function xU(t){Pn(new wn("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;ye(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:vI(t)},u=new QF(r,s,i,c);return s4(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Pn(new wn("auth-internal",e=>{const n=ii(e.getProvider("auth").getImmediate());return(r=>new RU(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Yt(Fy,Uy,PU(t)),Yt(Fy,Uy,"esm2017")}/**
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
 */const kU=5*60,NU=Uw("authIdTokenMaxAge")||kU;let $y=null;const OU=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>NU)return;const s=n==null?void 0:n.token;$y!==s&&($y=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function DU(t=La()){const e=Ar(t,"auth");if(e.isInitialized())return e.getImmediate();const n=r4(t,{popupRedirectResolver:SU,persistence:[F4,A4,SI]}),r=Uw("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=OU(i.toString());E4(n,o,()=>o(n.currentUser)),w4(n,a=>o(a))}}const s=Vw("auth");return s&&i4(n,`http://${s}`),n}function MU(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}YF({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const i=jn("internal-error");i.customData=s,n(i)},r.type="text/javascript",r.charset="UTF-8",MU().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});xU("Browser");/**
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
 */const LU="type.googleapis.com/google.protobuf.Int64Value",VU="type.googleapis.com/google.protobuf.UInt64Value";function MI(t,e){const n={};for(const r in t)t.hasOwnProperty(r)&&(n[r]=e(t[r]));return n}function Rd(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>Rd(e));if(typeof t=="function"||typeof t=="object")return MI(t,e=>Rd(e));throw new Error("Data cannot be encoded in JSON: "+t)}function Nc(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case LU:case VU:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>Nc(e)):typeof t=="function"||typeof t=="object"?MI(t,e=>Nc(e)):t}/**
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
 */const Mp="functions";/**
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
 */const By={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Ni extends Nn{constructor(e,n,r){super(`${Mp}/${e}`,n||""),this.details=r}}function FU(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function UU(t,e){let n=FU(t),r=n,s;try{const i=e&&e.error;if(i){const o=i.status;if(typeof o=="string"){if(!By[o])return new Ni("internal","internal");n=By[o],r=o}const a=i.message;typeof a=="string"&&(r=a),s=i.details,s!==void 0&&(s=Nc(s))}}catch{}return n==="ok"?null:new Ni(n,r,s)}/**
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
 */class $U{constructor(e,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||r.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const n=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(e){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
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
 */const Pd="us-central1";function BU(t){let e=null;return{promise:new Promise((n,r)=>{e=setTimeout(()=>{r(new Ni("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class jU{constructor(e,n,r,s,i=Pd,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new $U(n,r,s),this.cancelAllRequests=new Promise(a=>{this.deleteService=()=>Promise.resolve(a())});try{const a=new URL(i);this.customDomain=a.origin,this.region=Pd}catch{this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function qU(t,e,n){t.emulatorOrigin=`http://${e}:${n}`}function HU(t,e,n){return r=>zU(t,e,r,{})}async function WU(t,e,n,r){n["Content-Type"]="application/json";let s;try{s=await r(t,{method:"POST",body:JSON.stringify(e),headers:n})}catch{return{status:0,json:null}}let i=null;try{i=await s.json()}catch{}return{status:s.status,json:i}}function zU(t,e,n,r){const s=t._url(e);return GU(t,s,n,r)}async function GU(t,e,n,r){n=Rd(n);const s={data:n},i={},o=await t.contextProvider.getContext(r.limitedUseAppCheckTokens);o.authToken&&(i.Authorization="Bearer "+o.authToken),o.messagingToken&&(i["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(i["X-Firebase-AppCheck"]=o.appCheckToken);const a=r.timeout||7e4,c=BU(a),u=await Promise.race([WU(e,s,i,t.fetchImpl),c.promise,t.cancelAllRequests]);if(c.cancel(),!u)throw new Ni("cancelled","Firebase Functions instance was deleted.");const h=UU(u.status,u.json);if(h)throw h;if(!u.json)throw new Ni("internal","Response is not valid JSON object.");let d=u.json.data;if(typeof d>"u"&&(d=u.json.result),typeof d>"u")throw new Ni("internal","Response is missing data field.");return{data:Nc(d)}}const jy="@firebase/functions",qy="0.11.5";/**
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
 */const KU="auth-internal",QU="app-check-internal",YU="messaging-internal";function JU(t,e){const n=(r,{instanceIdentifier:s})=>{const i=r.getProvider("app").getImmediate(),o=r.getProvider(KU),a=r.getProvider(YU),c=r.getProvider(QU);return new jU(i,o,a,c,s,t)};Pn(new wn(Mp,n,"PUBLIC").setMultipleInstances(!0)),Yt(jy,qy,e),Yt(jy,qy,"esm2017")}/**
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
 */function LI(t=La(),e=Pd){const r=Ar(yt(t),Mp).getImmediate({identifier:e}),s=af("functions");return s&&XU(r,...s),r}function XU(t,e,n){qU(yt(t),e,n)}function ZU(t,e,n){return HU(yt(t),e)}JU(fetch.bind(self));const e9={apiKey:"AIzaSyBOI-UrNeKCWryN01GflbncbJDVZl2hrEE",authDomain:"maso-au.firebaseapp.com",databaseURL:"https://maso-au-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"maso-au",storageBucket:"maso-au.appspot.com",messagingSenderId:"888141867225",appId:"1:888141867225:web:8b9e99ec26456f034af6c8",measurementId:"G-18X1GQKWHY"},Xa=Xw(e9);Ck("warning");uL(Xa);const VI=iF(Xa),Lp=DU(Xa),t9=jD(Xa);LI(Xa);const n9={components:{Cog8ToothIcon:VR,QuestionMarkCircleIcon:FR},setup(){const t=ae(0),e=OD(t9,"websiteViews");return dE(e,n=>{const r=n.val();t.value=r||0}),un(()=>{zD(e,r=>(r||0)+1).catch(r=>{console.error("Error updating view count:",r)})}),{viewCount:t}}},r9={class:"bg-gray-800 text-white bottom-0 left-0 z-[9999] flex justify-between items-center w-full p-4 drop-shadow-2xl h-[--footer-height]"},s9=L("p",null,"© 2024 Mason Bartholomai. All rights reserved.",-1),i9={class:"mr-2 flex items-center"},o9={class:"mr-4"};function a9(t,e,n,r,s,i){return H(),he("footer",r9,[s9,L("div",i9,[L("p",o9,"Website Views: "+Lt(r.viewCount),1),(H(),Ae(vi("Cog8ToothIcon"),{class:"w-6 h-6 inline-block mr-2 cursor-pointer"})),(H(),Ae(vi("QuestionMarkCircleIcon"),{class:"w-6 h-6 inline-block cursor-pointer"}))])])}const l9=ir(n9,[["render",a9]]),c9={__name:"Sonner",props:{invert:{type:Boolean,required:!1},theme:{type:String,required:!1},position:{type:String,required:!1},hotkey:{type:Array,required:!1},richColors:{type:Boolean,required:!1},expand:{type:Boolean,required:!1},duration:{type:Number,required:!1},gap:{type:Number,required:!1},visibleToasts:{type:Number,required:!1},closeButton:{type:Boolean,required:!1},toastOptions:{type:Object,required:!1},class:{type:String,required:!1},style:{type:Object,required:!1},offset:{type:[String,Number],required:!1},dir:{type:String,required:!1},icons:{type:Object,required:!1},containerAriaLabel:{type:String,required:!1},pauseWhenPageIsHidden:{type:Boolean,required:!1},cn:{type:Function,required:!1}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(j1),ft({class:"toaster group"},e,{"toast-options":{classes:{toast:"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",description:"group-[.toast]:text-muted-foreground",actionButton:"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",cancelButton:"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"}}}),null,16))}},u9={components:{Header:tx,Footer:l9,Toaster:c9}},h9={id:"app",class:"flex flex-col"},d9=L("div",{clas:"flex-grow"},null,-1);function f9(t,e,n,r,s,i){const o=ut("Toaster"),a=ut("Header"),c=ut("router-view"),u=ut("Footer");return H(),he("div",h9,[J(o,{position:"bottom-right",richColors:""}),t.$route.meta.requiresOverlay?(H(),Ae(a,{key:0})):sn("v-if",!0),J(c,{class:Ct(["flex",{"pt-[--header-height]":t.$route.meta.requiresOverlay}])},null,8,["class"]),d9,t.$route.meta.requiresOverlay?(H(),Ae(u,{key:1})):sn("v-if",!0)])}const p9=ir(u9,[["render",f9]]),m9=t=>(sC("data-v-5e677b17"),t=t(),iC(),t),g9={class:"min-h-screen pt-[var(--header-height)] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600"},_9={class:"container mx-auto px-4 py-12"},y9=m9(()=>L("h1",{class:"text-4xl font-bold mb-8 text-center text-[var(--text-50)]"}," Mason Bartholomai ",-1)),v9={class:"max-w-7xl mx-auto"},w9={class:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"},E9=["src","alt"],b9=["src"],I9={__name:"Home",setup(t){const e=ae([{src:"https://images.unsplash.com/photo-1687938641915-4338bf1ba124?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 1"},{src:"https://images.unsplash.com/photo-1687938310683-b6824667ab73?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 2"},{src:"https://images.unsplash.com/photo-1687938214619-a96bd6391809?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 3"},{src:"https://images.unsplash.com/photo-1687938133945-477129b34b42?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 4"},{src:"https://images.unsplash.com/photo-1687856265836-60f5bc77d736?q=80&w=2733&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 5"},{src:"https://images.unsplash.com/photo-1687855480803-afb87cc0b760?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 6"},{src:"https://images.unsplash.com/photo-1687854763118-93fbaa46f068?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 7"},{src:"https://images.unsplash.com/photo-1665199439045-b301573908c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 8"},{src:"https://images.unsplash.com/photo-1665199368875-17a658b47668?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 9"},{src:"https://images.unsplash.com/photo-1665197501864-8300c5cfcabe?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",alt:"Random Image 10"}]);return(n,r)=>(H(),he("div",g9,[L("div",_9,[y9,L("div",v9,[L("div",w9,[(H(!0),he(ct,null,ss(e.value,(s,i)=>(H(),he("div",{key:i,class:"relative w-full h-48 sm:h-64 lg:h-80 rounded-lg hover:scale-[1.01] transition-transform duration-300"},[L("img",{src:s.src,alt:s.alt,class:"w-full h-full object-cover rounded-lg clear-blur"},null,8,E9),L("img",{src:s.src,class:"w-full h-full object-cover absolute inset-0 rounded-lg opacity-0 hover:opacity-50 transition-opacity duration-300 blurred-image"},null,8,b9)]))),128))])])])]))}},Hy=ir(I9,[["__scopeId","data-v-5e677b17"]]),T9={setup(){return{}}},C9={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600"},A9=ZC('<div class="flex-grow container mx-auto px-4 py-8"><h1 class="text-4xl font-bold mb-8 text-center">Welcome to the About Us Page</h1><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><p class="text-lg mb-4">This is the about page content. You can provide information about your company or organization here.</p><p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est.</p></div><div><img src="https://source.unsplash.com/random/2" alt="Random Image" class="w-[600px] h-[400px] image-cover overflow-hidden rounded-lg shadow-2xl hover:scale-[101%] transition-transform duration-300"></div></div></div>',1),S9=[A9];function R9(t,e,n,r,s,i){return H(),he("div",C9,S9)}const P9=ir(T9,[["render",R9]]);typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const x9=t=>typeof t<"u";function k9(t){return JSON.parse(JSON.stringify(t))}function FI(t,e,n,r={}){var s,i,o;const{clone:a=!1,passive:c=!1,eventName:u,deep:h=!1,defaultValue:d,shouldEmit:p}=r,g=nr(),v=n||(g==null?void 0:g.emit)||((s=g==null?void 0:g.$emit)==null?void 0:s.bind(g))||((o=(i=g==null?void 0:g.proxy)==null?void 0:i.$emit)==null?void 0:o.bind(g==null?void 0:g.proxy));let S=u;S=S||`update:${e.toString()}`;const P=U=>a?typeof a=="function"?a(U):k9(U):U,M=()=>x9(t[e])?P(t[e]):d,F=U=>{p?p(U)&&v(S,U):v(S,U)};if(c){const U=M(),N=ae(U);let G=!1;return It(()=>t[e],B=>{G||(G=!0,N.value=P(B),tr(()=>G=!1))}),It(N,B=>{!G&&(B!==t[e]||h)&&F(B)},{deep:h}),N}else return we({get(){return M()},set(U){F(U)}})}const Oc={__name:"Input",props:{defaultValue:{type:[String,Number],required:!1},modelValue:{type:[String,Number],required:!1},class:{type:null,required:!1}},emits:["update:modelValue"],setup(t,{emit:e}){const n=t,s=FI(n,"modelValue",e,{passive:!0,defaultValue:n.defaultValue});return(i,o)=>zd((H(),he("input",{"onUpdate:modelValue":o[0]||(o[0]=a=>Dt(s)?s.value=a:null),class:Ct(j(sr)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",n.class))},null,2)),[[nw,j(s)]])}},ra={__name:"Label",props:{for:{type:String,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},setup(t){const e=t,n=we(()=>{const{class:r,...s}=e;return s});return(r,s)=>(H(),Ae(j(JS),ft(n.value,{class:j(sr)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",e.class)}),{default:te(()=>[Re(r.$slots,"default")]),_:3},16,["class"]))}},N9={__name:"Textarea",props:{class:{type:null,required:!1},defaultValue:{type:[String,Number],required:!1},modelValue:{type:[String,Number],required:!1}},emits:["update:modelValue"],setup(t,{emit:e}){const n=t,s=FI(n,"modelValue",e,{passive:!0,defaultValue:n.defaultValue});return(i,o)=>zd((H(),he("textarea",{"onUpdate:modelValue":o[0]||(o[0]=a=>Dt(s)?s.value=a:null),class:Ct(j(sr)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",n.class))},null,2)),[[nw,j(s)]])}};async function O9(t){try{const{name:e,email:n,message:r}=t,s={to:"contact@mxn.au",cc:n,subject:"Contact us form: maso.au",text:"",html:`
        <h2>${e}</h2>
        <h4>${n}</h4>
        <p>${r}</p>
      `},i=await fetch("https://worker-shrill-morning-dd85.thatmasonguy.workers.dev/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!i.ok)throw gn.error("Failed to send email request",{description:Error}),new Error("Failed to send email request");const o=await i.json();console.log("Email request sent successfully:",o),gn.success("Email request sent successfully",{description:"Thank you for your request, we will get back to you shortly."})}catch(e){throw console.error("Error sending email request:",e),gn.error("Failed to send email request",{description:e.message}),e}}const D9={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600"},M9={class:"flex-grow container mx-auto px-4 py-8"},L9=L("h1",{class:"text-4xl font-bold mb-8 text-center text-gray-100"},"Contact Us",-1),V9={class:"max-w-lg mx-auto"},F9=L("p",{class:"text-lg mb-8 text-center text-gray-200"},"This is the contact page content. You can provide contact information or a contact form here.",-1),U9={__name:"Contact",setup(t){const e=ae({name:"",email:"",message:""}),n=async()=>{try{await O9(e.value),e.value={name:"",email:"",message:""}}catch(r){console.error("Error sending email:",r)}};return(r,s)=>(H(),he("div",D9,[L("div",M9,[L9,L("div",V9,[F9,L("form",{onSubmit:VA(n,["prevent"]),class:"grid grid-cols-1 gap-6"},[L("div",null,[J(j(ra),{for:"name",class:"block text-gray-300 font-bold mb-2"},{default:te(()=>[Ue("Name")]),_:1}),J(j(Oc),{type:"text",id:"name",modelValue:e.value.name,"onUpdate:modelValue":s[0]||(s[0]=i=>e.value.name=i),required:"",class:"w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none",placeholder:"Your Name"},null,8,["modelValue"])]),L("div",null,[J(j(ra),{for:"email",class:"block text-gray-300 font-bold mb-2"},{default:te(()=>[Ue("Email")]),_:1}),J(j(Oc),{type:"email",id:"email",modelValue:e.value.email,"onUpdate:modelValue":s[1]||(s[1]=i=>e.value.email=i),required:"",class:"w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none",placeholder:"Your Email"},null,8,["modelValue"])]),L("div",null,[J(j(ra),{for:"message",class:"block text-gray-300 font-bold mb-2"},{default:te(()=>[Ue("Message")]),_:1}),J(j(N9),{id:"message",modelValue:e.value.message,"onUpdate:modelValue":s[2]||(s[2]=i=>e.value.message=i),rows:"4",required:"",class:"w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none",placeholder:"Your Message"},null,8,["modelValue"])]),L("div",null,[J(j(Jc),{type:"submit",class:"w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none"},{default:te(()=>[Ue("Submit")]),_:1})])],32)])])]))}},$9={setup(){const t=ae([{title:"Mxn",url:"https://mxn.au",description:"Description of Mxn website"},{title:"Xbx",url:"https://xbx.au",description:"Description of Xbx website"},{title:"Maso",url:"https://maso.au",description:"Description of Maso website"},{title:"Dxv",url:"https://dxv.ai",description:"Description of Dxv website"},{title:"Tempest Games",url:"https://tempestgames.au",description:"Description of Tempest Games website"},{title:"Studio Tempest",url:"https://studio-tempest.com",description:"Description of Studio Tempest website"},{title:"That Mason Guy",url:"https://thatmasonguy.com",description:"Description of That Mason Guy website"}]),e=["bg-red-500","bg-blue-500","bg-green-500","bg-yellow-500","bg-indigo-500","bg-purple-500","bg-pink-500","bg-gray-500","bg-teal-500","bg-cyan-500"],n=s=>{for(let i=s.length-1;i>0;i--){const o=Math.floor(Math.random()*(i+1));[s[i],s[o]]=[s[o],s[i]]}},r=()=>{n(e),t.value=t.value.map((s,i)=>({...s,color:e[i%e.length]})),console.log("Assigned colors:",t.value)};return un(()=>{r()}),{links:t}}},B9={class:"flex flex-col min-h-[--adjusted-height] pt-[--header-height] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600"},j9={class:"flex-grow container mx-auto px-6 py-8"},q9=L("h1",{class:"text-4xl font-bold mb-8 text-center text-gray-100"}," Welcome to the Home Page ",-1),H9={class:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"},W9=["href"],z9={class:"text-2xl font-bold mb-4 text-white"},G9={class:"text-white"};function K9(t,e,n,r,s,i){return H(),he("div",B9,[L("main",j9,[q9,L("div",H9,[(H(!0),he(ct,null,ss(r.links,(o,a)=>(H(),he("div",{key:a,class:Ct(o.color+" rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition duration-300")},[L("a",{href:o.url,target:"_blank",rel:"noopener noreferrer",class:"block text-center"},[L("div",z9,Lt(o.title),1),L("div",G9,Lt(o.description),1)],8,W9)],2))),128))])])])}const Q9=ir($9,[["render",K9]]),Y9=LI(),J9=ZU(Y9,"createUser"),X9=new hr,Z9=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,e$=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/;b4(Lp,async t=>{if(t)try{const e=qb(VI,"users",t.uid);(await nI(e)).exists()||await rI(e,{firstName:"",lastName:"",userName:"",emailAddress:t.email,phoneNumber:"",dateOfBirth:"",avatarUrl:""});const r=Qr.currentRoute.value;r.meta.requiresAuth&&r.meta.requiresAuth&&!t&&Qr.push("/login")}catch(e){console.error("Error in onAuthStateChanged:",e)}else Qr.currentRoute.value.meta.requiresAuth&&Qr.push("/login")});const t$=async(t,e,n,r,s,i,o,a)=>{try{if(console.log("Validating user input"),!Z9.test(r))throw new Error("Invalid email format");if(!e$.test(o))throw new Error("Password must be at least 8 characters long, contain at least 1 symbol, 1 number, 1 capital, and 1 lowercase letter");if(o!==a)throw new Error("Passwords do not match");const c=new Date;if(c.setFullYear(c.getFullYear()-12),new Date(i)>c)throw new Error("You must be at least 12 years old to sign up");console.log("Trimming input fields"),t=t.trim(),e=e.trim(),n=n.trim(),r=r.trim(),s=s.trim(),console.log("Calling createUser Cloud Function");const h=await J9({firstName:t,lastName:e,userName:n,emailAddress:r,phoneNumber:s,dateOfBirth:i,password:o});console.log("User created successfully"),Qr.push("/home")}catch(c){throw console.error("Error creating user:",c),c}},n$=async(t,e)=>{try{await v4(Lp,t,e),Qr.push("/home")}catch(n){throw console.error("Error signing in:",n),n}},UI=async()=>{try{const e=(await q4(Lp,X9)).user,n=qb(VI,"users",e.uid);(await nI(n)).exists()||await rI(n,{firstName:"",lastName:"",userName:"",emailAddress:e.email,phoneNumber:"",dateOfBirth:"",avatarUrl:""}),Qr.push("/home")}catch(t){throw console.error("Error signing in with Google:",t),t}},r$={components:{Button:Jc,Input:Oc,Label:ra},setup(){const t=ae("https://source.unsplash.com/random/1"),e=ae("https://source.unsplash.com/random/2"),n=ae(""),r=ae(""),s=()=>{e.value=`https://source.unsplash.com/random/${Date.now()}`;const a=t.value;t.value=e.value,e.value=a};return un(()=>{setInterval(s,8e3)}),{currentImage:t,nextImage:e,email:n,password:r,handleEmailLogin:async()=>{try{await n$(n.value,r.value),gn.success("Login successful!")}catch(a){gn.error(a.message)}},handleGoogleLogin:async()=>{try{await UI(),gn.success("Login successful!")}catch(a){gn.error(a.message)}}}}},s$={class:"w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen"},i$={class:"flex flex-col items-center justify-center py-12 px-4 mx-auto"},o$={class:"mx-auto grid w-[350px] gap-6"},a$=L("div",{class:"grid gap-2 text-center"},[L("h1",{class:"text-3xl font-bold mb-6"},"Login"),L("p",{class:"text-balance text-muted-foreground"}," Enter your email below to login to your account ")],-1),l$={class:"grid gap-4"},c$={class:"grid gap-2"},u$={class:"grid gap-2"},h$={class:"flex items-center"},d$=L("a",{href:"/forgot-password",class:"ml-auto inline-block text-sm underline"}," Forgot your password? ",-1),f$=L("div",{class:"mt-4 text-center text-sm"},[Ue(" Don't have an account? "),L("a",{href:"/signup",class:"underline"}," Sign up ")],-1),p$={class:"bg-gray-500 lg:block relative overflow-hidden"},m$=["src"],g$=["src"];function _$(t,e,n,r,s,i){const o=ut("Button"),a=ut("router-link"),c=ut("Label"),u=ut("Input");return H(),he("div",s$,[L("div",i$,[J(a,{to:"/"},{default:te(()=>[J(o,{href:"/",class:"absolute top-2 left-2 z-20"},{default:te(()=>[Ue("Return Home")]),_:1})]),_:1}),J(a,{to:"/"},{default:te(()=>[J(o,{href:"/",class:"absolute top-2 right-2 z-20"},{default:te(()=>[Ue("Dark Mode")]),_:1})]),_:1}),L("div",o$,[a$,L("div",l$,[L("div",c$,[J(c,{for:"email"},{default:te(()=>[Ue("Email")]),_:1}),J(u,{id:"email",type:"email",placeholder:"example@gmail.com",required:"",modelValue:r.email,"onUpdate:modelValue":e[0]||(e[0]=h=>r.email=h)},null,8,["modelValue"])]),L("div",u$,[L("div",h$,[J(c,{for:"password"},{default:te(()=>[Ue("Password")]),_:1}),d$]),J(u,{id:"password",type:"password",required:"",modelValue:r.password,"onUpdate:modelValue":e[1]||(e[1]=h=>r.password=h)},null,8,["modelValue"])]),J(o,{type:"submit",class:"w-full",onClick:r.handleEmailLogin},{default:te(()=>[Ue(" Login ")]),_:1},8,["onClick"]),J(o,{variant:"outline",class:"w-full",onClick:r.handleGoogleLogin},{default:te(()=>[Ue(" Login with Google ")]),_:1},8,["onClick"])]),f$])]),L("div",p$,[J(Kc,{name:"fade",mode:"in-out","enter-active-class":"transition-opacity duration-1000","leave-active-class":"transition-opacity duration-1000","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:te(()=>[(H(),he("img",{key:r.currentImage,src:r.currentImage,alt:"Current Image",class:"object-cover w-full h-full absolute inset-0"},null,8,m$))]),_:1}),L("img",{src:r.nextImage,alt:"Next Image",class:"object-cover w-full h-full absolute inset-0 opacity-0"},null,8,g$)])])}const y$=ir(r$,[["render",_$]]),v$={components:{Button:Jc,Input:Oc,Label:ra},setup(){const t=ae("https://source.unsplash.com/random/3"),e=ae("https://source.unsplash.com/random/4"),n=ae(""),r=ae(""),s=ae(""),i=ae(""),o=ae(""),a=ae(""),c=ae(""),u=ae(""),h=()=>{e.value=`https://source.unsplash.com/random/${Date.now()}`;const g=t.value;t.value=e.value,e.value=g};return un(()=>{setInterval(h,8e3)}),{currentImage:t,nextImage:e,firstName:n,lastName:r,userName:s,email:i,phoneNumber:o,dateOfBirth:a,password:c,confirmPassword:u,handleSignUp:async()=>{try{console.log("Initiating user sign up"),await t$(n.value,r.value,s.value,i.value,o.value,a.value,c.value,u.value),console.log("Sign up successful"),gn.success("Sign up successful!")}catch(g){console.error("Error during sign up:",g),gn.error(g.message)}},handleGoogleSignUp:async()=>{try{console.log("Initiating Google sign up"),await UI(),console.log("Google sign up successful"),gn.success("Sign up successful!")}catch(g){console.error("Error during Google sign up:",g),gn.error(g.message)}}}}},w$={class:"w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen"},E$={class:"flex items-center justify-center py-12 px-4 mx-auto"},b$={class:"mx-auto grid w-[350px] gap-6"},I$=L("div",{class:"grid gap-2 text-center"},[L("h1",{class:"text-3xl font-bold mb-6"},"Sign up"),L("p",{class:"text-balance text-muted-foreground"}," Enter your details below to create your account ")],-1),T$={class:"grid gap-4"},C$={class:"grid gap-2"},A$={class:"grid grid-cols-2 gap-4"},S$={class:"grid gap-2"},R$={class:"grid gap-2"},P$={class:"grid gap-2"},x$={class:"grid gap-2"},k$={class:"grid gap-2"},N$={class:"grid grid-cols-2 gap-4"},O$={class:"grid gap-2"},D$={class:"flex items-center"},M$={class:"grid gap-2"},L$={class:"flex items-center"},V$=L("div",{class:"mt-4 text-center text-sm"},[Ue(" Already have an account? "),L("a",{href:"/login",class:"underline"}," Login ")],-1),F$={class:"bg-gray-500 lg:block relative overflow-hidden"},U$=["src"],$$=["src"];function B$(t,e,n,r,s,i){const o=ut("Button"),a=ut("router-link"),c=ut("Label"),u=ut("Input");return H(),he("div",w$,[L("div",E$,[L("div",b$,[J(a,{to:"/"},{default:te(()=>[J(o,{href:"/",class:"absolute top-2 left-2 z-20"},{default:te(()=>[Ue("Return Home")]),_:1})]),_:1}),J(a,{to:"/"},{default:te(()=>[J(o,{href:"/",class:"absolute top-2 right-2 z-20"},{default:te(()=>[Ue("Dark Mode")]),_:1})]),_:1}),I$,L("div",T$,[L("div",C$,[J(c,{for:"userName"},{default:te(()=>[Ue("Username")]),_:1}),J(u,{id:"userName",type:"text",required:"",modelValue:r.userName,"onUpdate:modelValue":e[0]||(e[0]=h=>r.userName=h)},null,8,["modelValue"])]),L("div",A$,[L("div",S$,[J(c,{for:"firstName"},{default:te(()=>[Ue("First Name")]),_:1}),J(u,{id:"firstName",type:"text",required:"",modelValue:r.firstName,"onUpdate:modelValue":e[1]||(e[1]=h=>r.firstName=h)},null,8,["modelValue"])]),L("div",R$,[J(c,{for:"lastName"},{default:te(()=>[Ue("Last Name")]),_:1}),J(u,{id:"lastName",type:"text",required:"",modelValue:r.lastName,"onUpdate:modelValue":e[2]||(e[2]=h=>r.lastName=h)},null,8,["modelValue"])])]),L("div",P$,[J(c,{for:"email"},{default:te(()=>[Ue("Email")]),_:1}),J(u,{id:"email",type:"email",placeholder:"example@email.com",required:"",modelValue:r.email,"onUpdate:modelValue":e[3]||(e[3]=h=>r.email=h)},null,8,["modelValue"])]),L("div",x$,[J(c,{for:"phoneNumber"},{default:te(()=>[Ue("Phone Number")]),_:1}),J(u,{id:"phoneNumber",type:"tel",modelValue:r.phoneNumber,"onUpdate:modelValue":e[4]||(e[4]=h=>r.phoneNumber=h)},null,8,["modelValue"])]),L("div",k$,[J(c,{for:"dateOfBirth"},{default:te(()=>[Ue("Date of Birth")]),_:1}),J(u,{id:"dateOfBirth",type:"date",modelValue:r.dateOfBirth,"onUpdate:modelValue":e[5]||(e[5]=h=>r.dateOfBirth=h)},null,8,["modelValue"])]),L("div",N$,[L("div",O$,[L("div",D$,[J(c,{for:"password"},{default:te(()=>[Ue("Password")]),_:1})]),J(u,{id:"password",type:"password",required:"",modelValue:r.password,"onUpdate:modelValue":e[6]||(e[6]=h=>r.password=h)},null,8,["modelValue"])]),L("div",M$,[L("div",L$,[J(c,{for:"confirmPassword"},{default:te(()=>[Ue("Confirm Password")]),_:1})]),J(u,{id:"confirmPassword",type:"password",required:"",modelValue:r.confirmPassword,"onUpdate:modelValue":e[7]||(e[7]=h=>r.confirmPassword=h)},null,8,["modelValue"])])]),J(o,{type:"submit",class:"w-full",onClick:r.handleSignUp},{default:te(()=>[Ue(" Sign up ")]),_:1},8,["onClick"]),J(o,{variant:"outline",class:"w-full",onClick:r.handleGoogleSignUp},{default:te(()=>[Ue(" Sign up with Google ")]),_:1},8,["onClick"])]),V$])]),L("div",F$,[J(Kc,{name:"fade",mode:"in-out","enter-active-class":"transition-opacity duration-1000","leave-active-class":"transition-opacity duration-1000","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:te(()=>[(H(),he("img",{key:r.currentImage,src:r.currentImage,alt:"Current Image",class:"object-cover w-full h-full absolute inset-0"},null,8,U$))]),_:1}),L("img",{src:r.nextImage,alt:"Next Image",class:"object-cover w-full h-full absolute inset-0 opacity-0"},null,8,$$)])])}const j$=ir(v$,[["render",B$]]),q$={class:"bg-[--background-900] w-screen rounded-lg shadow-2xl m-4"},Wy=170,zy=170,bs=16,Gy=32,H$={__name:"HomePanel",setup(t){const e=Ys([]),n=ae({}),r=ae({}),s=ae(null),i=()=>{if(s.value){const a=s.value.clientWidth-Gy,c=s.value.clientHeight-Gy,u=Math.floor((a+bs)/(Wy+bs)),h=Math.floor((c+bs)/(zy+bs)),d=(a-(u-1)*bs)/u,p=(c-(h-1)*bs)/h;r.value={width:`${d}px`,height:`${p}px`},n.value={gridTemplateColumns:`repeat(auto-fit, minmax(${Wy}px, 1fr))`,gridAutoRows:`minmax(${zy}px, ${p}px)`,gap:`${bs}px`};const g=u*h;if(e.length<g){const v=g-e.length;for(let S=0;S<v;S++)e.push(`Item ${e.length+1}`)}else e.length>g&&e.splice(g)}},o=()=>{i()};return un(()=>{i(),window.addEventListener("resize",o)}),Hc(()=>{window.removeEventListener("resize",o)}),(a,c)=>(H(),he("div",q$,[L("div",{ref_key:"gridContainer",ref:s,class:"grid gap-4 rounded-lg w-full h-full shadow-xl p-4",style:vr(n.value)},[(H(!0),he(ct,null,ss(e,(u,h)=>(H(),he("div",{key:h,class:"bg-gray-800 rounded-lg flex items-center justify-center text-3xl cursor-pointer text-white",style:vr(r.value)}," + ",4))),128))],4)]))}},W$={class:"min-h-[--adjusted-height] bg-[--background-700] flex-grow"},z$={__name:"Protected",setup(t){return(e,n)=>(H(),he("div",W$,[J(H$)]))}},G$="/assets/lms-visitor-app-C0wQmZw2.png",K$="/assets/lms-web-app-CbBwvuEJ.png",Q$="/assets/lms-website-DMNsaOxV.png",Y$={__name:"Dialog",props:{open:{type:Boolean,required:!1},defaultOpen:{type:Boolean,required:!1},modal:{type:Boolean,required:!1}},emits:["update:open"],setup(t,{emit:e}){const s=uw(t,e);return(i,o)=>(H(),Ae(j(wS),Oi(Na(j(s))),{default:te(()=>[Re(i.$slots,"default")]),_:3},16))}},J$={__name:"DialogTrigger",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(H(),Ae(j(ES),Oi(Na(e)),{default:te(()=>[Re(n.$slots,"default")]),_:3},16))}},X$={__name:"DialogHeader",props:{class:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(H(),he("div",{class:Ct(j(sr)("flex flex-col gap-y-1.5 text-center sm:text-left",e.class))},[Re(n.$slots,"default")],2))}},Z$={__name:"DialogTitle",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},setup(t){const e=t,n=we(()=>{const{class:s,...i}=e;return i}),r=ef(n);return(s,i)=>(H(),Ae(j(HS),ft(j(r),{class:j(sr)("text-lg font-semibold leading-none tracking-tight",e.class)}),{default:te(()=>[Re(s.$slots,"default")]),_:3},16,["class"]))}},eB={__name:"DialogDescription",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},setup(t){const e=t,n=we(()=>{const{class:s,...i}=e;return i}),r=ef(n);return(s,i)=>(H(),Ae(j(WS),ft(j(r),{class:j(sr)("text-sm text-muted-foreground",e.class)}),{default:te(()=>[Re(s.$slots,"default")]),_:3},16,["class"]))}};function tB(t,e){return H(),he("svg",{width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[L("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",fill:"currentColor"})])}const nB=L("span",{class:"sr-only"},"Close",-1),rB={__name:"DialogContent",props:{forceMount:{type:Boolean,required:!1},trapFocus:{type:Boolean,required:!1},disableOutsidePointerEvents:{type:Boolean,required:!1},asChild:{type:Boolean,required:!1},as:{type:null,required:!1},class:{type:null,required:!1}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","openAutoFocus","closeAutoFocus"],setup(t,{emit:e}){const n=t,r=e,s=we(()=>{const{class:o,...a}=n;return a}),i=uw(s,r);return(o,a)=>(H(),Ae(j(IS),null,{default:te(()=>[J(j(jS),{class:"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"}),J(j($S),ft(j(i),{class:j(sr)("fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",n.class)}),{default:te(()=>[Re(o.$slots,"default"),J(j(qS),{class:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"},{default:te(()=>[J(j(tB),{class:"w-4 h-4"}),nB]),_:1})]),_:3},16,["class"])]),_:3}))}},sB={__name:"DialogFooter",props:{class:{type:null,required:!1}},setup(t){const e=t;return(n,r)=>(H(),he("div",{class:Ct(j(sr)("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",e.class))},[Re(n.$slots,"default")],2))}},iB={components:{Dialog:Y$,DialogContent:rB,DialogDescription:eB,DialogFooter:sB,DialogHeader:X$,DialogTitle:Z$,DialogTrigger:J$},setup(){const t={name:"Mason Bartholomai",title:"IT Professional and Developer",about:"Innovative IT professional with a strong background in PowerApps development, web application development, and IT training. Passionate about leading innovation and leveraging technology to enhance organizational efficiency.",skills:["JavaScript","Vue.js","TailwindCSS","Firebase","PowerApps","Python","GitHub"],projects:[{name:"Lifestyle Mentor Services Website",description:"Built the entire lifestylementors.com.au website from scratch using Squarespace.",link:"https://lifestylementors.com.au",image:Q$,website:"https://lifestylementors.com.au"},{name:"PowerApps Visitor Log",description:"Developed a complex PowerApps app for logging visitors and managing session data.",link:"#",image:G$},{name:"Full Stack Web App",description:"Set up a sub-domain hosting a full stack webapp using Firestore and Firebase for data and authentication.",link:"https://lifestylementors.mxn.au",image:K$,website:"https://lifestylementors.mxn.au"}],email:"mason@mxn.au",linkedin:"https://www.linkedin.com/in/masonbartholomai"},e=ae(!1);function n(){e.value=!0}function r(){e.value=!1}return{data:t,isDialogOpen:e,openDialog:n,closeDialog:r}}},oB={class:"mx-auto pb-12 w-full min-h-[--adjusted-height] bg-gradient-to-br from-background-950 from-20% via-background-800 to-background-600 px-28"},aB={class:"max-w-4xl mx-auto"},lB={class:"text-center mb-12 mt-8"},cB={class:"text-5xl font-bold mb-2 text-gray-100"},uB={class:"text-2xl text-gray-200"},hB={class:"mb-12"},dB=L("h2",{class:"text-3xl font-semibold mb-4 text-gray-100"},"About Me",-1),fB={class:"text-lg text-gray-300"},pB={class:"mb-12"},mB=L("h2",{class:"text-3xl font-semibold mb-6 text-gray-100"},"Skills",-1),gB={class:"flexbox flex-wrap"},_B={class:"mb-12"},yB=L("h2",{class:"text-3xl font-semibold mb-6 text-gray-100"},"Projects",-1),vB={class:"text-2xl font-bold mb-2 text-gray-200"},wB={class:"text-lg text-gray-300 mb-2"},EB=["href"],bB=["href"],IB=["src"],TB=["src"],CB=L("h2",{class:"text-3xl font-semibold mb-6 text-gray-100"},"Contact",-1),AB={class:"flex items-center mb-4"},SB=L("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 mr-2 text-gray-100",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[L("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"})],-1),RB=["href"],PB={class:"flex items-center"},xB=L("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 mr-2 text-gray-100",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[L("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9"})],-1),kB=["href"];function NB(t,e,n,r,s,i){const o=ut("DialogTrigger"),a=ut("DialogTitle"),c=ut("DialogDescription"),u=ut("DialogHeader"),h=ut("DialogContent"),d=ut("Dialog");return H(),he("div",oB,[L("div",aB,[L("div",null,[L("header",lB,[L("h1",cB,Lt(r.data.name),1),L("p",uB,Lt(r.data.title),1)])]),L("div",hB,[dB,L("p",fB,Lt(r.data.about),1)]),L("div",pB,[mB,L("div",gB,[(H(!0),he(ct,null,ss(r.data.skills,p=>(H(),he("span",{key:p,class:"inline-block bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-lg mb-4 mr-4 transition duration-200 ease-in-out"},Lt(p),1))),128))])]),L("div",_B,[yB,(H(!0),he(ct,null,ss(r.data.projects,p=>(H(),he("div",{key:p.name,class:"mb-8 flex justify-between"},[L("div",null,[L("h3",vB,Lt(p.name),1),L("p",wB,Lt(p.description),1),L("div",null,[L("a",{href:p.link,target:"_blank",class:"text-blue-700 hover:text-blue-500 hover:underline text-lg transition duration-200 ease-in-out"},"View Demo",8,EB),p.website?(H(),he("a",{key:0,href:p.website,target:"_blank",class:"text-blue-700 hover:text-blue-500 ml-4 hover:underline text-lg transition duration-200 ease-in-out"},"View Live",8,bB)):sn("v-if",!0)])]),L("div",null,[J(d,{isOpen:r.isDialogOpen,onClose:r.closeDialog},{default:te(()=>[J(o,null,{default:te(()=>[L("img",{src:p.image,alt:"{{ project.name }}",class:"m-5 mt-0 mb-6 rounded-lg max-w-96 shadow-2xl hover:scale-105 transition duration-200 ease-in-out cursor-pointer",onClick:e[0]||(e[0]=(...g)=>r.openDialog&&r.openDialog(...g))},null,8,IB)]),_:2},1024),J(h,{class:"sm:max-w-5xl bg-gray-100"},{default:te(()=>[J(u,null,{default:te(()=>[J(a,null,{default:te(()=>[Ue(Lt(p.name),1)]),_:2},1024),J(c,null,{default:te(()=>[Ue(Lt(p.description),1)]),_:2},1024)]),_:2},1024),L("img",{src:p.image,alt:"Project Image",class:"w-full rounded-lg shadow-xl"},null,8,TB)]),_:2},1024)]),_:2},1032,["isOpen","onClose"])])]))),128))]),L("div",null,[CB,L("div",AB,[SB,L("a",{href:"mailto:"+r.data.email,class:"text-lg text-blue-700 hover:text-blue-500 hover:underline transition duration-200 ease-in-out"},Lt(r.data.email),9,RB)]),L("div",PB,[xB,L("a",{href:r.data.linkedin,target:"_blank",class:"text-lg text-blue-700 hover:text-blue-500 hover:underline transition duration-200 ease-in-out"},"LinkedIn",8,kB)])])])])}const OB=ir(iB,[["render",NB]]),DB={},MB={class:"flex items-center justify-center h-screen"},LB={class:"text-center"},VB=L("h1",{class:"text-9xl font-bold mb-8"},"404",-1),FB=L("p",{class:"text-2xl mb-8"},"Page not found.",-1);function UB(t,e){const n=ut("router-link");return H(),he("div",MB,[L("div",LB,[VB,FB,J(n,{to:"/",class:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"},{default:te(()=>[Ue(" Return Home ")]),_:1})])])}const $B=ir(DB,[["render",UB]]),BB=[{path:"/",alias:["/","/index",""],name:"Home",component:Hy,meta:{requiresAuth:!1,title:"Home",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/home",alias:"/Home",name:"Photography",component:Hy,meta:{requiresAuth:!1,title:"Photography",requiresOverlay:!0,requiresAuthOverlay:!0}},{path:"/about",alias:"/about-us",name:"About",component:P9,meta:{requiresAuth:!1,title:"About",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/contact",alias:"/contact-us",name:"Contact",component:U9,meta:{requiresAuth:!1,title:"Contact",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/websites",alias:"/websites",name:"Websites",component:Q9,meta:{requiresAuth:!1,title:"Websites",requiresOverlay:!0,requiresAuthOverlay:!1}},{path:"/login",alias:"/signin",name:"Login",component:y$,meta:{requiresAuth:!1,title:"Login",requiresOverlay:!1,requiresAuthOverlay:!1}},{path:"/signup",alias:["/create-account","/sign-up"],name:"Sign Up",component:j$,meta:{requiresAuth:!1,title:"Sign Up",requiresOverlay:!1,requiresAuthOverlay:!1}},{path:"/protected",alias:"/protected",name:"Protected",component:z$,meta:{requiresAuth:!0,title:"Protected",requiresOverlay:!0,requiresAuthOverlay:!0}},{path:"/portfolio",alias:"/portfolio",name:"Portfolio",component:OB,meta:{requiresAuth:!1,title:"Portfolio",requiresOverlay:!0,requiresAuthOverlay:!0}},{path:"/:pathMatch(.*)*",name:"404",component:$B,meta:{requiresAuth:!1,title:"404",requiresOverlay:!1,requiresAuthOverlay:!1}}],Qr=HP({history:vP(),routes:BB}),$I=$A(p9);$I.use(Qr);$I.mount("#app");
