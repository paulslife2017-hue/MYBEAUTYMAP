var Er=Object.defineProperty;var Fs=t=>{throw TypeError(t)};var kr=(t,e,s)=>e in t?Er(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var X=(t,e,s)=>kr(t,typeof e!="symbol"?e+"":e,s),ls=(t,e,s)=>e.has(t)||Fs("Cannot "+s);var N=(t,e,s)=>(ls(t,e,"read from private field"),s?s.call(t):e.get(t)),ee=(t,e,s)=>e.has(t)?Fs("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),G=(t,e,s,i)=>(ls(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s),se=(t,e,s)=>(ls(t,e,"access private method"),s);var Us=(t,e,s,i)=>({set _(a){G(t,e,a,s)},get _(){return N(t,e,i)}});import Sr from"fs";import Tr from"path";var zs=(t,e,s)=>(i,a)=>{let n=-1;return d(0);async function d(o){if(o<=n)throw new Error("next() called multiple times");n=o;let u,h=!1,g;if(t[o]?(g=t[o][0][0],i.req.routeIndex=o):g=o===t.length&&a||void 0,g)try{u=await g(i,()=>d(o+1))}catch(x){if(x instanceof Error&&e)i.error=x,u=await e(x,i),h=!0;else throw x}else i.finalized===!1&&s&&(u=await s(i));return u&&(i.finalized===!1||h)&&(i.res=u),i}},Ir=Symbol(),Cr=async(t,e=Object.create(null))=>{const{all:s=!1,dot:i=!1}=e,n=(t instanceof ui?t.raw.headers:t.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Lr(t,{all:s,dot:i}):{}};async function Lr(t,e){const s=await t.formData();return s?Ar(s,e):{}}function Ar(t,e){const s=Object.create(null);return t.forEach((i,a)=>{e.all||a.endsWith("[]")?Or(s,a,i):s[a]=i}),e.dot&&Object.entries(s).forEach(([i,a])=>{i.includes(".")&&(Mr(s,i,a),delete s[i])}),s}var Or=(t,e,s)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(s):t[e]=[t[e],s]:e.endsWith("[]")?t[e]=[s]:t[e]=s},Mr=(t,e,s)=>{if(/(?:^|\.)__proto__\./.test(e))return;let i=t;const a=e.split(".");a.forEach((n,d)=>{d===a.length-1?i[n]=s:((!i[n]||typeof i[n]!="object"||Array.isArray(i[n])||i[n]instanceof File)&&(i[n]=Object.create(null)),i=i[n])})},oi=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Rr=t=>{const{groups:e,path:s}=Nr(t),i=oi(s);return Dr(i,e)},Nr=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(s,i)=>{const a=`@${i}`;return e.push([a,s]),a}),{groups:e,path:t}},Dr=(t,e)=>{for(let s=e.length-1;s>=0;s--){const[i]=e[s];for(let a=t.length-1;a>=0;a--)if(t[a].includes(i)){t[a]=t[a].replace(i,e[s][1]);break}}return t},Ft={},Br=(t,e)=>{if(t==="*")return"*";const s=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const i=`${t}#${e}`;return Ft[i]||(s[2]?Ft[i]=e&&e[0]!==":"&&e[0]!=="*"?[i,s[1],new RegExp(`^${s[2]}(?=/${e})`)]:[t,s[1],new RegExp(`^${s[2]}$`)]:Ft[i]=[t,s[1],!0]),Ft[i]}return null},ys=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return e(s)}catch{return s}})}},Pr=t=>ys(t,decodeURI),di=t=>{const e=t.url,s=e.indexOf("/",e.indexOf(":")+4);let i=s;for(;i<e.length;i++){const a=e.charCodeAt(i);if(a===37){const n=e.indexOf("?",i),d=e.indexOf("#",i),o=n===-1?d===-1?void 0:d:d===-1?n:Math.min(n,d),u=e.slice(s,o);return Pr(u.includes("%25")?u.replace(/%25/g,"%2525"):u)}else if(a===63||a===35)break}return e.slice(s,i)},Fr=t=>{const e=di(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},et=(t,e,...s)=>(s.length&&(e=et(e,...s)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),li=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),s=[];let i="";return e.forEach(a=>{if(a!==""&&!/\:/.test(a))i+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&i===""?s.push("/"):s.push(i);const n=a.replace("?","");i+="/"+n,s.push(i)}else i+="/"+a}),s.filter((a,n,d)=>d.indexOf(a)===n)},cs=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?ys(t,pi):t):t,ci=(t,e,s)=>{let i;if(!s&&e&&!/[%+]/.test(e)){let d=t.indexOf("?",8);if(d===-1)return;for(t.startsWith(e,d+1)||(d=t.indexOf(`&${e}`,d+1));d!==-1;){const o=t.charCodeAt(d+e.length+1);if(o===61){const u=d+e.length+2,h=t.indexOf("&",u);return cs(t.slice(u,h===-1?void 0:h))}else if(o==38||isNaN(o))return"";d=t.indexOf(`&${e}`,d+1)}if(i=/[%+]/.test(t),!i)return}const a={};i??(i=/[%+]/.test(t));let n=t.indexOf("?",8);for(;n!==-1;){const d=t.indexOf("&",n+1);let o=t.indexOf("=",n);o>d&&d!==-1&&(o=-1);let u=t.slice(n+1,o===-1?d===-1?void 0:d:o);if(i&&(u=cs(u)),n=d,u==="")continue;let h;o===-1?h="":(h=t.slice(o+1,d===-1?void 0:d),i&&(h=cs(h))),s?(a[u]&&Array.isArray(a[u])||(a[u]=[]),a[u].push(h)):a[u]??(a[u]=h)}return e?a[e]:a},Ur=ci,zr=(t,e)=>ci(t,e,!0),pi=decodeURIComponent,$s=t=>ys(t,pi),at,xe,Me,fi,hi,hs,Re,ti,ui=(ti=class{constructor(t,e="/",s=[[]]){ee(this,Me);X(this,"raw");ee(this,at);ee(this,xe);X(this,"routeIndex",0);X(this,"path");X(this,"bodyCache",{});ee(this,Re,t=>{const{bodyCache:e,raw:s}=this,i=e[t];if(i)return i;const a=Object.keys(e)[0];return a?e[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[t]())):e[t]=s[t]()});this.raw=t,this.path=e,G(this,xe,s),G(this,at,{})}param(t){return t?se(this,Me,fi).call(this,t):se(this,Me,hi).call(this)}query(t){return Ur(this.url,t)}queries(t){return zr(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((s,i)=>{e[i]=s}),e}async parseBody(t){return Cr(this,t)}json(){return N(this,Re).call(this,"text").then(t=>JSON.parse(t))}text(){return N(this,Re).call(this,"text")}arrayBuffer(){return N(this,Re).call(this,"arrayBuffer")}blob(){return N(this,Re).call(this,"blob")}formData(){return N(this,Re).call(this,"formData")}addValidatedData(t,e){N(this,at)[t]=e}valid(t){return N(this,at)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ir](){return N(this,xe)}get matchedRoutes(){return N(this,xe)[0].map(([[,t]])=>t)}get routePath(){return N(this,xe)[0].map(([[,t]])=>t)[this.routeIndex].path}},at=new WeakMap,xe=new WeakMap,Me=new WeakSet,fi=function(t){const e=N(this,xe)[0][this.routeIndex][1][t],s=se(this,Me,hs).call(this,e);return s&&/\%/.test(s)?$s(s):s},hi=function(){const t={},e=Object.keys(N(this,xe)[0][this.routeIndex][1]);for(const s of e){const i=se(this,Me,hs).call(this,N(this,xe)[0][this.routeIndex][1][s]);i!==void 0&&(t[s]=/\%/.test(i)?$s(i):i)}return t},hs=function(t){return N(this,xe)[1]?N(this,xe)[1][t]:t},Re=new WeakMap,ti),$r={Stringify:1},gi=async(t,e,s,i,a)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const n=t.callbacks;return n!=null&&n.length?(a?a[0]+=t:a=[t],Promise.all(n.map(o=>o({phase:e,buffer:a,context:i}))).then(o=>Promise.all(o.filter(Boolean).map(u=>gi(u,e,!1,i,a))).then(()=>a[0]))):Promise.resolve(t)},jr="text/plain; charset=UTF-8",ps=(t,e)=>({"Content-Type":t,...e}),bt=(t,e)=>new Response(t,e),St,Tt,Ce,nt,Le,ge,It,ot,dt,qe,Ct,Lt,Ne,tt,si,qr=(si=class{constructor(t,e){ee(this,Ne);ee(this,St);ee(this,Tt);X(this,"env",{});ee(this,Ce);X(this,"finalized",!1);X(this,"error");ee(this,nt);ee(this,Le);ee(this,ge);ee(this,It);ee(this,ot);ee(this,dt);ee(this,qe);ee(this,Ct);ee(this,Lt);X(this,"render",(...t)=>(N(this,ot)??G(this,ot,e=>this.html(e)),N(this,ot).call(this,...t)));X(this,"setLayout",t=>G(this,It,t));X(this,"getLayout",()=>N(this,It));X(this,"setRenderer",t=>{G(this,ot,t)});X(this,"header",(t,e,s)=>{this.finalized&&G(this,ge,bt(N(this,ge).body,N(this,ge)));const i=N(this,ge)?N(this,ge).headers:N(this,qe)??G(this,qe,new Headers);e===void 0?i.delete(t):s!=null&&s.append?i.append(t,e):i.set(t,e)});X(this,"status",t=>{G(this,nt,t)});X(this,"set",(t,e)=>{N(this,Ce)??G(this,Ce,new Map),N(this,Ce).set(t,e)});X(this,"get",t=>N(this,Ce)?N(this,Ce).get(t):void 0);X(this,"newResponse",(...t)=>se(this,Ne,tt).call(this,...t));X(this,"body",(t,e,s)=>se(this,Ne,tt).call(this,t,e,s));X(this,"text",(t,e,s)=>!N(this,qe)&&!N(this,nt)&&!e&&!s&&!this.finalized?new Response(t):se(this,Ne,tt).call(this,t,e,ps(jr,s)));X(this,"json",(t,e,s)=>se(this,Ne,tt).call(this,JSON.stringify(t),e,ps("application/json",s)));X(this,"html",(t,e,s)=>{const i=a=>se(this,Ne,tt).call(this,a,e,ps("text/html; charset=UTF-8",s));return typeof t=="object"?gi(t,$r.Stringify,!1,{}).then(i):i(t)});X(this,"redirect",(t,e)=>{const s=String(t);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,e??302)});X(this,"notFound",()=>(N(this,dt)??G(this,dt,()=>bt()),N(this,dt).call(this,this)));G(this,St,t),e&&(G(this,Le,e.executionCtx),this.env=e.env,G(this,dt,e.notFoundHandler),G(this,Lt,e.path),G(this,Ct,e.matchResult))}get req(){return N(this,Tt)??G(this,Tt,new ui(N(this,St),N(this,Lt),N(this,Ct))),N(this,Tt)}get event(){if(N(this,Le)&&"respondWith"in N(this,Le))return N(this,Le);throw Error("This context has no FetchEvent")}get executionCtx(){if(N(this,Le))return N(this,Le);throw Error("This context has no ExecutionContext")}get res(){return N(this,ge)||G(this,ge,bt(null,{headers:N(this,qe)??G(this,qe,new Headers)}))}set res(t){if(N(this,ge)&&t){t=bt(t.body,t);for(const[e,s]of N(this,ge).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const i=N(this,ge).headers.getSetCookie();t.headers.delete("set-cookie");for(const a of i)t.headers.append("set-cookie",a)}else t.headers.set(e,s)}G(this,ge,t),this.finalized=!0}get var(){return N(this,Ce)?Object.fromEntries(N(this,Ce)):{}}},St=new WeakMap,Tt=new WeakMap,Ce=new WeakMap,nt=new WeakMap,Le=new WeakMap,ge=new WeakMap,It=new WeakMap,ot=new WeakMap,dt=new WeakMap,qe=new WeakMap,Ct=new WeakMap,Lt=new WeakMap,Ne=new WeakSet,tt=function(t,e,s){const i=N(this,ge)?new Headers(N(this,ge).headers):N(this,qe)??new Headers;if(typeof e=="object"&&"headers"in e){const n=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[d,o]of n)d.toLowerCase()==="set-cookie"?i.append(d,o):i.set(d,o)}if(s)for(const[n,d]of Object.entries(s))if(typeof d=="string")i.set(n,d);else{i.delete(n);for(const o of d)i.append(n,o)}const a=typeof e=="number"?e:(e==null?void 0:e.status)??N(this,nt);return bt(t,{status:a,headers:i})},si),le="ALL",Vr="all",Hr=["get","post","put","delete","options","patch"],mi="Can not add a route since the matcher is already built.",bi=class extends Error{},Wr="__COMPOSED_HANDLER",Gr=t=>t.text("404 Not Found",404),js=(t,e)=>{if("getResponse"in t){const s=t.getResponse();return e.newResponse(s.body,s)}return console.error(t),e.text("Internal Server Error",500)},_e,ce,vi,Ee,$e,jt,qt,lt,Qr=(lt=class{constructor(e={}){ee(this,ce);X(this,"get");X(this,"post");X(this,"put");X(this,"delete");X(this,"options");X(this,"patch");X(this,"all");X(this,"on");X(this,"use");X(this,"router");X(this,"getPath");X(this,"_basePath","/");ee(this,_e,"/");X(this,"routes",[]);ee(this,Ee,Gr);X(this,"errorHandler",js);X(this,"onError",e=>(this.errorHandler=e,this));X(this,"notFound",e=>(G(this,Ee,e),this));X(this,"fetch",(e,...s)=>se(this,ce,qt).call(this,e,s[1],s[0],e.method));X(this,"request",(e,s,i,a)=>e instanceof Request?this.fetch(s?new Request(e,s):e,i,a):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${et("/",e)}`,s),i,a)));X(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(se(this,ce,qt).call(this,e.request,e,void 0,e.request.method))})});[...Hr,Vr].forEach(n=>{this[n]=(d,...o)=>(typeof d=="string"?G(this,_e,d):se(this,ce,$e).call(this,n,N(this,_e),d),o.forEach(u=>{se(this,ce,$e).call(this,n,N(this,_e),u)}),this)}),this.on=(n,d,...o)=>{for(const u of[d].flat()){G(this,_e,u);for(const h of[n].flat())o.map(g=>{se(this,ce,$e).call(this,h.toUpperCase(),N(this,_e),g)})}return this},this.use=(n,...d)=>(typeof n=="string"?G(this,_e,n):(G(this,_e,"*"),d.unshift(n)),d.forEach(o=>{se(this,ce,$e).call(this,le,N(this,_e),o)}),this);const{strict:i,...a}=e;Object.assign(this,a),this.getPath=i??!0?e.getPath??di:Fr}route(e,s){const i=this.basePath(e);return s.routes.map(a=>{var d;let n;s.errorHandler===js?n=a.handler:(n=async(o,u)=>(await zs([],s.errorHandler)(o,()=>a.handler(o,u))).res,n[Wr]=a.handler),se(d=i,ce,$e).call(d,a.method,a.path,n)}),this}basePath(e){const s=se(this,ce,vi).call(this);return s._basePath=et(this._basePath,e),s}mount(e,s,i){let a,n;i&&(typeof i=="function"?n=i:(n=i.optionHandler,i.replaceRequest===!1?a=u=>u:a=i.replaceRequest));const d=n?u=>{const h=n(u);return Array.isArray(h)?h:[h]}:u=>{let h;try{h=u.executionCtx}catch{}return[u.env,h]};a||(a=(()=>{const u=et(this._basePath,e),h=u==="/"?0:u.length;return g=>{const x=new URL(g.url);return x.pathname=x.pathname.slice(h)||"/",new Request(x,g)}})());const o=async(u,h)=>{const g=await s(a(u.req.raw),...d(u));if(g)return g;await h()};return se(this,ce,$e).call(this,le,et(e,"*"),o),this}},_e=new WeakMap,ce=new WeakSet,vi=function(){const e=new lt({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,G(e,Ee,N(this,Ee)),e.routes=this.routes,e},Ee=new WeakMap,$e=function(e,s,i){e=e.toUpperCase(),s=et(this._basePath,s);const a={basePath:this._basePath,path:s,method:e,handler:i};this.router.add(e,s,[i,a]),this.routes.push(a)},jt=function(e,s){if(e instanceof Error)return this.errorHandler(e,s);throw e},qt=function(e,s,i,a){if(a==="HEAD")return(async()=>new Response(null,await se(this,ce,qt).call(this,e,s,i,"GET")))();const n=this.getPath(e,{env:i}),d=this.router.match(a,n),o=new qr(e,{path:n,matchResult:d,env:i,executionCtx:s,notFoundHandler:N(this,Ee)});if(d[0].length===1){let h;try{h=d[0][0][0][0](o,async()=>{o.res=await N(this,Ee).call(this,o)})}catch(g){return se(this,ce,jt).call(this,g,o)}return h instanceof Promise?h.then(g=>g||(o.finalized?o.res:N(this,Ee).call(this,o))).catch(g=>se(this,ce,jt).call(this,g,o)):h??N(this,Ee).call(this,o)}const u=zs(d[0],this.errorHandler,N(this,Ee));return(async()=>{try{const h=await u(o);if(!h.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return h.res}catch(h){return se(this,ce,jt).call(this,h,o)}})()},lt),yi=[];function Yr(t,e){const s=this.buildAllMatchers(),i=((a,n)=>{const d=s[a]||s[le],o=d[2][n];if(o)return o;const u=n.match(d[0]);if(!u)return[[],yi];const h=u.indexOf("",1);return[d[1][h],u]});return this.match=i,i(t,e)}var Gt="[^/]+",wt=".*",_t="(?:|/.*)",st=Symbol(),Xr=new Set(".\\+*[^]$()");function Kr(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===wt||t===_t?1:e===wt||e===_t?-1:t===Gt?1:e===Gt?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var Ve,He,ke,Qe,Jr=(Qe=class{constructor(){ee(this,Ve);ee(this,He);ee(this,ke,Object.create(null))}insert(e,s,i,a,n){if(e.length===0){if(N(this,Ve)!==void 0)throw st;if(n)return;G(this,Ve,s);return}const[d,...o]=e,u=d==="*"?o.length===0?["","",wt]:["","",Gt]:d==="/*"?["","",_t]:d.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let h;if(u){const g=u[1];let x=u[2]||Gt;if(g&&u[2]&&(x===".*"||(x=x.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(x))))throw st;if(h=N(this,ke)[x],!h){if(Object.keys(N(this,ke)).some(b=>b!==wt&&b!==_t))throw st;if(n)return;h=N(this,ke)[x]=new Qe,g!==""&&G(h,He,a.varIndex++)}!n&&g!==""&&i.push([g,N(h,He)])}else if(h=N(this,ke)[d],!h){if(Object.keys(N(this,ke)).some(g=>g.length>1&&g!==wt&&g!==_t))throw st;if(n)return;h=N(this,ke)[d]=new Qe}h.insert(o,s,i,a,n)}buildRegExpStr(){const s=Object.keys(N(this,ke)).sort(Kr).map(i=>{const a=N(this,ke)[i];return(typeof N(a,He)=="number"?`(${i})@${N(a,He)}`:Xr.has(i)?`\\${i}`:i)+a.buildRegExpStr()});return typeof N(this,Ve)=="number"&&s.unshift(`#${N(this,Ve)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Ve=new WeakMap,He=new WeakMap,ke=new WeakMap,Qe),Qt,At,ii,Zr=(ii=class{constructor(){ee(this,Qt,{varIndex:0});ee(this,At,new Jr)}insert(t,e,s){const i=[],a=[];for(let d=0;;){let o=!1;if(t=t.replace(/\{[^}]+\}/g,u=>{const h=`@\\${d}`;return a[d]=[h,u],d++,o=!0,h}),!o)break}const n=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let d=a.length-1;d>=0;d--){const[o]=a[d];for(let u=n.length-1;u>=0;u--)if(n[u].indexOf(o)!==-1){n[u]=n[u].replace(o,a[d][1]);break}}return N(this,At).insert(n,e,i,N(this,Qt),s),i}buildRegExp(){let t=N(this,At).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const s=[],i=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,d)=>n!==void 0?(s[++e]=Number(n),"$()"):(d!==void 0&&(i[Number(d)]=++e),"")),[new RegExp(`^${t}`),s,i]}},Qt=new WeakMap,At=new WeakMap,ii),ea=[/^$/,[],Object.create(null)],Vt=Object.create(null);function xi(t){return Vt[t]??(Vt[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function ta(){Vt=Object.create(null)}function sa(t){var h;const e=new Zr,s=[];if(t.length===0)return ea;const i=t.map(g=>[!/\*|\/:/.test(g[0]),...g]).sort(([g,x],[b,y])=>g?1:b?-1:x.length-y.length),a=Object.create(null);for(let g=0,x=-1,b=i.length;g<b;g++){const[y,l,p]=i[g];y?a[l]=[p.map(([w])=>[w,Object.create(null)]),yi]:x++;let v;try{v=e.insert(l,x,y)}catch(w){throw w===st?new bi(l):w}y||(s[x]=p.map(([w,_])=>{const E=Object.create(null);for(_-=1;_>=0;_--){const[O,M]=v[_];E[O]=M}return[w,E]}))}const[n,d,o]=e.buildRegExp();for(let g=0,x=s.length;g<x;g++)for(let b=0,y=s[g].length;b<y;b++){const l=(h=s[g][b])==null?void 0:h[1];if(!l)continue;const p=Object.keys(l);for(let v=0,w=p.length;v<w;v++)l[p[v]]=o[l[p[v]]]}const u=[];for(const g in d)u[g]=s[d[g]];return[n,u,a]}function Ze(t,e){if(t){for(const s of Object.keys(t).sort((i,a)=>a.length-i.length))if(xi(s).test(e))return[...t[s]]}}var De,Be,Yt,wi,ri,ia=(ri=class{constructor(){ee(this,Yt);X(this,"name","RegExpRouter");ee(this,De);ee(this,Be);X(this,"match",Yr);G(this,De,{[le]:Object.create(null)}),G(this,Be,{[le]:Object.create(null)})}add(t,e,s){var o;const i=N(this,De),a=N(this,Be);if(!i||!a)throw new Error(mi);i[t]||[i,a].forEach(u=>{u[t]=Object.create(null),Object.keys(u[le]).forEach(h=>{u[t][h]=[...u[le][h]]})}),e==="/*"&&(e="*");const n=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const u=xi(e);t===le?Object.keys(i).forEach(h=>{var g;(g=i[h])[e]||(g[e]=Ze(i[h],e)||Ze(i[le],e)||[])}):(o=i[t])[e]||(o[e]=Ze(i[t],e)||Ze(i[le],e)||[]),Object.keys(i).forEach(h=>{(t===le||t===h)&&Object.keys(i[h]).forEach(g=>{u.test(g)&&i[h][g].push([s,n])})}),Object.keys(a).forEach(h=>{(t===le||t===h)&&Object.keys(a[h]).forEach(g=>u.test(g)&&a[h][g].push([s,n]))});return}const d=li(e)||[e];for(let u=0,h=d.length;u<h;u++){const g=d[u];Object.keys(a).forEach(x=>{var b;(t===le||t===x)&&((b=a[x])[g]||(b[g]=[...Ze(i[x],g)||Ze(i[le],g)||[]]),a[x][g].push([s,n-h+u+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(N(this,Be)).concat(Object.keys(N(this,De))).forEach(e=>{t[e]||(t[e]=se(this,Yt,wi).call(this,e))}),G(this,De,G(this,Be,void 0)),ta(),t}},De=new WeakMap,Be=new WeakMap,Yt=new WeakSet,wi=function(t){const e=[];let s=t===le;return[N(this,De),N(this,Be)].forEach(i=>{const a=i[t]?Object.keys(i[t]).map(n=>[n,i[t][n]]):[];a.length!==0?(s||(s=!0),e.push(...a)):t!==le&&e.push(...Object.keys(i[le]).map(n=>[n,i[le][n]]))}),s?sa(e):null},ri),Pe,Ae,ai,ra=(ai=class{constructor(t){X(this,"name","SmartRouter");ee(this,Pe,[]);ee(this,Ae,[]);G(this,Pe,t.routers)}add(t,e,s){if(!N(this,Ae))throw new Error(mi);N(this,Ae).push([t,e,s])}match(t,e){if(!N(this,Ae))throw new Error("Fatal error");const s=N(this,Pe),i=N(this,Ae),a=s.length;let n=0,d;for(;n<a;n++){const o=s[n];try{for(let u=0,h=i.length;u<h;u++)o.add(...i[u]);d=o.match(t,e)}catch(u){if(u instanceof bi)continue;throw u}this.match=o.match.bind(o),G(this,Pe,[o]),G(this,Ae,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,d}get activeRouter(){if(N(this,Ae)||N(this,Pe).length!==1)throw new Error("No active router has been determined yet.");return N(this,Pe)[0]}},Pe=new WeakMap,Ae=new WeakMap,ai),vt=Object.create(null),aa=t=>{for(const e in t)return!0;return!1},Fe,he,We,ct,fe,Oe,je,pt,na=(pt=class{constructor(e,s,i){ee(this,Oe);ee(this,Fe);ee(this,he);ee(this,We);ee(this,ct,0);ee(this,fe,vt);if(G(this,he,i||Object.create(null)),G(this,Fe,[]),e&&s){const a=Object.create(null);a[e]={handler:s,possibleKeys:[],score:0},G(this,Fe,[a])}G(this,We,[])}insert(e,s,i){G(this,ct,++Us(this,ct)._);let a=this;const n=Rr(s),d=[];for(let o=0,u=n.length;o<u;o++){const h=n[o],g=n[o+1],x=Br(h,g),b=Array.isArray(x)?x[0]:h;if(b in N(a,he)){a=N(a,he)[b],x&&d.push(x[1]);continue}N(a,he)[b]=new pt,x&&(N(a,We).push(x),d.push(x[1])),a=N(a,he)[b]}return N(a,Fe).push({[e]:{handler:i,possibleKeys:d.filter((o,u,h)=>h.indexOf(o)===u),score:N(this,ct)}}),a}search(e,s){var g;const i=[];G(this,fe,vt);let n=[this];const d=oi(s),o=[],u=d.length;let h=null;for(let x=0;x<u;x++){const b=d[x],y=x===u-1,l=[];for(let v=0,w=n.length;v<w;v++){const _=n[v],E=N(_,he)[b];E&&(G(E,fe,N(_,fe)),y?(N(E,he)["*"]&&se(this,Oe,je).call(this,i,N(E,he)["*"],e,N(_,fe)),se(this,Oe,je).call(this,i,E,e,N(_,fe))):l.push(E));for(let O=0,M=N(_,We).length;O<M;O++){const k=N(_,We)[O],C=N(_,fe)===vt?{}:{...N(_,fe)};if(k==="*"){const z=N(_,he)["*"];z&&(se(this,Oe,je).call(this,i,z,e,N(_,fe)),G(z,fe,C),l.push(z));continue}const[L,S,R]=k;if(!b&&!(R instanceof RegExp))continue;const A=N(_,he)[L];if(R instanceof RegExp){if(h===null){h=new Array(u);let D=s[0]==="/"?1:0;for(let U=0;U<u;U++)h[U]=D,D+=d[U].length+1}const z=s.substring(h[x]),j=R.exec(z);if(j){if(C[S]=j[0],se(this,Oe,je).call(this,i,A,e,N(_,fe),C),aa(N(A,he))){G(A,fe,C);const D=((g=j[0].match(/\//))==null?void 0:g.length)??0;(o[D]||(o[D]=[])).push(A)}continue}}(R===!0||R.test(b))&&(C[S]=b,y?(se(this,Oe,je).call(this,i,A,e,C,N(_,fe)),N(A,he)["*"]&&se(this,Oe,je).call(this,i,N(A,he)["*"],e,C,N(_,fe))):(G(A,fe,C),l.push(A)))}}const p=o.shift();n=p?l.concat(p):l}return i.length>1&&i.sort((x,b)=>x.score-b.score),[i.map(({handler:x,params:b})=>[x,b])]}},Fe=new WeakMap,he=new WeakMap,We=new WeakMap,ct=new WeakMap,fe=new WeakMap,Oe=new WeakSet,je=function(e,s,i,a,n){for(let d=0,o=N(s,Fe).length;d<o;d++){const u=N(s,Fe)[d],h=u[i]||u[le],g={};if(h!==void 0&&(h.params=Object.create(null),e.push(h),a!==vt||n&&n!==vt))for(let x=0,b=h.possibleKeys.length;x<b;x++){const y=h.possibleKeys[x],l=g[h.score];h.params[y]=n!=null&&n[y]&&!l?n[y]:a[y]??(n==null?void 0:n[y]),g[h.score]=!0}}},pt),Ge,ni,oa=(ni=class{constructor(){X(this,"name","TrieRouter");ee(this,Ge);G(this,Ge,new na)}add(t,e,s){const i=li(e);if(i){for(let a=0,n=i.length;a<n;a++)N(this,Ge).insert(t,i[a],s);return}N(this,Ge).insert(t,e,s)}match(t,e){return N(this,Ge).search(t,e)}},Ge=new WeakMap,ni),_i=class extends Qr{constructor(t={}){super(t),this.router=t.router??new ra({routers:[new ia,new oa]})}},da=Object.create,ut=Object.defineProperty,la=Object.getOwnPropertyDescriptor,ca=Object.getOwnPropertyNames,pa=Object.getPrototypeOf,ua=Object.prototype.hasOwnProperty,fa=(t,e,s)=>e in t?ut(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,m=(t,e)=>ut(t,"name",{value:e,configurable:!0}),me=(t,e)=>()=>(t&&(e=t(t=0)),e),Z=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Se=(t,e)=>{for(var s in e)ut(t,s,{get:e[s],enumerable:!0})},Ei=(t,e,s,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of ca(e))!ua.call(t,a)&&a!==s&&ut(t,a,{get:()=>e[a],enumerable:!(i=la(e,a))||i.enumerable});return t},Ye=(t,e,s)=>(s=t!=null?da(pa(t)):{},Ei(e||!t||!t.__esModule?ut(s,"default",{value:t,enumerable:!0}):s,t)),ue=t=>Ei(ut({},"__esModule",{value:!0}),t),Q=(t,e,s)=>fa(t,typeof e!="symbol"?e+"":e,s),ha=Z(t=>{q(),t.byteLength=u,t.toByteArray=g,t.fromByteArray=y;var e=[],s=[],i=typeof Uint8Array<"u"?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(n=0,d=a.length;n<d;++n)e[n]=a[n],s[a.charCodeAt(n)]=n;var n,d;s[45]=62,s[95]=63;function o(l){var p=l.length;if(p%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var v=l.indexOf("=");v===-1&&(v=p);var w=v===p?0:4-v%4;return[v,w]}m(o,"getLens");function u(l){var p=o(l),v=p[0],w=p[1];return(v+w)*3/4-w}m(u,"byteLength");function h(l,p,v){return(p+v)*3/4-v}m(h,"_byteLength");function g(l){var p,v=o(l),w=v[0],_=v[1],E=new i(h(l,w,_)),O=0,M=_>0?w-4:w,k;for(k=0;k<M;k+=4)p=s[l.charCodeAt(k)]<<18|s[l.charCodeAt(k+1)]<<12|s[l.charCodeAt(k+2)]<<6|s[l.charCodeAt(k+3)],E[O++]=p>>16&255,E[O++]=p>>8&255,E[O++]=p&255;return _===2&&(p=s[l.charCodeAt(k)]<<2|s[l.charCodeAt(k+1)]>>4,E[O++]=p&255),_===1&&(p=s[l.charCodeAt(k)]<<10|s[l.charCodeAt(k+1)]<<4|s[l.charCodeAt(k+2)]>>2,E[O++]=p>>8&255,E[O++]=p&255),E}m(g,"toByteArray");function x(l){return e[l>>18&63]+e[l>>12&63]+e[l>>6&63]+e[l&63]}m(x,"tripletToBase64");function b(l,p,v){for(var w,_=[],E=p;E<v;E+=3)w=(l[E]<<16&16711680)+(l[E+1]<<8&65280)+(l[E+2]&255),_.push(x(w));return _.join("")}m(b,"encodeChunk");function y(l){for(var p,v=l.length,w=v%3,_=[],E=16383,O=0,M=v-w;O<M;O+=E)_.push(b(l,O,O+E>M?M:O+E));return w===1?(p=l[v-1],_.push(e[p>>2]+e[p<<4&63]+"==")):w===2&&(p=(l[v-2]<<8)+l[v-1],_.push(e[p>>10]+e[p>>4&63]+e[p<<2&63]+"=")),_.join("")}m(y,"fromByteArray")}),ga=Z(t=>{q(),t.read=function(e,s,i,a,n){var d,o,u=n*8-a-1,h=(1<<u)-1,g=h>>1,x=-7,b=i?n-1:0,y=i?-1:1,l=e[s+b];for(b+=y,d=l&(1<<-x)-1,l>>=-x,x+=u;x>0;d=d*256+e[s+b],b+=y,x-=8);for(o=d&(1<<-x)-1,d>>=-x,x+=a;x>0;o=o*256+e[s+b],b+=y,x-=8);if(d===0)d=1-g;else{if(d===h)return o?NaN:(l?-1:1)*(1/0);o=o+Math.pow(2,a),d=d-g}return(l?-1:1)*o*Math.pow(2,d-a)},t.write=function(e,s,i,a,n,d){var o,u,h,g=d*8-n-1,x=(1<<g)-1,b=x>>1,y=n===23?Math.pow(2,-24)-Math.pow(2,-77):0,l=a?0:d-1,p=a?1:-1,v=s<0||s===0&&1/s<0?1:0;for(s=Math.abs(s),isNaN(s)||s===1/0?(u=isNaN(s)?1:0,o=x):(o=Math.floor(Math.log(s)/Math.LN2),s*(h=Math.pow(2,-o))<1&&(o--,h*=2),o+b>=1?s+=y/h:s+=y*Math.pow(2,1-b),s*h>=2&&(o++,h/=2),o+b>=x?(u=0,o=x):o+b>=1?(u=(s*h-1)*Math.pow(2,n),o=o+b):(u=s*Math.pow(2,b-1)*Math.pow(2,n),o=0));n>=8;e[i+l]=u&255,l+=p,u/=256,n-=8);for(o=o<<n|u,g+=n;g>0;e[i+l]=o&255,l+=p,o/=256,g-=8);e[i+l-p]|=v*128}}),ma=Z(t=>{q();var e=ha(),s=ga(),i=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=o,t.SlowBuffer=_,t.INSPECT_MAX_BYTES=50;var a=2147483647;t.kMaxLength=a,o.TYPED_ARRAY_SUPPORT=n(),!o.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function n(){try{let r=new Uint8Array(1),c={foo:m(function(){return 42},"foo")};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(r,c),r.foo()===42}catch{return!1}}m(n,"typedArraySupport"),Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:m(function(){if(o.isBuffer(this))return this.buffer},"get")}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:m(function(){if(o.isBuffer(this))return this.byteOffset},"get")});function d(r){if(r>a)throw new RangeError('The value "'+r+'" is invalid for option "size"');let c=new Uint8Array(r);return Object.setPrototypeOf(c,o.prototype),c}m(d,"createBuffer");function o(r,c,f){if(typeof r=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return x(r)}return u(r,c,f)}m(o,"Buffer"),o.poolSize=8192;function u(r,c,f){if(typeof r=="string")return b(r,c);if(ArrayBuffer.isView(r))return l(r);if(r==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof r);if(we(r,ArrayBuffer)||r&&we(r.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(we(r,SharedArrayBuffer)||r&&we(r.buffer,SharedArrayBuffer)))return p(r,c,f);if(typeof r=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let T=r.valueOf&&r.valueOf();if(T!=null&&T!==r)return o.from(T,c,f);let I=v(r);if(I)return I;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof r[Symbol.toPrimitive]=="function")return o.from(r[Symbol.toPrimitive]("string"),c,f);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof r)}m(u,"from"),o.from=function(r,c,f){return u(r,c,f)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array);function h(r){if(typeof r!="number")throw new TypeError('"size" argument must be of type number');if(r<0)throw new RangeError('The value "'+r+'" is invalid for option "size"')}m(h,"assertSize");function g(r,c,f){return h(r),r<=0?d(r):c!==void 0?typeof f=="string"?d(r).fill(c,f):d(r).fill(c):d(r)}m(g,"alloc"),o.alloc=function(r,c,f){return g(r,c,f)};function x(r){return h(r),d(r<0?0:w(r)|0)}m(x,"allocUnsafe"),o.allocUnsafe=function(r){return x(r)},o.allocUnsafeSlow=function(r){return x(r)};function b(r,c){if((typeof c!="string"||c==="")&&(c="utf8"),!o.isEncoding(c))throw new TypeError("Unknown encoding: "+c);let f=E(r,c)|0,T=d(f),I=T.write(r,c);return I!==f&&(T=T.slice(0,I)),T}m(b,"fromString");function y(r){let c=r.length<0?0:w(r.length)|0,f=d(c);for(let T=0;T<c;T+=1)f[T]=r[T]&255;return f}m(y,"fromArrayLike");function l(r){if(we(r,Uint8Array)){let c=new Uint8Array(r);return p(c.buffer,c.byteOffset,c.byteLength)}return y(r)}m(l,"fromArrayView");function p(r,c,f){if(c<0||r.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(r.byteLength<c+(f||0))throw new RangeError('"length" is outside of buffer bounds');let T;return c===void 0&&f===void 0?T=new Uint8Array(r):f===void 0?T=new Uint8Array(r,c):T=new Uint8Array(r,c,f),Object.setPrototypeOf(T,o.prototype),T}m(p,"fromArrayBuffer");function v(r){if(o.isBuffer(r)){let c=w(r.length)|0,f=d(c);return f.length===0||r.copy(f,0,0,c),f}if(r.length!==void 0)return typeof r.length!="number"||Pt(r.length)?d(0):y(r);if(r.type==="Buffer"&&Array.isArray(r.data))return y(r.data)}m(v,"fromObject");function w(r){if(r>=a)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a.toString(16)+" bytes");return r|0}m(w,"checked");function _(r){return+r!=r&&(r=0),o.alloc(+r)}m(_,"SlowBuffer"),o.isBuffer=m(function(r){return r!=null&&r._isBuffer===!0&&r!==o.prototype},"isBuffer"),o.compare=m(function(r,c){if(we(r,Uint8Array)&&(r=o.from(r,r.offset,r.byteLength)),we(c,Uint8Array)&&(c=o.from(c,c.offset,c.byteLength)),!o.isBuffer(r)||!o.isBuffer(c))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(r===c)return 0;let f=r.length,T=c.length;for(let I=0,B=Math.min(f,T);I<B;++I)if(r[I]!==c[I]){f=r[I],T=c[I];break}return f<T?-1:T<f?1:0},"compare"),o.isEncoding=m(function(r){switch(String(r).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},"isEncoding"),o.concat=m(function(r,c){if(!Array.isArray(r))throw new TypeError('"list" argument must be an Array of Buffers');if(r.length===0)return o.alloc(0);let f;if(c===void 0)for(c=0,f=0;f<r.length;++f)c+=r[f].length;let T=o.allocUnsafe(c),I=0;for(f=0;f<r.length;++f){let B=r[f];if(we(B,Uint8Array))I+B.length>T.length?(o.isBuffer(B)||(B=o.from(B)),B.copy(T,I)):Uint8Array.prototype.set.call(T,B,I);else if(o.isBuffer(B))B.copy(T,I);else throw new TypeError('"list" argument must be an Array of Buffers');I+=B.length}return T},"concat");function E(r,c){if(o.isBuffer(r))return r.length;if(ArrayBuffer.isView(r)||we(r,ArrayBuffer))return r.byteLength;if(typeof r!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof r);let f=r.length,T=arguments.length>2&&arguments[2]===!0;if(!T&&f===0)return 0;let I=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return f;case"utf8":case"utf-8":return Bt(r).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return f*2;case"hex":return f>>>1;case"base64":return ds(r).length;default:if(I)return T?-1:Bt(r).length;c=(""+c).toLowerCase(),I=!0}}m(E,"byteLength"),o.byteLength=E;function O(r,c,f){let T=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((f===void 0||f>this.length)&&(f=this.length),f<=0)||(f>>>=0,c>>>=0,f<=c))return"";for(r||(r="utf8");;)switch(r){case"hex":return K(this,c,f);case"utf8":case"utf-8":return D(this,c,f);case"ascii":return Y(this,c,f);case"latin1":case"binary":return te(this,c,f);case"base64":return j(this,c,f);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return be(this,c,f);default:if(T)throw new TypeError("Unknown encoding: "+r);r=(r+"").toLowerCase(),T=!0}}m(O,"slowToString"),o.prototype._isBuffer=!0;function M(r,c,f){let T=r[c];r[c]=r[f],r[f]=T}m(M,"swap"),o.prototype.swap16=m(function(){let r=this.length;if(r%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let c=0;c<r;c+=2)M(this,c,c+1);return this},"swap16"),o.prototype.swap32=m(function(){let r=this.length;if(r%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let c=0;c<r;c+=4)M(this,c,c+3),M(this,c+1,c+2);return this},"swap32"),o.prototype.swap64=m(function(){let r=this.length;if(r%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let c=0;c<r;c+=8)M(this,c,c+7),M(this,c+1,c+6),M(this,c+2,c+5),M(this,c+3,c+4);return this},"swap64"),o.prototype.toString=m(function(){let r=this.length;return r===0?"":arguments.length===0?D(this,0,r):O.apply(this,arguments)},"toString"),o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=m(function(r){if(!o.isBuffer(r))throw new TypeError("Argument must be a Buffer");return this===r?!0:o.compare(this,r)===0},"equals"),o.prototype.inspect=m(function(){let r="",c=t.INSPECT_MAX_BYTES;return r=this.toString("hex",0,c).replace(/(.{2})/g,"$1 ").trim(),this.length>c&&(r+=" ... "),"<Buffer "+r+">"},"inspect"),i&&(o.prototype[i]=o.prototype.inspect),o.prototype.compare=m(function(r,c,f,T,I){if(we(r,Uint8Array)&&(r=o.from(r,r.offset,r.byteLength)),!o.isBuffer(r))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof r);if(c===void 0&&(c=0),f===void 0&&(f=r?r.length:0),T===void 0&&(T=0),I===void 0&&(I=this.length),c<0||f>r.length||T<0||I>this.length)throw new RangeError("out of range index");if(T>=I&&c>=f)return 0;if(T>=I)return-1;if(c>=f)return 1;if(c>>>=0,f>>>=0,T>>>=0,I>>>=0,this===r)return 0;let B=I-T,F=f-c,re=Math.min(B,F),pe=this.slice(T,I),ne=r.slice(c,f);for(let ae=0;ae<re;++ae)if(pe[ae]!==ne[ae]){B=pe[ae],F=ne[ae];break}return B<F?-1:F<B?1:0},"compare");function k(r,c,f,T,I){if(r.length===0)return-1;if(typeof f=="string"?(T=f,f=0):f>2147483647?f=2147483647:f<-2147483648&&(f=-2147483648),f=+f,Pt(f)&&(f=I?0:r.length-1),f<0&&(f=r.length+f),f>=r.length){if(I)return-1;f=r.length-1}else if(f<0)if(I)f=0;else return-1;if(typeof c=="string"&&(c=o.from(c,T)),o.isBuffer(c))return c.length===0?-1:C(r,c,f,T,I);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?I?Uint8Array.prototype.indexOf.call(r,c,f):Uint8Array.prototype.lastIndexOf.call(r,c,f):C(r,[c],f,T,I);throw new TypeError("val must be string, number or Buffer")}m(k,"bidirectionalIndexOf");function C(r,c,f,T,I){let B=1,F=r.length,re=c.length;if(T!==void 0&&(T=String(T).toLowerCase(),T==="ucs2"||T==="ucs-2"||T==="utf16le"||T==="utf-16le")){if(r.length<2||c.length<2)return-1;B=2,F/=2,re/=2,f/=2}function pe(ae,oe){return B===1?ae[oe]:ae.readUInt16BE(oe*B)}m(pe,"read");let ne;if(I){let ae=-1;for(ne=f;ne<F;ne++)if(pe(r,ne)===pe(c,ae===-1?0:ne-ae)){if(ae===-1&&(ae=ne),ne-ae+1===re)return ae*B}else ae!==-1&&(ne-=ne-ae),ae=-1}else for(f+re>F&&(f=F-re),ne=f;ne>=0;ne--){let ae=!0;for(let oe=0;oe<re;oe++)if(pe(r,ne+oe)!==pe(c,oe)){ae=!1;break}if(ae)return ne}return-1}m(C,"arrayIndexOf"),o.prototype.includes=m(function(r,c,f){return this.indexOf(r,c,f)!==-1},"includes"),o.prototype.indexOf=m(function(r,c,f){return k(this,r,c,f,!0)},"indexOf"),o.prototype.lastIndexOf=m(function(r,c,f){return k(this,r,c,f,!1)},"lastIndexOf");function L(r,c,f,T){f=Number(f)||0;let I=r.length-f;T?(T=Number(T),T>I&&(T=I)):T=I;let B=c.length;T>B/2&&(T=B/2);let F;for(F=0;F<T;++F){let re=parseInt(c.substr(F*2,2),16);if(Pt(re))return F;r[f+F]=re}return F}m(L,"hexWrite");function S(r,c,f,T){return mt(Bt(c,r.length-f),r,f,T)}m(S,"utf8Write");function R(r,c,f,T){return mt(Ds(c),r,f,T)}m(R,"asciiWrite");function A(r,c,f,T){return mt(ds(c),r,f,T)}m(A,"base64Write");function z(r,c,f,T){return mt(Bs(c,r.length-f),r,f,T)}m(z,"ucs2Write"),o.prototype.write=m(function(r,c,f,T){if(c===void 0)T="utf8",f=this.length,c=0;else if(f===void 0&&typeof c=="string")T=c,f=this.length,c=0;else if(isFinite(c))c=c>>>0,isFinite(f)?(f=f>>>0,T===void 0&&(T="utf8")):(T=f,f=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let I=this.length-c;if((f===void 0||f>I)&&(f=I),r.length>0&&(f<0||c<0)||c>this.length)throw new RangeError("Attempt to write outside buffer bounds");T||(T="utf8");let B=!1;for(;;)switch(T){case"hex":return L(this,r,c,f);case"utf8":case"utf-8":return S(this,r,c,f);case"ascii":case"latin1":case"binary":return R(this,r,c,f);case"base64":return A(this,r,c,f);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return z(this,r,c,f);default:if(B)throw new TypeError("Unknown encoding: "+T);T=(""+T).toLowerCase(),B=!0}},"write"),o.prototype.toJSON=m(function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},"toJSON");function j(r,c,f){return c===0&&f===r.length?e.fromByteArray(r):e.fromByteArray(r.slice(c,f))}m(j,"base64Slice");function D(r,c,f){f=Math.min(r.length,f);let T=[],I=c;for(;I<f;){let B=r[I],F=null,re=B>239?4:B>223?3:B>191?2:1;if(I+re<=f){let pe,ne,ae,oe;switch(re){case 1:B<128&&(F=B);break;case 2:pe=r[I+1],(pe&192)===128&&(oe=(B&31)<<6|pe&63,oe>127&&(F=oe));break;case 3:pe=r[I+1],ne=r[I+2],(pe&192)===128&&(ne&192)===128&&(oe=(B&15)<<12|(pe&63)<<6|ne&63,oe>2047&&(oe<55296||oe>57343)&&(F=oe));break;case 4:pe=r[I+1],ne=r[I+2],ae=r[I+3],(pe&192)===128&&(ne&192)===128&&(ae&192)===128&&(oe=(B&15)<<18|(pe&63)<<12|(ne&63)<<6|ae&63,oe>65535&&oe<1114112&&(F=oe))}}F===null?(F=65533,re=1):F>65535&&(F-=65536,T.push(F>>>10&1023|55296),F=56320|F&1023),T.push(F),I+=re}return H(T)}m(D,"utf8Slice");var U=4096;function H(r){let c=r.length;if(c<=U)return String.fromCharCode.apply(String,r);let f="",T=0;for(;T<c;)f+=String.fromCharCode.apply(String,r.slice(T,T+=U));return f}m(H,"decodeCodePointsArray");function Y(r,c,f){let T="";f=Math.min(r.length,f);for(let I=c;I<f;++I)T+=String.fromCharCode(r[I]&127);return T}m(Y,"asciiSlice");function te(r,c,f){let T="";f=Math.min(r.length,f);for(let I=c;I<f;++I)T+=String.fromCharCode(r[I]);return T}m(te,"latin1Slice");function K(r,c,f){let T=r.length;(!c||c<0)&&(c=0),(!f||f<0||f>T)&&(f=T);let I="";for(let B=c;B<f;++B)I+=_r[r[B]];return I}m(K,"hexSlice");function be(r,c,f){let T=r.slice(c,f),I="";for(let B=0;B<T.length-1;B+=2)I+=String.fromCharCode(T[B]+T[B+1]*256);return I}m(be,"utf16leSlice"),o.prototype.slice=m(function(r,c){let f=this.length;r=~~r,c=c===void 0?f:~~c,r<0?(r+=f,r<0&&(r=0)):r>f&&(r=f),c<0?(c+=f,c<0&&(c=0)):c>f&&(c=f),c<r&&(c=r);let T=this.subarray(r,c);return Object.setPrototypeOf(T,o.prototype),T},"slice");function ie(r,c,f){if(r%1!==0||r<0)throw new RangeError("offset is not uint");if(r+c>f)throw new RangeError("Trying to access beyond buffer length")}m(ie,"checkOffset"),o.prototype.readUintLE=o.prototype.readUIntLE=m(function(r,c,f){r=r>>>0,c=c>>>0,f||ie(r,c,this.length);let T=this[r],I=1,B=0;for(;++B<c&&(I*=256);)T+=this[r+B]*I;return T},"readUIntLE"),o.prototype.readUintBE=o.prototype.readUIntBE=m(function(r,c,f){r=r>>>0,c=c>>>0,f||ie(r,c,this.length);let T=this[r+--c],I=1;for(;c>0&&(I*=256);)T+=this[r+--c]*I;return T},"readUIntBE"),o.prototype.readUint8=o.prototype.readUInt8=m(function(r,c){return r=r>>>0,c||ie(r,1,this.length),this[r]},"readUInt8"),o.prototype.readUint16LE=o.prototype.readUInt16LE=m(function(r,c){return r=r>>>0,c||ie(r,2,this.length),this[r]|this[r+1]<<8},"readUInt16LE"),o.prototype.readUint16BE=o.prototype.readUInt16BE=m(function(r,c){return r=r>>>0,c||ie(r,2,this.length),this[r]<<8|this[r+1]},"readUInt16BE"),o.prototype.readUint32LE=o.prototype.readUInt32LE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),(this[r]|this[r+1]<<8|this[r+2]<<16)+this[r+3]*16777216},"readUInt32LE"),o.prototype.readUint32BE=o.prototype.readUInt32BE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),this[r]*16777216+(this[r+1]<<16|this[r+2]<<8|this[r+3])},"readUInt32BE"),o.prototype.readBigUInt64LE=Te(m(function(r){r=r>>>0,ze(r,"offset");let c=this[r],f=this[r+7];(c===void 0||f===void 0)&&Je(r,this.length-8);let T=c+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24,I=this[++r]+this[++r]*2**8+this[++r]*2**16+f*2**24;return BigInt(T)+(BigInt(I)<<BigInt(32))},"readBigUInt64LE")),o.prototype.readBigUInt64BE=Te(m(function(r){r=r>>>0,ze(r,"offset");let c=this[r],f=this[r+7];(c===void 0||f===void 0)&&Je(r,this.length-8);let T=c*2**24+this[++r]*2**16+this[++r]*2**8+this[++r],I=this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+f;return(BigInt(T)<<BigInt(32))+BigInt(I)},"readBigUInt64BE")),o.prototype.readIntLE=m(function(r,c,f){r=r>>>0,c=c>>>0,f||ie(r,c,this.length);let T=this[r],I=1,B=0;for(;++B<c&&(I*=256);)T+=this[r+B]*I;return I*=128,T>=I&&(T-=Math.pow(2,8*c)),T},"readIntLE"),o.prototype.readIntBE=m(function(r,c,f){r=r>>>0,c=c>>>0,f||ie(r,c,this.length);let T=c,I=1,B=this[r+--T];for(;T>0&&(I*=256);)B+=this[r+--T]*I;return I*=128,B>=I&&(B-=Math.pow(2,8*c)),B},"readIntBE"),o.prototype.readInt8=m(function(r,c){return r=r>>>0,c||ie(r,1,this.length),this[r]&128?(255-this[r]+1)*-1:this[r]},"readInt8"),o.prototype.readInt16LE=m(function(r,c){r=r>>>0,c||ie(r,2,this.length);let f=this[r]|this[r+1]<<8;return f&32768?f|4294901760:f},"readInt16LE"),o.prototype.readInt16BE=m(function(r,c){r=r>>>0,c||ie(r,2,this.length);let f=this[r+1]|this[r]<<8;return f&32768?f|4294901760:f},"readInt16BE"),o.prototype.readInt32LE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),this[r]|this[r+1]<<8|this[r+2]<<16|this[r+3]<<24},"readInt32LE"),o.prototype.readInt32BE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),this[r]<<24|this[r+1]<<16|this[r+2]<<8|this[r+3]},"readInt32BE"),o.prototype.readBigInt64LE=Te(m(function(r){r=r>>>0,ze(r,"offset");let c=this[r],f=this[r+7];(c===void 0||f===void 0)&&Je(r,this.length-8);let T=this[r+4]+this[r+5]*2**8+this[r+6]*2**16+(f<<24);return(BigInt(T)<<BigInt(32))+BigInt(c+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24)},"readBigInt64LE")),o.prototype.readBigInt64BE=Te(m(function(r){r=r>>>0,ze(r,"offset");let c=this[r],f=this[r+7];(c===void 0||f===void 0)&&Je(r,this.length-8);let T=(c<<24)+this[++r]*2**16+this[++r]*2**8+this[++r];return(BigInt(T)<<BigInt(32))+BigInt(this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+f)},"readBigInt64BE")),o.prototype.readFloatLE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),s.read(this,r,!0,23,4)},"readFloatLE"),o.prototype.readFloatBE=m(function(r,c){return r=r>>>0,c||ie(r,4,this.length),s.read(this,r,!1,23,4)},"readFloatBE"),o.prototype.readDoubleLE=m(function(r,c){return r=r>>>0,c||ie(r,8,this.length),s.read(this,r,!0,52,8)},"readDoubleLE"),o.prototype.readDoubleBE=m(function(r,c){return r=r>>>0,c||ie(r,8,this.length),s.read(this,r,!1,52,8)},"readDoubleBE");function de(r,c,f,T,I,B){if(!o.isBuffer(r))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>I||c<B)throw new RangeError('"value" argument is out of bounds');if(f+T>r.length)throw new RangeError("Index out of range")}m(de,"checkInt"),o.prototype.writeUintLE=o.prototype.writeUIntLE=m(function(r,c,f,T){if(r=+r,c=c>>>0,f=f>>>0,!T){let F=Math.pow(2,8*f)-1;de(this,r,c,f,F,0)}let I=1,B=0;for(this[c]=r&255;++B<f&&(I*=256);)this[c+B]=r/I&255;return c+f},"writeUIntLE"),o.prototype.writeUintBE=o.prototype.writeUIntBE=m(function(r,c,f,T){if(r=+r,c=c>>>0,f=f>>>0,!T){let F=Math.pow(2,8*f)-1;de(this,r,c,f,F,0)}let I=f-1,B=1;for(this[c+I]=r&255;--I>=0&&(B*=256);)this[c+I]=r/B&255;return c+f},"writeUIntBE"),o.prototype.writeUint8=o.prototype.writeUInt8=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,1,255,0),this[c]=r&255,c+1},"writeUInt8"),o.prototype.writeUint16LE=o.prototype.writeUInt16LE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,2,65535,0),this[c]=r&255,this[c+1]=r>>>8,c+2},"writeUInt16LE"),o.prototype.writeUint16BE=o.prototype.writeUInt16BE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,2,65535,0),this[c]=r>>>8,this[c+1]=r&255,c+2},"writeUInt16BE"),o.prototype.writeUint32LE=o.prototype.writeUInt32LE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,4,4294967295,0),this[c+3]=r>>>24,this[c+2]=r>>>16,this[c+1]=r>>>8,this[c]=r&255,c+4},"writeUInt32LE"),o.prototype.writeUint32BE=o.prototype.writeUInt32BE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,4,4294967295,0),this[c]=r>>>24,this[c+1]=r>>>16,this[c+2]=r>>>8,this[c+3]=r&255,c+4},"writeUInt32BE");function ht(r,c,f,T,I){os(c,T,I,r,f,7);let B=Number(c&BigInt(4294967295));r[f++]=B,B=B>>8,r[f++]=B,B=B>>8,r[f++]=B,B=B>>8,r[f++]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return r[f++]=F,F=F>>8,r[f++]=F,F=F>>8,r[f++]=F,F=F>>8,r[f++]=F,f}m(ht,"wrtBigUInt64LE");function gt(r,c,f,T,I){os(c,T,I,r,f,7);let B=Number(c&BigInt(4294967295));r[f+7]=B,B=B>>8,r[f+6]=B,B=B>>8,r[f+5]=B,B=B>>8,r[f+4]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return r[f+3]=F,F=F>>8,r[f+2]=F,F=F>>8,r[f+1]=F,F=F>>8,r[f]=F,f+8}m(gt,"wrtBigUInt64BE"),o.prototype.writeBigUInt64LE=Te(m(function(r,c=0){return ht(this,r,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64LE")),o.prototype.writeBigUInt64BE=Te(m(function(r,c=0){return gt(this,r,c,BigInt(0),BigInt("0xffffffffffffffff"))},"writeBigUInt64BE")),o.prototype.writeIntLE=m(function(r,c,f,T){if(r=+r,c=c>>>0,!T){let re=Math.pow(2,8*f-1);de(this,r,c,f,re-1,-re)}let I=0,B=1,F=0;for(this[c]=r&255;++I<f&&(B*=256);)r<0&&F===0&&this[c+I-1]!==0&&(F=1),this[c+I]=(r/B>>0)-F&255;return c+f},"writeIntLE"),o.prototype.writeIntBE=m(function(r,c,f,T){if(r=+r,c=c>>>0,!T){let re=Math.pow(2,8*f-1);de(this,r,c,f,re-1,-re)}let I=f-1,B=1,F=0;for(this[c+I]=r&255;--I>=0&&(B*=256);)r<0&&F===0&&this[c+I+1]!==0&&(F=1),this[c+I]=(r/B>>0)-F&255;return c+f},"writeIntBE"),o.prototype.writeInt8=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,1,127,-128),r<0&&(r=255+r+1),this[c]=r&255,c+1},"writeInt8"),o.prototype.writeInt16LE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,2,32767,-32768),this[c]=r&255,this[c+1]=r>>>8,c+2},"writeInt16LE"),o.prototype.writeInt16BE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,2,32767,-32768),this[c]=r>>>8,this[c+1]=r&255,c+2},"writeInt16BE"),o.prototype.writeInt32LE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,4,2147483647,-2147483648),this[c]=r&255,this[c+1]=r>>>8,this[c+2]=r>>>16,this[c+3]=r>>>24,c+4},"writeInt32LE"),o.prototype.writeInt32BE=m(function(r,c,f){return r=+r,c=c>>>0,f||de(this,r,c,4,2147483647,-2147483648),r<0&&(r=4294967295+r+1),this[c]=r>>>24,this[c+1]=r>>>16,this[c+2]=r>>>8,this[c+3]=r&255,c+4},"writeInt32BE"),o.prototype.writeBigInt64LE=Te(m(function(r,c=0){return ht(this,r,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64LE")),o.prototype.writeBigInt64BE=Te(m(function(r,c=0){return gt(this,r,c,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))},"writeBigInt64BE"));function is(r,c,f,T,I,B){if(f+T>r.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("Index out of range")}m(is,"checkIEEE754");function rs(r,c,f,T,I){return c=+c,f=f>>>0,I||is(r,c,f,4),s.write(r,c,f,T,23,4),f+4}m(rs,"writeFloat"),o.prototype.writeFloatLE=m(function(r,c,f){return rs(this,r,c,!0,f)},"writeFloatLE"),o.prototype.writeFloatBE=m(function(r,c,f){return rs(this,r,c,!1,f)},"writeFloatBE");function as(r,c,f,T,I){return c=+c,f=f>>>0,I||is(r,c,f,8),s.write(r,c,f,T,52,8),f+8}m(as,"writeDouble"),o.prototype.writeDoubleLE=m(function(r,c,f){return as(this,r,c,!0,f)},"writeDoubleLE"),o.prototype.writeDoubleBE=m(function(r,c,f){return as(this,r,c,!1,f)},"writeDoubleBE"),o.prototype.copy=m(function(r,c,f,T){if(!o.isBuffer(r))throw new TypeError("argument should be a Buffer");if(f||(f=0),!T&&T!==0&&(T=this.length),c>=r.length&&(c=r.length),c||(c=0),T>0&&T<f&&(T=f),T===f||r.length===0||this.length===0)return 0;if(c<0)throw new RangeError("targetStart out of bounds");if(f<0||f>=this.length)throw new RangeError("Index out of range");if(T<0)throw new RangeError("sourceEnd out of bounds");T>this.length&&(T=this.length),r.length-c<T-f&&(T=r.length-c+f);let I=T-f;return this===r&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(c,f,T):Uint8Array.prototype.set.call(r,this.subarray(f,T),c),I},"copy"),o.prototype.fill=m(function(r,c,f,T){if(typeof r=="string"){if(typeof c=="string"?(T=c,c=0,f=this.length):typeof f=="string"&&(T=f,f=this.length),T!==void 0&&typeof T!="string")throw new TypeError("encoding must be a string");if(typeof T=="string"&&!o.isEncoding(T))throw new TypeError("Unknown encoding: "+T);if(r.length===1){let B=r.charCodeAt(0);(T==="utf8"&&B<128||T==="latin1")&&(r=B)}}else typeof r=="number"?r=r&255:typeof r=="boolean"&&(r=Number(r));if(c<0||this.length<c||this.length<f)throw new RangeError("Out of range index");if(f<=c)return this;c=c>>>0,f=f===void 0?this.length:f>>>0,r||(r=0);let I;if(typeof r=="number")for(I=c;I<f;++I)this[I]=r;else{let B=o.isBuffer(r)?r:o.from(r,T),F=B.length;if(F===0)throw new TypeError('The value "'+r+'" is invalid for argument "value"');for(I=0;I<f-c;++I)this[I+c]=B[I%F]}return this},"fill");var Ke={};function Dt(r,c,f){var T;Ke[r]=(T=class extends f{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${r}]`,this.stack,delete this.name}get code(){return r}set code(I){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:I,writable:!0})}toString(){return`${this.name} [${r}]: ${this.message}`}},m(T,"NodeError"),T)}m(Dt,"E"),Dt("ERR_BUFFER_OUT_OF_BOUNDS",function(r){return r?`${r} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Dt("ERR_INVALID_ARG_TYPE",function(r,c){return`The "${r}" argument must be of type number. Received type ${typeof c}`},TypeError),Dt("ERR_OUT_OF_RANGE",function(r,c,f){let T=`The value of "${r}" is out of range.`,I=f;return Number.isInteger(f)&&Math.abs(f)>2**32?I=ns(String(f)):typeof f=="bigint"&&(I=String(f),(f>BigInt(2)**BigInt(32)||f<-(BigInt(2)**BigInt(32)))&&(I=ns(I)),I+="n"),T+=` It must be ${c}. Received ${I}`,T},RangeError);function ns(r){let c="",f=r.length,T=r[0]==="-"?1:0;for(;f>=T+4;f-=3)c=`_${r.slice(f-3,f)}${c}`;return`${r.slice(0,f)}${c}`}m(ns,"addNumericalSeparator");function Rs(r,c,f){ze(c,"offset"),(r[c]===void 0||r[c+f]===void 0)&&Je(c,r.length-(f+1))}m(Rs,"checkBounds");function os(r,c,f,T,I,B){if(r>f||r<c){let F=typeof c=="bigint"?"n":"",re;throw B>3?c===0||c===BigInt(0)?re=`>= 0${F} and < 2${F} ** ${(B+1)*8}${F}`:re=`>= -(2${F} ** ${(B+1)*8-1}${F}) and < 2 ** ${(B+1)*8-1}${F}`:re=`>= ${c}${F} and <= ${f}${F}`,new Ke.ERR_OUT_OF_RANGE("value",re,r)}Rs(T,I,B)}m(os,"checkIntBI");function ze(r,c){if(typeof r!="number")throw new Ke.ERR_INVALID_ARG_TYPE(c,"number",r)}m(ze,"validateNumber");function Je(r,c,f){throw Math.floor(r)!==r?(ze(r,f),new Ke.ERR_OUT_OF_RANGE(f||"offset","an integer",r)):c<0?new Ke.ERR_BUFFER_OUT_OF_BOUNDS:new Ke.ERR_OUT_OF_RANGE(f||"offset",`>= ${f?1:0} and <= ${c}`,r)}m(Je,"boundsError");var wr=/[^+/0-9A-Za-z-_]/g;function Ns(r){if(r=r.split("=")[0],r=r.trim().replace(wr,""),r.length<2)return"";for(;r.length%4!==0;)r=r+"=";return r}m(Ns,"base64clean");function Bt(r,c){c=c||1/0;let f,T=r.length,I=null,B=[];for(let F=0;F<T;++F){if(f=r.charCodeAt(F),f>55295&&f<57344){if(!I){if(f>56319){(c-=3)>-1&&B.push(239,191,189);continue}else if(F+1===T){(c-=3)>-1&&B.push(239,191,189);continue}I=f;continue}if(f<56320){(c-=3)>-1&&B.push(239,191,189),I=f;continue}f=(I-55296<<10|f-56320)+65536}else I&&(c-=3)>-1&&B.push(239,191,189);if(I=null,f<128){if((c-=1)<0)break;B.push(f)}else if(f<2048){if((c-=2)<0)break;B.push(f>>6|192,f&63|128)}else if(f<65536){if((c-=3)<0)break;B.push(f>>12|224,f>>6&63|128,f&63|128)}else if(f<1114112){if((c-=4)<0)break;B.push(f>>18|240,f>>12&63|128,f>>6&63|128,f&63|128)}else throw new Error("Invalid code point")}return B}m(Bt,"utf8ToBytes");function Ds(r){let c=[];for(let f=0;f<r.length;++f)c.push(r.charCodeAt(f)&255);return c}m(Ds,"asciiToBytes");function Bs(r,c){let f,T,I,B=[];for(let F=0;F<r.length&&!((c-=2)<0);++F)f=r.charCodeAt(F),T=f>>8,I=f%256,B.push(I),B.push(T);return B}m(Bs,"utf16leToBytes");function ds(r){return e.toByteArray(Ns(r))}m(ds,"base64ToBytes");function mt(r,c,f,T){let I;for(I=0;I<T&&!(I+f>=c.length||I>=r.length);++I)c[I+f]=r[I];return I}m(mt,"blitBuffer");function we(r,c){return r instanceof c||r!=null&&r.constructor!=null&&r.constructor.name!=null&&r.constructor.name===c.name}m(we,"isInstance");function Pt(r){return r!==r}m(Pt,"numberIsNaN");var _r=(function(){let r="0123456789abcdef",c=new Array(256);for(let f=0;f<16;++f){let T=f*16;for(let I=0;I<16;++I)c[T+I]=r[f]+r[I]}return c})();function Te(r){return typeof BigInt>"u"?Ps:r}m(Te,"defineBigIntMethod");function Ps(){throw new Error("BigInt not supported")}m(Ps,"BufferBigIntNotDefined")}),Xt,xs,W,J,q=me(()=>{Xt=globalThis,xs=globalThis.setImmediate??(t=>setTimeout(t,0)),W=typeof globalThis.Buffer=="function"&&typeof globalThis.Buffer.allocUnsafe=="function"?globalThis.Buffer:ma().Buffer,J=globalThis.process??{},J.env??(J.env={});try{J.nextTick(()=>{})}catch{let t=Promise.resolve();J.nextTick=t.then.bind(t)}}),Xe=Z((t,e)=>{q();var s=typeof Reflect=="object"?Reflect:null,i=s&&typeof s.apply=="function"?s.apply:m(function(k,C,L){return Function.prototype.apply.call(k,C,L)},"ReflectApply"),a;s&&typeof s.ownKeys=="function"?a=s.ownKeys:Object.getOwnPropertySymbols?a=m(function(k){return Object.getOwnPropertyNames(k).concat(Object.getOwnPropertySymbols(k))},"ReflectOwnKeys"):a=m(function(k){return Object.getOwnPropertyNames(k)},"ReflectOwnKeys");function n(k){console&&console.warn&&console.warn(k)}m(n,"ProcessEmitWarning");var d=Number.isNaN||m(function(k){return k!==k},"NumberIsNaN");function o(){o.init.call(this)}m(o,"EventEmitter"),e.exports=o,e.exports.once=E,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var u=10;function h(k){if(typeof k!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof k)}m(h,"checkListener"),Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:m(function(){return u},"get"),set:m(function(k){if(typeof k!="number"||k<0||d(k))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+k+".");u=k},"set")}),o.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=m(function(k){if(typeof k!="number"||k<0||d(k))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+k+".");return this._maxListeners=k,this},"setMaxListeners");function g(k){return k._maxListeners===void 0?o.defaultMaxListeners:k._maxListeners}m(g,"_getMaxListeners"),o.prototype.getMaxListeners=m(function(){return g(this)},"getMaxListeners"),o.prototype.emit=m(function(k){for(var C=[],L=1;L<arguments.length;L++)C.push(arguments[L]);var S=k==="error",R=this._events;if(R!==void 0)S=S&&R.error===void 0;else if(!S)return!1;if(S){var A;if(C.length>0&&(A=C[0]),A instanceof Error)throw A;var z=new Error("Unhandled error."+(A?" ("+A.message+")":""));throw z.context=A,z}var j=R[k];if(j===void 0)return!1;if(typeof j=="function")i(j,this,C);else for(var D=j.length,U=v(j,D),L=0;L<D;++L)i(U[L],this,C);return!0},"emit");function x(k,C,L,S){var R,A,z;if(h(L),A=k._events,A===void 0?(A=k._events=Object.create(null),k._eventsCount=0):(A.newListener!==void 0&&(k.emit("newListener",C,L.listener?L.listener:L),A=k._events),z=A[C]),z===void 0)z=A[C]=L,++k._eventsCount;else if(typeof z=="function"?z=A[C]=S?[L,z]:[z,L]:S?z.unshift(L):z.push(L),R=g(k),R>0&&z.length>R&&!z.warned){z.warned=!0;var j=new Error("Possible EventEmitter memory leak detected. "+z.length+" "+String(C)+" listeners added. Use emitter.setMaxListeners() to increase limit");j.name="MaxListenersExceededWarning",j.emitter=k,j.type=C,j.count=z.length,n(j)}return k}m(x,"_addListener"),o.prototype.addListener=m(function(k,C){return x(this,k,C,!1)},"addListener"),o.prototype.on=o.prototype.addListener,o.prototype.prependListener=m(function(k,C){return x(this,k,C,!0)},"prependListener");function b(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}m(b,"onceWrapper");function y(k,C,L){var S={fired:!1,wrapFn:void 0,target:k,type:C,listener:L},R=b.bind(S);return R.listener=L,S.wrapFn=R,R}m(y,"_onceWrap"),o.prototype.once=m(function(k,C){return h(C),this.on(k,y(this,k,C)),this},"once"),o.prototype.prependOnceListener=m(function(k,C){return h(C),this.prependListener(k,y(this,k,C)),this},"prependOnceListener"),o.prototype.removeListener=m(function(k,C){var L,S,R,A,z;if(h(C),S=this._events,S===void 0)return this;if(L=S[k],L===void 0)return this;if(L===C||L.listener===C)--this._eventsCount===0?this._events=Object.create(null):(delete S[k],S.removeListener&&this.emit("removeListener",k,L.listener||C));else if(typeof L!="function"){for(R=-1,A=L.length-1;A>=0;A--)if(L[A]===C||L[A].listener===C){z=L[A].listener,R=A;break}if(R<0)return this;R===0?L.shift():w(L,R),L.length===1&&(S[k]=L[0]),S.removeListener!==void 0&&this.emit("removeListener",k,z||C)}return this},"removeListener"),o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=m(function(k){var C,L,S;if(L=this._events,L===void 0)return this;if(L.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):L[k]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete L[k]),this;if(arguments.length===0){var R=Object.keys(L),A;for(S=0;S<R.length;++S)A=R[S],A!=="removeListener"&&this.removeAllListeners(A);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(C=L[k],typeof C=="function")this.removeListener(k,C);else if(C!==void 0)for(S=C.length-1;S>=0;S--)this.removeListener(k,C[S]);return this},"removeAllListeners");function l(k,C,L){var S=k._events;if(S===void 0)return[];var R=S[C];return R===void 0?[]:typeof R=="function"?L?[R.listener||R]:[R]:L?_(R):v(R,R.length)}m(l,"_listeners"),o.prototype.listeners=m(function(k){return l(this,k,!0)},"listeners"),o.prototype.rawListeners=m(function(k){return l(this,k,!1)},"rawListeners"),o.listenerCount=function(k,C){return typeof k.listenerCount=="function"?k.listenerCount(C):p.call(k,C)},o.prototype.listenerCount=p;function p(k){var C=this._events;if(C!==void 0){var L=C[k];if(typeof L=="function")return 1;if(L!==void 0)return L.length}return 0}m(p,"listenerCount"),o.prototype.eventNames=m(function(){return this._eventsCount>0?a(this._events):[]},"eventNames");function v(k,C){for(var L=new Array(C),S=0;S<C;++S)L[S]=k[S];return L}m(v,"arrayClone");function w(k,C){for(;C+1<k.length;C++)k[C]=k[C+1];k.pop()}m(w,"spliceOne");function _(k){for(var C=new Array(k.length),L=0;L<C.length;++L)C[L]=k[L].listener||k[L];return C}m(_,"unwrapListeners");function E(k,C){return new Promise(function(L,S){function R(z){k.removeListener(C,A),S(z)}m(R,"errorListener");function A(){typeof k.removeListener=="function"&&k.removeListener("error",R),L([].slice.call(arguments))}m(A,"resolver"),M(k,C,A,{once:!0}),C!=="error"&&O(k,R,{once:!0})})}m(E,"once");function O(k,C,L){typeof k.on=="function"&&M(k,"error",C,L)}m(O,"addErrorHandlerIfEventEmitter");function M(k,C,L,S){if(typeof k.on=="function")S.once?k.once(C,L):k.on(C,L);else if(typeof k.addEventListener=="function")k.addEventListener(C,m(function R(A){S.once&&k.removeEventListener(C,R),L(A)},"wrapListener"));else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof k)}m(M,"eventTargetAgnosticAddListener")}),ki={};Se(ki,{Socket:()=>kt,isIP:()=>Si});function Si(t){return 0}var qs,us,yt,kt,Ot=me(()=>{q(),qs=Ye(Xe(),1),m(Si,"isIP"),us=/^[^.]+\./,yt=class V extends qs.EventEmitter{constructor(){super(...arguments),Q(this,"opts",{}),Q(this,"connecting",!1),Q(this,"pending",!0),Q(this,"writable",!0),Q(this,"encrypted",!1),Q(this,"authorized",!1),Q(this,"destroyed",!1),Q(this,"ws",null),Q(this,"writeBuffer"),Q(this,"tlsState",0),Q(this,"tlsRead"),Q(this,"tlsWrite")}static get poolQueryViaFetch(){return V.opts.poolQueryViaFetch??V.defaults.poolQueryViaFetch}static set poolQueryViaFetch(e){V.opts.poolQueryViaFetch=e}static get fetchEndpoint(){return V.opts.fetchEndpoint??V.defaults.fetchEndpoint}static set fetchEndpoint(e){V.opts.fetchEndpoint=e}static get fetchConnectionCache(){return!0}static set fetchConnectionCache(e){console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)")}static get fetchFunction(){return V.opts.fetchFunction??V.defaults.fetchFunction}static set fetchFunction(e){V.opts.fetchFunction=e}static get webSocketConstructor(){return V.opts.webSocketConstructor??V.defaults.webSocketConstructor}static set webSocketConstructor(e){V.opts.webSocketConstructor=e}get webSocketConstructor(){return this.opts.webSocketConstructor??V.webSocketConstructor}set webSocketConstructor(e){this.opts.webSocketConstructor=e}static get wsProxy(){return V.opts.wsProxy??V.defaults.wsProxy}static set wsProxy(e){V.opts.wsProxy=e}get wsProxy(){return this.opts.wsProxy??V.wsProxy}set wsProxy(e){this.opts.wsProxy=e}static get coalesceWrites(){return V.opts.coalesceWrites??V.defaults.coalesceWrites}static set coalesceWrites(e){V.opts.coalesceWrites=e}get coalesceWrites(){return this.opts.coalesceWrites??V.coalesceWrites}set coalesceWrites(e){this.opts.coalesceWrites=e}static get useSecureWebSocket(){return V.opts.useSecureWebSocket??V.defaults.useSecureWebSocket}static set useSecureWebSocket(e){V.opts.useSecureWebSocket=e}get useSecureWebSocket(){return this.opts.useSecureWebSocket??V.useSecureWebSocket}set useSecureWebSocket(e){this.opts.useSecureWebSocket=e}static get forceDisablePgSSL(){return V.opts.forceDisablePgSSL??V.defaults.forceDisablePgSSL}static set forceDisablePgSSL(e){V.opts.forceDisablePgSSL=e}get forceDisablePgSSL(){return this.opts.forceDisablePgSSL??V.forceDisablePgSSL}set forceDisablePgSSL(e){this.opts.forceDisablePgSSL=e}static get disableSNI(){return V.opts.disableSNI??V.defaults.disableSNI}static set disableSNI(e){V.opts.disableSNI=e}get disableSNI(){return this.opts.disableSNI??V.disableSNI}set disableSNI(e){this.opts.disableSNI=e}static get disableWarningInBrowsers(){return V.opts.disableWarningInBrowsers??V.defaults.disableWarningInBrowsers}static set disableWarningInBrowsers(e){V.opts.disableWarningInBrowsers=e}get disableWarningInBrowsers(){return this.opts.disableWarningInBrowsers??V.disableWarningInBrowsers}set disableWarningInBrowsers(e){this.opts.disableWarningInBrowsers=e}static get pipelineConnect(){return V.opts.pipelineConnect??V.defaults.pipelineConnect}static set pipelineConnect(e){V.opts.pipelineConnect=e}get pipelineConnect(){return this.opts.pipelineConnect??V.pipelineConnect}set pipelineConnect(e){this.opts.pipelineConnect=e}static get subtls(){return V.opts.subtls??V.defaults.subtls}static set subtls(e){V.opts.subtls=e}get subtls(){return this.opts.subtls??V.subtls}set subtls(e){this.opts.subtls=e}static get pipelineTLS(){return V.opts.pipelineTLS??V.defaults.pipelineTLS}static set pipelineTLS(e){V.opts.pipelineTLS=e}get pipelineTLS(){return this.opts.pipelineTLS??V.pipelineTLS}set pipelineTLS(e){this.opts.pipelineTLS=e}static get rootCerts(){return V.opts.rootCerts??V.defaults.rootCerts}static set rootCerts(e){V.opts.rootCerts=e}get rootCerts(){return this.opts.rootCerts??V.rootCerts}set rootCerts(e){this.opts.rootCerts=e}wsProxyAddrForHost(e,s){let i=this.wsProxy;if(i===void 0)throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");return typeof i=="function"?i(e,s):`${i}?address=${e}:${s}`}setNoDelay(){return this}setKeepAlive(){return this}ref(){return this}unref(){return this}connect(e,s,i){this.connecting=!0,i&&this.once("connect",i);let a=m(()=>{this.connecting=!1,this.pending=!1,this.emit("connect"),this.emit("ready")},"handleWebSocketOpen"),n=m((o,u=!1)=>{o.binaryType="arraybuffer",o.addEventListener("error",h=>{this.emit("error",h),this.emit("close")}),o.addEventListener("message",h=>{if(this.tlsState===0){let g=W.from(h.data);this.emit("data",g)}}),o.addEventListener("close",()=>{this.emit("close")}),u?a():o.addEventListener("open",a)},"configureWebSocket"),d;try{d=this.wsProxyAddrForHost(s,typeof e=="string"?parseInt(e,10):e)}catch(o){this.emit("error",o),this.emit("close");return}try{let o=(this.useSecureWebSocket?"wss:":"ws:")+"//"+d;if(this.webSocketConstructor!==void 0)this.ws=new this.webSocketConstructor(o),n(this.ws);else try{this.ws=new WebSocket(o),n(this.ws)}catch{this.ws=new __unstable_WebSocket(o),n(this.ws)}}catch(o){let u=(this.useSecureWebSocket?"https:":"http:")+"//"+d;fetch(u,{headers:{Upgrade:"websocket"}}).then(h=>{if(this.ws=h.webSocket,this.ws==null)throw o;this.ws.accept(),n(this.ws,!0)}).catch(h=>{this.emit("error",new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${h}`)),this.emit("close")})}}async startTls(e){if(this.subtls===void 0)throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");this.tlsState=1;let s=await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts),i=new this.subtls.WebSocketReadQueue(this.ws),a=i.read.bind(i),n=this.rawWrite.bind(this),{read:d,write:o}=await this.subtls.startTls(e,s,a,n,{useSNI:!this.disableSNI,expectPreData:this.pipelineTLS?new Uint8Array([83]):void 0});this.tlsRead=d,this.tlsWrite=o,this.tlsState=2,this.encrypted=!0,this.authorized=!0,this.emit("secureConnection",this),this.tlsReadLoop()}async tlsReadLoop(){for(;;){let e=await this.tlsRead();if(e===void 0)break;{let s=W.from(e);this.emit("data",s)}}}rawWrite(e){if(!this.coalesceWrites){this.ws&&this.ws.send(e);return}if(this.writeBuffer===void 0)this.writeBuffer=e,setTimeout(()=>{this.ws&&this.ws.send(this.writeBuffer),this.writeBuffer=void 0},0);else{let s=new Uint8Array(this.writeBuffer.length+e.length);s.set(this.writeBuffer),s.set(e,this.writeBuffer.length),this.writeBuffer=s}}write(e,s="utf8",i=a=>{}){return e.length===0?(i(),!0):(typeof e=="string"&&(e=W.from(e,s)),this.tlsState===0?(this.rawWrite(e),i()):this.tlsState===1?this.once("secureConnection",()=>{this.write(e,s,i)}):(this.tlsWrite(e),i()),!0)}end(e=W.alloc(0),s="utf8",i=()=>{}){return this.write(e,s,()=>{this.ws.close(),i()}),this}destroy(){return this.destroyed=!0,this.end()}},m(yt,"Socket"),Q(yt,"defaults",{poolQueryViaFetch:!1,fetchEndpoint:m((t,e,s)=>{let i;return s!=null&&s.jwtAuth?i=t.replace(us,"apiauth."):i=t.replace(us,"api."),"https://"+i+"/sql"},"fetchEndpoint"),fetchConnectionCache:!0,fetchFunction:void 0,webSocketConstructor:void 0,wsProxy:m(t=>t+"/v2","wsProxy"),useSecureWebSocket:!0,forceDisablePgSSL:!0,coalesceWrites:!0,pipelineConnect:"password",subtls:void 0,rootCerts:"",pipelineTLS:!1,disableSNI:!1,disableWarningInBrowsers:!1}),Q(yt,"opts",{}),kt=yt}),Ti={};Se(Ti,{parse:()=>ws});function ws(t,e=!1){let{protocol:s}=new URL(t),i="http:"+t.substring(s.length),{username:a,password:n,host:d,hostname:o,port:u,pathname:h,search:g,searchParams:x,hash:b}=new URL(i);n=decodeURIComponent(n),a=decodeURIComponent(a),h=decodeURIComponent(h);let y=a+":"+n,l=e?Object.fromEntries(x.entries()):g;return{href:t,protocol:s,auth:y,username:a,password:n,host:d,hostname:o,port:u,pathname:h,search:g,query:l,hash:b}}var Ii=me(()=>{q(),m(ws,"parse")}),Ci=Z(t=>{q(),t.parse=function(a,n){return new s(a,n).parse()};var e=class Li{constructor(n,d){this.source=n,this.transform=d||i,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var n=this.source[this.position++];return n==="\\"?{value:this.source[this.position++],escaped:!0}:{value:n,escaped:!1}}record(n){this.recorded.push(n)}newEntry(n){var d;(this.recorded.length>0||n)&&(d=this.recorded.join(""),d==="NULL"&&!n&&(d=null),d!==null&&(d=this.transform(d)),this.entries.push(d),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var n=this.nextCharacter();if(n.value==="=")break}}parse(n){var d,o,u;for(this.consumeDimensions();!this.isEof();)if(d=this.nextCharacter(),d.value==="{"&&!u)this.dimension++,this.dimension>1&&(o=new Li(this.source.substr(this.position-1),this.transform),this.entries.push(o.parse(!0)),this.position+=o.position-2);else if(d.value==="}"&&!u){if(this.dimension--,!this.dimension&&(this.newEntry(),n))return this.entries}else d.value==='"'&&!d.escaped?(u&&this.newEntry(!0),u=!u):d.value===","&&!u?this.newEntry():this.record(d.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}};m(e,"ArrayParser");var s=e;function i(a){return a}m(i,"identity")}),Ai=Z((t,e)=>{q();var s=Ci();e.exports={create:m(function(i,a){return{parse:m(function(){return s.parse(i,a)},"parse")}},"create")}}),ba=Z((t,e)=>{q();var s=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,i=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,a=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,n=/^-?infinity$/;e.exports=m(function(g){if(n.test(g))return Number(g.replace("i","I"));var x=s.exec(g);if(!x)return d(g)||null;var b=!!x[8],y=parseInt(x[1],10);b&&(y=u(y));var l=parseInt(x[2],10)-1,p=x[3],v=parseInt(x[4],10),w=parseInt(x[5],10),_=parseInt(x[6],10),E=x[7];E=E?1e3*parseFloat(E):0;var O,M=o(g);return M!=null?(O=new Date(Date.UTC(y,l,p,v,w,_,E)),h(y)&&O.setUTCFullYear(y),M!==0&&O.setTime(O.getTime()-M)):(O=new Date(y,l,p,v,w,_,E),h(y)&&O.setFullYear(y)),O},"parseDate");function d(g){var x=i.exec(g);if(x){var b=parseInt(x[1],10),y=!!x[4];y&&(b=u(b));var l=parseInt(x[2],10)-1,p=x[3],v=new Date(b,l,p);return h(b)&&v.setFullYear(b),v}}m(d,"getDate");function o(g){if(g.endsWith("+00"))return 0;var x=a.exec(g.split(" ")[1]);if(x){var b=x[1];if(b==="Z")return 0;var y=b==="-"?-1:1,l=parseInt(x[2],10)*3600+parseInt(x[3]||0,10)*60+parseInt(x[4]||0,10);return l*y*1e3}}m(o,"timeZoneOffset");function u(g){return-(g-1)}m(u,"bcYearToNegativeYear");function h(g){return g>=0&&g<100}m(h,"is0To99")}),va=Z((t,e)=>{q(),e.exports=i;var s=Object.prototype.hasOwnProperty;function i(a){for(var n=1;n<arguments.length;n++){var d=arguments[n];for(var o in d)s.call(d,o)&&(a[o]=d[o])}return a}m(i,"extend")}),ya=Z((t,e)=>{q();var s=va();e.exports=i;function i(_){if(!(this instanceof i))return new i(_);s(this,w(_))}m(i,"PostgresInterval");var a=["seconds","minutes","hours","days","months","years"];i.prototype.toPostgres=function(){var _=a.filter(this.hasOwnProperty,this);return this.milliseconds&&_.indexOf("seconds")<0&&_.push("seconds"),_.length===0?"0":_.map(function(E){var O=this[E]||0;return E==="seconds"&&this.milliseconds&&(O=(O+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),O+" "+E},this).join(" ")};var n={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},d=["years","months","days"],o=["hours","minutes","seconds"];i.prototype.toISOString=i.prototype.toISO=function(){var _=d.map(O,this).join(""),E=o.map(O,this).join("");return"P"+_+"T"+E;function O(M){var k=this[M]||0;return M==="seconds"&&this.milliseconds&&(k=(k+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),k+n[M]}};var u="([+-]?\\d+)",h=u+"\\s+years?",g=u+"\\s+mons?",x=u+"\\s+days?",b="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",y=new RegExp([h,g,x,b].map(function(_){return"("+_+")?"}).join("\\s*")),l={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},p=["hours","minutes","seconds","milliseconds"];function v(_){var E=_+"000000".slice(_.length);return parseInt(E,10)/1e3}m(v,"parseMilliseconds");function w(_){if(!_)return{};var E=y.exec(_),O=E[8]==="-";return Object.keys(l).reduce(function(M,k){var C=l[k],L=E[C];return!L||(L=k==="milliseconds"?v(L):parseInt(L,10),!L)||(O&&~p.indexOf(k)&&(L*=-1),M[k]=L),M},{})}m(w,"parse")}),xa=Z((t,e)=>{q(),e.exports=m(function(s){if(/^\\x/.test(s))return new W(s.substr(2),"hex");for(var i="",a=0;a<s.length;)if(s[a]!=="\\")i+=s[a],++a;else if(/[0-7]{3}/.test(s.substr(a+1,3)))i+=String.fromCharCode(parseInt(s.substr(a+1,3),8)),a+=4;else{for(var n=1;a+n<s.length&&s[a+n]==="\\";)n++;for(var d=0;d<Math.floor(n/2);++d)i+="\\";a+=Math.floor(n/2)*2}return new W(i,"binary")},"parseBytea")}),wa=Z((t,e)=>{q();var s=Ci(),i=Ai(),a=ba(),n=ya(),d=xa();function o(S){return m(function(R){return R===null?R:S(R)},"nullAllowed")}m(o,"allowNull");function u(S){return S===null?S:S==="TRUE"||S==="t"||S==="true"||S==="y"||S==="yes"||S==="on"||S==="1"}m(u,"parseBool");function h(S){return S?s.parse(S,u):null}m(h,"parseBoolArray");function g(S){return parseInt(S,10)}m(g,"parseBaseTenInt");function x(S){return S?s.parse(S,o(g)):null}m(x,"parseIntegerArray");function b(S){return S?s.parse(S,o(function(R){return O(R).trim()})):null}m(b,"parseBigIntegerArray");var y=m(function(S){if(!S)return null;var R=i.create(S,function(A){return A!==null&&(A=k(A)),A});return R.parse()},"parsePointArray"),l=m(function(S){if(!S)return null;var R=i.create(S,function(A){return A!==null&&(A=parseFloat(A)),A});return R.parse()},"parseFloatArray"),p=m(function(S){if(!S)return null;var R=i.create(S);return R.parse()},"parseStringArray"),v=m(function(S){if(!S)return null;var R=i.create(S,function(A){return A!==null&&(A=a(A)),A});return R.parse()},"parseDateArray"),w=m(function(S){if(!S)return null;var R=i.create(S,function(A){return A!==null&&(A=n(A)),A});return R.parse()},"parseIntervalArray"),_=m(function(S){return S?s.parse(S,o(d)):null},"parseByteAArray"),E=m(function(S){return parseInt(S,10)},"parseInteger"),O=m(function(S){var R=String(S);return/^\d+$/.test(R)?R:S},"parseBigInteger"),M=m(function(S){return S?s.parse(S,o(JSON.parse)):null},"parseJsonArray"),k=m(function(S){return S[0]!=="("?null:(S=S.substring(1,S.length-1).split(","),{x:parseFloat(S[0]),y:parseFloat(S[1])})},"parsePoint"),C=m(function(S){if(S[0]!=="<"&&S[1]!=="(")return null;for(var R="(",A="",z=!1,j=2;j<S.length-1;j++){if(z||(R+=S[j]),S[j]===")"){z=!0;continue}else if(!z)continue;S[j]!==","&&(A+=S[j])}var D=k(R);return D.radius=parseFloat(A),D},"parseCircle"),L=m(function(S){S(20,O),S(21,E),S(23,E),S(26,E),S(700,parseFloat),S(701,parseFloat),S(16,u),S(1082,a),S(1114,a),S(1184,a),S(600,k),S(651,p),S(718,C),S(1e3,h),S(1001,_),S(1005,x),S(1007,x),S(1028,x),S(1016,b),S(1017,y),S(1021,l),S(1022,l),S(1231,l),S(1014,p),S(1015,p),S(1008,p),S(1009,p),S(1040,p),S(1041,p),S(1115,v),S(1182,v),S(1185,v),S(1186,n),S(1187,w),S(17,d),S(114,JSON.parse.bind(JSON)),S(3802,JSON.parse.bind(JSON)),S(199,M),S(3807,M),S(3907,p),S(2951,p),S(791,p),S(1183,p),S(1270,p)},"init");e.exports={init:L}}),_a=Z((t,e)=>{q();var s=1e6;function i(a){var n=a.readInt32BE(0),d=a.readUInt32BE(4),o="";n<0&&(n=~n+(d===0),d=~d+1>>>0,o="-");var u="",h,g,x,b,y,l;{if(h=n%s,n=n/s>>>0,g=4294967296*h+d,d=g/s>>>0,x=""+(g-s*d),d===0&&n===0)return o+x+u;for(b="",y=6-x.length,l=0;l<y;l++)b+="0";u=b+x+u}{if(h=n%s,n=n/s>>>0,g=4294967296*h+d,d=g/s>>>0,x=""+(g-s*d),d===0&&n===0)return o+x+u;for(b="",y=6-x.length,l=0;l<y;l++)b+="0";u=b+x+u}{if(h=n%s,n=n/s>>>0,g=4294967296*h+d,d=g/s>>>0,x=""+(g-s*d),d===0&&n===0)return o+x+u;for(b="",y=6-x.length,l=0;l<y;l++)b+="0";u=b+x+u}return h=n%s,g=4294967296*h+d,x=""+g%s,o+x+u}m(i,"readInt8"),e.exports=i}),Ea=Z((t,e)=>{q();var s=_a(),i=m(function(p,v,w,_,E){w=w||0,_=_||!1,E=E||function(z,j,D){return z*Math.pow(2,D)+j};var O=w>>3,M=m(function(z){return _?~z&255:z},"inv"),k=255,C=8-w%8;v<C&&(k=255<<8-v&255,C=v),w&&(k=k>>w%8);var L=0;w%8+v>=8&&(L=E(0,M(p[O])&k,C));for(var S=v+w>>3,R=O+1;R<S;R++)L=E(L,M(p[R]),8);var A=(v+w)%8;return A>0&&(L=E(L,M(p[S])>>8-A,A)),L},"parseBits"),a=m(function(p,v,w){var _=Math.pow(2,w-1)-1,E=i(p,1),O=i(p,w,1);if(O===0)return 0;var M=1,k=m(function(L,S,R){L===0&&(L=1);for(var A=1;A<=R;A++)M/=2,(S&1<<R-A)>0&&(L+=M);return L},"parsePrecisionBits"),C=i(p,v,w+1,!1,k);return O==Math.pow(2,w+1)-1?C===0?E===0?1/0:-1/0:NaN:(E===0?1:-1)*Math.pow(2,O-_)*C},"parseFloatFromBits"),n=m(function(p){return i(p,1)==1?-1*(i(p,15,1,!0)+1):i(p,15,1)},"parseInt16"),d=m(function(p){return i(p,1)==1?-1*(i(p,31,1,!0)+1):i(p,31,1)},"parseInt32"),o=m(function(p){return a(p,23,8)},"parseFloat32"),u=m(function(p){return a(p,52,11)},"parseFloat64"),h=m(function(p){var v=i(p,16,32);if(v==49152)return NaN;for(var w=Math.pow(1e4,i(p,16,16)),_=0,E=[],O=i(p,16),M=0;M<O;M++)_+=i(p,16,64+16*M)*w,w/=1e4;var k=Math.pow(10,i(p,16,48));return(v===0?1:-1)*Math.round(_*k)/k},"parseNumeric"),g=m(function(p,v){var w=i(v,1),_=i(v,63,1),E=new Date((w===0?1:-1)*_/1e3+9466848e5);return p||E.setTime(E.getTime()+E.getTimezoneOffset()*6e4),E.usec=_%1e3,E.getMicroSeconds=function(){return this.usec},E.setMicroSeconds=function(O){this.usec=O},E.getUTCMicroSeconds=function(){return this.usec},E},"parseDate"),x=m(function(p){for(var v=i(p,32),w=i(p,32,32),_=i(p,32,64),E=96,O=[],M=0;M<v;M++)O[M]=i(p,32,E),E+=32,E+=32;var k=m(function(L){var S=i(p,32,E);if(E+=32,S==4294967295)return null;var R;if(L==23||L==20)return R=i(p,S*8,E),E+=S*8,R;if(L==25)return R=p.toString(this.encoding,E>>3,(E+=S<<3)>>3),R;console.log("ERROR: ElementType not implemented: "+L)},"parseElement"),C=m(function(L,S){var R=[],A;if(L.length>1){var z=L.shift();for(A=0;A<z;A++)R[A]=C(L,S);L.unshift(z)}else for(A=0;A<L[0];A++)R[A]=k(S);return R},"parse");return C(O,_)},"parseArray"),b=m(function(p){return p.toString("utf8")},"parseText"),y=m(function(p){return p===null?null:i(p,8)>0},"parseBool"),l=m(function(p){p(20,s),p(21,n),p(23,d),p(26,d),p(1700,h),p(700,o),p(701,u),p(16,y),p(1114,g.bind(null,!1)),p(1184,g.bind(null,!0)),p(1e3,x),p(1007,x),p(1016,x),p(1008,x),p(1009,x),p(25,b)},"init");e.exports={init:l}}),ka=Z((t,e)=>{q(),e.exports={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}}),Kt=Z(t=>{q();var e=wa(),s=Ea(),i=Ai(),a=ka();t.getTypeParser=o,t.setTypeParser=u,t.arrayParser=i,t.builtins=a;var n={text:{},binary:{}};function d(h){return String(h)}m(d,"noParse");function o(h,g){return g=g||"text",n[g]&&n[g][h]||d}m(o,"getTypeParser");function u(h,g,x){typeof g=="function"&&(x=g,g="text"),n[g][h]=x}m(u,"setTypeParser"),e.init(function(h,g){n.text[h]=g}),s.init(function(h,g){n.binary[h]=g})}),_s=Z((t,e)=>{q();var s=Kt();function i(a){this._types=a||s,this.text={},this.binary={}}m(i,"TypeOverrides"),i.prototype.getOverrides=function(a){switch(a){case"text":return this.text;case"binary":return this.binary;default:return{}}},i.prototype.setTypeParser=function(a,n,d){typeof n=="function"&&(d=n,n="text"),this.getOverrides(n)[a]=d},i.prototype.getTypeParser=function(a,n){return n=n||"text",this.getOverrides(n)[a]||this._types.getTypeParser(a,n)},e.exports=i});function Et(t){let e=1779033703,s=3144134277,i=1013904242,a=2773480762,n=1359893119,d=2600822924,o=528734635,u=1541459225,h=0,g=0,x=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],b=m((_,E)=>_>>>E|_<<32-E,"rrot"),y=new Uint32Array(64),l=new Uint8Array(64),p=m(()=>{for(let R=0,A=0;R<16;R++,A+=4)y[R]=l[A]<<24|l[A+1]<<16|l[A+2]<<8|l[A+3];for(let R=16;R<64;R++){let A=b(y[R-15],7)^b(y[R-15],18)^y[R-15]>>>3,z=b(y[R-2],17)^b(y[R-2],19)^y[R-2]>>>10;y[R]=y[R-16]+A+y[R-7]+z|0}let _=e,E=s,O=i,M=a,k=n,C=d,L=o,S=u;for(let R=0;R<64;R++){let A=b(k,6)^b(k,11)^b(k,25),z=k&C^~k&L,j=S+A+z+x[R]+y[R]|0,D=b(_,2)^b(_,13)^b(_,22),U=_&E^_&O^E&O,H=D+U|0;S=L,L=C,C=k,k=M+j|0,M=O,O=E,E=_,_=j+H|0}e=e+_|0,s=s+E|0,i=i+O|0,a=a+M|0,n=n+k|0,d=d+C|0,o=o+L|0,u=u+S|0,g=0},"process"),v=m(_=>{typeof _=="string"&&(_=new TextEncoder().encode(_));for(let E=0;E<_.length;E++)l[g++]=_[E],g===64&&p();h+=_.length},"add"),w=m(()=>{if(l[g++]=128,g==64&&p(),g+8>64){for(;g<64;)l[g++]=0;p()}for(;g<58;)l[g++]=0;let _=h*8;l[g++]=_/1099511627776&255,l[g++]=_/4294967296&255,l[g++]=_>>>24,l[g++]=_>>>16&255,l[g++]=_>>>8&255,l[g++]=_&255,p();let E=new Uint8Array(32);return E[0]=e>>>24,E[1]=e>>>16&255,E[2]=e>>>8&255,E[3]=e&255,E[4]=s>>>24,E[5]=s>>>16&255,E[6]=s>>>8&255,E[7]=s&255,E[8]=i>>>24,E[9]=i>>>16&255,E[10]=i>>>8&255,E[11]=i&255,E[12]=a>>>24,E[13]=a>>>16&255,E[14]=a>>>8&255,E[15]=a&255,E[16]=n>>>24,E[17]=n>>>16&255,E[18]=n>>>8&255,E[19]=n&255,E[20]=d>>>24,E[21]=d>>>16&255,E[22]=d>>>8&255,E[23]=d&255,E[24]=o>>>24,E[25]=o>>>16&255,E[26]=o>>>8&255,E[27]=o&255,E[28]=u>>>24,E[29]=u>>>16&255,E[30]=u>>>8&255,E[31]=u&255,E},"digest");return t===void 0?{add:v,digest:w}:(v(t),w())}var Sa=me(()=>{q(),m(Et,"sha256")}),Ie,gs,Ta=me(()=>{q(),Ie=class ye{constructor(){Q(this,"_dataLength",0),Q(this,"_bufferLength",0),Q(this,"_state",new Int32Array(4)),Q(this,"_buffer",new ArrayBuffer(68)),Q(this,"_buffer8"),Q(this,"_buffer32"),this._buffer8=new Uint8Array(this._buffer,0,68),this._buffer32=new Uint32Array(this._buffer,0,17),this.start()}static hashByteArray(e,s=!1){return this.onePassHasher.start().appendByteArray(e).end(s)}static hashStr(e,s=!1){return this.onePassHasher.start().appendStr(e).end(s)}static hashAsciiStr(e,s=!1){return this.onePassHasher.start().appendAsciiStr(e).end(s)}static _hex(e){let s=ye.hexChars,i=ye.hexOut,a,n,d,o;for(o=0;o<4;o+=1)for(n=o*8,a=e[o],d=0;d<8;d+=2)i[n+1+d]=s.charAt(a&15),a>>>=4,i[n+0+d]=s.charAt(a&15),a>>>=4;return i.join("")}static _md5cycle(e,s){let i=e[0],a=e[1],n=e[2],d=e[3];i+=(a&n|~a&d)+s[0]-680876936|0,i=(i<<7|i>>>25)+a|0,d+=(i&a|~i&n)+s[1]-389564586|0,d=(d<<12|d>>>20)+i|0,n+=(d&i|~d&a)+s[2]+606105819|0,n=(n<<17|n>>>15)+d|0,a+=(n&d|~n&i)+s[3]-1044525330|0,a=(a<<22|a>>>10)+n|0,i+=(a&n|~a&d)+s[4]-176418897|0,i=(i<<7|i>>>25)+a|0,d+=(i&a|~i&n)+s[5]+1200080426|0,d=(d<<12|d>>>20)+i|0,n+=(d&i|~d&a)+s[6]-1473231341|0,n=(n<<17|n>>>15)+d|0,a+=(n&d|~n&i)+s[7]-45705983|0,a=(a<<22|a>>>10)+n|0,i+=(a&n|~a&d)+s[8]+1770035416|0,i=(i<<7|i>>>25)+a|0,d+=(i&a|~i&n)+s[9]-1958414417|0,d=(d<<12|d>>>20)+i|0,n+=(d&i|~d&a)+s[10]-42063|0,n=(n<<17|n>>>15)+d|0,a+=(n&d|~n&i)+s[11]-1990404162|0,a=(a<<22|a>>>10)+n|0,i+=(a&n|~a&d)+s[12]+1804603682|0,i=(i<<7|i>>>25)+a|0,d+=(i&a|~i&n)+s[13]-40341101|0,d=(d<<12|d>>>20)+i|0,n+=(d&i|~d&a)+s[14]-1502002290|0,n=(n<<17|n>>>15)+d|0,a+=(n&d|~n&i)+s[15]+1236535329|0,a=(a<<22|a>>>10)+n|0,i+=(a&d|n&~d)+s[1]-165796510|0,i=(i<<5|i>>>27)+a|0,d+=(i&n|a&~n)+s[6]-1069501632|0,d=(d<<9|d>>>23)+i|0,n+=(d&a|i&~a)+s[11]+643717713|0,n=(n<<14|n>>>18)+d|0,a+=(n&i|d&~i)+s[0]-373897302|0,a=(a<<20|a>>>12)+n|0,i+=(a&d|n&~d)+s[5]-701558691|0,i=(i<<5|i>>>27)+a|0,d+=(i&n|a&~n)+s[10]+38016083|0,d=(d<<9|d>>>23)+i|0,n+=(d&a|i&~a)+s[15]-660478335|0,n=(n<<14|n>>>18)+d|0,a+=(n&i|d&~i)+s[4]-405537848|0,a=(a<<20|a>>>12)+n|0,i+=(a&d|n&~d)+s[9]+568446438|0,i=(i<<5|i>>>27)+a|0,d+=(i&n|a&~n)+s[14]-1019803690|0,d=(d<<9|d>>>23)+i|0,n+=(d&a|i&~a)+s[3]-187363961|0,n=(n<<14|n>>>18)+d|0,a+=(n&i|d&~i)+s[8]+1163531501|0,a=(a<<20|a>>>12)+n|0,i+=(a&d|n&~d)+s[13]-1444681467|0,i=(i<<5|i>>>27)+a|0,d+=(i&n|a&~n)+s[2]-51403784|0,d=(d<<9|d>>>23)+i|0,n+=(d&a|i&~a)+s[7]+1735328473|0,n=(n<<14|n>>>18)+d|0,a+=(n&i|d&~i)+s[12]-1926607734|0,a=(a<<20|a>>>12)+n|0,i+=(a^n^d)+s[5]-378558|0,i=(i<<4|i>>>28)+a|0,d+=(i^a^n)+s[8]-2022574463|0,d=(d<<11|d>>>21)+i|0,n+=(d^i^a)+s[11]+1839030562|0,n=(n<<16|n>>>16)+d|0,a+=(n^d^i)+s[14]-35309556|0,a=(a<<23|a>>>9)+n|0,i+=(a^n^d)+s[1]-1530992060|0,i=(i<<4|i>>>28)+a|0,d+=(i^a^n)+s[4]+1272893353|0,d=(d<<11|d>>>21)+i|0,n+=(d^i^a)+s[7]-155497632|0,n=(n<<16|n>>>16)+d|0,a+=(n^d^i)+s[10]-1094730640|0,a=(a<<23|a>>>9)+n|0,i+=(a^n^d)+s[13]+681279174|0,i=(i<<4|i>>>28)+a|0,d+=(i^a^n)+s[0]-358537222|0,d=(d<<11|d>>>21)+i|0,n+=(d^i^a)+s[3]-722521979|0,n=(n<<16|n>>>16)+d|0,a+=(n^d^i)+s[6]+76029189|0,a=(a<<23|a>>>9)+n|0,i+=(a^n^d)+s[9]-640364487|0,i=(i<<4|i>>>28)+a|0,d+=(i^a^n)+s[12]-421815835|0,d=(d<<11|d>>>21)+i|0,n+=(d^i^a)+s[15]+530742520|0,n=(n<<16|n>>>16)+d|0,a+=(n^d^i)+s[2]-995338651|0,a=(a<<23|a>>>9)+n|0,i+=(n^(a|~d))+s[0]-198630844|0,i=(i<<6|i>>>26)+a|0,d+=(a^(i|~n))+s[7]+1126891415|0,d=(d<<10|d>>>22)+i|0,n+=(i^(d|~a))+s[14]-1416354905|0,n=(n<<15|n>>>17)+d|0,a+=(d^(n|~i))+s[5]-57434055|0,a=(a<<21|a>>>11)+n|0,i+=(n^(a|~d))+s[12]+1700485571|0,i=(i<<6|i>>>26)+a|0,d+=(a^(i|~n))+s[3]-1894986606|0,d=(d<<10|d>>>22)+i|0,n+=(i^(d|~a))+s[10]-1051523|0,n=(n<<15|n>>>17)+d|0,a+=(d^(n|~i))+s[1]-2054922799|0,a=(a<<21|a>>>11)+n|0,i+=(n^(a|~d))+s[8]+1873313359|0,i=(i<<6|i>>>26)+a|0,d+=(a^(i|~n))+s[15]-30611744|0,d=(d<<10|d>>>22)+i|0,n+=(i^(d|~a))+s[6]-1560198380|0,n=(n<<15|n>>>17)+d|0,a+=(d^(n|~i))+s[13]+1309151649|0,a=(a<<21|a>>>11)+n|0,i+=(n^(a|~d))+s[4]-145523070|0,i=(i<<6|i>>>26)+a|0,d+=(a^(i|~n))+s[11]-1120210379|0,d=(d<<10|d>>>22)+i|0,n+=(i^(d|~a))+s[2]+718787259|0,n=(n<<15|n>>>17)+d|0,a+=(d^(n|~i))+s[9]-343485551|0,a=(a<<21|a>>>11)+n|0,e[0]=i+e[0]|0,e[1]=a+e[1]|0,e[2]=n+e[2]|0,e[3]=d+e[3]|0}start(){return this._dataLength=0,this._bufferLength=0,this._state.set(ye.stateIdentity),this}appendStr(e){let s=this._buffer8,i=this._buffer32,a=this._bufferLength,n,d;for(d=0;d<e.length;d+=1){if(n=e.charCodeAt(d),n<128)s[a++]=n;else if(n<2048)s[a++]=(n>>>6)+192,s[a++]=n&63|128;else if(n<55296||n>56319)s[a++]=(n>>>12)+224,s[a++]=n>>>6&63|128,s[a++]=n&63|128;else{if(n=(n-55296)*1024+(e.charCodeAt(++d)-56320)+65536,n>1114111)throw new Error("Unicode standard supports code points up to U+10FFFF");s[a++]=(n>>>18)+240,s[a++]=n>>>12&63|128,s[a++]=n>>>6&63|128,s[a++]=n&63|128}a>=64&&(this._dataLength+=64,ye._md5cycle(this._state,i),a-=64,i[0]=i[16])}return this._bufferLength=a,this}appendAsciiStr(e){let s=this._buffer8,i=this._buffer32,a=this._bufferLength,n,d=0;for(;;){for(n=Math.min(e.length-d,64-a);n--;)s[a++]=e.charCodeAt(d++);if(a<64)break;this._dataLength+=64,ye._md5cycle(this._state,i),a=0}return this._bufferLength=a,this}appendByteArray(e){let s=this._buffer8,i=this._buffer32,a=this._bufferLength,n,d=0;for(;;){for(n=Math.min(e.length-d,64-a);n--;)s[a++]=e[d++];if(a<64)break;this._dataLength+=64,ye._md5cycle(this._state,i),a=0}return this._bufferLength=a,this}getState(){let e=this._state;return{buffer:String.fromCharCode.apply(null,Array.from(this._buffer8)),buflen:this._bufferLength,length:this._dataLength,state:[e[0],e[1],e[2],e[3]]}}setState(e){let s=e.buffer,i=e.state,a=this._state,n;for(this._dataLength=e.length,this._bufferLength=e.buflen,a[0]=i[0],a[1]=i[1],a[2]=i[2],a[3]=i[3],n=0;n<s.length;n+=1)this._buffer8[n]=s.charCodeAt(n)}end(e=!1){let s=this._bufferLength,i=this._buffer8,a=this._buffer32,n=(s>>2)+1;this._dataLength+=s;let d=this._dataLength*8;if(i[s]=128,i[s+1]=i[s+2]=i[s+3]=0,a.set(ye.buffer32Identity.subarray(n),n),s>55&&(ye._md5cycle(this._state,a),a.set(ye.buffer32Identity)),d<=4294967295)a[14]=d;else{let o=d.toString(16).match(/(.*?)(.{0,8})$/);if(o===null)return;let u=parseInt(o[2],16),h=parseInt(o[1],16)||0;a[14]=u,a[15]=h}return ye._md5cycle(this._state,a),e?this._state:ye._hex(this._state)}},m(Ie,"Md5"),Q(Ie,"stateIdentity",new Int32Array([1732584193,-271733879,-1732584194,271733878])),Q(Ie,"buffer32Identity",new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])),Q(Ie,"hexChars","0123456789abcdef"),Q(Ie,"hexOut",[]),Q(Ie,"onePassHasher",new Ie),gs=Ie}),Es={};Se(Es,{createHash:()=>Mi,createHmac:()=>Ri,randomBytes:()=>Oi});function Oi(t){return crypto.getRandomValues(W.alloc(t))}function Mi(t){if(t==="sha256")return{update:m(function(e){return{digest:m(function(){return W.from(Et(e))},"digest")}},"update")};if(t==="md5")return{update:m(function(e){return{digest:m(function(){return typeof e=="string"?gs.hashStr(e):gs.hashByteArray(e)},"digest")}},"update")};throw new Error(`Hash type '${t}' not supported`)}function Ri(t,e){if(t!=="sha256")throw new Error(`Only sha256 is supported (requested: '${t}')`);return{update:m(function(s){return{digest:m(function(){typeof e=="string"&&(e=new TextEncoder().encode(e)),typeof s=="string"&&(s=new TextEncoder().encode(s));let i=e.length;if(i>64)e=Et(e);else if(i<64){let u=new Uint8Array(64);u.set(e),e=u}let a=new Uint8Array(64),n=new Uint8Array(64);for(let u=0;u<64;u++)a[u]=54^e[u],n[u]=92^e[u];let d=new Uint8Array(s.length+64);d.set(a,0),d.set(s,64);let o=new Uint8Array(96);return o.set(n,0),o.set(Et(d),64),W.from(Et(o))},"digest")}},"update")}}var Ni=me(()=>{q(),Sa(),Ta(),m(Oi,"randomBytes"),m(Mi,"createHash"),m(Ri,"createHmac")}),Jt=Z((t,e)=>{q(),e.exports={host:"localhost",user:J.platform==="win32"?J.env.USERNAME:J.env.USER,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};var s=Kt(),i=s.getTypeParser(20,"text"),a=s.getTypeParser(1016,"text");e.exports.__defineSetter__("parseInt8",function(n){s.setTypeParser(20,"text",n?s.getTypeParser(23,"text"):i),s.setTypeParser(1016,"text",n?s.getTypeParser(1007,"text"):a)})}),Zt=Z((t,e)=>{q();var s=(Ni(),ue(Es)),i=Jt();function a(l){var p=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');return'"'+p+'"'}m(a,"escapeElement");function n(l){for(var p="{",v=0;v<l.length;v++)v>0&&(p=p+","),l[v]===null||typeof l[v]>"u"?p=p+"NULL":Array.isArray(l[v])?p=p+n(l[v]):l[v]instanceof W?p+="\\\\x"+l[v].toString("hex"):p+=a(d(l[v]));return p=p+"}",p}m(n,"arrayString");var d=m(function(l,p){if(l==null)return null;if(l instanceof W)return l;if(ArrayBuffer.isView(l)){var v=W.from(l.buffer,l.byteOffset,l.byteLength);return v.length===l.byteLength?v:v.slice(l.byteOffset,l.byteOffset+l.byteLength)}return l instanceof Date?i.parseInputDatesAsUTC?g(l):h(l):Array.isArray(l)?n(l):typeof l=="object"?o(l,p):l.toString()},"prepareValue");function o(l,p){if(l&&typeof l.toPostgres=="function"){if(p=p||[],p.indexOf(l)!==-1)throw new Error('circular reference detected while preparing "'+l+'" for query');return p.push(l),d(l.toPostgres(d),p)}return JSON.stringify(l)}m(o,"prepareObject");function u(l,p){for(l=""+l;l.length<p;)l="0"+l;return l}m(u,"pad");function h(l){var p=-l.getTimezoneOffset(),v=l.getFullYear(),w=v<1;w&&(v=Math.abs(v)+1);var _=u(v,4)+"-"+u(l.getMonth()+1,2)+"-"+u(l.getDate(),2)+"T"+u(l.getHours(),2)+":"+u(l.getMinutes(),2)+":"+u(l.getSeconds(),2)+"."+u(l.getMilliseconds(),3);return p<0?(_+="-",p*=-1):_+="+",_+=u(Math.floor(p/60),2)+":"+u(p%60,2),w&&(_+=" BC"),_}m(h,"dateToString");function g(l){var p=l.getUTCFullYear(),v=p<1;v&&(p=Math.abs(p)+1);var w=u(p,4)+"-"+u(l.getUTCMonth()+1,2)+"-"+u(l.getUTCDate(),2)+"T"+u(l.getUTCHours(),2)+":"+u(l.getUTCMinutes(),2)+":"+u(l.getUTCSeconds(),2)+"."+u(l.getUTCMilliseconds(),3);return w+="+00:00",v&&(w+=" BC"),w}m(g,"dateToStringUTC");function x(l,p,v){return l=typeof l=="string"?{text:l}:l,p&&(typeof p=="function"?l.callback=p:l.values=p),v&&(l.callback=v),l}m(x,"normalizeQueryConfig");var b=m(function(l){return s.createHash("md5").update(l,"utf-8").digest("hex")},"md5"),y=m(function(l,p,v){var w=b(p+l),_=b(W.concat([W.from(w),v]));return"md5"+_},"postgresMd5PasswordHash");e.exports={prepareValue:m(function(l){return d(l)},"prepareValueWrapper"),normalizeQueryConfig:x,postgresMd5PasswordHash:y,md5:b}}),Mt={};Se(Mt,{default:()=>Di});var Di,es=me(()=>{q(),Di={}}),Ia=Z((t,e)=>{q();var s=(Ni(),ue(Es));function i(p){if(p.indexOf("SCRAM-SHA-256")===-1)throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");let v=s.randomBytes(18).toString("base64");return{mechanism:"SCRAM-SHA-256",clientNonce:v,response:"n,,n=*,r="+v,message:"SASLInitialResponse"}}m(i,"startSession");function a(p,v,w){if(p.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(typeof w!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");let _=h(w);if(_.nonce.startsWith(p.clientNonce)){if(_.nonce.length===p.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");var E=W.from(_.salt,"base64"),O=l(v,E,_.iteration),M=y(O,"Client Key"),k=b(M),C="n=*,r="+p.clientNonce,L="r="+_.nonce+",s="+_.salt+",i="+_.iteration,S="c=biws,r="+_.nonce,R=C+","+L+","+S,A=y(k,R),z=x(M,A),j=z.toString("base64"),D=y(O,"Server Key"),U=y(D,R);p.message="SASLResponse",p.serverSignature=U.toString("base64"),p.response=S+",p="+j}m(a,"continueSession");function n(p,v){if(p.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof v!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");let{serverSignature:w}=g(v);if(w!==p.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}m(n,"finalizeSession");function d(p){if(typeof p!="string")throw new TypeError("SASL: text must be a string");return p.split("").map((v,w)=>p.charCodeAt(w)).every(v=>v>=33&&v<=43||v>=45&&v<=126)}m(d,"isPrintableChars");function o(p){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(p)}m(o,"isBase64");function u(p){if(typeof p!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(p.split(",").map(v=>{if(!/^.=/.test(v))throw new Error("SASL: Invalid attribute pair entry");let w=v[0],_=v.substring(2);return[w,_]}))}m(u,"parseAttributePairs");function h(p){let v=u(p),w=v.get("r");if(w){if(!d(w))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");let _=v.get("s");if(_){if(!o(_))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");let E=v.get("i");if(E){if(!/^[1-9][0-9]*$/.test(E))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");let O=parseInt(E,10);return{nonce:w,salt:_,iteration:O}}m(h,"parseServerFirstMessage");function g(p){let v=u(p).get("v");if(v){if(!o(v))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:v}}m(g,"parseServerFinalMessage");function x(p,v){if(!W.isBuffer(p))throw new TypeError("first argument must be a Buffer");if(!W.isBuffer(v))throw new TypeError("second argument must be a Buffer");if(p.length!==v.length)throw new Error("Buffer lengths must match");if(p.length===0)throw new Error("Buffers cannot be empty");return W.from(p.map((w,_)=>p[_]^v[_]))}m(x,"xorBuffers");function b(p){return s.createHash("sha256").update(p).digest()}m(b,"sha256");function y(p,v){return s.createHmac("sha256",p).update(v).digest()}m(y,"hmacSha256");function l(p,v,w){for(var _=y(p,W.concat([v,W.from([0,0,0,1])])),E=_,O=0;O<w-1;O++)_=y(p,_),E=x(E,_);return E}m(l,"Hi"),e.exports={startSession:i,continueSession:a,finalizeSession:n}}),ks={};Se(ks,{join:()=>Bi});function Bi(...t){return t.join("/")}var Pi=me(()=>{q(),m(Bi,"join")}),Ss={};Se(Ss,{stat:()=>Fi});function Fi(t,e){e(new Error("No filesystem"))}var Ui=me(()=>{q(),m(Fi,"stat")}),Ts={};Se(Ts,{default:()=>zi});var zi,$i=me(()=>{q(),zi={}}),ji={};Se(ji,{StringDecoder:()=>qi});var fs,qi,Ca=me(()=>{q(),fs=class{constructor(e){Q(this,"td"),this.td=new TextDecoder(e)}write(e){return this.td.decode(e,{stream:!0})}end(e){return this.td.decode(e)}},m(fs,"StringDecoder"),qi=fs}),La=Z((t,e)=>{q();var{Transform:s}=($i(),ue(Ts)),{StringDecoder:i}=(Ca(),ue(ji)),a=Symbol("last"),n=Symbol("decoder");function d(x,b,y){let l;if(this.overflow){if(l=this[n].write(x).split(this.matcher),l.length===1)return y();l.shift(),this.overflow=!1}else this[a]+=this[n].write(x),l=this[a].split(this.matcher);this[a]=l.pop();for(let p=0;p<l.length;p++)try{u(this,this.mapper(l[p]))}catch(v){return y(v)}if(this.overflow=this[a].length>this.maxLength,this.overflow&&!this.skipOverflow){y(new Error("maximum buffer reached"));return}y()}m(d,"transform");function o(x){if(this[a]+=this[n].end(),this[a])try{u(this,this.mapper(this[a]))}catch(b){return x(b)}x()}m(o,"flush");function u(x,b){b!==void 0&&x.push(b)}m(u,"push");function h(x){return x}m(h,"noop");function g(x,b,y){switch(x=x||/\r?\n/,b=b||h,y=y||{},arguments.length){case 1:typeof x=="function"?(b=x,x=/\r?\n/):typeof x=="object"&&!(x instanceof RegExp)&&!x[Symbol.split]&&(y=x,x=/\r?\n/);break;case 2:typeof x=="function"?(y=b,b=x,x=/\r?\n/):typeof b=="object"&&(y=b,b=h)}y=Object.assign({},y),y.autoDestroy=!0,y.transform=d,y.flush=o,y.readableObjectMode=!0;let l=new s(y);return l[a]="",l[n]=new i("utf8"),l.matcher=x,l.mapper=b,l.maxLength=y.maxLength,l.skipOverflow=y.skipOverflow||!1,l.overflow=!1,l._destroy=function(p,v){this._writableState.errorEmitted=!1,v(p)},l}m(g,"split"),e.exports=g}),Aa=Z((t,e)=>{q();var s=(Pi(),ue(ks)),i=($i(),ue(Ts)).Stream,a=La(),n=(es(),ue(Mt)),d=5432,o=J.platform==="win32",u=J.stderr,h=56,g=7,x=61440,b=32768;function y(M){return(M&x)==b}m(y,"isRegFile");var l=["host","port","database","user","password"],p=l.length,v=l[p-1];function w(){var M=u instanceof i&&u.writable===!0;if(M){var k=Array.prototype.slice.call(arguments).concat(`
`);u.write(n.format.apply(n,k))}}m(w,"warn"),Object.defineProperty(e.exports,"isWin",{get:m(function(){return o},"get"),set:m(function(M){o=M},"set")}),e.exports.warnTo=function(M){var k=u;return u=M,k},e.exports.getFileName=function(M){var k=M||J.env,C=k.PGPASSFILE||(o?s.join(k.APPDATA||"./","postgresql","pgpass.conf"):s.join(k.HOME||"./",".pgpass"));return C},e.exports.usePgPass=function(M,k){return Object.prototype.hasOwnProperty.call(J.env,"PGPASSWORD")?!1:o?!0:(k=k||"<unkn>",y(M.mode)?M.mode&(h|g)?(w('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',k),!1):!0:(w('WARNING: password file "%s" is not a plain file',k),!1))};var _=e.exports.match=function(M,k){return l.slice(0,-1).reduce(function(C,L,S){return S==1&&Number(M[L]||d)===Number(k[L])?C&&!0:C&&(k[L]==="*"||k[L]===M[L])},!0)};e.exports.getPassword=function(M,k,C){var L,S=k.pipe(a());function R(j){var D=E(j);D&&O(D)&&_(M,D)&&(L=D[v],S.end())}m(R,"onLine");var A=m(function(){k.destroy(),C(L)},"onEnd"),z=m(function(j){k.destroy(),w("WARNING: error on reading file: %s",j),C(void 0)},"onErr");k.on("error",z),S.on("data",R).on("end",A).on("error",z)};var E=e.exports.parseLine=function(M){if(M.length<11||M.match(/^\s+#/))return null;for(var k="",C="",L=0,S=0,R=0,A={},z=!1,j=m(function(U,H,Y){var te=M.substring(H,Y);Object.hasOwnProperty.call(J.env,"PGPASS_NO_DEESCAPE")||(te=te.replace(/\\([:\\])/g,"$1")),A[l[U]]=te},"addToObj"),D=0;D<M.length-1;D+=1){if(k=M.charAt(D+1),C=M.charAt(D),z=L==p-1,z){j(L,S);break}D>=0&&k==":"&&C!=="\\"&&(j(L,S,D+1),S=D+2,L+=1)}return A=Object.keys(A).length===p?A:null,A},O=e.exports.isValidEntry=function(M){for(var k={0:function(A){return A.length>0},1:function(A){return A==="*"?!0:(A=Number(A),isFinite(A)&&A>0&&A<9007199254740992&&Math.floor(A)===A)},2:function(A){return A.length>0},3:function(A){return A.length>0},4:function(A){return A.length>0}},C=0;C<l.length;C+=1){var L=k[C],S=M[l[C]]||"",R=L(S);if(!R)return!1}return!0}}),Oa=Z((t,e)=>{q(),Pi(),ue(ks);var s=(Ui(),ue(Ss)),i=Aa();e.exports=function(a,n){var d=i.getFileName();s.stat(d,function(o,u){if(o||!i.usePgPass(u,d))return n(void 0);var h=s.createReadStream(d);i.getPassword(a,h,n)})},e.exports.warnTo=i.warnTo}),Vi={};Se(Vi,{default:()=>Hi});var Hi,Ma=me(()=>{q(),Hi={}}),Ra=Z((t,e)=>{q();var s=(Ii(),ue(Ti)),i=(Ui(),ue(Ss));function a(n){if(n.charAt(0)==="/"){var o=n.split(" ");return{host:o[0],database:o[1]}}var d=s.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(n)?encodeURI(n).replace(/\%25(\d\d)/g,"%$1"):n,!0),o=d.query;for(var u in o)Array.isArray(o[u])&&(o[u]=o[u][o[u].length-1]);var h=(d.auth||":").split(":");if(o.user=h[0],o.password=h.splice(1).join(":"),o.port=d.port,d.protocol=="socket:")return o.host=decodeURI(d.pathname),o.database=d.query.db,o.client_encoding=d.query.encoding,o;o.host||(o.host=d.hostname);var g=d.pathname;if(!o.host&&g&&/^%2f/i.test(g)){var x=g.split("/");o.host=decodeURIComponent(x[0]),g=x.splice(1).join("/")}switch(g&&g.charAt(0)==="/"&&(g=g.slice(1)||null),o.database=g&&decodeURI(g),(o.ssl==="true"||o.ssl==="1")&&(o.ssl=!0),o.ssl==="0"&&(o.ssl=!1),(o.sslcert||o.sslkey||o.sslrootcert||o.sslmode)&&(o.ssl={}),o.sslcert&&(o.ssl.cert=i.readFileSync(o.sslcert).toString()),o.sslkey&&(o.ssl.key=i.readFileSync(o.sslkey).toString()),o.sslrootcert&&(o.ssl.ca=i.readFileSync(o.sslrootcert).toString()),o.sslmode){case"disable":{o.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":break;case"no-verify":{o.ssl.rejectUnauthorized=!1;break}}return o}m(a,"parse"),e.exports=a,a.parse=a}),Is=Z((t,e)=>{q();var s=(Ma(),ue(Vi)),i=Jt(),a=Ra().parse,n=m(function(x,b,y){return y===void 0?y=J.env["PG"+x.toUpperCase()]:y===!1||(y=J.env[y]),b[x]||y||i[x]},"val"),d=m(function(){switch(J.env.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return i.ssl},"readSSLConfigFromEnvironment"),o=m(function(x){return"'"+(""+x).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},"quoteParamValue"),u=m(function(x,b,y){var l=b[y];l!=null&&x.push(y+"="+o(l))},"add"),h=class{constructor(b){b=typeof b=="string"?a(b):b||{},b.connectionString&&(b=Object.assign({},b,a(b.connectionString))),this.user=n("user",b),this.database=n("database",b),this.database===void 0&&(this.database=this.user),this.port=parseInt(n("port",b),10),this.host=n("host",b),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:n("password",b)}),this.binary=n("binary",b),this.options=n("options",b),this.ssl=typeof b.ssl>"u"?d():b.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=n("client_encoding",b),this.replication=n("replication",b),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=n("application_name",b,"PGAPPNAME"),this.fallback_application_name=n("fallback_application_name",b,!1),this.statement_timeout=n("statement_timeout",b,!1),this.lock_timeout=n("lock_timeout",b,!1),this.idle_in_transaction_session_timeout=n("idle_in_transaction_session_timeout",b,!1),this.query_timeout=n("query_timeout",b,!1),b.connectionTimeoutMillis===void 0?this.connect_timeout=J.env.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(b.connectionTimeoutMillis/1e3),b.keepAlive===!1?this.keepalives=0:b.keepAlive===!0&&(this.keepalives=1),typeof b.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(b.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(b){var y=[];u(y,this,"user"),u(y,this,"password"),u(y,this,"port"),u(y,this,"application_name"),u(y,this,"fallback_application_name"),u(y,this,"connect_timeout"),u(y,this,"options");var l=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(u(y,l,"sslmode"),u(y,l,"sslca"),u(y,l,"sslkey"),u(y,l,"sslcert"),u(y,l,"sslrootcert"),this.database&&y.push("dbname="+o(this.database)),this.replication&&y.push("replication="+o(this.replication)),this.host&&y.push("host="+o(this.host)),this.isDomainSocket)return b(null,y.join(" "));this.client_encoding&&y.push("client_encoding="+o(this.client_encoding)),s.lookup(this.host,function(p,v){return p?b(p,null):(y.push("hostaddr="+o(v)),b(null,y.join(" ")))})}};m(h,"ConnectionParameters");var g=h;e.exports=g}),Na=Z((t,e)=>{q();var s=Kt(),i=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/,a=class{constructor(o,u){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=u,this.RowCtor=null,this.rowAsArray=o==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray)}addCommandComplete(o){var u;o.text?u=i.exec(o.text):u=i.exec(o.command),u&&(this.command=u[1],u[3]?(this.oid=parseInt(u[2],10),this.rowCount=parseInt(u[3],10)):u[2]&&(this.rowCount=parseInt(u[2],10)))}_parseRowAsArray(o){for(var u=new Array(o.length),h=0,g=o.length;h<g;h++){var x=o[h];x!==null?u[h]=this._parsers[h](x):u[h]=null}return u}parseRow(o){for(var u={},h=0,g=o.length;h<g;h++){var x=o[h],b=this.fields[h].name;x!==null?u[b]=this._parsers[h](x):u[b]=null}return u}addRow(o){this.rows.push(o)}addFields(o){this.fields=o,this.fields.length&&(this._parsers=new Array(o.length));for(var u=0;u<o.length;u++){var h=o[u];this._types?this._parsers[u]=this._types.getTypeParser(h.dataTypeID,h.format||"text"):this._parsers[u]=s.getTypeParser(h.dataTypeID,h.format||"text")}}};m(a,"Result");var n=a;e.exports=n}),Da=Z((t,e)=>{q();var{EventEmitter:s}=Xe(),i=Na(),a=Zt(),n=class extends s{constructor(u,h,g){super(),u=a.normalizeQueryConfig(u,h,g),this.text=u.text,this.values=u.values,this.rows=u.rows,this.types=u.types,this.name=u.name,this.binary=u.binary,this.portal=u.portal||"",this.callback=u.callback,this._rowMode=u.rowMode,J.domain&&u.callback&&(this.callback=J.domain.bind(u.callback)),this._result=new i(this._rowMode,this.types),this._results=this._result,this.isPreparedStatement=!1,this._canceledDueToError=!1,this._promise=null}requiresPreparation(){return this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new i(this._rowMode,this.types),this._results.push(this._result))}handleRowDescription(u){this._checkForMultirow(),this._result.addFields(u.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(u){let h;if(!this._canceledDueToError){try{h=this._result.parseRow(u.fields)}catch(g){this._canceledDueToError=g;return}this.emit("row",h,this._result),this._accumulateRows&&this._result.addRow(h)}}handleCommandComplete(u,h){this._checkForMultirow(),this._result.addCommandComplete(u),this.rows&&h.sync()}handleEmptyQuery(u){this.rows&&u.sync()}handleError(u,h){if(this._canceledDueToError&&(u=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(u);this.emit("error",u)}handleReadyForQuery(u){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,u);if(this.callback)try{this.callback(null,this._results)}catch(h){J.nextTick(()=>{throw h})}this.emit("end",this._results)}submit(u){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");let h=u.parsedStatements[this.name];return this.text&&h&&this.text!==h?new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`):this.values&&!Array.isArray(this.values)?new Error("Query values must be an array"):(this.requiresPreparation()?this.prepare(u):u.query(this.text),null)}hasBeenParsed(u){return this.name&&u.parsedStatements[this.name]}handlePortalSuspended(u){this._getRows(u,this.rows)}_getRows(u,h){u.execute({portal:this.portal,rows:h}),h?u.flush():u.sync()}prepare(u){this.isPreparedStatement=!0,this.hasBeenParsed(u)||u.parse({text:this.text,name:this.name,types:this.types});try{u.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:a.prepareValue})}catch(h){this.handleError(h,u);return}u.describe({type:"P",name:this.portal||""}),this._getRows(u,this.rows)}handleCopyInResponse(u){u.sendCopyFail("No source stream defined")}handleCopyData(u,h){}};m(n,"Query");var d=n;e.exports=d}),Wi=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.NoticeMessage=t.DataRowMessage=t.CommandCompleteMessage=t.ReadyForQueryMessage=t.NotificationResponseMessage=t.BackendKeyDataMessage=t.AuthenticationMD5Password=t.ParameterStatusMessage=t.ParameterDescriptionMessage=t.RowDescriptionMessage=t.Field=t.CopyResponse=t.CopyDataMessage=t.DatabaseError=t.copyDone=t.emptyQuery=t.replicationStart=t.portalSuspended=t.noData=t.closeComplete=t.bindComplete=t.parseComplete=void 0,t.parseComplete={name:"parseComplete",length:5},t.bindComplete={name:"bindComplete",length:5},t.closeComplete={name:"closeComplete",length:5},t.noData={name:"noData",length:5},t.portalSuspended={name:"portalSuspended",length:5},t.replicationStart={name:"replicationStart",length:4},t.emptyQuery={name:"emptyQuery",length:4},t.copyDone={name:"copyDone",length:4};var e=class extends Error{constructor(D,U,H){super(D),this.length=U,this.name=H}};m(e,"DatabaseError");var s=e;t.DatabaseError=s;var i=class{constructor(D,U){this.length=D,this.chunk=U,this.name="copyData"}};m(i,"CopyDataMessage");var a=i;t.CopyDataMessage=a;var n=class{constructor(D,U,H,Y){this.length=D,this.name=U,this.binary=H,this.columnTypes=new Array(Y)}};m(n,"CopyResponse");var d=n;t.CopyResponse=d;var o=class{constructor(D,U,H,Y,te,K,be){this.name=D,this.tableID=U,this.columnID=H,this.dataTypeID=Y,this.dataTypeSize=te,this.dataTypeModifier=K,this.format=be}};m(o,"Field");var u=o;t.Field=u;var h=class{constructor(D,U){this.length=D,this.fieldCount=U,this.name="rowDescription",this.fields=new Array(this.fieldCount)}};m(h,"RowDescriptionMessage");var g=h;t.RowDescriptionMessage=g;var x=class{constructor(D,U){this.length=D,this.parameterCount=U,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}};m(x,"ParameterDescriptionMessage");var b=x;t.ParameterDescriptionMessage=b;var y=class{constructor(D,U,H){this.length=D,this.parameterName=U,this.parameterValue=H,this.name="parameterStatus"}};m(y,"ParameterStatusMessage");var l=y;t.ParameterStatusMessage=l;var p=class{constructor(D,U){this.length=D,this.salt=U,this.name="authenticationMD5Password"}};m(p,"AuthenticationMD5Password");var v=p;t.AuthenticationMD5Password=v;var w=class{constructor(D,U,H){this.length=D,this.processID=U,this.secretKey=H,this.name="backendKeyData"}};m(w,"BackendKeyDataMessage");var _=w;t.BackendKeyDataMessage=_;var E=class{constructor(D,U,H,Y){this.length=D,this.processId=U,this.channel=H,this.payload=Y,this.name="notification"}};m(E,"NotificationResponseMessage");var O=E;t.NotificationResponseMessage=O;var M=class{constructor(D,U){this.length=D,this.status=U,this.name="readyForQuery"}};m(M,"ReadyForQueryMessage");var k=M;t.ReadyForQueryMessage=k;var C=class{constructor(D,U){this.length=D,this.text=U,this.name="commandComplete"}};m(C,"CommandCompleteMessage");var L=C;t.CommandCompleteMessage=L;var S=class{constructor(D,U){this.length=D,this.fields=U,this.name="dataRow",this.fieldCount=U.length}};m(S,"DataRowMessage");var R=S;t.DataRowMessage=R;var A=class{constructor(D,U){this.length=D,this.message=U,this.name="notice"}};m(A,"NoticeMessage");var z=A;t.NoticeMessage=z}),Ba=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.Writer=void 0;var e=class{constructor(a=256){this.size=a,this.offset=5,this.headerPosition=0,this.buffer=W.allocUnsafe(a)}ensure(a){if(this.buffer.length-this.offset<a){let n=this.buffer,d=n.length+(n.length>>1)+a;this.buffer=W.allocUnsafe(d),n.copy(this.buffer)}}addInt32(a){return this.ensure(4),this.buffer[this.offset++]=a>>>24&255,this.buffer[this.offset++]=a>>>16&255,this.buffer[this.offset++]=a>>>8&255,this.buffer[this.offset++]=a>>>0&255,this}addInt16(a){return this.ensure(2),this.buffer[this.offset++]=a>>>8&255,this.buffer[this.offset++]=a>>>0&255,this}addCString(a){if(!a)this.ensure(1);else{let n=W.byteLength(a);this.ensure(n+1),this.buffer.write(a,this.offset,"utf-8"),this.offset+=n}return this.buffer[this.offset++]=0,this}addString(a=""){let n=W.byteLength(a);return this.ensure(n),this.buffer.write(a,this.offset),this.offset+=n,this}add(a){return this.ensure(a.length),a.copy(this.buffer,this.offset),this.offset+=a.length,this}join(a){if(a){this.buffer[this.headerPosition]=a;let n=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(n,this.headerPosition+1)}return this.buffer.slice(a?0:5,this.offset)}flush(a){let n=this.join(a);return this.offset=5,this.headerPosition=0,this.buffer=W.allocUnsafe(this.size),n}};m(e,"Writer");var s=e;t.Writer=s}),Pa=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.serialize=void 0;var e=Ba(),s=new e.Writer,i=m(D=>{s.addInt16(3).addInt16(0);for(let Y of Object.keys(D))s.addCString(Y).addCString(D[Y]);s.addCString("client_encoding").addCString("UTF8");let U=s.addCString("").flush(),H=U.length+4;return new e.Writer().addInt32(H).add(U).flush()},"startup"),a=m(()=>{let D=W.allocUnsafe(8);return D.writeInt32BE(8,0),D.writeInt32BE(80877103,4),D},"requestSsl"),n=m(D=>s.addCString(D).flush(112),"password"),d=m(function(D,U){return s.addCString(D).addInt32(W.byteLength(U)).addString(U),s.flush(112)},"sendSASLInitialResponseMessage"),o=m(function(D){return s.addString(D).flush(112)},"sendSCRAMClientFinalMessage"),u=m(D=>s.addCString(D).flush(81),"query"),h=[],g=m(D=>{let U=D.name||"";U.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",U,U.length),console.error("This can cause conflicts and silent errors executing queries"));let H=D.types||h,Y=H.length,te=s.addCString(U).addCString(D.text).addInt16(Y);for(let K=0;K<Y;K++)te.addInt32(H[K]);return s.flush(80)},"parse"),x=new e.Writer,b=m(function(D,U){for(let H=0;H<D.length;H++){let Y=U?U(D[H],H):D[H];Y==null?(s.addInt16(0),x.addInt32(-1)):Y instanceof W?(s.addInt16(1),x.addInt32(Y.length),x.add(Y)):(s.addInt16(0),x.addInt32(W.byteLength(Y)),x.addString(Y))}},"writeValues"),y=m((D={})=>{let U=D.portal||"",H=D.statement||"",Y=D.binary||!1,te=D.values||h,K=te.length;return s.addCString(U).addCString(H),s.addInt16(K),b(te,D.valueMapper),s.addInt16(K),s.add(x.flush()),s.addInt16(Y?1:0),s.flush(66)},"bind"),l=W.from([69,0,0,0,9,0,0,0,0,0]),p=m(D=>{if(!D||!D.portal&&!D.rows)return l;let U=D.portal||"",H=D.rows||0,Y=W.byteLength(U),te=4+Y+1+4,K=W.allocUnsafe(1+te);return K[0]=69,K.writeInt32BE(te,1),K.write(U,5,"utf-8"),K[Y+5]=0,K.writeUInt32BE(H,K.length-4),K},"execute"),v=m((D,U)=>{let H=W.allocUnsafe(16);return H.writeInt32BE(16,0),H.writeInt16BE(1234,4),H.writeInt16BE(5678,6),H.writeInt32BE(D,8),H.writeInt32BE(U,12),H},"cancel"),w=m((D,U)=>{let H=4+W.byteLength(U)+1,Y=W.allocUnsafe(1+H);return Y[0]=D,Y.writeInt32BE(H,1),Y.write(U,5,"utf-8"),Y[H]=0,Y},"cstringMessage"),_=s.addCString("P").flush(68),E=s.addCString("S").flush(68),O=m(D=>D.name?w(68,`${D.type}${D.name||""}`):D.type==="P"?_:E,"describe"),M=m(D=>{let U=`${D.type}${D.name||""}`;return w(67,U)},"close"),k=m(D=>s.add(D).flush(100),"copyData"),C=m(D=>w(102,D),"copyFail"),L=m(D=>W.from([D,0,0,0,4]),"codeOnlyBuffer"),S=L(72),R=L(83),A=L(88),z=L(99),j={startup:i,password:n,requestSsl:a,sendSASLInitialResponseMessage:d,sendSCRAMClientFinalMessage:o,query:u,parse:g,bind:y,execute:p,describe:O,close:M,flush:m(()=>S,"flush"),sync:m(()=>R,"sync"),end:m(()=>A,"end"),copyData:k,copyDone:m(()=>z,"copyDone"),copyFail:C,cancel:v};t.serialize=j}),Fa=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.BufferReader=void 0;var e=W.allocUnsafe(0),s=class{constructor(n=0){this.offset=n,this.buffer=e,this.encoding="utf-8"}setBuffer(n,d){this.offset=n,this.buffer=d}int16(){let n=this.buffer.readInt16BE(this.offset);return this.offset+=2,n}byte(){let n=this.buffer[this.offset];return this.offset++,n}int32(){let n=this.buffer.readInt32BE(this.offset);return this.offset+=4,n}uint32(){let n=this.buffer.readUInt32BE(this.offset);return this.offset+=4,n}string(n){let d=this.buffer.toString(this.encoding,this.offset,this.offset+n);return this.offset+=n,d}cstring(){let n=this.offset,d=n;for(;this.buffer[d++]!==0;);return this.offset=d,this.buffer.toString(this.encoding,n,d-1)}bytes(n){let d=this.buffer.slice(this.offset,this.offset+n);return this.offset+=n,d}};m(s,"BufferReader");var i=s;t.BufferReader=i}),Ua=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.Parser=void 0;var e=Wi(),s=Fa(),i=1,a=4,n=i+a,d=W.allocUnsafe(0),o=class{constructor(g){if(this.buffer=d,this.bufferLength=0,this.bufferOffset=0,this.reader=new s.BufferReader,(g==null?void 0:g.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(g==null?void 0:g.mode)||"text"}parse(g,x){this.mergeBuffer(g);let b=this.bufferOffset+this.bufferLength,y=this.bufferOffset;for(;y+n<=b;){let l=this.buffer[y],p=this.buffer.readUInt32BE(y+i),v=i+p;if(v+y<=b){let w=this.handlePacket(y+n,l,p,this.buffer);x(w),y+=v}else break}y===b?(this.buffer=d,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=b-y,this.bufferOffset=y)}mergeBuffer(g){if(this.bufferLength>0){let x=this.bufferLength+g.byteLength;if(x+this.bufferOffset>this.buffer.byteLength){let b;if(x<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)b=this.buffer;else{let y=this.buffer.byteLength*2;for(;x>=y;)y*=2;b=W.allocUnsafe(y)}this.buffer.copy(b,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=b,this.bufferOffset=0}g.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=x}else this.buffer=g,this.bufferOffset=0,this.bufferLength=g.byteLength}handlePacket(g,x,b,y){switch(x){case 50:return e.bindComplete;case 49:return e.parseComplete;case 51:return e.closeComplete;case 110:return e.noData;case 115:return e.portalSuspended;case 99:return e.copyDone;case 87:return e.replicationStart;case 73:return e.emptyQuery;case 68:return this.parseDataRowMessage(g,b,y);case 67:return this.parseCommandCompleteMessage(g,b,y);case 90:return this.parseReadyForQueryMessage(g,b,y);case 65:return this.parseNotificationMessage(g,b,y);case 82:return this.parseAuthenticationResponse(g,b,y);case 83:return this.parseParameterStatusMessage(g,b,y);case 75:return this.parseBackendKeyData(g,b,y);case 69:return this.parseErrorMessage(g,b,y,"error");case 78:return this.parseErrorMessage(g,b,y,"notice");case 84:return this.parseRowDescriptionMessage(g,b,y);case 116:return this.parseParameterDescriptionMessage(g,b,y);case 71:return this.parseCopyInMessage(g,b,y);case 72:return this.parseCopyOutMessage(g,b,y);case 100:return this.parseCopyData(g,b,y);default:return new e.DatabaseError("received invalid response: "+x.toString(16),b,"error")}}parseReadyForQueryMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.string(1);return new e.ReadyForQueryMessage(x,y)}parseCommandCompleteMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.cstring();return new e.CommandCompleteMessage(x,y)}parseCopyData(g,x,b){let y=b.slice(g,g+(x-4));return new e.CopyDataMessage(x,y)}parseCopyInMessage(g,x,b){return this.parseCopyMessage(g,x,b,"copyInResponse")}parseCopyOutMessage(g,x,b){return this.parseCopyMessage(g,x,b,"copyOutResponse")}parseCopyMessage(g,x,b,y){this.reader.setBuffer(g,b);let l=this.reader.byte()!==0,p=this.reader.int16(),v=new e.CopyResponse(x,y,l,p);for(let w=0;w<p;w++)v.columnTypes[w]=this.reader.int16();return v}parseNotificationMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),l=this.reader.cstring(),p=this.reader.cstring();return new e.NotificationResponseMessage(x,y,l,p)}parseRowDescriptionMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),l=new e.RowDescriptionMessage(x,y);for(let p=0;p<y;p++)l.fields[p]=this.parseField();return l}parseField(){let g=this.reader.cstring(),x=this.reader.uint32(),b=this.reader.int16(),y=this.reader.uint32(),l=this.reader.int16(),p=this.reader.int32(),v=this.reader.int16()===0?"text":"binary";return new e.Field(g,x,b,y,l,p,v)}parseParameterDescriptionMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),l=new e.ParameterDescriptionMessage(x,y);for(let p=0;p<y;p++)l.dataTypeIDs[p]=this.reader.int32();return l}parseDataRowMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int16(),l=new Array(y);for(let p=0;p<y;p++){let v=this.reader.int32();l[p]=v===-1?null:this.reader.string(v)}return new e.DataRowMessage(x,l)}parseParameterStatusMessage(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.cstring(),l=this.reader.cstring();return new e.ParameterStatusMessage(x,y,l)}parseBackendKeyData(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),l=this.reader.int32();return new e.BackendKeyDataMessage(x,y,l)}parseAuthenticationResponse(g,x,b){this.reader.setBuffer(g,b);let y=this.reader.int32(),l={name:"authenticationOk",length:x};switch(y){case 0:break;case 3:l.length===8&&(l.name="authenticationCleartextPassword");break;case 5:if(l.length===12){l.name="authenticationMD5Password";let p=this.reader.bytes(4);return new e.AuthenticationMD5Password(x,p)}break;case 10:{l.name="authenticationSASL",l.mechanisms=[];let p;do p=this.reader.cstring(),p&&l.mechanisms.push(p);while(p)}break;case 11:l.name="authenticationSASLContinue",l.data=this.reader.string(x-8);break;case 12:l.name="authenticationSASLFinal",l.data=this.reader.string(x-8);break;default:throw new Error("Unknown authenticationOk message type "+y)}return l}parseErrorMessage(g,x,b,y){this.reader.setBuffer(g,b);let l={},p=this.reader.string(1);for(;p!=="\0";)l[p]=this.reader.cstring(),p=this.reader.string(1);let v=l.M,w=y==="notice"?new e.NoticeMessage(x,v):new e.DatabaseError(v,x,y);return w.severity=l.S,w.code=l.C,w.detail=l.D,w.hint=l.H,w.position=l.P,w.internalPosition=l.p,w.internalQuery=l.q,w.where=l.W,w.schema=l.s,w.table=l.t,w.column=l.c,w.dataType=l.d,w.constraint=l.n,w.file=l.F,w.line=l.L,w.routine=l.R,w}};m(o,"Parser");var u=o;t.Parser=u}),Gi=Z(t=>{q(),Object.defineProperty(t,"__esModule",{value:!0}),t.DatabaseError=t.serialize=t.parse=void 0;var e=Wi();Object.defineProperty(t,"DatabaseError",{enumerable:!0,get:m(function(){return e.DatabaseError},"get")});var s=Pa();Object.defineProperty(t,"serialize",{enumerable:!0,get:m(function(){return s.serialize},"get")});var i=Ua();function a(n,d){let o=new i.Parser;return n.on("data",u=>o.parse(u,d)),new Promise(u=>n.on("end",()=>u()))}m(a,"parse"),t.parse=a}),Qi={};Se(Qi,{connect:()=>Yi});function Yi({socket:t,servername:e}){return t.startTls(e),t}var za=me(()=>{q(),m(Yi,"connect")}),Xi=Z((t,e)=>{q();var s=(Ot(),ue(ki)),i=Xe().EventEmitter,{parse:a,serialize:n}=Gi(),d=n.flush(),o=n.sync(),u=n.end(),h=class extends i{constructor(b){super(),b=b||{},this.stream=b.stream||new s.Socket,this._keepAlive=b.keepAlive,this._keepAliveInitialDelayMillis=b.keepAliveInitialDelayMillis,this.lastBuffer=!1,this.parsedStatements={},this.ssl=b.ssl||!1,this._ending=!1,this._emitMessage=!1;var y=this;this.on("newListener",function(l){l==="message"&&(y._emitMessage=!0)})}connect(b,y){var l=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(b,y),this.stream.once("connect",function(){l._keepAlive&&l.stream.setKeepAlive(!0,l._keepAliveInitialDelayMillis),l.emit("connect")});let p=m(function(v){l._ending&&(v.code==="ECONNRESET"||v.code==="EPIPE")||l.emit("error",v)},"reportStreamError");if(this.stream.on("error",p),this.stream.on("close",function(){l.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(v){var w=v.toString("utf8");switch(w){case"S":break;case"N":return l.stream.end(),l.emit("error",new Error("The server does not support SSL connections"));default:return l.stream.end(),l.emit("error",new Error("There was an error establishing an SSL connection"))}var _=(za(),ue(Qi));let E={socket:l.stream};l.ssl!==!0&&(Object.assign(E,l.ssl),"key"in l.ssl&&(E.key=l.ssl.key)),s.isIP(y)===0&&(E.servername=y);try{l.stream=_.connect(E)}catch(O){return l.emit("error",O)}l.attachListeners(l.stream),l.stream.on("error",p),l.emit("sslconnect")})}attachListeners(b){b.on("end",()=>{this.emit("end")}),a(b,y=>{var l=y.name==="error"?"errorMessage":y.name;this._emitMessage&&this.emit("message",y),this.emit(l,y)})}requestSsl(){this.stream.write(n.requestSsl())}startup(b){this.stream.write(n.startup(b))}cancel(b,y){this._send(n.cancel(b,y))}password(b){this._send(n.password(b))}sendSASLInitialResponseMessage(b,y){this._send(n.sendSASLInitialResponseMessage(b,y))}sendSCRAMClientFinalMessage(b){this._send(n.sendSCRAMClientFinalMessage(b))}_send(b){return this.stream.writable?this.stream.write(b):!1}query(b){this._send(n.query(b))}parse(b){this._send(n.parse(b))}bind(b){this._send(n.bind(b))}execute(b){this._send(n.execute(b))}flush(){this.stream.writable&&this.stream.write(d)}sync(){this._ending=!0,this._send(d),this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(u,()=>{this.stream.end()})}close(b){this._send(n.close(b))}describe(b){this._send(n.describe(b))}sendCopyFromChunk(b){this._send(n.copyData(b))}endCopyFrom(){this._send(n.copyDone())}sendCopyFail(b){this._send(n.copyFail(b))}};m(h,"Connection");var g=h;e.exports=g}),$a=Z((t,e)=>{q();var s=Xe().EventEmitter;es(),ue(Mt);var i=Zt(),a=Ia(),n=Oa(),d=_s(),o=Is(),u=Da(),h=Jt(),g=Xi(),x=class extends s{constructor(l){super(),this.connectionParameters=new o(l),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;var p=l||{};this._Promise=p.Promise||Xt.Promise,this._types=new d(p.types),this._ending=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this.connection=p.connection||new g({stream:p.stream,ssl:this.connectionParameters.ssl,keepAlive:p.keepAlive||!1,keepAliveInitialDelayMillis:p.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this.queryQueue=[],this.binary=p.binary||h.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=p.connectionTimeoutMillis||0}_errorAllQueries(l){let p=m(v=>{J.nextTick(()=>{v.handleError(l,this.connection)})},"enqueueError");this.activeQuery&&(p(this.activeQuery),this.activeQuery=null),this.queryQueue.forEach(p),this.queryQueue.length=0}_connect(l){var p=this,v=this.connection;if(this._connectionCallback=l,this._connecting||this._connected){let w=new Error("Client has already been connected. You cannot reuse a client.");J.nextTick(()=>{l(w)});return}this._connecting=!0,this.connectionTimeoutHandle,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{v._ending=!0,v.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis)),this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){p.ssl?v.requestSsl():v.startup(p.getStartupConf())}),v.on("sslconnect",function(){v.startup(p.getStartupConf())}),this._attachListeners(v),v.once("end",()=>{let w=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(w),this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(w):this._handleErrorEvent(w):this._connectionError||this._handleErrorEvent(w)),J.nextTick(()=>{this.emit("end")})})}connect(l){if(l){this._connect(l);return}return new this._Promise((p,v)=>{this._connect(w=>{w?v(w):p()})})}_attachListeners(l){l.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),l.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),l.on("authenticationSASL",this._handleAuthSASL.bind(this)),l.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),l.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),l.on("backendKeyData",this._handleBackendKeyData.bind(this)),l.on("error",this._handleErrorEvent.bind(this)),l.on("errorMessage",this._handleErrorMessage.bind(this)),l.on("readyForQuery",this._handleReadyForQuery.bind(this)),l.on("notice",this._handleNotice.bind(this)),l.on("rowDescription",this._handleRowDescription.bind(this)),l.on("dataRow",this._handleDataRow.bind(this)),l.on("portalSuspended",this._handlePortalSuspended.bind(this)),l.on("emptyQuery",this._handleEmptyQuery.bind(this)),l.on("commandComplete",this._handleCommandComplete.bind(this)),l.on("parseComplete",this._handleParseComplete.bind(this)),l.on("copyInResponse",this._handleCopyInResponse.bind(this)),l.on("copyData",this._handleCopyData.bind(this)),l.on("notification",this._handleNotification.bind(this))}_checkPgPass(l){let p=this.connection;typeof this.password=="function"?this._Promise.resolve().then(()=>this.password()).then(v=>{if(v!==void 0){if(typeof v!="string"){p.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=v}else this.connectionParameters.password=this.password=null;l()}).catch(v=>{p.emit("error",v)}):this.password!==null?l():n(this.connectionParameters,v=>{v!==void 0&&(this.connectionParameters.password=this.password=v),l()})}_handleAuthCleartextPassword(l){this._checkPgPass(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(l){this._checkPgPass(()=>{let p=i.postgresMd5PasswordHash(this.user,this.password,l.salt);this.connection.password(p)})}_handleAuthSASL(l){this._checkPgPass(()=>{this.saslSession=a.startSession(l.mechanisms),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)})}_handleAuthSASLContinue(l){a.continueSession(this.saslSession,this.password,l.data),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}_handleAuthSASLFinal(l){a.finalizeSession(this.saslSession,l.data),this.saslSession=null}_handleBackendKeyData(l){this.processID=l.processID,this.secretKey=l.secretKey}_handleReadyForQuery(l){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));let{activeQuery:p}=this;this.activeQuery=null,this.readyForQuery=!0,p&&p.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(l){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(l);this.emit("error",l)}}_handleErrorEvent(l){if(this._connecting)return this._handleErrorWhileConnecting(l);this._queryable=!1,this._errorAllQueries(l),this.emit("error",l)}_handleErrorMessage(l){if(this._connecting)return this._handleErrorWhileConnecting(l);let p=this.activeQuery;if(!p){this._handleErrorEvent(l);return}this.activeQuery=null,p.handleError(l,this.connection)}_handleRowDescription(l){this.activeQuery.handleRowDescription(l)}_handleDataRow(l){this.activeQuery.handleDataRow(l)}_handlePortalSuspended(l){this.activeQuery.handlePortalSuspended(this.connection)}_handleEmptyQuery(l){this.activeQuery.handleEmptyQuery(this.connection)}_handleCommandComplete(l){this.activeQuery.handleCommandComplete(l,this.connection)}_handleParseComplete(l){this.activeQuery.name&&(this.connection.parsedStatements[this.activeQuery.name]=this.activeQuery.text)}_handleCopyInResponse(l){this.activeQuery.handleCopyInResponse(this.connection)}_handleCopyData(l){this.activeQuery.handleCopyData(l,this.connection)}_handleNotification(l){this.emit("notification",l)}_handleNotice(l){this.emit("notice",l)}getStartupConf(){var l=this.connectionParameters,p={user:l.user,database:l.database},v=l.application_name||l.fallback_application_name;return v&&(p.application_name=v),l.replication&&(p.replication=""+l.replication),l.statement_timeout&&(p.statement_timeout=String(parseInt(l.statement_timeout,10))),l.lock_timeout&&(p.lock_timeout=String(parseInt(l.lock_timeout,10))),l.idle_in_transaction_session_timeout&&(p.idle_in_transaction_session_timeout=String(parseInt(l.idle_in_transaction_session_timeout,10))),l.options&&(p.options=l.options),p}cancel(l,p){if(l.activeQuery===p){var v=this.connection;this.host&&this.host.indexOf("/")===0?v.connect(this.host+"/.s.PGSQL."+this.port):v.connect(this.port,this.host),v.on("connect",function(){v.cancel(l.processID,l.secretKey)})}else l.queryQueue.indexOf(p)!==-1&&l.queryQueue.splice(l.queryQueue.indexOf(p),1)}setTypeParser(l,p,v){return this._types.setTypeParser(l,p,v)}getTypeParser(l,p){return this._types.getTypeParser(l,p)}escapeIdentifier(l){return'"'+l.replace(/"/g,'""')+'"'}escapeLiteral(l){for(var p=!1,v="'",w=0;w<l.length;w++){var _=l[w];_==="'"?v+=_+_:_==="\\"?(v+=_+_,p=!0):v+=_}return v+="'",p===!0&&(v=" E"+v),v}_pulseQueryQueue(){if(this.readyForQuery===!0)if(this.activeQuery=this.queryQueue.shift(),this.activeQuery){this.readyForQuery=!1,this.hasExecuted=!0;let l=this.activeQuery.submit(this.connection);l&&J.nextTick(()=>{this.activeQuery.handleError(l,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this.activeQuery=null,this.emit("drain"))}query(l,p,v){var w,_,E,O,M;if(l==null)throw new TypeError("Client was passed a null or undefined query");return typeof l.submit=="function"?(E=l.query_timeout||this.connectionParameters.query_timeout,_=w=l,typeof p=="function"&&(w.callback=w.callback||p)):(E=this.connectionParameters.query_timeout,w=new u(l,p,v),w.callback||(_=new this._Promise((k,C)=>{w.callback=(L,S)=>L?C(L):k(S)}))),E&&(M=w.callback,O=setTimeout(()=>{var k=new Error("Query read timeout");J.nextTick(()=>{w.handleError(k,this.connection)}),M(k),w.callback=()=>{};var C=this.queryQueue.indexOf(w);C>-1&&this.queryQueue.splice(C,1),this._pulseQueryQueue()},E),w.callback=(k,C)=>{clearTimeout(O),M(k,C)}),this.binary&&!w.binary&&(w.binary=!0),w._result&&!w._result._types&&(w._result._types=this._types),this._queryable?this._ending?(J.nextTick(()=>{w.handleError(new Error("Client was closed and is not queryable"),this.connection)}),_):(this.queryQueue.push(w),this._pulseQueryQueue(),_):(J.nextTick(()=>{w.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),_)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(l){if(this._ending=!0,!this.connection._connecting)if(l)l();else return this._Promise.resolve();if(this.activeQuery||!this._queryable?this.connection.stream.destroy():this.connection.end(),l)this.connection.once("end",l);else return new this._Promise(p=>{this.connection.once("end",p)})}};m(x,"Client");var b=x;b.Query=u,e.exports=b}),ja=Z((t,e)=>{q();var s=Xe().EventEmitter,i=m(function(){},"NOOP"),a=m((l,p)=>{let v=l.findIndex(p);return v===-1?void 0:l.splice(v,1)[0]},"removeWhere"),n=class{constructor(p,v,w){this.client=p,this.idleListener=v,this.timeoutId=w}};m(n,"IdleItem");var d=n,o=class{constructor(p){this.callback=p}};m(o,"PendingItem");var u=o;function h(){throw new Error("Release called on client which has already been released to the pool.")}m(h,"throwOnDoubleRelease");function g(l,p){if(p)return{callback:p,result:void 0};let v,w,_=m(function(O,M){O?v(O):w(M)},"cb"),E=new l(function(O,M){w=O,v=M}).catch(O=>{throw Error.captureStackTrace(O),O});return{callback:_,result:E}}m(g,"promisify");function x(l,p){return m(function v(w){w.client=p,p.removeListener("error",v),p.on("error",()=>{l.log("additional client error after disconnection due to error",w)}),l._remove(p),l.emit("error",w,p)},"idleListener")}m(x,"makeIdleListener");var b=class extends s{constructor(p,v){super(),this.options=Object.assign({},p),p!=null&&"password"in p&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:p.password}),p!=null&&p.ssl&&p.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||v||ts().Client,this.Promise=this.options.Promise||Xt.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(v=>{this._remove(v.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;let p=this._pendingQueue.shift();if(this._idle.length){let v=this._idle.pop();clearTimeout(v.timeoutId);let w=v.client;w.ref&&w.ref();let _=v.idleListener;return this._acquireClient(w,p,_,!1)}if(!this._isFull())return this.newClient(p);throw new Error("unexpected condition")}_remove(p){let v=a(this._idle,w=>w.client===p);v!==void 0&&clearTimeout(v.timeoutId),this._clients=this._clients.filter(w=>w!==p),p.end(),this.emit("remove",p)}connect(p){if(this.ending){let _=new Error("Cannot use a pool after calling end on the pool");return p?p(_):this.Promise.reject(_)}let v=g(this.Promise,p),w=v.result;if(this._isFull()||this._idle.length){if(this._idle.length&&J.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new u(v.callback)),w;let _=m((M,k,C)=>{clearTimeout(O),v.callback(M,k,C)},"queueCallback"),E=new u(_),O=setTimeout(()=>{a(this._pendingQueue,M=>M.callback===_),E.timedOut=!0,v.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return O.unref&&O.unref(),this._pendingQueue.push(E),w}return this.newClient(new u(v.callback)),w}newClient(p){let v=new this.Client(this.options);this._clients.push(v);let w=x(this,v);this.log("checking client timeout");let _,E=!1;this.options.connectionTimeoutMillis&&(_=setTimeout(()=>{this.log("ending client due to timeout"),E=!0,v.connection?v.connection.stream.destroy():v.end()},this.options.connectionTimeoutMillis)),this.log("connecting new client"),v.connect(O=>{if(_&&clearTimeout(_),v.on("error",w),O)this.log("client failed to connect",O),this._clients=this._clients.filter(M=>M!==v),E&&(O=new Error("Connection terminated due to connection timeout",{cause:O})),this._pulseQueue(),p.timedOut||p.callback(O,void 0,i);else{if(this.log("new client connected"),this.options.maxLifetimeSeconds!==0){let M=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(v),this._idle.findIndex(k=>k.client===v)!==-1&&this._acquireClient(v,new u((k,C,L)=>L()),w,!1)},this.options.maxLifetimeSeconds*1e3);M.unref(),v.once("end",()=>clearTimeout(M))}return this._acquireClient(v,p,w,!0)}})}_acquireClient(p,v,w,_){_&&this.emit("connect",p),this.emit("acquire",p),p.release=this._releaseOnce(p,w),p.removeListener("error",w),v.timedOut?_&&this.options.verify?this.options.verify(p,p.release):p.release():_&&this.options.verify?this.options.verify(p,E=>{if(E)return p.release(E),v.callback(E,void 0,i);v.callback(void 0,p,p.release)}):v.callback(void 0,p,p.release)}_releaseOnce(p,v){let w=!1;return _=>{w&&h(),w=!0,this._release(p,v,_)}}_release(p,v,w){if(p.on("error",v),p._poolUseCount=(p._poolUseCount||0)+1,this.emit("release",w,p),w||this.ending||!p._queryable||p._ending||p._poolUseCount>=this.options.maxUses){p._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(p),this._pulseQueue();return}if(this._expired.has(p)){this.log("remove expired client"),this._expired.delete(p),this._remove(p),this._pulseQueue();return}let _;this.options.idleTimeoutMillis&&this._isAboveMin()&&(_=setTimeout(()=>{this.log("remove idle client"),this._remove(p)},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&_.unref()),this.options.allowExitOnIdle&&p.unref(),this._idle.push(new d(p,v,_)),this._pulseQueue()}query(p,v,w){if(typeof p=="function"){let E=g(this.Promise,p);return xs(function(){return E.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),E.result}typeof v=="function"&&(w=v,v=void 0);let _=g(this.Promise,w);return w=_.callback,this.connect((E,O)=>{if(E)return w(E);let M=!1,k=m(C=>{M||(M=!0,O.release(C),w(C))},"onError");O.once("error",k),this.log("dispatching query");try{O.query(p,v,(C,L)=>{if(this.log("query dispatched"),O.removeListener("error",k),!M)return M=!0,O.release(C),C?w(C):w(void 0,L)})}catch(C){return O.release(C),w(C)}}),_.result}end(p){if(this.log("ending"),this.ending){let w=new Error("Called end on pool more than once");return p?p(w):this.Promise.reject(w)}this.ending=!0;let v=g(this.Promise,p);return this._endCallback=v.callback,this._pulseQueue(),v.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((p,v)=>p+(this._expired.has(v)?1:0),0)}get totalCount(){return this._clients.length}};m(b,"Pool");var y=b;e.exports=y}),Ki={};Se(Ki,{default:()=>Ji});var Ji,qa=me(()=>{q(),Ji={}}),Va=Z((t,e)=>{e.exports={name:"pg",version:"8.8.0",description:"PostgreSQL client - pure javascript & libpq with the same API",keywords:["database","libpq","pg","postgre","postgres","postgresql","rdbms"],homepage:"https://github.com/brianc/node-postgres",repository:{type:"git",url:"git://github.com/brianc/node-postgres.git",directory:"packages/pg"},author:"Brian Carlson <brian.m.carlson@gmail.com>",main:"./lib",dependencies:{"buffer-writer":"2.0.0","packet-reader":"1.0.0","pg-connection-string":"^2.5.0","pg-pool":"^3.5.2","pg-protocol":"^1.5.0","pg-types":"^2.1.0",pgpass:"1.x"},devDependencies:{async:"2.6.4",bluebird:"3.5.2",co:"4.6.0","pg-copy-streams":"0.3.0"},peerDependencies:{"pg-native":">=3.0.1"},peerDependenciesMeta:{"pg-native":{optional:!0}},scripts:{test:"make test-all"},files:["lib","SPONSORS.md"],license:"MIT",engines:{node:">= 8.0.0"},gitHead:"c99fb2c127ddf8d712500db2c7b9a5491a178655"}}),Ha=Z((t,e)=>{q();var s=Xe().EventEmitter,i=(es(),ue(Mt)),a=Zt(),n=e.exports=function(o,u,h){s.call(this),o=a.normalizeQueryConfig(o,u,h),this.text=o.text,this.values=o.values,this.name=o.name,this.callback=o.callback,this.state="new",this._arrayMode=o.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(g){g==="row"&&(this._emitRowEvents=!0)}).bind(this))};i.inherits(n,s);var d={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};n.prototype.handleError=function(o){var u=this.native.pq.resultErrorFields();if(u)for(var h in u){var g=d[h]||h;o[g]=u[h]}this.callback?this.callback(o):this.emit("error",o),this.state="error"},n.prototype.then=function(o,u){return this._getPromise().then(o,u)},n.prototype.catch=function(o){return this._getPromise().catch(o)},n.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(o,u){this._once("end",o),this._once("error",u)}).bind(this)),this._promise)},n.prototype.submit=function(o){this.state="running";var u=this;this.native=o.native,o.native.arrayMode=this._arrayMode;var h=m(function(b,y,l){if(o.native.arrayMode=!1,xs(function(){u.emit("_done")}),b)return u.handleError(b);u._emitRowEvents&&(l.length>1?y.forEach((p,v)=>{p.forEach(w=>{u.emit("row",w,l[v])})}):y.forEach(function(p){u.emit("row",p,l)})),u.state="end",u.emit("end",l),u.callback&&u.callback(null,l)},"after");if(J.domain&&(h=J.domain.bind(h)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));var g=(this.values||[]).map(a.prepareValue);if(o.namedQueries[this.name]){if(this.text&&o.namedQueries[this.name]!==this.text){let b=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return h(b)}return o.native.execute(this.name,g,h)}return o.native.prepare(this.name,this.text,g.length,function(b){return b?h(b):(o.namedQueries[u.name]=u.text,u.native.execute(u.name,g,h))})}else if(this.values){if(!Array.isArray(this.values)){let b=new Error("Query values must be an array");return h(b)}var x=this.values.map(a.prepareValue);o.native.query(this.text,x,h)}else o.native.query(this.text,h)}}),Wa=Z((t,e)=>{q();var s=(qa(),ue(Ki)),i=_s();Va();var a=Xe().EventEmitter,n=(es(),ue(Mt)),d=Is(),o=Ha(),u=e.exports=function(h){a.call(this),h=h||{},this._Promise=h.Promise||Xt.Promise,this._types=new i(h.types),this.native=new s({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;var g=this.connectionParameters=new d(h);this.user=g.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:g.password}),this.database=g.database,this.host=g.host,this.port=g.port,this.namedQueries={}};u.Query=o,n.inherits(u,a),u.prototype._errorAllQueries=function(h){let g=m(x=>{J.nextTick(()=>{x.native=this.native,x.handleError(h)})},"enqueueError");this._hasActiveQuery()&&(g(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(g),this._queryQueue.length=0},u.prototype._connect=function(h){var g=this;if(this._connecting){J.nextTick(()=>h(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(x,b){if(x)return h(x);g.native.connect(b,function(y){if(y)return g.native.end(),h(y);g._connected=!0,g.native.on("error",function(l){g._queryable=!1,g._errorAllQueries(l),g.emit("error",l)}),g.native.on("notification",function(l){g.emit("notification",{channel:l.relname,payload:l.extra})}),g.emit("connect"),g._pulseQueryQueue(!0),h()})})},u.prototype.connect=function(h){if(h){this._connect(h);return}return new this._Promise((g,x)=>{this._connect(b=>{b?x(b):g()})})},u.prototype.query=function(h,g,x){var b,y,l,p,v;if(h==null)throw new TypeError("Client was passed a null or undefined query");if(typeof h.submit=="function")l=h.query_timeout||this.connectionParameters.query_timeout,y=b=h,typeof g=="function"&&(h.callback=g);else if(l=this.connectionParameters.query_timeout,b=new o(h,g,x),!b.callback){let w,_;y=new this._Promise((E,O)=>{w=E,_=O}),b.callback=(E,O)=>E?_(E):w(O)}return l&&(v=b.callback,p=setTimeout(()=>{var w=new Error("Query read timeout");J.nextTick(()=>{b.handleError(w,this.connection)}),v(w),b.callback=()=>{};var _=this._queryQueue.indexOf(b);_>-1&&this._queryQueue.splice(_,1),this._pulseQueryQueue()},l),b.callback=(w,_)=>{clearTimeout(p),v(w,_)}),this._queryable?this._ending?(b.native=this.native,J.nextTick(()=>{b.handleError(new Error("Client was closed and is not queryable"))}),y):(this._queryQueue.push(b),this._pulseQueryQueue(),y):(b.native=this.native,J.nextTick(()=>{b.handleError(new Error("Client has encountered a connection error and is not queryable"))}),y)},u.prototype.end=function(h){var g=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,h));var x;return h||(x=new this._Promise(function(b,y){h=m(l=>l?y(l):b(),"cb")})),this.native.end(function(){g._errorAllQueries(new Error("Connection terminated")),J.nextTick(()=>{g.emit("end"),h&&h()})}),x},u.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},u.prototype._pulseQueryQueue=function(h){if(this._connected&&!this._hasActiveQuery()){var g=this._queryQueue.shift();if(!g){h||this.emit("drain");return}this._activeQuery=g,g.submit(this);var x=this;g.once("_done",function(){x._pulseQueryQueue()})}},u.prototype.cancel=function(h){this._activeQuery===h?this.native.cancel(function(){}):this._queryQueue.indexOf(h)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(h),1)},u.prototype.ref=function(){},u.prototype.unref=function(){},u.prototype.setTypeParser=function(h,g,x){return this._types.setTypeParser(h,g,x)},u.prototype.getTypeParser=function(h,g){return this._types.getTypeParser(h,g)}}),Vs=Z((t,e)=>{q(),e.exports=Wa()}),ts=Z((t,e)=>{q();var s=$a(),i=Jt(),a=Xi(),n=ja(),{DatabaseError:d}=Gi(),o=m(h=>{var g;return g=class extends n{constructor(x){super(x,h)}},m(g,"BoundPool"),g},"poolFactory"),u=m(function(h){this.defaults=i,this.Client=h,this.Query=this.Client.Query,this.Pool=o(this.Client),this._pools=[],this.Connection=a,this.types=Kt(),this.DatabaseError=d},"PG");typeof J.env.NODE_PG_FORCE_NATIVE<"u"?e.exports=new u(Vs()):(e.exports=new u(s),Object.defineProperty(e.exports,"native",{configurable:!0,enumerable:!1,get(){var h=null;try{h=new u(Vs())}catch(g){if(g.code!=="MODULE_NOT_FOUND")throw g}return Object.defineProperty(e.exports,"native",{value:h}),h}}))});q();q();Ot();Ii();q();var Ga=Object.defineProperty,Qa=Object.defineProperties,Ya=Object.getOwnPropertyDescriptors,Hs=Object.getOwnPropertySymbols,Xa=Object.prototype.hasOwnProperty,Ka=Object.prototype.propertyIsEnumerable,Ws=m((t,e,s)=>e in t?Ga(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,"__defNormalProp"),Ja=m((t,e)=>{for(var s in e||(e={}))Xa.call(e,s)&&Ws(t,s,e[s]);if(Hs)for(var s of Hs(e))Ka.call(e,s)&&Ws(t,s,e[s]);return t},"__spreadValues"),Za=m((t,e)=>Qa(t,Ya(e)),"__spreadProps"),en=1008e3,Gs=new Uint8Array(new Uint16Array([258]).buffer)[0]===2,tn=new TextDecoder,Cs=new TextEncoder,Ut=Cs.encode("0123456789abcdef"),zt=Cs.encode("0123456789ABCDEF"),sn=Cs.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Zi=sn.slice();Zi[62]=45;Zi[63]=95;var xt,$t;function er(t,{alphabet:e,scratchArr:s}={}){if(!xt)if(xt=new Uint16Array(256),$t=new Uint16Array(256),Gs)for(let y=0;y<256;y++)xt[y]=Ut[y&15]<<8|Ut[y>>>4],$t[y]=zt[y&15]<<8|zt[y>>>4];else for(let y=0;y<256;y++)xt[y]=Ut[y&15]|Ut[y>>>4]<<8,$t[y]=zt[y&15]|zt[y>>>4]<<8;t.byteOffset%4!==0&&(t=new Uint8Array(t));let i=t.length,a=i>>>1,n=i>>>2,d=s||new Uint16Array(i),o=new Uint32Array(t.buffer,t.byteOffset,n),u=new Uint32Array(d.buffer,d.byteOffset,a),h=e==="upper"?$t:xt,g=0,x=0,b;if(Gs)for(;g<n;)b=o[g++],u[x++]=h[b>>>8&255]<<16|h[b&255],u[x++]=h[b>>>24]<<16|h[b>>>16&255];else for(;g<n;)b=o[g++],u[x++]=h[b>>>24]<<16|h[b>>>16&255],u[x++]=h[b>>>8&255]<<16|h[b&255];for(g<<=2;g<i;)d[g]=h[t[g++]];return tn.decode(d.subarray(0,i))}m(er,"_toHex");function tr(t,e={}){let s="",i=t.length,a=en>>>1,n=Math.ceil(i/a),d=new Uint16Array(n>1?a:i);for(let o=0;o<n;o++){let u=o*a,h=u+a;s+=er(t.subarray(u,h),Za(Ja({},e),{scratchArr:d}))}return s}m(tr,"_toHexChunked");function sr(t,e={}){return e.alphabet!=="upper"&&typeof t.toHex=="function"?t.toHex():tr(t,e)}m(sr,"toHex");q();var ir=class rr{constructor(e,s){this.strings=e,this.values=s}toParameterizedQuery(e={query:"",params:[]}){var a;let{strings:s,values:i}=this;for(let n=0,d=s.length;n<d;n++)if(e.query+=s[n],n<i.length){let o=i[n];if(o instanceof or)e.query+=o.sql;else if(o instanceof Ht)if(o.queryData instanceof rr)o.queryData.toParameterizedQuery(e);else{if((a=o.queryData.params)!=null&&a.length)throw new Error("This query is not composable");e.query+=o.queryData.query}else{let{params:u}=e;u.push(o),e.query+="$"+u.length,(o instanceof W||ArrayBuffer.isView(o))&&(e.query+="::bytea")}}return e}};m(ir,"SqlTemplate");var ar=ir,nr=class{constructor(e){this.sql=e}};m(nr,"UnsafeRawSql");var or=nr;q();function Ls(){typeof window<"u"&&typeof document<"u"&&typeof console<"u"&&typeof console.warn=="function"&&console.warn(`          
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
        ************************************************************`)}m(Ls,"warnIfBrowser");Ot();var rn=Ye(_s()),an=Ye(Zt()),dr=class lr extends Error{constructor(e){super(e),Q(this,"name","NeonDbError"),Q(this,"severity"),Q(this,"code"),Q(this,"detail"),Q(this,"hint"),Q(this,"position"),Q(this,"internalPosition"),Q(this,"internalQuery"),Q(this,"where"),Q(this,"schema"),Q(this,"table"),Q(this,"column"),Q(this,"dataType"),Q(this,"constraint"),Q(this,"file"),Q(this,"line"),Q(this,"routine"),Q(this,"sourceError"),"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,lr)}};m(dr,"NeonDbError");var rt=dr,Qs="transaction() expects an array of queries, or a function returning an array of queries",nn=["severity","code","detail","hint","position","internalPosition","internalQuery","where","schema","table","column","dataType","constraint","file","line","routine"];function cr(t){return t instanceof W?"\\x"+sr(t):t}m(cr,"encodeBuffersAsBytea");function ms(t){let{query:e,params:s}=t instanceof ar?t.toParameterizedQuery():t;return{query:e,params:s.map(i=>cr((0,an.prepareValue)(i)))}}m(ms,"prepareQuery");function As(t,{arrayMode:e,fullResults:s,fetchOptions:i,isolationLevel:a,readOnly:n,deferrable:d,authToken:o,disableWarningInBrowsers:u}={}){if(!t)throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");let h;try{h=ws(t)}catch{throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: "+String(t))}let{protocol:g,username:x,hostname:b,port:y,pathname:l}=h;if(g!=="postgres:"&&g!=="postgresql:"||!x||!b||!l)throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");function p(w,..._){if(!(Array.isArray(w)&&Array.isArray(w.raw)&&Array.isArray(_)))throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');return new Ht(v,new ar(w,_))}m(p,"templateFn"),p.query=(w,_,E)=>new Ht(v,{query:w,params:_??[]},E),p.unsafe=w=>new or(w),p.transaction=async(w,_)=>{if(typeof w=="function"&&(w=w(p)),!Array.isArray(w))throw new Error(Qs);w.forEach(M=>{if(!(M instanceof Ht))throw new Error(Qs)});let E=w.map(M=>M.queryData),O=w.map(M=>M.opts??{});return v(E,O,_)};async function v(w,_,E){let{fetchEndpoint:O,fetchFunction:M}=kt,k=Array.isArray(w)?{queries:w.map(te=>ms(te))}:ms(w),C=i??{},L=e??!1,S=s??!1,R=a,A=n,z=d;E!==void 0&&(E.fetchOptions!==void 0&&(C={...C,...E.fetchOptions}),E.arrayMode!==void 0&&(L=E.arrayMode),E.fullResults!==void 0&&(S=E.fullResults),E.isolationLevel!==void 0&&(R=E.isolationLevel),E.readOnly!==void 0&&(A=E.readOnly),E.deferrable!==void 0&&(z=E.deferrable)),_!==void 0&&!Array.isArray(_)&&_.fetchOptions!==void 0&&(C={...C,..._.fetchOptions});let j=o;!Array.isArray(_)&&(_==null?void 0:_.authToken)!==void 0&&(j=_.authToken);let D=typeof O=="function"?O(b,y,{jwtAuth:j!==void 0}):O,U={"Neon-Connection-String":t,"Neon-Raw-Text-Output":"true","Neon-Array-Mode":"true"},H=await ur(j);H&&(U.Authorization=`Bearer ${H}`),Array.isArray(w)&&(R!==void 0&&(U["Neon-Batch-Isolation-Level"]=R),A!==void 0&&(U["Neon-Batch-Read-Only"]=String(A)),z!==void 0&&(U["Neon-Batch-Deferrable"]=String(z))),u||kt.disableWarningInBrowsers||Ls();let Y;try{Y=await(M??fetch)(D,{method:"POST",body:JSON.stringify(k),headers:U,...C})}catch(te){let K=new rt(`Error connecting to database: ${te}`);throw K.sourceError=te,K}if(Y.ok){let te=await Y.json();if(Array.isArray(w)){let K=te.results;if(!Array.isArray(K))throw new rt("Neon internal error: unexpected result format");return K.map((be,ie)=>{let de=_[ie]??{},ht=de.arrayMode??L,gt=de.fullResults??S;return bs(be,{arrayMode:ht,fullResults:gt,types:de.types})})}else{let K=_??{},be=K.arrayMode??L,ie=K.fullResults??S;return bs(te,{arrayMode:be,fullResults:ie,types:K.types})}}else{let{status:te}=Y;if(te===400){let K=await Y.json(),be=new rt(K.message);for(let ie of nn)be[ie]=K[ie]??void 0;throw be}else{let K=await Y.text();throw new rt(`Server error (HTTP status ${te}): ${K}`)}}}return m(v,"execute"),p}m(As,"neon");var pr=class{constructor(e,s,i){this.execute=e,this.queryData=s,this.opts=i}then(e,s){return this.execute(this.queryData,this.opts).then(e,s)}catch(e){return this.execute(this.queryData,this.opts).catch(e)}finally(e){return this.execute(this.queryData,this.opts).finally(e)}};m(pr,"NeonQueryPromise");var Ht=pr;function bs(t,{arrayMode:e,fullResults:s,types:i}){let a=new rn.default(i),n=t.fields.map(u=>u.name),d=t.fields.map(u=>a.getTypeParser(u.dataTypeID)),o=e===!0?t.rows.map(u=>u.map((h,g)=>h===null?null:d[g](h))):t.rows.map(u=>Object.fromEntries(u.map((h,g)=>[n[g],h===null?null:d[g](h)])));return s?(t.viaNeonFetch=!0,t.rowAsArray=e,t.rows=o,t._parsers=d,t._types=a,t):o}m(bs,"processQueryResult");async function ur(t){if(typeof t=="string")return t;if(typeof t=="function")try{return await Promise.resolve(t())}catch(e){let s=new rt("Error getting auth token.");throw e instanceof Error&&(s=new rt(`Error getting auth token: ${e.message}`)),s}}m(ur,"getAuthToken");q();var on=Ye(ts());q();var dn=Ye(ts()),fr=class extends dn.Client{constructor(e){super(e),this.config=e}get neonConfig(){return this.connection.stream}connect(e){var h,g;let{neonConfig:s}=this;s.forceDisablePgSSL&&(this.ssl=this.connection.ssl=!1),this.ssl&&s.useSecureWebSocket&&console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");let i=typeof this.config!="string"&&((h=this.config)==null?void 0:h.host)!==void 0||typeof this.config!="string"&&((g=this.config)==null?void 0:g.connectionString)!==void 0||J.env.PGHOST!==void 0,a=J.env.USER??J.env.USERNAME;if(!i&&this.host==="localhost"&&this.user===a&&this.database===a&&this.password===null)throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${a}, db: ${a}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);let n=super.connect(e),d=s.pipelineTLS&&this.ssl,o=s.pipelineConnect==="password";if(!d&&!s.pipelineConnect)return n;let u=this.connection;if(d&&u.on("connect",()=>u.stream.emit("data","S")),o){u.removeAllListeners("authenticationCleartextPassword"),u.removeAllListeners("readyForQuery"),u.once("readyForQuery",()=>u.on("readyForQuery",this._handleReadyForQuery.bind(this)));let x=this.ssl?"sslconnect":"connect";u.on(x,()=>{this.neonConfig.disableWarningInBrowsers||Ls(),this._handleAuthCleartextPassword(),this._handleReadyForQuery()})}return n}async _handleAuthSASLContinue(e){if(typeof crypto>"u"||crypto.subtle===void 0||crypto.subtle.importKey===void 0)throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");let s=crypto.subtle,i=this.saslSession,a=this.password,n=e.data;if(i.message!=="SASLInitialResponse"||typeof a!="string"||typeof n!="string")throw new Error("SASL: protocol error");let d=Object.fromEntries(n.split(",").map(te=>{if(!/^.=/.test(te))throw new Error("SASL: Invalid attribute pair entry");let K=te[0],be=te.substring(2);return[K,be]})),o=d.r,u=d.s,h=d.i;if(!o||!/^[!-+--~]+$/.test(o))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");if(!u||!/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(u))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");if(!h||!/^[1-9][0-9]*$/.test(h))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");if(!o.startsWith(i.clientNonce))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");if(o.length===i.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");let g=parseInt(h,10),x=W.from(u,"base64"),b=new TextEncoder,y=b.encode(a),l=await s.importKey("raw",y,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),p=new Uint8Array(await s.sign("HMAC",l,W.concat([x,W.from([0,0,0,1])]))),v=p;for(var w=0;w<g-1;w++)p=new Uint8Array(await s.sign("HMAC",l,p)),v=W.from(v.map((te,K)=>v[K]^p[K]));let _=v,E=await s.importKey("raw",_,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),O=new Uint8Array(await s.sign("HMAC",E,b.encode("Client Key"))),M=await s.digest("SHA-256",O),k="n=*,r="+i.clientNonce,C="r="+o+",s="+u+",i="+g,L="c=biws,r="+o,S=k+","+C+","+L,R=await s.importKey("raw",M,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var A=new Uint8Array(await s.sign("HMAC",R,b.encode(S))),z=W.from(O.map((te,K)=>O[K]^A[K])),j=z.toString("base64");let D=await s.importKey("raw",_,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),U=await s.sign("HMAC",D,b.encode("Server Key")),H=await s.importKey("raw",U,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);var Y=W.from(await s.sign("HMAC",H,b.encode(S)));i.message="SASLResponse",i.serverSignature=Y.toString("base64"),i.response=L+",p="+j,this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}};m(fr,"NeonClient");var ln=fr;Ot();var cn=Ye(Is());function hr(t,e){if(e)return{callback:e,result:void 0};let s,i,a=m(function(d,o){d?s(d):i(o)},"cb"),n=new t(function(d,o){i=d,s=o});return{callback:a,result:n}}m(hr,"promisify");var pn=class extends on.Pool{constructor(){super(...arguments),Q(this,"Client",ln),Q(this,"hasFetchUnsupportedListeners",!1),Q(this,"addListener",this.on)}on(e,s){return e!=="error"&&(this.hasFetchUnsupportedListeners=!0),super.on(e,s)}query(e,s,i){var n;if(!kt.poolQueryViaFetch||this.hasFetchUnsupportedListeners||typeof e=="function")return super.query(e,s,i);typeof s=="function"&&(i=s,s=void 0);let a=hr(this.Promise,i);i=a.callback;try{let d=new cn.default(this.options),o=encodeURIComponent,u=encodeURI,h=`postgresql://${o(d.user)}:${o(d.password)}@${o(d.host)}/${u(d.database)}`,g=typeof e=="string"?e:e.text,x=s??e.values??[];As(h,{fullResults:!0,arrayMode:e.rowMode==="array"}).query(g,x,{types:e.types??((n=this.options)==null?void 0:n.types)}).then(b=>i(void 0,b)).catch(b=>i(b))}catch(d){i(d)}return a.result}};m(pn,"NeonPool");Ot();var Rt=Ye(ts());Rt.DatabaseError;Rt.defaults;Rt.escapeIdentifier;Rt.escapeLiteral;Rt.types;/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/var un={};const $=new _i,fn=un.DATABASE_URL||"postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",P=As(fn);function ss(t){if(!t)return"";const e=t.split(/\s+/);for(let s=1;s<e.length;s++)if(e[s].endsWith("구")&&!e[s].endsWith("시구"))return e[s].replace(/구$/,"");for(let s=1;s<e.length;s++)if(e[s].endsWith("시")&&e[s]!==e[0])return e[s].replace(/(특별시|광역시|특별자치시|시)$/,"");return e[0]?e[0].replace(/(특별자치도|도)$/,""):""}function Os(t){if(!t)return"";const e=t.split(/\s+/);return e[0]?e[0].replace(/(특별시|광역시|특별자치시|특별자치도|도|시)$/,""):""}function hn(t){return{마사지:"MassageTherapist",헤드스파:"BeautySalon",피부관리:"BeautySalon",헤어:"HairSalon",메이크업:"BeautySalon",왁싱:"BeautySalon",반영구:"BeautySalon",병원:"MedicalBusiness",그외:"LocalBusiness"}[t]||"LocalBusiness"}function gn(t){const e=ss(t.address),s=Os(t.address),i=e||s;return`${t.name} ${i?i+" ":""}${t.category} 추천 | 마이뷰티맵`}function gr(t){const e=ss(t.address),s=Os(t.address),i=Array.isArray(t.tags)&&t.tags.length?t.tags.join("·")+" ":"",a=e||s,n=t.price?` 가격 ${t.price}.`:"",d=t.desc?" "+t.desc.slice(0,40):"";return`${t.name} | ${a?a+" ":""}${t.category} 잘하는 곳. ${i}예약·위치·가격 한눈에 확인!${n}${d}`.slice(0,160)}function mn(t,e){return`${e} ${t} 추천 TOP | 마이뷰티맵`}function bn(t,e,s){return`${e} ${t} 잘하는 곳 ${s}곳 추천! 가격·위치·예약·후기까지 마이뷰티맵에서 한눈에 확인하세요.`}function vn(t,e){const s=e;return[`${s} ${t}`,`${s} ${t} 추천`,`${s} ${t} 잘하는 곳`,`${s} ${t} 예약`,`${s} ${t} 가격`,`${s} ${t} 후기`,`${s} ${t} 맛집`,`${s} 뷰티샵`,`${s} 뷰티 추천`,`${t} 추천`].join(",")}function ve(){return new Date(Date.now()+540*60*1e3).toISOString().slice(0,10)}function mr(){return new Date(Date.now()+540*60*1e3-864e5).toISOString().slice(0,10)}function br(t){const e=(t??"").trim();if(!e)return"";if(/^[A-Za-z0-9_-]{11}$/.test(e))return e;const s=e.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);return s?s[1]:e}function yn(t){return t.plan!=="shoot"||!t.paid_until?!1:new Date(t.paid_until)>=new Date}function Ue(t){return{id:t.id,name:t.name,category:t.category,tags:t.tags??[],price:t.price??"",address:t.address??"",district:t.district??"",lat:parseFloat(t.lat)||37.5326,lng:parseFloat(t.lng)||127.0246,smartPlaceUrl:t.smart_place_url??"",youtubeId:t.youtube_id??"",featured:t.featured??!1,thumbnail:t.thumbnail??"",phone:t.phone??"",desc:t.description??"",active:t.active??!0,displayMode:t.display_mode??"both",plan:t.plan??"basic",paidUntil:t.paid_until??null,paymentStatus:t.payment_status??"unpaid",paymentMemo:t.payment_memo??"",views:parseInt(t.view_cnt)||0,feedSP:parseInt(t.feed_sp)||0,mapSP:parseInt(t.map_sp)||0,isPremium:yn(t),isRecommended:t.is_recommended??!1}}function xn(t,e,s,i){const n=(s-t)*Math.PI/180,d=(i-e)*Math.PI/180,o=Math.sin(n/2)**2+Math.cos(t*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(d/2)**2;return 6371*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}const vs=10;let Wt=!1,it=null;async function vr(){if(!Wt)return it||(it=(async()=>{try{if(await P`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version     INTEGER PRIMARY KEY,
          applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,(await P`SELECT version FROM schema_migrations WHERE version = ${vs}`).length>0){Wt=!0;return}await P`
        CREATE TABLE IF NOT EXISTS daily_stats (
          shop_id      INTEGER NOT NULL,
          stat_date    DATE    NOT NULL,
          view_cnt     INTEGER NOT NULL DEFAULT 0,
          feed_sp      INTEGER NOT NULL DEFAULT 0,
          map_sp       INTEGER NOT NULL DEFAULT 0,
          feed_view    INTEGER NOT NULL DEFAULT 0,
          catalog_view INTEGER NOT NULL DEFAULT 0,
          map_view     INTEGER NOT NULL DEFAULT 0,
          vts_feed     INTEGER NOT NULL DEFAULT 0,
          vts_catalog  INTEGER NOT NULL DEFAULT 0,
          vts_map      INTEGER NOT NULL DEFAULT 0,
          rec_view     INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (shop_id, stat_date)
        )
      `,await P`
        CREATE TABLE IF NOT EXISTS honey_items (
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
        )
      `,await P`
        CREATE TABLE IF NOT EXISTS shorts_items (
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
        )
      `,await P`
        CREATE TABLE IF NOT EXISTS shorts_daily_stats (
          shorts_id  INTEGER NOT NULL,
          stat_date  DATE    NOT NULL,
          view_cnt   INTEGER NOT NULL DEFAULT 0,
          sp_cnt     INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (shorts_id, stat_date)
        )
      `,await P`
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
      `,await P`
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
      `,await P`CREATE INDEX IF NOT EXISTS idx_se_session  ON session_events(session_id)`,await P`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`,await P`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS report_token   TEXT`,await P`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS feed_view      INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS catalog_view   INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS map_view       INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_feed       INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_catalog    INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_map        INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS rec_view       INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE honey_items       ADD COLUMN IF NOT EXISTS coupang_url2   TEXT    NOT NULL DEFAULT ''`,await P`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS smart_place_url TEXT   NOT NULL DEFAULT ''`,await P`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS view_cnt        INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS sp_cnt          INTEGER NOT NULL DEFAULT 0`,await P`ALTER TABLE session_events    ADD COLUMN IF NOT EXISTS viewed_sec      INTEGER NOT NULL DEFAULT 0`,await P`INSERT INTO schema_migrations (version) VALUES (${vs}) ON CONFLICT DO NOTHING`,Wt=!0}catch(t){console.error("[migration] error:",t),it=null}})(),it)}$.use("*",async(t,e)=>(await vr(),e()));$.get("/api/shops",async t=>{const e=t.req.query("category")??"",s=(t.req.query("q")??"").toLowerCase(),i=parseFloat(t.req.query("lat")??""),a=parseFloat(t.req.query("lng")??""),n=t.req.query("nearby")==="1",d=t.req.query("shuffle")==="1";let u=(await P`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `).map(Ue);if(e==="recommended"?u=u.filter(h=>h.isRecommended):e&&e!=="all"&&(u=u.filter(h=>h.category===e)),s&&(u=u.filter(h=>h.name.toLowerCase().includes(s)||(h.tags||[]).some(g=>g.toLowerCase().includes(s))||h.district.toLowerCase().includes(s))),n&&!isNaN(i)&&!isNaN(a))u=u.map(h=>({...h,dist:xn(i,a,h.lat,h.lng)})).filter(h=>h.dist<=20).sort((h,g)=>h.isPremium&&!g.isPremium?-1:!h.isPremium&&g.isPremium?1:h.dist-g.dist);else if(d){const h=u.filter(x=>x.isPremium),g=u.filter(x=>!x.isPremium);for(let x=h.length-1;x>0;x--){const b=Math.floor(Math.random()*(x+1));[h[x],h[b]]=[h[b],h[x]]}for(let x=g.length-1;x>0;x--){const b=Math.floor(Math.random()*(x+1));[g[x],g[b]]=[g[b],g[x]]}u=[...h,...g]}else u.sort((h,g)=>h.isPremium&&!g.isPremium?-1:!h.isPremium&&g.isPremium?1:0);return t.json(u)});$.get("/api/geocode",async t=>{var o,u,h,g,x;const e=t.req.query("query")??"";if(!e)return t.json({error:"query required"},400);const s=b=>b.replace(/(로|길|번길)\s+(\d)/g,"$1$2"),i=[],a=s(e);a!==e&&i.push(a),i.push(e);const n=a.trim().split(/\s+/);n.length>3&&i.push(n.slice(0,-1).join(" "));const d=async b=>(await fetch(`https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(b)}`,{headers:{"X-NCP-APIGW-API-KEY-ID":"xjjg4490h8","X-NCP-APIGW-API-KEY":"RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD"}})).json();try{let b=null;for(const _ of i){const E=await d(_);if((o=E.addresses)!=null&&o.length){b=E.addresses[0];break}}if(!b)return t.json({error:"주소를 찾을 수 없어요"},404);const y=b.addressElements||[],l=((u=y.find(_=>{var E;return(E=_.types)==null?void 0:E.includes("SIDO")}))==null?void 0:u.longName)||"",p=((h=y.find(_=>{var E;return(E=_.types)==null?void 0:E.includes("SIGUGUN")}))==null?void 0:h.longName)||"",v=((g=y.find(_=>{var E,O;return((E=_.types)==null?void 0:E.includes("DONGMYUN"))||((O=_.types)==null?void 0:O.includes("RI"))}))==null?void 0:g.longName)||"",w=[l,p,v].filter(Boolean).join(" ")||((x=b.roadAddress)==null?void 0:x.split(" ").slice(0,3).join(" "))||"";return t.json({lat:parseFloat(b.y),lng:parseFloat(b.x),address:b.roadAddress||b.jibunAddress,district:w})}catch{return t.json({error:"지오코딩 실패"},500)}});$.get("/api/shops/all",async t=>{const e=await P`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `;return t.json(e.map(Ue))});$.get("/api/shops/:id",async t=>{const e=+t.req.param("id"),s=await P`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${e}
  `;return s.length?t.json(Ue(s[0])):t.json({error:"not found"},404)});$.post("/api/admin/shops",async t=>{const e=await t.req.json(),s=Array.isArray(e.tags)?e.tags:(e.tags??"").split(",").map(n=>n.trim()).filter(Boolean),a=(await P`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${e.name??"새 업체"}, ${e.category??"피부관리"}, ${s},
       ${e.price??""}, ${e.address??""}, ${e.district??""},
       ${parseFloat(e.lat)||37.5326}, ${parseFloat(e.lng)||127.0246},
       ${e.smartPlaceUrl??""}, ${br(e.youtubeId??"")},
       ${e.featured??!1},
       ${e.thumbnail??""},
       ${e.phone??""}, ${e.desc??""}, true, ${e.displayMode??"both"})
    RETURNING *
  `)[0];return await P`INSERT INTO stats (shop_id) VALUES (${a.id}) ON CONFLICT DO NOTHING`,t.json(Ue(a))});$.put("/api/admin/shops/:id",async t=>{const e=+t.req.param("id"),s=await t.req.json(),i=Array.isArray(s.tags)?s.tags:(s.tags??"").split(",").map(n=>n.trim()).filter(Boolean),a=await P`
    UPDATE shops SET
      name            = ${s.name},
      category        = ${s.category},
      tags            = ${i},
      price           = ${s.price??""},
      address         = ${s.address??""},
      district        = ${s.district??""},
      lat             = ${parseFloat(s.lat)||37.5326},
      lng             = ${parseFloat(s.lng)||127.0246},
      smart_place_url = ${s.smartPlaceUrl??""},
      youtube_id      = ${br(s.youtubeId??"")},
      featured        = ${s.featured??!1},
      thumbnail       = ${s.thumbnail??""},
      phone           = ${s.phone??""},
      description     = ${s.desc??""},
      active          = ${s.active??!0},
      display_mode    = ${s.displayMode??"both"}
    WHERE id = ${e}
    RETURNING *
  `;return a.length?(await P`INSERT INTO stats (shop_id) VALUES (${e}) ON CONFLICT DO NOTHING`,t.json(Ue(a[0]))):t.json({error:"not found"},404)});$.put("/api/admin/shops/:id/recommended",async t=>{const e=+t.req.param("id"),{isRecommended:s}=await t.req.json(),i=await P`
    UPDATE shops SET is_recommended = ${!!s}
    WHERE id = ${e} RETURNING *
  `;return i.length?t.json({ok:!0,isRecommended:i[0].is_recommended}):t.json({error:"not found"},404)});$.post("/api/track/rec/:id",async t=>{const e=+t.req.param("id"),s=ve();try{await P`INSERT INTO daily_stats (shop_id, stat_date, rec_view)
                VALUES (${e}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET rec_view = daily_stats.rec_view + 1`}catch{}return t.json({ok:!0})});$.put("/api/admin/shops/:id/payment",async t=>{const e=+t.req.param("id"),s=await t.req.json(),i=await P`
    UPDATE shops SET
      plan           = ${s.plan??"basic"},
      paid_until     = ${s.paidUntil||null},
      payment_status = ${s.paymentStatus??"unpaid"},
      payment_memo   = ${s.paymentMemo??""}
    WHERE id = ${e}
    RETURNING *
  `;return i.length?t.json(Ue(i[0])):t.json({error:"not found"},404)});$.delete("/api/admin/shops/:id",async t=>{const e=+t.req.param("id");return await P`DELETE FROM shops WHERE id = ${e}`,t.json({ok:!0})});$.post("/api/track/view/:id",async t=>{const e=+t.req.param("id"),s=ve();let i="feed";try{const a=await t.req.json();["feed","catalog","map"].includes(a==null?void 0:a.source)&&(i=a.source)}catch{}return await P`INSERT INTO stats (shop_id, view_cnt) VALUES (${e}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1`,i==="feed"?await P`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, feed_view)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt   = daily_stats.view_cnt   + 1,
                    feed_view  = daily_stats.feed_view  + 1`:i==="catalog"?await P`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, catalog_view)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt      = daily_stats.view_cnt      + 1,
                    catalog_view  = daily_stats.catalog_view  + 1`:await P`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, map_view)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt  = daily_stats.view_cnt  + 1,
                    map_view  = daily_stats.map_view  + 1`,t.json({ok:!0})});$.post("/api/track/sp/:id",async t=>{const e=+t.req.param("id"),s=ve();let i=null;try{const a=await t.req.json();i=(a==null?void 0:a.viewSrc)||null}catch{}return await P`INSERT INTO stats (shop_id, feed_sp) VALUES (${e}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1`,i==="feed"?await P`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_feed)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp  = daily_stats.feed_sp  + 1,
                    vts_feed = daily_stats.vts_feed + 1`:i==="catalog"?await P`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_catalog)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp     = daily_stats.feed_sp     + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:i==="map"?await P`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_map)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1,
                    vts_map = daily_stats.vts_map + 1`:await P`INSERT INTO daily_stats (shop_id, stat_date, feed_sp)
                VALUES (${e}, ${s}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1`,t.json({ok:!0})});$.post("/api/track/mapsp/:id",async t=>{const e=+t.req.param("id"),s=ve();let i=null;try{const a=await t.req.json();i=(a==null?void 0:a.viewSrc)||null}catch{}return await P`INSERT INTO stats (shop_id, map_sp) VALUES (${e}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1`,i==="feed"?await P`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_feed)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp   = daily_stats.map_sp   + 1,
                    vts_feed = daily_stats.vts_feed + 1`:i==="catalog"?await P`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_catalog)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp      = daily_stats.map_sp      + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`:await P`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_map)
                VALUES (${e}, ${s}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp  = daily_stats.map_sp  + 1,
                    vts_map = daily_stats.vts_map + 1`,t.json({ok:!0})});$.post("/api/track/visit",async t=>{const e=ve();return await P`
    INSERT INTO daily_visits (visit_date, visit_cnt) VALUES (${e}, 1)
    ON CONFLICT (visit_date) DO UPDATE SET visit_cnt = daily_visits.visit_cnt + 1
  `,t.json({ok:!0})});$.get("/api/admin/daily-visits",async t=>{const e=await P`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    ORDER BY visit_date DESC
    LIMIT 30
  `;return t.json(e)});$.post("/api/admin/reset-stats",async t=>(await P`UPDATE stats SET view_cnt=0, feed_sp=0, map_sp=0`,await P`DELETE FROM daily_visits`,await P`DELETE FROM daily_stats`,t.json({ok:!0})));$.post("/api/admin/init-daily-stats",async t=>(Wt=!1,it=null,await P`DELETE FROM schema_migrations WHERE version = ${vs}`,await vr(),t.json({ok:!0})));$.get("/api/admin/stats",async t=>{const e=ve(),s=mr(),i=await P`
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
  `,a=await P`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${e}
  `,n=await P`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${s}
  `,d=await P`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '13 days')
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,o=await P`
    SELECT shop_id, COALESCE(SUM(rec_view),0) as total_rec
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY shop_id
    HAVING SUM(rec_view) > 0
    ORDER BY total_rec DESC
  `,u={};o.forEach(v=>{u[v.shop_id]=parseInt(v.total_rec)||0});const h=await P`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `,g=await P`SELECT COUNT(*) as cnt FROM shops WHERE active = true`,x=h[0]||{},b=a[0]||{},y=n[0]||{},l=await P`
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
    FROM daily_stats WHERE stat_date = ${e}
  `,p={};return l.forEach(v=>{p[v.shop_id]={todayViews:parseInt(v.view_cnt)||0,todayFeedSP:parseInt(v.feed_sp)||0,todayMapSP:parseInt(v.map_sp)||0,todayFeedView:parseInt(v.feed_view)||0,todayCatalogView:parseInt(v.catalog_view)||0,todayMapView:parseInt(v.map_view)||0,todayVtsFeed:parseInt(v.vts_feed)||0,todayVtsCatalog:parseInt(v.vts_catalog)||0,todayVtsMap:parseInt(v.vts_map)||0,todayRecView:parseInt(v.rec_view)||0}}),t.json({stats:i.map(v=>{var w,_,E,O,M,k,C,L,S,R;return{id:v.id,name:v.name,category:v.category,thumbnail:v.thumbnail,youtubeId:v.youtube_id,featured:v.featured,active:v.active,views:parseInt(v.view_cnt)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,lat:parseFloat(v.lat)||0,lng:parseFloat(v.lng)||0,smartPlaceUrl:v.smart_place_url??"",address:v.address??"",district:v.district??"",phone:v.phone??"",plan:v.plan??"basic",paymentStatus:v.payment_status??"unpaid",paidUntil:v.paid_until?String(v.paid_until).slice(0,10):null,paymentMemo:v.payment_memo??"",displayMode:v.display_mode??"both",priceRange:v.price??"",tags:v.tags??[],description:v.description??"",isRecommended:v.is_recommended??!1,todayViews:((w=p[v.id])==null?void 0:w.todayViews)||0,todayFeedSP:((_=p[v.id])==null?void 0:_.todayFeedSP)||0,todayMapSP:((E=p[v.id])==null?void 0:E.todayMapSP)||0,todayFeedView:((O=p[v.id])==null?void 0:O.todayFeedView)||0,todayCatalogView:((M=p[v.id])==null?void 0:M.todayCatalogView)||0,todayMapView:((k=p[v.id])==null?void 0:k.todayMapView)||0,todayVtsFeed:((C=p[v.id])==null?void 0:C.todayVtsFeed)||0,todayVtsCatalog:((L=p[v.id])==null?void 0:L.todayVtsCatalog)||0,todayVtsMap:((S=p[v.id])==null?void 0:S.todayVtsMap)||0,todayRecView:((R=p[v.id])==null?void 0:R.todayRecView)||0,weekRecView:u[v.id]||0}}),totalViews:parseInt(x.total_views)||0,totalFeedSP:parseInt(x.total_feed_sp)||0,totalMapSP:parseInt(x.total_map_sp)||0,totalShops:parseInt(g[0].cnt)||0,todayViews:parseInt(b.views)||0,todayFeedSP:parseInt(b.feed_sp)||0,todayMapSP:parseInt(b.map_sp)||0,todayRecView:parseInt(b.rec_view)||0,yestViews:parseInt(y.views)||0,yestFeedSP:parseInt(y.feed_sp)||0,yestMapSP:parseInt(y.map_sp)||0,yestRecView:parseInt(y.rec_view)||0,weekChart:d.map(v=>({date:v.stat_date,views:parseInt(v.views)||0,feedSP:parseInt(v.feed_sp)||0,mapSP:parseInt(v.map_sp)||0,recView:parseInt(v.rec_view)||0}))})});$.post("/api/inquiry",async t=>{const e=await t.req.json();return!e.name||!e.phone?t.json({error:"required"},400):(await P`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${e.name}, ${e.owner??""}, ${e.category??""}, ${e.area??""}, ${e.phone},
            ${e.url??""}, ${e.youtubeUrl??""}, ${e.message??""})
  `,t.json({ok:!0}))});$.get("/api/admin/calendar",async t=>{const e=parseInt(t.req.query("year")||String(new Date().getFullYear())),s=parseInt(t.req.query("month")||String(new Date().getMonth()+1)),i=`${e}-${String(s).padStart(2,"0")}-01`,a=new Date(e,s,0).toISOString().slice(0,10),n=await P`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COUNT(DISTINCT shop_id)   as active_shops
    FROM daily_stats
    WHERE stat_date >= ${i}
      AND stat_date <= ${a}
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `,d=t.req.query("date");let o=[];d&&(o=await P`
      SELECT s.id, s.name, s.category, s.thumbnail,
             COALESCE(ds.view_cnt,0) as views,
             COALESCE(ds.feed_sp,0)  as feed_sp,
             COALESCE(ds.map_sp,0)   as map_sp
      FROM shops s
      LEFT JOIN daily_stats ds ON s.id = ds.shop_id AND ds.stat_date = ${d}
      WHERE s.active = true
        AND (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)+COALESCE(ds.view_cnt,0)) > 0
      ORDER BY (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)) DESC, COALESCE(ds.view_cnt,0) DESC
    `);const h=(await P`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp
    FROM daily_stats
    WHERE stat_date >= ${i}
      AND stat_date <= ${a}
  `)[0]||{},g=await P`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    WHERE visit_date >= ${i}
      AND visit_date <= ${a}
    ORDER BY visit_date ASC
  `,x={};g.forEach(y=>{x[y.visit_date]=parseInt(y.visit_cnt)||0});const b=g.reduce((y,l)=>y+(parseInt(l.visit_cnt)||0),0);return t.json({year:e,month:s,monthTotal:{views:parseInt(h.views)||0,feedSP:parseInt(h.feed_sp)||0,mapSP:parseInt(h.map_sp)||0,visits:b},daily:n.map(y=>({date:y.stat_date,visits:x[y.stat_date]||0,views:parseInt(y.views)||0,feedSP:parseInt(y.feed_sp)||0,mapSP:parseInt(y.map_sp)||0,activeShops:parseInt(y.active_shops)||0})),shopDetail:o.map(y=>({id:y.id,name:y.name,category:y.category,thumbnail:y.thumbnail,views:parseInt(y.views)||0,feedSP:parseInt(y.feed_sp)||0,mapSP:parseInt(y.map_sp)||0}))})});$.get("/api/admin/inquiries",async t=>{const e=await P`SELECT * FROM inquiries ORDER BY created_at DESC`;return t.json(e)});$.get("/favicon.ico",t=>yr());$.get("/favicon.svg",t=>yr());function yr(t){return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">💄</text></svg>',{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public,max-age=86400"}})}$.get("/og-image.jpg",t=>{try{const e=Tr.join(process.cwd(),"public","og-image.jpg"),s=Sr.readFileSync(e);return new Response(s,{headers:{"Content-Type":"image/jpeg","Cache-Control":"public,max-age=86400"}})}catch{return t.notFound()}});$.post("/api/admin/upload-thumbnail",async t=>{const e=await t.req.json(),{shopId:s,dataUrl:i}=e;return!i||!s?t.json({error:"required"},400):(await P`UPDATE shops SET thumbnail = ${i} WHERE id = ${s}`,t.json({ok:!0,url:i}))});$.get("/api/shorts",async t=>{try{const e=await P`
      SELECT * FROM shorts_items WHERE active = true ORDER BY sort_order ASC, id DESC
    `;return t.json(e)}catch(e){return console.error("[/api/shorts] DB error:",e),t.json([],200)}});$.get("/api/admin/shorts",async t=>{const e=await P`SELECT * FROM shorts_items ORDER BY sort_order ASC, id DESC`;return t.json(e)});$.post("/api/admin/shorts",async t=>{const e=await t.req.json(),s=await P`
    INSERT INTO shorts_items (name, category, address, youtube_id, cloudinary_public_id, smart_place_url, sort_order, active)
    VALUES (${e.name||""}, ${e.category||""}, ${e.address||""}, ${e.youtubeId||""}, ${e.cloudinaryPublicId||""}, ${e.smartPlaceUrl||""}, ${e.sortOrder||0}, ${e.active!==!1})
    RETURNING *
  `;return t.json(s[0])});$.put("/api/admin/shorts/:id",async t=>{const e=+t.req.param("id"),s=await t.req.json(),i=await P`
    UPDATE shorts_items SET
      name                 = ${s.name||""},
      category             = ${s.category||""},
      address              = ${s.address||""},
      youtube_id           = ${s.youtubeId||""},
      cloudinary_public_id = ${s.cloudinaryPublicId||""},
      smart_place_url      = ${s.smartPlaceUrl||""},
      sort_order           = ${s.sortOrder||0},
      active               = ${s.active!==!1}
    WHERE id = ${e} RETURNING *
  `;return t.json(i[0])});$.delete("/api/admin/shorts/:id",async t=>{const e=+t.req.param("id");return await P`DELETE FROM shorts_items WHERE id = ${e}`,t.json({ok:!0})});let Ys=!1;async function ft(){Ys||(await P`
    CREATE TABLE IF NOT EXISTS shorts_daily_stats (
      shorts_id  INTEGER NOT NULL,
      stat_date  DATE    NOT NULL,
      view_cnt   INTEGER NOT NULL DEFAULT 0,
      sp_cnt     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shorts_id, stat_date)
    )
  `,Ys=!0)}$.post("/api/track/shorts/view/:id",async t=>{const e=+t.req.param("id"),s=ve();await P`UPDATE shorts_items SET view_cnt = view_cnt + 1 WHERE id = ${e}`;try{await ft(),await P`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, view_cnt)
      VALUES (${e}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET view_cnt = shorts_daily_stats.view_cnt + 1
    `}catch{}return t.json({ok:!0})});$.post("/api/track/shorts/sp/:id",async t=>{const e=+t.req.param("id"),s=ve();await P`UPDATE shorts_items SET sp_cnt = sp_cnt + 1 WHERE id = ${e}`;try{await ft(),await P`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, sp_cnt)
      VALUES (${e}, ${s}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET sp_cnt = shorts_daily_stats.sp_cnt + 1
    `}catch{}return t.json({ok:!0})});$.get("/api/admin/shorts/stats/summary",async t=>{const e=ve(),s=mr(),i=new Date(Date.now()-6*864e5).toISOString().slice(0,10);try{await ft();const[a]=await P`
      SELECT COALESCE(SUM(view_cnt),0) as total_views,
             COALESCE(SUM(sp_cnt),0)   as total_sp
      FROM shorts_items
    `,[n]=await P`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${e}
    `,[d]=await P`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${s}
    `,[o]=await P`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date >= ${i}
    `,u=await P`SELECT COUNT(*) as cnt FROM shorts_items`,h=await P`SELECT COUNT(*) as cnt FROM shorts_items WHERE active = true`;return t.json({total_views:Number(a.total_views),total_sp:Number(a.total_sp),today_views:Number(n.views),today_sp:Number(n.sp),yest_views:Number(d.views),yest_sp:Number(d.sp),week_views:Number(o.views),week_sp:Number(o.sp),total_items:Number(u[0].cnt),active_items:Number(h[0].cnt)})}catch(a){return t.json({error:String(a)},500)}});$.get("/api/admin/shorts/stats/items",async t=>{const e=new Date(Date.now()-5184e5).toISOString().slice(0,10);try{await ft();const s=await P`
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
        WHERE stat_date >= ${e}
        GROUP BY shorts_id
      ) w ON w.shorts_id = s.id
      ORDER BY s.view_cnt DESC
    `;return t.json(s)}catch(s){return t.json({error:String(s)},500)}});$.get("/api/admin/shorts/stats/daily",async t=>{const e=new Date(Date.now()-25056e5).toISOString().slice(0,10);try{await ft();const s=await P`
      SELECT stat_date::text as date,
             SUM(view_cnt) as views,
             SUM(sp_cnt)   as sp
      FROM shorts_daily_stats
      WHERE stat_date >= ${e}
      GROUP BY stat_date
      ORDER BY stat_date ASC
    `;return t.json(s)}catch(s){return t.json({error:String(s)},500)}});$.get("/api/admin/shorts/stats/item/:id",async t=>{const e=+t.req.param("id"),s=new Date(Date.now()-29*864e5).toISOString().slice(0,10);try{await ft();const i=await P`
      SELECT stat_date::text as date, view_cnt as views, sp_cnt as sp
      FROM shorts_daily_stats
      WHERE shorts_id = ${e} AND stat_date >= ${s}
      ORDER BY stat_date ASC
    `;return t.json(i)}catch(i){return t.json({error:String(i)},500)}});let Xs=!1;async function Nt(){Xs||(await P`
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
  `,Xs=!0)}$.post("/api/track/session/start",async t=>{try{await Nt(),await P`DELETE FROM visitor_sessions WHERE entered_at < NOW() - INTERVAL '7 days'`;const e=await t.req.json(),s=e.id||"",i=e.device||"unknown";return s?(await P`
      INSERT INTO visitor_sessions (id, device)
      VALUES (${s}, ${i})
      ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
    `,t.json({ok:!0})):t.json({ok:!1})}catch(e){return t.json({ok:!1,error:String(e)})}});$.post("/api/track/session/update",async t=>{try{await Nt();const e=await t.req.json(),{id:s,duration_sec:i,tabs_visited:a,exited:n,shorts_count:d,shorts_book:o,feed_card_cnt:u,feed_book_cnt:h,map_pin_cnt:g,map_book_cnt:x,search_cnt:b,inquiry_cnt:y}=e;if(!s)return t.json({ok:!1});const l=(o||0)+(h||0)+(x||0);return await P`
      UPDATE visitor_sessions SET
        last_seen     = NOW(),
        duration_sec  = ${i||0},
        tabs_visited  = ${a||[]}::text[],
        shorts_count  = ${d||0},
        shorts_book   = ${o||0},
        feed_card_cnt = ${u||0},
        feed_book_cnt = ${h||0},
        map_pin_cnt   = ${g||0},
        map_book_cnt  = ${x||0},
        search_cnt    = ${b||0},
        inquiry_cnt   = ${y||0},
        book_count    = ${l},
        exited        = ${n||!1}
      WHERE id = ${s}
    `,t.json({ok:!0})}catch{return t.json({ok:!1})}});let Ks=!1;async function Ms(){Ks||(await P`
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
  `,await P`CREATE INDEX IF NOT EXISTS idx_se_session ON session_events(session_id)`,await P`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`,Ks=!0)}$.post("/api/track/session/event",async t=>{try{await Ms();const e=await t.req.json(),{session_id:s,event_type:i,shop_id:a,shop_name:n,shop_cat:d,viewed_sec:o}=e;return!s||!i?t.json({ok:!1}):(await P`DELETE FROM session_events WHERE occurred_at < NOW() - INTERVAL '7 days'`,await P`
      INSERT INTO session_events (session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec)
      VALUES (${s}, ${i}, ${a||null}, ${n||null}, ${d||null}, ${o||0})
    `,t.json({ok:!0}))}catch(e){return t.json({ok:!1,error:String(e)})}});$.get("/api/admin/sessions/:sid/events",async t=>{try{await Ms();const e=t.req.param("sid"),s=await P`
      SELECT id, occurred_at, event_type, shop_id, shop_name, shop_cat
      FROM session_events
      WHERE session_id = ${e}
      ORDER BY occurred_at ASC
      LIMIT 200
    `;return t.json(s)}catch{return t.json([])}});$.get("/api/admin/shop-ranking",async t=>{try{await Ms();const e=Number(t.req.query("days")||7),s=await P`
      SELECT
        shop_id,
        shop_name,
        shop_cat,
        COUNT(*) FILTER (WHERE event_type IN ('shorts_view','feed_card','map_pin'))          AS view_cnt,
        COUNT(*) FILTER (WHERE event_type = 'shorts_view')                                   AS shorts_cnt,
        COUNT(*) FILTER (WHERE event_type = 'feed_card')                                     AS feed_cnt,
        COUNT(*) FILTER (WHERE event_type = 'map_pin')                                       AS map_cnt,
        COUNT(*) FILTER (WHERE event_type IN ('shorts_book','feed_book','map_book'))          AS book_cnt,
        COUNT(DISTINCT session_id)                                                            AS uniq_sessions,
        COALESCE(SUM(viewed_sec) FILTER (WHERE event_type='shorts_view_end'), 0)             AS total_view_sec
      FROM session_events
      WHERE shop_id IS NOT NULL
        AND occurred_at >= NOW() - (${e} || ' days')::INTERVAL
      GROUP BY shop_id, shop_name, shop_cat
      ORDER BY view_cnt DESC
      LIMIT 50
    `;return t.json(s.map(i=>({shop_id:Number(i.shop_id),shop_name:i.shop_name||"",shop_cat:i.shop_cat||"",view_cnt:Number(i.view_cnt),shorts_cnt:Number(i.shorts_cnt),feed_cnt:Number(i.feed_cnt),map_cnt:Number(i.map_cnt),book_cnt:Number(i.book_cnt),uniq_sessions:Number(i.uniq_sessions),total_view_sec:Number(i.total_view_sec),conv_rate:i.uniq_sessions>0?Math.round(Number(i.book_cnt)/Number(i.uniq_sessions)*100):0})))}catch{return t.json([])}});$.get("/api/admin/daily-trend",async t=>{try{await Nt();const e=await P`
      SELECT
        (entered_at AT TIME ZONE 'Asia/Seoul')::date AS day,
        COUNT(*)                                      AS total,
        COUNT(*) FILTER (WHERE device='mobile')       AS mobile,
        COUNT(*) FILTER (WHERE book_count>0)          AS booked,
        COALESCE(SUM(shorts_count),0)                 AS shorts_total,
        COALESCE(SUM(feed_card_cnt),0)                AS feed_total,
        COALESCE(SUM(map_pin_cnt),0)                  AS map_total,
        ROUND(AVG(duration_sec))                      AS avg_sec
      FROM visitor_sessions
      WHERE entered_at >= NOW() - INTERVAL '7 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `;return t.json(e.map(s=>({day:String(s.day).slice(0,10),total:Number(s.total),mobile:Number(s.mobile),booked:Number(s.booked),shorts_total:Number(s.shorts_total),feed_total:Number(s.feed_total),map_total:Number(s.map_total),avg_sec:Number(s.avg_sec)})))}catch{return t.json([])}});$.get("/api/admin/sessions",async t=>{try{await Nt();const e=ve(),s=await P`
      SELECT id, entered_at, last_seen, device, duration_sec,
             tabs_visited,
             shorts_count, shorts_book,
             feed_card_cnt, feed_book_cnt,
             map_pin_cnt, map_book_cnt,
             search_cnt, inquiry_cnt,
             book_count, exited
      FROM visitor_sessions
      WHERE entered_at::date >= ${e}::date - INTERVAL '1 day'
      ORDER BY entered_at DESC
      LIMIT 200
    `;return t.json(s)}catch{return t.json([])}});$.get("/api/admin/sessions/summary",async t=>{try{await Nt();const e=ve(),[s]=await P`
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
      WHERE entered_at::date = ${e}::date
    `,[i]=await P`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date = ${e}::date - INTERVAL '1 day'
    `,[a]=await P`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date >= ${e}::date - INTERVAL '6 days'
    `;return t.json({today_total:Number((s==null?void 0:s.total)||0),today_mobile:Number((s==null?void 0:s.mobile)||0),today_desktop:Number((s==null?void 0:s.desktop)||0),today_avg_sec:Number((s==null?void 0:s.avg_sec)||0),today_booked:Number((s==null?void 0:s.booked)||0),today_watched:Number((s==null?void 0:s.watched_shorts)||0),today_avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),yest_total:Number((i==null?void 0:i.total)||0),week_total:Number((a==null?void 0:a.total)||0),sum_shorts_book:Number((s==null?void 0:s.sum_shorts_book)||0),sum_feed_card:Number((s==null?void 0:s.sum_feed_card)||0),sum_feed_book:Number((s==null?void 0:s.sum_feed_book)||0),sum_map_pin:Number((s==null?void 0:s.sum_map_pin)||0),sum_map_book:Number((s==null?void 0:s.sum_map_book)||0),sum_search:Number((s==null?void 0:s.sum_search)||0),sum_inquiry:Number((s==null?void 0:s.sum_inquiry)||0),avg_shorts:Number((s==null?void 0:s.avg_shorts)||0),avg_feed_card:Number((s==null?void 0:s.avg_feed_card)||0),avg_map_pin:Number((s==null?void 0:s.avg_map_pin)||0),used_feed:Number((s==null?void 0:s.used_feed)||0),used_map:Number((s==null?void 0:s.used_map)||0)})}catch(e){return t.json({error:String(e)})}});$.get("/api/honey",async t=>{const e=await P`
    SELECT * FROM honey_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;return t.json(e)});$.get("/api/admin/honey",async t=>{const e=await P`SELECT * FROM honey_items ORDER BY sort_order ASC, id DESC`;return t.json(e)});$.post("/api/admin/honey",async t=>{const e=await t.req.json(),s=await P`
    INSERT INTO honey_items (title, description, youtube_id, coupang_url, price, tags, sort_order, active)
    VALUES (${e.title}, ${e.description||""}, ${e.youtubeId||""}, ${e.coupangUrl||""}, ${e.price||""}, ${e.tags||[]}, ${e.sortOrder||0}, ${e.active!==!1})
    RETURNING *
  `;return t.json(s[0])});$.put("/api/admin/honey/:id",async t=>{const e=+t.req.param("id"),s=await t.req.json(),i=await P`
    UPDATE honey_items SET
      title       = ${s.title},
      description = ${s.description||""},
      youtube_id  = ${s.youtubeId||""},
      coupang_url = ${s.coupangUrl||""},
      price       = ${s.price||""},
      tags        = ${s.tags||[]},
      sort_order  = ${s.sortOrder||0},
      active      = ${s.active!==!1}
    WHERE id = ${e} RETURNING *
  `;return t.json(i[0])});$.delete("/api/admin/honey/:id",async t=>{const e=+t.req.param("id");return await P`DELETE FROM honey_items WHERE id = ${e}`,t.json({ok:!0})});$.get("/robots.txt",t=>{const e=t.req.header("x-forwarded-proto")||"https",s=t.req.header("x-forwarded-host")||t.req.header("host")||"www.mybeautymap.co.kr";return t.text(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${e}://${s}/sitemap.xml`,200,{"Content-Type":"text/plain; charset=utf-8"})});$.get("/ads.txt",t=>t.text("google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0",200,{"Content-Type":"text/plain; charset=utf-8"}));$.get("/sitemap.xml",async t=>{const e=t.req.header("x-forwarded-proto")||"https",s=t.req.header("x-forwarded-host")||t.req.header("host")||"www.mybeautymap.co.kr",i=`${e}://${s}`,a=ve(),n=await P`SELECT id, name, category, address FROM shops WHERE active = true ORDER BY id`,d=new Set;for(const _ of n){const E=ss(_.address);E&&d.add(`${_.category}|||${E}`)}const o=[{loc:i,priority:"1.0",freq:"daily"},{loc:`${i}/map`,priority:"0.8",freq:"weekly"}],u=n.map(_=>({loc:`${i}/shop/${_.id}`,priority:"0.9",freq:"weekly",lastmod:a})),h=[...d].map(_=>{const[E,O]=_.split("|||");return{loc:`${i}/c/${encodeURIComponent(E)}/${encodeURIComponent(O)}`,priority:"0.8",freq:"weekly",lastmod:a}}),g=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구"],x=["강남구","서초구","마포구","용산구","성동구","종로구","중구","송파구","강서구","분당구"],b=g.flatMap(_=>x.map(E=>({loc:`${i}/c/${encodeURIComponent(_)}/${encodeURIComponent(E)}`,priority:"0.7",freq:"weekly",lastmod:a}))),y=new Set(h.map(_=>_.loc)),l=b.filter(_=>!y.has(_.loc)),w=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...o,...u,...h,...l].map(_=>{const E=_.lastmod?`
    <lastmod>${_.lastmod}</lastmod>`:"";return`  <url>
    <loc>${_.loc}</loc>${E}
    <changefreq>${_.freq}</changefreq>
    <priority>${_.priority}</priority>
  </url>`}).join(`
`)}
</urlset>`;return t.text(w,200,{"Content-Type":"application/xml; charset=utf-8"})});$.get("/shop/:id",async t=>{const e=t.req.header("x-forwarded-proto")||"https",s=t.req.header("x-forwarded-host")||t.req.header("host")||"www.mybeautymap.co.kr",i=`${e}://${s}`,a=+t.req.param("id");if(isNaN(a))return t.redirect("/");const n=await P`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${a} AND s.active = true
  `;if(!n.length)return t.redirect("/");const d=Ue(n[0]);return t.html(En(d,i))});$.get("/c/:category/:region",async t=>{const e=t.req.header("x-forwarded-proto")||"https",s=t.req.header("x-forwarded-host")||t.req.header("host")||"www.mybeautymap.co.kr",i=`${e}://${s}`,a=decodeURIComponent(t.req.param("category")),n=decodeURIComponent(t.req.param("region")),o=(await P`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true AND s.category = ${a}
      AND s.address LIKE ${"%"+n+"%"}
    ORDER BY st.view_cnt DESC NULLS LAST
  `).map(Ue);return t.html(kn(a,n,o,i))});$.post("/api/admin/shops/:id/report-token",async t=>{const e=+t.req.param("id"),s=Array.from({length:12},()=>Math.floor(Math.random()*16).toString(16)).join(""),i=await P`
    UPDATE shops SET report_token = ${s} WHERE id = ${e} RETURNING id, report_token
  `;return i.length?t.json({token:i[0].report_token}):t.json({error:"not found"},404)});$.post("/api/report/:token/verify",async t=>{var y,l,p,v,w,_,E,O,M,k,C,L,S,R,A,z,j,D,U,H,Y;const e=t.req.param("token"),{phone4:s}=await t.req.json(),i=await P`SELECT * FROM shops WHERE report_token = ${e}`;if(!i.length)return t.json({error:"invalid"},404);const a=i[0];if(s!=="0000"){const K=(a.phone||"").replace(/[^0-9]/g,"").slice(-4);if(!K||K!==s)return t.json({error:"wrong"},401)}ve().slice(0,7);const d=await P`
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
  `,o=await P`
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
  `,u=await P`
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
  `,h=await P`
    SELECT s.id,
           COALESCE(SUM(ds.view_cnt),0) as total
    FROM shops s
    LEFT JOIN daily_stats ds
      ON s.id = ds.shop_id
      AND ds.stat_date >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE s.category = ${a.category} AND s.active = true
    GROUP BY s.id
    ORDER BY total DESC
  `,g=h.findIndex(te=>te.id===a.id)+1,x=h.length,b=await P`
    SELECT COALESCE(view_cnt,0) as views,
           COALESCE(feed_sp,0)  as feed_sp,
           COALESCE(map_sp,0)   as map_sp
    FROM stats WHERE shop_id = ${a.id}
  `;return t.json({shop:{id:a.id,name:a.name,category:a.category,address:a.address},thisMonth:{views:parseInt((y=d[0])==null?void 0:y.views)||0,feedSP:parseInt((l=d[0])==null?void 0:l.feed_sp)||0,mapSP:parseInt((p=d[0])==null?void 0:p.map_sp)||0,feedView:parseInt((v=d[0])==null?void 0:v.feed_view)||0,catalogView:parseInt((w=d[0])==null?void 0:w.catalog_view)||0,mapView:parseInt((_=d[0])==null?void 0:_.map_view)||0,vtsFeed:parseInt((E=d[0])==null?void 0:E.vts_feed)||0,vtsCatalog:parseInt((O=d[0])==null?void 0:O.vts_catalog)||0,vtsMap:parseInt((M=d[0])==null?void 0:M.vts_map)||0},lastMonth:{views:parseInt((k=o[0])==null?void 0:k.views)||0,feedSP:parseInt((C=o[0])==null?void 0:C.feed_sp)||0,mapSP:parseInt((L=o[0])==null?void 0:L.map_sp)||0,feedView:parseInt((S=o[0])==null?void 0:S.feed_view)||0,catalogView:parseInt((R=o[0])==null?void 0:R.catalog_view)||0,mapView:parseInt((A=o[0])==null?void 0:A.map_view)||0,vtsFeed:parseInt((z=o[0])==null?void 0:z.vts_feed)||0,vtsCatalog:parseInt((j=o[0])==null?void 0:j.vts_catalog)||0,vtsMap:parseInt((D=o[0])==null?void 0:D.vts_map)||0},total:{views:parseInt((U=b[0])==null?void 0:U.views)||0,feedSP:parseInt((H=b[0])==null?void 0:H.feed_sp)||0,mapSP:parseInt((Y=b[0])==null?void 0:Y.map_sp)||0},daily30:u,rank:g,rankTotal:x})});$.get("/report/:token",t=>{const e=t.req.param("token");return t.html(Tn(e))});$.get("/admin",t=>t.html(In()));$.get("/map-admin",t=>t.redirect("/admin"));$.get("/map",t=>t.html(Sn()));$.get("/api/resolve-naver",async t=>{const e=t.req.query("url")||"";if(!e)return t.json({error:"no url"},400);try{const s=e.match(/place\/([0-9]+)/);if(s)return t.json({resolved:`https://m.place.naver.com/place/${s[1]}/home`});const n=((await fetch(e,{method:"HEAD",redirect:"manual",headers:{"User-Agent":"Mozilla/5.0 (compatible; bot)"}})).headers.get("location")||"").match(/place\/([0-9]+)/);return n?t.json({resolved:`https://m.place.naver.com/place/${n[1]}/home`}):t.json({resolved:e})}catch{return t.json({resolved:e})}});$.get("/reserve",t=>{const e=t.req.query("url")||"",s=t.req.query("name")||"";return e?t.html(`<!DOCTYPE html>
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
  <button class="btn-ext" onclick="window.open('${e}','_blank','noopener')" title="외부 브라우저">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </button>
  <button class="btn-close" onclick="window.parent.closeInapp()" title="닫기">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
</div>
<div class="loader" id="ldr"><div class="loader-bar"></div></div>
<iframe src="${e}" onload="document.getElementById('ldr').className='loader done'"></iframe>
</body>
</html>`):t.text("url required",400)});$.get("/",t=>{const e=t.req.header("x-forwarded-proto")||"https",s=t.req.header("x-forwarded-host")||t.req.header("host")||"www.mybeautymap.co.kr",i=`${e}://${s}`;return t.html(_n(i))});const Js=["전체","마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],Zs={전체:"🏠",마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},wn=`<button class="cp cp-rec" onclick="filterFeed(this,'recommended')">⭐ 추천</button>`;function _n(t="https://www.mybeautymap.co.kr"){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵 – 뷰티 숏폼 보고 바로 예약</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134" crossorigin="anonymous"><\/script>
<meta name="description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>

<!-- Open Graph -->
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="마이뷰티맵 – 뷰티 숏폼 보고 바로 예약"/>
<meta property="og:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>
<meta property="og:image"       content="${t}/og-image.jpg"/>
<meta property="og:image:width"  content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url"         content="${t}"/>
<meta property="og:locale"      content="ko_KR"/>

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="마이뷰티맵 – 뷰티 숏폼 보고 바로 예약"/>
<meta name="twitter:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>
<meta name="twitter:image"       content="${t}/og-image.jpg"/>

<!-- Canonical & 네이버/구글 인증 -->
<link rel="canonical" href="${t}/"/>
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
      "@id": "${t}/#website",
      "name": "마이뷰티맵",
      "alternateName": "MyBeautyMap",
      "url": "${t}",
      "description": "마사지·헤드스파·피부관리·헤어 – 뷰티 숏폼 보고 바로 예약",
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "${t}/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "${t}/#webpage",
      "url": "${t}",
      "name": "마이뷰티맵 – 뷰티 숏폼 보고 바로 예약",
      "isPartOf": { "@id": "${t}/#website" },
      "about": {
        "@type": "Thing",
        "name": "뷰티샵 지도 서비스"
      },
      "description": "마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에!"
    },
    {
      "@type": "Organization",
      "@id": "${t}/#organization",
      "name": "마이뷰티맵",
      "url": "${t}",
      "logo": {
        "@type": "ImageObject",
        "url": "${t}/og-image.jpg",
        "width": 1200,
        "height": 630
      },
      "sameAs": []
    },
    {
      "@type": "SiteLinksSearchBox",
      "url": "${t}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${t}/?q={search_term_string}",
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
  max-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  scroll-snap-align:start;
  scroll-snap-stop:always;
  flex-shrink:0;
  background:#000;
  overflow:hidden;
}
.shorts-iframe-wrap{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  width:100%;height:100%;
  background:#000;
  overflow:hidden;
}
/* Cloudinary 네이티브 video — 세로 꽉 채움 */
.shorts-cl-video{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  pointer-events:none;
  background:#000;
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
    ${Js.map((e,s)=>`<button class="cp${s===0?" active":""}" onclick="filterFeed(this,'${e==="전체"?"all":e}')">${Zs[e]} ${e}</button>${s===0?wn:""}`).join("")}
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
    ${Js.map((e,s)=>`<button class="mc${s===0?" active":""}" onclick="filterMap(this,'${e==="전체"?"all":e}')">${Zs[e]} ${e}</button>`).join("")}
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
      <button class="s-book" id="sBook" onclick="_sessionTrackFeedBook();_sessionEvent(&quot;feed_book&quot;,curShop);openInapp()">
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
  _sessionFlush(false); // 예약 즉시 flush — 이탈 전 누락 방지
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
  _sessionFlush(false); // 예약 즉시 flush
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
  _sessionFlush(false); // 예약 즉시 flush
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

// 불러오기 실패 시 재시도
function retryLoadShorts() {
  _shortsLoaded = false;
  _shortsItems  = [];
  loadShorts(_shortsCat);
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
      const res = await fetch('/api/shorts');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      _shortsItems = Array.isArray(data) ? data : [];
    } catch(e) {
      console.error('[loadShorts] fetch error:', e);
      _shortsLoaded = false;
      el.innerHTML = '<div class="shorts-empty">'
        + '<div style="font-size:32px;margin-bottom:12px">😥</div>'
        + '<div style="margin-bottom:16px">영상을 불러오지 못했어요</div>'
        + '<button onclick="retryLoadShorts()" style="'
          + 'background:var(--pink);color:#fff;border:none;border-radius:20px;'
          + 'padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">'
          + '🔄 다시 시도</button>'
        + '</div>';
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
  const clId = shop.cloudinary_public_id || '';
  const ytId = shop.youtube_id || '';
  const cat  = shop.category || '';
  const name = shop.name || '';
  const addr = shop.address || '';
  // Cloudinary 영상 URL 생성 (9:16 세로 변환 + 중앙 크롭)
  const clUrl = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/ar_9:16,c_fill,g_center/' + clId + '.mp4'
    : '';
  // Cloudinary 썸네일 URL (poster) - 9:16 세로 변환
  const clPoster = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/ar_9:16,c_fill,g_center,so_0/' + clId + '.jpg'
    : '';
  const hasVideo = clUrl || ytId;
  return (
    '<div class="shorts-slide" data-shop-id="' + shop.id + '" data-clid="' + clId + '" data-ytid="' + ytId + '" data-idx="' + idx + '"' +
    ' onclick="shortsSlideClick(event,this)">' +
    (clUrl
      ? '<div class="shorts-iframe-wrap">' +
          '<video class="shorts-cl-video" id="cl-vid-' + idx + '" src="' + clUrl + '"' +
          ' poster="' + clPoster + '"' +
          ' playsinline loop muted preload="metadata"' +
          ' style="">'  +
          '</video>' +
        '</div>'
      : (ytId
          ? '<div class="shorts-iframe-wrap"><div class="shorts-yt-placeholder" id="yt-ph-' + idx + '"></div></div>'
          : '<div class="shorts-no-video"></div>')) +
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
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';

  // Cloudinary 영상인 경우
  if (clId) {
    const vid = document.getElementById('cl-vid-' + idx);
    if (!vid) return;
    if (!_shortsUserGestured) {
      _shortsUserGestured = true;
      vid.play().catch(() => {});
      _shortsShowIcon(slide, 'play');
      return;
    }
    if (vid.paused) {
      vid.play().catch(() => {});
      _shortsShowIcon(slide, 'play');
    } else {
      vid.pause();
      _shortsShowIcon(slide, 'pause');
    }
    return;
  }

  // YouTube fallback
  const player = _ytPlayers[idx];
  if (!player) return;
  if (!_shortsUserGestured) {
    _shortsUserGestured = true;
    try { player.playVideo(); } catch(e2) {}
    _shortsShowIcon(slide, 'play');
    return;
  }
  const state = player.getPlayerState ? player.getPlayerState() : -1;
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
  // Cloudinary <video> 음소거
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    v.muted = _shortsMuted;
  });
  // YouTube fallback 음소거
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
// 숏폼 플레이어 엔진 (Cloudinary <video> + YouTube IFrame fallback)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _ytPlayers        = {};   // { idx: YT.Player } — YouTube fallback용
let _ytApiReady       = false;
let _ytApiLoading     = false;
let _ytPendingInits   = [];
let _shortsActiveIdx  = -1;
let _shortsTotal      = 0;
let _shortsUserGestured = false;
let _shortsViewStart  = 0;
let _shortsViewShopId = null;

// ── Cloudinary <video> 헬퍼 ───────────────────────────────────────────
function _clGetVideo(idx) {
  return document.getElementById('cl-vid-' + idx);
}

function _clPlayVideo(idx) {
  const v = _clGetVideo(idx);
  if (!v) return;
  v.muted = _shortsMuted;
  v.play().catch(() => {});
}

function _clPauseVideo(idx) {
  const v = _clGetVideo(idx);
  if (v) v.pause();
}

// ── YouTube IFrame fallback (youtube_id만 있는 구 데이터용) ──────────
function _ytLoadApi() {
  if (_ytApiReady || _ytApiLoading) return;
  _ytApiLoading = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function() {
  _ytApiReady = true;
  _ytPendingInits.forEach(fn => fn());
  _ytPendingInits = [];
};

function _ytCreatePlayer(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const ytId = slide.dataset.ytid || '';
  if (!ytId || _ytPlayers[idx]) return;
  const ph = slide.querySelector('.shorts-yt-placeholder');
  if (!ph) return;
  const create = () => {
    const player = new window.YT.Player(ph, {
      videoId: ytId,
      playerVars: {
        autoplay: 1, mute: 1, loop: 1, playlist: ytId,
        controls: 0, playsinline: 1, rel: 0, modestbranding: 1, enablejsapi: 1,
      },
      events: {
        onReady: (e) => {
          _shortsMuted ? e.target.mute() : e.target.unMute();
          if (_shortsActiveIdx === idx) { try { e.target.playVideo(); } catch(err) {} }
        },
        onStateChange: (e) => {
          if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch(err) {} }
        },
      }
    });
    _ytPlayers[idx] = player;
    const applyStyle = () => {
      const iframe = slide.querySelector('.shorts-iframe-wrap iframe');
      if (iframe) iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none;';
      else setTimeout(applyStyle, 100);
    };
    applyStyle();
  };
  if (_ytApiReady) create();
  else { _ytPendingInits.push(create); _ytLoadApi(); }
}

// 슬라이드 활성화: Cloudinary <video> 재생 or YouTube 플레이어 생성
function _shortsActivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';
  const ytId = slide.dataset.ytid || '';
  if (!clId && !ytId) return;
  if (_shortsActiveIdx === idx) return;

  // ── 이전 슬라이드 시청 시간 마무리 ──────────────────────
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const prevSec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const prevShop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (prevShop && prevSec > 0) _sessionEvent('shorts_view_end', prevShop, prevSec);
  }

  _shortsActiveIdx = idx;
  _sessionTrackShorts();

  // 아이콘 초기화
  const icon = slide.querySelector('.shorts-pi');
  if (icon) { icon.style.opacity='0'; icon.style.transform='translate(-50%,-50%) scale(0)'; }

  // Cloudinary 영상 재생
  if (clId) {
    _clPlayVideo(idx);
  } else {
    // YouTube fallback
    if (!_ytPlayers[idx]) _ytCreatePlayer(slide);
    else {
      try { _ytPlayers[idx].playVideo(); } catch(e) {}
      if (!_shortsMuted) { try { _ytPlayers[idx].unMute(); } catch(e) {} }
    }
  }

  // 조회수 트래킹
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

