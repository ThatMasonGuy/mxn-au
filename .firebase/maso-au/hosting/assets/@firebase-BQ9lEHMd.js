import{o as Td}from"./idb-BXWtuYvb.js";import{_ as Ga}from"./tslib-BGVaTf34.js";var Tu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wd={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N=function(n,e){if(!n)throw ii(e)},ii=function(n){return new Error("Firebase Database ("+wd.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ad=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},em=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const s=n[t++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=n[t++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=n[t++],o=n[t++],l=n[t++],c=((s&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const r=n[t++],o=n[t++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Ka={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){const r=n[s],o=s+1<n.length,l=o?n[s+1]:0,c=s+2<n.length,h=c?n[s+2]:0,f=r>>2,g=(r&3)<<4|l>>4;let _=(l&15)<<2|h>>6,A=h&63;c||(A=64,o||(_=64)),i.push(t[f],t[g],t[_],t[A])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ad(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):em(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){const r=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const h=s<n.length?t[n.charAt(s)]:64;++s;const g=s<n.length?t[n.charAt(s)]:64;if(++s,r==null||l==null||h==null||g==null)throw new tm;const _=r<<2|l>>4;if(i.push(_),h!==64){const A=l<<4&240|h>>2;if(i.push(A),g!==64){const R=h<<6&192|g;i.push(R)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class tm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Cd=function(n){const e=Ad(n);return Ka.encodeByteArray(e,!0)},gr=function(n){return Cd(n).replace(/\./g,"")},_r=function(n){try{return Ka.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nm(n){return Sd(void 0,n)}function Sd(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!im(t)||(n[t]=Sd(n[t],e[t]));return n}function im(n){return n!=="__proto__"}/**
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
 */function sm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const rm=()=>sm().__FIREBASE_DEFAULTS__,om=()=>{if(typeof process>"u"||typeof Tu>"u")return;const n=Tu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},am=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&_r(n[1]);return e&&JSON.parse(e)},Gr=()=>{try{return rm()||om()||am()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Rd=n=>{var e,t;return(t=(e=Gr())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Qa=n=>{const e=Rd(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},Pd=()=>{var n;return(n=Gr())===null||n===void 0?void 0:n.config},bd=n=>{var e;return(e=Gr())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
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
 */function kd(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",s=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[gr(JSON.stringify(t)),gr(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ya(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Se())}function lm(){var n;const e=(n=Gr())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Nd(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Dd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function cm(){const n=Se();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Od(){return wd.NODE_ADMIN===!0}function um(){return!lm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Md(){try{return typeof indexedDB=="object"}catch{return!1}}function Ld(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}function hm(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dm="FirebaseError";class Je extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=dm,Object.setPrototypeOf(this,Je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,En.prototype.create)}}class En{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?fm(r,i):"Error",l=`${this.serviceName}: ${o} (${s}).`;return new Je(s,l,i)}}function fm(n,e){return n.replace(pm,(t,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const pm=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xi(n){return JSON.parse(n)}function Ee(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd=function(n){let e={},t={},i={},s="";try{const r=n.split(".");e=Xi(_r(r[0])||""),t=Xi(_r(r[1])||""),s=r[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:s}},gm=function(n){const e=Vd(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},_m=function(n){const e=Vd(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function ln(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function ha(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function mr(n,e,t){const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=e.call(t,n[s],s,n));return i}function Ji(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const s of t){if(!i.includes(s))return!1;const r=n[s],o=e[s];if(wu(r)&&wu(o)){if(!Ji(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!t.includes(s))return!1;return!0}function wu(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function si(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Mi(n){const e={};return n.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[s,r]=i.split("=");e[decodeURIComponent(s)]=decodeURIComponent(r)}}),e}function Li(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mm{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let g=0;g<16;g++)i[g]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let g=0;g<16;g++)i[g]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let g=16;g<80;g++){const _=i[g-3]^i[g-8]^i[g-14]^i[g-16];i[g]=(_<<1|_>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],h,f;for(let g=0;g<80;g++){g<40?g<20?(h=l^r&(o^l),f=1518500249):(h=r^o^l,f=1859775393):g<60?(h=r&o|l&(r|o),f=2400959708):(h=r^o^l,f=3395469782);const _=(s<<5|s>>>27)+h+c+f+i[g]&4294967295;c=l,l=o,o=(r<<30|r>>>2)&4294967295,r=s,s=_}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<t;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<t;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<t;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function ym(n,e){const t=new vm(n,e);return t.subscribe.bind(t)}class vm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let s;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");Em(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:i},s.next===void 0&&(s.next=Go),s.error===void 0&&(s.error=Go),s.complete===void 0&&(s.complete=Go);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Em(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Go(){}function xd(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,N(i<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):s<65536?(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Qr=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
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
 */const Tm=1e3,wm=2,Am=4*60*60*1e3,Cm=.5;function Au(n,e=Tm,t=wm){const i=e*Math.pow(t,n),s=Math.round(Cm*i*(Math.random()-.5)*2);return Math.min(Am,i+s)}/**
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
 */function he(n){return n&&n._delegate?n._delegate:n}class ze{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const en="[DEFAULT]";/**
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
 */class Sm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new Kr;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Pm(e))try{this.getOrInitializeService({instanceIdentifier:en})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=en){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=en){return this.instances.has(e)}getOptions(e=en){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);i===l&&o.resolve(s)}return s}onInit(e,t){var i;const s=this.normalizeInstanceIdentifier(t),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const s of i)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Rm(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=en){return this.component?this.component.multipleInstances?e:en:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Rm(n){return n===en?void 0:n}function Pm(n){return n.instantiationMode==="EAGER"}/**
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
 */class bm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Sm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd=[];var G;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(G||(G={}));const km={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},Nm=G.INFO,Dm={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},Om=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),s=Dm[e];if(s)console[s](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ms{constructor(e){this.name=e,this._logLevel=Nm,this._logHandler=Om,this._userLogHandler=null,Fd.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in G))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?km[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...e),this._logHandler(this,G.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...e),this._logHandler(this,G.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,G.INFO,...e),this._logHandler(this,G.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,G.WARN,...e),this._logHandler(this,G.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...e),this._logHandler(this,G.ERROR,...e)}}function Mm(n){Fd.forEach(e=>{e.setLogLevel(n)})}/**
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
 */class Lm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Vm(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function Vm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const da="@firebase/app",Cu="0.10.5";/**
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
 */const cn=new ms("@firebase/app"),xm="@firebase/app-compat",Fm="@firebase/analytics-compat",Um="@firebase/analytics",Bm="@firebase/app-check-compat",qm="@firebase/app-check",jm="@firebase/auth",$m="@firebase/auth-compat",Wm="@firebase/database",Hm="@firebase/database-compat",zm="@firebase/functions",Gm="@firebase/functions-compat",Km="@firebase/installations",Qm="@firebase/installations-compat",Ym="@firebase/messaging",Xm="@firebase/messaging-compat",Jm="@firebase/performance",Zm="@firebase/performance-compat",ey="@firebase/remote-config",ty="@firebase/remote-config-compat",ny="@firebase/storage",iy="@firebase/storage-compat",sy="@firebase/firestore",ry="@firebase/vertexai-preview",oy="@firebase/firestore-compat",ay="firebase",ly="10.12.2";/**
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
 */const fa="[DEFAULT]",cy={[da]:"fire-core",[xm]:"fire-core-compat",[Um]:"fire-analytics",[Fm]:"fire-analytics-compat",[qm]:"fire-app-check",[Bm]:"fire-app-check-compat",[jm]:"fire-auth",[$m]:"fire-auth-compat",[Wm]:"fire-rtdb",[Hm]:"fire-rtdb-compat",[zm]:"fire-fn",[Gm]:"fire-fn-compat",[Km]:"fire-iid",[Qm]:"fire-iid-compat",[Ym]:"fire-fcm",[Xm]:"fire-fcm-compat",[Jm]:"fire-perf",[Zm]:"fire-perf-compat",[ey]:"fire-rc",[ty]:"fire-rc-compat",[ny]:"fire-gcs",[iy]:"fire-gcs-compat",[sy]:"fire-fst",[oy]:"fire-fst-compat",[ry]:"fire-vertex","fire-js":"fire-js",[ay]:"fire-js-all"};/**
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
 */const yr=new Map,uy=new Map,pa=new Map;function Su(n,e){try{n.container.addComponent(e)}catch(t){cn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ye(n){const e=n.name;if(pa.has(e))return cn.debug(`There were multiple attempts to register component ${e}.`),!1;pa.set(e,n);for(const t of yr.values())Su(t,n);for(const t of uy.values())Su(t,n);return!0}function Rt(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function at(n){return n.settings!==void 0}/**
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
 */const hy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ut=new En("app","Firebase",hy);/**
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
 */class dy{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new ze("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ut.create("app-deleted",{appName:this._name})}}/**
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
 */const In=ly;function fy(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i=Object.assign({name:fa,automaticDataCollectionEnabled:!1},e),s=i.name;if(typeof s!="string"||!s)throw Ut.create("bad-app-name",{appName:String(s)});if(t||(t=Pd()),!t)throw Ut.create("no-options");const r=yr.get(s);if(r){if(Ji(t,r.options)&&Ji(i,r.config))return r;throw Ut.create("duplicate-app",{appName:s})}const o=new bm(s);for(const c of pa.values())o.addComponent(c);const l=new dy(t,i,o);return yr.set(s,l),l}function ys(n=fa){const e=yr.get(n);if(!e&&n===fa&&Pd())return fy();if(!e)throw Ut.create("no-app",{appName:n});return e}function Fe(n,e,t){var i;let s=(i=cy[n])!==null&&i!==void 0?i:n;t&&(s+=`-${t}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${s}" with version "${e}":`];r&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),cn.warn(l.join(" "));return}Ye(new ze(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}function O0(n){Mm(n)}/**
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
 */const py="firebase-heartbeat-database",gy=1,Zi="firebase-heartbeat-store";let Ko=null;function Ud(){return Ko||(Ko=Td(py,gy,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Zi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Ut.create("idb-open",{originalErrorMessage:n.message})})),Ko}async function _y(n){try{const t=(await Ud()).transaction(Zi),i=await t.objectStore(Zi).get(Bd(n));return await t.done,i}catch(e){if(e instanceof Je)cn.warn(e.message);else{const t=Ut.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});cn.warn(t.message)}}}async function Ru(n,e){try{const i=(await Ud()).transaction(Zi,"readwrite");await i.objectStore(Zi).put(e,Bd(n)),await i.done}catch(t){if(t instanceof Je)cn.warn(t.message);else{const i=Ut.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});cn.warn(i.message)}}}function Bd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const my=1024,yy=30*24*60*60*1e3;class vy{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Iy(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Pu();if(!(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)))return this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=yy}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Pu(),{heartbeatsToSend:i,unsentEntries:s}=Ey(this._heartbeatsCache.heartbeats),r=gr(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}}function Pu(){return new Date().toISOString().substring(0,10)}function Ey(n,e=my){const t=[];let i=n.slice();for(const s of n){const r=t.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),bu(t)>e){r.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),bu(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class Iy{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Md()?Ld().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await _y(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ru(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ru(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function bu(n){return gr(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Ty(n){Ye(new ze("platform-logger",e=>new Lm(e),"PRIVATE")),Ye(new ze("heartbeat",e=>new vy(e),"PRIVATE")),Fe(da,Cu,n),Fe(da,Cu,"esm2017"),Fe("fire-js","")}Ty("");var ku={};const Nu="@firebase/database",Du="1.0.5";/**
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
 */let qd="";function wy(n){qd=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Ee(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Xi(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return ot(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jd=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Ay(e)}}catch{}return new Cy},nn=jd("localStorage"),Sy=jd("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fn=new ms("@firebase/database"),$d=function(){let n=1;return function(){return n++}}(),Wd=function(n){const e=Im(n),t=new mm;t.update(e);const i=t.digest();return Ka.encodeByteArray(i)},vs=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=vs.apply(null,i):typeof i=="object"?e+=Ee(i):e+=i,e+=" "}return e};let Bi=null,Ou=!0;const Ry=function(n,e){N(!e,"Can't turn on custom loggers persistently."),Fn.logLevel=G.VERBOSE,Bi=Fn.log.bind(Fn)},Oe=function(...n){if(Ou===!0&&(Ou=!1,Bi===null&&Sy.get("logging_enabled")===!0&&Ry()),Bi){const e=vs.apply(null,n);Bi(e)}},Es=function(n){return function(...e){Oe(n,...e)}},ga=function(...n){const e="FIREBASE INTERNAL ERROR: "+vs(...n);Fn.error(e)},wt=function(...n){const e=`FIREBASE FATAL ERROR: ${vs(...n)}`;throw Fn.error(e),new Error(e)},We=function(...n){const e="FIREBASE WARNING: "+vs(...n);Fn.warn(e)},Py=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&We("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Xa=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},by=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},zn="[MIN_NAME]",un="[MAX_NAME]",ri=function(n,e){if(n===e)return 0;if(n===zn||e===un)return-1;if(e===zn||n===un)return 1;{const t=Mu(n),i=Mu(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},ky=function(n,e){return n===e?0:n<e?-1:1},bi=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+Ee(e))},Ja=function(n){if(typeof n!="object"||n===null)return Ee(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=Ee(e[i]),t+=":",t+=Ja(n[e[i]]);return t+="}",t},Hd=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let s=0;s<t;s+=e)s+e>t?i.push(n.substring(s,t)):i.push(n.substring(s,s+e));return i};function qe(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const zd=function(n){N(!Xa(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let s,r,o,l,c;n===0?(r=0,o=0,s=1/n===-1/0?1:0):(s=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),i),r=l+i,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-i-t))));const h=[];for(c=t;c;c-=1)h.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)h.push(r%2?1:0),r=Math.floor(r/2);h.push(s?1:0),h.reverse();const f=h.join("");let g="";for(c=0;c<64;c+=8){let _=parseInt(f.substr(c,8),2).toString(16);_.length===1&&(_="0"+_),g=g+_}return g.toLowerCase()},Ny=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Dy=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Oy(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const My=new RegExp("^-?(0*)\\d{1,10}$"),Ly=-2147483648,Vy=2147483647,Mu=function(n){if(My.test(n)){const e=Number(n);if(e>=Ly&&e<=Vy)return e}return null},Is=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw We("Exception was thrown by user callback.",t),e},Math.floor(0))}},xy=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},qi=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
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
 */class Fy{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){We(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Oe("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',We(e)}}class rr{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}rr.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Za="5",Gd="v",Kd="s",Qd="r",Yd="f",Xd=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Jd="ls",Zd="p",_a="ac",ef="websocket",tf="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e,t,i,s,r=!1,o="",l=!1,c=!1){this.secure=t,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=nn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&nn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function By(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function sf(n,e,t){N(typeof e=="string","typeof type must == string"),N(typeof t=="object","typeof params must == object");let i;if(e===ef)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===tf)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);By(n)&&(t.ns=n.namespace);const s=[];return qe(t,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(){this.counters_={}}incrementCounter(e,t=1){ot(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return nm(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qo={},Yo={};function el(n){const e=n.toString();return Qo[e]||(Qo[e]=new qy),Qo[e]}function jy(n,e){const t=n.toString();return Yo[t]||(Yo[t]=e()),Yo[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Is(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lu="start",Wy="close",Hy="pLPCommand",zy="pRTLPCB",rf="id",of="pw",af="ser",Gy="cb",Ky="seg",Qy="ts",Yy="d",Xy="dframe",lf=1870,cf=30,Jy=lf-cf,Zy=25e3,ev=3e4;class Vn{constructor(e,t,i,s,r,o,l){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Es(e),this.stats_=el(t),this.urlFn=c=>(this.appCheckToken&&(c[_a]=this.appCheckToken),sf(t,tf,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new $y(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(ev)),by(()=>{if(this.isClosed_)return;this.scriptTagHolder=new tl((...r)=>{const[o,l,c,h,f]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===Lu)this.id=l,this.password=c;else if(o===Wy)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,l]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const i={};i[Lu]="t",i[af]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[Gy]=this.scriptTagHolder.uniqueCallbackIdentifier),i[Gd]=Za,this.transportSessionId&&(i[Kd]=this.transportSessionId),this.lastSessionId&&(i[Jd]=this.lastSessionId),this.applicationId&&(i[Zd]=this.applicationId),this.appCheckToken&&(i[_a]=this.appCheckToken),typeof location<"u"&&location.hostname&&Xd.test(location.hostname)&&(i[Qd]=Yd);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Vn.forceAllow_=!0}static forceDisallow(){Vn.forceDisallow_=!0}static isAvailable(){return Vn.forceAllow_?!0:!Vn.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Ny()&&!Dy()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Ee(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=Cd(t),s=Hd(i,Jy);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[Xy]="t",i[rf]=e,i[of]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Ee(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class tl{constructor(e,t,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=$d(),window[Hy+this.uniqueCallbackIdentifier]=e,window[zy+this.uniqueCallbackIdentifier]=t,this.myIFrame=tl.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){Oe("frame writing exception"),l.stack&&Oe(l.stack),Oe(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Oe("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[rf]=this.myID,e[of]=this.myPW,e[af]=this.currentSerial;let t=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+cf+i.length<=lf;){const o=this.pendingSegs.shift();i=i+"&"+Ky+s+"="+o.seg+"&"+Qy+s+"="+o.ts+"&"+Yy+s+"="+o.d,s++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},s=setTimeout(i,Math.floor(Zy)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{Oe("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tv=16384,nv=45e3;let vr=null;typeof MozWebSocket<"u"?vr=MozWebSocket:typeof WebSocket<"u"&&(vr=WebSocket);class et{constructor(e,t,i,s,r,o,l){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Es(this.connId),this.stats_=el(t),this.connURL=et.connectionURL_(t,o,l,s,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,s,r){const o={};return o[Gd]=Za,typeof location<"u"&&location.hostname&&Xd.test(location.hostname)&&(o[Qd]=Yd),t&&(o[Kd]=t),i&&(o[Jd]=i),s&&(o[_a]=s),r&&(o[Zd]=r),sf(e,ef,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,nn.set("previous_websocket_failure",!0);try{let i;Od(),this.mySock=new vr(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){et.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&vr!==null&&!et.forceDisallow_}static previouslyFailed(){return nn.isInMemoryStorage||nn.get("previous_websocket_failure")===!0}markConnectionHealthy(){nn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=Xi(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(N(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=Ee(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=Hd(t,tv);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(nv))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}et.responsesRequiredToBeHealthy=2;et.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[Vn,et]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=et&&et.isAvailable();let i=t&&!et.previouslyFailed();if(e.webSocketOnly&&(t||We("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[et];else{const s=this.transports_=[];for(const r of es.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);es.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}es.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=6e4,sv=5e3,rv=10*1024,ov=100*1024,Xo="t",Vu="d",av="s",xu="r",lv="e",Fu="o",Uu="a",Bu="n",qu="p",cv="h";class uv{constructor(e,t,i,s,r,o,l,c,h,f){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=h,this.lastSessionId=f,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Es("c:"+this.id+":"),this.transportManager_=new es(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=qi(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>ov?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>rv?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Xo in e){const t=e[Xo];t===Uu?this.upgradeIfSecondaryHealthy_():t===xu?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Fu&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=bi("t",e),i=bi("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:qu,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Uu,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Bu,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=bi("t",e),i=bi("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=bi(Xo,e);if(Vu in e){const i=e[Vu];if(t===cv){const s=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(t===Bu){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===av?this.onConnectionShutdown_(i):t===xu?this.onReset_(i):t===lv?ga("Server Error: "+i):t===Fu?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):ga("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Za!==i&&We("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),qi(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(iv))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):qi(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(sv))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:qu,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(nn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{put(e,t,i,s){}merge(e,t,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{constructor(e){this.allowedEvents_=e,this.listeners_={},N(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const s=this.getInitialEvent(e);s&&t.apply(i,s)}off(e,t,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===t&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){N(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er extends hf{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Ya()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new Er}getInitialEvent(e){return N(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ju=32,$u=768;class te{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function Z(){return new te("")}function $(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function $t(n){return n.pieces_.length-n.pieceNum_}function ne(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new te(n.pieces_,e)}function df(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function hv(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function ff(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function pf(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new te(e,0)}function ge(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof te)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&t.push(i[s])}return new te(t,0)}function H(n){return n.pieceNum_>=n.pieces_.length}function Ue(n,e){const t=$(n),i=$(e);if(t===null)return e;if(t===i)return Ue(ne(n),ne(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function nl(n,e){if($t(n)!==$t(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function tt(n,e){let t=n.pieceNum_,i=e.pieceNum_;if($t(n)>$t(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class dv{constructor(e,t){this.errorPrefix_=t,this.parts_=ff(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=Qr(this.parts_[i]);gf(this)}}function fv(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Qr(e),gf(n)}function pv(n){const e=n.parts_.pop();n.byteLength_-=Qr(e),n.parts_.length>0&&(n.byteLength_-=1)}function gf(n){if(n.byteLength_>$u)throw new Error(n.errorPrefix_+"has a key path longer than "+$u+" bytes ("+n.byteLength_+").");if(n.parts_.length>ju)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ju+") or object contains a cycle "+tn(n))}function tn(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il extends hf{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}static getInstance(){return new il}getInitialEvent(e){return N(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki=1e3,gv=60*5*1e3,Wu=30*1e3,_v=1.3,mv=3e4,yv="server_kill",Hu=3;class It extends uf{constructor(e,t,i,s,r,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=It.nextPersistentConnectionId_++,this.log_=Es("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=ki,this.maxReconnectDelay_=gv,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c&&!Od())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");il.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Er.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const s=++this.requestNumber_,r={r:s,a:e,b:t};this.log_(Ee(r)),N(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const t=new Kr,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),N(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),N(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const l={onComplete:s,hashFn:t,query:e,tag:i};this.listens.get(o).set(r,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),s=t._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,l=>{const c=l.d,h=l.s;It.warnOnListenWarnings_(c,t),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",l),h!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(h,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&ot(e,"w")){const i=ln(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();We(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||_m(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Wu)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=gm(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),N(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,t)}sendUnlisten_(e,t,i,s){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,s){const r={p:t,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,t,i,s){this.putInternal("p",e,t,i,s)}merge(e,t,i,s){this.putInternal("m",e,t,i,s)}putInternal(e,t,i,s,r){this.initConnection_();const o={p:t,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Ee(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):ga("Unrecognized action received from server: "+Ee(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){N(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=ki,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=ki,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>mv&&(this.reconnectDelay_=ki),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*_v)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+It.nextConnectionId_++,r=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,i())},h=function(g){N(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(g)};this.realtime_={close:c,sendRequest:h};const f=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[g,_]=await Promise.all([this.authTokenProvider_.getToken(f),this.appCheckTokenProvider_.getToken(f)]);o?Oe("getToken() completed but was canceled"):(Oe("getToken() completed. Creating connection."),this.authToken_=g&&g.accessToken,this.appCheckToken_=_&&_.token,l=new uv(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,A=>{We(A+" ("+this.repoInfo_.toString()+")"),this.interrupt(yv)},r))}catch(g){this.log_("Failed to get token: "+g),o||(this.repoInfo_.nodeAdmin&&We(g),c())}}}interrupt(e){Oe("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Oe("Resuming connection for reason: "+e),delete this.interruptReasons_[e],ha(this.interruptReasons_)&&(this.reconnectDelay_=ki,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(r=>Ja(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,t){const i=new te(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(t),r.delete(t),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,t){Oe("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Hu&&(this.reconnectDelay_=Wu,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Oe("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Hu&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+qd.replace(/\./g,"-")]=1,Ya()?e["framework.cordova"]=1:Dd()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Er.getInstance().currentlyOnline();return ha(this.interruptReasons_)&&e}}It.nextPersistentConnectionId_=0;It.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new W(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new W(zn,e),s=new W(zn,t);return this.compare(i,s)!==0}minPost(){return W.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Js;class _f extends Yr{static get __EMPTY_NODE(){return Js}static set __EMPTY_NODE(e){Js=e}compare(e,t){return ri(e.name,t.name)}isDefinedOn(e){throw ii("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return W.MIN}maxPost(){return new W(un,Js)}makePost(e,t){return N(typeof e=="string","KeyIndex indexValue must always be a string."),new W(e,Js)}toString(){return".key"}}const Un=new _f;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zs=class{constructor(e,t,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},$e=class Vi{constructor(e,t,i,s,r){this.key=e,this.value=t,this.color=i??Vi.RED,this.left=s??lt.EMPTY_NODE,this.right=r??lt.EMPTY_NODE}copy(e,t,i,s,r){return new Vi(e??this.key,t??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,t,i),null):r===0?s=s.copy(null,t,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,t,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return lt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,s;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return lt.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Vi.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Vi.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};$e.RED=!0;$e.BLACK=!1;class vv{copy(e,t,i,s,r){return this}insert(e,t,i){return new $e(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}let lt=class or{constructor(e,t=or.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new or(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,$e.BLACK,null,null))}remove(e){return new or(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,$e.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,s=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Zs(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Zs(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Zs(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Zs(this.root_,null,this.comparator_,!0,e)}};lt.EMPTY_NODE=new vv;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ev(n,e){return ri(n.name,e.name)}function sl(n,e){return ri(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ma;function Iv(n){ma=n}const mf=function(n){return typeof n=="number"?"number:"+zd(n):"string:"+n},yf=function(n){if(n.isLeafNode()){const e=n.val();N(typeof e=="string"||typeof e=="number"||typeof e=="object"&&ot(e,".sv"),"Priority must be a string or number.")}else N(n===ma||n.isEmpty(),"priority of unexpected type.");N(n===ma||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zu;class ye{constructor(e,t=ye.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,N(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),yf(this.priorityNode_)}static set __childrenNodeConstructor(e){zu=e}static get __childrenNodeConstructor(){return zu}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new ye(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:ye.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return H(e)?this:$(e)===".priority"?this.priorityNode_:ye.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:ye.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=$(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(N(i!==".priority"||$t(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,ye.__childrenNodeConstructor.EMPTY_NODE.updateChild(ne(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+mf(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=zd(this.value_):e+=this.value_,this.lazyHash_=Wd(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===ye.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof ye.__childrenNodeConstructor?-1:(N(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,s=ye.VALUE_TYPE_ORDER.indexOf(t),r=ye.VALUE_TYPE_ORDER.indexOf(i);return N(s>=0,"Unknown leaf type: "+t),N(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}ye.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let vf,Ef;function Tv(n){vf=n}function wv(n){Ef=n}class Av extends Yr{compare(e,t){const i=e.node.getPriority(),s=t.node.getPriority(),r=i.compareTo(s);return r===0?ri(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return W.MIN}maxPost(){return new W(un,new ye("[PRIORITY-POST]",Ef))}makePost(e,t){const i=vf(e);return new W(t,new ye("[PRIORITY-POST]",i))}toString(){return".priority"}}const ae=new Av;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cv=Math.log(2);class Sv{constructor(e){const t=r=>parseInt(Math.log(r)/Cv,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Ir=function(n,e,t,i){n.sort(e);const s=function(c,h){const f=h-c;let g,_;if(f===0)return null;if(f===1)return g=n[c],_=t?t(g):g,new $e(_,g.node,$e.BLACK,null,null);{const A=parseInt(f/2,10)+c,R=s(c,A),O=s(A+1,h);return g=n[A],_=t?t(g):g,new $e(_,g.node,$e.BLACK,R,O)}},r=function(c){let h=null,f=null,g=n.length;const _=function(R,O){const k=g-R,j=g;g-=R;const z=s(k+1,j),Q=n[k],oe=t?t(Q):Q;A(new $e(oe,Q.node,O,null,z))},A=function(R){h?(h.left=R,h=R):(f=R,h=R)};for(let R=0;R<c.count;++R){const O=c.nextBitIsOne(),k=Math.pow(2,c.count-(R+1));O?_(k,$e.BLACK):(_(k,$e.BLACK),_(k,$e.RED))}return f},o=new Sv(n.length),l=r(o);return new lt(i||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Jo;const Dn={};class mt{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return N(Dn&&ae,"ChildrenNode.ts has not been loaded"),Jo=Jo||new mt({".priority":Dn},{".priority":ae}),Jo}get(e){const t=ln(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof lt?t:null}hasIndex(e){return ot(this.indexSet_,e.toString())}addIndex(e,t){N(e!==Un,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=t.getIterator(W.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let l;s?l=Ir(i,e.getCompare()):l=Dn;const c=e.toString(),h=Object.assign({},this.indexSet_);h[c]=e;const f=Object.assign({},this.indexes_);return f[c]=l,new mt(f,h)}addToIndexes(e,t){const i=mr(this.indexes_,(s,r)=>{const o=ln(this.indexSet_,r);if(N(o,"Missing index implementation for "+r),s===Dn)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(W.Wrap);let h=c.getNext();for(;h;)h.name!==e.name&&l.push(h),h=c.getNext();return l.push(e),Ir(l,o.getCompare())}else return Dn;else{const l=t.get(e.name);let c=s;return l&&(c=c.remove(new W(e.name,l))),c.insert(e,e.node)}});return new mt(i,this.indexSet_)}removeFromIndexes(e,t){const i=mr(this.indexes_,s=>{if(s===Dn)return s;{const r=t.get(e.name);return r?s.remove(new W(e.name,r)):s}});return new mt(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ni;class x{constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&yf(this.priorityNode_),this.children_.isEmpty()&&N(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return Ni||(Ni=new x(new lt(sl),null,mt.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Ni}updatePriority(e){return this.children_.isEmpty()?this:new x(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?Ni:t}}getChild(e){const t=$(e);return t===null?this:this.getImmediateChild(t).getChild(ne(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(N(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new W(e,t);let s,r;t.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?Ni:this.priorityNode_;return new x(s,o,r)}}updateChild(e,t){const i=$(e);if(i===null)return t;{N($(e)!==".priority"||$t(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(ne(e),t);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,s=0,r=!0;if(this.forEachChild(ae,(o,l)=>{t[o]=l.val(e),i++,r&&x.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+mf(this.getPriority().val())+":"),this.forEachChild(ae,(t,i)=>{const s=i.hash();s!==""&&(e+=":"+t+":"+s)}),this.lazyHash_=e===""?"":Wd(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new W(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new W(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new W(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>t(s.name,s.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,W.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,W.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Ts?-1:0}withIndex(e){if(e===Un||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new x(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Un||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(ae),s=t.getIterator(ae);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Un?null:this.indexMap_.get(e.toString())}}x.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Rv extends x{constructor(){super(new lt(sl),x.EMPTY_NODE,mt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return x.EMPTY_NODE}isEmpty(){return!1}}const Ts=new Rv;Object.defineProperties(W,{MIN:{value:new W(zn,x.EMPTY_NODE)},MAX:{value:new W(un,Ts)}});_f.__EMPTY_NODE=x.EMPTY_NODE;ye.__childrenNodeConstructor=x;Iv(Ts);wv(Ts);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv=!0;function we(n,e=null){if(n===null)return x.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),N(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new ye(t,we(e))}if(!(n instanceof Array)&&Pv){const t=[];let i=!1;if(qe(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=we(l);c.isEmpty()||(i=i||!c.getPriority().isEmpty(),t.push(new W(o,c)))}}),t.length===0)return x.EMPTY_NODE;const r=Ir(t,Ev,o=>o.name,sl);if(i){const o=Ir(t,ae.getCompare());return new x(r,we(e),new mt({".priority":o},{".priority":ae}))}else return new x(r,we(e),mt.Default)}else{let t=x.EMPTY_NODE;return qe(n,(i,s)=>{if(ot(n,i)&&i.substring(0,1)!=="."){const r=we(s);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(i,r))}}),t.updatePriority(we(e))}}Tv(we);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bv extends Yr{constructor(e){super(),this.indexPath_=e,N(!H(e)&&$(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),s=this.extractChild(t.node),r=i.compareTo(s);return r===0?ri(e.name,t.name):r}makePost(e,t){const i=we(e),s=x.EMPTY_NODE.updateChild(this.indexPath_,i);return new W(t,s)}maxPost(){const e=x.EMPTY_NODE.updateChild(this.indexPath_,Ts);return new W(un,e)}toString(){return ff(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kv extends Yr{compare(e,t){const i=e.node.compareTo(t.node);return i===0?ri(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return W.MIN}maxPost(){return W.MAX}makePost(e,t){const i=we(e);return new W(t,i)}toString(){return".value"}}const Nv=new kv;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(n){return{type:"value",snapshotNode:n}}function Gn(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function ts(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function ns(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Dv(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e){this.index_=e}updateChild(e,t,i,s,r,o){N(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(s).equals(i.getChild(s))&&l.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(ts(t,l)):N(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(Gn(t,i)):o.trackChildChange(ns(t,i,l))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(ae,(s,r)=>{t.hasChild(s)||i.trackChildChange(ts(s,r))}),t.isLeafNode()||t.forEachChild(ae,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(ns(s,r,o))}else i.trackChildChange(Gn(s,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?x.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e){this.indexedFilter_=new rl(e.getIndex()),this.index_=e.getIndex(),this.startPost_=is.getStartPost_(e),this.endPost_=is.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,s,r,o){return this.matches(new W(t,i))||(i=x.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,s,r,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=x.EMPTY_NODE);let s=t.withIndex(this.index_);s=s.updatePriority(x.EMPTY_NODE);const r=this;return t.forEachChild(ae,(o,l)=>{r.matches(new W(o,l))||(s=s.updateImmediateChild(o,x.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ov{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new is(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,s,r,o){return this.rangedFilter_.matches(new W(t,i))||(i=x.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,s,r,o):this.fullLimitUpdateChild_(e,t,i,r,o)}updateFullNode(e,t,i){let s;if(t.isLeafNode()||t.isEmpty())s=x.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){s=x.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const l=r.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))s=s.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{s=t.withIndex(this.index_),s=s.updatePriority(x.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const l=r.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:s=s.updateImmediateChild(l.name,x.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,s,r){let o;if(this.reverse_){const g=this.index_.getCompare();o=(_,A)=>g(A,_)}else o=this.index_.getCompare();const l=e;N(l.numChildren()===this.limit_,"");const c=new W(t,i),h=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),f=this.rangedFilter_.matches(c);if(l.hasChild(t)){const g=l.getImmediateChild(t);let _=s.getChildAfterChild(this.index_,h,this.reverse_);for(;_!=null&&(_.name===t||l.hasChild(_.name));)_=s.getChildAfterChild(this.index_,_,this.reverse_);const A=_==null?1:o(_,c);if(f&&!i.isEmpty()&&A>=0)return r!=null&&r.trackChildChange(ns(t,i,g)),l.updateImmediateChild(t,i);{r!=null&&r.trackChildChange(ts(t,g));const O=l.updateImmediateChild(t,x.EMPTY_NODE);return _!=null&&this.rangedFilter_.matches(_)?(r!=null&&r.trackChildChange(Gn(_.name,_.node)),O.updateImmediateChild(_.name,_.node)):O}}else return i.isEmpty()?e:f&&o(h,c)>=0?(r!=null&&(r.trackChildChange(ts(h.name,h.node)),r.trackChildChange(Gn(t,i))),l.updateImmediateChild(t,i).updateImmediateChild(h.name,x.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=ae}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return N(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return N(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:zn}hasEnd(){return this.endSet_}getIndexEndValue(){return N(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return N(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:un}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return N(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===ae}copy(){const e=new ol;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Mv(n){return n.loadsAllData()?new rl(n.getIndex()):n.hasLimit()?new Ov(n):new is(n)}function Gu(n){const e={};if(n.isDefault())return e;let t;if(n.index_===ae?t="$priority":n.index_===Nv?t="$value":n.index_===Un?t="$key":(N(n.index_ instanceof bv,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=Ee(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=Ee(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+Ee(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=Ee(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+Ee(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Ku(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==ae&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr extends uf{constructor(e,t,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=Es("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(N(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Tr.getListenId_(e,i),l={};this.listens_[o]=l;const c=Gu(e._queryParams);this.restRequest_(r+".json",c,(h,f)=>{let g=f;if(h===404&&(g=null,h=null),h===null&&this.onDataUpdate_(r,g,!1,i),ln(this.listens_,o)===l){let _;h?h===401?_="permission_denied":_="rest_error:"+h:_="ok",s(_,null)}})}unlisten(e,t){const i=Tr.getListenId_(e,t);delete this.listens_[i]}get(e){const t=Gu(e._queryParams),i=e._path.toString(),s=new Kr;return this.restRequest_(i+".json",t,(r,o)=>{let l=o;r===404&&(l=null,r=null),r===null?(this.onDataUpdate_(i,l,!1,null),s.resolve(l)):s.reject(new Error(l))}),s.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(t.auth=s.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+si(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(i&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=Xi(l.responseText)}catch{We("Failed to parse JSON response for "+o+": "+l.responseText)}i(null,c)}else l.status!==401&&l.status!==404&&We("Got unsuccessful REST response for "+o+" Status: "+l.status),i(l.status);i=null}},l.open("GET",o,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lv{constructor(){this.rootNode_=x.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(){return{value:null,children:new Map}}function Tf(n,e,t){if(H(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=$(e);n.children.has(i)||n.children.set(i,wr());const s=n.children.get(i);e=ne(e),Tf(s,e,t)}}function ya(n,e,t){n.value!==null?t(e,n.value):Vv(n,(i,s)=>{const r=new te(e.toString()+"/"+i);ya(s,r,t)})}function Vv(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&qe(this.last_,(i,s)=>{t[i]=t[i]-s}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qu=10*1e3,Fv=30*1e3,Uv=5*60*1e3;class Bv{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new xv(e);const i=Qu+(Fv-Qu)*Math.random();qi(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;qe(e,(s,r)=>{r>0&&ot(this.statsToReport_,s)&&(t[s]=r,i=!0)}),i&&this.server_.reportStats(t),qi(this.reportStats_.bind(this),Math.floor(Math.random()*2*Uv))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nt;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(nt||(nt={}));function wf(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function al(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function ll(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=nt.ACK_USER_WRITE,this.source=wf()}operationForChild(e){if(H(this.path)){if(this.affectedTree.value!=null)return N(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new te(e));return new Ar(Z(),t,this.revert)}}else return N($(this.path)===e,"operationForChild called for unrelated child."),new Ar(ne(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t){this.source=e,this.path=t,this.type=nt.LISTEN_COMPLETE}operationForChild(e){return H(this.path)?new ss(this.source,Z()):new ss(this.source,ne(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=nt.OVERWRITE}operationForChild(e){return H(this.path)?new hn(this.source,Z(),this.snap.getImmediateChild(e)):new hn(this.source,ne(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=nt.MERGE}operationForChild(e){if(H(this.path)){const t=this.children.subtree(new te(e));return t.isEmpty()?null:t.value?new hn(this.source,Z(),t.value):new rs(this.source,Z(),t)}else return N($(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new rs(this.source,ne(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(H(e))return this.isFullyInitialized()&&!this.filtered_;const t=$(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qv{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function jv(n,e,t,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Dv(o.childName,o.snapshotNode))}),Di(n,s,"child_removed",e,i,t),Di(n,s,"child_added",e,i,t),Di(n,s,"child_moved",r,i,t),Di(n,s,"child_changed",e,i,t),Di(n,s,"value",e,i,t),s}function Di(n,e,t,i,s,r){const o=i.filter(l=>l.type===t);o.sort((l,c)=>Wv(n,l,c)),o.forEach(l=>{const c=$v(n,l,r);s.forEach(h=>{h.respondsTo(l.type)&&e.push(h.createEvent(c,n.query_))})})}function $v(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function Wv(n,e,t){if(e.childName==null||t.childName==null)throw ii("Should only compare child_ events.");const i=new W(e.childName,e.snapshotNode),s=new W(t.childName,t.snapshotNode);return n.index_.compare(i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xr(n,e){return{eventCache:n,serverCache:e}}function ji(n,e,t,i){return Xr(new dn(e,t,i),n.serverCache)}function Af(n,e,t,i){return Xr(n.eventCache,new dn(e,t,i))}function va(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function fn(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zo;const Hv=()=>(Zo||(Zo=new lt(ky)),Zo);class re{constructor(e,t=Hv()){this.value=e,this.children=t}static fromObject(e){let t=new re(null);return qe(e,(i,s)=>{t=t.set(new te(i),s)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:Z(),value:this.value};if(H(e))return null;{const i=$(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(ne(e),t);return r!=null?{path:ge(new te(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(H(e))return this;{const t=$(e),i=this.children.get(t);return i!==null?i.subtree(ne(e)):new re(null)}}set(e,t){if(H(e))return new re(t,this.children);{const i=$(e),r=(this.children.get(i)||new re(null)).set(ne(e),t),o=this.children.insert(i,r);return new re(this.value,o)}}remove(e){if(H(e))return this.children.isEmpty()?new re(null):new re(null,this.children);{const t=$(e),i=this.children.get(t);if(i){const s=i.remove(ne(e));let r;return s.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,s),this.value===null&&r.isEmpty()?new re(null):new re(this.value,r)}else return this}}get(e){if(H(e))return this.value;{const t=$(e),i=this.children.get(t);return i?i.get(ne(e)):null}}setTree(e,t){if(H(e))return t;{const i=$(e),r=(this.children.get(i)||new re(null)).setTree(ne(e),t);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new re(this.value,o)}}fold(e){return this.fold_(Z(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(ge(e,s),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,Z(),t)}findOnPath_(e,t,i){const s=this.value?i(t,this.value):!1;if(s)return s;if(H(e))return null;{const r=$(e),o=this.children.get(r);return o?o.findOnPath_(ne(e),ge(t,r),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,Z(),t)}foreachOnPath_(e,t,i){if(H(e))return this;{this.value&&i(t,this.value);const s=$(e),r=this.children.get(s);return r?r.foreachOnPath_(ne(e),ge(t,s),i):new re(null)}}foreach(e){this.foreach_(Z(),e)}foreach_(e,t){this.children.inorderTraversal((i,s)=>{s.foreach_(ge(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.writeTree_=e}static empty(){return new st(new re(null))}}function $i(n,e,t){if(H(e))return new st(new re(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=Ue(s,e);return r=r.updateChild(o,t),new st(n.writeTree_.set(s,r))}else{const s=new re(t),r=n.writeTree_.setTree(e,s);return new st(r)}}}function Yu(n,e,t){let i=n;return qe(t,(s,r)=>{i=$i(i,ge(e,s),r)}),i}function Xu(n,e){if(H(e))return st.empty();{const t=n.writeTree_.setTree(e,new re(null));return new st(t)}}function Ea(n,e){return Tn(n,e)!=null}function Tn(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(Ue(t.path,e)):null}function Ju(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(ae,(i,s)=>{e.push(new W(i,s))}):n.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new W(i,s.value))}),e}function Bt(n,e){if(H(e))return n;{const t=Tn(n,e);return t!=null?new st(new re(t)):new st(n.writeTree_.subtree(e))}}function Ia(n){return n.writeTree_.isEmpty()}function Kn(n,e){return Cf(Z(),n.writeTree_,e)}function Cf(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(N(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):t=Cf(ge(n,s),r,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(ge(n,".priority"),i)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cl(n,e){return bf(e,n)}function zv(n,e,t,i,s){N(i>n.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:s}),s&&(n.visibleWrites=$i(n.visibleWrites,e,t)),n.lastWriteId=i}function Gv(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function Kv(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);N(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let s=i.visible,r=!1,o=n.allWrites.length-1;for(;s&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&Qv(l,i.path)?s=!1:tt(i.path,l.path)&&(r=!0)),o--}if(s){if(r)return Yv(n),!0;if(i.snap)n.visibleWrites=Xu(n.visibleWrites,i.path);else{const l=i.children;qe(l,c=>{n.visibleWrites=Xu(n.visibleWrites,ge(i.path,c))})}return!0}else return!1}function Qv(n,e){if(n.snap)return tt(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&tt(ge(n.path,t),e))return!0;return!1}function Yv(n){n.visibleWrites=Sf(n.allWrites,Xv,Z()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function Xv(n){return n.visible}function Sf(n,e,t){let i=st.empty();for(let s=0;s<n.length;++s){const r=n[s];if(e(r)){const o=r.path;let l;if(r.snap)tt(t,o)?(l=Ue(t,o),i=$i(i,l,r.snap)):tt(o,t)&&(l=Ue(o,t),i=$i(i,Z(),r.snap.getChild(l)));else if(r.children){if(tt(t,o))l=Ue(t,o),i=Yu(i,l,r.children);else if(tt(o,t))if(l=Ue(o,t),H(l))i=Yu(i,Z(),r.children);else{const c=ln(r.children,$(l));if(c){const h=c.getChild(ne(l));i=$i(i,Z(),h)}}}else throw ii("WriteRecord should have .snap or .children")}}return i}function Rf(n,e,t,i,s){if(!i&&!s){const r=Tn(n.visibleWrites,e);if(r!=null)return r;{const o=Bt(n.visibleWrites,e);if(Ia(o))return t;if(t==null&&!Ea(o,Z()))return null;{const l=t||x.EMPTY_NODE;return Kn(o,l)}}}else{const r=Bt(n.visibleWrites,e);if(!s&&Ia(r))return t;if(!s&&t==null&&!Ea(r,Z()))return null;{const o=function(h){return(h.visible||s)&&(!i||!~i.indexOf(h.writeId))&&(tt(h.path,e)||tt(e,h.path))},l=Sf(n.allWrites,o,e),c=t||x.EMPTY_NODE;return Kn(l,c)}}}function Jv(n,e,t){let i=x.EMPTY_NODE;const s=Tn(n.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(ae,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(t){const r=Bt(n.visibleWrites,e);return t.forEachChild(ae,(o,l)=>{const c=Kn(Bt(r,new te(o)),l);i=i.updateImmediateChild(o,c)}),Ju(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=Bt(n.visibleWrites,e);return Ju(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function Zv(n,e,t,i,s){N(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=ge(e,t);if(Ea(n.visibleWrites,r))return null;{const o=Bt(n.visibleWrites,r);return Ia(o)?s.getChild(t):Kn(o,s.getChild(t))}}function eE(n,e,t,i){const s=ge(e,t),r=Tn(n.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(t)){const o=Bt(n.visibleWrites,s);return Kn(o,i.getNode().getImmediateChild(t))}else return null}function tE(n,e){return Tn(n.visibleWrites,e)}function nE(n,e,t,i,s,r,o){let l;const c=Bt(n.visibleWrites,e),h=Tn(c,Z());if(h!=null)l=h;else if(t!=null)l=Kn(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const f=[],g=o.getCompare(),_=r?l.getReverseIteratorFrom(i,o):l.getIteratorFrom(i,o);let A=_.getNext();for(;A&&f.length<s;)g(A,i)!==0&&f.push(A),A=_.getNext();return f}else return[]}function iE(){return{visibleWrites:st.empty(),allWrites:[],lastWriteId:-1}}function Cr(n,e,t,i){return Rf(n.writeTree,n.treePath,e,t,i)}function ul(n,e){return Jv(n.writeTree,n.treePath,e)}function Zu(n,e,t,i){return Zv(n.writeTree,n.treePath,e,t,i)}function Sr(n,e){return tE(n.writeTree,ge(n.treePath,e))}function sE(n,e,t,i,s,r){return nE(n.writeTree,n.treePath,e,t,i,s,r)}function hl(n,e,t){return eE(n.writeTree,n.treePath,e,t)}function Pf(n,e){return bf(ge(n.treePath,e),n.writeTree)}function bf(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;N(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),N(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(i,ns(i,e.snapshotNode,s.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(i,ts(i,s.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(i,Gn(i,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(i,ns(i,e.snapshotNode,s.oldSnap));else throw ii("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const kf=new oE;class dl{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new dn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return hl(this.writes_,e,i)}}getChildAfterChild(e,t,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:fn(this.viewCache_),r=sE(this.writes_,s,t,1,i,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aE(n){return{filter:n}}function lE(n,e){N(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),N(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function cE(n,e,t,i,s){const r=new rE;let o,l;if(t.type===nt.OVERWRITE){const h=t;h.source.fromUser?o=Ta(n,e,h.path,h.snap,i,s,r):(N(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered()&&!H(h.path),o=Rr(n,e,h.path,h.snap,i,s,l,r))}else if(t.type===nt.MERGE){const h=t;h.source.fromUser?o=hE(n,e,h.path,h.children,i,s,r):(N(h.source.fromServer,"Unknown source."),l=h.source.tagged||e.serverCache.isFiltered(),o=wa(n,e,h.path,h.children,i,s,l,r))}else if(t.type===nt.ACK_USER_WRITE){const h=t;h.revert?o=pE(n,e,h.path,i,s,r):o=dE(n,e,h.path,h.affectedTree,i,s,r)}else if(t.type===nt.LISTEN_COMPLETE)o=fE(n,e,t.path,i,r);else throw ii("Unknown operation type: "+t.type);const c=r.getChanges();return uE(e,o,c),{viewCache:o,changes:c}}function uE(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=va(n);(t.length>0||!n.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&t.push(If(va(e)))}}function Nf(n,e,t,i,s,r){const o=e.eventCache;if(Sr(i,t)!=null)return e;{let l,c;if(H(t))if(N(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const h=fn(e),f=h instanceof x?h:x.EMPTY_NODE,g=ul(i,f);l=n.filter.updateFullNode(e.eventCache.getNode(),g,r)}else{const h=Cr(i,fn(e));l=n.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const h=$(t);if(h===".priority"){N($t(t)===1,"Can't have a priority with additional path components");const f=o.getNode();c=e.serverCache.getNode();const g=Zu(i,t,f,c);g!=null?l=n.filter.updatePriority(f,g):l=o.getNode()}else{const f=ne(t);let g;if(o.isCompleteForChild(h)){c=e.serverCache.getNode();const _=Zu(i,t,o.getNode(),c);_!=null?g=o.getNode().getImmediateChild(h).updateChild(f,_):g=o.getNode().getImmediateChild(h)}else g=hl(i,h,e.serverCache);g!=null?l=n.filter.updateChild(o.getNode(),h,g,f,s,r):l=o.getNode()}}return ji(e,l,o.isFullyInitialized()||H(t),n.filter.filtersNodes())}}function Rr(n,e,t,i,s,r,o,l){const c=e.serverCache;let h;const f=o?n.filter:n.filter.getIndexedFilter();if(H(t))h=f.updateFullNode(c.getNode(),i,null);else if(f.filtersNodes()&&!c.isFiltered()){const A=c.getNode().updateChild(t,i);h=f.updateFullNode(c.getNode(),A,null)}else{const A=$(t);if(!c.isCompleteForPath(t)&&$t(t)>1)return e;const R=ne(t),k=c.getNode().getImmediateChild(A).updateChild(R,i);A===".priority"?h=f.updatePriority(c.getNode(),k):h=f.updateChild(c.getNode(),A,k,R,kf,null)}const g=Af(e,h,c.isFullyInitialized()||H(t),f.filtersNodes()),_=new dl(s,g,r);return Nf(n,g,t,s,_,l)}function Ta(n,e,t,i,s,r,o){const l=e.eventCache;let c,h;const f=new dl(s,e,r);if(H(t))h=n.filter.updateFullNode(e.eventCache.getNode(),i,o),c=ji(e,h,!0,n.filter.filtersNodes());else{const g=$(t);if(g===".priority")h=n.filter.updatePriority(e.eventCache.getNode(),i),c=ji(e,h,l.isFullyInitialized(),l.isFiltered());else{const _=ne(t),A=l.getNode().getImmediateChild(g);let R;if(H(_))R=i;else{const O=f.getCompleteChild(g);O!=null?df(_)===".priority"&&O.getChild(pf(_)).isEmpty()?R=O:R=O.updateChild(_,i):R=x.EMPTY_NODE}if(A.equals(R))c=e;else{const O=n.filter.updateChild(l.getNode(),g,R,_,f,o);c=ji(e,O,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function eh(n,e){return n.eventCache.isCompleteForChild(e)}function hE(n,e,t,i,s,r,o){let l=e;return i.foreach((c,h)=>{const f=ge(t,c);eh(e,$(f))&&(l=Ta(n,l,f,h,s,r,o))}),i.foreach((c,h)=>{const f=ge(t,c);eh(e,$(f))||(l=Ta(n,l,f,h,s,r,o))}),l}function th(n,e,t){return t.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function wa(n,e,t,i,s,r,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,h;H(t)?h=i:h=new re(null).setTree(t,i);const f=e.serverCache.getNode();return h.children.inorderTraversal((g,_)=>{if(f.hasChild(g)){const A=e.serverCache.getNode().getImmediateChild(g),R=th(n,A,_);c=Rr(n,c,new te(g),R,s,r,o,l)}}),h.children.inorderTraversal((g,_)=>{const A=!e.serverCache.isCompleteForChild(g)&&_.value===null;if(!f.hasChild(g)&&!A){const R=e.serverCache.getNode().getImmediateChild(g),O=th(n,R,_);c=Rr(n,c,new te(g),O,s,r,o,l)}}),c}function dE(n,e,t,i,s,r,o){if(Sr(s,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(i.value!=null){if(H(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return Rr(n,e,t,c.getNode().getChild(t),s,r,l,o);if(H(t)){let h=new re(null);return c.getNode().forEachChild(Un,(f,g)=>{h=h.set(new te(f),g)}),wa(n,e,t,h,s,r,l,o)}else return e}else{let h=new re(null);return i.foreach((f,g)=>{const _=ge(t,f);c.isCompleteForPath(_)&&(h=h.set(f,c.getNode().getChild(_)))}),wa(n,e,t,h,s,r,l,o)}}function fE(n,e,t,i,s){const r=e.serverCache,o=Af(e,r.getNode(),r.isFullyInitialized()||H(t),r.isFiltered());return Nf(n,o,t,i,kf,s)}function pE(n,e,t,i,s,r){let o;if(Sr(i,t)!=null)return e;{const l=new dl(i,e,s),c=e.eventCache.getNode();let h;if(H(t)||$(t)===".priority"){let f;if(e.serverCache.isFullyInitialized())f=Cr(i,fn(e));else{const g=e.serverCache.getNode();N(g instanceof x,"serverChildren would be complete if leaf node"),f=ul(i,g)}f=f,h=n.filter.updateFullNode(c,f,r)}else{const f=$(t);let g=hl(i,f,e.serverCache);g==null&&e.serverCache.isCompleteForChild(f)&&(g=c.getImmediateChild(f)),g!=null?h=n.filter.updateChild(c,f,g,ne(t),l,r):e.eventCache.getNode().hasChild(f)?h=n.filter.updateChild(c,f,x.EMPTY_NODE,ne(t),l,r):h=c,h.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Cr(i,fn(e)),o.isLeafNode()&&(h=n.filter.updateFullNode(h,o,r)))}return o=e.serverCache.isFullyInitialized()||Sr(i,Z())!=null,ji(e,h,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gE{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new rl(i.getIndex()),r=Mv(i);this.processor_=aE(r);const o=t.serverCache,l=t.eventCache,c=s.updateFullNode(x.EMPTY_NODE,o.getNode(),null),h=r.updateFullNode(x.EMPTY_NODE,l.getNode(),null),f=new dn(c,o.isFullyInitialized(),s.filtersNodes()),g=new dn(h,l.isFullyInitialized(),r.filtersNodes());this.viewCache_=Xr(g,f),this.eventGenerator_=new qv(this.query_)}get query(){return this.query_}}function _E(n){return n.viewCache_.serverCache.getNode()}function mE(n,e){const t=fn(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!H(e)&&!t.getImmediateChild($(e)).isEmpty())?t.getChild(e):null}function nh(n){return n.eventRegistrations_.length===0}function yE(n,e){n.eventRegistrations_.push(e)}function ih(n,e,t){const i=[];if(t){N(e==null,"A cancel should cancel all event registrations.");const s=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=s}else n.eventRegistrations_=[];return i}function sh(n,e,t,i){e.type===nt.MERGE&&e.source.queryId!==null&&(N(fn(n.viewCache_),"We should always have a full cache before handling merges"),N(va(n.viewCache_),"Missing event cache, even though we have a server cache"));const s=n.viewCache_,r=cE(n.processor_,s,e,t,i);return lE(n.processor_,r.viewCache),N(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Df(n,r.changes,r.viewCache.eventCache.getNode(),null)}function vE(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(ae,(r,o)=>{i.push(Gn(r,o))}),t.isFullyInitialized()&&i.push(If(t.getNode())),Df(n,i,t.getNode(),e)}function Df(n,e,t,i){const s=i?[i]:n.eventRegistrations_;return jv(n.eventGenerator_,e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pr;class EE{constructor(){this.views=new Map}}function IE(n){N(!Pr,"__referenceConstructor has already been defined"),Pr=n}function TE(){return N(Pr,"Reference.ts has not been loaded"),Pr}function wE(n){return n.views.size===0}function fl(n,e,t,i){const s=e.source.queryId;if(s!==null){const r=n.views.get(s);return N(r!=null,"SyncTree gave us an op for an invalid query."),sh(r,e,t,i)}else{let r=[];for(const o of n.views.values())r=r.concat(sh(o,e,t,i));return r}}function AE(n,e,t,i,s){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let l=Cr(t,s?i:null),c=!1;l?c=!0:i instanceof x?(l=ul(t,i),c=!1):(l=x.EMPTY_NODE,c=!1);const h=Xr(new dn(l,c,!1),new dn(i,s,!1));return new gE(e,h)}return o}function CE(n,e,t,i,s,r){const o=AE(n,e,i,s,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),yE(o,t),vE(o,t)}function SE(n,e,t,i){const s=e._queryIdentifier,r=[];let o=[];const l=Wt(n);if(s==="default")for(const[c,h]of n.views.entries())o=o.concat(ih(h,t,i)),nh(h)&&(n.views.delete(c),h.query._queryParams.loadsAllData()||r.push(h.query));else{const c=n.views.get(s);c&&(o=o.concat(ih(c,t,i)),nh(c)&&(n.views.delete(s),c.query._queryParams.loadsAllData()||r.push(c.query)))}return l&&!Wt(n)&&r.push(new(TE())(e._repo,e._path)),{removed:r,events:o}}function Of(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Bn(n,e){let t=null;for(const i of n.views.values())t=t||mE(i,e);return t}function Mf(n,e){if(e._queryParams.loadsAllData())return Jr(n);{const i=e._queryIdentifier;return n.views.get(i)}}function Lf(n,e){return Mf(n,e)!=null}function Wt(n){return Jr(n)!=null}function Jr(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let br;function RE(n){N(!br,"__referenceConstructor has already been defined"),br=n}function PE(){return N(br,"Reference.ts has not been loaded"),br}let bE=1;class rh{constructor(e){this.listenProvider_=e,this.syncPointTree_=new re(null),this.pendingWriteTree_=iE(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Vf(n,e,t,i,s){return zv(n.pendingWriteTree_,e,t,i,s),s?ws(n,new hn(wf(),e,t)):[]}function xn(n,e,t=!1){const i=Gv(n.pendingWriteTree_,e);if(Kv(n.pendingWriteTree_,e)){let r=new re(null);return i.snap!=null?r=r.set(Z(),!0):qe(i.children,o=>{r=r.set(new te(o),!0)}),ws(n,new Ar(i.path,r,t))}else return[]}function Zr(n,e,t){return ws(n,new hn(al(),e,t))}function kE(n,e,t){const i=re.fromObject(t);return ws(n,new rs(al(),e,i))}function NE(n,e){return ws(n,new ss(al(),e))}function DE(n,e,t){const i=gl(n,t);if(i){const s=_l(i),r=s.path,o=s.queryId,l=Ue(r,e),c=new ss(ll(o),l);return ml(n,r,c)}else return[]}function Aa(n,e,t,i,s=!1){const r=e._path,o=n.syncPointTree_.get(r);let l=[];if(o&&(e._queryIdentifier==="default"||Lf(o,e))){const c=SE(o,e,t,i);wE(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const h=c.removed;if(l=c.events,!s){const f=h.findIndex(_=>_._queryParams.loadsAllData())!==-1,g=n.syncPointTree_.findOnPath(r,(_,A)=>Wt(A));if(f&&!g){const _=n.syncPointTree_.subtree(r);if(!_.isEmpty()){const A=LE(_);for(let R=0;R<A.length;++R){const O=A[R],k=O.query,j=Uf(n,O);n.listenProvider_.startListening(Wi(k),kr(n,k),j.hashFn,j.onComplete)}}}!g&&h.length>0&&!i&&(f?n.listenProvider_.stopListening(Wi(e),null):h.forEach(_=>{const A=n.queryToTagMap.get(eo(_));n.listenProvider_.stopListening(Wi(_),A)}))}VE(n,h)}return l}function OE(n,e,t,i){const s=gl(n,i);if(s!=null){const r=_l(s),o=r.path,l=r.queryId,c=Ue(o,e),h=new hn(ll(l),c,t);return ml(n,o,h)}else return[]}function ME(n,e,t,i){const s=gl(n,i);if(s){const r=_l(s),o=r.path,l=r.queryId,c=Ue(o,e),h=re.fromObject(t),f=new rs(ll(l),c,h);return ml(n,o,f)}else return[]}function oh(n,e,t,i=!1){const s=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(s,(_,A)=>{const R=Ue(_,s);r=r||Bn(A,R),o=o||Wt(A)});let l=n.syncPointTree_.get(s);l?(o=o||Wt(l),r=r||Bn(l,Z())):(l=new EE,n.syncPointTree_=n.syncPointTree_.set(s,l));let c;r!=null?c=!0:(c=!1,r=x.EMPTY_NODE,n.syncPointTree_.subtree(s).foreachChild((A,R)=>{const O=Bn(R,Z());O&&(r=r.updateImmediateChild(A,O))}));const h=Lf(l,e);if(!h&&!e._queryParams.loadsAllData()){const _=eo(e);N(!n.queryToTagMap.has(_),"View does not exist, but we have a tag");const A=xE();n.queryToTagMap.set(_,A),n.tagToQueryMap.set(A,_)}const f=cl(n.pendingWriteTree_,s);let g=CE(l,e,t,f,r,c);if(!h&&!o&&!i){const _=Mf(l,e);g=g.concat(FE(n,e,_))}return g}function pl(n,e,t){const s=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=Ue(o,e),h=Bn(l,c);if(h)return h});return Rf(s,e,r,t,!0)}function ws(n,e){return xf(e,n.syncPointTree_,null,cl(n.pendingWriteTree_,Z()))}function xf(n,e,t,i){if(H(n.path))return Ff(n,e,t,i);{const s=e.get(Z());t==null&&s!=null&&(t=Bn(s,Z()));let r=[];const o=$(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const h=t?t.getImmediateChild(o):null,f=Pf(i,o);r=r.concat(xf(l,c,h,f))}return s&&(r=r.concat(fl(s,n,i,t))),r}}function Ff(n,e,t,i){const s=e.get(Z());t==null&&s!=null&&(t=Bn(s,Z()));let r=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,h=Pf(i,o),f=n.operationForChild(o);f&&(r=r.concat(Ff(f,l,c,h)))}),s&&(r=r.concat(fl(s,n,i,t))),r}function Uf(n,e){const t=e.query,i=kr(n,t);return{hashFn:()=>(_E(e)||x.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?DE(n,t._path,i):NE(n,t._path);{const r=Oy(s,t);return Aa(n,t,null,r)}}}}function kr(n,e){const t=eo(e);return n.queryToTagMap.get(t)}function eo(n){return n._path.toString()+"$"+n._queryIdentifier}function gl(n,e){return n.tagToQueryMap.get(e)}function _l(n){const e=n.indexOf("$");return N(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new te(n.substr(0,e))}}function ml(n,e,t){const i=n.syncPointTree_.get(e);N(i,"Missing sync point for query tag that we're tracking");const s=cl(n.pendingWriteTree_,e);return fl(i,t,s,null)}function LE(n){return n.fold((e,t,i)=>{if(t&&Wt(t))return[Jr(t)];{let s=[];return t&&(s=Of(t)),qe(i,(r,o)=>{s=s.concat(o)}),s}})}function Wi(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(PE())(n._repo,n._path):n}function VE(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const s=eo(i),r=n.queryToTagMap.get(s);n.queryToTagMap.delete(s),n.tagToQueryMap.delete(r)}}}function xE(){return bE++}function FE(n,e,t){const i=e._path,s=kr(n,e),r=Uf(n,t),o=n.listenProvider_.startListening(Wi(e),s,r.hashFn,r.onComplete),l=n.syncPointTree_.subtree(i);if(s)N(!Wt(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((h,f,g)=>{if(!H(h)&&f&&Wt(f))return[Jr(f).query];{let _=[];return f&&(_=_.concat(Of(f).map(A=>A.query))),qe(g,(A,R)=>{_=_.concat(R)}),_}});for(let h=0;h<c.length;++h){const f=c[h];n.listenProvider_.stopListening(Wi(f),kr(n,f))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new yl(t)}node(){return this.node_}}class vl{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=ge(this.path_,e);return new vl(this.syncTree_,t)}node(){return pl(this.syncTree_,this.path_)}}const UE=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},ah=function(n,e,t){if(!n||typeof n!="object")return n;if(N(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return BE(n[".sv"],e,t);if(typeof n[".sv"]=="object")return qE(n[".sv"],e);N(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},BE=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:N(!1,"Unexpected server value: "+n)}},qE=function(n,e,t){n.hasOwnProperty("increment")||N(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&N(!1,"Unexpected increment value: "+i);const s=e.node();if(N(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},jE=function(n,e,t,i){return El(e,new vl(t,n),i)},Bf=function(n,e,t){return El(n,new yl(e),t)};function El(n,e,t){const i=n.getPriority().val(),s=ah(i,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,l=ah(o.getValue(),e,t);return l!==o.getValue()||s!==o.getPriority().val()?new ye(l,we(s)):n}else{const o=n;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new ye(s))),o.forEachChild(ae,(l,c)=>{const h=El(c,e.getImmediateChild(l),t);h!==c&&(r=r.updateImmediateChild(l,h))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function to(n,e){let t=e instanceof te?e:new te(e),i=n,s=$(t);for(;s!==null;){const r=ln(i.node.children,s)||{children:{},childCount:0};i=new Il(s,i,r),t=ne(t),s=$(t)}return i}function wn(n){return n.node.value}function Tl(n,e){n.node.value=e,Ca(n)}function qf(n){return n.node.childCount>0}function $E(n){return wn(n)===void 0&&!qf(n)}function no(n,e){qe(n.node.children,(t,i)=>{e(new Il(t,n,i))})}function jf(n,e,t,i){t&&!i&&e(n),no(n,s=>{jf(s,e,!0,i)}),t&&i&&e(n)}function WE(n,e,t){let i=n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function As(n){return new te(n.parent===null?n.name:As(n.parent)+"/"+n.name)}function Ca(n){n.parent!==null&&HE(n.parent,n.name,n)}function HE(n,e,t){const i=$E(t),s=ot(n.node.children,e);i&&s?(delete n.node.children[e],n.node.childCount--,Ca(n)):!i&&!s&&(n.node.children[e]=t.node,n.node.childCount++,Ca(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zE=/[\[\].#$\/\u0000-\u001F\u007F]/,GE=/[\[\].#$\u0000-\u001F\u007F]/,ea=10*1024*1024,$f=function(n){return typeof n=="string"&&n.length!==0&&!zE.test(n)},Wf=function(n){return typeof n=="string"&&n.length!==0&&!GE.test(n)},KE=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Wf(n)},QE=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Xa(n)||n&&typeof n=="object"&&ot(n,".sv")},wl=function(n,e,t){const i=t instanceof te?new dv(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+tn(i));if(typeof e=="function")throw new Error(n+"contains a function "+tn(i)+" with contents = "+e.toString());if(Xa(e))throw new Error(n+"contains "+e.toString()+" "+tn(i));if(typeof e=="string"&&e.length>ea/3&&Qr(e)>ea)throw new Error(n+"contains a string greater than "+ea+" utf8 bytes "+tn(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(qe(e,(o,l)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!$f(o)))throw new Error(n+" contains an invalid key ("+o+") "+tn(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);fv(i,o),wl(n,l,i),pv(i)}),s&&r)throw new Error(n+' contains ".value" child '+tn(i)+" in addition to actual children.")}},Hf=function(n,e,t,i){if(!Wf(t))throw new Error(xd(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},YE=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Hf(n,e,t)},XE=function(n,e){if($(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},JE=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!$f(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!KE(t))throw new Error(xd(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZE{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function zf(n,e){let t=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();t!==null&&!nl(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(s)}t&&n.eventLists_.push(t)}function Gf(n,e,t){zf(n,t),Kf(n,i=>nl(i,e))}function Kt(n,e,t){zf(n,t),Kf(n,i=>tt(i,e)||tt(e,i))}function Kf(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const s=n.eventLists_[i];if(s){const r=s.path;e(r)?(eI(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function eI(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();Bi&&Oe("event: "+t.toString()),Is(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tI="repo_interrupt",nI=25;class iI{constructor(e,t,i,s){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new ZE,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=wr(),this.transactionQueueTree_=new Il,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function sI(n,e,t){if(n.stats_=el(n.repoInfo_),n.forceRestClient_||xy())n.server_=new Tr(n.repoInfo_,(i,s,r,o)=>{lh(n,i,s,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>ch(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Ee(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new It(n.repoInfo_,e,(i,s,r,o)=>{lh(n,i,s,r,o)},i=>{ch(n,i)},i=>{oI(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=jy(n.repoInfo_,()=>new Bv(n.stats_,n.server_)),n.infoData_=new Lv,n.infoSyncTree_=new rh({startListening:(i,s,r,o)=>{let l=[];const c=n.infoData_.getNode(i._path);return c.isEmpty()||(l=Zr(n.infoSyncTree_,i._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),Cl(n,"connected",!1),n.serverSyncTree_=new rh({startListening:(i,s,r,o)=>(n.server_.listen(i,r,s,(l,c)=>{const h=o(l,c);Kt(n.eventQueue_,i._path,h)}),[]),stopListening:(i,s)=>{n.server_.unlisten(i,s)}})}function rI(n){const t=n.infoData_.getNode(new te(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Al(n){return UE({timestamp:rI(n)})}function lh(n,e,t,i,s){n.dataUpdateCount++;const r=new te(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(s)if(i){const c=mr(t,h=>we(h));o=ME(n.serverSyncTree_,r,c,s)}else{const c=we(t);o=OE(n.serverSyncTree_,r,c,s)}else if(i){const c=mr(t,h=>we(h));o=kE(n.serverSyncTree_,r,c)}else{const c=we(t);o=Zr(n.serverSyncTree_,r,c)}let l=r;o.length>0&&(l=Pl(n,r)),Kt(n.eventQueue_,l,o)}function ch(n,e){Cl(n,"connected",e),e===!1&&aI(n)}function oI(n,e){qe(e,(t,i)=>{Cl(n,t,i)})}function Cl(n,e,t){const i=new te("/.info/"+e),s=we(t);n.infoData_.updateSnapshot(i,s);const r=Zr(n.infoSyncTree_,i,s);Kt(n.eventQueue_,i,r)}function Qf(n){return n.nextWriteId_++}function aI(n){Sl(n,"onDisconnectEvents");const e=Al(n),t=wr();ya(n.onDisconnect_,Z(),(s,r)=>{const o=jE(s,r,n.serverSyncTree_,e);Tf(t,s,o)});let i=[];ya(t,Z(),(s,r)=>{i=i.concat(Zr(n.serverSyncTree_,s,r));const o=pI(n,s);Pl(n,o)}),n.onDisconnect_=wr(),Kt(n.eventQueue_,Z(),i)}function lI(n,e,t){let i;$(e._path)===".info"?i=oh(n.infoSyncTree_,e,t):i=oh(n.serverSyncTree_,e,t),Gf(n.eventQueue_,e._path,i)}function cI(n,e,t){let i;$(e._path)===".info"?i=Aa(n.infoSyncTree_,e,t):i=Aa(n.serverSyncTree_,e,t),Gf(n.eventQueue_,e._path,i)}function uI(n){n.persistentConnection_&&n.persistentConnection_.interrupt(tI)}function Sl(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Oe(t,...e)}function hI(n,e,t,i,s,r){Sl(n,"transaction on "+e);const o={path:e,update:t,onComplete:i,status:null,order:$d(),applyLocally:r,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},l=Rl(n,e,void 0);o.currentInputSnapshot=l;const c=o.update(l.val());if(c===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{wl("transaction failed: Data returned ",c,o.path),o.status=0;const h=to(n.transactionQueueTree_,e),f=wn(h)||[];f.push(o),Tl(h,f);let g;typeof c=="object"&&c!==null&&ot(c,".priority")?(g=ln(c,".priority"),N(QE(g),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):g=(pl(n.serverSyncTree_,e)||x.EMPTY_NODE).getPriority().val();const _=Al(n),A=we(c,g),R=Bf(A,l,_);o.currentOutputSnapshotRaw=A,o.currentOutputSnapshotResolved=R,o.currentWriteId=Qf(n);const O=Vf(n.serverSyncTree_,e,R,o.currentWriteId,o.applyLocally);Kt(n.eventQueue_,e,O),io(n,n.transactionQueueTree_)}}function Rl(n,e,t){return pl(n.serverSyncTree_,e,t)||x.EMPTY_NODE}function io(n,e=n.transactionQueueTree_){if(e||so(n,e),wn(e)){const t=Xf(n,e);N(t.length>0,"Sending zero length transaction queue"),t.every(s=>s.status===0)&&dI(n,As(e),t)}else qf(e)&&no(e,t=>{io(n,t)})}function dI(n,e,t){const i=t.map(h=>h.currentWriteId),s=Rl(n,e,i);let r=s;const o=s.hash();for(let h=0;h<t.length;h++){const f=t[h];N(f.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),f.status=1,f.retryCount++;const g=Ue(e,f.path);r=r.updateChild(g,f.currentOutputSnapshotRaw)}const l=r.val(!0),c=e;n.server_.put(c.toString(),l,h=>{Sl(n,"transaction put response",{path:c.toString(),status:h});let f=[];if(h==="ok"){const g=[];for(let _=0;_<t.length;_++)t[_].status=2,f=f.concat(xn(n.serverSyncTree_,t[_].currentWriteId)),t[_].onComplete&&g.push(()=>t[_].onComplete(null,!0,t[_].currentOutputSnapshotResolved)),t[_].unwatcher();so(n,to(n.transactionQueueTree_,e)),io(n,n.transactionQueueTree_),Kt(n.eventQueue_,e,f);for(let _=0;_<g.length;_++)Is(g[_])}else{if(h==="datastale")for(let g=0;g<t.length;g++)t[g].status===3?t[g].status=4:t[g].status=0;else{We("transaction at "+c.toString()+" failed: "+h);for(let g=0;g<t.length;g++)t[g].status=4,t[g].abortReason=h}Pl(n,e)}},o)}function Pl(n,e){const t=Yf(n,e),i=As(t),s=Xf(n,t);return fI(n,s,i),i}function fI(n,e,t){if(e.length===0)return;const i=[];let s=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],h=Ue(t,c.path);let f=!1,g;if(N(h!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)f=!0,g=c.abortReason,s=s.concat(xn(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=nI)f=!0,g="maxretry",s=s.concat(xn(n.serverSyncTree_,c.currentWriteId,!0));else{const _=Rl(n,c.path,o);c.currentInputSnapshot=_;const A=e[l].update(_.val());if(A!==void 0){wl("transaction failed: Data returned ",A,c.path);let R=we(A);typeof A=="object"&&A!=null&&ot(A,".priority")||(R=R.updatePriority(_.getPriority()));const k=c.currentWriteId,j=Al(n),z=Bf(R,_,j);c.currentOutputSnapshotRaw=R,c.currentOutputSnapshotResolved=z,c.currentWriteId=Qf(n),o.splice(o.indexOf(k),1),s=s.concat(Vf(n.serverSyncTree_,c.path,z,c.currentWriteId,c.applyLocally)),s=s.concat(xn(n.serverSyncTree_,k,!0))}else f=!0,g="nodata",s=s.concat(xn(n.serverSyncTree_,c.currentWriteId,!0))}Kt(n.eventQueue_,t,s),s=[],f&&(e[l].status=2,function(_){setTimeout(_,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(g==="nodata"?i.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):i.push(()=>e[l].onComplete(new Error(g),!1,null))))}so(n,n.transactionQueueTree_);for(let l=0;l<i.length;l++)Is(i[l]);io(n,n.transactionQueueTree_)}function Yf(n,e){let t,i=n.transactionQueueTree_;for(t=$(e);t!==null&&wn(i)===void 0;)i=to(i,t),e=ne(e),t=$(e);return i}function Xf(n,e){const t=[];return Jf(n,e,t),t.sort((i,s)=>i.order-s.order),t}function Jf(n,e,t){const i=wn(e);if(i)for(let s=0;s<i.length;s++)t.push(i[s]);no(e,s=>{Jf(n,s,t)})}function so(n,e){const t=wn(e);if(t){let i=0;for(let s=0;s<t.length;s++)t[s].status!==2&&(t[i]=t[s],i++);t.length=i,Tl(e,t.length>0?t:void 0)}no(e,i=>{so(n,i)})}function pI(n,e){const t=As(Yf(n,e)),i=to(n.transactionQueueTree_,e);return WE(i,s=>{ta(n,s)}),ta(n,i),jf(i,s=>{ta(n,s)}),t}function ta(n,e){const t=wn(e);if(t){const i=[];let s=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(N(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(N(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),s=s.concat(xn(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Tl(e,void 0):t.length=r+1,Kt(n.eventQueue_,As(e),s);for(let o=0;o<i.length;o++)Is(i[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gI(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let s=t[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function _I(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):We(`Invalid query segment '${t}' in query '${n}'`)}return e}const uh=function(n,e){const t=mI(n),i=t.namespace;t.domain==="firebase.com"&&wt(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&wt("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Py();const s=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new nf(t.host,t.secure,i,s,e,"",i!==t.subdomain),path:new te(t.pathString)}},mI=function(n){let e="",t="",i="",s="",r="",o=!0,l="https",c=443;if(typeof n=="string"){let h=n.indexOf("//");h>=0&&(l=n.substring(0,h-1),n=n.substring(h+2));let f=n.indexOf("/");f===-1&&(f=n.length);let g=n.indexOf("?");g===-1&&(g=n.length),e=n.substring(0,Math.min(f,g)),f<g&&(s=gI(n.substring(f,g)));const _=_I(n.substring(Math.min(n.length,g)));h=e.indexOf(":"),h>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(h+1),10)):h=e.length;const A=e.slice(0,h);if(A.toLowerCase()==="localhost")t="localhost";else if(A.split(".").length<=2)t=A;else{const R=e.indexOf(".");i=e.substring(0,R).toLowerCase(),t=e.substring(R+1),r=i}"ns"in _&&(r=_.ns)}return{host:e,port:c,domain:t,subdomain:i,secure:o,scheme:l,pathString:s,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yI{constructor(e,t,i,s){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Ee(this.snapshot.exportVal())}}class vI{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EI{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return N(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class bl{constructor(e,t,i,s){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=s}get key(){return H(this._path)?null:df(this._path)}get ref(){return new Pt(this._repo,this._path)}get _queryIdentifier(){const e=Ku(this._queryParams),t=Ja(e);return t==="{}"?"default":t}get _queryObject(){return Ku(this._queryParams)}isEqual(e){if(e=he(e),!(e instanceof bl))return!1;const t=this._repo===e._repo,i=nl(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return t&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+hv(this._path)}}class Pt extends bl{constructor(e,t){super(e,t,new ol,!1)}get parent(){const e=pf(this._path);return e===null?null:new Pt(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class os{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new te(e),i=Sa(this.ref,e);return new os(this._node.getChild(t),i,ae)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new os(s,Sa(this.ref,i),ae)))}hasChild(e){const t=new te(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function L0(n,e){return n=he(n),n._checkNotDeleted("ref"),Sa(n._root,e)}function Sa(n,e){return n=he(n),$(n._path)===null?YE("child","path",e):Hf("child","path",e),new Pt(n._repo,ge(n._path,e))}class kl{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new yI("value",this,new os(e.snapshotNode,new Pt(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new vI(this,e,t):null}matches(e){return e instanceof kl?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function II(n,e,t,i,s){const r=new EI(t,void 0),o=new kl(r);return lI(n._repo,n,o),()=>cI(n._repo,n,o)}function TI(n,e,t,i){return II(n,"value",e)}IE(Pt);RE(Pt);/**
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
 */const wI="FIREBASE_DATABASE_EMULATOR_HOST",Ra={};let AI=!1;function CI(n,e,t,i){n.repoInfo_=new nf(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),i&&(n.authTokenProvider_=i)}function SI(n,e,t,i,s){let r=i||n.options.databaseURL;r===void 0&&(n.options.projectId||wt("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Oe("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=uh(r,s),l=o.repoInfo,c;typeof process<"u"&&ku&&(c=ku[wI]),c?(r=`http://${c}?ns=${l.namespace}`,o=uh(r,s),l=o.repoInfo):o.repoInfo.secure;const h=new Uy(n.name,n.options,e);JE("Invalid Firebase Database URL",o),H(o.path)||wt("Database URL must point to the root of a Firebase Database (not including a child path).");const f=PI(l,n,h,new Fy(n.name,t));return new bI(f,n)}function RI(n,e){const t=Ra[e];(!t||t[n.key]!==n)&&wt(`Database ${e}(${n.repoInfo_}) has already been deleted.`),uI(n),delete t[n.key]}function PI(n,e,t,i){let s=Ra[e.name];s||(s={},Ra[e.name]=s);let r=s[n.toURLString()];return r&&wt("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new iI(n,AI,t,i),s[n.toURLString()]=r,r}class bI{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(sI(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Pt(this._repo,Z())),this._rootInternal}_delete(){return this._rootInternal!==null&&(RI(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&wt("Cannot call "+e+" on a deleted database.")}}function V0(n=ys(),e){const t=Rt(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=Qa("database");i&&kI(t,...i)}return t}function kI(n,e,t,i={}){n=he(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&wt("Cannot call useEmulator() after instance has already been initialized.");const s=n._repoInternal;let r;if(s.repoInfo_.nodeAdmin)i.mockUserToken&&wt('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new rr(rr.OWNER);else if(i.mockUserToken){const o=typeof i.mockUserToken=="string"?i.mockUserToken:kd(i.mockUserToken,n.app.options.projectId);r=new rr(o)}CI(s,e,t,r)}/**
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
 */function NI(n){wy(In),Ye(new ze("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return SI(i,s,r,t)},"PUBLIC").setMultipleInstances(!0)),Fe(Nu,Du,n),Fe(Nu,Du,"esm2017")}/**
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
 */class DI{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function x0(n,e,t){var i;if(n=he(n),XE("Reference.transaction",n._path),n.key===".length"||n.key===".keys")throw"Reference.transaction failed: "+n.key+" is a read-only object.";const s=(i=void 0)!==null&&i!==void 0?i:!0,r=new Kr,o=(c,h,f)=>{let g=null;c?r.reject(c):(g=new os(f,new Pt(n._repo,n._path),ae),r.resolve(new DI(h,g)))},l=TI(n,()=>{});return hI(n._repo,n._path,e,o,l,s),r.promise}It.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};It.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};NI();const Zf="@firebase/installations",Nl="0.6.7";/**
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
 */const ep=1e4,tp=`w:${Nl}`,np="FIS_v2",OI="https://firebaseinstallations.googleapis.com/v1",MI=60*60*1e3,LI="installations",VI="Installations";/**
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
 */const xI={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},pn=new En(LI,VI,xI);function ip(n){return n instanceof Je&&n.code.includes("request-failed")}/**
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
 */function sp({projectId:n}){return`${OI}/projects/${n}/installations`}function rp(n){return{token:n.token,requestStatus:2,expiresIn:UI(n.expiresIn),creationTime:Date.now()}}async function op(n,e){const i=(await e.json()).error;return pn.create("request-failed",{requestName:n,serverCode:i.code,serverMessage:i.message,serverStatus:i.status})}function ap({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function FI(n,{refreshToken:e}){const t=ap(n);return t.append("Authorization",BI(e)),t}async function lp(n){const e=await n();return e.status>=500&&e.status<600?n():e}function UI(n){return Number(n.replace("s","000"))}function BI(n){return`${np} ${n}`}/**
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
 */async function qI({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const i=sp(n),s=ap(n),r=e.getImmediate({optional:!0});if(r){const h=await r.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={fid:t,authVersion:np,appId:n.appId,sdkVersion:tp},l={method:"POST",headers:s,body:JSON.stringify(o)},c=await lp(()=>fetch(i,l));if(c.ok){const h=await c.json();return{fid:h.fid||t,registrationStatus:2,refreshToken:h.refreshToken,authToken:rp(h.authToken)}}else throw await op("Create Installation",c)}/**
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
 */function cp(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */function jI(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const $I=/^[cdef][\w-]{21}$/,Pa="";function WI(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=HI(n);return $I.test(t)?t:Pa}catch{return Pa}}function HI(n){return jI(n).substr(0,22)}/**
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
 */function ro(n){return`${n.appName}!${n.appId}`}/**
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
 */const up=new Map;function hp(n,e){const t=ro(n);dp(t,e),zI(t,e)}function dp(n,e){const t=up.get(n);if(t)for(const i of t)i(e)}function zI(n,e){const t=GI();t&&t.postMessage({key:n,fid:e}),KI()}let sn=null;function GI(){return!sn&&"BroadcastChannel"in self&&(sn=new BroadcastChannel("[Firebase] FID Change"),sn.onmessage=n=>{dp(n.data.key,n.data.fid)}),sn}function KI(){up.size===0&&sn&&(sn.close(),sn=null)}/**
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
 */const QI="firebase-installations-database",YI=1,gn="firebase-installations-store";let na=null;function Dl(){return na||(na=Td(QI,YI,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(gn)}}})),na}async function Nr(n,e){const t=ro(n),s=(await Dl()).transaction(gn,"readwrite"),r=s.objectStore(gn),o=await r.get(t);return await r.put(e,t),await s.done,(!o||o.fid!==e.fid)&&hp(n,e.fid),e}async function fp(n){const e=ro(n),i=(await Dl()).transaction(gn,"readwrite");await i.objectStore(gn).delete(e),await i.done}async function oo(n,e){const t=ro(n),s=(await Dl()).transaction(gn,"readwrite"),r=s.objectStore(gn),o=await r.get(t),l=e(o);return l===void 0?await r.delete(t):await r.put(l,t),await s.done,l&&(!o||o.fid!==l.fid)&&hp(n,l.fid),l}/**
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
 */async function Ol(n){let e;const t=await oo(n.appConfig,i=>{const s=XI(i),r=JI(n,s);return e=r.registrationPromise,r.installationEntry});return t.fid===Pa?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function XI(n){const e=n||{fid:WI(),registrationStatus:0};return pp(e)}function JI(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(pn.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},i=ZI(n,t);return{installationEntry:t,registrationPromise:i}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:eT(n)}:{installationEntry:e}}async function ZI(n,e){try{const t=await qI(n,e);return Nr(n.appConfig,t)}catch(t){throw ip(t)&&t.customData.serverCode===409?await fp(n.appConfig):await Nr(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function eT(n){let e=await hh(n.appConfig);for(;e.registrationStatus===1;)await cp(100),e=await hh(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:i}=await Ol(n);return i||t}return e}function hh(n){return oo(n,e=>{if(!e)throw pn.create("installation-not-found");return pp(e)})}function pp(n){return tT(n)?{fid:n.fid,registrationStatus:0}:n}function tT(n){return n.registrationStatus===1&&n.registrationTime+ep<Date.now()}/**
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
 */async function nT({appConfig:n,heartbeatServiceProvider:e},t){const i=iT(n,t),s=FI(n,t),r=e.getImmediate({optional:!0});if(r){const h=await r.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={installation:{sdkVersion:tp,appId:n.appId}},l={method:"POST",headers:s,body:JSON.stringify(o)},c=await lp(()=>fetch(i,l));if(c.ok){const h=await c.json();return rp(h)}else throw await op("Generate Auth Token",c)}function iT(n,{fid:e}){return`${sp(n)}/${e}/authTokens:generate`}/**
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
 */async function Ml(n,e=!1){let t;const i=await oo(n.appConfig,r=>{if(!gp(r))throw pn.create("not-registered");const o=r.authToken;if(!e&&oT(o))return r;if(o.requestStatus===1)return t=sT(n,e),r;{if(!navigator.onLine)throw pn.create("app-offline");const l=lT(r);return t=rT(n,l),l}});return t?await t:i.authToken}async function sT(n,e){let t=await dh(n.appConfig);for(;t.authToken.requestStatus===1;)await cp(100),t=await dh(n.appConfig);const i=t.authToken;return i.requestStatus===0?Ml(n,e):i}function dh(n){return oo(n,e=>{if(!gp(e))throw pn.create("not-registered");const t=e.authToken;return cT(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function rT(n,e){try{const t=await nT(n,e),i=Object.assign(Object.assign({},e),{authToken:t});return await Nr(n.appConfig,i),t}catch(t){if(ip(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await fp(n.appConfig);else{const i=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Nr(n.appConfig,i)}throw t}}function gp(n){return n!==void 0&&n.registrationStatus===2}function oT(n){return n.requestStatus===2&&!aT(n)}function aT(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+MI}function lT(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function cT(n){return n.requestStatus===1&&n.requestTime+ep<Date.now()}/**
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
 */async function uT(n){const e=n,{installationEntry:t,registrationPromise:i}=await Ol(e);return i?i.catch(console.error):Ml(e).catch(console.error),t.fid}/**
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
 */async function hT(n,e=!1){const t=n;return await dT(t),(await Ml(t,e)).token}async function dT(n){const{registrationPromise:e}=await Ol(n);e&&await e}/**
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
 */function fT(n){if(!n||!n.options)throw ia("App Configuration");if(!n.name)throw ia("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw ia(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function ia(n){return pn.create("missing-app-config-values",{valueName:n})}/**
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
 */const _p="installations",pT="installations-internal",gT=n=>{const e=n.getProvider("app").getImmediate(),t=fT(e),i=Rt(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:i,_delete:()=>Promise.resolve()}},_T=n=>{const e=n.getProvider("app").getImmediate(),t=Rt(e,_p).getImmediate();return{getId:()=>uT(t),getToken:s=>hT(t,s)}};function mT(){Ye(new ze(_p,gT,"PUBLIC")),Ye(new ze(pT,_T,"PRIVATE"))}mT();Fe(Zf,Nl);Fe(Zf,Nl,"esm2017");/**
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
 */const Dr="analytics",yT="firebase_id",vT="origin",ET=60*1e3,IT="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ll="https://www.googletagmanager.com/gtag/js";/**
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
 */const Be=new ms("@firebase/analytics");/**
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
 */const TT={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},He=new En("analytics","Analytics",TT);/**
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
 */function wT(n){if(!n.startsWith(Ll)){const e=He.create("invalid-gtag-resource",{gtagURL:n});return Be.warn(e.message),""}return n}function mp(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function AT(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function CT(n,e){const t=AT("firebase-js-sdk-policy",{createScriptURL:wT}),i=document.createElement("script"),s=`${Ll}?l=${n}&id=${e}`;i.src=t?t==null?void 0:t.createScriptURL(s):s,i.async=!0,document.head.appendChild(i)}function ST(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function RT(n,e,t,i,s,r){const o=i[s];try{if(o)await e[o];else{const c=(await mp(t)).find(h=>h.measurementId===s);c&&await e[c.appId]}}catch(l){Be.error(l)}n("config",s,r)}async function PT(n,e,t,i,s){try{let r=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const l=await mp(t);for(const c of o){const h=l.find(g=>g.measurementId===c),f=h&&e[h.appId];if(f)r.push(f);else{r=[];break}}}r.length===0&&(r=Object.values(e)),await Promise.all(r),n("event",i,s||{})}catch(r){Be.error(r)}}function bT(n,e,t,i){async function s(r,...o){try{if(r==="event"){const[l,c]=o;await PT(n,e,t,l,c)}else if(r==="config"){const[l,c]=o;await RT(n,e,t,i,l,c)}else if(r==="consent"){const[l,c]=o;n("consent",l,c)}else if(r==="get"){const[l,c,h]=o;n("get",l,c,h)}else if(r==="set"){const[l]=o;n("set",l)}else n(r,...o)}catch(l){Be.error(l)}}return s}function kT(n,e,t,i,s){let r=function(...o){window[i].push(arguments)};return window[s]&&typeof window[s]=="function"&&(r=window[s]),window[s]=bT(r,n,e,t),{gtagCore:r,wrappedGtag:window[s]}}function NT(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Ll)&&t.src.includes(n))return t;return null}/**
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
 */const DT=30,OT=1e3;class MT{constructor(e={},t=OT){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const yp=new MT;function LT(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function VT(n){var e;const{appId:t,apiKey:i}=n,s={method:"GET",headers:LT(i)},r=IT.replace("{app-id}",t),o=await fetch(r,s);if(o.status!==200&&o.status!==304){let l="";try{const c=await o.json();!((e=c.error)===null||e===void 0)&&e.message&&(l=c.error.message)}catch{}throw He.create("config-fetch-failed",{httpStatus:o.status,responseMessage:l})}return o.json()}async function xT(n,e=yp,t){const{appId:i,apiKey:s,measurementId:r}=n.options;if(!i)throw He.create("no-app-id");if(!s){if(r)return{measurementId:r,appId:i};throw He.create("no-api-key")}const o=e.getThrottleMetadata(i)||{backoffCount:0,throttleEndTimeMillis:Date.now()},l=new BT;return setTimeout(async()=>{l.abort()},ET),vp({appId:i,apiKey:s,measurementId:r},o,l,e)}async function vp(n,{throttleEndTimeMillis:e,backoffCount:t},i,s=yp){var r;const{appId:o,measurementId:l}=n;try{await FT(i,e)}catch(c){if(l)return Be.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:l};throw c}try{const c=await VT(n);return s.deleteThrottleMetadata(o),c}catch(c){const h=c;if(!UT(h)){if(s.deleteThrottleMetadata(o),l)return Be.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:o,measurementId:l};throw c}const f=Number((r=h==null?void 0:h.customData)===null||r===void 0?void 0:r.httpStatus)===503?Au(t,s.intervalMillis,DT):Au(t,s.intervalMillis),g={throttleEndTimeMillis:Date.now()+f,backoffCount:t+1};return s.setThrottleMetadata(o,g),Be.debug(`Calling attemptFetch again in ${f} millis`),vp(n,g,i,s)}}function FT(n,e){return new Promise((t,i)=>{const s=Math.max(e-Date.now(),0),r=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(r),i(He.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function UT(n){if(!(n instanceof Je)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class BT{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function qT(n,e,t,i,s){if(s&&s.global){n("event",t,i);return}else{const r=await e,o=Object.assign(Object.assign({},i),{send_to:r});n("event",t,o)}}/**
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
 */async function jT(){if(Md())try{await Ld()}catch(n){return Be.warn(He.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Be.warn(He.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function $T(n,e,t,i,s,r,o){var l;const c=xT(n);c.then(A=>{t[A.measurementId]=A.appId,n.options.measurementId&&A.measurementId!==n.options.measurementId&&Be.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${A.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(A=>Be.error(A)),e.push(c);const h=jT().then(A=>{if(A)return i.getId()}),[f,g]=await Promise.all([c,h]);NT(r)||CT(r,f.measurementId),s("js",new Date);const _=(l=o==null?void 0:o.config)!==null&&l!==void 0?l:{};return _[vT]="firebase",_.update=!0,g!=null&&(_[yT]=g),s("config",f.measurementId,_),f.measurementId}/**
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
 */class WT{constructor(e){this.app=e}_delete(){return delete Hi[this.app.options.appId],Promise.resolve()}}let Hi={},fh=[];const ph={};let sa="dataLayer",HT="gtag",gh,Ep,_h=!1;function zT(){const n=[];if(Nd()&&n.push("This is a browser extension environment."),hm()||n.push("Cookies are not available."),n.length>0){const e=n.map((i,s)=>`(${s+1}) ${i}`).join(" "),t=He.create("invalid-analytics-context",{errorInfo:e});Be.warn(t.message)}}function GT(n,e,t){zT();const i=n.options.appId;if(!i)throw He.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Be.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw He.create("no-api-key");if(Hi[i]!=null)throw He.create("already-exists",{id:i});if(!_h){ST(sa);const{wrappedGtag:r,gtagCore:o}=kT(Hi,fh,ph,sa,HT);Ep=r,gh=o,_h=!0}return Hi[i]=$T(n,fh,ph,e,gh,sa,t),new WT(n)}function F0(n=ys()){n=he(n);const e=Rt(n,Dr);return e.isInitialized()?e.getImmediate():KT(n)}function KT(n,e={}){const t=Rt(n,Dr);if(t.isInitialized()){const s=t.getImmediate();if(Ji(e,t.getOptions()))return s;throw He.create("already-initialized")}return t.initialize({options:e})}function QT(n,e,t,i){n=he(n),qT(Ep,Hi[n.app.options.appId],e,t,i).catch(s=>Be.error(s))}const mh="@firebase/analytics",yh="0.10.4";function YT(){Ye(new ze(Dr,(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return GT(i,s,t)},"PUBLIC")),Ye(new ze("analytics-internal",n,"PRIVATE")),Fe(mh,yh),Fe(mh,yh,"esm2017");function n(e){try{const t=e.getProvider(Dr).getImmediate();return{logEvent:(i,s,r)=>QT(t,i,s,r)}}catch(t){throw He.create("interop-component-reg-failed",{reason:t})}}}YT();var vh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var an,Ip;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,m){function v(){}v.prototype=m.prototype,I.D=m.prototype,I.prototype=new v,I.prototype.constructor=I,I.C=function(E,T,C){for(var y=Array(arguments.length-2),pt=2;pt<arguments.length;pt++)y[pt-2]=arguments[pt];return m.prototype[T].apply(E,y)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,t),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,m,v){v||(v=0);var E=Array(16);if(typeof m=="string")for(var T=0;16>T;++T)E[T]=m.charCodeAt(v++)|m.charCodeAt(v++)<<8|m.charCodeAt(v++)<<16|m.charCodeAt(v++)<<24;else for(T=0;16>T;++T)E[T]=m[v++]|m[v++]<<8|m[v++]<<16|m[v++]<<24;m=I.g[0],v=I.g[1],T=I.g[2];var C=I.g[3],y=m+(C^v&(T^C))+E[0]+3614090360&4294967295;m=v+(y<<7&4294967295|y>>>25),y=C+(T^m&(v^T))+E[1]+3905402710&4294967295,C=m+(y<<12&4294967295|y>>>20),y=T+(v^C&(m^v))+E[2]+606105819&4294967295,T=C+(y<<17&4294967295|y>>>15),y=v+(m^T&(C^m))+E[3]+3250441966&4294967295,v=T+(y<<22&4294967295|y>>>10),y=m+(C^v&(T^C))+E[4]+4118548399&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(T^m&(v^T))+E[5]+1200080426&4294967295,C=m+(y<<12&4294967295|y>>>20),y=T+(v^C&(m^v))+E[6]+2821735955&4294967295,T=C+(y<<17&4294967295|y>>>15),y=v+(m^T&(C^m))+E[7]+4249261313&4294967295,v=T+(y<<22&4294967295|y>>>10),y=m+(C^v&(T^C))+E[8]+1770035416&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(T^m&(v^T))+E[9]+2336552879&4294967295,C=m+(y<<12&4294967295|y>>>20),y=T+(v^C&(m^v))+E[10]+4294925233&4294967295,T=C+(y<<17&4294967295|y>>>15),y=v+(m^T&(C^m))+E[11]+2304563134&4294967295,v=T+(y<<22&4294967295|y>>>10),y=m+(C^v&(T^C))+E[12]+1804603682&4294967295,m=v+(y<<7&4294967295|y>>>25),y=C+(T^m&(v^T))+E[13]+4254626195&4294967295,C=m+(y<<12&4294967295|y>>>20),y=T+(v^C&(m^v))+E[14]+2792965006&4294967295,T=C+(y<<17&4294967295|y>>>15),y=v+(m^T&(C^m))+E[15]+1236535329&4294967295,v=T+(y<<22&4294967295|y>>>10),y=m+(T^C&(v^T))+E[1]+4129170786&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^T&(m^v))+E[6]+3225465664&4294967295,C=m+(y<<9&4294967295|y>>>23),y=T+(m^v&(C^m))+E[11]+643717713&4294967295,T=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(T^C))+E[0]+3921069994&4294967295,v=T+(y<<20&4294967295|y>>>12),y=m+(T^C&(v^T))+E[5]+3593408605&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^T&(m^v))+E[10]+38016083&4294967295,C=m+(y<<9&4294967295|y>>>23),y=T+(m^v&(C^m))+E[15]+3634488961&4294967295,T=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(T^C))+E[4]+3889429448&4294967295,v=T+(y<<20&4294967295|y>>>12),y=m+(T^C&(v^T))+E[9]+568446438&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^T&(m^v))+E[14]+3275163606&4294967295,C=m+(y<<9&4294967295|y>>>23),y=T+(m^v&(C^m))+E[3]+4107603335&4294967295,T=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(T^C))+E[8]+1163531501&4294967295,v=T+(y<<20&4294967295|y>>>12),y=m+(T^C&(v^T))+E[13]+2850285829&4294967295,m=v+(y<<5&4294967295|y>>>27),y=C+(v^T&(m^v))+E[2]+4243563512&4294967295,C=m+(y<<9&4294967295|y>>>23),y=T+(m^v&(C^m))+E[7]+1735328473&4294967295,T=C+(y<<14&4294967295|y>>>18),y=v+(C^m&(T^C))+E[12]+2368359562&4294967295,v=T+(y<<20&4294967295|y>>>12),y=m+(v^T^C)+E[5]+4294588738&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^T)+E[8]+2272392833&4294967295,C=m+(y<<11&4294967295|y>>>21),y=T+(C^m^v)+E[11]+1839030562&4294967295,T=C+(y<<16&4294967295|y>>>16),y=v+(T^C^m)+E[14]+4259657740&4294967295,v=T+(y<<23&4294967295|y>>>9),y=m+(v^T^C)+E[1]+2763975236&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^T)+E[4]+1272893353&4294967295,C=m+(y<<11&4294967295|y>>>21),y=T+(C^m^v)+E[7]+4139469664&4294967295,T=C+(y<<16&4294967295|y>>>16),y=v+(T^C^m)+E[10]+3200236656&4294967295,v=T+(y<<23&4294967295|y>>>9),y=m+(v^T^C)+E[13]+681279174&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^T)+E[0]+3936430074&4294967295,C=m+(y<<11&4294967295|y>>>21),y=T+(C^m^v)+E[3]+3572445317&4294967295,T=C+(y<<16&4294967295|y>>>16),y=v+(T^C^m)+E[6]+76029189&4294967295,v=T+(y<<23&4294967295|y>>>9),y=m+(v^T^C)+E[9]+3654602809&4294967295,m=v+(y<<4&4294967295|y>>>28),y=C+(m^v^T)+E[12]+3873151461&4294967295,C=m+(y<<11&4294967295|y>>>21),y=T+(C^m^v)+E[15]+530742520&4294967295,T=C+(y<<16&4294967295|y>>>16),y=v+(T^C^m)+E[2]+3299628645&4294967295,v=T+(y<<23&4294967295|y>>>9),y=m+(T^(v|~C))+E[0]+4096336452&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~T))+E[7]+1126891415&4294967295,C=m+(y<<10&4294967295|y>>>22),y=T+(m^(C|~v))+E[14]+2878612391&4294967295,T=C+(y<<15&4294967295|y>>>17),y=v+(C^(T|~m))+E[5]+4237533241&4294967295,v=T+(y<<21&4294967295|y>>>11),y=m+(T^(v|~C))+E[12]+1700485571&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~T))+E[3]+2399980690&4294967295,C=m+(y<<10&4294967295|y>>>22),y=T+(m^(C|~v))+E[10]+4293915773&4294967295,T=C+(y<<15&4294967295|y>>>17),y=v+(C^(T|~m))+E[1]+2240044497&4294967295,v=T+(y<<21&4294967295|y>>>11),y=m+(T^(v|~C))+E[8]+1873313359&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~T))+E[15]+4264355552&4294967295,C=m+(y<<10&4294967295|y>>>22),y=T+(m^(C|~v))+E[6]+2734768916&4294967295,T=C+(y<<15&4294967295|y>>>17),y=v+(C^(T|~m))+E[13]+1309151649&4294967295,v=T+(y<<21&4294967295|y>>>11),y=m+(T^(v|~C))+E[4]+4149444226&4294967295,m=v+(y<<6&4294967295|y>>>26),y=C+(v^(m|~T))+E[11]+3174756917&4294967295,C=m+(y<<10&4294967295|y>>>22),y=T+(m^(C|~v))+E[2]+718787259&4294967295,T=C+(y<<15&4294967295|y>>>17),y=v+(C^(T|~m))+E[9]+3951481745&4294967295,I.g[0]=I.g[0]+m&4294967295,I.g[1]=I.g[1]+(T+(y<<21&4294967295|y>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+C&4294967295}i.prototype.u=function(I,m){m===void 0&&(m=I.length);for(var v=m-this.blockSize,E=this.B,T=this.h,C=0;C<m;){if(T==0)for(;C<=v;)s(this,I,C),C+=this.blockSize;if(typeof I=="string"){for(;C<m;)if(E[T++]=I.charCodeAt(C++),T==this.blockSize){s(this,E),T=0;break}}else for(;C<m;)if(E[T++]=I[C++],T==this.blockSize){s(this,E),T=0;break}}this.h=T,this.o+=m},i.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var m=1;m<I.length-8;++m)I[m]=0;var v=8*this.o;for(m=I.length-8;m<I.length;++m)I[m]=v&255,v/=256;for(this.u(I),I=Array(16),m=v=0;4>m;++m)for(var E=0;32>E;E+=8)I[v++]=this.g[m]>>>E&255;return I};function r(I,m){var v=l;return Object.prototype.hasOwnProperty.call(v,I)?v[I]:v[I]=m(I)}function o(I,m){this.h=m;for(var v=[],E=!0,T=I.length-1;0<=T;T--){var C=I[T]|0;E&&C==m||(v[T]=C,E=!1)}this.g=v}var l={};function c(I){return-128<=I&&128>I?r(I,function(m){return new o([m|0],0>m?-1:0)}):new o([I|0],0>I?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return g;if(0>I)return k(h(-I));for(var m=[],v=1,E=0;I>=v;E++)m[E]=I/v|0,v*=4294967296;return new o(m,0)}function f(I,m){if(I.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(I.charAt(0)=="-")return k(f(I.substring(1),m));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=h(Math.pow(m,8)),E=g,T=0;T<I.length;T+=8){var C=Math.min(8,I.length-T),y=parseInt(I.substring(T,T+C),m);8>C?(C=h(Math.pow(m,C)),E=E.j(C).add(h(y))):(E=E.j(v),E=E.add(h(y)))}return E}var g=c(0),_=c(1),A=c(16777216);n=o.prototype,n.m=function(){if(O(this))return-k(this).m();for(var I=0,m=1,v=0;v<this.g.length;v++){var E=this.i(v);I+=(0<=E?E:4294967296+E)*m,m*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(R(this))return"0";if(O(this))return"-"+k(this).toString(I);for(var m=h(Math.pow(I,6)),v=this,E="";;){var T=oe(v,m).g;v=j(v,T.j(m));var C=((0<v.g.length?v.g[0]:v.h)>>>0).toString(I);if(v=T,R(v))return C+E;for(;6>C.length;)C="0"+C;E=C+E}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function R(I){if(I.h!=0)return!1;for(var m=0;m<I.g.length;m++)if(I.g[m]!=0)return!1;return!0}function O(I){return I.h==-1}n.l=function(I){return I=j(this,I),O(I)?-1:R(I)?0:1};function k(I){for(var m=I.g.length,v=[],E=0;E<m;E++)v[E]=~I.g[E];return new o(v,~I.h).add(_)}n.abs=function(){return O(this)?k(this):this},n.add=function(I){for(var m=Math.max(this.g.length,I.g.length),v=[],E=0,T=0;T<=m;T++){var C=E+(this.i(T)&65535)+(I.i(T)&65535),y=(C>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);E=y>>>16,C&=65535,y&=65535,v[T]=y<<16|C}return new o(v,v[v.length-1]&-2147483648?-1:0)};function j(I,m){return I.add(k(m))}n.j=function(I){if(R(this)||R(I))return g;if(O(this))return O(I)?k(this).j(k(I)):k(k(this).j(I));if(O(I))return k(this.j(k(I)));if(0>this.l(A)&&0>I.l(A))return h(this.m()*I.m());for(var m=this.g.length+I.g.length,v=[],E=0;E<2*m;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var T=0;T<I.g.length;T++){var C=this.i(E)>>>16,y=this.i(E)&65535,pt=I.i(T)>>>16,hi=I.i(T)&65535;v[2*E+2*T]+=y*hi,z(v,2*E+2*T),v[2*E+2*T+1]+=C*hi,z(v,2*E+2*T+1),v[2*E+2*T+1]+=y*pt,z(v,2*E+2*T+1),v[2*E+2*T+2]+=C*pt,z(v,2*E+2*T+2)}for(E=0;E<m;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=m;E<2*m;E++)v[E]=0;return new o(v,0)};function z(I,m){for(;(I[m]&65535)!=I[m];)I[m+1]+=I[m]>>>16,I[m]&=65535,m++}function Q(I,m){this.g=I,this.h=m}function oe(I,m){if(R(m))throw Error("division by zero");if(R(I))return new Q(g,g);if(O(I))return m=oe(k(I),m),new Q(k(m.g),k(m.h));if(O(m))return m=oe(I,k(m)),new Q(k(m.g),m.h);if(30<I.g.length){if(O(I)||O(m))throw Error("slowDivide_ only works with positive integers.");for(var v=_,E=m;0>=E.l(I);)v=Ge(v),E=Ge(E);var T=de(v,1),C=de(E,1);for(E=de(E,2),v=de(v,2);!R(E);){var y=C.add(E);0>=y.l(I)&&(T=T.add(v),C=y),E=de(E,1),v=de(v,1)}return m=j(I,T.j(m)),new Q(T,m)}for(T=g;0<=I.l(m);){for(v=Math.max(1,Math.floor(I.m()/m.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),C=h(v),y=C.j(m);O(y)||0<y.l(I);)v-=E,C=h(v),y=C.j(m);R(C)&&(C=_),T=T.add(C),I=j(I,y)}return new Q(T,I)}n.A=function(I){return oe(this,I).h},n.and=function(I){for(var m=Math.max(this.g.length,I.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)&I.i(E);return new o(v,this.h&I.h)},n.or=function(I){for(var m=Math.max(this.g.length,I.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)|I.i(E);return new o(v,this.h|I.h)},n.xor=function(I){for(var m=Math.max(this.g.length,I.g.length),v=[],E=0;E<m;E++)v[E]=this.i(E)^I.i(E);return new o(v,this.h^I.h)};function Ge(I){for(var m=I.g.length+1,v=[],E=0;E<m;E++)v[E]=I.i(E)<<1|I.i(E-1)>>>31;return new o(v,I.h)}function de(I,m){var v=m>>5;m%=32;for(var E=I.g.length-v,T=[],C=0;C<E;C++)T[C]=0<m?I.i(C+v)>>>m|I.i(C+v+1)<<32-m:I.i(C+v);return new o(T,I.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,Ip=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,an=o}).apply(typeof vh<"u"?vh:typeof self<"u"?self:typeof window<"u"?window:{});var er=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Tp,wp,xi,Ap,ar,ba,Cp,Sp,Rp;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,d){return a==Array.prototype||a==Object.prototype||(a[u]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof er=="object"&&er];for(var u=0;u<a.length;++u){var d=a[u];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var i=t(this);function s(a,u){if(u)e:{var d=i;a=a.split(".");for(var p=0;p<a.length-1;p++){var w=a[p];if(!(w in d))break e;d=d[w]}a=a[a.length-1],p=d[a],u=u(p),u!=p&&u!=null&&e(d,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var d=0,p=!1,w={next:function(){if(!p&&d<a.length){var S=d++;return{value:u(S,a[S]),done:!1}}return p=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(a){return a||function(){return r(this,function(u,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function h(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function f(a,u,d){return a.call.apply(a.bind,arguments)}function g(a,u,d){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,p),a.apply(u,w)}}return function(){return a.apply(u,arguments)}}function _(a,u,d){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:g,_.apply(null,arguments)}function A(a,u){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function R(a,u){function d(){}d.prototype=u.prototype,a.aa=u.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(p,w,S){for(var D=Array(arguments.length-2),ee=2;ee<arguments.length;ee++)D[ee-2]=arguments[ee];return u.prototype[w].apply(p,D)}}function O(a){const u=a.length;if(0<u){const d=Array(u);for(let p=0;p<u;p++)d[p]=a[p];return d}return[]}function k(a,u){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(c(p)){const w=a.length||0,S=p.length||0;a.length=w+S;for(let D=0;D<S;D++)a[w+D]=p[D]}else a.push(p)}}class j{constructor(u,d){this.i=u,this.j=d,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function z(a){return/^[\s\xa0]*$/.test(a)}function Q(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function oe(a){return oe[" "](a),a}oe[" "]=function(){};var Ge=Q().indexOf("Gecko")!=-1&&!(Q().toLowerCase().indexOf("webkit")!=-1&&Q().indexOf("Edge")==-1)&&!(Q().indexOf("Trident")!=-1||Q().indexOf("MSIE")!=-1)&&Q().indexOf("Edge")==-1;function de(a,u,d){for(const p in a)u.call(d,a[p],p,a)}function I(a,u){for(const d in a)u.call(void 0,a[d],d,a)}function m(a){const u={};for(const d in a)u[d]=a[d];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(a,u){let d,p;for(let w=1;w<arguments.length;w++){p=arguments[w];for(d in p)a[d]=p[d];for(let S=0;S<v.length;S++)d=v[S],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function T(a){var u=1;a=a.split(":");const d=[];for(;0<u&&a.length;)d.push(a.shift()),u--;return a.length&&d.push(a.join(":")),d}function C(a){l.setTimeout(()=>{throw a},0)}function y(){var a=wo;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class pt{constructor(){this.h=this.g=null}add(u,d){const p=hi.get();p.set(u,d),this.h?this.h.next=p:this.g=p,this.h=p}}var hi=new j(()=>new v_,a=>a.reset());class v_{constructor(){this.next=this.g=this.h=null}set(u,d){this.h=u,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let di,fi=!1,wo=new pt,Tc=()=>{const a=l.Promise.resolve(void 0);di=()=>{a.then(E_)}};var E_=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){C(d)}var u=hi;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}fi=!1};function bt(){this.s=this.s,this.C=this.C}bt.prototype.s=!1,bt.prototype.ma=function(){this.s||(this.s=!0,this.N())},bt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Re(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}Re.prototype.h=function(){this.defaultPrevented=!0};var I_=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};l.addEventListener("test",d,u),l.removeEventListener("test",d,u)}catch{}return a}();function pi(a,u){if(Re.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(Ge){e:{try{oe(u.nodeName);var w=!0;break e}catch{}w=!1}w||(u=null)}}else d=="mouseover"?u=a.fromElement:d=="mouseout"&&(u=a.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:T_[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&pi.aa.h.call(this)}}R(pi,Re);var T_={2:"touch",3:"pen",4:"mouse"};pi.prototype.h=function(){pi.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ms="closure_listenable_"+(1e6*Math.random()|0),w_=0;function A_(a,u,d,p,w){this.listener=a,this.proxy=null,this.src=u,this.type=d,this.capture=!!p,this.ha=w,this.key=++w_,this.da=this.fa=!1}function Ls(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Vs(a){this.src=a,this.g={},this.h=0}Vs.prototype.add=function(a,u,d,p,w){var S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);var D=Co(a,u,p,w);return-1<D?(u=a[D],d||(u.fa=!1)):(u=new A_(u,this.src,S,!!p,w),u.fa=d,a.push(u)),u};function Ao(a,u){var d=u.type;if(d in a.g){var p=a.g[d],w=Array.prototype.indexOf.call(p,u,void 0),S;(S=0<=w)&&Array.prototype.splice.call(p,w,1),S&&(Ls(u),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Co(a,u,d,p){for(var w=0;w<a.length;++w){var S=a[w];if(!S.da&&S.listener==u&&S.capture==!!d&&S.ha==p)return w}return-1}var So="closure_lm_"+(1e6*Math.random()|0),Ro={};function wc(a,u,d,p,w){if(Array.isArray(u)){for(var S=0;S<u.length;S++)wc(a,u[S],d,p,w);return null}return d=Sc(d),a&&a[Ms]?a.K(u,d,h(p)?!!p.capture:!!p,w):C_(a,u,d,!1,p,w)}function C_(a,u,d,p,w,S){if(!u)throw Error("Invalid event type");var D=h(w)?!!w.capture:!!w,ee=bo(a);if(ee||(a[So]=ee=new Vs(a)),d=ee.add(u,d,p,D,S),d.proxy)return d;if(p=S_(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)I_||(w=D),w===void 0&&(w=!1),a.addEventListener(u.toString(),p,w);else if(a.attachEvent)a.attachEvent(Cc(u.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function S_(){function a(d){return u.call(a.src,a.listener,d)}const u=R_;return a}function Ac(a,u,d,p,w){if(Array.isArray(u))for(var S=0;S<u.length;S++)Ac(a,u[S],d,p,w);else p=h(p)?!!p.capture:!!p,d=Sc(d),a&&a[Ms]?(a=a.i,u=String(u).toString(),u in a.g&&(S=a.g[u],d=Co(S,d,p,w),-1<d&&(Ls(S[d]),Array.prototype.splice.call(S,d,1),S.length==0&&(delete a.g[u],a.h--)))):a&&(a=bo(a))&&(u=a.g[u.toString()],a=-1,u&&(a=Co(u,d,p,w)),(d=-1<a?u[a]:null)&&Po(d))}function Po(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Ms])Ao(u.i,a);else{var d=a.type,p=a.proxy;u.removeEventListener?u.removeEventListener(d,p,a.capture):u.detachEvent?u.detachEvent(Cc(d),p):u.addListener&&u.removeListener&&u.removeListener(p),(d=bo(u))?(Ao(d,a),d.h==0&&(d.src=null,u[So]=null)):Ls(a)}}}function Cc(a){return a in Ro?Ro[a]:Ro[a]="on"+a}function R_(a,u){if(a.da)a=!0;else{u=new pi(u,this);var d=a.listener,p=a.ha||a.src;a.fa&&Po(a),a=d.call(p,u)}return a}function bo(a){return a=a[So],a instanceof Vs?a:null}var ko="__closure_events_fn_"+(1e9*Math.random()>>>0);function Sc(a){return typeof a=="function"?a:(a[ko]||(a[ko]=function(u){return a.handleEvent(u)}),a[ko])}function Pe(){bt.call(this),this.i=new Vs(this),this.M=this,this.F=null}R(Pe,bt),Pe.prototype[Ms]=!0,Pe.prototype.removeEventListener=function(a,u,d,p){Ac(this,a,u,d,p)};function Ve(a,u){var d,p=a.F;if(p)for(d=[];p;p=p.F)d.push(p);if(a=a.M,p=u.type||u,typeof u=="string")u=new Re(u,a);else if(u instanceof Re)u.target=u.target||a;else{var w=u;u=new Re(p,a),E(u,w)}if(w=!0,d)for(var S=d.length-1;0<=S;S--){var D=u.g=d[S];w=xs(D,p,!0,u)&&w}if(D=u.g=a,w=xs(D,p,!0,u)&&w,w=xs(D,p,!1,u)&&w,d)for(S=0;S<d.length;S++)D=u.g=d[S],w=xs(D,p,!1,u)&&w}Pe.prototype.N=function(){if(Pe.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var d=a.g[u],p=0;p<d.length;p++)Ls(d[p]);delete a.g[u],a.h--}}this.F=null},Pe.prototype.K=function(a,u,d,p){return this.i.add(String(a),u,!1,d,p)},Pe.prototype.L=function(a,u,d,p){return this.i.add(String(a),u,!0,d,p)};function xs(a,u,d,p){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var w=!0,S=0;S<u.length;++S){var D=u[S];if(D&&!D.da&&D.capture==d){var ee=D.listener,Ie=D.ha||D.src;D.fa&&Ao(a.i,D),w=ee.call(Ie,p)!==!1&&w}}return w&&!p.defaultPrevented}function Rc(a,u,d){if(typeof a=="function")d&&(a=_(a,d));else if(a&&typeof a.handleEvent=="function")a=_(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function Pc(a){a.g=Rc(()=>{a.g=null,a.i&&(a.i=!1,Pc(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class P_ extends bt{constructor(u,d){super(),this.m=u,this.l=d,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Pc(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function gi(a){bt.call(this),this.h=a,this.g={}}R(gi,bt);var bc=[];function kc(a){de(a.g,function(u,d){this.g.hasOwnProperty(d)&&Po(u)},a),a.g={}}gi.prototype.N=function(){gi.aa.N.call(this),kc(this)},gi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var No=l.JSON.stringify,b_=l.JSON.parse,k_=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Do(){}Do.prototype.h=null;function Nc(a){return a.h||(a.h=a.i())}function Dc(){}var _i={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Oo(){Re.call(this,"d")}R(Oo,Re);function Mo(){Re.call(this,"c")}R(Mo,Re);var Yt={},Oc=null;function Fs(){return Oc=Oc||new Pe}Yt.La="serverreachability";function Mc(a){Re.call(this,Yt.La,a)}R(Mc,Re);function mi(a){const u=Fs();Ve(u,new Mc(u))}Yt.STAT_EVENT="statevent";function Lc(a,u){Re.call(this,Yt.STAT_EVENT,a),this.stat=u}R(Lc,Re);function xe(a){const u=Fs();Ve(u,new Lc(u,a))}Yt.Ma="timingevent";function Vc(a,u){Re.call(this,Yt.Ma,a),this.size=u}R(Vc,Re);function yi(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function vi(){this.g=!0}vi.prototype.xa=function(){this.g=!1};function N_(a,u,d,p,w,S){a.info(function(){if(a.g)if(S)for(var D="",ee=S.split("&"),Ie=0;Ie<ee.length;Ie++){var X=ee[Ie].split("=");if(1<X.length){var be=X[0];X=X[1];var ke=be.split("_");D=2<=ke.length&&ke[1]=="type"?D+(be+"="+X+"&"):D+(be+"=redacted&")}}else D=null;else D=S;return"XMLHTTP REQ ("+p+") [attempt "+w+"]: "+u+`
`+d+`
`+D})}function D_(a,u,d,p,w,S,D){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+w+"]: "+u+`
`+d+`
`+S+" "+D})}function Pn(a,u,d,p){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+M_(a,d)+(p?" "+p:"")})}function O_(a,u){a.info(function(){return"TIMEOUT: "+u})}vi.prototype.info=function(){};function M_(a,u){if(!a.g)return u;if(!u)return null;try{var d=JSON.parse(u);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var p=d[a];if(!(2>p.length)){var w=p[1];if(Array.isArray(w)&&!(1>w.length)){var S=w[0];if(S!="noop"&&S!="stop"&&S!="close")for(var D=1;D<w.length;D++)w[D]=""}}}}return No(d)}catch{return u}}var Us={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},xc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Lo;function Bs(){}R(Bs,Do),Bs.prototype.g=function(){return new XMLHttpRequest},Bs.prototype.i=function(){return{}},Lo=new Bs;function kt(a,u,d,p){this.j=a,this.i=u,this.l=d,this.R=p||1,this.U=new gi(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Fc}function Fc(){this.i=null,this.g="",this.h=!1}var Uc={},Vo={};function xo(a,u,d){a.L=1,a.v=Ws(gt(u)),a.m=d,a.P=!0,Bc(a,null)}function Bc(a,u){a.F=Date.now(),qs(a),a.A=gt(a.v);var d=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),eu(d.i,"t",p),a.C=0,d=a.j.J,a.h=new Fc,a.g=yu(a.j,d?u:null,!a.m),0<a.O&&(a.M=new P_(_(a.Y,a,a.g),a.O)),u=a.U,d=a.g,p=a.ca;var w="readystatechange";Array.isArray(w)||(w&&(bc[0]=w.toString()),w=bc);for(var S=0;S<w.length;S++){var D=wc(d,w[S],p||u.handleEvent,!1,u.h||u);if(!D)break;u.g[D.key]=D}u=a.H?m(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),mi(),N_(a.i,a.u,a.A,a.l,a.R,a.m)}kt.prototype.ca=function(a){a=a.target;const u=this.M;u&&_t(a)==3?u.j():this.Y(a)},kt.prototype.Y=function(a){try{if(a==this.g)e:{const ke=_t(this.g);var u=this.g.Ba();const Nn=this.g.Z();if(!(3>ke)&&(ke!=3||this.g&&(this.h.h||this.g.oa()||au(this.g)))){this.J||ke!=4||u==7||(u==8||0>=Nn?mi(3):mi(2)),Fo(this);var d=this.g.Z();this.X=d;t:if(qc(this)){var p=au(this.g);a="";var w=p.length,S=_t(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Xt(this),Ei(this);var D="";break t}this.h.i=new l.TextDecoder}for(u=0;u<w;u++)this.h.h=!0,a+=this.h.i.decode(p[u],{stream:!(S&&u==w-1)});p.length=0,this.h.g+=a,this.C=0,D=this.h.g}else D=this.g.oa();if(this.o=d==200,D_(this.i,this.u,this.A,this.l,this.R,ke,d),this.o){if(this.T&&!this.K){t:{if(this.g){var ee,Ie=this.g;if((ee=Ie.g?Ie.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!z(ee)){var X=ee;break t}}X=null}if(d=X)Pn(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Uo(this,d);else{this.o=!1,this.s=3,xe(12),Xt(this),Ei(this);break e}}if(this.P){d=!0;let Ze;for(;!this.J&&this.C<D.length;)if(Ze=L_(this,D),Ze==Vo){ke==4&&(this.s=4,xe(14),d=!1),Pn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ze==Uc){this.s=4,xe(15),Pn(this.i,this.l,D,"[Invalid Chunk]"),d=!1;break}else Pn(this.i,this.l,Ze,null),Uo(this,Ze);if(qc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ke!=4||D.length!=0||this.h.h||(this.s=1,xe(16),d=!1),this.o=this.o&&d,!d)Pn(this.i,this.l,D,"[Invalid Chunked Response]"),Xt(this),Ei(this);else if(0<D.length&&!this.W){this.W=!0;var be=this.j;be.g==this&&be.ba&&!be.M&&(be.j.info("Great, no buffering proxy detected. Bytes received: "+D.length),Ho(be),be.M=!0,xe(11))}}else Pn(this.i,this.l,D,null),Uo(this,D);ke==4&&Xt(this),this.o&&!this.J&&(ke==4?pu(this.j,this):(this.o=!1,qs(this)))}else J_(this.g),d==400&&0<D.indexOf("Unknown SID")?(this.s=3,xe(12)):(this.s=0,xe(13)),Xt(this),Ei(this)}}}catch{}finally{}};function qc(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function L_(a,u){var d=a.C,p=u.indexOf(`
`,d);return p==-1?Vo:(d=Number(u.substring(d,p)),isNaN(d)?Uc:(p+=1,p+d>u.length?Vo:(u=u.slice(p,p+d),a.C=p+d,u)))}kt.prototype.cancel=function(){this.J=!0,Xt(this)};function qs(a){a.S=Date.now()+a.I,jc(a,a.I)}function jc(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=yi(_(a.ba,a),u)}function Fo(a){a.B&&(l.clearTimeout(a.B),a.B=null)}kt.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(O_(this.i,this.A),this.L!=2&&(mi(),xe(17)),Xt(this),this.s=2,Ei(this)):jc(this,this.S-a)};function Ei(a){a.j.G==0||a.J||pu(a.j,a)}function Xt(a){Fo(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,kc(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Uo(a,u){try{var d=a.j;if(d.G!=0&&(d.g==a||Bo(d.h,a))){if(!a.K&&Bo(d.h,a)&&d.G==3){try{var p=d.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var w=p;if(w[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)Qs(d),Gs(d);else break e;Wo(d),xe(18)}}else d.za=w[1],0<d.za-d.T&&37500>w[2]&&d.F&&d.v==0&&!d.C&&(d.C=yi(_(d.Za,d),6e3));if(1>=Hc(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else Zt(d,11)}else if((a.K||d.g==a)&&Qs(d),!z(u))for(w=d.Da.g.parse(u),u=0;u<w.length;u++){let X=w[u];if(d.T=X[0],X=X[1],d.G==2)if(X[0]=="c"){d.K=X[1],d.ia=X[2];const be=X[3];be!=null&&(d.la=be,d.j.info("VER="+d.la));const ke=X[4];ke!=null&&(d.Aa=ke,d.j.info("SVER="+d.Aa));const Nn=X[5];Nn!=null&&typeof Nn=="number"&&0<Nn&&(p=1.5*Nn,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Ze=a.g;if(Ze){const Xs=Ze.g?Ze.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xs){var S=p.h;S.g||Xs.indexOf("spdy")==-1&&Xs.indexOf("quic")==-1&&Xs.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(qo(S,S.h),S.h=null))}if(p.D){const zo=Ze.g?Ze.g.getResponseHeader("X-HTTP-Session-Id"):null;zo&&(p.ya=zo,se(p.I,p.D,zo))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var D=a;if(p.qa=mu(p,p.J?p.ia:null,p.W),D.K){zc(p.h,D);var ee=D,Ie=p.L;Ie&&(ee.I=Ie),ee.B&&(Fo(ee),qs(ee)),p.g=D}else du(p);0<d.i.length&&Ks(d)}else X[0]!="stop"&&X[0]!="close"||Zt(d,7);else d.G==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?Zt(d,7):$o(d):X[0]!="noop"&&d.l&&d.l.ta(X),d.v=0)}}mi(4)}catch{}}var V_=class{constructor(a,u){this.g=a,this.map=u}};function $c(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Wc(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Hc(a){return a.h?1:a.g?a.g.size:0}function Bo(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function qo(a,u){a.g?a.g.add(u):a.h=u}function zc(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}$c.prototype.cancel=function(){if(this.i=Gc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Gc(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const d of a.g.values())u=u.concat(d.D);return u}return O(a.i)}function x_(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],d=a.length,p=0;p<d;p++)u.push(a[p]);return u}u=[],d=0;for(p in a)u[d++]=a[p];return u}function F_(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var d=0;d<a;d++)u.push(d);return u}u=[],d=0;for(const p in a)u[d++]=p;return u}}}function Kc(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var d=F_(a),p=x_(a),w=p.length,S=0;S<w;S++)u.call(void 0,p[S],d&&d[S],a)}var Qc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function U_(a,u){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var p=a[d].indexOf("="),w=null;if(0<=p){var S=a[d].substring(0,p);w=a[d].substring(p+1)}else S=a[d];u(S,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Jt(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Jt){this.h=a.h,js(this,a.j),this.o=a.o,this.g=a.g,$s(this,a.s),this.l=a.l;var u=a.i,d=new wi;d.i=u.i,u.g&&(d.g=new Map(u.g),d.h=u.h),Yc(this,d),this.m=a.m}else a&&(u=String(a).match(Qc))?(this.h=!1,js(this,u[1]||"",!0),this.o=Ii(u[2]||""),this.g=Ii(u[3]||"",!0),$s(this,u[4]),this.l=Ii(u[5]||"",!0),Yc(this,u[6]||"",!0),this.m=Ii(u[7]||"")):(this.h=!1,this.i=new wi(null,this.h))}Jt.prototype.toString=function(){var a=[],u=this.j;u&&a.push(Ti(u,Xc,!0),":");var d=this.g;return(d||u=="file")&&(a.push("//"),(u=this.o)&&a.push(Ti(u,Xc,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Ti(d,d.charAt(0)=="/"?j_:q_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Ti(d,W_)),a.join("")};function gt(a){return new Jt(a)}function js(a,u,d){a.j=d?Ii(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function $s(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function Yc(a,u,d){u instanceof wi?(a.i=u,H_(a.i,a.h)):(d||(u=Ti(u,$_)),a.i=new wi(u,a.h))}function se(a,u,d){a.i.set(u,d)}function Ws(a){return se(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Ii(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Ti(a,u,d){return typeof a=="string"?(a=encodeURI(a).replace(u,B_),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function B_(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Xc=/[#\/\?@]/g,q_=/[#\?:]/g,j_=/[#\?]/g,$_=/[#\?@]/g,W_=/#/g;function wi(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function Nt(a){a.g||(a.g=new Map,a.h=0,a.i&&U_(a.i,function(u,d){a.add(decodeURIComponent(u.replace(/\+/g," ")),d)}))}n=wi.prototype,n.add=function(a,u){Nt(this),this.i=null,a=bn(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(u),this.h+=1,this};function Jc(a,u){Nt(a),u=bn(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Zc(a,u){return Nt(a),u=bn(a,u),a.g.has(u)}n.forEach=function(a,u){Nt(this),this.g.forEach(function(d,p){d.forEach(function(w){a.call(u,w,p,this)},this)},this)},n.na=function(){Nt(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),d=[];for(let p=0;p<u.length;p++){const w=a[p];for(let S=0;S<w.length;S++)d.push(u[p])}return d},n.V=function(a){Nt(this);let u=[];if(typeof a=="string")Zc(this,a)&&(u=u.concat(this.g.get(bn(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)u=u.concat(a[d])}return u},n.set=function(a,u){return Nt(this),this.i=null,a=bn(this,a),Zc(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},n.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function eu(a,u,d){Jc(a,u),0<d.length&&(a.i=null,a.g.set(bn(a,u),O(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var d=0;d<u.length;d++){var p=u[d];const S=encodeURIComponent(String(p)),D=this.V(p);for(p=0;p<D.length;p++){var w=S;D[p]!==""&&(w+="="+encodeURIComponent(String(D[p]))),a.push(w)}}return this.i=a.join("&")};function bn(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function H_(a,u){u&&!a.j&&(Nt(a),a.i=null,a.g.forEach(function(d,p){var w=p.toLowerCase();p!=w&&(Jc(this,p),eu(this,w,d))},a)),a.j=u}function z_(a,u){const d=new vi;if(l.Image){const p=new Image;p.onload=A(Dt,d,"TestLoadImage: loaded",!0,u,p),p.onerror=A(Dt,d,"TestLoadImage: error",!1,u,p),p.onabort=A(Dt,d,"TestLoadImage: abort",!1,u,p),p.ontimeout=A(Dt,d,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else u(!1)}function G_(a,u){const d=new vi,p=new AbortController,w=setTimeout(()=>{p.abort(),Dt(d,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:p.signal}).then(S=>{clearTimeout(w),S.ok?Dt(d,"TestPingServer: ok",!0,u):Dt(d,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(w),Dt(d,"TestPingServer: error",!1,u)})}function Dt(a,u,d,p,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),p(d)}catch{}}function K_(){this.g=new k_}function Q_(a,u,d){const p=d||"";try{Kc(a,function(w,S){let D=w;h(w)&&(D=No(w)),u.push(p+S+"="+encodeURIComponent(D))})}catch(w){throw u.push(p+"type="+encodeURIComponent("_badmap")),w}}function Ai(a){this.l=a.Ub||null,this.j=a.eb||!1}R(Ai,Do),Ai.prototype.g=function(){return new Hs(this.l,this.j)},Ai.prototype.i=function(a){return function(){return a}}({});function Hs(a,u){Pe.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(Hs,Pe),n=Hs.prototype,n.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,Si(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ci(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Si(this)),this.g&&(this.readyState=3,Si(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;tu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function tu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?Ci(this):Si(this),this.readyState==3&&tu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,Ci(this))},n.Qa=function(a){this.g&&(this.response=a,Ci(this))},n.ga=function(){this.g&&Ci(this)};function Ci(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Si(a)}n.setRequestHeader=function(a,u){this.u.append(a,u)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var d=u.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=u.next();return a.join(`\r
`)};function Si(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Hs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function nu(a){let u="";return de(a,function(d,p){u+=p,u+=":",u+=d,u+=`\r
`}),u}function jo(a,u,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=nu(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):se(a,u,d))}function ce(a){Pe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(ce,Pe);var Y_=/^https?$/i,X_=["POST","PUT"];n=ce.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,u,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Lo.g(),this.v=this.o?Nc(this.o):Nc(Lo),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(S){iu(this,S);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var w in p)d.set(w,p[w]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const S of p.keys())d.set(S,p.get(S));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),w=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(X_,u,void 0))||p||w||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,D]of d)this.g.setRequestHeader(S,D);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{ou(this),this.u=!0,this.g.send(a),this.u=!1}catch(S){iu(this,S)}};function iu(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,su(a),zs(a)}function su(a){a.A||(a.A=!0,Ve(a,"complete"),Ve(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ve(this,"complete"),Ve(this,"abort"),zs(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zs(this,!0)),ce.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?ru(this):this.bb())},n.bb=function(){ru(this)};function ru(a){if(a.h&&typeof o<"u"&&(!a.v[1]||_t(a)!=4||a.Z()!=2)){if(a.u&&_t(a)==4)Rc(a.Ea,0,a);else if(Ve(a,"readystatechange"),_t(a)==4){a.h=!1;try{const D=a.Z();e:switch(D){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var d;if(!(d=u)){var p;if(p=D===0){var w=String(a.D).match(Qc)[1]||null;!w&&l.self&&l.self.location&&(w=l.self.location.protocol.slice(0,-1)),p=!Y_.test(w?w.toLowerCase():"")}d=p}if(d)Ve(a,"complete"),Ve(a,"success");else{a.m=6;try{var S=2<_t(a)?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.Z()+"]",su(a)}}finally{zs(a)}}}}function zs(a,u){if(a.g){ou(a);const d=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||Ve(a,"ready");try{d.onreadystatechange=p}catch{}}}function ou(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function _t(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<_t(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),b_(u)}};function au(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function J_(a){const u={};a=(a.g&&2<=_t(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(z(a[p]))continue;var d=T(a[p]);const w=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=u[w]||[];u[w]=S,S.push(d)}I(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ri(a,u,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||u}function lu(a){this.Aa=0,this.i=[],this.j=new vi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ri("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ri("baseRetryDelayMs",5e3,a),this.cb=Ri("retryDelaySeedMs",1e4,a),this.Wa=Ri("forwardChannelMaxRetries",2,a),this.wa=Ri("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new $c(a&&a.concurrentRequestLimit),this.Da=new K_,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=lu.prototype,n.la=8,n.G=1,n.connect=function(a,u,d,p){xe(0),this.W=a,this.H=u||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=mu(this,null,this.W),Ks(this)};function $o(a){if(cu(a),a.G==3){var u=a.U++,d=gt(a.I);if(se(d,"SID",a.K),se(d,"RID",u),se(d,"TYPE","terminate"),Pi(a,d),u=new kt(a,a.j,u),u.L=2,u.v=Ws(gt(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=u.v,d=!0),d||(u.g=yu(u.j,null),u.g.ea(u.v)),u.F=Date.now(),qs(u)}_u(a)}function Gs(a){a.g&&(Ho(a),a.g.cancel(),a.g=null)}function cu(a){Gs(a),a.u&&(l.clearTimeout(a.u),a.u=null),Qs(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Ks(a){if(!Wc(a.h)&&!a.s){a.s=!0;var u=a.Ga;di||Tc(),fi||(di(),fi=!0),wo.add(u,a),a.B=0}}function Z_(a,u){return Hc(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=yi(_(a.Ga,a,u),gu(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const w=new kt(this,this.j,a);let S=this.o;if(this.S&&(S?(S=m(S),E(S,this.S)):S=this.S),this.m!==null||this.O||(w.H=S,S=null),this.P)e:{for(var u=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=d;break e}if(u===4096||d===this.i.length-1){u=d+1;break e}}u=1e3}else u=1e3;u=hu(this,w,u),d=gt(this.I),se(d,"RID",a),se(d,"CVER",22),this.D&&se(d,"X-HTTP-Session-Id",this.D),Pi(this,d),S&&(this.O?u="headers="+encodeURIComponent(String(nu(S)))+"&"+u:this.m&&jo(d,this.m,S)),qo(this.h,w),this.Ua&&se(d,"TYPE","init"),this.P?(se(d,"$req",u),se(d,"SID","null"),w.T=!0,xo(w,d,null)):xo(w,d,u),this.G=2}}else this.G==3&&(a?uu(this,a):this.i.length==0||Wc(this.h)||uu(this))};function uu(a,u){var d;u?d=u.l:d=a.U++;const p=gt(a.I);se(p,"SID",a.K),se(p,"RID",d),se(p,"AID",a.T),Pi(a,p),a.m&&a.o&&jo(p,a.m,a.o),d=new kt(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),u&&(a.i=u.D.concat(a.i)),u=hu(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),qo(a.h,d),xo(d,p,u)}function Pi(a,u){a.H&&de(a.H,function(d,p){se(u,p,d)}),a.l&&Kc({},function(d,p){se(u,p,d)})}function hu(a,u,d){d=Math.min(a.i.length,d);var p=a.l?_(a.l.Na,a.l,a):null;e:{var w=a.i;let S=-1;for(;;){const D=["count="+d];S==-1?0<d?(S=w[0].g,D.push("ofs="+S)):S=0:D.push("ofs="+S);let ee=!0;for(let Ie=0;Ie<d;Ie++){let X=w[Ie].g;const be=w[Ie].map;if(X-=S,0>X)S=Math.max(0,w[Ie].g-100),ee=!1;else try{Q_(be,D,"req"+X+"_")}catch{p&&p(be)}}if(ee){p=D.join("&");break e}}}return a=a.i.splice(0,d),u.D=a,p}function du(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;di||Tc(),fi||(di(),fi=!0),wo.add(u,a),a.v=0}}function Wo(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=yi(_(a.Fa,a),gu(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,fu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=yi(_(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,xe(10),Gs(this),fu(this))};function Ho(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function fu(a){a.g=new kt(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=gt(a.qa);se(u,"RID","rpc"),se(u,"SID",a.K),se(u,"AID",a.T),se(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&se(u,"TO",a.ja),se(u,"TYPE","xmlhttp"),Pi(a,u),a.m&&a.o&&jo(u,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Ws(gt(u)),d.m=null,d.P=!0,Bc(d,a)}n.Za=function(){this.C!=null&&(this.C=null,Gs(this),Wo(this),xe(19))};function Qs(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function pu(a,u){var d=null;if(a.g==u){Qs(a),Ho(a),a.g=null;var p=2}else if(Bo(a.h,u))d=u.D,zc(a.h,u),p=1;else return;if(a.G!=0){if(u.o)if(p==1){d=u.m?u.m.length:0,u=Date.now()-u.F;var w=a.B;p=Fs(),Ve(p,new Vc(p,d)),Ks(a)}else du(a);else if(w=u.s,w==3||w==0&&0<u.X||!(p==1&&Z_(a,u)||p==2&&Wo(a)))switch(d&&0<d.length&&(u=a.h,u.i=u.i.concat(d)),w){case 1:Zt(a,5);break;case 4:Zt(a,10);break;case 3:Zt(a,6);break;default:Zt(a,2)}}}function gu(a,u){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*u}function Zt(a,u){if(a.j.info("Error code "+u),u==2){var d=_(a.fb,a),p=a.Xa;const w=!p;p=new Jt(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||js(p,"https"),Ws(p),w?z_(p.toString(),d):G_(p.toString(),d)}else xe(2);a.G=0,a.l&&a.l.sa(u),_u(a),cu(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),xe(2)):(this.j.info("Failed to ping google.com"),xe(1))};function _u(a){if(a.G=0,a.ka=[],a.l){const u=Gc(a.h);(u.length!=0||a.i.length!=0)&&(k(a.ka,u),k(a.ka,a.i),a.h.i.length=0,O(a.i),a.i.length=0),a.l.ra()}}function mu(a,u,d){var p=d instanceof Jt?gt(d):new Jt(d);if(p.g!="")u&&(p.g=u+"."+p.g),$s(p,p.s);else{var w=l.location;p=w.protocol,u=u?u+"."+w.hostname:w.hostname,w=+w.port;var S=new Jt(null);p&&js(S,p),u&&(S.g=u),w&&$s(S,w),d&&(S.l=d),p=S}return d=a.D,u=a.ya,d&&u&&se(p,d,u),se(p,"VER",a.la),Pi(a,p),p}function yu(a,u,d){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new ce(new Ai({eb:d})):new ce(a.pa),u.Ha(a.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function vu(){}n=vu.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ys(){}Ys.prototype.g=function(a,u){return new je(a,u)};function je(a,u){Pe.call(this),this.g=new lu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!z(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!z(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new kn(this)}R(je,Pe),je.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},je.prototype.close=function(){$o(this.g)},je.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=No(a),a=d);u.i.push(new V_(u.Ya++,a)),u.G==3&&Ks(u)},je.prototype.N=function(){this.g.l=null,delete this.j,$o(this.g),delete this.g,je.aa.N.call(this)};function Eu(a){Oo.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const d in u){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}R(Eu,Oo);function Iu(){Mo.call(this),this.status=1}R(Iu,Mo);function kn(a){this.g=a}R(kn,vu),kn.prototype.ua=function(){Ve(this.g,"a")},kn.prototype.ta=function(a){Ve(this.g,new Eu(a))},kn.prototype.sa=function(a){Ve(this.g,new Iu)},kn.prototype.ra=function(){Ve(this.g,"b")},Ys.prototype.createWebChannel=Ys.prototype.g,je.prototype.send=je.prototype.o,je.prototype.open=je.prototype.m,je.prototype.close=je.prototype.close,Rp=function(){return new Ys},Sp=function(){return Fs()},Cp=Yt,ba={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Us.NO_ERROR=0,Us.TIMEOUT=8,Us.HTTP_ERROR=6,ar=Us,xc.COMPLETE="complete",Ap=xc,Dc.EventType=_i,_i.OPEN="a",_i.CLOSE="b",_i.ERROR="c",_i.MESSAGE="d",Pe.prototype.listen=Pe.prototype.K,xi=Dc,wp=Ai,ce.prototype.listenOnce=ce.prototype.L,ce.prototype.getLastError=ce.prototype.Ka,ce.prototype.getLastErrorCode=ce.prototype.Ba,ce.prototype.getStatus=ce.prototype.Z,ce.prototype.getResponseJson=ce.prototype.Oa,ce.prototype.getResponseText=ce.prototype.oa,ce.prototype.send=ce.prototype.ea,ce.prototype.setWithCredentials=ce.prototype.Ha,Tp=ce}).apply(typeof er<"u"?er:typeof self<"u"?self:typeof window<"u"?window:{});const Eh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}De.UNAUTHENTICATED=new De(null),De.GOOGLE_CREDENTIALS=new De("google-credentials-uid"),De.FIRST_PARTY=new De("first-party-uid"),De.MOCK_USER=new De("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oi="10.12.1";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=new ms("@firebase/firestore");function Oi(){return _n.logLevel}function M(n,...e){if(_n.logLevel<=G.DEBUG){const t=e.map(Vl);_n.debug(`Firestore (${oi}): ${n}`,...t)}}function At(n,...e){if(_n.logLevel<=G.ERROR){const t=e.map(Vl);_n.error(`Firestore (${oi}): ${n}`,...t)}}function Qn(n,...e){if(_n.logLevel<=G.WARN){const t=e.map(Vl);_n.warn(`Firestore (${oi}): ${n}`,...t)}}function Vl(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(n="Unexpected state"){const e=`FIRESTORE (${oi}) INTERNAL ASSERTION FAILED: `+n;throw At(e),new Error(e)}function ie(n,e){n||U()}function q(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends Je{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class XT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(De.UNAUTHENTICATED))}shutdown(){}}class JT{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class ZT{constructor(e){this.t=e,this.currentUser=De.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let i=this.i;const s=c=>this.i!==i?(i=this.i,t(c)):Promise.resolve();let r=new qt;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new qt,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{M("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(M("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new qt)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(i=>this.i!==e?(M("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(ie(typeof i.accessToken=="string"),new Pp(i.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return ie(e===null||typeof e=="string"),new De(e)}}class ew{constructor(e,t,i){this.l=e,this.h=t,this.P=i,this.type="FirstParty",this.user=De.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class tw{constructor(e,t,i){this.l=e,this.h=t,this.P=i}getToken(){return Promise.resolve(new ew(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(De.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class nw{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class iw{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){const i=r=>{r.error!=null&&M("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,M("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>i(r))};const s=r=>{M("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>s(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?s(r):M("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ie(typeof t.token=="string"),this.R=t.token,new nw(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
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
 */function sw(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<n;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let i="";for(;i.length<20;){const s=sw(40);for(let r=0;r<s.length;++r)i.length<20&&s[r]<t&&(i+=e.charAt(s[r]%e.length))}return i}}function J(n,e){return n<e?-1:n>e?1:0}function Yn(n,e,t){return n.length===e.length&&n.every((i,s)=>t(i,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new V(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return me.fromMillis(Date.now())}static fromDate(e){return me.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor(1e6*(e-1e3*t));return new me(t,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?J(this.nanoseconds,e.nanoseconds):J(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.timestamp=e}static fromTimestamp(e){return new B(e)}static min(){return new B(new me(0,0))}static max(){return new B(new me(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,t,i){t===void 0?t=0:t>e.length&&U(),i===void 0?i=e.length-t:i>e.length-t&&U(),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return as.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof as?e.forEach(i=>{t.push(i)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let s=0;s<i;s++){const r=e.get(s),o=t.get(s);if(r<o)return-1;if(r>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ue extends as{construct(e,t,i){return new ue(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new V(b.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter(s=>s.length>0))}return new ue(t)}static emptyPath(){return new ue([])}}const rw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ae extends as{construct(e,t,i){return new Ae(e,t,i)}static isValidIdentifier(e){return rw.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ae.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ae(["__name__"])}static fromServerFormat(e){const t=[];let i="",s=0;const r=()=>{if(i.length===0)throw new V(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let o=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new V(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new V(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,s+=2}else l==="`"?(o=!o,s++):l!=="."||o?(i+=l,s++):(r(),s++)}if(r(),o)throw new V(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ae(t)}static emptyPath(){return new Ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(ue.fromString(e))}static fromName(e){return new L(ue.fromString(e).popFirst(5))}static empty(){return new L(ue.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ue.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ue.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new ue(e.slice()))}}function ow(n,e){const t=n.toTimestamp().seconds,i=n.toTimestamp().nanoseconds+1,s=B.fromTimestamp(i===1e9?new me(t+1,0):new me(t,i));return new Ht(s,L.empty(),e)}function aw(n){return new Ht(n.readTime,n.key,-1)}class Ht{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new Ht(B.min(),L.empty(),-1)}static max(){return new Ht(B.max(),L.empty(),-1)}}function lw(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:J(n.largestBatchId,e.largestBatchId))}/**
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
 */const cw="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class uw{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cs(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==cw)throw n;M("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&U(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((i,s)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(i,s)},this.catchCallback=r=>{this.wrapFailure(t,r).next(i,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,i)=>{t(e)})}static reject(e){return new P((t,i)=>{i(e)})}static waitFor(e){return new P((t,i)=>{let s=0,r=0,o=!1;e.forEach(l=>{++s,l.next(()=>{++r,o&&r===s&&t()},c=>i(c))}),o=!0,r===s&&t()})}static or(e){let t=P.resolve(!1);for(const i of e)t=t.next(s=>s?P.resolve(s):i());return t}static forEach(e,t){const i=[];return e.forEach((s,r)=>{i.push(t.call(this,s,r))}),this.waitFor(i)}static mapArray(e,t){return new P((i,s)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const h=c;t(e[h]).next(f=>{o[h]=f,++l,l===r&&i(o)},f=>s(f))}})}static doWhile(e,t){return new P((i,s)=>{const r=()=>{e()===!0?t().next(()=>{r()},s):i()};r()})}}function hw(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Ss(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class xl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this.ie(i),this.se=i=>t.writeSequenceNumber(i))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}xl.oe=-1;function ao(n){return n==null}function Or(n){return n===0&&1/n==-1/0}function dw(n){return typeof n=="number"&&Number.isInteger(n)&&!Or(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ai(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function kp(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e,t){this.comparator=e,this.root=t||Te.EMPTY}insert(e,t){return new le(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Te.BLACK,null,null))}remove(e){return new le(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Te.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const s=this.comparator(e,i.key);if(s===0)return t+i.left.size;s<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,i)=>(e(t,i),!1))}toString(){const e=[];return this.inorderTraversal((t,i)=>(e.push(`${t}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new tr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new tr(this.root,e,this.comparator,!1)}getReverseIterator(){return new tr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new tr(this.root,e,this.comparator,!0)}}class tr{constructor(e,t,i,s){this.isReverse=s,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=t?i(e.key,t):1,t&&s&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Te{constructor(e,t,i,s,r){this.key=e,this.value=t,this.color=i??Te.RED,this.left=s??Te.EMPTY,this.right=r??Te.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,s,r){return new Te(e??this.key,t??this.value,i??this.color,s??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let s=this;const r=i(e,s.key);return s=r<0?s.copy(null,null,null,s.left.insert(e,t,i),null):r===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,i)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Te.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Te.EMPTY;i=s.right.min(),s=s.copy(i.key,i.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Te.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Te.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw U();const e=this.left.check();if(e!==this.right.check())throw U();return e+(this.isRed()?0:1)}}Te.EMPTY=null,Te.RED=!0,Te.BLACK=!1;Te.EMPTY=new class{constructor(){this.size=0}get key(){throw U()}get value(){throw U()}get color(){throw U()}get left(){throw U()}get right(){throw U()}copy(e,t,i,s,r){return this}insert(e,t,i){return new Te(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e){this.comparator=e,this.data=new le(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,i)=>(e(t),!1))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const s=i.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Th(this.data.getIterator())}getIteratorFrom(e){return new Th(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(i=>{t=t.add(i)}),t}isEqual(e){if(!(e instanceof Ce)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,r=i.getNext().key;if(this.comparator(s,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ce(this.comparator);return t.data=e,t}}class Th{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class it{constructor(e){this.fields=e,e.sort(Ae.comparator)}static empty(){return new it([])}unionWith(e){let t=new Ce(Ae.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new it(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Yn(this.fields,e.fields,(t,i)=>t.isEqual(i))}}/**
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
 */class Np extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Le{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Np("Invalid base64 string: "+r):r}}(e);return new Le(t)}static fromUint8Array(e){const t=function(s){let r="";for(let o=0;o<s.length;++o)r+=String.fromCharCode(s[o]);return r}(e);return new Le(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const i=new Uint8Array(t.length);for(let s=0;s<t.length;s++)i[s]=t.charCodeAt(s);return i}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return J(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Le.EMPTY_BYTE_STRING=new Le("");const fw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function zt(n){if(ie(!!n),typeof n=="string"){let e=0;const t=fw.exec(n);if(ie(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const i=new Date(n);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:pe(n.seconds),nanos:pe(n.nanos)}}function pe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function mn(n){return typeof n=="string"?Le.fromBase64String(n):Le.fromUint8Array(n)}/**
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
 */function Fl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Ul(n){const e=n.mapValue.fields.__previous_value__;return Fl(e)?Ul(e):e}function ls(n){const e=zt(n.mapValue.fields.__local_write_time__.timestampValue);return new me(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pw{constructor(e,t,i,s,r,o,l,c,h){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=s,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=h}}class cs{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new cs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof cs&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const nr={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function yn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Fl(n)?4:gw(n)?9007199254740991:10:U()}function dt(n,e){if(n===e)return!0;const t=yn(n);if(t!==yn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ls(n).isEqual(ls(e));case 3:return function(s,r){if(typeof s.timestampValue=="string"&&typeof r.timestampValue=="string"&&s.timestampValue.length===r.timestampValue.length)return s.timestampValue===r.timestampValue;const o=zt(s.timestampValue),l=zt(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,r){return mn(s.bytesValue).isEqual(mn(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,r){return pe(s.geoPointValue.latitude)===pe(r.geoPointValue.latitude)&&pe(s.geoPointValue.longitude)===pe(r.geoPointValue.longitude)}(n,e);case 2:return function(s,r){if("integerValue"in s&&"integerValue"in r)return pe(s.integerValue)===pe(r.integerValue);if("doubleValue"in s&&"doubleValue"in r){const o=pe(s.doubleValue),l=pe(r.doubleValue);return o===l?Or(o)===Or(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return Yn(n.arrayValue.values||[],e.arrayValue.values||[],dt);case 10:return function(s,r){const o=s.mapValue.fields||{},l=r.mapValue.fields||{};if(Ih(o)!==Ih(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!dt(o[c],l[c])))return!1;return!0}(n,e);default:return U()}}function us(n,e){return(n.values||[]).find(t=>dt(t,e))!==void 0}function Xn(n,e){if(n===e)return 0;const t=yn(n),i=yn(e);if(t!==i)return J(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return J(n.booleanValue,e.booleanValue);case 2:return function(r,o){const l=pe(r.integerValue||r.doubleValue),c=pe(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return wh(n.timestampValue,e.timestampValue);case 4:return wh(ls(n),ls(e));case 5:return J(n.stringValue,e.stringValue);case 6:return function(r,o){const l=mn(r),c=mn(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let h=0;h<l.length&&h<c.length;h++){const f=J(l[h],c[h]);if(f!==0)return f}return J(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,o){const l=J(pe(r.latitude),pe(o.latitude));return l!==0?l:J(pe(r.longitude),pe(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return function(r,o){const l=r.values||[],c=o.values||[];for(let h=0;h<l.length&&h<c.length;++h){const f=Xn(l[h],c[h]);if(f)return f}return J(l.length,c.length)}(n.arrayValue,e.arrayValue);case 10:return function(r,o){if(r===nr.mapValue&&o===nr.mapValue)return 0;if(r===nr.mapValue)return 1;if(o===nr.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),h=o.fields||{},f=Object.keys(h);c.sort(),f.sort();for(let g=0;g<c.length&&g<f.length;++g){const _=J(c[g],f[g]);if(_!==0)return _;const A=Xn(l[c[g]],h[f[g]]);if(A!==0)return A}return J(c.length,f.length)}(n.mapValue,e.mapValue);default:throw U()}}function wh(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return J(n,e);const t=zt(n),i=zt(e),s=J(t.seconds,i.seconds);return s!==0?s:J(t.nanos,i.nanos)}function Jn(n){return ka(n)}function ka(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const i=zt(t);return`time(${i.seconds},${i.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return mn(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return L.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let i="[",s=!0;for(const r of t.values||[])s?s=!1:i+=",",i+=ka(r);return i+"]"}(n.arrayValue):"mapValue"in n?function(t){const i=Object.keys(t.fields||{}).sort();let s="{",r=!0;for(const o of i)r?r=!1:s+=",",s+=`${o}:${ka(t.fields[o])}`;return s+"}"}(n.mapValue):U()}function Na(n){return!!n&&"integerValue"in n}function Bl(n){return!!n&&"arrayValue"in n}function Ah(n){return!!n&&"nullValue"in n}function Ch(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function lr(n){return!!n&&"mapValue"in n}function zi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ai(n.mapValue.fields,(t,i)=>e.mapValue.fields[t]=zi(i)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=zi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function gw(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e){this.value=e}static empty(){return new Ke({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!lr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=zi(t)}setAll(e){let t=Ae.emptyPath(),i={},s=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,i,s),i={},s=[],t=l.popLast()}o?i[l.lastSegment()]=zi(o):s.push(l.lastSegment())});const r=this.getFieldsMap(t);this.applyChanges(r,i,s)}delete(e){const t=this.field(e.popLast());lr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return dt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let s=t.mapValue.fields[e.get(i)];lr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,i){ai(t,(s,r)=>e[s]=r);for(const s of i)delete e[s]}clone(){return new Ke(zi(this.value))}}function Dp(n){const e=[];return ai(n.fields,(t,i)=>{const s=new Ae([t]);if(lr(i)){const r=Dp(i.mapValue).fields;if(r.length===0)e.push(s);else for(const o of r)e.push(s.child(o))}else e.push(s)}),new it(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e,t,i,s,r,o,l){this.key=e,this.documentType=t,this.version=i,this.readTime=s,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Me(e,0,B.min(),B.min(),B.min(),Ke.empty(),0)}static newFoundDocument(e,t,i,s){return new Me(e,1,t,B.min(),i,s,0)}static newNoDocument(e,t){return new Me(e,2,t,B.min(),B.min(),Ke.empty(),0)}static newUnknownDocument(e,t){return new Me(e,3,t,B.min(),B.min(),Ke.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(B.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ke.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ke.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=B.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Me&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Me(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Mr{constructor(e,t){this.position=e,this.inclusive=t}}function Sh(n,e,t){let i=0;for(let s=0;s<n.position.length;s++){const r=e[s],o=n.position[s];if(r.field.isKeyField()?i=L.comparator(L.fromName(o.referenceValue),t.key):i=Xn(o,t.data.field(r.field)),r.dir==="desc"&&(i*=-1),i!==0)break}return i}function Rh(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!dt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Lr{constructor(e,t="asc"){this.field=e,this.dir=t}}function _w(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Op{}class _e extends Op{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new yw(e,t,i):t==="array-contains"?new Iw(e,i):t==="in"?new Tw(e,i):t==="not-in"?new ww(e,i):t==="array-contains-any"?new Aw(e,i):new _e(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new vw(e,i):new Ew(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Xn(t,this.value)):t!==null&&yn(this.value)===yn(t)&&this.matchesComparison(Xn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return U()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ft extends Op{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new ft(e,t)}matches(e){return Mp(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Mp(n){return n.op==="and"}function Lp(n){return mw(n)&&Mp(n)}function mw(n){for(const e of n.filters)if(e instanceof ft)return!1;return!0}function Da(n){if(n instanceof _e)return n.field.canonicalString()+n.op.toString()+Jn(n.value);if(Lp(n))return n.filters.map(e=>Da(e)).join(",");{const e=n.filters.map(t=>Da(t)).join(",");return`${n.op}(${e})`}}function Vp(n,e){return n instanceof _e?function(i,s){return s instanceof _e&&i.op===s.op&&i.field.isEqual(s.field)&&dt(i.value,s.value)}(n,e):n instanceof ft?function(i,s){return s instanceof ft&&i.op===s.op&&i.filters.length===s.filters.length?i.filters.reduce((r,o,l)=>r&&Vp(o,s.filters[l]),!0):!1}(n,e):void U()}function xp(n){return n instanceof _e?function(t){return`${t.field.canonicalString()} ${t.op} ${Jn(t.value)}`}(n):n instanceof ft?function(t){return t.op.toString()+" {"+t.getFilters().map(xp).join(" ,")+"}"}(n):"Filter"}class yw extends _e{constructor(e,t,i){super(e,t,i),this.key=L.fromName(i.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class vw extends _e{constructor(e,t){super(e,"in",t),this.keys=Fp("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Ew extends _e{constructor(e,t){super(e,"not-in",t),this.keys=Fp("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Fp(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(i=>L.fromName(i.referenceValue))}class Iw extends _e{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Bl(t)&&us(t.arrayValue,this.value)}}class Tw extends _e{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&us(this.value.arrayValue,t)}}class ww extends _e{constructor(e,t){super(e,"not-in",t)}matches(e){if(us(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!us(this.value.arrayValue,t)}}class Aw extends _e{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Bl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(i=>us(this.value.arrayValue,i))}}/**
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
 */class Cw{constructor(e,t=null,i=[],s=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=s,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function Ph(n,e=null,t=[],i=[],s=null,r=null,o=null){return new Cw(n,e,t,i,s,r,o)}function ql(n){const e=q(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(i=>Da(i)).join(","),t+="|ob:",t+=e.orderBy.map(i=>function(r){return r.field.canonicalString()+r.dir}(i)).join(","),ao(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(i=>Jn(i)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(i=>Jn(i)).join(",")),e.ue=t}return e.ue}function jl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!_w(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Vp(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Rh(n.startAt,e.startAt)&&Rh(n.endAt,e.endAt)}function Oa(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(e,t=null,i=[],s=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=s,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Sw(n,e,t,i,s,r,o,l){return new lo(n,e,t,i,s,r,o,l)}function $l(n){return new lo(n)}function bh(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Rw(n){return n.collectionGroup!==null}function Gi(n){const e=q(n);if(e.ce===null){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Ce(Ae.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new Lr(r,i))}),t.has(Ae.keyField().canonicalString())||e.ce.push(new Lr(Ae.keyField(),i))}return e.ce}function ct(n){const e=q(n);return e.le||(e.le=Pw(e,Gi(n))),e.le}function Pw(n,e){if(n.limitType==="F")return Ph(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const r=s.dir==="desc"?"asc":"desc";return new Lr(s.field,r)});const t=n.endAt?new Mr(n.endAt.position,n.endAt.inclusive):null,i=n.startAt?new Mr(n.startAt.position,n.startAt.inclusive):null;return Ph(n.path,n.collectionGroup,e,n.filters,n.limit,t,i)}}function Ma(n,e,t){return new lo(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function co(n,e){return jl(ct(n),ct(e))&&n.limitType===e.limitType}function Up(n){return`${ql(ct(n))}|lt:${n.limitType}`}function On(n){return`Query(target=${function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map(s=>xp(s)).join(", ")}]`),ao(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map(s=>Jn(s)).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map(s=>Jn(s)).join(",")),`Target(${i})`}(ct(n))}; limitType=${n.limitType})`}function uo(n,e){return e.isFoundDocument()&&function(i,s){const r=s.key.path;return i.collectionGroup!==null?s.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(r):L.isDocumentKey(i.path)?i.path.isEqual(r):i.path.isImmediateParentOf(r)}(n,e)&&function(i,s){for(const r of Gi(i))if(!r.field.isKeyField()&&s.data.field(r.field)===null)return!1;return!0}(n,e)&&function(i,s){for(const r of i.filters)if(!r.matches(s))return!1;return!0}(n,e)&&function(i,s){return!(i.startAt&&!function(o,l,c){const h=Sh(o,l,c);return o.inclusive?h<=0:h<0}(i.startAt,Gi(i),s)||i.endAt&&!function(o,l,c){const h=Sh(o,l,c);return o.inclusive?h>=0:h>0}(i.endAt,Gi(i),s))}(n,e)}function bw(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Bp(n){return(e,t)=>{let i=!1;for(const s of Gi(n)){const r=kw(s,e,t);if(r!==0)return r;i=i||s.field.isKeyField()}return 0}}function kw(n,e,t){const i=n.field.isKeyField()?L.comparator(e.key,t.key):function(r,o,l){const c=o.data.field(r),h=l.data.field(r);return c!==null&&h!==null?Xn(c,h):U()}(n.field,e,t);switch(n.dir){case"asc":return i;case"desc":return-1*i;default:return U()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[s,r]of i)if(this.equalsFn(s,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),s=this.inner[i];if(s===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return void(s[r]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return i.length===1?delete this.inner[t]:i.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ai(this.inner,(t,i)=>{for(const[s,r]of i)e(s,r)})}isEmpty(){return kp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw=new le(L.comparator);function Ct(){return Nw}const qp=new le(L.comparator);function Fi(...n){let e=qp;for(const t of n)e=e.insert(t.key,t);return e}function jp(n){let e=qp;return n.forEach((t,i)=>e=e.insert(t,i.overlayedDocument)),e}function rn(){return Ki()}function $p(){return Ki()}function Ki(){return new li(n=>n.toString(),(n,e)=>n.isEqual(e))}const Dw=new le(L.comparator),Ow=new Ce(L.comparator);function K(...n){let e=Ow;for(const t of n)e=e.add(t);return e}const Mw=new Ce(J);function Lw(){return Mw}/**
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
 */function Wp(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Or(e)?"-0":e}}function Hp(n){return{integerValue:""+n}}function Vw(n,e){return dw(e)?Hp(e):Wp(n,e)}/**
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
 */class ho{constructor(){this._=void 0}}function xw(n,e,t){return n instanceof Vr?function(s,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return r&&Fl(r)&&(r=Ul(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(t,e):n instanceof hs?Gp(n,e):n instanceof ds?Kp(n,e):function(s,r){const o=zp(s,r),l=kh(o)+kh(s.Pe);return Na(o)&&Na(s.Pe)?Hp(l):Wp(s.serializer,l)}(n,e)}function Fw(n,e,t){return n instanceof hs?Gp(n,e):n instanceof ds?Kp(n,e):t}function zp(n,e){return n instanceof xr?function(i){return Na(i)||function(r){return!!r&&"doubleValue"in r}(i)}(e)?e:{integerValue:0}:null}class Vr extends ho{}class hs extends ho{constructor(e){super(),this.elements=e}}function Gp(n,e){const t=Qp(e);for(const i of n.elements)t.some(s=>dt(s,i))||t.push(i);return{arrayValue:{values:t}}}class ds extends ho{constructor(e){super(),this.elements=e}}function Kp(n,e){let t=Qp(e);for(const i of n.elements)t=t.filter(s=>!dt(s,i));return{arrayValue:{values:t}}}class xr extends ho{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function kh(n){return pe(n.integerValue||n.doubleValue)}function Qp(n){return Bl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function Uw(n,e){return n.field.isEqual(e.field)&&function(i,s){return i instanceof hs&&s instanceof hs||i instanceof ds&&s instanceof ds?Yn(i.elements,s.elements,dt):i instanceof xr&&s instanceof xr?dt(i.Pe,s.Pe):i instanceof Vr&&s instanceof Vr}(n.transform,e.transform)}class Bw{constructor(e,t){this.version=e,this.transformResults=t}}class Tt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Tt}static exists(e){return new Tt(void 0,e)}static updateTime(e){return new Tt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function cr(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class fo{}function Yp(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Jp(n.key,Tt.none()):new Rs(n.key,n.data,Tt.none());{const t=n.data,i=Ke.empty();let s=new Ce(Ae.comparator);for(let r of e.fields)if(!s.has(r)){let o=t.field(r);o===null&&r.length>1&&(r=r.popLast(),o=t.field(r)),o===null?i.delete(r):i.set(r,o),s=s.add(r)}return new An(n.key,i,new it(s.toArray()),Tt.none())}}function qw(n,e,t){n instanceof Rs?function(s,r,o){const l=s.value.clone(),c=Dh(s.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof An?function(s,r,o){if(!cr(s.precondition,r))return void r.convertToUnknownDocument(o.version);const l=Dh(s.fieldTransforms,r,o.transformResults),c=r.data;c.setAll(Xp(s)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(s,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function Qi(n,e,t,i){return n instanceof Rs?function(r,o,l,c){if(!cr(r.precondition,o))return l;const h=r.value.clone(),f=Oh(r.fieldTransforms,c,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(n,e,t,i):n instanceof An?function(r,o,l,c){if(!cr(r.precondition,o))return l;const h=Oh(r.fieldTransforms,c,o),f=o.data;return f.setAll(Xp(r)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(g=>g.field))}(n,e,t,i):function(r,o,l){return cr(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function jw(n,e){let t=null;for(const i of n.fieldTransforms){const s=e.data.field(i.field),r=zp(i.transform,s||null);r!=null&&(t===null&&(t=Ke.empty()),t.set(i.field,r))}return t||null}function Nh(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(i,s){return i===void 0&&s===void 0||!(!i||!s)&&Yn(i,s,(r,o)=>Uw(r,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Rs extends fo{constructor(e,t,i,s=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class An extends fo{constructor(e,t,i,s,r=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=s,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function Xp(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const i=n.data.field(t);e.set(t,i)}}),e}function Dh(n,e,t){const i=new Map;ie(n.length===t.length);for(let s=0;s<t.length;s++){const r=n[s],o=r.transform,l=e.data.field(r.field);i.set(r.field,Fw(o,l,t[s]))}return i}function Oh(n,e,t){const i=new Map;for(const s of n){const r=s.transform,o=t.data.field(s.field);i.set(s.field,xw(r,o,e))}return i}class Jp extends fo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class $w extends fo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ww{constructor(e,t,i,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=s}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const r=this.mutations[s];r.key.isEqual(e.key)&&qw(r,e,i[s])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=Qi(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=Qi(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=$p();return this.mutations.forEach(s=>{const r=e.get(s.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=t.has(s.key)?null:l;const c=Yp(o,l);c!==null&&i.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(B.min())}),i}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),K())}isEqual(e){return this.batchId===e.batchId&&Yn(this.mutations,e.mutations,(t,i)=>Nh(t,i))&&Yn(this.baseMutations,e.baseMutations,(t,i)=>Nh(t,i))}}class Wl{constructor(e,t,i,s){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=s}static from(e,t,i){ie(e.mutations.length===i.length);let s=function(){return Dw}();const r=e.mutations;for(let o=0;o<r.length;o++)s=s.insert(r[o].key,i[o].version);return new Wl(e,t,i,s)}}/**
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
 */class Hw{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class zw{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fe,Y;function Gw(n){switch(n){default:return U();case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0}}function Zp(n){if(n===void 0)return At("GRPC error has no .code"),b.UNKNOWN;switch(n){case fe.OK:return b.OK;case fe.CANCELLED:return b.CANCELLED;case fe.UNKNOWN:return b.UNKNOWN;case fe.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case fe.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case fe.INTERNAL:return b.INTERNAL;case fe.UNAVAILABLE:return b.UNAVAILABLE;case fe.UNAUTHENTICATED:return b.UNAUTHENTICATED;case fe.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case fe.NOT_FOUND:return b.NOT_FOUND;case fe.ALREADY_EXISTS:return b.ALREADY_EXISTS;case fe.PERMISSION_DENIED:return b.PERMISSION_DENIED;case fe.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case fe.ABORTED:return b.ABORTED;case fe.OUT_OF_RANGE:return b.OUT_OF_RANGE;case fe.UNIMPLEMENTED:return b.UNIMPLEMENTED;case fe.DATA_LOSS:return b.DATA_LOSS;default:return U()}}(Y=fe||(fe={}))[Y.OK=0]="OK",Y[Y.CANCELLED=1]="CANCELLED",Y[Y.UNKNOWN=2]="UNKNOWN",Y[Y.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Y[Y.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Y[Y.NOT_FOUND=5]="NOT_FOUND",Y[Y.ALREADY_EXISTS=6]="ALREADY_EXISTS",Y[Y.PERMISSION_DENIED=7]="PERMISSION_DENIED",Y[Y.UNAUTHENTICATED=16]="UNAUTHENTICATED",Y[Y.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Y[Y.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Y[Y.ABORTED=10]="ABORTED",Y[Y.OUT_OF_RANGE=11]="OUT_OF_RANGE",Y[Y.UNIMPLEMENTED=12]="UNIMPLEMENTED",Y[Y.INTERNAL=13]="INTERNAL",Y[Y.UNAVAILABLE=14]="UNAVAILABLE",Y[Y.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function Kw(){return new TextEncoder}/**
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
 */const Qw=new an([4294967295,4294967295],0);function Mh(n){const e=Kw().encode(n),t=new Ip;return t.update(e),new Uint8Array(t.digest())}function Lh(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),s=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new an([t,i],0),new an([s,r],0)]}class Hl{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new Ui(`Invalid padding: ${t}`);if(i<0)throw new Ui(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new Ui(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new Ui(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=an.fromNumber(this.Ie)}Ee(e,t,i){let s=e.add(t.multiply(an.fromNumber(i)));return s.compare(Qw)===1&&(s=new an([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Mh(e),[i,s]=Lh(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(i,s,r);if(!this.de(o))return!1}return!0}static create(e,t,i){const s=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new Hl(r,s,t);return i.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=Mh(e),[i,s]=Lh(t);for(let r=0;r<this.hashCount;r++){const o=this.Ee(i,s,r);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class Ui extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{constructor(e,t,i,s,r){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=s,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const s=new Map;return s.set(e,Ps.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new po(B.min(),s,new le(J),Ct(),K())}}class Ps{constructor(e,t,i,s,r){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=s,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new Ps(i,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,t,i,s){this.Re=e,this.removedTargetIds=t,this.key=i,this.Ve=s}}class eg{constructor(e,t){this.targetId=e,this.me=t}}class tg{constructor(e,t,i=Le.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=s}}class Vh{constructor(){this.fe=0,this.ge=Fh(),this.pe=Le.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}Ce(){let e=K(),t=K(),i=K();return this.ge.forEach((s,r)=>{switch(r){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:i=i.add(s);break;default:U()}}),new Ps(this.pe,this.ye,e,t,i)}ve(){this.we=!1,this.ge=Fh()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ie(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Yw{constructor(e){this.Le=e,this.Be=new Map,this.ke=Ct(),this.qe=xh(),this.Qe=new le(J)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const i=this.Ge(t);switch(e.state){case 0:this.ze(t)&&i.De(e.resumeToken);break;case 1:i.Oe(),i.Se||i.ve(),i.De(e.resumeToken);break;case 2:i.Oe(),i.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(i.Ne(),i.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),i.De(e.resumeToken));break;default:U()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((i,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,i=e.me.count,s=this.Je(t);if(s){const r=s.target;if(Oa(r))if(i===0){const o=new L(r.path);this.Ue(t,o,Me.newNoDocument(o,B.min()))}else ie(i===1);else{const o=this.Ye(t);if(o!==i){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:s=0},hashCount:r=0}=t;let o,l;try{o=mn(i).toUint8Array()}catch(c){if(c instanceof Np)return Qn("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Hl(o,s,r)}catch(c){return Qn(c instanceof Ui?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,i){return t.me.count===i-this.nt(e,t.targetId)?0:2}nt(e,t){const i=this.Le.getRemoteKeysForTarget(t);let s=0;return i.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,r,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&Oa(l.target)){const c=new L(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Me.newNoDocument(c,e))}r.be&&(t.set(o,r.Ce()),r.ve())}});let i=K();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(i=i.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const s=new po(e,t,this.Qe,this.ke,i);return this.ke=Ct(),this.qe=xh(),this.Qe=new le(J),s}$e(e,t){if(!this.ze(e))return;const i=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,i),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,i){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),i&&(this.ke=this.ke.insert(t,i))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).Ce();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Vh,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Ce(J),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||M("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Vh),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function xh(){return new le(L.comparator)}function Fh(){return new le(L.comparator)}const Xw={asc:"ASCENDING",desc:"DESCENDING"},Jw={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Zw={and:"AND",or:"OR"};class eA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function La(n,e){return n.useProto3Json||ao(e)?e:{value:e}}function Fr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ng(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function tA(n,e){return Fr(n,e.toTimestamp())}function ut(n){return ie(!!n),B.fromTimestamp(function(t){const i=zt(t);return new me(i.seconds,i.nanos)}(n))}function zl(n,e){return Va(n,e).canonicalString()}function Va(n,e){const t=function(s){return new ue(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function ig(n){const e=ue.fromString(n);return ie(lg(e)),e}function xa(n,e){return zl(n.databaseId,e.path)}function ra(n,e){const t=ig(e);if(t.get(1)!==n.databaseId.projectId)throw new V(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(rg(t))}function sg(n,e){return zl(n.databaseId,e)}function nA(n){const e=ig(n);return e.length===4?ue.emptyPath():rg(e)}function Fa(n){return new ue(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function rg(n){return ie(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Uh(n,e,t){return{name:xa(n,e),fields:t.value.mapValue.fields}}function iA(n,e){let t;if("targetChange"in e){e.targetChange;const i=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:U()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],r=function(h,f){return h.useProto3Json?(ie(f===void 0||typeof f=="string"),Le.fromBase64String(f||"")):(ie(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Le.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const f=h.code===void 0?b.UNKNOWN:Zp(h.code);return new V(f,h.message||"")}(o);t=new tg(i,s,r,l||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const s=ra(n,i.document.name),r=ut(i.document.updateTime),o=i.document.createTime?ut(i.document.createTime):B.min(),l=new Ke({mapValue:{fields:i.document.fields}}),c=Me.newFoundDocument(s,r,o,l),h=i.targetIds||[],f=i.removedTargetIds||[];t=new ur(h,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const s=ra(n,i.document),r=i.readTime?ut(i.readTime):B.min(),o=Me.newNoDocument(s,r),l=i.removedTargetIds||[];t=new ur([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const s=ra(n,i.document),r=i.removedTargetIds||[];t=new ur([],r,s,null)}else{if(!("filter"in e))return U();{e.filter;const i=e.filter;i.targetId;const{count:s=0,unchangedNames:r}=i,o=new zw(s,r),l=i.targetId;t=new eg(l,o)}}return t}function sA(n,e){let t;if(e instanceof Rs)t={update:Uh(n,e.key,e.value)};else if(e instanceof Jp)t={delete:xa(n,e.key)};else if(e instanceof An)t={update:Uh(n,e.key,e.data),updateMask:fA(e.fieldMask)};else{if(!(e instanceof $w))return U();t={verify:xa(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(i=>function(r,o){const l=o.transform;if(l instanceof Vr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof hs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof ds)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof xr)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw U()}(0,i))),e.precondition.isNone||(t.currentDocument=function(s,r){return r.updateTime!==void 0?{updateTime:tA(s,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:U()}(n,e.precondition)),t}function rA(n,e){return n&&n.length>0?(ie(e!==void 0),n.map(t=>function(s,r){let o=s.updateTime?ut(s.updateTime):ut(r);return o.isEqual(B.min())&&(o=ut(r)),new Bw(o,s.transformResults||[])}(t,e))):[]}function oA(n,e){return{documents:[sg(n,e.path)]}}function aA(n,e){const t={structuredQuery:{}},i=e.path;let s;e.collectionGroup!==null?(s=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=sg(n,s);const r=function(h){if(h.length!==0)return ag(ft.create(h,"and"))}(e.filters);r&&(t.structuredQuery.where=r);const o=function(h){if(h.length!==0)return h.map(f=>function(_){return{field:Mn(_.field),direction:uA(_.dir)}}(f))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=La(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:s}}function lA(n){let e=nA(n.parent);const t=n.structuredQuery,i=t.from?t.from.length:0;let s=null;if(i>0){ie(i===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let r=[];t.where&&(r=function(g){const _=og(g);return _ instanceof ft&&Lp(_)?_.getFilters():[_]}(t.where));let o=[];t.orderBy&&(o=function(g){return g.map(_=>function(R){return new Lr(Ln(R.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(_))}(t.orderBy));let l=null;t.limit&&(l=function(g){let _;return _=typeof g=="object"?g.value:g,ao(_)?null:_}(t.limit));let c=null;t.startAt&&(c=function(g){const _=!!g.before,A=g.values||[];return new Mr(A,_)}(t.startAt));let h=null;return t.endAt&&(h=function(g){const _=!g.before,A=g.values||[];return new Mr(A,_)}(t.endAt)),Sw(e,s,o,r,l,"F",c,h)}function cA(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return U()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function og(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=Ln(t.unaryFilter.field);return _e.create(i,"==",{doubleValue:NaN});case"IS_NULL":const s=Ln(t.unaryFilter.field);return _e.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ln(t.unaryFilter.field);return _e.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ln(t.unaryFilter.field);return _e.create(o,"!=",{nullValue:"NULL_VALUE"});default:return U()}}(n):n.fieldFilter!==void 0?function(t){return _e.create(Ln(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return U()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return ft.create(t.compositeFilter.filters.map(i=>og(i)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return U()}}(t.compositeFilter.op))}(n):U()}function uA(n){return Xw[n]}function hA(n){return Jw[n]}function dA(n){return Zw[n]}function Mn(n){return{fieldPath:n.canonicalString()}}function Ln(n){return Ae.fromServerFormat(n.fieldPath)}function ag(n){return n instanceof _e?function(t){if(t.op==="=="){if(Ch(t.value))return{unaryFilter:{field:Mn(t.field),op:"IS_NAN"}};if(Ah(t.value))return{unaryFilter:{field:Mn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ch(t.value))return{unaryFilter:{field:Mn(t.field),op:"IS_NOT_NAN"}};if(Ah(t.value))return{unaryFilter:{field:Mn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Mn(t.field),op:hA(t.op),value:t.value}}}(n):n instanceof ft?function(t){const i=t.getFilters().map(s=>ag(s));return i.length===1?i[0]:{compositeFilter:{op:dA(t.op),filters:i}}}(n):U()}function fA(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function lg(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t,i,s,r=B.min(),o=B.min(),l=Le.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=s,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new Ft(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ft(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(e){this.ct=e}}function gA(n){const e=lA({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ma(e,e.limit,"L"):e}/**
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
 */class _A{constructor(){this._n=new mA}addToCollectionParentIndex(e,t){return this._n.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this._n.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Ht.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Ht.min())}updateCollectionGroup(e,t,i){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class mA{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),s=this.index[t]||new Ce(ue.comparator),r=!s.has(i);return this.index[t]=s.add(i),r}has(e){const t=e.lastSegment(),i=e.popLast(),s=this.index[t];return s&&s.has(i)}getEntries(e){return(this.index[e]||new Ce(ue.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e){this.On=e}next(){return this.On+=2,this.On}static Nn(){return new Zn(0)}static Ln(){return new Zn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(){this.changes=new li(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Me.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?P.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class vA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EA{constructor(e,t,i,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=s}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(i=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(i!==null&&Qi(i.mutation,s,it.empty(),me.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(i=>this.getLocalViewOfDocuments(e,i,K()).next(()=>i))}getLocalViewOfDocuments(e,t,i=K()){const s=rn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,i).next(r=>{let o=Fi();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const i=rn();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,K()))}populateOverlays(e,t,i){const s=[];return i.forEach(r=>{t.has(r)||s.push(r)}),this.documentOverlayCache.getOverlays(e,s).next(r=>{r.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,i,s){let r=Ct();const o=Ki(),l=function(){return Ki()}();return t.forEach((c,h)=>{const f=i.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof An)?r=r.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Qi(f.mutation,h,f.mutation.getFieldMask(),me.now())):o.set(h.key,it.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((h,f)=>o.set(h,f)),t.forEach((h,f)=>{var g;return l.set(h,new vA(f,(g=o.get(h))!==null&&g!==void 0?g:null))}),l))}recalculateAndSaveOverlays(e,t){const i=Ki();let s=new le((o,l)=>o-l),r=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let f=i.get(c)||it.empty();f=l.applyToLocalView(h,f),i.set(c,f);const g=(s.get(l.batchId)||K()).add(c);s=s.insert(l.batchId,g)})}).next(()=>{const o=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),h=c.key,f=c.value,g=$p();f.forEach(_=>{if(!r.has(_)){const A=Yp(t.get(_),i.get(_));A!==null&&g.set(_,A),r=r.add(_)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,g))}return P.waitFor(o)}).next(()=>i)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(i=>this.recalculateAndSaveOverlays(e,i))}getDocumentsMatchingQuery(e,t,i,s){return function(o){return L.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Rw(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,s):this.getDocumentsMatchingCollectionQuery(e,t,i,s)}getNextDocuments(e,t,i,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,s).next(r=>{const o=s-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,s-r.size):P.resolve(rn());let l=-1,c=r;return o.next(h=>P.forEach(h,(f,g)=>(l<g.largestBatchId&&(l=g.largestBatchId),r.get(f)?P.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{c=c.insert(f,_)}))).next(()=>this.populateOverlays(e,h,r)).next(()=>this.computeViews(e,c,h,K())).next(f=>({batchId:l,changes:jp(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(i=>{let s=Fi();return i.isFoundDocument()&&(s=s.insert(i.key,i)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,i,s){const r=t.collectionGroup;let o=Fi();return this.indexManager.getCollectionParents(e,r).next(l=>P.forEach(l,c=>{const h=function(g,_){return new lo(_,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(t,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,h,i,s).next(f=>{f.forEach((g,_)=>{o=o.insert(g,_)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,i,s){let r;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,r,s))).next(o=>{r.forEach((c,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,Me.newInvalidDocument(f)))});let l=Fi();return o.forEach((c,h)=>{const f=r.get(c);f!==void 0&&Qi(f.mutation,h,it.empty(),me.now()),uo(t,h)&&(l=l.insert(c,h))}),l})}}/**
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
 */class IA{constructor(e){this.serializer=e,this.cr=new Map,this.lr=new Map}getBundleMetadata(e,t){return P.resolve(this.cr.get(t))}saveBundleMetadata(e,t){return this.cr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:ut(s.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.lr.get(t))}saveNamedQuery(e,t){return this.lr.set(t.name,function(s){return{name:s.name,query:gA(s.bundledQuery),readTime:ut(s.readTime)}}(t)),P.resolve()}}/**
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
 */class TA{constructor(){this.overlays=new le(L.comparator),this.hr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const i=rn();return P.forEach(t,s=>this.getOverlay(e,s).next(r=>{r!==null&&i.set(s,r)})).next(()=>i)}saveOverlays(e,t,i){return i.forEach((s,r)=>{this.ht(e,t,r)}),P.resolve()}removeOverlaysForBatchId(e,t,i){const s=this.hr.get(i);return s!==void 0&&(s.forEach(r=>this.overlays=this.overlays.remove(r)),this.hr.delete(i)),P.resolve()}getOverlaysForCollection(e,t,i){const s=rn(),r=t.length+1,o=new L(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===r&&c.largestBatchId>i&&s.set(c.getKey(),c)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,i,s){let r=new le((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>i){let f=r.get(h.largestBatchId);f===null&&(f=rn(),r=r.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=rn(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,f)=>l.set(h,f)),!(l.size()>=s)););return P.resolve(l)}ht(e,t,i){const s=this.overlays.get(i.key);if(s!==null){const o=this.hr.get(s.largestBatchId).delete(i.key);this.hr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new Hw(t,i));let r=this.hr.get(t);r===void 0&&(r=K(),this.hr.set(t,r)),this.hr.set(t,r.add(i.key))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(){this.Pr=new Ce(ve.Ir),this.Tr=new Ce(ve.Er)}isEmpty(){return this.Pr.isEmpty()}addReference(e,t){const i=new ve(e,t);this.Pr=this.Pr.add(i),this.Tr=this.Tr.add(i)}dr(e,t){e.forEach(i=>this.addReference(i,t))}removeReference(e,t){this.Ar(new ve(e,t))}Rr(e,t){e.forEach(i=>this.removeReference(i,t))}Vr(e){const t=new L(new ue([])),i=new ve(t,e),s=new ve(t,e+1),r=[];return this.Tr.forEachInRange([i,s],o=>{this.Ar(o),r.push(o.key)}),r}mr(){this.Pr.forEach(e=>this.Ar(e))}Ar(e){this.Pr=this.Pr.delete(e),this.Tr=this.Tr.delete(e)}gr(e){const t=new L(new ue([])),i=new ve(t,e),s=new ve(t,e+1);let r=K();return this.Tr.forEachInRange([i,s],o=>{r=r.add(o.key)}),r}containsKey(e){const t=new ve(e,0),i=this.Pr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class ve{constructor(e,t){this.key=e,this.pr=t}static Ir(e,t){return L.comparator(e.key,t.key)||J(e.pr,t.pr)}static Er(e,t){return J(e.pr,t.pr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.yr=1,this.wr=new Ce(ve.Ir)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,s){const r=this.yr;this.yr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Ww(r,t,i,s);this.mutationQueue.push(o);for(const l of s)this.wr=this.wr.add(new ve(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return P.resolve(o)}lookupMutationBatch(e,t){return P.resolve(this.Sr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,s=this.br(i),r=s<0?0:s;return P.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?-1:this.yr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new ve(t,0),s=new ve(t,Number.POSITIVE_INFINITY),r=[];return this.wr.forEachInRange([i,s],o=>{const l=this.Sr(o.pr);r.push(l)}),P.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new Ce(J);return t.forEach(s=>{const r=new ve(s,0),o=new ve(s,Number.POSITIVE_INFINITY);this.wr.forEachInRange([r,o],l=>{i=i.add(l.pr)})}),P.resolve(this.Dr(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,s=i.length+1;let r=i;L.isDocumentKey(r)||(r=r.child(""));const o=new ve(new L(r),0);let l=new Ce(J);return this.wr.forEachWhile(c=>{const h=c.key.path;return!!i.isPrefixOf(h)&&(h.length===s&&(l=l.add(c.pr)),!0)},o),P.resolve(this.Dr(l))}Dr(e){const t=[];return e.forEach(i=>{const s=this.Sr(i);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){ie(this.Cr(t.batchId,"removed")===0),this.mutationQueue.shift();let i=this.wr;return P.forEach(t.mutations,s=>{const r=new ve(s.key,t.batchId);return i=i.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.wr=i})}Mn(e){}containsKey(e,t){const i=new ve(t,0),s=this.wr.firstAfterOrEqual(i);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Cr(e,t){return this.br(e)}br(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Sr(e){const t=this.br(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AA{constructor(e){this.vr=e,this.docs=function(){return new le(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,s=this.docs.get(i),r=s?s.size:0,o=this.vr(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return P.resolve(i?i.document.mutableCopy():Me.newInvalidDocument(t))}getEntries(e,t){let i=Ct();return t.forEach(s=>{const r=this.docs.get(s);i=i.insert(s,r?r.document.mutableCopy():Me.newInvalidDocument(s))}),P.resolve(i)}getDocumentsMatchingQuery(e,t,i,s){let r=Ct();const o=t.path,l=new L(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:h,value:{document:f}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||lw(aw(f),i)<=0||(s.has(f.key)||uo(t,f))&&(r=r.insert(f.key,f.mutableCopy()))}return P.resolve(r)}getAllFromCollectionGroup(e,t,i,s){U()}Fr(e,t){return P.forEach(this.docs,i=>t(i))}newChangeBuffer(e){return new CA(this)}getSize(e){return P.resolve(this.size)}}class CA extends yA{constructor(e){super(),this.ar=e}applyChanges(e){const t=[];return this.changes.forEach((i,s)=>{s.isValidDocument()?t.push(this.ar.addEntry(e,s)):this.ar.removeEntry(i)}),P.waitFor(t)}getFromCache(e,t){return this.ar.getEntry(e,t)}getAllFromCache(e,t){return this.ar.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(e){this.persistence=e,this.Mr=new li(t=>ql(t),jl),this.lastRemoteSnapshotVersion=B.min(),this.highestTargetId=0,this.Or=0,this.Nr=new Gl,this.targetCount=0,this.Lr=Zn.Nn()}forEachTarget(e,t){return this.Mr.forEach((i,s)=>t(s)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.Or)}allocateTargetId(e){return this.highestTargetId=this.Lr.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.Or&&(this.Or=t),P.resolve()}qn(e){this.Mr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Lr=new Zn(t),this.highestTargetId=t),e.sequenceNumber>this.Or&&(this.Or=e.sequenceNumber)}addTargetData(e,t){return this.qn(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.qn(t),P.resolve()}removeTargetData(e,t){return this.Mr.delete(t.target),this.Nr.Vr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,i){let s=0;const r=[];return this.Mr.forEach((o,l)=>{l.sequenceNumber<=t&&i.get(l.targetId)===null&&(this.Mr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),P.waitFor(r).next(()=>s)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const i=this.Mr.get(t)||null;return P.resolve(i)}addMatchingKeys(e,t,i){return this.Nr.dr(t,i),P.resolve()}removeMatchingKeys(e,t,i){this.Nr.Rr(t,i);const s=this.persistence.referenceDelegate,r=[];return s&&t.forEach(o=>{r.push(s.markPotentiallyOrphaned(e,o))}),P.waitFor(r)}removeMatchingKeysForTargetId(e,t){return this.Nr.Vr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const i=this.Nr.gr(t);return P.resolve(i)}containsKey(e,t){return P.resolve(this.Nr.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RA{constructor(e,t){this.Br={},this.overlays={},this.kr=new xl(0),this.qr=!1,this.qr=!0,this.referenceDelegate=e(this),this.Qr=new SA(this),this.indexManager=new _A,this.remoteDocumentCache=function(s){return new AA(s)}(i=>this.referenceDelegate.Kr(i)),this.serializer=new pA(t),this.$r=new IA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.qr=!1,Promise.resolve()}get started(){return this.qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new TA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.Br[e.toKey()];return i||(i=new wA(t,this.referenceDelegate),this.Br[e.toKey()]=i),i}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.$r}runTransaction(e,t,i){M("MemoryPersistence","Starting transaction:",e);const s=new PA(this.kr.next());return this.referenceDelegate.Ur(),i(s).next(r=>this.referenceDelegate.Wr(s).next(()=>r)).toPromise().then(r=>(s.raiseOnCommittedEvent(),r))}Gr(e,t){return P.or(Object.values(this.Br).map(i=>()=>i.containsKey(e,t)))}}class PA extends uw{constructor(e){super(),this.currentSequenceNumber=e}}class Kl{constructor(e){this.persistence=e,this.zr=new Gl,this.jr=null}static Hr(e){return new Kl(e)}get Jr(){if(this.jr)return this.jr;throw U()}addReference(e,t,i){return this.zr.addReference(i,t),this.Jr.delete(i.toString()),P.resolve()}removeReference(e,t,i){return this.zr.removeReference(i,t),this.Jr.add(i.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.Jr.add(t.toString()),P.resolve()}removeTarget(e,t){this.zr.Vr(t.targetId).forEach(s=>this.Jr.add(s.toString()));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(r=>this.Jr.add(r.toString()))}).next(()=>i.removeTargetData(e,t))}Ur(){this.jr=new Set}Wr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.Jr,i=>{const s=L.fromPath(i);return this.Yr(e,s).next(r=>{r||t.removeEntry(s,B.min())})}).next(()=>(this.jr=null,t.apply(e)))}updateLimboDocument(e,t){return this.Yr(e,t).next(i=>{i?this.Jr.delete(t.toString()):this.Jr.add(t.toString())})}Kr(e){return 0}Yr(e,t){return P.or([()=>P.resolve(this.zr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Gr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(e,t,i,s){this.targetId=e,this.fromCache=t,this.qi=i,this.Qi=s}static Ki(e,t){let i=K(),s=K();for(const r of t.docChanges)switch(r.type){case 0:i=i.add(r.doc.key);break;case 1:s=s.add(r.doc.key)}return new Ql(e,t.fromCache,i,s)}}/**
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
 */class bA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class kA{constructor(){this.$i=!1,this.Ui=!1,this.Wi=100,this.Gi=function(){return um()?8:hw(Se())>0?6:4}()}initialize(e,t){this.zi=e,this.indexManager=t,this.$i=!0}getDocumentsMatchingQuery(e,t,i,s){const r={result:null};return this.ji(e,t).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Hi(e,t,s,i).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new bA;return this.Ji(e,t,o).next(l=>{if(r.result=l,this.Ui)return this.Yi(e,t,o,l.size)})}).next(()=>r.result)}Yi(e,t,i,s){return i.documentReadCount<this.Wi?(Oi()<=G.DEBUG&&M("QueryEngine","SDK will not create cache indexes for query:",On(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Wi,"documents"),P.resolve()):(Oi()<=G.DEBUG&&M("QueryEngine","Query:",On(t),"scans",i.documentReadCount,"local documents and returns",s,"documents as results."),i.documentReadCount>this.Gi*s?(Oi()<=G.DEBUG&&M("QueryEngine","The SDK decides to create cache indexes for query:",On(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ct(t))):P.resolve())}ji(e,t){if(bh(t))return P.resolve(null);let i=ct(t);return this.indexManager.getIndexType(e,i).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Ma(t,null,"F"),i=ct(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next(r=>{const o=K(...r);return this.zi.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,i).next(c=>{const h=this.Zi(t,l);return this.Xi(t,h,o,c.readTime)?this.ji(e,Ma(t,null,"F")):this.es(e,h,t,c)}))})))}Hi(e,t,i,s){return bh(t)||s.isEqual(B.min())?P.resolve(null):this.zi.getDocuments(e,i).next(r=>{const o=this.Zi(t,r);return this.Xi(t,o,i,s)?P.resolve(null):(Oi()<=G.DEBUG&&M("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),On(t)),this.es(e,o,t,ow(s,-1)).next(l=>l))})}Zi(e,t){let i=new Ce(Bp(e));return t.forEach((s,r)=>{uo(e,r)&&(i=i.add(r))}),i}Xi(e,t,i,s){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const r=e.limitType==="F"?t.last():t.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(s)>0)}Ji(e,t,i){return Oi()<=G.DEBUG&&M("QueryEngine","Using full collection scan to execute query:",On(t)),this.zi.getDocumentsMatchingQuery(e,t,Ht.min(),i)}es(e,t,i,s){return this.zi.getDocumentsMatchingQuery(e,i,s).next(r=>(t.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
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
 */class NA{constructor(e,t,i,s){this.persistence=e,this.ts=t,this.serializer=s,this.ns=new le(J),this.rs=new li(r=>ql(r),jl),this.ss=new Map,this.os=e.getRemoteDocumentCache(),this.Qr=e.getTargetCache(),this.$r=e.getBundleCache(),this._s(i)}_s(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new EA(this.os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.os.setIndexManager(this.indexManager),this.ts.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.ns))}}function DA(n,e,t,i){return new NA(n,e,t,i)}async function cg(n,e){const t=q(n);return await t.persistence.runTransaction("Handle user change","readonly",i=>{let s;return t.mutationQueue.getAllMutationBatches(i).next(r=>(s=r,t._s(e),t.mutationQueue.getAllMutationBatches(i))).next(r=>{const o=[],l=[];let c=K();for(const h of s){o.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}for(const h of r){l.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(i,c).next(h=>({us:h,removedBatchIds:o,addedBatchIds:l}))})})}function OA(n,e){const t=q(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",i=>{const s=e.batch.keys(),r=t.os.newChangeBuffer({trackRemovals:!0});return function(l,c,h,f){const g=h.batch,_=g.keys();let A=P.resolve();return _.forEach(R=>{A=A.next(()=>f.getEntry(c,R)).next(O=>{const k=h.docVersions.get(R);ie(k!==null),O.version.compareTo(k)<0&&(g.applyToRemoteDocument(O,h),O.isValidDocument()&&(O.setReadTime(h.commitVersion),f.addEntry(O)))})}),A.next(()=>l.mutationQueue.removeMutationBatch(c,g))}(t,i,e,r).next(()=>r.apply(i)).next(()=>t.mutationQueue.performConsistencyCheck(i)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(i,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,function(l){let c=K();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(c=c.add(l.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(i,s))})}function ug(n){const e=q(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Qr.getLastRemoteSnapshotVersion(t))}function MA(n,e){const t=q(n),i=e.snapshotVersion;let s=t.ns;return t.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=t.os.newChangeBuffer({trackRemovals:!0});s=t.ns;const l=[];e.targetChanges.forEach((f,g)=>{const _=s.get(g);if(!_)return;l.push(t.Qr.removeMatchingKeys(r,f.removedDocuments,g).next(()=>t.Qr.addMatchingKeys(r,f.addedDocuments,g)));let A=_.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(g)!==null?A=A.withResumeToken(Le.EMPTY_BYTE_STRING,B.min()).withLastLimboFreeSnapshotVersion(B.min()):f.resumeToken.approximateByteSize()>0&&(A=A.withResumeToken(f.resumeToken,i)),s=s.insert(g,A),function(O,k,j){return O.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=3e8?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0}(_,A,f)&&l.push(t.Qr.updateTargetData(r,A))});let c=Ct(),h=K();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(r,f))}),l.push(LA(r,o,e.documentUpdates).next(f=>{c=f.cs,h=f.ls})),!i.isEqual(B.min())){const f=t.Qr.getLastRemoteSnapshotVersion(r).next(g=>t.Qr.setTargetsMetadata(r,r.currentSequenceNumber,i));l.push(f)}return P.waitFor(l).next(()=>o.apply(r)).next(()=>t.localDocuments.getLocalViewOfDocuments(r,c,h)).next(()=>c)}).then(r=>(t.ns=s,r))}function LA(n,e,t){let i=K(),s=K();return t.forEach(r=>i=i.add(r)),e.getEntries(n,i).next(r=>{let o=Ct();return t.forEach((l,c)=>{const h=r.get(l);c.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(B.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):M("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",c.version)}),{cs:o,ls:s}})}function VA(n,e){const t=q(n);return t.persistence.runTransaction("Get next mutation batch","readonly",i=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e)))}function xA(n,e){const t=q(n);return t.persistence.runTransaction("Allocate target","readwrite",i=>{let s;return t.Qr.getTargetData(i,e).next(r=>r?(s=r,P.resolve(s)):t.Qr.allocateTargetId(i).next(o=>(s=new Ft(e,o,"TargetPurposeListen",i.currentSequenceNumber),t.Qr.addTargetData(i,s).next(()=>s))))}).then(i=>{const s=t.ns.get(i.targetId);return(s===null||i.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.ns=t.ns.insert(i.targetId,i),t.rs.set(e,i.targetId)),i})}async function Ua(n,e,t){const i=q(n),s=i.ns.get(e),r=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",r,o=>i.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Ss(o))throw o;M("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}i.ns=i.ns.remove(e),i.rs.delete(s.target)}function Bh(n,e,t){const i=q(n);let s=B.min(),r=K();return i.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,f){const g=q(c),_=g.rs.get(f);return _!==void 0?P.resolve(g.ns.get(_)):g.Qr.getTargetData(h,f)}(i,o,ct(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,i.Qr.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>i.ts.getDocumentsMatchingQuery(o,e,t?s:B.min(),t?r:K())).next(l=>(FA(i,bw(e),l),{documents:l,hs:r})))}function FA(n,e,t){let i=n.ss.get(e)||B.min();t.forEach((s,r)=>{r.readTime.compareTo(i)>0&&(i=r.readTime)}),n.ss.set(e,i)}class qh{constructor(){this.activeTargetIds=Lw()}As(e){this.activeTargetIds=this.activeTargetIds.add(e)}Rs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ds(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class UA{constructor(){this.no=new qh,this.ro={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e){return this.no.As(e),this.ro[e]||"not-current"}updateQueryState(e,t,i){this.ro[e]=t}removeLocalQueryTarget(e){this.no.Rs(e)}isLocalQueryTarget(e){return this.no.activeTargetIds.has(e)}clearQueryState(e){delete this.ro[e]}getAllActiveQueryTargets(){return this.no.activeTargetIds}isActiveQueryTarget(e){return this.no.activeTargetIds.has(e)}start(){return this.no=new qh,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class BA{io(e){}shutdown(){}}/**
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
 */class jh{constructor(){this.so=()=>this.oo(),this._o=()=>this.ao(),this.uo=[],this.co()}io(e){this.uo.push(e)}shutdown(){window.removeEventListener("online",this.so),window.removeEventListener("offline",this._o)}co(){window.addEventListener("online",this.so),window.addEventListener("offline",this._o)}oo(){M("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.uo)e(0)}ao(){M("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.uo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ir=null;function oa(){return ir===null?ir=function(){return 268435456+Math.round(2147483648*Math.random())}():ir++,"0x"+ir.toString(16)}/**
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
 */const qA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jA{constructor(e){this.lo=e.lo,this.ho=e.ho}Po(e){this.Io=e}To(e){this.Eo=e}Ao(e){this.Ro=e}onMessage(e){this.Vo=e}close(){this.ho()}send(e){this.lo(e)}mo(){this.Io()}fo(){this.Eo()}po(e){this.Ro(e)}yo(e){this.Vo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ne="WebChannelConnection";class $A extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const i=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.wo=i+"://"+t.host,this.So=`projects/${s}/databases/${r}`,this.bo=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${r}`}get Do(){return!1}Co(t,i,s,r,o){const l=oa(),c=this.vo(t,i.toUriEncodedString());M("RestConnection",`Sending RPC '${t}' ${l}:`,c,s);const h={"google-cloud-resource-prefix":this.So,"x-goog-request-params":this.bo};return this.Fo(h,r,o),this.Mo(t,c,h,s).then(f=>(M("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw Qn("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}xo(t,i,s,r,o,l){return this.Co(t,i,s,r,o)}Fo(t,i,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+oi}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),i&&i.headers.forEach((r,o)=>t[o]=r),s&&s.headers.forEach((r,o)=>t[o]=r)}vo(t,i){const s=qA[t];return`${this.wo}/v1/${i}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Mo(e,t,i,s){const r=oa();return new Promise((o,l)=>{const c=new Tp;c.setWithCredentials(!0),c.listenOnce(Ap.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case ar.NO_ERROR:const f=c.getResponseJson();M(Ne,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(f)),o(f);break;case ar.TIMEOUT:M(Ne,`RPC '${e}' ${r} timed out`),l(new V(b.DEADLINE_EXCEEDED,"Request time out"));break;case ar.HTTP_ERROR:const g=c.getStatus();if(M(Ne,`RPC '${e}' ${r} failed with status:`,g,"response text:",c.getResponseText()),g>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const A=_==null?void 0:_.error;if(A&&A.status&&A.message){const R=function(k){const j=k.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(j)>=0?j:b.UNKNOWN}(A.status);l(new V(R,A.message))}else l(new V(b.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new V(b.UNAVAILABLE,"Connection failed."));break;default:U()}}finally{M(Ne,`RPC '${e}' ${r} completed.`)}});const h=JSON.stringify(s);M(Ne,`RPC '${e}' ${r} sending request:`,s),c.send(t,"POST",h,i,15)})}Oo(e,t,i){const s=oa(),r=[this.wo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Rp(),l=Sp(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.xmlHttpFactory=new wp({})),this.Fo(c.initMessageHeaders,t,i),c.encodeInitMessageHeaders=!0;const f=r.join("");M(Ne,`Creating RPC '${e}' stream ${s}: ${f}`,c);const g=o.createWebChannel(f,c);let _=!1,A=!1;const R=new jA({lo:k=>{A?M(Ne,`Not sending because RPC '${e}' stream ${s} is closed:`,k):(_||(M(Ne,`Opening RPC '${e}' stream ${s} transport.`),g.open(),_=!0),M(Ne,`RPC '${e}' stream ${s} sending:`,k),g.send(k))},ho:()=>g.close()}),O=(k,j,z)=>{k.listen(j,Q=>{try{z(Q)}catch(oe){setTimeout(()=>{throw oe},0)}})};return O(g,xi.EventType.OPEN,()=>{A||(M(Ne,`RPC '${e}' stream ${s} transport opened.`),R.mo())}),O(g,xi.EventType.CLOSE,()=>{A||(A=!0,M(Ne,`RPC '${e}' stream ${s} transport closed`),R.po())}),O(g,xi.EventType.ERROR,k=>{A||(A=!0,Qn(Ne,`RPC '${e}' stream ${s} transport errored:`,k),R.po(new V(b.UNAVAILABLE,"The operation could not be completed")))}),O(g,xi.EventType.MESSAGE,k=>{var j;if(!A){const z=k.data[0];ie(!!z);const Q=z,oe=Q.error||((j=Q[0])===null||j===void 0?void 0:j.error);if(oe){M(Ne,`RPC '${e}' stream ${s} received error:`,oe);const Ge=oe.status;let de=function(v){const E=fe[v];if(E!==void 0)return Zp(E)}(Ge),I=oe.message;de===void 0&&(de=b.INTERNAL,I="Unknown error status: "+Ge+" with message "+oe.message),A=!0,R.po(new V(de,I)),g.close()}else M(Ne,`RPC '${e}' stream ${s} received:`,z),R.yo(z)}}),O(l,Cp.STAT_EVENT,k=>{k.stat===ba.PROXY?M(Ne,`RPC '${e}' stream ${s} detected buffering proxy`):k.stat===ba.NOPROXY&&M(Ne,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{R.fo()},0),R}}function aa(){return typeof document<"u"?document:null}/**
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
 */function go(n){return new eA(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{constructor(e,t,i=1e3,s=1.5,r=6e4){this.oi=e,this.timerId=t,this.No=i,this.Lo=s,this.Bo=r,this.ko=0,this.qo=null,this.Qo=Date.now(),this.reset()}reset(){this.ko=0}Ko(){this.ko=this.Bo}$o(e){this.cancel();const t=Math.floor(this.ko+this.Uo()),i=Math.max(0,Date.now()-this.Qo),s=Math.max(0,t-i);s>0&&M("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.ko} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.qo=this.oi.enqueueAfterDelay(this.timerId,s,()=>(this.Qo=Date.now(),e())),this.ko*=this.Lo,this.ko<this.No&&(this.ko=this.No),this.ko>this.Bo&&(this.ko=this.Bo)}Wo(){this.qo!==null&&(this.qo.skipDelay(),this.qo=null)}cancel(){this.qo!==null&&(this.qo.cancel(),this.qo=null)}Uo(){return(Math.random()-.5)*this.ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e,t,i,s,r,o,l,c){this.oi=e,this.Go=i,this.zo=s,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.jo=0,this.Ho=null,this.Jo=null,this.stream=null,this.Yo=new hg(e,t)}Zo(){return this.state===1||this.state===5||this.Xo()}Xo(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.e_()}async stop(){this.Zo()&&await this.close(0)}t_(){this.state=0,this.Yo.reset()}n_(){this.Xo()&&this.Ho===null&&(this.Ho=this.oi.enqueueAfterDelay(this.Go,6e4,()=>this.r_()))}i_(e){this.s_(),this.stream.send(e)}async r_(){if(this.Xo())return this.close(0)}s_(){this.Ho&&(this.Ho.cancel(),this.Ho=null)}o_(){this.Jo&&(this.Jo.cancel(),this.Jo=null)}async close(e,t){this.s_(),this.o_(),this.Yo.cancel(),this.jo++,e!==4?this.Yo.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(At(t.toString()),At("Using maximum backoff delay to prevent overloading the backend."),this.Yo.Ko()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.__(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ao(t)}__(){}auth(){this.state=1;const e=this.a_(this.jo),t=this.jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([i,s])=>{this.jo===t&&this.u_(i,s)},i=>{e(()=>{const s=new V(b.UNKNOWN,"Fetching auth token failed: "+i.message);return this.c_(s)})})}u_(e,t){const i=this.a_(this.jo);this.stream=this.l_(e,t),this.stream.Po(()=>{i(()=>this.listener.Po())}),this.stream.To(()=>{i(()=>(this.state=2,this.Jo=this.oi.enqueueAfterDelay(this.zo,1e4,()=>(this.Xo()&&(this.state=3),Promise.resolve())),this.listener.To()))}),this.stream.Ao(s=>{i(()=>this.c_(s))}),this.stream.onMessage(s=>{i(()=>this.onMessage(s))})}e_(){this.state=5,this.Yo.$o(async()=>{this.state=0,this.start()})}c_(e){return M("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}a_(e){return t=>{this.oi.enqueueAndForget(()=>this.jo===e?t():(M("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class WA extends dg{constructor(e,t,i,s,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,s,o),this.serializer=r}l_(e,t){return this.connection.Oo("Listen",e,t)}onMessage(e){this.Yo.reset();const t=iA(this.serializer,e),i=function(r){if(!("targetChange"in r))return B.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?B.min():o.readTime?ut(o.readTime):B.min()}(e);return this.listener.h_(t,i)}P_(e){const t={};t.database=Fa(this.serializer),t.addTarget=function(r,o){let l;const c=o.target;if(l=Oa(c)?{documents:oA(r,c)}:{query:aA(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=ng(r,o.resumeToken);const h=La(r,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(B.min())>0){l.readTime=Fr(r,o.snapshotVersion.toTimestamp());const h=La(r,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const i=cA(this.serializer,e);i&&(t.labels=i),this.i_(t)}I_(e){const t={};t.database=Fa(this.serializer),t.removeTarget=e,this.i_(t)}}class HA extends dg{constructor(e,t,i,s,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,s,o),this.serializer=r,this.T_=!1}get E_(){return this.T_}start(){this.T_=!1,this.lastStreamToken=void 0,super.start()}__(){this.T_&&this.d_([])}l_(e,t){return this.connection.Oo("Write",e,t)}onMessage(e){if(ie(!!e.streamToken),this.lastStreamToken=e.streamToken,this.T_){this.Yo.reset();const t=rA(e.writeResults,e.commitTime),i=ut(e.commitTime);return this.listener.A_(i,t)}return ie(!e.writeResults||e.writeResults.length===0),this.T_=!0,this.listener.R_()}V_(){const e={};e.database=Fa(this.serializer),this.i_(e)}d_(e){const t={streamToken:this.lastStreamToken,writes:e.map(i=>sA(this.serializer,i))};this.i_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zA extends class{}{constructor(e,t,i,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=s,this.m_=!1}f_(){if(this.m_)throw new V(b.FAILED_PRECONDITION,"The client has already been terminated.")}Co(e,t,i,s){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Co(e,Va(t,i),s,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new V(b.UNKNOWN,r.toString())})}xo(e,t,i,s,r){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.xo(e,Va(t,i),s,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(b.UNKNOWN,o.toString())})}terminate(){this.m_=!0,this.connection.terminate()}}class GA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.g_=0,this.p_=null,this.y_=!0}w_(){this.g_===0&&(this.S_("Unknown"),this.p_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.p_=null,this.b_("Backend didn't respond within 10 seconds."),this.S_("Offline"),Promise.resolve())))}D_(e){this.state==="Online"?this.S_("Unknown"):(this.g_++,this.g_>=1&&(this.C_(),this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.S_("Offline")))}set(e){this.C_(),this.g_=0,e==="Online"&&(this.y_=!1),this.S_(e)}S_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}b_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.y_?(At(t),this.y_=!1):M("OnlineStateTracker",t)}C_(){this.p_!==null&&(this.p_.cancel(),this.p_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KA{constructor(e,t,i,s,r){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.v_=[],this.F_=new Map,this.M_=new Set,this.x_=[],this.O_=r,this.O_.io(o=>{i.enqueueAndForget(async()=>{Cn(this)&&(M("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=q(c);h.M_.add(4),await bs(h),h.N_.set("Unknown"),h.M_.delete(4),await _o(h)}(this))})}),this.N_=new GA(i,s)}}async function _o(n){if(Cn(n))for(const e of n.x_)await e(!0)}async function bs(n){for(const e of n.x_)await e(!1)}function fg(n,e){const t=q(n);t.F_.has(e.targetId)||(t.F_.set(e.targetId,e),Zl(t)?Jl(t):ci(t).Xo()&&Xl(t,e))}function Yl(n,e){const t=q(n),i=ci(t);t.F_.delete(e),i.Xo()&&pg(t,e),t.F_.size===0&&(i.Xo()?i.n_():Cn(t)&&t.N_.set("Unknown"))}function Xl(n,e){if(n.L_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(B.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ci(n).P_(e)}function pg(n,e){n.L_.xe(e),ci(n).I_(e)}function Jl(n){n.L_=new Yw({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.F_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ci(n).start(),n.N_.w_()}function Zl(n){return Cn(n)&&!ci(n).Zo()&&n.F_.size>0}function Cn(n){return q(n).M_.size===0}function gg(n){n.L_=void 0}async function QA(n){n.N_.set("Online")}async function YA(n){n.F_.forEach((e,t)=>{Xl(n,e)})}async function XA(n,e){gg(n),Zl(n)?(n.N_.D_(e),Jl(n)):n.N_.set("Unknown")}async function JA(n,e,t){if(n.N_.set("Online"),e instanceof tg&&e.state===2&&e.cause)try{await async function(s,r){const o=r.cause;for(const l of r.targetIds)s.F_.has(l)&&(await s.remoteSyncer.rejectListen(l,o),s.F_.delete(l),s.L_.removeTarget(l))}(n,e)}catch(i){M("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),i),await Ur(n,i)}else if(e instanceof ur?n.L_.Ke(e):e instanceof eg?n.L_.He(e):n.L_.We(e),!t.isEqual(B.min()))try{const i=await ug(n.localStore);t.compareTo(i)>=0&&await function(r,o){const l=r.L_.rt(o);return l.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const f=r.F_.get(h);f&&r.F_.set(h,f.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,h)=>{const f=r.F_.get(c);if(!f)return;r.F_.set(c,f.withResumeToken(Le.EMPTY_BYTE_STRING,f.snapshotVersion)),pg(r,c);const g=new Ft(f.target,c,h,f.sequenceNumber);Xl(r,g)}),r.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(i){M("RemoteStore","Failed to raise snapshot:",i),await Ur(n,i)}}async function Ur(n,e,t){if(!Ss(e))throw e;n.M_.add(1),await bs(n),n.N_.set("Offline"),t||(t=()=>ug(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{M("RemoteStore","Retrying IndexedDB access"),await t(),n.M_.delete(1),await _o(n)})}function _g(n,e){return e().catch(t=>Ur(n,t,e))}async function mo(n){const e=q(n),t=Gt(e);let i=e.v_.length>0?e.v_[e.v_.length-1].batchId:-1;for(;ZA(e);)try{const s=await VA(e.localStore,i);if(s===null){e.v_.length===0&&t.n_();break}i=s.batchId,eC(e,s)}catch(s){await Ur(e,s)}mg(e)&&yg(e)}function ZA(n){return Cn(n)&&n.v_.length<10}function eC(n,e){n.v_.push(e);const t=Gt(n);t.Xo()&&t.E_&&t.d_(e.mutations)}function mg(n){return Cn(n)&&!Gt(n).Zo()&&n.v_.length>0}function yg(n){Gt(n).start()}async function tC(n){Gt(n).V_()}async function nC(n){const e=Gt(n);for(const t of n.v_)e.d_(t.mutations)}async function iC(n,e,t){const i=n.v_.shift(),s=Wl.from(i,e,t);await _g(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await mo(n)}async function sC(n,e){e&&Gt(n).E_&&await async function(i,s){if(function(o){return Gw(o)&&o!==b.ABORTED}(s.code)){const r=i.v_.shift();Gt(i).t_(),await _g(i,()=>i.remoteSyncer.rejectFailedWrite(r.batchId,s)),await mo(i)}}(n,e),mg(n)&&yg(n)}async function $h(n,e){const t=q(n);t.asyncQueue.verifyOperationInProgress(),M("RemoteStore","RemoteStore received new credentials");const i=Cn(t);t.M_.add(3),await bs(t),i&&t.N_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.M_.delete(3),await _o(t)}async function rC(n,e){const t=q(n);e?(t.M_.delete(2),await _o(t)):e||(t.M_.add(2),await bs(t),t.N_.set("Unknown"))}function ci(n){return n.B_||(n.B_=function(t,i,s){const r=q(t);return r.f_(),new WA(i,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)}(n.datastore,n.asyncQueue,{Po:QA.bind(null,n),To:YA.bind(null,n),Ao:XA.bind(null,n),h_:JA.bind(null,n)}),n.x_.push(async e=>{e?(n.B_.t_(),Zl(n)?Jl(n):n.N_.set("Unknown")):(await n.B_.stop(),gg(n))})),n.B_}function Gt(n){return n.k_||(n.k_=function(t,i,s){const r=q(t);return r.f_(),new HA(i,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)}(n.datastore,n.asyncQueue,{Po:()=>Promise.resolve(),To:tC.bind(null,n),Ao:sC.bind(null,n),R_:nC.bind(null,n),A_:iC.bind(null,n)}),n.x_.push(async e=>{e?(n.k_.t_(),await mo(n)):(await n.k_.stop(),n.v_.length>0&&(M("RemoteStore",`Stopping write stream with ${n.v_.length} pending writes`),n.v_=[]))})),n.k_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(e,t,i,s,r){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=s,this.removalCallback=r,this.deferred=new qt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,s,r){const o=Date.now()+i,l=new ec(e,t,o,s,r);return l.start(i),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function tc(n,e){if(At("AsyncQueue",`${e}: ${n}`),Ss(n))return new V(b.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e){this.comparator=e?(t,i)=>e(t,i)||L.comparator(t.key,i.key):(t,i)=>L.comparator(t.key,i.key),this.keyedMap=Fi(),this.sortedSet=new le(this.comparator)}static emptySet(e){return new qn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,i)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof qn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,r=i.getNext().key;if(!s.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new qn;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(){this.q_=new le(L.comparator)}track(e){const t=e.doc.key,i=this.q_.get(t);i?e.type!==0&&i.type===3?this.q_=this.q_.insert(t,e):e.type===3&&i.type!==1?this.q_=this.q_.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.q_=this.q_.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.q_=this.q_.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.q_=this.q_.remove(t):e.type===1&&i.type===2?this.q_=this.q_.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.q_=this.q_.insert(t,{type:2,doc:e.doc}):U():this.q_=this.q_.insert(t,e)}Q_(){const e=[];return this.q_.inorderTraversal((t,i)=>{e.push(i)}),e}}class ei{constructor(e,t,i,s,r,o,l,c,h){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=s,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,i,s,r){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new ei(e,t,qn.emptySet(t),o,i,s,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&co(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==i[s].type||!t[s].doc.isEqual(i[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oC{constructor(){this.K_=void 0,this.U_=[]}W_(){return this.U_.some(e=>e.G_())}}class aC{constructor(){this.queries=new li(e=>Up(e),co),this.onlineState="Unknown",this.z_=new Set}}async function lC(n,e){const t=q(n);let i=3;const s=e.query;let r=t.queries.get(s);r?!r.W_()&&e.G_()&&(i=2):(r=new oC,i=e.G_()?0:1);try{switch(i){case 0:r.K_=await t.onListen(s,!0);break;case 1:r.K_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const l=tc(o,`Initialization of query '${On(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,r),r.U_.push(e),e.j_(t.onlineState),r.K_&&e.H_(r.K_)&&nc(t)}async function cC(n,e){const t=q(n),i=e.query;let s=3;const r=t.queries.get(i);if(r){const o=r.U_.indexOf(e);o>=0&&(r.U_.splice(o,1),r.U_.length===0?s=e.G_()?0:1:!r.W_()&&e.G_()&&(s=2))}switch(s){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function uC(n,e){const t=q(n);let i=!1;for(const s of e){const r=s.query,o=t.queries.get(r);if(o){for(const l of o.U_)l.H_(s)&&(i=!0);o.K_=s}}i&&nc(t)}function hC(n,e,t){const i=q(n),s=i.queries.get(e);if(s)for(const r of s.U_)r.onError(t);i.queries.delete(e)}function nc(n){n.z_.forEach(e=>{e.next()})}var Ba,Hh;(Hh=Ba||(Ba={})).J_="default",Hh.Cache="cache";class dC{constructor(e,t,i){this.query=e,this.Y_=t,this.Z_=!1,this.X_=null,this.onlineState="Unknown",this.options=i||{}}H_(e){if(!this.options.includeMetadataChanges){const i=[];for(const s of e.docChanges)s.type!==3&&i.push(s);e=new ei(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Z_?this.ea(e)&&(this.Y_.next(e),t=!0):this.ta(e,this.onlineState)&&(this.na(e),t=!0),this.X_=e,t}onError(e){this.Y_.error(e)}j_(e){this.onlineState=e;let t=!1;return this.X_&&!this.Z_&&this.ta(this.X_,e)&&(this.na(this.X_),t=!0),t}ta(e,t){if(!e.fromCache||!this.G_())return!0;const i=t!=="Offline";return(!this.options.ra||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ea(e){if(e.docChanges.length>0)return!0;const t=this.X_&&this.X_.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}na(e){e=ei.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Z_=!0,this.Y_.next(e)}G_(){return this.options.source!==Ba.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vg{constructor(e){this.key=e}}class Eg{constructor(e){this.key=e}}class fC{constructor(e,t){this.query=e,this.la=t,this.ha=null,this.hasCachedResults=!1,this.current=!1,this.Pa=K(),this.mutatedKeys=K(),this.Ia=Bp(e),this.Ta=new qn(this.Ia)}get Ea(){return this.la}da(e,t){const i=t?t.Aa:new Wh,s=t?t.Ta:this.Ta;let r=t?t.mutatedKeys:this.mutatedKeys,o=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,g)=>{const _=s.get(f),A=uo(this.query,g)?g:null,R=!!_&&this.mutatedKeys.has(_.key),O=!!A&&(A.hasLocalMutations||this.mutatedKeys.has(A.key)&&A.hasCommittedMutations);let k=!1;_&&A?_.data.isEqual(A.data)?R!==O&&(i.track({type:3,doc:A}),k=!0):this.Ra(_,A)||(i.track({type:2,doc:A}),k=!0,(c&&this.Ia(A,c)>0||h&&this.Ia(A,h)<0)&&(l=!0)):!_&&A?(i.track({type:0,doc:A}),k=!0):_&&!A&&(i.track({type:1,doc:_}),k=!0,(c||h)&&(l=!0)),k&&(A?(o=o.add(A),r=O?r.add(f):r.delete(f)):(o=o.delete(f),r=r.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),r=r.delete(f.key),i.track({type:1,doc:f})}return{Ta:o,Aa:i,Xi:l,mutatedKeys:r}}Ra(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,s){const r=this.Ta;this.Ta=e.Ta,this.mutatedKeys=e.mutatedKeys;const o=e.Aa.Q_();o.sort((f,g)=>function(A,R){const O=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return U()}};return O(A)-O(R)}(f.type,g.type)||this.Ia(f.doc,g.doc)),this.Va(i),s=s!=null&&s;const l=t&&!s?this.ma():[],c=this.Pa.size===0&&this.current&&!s?1:0,h=c!==this.ha;return this.ha=c,o.length!==0||h?{snapshot:new ei(this.query,e.Ta,r,o,e.mutatedKeys,c===0,h,!1,!!i&&i.resumeToken.approximateByteSize()>0),fa:l}:{fa:l}}j_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ta:this.Ta,Aa:new Wh,mutatedKeys:this.mutatedKeys,Xi:!1},!1)):{fa:[]}}ga(e){return!this.la.has(e)&&!!this.Ta.has(e)&&!this.Ta.get(e).hasLocalMutations}Va(e){e&&(e.addedDocuments.forEach(t=>this.la=this.la.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.la=this.la.delete(t)),this.current=e.current)}ma(){if(!this.current)return[];const e=this.Pa;this.Pa=K(),this.Ta.forEach(i=>{this.ga(i.key)&&(this.Pa=this.Pa.add(i.key))});const t=[];return e.forEach(i=>{this.Pa.has(i)||t.push(new Eg(i))}),this.Pa.forEach(i=>{e.has(i)||t.push(new vg(i))}),t}pa(e){this.la=e.hs,this.Pa=K();const t=this.da(e.documents);return this.applyChanges(t,!0)}ya(){return ei.fromInitialDocuments(this.query,this.Ta,this.mutatedKeys,this.ha===0,this.hasCachedResults)}}class pC{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class gC{constructor(e){this.key=e,this.wa=!1}}class _C{constructor(e,t,i,s,r,o){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=s,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Sa={},this.ba=new li(l=>Up(l),co),this.Da=new Map,this.Ca=new Set,this.va=new le(L.comparator),this.Fa=new Map,this.Ma=new Gl,this.xa={},this.Oa=new Map,this.Na=Zn.Ln(),this.onlineState="Unknown",this.La=void 0}get isPrimaryClient(){return this.La===!0}}async function mC(n,e,t=!0){const i=Sg(n);let s;const r=i.ba.get(e);return r?(i.sharedClientState.addLocalQueryTarget(r.targetId),s=r.view.ya()):s=await Ig(i,e,t,!0),s}async function yC(n,e){const t=Sg(n);await Ig(t,e,!0,!1)}async function Ig(n,e,t,i){const s=await xA(n.localStore,ct(e)),r=s.targetId,o=t?n.sharedClientState.addLocalQueryTarget(r):"not-current";let l;return i&&(l=await vC(n,e,r,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&fg(n.remoteStore,s),l}async function vC(n,e,t,i,s){n.Ba=(g,_,A)=>async function(O,k,j,z){let Q=k.view.da(j);Q.Xi&&(Q=await Bh(O.localStore,k.query,!1).then(({documents:I})=>k.view.da(I,Q)));const oe=z&&z.targetChanges.get(k.targetId),Ge=z&&z.targetMismatches.get(k.targetId)!=null,de=k.view.applyChanges(Q,O.isPrimaryClient,oe,Ge);return Gh(O,k.targetId,de.fa),de.snapshot}(n,g,_,A);const r=await Bh(n.localStore,e,!0),o=new fC(e,r.hs),l=o.da(r.documents),c=Ps.createSynthesizedTargetChangeForCurrentChange(t,i&&n.onlineState!=="Offline",s),h=o.applyChanges(l,n.isPrimaryClient,c);Gh(n,t,h.fa);const f=new pC(e,t,o);return n.ba.set(e,f),n.Da.has(t)?n.Da.get(t).push(e):n.Da.set(t,[e]),h.snapshot}async function EC(n,e,t){const i=q(n),s=i.ba.get(e),r=i.Da.get(s.targetId);if(r.length>1)return i.Da.set(s.targetId,r.filter(o=>!co(o,e))),void i.ba.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(s.targetId),i.sharedClientState.isActiveQueryTarget(s.targetId)||await Ua(i.localStore,s.targetId,!1).then(()=>{i.sharedClientState.clearQueryState(s.targetId),t&&Yl(i.remoteStore,s.targetId),qa(i,s.targetId)}).catch(Cs)):(qa(i,s.targetId),await Ua(i.localStore,s.targetId,!0))}async function IC(n,e){const t=q(n),i=t.ba.get(e),s=t.Da.get(i.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),Yl(t.remoteStore,i.targetId))}async function TC(n,e,t){const i=bC(n);try{const s=await function(o,l){const c=q(o),h=me.now(),f=l.reduce((A,R)=>A.add(R.key),K());let g,_;return c.persistence.runTransaction("Locally write mutations","readwrite",A=>{let R=Ct(),O=K();return c.os.getEntries(A,f).next(k=>{R=k,R.forEach((j,z)=>{z.isValidDocument()||(O=O.add(j))})}).next(()=>c.localDocuments.getOverlayedDocuments(A,R)).next(k=>{g=k;const j=[];for(const z of l){const Q=jw(z,g.get(z.key).overlayedDocument);Q!=null&&j.push(new An(z.key,Q,Dp(Q.value.mapValue),Tt.exists(!0)))}return c.mutationQueue.addMutationBatch(A,h,j,l)}).next(k=>{_=k;const j=k.applyToLocalDocumentSet(g,O);return c.documentOverlayCache.saveOverlays(A,k.batchId,j)})}).then(()=>({batchId:_.batchId,changes:jp(g)}))}(i.localStore,e);i.sharedClientState.addPendingMutation(s.batchId),function(o,l,c){let h=o.xa[o.currentUser.toKey()];h||(h=new le(J)),h=h.insert(l,c),o.xa[o.currentUser.toKey()]=h}(i,s.batchId,t),await ks(i,s.changes),await mo(i.remoteStore)}catch(s){const r=tc(s,"Failed to persist write");t.reject(r)}}async function Tg(n,e){const t=q(n);try{const i=await MA(t.localStore,e);e.targetChanges.forEach((s,r)=>{const o=t.Fa.get(r);o&&(ie(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.wa=!0:s.modifiedDocuments.size>0?ie(o.wa):s.removedDocuments.size>0&&(ie(o.wa),o.wa=!1))}),await ks(t,i,e)}catch(i){await Cs(i)}}function zh(n,e,t){const i=q(n);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const s=[];i.ba.forEach((r,o)=>{const l=o.view.j_(e);l.snapshot&&s.push(l.snapshot)}),function(o,l){const c=q(o);c.onlineState=l;let h=!1;c.queries.forEach((f,g)=>{for(const _ of g.U_)_.j_(l)&&(h=!0)}),h&&nc(c)}(i.eventManager,e),s.length&&i.Sa.h_(s),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function wC(n,e,t){const i=q(n);i.sharedClientState.updateQueryState(e,"rejected",t);const s=i.Fa.get(e),r=s&&s.key;if(r){let o=new le(L.comparator);o=o.insert(r,Me.newNoDocument(r,B.min()));const l=K().add(r),c=new po(B.min(),new Map,new le(J),o,l);await Tg(i,c),i.va=i.va.remove(r),i.Fa.delete(e),ic(i)}else await Ua(i.localStore,e,!1).then(()=>qa(i,e,t)).catch(Cs)}async function AC(n,e){const t=q(n),i=e.batch.batchId;try{const s=await OA(t.localStore,e);Ag(t,i,null),wg(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await ks(t,s)}catch(s){await Cs(s)}}async function CC(n,e,t){const i=q(n);try{const s=await function(o,l){const c=q(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return c.mutationQueue.lookupMutationBatch(h,l).next(g=>(ie(g!==null),f=g.keys(),c.mutationQueue.removeMutationBatch(h,g))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>c.localDocuments.getDocuments(h,f))})}(i.localStore,e);Ag(i,e,t),wg(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await ks(i,s)}catch(s){await Cs(s)}}function wg(n,e){(n.Oa.get(e)||[]).forEach(t=>{t.resolve()}),n.Oa.delete(e)}function Ag(n,e,t){const i=q(n);let s=i.xa[i.currentUser.toKey()];if(s){const r=s.get(e);r&&(t?r.reject(t):r.resolve(),s=s.remove(e)),i.xa[i.currentUser.toKey()]=s}}function qa(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const i of n.Da.get(e))n.ba.delete(i),t&&n.Sa.ka(i,t);n.Da.delete(e),n.isPrimaryClient&&n.Ma.Vr(e).forEach(i=>{n.Ma.containsKey(i)||Cg(n,i)})}function Cg(n,e){n.Ca.delete(e.path.canonicalString());const t=n.va.get(e);t!==null&&(Yl(n.remoteStore,t),n.va=n.va.remove(e),n.Fa.delete(t),ic(n))}function Gh(n,e,t){for(const i of t)i instanceof vg?(n.Ma.addReference(i.key,e),SC(n,i)):i instanceof Eg?(M("SyncEngine","Document no longer in limbo: "+i.key),n.Ma.removeReference(i.key,e),n.Ma.containsKey(i.key)||Cg(n,i.key)):U()}function SC(n,e){const t=e.key,i=t.path.canonicalString();n.va.get(t)||n.Ca.has(i)||(M("SyncEngine","New document in limbo: "+t),n.Ca.add(i),ic(n))}function ic(n){for(;n.Ca.size>0&&n.va.size<n.maxConcurrentLimboResolutions;){const e=n.Ca.values().next().value;n.Ca.delete(e);const t=new L(ue.fromString(e)),i=n.Na.next();n.Fa.set(i,new gC(t)),n.va=n.va.insert(t,i),fg(n.remoteStore,new Ft(ct($l(t.path)),i,"TargetPurposeLimboResolution",xl.oe))}}async function ks(n,e,t){const i=q(n),s=[],r=[],o=[];i.ba.isEmpty()||(i.ba.forEach((l,c)=>{o.push(i.Ba(c,e,t).then(h=>{if((h||t)&&i.isPrimaryClient){const f=h&&!h.fromCache;i.sharedClientState.updateQueryState(c.targetId,f?"current":"not-current")}if(h){s.push(h);const f=Ql.Ki(c.targetId,h);r.push(f)}}))}),await Promise.all(o),i.Sa.h_(s),await async function(c,h){const f=q(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>P.forEach(h,_=>P.forEach(_.qi,A=>f.persistence.referenceDelegate.addReference(g,_.targetId,A)).next(()=>P.forEach(_.Qi,A=>f.persistence.referenceDelegate.removeReference(g,_.targetId,A)))))}catch(g){if(!Ss(g))throw g;M("LocalStore","Failed to update sequence numbers: "+g)}for(const g of h){const _=g.targetId;if(!g.fromCache){const A=f.ns.get(_),R=A.snapshotVersion,O=A.withLastLimboFreeSnapshotVersion(R);f.ns=f.ns.insert(_,O)}}}(i.localStore,r))}async function RC(n,e){const t=q(n);if(!t.currentUser.isEqual(e)){M("SyncEngine","User change. New user:",e.toKey());const i=await cg(t.localStore,e);t.currentUser=e,function(r,o){r.Oa.forEach(l=>{l.forEach(c=>{c.reject(new V(b.CANCELLED,o))})}),r.Oa.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await ks(t,i.us)}}function PC(n,e){const t=q(n),i=t.Fa.get(e);if(i&&i.wa)return K().add(i.key);{let s=K();const r=t.Da.get(e);if(!r)return s;for(const o of r){const l=t.ba.get(o);s=s.unionWith(l.view.Ea)}return s}}function Sg(n){const e=q(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Tg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=PC.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=wC.bind(null,e),e.Sa.h_=uC.bind(null,e.eventManager),e.Sa.ka=hC.bind(null,e.eventManager),e}function bC(n){const e=q(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=AC.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=CC.bind(null,e),e}class Kh{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=go(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,t){return null}createIndexBackfillerScheduler(e,t){return null}createLocalStore(e){return DA(this.persistence,new kA,e.initialUser,this.serializer)}createPersistence(e){return new RA(Kl.Hr,this.serializer)}createSharedClientState(e){return new UA}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class kC{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>zh(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=RC.bind(null,this.syncEngine),await rC(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new aC}()}createDatastore(e){const t=go(e.databaseInfo.databaseId),i=function(r){return new $A(r)}(e.databaseInfo);return function(r,o,l,c){return new zA(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return function(i,s,r,o,l){return new KA(i,s,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>zh(this.syncEngine,t,0),function(){return jh.D()?new jh:new BA}())}createSyncEngine(e,t){return function(s,r,o,l,c,h,f){const g=new _C(s,r,o,l,c,h);return f&&(g.La=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e;await async function(i){const s=q(i);M("RemoteStore","RemoteStore shutting down."),s.M_.add(5),await bs(s),s.O_.shutdown(),s.N_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate()}}/**
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
 */class NC{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Ka(this.observer.next,e)}error(e){this.observer.error?this.Ka(this.observer.error,e):At("Uncaught Error in snapshot listener:",e.toString())}$a(){this.muted=!0}Ka(e,t){this.muted||setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DC{constructor(e,t,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=s,this.user=De.UNAUTHENTICATED,this.clientId=bp.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(i,async r=>{M("FirestoreClient","Received user=",r.uid),await this.authCredentialListener(r),this.user=r}),this.appCheckCredentials.start(i,r=>(M("FirestoreClient","Received new app check token=",r),this.appCheckCredentialListener(r,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new V(b.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new qt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=tc(t,"Failed to shutdown persistence");e.reject(i)}}),e.promise}}async function la(n,e){n.asyncQueue.verifyOperationInProgress(),M("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let i=t.initialUser;n.setCredentialChangeListener(async s=>{i.isEqual(s)||(await cg(e.localStore,s),i=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Qh(n,e){n.asyncQueue.verifyOperationInProgress();const t=await MC(n);M("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(i=>$h(e.remoteStore,i)),n.setAppCheckTokenChangeListener((i,s)=>$h(e.remoteStore,s)),n._onlineComponents=e}function OC(n){return n.name==="FirebaseError"?n.code===b.FAILED_PRECONDITION||n.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&n instanceof DOMException)||n.code===22||n.code===20||n.code===11}async function MC(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){M("FirestoreClient","Using user provided OfflineComponentProvider");try{await la(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!OC(t))throw t;Qn("Error using user provided cache. Falling back to memory cache: "+t),await la(n,new Kh)}}else M("FirestoreClient","Using default OfflineComponentProvider"),await la(n,new Kh);return n._offlineComponents}async function Rg(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(M("FirestoreClient","Using user provided OnlineComponentProvider"),await Qh(n,n._uninitializedComponentsProvider._online)):(M("FirestoreClient","Using default OnlineComponentProvider"),await Qh(n,new kC))),n._onlineComponents}function LC(n){return Rg(n).then(e=>e.syncEngine)}async function VC(n){const e=await Rg(n),t=e.eventManager;return t.onListen=mC.bind(null,e.syncEngine),t.onUnlisten=EC.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=yC.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=IC.bind(null,e.syncEngine),t}function xC(n,e,t={}){const i=new qt;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,h){const f=new NC({next:_=>{o.enqueueAndForget(()=>cC(r,g));const A=_.docs.has(l);!A&&_.fromCache?h.reject(new V(b.UNAVAILABLE,"Failed to get document because the client is offline.")):A&&_.fromCache&&c&&c.source==="server"?h.reject(new V(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(_)},error:_=>h.reject(_)}),g=new dC($l(l.path),f,{includeMetadataChanges:!0,ra:!0});return lC(r,g)}(await VC(n),n.asyncQueue,e,t,i)),i.promise}/**
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
 */function Pg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Yh=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FC(n,e,t){if(!t)throw new V(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function UC(n,e,t,i){if(e===!0&&i===!0)throw new V(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Xh(n){if(!L.isDocumentKey(n))throw new V(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function sc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(i){return i.constructor?i.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":U()}function fs(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=sc(n);throw new V(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class Jh{constructor(e){var t,i;if(e.host===void 0){if(e.ssl!==void 0)throw new V(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new V(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}UC("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Pg((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new V(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(i,s){return i.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class rc{constructor(e,t,i,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Jh({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new V(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new V(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Jh(e),e.credentials!==void 0&&(this._authCredentials=function(i){if(!i)return new XT;switch(i.type){case"firstParty":return new tw(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new V(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const i=Yh.get(t);i&&(M("ComponentProvider","Removing Datastore"),Yh.delete(t),i.terminate())}(this),Promise.resolve()}}function BC(n,e,t,i={}){var s;const r=(n=fs(n,rc))._getSettings(),o=`${e}:${t}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Qn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),i.mockUserToken){let l,c;if(typeof i.mockUserToken=="string")l=i.mockUserToken,c=De.MOCK_USER;else{l=kd(i.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const h=i.mockUserToken.sub||i.mockUserToken.user_id;if(!h)throw new V(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new De(h)}n._authCredentials=new JT(new Pp(l,c))}}/**
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
 */class oc{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new oc(this.firestore,e,this._query)}}class Qe{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ps(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Qe(this.firestore,e,this._key)}}class ps extends oc{constructor(e,t,i){super(e,t,$l(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Qe(this.firestore,null,new L(e))}withConverter(e){return new ps(this.firestore,e,this._path)}}function j0(n,e,...t){if(n=he(n),arguments.length===1&&(e=bp.newId()),FC("doc","path",e),n instanceof rc){const i=ue.fromString(e,...t);return Xh(i),new Qe(n,null,new L(i))}{if(!(n instanceof Qe||n instanceof ps))throw new V(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(ue.fromString(e,...t));return Xh(i),new Qe(n.firestore,n instanceof ps?n.converter:null,new L(i))}}/**
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
 */class qC{constructor(){this.iu=Promise.resolve(),this.su=[],this.ou=!1,this._u=[],this.au=null,this.uu=!1,this.cu=!1,this.lu=[],this.Yo=new hg(this,"async_queue_retry"),this.hu=()=>{const t=aa();t&&M("AsyncQueue","Visibility state changed to "+t.visibilityState),this.Yo.Wo()};const e=aa();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.hu)}get isShuttingDown(){return this.ou}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pu(),this.Iu(e)}enterRestrictedMode(e){if(!this.ou){this.ou=!0,this.cu=e||!1;const t=aa();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.hu)}}enqueue(e){if(this.Pu(),this.ou)return new Promise(()=>{});const t=new qt;return this.Iu(()=>this.ou&&this.cu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.su.push(e),this.Tu()))}async Tu(){if(this.su.length!==0){try{await this.su[0](),this.su.shift(),this.Yo.reset()}catch(e){if(!Ss(e))throw e;M("AsyncQueue","Operation failed with retryable error: "+e)}this.su.length>0&&this.Yo.$o(()=>this.Tu())}}Iu(e){const t=this.iu.then(()=>(this.uu=!0,e().catch(i=>{this.au=i,this.uu=!1;const s=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(i);throw At("INTERNAL UNHANDLED ERROR: ",s),i}).then(i=>(this.uu=!1,i))));return this.iu=t,t}enqueueAfterDelay(e,t,i){this.Pu(),this.lu.indexOf(e)>-1&&(t=0);const s=ec.createAndSchedule(this,e,t,i,r=>this.Eu(r));return this._u.push(s),s}Pu(){this.au&&U()}verifyOperationInProgress(){}async du(){let e;do e=this.iu,await e;while(e!==this.iu)}Au(e){for(const t of this._u)if(t.timerId===e)return!0;return!1}Ru(e){return this.du().then(()=>{this._u.sort((t,i)=>t.targetTimeMs-i.targetTimeMs);for(const t of this._u)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.du()})}Vu(e){this.lu.push(e)}Eu(e){const t=this._u.indexOf(e);this._u.splice(t,1)}}class ac extends rc{constructor(e,t,i,s){super(e,t,i,s),this.type="firestore",this._queue=function(){return new qC}(),this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||kg(this),this._firestoreClient.terminate()}}function $0(n,e){const t=typeof n=="object"?n:ys(),i=typeof n=="string"?n:"(default)",s=Rt(t,"firestore").getImmediate({identifier:i});if(!s._initialized){const r=Qa("firestore");r&&BC(s,...r)}return s}function bg(n){return n._firestoreClient||kg(n),n._firestoreClient.verifyNotTerminated(),n._firestoreClient}function kg(n){var e,t,i;const s=n._freezeSettings(),r=function(l,c,h,f){return new pw(l,c,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Pg(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._firestoreClient=new DC(n._authCredentials,n._appCheckCredentials,n._queue,r),!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((i=s.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(n._firestoreClient._uninitializedComponentsProvider={_offlineKind:s.localCache.kind,_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider})}/**
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
 */class ti{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ti(Le.fromBase64String(e))}catch(t){throw new V(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ti(Le.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class lc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Ng{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cc{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return J(this._lat,e._lat)||J(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jC=/^__.*__$/;class $C{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new An(e,this.data,this.fieldMask,t,this.fieldTransforms):new Rs(e,this.data,t,this.fieldTransforms)}}function Dg(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw U()}}class uc{constructor(e,t,i,s,r,o){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=s,r===void 0&&this.mu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get fu(){return this.settings.fu}gu(e){return new uc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}pu(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.gu({path:i,yu:!1});return s.wu(e),s}Su(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.gu({path:i,yu:!1});return s.mu(),s}bu(e){return this.gu({path:void 0,yu:!0})}Du(e){return Br(e,this.settings.methodName,this.settings.Cu||!1,this.path,this.settings.vu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}mu(){if(this.path)for(let e=0;e<this.path.length;e++)this.wu(this.path.get(e))}wu(e){if(e.length===0)throw this.Du("Document fields must not be empty");if(Dg(this.fu)&&jC.test(e))throw this.Du('Document fields cannot begin and end with "__"')}}class WC{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||go(e)}Fu(e,t,i,s=!1){return new uc({fu:e,methodName:t,vu:i,path:Ae.emptyPath(),yu:!1,Cu:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function HC(n){const e=n._freezeSettings(),t=go(n._databaseId);return new WC(n._databaseId,!!e.ignoreUndefinedProperties,t)}function zC(n,e,t,i,s,r={}){const o=n.Fu(r.merge||r.mergeFields?2:0,e,t,s);Vg("Data must be an object, but it was:",o,i);const l=Mg(i,o);let c,h;if(r.merge)c=new it(o.fieldMask),h=o.fieldTransforms;else if(r.mergeFields){const f=[];for(const g of r.mergeFields){const _=GC(e,g,t);if(!o.contains(_))throw new V(b.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);QC(f,_)||f.push(_)}c=new it(f),h=o.fieldTransforms.filter(g=>c.covers(g.field))}else c=null,h=o.fieldTransforms;return new $C(new Ke(l),c,h)}function Og(n,e){if(Lg(n=he(n)))return Vg("Unsupported field value:",e,n),Mg(n,e);if(n instanceof Ng)return function(i,s){if(!Dg(s.fu))throw s.Du(`${i._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Du(`${i._methodName}() is not currently supported inside arrays`);const r=i._toFieldTransform(s);r&&s.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.yu&&e.fu!==4)throw e.Du("Nested arrays are not supported");return function(i,s){const r=[];let o=0;for(const l of i){let c=Og(l,s.bu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(n,e)}return function(i,s){if((i=he(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return Vw(s.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const r=me.fromDate(i);return{timestampValue:Fr(s.serializer,r)}}if(i instanceof me){const r=new me(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Fr(s.serializer,r)}}if(i instanceof cc)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof ti)return{bytesValue:ng(s.serializer,i._byteString)};if(i instanceof Qe){const r=s.databaseId,o=i.firestore._databaseId;if(!o.isEqual(r))throw s.Du(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:zl(i.firestore._databaseId||s.databaseId,i._key.path)}}throw s.Du(`Unsupported field value: ${sc(i)}`)}(n,e)}function Mg(n,e){const t={};return kp(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ai(n,(i,s)=>{const r=Og(s,e.pu(i));r!=null&&(t[i]=r)}),{mapValue:{fields:t}}}function Lg(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof me||n instanceof cc||n instanceof ti||n instanceof Qe||n instanceof Ng)}function Vg(n,e,t){if(!Lg(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const i=sc(t);throw i==="an object"?e.Du(n+" a custom object"):e.Du(n+" "+i)}}function GC(n,e,t){if((e=he(e))instanceof lc)return e._internalPath;if(typeof e=="string")return xg(n,e);throw Br("Field path arguments must be of type string or ",n,!1,void 0,t)}const KC=new RegExp("[~\\*/\\[\\]]");function xg(n,e,t){if(e.search(KC)>=0)throw Br(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new lc(...e.split("."))._internalPath}catch{throw Br(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Br(n,e,t,i,s){const r=i&&!i.isEmpty(),o=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${i}`),o&&(c+=` in document ${s}`),c+=")"),new V(b.INVALID_ARGUMENT,l+n+c)}function QC(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class Fg{constructor(e,t,i,s,r){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=s,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Qe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new YC(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ug("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class YC extends Fg{data(){return super.data()}}function Ug(n,e){return typeof e=="string"?xg(n,e):e instanceof lc?e._internalPath:e._delegate._internalPath}class XC{convertValue(e,t="none"){switch(yn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return pe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(mn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 10:return this.convertObject(e.mapValue,t);default:throw U()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return ai(e,(s,r)=>{i[s]=this.convertValue(r,t)}),i}convertGeoPoint(e){return new cc(pe(e.latitude),pe(e.longitude))}convertArray(e,t){return(e.values||[]).map(i=>this.convertValue(i,t))}convertServerTimestamp(e,t){switch(t){case"previous":const i=Ul(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(ls(e));default:return null}}convertTimestamp(e){const t=zt(e);return new me(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=ue.fromString(e);ie(lg(i));const s=new cs(i.get(1),i.get(3)),r=new L(i.popFirst(5));return s.isEqual(t)||At(`Document ${r} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),r}}/**
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
 */function JC(n,e,t){let i;return i=n?n.toFirestore(e):e,i}/**
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
 */class ZC{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Bg extends Fg{constructor(e,t,i,s,r,o){super(e,t,i,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new eS(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(Ug("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}}class eS extends Bg{data(e={}){return super.data(e)}}/**
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
 */function W0(n){n=fs(n,Qe);const e=fs(n.firestore,ac);return xC(bg(e),n._key).then(t=>iS(e,n,t))}class tS extends XC{constructor(e){super(),this.firestore=e}convertBytes(e){return new ti(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Qe(this.firestore,null,t)}}function H0(n,e,t){n=fs(n,Qe);const i=fs(n.firestore,ac),s=JC(n.converter,e);return nS(i,[zC(HC(i),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Tt.none())])}function nS(n,e){return function(i,s){const r=new qt;return i.asyncQueue.enqueueAndForget(async()=>TC(await LC(i),s,r)),r.promise}(bg(n),e)}function iS(n,e,t){const i=t.docs.get(e._key),s=new tS(n);return new Bg(n,s,e._key,i,new ZC(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(s){oi=s})(In),Ye(new ze("firestore",(i,{instanceIdentifier:s,options:r})=>{const o=i.getProvider("app").getImmediate(),l=new ac(new ZT(i.getProvider("auth-internal")),new iw(i.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new V(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new cs(h.options.projectId,f)}(o,s),o);return r=Object.assign({useFetchStreams:t},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),Fe(Eh,"4.6.3",e),Fe(Eh,"4.6.3","esm2017")})();function qg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const sS=qg,jg=new En("auth","Firebase",qg());/**
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
 */const qr=new ms("@firebase/auth");function rS(n,...e){qr.logLevel<=G.WARN&&qr.warn(`Auth (${In}): ${n}`,...e)}function hr(n,...e){qr.logLevel<=G.ERROR&&qr.error(`Auth (${In}): ${n}`,...e)}/**
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
 */function Xe(n,...e){throw dc(n,...e)}function rt(n,...e){return dc(n,...e)}function hc(n,e,t){const i=Object.assign(Object.assign({},sS()),{[e]:t});return new En("auth","Firebase",i).create(e,{appName:n.name})}function jt(n){return hc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function oS(n,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&Xe(n,"argument-error"),hc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function dc(n,...e){if(typeof n!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return jg.create(n,...e)}function F(n,e,...t){if(!n)throw dc(e,...t)}function yt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw hr(e),new Error(e)}function St(n,e){n||yt(e)}/**
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
 */function ja(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function aS(){return Zh()==="http:"||Zh()==="https:"}function Zh(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function lS(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(aS()||Nd()||"connection"in navigator)?navigator.onLine:!0}function cS(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Ns{constructor(e,t){this.shortDelay=e,this.longDelay=t,St(t>e,"Short delay should be less than long delay!"),this.isMobile=Ya()||Dd()}get(){return lS()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function fc(n,e){St(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class $g{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;yt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;yt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;yt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const uS={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const hS=new Ns(3e4,6e4);function Sn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Qt(n,e,t,i,s={}){return Wg(n,s,async()=>{let r={},o={};i&&(e==="GET"?o=i:r={body:JSON.stringify(i)});const l=si(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();return c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode),$g.fetch()(Hg(n,n.config.apiHost,t,l),Object.assign({method:e,headers:c,referrerPolicy:"no-referrer"},r))})}async function Wg(n,e,t){n._canInitEmulator=!1;const i=Object.assign(Object.assign({},uS),e);try{const s=new fS(n),r=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw sr(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,h]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw sr(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw sr(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw sr(n,"user-disabled",o);const f=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw hc(n,f,h);Xe(n,f)}}catch(s){if(s instanceof Je)throw s;Xe(n,"network-request-failed",{message:String(s)})}}async function yo(n,e,t,i,s={}){const r=await Qt(n,e,t,i,s);return"mfaPendingCredential"in r&&Xe(n,"multi-factor-auth-required",{_serverResponse:r}),r}function Hg(n,e,t,i){const s=`${e}${t}?${i}`;return n.config.emulator?fc(n.config,s):`${n.config.apiScheme}://${s}`}function dS(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class fS{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(rt(this.auth,"network-request-failed")),hS.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function sr(n,e,t){const i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const s=rt(n,e,i);return s.customData._tokenResponse=t,s}function ed(n){return n!==void 0&&n.enterprise!==void 0}class pS{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return dS(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function gS(n,e){return Qt(n,"GET","/v2/recaptchaConfig",Sn(n,e))}/**
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
 */async function _S(n,e){return Qt(n,"POST","/v1/accounts:delete",e)}async function zg(n,e){return Qt(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Yi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function mS(n,e=!1){const t=he(n),i=await t.getIdToken(e),s=pc(i);F(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:s,token:i,authTime:Yi(ca(s.auth_time)),issuedAtTime:Yi(ca(s.iat)),expirationTime:Yi(ca(s.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function ca(n){return Number(n)*1e3}function pc(n){const[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return hr("JWT malformed, contained fewer than 3 sections"),null;try{const s=_r(t);return s?JSON.parse(s):(hr("Failed to decode base64 JWT payload"),null)}catch(s){return hr("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function td(n){const e=pc(n);return F(e,"internal-error"),F(typeof e.exp<"u","internal-error"),F(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function gs(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof Je&&yS(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function yS({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class vS{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class $a{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Yi(this.lastLoginAt),this.creationTime=Yi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function jr(n){var e;const t=n.auth,i=await n.getIdToken(),s=await gs(n,zg(t,{idToken:i}));F(s==null?void 0:s.users.length,t,"internal-error");const r=s.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?Gg(r.providerUserInfo):[],l=IS(n.providerData,o),c=n.isAnonymous,h=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),f=c?h:!1,g={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new $a(r.createdAt,r.lastLoginAt),isAnonymous:f};Object.assign(n,g)}async function ES(n){const e=he(n);await jr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function IS(n,e){return[...n.filter(i=>!e.some(s=>s.providerId===i.providerId)),...e]}function Gg(n){return n.map(e=>{var{providerId:t}=e,i=Ga(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
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
 */async function TS(n,e){const t=await Wg(n,{},async()=>{const i=si({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:r}=n.config,o=Hg(n,s,"/v1/token",`key=${r}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",$g.fetch()(o,{method:"POST",headers:l,body:i})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function wS(n,e){return Qt(n,"POST","/v2/accounts:revokeToken",Sn(n,e))}/**
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
 */class jn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){F(e.idToken,"internal-error"),F(typeof e.idToken<"u","internal-error"),F(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):td(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){F(e.length!==0,"internal-error");const t=td(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(F(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:s,expiresIn:r}=await TS(e,t);this.updateTokensAndExpiration(i,s,Number(r))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:s,expirationTime:r}=t,o=new jn;return i&&(F(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),s&&(F(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),r&&(F(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new jn,this.toJSON())}_performRefresh(){return yt("not implemented")}}/**
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
 */function Ot(n,e){F(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class vt{constructor(e){var{uid:t,auth:i,stsTokenManager:s}=e,r=Ga(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new vS(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new $a(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await gs(this,this.stsTokenManager.getToken(this.auth,e));return F(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return mS(this,e)}reload(){return ES(this)}_assign(e){this!==e&&(F(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new vt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){F(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await jr(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(at(this.auth.app))return Promise.reject(jt(this.auth));const e=await this.getIdToken();return await gs(this,_S(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,s,r,o,l,c,h,f;const g=(i=t.displayName)!==null&&i!==void 0?i:void 0,_=(s=t.email)!==null&&s!==void 0?s:void 0,A=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,R=(o=t.photoURL)!==null&&o!==void 0?o:void 0,O=(l=t.tenantId)!==null&&l!==void 0?l:void 0,k=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,j=(h=t.createdAt)!==null&&h!==void 0?h:void 0,z=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:Q,emailVerified:oe,isAnonymous:Ge,providerData:de,stsTokenManager:I}=t;F(Q&&I,e,"internal-error");const m=jn.fromJSON(this.name,I);F(typeof Q=="string",e,"internal-error"),Ot(g,e.name),Ot(_,e.name),F(typeof oe=="boolean",e,"internal-error"),F(typeof Ge=="boolean",e,"internal-error"),Ot(A,e.name),Ot(R,e.name),Ot(O,e.name),Ot(k,e.name),Ot(j,e.name),Ot(z,e.name);const v=new vt({uid:Q,auth:e,email:_,emailVerified:oe,displayName:g,isAnonymous:Ge,photoURL:R,phoneNumber:A,tenantId:O,stsTokenManager:m,createdAt:j,lastLoginAt:z});return de&&Array.isArray(de)&&(v.providerData=de.map(E=>Object.assign({},E))),k&&(v._redirectEventId=k),v}static async _fromIdTokenResponse(e,t,i=!1){const s=new jn;s.updateFromServerResponse(t);const r=new vt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:i});return await jr(r),r}static async _fromGetAccountInfoResponse(e,t,i){const s=t.users[0];F(s.localId!==void 0,"internal-error");const r=s.providerUserInfo!==void 0?Gg(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(r!=null&&r.length),l=new jn;l.updateFromIdToken(i);const c=new vt({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new $a(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,h),c}}/**
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
 */const nd=new Map;function Et(n){St(n instanceof Function,"Expected a class definition");let e=nd.get(n);return e?(St(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,nd.set(n,e),e)}/**
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
 */class Kg{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Kg.type="NONE";const id=Kg;/**
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
 */function dr(n,e,t){return`firebase:${n}:${e}:${t}`}class $n{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:s,name:r}=this.auth;this.fullUserKey=dr(this.userKey,s.apiKey,r),this.fullPersistenceKey=dr("persistence",s.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?vt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new $n(Et(id),e,i);const s=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let r=s[0]||Et(id);const o=dr(i,e.config.apiKey,e.name);let l=null;for(const h of t)try{const f=await h._get(o);if(f){const g=vt._fromJSON(e,f);h!==r&&(l=g),r=h;break}}catch{}const c=s.filter(h=>h._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new $n(r,e,i):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(t.map(async h=>{if(h!==r)try{await h._remove(o)}catch{}})),new $n(r,e,i))}}/**
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
 */function sd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Xg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Qg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zg(e))return"Blackberry";if(e_(e))return"Webos";if(gc(e))return"Safari";if((e.includes("chrome/")||Yg(e))&&!e.includes("edge/"))return"Chrome";if(Jg(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function Qg(n=Se()){return/firefox\//i.test(n)}function gc(n=Se()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yg(n=Se()){return/crios\//i.test(n)}function Xg(n=Se()){return/iemobile/i.test(n)}function Jg(n=Se()){return/android/i.test(n)}function Zg(n=Se()){return/blackberry/i.test(n)}function e_(n=Se()){return/webos/i.test(n)}function vo(n=Se()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function AS(n=Se()){var e;return vo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function CS(){return cm()&&document.documentMode===10}function t_(n=Se()){return vo(n)||Jg(n)||e_(n)||Zg(n)||/windows phone/i.test(n)||Xg(n)}function SS(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
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
 */function n_(n,e=[]){let t;switch(n){case"Browser":t=sd(Se());break;case"Worker":t=`${sd(Se())}-${n}`;break;default:t=n}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${In}/${i}`}/**
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
 */class RS{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=r=>new Promise((o,l)=>{try{const c=e(r);o(c)}catch(c){l(c)}});i.onAbort=t,this.queue.push(i);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function PS(n,e={}){return Qt(n,"GET","/v2/passwordPolicy",Sn(n,e))}/**
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
 */const bS=6;class kS{constructor(e){var t,i,s,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:bS,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,s,r,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(i=c.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let s=0;s<e.length;s++)i=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,s,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
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
 */class NS{constructor(e,t,i,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new rd(this),this.idTokenSubscription=new rd(this),this.beforeStateQueue=new RS(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=jg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Et(t)),this._initializationPromise=this.queue(async()=>{var i,s;if(!this._deleted&&(this.persistenceManager=await $n.create(this,e),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await zg(this,{idToken:e}),i=await vt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(at(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let s=i,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(s=c.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return F(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await jr(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=cS()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(at(this.app))return Promise.reject(jt(this));const t=e?he(e):null;return t&&F(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&F(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return at(this.app)?Promise.reject(jt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return at(this.app)?Promise.reject(jt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Et(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await PS(this),t=new kS(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new En("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await wS(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Et(e)||this._popupRedirectResolver;F(t,this,"argument-error"),this.redirectPersistenceManager=await $n.create(this,[Et(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,s){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(F(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,i,s);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return F(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=n_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&rS(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Rn(n){return he(n)}class rd{constructor(e){this.auth=e,this.observer=null,this.addObserver=ym(t=>this.observer=t)}get next(){return F(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Eo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function DS(n){Eo=n}function i_(n){return Eo.loadJS(n)}function OS(){return Eo.recaptchaEnterpriseScript}function MS(){return Eo.gapiScript}function LS(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const VS="recaptcha-enterprise",xS="NO_RECAPTCHA";class FS{constructor(e){this.type=VS,this.auth=Rn(e)}async verify(e="verify",t=!1){async function i(r){if(!t){if(r.tenantId==null&&r._agentRecaptchaConfig!=null)return r._agentRecaptchaConfig.siteKey;if(r.tenantId!=null&&r._tenantRecaptchaConfigs[r.tenantId]!==void 0)return r._tenantRecaptchaConfigs[r.tenantId].siteKey}return new Promise(async(o,l)=>{gS(r,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const h=new pS(c);return r.tenantId==null?r._agentRecaptchaConfig=h:r._tenantRecaptchaConfigs[r.tenantId]=h,o(h.siteKey)}}).catch(c=>{l(c)})})}function s(r,o,l){const c=window.grecaptcha;ed(c)?c.enterprise.ready(()=>{c.enterprise.execute(r,{action:e}).then(h=>{o(h)}).catch(()=>{o(xS)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((r,o)=>{i(this.auth).then(l=>{if(!t&&ed(window.grecaptcha))s(l,r,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=OS();c.length!==0&&(c+=l),i_(c).then(()=>{s(l,r,o)}).catch(h=>{o(h)})}}).catch(l=>{o(l)})})}}async function od(n,e,t,i=!1){const s=new FS(n);let r;try{r=await s.verify(t)}catch{r=await s.verify(t,!0)}const o=Object.assign({},e);return i?Object.assign(o,{captchaResp:r}):Object.assign(o,{captchaResponse:r}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function ad(n,e,t,i){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const r=await od(n,e,t,t==="getOobCode");return i(n,r)}else return i(n,e).catch(async r=>{if(r.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await od(n,e,t,t==="getOobCode");return i(n,o)}else return Promise.reject(r)})}/**
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
 */function US(n,e){const t=Rt(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),r=t.getOptions();if(Ji(r,e??{}))return s;Xe(s,"already-initialized")}return t.initialize({options:e})}function BS(n,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(Et);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function qS(n,e,t){const i=Rn(n);F(i._canInitEmulator,i,"emulator-config-failed"),F(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const s=!1,r=s_(e),{host:o,port:l}=jS(e),c=l===null?"":`:${l}`;i.config.emulator={url:`${r}//${o}${c}/`},i.settings.appVerificationDisabledForTesting=!0,i.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:s})}),$S()}function s_(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function jS(n){const e=s_(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(i);if(s){const r=s[1];return{host:r,port:ld(i.substr(r.length+1))}}else{const[r,o]=i.split(":");return{host:r,port:ld(o)}}}function ld(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function $S(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class _c{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return yt("not implemented")}_getIdTokenResponse(e){return yt("not implemented")}_linkToIdToken(e,t){return yt("not implemented")}_getReauthenticationResolver(e){return yt("not implemented")}}async function WS(n,e){return Qt(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function HS(n,e){return yo(n,"POST","/v1/accounts:signInWithPassword",Sn(n,e))}/**
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
 */async function zS(n,e){return yo(n,"POST","/v1/accounts:signInWithEmailLink",Sn(n,e))}async function GS(n,e){return yo(n,"POST","/v1/accounts:signInWithEmailLink",Sn(n,e))}/**
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
 */class _s extends _c{constructor(e,t,i,s=null){super("password",i),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new _s(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new _s(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ad(e,t,"signInWithPassword",HS);case"emailLink":return zS(e,{email:this._email,oobCode:this._password});default:Xe(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ad(e,i,"signUpPassword",WS);case"emailLink":return GS(e,{idToken:t,email:this._email,oobCode:this._password});default:Xe(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function Wn(n,e){return yo(n,"POST","/v1/accounts:signInWithIdp",Sn(n,e))}/**
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
 */const KS="http://localhost";class vn extends _c{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new vn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Xe("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s}=t,r=Ga(t,["providerId","signInMethod"]);if(!i||!s)return null;const o=new vn(i,s);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Wn(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,Wn(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Wn(e,t)}buildRequest(){const e={requestUri:KS,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=si(t)}return e}}/**
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
 */function QS(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function YS(n){const e=Mi(Li(n)).link,t=e?Mi(Li(e)).deep_link_id:null,i=Mi(Li(n)).deep_link_id;return(i?Mi(Li(i)).link:null)||i||t||e||n}class mc{constructor(e){var t,i,s,r,o,l;const c=Mi(Li(e)),h=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(i=c.oobCode)!==null&&i!==void 0?i:null,g=QS((s=c.mode)!==null&&s!==void 0?s:null);F(h&&f&&g,"argument-error"),this.apiKey=h,this.operation=g,this.code=f,this.continueUrl=(r=c.continueUrl)!==null&&r!==void 0?r:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=YS(e);try{return new mc(t)}catch{return null}}}/**
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
 */class ui{constructor(){this.providerId=ui.PROVIDER_ID}static credential(e,t){return _s._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=mc.parseLink(t);return F(i,"argument-error"),_s._fromEmailAndCode(e,i.code,i.tenantId)}}ui.PROVIDER_ID="password";ui.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ui.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class yc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ds extends yc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Mt extends Ds{constructor(){super("facebook.com")}static credential(e){return vn._fromParams({providerId:Mt.PROVIDER_ID,signInMethod:Mt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Mt.credentialFromTaggedObject(e)}static credentialFromError(e){return Mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Mt.credential(e.oauthAccessToken)}catch{return null}}}Mt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Mt.PROVIDER_ID="facebook.com";/**
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
 */class Lt extends Ds{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return vn._fromParams({providerId:Lt.PROVIDER_ID,signInMethod:Lt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Lt.credentialFromTaggedObject(e)}static credentialFromError(e){return Lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return Lt.credential(t,i)}catch{return null}}}Lt.GOOGLE_SIGN_IN_METHOD="google.com";Lt.PROVIDER_ID="google.com";/**
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
 */class Vt extends Ds{constructor(){super("github.com")}static credential(e){return vn._fromParams({providerId:Vt.PROVIDER_ID,signInMethod:Vt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vt.credentialFromTaggedObject(e)}static credentialFromError(e){return Vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vt.credential(e.oauthAccessToken)}catch{return null}}}Vt.GITHUB_SIGN_IN_METHOD="github.com";Vt.PROVIDER_ID="github.com";/**
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
 */class xt extends Ds{constructor(){super("twitter.com")}static credential(e,t){return vn._fromParams({providerId:xt.PROVIDER_ID,signInMethod:xt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return xt.credentialFromTaggedObject(e)}static credentialFromError(e){return xt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return xt.credential(t,i)}catch{return null}}}xt.TWITTER_SIGN_IN_METHOD="twitter.com";xt.PROVIDER_ID="twitter.com";/**
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
 */class ni{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,s=!1){const r=await vt._fromIdTokenResponse(e,i,s),o=cd(i);return new ni({user:r,providerId:o,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const s=cd(i);return new ni({user:e,providerId:s,_tokenResponse:i,operationType:t})}}function cd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class $r extends Je{constructor(e,t,i,s){var r;super(t.code,t.message),this.operationType=i,this.user=s,Object.setPrototypeOf(this,$r.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,s){return new $r(e,t,i,s)}}function r_(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?$r._fromErrorAndOperation(n,r,e,i):r})}async function XS(n,e,t=!1){const i=await gs(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return ni._forOperation(n,"link",i)}/**
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
 */async function JS(n,e,t=!1){const{auth:i}=n;if(at(i.app))return Promise.reject(jt(i));const s="reauthenticate";try{const r=await gs(n,r_(i,s,e,n),t);F(r.idToken,i,"internal-error");const o=pc(r.idToken);F(o,i,"internal-error");const{sub:l}=o;return F(n.uid===l,i,"user-mismatch"),ni._forOperation(n,s,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Xe(i,"user-mismatch"),r}}/**
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
 */async function o_(n,e,t=!1){if(at(n.app))return Promise.reject(jt(n));const i="signIn",s=await r_(n,i,e),r=await ni._fromIdTokenResponse(n,i,s);return t||await n._updateCurrentUser(r.user),r}async function ZS(n,e){return o_(Rn(n),e)}/**
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
 */async function eR(n){const e=Rn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function z0(n,e,t){return at(n.app)?Promise.reject(jt(n)):ZS(he(n),ui.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&eR(n),i})}function tR(n,e,t,i){return he(n).onIdTokenChanged(e,t,i)}function nR(n,e,t){return he(n).beforeAuthStateChanged(e,t)}function G0(n,e,t,i){return he(n).onAuthStateChanged(e,t,i)}const Wr="__sak";/**
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
 */class a_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Wr,"1"),this.storage.removeItem(Wr),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */function iR(){const n=Se();return gc(n)||vo(n)}const sR=1e3,rR=10;class l_ extends a_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=iR()&&SS(),this.fallbackToPolling=t_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),s=this.localCache[t];i!==s&&e(t,s,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const i=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(i);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(i,e.newValue):this.storage.removeItem(i);else if(this.localCache[i]===e.newValue&&!t)return}const s=()=>{const o=this.storage.getItem(i);!t&&this.localCache[i]===o||this.notifyListeners(i,o)},r=this.storage.getItem(i);CS()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,rR):s()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},sR)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}l_.type="LOCAL";const oR=l_;/**
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
 */class c_ extends a_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}c_.type="SESSION";const u_=c_;/**
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
 */function aR(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Io{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const i=new Io(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:s,data:r}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:s});const l=Array.from(o).map(async h=>h(t.origin,r)),c=await aR(l);t.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Io.receivers=[];/**
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
 */function vc(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class lR{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const h=vc("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:s,onMessage(g){const _=g;if(_.data.eventId===h)switch(_.data.status){case"ack":clearTimeout(f),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(_.data.response);break;default:clearTimeout(f),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function ht(){return window}function cR(n){ht().location.href=n}/**
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
 */function h_(){return typeof ht().WorkerGlobalScope<"u"&&typeof ht().importScripts=="function"}async function uR(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function hR(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function dR(){return h_()?self:null}/**
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
 */const d_="firebaseLocalStorageDb",fR=1,Hr="firebaseLocalStorage",f_="fbase_key";class Os{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function To(n,e){return n.transaction([Hr],e?"readwrite":"readonly").objectStore(Hr)}function pR(){const n=indexedDB.deleteDatabase(d_);return new Os(n).toPromise()}function Wa(){const n=indexedDB.open(d_,fR);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(Hr,{keyPath:f_})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(Hr)?e(i):(i.close(),await pR(),e(await Wa()))})})}async function ud(n,e,t){const i=To(n,!0).put({[f_]:e,value:t});return new Os(i).toPromise()}async function gR(n,e){const t=To(n,!1).get(e),i=await new Os(t).toPromise();return i===void 0?null:i.value}function hd(n,e){const t=To(n,!0).delete(e);return new Os(t).toPromise()}const _R=800,mR=3;class p_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Wa(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>mR)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return h_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Io._getInstance(dR()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await uR(),!this.activeServiceWorker)return;this.sender=new lR(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((t=i[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||hR()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Wa();return await ud(e,Wr,"1"),await hd(e,Wr),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>ud(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>gR(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>hd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const r=To(s,!1).getAll();return new Os(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:s,value:r}of e)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(r)&&(this.notifyListeners(s,r),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_R)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}p_.type="LOCAL";const yR=p_;new Ns(3e4,6e4);/**
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
 */function g_(n,e){return e?Et(e):(F(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Ec extends _c{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Wn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Wn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Wn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function vR(n){return o_(n.auth,new Ec(n),n.bypassAuthState)}function ER(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),JS(t,new Ec(n),n.bypassAuthState)}async function IR(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),XS(t,new Ec(n),n.bypassAuthState)}/**
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
 */class __{constructor(e,t,i,s,r=!1){this.auth=e,this.resolver=i,this.user=s,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:s,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:i,tenantId:r||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return vR;case"linkViaPopup":case"linkViaRedirect":return IR;case"reauthViaPopup":case"reauthViaRedirect":return ER;default:Xe(this.auth,"internal-error")}}resolve(e){St(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){St(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const TR=new Ns(2e3,1e4);async function K0(n,e,t){if(at(n.app))return Promise.reject(rt(n,"operation-not-supported-in-this-environment"));const i=Rn(n);oS(n,e,yc);const s=g_(i,t);return new on(i,"signInViaPopup",e,s).executeNotNull()}class on extends __{constructor(e,t,i,s,r){super(e,t,s,r),this.provider=i,this.authWindow=null,this.pollId=null,on.currentPopupAction&&on.currentPopupAction.cancel(),on.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return F(e,this.auth,"internal-error"),e}async onExecution(){St(this.filter.length===1,"Popup operations only handle one event");const e=vc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(rt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(rt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,on.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if(!((i=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(rt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,TR.get())};e()}}on.currentPopupAction=null;/**
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
 */const wR="pendingRedirect",fr=new Map;class AR extends __{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=fr.get(this.auth._key());if(!e){try{const i=await CR(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}fr.set(this.auth._key(),e)}return this.bypassAuthState||fr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function CR(n,e){const t=PR(e),i=RR(n);if(!await i._isAvailable())return!1;const s=await i._get(t)==="true";return await i._remove(t),s}function SR(n,e){fr.set(n._key(),e)}function RR(n){return Et(n._redirectPersistence)}function PR(n){return dr(wR,n.config.apiKey,n.name)}async function bR(n,e,t=!1){if(at(n.app))return Promise.reject(jt(n));const i=Rn(n),s=g_(i,e),o=await new AR(i,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
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
 */const kR=10*60*1e3;class NR{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!DR(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!m_(e)){const s=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";t.onError(rt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=kR&&this.cachedEventUids.clear(),this.cachedEventUids.has(dd(e))}saveEventToCache(e){this.cachedEventUids.add(dd(e)),this.lastProcessedEventTime=Date.now()}}function dd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function m_({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function DR(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return m_(n);default:return!1}}/**
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
 */async function OR(n,e={}){return Qt(n,"GET","/v1/projects",e)}/**
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
 */const MR=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,LR=/^https?/;async function VR(n){if(n.config.emulator)return;const{authorizedDomains:e}=await OR(n);for(const t of e)try{if(xR(t))return}catch{}Xe(n,"unauthorized-domain")}function xR(n){const e=ja(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===i}if(!LR.test(t))return!1;if(MR.test(n))return i===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}/**
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
 */const FR=new Ns(3e4,6e4);function fd(){const n=ht().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function UR(n){return new Promise((e,t)=>{var i,s,r;function o(){fd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{fd(),t(rt(n,"network-request-failed"))},timeout:FR.get()})}if(!((s=(i=ht().gapi)===null||i===void 0?void 0:i.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((r=ht().gapi)===null||r===void 0)&&r.load)o();else{const l=LS("iframefcb");return ht()[l]=()=>{gapi.load?o():t(rt(n,"network-request-failed"))},i_(`${MS()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw pr=null,e})}let pr=null;function BR(n){return pr=pr||UR(n),pr}/**
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
 */const qR=new Ns(5e3,15e3),jR="__/auth/iframe",$R="emulator/auth/iframe",WR={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},HR=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zR(n){const e=n.config;F(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?fc(e,$R):`https://${n.config.authDomain}/${jR}`,i={apiKey:e.apiKey,appName:n.name,v:In},s=HR.get(n.config.apiHost);s&&(i.eid=s);const r=n._getFrameworks();return r.length&&(i.fw=r.join(",")),`${t}?${si(i).slice(1)}`}async function GR(n){const e=await BR(n),t=ht().gapi;return F(t,n,"internal-error"),e.open({where:document.body,url:zR(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:WR,dontclear:!0},i=>new Promise(async(s,r)=>{await i.restyle({setHideOnLeave:!1});const o=rt(n,"network-request-failed"),l=ht().setTimeout(()=>{r(o)},qR.get());function c(){ht().clearTimeout(l),s(i)}i.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const KR={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},QR=500,YR=600,XR="_blank",JR="http://localhost";class pd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ZR(n,e,t,i=QR,s=YR){const r=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const c=Object.assign(Object.assign({},KR),{width:i.toString(),height:s.toString(),top:r,left:o}),h=Se().toLowerCase();t&&(l=Yg(h)?XR:t),Qg(h)&&(e=e||JR,c.scrollbars="yes");const f=Object.entries(c).reduce((_,[A,R])=>`${_}${A}=${R},`,"");if(AS(h)&&l!=="_self")return e0(e||"",l),new pd(null);const g=window.open(e||"",l,f);F(g,n,"popup-blocked");try{g.focus()}catch{}return new pd(g)}function e0(n,e){const t=document.createElement("a");t.href=n,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
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
 */const t0="__/auth/handler",n0="emulator/auth/handler",i0=encodeURIComponent("fac");async function gd(n,e,t,i,s,r){F(n.config.authDomain,n,"auth-domain-config-required"),F(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:In,eventId:s};if(e instanceof yc){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",ha(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,g]of Object.entries({}))o[f]=g}if(e instanceof Ds){const f=e.getScopes().filter(g=>g!=="");f.length>0&&(o.scopes=f.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),h=c?`#${i0}=${encodeURIComponent(c)}`:"";return`${s0(n)}?${si(l).slice(1)}${h}`}function s0({config:n}){return n.emulator?fc(n,n0):`https://${n.authDomain}/${t0}`}/**
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
 */const ua="webStorageSupport";class r0{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=u_,this._completeRedirectFn=bR,this._overrideRedirectResult=SR}async _openPopup(e,t,i,s){var r;St((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await gd(e,t,i,ja(),s);return ZR(e,o,vc())}async _openRedirect(e,t,i,s){await this._originValidation(e);const r=await gd(e,t,i,ja(),s);return cR(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:r}=this.eventManagers[t];return s?Promise.resolve(s):(St(r,"If manager is not set, promise should be"),r)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await GR(e),i=new NR(e);return t.register("authEvent",s=>(F(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ua,{type:ua},s=>{var r;const o=(r=s==null?void 0:s[0])===null||r===void 0?void 0:r[ua];o!==void 0&&t(!!o),Xe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=VR(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return t_()||gc()||vo()}}const o0=r0;var _d="@firebase/auth",md="1.7.4";/**
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
 */class a0{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){F(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function l0(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function c0(n){Ye(new ze("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;F(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:n_(n)},h=new NS(i,s,r,c);return BS(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Ye(new ze("auth-internal",e=>{const t=Rn(e.getProvider("auth").getImmediate());return(i=>new a0(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Fe(_d,md,l0(n)),Fe(_d,md,"esm2017")}/**
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
 */const u0=5*60,h0=bd("authIdTokenMaxAge")||u0;let yd=null;const d0=n=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>h0)return;const s=t==null?void 0:t.token;yd!==s&&(yd=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Q0(n=ys()){const e=Rt(n,"auth");if(e.isInitialized())return e.getImmediate();const t=US(n,{popupRedirectResolver:o0,persistence:[yR,oR,u_]}),i=bd("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(i,location.origin);if(location.origin===r.origin){const o=d0(r.toString());nR(t,o,()=>o(t.currentUser)),tR(t,l=>o(l))}}const s=Rd("auth");return s&&qS(t,`http://${s}`),t}function f0(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}DS({loadJS(n){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=s=>{const r=rt("internal-error");r.customData=s,t(r)},i.type="text/javascript",i.charset="UTF-8",f0().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});c0("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p0="type.googleapis.com/google.protobuf.Int64Value",g0="type.googleapis.com/google.protobuf.UInt64Value";function y_(n,e){const t={};for(const i in n)n.hasOwnProperty(i)&&(t[i]=e(n[i]));return t}function Ha(n){if(n==null)return null;if(n instanceof Number&&(n=n.valueOf()),typeof n=="number"&&isFinite(n)||n===!0||n===!1||Object.prototype.toString.call(n)==="[object String]")return n;if(n instanceof Date)return n.toISOString();if(Array.isArray(n))return n.map(e=>Ha(e));if(typeof n=="function"||typeof n=="object")return y_(n,e=>Ha(e));throw new Error("Data cannot be encoded in JSON: "+n)}function zr(n){if(n==null)return n;if(n["@type"])switch(n["@type"]){case p0:case g0:{const e=Number(n.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+n);return e}default:throw new Error("Data cannot be decoded from JSON: "+n)}return Array.isArray(n)?n.map(e=>zr(e)):typeof n=="function"||typeof n=="object"?y_(n,e=>zr(e)):n}/**
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
 */const Ic="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Hn extends Je{constructor(e,t,i){super(`${Ic}/${e}`,t||""),this.details=i}}function _0(n){if(n>=200&&n<300)return"ok";switch(n){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function m0(n,e){let t=_0(n),i=t,s;try{const r=e&&e.error;if(r){const o=r.status;if(typeof o=="string"){if(!vd[o])return new Hn("internal","internal");t=vd[o],i=o}const l=r.message;typeof l=="string"&&(i=l),s=r.details,s!==void 0&&(s=zr(s))}}catch{}return t==="ok"?null:new Hn(t,i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y0{constructor(e,t,i){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=t.getImmediate({optional:!0}),this.auth||e.get().then(s=>this.auth=s,()=>{}),this.messaging||t.get().then(s=>this.messaging=s,()=>{}),this.appCheck||i.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){const t=await this.getAuthToken(),i=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:t,messagingToken:i,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const za="us-central1";function v0(n){let e=null;return{promise:new Promise((t,i)=>{e=setTimeout(()=>{i(new Hn("deadline-exceeded","deadline-exceeded"))},n)}),cancel:()=>{e&&clearTimeout(e)}}}class E0{constructor(e,t,i,s,r=za,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new y0(t,i,s),this.cancelAllRequests=new Promise(l=>{this.deleteService=()=>Promise.resolve(l())});try{const l=new URL(r);this.customDomain=l.origin,this.region=za}catch{this.customDomain=null,this.region=r}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${t}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function I0(n,e,t){n.emulatorOrigin=`http://${e}:${t}`}function T0(n,e,t){return i=>A0(n,e,i,{})}async function w0(n,e,t,i){t["Content-Type"]="application/json";let s;try{s=await i(n,{method:"POST",body:JSON.stringify(e),headers:t})}catch{return{status:0,json:null}}let r=null;try{r=await s.json()}catch{}return{status:s.status,json:r}}function A0(n,e,t,i){const s=n._url(e);return C0(n,s,t,i)}async function C0(n,e,t,i){t=Ha(t);const s={data:t},r={},o=await n.contextProvider.getContext(i.limitedUseAppCheckTokens);o.authToken&&(r.Authorization="Bearer "+o.authToken),o.messagingToken&&(r["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(r["X-Firebase-AppCheck"]=o.appCheckToken);const l=i.timeout||7e4,c=v0(l),h=await Promise.race([w0(e,s,r,n.fetchImpl),c.promise,n.cancelAllRequests]);if(c.cancel(),!h)throw new Hn("cancelled","Firebase Functions instance was deleted.");const f=m0(h.status,h.json);if(f)throw f;if(!h.json)throw new Hn("internal","Response is not valid JSON object.");let g=h.json.data;if(typeof g>"u"&&(g=h.json.result),typeof g>"u")throw new Hn("internal","Response is missing data field.");return{data:zr(g)}}const Ed="@firebase/functions",Id="0.11.5";/**
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
 */const S0="auth-internal",R0="app-check-internal",P0="messaging-internal";function b0(n,e){const t=(i,{instanceIdentifier:s})=>{const r=i.getProvider("app").getImmediate(),o=i.getProvider(S0),l=i.getProvider(P0),c=i.getProvider(R0);return new E0(r,o,l,c,s,n)};Ye(new ze(Ic,t,"PUBLIC").setMultipleInstances(!0)),Fe(Ed,Id,e),Fe(Ed,Id,"esm2017")}/**
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
 */function Y0(n=ys(),e=za){const i=Rt(he(n),Ic).getImmediate({identifier:e}),s=Qa("functions");return s&&k0(i,...s),i}function k0(n,e,t){I0(he(n),e,t)}function X0(n,e,t){return T0(he(n),e)}b0(fetch.bind(self));export{Lt as G,$0 as a,Q0 as b,V0 as c,Y0 as d,L0 as e,x0 as f,F0 as g,X0 as h,fy as i,G0 as j,j0 as k,W0 as l,H0 as m,z0 as n,TI as o,K0 as p,Fe as r,O0 as s};
