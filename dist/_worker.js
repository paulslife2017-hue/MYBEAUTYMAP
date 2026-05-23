var vr=Object.defineProperty;var Ns=e=>{throw TypeError(e)};var yr=(e,t,s)=>t in e?vr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var X=(e,t,s)=>yr(e,typeof t!="symbol"?t+"":t,s),ls=(e,t,s)=>t.has(e)||Ns("Cannot "+s);var N=(e,t,s)=>(ls(e,t,"read from private field"),s?s.call(e):t.get(e)),ee=(e,t,s)=>t.has(e)?Ns("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),G=(e,t,s,r)=>(ls(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),se=(e,t,s)=>(ls(e,t,"access private method"),s);var Bs=(e,t,s,r)=>({set _(a){G(e,t,a,s)},get _(){return N(e,t,r)}});import xr from"fs";import wr from"path";var Ps=(e,t,s)=>(r,a)=>{let n=-1;return l(0);async function l(o){if(o<=n)throw new Error("next() called multiple times");n=o;let u,f=!1,g;if(e[o]?(g=e[o][0][0],r.req.routeIndex=o):g=o===e.length&&a||void 0,g)try{u=await g(r,()=>l(o+1))}catch(x){if(x instanceof Error&&t)r.error=x,u=await t(x,r),f=!0;else throw x}else r.finalized===!1&&s&&(u=await s(r));return u&&(r.finalized===!1||f)&&(r.res=u),r}},Er=Symbol(),_r=async(e,t=Object.create(null))=>{const{all:s=!1,dot:r=!1}=t,n=(e instanceof oi?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Sr(e,{all:s,dot:r}):{}};async function Sr(e,t){const s=await e.formData();return s?kr(s,t):{}}function kr(e,t){const s=Object.create(null);return e.forEach((r,a)=>{t.all||a.endsWith("[]")?Tr(s,a,r):s[a]=r}),t.dot&&Object.entries(s).forEach(([r,a])=>{r.includes(".")&&(Ir(s,r,a),delete s[r])}),s}var Tr=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},Ir=(e,t,s)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e;const a=t.split(".");a.forEach((n,l)=>{l===a.length-1?r[n]=s:((!r[n]||typeof r[n]!="object"||Array.isArray(r[n])||r[n]instanceof File)&&(r[n]=Object.create(null)),r=r[n])})},si=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Cr=e=>{const{groups:t,path:s}=Lr(e),r=si(s);return Ar(r,t)},Lr=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,r)=>{const a=`@${r}`;return t.push([a,s]),a}),{groups:t,path:e}},Ar=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[r]=t[s];for(let a=e.length-1;a>=0;a--)if(e[a].includes(r)){e[a]=e[a].replace(r,t[s][1]);break}}return e},Bt={},Or=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${e}#${t}`;return Bt[r]||(s[2]?Bt[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:Bt[r]=[e,s[1],!0]),Bt[r]}return null},bs=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},Mr=e=>bs(e,decodeURI),ii=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let r=s;for(;r<t.length;r++){const a=t.charCodeAt(r);if(a===37){const n=t.indexOf("?",r),l=t.indexOf("#",r),o=n===-1?l===-1?void 0:l:l===-1?n:Math.min(n,l),u=t.slice(s,o);return Mr(u.includes("%25")?u.replace(/%25/g,"%2525"):u)}else if(a===63||a===35)break}return t.slice(s,r)},Rr=e=>{const t=ii(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},et=(e,t,...s)=>(s.length&&(t=et(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),ri=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let r="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&r===""?s.push("/"):s.push(r);const n=a.replace("?","");r+="/"+n,s.push(r)}else r+="/"+a}),s.filter((a,n,l)=>l.indexOf(a)===n)},ds=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?bs(e,ni):e):e,ai=(e,t,s)=>{let r;if(!s&&t&&!/[%+]/.test(t)){let l=e.indexOf("?",8);if(l===-1)return;for(e.startsWith(t,l+1)||(l=e.indexOf(`&${t}`,l+1));l!==-1;){const o=e.charCodeAt(l+t.length+1);if(o===61){const u=l+t.length+2,f=e.indexOf("&",u);return ds(e.slice(u,f===-1?void 0:f))}else if(o==38||isNaN(o))return"";l=e.indexOf(`&${t}`,l+1)}if(r=/[%+]/.test(e),!r)return}const a={};r??(r=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const l=e.indexOf("&",n+1);let o=e.indexOf("=",n);o>l&&l!==-1&&(o=-1);let u=e.slice(n+1,o===-1?l===-1?void 0:l:o);if(r&&(u=ds(u)),n=l,u==="")continue;let f;o===-1?f="":(f=e.slice(o+1,l===-1?void 0:l),r&&(f=ds(f))),s?(a[u]&&Array.isArray(a[u])||(a[u]=[]),a[u].push(f)):a[u]??(a[u]=f)}return t?a[t]:a},Dr=ai,Nr=(e,t)=>ai(e,t,!0),ni=decodeURIComponent,Fs=e=>bs(e,ni),rt,xe,Me,li,di,hs,Re,Xs,oi=(Xs=class{constructor(e,t="/",s=[[]]){ee(this,Me);X(this,"raw");ee(this,rt);ee(this,xe);X(this,"routeIndex",0);X(this,"path");X(this,"bodyCache",{});ee(this,Re,e=>{const{bodyCache:t,raw:s}=this,r=t[e];if(r)return r;const a=Object.keys(t)[0];return a?t[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,G(this,xe,s),G(this,rt,{})}param(e){return e?se(this,Me,li).call(this,e):se(this,Me,di).call(this)}query(e){return Dr(this.url,e)}queries(e){return Nr(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,r)=>{t[r]=s}),t}async parseBody(e){return _r(this,e)}json(){return N(this,Re).call(this,"text").then(e=>JSON.parse(e))}text(){return N(this,Re).call(this,"text")}arrayBuffer(){return N(this,Re).call(this,"arrayBuffer")}blob(){return N(this,Re).call(this,"blob")}formData(){return N(this,Re).call(this,"formData")}addValidatedData(e,t){N(this,rt)[e]=t}valid(e){return N(this,rt)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Er](){return N(this,xe)}get matchedRoutes(){return N(this,xe)[0].map(([[,e]])=>e)}get routePath(){return N(this,xe)[0].map(([[,e]])=>e)[this.routeIndex].path}},rt=new WeakMap,xe=new WeakMap,Me=new WeakSet,li=function(e){const t=N(this,xe)[0][this.routeIndex][1][e],s=se(this,Me,hs).call(this,t);return s&&/\%/.test(s)?Fs(s):s},di=function(){const e={},t=Object.keys(N(this,xe)[0][this.routeIndex][1]);for(const s of t){const r=se(this,Me,hs).call(this,N(this,xe)[0][this.routeIndex][1][s]);r!==void 0&&(e[s]=/\%/.test(r)?Fs(r):r)}return e},hs=function(e){return N(this,xe)[1]?N(this,xe)[1][e]:e},Re=new WeakMap,Xs),Br={Stringify:1},ci=async(e,t,s,r,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(a?a[0]+=e:a=[e],Promise.all(n.map(o=>o({phase:t,buffer:a,context:r}))).then(o=>Promise.all(o.filter(Boolean).map(u=>ci(u,t,!1,r,a))).then(()=>a[0]))):Promise.resolve(e)},Pr="text/plain; charset=UTF-8",cs=(e,t)=>({"Content-Type":e,...t}),mt=(e,t)=>new Response(e,t),St,kt,Ce,at,Le,ge,Tt,nt,ot,qe,It,Ct,De,tt,Ks,Fr=(Ks=class{constructor(e,t){ee(this,De);ee(this,St);ee(this,kt);X(this,"env",{});ee(this,Ce);X(this,"finalized",!1);X(this,"error");ee(this,at);ee(this,Le);ee(this,ge);ee(this,Tt);ee(this,nt);ee(this,ot);ee(this,qe);ee(this,It);ee(this,Ct);X(this,"render",(...e)=>(N(this,nt)??G(this,nt,t=>this.html(t)),N(this,nt).call(this,...e)));X(this,"setLayout",e=>G(this,Tt,e));X(this,"getLayout",()=>N(this,Tt));X(this,"setRenderer",e=>{G(this,nt,e)});X(this,"header",(e,t,s)=>{this.finalized&&G(this,ge,mt(N(this,ge).body,N(this,ge)));const r=N(this,ge)?N(this,ge).headers:N(this,qe)??G(this,qe,new Headers);t===void 0?r.delete(e):s!=null&&s.append?r.append(e,t):r.set(e,t)});X(this,"status",e=>{G(this,at,e)});X(this,"set",(e,t)=>{N(this,Ce)??G(this,Ce,new Map),N(this,Ce).set(e,t)});X(this,"get",e=>N(this,Ce)?N(this,Ce).get(e):void 0);X(this,"newResponse",(...e)=>se(this,De,tt).call(this,...e));X(this,"body",(e,t,s)=>se(this,De,tt).call(this,e,t,s));X(this,"text",(e,t,s)=>!N(this,qe)&&!N(this,at)&&!t&&!s&&!this.finalized?new Response(e):se(this,De,tt).call(this,e,t,cs(Pr,s)));X(this,"json",(e,t,s)=>se(this,De,tt).call(this,JSON.stringify(e),t,cs("application/json",s)));X(this,"html",(e,t,s)=>{const r=a=>se(this,De,tt).call(this,a,t,cs("text/html; charset=UTF-8",s));return typeof e=="object"?ci(e,Br.Stringify,!1,{}).then(r):r(e)});X(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});X(this,"notFound",()=>(N(this,ot)??G(this,ot,()=>mt()),N(this,ot).call(this,this)));G(this,St,e),t&&(G(this,Le,t.executionCtx),this.env=t.env,G(this,ot,t.notFoundHandler),G(this,Ct,t.path),G(this,It,t.matchResult))}get req(){return N(this,kt)??G(this,kt,new oi(N(this,St),N(this,Ct),N(this,It))),N(this,kt)}get event(){if(N(this,Le)&&"respondWith"in N(this,Le))return N(this,Le);throw Error("This context has no FetchEvent")}get executionCtx(){if(N(this,Le))return N(this,Le);throw Error("This context has no ExecutionContext")}get res(){return N(this,ge)||G(this,ge,mt(null,{headers:N(this,qe)??G(this,qe,new Headers)}))}set res(e){if(N(this,ge)&&e){e=mt(e.body,e);for(const[t,s]of N(this,ge).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=N(this,ge).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of r)e.headers.append("set-cookie",a)}else e.headers.set(t,s)}G(this,ge,e),this.finalized=!0}get var(){return N(this,Ce)?Object.fromEntries(N(this,Ce)):{}}},St=new WeakMap,kt=new WeakMap,Ce=new WeakMap,at=new WeakMap,Le=new WeakMap,ge=new WeakMap,Tt=new WeakMap,nt=new WeakMap,ot=new WeakMap,qe=new WeakMap,It=new WeakMap,Ct=new WeakMap,De=new WeakSet,tt=function(e,t,s){const r=N(this,ge)?new Headers(N(this,ge).headers):N(this,qe)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[l,o]of n)l.toLowerCase()==="set-cookie"?r.append(l,o):r.set(l,o)}if(s)for(const[n,l]of Object.entries(s))if(typeof l=="string")r.set(n,l);else{r.delete(n);for(const o of l)r.append(n,o)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??N(this,at);return mt(e,{status:a,headers:r})},Ks),de="ALL",Ur="all",zr=["get","post","put","delete","options","patch"],pi="Can not add a route since the matcher is already built.",ui=class extends Error{},$r="__COMPOSED_HANDLER",jr=e=>e.text("404 Not Found",404),Us=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},Ee,ce,hi,_e,$e,$t,jt,lt,qr=(lt=class{constructor(t={}){ee(this,ce);X(this,"get");X(this,"post");X(this,"put");X(this,"delete");X(this,"options");X(this,"patch");X(this,"all");X(this,"on");X(this,"use");X(this,"router");X(this,"getPath");X(this,"_basePath","/");ee(this,Ee,"/");X(this,"routes",[]);ee(this,_e,jr);X(this,"errorHandler",Us);X(this,"onError",t=>(this.errorHandler=t,this));X(this,"notFound",t=>(G(this,_e,t),this));X(this,"fetch",(t,...s)=>se(this,ce,jt).call(this,t,s[1],s[0],t.method));X(this,"request",(t,s,r,a)=>t instanceof Request?this.fetch(s?new Request(t,s):t,r,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${et("/",t)}`,s),r,a)));X(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(se(this,ce,jt).call(this,t.request,t,void 0,t.request.method))})});[...zr,Ur].forEach(n=>{this[n]=(l,...o)=>(typeof l=="string"?G(this,Ee,l):se(this,ce,$e).call(this,n,N(this,Ee),l),o.forEach(u=>{se(this,ce,$e).call(this,n,N(this,Ee),u)}),this)}),this.on=(n,l,...o)=>{for(const u of[l].flat()){G(this,Ee,u);for(const f of[n].flat())o.map(g=>{se(this,ce,$e).call(this,f.toUpperCase(),N(this,Ee),g)})}return this},this.use=(n,...l)=>(typeof n=="string"?G(this,Ee,n):(G(this,Ee,"*"),l.unshift(n)),l.forEach(o=>{se(this,ce,$e).call(this,de,N(this,Ee),o)}),this);const{strict:r,...a}=t;Object.assign(this,a),this.getPath=r??!0?t.getPath??ii:Rr}route(t,s){const r=this.basePath(t);return s.routes.map(a=>{var l;let n;s.errorHandler===Us?n=a.handler:(n=async(o,u)=>(await Ps([],s.errorHandler)(o,()=>a.handler(o,u))).res,n[$r]=a.handler),se(l=r,ce,$e).call(l,a.method,a.path,n)}),this}basePath(t){const s=se(this,ce,hi).call(this);return s._basePath=et(this._basePath,t),s}mount(t,s,r){let a,n;r&&(typeof r=="function"?n=r:(n=r.optionHandler,r.replaceRequest===!1?a=u=>u:a=r.replaceRequest));const l=n?u=>{const f=n(u);return Array.isArray(f)?f:[f]}:u=>{let f;try{f=u.executionCtx}catch{}return[u.env,f]};a||(a=(()=>{const u=et(this._basePath,t),f=u==="/"?0:u.length;return g=>{const x=new URL(g.url);return x.pathname=x.pathname.slice(f)||"/",new Request(x,g)}})());const o=async(u,f)=>{const g=await s(a(u.req.raw),...l(u));if(g)return g;await f()};return se(this,ce,$e).call(this,de,et(t,"*"),o),this}},Ee=new WeakMap,ce=new WeakSet,hi=function(){const t=new lt({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,G(t,_e,N(this,_e)),t.routes=this.routes,t},_e=new WeakMap,$e=function(t,s,r){t=t.toUpperCase(),s=et(this._basePath,s);const a={basePath:this._basePath,path:s,method:t,handler:r};this.router.add(t,s,[r,a]),this.routes.push(a)},$t=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},jt=function(t,s,r,a){if(a==="HEAD")return(async()=>new Response(null,await se(this,ce,jt).call(this,t,s,r,"GET")))();const n=this.getPath(t,{env:r}),l=this.router.match(a,n),o=new Fr(t,{path:n,matchResult:l,env:r,executionCtx:s,notFoundHandler:N(this,_e)});if(l[0].length===1){let f;try{f=l[0][0][0][0](o,async()=>{o.res=await N(this,_e).call(this,o)})}catch(g){return se(this,ce,$t).call(this,g,o)}return f instanceof Promise?f.then(g=>g||(o.finalized?o.res:N(this,_e).call(this,o))).catch(g=>se(this,ce,$t).call(this,g,o)):f??N(this,_e).call(this,o)}const u=Ps(l[0],this.errorHandler,N(this,_e));return(async()=>{try{const f=await u(o);if(!f.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return f.res}catch(f){return se(this,ce,$t).call(this,f,o)}})()},lt),fi=[];function Vr(e,t){const s=this.buildAllMatchers(),r=((a,n)=>{const l=s[a]||s[de],o=l[2][n];if(o)return o;const u=n.match(l[0]);if(!u)return[[],fi];const f=u.indexOf("",1);return[l[1][f],u]});return this.match=r,r(e,t)}var Ht="[^/]+",xt=".*",wt="(?:|/.*)",st=Symbol(),Hr=new Set(".\\+*[^]$()");function Wr(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===xt||e===wt?1:t===xt||t===wt?-1:e===Ht?1:t===Ht?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Ve,He,Se,Qe,Gr=(Qe=class{constructor(){ee(this,Ve);ee(this,He);ee(this,Se,Object.create(null))}insert(t,s,r,a,n){if(t.length===0){if(N(this,Ve)!==void 0)throw st;if(n)return;G(this,Ve,s);return}const[l,...o]=t,u=l==="*"?o.length===0?["","",xt]:["","",Ht]:l==="/*"?["","",wt]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let f;if(u){const g=u[1];let x=u[2]||Ht;if(g&&u[2]&&(x===".*"||(x=x.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(x))))throw st;if(f=N(this,Se)[x],!f){if(Object.keys(N(this,Se)).some(b=>b!==xt&&b!==wt))throw st;if(n)return;f=N(this,Se)[x]=new Qe,g!==""&&G(f,He,a.varIndex++)}!n&&g!==""&&r.push([g,N(f,He)])}else if(f=N(this,Se)[l],!f){if(Object.keys(N(this,Se)).some(g=>g.length>1&&g!==xt&&g!==wt))throw st;if(n)return;f=N(this,Se)[l]=new Qe}f.insert(o,s,r,a,n)}buildRegExpStr(){const s=Object.keys(N(this,Se)).sort(Wr).map(r=>{const a=N(this,Se)[r];return(typeof N(a,He)=="number"?`(${r})@${N(a,He)}`:Hr.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof N(this,Ve)=="number"&&s.unshift(`#${N(this,Ve)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Ve=new WeakMap,He=new WeakMap,Se=new WeakMap,Qe),Wt,Lt,Js,Qr=(Js=class{constructor(){ee(this,Wt,{varIndex:0});ee(this,Lt,new Gr)}insert(e,t,s){const r=[],a=[];for(let l=0;;){let o=!1;if(e=e.replace(/\{[^}]+\}/g,u=>{const f=`@\\${l}`;return a[l]=[f,u],l++,o=!0,f}),!o)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let l=a.length-1;l>=0;l--){const[o]=a[l];for(let u=n.length-1;u>=0;u--)if(n[u].indexOf(o)!==-1){n[u]=n[u].replace(o,a[l][1]);break}}return N(this,Lt).insert(n,t,r,N(this,Wt),s),r}buildRegExp(){let e=N(this,Lt).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,l)=>n!==void 0?(s[++t]=Number(n),"$()"):(l!==void 0&&(r[Number(l)]=++t),"")),[new RegExp(`^${e}`),s,r]}},Wt=new WeakMap,Lt=new WeakMap,Js),Yr=[/^$/,[],Object.create(null)],qt=Object.create(null);function gi(e){return qt[e]??(qt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function Xr(){qt=Object.create(null)}function Kr(e){var f;const t=new Qr,s=[];if(e.length===0)return Yr;const r=e.map(g=>[!/\*|\/:/.test(g[0]),...g]).sort(([g,x],[b,y])=>g?1:b?-1:x.length-y.length),a=Object.create(null);for(let g=0,x=-1,b=r.length;g<b;g++){const[y,d,p]=r[g];y?a[d]=[p.map(([w])=>[w,Object.create(null)]),fi]:x++;let v;try{v=t.insert(d,x,y)}catch(w){throw w===st?new ui(d):w}y||(s[x]=p.map(([w,E])=>{const _=Object.create(null);for(E-=1;E>=0;E--){const[M,R]=v[E];_[M]=R}return[w,_]}))}const[n,l,o]=t.buildRegExp();for(let g=0,x=s.length;g<x;g++)for(let b=0,y=s[g].length;b<y;b++){const d=(f=s[g][b])==null?void 0:f[1];if(!d)continue;const p=Object.keys(d);for(let v=0,w=p.length;v<w;v++)d[p[v]]=o[d[p[v]]]}const u=[];for(const g in l)u[g]=s[l[g]];return[n,u,a]}function Ze(e,t){if(e){for(const s of Object.keys(e).sort((r,a)=>a.length-r.length))if(gi(s).test(t))return[...e[s]]}}var Ne,Be,Gt,mi,Zs,Jr=(Zs=class{constructor(){ee(this,Gt);X(this,"name","RegExpRouter");ee(this,Ne);ee(this,Be);X(this,"match",Vr);G(this,Ne,{[de]:Object.create(null)}),G(this,Be,{[de]:Object.create(null)})}add(e,t,s){var o;const r=N(this,Ne),a=N(this,Be);if(!r||!a)throw new Error(pi);r[e]||[r,a].forEach(u=>{u[e]=Object.create(null),Object.keys(u[de]).forEach(f=>{u[e][f]=[...u[de][f]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const u=gi(t);e===de?Object.keys(r).forEach(f=>{var g;(g=r[f])[t]||(g[t]=Ze(r[f],t)||Ze(r[de],t)||[])}):(o=r[e])[t]||(o[t]=Ze(r[e],t)||Ze(r[de],t)||[]),Object.keys(r).forEach(f=>{(e===de||e===f)&&Object.keys(r[f]).forEach(g=>{u.test(g)&&r[f][g].push([s,n])})}),Object.keys(a).forEach(f=>{(e===de||e===f)&&Object.keys(a[f]).forEach(g=>u.test(g)&&a[f][g].push([s,n]))});return}const l=ri(t)||[t];for(let u=0,f=l.length;u<f;u++){const g=l[u];Object.keys(a).forEach(x=>{var b;(e===de||e===x)&&((b=a[x])[g]||(b[g]=[...Ze(r[x],g)||Ze(r[de],g)||[]]),a[x][g].push([s,n-f+u+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(N(this,Be)).concat(Object.keys(N(this,Ne))).forEach(t=>{e[t]||(e[t]=se(this,Gt,mi).call(this,t))}),G(this,Ne,G(this,Be,void 0)),Xr(),e}},Ne=new WeakMap,Be=new WeakMap,Gt=new WeakSet,mi=function(e){const t=[];let s=e===de;return[N(this,Ne),N(this,Be)].forEach(r=>{const a=r[e]?Object.keys(r[e]).map(n=>[n,r[e][n]]):[];a.length!==0?(s||(s=!0),t.push(...a)):e!==de&&t.push(...Object.keys(r[de]).map(n=>[n,r[de][n]]))}),s?Kr(t):null},Zs),Pe,Ae,ei,Zr=(ei=class{constructor(e){X(this,"name","SmartRouter");ee(this,Pe,[]);ee(this,Ae,[]);G(this,Pe,e.routers)}add(e,t,s){if(!N(this,Ae))throw new Error(pi);N(this,Ae).push([e,t,s])}match(e,t){if(!N(this,Ae))throw new Error("Fatal error");const s=N(this,Pe),r=N(this,Ae),a=s.length;let n=0,l;for(;n<a;n++){const o=s[n];try{for(let u=0,f=r.length;u<f;u++)o.add(...r[u]);l=o.match(e,t)}catch(u){if(u instanceof ui)continue;throw u}this.match=o.match.bind(o),G(this,Pe,[o]),G(this,Ae,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,l}get activeRouter(){if(N(this,Ae)||N(this,Pe).length!==1)throw new Error("No active router has been determined yet.");return N(this,Pe)[0]}},Pe=new WeakMap,Ae=new WeakMap,ei),bt=Object.create(null),ea=e=>{for(const t in e)return!0;return!1},Fe,fe,We,dt,he,Oe,je,ct,ta=(ct=class{constructor(t,s,r){ee(this,Oe);ee(this,Fe);ee(this,fe);ee(this,We);ee(this,dt,0);ee(this,he,bt);if(G(this,fe,r||Object.create(null)),G(this,Fe,[]),t&&s){const a=Object.create(null);a[t]={handler:s,possibleKeys:[],score:0},G(this,Fe,[a])}G(this,We,[])}insert(t,s,r){G(this,dt,++Bs(this,dt)._);let a=this;const n=Cr(s),l=[];for(let o=0,u=n.length;o<u;o++){const f=n[o],g=n[o+1],x=Or(f,g),b=Array.isArray(x)?x[0]:f;if(b in N(a,fe)){a=N(a,fe)[b],x&&l.push(x[1]);continue}N(a,fe)[b]=new ct,x&&(N(a,We).push(x),l.push(x[1])),a=N(a,fe)[b]}return N(a,Fe).push({[t]:{handler:r,possibleKeys:l.filter((o,u,f)=>f.indexOf(o)===u),score:N(this,dt)}}),a}search(t,s){var g;const r=[];G(this,he,bt);let n=[this];const l=si(s),o=[],u=l.length;let f=null;for(let x=0;x<u;x++){const b=l[x],y=x===u-1,d=[];for(let v=0,w=n.length;v<w;v++){const E=n[v],_=N(E,fe)[b];_&&(G(_,he,N(E,he)),y?(N(_,fe)["*"]&&se(this,Oe,je).call(this,r,N(_,fe)["*"],t,N(E,he)),se(this,Oe,je).call(this,r,_,t,N(E,he))):d.push(_));for(let M=0,R=N(E,We).length;M<R;M++){const S=N(E,We)[M],C=N(E,he)===bt?{}:{...N(E,he)};if(S==="*"){const z=N(E,fe)["*"];z&&(se(this,Oe,je).call(this,r,z,t,N(E,he)),G(z,he,C),d.push(z));continue}const[L,k,D]=S;if(!b&&!(D instanceof RegExp))continue;const A=N(E,fe)[L];if(D instanceof RegExp){if(f===null){f=new Array(u);let B=s[0]==="/"?1:0;for(let U=0;U<u;U++)f[U]=B,B+=l[U].length+1}const z=s.substring(f[x]),$=D.exec(z);if($){if(C[k]=$[0],se(this,Oe,je).call(this,r,A,t,N(E,he),C),ea(N(A,fe))){G(A,he,C);const B=((g=$[0].match(/\//))==null?void 0:g.length)??0;(o[B]||(o[B]=[])).push(A)}continue}}(D===!0||D.test(b))&&(C[k]=b,y?(se(this,Oe,je).call(this,r,A,t,C,N(E,he)),N(A,fe)["*"]&&se(this,Oe,je).call(this,r,N(A,fe)["*"],t,C,N(E,he))):(G(A,he,C),d.push(A)))}}const p=o.shift();n=p?d.concat(p):d}return r.length>1&&r.sort((x,b)=>x.score-b.score),[r.map(({handler:x,params:b})=>[x,b])]}},Fe=new WeakMap,fe=new WeakMap,We=new WeakMap,dt=new WeakMap,he=new WeakMap,Oe=new WeakSet,je=function(t,s,r,a,n){for(let l=0,o=N(s,Fe).length;l<o;l++){const u=N(s,Fe)[l],f=u[r]||u[de],g={};if(f!==void 0&&(f.params=Object.create(null),t.push(f),a!==bt||n&&n!==bt))for(let x=0,b=f.possibleKeys.length;x<b;x++){const y=f.possibleKeys[x],d=g[f.score];f.params[y]=n!=null&&n[y]&&!d?n[y]:a[y]??(n==null?void 0:n[y]),g[f.score]=!0}}},ct),Ge,ti,sa=(ti=class{constructor(){X(this,"name","TrieRouter");ee(this,Ge);G(this,Ge,new ta)}add(e,t,s){const r=ri(t);if(r){for(let a=0,n=r.length;a<n;a++)N(this,Ge).insert(e,r[a],s);return}N(this,Ge).insert(e,t,s)}match(e,t){return N(this,Ge).search(e,t)}},Ge=new WeakMap,ti),bi=class extends qr{constructor(e={}){super(e),this.router=e.router??new Zr({routers:[new Jr,new sa]})}},ia=Object.create,pt=Object.defineProperty,ra=Object.getOwnPropertyDescriptor,aa=Object.getOwnPropertyNames,na=Object.getPrototypeOf,oa=Object.prototype.hasOwnProperty,la=(e,t,s)=>t in e?pt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,m=(e,t)=>pt(e,"name",{value:t,configurable:!0}),me=(e,t)=>()=>(e&&(t=e(e=0)),t),Z=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ke=(e,t)=>{for(var s in t)pt(e,s,{get:t[s],enumerable:!0})},vi=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of aa(t))!oa.call(e,a)&&a!==s&&pt(e,a,{get:()=>t[a],enumerable:!(r=ra(t,a))||r.enumerable});return e},Ye=(e,t,s)=>(s=e!=null?ia(na(e)):{},vi(t||!e||!e.__esModule?pt(s,"default",{value:e,enumerable:!0}):s,e)),ue=e=>vi(pt({},"__esModule",{value:!0}),e),Q=(e,t,s)=>la(e,typeof t!="symbol"?t+"":t,s),da=Z(e=>{q(),e.byteLength=u,e.toByteArray=g,e.fromByteArray=y;var t=[],s=[],r=typeof Uint8Array<"u"?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(n=0,l=a.length;n<l;++n)t[n]=a[n],s[a.charCodeAt(n)]=n;var n,l;s[45]=62,s[95]=63;function o(d){var p=d.length;if(p%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var v=d.indexOf("=");v===-1&&(v=p);var w=v===p?0:4-v%4;return[v,w]}m(o,"getLens");function u(d){var p=o(d),v=p[0],w=p[1];return(v+w)*3/4-w}m(u,"byteLength");function f(d,p,v){return(p+v)*3/4-v}m(f,"_byteLength");function g(d){var p,v=o(d),w=v[0],E=v[1],_=new r(f(d,w,E)),M=0,R=E>0?w-4:w,S;for(S=0;S<R;S+=4)p=s[d.charCodeAt(S)]<<18|s[d.charCodeAt(S+1)]<<12|s[d.charCodeAt(S+2)]<<6|s[d.charCodeAt(S+3)],_[M++]=p>>16&255,_[M++]=p>>8&255,_[M++]=p&255;return E===2&&(p=s[d.charCodeAt(S)]<<2|s[d.charCodeAt(S+1)]>>4,_[M++]=p&255),E===1&&(p=s[d.charCodeAt(S)]<<10|s[d.charCodeAt(S+1)]<<4|s[d.charCodeAt(S+2)]>>2,_[M++]=p>>8&255,_[M++]=p&255),_}m(g,"toByteArray");function x(d){return t[d>>18&63]+t[d>>12&63]+t[d>>6&63]+t[d&63]}m(x,"tripletToBase64");function b(d,p,v){for(var w,E=[],_=p;_<v;_+=3)w=(d[_]<<16&16711680)+(d[_+1]<<8&65280)+(d[_+2]&255),E.push(x(w));return E.join("")}m(b,"encodeChunk");function y(d){for(var p,v=d.length,w=v%3,E=[],_=16383,M=0,R=v-w;M<R;M+=_)E.push(b(d,M,M+_>R?R:M+_));return w===1?(p=d[v-1],E.push(t[p>>2]+t[p<<4&63]+"==")):w===2&&(p=(d[v-2]<<8)+d[v-1],E.push(t[p>>10]+t[p>>4&63]+t[p<<2&63]+"=")),E.join("")}m(y,"fromByteArray")}),ca=Z(e=>{q(),e.read=function(t,s,r,a,n){var l,o,u=n*8-a-1,f=(1<<u)-1,g=f>>1,x=-7,b=r?n-1:0,y=r?-1:1,d=t[s+b];for(b+=y,l=d&(1<<-x)-1,d>>=-x,x+=u;x>0;l=l*256+t[s+b],b+=y,x-=8);for(o=l&(1<<-x)-1,l>>=-x,x+=a;x>0;o=o*256+t[s+b],b+=y,x-=8);if(l===0)l=1-g;else{if(l===f)return o?NaN:(d?-1:1)*(1/0);o=o+Math.pow(2,a),l=l-g}return(d?-1:1)*o*Math.pow(2,l-a)},e.write=function(t,s,r,a,n,l){var o,u,f,g=l*8-n-1,x=(1<<g)-1,b=x>>1,y=n===23?Math.pow(2,-24)-Math.pow(2,-77):0,d=a?0:l-1,p=a?1:-1,v=s<0||s===0&&1/s<0?1:0;for(s=Math.abs(s),isNaN(s)||s===1/0?(u=isNaN(s)?1:0,o=x):(o=Math.floor(Math.log(s)/Math.LN2),s*(f=Math.pow(2,-o))<1&&(o--,f*=2),o+b>=1?s+=y/f:s+=y*Math.pow(2,1-b),s*f>=2&&(o++,f/=2),o+b>=x?(u=0,o=x):o+b>=1?(u=(s*f-1)*Math.pow(2,n),o=o+b):(u=s*Math.pow(2,b-1)*Math.pow(2,n),o=0));n>=8;t[r+d]=u&255,d+=p,u/=256,n-=8);for(o=o<<n|u,g+=n;g>0;t[r+d]=o&255,d+=p,o/=256,g-=8);t[r+d-p]|=v*128}}),pa=Z(e=>{q();var t=da(),s=ca(),r=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=o,e.SlowBuffer=E,e.INSPECT_MAX_BYTES=50;var a=2147483647;e.kMaxLength=a,o.TYPED_ARRAY_SUPPORT=n(),!o.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function n(){try{let i=new Uint8Array(1),c={foo:m(function(){return 42},"foo")};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(i,c),i.foo()===42}catch{return!1}}m(n,"typedArraySupport"),Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:m(function(){if(o.isBuffer(this))return this.buffer},"get")}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:m(function(){if(o.isBuffer(this))return this.byteOffset},"get")});function l(i){if(i>a)throw new RangeError('The value "'+i+'" is invalid for option "size"');let c=new Uint8Array(i);return Object.setPrototypeOf(c,o.prototype),c}m(l,"createBuffer");function o(i,c,h){if(typeof i=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return x(i)}return u(i,c,h)}m(o,"Buffer"),o.poolSize=8192;function u(i,c,h){if(typeof i=="string")return b(i,c);if(ArrayBuffer.isView(i))return d(i);if(i==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof i);if(we(i,ArrayBuffer)||i&&we(i.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(we(i,SharedArrayBuffer)||i&&we(i.buffer,SharedArrayBuffer)))return p(i,c,h);if(typeof i=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let T=i.valueOf&&i.valueOf();if(T!=null&&T!==i)return o.from(T,c,h);let I=v(i);if(I)return I;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof i[Symbol.toPrimitive]=="function")return o.from(i[Symbol.toPrimitive]("string"),c,h);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof i)}m(u,"from"),o.from=function(i,c,h){return u(i,c,h)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array);function f(i){if(typeof i!="number")throw new TypeError('"size" argument must be of type number');if(i<0)throw new RangeError('The value "'+i+'" is invalid for option "size"')}m(f,"assertSize");function g(i,c,h){return f(i),i<=0?l(i):c!==void 0?typeof h=="string"?l(i).fill(c,h):l(i).fill(c):l(i)}m(g,"alloc"),o.alloc=function(i,c,h){return g(i,c,h)};function x(i){return f(i),l(i<0?0:w(i)|0)}m(x,"allocUnsafe"),o.allocUnsafe=function(i){return x(i)},o.allocUnsafeSlow=function(i){return x(i)};function b(i,c){if((typeof c!="string"||c==="")&&(c="utf8"),!o.isEncoding(c))throw new TypeError("Unknown encoding: "+c);let h=_(i,c)|0,T=l(h),I=T.write(i,c);return I!==h&&(T=T.slice(0,I)),T}m(b,"fromString");function y(i){let c=i.length<0?0:w(i.length)|0,h=l(c);for(let T=0;T<c;T+=1)h[T]=i[T]&255;return h}m(y,"fromArrayLike");function d(i){if(we(i,Uint8Array)){let c=new Uint8Array(i);return p(c.buffer,c.byteOffset,c.byteLength)}return y(i)}m(d,"fromArrayView");function p(i,c,h){if(c<0||i.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(i.byteLength<c+(h||0))throw new RangeError('"length" is outside of buffer bounds');let T;return c===void 0&&h===void 0?T=new Uint8Array(i):h===void 0?T=new Uint8Array(i,c):T=new Uint8Array(i,c,h),Object.setPrototypeOf(T,o.prototype),T}m(p,"fromArrayBuffer");function v(i){if(o.isBuffer(i)){let c=w(i.length)|0,h=l(c);return h.length===0||i.copy(h,0,0,c),h}if(i.length!==void 0)return typeof i.length!="number"||Nt(i.length)?l(0):y(i);if(i.type==="Buffer"&&Array.isArray(i.data))return y(i.data)}m(v,"fromObject");function w(i){if(i>=a)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a.toString(16)+" bytes");return i|0}m(w,"checked");function E(i){return+i!=i&&(i=0),o.alloc(+i)}m(E,"SlowBuffer"),o.isBuffer=m(function(i){return i!=null&&i._isBuffer===!0&&i!==o.prototype},"isBuffer"),o.compare=m(function(i,c){if(we(i,Uint8Array)&&(i=o.from(i,i.offset,i.byteLength)),we(c,Uint8Array)&&(c=o.from(c,c.offset,c.byteLength)),!o.isBuffer(i)||!o.isBuffer(c))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(i===c)return 0;let h=i.length,T=c.length;for(let I=0,P=Math.min(h,T);I<P;++I)if(i[I]!==c[I]){h=i[I],T=c[I];break}return h<T?-1:T<h?1:0},"compare"),o.isEncoding=m(function(i){switch(String(i).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},"isEncoding"),o.concat=m(function(i,c){if(!Array.isArray(i))throw new TypeError('"list" argument must be an Array of Buffers');if(i.length===0)return o.alloc(0);let h;if(c===void 0)for(c=0,h=0;h<i.length;++h)c+=i[h].length;let T=o.allocUnsafe(c),I=0;for(h=0;h<i.length;++h){let P=i[h];if(we(P,Uint8Array))I+P.length>T.length?(o.isBuffer(P)||(P=o.from(P)),P.copy(T,I)):Uint8Array.prototype.set.call(T,P,I);else if(o.isBuffer(P))P.copy(T,I);else throw new TypeError('"list" argument must be an Array of Buffers');I+=P.length}return T},"concat");function _(i,c){if(o.isBuffer(i))return i.length;if(ArrayBuffer.isView(i)||we(i,ArrayBuffer))return i.byteLength;if(typeof i!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof i);let h=i.length,T=arguments.length>2&&arguments[2]===!0;if(!T&&h===0)return 0;let I=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return h;case"utf8":case"utf-8":return Dt(i).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return h*2;case"hex":return h>>>1;case"base64":return os(i).length;default:if(I)return T?-1:Dt(i).length;c=(""+c).toLowerCase(),I=!0}}m(_,"byteLength"),o.byteLength=_;function M(i,c,h){let T=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((h===void 0||h>this.length)&&(h=this.length),h<=0)||(h>>>=0,c>>>=0,h<=c))return"";for(i||(i="utf8");;)switch(i){case"hex":return K(this,c,h);case"utf8":case"utf-8":return B(this,c,h);case"ascii":return Y(this,c,h);case"latin1":case"binary":return te(this,c,h);case"base64":return $(this,c,h);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return be(this,c,h);default:if(T)throw new TypeError("Unknown encoding: "+i);i=(i+"").toLowerCase(),T=!0}}m(M,"slowToString"),o.prototype._isBuffer=!0;function R(i,c,h){let T=i[c];i[c]=i[h],i[h]=T}m(R,"swap"),o.prototype.swap16=m(function(){let i=this.length;if(i%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let c=0;c<i;c+=2)R(this,c,c+1);return this},"swap16"),o.prototype.swap32=m(function(){let i=this.length;if(i%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let c=0;c<i;c+=4)R(this,c,c+3),R(this,c+1,c+2);return this},"swap32"),o.prototype.swap64=m(function(){let i=this.length;if(i%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let c=0;c<i;c+=8)R(this,c,c+7),R(this,c+1,c+6),R(this,c+2,c+5),R(this,c+3,c+4);return this},"swap64"),o.prototype.toString=m(function(){let i=this.length;return i===0?"":arguments.length===0?B(this,0,i):M.apply(this,arguments)},"toString"),o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=m(function(i){if(!o.isBuffer(i))throw new TypeError("Argument must be a Buffer");return this===i?!0:o.compare(this,i)===0},"equals"),o.prototype.inspect=m(function(){let i="",c=e.INSPECT_MAX_BYTES;return i=this.toString("hex",0,c).replace(/(.{2})/g,"$1 ").trim(),this.length>c&&(i+=" ... "),"<Buffer "+i+">"},"inspect"),r&&(o.prototype[r]=o.prototype.inspect),o.prototype.compare=m(function(i,c,h,T,I){if(we(i,Uint8Array)&&(i=o.from(i,i.offset,i.byteLength)),!o.isBuffer(i))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof i);if(c===void 0&&(c=0),h===void 0&&(h=i?i.length:0),T===void 0&&(T=0),I===void 0&&(I=this.length),c<0||h>i.length||T<0||I>this.length)throw new RangeError("out of range index");if(T>=I&&c>=h)return 0;if(T>=I)return-1;if(c>=h)return 1;if(c>>>=0,h>>>=0,T>>>=0,I>>>=0,this===i)return 0;let P=I-T,F=h-c,re=Math.min(P,F),pe=this.slice(T,I),ne=i.slice(c,h);for(let ae=0;ae<re;++ae)if(pe[ae]!==ne[ae]){P=pe[ae],F=ne[ae];break}return P<F?-1:F<P?1:0},"compare");function S(i,c,h,T,I){if(i.length===0)return-1;if(typeof h=="string"?(T=h,h=0):h>2147483647?h=2147483647:h<-2147483648&&(h=-2147483648),h=+h,Nt(h)&&(h=I?0:i.length-1),h<0&&(h=i.length+h),h>=i.length){if(I)return-1;h=i.length-1}else if(h<0)if(I)h=0;else return-1;if(typeof c=="string"&&(c=o.from(c,T)),o.isBuffer(c))return c.length===0?-1:C(i,c,h,T,I);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?I?Uint8Array.prototype.indexOf.call(i,c,h):Uint8Array.prototype.lastIndexOf.call(i,c,h):C(i,[c],h,T,I);throw new TypeError("val must be string, number or Buffer")}m(S,"bidirectionalIndexOf");function C(i,c,h,T,I){let P=1,F=i.length,re=c.length;if(T!==void 0&&(T=String(T).toLowerCase(),T==="ucs2"||T==="ucs-2"||T==="utf16le"||T==="utf-16le")){if(i.length<2||c.length<2)return-1;P=2,F/=2,re/=2,h/=2}function pe(ae,oe){return P===1?ae[oe]:ae.readUInt16BE(oe*P)}m(pe,"read");let ne;if(I){let ae=-1;for(ne=h;ne<F;ne++)if(pe(i,ne)===pe(c,ae===-1?0:ne-ae)){if(ae===-1&&(ae=ne),ne-ae+1===re)return ae*P}else ae!==-1&&(ne-=ne-ae),ae=-1}else for(h+re>F&&(h=F-re),ne=h;ne>=0;ne--){let ae=!0;for(let oe=0;oe<re;oe++)if(pe(i,ne+oe)!==pe(c,oe)){ae=!1;break}if(ae)return ne}return-1}m(C,"arrayIndexOf"),o.prototype.includes=m(function(i,c,h){return this.indexOf(i,c,h)!==-1},"includes"),o.prototype.indexOf=m(function(i,c,h){return S(this,i,c,h,!0)},"indexOf"),o.prototype.lastIndexOf=m(function(i,c,h){return S(this,i,c,h,!1)},"lastIndexOf");function L(i,c,h,T){h=Number(h)||0;let I=i.length-h;T?(T=Number(T),T>I&&(T=I)):T=I;let P=c.length;T>P/2&&(T=P/2);let F;for(F=0;F<T;++F){let re=parseInt(c.substr(F*2,2),16);if(Nt(re))return F;i[h+F]=re}return F}m(L,"hexWrite");function k(i,c,h,T){return gt(Dt(c,i.length-h),i,h,T)}m(k,"utf8Write");function D(i,c,h,T){return gt(Ms(c),i,h,T)}m(D,"asciiWrite");function A(i,c,h,T){return gt(os(c),i,h,T)}m(A,"base64Write");function z(i,c,h,T){return gt(Rs(c,i.length-h),i,h,T)}m(z,"ucs2Write"),o.prototype.write=m(function(i,c,h,T){if(c===void 0)T="utf8",h=this.length,c=0;else if(h===void 0&&typeof c=="string")T=c,h=this.length,c=0;else if(isFinite(c))c=c>>>0,isFinite(h)?(h=h>>>0,T===void 0&&(T="utf8")):(T=h,h=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let I=this.length-c;if((h===void 0||h>I)&&(h=I),i.length>0&&(h<0||c<0)||c>this.length)throw new RangeError("Attempt to write outside buffer bounds");T||(T="utf8");let P=!1;for(;;)switch(T){case"hex":return L(this,i,c,h);case"utf8":case"utf-8":return k(this,i,c,h);case"ascii":case"latin1":case"binary":return D(this,i,c,h);case"base64":return A(this,i,c,h);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return z(this,i,c,h);default:if(P)throw new TypeError("Unknown encoding: "+T);T=(""+T).toLowerCase(),P=!0}},"write"),o.prototype.toJSON=m(function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},"toJSON");function $(i,c,h){return c===0&&h===i.length?t.fromByteArray(i):t.fromByteArray(i.slice(c,h))}m($,"base64Slice");function B(i,c,h){h=Math.min(i.length,h);let T=[],I=c;for(;I<h;){let P=i[I],F=null,re=P>239?4:P>223?3:P>191?2:1;if(I+re<=h){let pe,ne,ae,oe;switch(re){case 1:P<128&&(F=P);break;case 2:pe=i[I+1],(pe&192)===128&&(oe=(P&31)<<6|pe&63,oe>127&&(F=oe));break;case 3:pe=i[I+1],ne=i[I+2],(pe&192)===128&&(ne&192)===128&&(oe=(P&15)<<12|(pe&63)<<6|ne&63,oe>2047&&(oe<55296||oe>57343)&&(F=oe));break;case 4:pe=i[I+1],ne=i[I+2],ae=i[I+3],(pe&192)===128&&(ne&192)===128&&(ae&192)===128&&(oe=(P&15)<<18|(pe&63)<<12|(ne&63)<<6|ae&63,oe>65535&&oe<1114112&&(F=oe))}}F===null?(F=65533,re=1):F>65535&&(F-=65536,T.push(F>>>10&1023|55296),F=56320|F&1023),T.push(F),I+=re}return H(T)}m(B,"utf8Slice");var U=4096;function H(i){let c=i.length;if(c<=U)return String.fromCharCode.apply(String,i);let h="",T=0;for(;T<c;)h+=String.fromCharCode.apply(String,i.slice(T,T+=U));return h}m(H,"decodeCodePointsArray");function Y(i,c,h){let T="";h=Math.min(i.length,h);for(let I=c;I<h;++I)T+=String.fromCharCode(i[I]&127);return T}m(Y,"asciiSlice");function te(i,c,h){let T="";h=Math.min(i.length,h);for(let I=c;I<h;++I)T+=String.fromCharCode(i[I]);return T}m(te,"latin1Slice");function K(i,c,h){let T=i.length;(!c||c<0)&&(c=0),(!h||h<0||h>T)&&(h=T);let I="";for(let P=c;P<h;++P)I+=br[i[P]];return I}m(K,"hexSlice");function be(i,c,h){let T=i.slice(c,h),I="";for(let P=0;P<T.length-1;P+=2)I+=String.fromCharCode(T[P]+T[P+1]*256);return I}m(be,"utf16leSlice"),o.prototype.slice=m(function(i,c){let h=this.length;i=~~i,c=c===void 0?h:~~c,i<0?(i+=h,i<0&&(i=0)):i>h&&(i=h),c<0?(c+=h,c<0&&(c=0)):c>h&&(c=h),c<i&&(c=i);let T=this.subarray(i,c);return Object.setPrototypeOf(T,o.prototype),T},"slice");function ie(i,c,h){if(i%1!==0||i<0)throw new RangeError("offset is not uint");if(i+c>h)throw new RangeError("Trying to access beyond buffer length")}m(ie,"checkOffset"),o.prototype.readUintLE=o.prototype.readUIntLE=m(function(i,c,h){i=i>>>0,c=c>>>0,h||ie(i,c,this.length);let T=this[i],I=1,P=0;for(;++P<c&&(I*=256);)T+=this[i+P]*I;return T},"readUIntLE"),o.prototype.readUintBE=o.prototype.readUIntBE=m(function(i,c,h){i=i>>>0,c=c>>>0,h||ie(i,c,this.length);let T=this[i+--c],I=1;for(;c>0&&(I*=256);)T+=this[i+--c]*I;return T},"readUIntBE"),o.prototype.readUint8=o.prototype.readUInt8=m(function(i,c){return i=i>>>0,c||ie(i,1,this.length),this[i]},"readUInt8"),o.prototype.readUint16LE=o.prototype.readUInt16LE=m(function(i,c){return i=i>>>0,c||ie(i,2,this.length),this[i]|this[i+1]<<8},"readUInt16LE"),o.prototype.readUint16BE=o.prototype.readUInt16BE=m(function(i,c){return i=i>>>0,c||ie(i,2,this.length),this[i]<<8|this[i+1]},"readUInt16BE"),o.prototype.readUint32LE=o.prototype.readUInt32LE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),(this[i]|this[i+1]<<8|this[i+2]<<16)+this[i+3]*16777216},"readUInt32LE"),o.prototype.readUint32BE=o.prototype.readUInt32BE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),this[i]*16777216+(this[i+1]<<16|this[i+2]<<8|this[i+3])},"readUInt32BE"),o.prototype.readBigUInt64LE=Te(m(function(i){i=i>>>0,ze(i,"offset");let c=this[i],h=this[i+7];(c===void 0||h===void 0)&&Je(i,this.length-8);let T=c+this[++i]*2**8+this[++i]*2**16+this[++i]*2**24,I=this[++i]+this[++i]*2**8+this[++i]*2**16+h*2**24;return BigInt(T)+(BigInt(I)<<BigInt(32))},"readBigUInt64LE")),o.prototype.readBigUInt64BE=Te(m(function(i){i=i>>>0,ze(i,"offset");let c=this[i],h=this[i+7];(c===void 0||h===void 0)&&Je(i,this.length-8);let T=c*2**24+this[++i]*2**16+this[++i]*2**8+this[++i],I=this[++i]*2**24+this[++i]*2**16+this[++i]*2**8+h;return(BigInt(T)<<BigInt(32))+BigInt(I)},"readBigUInt64BE")),o.prototype.readIntLE=m(function(i,c,h){i=i>>>0,c=c>>>0,h||ie(i,c,this.length);let T=this[i],I=1,P=0;for(;++P<c&&(I*=256);)T+=this[i+P]*I;return I*=128,T>=I&&(T-=Math.pow(2,8*c)),T},"readIntLE"),o.prototype.readIntBE=m(function(i,c,h){i=i>>>0,c=c>>>0,h||ie(i,c,this.length);let T=c,I=1,P=this[i+--T];for(;T>0&&(I*=256);)P+=this[i+--T]*I;return I*=128,P>=I&&(P-=Math.pow(2,8*c)),P},"readIntBE"),o.prototype.readInt8=m(function(i,c){return i=i>>>0,c||ie(i,1,this.length),this[i]&128?(255-this[i]+1)*-1:this[i]},"readInt8"),o.prototype.readInt16LE=m(function(i,c){i=i>>>0,c||ie(i,2,this.length);let h=this[i]|this[i+1]<<8;return h&32768?h|4294901760:h},"readInt16LE"),o.prototype.readInt16BE=m(function(i,c){i=i>>>0,c||ie(i,2,this.length);let h=this[i+1]|this[i]<<8;return h&32768?h|4294901760:h},"readInt16BE"),o.prototype.readInt32LE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),this[i]|this[i+1]<<8|this[i+2]<<16|this[i+3]<<24},"readInt32LE"),o.prototype.readInt32BE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),this[i]<<24|this[i+1]<<16|this[i+2]<<8|this[i+3]},"readInt32BE"),o.prototype.readBigInt64LE=Te(m(function(i){i=i>>>0,ze(i,"offset");let c=this[i],h=this[i+7];(c===void 0||h===void 0)&&Je(i,this.length-8);let T=this[i+4]+this[i+5]*2**8+this[i+6]*2**16+(h<<24);return(BigInt(T)<<BigInt(32))+BigInt(c+this[++i]*2**8+this[++i]*2**16+this[++i]*2**24)},"readBigInt64LE")),o.prototype.readBigInt64BE=Te(m(function(i){i=i>>>0,ze(i,"offset");let c=this[i],h=this[i+7];(c===void 0||h===void 0)&&Je(i,this.length-8);let T=(c<<24)+this[++i]*2**16+this[++i]*2**8+this[++i];return(BigInt(T)<<BigInt(32))+BigInt(this[++i]*2**24+this[++i]*2**16+this[++i]*2**8+h)},"readBigInt64BE")),o.prototype.readFloatLE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),s.read(this,i,!0,23,4)},"readFloatLE"),o.prototype.readFloatBE=m(function(i,c){return i=i>>>0,c||ie(i,4,this.length),s.read(this,i,!1,23,4)},"readFloatBE"),o.prototype.readDoubleLE=m(function(i,c){return i=i>>>0,c||ie(i,8,this.length),s.read(this,i,!0,52,8)},"readDoubleLE"),o.prototype.readDoubleBE=m(function(i,c){return i=i>>>0,c||ie(i,8,this.length),s.read(this,i,!1,52,8)},"readDoubleBE");function le(i,c,h,T,I,P){if(!o.isBuffer(i))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>I||c<P)throw new RangeError('"value" argument is out of bounds');if(h+T>i.length)throw new RangeError("Index out of range")}m(le,"checkInt"),o.prototype.writeUintLE=o.prototype.writeUIntLE=m(function(i,c,h,T){if(i=+i,c=c>>>0,h=h>>>0,!T){let F=Math.pow(2,8*h)-1;le(this,i,c,h,F,0)}let I=1,P=0;for(this[c]=i&255;++P<h&&(I*=256);)this[c+P]=i/I&255;return c+h},"writeUIntLE"),o.prototype.writeUintBE=o.prototype.writeUIntBE=m(function(i,c,h,T){if(i=+i,c=c>>>0,h=h>>>0,!T){let F=Math.pow(2,8*h)-1;le(this,i,c,h,F,0)}let I=h-1,P=1;for(this[c+I]=i&255;--I>=0&&(P*=256);)this[c+I]=i/P&255;return c+h},"writeUIntBE"),o.prototype.writeUint8=o.prototype.writeUInt8=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,1,255,0),this[c]=i&255,c+1},"writeUInt8"),o.prototype.writeUint16LE=o.prototype.writeUInt16LE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,2,65535,0),this[c]=i&255,this[c+1]=i>>>8,c+2},"writeUInt16LE"),o.prototype.writeUint16BE=o.prototype.writeUInt16BE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,2,65535,0),this[c]=i>>>8,this[c+1]=i&255,c+2},"writeUInt16BE"),o.prototype.writeUint32LE=o.prototype.writeUInt32LE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,4,4294967295,0),this[c+3]=i>>>24,this[c+2]=i>>>16,this[c+1]=i>>>8,this[c]=i&255,c+4},"writeUInt32LE"),o.prototype.writeUint32BE=o.prototype.writeUInt32BE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,4,4294967295,0),this[c]=i>>>24,this[c+1]=i>>>16,this[c+2]=i>>>8,this[c+3]=i&255,c+4},"writeUInt32BE");function ht(i,c,h,T,I){ns(c,T,I,i,h,7);let P=Number(c&BigInt(4294967295));i[h++]=P,P=P>>8,i[h++]=P,P=P>>8,i[h++]=P,P=P>>8,i[h++]=P;let F=Number(c>>BigInt(32)&BigInt(4294967295));return i[h++]=F,F=F>>8,i[h++]=F,F=F>>8,i[h++]=F,F=F>>8,i[h++]=F,h}m(ht,"wrtBigUInt64LE");function ft(i,c,h,T,I){ns(c,T,I,i,h,7);let P=Number(c&BigInt(4294967295));i[h+7]=P,P=P>>8,i[h+6]=P,P=P>>8,i[h+5]=P,P=P>>8,i[h+4]=P;let F=Number(c>>BigInt(32)&BigInt(4294967295));return i[h+3]=F,F=F>>8,i[h+2]=F,F=F>>8,i[h+1]=F,F=F>>8,i[h]=F,h+8}m(ft,"wrtBigUInt64BE"),o.prototype.writeBigUInt64LE=Te(m(function(i,c=0){return ht(this,i,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64LE")),o.prototype.writeBigUInt64BE=Te(m(function(i,c=0){return ft(this,i,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64BE")),o.prototype.writeIntLE=m(function(i,c,h,T){if(i=+i,c=c>>>0,!T){let re=Math.pow(2,8*h-1);le(this,i,c,h,re-1,-re)}let I=0,P=1,F=0;for(this[c]=i&255;++I<h&&(P*=256);)i<0&&F===0&&this[c+I-1]!==0&&(F=1),this[c+I]=(i/P>>0)-F&255;return c+h},"writeIntLE"),o.prototype.writeIntBE=m(function(i,c,h,T){if(i=+i,c=c>>>0,!T){let re=Math.pow(2,8*h-1);le(this,i,c,h,re-1,-re)}let I=h-1,P=1,F=0;for(this[c+I]=i&255;--I>=0&&(P*=256);)i<0&&F===0&&this[c+I+1]!==0&&(F=1),this[c+I]=(i/P>>0)-F&255;return c+h},"writeIntBE"),o.prototype.writeInt8=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,1,127,-128),i<0&&(i=255+i+1),this[c]=i&255,c+1},"writeInt8"),o.prototype.writeInt16LE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,2,32767,-32768),this[c]=i&255,this[c+1]=i>>>8,c+2},"writeInt16LE"),o.prototype.writeInt16BE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,2,32767,-32768),this[c]=i>>>8,this[c+1]=i&255,c+2},"writeInt16BE"),o.prototype.writeInt32LE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,4,2147483647,-2147483648),this[c]=i&255,this[c+1]=i>>>8,this[c+2]=i>>>16,this[c+3]=i>>>24,c+4},"writeInt32LE"),o.prototype.writeInt32BE=m(function(i,c,h){return i=+i,c=c>>>0,h||le(this,i,c,4,2147483647,-2147483648),i<0&&(i=4294967295+i+1),this[c]=i>>>24,this[c+1]=i>>>16,this[c+2]=i>>>8,this[c+3]=i&255,c+4},"writeInt32BE"),o.prototype.writeBigInt64LE=Te(m(function(i,c=0){return ht(this,i,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64LE")),o.prototype.writeBigInt64BE=Te(m(function(i,c=0){return ft(this,i,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64BE"));function ss(i,c,h,T,I,P){if(h+T>i.length)throw new RangeError("Index out of range");if(h<0)throw new RangeError("Index out of range")}m(ss,"checkIEEE754");function is(i,c,h,T,I){return c=+c,h=h>>>0,I||ss(i,c,h,4),s.write(i,c,h,T,23,4),h+4}m(is,"writeFloat"),o.prototype.writeFloatLE=m(function(i,c,h){return is(this,i,c,!0,h)},"writeFloatLE"),o.prototype.writeFloatBE=m(function(i,c,h){return is(this,i,c,!1,h)},"writeFloatBE");function rs(i,c,h,T,I){return c=+c,h=h>>>0,I||ss(i,c,h,8),s.write(i,c,h,T,52,8),h+8}m(rs,"writeDouble"),o.prototype.writeDoubleLE=m(function(i,c,h){return rs(this,i,c,!0,h)},"writeDoubleLE"),o.prototype.writeDoubleBE=m(function(i,c,h){return rs(this,i,c,!1,h)},"writeDoubleBE"),o.prototype.copy=m(function(i,c,h,T){if(!o.isBuffer(i))throw new TypeError("argument should be a Buffer");if(h||(h=0),!T&&T!==0&&(T=this.length),c>=i.length&&(c=i.length),c||(c=0),T>0&&T<h&&(T=h),T===h||i.length===0||this.length===0)return 0;if(c<0)throw new RangeError("targetStart out of bounds");if(h<0||h>=this.length)throw new RangeError("Index out of range");if(T<0)throw new RangeError("sourceEnd out of bounds");T>this.length&&(T=this.length),i.length-c<T-h&&(T=i.length-c+h);let I=T-h;return this===i&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(c,h,T):Uint8Array.prototype.set.call(i,this.subarray(h,T),c),I},"copy"),o.prototype.fill=m(function(i,c,h,T){if(typeof i=="string"){if(typeof c=="string"?(T=c,c=0,h=this.length):typeof h=="string"&&(T=h,h=this.length),T!==void 0&&typeof T!="string")throw new TypeError("encoding must be a string");if(typeof T=="string"&&!o.isEncoding(T))throw new TypeError("Unknown encoding: "+T);if(i.length===1){let P=i.charCodeAt(0);(T==="utf8"&&P<128||T==="latin1")&&(i=P)}}else typeof i=="number"?i=i&255:typeof i=="boolean"&&(i=Number(i));if(c<0||this.length<c||this.length<h)throw new RangeError("Out of range index");if(h<=c)return this;c=c>>>0,h=h===void 0?this.length:h>>>0,i||(i=0);let I;if(typeof i=="number")for(I=c;I<h;++I)this[I]=i;else{let P=o.isBuffer(i)?i:o.from(i,T),F=P.length;if(F===0)throw new TypeError('The value "'+i+'" is invalid for argument "value"');for(I=0;I<h-c;++I)this[I+c]=P[I%F]}return this},"fill");var Ke={};function Rt(i,c,h){var T;Ke[i]=(T=class extends h{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${i}]`,this.stack,delete this.name}get code(){return i}set code(I){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:I,writable:!0})}toString(){return`${this.name} [${i}]: ${this.message}`}},m(T,"NodeError"),T)}m(Rt,"E"),Rt("ERR_BUFFER_OUT_OF_BOUNDS",function(i){return i?`${i} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Rt("ERR_INVALID_ARG_TYPE",function(i,c){return`The "${i}" argument must be of type number. Received type ${typeof c}`},TypeError),Rt("ERR_OUT_OF_RANGE",function(i,c,h){let T=`The value of "${i}" is out of range.`,I=h;return Number.isInteger(h)&&Math.abs(h)>2**32?I=as(String(h)):typeof h=="bigint"&&(I=String(h),(h>BigInt(2)**BigInt(32)||h<-(BigInt(2)**BigInt(32)))&&(I=as(I)),I+="n"),T+=` It must be ${c}. Received ${I}`,T},RangeError);function as(i){let c="",h=i.length,T=i[0]==="-"?1:0;for(;h>=T+4;h-=3)c=`_${i.slice(h-3,h)}${c}`;return`${i.slice(0,h)}${c}`}m(as,"addNumericalSeparator");function As(i,c,h){ze(c,"offset"),(i[c]===void 0||i[c+h]===void 0)&&Je(c,i.length-(h+1))}m(As,"checkBounds");function ns(i,c,h,T,I,P){if(i>h||i<c){let F=typeof c=="bigint"?"n":"",re;throw P>3?c===0||c===BigInt(0)?re=`>= 0${F} and < 2${F} ** ${(P+1)*8}${F}`:re=`>= -(2${F} ** ${(P+1)*8-1}${F}) and < 2 ** ${(P+1)*8-1}${F}`:re=`>= ${c}${F} and <= ${h}${F}`,new Ke.ERR_OUT_OF_RANGE("value",re,i)}As(T,I,P)}m(ns,"checkIntBI");function ze(i,c){if(typeof i!="number")throw new Ke.ERR_INVALID_ARG_TYPE(c,"number",i)}m(ze,"validateNumber");function Je(i,c,h){throw Math.floor(i)!==i?(ze(i,h),new Ke.ERR_OUT_OF_RANGE(h||"offset","an integer",i)):c<0?new Ke.ERR_BUFFER_OUT_OF_BOUNDS:new Ke.ERR_OUT_OF_RANGE(h||"offset",`>= ${h?1:0} and <= ${c}`,i)}m(Je,"boundsError");var mr=/[^+/0-9A-Za-z-_]/g;function Os(i){if(i=i.split("=")[0],i=i.trim().replace(mr,""),i.length<2)return"";for(;i.length%4!==0;)i=i+"=";return i}m(Os,"base64clean");function Dt(i,c){c=c||1/0;let h,T=i.length,I=null,P=[];for(let F=0;F<T;++F){if(h=i.charCodeAt(F),h>55295&&h<57344){if(!I){if(h>56319){(c-=3)>-1&&P.push(239,191,189);continue}else if(F+1===T){(c-=3)>-1&&P.push(239,191,189);continue}I=h;continue}if(h<56320){(c-=3)>-1&&P.push(239,191,189),I=h;continue}h=(I-55296<<10|h-56320)+65536}else I&&(c-=3)>-1&&P.push(239,191,189);if(I=null,h<128){if((c-=1)<0)break;P.push(h)}else if(h<2048){if((c-=2)<0)break;P.push(h>>6|192,h&63|128)}else if(h<65536){if((c-=3)<0)break;P.push(h>>12|224,h>>6&63|128,h&63|128)}else if(h<1114112){if((c-=4)<0)break;P.push(h>>18|240,h>>12&63|128,h>>6&63|128,h&63|128)}else throw new Error("Invalid code point")}return P}m(Dt,"utf8ToBytes");function Ms(i){let c=[];for(let h=0;h<i.length;++h)c.push(i.charCodeAt(h)&255);return c}m(Ms,"asciiToBytes");function Rs(i,c){let h,T,I,P=[];for(let F=0;F<i.length&&!((c-=2)<0);++F)h=i.charCodeAt(F),T=h>>8,I=h%256,P.push(I),P.push(T);return P}m(Rs,"utf16leToBytes");function os(i){return t.toByteArray(Os(i))}m(os,"base64ToBytes");function gt(i,c,h,T){let I;for(I=0;I<T&&!(I+h>=c.length||I>=i.length);++I)c[I+h]=i[I];return I}m(gt,"blitBuffer");function we(i,c){return i instanceof c||i!=null&&i.constructor!=null&&i.constructor.name!=null&&i.constructor.name===c.name}m(we,"isInstance");function Nt(i){return i!==i}m(Nt,"numberIsNaN");var br=(function(){let i="0123456789abcdef",c=new Array(256);for(let h=0;h<16;++h){let T=h*16;for(let I=0;I<16;++I)c[T+I]=i[h]+i[I]}return c})();function Te(i){return typeof BigInt>"u"?Ds:i}m(Te,"defineBigIntMethod");function Ds(){throw new Error("BigInt not supported")}m(Ds,"BufferBigIntNotDefined")}),Qt,vs,W,J,q=me(()=>{Qt=globalThis,vs=globalThis.setImmediate??(e=>setTimeout(e,0)),W=typeof globalThis.Buffer=="function"&&typeof globalThis.Buffer.allocUnsafe=="function"?globalThis.Buffer:pa().Buffer,J=globalThis.process??{},J.env??(J.env={});try{J.nextTick(()=>{})}catch{let e=Promise.resolve();J.nextTick=e.then.bind(e)}}),Xe=Z((e,t)=>{q();var s=typeof Reflect=="object"?Reflect:null,r=s&&typeof s.apply=="function"?s.apply:m(function(S,C,L){return Function.prototype.apply.call(S,C,L)},"ReflectApply"),a;s&&typeof s.ownKeys=="function"?a=s.ownKeys:Object.getOwnPropertySymbols?a=m(function(S){return Object.getOwnPropertyNames(S).concat(Object.getOwnPropertySymbols(S))},"ReflectOwnKeys"):a=m(function(S){return Object.getOwnPropertyNames(S)},"ReflectOwnKeys");function n(S){console&&console.warn&&console.warn(S)}m(n,"ProcessEmitWarning");var l=Number.isNaN||m(function(S){return S!==S},"NumberIsNaN");function o(){o.init.call(this)}m(o,"EventEmitter"),t.exports=o,t.exports.once=_,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var u=10;function f(S){if(typeof S!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof S)}m(f,"checkListener"),Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:m(function(){return u},"get"),set:m(function(S){if(typeof S!="number"||S<0||l(S))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+S+".");u=S},"set")}),o.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=m(function(S){if(typeof S!="number"||S<0||l(S))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+S+".");return this._maxListeners=S,this},"setMaxListeners");function g(S){return S._maxListeners===void 0?o.defaultMaxListeners:S._maxListeners}m(g,"_getMaxListeners"),o.prototype.getMaxListeners=m(function(){return g(this)},"getMaxListeners"),o.prototype.emit=m(function(S){for(var C=[],L=1;L<arguments.length;L++)C.push(arguments[L]);var k=S==="error",D=this._events;if(D!==void 0)k=k&&D.error===void 0;else if(!k)return!1;if(k){var A;if(C.length>0&&(A=C[0]),A instanceof Error)throw A;var z=new Error("Unhandled error."+(A?" ("+A.message+")":""));throw z.context=A,z}var $=D[S];if($===void 0)return!1;if(typeof $=="function")r($,this,C);else for(var B=$.length,U=v($,B),L=0;L<B;++L)r(U[L],this,C);return!0},"emit");function x(S,C,L,k){var D,A,z;if(f(L),A=S._events,A===void 0?(A=S._events=Object.create(null),S._eventsCount=0):(A.newListener!==void 0&&(S.emit("newListener",C,L.listener?L.listener:L),A=S._events),z=A[C]),z===void 0)z=A[C]=L,++S._eventsCount;else if(typeof z=="function"?z=A[C]=k?[L,z]:[z,L]:k?z.unshift(L):z.push(L),D=g(S),D>0&&z.length>D&&!z.warned){z.warned=!0;var $=new Error("Possible EventEmitter memory leak detected. "+z.length+" "+String(C)+" listeners added. Use emitter.setMaxListeners() to increase limit");$.name="MaxListenersExceededWarning",$.emitter=S,$.type=C,$.count=z.length,n($)}return S}m(x,"_addListener"),o.prototype.addListener=m(function(S,C){return x(this,S,C,!1)},"addListener"),o.prototype.on=o.prototype.addListener,o.prototype.prependListener=m(function(S,C){return x(this,S,C,!0)},"prependListener");function b(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}m(b,"onceWrapper");function y(S,C,L){var k={fired:!1,wrapFn:void 0,target:S,type:C,listener:L},D=b.bind(k);return D.listener=L,k.wrapFn=D,D}m(y,"_onceWrap"),o.prototype.once=m(function(S,C){return f(C),this.on(S,y(this,S,C)),this},"once"),o.prototype.prependOnceListener=m(function(S,C){return f(C),this.prependListener(S,y(this,S,C)),this},"prependOnceListener"),o.prototype.removeListener=m(function(S,C){var L,k,D,A,z;if(f(C),k=this._events,k===void 0)return this;if(L=k[S],L===void 0)return this;if(L===C||L.listener===C)--this._eventsCount===0?this._events=Object.create(null):(delete k[S],k.removeListener&&this.emit("removeListener",S,L.listener||C));else if(typeof L!="function"){for(D=-1,A=L.length-1;A>=0;A--)if(L[A]===C||L[A].listener===C){z=L[A].listener,D=A;break}if(D<0)return this;D===0?L.shift():w(L,D),L.length===1&&(k[S]=L[0]),k.removeListener!==void 0&&this.emit("removeListener",S,z||C)}return this},"removeListener"),o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=m(function(S){var C,L,k;if(L=this._events,L===void 0)return this;if(L.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):L[S]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete L[S]),this;if(arguments.length===0){var D=Object.keys(L),A;for(k=0;k<D.length;++k)A=D[k],A!=="removeListener"&&this.removeAllListeners(A);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(C=L[S],typeof C=="function")this.removeListener(S,C);else if(C!==void 0)for(k=C.length-1;k>=0;k--)this.removeListener(S,C[k]);return this},"removeAllListeners");function d(S,C,L){var k=S._events;if(k===void 0)return[];var D=k[C];return D===void 0?[]:typeof D=="function"?L?[D.listener||D]:[D]:L?E(D):v(D,D.length)}m(d,"_listeners"),o.prototype.listeners=m(function(S){return d(this,S,!0)},"listeners"),o.prototype.rawListeners=m(function(S){return d(this,S,!1)},"rawListeners"),o.listenerCount=function(S,C){return typeof S.listenerCount=="function"?S.listenerCount(C):p.call(S,C)},o.prototype.listenerCount=p;function p(S){var C=this._events;if(C!==void 0){var L=C[S];if(typeof L=="function")return 1;if(L!==void 0)return L.length}return 0}m(p,"listenerCount"),o.prototype.eventNames=m(function(){return this._eventsCount>0?a(this._events):[]},"eventNames");function v(S,C){for(var L=new Array(C),k=0;k<C;++k)L[k]=S[k];return L}m(v,"arrayClone");function w(S,C){for(;C+1<S.length;C++)S[C]=S[C+1];S.pop()}m(w,"spliceOne");function E(S){for(var C=new Array(S.length),L=0;L<C.length;++L)C[L]=S[L].listener||S[L];return C}m(E,"unwrapListeners");function _(S,C){return new Promise(function(L,k){function D(z){S.removeListener(C,A),k(z)}m(D,"errorListener");function A(){typeof S.removeListener=="function"&&S.removeListener("error",D),L([].slice.call(arguments))}m(A,"resolver"),R(S,C,A,{once:!0}),C!=="error"&&M(S,D,{once:!0})})}m(_,"once");function M(S,C,L){typeof S.on=="function"&&R(S,"error",C,L)}m(M,"addErrorHandlerIfEventEmitter");function R(S,C,L,k){if(typeof S.on=="function")k.once?S.once(C,L):S.on(C,L);else if(typeof S.addEventListener=="function")S.addEventListener(C,m(function D(A){k.once&&S.removeEventListener(C,D),L(A)},"wrapListener"));else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof S)}m(R,"eventTargetAgnosticAddListener")}),yi={};ke(yi,{Socket:()=>_t,isIP:()=>xi});function xi(e){return 0}var zs,ps,vt,_t,At=me(()=>{q(),zs=Ye(Xe(),1),m(xi,"isIP"),ps=/^[^.]+\./,vt=class V extends zs.EventEmitter{constructor(){super(...arguments),Q(this,"opts",{}),Q(this,"connecting",!1),Q(this,"pending",!0),Q(this,"writable",!0),Q(this,"encrypted",!1),Q(this,"authorized",!1),Q(this,"destroyed",!1),Q(this,"ws",null),Q(this,"writeBuffer"),Q(this,"tlsState",0),Q(this,"tlsRead"),Q(this,"tlsWrite")}static get poolQueryViaFetch(){return V.opts.poolQueryViaFetch??V.defaults.poolQueryViaFetch}static set poolQueryViaFetch(t){V.opts.poolQueryViaFetch=t}static get fetchEndpoint(){return V.opts.fetchEndpoint??V.defaults.fetchEndpoint}static set fetchEndpoint(t){V.opts.fetchEndpoint=t}static get fetchConnectionCache(){return!0}static set fetchConnectionCache(t){console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)")}static get fetchFunction(){return V.opts.fetchFunction??V.defaults.fetchFunction}static set fetchFunction(t){V.opts.fetchFunction=t}static get webSocketConstructor(){return V.opts.webSocketConstructor??V.defaults.webSocketConstructor}static set webSocketConstructor(t){V.opts.webSocketConstructor=t}get webSocketConstructor(){return this.opts.webSocketConstructor??V.webSocketConstructor}set webSocketConstructor(t){this.opts.webSocketConstructor=t}static get wsProxy(){return V.opts.wsProxy??V.defaults.wsProxy}static set wsProxy(t){V.opts.wsProxy=t}get wsProxy(){return this.opts.wsProxy??V.wsProxy}set wsProxy(t){this.opts.wsProxy=t}static get coalesceWrites(){return V.opts.coalesceWrites??V.defaults.coalesceWrites}static set coalesceWrites(t){V.opts.coalesceWrites=t}get coalesceWrites(){return this.opts.coalesceWrites??V.coalesceWrites}set coalesceWrites(t){this.opts.coalesceWrites=t}static get useSecureWebSocket(){return V.opts.useSecureWebSocket??V.defaults.useSecureWebSocket}static set useSecureWebSocket(t){V.opts.useSecureWebSocket=t}get useSecureWebSocket(){return this.opts.useSecureWebSocket??V.useSecureWebSocket}set useSecureWebSocket(t){this.opts.useSecureWebSocket=t}static get forceDisablePgSSL(){return V.opts.forceDisablePgSSL??V.defaults.forceDisablePgSSL}static set forceDisablePgSSL(t){V.opts.forceDisablePgSSL=t}get forceDisablePgSSL(){return this.opts.forceDisablePgSSL??V.forceDisablePgSSL}set forceDisablePgSSL(t){this.opts.forceDisablePgSSL=t}static get disableSNI(){return V.opts.disableSNI??V.defaults.disableSNI}static set disableSNI(t){V.opts.disableSNI=t}get disableSNI(){return this.opts.disableSNI??V.disableSNI}set disableSNI(t){this.opts.disableSNI=t}static get disableWarningInBrowsers(){return V.opts.disableWarningInBrowsers??V.defaults.disableWarningInBrowsers}static set disableWarningInBrowsers(t){V.opts.disableWarningInBrowsers=t}get disableWarningInBrowsers(){return this.opts.disableWarningInBrowsers??V.disableWarningInBrowsers}set disableWarningInBrowsers(t){this.opts.disableWarningInBrowsers=t}static get pipelineConnect(){return V.opts.pipelineConnect??V.defaults.pipelineConnect}static set pipelineConnect(t){V.opts.pipelineConnect=t}get pipelineConnect(){return this.opts.pipelineConnect??V.pipelineConnect}set pipelineConnect(t){this.opts.pipelineConnect=t}static get subtls(){return V.opts.subtls??V.defaults.subtls}static set subtls(t){V.opts.subtls=t}get subtls(){return this.opts.subtls??V.subtls}set subtls(t){this.opts.subtls=t}static get pipelineTLS(){return V.opts.pipelineTLS??V.defaults.pipelineTLS}static set pipelineTLS(t){V.opts.pipelineTLS=t}get pipelineTLS(){return this.opts.pipelineTLS??V.pipelineTLS}set pipelineTLS(t){this.opts.pipelineTLS=t}static get rootCerts(){return V.opts.rootCerts??V.defaults.rootCerts}static set rootCerts(t){V.opts.rootCerts=t}get rootCerts(){return this.opts.rootCerts??V.rootCerts}set rootCerts(t){this.opts.rootCerts=t}wsProxyAddrForHost(t,s){let r=this.wsProxy;if(r===void 0)throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");return typeof r=="function"?r(t,s):`${r}?address=${t}:${s}`}setNoDelay(){return this}setKeepAlive(){return this}ref(){return this}unref(){return this}connect(t,s,r){this.connecting=!0,r&&this.once("connect",r);let a=m(()=>{this.connecting=!1,this.pending=!1,this.emit("connect"),this.emit("ready")},"handleWebSocketOpen"),n=m((o,u=!1)=>{o.binaryType="arraybuffer",o.addEventListener("error",f=>{this.emit("error",f),this.emit("close")}),o.addEventListener("message",f=>{if(this.tlsState===0){let g=W.from(f.data);this.emit("data",g)}}),o.addEventListener("close",()=>{this.emit("close")}),u?a():o.addEventListener("open",a)},"configureWebSocket"),l;try{l=this.wsProxyAddrForHost(s,typeof t=="string"?parseInt(t,10):t)}catch(o){this.emit("error",o),this.emit("close");return}try{let o=(this.useSecureWebSocket?"wss:":"ws:")+"//"+l;if(this.webSocketConstructor!==void 0)this.ws=new this.webSocketConstructor(o),n(this.ws);else try{this.ws=new WebSocket(o),n(this.ws)}catch{this.ws=new __unstable_WebSocket(o),n(this.ws)}}catch(o){let u=(this.useSecureWebSocket?"https:":"http:")+"//"+l;fetch(u,{headers:{Upgrade:"websocket"}}).then(f=>{if(this.ws=f.webSocket,this.ws==null)throw o;this.ws.accept(),n(this.ws,!0)}).catch(f=>{this.emit("error",new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${f}`)),this.emit("close")})}}async startTls(t){if(this.subtls===void 0)throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");this.tlsState=1;let s=await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts),r=new this.subtls.WebSocketReadQueue(this.ws),a=r.read.bind(r),n=this.rawWrite.bind(this),{read:l,write:o}=await this.subtls.startTls(t,s,a,n,{useSNI:!this.disableSNI,expectPreData:this.pipelineTLS?new Uint8Array([83]):void 0});this.tlsRead=l,this.tlsWrite=o,this.tlsState=2,this.encrypted=!0,this.authorized=!0,this.emit("secureConnection",this),this.tlsReadLoop()}async tlsReadLoop(){for(;;){let t=await this.tlsRead();if(t===void 0)break;{let s=W.from(t);this.emit("data",s)}}}rawWrite(t){if(!this.coalesceWrites){this.ws&&this.ws.send(t);return}if(this.writeBuffer===void 0)this.writeBuffer=t,setTimeout(()=>{this.ws&&this.ws.send(this.writeBuffer),this.writeBuffer=void 0},0);else{let s=new Uint8Array(this.writeBuffer.length+t.length);s.set(this.writeBuffer),s.set(t,this.writeBuffer.length),this.writeBuffer=s}}write(t,s="utf8",r=a=>{}){return t.length===0?(r(),!0):(typeof t=="string"&&(t=W.from(t,s)),this.tlsState===0?(this.rawWrite(t),r()):this.tlsState===1?this.once("secureConnection",()=>{this.write(t,s,r)}):(this.tlsWrite(t),r()),!0)}end(t=W.alloc(0),s="utf8",r=()=>{}){return this.write(t,s,()=>{this.ws.close(),r()}),this}destroy(){return this.destroyed=!0,this.end()}},m(vt,"Socket"),Q(vt,"defaults",{poolQueryViaFetch:!1,fetchEndpoint:m((e,t,s)=>{let r;return s!=null&&s.jwtAuth?r=e.replace(ps,"apiauth."):r=e.replace(ps,"api."),"https://"+r+"/sql"},"fetchEndpoint"),fetchConnectionCache:!0,fetchFunction:void 0,webSocketConstructor:void 0,wsProxy:m(e=>e+"/v2","wsProxy"),useSecureWebSocket:!0,forceDisablePgSSL:!0,coalesceWrites:!0,pipelineConnect:"password",subtls:void 0,rootCerts:"",pipelineTLS:!1,disableSNI:!1,disableWarningInBrowsers:!1}),Q(vt,"opts",{}),_t=vt}),wi={};ke(wi,{parse:()=>ys});function ys(e,t=!1){let{protocol:s}=new URL(e),r="http:"+e.substring(s.length),{username:a,password:n,host:l,hostname:o,port:u,pathname:f,search:g,searchParams:x,hash:b}=new URL(r);n=decodeURIComponent(n),a=decodeURIComponent(a),f=decodeURIComponent(f);let y=a+":"+n,d=t?Object.fromEntries(x.entries()):g;return{href:e,protocol:s,auth:y,username:a,password:n,host:l,hostname:o,port:u,pathname:f,search:g,query:d,hash:b}}var Ei=me(()=>{q(),m(ys,"parse")}),_i=Z(e=>{q(),e.parse=function(a,n){return new s(a,n).parse()};var t=class Si{constructor(n,l){this.source=n,this.transform=l||r,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var n=this.source[this.position++];return n==="\\"?{value:this.source[this.position++],escaped:!0}:{value:n,escaped:!1}}record(n){this.recorded.push(n)}newEntry(n){var l;(this.recorded.length>0||n)&&(l=this.recorded.join(""),l==="NULL"&&!n&&(l=null),l!==null&&(l=this.transform(l)),this.entries.push(l),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var n=this.nextCharacter();if(n.value==="=")break}}parse(n){var l,o,u;for(this.consumeDimensions();!this.isEof();)if(l=this.nextCharacter(),l.value==="{"&&!u)this.dimension++,this.dimension>1&&(o=new Si(this.source.substr(this.position-1),this.transform),this.entries.push(o.parse(!0)),this.position+=o.position-2);else if(l.value==="}"&&!u){if(this.dimension--,!this.dimension&&(this.newEntry(),n))return this.entries}else l.value==='"'&&!l.escaped?(u&&this.newEntry(!0),u=!u):l.value===","&&!u?this.newEntry():this.record(l.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}};m(t,"ArrayParser");var s=t;function r(a){return a}m(r,"identity")}),ki=Z((e,t)=>{q();var s=_i();t.exports={create:m(function(r,a){return{parse:m(function(){return s.parse(r,a)},"parse")}},"create")}}),ua=Z((e,t)=>{q();var s=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,r=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,a=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,n=/^-?infinity$/;t.exports=m(function(g){if(n.test(g))return Number(g.replace("i","I"));var x=s.exec(g);if(!x)return l(g)||null;var b=!!x[8],y=parseInt(x[1],10);b&&(y=u(y));var d=parseInt(x[2],10)-1,p=x[3],v=parseInt(x[4],10),w=parseInt(x[5],10),E=parseInt(x[6],10),_=x[7];_=_?1e3*parseFloat(_):0;var M,R=o(g);return R!=null?(M=new Date(Date.UTC(y,d,p,v,w,E,_)),f(y)&&M.setUTCFullYear(y),R!==0&&M.setTime(M.getTime()-R)):(M=new Date(y,d,p,v,w,E,_),f(y)&&M.setFullYear(y)),M},"parseDate");function l(g){var x=r.exec(g);if(x){var b=parseInt(x[1],10),y=!!x[4];y&&(b=u(b));var d=parseInt(x[2],10)-1,p=x[3],v=new Date(b,d,p);return f(b)&&v.setFullYear(b),v}}m(l,"getDate");function o(g){if(g.endsWith("+00"))return 0;var x=a.exec(g.split(" ")[1]);if(x){var b=x[1];if(b==="Z")return 0;var y=b==="-"?-1:1,d=parseInt(x[2],10)*3600+parseInt(x[3]||0,10)*60+parseInt(x[4]||0,10);return d*y*1e3}}m(o,"timeZoneOffset");function u(g){return-(g-1)}m(u,"bcYearToNegativeYear");function f(g){return g>=0&&g<100}m(f,"is0To99")}),ha=Z((e,t)=>{q(),t.exports=r;var s=Object.prototype.hasOwnProperty;function r(a){for(var n=1;n<arguments.length;n++){var l=arguments[n];for(var o in l)s.call(l,o)&&(a[o]=l[o])}return a}m(r,"extend")}),fa=Z((e,t)=>{q();var s=ha();t.exports=r;function r(E){if(!(this instanceof r))return new r(E);s(this,w(E))}m(r,"PostgresInterval");var a=["seconds","minutes","hours","days","months","years"];r.prototype.toPostgres=function(){var E=a.filter(this.hasOwnProperty,this);return this.milliseconds&&E.indexOf("seconds")<0&&E.push("seconds"),E.length===0?"0":E.map(function(_){var M=this[_]||0;return _==="seconds"&&this.milliseconds&&(M=(M+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),M+" "+_},this).join(" ")};var n={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},l=["years","months","days"],o=["hours","minutes","seconds"];r.prototype.toISOString=r.prototype.toISO=function(){var E=l.map(M,this).join(""),_=o.map(M,this).join("");return"P"+E+"T"+_;function M(R){var S=this[R]||0;return R==="seconds"&&this.milliseconds&&(S=(S+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),S+n[R]}};var u="([+-]?\\d+)",f=u+"\\s+years?",g=u+"\\s+mons?",x=u+"\\s+days?",b="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",y=new RegExp([f,g,x,b].map(function(E){return"("+E+")?"}).join("\\s*")),d={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},p=["hours","minutes","seconds","milliseconds"];function v(E){var _=E+"000000".slice(E.length);return parseInt(_,10)/1e3}m(v,"parseMilliseconds");function w(E){if(!E)return{};var _=y.exec(E),M=_[8]==="-";return Object.keys(d).reduce(function(R,S){var C=d[S],L=_[C];return!L||(L=S==="milliseconds"?v(L):parseInt(L,10),!L)||(M&&~p.indexOf(S)&&(L*=-1),R[S]=L),R},{})}m(w,"parse")}),ga=Z((e,t)=>{q(),t.exports=m(function(s){if(/^\\x/.test(s))return new W(s.substr(2),"hex");for(var r="",a=0;a<s.length;)if(s[a]!=="\\")r+=s[a],++a;else if(/[0-7]{3}/.test(s.substr(a+1,3)))r+=String.fromCharCode(parseInt(s.substr(a+1,3),8)),a+=4;else{for(var n=1;a+n<s.length&&s[a+n]==="\\";)n++;for(var l=0;l<Math.floor(n/2);++l)r+="\\";a+=Math.floor(n/2)*2}return new W(r,"binary")},"parseBytea")}),ma=Z((e,t)=>{q();var s=_i(),r=ki(),a=ua(),n=fa(),l=ga();function o(k){return m(function(D){return D===null?D:k(D)},"nullAllowed")}m(o,"allowNull");function u(k){return k===null?k:k==="TRUE"||k==="t"||k==="true"||k==="y"||k==="yes"||k==="on"||k==="1"}m(u,"parseBool");function f(k){return k?s.parse(k,u):null}m(f,"parseBoolArray");function g(k){return parseInt(k,10)}m(g,"parseBaseTenInt");function x(k){return k?s.parse(k,o(g)):null}m(x,"parseIntegerArray");function b(k){return k?s.parse(k,o(function(D){return M(D).trim()})):null}m(b,"parseBigIntegerArray");var y=m(function(k){if(!k)return null;var D=r.create(k,function(A){return A!==null&&(A=S(A)),A});return D.parse()},"parsePointArray"),d=m(function(k){if(!k)return null;var D=r.create(k,function(A){return A!==null&&(A=parseFloat(A)),A});return D.parse()},"parseFloatArray"),p=m(function(k){if(!k)return null;var D=r.create(k);return D.parse()},"parseStringArray"),v=m(function(k){if(!k)return null;var D=r.create(k,function(A){return A!==null&&(A=a(A)),A});return D.parse()},"parseDateArray"),w=m(function(k){if(!k)return null;var D=r.create(k,function(A){return A!==null&&(A=n(A)),A});return D.parse()},"parseIntervalArray"),E=m(function(k){return k?s.parse(k,o(l)):null},"parseByteAArray"),_=m(function(k){return parseInt(k,10)},"parseInteger"),M=m(function(k){var D=String(k);return/^\d+$/.test(D)?D:k},"parseBigInteger"),R=m(function(k){return k?s.parse(k,o(JSON.parse)):null},"parseJsonArray"),S=m(function(k){return k[0]!=="("?null:(k=k.substring(1,k.length-1).split(","),{x:parseFloat(k[0]),y:parseFloat(k[1])})},"parsePoint"),C=m(function(k){if(k[0]!=="<"&&k[1]!=="(")return null;for(var D="(",A="",z=!1,$=2;$<k.length-1;$++){if(z||(D+=k[$]),k[$]===")"){z=!0;continue}else if(!z)continue;k[$]!==","&&(A+=k[$])}var B=S(D);return B.radius=parseFloat(A),B},"parseCircle"),L=m(function(k){k(20,M),k(21,_),k(23,_),k(26,_),k(700,parseFloat),k(701,parseFloat),k(16,u),k(1082,a),k(1114,a),k(1184,a),k(600,S),k(651,p),k(718,C),k(1e3,f),k(1001,E),k(1005,x),k(1007,x),k(1028,x),k(1016,b),k(1017,y),k(1021,d),k(1022,d),k(1231,d),k(1014,p),k(1015,p),k(1008,p),k(1009,p),k(1040,p),k(1041,p),k(1115,v),k(1182,v),k(1185,v),k(1186,n),k(1187,w),k(17,l),k(114,JSON.parse.bind(JSON)),k(3802,JSON.parse.bind(JSON)),k(199,R),k(3807,R),k(3907,p),k(2951,p),k(791,p),k(1183,p),k(1270,p)},"init");t.exports={init:L}}),ba=Z((e,t)=>{q();var s=1e6;function r(a){var n=a.readInt32BE(0),l=a.readUInt32BE(4),o="";n<0&&(n=~n+(l===0),l=~l+1>>>0,o="-");var u="",f,g,x,b,y,d;{if(f=n%s,n=n/s>>>0,g=4294967296*f+l,l=g/s>>>0,x=""+(g-s*l),l===0&&n===0)return o+x+u;for(b="",y=6-x.length,d=0;d<y;d++)b+="0";u=b+x+u}{if(f=n%s,n=n/s>>>0,g=4294967296*f+l,l=g/s>>>0,x=""+(g-s*l),l===0&&n===0)return o+x+u;for(b="",y=6-x.length,d=0;d<y;d++)b+="0";u=b+x+u}{if(f=n%s,n=n/s>>>0,g=4294967296*f+l,l=g/s>>>0,x=""+(g-s*l),l===0&&n===0)return o+x+u;for(b="",y=6-x.length,d=0;d<y;d++)b+="0";u=b+x+u}return f=n%s,g=4294967296*f+l,x=""+g%s,o+x+u}m(r,"readInt8"),t.exports=r}),va=Z((e,t)=>{q();var s=ba(),r=m(function(p,v,w,E,_){w=w||0,E=E||!1,_=_||function(z,$,B){return z*Math.pow(2,B)+$};var M=w>>3,R=m(function(z){return E?~z&255:z},"inv"),S=255,C=8-w%8;v<C&&(S=255<<8-v&255,C=v),w&&(S=S>>w%8);var L=0;w%8+v>=8&&(L=_(0,R(p[M])&S,C));for(var k=v+w>>3,D=M+1;D<k;D++)L=_(L,R(p[D]),8);var A=(v+w)%8;return A>0&&(L=_(L,R(p[k])>>8-A,A)),L},"parseBits"),a=m(function(p,v,w){var E=Math.pow(2,w-1)-1,_=r(p,1),M=r(p,w,1);if(M===0)return 0;var R=1,S=m(function(L,k,D){L===0&&(L=1);for(var A=1;A<=D;A++)R/=2,(k&1<<D-A)>0&&(L+=R);return L},"parsePrecisionBits"),C=r(p,v,w+1,!1,S);return M==Math.pow(2,w+1)-1?C===0?_===0?1/0:-1/0:NaN:(_===0?1:-1)*Math.pow(2,M-E)*C},"parseFloatFromBits"),n=m(function(p){return r(p,1)==1?-1*(r(p,15,1,!0)+1):r(p,15,1)},"parseInt16"),l=m(function(p){return r(p,1)==1?-1*(r(p,31,1,!0)+1):r(p,31,1)},"parseInt32"),o=m(function(p){return a(p,23,8)},"parseFloat32"),u=m(function(p){return a(p,52,11)},"parseFloat64"),f=m(function(p){var v=r(p,16,32);if(v==49152)return NaN;for(var w=Math.pow(1e4,r(p,16,16)),E=0,_=[],M=r(p,16),R=0;R<M;R++)E+=r(p,16,64+16*R)*w,w/=1e4;var S=Math.pow(10,r(p,16,48));return(v===0?1:-1)*Math.round(E*S)/S},"parseNumeric"),g=m(function(p,v){var w=r(v,1),E=r(v,63,1),_=new Date((w===0?1:-1)*E/1e3+9466848e5);return p||_.setTime(_.getTime()+_.getTimezoneOffset()*6e4),_.usec=E%1e3,_.getMicroSeconds=function(){return this.usec},_.setMicroSeconds=function(M){this.usec=M},_.getUTCMicroSeconds=function(){return this.usec},_},"parseDate"),x=m(function(p){for(var v=r(p,32),w=r(p,32,32),E=r(p,32,64),_=96,M=[],R=0;R<v;R++)M[R]=r(p,32,_),_+=32,_+=32;var S=m(function(L){var k=r(p,32,_);if(_+=32,k==4294967295)return null;var D;if(L==23||L==20)return D=r(p,k*8,_),_+=k*8,D;if(L==25)return D=p.toString(this.encoding,_>>3,(_+=k<<3)>>3),D;console.log("ERROR: ElementType not implemented: "+L)},"parseElement"),C=m(function(L,k){var D=[],A;if(L.length>1){var z=L.shift();for(A=0;A<z;A++)D[A]=C(L,k);L.unshift(z)}else for(A=0;A<L[0];A++)D[A]=S(k);return D},"parse");return C(M,E)},"parseArray"),b=m(function(p){return p.toString("utf8")},"parseText"),y=m(function(p){return p===null?null:r(p,8)>0},"parseBool"),d=m(function(p){p(20,s),p(21,n),p(23,l),p(26,l),p(1700,f),p(700,o),p(701,u),p(16,y),p(1114,g.bind(null,!1)),p(1184,g.bind(null,!0)),p(1e3,x),p(1007,x),p(1016,x),p(1008,x),p(1009,x),p(25,b)},"init");t.exports={init:d}}),ya=Z((e,t)=>{q(),t.exports={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}}),Yt=Z(e=>{q();var t=ma(),s=va(),r=ki(),a=ya();e.getTypeParser=o,e.setTypeParser=u,e.arrayParser=r,e.builtins=a;var n={text:{},binary:{}};function l(f){return String(f)}m(l,"noParse");function o(f,g){return g=g||"text",n[g]&&n[g][f]||l}m(o,"getTypeParser");function u(f,g,x){typeof g=="function"&&(x=g,g="text"),n[g][f]=x}m(u,"setTypeParser"),t.init(function(f,g){n.text[f]=g}),s.init(function(f,g){n.binary[f]=g})}),xs=Z((e,t)=>{q();var s=Yt();function r(a){this._types=a||s,this.text={},this.binary={}}m(r,"TypeOverrides"),r.prototype.getOverrides=function(a){switch(a){case"text":return this.text;case"binary":return this.binary;default:return{}}},r.prototype.setTypeParser=function(a,n,l){typeof n=="function"&&(l=n,n="text"),this.getOverrides(n)[a]=l},r.prototype.getTypeParser=function(a,n){return n=n||"text",this.getOverrides(n)[a]||this._types.getTypeParser(a,n)},t.exports=r});function Et(e){let t=1779033703,s=3144134277,r=1013904242,a=2773480762,n=1359893119,l=2600822924,o=528734635,u=1541459225,f=0,g=0,x=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],b=m((E,_)=>E>>>_|E<<32-_,"rrot"),y=new Uint32Array(64),d=new Uint8Array(64),p=m(()=>{for(let D=0,A=0;D<16;D++,A+=4)y[D]=d[A]<<24|d[A+1]<<16|d[A+2]<<8|d[A+3];for(let D=16;D<64;D++){let A=b(y[D-15],7)^b(y[D-15],18)^y[D-15]>>>3,z=b(y[D-2],17)^b(y[D-2],19)^y[D-2]>>>10;y[D]=y[D-16]+A+y[D-7]+z|0}let E=t,_=s,M=r,R=a,S=n,C=l,L=o,k=u;for(let D=0;D<64;D++){let A=b(S,6)^b(S,11)^b(S,25),z=S&C^~S&L,$=k+A+z+x[D]+y[D]|0,B=b(E,2)^b(E,13)^b(E,22),U=E&_^E&M^_&M,H=B+U|0;k=L,L=C,C=S,S=R+$|0,R=M,M=_,_=E,E=$+H|0}t=t+E|0,s=s+_|0,r=r+M|0,a=a+R|0,n=n+S|0,l=l+C|0,o=o+L|0,u=u+k|0,g=0},"process"),v=m(E=>{typeof E=="string"&&(E=new TextEncoder().encode(E));for(let _=0;_<E.length;_++)d[g++]=E[_],g===64&&p();f+=E.length},"add"),w=m(()=>{if(d[g++]=128,g==64&&p(),g+8>64){for(;g<64;)d[g++]=0;p()}for(;g<58;)d[g++]=0;let E=f*8;d[g++]=E/1099511627776&255,d[g++]=E/4294967296&255,d[g++]=E>>>24,d[g++]=E>>>16&255,d[g++]=E>>>8&255,d[g++]=E&255,p();let _=new Uint8Array(32);return _[0]=t>>>24,_[1]=t>>>16&255,_[2]=t>>>8&255,_[3]=t&255,_[4]=s>>>24,_[5]=s>>>16&255,_[6]=s>>>8&255,_[7]=s&255,_[8]=r>>>24,_[9]=r>>>16&255,_[10]=r>>>8&255,_[11]=r&255,_[12]=a>>>24,_[13]=a>>>16&255,_[14]=a>>>8&255,_[15]=a&255,_[16]=n>>>24,_[17]=n>>>16&255,_[18]=n>>>8&255,_[19]=n&255,_[20]=l>>>24,_[21]=l>>>16&255,_[22]=l>>>8&255,_[23]=l&255,_[24]=o>>>24,_[25]=o>>>16&255,_[26]=o>>>8&255,_[27]=o&255,_[28]=u>>>24,_[29]=u>>>16&255,_[30]=u>>>8&255,_[31]=u&255,_},"digest");return e===void 0?{add:v,digest:w}:(v(e),w())}var xa=me(()=>{q(),m(Et,"sha256")}),Ie,fs,wa=me(()=>{q(),Ie=class ye{constructor(){Q(this,"_dataLength",0),Q(this,"_bufferLength",0),Q(this,"_state",new Int32Array(4)),Q(this,"_buffer",new ArrayBuffer(68)),Q(this,"_buffer8"),Q(this,"_buffer32"),this._buffer8=new Uint8Array(this._buffer,0,68),this._buffer32=new Uint32Array(this._buffer,0,17),this.start()}static hashByteArray(t,s=!1){return this.onePassHasher.start().appendByteArray(t).end(s)}static hashStr(t,s=!1){return this.onePassHasher.start().appendStr(t).end(s)}static hashAsciiStr(t,s=!1){return this.onePassHasher.start().appendAsciiStr(t).end(s)}static _hex(t){let s=ye.hexChars,r=ye.hexOut,a,n,l,o;for(o=0;o<4;o+=1)for(n=o*8,a=t[o],l=0;l<8;l+=2)r[n+1+l]=s.charAt(a&15),a>>>=4,r[n+0+l]=s.charAt(a&15),a>>>=4;return r.join("")}static _md5cycle(t,s){let r=t[0],a=t[1],n=t[2],l=t[3];r+=(a&n|~a&l)+s[0]-680876936|0,r=(r<<7|r>>>25)+a|0,l+=(r&a|~r&n)+s[1]-389564586|0,l=(l<<12|l>>>20)+r|0,n+=(l&r|~l&a)+s[2]+606105819|0,n=(n<<17|n>>>15)+l|0,a+=(n&l|~n&r)+s[3]-1044525330|0,a=(a<<22|a>>>10)+n|0,r+=(a&n|~a&l)+s[4]-176418897|0,r=(r<<7|r>>>25)+a|0,l+=(r&a|~r&n)+s[5]+1200080426|0,l=(l<<12|l>>>20)+r|0,n+=(l&r|~l&a)+s[6]-1473231341|0,n=(n<<17|n>>>15)+l|0,a+=(n&l|~n&r)+s[7]-45705983|0,a=(a<<22|a>>>10)+n|0,r+=(a&n|~a&l)+s[8]+1770035416|0,r=(r<<7|r>>>25)+a|0,l+=(r&a|~r&n)+s[9]-1958414417|0,l=(l<<12|l>>>20)+r|0,n+=(l&r|~l&a)+s[10]-42063|0,n=(n<<17|n>>>15)+l|0,a+=(n&l|~n&r)+s[11]-1990404162|0,a=(a<<22|a>>>10)+n|0,r+=(a&n|~a&l)+s[12]+1804603682|0,r=(r<<7|r>>>25)+a|0,l+=(r&a|~r&n)+s[13]-40341101|0,l=(l<<12|l>>>20)+r|0,n+=(l&r|~l&a)+s[14]-1502002290|0,n=(n<<17|n>>>15)+l|0,a+=(n&l|~n&r)+s[15]+1236535329|0,a=(a<<22|a>>>10)+n|0,r+=(a&l|n&~l)+s[1]-165796510|0,r=(r<<5|r>>>27)+a|0,l+=(r&n|a&~n)+s[6]-1069501632|0,l=(l<<9|l>>>23)+r|0,n+=(l&a|r&~a)+s[11]+643717713|0,n=(n<<14|n>>>18)+l|0,a+=(n&r|l&~r)+s[0]-373897302|0,a=(a<<20|a>>>12)+n|0,r+=(a&l|n&~l)+s[5]-701558691|0,r=(r<<5|r>>>27)+a|0,l+=(r&n|a&~n)+s[10]+38016083|0,l=(l<<9|l>>>23)+r|0,n+=(l&a|r&~a)+s[15]-660478335|0,n=(n<<14|n>>>18)+l|0,a+=(n&r|l&~r)+s[4]-405537848|0,a=(a<<20|a>>>12)+n|0,r+=(a&l|n&~l)+s[9]+568446438|0,r=(r<<5|r>>>27)+a|0,l+=(r&n|a&~n)+s[14]-1019803690|0,l=(l<<9|l>>>23)+r|0,n+=(l&a|r&~a)+s[3]-187363961|0,n=(n<<14|n>>>18)+l|0,a+=(n&r|l&~r)+s[8]+1163531501|0,a=(a<<20|a>>>12)+n|0,r+=(a&l|n&~l)+s[13]-1444681467|0,r=(r<<5|r>>>27)+a|0,l+=(r&n|a&~n)+s[2]-51403784|0,l=(l<<9|l>>>23)+r|0,n+=(l&a|r&~a)+s[7]+1735328473|0,n=(n<<14|n>>>18)+l|0,a+=(n&r|l&~r)+s[12]-1926607734|0,a=(a<<20|a>>>12)+n|0,r+=(a^n^l)+s[5]-378558|0,r=(r<<4|r>>>28)+a|0,l+=(r^a^n)+s[8]-2022574463|0,l=(l<<11|l>>>21)+r|0,n+=(l^r^a)+s[11]+1839030562|0,n=(n<<16|n>>>16)+l|0,a+=(n^l^r)+s[14]-35309556|0,a=(a<<23|a>>>9)+n|0,r+=(a^n^l)+s[1]-1530992060|0,r=(r<<4|r>>>28)+a|0,l+=(r^a^n)+s[4]+1272893353|0,l=(l<<11|l>>>21)+r|0,n+=(l^r^a)+s[7]-155497632|0,n=(n<<16|n>>>16)+l|0,a+=(n^l^r)+s[10]-1094730640|0,a=(a<<23|a>>>9)+n|0,r+=(a^n^l)+s[13]+681279174|0,r=(r<<4|r>>>28)+a|0,l+=(r^a^n)+s[0]-358537222|0,l=(l<<11|l>>>21)+r|0,n+=(l^r^a)+s[3]-722521979|0,n=(n<<16|n>>>16)+l|0,a+=(n^l^r)+s[6]+76029189|0,a=(a<<23|a>>>9)+n|0,r+=(a^n^l)+s[9]-640364487|0,r=(r<<4|r>>>28)+a|0,l+=(r^a^n)+s[12]-421815835|0,l=(l<<11|l>>>21)+r|0,n+=(l^r^a)+s[15]+530742520|0,n=(n<<16|n>>>16)+l|0,a+=(n^l^r)+s[2]-995338651|0,a=(a<<23|a>>>9)+n|0,r+=(n^(a|~l))+s[0]-198630844|0,r=(r<<6|r>>>26)+a|0,l+=(a^(r|~n))+s[7]+1126891415|0,l=(l<<10|l>>>22)+r|0,n+=(r^(l|~a))+s[14]-1416354905|0,n=(n<<15|n>>>17)+l|0,a+=(l^(n|~r))+s[5]-57434055|0,a=(a<<21|a>>>11)+n|0,r+=(n^(a|~l))+s[12]+1700485571|0,r=(r<<6|r>>>26)+a|0,l+=(a^(r|~n))+s[3]-1894986606|0,l=(l<<10|l>>>22)+r|0,n+=(r^(l|~a))+s[10]-1051523|0,n=(n<<15|n>>>17)+l|0,a+=(l^(n|~r))+s[1]-2054922799|0,a=(a<<21|a>>>11)+n|0,r+=(n^(a|~l))+s[8]+1873313359|0,r=(r<<6|r>>>26)+a|0,l+=(a^(r|~n))+s[15]-30611744|0,l=(l<<10|l>>>22)+r|0,n+=(r^(l|~a))+s[6]-1560198380|0,n=(n<<15|n>>>17)+l|0,a+=(l^(n|~r))+s[13]+1309151649|0,a=(a<<21|a>>>11)+n|0,r+=(n^(a|~l))+s[4]-145523070|0,r=(r<<6|r>>>26)+a|0,l+=(a^(r|~n))+s[11]-1120210379|0,l=(l<<10|l>>>22)+r|0,n+=(r^(l|~a))+s[2]+718787259|0,n=(n<<15|n>>>17)+l|0,a+=(l^(n|~r))+s[9]-343485551|0,a=(a<<21|a>>>11)+n|0,t[0]=r+t[0]|0,t[1]=a+t[1]|0,t[2]=n+t[2]|0,t[3]=l+t[3]|0}start(){return this._dataLength=0,this._bufferLength=0,this._state.set(ye.stateIdentity),this}appendStr(t){let s=this._buffer8,r=this._buffer32,a=this._bufferLength,n,l;for(l=0;l<t.length;l+=1){if(n=t.charCodeAt(l),n<128)s[a++]=n;else if(n<2048)s[a++]=(n>>>6)+192,s[a++]=n&63|128;else if(n<55296||n>56319)s[a++]=(n>>>12)+224,s[a++]=n>>>6&63|128,s[a++]=n&63|128;else{if(n=(n-55296)*1024+(t.charCodeAt(++l)-56320)+65536,n>1114111)throw new Error("Unicode standard supports code points up to U+10FFFF");s[a++]=(n>>>18)+240,s[a++]=n>>>12&63|128,s[a++]=n>>>6&63|128,s[a++]=n&63|128}a>=64&&(this._dataLength+=64,ye._md5cycle(this._state,r),a-=64,r[0]=r[16])}return this._bufferLength=a,this}appendAsciiStr(t){let s=this._buffer8,r=this._buffer32,a=this._bufferLength,n,l=0;for(;;){for(n=Math.min(t.length-l,64-a);n--;)s[a++]=t.charCodeAt(l++);if(a<64)break;this._dataLength+=64,ye._md5cycle(this._state,r),a=0}return this._bufferLength=a,this}appendByteArray(t){let s=this._buffer8,r=this._buffer32,a=this._bufferLength,n,l=0;for(;;){for(n=Math.min(t.length-l,64-a);n--;)s[a++]=t[l++];if(a<64)break;this._dataLength+=64,ye._md5cycle(this._state,r),a=0}return this._bufferLength=a,this}getState(){let t=this._state;return{buffer:String.fromCharCode.apply(null,Array.from(this._buffer8)),buflen:this._bufferLength,length:this._dataLength,state:[t[0],t[1],t[2],t[3]]}}setState(t){let s=t.buffer,r=t.state,a=this._state,n;for(this._dataLength=t.length,this._bufferLength=t.buflen,a[0]=r[0],a[1]=r[1],a[2]=r[2],a[3]=r[3],n=0;n<s.length;n+=1)this._buffer8[n]=s.charCodeAt(n)}end(t=!1){let s=this._bufferLength,r=this._buffer8,a=this._buffer32,n=(s>>2)+1;this._dataLength+=s;let l=this._dataLength*8;if(r[s]=128,r[s+1]=r[s+2]=r[s+3]=0,a.set(ye.buffer32Identity.subarray(n),n),s>55&&(ye._md5cycle(this._state,a),a.set(ye.buffer32Identity)),l<=4294967295)a[14]=l;else{let o=l.toString(16).match(/(.*?)(.{0,8})$/);if(o===null)return;let u=parseInt(o[2],16),f=parseInt(o[1],16)||0;a[14]=u,a[15]=f}return ye._md5cycle(this._state,a),t?this._state:ye._hex(this._state)}},m(Ie,"Md5"),Q(Ie,"stateIdentity",new Int32Array([1732584193,-271733879,-1732584194,271733878])),Q(Ie,"buffer32Identity",new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])),Q(Ie,"hexChars","0123456789abcdef"),Q(Ie,"hexOut",[]),Q(Ie,"onePassHasher",new Ie),fs=Ie}),ws={};ke(ws,{createHash:()=>Ii,createHmac:()=>Ci,randomBytes:()=>Ti});function Ti(e){return crypto.getRandomValues(W.alloc(e))}function Ii(e){if(e==="sha256")return{update:m(function(t){return{digest:m(function(){return W.from(Et(t))},"digest")}},"update")};if(e==="md5")return{update:m(function(t){return{digest:m(function(){return typeof t=="string"?fs.hashStr(t):fs.hashByteArray(t)},"digest")}},"update")};throw new Error(`Hash type '${e}' not supported`)}function Ci(e,t){if(e!=="sha256")throw new Error(`Only sha256 is supported (requested: '${e}')`);return{update:m(function(s){return{digest:m(function(){typeof t=="string"&&(t=new TextEncoder().encode(t)),typeof s=="string"&&(s=new TextEncoder().encode(s));let r=t.length;if(r>64)t=Et(t);else if(r<64){let u=new Uint8Array(64);u.set(t),t=u}let a=new Uint8Array(64),n=new Uint8Array(64);for(let u=0;u<64;u++)a[u]=54^t[u],n[u]=92^t[u];let l=new Uint8Array(s.length+64);l.set(a,0),l.set(s,64);let o=new Uint8Array(96);return o.set(n,0),o.set(Et(l),64),W.from(Et(o))},"digest")}},"update")}}var Li=me(()=>{q(),xa(),wa(),m(Ti,"randomBytes"),m(Ii,"createHash"),m(Ci,"createHmac")}),Xt=Z((e,t)=>{q(),t.exports={host:"localhost",user:J.platform==="win32"?J.env.USERNAME:J.env.USER,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};var s=Yt(),r=s.getTypeParser(20,"text"),a=s.getTypeParser(1016,"text");t.exports.__defineSetter__("parseInt8",function(n){s.setTypeParser(20,"text",n?s.getTypeParser(23,"text"):r),s.setTypeParser(1016,"text",n?s.getTypeParser(1007,"text"):a)})}),Kt=Z((e,t)=>{q();var s=(Li(),ue(ws)),r=Xt();function a(d){var p=d.replace(/\\/g,"\\\\").replace(/"/g,'\\"');return'"'+p+'"'}m(a,"escapeElement");function n(d){for(var p="{",v=0;v<d.length;v++)v>0&&(p=p+","),d[v]===null||typeof d[v]>"u"?p=p+"NULL":Array.isArray(d[v])?p=p+n(d[v]):d[v]instanceof W?p+="\\\\x"+d[v].toString("hex"):p+=a(l(d[v]));return p=p+"}",p}m(n,"arrayString");var l=m(function(d,p){if(d==null)return null;if(d instanceof W)return d;if(ArrayBuffer.isView(d)){var v=W.from(d.buffer,d.byteOffset,d.byteLength);return v.length===d.byteLength?v:v.slice(d.byteOffset,d.byteOffset+d.byteLength)}return d instanceof Date?r.parseInputDatesAsUTC?g(d):f(d):Array.isArray(d)?n(d):typeof d=="object"?o(d,p):d.toString()},"prepareValue");function o(d,p){if(d&&typeof d.toPostgres=="function"){if(p=p||[],p.indexOf(d)!==-1)throw new Error('circular reference detected while preparing "'+d+'" for query');return p.push(d),l(d.toPostgres(l),p)}return JSON.stringify(d)}m(o,"prepareObject");function u(d,p){for(d=""+d;d.length<p;)d="0"+d;return d}m(u,"pad");function f(d){var p=-d.getTimezoneOffset(),v=d.getFullYear(),w=v<1;w&&(v=Math.abs(v)+1);var E=u(v,4)+"-"+u(d.getMonth()+1,2)+"-"+u(d.getDate(),2)+"T"+u(d.getHours(),2)+":"+u(d.getMinutes(),2)+":"+u(d.getSeconds(),2)+"."+u(d.getMilliseconds(),3);return p<0?(E+="-",p*=-1):E+="+",E+=u(Math.floor(p/60),2)+":"+u(p%60,2),w&&(E+=" BC"),E}m(f,"dateToString");function g(d){var p=d.getUTCFullYear(),v=p<1;v&&(p=Math.abs(p)+1);var w=u(p,4)+"-"+u(d.getUTCMonth()+1,2)+"-"+u(d.getUTCDate(),2)+"T"+u(d.getUTCHours(),2)+":"+u(d.getUTCMinutes(),2)+":"+u(d.getUTCSeconds(),2)+"."+u(d.getUTCMilliseconds(),3);return w+="+00:00",v&&(w+=" BC"),w}m(g,"dateToStringUTC");function x(d,p,v){return d=typeof d=="string"?{text:d}:d,p&&(typeof p=="function"?d.callback=p:d.values=p),v&&(d.callback=v),d}m(x,"normalizeQueryConfig");var b=m(function(d){return s.createHash("md5").update(d,"utf-8").digest("hex")},"md5"),y=m(function(d,p,v){var w=b(p+d),E=b(W.concat([W.from(w),v]));return"md5"+E},"postgresMd5PasswordHash");t.exports={prepareValue:m(function(d){return l(d)},"prepareValueWrapper"),normalizeQueryConfig:x,postgresMd5PasswordHash:y,md5:b}}),Ot={};ke(Ot,{default:()=>Ai});var Ai,Jt=me(()=>{q(),Ai={}}),Ea=Z((e,t)=>{q();var s=(Li(),ue(ws));function r(p){if(p.indexOf("SCRAM-SHA-256")===-1)throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");let v=s.randomBytes(18).toString("base64");return{mechanism:"SCRAM-SHA-256",clientNonce:v,response:"n,,n=*,r="+v,message:"SASLInitialResponse"}}m(r,"startSession");function a(p,v,w){if(p.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(typeof w!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");let E=f(w);if(E.nonce.startsWith(p.clientNonce)){if(E.nonce.length===p.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");var _=W.from(E.salt,"base64"),M=d(v,_,E.iteration),R=y(M,"Client Key"),S=b(R),C="n=*,r="+p.clientNonce,L="r="+E.nonce+",s="+E.salt+",i="+E.iteration,k="c=biws,r="+E.nonce,D=C+","+L+","+k,A=y(S,D),z=x(R,A),$=z.toString("base64"),B=y(M,"Server Key"),U=y(B,D);p.message="SASLResponse",p.serverSignature=U.toString("base64"),p.response=k+",p="+$}m(a,"continueSession");function n(p,v){if(p.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");let{serverSignature:w}=g(v);if(w!==p.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}m(n,"finalizeSession");function l(p){if(typeof p!="string")throw new TypeError("SASL: text must be a string");return p.split("").map((v,w)=>p.charCodeAt(w)).every(v=>v>=33&&v<=43||v>=45&&v<=126)}m(l,"isPrintableChars");function o(p){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(p)}m(o,"isBase64");function u(p){if(typeof p!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(p.split(",").map(v=>{if(!/^.=/.test(v))throw new Error("SASL: Invalid attribute pair entry");let w=v[0],E=v.substring(2);return[w,E]}))}m(u,"parseAttributePairs");function f(p){let v=u(p),w=v.get("r");if(w){if(!l(w))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");let E=v.get("s");if(E){if(!o(E))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");let _=v.get("i");if(_){if(!/^[1-9][0-9]*$/.test(_))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");let M=parseInt(_,10);return{nonce:w,salt:E,iteration:M}}m(f,"parseServerFirstMessage");function g(p){let v=u(p).get("v");if(v){if(!o(v))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:v}}m(g,"parseServerFinalMessage");function x(p,v){if(!W.isBuffer(p))throw new TypeError("first argument must be a Buffer");if(!W.isBuffer(v))throw new TypeError("second argument must be a Buffer");if(p.length!==v.length)throw new Error("Buffer lengths must match");if(p.length===0)throw new Error("Buffers cannot be empty");return W.from(p.map((w,E)=>p[E]^v[E]))}m(x,"xorBuffers");function b(p){return s.createHash("sha256").update(p).digest()}m(b,"sha256");function y(p,v){return s.createHmac("sha256",p).update(v).digest()}m(y,"hmacSha256");function d(p,v,w){for(var E=y(p,W.concat([v,W.from([0,0,0,1])])),_=E,M=0;M<w-1;M++)E=y(p,E),_=x(_,E);return _}m(d,"Hi"),t.exports={startSession:r,continueSession:a,finalizeSession:n}}),Es={};ke(Es,{join:()=>Oi});function Oi(...e){return e.join("/")}var Mi=me(()=>{q(),m(Oi,"join")}),_s={};ke(_s,{stat:()=>Ri});function Ri(e,t){t(new Error("No filesystem"))}var Di=me(()=>{q(),m(Ri,"stat")}),Ss={};ke(Ss,{default:()=>Ni});var Ni,Bi=me(()=>{q(),Ni={}}),Pi={};ke(Pi,{StringDecoder:()=>Fi});var us,Fi,_a=me(()=>{q(),us=class{constructor(t){Q(this,"td"),this.td=new TextDecoder(t)}write(t){return this.td.decode(t,{stream:!0})}end(t){return this.td.decode(t)}},m(us,"StringDecoder"),Fi=us}),Sa=Z((e,t)=>{q();var{Transform:s}=(Bi(),ue(Ss)),{StringDecoder:r}=(_a(),ue(Pi)),a=Symbol("last"),n=Symbol("decoder");function l(x,b,y){let d;if(this.overflow){if(d=this[n].write(x).split(this.matcher),d.length===1)return y();d.shift(),this.overflow=!1}else this[a]+=this[n].write(x),d=this[a].split(this.matcher);this[a]=d.pop();for(let p=0;p<d.length;p++)try{u(this,this.mapper(d[p]))}catch(v){return y(v)}if(this.overflow=this[a].length>this.maxLength,this.overflow&&!this.skipOverflow){y(new Error("maximum buffer reached"));return}y()}m(l,"transform");function o(x){if(this[a]+=this[n].end(),this[a])try{u(this,this.mapper(this[a]))}catch(b){return x(b)}x()}m(o,"flush");function u(x,b){b!==void 0&&x.push(b)}m(u,"push");function f(x){return x}m(f,"noop");function g(x,b,y){switch(x=x||/\r?\n/,b=b||f,y=y||{},arguments.length){case 1:typeof x=="function"?(b=x,x=/\r?\n/):typeof x=="object"&&!(x instanceof RegExp)&&!x[Symbol.split]&&(y=x,x=/\r?\n/);break;case 2:typeof x=="function"?(y=b,b=x,x=/\r?\n/):typeof b=="object"&&(y=b,b=f)}y=Object.assign({},y),y.autoDestroy=!0,y.transform=l,y.flush=o,y.readableObjectMode=!0;let d=new s(y);return d[a]="",d[n]=new r("utf8"),d.matcher=x,d.mapper=b,d.maxLength=y.maxLength,d.skipOverflow=y.skipOverflow||!1,d.overflow=!1,d._destroy=function(p,v){this._writableState.errorEmitted=!1,v(p)},d}m(g,"split"),t.exports=g}),ka=Z((e,t)=>{q();var s=(Mi(),ue(Es)),r=(Bi(),ue(Ss)).Stream,a=Sa(),n=(Jt(),ue(Ot)),l=5432,o=J.platform==="win32",u=J.stderr,f=56,g=7,x=61440,b=32768;function y(R){return(R&x)==b}m(y,"isRegFile");var d=["host","port","database","user","password"],p=d.length,v=d[p-1];function w(){var R=u instanceof r&&u.writable===!0;if(R){var S=Array.prototype.slice.call(arguments).concat(`
`);u.write(n.format.apply(n,S))}}m(w,"warn"),Object.defineProperty(t.exports,"isWin",{get:m(function(){return o},"get"),set:m(function(R){o=R},"set")}),t.exports.warnTo=function(R){var S=u;return u=R,S},t.exports.getFileName=function(R){var S=R||J.env,C=S.PGPASSFILE||(o?s.join(S.APPDATA||"./","postgresql","pgpass.conf"):s.join(S.HOME||"./",".pgpass"));return C},t.exports.usePgPass=function(R,S){return Object.prototype.hasOwnProperty.call(J.env,"PGPASSWORD")?!1:o?!0:(S=S||"<unkn>",y(R.mode)?R.mode&(f|g)?(w('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',S),!1):!0:(w('WARNING: password file "%s" is not a plain file',S),!1))};var E=t.exports.match=function(R,S){return d.slice(0,-1).reduce(function(C,L,k){return k==1&&Number(R[L]||l)===Number(S[L])?C&&!0:C&&(S[L]==="*"||S[L]===R[L])},!0)};t.exports.getPassword=function(R,S,C){var L,k=S.pipe(a());function D($){var B=_($);B&&M(B)&&E(R,B)&&(L=B[v],k.end())}m(D,"onLine");var A=m(function(){S.destroy(),C(L)},"onEnd"),z=m(function($){S.destroy(),w("WARNING: error on reading file: %s",$),C(void 0)},"onErr");S.on("error",z),k.on("data",D).on("end",A).on("error",z)};var _=t.exports.parseLine=function(R){if(R.length<11||R.match(/^\s+#/))return null;for(var S="",C="",L=0,k=0,D=0,A={},z=!1,$=m(function(U,H,Y){var te=R.substring(H,Y);Object.hasOwnProperty.call(J.env,"PGPASS_NO_DEESCAPE")||(te=te.replace(/\\([:\\])/g,"$1")),A[d[U]]=te},"addToObj"),B=0;B<R.length-1;B+=1){if(S=R.charAt(B+1),C=R.charAt(B),z=L==p-1,z){$(L,k);break}B>=0&&S==":"&&C!=="\\"&&($(L,k,B+1),k=B+2,L+=1)}return A=Object.keys(A).length===p?A:null,A},M=t.exports.isValidEntry=function(R){for(var S={0:function(A){return A.length>0},1:function(A){return A==="*"?!0:(A=Number(A),isFinite(A)&&A>0&&A<9007199254740992&&Math.floor(A)===A)},2:function(A){return A.length>0},3:function(A){return A.length>0},4:function(A){return A.length>0}},C=0;C<d.length;C+=1){var L=S[C],k=R[d[C]]||"",D=L(k);if(!D)return!1}return!0}}),Ta=Z((e,t)=>{q(),Mi(),ue(Es);var s=(Di(),ue(_s)),r=ka();t.exports=function(a,n){var l=r.getFileName();s.stat(l,function(o,u){if(o||!r.usePgPass(u,l))return n(void 0);var f=s.createReadStream(l);r.getPassword(a,f,n)})},t.exports.warnTo=r.warnTo}),Ui={};ke(Ui,{default:()=>zi});var zi,Ia=me(()=>{q(),zi={}}),Ca=Z((e,t)=>{q();var s=(Ei(),ue(wi)),r=(Di(),ue(_s));function a(n){if(n.charAt(0)==="/"){var o=n.split(" ");return{host:o[0],database:o[1]}}var l=s.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(n)?encodeURI(n).replace(/\%25(\d\d)/g,"%$1"):n,!0),o=l.query;for(var u in o)Array.isArray(o[u])&&(o[u]=o[u][o[u].length-1]);var f=(l.auth||":").split(":");if(o.user=f[0],o.password=f.splice(1).join(":"),o.port=l.port,l.protocol=="socket:")return o.host=decodeURI(l.pathname),o.database=l.query.db,o.client_encoding=l.query.encoding,o;o.host||(o.host=l.hostname);var g=l.pathname;if(!o.host&&g&&/^%2f/i.test(g)){var x=g.split("/");o.host=decodeURIComponent(x[0]),g=x.splice(1).join("/")}switch(g&&g.charAt(0)==="/"&&(g=g.slice(1)||null),o.database=g&&decodeURI(g),(o.ssl==="true"||o.ssl==="1")&&(o.ssl=!0),o.ssl==="0"&&(o.ssl=!1),(o.sslcert||o.sslkey||o.sslrootcert||o.sslmode)&&(o.ssl={}),o.sslcert&&(o.ssl.cert=r.readFileSync(o.sslcert).toString()),o.sslkey&&(o.ssl.key=r.readFileSync(o.sslkey).toString()),o.sslrootcert&&(o.ssl.ca=r.readFileSync(o.sslrootcert).toString()),o.sslmode){case"disable":{o.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":break;case"no-verify":{o.ssl.rejectUnauthorized=!1;break}}return o}m(a,"parse"),t.exports=a,a.parse=a}),ks=Z((e,t)=>{q();var s=(Ia(),ue(Ui)),r=Xt(),a=Ca().parse,n=m(function(x,b,y){return y===void 0?y=J.env["PG"+x.toUpperCase()]:y===!1||(y=J.env[y]),b[x]||y||r[x]},"val"),l=m(function(){switch(J.env.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return r.ssl},"readSSLConfigFromEnvironment"),o=m(function(x){return"'"+(""+x).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},"quoteParamValue"),u=m(function(x,b,y){var d=b[y];d!=null&&x.push(y+"="+o(d))},"add"),f=class{constructor(b){b=typeof b=="string"?a(b):b||{},b.connectionString&&(b=Object.assign({},b,a(b.connectionString))),this.user=n("user",b),this.database=n("database",b),this.database===void 0&&(this.database=this.user),this.port=parseInt(n("port",b),10),this.host=n("host",b),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:n("password",b)}),this.binary=n("binary",b),this.options=n("options",b),this.ssl=typeof b.ssl>"u"?l():b.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=n("client_encoding",b),this.replication=n("replication",b),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=n("application_name",b,"PGAPPNAME"),this.fallback_application_name=n("fallback_application_name",b,!1),this.statement_timeout=n("statement_timeout",b,!1),this.lock_timeout=n("lock_timeout",b,!1),this.idle_in_transaction_session_timeout=n("idle_in_transaction_session_timeout",b,!1),this.query_timeout=n("query_timeout",b,!1),b.connectionTimeoutMillis===void 0?this.connect_timeout=J.env.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(b.connectionTimeoutMillis/1e3),b.keepAlive===!1?this.keepalives=0:b.keepAlive===!0&&(this.keepalives=1),typeof b.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(b.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(b){var y=[];u(y,this,"user"),u(y,this,"password"),u(y,this,"port"),u(y,this,"application_name"),u(y,this,"fallback_application_name"),u(y,this,"connect_timeout"),u(y,this,"options");var d=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(u(y,d,"sslmode"),u(y,d,"sslca"),u(y,d,"sslkey"),u(y,d,"sslcert"),u(y,d,"sslrootcert"),this.database&&y.push("dbname="+o(this.database)),this.replication&&y.push("replication="+o(this.replication)),this.host&&y.push("host="+o(this.host)),this.isDomainSocket)return b(null,y.join(" "));this.client_encoding&&y.push("client_encoding="+o(this.client_encoding)),s.lookup(this.host,function(p,v){return p?b(p,null):(y.push("hostaddr="+o(v)),b(null,y.join(" ")))})}};m(f,"ConnectionParameters");var g=f;t.exports=g}),La=Z((e,t)=>{q();var s=Yt(),r=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/,a=class{constructor(o,u){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=u,this.RowCtor=null,this.rowAsArray=o==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray)}addCommandComplete(o){var u;o.text?u=r.exec(o.text):u=r.exec(o.command),u&&(this.command=u[1],u[3]?(this.oid=parseInt(u[2],10),this.rowCount=parseInt(u[3],10)):u[2]&&(this.rowCount=parseInt(u[2],10)))}_parseRowAsArray(o){for(var u=new Array(o.length),f=0,g=o.length;f<g;f++){var x=o[f];x!==null?u[f]=this._parsers[f](x):u[f]=null}return u}parseRow(o){for(var u={},f=0,g=o.length;f<g;f++){var x=o[f],b=this.fields[f].name;x!==null?u[b]=this._parsers[f](x):u[b]=null}return u}addRow(o){this.rows.push(o)}addFields(o){this.fields=o,this.fields.length&&(this._parsers=new Array(o.length));for(var u=0;u<o.length;u++){var f=o[u];this._types?this._parsers[u]=this._types.getTypeParser(f.dataTypeID,f.format||"text"):this._parsers[u]=s.getTypeParser(f.dataTypeID,f.format||"text")}}};m(a,"Result");var n=a;t.exports=n}),Aa=Z((e,t)=>{q();var{EventEmitter:s}=Xe(),r=La(),a=Kt(),n=class extends s{constructor(u,f,g){super(),u=a.normalizeQueryConfig(u,f,g),this.text=u.text,this.values=u.values,this.rows=u.rows,this.types=u.types,this.name=u.name,this.binary=u.binary,this.portal=u.portal||"",this.callback=u.callback,this._rowMode=u.rowMode,J.domain&&u.callback&&(this.callback=J.domain.bind(u.callback)),this._result=new r(this._rowMode,this.types),this._results=this._result,this.isPreparedStatement=!1,this._canceledDueToError=!1,this._promise=null}requiresPreparation(){return this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new r(this._rowMode,this.types),this._results.push(this._result))}handleRowDescription(u){this._checkForMultirow(),this._result.addFields(u.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(u){let f;if(!this._canceledDueToError){try{f=this._result.parseRow(u.fields)}catch(g){this._canceledDueToError=g;return}this.emit("row",f,this._result),this._accumulateRows&&this._result.addRow(f)}}handleCommandComplete(u,f){this._checkForMultirow(),this._result.addCommandComplete(u),this.rows&&f.sync()}handleEmptyQuery(u){this.rows&&u.sync()}handleError(u,f){if(this._canceledDueToError&&(u=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(u);this.emit("error",u)}handleReadyForQuery(u){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,u);if(this.callback)try{this.callback(null,this._results)}catch(f){J.nextTick(()=>{throw f})}this.emit("end",this._results)}submit(u){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");let f=u.parsedStatements[this.name];return this.text&&f&&this.text!==f?new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`):this.values&&!Array.isArray(this.values)?new Error("Query values must be an array"):(this.requiresPreparation()?this.prepare(u):u.query(this.text),null)}hasBeenParsed(u){return this.name&&u.parsedStatements[this.name]}handlePortalSuspended(u){this._getRows(u,this.rows)}_getRows(u,f){u.execute({portal:this.portal,rows:f}),f?u.flush():u.sync()}prepare(u){this.isPreparedStatement=!0,this.hasBeenParsed(u)||u.parse({text:this.text,name:this.name,types:this.types});try{u.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:a.prepareValue})}catch(f){this.handleError(f,u);return}u.describe({type:"P",name:this.portal||""}),this._getRows(u,this.rows)}handleCopyInResponse(u){u.sendCopyFail("No source stream defined")}handleCopyData(u,f){}};m(n,"Query");var l=n;t.exports=l}),$i=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.NoticeMessage=e.DataRowMessage=e.CommandCompleteMessage=e.ReadyForQueryMessage=e.NotificationResponseMessage=e.BackendKeyDataMessage=e.AuthenticationMD5Password=e.ParameterStatusMessage=e.ParameterDescriptionMessage=e.RowDescriptionMessage=e.Field=e.CopyResponse=e.CopyDataMessage=e.DatabaseError=e.copyDone=e.emptyQuery=e.replicationStart=e.portalSuspended=e.noData=e.closeComplete=e.bindComplete=e.parseComplete=void 0,e.parseComplete={name:"parseComplete",length:5},e.bindComplete={name:"bindComplete",length:5},e.closeComplete={name:"closeComplete",length:5},e.noData={name:"noData",length:5},e.portalSuspended={name:"portalSuspended",length:5},e.replicationStart={name:"replicationStart",length:4},e.emptyQuery={name:"emptyQuery",length:4},e.copyDone={name:"copyDone",length:4};var t=class extends Error{constructor(B,U,H){super(B),this.length=U,this.name=H}};m(t,"DatabaseError");var s=t;e.DatabaseError=s;var r=class{constructor(B,U){this.length=B,this.chunk=U,this.name="copyData"}};m(r,"CopyDataMessage");var a=r;e.CopyDataMessage=a;var n=class{constructor(B,U,H,Y){this.length=B,this.name=U,this.binary=H,this.columnTypes=new Array(Y)}};m(n,"CopyResponse");var l=n;e.CopyResponse=l;var o=class{constructor(B,U,H,Y,te,K,be){this.name=B,this.tableID=U,this.columnID=H,this.dataTypeID=Y,this.dataTypeSize=te,this.dataTypeModifier=K,this.format=be}};m(o,"Field");var u=o;e.Field=u;var f=class{constructor(B,U){this.length=B,this.fieldCount=U,this.name="rowDescription",this.fields=new Array(this.fieldCount)}};m(f,"RowDescriptionMessage");var g=f;e.RowDescriptionMessage=g;var x=class{constructor(B,U){this.length=B,this.parameterCount=U,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}};m(x,"ParameterDescriptionMessage");var b=x;e.ParameterDescriptionMessage=b;var y=class{constructor(B,U,H){this.length=B,this.parameterName=U,this.parameterValue=H,this.name="parameterStatus"}};m(y,"ParameterStatusMessage");var d=y;e.ParameterStatusMessage=d;var p=class{constructor(B,U){this.length=B,this.salt=U,this.name="authenticationMD5Password"}};m(p,"AuthenticationMD5Password");var v=p;e.AuthenticationMD5Password=v;var w=class{constructor(B,U,H){this.length=B,this.processID=U,this.secretKey=H,this.name="backendKeyData"}};m(w,"BackendKeyDataMessage");var E=w;e.BackendKeyDataMessage=E;var _=class{constructor(B,U,H,Y){this.length=B,this.processId=U,this.channel=H,this.payload=Y,this.name="notification"}};m(_,"NotificationResponseMessage");var M=_;e.NotificationResponseMessage=M;var R=class{constructor(B,U){this.length=B,this.status=U,this.name="readyForQuery"}};m(R,"ReadyForQueryMessage");var S=R;e.ReadyForQueryMessage=S;var C=class{constructor(B,U){this.length=B,this.text=U,this.name="commandComplete"}};m(C,"CommandCompleteMessage");var L=C;e.CommandCompleteMessage=L;var k=class{constructor(B,U){this.length=B,this.fields=U,this.name="dataRow",this.fieldCount=U.length}};m(k,"DataRowMessage");var D=k;e.DataRowMessage=D;var A=class{constructor(B,U){this.length=B,this.message=U,this.name="notice"}};m(A,"NoticeMessage");var z=A;e.NoticeMessage=z}),Oa=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.Writer=void 0;var t=class{constructor(a=256){this.size=a,this.offset=5,this.headerPosition=0,this.buffer=W.allocUnsafe(a)}ensure(a){if(this.buffer.length-this.offset<a){let n=this.buffer,l=n.length+(n.length>>1)+a;this.buffer=W.allocUnsafe(l),n.copy(this.buffer)}}addInt32(a){return this.ensure(4),this.buffer[this.offset++]=a>>>24&255,this.buffer[this.offset++]=a>>>16&255,this.buffer[this.offset++]=a>>>8&255,this.buffer[this.offset++]=a>>>0&255,this}addInt16(a){return this.ensure(2),this.buffer[this.offset++]=a>>>8&255,this.buffer[this.offset++]=a>>>0&255,this}addCString(a){if(!a)this.ensure(1);else{let n=W.byteLength(a);this.ensure(n+1),this.buffer.write(a,this.offset,"utf-8"),this.offset+=n}return this.buffer[this.offset++]=0,this}addString(a=""){let n=W.byteLength(a);return this.ensure(n),this.buffer.write(a,this.offset),this.offset+=n,this}add(a){return this.ensure(a.length),a.copy(this.buffer,this.offset),this.offset+=a.length,this}join(a){if(a){this.buffer[this.headerPosition]=a;let n=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(n,this.headerPosition+1)}return this.buffer.slice(a?0:5,this.offset)}flush(a){let n=this.join(a);return this.offset=5,this.headerPosition=0,this.buffer=W.allocUnsafe(this.size),n}};m(t,"Writer");var s=t;e.Writer=s}),Ma=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.serialize=void 0;var t=Oa(),s=new t.Writer,r=m(B=>{s.addInt16(3).addInt16(0);for(let Y of Object.keys(B))s.addCString(Y).addCString(B[Y]);s.addCString("client_encoding").addCString("UTF8");let U=s.addCString("").flush(),H=U.length+4;return new t.Writer().addInt32(H).add(U).flush()},"startup"),a=m(()=>{let B=W.allocUnsafe(8);return B.writeInt32BE(8,0),B.writeInt32BE(80877103,4),B},"requestSsl"),n=m(B=>s.addCString(B).flush(112),"password"),l=m(function(B,U){return s.addCString(B).addInt32(W.byteLength(U)).addString(U),s.flush(112)},"sendSASLInitialResponseMessage"),o=m(function(B){return s.addString(B).flush(112)},"sendSCRAMClientFinalMessage"),u=m(B=>s.addCString(B).flush(81),"query"),f=[],g=m(B=>{let U=B.name||"";U.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",U,U.length),console.error("This can cause conflicts and silent errors executing queries"));let H=B.types||f,Y=H.length,te=s.addCString(U).addCString(B.text).addInt16(Y);for(let K=0;K<Y;K++)te.addInt32(H[K]);return s.flush(80)},"parse"),x=new t.Writer,b=m(function(B,U){for(let H=0;H<B.length;H++){let Y=U?U(B[H],H):B[H];Y==null?(s.addInt16(0),x.addInt32(-1)):Y instanceof W?(s.addInt16(1),x.addInt32(Y.length),x.add(Y)):(s.addInt16(0),x.addInt32(W.byteLength(Y)),x.addString(Y))}},"writeValues"),y=m((B={})=>{let U=B.portal||"",H=B.statement||"",Y=B.binary||!1,te=B.values||f,K=te.length;return s.addCString(U).addCString(H),s.addInt16(K),b(te,B.valueMapper),s.addInt16(K),s.add(x.flush()),s.addInt16(Y?1:0),s.flush(66)},"bind"),d=W.from([69,0,0,0,9,0,0,0,0,0]),p=m(B=>{if(!B||!B.portal&&!B.rows)return d;let U=B.portal||"",H=B.rows||0,Y=W.byteLength(U),te=4+Y+1+4,K=W.allocUnsafe(1+te);return K[0]=69,K.writeInt32BE(te,1),K.write(U,5,"utf-8"),K[Y+5]=0,K.writeUInt32BE(H,K.length-4),K},"execute"),v=m((B,U)=>{let H=W.allocUnsafe(16);return H.writeInt32BE(16,0),H.writeInt16BE(1234,4),H.writeInt16BE(5678,6),H.writeInt32BE(B,8),H.writeInt32BE(U,12),H},"cancel"),w=m((B,U)=>{let H=4+W.byteLength(U)+1,Y=W.allocUnsafe(1+H);return Y[0]=B,Y.writeInt32BE(H,1),Y.write(U,5,"utf-8"),Y[H]=0,Y},"cstringMessage"),E=s.addCString("P").flush(68),_=s.addCString("S").flush(68),M=m(B=>B.name?w(68,`${B.type}${B.name||""}`):B.type==="P"?E:_,"describe"),R=m(B=>{let U=`${B.type}${B.name||""}`;return w(67,U)},"close"),S=m(B=>s.add(B).flush(100),"copyData"),C=m(B=>w(102,B),"copyFail"),L=m(B=>W.from([B,0,0,0,4]),"codeOnlyBuffer"),k=L(72),D=L(83),A=L(88),z=L(99),$={startup:r,password:n,requestSsl:a,sendSASLInitialResponseMessage:l,sendSCRAMClientFinalMessage:o,query:u,parse:g,bind:y,execute:p,describe:M,close:R,flush:m(()=>k,"flush"),sync:m(()=>D,"sync"),end:m(()=>A,"end"),copyData:S,copyDone:m(()=>z,"copyDone"),copyFail:C,cancel:v};e.serialize=$}),Ra=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.BufferReader=void 0;var t=W.allocUnsafe(0),s=class{constructor(n=0){this.offset=n,this.buffer=t,this.encoding="utf-8"}setBuffer(n,l){this.offset=n,this.buffer=l}int16(){let n=this.buffer.readInt16BE(this.offset);return this.offset+=2,n}byte(){let n=this.buffer[this.offset];return this.offset++,n}int32(){let n=this.buffer.readInt32BE(this.offset);return this.offset+=4,n}uint32(){let n=this.buffer.readUInt32BE(this.offset);return this.offset+=4,n}string(n){let l=this.buffer.toString(this.encoding,this.offset,this.offset+n);return this.offset+=n,l}cstring(){let n=this.offset,l=n;for(;this.buffer[l++]!==0;);return this.offset=l,this.buffer.toString(this.encoding,n,l-1)}bytes(n){let l=this.buffer.slice(this.offset,this.offset+n);return this.offset+=n,l}};m(s,"BufferReader");var r=s;e.BufferReader=r}),Da=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.Parser=void 0;var t=$i(),s=Ra(),r=1,a=4,n=r+a,l=W.allocUnsafe(0),o=class{constructor(g){if(this.buffer=l,this.bufferLength=0,this.bufferOffset=0,this.reader=new s.BufferReader,(g==null?void 0:g.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(g==null?void 0:g.mode)||"text"}parse(g,x){this.mergeBuffer(g);let b=this.bufferOffset+this.bufferLength,y=this.bufferOffset;for(;y+n<=b;){let d=this.buffer[y],p=this.buffer.readUInt32BE(y+r),v=r+p;if(v+y<=b){let w=this.handlePacket(y+n,d,p,this.buffer);x(w),y+=v}else break}y===b?(this.buffer=l,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=b-y,this.bufferOffset=y)}mergeBuffer(g){if(this.bufferLength>0){let x=this.bufferLength+g.byteLength;if(x+this.bufferOffset>this.buffer.byteLength){let b;if(x<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)b=this.buffer;else{let y=this.buffer.byteLength*2;for(;x>=y;)y*=2;b=W.allocUnsafe(y)}this.buffer.copy(b,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=b,this.bufferOffset=0}g.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=x}else this.buffer=g,this.bufferOffset=0,this.bufferLength=g.byteLength}handlePacket(g,x,b,y){switch(x){case 50:return t.bindComplete;case 49:return t.parseComplete;case 51:return t.closeComplete;case 110:return t.noData;case 115:return t.portalSuspended;case 99:return t.copyDone;case 87:return t.replicationStart;case 73:return t.emptyQuery;case 68:return this.parseDataRowMessage(g,b,y);case 67:return this.parseCommandCompleteMessage(g,b,y);case 90:return this.parseReadyForQueryMessage(g,b,y);case 65:return this.parseNotificationMessage(g,b,y);case 82:return this.parseAuthenticationResponse(g,b,y);case 83:return this.parseParameterStatusMessage(g,b,y);case 75:return this.parseBackendKeyData(g,b,y);case 69:return this.parseErrorMessage(g,b,y,"error");case 78:return this.parseErrorMessage(g,b,y,"notice");case 84:return this.parseRowDescriptionMessage(g,b,y);case 116:return this.parseParameterDescriptionMessage(g,b,y);case 71:return this.parseCopyInMessage(g,b,y);case 72:return this.parseCopyOutMessage(g,b,y);case 100:return this.parseCopyData(g,b,y);default:return new t.DatabaseError("received invalid response: "+x.toString(16),b,"error")}}parseReadyForQueryMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.string(1);return new t.ReadyForQueryMessage(x,y)}parseCommandCompleteMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.cstring();return new t.CommandCompleteMessage(x,y)}parseCopyData(g,x,b){let y=b.slice(g,g+(x-4));return new t.CopyDataMessage(x,y)}parseCopyInMessage(g,x,b){return this.parseCopyMessage(g,x,b,"copyInResponse")}parseCopyOutMessage(g,x,b){return this.parseCopyMessage(g,x,b,"copyOutResponse")}parseCopyMessage(g,x,b,y){this.reader.setBuffer(g,b);let d=this.reader.byte()!==0,p=this.reader.int16(),v=new t.CopyResponse(x,y,d,p);for(let w=0;w<p;w++)v.columnTypes[w]=this.reader.int16();return v}parseNotificationMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),d=this.reader.cstring(),p=this.reader.cstring();return new t.NotificationResponseMessage(x,y,d,p)}parseRowDescriptionMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),d=new t.RowDescriptionMessage(x,y);for(let p=0;p<y;p++)d.fields[p]=this.parseField();return d}parseField(){let g=this.reader.cstring(),x=this.reader.uint32(),b=this.reader.int16(),y=this.reader.uint32(),d=this.reader.int16(),p=this.reader.int32(),v=this.reader.int16()===0?"text":"binary";return new t.Field(g,x,b,y,d,p,v)}parseParameterDescriptionMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),d=new t.ParameterDescriptionMessage(x,y);for(let p=0;p<y;p++)d.dataTypeIDs[p]=this.reader.int32();return d}parseDataRowMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),d=new Array(y);for(let p=0;p<y;p++){let v=this.reader.int32();d[p]=v===-1?null:this.reader.string(v)}return new t.DataRowMessage(x,d)}parseParameterStatusMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.cstring(),d=this.reader.cstring();return new t.ParameterStatusMessage(x,y,d)}parseBackendKeyData(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),d=this.reader.int32();return new t.BackendKeyDataMessage(x,y,d)}parseAuthenticationResponse(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),d={name:"authenticationOk",length:x};switch(y){case 0:break;case 3:d.length===8&&(d.name="authenticationCleartextPassword");break;case 5:if(d.length===12){d.name="authenticationMD5Password";let p=this.reader.bytes(4);return new t.AuthenticationMD5Password(x,p)}break;case 10:{d.name="authenticationSASL",d.mechanisms=[];let p;do p=this.reader.cstring(),p&&d.mechanisms.push(p);while(p)}break;case 11:d.name="authenticationSASLContinue",d.data=this.reader.string(x-8);break;case 12:d.name="authenticationSASLFinal",d.data=this.reader.string(x-8);break;default:throw new Error("Unknown authenticationOk message type "+y)}return d}parseErrorMessage(g,x,b,y){this.reader.setBuffer(g,b);let d={},p=this.reader.string(1);for(;p!=="\0";)d[p]=this.reader.cstring(),p=this.reader.string(1);let v=d.M,w=y==="notice"?new t.NoticeMessage(x,v):new t.DatabaseError(v,x,y);return w.severity=d.S,w.code=d.C,w.detail=d.D,w.hint=d.H,w.position=d.P,w.internalPosition=d.p,w.internalQuery=d.q,w.where=d.W,w.schema=d.s,w.table=d.t,w.column=d.c,w.dataType=d.d,w.constraint=d.n,w.file=d.F,w.line=d.L,w.routine=d.R,w}};m(o,"Parser");var u=o;e.Parser=u}),ji=Z(e=>{q(),Object.defineProperty(e,"__esModule",{value:!0}),e.DatabaseError=e.serialize=e.parse=void 0;var t=$i();Object.defineProperty(e,"DatabaseError",{enumerable:!0,get:m(function(){return t.DatabaseError},"get")});var s=Ma();Object.defineProperty(e,"serialize",{enumerable:!0,get:m(function(){return s.serialize},"get")});var r=Da();function a(n,l){let o=new r.Parser;return n.on("data",u=>o.parse(u,l)),new Promise(u=>n.on("end",()=>u()))}m(a,"parse"),e.parse=a}),qi={};ke(qi,{connect:()=>Vi});function Vi({socket:e,servername:t}){return e.startTls(t),e}var Na=me(()=>{q(),m(Vi,"connect")}),Hi=Z((e,t)=>{q();var s=(At(),ue(yi)),r=Xe().EventEmitter,{parse:a,serialize:n}=ji(),l=n.flush(),o=n.sync(),u=n.end(),f=class extends r{constructor(b){super(),b=b||{},this.stream=b.stream||new s.Socket,this._keepAlive=b.keepAlive,this._keepAliveInitialDelayMillis=b.keepAliveInitialDelayMillis,this.lastBuffer=!1,this.parsedStatements={},this.ssl=b.ssl||!1,this._ending=!1,this._emitMessage=!1;var y=this;this.on("newListener",function(d){d==="message"&&(y._emitMessage=!0)})}connect(b,y){var d=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(b,y),this.stream.once("connect",function(){d._keepAlive&&d.stream.setKeepAlive(!0,d._keepAliveInitialDelayMillis),d.emit("connect")});let p=m(function(v){d._ending&&(v.code==="ECONNRESET"||v.code==="EPIPE")||d.emit("error",v)},"reportStreamError");if(this.stream.on("error",p),this.stream.on("close",function(){d.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(v){var w=v.toString("utf8");switch(w){case"S":break;case"N":return d.stream.end(),d.emit("error",new Error("The server does not support SSL connections"));default:return d.stream.end(),d.emit("error",new Error("There was an error establishing an SSL connection"))}var E=(Na(),ue(qi));let _={socket:d.stream};d.ssl!==!0&&(Object.assign(_,d.ssl),"key"in d.ssl&&(_.key=d.ssl.key)),s.isIP(y)===0&&(_.servername=y);try{d.stream=E.connect(_)}catch(M){return d.emit("error",M)}d.attachListeners(d.stream),d.stream.on("error",p),d.emit("sslconnect")})}attachListeners(b){b.on("end",()=>{this.emit("end")}),a(b,y=>{var d=y.name==="error"?"errorMessage":y.name;this._emitMessage&&this.emit("message",y),this.emit(d,y)})}requestSsl(){this.stream.write(n.requestSsl())}startup(b){this.stream.write(n.startup(b))}cancel(b,y){this._send(n.cancel(b,y))}password(b){this._send(n.password(b))}sendSASLInitialResponseMessage(b,y){this._send(n.sendSASLInitialResponseMessage(b,y))}sendSCRAMClientFinalMessage(b){this._send(n.sendSCRAMClientFinalMessage(b))}_send(b){return this.stream.writable?this.stream.write(b):!1}query(b){this._send(n.query(b))}parse(b){this._send(n.parse(b))}bind(b){this._send(n.bind(b))}execute(b){this._send(n.execute(b))}flush(){this.stream.writable&&this.stream.write(l)}sync(){this._ending=!0,this._send(l),this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(u,()=>{this.stream.end()})}close(b){this._send(n.close(b))}describe(b){this._send(n.describe(b))}sendCopyFromChunk(b){this._send(n.copyData(b))}endCopyFrom(){this._send(n.copyDone())}sendCopyFail(b){this._send(n.copyFail(b))}};m(f,"Connection");var g=f;t.exports=g}),Ba=Z((e,t)=>{q();var s=Xe().EventEmitter;Jt(),ue(Ot);var r=Kt(),a=Ea(),n=Ta(),l=xs(),o=ks(),u=Aa(),f=Xt(),g=Hi(),x=class extends s{constructor(d){super(),this.connectionParameters=new o(d),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;var p=d||{};this._Promise=p.Promise||Qt.Promise,this._types=new l(p.types),this._ending=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this.connection=p.connection||new g({stream:p.stream,ssl:this.connectionParameters.ssl,keepAlive:p.keepAlive||!1,keepAliveInitialDelayMillis:p.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this.queryQueue=[],this.binary=p.binary||f.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=p.connectionTimeoutMillis||0}_errorAllQueries(d){let p=m(v=>{J.nextTick(()=>{v.handleError(d,this.connection)})},"enqueueError");this.activeQuery&&(p(this.activeQuery),this.activeQuery=null),this.queryQueue.forEach(p),this.queryQueue.length=0}_connect(d){var p=this,v=this.connection;if(this._connectionCallback=d,this._connecting||this._connected){let w=new Error("Client has already been connected. You cannot reuse a client.");J.nextTick(()=>{d(w)});return}this._connecting=!0,this.connectionTimeoutHandle,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{v._ending=!0,v.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis)),this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){p.ssl?v.requestSsl():v.startup(p.getStartupConf())}),v.on("sslconnect",function(){v.startup(p.getStartupConf())}),this._attachListeners(v),v.once("end",()=>{let w=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(w),this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(w):this._handleErrorEvent(w):this._connectionError||this._handleErrorEvent(w)),J.nextTick(()=>{this.emit("end")})})}connect(d){if(d){this._connect(d);return}return new this._Promise((p,v)=>{this._connect(w=>{w?v(w):p()})})}_attachListeners(d){d.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),d.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),d.on("authenticationSASL",this._handleAuthSASL.bind(this)),d.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),d.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),d.on("backendKeyData",this._handleBackendKeyData.bind(this)),d.on("error",this._handleErrorEvent.bind(this)),d.on("errorMessage",this._handleErrorMessage.bind(this)),d.on("readyForQuery",this._handleReadyForQuery.bind(this)),d.on("notice",this._handleNotice.bind(this)),d.on("rowDescription",this._handleRowDescription.bind(this)),d.on("dataRow",this._handleDataRow.bind(this)),d.on("portalSuspended",this._handlePortalSuspended.bind(this)),d.on("emptyQuery",this._handleEmptyQuery.bind(this)),d.on("commandComplete",this._handleCommandComplete.bind(this)),d.on("parseComplete",this._handleParseComplete.bind(this)),d.on("copyInResponse",this._handleCopyInResponse.bind(this)),d.on("copyData",this._handleCopyData.bind(this)),d.on("notification",this._handleNotification.bind(this))}_checkPgPass(d){let p=this.connection;typeof this.password=="function"?this._Promise.resolve().then(()=>this.password()).then(v=>{if(v!==void 0){if(typeof v!="string"){p.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=v}else this.connectionParameters.password=this.password=null;d()}).catch(v=>{p.emit("error",v)}):this.password!==null?d():n(this.connectionParameters,v=>{v!==void 0&&(this.connectionParameters.password=this.password=v),d()})}_handleAuthCleartextPassword(d){this._checkPgPass(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(d){this._checkPgPass(()=>{let p=r.postgresMd5PasswordHash(this.user,this.password,d.salt);this.connection.password(p)})}_handleAuthSASL(d){this._checkPgPass(()=>{this.saslSession=a.startSession(d.mechanisms),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)})}_handleAuthSASLContinue(d){a.continueSession(this.saslSession,this.password,d.data),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}_handleAuthSASLFinal(d){a.finalizeSession(this.saslSession,d.data),this.saslSession=null}_handleBackendKeyData(d){this.processID=d.processID,this.secretKey=d.secretKey}_handleReadyForQuery(d){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));let{activeQuery:p}=this;this.activeQuery=null,this.readyForQuery=!0,p&&p.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(d){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(d);this.emit("error",d)}}_handleErrorEvent(d){if(this._connecting)return this._handleErrorWhileConnecting(d);this._queryable=!1,this._errorAllQueries(d),this.emit("error",d)}_handleErrorMessage(d){if(this._connecting)return this._handleErrorWhileConnecting(d);let p=this.activeQuery;if(!p){this._handleErrorEvent(d);return}this.activeQuery=null,p.handleError(d,this.connection)}_handleRowDescription(d){this.activeQuery.handleRowDescription(d)}_handleDataRow(d){this.activeQuery.handleDataRow(d)}_handlePortalSuspended(d){this.activeQuery.handlePortalSuspended(this.connection)}_handleEmptyQuery(d){this.activeQuery.handleEmptyQuery(this.connection)}_handleCommandComplete(d){this.activeQuery.handleCommandComplete(d,this.connection)}_handleParseComplete(d){this.activeQuery.name&&(this.connection.parsedStatements[this.activeQuery.name]=this.activeQuery.text)}_handleCopyInResponse(d){this.activeQuery.handleCopyInResponse(this.connection)}_handleCopyData(d){this.activeQuery.handleCopyData(d,this.connection)}_handleNotification(d){this.emit("notification",d)}_handleNotice(d){this.emit("notice",d)}getStartupConf(){var d=this.connectionParameters,p={user:d.user,database:d.database},v=d.application_name||d.fallback_application_name;return v&&(p.application_name=v),d.replication&&(p.replication=""+d.replication),d.statement_timeout&&(p.statement_timeout=String(parseInt(d.statement_timeout,10))),d.lock_timeout&&(p.lock_timeout=String(parseInt(d.lock_timeout,10))),d.idle_in_transaction_session_timeout&&(p.idle_in_transaction_session_timeout=String(parseInt(d.idle_in_transaction_session_timeout,10))),d.options&&(p.options=d.options),p}cancel(d,p){if(d.activeQuery===p){var v=this.connection;this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){v.cancel(d.processID,d.secretKey)})}else d.queryQueue.indexOf(p)!==-1&&d.queryQueue.splice(d.queryQueue.indexOf(p),1)}setTypeParser(d,p,v){return this._types.setTypeParser(d,p,v)}getTypeParser(d,p){return this._types.getTypeParser(d,p)}escapeIdentifier(d){return'"'+d.replace(/"/g,'""')+'"'}escapeLiteral(d){for(var p=!1,v="'",w=0;w<d.length;w++){var E=d[w];E==="'"?v+=E+E:E==="\\"?(v+=E+E,p=!0):v+=E}return v+="'",p===!0&&(v=" E"+v),v}_pulseQueryQueue(){if(this.readyForQuery===!0)if(this.activeQuery=this.queryQueue.shift(),this.activeQuery){this.readyForQuery=!1,this.hasExecuted=!0;let d=this.activeQuery.submit(this.connection);d&&J.nextTick(()=>{this.activeQuery.handleError(d,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this.activeQuery=null,this.emit("drain"))}query(d,p,v){var w,E,_,M,R;if(d==null)throw new TypeError("Client was passed a null or undefined query");return typeof d.submit=="function"?(_=d.query_timeout||this.connectionParameters.query_timeout,E=w=d,typeof p=="function"&&(w.callback=w.callback||p)):(_=this.connectionParameters.query_timeout,w=new u(d,p,v),w.callback||(E=new this._Promise((S,C)=>{w.callback=(L,k)=>L?C(L):S(k)}))),_&&(R=w.callback,M=setTimeout(()=>{var S=new Error("Query read timeout");J.nextTick(()=>{w.handleError(S,this.connection)}),R(S),w.callback=()=>{};var C=this.queryQueue.indexOf(w);C>-1&&this.queryQueue.splice(C,1),this._pulseQueryQueue()},_),w.callback=(S,C)=>{clearTimeout(M),R(S,C)}),this.binary&&!w.binary&&(w.binary=!0),w._result&&!w._result._types&&(w._result._types=this._types),this._queryable?this._ending?(J.nextTick(()=>{w.handleError(new Error("Client was closed and is not queryable"),this.connection)}),E):(this.queryQueue.push(w),this._pulseQueryQueue(),E):(J.nextTick(()=>{w.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),E)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(d){if(this._ending=!0,!this.connection._connecting)if(d)d();else return this._Promise.resolve();if(this.activeQuery||!this._queryable?this.connection.stream.destroy():this.connection.end(),d)this.connection.once("end",d);else return new this._Promise(p=>{this.connection.once("end",p)})}};m(x,"Client");var b=x;b.Query=u,t.exports=b}),Pa=Z((e,t)=>{q();var s=Xe().EventEmitter,r=m(function(){},"NOOP"),a=m((d,p)=>{let v=d.findIndex(p);return v===-1?void 0:d.splice(v,1)[0]},"removeWhere"),n=class{constructor(p,v,w){this.client=p,this.idleListener=v,this.timeoutId=w}};m(n,"IdleItem");var l=n,o=class{constructor(p){this.callback=p}};m(o,"PendingItem");var u=o;function f(){throw new Error("Release called on client which has already been released to the pool.")}m(f,"throwOnDoubleRelease");function g(d,p){if(p)return{callback:p,result:void 0};let v,w,E=m(function(M,R){M?v(M):w(R)},"cb"),_=new d(function(M,R){w=M,v=R}).catch(M=>{throw Error.captureStackTrace(M),M});return{callback:E,result:_}}m(g,"promisify");function x(d,p){return m(function v(w){w.client=p,p.removeListener("error",v),p.on("error",()=>{d.log("additional client error after disconnection due to error",w)}),d._remove(p),d.emit("error",w,p)},"idleListener")}m(x,"makeIdleListener");var b=class extends s{constructor(p,v){super(),this.options=Object.assign({},p),p!=null&&"password"in p&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:p.password}),p!=null&&p.ssl&&p.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||v||Zt().Client,this.Promise=this.options.Promise||Qt.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(v=>{this._remove(v.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;let p=this._pendingQueue.shift();if(this._idle.length){let v=this._idle.pop();clearTimeout(v.timeoutId);let w=v.client;w.ref&&w.ref();let E=v.idleListener;return this._acquireClient(w,p,E,!1)}if(!this._isFull())return this.newClient(p);throw new Error("unexpected condition")}_remove(p){let v=a(this._idle,w=>w.client===p);v!==void 0&&clearTimeout(v.timeoutId),this._clients=this._clients.filter(w=>w!==p),p.end(),this.emit("remove",p)}connect(p){if(this.ending){let E=new Error("Cannot use a pool after calling end on the pool");return p?p(E):this.Promise.reject(E)}let v=g(this.Promise,p),w=v.result;if(this._isFull()||this._idle.length){if(this._idle.length&&J.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new u(v.callback)),w;let E=m((R,S,C)=>{clearTimeout(M),v.callback(R,S,C)},"queueCallback"),_=new u(E),M=setTimeout(()=>{a(this._pendingQueue,R=>R.callback===E),_.timedOut=!0,v.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return M.unref&&M.unref(),this._pendingQueue.push(_),w}return this.newClient(new u(v.callback)),w}newClient(p){let v=new this.Client(this.options);this._clients.push(v);let w=x(this,v);this.log("checking client timeout");let E,_=!1;this.options.connectionTimeoutMillis&&(E=setTimeout(()=>{this.log("ending client due to timeout"),_=!0,v.connection?v.connection.stream.destroy():v.end()},this.options.connectionTimeoutMillis)),this.log("connecting new client"),v.connect(M=>{if(E&&clearTimeout(E),v.on("error",w),M)this.log("client failed to connect",M),this._clients=this._clients.filter(R=>R!==v),_&&(M=new Error("Connection terminated due to connection timeout",{cause:M})),this._pulseQueue(),p.timedOut||p.callback(M,void 0,r);else{if(this.log("new client connected"),this.options.maxLifetimeSeconds!==0){let R=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(v),this._idle.findIndex(S=>S.client===v)!==-1&&this._acquireClient(v,new u((S,C,L)=>L()),w,!1)},this.options.maxLifetimeSeconds*1e3);R.unref(),v.once("end",()=>clearTimeout(R))}return this._acquireClient(v,p,w,!0)}})}_acquireClient(p,v,w,E){E&&this.emit("connect",p),this.emit("acquire",p),p.release=this._releaseOnce(p,w),p.removeListener("error",w),v.timedOut?E&&this.options.verify?this.options.verify(p,p.release):p.release():E&&this.options.verify?this.options.verify(p,_=>{if(_)return p.release(_),v.callback(_,void 0,r);v.callback(void 0,p,p.release)}):v.callback(void 0,p,p.release)}_releaseOnce(p,v){let w=!1;return E=>{w&&f(),w=!0,this._release(p,v,E)}}_release(p,v,w){if(p.on("error",v),p._poolUseCount=(p._poolUseCount||0)+1,this.emit("release",w,p),w||this.ending||!p._queryable||p._ending||p._poolUseCount>=this.options.maxUses){p._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(p),this._pulseQueue();return}if(this._expired.has(p)){this.log("remove expired client"),this._expired.delete(p),this._remove(p),this._pulseQueue();return}let E;this.options.idleTimeoutMillis&&this._isAboveMin()&&(E=setTimeout(()=>{this.log("remove idle client"),this._remove(p)},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&E.unref()),this.options.allowExitOnIdle&&p.unref(),this._idle.push(new l(p,v,E)),this._pulseQueue()}query(p,v,w){if(typeof p=="function"){let _=g(this.Promise,p);return vs(function(){return _.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),_.result}typeof v=="function"&&(w=v,v=void 0);let E=g(this.Promise,w);return w=E.callback,this.connect((_,M)=>{if(_)return w(_);let R=!1,S=m(C=>{R||(R=!0,M.release(C),w(C))},"onError");M.once("error",S),this.log("dispatching query");try{M.query(p,v,(C,L)=>{if(this.log("query dispatched"),M.removeListener("error",S),!R)return R=!0,M.release(C),C?w(C):w(void 0,L)})}catch(C){return M.release(C),w(C)}}),E.result}end(p){if(this.log("ending"),this.ending){let w=new Error("Called end on pool more than once");return p?p(w):this.Promise.reject(w)}this.ending=!0;let v=g(this.Promise,p);return this._endCallback=v.callback,this._pulseQueue(),v.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((p,v)=>p+(this._expired.has(v)?1:0),0)}get totalCount(){return this._clients.length}};m(b,"Pool");var y=b;t.exports=y}),Wi={};ke(Wi,{default:()=>Gi});var Gi,Fa=me(()=>{q(),Gi={}}),Ua=Z((e,t)=>{t.exports={name:"pg",version:"8.8.0",description:"PostgreSQL client - pure javascript & libpq with the same API",keywords:["database","libpq","pg","postgre","postgres","postgresql","rdbms"],homepage:"https://github.com/brianc/node-postgres",repository:{type:"git",url:"git://github.com/brianc/node-postgres.git",directory:"packages/pg"},author:"Brian Carlson <brian.m.carlson@gmail.com>",main:"./lib",dependencies:{"buffer-writer":"2.0.0","packet-reader":"1.0.0","pg-connection-string":"^2.5.0","pg-pool":"^3.5.2","pg-protocol":"^1.5.0","pg-types":"^2.1.0",pgpass:"1.x"},devDependencies:{async:"2.6.4",bluebird:"3.5.2",co:"4.6.0","pg-copy-streams":"0.3.0"},peerDependencies:{"pg-native":">=3.0.1"},peerDependenciesMeta:{"pg-native":{optional:!0}},scripts:{test:"make test-all"},files:["lib","SPONSORS.md"],license:"MIT",engines:{node:">= 8.0.0"},gitHead:"c99fb2c127ddf8d712500db2c7b9a5491a178655"}}),za=Z((e,t)=>{q();var s=Xe().EventEmitter,r=(Jt(),ue(Ot)),a=Kt(),n=t.exports=function(o,u,f){s.call(this),o=a.normalizeQueryConfig(o,u,f),this.text=o.text,this.values=o.values,this.name=o.name,this.callback=o.callback,this.state="new",this._arrayMode=o.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(g){g==="row"&&(this._emitRowEvents=!0)}).bind(this))};r.inherits(n,s);var l={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};n.prototype.handleError=function(o){var u=this.native.pq.resultErrorFields();if(u)for(var f in u){var g=l[f]||f;o[g]=u[f]}this.callback?this.callback(o):this.emit("error",o),this.state="error"},n.prototype.then=function(o,u){return this._getPromise().then(o,u)},n.prototype.catch=function(o){return this._getPromise().catch(o)},n.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(o,u){this._once("end",o),this._once("error",u)}).bind(this)),this._promise)},n.prototype.submit=function(o){this.state="running";var u=this;this.native=o.native,o.native.arrayMode=this._arrayMode;var f=m(function(b,y,d){if(o.native.arrayMode=!1,vs(function(){u.emit("_done")}),b)return u.handleError(b);u._emitRowEvents&&(d.length>1?y.forEach((p,v)=>{p.forEach(w=>{u.emit("row",w,d[v])})}):y.forEach(function(p){u.emit("row",p,d)})),u.state="end",u.emit("end",d),u.callback&&u.callback(null,d)},"after");if(J.domain&&(f=J.domain.bind(f)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));var g=(this.values||[]).map(a.prepareValue);if(o.namedQueries[this.name]){if(this.text&&o.namedQueries[this.name]!==this.text){let b=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return f(b)}return o.native.execute(this.name,g,f)}return o.native.prepare(this.name,this.text,g.length,function(b){return b?f(b):(o.namedQueries[u.name]=u.text,u.native.execute(u.name,g,f))})}else if(this.values){if(!Array.isArray(this.values)){let b=new Error("Query values must be an array");return f(b)}var x=this.values.map(a.prepareValue);o.native.query(this.text,x,f)}else o.native.query(this.text,f)}}),$a=Z((e,t)=>{q();var s=(Fa(),ue(Wi)),r=xs();Ua();var a=Xe().EventEmitter,n=(Jt(),ue(Ot)),l=ks(),o=za(),u=t.exports=function(f){a.call(this),f=f||{},this._Promise=f.Promise||Qt.Promise,this._types=new r(f.types),this.native=new s({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;var g=this.connectionParameters=new l(f);this.user=g.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:g.password}),this.database=g.database,this.host=g.host,this.port=g.port,this.namedQueries={}};u.Query=o,n.inherits(u,a),u.prototype._errorAllQueries=function(f){let g=m(x=>{J.nextTick(()=>{x.native=this.native,x.handleError(f)})},"enqueueError");this._hasActiveQuery()&&(g(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(g),this._queryQueue.length=0},u.prototype._connect=function(f){var g=this;if(this._connecting){J.nextTick(()=>f(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(x,b){if(x)return f(x);g.native.connect(b,function(y){if(y)return g.native.end(),f(y);g._connected=!0,g.native.on("error",function(d){g._queryable=!1,g._errorAllQueries(d),g.emit("error",d)}),g.native.on("notification",function(d){g.emit("notification",{channel:d.relname,payload:d.extra})}),g.emit("connect"),g._pulseQueryQueue(!0),f()})})},u.prototype.connect=function(f){if(f){this._connect(f);return}return new this._Promise((g,x)=>{this._connect(b=>{b?x(b):g()})})},u.prototype.query=function(f,g,x){var b,y,d,p,v;if(f==null)throw new TypeError("Client was passed a null or undefined query");if(typeof f.submit=="function")d=f.query_timeout||this.connectionParameters.query_timeout,y=b=f,typeof g=="function"&&(f.callback=g);else if(d=this.connectionParameters.query_timeout,b=new o(f,g,x),!b.callback){let w,E;y=new this._Promise((_,M)=>{w=_,E=M}),b.callback=(_,M)=>_?E(_):w(M)}return d&&(v=b.callback,p=setTimeout(()=>{var w=new Error("Query read timeout");J.nextTick(()=>{b.handleError(w,this.connection)}),v(w),b.callback=()=>{};var E=this._queryQueue.indexOf(b);E>-1&&this._queryQueue.splice(E,1),this._pulseQueryQueue()},d),b.callback=(w,E)=>{clearTimeout(p),v(w,E)}),this._queryable?this._ending?(b.native=this.native,J.nextTick(()=>{b.handleError(new Error("Client was closed and is not queryable"))}),y):(this._queryQueue.push(b),this._pulseQueryQueue(),y):(b.native=this.native,J.nextTick(()=>{b.handleError(new Error("Client has encountered a connection error and is not queryable"))}),y)},u.prototype.end=function(f){var g=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,f));var x;return f||(x=new this._Promise(function(b,y){f=m(d=>d?y(d):b(),"cb")})),this.native.end(function(){g._errorAllQueries(new Error("Connection terminated")),J.nextTick(()=>{g.emit("end"),f&&f()})}),x},u.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},u.prototype._pulseQueryQueue=function(f){if(this._connected&&!this._hasActiveQuery()){var g=this._queryQueue.shift();if(!g){f||this.emit("drain");return}this._activeQuery=g,g.submit(this);var x=this;g.once("_done",function(){x._pulseQueryQueue()})}},u.prototype.cancel=function(f){this._activeQuery===f?this.native.cancel(function(){}):this._queryQueue.indexOf(f)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(f),1)},u.prototype.ref=function(){},u.prototype.unref=function(){},u.prototype.setTypeParser=function(f,g,x){return this._types.setTypeParser(f,g,x)},u.prototype.getTypeParser=function(f,g){return this._types.getTypeParser(f,g)}}),$s=Z((e,t)=>{q(),t.exports=$a()}),Zt=Z((e,t)=>{q();var s=Ba(),r=Xt(),a=Hi(),n=Pa(),{DatabaseError:l}=ji(),o=m(f=>{var g;return g=class extends n{constructor(x){super(x,f)}},m(g,"BoundPool"),g},"poolFactory"),u=m(function(f){this.defaults=r,this.Client=f,this.Query=this.Client.Query,this.Pool=o(this.Client),this._pools=[],this.Connection=a,this.types=Yt(),this.DatabaseError=l},"PG");typeof J.env.NODE_PG_FORCE_NATIVE<"u"?t.exports=new u($s()):(t.exports=new u(s),Object.defineProperty(t.exports,"native",{configurable:!0,enumerable:!1,get(){var f=null;try{f=new u($s())}catch(g){if(g.code!=="MODULE_NOT_FOUND")throw g}return Object.defineProperty(t.exports,"native",{value:f}),f}}))});q();q();At();Ei();q();var ja=Object.defineProperty,qa=Object.defineProperties,Va=Object.getOwnPropertyDescriptors,js=Object.getOwnPropertySymbols,Ha=Object.prototype.hasOwnProperty,Wa=Object.prototype.propertyIsEnumerable,qs=m((e,t,s)=>t in e?ja(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,"__defNormalProp"),Ga=m((e,t)=>{for(var s in t||(t={}))Ha.call(t,s)&&qs(e,s,t[s]);if(js)for(var s of js(t))Wa.call(t,s)&&qs(e,s,t[s]);return e},"__spreadValues"),Qa=m((e,t)=>qa(e,Va(t)),"__spreadProps"),Ya=1008e3,Vs=new Uint8Array(new Uint16Array([258]).buffer)[0]===2,Xa=new TextDecoder,Ts=new TextEncoder,Pt=Ts.encode("0123456789abcdef"),Ft=Ts.encode("0123456789ABCDEF"),Ka=Ts.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Qi=Ka.slice();Qi[62]=45;Qi[63]=95;var yt,Ut;function Yi(e,{alphabet:t,scratchArr:s}={}){if(!yt)if(yt=new Uint16Array(256),Ut=new Uint16Array(256),Vs)for(let y=0;y<256;y++)yt[y]=Pt[y&15]<<8|Pt[y>>>4],Ut[y]=Ft[y&15]<<8|Ft[y>>>4];else for(let y=0;y<256;y++)yt[y]=Pt[y&15]|Pt[y>>>4]<<8,Ut[y]=Ft[y&15]|Ft[y>>>4]<<8;e.byteOffset%4!==0&&(e=new Uint8Array(e));let r=e.length,a=r>>>1,n=r>>>2,l=s||new Uint16Array(r),o=new Uint32Array(e.buffer,e.byteOffset,n),u=new Uint32Array(l.buffer,l.byteOffset,a),f=t==="upper"?Ut:yt,g=0,x=0,b;if(Vs)for(;g<n;)b=o[g++],u[x++]=f[b>>>8&255]<<16|f[b&255],u[x++]=f[b>>>24]<<16|f[b>>>16&255];else for(;g<n;)b=o[g++],u[x++]=f[b>>>24]<<16|f[b>>>16&255],u[x++]=f[b>>>8&255]<<16|f[b&255];for(g<<=2;g<r;)l[g]=f[e[g++]];return Xa.decode(l.subarray(0,r))}m(Yi,"_toHex");function Xi(e,t={}){let s="",r=e.length,a=Ya>>>1,n=Math.ceil(r/a),l=new Uint16Array(n>1?a:r);for(let o=0;o<n;o++){let u=o*a,f=u+a;s+=Yi(e.subarray(u,f),Qa(Ga({},t),{scratchArr:l}))}return s}m(Xi,"_toHexChunked");function Ki(e,t={}){return t.alphabet!=="upper"&&typeof e.toHex=="function"?e.toHex():Xi(e,t)}m(Ki,"toHex");q();var Ji=class Zi{constructor(t,s){this.strings=t,this.values=s}toParameterizedQuery(t={query:"",params:[]}){var a;let{strings:s,values:r}=this;for(let n=0,l=s.length;n<l;n++)if(t.query+=s[n],n<r.length){let o=r[n];if(o instanceof sr)t.query+=o.sql;else if(o instanceof Vt)if(o.queryData instanceof Zi)o.queryData.toParameterizedQuery(t);else{if((a=o.queryData.params)!=null&&a.length)throw new Error("This query is not composable");t.query+=o.queryData.query}else{let{params:u}=t;u.push(o),t.query+="$"+u.length,(o instanceof W||ArrayBuffer.isView(o))&&(t.query+="::bytea")}}return t}};m(Ji,"SqlTemplate");var er=Ji,tr=class{constructor(t){this.sql=t}};m(tr,"UnsafeRawSql");var sr=tr;q();function Is(){typeof window<"u"&&typeof document<"u"&&typeof console<"u"&&typeof console.warn=="function"&&console.warn(`          
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
        ************************************************************`)}m(Is,"warnIfBrowser");At();var Ja=Ye(xs()),Za=Ye(Kt()),ir=class rr extends Error{constructor(t){super(t),Q(this,"name","NeonDbError"),Q(this,"severity"),Q(this,"code"),Q(this,"detail"),Q(this,"hint"),Q(this,"position"),Q(this,"internalPosition"),Q(this,"internalQuery"),Q(this,"where"),Q(this,"schema"),Q(this,"table"),Q(this,"column"),Q(this,"dataType"),Q(this,"constraint"),Q(this,"file"),Q(this,"line"),Q(this,"routine"),Q(this,"sourceError"),"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,rr)}};m(ir,"NeonDbError");var it=ir,Hs="transaction() expects an array of queries, or a function returning an array of queries",en=["severity","code","detail","hint","position","internalPosition","internalQuery","where","schema","table","column","dataType","constraint","file","line","routine"];function ar(e){return e instanceof W?"\\x"+Ki(e):e}m(ar,"encodeBuffersAsBytea");function gs(e){let{query:t,params:s}=e instanceof er?e.toParameterizedQuery():e;return{query:t,params:s.map(r=>ar((0,Za.prepareValue)(r)))}}m(gs,"prepareQuery");function Cs(e,{arrayMode:t,fullResults:s,fetchOptions:r,isolationLevel:a,readOnly:n,deferrable:l,authToken:o,disableWarningInBrowsers:u}={}){if(!e)throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");let f;try{f=ys(e)}catch{throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: "+String(e))}let{protocol:g,username:x,hostname:b,port:y,pathname:d}=f;if(g!=="postgres:"&&g!=="postgresql:"||!x||!b||!d)throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");function p(w,...E){if(!(Array.isArray(w)&&Array.isArray(w.raw)&&Array.isArray(E)))throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');return new Vt(v,new er(w,E))}m(p,"templateFn"),p.query=(w,E,_)=>new Vt(v,{query:w,params:E??[]},_),p.unsafe=w=>new sr(w),p.transaction=async(w,E)=>{if(typeof w=="function"&&(w=w(p)),!Array.isArray(w))throw new Error(Hs);w.forEach(R=>{if(!(R instanceof Vt))throw new Error(Hs)});let _=w.map(R=>R.queryData),M=w.map(R=>R.opts??{});return v(_,M,E)};async function v(w,E,_){let{fetchEndpoint:M,fetchFunction:R}=_t,S=Array.isArray(w)?{queries:w.map(te=>gs(te))}:gs(w),C=r??{},L=t??!1,k=s??!1,D=a,A=n,z=l;_!==void 0&&(_.fetchOptions!==void 0&&(C={...C,..._.fetchOptions}),_.arrayMode!==void 0&&(L=_.arrayMode),_.fullResults!==void 0&&(k=_.fullResults),_.isolationLevel!==void 0&&(D=_.isolationLevel),_.readOnly!==void 0&&(A=_.readOnly),_.deferrable!==void 0&&(z=_.deferrable)),E!==void 0&&!Array.isArray(E)&&E.fetchOptions!==void 0&&(C={...C,...E.fetchOptions});let $=o;!Array.isArray(E)&&(E==null?void 0:E.authToken)!==void 0&&($=E.authToken);let B=typeof M=="function"?M(b,y,{jwtAuth:$!==void 0}):M,U={"Neon-Connection-String":e,"Neon-Raw-Text-Output":"true","Neon-Array-Mode":"true"},H=await or($);H&&(U.Authorization=`Bearer ${H}`),Array.isArray(w)&&(D!==void 0&&(U["Neon-Batch-Isolation-Level"]=D),A!==void 0&&(U["Neon-Batch-Read-Only"]=String(A)),z!==void 0&&(U["Neon-Batch-Deferrable"]=String(z))),u||_t.disableWarningInBrowsers||Is();let Y;try{Y=await(R??fetch)(B,{method:"POST",body:JSON.stringify(S),headers:U,...C})}catch(te){let K=new it(`Error connecting to database: ${te}`);throw K.sourceError=te,K}if(Y.ok){let te=await Y.json();if(Array.isArray(w)){let K=te.results;if(!Array.isArray(K))throw new it("Neon internal error: unexpected result format");return K.map((be,ie)=>{let le=E[ie]??{},ht=le.arrayMode??L,ft=le.fullResults??k;return ms(be,{arrayMode:ht,fullResults:ft,types:le.types})})}else{let K=E??{},be=K.arrayMode??L,ie=K.fullResults??k;return ms(te,{arrayMode:be,fullResults:ie,types:K.types})}}else{let{status:te}=Y;if(te===400){let K=await Y.json(),be=new it(K.message);for(let ie of en)be[ie]=K[ie]??void 0;throw be}else{let K=await Y.text();throw new it(`Server error (HTTP status ${te}): ${K}`)}}}return m(v,"execute"),p}m(Cs,"neon");var nr=class{constructor(t,s,r){this.execute=t,this.queryData=s,this.opts=r}then(t,s){return this.execute(this.queryData,this.opts).then(t,s)}catch(t){return this.execute(this.queryData,this.opts).catch(t)}finally(t){return this.execute(this.queryData,this.opts).finally(t)}};m(nr,"NeonQueryPromise");var Vt=nr;function ms(e,{arrayMode:t,fullResults:s,types:r}){let a=new Ja.default(r),n=e.fields.map(u=>u.name),l=e.fields.map(u=>a.getTypeParser(u.dataTypeID)),o=t===!0?e.rows.map(u=>u.map((f,g)=>f===null?null:l[g](f))):e.rows.map(u=>Object.fromEntries(u.map((f,g)=>[n[g],f===null?null:l[g](f)])));return s?(e.viaNeonFetch=!0,e.rowAsArray=t,e.rows=o,e._parsers=l,e._types=a,e):o}m(ms,"processQueryResult");async function or(e){if(typeof e=="string")return e;if(typeof e=="function")try{return await Promise.resolve(e())}catch(t){let s=new it("Error getting auth token.");throw t instanceof Error&&(s=new it(`Error getting auth token: ${t.message}`)),s}}m(or,"getAuthToken");q();var tn=Ye(Zt());q();var sn=Ye(Zt()),lr=class extends sn.Client{constructor(t){super(t),this.config=t}get neonConfig(){return this.connection.stream}connect(t){var f,g;let{neonConfig:s}=this;s.forceDisablePgSSL&&(this.ssl=this.connection.ssl=!1),this.ssl&&s.useSecureWebSocket&&console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");let r=typeof this.config!="string"&&((f=this.config)==null?void 0:f.host)!==void 0||typeof this.config!="string"&&((g=this.config)==null?void 0:g.connectionString)!==void 0||J.env.PGHOST!==void 0,a=J.env.USER??J.env.USERNAME;if(!r&&this.host==="localhost"&&this.user===a&&this.database===a&&this.password===null)throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${a}, db: ${a}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);let n=super.connect(t),l=s.pipelineTLS&&this.ssl,o=s.pipelineConnect==="password";if(!l&&!s.pipelineConnect)return n;let u=this.connection;if(l&&u.on("connect",()=>u.stream.emit("data","S")),o){u.removeAllListeners("authenticationCleartextPassword"),u.removeAllListeners("readyForQuery"),u.once("readyForQuery",()=>u.on("readyForQuery",this._handleReadyForQuery.bind(this)));let x=this.ssl?"sslconnect":"connect";u.on(x,()=>{this.neonConfig.disableWarningInBrowsers||Is(),this._handleAuthCleartextPassword(),this._handleReadyForQuery()})}return n}async _handleAuthSASLContinue(t){if(typeof crypto>"u"||crypto.subtle===void 0||crypto.subtle.importKey===void 0)throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");let s=crypto.subtle,r=this.saslSession,a=this.password,n=t.data;if(r.message!=="SASLInitialResponse"||typeof a!="string"||typeof n!="string")throw new Error("SASL: protocol error");let l=Object.fromEntries(n.split(",").map(te=>{if(!/^.=/.test(te))throw new Error("SASL: Invalid attribute pair entry");let K=te[0],be=te.substring(2);return[K,be]})),o=l.r,u=l.s,f=l.i;if(!o||!/^[!-+--~]+$/.test(o))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");if(!u||!/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(u))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");if(!f||!/^[1-9][0-9]*$/.test(f))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");if(!o.startsWith(r.clientNonce))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");if(o.length===r.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");let g=parseInt(f,10),x=W.from(u,"base64"),b=new TextEncoder,y=b.encode(a),d=await s.importKey("raw",y,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),p=new Uint8Array(await s.sign("HMAC",d,W.concat([x,W.from([0,0,0,1])]))),v=p;for(var w=0;w<g-1;w++)p=new Uint8Array(await s.sign("HMAC",d,p)),v=W.from(v.map((te,K)=>v[K]^p[K]));let E=v,_=await s.importKey("raw",E,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),M=new Uint8Array(await s.sign("HMAC",_,b.encode("Client Key"))),R=await s.digest("SHA-256",M),S="n=*,r="+r.clientNonce,C="r="+o+",s="+u+",i="+g,L="c=biws,r="+o,k=S+","+C+","+L,D=await s.importKey("raw",R,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var A=new Uint8Array(await s.sign("HMAC",D,b.encode(k))),z=W.from(M.map((te,K)=>M[K]^A[K])),$=z.toString("base64");let B=await s.importKey("raw",E,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),U=await s.sign("HMAC",B,b.encode("Server Key")),H=await s.importKey("raw",U,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var Y=W.from(await s.sign("HMAC",H,b.encode(k)));r.message="SASLResponse",r.serverSignature=Y.toString("base64"),r.response=L+",p="+$,this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}};m(lr,"NeonClient");var rn=lr;At();var an=Ye(ks());function dr(e,t){if(t)return{callback:t,result:void 0};let s,r,a=m(function(l,o){l?s(l):r(o)},"cb"),n=new e(function(l,o){r=l,s=o});return{callback:a,result:n}}m(dr,"promisify");var nn=class extends tn.Pool{constructor(){super(...arguments),Q(this,"Client",rn),Q(this,"hasFetchUnsupportedListeners",!1),Q(this,"addListener",this.on)}on(t,s){return t!=="error"&&(this.hasFetchUnsupportedListeners=!0),super.on(t,s)}query(t,s,r){var n;if(!_t.poolQueryViaFetch||this.hasFetchUnsupportedListeners||typeof t=="function")return super.query(t,s,r);typeof s=="function"&&(r=s,s=void 0);let a=dr(this.Promise,r);r=a.callback;try{let l=new an.default(this.options),o=encodeURIComponent,u=encodeURI,f=`postgresql://${o(l.user)}:${o(l.password)}@${o(l.host)}/${u(l.database)}`,g=typeof t=="string"?t:t.text,x=s??t.values??[];Cs(f,{fullResults:!0,arrayMode:t.rowMode==="array"}).query(g,x,{types:t.types??((n=this.options)==null?void 0:n.types)}).then(b=>r(void 0,b)).catch(b=>r(b))}catch(l){r(l)}return a.result}};m(nn,"NeonPool");At();var Mt=Ye(Zt());Mt.DatabaseError;Mt.defaults;Mt.escapeIdentifier;Mt.escapeLiteral;Mt.types;/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/var on={};const j=new bi,ln=on.DATABASE_URL||"postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",O=Cs(ln);function es(e){if(!e)return"";const t=e.split(/\s+/);for(let s=1;s<t.length;s++)if(t[s].endsWith("구")&&!t[s].endsWith("시구"))return t[s].replace(/구$/,"");for(let s=1;s<t.length;s++)if(t[s].endsWith("시")&&t[s]!==t[0])return t[s].replace(/(특별시|광역시|특별자치시|시)$/,"");return t[0]?t[0].replace(/(특별자치도|도)$/,""):""}function Ls(e){if(!e)return"";const t=e.split(/\s+/);return t[0]?t[0].replace(/(특별시|광역시|특별자치시|특별자치도|도|시)$/,""):""}function dn(e){return{마사지:"MassageTherapist",헤드스파:"BeautySalon",피부관리:"BeautySalon",헤어:"HairSalon",메이크업:"BeautySalon",왁싱:"BeautySalon",반영구:"BeautySalon",병원:"MedicalBusiness",그외:"LocalBusiness"}[e]||"LocalBusiness"}function cn(e){const t=es(e.address),s=Ls(e.address),r=t||s;return`${e.name} ${r?r+" ":""}${e.category} 추천 | 마이뷰티맵`}function cr(e){const t=es(e.address),s=Ls(e.address),r=Array.isArray(e.tags)&&e.tags.length?e.tags.join("·")+" ":"",a=t||s,n=e.price?` 가격 ${e.price}.`:"",l=e.desc?" "+e.desc.slice(0,40):"";return`${e.name} | ${a?a+" ":""}${e.category} 잘하는 곳. ${r}예약·위치·가격 한눈에 확인!${n}${l}`.slice(0,160)}function pn(e,t){return`${t} ${e} 추천 TOP | 마이뷰티맵`}function un(e,t,s){return`${t} ${e} 잘하는 곳 ${s}곳 추천! 가격·위치·예약·후기까지 마이뷰티맵에서 한눈에 확인하세요.`}function hn(e,t){const s=t;return[`${s} ${e}`,`${s} ${e} 추천`,`${s} ${e} 잘하는 곳`,`${s} ${e} 예약`,`${s} ${e} 가격`,`${s} ${e} 후기`,`${s} ${e} 맛집`,`${s} 뷰티샵`,`${s} 뷰티 추천`,`${e} 추천`].join(",")}function ve(){return new Date(Date.now()+540*60*1e3).toISOString().slice(0,10)}function pr(){return new Date(Date.now()+540*60*1e3-864e5).toISOString().slice(0,10)}function ur(e){const t=(e??"").trim();if(!t)return"";if(/^[A-Za-z0-9_-]{11}$/.test(t))return t;const s=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);return s?s[1]:t}function fn(e){return e.plan!=="shoot"||!e.paid_until?!1:new Date(e.paid_until)>=new Date}function Ue(e){return{id:e.id,name:e.name,category:e.category,tags:e.tags??[],price:e.price??"",address:e.address??"",district:e.district??"",lat:parseFloat(e.lat)||37.5326,lng:parseFloat(e.lng)||127.0246,smartPlaceUrl:e.smart_place_url??"",youtubeId:e.youtube_id??"",featured:e.featured??!1,thumbnail:e.thumbnail??"",phone:e.phone??"",desc:e.description??"",active:e.active??!0,displayMode:e.display_mode??"both",plan:e.plan??"basic",paidUntil:e.paid_until??null,paymentStatus:e.payment_status??"unpaid",paymentMemo:e.payment_memo??"",views:parseInt(e.view_cnt)||0,feedSP:parseInt(e.feed_sp)||0,mapSP:parseInt(e.map_sp)||0,isPremium:fn(e),isRecommended:e.is_recommended??!1}}function gn(e,t,s,r){const n=(s-e)*Math.PI/180,l=(r-t)*Math.PI/180,o=Math.sin(n/2)**2+Math.cos(e*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(l/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}let Ws=!1,zt=null;async function mn(){if(!Ws)return zt||(zt=(async()=>{try{await O`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token   TEXT`}catch{}try{await O`ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed     INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog  INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map      INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS rec_view     INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`CREATE TABLE IF NOT EXISTS honey_items (
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
      )`}catch{}try{await O`ALTER TABLE honey_items ADD COLUMN IF NOT EXISTS coupang_url2 TEXT NOT NULL DEFAULT ''`}catch{}try{await O`CREATE TABLE IF NOT EXISTS shorts_items (
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
      )`;try{await O`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS smart_place_url TEXT NOT NULL DEFAULT ''`}catch{}try{await O`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS view_cnt INTEGER NOT NULL DEFAULT 0`}catch{}try{await O`ALTER TABLE shorts_items ADD COLUMN IF NOT EXISTS sp_cnt INTEGER NOT NULL DEFAULT 0`}catch{}}catch{}Ws=!0})(),zt)}j.use("*",async(e,t)=>(await mn(),t()));j.get("/api/shops",async e=>{const t=e.req.query("category")??"",s=(e.req.query("q")??"").toLowerCase(),r=parseFloat(e.req.query("lat")??""),a=parseFloat(e.req.query("lng")??""),n=e.req.query("nearby")==="1",l=e.req.query("shuffle")==="1";let u=(await O`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `).map(Ue);if(t==="recommended"?u=u.filter(f=>f.isRecommended):t&&t!=="all"&&(u=u.filter(f=>f.category===t)),s&&(u=u.filter(f=>f.name.toLowerCase().includes(s)||(f.tags||[]).some(g=>g.toLowerCase().includes(s))||f.district.toLowerCase().includes(s))),n&&!isNaN(r)&&!isNaN(a))u=u.map(f=>({...f,dist:gn(r,a,f.lat,f.lng)})).filter(f=>f.dist<=20).sort((f,g)=>f.isPremium&&!g.isPremium?-1:!f.isPremium&&g.isPremium?1:f.dist-g.dist);else if(l){const f=u.filter(x=>x.isPremium),g=u.filter(x=>!x.isPremium);for(let x=f.length-1;x>0;x--){const b=Math.floor(Math.random()*(x+1));[f[x],f[b]]=[f[b],f[x]]}for(let x=g.length-1;x>0;x--){const b=Math.floor(Math.random()*(x+1));[g[x],g[b]]=[g[b],g[x]]}u=[...f,...g]}else u.sort((f,g)=>f.isPremium&&!g.isPremium?-1:!f.isPremium&&g.isPremium?1:0);return e.json(u)});j.get("/api/geocode",async e=>{var o,u,f,g,x;const t=e.req.query("query")??"";if(!t)return e.json({error:"query required"},400);const s=b=>b.replace(/(로|길|번길)\s+(\d)/g,"$1$2"),r=[],a=s(t);a!==t&&r.push(a),r.push(t);const n=a.trim().split(/\s+/);n.length>3&&r.push(n.slice(0,-1).join(" "));const l=async b=>(await fetch(`https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(b)}`,{headers:{"X-NCP-APIGW-API-KEY-ID":"xjjg4490h8","X-NCP-APIGW-API-KEY":"RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD"}})).json();try{let b=null;for(const E of r){const _=await l(E);if((o=_.addresses)!=null&&o.length){b=_.addresses[0];break}}if(!b)return e.json({error:"주소를 찾을 수 없어요"},404);const y=b.addressElements||[],d=((u=y.find(E=>{var _;return(_=E.types)==null?void 0:_.includes("SIDO")}))==null?void 0:u.longName)||"",p=((f=y.find(E=>{var _;return(_=E.types)==null?void 0:_.includes("SIGUGUN")}))==null?void 0:f.longName)||"",v=((g=y.find(E=>{var _,M;return((_=E.types)==null?void 0:_.includes("DONGMYUN"))||((M=E.types)==null?void 0:M.includes("RI"))}))==null?void 0:g.longName)||"",w=[d,p,v].filter(Boolean).join(" ")||((x=b.roadAddress)==null?void 0:x.split(" ").slice(0,3).join(" "))||"";return e.json({lat:parseFloat(b.y),lng:parseFloat(b.x),address:b.roadAddress||b.jibunAddress,district:w})}catch{return e.json({error:"지오코딩 실패"},500)}});j.get("/api/shops/all",async e=>{const t=await O`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `;return e.json(t.map(Ue))});j.get("/api/shops/:id",async e=>{const t=+e.req.param("id"),s=await O`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${t}
  `;return s.length?e.json(Ue(s[0])):e.json({error:"not found"},404)});j.post("/api/admin/shops",async e=>{const t=await e.req.json(),s=Array.isArray(t.tags)?t.tags:(t.tags??"").split(",").map(n=>n.trim()).filter(Boolean),a=(await O`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${t.name??"새 업체"}, ${t.category??"피부관리"}, ${s},
       ${t.price??""}, ${t.address??""}, ${t.district??""},
       ${parseFloat(t.lat)||37.5326}, ${parseFloat(t.lng)||127.0246},
       ${t.smartPlaceUrl??""}, ${ur(t.youtubeId??"")},
       ${t.featured??!1},
       ${t.thumbnail??""},
       ${t.phone??""}, ${t.desc??""}, true, ${t.displayMode??"both"})
    RETURNING *
  `)[0];return await O`INSERT INTO stats (shop_id) VALUES (${a.id}) ON CONFLICT DO NOTHING`,e.json(Ue(a))});j.put("/api/admin/shops/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=Array.isArray(s.tags)?s.tags:(s.tags??"").split(",").map(n=>n.trim()).filter(Boolean),a=await O`
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
      youtube_id      = ${ur(s.youtubeId??"")},
      featured        = ${s.featured??!1},
      thumbnail       = ${s.thumbnail??""},
      phone           = ${s.phone??""},
      description     = ${s.desc??""},
      active          = ${s.active??!0},
      display_mode    = ${s.displayMode??"both"}
    WHERE id = ${t}
    RETURNING *
  `;return a.length?(await O`INSERT INTO stats (shop_id) VALUES (${t}) ON CONFLICT DO NOTHING`,e.json(Ue(a[0]))):e.json({error:"not found"},404)});j.put("/api/admin/shops/:id/recommended",async e=>{const t=+e.req.param("id"),{isRecommended:s}=await e.req.json(),r=await O`
    UPDATE shops SET is_recommended = ${!!s}
    WHERE id = ${t} RETURNING *
  `;return r.length?e.json({ok:!0,isRecommended:r[0].is_recommended}):e.json({error:"not found"},404)});j.post("/api/track/rec/:id",async e=>{const t=+e.req.param("id"),s=ve();try{await O`INSERT INTO daily_stats (shop_id, stat_date, rec_view)
                VALUES (${t}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET rec_view = daily_stats.rec_view + 1`}catch{}return e.json({ok:!0})});j.put("/api/admin/shops/:id/payment",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await O`
    UPDATE shops SET
      plan           = ${s.plan??"basic"},
      paid_until     = ${s.paidUntil||null},
      payment_status = ${s.paymentStatus??"unpaid"},
      payment_memo   = ${s.paymentMemo??""}
    WHERE id = ${t}
    RETURNING *
  `;return r.length?e.json(Ue(r[0])):e.json({error:"not found"},404)});j.delete("/api/admin/shops/:id",async e=>{const t=+e.req.param("id");return await O`DELETE FROM shops WHERE id = ${t}`,e.json({ok:!0})});j.post("/api/track/view/:id",async e=>{const t=+e.req.param("id"),s=ve();let r="feed";try{const a=await e.req.json();["feed","catalog","map"].includes(a==null?void 0:a.source)&&(r=a.source)}catch{}await O`INSERT INTO stats (shop_id, view_cnt) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1`;try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}return r==="feed"?await O`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, feed_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt   = daily_stats.view_cnt   + 1,
                    feed_view  = daily_stats.feed_view  + 1`:r==="catalog"?await O`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, catalog_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt      = daily_stats.view_cnt      + 1,
                    catalog_view  = daily_stats.catalog_view  + 1`:await O`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, map_view)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt  = daily_stats.view_cnt  + 1,
                    map_view  = daily_stats.map_view  + 1`,e.json({ok:!0})});j.post("/api/track/sp/:id",async e=>{const t=+e.req.param("id"),s=ve();let r=null;try{const a=await e.req.json();r=(a==null?void 0:a.viewSrc)||null}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed    INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map     INTEGER NOT NULL DEFAULT 0`}catch{}return await O`INSERT INTO stats (shop_id, feed_sp) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1`,r==="feed"?await O`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_feed)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp  = daily_stats.feed_sp  + 1,
                    vts_feed = daily_stats.vts_feed + 1`:r==="catalog"?await O`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_catalog)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp     = daily_stats.feed_sp     + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:r==="map"?await O`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_map)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1,
                    vts_map = daily_stats.vts_map + 1`:await O`INSERT INTO daily_stats (shop_id, stat_date, feed_sp)
                VALUES (${t}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1`,e.json({ok:!0})});j.post("/api/track/mapsp/:id",async e=>{const t=+e.req.param("id"),s=ve();let r=null;try{const a=await e.req.json();r=(a==null?void 0:a.viewSrc)||null}catch{}try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed    INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map     INTEGER NOT NULL DEFAULT 0`}catch{}return await O`INSERT INTO stats (shop_id, map_sp) VALUES (${t}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1`,r==="feed"?await O`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_feed)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp   = daily_stats.map_sp   + 1,
                    vts_feed = daily_stats.vts_feed + 1`:r==="catalog"?await O`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_catalog)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp      = daily_stats.map_sp      + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:await O`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_map)
                VALUES (${t}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp  = daily_stats.map_sp  + 1,
                    vts_map = daily_stats.vts_map + 1`,e.json({ok:!0})});j.post("/api/track/visit",async e=>{const t=ve();return await O`
    INSERT INTO daily_visits (visit_date, visit_cnt) VALUES (${t}, 1)
    ON CONFLICT (visit_date) DO UPDATE SET visit_cnt = daily_visits.visit_cnt + 1
  `,e.json({ok:!0})});j.get("/api/admin/daily-visits",async e=>{const t=await O`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    ORDER BY visit_date DESC
    LIMIT 30
  `;return e.json(t)});j.post("/api/admin/reset-stats",async e=>(await O`UPDATE stats SET view_cnt=0, feed_sp=0, map_sp=0`,await O`DELETE FROM daily_visits`,await O`DELETE FROM daily_stats`,e.json({ok:!0})));j.post("/api/admin/init-daily-stats",async e=>(await O`
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
  `,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_feed     INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_catalog  INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS vts_map      INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS rec_view     INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token   TEXT`,await O`ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`,e.json({ok:!0})));j.get("/api/admin/stats",async e=>{const t=ve(),s=pr();await O`
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
  `;try{await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS feed_view    INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS catalog_view INTEGER NOT NULL DEFAULT 0`,await O`ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS map_view     INTEGER NOT NULL DEFAULT 0`}catch{}const r=await O`
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
  `,a=await O`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${t}
  `,n=await O`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${s}
  `,l=await O`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '13 days')
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,o=await O`
    SELECT shop_id, COALESCE(SUM(rec_view),0) as total_rec
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY shop_id
    HAVING SUM(rec_view) > 0
    ORDER BY total_rec DESC
  `,u={};o.forEach(v=>{u[v.shop_id]=parseInt(v.total_rec)||0});const f=await O`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `,g=await O`SELECT COUNT(*) as cnt FROM shops WHERE active = true`,x=f[0]||{},b=a[0]||{},y=n[0]||{},d=await O`
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
  `,p={};return d.forEach(v=>{p[v.shop_id]={todayViews:parseInt(v.view_cnt)||0,todayFeedSP:parseInt(v.feed_sp)||0,todayMapSP:parseInt(v.map_sp)||0,todayFeedView:parseInt(v.feed_view)||0,todayCatalogView:parseInt(v.catalog_view)||0,todayMapView:parseInt(v.map_view)||0,todayVtsFeed:parseInt(v.vts_feed)||0,todayVtsCatalog:parseInt(v.vts_catalog)||0,todayVtsMap:parseInt(v.vts_map)||0,todayRecView:parseInt(v.rec_view)||0}}),e.json({stats:r.map(v=>{var w,E,_,M,R,S,C,L,k,D;return{id:v.id,name:v.name,category:v.category,thumbnail:v.thumbnail,youtubeId:v.youtube_id,featured:v.featured,active:v.active,views:parseInt(v.view_cnt)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,lat:parseFloat(v.lat)||0,lng:parseFloat(v.lng)||0,smartPlaceUrl:v.smart_place_url??"",address:v.address??"",district:v.district??"",phone:v.phone??"",plan:v.plan??"basic",paymentStatus:v.payment_status??"unpaid",paidUntil:v.paid_until?String(v.paid_until).slice(0,10):null,paymentMemo:v.payment_memo??"",displayMode:v.display_mode??"both",priceRange:v.price??"",tags:v.tags??[],description:v.description??"",isRecommended:v.is_recommended??!1,todayViews:((w=p[v.id])==null?void 0:w.todayViews)||0,todayFeedSP:((E=p[v.id])==null?void 0:E.todayFeedSP)||0,todayMapSP:((_=p[v.id])==null?void 0:_.todayMapSP)||0,todayFeedView:((M=p[v.id])==null?void 0:M.todayFeedView)||0,todayCatalogView:((R=p[v.id])==null?void 0:R.todayCatalogView)||0,todayMapView:((S=p[v.id])==null?void 0:S.todayMapView)||0,todayVtsFeed:((C=p[v.id])==null?void 0:C.todayVtsFeed)||0,todayVtsCatalog:((L=p[v.id])==null?void 0:L.todayVtsCatalog)||0,todayVtsMap:((k=p[v.id])==null?void 0:k.todayVtsMap)||0,todayRecView:((D=p[v.id])==null?void 0:D.todayRecView)||0,weekRecView:u[v.id]||0}}),totalViews:parseInt(x.total_views)||0,totalFeedSP:parseInt(x.total_feed_sp)||0,totalMapSP:parseInt(x.total_map_sp)||0,totalShops:parseInt(g[0].cnt)||0,todayViews:parseInt(b.views)||0,todayFeedSP:parseInt(b.feed_sp)||0,todayMapSP:parseInt(b.map_sp)||0,todayRecView:parseInt(b.rec_view)||0,yestViews:parseInt(y.views)||0,yestFeedSP:parseInt(y.feed_sp)||0,yestMapSP:parseInt(y.map_sp)||0,yestRecView:parseInt(y.rec_view)||0,weekChart:l.map(v=>({date:v.stat_date,views:parseInt(v.views)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,recView:parseInt(v.rec_view)||0}))})});j.post("/api/inquiry",async e=>{const t=await e.req.json();return!t.name||!t.phone?e.json({error:"required"},400):(await O`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${t.name}, ${t.owner??""}, ${t.category??""}, ${t.area??""}, ${t.phone},
            ${t.url??""}, ${t.youtubeUrl??""}, ${t.message??""})
  `,e.json({ok:!0}))});j.get("/api/admin/calendar",async e=>{const t=parseInt(e.req.query("year")||String(new Date().getFullYear())),s=parseInt(e.req.query("month")||String(new Date().getMonth()+1)),r=`${t}-${String(s).padStart(2,"0")}-01`,a=new Date(t,s,0).toISOString().slice(0,10),n=await O`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COUNT(DISTINCT shop_id)   as active_shops
    FROM daily_stats
    WHERE stat_date >= ${r}
      AND stat_date <= ${a}
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,l=e.req.query("date");let o=[];l&&(o=await O`
      SELECT s.id, s.name, s.category, s.thumbnail,
             COALESCE(ds.view_cnt,0) as views,
             COALESCE(ds.feed_sp,0)  as feed_sp,
             COALESCE(ds.map_sp,0)   as map_sp
      FROM shops s
      LEFT JOIN daily_stats ds ON s.id = ds.shop_id AND ds.stat_date = ${l}
      WHERE s.active = true
        AND (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)+COALESCE(ds.view_cnt,0)) > 0
      ORDER BY (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)) DESC, COALESCE(ds.view_cnt,0) DESC
    `);const f=(await O`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp
    FROM daily_stats
    WHERE stat_date >= ${r}
      AND stat_date <= ${a}
  `)[0]||{},g=await O`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    WHERE visit_date >= ${r}
      AND visit_date <= ${a}
    ORDER BY visit_date ASC
  `,x={};g.forEach(y=>{x[y.visit_date]=parseInt(y.visit_cnt)||0});const b=g.reduce((y,d)=>y+(parseInt(d.visit_cnt)||0),0);return e.json({year:t,month:s,monthTotal:{views:parseInt(f.views)||0,feedSP:parseInt(f.feed_sp)||0,mapSP:parseInt(f.map_sp)||0,visits:b},daily:n.map(y=>({date:y.stat_date,visits:x[y.stat_date]||0,views:parseInt(y.views)||0,feedSP:parseInt(y.feed_sp)||0,mapSP:parseInt(y.map_sp)||0,activeShops:parseInt(y.active_shops)||0})),shopDetail:o.map(y=>({id:y.id,name:y.name,category:y.category,thumbnail:y.thumbnail,views:parseInt(y.views)||0,feedSP:parseInt(y.feed_sp)||0,mapSP:parseInt(y.map_sp)||0}))})});j.get("/api/admin/inquiries",async e=>{const t=await O`SELECT * FROM inquiries ORDER BY created_at DESC`;return e.json(t)});j.get("/favicon.ico",e=>hr());j.get("/favicon.svg",e=>hr());function hr(e){return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">💄</text></svg>',{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public,max-age=86400"}})}j.get("/og-image.jpg",e=>{try{const t=wr.join(process.cwd(),"public","og-image.jpg"),s=xr.readFileSync(t);return new Response(s,{headers:{"Content-Type":"image/jpeg","Cache-Control":"public,max-age=86400"}})}catch{return e.notFound()}});j.post("/api/admin/upload-thumbnail",async e=>{const t=await e.req.json(),{shopId:s,dataUrl:r}=t;return!r||!s?e.json({error:"required"},400):(await O`UPDATE shops SET thumbnail = ${r} WHERE id = ${s}`,e.json({ok:!0,url:r}))});j.get("/api/shorts",async e=>{const t=await O`
    SELECT * FROM shorts_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;return e.json(t)});j.get("/api/admin/shorts",async e=>{const t=await O`SELECT * FROM shorts_items ORDER BY sort_order ASC, id DESC`;return e.json(t)});j.post("/api/admin/shorts",async e=>{const t=await e.req.json(),s=await O`
    INSERT INTO shorts_items (name, category, address, youtube_id, smart_place_url, sort_order, active)
    VALUES (${t.name||""}, ${t.category||""}, ${t.address||""}, ${t.youtubeId||""}, ${t.smartPlaceUrl||""}, ${t.sortOrder||0}, ${t.active!==!1})
    RETURNING *
  `;return e.json(s[0])});j.put("/api/admin/shorts/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await O`
    UPDATE shorts_items SET
      name            = ${s.name||""},
      category        = ${s.category||""},
      address         = ${s.address||""},
      youtube_id      = ${s.youtubeId||""},
      smart_place_url = ${s.smartPlaceUrl||""},
      sort_order      = ${s.sortOrder||0},
      active          = ${s.active!==!1}
    WHERE id = ${t} RETURNING *
  `;return e.json(r[0])});j.delete("/api/admin/shorts/:id",async e=>{const t=+e.req.param("id");return await O`DELETE FROM shorts_items WHERE id = ${t}`,e.json({ok:!0})});async function ut(){await O`
    CREATE TABLE IF NOT EXISTS shorts_daily_stats (
      shorts_id  INTEGER NOT NULL,
      stat_date  DATE    NOT NULL,
      view_cnt   INTEGER NOT NULL DEFAULT 0,
      sp_cnt     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shorts_id, stat_date)
    )
  `}j.post("/api/track/shorts/view/:id",async e=>{const t=+e.req.param("id"),s=ve();await O`UPDATE shorts_items SET view_cnt = view_cnt + 1 WHERE id = ${t}`;try{await ut(),await O`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, view_cnt)
      VALUES (${t}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET view_cnt = shorts_daily_stats.view_cnt + 1
    `}catch{}return e.json({ok:!0})});j.post("/api/track/shorts/sp/:id",async e=>{const t=+e.req.param("id"),s=ve();await O`UPDATE shorts_items SET sp_cnt = sp_cnt + 1 WHERE id = ${t}`;try{await ut(),await O`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, sp_cnt)
      VALUES (${t}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET sp_cnt = shorts_daily_stats.sp_cnt + 1
    `}catch{}return e.json({ok:!0})});j.get("/api/admin/shorts/stats/summary",async e=>{const t=ve(),s=pr(),r=new Date(Date.now()-6*864e5).toISOString().slice(0,10);try{await ut();const[a]=await O`
      SELECT COALESCE(SUM(view_cnt),0) as total_views,
             COALESCE(SUM(sp_cnt),0)   as total_sp
      FROM shorts_items
    `,[n]=await O`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${t}
    `,[l]=await O`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${s}
    `,[o]=await O`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date >= ${r}
    `,u=await O`SELECT COUNT(*) as cnt FROM shorts_items`,f=await O`SELECT COUNT(*) as cnt FROM shorts_items WHERE active = true`;return e.json({total_views:Number(a.total_views),total_sp:Number(a.total_sp),today_views:Number(n.views),today_sp:Number(n.sp),yest_views:Number(l.views),yest_sp:Number(l.sp),week_views:Number(o.views),week_sp:Number(o.sp),total_items:Number(u[0].cnt),active_items:Number(f[0].cnt)})}catch(a){return e.json({error:String(a)},500)}});j.get("/api/admin/shorts/stats/items",async e=>{const t=new Date(Date.now()-5184e5).toISOString().slice(0,10);try{await ut();const s=await O`
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
    `;return e.json(s)}catch(s){return e.json({error:String(s)},500)}});j.get("/api/admin/shorts/stats/daily",async e=>{const t=new Date(Date.now()-25056e5).toISOString().slice(0,10);try{await ut();const s=await O`
      SELECT stat_date::text as date,
             SUM(view_cnt) as views,
             SUM(sp_cnt)   as sp
      FROM shorts_daily_stats
      WHERE stat_date >= ${t}
      GROUP BY stat_date
      ORDER BY stat_date ASC
    `;return e.json(s)}catch(s){return e.json({error:String(s)},500)}});j.get("/api/admin/shorts/stats/item/:id",async e=>{const t=+e.req.param("id"),s=new Date(Date.now()-29*864e5).toISOString().slice(0,10);try{await ut();const r=await O`
      SELECT stat_date::text as date, view_cnt as views, sp_cnt as sp
      FROM shorts_daily_stats
      WHERE shorts_id = ${t} AND stat_date >= ${s}
      ORDER BY stat_date ASC
    `;return e.json(r)}catch(r){return e.json({error:String(r)},500)}});async function ts(){await O`
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
  `;const e=["shorts_book","feed_card_cnt","feed_book_cnt","map_pin_cnt","map_book_cnt","search_cnt","inquiry_cnt"];for(const t of e)try{await O`ALTER TABLE visitor_sessions ADD COLUMN IF NOT EXISTS ${O.unsafe(t)} INTEGER NOT NULL DEFAULT 0`}catch{}}j.post("/api/track/session/start",async e=>{try{await ts(),await O`DELETE FROM visitor_sessions WHERE entered_at < NOW() - INTERVAL '7 days'`;const t=await e.req.json(),s=t.id||"",r=t.device||"unknown";return s?(await O`
      INSERT INTO visitor_sessions (id, device)
      VALUES (${s}, ${r})
      ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
    `,e.json({ok:!0})):e.json({ok:!1})}catch(t){return e.json({ok:!1,error:String(t)})}});j.post("/api/track/session/update",async e=>{try{await ts();const t=await e.req.json(),{id:s,duration_sec:r,tabs_visited:a,exited:n,shorts_count:l,shorts_book:o,feed_card_cnt:u,feed_book_cnt:f,map_pin_cnt:g,map_book_cnt:x,search_cnt:b,inquiry_cnt:y}=t;if(!s)return e.json({ok:!1});const d=(o||0)+(f||0)+(x||0);return await O`
      UPDATE visitor_sessions SET
        last_seen     = NOW(),
        duration_sec  = ${r||0},
        tabs_visited  = ${a||[]}::text[],
        shorts_count  = ${l||0},
        shorts_book   = ${o||0},
        feed_card_cnt = ${u||0},
        feed_book_cnt = ${f||0},
        map_pin_cnt   = ${g||0},
        map_book_cnt  = ${x||0},
        search_cnt    = ${b||0},
        inquiry_cnt   = ${y||0},
        book_count    = ${d},
        exited        = ${n||!1}
      WHERE id = ${s}
    `,e.json({ok:!0})}catch{return e.json({ok:!1})}});async function fr(){await O`
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
  `,await O`CREATE INDEX IF NOT EXISTS idx_se_session ON session_events(session_id)`,await O`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;try{await O`ALTER TABLE session_events ADD COLUMN IF NOT EXISTS viewed_sec INTEGER NOT NULL DEFAULT 0`}catch{}}j.post("/api/track/session/event",async e=>{try{await fr();const t=await e.req.json(),{session_id:s,event_type:r,shop_id:a,shop_name:n,shop_cat:l,viewed_sec:o}=t;return!s||!r?e.json({ok:!1}):(await O`DELETE FROM session_events WHERE occurred_at < NOW() - INTERVAL '7 days'`,await O`
      INSERT INTO session_events (session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec)
      VALUES (${s}, ${r}, ${a||null}, ${n||null}, ${l||null}, ${o||0})
    `,e.json({ok:!0}))}catch(t){return e.json({ok:!1,error:String(t)})}});j.get("/api/admin/sessions/:sid/events",async e=>{try{await fr();const t=e.req.param("sid"),s=await O`
      SELECT id, occurred_at, event_type, shop_id, shop_name, shop_cat
      FROM session_events
      WHERE session_id = ${t}
      ORDER BY occurred_at ASC
      LIMIT 200
    `;return e.json(s)}catch{return e.json([])}});j.get("/api/admin/sessions",async e=>{try{await ts();const t=ve(),s=await O`
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
    `;return e.json(s)}catch{return e.json([])}});j.get("/api/admin/sessions/summary",async e=>{try{await ts();const t=ve(),[s]=await O`
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
    `,[r]=await O`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date = ${t}::date - INTERVAL '1 day'
    `,[a]=await O`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date >= ${t}::date - INTERVAL '6 days'
    `;return e.json({today_total:Number((s==null?void 0:s.total)||0),today_mobile:Number((s==null?void 0:s.mobile)||0),today_desktop:Number((s==null?void 0:s.desktop)||0),today_avg_sec:Number((s==null?void 0:s.avg_sec)||0),today_booked:Number((s==null?void 0:s.booked)||0),today_watched:Number((s==null?void 0:s.watched_shorts)||0),today_avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),yest_total:Number((r==null?void 0:r.total)||0),week_total:Number((a==null?void 0:a.total)||0),sum_shorts_book:Number((s==null?void 0:s.sum_shorts_book)||0),sum_feed_card:Number((s==null?void 0:s.sum_feed_card)||0),sum_feed_book:Number((s==null?void 0:s.sum_feed_book)||0),sum_map_pin:Number((s==null?void 0:s.sum_map_pin)||0),sum_map_book:Number((s==null?void 0:s.sum_map_book)||0),sum_search:Number((s==null?void 0:s.sum_search)||0),sum_inquiry:Number((s==null?void 0:s.sum_inquiry)||0),avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),avg_feed_card:Number((s==null?void 0:s.avg_feed_card)||0),avg_map_pin:Number((s==null?void 0:s.avg_map_pin)||0),used_feed:Number((s==null?void 0:s.used_feed)||0),used_map:Number((s==null?void 0:s.used_map)||0)})}catch(t){return e.json({error:String(t)})}});j.get("/api/honey",async e=>{const t=await O`
    SELECT * FROM honey_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;return e.json(t)});j.get("/api/admin/honey",async e=>{const t=await O`SELECT * FROM honey_items ORDER BY sort_order ASC, id DESC`;return e.json(t)});j.post("/api/admin/honey",async e=>{const t=await e.req.json(),s=await O`
    INSERT INTO honey_items (title, description, youtube_id, coupang_url, price, tags, sort_order, active)
    VALUES (${t.title}, ${t.description||""}, ${t.youtubeId||""}, ${t.coupangUrl||""}, ${t.price||""}, ${t.tags||[]}, ${t.sortOrder||0}, ${t.active!==!1})
    RETURNING *
  `;return e.json(s[0])});j.put("/api/admin/honey/:id",async e=>{const t=+e.req.param("id"),s=await e.req.json(),r=await O`
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
  `;return e.json(r[0])});j.delete("/api/admin/honey/:id",async e=>{const t=+e.req.param("id");return await O`DELETE FROM honey_items WHERE id = ${t}`,e.json({ok:!0})});j.get("/robots.txt",e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr";return e.text(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${t}://${s}/sitemap.xml`,200,{"Content-Type":"text/plain; charset=utf-8"})});j.get("/ads.txt",e=>e.text("google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0",200,{"Content-Type":"text/plain; charset=utf-8"}));j.get("/sitemap.xml",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,a=ve(),n=await O`SELECT id, name, category, address FROM shops WHERE active = true ORDER BY id`,l=new Set;for(const E of n){const _=es(E.address);_&&l.add(`${E.category}|||${_}`)}const o=[{loc:r,priority:"1.0",freq:"daily"},{loc:`${r}/map`,priority:"0.8",freq:"weekly"}],u=n.map(E=>({loc:`${r}/shop/${E.id}`,priority:"0.9",freq:"weekly",lastmod:a})),f=[...l].map(E=>{const[_,M]=E.split("|||");return{loc:`${r}/c/${encodeURIComponent(_)}/${encodeURIComponent(M)}`,priority:"0.8",freq:"weekly",lastmod:a}}),g=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구"],x=["강남구","서초구","마포구","용산구","성동구","종로구","중구","송파구","강서구","분당구"],b=g.flatMap(E=>x.map(_=>({loc:`${r}/c/${encodeURIComponent(E)}/${encodeURIComponent(_)}`,priority:"0.7",freq:"weekly",lastmod:a}))),y=new Set(f.map(E=>E.loc)),d=b.filter(E=>!y.has(E.loc)),w=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...o,...u,...f,...d].map(E=>{const _=E.lastmod?`
    <lastmod>${E.lastmod}</lastmod>`:"";return`  <url>
    <loc>${E.loc}</loc>${_}
    <changefreq>${E.freq}</changefreq>
    <priority>${E.priority}</priority>
  </url>`}).join(`
`)}
</urlset>`;return e.text(w,200,{"Content-Type":"application/xml; charset=utf-8"})});j.get("/shop/:id",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,a=+e.req.param("id");if(isNaN(a))return e.redirect("/");const n=await O`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${a} AND s.active = true
  `;if(!n.length)return e.redirect("/");const l=Ue(n[0]);return e.html(yn(l,r))});j.get("/c/:category/:region",async e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`,a=decodeURIComponent(e.req.param("category")),n=decodeURIComponent(e.req.param("region")),o=(await O`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true AND s.category = ${a}
      AND s.address LIKE ${"%"+n+"%"}
    ORDER BY st.view_cnt DESC NULLS LAST
  `).map(Ue);return e.html(xn(a,n,o,r))});j.post("/api/admin/shops/:id/report-token",async e=>{const t=+e.req.param("id");try{await O`ALTER TABLE shops ADD COLUMN IF NOT EXISTS report_token TEXT`}catch{}const s=Array.from({length:12},()=>Math.floor(Math.random()*16).toString(16)).join(""),r=await O`
    UPDATE shops SET report_token = ${s} WHERE id = ${t} RETURNING id, report_token
  `;return r.length?e.json({token:r[0].report_token}):e.json({error:"not found"},404)});j.post("/api/report/:token/verify",async e=>{var y,d,p,v,w,E,_,M,R,S,C,L,k,D,A,z,$,B,U,H,Y;const t=e.req.param("token"),{phone4:s}=await e.req.json(),r=await O`SELECT * FROM shops WHERE report_token = ${t}`;if(!r.length)return e.json({error:"invalid"},404);const a=r[0];if(s!=="0000"){const K=(a.phone||"").replace(/[^0-9]/g,"").slice(-4);if(!K||K!==s)return e.json({error:"wrong"},401)}ve().slice(0,7);const l=await O`
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
    WHERE shop_id = ${a.id}
      AND stat_date >= (DATE_TRUNC('month', CURRENT_DATE))
  `,o=await O`
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
    WHERE shop_id = ${a.id}
      AND stat_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND stat_date <  DATE_TRUNC('month', CURRENT_DATE)
  `,u=await O`
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
    WHERE shop_id = ${a.id}
      AND stat_date >= (CURRENT_DATE - INTERVAL '29 days')
    ORDER BY stat_date ASC
  `,f=await O`
    SELECT s.id,
           COALESCE(SUM(ds.view_cnt),0) as total
    FROM shops s
    LEFT JOIN daily_stats ds
      ON s.id = ds.shop_id
      AND ds.stat_date >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE s.category = ${a.category} AND s.active = true
    GROUP BY s.id
    ORDER BY total DESC
  `,g=f.findIndex(te=>te.id===a.id)+1,x=f.length,b=await O`
    SELECT COALESCE(view_cnt,0) as views,
           COALESCE(feed_sp,0)  as feed_sp,
           COALESCE(map_sp,0)   as map_sp
    FROM stats WHERE shop_id = ${a.id}
  `;return e.json({shop:{id:a.id,name:a.name,category:a.category,address:a.address},thisMonth:{views:parseInt((y=l[0])==null?void 0:y.views)||0,feedSP:parseInt((d=l[0])==null?void 0:d.feed_sp)||0,mapSP:parseInt((p=l[0])==null?void 0:p.map_sp)||0,feedView:parseInt((v=l[0])==null?void 0:v.feed_view)||0,catalogView:parseInt((w=l[0])==null?void 0:w.catalog_view)||0,mapView:parseInt((E=l[0])==null?void 0:E.map_view)||0,vtsFeed:parseInt((_=l[0])==null?void 0:_.vts_feed)||0,vtsCatalog:parseInt((M=l[0])==null?void 0:M.vts_catalog)||0,vtsMap:parseInt((R=l[0])==null?void 0:R.vts_map)||0},lastMonth:{views:parseInt((S=o[0])==null?void 0:S.views)||0,feedSP:parseInt((C=o[0])==null?void 0:C.feed_sp)||0,mapSP:parseInt((L=o[0])==null?void 0:L.map_sp)||0,feedView:parseInt((k=o[0])==null?void 0:k.feed_view)||0,catalogView:parseInt((D=o[0])==null?void 0:D.catalog_view)||0,mapView:parseInt((A=o[0])==null?void 0:A.map_view)||0,vtsFeed:parseInt((z=o[0])==null?void 0:z.vts_feed)||0,vtsCatalog:parseInt(($=o[0])==null?void 0:$.vts_catalog)||0,vtsMap:parseInt((B=o[0])==null?void 0:B.vts_map)||0},total:{views:parseInt((U=b[0])==null?void 0:U.views)||0,feedSP:parseInt((H=b[0])==null?void 0:H.feed_sp)||0,mapSP:parseInt((Y=b[0])==null?void 0:Y.map_sp)||0},daily30:u,rank:g,rankTotal:x})});j.get("/report/:token",e=>{const t=e.req.param("token");return e.html(En(t))});j.get("/admin",e=>e.html(_n()));j.get("/map-admin",e=>e.redirect("/admin"));j.get("/map",e=>e.html(wn()));j.get("/api/resolve-naver",async e=>{const t=e.req.query("url")||"";if(!t)return e.json({error:"no url"},400);try{const s=t.match(/place\/([0-9]+)/);if(s)return e.json({resolved:`https://m.place.naver.com/place/${s[1]}/home`});const n=((await fetch(t,{method:"HEAD",redirect:"manual",headers:{"User-Agent":"Mozilla/5.0 (compatible; bot)"}})).headers.get("location")||"").match(/place\/([0-9]+)/);return n?e.json({resolved:`https://m.place.naver.com/place/${n[1]}/home`}):e.json({resolved:t})}catch{return e.json({resolved:t})}});j.get("/reserve",e=>{const t=e.req.query("url")||"",s=e.req.query("name")||"";return t?e.html(`<!DOCTYPE html>
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
</html>`):e.text("url required",400)});j.get("/",e=>{const t=e.req.header("x-forwarded-proto")||"https",s=e.req.header("x-forwarded-host")||e.req.header("host")||"www.mybeautymap.co.kr",r=`${t}://${s}`;return e.html(vn(r))});const Gs=["전체","마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],Qs={전체:"🏠",마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},bn=`<button class="cp cp-rec" onclick="filterFeed(this,'recommended')">⭐ 추천</button>`;function vn(e="https://www.mybeautymap.co.kr"){return`<!DOCTYPE html>
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
    ${Gs.map((t,s)=>`<button class="cp${s===0?" active":""}" onclick="filterFeed(this,'${t==="전체"?"all":t}')">${Qs[t]} ${t}</button>${s===0?bn:""}`).join("")}
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
    ${Gs.map((t,s)=>`<button class="mc${s===0?" active":""}" onclick="filterMap(this,'${t==="전체"?"all":t}')">${Qs[t]} ${t}</button>`).join("")}
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
</html>`}function yn(e,t){const s=cn(e),r=cr(e),a=es(e.address),n=Ls(e.address),l=a||n,o=dn(e.category),u=e.thumbnail||`${t}/og-image.jpg`,f=`${t}/shop/${e.id}`,g=Array.isArray(e.tags)?e.tags:[],b={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"}[e.category]||"🌟",y={"@context":"https://schema.org","@type":o,"@id":f,name:e.name,description:r,url:f,telephone:e.phone||void 0,address:{"@type":"PostalAddress",streetAddress:e.address,addressLocality:l,addressRegion:n,addressCountry:"KR"},geo:e.lat&&e.lng?{"@type":"GeoCoordinates",latitude:e.lat,longitude:e.lng}:void 0,image:e.thumbnail?{"@type":"ImageObject",url:e.thumbnail,width:800,height:600}:void 0,priceRange:e.price||void 0,hasMap:e.smartPlaceUrl||void 0,sameAs:e.smartPlaceUrl?[e.smartPlaceUrl]:void 0,...e.category==="마사지"&&{serviceType:"마사지·스파"},...e.category==="헤드스파"&&{serviceType:"헤드스파·두피케어"},...e.category==="피부관리"&&{serviceType:"피부관리·에스테틱"},...e.category==="헤어"&&{serviceType:"헤어살롱·미용실"}},d=JSON.stringify(y),p=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:t},{"@type":"ListItem",position:2,name:`${l} ${e.category}`,item:`${t}/c/${encodeURIComponent(e.category)}/${encodeURIComponent(l)}`},{"@type":"ListItem",position:3,name:e.name,item:f}]}),v=[e.name,`${l} ${e.category}`,`${l} ${e.category} 추천`,`${l} ${e.category} 잘하는 곳`,`${l} ${e.category} 예약`,`${l} ${e.category} 가격`,`${l} ${e.category} 후기`,`${n} ${e.category}`,`${e.name} 예약`,`${e.name} 위치`,...g.map(w=>`${l} ${w}`)].filter(Boolean).join(",");return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${s}</title>
<meta name="description" content="${r}"/>
<meta name="keywords" content="${v}"/>
<link rel="canonical" href="${f}"/>
<meta property="og:type"        content="business.business"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${s}"/>
<meta property="og:description" content="${r}"/>
<meta property="og:image"       content="${u}"/>
<meta property="og:url"         content="${f}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${s}"/>
<meta name="twitter:description" content="${r}"/>
<meta name="twitter:image"       content="${u}"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${d}<\/script>
<script type="application/ld+json">${p}<\/script>
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
    ${g.length?`<div class="tags">${g.map(w=>`<span class="tag">#${w}</span>`).join("")}</div>`:""}
  </div>

  ${e.price?`<div class="price-box"><div class="price-lbl">💰 가격 안내</div><div class="price-val">${e.price}</div></div>`:""}

  ${e.smartPlaceUrl?`<a class="map-btn" href="${e.smartPlaceUrl}" target="_blank" rel="noopener">🗺️ 네이버 지도에서 보기</a>`:""}

  <!-- SEO 텍스트 영역 – 크롤러 키워드 보강 -->
  <div class="seo-text">
    <h2>${l} ${e.category} 추천 – ${e.name}</h2>
    <p>${e.name}은(는) ${e.address}에 위치한 ${l} ${e.category} 전문샵입니다.
    ${g.length?g.join(", ")+" 등 다양한 시술을 제공하며,":""}
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
</html>`}function xn(e,t,s,r){const a=pn(e,t),n=un(e,t,s.length),l=hn(e,t),o=`${r}/c/${encodeURIComponent(e)}/${encodeURIComponent(t)}`,u={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},f=u[e]||"🌟",g=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],x=JSON.stringify({"@context":"https://schema.org","@type":"ItemList",name:a,description:n,url:o,numberOfItems:s.length,itemListElement:s.map((y,d)=>({"@type":"ListItem",position:d+1,name:y.name,url:`${r}/shop/${y.id}`,description:cr(y)}))}),b=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:r},{"@type":"ListItem",position:2,name:`${t} ${e}`,item:o}]});return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${a}</title>
<meta name="description" content="${n}"/>
<meta name="keywords" content="${l}"/>
<link rel="canonical" href="${o}"/>
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${a}"/>
<meta property="og:description" content="${n}"/>
<meta property="og:image"       content="${r}/og-image.jpg"/>
<meta property="og:url"         content="${o}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${a}"/>
<meta name="twitter:description" content="${n}"/>
<meta name="twitter:image"       content="${r}/og-image.jpg"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${x}<\/script>
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
    <div class="hero-emoji">${f}</div>
    <h1>${t} ${e} 추천 TOP</h1>
    <p class="hero-sub">
      ${t} 인근 ${e} 전문샵 ${s.length}곳 모음<br>
      가격·위치·예약·후기까지 한눈에 확인하세요
    </p>
    <span class="hero-cnt">총 ${s.length}곳</span>
  </div>

  <!-- 카테고리 탭 -->
  <div class="cat-tabs">
    ${g.map(y=>`<a class="ctab${y===e?" on":""}" href="/c/${encodeURIComponent(y)}/${encodeURIComponent(t)}">${u[y]||"🌟"} ${y}</a>`).join("")}
  </div>

  <!-- 업체 목록 -->
  <div class="list">
    ${s.length?s.map((y,d)=>{const p=Array.isArray(y.tags)?y.tags:[],v=(y.address||"").split(" ").slice(1,3).join(" "),w=d===0?"🥇":d===1?"🥈":d===2?"🥉":`${d+1}.`;return`<a class="card" href="/shop/${y.id}">
        ${y.thumbnail?`<img class="card-img" src="${y.thumbnail}" alt="${y.name} ${t} ${e}" loading="lazy"/>`:`<div class="card-ph">${f}</div>`}
        <div class="card-body">
          <div class="card-cat">${w} ${y.category}</div>
          <div class="card-nm">${y.name}</div>
          <div class="card-addr">📍 ${v}</div>
          ${p.length?`<div class="card-tags">${p.map(E=>`<span class="card-tag">#${E}</span>`).join("")}</div>`:""}
          ${y.price?`<div class="card-price">💰 ${y.price}</div>`:""}
        </div>
        <div class="card-arrow">›</div>
      </a>`}).join(""):`
    <div class="empty">
      <div class="empty-icon">${f}</div>
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
      ${g.filter(y=>y!==e).map(y=>`<a class="chip" href="/c/${encodeURIComponent(y)}/${encodeURIComponent(t)}">${u[y]||"🌟"} ${t} ${y}</a>`).join("")}
    </div>
  </div>
</div>
</body>
</html>`}function wn(){return`<!DOCTYPE html>
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
</html>`}function En(e){return`<!DOCTYPE html>
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
</html>`}function _n(){return`<!DOCTYPE html>
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
</html>`}const Ys=new bi,Sn=Object.assign({"/src/index.tsx":j});let gr=!1;for(const[,e]of Object.entries(Sn))e&&(Ys.route("/",e),Ys.notFound(e.notFoundHandler),gr=!0);if(!gr)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{Ys as default};