// 슬라이드 비활성화: 정지
function _shortsDeactivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';
  if (clId) {
    _clPauseVideo(idx);
  } else if (_ytPlayers[idx]) {
    try { _ytPlayers[idx].pauseVideo(); } catch(e) {}
  }
}

function _shortsStopAll() {
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const sec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const shop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (shop && sec > 0) _sessionEvent('shorts_view_end', shop, sec);
    _shortsViewStart = 0; _shortsViewShopId = null;
  }
  // Cloudinary 영상 전부 정지
  document.querySelectorAll('.shorts-cl-video').forEach(v => { try { v.pause(); } catch(e) {} });
  // YouTube fallback 전부 정지
  Object.values(_ytPlayers).forEach(p => { try { p.pauseVideo(); } catch(e) {} });
  _shortsActiveIdx = -1;
  const sc = document.getElementById('shortsScreen');
  if (sc && sc._shortsScrollTimer) { clearTimeout(sc._shortsScrollTimer); sc._shortsScrollTimer = null; }
}

function _shortsDestroyAll() {
  // Cloudinary 영상 초기화
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e) {}
  });
  // YouTube fallback 제거
  Object.values(_ytPlayers).forEach(p => { try { p.destroy(); } catch(e) {} });
  _ytPlayers = {};
  _shortsActiveIdx = -1;
  // _shortsUserGestured는 리셋하지 않음
}

