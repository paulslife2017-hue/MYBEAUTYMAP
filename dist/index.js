var Zi=Object.defineProperty;var lr=e=>{throw TypeError(e)};var ea=(e,t,s)=>t in e?Zi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var X=(e,t,s)=>ea(e,typeof t!="symbol"?t+"":t,s),Ts=(e,t,s)=>t.has(e)||lr("Cannot "+s);var M=(e,t,s)=>(Ts(e,t,"read from private field"),s?s.call(e):t.get(e)),J=(e,t,s)=>t.has(e)?lr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),W=(e,t,s,r)=>(Ts(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),se=(e,t,s)=>(Ts(e,t,"access private method"),s);var dr=(e,t,s,r)=>({set _(i){W(e,t,i,s)},get _(){return M(e,t,r)}});import ta,{existsSync as sa,statSync as ra,createReadStream as cr}from"fs";import ia,{join as pr}from"path";import{versions as aa}from"process";import{Readable as Ds}from"stream";import{createServer as na}from"http";import{Http2ServerRequest as Ot,constants as oa}from"http2";import la from"crypto";var ur=(e,t,s)=>(r,i)=>{let a=-1;return l(0);async function l(o){if(o<=a)throw new Error("next() called multiple times");a=o;let p,h=!1,f;if(e[o]?(f=e[o][0][0],r.req.routeIndex=o):f=o===e.length&&i||void 0,f)try{p=await f(r,()=>l(o+1))}catch(y){if(y instanceof Error&&t)r.error=y,p=await t(y,r),h=!0;else throw y}else r.finalized===!1&&s&&(p=await s(r));return p&&(r.finalized===!1||h)&&(r.res=p),r}},da=Symbol(),ca=async(e,t=Object.create(null))=>{const{all:s=!1,dot:r=!1}=t,a=(e instanceof Br?e.raw.headers:e.headers).get("Content-Type");return a!=null&&a.startsWith("multipart/form-data")||a!=null&&a.startsWith("application/x-www-form-urlencoded")?pa(e,{all:s,dot:r}):{}};async function pa(e,t){const s=await e.formData();return s?ua(s,t):{}}function ua(e,t){const s=Object.create(null);return e.forEach((r,i)=>{t.all||i.endsWith("[]")?ha(s,i,r):s[i]=r}),t.dot&&Object.entries(s).forEach(([r,i])=>{r.includes(".")&&(fa(s,r,i),delete s[r])}),s}var ha=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},fa=(e,t,s)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e;const i=t.split(".");i.forEach((a,l)=>{l===i.length-1?r[a]=s:((!r[a]||typeof r[a]!="object"||Array.isArray(r[a])||r[a]instanceof File)&&(r[a]=Object.create(null)),r=r[a])})},Rr=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},ma=e=>{const{groups:t,path:s}=ga(e),r=Rr(s);return ba(r,t)},ga=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,r)=>{const i=`@${r}`;return t.push([i,s]),i}),{groups:t,path:e}},ba=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[r]=t[s];for(let i=e.length-1;i>=0;i--)if(e[i].includes(r)){e[i]=e[i].replace(r,t[s][1]);break}}return e},Kt={},va=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${e}#${t}`;return Kt[r]||(s[2]?Kt[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:Kt[r]=[e,s[1],!0]),Kt[r]}return null},js=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},ya=e=>js(e,decodeURI),Mr=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let r=s;for(;r<t.length;r++){const i=t.charCodeAt(r);if(i===37){const a=t.indexOf("?",r),l=t.indexOf("#",r),o=a===-1?l===-1?void 0:l:l===-1?a:Math.min(a,l),p=t.slice(s,o);return ya(p.includes("%25")?p.replace(/%25/g,"%2525"):p)}else if(i===63||i===35)break}return t.slice(s,r)},xa=e=>{const t=Mr(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},nt=(e,t,...s)=>(s.length&&(t=nt(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Dr=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let r="";return t.forEach(i=>{if(i!==""&&!/\:/.test(i))r+="/"+i;else if(/\:/.test(i))if(/\?/.test(i)){s.length===0&&r===""?s.push("/"):s.push(r);const a=i.replace("?","");r+="/"+a,s.push(r)}else r+="/"+i}),s.filter((i,a,l)=>l.indexOf(i)===a)},Cs=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?js(e,Pr):e):e,Nr=(e,t,s)=>{let r;if(!s&&t&&!/[%+]/.test(t)){let l=e.indexOf("?",8);if(l===-1)return;for(e.startsWith(t,l+1)||(l=e.indexOf(`&${t}`,l+1));l!==-1;){const o=e.charCodeAt(l+t.length+1);if(o===61){const p=l+t.length+2,h=e.indexOf("&",p);return Cs(e.slice(p,h===-1?void 0:h))}else if(o==38||isNaN(o))return"";l=e.indexOf(`&${t}`,l+1)}if(r=/[%+]/.test(e),!r)return}const i={};r??(r=/[%+]/.test(e));let a=e.indexOf("?",8);for(;a!==-1;){const l=e.indexOf("&",a+1);let o=e.indexOf("=",a);o>l&&l!==-1&&(o=-1);let p=e.slice(a+1,o===-1?l===-1?void 0:l:o);if(r&&(p=Cs(p)),a=l,p==="")continue;let h;o===-1?h="":(h=e.slice(o+1,l===-1?void 0:l),r&&(h=Cs(h))),s?(i[p]&&Array.isArray(i[p])||(i[p]=[]),i[p].push(h)):i[p]??(i[p]=h)}return t?i[t]:i},wa=Nr,Ea=(e,t)=>Nr(e,t,!0),Pr=decodeURIComponent,hr=e=>js(e,Pr),pt,xe,De,Fr,Ur,Ns,Pe,Tr,Br=(Tr=class{constructor(e,t="/",s=[[]]){J(this,De);X(this,"raw");J(this,pt);J(this,xe);X(this,"routeIndex",0);X(this,"path");X(this,"bodyCache",{});J(this,Pe,e=>{const{bodyCache:t,raw:s}=this,r=t[e];if(r)return r;const i=Object.keys(t)[0];return i?t[i].then(a=>(i==="json"&&(a=JSON.stringify(a)),new Response(a)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,W(this,xe,s),W(this,pt,{})}param(e){return e?se(this,De,Fr).call(this,e):se(this,De,Ur).call(this)}query(e){return wa(this.url,e)}queries(e){return Ea(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,r)=>{t[r]=s}),t}async parseBody(e){return ca(this,e)}json(){return M(this,Pe).call(this,"text").then(e=>JSON.parse(e))}text(){return M(this,Pe).call(this,"text")}arrayBuffer(){return M(this,Pe).call(this,"arrayBuffer")}blob(){return M(this,Pe).call(this,"blob")}formData(){return M(this,Pe).call(this,"formData")}addValidatedData(e,t){M(this,pt)[e]=t}valid(e){return M(this,pt)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[da](){return M(this,xe)}get matchedRoutes(){return M(this,xe)[0].map(([[,e]])=>e)}get routePath(){return M(this,xe)[0].map(([[,e]])=>e)[this.routeIndex].path}},pt=new WeakMap,xe=new WeakMap,De=new WeakSet,Fr=function(e){const t=M(this,xe)[0][this.routeIndex][1][e],s=se(this,De,Ns).call(this,t);return s&&/\%/.test(s)?hr(s):s},Ur=function(){const e={},t=Object.keys(M(this,xe)[0][this.routeIndex][1]);for(const s of t){const r=se(this,De,Ns).call(this,M(this,xe)[0][this.routeIndex][1][s]);r!==void 0&&(e[s]=/\%/.test(r)?hr(r):r)}return e},Ns=function(e){return M(this,xe)[1]?M(this,xe)[1][e]:e},Pe=new WeakMap,Tr),_a={Stringify:1},zr=async(e,t,s,r,i)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const a=e.callbacks;return a!=null&&a.length?(i?i[0]+=e:i=[e],Promise.all(a.map(o=>o({phase:t,buffer:i,context:r}))).then(o=>Promise.all(o.filter(Boolean).map(p=>zr(p,t,!1,r,i))).then(()=>i[0]))):Promise.resolve(e)},Sa="text/plain; charset=UTF-8",Is=(e,t)=>({"Content-Type":e,...t}),Tt=(e,t)=>new Response(e,t),Bt,Ft,Le,ut,Ae,me,Ut,ht,ft,Qe,zt,$t,Be,ot,Cr,ka=(Cr=class{constructor(e,t){J(this,Be);J(this,Bt);J(this,Ft);X(this,"env",{});J(this,Le);X(this,"finalized",!1);X(this,"error");J(this,ut);J(this,Ae);J(this,me);J(this,Ut);J(this,ht);J(this,ft);J(this,Qe);J(this,zt);J(this,$t);X(this,"render",(...e)=>(M(this,ht)??W(this,ht,t=>this.html(t)),M(this,ht).call(this,...e)));X(this,"setLayout",e=>W(this,Ut,e));X(this,"getLayout",()=>M(this,Ut));X(this,"setRenderer",e=>{W(this,ht,e)});X(this,"header",(e,t,s)=>{this.finalized&&W(this,me,Tt(M(this,me).body,M(this,me)));const r=M(this,me)?M(this,me).headers:M(this,Qe)??W(this,Qe,new Headers);t===void 0?r.delete(e):s!=null&&s.append?r.append(e,t):r.set(e,t)});X(this,"status",e=>{W(this,ut,e)});X(this,"set",(e,t)=>{M(this,Le)??W(this,Le,new Map),M(this,Le).set(e,t)});X(this,"get",e=>M(this,Le)?M(this,Le).get(e):void 0);X(this,"newResponse",(...e)=>se(this,Be,ot).call(this,...e));X(this,"body",(e,t,s)=>se(this,Be,ot).call(this,e,t,s));X(this,"text",(e,t,s)=>!M(this,Qe)&&!M(this,ut)&&!t&&!s&&!this.finalized?new Response(e):se(this,Be,ot).call(this,e,t,Is(Sa,s)));X(this,"json",(e,t,s)=>se(this,Be,ot).call(this,JSON.stringify(e),t,Is("application/json",s)));X(this,"html",(e,t,s)=>{const r=i=>se(this,Be,ot).call(this,i,t,Is("text/html; charset=UTF-8",s));return typeof e=="object"?zr(e,_a.Stringify,!1,{}).then(r):r(e)});X(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});X(this,"notFound",()=>(M(this,ft)??W(this,ft,()=>Tt()),M(this,ft).call(this,this)));W(this,Bt,e),t&&(W(this,Ae,t.executionCtx),this.env=t.env,W(this,ft,t.notFoundHandler),W(this,$t,t.path),W(this,zt,t.matchResult))}get req(){return M(this,Ft)??W(this,Ft,new Br(M(this,Bt),M(this,$t),M(this,zt))),M(this,Ft)}get event(){if(M(this,Ae)&&"respondWith"in M(this,Ae))return M(this,Ae);throw Error("This context has no FetchEvent")}get executionCtx(){if(M(this,Ae))return M(this,Ae);throw Error("This context has no ExecutionContext")}get res(){return M(this,me)||W(this,me,Tt(null,{headers:M(this,Qe)??W(this,Qe,new Headers)}))}set res(e){if(M(this,me)&&e){e=Tt(e.body,e);for(const[t,s]of M(this,me).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=M(this,me).headers.getSetCookie();e.headers.delete("set-cookie");for(const i of r)e.headers.append("set-cookie",i)}else e.headers.set(t,s)}W(this,me,e),this.finalized=!0}get var(){return M(this,Le)?Object.fromEntries(M(this,Le)):{}}},Bt=new WeakMap,Ft=new WeakMap,Le=new WeakMap,ut=new WeakMap,Ae=new WeakMap,me=new WeakMap,Ut=new WeakMap,ht=new WeakMap,ft=new WeakMap,Qe=new WeakMap,zt=new WeakMap,$t=new WeakMap,Be=new WeakSet,ot=function(e,t,s){const r=M(this,me)?new Headers(M(this,me).headers):M(this,Qe)??new Headers;if(typeof t=="object"&&"headers"in t){const a=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[l,o]of a)l.toLowerCase()==="set-cookie"?r.append(l,o):r.set(l,o)}if(s)for(const[a,l]of Object.entries(s))if(typeof l=="string")r.set(a,l);else{r.delete(a);for(const o of l)r.append(a,o)}const i=typeof t=="number"?t:(t==null?void 0:t.status)??M(this,ut);return Tt(e,{status:i,headers:r})},Cr),de="ALL",Ta="all",Ca=["get","post","put","delete","options","patch"],$r="Can not add a route since the matcher is already built.",jr=class extends Error{},Ia="__COMPOSED_HANDLER",La=e=>e.text("404 Not Found",404),fr=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},Ee,ce,qr,_e,He,ss,rs,mt,Aa=(mt=class{constructor(t={}){J(this,ce);X(this,"get");X(this,"post");X(this,"put");X(this,"delete");X(this,"options");X(this,"patch");X(this,"all");X(this,"on");X(this,"use");X(this,"router");X(this,"getPath");X(this,"_basePath","/");J(this,Ee,"/");X(this,"routes",[]);J(this,_e,La);X(this,"errorHandler",fr);X(this,"onError",t=>(this.errorHandler=t,this));X(this,"notFound",t=>(W(this,_e,t),this));X(this,"fetch",(t,...s)=>se(this,ce,rs).call(this,t,s[1],s[0],t.method));X(this,"request",(t,s,r,i)=>t instanceof Request?this.fetch(s?new Request(t,s):t,r,i):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${nt("/",t)}`,s),r,i)));X(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(se(this,ce,rs).call(this,t.request,t,void 0,t.request.method))})});[...Ca,Ta].forEach(a=>{this[a]=(l,...o)=>(typeof l=="string"?W(this,Ee,l):se(this,ce,He).call(this,a,M(this,Ee),l),o.forEach(p=>{se(this,ce,He).call(this,a,M(this,Ee),p)}),this)}),this.on=(a,l,...o)=>{for(const p of[l].flat()){W(this,Ee,p);for(const h of[a].flat())o.map(f=>{se(this,ce,He).call(this,h.toUpperCase(),M(this,Ee),f)})}return this},this.use=(a,...l)=>(typeof a=="string"?W(this,Ee,a):(W(this,Ee,"*"),l.unshift(a)),l.forEach(o=>{se(this,ce,He).call(this,de,M(this,Ee),o)}),this);const{strict:r,...i}=t;Object.assign(this,i),this.getPath=r??!0?t.getPath??Mr:xa}route(t,s){const r=this.basePath(t);return s.routes.map(i=>{var l;let a;s.errorHandler===fr?a=i.handler:(a=async(o,p)=>(await ur([],s.errorHandler)(o,()=>i.handler(o,p))).res,a[Ia]=i.handler),se(l=r,ce,He).call(l,i.method,i.path,a)}),this}basePath(t){const s=se(this,ce,qr).call(this);return s._basePath=nt(this._basePath,t),s}mount(t,s,r){let i,a;r&&(typeof r=="function"?a=r:(a=r.optionHandler,r.replaceRequest===!1?i=p=>p:i=r.replaceRequest));const l=a?p=>{const h=a(p);return Array.isArray(h)?h:[h]}:p=>{let h;try{h=p.executionCtx}catch{}return[p.env,h]};i||(i=(()=>{const p=nt(this._basePath,t),h=p==="/"?0:p.length;return f=>{const y=new URL(f.url);return y.pathname=y.pathname.slice(h)||"/",new Request(y,f)}})());const o=async(p,h)=>{const f=await s(i(p.req.raw),...l(p));if(f)return f;await h()};return se(this,ce,He).call(this,de,nt(t,"*"),o),this}},Ee=new WeakMap,ce=new WeakSet,qr=function(){const t=new mt({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,W(t,_e,M(this,_e)),t.routes=this.routes,t},_e=new WeakMap,He=function(t,s,r){t=t.toUpperCase(),s=nt(this._basePath,s);const i={basePath:this._basePath,path:s,method:t,handler:r};this.router.add(t,s,[r,i]),this.routes.push(i)},ss=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},rs=function(t,s,r,i){if(i==="HEAD")return(async()=>new Response(null,await se(this,ce,rs).call(this,t,s,r,"GET")))();const a=this.getPath(t,{env:r}),l=this.router.match(i,a),o=new ka(t,{path:a,matchResult:l,env:r,executionCtx:s,notFoundHandler:M(this,_e)});if(l[0].length===1){let h;try{h=l[0][0][0][0](o,async()=>{o.res=await M(this,_e).call(this,o)})}catch(f){return se(this,ce,ss).call(this,f,o)}return h instanceof Promise?h.then(f=>f||(o.finalized?o.res:M(this,_e).call(this,o))).catch(f=>se(this,ce,ss).call(this,f,o)):h??M(this,_e).call(this,o)}const p=ur(l[0],this.errorHandler,M(this,_e));return(async()=>{try{const h=await p(o);if(!h.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return h.res}catch(h){return se(this,ce,ss).call(this,h,o)}})()},mt),Hr=[];function Oa(e,t){const s=this.buildAllMatchers(),r=((i,a)=>{const l=s[i]||s[de],o=l[2][a];if(o)return o;const p=a.match(l[0]);if(!p)return[[],Hr];const h=p.indexOf("",1);return[l[1][h],p]});return this.match=r,r(e,t)}var ls="[^/]+",Rt=".*",Mt="(?:|/.*)",lt=Symbol(),Ra=new Set(".\\+*[^]$()");function Ma(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Rt||e===Mt?1:t===Rt||t===Mt?-1:e===ls?1:t===ls?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Ye,Xe,Se,Ze,Da=(Ze=class{constructor(){J(this,Ye);J(this,Xe);J(this,Se,Object.create(null))}insert(t,s,r,i,a){if(t.length===0){if(M(this,Ye)!==void 0)throw lt;if(a)return;W(this,Ye,s);return}const[l,...o]=t,p=l==="*"?o.length===0?["","",Rt]:["","",ls]:l==="/*"?["","",Mt]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let h;if(p){const f=p[1];let y=p[2]||ls;if(f&&p[2]&&(y===".*"||(y=y.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(y))))throw lt;if(h=M(this,Se)[y],!h){if(Object.keys(M(this,Se)).some(b=>b!==Rt&&b!==Mt))throw lt;if(a)return;h=M(this,Se)[y]=new Ze,f!==""&&W(h,Xe,i.varIndex++)}!a&&f!==""&&r.push([f,M(h,Xe)])}else if(h=M(this,Se)[l],!h){if(Object.keys(M(this,Se)).some(f=>f.length>1&&f!==Rt&&f!==Mt))throw lt;if(a)return;h=M(this,Se)[l]=new Ze}h.insert(o,s,r,i,a)}buildRegExpStr(){const s=Object.keys(M(this,Se)).sort(Ma).map(r=>{const i=M(this,Se)[r];return(typeof M(i,Xe)=="number"?`(${r})@${M(i,Xe)}`:Ra.has(r)?`\\${r}`:r)+i.buildRegExpStr()});return typeof M(this,Ye)=="number"&&s.unshift(`#${M(this,Ye)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Ye=new WeakMap,Xe=new WeakMap,Se=new WeakMap,Ze),cs,jt,Ir,Na=(Ir=class{constructor(){J(this,cs,{varIndex:0});J(this,jt,new Da)}insert(e,t,s){const r=[],i=[];for(let l=0;;){let o=!1;if(e=e.replace(/\{[^}]+\}/g,p=>{const h=`@\\${l}`;return i[l]=[h,p],l++,o=!0,h}),!o)break}const a=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let l=i.length-1;l>=0;l--){const[o]=i[l];for(let p=a.length-1;p>=0;p--)if(a[p].indexOf(o)!==-1){a[p]=a[p].replace(o,i[l][1]);break}}return M(this,jt).insert(a,t,r,M(this,cs),s),r}buildRegExp(){let e=M(this,jt).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(i,a,l)=>a!==void 0?(s[++t]=Number(a),"$()"):(l!==void 0&&(r[Number(l)]=++t),"")),[new RegExp(`^${e}`),s,r]}},cs=new WeakMap,jt=new WeakMap,Ir),Pa=[/^$/,[],Object.create(null)],is=Object.create(null);function Vr(e){return is[e]??(is[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function Ba(){is=Object.create(null)}function Fa(e){var h;const t=new Na,s=[];if(e.length===0)return Pa;const r=e.map(f=>[!/\*|\/:/.test(f[0]),...f]).sort(([f,y],[b,x])=>f?1:b?-1:y.length-x.length),i=Object.create(null);for(let f=0,y=-1,b=r.length;f<b;f++){const[x,d,u]=r[f];x?i[d]=[u.map(([w])=>[w,Object.create(null)]),Hr]:y++;let v;try{v=t.insert(d,y,x)}catch(w){throw w===lt?new jr(d):w}x||(s[y]=u.map(([w,E])=>{const _=Object.create(null);for(E-=1;E>=0;E--){const[O,D]=v[E];_[O]=D}return[w,_]}))}const[a,l,o]=t.buildRegExp();for(let f=0,y=s.length;f<y;f++)for(let b=0,x=s[f].length;b<x;b++){const d=(h=s[f][b])==null?void 0:h[1];if(!d)continue;const u=Object.keys(d);for(let v=0,w=u.length;v<w;v++)d[u[v]]=o[d[u[v]]]}const p=[];for(const f in l)p[f]=s[l[f]];return[a,p,i]}function at(e,t){if(e){for(const s of Object.keys(e).sort((r,i)=>i.length-r.length))if(Vr(s).test(t))return[...e[s]]}}var Fe,Ue,ps,Wr,Lr,Ua=(Lr=class{constructor(){J(this,ps);X(this,"name","RegExpRouter");J(this,Fe);J(this,Ue);X(this,"match",Oa);W(this,Fe,{[de]:Object.create(null)}),W(this,Ue,{[de]:Object.create(null)})}add(e,t,s){var o;const r=M(this,Fe),i=M(this,Ue);if(!r||!i)throw new Error($r);r[e]||[r,i].forEach(p=>{p[e]=Object.create(null),Object.keys(p[de]).forEach(h=>{p[e][h]=[...p[de][h]]})}),t==="/*"&&(t="*");const a=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const p=Vr(t);e===de?Object.keys(r).forEach(h=>{var f;(f=r[h])[t]||(f[t]=at(r[h],t)||at(r[de],t)||[])}):(o=r[e])[t]||(o[t]=at(r[e],t)||at(r[de],t)||[]),Object.keys(r).forEach(h=>{(e===de||e===h)&&Object.keys(r[h]).forEach(f=>{p.test(f)&&r[h][f].push([s,a])})}),Object.keys(i).forEach(h=>{(e===de||e===h)&&Object.keys(i[h]).forEach(f=>p.test(f)&&i[h][f].push([s,a]))});return}const l=Dr(t)||[t];for(let p=0,h=l.length;p<h;p++){const f=l[p];Object.keys(i).forEach(y=>{var b;(e===de||e===y)&&((b=i[y])[f]||(b[f]=[...at(r[y],f)||at(r[de],f)||[]]),i[y][f].push([s,a-h+p+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(M(this,Ue)).concat(Object.keys(M(this,Fe))).forEach(t=>{e[t]||(e[t]=se(this,ps,Wr).call(this,t))}),W(this,Fe,W(this,Ue,void 0)),Ba(),e}},Fe=new WeakMap,Ue=new WeakMap,ps=new WeakSet,Wr=function(e){const t=[];let s=e===de;return[M(this,Fe),M(this,Ue)].forEach(r=>{const i=r[e]?Object.keys(r[e]).map(a=>[a,r[e][a]]):[];i.length!==0?(s||(s=!0),t.push(...i)):e!==de&&t.push(...Object.keys(r[de]).map(a=>[a,r[de][a]]))}),s?Fa(t):null},Lr),ze,Oe,Ar,za=(Ar=class{constructor(e){X(this,"name","SmartRouter");J(this,ze,[]);J(this,Oe,[]);W(this,ze,e.routers)}add(e,t,s){if(!M(this,Oe))throw new Error($r);M(this,Oe).push([e,t,s])}match(e,t){if(!M(this,Oe))throw new Error("Fatal error");const s=M(this,ze),r=M(this,Oe),i=s.length;let a=0,l;for(;a<i;a++){const o=s[a];try{for(let p=0,h=r.length;p<h;p++)o.add(...r[p]);l=o.match(e,t)}catch(p){if(p instanceof jr)continue;throw p}this.match=o.match.bind(o),W(this,ze,[o]),W(this,Oe,void 0);break}if(a===i)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,l}get activeRouter(){if(M(this,Oe)||M(this,ze).length!==1)throw new Error("No active router has been determined yet.");return M(this,ze)[0]}},ze=new WeakMap,Oe=new WeakMap,Ar),Ct=Object.create(null),$a=e=>{for(const t in e)return!0;return!1},$e,fe,Ke,gt,he,Re,Ve,bt,ja=(bt=class{constructor(t,s,r){J(this,Re);J(this,$e);J(this,fe);J(this,Ke);J(this,gt,0);J(this,he,Ct);if(W(this,fe,r||Object.create(null)),W(this,$e,[]),t&&s){const i=Object.create(null);i[t]={handler:s,possibleKeys:[],score:0},W(this,$e,[i])}W(this,Ke,[])}insert(t,s,r){W(this,gt,++dr(this,gt)._);let i=this;const a=ma(s),l=[];for(let o=0,p=a.length;o<p;o++){const h=a[o],f=a[o+1],y=va(h,f),b=Array.isArray(y)?y[0]:h;if(b in M(i,fe)){i=M(i,fe)[b],y&&l.push(y[1]);continue}M(i,fe)[b]=new bt,y&&(M(i,Ke).push(y),l.push(y[1])),i=M(i,fe)[b]}return M(i,$e).push({[t]:{handler:r,possibleKeys:l.filter((o,p,h)=>h.indexOf(o)===p),score:M(this,gt)}}),i}search(t,s){var f;const r=[];W(this,he,Ct);let a=[this];const l=Rr(s),o=[],p=l.length;let h=null;for(let y=0;y<p;y++){const b=l[y],x=y===p-1,d=[];for(let v=0,w=a.length;v<w;v++){const E=a[v],_=M(E,fe)[b];_&&(W(_,he,M(E,he)),x?(M(_,fe)["*"]&&se(this,Re,Ve).call(this,r,M(_,fe)["*"],t,M(E,he)),se(this,Re,Ve).call(this,r,_,t,M(E,he))):d.push(_));for(let O=0,D=M(E,Ke).length;O<D;O++){const S=M(E,Ke)[O],I=M(E,he)===Ct?{}:{...M(E,he)};if(S==="*"){const z=M(E,fe)["*"];z&&(se(this,Re,Ve).call(this,r,z,t,M(E,he)),W(z,he,I),d.push(z));continue}const[L,k,N]=S;if(!b&&!(N instanceof RegExp))continue;const A=M(E,fe)[L];if(N instanceof RegExp){if(h===null){h=new Array(p);let P=s[0]==="/"?1:0;for(let U=0;U<p;U++)h[U]=P,P+=l[U].length+1}const z=s.substring(h[y]),$=N.exec(z);if($){if(I[k]=$[0],se(this,Re,Ve).call(this,r,A,t,M(E,he),I),$a(M(A,fe))){W(A,he,I);const P=((f=$[0].match(/\//))==null?void 0:f.length)??0;(o[P]||(o[P]=[])).push(A)}continue}}(N===!0||N.test(b))&&(I[k]=b,x?(se(this,Re,Ve).call(this,r,A,t,I,M(E,he)),M(A,fe)["*"]&&se(this,Re,Ve).call(this,r,M(A,fe)["*"],t,I,M(E,he))):(W(A,he,I),d.push(A)))}}const u=o.shift();a=u?d.concat(u):d}return r.length>1&&r.sort((y,b)=>y.score-b.score),[r.map(({handler:y,params:b})=>[y,b])]}},$e=new WeakMap,fe=new WeakMap,Ke=new WeakMap,gt=new WeakMap,he=new WeakMap,Re=new WeakSet,Ve=function(t,s,r,i,a){for(let l=0,o=M(s,$e).length;l<o;l++){const p=M(s,$e)[l],h=p[r]||p[de],f={};if(h!==void 0&&(h.params=Object.create(null),t.push(h),i!==Ct||a&&a!==Ct))for(let y=0,b=h.possibleKeys.length;y<b;y++){const x=h.possibleKeys[y],d=f[h.score];h.params[x]=a!=null&&a[x]&&!d?a[x]:i[x]??(a==null?void 0:a[x]),f[h.score]=!0}}},bt),Je,Or,qa=(Or=class{constructor(){X(this,"name","TrieRouter");J(this,Je);W(this,Je,new ja)}add(e,t,s){const r=Dr(t);if(r){for(let i=0,a=r.length;i<a;i++)M(this,Je).insert(e,r[i],s);return}M(this,Je).insert(e,t,s)}match(e,t){return M(this,Je).search(e,t)}},Je=new WeakMap,Or),Gr=class extends Aa{constructor(e={}){super(e),this.router=e.router??new za({routers:[new Ua,new qa]})}},Ha=Object.create,xt=Object.defineProperty,Va=Object.getOwnPropertyDescriptor,Wa=Object.getOwnPropertyNames,Ga=Object.getPrototypeOf,Qa=Object.prototype.hasOwnProperty,Ya=(e,t,s)=>t in e?xt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,g=(e,t)=>xt(e,"name",{value:t,configurable:!0}),ge=(e,t)=>()=>(e&&(t=e(e=0)),t),ee=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ke=(e,t)=>{for(var s in t)xt(e,s,{get:t[s],enumerable:!0})},Qr=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Wa(t))!Qa.call(e,i)&&i!==s&&xt(e,i,{get:()=>t[i],enumerable:!(r=Va(t,i))||r.enumerable});return e},et=(e,t,s)=>(s=e!=null?Ha(Ga(e)):{},Qr(t||!e||!e.__esModule?xt(s,"default",{value:e,enumerable:!0}):s,e)),ue=e=>Qr(xt({},"__esModule",{value:!0}),e),Q=(e,t,s)=>Ya(e,typeof t!="symbol"?t+"":t,s),Xa=ee(e=>{q(),e.byteLength=p,e.toByteArray=f,e.fromByteArray=x;var t=[],s=[],r=typeof Uint8Array<"u"?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(a=0,l=i.length;a<l;++a)t[a]=i[a],s[i.charCodeAt(a)]=a;var a,l;s[45]=62,s[95]=63;function o(d){var u=d.length;if(u%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var v=d.indexOf("=");v===-1&&(v=u);var w=v===u?0:4-v%4;return[v,w]}g(o,"getLens");function p(d){var u=o(d),v=u[0],w=u[1];return(v+w)*3/4-w}g(p,"byteLength");function h(d,u,v){return(u+v)*3/4-v}g(h,"_byteLength");function f(d){var u,v=o(d),w=v[0],E=v[1],_=new r(h(d,w,E)),O=0,D=E>0?w-4:w,S;for(S=0;S<D;S+=4)u=s[d.charCodeAt(S)]<<18|s[d.charCodeAt(S+1)]<<12|s[d.charCodeAt(S+2)]<<6|s[d.charCodeAt(S+3)],_[O++]=u>>16&255,_[O++]=u>>8&255,_[O++]=u&255;return E===2&&(u=s[d.charCodeAt(S)]<<2|s[d.charCodeAt(S+1)]>>4,_[O++]=u&255),E===1&&(u=s[d.charCodeAt(S)]<<10|s[d.charCodeAt(S+1)]<<4|s[d.charCodeAt(S+2)]>>2,_[O++]=u>>8&255,_[O++]=u&255),_}g(f,"toByteArray");function y(d){return t[d>>18&63]+t[d>>12&63]+t[d>>6&63]+t[d&63]}g(y,"tripletToBase64");function b(d,u,v){for(var w,E=[],_=u;_<v;_+=3)w=(d[_]<<16&16711680)+(d[_+1]<<8&65280)+(d[_+2]&255),E.push(y(w));return E.join("")}g(b,"encodeChunk");function x(d){for(var u,v=d.length,w=v%3,E=[],_=16383,O=0,D=v-w;O<D;O+=_)E.push(b(d,O,O+_>D?D:O+_));return w===1?(u=d[v-1],E.push(t[u>>2]+t[u<<4&63]+"==")):w===2&&(u=(d[v-2]<<8)+d[v-1],E.push(t[u>>10]+t[u>>4&63]+t[u<<2&63]+"=")),E.join("")}g(x,"fromByteArray")}),Ka=ee(e=>{q(),e.read=function(t,s,r,i,a){var l,o,p=a*8-i-1,h=(1<<p)-1,f=h>>1,y=-7,b=r?a-1:0,x=r?-1:1,d=t[s+b];for(b+=x,l=d&(1<<-y)-1,d>>=-y,y+=p;y>0;l=l*256+t[s+b],b+=x,y-=8);for(o=l&(1<<-y)-1,l>>=-y,y+=i;y>0;o=o*256+t[s+b],b+=x,y-=8);if(l===0)l=1-f;else{if(l===h)return o?NaN:(d?-1:1)*(1/0);o=o+Math.pow(2,i),l=l-f}return(d?-1:1)*o*Math.pow(2,l-i)},e.write=function(t,s,r,i,a,l){var o,p,h,f=l*8-a-1,y=(1<<f)-1,b=y>>1,x=a===23?Math.pow(2,-24)-Math.pow(2,-77):0,d=i?0:l-1,u=i?1:-1,v=s<0||s===0&&1/s<0?1:0;for(s=Math.abs(s),isNaN(s)||s===1/0?(p=isNaN(s)?1:0,o=y):(o=Math.floor(Math.log(s)/Math.LN2),s*(h=Math.pow(2,-o))<1&&(o--,h*=2),o+b>=1?s+=x/h:s+=x*Math.pow(2,1-b),s*h>=2&&(o++,h/=2),o+b>=y?(p=0,o=y):o+b>=1?(p=(s*h-1)*Math.pow(2,a),o=o+b):(p=s*Math.pow(2,b-1)*Math.pow(2,a),o=0));a>=8;t[r+d]=p&255,d+=u,p/=256,a-=8);for(o=o<<a|p,f+=a;f>0;t[r+d]=o&255,d+=u,o/=256,f-=8);t[r+d-u]|=v*128}}),Ja=ee(e=>{q();var t=Xa(),s=Ka(),r=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=o,e.SlowBuffer=E,e.INSPECT_MAX_BYTES=50;var i=2147483647;e.kMaxLength=i,o.TYPED_ARRAY_SUPPORT=a(),!o.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function a(){try{let n=new Uint8Array(1),c={foo:g(function(){return 42},"foo")};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(n,c),n.foo()===42}catch{return!1}}g(a,"typedArraySupport"),Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:g(function(){if(o.isBuffer(this))return this.buffer},"get")}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:g(function(){if(o.isBuffer(this))return this.byteOffset},"get")});function l(n){if(n>i)throw new RangeError('The value "'+n+'" is invalid for option "size"');let c=new Uint8Array(n);return Object.setPrototypeOf(c,o.prototype),c}g(l,"createBuffer");function o(n,c,m){if(typeof n=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return y(n)}return p(n,c,m)}g(o,"Buffer"),o.poolSize=8192;function p(n,c,m){if(typeof n=="string")return b(n,c);if(ArrayBuffer.isView(n))return d(n);if(n==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof n);if(we(n,ArrayBuffer)||n&&we(n.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(we(n,SharedArrayBuffer)||n&&we(n.buffer,SharedArrayBuffer)))return u(n,c,m);if(typeof n=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let T=n.valueOf&&n.valueOf();if(T!=null&&T!==n)return o.from(T,c,m);let C=v(n);if(C)return C;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof n[Symbol.toPrimitive]=="function")return o.from(n[Symbol.toPrimitive]("string"),c,m);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof n)}g(p,"from"),o.from=function(n,c,m){return p(n,c,m)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array);function h(n){if(typeof n!="number")throw new TypeError('"size" argument must be of type number');if(n<0)throw new RangeError('The value "'+n+'" is invalid for option "size"')}g(h,"assertSize");function f(n,c,m){return h(n),n<=0?l(n):c!==void 0?typeof m=="string"?l(n).fill(c,m):l(n).fill(c):l(n)}g(f,"alloc"),o.alloc=function(n,c,m){return f(n,c,m)};function y(n){return h(n),l(n<0?0:w(n)|0)}g(y,"allocUnsafe"),o.allocUnsafe=function(n){return y(n)},o.allocUnsafeSlow=function(n){return y(n)};function b(n,c){if((typeof c!="string"||c==="")&&(c="utf8"),!o.isEncoding(c))throw new TypeError("Unknown encoding: "+c);let m=_(n,c)|0,T=l(m),C=T.write(n,c);return C!==m&&(T=T.slice(0,C)),T}g(b,"fromString");function x(n){let c=n.length<0?0:w(n.length)|0,m=l(c);for(let T=0;T<c;T+=1)m[T]=n[T]&255;return m}g(x,"fromArrayLike");function d(n){if(we(n,Uint8Array)){let c=new Uint8Array(n);return u(c.buffer,c.byteOffset,c.byteLength)}return x(n)}g(d,"fromArrayView");function u(n,c,m){if(c<0||n.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(n.byteLength<c+(m||0))throw new RangeError('"length" is outside of buffer bounds');let T;return c===void 0&&m===void 0?T=new Uint8Array(n):m===void 0?T=new Uint8Array(n,c):T=new Uint8Array(n,c,m),Object.setPrototypeOf(T,o.prototype),T}g(u,"fromArrayBuffer");function v(n){if(o.isBuffer(n)){let c=w(n.length)|0,m=l(c);return m.length===0||n.copy(m,0,0,c),m}if(n.length!==void 0)return typeof n.length!="number"||Xt(n.length)?l(0):x(n);if(n.type==="Buffer"&&Array.isArray(n.data))return x(n.data)}g(v,"fromObject");function w(n){if(n>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return n|0}g(w,"checked");function E(n){return+n!=n&&(n=0),o.alloc(+n)}g(E,"SlowBuffer"),o.isBuffer=g(function(n){return n!=null&&n._isBuffer===!0&&n!==o.prototype},"isBuffer"),o.compare=g(function(n,c){if(we(n,Uint8Array)&&(n=o.from(n,n.offset,n.byteLength)),we(c,Uint8Array)&&(c=o.from(c,c.offset,c.byteLength)),!o.isBuffer(n)||!o.isBuffer(c))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(n===c)return 0;let m=n.length,T=c.length;for(let C=0,B=Math.min(m,T);C<B;++C)if(n[C]!==c[C]){m=n[C],T=c[C];break}return m<T?-1:T<m?1:0},"compare"),o.isEncoding=g(function(n){switch(String(n).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},"isEncoding"),o.concat=g(function(n,c){if(!Array.isArray(n))throw new TypeError('"list" argument must be an Array of Buffers');if(n.length===0)return o.alloc(0);let m;if(c===void 0)for(c=0,m=0;m<n.length;++m)c+=n[m].length;let T=o.allocUnsafe(c),C=0;for(m=0;m<n.length;++m){let B=n[m];if(we(B,Uint8Array))C+B.length>T.length?(o.isBuffer(B)||(B=o.from(B)),B.copy(T,C)):Uint8Array.prototype.set.call(T,B,C);else if(o.isBuffer(B))B.copy(T,C);else throw new TypeError('"list" argument must be an Array of Buffers');C+=B.length}return T},"concat");function _(n,c){if(o.isBuffer(n))return n.length;if(ArrayBuffer.isView(n)||we(n,ArrayBuffer))return n.byteLength;if(typeof n!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof n);let m=n.length,T=arguments.length>2&&arguments[2]===!0;if(!T&&m===0)return 0;let C=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return m;case"utf8":case"utf-8":return Yt(n).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return m*2;case"hex":return m>>>1;case"base64":return ks(n).length;default:if(C)return T?-1:Yt(n).length;c=(""+c).toLowerCase(),C=!0}}g(_,"byteLength"),o.byteLength=_;function O(n,c,m){let T=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((m===void 0||m>this.length)&&(m=this.length),m<=0)||(m>>>=0,c>>>=0,m<=c))return"";for(n||(n="utf8");;)switch(n){case"hex":return K(this,c,m);case"utf8":case"utf-8":return P(this,c,m);case"ascii":return Y(this,c,m);case"latin1":case"binary":return te(this,c,m);case"base64":return $(this,c,m);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return be(this,c,m);default:if(T)throw new TypeError("Unknown encoding: "+n);n=(n+"").toLowerCase(),T=!0}}g(O,"slowToString"),o.prototype._isBuffer=!0;function D(n,c,m){let T=n[c];n[c]=n[m],n[m]=T}g(D,"swap"),o.prototype.swap16=g(function(){let n=this.length;if(n%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let c=0;c<n;c+=2)D(this,c,c+1);return this},"swap16"),o.prototype.swap32=g(function(){let n=this.length;if(n%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let c=0;c<n;c+=4)D(this,c,c+3),D(this,c+1,c+2);return this},"swap32"),o.prototype.swap64=g(function(){let n=this.length;if(n%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let c=0;c<n;c+=8)D(this,c,c+7),D(this,c+1,c+6),D(this,c+2,c+5),D(this,c+3,c+4);return this},"swap64"),o.prototype.toString=g(function(){let n=this.length;return n===0?"":arguments.length===0?P(this,0,n):O.apply(this,arguments)},"toString"),o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=g(function(n){if(!o.isBuffer(n))throw new TypeError("Argument must be a Buffer");return this===n?!0:o.compare(this,n)===0},"equals"),o.prototype.inspect=g(function(){let n="",c=e.INSPECT_MAX_BYTES;return n=this.toString("hex",0,c).replace(/(.{2})/g,"$1 ").trim(),this.length>c&&(n+=" ... "),"<Buffer "+n+">"},"inspect"),r&&(o.prototype[r]=o.prototype.inspect),o.prototype.compare=g(function(n,c,m,T,C){if(we(n,Uint8Array)&&(n=o.from(n,n.offset,n.byteLength)),!o.isBuffer(n))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof n);if(c===void 0&&(c=0),m===void 0&&(m=n?n.length:0),T===void 0&&(T=0),C===void 0&&(C=this.length),c<0||m>n.length||T<0||C>this.length)throw new RangeError("out of range index");if(T>=C&&c>=m)return 0;if(T>=C)return-1;if(c>=m)return 1;if(c>>>=0,m>>>=0,T>>>=0,C>>>=0,this===n)return 0;let B=C-T,F=m-c,ie=Math.min(B,F),pe=this.slice(T,C),ne=n.slice(c,m);for(let ae=0;ae<ie;++ae)if(pe[ae]!==ne[ae]){B=pe[ae],F=ne[ae];break}return B<F?-1:F<B?1:0},"compare");function S(n,c,m,T,C){if(n.length===0)return-1;if(typeof m=="string"?(T=m,m=0):m>2147483647?m=2147483647:m<-2147483648&&(m=-2147483648),m=+m,Xt(m)&&(m=C?0:n.length-1),m<0&&(m=n.length+m),m>=n.length){if(C)return-1;m=n.length-1}else if(m<0)if(C)m=0;else return-1;if(typeof c=="string"&&(c=o.from(c,T)),o.isBuffer(c))return c.length===0?-1:I(n,c,m,T,C);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?C?Uint8Array.prototype.indexOf.call(n,c,m):Uint8Array.prototype.lastIndexOf.call(n,c,m):I(n,[c],m,T,C);throw new TypeError("val must be string, number or Buffer")}g(S,"bidirectionalIndexOf");function I(n,c,m,T,C){let B=1,F=n.length,ie=c.length;if(T!==void 0&&(T=String(T).toLowerCase(),T==="ucs2"||T==="ucs-2"||T==="utf16le"||T==="utf-16le")){if(n.length<2||c.length<2)return-1;B=2,F/=2,ie/=2,m/=2}function pe(ae,oe){return B===1?ae[oe]:ae.readUInt16BE(oe*B)}g(pe,"read");let ne;if(C){let ae=-1;for(ne=m;ne<F;ne++)if(pe(n,ne)===pe(c,ae===-1?0:ne-ae)){if(ae===-1&&(ae=ne),ne-ae+1===ie)return ae*B}else ae!==-1&&(ne-=ne-ae),ae=-1}else for(m+ie>F&&(m=F-ie),ne=m;ne>=0;ne--){let ae=!0;for(let oe=0;oe<ie;oe++)if(pe(n,ne+oe)!==pe(c,oe)){ae=!1;break}if(ae)return ne}return-1}g(I,"arrayIndexOf"),o.prototype.includes=g(function(n,c,m){return this.indexOf(n,c,m)!==-1},"includes"),o.prototype.indexOf=g(function(n,c,m){return S(this,n,c,m,!0)},"indexOf"),o.prototype.lastIndexOf=g(function(n,c,m){return S(this,n,c,m,!1)},"lastIndexOf");function L(n,c,m,T){m=Number(m)||0;let C=n.length-m;T?(T=Number(T),T>C&&(T=C)):T=C;let B=c.length;T>B/2&&(T=B/2);let F;for(F=0;F<T;++F){let ie=parseInt(c.substr(F*2,2),16);if(Xt(ie))return F;n[m+F]=ie}return F}g(L,"hexWrite");function k(n,c,m,T){return kt(Yt(c,n.length-m),n,m,T)}g(k,"utf8Write");function N(n,c,m,T){return kt(ar(c),n,m,T)}g(N,"asciiWrite");function A(n,c,m,T){return kt(ks(c),n,m,T)}g(A,"base64Write");function z(n,c,m,T){return kt(nr(c,n.length-m),n,m,T)}g(z,"ucs2Write"),o.prototype.write=g(function(n,c,m,T){if(c===void 0)T="utf8",m=this.length,c=0;else if(m===void 0&&typeof c=="string")T=c,m=this.length,c=0;else if(isFinite(c))c=c>>>0,isFinite(m)?(m=m>>>0,T===void 0&&(T="utf8")):(T=m,m=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let C=this.length-c;if((m===void 0||m>C)&&(m=C),n.length>0&&(m<0||c<0)||c>this.length)throw new RangeError("Attempt to write outside buffer bounds");T||(T="utf8");let B=!1;for(;;)switch(T){case"hex":return L(this,n,c,m);case"utf8":case"utf-8":return k(this,n,c,m);case"ascii":case"latin1":case"binary":return N(this,n,c,m);case"base64":return A(this,n,c,m);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return z(this,n,c,m);default:if(B)throw new TypeError("Unknown encoding: "+T);T=(""+T).toLowerCase(),B=!0}},"write"),o.prototype.toJSON=g(function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},"toJSON");function $(n,c,m){return c===0&&m===n.length?t.fromByteArray(n):t.fromByteArray(n.slice(c,m))}g($,"base64Slice");function P(n,c,m){m=Math.min(n.length,m);let T=[],C=c;for(;C<m;){let B=n[C],F=null,ie=B>239?4:B>223?3:B>191?2:1;if(C+ie<=m){let pe,ne,ae,oe;switch(ie){case 1:B<128&&(F=B);break;case 2:pe=n[C+1],(pe&192)===128&&(oe=(B&31)<<6|pe&63,oe>127&&(F=oe));break;case 3:pe=n[C+1],ne=n[C+2],(pe&192)===128&&(ne&192)===128&&(oe=(B&15)<<12|(pe&63)<<6|ne&63,oe>2047&&(oe<55296||oe>57343)&&(F=oe));break;case 4:pe=n[C+1],ne=n[C+2],ae=n[C+3],(pe&192)===128&&(ne&192)===128&&(ae&192)===128&&(oe=(B&15)<<18|(pe&63)<<12|(ne&63)<<6|ae&63,oe>65535&&oe<1114112&&(F=oe))}}F===null?(F=65533,ie=1):F>65535&&(F-=65536,T.push(F>>>10&1023|55296),F=56320|F&1023),T.push(F),C+=ie}return V(T)}g(P,"utf8Slice");var U=4096;function V(n){let c=n.length;if(c<=U)return String.fromCharCode.apply(String,n);let m="",T=0;for(;T<c;)m+=String.fromCharCode.apply(String,n.slice(T,T+=U));return m}g(V,"decodeCodePointsArray");function Y(n,c,m){let T="";m=Math.min(n.length,m);for(let C=c;C<m;++C)T+=String.fromCharCode(n[C]&127);return T}g(Y,"asciiSlice");function te(n,c,m){let T="";m=Math.min(n.length,m);for(let C=c;C<m;++C)T+=String.fromCharCode(n[C]);return T}g(te,"latin1Slice");function K(n,c,m){let T=n.length;(!c||c<0)&&(c=0),(!m||m<0||m>T)&&(m=T);let C="";for(let B=c;B<m;++B)C+=Ji[n[B]];return C}g(K,"hexSlice");function be(n,c,m){let T=n.slice(c,m),C="";for(let B=0;B<T.length-1;B+=2)C+=String.fromCharCode(T[B]+T[B+1]*256);return C}g(be,"utf16leSlice"),o.prototype.slice=g(function(n,c){let m=this.length;n=~~n,c=c===void 0?m:~~c,n<0?(n+=m,n<0&&(n=0)):n>m&&(n=m),c<0?(c+=m,c<0&&(c=0)):c>m&&(c=m),c<n&&(c=n);let T=this.subarray(n,c);return Object.setPrototypeOf(T,o.prototype),T},"slice");function re(n,c,m){if(n%1!==0||n<0)throw new RangeError("offset is not uint");if(n+c>m)throw new RangeError("Trying to access beyond buffer length")}g(re,"checkOffset"),o.prototype.readUintLE=o.prototype.readUIntLE=g(function(n,c,m){n=n>>>0,c=c>>>0,m||re(n,c,this.length);let T=this[n],C=1,B=0;for(;++B<c&&(C*=256);)T+=this[n+B]*C;return T},"readUIntLE"),o.prototype.readUintBE=o.prototype.readUIntBE=g(function(n,c,m){n=n>>>0,c=c>>>0,m||re(n,c,this.length);let T=this[n+--c],C=1;for(;c>0&&(C*=256);)T+=this[n+--c]*C;return T},"readUIntBE"),o.prototype.readUint8=o.prototype.readUInt8=g(function(n,c){return n=n>>>0,c||re(n,1,this.length),this[n]},"readUInt8"),o.prototype.readUint16LE=o.prototype.readUInt16LE=g(function(n,c){return n=n>>>0,c||re(n,2,this.length),this[n]|this[n+1]<<8},"readUInt16LE"),o.prototype.readUint16BE=o.prototype.readUInt16BE=g(function(n,c){return n=n>>>0,c||re(n,2,this.length),this[n]<<8|this[n+1]},"readUInt16BE"),o.prototype.readUint32LE=o.prototype.readUInt32LE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),(this[n]|this[n+1]<<8|this[n+2]<<16)+this[n+3]*16777216},"readUInt32LE"),o.prototype.readUint32BE=o.prototype.readUInt32BE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),this[n]*16777216+(this[n+1]<<16|this[n+2]<<8|this[n+3])},"readUInt32BE"),o.prototype.readBigUInt64LE=Ce(g(function(n){n=n>>>0,qe(n,"offset");let c=this[n],m=this[n+7];(c===void 0||m===void 0)&&it(n,this.length-8);let T=c+this[++n]*2**8+this[++n]*2**16+this[++n]*2**24,C=this[++n]+this[++n]*2**8+this[++n]*2**16+m*2**24;return BigInt(T)+(BigInt(C)<<BigInt(32))},"readBigUInt64LE")),o.prototype.readBigUInt64BE=Ce(g(function(n){n=n>>>0,qe(n,"offset");let c=this[n],m=this[n+7];(c===void 0||m===void 0)&&it(n,this.length-8);let T=c*2**24+this[++n]*2**16+this[++n]*2**8+this[++n],C=this[++n]*2**24+this[++n]*2**16+this[++n]*2**8+m;return(BigInt(T)<<BigInt(32))+BigInt(C)},"readBigUInt64BE")),o.prototype.readIntLE=g(function(n,c,m){n=n>>>0,c=c>>>0,m||re(n,c,this.length);let T=this[n],C=1,B=0;for(;++B<c&&(C*=256);)T+=this[n+B]*C;return C*=128,T>=C&&(T-=Math.pow(2,8*c)),T},"readIntLE"),o.prototype.readIntBE=g(function(n,c,m){n=n>>>0,c=c>>>0,m||re(n,c,this.length);let T=c,C=1,B=this[n+--T];for(;T>0&&(C*=256);)B+=this[n+--T]*C;return C*=128,B>=C&&(B-=Math.pow(2,8*c)),B},"readIntBE"),o.prototype.readInt8=g(function(n,c){return n=n>>>0,c||re(n,1,this.length),this[n]&128?(255-this[n]+1)*-1:this[n]},"readInt8"),o.prototype.readInt16LE=g(function(n,c){n=n>>>0,c||re(n,2,this.length);let m=this[n]|this[n+1]<<8;return m&32768?m|4294901760:m},"readInt16LE"),o.prototype.readInt16BE=g(function(n,c){n=n>>>0,c||re(n,2,this.length);let m=this[n+1]|this[n]<<8;return m&32768?m|4294901760:m},"readInt16BE"),o.prototype.readInt32LE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),this[n]|this[n+1]<<8|this[n+2]<<16|this[n+3]<<24},"readInt32LE"),o.prototype.readInt32BE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),this[n]<<24|this[n+1]<<16|this[n+2]<<8|this[n+3]},"readInt32BE"),o.prototype.readBigInt64LE=Ce(g(function(n){n=n>>>0,qe(n,"offset");let c=this[n],m=this[n+7];(c===void 0||m===void 0)&&it(n,this.length-8);let T=this[n+4]+this[n+5]*2**8+this[n+6]*2**16+(m<<24);return(BigInt(T)<<BigInt(32))+BigInt(c+this[++n]*2**8+this[++n]*2**16+this[++n]*2**24)},"readBigInt64LE")),o.prototype.readBigInt64BE=Ce(g(function(n){n=n>>>0,qe(n,"offset");let c=this[n],m=this[n+7];(c===void 0||m===void 0)&&it(n,this.length-8);let T=(c<<24)+this[++n]*2**16+this[++n]*2**8+this[++n];return(BigInt(T)<<BigInt(32))+BigInt(this[++n]*2**24+this[++n]*2**16+this[++n]*2**8+m)},"readBigInt64BE")),o.prototype.readFloatLE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),s.read(this,n,!0,23,4)},"readFloatLE"),o.prototype.readFloatBE=g(function(n,c){return n=n>>>0,c||re(n,4,this.length),s.read(this,n,!1,23,4)},"readFloatBE"),o.prototype.readDoubleLE=g(function(n,c){return n=n>>>0,c||re(n,8,this.length),s.read(this,n,!0,52,8)},"readDoubleLE"),o.prototype.readDoubleBE=g(function(n,c){return n=n>>>0,c||re(n,8,this.length),s.read(this,n,!1,52,8)},"readDoubleBE");function le(n,c,m,T,C,B){if(!o.isBuffer(n))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>C||c<B)throw new RangeError('"value" argument is out of bounds');if(m+T>n.length)throw new RangeError("Index out of range")}g(le,"checkInt"),o.prototype.writeUintLE=o.prototype.writeUIntLE=g(function(n,c,m,T){if(n=+n,c=c>>>0,m=m>>>0,!T){let F=Math.pow(2,8*m)-1;le(this,n,c,m,F,0)}let C=1,B=0;for(this[c]=n&255;++B<m&&(C*=256);)this[c+B]=n/C&255;return c+m},"writeUIntLE"),o.prototype.writeUintBE=o.prototype.writeUIntBE=g(function(n,c,m,T){if(n=+n,c=c>>>0,m=m>>>0,!T){let F=Math.pow(2,8*m)-1;le(this,n,c,m,F,0)}let C=m-1,B=1;for(this[c+C]=n&255;--C>=0&&(B*=256);)this[c+C]=n/B&255;return c+m},"writeUIntBE"),o.prototype.writeUint8=o.prototype.writeUInt8=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,1,255,0),this[c]=n&255,c+1},"writeUInt8"),o.prototype.writeUint16LE=o.prototype.writeUInt16LE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,2,65535,0),this[c]=n&255,this[c+1]=n>>>8,c+2},"writeUInt16LE"),o.prototype.writeUint16BE=o.prototype.writeUInt16BE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,2,65535,0),this[c]=n>>>8,this[c+1]=n&255,c+2},"writeUInt16BE"),o.prototype.writeUint32LE=o.prototype.writeUInt32LE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,4,4294967295,0),this[c+3]=n>>>24,this[c+2]=n>>>16,this[c+1]=n>>>8,this[c]=n&255,c+4},"writeUInt32LE"),o.prototype.writeUint32BE=o.prototype.writeUInt32BE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,4,4294967295,0),this[c]=n>>>24,this[c+1]=n>>>16,this[c+2]=n>>>8,this[c+3]=n&255,c+4},"writeUInt32BE");function _t(n,c,m,T,C){Ss(c,T,C,n,m,7);let B=Number(c&BigInt(4294967295));n[m++]=B,B=B>>8,n[m++]=B,B=B>>8,n[m++]=B,B=B>>8,n[m++]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return n[m++]=F,F=F>>8,n[m++]=F,F=F>>8,n[m++]=F,F=F>>8,n[m++]=F,m}g(_t,"wrtBigUInt64LE");function St(n,c,m,T,C){Ss(c,T,C,n,m,7);let B=Number(c&BigInt(4294967295));n[m+7]=B,B=B>>8,n[m+6]=B,B=B>>8,n[m+5]=B,B=B>>8,n[m+4]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return n[m+3]=F,F=F>>8,n[m+2]=F,F=F>>8,n[m+1]=F,F=F>>8,n[m]=F,m+8}g(St,"wrtBigUInt64BE"),o.prototype.writeBigUInt64LE=Ce(g(function(n,c=0){return _t(this,n,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64LE")),o.prototype.writeBigUInt64BE=Ce(g(function(n,c=0){return St(this,n,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64BE")),o.prototype.writeIntLE=g(function(n,c,m,T){if(n=+n,c=c>>>0,!T){let ie=Math.pow(2,8*m-1);le(this,n,c,m,ie-1,-ie)}let C=0,B=1,F=0;for(this[c]=n&255;++C<m&&(B*=256);)n<0&&F===0&&this[c+C-1]!==0&&(F=1),this[c+C]=(n/B>>0)-F&255;return c+m},"writeIntLE"),o.prototype.writeIntBE=g(function(n,c,m,T){if(n=+n,c=c>>>0,!T){let ie=Math.pow(2,8*m-1);le(this,n,c,m,ie-1,-ie)}let C=m-1,B=1,F=0;for(this[c+C]=n&255;--C>=0&&(B*=256);)n<0&&F===0&&this[c+C+1]!==0&&(F=1),this[c+C]=(n/B>>0)-F&255;return c+m},"writeIntBE"),o.prototype.writeInt8=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,1,127,-128),n<0&&(n=255+n+1),this[c]=n&255,c+1},"writeInt8"),o.prototype.writeInt16LE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,2,32767,-32768),this[c]=n&255,this[c+1]=n>>>8,c+2},"writeInt16LE"),o.prototype.writeInt16BE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,2,32767,-32768),this[c]=n>>>8,this[c+1]=n&255,c+2},"writeInt16BE"),o.prototype.writeInt32LE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,4,2147483647,-2147483648),this[c]=n&255,this[c+1]=n>>>8,this[c+2]=n>>>16,this[c+3]=n>>>24,c+4},"writeInt32LE"),o.prototype.writeInt32BE=g(function(n,c,m){return n=+n,c=c>>>0,m||le(this,n,c,4,2147483647,-2147483648),n<0&&(n=4294967295+n+1),this[c]=n>>>24,this[c+1]=n>>>16,this[c+2]=n>>>8,this[c+3]=n&255,c+4},"writeInt32BE"),o.prototype.writeBigInt64LE=Ce(g(function(n,c=0){return _t(this,n,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64LE")),o.prototype.writeBigInt64BE=Ce(g(function(n,c=0){return St(this,n,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64BE"));function xs(n,c,m,T,C,B){if(m+T>n.length)throw new RangeError("Index out of range");if(m<0)throw new RangeError("Index out of range")}g(xs,"checkIEEE754");function ws(n,c,m,T,C){return c=+c,m=m>>>0,C||xs(n,c,m,4),s.write(n,c,m,T,23,4),m+4}g(ws,"writeFloat"),o.prototype.writeFloatLE=g(function(n,c,m){return ws(this,n,c,!0,m)},"writeFloatLE"),o.prototype.writeFloatBE=g(function(n,c,m){return ws(this,n,c,!1,m)},"writeFloatBE");function Es(n,c,m,T,C){return c=+c,m=m>>>0,C||xs(n,c,m,8),s.write(n,c,m,T,52,8),m+8}g(Es,"writeDouble"),o.prototype.writeDoubleLE=g(function(n,c,m){return Es(this,n,c,!0,m)},"writeDoubleLE"),o.prototype.writeDoubleBE=g(function(n,c,m){return Es(this,n,c,!1,m)},"writeDoubleBE"),o.prototype.copy=g(function(n,c,m,T){if(!o.isBuffer(n))throw new TypeError("argument should be a Buffer");if(m||(m=0),!T&&T!==0&&(T=this.length),c>=n.length&&(c=n.length),c||(c=0),T>0&&T<m&&(T=m),T===m||n.length===0||this.length===0)return 0;if(c<0)throw new RangeError("targetStart out of bounds");if(m<0||m>=this.length)throw new RangeError("Index out of range");if(T<0)throw new RangeError("sourceEnd out of bounds");T>this.length&&(T=this.length),n.length-c<T-m&&(T=n.length-c+m);let C=T-m;return this===n&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(c,m,T):Uint8Array.prototype.set.call(n,this.subarray(m,T),c),C},"copy"),o.prototype.fill=g(function(n,c,m,T){if(typeof n=="string"){if(typeof c=="string"?(T=c,c=0,m=this.length):typeof m=="string"&&(T=m,m=this.length),T!==void 0&&typeof T!="string")throw new TypeError("encoding must be a string");if(typeof T=="string"&&!o.isEncoding(T))throw new TypeError("Unknown encoding: "+T);if(n.length===1){let B=n.charCodeAt(0);(T==="utf8"&&B<128||T==="latin1")&&(n=B)}}else typeof n=="number"?n=n&255:typeof n=="boolean"&&(n=Number(n));if(c<0||this.length<c||this.length<m)throw new RangeError("Out of range index");if(m<=c)return this;c=c>>>0,m=m===void 0?this.length:m>>>0,n||(n=0);let C;if(typeof n=="number")for(C=c;C<m;++C)this[C]=n;else{let B=o.isBuffer(n)?n:o.from(n,T),F=B.length;if(F===0)throw new TypeError('The value "'+n+'" is invalid for argument "value"');for(C=0;C<m-c;++C)this[C+c]=B[C%F]}return this},"fill");var rt={};function Qt(n,c,m){var T;rt[n]=(T=class extends m{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${n}]`,this.stack,delete this.name}get code(){return n}set code(C){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:C,writable:!0})}toString(){return`${this.name} [${n}]: ${this.message}`}},g(T,"NodeError"),T)}g(Qt,"E"),Qt("ERR_BUFFER_OUT_OF_BOUNDS",function(n){return n?`${n} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Qt("ERR_INVALID_ARG_TYPE",function(n,c){return`The "${n}" argument must be of type number. Received type ${typeof c}`},TypeError),Qt("ERR_OUT_OF_RANGE",function(n,c,m){let T=`The value of "${n}" is out of range.`,C=m;return Number.isInteger(m)&&Math.abs(m)>2**32?C=_s(String(m)):typeof m=="bigint"&&(C=String(m),(m>BigInt(2)**BigInt(32)||m<-(BigInt(2)**BigInt(32)))&&(C=_s(C)),C+="n"),T+=` It must be ${c}. Received ${C}`,T},RangeError);function _s(n){let c="",m=n.length,T=n[0]==="-"?1:0;for(;m>=T+4;m-=3)c=`_${n.slice(m-3,m)}${c}`;return`${n.slice(0,m)}${c}`}g(_s,"addNumericalSeparator");function rr(n,c,m){qe(c,"offset"),(n[c]===void 0||n[c+m]===void 0)&&it(c,n.length-(m+1))}g(rr,"checkBounds");function Ss(n,c,m,T,C,B){if(n>m||n<c){let F=typeof c=="bigint"?"n":"",ie;throw B>3?c===0||c===BigInt(0)?ie=`>= 0${F} and < 2${F} ** ${(B+1)*8}${F}`:ie=`>= -(2${F} ** ${(B+1)*8-1}${F}) and < 2 ** ${(B+1)*8-1}${F}`:ie=`>= ${c}${F} and <= ${m}${F}`,new rt.ERR_OUT_OF_RANGE("value",ie,n)}rr(T,C,B)}g(Ss,"checkIntBI");function qe(n,c){if(typeof n!="number")throw new rt.ERR_INVALID_ARG_TYPE(c,"number",n)}g(qe,"validateNumber");function it(n,c,m){throw Math.floor(n)!==n?(qe(n,m),new rt.ERR_OUT_OF_RANGE(m||"offset","an integer",n)):c<0?new rt.ERR_BUFFER_OUT_OF_BOUNDS:new rt.ERR_OUT_OF_RANGE(m||"offset",`>= ${m?1:0} and <= ${c}`,n)}g(it,"boundsError");var Ki=/[^+/0-9A-Za-z-_]/g;function ir(n){if(n=n.split("=")[0],n=n.trim().replace(Ki,""),n.length<2)return"";for(;n.length%4!==0;)n=n+"=";return n}g(ir,"base64clean");function Yt(n,c){c=c||1/0;let m,T=n.length,C=null,B=[];for(let F=0;F<T;++F){if(m=n.charCodeAt(F),m>55295&&m<57344){if(!C){if(m>56319){(c-=3)>-1&&B.push(239,191,189);continue}else if(F+1===T){(c-=3)>-1&&B.push(239,191,189);continue}C=m;continue}if(m<56320){(c-=3)>-1&&B.push(239,191,189),C=m;continue}m=(C-55296<<10|m-56320)+65536}else C&&(c-=3)>-1&&B.push(239,191,189);if(C=null,m<128){if((c-=1)<0)break;B.push(m)}else if(m<2048){if((c-=2)<0)break;B.push(m>>6|192,m&63|128)}else if(m<65536){if((c-=3)<0)break;B.push(m>>12|224,m>>6&63|128,m&63|128)}else if(m<1114112){if((c-=4)<0)break;B.push(m>>18|240,m>>12&63|128,m>>6&63|128,m&63|128)}else throw new Error("Invalid code point")}return B}g(Yt,"utf8ToBytes");function ar(n){let c=[];for(let m=0;m<n.length;++m)c.push(n.charCodeAt(m)&255);return c}g(ar,"asciiToBytes");function nr(n,c){let m,T,C,B=[];for(let F=0;F<n.length&&!((c-=2)<0);++F)m=n.charCodeAt(F),T=m>>8,C=m%256,B.push(C),B.push(T);return B}g(nr,"utf16leToBytes");function ks(n){return t.toByteArray(ir(n))}g(ks,"base64ToBytes");function kt(n,c,m,T){let C;for(C=0;C<T&&!(C+m>=c.length||C>=n.length);++C)c[C+m]=n[C];return C}g(kt,"blitBuffer");function we(n,c){return n instanceof c||n!=null&&n.constructor!=null&&n.constructor.name!=null&&n.constructor.name===c.name}g(we,"isInstance");function Xt(n){return n!==n}g(Xt,"numberIsNaN");var Ji=(function(){let n="0123456789abcdef",c=new Array(256);for(let m=0;m<16;++m){let T=m*16;for(let C=0;C<16;++C)c[T+C]=n[m]+n[C]}return c})();function Ce(n){return typeof BigInt>"u"?or:n}g(Ce,"defineBigIntMethod");function or(){throw new Error("BigInt not supported")}g(or,"BufferBigIntNotDefined")}),us,qs,G,Z,q=ge(()=>{us=globalThis,qs=globalThis.setImmediate??(e=>setTimeout(e,0)),G=typeof globalThis.Buffer=="function"&&typeof globalThis.Buffer.allocUnsafe=="function"?globalThis.Buffer:Ja().Buffer,Z=globalThis.process??{},Z.env??(Z.env={});try{Z.nextTick(()=>{})}catch{let e=Promise.resolve();Z.nextTick=e.then.bind(e)}}),tt=ee((e,t)=>{q();var s=typeof Reflect=="object"?Reflect:null,r=s&&typeof s.apply=="function"?s.apply:g(function(S,I,L){return Function.prototype.apply.call(S,I,L)},"ReflectApply"),i;s&&typeof s.ownKeys=="function"?i=s.ownKeys:Object.getOwnPropertySymbols?i=g(function(S){return Object.getOwnPropertyNames(S).concat(Object.getOwnPropertySymbols(S))},"ReflectOwnKeys"):i=g(function(S){return Object.getOwnPropertyNames(S)},"ReflectOwnKeys");function a(S){console&&console.warn&&console.warn(S)}g(a,"ProcessEmitWarning");var l=Number.isNaN||g(function(S){return S!==S},"NumberIsNaN");function o(){o.init.call(this)}g(o,"EventEmitter"),t.exports=o,t.exports.once=_,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var p=10;function h(S){if(typeof S!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof S)}g(h,"checkListener"),Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:g(function(){return p},"get"),set:g(function(S){if(typeof S!="number"||S<0||l(S))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+S+".");p=S},"set")}),o.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=g(function(S){if(typeof S!="number"||S<0||l(S))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+S+".");return this._maxListeners=S,this},"setMaxListeners");function f(S){return S._maxListeners===void 0?o.defaultMaxListeners:S._maxListeners}g(f,"_getMaxListeners"),o.prototype.getMaxListeners=g(function(){return f(this)},"getMaxListeners"),o.prototype.emit=g(function(S){for(var I=[],L=1;L<arguments.length;L++)I.push(arguments[L]);var k=S==="error",N=this._events;if(N!==void 0)k=k&&N.error===void 0;else if(!k)return!1;if(k){var A;if(I.length>0&&(A=I[0]),A instanceof Error)throw A;var z=new Error("Unhandled error."+(A?" ("+A.message+")":""));throw z.context=A,z}var $=N[S];if($===void 0)return!1;if(typeof $=="function")r($,this,I);else for(var P=$.length,U=v($,P),L=0;L<P;++L)r(U[L],this,I);return!0},"emit");function y(S,I,L,k){var N,A,z;if(h(L),A=S._events,A===void 0?(A=S._events=Object.create(null),S._eventsCount=0):(A.newListener!==void 0&&(S.emit("newListener",I,L.listener?L.listener:L),A=S._events),z=A[I]),z===void 0)z=A[I]=L,++S._eventsCount;else if(typeof z=="function"?z=A[I]=k?[L,z]:[z,L]:k?z.unshift(L):z.push(L),N=f(S),N>0&&z.length>N&&!z.warned){z.warned=!0;var $=new Error("Possible EventEmitter memory leak detected. "+z.length+" "+String(I)+" listeners added. Use emitter.setMaxListeners() to increase limit");$.name="MaxListenersExceededWarning",$.emitter=S,$.type=I,$.count=z.length,a($)}return S}g(y,"_addListener"),o.prototype.addListener=g(function(S,I){return y(this,S,I,!1)},"addListener"),o.prototype.on=o.prototype.addListener,o.prototype.prependListener=g(function(S,I){return y(this,S,I,!0)},"prependListener");function b(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}g(b,"onceWrapper");function x(S,I,L){var k={fired:!1,wrapFn:void 0,target:S,type:I,listener:L},N=b.bind(k);return N.listener=L,k.wrapFn=N,N}g(x,"_onceWrap"),o.prototype.once=g(function(S,I){return h(I),this.on(S,x(this,S,I)),this},"once"),o.prototype.prependOnceListener=g(function(S,I){return h(I),this.prependListener(S,x(this,S,I)),this},"prependOnceListener"),o.prototype.removeListener=g(function(S,I){var L,k,N,A,z;if(h(I),k=this._events,k===void 0)return this;if(L=k[S],L===void 0)return this;if(L===I||L.listener===I)--this._eventsCount===0?this._events=Object.create(null):(delete k[S],k.removeListener&&this.emit("removeListener",S,L.listener||I));else if(typeof L!="function"){for(N=-1,A=L.length-1;A>=0;A--)if(L[A]===I||L[A].listener===I){z=L[A].listener,N=A;break}if(N<0)return this;N===0?L.shift():w(L,N),L.length===1&&(k[S]=L[0]),k.removeListener!==void 0&&this.emit("removeListener",S,z||I)}return this},"removeListener"),o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=g(function(S){var I,L,k;if(L=this._events,L===void 0)return this;if(L.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):L[S]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete L[S]),this;if(arguments.length===0){var N=Object.keys(L),A;for(k=0;k<N.length;++k)A=N[k],A!=="removeListener"&&this.removeAllListeners(A);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(I=L[S],typeof I=="function")this.removeListener(S,I);else if(I!==void 0)for(k=I.length-1;k>=0;k--)this.removeListener(S,I[k]);return this},"removeAllListeners");function d(S,I,L){var k=S._events;if(k===void 0)return[];var N=k[I];return N===void 0?[]:typeof N=="function"?L?[N.listener||N]:[N]:L?E(N):v(N,N.length)}g(d,"_listeners"),o.prototype.listeners=g(function(S){return d(this,S,!0)},"listeners"),o.prototype.rawListeners=g(function(S){return d(this,S,!1)},"rawListeners"),o.listenerCount=function(S,I){return typeof S.listenerCount=="function"?S.listenerCount(I):u.call(S,I)},o.prototype.listenerCount=u;function u(S){var I=this._events;if(I!==void 0){var L=I[S];if(typeof L=="function")return 1;if(L!==void 0)return L.length}return 0}g(u,"listenerCount"),o.prototype.eventNames=g(function(){return this._eventsCount>0?i(this._events):[]},"eventNames");function v(S,I){for(var L=new Array(I),k=0;k<I;++k)L[k]=S[k];return L}g(v,"arrayClone");function w(S,I){for(;I+1<S.length;I++)S[I]=S[I+1];S.pop()}g(w,"spliceOne");function E(S){for(var I=new Array(S.length),L=0;L<I.length;++L)I[L]=S[L].listener||S[L];return I}g(E,"unwrapListeners");function _(S,I){return new Promise(function(L,k){function N(z){S.removeListener(I,A),k(z)}g(N,"errorListener");function A(){typeof S.removeListener=="function"&&S.removeListener("error",N),L([].slice.call(arguments))}g(A,"resolver"),D(S,I,A,{once:!0}),I!=="error"&&O(S,N,{once:!0})})}g(_,"once");function O(S,I,L){typeof S.on=="function"&&D(S,"error",I,L)}g(O,"addErrorHandlerIfEventEmitter");function D(S,I,L,k){if(typeof S.on=="function")k.once?S.once(I,L):S.on(I,L);else if(typeof S.addEventListener=="function")S.addEventListener(I,g(function N(A){k.once&&S.removeEventListener(I,N),L(A)},"wrapListener"));else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof S)}g(D,"eventTargetAgnosticAddListener")}),Yr={};ke(Yr,{Socket:()=>Nt,isIP:()=>Xr});function Xr(e){return 0}var mr,Ls,It,Nt,Ht=ge(()=>{q(),mr=et(tt(),1),g(Xr,"isIP"),Ls=/^[^.]+\./,It=class H extends mr.EventEmitter{constructor(){super(...arguments),Q(this,"opts",{}),Q(this,"connecting",!1),Q(this,"pending",!0),Q(this,"writable",!0),Q(this,"encrypted",!1),Q(this,"authorized",!1),Q(this,"destroyed",!1),Q(this,"ws",null),Q(this,"writeBuffer"),Q(this,"tlsState",0),Q(this,"tlsRead"),Q(this,"tlsWrite")}static get poolQueryViaFetch(){return H.opts.poolQueryViaFetch??H.defaults.poolQueryViaFetch}static set poolQueryViaFetch(t){H.opts.poolQueryViaFetch=t}static get fetchEndpoint(){return H.opts.fetchEndpoint??H.defaults.fetchEndpoint}static set fetchEndpoint(t){H.opts.fetchEndpoint=t}static get fetchConnectionCache(){return!0}static set fetchConnectionCache(t){console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)")}static get fetchFunction(){return H.opts.fetchFunction??H.defaults.fetchFunction}static set fetchFunction(t){H.opts.fetchFunction=t}static get webSocketConstructor(){return H.opts.webSocketConstructor??H.defaults.webSocketConstructor}static set webSocketConstructor(t){H.opts.webSocketConstructor=t}get webSocketConstructor(){return this.opts.webSocketConstructor??H.webSocketConstructor}set webSocketConstructor(t){this.opts.webSocketConstructor=t}static get wsProxy(){return H.opts.wsProxy??H.defaults.wsProxy}static set wsProxy(t){H.opts.wsProxy=t}get wsProxy(){return this.opts.wsProxy??H.wsProxy}set wsProxy(t){this.opts.wsProxy=t}static get coalesceWrites(){return H.opts.coalesceWrites??H.defaults.coalesceWrites}static set coalesceWrites(t){H.opts.coalesceWrites=t}get coalesceWrites(){return this.opts.coalesceWrites??H.coalesceWrites}set coalesceWrites(t){this.opts.coalesceWrites=t}static get useSecureWebSocket(){return H.opts.useSecureWebSocket??H.defaults.useSecureWebSocket}static set useSecureWebSocket(t){H.opts.useSecureWebSocket=t}get useSecureWebSocket(){return this.opts.useSecureWebSocket??H.useSecureWebSocket}set useSecureWebSocket(t){this.opts.useSecureWebSocket=t}static get forceDisablePgSSL(){return H.opts.forceDisablePgSSL??H.defaults.forceDisablePgSSL}static set forceDisablePgSSL(t){H.opts.forceDisablePgSSL=t}get forceDisablePgSSL(){return this.opts.forceDisablePgSSL??H.forceDisablePgSSL}set forceDisablePgSSL(t){this.opts.forceDisablePgSSL=t}static get disableSNI(){return H.opts.disableSNI??H.defaults.disableSNI}static set disableSNI(t){H.opts.disableSNI=t}get disableSNI(){return this.opts.disableSNI??H.disableSNI}set disableSNI(t){this.opts.disableSNI=t}static get disableWarningInBrowsers(){return H.opts.disableWarningInBrowsers??H.defaults.disableWarningInBrowsers}static set disableWarningInBrowsers(t){H.opts.disableWarningInBrowsers=t}get disableWarningInBrowsers(){return this.opts.disableWarningInBrowsers??H.disableWarningInBrowsers}set disableWarningInBrowsers(t){this.opts.disableWarningInBrowsers=t}static get pipelineConnect(){return H.opts.pipelineConnect??H.defaults.pipelineConnect}static set pipelineConnect(t){H.opts.pipelineConnect=t}get pipelineConnect(){return this.opts.pipelineConnect??H.pipelineConnect}set pipelineConnect(t){this.opts.pipelineConnect=t}static get subtls(){return H.opts.subtls??H.defaults.subtls}static set subtls(t){H.opts.subtls=t}get subtls(){return this.opts.subtls??H.subtls}set subtls(t){this.opts.subtls=t}static get pipelineTLS(){return H.opts.pipelineTLS??H.defaults.pipelineTLS}static set pipelineTLS(t){H.opts.pipelineTLS=t}get pipelineTLS(){return this.opts.pipelineTLS??H.pipelineTLS}set pipelineTLS(t){this.opts.pipelineTLS=t}static get rootCerts(){return H.opts.rootCerts??H.defaults.rootCerts}static set rootCerts(t){H.opts.rootCerts=t}get rootCerts(){return this.opts.rootCerts??H.rootCerts}set rootCerts(t){this.opts.rootCerts=t}wsProxyAddrForHost(t,s){let r=this.wsProxy;if(r===void 0)throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");return typeof r=="function"?r(t,s):`${r}?address=${t}:${s}`}setNoDelay(){return this}setKeepAlive(){return this}ref(){return this}unref(){return this}connect(t,s,r){this.connecting=!0,r&&this.once("connect",r);let i=g(()=>{this.connecting=!1,this.pending=!1,this.emit("connect"),this.emit("ready")},"handleWebSocketOpen"),a=g((o,p=!1)=>{o.binaryType="arraybuffer",o.addEventListener("error",h=>{this.emit("error",h),this.emit("close")}),o.addEventListener("message",h=>{if(this.tlsState===0){let f=G.from(h.data);this.emit("data",f)}}),o.addEventListener("close",()=>{this.emit("close")}),p?i():o.addEventListener("open",i)},"configureWebSocket"),l;try{l=this.wsProxyAddrForHost(s,typeof t=="string"?parseInt(t,10):t)}catch(o){this.emit("error",o),this.emit("close");return}try{let o=(this.useSecureWebSocket?"wss:":"ws:")+"//"+l;if(this.webSocketConstructor!==void 0)this.ws=new this.webSocketConstructor(o),a(this.ws);else try{this.ws=new WebSocket(o),a(this.ws)}catch{this.ws=new __unstable_WebSocket(o),a(this.ws)}}catch(o){let p=(this.useSecureWebSocket?"https:":"http:")+"//"+l;fetch(p,{headers:{Upgrade:"websocket"}}).then(h=>{if(this.ws=h.webSocket,this.ws==null)throw o;this.ws.accept(),a(this.ws,!0)}).catch(h=>{this.emit("error",new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${h}`)),this.emit("close")})}}async startTls(t){if(this.subtls===void 0)throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");this.tlsState=1;let s=await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts),r=new this.subtls.WebSocketReadQueue(this.ws),i=r.read.bind(r),a=this.rawWrite.bind(this),{read:l,write:o}=await this.subtls.startTls(t,s,i,a,{useSNI:!this.disableSNI,expectPreData:this.pipelineTLS?new Uint8Array([83]):void 0});this.tlsRead=l,this.tlsWrite=o,this.tlsState=2,this.encrypted=!0,this.authorized=!0,this.emit("secureConnection",this),this.tlsReadLoop()}async tlsReadLoop(){for(;;){let t=await this.tlsRead();if(t===void 0)break;{let s=G.from(t);this.emit("data",s)}}}rawWrite(t){if(!this.coalesceWrites){this.ws&&this.ws.send(t);return}if(this.writeBuffer===void 0)this.writeBuffer=t,setTimeout(()=>{this.ws&&this.ws.send(this.writeBuffer),this.writeBuffer=void 0},0);else{let s=new Uint8Array(this.writeBuffer.length+t.length);s.set(this.writeBuffer),s.set(t,this.writeBuffer.length),this.writeBuffer=s}}write(t,s="utf8",r=i=>{}){return t.length===0?(r(),!0):(typeof t=="string"&&(t=G.from(t,s)),this.tlsState===0?(this.rawWrite(t),r()):this.tlsState===1?this.once("secureConnection",()=>{this.write(t,s,r)}):(this.tlsWrite(t),r()),!0)}end(t=G.alloc(0),s="utf8",r=()=>{}){return this.write(t,s,()=>{this.ws.close(),r()}),this}destroy(){return this.destroyed=!0,this.end()}},g(It,"Socket"),Q(It,"defaults",{poolQueryViaFetch:!1,fetchEndpoint:g((e,t,s)=>{let r;return s!=null&&s.jwtAuth?r=e.replace(Ls,"apiauth."):r=e.replace(Ls,"api."),"https://"+r+"/sql"},"fetchEndpoint"),fetchConnectionCache:!0,fetchFunction:void 0,webSocketConstructor:void 0,wsProxy:g(e=>e+"/v2","wsProxy"),useSecureWebSocket:!0,forceDisablePgSSL:!0,coalesceWrites:!0,pipelineConnect:"password",subtls:void 0,rootCerts:"",pipelineTLS:!1,disableSNI:!1,disableWarningInBrowsers:!1}),Q(It,"opts",{}),Nt=It}),Kr={};ke(Kr,{parse:()=>Hs});function Hs(e,t=!1){let{protocol:s}=new URL(e),r="http:"+e.substring(s.length),{username:i,password:a,host:l,hostname:o,port:p,pathname:h,search:f,searchParams:y,hash:b}=new URL(r);a=decodeURIComponent(a),i=decodeURIComponent(i),h=decodeURIComponent(h);let x=i+":"+a,d=t?Object.fromEntries(y.entries()):f;return{href:e,protocol:s,auth:x,username:i,password:a,host:l,hostname:o,port:p,pathname:h,search:f,query:d,hash:b}}var Jr=ge(()=>{q(),g(Hs,"parse")}),Zr=ee(e=>{q(),e.parse=function(i,a){return new s(i,a).parse()};var t=class ei{constructor(a,l){this.source=a,this.transform=l||r,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var a=this.source[this.position++];return a==="\\"?{value:this.source[this.position++],escaped:!0}:{value:a,escaped:!1}}record(a){this.recorded.push(a)}newEntry(a){var l;(this.recorded.length>0||a)&&(l=this.recorded.join(""),l==="NULL"&&!a&&(l=null),l!==null&&(l=this.transform(l)),this.entries.push(l),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var a=this.nextCharacter();if(a.value==="=")break}}parse(a){var l,o,p;for(this.consumeDimensions();!this.isEof();)if(l=this.nextCharacter(),l.value==="{"&&!p)this.dimension++,this.dimension>1&&(o=new ei(this.source.substr(this.position-1),this.transform),this.entries.push(o.parse(!0)),this.position+=o.position-2);else if(l.value==="}"&&!p){if(this.dimension--,!this.dimension&&(this.newEntry(),a))return this.entries}else l.value==='"'&&!l.escaped?(p&&this.newEntry(!0),p=!p):l.value===","&&!p?this.newEntry():this.record(l.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}};g(t,"ArrayParser");var s=t;function r(i){return i}g(r,"identity")}),ti=ee((e,t)=>{q();var s=Zr();t.exports={create:g(function(r,i){return{parse:g(function(){return s.parse(r,i)},"parse")}},"create")}}),Za=ee((e,t)=>{q();var s=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,r=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,i=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,a=/^-?infinity$/;t.exports=g(function(f){if(a.test(f))return Number(f.replace("i","I"));var y=s.exec(f);if(!y)return l(f)||null;var b=!!y[8],x=parseInt(y[1],10);b&&(x=p(x));var d=parseInt(y[2],10)-1,u=y[3],v=parseInt(y[4],10),w=parseInt(y[5],10),E=parseInt(y[6],10),_=y[7];_=_?1e3*parseFloat(_):0;var O,D=o(f);return D!=null?(O=new Date(Date.UTC(x,d,u,v,w,E,_)),h(x)&&O.setUTCFullYear(x),D!==0&&O.setTime(O.getTime()-D)):(O=new Date(x,d,u,v,w,E,_),h(x)&&O.setFullYear(x)),O},"parseDate");function l(f){var y=r.exec(f);if(y){var b=parseInt(y[1],10),x=!!y[4];x&&(b=p(b));var d=parseInt(y[2],10)-1,u=y[3],v=new Date(b,d,u);return h(b)&&v.setFullYear(b),v}}g(l,"getDate");function o(f){if(f.endsWith("+00"))return 0;var y=i.exec(f.split(" ")[1]);if(y){var b=y[1];if(b==="Z")return 0;var x=b==="-"?-1:1,d=parseInt(y[2],10)*3600+parseInt(y[3]||0,10)*60+parseInt(y[4]||0,10);return d*x*1e3}}g(o,"timeZoneOffset");function p(f){return-(f-1)}g(p,"bcYearToNegativeYear");function h(f){return f>=0&&f<100}g(h,"is0To99")}),en=ee((e,t)=>{q(),t.exports=r;var s=Object.prototype.hasOwnProperty;function r(i){for(var a=1;a<arguments.length;a++){var l=arguments[a];for(var o in l)s.call(l,o)&&(i[o]=l[o])}return i}g(r,"extend")}),tn=ee((e,t)=>{q();var s=en();t.exports=r;function r(E){if(!(this instanceof r))return new r(E);s(this,w(E))}g(r,"PostgresInterval");var i=["seconds","minutes","hours","days","months","years"];r.prototype.toPostgres=function(){var E=i.filter(this.hasOwnProperty,this);return this.milliseconds&&E.indexOf("seconds")<0&&E.push("seconds"),E.length===0?"0":E.map(function(_){var O=this[_]||0;return _==="seconds"&&this.milliseconds&&(O=(O+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),O+" "+_},this).join(" ")};var a={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},l=["years","months","days"],o=["hours","minutes","seconds"];r.prototype.toISOString=r.prototype.toISO=function(){var E=l.map(O,this).join(""),_=o.map(O,this).join("");return"P"+E+"T"+_;function O(D){var S=this[D]||0;return D==="seconds"&&this.milliseconds&&(S=(S+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),S+a[D]}};var p="([+-]?\\d+)",h=p+"\\s+years?",f=p+"\\s+mons?",y=p+"\\s+days?",b="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",x=new RegExp([h,f,y,b].map(function(E){return"("+E+")?"}).join("\\s*")),d={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},u=["hours","minutes","seconds","milliseconds"];function v(E){var _=E+"000000".slice(E.length);return parseInt(_,10)/1e3}g(v,"parseMilliseconds");function w(E){if(!E)return{};var _=x.exec(E),O=_[8]==="-";return Object.keys(d).reduce(function(D,S){var I=d[S],L=_[I];return!L||(L=S==="milliseconds"?v(L):parseInt(L,10),!L)||(O&&~u.indexOf(S)&&(L*=-1),D[S]=L),D},{})}g(w,"parse")}),sn=ee((e,t)=>{q(),t.exports=g(function(s){if(/^\\x/.test(s))return new G(s.substr(2),"hex");for(var r="",i=0;i<s.length;)if(s[i]!=="\\")r+=s[i],++i;else if(/[0-7]{3}/.test(s.substr(i+1,3)))r+=String.fromCharCode(parseInt(s.substr(i+1,3),8)),i+=4;else{for(var a=1;i+a<s.length&&s[i+a]==="\\";)a++;for(var l=0;l<Math.floor(a/2);++l)r+="\\";i+=Math.floor(a/2)*2}return new G(r,"binary")},"parseBytea")}),rn=ee((e,t)=>{q();var s=Zr(),r=ti(),i=Za(),a=tn(),l=sn();function o(k){return g(function(N){return N===null?N:k(N)},"nullAllowed")}g(o,"allowNull");function p(k){return k===null?k:k==="TRUE"||k==="t"||k==="true"||k==="y"||k==="yes"||k==="on"||k==="1"}g(p,"parseBool");function h(k){return k?s.parse(k,p):null}g(h,"parseBoolArray");function f(k){return parseInt(k,10)}g(f,"parseBaseTenInt");function y(k){return k?s.parse(k,o(f)):null}g(y,"parseIntegerArray");function b(k){return k?s.parse(k,o(function(N){return O(N).trim()})):null}g(b,"parseBigIntegerArray");var x=g(function(k){if(!k)return null;var N=r.create(k,function(A){return A!==null&&(A=S(A)),A});return N.parse()},"parsePointArray"),d=g(function(k){if(!k)return null;var N=r.create(k,function(A){return A!==null&&(A=parseFloat(A)),A});return N.parse()},"parseFloatArray"),u=g(function(k){if(!k)return null;var N=r.create(k);return N.parse()},"parseStringArray"),v=g(function(k){if(!k)return null;var N=r.create(k,function(A){return A!==null&&(A=i(A)),A});return N.parse()},"parseDateArray"),w=g(function(k){if(!k)return null;var N=r.create(k,function(A){return A!==null&&(A=a(A)),A});return N.parse()},"parseIntervalArray"),E=g(function(k){return k?s.parse(k,o(l)):null},"parseByteAArray"),_=g(function(k){return parseInt(k,10)},"parseInteger"),O=g(function(k){var N=String(k);return/^\d+$/.test(N)?N:k},"parseBigInteger"),D=g(function(k){return k?s.parse(k,o(JSON.parse)):null},"parseJsonArray"),S=g(function(k){return k[0]!=="("?null:(k=k.substring(1,k.length-1).split(","),{x:parseFloat(k[0]),y:parseFloat(k[1])})},"parsePoint"),I=g(function(k){if(k[0]!=="<"&&k[1]!=="(")return null;for(var N="(",A="",z=!1,$=2;$<k.length-1;$++){if(z||(N+=k[$]),k[$]===")"){z=!0;continue}else if(!z)continue;k[$]!==","&&(A+=k[$])}var P=S(N);return P.radius=parseFloat(A),P},"parseCircle"),L=g(function(k){k(20,O),k(21,_),k(23,_),k(26,_),k(700,parseFloat),k(701,parseFloat),k(16,p),k(1082,i),k(1114,i),k(1184,i),k(600,S),k(651,u),k(718,I),k(1e3,h),k(1001,E),k(1005,y),k(1007,y),k(1028,y),k(1016,b),k(1017,x),k(1021,d),k(1022,d),k(1231,d),k(1014,u),k(1015,u),k(1008,u),k(1009,u),k(1040,u),k(1041,u),k(1115,v),k(1182,v),k(1185,v),k(1186,a),k(1187,w),k(17,l),k(114,JSON.parse.bind(JSON)),k(3802,JSON.parse.bind(JSON)),k(199,D),k(3807,D),k(3907,u),k(2951,u),k(791,u),k(1183,u),k(1270,u)},"init");t.exports={init:L}}),an=ee((e,t)=>{q();var s=1e6;function r(i){var a=i.readInt32BE(0),l=i.readUInt32BE(4),o="";a<0&&(a=~a+(l===0),l=~l+1>>>0,o="-");var p="",h,f,y,b,x,d;{if(h=a%s,a=a/s>>>0,f=4294967296*h+l,l=f/s>>>0,y=""+(f-s*l),l===0&&a===0)return o+y+p;for(b="",x=6-y.length,d=0;d<x;d++)b+="0";p=b+y+p}{if(h=a%s,a=a/s>>>0,f=4294967296*h+l,l=f/s>>>0,y=""+(f-s*l),l===0&&a===0)return o+y+p;for(b="",x=6-y.length,d=0;d<x;d++)b+="0";p=b+y+p}{if(h=a%s,a=a/s>>>0,f=4294967296*h+l,l=f/s>>>0,y=""+(f-s*l),l===0&&a===0)return o+y+p;for(b="",x=6-y.length,d=0;d<x;d++)b+="0";p=b+y+p}return h=a%s,f=4294967296*h+l,y=""+f%s,o+y+p}g(r,"readInt8"),t.exports=r}),nn=ee((e,t)=>{q();var s=an(),r=g(function(u,v,w,E,_){w=w||0,E=E||!1,_=_||function(z,$,P){return z*Math.pow(2,P)+$};var O=w>>3,D=g(function(z){return E?~z&255:z},"inv"),S=255,I=8-w%8;v<I&&(S=255<<8-v&255,I=v),w&&(S=S>>w%8);var L=0;w%8+v>=8&&(L=_(0,D(u[O])&S,I));for(var k=v+w>>3,N=O+1;N<k;N++)L=_(L,D(u[N]),8);var A=(v+w)%8;return A>0&&(L=_(L,D(u[k])>>8-A,A)),L},"parseBits"),i=g(function(u,v,w){var E=Math.pow(2,w-1)-1,_=r(u,1),O=r(u,w,1);if(O===0)return 0;var D=1,S=g(function(L,k,N){L===0&&(L=1);for(var A=1;A<=N;A++)D/=2,(k&1<<N-A)>0&&(L+=D);return L},"parsePrecisionBits"),I=r(u,v,w+1,!1,S);return O==Math.pow(2,w+1)-1?I===0?_===0?1/0:-1/0:NaN:(_===0?1:-1)*Math.pow(2,O-E)*I},"parseFloatFromBits"),a=g(function(u){return r(u,1)==1?-1*(r(u,15,1,!0)+1):r(u,15,1)},"parseInt16"),l=g(function(u){return r(u,1)==1?-1*(r(u,31,1,!0)+1):r(u,31,1)},"parseInt32"),o=g(function(u){return i(u,23,8)},"parseFloat32"),p=g(function(u){return i(u,52,11)},"parseFloat64"),h=g(function(u){var v=r(u,16,32);if(v==49152)return NaN;for(var w=Math.pow(1e4,r(u,16,16)),E=0,_=[],O=r(u,16),D=0;D<O;D++)E+=r(u,16,64+16*D)*w,w/=1e4;var S=Math.pow(10,r(u,16,48));return(v===0?1:-1)*Math.round(E*S)/S},"parseNumeric"),f=g(function(u,v){var w=r(v,1),E=r(v,63,1),_=new Date((w===0?1:-1)*E/1e3+9466848e5);return u||_.setTime(_.getTime()+_.getTimezoneOffset()*6e4),_.usec=E%1e3,_.getMicroSeconds=function(){return this.usec},_.setMicroSeconds=function(O){this.usec=O},_.getUTCMicroSeconds=function(){return this.usec},_},"parseDate"),y=g(function(u){for(var v=r(u,32),w=r(u,32,32),E=r(u,32,64),_=96,O=[],D=0;D<v;D++)O[D]=r(u,32,_),_+=32,_+=32;var S=g(function(L){var k=r(u,32,_);if(_+=32,k==4294967295)return null;var N;if(L==23||L==20)return N=r(u,k*8,_),_+=k*8,N;if(L==25)return N=u.toString(this.encoding,_>>3,(_+=k<<3)>>3),N;console.log("ERROR: ElementType not implemented: "+L)},"parseElement"),I=g(function(L,k){var N=[],A;if(L.length>1){var z=L.shift();for(A=0;A<z;A++)N[A]=I(L,k);L.unshift(z)}else for(A=0;A<L[0];A++)N[A]=S(k);return N},"parse");return I(O,E)},"parseArray"),b=g(function(u){return u.toString("utf8")},"parseText"),x=g(function(u){return u===null?null:r(u,8)>0},"parseBool"),d=g(function(u){u(20,s),u(21,a),u(23,l),u(26,l),u(1700,h),u(700,o),u(701,p),u(16,x),u(1114,f.bind(null,!1)),u(1184,f.bind(null,!0)),u(1e3,y),u(1007,y),u(1016,y),u(1008,y),u(1009,y),u(25,b)},"init");t.exports={init:d}}),on=ee((e,t)=>{q(),t.exports={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}}),hs=ee(e=>{q();var t=rn(),s=nn(),r=ti(),i=on();e.getTypeParser=o,e.setTypeParser=p,e.arrayParser=r,e.builtins=i;var a={text:{},binary:{}};function l(h){return String(h)}g(l,"noParse");function o(h,f){return f=f||"text",a[f]&&a[f][h]||l}g(o,"getTypeParser");function p(h,f,y){typeof f=="function"&&(y=f,f="text"),a[f][h]=y}g(p,"setTypeParser"),t.init(function(h,f){a.text[h]=f}),s.init(function(h,f){a.binary[h]=f})}),Vs=ee((e,t)=>{q();var s=hs();function r(i){this._types=i||s,this.text={},this.binary={}}g(r,"TypeOverrides"),r.prototype.getOverrides=function(i){switch(i){case"text":return this.text;case"binary":return this.binary;default:return{}}},r.prototype.setTypeParser=function(i,a,l){typeof a=="function"&&(l=a,a="text"),this.getOverrides(a)[i]=l},r.prototype.getTypeParser=function(i,a){return a=a||"text",this.getOverrides(a)[i]||this._types.getTypeParser(i,a)},t.exports=r});function Dt(e){let t=1779033703,s=3144134277,r=1013904242,i=2773480762,a=1359893119,l=2600822924,o=528734635,p=1541459225,h=0,f=0,y=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],b=g((E,_)=>E>>>_|E<<32-_,"rrot"),x=new Uint32Array(64),d=new Uint8Array(64),u=g(()=>{for(let N=0,A=0;N<16;N++,A+=4)x[N]=d[A]<<24|d[A+1]<<16|d[A+2]<<8|d[A+3];for(let N=16;N<64;N++){let A=b(x[N-15],7)^b(x[N-15],18)^x[N-15]>>>3,z=b(x[N-2],17)^b(x[N-2],19)^x[N-2]>>>10;x[N]=x[N-16]+A+x[N-7]+z|0}let E=t,_=s,O=r,D=i,S=a,I=l,L=o,k=p;for(let N=0;N<64;N++){let A=b(S,6)^b(S,11)^b(S,25),z=S&I^~S&L,$=k+A+z+y[N]+x[N]|0,P=b(E,2)^b(E,13)^b(E,22),U=E&_^E&O^_&O,V=P+U|0;k=L,L=I,I=S,S=D+$|0,D=O,O=_,_=E,E=$+V|0}t=t+E|0,s=s+_|0,r=r+O|0,i=i+D|0,a=a+S|0,l=l+I|0,o=o+L|0,p=p+k|0,f=0},"process"),v=g(E=>{typeof E=="string"&&(E=new TextEncoder().encode(E));for(let _=0;_<E.length;_++)d[f++]=E[_],f===64&&u();h+=E.length},"add"),w=g(()=>{if(d[f++]=128,f==64&&u(),f+8>64){for(;f<64;)d[f++]=0;u()}for(;f<58;)d[f++]=0;let E=h*8;d[f++]=E/1099511627776&255,d[f++]=E/4294967296&255,d[f++]=E>>>24,d[f++]=E>>>16&255,d[f++]=E>>>8&255,d[f++]=E&255,u();let _=new Uint8Array(32);return _[0]=t>>>24,_[1]=t>>>16&255,_[2]=t>>>8&255,_[3]=t&255,_[4]=s>>>24,_[5]=s>>>16&255,_[6]=s>>>8&255,_[7]=s&255,_[8]=r>>>24,_[9]=r>>>16&255,_[10]=r>>>8&255,_[11]=r&255,_[12]=i>>>24,_[13]=i>>>16&255,_[14]=i>>>8&255,_[15]=i&255,_[16]=a>>>24,_[17]=a>>>16&255,_[18]=a>>>8&255,_[19]=a&255,_[20]=l>>>24,_[21]=l>>>16&255,_[22]=l>>>8&255,_[23]=l&255,_[24]=o>>>24,_[25]=o>>>16&255,_[26]=o>>>8&255,_[27]=o&255,_[28]=p>>>24,_[29]=p>>>16&255,_[30]=p>>>8&255,_[31]=p&255,_},"digest");return e===void 0?{add:v,digest:w}:(v(e),w())}var ln=ge(()=>{q(),g(Dt,"sha256")}),Ie,Ps,dn=ge(()=>{q(),Ie=class ye{constructor(){Q(this,"_dataLength",0),Q(this,"_bufferLength",0),Q(this,"_state",new Int32Array(4)),Q(this,"_buffer",new ArrayBuffer(68)),Q(this,"_buffer8"),Q(this,"_buffer32"),this._buffer8=new Uint8Array(this._buffer,0,68),this._buffer32=new Uint32Array(this._buffer,0,17),this.start()}static hashByteArray(t,s=!1){return this.onePassHasher.start().appendByteArray(t).end(s)}static hashStr(t,s=!1){return this.onePassHasher.start().appendStr(t).end(s)}static hashAsciiStr(t,s=!1){return this.onePassHasher.start().appendAsciiStr(t).end(s)}static _hex(t){let s=ye.hexChars,r=ye.hexOut,i,a,l,o;for(o=0;o<4;o+=1)for(a=o*8,i=t[o],l=0;l<8;l+=2)r[a+1+l]=s.charAt(i&15),i>>>=4,r[a+0+l]=s.charAt(i&15),i>>>=4;return r.join("")}static _md5cycle(t,s){let r=t[0],i=t[1],a=t[2],l=t[3];r+=(i&a|~i&l)+s[0]-680876936|0,r=(r<<7|r>>>25)+i|0,l+=(r&i|~r&a)+s[1]-389564586|0,l=(l<<12|l>>>20)+r|0,a+=(l&r|~l&i)+s[2]+606105819|0,a=(a<<17|a>>>15)+l|0,i+=(a&l|~a&r)+s[3]-1044525330|0,i=(i<<22|i>>>10)+a|0,r+=(i&a|~i&l)+s[4]-176418897|0,r=(r<<7|r>>>25)+i|0,l+=(r&i|~r&a)+s[5]+1200080426|0,l=(l<<12|l>>>20)+r|0,a+=(l&r|~l&i)+s[6]-1473231341|0,a=(a<<17|a>>>15)+l|0,i+=(a&l|~a&r)+s[7]-45705983|0,i=(i<<22|i>>>10)+a|0,r+=(i&a|~i&l)+s[8]+1770035416|0,r=(r<<7|r>>>25)+i|0,l+=(r&i|~r&a)+s[9]-1958414417|0,l=(l<<12|l>>>20)+r|0,a+=(l&r|~l&i)+s[10]-42063|0,a=(a<<17|a>>>15)+l|0,i+=(a&l|~a&r)+s[11]-1990404162|0,i=(i<<22|i>>>10)+a|0,r+=(i&a|~i&l)+s[12]+1804603682|0,r=(r<<7|r>>>25)+i|0,l+=(r&i|~r&a)+s[13]-40341101|0,l=(l<<12|l>>>20)+r|0,a+=(l&r|~l&i)+s[14]-1502002290|0,a=(a<<17|a>>>15)+l|0,i+=(a&l|~a&r)+s[15]+1236535329|0,i=(i<<22|i>>>10)+a|0,r+=(i&l|a&~l)+s[1]-165796510|0,r=(r<<5|r>>>27)+i|0,l+=(r&a|i&~a)+s[6]-1069501632|0,l=(l<<9|l>>>23)+r|0,a+=(l&i|r&~i)+s[11]+643717713|0,a=(a<<14|a>>>18)+l|0,i+=(a&r|l&~r)+s[0]-373897302|0,i=(i<<20|i>>>12)+a|0,r+=(i&l|a&~l)+s[5]-701558691|0,r=(r<<5|r>>>27)+i|0,l+=(r&a|i&~a)+s[10]+38016083|0,l=(l<<9|l>>>23)+r|0,a+=(l&i|r&~i)+s[15]-660478335|0,a=(a<<14|a>>>18)+l|0,i+=(a&r|l&~r)+s[4]-405537848|0,i=(i<<20|i>>>12)+a|0,r+=(i&l|a&~l)+s[9]+568446438|0,r=(r<<5|r>>>27)+i|0,l+=(r&a|i&~a)+s[14]-1019803690|0,l=(l<<9|l>>>23)+r|0,a+=(l&i|r&~i)+s[3]-187363961|0,a=(a<<14|a>>>18)+l|0,i+=(a&r|l&~r)+s[8]+1163531501|0,i=(i<<20|i>>>12)+a|0,r+=(i&l|a&~l)+s[13]-1444681467|0,r=(r<<5|r>>>27)+i|0,l+=(r&a|i&~a)+s[2]-51403784|0,l=(l<<9|l>>>23)+r|0,a+=(l&i|r&~i)+s[7]+1735328473|0,a=(a<<14|a>>>18)+l|0,i+=(a&r|l&~r)+s[12]-1926607734|0,i=(i<<20|i>>>12)+a|0,r+=(i^a^l)+s[5]-378558|0,r=(r<<4|r>>>28)+i|0,l+=(r^i^a)+s[8]-2022574463|0,l=(l<<11|l>>>21)+r|0,a+=(l^r^i)+s[11]+1839030562|0,a=(a<<16|a>>>16)+l|0,i+=(a^l^r)+s[14]-35309556|0,i=(i<<23|i>>>9)+a|0,r+=(i^a^l)+s[1]-1530992060|0,r=(r<<4|r>>>28)+i|0,l+=(r^i^a)+s[4]+1272893353|0,l=(l<<11|l>>>21)+r|0,a+=(l^r^i)+s[7]-155497632|0,a=(a<<16|a>>>16)+l|0,i+=(a^l^r)+s[10]-1094730640|0,i=(i<<23|i>>>9)+a|0,r+=(i^a^l)+s[13]+681279174|0,r=(r<<4|r>>>28)+i|0,l+=(r^i^a)+s[0]-358537222|0,l=(l<<11|l>>>21)+r|0,a+=(l^r^i)+s[3]-722521979|0,a=(a<<16|a>>>16)+l|0,i+=(a^l^r)+s[6]+76029189|0,i=(i<<23|i>>>9)+a|0,r+=(i^a^l)+s[9]-640364487|0,r=(r<<4|r>>>28)+i|0,l+=(r^i^a)+s[12]-421815835|0,l=(l<<11|l>>>21)+r|0,a+=(l^r^i)+s[15]+530742520|0,a=(a<<16|a>>>16)+l|0,i+=(a^l^r)+s[2]-995338651|0,i=(i<<23|i>>>9)+a|0,r+=(a^(i|~l))+s[0]-198630844|0,r=(r<<6|r>>>26)+i|0,l+=(i^(r|~a))+s[7]+1126891415|0,l=(l<<10|l>>>22)+r|0,a+=(r^(l|~i))+s[14]-1416354905|0,a=(a<<15|a>>>17)+l|0,i+=(l^(a|~r))+s[5]-57434055|0,i=(i<<21|i>>>11)+a|0,r+=(a^(i|~l))+s[12]+1700485571|0,r=(r<<6|r>>>26)+i|0,l+=(i^(r|~a))+s[3]-1894986606|0,l=(l<<10|l>>>22)+r|0,a+=(r^(l|~i))+s[10]-1051523|0,a=(a<<15|a>>>17)+l|0,i+=(l^(a|~r))+s[1]-2054922799|0,i=(i<<21|i>>>11)+a|0,r+=(a^(i|~l))+s[8]+1873313359|0,r=(r<<6|r>>>26)+i|0,l+=(i^(r|~a))+s[15]-30611744|0,l=(l<<10|l>>>22)+r|0,a+=(r^(l|~i))+s[6]-1560198380|0,a=(a<<15|a>>>17)+l|0,i+=(l^(a|~r))+s[13]+1309151649|0,i=(i<<21|i>>>11)+a|0,r+=(a^(i|~l))+s[4]-145523070|0,r=(r<<6|r>>>26)+i|0,l+=(i^(r|~a))+s[11]-1120210379|0,l=(l<<10|l>>>22)+r|0,a+=(r^(l|~i))+s[2]+718787259|0,a=(a<<15|a>>>17)+l|0,i+=(l^(a|~r))+s[9]-343485551|0,i=(i<<21|i>>>11)+a|0,t[0]=r+t[0]|0,t[1]=i+t[1]|0,t[2]=a+t[2]|0,t[3]=l+t[3]|0}start(){return this._dataLength=0,this._bufferLength=0,this._state.set(ye.stateIdentity),this}appendStr(t){let s=this._buffer8,r=this._buffer32,i=this._bufferLength,a,l;for(l=0;l<t.length;l+=1){if(a=t.charCodeAt(l),a<128)s[i++]=a;else if(a<2048)s[i++]=(a>>>6)+192,s[i++]=a&63|128;else if(a<55296||a>56319)s[i++]=(a>>>12)+224,s[i++]=a>>>6&63|128,s[i++]=a&63|128;else{if(a=(a-55296)*1024+(t.charCodeAt(++l)-56320)+65536,a>1114111)throw new Error("Unicode standard supports code points up to U+10FFFF");s[i++]=(a>>>18)+240,s[i++]=a>>>12&63|128,s[i++]=a>>>6&63|128,s[i++]=a&63|128}i>=64&&(this._dataLength+=64,ye._md5cycle(this._state,r),i-=64,r[0]=r[16])}return this._bufferLength=i,this}appendAsciiStr(t){let s=this._buffer8,r=this._buffer32,i=this._bufferLength,a,l=0;for(;;){for(a=Math.min(t.length-l,64-i);a--;)s[i++]=t.charCodeAt(l++);if(i<64)break;this._dataLength+=64,ye._md5cycle(this._state,r),i=0}return this._bufferLength=i,this}appendByteArray(t){let s=this._buffer8,r=this._buffer32,i=this._bufferLength,a,l=0;for(;;){for(a=Math.min(t.length-l,64-i);a--;)s[i++]=t[l++];if(i<64)break;this._dataLength+=64,ye._md5cycle(this._state,r),i=0}return this._bufferLength=i,this}getState(){let t=this._state;return{buffer:String.fromCharCode.apply(null,Array.from(this._buffer8)),buflen:this._bufferLength,length:this._dataLength,state:[t[0],t[1],t[2],t[3]]}}setState(t){let s=t.buffer,r=t.state,i=this._state,a;for(this._dataLength=t.length,this._bufferLength=t.buflen,i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],a=0;a<s.length;a+=1)this._buffer8[a]=s.charCodeAt(a)}end(t=!1){let s=this._bufferLength,r=this._buffer8,i=this._buffer32,a=(s>>2)+1;this._dataLength+=s;let l=this._dataLength*8;if(r[s]=128,r[s+1]=r[s+2]=r[s+3]=0,i.set(ye.buffer32Identity.subarray(a),a),s>55&&(ye._md5cycle(this._state,i),i.set(ye.buffer32Identity)),l<=4294967295)i[14]=l;else{let o=l.toString(16).match(/(.*?)(.{0,8})$/);if(o===null)return;let p=parseInt(o[2],16),h=parseInt(o[1],16)||0;i[14]=p,i[15]=h}return ye._md5cycle(this._state,i),t?this._state:ye._hex(this._state)}},g(Ie,"Md5"),Q(Ie,"stateIdentity",new Int32Array([1732584193,-271733879,-1732584194,271733878])),Q(Ie,"buffer32Identity",new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])),Q(Ie,"hexChars","0123456789abcdef"),Q(Ie,"hexOut",[]),Q(Ie,"onePassHasher",new Ie),Ps=Ie}),Ws={};ke(Ws,{createHash:()=>ri,createHmac:()=>ii,randomBytes:()=>si});function si(e){return crypto.getRandomValues(G.alloc(e))}function ri(e){if(e==="sha256")return{update:g(function(t){return{digest:g(function(){return G.from(Dt(t))},"digest")}},"update")};if(e==="md5")return{update:g(function(t){return{digest:g(function(){return typeof t=="string"?Ps.hashStr(t):Ps.hashByteArray(t)},"digest")}},"update")};throw new Error(`Hash type '${e}' not supported`)}function ii(e,t){if(e!=="sha256")throw new Error(`Only sha256 is supported (requested: '${e}')`);return{update:g(function(s){return{digest:g(function(){typeof t=="string"&&(t=new TextEncoder().encode(t)),typeof s=="string"&&(s=new TextEncoder().encode(s));let r=t.length;if(r>64)t=Dt(t);else if(r<64){let p=new Uint8Array(64);p.set(t),t=p}let i=new Uint8Array(64),a=new Uint8Array(64);for(let p=0;p<64;p++)i[p]=54^t[p],a[p]=92^t[p];let l=new Uint8Array(s.length+64);l.set(i,0),l.set(s,64);let o=new Uint8Array(96);return o.set(a,0),o.set(Dt(l),64),G.from(Dt(o))},"digest")}},"update")}}var ai=ge(()=>{q(),ln(),dn(),g(si,"randomBytes"),g(ri,"createHash"),g(ii,"createHmac")}),fs=ee((e,t)=>{q(),t.exports={host:"localhost",user:Z.platform==="win32"?Z.env.USERNAME:Z.env.USER,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};var s=hs(),r=s.getTypeParser(20,"text"),i=s.getTypeParser(1016,"text");t.exports.__defineSetter__("parseInt8",function(a){s.setTypeParser(20,"text",a?s.getTypeParser(23,"text"):r),s.setTypeParser(1016,"text",a?s.getTypeParser(1007,"text"):i)})}),ms=ee((e,t)=>{q();var s=(ai(),ue(Ws)),r=fs();function i(d){var u=d.replace(/\\/g,"\\\\").replace(/"/g,'\\"');return'"'+u+'"'}g(i,"escapeElement");function a(d){for(var u="{",v=0;v<d.length;v++)v>0&&(u=u+","),d[v]===null||typeof d[v]>"u"?u=u+"NULL":Array.isArray(d[v])?u=u+a(d[v]):d[v]instanceof G?u+="\\\\x"+d[v].toString("hex"):u+=i(l(d[v]));return u=u+"}",u}g(a,"arrayString");var l=g(function(d,u){if(d==null)return null;if(d instanceof G)return d;if(ArrayBuffer.isView(d)){var v=G.from(d.buffer,d.byteOffset,d.byteLength);return v.length===d.byteLength?v:v.slice(d.byteOffset,d.byteOffset+d.byteLength)}return d instanceof Date?r.parseInputDatesAsUTC?f(d):h(d):Array.isArray(d)?a(d):typeof d=="object"?o(d,u):d.toString()},"prepareValue");function o(d,u){if(d&&typeof d.toPostgres=="function"){if(u=u||[],u.indexOf(d)!==-1)throw new Error('circular reference detected while preparing "'+d+'" for query');return u.push(d),l(d.toPostgres(l),u)}return JSON.stringify(d)}g(o,"prepareObject");function p(d,u){for(d=""+d;d.length<u;)d="0"+d;return d}g(p,"pad");function h(d){var u=-d.getTimezoneOffset(),v=d.getFullYear(),w=v<1;w&&(v=Math.abs(v)+1);var E=p(v,4)+"-"+p(d.getMonth()+1,2)+"-"+p(d.getDate(),2)+"T"+p(d.getHours(),2)+":"+p(d.getMinutes(),2)+":"+p(d.getSeconds(),2)+"."+p(d.getMilliseconds(),3);return u<0?(E+="-",u*=-1):E+="+",E+=p(Math.floor(u/60),2)+":"+p(u%60,2),w&&(E+=" BC"),E}g(h,"dateToString");function f(d){var u=d.getUTCFullYear(),v=u<1;v&&(u=Math.abs(u)+1);var w=p(u,4)+"-"+p(d.getUTCMonth()+1,2)+"-"+p(d.getUTCDate(),2)+"T"+p(d.getUTCHours(),2)+":"+p(d.getUTCMinutes(),2)+":"+p(d.getUTCSeconds(),2)+"."+p(d.getUTCMilliseconds(),3);return w+="+00:00",v&&(w+=" BC"),w}g(f,"dateToStringUTC");function y(d,u,v){return d=typeof d=="string"?{text:d}:d,u&&(typeof u=="function"?d.callback=u:d.values=u),v&&(d.callback=v),d}g(y,"normalizeQueryConfig");var b=g(function(d){return s.createHash("md5").update(d,"utf-8").digest("hex")},"md5"),x=g(function(d,u,v){var w=b(u+d),E=b(G.concat([G.from(w),v]));return"md5"+E},"postgresMd5PasswordHash");t.exports={prepareValue:g(function(d){return l(d)},"prepareValueWrapper"),normalizeQueryConfig:y,postgresMd5PasswordHash:x,md5:b}}),Vt={};ke(Vt,{default:()=>ni});var ni,gs=ge(()=>{q(),ni={}}),cn=ee((e,t)=>{q();var s=(ai(),ue(Ws));function r(u){if(u.indexOf("SCRAM-SHA-256")===-1)throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");let v=s.randomBytes(18).toString("base64");return{mechanism:"SCRAM-SHA-256",clientNonce:v,response:"n,,n=*,r="+v,message:"SASLInitialResponse"}}g(r,"startSession");function i(u,v,w){if(u.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(typeof w!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");let E=h(w);if(E.nonce.startsWith(u.clientNonce)){if(E.nonce.length===u.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");var _=G.from(E.salt,"base64"),O=d(v,_,E.iteration),D=x(O,"Client Key"),S=b(D),I="n=*,r="+u.clientNonce,L="r="+E.nonce+",s="+E.salt+",i="+E.iteration,k="c=biws,r="+E.nonce,N=I+","+L+","+k,A=x(S,N),z=y(D,A),$=z.toString("base64"),P=x(O,"Server Key"),U=x(P,N);u.message="SASLResponse",u.serverSignature=U.toString("base64"),u.response=k+",p="+$}g(i,"continueSession");function a(u,v){if(u.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");let{serverSignature:w}=f(v);if(w!==u.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}g(a,"finalizeSession");function l(u){if(typeof u!="string")throw new TypeError("SASL: text must be a string");return u.split("").map((v,w)=>u.charCodeAt(w)).every(v=>v>=33&&v<=43||v>=45&&v<=126)}g(l,"isPrintableChars");function o(u){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(u)}g(o,"isBase64");function p(u){if(typeof u!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(u.split(",").map(v=>{if(!/^.=/.test(v))throw new Error("SASL: Invalid attribute pair entry");let w=v[0],E=v.substring(2);return[w,E]}))}g(p,"parseAttributePairs");function h(u){let v=p(u),w=v.get("r");if(w){if(!l(w))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");let E=v.get("s");if(E){if(!o(E))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");let _=v.get("i");if(_){if(!/^[1-9][0-9]*$/.test(_))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");let O=parseInt(_,10);return{nonce:w,salt:E,iteration:O}}g(h,"parseServerFirstMessage");function f(u){let v=p(u).get("v");if(v){if(!o(v))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:v}}g(f,"parseServerFinalMessage");function y(u,v){if(!G.isBuffer(u))throw new TypeError("first argument must be a Buffer");if(!G.isBuffer(v))throw new TypeError("second argument must be a Buffer");if(u.length!==v.length)throw new Error("Buffer lengths must match");if(u.length===0)throw new Error("Buffers cannot be empty");return G.from(u.map((w,E)=>u[E]^v[E]))}g(y,"xorBuffers");function b(u){return s.createHash("sha256").update(u).digest()}g(b,"sha256");function x(u,v){return s.createHmac("sha256",u).update(v).digest()}g(x,"hmacSha256");function d(u,v,w){for(var E=x(u,G.concat([v,G.from([0,0,0,1])])),_=E,O=0;O<w-1;O++)E=x(u,E),_=y(_,E);return _}g(d,"Hi"),t.exports={startSession:r,continueSession:i,finalizeSession:a}}),Gs={};ke(Gs,{join:()=>oi});function oi(...e){return e.join("/")}var li=ge(()=>{q(),g(oi,"join")}),Qs={};ke(Qs,{stat:()=>di});function di(e,t){t(new Error("No filesystem"))}var ci=ge(()=>{q(),g(di,"stat")}),Ys={};ke(Ys,{default:()=>pi});var pi,ui=ge(()=>{q(),pi={}}),hi={};ke(hi,{StringDecoder:()=>fi});var As,fi,pn=ge(()=>{q(),As=class{constructor(t){Q(this,"td"),this.td=new TextDecoder(t)}write(t){return this.td.decode(t,{stream:!0})}end(t){return this.td.decode(t)}},g(As,"StringDecoder"),fi=As}),un=ee((e,t)=>{q();var{Transform:s}=(ui(),ue(Ys)),{StringDecoder:r}=(pn(),ue(hi)),i=Symbol("last"),a=Symbol("decoder");function l(y,b,x){let d;if(this.overflow){if(d=this[a].write(y).split(this.matcher),d.length===1)return x();d.shift(),this.overflow=!1}else this[i]+=this[a].write(y),d=this[i].split(this.matcher);this[i]=d.pop();for(let u=0;u<d.length;u++)try{p(this,this.mapper(d[u]))}catch(v){return x(v)}if(this.overflow=this[i].length>this.maxLength,this.overflow&&!this.skipOverflow){x(new Error("maximum buffer reached"));return}x()}g(l,"transform");function o(y){if(this[i]+=this[a].end(),this[i])try{p(this,this.mapper(this[i]))}catch(b){return y(b)}y()}g(o,"flush");function p(y,b){b!==void 0&&y.push(b)}g(p,"push");function h(y){return y}g(h,"noop");function f(y,b,x){switch(y=y||/\r?\n/,b=b||h,x=x||{},arguments.length){case 1:typeof y=="function"?(b=y,y=/\r?\n/):typeof y=="object"&&!(y instanceof RegExp)&&!y[Symbol.split]&&(x=y,y=/\r?\n/);break;case 2:typeof y=="function"?(x=b,b=y,y=/\r?\n/):typeof b=="object"&&(x=b,b=h)}x=Object.assign({},x),x.autoDestroy=!0,x.transform=l,x.flush=o,x.readableObjectMode=!0;let d=new s(x);return d[i]="",d[a]=new r("utf8"),d.matcher=y,d.mapper=b,d.maxLength=x.maxLength,d.skipOverflow=x.skipOverflow||!1,d.overflow=!1,d._destroy=function(u,v){this._writableState.errorEmitted=!1,v(u)},d}g(f,"split"),t.exports=f}),hn=ee((e,t)=>{q();var s=(li(),ue(Gs)),r=(ui(),ue(Ys)).Stream,i=un(),a=(gs(),ue(Vt)),l=5432,o=Z.platform==="win32",p=Z.stderr,h=56,f=7,y=61440,b=32768;function x(D){return(D&y)==b}g(x,"isRegFile");var d=["host","port","database","user","password"],u=d.length,v=d[u-1];function w(){var D=p instanceof r&&p.writable===!0;if(D){var S=Array.prototype.slice.call(arguments).concat(`
`);p.write(a.format.apply(a,S))}}g(w,"warn"),Object.defineProperty(t.exports,"isWin",{get:g(function(){return o},"get"),set:g(function(D){o=D},"set")}),t.exports.warnTo=function(D){var S=p;return p=D,S},t.exports.getFileName=function(D){var S=D||Z.env,I=S.PGPASSFILE||(o?s.join(S.APPDATA||"./","postgresql","pgpass.conf"):s.join(S.HOME||"./",".pgpass"));return I},t.exports.usePgPass=function(D,S){return Object.prototype.hasOwnProperty.call(Z.env,"PGPASSWORD")?!1:o?!0:(S=S||"<unkn>",x(D.mode)?D.mode&(h|f)?(w('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',S),!1):!0:(w('WARNING: password file "%s" is not a plain file',S),!1))};var E=t.exports.match=function(D,S){return d.slice(0,-1).reduce(function(I,L,k){return k==1&&Number(D[L]||l)===Number(S[L])?I&&!0:I&&(S[L]==="*"||S[L]===D[L])},!0)};t.exports.getPassword=function(D,S,I){var L,k=S.pipe(i());function N($){var P=_($);P&&O(P)&&E(D,P)&&(L=P[v],k.end())}g(N,"onLine");var A=g(function(){S.destroy(),I(L)},"onEnd"),z=g(function($){S.destroy(),w("WARNING: error on reading file: %s",$),I(void 0)},"onErr");S.on("error",z),k.on("data",N).on("end",A).on("error",z)};var _=t.exports.parseLine=function(D){if(D.length<11||D.match(/^\s+#/))return null;for(var S="",I="",L=0,k=0,N=0,A={},z=!1,$=g(function(U,V,Y){var te=D.substring(V,Y);Object.hasOwnProperty.call(Z.env,"PGPASS_NO_DEESCAPE")||(te=te.replace(/\\([:\\])/g,"$1")),A[d[U]]=te},"addToObj"),P=0;P<D.length-1;P+=1){if(S=D.charAt(P+1),I=D.charAt(P),z=L==u-1,z){$(L,k);break}P>=0&&S==":"&&I!=="\\"&&($(L,k,P+1),k=P+2,L+=1)}return A=Object.keys(A).length===u?A:null,A},O=t.exports.isValidEntry=function(D){for(var S={0:function(A){return A.length>0},1:function(A){return A==="*"?!0:(A=Number(A),isFinite(A)&&A>0&&A<9007199254740992&&Math.floor(A)===A)},2:function(A){return A.length>0},3:function(A){return A.length>0},4:function(A){return A.length>0}},I=0;I<d.length;I+=1){var L=S[I],k=D[d[I]]||"",N=L(k);if(!N)return!1}return!0}}),fn=ee((e,t)=>{q(),li(),ue(Gs);var s=(ci(),ue(Qs)),r=hn();t.exports=function(i,a){var l=r.getFileName();s.stat(l,function(o,p){if(o||!r.usePgPass(p,l))return a(void 0);var h=s.createReadStream(l);r.getPassword(i,h,a)})},t.exports.warnTo=r.warnTo}),mi={};ke(mi,{default:()=>gi});var gi,mn=ge(()=>{q(),gi={}}),gn=ee((e,t)=>{q();var s=(Jr(),ue(Kr)),r=(ci(),ue(Qs));function i(a){if(a.charAt(0)==="/"){var o=a.split(" ");return{host:o[0],database:o[1]}}var l=s.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(a)?encodeURI(a).replace(/\%25(\d\d)/g,"%$1"):a,!0),o=l.query;for(var p in o)Array.isArray(o[p])&&(o[p]=o[p][o[p].length-1]);var h=(l.auth||":").split(":");if(o.user=h[0],o.password=h.splice(1).join(":"),o.port=l.port,l.protocol=="socket:")return o.host=decodeURI(l.pathname),o.database=l.query.db,o.client_encoding=l.query.encoding,o;o.host||(o.host=l.hostname);var f=l.pathname;if(!o.host&&f&&/^%2f/i.test(f)){var y=f.split("/");o.host=decodeURIComponent(y[0]),f=y.splice(1).join("/")}switch(f&&f.charAt(0)==="/"&&(f=f.slice(1)||null),o.database=f&&decodeURI(f),(o.ssl==="true"||o.ssl==="1")&&(o.ssl=!0),o.ssl==="0"&&(o.ssl=!1),(o.sslcert||o.sslkey||o.sslrootcert||o.sslmode)&&(o.ssl={}),o.sslcert&&(o.ssl.cert=r.readFileSync(o.sslcert).toString()),o.sslkey&&(o.ssl.key=r.readFileSync(o.sslkey).toString()),o.sslrootcert&&(o.ssl.ca=r.readFileSync(o.sslrootcert).toString()),o.sslmode){case"disable":{o.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":break;case"no-verify":{o.ssl.rejectUnauthorized=!1;break}}return o}g(i,"parse"),t.exports=i,i.parse=i}),Xs=ee((e,t)=>{q();var s=(mn(),ue(mi)),r=fs(),i=gn().parse,a=g(function(y,b,x){return x===void 0?x=Z.env["PG"+y.toUpperCase()]:x===!1||(x=Z.env[x]),b[y]||x||r[y]},"val"),l=g(function(){switch(Z.env.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return r.ssl},"readSSLConfigFromEnvironment"),o=g(function(y){return"'"+(""+y).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},"quoteParamValue"),p=g(function(y,b,x){var d=b[x];d!=null&&y.push(x+"="+o(d))},"add"),h=class{constructor(b){b=typeof b=="string"?i(b):b||{},b.connectionString&&(b=Object.assign({},b,i(b.connectionString))),this.user=a("user",b),this.database=a("database",b),this.database===void 0&&(this.database=this.user),this.port=parseInt(a("port",b),10),this.host=a("host",b),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:a("password",b)}),this.binary=a("binary",b),this.options=a("options",b),this.ssl=typeof b.ssl>"u"?l():b.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=a("client_encoding",b),this.replication=a("replication",b),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=a("application_name",b,"PGAPPNAME"),this.fallback_application_name=a("fallback_application_name",b,!1),this.statement_timeout=a("statement_timeout",b,!1),this.lock_timeout=a("lock_timeout",b,!1),this.idle_in_transaction_session_timeout=a("idle_in_transaction_session_timeout",b,!1),this.query_timeout=a("query_timeout",b,!1),b.connectionTimeoutMillis===void 0?this.connect_timeout=Z.env.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(b.connectionTimeoutMillis/1e3),b.keepAlive===!1?this.keepalives=0:b.keepAlive===!0&&(this.keepalives=1),typeof b.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(b.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(b){var x=[];p(x,this,"user"),p(x,this,"password"),p(x,this,"port"),p(x,this,"application_name"),p(x,this,"fallback_application_name"),p(x,this,"connect_timeout"),p(x,this,"options");var d=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(p(x,d,"sslmode"),p(x,d,"sslca"),p(x,d,"sslkey"),p(x,d,"sslcert"),p(x,d,"sslrootcert"),this.database&&x.push("dbname="+o(this.database)),this.replication&&x.push("replication="+o(this.replication)),this.host&&x.push("host="+o(this.host)),this.isDomainSocket)return b(null,x.join(" "));this.client_encoding&&x.push("client_encoding="+o(this.client_encoding)),s.lookup(this.host,function(u,v){return u?b(u,null):(x.push("hostaddr="+o(v)),b(null,x.join(" ")))})}};g(h,"ConnectionParameters");var f=h;t.exports=f}),bn=ee((e,t)=>{q();var s=hs(),r=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/,i=class{constructor(o,p){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=p,this.RowCtor=null,this.rowAsArray=o==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray)}addCommandComplete(o){var p;o.text?p=r.exec(o.text):p=r.exec(o.command),p&&(this.command=p[1],p[3]?(this.oid=parseInt(p[2],10),this.rowCount=parseInt(p[3],10)):p[2]&&(this.rowCount=parseInt(p[2],10)))}_parseRowAsArray(o){for(var p=new Array(o.length),h=0,f=o.length;h<f;h++){var y=o[h];y!==null?p[h]=this._parsers[h](y):p[h]=null}return p}parseRow(o){for(var p={},h=0,f=o.length;h<f;h++){var y=o[h],b=this.fields[h].name;y!==null?p[b]=this._parsers[h](y):p[b]=null}return p}addRow(o){this.rows.push(o)}addFields(o){this.fields=o,this.fields.length&&(this._parsers=new Array(o.length));for(var p=0;p<o.length;p++){var h=o[p];this._types?this._parsers[p]=this._types.getTypeParser(h.dataTypeID,h.format||"text"):this._parsers[p]=s.getTypeParser(h.dataTypeID,h.format||"text")}}};g(i,"Result");var a=i;t.exports=a}),vn=ee((e,t)=>{q();var{EventEmitter:s}=tt(),r=bn(),i=ms(),a=class extends s{constructor(p,h,f){super(),p=i.normalizeQueryConfig(p,h,f),this.text=p.text,this.values=p.values,this.rows=p.rows,this.types=p.types,this.name=p.name,this.binary=p.binary,this.portal=p.portal||"",this.callback=p.callback,this._rowMode=p.rowMode,Z.domain&&p.callback&&(this.callback=Z.domain.bind(p.callback)),this._result=new r(this._rowMode,this.types),this._results=this._result,this.isPreparedStatement=!1,this._canceledDueToError=!1,this._promise=null}requiresPreparation(){return this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new r(this._rowMode,this.types),this._results.push(this._result))}handleRowDescription(p){this._checkForMultirow(),this._result.addFields(p.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(p){let h;if(!this._canceledDueToError){try{h=this._result.parseRow(p.fields)}catch(f){this._canceledDueToError=f;return}this.emit("row",h,this._result),this._accumulateRows&&this._result.addRow(h)}}handleCommandComplete(p,h){this._checkForMultirow(),this._result.addCommandComplete(p),this.rows&&h.sync()}handleEmptyQuery(p){this.rows&&p.sync()}handleError(p,h){if(this._canceledDueToError&&(p=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(p);this.emit("error",p)}handleReadyForQuery(p){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,p);if(this.callback)try{this.callback(null,this._results)}catch(h){Z.nextTick(()=>{throw h})}this.emit("end",this._results)}submit(p){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");let h=p.parsedStatements[this.name];return this.text&&h&&this.text!==h?new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`):this.values&&!Array.isArray(this.values)?new Error("Query values must be an array"):(this.requiresPreparation()?this.prepare(p):p.query(this.text),null)}hasBeenParsed(p){return this.name&&p.parsedStatements[this.name]}handlePortalSuspended(p){this._getRows(p,this.rows)}_getRows(p,h){p.execute({portal:this.portal,rows:h}),h?p.flush():p.sync()}prepare(p){this.isPreparedStatement=!0,this.hasBeenParsed(p)||p.parse({text:this.text,name:this.name,types:this.types});try{p.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:i.prepareValue})}catch(h){this.handleError(h,p);return}p.describe({type:"P",name:this.portal||""}),this._getRows(p,this.rows)}handleCopyInResponse(p){p.sendCopyFail("No source stream defined")}handleCopyData(p,h){}};g(a,"Query");var l=a;t.exports=l}),bi=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.NoticeMessage=e.DataRowMessage=e.CommandCompleteMessage=e.ReadyForQueryMessage=e.NotificationResponseMessage=e.BackendKeyDataMessage=e.AuthenticationMD5Password=e.ParameterStatusMessage=e.ParameterDescriptionMessage=e.RowDescriptionMessage=e.Field=e.CopyResponse=e.CopyDataMessage=e.DatabaseError=e.copyDone=e.emptyQuery=e.replicationStart=e.portalSuspended=e.noData=e.closeComplete=e.bindComplete=e.parseComplete=void 0,e.parseComplete={name:"parseComplete",length:5},e.bindComplete={name:"bindComplete",length:5},e.closeComplete={name:"closeComplete",length:5},e.noData={name:"noData",length:5},e.portalSuspended={name:"portalSuspended",length:5},e.replicationStart={name:"replicationStart",length:4},e.emptyQuery={name:"emptyQuery",length:4},e.copyDone={name:"copyDone",length:4};var t=class extends Error{constructor(P,U,V){super(P),this.length=U,this.name=V}};g(t,"DatabaseError");var s=t;e.DatabaseError=s;var r=class{constructor(P,U){this.length=P,this.chunk=U,this.name="copyData"}};g(r,"CopyDataMessage");var i=r;e.CopyDataMessage=i;var a=class{constructor(P,U,V,Y){this.length=P,this.name=U,this.binary=V,this.columnTypes=new Array(Y)}};g(a,"CopyResponse");var l=a;e.CopyResponse=l;var o=class{constructor(P,U,V,Y,te,K,be){this.name=P,this.tableID=U,this.columnID=V,this.dataTypeID=Y,this.dataTypeSize=te,this.dataTypeModifier=K,this.format=be}};g(o,"Field");var p=o;e.Field=p;var h=class{constructor(P,U){this.length=P,this.fieldCount=U,this.name="rowDescription",this.fields=new Array(this.fieldCount)}};g(h,"RowDescriptionMessage");var f=h;e.RowDescriptionMessage=f;var y=class{constructor(P,U){this.length=P,this.parameterCount=U,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}};g(y,"ParameterDescriptionMessage");var b=y;e.ParameterDescriptionMessage=b;var x=class{constructor(P,U,V){this.length=P,this.parameterName=U,this.parameterValue=V,this.name="parameterStatus"}};g(x,"ParameterStatusMessage");var d=x;e.ParameterStatusMessage=d;var u=class{constructor(P,U){this.length=P,this.salt=U,this.name="authenticationMD5Password"}};g(u,"AuthenticationMD5Password");var v=u;e.AuthenticationMD5Password=v;var w=class{constructor(P,U,V){this.length=P,this.processID=U,this.secretKey=V,this.name="backendKeyData"}};g(w,"BackendKeyDataMessage");var E=w;e.BackendKeyDataMessage=E;var _=class{constructor(P,U,V,Y){this.length=P,this.processId=U,this.channel=V,this.payload=Y,this.name="notification"}};g(_,"NotificationResponseMessage");var O=_;e.NotificationResponseMessage=O;var D=class{constructor(P,U){this.length=P,this.status=U,this.name="readyForQuery"}};g(D,"ReadyForQueryMessage");var S=D;e.ReadyForQueryMessage=S;var I=class{constructor(P,U){this.length=P,this.text=U,this.name="commandComplete"}};g(I,"CommandCompleteMessage");var L=I;e.CommandCompleteMessage=L;var k=class{constructor(P,U){this.length=P,this.fields=U,this.name="dataRow",this.fieldCount=U.length}};g(k,"DataRowMessage");var N=k;e.DataRowMessage=N;var A=class{constructor(P,U){this.length=P,this.message=U,this.name="notice"}};g(A,"NoticeMessage");var z=A;e.NoticeMessage=z}),yn=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.Writer=void 0;var t=class{constructor(i=256){this.size=i,this.offset=5,this.headerPosition=0,this.buffer=G.allocUnsafe(i)}ensure(i){if(this.buffer.length-this.offset<i){let a=this.buffer,l=a.length+(a.length>>1)+i;this.buffer=G.allocUnsafe(l),a.copy(this.buffer)}}addInt32(i){return this.ensure(4),this.buffer[this.offset++]=i>>>24&255,this.buffer[this.offset++]=i>>>16&255,this.buffer[this.offset++]=i>>>8&255,this.buffer[this.offset++]=i>>>0&255,this}addInt16(i){return this.ensure(2),this.buffer[this.offset++]=i>>>8&255,this.buffer[this.offset++]=i>>>0&255,this}addCString(i){if(!i)this.ensure(1);else{let a=G.byteLength(i);this.ensure(a+1),this.buffer.write(i,this.offset,"utf-8"),this.offset+=a}return this.buffer[this.offset++]=0,this}addString(i=""){let a=G.byteLength(i);return this.ensure(a),this.buffer.write(i,this.offset),this.offset+=a,this}add(i){return this.ensure(i.length),i.copy(this.buffer,this.offset),this.offset+=i.length,this}join(i){if(i){this.buffer[this.headerPosition]=i;let a=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(a,this.headerPosition+1)}return this.buffer.slice(i?0:5,this.offset)}flush(i){let a=this.join(i);return this.offset=5,this.headerPosition=0,this.buffer=G.allocUnsafe(this.size),a}};g(t,"Writer");var s=t;e.Writer=s}),xn=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.serialize=void 0;var t=yn(),s=new t.Writer,r=g(P=>{s.addInt16(3).addInt16(0);for(let Y of Object.keys(P))s.addCString(Y).addCString(P[Y]);s.addCString("client_encoding").addCString("UTF8");let U=s.addCString("").flush(),V=U.length+4;return new t.Writer().addInt32(V).add(U).flush()},"startup"),i=g(()=>{let P=G.allocUnsafe(8);return P.writeInt32BE(8,0),P.writeInt32BE(80877103,4),P},"requestSsl"),a=g(P=>s.addCString(P).flush(112),"password"),l=g(function(P,U){return s.addCString(P).addInt32(G.byteLength(U)).addString(U),s.flush(112)},"sendSASLInitialResponseMessage"),o=g(function(P){return s.addString(P).flush(112)},"sendSCRAMClientFinalMessage"),p=g(P=>s.addCString(P).flush(81),"query"),h=[],f=g(P=>{let U=P.name||"";U.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",U,U.length),console.error("This can cause conflicts and silent errors executing queries"));let V=P.types||h,Y=V.length,te=s.addCString(U).addCString(P.text).addInt16(Y);for(let K=0;K<Y;K++)te.addInt32(V[K]);return s.flush(80)},"parse"),y=new t.Writer,b=g(function(P,U){for(let V=0;V<P.length;V++){let Y=U?U(P[V],V):P[V];Y==null?(s.addInt16(0),y.addInt32(-1)):Y instanceof G?(s.addInt16(1),y.addInt32(Y.length),y.add(Y)):(s.addInt16(0),y.addInt32(G.byteLength(Y)),y.addString(Y))}},"writeValues"),x=g((P={})=>{let U=P.portal||"",V=P.statement||"",Y=P.binary||!1,te=P.values||h,K=te.length;return s.addCString(U).addCString(V),s.addInt16(K),b(te,P.valueMapper),s.addInt16(K),s.add(y.flush()),s.addInt16(Y?1:0),s.flush(66)},"bind"),d=G.from([69,0,0,0,9,0,0,0,0,0]),u=g(P=>{if(!P||!P.portal&&!P.rows)return d;let U=P.portal||"",V=P.rows||0,Y=G.byteLength(U),te=4+Y+1+4,K=G.allocUnsafe(1+te);return K[0]=69,K.writeInt32BE(te,1),K.write(U,5,"utf-8"),K[Y+5]=0,K.writeUInt32BE(V,K.length-4),K},"execute"),v=g((P,U)=>{let V=G.allocUnsafe(16);return V.writeInt32BE(16,0),V.writeInt16BE(1234,4),V.writeInt16BE(5678,6),V.writeInt32BE(P,8),V.writeInt32BE(U,12),V},"cancel"),w=g((P,U)=>{let V=4+G.byteLength(U)+1,Y=G.allocUnsafe(1+V);return Y[0]=P,Y.writeInt32BE(V,1),Y.write(U,5,"utf-8"),Y[V]=0,Y},"cstringMessage"),E=s.addCString("P").flush(68),_=s.addCString("S").flush(68),O=g(P=>P.name?w(68,`${P.type}${P.name||""}`):P.type==="P"?E:_,"describe"),D=g(P=>{let U=`${P.type}${P.name||""}`;return w(67,U)},"close"),S=g(P=>s.add(P).flush(100),"copyData"),I=g(P=>w(102,P),"copyFail"),L=g(P=>G.from([P,0,0,0,4]),"codeOnlyBuffer"),k=L(72),N=L(83),A=L(88),z=L(99),$={startup:r,password:a,requestSsl:i,sendSASLInitialResponseMessage:l,sendSCRAMClientFinalMessage:o,query:p,parse:f,bind:x,execute:u,describe:O,close:D,flush:g(()=>k,"flush"),sync:g(()=>N,"sync"),end:g(()=>A,"end"),copyData:S,copyDone:g(()=>z,"copyDone"),copyFail:I,cancel:v};e.serialize=$}),wn=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.BufferReader=void 0;var t=G.allocUnsafe(0),s=class{constructor(a=0){this.offset=a,this.buffer=t,this.encoding="utf-8"}setBuffer(a,l){this.offset=a,this.buffer=l}int16(){let a=this.buffer.readInt16BE(this.offset);return this.offset+=2,a}byte(){let a=this.buffer[this.offset];return this.offset++,a}int32(){let a=this.buffer.readInt32BE(this.offset);return this.offset+=4,a}uint32(){let a=this.buffer.readUInt32BE(this.offset);return this.offset+=4,a}string(a){let l=this.buffer.toString(this.encoding,this.offset,this.offset+a);return this.offset+=a,l}cstring(){let a=this.offset,l=a;for(;this.buffer[l++]!==0;);return this.offset=l,this.buffer.toString(this.encoding,a,l-1)}bytes(a){let l=this.buffer.slice(this.offset,this.offset+a);return this.offset+=a,l}};g(s,"BufferReader");var r=s;e.BufferReader=r}),En=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.Parser=void 0;var t=bi(),s=wn(),r=1,i=4,a=r+i,l=G.allocUnsafe(0),o=class{constructor(f){if(this.buffer=l,this.bufferLength=0,this.bufferOffset=0,this.reader=new s.BufferReader,(f==null?void 0:f.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(f==null?void 0:f.mode)||"text"}parse(f,y){this.mergeBuffer(f);let b=this.bufferOffset+this.bufferLength,x=this.bufferOffset;for(;x+a<=b;){let d=this.buffer[x],u=this.buffer.readUInt32BE(x+r),v=r+u;if(v+x<=b){let w=this.handlePacket(x+a,d,u,this.buffer);y(w),x+=v}else break}x===b?(this.buffer=l,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=b-x,this.bufferOffset=x)}mergeBuffer(f){if(this.bufferLength>0){let y=this.bufferLength+f.byteLength;if(y+this.bufferOffset>this.buffer.byteLength){let b;if(y<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)b=this.buffer;else{let x=this.buffer.byteLength*2;for(;y>=x;)x*=2;b=G.allocUnsafe(x)}this.buffer.copy(b,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=b,this.bufferOffset=0}f.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=y}else this.buffer=f,this.bufferOffset=0,this.bufferLength=f.byteLength}handlePacket(f,y,b,x){switch(y){case 50:return t.bindComplete;case 49:return t.parseComplete;case 51:return t.closeComplete;case 110:return t.noData;case 115:return t.portalSuspended;case 99:return t.copyDone;case 87:return t.replicationStart;case 73:return t.emptyQuery;case 68:return this.parseDataRowMessage(f,b,x);case 67:return this.parseCommandCompleteMessage(f,b,x);case 90:return this.parseReadyForQueryMessage(f,b,x);case 65:return this.parseNotificationMessage(f,b,x);case 82:return this.parseAuthenticationResponse(f,b,x);case 83:return this.parseParameterStatusMessage(f,b,x);case 75:return this.parseBackendKeyData(f,b,x);case 69:return this.parseErrorMessage(f,b,x,"error");case 78:return this.parseErrorMessage(f,b,x,"notice");case 84:return this.parseRowDescriptionMessage(f,b,x);case 116:return this.parseParameterDescriptionMessage(f,b,x);case 71:return this.parseCopyInMessage(f,b,x);case 72:return this.parseCopyOutMessage(f,b,x);case 100:return this.parseCopyData(f,b,x);default:return new t.DatabaseError("received invalid response: "+y.toString(16),b,"error")}}parseReadyForQueryMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.string(1);return new t.ReadyForQueryMessage(y,x)}parseCommandCompleteMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.cstring();return new t.CommandCompleteMessage(y,x)}parseCopyData(f,y,b){let x=b.slice(f,f+(y-4));return new t.CopyDataMessage(y,x)}parseCopyInMessage(f,y,b){return this.parseCopyMessage(f,y,b,"copyInResponse")}parseCopyOutMessage(f,y,b){return this.parseCopyMessage(f,y,b,"copyOutResponse")}parseCopyMessage(f,y,b,x){this.reader.setBuffer(f,b);let d=this.reader.byte()!==0,u=this.reader.int16(),v=new t.CopyResponse(y,x,d,u);for(let w=0;w<u;w++)v.columnTypes[w]=this.reader.int16();return v}parseNotificationMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int32(),d=this.reader.cstring(),u=this.reader.cstring();return new t.NotificationResponseMessage(y,x,d,u)}parseRowDescriptionMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int16(),d=new t.RowDescriptionMessage(y,x);for(let u=0;u<x;u++)d.fields[u]=this.parseField();return d}parseField(){let f=this.reader.cstring(),y=this.reader.uint32(),b=this.reader.int16(),x=this.reader.uint32(),d=this.reader.int16(),u=this.reader.int32(),v=this.reader.int16()===0?"text":"binary";return new t.Field(f,y,b,x,d,u,v)}parseParameterDescriptionMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int16(),d=new t.ParameterDescriptionMessage(y,x);for(let u=0;u<x;u++)d.dataTypeIDs[u]=this.reader.int32();return d}parseDataRowMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int16(),d=new Array(x);for(let u=0;u<x;u++){let v=this.reader.int32();d[u]=v===-1?null:this.reader.string(v)}return new t.DataRowMessage(y,d)}parseParameterStatusMessage(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.cstring(),d=this.reader.cstring();return new t.ParameterStatusMessage(y,x,d)}parseBackendKeyData(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int32(),d=this.reader.int32();return new t.BackendKeyDataMessage(y,x,d)}parseAuthenticationResponse(f,y,b){this.reader.setBuffer(f,b);let x=this.reader.int32(),d={name:"authenticationOk",length:y};switch(x){case 0:break;case 3:d.length===8&&(d.name="authenticationCleartextPassword");break;case 5:if(d.length===12){d.name="authenticationMD5Password";let u=this.reader.bytes(4);return new t.AuthenticationMD5Password(y,u)}break;case 10:{d.name="authenticationSASL",d.mechanisms=[];let u;do u=this.reader.cstring(),u&&d.mechanisms.push(u);while(u)}break;case 11:d.name="authenticationSASLContinue",d.data=this.reader.string(y-8);break;case 12:d.name="authenticationSASLFinal",d.data=this.reader.string(y-8);break;default:throw new Error("Unknown authenticationOk message type "+x)}return d}parseErrorMessage(f,y,b,x){this.reader.setBuffer(f,b);let d={},u=this.reader.string(1);for(;u!=="\0";)d[u]=this.reader.cstring(),u=this.reader.string(1);let v=d.M,w=x==="notice"?new t.NoticeMessage(y,v):new t.DatabaseError(v,y,x);return w.severity=d.S,w.code=d.C,w.detail=d.D,w.hint=d.H,w.position=d.P,w.internalPosition=d.p,w.internalQuery=d.q,w.where=d.W,w.schema=d.s,w.table=d.t,w.column=d.c,w.dataType=d.d,w.constraint=d.n,w.file=d.F,w.line=d.L,w.routine=d.R,w}};g(o,"Parser");var p=o;e.Parser=p}),vi=ee(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.DatabaseError=e.serialize=e.parse=void 0;var t=bi();Object.defineProperty(e,"DatabaseError",{enumerable:!0,get:g(function(){return t.DatabaseError},"get")});var s=xn();Object.defineProperty(e,"serialize",{enumerable:!0,get:g(function(){return s.serialize},"get")});var r=En();function i(a,l){let o=new r.Parser;return a.on("data",p=>o.parse(p,l)),new Promise(p=>a.on("end",()=>p()))}g(i,"parse"),e.parse=i}),yi={};ke(yi,{connect:()=>xi});function xi({socket:e,servername:t}){return e.startTls(t),e}var _n=ge(()=>{q(),g(xi,"connect")}),wi=ee((e,t)=>{q();var s=(Ht(),ue(Yr)),r=tt().EventEmitter,{parse:i,serialize:a}=vi(),l=a.flush(),o=a.sync(),p=a.end(),h=class extends r{constructor(b){super(),b=b||{},this.stream=b.stream||new s.Socket,this._keepAlive=b.keepAlive,this._keepAliveInitialDelayMillis=b.keepAliveInitialDelayMillis,this.lastBuffer=!1,this.parsedStatements={},this.ssl=b.ssl||!1,this._ending=!1,this._emitMessage=!1;var x=this;this.on("newListener",function(d){d==="message"&&(x._emitMessage=!0)})}connect(b,x){var d=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(b,x),this.stream.once("connect",function(){d._keepAlive&&d.stream.setKeepAlive(!0,d._keepAliveInitialDelayMillis),d.emit("connect")});let u=g(function(v){d._ending&&(v.code==="ECONNRESET"||v.code==="EPIPE")||d.emit("error",v)},"reportStreamError");if(this.stream.on("error",u),this.stream.on("close",function(){d.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(v){var w=v.toString("utf8");switch(w){case"S":break;case"N":return d.stream.end(),d.emit("error",new Error("The server does not support SSL connections"));default:return d.stream.end(),d.emit("error",new Error("There was an error establishing an SSL connection"))}var E=(_n(),ue(yi));let _={socket:d.stream};d.ssl!==!0&&(Object.assign(_,d.ssl),"key"in d.ssl&&(_.key=d.ssl.key)),s.isIP(x)===0&&(_.servername=x);try{d.stream=E.connect(_)}catch(O){return d.emit("error",O)}d.attachListeners(d.stream),d.stream.on("error",u),d.emit("sslconnect")})}attachListeners(b){b.on("end",()=>{this.emit("end")}),i(b,x=>{var d=x.name==="error"?"errorMessage":x.name;this._emitMessage&&this.emit("message",x),this.emit(d,x)})}requestSsl(){this.stream.write(a.requestSsl())}startup(b){this.stream.write(a.startup(b))}cancel(b,x){this._send(a.cancel(b,x))}password(b){this._send(a.password(b))}sendSASLInitialResponseMessage(b,x){this._send(a.sendSASLInitialResponseMessage(b,x))}sendSCRAMClientFinalMessage(b){this._send(a.sendSCRAMClientFinalMessage(b))}_send(b){return this.stream.writable?this.stream.write(b):!1}query(b){this._send(a.query(b))}parse(b){this._send(a.parse(b))}bind(b){this._send(a.bind(b))}execute(b){this._send(a.execute(b))}flush(){this.stream.writable&&this.stream.write(l)}sync(){this._ending=!0,this._send(l),this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(p,()=>{this.stream.end()})}close(b){this._send(a.close(b))}describe(b){this._send(a.describe(b))}sendCopyFromChunk(b){this._send(a.copyData(b))}endCopyFrom(){this._send(a.copyDone())}sendCopyFail(b){this._send(a.copyFail(b))}};g(h,"Connection");var f=h;t.exports=f}),Sn=ee((e,t)=>{q();var s=tt().EventEmitter;gs(),ue(Vt);var r=ms(),i=cn(),a=fn(),l=Vs(),o=Xs(),p=vn(),h=fs(),f=wi(),y=class extends s{constructor(d){super(),this.connectionParameters=new o(d),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;var u=d||{};this._Promise=u.Promise||us.Promise,this._types=new l(u.types),this._ending=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this.connection=u.connection||new f({stream:u.stream,ssl:this.connectionParameters.ssl,keepAlive:u.keepAlive||!1,keepAliveInitialDelayMillis:u.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this.queryQueue=[],this.binary=u.binary||h.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=u.connectionTimeoutMillis||0}_errorAllQueries(d){let u=g(v=>{Z.nextTick(()=>{v.handleError(d,this.connection)})},"enqueueError");this.activeQuery&&(u(this.activeQuery),this.activeQuery=null),this.queryQueue.forEach(u),this.queryQueue.length=0}_connect(d){var u=this,v=this.connection;if(this._connectionCallback=d,this._connecting||this._connected){let w=new Error("Client has already been connected. You cannot reuse a client.");Z.nextTick(()=>{d(w)});return}this._connecting=!0,this.connectionTimeoutHandle,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{v._ending=!0,v.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis)),this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){u.ssl?v.requestSsl():v.startup(u.getStartupConf())}),v.on("sslconnect",function(){v.startup(u.getStartupConf())}),this._attachListeners(v),v.once("end",()=>{let w=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(w),this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(w):this._handleErrorEvent(w):this._connectionError||this._handleErrorEvent(w)),Z.nextTick(()=>{this.emit("end")})})}connect(d){if(d){this._connect(d);return}return new this._Promise((u,v)=>{this._connect(w=>{w?v(w):u()})})}_attachListeners(d){d.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),d.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),d.on("authenticationSASL",this._handleAuthSASL.bind(this)),d.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),d.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),d.on("backendKeyData",this._handleBackendKeyData.bind(this)),d.on("error",this._handleErrorEvent.bind(this)),d.on("errorMessage",this._handleErrorMessage.bind(this)),d.on("readyForQuery",this._handleReadyForQuery.bind(this)),d.on("notice",this._handleNotice.bind(this)),d.on("rowDescription",this._handleRowDescription.bind(this)),d.on("dataRow",this._handleDataRow.bind(this)),d.on("portalSuspended",this._handlePortalSuspended.bind(this)),d.on("emptyQuery",this._handleEmptyQuery.bind(this)),d.on("commandComplete",this._handleCommandComplete.bind(this)),d.on("parseComplete",this._handleParseComplete.bind(this)),d.on("copyInResponse",this._handleCopyInResponse.bind(this)),d.on("copyData",this._handleCopyData.bind(this)),d.on("notification",this._handleNotification.bind(this))}_checkPgPass(d){let u=this.connection;typeof this.password=="function"?this._Promise.resolve().then(()=>this.password()).then(v=>{if(v!==void 0){if(typeof v!="string"){u.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=v}else this.connectionParameters.password=this.password=null;d()}).catch(v=>{u.emit("error",v)}):this.password!==null?d():a(this.connectionParameters,v=>{v!==void 0&&(this.connectionParameters.password=this.password=v),d()})}_handleAuthCleartextPassword(d){this._checkPgPass(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(d){this._checkPgPass(()=>{let u=r.postgresMd5PasswordHash(this.user,this.password,d.salt);this.connection.password(u)})}_handleAuthSASL(d){this._checkPgPass(()=>{this.saslSession=i.startSession(d.mechanisms),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)})}_handleAuthSASLContinue(d){i.continueSession(this.saslSession,this.password,d.data),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}_handleAuthSASLFinal(d){i.finalizeSession(this.saslSession,d.data),this.saslSession=null}_handleBackendKeyData(d){this.processID=d.processID,this.secretKey=d.secretKey}_handleReadyForQuery(d){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));let{activeQuery:u}=this;this.activeQuery=null,this.readyForQuery=!0,u&&u.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(d){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(d);this.emit("error",d)}}_handleErrorEvent(d){if(this._connecting)return this._handleErrorWhileConnecting(d);this._queryable=!1,this._errorAllQueries(d),this.emit("error",d)}_handleErrorMessage(d){if(this._connecting)return this._handleErrorWhileConnecting(d);let u=this.activeQuery;if(!u){this._handleErrorEvent(d);return}this.activeQuery=null,u.handleError(d,this.connection)}_handleRowDescription(d){this.activeQuery.handleRowDescription(d)}_handleDataRow(d){this.activeQuery.handleDataRow(d)}_handlePortalSuspended(d){this.activeQuery.handlePortalSuspended(this.connection)}_handleEmptyQuery(d){this.activeQuery.handleEmptyQuery(this.connection)}_handleCommandComplete(d){this.activeQuery.handleCommandComplete(d,this.connection)}_handleParseComplete(d){this.activeQuery.name&&(this.connection.parsedStatements[this.activeQuery.name]=this.activeQuery.text)}_handleCopyInResponse(d){this.activeQuery.handleCopyInResponse(this.connection)}_handleCopyData(d){this.activeQuery.handleCopyData(d,this.connection)}_handleNotification(d){this.emit("notification",d)}_handleNotice(d){this.emit("notice",d)}getStartupConf(){var d=this.connectionParameters,u={user:d.user,database:d.database},v=d.application_name||d.fallback_application_name;return v&&(u.application_name=v),d.replication&&(u.replication=""+d.replication),d.statement_timeout&&(u.statement_timeout=String(parseInt(d.statement_timeout,10))),d.lock_timeout&&(u.lock_timeout=String(parseInt(d.lock_timeout,10))),d.idle_in_transaction_session_timeout&&(u.idle_in_transaction_session_timeout=String(parseInt(d.idle_in_transaction_session_timeout,10))),d.options&&(u.options=d.options),u}cancel(d,u){if(d.activeQuery===u){var v=this.connection;this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){v.cancel(d.processID,d.secretKey)})}else d.queryQueue.indexOf(u)!==-1&&d.queryQueue.splice(d.queryQueue.indexOf(u),1)}setTypeParser(d,u,v){return this._types.setTypeParser(d,u,v)}getTypeParser(d,u){return this._types.getTypeParser(d,u)}escapeIdentifier(d){return'"'+d.replace(/"/g,'""')+'"'}escapeLiteral(d){for(var u=!1,v="'",w=0;w<d.length;w++){var E=d[w];E==="'"?v+=E+E:E==="\\"?(v+=E+E,u=!0):v+=E}return v+="'",u===!0&&(v=" E"+v),v}_pulseQueryQueue(){if(this.readyForQuery===!0)if(this.activeQuery=this.queryQueue.shift(),this.activeQuery){this.readyForQuery=!1,this.hasExecuted=!0;let d=this.activeQuery.submit(this.connection);d&&Z.nextTick(()=>{this.activeQuery.handleError(d,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this.activeQuery=null,this.emit("drain"))}query(d,u,v){var w,E,_,O,D;if(d==null)throw new TypeError("Client was passed a null or undefined query");return typeof d.submit=="function"?(_=d.query_timeout||this.connectionParameters.query_timeout,E=w=d,typeof u=="function"&&(w.callback=w.callback||u)):(_=this.connectionParameters.query_timeout,w=new p(d,u,v),w.callback||(E=new this._Promise((S,I)=>{w.callback=(L,k)=>L?I(L):S(k)}))),_&&(D=w.callback,O=setTimeout(()=>{var S=new Error("Query read timeout");Z.nextTick(()=>{w.handleError(S,this.connection)}),D(S),w.callback=()=>{};var I=this.queryQueue.indexOf(w);I>-1&&this.queryQueue.splice(I,1),this._pulseQueryQueue()},_),w.callback=(S,I)=>{clearTimeout(O),D(S,I)}),this.binary&&!w.binary&&(w.binary=!0),w._result&&!w._result._types&&(w._result._types=this._types),this._queryable?this._ending?(Z.nextTick(()=>{w.handleError(new Error("Client was closed and is not queryable"),this.connection)}),E):(this.queryQueue.push(w),this._pulseQueryQueue(),E):(Z.nextTick(()=>{w.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),E)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(d){if(this._ending=!0,!this.connection._connecting)if(d)d();else return this._Promise.resolve();if(this.activeQuery||!this._queryable?this.connection.stream.destroy():this.connection.end(),d)this.connection.once("end",d);else return new this._Promise(u=>{this.connection.once("end",u)})}};g(y,"Client");var b=y;b.Query=p,t.exports=b}),kn=ee((e,t)=>{q();var s=tt().EventEmitter,r=g(function(){},"NOOP"),i=g((d,u)=>{let v=d.findIndex(u);return v===-1?void 0:d.splice(v,1)[0]},"removeWhere"),a=class{constructor(u,v,w){this.client=u,this.idleListener=v,this.timeoutId=w}};g(a,"IdleItem");var l=a,o=class{constructor(u){this.callback=u}};g(o,"PendingItem");var p=o;function h(){throw new Error("Release called on client which has already been released to the pool.")}g(h,"throwOnDoubleRelease");function f(d,u){if(u)return{callback:u,result:void 0};let v,w,E=g(function(O,D){O?v(O):w(D)},"cb"),_=new d(function(O,D){w=O,v=D}).catch(O=>{throw Error.captureStackTrace(O),O});return{callback:E,result:_}}g(f,"promisify");function y(d,u){return g(function v(w){w.client=u,u.removeListener("error",v),u.on("error",()=>{d.log("additional client error after disconnection due to error",w)}),d._remove(u),d.emit("error",w,u)},"idleListener")}g(y,"makeIdleListener");var b=class extends s{constructor(u,v){super(),this.options=Object.assign({},u),u!=null&&"password"in u&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:u.password}),u!=null&&u.ssl&&u.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||v||bs().Client,this.Promise=this.options.Promise||us.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(v=>{this._remove(v.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;let u=this._pendingQueue.shift();if(this._idle.length){let v=this._idle.pop();clearTimeout(v.timeoutId);let w=v.client;w.ref&&w.ref();let E=v.idleListener;return this._acquireClient(w,u,E,!1)}if(!this._isFull())return this.newClient(u);throw new Error("unexpected condition")}_remove(u){let v=i(this._idle,w=>w.client===u);v!==void 0&&clearTimeout(v.timeoutId),this._clients=this._clients.filter(w=>w!==u),u.end(),this.emit("remove",u)}connect(u){if(this.ending){let E=new Error("Cannot use a pool after calling end on the pool");return u?u(E):this.Promise.reject(E)}let v=f(this.Promise,u),w=v.result;if(this._isFull()||this._idle.length){if(this._idle.length&&Z.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new p(v.callback)),w;let E=g((D,S,I)=>{clearTimeout(O),v.callback(D,S,I)},"queueCallback"),_=new p(E),O=setTimeout(()=>{i(this._pendingQueue,D=>D.callback===E),_.timedOut=!0,v.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return O.unref&&O.unref(),this._pendingQueue.push(_),w}return this.newClient(new p(v.callback)),w}newClient(u){let v=new this.Client(this.options);this._clients.push(v);let w=y(this,v);this.log("checking client timeout");let E,_=!1;this.options.connectionTimeoutMillis&&(E=setTimeout(()=>{this.log("ending client due to timeout"),_=!0,v.connection?v.connection.stream.destroy():v.end()},this.options.connectionTimeoutMillis)),this.log("connecting new client"),v.connect(O=>{if(E&&clearTimeout(E),v.on("error",w),O)this.log("client failed to connect",O),this._clients=this._clients.filter(D=>D!==v),_&&(O=new Error("Connection terminated due to connection timeout",{cause:O})),this._pulseQueue(),u.timedOut||u.callback(O,void 0,r);else{if(this.log("new client connected"),this.options.maxLifetimeSeconds!==0){let D=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(v),this._idle.findIndex(S=>S.client===v)!==-1&&this._acquireClient(v,new p((S,I,L)=>L()),w,!1)},this.options.maxLifetimeSeconds*1e3);D.unref(),v.once("end",()=>clearTimeout(D))}return this._acquireClient(v,u,w,!0)}})}_acquireClient(u,v,w,E){E&&this.emit("connect",u),this.emit("acquire",u),u.release=this._releaseOnce(u,w),u.removeListener("error",w),v.timedOut?E&&this.options.verify?this.options.verify(u,u.release):u.release():E&&this.options.verify?this.options.verify(u,_=>{if(_)return u.release(_),v.callback(_,void 0,r);v.callback(void 0,u,u.release)}):v.callback(void 0,u,u.release)}_releaseOnce(u,v){let w=!1;return E=>{w&&h(),w=!0,this._release(u,v,E)}}_release(u,v,w){if(u.on("error",v),u._poolUseCount=(u._poolUseCount||0)+1,this.emit("release",w,u),w||this.ending||!u._queryable||u._ending||u._poolUseCount>=this.options.maxUses){u._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(u),this._pulseQueue();return}if(this._expired.has(u)){this.log("remove expired client"),this._expired.delete(u),this._remove(u),this._pulseQueue();return}let E;this.options.idleTimeoutMillis&&this._isAboveMin()&&(E=setTimeout(()=>{this.log("remove idle client"),this._remove(u)},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&E.unref()),this.options.allowExitOnIdle&&u.unref(),this._idle.push(new l(u,v,E)),this._pulseQueue()}query(u,v,w){if(typeof u=="function"){let _=f(this.Promise,u);return qs(function(){return _.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),_.result}typeof v=="function"&&(w=v,v=void 0);let E=f(this.Promise,w);return w=E.callback,this.connect((_,O)=>{if(_)return w(_);let D=!1,S=g(I=>{D||(D=!0,O.release(I),w(I))},"onError");O.once("error",S),this.log("dispatching query");try{O.query(u,v,(I,L)=>{if(this.log("query dispatched"),O.removeListener("error",S),!D)return D=!0,O.release(I),I?w(I):w(void 0,L)})}catch(I){return O.release(I),w(I)}}),E.result}end(u){if(this.log("ending"),this.ending){let w=new Error("Called end on pool more than once");return u?u(w):this.Promise.reject(w)}this.ending=!0;let v=f(this.Promise,u);return this._endCallback=v.callback,this._pulseQueue(),v.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((u,v)=>u+(this._expired.has(v)?1:0),0)}get totalCount(){return this._clients.length}};g(b,"Pool");var x=b;t.exports=x}),Ei={};ke(Ei,{default:()=>_i});var _i,Tn=ge(()=>{q(),_i={}}),Cn=ee((e,t)=>{t.exports={name:"pg",version:"8.8.0",description:"PostgreSQL client - pure javascript & libpq with the same API",keywords:["database","libpq","pg","postgre","postgres","postgresql","rdbms"],homepage:"https://github.com/brianc/node-postgres",repository:{type:"git",url:"git://github.com/brianc/node-postgres.git",directory:"packages/pg"},author:"Brian Carlson <brian.m.carlson@gmail.com>",main:"./lib",dependencies:{"buffer-writer":"2.0.0","packet-reader":"1.0.0","pg-connection-string":"^2.5.0","pg-pool":"^3.5.2","pg-protocol":"^1.5.0","pg-types":"^2.1.0",pgpass:"1.x"},devDependencies:{async:"2.6.4",bluebird:"3.5.2",co:"4.6.0","pg-copy-streams":"0.3.0"},peerDependencies:{"pg-native":">=3.0.1"},peerDependenciesMeta:{"pg-native":{optional:!0}},scripts:{test:"make test-all"},files:["lib","SPONSORS.md"],license:"MIT",engines:{node:">= 8.0.0"},gitHead:"c99fb2c127ddf8d712500db2c7b9a5491a178655"}}),In=ee((e,t)=>{q();var s=tt().EventEmitter,r=(gs(),ue(Vt)),i=ms(),a=t.exports=function(o,p,h){s.call(this),o=i.normalizeQueryConfig(o,p,h),this.text=o.text,this.values=o.values,this.name=o.name,this.callback=o.callback,this.state="new",this._arrayMode=o.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(f){f==="row"&&(this._emitRowEvents=!0)}).bind(this))};r.inherits(a,s);var l={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};a.prototype.handleError=function(o){var p=this.native.pq.resultErrorFields();if(p)for(var h in p){var f=l[h]||h;o[f]=p[h]}this.callback?this.callback(o):this.emit("error",o),this.state="error"},a.prototype.then=function(o,p){return this._getPromise().then(o,p)},a.prototype.catch=function(o){return this._getPromise().catch(o)},a.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(o,p){this._once("end",o),this._once("error",p)}).bind(this)),this._promise)},a.prototype.submit=function(o){this.state="running";var p=this;this.native=o.native,o.native.arrayMode=this._arrayMode;var h=g(function(b,x,d){if(o.native.arrayMode=!1,qs(function(){p.emit("_done")}),b)return p.handleError(b);p._emitRowEvents&&(d.length>1?x.forEach((u,v)=>{u.forEach(w=>{p.emit("row",w,d[v])})}):x.forEach(function(u){p.emit("row",u,d)})),p.state="end",p.emit("end",d),p.callback&&p.callback(null,d)},"after");if(Z.domain&&(h=Z.domain.bind(h)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));var f=(this.values||[]).map(i.prepareValue);if(o.namedQueries[this.name]){if(this.text&&o.namedQueries[this.name]!==this.text){let b=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return h(b)}return o.native.execute(this.name,f,h)}return o.native.prepare(this.name,this.text,f.length,function(b){return b?h(b):(o.namedQueries[p.name]=p.text,p.native.execute(p.name,f,h))})}else if(this.values){if(!Array.isArray(this.values)){let b=new Error("Query values must be an array");return h(b)}var y=this.values.map(i.prepareValue);o.native.query(this.text,y,h)}else o.native.query(this.text,h)}}),Ln=ee((e,t)=>{q();var s=(Tn(),ue(Ei)),r=Vs();Cn();var i=tt().EventEmitter,a=(gs(),ue(Vt)),l=Xs(),o=In(),p=t.exports=function(h){i.call(this),h=h||{},this._Promise=h.Promise||us.Promise,this._types=new r(h.types),this.native=new s({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;var f=this.connectionParameters=new l(h);this.user=f.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:f.password}),this.database=f.database,this.host=f.host,this.port=f.port,this.namedQueries={}};p.Query=o,a.inherits(p,i),p.prototype._errorAllQueries=function(h){let f=g(y=>{Z.nextTick(()=>{y.native=this.native,y.handleError(h)})},"enqueueError");this._hasActiveQuery()&&(f(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(f),this._queryQueue.length=0},p.prototype._connect=function(h){var f=this;if(this._connecting){Z.nextTick(()=>h(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(y,b){if(y)return h(y);f.native.connect(b,function(x){if(x)return f.native.end(),h(x);f._connected=!0,f.native.on("error",function(d){f._queryable=!1,f._errorAllQueries(d),f.emit("error",d)}),f.native.on("notification",function(d){f.emit("notification",{channel:d.relname,payload:d.extra})}),f.emit("connect"),f._pulseQueryQueue(!0),h()})})},p.prototype.connect=function(h){if(h){this._connect(h);return}return new this._Promise((f,y)=>{this._connect(b=>{b?y(b):f()})})},p.prototype.query=function(h,f,y){var b,x,d,u,v;if(h==null)throw new TypeError("Client was passed a null or undefined query");if(typeof h.submit=="function")d=h.query_timeout||this.connectionParameters.query_timeout,x=b=h,typeof f=="function"&&(h.callback=f);else if(d=this.connectionParameters.query_timeout,b=new o(h,f,y),!b.callback){let w,E;x=new this._Promise((_,O)=>{w=_,E=O}),b.callback=(_,O)=>_?E(_):w(O)}return d&&(v=b.callback,u=setTimeout(()=>{var w=new Error("Query read timeout");Z.nextTick(()=>{b.handleError(w,this.connection)}),v(w),b.callback=()=>{};var E=this._queryQueue.indexOf(b);E>-1&&this._queryQueue.splice(E,1),this._pulseQueryQueue()},d),b.callback=(w,E)=>{clearTimeout(u),v(w,E)}),this._queryable?this._ending?(b.native=this.native,Z.nextTick(()=>{b.handleError(new Error("Client was closed and is not queryable"))}),x):(this._queryQueue.push(b),this._pulseQueryQueue(),x):(b.native=this.native,Z.nextTick(()=>{b.handleError(new Error("Client has encountered a connection error and is not queryable"))}),x)},p.prototype.end=function(h){var f=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,h));var y;return h||(y=new this._Promise(function(b,x){h=g(d=>d?x(d):b(),"cb")})),this.native.end(function(){f._errorAllQueries(new Error("Connection terminated")),Z.nextTick(()=>{f.emit("end"),h&&h()})}),y},p.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},p.prototype._pulseQueryQueue=function(h){if(this._connected&&!this._hasActiveQuery()){var f=this._queryQueue.shift();if(!f){h||this.emit("drain");return}this._activeQuery=f,f.submit(this);var y=this;f.once("_done",function(){y._pulseQueryQueue()})}},p.prototype.cancel=function(h){this._activeQuery===h?this.native.cancel(function(){}):this._queryQueue.indexOf(h)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(h),1)},p.prototype.ref=function(){},p.prototype.unref=function(){},p.prototype.setTypeParser=function(h,f,y){return this._types.setTypeParser(h,f,y)},p.prototype.getTypeParser=function(h,f){return this._types.getTypeParser(h,f)}}),gr=ee((e,t)=>{q(),t.exports=Ln()}),bs=ee((e,t)=>{q();var s=Sn(),r=fs(),i=wi(),a=kn(),{DatabaseError:l}=vi(),o=g(h=>{var f;return f=class extends a{constructor(y){super(y,h)}},g(f,"BoundPool"),f},"poolFactory"),p=g(function(h){this.defaults=r,this.Client=h,this.Query=this.Client.Query,this.Pool=o(this.Client),this._pools=[],this.Connection=i,this.types=hs(),this.DatabaseError=l},"PG");typeof Z.env.NODE_PG_FORCE_NATIVE<"u"?t.exports=new p(gr()):(t.exports=new p(s),Object.defineProperty(t.exports,"native",{configurable:!0,enumerable:!1,get(){var h=null;try{h=new p(gr())}catch(f){if(f.code!=="MODULE_NOT_FOUND")throw f}return Object.defineProperty(t.exports,"native",{value:h}),h}}))});q();q();Ht();Jr();q();var An=Object.defineProperty,On=Object.defineProperties,Rn=Object.getOwnPropertyDescriptors,br=Object.getOwnPropertySymbols,Mn=Object.prototype.hasOwnProperty,Dn=Object.prototype.propertyIsEnumerable,vr=g((e,t,s)=>t in e?An(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,"__defNormalProp"),Nn=g((e,t)=>{for(var s in t||(t={}))Mn.call(t,s)&&vr(e,s,t[s]);if(br)for(var s of br(t))Dn.call(t,s)&&vr(e,s,t[s]);return e},"__spreadValues"),Pn=g((e,t)=>On(e,Rn(t)),"__spreadProps"),Bn=1008e3,yr=new Uint8Array(new Uint16Array([258]).buffer)[0]===2,Fn=new TextDecoder,Ks=new TextEncoder,Jt=Ks.encode("0123456789abcdef"),Zt=Ks.encode("0123456789ABCDEF"),Un=Ks.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Si=Un.slice();Si[62]=45;Si[63]=95;var Lt,es;function ki(e,{alphabet:t,scratchArr:s}={}){if(!Lt)if(Lt=new Uint16Array(256),es=new Uint16Array(256),yr)for(let x=0;x<256;x++)Lt[x]=Jt[x&15]<<8|Jt[x>>>4],es[x]=Zt[x&15]<<8|Zt[x>>>4];else for(let x=0;x<256;x++)Lt[x]=Jt[x&15]|Jt[x>>>4]<<8,es[x]=Zt[x&15]|Zt[x>>>4]<<8;e.byteOffset%4!==0&&(e=new Uint8Array(e));let r=e.length,i=r>>>1,a=r>>>2,l=s||new Uint16Array(r),o=new Uint32Array(e.buffer,e.byteOffset,a),p=new Uint32Array(l.buffer,l.byteOffset,i),h=t==="upper"?es:Lt,f=0,y=0,b;if(yr)for(;f<a;)b=o[f++],p[y++]=h[b>>>8&255]<<16|h[b&255],p[y++]=h[b>>>24]<<16|h[b>>>16&255];else for(;f<a;)b=o[f++],p[y++]=h[b>>>24]<<16|h[b>>>16&255],p[y++]=h[b>>>8&255]<<16|h[b&255];for(f<<=2;f<r;)l[f]=h[e[f++]];return Fn.decode(l.subarray(0,r))}g(ki,"_toHex");function Ti(e,t={}){let s="",r=e.length,i=Bn>>>1,a=Math.ceil(r/i),l=new Uint16Array(a>1?i:r);for(let o=0;o<a;o++){let p=o*i,h=p+i;s+=ki(e.subarray(p,h),Pn(Nn({},t),{scratchArr:l}))}return s}g(Ti,"_toHexChunked");function Ci(e,t={}){return t.alphabet!=="upper"&&typeof e.toHex=="function"?e.toHex():Ti(e,t)}g(Ci,"toHex");q();var Ii=class Li{constructor(t,s){this.strings=t,this.values=s}toParameterizedQuery(t={query:"",params:[]}){var i;let{strings:s,values:r}=this;for(let a=0,l=s.length;a<l;a++)if(t.query+=s[a],a<r.length){let o=r[a];if(o instanceof Ri)t.query+=o.sql;else if(o instanceof as)if(o.queryData instanceof Li)o.queryData.toParameterizedQuery(t);else{if((i=o.queryData.params)!=null&&i.length)throw new Error("This query is not composable");t.query+=o.queryData.query}else{let{params:p}=t;p.push(o),t.query+="$"+p.length,(o instanceof G||ArrayBuffer.isView(o))&&(t.query+="::bytea")}}return t}};g(Ii,"SqlTemplate");var Ai=Ii,Oi=class{constructor(t){this.sql=t}};g(Oi,"UnsafeRawSql");var Ri=Oi;q();function Js(){typeof window<"u"&&typeof document<"u"&&typeof console<"u"&&typeof console.warn=="function"&&console.warn(`          
        ************************************************************
        *                                                          *
        *  WARNING: Running SQL directly from the browser can have *
        *  security implications. Even if your database is         *
        *  protected by Row-Level Security (RLS), use it at your   *
        *  own risk. This approach is great for fast prototyping,  *
        *  but ensure proper safeguards are in place to prevent    *
        *  misuse or execution of expensive SQL queries by your    *
        *  end users.                                              *
        *                                                          *
        *  If you've assessed the risks, suppress this message     *
        *  using the disableWarningInBrowsers configuration        *
        *  parameter.                                              *
        *                                                          *
        ************************************************************`)}g(Js,"warnIfBrowser");Ht();var zn=et(Vs()),$n=et(ms()),Mi=class Di extends Error{constructor(t){super(t),Q(this,"name","NeonDbError"),Q(this,"severity"),Q(this,"code"),Q(this,"detail"),Q(this,"hint"),Q(this,"position"),Q(this,"internalPosition"),Q(this,"internalQuery"),Q(this,"where"),Q(this,"schema"),Q(this,"table"),Q(this,"column"),Q(this,"dataType"),Q(this,"constraint"),Q(this,"file"),Q(this,"line"),Q(this,"routine"),Q(this,"sourceError"),"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,Di)}};g(Mi,"NeonDbError");var dt=Mi,xr="transaction() expects an array of queries, or a function returning an array of queries",jn=["severity","code","detail","hint","position","internalPosition","internalQuery","where","schema","table","column","dataType","constraint","file","line","routine"];function Ni(e){return e instanceof G?"\\x"+Ci(e):e}g(Ni,"encodeBuffersAsBytea");function Bs(e){let{query:t,params:s}=e instanceof Ai?e.toParameterizedQuery():e;return{query:t,params:s.map(r=>Ni((0,$n.prepareValue)(r)))}}g(Bs,"prepareQuery");function Zs(e,{arrayMode:t,fullResults:s,fetchOptions:r,isolationLevel:i,readOnly:a,deferrable:l,authToken:o,disableWarningInBrowsers:p}={}){if(!e)throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");let h;try{h=Hs(e)}catch{throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: "+String(e))}let{protocol:f,username:y,hostname:b,port:x,pathname:d}=h;if(f!=="postgres:"&&f!=="postgresql:"||!y||!b||!d)throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");function u(w,...E){if(!(Array.isArray(w)&&Array.isArray(w.raw)&&Array.isArray(E)))throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');return new as(v,new Ai(w,E))}g(u,"templateFn"),u.query=(w,E,_)=>new as(v,{query:w,params:E??[]},_),u.unsafe=w=>new Ri(w),u.transaction=async(w,E)=>{if(typeof w=="function"&&(w=w(u)),!Array.isArray(w))throw new Error(xr);w.forEach(D=>{if(!(D instanceof as))throw new Error(xr)});let _=w.map(D=>D.queryData),O=w.map(D=>D.opts??{});return v(_,O,E)};async function v(w,E,_){let{fetchEndpoint:O,fetchFunction:D}=Nt,S=Array.isArray(w)?{queries:w.map(te=>Bs(te))}:Bs(w),I=r??{},L=t??!1,k=s??!1,N=i,A=a,z=l;_!==void 0&&(_.fetchOptions!==void 0&&(I={...I,..._.fetchOptions}),_.arrayMode!==void 0&&(L=_.arrayMode),_.fullResults!==void 0&&(k=_.fullResults),_.isolationLevel!==void 0&&(N=_.isolationLevel),_.readOnly!==void 0&&(A=_.readOnly),_.deferrable!==void 0&&(z=_.deferrable)),E!==void 0&&!Array.isArray(E)&&E.fetchOptions!==void 0&&(I={...I,...E.fetchOptions});let $=o;!Array.isArray(E)&&(E==null?void 0:E.authToken)!==void 0&&($=E.authToken);let P=typeof O=="function"?O(b,x,{jwtAuth:$!==void 0}):O,U={"Neon-Connection-String":e,"Neon-Raw-Text-Output":"true","Neon-Array-Mode":"true"},V=await Bi($);V&&(U.Authorization=`Bearer ${V}`),Array.isArray(w)&&(N!==void 0&&(U["Neon-Batch-Isolation-Level"]=N),A!==void 0&&(U["Neon-Batch-Read-Only"]=String(A)),z!==void 0&&(U["Neon-Batch-Deferrable"]=String(z))),p||Nt.disableWarningInBrowsers||Js();let Y;try{Y=await(D??fetch)(P,{method:"POST",body:JSON.stringify(S),headers:U,...I})}catch(te){let K=new dt(`Error connecting to database: ${te}`);throw K.sourceError=te,K}if(Y.ok){let te=await Y.json();if(Array.isArray(w)){let K=te.results;if(!Array.isArray(K))throw new dt("Neon internal error: unexpected result format");return K.map((be,re)=>{let le=E[re]??{},_t=le.arrayMode??L,St=le.fullResults??k;return Fs(be,{arrayMode:_t,fullResults:St,types:le.types})})}else{let K=E??{},be=K.arrayMode??L,re=K.fullResults??k;return Fs(te,{arrayMode:be,fullResults:re,types:K.types})}}else{let{status:te}=Y;if(te===400){let K=await Y.json(),be=new dt(K.message);for(let re of jn)be[re]=K[re]??void 0;throw be}else{let K=await Y.text();throw new dt(`Server error (HTTP status ${te}): ${K}`)}}}return g(v,"execute"),u}g(Zs,"neon");var Pi=class{constructor(t,s,r){this.execute=t,this.queryData=s,this.opts=r}then(t,s){return this.execute(this.queryData,this.opts).then(t,s)}catch(t){return this.execute(this.queryData,this.opts).catch(t)}finally(t){return this.execute(this.queryData,this.opts).finally(t)}};g(Pi,"NeonQueryPromise");var as=Pi;function Fs(e,{arrayMode:t,fullResults:s,types:r}){let i=new zn.default(r),a=e.fields.map(p=>p.name),l=e.fields.map(p=>i.getTypeParser(p.dataTypeID)),o=t===!0?e.rows.map(p=>p.map((h,f)=>h===null?null:l[f](h))):e.rows.map(p=>Object.fromEntries(p.map((h,f)=>[a[f],h===null?null:l[f](h)])));return s?(e.viaNeonFetch=!0,e.rowAsArray=t,e.rows=o,e._parsers=l,e._types=i,e):o}g(Fs,"processQueryResult");async function Bi(e){if(typeof e=="string")return e;if(typeof e=="function")try{return await Promise.resolve(e())}catch(t){let s=new dt("Error getting auth token.");throw t instanceof Error&&(s=new dt(`Error getting auth token: ${t.message}`)),s}}g(Bi,"getAuthToken");q();var qn=et(bs());q();var Hn=et(bs()),Fi=class extends Hn.Client{constructor(t){super(t),this.config=t}get neonConfig(){return this.connection.stream}connect(t){var h,f;let{neonConfig:s}=this;s.forceDisablePgSSL&&(this.ssl=this.connection.ssl=!1),this.ssl&&s.useSecureWebSocket&&console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");let r=typeof this.config!="string"&&((h=this.config)==null?void 0:h.host)!==void 0||typeof this.config!="string"&&((f=this.config)==null?void 0:f.connectionString)!==void 0||Z.env.PGHOST!==void 0,i=Z.env.USER??Z.env.USERNAME;if(!r&&this.host==="localhost"&&this.user===i&&this.database===i&&this.password===null)throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${i}, db: ${i}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);let a=super.connect(t),l=s.pipelineTLS&&this.ssl,o=s.pipelineConnect==="password";if(!l&&!s.pipelineConnect)return a;let p=this.connection;if(l&&p.on("connect",()=>p.stream.emit("data","S")),o){p.removeAllListeners("authenticationCleartextPassword"),p.removeAllListeners("readyForQuery"),p.once("readyForQuery",()=>p.on("readyForQuery",this._handleReadyForQuery.bind(this)));let y=this.ssl?"sslconnect":"connect";p.on(y,()=>{this.neonConfig.disableWarningInBrowsers||Js(),this._handleAuthCleartextPassword(),this._handleReadyForQuery()})}return a}async _handleAuthSASLContinue(t){if(typeof crypto>"u"||crypto.subtle===void 0||crypto.subtle.importKey===void 0)throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");let s=crypto.subtle,r=this.saslSession,i=this.password,a=t.data;if(r.message!=="SASLInitialResponse"||typeof i!="string"||typeof a!="string")throw new Error("SASL: protocol error");let l=Object.fromEntries(a.split(",").map(te=>{if(!/^.=/.test(te))throw new Error("SASL: Invalid attribute pair entry");let K=te[0],be=te.substring(2);return[K,be]})),o=l.r,p=l.s,h=l.i;if(!o||!/^[!-+--~]+$/.test(o))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");if(!p||!/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(p))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");if(!h||!/^[1-9][0-9]*$/.test(h))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");if(!o.startsWith(r.clientNonce))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");if(o.length===r.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");let f=parseInt(h,10),y=G.from(p,"base64"),b=new TextEncoder,x=b.encode(i),d=await s.importKey("raw",x,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),u=new Uint8Array(await s.sign("HMAC",d,G.concat([y,G.from([0,0,0,1])]))),v=u;for(var w=0;w<f-1;w++)u=new Uint8Array(await s.sign("HMAC",d,u)),v=G.from(v.map((te,K)=>v[K]^u[K]));let E=v,_=await s.importKey("raw",E,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),O=new Uint8Array(await s.sign("HMAC",_,b.encode("Client Key"))),D=await s.digest("SHA-256",O),S="n=*,r="+r.clientNonce,I="r="+o+",s="+p+",i="+f,L="c=biws,r="+o,k=S+","+I+","+L,N=await s.importKey("raw",D,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var A=new Uint8Array(await s.sign("HMAC",N,b.encode(k))),z=G.from(O.map((te,K)=>O[K]^A[K])),$=z.toString("base64");let P=await s.importKey("raw",E,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),U=await s.sign("HMAC",P,b.encode("Server Key")),V=await s.importKey("raw",U,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var Y=G.from(await s.sign("HMAC",V,b.encode(k)));r.message="SASLResponse",r.serverSignature=Y.toString("base64"),r.response=L+",p="+$,this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}};g(Fi,"NeonClient");var Vn=Fi;Ht();var Wn=et(Xs());function Ui(e,t){if(t)return{callback:t,result:void 0};let s,r,i=g(function(l,o){l?s(l):r(o)},"cb"),a=new e(function(l,o){r=l,s=o});return{callback:i,result:a}}g(Ui,"promisify");var Gn=class extends qn.Pool{constructor(){super(...arguments),Q(this,"Client",Vn),Q(this,"hasFetchUnsupportedListeners",!1),Q(this,"addListener",this.on)}on(t,s){return t!=="error"&&(this.hasFetchUnsupportedListeners=!0),super.on(t,s)}query(t,s,r){var a;if(!Nt.poolQueryViaFetch||this.hasFetchUnsupportedListeners||typeof t=="function")return super.query(t,s,r);typeof s=="function"&&(r=s,s=void 0);let i=Ui(this.Promise,r);r=i.callback;try{let l=new Wn.default(this.options),o=encodeURIComponent,p=encodeURI,h=`postgresql://${o(l.user)}:${o(l.password)}@${o(l.host)}/${p(l.database)}`,f=typeof t=="string"?t:t.text,y=s??t.values??[];Zs(h,{fullResults:!0,arrayMode:t.rowMode==="array"}).query(f,y,{types:t.types??((a=this.options)==null?void 0:a.types)}).then(b=>r(void 0,b)).catch(b=>r(b))}catch(l){r(l)}return i.result}};g(Gn,"NeonPool");Ht();var Wt=et(bs());Wt.DatabaseError;Wt.defaults;Wt.escapeIdentifier;Wt.escapeLiteral;Wt.types;/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/const j=new Gr,Qn=process.env.DATABASE_URL||"postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",R=Zs(Qn);function vs(e){if(!e)return"";const t=e.split(/\s+/);for(let s=1;s<t.length;s++)if(t[s].endsWith("구")&&!t[s].endsWith("시구"))return t[s].replace(/구$/,"");for(let s=1;s<t.length;s++)if(t[s].endsWith("시")&&t[s]!==t[0])return t[s].replace(/(특별시|광역시|특별자치시|시)$/,"");return t[0]?t[0].replace(/(특별자치도|도)$/,""):""}function er(e){if(!e)return"";const t=e.split(/\s+/);return t[0]?t[0].replace(/(특별시|광역시|특별자치시|특별자치도|도|시)$/,""):""}function Yn(e){return{마사지:"MassageTherapist",헤드스파:"BeautySalon",피부관리:"BeautySalon",헤어:"HairSalon",메이크업:"BeautySalon",왁싱:"BeautySalon",반영구:"BeautySalon",병원:"MedicalBusiness",그외:"LocalBusiness"}[e]||"LocalBusiness"}function Xn(e){const t=vs(e.address),s=er(e.address),r=t||s;return`${e.name} ${r?r+" ":""}${e.category} 추천 | 마이뷰티맵`}function zi(e){const t=vs(e.address),s=er(e.address),r=Array.isArray(e.tags)&&e.tags.length?e.tags.join("·")+" ":"",i=t||s,a=e.price?` 가격 ${e.price}.`:"",l=e.desc?" "+e.desc.slice(0,40):"";return`${e.name} | ${i?i+" ":""}${e.category} 잘하는 곳. ${r}예약·위치·가격 한눈에 확인!${a}${l}`.slice(0,160)}function Kn(e,t){return`${t} ${e} 추천 TOP | 마이뷰티맵`}function Jn(e,t,s){return`${t} ${e} 잘하는 곳 ${s}곳 추천! 가격·위치·예약·후기까지 마이뷰티맵에서 한눈에 확인하세요.`}function Zn(e,t){const s=t;return[`${s} ${e}`,`${s} ${e} 추천`,`${s} ${e} 잘하는 곳`,`${s} ${e} 예약`,`${s} ${e} 가격`,`${s} ${e} 후기`,`${s} ${e} 맛집`,`${s} 뷰티샵`,`${s} 뷰티 추천`,`${e} 추천`].join(",")}function ve(){return new Date(Date.now()+540*60*1e3).toISOString().slice(0,10)}function $i(){return new Date(Date.now()+540*60*1e3-864e5).toISOString().slice(0,10)}function ji(e){const t=(e??"").trim();if(!t)return"";if(/^[A-Za-z0-9_-]{11}$/.test(t))return t;const s=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);return s?s[1]:t}function eo(e){return e.plan!=="shoot"||!e.paid_until?!1:new Date(e.paid_until)>=new Date}function je(e){return{id:e.id,name:e.name,category:e.category,tags:e.tags??[],price:e.price??"",address:e.address??"",district:e.district??"",lat:parseFloat(e.lat)||37.5326,lng:parseFloat(e.lng)||127.0246,smartPlaceUrl:e.smart_place_url??"",youtubeId:e.youtube_id??"",featured:e.featured??!1,thumbnail:e.thumbnail??"",phone:e.phone??"",desc:e.description??"",active:e.active??!0,displayMode:e.display_mode??"both",plan:e.plan??"basic",paidUntil:e.paid_until??null,paymentStatus:e.payment_status??"unpaid",paymentMemo:e.payment_memo??"",views:parseInt(e.view_cnt)||0,feedSP:parseInt(e.feed_sp)||0,mapSP:parseInt(e.map_sp)||0,isPremium:eo(e),isRecommended:e.is_recommended??!1}}function to(e,t,s,r){const a=(s-e)*Math.PI/180,l=(r-t)*Math.PI/180,o=Math.sin(a/2)**2+Math.cos(e*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(l/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}let wr=!1,ts=null;async function so(){if(!wr)return ts||(ts=(async()=>{try{await R`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token   TEXT`}catch{}try{await R`ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed     INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog  INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map      INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS rec_view     INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`CREATE TABLE IF NOT EXISTS honey_items (
        id           SERIAL PRIMARY KEY,
        title        TEXT    NOT NULL,
        description  TEXT    NOT NULL DEFAULT '',
        youtube_id   TEXT    NOT NULL DEFAULT '',
        coupang_url  TEXT    NOT NULL DEFAULT '',
        coupang_url2 TEXT    NOT NULL DEFAULT '',
        price        TEXT    NOT NULL DEFAULT '',
        tags         TEXT[]  NOT NULL DEFAULT '{}',
        sort_order   INTEGER NOT NULL DEFAULT 0,
        active       BOOLEAN NOT NULL DEFAULT true,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`}catch{}try{await R`ALTER TABLE honey_items ADD COLUMN IF NOT EXISTS coupang_url2 TEXT NOT NULL DEFAULT ''`}catch{}try{await R`CREATE TABLE IF NOT EXISTS shorts_items (
        id               SERIAL PRIMARY KEY,
        name             TEXT    NOT NULL DEFAULT '',
        category         TEXT    NOT NULL DEFAULT '',
        address          TEXT    NOT NULL DEFAULT '',
        youtube_id       TEXT    NOT NULL DEFAULT '',
        smart_place_url  TEXT    NOT NULL DEFAULT '',
        sort_order       INTEGER NOT NULL DEFAULT 0,
        active           BOOLEAN NOT NULL DEFAULT true,
        view_cnt         INTEGER NOT NULL DEFAULT 0,
        sp_cnt           INTEGER NOT NULL DEFAULT 0,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;try{await R`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS smart_place_url TEXT NOT NULL DEFAULT ''`}catch{}try{await R`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS view_cnt INTEGER NOT NULL DEFAULT 0`}catch{}try{await R`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS sp_cnt INTEGER NOT NULL DEFAULT 0`}catch{}}catch{}wr=!0})(),ts)}j.use("*",async(e,t)=>(await so(),t()));j.get("/api/shops",async e=>{const t=e.req.query("category")??"",s=(e.req.query("q")??"").toLowerCase(),r=parseFloat(e.req.query("lat")??""),i=parseFloat(e.req.query("lng")??""),a=e.req.query("nearby")==="1",l=e.req.query("shuffle")==="1";let p=(await R`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `).map(je);if(t==="recommended"?p=p.filter(h=>h.isRecommended):t&&t!=="all"&&(p=p.filter(h=>h.category===t)),s&&(p=p.filter(h=>h.name.toLowerCase().includes(s)||(h.tags||[]).some(f=>f.toLowerCase().includes(s))||h.district.toLowerCase().includes(s))),a&&!isNaN(r)&&!isNaN(i))p=p.map(h=>({...h,dist:to(r,i,h.lat,h.lng)})).filter(h=>h.dist<=20).sort((h,f)=>h.isPremium&&!f.isPremium?-1:!h.isPremium&&f.isPremium?1:h.dist-f.dist);else if(l){const h=p.filter(y=>y.isPremium),f=p.filter(y=>!y.isPremium);for(let y=h.length-1;y>0;y--){const b=Math.floor(Math.random()*(y+1));[h[y],h[b]]=[h[b],h[y]]}for(let y=f.length-1;y>0;y--){const b=Math.floor(Math.random()*(y+1));[f[y],f[b]]=[f[b],f[y]]}p=[...h,...f]}else p.sort((h,f)=>h.isPremium&&!f.isPremium?-1:!h.isPremium&&f.isPremium?1:0);return e.json(p)});j.get("/api/geocode",async e=>{var o,p,h,f,y;const t=e.req.query("query")??"";if(!t)return e.json({error:"query required"},400);const s=b=>b.replace(/(로|길|번길)\s+(\d)/g,"$1$2"),r=[],i=s(t);i!==t&&r.push(i),r.push(t);const a=i.trim().split(/\s+/);a.length>3&&r.push(a.slice(0,-1).join(" "));const l=async b=>(await fetch(`https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(b)}`,{headers:{"X-NCP-APIGW-API-KEY-ID":"xjjg4490h8","X-NCP-APIGW-API-KEY":"RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD"}})).json();try{let b=null;for(const E of r){const _=await l(E);if((o=_.addresses)!=null&&o.length){b=_.addresses[0];break}}if(!b)return e.json({error:"주소를 찾을 수 없어요"},404);const x=b.addressElements||[],d=((p=x.find(E=>{var _;return(_=E.types)==null?void 0:_.includes("SIDO")}))==null?void 0:p.longName)||"",u=((h=x.find(E=>{var _;return(_=E.types)==null?void 0:_.includes("SIGUGUN")}))==null?void 0:h.longName)||"",v=((f=x.find(E=>{var _,O;return((_=E.types)==null?void 0:_.includes("DONGMYUN"))||((O=E.types)==null?void 0:O.includes("RI"))}))==null?void 0:f.longName)||"",w=[d,u,v].filter(Boolean).join(" ")||((y=b.roadAddress)==null?void 0:y.split(" ").slice(0,3).join(" "))||"";return e.json({lat:parseFloat(b.y),lng:parseFloat(b.x),address:b.roadAddress||b.jibunAddress,district:w})}catch{return e.json({error:"지오코딩 실패"},500)}});j.get("/api/shops/all",async e=>{const t=await R`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `;return e.json(t.map(je))});j.get("/api/shops/:id",async e=>{const t=+e.req.param("id"),s=await R`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${t}
  `;return s.length?e.json(je(s[0])):e.json({error:"not found"},404)});j.post("/api/admin/shops",async e=>{const t=await e.req.json(),s=Array.isArray(t.tags)?t.tags:(t.tags??"").split(",").map(a=>a.trim()).filter(Boolean),i=(await R`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${t.name??"새 업체"}, ${t.category??"피부관리"}, ${s},
       ${t.price??""}, ${t.address??""}, ${t.district??""},
       ${parseFloat(t.lat)||37.5326}, ${parseFloat(t.lng)||127.0246},
       ${t.smartPlaceUrl??""}, ${ji(t.youtubeId??"")},
       ${t.featured??!1},
       ${t.thumbnail??""},
       ${t.phone??""}, ${t.desc??""}, true, ${t.displayMode??"both"})
    RETURNING *
  `)[0];return await R`INSERT INTO stats (shop_id) VALUES (${i.id}) ON CONFLICT DO NOTHING`,e.json(je(i))});j.put("/api/admin/shops/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=Array.isArray(s.tags)?s.tags:(s.tags??"").split(",").map(a=>a.trim()).filter(Boolean),i=await R`
    UPDATE shops SET
      name            = ${s.name},
      category        = ${s.category},
      tags            = ${r},
      price           = ${s.price??""},
      address         = ${s.address??""},
      district        = ${s.district??""},
      lat             = ${parseFloat(s.lat)||37.5326},
      lng             = ${parseFloat(s.lng)||127.0246},
      smart_place_url = ${s.smartPlaceUrl??""},
      youtube_id      = ${ji(s.youtubeId??"")},
      featured        = ${s.featured??!1},
      thumbnail       = ${s.thumbnail??""},
      phone           = ${s.phone??""},
      description     = ${s.desc??""},
      active          = ${s.active??!0},
      display_mode    = ${s.displayMode??"both"}
    WHERE id = ${t}
    RETURNING *
  `;return i.length?(await R`INSERT INTO stats (shop_id) VALUES (${t}) ON CONFLICT DO NOTHING`,e.json(je(i[0]))):e.json({error:"not found"},404)});j.put("/api/admin/shops/:id/recommended",async e=>{const t=+e.req.param("id"),{isRecommended:s}=await e.req.json(),r=await R`
    UPDATE shops SET is_recommended = ${!!s}
    WHERE id = ${t} RETURNING *
  `;return r.length?e.json({ok:!0,isRecommended:r[0].is_recommended}):e.json({error:"not found"},404)});j.post("/api/track/rec/:id",async e=>{const t=+e.req.param("id"),s=ve();try{await R`INSERT INTO daily_stats (shop_id, stat_date, rec_view)
                VALUES (${t}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET rec_view = daily_stats.rec_view + 1`}catch{}return e.json({ok:!0})});j.put("/api/admin/shops/:id/payment",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await R`
    UPDATE shops SET
      plan           = ${s.plan??"basic"},
      paid_until     = ${s.paidUntil||null},
      payment_status = ${s.paymentStatus??"unpaid"},
      payment_memo   = ${s.paymentMemo??""}
    WHERE id = ${t}
    RETURNING *
  `;return r.length?e.json(je(r[0])):e.json({error:"not found"},404)});j.delete("/api/admin/shops/:id",async e=>{const t=+e.req.param("id");return await R`DELETE FROM shops WHERE id = ${t}`,e.json({ok:!0})});j.post("/api/track/view/:id",async e=>{const t=+e.req.param("id"),s=ve();let r="feed";try{const i=await e.req.json();["feed","catalog","map"].includes(i==null?void 0:i.source)&&(r=i.source)}catch{}await R`INSERT INTO stats (shop_id, view_cnt) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1`;try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}return r==="feed"?await R`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, feed_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt   = daily_stats.view_cnt   + 1,
                    feed_view  = daily_stats.feed_view  + 1`:r==="catalog"?await R`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, catalog_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt      = daily_stats.view_cnt      + 1,
                    catalog_view  = daily_stats.catalog_view  + 1`:await R`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, map_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt  = daily_stats.view_cnt  + 1,
                    map_view  = daily_stats.map_view  + 1`,e.json({ok:!0})});j.post("/api/track/sp/:id",async e=>{const t=+e.req.param("id"),s=ve();let r=null;try{const i=await e.req.json();r=(i==null?void 0:i.viewSrc)||null}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed    INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map     INTEGER NOT NULL DEFAULT 0`}catch{}return await R`INSERT INTO stats (shop_id, feed_sp) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1`,r==="feed"?await R`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_feed)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp  = daily_stats.feed_sp  + 1,
                    vts_feed = daily_stats.vts_feed + 1`:r==="catalog"?await R`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_catalog)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp     = daily_stats.feed_sp     + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:r==="map"?await R`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_map)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1,
                    vts_map = daily_stats.vts_map + 1`:await R`INSERT INTO daily_stats (shop_id, stat_date, feed_sp)
                VALUES (${t}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1`,e.json({ok:!0})});j.post("/api/track/mapsp/:id",async e=>{const t=+e.req.param("id"),s=ve();let r=null;try{const i=await e.req.json();r=(i==null?void 0:i.viewSrc)||null}catch{}try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed    INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map     INTEGER NOT NULL DEFAULT 0`}catch{}return await R`INSERT INTO stats (shop_id, map_sp) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1`,r==="feed"?await R`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_feed)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp   = daily_stats.map_sp   + 1,
                    vts_feed = daily_stats.vts_feed + 1`:r==="catalog"?await R`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_catalog)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp      = daily_stats.map_sp      + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:await R`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_map)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp  = daily_stats.map_sp  + 1,
                    vts_map = daily_stats.vts_map + 1`,e.json({ok:!0})});j.post("/api/track/visit",async e=>{const t=ve();return await R`
    INSERT INTO daily_visits (visit_date, visit_cnt) VALUES (${t}, 1)
    ON CONFLICT (visit_date) DO UPDATE SET visit_cnt = daily_visits.visit_cnt + 1
  `,e.json({ok:!0})});j.get("/api/admin/daily-visits",async e=>{const t=await R`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    ORDER BY visit_date DESC
    LIMIT 30
  `;return e.json(t)});j.post("/api/admin/reset-stats",async e=>(await R`UPDATE stats SET view_cnt=0, feed_sp=0, map_sp=0`,await R`DELETE FROM daily_visits`,await R`DELETE FROM daily_stats`,e.json({ok:!0})));j.post("/api/admin/init-daily-stats",async e=>(await R`
    CREATE TABLE IF NOT EXISTS daily_stats (
      shop_id      INTEGER NOT NULL,
      stat_date    DATE    NOT NULL,
      view_cnt     INTEGER NOT NULL DEFAULT 0,
      feed_sp      INTEGER NOT NULL DEFAULT 0,
      map_sp       INTEGER NOT NULL DEFAULT 0,
      feed_view    INTEGER NOT NULL DEFAULT 0,
      catalog_view INTEGER NOT NULL DEFAULT 0,
      map_view     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shop_id, stat_date)
    )
  `,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed     INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog  INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map      INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS rec_view     INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token   TEXT`,await R`ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`,e.json({ok:!0})));j.get("/api/admin/stats",async e=>{const t=ve(),s=$i();await R`
    CREATE TABLE IF NOT EXISTS daily_stats (
      shop_id      INTEGER NOT NULL,
      stat_date    DATE    NOT NULL,
      view_cnt     INTEGER NOT NULL DEFAULT 0,
      feed_sp      INTEGER NOT NULL DEFAULT 0,
      map_sp       INTEGER NOT NULL DEFAULT 0,
      feed_view    INTEGER NOT NULL DEFAULT 0,
      catalog_view INTEGER NOT NULL DEFAULT 0,
      map_view     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shop_id, stat_date)
    )
  `;try{await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await R`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}const r=await R`
    SELECT s.id, s.name, s.category, s.thumbnail, s.youtube_id,
           s.featured, s.active, s.lat, s.lng, s.smart_place_url,
           s.address, s.district, s.phone,
           s.display_mode, s.price, s.tags, s.description,
           s.plan, s.payment_status, s.paid_until, s.payment_memo,
           s.is_recommended,
           COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0)  as feed_sp,
           COALESCE(st.map_sp,0)   as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    ORDER BY (COALESCE(st.feed_sp,0)+COALESCE(st.map_sp,0)) DESC, COALESCE(st.view_cnt,0) DESC
  `,i=await R`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${t}
  `,a=await R`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${s}
  `,l=await R`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '13 days')
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,o=await R`
    SELECT shop_id, COALESCE(SUM(rec_view),0) as total_rec
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY shop_id
    HAVING SUM(rec_view) > 0
    ORDER BY total_rec DESC
  `,p={};o.forEach(v=>{p[v.shop_id]=parseInt(v.total_rec)||0});const h=await R`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `,f=await R`SELECT COUNT(*) as cnt FROM shops WHERE active = true`,y=h[0]||{},b=i[0]||{},x=a[0]||{},d=await R`
    SELECT shop_id,
           COALESCE(view_cnt,0)     as view_cnt,
           COALESCE(feed_sp,0)      as feed_sp,
           COALESCE(map_sp,0)       as map_sp,
           COALESCE(feed_view,0)    as feed_view,
           COALESCE(catalog_view,0) as catalog_view,
           COALESCE(map_view,0)     as map_view,
           COALESCE(vts_feed,0)     as vts_feed,
           COALESCE(vts_catalog,0)  as vts_catalog,
           COALESCE(vts_map,0)      as vts_map,
           COALESCE(rec_view,0)     as rec_view
    FROM daily_stats WHERE stat_date = ${t}
  `,u={};return d.forEach(v=>{u[v.shop_id]={todayViews:parseInt(v.view_cnt)||0,todayFeedSP:parseInt(v.feed_sp)||0,todayMapSP:parseInt(v.map_sp)||0,todayFeedView:parseInt(v.feed_view)||0,todayCatalogView:parseInt(v.catalog_view)||0,todayMapView:parseInt(v.map_view)||0,todayVtsFeed:parseInt(v.vts_feed)||0,todayVtsCatalog:parseInt(v.vts_catalog)||0,todayVtsMap:parseInt(v.vts_map)||0,todayRecView:parseInt(v.rec_view)||0}}),e.json({stats:r.map(v=>{var w,E,_,O,D,S,I,L,k,N;return{id:v.id,name:v.name,category:v.category,thumbnail:v.thumbnail,youtubeId:v.youtube_id,featured:v.featured,active:v.active,views:parseInt(v.view_cnt)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,lat:parseFloat(v.lat)||0,lng:parseFloat(v.lng)||0,smartPlaceUrl:v.smart_place_url??"",address:v.address??"",district:v.district??"",phone:v.phone??"",plan:v.plan??"basic",paymentStatus:v.payment_status??"unpaid",paidUntil:v.paid_until?String(v.paid_until).slice(0,10):null,paymentMemo:v.payment_memo??"",displayMode:v.display_mode??"both",priceRange:v.price??"",tags:v.tags??[],description:v.description??"",isRecommended:v.is_recommended??!1,todayViews:((w=u[v.id])==null?void 0:w.todayViews)||0,todayFeedSP:((E=u[v.id])==null?void 0:E.todayFeedSP)||0,todayMapSP:((_=u[v.id])==null?void 0:_.todayMapSP)||0,todayFeedView:((O=u[v.id])==null?void 0:O.todayFeedView)||0,todayCatalogView:((D=u[v.id])==null?void 0:D.todayCatalogView)||0,todayMapView:((S=u[v.id])==null?void 0:S.todayMapView)||0,todayVtsFeed:((I=u[v.id])==null?void 0:I.todayVtsFeed)||0,todayVtsCatalog:((L=u[v.id])==null?void 0:L.todayVtsCatalog)||0,todayVtsMap:((k=u[v.id])==null?void 0:k.todayVtsMap)||0,todayRecView:((N=u[v.id])==null?void 0:N.todayRecView)||0,weekRecView:p[v.id]||0}}),totalViews:parseInt(y.total_views)||0,totalFeedSP:parseInt(y.total_feed_sp)||0,totalMapSP:parseInt(y.total_map_sp)||0,totalShops:parseInt(f[0].cnt)||0,todayViews:parseInt(b.views)||0,todayFeedSP:parseInt(b.feed_sp)||0,todayMapSP:parseInt(b.map_sp)||0,todayRecView:parseInt(b.rec_view)||0,yestViews:parseInt(x.views)||0,yestFeedSP:parseInt(x.feed_sp)||0,yestMapSP:parseInt(x.map_sp)||0,yestRecView:parseInt(x.rec_view)||0,weekChart:l.map(v=>({date:v.stat_date,views:parseInt(v.views)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,recView:parseInt(v.rec_view)||0}))})});j.post("/api/inquiry",async e=>{const t=await e.req.json();return!t.name||!t.phone?e.json({error:"required"},400):(await R`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${t.name}, ${t.owner??""}, ${t.category??""}, ${t.area??""}, ${t.phone},
            ${t.url??""}, ${t.youtubeUrl??""}, ${t.message??""})
  `,e.json({ok:!0}))});j.get("/api/admin/calendar",async e=>{const t=parseInt(e.req.query("year")||String(new Date().getFullYear())),s=parseInt(e.req.query("month")||String(new Date().getMonth()+1)),r=`${t}-${String(s).padStart(2,"0")}-01`,i=new Date(t,s,0).toISOString().slice(0,10),a=await R`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COUNT(DISTINCT shop_id)   as active_shops
    FROM daily_stats
    WHERE stat_date >= ${r}
      AND stat_date <= ${i}
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,l=e.req.query("date");let o=[];l&&(o=await R`
      SELECT s.id, s.name, s.category, s.thumbnail,
             COALESCE(ds.view_cnt,0) as views,
             COALESCE(ds.feed_sp,0)  as feed_sp,
             COALESCE(ds.map_sp,0)   as map_sp
      FROM shops s
      LEFT JOIN daily_stats ds ON s.id = ds.shop_id AND ds.stat_date = ${l}
      WHERE s.active = true
        AND (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)+COALESCE(ds.view_cnt,0)) > 0
      ORDER BY (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)) DESC, COALESCE(ds.view_cnt,0) DESC
    `);const h=(await R`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp
    FROM daily_stats
    WHERE stat_date >= ${r}
      AND stat_date <= ${i}
  `)[0]||{},f=await R`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    WHERE visit_date >= ${r}
      AND visit_date <= ${i}
    ORDER BY visit_date ASC
  `,y={};f.forEach(x=>{y[x.visit_date]=parseInt(x.visit_cnt)||0});const b=f.reduce((x,d)=>x+(parseInt(d.visit_cnt)||0),0);return e.json({year:t,month:s,monthTotal:{views:parseInt(h.views)||0,feedSP:parseInt(h.feed_sp)||0,mapSP:parseInt(h.map_sp)||0,visits:b},daily:a.map(x=>({date:x.stat_date,visits:y[x.stat_date]||0,views:parseInt(x.views)||0,feedSP:parseInt(x.feed_sp)||0,mapSP:parseInt(x.map_sp)||0,activeShops:parseInt(x.active_shops)||0})),shopDetail:o.map(x=>({id:x.id,name:x.name,category:x.category,thumbnail:x.thumbnail,views:parseInt(x.views)||0,feedSP:parseInt(x.feed_sp)||0,mapSP:parseInt(x.map_sp)||0}))})});j.get("/api/admin/inquiries",async e=>{const t=await R`SELECT * FROM inquiries ORDER BY created_at DESC`;return e.json(t)});j.get("/favicon.ico",e=>qi());j.get("/favicon.svg",e=>qi());function qi(e){return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">💄</text></svg>',{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public,max-age=86400"}})}j.get("/og-image.jpg",e=>{try{const t=ia.join(process.cwd(),"public","og-image.jpg"),s=ta.readFileSync(t);return new Response(s,{headers:{"Content-Type":"image/jpeg","Cache-Control":"public,max-age=86400"}})}catch{return e.notFound()}});j.post("/api/admin/upload-thumbnail",async e=>{const t=await e.req.json(),{shopId:s,dataUrl:r}=t;return!r||!s?e.json({error:"required"},400):(await R`UPDATE shops SET thumbnail = ${r} WHERE id = ${s}`,e.json({ok:!0,url:r}))});j.get("/api/shorts",async e=>{const t=await R`
    SELECT * FROM shorts_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;return e.json(t)});j.get("/api/admin/shorts",async e=>{const t=await R`SELECT * FROM shorts_items ORDER BY sort_order ASC, id DESC`;return e.json(t)});j.post("/api/admin/shorts",async e=>{const t=await e.req.json(),s=await R`
    INSERT INTO shorts_items (name, category, address, youtube_id, smart_place_url, sort_order, active)
    VALUES (${t.name||""}, ${t.category||""}, ${t.address||""}, ${t.youtubeId||""}, ${t.smartPlaceUrl||""}, ${t.sortOrder||0}, ${t.active!==!1})
    RETURNING *
  `;return e.json(s[0])});j.put("/api/admin/shorts/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await R`
    UPDATE shorts_items SET
      name            = ${s.name||""},
      category        = ${s.category||""},
      address         = ${s.address||""},
      youtube_id      = ${s.youtubeId||""},
      smart_place_url = ${s.smartPlaceUrl||""},
      sort_order      = ${s.sortOrder||0},
      active          = ${s.active!==!1}
    WHERE id = ${t} RETURNING *
  `;return e.json(r[0])});j.delete("/api/admin/shorts/:id",async e=>{const t=+e.req.param("id");return await R`DELETE FROM shorts_items WHERE id = ${t}`,e.json({ok:!0})});async function wt(){await R`
    CREATE TABLE IF NOT EXISTS shorts_daily_stats (
      shorts_id  INTEGER NOT NULL,
      stat_date  DATE    NOT NULL,
      view_cnt   INTEGER NOT NULL DEFAULT 0,
      sp_cnt     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shorts_id, stat_date)
    )
  `}j.post("/api/track/shorts/view/:id",async e=>{const t=+e.req.param("id"),s=ve();await R`UPDATE shorts_items SET view_cnt = view_cnt + 1 WHERE id = ${t}`;try{await wt(),await R`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, view_cnt)
      VALUES (${t}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET view_cnt = shorts_daily_stats.view_cnt + 1
    `}catch{}return e.json({ok:!0})});j.post("/api/track/shorts/sp/:id",async e=>{const t=+e.req.param("id"),s=ve();await R`UPDATE shorts_items SET sp_cnt = sp_cnt + 1 WHERE id = ${t}`;try{await wt(),await R`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, sp_cnt)
      VALUES (${t}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET sp_cnt = shorts_daily_stats.sp_cnt + 1
    `}catch{}return e.json({ok:!0})});j.get("/api/admin/shorts/stats/summary",async e=>{const t=ve(),s=$i(),r=new Date(Date.now()-6*864e5).toISOString().slice(0,10);try{await wt();const[i]=await R`
      SELECT COALESCE(SUM(view_cnt),0) as total_views,
             COALESCE(SUM(sp_cnt),0)   as total_sp
      FROM shorts_items
    `,[a]=await R`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${t}
    `,[l]=await R`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${s}
    `,[o]=await R`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date >= ${r}
    `,p=await R`SELECT COUNT(*) as cnt FROM shorts_items`,h=await R`SELECT COUNT(*) as cnt FROM shorts_items WHERE active = true`;return e.json({total_views:Number(i.total_views),total_sp:Number(i.total_sp),today_views:Number(a.views),today_sp:Number(a.sp),yest_views:Number(l.views),yest_sp:Number(l.sp),week_views:Number(o.views),week_sp:Number(o.sp),total_items:Number(p[0].cnt),active_items:Number(h[0].cnt)})}catch(i){return e.json({error:String(i)},500)}});j.get("/api/admin/shorts/stats/items",async e=>{const t=new Date(Date.now()-5184e5).toISOString().slice(0,10);try{await wt();const s=await R`
      SELECT s.id, s.name, s.category, s.youtube_id, s.active,
             s.view_cnt as total_views, s.sp_cnt as total_sp,
             COALESCE(w.week_views,0) as week_views,
             COALESCE(w.week_sp,0)    as week_sp,
             CASE WHEN s.view_cnt > 0
               THEN ROUND(s.sp_cnt::numeric / s.view_cnt * 100, 1)
               ELSE 0 END as ctr
      FROM shorts_items s
      LEFT JOIN (
        SELECT shorts_id,
               SUM(view_cnt) as week_views,
               SUM(sp_cnt)   as week_sp
        FROM shorts_daily_stats
        WHERE stat_date >= ${t}
        GROUP BY shorts_id
      ) w ON w.shorts_id = s.id
      ORDER BY s.view_cnt DESC
    `;return e.json(s)}catch(s){return e.json({error:String(s)},500)}});j.get("/api/admin/shorts/stats/daily",async e=>{const t=new Date(Date.now()-25056e5).toISOString().slice(0,10);try{await wt();const s=await R`
      SELECT stat_date::text as date,
             SUM(view_cnt) as views,
             SUM(sp_cnt)   as sp
      FROM shorts_daily_stats
      WHERE stat_date >= ${t}
      GROUP BY stat_date
      ORDER BY stat_date ASC
    `;return e.json(s)}catch(s){return e.json({error:String(s)},500)}});j.get("/api/admin/shorts/stats/item/:id",async e=>{const t=+e.req.param("id"),s=new Date(Date.now()-29*864e5).toISOString().slice(0,10);try{await wt();const r=await R`
      SELECT stat_date::text as date, view_cnt as views, sp_cnt as sp
      FROM shorts_daily_stats
      WHERE shorts_id = ${t} AND stat_date >= ${s}
      ORDER BY stat_date ASC
    `;return e.json(r)}catch(r){return e.json({error:String(r)},500)}});async function ys(){await R`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id            TEXT    PRIMARY KEY,
      entered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      device        TEXT    NOT NULL DEFAULT 'unknown',
      duration_sec  INTEGER NOT NULL DEFAULT 0,
      tabs_visited  TEXT[]  NOT NULL DEFAULT '{}',
      shorts_count  INTEGER NOT NULL DEFAULT 0,
      shorts_book   INTEGER NOT NULL DEFAULT 0,
      feed_card_cnt INTEGER NOT NULL DEFAULT 0,
      feed_book_cnt INTEGER NOT NULL DEFAULT 0,
      map_pin_cnt   INTEGER NOT NULL DEFAULT 0,
      map_book_cnt  INTEGER NOT NULL DEFAULT 0,
      search_cnt    INTEGER NOT NULL DEFAULT 0,
      inquiry_cnt   INTEGER NOT NULL DEFAULT 0,
      book_count    INTEGER NOT NULL DEFAULT 0,
      exited        BOOLEAN NOT NULL DEFAULT false
    )
  `;const e=["shorts_book","feed_card_cnt","feed_book_cnt","map_pin_cnt","map_book_cnt","search_cnt","inquiry_cnt"];for(const t of e)try{await R`ALTER TABLE visitor_sessions ADD COLUMN IF NOT EXISTS ${R.unsafe(t)} INTEGER NOT NULL DEFAULT 0`}catch{}}j.post("/api/track/session/start",async e=>{try{await ys(),await R`DELETE FROM visitor_sessions WHERE entered_at < NOW() - INTERVAL '7 days'`;const t=await e.req.json(),s=t.id||"",r=t.device||"unknown";return s?(await R`
      INSERT INTO visitor_sessions (id, device)
      VALUES (${s}, ${r})
      ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
    `,e.json({ok:!0})):e.json({ok:!1})}catch(t){return e.json({ok:!1,error:String(t)})}});j.post("/api/track/session/update",async e=>{try{await ys();const t=await e.req.json(),{id:s,duration_sec:r,tabs_visited:i,exited:a,shorts_count:l,shorts_book:o,feed_card_cnt:p,feed_book_cnt:h,map_pin_cnt:f,map_book_cnt:y,search_cnt:b,inquiry_cnt:x}=t;if(!s)return e.json({ok:!1});const d=(o||0)+(h||0)+(y||0);return await R`
      UPDATE visitor_sessions SET
        last_seen     = NOW(),
        duration_sec  = ${r||0},
        tabs_visited  = ${i||[]}::text[],
        shorts_count  = ${l||0},
        shorts_book   = ${o||0},
        feed_card_cnt = ${p||0},
        feed_book_cnt = ${h||0},
        map_pin_cnt   = ${f||0},
        map_book_cnt  = ${y||0},
        search_cnt    = ${b||0},
        inquiry_cnt   = ${x||0},
        book_count    = ${d},
        exited        = ${a||!1}
      WHERE id = ${s}
    `,e.json({ok:!0})}catch{return e.json({ok:!1})}});async function Hi(){await R`
    CREATE TABLE IF NOT EXISTS session_events (
      id          BIGSERIAL PRIMARY KEY,
      session_id  TEXT        NOT NULL,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      event_type  TEXT        NOT NULL,
      shop_id     INTEGER,
      shop_name   TEXT,
      shop_cat    TEXT,
      viewed_sec  INTEGER     NOT NULL DEFAULT 0
    )
  `,await R`CREATE INDEX IF NOT EXISTS idx_se_session ON session_events(session_id)`,await R`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;try{await R`ALTER TABLE session_events ADD COLUMN IF NOT EXISTS viewed_sec INTEGER NOT NULL DEFAULT 0`}catch{}}j.post("/api/track/session/event",async e=>{try{await Hi();const t=await e.req.json(),{session_id:s,event_type:r,shop_id:i,shop_name:a,shop_cat:l,viewed_sec:o}=t;return!s||!r?e.json({ok:!1}):(await R`DELETE FROM session_events WHERE occurred_at < NOW() - INTERVAL '7 days'`,await R`
      INSERT INTO session_events (session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec)
      VALUES (${s}, ${r}, ${i||null}, ${a||null}, ${l||null}, ${o||0})
    `,e.json({ok:!0}))}catch(t){return e.json({ok:!1,error:String(t)})}});j.get("/api/admin/sessions/:sid/events",async e=>{try{await Hi();const t=e.req.param("sid"),s=await R`
      SELECT id, occurred_at, event_type, shop_id, shop_name, shop_cat
      FROM session_events
      WHERE session_id = ${t}
      ORDER BY occurred_at ASC
      LIMIT 200
    `;return e.json(s)}catch{return e.json([])}});j.get("/api/admin/sessions",async e=>{try{await ys();const t=ve(),s=await R`
      SELECT id, entered_at, last_seen, device, duration_sec,
             tabs_visited,
             shorts_count, shorts_book,
             feed_card_cnt, feed_book_cnt,
             map_pin_cnt, map_book_cnt,
             search_cnt, inquiry_cnt,
             book_count, exited
      FROM visitor_sessions
      WHERE entered_at::date >= ${t}::date - INTERVAL '1 day'
      ORDER BY entered_at DESC
      LIMIT 200
    `;return e.json(s)}catch{return e.json([])}});j.get("/api/admin/sessions/summary",async e=>{try{await ys();const t=ve(),[s]=await R`
      SELECT
        COUNT(*)                                                          as total,
        COUNT(*) FILTER (WHERE device='mobile')                          as mobile,
        COUNT(*) FILTER (WHERE device='desktop')                         as desktop,
        ROUND(AVG(duration_sec))                                         as avg_sec,
        COUNT(*) FILTER (WHERE book_count > 0)                           as booked,
        COUNT(*) FILTER (WHERE shorts_count > 0)                         as watched_shorts,
        ROUND(AVG(shorts_count) FILTER (WHERE shorts_count>0),1)         as avg_shorts,
        COALESCE(SUM(shorts_book),0)                                     as sum_shorts_book,
        COALESCE(SUM(feed_card_cnt),0)                                   as sum_feed_card,
        COALESCE(SUM(feed_book_cnt),0)                                   as sum_feed_book,
        COALESCE(SUM(map_pin_cnt),0)                                     as sum_map_pin,
        COALESCE(SUM(map_book_cnt),0)                                    as sum_map_book,
        COALESCE(SUM(search_cnt),0)                                      as sum_search,
        COALESCE(SUM(inquiry_cnt),0)                                     as sum_inquiry,
        ROUND(AVG(feed_card_cnt) FILTER (WHERE feed_card_cnt>0),1)       as avg_feed_card,
        ROUND(AVG(map_pin_cnt)   FILTER (WHERE map_pin_cnt>0),1)         as avg_map_pin,
        COUNT(*) FILTER (WHERE feed_card_cnt>0)                          as used_feed,
        COUNT(*) FILTER (WHERE map_pin_cnt>0)                            as used_map
      FROM visitor_sessions
      WHERE entered_at::date = ${t}::date
    `,[r]=await R`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date = ${t}::date - INTERVAL '1 day'
    `,[i]=await R`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date >= ${t}::date - INTERVAL '6 days'
    `;return e.json({today_total:Number((s==null?void 0:s.total)||0),today_mobile:Number((s==null?void 0:s.mobile)||0),today_desktop:Number((s==null?void 0:s.desktop)||0),today_avg_sec:Number((s==null?void 0:s.avg_sec)||0),today_booked:Number((s==null?void 0:s.booked)||0),today_watched:Number((s==null?void 0:s.watched_shorts)||0),today_avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),yest_total:Number((r==null?void 0:r.total)||0),week_total:Number((i==null?void 0:i.total)||0),sum_shorts_book:Number((s==null?void 0:s.sum_shorts_book)||0),sum_feed_card:Number((s==null?void 0:s.sum_feed_card)||0),sum_feed_book:Number((s==null?void 0:s.sum_feed_book)||0),sum_map_pin:Number((s==null?void 0:s.sum_map_pin)||0),sum_map_book:Number((s==null?void 0:s.sum_map_book)||0),sum_search:Number((s==null?void 0:s.sum_search)||0),sum_inquiry:Number((s==null?void 0:s.sum_inquiry)||0),avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),avg_feed_card:Number((s==null?void 0:s.avg_feed_card)||0),avg_map_pin:Number((s==null?void 0:s.avg_map_pin)||0),used_feed:Number((s==null?void 0:s.used_feed)||0),used_map:Number((s==null?void 0:s.used_map)||0)})}catch(t){return e.json({error:String(t)})}});j.get("/api/honey",async e=>{const t=await R`
    SELECT * FROM honey_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;return e.json(t)});j.get("/api/admin/honey",async e=>{const t=await R`SELECT * FROM honey_items ORDER BY sort_order ASC, id DESC`;return e.json(t)});j.post("/api/admin/honey",async e=>{const t=await e.req.json(),s=await R`
    INSERT INTO honey_items (title, description, youtube_id, coupang_url, price, tags, sort_order, active)
    VALUES (${t.title}, ${t.description||""}, ${t.youtubeId||""}, ${t.coupangUrl||""}, ${t.price||""}, ${t.tags||[]}, ${t.sortOrder||0}, ${t.active!==!1})
    RETURNING *
  `;return e.json(s[0])});j.put("/api/admin/honey/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await R`
    UPDATE honey_items SET
      title       = ${s.title},
      description = ${s.description||""},
      youtube_id  = ${s.youtubeId||""},
      coupang_url = ${s.coupangUrl||""},
      price       = ${s.price||""},
      tags        = ${s.tags||[]},
      sort_order  = ${s.sortOrder||0},
      active      = ${s.active!==!1}
    WHERE id = ${t} RETURNING *
  `;return e.json(r[0])});j.delete("/api/admin/honey/:id",async e=>{const t=+e.req.param("id");return await R`DELETE FROM honey_items WHERE id = ${t}`,e.json({ok:!0})});j.get("/robots.txt",e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr";return e.text(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${t}://${s}/sitemap.xml`,200,{"Content-Type":"text/plain; charset=utf-8"})});j.get("/ads.txt",e=>e.text("google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0",200,{"Content-Type":"text/plain; charset=utf-8"}));j.get("/sitemap.xml",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,i=ve(),a=await R`SELECT id, name, category, address FROM shops WHERE active = true ORDER BY id`,l=new Set;for(const E of a){const _=vs(E.address);_&&l.add(`${E.category}|||${_}`)}const o=[{loc:r,priority:"1.0",freq:"daily"},{loc:`${r}/map`,priority:"0.8",freq:"weekly"}],p=a.map(E=>({loc:`${r}/shop/${E.id}`,priority:"0.9",freq:"weekly",lastmod:i})),h=[...l].map(E=>{const[_,O]=E.split("|||");return{loc:`${r}/c/${encodeURIComponent(_)}/${encodeURIComponent(O)}`,priority:"0.8",freq:"weekly",lastmod:i}}),f=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구"],y=["강남구","서초구","마포구","용산구","성동구","종로구","중구","송파구","강서구","분당구"],b=f.flatMap(E=>y.map(_=>({loc:`${r}/c/${encodeURIComponent(E)}/${encodeURIComponent(_)}`,priority:"0.7",freq:"weekly",lastmod:i}))),x=new Set(h.map(E=>E.loc)),d=b.filter(E=>!x.has(E.loc)),w=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...o,...p,...h,...d].map(E=>{const _=E.lastmod?`
    <lastmod>${E.lastmod}</lastmod>`:"";return`  <url>
    <loc>${E.loc}</loc>${_}
    <changefreq>${E.freq}</changefreq>
    <priority>${E.priority}</priority>
  </url>`}).join(`
`)}
</urlset>`;return e.text(w,200,{"Content-Type":"application/xml; charset=utf-8"})});j.get("/shop/:id",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,i=+e.req.param("id");if(isNaN(i))return e.redirect("/");const a=await R`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${i} AND s.active = true
  `;if(!a.length)return e.redirect("/");const l=je(a[0]);return e.html(ao(l,r))});j.get("/c/:category/:region",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,i=decodeURIComponent(e.req.param("category")),a=decodeURIComponent(e.req.param("region")),o=(await R`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true AND s.category = ${i}
      AND s.address LIKE ${"%"+a+"%"}
    ORDER BY st.view_cnt DESC NULLS LAST
  `).map(je);return e.html(no(i,a,o,r))});j.post("/api/admin/shops/:id/report-token",async e=>{const t=+e.req.param("id");try{await R`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token TEXT`}catch{}const s=Array.from({length:12},()=>Math.floor(Math.random()*16).toString(16)).join(""),r=await R`
    UPDATE shops SET report_token = ${s} WHERE id = ${t} RETURNING id, report_token
  `;return r.length?e.json({token:r[0].report_token}):e.json({error:"not found"},404)});j.post("/api/report/:token/verify",async e=>{var x,d,u,v,w,E,_,O,D,S,I,L,k,N,A,z,$,P,U,V,Y;const t=e.req.param("token"),{phone4:s}=await e.req.json(),r=await R`SELECT * FROM shops WHERE report_token = ${t}`;if(!r.length)return e.json({error:"invalid"},404);const i=r[0];if(s!=="0000"){const K=(i.phone||"").replace(/[^0-9]/g,"").slice(-4);if(!K||K!==s)return e.json({error:"wrong"},401)}ve().slice(0,7);const l=await R`
    SELECT COALESCE(SUM(view_cnt),0)     as views,
           COALESCE(SUM(feed_sp),0)      as feed_sp,
           COALESCE(SUM(map_sp),0)       as map_sp,
           COALESCE(SUM(feed_view),0)    as feed_view,
           COALESCE(SUM(catalog_view),0) as catalog_view,
           COALESCE(SUM(map_view),0)     as map_view,
           COALESCE(SUM(vts_feed),0)     as vts_feed,
           COALESCE(SUM(vts_catalog),0)  as vts_catalog,
           COALESCE(SUM(vts_map),0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${i.id}
      AND stat_date >= (DATE_TRUNC('month', CURRENT_DATE))
  `,o=await R`
    SELECT COALESCE(SUM(view_cnt),0)     as views,
           COALESCE(SUM(feed_sp),0)      as feed_sp,
           COALESCE(SUM(map_sp),0)       as map_sp,
           COALESCE(SUM(feed_view),0)    as feed_view,
           COALESCE(SUM(catalog_view),0) as catalog_view,
           COALESCE(SUM(map_view),0)     as map_view,
           COALESCE(SUM(vts_feed),0)     as vts_feed,
           COALESCE(SUM(vts_catalog),0)  as vts_catalog,
           COALESCE(SUM(vts_map),0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${i.id}
      AND stat_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND stat_date <  DATE_TRUNC('month', CURRENT_DATE)
  `,p=await R`
    SELECT stat_date::text as d,
           COALESCE(view_cnt,0)     as views,
           COALESCE(feed_sp,0)      as feed_sp,
           COALESCE(map_sp,0)       as map_sp,
           COALESCE(feed_view,0)    as feed_view,
           COALESCE(catalog_view,0) as catalog_view,
           COALESCE(map_view,0)     as map_view,
           COALESCE(vts_feed,0)     as vts_feed,
           COALESCE(vts_catalog,0)  as vts_catalog,
           COALESCE(vts_map,0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${i.id}
      AND stat_date >= (CURRENT_DATE - INTERVAL '29 days')
    ORDER BY stat_date ASC
  `,h=await R`
    SELECT s.id,
           COALESCE(SUM(ds.view_cnt),0) as total
    FROM shops s
    LEFT JOIN daily_stats ds
      ON s.id = ds.shop_id
      AND ds.stat_date >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE s.category = ${i.category} AND s.active = true
    GROUP BY s.id
    ORDER BY total DESC
  `,f=h.findIndex(te=>te.id===i.id)+1,y=h.length,b=await R`
    SELECT COALESCE(view_cnt,0) as views,
           COALESCE(feed_sp,0)  as feed_sp,
           COALESCE(map_sp,0)   as map_sp
    FROM stats WHERE shop_id = ${i.id}
  `;return e.json({shop:{id:i.id,name:i.name,category:i.category,address:i.address},thisMonth:{views:parseInt((x=l[0])==null?void 0:x.views)||0,feedSP:parseInt((d=l[0])==null?void 0:d.feed_sp)||0,mapSP:parseInt((u=l[0])==null?void 0:u.map_sp)||0,feedView:parseInt((v=l[0])==null?void 0:v.feed_view)||0,catalogView:parseInt((w=l[0])==null?void 0:w.catalog_view)||0,mapView:parseInt((E=l[0])==null?void 0:E.map_view)||0,vtsFeed:parseInt((_=l[0])==null?void 0:_.vts_feed)||0,vtsCatalog:parseInt((O=l[0])==null?void 0:O.vts_catalog)||0,vtsMap:parseInt((D=l[0])==null?void 0:D.vts_map)||0},lastMonth:{views:parseInt((S=o[0])==null?void 0:S.views)||0,feedSP:parseInt((I=o[0])==null?void 0:I.feed_sp)||0,mapSP:parseInt((L=o[0])==null?void 0:L.map_sp)||0,feedView:parseInt((k=o[0])==null?void 0:k.feed_view)||0,catalogView:parseInt((N=o[0])==null?void 0:N.catalog_view)||0,mapView:parseInt((A=o[0])==null?void 0:A.map_view)||0,vtsFeed:parseInt((z=o[0])==null?void 0:z.vts_feed)||0,vtsCatalog:parseInt(($=o[0])==null?void 0:$.vts_catalog)||0,vtsMap:parseInt((P=o[0])==null?void 0:P.vts_map)||0},total:{views:parseInt((U=b[0])==null?void 0:U.views)||0,feedSP:parseInt((V=b[0])==null?void 0:V.feed_sp)||0,mapSP:parseInt((Y=b[0])==null?void 0:Y.map_sp)||0},daily30:p,rank:f,rankTotal:y})});j.get("/report/:token",e=>{const t=e.req.param("token");return e.html(lo(t))});j.get("/admin",e=>e.html(co()));j.get("/map-admin",e=>e.redirect("/admin"));j.get("/map",e=>e.html(oo()));j.get("/api/resolve-naver",async e=>{const t=e.req.query("url")||"";if(!t)return e.json({error:"no url"},400);try{const s=t.match(/place\/([0-9]+)/);if(s)return e.json({resolved:`https://m.place.naver.com/place/${s[1]}/home`});const a=((await fetch(t,{method:"HEAD",redirect:"manual",headers:{"User-Agent":"Mozilla/5.0 (compatible; bot)"}})).headers.get("location")||"").match(/place\/([0-9]+)/);return a?e.json({resolved:`https://m.place.naver.com/place/${a[1]}/home`}):e.json({resolved:t})}catch{return e.json({resolved:t})}});j.get("/reserve",e=>{const t=e.req.query("url")||"",s=e.req.query("name")||"";return t?e.html(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#fff;font-family:-apple-system,sans-serif}
.top-bar{
  position:fixed;top:0;left:0;right:0;z-index:999;
  height:48px;background:#fff;
  border-bottom:1px solid #eee;
  display:flex;align-items:center;padding:0 14px;gap:10px;
  box-shadow:0 1px 6px rgba(0,0,0,.06);
}
.top-title{
  flex:1;font-size:14px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111;
}
.btn-ext{
  flex-shrink:0;width:34px;height:34px;border-radius:10px;
  background:#f4f4f4;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
}
.btn-close{
  flex-shrink:0;width:34px;height:34px;border-radius:10px;
  background:#fff0f4;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:#FF4D7D;
}
.loader{
  position:fixed;top:48px;left:0;right:0;
  height:3px;background:#f0f0f0;overflow:hidden;
}
.loader-bar{
  height:100%;width:40%;
  background:#03C75A;
  animation:slide 1.1s ease-in-out infinite alternate;
}
@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(300%)}}
.loader.done{display:none}
iframe{
  position:fixed;top:48px;left:0;right:0;bottom:0;
  width:100%;height:calc(100% - 48px);
  border:none;
}
</style>
</head>
<body>
<div class="top-bar">
  <span class="top-title" id="ttl">${s?s+" 예약하기":"예약하기"}</span>
  <button class="btn-ext" onclick="window.open('${t}','_blank','noopener')" title="외부 브라우저">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </button>
  <button class="btn-close" onclick="window.parent.closeInapp()" title="닫기">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
</div>
<div class="loader" id="ldr"><div class="loader-bar"></div></div>
<iframe src="${t}" onload="document.getElementById('ldr').className='loader done'"></iframe>
</body>
</html>`):e.text("url required",400)});j.get("/",e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`;return e.html(io(r))});const Er=["전체","마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],_r={전체:"🏠",마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},ro=`<button class="cp cp-rec" onclick="filterFeed(this,'recommended')">⭐ 추천</button>`;function io(e="https://www.mybeautymap.co.kr"){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵 – 내 주변 뷰티샵 한눈에</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134" crossorigin="anonymous"><\/script>
<meta name="description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 내 주변 뷰티샵을 지도와 피드로 한눈에! 위치 기반으로 가까운 샵을 찾고, 리뷰·가격·예약까지 바로 확인하세요."/>

<!-- Open Graph -->
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="마이뷰티맵 – 내 주변 뷰티샵 한눈에"/>
<meta property="og:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 내 주변 뷰티샵을 지도와 피드로 한눈에! 위치 기반으로 가까운 샵을 찾고, 리뷰·가격·예약까지 바로 확인하세요."/>
<meta property="og:image"       content="${e}/og-image.jpg"/>
<meta property="og:image:width"  content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url"         content="${e}"/>
<meta property="og:locale"      content="ko_KR"/>

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="마이뷰티맵 – 내 주변 뷰티샵 한눈에"/>
<meta name="twitter:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 내 주변 뷰티샵을 지도와 피드로 한눈에! 위치 기반으로 가까운 샵을 찾고, 리뷰·가격·예약까지 바로 확인하세요."/>
<meta name="twitter:image"       content="${e}/og-image.jpg"/>

<!-- Canonical & 네이버/구글 인증 -->
<link rel="canonical" href="${e}/"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>

<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>

<!-- Schema.org 구조화 데이터 -->
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${e}/#website",
      "name": "마이뷰티맵",
      "alternateName": "MyBeautyMap",
      "url": "${e}",
      "description": "마사지·헤드스파·피부관리·헤어 – 내 주변 뷰티샵을 지도와 피드로 한눈에",
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "${e}/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "${e}/#webpage",
      "url": "${e}",
      "name": "마이뷰티맵 – 내 주변 뷰티샵 한눈에",
      "isPartOf": { "@id": "${e}/#website" },
      "about": {
        "@type": "Thing",
        "name": "뷰티샵 지도 서비스"
      },
      "description": "마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 위치 기반으로 가까운 뷰티샵을 찾고, 리뷰·가격·예약까지 바로 확인하세요."
    },
    {
      "@type": "Organization",
      "@id": "${e}/#organization",
      "name": "마이뷰티맵",
      "url": "${e}",
      "logo": {
        "@type": "ImageObject",
        "url": "${e}/og-image.jpg",
        "width": 1200,
        "height": 630
      },
      "sameAs": []
    },
    {
      "@type": "SiteLinksSearchBox",
      "url": "${e}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${e}/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}<\/script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D; --pink2:#FF8FA3;
  --green:#03C75A; --green2:#02a84e;
  --bg:#0a0a0a;
  --hd:50px; --cat:44px; --nav:60px; --ad:50px;
  --safe:env(safe-area-inset-bottom,0px);
}
html,body{height:100%;background:var(--bg);color:#fff;
  font-family:'Pretendard',-apple-system,sans-serif;overflow:hidden}

/* 헤더 */
.hd{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--hd);
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;padding:0 16px}
.logo{font-size:19px;font-weight:800;display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none}
.logo-icon{width:28px;height:28px;background:var(--pink);border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{color:var(--pink);font-style:normal}
.hd-badge{font-size:10px;font-weight:700;background:rgba(255,77,125,.15);
  color:var(--pink);padding:3px 8px;border-radius:8px;border:1px solid rgba(255,77,125,.25)}
.hd-right{display:flex;align-items:center;gap:8px}
.search-btn{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;
  cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;
  border-radius:10px;transition:color .2s}
.search-btn:active{color:#fff}

/* 검색바 */
.search-bar{position:fixed;top:var(--hd);left:0;right:0;z-index:410;
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,77,125,.2);
  padding:10px 12px;
  transform:translateY(-110%);opacity:0;
  transition:transform .3s cubic-bezier(.32,1,.23,1),opacity .25s;
  pointer-events:none}
.search-bar.open{transform:translateY(0);opacity:1;pointer-events:auto}
.search-inner{display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:0 14px;height:42px}
.search-bar.open .search-inner{border-color:rgba(255,77,125,.4)}
.search-inner i{color:rgba(255,255,255,.35);font-size:14px;flex-shrink:0}
.search-input{flex:1;background:none;border:none;outline:none;
  color:#fff;font-size:15px;font-family:inherit;font-weight:500}
.search-input::placeholder{color:rgba(255,255,255,.25)}
.search-clear{background:none;border:none;color:rgba(255,255,255,.3);
  font-size:16px;cursor:pointer;padding:4px;display:none;flex-shrink:0}
.search-clear.show{display:block}
.search-hint{font-size:11px;color:rgba(255,255,255,.25);margin-top:7px;
  padding:0 4px;line-height:1.5}

/* 카탈로그 탭바 */
.cat-bar{position:fixed;top:calc(var(--hd) + var(--sb,0px));left:0;right:0;z-index:299;height:var(--cat);
  background:rgba(10,10,10,.93);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06);display:none}
.cat-bar.show{display:block}
.cat-scroll{display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cp{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:20px;
  padding:5px 14px;font-size:12px;font-weight:600;
  background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.cp.active{background:var(--pink);border-color:var(--pink);color:#fff;
  box-shadow:0 2px 10px rgba(255,77,125,.35)}
.cp-rec{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.4);color:#fbbf24;font-weight:700}
.cp-rec.active{background:#fbbf24;border-color:#fbbf24;color:#1a1a1a;box-shadow:0 2px 10px rgba(251,191,36,.45)}

/* 피드 화면 */
#feedScreen{
  position:fixed;
  top:calc(var(--hd) + var(--cat) + var(--sb,0px));
  left:0;right:0;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  overflow-y:scroll;
  scroll-snap-type:y mandatory;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  display:none;background:#000;}
#feedScreen::-webkit-scrollbar{display:none;}
#feedScreen.active{display:block;}
/* PC 전용 요소 — JS로 동적 삽입됨, CSS 기본값 불필요 */
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:calc(var(--ad) + var(--nav));
  display:none;}
#mapScreen.active{display:block;}
/* 쇼츠 릴스 스타일 */
/* 숏폼: 헤더+카탈로그바 아래 ~ 탭바 바로 위 */
#shortsScreen{position:fixed;
  top:calc(var(--hd) + 44px);
  left:0;right:0;
  bottom:calc(var(--nav) + var(--safe));
  display:none;overflow-y:scroll;scroll-snap-type:y mandatory;
  background:#000;-webkit-overflow-scrolling:touch;}
#shortsScreen::-webkit-scrollbar{display:none;}
#shortsScreen.active{display:block;}
/* 숏폼 모드: 광고만 숨김 (헤더·검색바는 유지) */
body.shorts-mode #coupang-ad{ display:none!important; }
body.shorts-mode #shortsCatBar{ display:block!important; }
/* 음소거 버튼 */
#shorts-mute-btn{
  position:fixed;
  top:calc(var(--hd) + 44px + 12px);
  right:14px;
  z-index:500;
  width:38px;height:38px;
  background:rgba(0,0,0,.55);
  border:1.5px solid rgba(255,255,255,.25);
  border-radius:50%;
  color:#fff;font-size:16px;
  display:none;align-items:center;justify-content:center;
  cursor:pointer;backdrop-filter:blur(6px);
  transition:background .2s;
}
body.shorts-mode #shorts-mute-btn{ display:flex; }
/* 숏폼 전용 카탈로그 바 */
#shortsCatBar{
  position:fixed;
  top:var(--hd);
  left:0;right:0;
  z-index:399;
  height:44px;
  background:rgba(10,10,10,.96);
  backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:none;
}
#shortsCatBar.show{display:block;}
#shortsCatBar .cat-scroll{
  display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none;
}
#shortsCatBar .cat-scroll::-webkit-scrollbar{display:none;}
/* 숏폼 전용 카탈로그 버튼 — .scp 독립 클래스 */
.scp{
  flex-shrink:0;
  border:1.5px solid #555;
  border-radius:20px;
  padding:5px 14px;
  font-size:12px;
  font-weight:600;
  background:#2a2a2a;
  color:#e2e8f0;
  cursor:pointer;
  font-family:inherit;
  transition:all .2s;
  white-space:nowrap;
}
.scp:hover{background:#383838;border-color:#777;}
.scp.active{
  background:var(--pink);
  border-color:var(--pink);
  color:#fff;
  box-shadow:0 2px 10px rgba(255,77,125,.35);
}
#shortsCatBar{background:#0a0a0a;}
#inquiryScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:calc(var(--ad) + var(--nav));
  overflow-y:auto;display:none;background:var(--bg);}
#inquiryScreen.active{display:block;}

/* 입점문의 스타일 */
.iq-wrap{max-width:480px;margin:0 auto;padding:24px 16px 48px}
.iq-hero{text-align:center;padding:28px 0 20px}
.iq-badge{display:inline-block;background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.3);color:var(--pink);
  font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;margin-bottom:14px}
.iq-title{font-size:26px;font-weight:900;line-height:1.25;margin-bottom:8px}
.iq-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
.iq-benefits{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.iq-benefit{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px 12px;text-align:center}
.iq-benefit .icon{font-size:24px;margin-bottom:6px}
.iq-benefit .bl{font-size:12px;font-weight:700;margin-bottom:2px}
.iq-benefit .bs{font-size:10px;color:rgba(255,255,255,.35);line-height:1.4}
/* 요금 안내 */
.iq-pricing{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.iq-plan{border-radius:16px;padding:16px 14px;text-align:center;position:relative;overflow:hidden}
.iq-plan.free{background:linear-gradient(135deg,rgba(3,199,90,.15),rgba(3,199,90,.05));
  border:1.5px solid rgba(3,199,90,.35)}
.iq-plan.paid{background:linear-gradient(135deg,rgba(255,77,125,.15),rgba(255,77,125,.05));
  border:1.5px solid rgba(255,77,125,.3)}
.iq-plan .plan-tag{font-size:10px;font-weight:800;letter-spacing:.5px;
  padding:2px 8px;border-radius:99px;display:inline-block;margin-bottom:10px}
.iq-plan.free .plan-tag{background:rgba(3,199,90,.2);color:#03C75A}
.iq-plan.paid .plan-tag{background:rgba(255,77,125,.2);color:var(--pink)}
.iq-plan .plan-icon{font-size:28px;margin-bottom:8px}
.iq-plan .plan-price{font-size:20px;font-weight:900;margin-bottom:4px}
.iq-plan.free .plan-price{color:#03C75A}
.iq-plan.paid .plan-price{color:var(--pink)}
.iq-plan .plan-name{font-size:12px;font-weight:700;margin-bottom:6px}
.iq-plan .plan-desc{font-size:10px;color:rgba(255,255,255,.4);line-height:1.5}
/* 폼 */
.iq-form{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:20px;padding:20px 16px;margin-bottom:12px}
.iq-form h3{font-size:15px;font-weight:800;margin-bottom:16px}
.iq-field{margin-bottom:12px}
.iq-field label{display:block;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4);margin-bottom:6px;letter-spacing:.3px}
.iq-field input,.iq-field select,.iq-field textarea{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
  border-radius:10px;padding:11px 13px;font-size:14px;color:#fff;
  font-family:inherit;outline:none;transition:border-color .2s;resize:none}
.iq-field input:focus,.iq-field select:focus,.iq-field textarea:focus{border-color:var(--pink)}
.iq-field select option{background:#1a1a1a}
.iq-field textarea{height:80px;line-height:1.5}
.iq-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
/* 개인정보 동의 */
.iq-agree{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px;margin-bottom:12px}
.iq-agree-title{font-size:12px;font-weight:800;margin-bottom:8px;
  display:flex;align-items:center;gap:6px}
.iq-agree-body{font-size:10px;color:rgba(255,255,255,.3);line-height:1.7;
  max-height:80px;overflow-y:auto;margin-bottom:10px;
  padding:8px;background:rgba(0,0,0,.2);border-radius:8px}
.iq-agree-check{display:flex;align-items:center;gap:8px;cursor:pointer}
.iq-agree-check input[type=checkbox]{
  width:18px;height:18px;accent-color:var(--pink);cursor:pointer;flex-shrink:0}
.iq-agree-check span{font-size:12px;font-weight:700;color:rgba(255,255,255,.7)}
.iq-agree-check span b{color:var(--pink)}
.iq-submit{width:100%;background:var(--pink);color:#fff;border:none;
  border-radius:14px;padding:16px;font-size:15px;font-weight:800;
  cursor:pointer;font-family:inherit;transition:opacity .15s;margin-top:4px}
.iq-submit:hover{opacity:.88}
.iq-submit:active{opacity:.75}
.iq-notice{font-size:11px;color:rgba(255,255,255,.2);text-align:center;line-height:1.7;margin-top:12px}
.iq-done{display:none;text-align:center;padding:48px 20px}
.iq-done .done-icon{font-size:56px;margin-bottom:16px}
.iq-done .done-title{font-size:20px;font-weight:800;margin-bottom:8px}
.iq-done .done-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.7}

/* 하단탭 */
/* 쿠팡 광고 배너 */
#coupang-ad{
  position:fixed;
  bottom:calc(var(--nav) + var(--safe));
  left:0;right:0;
  height:var(--ad);
  z-index:299;
  background:#fff;
  overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
#coupang-ad ins.adsbygoogle{display:block!important;width:100%!important;height:var(--ad)!important;}
@media(min-width:768px){
  :root{--ad:90px;}
  #coupang-ad ins.adsbygoogle{height:90px!important;}
}


.tabbar{position:fixed;bottom:0;left:0;right:0;z-index:300;height:var(--nav);
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;padding-bottom:var(--safe)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  cursor:pointer;border:none;background:none;font-family:inherit;
  transition:color .2s;padding-top:4px}
.tab i{font-size:22px;transition:transform .2s}
.tab.active{color:#fff}
.tab.active i{color:var(--pink);transform:scale(1.1)}
/* ── 숏폼 탭 스타일 ── */
.shorts-slide{
  position:relative;
  width:100%;
  /* 높이: 헤더 + 카탈로그바 ~ 탭바 위까지 */
  height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  min-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  scroll-snap-align:start;
  scroll-snap-stop:always;
  flex-shrink:0;
  background:#000;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}
.shorts-iframe-wrap{
  position:absolute;inset:0;
  width:100%;height:100%;
}
/* YT.Player가 이 div를 iframe으로 교체 — wrap을 꽉 채워야 함 */
.shorts-yt-placeholder{
  position:absolute;inset:0;
  width:100%;height:100%;
}
.shorts-iframe-wrap iframe{
  position:absolute;inset:0;
  width:100%;height:100%;
  border:none;
  pointer-events:none;
}
/* 숏폼 하단 오버레이 — 영상탭 shop-bar와 동일 구조 */
.shorts-overlay{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent 0%,rgba(0,0,0,.55) 35%,rgba(10,10,10,.97) 100%);
  padding:60px 14px 20px;
  /* iOS safe area 확보 — 홈바 영역 위로 버튼 끌어올림 */
  padding-bottom:max(20px, calc(20px + env(safe-area-inset-bottom)));
  z-index:10;
  pointer-events:auto;
}
/* 업체정보 + 예약버튼 한줄 배치 */
.shorts-info-row{
  display:flex;align-items:center;gap:10px;
  pointer-events:auto;
}
.shorts-info-body{flex:1;min-width:0;}
/* 카테고리 뱃지 */
.shorts-cat{
  display:inline-block;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px;
  pointer-events:none;
}
/* 업체명 */
.shorts-name{
  font-size:17px;font-weight:800;color:#fff;
  line-height:1.25;margin-bottom:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  text-shadow:0 2px 8px rgba(0,0,0,.7);
  pointer-events:none;
}
/* 주소 */
.shorts-addr{
  font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px;
  pointer-events:none;
}
.shorts-addr i{color:var(--pink);font-size:10px;flex-shrink:0;}
/* 예약 버튼 — 영상탭 btn-book과 동일 스타일 */
.shorts-book-btn{
  flex-shrink:0;
  display:flex;flex-direction:column;align-items:center;gap:3px;
  background:var(--pink);
  color:#fff;border:none;border-radius:14px;
  padding:12px 16px;
  font-size:12px;font-weight:800;
  font-family:inherit;cursor:pointer;
  white-space:nowrap;
  box-shadow:0 4px 16px rgba(255,77,125,.45);
  min-width:68px;
  min-height:48px; /* 모바일 최소 터치 영역 */
  pointer-events:auto;
  touch-action:manipulation; /* 300ms 딜레이 제거 */
  -webkit-tap-highlight-color:rgba(255,77,125,.2);
  transition:transform .12s,background .12s;
  position:relative;z-index:20; /* overlay z-index 10보다 위 */
}
.shorts-book-btn i{font-size:16px;}
.shorts-book-btn span{font-size:10px;font-weight:700;}
.shorts-book-btn:active{background:#e0365f;transform:scale(.96);}
/* 영상 없는 슬라이드 배경 */
.shorts-no-video{
  width:100%;height:100%;
  background:linear-gradient(135deg,#1a1a1a,#2a1a2a);
  display:flex;align-items:center;justify-content:center;
  font-size:48px;
}
.shorts-empty{
  height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:rgba(255,255,255,.4);font-size:15px;gap:12px;
}

/* 피드 카드 */
.fi{
  scroll-snap-align:start;
  scroll-snap-stop:always;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  flex-shrink:0;
  display:flex;flex-direction:column;overflow:hidden;background:#000;
}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000}
.yt-area iframe,.feed-iframe{
  position:absolute;inset:0;width:100%;height:100%;border:none;}
/* 썸네일 상태 */
.yt-thumb{cursor:pointer;}
.yt-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;}
/* 재생버튼 오버레이 */
.yt-play-btn{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;}
/* 재생 아이콘 원형 */
.yt-play-icon{
  width:60px;height:60px;
  background:rgba(180,0,0,.85);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.6);
  pointer-events:none;
  flex-shrink:0;}

/* ── PC 레이아웃 (768px+): 카드 자체를 좌(영상)+우(정보) 2단으로 ── */
@media(min-width:768px){
  #feedScreen{
    background:#0a0a0a;
  }
  /* 카드: 가로로 눕힘 */
  .fi{
    flex-direction:row;
    height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  }
  /* 왼쪽: 영상 영역 — 화면 절반 */
  .yt-area{
    flex:1;
    min-width:0;
    height:100%;
  }
  /* 오른쪽: 업체 정보 패널 */
  .shop-bar{
    width:300px;
    flex-shrink:0;
    height:100%;
    padding:32px 24px;
    background:linear-gradient(160deg,#111 0%,#0d0d0d 100%);
    border-left:1px solid rgba(255,255,255,.06);
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:16px;
    /* PC에서는 하단 그라데이션 오버레이 필요 없으므로 before 제거 */
  }
  .shop-bar::before{display:none;}
  /* 카테고리 뱃지 — PC에서 더 크게 */
  .shop-bar-cat{
    font-size:11px;
    padding:4px 12px;
    border-radius:20px;
    margin-bottom:0;
  }
  /* 업체명 — PC에서 더 크게, 2줄까지 허용 */
  .shop-bar-name{
    font-size:22px;
    font-weight:900;
    line-height:1.25;
    margin-bottom:0;
    -webkit-line-clamp:2;
    white-space:normal;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    word-break:keep-all;
  }
  /* 위치 */
  .shop-bar-loc{
    font-size:12px;
    margin-bottom:0;
    white-space:normal;
    word-break:break-all;
  }
  /* 설명 — PC 전용 스타일 */
  .shop-bar-desc{
    font-size:13px;
    color:rgba(255,255,255,.5);
    line-height:1.65;
    margin-bottom:0;
    white-space:normal;
    overflow:hidden;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
  }
  /* 예약 버튼 — 오른쪽 패널 안에서 가득 차게 */
  .btn-book{
    width:100%;
    padding:14px 20px;
    font-size:14px;
    border-radius:14px;
    justify-content:center;
    margin-top:4px;
  }
  /* shop-bar-info flex로 세로 쌓기 */
  .shop-bar-info{
    display:flex;
    flex-direction:column;
    gap:10px;
    flex:1;
    min-width:0;
    justify-content:center;
    overflow:hidden;
  }
}

/* 업체 정보 바 */
.shop-bar{flex-shrink:0;padding:18px 14px 14px;
  display:flex;align-items:center;gap:10px;position:relative;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.98))}
.shop-bar::before{content:'';position:absolute;top:-44px;left:0;right:0;height:44px;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.7));pointer-events:none}
.shop-bar-info{flex:1;min-width:0}
.shop-bar-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px}
.shop-bar-name{font-size:17px;font-weight:800;
  white-space:normal;overflow:hidden;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
  margin-bottom:3px}
.shop-bar-loc{font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px}
.shop-bar-loc i{color:var(--green);font-size:10px;flex-shrink:0}
.shop-bar-desc{font-size:11px;color:rgba(255,255,255,.4);line-height:1.6;
  margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;
  -webkit-box-orient:vertical;overflow:hidden}
.btn-book{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:10px 14px;font-size:12px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 4px 16px rgba(3,199,90,.4);min-width:64px}
.btn-book i{font-size:16px}
.btn-book span{font-size:10px;font-weight:700}
.btn-book:active{background:var(--green2);transform:scale(.96)}

/* 로딩/빈상태 */
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);
  border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* 스켈레톤 카드 */
.skel-card{scroll-snap-align:start;flex-shrink:0;width:100%;height:100%;
  display:flex;flex-direction:column;background:#0f0f0f;}
.skel-video{width:100%;aspect-ratio:9/16;background:linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%);
  background-size:200% 100%;animation:skel-shine 1.2s infinite;}
.skel-bar{padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.skel-line{border-radius:6px;background:linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%);
  background-size:200% 100%;animation:skel-shine 1.2s infinite;}
@keyframes skel-shine{to{background-position:-200% 0}}
.feed-empty{height:100%;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;color:rgba(255,255,255,.25);
  scroll-snap-align:start;background:#0a0a0a}
.feed-empty i{font-size:48px}
.feed-empty p{font-size:14px;font-weight:600}

/* ── 지도 화면 ── */
#naverMap{position:absolute;top:0;left:0;right:0;bottom:0;}

/* 지도 위 카테고리 필터 (floating) */
.map-cat-bar{
  position:absolute;top:10px;left:0;right:0;z-index:100;
  display:flex;gap:6px;overflow-x:auto;
  padding:0 12px;scrollbar-width:none;pointer-events:auto}
.map-cat-bar::-webkit-scrollbar{display:none}
.mc{flex-shrink:0;border:none;border-radius:20px;
  padding:7px 14px;font-size:12px;font-weight:700;
  background:rgba(18,18,18,.88);backdrop-filter:blur(12px);
  color:rgba(255,255,255,.65);
  cursor:pointer;font-family:inherit;transition:all .2s;
  white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.mc.active{
  background:var(--pink);color:#fff;
  box-shadow:0 3px 14px rgba(255,77,125,.45)}

/* 내 주변 FAB */
.nearby-fab{
  position:absolute;top:56px;right:12px;z-index:100;
  background:rgba(18,18,18,.9);backdrop-filter:blur(10px);
  border:1.5px solid rgba(255,255,255,.15);border-radius:50px;
  padding:8px 13px;display:flex;align-items:center;gap:5px;
  font-size:11px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:inherit;transition:all .2s}
.nearby-fab i{color:var(--pink);font-size:12px}
.nearby-fab.on{background:var(--pink);border-color:var(--pink)}
.nearby-fab.on i{color:#fff}

/* ── 지도 위 팝업 카드 (두바이쿠키맵 스타일) ── */
.map-popup{
  position:absolute;bottom:16px;left:12px;right:12px;
  z-index:200;
  background:#111;border-radius:20px;
  overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.7);
  border:1px solid rgba(255,255,255,.1);
  transform:translateY(20px) scale(.96);
  opacity:0;pointer-events:none;
  transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .25s}
.map-popup.show{
  transform:translateY(0) scale(1);
  opacity:1;pointer-events:auto}

/* 팝업 유튜브 영역 */
.mp-yt{
  position:relative;width:100%;padding-top:52%;
  background:#000;overflow:hidden}
.mp-yt iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.mp-yt-thumb{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;cursor:pointer}
.mp-play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s}
.mp-play-btn:hover{background:rgba(0,0,0,.15)}
.mp-play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,255,255,.92);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.4)}
.mp-play-icon i{color:#111;font-size:20px;margin-left:3px}

/* 팝업 정보 영역 */
.mp-info{padding:13px 14px 14px;display:flex;align-items:flex-start;gap:10px}
.mp-info-main{flex:1;min-width:0}
.mp-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.2);
  padding:2px 8px;border-radius:6px;margin-bottom:5px}
.mp-name{
  font-size:17px;font-weight:800;line-height:1.2;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:4px}
.mp-meta{
  font-size:11px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:6px;margin-bottom:5px}
.mp-meta i{font-size:10px}
.mp-desc{
  font-size:12px;color:rgba(255,255,255,.5);line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mp-actions{display:flex;flex-direction:column;gap:6px;flex-shrink:0}
.mp-book{
  display:flex;align-items:center;justify-content:center;gap:5px;
  background:var(--green);color:#fff;border:none;border-radius:11px;
  padding:9px 12px;font-size:11px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 3px 12px rgba(3,199,90,.4)}
.mp-book:active{background:var(--green2)}
.mp-close{
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);
  border-radius:11px;width:38px;height:38px;
  cursor:pointer;font-size:14px;color:rgba(255,255,255,.5)}
.mp-close:active{background:rgba(255,255,255,.15)}
.mp-tags{
  display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
.mp-tag{
  font-size:10px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.5);padding:3px 8px;border-radius:8px}

/* ── 하단 미니카드 패널 제거 ── */
:root{--panel-h:0px}

/* 네이버 지도 커스텀 마커 → 인라인 스타일로 처리, CSS 불필요 */

/* 피드용 바텀시트 */
.dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;
  pointer-events:none;transition:background .3s}
.dim.on{background:rgba(0,0,0,.6);pointer-events:auto}
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:401;
  background:#141414;border-radius:24px 24px 0 0;
  transform:translateY(100%);transition:transform .38s cubic-bezier(.32,1,.23,1);
  max-height:85vh;display:flex;flex-direction:column;
  padding-bottom:calc(20px + var(--safe));
  box-shadow:0 -4px 30px rgba(0,0,0,.5)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:38px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:14px auto 0;flex-shrink:0}
.sheet-img{width:calc(100% - 28px);height:180px;object-fit:cover;
  border-radius:16px;margin:14px 14px 0;flex-shrink:0}
.sheet-body{padding:16px 18px 0;overflow-y:auto;flex:1}
.s-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 8px;border-radius:6px;margin-bottom:6px}
.s-name{font-size:22px;font-weight:800;margin-bottom:6px;line-height:1.2}
.s-addr{font-size:12px;color:rgba(255,255,255,.45);
  display:flex;align-items:center;gap:5px;margin-bottom:4px}
.s-phone{font-size:12px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:5px;margin-bottom:10px}
.s-desc{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:10px;line-height:1.5}
.s-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.s-tag{font-size:11px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.6);padding:4px 10px;border-radius:9px;font-weight:500}
.s-price{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px}
.s-price span{color:var(--pink2);font-size:18px;font-weight:800}
.s-actions{display:flex;gap:10px}
.s-book{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:15px;font-size:15px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  box-shadow:0 4px 16px rgba(3,199,90,.35)}
.s-book:active{background:var(--green2)}
.s-map-btn{flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:15px 16px;cursor:pointer;
  font-size:18px;color:rgba(255,255,255,.6)}

/* ── 예약 모달 (iframe) ── */
.rsv-dim{
  position:fixed;inset:0;z-index:800;
  background:rgba(0,0,0,0);
  transition:background .3s;
  pointer-events:none;
}
.rsv-dim.show{
  background:rgba(0,0,0,.65);
  pointer-events:auto;
}
.rsv-modal{
  position:fixed;
  left:0;right:0;bottom:0;
  z-index:801;
  height:90vh;
  background:#fff;
  border-radius:20px 20px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);
  transition:transform .38s cubic-bezier(.32,1,.23,1);
  overflow:hidden;
  box-shadow:0 -6px 40px rgba(0,0,0,.5);
}
.rsv-modal.show{transform:translateY(0)}
.rsv-topbar{
  flex-shrink:0;height:50px;
  background:#fff;
  border-bottom:1px solid #eee;
  display:flex;align-items:center;
  padding:0 12px;gap:8px;
  position:relative;
}
.rsv-topbar-handle{
  position:absolute;top:7px;left:50%;transform:translateX(-50%);
  width:34px;height:4px;border-radius:4px;
  background:rgba(0,0,0,.1);
}
.rsv-topbar-title{
  flex:1;font-size:14px;font-weight:700;color:#111;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  padding-top:4px;
}
.rsv-topbar-close{
  flex-shrink:0;width:44px;height:44px;
  background:#fff0f4;border:none;border-radius:10px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.rsv-topbar-close svg,.rsv-topbar-ext svg{
  pointer-events:none;  /* SVG가 클릭 이벤트 가로채지 않도록 */
  display:block;
}
.rsv-topbar-ext{
  flex-shrink:0;width:44px;height:44px;
  background:#f4f4f4;border:none;border-radius:10px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.rsv-loading{
  flex-shrink:0;height:3px;background:#f0f0f0;overflow:hidden;
}
.rsv-loading-bar{
  height:100%;width:35%;
  background:#03C75A;
  animation:rsvLoad 1.1s ease-in-out infinite alternate;
}
@keyframes rsvLoad{from{transform:translateX(-100%)}to{transform:translateX(350%)}}
.rsv-loading.hide{display:none;}
.rsv-iframe{
  flex:1;border:none;width:100%;background:#fff;
}

/* 토스트 */
.toast{position:fixed;bottom:calc(var(--nav)+12px);left:50%;
  transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;
  pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* ── 프리미엄 피드 카드 ── */
.fi-premium{
  position:relative;
}
.fi-premium::before{
  content:'';
  position:absolute;inset:0;z-index:1;pointer-events:none;
  box-shadow:inset 0 0 0 2px rgba(255,200,50,.45);
  border-radius:0;
}
.feed-premium-badge{
  position:absolute;top:12px;left:12px;z-index:10;
  background:linear-gradient(90deg,#FFD700,#FFA500);
  color:#000;font-size:10px;font-weight:900;
  padding:4px 10px;border-radius:20px;
  letter-spacing:.5px;
  box-shadow:0 2px 12px rgba(255,200,0,.55);
  display:flex;align-items:center;gap:4px;
}
.feed-premium-badge span{font-size:9px}
.shop-bar-premium{
  background:linear-gradient(to bottom,transparent,rgba(10,8,0,.99));
}
.shop-bar-cat-premium{
  color:#FFD700!important;
  background:rgba(255,200,0,.15)!important;
  border-color:rgba(255,200,0,.35)!important;
}
.btn-book-premium{
  background:linear-gradient(135deg,#FFD700,#FF8C00)!important;
  box-shadow:0 4px 16px rgba(255,180,0,.5)!important;
  color:#000!important;
}
.btn-book-premium:active{
  background:linear-gradient(135deg,#FFC200,#FF7700)!important;
}

/* 프리미엄 마커 글로우 애니메이션 */
@keyframes premGlow{
  0%,100%{opacity:.6;transform:scale(1)}
  50%{opacity:1;transform:scale(1.06)}
}
</style>
</head>
<body class="shorts-mode">

<header class="hd">
  <div class="logo" id="logoBtn">
    <div class="logo-icon">💄</div>
    마이<em>뷰티</em>맵
  </div>
  <div class="hd-right">
    <span class="hd-badge">BETA</span>
    <button class="search-btn" id="searchToggleBtn" onclick="toggleSearch()" aria-label="검색">
      <i class="fas fa-search" id="searchBtnIcon"></i>
    </button>
  </div>
</header>

<!-- 검색바 -->
<div class="search-bar" id="searchBar">
  <div class="search-inner">
    <i class="fas fa-search"></i>
    <input class="search-input" id="searchInput" type="search"
      placeholder="샵 이름, 지역, 태그 검색..."
      oninput="onSearchInput(this.value)"
      onkeydown="if(event.key==='Enter'){this.blur();}"
    />
    <button class="search-clear" id="searchClear" onclick="clearSearch()"><i class="fas fa-times-circle"></i></button>
  </div>
  <div class="search-hint">예) 강남 마사지 &nbsp;·&nbsp; 눈썹문신 &nbsp;·&nbsp; 리프팅</div>
</div>

<!-- 카탈로그 탭바 (피드 전용) -->
<div class="cat-bar" id="catBar">
  <div class="cat-scroll">
    ${Er.map((t,s)=>`<button class="cp${s===0?" active":""}" onclick="filterFeed(this,'${t==="전체"?"all":t}')">${_r[t]} ${t}</button>${s===0?ro:""}`).join("")}
  </div>
</div>

<!-- 숏폼 전용 카탈로그 바 -->
<div id="shortsCatBar">
  <div class="cat-scroll">
    <button class="scp active" id="scat-all"    onclick="filterShorts(this,'all')">🏠 전체</button>
    <button class="scp"        id="scat-마사지"  onclick="filterShorts(this,'마사지')">💆 마사지</button>
    <button class="scp"        id="scat-헤드스파" onclick="filterShorts(this,'헤드스파')">🧖 헤드스파</button>
    <button class="scp"        id="scat-피부관리" onclick="filterShorts(this,'피부관리')">✨ 피부관리</button>
    <button class="scp"        id="scat-헤어"    onclick="filterShorts(this,'헤어')">💇 헤어</button>
    <button class="scp"        id="scat-메이크업" onclick="filterShorts(this,'메이크업')">💄 메이크업</button>
    <button class="scp"        id="scat-왁싱"    onclick="filterShorts(this,'왁싱')">🪒 왁싱</button>
    <button class="scp"        id="scat-반영구"  onclick="filterShorts(this,'반영구')">🖊️ 반영구</button>
    <button class="scp"        id="scat-병원"    onclick="filterShorts(this,'병원')">🏥 병원</button>
    <button class="scp"        id="scat-그외"    onclick="filterShorts(this,'그외')">🌸 그외</button>
  </div>
</div>

<!-- 피드 화면 -->
<main id="feedScreen">
  <div class="feed-spin"><div class="spinner"></div></div>
</main>

<!-- 지도 화면: iframe -->
<section id="mapScreen">
  <!-- 카테고리 필터 -->
  <div class="map-cat-bar" id="mapCatBar">
    ${Er.map((t,s)=>`<button class="mc${s===0?" active":""}" onclick="filterMap(this,'${t==="전체"?"all":t}')">${_r[t]} ${t}</button>`).join("")}
  </div>
  <!-- 지도 iframe -->
  <iframe id="mapFrame" src="/map" style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>

  <!-- ── 지도 위 팝업 카드 ── -->
  <div class="map-popup" id="mapPopup">
    <!-- 미디어 영역 -->
    <div id="mpYt"></div>
    <!-- 정보 영역 -->
    <div class="mp-info">
      <div class="mp-info-main">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap;">
          <div class="mp-badge" id="mpBadge"></div>
          <div id="mpPremiumBadge" style="display:none;align-items:center;gap:3px;
            font-size:10px;font-weight:900;padding:3px 8px;border-radius:20px;
            background:linear-gradient(90deg,#FFD700,#FFA500);color:#000;
            box-shadow:0 1px 8px rgba(255,180,0,.5);letter-spacing:.3px;">
            ✦ PREMIUM
          </div>
        </div>
        <div class="mp-name" id="mpName"></div>
        <div class="mp-meta" id="mpMeta"></div>
        <div class="mp-desc" id="mpDesc"></div>
        <div class="mp-tags" id="mpTags"></div>
      </div>
      <div class="mp-actions">
        <button class="mp-book" id="mpBook"
          onclick="if(curShop){trackMapSPWithSrc(curShop.id);curShop&&(()=>{const e=document.getElementById('rsvDim');const m=document.getElementById('rsvModal');const t=document.getElementById('rsvTitle');const f=document.getElementById('rsvFrame');const l=document.getElementById('rsvLoading');document.getElementById('rsvExtBtn').onclick=()=>window.open(curShop.smartPlaceUrl,'_blank','noopener');t.textContent=curShop.name+' 예약하기';f.src='';l.classList.remove('hide');e.classList.add('show');m.classList.add('show');fetch('/api/resolve-naver?url='+encodeURIComponent(curShop.smartPlaceUrl)).then(r=>r.json()).then(d=>{f.src=d.resolved;f.onload=()=>l.classList.add('hide');}).catch(()=>{f.src=curShop.smartPlaceUrl;f.onload=()=>l.classList.add('hide');});})()}">
          <i class="fas fa-calendar-check" style="font-size:12px"></i>
          네이버 예약
        </button>
        <button class="mp-close" onclick="closeMapPopup()">✕</button>
      </div>
    </div>
  </div>
</section>

<!-- 입점문의 화면 -->
<section id="inquiryScreen">
  <div class="iq-wrap">

    <!-- 히어로 -->
    <div class="iq-hero">
      <div class="iq-badge">✨ 파트너 모집 중</div>
      <div class="iq-title">마이뷰티맵에<br>내 샵을 등록하세요</div>
      <div class="iq-sub">유튜브 영상으로 홍보하고<br>더 많은 고객에게 닿을 수 있어요</div>
    </div>

    <!-- 혜택 카드 -->
    <div class="iq-benefits">
      <div class="iq-benefit">
        <div class="icon">▶️</div>
        <div class="bl">유튜브 영상 홍보</div>
        <div class="bs">업체 유튜브 영상을<br>피드에 자동 노출</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">🗺️</div>
        <div class="bl">지도 핀 등록</div>
        <div class="bs">네이버 지도 위에<br>업체 핀 표시</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">📅</div>
        <div class="bl">예약 연동</div>
        <div class="bs">스마트플레이스<br>바로 예약 연결</div>
      </div>

    </div>

    <!-- 요금 안내 -->
    <div class="iq-pricing">
      <div class="iq-plan free">
        <div class="plan-tag">추천</div>
        <div class="plan-icon">🎬</div>
        <div class="plan-price">6개월 무료</div>
        <div class="plan-name">촬영 플랜</div>
        <div class="plan-desc">
          촬영비 <b style="color:#03C75A">3만원</b> 내시면<br>
          <b style="color:#03C75A">6개월 무료</b> 게재<br>
          <span style="font-size:9px;opacity:.6">이후 월 10,000원</span>
        </div>
      </div>
      <div class="iq-plan paid">
        <div class="plan-tag">기본</div>
        <div class="plan-icon">📍</div>
        <div class="plan-price">월 1만원</div>
        <div class="plan-name">기본 플랜</div>
        <div class="plan-desc">영상 없이<br>맵 게재만<br><b style="color:var(--pink)">월 10,000원</b></div>
      </div>
    </div>

    <!-- 신청 폼 -->
    <div class="iq-form" id="iqForm">
      <h3>📝 입점 신청서</h3>
      <div class="iq-row2">
        <div class="iq-field">
          <label>대표님 성함 *</label>
          <input type="text" id="iq-owner" placeholder="홍길동">
        </div>
        <div class="iq-field">
          <label>연락처 *</label>
          <input type="tel" id="iq-phone" placeholder="010-0000-0000">
        </div>
      </div>
      <div class="iq-field">
        <label>샵 이름 *</label>
        <input type="text" id="iq-name" placeholder="예) 글로우 스킨 강남점">
      </div>
      <div class="iq-row2">
        <div class="iq-field">
          <label>업종 *</label>
          <select id="iq-cat">
            <option value="">선택</option>
            <option>마사지</option><option>헤드스파</option><option>피부관리</option>
            <option>헤어</option><option>메이크업</option><option>왁싱</option><option>반영구</option>
            <option>병원</option><option>그외</option>
          </select>
        </div>
        <div class="iq-field">
          <label>지역 *</label>
          <input type="text" id="iq-area" placeholder="예) 강남구">
        </div>
      </div>
      <div class="iq-field">
        <label>스마트플레이스 URL</label>
        <input type="url" id="iq-url" placeholder="https://naver.me/...">
      </div>
      <div class="iq-field">
        <label>문의사항</label>
        <textarea id="iq-msg" placeholder="궁금한 점이나 요청사항을 적어주세요"></textarea>
      </div>
    </div>

    <!-- 개인정보 수집·이용 동의 -->
    <div class="iq-agree">
      <div class="iq-agree-title">🔒 개인정보 수집·이용 동의</div>
      <div class="iq-agree-body">
        <b>수집 항목:</b> 성함, 연락처, 샵명, 업종, 지역, 스마트플레이스 URL, 문의사항<br>
        <b>수집 목적:</b> 입점 검토 및 상담 연락<br>
        <b>보유 기간:</b> 입점 검토 완료 후 1년 또는 동의 철회 시까지<br>
        <b>제3자 제공:</b> 없음 (내부 검토 목적으로만 사용)<br><br>
        귀하는 개인정보 수집·이용에 동의를 거부할 권리가 있으며, 동의 거부 시 입점 신청이 제한될 수 있습니다.
      </div>
      <label class="iq-agree-check">
        <input type="checkbox" id="iq-agree-chk">
        <span>위 개인정보 수집·이용에 <b>(필수)</b> 동의합니다</span>
      </label>
    </div>

    <button class="iq-submit" onclick="submitInquiry()">
      <i class="fas fa-paper-plane" style="margin-right:6px"></i>입점 신청하기
    </button>

    <!-- 완료 메시지 -->
    <div class="iq-done" id="iqDone">
      <div class="done-icon">🎉</div>
      <div class="done-title">신청이 접수됐어요!</div>
      <div class="done-sub">담당자가 확인 후<br>1~2일 내로 연락드릴게요.</div>
    </div>

    <div class="iq-notice">
      입력하신 정보는 입점 검토 목적으로만 사용되며<br>
      제3자에게 제공되지 않습니다. (개인정보보호법 준수)
    </div>
  </div>
</section>

<!-- 구글 애드센스 광고 배너 -->
<div id="coupang-ad">
  <ins class="adsbygoogle"
    style="display:inline-block;width:100%"
    data-ad-client="ca-pub-6943282483618134"
    data-ad-slot="5241168678"
    data-ad-format="fixed"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>
</div>

<!-- 음소거 버튼 (릴스 전용) -->
<button id="shorts-mute-btn" onclick="toggleShortsMute()">
  <i class="fas fa-volume-mute"></i>
</button>

<!-- 숏폼 스크린 -->
<section id="shortsScreen">
  <div id="shortsFeed" style="height:100%;display:flex;flex-direction:column"></div>
</section>

<!-- 하단 탭바: 릴스 → 영상 → 지도 → 입점 -->
<nav class="tabbar">
  <button class="tab" id="tab-shorts" onclick="switchTab('shorts')">
    <i class="fas fa-fire"></i>릴스
  </button>
  <button class="tab" id="tab-feed" onclick="switchTab('feed')">
    <i class="fas fa-play-circle"></i>영상
  </button>
  <button class="tab" id="tab-map" onclick="switchTab('map')">
    <i class="fas fa-map-marker-alt"></i>지도
  </button>
  <button class="tab" id="tab-inquiry" onclick="switchTab('inquiry')">
    <i class="fas fa-store"></i>입점문의
  </button>
</nav>

<!-- 피드 전용 딤 + 바텀시트 -->
<div class="dim" id="dim" onclick="closeFeedSheet()"></div>
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <img class="sheet-img" id="sImg" src="" alt=""/>
  <div class="sheet-body">
    <div class="s-cat"  id="sCat"></div>
    <div class="s-name" id="sName"></div>
    <div class="s-addr"><i class="fas fa-map-pin" style="color:var(--green)"></i><span id="sAddr"></span></div>
    <div class="s-phone"><i class="fas fa-phone" style="color:rgba(255,255,255,.3)"></i><span id="sPhone"></span></div>
    <div class="s-desc" id="sDesc"></div>
    <div class="s-tags" id="sTags"></div>
    <div class="s-price">시술 <span id="sPrice"></span></div>
    <div class="s-actions">
      <button class="s-book" id="sBook" onclick="openInapp()">
        <i class="fas fa-calendar-check"></i> 네이버 예약하기
      </button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

<!-- 예약 모달 (iframe) -->
<div class="rsv-dim" id="rsvDim" onclick="closeReserve()"></div>
<div class="rsv-modal" id="rsvModal">
  <div class="rsv-topbar">
    <div class="rsv-topbar-handle"></div>
    <span class="rsv-topbar-title" id="rsvTitle"></span>
    <button class="rsv-topbar-ext" id="rsvExtBtn" title="브라우저로 열기" type="button">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2" style="pointer-events:none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </button>
    <button class="rsv-topbar-close" onclick="closeReserve()" title="닫기" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5" style="pointer-events:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="rsv-loading" id="rsvLoading"><div class="rsv-loading-bar"></div></div>
  <iframe class="rsv-iframe" id="rsvFrame" src=""
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
    allowfullscreen></iframe>
</div>



<script>
// ── 전역 ──────────────────────────────────────────────────────────────────
let allShops   = [];
let mapCat     = 'all';
let nearbyOn   = false;
let userLat    = null;
let userLng    = null;
let curShop    = null;
let naverMap   = null;
let mapInited  = false;
let nvMarkers  = {};   // id -> {marker, overlay}
// ── 영상조회: 실제 클릭(재생)할 때만, 세션 내 업체당 1회만 카운팅 ──────────
// sessionStorage 사용 → 새로고침해도 탭 닫기 전까지 중복 방지
// source: 'feed' | 'catalog' | 'map'  (어디서 영상을 재생했는지)
function trackView(shopId, source) {
  if (!shopId) return;
  const id  = String(shopId);
  const src = source || 'feed';
  const key = 'viewed_' + id + '_' + src; // source별로 독립 카운팅
  if (sessionStorage.getItem(key)) return; // 이미 이 탭에서 카운팅됨
  sessionStorage.setItem(key, '1');
  lastViewSrc = src; // 예약클릭 전환율 분석용: 마지막 영상 출처 기억
  fetch('/api/track/view/'+id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: src }),
  }).catch(()=>{});
}
let userMarker = null;

const CAT_CLASS = {
  '마사지':'cat-massage', '헤드스파':'cat-headspa',
  '피부관리':'cat-skin', '헤어':'cat-hair', '메이크업':'cat-makeup',
  '왁싱':'cat-wax', '반영구':'cat-perm', '병원':'cat-hospital', '그외':'cat-etc',
};

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  _sessionTrackTab(tab); // 👁️ 세션 추적
  ['feed','map','inquiry','shorts'].forEach(t => {
    const tabEl = document.getElementById('tab-'+t);
    const scrEl = document.getElementById(t+'Screen');
    if(tabEl) tabEl.classList.toggle('active', t===tab);
    if(scrEl) scrEl.classList.toggle('active', t===tab);
  });
  document.getElementById('catBar').classList.toggle('show', tab==='feed');

  const pcWrapper = document.getElementById('feed-pc-wrapper');
  if (pcWrapper) pcWrapper.style.display = (tab === 'feed') ? '' : 'none';

  if (tab==='map') {
    closeMapPopup();
    initMap();
    setTimeout(() => {
      const frame = document.getElementById('mapFrame');
      if (frame) frame.contentWindow.postMessage({ type: 'fitBounds' }, '*');
    }, 300);
  }
  if (tab==='feed') closeMapPopup();

  // ── 숏폼 모드: body 클래스로 헤더·광고 통합 제어 ──────────────────────────
  document.body.classList.toggle('shorts-mode', tab === 'shorts');
  const sCatBar = document.getElementById('shortsCatBar');
  if (sCatBar) sCatBar.classList.toggle('show', tab === 'shorts');
  document.documentElement.style.setProperty('--scat', tab === 'shorts' ? '44px' : '0px');
  // ────────────────────────────────────────────────────────────────────────

  // 검색바 placeholder·힌트 탭에 따라 변경
  const si = document.getElementById('searchInput');
  const sh = document.querySelector('.search-hint');
  if (si && sh) {
    si.placeholder = '샵 이름, 지역, 태그 검색...';
    sh.textContent = '예) 강남 마사지  ·  눈썹문신  ·  리프팅';
  }

  if (tab==='shorts') {
    // 숏폼 탭 진입 → 영상탭 feed-iframe 정지
    if (_feedCurrentCard) {
      const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
      if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
    }
    closeFeedSheet && closeFeedSheet();
    // 숏폼 로드 & 재생
    if (_shortsLoaded && _shortsItems.length) {
      const sc = document.getElementById('shortsScreen');
      if (sc) {
        _shortsStopAll();
        sc.scrollTop = 0;
        // display:block 전환 후 레이아웃 확정까지 대기 (모바일 Safari 대응)
        setTimeout(() => { initShortsObserver(sc); }, 200);
      }
    } else {
      loadShorts(_shortsCat);
    }
  } else {
    // 릴스 탭 이탈 → 모든 영상 즉시 정지
    _shortsStopAll();
  }
  // 영상탭 이탈 시 feed 정지
  if (tab !== 'feed' && _feedCurrentCard) {
    const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
  }
  // 영상탭 진입/복귀 시 재생
  if (tab === 'feed') {
    const scr = document.getElementById('feedScreen');
    if (scr) {
      // 현재 카드 복귀 재생, 없으면 첫 카드 활성화
      if (_feedCurrentCard) {
        const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
        if (fi && fi.dataset.src) { delete fi.dataset.paused; fi.src = fi.dataset.src; }
      } else {
        const first = scr.querySelector('.yt-area[data-ytid]');
        if (first) feedActivateCard(first);
      }
    }
  }
}

// ── 로고 5번 탭 → 관리자 선택 팝업 ─────────────────────────────────────
let logoCnt=0, logoTmr;
document.getElementById('logoBtn').addEventListener('click', ()=>{
  logoCnt++;
  clearTimeout(logoTmr);
  logoTmr = setTimeout(()=>{logoCnt=0;}, 800);
  if (logoCnt >= 5) {
    logoCnt = 0;
    showAdminPicker();
  }
});

// ── ⚡ 숏폼 피드 ────────────────────────────────────────────────────────
let _shortsLoaded   = false;
let _shortsObserver = null;
let _shortsItems    = [];   // 전체 업체 캐시
let _shortsCat      = 'all'; // 현재 선택된 카테고리

// 앱 진입 시 릴스 탭으로 시작 (switchTab이 body.shorts-mode + catBar + 로드 모두 처리)
document.addEventListener('DOMContentLoaded', () => {
  switchTab('shorts');
  _sessionInit();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👁️ 방문자 세션 추적 엔진
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _sessId       = '';
let _sessStart    = Date.now();
let _sessTabs     = [];   // 방문한 탭 순서
let _sessTimer    = null;
// 숏폼
let _sessShorts   = 0;   // 숏폼 시청 수
let _sessShortsBook = 0; // 숏폼 예약클릭 수
// 피드
let _sessFeedCard = 0;   // 피드 업체카드 클릭
let _sessFeedBook = 0;   // 피드 예약클릭
// 지도
let _sessMapPin   = 0;   // 지도 마커 클릭
let _sessMapBook  = 0;   // 지도 예약클릭
// 기타
let _sessSearch   = 0;   // 검색 사용
let _sessInquiry  = 0;   // 문의 제출

function _sessionInit() {
  // 세션 ID: localStorage에 저장 (탭 닫기 전까지 유지)
  // 새로고침은 새 세션으로 처리
  _sessId = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  _sessStart = Date.now();
  _sessTabs       = [];
  _sessShorts     = 0;
  _sessShortsBook = 0;
  _sessFeedCard   = 0;
  _sessFeedBook   = 0;
  _sessMapPin     = 0;
  _sessMapBook    = 0;
  _sessSearch     = 0;
  _sessInquiry    = 0;

  const ua = navigator.userAgent || '';
  const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';

  // 서버에 세션 시작 알림
  fetch('/api/track/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: _sessId, device }),
  }).catch(() => {});

  // 30초마다 heartbeat
  _sessTimer = setInterval(() => _sessionFlush(false), 30000);

  // 탭 닫기 / 페이지 이탈 시 최종 전송
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') _sessionFlush(true);
  });
  window.addEventListener('pagehide', () => _sessionFlush(true));
}

function _sessionFlush(exited) {
  if (!_sessId) return;
  const duration = Math.round((Date.now() - _sessStart) / 1000);
  const payload  = JSON.stringify({
    id:            _sessId,
    duration_sec:  duration,
    tabs_visited:  _sessTabs,
    shorts_count:  _sessShorts,
    shorts_book:   _sessShortsBook,
    feed_card_cnt: _sessFeedCard,
    feed_book_cnt: _sessFeedBook,
    map_pin_cnt:   _sessMapPin,
    map_book_cnt:  _sessMapBook,
    search_cnt:    _sessSearch,
    inquiry_cnt:   _sessInquiry,
    exited:        !!exited,
  });
  // sendBeacon: 페이지 닫혀도 전송 보장
  if (exited && navigator.sendBeacon) {
    navigator.sendBeacon('/api/track/session/update', new Blob([payload], { type: 'application/json' }));
  } else {
    fetch('/api/track/session/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }).catch(() => {});
  }
}

// 탭 전환
function _sessionTrackTab(tab) {
  if (!_sessId) return;
  if (!_sessTabs.includes(tab)) _sessTabs.push(tab);
}
// 숏폼 시청
function _sessionTrackShorts() {
  if (!_sessId) return;
  _sessShorts++;
}
// 숏폼 예약클릭
function _sessionTrackShortsBook() {
  if (!_sessId) return;
  _sessShortsBook++;
}
// 피드 업체카드 클릭
function _sessionTrackFeedCard() {
  if (!_sessId) return;
  _sessFeedCard++;
}
// 피드 예약클릭
function _sessionTrackFeedBook() {
  if (!_sessId) return;
  _sessFeedBook++;
}
// 지도 마커 클릭
function _sessionTrackMapPin() {
  if (!_sessId) return;
  _sessMapPin++;
}
// 지도 예약클릭
function _sessionTrackMapBook() {
  if (!_sessId) return;
  _sessMapBook++;
}
// 검색 사용
function _sessionTrackSearch() {
  if (!_sessId) return;
  _sessSearch++;
}
// 문의 제출
function _sessionTrackInquiry() {
  if (!_sessId) return;
  _sessInquiry++;
}

// ── 업체별 이벤트 로그 (서버로 즉시 전송) ────────────────────────────────
// event_type: shorts_view|shorts_book|feed_card|feed_book|map_pin|map_book
function _sessionEvent(event_type, shop, viewed_sec) {
  if (!_sessId || !shop) return;
  fetch('/api/track/session/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: _sessId,
      event_type,
      shop_id:    shop.id   || shop.shop_id  || null,
      shop_name:  shop.name || shop.shop_name || null,
      shop_cat:   shop.category || shop.cat  || null,
      viewed_sec: viewed_sec || 0,
    }),
  }).catch(() => {});
}

function filterShorts(btn, cat) {
  // 버튼 active 토글
  document.querySelectorAll('#shortsCatBar .scp').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 캐시 유지하면서 필터만 변경 (재fetch 없음)
  loadShorts(cat);
}

async function loadShorts(cat) {
  cat = cat || 'all';
  _shortsCat = cat;
  const screen = document.getElementById('shortsScreen');
  const el     = document.getElementById('shortsFeed');
  if (!el) return;

  if (!_shortsLoaded) {
    _shortsLoaded = true;
    el.innerHTML = '<div class="shorts-empty">불러오는 중...</div>';
    try {
      _shortsItems = await fetch('/api/shorts').then(r => r.json());
    } catch(e) {
      el.innerHTML = '<div class="shorts-empty">불러오기 실패</div>';
      _shortsLoaded = false;
      return;
    }
  }

  // 랜덤 셔플 (Fisher-Yates)
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const items = shuffle(
    (cat === 'all') ? _shortsItems : _shortsItems.filter(s => s.category === cat)
  );

  if (!items.length) {
    el.innerHTML = '<div class="shorts-empty">🎬 숏폼 영상을 준비 중입니다!</div>';
    if (_shortsObserver) _shortsObserver.disconnect();
    return;
  }

  // 기존 YT 플레이어 전부 destroy 후 innerHTML 교체 (메모리 누수 방지)
  _shortsDestroyAll();
  el.style.cssText = 'height:100%;display:flex;flex-direction:column;';
  el.innerHTML = items.map((shop, i) => shortsSlide(shop, i)).join('');
  _shortsTotal = items.length;
  _shortsActiveIdx = -1;
  screen.scrollTop = 0;
  // 레이아웃 그려진 후 Observer 등록 → 첫 슬라이드 자동 감지·재생
  // 모바일 Safari: display:block 전환 후 layout 확정까지 200ms 대기
  setTimeout(() => { initShortsObserver(screen); }, 200);
}

// 전체 음소거 상태 (기본: 음소거)
let _shortsMuted = true;

function shortsSlide(shop, idx) {
  const ytId = shop.youtube_id || '';
  const cat  = shop.category || '';
  const name = shop.name || '';
  const addr = shop.address || '';
  return (
    '<div class="shorts-slide" data-shop-id="' + shop.id + '" data-ytid="' + ytId + '" data-idx="' + idx + '"' +
    ' onclick="shortsSlideClick(event,this)">' +
    (ytId
      ? '<div class="shorts-iframe-wrap"><div class="shorts-yt-placeholder" id="yt-ph-' + idx + '"></div></div>'
      : '<div class="shorts-no-video"></div>') +
    '<div class="shorts-overlay">' +
      '<div class="shorts-info-row">' +
        '<div class="shorts-info-body">' +
          (cat ? '<span class="shorts-cat">' + cat + '</span>' : '') +
          '<div class="shorts-name">' + name + '</div>' +
          (addr ? '<div class="shorts-addr"><i class="fas fa-map-pin"></i>' + addr + '</div>' : '') +
        '</div>' +
        '<button class="shorts-book-btn" onclick="event.stopPropagation();shortsOpenBook(' + JSON.stringify(shop).replace(/"/g,'&quot;') + ')">' +
          '<i class="fas fa-calendar-check"></i>' +
          '<span>예약하기</span>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '</div>'
  );
}

// ── 릴스 슬라이드 탭: 재생/정지 토글 ──────────────────────────────────────
function shortsSlideClick(e, slide) {
  if (!slide) return;
  if (e.target.closest('.shorts-overlay')) return;
  const idx = parseInt(slide.dataset.idx || '0', 10);
  const player = _ytPlayers[idx];
  if (!player) return;
  // 첫 탭: iOS 사용자 제스처 컨텍스트에서 재생 시작
  if (!_shortsUserGestured) {
    _shortsUserGestured = true;
    try { player.playVideo(); } catch(e2) {}
    _shortsShowIcon(slide, 'play');
    return;
  }
  const state = player.getPlayerState ? player.getPlayerState() : -1;
  // YT.PlayerState.PLAYING = 1
  if (state === 1) {
    player.pauseVideo();
    _shortsShowIcon(slide, 'pause');
  } else {
    player.playVideo();
    _shortsShowIcon(slide, 'play');
  }
}

// ── 재생/정지 아이콘 팝인 ─────────────────────────────────────────────────
function _shortsShowIcon(slide, type) {
  let icon = slide.querySelector('.shorts-pi');
  if (!icon) {
    icon = document.createElement('div');
    icon.className = 'shorts-pi';
    icon.innerHTML = '<i></i>';
    icon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);' +
      'width:72px;height:72px;background:rgba(0,0,0,.55);border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'pointer-events:none;z-index:15;transition:transform .15s,opacity .15s;opacity:0;';
    icon.querySelector('i').style.cssText = 'font-size:28px;color:#fff;pointer-events:none';
    slide.appendChild(icon);
  }
  const i = icon.querySelector('i');
  if (i) i.className = type === 'pause' ? 'fas fa-pause' : 'fas fa-play';
  icon.style.transform = 'translate(-50%,-50%) scale(0)'; icon.style.opacity = '0';
  requestAnimationFrame(() => {
    icon.style.transform = 'translate(-50%,-50%) scale(1)'; icon.style.opacity = '1';
  });
  clearTimeout(icon._t);
  if (type === 'play') {
    icon._t = setTimeout(() => {
      icon.style.transform = 'translate(-50%,-50%) scale(0.7)'; icon.style.opacity = '0';
    }, 700);
  }
}

// ── 음소거 토글 ───────────────────────────────────────────────────────────
function toggleShortsMute() {
  _shortsMuted = !_shortsMuted;
  Object.values(_ytPlayers).forEach(p => {
    try { _shortsMuted ? p.mute() : p.unMute(); } catch(e) {}
  });
  const btn = document.getElementById('shorts-mute-btn');
  if (btn) btn.innerHTML = _shortsMuted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';
}

function shortsOpenBook(shop) {
  if (!shop.smart_place_url) { showToast('예약 링크가 없어요'); return; }
  fetch('/api/track/shorts/sp/' + shop.id, { method: 'POST' }).catch(() => {});
  _sessionTrackShortsBook(); // 👁️ 세션 추적 - 숏폼 예약클릭
  _sessionEvent('shorts_book', shop);  // 👁️ 업체 이벤트
  curShop = { name: shop.name || '', smartPlaceUrl: shop.smart_place_url || '' };
  openInapp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// YouTube IFrame Player API 엔진
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _ytPlayers        = {};   // { idx: YT.Player }
let _ytApiReady       = false;
let _ytApiLoading     = false;
let _ytPendingInits   = [];   // API 로드 전에 요청된 슬라이드 대기열
let _shortsActiveIdx  = -1;
let _shortsTotal      = 0;
let _shortsUserGestured = false; // iOS: 첫 탭 후 재생 가능 여부
let _shortsViewStart  = 0;   // 현재 슬라이드 시청 시작 시각 (ms)
let _shortsViewShopId = null; // 현재 시청 중인 shop id

// YouTube IFrame API 스크립트 로드 (1회)
function _ytLoadApi() {
  if (_ytApiReady || _ytApiLoading) return;
  _ytApiLoading = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

// YouTube API 준비 완료 콜백 (전역 함수 — YT API가 호출)
window.onYouTubeIframeAPIReady = function() {
  _ytApiReady = true;
  // 대기 중인 슬라이드 초기화
  _ytPendingInits.forEach(fn => fn());
  _ytPendingInits = [];
};

// 슬라이드에 YT.Player 생성
function _ytCreatePlayer(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const ytId = slide.dataset.ytid || '';
  if (!ytId || _ytPlayers[idx]) return; // 이미 있으면 스킵

  const ph = slide.querySelector('.shorts-yt-placeholder');
  if (!ph) return;

  const create = () => {
    // placeholder div를 대상으로 YT.Player 생성
    const player = new window.YT.Player(ph, {
      videoId: ytId,
      playerVars: {
        autoplay: 1,
        mute:     1,   // 자동재생을 위해 음소거로 시작
        loop:     1,
        playlist: ytId,
        controls: 0,
        playsinline: 1,
        rel:      0,
        modestbranding: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: (e) => {
          // 플레이어 준비 완료
          if (_shortsMuted) {
            e.target.mute();
          } else {
            e.target.unMute();
          }
          // 현재 활성 슬라이드면 바로 재생
          if (_shortsActiveIdx === idx) {
            try { e.target.playVideo(); } catch(err) {}
          }
        },
        onStateChange: (e) => {
          // 영상 끝나면 처음부터 (loop=1 이지만 보험)
          if (e.data === 0) { // ENDED
            try { e.target.seekTo(0); e.target.playVideo(); } catch(err) {}
          }
        },
        onError: () => {
          // 에러 시 placeholder 복구 시도 안 함
        }
      }
    });
    _ytPlayers[idx] = player;
    // YT.Player가 생성되면 placeholder div를 iframe으로 교체함 (YT API가 자동 처리)
    // iframe에 스타일 적용
    const applyStyle = () => {
      const iframe = slide.querySelector('.shorts-iframe-wrap iframe');
      if (iframe) {
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none;';
      } else {
        setTimeout(applyStyle, 100);
      }
    };
    applyStyle();
  };

  if (_ytApiReady) {
    create();
  } else {
    _ytPendingInits.push(create);
    _ytLoadApi();
  }
}

// 슬라이드 활성화: 플레이어 생성 또는 재생
function _shortsActivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const ytId = slide.dataset.ytid || '';
  if (!ytId) return;
  if (_shortsActiveIdx === idx) return; // 이미 활성

  // ── 이전 슬라이드 시청 시간 마무리 ──────────────────────
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const prevSec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const prevShop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (prevShop && prevSec > 0) {
      _sessionEvent('shorts_view_end', prevShop, prevSec);
    }
  }

  _shortsActiveIdx = idx;
  _sessionTrackShorts(); // 👁️ 세션 추적

  // 아이콘 초기화
  const icon = slide.querySelector('.shorts-pi');
  if (icon) { icon.style.opacity='0'; icon.style.transform='translate(-50%,-50%) scale(0)'; }

  // 플레이어 없으면 생성
  if (!_ytPlayers[idx]) {
    _ytCreatePlayer(slide);
  } else {
    try { _ytPlayers[idx].playVideo(); } catch(e) {}
    if (!_shortsMuted) { try { _ytPlayers[idx].unMute(); } catch(e) {} }
  }

  // 조회수 트래킹 + 세션 이벤트 + 시청 시작 타이머
  const sid = slide.dataset.shopId;
  _shortsViewStart  = Date.now();
  _shortsViewShopId = sid || null;
  if (sid && !slide.dataset.viewed) {
    slide.dataset.viewed = '1';
    fetch('/api/track/shorts/view/' + sid, { method: 'POST' }).catch(() => {});
    const shopInfo = _shortsItems.find(s => String(s.id) === String(sid));
    _sessionEvent('shorts_view', shopInfo || { id: sid, name: '' });
  }
}

// 슬라이드 비활성화: 정지 + 리소스 유지 (플레이어는 재사용)
function _shortsDeactivateSlide(slide) {
  const idx = parseInt(slide.dataset.idx || '0', 10);
  if (!_ytPlayers[idx]) return;
  try { _ytPlayers[idx].pauseVideo(); } catch(e) {}
}

function _shortsStopAll() {
  // 마지막 시청 시간 마무리
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const sec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const shop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (shop && sec > 0) _sessionEvent('shorts_view_end', shop, sec);
    _shortsViewStart = 0; _shortsViewShopId = null;
  }
  Object.values(_ytPlayers).forEach(p => { try { p.pauseVideo(); } catch(e) {} });
  _shortsActiveIdx = -1;
  const sc = document.getElementById('shortsScreen');
  if (sc && sc._shortsScrollTimer) { clearTimeout(sc._shortsScrollTimer); sc._shortsScrollTimer = null; }
}

function _shortsDestroyAll() {
  Object.values(_ytPlayers).forEach(p => { try { p.destroy(); } catch(e) {} });
  _ytPlayers = {};
  _shortsActiveIdx = -1;
  _shortsUserGestured = false;
}

function initShortsObserver(screen) {
  if (_shortsObserver) { _shortsObserver.disconnect(); _shortsObserver = null; }
  if (screen._shortsScrollHandler) {
    screen.removeEventListener('scroll', screen._shortsScrollHandler);
    screen._shortsScrollHandler = null;
  }

  // YouTube API 미리 로드
  _ytLoadApi();

  // IntersectionObserver: 50% 이상 보이면 활성화, 20% 미만이면 비활성화
  _shortsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const slide = entry.target;
      if (entry.intersectionRatio >= 0.5) {
        _shortsActivateSlide(slide);
      } else if (entry.intersectionRatio < 0.2) {
        _shortsDeactivateSlide(slide);
      }
    });
  }, { root: screen, threshold: [0.2, 0.5] });

  document.querySelectorAll('.shorts-slide').forEach(s => _shortsObserver.observe(s));

  // scroll fallback: snap 후 Observer 미동작 시 보정
  screen._shortsScrollHandler = function() {
    clearTimeout(screen._shortsScrollTimer);
    screen._shortsScrollTimer = setTimeout(() => {
      const slides  = document.querySelectorAll('.shorts-slide');
      const scrTop  = screen.scrollTop;
      const scrH    = screen.clientHeight;
      let best = null, bestR = 0;
      slides.forEach(s => {
        const oh = Math.max(0, Math.min(s.offsetTop + s.offsetHeight, scrTop + scrH) - Math.max(s.offsetTop, scrTop));
        const r  = s.offsetHeight > 0 ? oh / s.offsetHeight : 0;
        if (r > bestR) { bestR = r; best = s; }
      });
      if (best && bestR >= 0.5) {
        _shortsActivateSlide(best);
        slides.forEach(s => {
          if (s === best) return;
          const oh = Math.max(0, Math.min(s.offsetTop + s.offsetHeight, scrTop + scrH) - Math.max(s.offsetTop, scrTop));
          const r  = s.offsetHeight > 0 ? oh / s.offsetHeight : 0;
          if (r < 0.2) _shortsDeactivateSlide(s);
        });
      }
    }, 200);
  };
  screen.addEventListener('scroll', screen._shortsScrollHandler, { passive: true });

  // iOS Safari rAF 트릭: Observer 첫 감지 강제
  requestAnimationFrame(() => {
    const cur = screen.scrollTop;
    screen.scrollTop = cur + 1;
    requestAnimationFrame(() => { screen.scrollTop = cur; });
  });
}

function showAdminPicker() {
  const pw = prompt('관리자 비밀번호');
  if (pw === null) return;
  if (pw !== '0907') { showToast('❌ 비밀번호가 틀렸어요'); return; }
  location.href = '/admin';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let feedCat = 'all';
let searchQ = '';
let searchTimer = null;

// ─────────────────────────────────────────────
// 피드: CSS scroll-snap 방식 (JS 높이계산 없음)
// ─────────────────────────────────────────────

// 유튜브 썸네일 폴백: maxresdefault → hqdefault → 업체 썸네일 → 그라데이션
function feedThumbFallback(img, shopThumb) {
  const src = img.src || '';
  if (src.includes('maxresdefault')) {
    // 1단계: hqdefault 시도
    img.src = src.replace('maxresdefault', 'hqdefault');
  } else if (src.includes('hqdefault')) {
    // 2단계: 업체 등록 썸네일 시도
    if (shopThumb) {
      img.src = shopThumb;
    } else {
      // 3단계: 그라데이션 placeholder (img 숨기고 부모 배경 적용)
      img.style.display = 'none';
      img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
    }
  } else {
    // 업체 썸네일도 실패 → 그라데이션
    img.style.display = 'none';
    img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
  }
}

function feedCardHTML(s) {
  // iframe을 처음부터 삽입 (autoplay=0, mute=1)
  // 화면에 들어오면 자동재생, 이탈하면 src 비워서 정지
  const ytArea = s.youtubeId
    ? '<div class="yt-area"'
        + ' data-shopid="' + s.id + '" data-ytid="' + s.youtubeId + '">'
        + '<iframe class="feed-iframe"'
        + ' src=""'
        + ' data-src="https://www.youtube.com/embed/' + s.youtubeId
        + '?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&controls=1"'
        + ' allow="autoplay;encrypted-media;picture-in-picture;fullscreen"'
        + ' allowfullscreen></iframe>'
      + '</div>'
    : '<div class="yt-area" style="background:linear-gradient(135deg,#1a1a1a,#111)"></div>';
  // data-shop JSON 이스케이프 버그 → data-id/url/name 개별 속성으로 분리
  const safeUrl  = (s.smartPlaceUrl||'').replace(/"/g,'&quot;');
  const safeName = (s.name||'').replace(/"/g,'&quot;');
  const bookBtn = s.smartPlaceUrl
    ? '<button class="btn-book' + (s.isPremium ? ' btn-book-premium' : '') + '"'
        + ' data-id="' + s.id + '"'
        + ' data-url="' + safeUrl + '"'
        + ' data-name="' + safeName + '"'
        + ' onclick="'
            + 'curShop={id:+this.dataset.id,name:this.dataset.name,smartPlaceUrl:this.dataset.url};'
            + 'openInapp()">'
        + '<i class="fas fa-calendar-check"></i><span>예약하기</span></button>'
    : '';
  // 프리미엄 뱃지
  const premiumBadge = s.isPremium
    ? '<div class="feed-premium-badge"><span>✦</span> PREMIUM</div>'
    : '';
  // 프리미엄 테두리 글로우
  const premiumClass = s.isPremium ? ' fi-premium' : '';
  return '<div class="fi' + premiumClass + '" data-id="' + s.id + '">'
    + ytArea
    + premiumBadge
    + '<div class="shop-bar' + (s.isPremium ? ' shop-bar-premium' : '') + '">'
      + '<div class="shop-bar-info">'
        + '<div class="shop-bar-cat' + (s.isPremium ? ' shop-bar-cat-premium' : '') + '">'
          + (s.isPremium ? '✦ ' : '') + (s.category||'') + '</div>'
        + '<div class="shop-bar-name">' + (s.name||'') + '</div>'
        + '<div class="shop-bar-loc"><i class="fas fa-map-marker-alt"></i><span>'
          + (s.address || s.district || '') + (s.price ? ' · ' + s.price : '') + '</span></div>'
        + (s.desc ? '<div class="shop-bar-desc">' + s.desc + '</div>' : '')
      + '</div>'
      + bookBtn
    + '</div>'
  + '</div>';
}

async function loadFeed(cat='all', q='') {
  feedCat = cat;
  const scr = document.getElementById('feedScreen');

  // 스켈레톤 카드 3장
  const sc = 'skel-card', sv = 'skel-video', sb = 'skel-bar', sl = 'skel-line';
  const skelCard = '<div class="'+sc+'"><div class="'+sv+'"></div><div class="'+sb+'">'
    +'<div class="'+sl+'" style="height:18px;width:55%"></div>'
    +'<div class="'+sl+'" style="height:13px;width:75%"></div>'
    +'<div class="'+sl+'" style="height:13px;width:40%"></div>'
    +'</div></div>';
  scr.innerHTML = skelCard + skelCard + skelCard;

  let url = '/api/shops?category=' + encodeURIComponent(cat==='all'||cat==='recommended'?'':cat) + '&shuffle=1';
  if (cat === 'recommended') url = '/api/shops?category=recommended';
  if (q) url += '&q=' + encodeURIComponent(q);
  const shops = await fetch(url).then(r=>r.json());

  if (!shops.length) {
    scr.innerHTML = '<div class="feed-empty"><i class="fas fa-search"></i><p>'
      + (cat==='recommended' ? '추천 업체가 없어요' : q ? '"'+q+'" 검색 결과가 없어요' : '등록된 샵이 없어요') + '</p></div>';
    return;
  }

  // ── 프리미엄 업체 5장마다 재삽입 ──
  const premiums = shops.filter(s => s.isPremium);
  const normals  = shops.filter(s => !s.isPremium);
  const INTERVAL = 5;
  const merged = [];
  let pi = 0;
  premiums.forEach(s => merged.push(s));
  if (premiums.length > 0) {
    normals.forEach((s, i) => {
      merged.push(s);
      if ((i + 1) % INTERVAL === 0) {
        merged.push(premiums[pi % premiums.length]);
        pi++;
      }
    });
  } else {
    normals.forEach(s => merged.push(s));
  }

  // 카드 렌더
  scr.innerHTML = merged.map(feedCardHTML).join('');
  scr.scrollTop = 0;

  // 카드 스크롤 정지 감지 Observer 연결
  initFeedStopObserver();
}

// ── 스크롤 기반으로 현재 카드 감지 → 재생/정지 ──
let _feedCurrentCard = null;
let _feedScrollTimer = null;

function feedActivateCard(ytDiv) {
  if (_feedCurrentCard === ytDiv) return;
  // 이전 카드 정지: src를 about:blank로
  if (_feedCurrentCard) {
    const prev = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (prev && !prev.dataset.paused) {
      prev.dataset.paused = '1';
      prev.src = 'about:blank';
    }
  }
  _feedCurrentCard = ytDiv;
  // 피드 탭이 아니면 재생하지 않음 (릴스 등 다른 탭에서 호출 방지)
  if (!document.getElementById('feedScreen').classList.contains('active')) return;
  // 현재 카드 재생
  const iframe = ytDiv.querySelector('iframe.feed-iframe');
  if (iframe && iframe.dataset.src) {
    delete iframe.dataset.paused;
    iframe.src = iframe.dataset.src;
    const shopId = ytDiv.dataset.shopid;
    const source = feedCat === 'recommended' ? 'catalog' : 'feed';
    if (feedCat === 'recommended') fetch('/api/track/rec/'+shopId,{method:'POST'}).catch(()=>{});
    trackView(shopId, source);
  }
}

function feedFindCurrentCard(scr) {
  // 화면 중앙에 가장 많이 격치는 .yt-area 찾기
  const cards = scr.querySelectorAll('.yt-area[data-ytid]');
  const scrMid = scr.scrollTop + scr.clientHeight / 2;
  let best = null, bestDist = Infinity;
  cards.forEach(card => {
    const mid = card.offsetTop + card.offsetHeight / 2;
    const dist = Math.abs(mid - scrMid);
    if (dist < bestDist) { bestDist = dist; best = card; }
  });
  return best;
}

function initFeedStopObserver() {
  _feedCurrentCard = null;
  const scr = document.getElementById('feedScreen');

  // 스크롤 리스너 중복 방지
  if (scr._feedScrollHandler) scr.removeEventListener('scroll', scr._feedScrollHandler);
  scr._feedScrollHandler = () => {
    clearTimeout(_feedScrollTimer);
    _feedScrollTimer = setTimeout(() => {
      const cur = feedFindCurrentCard(scr);
      if (cur) feedActivateCard(cur);
    }, 150);
  };
  scr.addEventListener('scroll', scr._feedScrollHandler, { passive: true });

  // 첫 번째 카드는 피드 탭 활성 시에만 재생 (switchTab('feed') 에서 처리)
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach((b)=>b.classList.remove('active'));
  btn.classList.add('active');
  loadFeed(cat, searchQ);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 검색
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  if (searchOpen) _sessionTrackSearch(); // 👁️ 세션 추적 - 검색 열기
  const bar  = document.getElementById('searchBar');
  const icon = document.getElementById('searchBtnIcon');
  const catBar = document.getElementById('catBar');
  const sCatBar = document.getElementById('shortsCatBar');
  bar.classList.toggle('open', searchOpen);
  icon.className = searchOpen ? 'fas fa-times' : 'fas fa-search';
  // 검색바 높이(62px)만큼 catBar 아래로
  document.documentElement.style.setProperty('--sb', searchOpen ? '62px' : '0px');
  // 릴스 탭 카탈로그바: 검색 열릴 때 숨기고, 닫힐 때 복원
  if (sCatBar) sCatBar.style.visibility = searchOpen ? 'hidden' : '';
  if (searchOpen) {
    setTimeout(()=>document.getElementById('searchInput').focus(), 320);
  } else {
    clearSearch();
  }
}

function getActiveTab() {
  if (document.getElementById('shortsScreen').classList.contains('active')) return 'shorts';
  if (document.getElementById('mapScreen').classList.contains('active'))   return 'map';
  if (document.getElementById('inquiryScreen').classList.contains('active')) return 'inquiry';
  return 'feed';
}

function onSearchInput(val) {
  searchQ = val.trim();
  document.getElementById('searchClear').classList.toggle('show', !!searchQ);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const activeTab = getActiveTab();
    if (activeTab === 'map') {
      loadMapShops(mapCat, nearbyOn, searchQ);
    } else if (activeTab === 'shorts') {
      // 숏폼 탭은 검색 미지원 (업체 전체 피드)
    } else {
      loadFeed(feedCat, searchQ);
    }
  }, 350);
}

function clearSearch() {
  searchQ = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  document.getElementById('searchClear').classList.remove('show');
  const activeTab = getActiveTab();
  if (activeTab === 'map') {
    loadMapShops(mapCat, nearbyOn, '');
  } else if (activeTab === 'shorts') {
    // 숏폼은 검색 미지원
  } else {
    loadFeed(feedCat, '');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 네이버 지도
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function waitNaverMap(cb, tries=0) {
  if (window.naver && window.naver.maps) { cb(); return; }
  if (tries > 40) { showToast('지도 로드 실패. 새로고침 해주세요'); return; }
  setTimeout(()=>waitNaverMap(cb, tries+1), 200);
}

function initMap() {
  if (mapInited) {
    if (naverMap) {
      naverMap.autoResize();
      loadMapShops(mapCat, nearbyOn, searchQ);
    }
    return;
  }
  // display:none 우회: naverMap 크기를 window 기준으로 강제 지정
  const hd  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hd') || '56');
  const nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav') || '60');
  const nm  = document.getElementById('naverMap');
  nm.style.width  = window.innerWidth  + 'px';
  nm.style.height = (window.innerHeight - hd - nav) + 'px';
  waitNaverMap(()=>{
    mapInited = true;
    naverMap = new naver.maps.Map('naverMap', {
      center: new naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
    });
    naver.maps.Event.addListener(naverMap, 'click', ()=>closeMapPopup());
    loadMapShops('all', false);
  });
}

function catClass(cat) { return CAT_CLASS[cat] || ''; }

// 카테고리별 배경색 (인라인 스타일용)
const CAT_COLOR = {
  '마사지':'#10B981', '헤드스파':'#6366F1',
  '피부관리':'#FF4D7D', '헤어':'#F59E0B', '메이크업':'#C084FC',
  '왁싱':'#EC4899', '반영구':'#06B6D4', '병원':'#3B82F6', '그외':'#8B5CF6',
};
function pinColor(cat) { return CAT_COLOR[cat] || '#FF4D7D'; }

// DOM 엘리먼트 방식으로 마커 생성 (썸네일 카드형)
function buildMarkerEl(shop, selected) {
  const isPrem = !!shop.isPremium;
  const ac   = isPrem ? '#FFD700' : pinColor(shop.category);
  const scale = selected ? 'scale(1.18)' : (isPrem ? 'scale(1.08)' : 'scale(1)');
  const shadow = selected
    ? '0 6px 28px rgba(0,0,0,.8)'
    : isPrem
      ? '0 4px 20px rgba(255,200,0,.6), 0 2px 12px rgba(0,0,0,.5)'
      : '0 3px 12px rgba(0,0,0,.5)';
  const border = selected
    ? '2.5px solid #fff'
    : isPrem
      ? '2.5px solid #FFD700'
      : '2px solid rgba(255,255,255,.4)';
  const cardWidth = isPrem ? '108px' : '90px';

  // 썸네일: 유튜브 우선 → 등록 썸네일 → 카테고리 색 배경
  const thumbUrl = shop.youtubeId
    ? 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg'
    : shop.thumbnail || '';

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'display:flex;flex-direction:column;align-items:center;',
    'cursor:pointer;',
    'transform:' + scale + ';transition:transform .2s;',
  ].join('');

  // 프리미엄 글로우 링 (애니메이션)
  if (isPrem && !selected) {
    const glow = document.createElement('div');
    glow.style.cssText = [
      'position:absolute;',
      'width:' + cardWidth + ';height:70px;',
      'border-radius:12px;',
      'background:transparent;',
      'border:2px solid rgba(255,215,0,.5);',
      'animation:premGlow 2s ease-in-out infinite;',
      'pointer-events:none;',
      'z-index:-1;',
    ].join('');
    wrap.appendChild(glow);
  }

  // 카드 본체
  const card = document.createElement('div');
  card.style.cssText = [
    'border-radius:10px;overflow:hidden;',
    'box-shadow:' + shadow + ';',
    'border:' + border + ';',
    'width:' + cardWidth + ';',
    'background:' + (isPrem ? '#1a1500' : '#111') + ';',
    'position:relative;',
  ].join('');

  // 프리미엄 뱃지 (카드 위)
  if (isPrem) {
    const badge = document.createElement('div');
    badge.style.cssText = [
      'position:absolute;top:3px;left:4px;z-index:5;',
      'background:linear-gradient(90deg,#FFD700,#FFA500);',
      'color:#000;font-size:8px;font-weight:900;',
      'padding:2px 6px;border-radius:8px;',
      'letter-spacing:.3px;',
      'box-shadow:0 1px 6px rgba(255,180,0,.6);',
    ].join('');
    badge.textContent = '✦ PREMIUM';
    card.appendChild(badge);
  }

  // 썸네일 영역
  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'width:' + cardWidth + ';height:' + (isPrem ? '68px' : '56px') + ';overflow:hidden;position:relative;';

  if (thumbUrl) {
    const img = document.createElement('img');
    img.src = thumbUrl;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function() {
      if (this.src.includes('maxresdefault')) {
        this.onerror = function() { imgWrap.style.background = ac; this.style.display='none'; };
        this.src = 'https://img.youtube.com/vi/' + shop.youtubeId + '/hqdefault.jpg';
      } else { imgWrap.style.background = ac; this.style.display='none'; }
    };
    imgWrap.appendChild(img);
  } else {
    imgWrap.style.background = isPrem
      ? 'linear-gradient(135deg,#2a1f00,#1a1200)'
      : ac;
    imgWrap.style.display = 'flex';
    imgWrap.style.alignItems = 'center';
    imgWrap.style.justifyContent = 'center';
    imgWrap.innerHTML = '<span style="font-size:' + (isPrem ? '26px' : '22px') + '">💄</span>';
  }

  // 유튜브 아이콘 뱃지
  if (shop.youtubeId) {
    const ytBadge = document.createElement('div');
    ytBadge.style.cssText = [
      'position:absolute;bottom:3px;right:3px;',
      'background:rgba(255,0,0,.85);border-radius:3px;',
      'padding:1px 4px;font-size:9px;color:#fff;font-weight:700;',
    ].join('');
    ytBadge.textContent = '▶';
    imgWrap.appendChild(ytBadge);
  }

  // 업체명 라벨
  const label = document.createElement('div');
  label.style.cssText = [
    'font-size:' + (isPrem ? '11px' : '10px') + ';font-weight:800;',
    'color:' + (isPrem ? '#FFD700' : '#fff') + ';',
    'padding:' + (isPrem ? '5px 6px' : '4px 5px') + ';',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    'text-align:center;',
    'background:' + (isPrem ? 'rgba(30,20,0,.92)' : 'rgba(0,0,0,.75)') + ';',
    'font-family:-apple-system,sans-serif;',
    'border-top:1px solid ' + (isPrem ? 'rgba(255,200,0,.3)' : 'rgba(255,255,255,.1)') + ';',
  ].join('');
  label.textContent = shop.name;

  card.appendChild(imgWrap);
  card.appendChild(label);

  // 말풍선 꼬리
  const tailColor = selected
    ? 'rgba(255,255,255,.9)'
    : isPrem ? '#FFD700' : 'rgba(255,255,255,.4)';
  const tail = document.createElement('div');
  tail.style.cssText = [
    'width:0;height:0;',
    'border-left:' + (isPrem ? '8px' : '7px') + ' solid transparent;',
    'border-right:' + (isPrem ? '8px' : '7px') + ' solid transparent;',
    'border-top:' + (isPrem ? '10px' : '9px') + ' solid ' + tailColor + ';',
    'margin-top:-1px;',
  ].join('');

  wrap.appendChild(card);
  wrap.appendChild(tail);
  wrap.onclick = (e) => { e.stopPropagation(); selectShopOnMap(shop.id); };
  return wrap;
}

function createNaverMarker(shop, selected=false) {
  const el  = buildMarkerEl(shop, selected);
  const pos = new naver.maps.LatLng(shop.lat, shop.lng);
  const overlay = new naver.maps.CustomOverlay({
    position: pos,
    content: el,
    anchor: new naver.maps.Point(45, 74),
    zIndex: selected ? 200 : (shop.isPremium ? 150 : shop.featured ? 100 : 10),
    map: naverMap,
  });
  return overlay;
}

function fitMapToBounds(shops) {
  if (!shops.length || !naverMap) return;
  if (shops.length === 1) {
    naverMap.setCenter(new naver.maps.LatLng(shops[0].lat, shops[0].lng));
    naverMap.setZoom(14);
  } else {
    const lats = shops.map(s => s.lat);
    const lngs = shops.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    naverMap.fitBounds(bounds, { top: 80, right: 60, bottom: 140, left: 60 });
    setTimeout(() => {
      if (naverMap.getZoom() > 14) naverMap.setZoom(14);
    }, 350);
  }
}

function renderNaverMarkers(shops) {
  Object.values(nvMarkers).forEach(o => o.setMap(null));
  nvMarkers = {};
  if (!shops.length) return;
  shops.forEach(shop => {
    nvMarkers[shop.id] = createNaverMarker(shop, false);
  });
  // 지도 렌더 완료 후 fitBounds (타이밍 넉넉히)
  setTimeout(() => fitMapToBounds(shops), 100);
  setTimeout(() => fitMapToBounds(shops), 600);
}

function selectShopOnMap(id) {
  _sessionTrackMapPin(); // 👁️ 세션 추적 - 지도 마커 클릭
  const shop = allShops.find(s=>s.id===id);
  if (!shop) return;
  _sessionEvent('map_pin', shop);     // 👁️ 업체 이벤트
  curShop = shop;

  // 마커 선택 상태 갱신
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (!s) return;
    overlay.setContent(buildMarkerEl(s, +sid===id));
    overlay.setZIndex(+sid===id ? 200 : (s.isPremium ? 150 : s.featured ? 100 : 10));
  });

  // 지도 중심 이동 (팝업 높이만큼 위로 offset)
  naverMap.panTo(new naver.maps.LatLng(shop.lat, shop.lng));



  // ── 지도 위 팝업 카드 열기 ──
  openMapPopup(shop);
}

// ── 지도 위 팝업 카드 ──────────────────────────────────────────────────────
let popupYtLoaded = false;

function openMapPopup(shop) {
  const popup = document.getElementById('mapPopup');
  const ytEl  = document.getElementById('mpYt');

  // 유튜브 or 썸네일
  if (shop.youtubeId) {
    const ytThumb = 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg';
    ytEl.innerHTML = \`
      <div class="mp-yt-thumb-wrap" style="position:relative;width:100%;padding-top:52%;background:#111;overflow:hidden">
        <img src="\${ytThumb}"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;cursor:pointer"
          onerror="if(this.src.includes('maxresdefault')){this.src=this.src.replace('maxresdefault','hqdefault')}else{this.style.display='none'}"
          onclick="loadYtInPopup('\${shop.youtubeId}')" alt=""/>
        <div onclick="loadYtInPopup('\${shop.youtubeId}')"
          style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                 background:rgba(0,0,0,.3);cursor:pointer">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.93);
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 4px 20px rgba(0,0,0,.5)">
            <i class="fas fa-play" style="color:#111;font-size:20px;margin-left:4px"></i>
          </div>
        </div>
      </div>
    \`;
  } else if (shop.thumbnail) {
    ytEl.innerHTML = \`<img src="\${shop.thumbnail}"
      onerror="this.style.display='none'"
      style="width:100%;height:160px;object-fit:cover;display:block" alt=""/>\`;
  } else {
    ytEl.innerHTML = '';
  }

  // 텍스트 정보
  const bg = pinColor(shop.category);
  document.getElementById('mpBadge').innerHTML =
    \`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:\${bg};margin-right:4px"></span>\${shop.category}\`;
  document.getElementById('mpName').textContent  = shop.name;
  document.getElementById('mpMeta').innerHTML    =
    \`<i class="fas fa-map-marker-alt" style="color:var(--green)"></i>\${shop.district}&nbsp;·&nbsp;\${shop.price}\`;
  document.getElementById('mpDesc').textContent  = shop.desc || '';
  document.getElementById('mpTags').innerHTML    =
    shop.tags.map(t=>\`<span class="mp-tag">\${t}</span>\`).join('');

  // 프리미엄 뱃지
  const mpPremEl = document.getElementById('mpPremiumBadge');
  if (mpPremEl) {
    mpPremEl.style.display = shop.isPremium ? 'inline-flex' : 'none';
  }
  // 프리미엄 팝업 테두리 강조
  if (shop.isPremium) {
    popup.style.border = '1.5px solid rgba(255,200,0,.45)';
    popup.style.boxShadow = '0 8px 32px rgba(0,0,0,.7), 0 0 0 1px rgba(255,200,0,.2)';
  } else {
    popup.style.border = '1px solid rgba(255,255,255,.1)';
    popup.style.boxShadow = '0 8px 32px rgba(0,0,0,.7)';
  }

  const bookEl = document.getElementById('mpBook');
  bookEl.style.opacity      = shop.smartPlaceUrl ? '1' : '.35';
  bookEl.style.pointerEvents= shop.smartPlaceUrl ? 'auto' : 'none';
  // 프리미엄 예약 버튼 스타일
  if (shop.isPremium && shop.smartPlaceUrl) {
    bookEl.style.background = 'linear-gradient(135deg,#FFD700,#FF8C00)';
    bookEl.style.color = '#000';
    bookEl.style.boxShadow = '0 3px 12px rgba(255,180,0,.4)';
  } else {
    bookEl.style.background = '';
    bookEl.style.color = '';
    bookEl.style.boxShadow = '';
  }

  popup.classList.add('show');
}

function loadYtInPopup(ytId) {
  // 지도 팝업 썸네일 클릭 → 영상조회 카운팅 (세션 내 1회, 출처: map)
  if (curShop?.id) trackView(curShop.id, 'map');
  document.getElementById('mpYt').innerHTML = \`
    <div style="position:relative;width:100%;padding-top:52%;background:#000">
      <iframe style="position:absolute;inset:0;width:100%;height:100%;border:none"
        src="https://www.youtube.com/embed/\${ytId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1"
        allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>
    </div>
  \`;
}

function closeMapPopup() {
  document.getElementById('mapPopup').classList.remove('show');
  // 유튜브 멈추기
  document.getElementById('mpYt').innerHTML = '';
  // 마커 선택 해제
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (s) { overlay.setContent(buildMarkerEl(s,false)); overlay.setZIndex(s.isPremium ? 150 : s.featured ? 100 : 10); }
  });
  curShop = null;
}

async function loadMapShops(cat, nearby, q='') {
  let url = '/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if (nearby && userLat) url += '&nearby=1&lat='+userLat+'&lng='+userLng;
  if (q) url += '&q='+encodeURIComponent(q);
  const res = await fetch(url);
  allShops  = await res.json();
  renderNaverMarkers(allShops);
}

function filterMap(btn, cat) {
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mapCat = cat;
  const frame = document.getElementById('mapFrame');
  if (frame) frame.contentWindow.postMessage({ type:'filterCat', cat }, '*');
}

function toggleNearby() {
  const fab = document.getElementById('nearbyFab');
  if (nearbyOn) {
    nearbyOn=false; userLat=null; userLng=null;
    fab.classList.remove('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변';
    if (userMarker) { userMarker.setMap(null); userMarker=null; }
    loadMapShops(mapCat, false);
    return;
  }
  if (!navigator.geolocation) { showToast('위치 서비스를 지원하지 않아요'); return; }
  showToast('📍 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude; userLng=pos.coords.longitude;
    nearbyOn=true;
    fab.classList.add('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변 ON';
    if (userMarker) userMarker.setMap(null);
    userMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(userLat, userLng),
      map: naverMap,
      icon: {
        content:'<div style="width:16px;height:16px;border-radius:50%;background:#FF4D7D;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        anchor: new naver.maps.Point(8,8),
      }
    });
    naverMap.setCenter(new naver.maps.LatLng(userLat, userLng));
    naverMap.setZoom(14);
    loadMapShops(mapCat, true);
    showToast('📍 내 주변 샵을 찾았어요!');
  }, ()=>{ showToast('위치 권한이 필요해요'); }, {timeout:8000,enableHighAccuracy:true});
}

// ── 피드 바텀시트 (피드 탭 전용) ─────────────────────────────────────────
function openFeedSheet(id) {
  const s = allShops.find(x=>x.id===id);
  if (!s) return;
  curShop = s;
  document.getElementById('sImg').src            = s.thumbnail;
  document.getElementById('sCat').textContent    = s.category;
  document.getElementById('sName').textContent   = s.name;
  document.getElementById('sAddr').textContent   = s.address;
  document.getElementById('sPhone').textContent  = s.phone||'';
  document.getElementById('sDesc').textContent   = s.desc||'';
  document.getElementById('sPrice').textContent  = s.price;
  document.getElementById('sTags').innerHTML     = s.tags.map(t=>\`<span class="s-tag">\${t}</span>\`).join('');
  const bookEl = document.getElementById('sBook');
  bookEl.style.opacity = s.smartPlaceUrl ? '1' : '.4';
  bookEl.style.pointerEvents = s.smartPlaceUrl ? 'auto' : 'none';
  document.getElementById('dim').classList.add('on');
  document.getElementById('sheet').classList.add('open');
}
function closeFeedSheet() {
  document.getElementById('dim').classList.remove('on');
  document.getElementById('sheet').classList.remove('open');
}
// ── 마지막 영상 재생 출처 기억 (예약클릭 전환율 분석용) ──────────────────
// trackView() 호출 시 갱신 → 예약클릭 시 참조
let lastViewSrc = null; // 'feed' | 'catalog' | 'map' | null

// 피드 예약 트래킹 (영상 시청 출처 포함)
function trackSP() {
  if (!curShop) return;
  fetch('/api/track/sp/' + curShop.id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// 지도 예약 트래킹 (영상 시청 출처 포함)
function trackMapSP(id) {
  fetch('/api/track/mapsp/' + id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// 지도 팝업 예약버튼 전용 (인라인 onclick 대체)
function trackMapSPWithSrc(id) {
  _sessionTrackMapBook(); // 👁️ 세션 추적 - 지도 예약클릭
  _sessionEvent('map_book', curShop); // 👁️ 업체 이벤트
  trackMapSP(id);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 예약 모달 (m.place.naver.com iframe)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _rsvOrigUrl = '';
function openInapp() {
  if (!curShop || !curShop.smartPlaceUrl) { showToast('예약 링크가 없어요'); return; }
  _sessionTrackFeedBook(); // 👁️ 세션 추적 - 피드 예약클릭
  _sessionEvent('feed_book', curShop); // 👁️ 업체 이벤트
  trackSP();
  _rsvOrigUrl = curShop.smartPlaceUrl;
  const name = curShop.name || '';
  document.getElementById('rsvTitle').textContent = name + ' 예약하기';
  // 외부열기 버튼 → 원본 naver.me URL 유지
  document.getElementById('rsvExtBtn').onclick = () =>
    window.open(_rsvOrigUrl, '_blank', 'noopener,noreferrer');
  // 모달 먼저 열고
  const frame   = document.getElementById('rsvFrame');
  const loading = document.getElementById('rsvLoading');
  frame.src = '';
  loading.classList.remove('hide');
  document.getElementById('rsvDim').classList.add('show');
  document.getElementById('rsvModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  // 서버에서 naver.me → m.place.naver.com 변환
  fetch('/api/resolve-naver?url=' + encodeURIComponent(_rsvOrigUrl))
    .then(r => r.json())
    .then(d => {
      frame.src = d.resolved;
      frame.onload = () => loading.classList.add('hide');
    })
    .catch(() => {
      // 실패 시 원본 URL 직접 사용
      frame.src = _rsvOrigUrl;
      frame.onload = () => loading.classList.add('hide');
    });
}
function closeReserve() {
  document.getElementById('rsvDim').classList.remove('show');
  document.getElementById('rsvModal').classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => {
    const f = document.getElementById('rsvFrame');
    if (f) f.src = '';
  }, 400);
}
// 스와이프 다운으로 닫기 (topbar 영역만)
(function(){
  const topbar = document.querySelector('.rsv-topbar');
  if (!topbar) return;
  let sy = 0;
  topbar.addEventListener('touchstart', e => {
    sy = e.touches[0].clientY;
  }, {passive:true});
  topbar.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - sy > 50) closeReserve();
  }, {passive:true});
})();

// ── 지도 iframe → 메인 페이지 예약 모달 트리거 ─────────────────────────────
window.addEventListener('message', e => {
  if (e.data?.type === 'openInapp' && e.data.shop) {
    curShop = e.data.shop;
    openInapp();
  }
});

// 스와이프 다운으로 피드 시트 닫기
let tsY=0;
const sh=document.getElementById('sheet');
sh.addEventListener('touchstart',e=>{tsY=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchend',  e=>{if(e.changedTouches[0].clientY-tsY>70)closeFeedSheet()},{passive:true});

// ── 토스트 ───────────────────────────────────────────────────────────────
let toastTmr;
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTmr);
  toastTmr=setTimeout(()=>t.classList.remove('show'),2600);
}

function submitInquiry() {
  const owner = document.getElementById('iq-owner').value.trim();
  const phone = document.getElementById('iq-phone').value.trim();
  const name  = document.getElementById('iq-name').value.trim();
  const cat   = document.getElementById('iq-cat').value;
  const area  = document.getElementById('iq-area').value.trim();
  const agreed = document.getElementById('iq-agree-chk').checked;
  if (!owner || !phone || !name || !cat || !area) {
    showToast('⚠️ 필수 항목을 모두 입력해 주세요');
    return;
  }
  if (!agreed) {
    showToast('⚠️ 개인정보 수집·이용에 동의해 주세요');
    return;
  }
  const url = document.getElementById('iq-url').value.trim();
  const msg = document.getElementById('iq-msg').value.trim();
  _sessionTrackInquiry(); // 👁️ 세션 추적 - 문의 제출
  fetch('/api/inquiry', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, owner, category:cat, area, phone, url, message:msg })
  }).then(r => r.json()).then(() => {
    document.getElementById('iqForm').style.display = 'none';
    document.querySelector('.iq-agree').style.display = 'none';
    document.querySelector('.iq-submit').style.display = 'none';
    document.getElementById('iqDone').style.display = 'block';
    document.getElementById('iqDone').scrollIntoView({behavior:'smooth'});
  }).catch(() => {
    showToast('❌ 전송에 실패했어요. 다시 시도해 주세요');
  });
}

// 앱 진입 시 방문자 카운팅 (새로고침·최초진입 모두 포함)
fetch('/api/track/visit', { method: 'POST' }).catch(() => {});

loadFeed('all');
<\/script>
</body>
</html>`}function ao(e,t){const s=Xn(e),r=zi(e),i=vs(e.address),a=er(e.address),l=i||a,o=Yn(e.category),p=e.thumbnail||`${t}/og-image.jpg`,h=`${t}/shop/${e.id}`,f=Array.isArray(e.tags)?e.tags:[],b={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"}[e.category]||"🌟",x={"@context":"https://schema.org","@type":o,"@id":h,name:e.name,description:r,url:h,telephone:e.phone||void 0,address:{"@type":"PostalAddress",streetAddress:e.address,addressLocality:l,addressRegion:a,addressCountry:"KR"},geo:e.lat&&e.lng?{"@type":"GeoCoordinates",latitude:e.lat,longitude:e.lng}:void 0,image:e.thumbnail?{"@type":"ImageObject",url:e.thumbnail,width:800,height:600}:void 0,priceRange:e.price||void 0,hasMap:e.smartPlaceUrl||void 0,sameAs:e.smartPlaceUrl?[e.smartPlaceUrl]:void 0,...e.category==="마사지"&&{serviceType:"마사지·스파"},...e.category==="헤드스파"&&{serviceType:"헤드스파·두피케어"},...e.category==="피부관리"&&{serviceType:"피부관리·에스테틱"},...e.category==="헤어"&&{serviceType:"헤어살롱·미용실"}},d=JSON.stringify(x),u=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:t},{"@type":"ListItem",position:2,name:`${l} ${e.category}`,item:`${t}/c/${encodeURIComponent(e.category)}/${encodeURIComponent(l)}`},{"@type":"ListItem",position:3,name:e.name,item:h}]}),v=[e.name,`${l} ${e.category}`,`${l} ${e.category} 추천`,`${l} ${e.category} 잘하는 곳`,`${l} ${e.category} 예약`,`${l} ${e.category} 가격`,`${l} ${e.category} 후기`,`${a} ${e.category}`,`${e.name} 예약`,`${e.name} 위치`,...f.map(w=>`${l} ${w}`)].filter(Boolean).join(",");return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${s}</title>
<meta name="description" content="${r}"/>
<meta name="keywords" content="${v}"/>
<link rel="canonical" href="${h}"/>
<meta property="og:type"        content="business.business"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${s}"/>
<meta property="og:description" content="${r}"/>
<meta property="og:image"       content="${p}"/>
<meta property="og:url"         content="${h}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${s}"/>
<meta name="twitter:description" content="${r}"/>
<meta name="twitter:image"       content="${p}"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${d}<\/script>
<script type="application/ld+json">${u}<\/script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh}
.wrap{max-width:640px;margin:0 auto;padding-bottom:90px}
.top{display:flex;align-items:center;gap:12px;padding:14px 16px;position:sticky;top:0;z-index:10;
  background:rgba(10,10,10,.95);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07)}
.back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:none;
  color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.site-nm{font-size:15px;font-weight:800;color:#FF4D7D;letter-spacing:-.3px}
.thumb{width:100%;aspect-ratio:16/9;object-fit:cover;background:#111}
.thumb-ph{width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);
  display:flex;align-items:center;justify-content:center;font-size:72px}
.info{padding:20px 16px 0}
.badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,77,125,.12);
  color:#FF4D7D;font-size:11px;font-weight:700;padding:4px 11px;border-radius:20px;margin-bottom:10px}
h1{font-size:26px;font-weight:800;line-height:1.2;margin-bottom:8px;letter-spacing:-.5px}
.addr{font-size:13px;color:rgba(255,255,255,.45);display:flex;align-items:flex-start;gap:5px;margin-bottom:4px;line-height:1.5}
.shop-desc{font-size:14px;color:rgba(255,255,255,.65);line-height:1.75;margin-top:14px;white-space:pre-wrap}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tag{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.65);font-size:11px;padding:4px 10px;border-radius:12px}
.price-box{margin:16px 16px 0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px 16px}
.price-lbl{font-size:11px;color:rgba(255,255,255,.35);margin-bottom:5px;font-weight:600}
.price-val{font-size:16px;font-weight:700}
.map-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 16px 0;
  padding:14px;border-radius:14px;background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.2);
  color:#03C75A;font-size:14px;font-weight:700;text-decoration:none;transition:background .2s}
.map-btn:hover{background:rgba(3,199,90,.18)}
.related{padding:28px 16px 0}
.rel-hd{font-size:12px;font-weight:700;color:rgba(255,255,255,.35);margin-bottom:12px;
  display:flex;align-items:center;gap:8px}
.rel-hd::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rel-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px;cursor:pointer;text-decoration:none;display:block;transition:background .2s}
.rel-card:hover{background:rgba(255,255,255,.08)}
.rel-cat{font-size:10px;color:#FF4D7D;font-weight:700;margin-bottom:3px}
.rel-nm{font-size:13px;font-weight:700;margin-bottom:3px}
.rel-addr{font-size:11px;color:rgba(255,255,255,.38)}
/* SEO용 숨긴 텍스트 (크롤러 가독성↑) */
.seo-text{font-size:13px;color:rgba(255,255,255,.45);line-height:1.8;padding:20px 16px 0}
.seo-text h2{font-size:15px;font-weight:700;margin-bottom:8px;color:rgba(255,255,255,.6)}
/* 예약 버튼 */
.rsv-bar{position:fixed;bottom:0;left:0;right:0;padding:12px 16px;
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.07);
  z-index:100}
.rsv-inner{display:flex;gap:10px;max-width:640px;margin:0 auto}
.btn-rsv{flex:1;padding:15px;border-radius:14px;border:none;
  background:linear-gradient(135deg,#FF4D7D,#FF8FA3);color:#fff;font-size:16px;font-weight:800;cursor:pointer}
.btn-home{flex:0 0 auto;padding:15px 18px;border-radius:14px;border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);color:#fff;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;
  display:flex;align-items:center;justify-content:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <button class="back" onclick="history.length>1?history.back():location.href='/'">&#8592;</button>
    <span class="site-nm">마이뷰티맵</span>
  </div>

  ${e.thumbnail?`<img class="thumb" src="${e.thumbnail}" alt="${e.name} ${l} ${e.category} 대표사진" loading="eager"/>`:`<div class="thumb-ph">${b}</div>`}

  <div class="info">
    <div class="badge">${b} ${e.category}</div>
    <h1>${e.name}</h1>
    <p class="addr">📍 <span>${e.address}</span></p>
    ${e.phone?`<p class="addr">📞 <a href="tel:${e.phone}" style="color:inherit;text-decoration:none">${e.phone}</a></p>`:""}
    ${e.desc?`<p class="shop-desc">${e.desc}</p>`:""}
    ${f.length?`<div class="tags">${f.map(w=>`<span class="tag">#${w}</span>`).join("")}</div>`:""}
  </div>

  ${e.price?`<div class="price-box"><div class="price-lbl">💰 가격 안내</div><div class="price-val">${e.price}</div></div>`:""}

  ${e.smartPlaceUrl?`<a class="map-btn" href="${e.smartPlaceUrl}" target="_blank" rel="noopener">🗺️ 네이버 지도에서 보기</a>`:""}

  <!-- SEO 텍스트 영역 – 크롤러 키워드 보강 -->
  <div class="seo-text">
    <h2>${l} ${e.category} 추천 – ${e.name}</h2>
    <p>${e.name}은(는) ${e.address}에 위치한 ${l} ${e.category} 전문샵입니다.
    ${f.length?f.join(", ")+" 등 다양한 시술을 제공하며,":""}
    ${e.price?"가격은 "+e.price+"입니다.":""}
    ${l} ${e.category} 예약은 마이뷰티맵에서 바로 확인하세요.</p>
  </div>

  <div class="related" id="relShops"></div>
</div>

<div class="rsv-bar">
  <div class="rsv-inner">
    ${e.smartPlaceUrl?`<button class="btn-rsv" onclick="window.open('${e.smartPlaceUrl}','_blank','noopener')">📅 네이버로 예약하기</button>`:`<button class="btn-rsv" onclick="location.href='/'">📅 다른 샵 예약하기</button>`}
    <a class="btn-home" href="/">홈</a>
  </div>
</div>

<script>
(async()=>{
  try{
    const r=await fetch('/api/shops?category=${encodeURIComponent(e.category)}');
    const list=await r.json();
    const others=list.filter(s=>s.id!==${e.id}).slice(0,4);
    if(!others.length)return;
    const el=document.getElementById('relShops');
    el.innerHTML='<div class="rel-hd">📍 ${l} 근처 ${e.category} 샵</div>'
      +'<div class="rel-grid">'+others.map(s=>{
        const a=(s.address||'').split(' ').slice(1,3).join(' ');
        return '<a class="rel-card" href="/shop/'+s.id+'">'
          +'<div class="rel-cat">'+s.category+'</div>'
          +'<div class="rel-nm">'+s.name+'</div>'
          +'<div class="rel-addr">📍 '+a+'</div>'
          +'</a>';
      }).join('')+'</div>';
  }catch(e){}
})();
<\/script>
</body>
</html>`}function no(e,t,s,r){const i=Kn(e,t),a=Jn(e,t,s.length),l=Zn(e,t),o=`${r}/c/${encodeURIComponent(e)}/${encodeURIComponent(t)}`,p={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},h=p[e]||"🌟",f=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],y=JSON.stringify({"@context":"https://schema.org","@type":"ItemList",name:i,description:a,url:o,numberOfItems:s.length,itemListElement:s.map((x,d)=>({"@type":"ListItem",position:d+1,name:x.name,url:`${r}/shop/${x.id}`,description:zi(x)}))}),b=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:r},{"@type":"ListItem",position:2,name:`${t} ${e}`,item:o}]});return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${i}</title>
<meta name="description" content="${a}"/>
<meta name="keywords" content="${l}"/>
<link rel="canonical" href="${o}"/>
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${i}"/>
<meta property="og:description" content="${a}"/>
<meta property="og:image"       content="${r}/og-image.jpg"/>
<meta property="og:url"         content="${o}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${i}"/>
<meta name="twitter:description" content="${a}"/>
<meta name="twitter:image"       content="${r}/og-image.jpg"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${y}<\/script>
<script type="application/ld+json">${b}<\/script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh}
.wrap{max-width:640px;margin:0 auto;padding-bottom:40px}
.top{display:flex;align-items:center;gap:12px;padding:14px 16px;position:sticky;top:0;z-index:10;
  background:rgba(10,10,10,.95);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07)}
.back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:none;
  color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.site-nm{font-size:15px;font-weight:800;color:#FF4D7D}
/* 히어로 */
.hero{padding:28px 16px 22px;background:linear-gradient(180deg,rgba(255,77,125,.07) 0%,transparent 100%)}
.hero-emoji{font-size:44px;margin-bottom:12px}
h1{font-size:26px;font-weight:800;line-height:1.25;margin-bottom:8px;letter-spacing:-.5px}
.hero-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:12px}
.hero-cnt{display:inline-block;background:rgba(255,77,125,.12);color:#FF4D7D;
  font-size:12px;font-weight:700;padding:4px 13px;border-radius:20px}
/* 빵부스러기 */
.bread{padding:12px 16px;font-size:12px;color:rgba(255,255,255,.3);display:flex;align-items:center;gap:6px}
.bread a{color:rgba(255,255,255,.3);text-decoration:none}
.bread a:hover{color:#FF4D7D}
/* 카테고리 탭 */
.cat-tabs{display:flex;gap:6px;padding:10px 16px;overflow-x:auto;scrollbar-width:none;
  border-bottom:1px solid rgba(255,255,255,.06)}
.cat-tabs::-webkit-scrollbar{display:none}
.ctab{flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.1);
  background:transparent;color:rgba(255,255,255,.45);font-size:12px;font-weight:600;
  cursor:pointer;text-decoration:none;white-space:nowrap;transition:all .2s}
.ctab.on{background:#FF4D7D;border-color:#FF4D7D;color:#fff}
/* 업체 리스트 */
.list{padding:12px 16px;display:flex;flex-direction:column;gap:12px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
  border-radius:16px;overflow:hidden;text-decoration:none;display:flex;transition:background .2s}
.card:hover{background:rgba(255,255,255,.08)}
.card-img{width:108px;min-height:100px;object-fit:cover;background:#1a1a1a;flex-shrink:0}
.card-ph{width:108px;display:flex;align-items:center;justify-content:center;
  font-size:38px;background:linear-gradient(135deg,#141414,#222)}
.card-body{padding:14px;flex:1;min-width:0}
.card-cat{font-size:10px;color:#FF4D7D;font-weight:700;margin-bottom:3px}
.card-nm{font-size:15px;font-weight:800;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card-addr{font-size:11px;color:rgba(255,255,255,.38);margin-bottom:6px}
.card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.card-tag{background:rgba(255,255,255,.06);color:rgba(255,255,255,.55);font-size:10px;padding:2px 7px;border-radius:10px}
.card-price{font-size:11px;color:rgba(255,255,255,.4)}
.card-arrow{font-size:16px;color:rgba(255,255,255,.2);align-self:center;padding-right:14px;flex-shrink:0}
/* 빈 상태 */
.empty{text-align:center;padding:60px 16px;color:rgba(255,255,255,.3)}
.empty-icon{font-size:52px;margin-bottom:14px}
/* SEO 텍스트 */
.seo-text{padding:24px 16px 0;font-size:13px;color:rgba(255,255,255,.38);line-height:1.8}
.seo-text h2{font-size:14px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:6px}
.seo-text p{margin-bottom:10px}
/* 다른 카테고리 */
.other{padding:24px 16px 0}
.other-hd{font-size:12px;font-weight:700;color:rgba(255,255,255,.3);margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:6px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.08);
  color:rgba(255,255,255,.4);font-size:11px;text-decoration:none;transition:all .2s}
.chip:hover{border-color:#FF4D7D;color:#FF4D7D}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <button class="back" onclick="history.length>1?history.back():location.href='/'">&#8592;</button>
    <span class="site-nm">마이뷰티맵</span>
  </div>

  <!-- 빵부스러기 (SEO) -->
  <nav class="bread" aria-label="breadcrumb">
    <a href="/">마이뷰티맵</a> › <span>${t} ${e}</span>
  </nav>

  <!-- 히어로 -->
  <div class="hero">
    <div class="hero-emoji">${h}</div>
    <h1>${t} ${e} 추천 TOP</h1>
    <p class="hero-sub">
      ${t} 인근 ${e} 전문샵 ${s.length}곳 모음<br>
      가격·위치·예약·후기까지 한눈에 확인하세요
    </p>
    <span class="hero-cnt">총 ${s.length}곳</span>
  </div>

  <!-- 카테고리 탭 -->
  <div class="cat-tabs">
    ${f.map(x=>`<a class="ctab${x===e?" on":""}" href="/c/${encodeURIComponent(x)}/${encodeURIComponent(t)}">${p[x]||"🌟"} ${x}</a>`).join("")}
  </div>

  <!-- 업체 목록 -->
  <div class="list">
    ${s.length?s.map((x,d)=>{const u=Array.isArray(x.tags)?x.tags:[],v=(x.address||"").split(" ").slice(1,3).join(" "),w=d===0?"🥇":d===1?"🥈":d===2?"🥉":`${d+1}.`;return`<a class="card" href="/shop/${x.id}">
        ${x.thumbnail?`<img class="card-img" src="${x.thumbnail}" alt="${x.name} ${t} ${e}" loading="lazy"/>`:`<div class="card-ph">${h}</div>`}
        <div class="card-body">
          <div class="card-cat">${w} ${x.category}</div>
          <div class="card-nm">${x.name}</div>
          <div class="card-addr">📍 ${v}</div>
          ${u.length?`<div class="card-tags">${u.map(E=>`<span class="card-tag">#${E}</span>`).join("")}</div>`:""}
          ${x.price?`<div class="card-price">💰 ${x.price}</div>`:""}
        </div>
        <div class="card-arrow">›</div>
      </a>`}).join(""):`
    <div class="empty">
      <div class="empty-icon">${h}</div>
      <div>${t} ${e} 업체를 준비 중이에요</div>
      <a href="/" style="color:#FF4D7D;font-size:13px;margin-top:12px;display:inline-block">전체 보기 →</a>
    </div>`}
  </div>

  <!-- SEO 텍스트 (크롤러 키워드 보강) -->
  <div class="seo-text">
    <h2>${t} ${e} 추천 가이드</h2>
    <p>${t} ${e} 잘하는 곳을 찾고 계신가요? 마이뷰티맵에서 ${t} 근처 ${e} 전문샵 ${s.length}곳을 한눈에 비교해 보세요. 가격, 위치, 예약, 후기까지 모두 확인 가능합니다.</p>
    <p>${t} ${e} 예약 방법, 가격 비교, 잘하는 곳 추천 정보를 마이뷰티맵에서 확인하세요. ${e} 전문 업체들의 상세 정보와 네이버 예약 링크를 바로 이용하실 수 있습니다.</p>
  </div>

  <!-- 다른 카테고리 -->
  <div class="other">
    <div class="other-hd">🔍 다른 카테고리도 찾아보기</div>
    <div class="chips">
      ${f.filter(x=>x!==e).map(x=>`<a class="chip" href="/c/${encodeURIComponent(x)}/${encodeURIComponent(t)}">${p[x]||"🌟"} ${t} ${x}</a>`).join("")}
    </div>
  </div>
</div>
</body>
</html>`}function oo(){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a;
  font-family:-apple-system,'Pretendard',sans-serif}
#naverMap{width:100%;height:100%;}

/* ── 하단 카드 (모바일) ── */
#card{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:#141414;
  border-radius:22px 22px 0 0;
  box-shadow:0 -4px 40px rgba(0,0,0,.8);
  border-top:1px solid rgba(255,255,255,.08);
  transform:translateY(100%);
  transition:transform .32s cubic-bezier(.22,.68,0,1.2);
  overflow-y:auto;   /* hidden 제거 → 스크롤 가능 */
  max-height:85vh;
}
#card.open{transform:translateY(0)}

/* ── PC: 오른쪽 사이드 패널 ── */
@media(min-width:768px){
  #card{
    top:0;bottom:0;right:0;left:auto;
    width:360px;
    border-radius:0;
    border-top:none;
    border-left:1px solid rgba(255,255,255,.08);
    box-shadow:-4px 0 40px rgba(0,0,0,.8);
    /* iframe 부모가 100vh보다 작을 수 있으므로 100% 사용 */
    max-height:100%;
    transform:translateX(100%);
    transition:transform .32s cubic-bezier(.22,.68,0,1.2);
    overflow-y:auto;
    /* 스크롤바 스타일 */
    scrollbar-width:thin;
    scrollbar-color:rgba(255,255,255,.15) transparent;
  }
  #card.open{transform:translateX(0)}
  .card-handle{display:none}
  .card-close{top:14px;right:14px}
}

/* PC: 360px 너비 고정 → 16:9 = 202px 높이 명시 (overflow-y:auto 안에서도 확실하게 동작) */
@media(min-width:768px){
  .card-media{
    height:202px !important;
    padding-top:0 !important;
    flex-shrink:0;
  }
}
.card-handle{width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.18);margin:10px auto 0;flex-shrink:0}

/* 미디어 영역 (유튜브 or 썸네일) */
.card-media{
  position:relative;
  width:100%;
  aspect-ratio:16/9;   /* 모바일: aspect-ratio 정상 동작 */
  background:#000;
  overflow:hidden;
  flex-shrink:0;
}
.card-media > *{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
}
.card-media img{object-fit:cover;display:block}
.card-media iframe{border:none}
/* 썸네일 위 플레이 버튼 */
.play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s;
}
.play-btn:hover{background:rgba(0,0,0,.15)}
.play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,0,0,.9);display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5);
}
.play-icon svg{margin-left:3px}
/* 카드 상단 뱃지 오버레이 */
.card-overlay{
  position:absolute;top:10px;left:10px;right:10px;
  display:flex;justify-content:space-between;align-items:flex-start;
  pointer-events:none;
}
.card-cat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;letter-spacing:.3px;backdrop-filter:blur(4px);
  background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);
}
.card-feat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;background:#FF4D7D;
}
.card-close{
  position:absolute;top:10px;right:10px;
  width:30px;height:30px;border-radius:50%;
  background:rgba(0,0,0,.6);backdrop-filter:blur(6px);
  border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  pointer-events:auto;
}

/* 카드 바디 */
.card-body{padding:14px 16px 28px}
.card-name{
  font-size:18px;font-weight:800;color:#fff;
  margin-bottom:8px;letter-spacing:-.4px;
}
/* 위치 + 가격 한 줄 */
.card-meta{
  display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;
}
.card-location{
  display:flex;align-items:center;gap:4px;
  font-size:12px;color:rgba(255,255,255,.45);
}
.card-location svg{flex-shrink:0}
.card-price{
  font-size:12px;font-weight:700;color:#FF4D7D;
  background:rgba(255,77,125,.12);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,77,125,.2);
}
/* 설명 */
.card-desc{
  font-size:13px;color:rgba(255,255,255,.55);
  line-height:1.55;margin-bottom:12px;
}
/* 태그 */
.card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.card-tag{
  font-size:11px;color:rgba(255,255,255,.45);
  background:rgba(255,255,255,.06);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,255,255,.09);
}
/* 예약 버튼 */
.btn-reserve{
  width:100%;height:46px;border-radius:14px;border:none;
  background:#03C75A;color:#fff;
  font-size:14px;font-weight:800;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-family:inherit;letter-spacing:-.2px;transition:opacity .15s;
}
.btn-reserve:hover{opacity:.88}

/* ── 지도 인앱 브라우저 시트 ── */
.map-inapp-bg{
  display:none;position:fixed;inset:0;z-index:900;
  background:rgba(0,0,0,.55);backdrop-filter:blur(2px);
}
.map-inapp-bg.show{display:block}
.map-inapp-sheet{
  position:fixed;left:0;right:0;bottom:0;z-index:901;
  height:92vh;
  background:#1a1a1a;border-radius:20px 20px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);transition:transform .32s cubic-bezier(.22,.68,0,1.2);
}
.map-inapp-sheet.show{transform:translateY(0)}
.map-inapp-handle{
  width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.2);margin:10px auto 0;flex-shrink:0;
}
.map-inapp-bar{
  display:flex;align-items:center;padding:10px 14px;
  border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;gap:6px;
}
.map-inapp-title{
  flex:1;font-size:14px;font-weight:700;color:#fff;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.map-inapp-btn{
  width:34px;height:34px;border-radius:10px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:#fff;flex-shrink:0;
}
.map-inapp-btn-ext{background:rgba(255,255,255,.1)}
.map-inapp-btn-ext:active{background:rgba(255,255,255,.2)}
.map-inapp-btn-close{background:rgba(255,77,125,.25)}
.map-inapp-btn-close:active{background:rgba(255,77,125,.45)}
.map-inapp-loader{
  flex-shrink:0;height:3px;background:rgba(255,255,255,.06);overflow:hidden;
}
.map-inapp-loader::after{
  content:'';display:block;height:100%;width:40%;
  background:#03C75A;animation:mload 1s ease-in-out infinite alternate;
}
@keyframes mload{from{transform:translateX(-100%)}to{transform:translateX(350%)}}
.map-inapp-loader.done{display:none}
.map-inapp-iframe{flex:1;border:none;background:#fff;width:100%;}
</style>
</head>
<body>
<div id="naverMap"></div>

<!-- 하단 카드 -->
<div id="card">
  <div class="card-handle"></div>
  <!-- 미디어 -->
  <div class="card-media" id="cardMedia">
    <!-- 썸네일+플레이버튼 래퍼: 전체 클릭 시 재생 -->
    <div id="thumbWrap" style="position:absolute;inset:0;cursor:pointer" onclick="playVideo()">
      <img id="cardThumb" src="about:blank" alt="" style="width:100%;height:100%;object-fit:cover;display:block">
      <div class="play-btn" id="playBtn" style="display:none">
        <div class="play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <!-- 실제 유튜브 iframe (클릭 후 로드) -->
    <iframe id="cardIframe" src="about:blank" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen style="display:none;position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>
    <!-- 오버레이 뱃지 -->
    <div class="card-overlay">
      <span id="cardCatBadge" class="card-cat-badge"></span>
      <span id="cardFeatBadge" class="card-feat-badge" style="display:none">⭐ PICK</span>
    </div>
    <button class="card-close" onclick="closeCard()">✕</button>
  </div>
  <!-- 바디 -->
  <div class="card-body">
    <div class="card-name" id="cardName"></div>
    <div class="card-meta">
      <span class="card-location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span id="cardAddress"></span>
      </span>
      <span class="card-price" id="cardPrice"></span>
    </div>
    <div class="card-desc" id="cardDesc"></div>
    <div class="card-tags" id="cardTags"></div>
    <button class="btn-reserve" id="btnReserve" onclick="openReserve()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      네이버 예약하기
    </button>
  </div>
</div>

<!-- 인앱 브라우저 시트 (예약하기) -->

<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=xjjg4490h8"><\/script>
<script>
const CAT_COLOR = {
  '마사지':'#10B981','헤드스파':'#6366F1','피부관리':'#FF4D7D',
  '헤어':'#F59E0B','메이크업':'#C084FC','왁싱':'#EC4899','반영구':'#06B6D4','병원':'#3B82F6','그외':'#8B5CF6'
};

let map = null, markers = [], curCat = 'all', curShop = null;

window.addEventListener('message', e => {
  if (e.data?.type === 'filterCat') { curCat = e.data.cat; renderMarkers(); }
  if (e.data?.type === 'fitBounds') {
    // 지도 크기 재계산 후 fitBounds 재실행
    if (map) {
      map.autoResize();
      setTimeout(() => fitToBounds(curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat)), 200);
    }
  }
});

/* ── 카드 닫기 ── */
function closeCard() {
  document.getElementById('card').classList.remove('open');
  // iframe 정지 (src='' 하면 브라우저가 현재URL로 변환 → about:blank 사용)
  document.getElementById('cardIframe').src = 'about:blank';
  document.getElementById('cardIframe').style.display = 'none';
  document.getElementById('thumbWrap').style.display = 'block';
  document.getElementById('playBtn').style.display = 'none';
  curShop = null;
}

/* ── 유튜브 재생 ── */
function playVideo() {
  // 유튜브 없으면 아무것도 안 함
  if (!curShop?.youtubeId) return;
  // 지도 하단 카드 썸네일 클릭 → 영상조회 카운팅 (세션 내 1회, 출처: map)
  trackView(curShop.id, 'map');
  const iframe = document.getElementById('cardIframe');
  // 썸네일 직접 클릭 → mute 없이 재생 (광고 수익 활성화)
  iframe.src = \`https://www.youtube.com/embed/\${curShop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
  iframe.style.display = 'block';
  document.getElementById('thumbWrap').style.display = 'none';
}

/* ── 예약 버튼 ── */
// /reserve iframe → 메인 페이지로 postMessage → openInapp() 실행
function openReserve() {
  if (!curShop?.smartPlaceUrl) return;
  _sessionTrackMapBook(); // 👁️ 세션 추적 - 지도 팝업 예약클릭
  _sessionEvent('map_book', curShop);  // 👁️ 업체 이벤트
  // viewSrc는 지도 iframe 내부이므로 항상 'map'
  fetch('/api/track/mapsp/' + curShop.id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: 'map' }),
  }).catch(()=>{});
  window.parent.postMessage({
    type: 'openInapp',
    shop: {
      id:            curShop.id,
      name:          curShop.name,
      smartPlaceUrl: curShop.smartPlaceUrl
    }
  }, '*');
}

/* ── 카드 열기 ── */
function openCard(shop) {
  _sessionTrackFeedCard(); // 👁️ 세션 추적 - 피드 업체카드 클릭
  _sessionEvent('feed_card', shop);   // 👁️ 업체 이벤트
  curShop = shop;
  const color = CAT_COLOR[shop.category] || '#FF4D7D';

  const iframe   = document.getElementById('cardIframe');
  const thumbWrap = document.getElementById('thumbWrap');
  const thumb    = document.getElementById('cardThumb');
  const playBtn  = document.getElementById('playBtn');

  // ── 유튜브 있음 → 카드 열리자마자 바로 iframe 재생 ──
  if (shop.youtubeId) {
    // 썸네일 클릭 재생 → mute 없이 (광고 수익 활성화)
    iframe.src = \`https://www.youtube.com/embed/\${shop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
    iframe.style.display = 'block';
    thumbWrap.style.display = 'none';
    playBtn.style.display = 'none';

  // ── 유튜브 없음 → 사진(썸네일)만 표시, 클릭 불가 ──
  } else {
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    thumbWrap.style.display = 'block';
    thumbWrap.style.cursor = 'default';
    thumbWrap.onclick = null;  // 클릭 이벤트 제거 (사진만)
    playBtn.style.display = 'none';

    thumb.onerror = null;
    thumb.src = 'about:blank';
    const imgSrc = shop.thumbnail || '';
    if (imgSrc) {
      thumb.style.display = 'block';
      thumb.onerror = function() { this.style.display = 'none'; };
      thumb.src = imgSrc;
    } else {
      thumb.style.display = 'none';
    }
  }

  // 뱃지
  const catBadge = document.getElementById('cardCatBadge');
  catBadge.textContent = shop.category;
  catBadge.style.background = color + '99';

  document.getElementById('cardFeatBadge').style.display = shop.featured ? 'block' : 'none';

  // 텍스트
  document.getElementById('cardName').textContent = shop.name;
  document.getElementById('cardAddress').textContent = shop.address || shop.district || '';
  document.getElementById('cardPrice').textContent = shop.price;
  document.getElementById('cardDesc').textContent = shop.desc || '';

  // 태그
  document.getElementById('cardTags').innerHTML =
    (shop.tags || []).map(t => \`<span class="card-tag">#\${t}</span>\`).join('');

  // 예약 버튼
  const reserveBtn = document.getElementById('btnReserve');
  reserveBtn.style.display = shop.smartPlaceUrl ? 'flex' : 'none';

  document.getElementById('card').classList.add('open');
  window.parent.postMessage({ type:'shopSelected', id: shop.id }, '*');
  map.panTo(new naver.maps.LatLng(shop.lat, shop.lng));
  // position:fixed 카드가 iframe 첫 렌더 시 뷰포트 밖에 숨는 문제 해결
  // → map.autoResize()로 강제 리페인트 트리거
  requestAnimationFrame(() => { try { map.autoResize(); } catch(e){} });
}

/* 마커 생성 */
function makeMarker(shop) {
  const color = CAT_COLOR[shop.category] || '#FF4D7D';
  const html = \`<div style="
    display:inline-flex;flex-direction:column;align-items:center;
    cursor:pointer;transform-origin:bottom center;transition:transform .15s;
  " onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform='scale(1)'">
    <div style="
      background:\${color};color:#fff;
      font-size:11px;font-weight:800;
      padding:5px 12px;border-radius:999px;
      white-space:nowrap;
      box-shadow:0 3px 12px rgba(0,0,0,.5);
      border:2px solid rgba(255,255,255,.4);
      letter-spacing:-.2px;line-height:1;
      font-family:-apple-system,sans-serif;
    ">\${shop.name}</div>
    <div style="
      width:6px;height:6px;border-radius:50%;
      background:\${color};margin-top:3px;
      box-shadow:0 0 0 2px rgba(255,255,255,.3);
    "></div>
  </div>\`;
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(shop.lat, shop.lng),
    map: map,
    icon: {
      content: html,
      anchor: new naver.maps.Point(0, 0),
    },
    zIndex: shop.featured ? 100 : 10,
  });
  naver.maps.Event.addListener(marker, 'click', (e) => {
    e.domEvent?.stopPropagation?.();
    openCard(shop);
  });
  return marker;
}

/* 마커 렌더링 */
let allShops = [];
function renderMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  const list = curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat);
  list.forEach(s => markers.push(makeMarker(s)));
  // 업체 전체가 보이도록 자동 범위 조정
  fitToBounds(list);
}

/* 전체 업체가 화면에 들어오도록 범위 조정 */
function fitToBounds(list) {
  if (!list.length || !map) return;
  if (list.length === 1) {
    // 업체 1개: 적당한 줌(14)으로 중앙 표시
    map.setCenter(new naver.maps.LatLng(list[0].lat, list[0].lng));
    map.setZoom(14);
  } else {
    const lats = list.map(s => s.lat);
    const lngs = list.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds, { top:80, right:60, bottom:140, left:60 });
    // fitBounds 후 너무 가까이 줌인됐으면 최대 줌 14로 제한
    setTimeout(() => {
      if (map.getZoom() > 14) map.setZoom(14);
    }, 350);
  }
}

/* 지도 초기화 — 네이버 지도 스크립트 완전 로드 후 실행 */
function waitNaver(cb, t=0) {
  if (window.naver && window.naver.maps && window.naver.maps.Map) { cb(); return; }
  if (t > 50) return; // 10초 초과 포기
  setTimeout(() => waitNaver(cb, t+1), 200);
}

async function initMap() {
  map = new naver.maps.Map('naverMap', {
    center: new naver.maps.LatLng(36.5, 127.5),
    zoom: 7,
    mapTypeControl:  false,
    scaleControl:    false,
    logoControl:     false,
    mapDataControl:  false,
  });
  map.addListener('click', closeCard);

  const res = await fetch('/api/shops');
  allShops  = await res.json();
  renderMarkers();
}

window.onload = () => waitNaver(initMap);
<\/script>
</body>
</html>`}function lo(e){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵 · 업체 리포트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --purple:#7c3aed;--purple-l:#a78bfa;--purple-ll:#c4b5fd;
  --green:#10b981;--pink:#FF4D7D;
  --bg:#09090f;--card:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
  --t1:#f1f5f9;--t2:#94a3b8;--t3:#475569;
}
body{background:var(--bg);color:var(--t1);font-family:'Pretendard',-apple-system,sans-serif;min-height:100vh}

/* ── 잠금 ── */
#lockScreen{display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:100vh;padding:24px}
.lock-logo{font-size:11px;font-weight:700;letter-spacing:3px;color:var(--purple-l);
  text-transform:uppercase;margin-bottom:28px}
.lock-card{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:24px;
  padding:36px 28px;width:100%;max-width:340px;text-align:center}
.lock-icon{font-size:42px;margin-bottom:14px}
.lock-title{font-size:19px;font-weight:800;margin-bottom:8px}
.lock-desc{font-size:13px;color:var(--t2);margin-bottom:26px;line-height:1.7}
.lock-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);
  border-radius:14px;padding:16px;color:#fff;font-size:22px;letter-spacing:8px;
  text-align:center;outline:none;transition:.2s;font-family:inherit}
.lock-input:focus{border-color:var(--purple-l);background:rgba(167,139,250,.08)}
.lock-btn{width:100%;margin-top:14px;padding:15px;
  background:linear-gradient(135deg,var(--purple),var(--purple-l));
  border:none;border-radius:14px;color:#fff;font-size:15px;font-weight:800;
  cursor:pointer;font-family:inherit}
.lock-btn:active{opacity:.8}
.lock-error{margin-top:10px;font-size:13px;color:#f87171;min-height:18px}

/* ── 리포트 ── */
#reportScreen{display:none;max-width:460px;margin:0 auto;padding-bottom:60px}

/* 헤더 */
.rp-header{padding:36px 20px 28px;text-align:center}
.rp-logo{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--purple-l);
  text-transform:uppercase;margin-bottom:12px}
.rp-name{font-size:26px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px}
.rp-cat{font-size:13px;color:var(--t2);margin-bottom:18px}
.rp-period{display:inline-flex;align-items:center;gap:6px;
  background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.25);
  border-radius:20px;padding:7px 16px;font-size:12px;font-weight:600;color:var(--purple-ll)}

/* 구분선 */
.divider{height:1px;background:var(--border);margin:0 16px}

/* ── 빅 조회수 카드 ── */
.hero-card{margin:24px 16px 0;
  background:linear-gradient(135deg,rgba(124,58,237,.18),rgba(167,139,250,.07));
  border:1px solid rgba(167,139,250,.25);border-radius:22px;padding:28px 24px}
.hero-lbl{font-size:12px;font-weight:600;color:rgba(196,181,253,.7);margin-bottom:12px;
  display:flex;align-items:center;gap:6px}
.hero-num{font-size:56px;font-weight:900;color:#fff;line-height:1;letter-spacing:-3px;margin-bottom:12px}
.hero-num small{font-size:22px;font-weight:600;color:rgba(167,139,250,.6);margin-left:4px;letter-spacing:0}
.hero-badge{display:inline-flex;align-items:center;gap:6px;
  font-size:14px;font-weight:800;padding:6px 14px;border-radius:20px;margin-bottom:8px}
.badge-up{background:rgba(52,211,153,.14);color:#34d399}
.badge-down{background:rgba(248,113,113,.14);color:#f87171}
.badge-same{background:rgba(148,163,184,.1);color:var(--t2)}
.hero-sub{font-size:13px;color:var(--t2);line-height:1.5}

/* ── 액션 수 카드 ── */
.action-card{margin:12px 16px 0;
  background:var(--card);border:1px solid var(--border);
  border-radius:18px;padding:22px 24px;
  display:flex;align-items:center;gap:20px}
.action-left{flex:1}
.action-lbl{font-size:12px;font-weight:600;color:var(--t2);margin-bottom:10px;
  display:flex;align-items:center;gap:6px}
.action-num{font-size:40px;font-weight:900;color:var(--green);line-height:1;letter-spacing:-1px}
.action-num small{font-size:18px;font-weight:600;color:rgba(16,185,129,.6);margin-left:3px;letter-spacing:0}
.action-sub{font-size:12px;color:var(--t2);margin-top:6px}
.action-right{text-align:right}
.action-prev-lbl{font-size:10px;color:var(--t3);margin-bottom:4px}
.action-prev{font-size:13px;color:var(--t2);font-weight:600}
.action-badge{font-size:12px;font-weight:800;padding:4px 10px;border-radius:12px;margin-top:6px;display:inline-block}

/* ── 30일 차트 ── */
.chart-section{margin:20px 16px 0}
.chart-title{font-size:12px;font-weight:700;color:var(--t2);margin-bottom:12px;
  display:flex;align-items:center;gap:6px}
.chart-box{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:18px 12px 12px}
.chart-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;padding:0 4px}
.leg{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--t2)}
.leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* ── 누적 한줄 ── */
.total-bar{margin:16px 16px 0;background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:16px 20px;
  display:flex;align-items:center;justify-content:space-between}
.total-lbl{font-size:12px;color:var(--t2)}
.total-num{font-size:18px;font-weight:900;color:var(--purple-l)}
.total-unit{font-size:12px;color:var(--t3);margin-left:2px}

/* ── 응원 메시지 ── */
.cheer-box{margin:20px 16px 0;
  background:linear-gradient(135deg,rgba(255,77,125,.1),rgba(255,143,163,.05));
  border:1px solid rgba(255,77,125,.2);border-radius:18px;padding:22px 20px;
  display:flex;gap:14px;align-items:flex-start}
.cheer-icon{font-size:26px;flex-shrink:0}
.cheer-head{font-size:16px;font-weight:800;color:#fff;margin-bottom:5px;line-height:1.3}
.cheer-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.6}

/* 푸터 */
.rp-footer{margin:28px 16px 0;text-align:center;font-size:11px;color:var(--t3);line-height:1.9}
.rp-footer a{color:var(--purple-l);text-decoration:none}
</style>
</head>
<body>

<!-- 잠금 -->
<div id="lockScreen">
  <div class="lock-logo">✦ 마이뷰티맵</div>
  <div class="lock-card">
    <div class="lock-icon">🔐</div>
    <div class="lock-title">업체 리포트</div>
    <div class="lock-desc">등록하신 전화번호의<br><strong>마지막 4자리</strong>를 입력해주세요</div>
    <input class="lock-input" id="phoneInput" type="number" placeholder="••••"
      oninput="if(this.value.length>4)this.value=this.value.slice(0,4)"
      onkeydown="if(event.key==='Enter')doVerify()"/>
    <button class="lock-btn" id="lockBtn" onclick="doVerify()">확인</button>
    <div class="lock-error" id="lockError"></div>
  </div>
</div>

<!-- 리포트 -->
<div id="reportScreen" style="display:none">

  <div class="rp-header">
    <div class="rp-logo">✦ 마이뷰티맵 리포트</div>
    <div class="rp-name" id="rName">—</div>
    <div class="rp-cat"  id="rCat">—</div>
    <div class="rp-period" id="rPeriod">📅 이번 달 기준</div>
  </div>

  <div class="divider"></div>

  <!-- 영상 조회수 (핵심) -->
  <div class="hero-card">
    <div class="hero-lbl">👁 이번 달 영상 조회수</div>
    <div class="hero-num"><span id="kViews">0</span><small>명</small></div>
    <div class="hero-badge badge-same" id="kViewsBadge">—</div>
    <div class="hero-sub" id="kViewsSub"></div>
  </div>

  <!-- 예약+지도 합산 액션 -->
  <div class="action-card">
    <div class="action-left">
      <div class="action-lbl">🎯 이번 달 고객 액션</div>
      <div class="action-num"><span id="kAction">0</span><small>건</small></div>
      <div class="action-sub">예약 버튼 + 지도 클릭 합산</div>
    </div>
    <div class="action-right">
      <div class="action-prev-lbl">지난달</div>
      <div class="action-prev" id="kActionPrev">—</div>
      <div class="action-badge badge-same" id="kActionBadge"></div>
    </div>
  </div>

  <!-- 30일 추이 차트 -->
  <div class="chart-section">
    <div class="chart-title">📈 최근 30일 추이</div>
    <div class="chart-box">
      <canvas id="trendChart" height="160"></canvas>
      <div class="chart-legend">
        <div class="leg"><span class="leg-dot" style="background:#a78bfa"></span>영상조회</div>
        <div class="leg"><span class="leg-dot" style="background:#34d399"></span>고객액션</div>
      </div>
    </div>
  </div>

  <!-- 누적 조회수 한줄 -->
  <div class="total-bar">
    <div class="total-lbl">📊 서비스 시작 이후 누적 조회수</div>
    <div><span class="total-num" id="tViews">0</span><span class="total-unit">명</span></div>
  </div>

  <!-- 응원 메시지 -->
  <div class="cheer-box" id="cheerBox">
    <div class="cheer-icon" id="cheerIcon">💡</div>
    <div>
      <div class="cheer-head" id="cheerHead">—</div>
      <div class="cheer-sub"  id="cheerSub">—</div>
    </div>
  </div>

  <div class="rp-footer">
    마이뷰티맵 · 내 주변 뷰티샵 한눈에<br>
    <a href="/">mybeautymap.co.kr</a>
  </div>
</div>

<script>
const TOKEN = '${e}';

async function doVerify() {
  const v = document.getElementById('phoneInput').value.trim();
  if (v.length !== 4) { document.getElementById('lockError').textContent = '4자리를 입력해주세요'; return; }
  document.getElementById('lockError').textContent = '';
  const btn = document.getElementById('lockBtn');
  btn.disabled = true; btn.textContent = '확인 중...';
  try {
    const res = await fetch('/api/report/' + TOKEN + '/verify', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phone4: v })
    });
    if (res.status === 401) { document.getElementById('lockError').textContent = '전화번호가 일치하지 않아요'; btn.disabled=false; btn.textContent='확인'; return; }
    if (!res.ok)            { document.getElementById('lockError').textContent = '잘못된 링크예요';           btn.disabled=false; btn.textContent='확인'; return; }
    renderReport(await res.json());
  } catch(e) {
    document.getElementById('lockError').textContent = '오류가 발생했어요. 다시 시도해주세요';
    btn.disabled=false; btn.textContent='확인';
  }
}

const fmt = n => (n||0).toLocaleString();

function pctBadge(curr, prev) {
  if (!prev) return { text:'첫 달 데이터', cls:'badge-same' };
  const p = Math.round(((curr-prev)/prev)*100);
  if (p > 0) return { text:'▲ '+p+'% 지난달보다 상승', cls:'badge-up' };
  if (p < 0) return { text:'▼ '+Math.abs(p)+'% 지난달보다 하락', cls:'badge-down' };
  return { text:'→ 지난달과 동일', cls:'badge-same' };
}

function renderReport(d) {
  document.getElementById('lockScreen').style.display   = 'none';
  document.getElementById('reportScreen').style.display = 'block';

  const now = new Date();
  const tm  = d.thisMonth || {};
  const lm  = d.lastMonth || {};

  /* 헤더 */
  document.getElementById('rName').textContent   = d.shop.name;
  document.getElementById('rCat').textContent    = d.shop.category + ' · ' + (d.shop.address||'').split(' ').slice(0,2).join(' ');
  document.getElementById('rPeriod').textContent = '📅 ' + now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 기준';

  /* ── 영상 조회수 ── */
  document.getElementById('kViews').textContent = fmt(tm.views);

  const vb = pctBadge(tm.views, lm.views);
  const badge = document.getElementById('kViewsBadge');
  badge.textContent = vb.text; badge.className = 'hero-badge ' + vb.cls;

  document.getElementById('kViewsSub').textContent = tm.views > 0
    ? '이번 달 내 영상을 시청한 잠재 고객 수예요'
    : '아직 이번 달 데이터가 쌓이는 중이에요';

  /* ── 고객 액션 (예약+지도 합산) ── */
  const thisAction = (tm.feedSP||0) + (tm.mapSP||0);
  const lastAction = (lm.feedSP||0) + (lm.mapSP||0);
  document.getElementById('kAction').textContent    = fmt(thisAction);
  document.getElementById('kActionPrev').textContent = fmt(lastAction) + '건';

  const ab = pctBadge(thisAction, lastAction);
  const abadge = document.getElementById('kActionBadge');
  abadge.textContent = ab.text; abadge.className = 'action-badge ' + ab.cls;

  /* ── 30일 차트 (조회 + 액션 합산) ── */
  const rows   = d.daily30 || [];
  const labels = [], views = [], actions = [];
  rows.forEach(r => {
    const dt = new Date(r.d);
    labels.push((dt.getMonth()+1)+'/'+dt.getDate());
    views.push(parseInt(r.views)   || 0);
    actions.push((parseInt(r.feed_sp)||0) + (parseInt(r.map_sp)||0));
  });
  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: { labels, datasets: [
      { label:'영상조회', data:views,   borderColor:'#a78bfa', backgroundColor:'rgba(167,139,250,.12)',
        tension:.4, fill:true, pointRadius:2, borderWidth:2 },
      { label:'고객액션', data:actions, borderColor:'#34d399', backgroundColor:'rgba(52,211,153,.08)',
        tension:.4, fill:true, pointRadius:2, borderWidth:2 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:true,
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color:'#475569', font:{ size:9 }, maxTicksLimit:8 }, grid:{ color:'rgba(255,255,255,.04)' } },
        y:{ ticks:{ color:'#475569', font:{ size:10 } }, grid:{ color:'rgba(255,255,255,.05)' }, min:0 }
      }
    }
  });

  /* ── 누적 조회수 ── */
  document.getElementById('tViews').textContent = fmt(d.total.views);

  /* ── 응원 메시지 ── */
  const cPct = lm.views > 0 ? Math.round(((tm.views - lm.views) / lm.views) * 100) : null;
  const totalAct = (tm.views||0) + thisAction;
  let icon = '💡', head = '', sub = '';

  if (totalAct === 0) {
    icon = '🌱'; head = '데이터가 쌓이는 중이에요';
    sub  = '곧 결과가 나타날 거예요. 영상을 최신으로 유지해보세요!';
  } else if (cPct !== null && cPct >= 30) {
    icon = '🚀'; head = '이번 달 조회수가 크게 올랐어요! +' + cPct + '%';
    sub  = '지난달보다 훨씬 많은 잠재 고객이 업체를 발견하고 있어요.';
  } else if (thisAction >= 5) {
    icon = '🎉'; head = fmt(thisAction) + '명이 직접 행동했어요!';
    sub  = '영상을 보고 예약 또는 지도를 클릭한 실질적인 관심 고객이에요.';
  } else if ((tm.views||0) >= 20) {
    icon = '📣'; head = fmt(tm.views) + '명이 내 영상을 봤어요';
    sub  = '많은 잠재 고객이 관심을 보이고 있어요. 꾸준히 노출되는 중이에요.';
  } else {
    icon = '📈'; head = '꾸준히 노출되고 있어요';
    sub  = '마이뷰티맵에서 업체 정보가 고객들에게 전달되고 있어요.';
  }
  document.getElementById('cheerIcon').textContent = icon;
  document.getElementById('cheerHead').textContent = head;
  document.getElementById('cheerSub').textContent  = sub;
}
<\/script>
</body>
</html>`}function co(){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>관리자 – 마이뷰티맵</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D;--green:#03C75A;--blue:#6495ed;--amber:#f59e0b;
  --bg:#0a0a0a;--card:#141414;--card2:#1a1a1a;--border:rgba(255,255,255,.07);
  --t1:#fff;--t2:rgba(255,255,255,.6);--t3:rgba(255,255,255,.3);--t4:rgba(255,255,255,.15)
}
body{font-family:'Pretendard',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh}

/* ── 상단바 ── */
.top{background:rgba(14,14,14,.98);border-bottom:1px solid var(--border);
  padding:0 16px;height:54px;display:flex;align-items:center;gap:10px;
  position:sticky;top:0;z-index:50;backdrop-filter:blur(12px)}
.back{font-size:20px;color:var(--t3);text-decoration:none;display:flex;align-items:center}
.back:hover{color:var(--t1)}
.ttl{font-size:16px;font-weight:800;flex:1}
.add-btn{background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}

/* ── 탭바 ── */
.tabbar{display:flex;border-bottom:1px solid var(--border);background:rgba(14,14,14,.92);
  position:sticky;top:54px;z-index:40;backdrop-filter:blur(8px)}
.tabbtn{flex:1;padding:12px 4px;text-align:center;font-size:11px;font-weight:700;
  color:var(--t3);background:none;border:none;cursor:pointer;
  font-family:inherit;border-bottom:2px solid transparent;transition:all .2s;
  display:flex;flex-direction:column;align-items:center;gap:3px}
.tabbtn i{font-size:15px}
.tabbtn.on{color:var(--pink);border-bottom-color:var(--pink)}

/* ── 공통 레이아웃 ── */
.wrap{max-width:640px;margin:0 auto;padding:14px 14px 100px}
.section-title{font-size:11px;font-weight:700;color:var(--t3);
  letter-spacing:.6px;text-transform:uppercase;margin:18px 0 10px 2px;
  display:flex;align-items:center;gap:6px}
.section-title::after{content:'';flex:1;height:1px;background:var(--border)}

/* ── 오늘 KPI 그리드 (2x2) ── */
.kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px 14px 12px;position:relative;overflow:hidden}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-visit::before{background:linear-gradient(90deg,#a78bfa,#7c3aed)}
.kpi-view::before{background:linear-gradient(90deg,#FF8FA3,#FF4D7D)}
.kpi-feed::before{background:linear-gradient(90deg,#6ee7b7,#03C75A)}
.kpi-map::before{background:linear-gradient(90deg,#93c5fd,#6495ed)}
.kpi-icon{font-size:18px;margin-bottom:6px}
.kpi-val{font-size:26px;font-weight:800;line-height:1;margin-bottom:4px}
.kpi-visit .kpi-val{color:#a78bfa}
.kpi-view  .kpi-val{color:#FF8FA3}
.kpi-feed  .kpi-val{color:var(--green)}
.kpi-map   .kpi-val{color:var(--blue)}
.kpi-lbl{font-size:10px;color:var(--t3);font-weight:600;margin-bottom:6px}
.kpi-delta{font-size:9px;font-weight:700;display:inline-flex;align-items:center;
  gap:3px;padding:2px 7px;border-radius:20px}
.kpi-delta.up  {background:rgba(3,199,90,.12);color:#03C75A}
.kpi-delta.down{background:rgba(255,77,125,.12);color:var(--pink)}
.kpi-delta.flat{background:rgba(255,255,255,.05);color:var(--t3)}

/* ── 오늘 vs 누적 요약바 ── */
.summary-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
.sb-item{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:10px 8px;text-align:center}
.sb-val{font-size:18px;font-weight:800;color:rgba(255,255,255,.85)}
.sb-lbl{font-size:9px;color:var(--t3);font-weight:600;margin-top:3px}

/* ── 차트 섹션 ── */
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;margin-bottom:8px}
.chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.chart-title{font-size:12px;font-weight:700;color:var(--t2)}
.chart-tabs{display:flex;gap:4px}
.ctab{font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;
  cursor:pointer;border:1px solid var(--border);color:var(--t3);
  background:none;transition:all .15s;font-family:inherit}
.ctab.on-v{background:rgba(255,143,163,.15);border-color:rgba(255,143,163,.4);color:#FF8FA3}
.ctab.on-f{background:rgba(3,199,90,.15);border-color:rgba(3,199,90,.4);color:var(--green)}
.ctab.on-m{background:rgba(100,149,237,.15);border-color:rgba(100,149,237,.4);color:var(--blue)}
.ctab.on-a{background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.4);color:#a78bfa}
.chart-body{display:flex;align-items:flex-end;gap:3px;height:80px;
  overflow-x:auto;overflow-y:hidden;padding-bottom:0;scrollbar-width:none}
.chart-body::-webkit-scrollbar{display:none}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:2px;
  flex-shrink:0;min-width:20px;cursor:default}
.bar-col:hover .bar-fill{opacity:.75}
.bar-fill{border-radius:3px 3px 0 0;width:14px;min-height:2px;transition:height .3s}
.bar-visit{background:linear-gradient(180deg,#c4b5fd,#7c3aed)}
.bar-view {background:linear-gradient(180deg,#FFB6C8,#FF4D7D)}
.bar-feed {background:linear-gradient(180deg,#6ee7b7,#03C75A)}
.bar-map  {background:linear-gradient(180deg,#93c5fd,#6495ed)}
.bar-today{background:linear-gradient(180deg,#fde68a,#f59e0b)!important}
.bar-date{font-size:7px;color:var(--t4);white-space:nowrap;margin-top:2px}
.bar-cnt{font-size:7px;color:var(--t3);font-weight:700;min-height:10px}
.chart-footer{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.chart-legend{font-size:9px;color:var(--t4);font-weight:500}
.reset-btn{font-size:10px;font-weight:700;padding:4px 10px;
  background:rgba(255,77,125,.1);color:var(--pink);
  border:1px solid rgba(255,77,125,.25);border-radius:7px;cursor:pointer;
  transition:all .2s;white-space:nowrap}
.reset-btn:active{background:rgba(255,77,125,.22)}
.chart-empty{color:var(--t3);font-size:11px;text-align:center;padding:20px 0;height:80px;display:flex;align-items:center;justify-content:center}

/* ── 업체별 오늘 랭킹 ── */
.rank-tabs{display:flex;gap:4px;margin-bottom:10px}
.rank-tab{font-size:10px;font-weight:700;padding:5px 12px;border-radius:7px;
  cursor:pointer;border:1px solid var(--border);color:var(--t3);
  background:none;transition:all .15s;font-family:inherit}
.rank-tab.on{background:rgba(255,77,125,.12);border-color:rgba(255,77,125,.35);color:var(--pink)}
.rank-item{background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:12px;margin-bottom:8px;display:flex;gap:10px;align-items:center}
.rank-num{width:24px;height:24px;border-radius:50%;font-size:11px;font-weight:800;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rn1{background:#FFD700;color:#000}.rn2{background:#C0C0C0;color:#000}
.rn3{background:#CD7F32;color:#fff}.rnN{background:rgba(255,255,255,.08);color:var(--t3)}
.rank-thumb{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.05)}
.rank-info{flex:1;min-width:0}
.rank-name{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
.rank-cat{font-size:10px;color:var(--t3);font-weight:500}
.rank-stats{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.rank-stat{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px}
.rs-view{background:rgba(255,143,163,.1);color:#FF8FA3}
.rs-feed{background:rgba(3,199,90,.1);color:var(--green)}
.rs-map {background:rgba(100,149,237,.1);color:var(--blue)}
.rs-zero{color:var(--t4)}
.rank-total{font-size:12px;font-weight:800;color:var(--t2);white-space:nowrap;text-align:right}
.rank-total small{display:block;font-size:9px;color:var(--t4);font-weight:500}

/* ── 투자자 지표 섹션 ── */
.insight-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.insight-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;position:relative;overflow:hidden}
.insight-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.ic-cvr::before  {background:linear-gradient(90deg,#f59e0b,#d97706)}
.ic-growth::before{background:linear-gradient(90deg,#34d399,#059669)}
.ic-pay::before  {background:linear-gradient(90deg,#a78bfa,#7c3aed)}
.ic-daumau::before{background:linear-gradient(90deg,#60a5fa,#2563eb)}
.insight-icon{font-size:16px;margin-bottom:5px}
.insight-val{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px}
.ic-cvr   .insight-val{color:#f59e0b}
.ic-growth .insight-val{color:#34d399}
.ic-pay   .insight-val{color:#a78bfa}
.ic-daumau .insight-val{color:#60a5fa}
.insight-lbl{font-size:10px;color:var(--t3);font-weight:600;margin-bottom:6px}
.insight-sub{font-size:9px;color:var(--t4);font-weight:500;line-height:1.5}
.insight-sub b{font-weight:700}
/* 전환율 게이지 바 */
.cvr-gauge{margin-top:8px;height:4px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.cvr-gauge-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#f59e0b,#d97706);transition:width .6s}
/* 업체별 인사이트 리스트 */
.shop-insight-list{margin-bottom:8px}
.si-card{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:11px 13px;margin-bottom:6px;display:flex;align-items:center;gap:10px}
.si-rank{font-size:11px;font-weight:800;width:20px;flex-shrink:0;text-align:center}
.si-name{flex:1;font-size:12px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.si-cat{font-size:10px;color:var(--t3);font-weight:500;white-space:nowrap}
.si-right{text-align:right;flex-shrink:0}
.si-cvr{font-size:13px;font-weight:800}
.si-cvr.hi{color:#34d399}.si-cvr.mid{color:#f59e0b}.si-cvr.lo{color:#f87171}
.si-sub{font-size:9px;color:var(--t4);margin-top:1px}
.si-alert{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;
  background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.2);
  white-space:nowrap}
/* 수익화 퍼널 */
.funnel-bar{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;margin-bottom:8px}
.funnel-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.funnel-row:last-child{margin-bottom:0}
.funnel-label{font-size:11px;font-weight:600;color:var(--t3);width:60px;flex-shrink:0}
.funnel-track{flex:1;height:10px;background:rgba(255,255,255,.05);border-radius:10px;overflow:hidden}
.funnel-fill{height:100%;border-radius:10px;transition:width .6s}
.f-visit{background:linear-gradient(90deg,#c4b5fd,#7c3aed)}
.f-view {background:linear-gradient(90deg,#FFB6C8,#FF4D7D)}
.f-feed {background:linear-gradient(90deg,#6ee7b7,#03C75A)}
.f-map  {background:linear-gradient(90deg,#93c5fd,#6495ed)}
.funnel-num{font-size:11px;font-weight:800;color:var(--t2);width:46px;text-align:right;flex-shrink:0}
.funnel-pct{font-size:9px;color:var(--t4);width:34px;text-align:right;flex-shrink:0}

/* ── 업체 관리 카드 ── */
.shop-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.sc-top{display:flex;gap:10px;align-items:flex-start}
.sc-thumb{width:58px;height:58px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.05)}
.sc-info{flex:1;min-width:0}
.sc-name{font-size:14px;font-weight:700;display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.sc-cat{font-size:11px;color:var(--pink);font-weight:600;margin-top:3px}
.sc-addr{font-size:10px;color:var(--t3);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-mode{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;
  padding:2px 7px;border-radius:6px;margin-top:4px}
.mode-both{background:rgba(3,199,90,.1);color:var(--green)}
.mode-feed{background:rgba(255,77,125,.1);color:var(--pink)}
.mode-map{background:rgba(100,149,237,.12);color:var(--blue)}
.sc-mid{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;
  padding-top:10px;border-top:1px solid var(--border)}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px}
.b-feat{background:rgba(255,77,125,.13);color:var(--pink)}
.b-hide{background:rgba(255,255,255,.06);color:var(--t3)}
.b-plan-shoot{background:rgba(3,199,90,.13);color:var(--green);border:1px solid rgba(3,199,90,.25)}
.b-plan-basic{background:rgba(255,77,125,.1);color:var(--pink);border:1px solid rgba(255,77,125,.2)}
.b-paid{background:rgba(3,199,90,.12);color:var(--green)}
.b-unpaid{background:rgba(255,165,0,.12);color:#FFA500}
.b-expired{background:rgba(255,77,125,.12);color:var(--pink)}
.b-free{background:rgba(100,149,237,.12);color:var(--blue)}
.sc-nums{display:flex;flex-direction:column;gap:6px;
  margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
/* 클릭 주요 지표 (피드+지도) */
.sc-click-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sc-num{background:rgba(255,255,255,.03);border:1px solid var(--border);
  border-radius:8px;padding:8px 6px;text-align:center}
.sc-num.main{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15)}
.sn-v{font-size:18px;font-weight:800}
.sn-v.sub{font-size:12px;font-weight:700;color:var(--t3)}
.sn-l{font-size:9px;color:var(--t3);margin-top:2px;font-weight:600}
.sn-l.main-lbl{font-size:10px;font-weight:700}
.c-view .sn-v{color:#94a3b8}
.c-feed .sn-v{color:var(--green)}
.c-map  .sn-v{color:var(--blue)}
/* 클릭 합계 강조 */
.sc-total-click{display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:7px 10px}
.stc-val{font-size:16px;font-weight:900;color:#fff}
.stc-lbl{font-size:10px;color:var(--t3);font-weight:600}
/* 출처별 영상조회 분석 칩 */
.sc-view-src{margin-top:6px;padding:7px 10px;background:rgba(167,139,250,.06);
  border:1px solid rgba(167,139,250,.18);border-radius:8px}
.vsrc-title{font-size:9px;color:#a78bfa;font-weight:700;margin-bottom:5px;letter-spacing:.4px}
.vsrc-row{display:flex;gap:5px;flex-wrap:wrap}
.vsrc-chip{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap}
.vsrc-feed{background:rgba(16,185,129,.12);color:#10B981;border:1px solid rgba(16,185,129,.25)}
.vsrc-cat{background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.25)}
.vsrc-map{background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25)}
/* 출처별 전환율 */
.sc-cvr-wrap{margin-top:6px;padding:8px 10px;background:rgba(56,189,248,.05);
  border:1px solid rgba(56,189,248,.15);border-radius:8px}
.sc-cvr-title{font-size:9px;color:#38bdf8;font-weight:700;margin-bottom:7px;letter-spacing:.4px}
.sc-cvr-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.sc-cvr-item{text-align:center}
.sc-cvr-src{font-size:9px;color:var(--t3);font-weight:600;margin-bottom:2px}
.sc-cvr-val{font-size:15px;font-weight:900}
.sc-cvr-sub{font-size:9px;color:var(--t3);margin-top:1px}
.sc-btns{display:flex;gap:6px;margin-top:10px}
.btn-edit{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  color:var(--t1);border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-pay-edit{background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.22);
  color:var(--green);border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-report{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);
  color:#a78bfa;border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-del{background:rgba(255,77,125,.08);border:1px solid rgba(255,77,125,.18);
  color:var(--pink);border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit}
.btn-rec{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);
  color:#fbbf24;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:700;
  cursor:pointer;font-family:inherit;flex:1}
.btn-rec-on{background:rgba(251,191,36,.18);border-color:rgba(251,191,36,.5);color:#f59e0b}

/* ── 구독관리 ── */
.pay-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px}
.pay-sv{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:10px 8px;text-align:center}
.pay-sv-n{font-size:20px;font-weight:800}
.pay-sv-l{font-size:9px;color:var(--t3);margin-top:3px;font-weight:600}
.pay-filter{display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap}
.pf-btn{background:rgba(255,255,255,.05);border:1px solid var(--border);
  color:var(--t3);border-radius:8px;padding:5px 11px;font-size:11px;
  font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.pf-btn.on{background:rgba(255,77,125,.13);border-color:rgba(255,77,125,.3);color:var(--pink)}
.pay-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.pay-card.status-expired{border-color:rgba(255,77,125,.3)}
.pay-card.status-unpaid{border-color:rgba(255,165,0,.25)}
.pay-card.status-paid{border-color:rgba(3,199,90,.2)}
.pay-card.status-free{border-color:rgba(100,149,237,.25)}
.pay-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.pay-thumb{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;background:rgba(255,255,255,.05)}
.pay-info{flex:1;min-width:0}
.pay-name{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pay-sub{font-size:11px;color:var(--t3);margin-top:2px}
.pay-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
.pay-body{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.pay-kv{font-size:10px;color:var(--t3);background:rgba(255,255,255,.03);border-radius:8px;padding:7px 10px}
.pay-kv strong{display:block;font-size:12px;color:var(--t1);font-weight:700;margin-top:2px}
.pay-memo{font-size:11px;color:var(--t3);background:rgba(255,255,255,.03);
  border-radius:8px;padding:8px 10px;margin-bottom:10px;line-height:1.5;
  display:flex;gap:6px;align-items:flex-start}
.pay-btns{display:flex;gap:6px}

/* ── 입점문의 ── */
.inq-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px}
.inq-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.inq-name{font-size:14px;font-weight:700}
.inq-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(255,77,125,.1);color:var(--pink)}
.inq-time{font-size:10px;color:var(--t3);margin-left:auto}
.inq-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:5px}
.inq-kv{font-size:11px;color:var(--t3)}
.inq-kv strong{color:var(--t2);font-weight:600}
.inq-msg{font-size:12px;color:var(--t3);line-height:1.6;border-top:1px solid var(--border);margin-top:8px;padding-top:8px}

/* ── 빈 상태 ── */
.empty{text-align:center;padding:44px 16px;color:var(--t3);font-size:13px}

/* ── 모달 ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:200;
  display:flex;align-items:flex-end;justify-content:center}
.modal-bg.hidden{display:none}
.modal{background:#1b1b1b;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:92vh;overflow-y:auto;padding:18px 16px 48px}
.modal-handle{width:36px;height:4px;background:rgba(255,255,255,.08);border-radius:4px;margin:0 auto 16px}
.modal-ttl{font-size:18px;font-weight:800;margin-bottom:16px}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--t3);margin-bottom:5px;letter-spacing:.3px}
.field input,.field select,.field textarea{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);
  border-radius:10px;padding:10px 12px;color:var(--t1);font-size:14px;
  font-family:inherit;outline:none;transition:border-color .2s}
.field input:focus,.field textarea:focus{border-color:var(--pink)}
.field select option{background:#1b1b1b}
.field textarea{resize:vertical;min-height:70px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-actions{display:flex;gap:10px;margin-top:18px}
.btn-save{flex:1;background:var(--pink);color:#fff;border:none;border-radius:12px;
  padding:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}
.btn-cancel{background:rgba(255,255,255,.06);color:var(--t2);
  border:1.5px solid rgba(255,255,255,.09);border-radius:12px;
  padding:14px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.thumb-wrap{display:flex;gap:10px;align-items:flex-start}
.thumb-preview{width:70px;height:70px;border-radius:10px;object-fit:cover;
  background:rgba(255,255,255,.05);border:1.5px solid var(--border);flex-shrink:0}
.thumb-right{flex:1;display:flex;flex-direction:column;gap:6px}
.upload-btn{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  color:var(--t1);border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;text-align:center}
.thumb-url-inp{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);
  border-radius:8px;padding:8px 10px;color:var(--t1);font-size:12px;font-family:inherit;outline:none}
.thumb-url-inp::placeholder{color:var(--t3)}
.yt-preview{margin-top:6px;border-radius:10px;overflow:hidden;background:#000;aspect-ratio:16/9;display:none}
.yt-preview iframe{width:100%;height:100%;border:none}
.geo-row{display:flex;gap:8px}
.geo-btn{flex-shrink:0;background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:0 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
  height:42px;display:flex;align-items:center;gap:5px;white-space:nowrap}
.geo-status{margin-top:6px;font-size:11px;display:none}
.mode-select{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mode-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 6px;
  text-align:center;cursor:pointer;transition:all .2s;font-size:11px;font-weight:700;color:var(--t3)}
.mode-opt .mo-icon{font-size:20px;margin-bottom:4px}
.mode-opt.sel-both{border-color:var(--green);background:rgba(3,199,90,.07);color:var(--green)}
.mode-opt.sel-feed{border-color:var(--pink);background:rgba(255,77,125,.07);color:var(--pink)}
.mode-opt.sel-map{border-color:var(--blue);background:rgba(100,149,237,.07);color:var(--blue)}

/* ── 결제 모달 ── */
.pay-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:300;
  display:flex;align-items:flex-end;justify-content:center}
.pay-modal-bg.hidden{display:none}
.pay-modal{background:#1b1b1b;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:88vh;overflow-y:auto;padding:20px 16px 48px}
.pm-handle{width:36px;height:4px;background:rgba(255,255,255,.08);border-radius:4px;margin:0 auto 18px}
.pm-ttl{font-size:18px;font-weight:800;margin-bottom:5px}
.pm-sub{font-size:12px;color:var(--t3);margin-bottom:20px}
.pm-plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.pm-plan-opt{border:2px solid var(--border);border-radius:12px;padding:14px 10px;text-align:center;cursor:pointer;transition:all .2s}
.pm-plan-opt .po-icon{font-size:24px;margin-bottom:6px}
.pm-plan-opt .po-name{font-size:13px;font-weight:800;margin-bottom:3px}
.pm-plan-opt .po-price{font-size:11px;color:var(--t3)}
.pm-plan-opt.sel-shoot{border-color:var(--green);background:rgba(3,199,90,.08)}
.pm-plan-opt.sel-shoot .po-name{color:var(--green)}
.pm-plan-opt.sel-basic{border-color:var(--pink);background:rgba(255,77,125,.08)}
.pm-plan-opt.sel-basic .po-name{color:var(--pink)}
.pm-status-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:16px}
.pm-status-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 4px;
  text-align:center;cursor:pointer;font-size:11px;font-weight:700;color:var(--t3);transition:all .2s}
.pm-status-opt.sel-paid{border-color:var(--green);background:rgba(3,199,90,.08);color:var(--green)}
.pm-status-opt.sel-free{border-color:var(--blue);background:rgba(100,149,237,.08);color:var(--blue)}
.pm-status-opt.sel-unpaid{border-color:#FFA500;background:rgba(255,165,0,.08);color:#FFA500}
.pm-status-opt.sel-expired{border-color:var(--pink);background:rgba(255,77,125,.08);color:var(--pink)}
</style>
</head>
<body>

<!-- 상단바 -->
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">마이뷰티맵 관리자</span>
  <button class="add-btn" onclick="openModal()"><i class="fas fa-plus"></i> 업체 추가</button>
</div>

<!-- 탭바 -->
<div class="tabbar">
  <button class="tabbtn on" id="tab-stats" onclick="switchTab('stats')">
    <i class="fas fa-chart-line"></i>대시보드
  </button>
  <button class="tabbtn" id="tab-shops" onclick="switchTab('shops')">
    <i class="fas fa-store"></i>업체 관리
  </button>
  <button class="tabbtn" id="tab-pay" onclick="switchTab('pay')">
    <i class="fas fa-credit-card"></i>구독관리
  </button>
  <button class="tabbtn" id="tab-inq" onclick="switchTab('inq')">
    <i class="fas fa-envelope"></i>입점문의
  </button>
  <button class="tabbtn" id="tab-cal" onclick="switchTab('cal')">
    <i class="fas fa-calendar-alt"></i>달력
  </button>
  <button class="tabbtn" id="tab-shorts-admin" onclick="switchTab('shorts-admin')">
    <i class="fas fa-bolt" style="font-size:11px"></i>숏폼
  </button>
  <button class="tabbtn" id="tab-visitors" onclick="switchTab('visitors')">
    <i class="fas fa-users"></i>방문자
  </button>
</div>

<!-- 콘텐츠 -->
<div class="wrap">
  <div id="panel-stats"></div>
  <div id="panel-shops"       style="display:none"></div>
  <div id="panel-pay"         style="display:none"></div>
  <div id="panel-inq"         style="display:none"></div>
  <div id="panel-cal"         style="display:none"></div>
  <div id="panel-shorts-admin" style="display:none"></div>
  <div id="panel-visitors"    style="display:none"></div>
</div>

<!-- 업체 추가/수정 모달 -->
<div class="modal-bg hidden" id="modalBg" onclick="bgClick(event)">
<div class="modal" id="modal">
  <div class="modal-handle"></div>
  <div class="modal-ttl" id="modalTtl">업체 추가</div>
  <div class="field">
    <label>📡 노출 방식</label>
    <div class="mode-select">
      <div class="mode-opt sel-both" id="mo-both" onclick="setMode('both')"><div class="mo-icon">🎬🗺️</div>영상+지도</div>
      <div class="mode-opt" id="mo-feed" onclick="setMode('feed')"><div class="mo-icon">🎬</div>영상만</div>
      <div class="mode-opt" id="mo-map"  onclick="setMode('map')"><div class="mo-icon">🗺️</div>지도만</div>
    </div>
    <input type="hidden" id="f-mode" value="both"/>
  </div>
  <div class="field"><label>업체명 *</label><input id="f-name" type="text" placeholder="예: 밸런스 엘 스트레칭"/></div>
  <div class="row2">
    <div class="field"><label>카테고리 *</label>
      <select id="f-cat">
        <option>마사지</option><option>헤드스파</option><option>피부관리</option>
        <option>헤어</option><option>메이크업</option><option>왁싱</option>
        <option>반영구</option><option>병원</option><option>그외</option>
      </select>
    </div>
    <div class="field"><label>가격대</label><input id="f-price" type="text" placeholder="예: 5만원~"/></div>
  </div>
  <div class="field">
    <label>🖼️ 썸네일 이미지</label>
    <div class="thumb-wrap">
      <img id="thumbPreview" class="thumb-preview"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"/>
      <div class="thumb-right">
        <label class="upload-btn" for="thumbFile"><i class="fas fa-upload"></i> 파일 선택</label>
        <input type="file" id="thumbFile" accept="image/*" style="display:none" onchange="handleThumbFile(event)"/>
        <input class="thumb-url-inp" id="f-thumb" type="text" placeholder="또는 이미지 URL" oninput="updateThumbPreview(this.value)"/>
      </div>
    </div>
  </div>
  <div class="field" id="ytField">
    <label>🎬 유튜브 URL (또는 영상 ID)</label>
    <input id="f-yt" type="text" placeholder="https://youtu.be/xxxxx" oninput="previewYt(this.value)"/>
    <div class="yt-preview" id="ytPreview"><iframe id="ytFrame" src="" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>
  </div>
  <div class="field" id="addrField">
    <label>📍 주소 *</label>
    <div class="geo-row">
      <input id="f-addr" type="text" placeholder="예: 서울 강남구 논현로 123" style="flex:1"
        onkeydown="if(event.key==='Enter'){event.preventDefault();geocodeAddr()}"/>
      <button class="geo-btn" onclick="geocodeAddr()" id="geoBtn"><i class="fas fa-crosshairs"></i> 좌표찾기</button>
    </div>
    <div class="geo-status" id="geoStatus"></div>
  </div>
  <div class="row2" id="distRow">
    <div class="field"><label>구/지역 <small style="color:var(--t4)">(자동)</small></label><input id="f-dist" type="text" placeholder="강남구"/></div>
    <div class="field"><label>전화번호</label><input id="f-phone" type="text" placeholder="02-1234-5678"/></div>
  </div>
  <div class="row2" id="latRow">
    <div class="field"><label>위도 <small style="color:var(--t4)">(자동)</small></label><input id="f-lat" type="number" step="0.000001" placeholder="자동입력"/></div>
    <div class="field"><label>경도 <small style="color:var(--t4)">(자동)</small></label><input id="f-lng" type="number" step="0.000001" placeholder="자동입력"/></div>
  </div>
  <div class="field"><label>📅 네이버 예약 URL</label><input id="f-url" type="text" placeholder="https://naver.me/xxxxx"/></div>
  <div class="field"><label>태그 (쉼표로 구분)</label><input id="f-tags" type="text" placeholder="리프팅, 보습, 트러블케어"/></div>
  <div class="field"><label>업체 소개</label><textarea id="f-desc" placeholder="업체 간단 소개"></textarea></div>
  <div class="row2">
    <div class="field"><label>상단 노출</label>
      <select id="f-feat"><option value="false">일반</option><option value="true">⭐ 추천 상단</option></select>
    </div>
    <div class="field"><label>공개 여부</label>
      <select id="f-active"><option value="true">공개</option><option value="false">비공개</option></select>
    </div>
  </div>
  <!-- ⭐ 추천탭 토글 -->
  <div class="field" style="margin-bottom:18px">
    <label>⭐ 추천탭 노출</label>
    <div id="rec-toggle-wrap" onclick="toggleRecInModal()" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:2px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);transition:all .25s" id="recToggleWrap">
      <div id="rec-toggle-track" style="width:44px;height:24px;border-radius:12px;background:#374151;position:relative;transition:background .25s;flex-shrink:0">
        <div id="rec-toggle-thumb" style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .25s"></div>
      </div>
      <div>
        <div id="rec-toggle-label" style="font-size:13px;font-weight:700;color:#94a3b8">추천탭 미노출</div>
        <div style="font-size:11px;color:#475569;margin-top:1px">⭐추천 탭에 이 업체를 노출합니다</div>
      </div>
    </div>
    <input type="hidden" id="f-rec" value="false"/>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closeModal()">취소</button>
    <button class="btn-save" onclick="saveShop()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<!-- 결제 수정 모달 -->
<div class="pay-modal-bg hidden" id="payModalBg" onclick="if(event.target===this)closePayModal()">
<div class="pay-modal" id="payModal">
  <div class="pm-handle"></div>
  <div class="pm-ttl">💳 구독 관리</div>
  <div class="pm-sub" id="pmShopName">업체명</div>
  <div class="field"><label>📦 플랜</label></div>
  <div class="pm-plan-grid">
    <div class="pm-plan-opt sel-shoot" id="pm-plan-shoot" onclick="setPmPlan('shoot')">
      <div class="po-icon">🎬</div><div class="po-name">촬영 플랜</div>
      <div class="po-price">촬영비 3만원 · 6개월 무료<br>이후 월 10,000원</div>
    </div>
    <div class="pm-plan-opt" id="pm-plan-basic" onclick="setPmPlan('basic')">
      <div class="po-icon">📍</div><div class="po-name">기본 플랜</div>
      <div class="po-price">영상 없이 맵만<br>월 10,000원</div>
    </div>
  </div>
  <div class="field"><label>📊 결제 상태</label></div>
  <div class="pm-status-grid">
    <div class="pm-status-opt" id="pm-st-paid"    onclick="setPmStatus('paid')">✅<br>결제완료</div>
    <div class="pm-status-opt" id="pm-st-free"    onclick="setPmStatus('free')">🎁<br>무료기간</div>
    <div class="pm-status-opt" id="pm-st-unpaid"  onclick="setPmStatus('unpaid')">💳<br>미결제</div>
    <div class="pm-status-opt" id="pm-st-expired" onclick="setPmStatus('expired')">⚠️<br>만료</div>
  </div>
  <div class="field">
    <label>📆 구독 만료일</label>
    <input id="pm-until" type="date" style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none"/>
  </div>
  <div style="display:flex;gap:6px;margin-top:-6px;margin-bottom:14px">
    <button onclick="addMonths(1)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+1개월</button>
    <button onclick="addMonths(3)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+3개월</button>
    <button onclick="addMonths(6)"  style="flex:1;background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.22);color:var(--green);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+6개월</button>
    <button onclick="addMonths(12)" style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+12개월</button>
  </div>
  <div class="field">
    <label>📝 메모</label>
    <textarea id="pm-memo" placeholder="예) 홍길동 계좌이체 30,000원 24.01.15"
      style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;resize:vertical;min-height:60px"></textarea>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closePayModal()">취소</button>
    <button class="btn-save" onclick="savePayment()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<script>
// ── 전역 상태
let editId = null, payEditId = null;
let pmPlan = 'shoot', pmStatus = 'unpaid';
let curTab = 'stats';
let shopData = [];
let thumbDataUrl = '';
let _stats = null, _dvRows = [], _chartMode = 'view', _rankMode = 'today', _insightMode = 'top';

// ── 탭 전환
function switchTab(t) {
  curTab = t;
  ['stats','shops','pay','inq','cal','shorts-admin','visitors'].forEach(x => {
    const tabEl = document.getElementById('tab-'+x);
    const panEl = document.getElementById('panel-'+x);
    if (tabEl) tabEl.classList.toggle('on', x===t);
    if (panEl) panEl.style.display = x===t ? 'block' : 'none';
  });
  document.querySelector('.add-btn').style.display = t==='shops' ? 'flex' : 'none';
  if (t==='shops') renderShops(shopData);
  if (t==='inq') loadInquiries();
  if (t==='pay') renderPayTab();
  if (t==='cal') renderCalendar();
  if (t==='shorts-admin') loadShortsAdmin();
  if (t==='visitors') loadVisitors();
}

// ── 토스트
let _toastTmr;
function toast(msg) {
  let el = document.getElementById('_toast');
  if (!el) {
    el = document.createElement('div'); el.id = '_toast';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;z-index:9999;transition:opacity .3s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.5)';
    document.body.appendChild(el);
  }
  el.textContent = msg; el.style.opacity = '1';
  clearTimeout(_toastTmr);
  _toastTmr = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ══════════════════════════════════════════════════════════════════════════
// ⚡ 관리자 숏폼 관리
// ══════════════════════════════════════════════════════════════════════════
let _shortsAdminItems = [];
let _shortsAdminEditId = null;
let _shortsAdminTab = 'overview'; // overview | items | daily

const CAT_OPTIONS = ['마사지','헤드스파','피부관리','헤어','메이크업','왁싱','반영구','병원','그외'];

async function loadShortsAdmin() {
  const p = document.getElementById('panel-shorts-admin');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b">불러오는 중...</div>';
  _shortsAdminItems = await fetch('/api/admin/shorts').then(r=>r.json());
  renderShortsAdminShell();
  switchShortsAdminTab(_shortsAdminTab);
}

// ── 외부 껍데기(탭바 + 컨텐츠 영역 + 모달) ──────────────────────────────
function renderShortsAdminShell() {
  const p = document.getElementById('panel-shorts-admin');
  const tabBtn = (key, label, icon) =>
    '<button onclick="switchShortsAdminTab(&quot;'+key+'&quot;)" id="sat-'+key+'" style="flex:1;border:none;border-bottom:2px solid transparent;background:none;color:#64748b;font-size:12px;font-weight:700;padding:10px 4px;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px"><i class="fas '+icon+'" style="font-size:14px"></i>'+label+'</button>';

  p.innerHTML =
    // 탭 헤더
    '<div style="position:sticky;top:0;z-index:10;background:#111;border-bottom:1px solid rgba(255,255,255,.08)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0">' +
        '<div style="font-size:15px;font-weight:800;color:#e879f9">⚡ 숏폼 관리</div>' +
        '<button onclick="openShortsModal(null)" style="background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:10px;padding:7px 13px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit">+ 추가</button>' +
      '</div>' +
      '<div style="display:flex;margin-top:8px">' +
        tabBtn('overview','현황요약','fa-chart-pie') +
        tabBtn('items','업체별','fa-list') +
        tabBtn('daily','일별추이','fa-chart-bar') +
      '</div>' +
    '</div>' +
    '<div id="shorts-admin-body" style="padding:14px"></div>' +
    // 모달
    _shortsAdminModalHtml();

  // 유튜브 입력 시 미리보기
  document.getElementById('s-ytid').addEventListener('input', function() {
    const vid = extractYtId(this.value.trim());
    const preview = document.getElementById('s-yt-preview');
    const frame   = document.getElementById('s-yt-frame');
    if (vid) { preview.style.display='block'; frame.src='https://www.youtube.com/embed/'+vid+'?rel=0'; }
    else { preview.style.display='none'; frame.src=''; }
  });
}

function _shortsAdminModalHtml() {
  return '<div id="shortsModalBg" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;align-items:flex-end" onclick="if(event.target===this)closeShortsModal()">' +
    '<div id="shortsAdminModal" style="background:#161616;border-radius:20px 20px 0 0;padding:20px;width:100%;max-height:90vh;overflow-y:auto">' +
      '<div style="font-size:15px;font-weight:800;margin-bottom:16px" id="shortsModalTitle">숏폼 추가</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px">' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">업체명 *</label>' +
        '<input id="s-name" placeholder="예: 강남 힐링 마사지" style="'+adminInputStyle()+'"/></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">카테고리</label>' +
        '<select id="s-cat" style="'+adminInputStyle()+'background:#1b1b1b;color:#fff;appearance:auto"><option value="" style="background:#1b1b1b;color:#fff">선택 안함</option></select></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">주소</label>' +
        '<input id="s-addr" placeholder="예: 서울 강남구 역삼동" style="'+adminInputStyle()+'"/></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">네이버 예약링크</label>' +
        '<input id="s-place" placeholder="https://naver.me/xxxxx" style="'+adminInputStyle()+'"/>' +
        '<div style="font-size:10px;color:#475569;margin-top:4px">입력하면 예약하기 버튼이 활성화됩니다</div></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">유튜브 숏츠 링크 또는 ID *</label>' +
        '<input id="s-ytid" placeholder="https://youtube.com/shorts/xxxxx" style="'+adminInputStyle()+'"/>' +
        '<div id="s-yt-preview" style="margin-top:8px;border-radius:10px;overflow:hidden;display:none;aspect-ratio:9/16;max-height:280px;background:#000"><iframe id="s-yt-frame" width="100%" height="100%" style="border:none"></iframe></div></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">정렬 순서 (숫자 작을수록 앞)</label>' +
        '<input id="s-order" type="number" value="0" style="'+adminInputStyle()+'"/></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0">' +
        '<label style="font-size:14px;font-weight:700;color:#f1f5f9">노출</label>' +
        '<input id="s-active" type="checkbox" checked style="width:20px;height:20px;cursor:pointer;accent-color:#c026d3"/></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;margin-top:18px">' +
        '<button onclick="saveShorts()" style="flex:1;background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit">저장</button>' +
        '<button onclick="closeShortsModal()" style="background:rgba(255,255,255,.06);color:#94a3b8;border:1.5px solid rgba(255,255,255,.09);border-radius:12px;padding:14px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">취소</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ── 탭 전환 ──────────────────────────────────────────────────────────────
function switchShortsAdminTab(tab) {
  _shortsAdminTab = tab;
  ['overview','items','daily'].forEach(k => {
    const btn = document.getElementById('sat-'+k);
    if (!btn) return;
    btn.style.color       = k===tab ? '#e879f9' : '#64748b';
    btn.style.borderColor = k===tab ? '#e879f9' : 'transparent';
  });
  const body = document.getElementById('shorts-admin-body');
  if (!body) return;
  body.innerHTML = '<div style="text-align:center;padding:20px;color:#475569">불러오는 중...</div>';
  if (tab==='overview') renderShortsOverview();
  else if (tab==='items') renderShortsItems();
  else if (tab==='daily') renderShortsDaily();
}

// ── 탭1: 현황 요약 ────────────────────────────────────────────────────────
async function renderShortsOverview() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const s = await fetch('/api/admin/shorts/stats/summary').then(r=>r.json());
    if (s.error) throw new Error(s.error);

    const todayVsDiff = s.yest_views > 0 ? Math.round((s.today_views - s.yest_views) / s.yest_views * 100) : null;
    const todaySpDiff = s.yest_sp   > 0 ? Math.round((s.today_sp   - s.yest_sp)   / s.yest_sp   * 100) : null;
    const totalCtr    = s.total_views > 0 ? (s.total_sp / s.total_views * 100).toFixed(1) : '0.0';
    const weekCtr     = s.week_views  > 0 ? (s.week_sp  / s.week_views  * 100).toFixed(1) : '0.0';

    const diffBadge = (v) => v===null ? '' :
      '<span style="font-size:10px;padding:1px 6px;border-radius:6px;margin-left:5px;background:'+(v>=0?'rgba(52,211,153,.15)':'rgba(248,113,113,.15)')+';color:'+(v>=0?'#34d399':'#f87171')+'">'+(v>=0?'▲':'▼')+Math.abs(v)+'%</span>';

    const kpiCard = (icon, label, val, sub, color) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;flex:1;min-width:0">' +
        '<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:6px"><i class="fas '+icon+'" style="color:'+color+';margin-right:4px"></i>'+label+'</div>' +
        '<div style="font-size:22px;font-weight:900;color:#f1f5f9">'+val+'</div>' +
        '<div style="font-size:10px;color:#475569;margin-top:3px">'+sub+'</div>' +
      '</div>';

    body.innerHTML =
      // KPI 4개
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
        kpiCard('fa-eye','오늘 조회',s.today_views.toLocaleString()+'회', '어제 '+s.yest_views.toLocaleString()+'회'+diffBadge(todayVsDiff), '#6366f1') +
        kpiCard('fa-calendar-check','오늘 예약클릭',s.today_sp.toLocaleString()+'회', '어제 '+s.yest_sp.toLocaleString()+'회'+diffBadge(todaySpDiff), '#FF4D7D') +
        kpiCard('fa-chart-line','7일 조회',s.week_views.toLocaleString()+'회', 'CTR '+weekCtr+'%', '#f59e0b') +
        kpiCard('fa-video','총 숏폼',s.total_items+'개', '노출중 '+s.active_items+'개', '#e879f9') +
      '</div>' +
      // 누적 합계 바
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:14px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px">📊 누적 전체 실적</div>' +
        '<div style="display:flex;justify-content:space-around;text-align:center">' +
          '<div><div style="font-size:20px;font-weight:900;color:#6366f1">'+s.total_views.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">총 조회수</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#FF4D7D">'+s.total_sp.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">총 예약클릭</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#f59e0b">'+totalCtr+'%</div><div style="font-size:10px;color:#64748b;margin-top:2px">전체 CTR</div></div>' +
        '</div>' +
      '</div>' +
      // TOP 3
      await _shortsTop3Html();
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

async function _shortsTop3Html() {
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) return '';
    const top3 = items.slice(0,3);
    const rows = top3.map((it,i) => {
      const medals = ['🥇','🥈','🥉'];
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<div style="font-size:18px;flex-shrink:0">'+medals[i]+'</div>' +
        '<img src="https://img.youtube.com/vi/'+it.youtube_id+'/mqdefault.jpg" style="width:52px;height:34px;object-fit:cover;border-radius:6px;flex-shrink:0"/>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(it.name||'-')+'</div>' +
          '<div style="font-size:10px;color:#64748b">'+(it.category||'')+'</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:12px;font-weight:800;color:#6366f1">'+Number(it.total_views).toLocaleString()+'<span style="font-size:9px;color:#475569">회</span></div>' +
          '<div style="font-size:10px;color:#FF4D7D">CTR '+it.ctr+'%</div>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">🏆 조회수 TOP 3</div>' +
      rows +
    '</div>';
  } catch(_) { return ''; }
}

// ── 탭2: 업체별 실적 ──────────────────────────────────────────────────────
async function renderShortsItems() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) {
      body.innerHTML = '<div style="padding:40px;text-align:center;color:#475569">등록된 숏폼이 없습니다</div>';
      return;
    }

    const maxViews = Math.max(...items.map(it=>Number(it.total_views)||0), 1);

    const cards = items.map(item => {
      const pct = Math.round((Number(item.total_views)||0) / maxViews * 100);
      const thumb = item.youtube_id
        ? '<img src="https://img.youtube.com/vi/'+item.youtube_id+'/mqdefault.jpg" style="width:72px;height:46px;object-fit:cover;border-radius:7px;flex-shrink:0"/>'
        : '<div style="width:72px;height:46px;background:rgba(255,255,255,.06);border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">📭</div>';
      return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:8px">' +
        '<div style="display:flex;gap:10px;align-items:flex-start">' +
          thumb +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<div style="font-size:13px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+(item.name||'(업체명 없음)')+'</div>' +
              '<span style="font-size:9px;padding:1px 5px;border-radius:5px;flex-shrink:0;background:'+(item.active?'rgba(52,211,153,.15)':'rgba(255,255,255,.06)')+';color:'+(item.active?'#34d399':'#64748b')+'">'+(item.active?'노출':'숨김')+'</span>' +
            '</div>' +
            '<div style="font-size:10px;color:#64748b;margin-bottom:6px">'+(item.category||'')+'</div>' +
            // 조회수 바
            '<div style="background:rgba(255,255,255,.06);border-radius:4px;height:4px;margin-bottom:6px">' +
              '<div style="width:'+pct+'%;height:4px;border-radius:4px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#6366f1">'+Number(item.total_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">전체조회</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#f59e0b">'+Number(item.week_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">7일조회</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#FF4D7D">'+Number(item.total_sp).toLocaleString()+'</div><div style="font-size:9px;color:#475569">예약클릭</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#34d399">'+item.ctr+'%</div><div style="font-size:9px;color:#475569">CTR</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end">' +
          '<button onclick="showShortsItemDaily('+item.id+',&quot;'+((item.name||'').replace(/"/g,''))+'&quot;)" style="background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit"><i class="fas fa-chart-bar" style="margin-right:3px"></i>일별</button>' +
          '<button onclick="openShortsModal('+item.id+')" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#f1f5f9;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">수정</button>' +
          '<button onclick="delShorts('+item.id+')" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">삭제</button>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML = '<div style="font-size:11px;color:#64748b;margin-bottom:10px">총 <b style="color:#e879f9">'+items.length+'</b>개 · 조회수 높은 순</div>' + cards;
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

// 특정 업체 일별 팝업
async function showShortsItemDaily(id, name) {
  const data = await fetch('/api/admin/shorts/stats/item/'+id).then(r=>r.json());
  const body = document.getElementById('shorts-admin-body');

  if (!data.length) {
    alert(name+' - 아직 일별 데이터가 없습니다. (오늘부터 조회수가 쌓이면 표시됩니다)');
    return;
  }

  // 간단한 텍스트 바 차트 오버레이
  const maxV = Math.max(...data.map(d=>Number(d.views)||0), 1);
  const rows = data.slice(-14).map(d => {  // 최근 14일
    const pct = Math.round((Number(d.views)||0) / maxV * 100);
    const dd  = d.date.slice(5);  // MM-DD
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
      '<div style="font-size:10px;color:#64748b;width:32px;flex-shrink:0">'+dd+'</div>' +
      '<div style="flex:1;background:rgba(255,255,255,.06);border-radius:3px;height:18px;position:relative">' +
        '<div style="width:'+pct+'%;height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
        '<span style="position:absolute;right:6px;top:2px;font-size:10px;color:#f1f5f9;font-weight:700">'+Number(d.views).toLocaleString()+'</span>' +
      '</div>' +
      '<div style="font-size:10px;color:#FF4D7D;width:28px;text-align:right;flex-shrink:0">'+Number(d.sp)+'클</div>' +
    '</div>';
  }).join('');

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end';
  overlay.innerHTML =
    '<div style="background:#161616;border-radius:20px 20px 0 0;padding:20px;width:100%;max-height:80vh;overflow-y:auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div style="font-size:14px;font-weight:800;color:#f1f5f9">📊 '+name+' · 최근 14일</div>' +
        '<button id="shorts-daily-close-btn" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;padding:0 4px">✕</button>' +
      '</div>' +
      '<div style="font-size:10px;color:#64748b;margin-bottom:10px;display:flex;gap:14px">' +
        '<span><span style="color:#6366f1">■</span> 조회수</span>' +
        '<span><span style="color:#FF4D7D">■</span> 예약클릭</span>' +
      '</div>' +
      rows +
    '</div>';
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  const closeBtn = overlay.querySelector('#shorts-daily-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
}

// ── 탭3: 일별 추이 ────────────────────────────────────────────────────────
async function renderShortsDaily() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const data = await fetch('/api/admin/shorts/stats/daily').then(r=>r.json());

    if (!data.length) {
      body.innerHTML =
        '<div style="text-align:center;padding:40px 20px;color:#475569">' +
          '<div style="font-size:32px;margin-bottom:10px">📊</div>' +
          '<div style="font-size:13px">아직 일별 데이터가 없습니다</div>' +
          '<div style="font-size:11px;color:#334155;margin-top:6px">숏폼이 조회되면 자동으로 기록됩니다</div>' +
        '</div>';
      return;
    }

    const recent = data.slice(-30);
    const maxV = Math.max(...recent.map(d=>Number(d.views)||0), 1);
    const maxS = Math.max(...recent.map(d=>Number(d.sp)||0), 1);
    const totalV = recent.reduce((s,d)=>s+Number(d.views),0);
    const totalS = recent.reduce((s,d)=>s+Number(d.sp),0);

    // 바 차트 (수평)
    const rows = recent.map(d => {
      const pctV = Math.round((Number(d.views)||0) / maxV * 100);
      const pctS = Math.max(1, Math.round((Number(d.sp)||0) / maxV * 100));
      const dd   = d.date.slice(5);
      return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
        '<div style="font-size:9px;color:#64748b;width:28px;flex-shrink:0;text-align:right">'+dd+'</div>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:2px">' +
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:14px;position:relative">' +
            '<div style="width:'+pctV+'%;height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#818cf8)"></div>' +
            (Number(d.views)>0?'<span style="position:absolute;left:'+(pctV>50?'auto':'calc('+pctV+'% + 4px)')+';right:'+(pctV>50?'6px':'auto')+';top:1px;font-size:9px;color:#f1f5f9;font-weight:700">'+Number(d.views).toLocaleString()+'</span>':'') +
          '</div>' +
          (Number(d.sp)>0?
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:8px;position:relative">' +
            '<div style="width:'+pctS+'%;height:100%;border-radius:3px;background:#FF4D7D88"></div>' +
          '</div>':'') +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML =
      // 요약 배지
      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<div style="flex:1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#818cf8">'+totalV.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30일 총 조회</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(255,77,125,.1);border:1px solid rgba(255,77,125,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#FF4D7D">'+totalS.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30일 예약클릭</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#f59e0b">'+(totalV>0?(totalS/totalV*100).toFixed(1):'0.0')+'%</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">평균 CTR</div>' +
        '</div>' +
      '</div>' +
      // 범례
      '<div style="font-size:10px;color:#64748b;margin-bottom:8px;display:flex;gap:12px">' +
        '<span><span style="color:#818cf8">■</span> 조회수 (위)</span>' +
        '<span><span style="color:#FF4D7D">■</span> 예약클릭 (아래)</span>' +
      '</div>' +
      // 차트
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px">' +
        rows +
      '</div>';

  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

function renderShortsAdmin() { renderShortsAdminShell(); switchShortsAdminTab(_shortsAdminTab); }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👁️ 방문자 현황 관리자 UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _visitorsRefreshTimer = null;

async function loadVisitors() {
  const p = document.getElementById('panel-visitors');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:13px">불러오는 중...</div>';
  clearInterval(_visitorsRefreshTimer);

  try {
    const [summary, sessions] = await Promise.all([
      fetch('/api/admin/sessions/summary').then(r => r.json()),
      fetch('/api/admin/sessions').then(r => r.json()),
    ]);
    renderVisitors(summary, sessions);

    // 30초마다 자동 새로고침
    _visitorsRefreshTimer = setInterval(async () => {
      if (curTab !== 'visitors') { clearInterval(_visitorsRefreshTimer); return; }
      const [s2, ses2] = await Promise.all([
        fetch('/api/admin/sessions/summary').then(r => r.json()),
        fetch('/api/admin/sessions').then(r => r.json()),
      ]);
      renderVisitors(s2, ses2);
    }, 30000);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">오류: ' + e.message + '</div>';
  }
}

function renderVisitors(s, sessions) {
  const p = document.getElementById('panel-visitors');
  const n = (v) => Number(v) || 0;

  // ── 공통 포맷 헬퍼 ───────────────────────────────────────────────────
  const fmtSec = (sec) => {
    sec = n(sec);
    if (sec <= 0) return '-';
    if (sec < 60) return sec + '초';
    return Math.floor(sec/60) + '분 ' + (sec%60) + '초';
  };
  const tabLabel = (t) => ({'shorts':'⚡릴스','feed':'🎬영상','map':'🗺️지도','inquiry':'✉️문의'}[t] || t);
  const diffBadge = (v, y) => {
    if (!y) return '';
    const d = v - y, c = d >= 0 ? '#34d399' : '#f87171';
    return '<span style="font-size:10px;color:'+c+';margin-left:4px">'+(d>=0?'▲':'▼')+Math.abs(d)+'</span>';
  };

  // ── 집계 ─────────────────────────────────────────────────────────────
  const total    = sessions.length;
  const nowActive = sessions.filter(x => Date.now() - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const watched  = sessions.filter(x => n(x.shorts_count)+n(x.feed_card_cnt) > 0).length;
  const booked   = sessions.filter(x => n(x.book_count) > 0).length;
  const mapUsed  = sessions.filter(x => n(x.map_pin_cnt) > 0).length;
  const searched = sessions.filter(x => n(x.search_cnt) > 0).length;
  const pct = (a,b) => b > 0 ? Math.round(a/b*100) : 0;

  // ── 세션 카드 (클릭하면 타임라인 펼치기) ──────────────────────────────
  const evtIcon = {'shorts_view':'⚡','shorts_view_end':'⏱','shorts_book':'🎯',
                   'feed_card':'🎬','feed_book':'🎯','map_pin':'📍','map_book':'🎯'};
  const evtLabel = {'shorts_view':'릴스 시청','shorts_view_end':'릴스 시청 완료',
                    'shorts_book':'릴스 예약클릭','feed_card':'영상 업체 조회',
                    'feed_book':'영상 예약클릭','map_pin':'지도 업체 선택',
                    'map_book':'지도 예약클릭'};
  const evtColor = {'shorts_view':'#e879f9','shorts_view_end':'#a855f7','shorts_book':'#FF4D7D',
                    'feed_card':'#818cf8','feed_book':'#FF4D7D',
                    'map_pin':'#34d399','map_book':'#FF4D7D'};

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count) > 0) parts.push('<span style="background:rgba(232,121,249,.15);color:#e879f9;padding:1px 5px;border-radius:4px;font-size:10px">⚡'+n(sess.shorts_count)+'개</span>');
    if (n(sess.shorts_book)  > 0) parts.push('<span style="background:rgba(255,77,125,.12);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-size:10px">릴스예약'+n(sess.shorts_book)+'</span>');
    if (n(sess.feed_card_cnt)> 0) parts.push('<span style="background:rgba(99,102,241,.15);color:#818cf8;padding:1px 5px;border-radius:4px;font-size:10px">🎬'+n(sess.feed_card_cnt)+'개</span>');
    if (n(sess.feed_book_cnt)> 0) parts.push('<span style="background:rgba(255,77,125,.12);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-size:10px">영상예약'+n(sess.feed_book_cnt)+'</span>');
    if (n(sess.map_pin_cnt)  > 0) parts.push('<span style="background:rgba(16,185,129,.15);color:#34d399;padding:1px 5px;border-radius:4px;font-size:10px">📍'+n(sess.map_pin_cnt)+'곳</span>');
    if (n(sess.map_book_cnt) > 0) parts.push('<span style="background:rgba(255,77,125,.12);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-size:10px">지도예약'+n(sess.map_book_cnt)+'</span>');
    if (n(sess.search_cnt)   > 0) parts.push('<span style="background:rgba(245,158,11,.15);color:#fbbf24;padding:1px 5px;border-radius:4px;font-size:10px">🔍'+n(sess.search_cnt)+'</span>');
    if (n(sess.inquiry_cnt)  > 0) parts.push('<span style="background:rgba(52,211,153,.15);color:#34d399;padding:1px 5px;border-radius:4px;font-size:10px">✉️'+n(sess.inquiry_cnt)+'</span>');
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:10px">조용한 방문</span>';
  };

  const cards = sessions.map(sess => {
    const isNow  = Date.now() - new Date(sess.last_seen).getTime() < 5*60*1000;
    const timeStr = new Date(sess.entered_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dur    = fmtSec(sess.duration_sec);
    const device = sess.device === 'mobile' ? '📱' : '🖥️';
    const tabs   = (sess.tabs_visited||[]).map(tabLabel).join(' → ') || '진입만';
    const sid    = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);

    return (
      '<div id="sc-'+sid+'" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,'+(isNow?'.18':'.06')+');border-radius:14px;margin-bottom:8px;overflow:hidden'+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.25)':'')+'">' +
        // 카드 헤더 (클릭 영역)
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:11px 13px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
            '<div style="display:flex;align-items:center;gap:6px">' +
              '<span style="font-size:14px">'+device+'</span>' +
              '<span style="font-size:12px;font-weight:700;color:#f1f5f9">'+timeStr+'</span>' +
              (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 5px;border-radius:4px;font-weight:700">● 접속중</span>' : '') +
              (sess.exited ? '<span style="font-size:9px;color:#475569">이탈</span>' : '') +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<span style="font-size:11px;color:#64748b">'+dur+'</span>' +
              '<span style="font-size:10px;color:'+(totalActs>0?'#818cf8':'#334155')+';background:rgba(99,102,241,.1);padding:1px 6px;border-radius:4px">'+totalActs+'개 행동 ▾</span>' +
            '</div>' +
          '</div>' +
          '<div style="font-size:11px;color:#475569;margin-bottom:5px">'+tabs+'</div>' +
          '<div style="display:flex;gap:4px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        // 타임라인 (처음엔 숨김)
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 13px;background:rgba(0,0,0,.2)">' +
          '<div style="font-size:10px;color:#475569;margin-bottom:8px">행동 타임라인 로딩 중...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:30px;color:#334155;font-size:13px">오늘 방문자가 없습니다</div>';

  p.innerHTML =
    '<div style="padding:14px">' +
      // 헤더
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
        '<div style="font-size:15px;font-weight:800;color:#f1f5f9">👁️ 방문자 현황</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:11px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 10px;border-radius:20px;font-weight:700">● 지금 '+nowActive+'명</span>' : '') +
          '<button onclick="loadVisitors()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
        '</div>' +
      '</div>' +

      // KPI — 상단 4칸
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        _kpiCard('fa-user','오늘 방문', s.today_total+'명', '어제 '+s.yest_total+'명'+diffBadge(s.today_total,s.yest_total), '#6366f1') +
        _kpiCard('fa-clock','평균 체류', fmtSec(s.today_avg_sec), '7일 누적 '+s.week_total+'명', '#f59e0b') +
        _kpiCard('fa-mobile-alt','모바일 비율', s.today_total > 0 ? Math.round(s.today_mobile/s.today_total*100)+'%' : '-', '모바일 '+s.today_mobile+' / PC '+s.today_desktop, '#e879f9') +
        _kpiCard('fa-calendar-check','예약클릭', s.today_booked+'명', '릴스 '+(s.sum_shorts_book||0)+' · 영상 '+(s.sum_feed_book||0)+' · 지도 '+(s.sum_map_book||0), '#FF4D7D') +
      '</div>' +

      // 1인당 평균 행동량 섹션
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:10px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:9px">📐 1인당 평균 행동량</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">' +
          _statChip('⚡릴스', n(s.avg_shorts).toFixed(1)+'개', '#e879f9') +
          _statChip('🎬영상', n(s.avg_feed_card).toFixed(1)+'개', '#818cf8') +
          _statChip('🗺️지도', n(s.avg_map_pin).toFixed(1)+'곳', '#34d399') +
        '</div>' +
        // 세분화 탭별 이용자 수
        '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;font-size:10px;color:#64748b">' +
          '<span>릴스 이용 <b style="color:#e879f9">'+s.today_watched+'명</b></span>' +
          '<span>영상 이용 <b style="color:#818cf8">'+s.used_feed+'명</b></span>' +
          '<span>지도 이용 <b style="color:#34d399">'+s.used_map+'명</b></span>' +
          '<span>검색 이용 <b style="color:#fbbf24">'+(s.sum_search||0)+'회</b></span>' +
        '</div>' +
      '</div>' +

      // 탭별 합산 그리드
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:10px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:9px">📊 오늘 탭별 행동 합산</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">' +
          _statChip('⚡시청', (s.sum_feed_card||0)+n(s.today_watched)+'회', '#e879f9') +
          _statChip('릴스예약', (s.sum_shorts_book||0)+'회', '#FF4D7D') +
          _statChip('🎬카드', (s.sum_feed_card||0)+'회', '#818cf8') +
          _statChip('영상예약', (s.sum_feed_book||0)+'회', '#FF4D7D') +
          _statChip('📍마커', (s.sum_map_pin||0)+'회', '#34d399') +
          _statChip('지도예약', (s.sum_map_book||0)+'회', '#FF4D7D') +
          _statChip('🔍검색', (s.sum_search||0)+'회', '#fbbf24') +
          _statChip('✉️문의', (s.sum_inquiry||0)+'회', '#34d399') +
        '</div>' +
      '</div>' +

      // 전환 퍼널
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:10px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:9px">🔻 전환 퍼널</div>' +
        _funnelBar('진입', total, 100, '#6366f1') +
        _funnelBar('콘텐츠 시청', watched, pct(watched,total), '#e879f9') +
        _funnelBar('지도 탐색', mapUsed, pct(mapUsed,total), '#34d399') +
        _funnelBar('검색 사용', searched, pct(searched,total), '#fbbf24') +
        _funnelBar('예약 클릭', booked, pct(booked,total), '#FF4D7D') +
      '</div>' +

      // 세션 목록
      '<div style="font-size:11px;color:#64748b;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">' +
        '<span>오늘·어제 방문자 (최대 200명)</span>' +
        '<span style="color:#334155">▾ 클릭하면 행동 타임라인 확인</span>' +
      '</div>' +
      cards +
    '</div>';
}

// 세션 타임라인 펼치기/접기
const _tlOpen = {};
async function toggleSessTimeline(sid) {
  const tl = document.getElementById('tl-' + sid);
  if (!tl) return;
  const isOpen = _tlOpen[sid];
  _tlOpen[sid] = !isOpen;
  tl.style.display = isOpen ? 'none' : 'block';
  if (isOpen) return; // 접기는 끝

  // 타임라인 로드
  tl.innerHTML = '<div style="font-size:10px;color:#475569;padding:4px 0">불러오는 중...</div>';
  try {
    const evts = await fetch('/api/admin/sessions/' + sid + '/events').then(r => r.json());
    if (!evts.length) {
      tl.innerHTML = '<div style="font-size:11px;color:#334155;padding:4px 0">기록된 업체 행동이 없습니다</div>';
      return;
    }
    const evtIcon  = {shorts_view:'⚡',shorts_view_end:'⏱️',shorts_book:'🎯 ',feed_card:'🎬',feed_book:'🎯 ',map_pin:'📍',map_book:'🎯 '};
    const evtLabel = {shorts_view:'릴스 시청',shorts_view_end:'릴스 이탈',shorts_book:'릴스 예약클릭',
                      feed_card:'영상 업체 조회',feed_book:'영상 예약클릭',
                      map_pin:'지도 핀 선택',map_book:'지도 예약클릭'};
    const evtColor = {shorts_view:'#e879f9',shorts_view_end:'#a855f7',shorts_book:'#FF4D7D',
                      feed_card:'#818cf8',feed_book:'#FF4D7D',map_pin:'#34d399',map_book:'#FF4D7D'};
    const fmtSec = (s) => { s=Number(s)||0; if(!s) return ''; return s<60?s+'초':Math.floor(s/60)+'분'+(s%60)+'초'; };

    const rows = evts.map((e, i) => {
      const t    = new Date(e.occurred_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const icon = evtIcon[e.event_type] || '●';
      const lbl  = evtLabel[e.event_type] || e.event_type;
      const col  = evtColor[e.event_type] || '#64748b';
      const isBook = e.event_type.endsWith('_book');
      const secStr = e.viewed_sec > 0 ? ' <span style="color:#64748b;font-size:9px">('+fmtSec(e.viewed_sec)+')</span>' : '';
      return (
        '<div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)">' +
          // 타임라인 선
          '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">' +
            '<div style="width:20px;height:20px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-size:9px">'+icon+'</div>' +
            (i < evts.length-1 ? '<div style="width:1px;background:rgba(255,255,255,.08);flex:1;min-height:6px"></div>' : '') +
          '</div>' +
          // 내용
          '<div style="flex:1;padding-bottom:4px">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<span style="font-size:10px;font-weight:700;color:'+col+'">'+lbl+'</span>' +
              (isBook ? '<span style="font-size:8px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:0 4px;border-radius:3px">예약</span>' : '') +
              secStr +
            '</div>' +
            (e.shop_name ? '<div style="font-size:11px;color:#f1f5f9;font-weight:600">'+e.shop_name+'</div>' : '') +
            (e.shop_cat  ? '<div style="font-size:10px;color:#475569">'+e.shop_cat+'</div>' : '') +
            '<div style="font-size:9px;color:#334155;margin-top:2px">'+t+'</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    tl.innerHTML = '<div style="font-size:10px;color:#475569;margin-bottom:6px">업체별 행동 기록 ('+evts.length+'건)</div>' + rows;
  } catch(e) {
    tl.innerHTML = '<div style="font-size:10px;color:#f87171">로드 실패: ' + e.message + '</div>';
  }
}

function _kpiCard(icon, label, val, sub, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px">' +
    '<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:5px"><i class="fas ' + icon + '" style="color:' + color + ';margin-right:4px"></i>' + label + '</div>' +
    '<div style="font-size:20px;font-weight:900;color:#f1f5f9">' + val + '</div>' +
    '<div style="font-size:10px;color:#475569;margin-top:3px">' + sub + '</div>' +
  '</div>';
}

function _statChip(label, val, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:8px 10px;text-align:center">' +
    '<div style="font-size:9px;color:#64748b;margin-bottom:4px">' + label + '</div>' +
    '<div style="font-size:15px;font-weight:800;color:' + color + '">' + val + '</div>' +
  '</div>';
}

function _funnelBar(label, count, pct, color) {
  return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">' +
    '<div style="font-size:11px;color:#94a3b8;width:60px;flex-shrink:0">' + label + '</div>' +
    '<div style="flex:1;background:rgba(255,255,255,.06);border-radius:4px;height:20px;position:relative">' +
      '<div style="width:' + pct + '%;height:100%;border-radius:4px;background:' + color + ';opacity:.8"></div>' +
      '<span style="position:absolute;left:8px;top:2px;font-size:11px;color:#fff;font-weight:700">' + count + '명</span>' +
    '</div>' +
    '<div style="font-size:11px;color:#64748b;width:32px;text-align:right">' + pct + '%</div>' +
  '</div>';
}

function adminInputStyle() {
  return 'width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;';
}

function openShortsModal(id) {
  _shortsAdminEditId = id;
  const item = id ? _shortsAdminItems.find(x=>x.id===id) : null;
  document.getElementById('shortsModalTitle').textContent = id ? '숏폼 수정' : '숏폼 추가';
  document.getElementById('s-name').value   = item?.name            || '';
  document.getElementById('s-addr').value   = item?.address         || '';
  document.getElementById('s-place').value  = item?.smart_place_url || '';
  document.getElementById('s-ytid').value   = item?.youtube_id      || '';
  document.getElementById('s-order').value  = item?.sort_order ?? 0;
  document.getElementById('s-active').checked = item ? item.active : true;
  // 카테고리 select 옵션을 직접 채움 (option 배경색 포함)
  const sCat = document.getElementById('s-cat');
  sCat.innerHTML = '<option value="" style="background:#1b1b1b;color:#fff">선택 안함</option>' +
    CAT_OPTIONS.map(c => '<option value="'+c+'" style="background:#1b1b1b;color:#fff"'+(item?.category===c?' selected':'')+'>'+c+'</option>').join('');
  if (!id) sCat.value = '';
  // 유튜브 미리보기
  const ytId = item?.youtube_id || '';
  const preview = document.getElementById('s-yt-preview');
  const frame   = document.getElementById('s-yt-frame');
  if (ytId) { preview.style.display='block'; frame.src='https://www.youtube.com/embed/'+ytId+'?rel=0'; }
  else { preview.style.display='none'; frame.src=''; }
  document.getElementById('shortsModalBg').style.display = 'flex';
}

function closeShortsModal() {
  document.getElementById('shortsModalBg').style.display = 'none';
}

// 유튜브 URL → 영상 ID 추출 (정규식 없이 문자열 파싱)
function extractYtId(raw) {
  if (!raw) return '';
  raw = raw.trim();
  // shorts/XXXXXXXXXXX 형태
  var si = raw.indexOf('shorts/');
  if (si !== -1) return raw.slice(si + 7, si + 18);
  // youtu.be/XXXXXXXXXXX 형태
  var bi = raw.indexOf('youtu.be/');
  if (bi !== -1) return raw.slice(bi + 9, bi + 20).split('?')[0];
  // watch?v=XXXXXXXXXXX 형태
  var vi = raw.indexOf('v=');
  if (vi !== -1) return raw.slice(vi + 2, vi + 13).split('&')[0];
  // embed/XXXXXXXXXXX 형태
  var ei = raw.indexOf('embed/');
  if (ei !== -1) return raw.slice(ei + 6, ei + 17).split('?')[0];
  // 11자리 ID만 입력한 경우
  if (raw.length === 11) return raw;
  return '';
}

async function saveShorts() {
  const name = document.getElementById('s-name').value.trim();
  if (!name) { toast('업체명을 입력하세요'); return; }
  const rawYt = document.getElementById('s-ytid').value.trim();
  const ytId  = extractYtId(rawYt) || rawYt;
  if (!ytId) { toast('유튜브 링크를 입력하세요'); return; }
  const body = {
    name,
    category:       document.getElementById('s-cat').value,
    address:        document.getElementById('s-addr').value.trim(),
    smartPlaceUrl:  document.getElementById('s-place').value.trim(),
    youtubeId:      ytId,
    sortOrder:      parseInt(document.getElementById('s-order').value)||0,
    active:         document.getElementById('s-active').checked,
  };
  const url    = _shortsAdminEditId ? '/api/admin/shorts/'+_shortsAdminEditId : '/api/admin/shorts';
  const method = _shortsAdminEditId ? 'PUT' : 'POST';
  const r = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
  if (r.ok) {
    closeShortsModal();
    toast(_shortsAdminEditId ? '숏폼 수정 완료!' : '숏폼 등록 완료!');
    await loadShortsAdmin();
  } else {
    toast('저장 실패');
  }
}

async function delShorts(id) {
  const found = _shortsAdminItems.find(x => x.id === id);
  const name = found ? found.name : '이 숏폼을';
  if (!confirm(name+' 삭제할까요?')) return;
  const r = await fetch('/api/admin/shorts/'+id, {method:'DELETE'});
  if (r.ok) { toast('삭제 완료'); await loadShortsAdmin(); }
  else toast('삭제 실패');
}

// ── 증감 헬퍼
function deltaHtml(today, yest) {
  if (yest===0 && today===0) return '<span class="kpi-delta flat">—</span>';
  if (yest===0 && today>0)   return '<span class="kpi-delta up">▲ NEW</span>';
  const d = today-yest, p = Math.round(Math.abs(d)/yest*100);
  if (d>0) return '<span class="kpi-delta up">▲ +' + d.toLocaleString() + ' (' + p + '%)</span>';
  if (d<0) return '<span class="kpi-delta down">▼ ' + d.toLocaleString() + ' (' + p + '%)</span>';
  return '<span class="kpi-delta flat">— 동일</span>';
}

// ── 데이터 로드
async function loadAll() {
  const [d, dv] = await Promise.all([
    fetch('/api/admin/stats').then(r=>r.json()),
    fetch('/api/admin/daily-visits').then(r=>r.json()),
  ]);
  _stats  = d;
  _dvRows = Array.isArray(dv) ? dv : [];
  shopData = d.stats || [];
  renderDashboard();
  if (curTab==='shops') renderShops(shopData);
  if (curTab==='pay')   renderPayTab();
}

// ======================================================
// 대시보드 탭
// ======================================================
function renderDashboard() {
  const d   = _stats;
  const dv  = _dvRows;
  const p   = document.getElementById('panel-stats');
  if (!d) return;

  const todayStr = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  const yestStr  = new Date(Date.now()+9*60*60*1000-86400000).toISOString().slice(0,10);
  const todayRow = dv.find(r=>r.visit_date===todayStr);
  const yestRow  = dv.find(r=>r.visit_date===yestStr);
  const todayVisit = todayRow ? (parseInt(todayRow.visit_cnt)||0) : 0;
  const yestVisit  = yestRow  ? (parseInt(yestRow.visit_cnt)||0)  : 0;

  const tV  = d.todayViews   ||0, yV  = d.yestViews   ||0;
  const tF  = d.todayFeedSP  ||0, yF  = d.yestFeedSP  ||0;
  const tM  = d.todayMapSP   ||0, yM  = d.yestMapSP   ||0;
  const tR  = d.todayRecView ||0, yR  = d.yestRecView  ||0;
  const todayLabel = new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});

  // 1) 오늘 KPI
  const kpi =
    '<div class="section-title">📅 오늘 현황 <span style="font-size:10px;font-weight:500;color:var(--t3);margin-left:4px">' + todayLabel + '</span></div>' +
    '<div class="kpi-grid" style="grid-template-columns:repeat(2,1fr)">' +
      '<div class="kpi-card kpi-visit"><div class="kpi-icon">🙋</div><div class="kpi-val">' + todayVisit.toLocaleString() + '</div><div class="kpi-lbl">방문자</div>' + deltaHtml(todayVisit,yestVisit) + '</div>' +
      '<div class="kpi-card kpi-view"><div class="kpi-icon">👁</div><div class="kpi-val">' + tV.toLocaleString() + '</div><div class="kpi-lbl">영상 조회</div>' + deltaHtml(tV,yV) + '</div>' +
      '<div class="kpi-card kpi-feed"><div class="kpi-icon">📹</div><div class="kpi-val">' + tF.toLocaleString() + '</div><div class="kpi-lbl">피드 클릭</div>' + deltaHtml(tF,yF) + '</div>' +
      '<div class="kpi-card kpi-map"><div class="kpi-icon">🗺️</div><div class="kpi-val">' + tM.toLocaleString() + '</div><div class="kpi-lbl">지도 클릭</div>' + deltaHtml(tM,yM) + '</div>' +
    '</div>' +
    // ⭐ 추천탭 조회 별도 강조 배너
    (tR > 0 || yR > 0
      ? '<div style="margin-top:10px;padding:12px 16px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);border-radius:12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div><span style="font-size:18px">⭐</span> <strong style="color:#fbbf24;font-size:15px">' + tR.toLocaleString() + '</strong> <span style="font-size:12px;color:#94a3b8">추천탭 조회 (오늘)</span></div>' +
          deltaHtml(tR, yR) +
        '</div>'
      : '<div style="margin-top:10px;padding:10px 16px;background:rgba(251,191,36,.05);border:1px dashed rgba(251,191,36,.2);border-radius:12px;font-size:12px;color:#64748b;text-align:center">⭐ 추천탭 조회 데이터 없음 (오늘)</div>'
    );

  // 2) 누적 요약
  const totalClicks = (d.totalFeedSP||0)+(d.totalMapSP||0);
  const accum =
    '<div class="section-title">📊 누적 합계</div>' +
    '<div class="summary-bar">' +
      '<div class="sb-item"><div class="sb-val" style="color:#FF8FA3">' + (d.totalViews||0).toLocaleString() + '</div><div class="sb-lbl">총 영상조회</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:var(--green)">' + totalClicks.toLocaleString() + '</div><div class="sb-lbl">총 예약클릭</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:#a78bfa">' + (d.totalShops||0) + '</div><div class="sb-lbl">등록 업체</div></div>' +
    '</div>';

  // 3) 투자자 지표
  const invest = buildInvestMetrics(d, dv);

  // 4) 14일 차트
  const chart = buildChart14(_chartMode);

  // 5) 업체별 전환율 인사이트
  const shopInsight = buildShopInsight();

  // 6) 오늘 업체 랭킹
  const rank = buildRank(_rankMode);

  // 7) 추천탭 조회 랭킹 (7일)
  const recRank = buildRecRank();

  p.innerHTML = kpi + accum + invest + chart + shopInsight + rank + recRank;
}

// ── 추천탭 전체 현황 섹션
function buildRecRank() {
  const all  = shopData || [];
  const recOn = all.filter(s => s.isRecommended);
  // 전체 7일/오늘 합계
  const totalWeek  = recOn.reduce((a,s) => a + (s.weekRecView||0), 0);
  const totalToday = recOn.reduce((a,s) => a + (s.todayRecView||0), 0);
  // 14일 차트 (weekChart에서 recView 추출)
  const chart = (_stats && _stats.weekChart) ? _stats.weekChart : [];

  // 헤더 KPI
  const header =
    '<div class="section-title" style="margin-top:20px">⭐ 추천탭 현황</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + recOn.length + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">노출 업체 수</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + (totalWeek > 0 ? totalWeek.toLocaleString() : '—') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">7일 전체 조회</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#f59e0b">' + (totalToday > 0 ? '+'+totalToday : '—') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">오늘 조회</div>' +
      '</div>' +
    '</div>';

  // 14일 추이 미니 바 차트
  let chartHtml = '';
  if (chart.length > 0) {
    const maxRec = Math.max(...chart.map(r => r.recView||0), 1);
    const bars = chart.map(r => {
      const v   = r.recView || 0;
      const h   = Math.max(Math.round((v / maxRec) * 40), v > 0 ? 3 : 1);
      const dt  = r.date ? r.date.slice(5) : '';
      return '<div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:3px">' +
        '<div style="font-size:9px;color:#fbbf24;font-weight:700">' + (v > 0 ? v : '') + '</div>' +
        '<div style="width:100%;display:flex;align-items:flex-end;justify-content:center;height:40px">' +
          '<div style="width:70%;border-radius:3px 3px 0 0;background:' + (v > 0 ? 'linear-gradient(180deg,#fbbf24,#f59e0b)' : 'rgba(255,255,255,.06)') + ';height:' + h + 'px"></div>' +
        '</div>' +
        '<div style="font-size:8px;color:#475569">' + dt + '</div>' +
      '</div>';
    }).join('');
    chartHtml =
      '<div style="margin-bottom:12px;padding:10px 12px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.1);border-radius:12px">' +
        '<div style="font-size:10px;color:#92400e;font-weight:700;margin-bottom:8px">📈 추천탭 일별 조회 추이 (14일)</div>' +
        '<div style="display:flex;gap:2px;align-items:flex-end">' + bars + '</div>' +
      '</div>';
  }

  // 업체별 랭킹
  const list = recOn.filter(s => (s.weekRecView||0) > 0 || (s.todayRecView||0) > 0);
  const noData = recOn.filter(s => (s.weekRecView||0) === 0 && (s.todayRecView||0) === 0);
  let rankHtml = '';
  if (list.length > 0) {
    const sorted = [...list].sort((a,b) => ((b.weekRecView||0)+(b.todayRecView||0)) - ((a.weekRecView||0)+(a.todayRecView||0)));
    const maxW = sorted[0].weekRecView || 1;
    rankHtml = sorted.map((s,i) => {
      const w    = s.weekRecView  || 0;
      const t    = s.todayRecView || 0;
      const bar  = Math.min(Math.round((w / maxW) * 100), 100);
      const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'위';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<span style="font-size:12px;min-width:26px;text-align:center">' + medal + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:600;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + s.name + '</div>' +
          '<div style="height:3px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:5px">' +
            '<div style="height:3px;border-radius:2px;background:linear-gradient(90deg,#f59e0b,#fbbf24);width:' + bar + '%"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;min-width:80px">' +
          '<div style="font-size:13px;font-weight:700;color:#fbbf24">' + w.toLocaleString() + ' <span style="font-size:9px;color:#92400e">7일</span></div>' +
          (t > 0
            ? '<div style="font-size:10px;color:#f59e0b;font-weight:600">오늘 +' + t + '</div>'
            : '<div style="font-size:10px;color:#374151">오늘 —</div>') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 데이터 없는 추천 업체 (조회 0)
  let noDataHtml = '';
  if (noData.length > 0) {
    noDataHtml =
      '<div style="margin-top:8px;padding:8px 12px;background:rgba(255,255,255,.02);border-radius:8px">' +
        '<div style="font-size:10px;color:#475569;margin-bottom:4px">조회 0 (노출 중)</div>' +
        '<div style="font-size:11px;color:#64748b">' + noData.map(s=>s.name).join(' · ') + '</div>' +
      '</div>';
  }

  const body = list.length > 0
    ? '<div style="background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.15);border-radius:12px;padding:12px 16px">' + rankHtml + noDataHtml + '</div>'
    : '<div style="padding:16px;text-align:center;font-size:12px;color:#475569;background:rgba(251,191,36,.03);border:1px dashed rgba(251,191,36,.15);border-radius:12px">아직 추천탭 조회 데이터가 없습니다</div>';

  return header + chartHtml + body;
}

// ── 투자자 지표 섹션
function buildInvestMetrics(d, dv) {
  const list = shopData || [];

  // ① 전환율 (누적 view → feed클릭)
  const totalV = d.totalViews  || 0;
  const totalF = d.totalFeedSP || 0;
  const totalM = d.totalMapSP  || 0;
  const cvr    = totalV ? ((totalF / totalV) * 100) : 0;
  const cvrStr = cvr.toFixed(1) + '%';
  const cvrW   = Math.min(cvr * 5, 100).toFixed(1); // 게이지 (20%=풀)
  const cvrComment = cvr >= 5 ? '우수' : cvr >= 2 ? '보통' : '개선 필요';
  const cvrColor   = cvr >= 5 ? '#34d399' : cvr >= 2 ? '#f59e0b' : '#f87171';

  // ② 주간 성장률 (어제 기준 7일 전 대비)
  const chart = d.weekChart || [];
  const chartMap = {};
  chart.forEach(r => { chartMap[r.date] = r.views || 0; });
  const todayKST = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  // 최근 3일 합계 vs 그 이전 3일
  const recent3 = [-2,-1,0].map(i => {
    const dt = new Date(Date.now()+9*60*60*1000+i*86400000).toISOString().slice(0,10);
    return chartMap[dt] || 0;
  }).reduce((a,b)=>a+b,0);
  const prev3 = [-5,-4,-3].map(i => {
    const dt = new Date(Date.now()+9*60*60*1000+i*86400000).toISOString().slice(0,10);
    return chartMap[dt] || 0;
  }).reduce((a,b)=>a+b,0);
  const growthPct = prev3 > 0 ? (((recent3 - prev3) / prev3) * 100) : (recent3 > 0 ? 100 : 0);
  const growthStr = (growthPct >= 0 ? '+' : '') + growthPct.toFixed(0) + '%';
  const growthColor = growthPct >= 0 ? '#34d399' : '#f87171';
  const growthComment = growthPct >= 10 ? '성장 중 🚀' : growthPct >= 0 ? '유지 중 →' : '감소 중 ⚠️';

  // ③ DAU/MAU (방문자 기준)
  const dvRows = Array.isArray(dv) ? dv : [];
  const mau30  = dvRows.slice(0, 30).reduce((s, r) => s + (parseInt(r.visit_cnt)||0), 0);
  const dau    = dvRows[0] ? (parseInt(dvRows[0].visit_cnt)||0) : 0; // 어제(최근 완성일)
  const dauMau = mau30 > 0 ? ((dau / (mau30 / 30)) * 100).toFixed(0) : '—';
  const dauMauComment = mau30 > 0 ? '일평균 ' + Math.round(mau30/Math.min(dvRows.length,30)).toLocaleString() + '명' : '데이터 누적 중';

  // ④ 수익화 현황
  const paid    = list.filter(s => s.paymentStatus === 'paid').length;
  const free    = list.filter(s => s.paymentStatus === 'free').length;
  const total   = list.length;
  const payRate = total > 0 ? ((paid / total) * 100).toFixed(0) : 0;
  const payComment = paid > 0 ? paid + '개 결제 · ' + free + '개 무료' : '무료 ' + free + '개 · 미결제 ' + (total-free) + '개';

  // ── 렌더링
  const insightCards =
    '<div class="insight-grid">' +
      // 전환율
      '<div class="insight-card ic-cvr">' +
        '<div class="insight-icon">🎯</div>' +
        '<div class="insight-val">' + cvrStr + '</div>' +
        '<div class="insight-lbl">예약 전환율</div>' +
        '<div class="cvr-gauge"><div class="cvr-gauge-fill" style="width:' + cvrW + '%"></div></div>' +
        '<div class="insight-sub" style="margin-top:5px">view→피드클릭 <b style="color:' + cvrColor + '">' + cvrComment + '</b><br>' +
          '조회 ' + totalV.toLocaleString() + ' → 클릭 ' + totalF.toLocaleString() + '</div>' +
      '</div>' +
      // 성장률
      '<div class="insight-card ic-growth">' +
        '<div class="insight-icon">📈</div>' +
        '<div class="insight-val" style="color:' + growthColor + '">' + growthStr + '</div>' +
        '<div class="insight-lbl">주간 성장률</div>' +
        '<div class="insight-sub">최근 3일 vs 이전 3일<br>' +
          '<b>' + recent3.toLocaleString() + '</b> vs <b>' + prev3.toLocaleString() + '</b> 영상조회<br>' +
          '<b style="color:' + growthColor + '">' + growthComment + '</b></div>' +
      '</div>' +
      // DAU/MAU
      '<div class="insight-card ic-daumau">' +
        '<div class="insight-icon">🔁</div>' +
        '<div class="insight-val">' + dauMau + (mau30 > 0 ? '%' : '') + '</div>' +
        '<div class="insight-lbl">재방문 지수</div>' +
        '<div class="insight-sub">일방문 / 월평균 비율<br>' + dauMauComment + '<br>' +
          '<b style="color:var(--t3)">높을수록 습관성 앱</b></div>' +
      '</div>' +
      // 수익화
      '<div class="insight-card ic-pay">' +
        '<div class="insight-icon">💰</div>' +
        '<div class="insight-val">' + payRate + '%</div>' +
        '<div class="insight-lbl">유료 전환율</div>' +
        '<div class="insight-sub">전체 ' + total + '개 업체 중<br>' + payComment + '<br>' +
          (paid > 0 ? '<b style="color:#a78bfa">수익화 진행 중</b>' : '<b style="color:var(--t3)">수익화 준비 단계</b>') + '</div>' +
      '</div>' +
    '</div>';

  // ── 수익화 퍼널 (방문→조회→클릭 드롭오프)
  const maxFunnel = Math.max(mau30 || dau || 1, totalV || 1);
  const funnelVisit = mau30 || dau;
  const funnelView  = totalV;
  const funnelFeed  = totalF;
  const funnelMap   = totalM;
  const fw = (n) => Math.max((n / (maxFunnel || 1) * 100), n > 0 ? 2 : 0).toFixed(1);
  const drop1 = funnelVisit > 0 ? ((funnelView / funnelVisit)*100).toFixed(0) + '% 진입' : '—';
  const drop2 = funnelView  > 0 ? ((funnelFeed / funnelView)*100).toFixed(1) + '% 전환' : '—';

  const funnel =
    '<div class="section-title">🔽 사용자 퍼널</div>' +
    '<div class="funnel-bar">' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">방문자</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-visit" style="width:100%"></div></div>' +
        '<div class="funnel-num">' + (funnelVisit||0).toLocaleString() + '</div>' +
        '<div class="funnel-pct">100%</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">영상조회</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-view" style="width:' + fw(funnelView) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelView.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#f59e0b">' + drop1 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">피드클릭</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-feed" style="width:' + fw(funnelFeed) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelFeed.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#34d399">' + drop2 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">지도클릭</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-map" style="width:' + fw(funnelMap) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelMap.toLocaleString() + '</div>' +
        '<div class="funnel-pct">' + (funnelView > 0 ? ((funnelMap/funnelView)*100).toFixed(1)+'%' : '—') + '</div>' +
      '</div>' +
    '</div>';

  return '<div class="section-title">💡 핵심 지표</div>' + insightCards + funnel;
}

// ── 업체별 전환율 인사이트
function buildShopInsight() {
  const list = shopData || [];
  if (!list.length) return '';

  // 전환율 계산 (view→feed, 조회 50 이상만)
  const withCvr = list
    .filter(s => (s.views||0) >= 50)
    .map(s => ({
      ...s,
      cvr: s.views > 0 ? (s.feedSP / s.views * 100) : 0
    }))
    .sort((a, b) => b.cvr - a.cvr);

  if (!withCvr.length) return '';

  const top3  = withCvr.slice(0, 3);
  const bot3  = [...withCvr].sort((a,b) => a.cvr - b.cvr).slice(0, 3);

  const renderRow = (s, i, isAlert) => {
    const cvrN = s.cvr;
    const cls  = cvrN >= 5 ? 'hi' : cvrN >= 2 ? 'mid' : 'lo';
    return '<div class="si-card">' +
      '<div class="si-rank" style="color:' + (isAlert ? '#f87171' : '#34d399') + '">' + (isAlert ? '⚠' : '✓') + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="si-name">' + s.name + '</div>' +
        '<div class="si-cat">' + s.category + ' · 조회 ' + (s.views||0).toLocaleString() + '</div>' +
      '</div>' +
      '<div class="si-right">' +
        '<div class="si-cvr ' + cls + '">' + cvrN.toFixed(1) + '%</div>' +
        '<div class="si-sub">전환율</div>' +
      '</div>' +
    '</div>';
  };

  return '<div class="section-title">🔬 업체별 전환율</div>' +
    '<div style="display:flex;gap:6px;margin-bottom:8px">' +
      '<button class="rank-tab' + (_insightMode==='top'?' on':'') + '" data-m="top" onclick="switchInsight(this.dataset.m)">🏆 전환율 TOP</button>' +
      '<button class="rank-tab' + (_insightMode==='bot'?' on':'') + '" data-m="bot" onclick="switchInsight(this.dataset.m)">⚠️ 개선 필요</button>' +
    '</div>' +
    '<div class="shop-insight-list">' +
    (_insightMode === 'top' ? top3 : bot3).map((s,i) => renderRow(s, i, _insightMode==='bot')).join('') +
    '</div>';
}

// ── 14일 차트 빌드
function buildChart14(mode) {
  const today = new Date(Date.now()+9*60*60*1000);
  const days = [];
  for (let i=13;i>=0;i--) {
    const d = new Date(Date.now()+9*60*60*1000-i*86400000);
    days.push(d.toISOString().slice(0,10));
  }
  const todayStr = today.toISOString().slice(0,10);
  const chart = (_stats && _stats.weekChart) || [];
  const dv    = _dvRows;

  let counts, barClass, chartLabel;
  if (mode==='view') {
    const m={}; chart.forEach(r=>{m[r.date]=r.views||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-view'; chartLabel='👁 영상조회';
  } else if (mode==='feed') {
    const m={}; chart.forEach(r=>{m[r.date]=r.feedSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-feed'; chartLabel='📹 피드클릭';
  } else if (mode==='map') {
    const m={}; chart.forEach(r=>{m[r.date]=r.mapSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-map'; chartLabel='🗺️ 지도클릭';
  } else {
    const m={}; dv.forEach(r=>{m[r.visit_date]=parseInt(r.visit_cnt)||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-visit'; chartLabel='🙋 방문자';
  }

  const maxV = Math.max(...counts,1);
  const total = counts.reduce((a,b)=>a+b,0);
  const empty = counts.every(c=>c===0);

  const tabOn = {view:'on-v', feed:'on-f', map:'on-m', visit:'on-a'};

  const barsHtml = empty ? '<div class="chart-empty">데이터가 쌓이면 여기에 표시돼요</div>' :
    '<div class="chart-body">' +
    days.map((d,i)=>{
      const c=counts[i], h=Math.max(Math.round((c/maxV)*72),c>0?4:2);
      const isT=d===todayStr;
      return '<div class="bar-col">' +
        '<div class="bar-cnt">'+(c>0?c:'')+'</div>' +
        '<div class="bar-fill '+(isT?'bar-today':barClass)+'" style="height:'+h+'px"></div>' +
        '<div class="bar-date">'+(isT?'오늘':d.slice(5))+'</div>' +
      '</div>';
    }).join('') +
    '</div>';

  return '<div class="section-title">📈 14일 추이</div>' +
    '<div class="chart-card">' +
      '<div class="chart-header">' +
        '<span class="chart-title">' + chartLabel + ' · 14일 합계 ' +
          '<strong style="color:var(--t1)">' + total.toLocaleString() + '</strong></span>' +
        '<div class="chart-tabs">' +
          '<button class="ctab '+(mode==='visit'?tabOn.visit:'')+'" data-m="visit" onclick="switchChart(this.dataset.m)">방문</button>' +
          '<button class="ctab '+(mode==='view'?tabOn.view:'')+'" data-m="view" onclick="switchChart(this.dataset.m)">영상</button>' +
          '<button class="ctab '+(mode==='feed'?tabOn.feed:'')+'" data-m="feed" onclick="switchChart(this.dataset.m)">피드</button>' +
          '<button class="ctab '+(mode==='map'?tabOn.map:'')+'" data-m="map" onclick="switchChart(this.dataset.m)">지도</button>' +
        '</div>' +
      '</div>' +
      barsHtml +
      '<div class="chart-footer">' +
        '<span class="chart-legend">🟡 오늘</span>' +
        '<button class="reset-btn" onclick="confirmReset()">🗑 통계 초기화</button>' +
      '</div>' +
    '</div>';
}

function switchChart(m) { _chartMode=m; renderDashboard(); }
function switchInsight(m) { _insightMode=m; renderDashboard(); }

// ── 업체 랭킹 빌드
function buildRank(mode) {
  const list = shopData || [];
  if (!list.length) return '<div class="empty">등록된 업체가 없어요</div>';
  const fb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";

  // 정렬: 오늘 or 누적
  const sorted = [...list].sort((a,b) => {
    if (mode==='today') {
      const at=(a.todayViews||0)+(a.todayFeedSP||0)+(a.todayMapSP||0);
      const bt=(b.todayViews||0)+(b.todayFeedSP||0)+(b.todayMapSP||0);
      return bt-at;
    }
    return ((b.views||0)+(b.feedSP||0)+(b.mapSP||0)) - ((a.views||0)+(a.feedSP||0)+(a.mapSP||0));
  });

  const tabOn_today = mode==='today'?' on':'';
  const tabOn_total = mode==='total'?' on':'';

  const header =
    '<div class="section-title">🏆 업체별 성과</div>' +
    '<div class="rank-tabs">' +
      '<button class="rank-tab'+tabOn_today+'" data-m="today" onclick="switchRank(this.dataset.m)">오늘 성과</button>' +
      '<button class="rank-tab'+tabOn_total+'" data-m="total" onclick="switchRank(this.dataset.m)">누적 성과</button>' +
    '</div>';

  const items = sorted.map((s,i) => {
    const img = s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg' : fb);
    const hq  = img;
    const rc  = i===0?'rn1':i===1?'rn2':i===2?'rn3':'rnN';
    const vv  = mode==='today' ? (s.todayViews||0)  : (s.views||0);
    const fv  = mode==='today' ? (s.todayFeedSP||0) : (s.feedSP||0);
    const mv  = mode==='today' ? (s.todayMapSP||0)  : (s.mapSP||0);
    const tot = vv+fv+mv;
    const unit = mode==='today' ? '오늘' : '누적';
    return '<div class="rank-item">' +
      '<div class="rank-num '+rc+'">'+(i+1)+'</div>' +
      '<img class="rank-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
      '<div class="rank-info">' +
        '<div class="rank-name">'+s.name+'</div>' +
        '<div class="rank-cat">'+s.category+(s.district?' · '+s.district:'')+'</div>' +
        '<div class="rank-stats">' +
          '<span class="rank-stat rs-view">👁 '+vv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-feed">📹 '+fv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-map">🗺️ '+mv.toLocaleString()+'</span>' +
        '</div>' +
      '</div>' +
      '<div class="rank-total">'+tot.toLocaleString()+'<small>'+unit+' 합계</small></div>' +
    '</div>';
  }).join('');

  return header + items;
}

function switchRank(m) { _rankMode=m; renderDashboard(); }

async function confirmReset() {
  if (!confirm('통계를 초기화할까요? (방문자/영상조회/예약클릭 모두 리셋)')) return;
  const r = await fetch('/api/admin/reset-stats', {method:'POST'});
  if (r.ok) { toast('통계가 초기화됐어요'); loadAll(); }
  else toast('초기화 실패');
}

// ======================================================
// 업체 관리 탭
// ======================================================
function modeLabel(m) {
  if (m==='feed') return '<span class="sc-mode mode-feed">🎬 영상전용</span>';
  if (m==='map')  return '<span class="sc-mode mode-map">🗺️ 지도전용</span>';
  return '<span class="sc-mode mode-both">🎬🗺️ 영상+지도</span>';
}
function planBadge(s) {
  const plan = s.plan||'basic', st = s.paymentStatus||'unpaid';
  const pB = plan==='shoot'
    ? '<span class="badge b-plan-shoot">🎬 촬영플랜</span>'
    : '<span class="badge b-plan-basic">📍 기본플랜</span>';
  let sB = '';
  if (st==='paid')    sB='<span class="badge b-paid">✅ 결제완료</span>';
  else if (st==='free') sB='<span class="badge b-free">🎁 무료기간</span>';
  else if (st==='expired') sB='<span class="badge b-expired">⚠️ 만료</span>';
  else sB='<span class="badge b-unpaid">💳 미결제</span>';
  let exp='';
  if (s.paidUntil) {
    const d=new Date(s.paidUntil), diff=Math.ceil((d-new Date())/86400000);
    const ds=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'});
    exp = diff>0
      ? '<span class="badge" style="background:rgba(255,255,255,.06);color:var(--t3)">📆 '+ds+' ('+diff+'일)</span>'
      : '<span class="badge b-expired">📆 만료 ('+Math.abs(diff)+'일 경과)</span>';
  }
  return pB+sB+exp;
}

function renderShops(list) {
  const p = document.getElementById('panel-shops');
  if (!list.length) { p.innerHTML='<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fb="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";
  const thumb   = s => s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
  const thumbHq = thumb;
  p.innerHTML = '<div class="section-title">🏪 업체 목록 <span style="font-weight:500;font-size:10px">'+list.length+'개</span></div>' +
  list.map(s => {
    const totToday=(s.todayViews||0)+(s.todayFeedSP||0)+(s.todayMapSP||0);
    return '<div class="shop-card" id="card-'+s.id+'">' +
      '<div class="sc-top">' +
        '<img class="sc-thumb" src="'+thumb(s)+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+thumbHq(s)+'" data-fb="'+fb+'"/>' +
        '<div class="sc-info">' +
          '<div class="sc-name">'+s.name+
            (s.featured?'<span class="badge b-feat">추천</span>':'')+
            (!s.active?'<span class="badge b-hide">비공개</span>':'') +
          '</div>' +
          '<div class="sc-cat">'+s.category+'</div>' +
          '<div class="sc-addr">'+( s.address||'')+'</div>' +
          modeLabel(s.displayMode||'both') +
        '</div>' +
      '</div>' +
      '<div class="sc-mid">'+planBadge(s)+
        (s.paymentMemo?'<span class="badge" style="background:rgba(255,255,255,.05);color:var(--t3);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+s.paymentMemo+'">📝 '+s.paymentMemo+'</span>':'')+
      '</div>' +
      '<div class="sc-nums">' +
        // ── 주요 지표: 피드클릭 + 지도클릭 (크게)
        '<div class="sc-click-row">' +
          '<div class="sc-num main c-feed">' +
            '<div class="sn-v">📅 '+(s.feedSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">피드 예약클릭</div>' +
          '</div>' +
          '<div class="sc-num main c-map">' +
            '<div class="sn-v">📍 '+(s.mapSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">지도 예약클릭</div>' +
          '</div>' +
        '</div>' +
        // ── 총 클릭 + 보조: 영상조회 합계
        '<div class="sc-total-click">' +
          '<div><div class="stc-lbl">총 예약클릭</div><div class="stc-val">'+((s.feedSP||0)+(s.mapSP||0)).toLocaleString()+'</div></div>' +
          '<div style="text-align:right"><div class="stc-lbl">👁 영상조회</div><div class="sn-v sub">'+(s.views||0).toLocaleString()+'</div></div>' +
        '</div>' +
        // ── 출처별 영상조회 분석 (오늘)
        ((s.todayFeedView||0)+(s.todayCatalogView||0)+(s.todayMapView||0) > 0
          ? '<div class="sc-view-src">' +
              '<div class="vsrc-title">오늘 영상조회 출처</div>' +
              '<div class="vsrc-row">' +
                '<span class="vsrc-chip vsrc-feed">📜 피드 '+(s.todayFeedView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-cat">📂 카탈로그 '+(s.todayCatalogView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-map">🗺 지도 '+(s.todayMapView||0)+'</span>' +
              '</div>' +
            '</div>'
          : '') +
        // ── 출처별 전환율 (영상→예약, 오늘)
        (function(){
          const vF=s.todayFeedView||0, vC=s.todayCatalogView||0, vM=s.todayMapView||0;
          const tF=s.todayVtsFeed||0,  tC=s.todayVtsCatalog||0,  tM=s.todayVtsMap||0;
          if (tF+tC+tM === 0) return '';
          const cvr = (v,t) => v>0 ? Math.round(t/v*100)+'%' : '—';
          const bar = (pct,col) => {
            const n = parseInt(pct)||0;
            return '<div style="height:4px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:3px">'
              +'<div style="height:4px;border-radius:2px;background:'+col+';width:'+Math.min(n,100)+'%"></div></div>';
          };
          return '<div class="sc-cvr-wrap">'
            +'<div class="sc-cvr-title">오늘 영상→예약 전환율</div>'
            +'<div class="sc-cvr-row">'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">📜 피드</div>'
                +'<div class="sc-cvr-val" style="color:#10b981">'+cvr(vF,tF)+'</div>'
                +'<div class="sc-cvr-sub">'+tF+'/'+vF+'명'+'</div>'
                +bar(parseInt(cvr(vF,tF)),'#10b981')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">📂 카탈로그</div>'
                +'<div class="sc-cvr-val" style="color:#f59e0b">'+cvr(vC,tC)+'</div>'
                +'<div class="sc-cvr-sub">'+tC+'/'+vC+'명'+'</div>'
                +bar(parseInt(cvr(vC,tC)),'#f59e0b')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">🗺 지도</div>'
                +'<div class="sc-cvr-val" style="color:#818cf8">'+cvr(vM,tM)+'</div>'
                +'<div class="sc-cvr-sub">'+tM+'/'+vM+'명'+'</div>'
                +bar(parseInt(cvr(vM,tM)),'#818cf8')
              +'</div>'
            +'</div>'
          +'</div>';
        }()) +
      '</div>' +
      (totToday>0?'<div style="margin-top:6px;padding:6px 10px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:8px;font-size:10px;color:#f59e0b;font-weight:700">' +
        '오늘 📅'+(s.todayFeedSP||0)+' 📍'+(s.todayMapSP||0)+' <span style="color:#64748b;font-weight:500">👁'+(s.todayViews||0)+'</span></div>':'') +
      // ── 추천탭 어필 배너
      (function(){
        const totalViews = s.views || 0;
        const totalClicks = (s.feedSP||0) + (s.mapSP||0);
        const weekRec = s.weekRecView || 0;
        const todayRec = s.todayRecView || 0;

        if (s.isRecommended) {
          // ─ 추천중: 7일/오늘 rec_view만 표시
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px solid rgba(251,191,36,.3)">' +
            '<div style="background:linear-gradient(90deg,rgba(251,191,36,.15),rgba(251,191,36,.05));padding:7px 12px;display:flex;align-items:center;justify-content:space-between">' +
              '<span style="font-size:11px;font-weight:700;color:#fbbf24">⭐ 추천탭 노출 중</span>' +
              '<span style="font-size:10px;color:#92400e;background:rgba(251,191,36,.2);padding:1px 7px;border-radius:20px">ON</span>' +
            '</div>' +
            '<div style="padding:8px 12px;background:rgba(251,191,36,.04);display:grid;grid-template-columns:repeat(2,1fr);gap:4px;text-align:center">' +
              '<div><div style="font-size:17px;font-weight:800;color:#fbbf24">'+(weekRec>0?weekRec.toLocaleString():'—')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">7일 조회</div></div>' +
              '<div><div style="font-size:17px;font-weight:800;color:#f59e0b">'+(todayRec>0?'+'+todayRec:'—')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">오늘 조회</div></div>' +
            '</div>' +
          '</div>';
        } else {
          // ─ 미추천: 잠재 성과로 어필
          const potentialMsg = totalViews >= 500
            ? '영상 조회 '+totalViews.toLocaleString()+'회 — 추천탭 추가 시 상단 노출 가능'
            : totalClicks > 0
            ? '예약클릭 '+totalClicks+'회 실적 — 추천탭으로 더 많은 고객 유입 가능'
            : '추천탭 노출 시 잠재 고객에게 바로 보입니다';
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px dashed rgba(251,191,36,.2)">' +
            '<div style="background:rgba(251,191,36,.03);padding:8px 12px;display:flex;align-items:flex-start;gap:8px">' +
              '<span style="font-size:14px;flex-shrink:0;margin-top:1px">☆</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:11px;font-weight:700;color:#92400e;margin-bottom:2px">추천탭 미노출</div>' +
                '<div style="font-size:10px;color:#64748b;line-height:1.4">'+potentialMsg+'</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }
      }()) +
      '<div class="sc-btns">' +
        '<button class="btn-edit" data-id="'+s.id+'" onclick="openModal(+this.dataset.id)"><i class="fas fa-edit"></i> 수정</button>' +
        '<button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-credit-card"></i> 결제</button>' +
        '<button class="btn-report" data-id="'+s.id+'" onclick="copyReportLink(+this.dataset.id,this)"><i class="fas fa-chart-line"></i> 리포트</button>' +
        '<button class="btn-rec '+(s.isRecommended?'btn-rec-on':'')+'" data-id="'+s.id+'" data-rec="'+(s.isRecommended?'1':'0')+'" onclick="toggleRec(+this.dataset.id,+this.dataset.rec===1,this)">'+
          (s.isRecommended ? '⭐ 추천중' : '☆ 추천') +
        '</button>' +
        '<button class="btn-del" data-id="'+s.id+'" data-name="'+s.name.replace(/"/g,'&quot;')+'" onclick="delShop(+this.dataset.id,this.dataset.name)"><i class="fas fa-trash"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ======================================================
// 구독관리 탭
// ======================================================
let payFilter='all';
function renderPayTab(filter) {
  if (filter!==undefined) payFilter=filter;
  const p = document.getElementById('panel-pay');
  const list = shopData;
  if (!list.length) { p.innerHTML='<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fb="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";

  const paid=list.filter(s=>s.paymentStatus==='paid').length;
  const free=list.filter(s=>s.paymentStatus==='free').length;
  const unpaid=list.filter(s=>s.paymentStatus==='unpaid').length;
  const expired=list.filter(s=>s.paymentStatus==='expired').length;
  const soon=list.filter(s=>{
    if(!s.paidUntil)return false;
    const d=Math.ceil((new Date(s.paidUntil)-new Date())/86400000);
    return d>=0&&d<=30;
  }).length;

  let filtered=list;
  if (payFilter==='paid')    filtered=list.filter(s=>s.paymentStatus==='paid');
  else if(payFilter==='free')    filtered=list.filter(s=>s.paymentStatus==='free');
  else if(payFilter==='unpaid')  filtered=list.filter(s=>s.paymentStatus==='unpaid');
  else if(payFilter==='expired') filtered=list.filter(s=>s.paymentStatus==='expired');
  else if(payFilter==='soon')    filtered=list.filter(s=>{
    if(!s.paidUntil)return false;
    const d=Math.ceil((new Date(s.paidUntil)-new Date())/86400000);
    return d>=0&&d<=30;
  });

  filtered=[...filtered].sort((a,b)=>{
    const o={expired:0,unpaid:1,free:2,paid:3};
    const ao=o[a.paymentStatus]??9, bo=o[b.paymentStatus]??9;
    if(ao!==bo)return ao-bo;
    if(a.paidUntil&&b.paidUntil)return new Date(a.paidUntil)-new Date(b.paidUntil);
    return 0;
  });

  const fbtns=[
    {k:'all',l:'전체 '+list.length},
    {k:'paid',l:'✅ 결제 '+paid},
    {k:'free',l:'🎁 무료 '+free},
    {k:'unpaid',l:'💳 미결제 '+unpaid},
    {k:'expired',l:'⚠️ 만료 '+expired},
    {k:'soon',l:'🔔 임박 '+soon},
  ].map(b=>'<button class="pf-btn'+(payFilter===b.k?' on':'')+'" data-k="'+b.k+'" onclick="renderPayTab(this.dataset.k)">'+b.l+'</button>').join('');

  const stMap={paid:'✅ 결제완료',free:'🎁 무료기간',unpaid:'💳 미결제',expired:'⚠️ 만료'};
  const stColor={paid:'var(--green)',free:'var(--blue)',unpaid:'#FFA500',expired:'var(--pink)'};

  const cards=filtered.map(s=>{
    const img=s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
    const hq=img;
    const plan=s.plan||'basic', st=s.paymentStatus||'unpaid';
    let expHtml='<strong>미설정</strong>';
    if(s.paidUntil){
      const d=new Date(s.paidUntil),diff=Math.ceil((d-new Date())/86400000);
      const ds=d.toLocaleDateString('ko-KR',{year:'2-digit',month:'2-digit',day:'2-digit'});
      if(diff>30) expHtml='<strong style="color:var(--green)">'+ds+'</strong>';
      else if(diff>0) expHtml='<strong style="color:#FFA500">'+ds+' ('+diff+'일 남음)</strong>';
      else expHtml='<strong style="color:var(--pink)">'+ds+' ('+Math.abs(diff)+'일 경과)</strong>';
    }
    return '<div class="pay-card status-'+st+'">' +
      '<div class="pay-top">' +
        '<img class="pay-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
        '<div class="pay-info">' +
          '<div class="pay-name">'+s.name+'</div>' +
          '<div class="pay-sub">'+s.category+' · '+(s.district||'')+'</div>' +
          '<div class="pay-badges">' +
            (plan==='shoot'?'<span class="badge b-plan-shoot">🎬 촬영플랜</span>':'<span class="badge b-plan-basic">📍 기본플랜</span>') +
            '<span class="badge" style="background:rgba(255,255,255,.06);color:'+( stColor[st]||'#fff')+'">'+( stMap[st]||st)+'</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="pay-body">' +
        '<div class="pay-kv">📆 만료일'+expHtml+'</div>' +
        '<div class="pay-kv">📋 플랜<strong>'+(plan==='shoot'?'촬영 (3만+월1만)':'기본 (월1만)')+'</strong></div>' +
      '</div>' +
      (s.paymentMemo?'<div class="pay-memo"><i class="fas fa-sticky-note" style="color:var(--t4);flex-shrink:0;margin-top:1px"></i><span>'+s.paymentMemo+'</span></div>':'') +
      '<div class="pay-btns"><button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-edit"></i> 결제 정보 수정</button></div>' +
    '</div>';
  }).join('')||'<div class="empty">해당 항목이 없어요</div>';

  p.innerHTML =
    '<div class="section-title">💳 구독 현황</div>' +
    '<div class="pay-summary">' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--green)">'+paid+'</div><div class="pay-sv-l">✅ 결제완료</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--blue)">'+free+'</div><div class="pay-sv-l">🎁 무료기간</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:#FFA500">'+unpaid+'</div><div class="pay-sv-l">💳 미결제</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--pink)">'+expired+'</div><div class="pay-sv-l">⚠️ 만료</div></div>' +
    '</div>' +
    '<div class="pay-filter">'+fbtns+'</div>' +
    cards;
}

// ── 결제 모달
function openPayModal(id) {
  const s=shopData.find(x=>x.id===id); if(!s)return;
  payEditId=id;
  document.getElementById('pmShopName').textContent=s.name+' · '+(s.category||'');
  setPmPlan(s.plan||'basic'); setPmStatus(s.paymentStatus||'unpaid');
  document.getElementById('pm-until').value=s.paidUntil?s.paidUntil.slice(0,10):'';
  document.getElementById('pm-memo').value=s.paymentMemo||'';
  document.getElementById('payModalBg').classList.remove('hidden');
}
function closePayModal(){document.getElementById('payModalBg').classList.add('hidden');}

// 추천 탭 ON/OFF 토글
async function toggleRec(id, isOn, btn) {
  btn.disabled = true;
  const next = !isOn;
  try {
    await fetch('/api/admin/shops/'+id+'/recommended', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ isRecommended: next })
    });
    btn.dataset.rec = next ? '1' : '0';
    btn.className   = 'btn-rec' + (next ? ' btn-rec-on' : '');
    btn.textContent = next ? '⭐ 추천중' : '☆ 추천';
    showToast(next ? '⭐ 추천 탭에 추가됐어요!' : '추천 탭에서 제거됐어요');
  } catch(e) {
    showToast('오류가 발생했어요');
  }
  btn.disabled = false;
}

// 리포트 링크 복사
async function copyReportLink(id, btn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    const r = await fetch('/api/admin/shops/'+id+'/report-token', {method:'POST'});
    const d = await r.json();
    if (!d.token) throw new Error('no token');
    const link = location.origin + '/report/' + d.token;
    await navigator.clipboard.writeText(link);
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = 'rgba(52,211,153,.2)';
    btn.style.borderColor = 'rgba(52,211,153,.4)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
    }, 2000);
  } catch(e) {
    btn.innerHTML = orig;
    btn.disabled = false;
    toast('링크 복사 실패: ' + e.message);
  }
}
function setPmPlan(plan){
  pmPlan=plan;
  ['shoot','basic'].forEach(k=>{document.getElementById('pm-plan-'+k).className='pm-plan-opt'+(k===plan?' sel-'+k:'');});
}
function setPmStatus(st){
  pmStatus=st;
  ['paid','free','unpaid','expired'].forEach(k=>{document.getElementById('pm-st-'+k).className='pm-status-opt'+(k===st?' sel-'+k:'');});
}
function addMonths(n){
  const base=document.getElementById('pm-until').value?new Date(document.getElementById('pm-until').value):new Date();
  base.setMonth(base.getMonth()+n);
  document.getElementById('pm-until').value=base.toISOString().slice(0,10);
}
async function savePayment(){
  if(!payEditId)return;
  const body={plan:pmPlan,paymentStatus:pmStatus,paidUntil:document.getElementById('pm-until').value||null,paymentMemo:document.getElementById('pm-memo').value.trim()};
  const r=await fetch('/api/admin/shops/'+payEditId+'/payment',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.ok){closePayModal();await loadAll();if(curTab==='pay')renderPayTab();toast('결제 정보가 저장됐어요');}
  else alert('저장 실패: '+r.status);
}

// ======================================================
// 입점문의
// ======================================================
async function loadInquiries(){
  const p=document.getElementById('panel-inq');
  p.innerHTML='<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const rows=await(await fetch('/api/admin/inquiries')).json();
  if(!rows.length){p.innerHTML='<div class="empty">📭 접수된 입점문의가 없어요</div>';return;}
  p.innerHTML='<div class="section-title">📬 입점 문의</div>'+rows.map(r=>{
    const d=new Date(r.created_at);
    const dt=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'})+' '+d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    return '<div class="inq-card"><div class="inq-top"><span class="inq-name">'+(r.owner||r.name||'이름없음')+'</span>'+(r.category?'<span class="inq-badge">'+r.category+'</span>':'')+'<span class="inq-time">'+dt+'</span></div><div class="inq-row"><span class="inq-kv">🏪 샵명 <strong>'+(r.name||'-')+'</strong></span><span class="inq-kv">📍 지역 <strong>'+(r.area||'-')+'</strong></span><span class="inq-kv">📞 <strong>'+(r.phone||'-')+'</strong></span></div>'+(r.url?'<div class="inq-row"><span class="inq-kv">🔗 <strong style="color:var(--blue)">'+r.url+'</strong></span></div>':'')+(r.message?'<div class="inq-msg">💬 '+r.message+'</div>':'')+'</div>';
  }).join('');
}

// ======================================================
// 달력 탭
// ======================================================
let _calYear  = new Date().getFullYear();
let _calMonth = new Date().getMonth() + 1;
let _calData  = null;
let _calSel   = null; // 선택된 날짜

async function renderCalendar() {
  const p = document.getElementById('panel-cal');
  p.innerHTML = '<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const res = await fetch('/api/admin/calendar?year='+_calYear+'&month='+_calMonth);
  _calData = await res.json();
  _calSel  = null;
  drawCal();
}

async function calSelectDate(dateStr) {
  if (_calSel === dateStr) { _calSel = null; drawCal(); return; }
  _calSel = dateStr;
  drawCal();
  // 업체별 상세 로드
  const detailEl = document.getElementById('cal-detail');
  if (!detailEl) return;
  detailEl.innerHTML = '<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const res = await fetch('/api/admin/calendar?year='+_calYear+'&month='+_calMonth+'&date='+dateStr);
  const data = await res.json();
  renderCalDetail(dateStr, data.shopDetail || []);
}

function renderCalDetail(dateStr, shops) {
  const detailEl = document.getElementById('cal-detail');
  if (!detailEl) return;
  if (!shops.length) {
    detailEl.innerHTML = '<div class="empty" style="padding:24px;color:var(--t3);text-align:center">📭 해당 날짜에 기록된 데이터가 없어요</div>';
    return;
  }
  const fmt = function(n) { return (n||0).toLocaleString(); };
  const maxTotal = Math.max.apply(null, [1].concat(shops.map(function(s) { return (s.views||0)+(s.feedSP||0)+(s.mapSP||0); })));
  const mm = dateStr.slice(5,7)+'월', dd2 = dateStr.slice(8,10)+'일';

  let html = '<div style="background:#111;border:1px solid var(--border);border-radius:14px;overflow:hidden">'
    + '<div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    + '<div style="font-size:13px;font-weight:700;color:var(--t1)">📅 '+mm+' '+dd2+' 업체별 실적</div>'
    + '<div style="font-size:11px;color:var(--t3)">'+shops.length+'개 업체</div>'
    + '</div>';

  shops.forEach(function(s, i) {
    const total  = (s.views||0) + (s.feedSP||0) + (s.mapSP||0);
    const barPct = Math.round(total / maxTotal * 100);
    const rankColors = ['#fbbf24','#aaa','#cd7f32'];
    const rankEmoji  = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : '';
    const rankColor  = rankColors[i] || 'var(--t3)';
    const rankSize   = i < 3 ? '18' : '12';
    const rankLabel  = rankEmoji || String(i+1);
    const thumb = s.thumbnail
      ? '<img src="'+s.thumbnail+'" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex-shrink:0">'
      : '<div style="width:38px;height:38px;border-radius:9px;background:#222;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">💄</div>';
    const borderStyle = i === shops.length-1 ? 'border-bottom:none' : 'border-bottom:1px solid var(--border)';

    html += '<div style="padding:12px 14px;'+borderStyle+'">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
      +   '<span style="font-size:'+rankSize+'px;font-weight:700;color:'+rankColor+';min-width:24px;text-align:center">'+rankLabel+'</span>'
      +   thumb
      +   '<div style="flex:1;min-width:0">'
      +     '<div style="font-size:13px;font-weight:700;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s.name+'</div>'
      +     '<div style="font-size:11px;color:var(--t3)">'+(s.category||'')+'</div>'
      +   '</div>'
      +   '<div style="font-size:16px;font-weight:800;color:var(--t1)">'+fmt(total)+'</div>'
      + '</div>'
      + '<div style="display:flex;gap:5px;margin-bottom:7px;flex-wrap:wrap">'
      +   (s.views  ? '<span style="font-size:11px;background:rgba(100,149,237,.15);color:#9ab4f0;padding:3px 8px;border-radius:6px">👁 '+fmt(s.views)+'</span>' : '')
      +   (s.feedSP ? '<span style="font-size:11px;background:rgba(255,138,170,.15);color:#ff8aaa;padding:3px 8px;border-radius:6px">📹 '+fmt(s.feedSP)+'</span>' : '')
      +   (s.mapSP  ? '<span style="font-size:11px;background:rgba(93,224,160,.15);color:#5de0a0;padding:3px 8px;border-radius:6px">🗺️ '+fmt(s.mapSP)+'</span>' : '')
      + '</div>'
      + '<div style="height:4px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">'
      +   '<div style="height:100%;width:'+barPct+'%;background:linear-gradient(90deg,rgba(100,149,237,.8),rgba(255,77,125,.6));border-radius:3px;transition:width .4s ease"></div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';
  detailEl.innerHTML = html;
}

function drawCal() {
  var d    = _calData;
  var fmt  = function(n) { return (n||0).toLocaleString(); };
  var today = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  var mt   = d.monthTotal;

  var dayMap = {}, visitMap = {};
  d.daily.forEach(function(x) { dayMap[x.date] = x; visitMap[x.date] = x.visits||0; });

  var maxVisits = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.visits||0;})));
  var maxViews  = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.views||0;})));
  var maxFeed   = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.feedSP||0;})));
  var maxMap2   = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.mapSP||0;})));

  var firstDay     = new Date(_calYear, _calMonth-1, 1).getDay();
  var lastDate     = new Date(_calYear, _calMonth, 0).getDate();
  var prevLastDate = new Date(_calYear, _calMonth-1, 0).getDate();
  var DOW = ['일','월','화','수','목','금','토'];

  var totalVisits = mt.visits||0;
  var totalViews  = mt.views||0;
  var totalFeed   = mt.feedSP||0;
  var totalMap    = mt.mapSP||0;
  var totalAll    = totalViews + totalFeed + totalMap;

  var activeDays = d.daily.filter(function(x){return (x.views||0)+(x.feedSP||0)+(x.mapSP||0)+(x.visits||0)>0;}).length || 1;
  var avgVisits  = (totalVisits/activeDays).toFixed(1);
  var avgViews   = (totalViews/activeDays).toFixed(1);

  var html = '';

  // ① 월 네비게이션 헤더
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'
    + '<button onclick="calMove(-1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9664;</button>'
    + '<div style="text-align:center">'
    +   '<div style="font-size:20px;font-weight:800;color:var(--t1)">'+_calYear+'년 '+_calMonth+'월</div>'
    +   '<div style="font-size:11px;color:var(--t3);margin-top:3px">활성일 '+activeDays+'일 &middot; 일평균 방문 '+avgVisits+' &middot; 일평균 조회 '+avgViews+'</div>'
    + '</div>'
    + '<button onclick="calMove(1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9654;</button>'
    + '</div>';

  // ② 월 합계 통계 카드 (4개)
  var statCards = [
    { emoji:'🙋', label:'방문자',     val:totalVisits, color:'#fbbf24', bg:'rgba(251,191,36,.1)',   bdr:'rgba(251,191,36,.25)' },
    { emoji:'👁', label:'영상조회',val:totalViews,  color:'#6495ed', bg:'rgba(100,149,237,.1)', bdr:'rgba(100,149,237,.25)' },
    { emoji:'📹', label:'피드클릭',val:totalFeed,   color:'#ff8aaa', bg:'rgba(255,138,170,.1)', bdr:'rgba(255,138,170,.25)' },
    { emoji:'🗺️',label:'지도클릭',val:totalMap, color:'#5de0a0',bg:'rgba(93,224,160,.1)', bdr:'rgba(93,224,160,.25)' },
  ];

  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">';
  statCards.forEach(function(sc) {
    var pct = totalAll > 0 && sc.label !== '방문자'
      ? Math.round(sc.val / Math.max(1,totalAll) * 100) : 0;
    var barHtml = sc.label !== '방문자'
      ? '<div style="margin-top:6px;height:3px;background:rgba(255,255,255,.08);border-radius:2px"><div style="height:100%;width:'+pct+'%;background:'+sc.color+';border-radius:2px"></div></div>'
      : '';
    html += '<div style="background:'+sc.bg+';border:1px solid '+sc.bdr+';border-radius:14px;padding:12px 10px;text-align:center">'
      + '<div style="font-size:20px;margin-bottom:4px">'+sc.emoji+'</div>'
      + '<div style="font-size:18px;font-weight:800;color:'+sc.color+'">'+fmt(sc.val)+'</div>'
      + '<div style="font-size:10px;color:var(--t3);margin-top:2px">'+sc.label+'</div>'
      + barHtml
      + '</div>';
  });
  html += '</div>';

  // ③ 최근 14일 트렌드 막대
  var last14 = [];
  for (var ti = 13; ti >= 0; ti--) {
    var dt14 = new Date(Date.now()+9*3600*1000 - ti*86400*1000).toISOString().slice(0,10);
    var dd14 = dayMap[dt14];
    last14.push({ date:dt14, visits:visitMap[dt14]||0, views:dd14?(dd14.views||0):0 });
  }
  var maxBar14 = Math.max.apply(null,[1].concat(last14.map(function(x){return Math.max(x.visits,x.views);})));

  html += '<div style="background:#111;border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px">'
    + '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:10px">📈 최근 14일 트렌드</div>'
    + '<div style="display:flex;align-items:flex-end;gap:3px;height:52px">';
  last14.forEach(function(x14) {
    var hv14 = maxBar14 ? Math.round(x14.visits/maxBar14*48) : 0;
    var hw14 = maxBar14 ? Math.round(x14.views/maxBar14*48) : 0;
    var isT14 = x14.date===today;
    var dd14s = x14.date.slice(8,10);
    var todayLbl = isT14 ? '<div style="position:absolute;top:-14px;font-size:8px;color:var(--amber);font-weight:800;white-space:nowrap">오늘</div>' : '';
    var dtTip = x14.date+' 방문:'+x14.visits+' 조회:'+x14.views;
    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;position:relative" title="'+dtTip+'">'
      + '<div style="width:100%;display:flex;flex-direction:column;justify-content:flex-end;height:48px;gap:1px">'
      +   '<div style="height:'+hw14+'px;background:rgba(100,149,237,.7);border-radius:2px 2px 0 0;min-height:'+(hw14>0?2:0)+'px"></div>'
      +   '<div style="height:'+hv14+'px;background:rgba(251,191,36,.8);border-radius:2px 2px 0 0;min-height:'+(hv14>0?2:0)+'px"></div>'
      + '</div>'
      + '<div style="font-size:8px;color:'+(isT14?'var(--amber)':'var(--t4)')+';font-weight:'+(isT14?800:400)+';margin-top:2px">'+dd14s+'</div>'
      + todayLbl
      + '</div>';
  });
  html += '</div>'
    + '<div style="display:flex;gap:12px;margin-top:8px">'
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(251,191,36,.8);border-radius:1px"></span>방문자</span>'
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(100,149,237,.7);border-radius:1px"></span>영상조회</span>'
    + '</div>'
    + '</div>';

  // ④ 달력 히트맵 그리드
  html += '<div style="background:#111;border-radius:14px;overflow:hidden;border:1px solid var(--border);margin-bottom:12px">';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border)">';
  DOW.forEach(function(dw,i) {
    var c = i===0 ? '#ff6b6b' : i===6 ? '#6495ed' : 'var(--t3)';
    html += '<div style="text-align:center;padding:8px 0;font-size:11px;font-weight:700;color:'+c+'">'+dw+'</div>';
  });
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr)">';

  // 이전달 빈칸
  for (var pi = 0; pi < firstDay; pi++) {
    var pdd = prevLastDate - firstDay + pi + 1;
    html += '<div style="padding:6px 5px;min-height:64px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+pdd+'</div></div>';
  }

  // 이번달 날짜
  for (var day = 1; day <= lastDate; day++) {
    var col     = (firstDay + day - 1) % 7;
    var mo2     = String(_calMonth).padStart(2,'0');
    var da2     = String(day).padStart(2,'0');
    var dateStr = _calYear+'-'+mo2+'-'+da2;
    var dd      = dayMap[dateStr];
    var vis     = visitMap[dateStr]||0;
    var isToday = dateStr === today;
    var isSel   = dateStr === _calSel;
    var isSun   = col === 0;
    var isSat   = col === 6;
    var isLast  = col === 6 || day === lastDate;
    var isLastRow = day > lastDate - 7;

    var totalDay = vis + (dd ? (dd.views||0)+(dd.feedSP||0)+(dd.mapSP||0) : 0);
    var maxTotal = Math.max(1, maxVisits + maxViews + maxFeed + maxMap2);
    var intensity = Math.min(1, totalDay / maxTotal);
    var heatAlpha = totalDay > 0 ? (intensity * 0.5 + 0.08).toFixed(2) : '0';

    var cellBg = 'transparent';
    if (totalDay > 0)       cellBg = 'rgba(100,149,237,'+heatAlpha+')';
    if (isSel)              cellBg = 'rgba(255,77,125,.22)';
    if (isToday && !isSel)  cellBg = 'rgba(245,158,11,.15)';

    var borderR  = isLast    ? 'none' : '1px solid var(--border)';
    var borderB  = isLastRow ? 'none' : '1px solid var(--border)';
    var cursor   = totalDay > 0 ? 'pointer' : 'default';
    var numColor = isSel ? 'var(--pink)' : isToday ? '#fbbf24' : isSun ? '#ff6b6b' : isSat ? '#6495ed' : 'var(--t1)';
    var numWt    = (isToday||isSel) ? '800' : '600';
    var badge    = isToday ? '<span style="font-size:8px;background:#fbbf24;color:#000;padding:1px 3px;border-radius:3px;font-weight:800">T</span>' : '';

    html += '<div data-dt="'+dateStr+'" onclick="calSelectDate(this.dataset.dt)"'
      +' style="padding:6px 5px;min-height:64px;border-right:'+borderR+';border-bottom:'+borderB+';background:'+cellBg+';cursor:'+cursor+';transition:background .15s;position:relative">';
    html += '<div style="font-size:11px;font-weight:'+numWt+';color:'+numColor+';display:flex;align-items:center;gap:3px;margin-bottom:3px">'+day+badge+'</div>';

    if (totalDay > 0) {
      html += '<div style="display:flex;flex-direction:column;gap:2px">';
      if (vis)           html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">🙋</span><span style="font-size:9px;color:#fbbf24;font-weight:700">'+fmt(vis)+'</span></div>';
      if (dd && dd.views)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">👁</span><span style="font-size:9px;color:#9ab4f0;font-weight:700">'+fmt(dd.views)+'</span></div>';
      if (dd && dd.feedSP) html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">📹</span><span style="font-size:9px;color:#ff8aaa;font-weight:700">'+fmt(dd.feedSP)+'</span></div>';
      if (dd && dd.mapSP)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">🗺️</span><span style="font-size:9px;color:#5de0a0;font-weight:700">'+fmt(dd.mapSP)+'</span></div>';
      html += '</div>';
      var barPct2  = Math.max(2, Math.round(intensity * 100));
      var barColor = isSel ? 'var(--pink)' : isToday ? '#fbbf24' : 'rgba(100,149,237,.8)';
      html += '<div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.05)">'
        + '<div style="height:100%;width:'+barPct2+'%;background:'+barColor+';transition:width .3s"></div>'
        + '</div>';
    } else {
      html += '<div style="font-size:16px;color:var(--t4);margin-top:2px">&middot;</div>';
    }
    html += '</div>';
  }

  // 다음달 빈칸
  var remaining = (7 - (firstDay + lastDate) % 7) % 7;
  for (var ri = 1; ri <= remaining; ri++) {
    html += '<div style="padding:6px 5px;min-height:64px;border-bottom:none;opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+ri+'</div></div>';
  }
  html += '</div></div>';

  // ⑤ 범례
  var heatBars = [0.1,0.2,0.35,0.5,0.65,0.85].map(function(v){
    return '<div style="width:16px;height:10px;border-radius:2px;background:rgba(100,149,237,'+v+')"></div>';
  }).join('');
  html += '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:16px;padding:8px 10px;background:#111;border:1px solid var(--border);border-radius:10px">'
    + '<span style="font-size:10px;color:var(--t3);font-weight:600">히트맵:</span>'
    + '<div style="display:flex;gap:2px;align-items:center">'+heatBars+'</div>'
    + '<span style="font-size:10px;color:var(--t3)">낙음 &#8594; 높음</span>'
    + '<span style="margin-left:4px;font-size:10px;color:#fbbf24">&#9632; 오늘</span>'
    + '<span style="font-size:10px;color:var(--pink)">&#9632; 선택</span>'
    + '<div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">'
    +   '<span style="font-size:10px;color:#fbbf24">🙋방문자</span>'
    +   '<span style="font-size:10px;color:#9ab4f0">👁영상조회</span>'
    +   '<span style="font-size:10px;color:#ff8aaa">📹피드</span>'
    +   '<span style="font-size:10px;color:#5de0a0">🗺️지도</span>'
    + '</div>'
    + '</div>';

  // ⑥ 날짜 클릭 상세
  html += '<div id="cal-detail" style="margin-top:4px">'
    + '<div class="empty" style="padding:20px;color:var(--t3);text-align:center">📅 날짜를 클릭하면 업체별 상세 데이터가 표시됩니다</div>'
    + '</div>';

  var p = document.getElementById('panel-cal');
  p.innerHTML = '<div class="section" style="padding:16px">'+html+'</div>';

  if (_calSel && _calData) {
    var found = _calData.daily.find(function(x) { return x.date === _calSel; });
    if (!found) renderCalDetail(_calSel, []);
  }
}

// ======================================================
// 업체 추가/수정 모달
// ======================================================
function openModal(id) {
  editId=id||null;
  document.getElementById('modalTtl').textContent=id?'업체 수정':'업체 추가';
  if(id){
    const s=shopData.find(x=>x.id===id); if(!s)return;
    document.getElementById('f-name').value=s.name||'';
    document.getElementById('f-cat').value=s.category||'마사지';
    document.getElementById('f-price').value=s.priceRange||'';
    document.getElementById('f-thumb').value=s.thumbnail||'';
    document.getElementById('thumbPreview').src=s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg':'');
    document.getElementById('f-yt').value=s.youtubeId||'';
    document.getElementById('f-addr').value=s.address||'';
    document.getElementById('f-dist').value=s.district||'';
    document.getElementById('f-phone').value=s.phone||'';
    document.getElementById('f-lat').value=s.lat||'';
    document.getElementById('f-lng').value=s.lng||'';
    document.getElementById('f-url').value=s.smartPlaceUrl||'';
    document.getElementById('f-tags').value=(s.tags||[]).join(', ');
    document.getElementById('f-desc').value=s.description||'';
    document.getElementById('f-feat').value=String(s.featured||false);
    document.getElementById('f-active').value=String(s.active!==false);
    setRecToggle(s.isRecommended||false);
    setMode(s.displayMode||'both');
    thumbDataUrl='';
    previewYt(s.youtubeId||'');
  } else {
    ['f-name','f-price','f-thumb','f-yt','f-addr','f-dist','f-phone','f-tags','f-desc'].forEach(id=>{document.getElementById(id).value='';});
    document.getElementById('f-lat').value=''; document.getElementById('f-lng').value='';
    document.getElementById('f-cat').value='마사지';
    document.getElementById('f-feat').value='false'; document.getElementById('f-active').value='true';
    setRecToggle(false);
    document.getElementById('thumbPreview').src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23222%22/%3E%3Ctext x=%2230%22 y=%2238%22 font-size=%2224%22 text-anchor=%22middle%22%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E';
    setMode('both'); thumbDataUrl='';
    document.getElementById('ytPreview').style.display='none';
  }
  document.getElementById('modalBg').classList.remove('hidden');
}
function closeModal(){document.getElementById('modalBg').classList.add('hidden');}
function bgClick(e){if(e.target===document.getElementById('modalBg'))closeModal();}

function setRecToggle(on) {
  document.getElementById('f-rec').value = String(on);
  const track = document.getElementById('rec-toggle-track');
  const thumb = document.getElementById('rec-toggle-thumb');
  const label = document.getElementById('rec-toggle-label');
  const wrap  = document.getElementById('rec-toggle-wrap');
  if (on) {
    track.style.background = '#f59e0b';
    thumb.style.left = '23px';
    label.textContent = '⭐ 추천탭 노출 중';
    label.style.color = '#fbbf24';
    wrap.style.borderColor = 'rgba(251,191,36,.4)';
    wrap.style.background  = 'rgba(251,191,36,.07)';
  } else {
    track.style.background = '#374151';
    thumb.style.left = '3px';
    label.textContent = '추천탭 미노출';
    label.style.color = '#94a3b8';
    wrap.style.borderColor = 'rgba(255,255,255,.09)';
    wrap.style.background  = 'rgba(255,255,255,.04)';
  }
}
function toggleRecInModal() {
  const cur = document.getElementById('f-rec').value === 'true';
  setRecToggle(!cur);
}

function setMode(m){
  document.getElementById('f-mode').value=m;
  ['both','feed','map'].forEach(x=>{document.getElementById('mo-'+x).className='mode-opt'+(x===m?' sel-'+x:'');});
  const isMap=m==='map';
  ['ytField'].forEach(id=>{document.getElementById(id).style.display=isMap?'none':'block';});
  ['addrField','distRow','latRow'].forEach(id=>{document.getElementById(id).style.display='block';});
}

function handleThumbFile(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{thumbDataUrl=ev.target.result;document.getElementById('f-thumb').value='';document.getElementById('thumbPreview').src=thumbDataUrl;};
  reader.readAsDataURL(file);
}
function updateThumbPreview(v){if(v)document.getElementById('thumbPreview').src=v;}
function previewYt(v){
  const id=v?extractYtId(v):'';
  const el=document.getElementById('ytPreview');
  if(id){el.style.display='block';document.getElementById('ytFrame').src='https://www.youtube.com/embed/'+id+'?mute=1';}
  else el.style.display='none';
}







async function geocodeAddr(){
  const addr=document.getElementById('f-addr').value.trim();
  if(!addr)return;
  const btn=document.getElementById('geoBtn'), st=document.getElementById('geoStatus');
  btn.disabled=true; btn.textContent='검색중...';
  st.style.display='block'; st.style.color='rgba(255,255,255,.4)'; st.textContent='좌표를 검색하는 중...';
  try{
    const r=await fetch('/api/geocode?query='+encodeURIComponent(addr));
    const d=await r.json();
    if(d.lat&&d.lng){
      document.getElementById('f-lat').value=d.lat;
      document.getElementById('f-lng').value=d.lng;
      if(d.district)document.getElementById('f-dist').value=d.district;
      st.style.color='#03C75A'; st.textContent='좌표 확인: '+d.lat+', '+d.lng;
    } else { st.style.color='var(--pink)'; st.textContent='주소를 찾을 수 없어요'; }
  } catch { st.style.color='var(--pink)'; st.textContent='오류가 발생했어요'; }
  btn.disabled=false; btn.innerHTML='<i class="fas fa-crosshairs"></i> 좌표찾기';
}

async function saveShop(){
  const name=document.getElementById('f-name').value.trim();
  const addr=document.getElementById('f-addr').value.trim();
  const mode=document.getElementById('f-mode').value;
  if(!name){alert('업체명을 입력해주세요');return;}
  if((mode==='both'||mode==='map')&&!addr){alert('주소를 입력해주세요');return;}
  let thumbUrl=document.getElementById('f-thumb').value.trim();
  if(thumbDataUrl){
    try{
      const ur=await fetch('/api/admin/upload-thumbnail',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:thumbDataUrl})});
      const ud=await ur.json(); if(ud.url)thumbUrl=ud.url;
    }catch{}
  }
  const body={
    name,category:document.getElementById('f-cat').value,
    priceRange:document.getElementById('f-price').value.trim(),
    thumbnail:thumbUrl,youtubeId:extractYtId(document.getElementById('f-yt').value),
    address:addr,district:document.getElementById('f-dist').value.trim(),
    phone:document.getElementById('f-phone').value.trim(),
    lat:parseFloat(document.getElementById('f-lat').value)||null,
    lng:parseFloat(document.getElementById('f-lng').value)||null,
    smartPlaceUrl:document.getElementById('f-url').value.trim(),
    tags:document.getElementById('f-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
    description:document.getElementById('f-desc').value.trim(),
    featured:document.getElementById('f-feat').value==='true',
    active:document.getElementById('f-active').value==='true',
    displayMode:mode,
    isRecommended:document.getElementById('f-rec').value==='true',
  };
  const url=editId?'/api/admin/shops/'+editId:'/api/admin/shops';
  const method=editId?'PUT':'POST';
  const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.ok){
    const saved=await r.json();
    const savedId=saved.id||editId;
    // 추천탭 상태 별도 저장
    await fetch('/api/admin/shops/'+savedId+'/recommended',{
      method:'PUT',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({isRecommended:body.isRecommended})
    });
    closeModal();await loadAll();toast(editId?'업체가 수정됐어요':'업체가 추가됐어요');
  } else alert('저장 실패: '+r.status);
}

async function copyReportLink(id, btn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    const r = await fetch('/api/admin/shops/'+id+'/report-token', {method:'POST'});
    const data = await r.json();
    if (!data.token) throw new Error('no token');
    const link = location.origin + '/report/' + data.token;
    await navigator.clipboard.writeText(link);
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = 'rgba(52,211,153,.15)';
    btn.style.borderColor = 'rgba(52,211,153,.3)';
    btn.style.color = '#34d399';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 2000);
  } catch(e) {
    btn.innerHTML = orig;
    btn.disabled = false;
    alert('링크 생성 실패: ' + e.message);
  }
}

async function delShop(id,name){
  if(!confirm('['+name+'] 업체를 삭제할까요?'))return;
  const r=await fetch('/api/admin/shops/'+id,{method:'DELETE'});
  if(r.ok)loadAll(); else alert('삭제 실패');
}

/* 시작 */
loadAll();
setInterval(loadAll, 30000);
<\/script>
</body>
</html>`}var po=(e,t=ho)=>{const s=/\.([a-zA-Z0-9]+?)$/,r=e.match(s);if(!r)return;let i=t[r[1].toLowerCase()];return i&&i.startsWith("text")&&(i+="; charset=utf-8"),i},uo={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},ho=uo,fo=/^\s*(?:text\/[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Us={br:".br",zstd:".zst",gzip:".gz"},mo=Object.keys(Us),go=()=>{const[e,t]=aa.node.split(".").map(s=>parseInt(s));return e>=23||e===22&&t>=7||e===20&&t>=18},bo=go(),Sr=e=>bo?Ds.toWeb(e):new ReadableStream({start(s){e.on("data",r=>{s.enqueue(r)}),e.on("error",r=>{s.error(r)}),e.on("end",()=>{s.close()})},cancel(){e.destroy()}}),Os=e=>{let t;try{t=ra(e)}catch{}return t},vo=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},yo=e=>vo(e,decodeURI),st=(e={root:""})=>{const t=e.root||"",s=e.path;return t!==""&&!sa(t)&&console.error(`serveStatic: root path '${t}' is not found, are you sure it's correct?`),async(r,i)=>{var b,x,d,u;if(r.finalized)return i();let a;if(s)a=s;else try{if(a=yo(r.req.path),/(?:^|[\/\\])\.{1,2}(?:$|[\/\\])|[\/\\]{2,}/.test(a))throw new Error}catch{return await((b=e.onNotFound)==null?void 0:b.call(e,r.req.path,r)),i()}let l=pr(t,!s&&e.rewriteRequestPath?e.rewriteRequestPath(a,r):a),o=Os(l);if(o&&o.isDirectory()){const v=e.index??"index.html";l=pr(l,v),o=Os(l)}if(!o)return await((x=e.onNotFound)==null?void 0:x.call(e,l,r)),i();const p=po(l);if(r.header("Content-Type",p||"application/octet-stream"),e.precompressed&&(!p||fo.test(p))){const v=new Set((d=r.req.header("Accept-Encoding"))==null?void 0:d.split(",").map(w=>w.trim()));for(const w of mo){if(!v.has(w))continue;const E=Os(l+Us[w]);if(E){r.header("Content-Encoding",w),r.header("Vary","Accept-Encoding",{append:!0}),o=E,l=l+Us[w];break}}}let h;const f=o.size,y=r.req.header("range")||"";if(r.req.method=="HEAD"||r.req.method=="OPTIONS")r.header("Content-Length",f.toString()),r.status(200),h=r.body(null);else if(!y)r.header("Content-Length",f.toString()),h=r.body(Sr(cr(l)),200);else{r.header("Accept-Ranges","bytes"),r.header("Date",o.birthtime.toUTCString());const v=y.replace(/bytes=/,"").split("-",2),w=parseInt(v[0],10)||0;let E=parseInt(v[1],10)||f-1;f<E-w+1&&(E=f-1);const _=E-w+1,O=cr(l,{start:w,end:E});r.header("Content-Length",_.toString()),r.header("Content-Range",`bytes ${w}-${E}/${o.size}`),h=r.body(Sr(O),206)}return await((u=e.onFound)==null?void 0:u.call(e,l,r)),h}},We=class extends Error{constructor(e,t){super(e,t),this.name="RequestError"}},xo=e=>e instanceof We?e:new We(e.message,{cause:e}),wo=global.Request,Pt=class extends wo{constructor(t,s){var r;typeof t=="object"&&yt in t&&(t=t[yt]()),typeof((r=s==null?void 0:s.body)==null?void 0:r.getReader)<"u"&&(s.duplex??(s.duplex="half")),super(t,s)}},Eo=e=>{const t=[],s=e.rawHeaders;for(let r=0;r<s.length;r+=2){const{[r]:i,[r+1]:a}=s;i.charCodeAt(0)!==58&&t.push([i,a])}return new Headers(t)},Vi=Symbol("wrapBodyStream"),_o=(e,t,s,r,i)=>{const a={method:e,headers:s,signal:i.signal};if(e==="TRACE"){a.method="GET";const l=new Pt(t,a);return Object.defineProperty(l,"method",{get(){return"TRACE"}}),l}if(!(e==="GET"||e==="HEAD"))if("rawBody"in r&&r.rawBody instanceof Buffer)a.body=new ReadableStream({start(l){l.enqueue(r.rawBody),l.close()}});else if(r[Vi]){let l;a.body=new ReadableStream({async pull(o){try{l||(l=Ds.toWeb(r).getReader());const{done:p,value:h}=await l.read();p?o.close():o.enqueue(h)}catch(p){o.error(p)}}})}else a.body=Ds.toWeb(r);return new Pt(t,a)},yt=Symbol("getRequestCache"),ns=Symbol("requestCache"),os=Symbol("incomingKey"),ds=Symbol("urlKey"),Rs=Symbol("headersKey"),Ne=Symbol("abortControllerKey"),So=Symbol("getAbortController"),Gt={get method(){return this[os].method||"GET"},get url(){return this[ds]},get headers(){return this[Rs]||(this[Rs]=Eo(this[os]))},[So](){return this[yt](),this[Ne]},[yt](){return this[Ne]||(this[Ne]=new AbortController),this[ns]||(this[ns]=_o(this.method,this[ds],this.headers,this[os],this[Ne]))}};["body","bodyUsed","cache","credentials","destination","integrity","mode","redirect","referrer","referrerPolicy","signal","keepalive"].forEach(e=>{Object.defineProperty(Gt,e,{get(){return this[yt]()[e]}})});["arrayBuffer","blob","clone","formData","json","text"].forEach(e=>{Object.defineProperty(Gt,e,{value:function(){return this[yt]()[e]()}})});Object.defineProperty(Gt,Symbol.for("nodejs.util.inspect.custom"),{value:function(e,t,s){const r={method:this.method,url:this.url,headers:this.headers,nativeRequest:this[ns]};return`Request (lightweight) ${s(r,{...t,depth:e==null?null:e-1})}`}});Object.setPrototypeOf(Gt,Pt.prototype);var ko=(e,t)=>{const s=Object.create(Gt);s[os]=e;const r=e.url||"";if(r[0]!=="/"&&(r.startsWith("http://")||r.startsWith("https://"))){if(e instanceof Ot)throw new We("Absolute URL for :path is not allowed in HTTP/2");try{const o=new URL(r);s[ds]=o.href}catch(o){throw new We("Invalid absolute URL",{cause:o})}return s}const i=(e instanceof Ot?e.authority:e.headers.host)||t;if(!i)throw new We("Missing host header");let a;if(e instanceof Ot){if(a=e.scheme,!(a==="http"||a==="https"))throw new We("Unsupported scheme")}else a=e.socket&&e.socket.encrypted?"https":"http";const l=new URL(`${a}://${i}${r}`);if(l.hostname.length!==i.length&&l.hostname!==i.replace(/:\d+$/,""))throw new We("Invalid host header");return s[ds]=l.href,s},At=Symbol("responseCache"),ct=Symbol("getResponseCache"),Ge=Symbol("cache"),tr=global.Response,qt,Me,vt,Et=(vt=class{constructor(t,s){J(this,qt);J(this,Me);let r;if(W(this,qt,t),s instanceof vt){const i=s[At];if(i){W(this,Me,i),this[ct]();return}else W(this,Me,M(s,Me)),r=new Headers(M(s,Me).headers)}else W(this,Me,s);(typeof t=="string"||typeof(t==null?void 0:t.getReader)<"u"||t instanceof Blob||t instanceof Uint8Array)&&(this[Ge]=[(s==null?void 0:s.status)||200,t,r||(s==null?void 0:s.headers)])}[ct](){return delete this[Ge],this[At]||(this[At]=new tr(M(this,qt),M(this,Me)))}get headers(){const t=this[Ge];return t?(t[2]instanceof Headers||(t[2]=new Headers(t[2]||{"content-type":"text/plain; charset=UTF-8"})),t[2]):this[ct]().headers}get status(){var t;return((t=this[Ge])==null?void 0:t[0])??this[ct]().status}get ok(){const t=this.status;return t>=200&&t<300}},qt=new WeakMap,Me=new WeakMap,vt);["body","bodyUsed","redirected","statusText","trailers","type","url"].forEach(e=>{Object.defineProperty(Et.prototype,e,{get(){return this[ct]()[e]}})});["arrayBuffer","blob","clone","formData","json","text"].forEach(e=>{Object.defineProperty(Et.prototype,e,{value:function(){return this[ct]()[e]()}})});Object.defineProperty(Et.prototype,Symbol.for("nodejs.util.inspect.custom"),{value:function(e,t,s){const r={status:this.status,headers:this.headers,ok:this.ok,nativeResponse:this[At]};return`Response (lightweight) ${s(r,{...t,depth:e==null?null:e-1})}`}});Object.setPrototypeOf(Et,tr);Object.setPrototypeOf(Et.prototype,tr.prototype);async function To(e){return Promise.race([e,Promise.resolve().then(()=>Promise.resolve(void 0))])}function Wi(e,t,s){const r=o=>{e.cancel(o).catch(()=>{})};return t.on("close",r),t.on("error",r),(s??e.read()).then(l,i),e.closed.finally(()=>{t.off("close",r),t.off("error",r)});function i(o){o&&t.destroy(o)}function a(){e.read().then(l,i)}function l({done:o,value:p}){try{if(o)t.end();else if(!t.write(p))t.once("drain",a);else return e.read().then(l,i)}catch(h){i(h)}}}function Co(e,t){if(e.locked)throw new TypeError("ReadableStream is locked.");return t.destroyed?void 0:Wi(e.getReader(),t)}var zs=e=>{const t={};e instanceof Headers||(e=new Headers(e??void 0));const s=[];for(const[r,i]of e)r==="set-cookie"?s.push(i):t[r]=i;return s.length>0&&(t["set-cookie"]=s),t["content-type"]??(t["content-type"]="text/plain; charset=UTF-8"),t},Io="x-hono-already-sent";typeof global.crypto>"u"&&(global.crypto=la);var sr=Symbol("outgoingEnded"),kr=Symbol("incomingDraining"),Lo=500,Ao=64*1024*1024,Ms=e=>{var o,p,h;const t=e;if(e.destroyed||t[kr])return;if(t[kr]=!0,e instanceof Ot){try{(p=(o=e.stream)==null?void 0:o.close)==null||p.call(o,oa.NGHTTP2_NO_ERROR)}catch{}return}let s=0;const r=()=>{clearTimeout(a),e.off("data",l),e.off("end",r),e.off("error",r)},i=()=>{r();const f=e.socket;f&&!f.destroyed&&f.destroySoon()},a=setTimeout(i,Lo);(h=a.unref)==null||h.call(a);const l=f=>{s+=f.length,s>Ao&&i()};e.on("data",l),e.on("end",r),e.on("error",r),e.resume()},Oo=()=>new Response(null,{status:400}),Gi=e=>new Response(null,{status:e instanceof Error&&(e.name==="TimeoutError"||e.constructor.name==="TimeoutError")?504:500}),$s=(e,t)=>{const s=e instanceof Error?e:new Error("unknown error",{cause:e});s.code==="ERR_STREAM_PREMATURE_CLOSE"?console.info("The user aborted a request."):(console.error(e),t.headersSent||t.writeHead(500,{"Content-Type":"text/plain"}),t.end(`Error: ${s.message}`),t.destroy(s))},Qi=e=>{"flushHeaders"in e&&e.writable&&e.flushHeaders()},Yi=async(e,t)=>{var l,o;let[s,r,i]=e[Ge],a=!1;if(!i)i={"content-type":"text/plain; charset=UTF-8"};else if(i instanceof Headers)a=i.has("content-length"),i=zs(i);else if(Array.isArray(i)){const p=new Headers(i);a=p.has("content-length"),i=zs(p)}else for(const p in i)if(p.length===14&&p.toLowerCase()==="content-length"){a=!0;break}a||(typeof r=="string"?i["Content-Length"]=Buffer.byteLength(r):r instanceof Uint8Array?i["Content-Length"]=r.byteLength:r instanceof Blob&&(i["Content-Length"]=r.size)),t.writeHead(s,i),typeof r=="string"||r instanceof Uint8Array?t.end(r):r instanceof Blob?t.end(new Uint8Array(await r.arrayBuffer())):(Qi(t),await((l=Co(r,t))==null?void 0:l.catch(p=>$s(p,t)))),(o=t[sr])==null||o.call(t)},Ro=e=>typeof e.then=="function",Mo=async(e,t,s={})=>{var i;if(Ro(e))if(s.errorHandler)try{e=await e}catch(a){const l=await s.errorHandler(a);if(!l)return;e=l}else e=await e.catch(Gi);if(Ge in e)return Yi(e,t);const r=zs(e.headers);if(e.body){const a=e.body.getReader(),l=[];let o=!1,p;if(r["transfer-encoding"]!=="chunked"){let h=2;for(let f=0;f<h;f++){p||(p=a.read());const y=await To(p).catch(b=>{console.error(b),o=!0});if(!y){if(f===1){await new Promise(b=>setTimeout(b)),h=3;continue}break}if(p=void 0,y.value&&l.push(y.value),y.done){o=!0;break}}o&&!("content-length"in r)&&(r["content-length"]=l.reduce((f,y)=>f+y.length,0))}t.writeHead(e.status,r),l.forEach(h=>{t.write(h)}),o?t.end():(l.length===0&&Qi(t),await Wi(a,t,p))}else r[Io]||(t.writeHead(e.status,r),t.end());(i=t[sr])==null||i.call(t)},Do=(e,t={})=>{const s=t.autoCleanupIncoming??!0;return t.overrideGlobalObjects!==!1&&global.Request!==Pt&&(Object.defineProperty(global,"Request",{value:Pt}),Object.defineProperty(global,"Response",{value:Et})),async(r,i)=>{let a,l;try{l=ko(r,t.hostname);let o=!s||r.method==="GET"||r.method==="HEAD";if(o||(r[Vi]=!0,r.on("end",()=>{o=!0}),r instanceof Ot&&(i[sr]=()=>{o||setTimeout(()=>{o||setTimeout(()=>{Ms(r)})})}),i.on("finish",()=>{o||Ms(r)})),i.on("close",()=>{l[Ne]&&(r.errored?l[Ne].abort(r.errored.toString()):i.writableFinished||l[Ne].abort("Client connection prematurely closed.")),o||setTimeout(()=>{o||setTimeout(()=>{Ms(r)})})}),a=e(l,{incoming:r,outgoing:i}),Ge in a)return Yi(a,i)}catch(o){if(a)return $s(o,i);if(t.errorHandler){if(a=await t.errorHandler(l?o:xo(o)),!a)return}else l?a=Gi(o):a=Oo()}try{return await Mo(a,i,t)}catch(o){return $s(o,i)}}},No=e=>{const t=e.fetch,s=Do(t,{hostname:e.hostname,overrideGlobalObjects:e.overrideGlobalObjects,autoCleanupIncoming:e.autoCleanupIncoming});return(e.createServer||na)(e.serverOptions||{},s)},Po=(e,t)=>{const s=No(e);return s.listen(e==null?void 0:e.port,e.hostname,()=>{s.address()}),s};const Te=new Gr;Te.use("/favicon.svg",st({root:"./"}));Te.use("/og-image.jpg",st({root:"./"}));Te.use("/static/*",st({root:"./"}));Te.use("/.gitignore",st({root:"./"}));Te.use("/.vercel/*",st({root:"./"}));Te.use("/_routes.json",st({root:"./"}));Te.use("/_worker.js",st({root:"./"}));const Bo=Object.assign({"/src/index.tsx":j});let Xi=!1;for(const[,e]of Object.entries(Bo))e&&(Te.all("*",t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),Te.notFound(t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),Xi=!0);if(!Xi)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");Po({fetch:Te.fetch,port:3e3});export{Te as default};