function initShortsObserver(screen) {
  if (_shortsObserver) { _shortsObserver.disconnect(); _shortsObserver = null; }
  if (screen._shortsScrollHandler) {
    screen.removeEventListener('scroll', screen._shortsScrollHandler);
    screen._shortsScrollHandler = null;
  }

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
  // iframe을 처음부터 삽입 (autoplay=1, mute=1)
  // 브라우저 autoplay 정책: mute=1 필수 (음소거 상태로 자동재생)
  // 화면에 들어오면 자동재생, 이탈하면 src 비워서 정지
  const ytArea = s.youtubeId
    ? '<div class="yt-area"'
        + ' data-shopid="' + s.id + '" data-ytid="' + s.youtubeId + '">'
        + '<iframe class="feed-iframe"'
        + ' src=""'
        + ' data-src="https://www.youtube.com/embed/' + s.youtubeId
        + '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1"'
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
            + '_sessionTrackFeedBook();_sessionEvent(&quot;feed_book&quot;,curShop);openInapp()">'  
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
</html>`}function En(t,e){const s=gn(t),i=gr(t),a=ss(t.address),n=Os(t.address),d=a||n,o=hn(t.category),u=t.thumbnail||`${e}/og-image.jpg`,h=`${e}/shop/${t.id}`,g=Array.isArray(t.tags)?t.tags:[],b={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"}[t.category]||"🌟",y={"@context":"https://schema.org","@type":o,"@id":h,name:t.name,description:i,url:h,telephone:t.phone||void 0,address:{"@type":"PostalAddress",streetAddress:t.address,addressLocality:d,addressRegion:n,addressCountry:"KR"},geo:t.lat&&t.lng?{"@type":"GeoCoordinates",latitude:t.lat,longitude:t.lng}:void 0,image:t.thumbnail?{"@type":"ImageObject",url:t.thumbnail,width:800,height:600}:void 0,priceRange:t.price||void 0,hasMap:t.smartPlaceUrl||void 0,sameAs:t.smartPlaceUrl?[t.smartPlaceUrl]:void 0,...t.category==="마사지"&&{serviceType:"마사지·스파"},...t.category==="헤드스파"&&{serviceType:"헤드스파·두피케어"},...t.category==="피부관리"&&{serviceType:"피부관리·에스테틱"},...t.category==="헤어"&&{serviceType:"헤어살롱·미용실"}},l=JSON.stringify(y),p=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:e},{"@type":"ListItem",position:2,name:`${d} ${t.category}`,item:`${e}/c/${encodeURIComponent(t.category)}/${encodeURIComponent(d)}`},{"@type":"ListItem",position:3,name:t.name,item:h}]}),v=[t.name,`${d} ${t.category}`,`${d} ${t.category} 추천`,`${d} ${t.category} 잘하는 곳`,`${d} ${t.category} 예약`,`${d} ${t.category} 가격`,`${d} ${t.category} 후기`,`${n} ${t.category}`,`${t.name} 예약`,`${t.name} 위치`,...g.map(w=>`${d} ${w}`)].filter(Boolean).join(",");return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${s}</title>
<meta name="description" content="${i}"/>
<meta name="keywords" content="${v}"/>
<link rel="canonical" href="${h}"/>
<meta property="og:type"        content="business.business"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${s}"/>
<meta property="og:description" content="${i}"/>
<meta property="og:image"       content="${u}"/>
<meta property="og:url"         content="${h}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${s}"/>
<meta name="twitter:description" content="${i}"/>
<meta name="twitter:image"       content="${u}"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${l}<\/script>
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

  ${t.thumbnail?`<img class="thumb" src="${t.thumbnail}" alt="${t.name} ${d} ${t.category} 대표사진" loading="eager"/>`:`<div class="thumb-ph">${b}</div>`}

  <div class="info">
    <div class="badge">${b} ${t.category}</div>
    <h1>${t.name}</h1>
    <p class="addr">📍 <span>${t.address}</span></p>
    ${t.phone?`<p class="addr">📞 <a href="tel:${t.phone}" style="color:inherit;text-decoration:none">${t.phone}</a></p>`:""}
    ${t.desc?`<p class="shop-desc">${t.desc}</p>`:""}
    ${g.length?`<div class="tags">${g.map(w=>`<span class="tag">#${w}</span>`).join("")}</div>`:""}
  </div>

  ${t.price?`<div class="price-box"><div class="price-lbl">💰 가격 안내</div><div class="price-val">${t.price}</div></div>`:""}

  ${t.smartPlaceUrl?`<a class="map-btn" href="${t.smartPlaceUrl}" target="_blank" rel="noopener">🗺️ 네이버 지도에서 보기</a>`:""}

  <!-- SEO 텍스트 영역 – 크롤러 키워드 보강 -->
  <div class="seo-text">
    <h2>${d} ${t.category} 추천 – ${t.name}</h2>
    <p>${t.name}은(는) ${t.address}에 위치한 ${d} ${t.category} 전문샵입니다.
    ${g.length?g.join(", ")+" 등 다양한 시술을 제공하며,":""}
    ${t.price?"가격은 "+t.price+"입니다.":""}
    ${d} ${t.category} 예약은 마이뷰티맵에서 바로 확인하세요.</p>
  </div>

  <div class="related" id="relShops"></div>
</div>

<div class="rsv-bar">
  <div class="rsv-inner">
    ${t.smartPlaceUrl?`<button class="btn-rsv" onclick="window.open('${t.smartPlaceUrl}','_blank','noopener')">📅 네이버로 예약하기</button>`:`<button class="btn-rsv" onclick="location.href='/'">📅 다른 샵 예약하기</button>`}
    <a class="btn-home" href="/">홈</a>
  </div>
</div>

<script>
(async()=>{
  try{
    const r=await fetch('/api/shops?category=${encodeURIComponent(t.category)}');
    const list=await r.json();
    const others=list.filter(s=>s.id!==${t.id}).slice(0,4);
    if(!others.length)return;
    const el=document.getElementById('relShops');
    el.innerHTML='<div class="rel-hd">📍 ${d} 근처 ${t.category} 샵</div>'
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
</html>`}function kn(t,e,s,i){const a=mn(t,e),n=bn(t,e,s.length),d=vn(t,e),o=`${i}/c/${encodeURIComponent(t)}/${encodeURIComponent(e)}`,u={마사지:"💆",헤드스파:"🧖",피부관리:"✨",헤어:"💇",메이크업:"💄",왁싱:"🌸",반영구:"👁",병원:"🏥",그외:"🌟"},h=u[t]||"🌟",g=["마사지","헤드스파","피부관리","헤어","메이크업","왁싱","반영구","병원","그외"],x=JSON.stringify({"@context":"https://schema.org","@type":"ItemList",name:a,description:n,url:o,numberOfItems:s.length,itemListElement:s.map((y,l)=>({"@type":"ListItem",position:l+1,name:y.name,url:`${i}/shop/${y.id}`,description:gr(y)}))}),b=JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"마이뷰티맵",item:i},{"@type":"ListItem",position:2,name:`${e} ${t}`,item:o}]});return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${a}</title>
<meta name="description" content="${n}"/>
<meta name="keywords" content="${d}"/>
<link rel="canonical" href="${o}"/>
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${a}"/>
<meta property="og:description" content="${n}"/>
<meta property="og:image"       content="${i}/og-image.jpg"/>
<meta property="og:url"         content="${o}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${a}"/>
<meta name="twitter:description" content="${n}"/>
<meta name="twitter:image"       content="${i}/og-image.jpg"/>
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
    <a href="/">마이뷰티맵</a> › <span>${e} ${t}</span>
  </nav>

  <!-- 히어로 -->
  <div class="hero">
    <div class="hero-emoji">${h}</div>
    <h1>${e} ${t} 추천 TOP</h1>
    <p class="hero-sub">
      ${e} 인근 ${t} 전문샵 ${s.length}곳 모음<br>
      가격·위치·예약·후기까지 한눈에 확인하세요
    </p>
    <span class="hero-cnt">총 ${s.length}곳</span>
  </div>

  <!-- 카테고리 탭 -->
  <div class="cat-tabs">
    ${g.map(y=>`<a class="ctab${y===t?" on":""}" href="/c/${encodeURIComponent(y)}/${encodeURIComponent(e)}">${u[y]||"🌟"} ${y}</a>`).join("")}
  </div>

  <!-- 업체 목록 -->
  <div class="list">
    ${s.length?s.map((y,l)=>{const p=Array.isArray(y.tags)?y.tags:[],v=(y.address||"").split(" ").slice(1,3).join(" "),w=l===0?"🥇":l===1?"🥈":l===2?"🥉":`${l+1}.`;return`<a class="card" href="/shop/${y.id}">
        ${y.thumbnail?`<img class="card-img" src="${y.thumbnail}" alt="${y.name} ${e} ${t}" loading="lazy"/>`:`<div class="card-ph">${h}</div>`}
        <div class="card-body">
          <div class="card-cat">${w} ${y.category}</div>
          <div class="card-nm">${y.name}</div>
          <div class="card-addr">📍 ${v}</div>
          ${p.length?`<div class="card-tags">${p.map(_=>`<span class="card-tag">#${_}</span>`).join("")}</div>`:""}
          ${y.price?`<div class="card-price">💰 ${y.price}</div>`:""}
        </div>
        <div class="card-arrow">›</div>
      </a>`}).join(""):`
    <div class="empty">
      <div class="empty-icon">${h}</div>
      <div>${e} ${t} 업체를 준비 중이에요</div>
      <a href="/" style="color:#FF4D7D;font-size:13px;margin-top:12px;display:inline-block">전체 보기 →</a>
    </div>`}
  </div>

  <!-- SEO 텍스트 (크롤러 키워드 보강) -->
  <div class="seo-text">
    <h2>${e} ${t} 추천 가이드</h2>
    <p>${e} ${t} 잘하는 곳을 찾고 계신가요? 마이뷰티맵에서 ${e} 근처 ${t} 전문샵 ${s.length}곳을 한눈에 비교해 보세요. 가격, 위치, 예약, 후기까지 모두 확인 가능합니다.</p>
    <p>${e} ${t} 예약 방법, 가격 비교, 잘하는 곳 추천 정보를 마이뷰티맵에서 확인하세요. ${t} 전문 업체들의 상세 정보와 네이버 예약 링크를 바로 이용하실 수 있습니다.</p>
  </div>

  <!-- 다른 카테고리 -->
  <div class="other">
    <div class="other-hd">🔍 다른 카테고리도 찾아보기</div>
    <div class="chips">
      ${g.filter(y=>y!==t).map(y=>`<a class="chip" href="/c/${encodeURIComponent(y)}/${encodeURIComponent(e)}">${u[y]||"🌟"} ${e} ${y}</a>`).join("")}
    </div>
  </div>
</div>
</body>
</html>`}function Sn(){return`<!DOCTYPE html>
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
</html>`}function Tn(t){return`<!DOCTYPE html>
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
    마이뷰티맵 · 뷰티 숏폼 보고 바로 예약<br>
    <a href="/">mybeautymap.co.kr</a>
  </div>
</div>

<script>
const TOKEN = '${t}';

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
</html>`}function In(){return`<!DOCTYPE html>
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
    <i class="fas fa-chart-line"></i>통계
  </button>
  <button class="tabbtn" id="tab-ranking" onclick="switchTab('ranking')">
    <i class="fas fa-trophy"></i>업체순위
  </button>
  <button class="tabbtn" id="tab-shops" onclick="switchTab('shops')">
    <i class="fas fa-store"></i>업체
  </button>
  <button class="tabbtn" id="tab-shorts-admin" onclick="switchTab('shorts-admin')">
    <i class="fas fa-bolt" style="font-size:11px"></i>숏폼
  </button>
  <button class="tabbtn" id="tab-inq" onclick="switchTab('inq')">
    <i class="fas fa-envelope"></i>문의
  </button>
  <button class="tabbtn" id="tab-pay" onclick="switchTab('pay')">
    <i class="fas fa-credit-card"></i>구독
  </button>
</div>

<!-- 콘텐츠 -->
<div class="wrap">
  <div id="panel-stats"></div>
  <div id="panel-ranking"     style="display:none"></div>
  <div id="panel-visitors"    style="display:none"></div>
  <div id="panel-shops"       style="display:none"></div>
  <div id="panel-shorts-admin" style="display:none"></div>
  <div id="panel-inq"         style="display:none"></div>
  <div id="panel-pay"         style="display:none"></div>
  <div id="panel-cal"         style="display:none"></div>
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
  ['stats','ranking','shops','pay','inq','cal','shorts-admin','visitors'].forEach(x => {
    const tabEl = document.getElementById('tab-'+x);
    const panEl = document.getElementById('panel-'+x);
    if (tabEl) tabEl.classList.toggle('on', x===t);
    if (panEl) panEl.style.display = x===t ? 'block' : 'none';
  });
  document.querySelector('.add-btn').style.display = t==='shops' ? 'flex' : 'none';
  if (t==='stats')        loadStats();
  if (t==='ranking')      loadRanking();
  if (t==='shops')        renderShops(shopData);
  if (t==='inq')          loadInquiries();
  if (t==='pay')          renderPayTab();
  if (t==='cal')          renderCalendar();
  if (t==='shorts-admin') loadShortsAdmin();
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

  // Cloudinary ID 입력 시 미리보기
  document.getElementById('s-clid').addEventListener('input', function() {
    const clId    = this.value.trim();
    const preview = document.getElementById('s-cl-preview');
    const vid     = document.getElementById('s-cl-vid');
    if (clId) {
      preview.style.display = 'block';
      vid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4';
    } else {
      preview.style.display = 'none';
      vid.src = '';
    }
  });
  // 유튜브 입력 시 미리보기 (fallback)
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
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">Cloudinary Public ID</label>' +
        '<input id="s-clid" placeholder="mybeautymap/shorts/영상ID" style="'+adminInputStyle()+'"/>' +
        '<div style="font-size:10px;color:#475569;margin-top:4px">예: mybeautymap/shorts/zeoiZiOrzS0</div>' +
        '<div id="s-cl-preview" style="margin-top:8px;border-radius:10px;overflow:hidden;display:none;aspect-ratio:9/16;max-height:280px;background:#000"><video id="s-cl-vid" width="100%" height="100%" style="object-fit:cover" controls muted playsinline></video></div></div>' +
        '<div><label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:6px">유튜브 숏츠 ID (기존/백업용)</label>' +
        '<input id="s-ytid" placeholder="https://youtube.com/shorts/xxxxx" style="'+adminInputStyle()+'"/>' +
        '<div style="font-size:10px;color:#475569;margin-top:4px">Cloudinary 없을 때 fallback으로 사용</div>' +
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
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const tabLabel = (t) => ({'shorts':'⚡릴스','feed':'🎬영상','map':'🗺️지도','inquiry':'✉️문의'}[t] || t);

  const total    = sessions.length;
  const nowActive = sessions.filter(x => Date.now() - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const pct = (a,b) => b > 0 ? Math.round(a/b*100) : 0;

  // ── 배지 헬퍼
  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 6px;border-radius:5px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count) > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','⚡'+n(sess.shorts_count)));
    if (n(sess.shorts_book)  > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','릴스예약'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt)> 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','🎬'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt)> 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','영상예약'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','📍'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','지도예약'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)   > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','🔍'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','✉️'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:10px">조용한 방문</span>';
  };

  // ── 세션 카드
  const cards = sessions.map(sess => {
    const isNow  = Date.now() - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur    = fmtSec(sess.duration_sec);
    const device = sess.device === 'mobile' ? '📱' : '🖥️';
    const tabs   = (sess.tabs_visited||[]).map(tabLabel).join(' → ') || '진입만';
    const sid    = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);
    const hasBook = n(sess.book_count) > 0 || n(sess.shorts_book) > 0 || n(sess.feed_book_cnt) > 0 || n(sess.map_book_cnt) > 0;

    return (
      '<div style="border:1px solid rgba(255,255,255,'+(isNow?'.18':'.06')+');border-radius:14px;margin-bottom:7px;overflow:hidden;background:rgba(255,255,255,.02)'+(hasBook?';border-color:rgba(255,77,125,.3)':'')+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.2)':'')+'">' +
        // 카드 헤더 클릭 영역
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:10px 12px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
            '<div style="display:flex;align-items:center;gap:6px">' +
              '<span style="font-size:13px">'+device+'</span>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:12px;font-weight:800;color:#f1f5f9">'+timeStr+'</span>' +
                  '<span style="font-size:10px;color:#475569">'+dateStr+'</span>' +
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 5px;border-radius:4px;font-weight:700;animation:pulse 2s infinite">● 접속중</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-weight:700">🎯예약</span>' : '') +
                '</div>' +
                '<div style="font-size:10px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:11px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:10px;color:'+(totalActs>0?'#818cf8':'#334155')+';background:rgba(99,102,241,.08);padding:1px 6px;border-radius:4px;margin-top:2px">'+totalActs+'행동 ▾</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        // 타임라인 (숨김)
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.25)">' +
          '<div style="font-size:10px;color:#475569">로딩 중...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:40px;color:#334155;font-size:13px">방문자 데이터가 없습니다</div>';

  p.innerHTML =
    '<div style="padding:14px">' +
      // 헤더
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">👁️ 방문자 목록</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">● 지금 '+nowActive+'명</span>' : '') +
          '<button onclick="loadVisitors()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
        '</div>' +
      '</div>' +
      // 미니 KPI
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">' +
        '<div style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#818cf8">'+total+'</div><div style="font-size:9px;color:#64748b">오늘·어제</div></div>' +
        '<div style="background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#34d399">'+nowActive+'</div><div style="font-size:9px;color:#64748b">접속중</div></div>' +
        '<div style="background:rgba(232,121,249,.08);border:1px solid rgba(232,121,249,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#e879f9">'+sessions.filter(x=>Number(x.shorts_count)>0||Number(x.feed_card_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">콘텐츠시청</div></div>' +
        '<div style="background:rgba(255,77,125,.08);border:1px solid rgba(255,77,125,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#FF4D7D">'+sessions.filter(x=>Number(x.book_count)>0||Number(x.shorts_book)>0||Number(x.feed_book_cnt)>0||Number(x.map_book_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">예약클릭</div></div>' +
      '</div>' +
      // 안내
      '<div style="font-size:10px;color:#334155;text-align:right;margin-bottom:8px">▾ 카드 클릭 시 업체별 행동 타임라인</div>' +
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
  document.getElementById('s-name').value   = item?.name                    || '';
  document.getElementById('s-addr').value   = item?.address                 || '';
  document.getElementById('s-place').value  = item?.smart_place_url         || '';
  document.getElementById('s-clid').value   = item?.cloudinary_public_id    || '';
  document.getElementById('s-ytid').value   = item?.youtube_id              || '';
  document.getElementById('s-order').value  = item?.sort_order ?? 0;
  document.getElementById('s-active').checked = item ? item.active : true;
  // 카테고리 select
  const sCat = document.getElementById('s-cat');
  sCat.innerHTML = '<option value="" style="background:#1b1b1b;color:#fff">선택 안함</option>' +
    CAT_OPTIONS.map(c => '<option value="'+c+'" style="background:#1b1b1b;color:#fff"'+(item?.category===c?' selected':'')+'>'+c+'</option>').join('');
  if (!id) sCat.value = '';
  // Cloudinary 미리보기
  const clId = item?.cloudinary_public_id || '';
  const clPreview = document.getElementById('s-cl-preview');
  const clVid     = document.getElementById('s-cl-vid');
  if (clId) {
    clPreview.style.display = 'block';
    clVid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4';
  } else {
    clPreview.style.display = 'none';
    clVid.src = '';
  }
  // YouTube 미리보기 (fallback)
  const ytId   = item?.youtube_id || '';
  const ytPrev = document.getElementById('s-yt-preview');
  const frame  = document.getElementById('s-yt-frame');
  if (ytId && !clId) { ytPrev.style.display='block'; frame.src='https://www.youtube.com/embed/'+ytId+'?rel=0'; }
  else { ytPrev.style.display='none'; frame.src=''; }
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
  const clId  = document.getElementById('s-clid').value.trim();
  const rawYt = document.getElementById('s-ytid').value.trim();
  const ytId  = extractYtId(rawYt) || rawYt;
  if (!clId && !ytId) { toast('Cloudinary ID 또는 유튜브 링크를 입력하세요'); return; }
  const body = {
    name,
    category:             document.getElementById('s-cat').value,
    address:              document.getElementById('s-addr').value.trim(),
    smartPlaceUrl:        document.getElementById('s-place').value.trim(),
    cloudinaryPublicId:   clId,
    youtubeId:            ytId,
    sortOrder:            parseInt(document.getElementById('s-order').value)||0,
    active:               document.getElementById('s-active').checked,
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
  if (curTab==='shops') renderShops(shopData);
  if (curTab==='pay')   renderPayTab();
  if (curTab==='stats') loadStats();
}

// ── 신규: 통계 탭 로드 (방문자 요약 + 일별추이 + 기존stats 병합)
let _visitorSummary = null;
let _dailyTrend = [];
async function loadStats() {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  try {
    const [vs, trend, sessions] = await Promise.all([
      fetch('/api/admin/sessions/summary').then(r=>r.json()),
      fetch('/api/admin/daily-trend').then(r=>r.json()),
      fetch('/api/admin/sessions').then(r=>r.json()),
    ]);
    _visitorSummary = vs;
    _dailyTrend = Array.isArray(trend) ? trend : [];
    _statsSessions = Array.isArray(sessions) ? sessions : [];
    renderStatsTab(vs, _dailyTrend, _statsSessions);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">로드 실패: '+e.message+'</div>';
  }
}
let _statsSessions = [];

// ── 신규: 업체 랭킹 탭 로드
let _rankingData = [];
let _rankingDays = 7;
async function loadRanking(days) {
  if (days) _rankingDays = days;
  const p = document.getElementById('panel-ranking');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  try {
    const data = await fetch('/api/admin/shop-ranking?days='+_rankingDays).then(r=>r.json());
    _rankingData = Array.isArray(data) ? data : [];
    renderRankingTab(_rankingData);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">로드 실패: '+e.message+'</div>';
  }
}

// ======================================================
// 통계 탭 렌더링 (KPI + 1인당평균 + 퍼널 + 7일차트 + 세션카드 통합)
// ======================================================
function renderStatsTab(s, trend, sessions) {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const pct = (a,b) => b>0 ? Math.round(a/b*100) : 0;
  const nowMs = Date.now();

  // ── KPI 4칸
  const total    = n(s.today_total);
  const nowActive = (sessions||[]).filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const kpiSection =
    '<div style="padding:14px 14px 0">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<div style="font-size:16px;font-weight:900;color:#f1f5f9">📊 오늘 통계</div>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">● 지금 '+nowActive+'명</span>' : '') +
        '<button onclick="loadStats()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">' +
      _kpiCard('fa-user-friends','오늘 방문자', n(s.today_total)+'명', '어제 '+n(s.yest_total)+'명 · 7일 '+n(s.week_total)+'명', '#6366f1') +
      _kpiCard('fa-clock','평균 체류시간', fmtSec(n(s.today_avg_sec)), '모바일 '+n(s.today_mobile)+' / PC '+n(s.today_desktop), '#f59e0b') +
      _kpiCard('fa-fire','예약 클릭', n(s.today_booked)+'명', '릴스 '+n(s.sum_shorts_book)+' · 영상 '+n(s.sum_feed_book)+' · 지도 '+n(s.sum_map_book), '#FF4D7D') +
      _kpiCard('fa-mobile-alt','모바일 비율', total>0?Math.round(n(s.today_mobile)/total*100)+'%':'-', '콘텐츠이용 '+n(s.today_watched)+'명', '#e879f9') +
    '</div>' +
    '</div>';

  // ── 1인당 평균 행동량
  const avgSection =
    '<div style="margin:0 14px 10px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(168,85,247,.08));border:1px solid rgba(99,102,241,.25);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="fas fa-chart-bar"></i> 1인당 평균 행동량</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">' +
        _avgChip('⚡ 릴스', n(s.avg_shorts).toFixed(1)+'개', n(s.today_watched)+'명 이용', '#e879f9') +
        _avgChip('🎬 영상', n(s.avg_feed_card).toFixed(1)+'개', n(s.used_feed)+'명 이용', '#818cf8') +
        _avgChip('🗺️ 지도', n(s.avg_map_pin).toFixed(1)+'곳', n(s.used_map)+'명 이용', '#34d399') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">' +
        _miniChip('릴스예약', n(s.sum_shorts_book)+'회', '#FF4D7D') +
        _miniChip('영상예약', n(s.sum_feed_book)+'회', '#FF4D7D') +
        _miniChip('지도예약', n(s.sum_map_book)+'회', '#FF4D7D') +
        _miniChip('🔍검색', n(s.sum_search)+'회', '#fbbf24') +
      '</div>' +
    '</div>';

  // ── 전환 퍼널
  const watched = n(s.today_watched) + n(s.used_feed);
  const mapUsed = n(s.used_map);
  const booked  = n(s.today_booked);
  const funnelSection =
    '<div style="margin:0 14px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px"><i class="fas fa-filter" style="margin-right:5px"></i>전환 퍼널</div>' +
      _funnelRow('👣 진입', total, 100, '#6366f1', '') +
      _funnelRow('📹 콘텐츠 시청', watched, pct(watched,total), '#e879f9', total>0?'진입의 '+pct(watched,total)+'%':'') +
      _funnelRow('🗺️ 지도 탐색', mapUsed, pct(mapUsed,total), '#34d399', watched>0?'시청의 '+pct(mapUsed,watched)+'%':'') +
      _funnelRow('🔍 검색 사용', n(s.sum_search), pct(n(s.sum_search),total), '#fbbf24', '') +
      _funnelRow('🎯 예약 클릭', booked, pct(booked,total), '#FF4D7D', total>0?'진입의 '+pct(booked,total)+'%':'') +
    '</div>';

  // ── 7일 추이 차트
  const trendSection = _buildTrendChart(trend);

  // ── 방문자 세션 카드 (통합)
  const sessSection = _buildSessionCards(sessions || [], s);

  p.innerHTML = kpiSection + avgSection + funnelSection + trendSection + sessSection;
}

// ── 세션 카드 빌더 (통계 탭 하단 통합용)
function _buildSessionCards(sessions, s) {
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const tabLabel = (t) => ({'shorts':'⚡릴스','feed':'🎬영상','map':'🗺️지도','inquiry':'✉️문의'}[t] || t);
  const nowMs = Date.now();
  const nowActive = sessions.filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;

  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count)  > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','⚡'+n(sess.shorts_count)));
    if (n(sess.shorts_book)   > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','릴스예약'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt) > 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','🎬'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','영상예약'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','📍'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt)  > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','지도예약'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)    > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','🔍'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','✉️'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:9px">조용한 방문</span>';
  };

  const cards = sessions.map(sess => {
    const isNow   = nowMs - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur     = fmtSec(sess.duration_sec);
    const device  = sess.device === 'mobile' ? '📱' : '🖥️';
    const tabs    = (sess.tabs_visited||[]).map(tabLabel).join(' → ') || '진입만';
    const sid     = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);
    const hasBook   = n(sess.book_count)>0||n(sess.shorts_book)>0||n(sess.feed_book_cnt)>0||n(sess.map_book_cnt)>0;

    return (
      '<div style="border:1px solid rgba(255,255,255,'+(isNow?'.18':hasBook?'.0':'.05')+');border-radius:12px;margin-bottom:6px;overflow:hidden;background:rgba(255,255,255,.02)'+(hasBook?';border-color:rgba(255,77,125,.28)':'')+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.2)':'')+'">' +
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:10px 12px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
            '<div style="display:flex;align-items:center;gap:5px">' +
              '<span style="font-size:12px">'+device+'</span>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:12px;font-weight:800;color:#f1f5f9">'+timeStr+'</span>' +
                  '<span style="font-size:10px;color:#475569">'+dateStr+'</span>' +
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 4px;border-radius:3px;font-weight:700">● 접속중</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 4px;border-radius:3px;font-weight:700">🎯예약</span>' : '') +
                '</div>' +
                '<div style="font-size:9px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;flex-shrink:0">' +
              '<div style="font-size:10px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:9px;color:'+(totalActs>0?'#818cf8':'#2d3748')+';background:rgba(99,102,241,.07);padding:1px 5px;border-radius:3px;margin-top:1px">'+totalActs+'행동 ▾</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.2)">' +
          '<div style="font-size:10px;color:#475569">로딩 중...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:30px;color:#334155;font-size:12px">오늘·어제 방문자 없음</div>';

  return (
    '<div style="margin:0 14px 14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
        '<div style="font-size:12px;font-weight:800;color:#94a3b8">👁️ 방문자 목록 <span style="font-size:10px;font-weight:500;color:#475569">(오늘·어제 최대 200명)</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.12);color:#34d399;padding:2px 7px;border-radius:10px;font-weight:700">● '+nowActive+'명 접속중</span>' : '') +
          '<span style="font-size:9px;color:#334155">▾클릭 시 타임라인</span>' +
        '</div>' +
      '</div>' +
      cards +
    '</div>'
  );
}

function _avgChip(label, val, sub, color) {
  return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:10px;text-align:center">' +
    '<div style="font-size:10px;color:#64748b;margin-bottom:4px">'+label+'</div>' +
    '<div style="font-size:20px;font-weight:900;color:'+color+'">'+val+'</div>' +
    '<div style="font-size:9px;color:#475569;margin-top:3px">'+sub+'</div>' +
  '</div>';
}

function _miniChip(label, val, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:6px;text-align:center">' +
    '<div style="font-size:9px;color:#475569;margin-bottom:2px">'+label+'</div>' +
    '<div style="font-size:13px;font-weight:800;color:'+color+'">'+val+'</div>' +
  '</div>';
}

function _funnelRow(label, count, pctVal, color, sub) {
  return '<div style="margin-bottom:8px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">' +
      '<span style="font-size:11px;color:#cbd5e1">'+label+'</span>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        (sub ? '<span style="font-size:9px;color:#475569">'+sub+'</span>' : '') +
        '<span style="font-size:12px;font-weight:700;color:'+color+'">'+count+'명 <span style="font-size:10px;font-weight:500;color:#64748b">'+pctVal+'%</span></span>' +
      '</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,.06);border-radius:6px;height:8px;overflow:hidden">' +
      '<div style="width:'+pctVal+'%;height:100%;background:'+color+';border-radius:6px;transition:width .5s"></div>' +
    '</div>' +
  '</div>';
}

function _buildTrendChart(trend) {
  if (!trend || !trend.length) return '<div style="margin:0 14px 10px;padding:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;text-align:center;color:#334155;font-size:12px">7일 추이 데이터 없음</div>';
  const maxVal = Math.max(...trend.map(r => r.total), 1);
  const days = ['일','월','화','수','목','금','토'];
  const bars = trend.map(r => {
    const h = Math.max(4, Math.round(r.total/maxVal*80));
    const d = new Date(r.day);
    const dayLabel = (d.getMonth()+1)+'/'+(d.getDate())+'<br><span style="font-size:8px;color:#475569">'+days[d.getDay()]+'</span>';
    const bookBar = r.total>0 ? Math.round(r.booked/r.total*h) : 0;
    return '<div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:3px">' +
      '<div style="font-size:9px;color:#6366f1;font-weight:700">'+(r.total||0)+'</div>' +
      '<div style="width:100%;max-width:28px;height:80px;display:flex;flex-direction:column;justify-content:flex-end;gap:1px">' +
        '<div style="width:100%;border-radius:4px 4px 0 0;background:rgba(255,77,125,.7);height:'+bookBar+'px"></div>' +
        '<div style="width:100%;border-radius:4px 4px 0 0;background:#6366f1;height:'+(h-bookBar)+'px"></div>' +
      '</div>' +
      '<div style="font-size:9px;color:#64748b;text-align:center;line-height:1.2">'+dayLabel+'</div>' +
    '</div>';
  }).join('');
  const legend =
    '<div style="display:flex;gap:10px;justify-content:flex-end;margin-bottom:6px">' +
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#6366f1;border-radius:2px"></div><span style="font-size:9px;color:#64748b">방문</span></div>' +
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:rgba(255,77,125,.7);border-radius:2px"></div><span style="font-size:9px;color:#64748b">예약클릭</span></div>' +
    '</div>';
  return '<div style="margin:0 14px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
    '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px"><i class="fas fa-chart-bar" style="margin-right:5px"></i>7일 방문 추이</div>' +
    legend +
    '<div style="display:flex;align-items:flex-end;gap:4px;height:96px">'+bars+'</div>' +
  '</div>';
}

// ======================================================
// 업체 랭킹 탭 렌더링
// ======================================================
function renderRankingTab(data) {
  const p = document.getElementById('panel-ranking');
  if (!p) return;

  const fmtSec = (s) => { s=Number(s)||0; if(!s) return '-'; if(s<60) return s+'초'; return Math.floor(s/60)+'분'+(s%60?+(s%60)+'초':''); };
  const dayBtns =
    '<div style="display:flex;gap:6px;margin-bottom:12px">' +
      [['7일','7'],['30일','30'],['전체','365']].map(([label,d]) =>
        '<button onclick="loadRanking('+d+')" style="flex:1;padding:7px;border:1px solid rgba(255,255,255,'+(String(_rankingDays)===d?'.3':'.08')+');border-radius:8px;background:rgba(255,255,255,'+(String(_rankingDays)===d?'.1':'.03')+');color:'+(String(_rankingDays)===d?'#f1f5f9':'#64748b')+';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">'+label+'</button>'
      ).join('') +
    '</div>';

  if (!data.length) {
    p.innerHTML = '<div style="padding:14px">'+dayBtns+'<div style="padding:40px;text-align:center;color:#334155;font-size:13px">업체 행동 데이터가 없습니다<br><span style="font-size:11px;color:#475569">방문자가 업체를 조회하면 여기에 표시됩니다</span></div></div>';
    return;
  }

  // 상위 3개 하이라이트
  const top3 = data.slice(0,3);
  const medals = ['🥇','🥈','🥉'];
  const top3Html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">' +
    top3.map((shop, i) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,'+(i===0?'.2':'.08')+');border-radius:14px;padding:12px;text-align:center'+(i===0?';box-shadow:0 0 0 1px rgba(251,191,36,.2)':'')+'">' +
        '<div style="font-size:18px">'+medals[i]+'</div>' +
        '<div style="font-size:11px;font-weight:800;color:#f1f5f9;margin:4px 0;line-height:1.3">'+shop.shop_name+'</div>' +
        '<div style="font-size:9px;color:#64748b;margin-bottom:5px">'+shop.shop_cat+'</div>' +
        '<div style="font-size:16px;font-weight:900;color:#e879f9">'+shop.view_cnt+'</div>' +
        '<div style="font-size:9px;color:#64748b">총 조회</div>' +
        '<div style="margin-top:5px;font-size:10px;color:#FF4D7D;font-weight:700">'+(shop.book_cnt>0?'🎯 예약'+shop.book_cnt+'회':'')+'</div>' +
      '</div>'
    ).join('') +
  '</div>';

  // 전체 순위 테이블
  const maxView = Math.max(...data.map(r => r.view_cnt), 1);
  const rows = data.map((shop, i) => {
    const convRate = shop.uniq_sessions > 0 ? Math.round(shop.book_cnt/shop.uniq_sessions*100) : 0;
    const barW = Math.round(shop.view_cnt/maxView*100);
    const catColors = {'마사지':'#e879f9','헤드스파':'#818cf8','피부관리':'#34d399','헤어':'#fbbf24','메이크업':'#f87171','왁싱':'#fb923c','반영구':'#a78bfa','병원':'#38bdf8','그외':'#64748b'};
    const catColor = catColors[shop.shop_cat] || '#64748b';
    return '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)'+(i===data.length-1?';border-bottom:none':'')+'">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
        '<span style="font-size:12px;font-weight:900;color:'+(i<3?'#fbbf24':'#475569');+';width:18px;flex-shrink:0">'+(i+1)+'</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
            '<span style="font-size:12px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+shop.shop_name+'</span>' +
            '<span style="font-size:9px;background:'+catColor+'22;color:'+catColor+';padding:1px 5px;border-radius:4px;flex-shrink:0">'+shop.shop_cat+'</span>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:4px;overflow:hidden">' +
            '<div style="width:'+barW+'%;height:100%;background:linear-gradient(90deg,#6366f1,#e879f9);border-radius:3px"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:13px;font-weight:800;color:#e879f9">'+shop.view_cnt+'</div>' +
          '<div style="font-size:9px;color:#475569">조회</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;padding-left:26px">' +
        '<span style="font-size:10px;background:rgba(232,121,249,.1);color:#e879f9;padding:1px 6px;border-radius:4px">⚡릴스 '+shop.shorts_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(99,102,241,.1);color:#818cf8;padding:1px 6px;border-radius:4px">🎬영상 '+shop.feed_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(52,211,153,.1);color:#34d399;padding:1px 6px;border-radius:4px">📍지도 '+shop.map_cnt+'</span>' +
        (shop.book_cnt>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.15);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:700">🎯예약 '+shop.book_cnt+'회</span>' : '') +
        '<span style="font-size:10px;background:rgba(255,255,255,.05);color:#64748b;padding:1px 6px;border-radius:4px">👥'+shop.uniq_sessions+'명</span>' +
        (shop.total_view_sec>0 ? '<span style="font-size:10px;background:rgba(251,191,36,.1);color:#fbbf24;padding:1px 6px;border-radius:4px">⏱'+fmtSec(shop.total_view_sec)+'</span>' : '') +
        (convRate>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:800">전환 '+convRate+'%</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  p.innerHTML =
    '<div style="padding:14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">🏆 업체 인기 순위</div>' +
        '<button onclick="loadRanking()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
      dayBtns +
      (data.length >= 3 ? top3Html : '') +
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">전체 순위 ('+data.length+'개 업체)</div>' +
        rows +
      '</div>' +
    '</div>';
}

// ======================================================
// 대시보드 탭 (기존 유지 — loadAll에서 호출)
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
loadStats();
setInterval(() => {
  loadAll();
  if (curTab === 'stats')   loadStats();
  if (curTab === 'ranking') loadRanking();
}, 30000);
<\/script>
</body>
</html>`}const ei=new _i,Cn=Object.assign({"/src/index.tsx":$});let xr=!1;for(const[,t]of Object.entries(Cn))t&&(ei.route("/",t),ei.notFound(t.notFoundHandler),xr=!0);if(!xr)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{ei as default};
