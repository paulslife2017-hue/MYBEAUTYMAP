// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler2;
      if (middleware[i]) {
        handler2 = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler2 = i === middleware.length && next || void 0;
      }
      if (handler2) {
        try {
          res = await handler2(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path2) => {
  const paths = path2.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path2 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path2);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path2) => {
  const groups = [];
  path2 = path2.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path: path2 };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path2 = url.slice(start, end);
      return tryDecodeURI(path2.includes("%25") ? path2.replace(/%25/g, "%2525") : path2);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path2) => {
  if (path2.charCodeAt(path2.length - 1) !== 63 || !path2.includes(":")) {
    return null;
  }
  const segments = path2.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v2, i, a2) => a2.indexOf(v2) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path2 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path2;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v2] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v2);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v2] of Object.entries(headers)) {
        if (typeof v2 === "string") {
          responseHeaders.set(k, v2);
        } else {
          responseHeaders.delete(k);
          for (const v22 of v2) {
            responseHeaders.append(k, v22);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler2) => {
          this.#addRoute(method, this.#path, handler2);
        });
        return this;
      };
    });
    this.on = (method, path2, ...handlers) => {
      for (const p2 of [path2].flat()) {
        this.#path = p2;
        for (const m2 of [method].flat()) {
          handlers.map((handler2) => {
            this.#addRoute(m2.toUpperCase(), this.#path, handler2);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler2) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler2);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path2, app2) {
    const subApp = this.basePath(path2);
    app2.routes.map((r) => {
      let handler2;
      if (app2.errorHandler === errorHandler) {
        handler2 = r.handler;
      } else {
        handler2 = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler2);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path2) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path2);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler2) => {
    this.errorHandler = handler2;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler2) => {
    this.#notFoundHandler = handler2;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path2, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path2);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler2 = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path2, "*"), handler2);
    return this;
  }
  #addRoute(method, path2, handler2) {
    method = method.toUpperCase();
    path2 = mergePath(this._basePath, path2);
    const r = { basePath: this._basePath, path: path2, method, handler: handler2 };
    this.router.add(method, path2, [handler2, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path2 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path2);
    const c = new Context(request, {
      path: path2,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path2) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path22) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path22];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path22.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path2);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a2, b2) {
  if (a2.length === 1) {
    return b2.length === 1 ? a2 < b2 ? -1 : 1 : -1;
  }
  if (b2.length === 1) {
    return 1;
  }
  if (a2 === ONLY_WILDCARD_REG_EXP_STR || a2 === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b2 === ONLY_WILDCARD_REG_EXP_STR || b2 === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a2 === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b2 === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a2.length === b2.length ? a2 < b2 ? -1 : 1 : b2.length - a2.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path2, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path2 = path2.replace(/\{[^}]+\}/g, (m2) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m2];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path2) {
  return wildcardRegExpCache[path2] ??= new RegExp(
    path2 === "*" ? "" : `^${path2.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path2, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path2] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path2, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path2) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path2) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a2, b2) => b2.length - a2.length)) {
    if (buildWildcardRegExp(k).test(path2)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path2, handler2) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p2) => {
          handlerMap[method][p2] = [...handlerMap[METHOD_NAME_ALL][p2]];
        });
      });
    }
    if (path2 === "/*") {
      path2 = "*";
    }
    const paramCount = (path2.match(/\/:/g) || []).length;
    if (/\*$/.test(path2)) {
      const re = buildWildcardRegExp(path2);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m2) => {
          middleware[m2][path2] ||= findMiddleware(middleware[m2], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        });
      } else {
        middleware[method][path2] ||= findMiddleware(middleware[method], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
      }
      Object.keys(middleware).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(middleware[m2]).forEach((p2) => {
            re.test(p2) && middleware[m2][p2].push([handler2, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(routes[m2]).forEach(
            (p2) => re.test(p2) && routes[m2][p2].push([handler2, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path2) || [path2];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          routes[m2][path22] ||= [
            ...findMiddleware(middleware[m2], path22) || findMiddleware(middleware[METHOD_NAME_ALL], path22) || []
          ];
          routes[m2][path22].push([handler2, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path2) => [path2, r[method][path2]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path2) => [path2, r[METHOD_NAME_ALL][path2]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path2, handler2) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path2, handler2]);
  }
  match(method, path2) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path2);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler2, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler2) {
      const m2 = /* @__PURE__ */ Object.create(null);
      m2[method] = { handler: handler2, possibleKeys: [], score: 0 };
      this.#methods = [m2];
    }
    this.#patterns = [];
  }
  insert(method, path2, handler2) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path2);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p2 = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p2, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p2;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler: handler2,
        possibleKeys: possibleKeys.filter((v2, i, a2) => a2.indexOf(v2) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m2 = node.#methods[i];
      const handlerSet = m2[method] || m2[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path2) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path2);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path2[0] === "/" ? 1 : 0;
              for (let p2 = 0; p2 < len; p2++) {
                partOffsets[p2] = offset;
                offset += parts[p2].length + 1;
              }
            }
            const restPathString = path2.substring(partOffsets[i]);
            const m2 = matcher.exec(restPathString);
            if (m2) {
              params[name] = m2[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m2[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a2, b2) => {
        return a2.score - b2.score;
      });
    }
    return [handlerSets.map(({ handler: handler2, params }) => [handler2, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path2, handler2) {
    const results = checkOptionalParameter(path2);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler2);
      }
      return;
    }
    this.#node.insert(method, path2, handler2);
  }
  match(method, path2) {
    return this.#node.search(method, path2);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/@neondatabase/serverless/index.mjs
var So = Object.create;
var Ie = Object.defineProperty;
var Eo = Object.getOwnPropertyDescriptor;
var Ao = Object.getOwnPropertyNames;
var Co = Object.getPrototypeOf;
var _o = Object.prototype.hasOwnProperty;
var Io = (r, e, t) => e in r ? Ie(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
var a = (r, e) => Ie(r, "name", { value: e, configurable: true });
var G = (r, e) => () => (r && (e = r(r = 0)), e);
var T = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var ie = (r, e) => {
  for (var t in e) Ie(r, t, {
    get: e[t],
    enumerable: true
  });
};
var Dn = (r, e, t, n) => {
  if (e && typeof e == "object" || typeof e == "function") for (let i of Ao(e)) !_o.call(r, i) && i !== t && Ie(r, i, { get: () => e[i], enumerable: !(n = Eo(e, i)) || n.enumerable });
  return r;
};
var Se = (r, e, t) => (t = r != null ? So(Co(r)) : {}, Dn(e || !r || !r.__esModule ? Ie(t, "default", { value: r, enumerable: true }) : t, r));
var O = (r) => Dn(Ie({}, "__esModule", { value: true }), r);
var E = (r, e, t) => Io(r, typeof e != "symbol" ? e + "" : e, t);
var Qn = T((lt) => {
  "use strict";
  p();
  lt.byteLength = Po;
  lt.toByteArray = Bo;
  lt.fromByteArray = ko;
  var ae = [], te = [], To = typeof Uint8Array < "u" ? Uint8Array : Array, qt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (Ee = 0, On = qt.length; Ee < On; ++Ee) ae[Ee] = qt[Ee], te[qt.charCodeAt(Ee)] = Ee;
  var Ee, On;
  te[45] = 62;
  te[95] = 63;
  function qn(r) {
    var e = r.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var t = r.indexOf("=");
    t === -1 && (t = e);
    var n = t === e ? 0 : 4 - t % 4;
    return [t, n];
  }
  a(qn, "getLens");
  function Po(r) {
    var e = qn(r), t = e[0], n = e[1];
    return (t + n) * 3 / 4 - n;
  }
  a(Po, "byteLength");
  function Ro(r, e, t) {
    return (e + t) * 3 / 4 - t;
  }
  a(Ro, "_byteLength");
  function Bo(r) {
    var e, t = qn(r), n = t[0], i = t[1], s = new To(Ro(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
    for (c = 0; c < u; c += 4) e = te[r.charCodeAt(c)] << 18 | te[r.charCodeAt(c + 1)] << 12 | te[r.charCodeAt(c + 2)] << 6 | te[r.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
    return i === 2 && (e = te[r.charCodeAt(
      c
    )] << 2 | te[r.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = te[r.charCodeAt(c)] << 10 | te[r.charCodeAt(c + 1)] << 4 | te[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
  }
  a(Bo, "toByteArray");
  function Lo(r) {
    return ae[r >> 18 & 63] + ae[r >> 12 & 63] + ae[r >> 6 & 63] + ae[r & 63];
  }
  a(Lo, "tripletToBase64");
  function Fo(r, e, t) {
    for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(Lo(n));
    return i.join("");
  }
  a(Fo, "encodeChunk");
  function ko(r) {
    for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s) i.push(Fo(
      r,
      o,
      o + s > u ? u : o + s
    ));
    return n === 1 ? (e = r[t - 1], i.push(ae[e >> 2] + ae[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(ae[e >> 10] + ae[e >> 4 & 63] + ae[e << 2 & 63] + "=")), i.join("");
  }
  a(ko, "fromByteArray");
});
var Nn = T((Qt) => {
  p();
  Qt.read = function(r, e, t, n, i) {
    var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, l = c >> 1, f = -7, y = t ? i - 1 : 0, g = t ? -1 : 1, A = r[e + y];
    for (y += g, s = A & (1 << -f) - 1, A >>= -f, f += u; f > 0; s = s * 256 + r[e + y], y += g, f -= 8) ;
    for (o = s & (1 << -f) - 1, s >>= -f, f += n; f > 0; o = o * 256 + r[e + y], y += g, f -= 8) ;
    if (s === 0) s = 1 - l;
    else {
      if (s === c) return o ? NaN : (A ? -1 : 1) * (1 / 0);
      o = o + Math.pow(2, n), s = s - l;
    }
    return (A ? -1 : 1) * o * Math.pow(2, s - n);
  };
  Qt.write = function(r, e, t, n, i, s) {
    var o, u, c, l = s * 8 - i - 1, f = (1 << l) - 1, y = f >> 1, g = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, A = n ? 0 : s - 1, C = n ? 1 : -1, D = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = f) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + y >= 1 ? e += g / c : e += g * Math.pow(2, 1 - y), e * c >= 2 && (o++, c /= 2), o + y >= f ? (u = 0, o = f) : o + y >= 1 ? (u = (e * c - 1) * Math.pow(2, i), o = o + y) : (u = e * Math.pow(2, y - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + A] = u & 255, A += C, u /= 256, i -= 8) ;
    for (o = o << i | u, l += i; l > 0; r[t + A] = o & 255, A += C, o /= 256, l -= 8) ;
    r[t + A - C] |= D * 128;
  };
});
var ii = T((Be) => {
  "use strict";
  p();
  var Nt = Qn(), Pe = Nn(), Wn = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  Be.Buffer = h;
  Be.SlowBuffer = Qo;
  Be.INSPECT_MAX_BYTES = 50;
  var ft = 2147483647;
  Be.kMaxLength = ft;
  h.TYPED_ARRAY_SUPPORT = Mo();
  !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function Mo() {
    try {
      let r = new Uint8Array(1), e = { foo: a(function() {
        return 42;
      }, "foo") };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42;
    } catch {
      return false;
    }
  }
  a(Mo, "typedArraySupport");
  Object.defineProperty(h.prototype, "parent", { enumerable: true, get: a(function() {
    if (h.isBuffer(this)) return this.buffer;
  }, "get") });
  Object.defineProperty(h.prototype, "offset", { enumerable: true, get: a(function() {
    if (h.isBuffer(
      this
    )) return this.byteOffset;
  }, "get") });
  function he(r) {
    if (r > ft) throw new RangeError('The value "' + r + '" is invalid for option "size"');
    let e = new Uint8Array(r);
    return Object.setPrototypeOf(e, h.prototype), e;
  }
  a(he, "createBuffer");
  function h(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string") throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      );
      return $t(r);
    }
    return Gn(r, e, t);
  }
  a(h, "Buffer");
  h.poolSize = 8192;
  function Gn(r, e, t) {
    if (typeof r == "string") return Do(r, e);
    if (ArrayBuffer.isView(r)) return Oo(r);
    if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
    if (ue(r, ArrayBuffer) || r && ue(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(r, SharedArrayBuffer) || r && ue(
      r.buffer,
      SharedArrayBuffer
    ))) return jt(r, e, t);
    if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    let n = r.valueOf && r.valueOf();
    if (n != null && n !== r) return h.from(n, e, t);
    let i = qo(r);
    if (i) return i;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return h.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
  }
  a(Gn, "from");
  h.from = function(r, e, t) {
    return Gn(r, e, t);
  };
  Object.setPrototypeOf(
    h.prototype,
    Uint8Array.prototype
  );
  Object.setPrototypeOf(h, Uint8Array);
  function Vn(r) {
    if (typeof r != "number") throw new TypeError(
      '"size" argument must be of type number'
    );
    if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  a(Vn, "assertSize");
  function Uo(r, e, t) {
    return Vn(r), r <= 0 ? he(r) : e !== void 0 ? typeof t == "string" ? he(r).fill(e, t) : he(r).fill(e) : he(r);
  }
  a(Uo, "alloc");
  h.alloc = function(r, e, t) {
    return Uo(r, e, t);
  };
  function $t(r) {
    return Vn(r), he(r < 0 ? 0 : Gt(r) | 0);
  }
  a($t, "allocUnsafe");
  h.allocUnsafe = function(r) {
    return $t(
      r
    );
  };
  h.allocUnsafeSlow = function(r) {
    return $t(r);
  };
  function Do(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !h.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
    let t = zn(r, e) | 0, n = he(t), i = n.write(
      r,
      e
    );
    return i !== t && (n = n.slice(0, i)), n;
  }
  a(Do, "fromString");
  function Wt(r) {
    let e = r.length < 0 ? 0 : Gt(r.length) | 0, t = he(e);
    for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
    return t;
  }
  a(Wt, "fromArrayLike");
  function Oo(r) {
    if (ue(r, Uint8Array)) {
      let e = new Uint8Array(r);
      return jt(e.buffer, e.byteOffset, e.byteLength);
    }
    return Wt(r);
  }
  a(Oo, "fromArrayView");
  function jt(r, e, t) {
    if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(
      r,
      e,
      t
    ), Object.setPrototypeOf(n, h.prototype), n;
  }
  a(jt, "fromArrayBuffer");
  function qo(r) {
    if (h.isBuffer(r)) {
      let e = Gt(r.length) | 0, t = he(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0) return typeof r.length != "number" || zt(r.length) ? he(0) : Wt(r);
    if (r.type === "Buffer" && Array.isArray(r.data)) return Wt(r.data);
  }
  a(qo, "fromObject");
  function Gt(r) {
    if (r >= ft) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ft.toString(16) + " bytes");
    return r | 0;
  }
  a(Gt, "checked");
  function Qo(r) {
    return +r != r && (r = 0), h.alloc(+r);
  }
  a(Qo, "SlowBuffer");
  h.isBuffer = a(function(e) {
    return e != null && e._isBuffer === true && e !== h.prototype;
  }, "isBuffer");
  h.compare = a(function(e, t) {
    if (ue(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), ue(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(e) || !h.isBuffer(t)) throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    );
    if (e === t) return 0;
    let n = e.length, i = t.length;
    for (let s = 0, o = Math.min(n, i); s < o; ++s) if (e[s] !== t[s]) {
      n = e[s], i = t[s];
      break;
    }
    return n < i ? -1 : i < n ? 1 : 0;
  }, "compare");
  h.isEncoding = a(function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, "isEncoding");
  h.concat = a(function(e, t) {
    if (!Array.isArray(e)) throw new TypeError(
      '"list" argument must be an Array of Buffers'
    );
    if (e.length === 0) return h.alloc(0);
    let n;
    if (t === void 0)
      for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
    let i = h.allocUnsafe(t), s = 0;
    for (n = 0; n < e.length; ++n) {
      let o = e[n];
      if (ue(o, Uint8Array)) s + o.length > i.length ? (h.isBuffer(o) || (o = h.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
      else if (h.isBuffer(o)) o.copy(i, s);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      s += o.length;
    }
    return i;
  }, "concat");
  function zn(r, e) {
    if (h.isBuffer(r)) return r.length;
    if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer)) return r.byteLength;
    if (typeof r != "string") throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
    );
    let t = r.length, n = arguments.length > 2 && arguments[2] === true;
    if (!n && t === 0) return 0;
    let i = false;
    for (; ; ) switch (e) {
      case "ascii":
      case "latin1":
      case "binary":
        return t;
      case "utf8":
      case "utf-8":
        return Ht(r).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return t * 2;
      case "hex":
        return t >>> 1;
      case "base64":
        return ni(r).length;
      default:
        if (i) return n ? -1 : Ht(r).length;
        e = ("" + e).toLowerCase(), i = true;
    }
  }
  a(zn, "byteLength");
  h.byteLength = zn;
  function No(r, e, t) {
    let n = false;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
    for (r || (r = "utf8"); ; ) switch (r) {
      case "hex":
        return Zo(this, e, t);
      case "utf8":
      case "utf-8":
        return Yn(this, e, t);
      case "ascii":
        return Ko(this, e, t);
      case "latin1":
      case "binary":
        return Yo(
          this,
          e,
          t
        );
      case "base64":
        return Vo(this, e, t);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Jo(
          this,
          e,
          t
        );
      default:
        if (n) throw new TypeError("Unknown encoding: " + r);
        r = (r + "").toLowerCase(), n = true;
    }
  }
  a(
    No,
    "slowToString"
  );
  h.prototype._isBuffer = true;
  function Ae(r, e, t) {
    let n = r[e];
    r[e] = r[t], r[t] = n;
  }
  a(Ae, "swap");
  h.prototype.swap16 = a(function() {
    let e = this.length;
    if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2) Ae(this, t, t + 1);
    return this;
  }, "swap16");
  h.prototype.swap32 = a(function() {
    let e = this.length;
    if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4) Ae(this, t, t + 3), Ae(this, t + 1, t + 2);
    return this;
  }, "swap32");
  h.prototype.swap64 = a(
    function() {
      let e = this.length;
      if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let t = 0; t < e; t += 8) Ae(this, t, t + 7), Ae(this, t + 1, t + 6), Ae(this, t + 2, t + 5), Ae(this, t + 3, t + 4);
      return this;
    },
    "swap64"
  );
  h.prototype.toString = a(function() {
    let e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? Yn(
      this,
      0,
      e
    ) : No.apply(this, arguments);
  }, "toString");
  h.prototype.toLocaleString = h.prototype.toString;
  h.prototype.equals = a(function(e) {
    if (!h.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? true : h.compare(this, e) === 0;
  }, "equals");
  h.prototype.inspect = a(function() {
    let e = "", t = Be.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, "inspect");
  Wn && (h.prototype[Wn] = h.prototype.inspect);
  h.prototype.compare = a(function(e, t, n, i, s) {
    if (ue(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
    if (i >= s && t >= n) return 0;
    if (i >= s) return -1;
    if (t >= n) return 1;
    if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
    let o = s - i, u = n - t, c = Math.min(o, u), l = this.slice(
      i,
      s
    ), f = e.slice(t, n);
    for (let y = 0; y < c; ++y) if (l[y] !== f[y]) {
      o = l[y], u = f[y];
      break;
    }
    return o < u ? -1 : u < o ? 1 : 0;
  }, "compare");
  function Kn(r, e, t, n, i) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, zt(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (i) return -1;
      t = r.length - 1;
    } else if (t < 0) if (i) t = 0;
    else return -1;
    if (typeof e == "string" && (e = h.from(
      e,
      n
    )), h.isBuffer(e)) return e.length === 0 ? -1 : jn(r, e, t, n, i);
    if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : jn(r, [e], t, n, i);
    throw new TypeError("val must be string, number or Buffer");
  }
  a(Kn, "bidirectionalIndexOf");
  function jn(r, e, t, n, i) {
    let s = 1, o = r.length, u = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2) return -1;
      s = 2, o /= 2, u /= 2, t /= 2;
    }
    function c(f, y) {
      return s === 1 ? f[y] : f.readUInt16BE(y * s);
    }
    a(c, "read");
    let l;
    if (i) {
      let f = -1;
      for (l = t; l < o; l++) if (c(r, l) === c(e, f === -1 ? 0 : l - f)) {
        if (f === -1 && (f = l), l - f + 1 === u) return f * s;
      } else f !== -1 && (l -= l - f), f = -1;
    } else for (t + u > o && (t = o - u), l = t; l >= 0; l--) {
      let f = true;
      for (let y = 0; y < u; y++) if (c(r, l + y) !== c(e, y)) {
        f = false;
        break;
      }
      if (f) return l;
    }
    return -1;
  }
  a(jn, "arrayIndexOf");
  h.prototype.includes = a(function(e, t, n) {
    return this.indexOf(
      e,
      t,
      n
    ) !== -1;
  }, "includes");
  h.prototype.indexOf = a(function(e, t, n) {
    return Kn(this, e, t, n, true);
  }, "indexOf");
  h.prototype.lastIndexOf = a(function(e, t, n) {
    return Kn(this, e, t, n, false);
  }, "lastIndexOf");
  function Wo(r, e, t, n) {
    t = Number(t) || 0;
    let i = r.length - t;
    n ? (n = Number(n), n > i && (n = i)) : n = i;
    let s = e.length;
    n > s / 2 && (n = s / 2);
    let o;
    for (o = 0; o < n; ++o) {
      let u = parseInt(e.substr(o * 2, 2), 16);
      if (zt(u)) return o;
      r[t + o] = u;
    }
    return o;
  }
  a(Wo, "hexWrite");
  function jo(r, e, t, n) {
    return ht(Ht(e, r.length - t), r, t, n);
  }
  a(jo, "utf8Write");
  function Ho(r, e, t, n) {
    return ht(ra(e), r, t, n);
  }
  a(
    Ho,
    "asciiWrite"
  );
  function $o(r, e, t, n) {
    return ht(ni(e), r, t, n);
  }
  a($o, "base64Write");
  function Go(r, e, t, n) {
    return ht(
      na(e, r.length - t),
      r,
      t,
      n
    );
  }
  a(Go, "ucs2Write");
  h.prototype.write = a(function(e, t, n, i) {
    if (t === void 0) i = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    let s = this.length - t;
    if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    i || (i = "utf8");
    let o = false;
    for (; ; ) switch (i) {
      case "hex":
        return Wo(this, e, t, n);
      case "utf8":
      case "utf-8":
        return jo(this, e, t, n);
      case "ascii":
      case "latin1":
      case "binary":
        return Ho(this, e, t, n);
      case "base64":
        return $o(this, e, t, n);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Go(this, e, t, n);
      default:
        if (o) throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = true;
    }
  }, "write");
  h.prototype.toJSON = a(function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  }, "toJSON");
  function Vo(r, e, t) {
    return e === 0 && t === r.length ? Nt.fromByteArray(r) : Nt.fromByteArray(r.slice(e, t));
  }
  a(Vo, "base64Slice");
  function Yn(r, e, t) {
    t = Math.min(r.length, t);
    let n = [], i = e;
    for (; i < t; ) {
      let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
      if (i + u <= t) {
        let c, l, f, y;
        switch (u) {
          case 1:
            s < 128 && (o = s);
            break;
          case 2:
            c = r[i + 1], (c & 192) === 128 && (y = (s & 31) << 6 | c & 63, y > 127 && (o = y));
            break;
          case 3:
            c = r[i + 1], l = r[i + 2], (c & 192) === 128 && (l & 192) === 128 && (y = (s & 15) << 12 | (c & 63) << 6 | l & 63, y > 2047 && (y < 55296 || y > 57343) && (o = y));
            break;
          case 4:
            c = r[i + 1], l = r[i + 2], f = r[i + 3], (c & 192) === 128 && (l & 192) === 128 && (f & 192) === 128 && (y = (s & 15) << 18 | (c & 63) << 12 | (l & 63) << 6 | f & 63, y > 65535 && y < 1114112 && (o = y));
        }
      }
      o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
    }
    return zo(n);
  }
  a(Yn, "utf8Slice");
  var Hn = 4096;
  function zo(r) {
    let e = r.length;
    if (e <= Hn) return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; ) t += String.fromCharCode.apply(String, r.slice(n, n += Hn));
    return t;
  }
  a(zo, "decodeCodePointsArray");
  function Ko(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
    return n;
  }
  a(Ko, "asciiSlice");
  function Yo(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
    return n;
  }
  a(Yo, "latin1Slice");
  function Zo(r, e, t) {
    let n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let i = "";
    for (let s = e; s < t; ++s) i += ia[r[s]];
    return i;
  }
  a(Zo, "hexSlice");
  function Jo(r, e, t) {
    let n = r.slice(e, t), i = "";
    for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
    return i;
  }
  a(Jo, "utf16leSlice");
  h.prototype.slice = a(function(e, t) {
    let n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    let i = this.subarray(e, t);
    return Object.setPrototypeOf(i, h.prototype), i;
  }, "slice");
  function q(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError("Trying to access beyond buffer length");
  }
  a(q, "checkOffset");
  h.prototype.readUintLE = h.prototype.readUIntLE = a(
    function(e, t, n) {
      e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
      let i = this[e], s = 1, o = 0;
      for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
      return i;
    },
    "readUIntLE"
  );
  h.prototype.readUintBE = h.prototype.readUIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(
      e,
      t,
      this.length
    );
    let i = this[e + --t], s = 1;
    for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
    return i;
  }, "readUIntBE");
  h.prototype.readUint8 = h.prototype.readUInt8 = a(
    function(e, t) {
      return e = e >>> 0, t || q(e, 1, this.length), this[e];
    },
    "readUInt8"
  );
  h.prototype.readUint16LE = h.prototype.readUInt16LE = a(function(e, t) {
    return e = e >>> 0, t || q(
      e,
      2,
      this.length
    ), this[e] | this[e + 1] << 8;
  }, "readUInt16LE");
  h.prototype.readUint16BE = h.prototype.readUInt16BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, "readUInt16BE");
  h.prototype.readUint32LE = h.prototype.readUInt32LE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, "readUInt32LE");
  h.prototype.readUint32BE = h.prototype.readUInt32BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, "readUInt32BE");
  h.prototype.readBigUInt64LE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(i) + (BigInt(s) << BigInt(32));
  }, "readBigUInt64LE"));
  h.prototype.readBigUInt64BE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(s);
  }, "readBigUInt64BE"));
  h.prototype.readIntLE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(
      e,
      t,
      this.length
    );
    let i = this[e], s = 1, o = 0;
    for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
    return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
  }, "readIntLE");
  h.prototype.readIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
    let i = t, s = 1, o = this[e + --i];
    for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
    return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
  }, "readIntBE");
  h.prototype.readInt8 = a(function(e, t) {
    return e = e >>> 0, t || q(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, "readInt8");
  h.prototype.readInt16LE = a(function(e, t) {
    e = e >>> 0, t || q(
      e,
      2,
      this.length
    );
    let n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16LE");
  h.prototype.readInt16BE = a(function(e, t) {
    e = e >>> 0, t || q(e, 2, this.length);
    let n = this[e + 1] | this[e] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16BE");
  h.prototype.readInt32LE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, "readInt32LE");
  h.prototype.readInt32BE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, "readInt32BE");
  h.prototype.readBigInt64LE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(i) << BigInt(
      32
    )) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }, "readBigInt64LE"));
  h.prototype.readBigInt64BE = we(a(function(e) {
    e = e >>> 0, Re(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && je(e, this.length - 8);
    let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(i) << BigInt(32)) + BigInt(
      this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
    );
  }, "readBigInt64BE"));
  h.prototype.readFloatLE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, true, 23, 4);
  }, "readFloatLE");
  h.prototype.readFloatBE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, false, 23, 4);
  }, "readFloatBE");
  h.prototype.readDoubleLE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, true, 52, 8);
  }, "readDoubleLE");
  h.prototype.readDoubleBE = a(function(e, t) {
    return e = e >>> 0, t || q(e, 8, this.length), Pe.read(
      this,
      e,
      false,
      52,
      8
    );
  }, "readDoubleBE");
  function V(r, e, t, n, i, s) {
    if (!h.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError("Index out of range");
  }
  a(V, "checkInt");
  h.prototype.writeUintLE = h.prototype.writeUIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      V(
        this,
        e,
        t,
        n,
        u,
        0
      );
    }
    let s = 1, o = 0;
    for (this[t] = e & 255; ++o < n && (s *= 256); ) this[t + o] = e / s & 255;
    return t + n;
  }, "writeUIntLE");
  h.prototype.writeUintBE = h.prototype.writeUIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      V(this, e, t, n, u, 0);
    }
    let s = n - 1, o = 1;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) this[t + s] = e / o & 255;
    return t + n;
  }, "writeUIntBE");
  h.prototype.writeUint8 = h.prototype.writeUInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, "writeUInt8");
  h.prototype.writeUint16LE = h.prototype.writeUInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeUInt16LE");
  h.prototype.writeUint16BE = h.prototype.writeUInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeUInt16BE");
  h.prototype.writeUint32LE = h.prototype.writeUInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, "writeUInt32LE");
  h.prototype.writeUint32BE = h.prototype.writeUInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeUInt32BE");
  function Zn(r, e, t, n, i) {
    ri(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
  }
  a(Zn, "wrtBigUInt64LE");
  function Jn(r, e, t, n, i) {
    ri(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
  }
  a(Jn, "wrtBigUInt64BE");
  h.prototype.writeBigUInt64LE = we(a(function(e, t = 0) {
    return Zn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }, "writeBigUInt64LE"));
  h.prototype.writeBigUInt64BE = we(a(function(e, t = 0) {
    return Jn(this, e, t, BigInt(0), BigInt(
      "0xffffffffffffffff"
    ));
  }, "writeBigUInt64BE"));
  h.prototype.writeIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      V(this, e, t, n, c - 1, -c);
    }
    let s = 0, o = 1, u = 0;
    for (this[t] = e & 255; ++s < n && (o *= 256); )
      e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntLE");
  h.prototype.writeIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(2, 8 * n - 1);
      V(this, e, t, n, c - 1, -c);
    }
    let s = n - 1, o = 1, u = 0;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntBE");
  h.prototype.writeInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, "writeInt8");
  h.prototype.writeInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeInt16LE");
  h.prototype.writeInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeInt16BE");
  h.prototype.writeInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, "writeInt32LE");
  h.prototype.writeInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || V(
      this,
      e,
      t,
      4,
      2147483647,
      -2147483648
    ), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeInt32BE");
  h.prototype.writeBigInt64LE = we(a(function(e, t = 0) {
    return Zn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }, "writeBigInt64LE"));
  h.prototype.writeBigInt64BE = we(
    a(function(e, t = 0) {
      return Jn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }, "writeBigInt64BE")
  );
  function Xn(r, e, t, n, i, s) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  a(Xn, "checkIEEE754");
  function ei(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Xn(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Pe.write(r, e, t, n, 23, 4), t + 4;
  }
  a(
    ei,
    "writeFloat"
  );
  h.prototype.writeFloatLE = a(function(e, t, n) {
    return ei(this, e, t, true, n);
  }, "writeFloatLE");
  h.prototype.writeFloatBE = a(function(e, t, n) {
    return ei(this, e, t, false, n);
  }, "writeFloatBE");
  function ti(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Xn(r, e, t, 8, 17976931348623157e292, -17976931348623157e292), Pe.write(
      r,
      e,
      t,
      n,
      52,
      8
    ), t + 8;
  }
  a(ti, "writeDouble");
  h.prototype.writeDoubleLE = a(function(e, t, n) {
    return ti(this, e, t, true, n);
  }, "writeDoubleLE");
  h.prototype.writeDoubleBE = a(function(e, t, n) {
    return ti(this, e, t, false, n);
  }, "writeDoubleBE");
  h.prototype.copy = a(function(e, t, n, i) {
    if (!h.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (i < 0) throw new RangeError("sourceEnd out of bounds");
    i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
    let s = i - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
  }, "copy");
  h.prototype.fill = a(function(e, t, n, i) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
      if (typeof i == "string" && !h.isEncoding(i)) throw new TypeError(
        "Unknown encoding: " + i
      );
      if (e.length === 1) {
        let o = e.charCodeAt(0);
        (i === "utf8" && o < 128 || i === "latin1") && (e = o);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
    if (n <= t) return this;
    t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
    let s;
    if (typeof e == "number") for (s = t; s < n; ++s) this[s] = e;
    else {
      let o = h.isBuffer(e) ? e : h.from(
        e,
        i
      ), u = o.length;
      if (u === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
    }
    return this;
  }, "fill");
  var Te = {};
  function Vt(r, e, t) {
    var n;
    Te[r] = (n = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", { value: e.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
      }
      get code() {
        return r;
      }
      set code(s) {
        Object.defineProperty(
          this,
          "code",
          { configurable: true, enumerable: true, value: s, writable: true }
        );
      }
      toString() {
        return `${this.name} [${r}]: ${this.message}`;
      }
    }, a(n, "NodeError"), n);
  }
  a(Vt, "E");
  Vt("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
    return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError);
  Vt(
    "ERR_INVALID_ARG_TYPE",
    function(r, e) {
      return `The "${r}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  );
  Vt("ERR_OUT_OF_RANGE", function(r, e, t) {
    let n = `The value of "${r}" is out of range.`, i = t;
    return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = $n(String(t)) : typeof t == "bigint" && (i = String(
      t
    ), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = $n(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
  }, RangeError);
  function $n(r) {
    let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(0, t)}${e}`;
  }
  a($n, "addNumericalSeparator");
  function Xo(r, e, t) {
    Re(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && je(e, r.length - (t + 1));
  }
  a(Xo, "checkBounds");
  function ri(r, e, t, n, i, s) {
    if (r > t || r < e) {
      let o = typeof e == "bigint" ? "n" : "", u;
      throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Te.ERR_OUT_OF_RANGE("value", u, r);
    }
    Xo(n, i, s);
  }
  a(ri, "checkIntBI");
  function Re(r, e) {
    if (typeof r != "number") throw new Te.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  a(Re, "validateNumber");
  function je(r, e, t) {
    throw Math.floor(r) !== r ? (Re(r, t), new Te.ERR_OUT_OF_RANGE(t || "offset", "an integer", r)) : e < 0 ? new Te.ERR_BUFFER_OUT_OF_BOUNDS() : new Te.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
  }
  a(je, "boundsError");
  var ea = /[^+/0-9A-Za-z-_]/g;
  function ta(r) {
    if (r = r.split("=")[0], r = r.trim().replace(ea, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; ) r = r + "=";
    return r;
  }
  a(ta, "base64clean");
  function Ht(r, e) {
    e = e || 1 / 0;
    let t, n = r.length, i = null, s = [];
    for (let o = 0; o < n; ++o) {
      if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
        if (!i) {
          if (t > 56319) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          } else if (o + 1 === n) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          }
          i = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && s.push(239, 191, 189), i = t;
          continue;
        }
        t = (i - 55296 << 10 | t - 56320) + 65536;
      } else i && (e -= 3) > -1 && s.push(239, 191, 189);
      if (i = null, t < 128) {
        if ((e -= 1) < 0) break;
        s.push(t);
      } else if (t < 2048) {
        if ((e -= 2) < 0) break;
        s.push(t >> 6 | 192, t & 63 | 128);
      } else if (t < 65536) {
        if ((e -= 3) < 0) break;
        s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
      } else if (t < 1114112) {
        if ((e -= 4) < 0) break;
        s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return s;
  }
  a(Ht, "utf8ToBytes");
  function ra(r) {
    let e = [];
    for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(t) & 255);
    return e;
  }
  a(
    ra,
    "asciiToBytes"
  );
  function na(r, e) {
    let t, n, i, s = [];
    for (let o = 0; o < r.length && !((e -= 2) < 0); ++o) t = r.charCodeAt(
      o
    ), n = t >> 8, i = t % 256, s.push(i), s.push(n);
    return s;
  }
  a(na, "utf16leToBytes");
  function ni(r) {
    return Nt.toByteArray(
      ta(r)
    );
  }
  a(ni, "base64ToBytes");
  function ht(r, e, t, n) {
    let i;
    for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
      e[i + t] = r[i];
    return i;
  }
  a(ht, "blitBuffer");
  function ue(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
  }
  a(ue, "isInstance");
  function zt(r) {
    return r !== r;
  }
  a(zt, "numberIsNaN");
  var ia = (function() {
    let r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      let n = t * 16;
      for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
    }
    return e;
  })();
  function we(r) {
    return typeof BigInt > "u" ? sa : r;
  }
  a(we, "defineBigIntMethod");
  function sa() {
    throw new Error("BigInt not supported");
  }
  a(sa, "BufferBigIntNotDefined");
});
var b;
var v;
var x;
var d;
var m;
var p = G(() => {
  "use strict";
  b = globalThis, v = globalThis.setImmediate ?? ((r) => setTimeout(r, 0)), x = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), d = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : ii().Buffer, m = globalThis.process ?? {};
  m.env ?? (m.env = {});
  try {
    m.nextTick(() => {
    });
  } catch {
    let e = Promise.resolve();
    m.nextTick = e.then.bind(e);
  }
});
var ge = T((Bl, Kt) => {
  "use strict";
  p();
  var Le = typeof Reflect == "object" ? Reflect : null, si = Le && typeof Le.apply == "function" ? Le.apply : a(function(e, t, n) {
    return Function.prototype.apply.call(e, t, n);
  }, "ReflectApply"), pt;
  Le && typeof Le.ownKeys == "function" ? pt = Le.ownKeys : Object.getOwnPropertySymbols ? pt = a(function(e) {
    return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
  }, "ReflectOwnKeys") : pt = a(function(e) {
    return Object.getOwnPropertyNames(e);
  }, "ReflectOwnKeys");
  function oa(r) {
    console && console.warn && console.warn(r);
  }
  a(
    oa,
    "ProcessEmitWarning"
  );
  var ai = Number.isNaN || a(function(e) {
    return e !== e;
  }, "NumberIsNaN");
  function R() {
    R.init.call(this);
  }
  a(R, "EventEmitter");
  Kt.exports = R;
  Kt.exports.once = la;
  R.EventEmitter = R;
  R.prototype._events = void 0;
  R.prototype._eventsCount = 0;
  R.prototype._maxListeners = void 0;
  var oi = 10;
  function dt(r) {
    if (typeof r != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
  }
  a(dt, "checkListener");
  Object.defineProperty(R, "defaultMaxListeners", { enumerable: true, get: a(function() {
    return oi;
  }, "get"), set: a(
    function(r) {
      if (typeof r != "number" || r < 0 || ai(r)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
      oi = r;
    },
    "set"
  ) });
  R.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  };
  R.prototype.setMaxListeners = a(function(e) {
    if (typeof e != "number" || e < 0 || ai(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
    return this._maxListeners = e, this;
  }, "setMaxListeners");
  function ui(r) {
    return r._maxListeners === void 0 ? R.defaultMaxListeners : r._maxListeners;
  }
  a(ui, "_getMaxListeners");
  R.prototype.getMaxListeners = a(function() {
    return ui(this);
  }, "getMaxListeners");
  R.prototype.emit = a(function(e) {
    for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
    var i = e === "error", s = this._events;
    if (s !== void 0) i = i && s.error === void 0;
    else if (!i) return false;
    if (i) {
      var o;
      if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
      var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
      throw u.context = o, u;
    }
    var c = s[e];
    if (c === void 0) return false;
    if (typeof c == "function") si(c, this, t);
    else for (var l = c.length, f = pi(c, l), n = 0; n < l; ++n) si(f[n], this, t);
    return true;
  }, "emit");
  function ci(r, e, t, n) {
    var i, s, o;
    if (dt(
      t
    ), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit("newListener", e, t.listener ? t.listener : t), s = r._events), o = s[e]), o === void 0) o = s[e] = t, ++r._eventsCount;
    else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(t) : o.push(t), i = ui(r), i > 0 && o.length > i && !o.warned) {
      o.warned = true;
      var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, oa(u);
    }
    return r;
  }
  a(ci, "_addListener");
  R.prototype.addListener = a(function(e, t) {
    return ci(this, e, t, false);
  }, "addListener");
  R.prototype.on = R.prototype.addListener;
  R.prototype.prependListener = a(function(e, t) {
    return ci(this, e, t, true);
  }, "prependListener");
  function aa() {
    if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  a(aa, "onceWrapper");
  function li(r, e, t) {
    var n = {
      fired: false,
      wrapFn: void 0,
      target: r,
      type: e,
      listener: t
    }, i = aa.bind(n);
    return i.listener = t, n.wrapFn = i, i;
  }
  a(li, "_onceWrap");
  R.prototype.once = a(function(e, t) {
    return dt(t), this.on(e, li(this, e, t)), this;
  }, "once");
  R.prototype.prependOnceListener = a(function(e, t) {
    return dt(t), this.prependListener(e, li(this, e, t)), this;
  }, "prependOnceListener");
  R.prototype.removeListener = a(function(e, t) {
    var n, i, s, o, u;
    if (dt(t), i = this._events, i === void 0) return this;
    if (n = i[e], n === void 0) return this;
    if (n === t || n.listener === t) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
    else if (typeof n != "function") {
      for (s = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
        u = n[o].listener, s = o;
        break;
      }
      if (s < 0) return this;
      s === 0 ? n.shift() : ua(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
    }
    return this;
  }, "removeListener");
  R.prototype.off = R.prototype.removeListener;
  R.prototype.removeAllListeners = a(function(e) {
    var t, n, i;
    if (n = this._events, n === void 0) return this;
    if (n.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
    if (arguments.length === 0) {
      var s = Object.keys(n), o;
      for (i = 0; i < s.length; ++i) o = s[i], o !== "removeListener" && this.removeAllListeners(
        o
      );
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (t = n[e], typeof t == "function") this.removeListener(e, t);
    else if (t !== void 0) for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
    return this;
  }, "removeAllListeners");
  function fi(r, e, t) {
    var n = r._events;
    if (n === void 0) return [];
    var i = n[e];
    return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? ca(i) : pi(i, i.length);
  }
  a(fi, "_listeners");
  R.prototype.listeners = a(function(e) {
    return fi(this, e, true);
  }, "listeners");
  R.prototype.rawListeners = a(function(e) {
    return fi(this, e, false);
  }, "rawListeners");
  R.listenerCount = function(r, e) {
    return typeof r.listenerCount == "function" ? r.listenerCount(e) : hi.call(r, e);
  };
  R.prototype.listenerCount = hi;
  function hi(r) {
    var e = this._events;
    if (e !== void 0) {
      var t = e[r];
      if (typeof t == "function")
        return 1;
      if (t !== void 0) return t.length;
    }
    return 0;
  }
  a(hi, "listenerCount");
  R.prototype.eventNames = a(function() {
    return this._eventsCount > 0 ? pt(this._events) : [];
  }, "eventNames");
  function pi(r, e) {
    for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
    return t;
  }
  a(pi, "arrayClone");
  function ua(r, e) {
    for (; e + 1 < r.length; e++) r[e] = r[e + 1];
    r.pop();
  }
  a(ua, "spliceOne");
  function ca(r) {
    for (var e = new Array(r.length), t = 0; t < e.length; ++t) e[t] = r[t].listener || r[t];
    return e;
  }
  a(ca, "unwrapListeners");
  function la(r, e) {
    return new Promise(function(t, n) {
      function i(o) {
        r.removeListener(e, s), n(o);
      }
      a(i, "errorListener");
      function s() {
        typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(arguments));
      }
      a(s, "resolver"), di(r, e, s, { once: true }), e !== "error" && fa(r, i, { once: true });
    });
  }
  a(la, "once");
  function fa(r, e, t) {
    typeof r.on == "function" && di(r, "error", e, t);
  }
  a(
    fa,
    "addErrorHandlerIfEventEmitter"
  );
  function di(r, e, t, n) {
    if (typeof r.on == "function") n.once ? r.once(e, t) : r.on(e, t);
    else if (typeof r.addEventListener == "function") r.addEventListener(e, a(function i(s) {
      n.once && r.removeEventListener(e, i), t(s);
    }, "wrapListener"));
    else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
  }
  a(di, "eventTargetAgnosticAddListener");
});
var wi = {};
ie(wi, { Socket: () => ce, isIP: () => ha });
function ha(r) {
  return 0;
}
var mi;
var yi;
var S;
var ce;
var Fe = G(() => {
  "use strict";
  p();
  mi = Se(ge(), 1);
  a(ha, "isIP");
  yi = /^[^.]+\./, S = class S2 extends mi.EventEmitter {
    constructor() {
      super(...arguments);
      E(this, "opts", {});
      E(this, "connecting", false);
      E(this, "pending", true);
      E(
        this,
        "writable",
        true
      );
      E(this, "encrypted", false);
      E(this, "authorized", false);
      E(this, "destroyed", false);
      E(this, "ws", null);
      E(this, "writeBuffer");
      E(this, "tlsState", 0);
      E(this, "tlsRead");
      E(this, "tlsWrite");
    }
    static get poolQueryViaFetch() {
      return S2.opts.poolQueryViaFetch ?? S2.defaults.poolQueryViaFetch;
    }
    static set poolQueryViaFetch(t) {
      S2.opts.poolQueryViaFetch = t;
    }
    static get fetchEndpoint() {
      return S2.opts.fetchEndpoint ?? S2.defaults.fetchEndpoint;
    }
    static set fetchEndpoint(t) {
      S2.opts.fetchEndpoint = t;
    }
    static get fetchConnectionCache() {
      return true;
    }
    static set fetchConnectionCache(t) {
      console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
    }
    static get fetchFunction() {
      return S2.opts.fetchFunction ?? S2.defaults.fetchFunction;
    }
    static set fetchFunction(t) {
      S2.opts.fetchFunction = t;
    }
    static get webSocketConstructor() {
      return S2.opts.webSocketConstructor ?? S2.defaults.webSocketConstructor;
    }
    static set webSocketConstructor(t) {
      S2.opts.webSocketConstructor = t;
    }
    get webSocketConstructor() {
      return this.opts.webSocketConstructor ?? S2.webSocketConstructor;
    }
    set webSocketConstructor(t) {
      this.opts.webSocketConstructor = t;
    }
    static get wsProxy() {
      return S2.opts.wsProxy ?? S2.defaults.wsProxy;
    }
    static set wsProxy(t) {
      S2.opts.wsProxy = t;
    }
    get wsProxy() {
      return this.opts.wsProxy ?? S2.wsProxy;
    }
    set wsProxy(t) {
      this.opts.wsProxy = t;
    }
    static get coalesceWrites() {
      return S2.opts.coalesceWrites ?? S2.defaults.coalesceWrites;
    }
    static set coalesceWrites(t) {
      S2.opts.coalesceWrites = t;
    }
    get coalesceWrites() {
      return this.opts.coalesceWrites ?? S2.coalesceWrites;
    }
    set coalesceWrites(t) {
      this.opts.coalesceWrites = t;
    }
    static get useSecureWebSocket() {
      return S2.opts.useSecureWebSocket ?? S2.defaults.useSecureWebSocket;
    }
    static set useSecureWebSocket(t) {
      S2.opts.useSecureWebSocket = t;
    }
    get useSecureWebSocket() {
      return this.opts.useSecureWebSocket ?? S2.useSecureWebSocket;
    }
    set useSecureWebSocket(t) {
      this.opts.useSecureWebSocket = t;
    }
    static get forceDisablePgSSL() {
      return S2.opts.forceDisablePgSSL ?? S2.defaults.forceDisablePgSSL;
    }
    static set forceDisablePgSSL(t) {
      S2.opts.forceDisablePgSSL = t;
    }
    get forceDisablePgSSL() {
      return this.opts.forceDisablePgSSL ?? S2.forceDisablePgSSL;
    }
    set forceDisablePgSSL(t) {
      this.opts.forceDisablePgSSL = t;
    }
    static get disableSNI() {
      return S2.opts.disableSNI ?? S2.defaults.disableSNI;
    }
    static set disableSNI(t) {
      S2.opts.disableSNI = t;
    }
    get disableSNI() {
      return this.opts.disableSNI ?? S2.disableSNI;
    }
    set disableSNI(t) {
      this.opts.disableSNI = t;
    }
    static get disableWarningInBrowsers() {
      return S2.opts.disableWarningInBrowsers ?? S2.defaults.disableWarningInBrowsers;
    }
    static set disableWarningInBrowsers(t) {
      S2.opts.disableWarningInBrowsers = t;
    }
    get disableWarningInBrowsers() {
      return this.opts.disableWarningInBrowsers ?? S2.disableWarningInBrowsers;
    }
    set disableWarningInBrowsers(t) {
      this.opts.disableWarningInBrowsers = t;
    }
    static get pipelineConnect() {
      return S2.opts.pipelineConnect ?? S2.defaults.pipelineConnect;
    }
    static set pipelineConnect(t) {
      S2.opts.pipelineConnect = t;
    }
    get pipelineConnect() {
      return this.opts.pipelineConnect ?? S2.pipelineConnect;
    }
    set pipelineConnect(t) {
      this.opts.pipelineConnect = t;
    }
    static get subtls() {
      return S2.opts.subtls ?? S2.defaults.subtls;
    }
    static set subtls(t) {
      S2.opts.subtls = t;
    }
    get subtls() {
      return this.opts.subtls ?? S2.subtls;
    }
    set subtls(t) {
      this.opts.subtls = t;
    }
    static get pipelineTLS() {
      return S2.opts.pipelineTLS ?? S2.defaults.pipelineTLS;
    }
    static set pipelineTLS(t) {
      S2.opts.pipelineTLS = t;
    }
    get pipelineTLS() {
      return this.opts.pipelineTLS ?? S2.pipelineTLS;
    }
    set pipelineTLS(t) {
      this.opts.pipelineTLS = t;
    }
    static get rootCerts() {
      return S2.opts.rootCerts ?? S2.defaults.rootCerts;
    }
    static set rootCerts(t) {
      S2.opts.rootCerts = t;
    }
    get rootCerts() {
      return this.opts.rootCerts ?? S2.rootCerts;
    }
    set rootCerts(t) {
      this.opts.rootCerts = t;
    }
    wsProxyAddrForHost(t, n) {
      let i = this.wsProxy;
      if (i === void 0) throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
      return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
    }
    setNoDelay() {
      return this;
    }
    setKeepAlive() {
      return this;
    }
    ref() {
      return this;
    }
    unref() {
      return this;
    }
    connect(t, n, i) {
      this.connecting = true, i && this.once("connect", i);
      let s = a(() => {
        this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
      }, "handleWebSocketOpen"), o = a((c, l = false) => {
        c.binaryType = "arraybuffer", c.addEventListener("error", (f) => {
          this.emit("error", f), this.emit("close");
        }), c.addEventListener("message", (f) => {
          if (this.tlsState === 0) {
            let y = d.from(f.data);
            this.emit("data", y);
          }
        }), c.addEventListener("close", () => {
          this.emit("close");
        }), l ? s() : c.addEventListener(
          "open",
          s
        );
      }, "configureWebSocket"), u;
      try {
        u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
      } catch (c) {
        this.emit("error", c), this.emit("close");
        return;
      }
      try {
        let l = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
        if (this.webSocketConstructor !== void 0) this.ws = new this.webSocketConstructor(l), o(this.ws);
        else try {
          this.ws = new WebSocket(l), o(this.ws);
        } catch {
          this.ws = new __unstable_WebSocket(l), o(this.ws);
        }
      } catch (c) {
        let f = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
        fetch(f, { headers: { Upgrade: "websocket" } }).then(
          (y) => {
            if (this.ws = y.webSocket, this.ws == null) throw c;
            this.ws.accept(), o(this.ws, true);
          }
        ).catch((y) => {
          this.emit(
            "error",
            new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${y}`)
          ), this.emit("close");
        });
      }
    }
    async startTls(t) {
      if (this.subtls === void 0) throw new Error(
        "For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information."
      );
      this.tlsState = 1;
      let n = await this.subtls.TrustedCert.databaseFromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(i), o = this.rawWrite.bind(this), { read: u, write: c } = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
      this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit("secureConnection", this), this.tlsReadLoop();
    }
    async tlsReadLoop() {
      for (; ; ) {
        let t = await this.tlsRead();
        if (t === void 0) break;
        {
          let n = d.from(t);
          this.emit("data", n);
        }
      }
    }
    rawWrite(t) {
      if (!this.coalesceWrites) {
        this.ws && this.ws.send(t);
        return;
      }
      if (this.writeBuffer === void 0) this.writeBuffer = t, setTimeout(() => {
        this.ws && this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
      }, 0);
      else {
        let n = new Uint8Array(
          this.writeBuffer.length + t.length
        );
        n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
      }
    }
    write(t, n = "utf8", i = (s) => {
    }) {
      return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = d.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
        this.write(
          t,
          n,
          i
        );
      }) : (this.tlsWrite(t), i()), true);
    }
    end(t = d.alloc(0), n = "utf8", i = () => {
    }) {
      return this.write(t, n, () => {
        this.ws.close(), i();
      }), this;
    }
    destroy() {
      return this.destroyed = true, this.end();
    }
  };
  a(S, "Socket"), E(S, "defaults", {
    poolQueryViaFetch: false,
    fetchEndpoint: a((t, n, i) => {
      let s;
      return i?.jwtAuth ? s = t.replace(yi, "apiauth.") : s = t.replace(yi, "api."), "https://" + s + "/sql";
    }, "fetchEndpoint"),
    fetchConnectionCache: true,
    fetchFunction: void 0,
    webSocketConstructor: void 0,
    wsProxy: a((t) => t + "/v2", "wsProxy"),
    useSecureWebSocket: true,
    forceDisablePgSSL: true,
    coalesceWrites: true,
    pipelineConnect: "password",
    subtls: void 0,
    rootCerts: "",
    pipelineTLS: false,
    disableSNI: false,
    disableWarningInBrowsers: false
  }), E(S, "opts", {});
  ce = S;
});
var gi = {};
ie(gi, { parse: () => Yt });
function Yt(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(
    t.length
  ), { username: i, password: s, host: o, hostname: u, port: c, pathname: l, search: f, searchParams: y, hash: g } = new URL(
    n
  );
  s = decodeURIComponent(s), i = decodeURIComponent(i), l = decodeURIComponent(l);
  let A = i + ":" + s, C = e ? Object.fromEntries(y.entries()) : f;
  return {
    href: r,
    protocol: t,
    auth: A,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: l,
    search: f,
    query: C,
    hash: g
  };
}
var Zt = G(() => {
  "use strict";
  p();
  a(Yt, "parse");
});
var tr = T((Ai) => {
  "use strict";
  p();
  Ai.parse = function(r, e) {
    return new er(r, e).parse();
  };
  var vt = class vt2 {
    constructor(e, t) {
      this.source = e, this.transform = t || Ca, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var e = this.source[this.position++];
      return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
    }
    record(e) {
      this.recorded.push(
        e
      );
    }
    newEntry(e) {
      var t;
      (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(t), this.recorded = []);
    }
    consumeDimensions() {
      if (this.source[0] === "[") for (; !this.isEof(); ) {
        var e = this.nextCharacter();
        if (e.value === "=") break;
      }
    }
    parse(e) {
      var t, n, i;
      for (this.consumeDimensions(); !this.isEof(); ) if (t = this.nextCharacter(), t.value === "{" && !i) this.dimension++, this.dimension > 1 && (n = new vt2(this.source.substr(this.position - 1), this.transform), this.entries.push(n.parse(
        true
      )), this.position += n.position - 2);
      else if (t.value === "}" && !i) {
        if (this.dimension--, !this.dimension && (this.newEntry(), e)) return this.entries;
      } else t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(t.value);
      if (this.dimension !== 0) throw new Error("array dimension not balanced");
      return this.entries;
    }
  };
  a(vt, "ArrayParser");
  var er = vt;
  function Ca(r) {
    return r;
  }
  a(Ca, "identity");
});
var rr = T((Zl, Ci) => {
  p();
  var _a = tr();
  Ci.exports = { create: a(function(r, e) {
    return { parse: a(function() {
      return _a.parse(r, e);
    }, "parse") };
  }, "create") };
});
var Ti = T((ef, Ii) => {
  "use strict";
  p();
  var Ia = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Ta = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, Pa = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, Ra = /^-?infinity$/;
  Ii.exports = a(function(e) {
    if (Ra.test(e)) return Number(e.replace("i", "I"));
    var t = Ia.exec(e);
    if (!t) return Ba(
      e
    ) || null;
    var n = !!t[8], i = parseInt(t[1], 10);
    n && (i = _i(i));
    var s = parseInt(t[2], 10) - 1, o = t[3], u = parseInt(
      t[4],
      10
    ), c = parseInt(t[5], 10), l = parseInt(t[6], 10), f = t[7];
    f = f ? 1e3 * parseFloat(f) : 0;
    var y, g = La(e);
    return g != null ? (y = new Date(Date.UTC(i, s, o, u, c, l, f)), nr(i) && y.setUTCFullYear(i), g !== 0 && y.setTime(y.getTime() - g)) : (y = new Date(i, s, o, u, c, l, f), nr(i) && y.setFullYear(i)), y;
  }, "parseDate");
  function Ba(r) {
    var e = Ta.exec(r);
    if (e) {
      var t = parseInt(e[1], 10), n = !!e[4];
      n && (t = _i(t));
      var i = parseInt(e[2], 10) - 1, s = e[3], o = new Date(t, i, s);
      return nr(
        t
      ) && o.setFullYear(t), o;
    }
  }
  a(Ba, "getDate");
  function La(r) {
    if (r.endsWith("+00")) return 0;
    var e = Pa.exec(r.split(" ")[1]);
    if (e) {
      var t = e[1];
      if (t === "Z") return 0;
      var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
        e[3] || 0,
        10
      ) * 60 + parseInt(e[4] || 0, 10);
      return i * n * 1e3;
    }
  }
  a(La, "timeZoneOffset");
  function _i(r) {
    return -(r - 1);
  }
  a(_i, "bcYearToNegativeYear");
  function nr(r) {
    return r >= 0 && r < 100;
  }
  a(nr, "is0To99");
});
var Ri = T((nf, Pi) => {
  p();
  Pi.exports = ka;
  var Fa = Object.prototype.hasOwnProperty;
  function ka(r) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var n in t) Fa.call(t, n) && (r[n] = t[n]);
    }
    return r;
  }
  a(ka, "extend");
});
var Fi = T((af, Li) => {
  "use strict";
  p();
  var Ma = Ri();
  Li.exports = ke;
  function ke(r) {
    if (!(this instanceof ke))
      return new ke(r);
    Ma(this, Va(r));
  }
  a(ke, "PostgresInterval");
  var Ua = [
    "seconds",
    "minutes",
    "hours",
    "days",
    "months",
    "years"
  ];
  ke.prototype.toPostgres = function() {
    var r = Ua.filter(this.hasOwnProperty, this);
    return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
      var t = this[e] || 0;
      return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
        /\.?0+$/,
        ""
      )), t + " " + e;
    }, this).join(" ");
  };
  var Da = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, Oa = ["years", "months", "days"], qa = ["hours", "minutes", "seconds"];
  ke.prototype.toISOString = ke.prototype.toISO = function() {
    var r = Oa.map(t, this).join(""), e = qa.map(t, this).join("");
    return "P" + r + "T" + e;
    function t(n) {
      var i = this[n] || 0;
      return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
        /0+$/,
        ""
      )), i + Da[n];
    }
  };
  var ir = "([+-]?\\d+)", Qa = ir + "\\s+years?", Na = ir + "\\s+mons?", Wa = ir + "\\s+days?", ja = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", Ha = new RegExp([Qa, Na, Wa, ja].map(function(r) {
    return "(" + r + ")?";
  }).join("\\s*")), Bi = { years: 2, months: 4, days: 6, hours: 9, minutes: 10, seconds: 11, milliseconds: 12 }, $a = ["hours", "minutes", "seconds", "milliseconds"];
  function Ga(r) {
    var e = r + "000000".slice(r.length);
    return parseInt(
      e,
      10
    ) / 1e3;
  }
  a(Ga, "parseMilliseconds");
  function Va(r) {
    if (!r) return {};
    var e = Ha.exec(r), t = e[8] === "-";
    return Object.keys(Bi).reduce(function(n, i) {
      var s = Bi[i], o = e[s];
      return !o || (o = i === "milliseconds" ? Ga(o) : parseInt(o, 10), !o) || (t && ~$a.indexOf(i) && (o *= -1), n[i] = o), n;
    }, {});
  }
  a(Va, "parse");
});
var Mi = T((lf, ki) => {
  "use strict";
  p();
  ki.exports = a(function(e) {
    if (/^\\x/.test(e)) return new d(e.substr(
      2
    ), "hex");
    for (var t = "", n = 0; n < e.length; ) if (e[n] !== "\\") t += e[n], ++n;
    else if (/[0-7]{3}/.test(e.substr(n + 1, 3))) t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
    else {
      for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
      for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
      n += Math.floor(i / 2) * 2;
    }
    return new d(t, "binary");
  }, "parseBytea");
});
var Wi = T((pf, Ni) => {
  p();
  var Ve = tr(), ze = rr(), xt = Ti(), Di = Fi(), Oi = Mi();
  function St(r) {
    return a(function(t) {
      return t === null ? t : r(t);
    }, "nullAllowed");
  }
  a(St, "allowNull");
  function qi(r) {
    return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
  }
  a(qi, "parseBool");
  function za(r) {
    return r ? Ve.parse(r, qi) : null;
  }
  a(za, "parseBoolArray");
  function Ka(r) {
    return parseInt(r, 10);
  }
  a(Ka, "parseBaseTenInt");
  function sr(r) {
    return r ? Ve.parse(r, St(Ka)) : null;
  }
  a(sr, "parseIntegerArray");
  function Ya(r) {
    return r ? Ve.parse(r, St(function(e) {
      return Qi(e).trim();
    })) : null;
  }
  a(Ya, "parseBigIntegerArray");
  var Za = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = cr(t)), t;
    });
    return e.parse();
  }, "parsePointArray"), or = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = parseFloat(t)), t;
    });
    return e.parse();
  }, "parseFloatArray"), re = a(function(r) {
    if (!r) return null;
    var e = ze.create(r);
    return e.parse();
  }, "parseStringArray"), ar = a(function(r) {
    if (!r) return null;
    var e = ze.create(
      r,
      function(t) {
        return t !== null && (t = xt(t)), t;
      }
    );
    return e.parse();
  }, "parseDateArray"), Ja = a(function(r) {
    if (!r)
      return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = Di(t)), t;
    });
    return e.parse();
  }, "parseIntervalArray"), Xa = a(function(r) {
    return r ? Ve.parse(r, St(Oi)) : null;
  }, "parseByteAArray"), ur = a(function(r) {
    return parseInt(r, 10);
  }, "parseInteger"), Qi = a(function(r) {
    var e = String(r);
    return /^\d+$/.test(e) ? e : r;
  }, "parseBigInteger"), Ui = a(function(r) {
    return r ? Ve.parse(r, St(JSON.parse)) : null;
  }, "parseJsonArray"), cr = a(
    function(r) {
      return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(
        r[1]
      ) });
    },
    "parsePoint"
  ), eu = a(function(r) {
    if (r[0] !== "<" && r[1] !== "(") return null;
    for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
      if (n || (e += r[i]), r[i] === ")") {
        n = true;
        continue;
      } else if (!n) continue;
      r[i] !== "," && (t += r[i]);
    }
    var s = cr(e);
    return s.radius = parseFloat(t), s;
  }, "parseCircle"), tu = a(function(r) {
    r(20, Qi), r(21, ur), r(23, ur), r(26, ur), r(700, parseFloat), r(701, parseFloat), r(16, qi), r(1082, xt), r(1114, xt), r(1184, xt), r(
      600,
      cr
    ), r(651, re), r(718, eu), r(1e3, za), r(1001, Xa), r(1005, sr), r(1007, sr), r(1028, sr), r(1016, Ya), r(1017, Za), r(1021, or), r(1022, or), r(1231, or), r(1014, re), r(1015, re), r(1008, re), r(1009, re), r(1040, re), r(1041, re), r(
      1115,
      ar
    ), r(1182, ar), r(1185, ar), r(1186, Di), r(1187, Ja), r(17, Oi), r(114, JSON.parse.bind(JSON)), r(3802, JSON.parse.bind(JSON)), r(199, Ui), r(3807, Ui), r(3907, re), r(2951, re), r(791, re), r(1183, re), r(1270, re);
  }, "init");
  Ni.exports = { init: tu };
});
var Hi = T((mf, ji) => {
  "use strict";
  p();
  var z = 1e6;
  function ru(r) {
    var e = r.readInt32BE(0), t = r.readUInt32BE(
      4
    ), n = "";
    e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
    var i = "", s, o, u, c, l, f;
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % z, e = e / z >>> 0, o = 4294967296 * s + t, t = o / z >>> 0, u = "" + (o - z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", l = 6 - u.length, f = 0; f < l; f++) c += "0";
      i = c + u + i;
    }
    return s = e % z, o = 4294967296 * s + t, u = "" + o % z, n + u + i;
  }
  a(ru, "readInt8");
  ji.exports = ru;
});
var Ki = T((bf, zi) => {
  p();
  var nu = Hi(), L = a(function(r, e, t, n, i) {
    t = t || 0, n = n || false, i = i || function(A, C, D) {
      return A * Math.pow(2, D) + C;
    };
    var s = t >> 3, o = a(function(A) {
      return n ? ~A & 255 : A;
    }, "inv"), u = 255, c = 8 - t % 8;
    e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
    var l = 0;
    t % 8 + e >= 8 && (l = i(0, o(r[s]) & u, c));
    for (var f = e + t >> 3, y = s + 1; y < f; y++) l = i(l, o(
      r[y]
    ), 8);
    var g = (e + t) % 8;
    return g > 0 && (l = i(l, o(r[f]) >> 8 - g, g)), l;
  }, "parseBits"), Vi = a(function(r, e, t) {
    var n = Math.pow(2, t - 1) - 1, i = L(r, 1), s = L(r, t, 1);
    if (s === 0) return 0;
    var o = 1, u = a(function(l, f, y) {
      l === 0 && (l = 1);
      for (var g = 1; g <= y; g++) o /= 2, (f & 1 << y - g) > 0 && (l += o);
      return l;
    }, "parsePrecisionBits"), c = L(r, e, t + 1, false, u);
    return s == Math.pow(
      2,
      t + 1
    ) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
  }, "parseFloatFromBits"), iu = a(function(r) {
    return L(r, 1) == 1 ? -1 * (L(r, 15, 1, true) + 1) : L(r, 15, 1);
  }, "parseInt16"), $i = a(function(r) {
    return L(r, 1) == 1 ? -1 * (L(
      r,
      31,
      1,
      true
    ) + 1) : L(r, 31, 1);
  }, "parseInt32"), su = a(function(r) {
    return Vi(r, 23, 8);
  }, "parseFloat32"), ou = a(function(r) {
    return Vi(r, 52, 11);
  }, "parseFloat64"), au = a(function(r) {
    var e = L(r, 16, 32);
    if (e == 49152) return NaN;
    for (var t = Math.pow(1e4, L(r, 16, 16)), n = 0, i = [], s = L(r, 16), o = 0; o < s; o++) n += L(r, 16, 64 + 16 * o) * t, t /= 1e4;
    var u = Math.pow(10, L(
      r,
      16,
      48
    ));
    return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
  }, "parseNumeric"), Gi = a(function(r, e) {
    var t = L(e, 1), n = L(
      e,
      63,
      1
    ), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
    return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
      return this.usec;
    }, i.setMicroSeconds = function(s) {
      this.usec = s;
    }, i.getUTCMicroSeconds = function() {
      return this.usec;
    }, i;
  }, "parseDate"), Ke = a(
    function(r) {
      for (var e = L(
        r,
        32
      ), t = L(r, 32, 32), n = L(r, 32, 64), i = 96, s = [], o = 0; o < e; o++) s[o] = L(r, 32, i), i += 32, i += 32;
      var u = a(function(l) {
        var f = L(r, 32, i);
        if (i += 32, f == 4294967295) return null;
        var y;
        if (l == 23 || l == 20) return y = L(r, f * 8, i), i += f * 8, y;
        if (l == 25) return y = r.toString(this.encoding, i >> 3, (i += f << 3) >> 3), y;
        console.log("ERROR: ElementType not implemented: " + l);
      }, "parseElement"), c = a(function(l, f) {
        var y = [], g;
        if (l.length > 1) {
          var A = l.shift();
          for (g = 0; g < A; g++) y[g] = c(l, f);
          l.unshift(A);
        } else for (g = 0; g < l[0]; g++) y[g] = u(f);
        return y;
      }, "parse");
      return c(s, n);
    },
    "parseArray"
  ), uu = a(function(r) {
    return r.toString("utf8");
  }, "parseText"), cu = a(function(r) {
    return r === null ? null : L(r, 8) > 0;
  }, "parseBool"), lu = a(function(r) {
    r(20, nu), r(21, iu), r(23, $i), r(26, $i), r(1700, au), r(700, su), r(701, ou), r(16, cu), r(1114, Gi.bind(null, false)), r(1184, Gi.bind(null, true)), r(1e3, Ke), r(1007, Ke), r(1016, Ke), r(1008, Ke), r(1009, Ke), r(25, uu);
  }, "init");
  zi.exports = { init: lu };
});
var Zi = T((Sf, Yi) => {
  p();
  Yi.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
  };
});
var Je = T((Ze) => {
  p();
  var fu = Wi(), hu = Ki(), pu = rr(), du = Zi();
  Ze.getTypeParser = yu;
  Ze.setTypeParser = mu;
  Ze.arrayParser = pu;
  Ze.builtins = du;
  var Ye = { text: {}, binary: {} };
  function Ji(r) {
    return String(r);
  }
  a(Ji, "noParse");
  function yu(r, e) {
    return e = e || "text", Ye[e] && Ye[e][r] || Ji;
  }
  a(yu, "getTypeParser");
  function mu(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), Ye[e][r] = t;
  }
  a(mu, "setTypeParser");
  fu.init(function(r, e) {
    Ye.text[r] = e;
  });
  hu.init(function(r, e) {
    Ye.binary[r] = e;
  });
});
var At = T((If, Xi) => {
  "use strict";
  p();
  var wu = Je();
  function Et(r) {
    this._types = r || wu, this.text = {}, this.binary = {};
  }
  a(Et, "TypeOverrides");
  Et.prototype.getOverrides = function(r) {
    switch (r) {
      case "text":
        return this.text;
      case "binary":
        return this.binary;
      default:
        return {};
    }
  };
  Et.prototype.setTypeParser = function(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
  };
  Et.prototype.getTypeParser = function(r, e) {
    return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
  };
  Xi.exports = Et;
});
function Xe(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, l = 0, f = 0, y = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], g = a((I, w) => I >>> w | I << 32 - w, "rrot"), A = new Uint32Array(64), C = new Uint8Array(64), D = a(() => {
    for (let B = 0, j = 0; B < 16; B++, j += 4) A[B] = C[j] << 24 | C[j + 1] << 16 | C[j + 2] << 8 | C[j + 3];
    for (let B = 16; B < 64; B++) {
      let j = g(A[B - 15], 7) ^ g(A[B - 15], 18) ^ A[B - 15] >>> 3, le = g(
        A[B - 2],
        17
      ) ^ g(A[B - 2], 19) ^ A[B - 2] >>> 10;
      A[B] = A[B - 16] + j + A[B - 7] + le | 0;
    }
    let I = e, w = t, Z = n, W = i, J = s, X = o, se = u, oe = c;
    for (let B = 0; B < 64; B++) {
      let j = g(J, 6) ^ g(J, 11) ^ g(J, 25), le = J & X ^ ~J & se, de = oe + j + le + y[B] + A[B] | 0, We = g(I, 2) ^ g(
        I,
        13
      ) ^ g(I, 22), fe = I & w ^ I & Z ^ w & Z, _e = We + fe | 0;
      oe = se, se = X, X = J, J = W + de | 0, W = Z, Z = w, w = I, I = de + _e | 0;
    }
    e = e + I | 0, t = t + w | 0, n = n + Z | 0, i = i + W | 0, s = s + J | 0, o = o + X | 0, u = u + se | 0, c = c + oe | 0, f = 0;
  }, "process"), Y = a((I) => {
    typeof I == "string" && (I = new TextEncoder().encode(I));
    for (let w = 0; w < I.length; w++) C[f++] = I[w], f === 64 && D();
    l += I.length;
  }, "add"), P = a(() => {
    if (C[f++] = 128, f == 64 && D(), f + 8 > 64) {
      for (; f < 64; ) C[f++] = 0;
      D();
    }
    for (; f < 58; ) C[f++] = 0;
    let I = l * 8;
    C[f++] = I / 1099511627776 & 255, C[f++] = I / 4294967296 & 255, C[f++] = I >>> 24, C[f++] = I >>> 16 & 255, C[f++] = I >>> 8 & 255, C[f++] = I & 255, D();
    let w = new Uint8Array(
      32
    );
    return w[0] = e >>> 24, w[1] = e >>> 16 & 255, w[2] = e >>> 8 & 255, w[3] = e & 255, w[4] = t >>> 24, w[5] = t >>> 16 & 255, w[6] = t >>> 8 & 255, w[7] = t & 255, w[8] = n >>> 24, w[9] = n >>> 16 & 255, w[10] = n >>> 8 & 255, w[11] = n & 255, w[12] = i >>> 24, w[13] = i >>> 16 & 255, w[14] = i >>> 8 & 255, w[15] = i & 255, w[16] = s >>> 24, w[17] = s >>> 16 & 255, w[18] = s >>> 8 & 255, w[19] = s & 255, w[20] = o >>> 24, w[21] = o >>> 16 & 255, w[22] = o >>> 8 & 255, w[23] = o & 255, w[24] = u >>> 24, w[25] = u >>> 16 & 255, w[26] = u >>> 8 & 255, w[27] = u & 255, w[28] = c >>> 24, w[29] = c >>> 16 & 255, w[30] = c >>> 8 & 255, w[31] = c & 255, w;
  }, "digest");
  return r === void 0 ? { add: Y, digest: P } : (Y(r), P());
}
var es = G(() => {
  "use strict";
  p();
  a(Xe, "sha256");
});
var U;
var et;
var ts = G(() => {
  "use strict";
  p();
  U = class U2 {
    constructor() {
      E(this, "_dataLength", 0);
      E(this, "_bufferLength", 0);
      E(this, "_state", new Int32Array(4));
      E(this, "_buffer", new ArrayBuffer(68));
      E(this, "_buffer8");
      E(this, "_buffer32");
      this._buffer8 = new Uint8Array(this._buffer, 0, 68), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
    }
    static hashByteArray(e, t = false) {
      return this.onePassHasher.start().appendByteArray(
        e
      ).end(t);
    }
    static hashStr(e, t = false) {
      return this.onePassHasher.start().appendStr(e).end(t);
    }
    static hashAsciiStr(e, t = false) {
      return this.onePassHasher.start().appendAsciiStr(e).end(t);
    }
    static _hex(e) {
      let t = U2.hexChars, n = U2.hexOut, i, s, o, u;
      for (u = 0; u < 4; u += 1) for (s = u * 8, i = e[u], o = 0; o < 8; o += 2) n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(
        i & 15
      ), i >>>= 4;
      return n.join("");
    }
    static _md5cycle(e, t) {
      let n = e[0], i = e[1], s = e[2], o = e[3];
      n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
    }
    start() {
      return this._dataLength = 0, this._bufferLength = 0, this._state.set(U2.stateIdentity), this;
    }
    appendStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
      for (o = 0; o < e.length; o += 1) {
        if (s = e.charCodeAt(o), s < 128) t[i++] = s;
        else if (s < 2048) t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
        else if (s < 55296 || s > 56319) t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        else {
          if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111) throw new Error(
            "Unicode standard supports code points up to U+10FFFF"
          );
          t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        }
        i >= 64 && (this._dataLength += 64, U2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
      }
      return this._bufferLength = i, this;
    }
    appendAsciiStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e.charCodeAt(o++);
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    appendByteArray(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(this._state, n), i = 0;
      }
      return this._bufferLength = i, this;
    }
    getState() {
      let e = this._state;
      return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
    }
    setState(e) {
      let t = e.buffer, n = e.state, i = this._state, s;
      for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1) this._buffer8[s] = t.charCodeAt(s);
    }
    end(e = false) {
      let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
      this._dataLength += t;
      let o = this._dataLength * 8;
      if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(U2.buffer32Identity.subarray(s), s), t > 55 && (U2._md5cycle(this._state, i), i.set(U2.buffer32Identity)), o <= 4294967295) i[14] = o;
      else {
        let u = o.toString(16).match(/(.*?)(.{0,8})$/);
        if (u === null) return;
        let c = parseInt(
          u[2],
          16
        ), l = parseInt(u[1], 16) || 0;
        i[14] = c, i[15] = l;
      }
      return U2._md5cycle(this._state, i), e ? this._state : U2._hex(
        this._state
      );
    }
  };
  a(U, "Md5"), E(U, "stateIdentity", new Int32Array([1732584193, -271733879, -1732584194, 271733878])), E(U, "buffer32Identity", new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), E(U, "hexChars", "0123456789abcdef"), E(U, "hexOut", []), E(U, "onePassHasher", new U());
  et = U;
});
var lr = {};
ie(lr, { createHash: () => bu, createHmac: () => vu, randomBytes: () => gu });
function gu(r) {
  return crypto.getRandomValues(d.alloc(r));
}
function bu(r) {
  if (r === "sha256") return { update: a(function(e) {
    return { digest: a(
      function() {
        return d.from(Xe(e));
      },
      "digest"
    ) };
  }, "update") };
  if (r === "md5") return { update: a(function(e) {
    return {
      digest: a(function() {
        return typeof e == "string" ? et.hashStr(e) : et.hashByteArray(e);
      }, "digest")
    };
  }, "update") };
  throw new Error(`Hash type '${r}' not supported`);
}
function vu(r, e) {
  if (r !== "sha256") throw new Error(`Only sha256 is supported (requested: '${r}')`);
  return { update: a(function(t) {
    return { digest: a(
      function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(
          t
        ));
        let n = e.length;
        if (n > 64) e = Xe(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(
          64
        ), s = new Uint8Array(64);
        for (let c = 0; c < 64; c++) i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(Xe(o), 64), d.from(Xe(u));
      },
      "digest"
    ) };
  }, "update") };
}
var fr = G(() => {
  "use strict";
  p();
  es();
  ts();
  a(gu, "randomBytes");
  a(bu, "createHash");
  a(vu, "createHmac");
});
var tt = T((Qf, hr) => {
  "use strict";
  p();
  hr.exports = {
    host: "localhost",
    user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
    database: void 0,
    password: null,
    connectionString: void 0,
    port: 5432,
    rows: 0,
    binary: false,
    max: 10,
    idleTimeoutMillis: 3e4,
    client_encoding: "",
    ssl: false,
    application_name: void 0,
    fallback_application_name: void 0,
    options: void 0,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    lock_timeout: false,
    idle_in_transaction_session_timeout: false,
    query_timeout: false,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var Me = Je(), xu = Me.getTypeParser(20, "text"), Su = Me.getTypeParser(
    1016,
    "text"
  );
  hr.exports.__defineSetter__("parseInt8", function(r) {
    Me.setTypeParser(20, "text", r ? Me.getTypeParser(
      23,
      "text"
    ) : xu), Me.setTypeParser(1016, "text", r ? Me.getTypeParser(1007, "text") : Su);
  });
});
var rt = T((Wf, ns) => {
  "use strict";
  p();
  var Eu = (fr(), O(lr)), Au = tt();
  function Cu(r) {
    var e = r.replace(
      /\\/g,
      "\\\\"
    ).replace(/"/g, '\\"');
    return '"' + e + '"';
  }
  a(Cu, "escapeElement");
  function rs(r) {
    for (var e = "{", t = 0; t < r.length; t++) t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + rs(r[t]) : r[t] instanceof d ? e += "\\\\x" + r[t].toString("hex") : e += Cu(Ct(r[t]));
    return e = e + "}", e;
  }
  a(rs, "arrayString");
  var Ct = a(function(r, e) {
    if (r == null) return null;
    if (r instanceof d) return r;
    if (ArrayBuffer.isView(r)) {
      var t = d.from(r.buffer, r.byteOffset, r.byteLength);
      return t.length === r.byteLength ? t : t.slice(r.byteOffset, r.byteOffset + r.byteLength);
    }
    return r instanceof Date ? Au.parseInputDatesAsUTC ? Tu(r) : Iu(r) : Array.isArray(r) ? rs(r) : typeof r == "object" ? _u(r, e) : r.toString();
  }, "prepareValue");
  function _u(r, e) {
    if (r && typeof r.toPostgres == "function") {
      if (e = e || [], e.indexOf(r) !== -1) throw new Error('circular reference detected while preparing "' + r + '" for query');
      return e.push(r), Ct(r.toPostgres(Ct), e);
    }
    return JSON.stringify(r);
  }
  a(_u, "prepareObject");
  function N(r, e) {
    for (r = "" + r; r.length < e; ) r = "0" + r;
    return r;
  }
  a(N, "pad");
  function Iu(r) {
    var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
    n && (t = Math.abs(t) + 1);
    var i = N(t, 4) + "-" + N(r.getMonth() + 1, 2) + "-" + N(r.getDate(), 2) + "T" + N(
      r.getHours(),
      2
    ) + ":" + N(r.getMinutes(), 2) + ":" + N(r.getSeconds(), 2) + "." + N(r.getMilliseconds(), 3);
    return e < 0 ? (i += "-", e *= -1) : i += "+", i += N(Math.floor(e / 60), 2) + ":" + N(e % 60, 2), n && (i += " BC"), i;
  }
  a(Iu, "dateToString");
  function Tu(r) {
    var e = r.getUTCFullYear(), t = e < 1;
    t && (e = Math.abs(e) + 1);
    var n = N(e, 4) + "-" + N(r.getUTCMonth() + 1, 2) + "-" + N(r.getUTCDate(), 2) + "T" + N(r.getUTCHours(), 2) + ":" + N(r.getUTCMinutes(), 2) + ":" + N(r.getUTCSeconds(), 2) + "." + N(
      r.getUTCMilliseconds(),
      3
    );
    return n += "+00:00", t && (n += " BC"), n;
  }
  a(Tu, "dateToStringUTC");
  function Pu(r, e, t) {
    return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
  }
  a(Pu, "normalizeQueryConfig");
  var pr = a(function(r) {
    return Eu.createHash("md5").update(r, "utf-8").digest("hex");
  }, "md5"), Ru = a(
    function(r, e, t) {
      var n = pr(e + r), i = pr(d.concat([d.from(n), t]));
      return "md5" + i;
    },
    "postgresMd5PasswordHash"
  );
  ns.exports = {
    prepareValue: a(function(e) {
      return Ct(e);
    }, "prepareValueWrapper"),
    normalizeQueryConfig: Pu,
    postgresMd5PasswordHash: Ru,
    md5: pr
  };
});
var nt = {};
ie(nt, { default: () => ku });
var ku;
var it = G(() => {
  "use strict";
  p();
  ku = {};
});
var ds = T((th, ps) => {
  "use strict";
  p();
  var yr = (fr(), O(lr));
  function Mu(r) {
    if (r.indexOf("SCRAM-SHA-256") === -1) throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
    let e = yr.randomBytes(
      18
    ).toString("base64");
    return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
  }
  a(Mu, "startSession");
  function Uu(r, e, t) {
    if (r.message !== "SASLInitialResponse") throw new Error(
      "SASL: Last message was not SASLInitialResponse"
    );
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
    if (typeof t != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
    let n = qu(t);
    if (n.nonce.startsWith(r.clientNonce)) {
      if (n.nonce.length === r.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    var i = d.from(n.salt, "base64"), s = Wu(e, i, n.iteration), o = Ue(s, "Client Key"), u = Nu(
      o
    ), c = "n=*,r=" + r.clientNonce, l = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, f = "c=biws,r=" + n.nonce, y = c + "," + l + "," + f, g = Ue(u, y), A = hs(o, g), C = A.toString("base64"), D = Ue(s, "Server Key"), Y = Ue(D, y);
    r.message = "SASLResponse", r.serverSignature = Y.toString("base64"), r.response = f + ",p=" + C;
  }
  a(Uu, "continueSession");
  function Du(r, e) {
    if (r.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
    let { serverSignature: t } = Qu(
      e
    );
    if (t !== r.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
  }
  a(Du, "finalizeSession");
  function Ou(r) {
    if (typeof r != "string") throw new TypeError("SASL: text must be a string");
    return r.split("").map((e, t) => r.charCodeAt(t)).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
  }
  a(Ou, "isPrintableChars");
  function ls(r) {
    return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
  }
  a(ls, "isBase64");
  function fs2(r) {
    if (typeof r != "string") throw new TypeError("SASL: attribute pairs text must be a string");
    return new Map(r.split(",").map((e) => {
      if (!/^.=/.test(e)) throw new Error("SASL: Invalid attribute pair entry");
      let t = e[0], n = e.substring(2);
      return [t, n];
    }));
  }
  a(fs2, "parseAttributePairs");
  function qu(r) {
    let e = fs2(r), t = e.get("r");
    if (t) {
      if (!Ou(t)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
    let n = e.get("s");
    if (n) {
      if (!ls(n)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
    let i = e.get("i");
    if (i) {
      if (!/^[1-9][0-9]*$/.test(i)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
    let s = parseInt(i, 10);
    return { nonce: t, salt: n, iteration: s };
  }
  a(qu, "parseServerFirstMessage");
  function Qu(r) {
    let t = fs2(r).get("v");
    if (t) {
      if (!ls(t)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
    } else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
    return { serverSignature: t };
  }
  a(Qu, "parseServerFinalMessage");
  function hs(r, e) {
    if (!d.isBuffer(r)) throw new TypeError("first argument must be a Buffer");
    if (!d.isBuffer(e)) throw new TypeError(
      "second argument must be a Buffer"
    );
    if (r.length !== e.length) throw new Error("Buffer lengths must match");
    if (r.length === 0) throw new Error("Buffers cannot be empty");
    return d.from(r.map((t, n) => r[n] ^ e[n]));
  }
  a(hs, "xorBuffers");
  function Nu(r) {
    return yr.createHash("sha256").update(r).digest();
  }
  a(Nu, "sha256");
  function Ue(r, e) {
    return yr.createHmac("sha256", r).update(e).digest();
  }
  a(Ue, "hmacSha256");
  function Wu(r, e, t) {
    for (var n = Ue(
      r,
      d.concat([e, d.from([0, 0, 0, 1])])
    ), i = n, s = 0; s < t - 1; s++) n = Ue(r, n), i = hs(i, n);
    return i;
  }
  a(Wu, "Hi");
  ps.exports = { startSession: Mu, continueSession: Uu, finalizeSession: Du };
});
var mr = {};
ie(mr, { join: () => ju });
function ju(...r) {
  return r.join("/");
}
var wr = G(() => {
  "use strict";
  p();
  a(
    ju,
    "join"
  );
});
var gr = {};
ie(gr, { stat: () => Hu });
function Hu(r, e) {
  e(new Error("No filesystem"));
}
var br = G(() => {
  "use strict";
  p();
  a(Hu, "stat");
});
var vr = {};
ie(vr, { default: () => $u });
var $u;
var xr = G(() => {
  "use strict";
  p();
  $u = {};
});
var ys = {};
ie(ys, { StringDecoder: () => Sr });
var Er;
var Sr;
var ms = G(() => {
  "use strict";
  p();
  Er = class Er {
    constructor(e) {
      E(this, "td");
      this.td = new TextDecoder(e);
    }
    write(e) {
      return this.td.decode(e, { stream: true });
    }
    end(e) {
      return this.td.decode(e);
    }
  };
  a(Er, "StringDecoder");
  Sr = Er;
});
var vs = T((fh, bs) => {
  "use strict";
  p();
  var { Transform: Gu } = (xr(), O(vr)), { StringDecoder: Vu } = (ms(), O(ys)), ve = Symbol(
    "last"
  ), It = Symbol("decoder");
  function zu(r, e, t) {
    let n;
    if (this.overflow) {
      if (n = this[It].write(r).split(
        this.matcher
      ), n.length === 1) return t();
      n.shift(), this.overflow = false;
    } else this[ve] += this[It].write(r), n = this[ve].split(this.matcher);
    this[ve] = n.pop();
    for (let i = 0; i < n.length; i++) try {
      gs(this, this.mapper(n[i]));
    } catch (s) {
      return t(s);
    }
    if (this.overflow = this[ve].length > this.maxLength, this.overflow && !this.skipOverflow) {
      t(new Error(
        "maximum buffer reached"
      ));
      return;
    }
    t();
  }
  a(zu, "transform");
  function Ku(r) {
    if (this[ve] += this[It].end(), this[ve])
      try {
        gs(this, this.mapper(this[ve]));
      } catch (e) {
        return r(e);
      }
    r();
  }
  a(Ku, "flush");
  function gs(r, e) {
    e !== void 0 && r.push(e);
  }
  a(gs, "push");
  function ws(r) {
    return r;
  }
  a(ws, "noop");
  function Yu(r, e, t) {
    switch (r = r || /\r?\n/, e = e || ws, t = t || {}, arguments.length) {
      case 1:
        typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
        break;
      case 2:
        typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = ws);
    }
    t = Object.assign({}, t), t.autoDestroy = true, t.transform = zu, t.flush = Ku, t.readableObjectMode = true;
    let n = new Gu(t);
    return n[ve] = "", n[It] = new Vu("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
      this._writableState.errorEmitted = false, s(i);
    }, n;
  }
  a(Yu, "split");
  bs.exports = Yu;
});
var Es = T((dh, pe) => {
  "use strict";
  p();
  var xs = (wr(), O(mr)), Zu = (xr(), O(vr)).Stream, Ju = vs(), Ss = (it(), O(nt)), Xu = 5432, Tt = m.platform === "win32", st = m.stderr, ec = 56, tc = 7, rc = 61440, nc = 32768;
  function ic(r) {
    return (r & rc) == nc;
  }
  a(ic, "isRegFile");
  var De = ["host", "port", "database", "user", "password"], Ar = De.length, sc = De[Ar - 1];
  function Cr() {
    var r = st instanceof Zu && st.writable === true;
    if (r) {
      var e = Array.prototype.slice.call(arguments).concat(`
`);
      st.write(Ss.format.apply(Ss, e));
    }
  }
  a(Cr, "warn");
  Object.defineProperty(pe.exports, "isWin", { get: a(function() {
    return Tt;
  }, "get"), set: a(function(r) {
    Tt = r;
  }, "set") });
  pe.exports.warnTo = function(r) {
    var e = st;
    return st = r, e;
  };
  pe.exports.getFileName = function(r) {
    var e = r || m.env, t = e.PGPASSFILE || (Tt ? xs.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : xs.join(e.HOME || "./", ".pgpass"));
    return t;
  };
  pe.exports.usePgPass = function(r, e) {
    return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD") ? false : Tt ? true : (e = e || "<unkn>", ic(r.mode) ? r.mode & (ec | tc) ? (Cr('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (Cr('WARNING: password file "%s" is not a plain file', e), false));
  };
  var oc = pe.exports.match = function(r, e) {
    return De.slice(0, -1).reduce(function(t, n, i) {
      return i == 1 && Number(r[n] || Xu) === Number(
        e[n]
      ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
    }, true);
  };
  pe.exports.getPassword = function(r, e, t) {
    var n, i = e.pipe(
      Ju()
    );
    function s(c) {
      var l = ac(c);
      l && uc(l) && oc(r, l) && (n = l[sc], i.end());
    }
    a(s, "onLine");
    var o = a(function() {
      e.destroy(), t(n);
    }, "onEnd"), u = a(function(c) {
      e.destroy(), Cr("WARNING: error on reading file: %s", c), t(
        void 0
      );
    }, "onErr");
    e.on("error", u), i.on("data", s).on("end", o).on("error", u);
  };
  var ac = pe.exports.parseLine = function(r) {
    if (r.length < 11 || r.match(/^\s+#/)) return null;
    for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(
      function(f, y, g) {
        var A = r.substring(y, g);
        Object.hasOwnProperty.call(m.env, "PGPASS_NO_DEESCAPE") || (A = A.replace(/\\([:\\])/g, "$1")), o[De[f]] = A;
      },
      "addToObj"
    ), l = 0; l < r.length - 1; l += 1) {
      if (e = r.charAt(l + 1), t = r.charAt(
        l
      ), u = n == Ar - 1, u) {
        c(n, i);
        break;
      }
      l >= 0 && e == ":" && t !== "\\" && (c(n, i, l + 1), i = l + 2, n += 1);
    }
    return o = Object.keys(o).length === Ar ? o : null, o;
  }, uc = pe.exports.isValidEntry = function(r) {
    for (var e = { 0: function(o) {
      return o.length > 0;
    }, 1: function(o) {
      return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
    }, 2: function(o) {
      return o.length > 0;
    }, 3: function(o) {
      return o.length > 0;
    }, 4: function(o) {
      return o.length > 0;
    } }, t = 0; t < De.length; t += 1) {
      var n = e[t], i = r[De[t]] || "", s = n(i);
      if (!s) return false;
    }
    return true;
  };
});
var Cs = T((gh, _r) => {
  "use strict";
  p();
  var wh = (wr(), O(mr)), As = (br(), O(gr)), Pt = Es();
  _r.exports = function(r, e) {
    var t = Pt.getFileName();
    As.stat(t, function(n, i) {
      if (n || !Pt.usePgPass(i, t)) return e(void 0);
      var s = As.createReadStream(
        t
      );
      Pt.getPassword(r, s, e);
    });
  };
  _r.exports.warnTo = Pt.warnTo;
});
var _s = {};
ie(_s, { default: () => cc });
var cc;
var Is = G(() => {
  "use strict";
  p();
  cc = {};
});
var Ps = T((xh, Ts) => {
  "use strict";
  p();
  var lc = (Zt(), O(gi)), Ir = (br(), O(gr));
  function Tr(r) {
    if (r.charAt(0) === "/") {
      var t = r.split(" ");
      return { host: t[0], database: t[1] };
    }
    var e = lc.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(/\%25(\d\d)/g, "%$1") : r, true), t = e.query;
    for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
    var i = (e.auth || ":").split(":");
    if (t.user = i[0], t.password = i.splice(1).join(
      ":"
    ), t.port = e.port, e.protocol == "socket:") return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
    t.host || (t.host = e.hostname);
    var s = e.pathname;
    if (!t.host && s && /^%2f/i.test(s)) {
      var o = s.split("/");
      t.host = decodeURIComponent(o[0]), s = o.splice(1).join("/");
    }
    switch (s && s.charAt(
      0
    ) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = Ir.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = Ir.readFileSync(t.sslkey).toString()), t.sslrootcert && (t.ssl.ca = Ir.readFileSync(t.sslrootcert).toString()), t.sslmode) {
      case "disable": {
        t.ssl = false;
        break;
      }
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        break;
      case "no-verify": {
        t.ssl.rejectUnauthorized = false;
        break;
      }
    }
    return t;
  }
  a(Tr, "parse");
  Ts.exports = Tr;
  Tr.parse = Tr;
});
var Rt = T((Ah, Ls) => {
  "use strict";
  p();
  var fc = (Is(), O(_s)), Bs = tt(), Rs = Ps().parse, H = a(function(r, e, t) {
    return t === void 0 ? t = m.env["PG" + r.toUpperCase()] : t === false || (t = m.env[t]), e[r] || t || Bs[r];
  }, "val"), hc = a(function() {
    switch (m.env.PGSSLMODE) {
      case "disable":
        return false;
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        return true;
      case "no-verify":
        return { rejectUnauthorized: false };
    }
    return Bs.ssl;
  }, "readSSLConfigFromEnvironment"), Oe = a(function(r) {
    return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  }, "quoteParamValue"), ne = a(function(r, e, t) {
    var n = e[t];
    n != null && r.push(t + "=" + Oe(n));
  }, "add"), Rr = class Rr {
    constructor(e) {
      e = typeof e == "string" ? Rs(e) : e || {}, e.connectionString && (e = Object.assign({}, e, Rs(e.connectionString))), this.user = H("user", e), this.database = H("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(H("port", e), 10), this.host = H("host", e), Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: H("password", e)
      }), this.binary = H("binary", e), this.options = H("options", e), this.ssl = typeof e.ssl > "u" ? hc() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = H("client_encoding", e), this.replication = H("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = H("application_name", e, "PGAPPNAME"), this.fallback_application_name = H("fallback_application_name", e, false), this.statement_timeout = H("statement_timeout", e, false), this.lock_timeout = H("lock_timeout", e, false), this.idle_in_transaction_session_timeout = H("idle_in_transaction_session_timeout", e, false), this.query_timeout = H("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
    }
    getLibpqConnectionString(e) {
      var t = [];
      ne(t, this, "user"), ne(t, this, "password"), ne(t, this, "port"), ne(t, this, "application_name"), ne(
        t,
        this,
        "fallback_application_name"
      ), ne(t, this, "connect_timeout"), ne(t, this, "options");
      var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
      if (ne(t, n, "sslmode"), ne(t, n, "sslca"), ne(t, n, "sslkey"), ne(t, n, "sslcert"), ne(t, n, "sslrootcert"), this.database && t.push("dbname=" + Oe(this.database)), this.replication && t.push("replication=" + Oe(this.replication)), this.host && t.push("host=" + Oe(this.host)), this.isDomainSocket) return e(null, t.join(" "));
      this.client_encoding && t.push("client_encoding=" + Oe(this.client_encoding)), fc.lookup(this.host, function(i, s) {
        return i ? e(i, null) : (t.push("hostaddr=" + Oe(s)), e(null, t.join(" ")));
      });
    }
  };
  a(Rr, "ConnectionParameters");
  var Pr = Rr;
  Ls.exports = Pr;
});
var Ms = T((Ih, ks) => {
  "use strict";
  p();
  var pc = Je(), Fs = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, Lr = class Lr {
    constructor(e, t) {
      this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
    }
    addCommandComplete(e) {
      var t;
      e.text ? t = Fs.exec(e.text) : t = Fs.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(
        t[2],
        10
      ), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(t[2], 10)));
    }
    _parseRowAsArray(e) {
      for (var t = new Array(
        e.length
      ), n = 0, i = e.length; n < i; n++) {
        var s = e[n];
        s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
      }
      return t;
    }
    parseRow(e) {
      for (var t = {}, n = 0, i = e.length; n < i; n++) {
        var s = e[n], o = this.fields[n].name;
        s !== null ? t[o] = this._parsers[n](
          s
        ) : t[o] = null;
      }
      return t;
    }
    addRow(e) {
      this.rows.push(e);
    }
    addFields(e) {
      this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = pc.getTypeParser(n.dataTypeID, n.format || "text");
      }
    }
  };
  a(Lr, "Result");
  var Br = Lr;
  ks.exports = Br;
});
var qs = T((Rh, Os) => {
  "use strict";
  p();
  var { EventEmitter: dc } = ge(), Us = Ms(), Ds = rt(), kr = class kr extends dc {
    constructor(e, t, n) {
      super(), e = Ds.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, m.domain && e.callback && (this.callback = m.domain.bind(e.callback)), this._result = new Us(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
    }
    requiresPreparation() {
      return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
    }
    _checkForMultirow() {
      this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new Us(this._rowMode, this.types), this._results.push(this._result));
    }
    handleRowDescription(e) {
      this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
    }
    handleDataRow(e) {
      let t;
      if (!this._canceledDueToError) {
        try {
          t = this._result.parseRow(
            e.fields
          );
        } catch (n) {
          this._canceledDueToError = n;
          return;
        }
        this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
      }
    }
    handleCommandComplete(e, t) {
      this._checkForMultirow(), this._result.addCommandComplete(
        e
      ), this.rows && t.sync();
    }
    handleEmptyQuery(e) {
      this.rows && e.sync();
    }
    handleError(e, t) {
      if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e);
      this.emit("error", e);
    }
    handleReadyForQuery(e) {
      if (this._canceledDueToError) return this.handleError(
        this._canceledDueToError,
        e
      );
      if (this.callback) try {
        this.callback(null, this._results);
      } catch (t) {
        m.nextTick(() => {
          throw t;
        });
      }
      this.emit(
        "end",
        this._results
      );
    }
    submit(e) {
      if (typeof this.text != "string" && typeof this.name != "string") return new Error(
        "A query must have either text or a name. Supplying neither is unsupported."
      );
      let t = e.parsedStatements[this.name];
      return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
    }
    hasBeenParsed(e) {
      return this.name && e.parsedStatements[this.name];
    }
    handlePortalSuspended(e) {
      this._getRows(e, this.rows);
    }
    _getRows(e, t) {
      e.execute({ portal: this.portal, rows: t }), t ? e.flush() : e.sync();
    }
    prepare(e) {
      this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
      try {
        e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: Ds.prepareValue });
      } catch (t) {
        this.handleError(t, e);
        return;
      }
      e.describe({ type: "P", name: this.portal || "" }), this._getRows(e, this.rows);
    }
    handleCopyInResponse(e) {
      e.sendCopyFail("No source stream defined");
    }
    handleCopyData(e, t) {
    }
  };
  a(kr, "Query");
  var Fr = kr;
  Os.exports = Fr;
});
var ln = T((_) => {
  "use strict";
  p();
  Object.defineProperty(_, "__esModule", { value: true });
  _.NoticeMessage = _.DataRowMessage = _.CommandCompleteMessage = _.ReadyForQueryMessage = _.NotificationResponseMessage = _.BackendKeyDataMessage = _.AuthenticationMD5Password = _.ParameterStatusMessage = _.ParameterDescriptionMessage = _.RowDescriptionMessage = _.Field = _.CopyResponse = _.CopyDataMessage = _.DatabaseError = _.copyDone = _.emptyQuery = _.replicationStart = _.portalSuspended = _.noData = _.closeComplete = _.bindComplete = _.parseComplete = void 0;
  _.parseComplete = { name: "parseComplete", length: 5 };
  _.bindComplete = { name: "bindComplete", length: 5 };
  _.closeComplete = { name: "closeComplete", length: 5 };
  _.noData = { name: "noData", length: 5 };
  _.portalSuspended = { name: "portalSuspended", length: 5 };
  _.replicationStart = { name: "replicationStart", length: 4 };
  _.emptyQuery = { name: "emptyQuery", length: 4 };
  _.copyDone = { name: "copyDone", length: 4 };
  var Kr = class Kr extends Error {
    constructor(e, t, n) {
      super(e), this.length = t, this.name = n;
    }
  };
  a(Kr, "DatabaseError");
  var Mr = Kr;
  _.DatabaseError = Mr;
  var Yr = class Yr {
    constructor(e, t) {
      this.length = e, this.chunk = t, this.name = "copyData";
    }
  };
  a(Yr, "CopyDataMessage");
  var Ur = Yr;
  _.CopyDataMessage = Ur;
  var Zr = class Zr {
    constructor(e, t, n, i) {
      this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
    }
  };
  a(Zr, "CopyResponse");
  var Dr = Zr;
  _.CopyResponse = Dr;
  var Jr = class Jr {
    constructor(e, t, n, i, s, o, u) {
      this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
    }
  };
  a(Jr, "Field");
  var Or = Jr;
  _.Field = Or;
  var Xr = class Xr {
    constructor(e, t) {
      this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(this.fieldCount);
    }
  };
  a(Xr, "RowDescriptionMessage");
  var qr = Xr;
  _.RowDescriptionMessage = qr;
  var en = class en {
    constructor(e, t) {
      this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
    }
  };
  a(en, "ParameterDescriptionMessage");
  var Qr = en;
  _.ParameterDescriptionMessage = Qr;
  var tn = class tn {
    constructor(e, t, n) {
      this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
    }
  };
  a(tn, "ParameterStatusMessage");
  var Nr = tn;
  _.ParameterStatusMessage = Nr;
  var rn = class rn {
    constructor(e, t) {
      this.length = e, this.salt = t, this.name = "authenticationMD5Password";
    }
  };
  a(rn, "AuthenticationMD5Password");
  var Wr = rn;
  _.AuthenticationMD5Password = Wr;
  var nn = class nn {
    constructor(e, t, n) {
      this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
    }
  };
  a(nn, "BackendKeyDataMessage");
  var jr = nn;
  _.BackendKeyDataMessage = jr;
  var sn = class sn {
    constructor(e, t, n, i) {
      this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
    }
  };
  a(sn, "NotificationResponseMessage");
  var Hr = sn;
  _.NotificationResponseMessage = Hr;
  var on = class on {
    constructor(e, t) {
      this.length = e, this.status = t, this.name = "readyForQuery";
    }
  };
  a(on, "ReadyForQueryMessage");
  var $r = on;
  _.ReadyForQueryMessage = $r;
  var an = class an {
    constructor(e, t) {
      this.length = e, this.text = t, this.name = "commandComplete";
    }
  };
  a(an, "CommandCompleteMessage");
  var Gr = an;
  _.CommandCompleteMessage = Gr;
  var un = class un {
    constructor(e, t) {
      this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
    }
  };
  a(un, "DataRowMessage");
  var Vr = un;
  _.DataRowMessage = Vr;
  var cn = class cn {
    constructor(e, t) {
      this.length = e, this.message = t, this.name = "notice";
    }
  };
  a(cn, "NoticeMessage");
  var zr = cn;
  _.NoticeMessage = zr;
});
var Qs = T((Bt) => {
  "use strict";
  p();
  Object.defineProperty(Bt, "__esModule", { value: true });
  Bt.Writer = void 0;
  var hn = class hn {
    constructor(e = 256) {
      this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = d.allocUnsafe(e);
    }
    ensure(e) {
      if (this.buffer.length - this.offset < e) {
        let n = this.buffer, i = n.length + (n.length >> 1) + e;
        this.buffer = d.allocUnsafe(i), n.copy(
          this.buffer
        );
      }
    }
    addInt32(e) {
      return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addInt16(e) {
      return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addCString(e) {
      if (!e) this.ensure(1);
      else {
        let t = d.byteLength(e);
        this.ensure(t + 1), this.buffer.write(e, this.offset, "utf-8"), this.offset += t;
      }
      return this.buffer[this.offset++] = 0, this;
    }
    addString(e = "") {
      let t = d.byteLength(e);
      return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
    }
    add(e) {
      return this.ensure(
        e.length
      ), e.copy(this.buffer, this.offset), this.offset += e.length, this;
    }
    join(e) {
      if (e) {
        this.buffer[this.headerPosition] = e;
        let t = this.offset - (this.headerPosition + 1);
        this.buffer.writeInt32BE(t, this.headerPosition + 1);
      }
      return this.buffer.slice(e ? 0 : 5, this.offset);
    }
    flush(e) {
      let t = this.join(e);
      return this.offset = 5, this.headerPosition = 0, this.buffer = d.allocUnsafe(this.size), t;
    }
  };
  a(hn, "Writer");
  var fn = hn;
  Bt.Writer = fn;
});
var Ws = T((Ft) => {
  "use strict";
  p();
  Object.defineProperty(Ft, "__esModule", { value: true });
  Ft.serialize = void 0;
  var pn = Qs(), F = new pn.Writer(), yc = a((r) => {
    F.addInt16(3).addInt16(0);
    for (let n of Object.keys(r)) F.addCString(
      n
    ).addCString(r[n]);
    F.addCString("client_encoding").addCString("UTF8");
    let e = F.addCString("").flush(), t = e.length + 4;
    return new pn.Writer().addInt32(t).add(e).flush();
  }, "startup"), mc = a(() => {
    let r = d.allocUnsafe(
      8
    );
    return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
  }, "requestSsl"), wc = a((r) => F.addCString(r).flush(
    112
  ), "password"), gc = a(function(r, e) {
    return F.addCString(r).addInt32(d.byteLength(e)).addString(e), F.flush(112);
  }, "sendSASLInitialResponseMessage"), bc = a(function(r) {
    return F.addString(r).flush(112);
  }, "sendSCRAMClientFinalMessage"), vc = a((r) => F.addCString(r).flush(81), "query"), Ns = [], xc = a((r) => {
    let e = r.name || "";
    e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
    let t = r.types || Ns, n = t.length, i = F.addCString(e).addCString(r.text).addInt16(n);
    for (let s = 0; s < n; s++) i.addInt32(t[s]);
    return F.flush(80);
  }, "parse"), qe = new pn.Writer(), Sc = a(function(r, e) {
    for (let t = 0; t < r.length; t++) {
      let n = e ? e(r[t], t) : r[t];
      n == null ? (F.addInt16(0), qe.addInt32(-1)) : n instanceof d ? (F.addInt16(
        1
      ), qe.addInt32(n.length), qe.add(n)) : (F.addInt16(0), qe.addInt32(d.byteLength(n)), qe.addString(n));
    }
  }, "writeValues"), Ec = a((r = {}) => {
    let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || Ns, s = i.length;
    return F.addCString(e).addCString(t), F.addInt16(s), Sc(i, r.valueMapper), F.addInt16(s), F.add(qe.flush()), F.addInt16(n ? 1 : 0), F.flush(66);
  }, "bind"), Ac = d.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Cc = a((r) => {
    if (!r || !r.portal && !r.rows) return Ac;
    let e = r.portal || "", t = r.rows || 0, n = d.byteLength(e), i = 4 + n + 1 + 4, s = d.allocUnsafe(1 + i);
    return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
  }, "execute"), _c = a(
    (r, e) => {
      let t = d.allocUnsafe(16);
      return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(
        5678,
        6
      ), t.writeInt32BE(r, 8), t.writeInt32BE(e, 12), t;
    },
    "cancel"
  ), dn = a((r, e) => {
    let n = 4 + d.byteLength(e) + 1, i = d.allocUnsafe(1 + n);
    return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
  }, "cstringMessage"), Ic = F.addCString("P").flush(68), Tc = F.addCString("S").flush(68), Pc = a((r) => r.name ? dn(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Ic : Tc, "describe"), Rc = a((r) => {
    let e = `${r.type}${r.name || ""}`;
    return dn(67, e);
  }, "close"), Bc = a((r) => F.add(r).flush(100), "copyData"), Lc = a((r) => dn(102, r), "copyFail"), Lt = a((r) => d.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), Fc = Lt(72), kc = Lt(83), Mc = Lt(88), Uc = Lt(99), Dc = {
    startup: yc,
    password: wc,
    requestSsl: mc,
    sendSASLInitialResponseMessage: gc,
    sendSCRAMClientFinalMessage: bc,
    query: vc,
    parse: xc,
    bind: Ec,
    execute: Cc,
    describe: Pc,
    close: Rc,
    flush: a(
      () => Fc,
      "flush"
    ),
    sync: a(() => kc, "sync"),
    end: a(() => Mc, "end"),
    copyData: Bc,
    copyDone: a(() => Uc, "copyDone"),
    copyFail: Lc,
    cancel: _c
  };
  Ft.serialize = Dc;
});
var js = T((kt) => {
  "use strict";
  p();
  Object.defineProperty(kt, "__esModule", { value: true });
  kt.BufferReader = void 0;
  var Oc = d.allocUnsafe(0), mn = class mn {
    constructor(e = 0) {
      this.offset = e, this.buffer = Oc, this.encoding = "utf-8";
    }
    setBuffer(e, t) {
      this.offset = e, this.buffer = t;
    }
    int16() {
      let e = this.buffer.readInt16BE(this.offset);
      return this.offset += 2, e;
    }
    byte() {
      let e = this.buffer[this.offset];
      return this.offset++, e;
    }
    int32() {
      let e = this.buffer.readInt32BE(
        this.offset
      );
      return this.offset += 4, e;
    }
    uint32() {
      let e = this.buffer.readUInt32BE(this.offset);
      return this.offset += 4, e;
    }
    string(e) {
      let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
      return this.offset += e, t;
    }
    cstring() {
      let e = this.offset, t = e;
      for (; this.buffer[t++] !== 0; ) ;
      return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
    }
    bytes(e) {
      let t = this.buffer.slice(this.offset, this.offset + e);
      return this.offset += e, t;
    }
  };
  a(mn, "BufferReader");
  var yn = mn;
  kt.BufferReader = yn;
});
var Gs = T((Mt) => {
  "use strict";
  p();
  Object.defineProperty(Mt, "__esModule", { value: true });
  Mt.Parser = void 0;
  var k = ln(), qc = js(), wn = 1, Qc = 4, Hs = wn + Qc, $s = d.allocUnsafe(0), bn = class bn {
    constructor(e) {
      if (this.buffer = $s, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new qc.BufferReader(), e?.mode === "binary") throw new Error("Binary mode not supported yet");
      this.mode = e?.mode || "text";
    }
    parse(e, t) {
      this.mergeBuffer(e);
      let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
      for (; i + Hs <= n; ) {
        let s = this.buffer[i], o = this.buffer.readUInt32BE(
          i + wn
        ), u = wn + o;
        if (u + i <= n) {
          let c = this.handlePacket(i + Hs, s, o, this.buffer);
          t(c), i += u;
        } else break;
      }
      i === n ? (this.buffer = $s, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
    }
    mergeBuffer(e) {
      if (this.bufferLength > 0) {
        let t = this.bufferLength + e.byteLength;
        if (t + this.bufferOffset > this.buffer.byteLength) {
          let i;
          if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) i = this.buffer;
          else {
            let s = this.buffer.byteLength * 2;
            for (; t >= s; ) s *= 2;
            i = d.allocUnsafe(s);
          }
          this.buffer.copy(i, 0, this.bufferOffset, this.bufferOffset + this.bufferLength), this.buffer = i, this.bufferOffset = 0;
        }
        e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
      } else this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
    }
    handlePacket(e, t, n, i) {
      switch (t) {
        case 50:
          return k.bindComplete;
        case 49:
          return k.parseComplete;
        case 51:
          return k.closeComplete;
        case 110:
          return k.noData;
        case 115:
          return k.portalSuspended;
        case 99:
          return k.copyDone;
        case 87:
          return k.replicationStart;
        case 73:
          return k.emptyQuery;
        case 68:
          return this.parseDataRowMessage(e, n, i);
        case 67:
          return this.parseCommandCompleteMessage(
            e,
            n,
            i
          );
        case 90:
          return this.parseReadyForQueryMessage(e, n, i);
        case 65:
          return this.parseNotificationMessage(
            e,
            n,
            i
          );
        case 82:
          return this.parseAuthenticationResponse(e, n, i);
        case 83:
          return this.parseParameterStatusMessage(
            e,
            n,
            i
          );
        case 75:
          return this.parseBackendKeyData(e, n, i);
        case 69:
          return this.parseErrorMessage(e, n, i, "error");
        case 78:
          return this.parseErrorMessage(e, n, i, "notice");
        case 84:
          return this.parseRowDescriptionMessage(
            e,
            n,
            i
          );
        case 116:
          return this.parseParameterDescriptionMessage(e, n, i);
        case 71:
          return this.parseCopyInMessage(
            e,
            n,
            i
          );
        case 72:
          return this.parseCopyOutMessage(e, n, i);
        case 100:
          return this.parseCopyData(e, n, i);
        default:
          return new k.DatabaseError("received invalid response: " + t.toString(16), n, "error");
      }
    }
    parseReadyForQueryMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.string(1);
      return new k.ReadyForQueryMessage(t, i);
    }
    parseCommandCompleteMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring();
      return new k.CommandCompleteMessage(t, i);
    }
    parseCopyData(e, t, n) {
      let i = n.slice(e, e + (t - 4));
      return new k.CopyDataMessage(t, i);
    }
    parseCopyInMessage(e, t, n) {
      return this.parseCopyMessage(
        e,
        t,
        n,
        "copyInResponse"
      );
    }
    parseCopyOutMessage(e, t, n) {
      return this.parseCopyMessage(e, t, n, "copyOutResponse");
    }
    parseCopyMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = this.reader.byte() !== 0, o = this.reader.int16(), u = new k.CopyResponse(t, i, s, o);
      for (let c = 0; c < o; c++) u.columnTypes[c] = this.reader.int16();
      return u;
    }
    parseNotificationMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int32(), s = this.reader.cstring(), o = this.reader.cstring();
      return new k.NotificationResponseMessage(t, i, s, o);
    }
    parseRowDescriptionMessage(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int16(), s = new k.RowDescriptionMessage(t, i);
      for (let o = 0; o < i; o++) s.fields[o] = this.parseField();
      return s;
    }
    parseField() {
      let e = this.reader.cstring(), t = this.reader.uint32(), n = this.reader.int16(), i = this.reader.uint32(), s = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
      return new k.Field(e, t, n, i, s, o, u);
    }
    parseParameterDescriptionMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new k.ParameterDescriptionMessage(t, i);
      for (let o = 0; o < i; o++)
        s.dataTypeIDs[o] = this.reader.int32();
      return s;
    }
    parseDataRowMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new Array(i);
      for (let o = 0; o < i; o++) {
        let u = this.reader.int32();
        s[o] = u === -1 ? null : this.reader.string(u);
      }
      return new k.DataRowMessage(t, s);
    }
    parseParameterStatusMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring(), s = this.reader.cstring();
      return new k.ParameterStatusMessage(
        t,
        i,
        s
      );
    }
    parseBackendKeyData(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int32(), s = this.reader.int32();
      return new k.BackendKeyDataMessage(t, i, s);
    }
    parseAuthenticationResponse(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int32(), s = { name: "authenticationOk", length: t };
      switch (i) {
        case 0:
          break;
        case 3:
          s.length === 8 && (s.name = "authenticationCleartextPassword");
          break;
        case 5:
          if (s.length === 12) {
            s.name = "authenticationMD5Password";
            let o = this.reader.bytes(4);
            return new k.AuthenticationMD5Password(t, o);
          }
          break;
        case 10:
          {
            s.name = "authenticationSASL", s.mechanisms = [];
            let o;
            do
              o = this.reader.cstring(), o && s.mechanisms.push(o);
            while (o);
          }
          break;
        case 11:
          s.name = "authenticationSASLContinue", s.data = this.reader.string(t - 8);
          break;
        case 12:
          s.name = "authenticationSASLFinal", s.data = this.reader.string(t - 8);
          break;
        default:
          throw new Error("Unknown authenticationOk message type " + i);
      }
      return s;
    }
    parseErrorMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = {}, o = this.reader.string(1);
      for (; o !== "\0"; ) s[o] = this.reader.cstring(), o = this.reader.string(1);
      let u = s.M, c = i === "notice" ? new k.NoticeMessage(t, u) : new k.DatabaseError(u, t, i);
      return c.severity = s.S, c.code = s.C, c.detail = s.D, c.hint = s.H, c.position = s.P, c.internalPosition = s.p, c.internalQuery = s.q, c.where = s.W, c.schema = s.s, c.table = s.t, c.column = s.c, c.dataType = s.d, c.constraint = s.n, c.file = s.F, c.line = s.L, c.routine = s.R, c;
    }
  };
  a(bn, "Parser");
  var gn = bn;
  Mt.Parser = gn;
});
var vn = T((xe) => {
  "use strict";
  p();
  Object.defineProperty(xe, "__esModule", { value: true });
  xe.DatabaseError = xe.serialize = xe.parse = void 0;
  var Nc = ln();
  Object.defineProperty(xe, "DatabaseError", { enumerable: true, get: a(
    function() {
      return Nc.DatabaseError;
    },
    "get"
  ) });
  var Wc = Ws();
  Object.defineProperty(xe, "serialize", {
    enumerable: true,
    get: a(function() {
      return Wc.serialize;
    }, "get")
  });
  var jc = Gs();
  function Hc(r, e) {
    let t = new jc.Parser();
    return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
  }
  a(Hc, "parse");
  xe.parse = Hc;
});
var Vs = {};
ie(Vs, { connect: () => $c });
function $c({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
var zs = G(
  () => {
    "use strict";
    p();
    a($c, "connect");
  }
);
var En = T((Xh, Zs) => {
  "use strict";
  p();
  var Ks = (Fe(), O(wi)), Gc = ge().EventEmitter, { parse: Vc, serialize: Q } = vn(), Ys = Q.flush(), zc = Q.sync(), Kc = Q.end(), Sn = class Sn extends Gc {
    constructor(e) {
      super(), e = e || {}, this.stream = e.stream || new Ks.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
      var t = this;
      this.on("newListener", function(n) {
        n === "message" && (t._emitMessage = true);
      });
    }
    connect(e, t) {
      var n = this;
      this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(e, t), this.stream.once("connect", function() {
        n._keepAlive && n.stream.setKeepAlive(true, n._keepAliveInitialDelayMillis), n.emit("connect");
      });
      let i = a(function(s) {
        n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
      }, "reportStreamError");
      if (this.stream.on("error", i), this.stream.on("close", function() {
        n.emit("end");
      }), !this.ssl) return this.attachListeners(
        this.stream
      );
      this.stream.once("data", function(s) {
        var o = s.toString("utf8");
        switch (o) {
          case "S":
            break;
          case "N":
            return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
          default:
            return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
        }
        var u = (zs(), O(Vs));
        let c = { socket: n.stream };
        n.ssl !== true && (Object.assign(c, n.ssl), "key" in n.ssl && (c.key = n.ssl.key)), Ks.isIP(t) === 0 && (c.servername = t);
        try {
          n.stream = u.connect(c);
        } catch (l) {
          return n.emit(
            "error",
            l
          );
        }
        n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
      });
    }
    attachListeners(e) {
      e.on(
        "end",
        () => {
          this.emit("end");
        }
      ), Vc(e, (t) => {
        var n = t.name === "error" ? "errorMessage" : t.name;
        this._emitMessage && this.emit("message", t), this.emit(n, t);
      });
    }
    requestSsl() {
      this.stream.write(Q.requestSsl());
    }
    startup(e) {
      this.stream.write(Q.startup(e));
    }
    cancel(e, t) {
      this._send(Q.cancel(e, t));
    }
    password(e) {
      this._send(Q.password(e));
    }
    sendSASLInitialResponseMessage(e, t) {
      this._send(Q.sendSASLInitialResponseMessage(e, t));
    }
    sendSCRAMClientFinalMessage(e) {
      this._send(Q.sendSCRAMClientFinalMessage(
        e
      ));
    }
    _send(e) {
      return this.stream.writable ? this.stream.write(e) : false;
    }
    query(e) {
      this._send(Q.query(e));
    }
    parse(e) {
      this._send(Q.parse(e));
    }
    bind(e) {
      this._send(Q.bind(e));
    }
    execute(e) {
      this._send(Q.execute(e));
    }
    flush() {
      this.stream.writable && this.stream.write(Ys);
    }
    sync() {
      this._ending = true, this._send(Ys), this._send(zc);
    }
    ref() {
      this.stream.ref();
    }
    unref() {
      this.stream.unref();
    }
    end() {
      if (this._ending = true, !this._connecting || !this.stream.writable) {
        this.stream.end();
        return;
      }
      return this.stream.write(Kc, () => {
        this.stream.end();
      });
    }
    close(e) {
      this._send(Q.close(e));
    }
    describe(e) {
      this._send(Q.describe(e));
    }
    sendCopyFromChunk(e) {
      this._send(Q.copyData(e));
    }
    endCopyFrom() {
      this._send(Q.copyDone());
    }
    sendCopyFail(e) {
      this._send(Q.copyFail(e));
    }
  };
  a(Sn, "Connection");
  var xn = Sn;
  Zs.exports = xn;
});
var eo = T((np, Xs) => {
  "use strict";
  p();
  var Yc = ge().EventEmitter, rp = (it(), O(nt)), Zc = rt(), An = ds(), Jc = Cs(), Xc = At(), el = Rt(), Js = qs(), tl = tt(), rl = En(), Cn = class Cn extends Yc {
    constructor(e) {
      super(), this.connectionParameters = new el(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(
        this,
        "password",
        { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }
      ), this.replication = this.connectionParameters.replication;
      var t = e || {};
      this._Promise = t.Promise || b.Promise, this._types = new Xc(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new rl({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || tl.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
    }
    _errorAllQueries(e) {
      let t = a((n) => {
        m.nextTick(() => {
          n.handleError(e, this.connection);
        });
      }, "enqueueError");
      this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
    }
    _connect(e) {
      var t = this, n = this.connection;
      if (this._connectionCallback = e, this._connecting || this._connected) {
        let i = new Error("Client has already been connected. You cannot reuse a client.");
        m.nextTick(
          () => {
            e(i);
          }
        );
        return;
      }
      this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
        n._ending = true, n.stream.destroy(new Error("timeout expired"));
      }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
        t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
      }), n.on("sslconnect", function() {
        n.startup(t.getStartupConf());
      }), this._attachListeners(
        n
      ), n.once("end", () => {
        let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
        clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(i)), m.nextTick(() => {
          this.emit("end");
        });
      });
    }
    connect(e) {
      if (e) {
        this._connect(e);
        return;
      }
      return new this._Promise((t, n) => {
        this._connect((i) => {
          i ? n(i) : t();
        });
      });
    }
    _attachListeners(e) {
      e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on("errorMessage", this._handleErrorMessage.bind(this)), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(
        this
      )), e.on("emptyQuery", this._handleEmptyQuery.bind(this)), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
    }
    _checkPgPass(e) {
      let t = this.connection;
      typeof this.password == "function" ? this._Promise.resolve().then(() => this.password()).then((n) => {
        if (n !== void 0) {
          if (typeof n != "string") {
            t.emit("error", new TypeError(
              "Password must be a string"
            ));
            return;
          }
          this.connectionParameters.password = this.password = n;
        } else this.connectionParameters.password = this.password = null;
        e();
      }).catch((n) => {
        t.emit("error", n);
      }) : this.password !== null ? e() : Jc(
        this.connectionParameters,
        (n) => {
          n !== void 0 && (this.connectionParameters.password = this.password = n), e();
        }
      );
    }
    _handleAuthCleartextPassword(e) {
      this._checkPgPass(() => {
        this.connection.password(this.password);
      });
    }
    _handleAuthMD5Password(e) {
      this._checkPgPass(
        () => {
          let t = Zc.postgresMd5PasswordHash(this.user, this.password, e.salt);
          this.connection.password(t);
        }
      );
    }
    _handleAuthSASL(e) {
      this._checkPgPass(() => {
        this.saslSession = An.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
          this.saslSession.mechanism,
          this.saslSession.response
        );
      });
    }
    _handleAuthSASLContinue(e) {
      An.continueSession(
        this.saslSession,
        this.password,
        e.data
      ), this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
    }
    _handleAuthSASLFinal(e) {
      An.finalizeSession(this.saslSession, e.data), this.saslSession = null;
    }
    _handleBackendKeyData(e) {
      this.processID = e.processID, this.secretKey = e.secretKey;
    }
    _handleReadyForQuery(e) {
      this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
      let { activeQuery: t } = this;
      this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
    }
    _handleErrorWhileConnecting(e) {
      if (!this._connectionError) {
        if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e);
        this.emit("error", e);
      }
    }
    _handleErrorEvent(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
    }
    _handleErrorMessage(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      let t = this.activeQuery;
      if (!t) {
        this._handleErrorEvent(e);
        return;
      }
      this.activeQuery = null, t.handleError(
        e,
        this.connection
      );
    }
    _handleRowDescription(e) {
      this.activeQuery.handleRowDescription(e);
    }
    _handleDataRow(e) {
      this.activeQuery.handleDataRow(e);
    }
    _handlePortalSuspended(e) {
      this.activeQuery.handlePortalSuspended(this.connection);
    }
    _handleEmptyQuery(e) {
      this.activeQuery.handleEmptyQuery(this.connection);
    }
    _handleCommandComplete(e) {
      this.activeQuery.handleCommandComplete(e, this.connection);
    }
    _handleParseComplete(e) {
      this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
    }
    _handleCopyInResponse(e) {
      this.activeQuery.handleCopyInResponse(this.connection);
    }
    _handleCopyData(e) {
      this.activeQuery.handleCopyData(
        e,
        this.connection
      );
    }
    _handleNotification(e) {
      this.emit("notification", e);
    }
    _handleNotice(e) {
      this.emit("notice", e);
    }
    getStartupConf() {
      var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
      return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(e.statement_timeout, 10))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(e.idle_in_transaction_session_timeout, 10))), e.options && (t.options = e.options), t;
    }
    cancel(e, t) {
      if (e.activeQuery === t) {
        var n = this.connection;
        this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
          n.cancel(
            e.processID,
            e.secretKey
          );
        });
      } else e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
    }
    setTypeParser(e, t, n) {
      return this._types.setTypeParser(e, t, n);
    }
    getTypeParser(e, t) {
      return this._types.getTypeParser(e, t);
    }
    escapeIdentifier(e) {
      return '"' + e.replace(/"/g, '""') + '"';
    }
    escapeLiteral(e) {
      for (var t = false, n = "'", i = 0; i < e.length; i++) {
        var s = e[i];
        s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
      }
      return n += "'", t === true && (n = " E" + n), n;
    }
    _pulseQueryQueue() {
      if (this.readyForQuery === true) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
        this.readyForQuery = false, this.hasExecuted = true;
        let e = this.activeQuery.submit(this.connection);
        e && m.nextTick(() => {
          this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
        });
      } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
    }
    query(e, t, n) {
      var i, s, o, u, c;
      if (e == null) throw new TypeError(
        "Client was passed a null or undefined query"
      );
      return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new Js(e, t, n), i.callback || (s = new this._Promise((l, f) => {
        i.callback = (y, g) => y ? f(y) : l(g);
      }))), o && (c = i.callback, u = setTimeout(() => {
        var l = new Error("Query read timeout");
        m.nextTick(
          () => {
            i.handleError(l, this.connection);
          }
        ), c(l), i.callback = () => {
        };
        var f = this.queryQueue.indexOf(i);
        f > -1 && this.queryQueue.splice(f, 1), this._pulseQueryQueue();
      }, o), i.callback = (l, f) => {
        clearTimeout(u), c(l, f);
      }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (m.nextTick(() => {
        i.handleError(new Error("Client was closed and is not queryable"), this.connection);
      }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (m.nextTick(() => {
        i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
      }), s);
    }
    ref() {
      this.connection.ref();
    }
    unref() {
      this.connection.unref();
    }
    end(e) {
      if (this._ending = true, !this.connection._connecting) if (e) e();
      else return this._Promise.resolve();
      if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e) this.connection.once("end", e);
      else return new this._Promise((t) => {
        this.connection.once("end", t);
      });
    }
  };
  a(Cn, "Client");
  var Ut = Cn;
  Ut.Query = Js;
  Xs.exports = Ut;
});
var io = T((op, no) => {
  "use strict";
  p();
  var nl = ge().EventEmitter, to = a(function() {
  }, "NOOP"), ro = a((r, e) => {
    let t = r.findIndex(e);
    return t === -1 ? void 0 : r.splice(t, 1)[0];
  }, "removeWhere"), Tn = class Tn {
    constructor(e, t, n) {
      this.client = e, this.idleListener = t, this.timeoutId = n;
    }
  };
  a(Tn, "IdleItem");
  var _n = Tn, Pn = class Pn {
    constructor(e) {
      this.callback = e;
    }
  };
  a(Pn, "PendingItem");
  var Qe = Pn;
  function il() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  a(il, "throwOnDoubleRelease");
  function Dt(r, e) {
    if (e)
      return { callback: e, result: void 0 };
    let t, n, i = a(function(o, u) {
      o ? t(o) : n(u);
    }, "cb"), s = new r(function(o, u) {
      n = o, t = u;
    }).catch((o) => {
      throw Error.captureStackTrace(o), o;
    });
    return { callback: i, result: s };
  }
  a(Dt, "promisify");
  function sl(r, e) {
    return a(function t(n) {
      n.client = e, e.removeListener("error", t), e.on("error", () => {
        r.log(
          "additional client error after disconnection due to error",
          n
        );
      }), r._remove(e), r.emit("error", n, e);
    }, "idleListener");
  }
  a(sl, "makeIdleListener");
  var Rn = class Rn extends nl {
    constructor(e, t) {
      super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(this.options, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: e.password
      }), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.min = this.options.min || 0, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
      }, this.Client = this.options.Client || t || ot().Client, this.Promise = this.options.Promise || b.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _isAboveMin() {
      return this._clients.length > this.options.min;
    }
    _pulseQueue() {
      if (this.log("pulse queue"), this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log("pulse queue on ending"), this._idle.length && this._idle.slice().map((t) => {
          this._remove(t.client);
        }), this._clients.length || (this.ended = true, this._endCallback());
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull()) return;
      let e = this._pendingQueue.shift();
      if (this._idle.length) {
        let t = this._idle.pop();
        clearTimeout(
          t.timeoutId
        );
        let n = t.client;
        n.ref && n.ref();
        let i = t.idleListener;
        return this._acquireClient(n, e, i, false);
      }
      if (!this._isFull()) return this.newClient(e);
      throw new Error("unexpected condition");
    }
    _remove(e) {
      let t = ro(
        this._idle,
        (n) => n.client === e
      );
      t !== void 0 && clearTimeout(t.timeoutId), this._clients = this._clients.filter(
        (n) => n !== e
      ), e.end(), this.emit("remove", e);
    }
    connect(e) {
      if (this.ending) {
        let i = new Error("Cannot use a pool after calling end on the pool");
        return e ? e(i) : this.Promise.reject(i);
      }
      let t = Dt(this.Promise, e), n = t.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length && m.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis) return this._pendingQueue.push(new Qe(t.callback)), n;
        let i = a((u, c, l) => {
          clearTimeout(o), t.callback(u, c, l);
        }, "queueCallback"), s = new Qe(i), o = setTimeout(() => {
          ro(
            this._pendingQueue,
            (u) => u.callback === i
          ), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        return o.unref && o.unref(), this._pendingQueue.push(s), n;
      }
      return this.newClient(new Qe(t.callback)), n;
    }
    newClient(e) {
      let t = new this.Client(this.options);
      this._clients.push(
        t
      );
      let n = sl(this, t);
      this.log("checking client timeout");
      let i, s = false;
      this.options.connectionTimeoutMillis && (i = setTimeout(() => {
        this.log("ending client due to timeout"), s = true, t.connection ? t.connection.stream.destroy() : t.end();
      }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
        if (i && clearTimeout(i), t.on("error", n), o) this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o = new Error("Connection terminated due to connection timeout", { cause: o })), this._pulseQueue(), e.timedOut || e.callback(o, void 0, to);
        else {
          if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
            let u = setTimeout(() => {
              this.log("ending client due to expired lifetime"), this._expired.add(t), this._idle.findIndex((l) => l.client === t) !== -1 && this._acquireClient(
                t,
                new Qe((l, f, y) => y()),
                n,
                false
              );
            }, this.options.maxLifetimeSeconds * 1e3);
            u.unref(), t.once("end", () => clearTimeout(u));
          }
          return this._acquireClient(t, e, n, true);
        }
      });
    }
    _acquireClient(e, t, n, i) {
      i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(e, e.release) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
        if (s) return e.release(s), t.callback(s, void 0, to);
        t.callback(void 0, e, e.release);
      }) : t.callback(void 0, e, e.release);
    }
    _releaseOnce(e, t) {
      let n = false;
      return (i) => {
        n && il(), n = true, this._release(e, t, i);
      };
    }
    _release(e, t, n) {
      if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit("release", n, e), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) {
        e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e), this._pulseQueue();
        return;
      }
      if (this._expired.has(e)) {
        this.log("remove expired client"), this._expired.delete(e), this._remove(e), this._pulseQueue();
        return;
      }
      let s;
      this.options.idleTimeoutMillis && this._isAboveMin() && (s = setTimeout(() => {
        this.log("remove idle client"), this._remove(e);
      }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new _n(
        e,
        t,
        s
      )), this._pulseQueue();
    }
    query(e, t, n) {
      if (typeof e == "function") {
        let s = Dt(this.Promise, e);
        return v(function() {
          return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        }), s.result;
      }
      typeof t == "function" && (n = t, t = void 0);
      let i = Dt(this.Promise, n);
      return n = i.callback, this.connect((s, o) => {
        if (s) return n(s);
        let u = false, c = a((l) => {
          u || (u = true, o.release(l), n(l));
        }, "onError");
        o.once("error", c), this.log("dispatching query");
        try {
          o.query(e, t, (l, f) => {
            if (this.log("query dispatched"), o.removeListener(
              "error",
              c
            ), !u) return u = true, o.release(l), l ? n(l) : n(void 0, f);
          });
        } catch (l) {
          return o.release(l), n(l);
        }
      }), i.result;
    }
    end(e) {
      if (this.log("ending"), this.ending) {
        let n = new Error("Called end on pool more than once");
        return e ? e(n) : this.Promise.reject(n);
      }
      this.ending = true;
      let t = Dt(this.Promise, e);
      return this._endCallback = t.callback, this._pulseQueue(), t.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  };
  a(Rn, "Pool");
  var In = Rn;
  no.exports = In;
});
var so = {};
ie(so, { default: () => ol });
var ol;
var oo = G(() => {
  "use strict";
  p();
  ol = {};
});
var ao = T((lp, al) => {
  al.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
    "database",
    "libpq",
    "pg",
    "postgre",
    "postgres",
    "postgresql",
    "rdbms"
  ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: { "buffer-writer": "2.0.0", "packet-reader": "1.0.0", "pg-connection-string": "^2.5.0", "pg-pool": "^3.5.2", "pg-protocol": "^1.5.0", "pg-types": "^2.1.0", pgpass: "1.x" }, devDependencies: {
    async: "2.6.4",
    bluebird: "3.5.2",
    co: "4.6.0",
    "pg-copy-streams": "0.3.0"
  }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: { "pg-native": { optional: true } }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
});
var lo = T((fp, co) => {
  "use strict";
  p();
  var uo = ge().EventEmitter, ul = (it(), O(nt)), Bn = rt(), Ne = co.exports = function(r, e, t) {
    uo.call(this), r = Bn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
      n === "row" && (this._emitRowEvents = true);
    }.bind(this));
  };
  ul.inherits(Ne, uo);
  var cl = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
  Ne.prototype.handleError = function(r) {
    var e = this.native.pq.resultErrorFields();
    if (e) for (var t in e) {
      var n = cl[t] || t;
      r[n] = e[t];
    }
    this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
  };
  Ne.prototype.then = function(r, e) {
    return this._getPromise().then(
      r,
      e
    );
  };
  Ne.prototype.catch = function(r) {
    return this._getPromise().catch(r);
  };
  Ne.prototype._getPromise = function() {
    return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
      this._once("end", r), this._once("error", e);
    }.bind(this)), this._promise);
  };
  Ne.prototype.submit = function(r) {
    this.state = "running";
    var e = this;
    this.native = r.native, r.native.arrayMode = this._arrayMode;
    var t = a(function(s, o, u) {
      if (r.native.arrayMode = false, v(function() {
        e.emit("_done");
      }), s) return e.handleError(s);
      e._emitRowEvents && (u.length > 1 ? o.forEach(
        (c, l) => {
          c.forEach((f) => {
            e.emit("row", f, u[l]);
          });
        }
      ) : o.forEach(function(c) {
        e.emit("row", c, u);
      })), e.state = "end", e.emit("end", u), e.callback && e.callback(null, u);
    }, "after");
    if (m.domain && (t = m.domain.bind(t)), this.name) {
      this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", this.name, this.name.length), console.error("This can cause conflicts and silent errors executing queries"));
      var n = (this.values || []).map(Bn.prepareValue);
      if (r.namedQueries[this.name]) {
        if (this.text && r.namedQueries[this.name] !== this.text) {
          let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return t(s);
        }
        return r.native.execute(this.name, n, t);
      }
      return r.native.prepare(this.name, this.text, n.length, function(s) {
        return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
      });
    } else if (this.values) {
      if (!Array.isArray(
        this.values
      )) {
        let s = new Error("Query values must be an array");
        return t(s);
      }
      var i = this.values.map(Bn.prepareValue);
      r.native.query(this.text, i, t);
    } else r.native.query(this.text, t);
  };
});
var yo = T((yp, po) => {
  "use strict";
  p();
  var ll = (oo(), O(so)), fl = At(), dp = ao(), fo = ge().EventEmitter, hl = (it(), O(nt)), pl = Rt(), ho = lo(), K = po.exports = function(r) {
    fo.call(this), r = r || {}, this._Promise = r.Promise || b.Promise, this._types = new fl(r.types), this.native = new ll({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
    var e = this.connectionParameters = new pl(r);
    this.user = e.user, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: e.password }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
  };
  K.Query = ho;
  hl.inherits(K, fo);
  K.prototype._errorAllQueries = function(r) {
    let e = a((t) => {
      m.nextTick(() => {
        t.native = this.native, t.handleError(r);
      });
    }, "enqueueError");
    this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
  };
  K.prototype._connect = function(r) {
    var e = this;
    if (this._connecting) {
      m.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
      if (t) return r(t);
      e.native.connect(n, function(i) {
        if (i) return e.native.end(), r(i);
        e._connected = true, e.native.on("error", function(s) {
          e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
        }), e.native.on("notification", function(s) {
          e.emit("notification", { channel: s.relname, payload: s.extra });
        }), e.emit("connect"), e._pulseQueryQueue(true), r();
      });
    });
  };
  K.prototype.connect = function(r) {
    if (r) {
      this._connect(r);
      return;
    }
    return new this._Promise((e, t) => {
      this._connect((n) => {
        n ? t(n) : e();
      });
    });
  };
  K.prototype.query = function(r, e, t) {
    var n, i, s, o, u;
    if (r == null) throw new TypeError("Client was passed a null or undefined query");
    if (typeof r.submit == "function") s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
    else if (s = this.connectionParameters.query_timeout, n = new ho(r, e, t), !n.callback) {
      let c, l;
      i = new this._Promise((f, y) => {
        c = f, l = y;
      }), n.callback = (f, y) => f ? l(f) : c(y);
    }
    return s && (u = n.callback, o = setTimeout(() => {
      var c = new Error(
        "Query read timeout"
      );
      m.nextTick(() => {
        n.handleError(c, this.connection);
      }), u(c), n.callback = () => {
      };
      var l = this._queryQueue.indexOf(n);
      l > -1 && this._queryQueue.splice(l, 1), this._pulseQueryQueue();
    }, s), n.callback = (c, l) => {
      clearTimeout(o), u(c, l);
    }), this._queryable ? this._ending ? (n.native = this.native, m.nextTick(() => {
      n.handleError(
        new Error("Client was closed and is not queryable")
      );
    }), i) : (this._queryQueue.push(n), this._pulseQueryQueue(), i) : (n.native = this.native, m.nextTick(() => {
      n.handleError(new Error("Client has encountered a connection error and is not queryable"));
    }), i);
  };
  K.prototype.end = function(r) {
    var e = this;
    this._ending = true, this._connected || this.once("connect", this.end.bind(this, r));
    var t;
    return r || (t = new this._Promise(function(n, i) {
      r = a((s) => s ? i(s) : n(), "cb");
    })), this.native.end(function() {
      e._errorAllQueries(new Error("Connection terminated")), m.nextTick(() => {
        e.emit("end"), r && r();
      });
    }), t;
  };
  K.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  };
  K.prototype._pulseQueryQueue = function(r) {
    if (this._connected && !this._hasActiveQuery()) {
      var e = this._queryQueue.shift();
      if (!e) {
        r || this.emit("drain");
        return;
      }
      this._activeQuery = e, e.submit(this);
      var t = this;
      e.once("_done", function() {
        t._pulseQueryQueue();
      });
    }
  };
  K.prototype.cancel = function(r) {
    this._activeQuery === r ? this.native.cancel(function() {
    }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
  };
  K.prototype.ref = function() {
  };
  K.prototype.unref = function() {
  };
  K.prototype.setTypeParser = function(r, e, t) {
    return this._types.setTypeParser(
      r,
      e,
      t
    );
  };
  K.prototype.getTypeParser = function(r, e) {
    return this._types.getTypeParser(r, e);
  };
});
var Ln = T((gp, mo) => {
  "use strict";
  p();
  mo.exports = yo();
});
var ot = T((vp, at) => {
  "use strict";
  p();
  var dl = eo(), yl = tt(), ml = En(), wl = io(), { DatabaseError: gl } = vn(), bl = a(
    (r) => {
      var e;
      return e = class extends wl {
        constructor(n) {
          super(n, r);
        }
      }, a(e, "BoundPool"), e;
    },
    "poolFactory"
  ), Fn = a(
    function(r) {
      this.defaults = yl, this.Client = r, this.Query = this.Client.Query, this.Pool = bl(this.Client), this._pools = [], this.Connection = ml, this.types = Je(), this.DatabaseError = gl;
    },
    "PG"
  );
  typeof m.env.NODE_PG_FORCE_NATIVE < "u" ? at.exports = new Fn(Ln()) : (at.exports = new Fn(dl), Object.defineProperty(at.exports, "native", {
    configurable: true,
    enumerable: false,
    get() {
      var r = null;
      try {
        r = new Fn(Ln());
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") throw e;
      }
      return Object.defineProperty(at.exports, "native", { value: r }), r;
    }
  }));
});
p();
p();
Fe();
Zt();
p();
var pa = Object.defineProperty;
var da = Object.defineProperties;
var ya = Object.getOwnPropertyDescriptors;
var bi = Object.getOwnPropertySymbols;
var ma = Object.prototype.hasOwnProperty;
var wa = Object.prototype.propertyIsEnumerable;
var vi = a(
  (r, e, t) => e in r ? pa(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t,
  "__defNormalProp"
);
var ga = a((r, e) => {
  for (var t in e || (e = {})) ma.call(e, t) && vi(r, t, e[t]);
  if (bi) for (var t of bi(e)) wa.call(e, t) && vi(r, t, e[t]);
  return r;
}, "__spreadValues");
var ba = a((r, e) => da(r, ya(e)), "__spreadProps");
var va = 1008e3;
var xi = new Uint8Array(
  new Uint16Array([258]).buffer
)[0] === 2;
var xa = new TextDecoder();
var Jt = new TextEncoder();
var yt = Jt.encode("0123456789abcdef");
var mt = Jt.encode("0123456789ABCDEF");
var Sa = Jt.encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
var Si = Sa.slice();
Si[62] = 45;
Si[63] = 95;
var He;
var wt;
function Ea(r, { alphabet: e, scratchArr: t } = {}) {
  if (!He) if (He = new Uint16Array(256), wt = new Uint16Array(256), xi) for (let C = 0; C < 256; C++) He[C] = yt[C & 15] << 8 | yt[C >>> 4], wt[C] = mt[C & 15] << 8 | mt[C >>> 4];
  else for (let C = 0; C < 256; C++) He[C] = yt[C & 15] | yt[C >>> 4] << 8, wt[C] = mt[C & 15] | mt[C >>> 4] << 8;
  r.byteOffset % 4 !== 0 && (r = new Uint8Array(r));
  let n = r.length, i = n >>> 1, s = n >>> 2, o = t || new Uint16Array(n), u = new Uint32Array(
    r.buffer,
    r.byteOffset,
    s
  ), c = new Uint32Array(o.buffer, o.byteOffset, i), l = e === "upper" ? wt : He, f = 0, y = 0, g;
  if (xi)
    for (; f < s; ) g = u[f++], c[y++] = l[g >>> 8 & 255] << 16 | l[g & 255], c[y++] = l[g >>> 24] << 16 | l[g >>> 16 & 255];
  else for (; f < s; )
    g = u[f++], c[y++] = l[g >>> 24] << 16 | l[g >>> 16 & 255], c[y++] = l[g >>> 8 & 255] << 16 | l[g & 255];
  for (f <<= 2; f < n; ) o[f] = l[r[f++]];
  return xa.decode(o.subarray(0, n));
}
a(Ea, "_toHex");
function Aa(r, e = {}) {
  let t = "", n = r.length, i = va >>> 1, s = Math.ceil(n / i), o = new Uint16Array(s > 1 ? i : n);
  for (let u = 0; u < s; u++) {
    let c = u * i, l = c + i;
    t += Ea(r.subarray(c, l), ba(ga(
      {},
      e
    ), { scratchArr: o }));
  }
  return t;
}
a(Aa, "_toHexChunked");
function Ei(r, e = {}) {
  return e.alphabet !== "upper" && typeof r.toHex == "function" ? r.toHex() : Aa(r, e);
}
a(Ei, "toHex");
p();
var gt = class gt2 {
  constructor(e, t) {
    this.strings = e;
    this.values = t;
  }
  toParameterizedQuery(e = { query: "", params: [] }) {
    let { strings: t, values: n } = this;
    for (let i = 0, s = t.length; i < s; i++) if (e.query += t[i], i < n.length) {
      let o = n[i];
      if (o instanceof Ge) e.query += o.sql;
      else if (o instanceof Ce) if (o.queryData instanceof gt2) o.queryData.toParameterizedQuery(
        e
      );
      else {
        if (o.queryData.params?.length) throw new Error("This query is not composable");
        e.query += o.queryData.query;
      }
      else {
        let { params: u } = e;
        u.push(o), e.query += "$" + u.length, (o instanceof d || ArrayBuffer.isView(o)) && (e.query += "::bytea");
      }
    }
    return e;
  }
};
a(gt, "SqlTemplate");
var $e = gt;
var Xt = class Xt2 {
  constructor(e) {
    this.sql = e;
  }
};
a(Xt, "UnsafeRawSql");
var Ge = Xt;
p();
function bt() {
  typeof window < "u" && typeof document < "u" && typeof console < "u" && typeof console.warn == "function" && console.warn(`          
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
        ************************************************************`);
}
a(bt, "warnIfBrowser");
Fe();
var as = Se(At());
var us = Se(rt());
var _t = class _t2 extends Error {
  constructor(t) {
    super(t);
    E(this, "name", "NeonDbError");
    E(this, "severity");
    E(this, "code");
    E(this, "detail");
    E(this, "hint");
    E(this, "position");
    E(this, "internalPosition");
    E(
      this,
      "internalQuery"
    );
    E(this, "where");
    E(this, "schema");
    E(this, "table");
    E(this, "column");
    E(this, "dataType");
    E(this, "constraint");
    E(this, "file");
    E(this, "line");
    E(this, "routine");
    E(this, "sourceError");
    "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, _t2);
  }
};
a(
  _t,
  "NeonDbError"
);
var be = _t;
var is = "transaction() expects an array of queries, or a function returning an array of queries";
var Bu = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
function Lu(r) {
  return r instanceof d ? "\\x" + Ei(r) : r;
}
a(Lu, "encodeBuffersAsBytea");
function ss(r) {
  let { query: e, params: t } = r instanceof $e ? r.toParameterizedQuery() : r;
  return { query: e, params: t.map((n) => Lu((0, us.prepareValue)(n))) };
}
a(ss, "prepareQuery");
function cs(r, {
  arrayMode: e,
  fullResults: t,
  fetchOptions: n,
  isolationLevel: i,
  readOnly: s,
  deferrable: o,
  authToken: u,
  disableWarningInBrowsers: c
} = {}) {
  if (!r) throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
  let l;
  try {
    l = Yt(r);
  } catch {
    throw new Error(
      "Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(r)
    );
  }
  let { protocol: f, username: y, hostname: g, port: A, pathname: C } = l;
  if (f !== "postgres:" && f !== "postgresql:" || !y || !g || !C) throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
  function D(P, ...I) {
    if (!(Array.isArray(P) && Array.isArray(P.raw) && Array.isArray(I))) throw new Error('This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).');
    return new Ce(
      Y,
      new $e(P, I)
    );
  }
  a(D, "templateFn"), D.query = (P, I, w) => new Ce(Y, { query: P, params: I ?? [] }, w), D.unsafe = (P) => new Ge(
    P
  ), D.transaction = async (P, I) => {
    if (typeof P == "function" && (P = P(D)), !Array.isArray(P)) throw new Error(is);
    P.forEach((W) => {
      if (!(W instanceof Ce)) throw new Error(is);
    });
    let w = P.map((W) => W.queryData), Z = P.map((W) => W.opts ?? {});
    return Y(w, Z, I);
  };
  async function Y(P, I, w) {
    let { fetchEndpoint: Z, fetchFunction: W } = ce, J = Array.isArray(
      P
    ) ? { queries: P.map((ee) => ss(ee)) } : ss(P), X = n ?? {}, se = e ?? false, oe = t ?? false, B = i, j = s, le = o;
    w !== void 0 && (w.fetchOptions !== void 0 && (X = { ...X, ...w.fetchOptions }), w.arrayMode !== void 0 && (se = w.arrayMode), w.fullResults !== void 0 && (oe = w.fullResults), w.isolationLevel !== void 0 && (B = w.isolationLevel), w.readOnly !== void 0 && (j = w.readOnly), w.deferrable !== void 0 && (le = w.deferrable)), I !== void 0 && !Array.isArray(I) && I.fetchOptions !== void 0 && (X = { ...X, ...I.fetchOptions });
    let de = u;
    !Array.isArray(I) && I?.authToken !== void 0 && (de = I.authToken);
    let We = typeof Z == "function" ? Z(g, A, { jwtAuth: de !== void 0 }) : Z, fe = { "Neon-Connection-String": r, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" }, _e = await Fu(de);
    _e && (fe.Authorization = `Bearer ${_e}`), Array.isArray(P) && (B !== void 0 && (fe["Neon-Batch-Isolation-Level"] = B), j !== void 0 && (fe["Neon-Batch-Read-Only"] = String(j)), le !== void 0 && (fe["Neon-Batch-Deferrable"] = String(le))), c || ce.disableWarningInBrowsers || bt();
    let ye;
    try {
      ye = await (W ?? fetch)(We, { method: "POST", body: JSON.stringify(J), headers: fe, ...X });
    } catch (ee) {
      let M = new be(
        `Error connecting to database: ${ee}`
      );
      throw M.sourceError = ee, M;
    }
    if (ye.ok) {
      let ee = await ye.json();
      if (Array.isArray(P)) {
        let M = ee.results;
        if (!Array.isArray(M)) throw new be("Neon internal error: unexpected result format");
        return M.map(($, me) => {
          let Ot = I[me] ?? {}, vo = Ot.arrayMode ?? se, xo = Ot.fullResults ?? oe;
          return os(
            $,
            { arrayMode: vo, fullResults: xo, types: Ot.types }
          );
        });
      } else {
        let M = I ?? {}, $ = M.arrayMode ?? se, me = M.fullResults ?? oe;
        return os(ee, { arrayMode: $, fullResults: me, types: M.types });
      }
    } else {
      let { status: ee } = ye;
      if (ee === 400) {
        let M = await ye.json(), $ = new be(M.message);
        for (let me of Bu) $[me] = M[me] ?? void 0;
        throw $;
      } else {
        let M = await ye.text();
        throw new be(
          `Server error (HTTP status ${ee}): ${M}`
        );
      }
    }
  }
  return a(Y, "execute"), D;
}
a(cs, "neon");
var dr = class dr2 {
  constructor(e, t, n) {
    this.execute = e;
    this.queryData = t;
    this.opts = n;
  }
  then(e, t) {
    return this.execute(this.queryData, this.opts).then(e, t);
  }
  catch(e) {
    return this.execute(this.queryData, this.opts).catch(e);
  }
  finally(e) {
    return this.execute(
      this.queryData,
      this.opts
    ).finally(e);
  }
};
a(dr, "NeonQueryPromise");
var Ce = dr;
function os(r, {
  arrayMode: e,
  fullResults: t,
  types: n
}) {
  let i = new as.default(n), s = r.fields.map((c) => c.name), o = r.fields.map((c) => i.getTypeParser(
    c.dataTypeID
  )), u = e === true ? r.rows.map((c) => c.map((l, f) => l === null ? null : o[f](l))) : r.rows.map((c) => Object.fromEntries(
    c.map((l, f) => [s[f], l === null ? null : o[f](l)])
  ));
  return t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = u, r._parsers = o, r._types = i, r) : u;
}
a(os, "processQueryResult");
async function Fu(r) {
  if (typeof r == "string") return r;
  if (typeof r == "function") try {
    return await Promise.resolve(r());
  } catch (e) {
    let t = new be("Error getting auth token.");
    throw e instanceof Error && (t = new be(`Error getting auth token: ${e.message}`)), t;
  }
}
a(Fu, "getAuthToken");
p();
var go = Se(ot());
p();
var wo = Se(ot());
var kn = class kn2 extends wo.Client {
  constructor(t) {
    super(t);
    this.config = t;
  }
  get neonConfig() {
    return this.connection.stream;
  }
  connect(t) {
    let { neonConfig: n } = this;
    n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
    let i = typeof this.config != "string" && this.config?.host !== void 0 || typeof this.config != "string" && this.config?.connectionString !== void 0 || m.env.PGHOST !== void 0, s = m.env.USER ?? m.env.USERNAME;
    if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null) throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
    let o = super.connect(t), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
    if (!u && !n.pipelineConnect) return o;
    let l = this.connection;
    if (u && l.on(
      "connect",
      () => l.stream.emit("data", "S")
    ), c) {
      l.removeAllListeners("authenticationCleartextPassword"), l.removeAllListeners("readyForQuery"), l.once("readyForQuery", () => l.on("readyForQuery", this._handleReadyForQuery.bind(this)));
      let f = this.ssl ? "sslconnect" : "connect";
      l.on(f, () => {
        this.neonConfig.disableWarningInBrowsers || bt(), this._handleAuthCleartextPassword(), this._handleReadyForQuery();
      });
    }
    return o;
  }
  async _handleAuthSASLContinue(t) {
    if (typeof crypto > "u" || crypto.subtle === void 0 || crypto.subtle.importKey === void 0) throw new Error("Cannot use SASL auth when `crypto.subtle` is not defined");
    let n = crypto.subtle, i = this.saslSession, s = this.password, o = t.data;
    if (i.message !== "SASLInitialResponse" || typeof s != "string" || typeof o != "string") throw new Error(
      "SASL: protocol error"
    );
    let u = Object.fromEntries(o.split(",").map((M) => {
      if (!/^.=/.test(M)) throw new Error(
        "SASL: Invalid attribute pair entry"
      );
      let $ = M[0], me = M.substring(2);
      return [$, me];
    })), c = u.r, l = u.s, f = u.i;
    if (!c || !/^[!-+--~]+$/.test(c)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
    if (!l || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(l)) throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64"
    );
    if (!f || !/^[1-9][0-9]*$/.test(f)) throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count"
    );
    if (!c.startsWith(i.clientNonce))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    if (c.length === i.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    let y = parseInt(f, 10), g = d.from(l, "base64"), A = new TextEncoder(), C = A.encode(s), D = await n.importKey(
      "raw",
      C,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), Y = new Uint8Array(await n.sign("HMAC", D, d.concat(
      [g, d.from([0, 0, 0, 1])]
    ))), P = Y;
    for (var I = 0; I < y - 1; I++) Y = new Uint8Array(await n.sign("HMAC", D, Y)), P = d.from(
      P.map((M, $) => P[$] ^ Y[$])
    );
    let w = P, Z = await n.importKey(
      "raw",
      w,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), W = new Uint8Array(await n.sign("HMAC", Z, A.encode("Client Key"))), J = await n.digest(
      "SHA-256",
      W
    ), X = "n=*,r=" + i.clientNonce, se = "r=" + c + ",s=" + l + ",i=" + y, oe = "c=biws,r=" + c, B = X + "," + se + "," + oe, j = await n.importKey(
      "raw",
      J,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
    var le = new Uint8Array(await n.sign(
      "HMAC",
      j,
      A.encode(B)
    )), de = d.from(W.map((M, $) => W[$] ^ le[$])), We = de.toString("base64");
    let fe = await n.importKey(
      "raw",
      w,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), _e = await n.sign("HMAC", fe, A.encode("Server Key")), ye = await n.importKey("raw", _e, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    var ee = d.from(
      await n.sign("HMAC", ye, A.encode(B))
    );
    i.message = "SASLResponse", i.serverSignature = ee.toString("base64"), i.response = oe + ",p=" + We, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
  }
};
a(
  kn,
  "NeonClient"
);
var ut = kn;
Fe();
var bo = Se(Rt());
function vl(r, e) {
  if (e) return { callback: e, result: void 0 };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
a(vl, "promisify");
var Un = class Un2 extends go.Pool {
  constructor() {
    super(...arguments);
    E(this, "Client", ut);
    E(this, "hasFetchUnsupportedListeners", false);
    E(this, "addListener", this.on);
  }
  on(t, n) {
    return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
  }
  query(t, n, i) {
    if (!ce.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function") return super.query(
      t,
      n,
      i
    );
    typeof n == "function" && (i = n, n = void 0);
    let s = vl(this.Promise, i);
    i = s.callback;
    try {
      let o = new bo.default(
        this.options
      ), u = encodeURIComponent, c = encodeURI, l = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, f = typeof t == "string" ? t : t.text, y = n ?? t.values ?? [];
      cs(l, { fullResults: true, arrayMode: t.rowMode === "array" }).query(f, y, { types: t.types ?? this.options?.types }).then((A) => i(void 0, A)).catch((A) => i(
        A
      ));
    } catch (o) {
      i(o);
    }
    return s.result;
  }
};
a(Un, "NeonPool");
Fe();
var ct = Se(ot());
var export_DatabaseError = ct.DatabaseError;
var export_defaults = ct.defaults;
var export_escapeIdentifier = ct.escapeIdentifier;
var export_escapeLiteral = ct.escapeLiteral;
var export_types = ct.types;

// src/index.tsx
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
var app = new Hono2();
var DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";
var sql = cs(DATABASE_URL);
function extractRegion(address) {
  if (!address) return "";
  const parts = address.split(/\s+/);
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].endsWith("\uAD6C") && !parts[i].endsWith("\uC2DC\uAD6C")) {
      return parts[i].replace(/구$/, "");
    }
  }
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].endsWith("\uC2DC") && parts[i] !== parts[0]) {
      return parts[i].replace(/(특별시|광역시|특별자치시|시)$/, "");
    }
  }
  if (parts[0]) return parts[0].replace(/(특별자치도|도)$/, "");
  return "";
}
function extractCity(address) {
  if (!address) return "";
  const parts = address.split(/\s+/);
  if (parts[0]) {
    const city = parts[0].replace(/(특별시|광역시|특별자치시|특별자치도|도|시)$/, "");
    return city;
  }
  return "";
}
function schemaType(category) {
  const map = {
    "\uB9C8\uC0AC\uC9C0": "MassageTherapist",
    "\uD5E4\uB4DC\uC2A4\uD30C": "BeautySalon",
    "\uD53C\uBD80\uAD00\uB9AC": "BeautySalon",
    "\uD5E4\uC5B4": "HairSalon",
    "\uBA54\uC774\uD06C\uC5C5": "BeautySalon",
    "\uC641\uC2F1": "BeautySalon",
    "\uBC18\uC601\uAD6C": "BeautySalon",
    "\uBCD1\uC6D0": "MedicalBusiness",
    "\uADF8\uC678": "LocalBusiness"
  };
  return map[category] || "LocalBusiness";
}
function seoTitle(shop) {
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const loc = region || city;
  return `${shop.name} ${loc ? loc + " " : ""}${shop.category} \uCD94\uCC9C | \uB9C8\uC774\uBDF0\uD2F0\uB9F5`;
}
function seoDesc(shop) {
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const tags = Array.isArray(shop.tags) && shop.tags.length ? shop.tags.join("\xB7") + " " : "";
  const loc = region || city;
  const price = shop.price ? ` \uAC00\uACA9 ${shop.price}.` : "";
  const desc = shop.desc ? " " + shop.desc.slice(0, 40) : "";
  return `${shop.name} | ${loc ? loc + " " : ""}${shop.category} \uC798\uD558\uB294 \uACF3. ${tags}\uC608\uC57D\xB7\uC704\uCE58\xB7\uAC00\uACA9 \uD55C\uB208\uC5D0 \uD655\uC778!${price}${desc}`.slice(0, 160);
}
function catSeoTitle(category, region) {
  return `${region} ${category} \uCD94\uCC9C TOP | \uB9C8\uC774\uBDF0\uD2F0\uB9F5`;
}
function catSeoDesc(category, region, count) {
  return `${region} ${category} \uC798\uD558\uB294 \uACF3 ${count}\uACF3 \uCD94\uCC9C! \uAC00\uACA9\xB7\uC704\uCE58\xB7\uC608\uC57D\xB7\uD6C4\uAE30\uAE4C\uC9C0 \uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0\uC11C \uD55C\uB208\uC5D0 \uD655\uC778\uD558\uC138\uC694.`;
}
function catSeoKeywords(category, region) {
  const city = region;
  return [
    `${city} ${category}`,
    `${city} ${category} \uCD94\uCC9C`,
    `${city} ${category} \uC798\uD558\uB294 \uACF3`,
    `${city} ${category} \uC608\uC57D`,
    `${city} ${category} \uAC00\uACA9`,
    `${city} ${category} \uD6C4\uAE30`,
    `${city} ${category} \uB9DB\uC9D1`,
    `${city} \uBDF0\uD2F0\uC0F5`,
    `${city} \uBDF0\uD2F0 \uCD94\uCC9C`,
    `${category} \uCD94\uCC9C`
  ].join(",");
}
function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1e3).toISOString().slice(0, 10);
}
function kstYesterday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1e3 - 864e5).toISOString().slice(0, 10);
}
function extractYoutubeId(input) {
  const s = (input ?? "").trim();
  if (!s) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m2 = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);
  return m2 ? m2[1] : s;
}
function calcIsPremium(r) {
  if (r.plan !== "shoot") return false;
  if (!r.paid_until) return false;
  return new Date(r.paid_until) >= /* @__PURE__ */ new Date();
}
function rowToShop(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    tags: r.tags ?? [],
    price: r.price ?? "",
    address: r.address ?? "",
    district: r.district ?? "",
    lat: parseFloat(r.lat) || 37.5326,
    lng: parseFloat(r.lng) || 127.0246,
    smartPlaceUrl: r.smart_place_url ?? "",
    youtubeId: r.youtube_id ?? "",
    featured: r.featured ?? false,
    thumbnail: r.thumbnail ?? "",
    phone: r.phone ?? "",
    desc: r.description ?? "",
    active: r.active ?? true,
    displayMode: r.display_mode ?? "both",
    plan: r.plan ?? "basic",
    paidUntil: r.paid_until ?? null,
    paymentStatus: r.payment_status ?? "unpaid",
    paymentMemo: r.payment_memo ?? "",
    views: parseInt(r.view_cnt) || 0,
    feedSP: parseInt(r.feed_sp) || 0,
    mapSP: parseInt(r.map_sp) || 0,
    isPremium: calcIsPremium(r),
    isRecommended: r.is_recommended ?? false
  };
}
function calcDist(la1, lo1, la2, lo2) {
  const R = 6371, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180;
  const a2 = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
}
var MIGRATION_VERSION = 10;
var _migrationDone = false;
var _migrationPromise = null;
async function runMigrations() {
  if (_migrationDone) return;
  if (_migrationPromise) return _migrationPromise;
  _migrationPromise = (async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version     INTEGER PRIMARY KEY,
          applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      const rows = await sql`SELECT version FROM schema_migrations WHERE version = ${MIGRATION_VERSION}`;
      if (rows.length > 0) {
        _migrationDone = true;
        return;
      }
      await sql`
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
      `;
      await sql`
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
      `;
      await sql`
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
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS shorts_daily_stats (
          shorts_id  INTEGER NOT NULL,
          stat_date  DATE    NOT NULL,
          view_cnt   INTEGER NOT NULL DEFAULT 0,
          sp_cnt     INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (shorts_id, stat_date)
        )
      `;
      await sql`
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
      `;
      await sql`
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
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_se_session  ON session_events(session_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;
      await sql`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS report_token   TEXT`;
      await sql`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS feed_view      INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS catalog_view   INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS map_view       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_feed       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_catalog    INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_map        INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS rec_view       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE honey_items       ADD COLUMN IF NOT EXISTS coupang_url2   TEXT    NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS smart_place_url TEXT   NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS view_cnt        INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS sp_cnt          INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE session_events    ADD COLUMN IF NOT EXISTS viewed_sec      INTEGER NOT NULL DEFAULT 0`;
      await sql`INSERT INTO schema_migrations (version) VALUES (${MIGRATION_VERSION}) ON CONFLICT DO NOTHING`;
      _migrationDone = true;
    } catch (e) {
      console.error("[migration] error:", e);
      _migrationPromise = null;
    }
  })();
  return _migrationPromise;
}
runMigrations().catch(() => {
});
app.get("/api/admin/diag", (c) => {
  return c.json({
    ver: "v20250619-fix",
    node: process.version,
    env_cloud: !!process.env.CLOUDINARY_CLOUD_NAME,
    env_key: !!process.env.CLOUDINARY_API_KEY,
    env_secret: !!process.env.CLOUDINARY_API_SECRET
  });
});
app.post("/api/admin/cloudinary-sign", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const folder = body?.folder || "mybeautymap/shorts";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || c.env?.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || c.env?.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || c.env?.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return c.json({ error: "Cloudinary env not set", cloud: !!cloudName, key: !!apiKey, secret: !!apiSecret }, 500);
    }
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1").update(paramsToSign).digest("hex");
    return c.json({ ok: true, cloudName, apiKey, timestamp, signature, folder });
  } catch (e) {
    return c.json({ error: e.message, stack: e.stack?.slice(0, 200) }, 500);
  }
});
app.post("/api/admin/fetch-naver-info", async (c) => {
  try {
    const { url } = await c.req.json();
    if (!url) return c.json({ error: "url required" }, 400);
    let placeId = "";
    const directMatch = url.match(/place\/([\d]+)/);
    if (directMatch) {
      placeId = directMatch[1];
    } else {
      const r = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" }
      });
      const finalUrl = r.url;
      const m2 = finalUrl.match(/place\/([\d]+)/);
      if (m2) placeId = m2[1];
    }
    if (!placeId) return c.json({ error: "\uB124\uC774\uBC84 \uD50C\uB808\uC774\uC2A4 \uB9C1\uD06C\uC5D0\uC11C \uC5C5\uCCB4 ID\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4" }, 404);
    const mobileUrl = `https://m.place.naver.com/place/${placeId}/home`;
    const mobileRes = await fetch(mobileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Referer": "https://m.place.naver.com/"
      }
    });
    const html = await mobileRes.text();
    let name = "";
    let address = "";
    let category = "";
    const nextDataM = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextDataM?.[1]) {
      try {
        const nd = JSON.parse(nextDataM[1]);
        const place = nd?.props?.pageProps?.initialState?.place ?? nd?.props?.pageProps?.initialProps?.placeData ?? nd?.props?.pageProps?.placeData;
        if (place) {
          name = place.name || place.displayName || "";
          address = place.roadAddress || place.address || "";
          category = place.category || place.categoryName || "";
        }
        if (!name) {
          const findName = (obj, depth = 0) => {
            if (depth > 8 || !obj || typeof obj !== "object") return "";
            if (obj.name && typeof obj.name === "string" && obj.name.length > 1 && obj.name.length < 30) return obj.name;
            for (const v2 of Object.values(obj)) {
              const r = findName(v2, depth + 1);
              if (r) return r;
            }
            return "";
          };
          name = findName(nd?.props?.pageProps);
        }
      } catch (_) {
      }
    }
    if (!name) {
      const ogM = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      if (ogM?.[1]) {
        name = ogM[1].replace(/[\u0000-\u001f]/g, "").replace(/\s*[:|]\s*네이버.*$/i, "").trim();
      }
    }
    if (!address) {
      const addrAll = html.match(/(서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)[^\s<"]{2,}(?:\s[^\s<"]{2,}){0,3}/g);
      if (addrAll?.length) address = addrAll[0].replace(/[\u0000-\u001f]/g, "").trim();
    }
    if (!category) {
      const catKeywords = ["\uB9C8\uC0AC\uC9C0", "\uD5E4\uB4DC\uC2A4\uD30C", "\uD53C\uBD80\uAD00\uB9AC", "\uD5E4\uC5B4", "\uB124\uC77C", "\uBA54\uC774\uD06C\uC5C5", "\uC641\uC2F1", "\uBC18\uC601\uAD6C", "\uBDF0\uD2F0"];
      for (const kw of catKeywords) {
        if (html.includes(kw)) {
          category = kw;
          break;
        }
      }
    }
    if (!name) return c.json({ error: "\uC5C5\uCCB4 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uB124\uC774\uBC84 \uD50C\uB808\uC774\uC2A4 \uB9C1\uD06C\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694." }, 404);
    return c.json({ name, address, category, placeId });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});
app.get("/api/shops", async (c) => {
  await runMigrations();
  const cat = c.req.query("category") ?? "";
  const q = (c.req.query("q") ?? "").toLowerCase();
  const lat = parseFloat(c.req.query("lat") ?? "");
  const lng = parseFloat(c.req.query("lng") ?? "");
  const nearby = c.req.query("nearby") === "1";
  const shuffle = c.req.query("shuffle") === "1";
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `;
  let list = rows.map(rowToShop);
  if (cat === "recommended") list = list.filter((s) => s.isRecommended);
  else if (cat && cat !== "all") list = list.filter((s) => s.category === cat);
  if (q) list = list.filter(
    (s) => s.name.toLowerCase().includes(q) || (s.tags || []).some((t) => t.toLowerCase().includes(q)) || s.district.toLowerCase().includes(q)
  );
  if (nearby && !isNaN(lat) && !isNaN(lng)) {
    list = list.map((s) => ({ ...s, dist: calcDist(lat, lng, s.lat, s.lng) })).filter((s) => s.dist <= 20).sort((a2, b2) => {
      if (a2.isPremium && !b2.isPremium) return -1;
      if (!a2.isPremium && b2.isPremium) return 1;
      return a2.dist - b2.dist;
    });
  } else if (shuffle) {
    const premiums = list.filter((s) => s.isPremium);
    const normals = list.filter((s) => !s.isPremium);
    for (let i = premiums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [premiums[i], premiums[j]] = [premiums[j], premiums[i]];
    }
    for (let i = normals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [normals[i], normals[j]] = [normals[j], normals[i]];
    }
    list = [...premiums, ...normals];
  } else {
    list.sort((a2, b2) => {
      if (a2.isPremium && !b2.isPremium) return -1;
      if (!a2.isPremium && b2.isPremium) return 1;
      return 0;
    });
  }
  return c.json(list);
});
app.get("/api/geocode", async (c) => {
  const query = c.req.query("query") ?? "";
  if (!query) return c.json({ error: "query required" }, 400);
  const normalize = (q) => q.replace(/(로|길|번길)\s+(\d)/g, "$1$2");
  const candidates = [];
  const norm = normalize(query);
  if (norm !== query) candidates.push(norm);
  candidates.push(query);
  const tokens = norm.trim().split(/\s+/);
  if (tokens.length > 3) candidates.push(tokens.slice(0, -1).join(" "));
  const ncpFetch = async (q) => {
    const res = await fetch(
      `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(q)}`,
      { headers: {
        "X-NCP-APIGW-API-KEY-ID": "xjjg4490h8",
        "X-NCP-APIGW-API-KEY": "RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD"
      } }
    );
    return res.json();
  };
  try {
    let addr = null;
    for (const candidate of candidates) {
      const data = await ncpFetch(candidate);
      if (data.addresses?.length) {
        addr = data.addresses[0];
        break;
      }
    }
    if (!addr) return c.json({ error: "\uC8FC\uC18C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694" }, 404);
    const elements = addr.addressElements || [];
    const sido = elements.find((e) => e.types?.includes("SIDO"))?.longName || "";
    const sigungu = elements.find((e) => e.types?.includes("SIGUGUN"))?.longName || "";
    const dong = elements.find((e) => e.types?.includes("DONGMYUN") || e.types?.includes("RI"))?.longName || "";
    const district = [sido, sigungu, dong].filter(Boolean).join(" ") || addr.roadAddress?.split(" ").slice(0, 3).join(" ") || "";
    return c.json({
      lat: parseFloat(addr.y),
      lng: parseFloat(addr.x),
      address: addr.roadAddress || addr.jibunAddress,
      district
    });
  } catch (e) {
    return c.json({ error: "\uC9C0\uC624\uCF54\uB529 \uC2E4\uD328" }, 500);
  }
});
app.get("/api/shops/all", async (c) => {
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `;
  return c.json(rows.map(rowToShop));
});
app.get("/api/shops/:id", async (c) => {
  const id = +c.req.param("id");
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${id}
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json(rowToShop(rows[0]));
});
app.post("/api/admin/shops", async (c) => {
  const body = await c.req.json();
  const tags = Array.isArray(body.tags) ? body.tags : (body.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const rows = await sql`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${body.name ?? "\uC0C8 \uC5C5\uCCB4"}, ${body.category ?? "\uD53C\uBD80\uAD00\uB9AC"}, ${tags},
       ${body.price ?? ""}, ${body.address ?? ""}, ${body.district ?? ""},
       ${parseFloat(body.lat) || 37.5326}, ${parseFloat(body.lng) || 127.0246},
       ${body.smartPlaceUrl ?? ""}, ${extractYoutubeId(body.youtubeId ?? "")},
       ${body.featured ?? false},
       ${body.thumbnail ?? ""},
       ${body.phone ?? ""}, ${body.desc ?? ""}, true, ${body.displayMode ?? "both"})
    RETURNING *
  `;
  const shop = rows[0];
  await sql`INSERT INTO stats (shop_id) VALUES (${shop.id}) ON CONFLICT DO NOTHING`;
  return c.json(rowToShop(shop));
});
app.put("/api/admin/shops/:id", async (c) => {
  const id = +c.req.param("id");
  const body = await c.req.json();
  const tags = Array.isArray(body.tags) ? body.tags : (body.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const rows = await sql`
    UPDATE shops SET
      name            = ${body.name},
      category        = ${body.category},
      tags            = ${tags},
      price           = ${body.price ?? ""},
      address         = ${body.address ?? ""},
      district        = ${body.district ?? ""},
      lat             = ${parseFloat(body.lat) || 37.5326},
      lng             = ${parseFloat(body.lng) || 127.0246},
      smart_place_url = ${body.smartPlaceUrl ?? ""},
      youtube_id      = ${extractYoutubeId(body.youtubeId ?? "")},
      featured        = ${body.featured ?? false},
      thumbnail       = ${body.thumbnail ?? ""},
      phone           = ${body.phone ?? ""},
      description     = ${body.desc ?? ""},
      active          = ${body.active ?? true},
      display_mode    = ${body.displayMode ?? "both"}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  await sql`INSERT INTO stats (shop_id) VALUES (${id}) ON CONFLICT DO NOTHING`;
  return c.json(rowToShop(rows[0]));
});
app.put("/api/admin/shops/:id/recommended", async (c) => {
  const id = +c.req.param("id");
  const { isRecommended } = await c.req.json();
  const rows = await sql`
    UPDATE shops SET is_recommended = ${!!isRecommended}
    WHERE id = ${id} RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true, isRecommended: rows[0].is_recommended });
});
app.post("/api/track/rec/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  try {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, rec_view)
                VALUES (${id}, ${today}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET rec_view = daily_stats.rec_view + 1`;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.put("/api/admin/shops/:id/payment", async (c) => {
  const id = +c.req.param("id");
  const body = await c.req.json();
  const rows = await sql`
    UPDATE shops SET
      plan           = ${body.plan ?? "basic"},
      paid_until     = ${body.paidUntil || null},
      payment_status = ${body.paymentStatus ?? "unpaid"},
      payment_memo   = ${body.paymentMemo ?? ""}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json(rowToShop(rows[0]));
});
app.delete("/api/admin/shops/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM shops WHERE id = ${id}`;
  return c.json({ ok: true });
});
app.post("/api/track/view/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let source = "feed";
  try {
    const body = await c.req.json();
    if (["feed", "catalog", "map"].includes(body?.source)) source = body.source;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, view_cnt) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1`;
  if (source === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, feed_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt   = daily_stats.view_cnt   + 1,
                    feed_view  = daily_stats.feed_view  + 1`;
  } else if (source === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, catalog_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt      = daily_stats.view_cnt      + 1,
                    catalog_view  = daily_stats.catalog_view  + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, map_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt  = daily_stats.view_cnt  + 1,
                    map_view  = daily_stats.map_view  + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/sp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let viewSrc = null;
  try {
    const b2 = await c.req.json();
    viewSrc = b2?.viewSrc || null;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, feed_sp) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1`;
  if (viewSrc === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_feed)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp  = daily_stats.feed_sp  + 1,
                    vts_feed = daily_stats.vts_feed + 1`;
  } else if (viewSrc === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_catalog)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp     = daily_stats.feed_sp     + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`;
  } else if (viewSrc === "map") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_map)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1,
                    vts_map = daily_stats.vts_map + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp)
                VALUES (${id}, ${today}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/mapsp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let viewSrc = null;
  try {
    const b2 = await c.req.json();
    viewSrc = b2?.viewSrc || null;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, map_sp) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1`;
  if (viewSrc === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_feed)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp   = daily_stats.map_sp   + 1,
                    vts_feed = daily_stats.vts_feed + 1`;
  } else if (viewSrc === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_catalog)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp      = daily_stats.map_sp      + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_map)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp  = daily_stats.map_sp  + 1,
                    vts_map = daily_stats.vts_map + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/visit", async (c) => {
  const today = kstToday();
  await sql`
    INSERT INTO daily_visits (visit_date, visit_cnt) VALUES (${today}, 1)
    ON CONFLICT (visit_date) DO UPDATE SET visit_cnt = daily_visits.visit_cnt + 1
  `;
  return c.json({ ok: true });
});
app.get("/api/admin/daily-visits", async (c) => {
  const rows = await sql`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    ORDER BY visit_date DESC
    LIMIT 30
  `;
  return c.json(rows);
});
app.post("/api/admin/reset-stats", async (c) => {
  await sql`UPDATE stats SET view_cnt=0, feed_sp=0, map_sp=0`;
  await sql`DELETE FROM daily_visits`;
  await sql`DELETE FROM daily_stats`;
  return c.json({ ok: true });
});
app.post("/api/admin/init-daily-stats", async (c) => {
  _migrationDone = false;
  _migrationPromise = null;
  await sql`DELETE FROM schema_migrations WHERE version = ${MIGRATION_VERSION}`;
  await runMigrations();
  return c.json({ ok: true });
});
app.get("/api/admin/stats", async (c) => {
  const today = kstToday();
  const yesterday = kstYesterday();
  const rows = await sql`
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
  `;
  const todayTotals = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${today}
  `;
  const yestTotals = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${yesterday}
  `;
  const weekRows = await sql`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '13 days')
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `;
  const recWeekRows = await sql`
    SELECT shop_id, COALESCE(SUM(rec_view),0) as total_rec
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY shop_id
    HAVING SUM(rec_view) > 0
    ORDER BY total_rec DESC
  `;
  const recWeekMap = {};
  recWeekRows.forEach((r) => {
    recWeekMap[r.shop_id] = parseInt(r.total_rec) || 0;
  });
  const totals = await sql`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `;
  const activeCount = await sql`SELECT COUNT(*) as cnt FROM shops WHERE active = true`;
  const t = totals[0] || {};
  const td = todayTotals[0] || {};
  const yd = yestTotals[0] || {};
  const todayShopRows = await sql`
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
    FROM daily_stats WHERE stat_date = ${today}
  `;
  const todayShopMap = {};
  todayShopRows.forEach((r) => {
    todayShopMap[r.shop_id] = {
      todayViews: parseInt(r.view_cnt) || 0,
      todayFeedSP: parseInt(r.feed_sp) || 0,
      todayMapSP: parseInt(r.map_sp) || 0,
      todayFeedView: parseInt(r.feed_view) || 0,
      todayCatalogView: parseInt(r.catalog_view) || 0,
      todayMapView: parseInt(r.map_view) || 0,
      todayVtsFeed: parseInt(r.vts_feed) || 0,
      todayVtsCatalog: parseInt(r.vts_catalog) || 0,
      todayVtsMap: parseInt(r.vts_map) || 0,
      todayRecView: parseInt(r.rec_view) || 0
    };
  });
  return c.json({
    stats: rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      thumbnail: r.thumbnail,
      youtubeId: r.youtube_id,
      featured: r.featured,
      active: r.active,
      views: parseInt(r.view_cnt) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0,
      lat: parseFloat(r.lat) || 0,
      lng: parseFloat(r.lng) || 0,
      smartPlaceUrl: r.smart_place_url ?? "",
      address: r.address ?? "",
      district: r.district ?? "",
      phone: r.phone ?? "",
      plan: r.plan ?? "basic",
      paymentStatus: r.payment_status ?? "unpaid",
      paidUntil: r.paid_until ? String(r.paid_until).slice(0, 10) : null,
      paymentMemo: r.payment_memo ?? "",
      displayMode: r.display_mode ?? "both",
      priceRange: r.price ?? "",
      tags: r.tags ?? [],
      description: r.description ?? "",
      isRecommended: r.is_recommended ?? false,
      // 오늘 업체별 성과
      todayViews: todayShopMap[r.id]?.todayViews || 0,
      todayFeedSP: todayShopMap[r.id]?.todayFeedSP || 0,
      todayMapSP: todayShopMap[r.id]?.todayMapSP || 0,
      todayFeedView: todayShopMap[r.id]?.todayFeedView || 0,
      todayCatalogView: todayShopMap[r.id]?.todayCatalogView || 0,
      todayMapView: todayShopMap[r.id]?.todayMapView || 0,
      // 오늘 출처별 전환 (영상→예약)
      todayVtsFeed: todayShopMap[r.id]?.todayVtsFeed || 0,
      todayVtsCatalog: todayShopMap[r.id]?.todayVtsCatalog || 0,
      todayVtsMap: todayShopMap[r.id]?.todayVtsMap || 0,
      todayRecView: todayShopMap[r.id]?.todayRecView || 0,
      weekRecView: recWeekMap[r.id] || 0
    })),
    // 누적
    totalViews: parseInt(t.total_views) || 0,
    totalFeedSP: parseInt(t.total_feed_sp) || 0,
    totalMapSP: parseInt(t.total_map_sp) || 0,
    totalShops: parseInt(activeCount[0].cnt) || 0,
    // 오늘
    todayViews: parseInt(td.views) || 0,
    todayFeedSP: parseInt(td.feed_sp) || 0,
    todayMapSP: parseInt(td.map_sp) || 0,
    todayRecView: parseInt(td.rec_view) || 0,
    // 어제
    yestViews: parseInt(yd.views) || 0,
    yestFeedSP: parseInt(yd.feed_sp) || 0,
    yestMapSP: parseInt(yd.map_sp) || 0,
    yestRecView: parseInt(yd.rec_view) || 0,
    // 14일 차트
    weekChart: weekRows.map((r) => ({
      date: r.stat_date,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0,
      recView: parseInt(r.rec_view) || 0
    }))
  });
});
app.post("/api/inquiry", async (c) => {
  const body = await c.req.json();
  if (!body.name || !body.phone) return c.json({ error: "required" }, 400);
  await sql`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${body.name}, ${body.owner ?? ""}, ${body.category ?? ""}, ${body.area ?? ""}, ${body.phone},
            ${body.url ?? ""}, ${body.youtubeUrl ?? ""}, ${body.message ?? ""})
  `;
  return c.json({ ok: true });
});
app.get("/api/admin/calendar", async (c) => {
  const year = parseInt(c.req.query("year") || String((/* @__PURE__ */ new Date()).getFullYear()));
  const month = parseInt(c.req.query("month") || String((/* @__PURE__ */ new Date()).getMonth() + 1));
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);
  const dailyRows = await sql`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COUNT(DISTINCT shop_id)   as active_shops
    FROM daily_stats
    WHERE stat_date >= ${startDate}
      AND stat_date <= ${endDate}
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `;
  const dateParam = c.req.query("date");
  let shopDetail = [];
  if (dateParam) {
    shopDetail = await sql`
      SELECT s.id, s.name, s.category, s.thumbnail,
             COALESCE(ds.view_cnt,0) as views,
             COALESCE(ds.feed_sp,0)  as feed_sp,
             COALESCE(ds.map_sp,0)   as map_sp
      FROM shops s
      LEFT JOIN daily_stats ds ON s.id = ds.shop_id AND ds.stat_date = ${dateParam}
      WHERE s.active = true
        AND (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)+COALESCE(ds.view_cnt,0)) > 0
      ORDER BY (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)) DESC, COALESCE(ds.view_cnt,0) DESC
    `;
  }
  const monthTotal = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp
    FROM daily_stats
    WHERE stat_date >= ${startDate}
      AND stat_date <= ${endDate}
  `;
  const mt2 = monthTotal[0] || {};
  const visitRows = await sql`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    WHERE visit_date >= ${startDate}
      AND visit_date <= ${endDate}
    ORDER BY visit_date ASC
  `;
  const visitMap = {};
  visitRows.forEach((r) => {
    visitMap[r.visit_date] = parseInt(r.visit_cnt) || 0;
  });
  const monthVisit = visitRows.reduce((s, r) => s + (parseInt(r.visit_cnt) || 0), 0);
  return c.json({
    year,
    month,
    monthTotal: {
      views: parseInt(mt2.views) || 0,
      feedSP: parseInt(mt2.feed_sp) || 0,
      mapSP: parseInt(mt2.map_sp) || 0,
      visits: monthVisit
    },
    daily: dailyRows.map((r) => ({
      date: r.stat_date,
      visits: visitMap[r.stat_date] || 0,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0,
      activeShops: parseInt(r.active_shops) || 0
    })),
    shopDetail: shopDetail.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      thumbnail: r.thumbnail,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0
    }))
  });
});
app.get("/api/admin/inquiries", async (c) => {
  const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
  return c.json(rows);
});
app.get("/favicon.ico", (c) => favicon(c));
app.get("/favicon.svg", (c) => favicon(c));
function favicon(c) {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">\u{1F484}</text></svg>`,
    { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public,max-age=86400" } }
  );
}
app.get("/og-image.jpg", (c) => {
  try {
    const imgPath = path.join(process.cwd(), "public", "og-image.jpg");
    const buf = fs.readFileSync(imgPath);
    return new Response(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public,max-age=86400"
      }
    });
  } catch {
    return c.notFound();
  }
});
app.post("/api/admin/upload-thumbnail", async (c) => {
  const body = await c.req.json();
  const { shopId, dataUrl } = body;
  if (!dataUrl || !shopId) return c.json({ error: "required" }, 400);
  await sql`UPDATE shops SET thumbnail = ${dataUrl} WHERE id = ${shopId}`;
  return c.json({ ok: true, url: dataUrl });
});
app.get("/api/shorts", async (c) => {
  try {
    const rows = await sql`
      SELECT * FROM shorts_items WHERE active = true ORDER BY sort_order ASC, id DESC
    `;
    return c.json(rows);
  } catch (e) {
    console.error("[/api/shorts] DB error:", e);
    return c.json([], 200);
  }
});
app.get("/api/admin/shorts", async (c) => {
  const rows = await sql`SELECT * FROM shorts_items ORDER BY sort_order ASC, id DESC`;
  return c.json(rows);
});
app.post("/api/admin/shorts", async (c) => {
  try {
    const b2 = await c.req.json();
    const rows = await sql`
      INSERT INTO shorts_items (name, category, address, youtube_id, cloudinary_public_id, smart_place_url, sort_order, active)
      VALUES (${b2.name || "\uBBF8\uB4F1\uB85D\uC5C5\uCCB4"}, ${b2.category || ""}, ${b2.address || ""}, ${b2.youtubeId || ""}, ${b2.cloudinaryPublicId || ""}, ${b2.smartPlaceUrl || ""}, ${b2.sortOrder || 0}, ${b2.active !== false})
      RETURNING *
    `;
    return c.json(rows[0]);
  } catch (e) {
    return c.json({ error: e?.message || "DB \uC624\uB958" }, 500);
  }
});
app.put("/api/admin/shorts/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const b2 = await c.req.json();
    const rows = await sql`
      UPDATE shorts_items SET
        name                 = ${b2.name || "\uBBF8\uB4F1\uB85D\uC5C5\uCCB4"},
        category             = ${b2.category || ""},
        address              = ${b2.address || ""},
        youtube_id           = ${b2.youtubeId || ""},
        cloudinary_public_id = ${b2.cloudinaryPublicId || ""},
        smart_place_url      = ${b2.smartPlaceUrl || ""},
        sort_order           = ${b2.sortOrder || 0},
        active               = ${b2.active !== false}
      WHERE id = ${id} RETURNING *
    `;
    return c.json(rows[0]);
  } catch (e) {
    return c.json({ error: e?.message || "DB \uC624\uB958" }, 500);
  }
});
app.delete("/api/admin/shorts/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM shorts_items WHERE id = ${id}`;
  return c.json({ ok: true });
});
var _shortsDailyStatsDone = false;
async function ensureShortsDailyStats() {
  if (_shortsDailyStatsDone) return;
  await sql`
    CREATE TABLE IF NOT EXISTS shorts_daily_stats (
      shorts_id  INTEGER NOT NULL,
      stat_date  DATE    NOT NULL,
      view_cnt   INTEGER NOT NULL DEFAULT 0,
      sp_cnt     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shorts_id, stat_date)
    )
  `;
  _shortsDailyStatsDone = true;
}
app.post("/api/track/shorts/view/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  await sql`UPDATE shorts_items SET view_cnt = view_cnt + 1 WHERE id = ${id}`;
  try {
    await ensureShortsDailyStats();
    await sql`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, view_cnt)
      VALUES (${id}, ${today}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET view_cnt = shorts_daily_stats.view_cnt + 1
    `;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.post("/api/track/shorts/sp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  await sql`UPDATE shorts_items SET sp_cnt = sp_cnt + 1 WHERE id = ${id}`;
  try {
    await ensureShortsDailyStats();
    await sql`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, sp_cnt)
      VALUES (${id}, ${today}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET sp_cnt = shorts_daily_stats.sp_cnt + 1
    `;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.get("/api/admin/shorts/stats/summary", async (c) => {
  const today = kstToday();
  const yesterday = kstYesterday();
  const day7 = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const [totRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as total_views,
             COALESCE(SUM(sp_cnt),0)   as total_sp
      FROM shorts_items
    `;
    const [todayRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${today}
    `;
    const [yestRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${yesterday}
    `;
    const [weekRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date >= ${day7}
    `;
    const totalItems = await sql`SELECT COUNT(*) as cnt FROM shorts_items`;
    const activeItems = await sql`SELECT COUNT(*) as cnt FROM shorts_items WHERE active = true`;
    return c.json({
      total_views: Number(totRow.total_views),
      total_sp: Number(totRow.total_sp),
      today_views: Number(todayRow.views),
      today_sp: Number(todayRow.sp),
      yest_views: Number(yestRow.views),
      yest_sp: Number(yestRow.sp),
      week_views: Number(weekRow.views),
      week_sp: Number(weekRow.sp),
      total_items: Number(totalItems[0].cnt),
      active_items: Number(activeItems[0].cnt)
    });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/items", async (c) => {
  const day7 = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
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
        WHERE stat_date >= ${day7}
        GROUP BY shorts_id
      ) w ON w.shorts_id = s.id
      ORDER BY s.view_cnt DESC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/daily", async (c) => {
  const day30 = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
      SELECT stat_date::text as date,
             SUM(view_cnt) as views,
             SUM(sp_cnt)   as sp
      FROM shorts_daily_stats
      WHERE stat_date >= ${day30}
      GROUP BY stat_date
      ORDER BY stat_date ASC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/item/:id", async (c) => {
  const id = +c.req.param("id");
  const day30 = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
      SELECT stat_date::text as date, view_cnt as views, sp_cnt as sp
      FROM shorts_daily_stats
      WHERE shorts_id = ${id} AND stat_date >= ${day30}
      ORDER BY stat_date ASC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
var _sessionsTableDone = false;
async function ensureSessionsTable() {
  if (_sessionsTableDone) return;
  await sql`
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
  `;
  _sessionsTableDone = true;
}
app.post("/api/track/session/start", async (c) => {
  try {
    await ensureSessionsTable();
    await sql`DELETE FROM visitor_sessions WHERE entered_at < NOW() - INTERVAL '7 days'`;
    const b2 = await c.req.json();
    const id = b2.id || "";
    const device = b2.device || "unknown";
    if (!id) return c.json({ ok: false });
    await sql`
      INSERT INTO visitor_sessions (id, device)
      VALUES (${id}, ${device})
      ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false, error: String(e) });
  }
});
app.post("/api/track/session/update", async (c) => {
  try {
    await ensureSessionsTable();
    const b2 = await c.req.json();
    const {
      id,
      duration_sec,
      tabs_visited,
      exited,
      shorts_count,
      shorts_book,
      feed_card_cnt,
      feed_book_cnt,
      map_pin_cnt,
      map_book_cnt,
      search_cnt,
      inquiry_cnt
    } = b2;
    if (!id) return c.json({ ok: false });
    const book_total = (shorts_book || 0) + (feed_book_cnt || 0) + (map_book_cnt || 0);
    await sql`
      UPDATE visitor_sessions SET
        last_seen     = NOW(),
        duration_sec  = ${duration_sec || 0},
        tabs_visited  = ${tabs_visited || []}::text[],
        shorts_count  = ${shorts_count || 0},
        shorts_book   = ${shorts_book || 0},
        feed_card_cnt = ${feed_card_cnt || 0},
        feed_book_cnt = ${feed_book_cnt || 0},
        map_pin_cnt   = ${map_pin_cnt || 0},
        map_book_cnt  = ${map_book_cnt || 0},
        search_cnt    = ${search_cnt || 0},
        inquiry_cnt   = ${inquiry_cnt || 0},
        book_count    = ${book_total},
        exited        = ${exited || false}
      WHERE id = ${id}
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false });
  }
});
var _eventsTableDone = false;
async function ensureEventsTable() {
  if (_eventsTableDone) return;
  await sql`
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
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_se_session ON session_events(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;
  _eventsTableDone = true;
}
app.post("/api/track/session/event", async (c) => {
  try {
    await ensureEventsTable();
    const b2 = await c.req.json();
    const { session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec } = b2;
    if (!session_id || !event_type) return c.json({ ok: false });
    await sql`DELETE FROM session_events WHERE occurred_at < NOW() - INTERVAL '7 days'`;
    await sql`
      INSERT INTO session_events (session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec)
      VALUES (${session_id}, ${event_type}, ${shop_id || null}, ${shop_name || null}, ${shop_cat || null}, ${viewed_sec || 0})
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false, error: String(e) });
  }
});
app.get("/api/admin/sessions/:sid/events", async (c) => {
  try {
    await ensureEventsTable();
    const sid = c.req.param("sid");
    const rows = await sql`
      SELECT id, occurred_at, event_type, shop_id, shop_name, shop_cat
      FROM session_events
      WHERE session_id = ${sid}
      ORDER BY occurred_at ASC
      LIMIT 200
    `;
    return c.json(rows);
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/shop-ranking", async (c) => {
  try {
    await ensureEventsTable();
    const days = Number(c.req.query("days") || 7);
    const rows = await sql`
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
        AND occurred_at >= NOW() - (${days} || ' days')::INTERVAL
      GROUP BY shop_id, shop_name, shop_cat
      ORDER BY view_cnt DESC
      LIMIT 50
    `;
    return c.json(rows.map((r) => ({
      shop_id: Number(r.shop_id),
      shop_name: r.shop_name || "",
      shop_cat: r.shop_cat || "",
      view_cnt: Number(r.view_cnt),
      shorts_cnt: Number(r.shorts_cnt),
      feed_cnt: Number(r.feed_cnt),
      map_cnt: Number(r.map_cnt),
      book_cnt: Number(r.book_cnt),
      uniq_sessions: Number(r.uniq_sessions),
      total_view_sec: Number(r.total_view_sec),
      conv_rate: r.uniq_sessions > 0 ? Math.round(Number(r.book_cnt) / Number(r.uniq_sessions) * 100) : 0
    })));
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/daily-trend", async (c) => {
  try {
    await ensureSessionsTable();
    const rows = await sql`
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
    `;
    return c.json(rows.map((r) => ({
      day: String(r.day).slice(0, 10),
      total: Number(r.total),
      mobile: Number(r.mobile),
      booked: Number(r.booked),
      shorts_total: Number(r.shorts_total),
      feed_total: Number(r.feed_total),
      map_total: Number(r.map_total),
      avg_sec: Number(r.avg_sec)
    })));
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/sessions", async (c) => {
  try {
    await ensureSessionsTable();
    const today = kstToday();
    const rows = await sql`
      SELECT id, entered_at, last_seen, device, duration_sec,
             tabs_visited,
             shorts_count, shorts_book,
             feed_card_cnt, feed_book_cnt,
             map_pin_cnt, map_book_cnt,
             search_cnt, inquiry_cnt,
             book_count, exited
      FROM visitor_sessions
      WHERE entered_at::date >= ${today}::date - INTERVAL '1 day'
      ORDER BY entered_at DESC
      LIMIT 200
    `;
    return c.json(rows);
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/sessions/summary", async (c) => {
  try {
    await ensureSessionsTable();
    const today = kstToday();
    const [todayRow] = await sql`
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
      WHERE entered_at::date = ${today}::date
    `;
    const [yestRow] = await sql`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date = ${today}::date - INTERVAL '1 day'
    `;
    const [weekRow] = await sql`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date >= ${today}::date - INTERVAL '6 days'
    `;
    return c.json({
      today_total: Number(todayRow?.total || 0),
      today_mobile: Number(todayRow?.mobile || 0),
      today_desktop: Number(todayRow?.desktop || 0),
      today_avg_sec: Number(todayRow?.avg_sec || 0),
      today_booked: Number(todayRow?.booked || 0),
      today_watched: Number(todayRow?.watched_shorts || 0),
      today_avg_shorts: Number(todayRow?.avg_shorts || 0),
      yest_total: Number(yestRow?.total || 0),
      week_total: Number(weekRow?.total || 0),
      sum_shorts_book: Number(todayRow?.sum_shorts_book || 0),
      sum_feed_card: Number(todayRow?.sum_feed_card || 0),
      sum_feed_book: Number(todayRow?.sum_feed_book || 0),
      sum_map_pin: Number(todayRow?.sum_map_pin || 0),
      sum_map_book: Number(todayRow?.sum_map_book || 0),
      sum_search: Number(todayRow?.sum_search || 0),
      sum_inquiry: Number(todayRow?.sum_inquiry || 0),
      // 1인당 평균
      avg_shorts: Number(todayRow?.avg_shorts || 0),
      avg_feed_card: Number(todayRow?.avg_feed_card || 0),
      avg_map_pin: Number(todayRow?.avg_map_pin || 0),
      used_feed: Number(todayRow?.used_feed || 0),
      used_map: Number(todayRow?.used_map || 0)
    });
  } catch (e) {
    return c.json({ error: String(e) });
  }
});
app.get("/api/honey", async (c) => {
  const rows = await sql`
    SELECT * FROM honey_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;
  return c.json(rows);
});
app.get("/api/admin/honey", async (c) => {
  const rows = await sql`SELECT * FROM honey_items ORDER BY sort_order ASC, id DESC`;
  return c.json(rows);
});
app.post("/api/admin/honey", async (c) => {
  const b2 = await c.req.json();
  const rows = await sql`
    INSERT INTO honey_items (title, description, youtube_id, coupang_url, price, tags, sort_order, active)
    VALUES (${b2.title}, ${b2.description || ""}, ${b2.youtubeId || ""}, ${b2.coupangUrl || ""}, ${b2.price || ""}, ${b2.tags || []}, ${b2.sortOrder || 0}, ${b2.active !== false})
    RETURNING *
  `;
  return c.json(rows[0]);
});
app.put("/api/admin/honey/:id", async (c) => {
  const id = +c.req.param("id");
  const b2 = await c.req.json();
  const rows = await sql`
    UPDATE honey_items SET
      title       = ${b2.title},
      description = ${b2.description || ""},
      youtube_id  = ${b2.youtubeId || ""},
      coupang_url = ${b2.coupangUrl || ""},
      price       = ${b2.price || ""},
      tags        = ${b2.tags || []},
      sort_order  = ${b2.sortOrder || 0},
      active      = ${b2.active !== false}
    WHERE id = ${id} RETURNING *
  `;
  return c.json(rows[0]);
});
app.delete("/api/admin/honey/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM honey_items WHERE id = ${id}`;
  return c.json({ ok: true });
});
app.get("/robots.txt", (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  return c.text(
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${proto}://${host}/sitemap.xml`,
    200,
    { "Content-Type": "text/plain; charset=utf-8" }
  );
});
app.get("/ads.txt", (c) => {
  return c.text(
    "google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0",
    200,
    { "Content-Type": "text/plain; charset=utf-8" }
  );
});
app.get("/sitemap.xml", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const base = `${proto}://${host}`;
  const today = kstToday();
  const rows = await sql`SELECT id, name, category, address FROM shops WHERE active = true ORDER BY id`;
  const catRegionSet = /* @__PURE__ */ new Set();
  for (const r of rows) {
    const region = extractRegion(r.address);
    if (region) catRegionSet.add(`${r.category}|||${region}`);
  }
  const staticUrls = [
    { loc: base, priority: "1.0", freq: "daily" },
    { loc: `${base}/map`, priority: "0.8", freq: "weekly" }
  ];
  const shopUrls = rows.map((r) => ({
    loc: `${base}/shop/${r.id}`,
    priority: "0.9",
    freq: "weekly",
    lastmod: today
  }));
  const catUrls = [...catRegionSet].map((key) => {
    const [cat, region] = key.split("|||");
    return {
      loc: `${base}/c/${encodeURIComponent(cat)}/${encodeURIComponent(region)}`,
      priority: "0.8",
      freq: "weekly",
      lastmod: today
    };
  });
  const FIXED_CATS = ["\uB9C8\uC0AC\uC9C0", "\uD5E4\uB4DC\uC2A4\uD30C", "\uD53C\uBD80\uAD00\uB9AC", "\uD5E4\uC5B4", "\uBA54\uC774\uD06C\uC5C5", "\uC641\uC2F1", "\uBC18\uC601\uAD6C"];
  const FIXED_REGIONS = ["\uAC15\uB0A8\uAD6C", "\uC11C\uCD08\uAD6C", "\uB9C8\uD3EC\uAD6C", "\uC6A9\uC0B0\uAD6C", "\uC131\uB3D9\uAD6C", "\uC885\uB85C\uAD6C", "\uC911\uAD6C", "\uC1A1\uD30C\uAD6C", "\uAC15\uC11C\uAD6C", "\uBD84\uB2F9\uAD6C"];
  const fixedCatUrls = FIXED_CATS.flatMap(
    (cat) => FIXED_REGIONS.map((region) => ({
      loc: `${base}/c/${encodeURIComponent(cat)}/${encodeURIComponent(region)}`,
      priority: "0.7",
      freq: "weekly",
      lastmod: today
    }))
  );
  const catUrlSet = new Set(catUrls.map((u) => u.loc));
  const extraCatUrls = fixedCatUrls.filter((u) => !catUrlSet.has(u.loc));
  const allUrls = [...staticUrls, ...shopUrls, ...catUrls, ...extraCatUrls];
  const urlEntries = allUrls.map((u) => {
    const lastmodTag = u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${u.loc}</loc>${lastmodTag}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});
app.get("/shop/:id", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  const id = +c.req.param("id");
  if (isNaN(id)) return c.redirect("/");
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${id} AND s.active = true
  `;
  if (!rows.length) return c.redirect("/");
  const shop = rowToShop(rows[0]);
  return c.html(shopDetailPage(shop, baseUrl));
});
app.get("/c/:category/:region", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  const category = decodeURIComponent(c.req.param("category"));
  const region = decodeURIComponent(c.req.param("region"));
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true AND s.category = ${category}
      AND s.address LIKE ${"%" + region + "%"}
    ORDER BY st.view_cnt DESC NULLS LAST
  `;
  const shops = rows.map(rowToShop);
  return c.html(categoryLandingPage(category, region, shops, baseUrl));
});
app.post("/api/admin/shops/:id/report-token", async (c) => {
  const id = +c.req.param("id");
  const token = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const rows = await sql`
    UPDATE shops SET report_token = ${token} WHERE id = ${id} RETURNING id, report_token
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json({ token: rows[0].report_token });
});
app.post("/api/report/:token/verify", async (c) => {
  const token = c.req.param("token");
  const { phone4 } = await c.req.json();
  const shops = await sql`SELECT * FROM shops WHERE report_token = ${token}`;
  if (!shops.length) return c.json({ error: "invalid" }, 404);
  const shop = shops[0];
  if (phone4 !== "0000") {
    const storedPhone = (shop.phone || "").replace(/[^0-9]/g, "");
    const last4 = storedPhone.slice(-4);
    if (!last4 || last4 !== phone4) return c.json({ error: "wrong" }, 401);
  }
  const today = kstToday();
  const thisMonth = today.slice(0, 7);
  const thisMonthStats = await sql`
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
    WHERE shop_id = ${shop.id}
      AND stat_date >= (DATE_TRUNC('month', CURRENT_DATE))
  `;
  const lastMonthStats = await sql`
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
    WHERE shop_id = ${shop.id}
      AND stat_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND stat_date <  DATE_TRUNC('month', CURRENT_DATE)
  `;
  const daily30 = await sql`
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
    WHERE shop_id = ${shop.id}
      AND stat_date >= (CURRENT_DATE - INTERVAL '29 days')
    ORDER BY stat_date ASC
  `;
  const rankRows = await sql`
    SELECT s.id,
           COALESCE(SUM(ds.view_cnt),0) as total
    FROM shops s
    LEFT JOIN daily_stats ds
      ON s.id = ds.shop_id
      AND ds.stat_date >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE s.category = ${shop.category} AND s.active = true
    GROUP BY s.id
    ORDER BY total DESC
  `;
  const rank = rankRows.findIndex((r) => r.id === shop.id) + 1;
  const rankTotal = rankRows.length;
  const totalStats = await sql`
    SELECT COALESCE(view_cnt,0) as views,
           COALESCE(feed_sp,0)  as feed_sp,
           COALESCE(map_sp,0)   as map_sp
    FROM stats WHERE shop_id = ${shop.id}
  `;
  return c.json({
    shop: {
      id: shop.id,
      name: shop.name,
      category: shop.category,
      address: shop.address
    },
    thisMonth: {
      views: parseInt(thisMonthStats[0]?.views) || 0,
      feedSP: parseInt(thisMonthStats[0]?.feed_sp) || 0,
      mapSP: parseInt(thisMonthStats[0]?.map_sp) || 0,
      feedView: parseInt(thisMonthStats[0]?.feed_view) || 0,
      catalogView: parseInt(thisMonthStats[0]?.catalog_view) || 0,
      mapView: parseInt(thisMonthStats[0]?.map_view) || 0,
      vtsFeed: parseInt(thisMonthStats[0]?.vts_feed) || 0,
      vtsCatalog: parseInt(thisMonthStats[0]?.vts_catalog) || 0,
      vtsMap: parseInt(thisMonthStats[0]?.vts_map) || 0
    },
    lastMonth: {
      views: parseInt(lastMonthStats[0]?.views) || 0,
      feedSP: parseInt(lastMonthStats[0]?.feed_sp) || 0,
      mapSP: parseInt(lastMonthStats[0]?.map_sp) || 0,
      feedView: parseInt(lastMonthStats[0]?.feed_view) || 0,
      catalogView: parseInt(lastMonthStats[0]?.catalog_view) || 0,
      mapView: parseInt(lastMonthStats[0]?.map_view) || 0,
      vtsFeed: parseInt(lastMonthStats[0]?.vts_feed) || 0,
      vtsCatalog: parseInt(lastMonthStats[0]?.vts_catalog) || 0,
      vtsMap: parseInt(lastMonthStats[0]?.vts_map) || 0
    },
    total: {
      views: parseInt(totalStats[0]?.views) || 0,
      feedSP: parseInt(totalStats[0]?.feed_sp) || 0,
      mapSP: parseInt(totalStats[0]?.map_sp) || 0
    },
    daily30,
    rank,
    rankTotal
  });
});
app.get("/report/:token", (c) => {
  const token = c.req.param("token");
  return c.html(reportPage(token));
});
app.get("/admin", (c) => c.html(adminPage()));
app.get("/map-admin", (c) => c.redirect("/admin"));
app.get("/map", (c) => c.html(mapPage()));
app.get("/api/resolve-naver", async (c) => {
  const url = c.req.query("url") || "";
  if (!url) return c.json({ error: "no url" }, 400);
  try {
    const directMatch = url.match(/place\/([0-9]+)/);
    if (directMatch) {
      return c.json({ resolved: `https://m.place.naver.com/place/${directMatch[1]}/home` });
    }
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" }
    });
    const location = res.headers.get("location") || "";
    const m2 = location.match(/place\/([0-9]+)/);
    if (m2) {
      return c.json({ resolved: `https://m.place.naver.com/place/${m2[1]}/home` });
    }
    return c.json({ resolved: url });
  } catch {
    return c.json({ resolved: url });
  }
});
app.get("/reserve", (c) => {
  const url = c.req.query("url") || "";
  const name = c.req.query("name") || "";
  if (!url) return c.text("url required", 400);
  return c.html(`<!DOCTYPE html>
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
  <span class="top-title" id="ttl">${name ? name + " \uC608\uC57D\uD558\uAE30" : "\uC608\uC57D\uD558\uAE30"}</span>
  <button class="btn-ext" onclick="window.open('${url}','_blank','noopener')" title="\uC678\uBD80 \uBE0C\uB77C\uC6B0\uC800">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </button>
  <button class="btn-close" onclick="window.parent.closeInapp()" title="\uB2EB\uAE30">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
</div>
<div class="loader" id="ldr"><div class="loader-bar"></div></div>
<iframe src="${url}" onload="document.getElementById('ldr').className='loader done'"></iframe>
</body>
</html>`);
});
app.get("/", (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  return c.html(mainPage(baseUrl));
});
var CATEGORIES = ["\uC804\uCCB4", "\uB9C8\uC0AC\uC9C0", "\uD5E4\uB4DC\uC2A4\uD30C", "\uD53C\uBD80\uAD00\uB9AC", "\uD5E4\uC5B4", "\uBA54\uC774\uD06C\uC5C5", "\uC641\uC2F1", "\uBC18\uC601\uAD6C", "\uBCD1\uC6D0", "\uADF8\uC678"];
var CAT_EMOJI = {
  "\uC804\uCCB4": "\u{1F3E0}",
  "\uB9C8\uC0AC\uC9C0": "\u{1F486}",
  "\uD5E4\uB4DC\uC2A4\uD30C": "\u{1F9D6}",
  "\uD53C\uBD80\uAD00\uB9AC": "\u2728",
  "\uD5E4\uC5B4": "\u{1F487}",
  "\uBA54\uC774\uD06C\uC5C5": "\u{1F484}",
  "\uC641\uC2F1": "\u{1F338}",
  "\uBC18\uC601\uAD6C": "\u{1F441}",
  "\uBCD1\uC6D0": "\u{1F3E5}",
  "\uADF8\uC678": "\u{1F31F}"
};
var REC_BTN = `<button class="cp cp-rec" onclick="filterFeed(this,'recommended')">\u2B50 \uCD94\uCC9C</button>`;
function mainPage(baseUrl = "https://www.mybeautymap.co.kr") {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134" crossorigin="anonymous"></script>
<meta name="description" content="\uB9C8\uC0AC\uC9C0\xB7\uD5E4\uB4DC\uC2A4\uD30C\xB7\uD53C\uBD80\uAD00\uB9AC\xB7\uD5E4\uC5B4\xB7\uBA54\uC774\uD06C\uC5C5\xB7\uC641\uC2F1\xB7\uBC18\uC601\uAD6C \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uC601\uC0C1 \uBCF4\uACE0 \uB124\uC774\uBC84 \uC608\uC57D\uAE4C\uC9C0 \uD55C\uBC88\uC5D0! \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uC0F5\uC744 \uBC1C\uACAC\uD558\uBA74 \uBC14\uB85C \uC608\uC57D\uD558\uC138\uC694."/>

<!-- Open Graph -->
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>
<meta property="og:title"       content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D"/>
<meta property="og:description" content="\uB9C8\uC0AC\uC9C0\xB7\uD5E4\uB4DC\uC2A4\uD30C\xB7\uD53C\uBD80\uAD00\uB9AC\xB7\uD5E4\uC5B4\xB7\uBA54\uC774\uD06C\uC5C5\xB7\uC641\uC2F1\xB7\uBC18\uC601\uAD6C \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uC601\uC0C1 \uBCF4\uACE0 \uB124\uC774\uBC84 \uC608\uC57D\uAE4C\uC9C0 \uD55C\uBC88\uC5D0! \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uC0F5\uC744 \uBC1C\uACAC\uD558\uBA74 \uBC14\uB85C \uC608\uC57D\uD558\uC138\uC694."/>
<meta property="og:image"       content="${baseUrl}/og-image.jpg"/>
<meta property="og:image:width"  content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url"         content="${baseUrl}"/>
<meta property="og:locale"      content="ko_KR"/>

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D"/>
<meta name="twitter:description" content="\uB9C8\uC0AC\uC9C0\xB7\uD5E4\uB4DC\uC2A4\uD30C\xB7\uD53C\uBD80\uAD00\uB9AC\xB7\uD5E4\uC5B4\xB7\uBA54\uC774\uD06C\uC5C5\xB7\uC641\uC2F1\xB7\uBC18\uC601\uAD6C \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uC601\uC0C1 \uBCF4\uACE0 \uB124\uC774\uBC84 \uC608\uC57D\uAE4C\uC9C0 \uD55C\uBC88\uC5D0! \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uC0F5\uC744 \uBC1C\uACAC\uD558\uBA74 \uBC14\uB85C \uC608\uC57D\uD558\uC138\uC694."/>
<meta name="twitter:image"       content="${baseUrl}/og-image.jpg"/>

<!-- Canonical & \uB124\uC774\uBC84/\uAD6C\uAE00 \uC778\uC99D -->
<link rel="canonical" href="${baseUrl}/"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>

<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>

<!-- Schema.org \uAD6C\uC870\uD654 \uB370\uC774\uD130 -->
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${baseUrl}/#website",
      "name": "\uB9C8\uC774\uBDF0\uD2F0\uB9F5",
      "alternateName": "MyBeautyMap",
      "url": "${baseUrl}",
      "description": "\uB9C8\uC0AC\uC9C0\xB7\uD5E4\uB4DC\uC2A4\uD30C\xB7\uD53C\uBD80\uAD00\uB9AC\xB7\uD5E4\uC5B4 \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D",
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "${baseUrl}/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "${baseUrl}/#webpage",
      "url": "${baseUrl}",
      "name": "\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D",
      "isPartOf": { "@id": "${baseUrl}/#website" },
      "about": {
        "@type": "Thing",
        "name": "\uBDF0\uD2F0\uC0F5 \uC9C0\uB3C4 \uC11C\uBE44\uC2A4"
      },
      "description": "\uB9C8\uC0AC\uC9C0\xB7\uD5E4\uB4DC\uC2A4\uD30C\xB7\uD53C\uBD80\uAD00\uB9AC\xB7\uD5E4\uC5B4\xB7\uBA54\uC774\uD06C\uC5C5\xB7\uC641\uC2F1\xB7\uBC18\uC601\uAD6C \u2013 \uBDF0\uD2F0 \uC20F\uD3FC \uC601\uC0C1 \uBCF4\uACE0 \uB124\uC774\uBC84 \uC608\uC57D\uAE4C\uC9C0 \uD55C\uBC88\uC5D0!"
    },
    {
      "@type": "Organization",
      "@id": "${baseUrl}/#organization",
      "name": "\uB9C8\uC774\uBDF0\uD2F0\uB9F5",
      "url": "${baseUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${baseUrl}/og-image.jpg",
        "width": 1200,
        "height": 630
      },
      "sameAs": []
    },
    {
      "@type": "SiteLinksSearchBox",
      "url": "${baseUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${baseUrl}/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}</script>
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

/* \uD5E4\uB354 */
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

/* \uAC80\uC0C9\uBC14 */
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

/* \uCE74\uD0C8\uB85C\uADF8 \uD0ED\uBC14 */
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

/* \uD53C\uB4DC \uD654\uBA74 */
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
/* PC \uC804\uC6A9 \uC694\uC18C \u2014 JS\uB85C \uB3D9\uC801 \uC0BD\uC785\uB428, CSS \uAE30\uBCF8\uAC12 \uBD88\uD544\uC694 */
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:calc(var(--ad) + var(--nav));
  display:none;}
#mapScreen.active{display:block;}
/* \uC1FC\uCE20 \uB9B4\uC2A4 \uC2A4\uD0C0\uC77C */
/* \uC20F\uD3FC: \uD5E4\uB354+\uCE74\uD0C8\uB85C\uADF8\uBC14 \uC544\uB798 ~ \uD0ED\uBC14 \uBC14\uB85C \uC704 */
/* \u2500\u2500 \uB9B4\uC2A4 \uC2A4\uD06C\uB9B0: \uBAA8\uBC14\uC77C \uAE30\uBCF8 \u2500\u2500 */
#shortsScreen{position:fixed;
  top:calc(var(--hd) + 44px);
  left:0;right:0;
  bottom:calc(var(--nav) + var(--safe));
  display:none;overflow-y:scroll;scroll-snap-type:y mandatory;
  background:#000;-webkit-overflow-scrolling:touch;}
#shortsScreen::-webkit-scrollbar{display:none;}
#shortsScreen.active{display:block;}
/* \u2500\u2500 \uB9B4\uC2A4 \uC2A4\uD06C\uB9B0: PC(768px+) \u2014 9:16\uC601\uC0C1 + \uC624\uB978\uCABD \uC815\uBCF4\uD328\uB110, \uC911\uC559\uC815\uB82C \u2500\u2500 */
@media(min-width:768px){
  #shortsScreen{
    --sv: calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
    --pw: 300px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(100vw, calc(var(--sv) * 9 / 16 + var(--pw)));
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    background:#0a0a0a;
    box-shadow: 0 0 80px rgba(0,0,0,.6);
  }
  .shorts-slide{
    display:flex !important;
    flex-direction:row !important;
    overflow:hidden !important;
  }
  .shorts-iframe-wrap, .shorts-no-video{
    position:relative !important;
    flex:none !important;
    width: calc(var(--sv) * 9 / 16) !important;
    height:100% !important;
    top:auto !important; left:auto !important;
    right:auto !important; bottom:auto !important;
  }
  /* \uC624\uB978\uCABD \uC815\uBCF4 \uD328\uB110 */
  .shorts-overlay{
    position:relative !important;
    flex:none !important;
    width:var(--pw) !important;
    height:100% !important;
    top:auto !important; left:auto !important;
    right:auto !important; bottom:auto !important;
    background:linear-gradient(170deg,#141414 0%,#0e0e0e 60%,#0a0a0a 100%) !important;
    border-left:1px solid rgba(255,255,255,.07) !important;
    display:flex !important;
    flex-direction:column !important;
    justify-content:center !important;
    padding:0 !important;
    overflow:hidden !important;
    z-index:2 !important;
  }
  .shorts-info-row{ display:none !important; }
  /* PC \uD328\uB110 \uCEE8\uD14C\uC774\uB108 */
  .shorts-panel-pc{
    display:flex !important;
    flex-direction:column !important;
    justify-content:center !important;
    flex:1 !important;
    padding:36px 28px !important;
    min-height:0 !important;
    position:relative !important;
    overflow:hidden !important;
  }
  /* \uD328\uB110 \uC0C1\uB2E8 \uC7A5\uC2DD \uB77C\uC778 */
  .shorts-panel-pc::before{
    content:'' !important;
    position:absolute !important;
    top:0 !important; left:28px !important; right:28px !important;
    height:2px !important;
    background:linear-gradient(90deg,transparent,rgba(232,121,249,.5),transparent) !important;
  }
  /* \uCE74\uD14C\uACE0\uB9AC \uBC43\uC9C0 */
  .shorts-cat{
    font-size:10px !important;
    font-weight:800 !important;
    letter-spacing:.06em !important;
    padding:4px 11px !important;
    border-radius:20px !important;
    margin-bottom:20px !important;
    display:inline-flex !important;
    align-items:center !important;
    gap:5px !important;
    width:fit-content !important;
  }
  /* \uC5C5\uCCB4\uBA85 */
  .shorts-panel-name{
    font-size:24px !important;
    font-weight:900 !important;
    line-height:1.3 !important;
    white-space:normal !important;
    word-break:keep-all !important;
    margin-bottom:10px !important;
    text-shadow:none !important;
    overflow:visible !important;
    text-overflow:unset !important;
    color:#fff !important;
    letter-spacing:-.02em !important;
  }
  /* \uC8FC\uC18C */
  .shorts-panel-addr{
    font-size:12px !important;
    color:rgba(255,255,255,.45) !important;
    margin-bottom:0 !important;
    line-height:1.55 !important;
    display:flex !important;
    align-items:flex-start !important;
    gap:5px !important;
  }
  .shorts-panel-addr i{ margin-top:2px !important; flex-shrink:0 !important; }
  /* \uAD6C\uBD84\uC120 */
  .shorts-panel-divider{
    width:100% !important;
    height:1px !important;
    background:linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,.04)) !important;
    margin:24px 0 !important;
    flex-shrink:0 !important;
  }
  /* \uC608\uC57D \uBC84\uD2BC */
  .shorts-panel-btn{
    width:100% !important;
    padding:15px !important;
    font-size:14px !important;
    font-weight:800 !important;
    border-radius:16px !important;
    justify-content:center !important;
    gap:8px !important;
    letter-spacing:.01em !important;
    box-shadow:0 8px 24px rgba(3,199,90,.35) !important;
    transition:transform .15s,box-shadow .15s !important;
  }
  .shorts-panel-btn:hover{
    transform:translateY(-2px) !important;
    box-shadow:0 12px 32px rgba(3,199,90,.45) !important;
  }
  .shorts-panel-btn:active{ transform:scale(.97) !important; }
  /* \uD558\uB2E8 \uD78C\uD2B8 */
  .shorts-panel-hint{
    font-size:11px !important;
    color:rgba(255,255,255,.2) !important;
    text-align:center !important;
    margin-top:20px !important;
    letter-spacing:.03em !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:5px !important;
  }
}
/* \uC20F\uD3FC \uBAA8\uB4DC: \uAD11\uACE0\uB9CC \uC228\uAE40 (\uD5E4\uB354\xB7\uAC80\uC0C9\uBC14\uB294 \uC720\uC9C0) */
body.shorts-mode #coupang-ad{ display:none!important; }
body.shorts-mode #shortsCatBar{ display:block!important; }
/* \uC74C\uC18C\uAC70 \uBC84\uD2BC */
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
/* \uC20F\uD3FC \uC804\uC6A9 \uCE74\uD0C8\uB85C\uADF8 \uBC14 */
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
/* \uC20F\uD3FC \uC804\uC6A9 \uCE74\uD0C8\uB85C\uADF8 \uBC84\uD2BC \u2014 .scp \uB3C5\uB9BD \uD074\uB798\uC2A4 */
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

/* \uC785\uC810\uBB38\uC758 \uC2A4\uD0C0\uC77C */
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
/* \uC694\uAE08 \uC548\uB0B4 */
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
/* \uD3FC */
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
/* \uAC1C\uC778\uC815\uBCF4 \uB3D9\uC758 */
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

/* \uD558\uB2E8\uD0ED */
/* \uCFE0\uD321 \uAD11\uACE0 \uBC30\uB108 */
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
/* \u2500\u2500 \uC20F\uD3FC \uD0ED \uC2A4\uD0C0\uC77C \u2500\u2500 */
.shorts-slide{
  position:relative;
  width:100%;
  /* \uB192\uC774: \uD5E4\uB354 + \uCE74\uD0C8\uB85C\uADF8\uBC14 ~ \uD0ED\uBC14 \uC704\uAE4C\uC9C0 */
  height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  min-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  max-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  scroll-snap-align:start;
  scroll-snap-stop:always;
  flex-shrink:0;
  background:#000;
  overflow:hidden;
  /* PC\uC5D0\uC11C \uAC00\uB85C\uB85C \uB118\uC5B4\uAC00\uC9C0 \uC54A\uB3C4\uB85D */
  max-width:100%;
}
.shorts-iframe-wrap{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  width:100%;height:100%;
  background:#000;
  overflow:hidden;
}
/* Cloudinary \uB124\uC774\uD2F0\uBE0C video \u2014 \uC138\uB85C \uAF49 \uCC44\uC6C0 */
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
/* YT.Player\uAC00 \uC774 div\uB97C iframe\uC73C\uB85C \uAD50\uCCB4 \u2014 wrap\uC744 \uAF49 \uCC44\uC6CC\uC57C \uD568 */
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
/* \uC20F\uD3FC \uD558\uB2E8 \uC624\uBC84\uB808\uC774 \u2014 \uC601\uC0C1\uD0ED shop-bar\uC640 \uB3D9\uC77C \uAD6C\uC870 */
.shorts-overlay{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent 0%,rgba(0,0,0,.55) 35%,rgba(10,10,10,.97) 100%);
  padding:60px 14px 20px;
  /* iOS safe area \uD655\uBCF4 \u2014 \uD648\uBC14 \uC601\uC5ED \uC704\uB85C \uBC84\uD2BC \uB04C\uC5B4\uC62C\uB9BC */
  padding-bottom:max(20px, calc(20px + env(safe-area-inset-bottom)));
  z-index:10;
  pointer-events:auto;
}
/* \uC5C5\uCCB4\uC815\uBCF4 + \uC608\uC57D\uBC84\uD2BC \uD55C\uC904 \uBC30\uCE58 */
.shorts-info-row{
  display:flex;align-items:center;gap:10px;
  pointer-events:auto;
}
.shorts-info-body{flex:1;min-width:0;}
/* \uCE74\uD14C\uACE0\uB9AC \uBC43\uC9C0 */
.shorts-cat{
  display:inline-block;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px;
  pointer-events:none;
}
/* \uC5C5\uCCB4\uBA85 */
.shorts-name{
  font-size:17px;font-weight:800;color:#fff;
  line-height:1.25;margin-bottom:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  text-shadow:0 2px 8px rgba(0,0,0,.7);
  pointer-events:none;
}
/* \uC8FC\uC18C */
.shorts-addr{
  font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px;
  pointer-events:none;
}
.shorts-addr i{color:var(--pink);font-size:10px;flex-shrink:0;}
/* \uC608\uC57D \uBC84\uD2BC \u2014 \uC601\uC0C1\uD0ED btn-book\uACFC \uB3D9\uC77C \uC2A4\uD0C0\uC77C */
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
  min-height:48px; /* \uBAA8\uBC14\uC77C \uCD5C\uC18C \uD130\uCE58 \uC601\uC5ED */
  pointer-events:auto;
  touch-action:manipulation; /* 300ms \uB51C\uB808\uC774 \uC81C\uAC70 */
  -webkit-tap-highlight-color:rgba(255,77,125,.2);
  transition:transform .12s,background .12s;
  position:relative;z-index:20; /* overlay z-index 10\uBCF4\uB2E4 \uC704 */
}
.shorts-book-btn i{font-size:16px;}
.shorts-book-btn span{font-size:10px;font-weight:700;}
.shorts-book-btn:active{background:#e0365f;transform:scale(.96);}
/* \uC601\uC0C1 \uC5C6\uB294 \uC2AC\uB77C\uC774\uB4DC \uBC30\uACBD */
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
/* PC \uC804\uC6A9 \uD328\uB110 (\uBAA8\uBC14\uC77C\uC5D0\uC11C\uB294 \uC228\uAE40) */
.shorts-panel-pc{
  display:none;
  flex-direction:column;
  width:100%;height:100%;
}

/* \uD53C\uB4DC \uCE74\uB4DC */
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
/* \uC378\uB124\uC77C \uC0C1\uD0DC */
.yt-thumb{cursor:pointer;}
.yt-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;}
/* \uC7AC\uC0DD\uBC84\uD2BC \uC624\uBC84\uB808\uC774 */
.yt-play-btn{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;}
/* \uC7AC\uC0DD \uC544\uC774\uCF58 \uC6D0\uD615 */
.yt-play-icon{
  width:60px;height:60px;
  background:rgba(180,0,0,.85);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.6);
  pointer-events:none;
  flex-shrink:0;}

/* \u2500\u2500 PC \uB808\uC774\uC544\uC6C3 (768px+): \uCE74\uB4DC \uC790\uCCB4\uB97C \uC88C(\uC601\uC0C1)+\uC6B0(\uC815\uBCF4) 2\uB2E8\uC73C\uB85C \u2500\u2500 */
@media(min-width:768px){
  #feedScreen{
    background:#0a0a0a;
  }
  /* \uCE74\uB4DC: \uAC00\uB85C\uB85C \uB215\uD798 */
  .fi{
    flex-direction:row;
    height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  }
  /* \uC67C\uCABD: \uC601\uC0C1 \uC601\uC5ED \u2014 \uD654\uBA74 \uC808\uBC18 */
  .yt-area{
    flex:1;
    min-width:0;
    height:100%;
  }
  /* \uC624\uB978\uCABD: \uC5C5\uCCB4 \uC815\uBCF4 \uD328\uB110 */
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
    /* PC\uC5D0\uC11C\uB294 \uD558\uB2E8 \uADF8\uB77C\uB370\uC774\uC158 \uC624\uBC84\uB808\uC774 \uD544\uC694 \uC5C6\uC73C\uBBC0\uB85C before \uC81C\uAC70 */
  }
  .shop-bar::before{display:none;}
  /* \uCE74\uD14C\uACE0\uB9AC \uBC43\uC9C0 \u2014 PC\uC5D0\uC11C \uB354 \uD06C\uAC8C */
  .shop-bar-cat{
    font-size:11px;
    padding:4px 12px;
    border-radius:20px;
    margin-bottom:0;
  }
  /* \uC5C5\uCCB4\uBA85 \u2014 PC\uC5D0\uC11C \uB354 \uD06C\uAC8C, 2\uC904\uAE4C\uC9C0 \uD5C8\uC6A9 */
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
  /* \uC704\uCE58 */
  .shop-bar-loc{
    font-size:12px;
    margin-bottom:0;
    white-space:normal;
    word-break:break-all;
  }
  /* \uC124\uBA85 \u2014 PC \uC804\uC6A9 \uC2A4\uD0C0\uC77C */
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
  /* \uC608\uC57D \uBC84\uD2BC \u2014 \uC624\uB978\uCABD \uD328\uB110 \uC548\uC5D0\uC11C \uAC00\uB4DD \uCC28\uAC8C */
  .btn-book{
    width:100%;
    padding:14px 20px;
    font-size:14px;
    border-radius:14px;
    justify-content:center;
    margin-top:4px;
  }
  /* shop-bar-info flex\uB85C \uC138\uB85C \uC313\uAE30 */
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

/* \uC5C5\uCCB4 \uC815\uBCF4 \uBC14 */
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

/* \uB85C\uB529/\uBE48\uC0C1\uD0DC */
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);
  border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* \uC2A4\uCF08\uB808\uD1A4 \uCE74\uB4DC */
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

/* \u2500\u2500 \uC9C0\uB3C4 \uD654\uBA74 \u2500\u2500 */
#naverMap{position:absolute;top:0;left:0;right:0;bottom:0;}

/* \uC9C0\uB3C4 \uC704 \uCE74\uD14C\uACE0\uB9AC \uD544\uD130 (floating) */
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

/* \uB0B4 \uC8FC\uBCC0 FAB */
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

/* \u2500\u2500 \uC9C0\uB3C4 \uC704 \uD31D\uC5C5 \uCE74\uB4DC (\uB450\uBC14\uC774\uCFE0\uD0A4\uB9F5 \uC2A4\uD0C0\uC77C) \u2500\u2500 */
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

/* \uD31D\uC5C5 \uC720\uD29C\uBE0C \uC601\uC5ED */
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

/* \uD31D\uC5C5 \uC815\uBCF4 \uC601\uC5ED */
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

/* \u2500\u2500 \uD558\uB2E8 \uBBF8\uB2C8\uCE74\uB4DC \uD328\uB110 \uC81C\uAC70 \u2500\u2500 */
:root{--panel-h:0px}

/* \uB124\uC774\uBC84 \uC9C0\uB3C4 \uCEE4\uC2A4\uD140 \uB9C8\uCEE4 \u2192 \uC778\uB77C\uC778 \uC2A4\uD0C0\uC77C\uB85C \uCC98\uB9AC, CSS \uBD88\uD544\uC694 */

/* \uD53C\uB4DC\uC6A9 \uBC14\uD140\uC2DC\uD2B8 */
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

/* \u2500\u2500 \uC608\uC57D \uBAA8\uB2EC (iframe) \u2500\u2500 */
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
  pointer-events:none;  /* SVG\uAC00 \uD074\uB9AD \uC774\uBCA4\uD2B8 \uAC00\uB85C\uCC44\uC9C0 \uC54A\uB3C4\uB85D */
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

/* \uD1A0\uC2A4\uD2B8 */
.toast{position:fixed;bottom:calc(var(--nav)+12px);left:50%;
  transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;
  pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* \u2500\u2500 \uD504\uB9AC\uBBF8\uC5C4 \uD53C\uB4DC \uCE74\uB4DC \u2500\u2500 */
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

/* \uD504\uB9AC\uBBF8\uC5C4 \uB9C8\uCEE4 \uAE00\uB85C\uC6B0 \uC560\uB2C8\uBA54\uC774\uC158 */
@keyframes premGlow{
  0%,100%{opacity:.6;transform:scale(1)}
  50%{opacity:1;transform:scale(1.06)}
}
</style>
</head>
<body class="shorts-mode">

<header class="hd">
  <div class="logo" id="logoBtn">
    <div class="logo-icon">\u{1F484}</div>
    \uB9C8\uC774<em>\uBDF0\uD2F0</em>\uB9F5
  </div>
  <div class="hd-right">
    <span class="hd-badge">BETA</span>
    <button class="search-btn" id="searchToggleBtn" onclick="toggleSearch()" aria-label="\uAC80\uC0C9">
      <i class="fas fa-search" id="searchBtnIcon"></i>
    </button>
  </div>
</header>

<!-- \uAC80\uC0C9\uBC14 -->
<div class="search-bar" id="searchBar">
  <div class="search-inner">
    <i class="fas fa-search"></i>
    <input class="search-input" id="searchInput" type="search"
      placeholder="\uC0F5 \uC774\uB984, \uC9C0\uC5ED, \uD0DC\uADF8 \uAC80\uC0C9..."
      oninput="onSearchInput(this.value)"
      onkeydown="if(event.key==='Enter'){this.blur();}"
    />
    <button class="search-clear" id="searchClear" onclick="clearSearch()"><i class="fas fa-times-circle"></i></button>
  </div>
  <div class="search-hint">\uC608) \uAC15\uB0A8 \uB9C8\uC0AC\uC9C0 &nbsp;\xB7&nbsp; \uB208\uC379\uBB38\uC2E0 &nbsp;\xB7&nbsp; \uB9AC\uD504\uD305</div>
</div>

<!-- \uCE74\uD0C8\uB85C\uADF8 \uD0ED\uBC14 (\uD53C\uB4DC \uC804\uC6A9) -->
<div class="cat-bar" id="catBar">
  <div class="cat-scroll">
    ${CATEGORIES.map((c, i) => `<button class="cp${i === 0 ? " active" : ""}" onclick="filterFeed(this,'${c === "\uC804\uCCB4" ? "all" : c}')">${CAT_EMOJI[c]} ${c}</button>${i === 0 ? REC_BTN : ""}`).join("")}
  </div>
</div>

<!-- \uC20F\uD3FC \uC804\uC6A9 \uCE74\uD0C8\uB85C\uADF8 \uBC14 -->
<div id="shortsCatBar">
  <div class="cat-scroll">
    <button class="scp active" id="scat-all"    onclick="filterShorts(this,'all')">\u{1F3E0} \uC804\uCCB4</button>
    <button class="scp"        id="scat-\uB9C8\uC0AC\uC9C0"  onclick="filterShorts(this,'\uB9C8\uC0AC\uC9C0')">\u{1F486} \uB9C8\uC0AC\uC9C0</button>
    <button class="scp"        id="scat-\uD5E4\uB4DC\uC2A4\uD30C" onclick="filterShorts(this,'\uD5E4\uB4DC\uC2A4\uD30C')">\u{1F9D6} \uD5E4\uB4DC\uC2A4\uD30C</button>
    <button class="scp"        id="scat-\uD53C\uBD80\uAD00\uB9AC" onclick="filterShorts(this,'\uD53C\uBD80\uAD00\uB9AC')">\u2728 \uD53C\uBD80\uAD00\uB9AC</button>
    <button class="scp"        id="scat-\uD5E4\uC5B4"    onclick="filterShorts(this,'\uD5E4\uC5B4')">\u{1F487} \uD5E4\uC5B4</button>
    <button class="scp"        id="scat-\uBA54\uC774\uD06C\uC5C5" onclick="filterShorts(this,'\uBA54\uC774\uD06C\uC5C5')">\u{1F484} \uBA54\uC774\uD06C\uC5C5</button>
    <button class="scp"        id="scat-\uC641\uC2F1"    onclick="filterShorts(this,'\uC641\uC2F1')">\u{1FA92} \uC641\uC2F1</button>
    <button class="scp"        id="scat-\uBC18\uC601\uAD6C"  onclick="filterShorts(this,'\uBC18\uC601\uAD6C')">\u{1F58A}\uFE0F \uBC18\uC601\uAD6C</button>
    <button class="scp"        id="scat-\uBCD1\uC6D0"    onclick="filterShorts(this,'\uBCD1\uC6D0')">\u{1F3E5} \uBCD1\uC6D0</button>
    <button class="scp"        id="scat-\uADF8\uC678"    onclick="filterShorts(this,'\uADF8\uC678')">\u{1F338} \uADF8\uC678</button>
  </div>
</div>

<!-- \uD53C\uB4DC \uD654\uBA74 -->
<main id="feedScreen">
  <div class="feed-spin"><div class="spinner"></div></div>
</main>

<!-- \uC9C0\uB3C4 \uD654\uBA74: iframe -->
<section id="mapScreen">
  <!-- \uCE74\uD14C\uACE0\uB9AC \uD544\uD130 -->
  <div class="map-cat-bar" id="mapCatBar">
    ${CATEGORIES.map((c, i) => `<button class="mc${i === 0 ? " active" : ""}" onclick="filterMap(this,'${c === "\uC804\uCCB4" ? "all" : c}')">${CAT_EMOJI[c]} ${c}</button>`).join("")}
  </div>
  <!-- \uC9C0\uB3C4 iframe -->
  <iframe id="mapFrame" src="/map" style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>

  <!-- \u2500\u2500 \uC9C0\uB3C4 \uC704 \uD31D\uC5C5 \uCE74\uB4DC \u2500\u2500 -->
  <div class="map-popup" id="mapPopup">
    <!-- \uBBF8\uB514\uC5B4 \uC601\uC5ED -->
    <div id="mpYt"></div>
    <!-- \uC815\uBCF4 \uC601\uC5ED -->
    <div class="mp-info">
      <div class="mp-info-main">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap;">
          <div class="mp-badge" id="mpBadge"></div>
          <div id="mpPremiumBadge" style="display:none;align-items:center;gap:3px;
            font-size:10px;font-weight:900;padding:3px 8px;border-radius:20px;
            background:linear-gradient(90deg,#FFD700,#FFA500);color:#000;
            box-shadow:0 1px 8px rgba(255,180,0,.5);letter-spacing:.3px;">
            \u2726 PREMIUM
          </div>
        </div>
        <div class="mp-name" id="mpName"></div>
        <div class="mp-meta" id="mpMeta"></div>
        <div class="mp-desc" id="mpDesc"></div>
        <div class="mp-tags" id="mpTags"></div>
      </div>
      <div class="mp-actions">
        <button class="mp-book" id="mpBook"
          onclick="if(curShop){trackMapSPWithSrc(curShop.id);curShop&&(()=>{const e=document.getElementById('rsvDim');const m=document.getElementById('rsvModal');const t=document.getElementById('rsvTitle');const f=document.getElementById('rsvFrame');const l=document.getElementById('rsvLoading');document.getElementById('rsvExtBtn').onclick=()=>window.open(curShop.smartPlaceUrl,'_blank','noopener');t.textContent=curShop.name+' \uC608\uC57D\uD558\uAE30';f.src='';l.classList.remove('hide');e.classList.add('show');m.classList.add('show');fetch('/api/resolve-naver?url='+encodeURIComponent(curShop.smartPlaceUrl)).then(r=>r.json()).then(d=>{f.src=d.resolved;f.onload=()=>l.classList.add('hide');}).catch(()=>{f.src=curShop.smartPlaceUrl;f.onload=()=>l.classList.add('hide');});})()}">
          <i class="fas fa-calendar-check" style="font-size:12px"></i>
          \uB124\uC774\uBC84 \uC608\uC57D
        </button>
        <button class="mp-close" onclick="closeMapPopup()">\u2715</button>
      </div>
    </div>
  </div>
</section>

<!-- \uC785\uC810\uBB38\uC758 \uD654\uBA74 -->
<section id="inquiryScreen">
  <div class="iq-wrap">

    <!-- \uD788\uC5B4\uB85C -->
    <div class="iq-hero">
      <div class="iq-badge">\u2728 \uD30C\uD2B8\uB108 \uBAA8\uC9D1 \uC911</div>
      <div class="iq-title">\uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0<br>\uB0B4 \uC0F5\uC744 \uB4F1\uB85D\uD558\uC138\uC694</div>
      <div class="iq-sub">\uC720\uD29C\uBE0C \uC601\uC0C1\uC73C\uB85C \uD64D\uBCF4\uD558\uACE0<br>\uB354 \uB9CE\uC740 \uACE0\uAC1D\uC5D0\uAC8C \uB2FF\uC744 \uC218 \uC788\uC5B4\uC694</div>
    </div>

    <!-- \uD61C\uD0DD \uCE74\uB4DC -->
    <div class="iq-benefits">
      <div class="iq-benefit">
        <div class="icon">\u25B6\uFE0F</div>
        <div class="bl">\uC720\uD29C\uBE0C \uC601\uC0C1 \uD64D\uBCF4</div>
        <div class="bs">\uC5C5\uCCB4 \uC720\uD29C\uBE0C \uC601\uC0C1\uC744<br>\uD53C\uB4DC\uC5D0 \uC790\uB3D9 \uB178\uCD9C</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">\u{1F5FA}\uFE0F</div>
        <div class="bl">\uC9C0\uB3C4 \uD540 \uB4F1\uB85D</div>
        <div class="bs">\uB124\uC774\uBC84 \uC9C0\uB3C4 \uC704\uC5D0<br>\uC5C5\uCCB4 \uD540 \uD45C\uC2DC</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">\u{1F4C5}</div>
        <div class="bl">\uC608\uC57D \uC5F0\uB3D9</div>
        <div class="bs">\uC2A4\uB9C8\uD2B8\uD50C\uB808\uC774\uC2A4<br>\uBC14\uB85C \uC608\uC57D \uC5F0\uACB0</div>
      </div>

    </div>

    <!-- \uC694\uAE08 \uC548\uB0B4 -->
    <div class="iq-pricing">
      <div class="iq-plan free">
        <div class="plan-tag">\uCD94\uCC9C</div>
        <div class="plan-icon">\u{1F3AC}</div>
        <div class="plan-price">6\uAC1C\uC6D4 \uBB34\uB8CC</div>
        <div class="plan-name">\uCD2C\uC601 \uD50C\uB79C</div>
        <div class="plan-desc">
          \uCD2C\uC601\uBE44 <b style="color:#03C75A">3\uB9CC\uC6D0</b> \uB0B4\uC2DC\uBA74<br>
          <b style="color:#03C75A">6\uAC1C\uC6D4 \uBB34\uB8CC</b> \uAC8C\uC7AC<br>
          <span style="font-size:9px;opacity:.6">\uC774\uD6C4 \uC6D4 10,000\uC6D0</span>
        </div>
      </div>
      <div class="iq-plan paid">
        <div class="plan-tag">\uAE30\uBCF8</div>
        <div class="plan-icon">\u{1F4CD}</div>
        <div class="plan-price">\uC6D4 1\uB9CC\uC6D0</div>
        <div class="plan-name">\uAE30\uBCF8 \uD50C\uB79C</div>
        <div class="plan-desc">\uC601\uC0C1 \uC5C6\uC774<br>\uB9F5 \uAC8C\uC7AC\uB9CC<br><b style="color:var(--pink)">\uC6D4 10,000\uC6D0</b></div>
      </div>
    </div>

    <!-- \uC2E0\uCCAD \uD3FC -->
    <div class="iq-form" id="iqForm">
      <h3>\u{1F4DD} \uC785\uC810 \uC2E0\uCCAD\uC11C</h3>
      <div class="iq-row2">
        <div class="iq-field">
          <label>\uB300\uD45C\uB2D8 \uC131\uD568 *</label>
          <input type="text" id="iq-owner" placeholder="\uD64D\uAE38\uB3D9">
        </div>
        <div class="iq-field">
          <label>\uC5F0\uB77D\uCC98 *</label>
          <input type="tel" id="iq-phone" placeholder="010-0000-0000">
        </div>
      </div>
      <div class="iq-field">
        <label>\uC0F5 \uC774\uB984 *</label>
        <input type="text" id="iq-name" placeholder="\uC608) \uAE00\uB85C\uC6B0 \uC2A4\uD0A8 \uAC15\uB0A8\uC810">
      </div>
      <div class="iq-row2">
        <div class="iq-field">
          <label>\uC5C5\uC885 *</label>
          <select id="iq-cat">
            <option value="">\uC120\uD0DD</option>
            <option>\uB9C8\uC0AC\uC9C0</option><option>\uD5E4\uB4DC\uC2A4\uD30C</option><option>\uD53C\uBD80\uAD00\uB9AC</option>
            <option>\uD5E4\uC5B4</option><option>\uBA54\uC774\uD06C\uC5C5</option><option>\uC641\uC2F1</option><option>\uBC18\uC601\uAD6C</option>
            <option>\uBCD1\uC6D0</option><option>\uADF8\uC678</option>
          </select>
        </div>
        <div class="iq-field">
          <label>\uC9C0\uC5ED *</label>
          <input type="text" id="iq-area" placeholder="\uC608) \uAC15\uB0A8\uAD6C">
        </div>
      </div>
      <div class="iq-field">
        <label>\uC2A4\uB9C8\uD2B8\uD50C\uB808\uC774\uC2A4 URL</label>
        <input type="url" id="iq-url" placeholder="https://naver.me/...">
      </div>
      <div class="iq-field">
        <label>\uBB38\uC758\uC0AC\uD56D</label>
        <textarea id="iq-msg" placeholder="\uAD81\uAE08\uD55C \uC810\uC774\uB098 \uC694\uCCAD\uC0AC\uD56D\uC744 \uC801\uC5B4\uC8FC\uC138\uC694"></textarea>
      </div>
    </div>

    <!-- \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9 \uB3D9\uC758 -->
    <div class="iq-agree">
      <div class="iq-agree-title">\u{1F512} \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9 \uB3D9\uC758</div>
      <div class="iq-agree-body">
        <b>\uC218\uC9D1 \uD56D\uBAA9:</b> \uC131\uD568, \uC5F0\uB77D\uCC98, \uC0F5\uBA85, \uC5C5\uC885, \uC9C0\uC5ED, \uC2A4\uB9C8\uD2B8\uD50C\uB808\uC774\uC2A4 URL, \uBB38\uC758\uC0AC\uD56D<br>
        <b>\uC218\uC9D1 \uBAA9\uC801:</b> \uC785\uC810 \uAC80\uD1A0 \uBC0F \uC0C1\uB2F4 \uC5F0\uB77D<br>
        <b>\uBCF4\uC720 \uAE30\uAC04:</b> \uC785\uC810 \uAC80\uD1A0 \uC644\uB8CC \uD6C4 1\uB144 \uB610\uB294 \uB3D9\uC758 \uCCA0\uD68C \uC2DC\uAE4C\uC9C0<br>
        <b>\uC81C3\uC790 \uC81C\uACF5:</b> \uC5C6\uC74C (\uB0B4\uBD80 \uAC80\uD1A0 \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9)<br><br>
        \uADC0\uD558\uB294 \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uB97C \uAC70\uBD80\uD560 \uAD8C\uB9AC\uAC00 \uC788\uC73C\uBA70, \uB3D9\uC758 \uAC70\uBD80 \uC2DC \uC785\uC810 \uC2E0\uCCAD\uC774 \uC81C\uD55C\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.
      </div>
      <label class="iq-agree-check">
        <input type="checkbox" id="iq-agree-chk">
        <span>\uC704 \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 <b>(\uD544\uC218)</b> \uB3D9\uC758\uD569\uB2C8\uB2E4</span>
      </label>
    </div>

    <button class="iq-submit" onclick="submitInquiry()">
      <i class="fas fa-paper-plane" style="margin-right:6px"></i>\uC785\uC810 \uC2E0\uCCAD\uD558\uAE30
    </button>

    <!-- \uC644\uB8CC \uBA54\uC2DC\uC9C0 -->
    <div class="iq-done" id="iqDone">
      <div class="done-icon">\u{1F389}</div>
      <div class="done-title">\uC2E0\uCCAD\uC774 \uC811\uC218\uB410\uC5B4\uC694!</div>
      <div class="done-sub">\uB2F4\uB2F9\uC790\uAC00 \uD655\uC778 \uD6C4<br>1~2\uC77C \uB0B4\uB85C \uC5F0\uB77D\uB4DC\uB9B4\uAC8C\uC694.</div>
    </div>

    <div class="iq-notice">
      \uC785\uB825\uD558\uC2E0 \uC815\uBCF4\uB294 \uC785\uC810 \uAC80\uD1A0 \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uB418\uBA70<br>
      \uC81C3\uC790\uC5D0\uAC8C \uC81C\uACF5\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. (\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638\uBC95 \uC900\uC218)
    </div>
  </div>
</section>

<!-- \uAD6C\uAE00 \uC560\uB4DC\uC13C\uC2A4 \uAD11\uACE0 \uBC30\uB108 -->
<div id="coupang-ad">
  <ins class="adsbygoogle"
    style="display:inline-block;width:100%"
    data-ad-client="ca-pub-6943282483618134"
    data-ad-slot="5241168678"
    data-ad-format="fixed"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>

<!-- \uC74C\uC18C\uAC70 \uBC84\uD2BC (\uB9B4\uC2A4 \uC804\uC6A9) -->
<button id="shorts-mute-btn" onclick="toggleShortsMute()">
  <i class="fas fa-volume-mute"></i>
</button>

<!-- \uC20F\uD3FC \uC2A4\uD06C\uB9B0 -->
<section id="shortsScreen">
  <div id="shortsFeed" style="height:100%;display:flex;flex-direction:column"></div>
</section>

<!-- \uD558\uB2E8 \uD0ED\uBC14: \uB9B4\uC2A4 \u2192 \uC601\uC0C1 \u2192 \uC9C0\uB3C4 \u2192 \uC785\uC810 -->
<nav class="tabbar">
  <button class="tab" id="tab-shorts" onclick="switchTab('shorts')">
    <i class="fas fa-fire"></i>\uB9B4\uC2A4
  </button>
  <button class="tab" id="tab-feed" onclick="switchTab('feed')">
    <i class="fas fa-play-circle"></i>\uC601\uC0C1
  </button>
  <button class="tab" id="tab-map" onclick="switchTab('map')">
    <i class="fas fa-map-marker-alt"></i>\uC9C0\uB3C4
  </button>
  <button class="tab" id="tab-inquiry" onclick="switchTab('inquiry')">
    <i class="fas fa-store"></i>\uC785\uC810\uBB38\uC758
  </button>
</nav>

<!-- \uD53C\uB4DC \uC804\uC6A9 \uB524 + \uBC14\uD140\uC2DC\uD2B8 -->
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
    <div class="s-price">\uC2DC\uC220 <span id="sPrice"></span></div>
    <div class="s-actions">
      <button class="s-book" id="sBook" onclick="_sessionTrackFeedBook();_sessionEvent(&quot;feed_book&quot;,curShop);openInapp()">
        <i class="fas fa-calendar-check"></i> \uB124\uC774\uBC84 \uC608\uC57D\uD558\uAE30
      </button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

<!-- \uC608\uC57D \uBAA8\uB2EC (iframe) -->
<div class="rsv-dim" id="rsvDim" onclick="closeReserve()"></div>
<div class="rsv-modal" id="rsvModal">
  <div class="rsv-topbar">
    <div class="rsv-topbar-handle"></div>
    <span class="rsv-topbar-title" id="rsvTitle"></span>
    <button class="rsv-topbar-ext" id="rsvExtBtn" title="\uBE0C\uB77C\uC6B0\uC800\uB85C \uC5F4\uAE30" type="button">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2" style="pointer-events:none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </button>
    <button class="rsv-topbar-close" onclick="closeReserve()" title="\uB2EB\uAE30" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5" style="pointer-events:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="rsv-loading" id="rsvLoading"><div class="rsv-loading-bar"></div></div>
  <iframe class="rsv-iframe" id="rsvFrame" src=""
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
    allowfullscreen></iframe>
</div>



<script>
// \u2500\u2500 \uC804\uC5ED \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let allShops   = [];
let mapCat     = 'all';
let nearbyOn   = false;
let userLat    = null;
let userLng    = null;
let curShop    = null;
let naverMap   = null;
let mapInited  = false;
let nvMarkers  = {};   // id -> {marker, overlay}
// \u2500\u2500 \uC601\uC0C1\uC870\uD68C: \uC2E4\uC81C \uD074\uB9AD(\uC7AC\uC0DD)\uD560 \uB54C\uB9CC, \uC138\uC158 \uB0B4 \uC5C5\uCCB4\uB2F9 1\uD68C\uB9CC \uCE74\uC6B4\uD305 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// sessionStorage \uC0AC\uC6A9 \u2192 \uC0C8\uB85C\uACE0\uCE68\uD574\uB3C4 \uD0ED \uB2EB\uAE30 \uC804\uAE4C\uC9C0 \uC911\uBCF5 \uBC29\uC9C0
// source: 'feed' | 'catalog' | 'map'  (\uC5B4\uB514\uC11C \uC601\uC0C1\uC744 \uC7AC\uC0DD\uD588\uB294\uC9C0)
function trackView(shopId, source) {
  if (!shopId) return;
  const id  = String(shopId);
  const src = source || 'feed';
  const key = 'viewed_' + id + '_' + src; // source\uBCC4\uB85C \uB3C5\uB9BD \uCE74\uC6B4\uD305
  if (sessionStorage.getItem(key)) return; // \uC774\uBBF8 \uC774 \uD0ED\uC5D0\uC11C \uCE74\uC6B4\uD305\uB428
  sessionStorage.setItem(key, '1');
  lastViewSrc = src; // \uC608\uC57D\uD074\uB9AD \uC804\uD658\uC728 \uBD84\uC11D\uC6A9: \uB9C8\uC9C0\uB9C9 \uC601\uC0C1 \uCD9C\uCC98 \uAE30\uC5B5
  fetch('/api/track/view/'+id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: src }),
  }).catch(()=>{});
}
let userMarker = null;

const CAT_CLASS = {
  '\uB9C8\uC0AC\uC9C0':'cat-massage', '\uD5E4\uB4DC\uC2A4\uD30C':'cat-headspa',
  '\uD53C\uBD80\uAD00\uB9AC':'cat-skin', '\uD5E4\uC5B4':'cat-hair', '\uBA54\uC774\uD06C\uC5C5':'cat-makeup',
  '\uC641\uC2F1':'cat-wax', '\uBC18\uC601\uAD6C':'cat-perm', '\uBCD1\uC6D0':'cat-hospital', '\uADF8\uC678':'cat-etc',
};

// \u2500\u2500 \uD0ED \uC804\uD658 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function switchTab(tab) {
  _sessionTrackTab(tab); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801
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

  // \u2500\u2500 \uC20F\uD3FC \uBAA8\uB4DC: body \uD074\uB798\uC2A4\uB85C \uD5E4\uB354\xB7\uAD11\uACE0 \uD1B5\uD569 \uC81C\uC5B4 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.body.classList.toggle('shorts-mode', tab === 'shorts');
  const sCatBar = document.getElementById('shortsCatBar');
  if (sCatBar) sCatBar.classList.toggle('show', tab === 'shorts');
  document.documentElement.style.setProperty('--scat', tab === 'shorts' ? '44px' : '0px');
  // \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  // \uAC80\uC0C9\uBC14 placeholder\xB7\uD78C\uD2B8 \uD0ED\uC5D0 \uB530\uB77C \uBCC0\uACBD
  const si = document.getElementById('searchInput');
  const sh = document.querySelector('.search-hint');
  if (si && sh) {
    si.placeholder = '\uC0F5 \uC774\uB984, \uC9C0\uC5ED, \uD0DC\uADF8 \uAC80\uC0C9...';
    sh.textContent = '\uC608) \uAC15\uB0A8 \uB9C8\uC0AC\uC9C0  \xB7  \uB208\uC379\uBB38\uC2E0  \xB7  \uB9AC\uD504\uD305';
  }

  if (tab==='shorts') {
    // \uC20F\uD3FC \uD0ED \uC9C4\uC785 \u2192 \uC601\uC0C1\uD0ED feed-iframe \uC815\uC9C0
    if (_feedCurrentCard) {
      const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
      if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
    }
    closeFeedSheet && closeFeedSheet();
    // \uC20F\uD3FC \uB85C\uB4DC & \uC7AC\uC0DD
    if (_shortsLoaded && _shortsItems.length) {
      const sc = document.getElementById('shortsScreen');
      if (sc) {
        _shortsStopAll();
        sc.scrollTop = 0;
        // display:block \uC804\uD658 \uD6C4 \uB808\uC774\uC544\uC6C3 \uD655\uC815\uAE4C\uC9C0 \uB300\uAE30 (\uBAA8\uBC14\uC77C Safari \uB300\uC751)
        setTimeout(() => { initShortsObserver(sc); }, 200);
      }
    } else {
      loadShorts(_shortsCat);
    }
  } else {
    // \uB9B4\uC2A4 \uD0ED \uC774\uD0C8 \u2192 \uBAA8\uB4E0 \uC601\uC0C1 \uC989\uC2DC \uC815\uC9C0
    _shortsStopAll();
  }
  // \uC601\uC0C1\uD0ED \uC774\uD0C8 \uC2DC feed \uC815\uC9C0
  if (tab !== 'feed' && _feedCurrentCard) {
    const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
  }
  // \uC601\uC0C1\uD0ED \uC9C4\uC785/\uBCF5\uADC0 \uC2DC \uC7AC\uC0DD
  if (tab === 'feed') {
    const scr = document.getElementById('feedScreen');
    if (scr) {
      // \uD604\uC7AC \uCE74\uB4DC \uBCF5\uADC0 \uC7AC\uC0DD, \uC5C6\uC73C\uBA74 \uCCAB \uCE74\uB4DC \uD65C\uC131\uD654
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

// \u2500\u2500 \uB85C\uACE0 5\uBC88 \uD0ED \u2192 \uAD00\uB9AC\uC790 \uC120\uD0DD \uD31D\uC5C5 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 \u26A1 \uC20F\uD3FC \uD53C\uB4DC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let _shortsLoaded   = false;
let _shortsObserver = null;
let _shortsItems    = [];   // \uC804\uCCB4 \uC5C5\uCCB4 \uCE90\uC2DC
let _shortsCat      = 'all'; // \uD604\uC7AC \uC120\uD0DD\uB41C \uCE74\uD14C\uACE0\uB9AC

// \uC571 \uC9C4\uC785 \uC2DC \uB9B4\uC2A4 \uD0ED\uC73C\uB85C \uC2DC\uC791 (switchTab\uC774 body.shorts-mode + catBar + \uB85C\uB4DC \uBAA8\uB450 \uCC98\uB9AC)
document.addEventListener('DOMContentLoaded', () => {
  switchTab('shorts');
  _sessionInit();
});

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \u{1F441}\uFE0F \uBC29\uBB38\uC790 \uC138\uC158 \uCD94\uC801 \uC5D4\uC9C4
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let _sessId       = '';
let _sessStart    = Date.now();
let _sessTabs     = [];   // \uBC29\uBB38\uD55C \uD0ED \uC21C\uC11C
let _sessTimer    = null;
// \uC20F\uD3FC
let _sessShorts   = 0;   // \uC20F\uD3FC \uC2DC\uCCAD \uC218
let _sessShortsBook = 0; // \uC20F\uD3FC \uC608\uC57D\uD074\uB9AD \uC218
// \uD53C\uB4DC
let _sessFeedCard = 0;   // \uD53C\uB4DC \uC5C5\uCCB4\uCE74\uB4DC \uD074\uB9AD
let _sessFeedBook = 0;   // \uD53C\uB4DC \uC608\uC57D\uD074\uB9AD
// \uC9C0\uB3C4
let _sessMapPin   = 0;   // \uC9C0\uB3C4 \uB9C8\uCEE4 \uD074\uB9AD
let _sessMapBook  = 0;   // \uC9C0\uB3C4 \uC608\uC57D\uD074\uB9AD
// \uAE30\uD0C0
let _sessSearch   = 0;   // \uAC80\uC0C9 \uC0AC\uC6A9
let _sessInquiry  = 0;   // \uBB38\uC758 \uC81C\uCD9C

function _sessionInit() {
  // \uC138\uC158 ID: localStorage\uC5D0 \uC800\uC7A5 (\uD0ED \uB2EB\uAE30 \uC804\uAE4C\uC9C0 \uC720\uC9C0)
  // \uC0C8\uB85C\uACE0\uCE68\uC740 \uC0C8 \uC138\uC158\uC73C\uB85C \uCC98\uB9AC
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

  // \uC11C\uBC84\uC5D0 \uC138\uC158 \uC2DC\uC791 \uC54C\uB9BC
  fetch('/api/track/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: _sessId, device }),
  }).catch(() => {});

  // 30\uCD08\uB9C8\uB2E4 heartbeat
  _sessTimer = setInterval(() => _sessionFlush(false), 30000);

  // \uD0ED \uB2EB\uAE30 / \uD398\uC774\uC9C0 \uC774\uD0C8 \uC2DC \uCD5C\uC885 \uC804\uC1A1
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
  // sendBeacon: \uD398\uC774\uC9C0 \uB2EB\uD600\uB3C4 \uC804\uC1A1 \uBCF4\uC7A5
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

// \uD0ED \uC804\uD658
function _sessionTrackTab(tab) {
  if (!_sessId) return;
  if (!_sessTabs.includes(tab)) _sessTabs.push(tab);
}
// \uC20F\uD3FC \uC2DC\uCCAD
function _sessionTrackShorts() {
  if (!_sessId) return;
  _sessShorts++;
}
// \uC20F\uD3FC \uC608\uC57D\uD074\uB9AD
function _sessionTrackShortsBook() {
  if (!_sessId) return;
  _sessShortsBook++;
  _sessionFlush(false); // \uC608\uC57D \uC989\uC2DC flush \u2014 \uC774\uD0C8 \uC804 \uB204\uB77D \uBC29\uC9C0
}
// \uD53C\uB4DC \uC5C5\uCCB4\uCE74\uB4DC \uD074\uB9AD
function _sessionTrackFeedCard() {
  if (!_sessId) return;
  _sessFeedCard++;
}
// \uD53C\uB4DC \uC608\uC57D\uD074\uB9AD
function _sessionTrackFeedBook() {
  if (!_sessId) return;
  _sessFeedBook++;
  _sessionFlush(false); // \uC608\uC57D \uC989\uC2DC flush
}
// \uC9C0\uB3C4 \uB9C8\uCEE4 \uD074\uB9AD
function _sessionTrackMapPin() {
  if (!_sessId) return;
  _sessMapPin++;
}
// \uC9C0\uB3C4 \uC608\uC57D\uD074\uB9AD
function _sessionTrackMapBook() {
  if (!_sessId) return;
  _sessMapBook++;
  _sessionFlush(false); // \uC608\uC57D \uC989\uC2DC flush
}
// \uAC80\uC0C9 \uC0AC\uC6A9
function _sessionTrackSearch() {
  if (!_sessId) return;
  _sessSearch++;
}
// \uBB38\uC758 \uC81C\uCD9C
function _sessionTrackInquiry() {
  if (!_sessId) return;
  _sessInquiry++;
}

// \u2500\u2500 \uC5C5\uCCB4\uBCC4 \uC774\uBCA4\uD2B8 \uB85C\uADF8 (\uC11C\uBC84\uB85C \uC989\uC2DC \uC804\uC1A1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
  // \uBC84\uD2BC active \uD1A0\uAE00
  document.querySelectorAll('#shortsCatBar .scp').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // \uCE90\uC2DC \uC720\uC9C0\uD558\uBA74\uC11C \uD544\uD130\uB9CC \uBCC0\uACBD (\uC7ACfetch \uC5C6\uC74C)
  loadShorts(cat);
}

// \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328 \uC2DC \uC7AC\uC2DC\uB3C4
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
    el.innerHTML = '<div class="shorts-empty">\uBD88\uB7EC\uC624\uB294 \uC911...</div>';
    try {
      const res = await fetch('/api/shorts');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      _shortsItems = Array.isArray(data) ? data : [];
    } catch(e) {
      console.error('[loadShorts] fetch error:', e);
      _shortsLoaded = false;
      el.innerHTML = '<div class="shorts-empty">'
        + '<div style="font-size:32px;margin-bottom:12px">\u{1F625}</div>'
        + '<div style="margin-bottom:16px">\uC601\uC0C1\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694</div>'
        + '<button onclick="retryLoadShorts()" style="'
          + 'background:var(--pink);color:#fff;border:none;border-radius:20px;'
          + 'padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">'
          + '\u{1F504} \uB2E4\uC2DC \uC2DC\uB3C4</button>'
        + '</div>';
      return;
    }
  }

  // \uB79C\uB364 \uC154\uD50C (Fisher-Yates)
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
    el.innerHTML = '<div class="shorts-empty">\u{1F3AC} \uC20F\uD3FC \uC601\uC0C1\uC744 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4!</div>';
    if (_shortsObserver) _shortsObserver.disconnect();
    return;
  }

  // \uAE30\uC874 YT \uD50C\uB808\uC774\uC5B4 \uC804\uBD80 destroy \uD6C4 innerHTML \uAD50\uCCB4 (\uBA54\uBAA8\uB9AC \uB204\uC218 \uBC29\uC9C0)
  _shortsDestroyAll();
  el.style.cssText = 'height:100%;display:flex;flex-direction:column;';
  el.innerHTML = items.map((shop, i) => shortsSlide(shop, i)).join('');
  _shortsTotal = items.length;
  _shortsActiveIdx = -1;
  screen.scrollTop = 0;
  // PC(768px+): wheel\uB85C \uC2AC\uB77C\uC774\uB4DC \uB118\uAE30\uAE30 \uB4F1\uB85D (CSS !important\uB85C \uB808\uC774\uC544\uC6C3 \uCC98\uB9AC)
  if (window.innerWidth >= 768) {
    _initPcShortsWheel(screen);
  }
  // \uB808\uC774\uC544\uC6C3 \uADF8\uB824\uC9C4 \uD6C4 Observer \uB4F1\uB85D \u2192 \uCCAB \uC2AC\uB77C\uC774\uB4DC \uC790\uB3D9 \uAC10\uC9C0\xB7\uC7AC\uC0DD
  // \uBAA8\uBC14\uC77C Safari: display:block \uC804\uD658 \uD6C4 layout \uD655\uC815\uAE4C\uC9C0 200ms \uB300\uAE30
  setTimeout(() => { initShortsObserver(screen); }, 200);
}

// \uC804\uCCB4 \uC74C\uC18C\uAC70 \uC0C1\uD0DC (\uAE30\uBCF8: \uC74C\uC18C\uAC70)
let _shortsMuted = true;

function shortsSlide(shop, idx) {
  const clId = shop.cloudinary_public_id || '';
  const ytId = shop.youtube_id || '';
  const cat  = shop.category || '';
  const name = shop.name || '';
  const addr = shop.address || '';
  // Cloudinary \uC601\uC0C1 URL \uC0DD\uC131 (\uC6D0\uBCF8 9:16 \uC138\uB85C \uADF8\uB300\uB85C \uC0AC\uC6A9)
  const clUrl = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4'
    : '';
  // Cloudinary \uC378\uB124\uC77C URL (poster) - 0\uCD08 \uD504\uB808\uC784
  const clPoster = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/so_0/' + clId + '.jpg'
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
      // \uBAA8\uBC14\uC77C: \uAE30\uC874 \uD558\uB2E8 \uC624\uBC84\uB808\uC774
      '<div class="shorts-info-row">' +
        '<div class="shorts-info-body">' +
          (cat ? '<span class="shorts-cat">' + cat + '</span>' : '') +
          '<div class="shorts-name">' + name + '</div>' +
          (addr ? '<div class="shorts-addr"><i class="fas fa-map-pin"></i>' + addr + '</div>' : '') +
        '</div>' +
        '<button class="shorts-book-btn" onclick="event.stopPropagation();shortsOpenBook(' + JSON.stringify(shop).replace(/"/g,'&quot;') + ')">' +
          '<i class="fas fa-calendar-check"></i>' +
          '<span>\uC608\uC57D\uD558\uAE30</span>' +
        '</button>' +
      '</div>' +
      // PC \uC804\uC6A9: \uC138\uB828\uB41C \uC815\uBCF4 \uD328\uB110
      '<div class="shorts-panel-pc">' +
        // \uCE74\uD14C\uACE0\uB9AC \uBC43\uC9C0
        (cat ? '<span class="shorts-cat"><i class="fas fa-tag" style="font-size:9px;opacity:.7"></i>' + cat + '</span>' : '') +
        // \uC5C5\uCCB4\uBA85
        '<div class="shorts-name shorts-panel-name">' + name + '</div>' +
        // \uC8FC\uC18C
        (addr ? '<div class="shorts-addr shorts-panel-addr"><i class="fas fa-location-dot" style="color:var(--pink);font-size:11px"></i><span>' + addr + '</span></div>' : '') +
        // \uAD6C\uBD84\uC120
        '<div class="shorts-panel-divider"></div>' +
        // \uC608\uC57D \uBC84\uD2BC
        (shop.smart_place_url
          ? '<button class="shorts-book-btn shorts-panel-btn" onclick="event.stopPropagation();shortsOpenBook(' + JSON.stringify(shop).replace(/"/g,'&quot;') + ')">' +
              '<i class="fas fa-calendar-check"></i>' +
              '<span>\uB124\uC774\uBC84 \uC608\uC57D\uD558\uAE30</span>' +
            '</button>'
          : '<button class="shorts-panel-btn" style="width:100%;padding:15px;font-size:14px;font-weight:800;border-radius:16px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.35);border:1.5px solid rgba(255,255,255,.08);cursor:default;display:flex;align-items:center;justify-content:center;gap:8px" disabled>' +
              '<i class="fas fa-calendar-xmark"></i>' +
              '<span>\uC608\uC57D \uC815\uBCF4 \uC5C6\uC74C</span>' +
            '</button>'
        ) +
        // \uD558\uB2E8 \uD78C\uD2B8
        '<div class="shorts-panel-hint">' +
          '<i class="fas fa-computer-mouse" style="opacity:.4;font-size:13px"></i>' +
          '<span>\uC2A4\uD06C\uB864\uB85C \uB2E4\uC74C \uC601\uC0C1</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>'
  );
}

// \u2500\u2500 \uB9B4\uC2A4 \uC2AC\uB77C\uC774\uB4DC \uD0ED: \uC7AC\uC0DD/\uC815\uC9C0 \uD1A0\uAE00 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function shortsSlideClick(e, slide) {
  if (!slide) return;
  if (e.target.closest('.shorts-overlay')) return;
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';

  // Cloudinary \uC601\uC0C1\uC778 \uACBD\uC6B0
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

// \u2500\u2500 \uC7AC\uC0DD/\uC815\uC9C0 \uC544\uC774\uCF58 \uD31D\uC778 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 \uC74C\uC18C\uAC70 \uD1A0\uAE00 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function toggleShortsMute() {
  _shortsMuted = !_shortsMuted;
  // Cloudinary <video> \uC74C\uC18C\uAC70
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    v.muted = _shortsMuted;
  });
  // YouTube fallback \uC74C\uC18C\uAC70
  Object.values(_ytPlayers).forEach(p => {
    try { _shortsMuted ? p.mute() : p.unMute(); } catch(e) {}
  });
  const btn = document.getElementById('shorts-mute-btn');
  if (btn) btn.innerHTML = _shortsMuted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';
}

function shortsOpenBook(shop) {
  if (!shop.smart_place_url) { showToast('\uC608\uC57D \uB9C1\uD06C\uAC00 \uC5C6\uC5B4\uC694'); return; }
  fetch('/api/track/shorts/sp/' + shop.id, { method: 'POST' }).catch(() => {});
  _sessionTrackShortsBook(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uC20F\uD3FC \uC608\uC57D\uD074\uB9AD
  _sessionEvent('shorts_book', shop);  // \u{1F441}\uFE0F \uC5C5\uCCB4 \uC774\uBCA4\uD2B8
  curShop = { name: shop.name || '', smartPlaceUrl: shop.smart_place_url || '' };
  openInapp();
}

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \uC20F\uD3FC \uD50C\uB808\uC774\uC5B4 \uC5D4\uC9C4 (Cloudinary <video> + YouTube IFrame fallback)
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let _ytPlayers        = {};   // { idx: YT.Player } \u2014 YouTube fallback\uC6A9
let _ytApiReady       = false;
let _ytApiLoading     = false;
let _ytPendingInits   = [];
let _shortsActiveIdx  = -1;
let _shortsTotal      = 0;
let _shortsUserGestured = false;
let _shortsViewStart  = 0;
let _shortsViewShopId = null;

// \u2500\u2500 Cloudinary <video> \uD5EC\uD37C \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \u2500\u2500 YouTube IFrame fallback (youtube_id\uB9CC \uC788\uB294 \uAD6C \uB370\uC774\uD130\uC6A9) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

// \uC2AC\uB77C\uC774\uB4DC \uD65C\uC131\uD654: Cloudinary <video> \uC7AC\uC0DD or YouTube \uD50C\uB808\uC774\uC5B4 \uC0DD\uC131
function _shortsActivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';
  const ytId = slide.dataset.ytid || '';
  if (!clId && !ytId) return;
  if (_shortsActiveIdx === idx) return;

  // \u2500\u2500 \uC774\uC804 \uC2AC\uB77C\uC774\uB4DC \uC2DC\uCCAD \uC2DC\uAC04 \uB9C8\uBB34\uB9AC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const prevSec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const prevShop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (prevShop && prevSec > 0) _sessionEvent('shorts_view_end', prevShop, prevSec);
  }

  _shortsActiveIdx = idx;
  _sessionTrackShorts();

  // \uC544\uC774\uCF58 \uCD08\uAE30\uD654
  const icon = slide.querySelector('.shorts-pi');
  if (icon) { icon.style.opacity='0'; icon.style.transform='translate(-50%,-50%) scale(0)'; }

  // Cloudinary \uC601\uC0C1 \uC7AC\uC0DD
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

  // \uC870\uD68C\uC218 \uD2B8\uB798\uD0B9
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

// \uC2AC\uB77C\uC774\uB4DC \uBE44\uD65C\uC131\uD654: \uC815\uC9C0
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
  // Cloudinary \uC601\uC0C1 \uC804\uBD80 \uC815\uC9C0
  document.querySelectorAll('.shorts-cl-video').forEach(v => { try { v.pause(); } catch(e) {} });
  // YouTube fallback \uC804\uBD80 \uC815\uC9C0
  Object.values(_ytPlayers).forEach(p => { try { p.pauseVideo(); } catch(e) {} });
  _shortsActiveIdx = -1;
  const sc = document.getElementById('shortsScreen');
  if (sc && sc._shortsScrollTimer) { clearTimeout(sc._shortsScrollTimer); sc._shortsScrollTimer = null; }
}

function _shortsDestroyAll() {
  // Cloudinary \uC601\uC0C1 \uCD08\uAE30\uD654
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e) {}
  });
  // YouTube fallback \uC81C\uAC70
  Object.values(_ytPlayers).forEach(p => { try { p.destroy(); } catch(e) {} });
  _ytPlayers = {};
  _shortsActiveIdx = -1;
  // _shortsUserGestured\uB294 \uB9AC\uC14B\uD558\uC9C0 \uC54A\uC74C
}

function initShortsObserver(screen) {
  if (_shortsObserver) { _shortsObserver.disconnect(); _shortsObserver = null; }
  if (screen._shortsScrollHandler) {
    screen.removeEventListener('scroll', screen._shortsScrollHandler);
    screen._shortsScrollHandler = null;
  }

  // IntersectionObserver: 50% \uC774\uC0C1 \uBCF4\uC774\uBA74 \uD65C\uC131\uD654, 20% \uBBF8\uB9CC\uC774\uBA74 \uBE44\uD65C\uC131\uD654
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

  // scroll fallback: snap \uD6C4 Observer \uBBF8\uB3D9\uC791 \uC2DC \uBCF4\uC815
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

  // iOS Safari rAF \uD2B8\uB9AD: Observer \uCCAB \uAC10\uC9C0 \uAC15\uC81C
  requestAnimationFrame(() => {
    const cur = screen.scrollTop;
    screen.scrollTop = cur + 1;
    requestAnimationFrame(() => { screen.scrollTop = cur; });
  });
}

// PC wheel \u2192 \uC2AC\uB77C\uC774\uB4DC \uD504\uB85C\uADF8\uB798\uB9E4\uD2F1 \uC2A4\uD06C\uB864
function _initPcShortsWheel(screen) {
  // \uAE30\uC874 \uD578\uB4E4\uB7EC \uC81C\uAC70
  if (screen._pcWheelHandler) {
    screen.removeEventListener('wheel', screen._pcWheelHandler);
    screen._pcWheelHandler = null;
  }
  let _wheelLock = false;
  screen._pcWheelHandler = function(e) {
    e.preventDefault();
    if (_wheelLock) return;
    _wheelLock = true;
    const slides = Array.from(screen.querySelectorAll('.shorts-slide'));
    if (!slides.length) { _wheelLock = false; return; }
    const slideH = screen.clientHeight;
    const cur = Math.round(screen.scrollTop / slideH);
    const next = e.deltaY > 0
      ? Math.min(cur + 1, slides.length - 1)
      : Math.max(cur - 1, 0);
    screen.scrollTo({ top: next * slideH, behavior: 'smooth' });
    setTimeout(() => { _wheelLock = false; }, 600);
  };
  screen.addEventListener('wheel', screen._pcWheelHandler, { passive: false });
}

function showAdminPicker() {
  const pw = prompt('\uAD00\uB9AC\uC790 \uBE44\uBC00\uBC88\uD638');
  if (pw === null) return;
  if (pw !== '0907') { showToast('\u274C \uBE44\uBC00\uBC88\uD638\uAC00 \uD2C0\uB838\uC5B4\uC694'); return; }
  location.href = '/admin';
}

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \uD53C\uB4DC
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let feedCat = 'all';
let searchQ = '';
let searchTimer = null;

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// \uD53C\uB4DC: CSS scroll-snap \uBC29\uC2DD (JS \uB192\uC774\uACC4\uC0B0 \uC5C6\uC74C)
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

// \uC720\uD29C\uBE0C \uC378\uB124\uC77C \uD3F4\uBC31: maxresdefault \u2192 hqdefault \u2192 \uC5C5\uCCB4 \uC378\uB124\uC77C \u2192 \uADF8\uB77C\uB370\uC774\uC158
function feedThumbFallback(img, shopThumb) {
  const src = img.src || '';
  if (src.includes('maxresdefault')) {
    // 1\uB2E8\uACC4: hqdefault \uC2DC\uB3C4
    img.src = src.replace('maxresdefault', 'hqdefault');
  } else if (src.includes('hqdefault')) {
    // 2\uB2E8\uACC4: \uC5C5\uCCB4 \uB4F1\uB85D \uC378\uB124\uC77C \uC2DC\uB3C4
    if (shopThumb) {
      img.src = shopThumb;
    } else {
      // 3\uB2E8\uACC4: \uADF8\uB77C\uB370\uC774\uC158 placeholder (img \uC228\uAE30\uACE0 \uBD80\uBAA8 \uBC30\uACBD \uC801\uC6A9)
      img.style.display = 'none';
      img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
    }
  } else {
    // \uC5C5\uCCB4 \uC378\uB124\uC77C\uB3C4 \uC2E4\uD328 \u2192 \uADF8\uB77C\uB370\uC774\uC158
    img.style.display = 'none';
    img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
  }
}

function feedCardHTML(s) {
  // iframe\uC744 \uCC98\uC74C\uBD80\uD130 \uC0BD\uC785 (autoplay=1, mute=1)
  // \uBE0C\uB77C\uC6B0\uC800 autoplay \uC815\uCC45: mute=1 \uD544\uC218 (\uC74C\uC18C\uAC70 \uC0C1\uD0DC\uB85C \uC790\uB3D9\uC7AC\uC0DD)
  // \uD654\uBA74\uC5D0 \uB4E4\uC5B4\uC624\uBA74 \uC790\uB3D9\uC7AC\uC0DD, \uC774\uD0C8\uD558\uBA74 src \uBE44\uC6CC\uC11C \uC815\uC9C0
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
  // data-shop JSON \uC774\uC2A4\uCF00\uC774\uD504 \uBC84\uADF8 \u2192 data-id/url/name \uAC1C\uBCC4 \uC18D\uC131\uC73C\uB85C \uBD84\uB9AC
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
        + '<i class="fas fa-calendar-check"></i><span>\uC608\uC57D\uD558\uAE30</span></button>'
    : '';
  // \uD504\uB9AC\uBBF8\uC5C4 \uBC43\uC9C0
  const premiumBadge = s.isPremium
    ? '<div class="feed-premium-badge"><span>\u2726</span> PREMIUM</div>'
    : '';
  // \uD504\uB9AC\uBBF8\uC5C4 \uD14C\uB450\uB9AC \uAE00\uB85C\uC6B0
  const premiumClass = s.isPremium ? ' fi-premium' : '';
  return '<div class="fi' + premiumClass + '" data-id="' + s.id + '">'
    + ytArea
    + premiumBadge
    + '<div class="shop-bar' + (s.isPremium ? ' shop-bar-premium' : '') + '">'
      + '<div class="shop-bar-info">'
        + '<div class="shop-bar-cat' + (s.isPremium ? ' shop-bar-cat-premium' : '') + '">'
          + (s.isPremium ? '\u2726 ' : '') + (s.category||'') + '</div>'
        + '<div class="shop-bar-name">' + (s.name||'') + '</div>'
        + '<div class="shop-bar-loc"><i class="fas fa-map-marker-alt"></i><span>'
          + (s.address || s.district || '') + (s.price ? ' \xB7 ' + s.price : '') + '</span></div>'
        + (s.desc ? '<div class="shop-bar-desc">' + s.desc + '</div>' : '')
      + '</div>'
      + bookBtn
    + '</div>'
  + '</div>';
}

async function loadFeed(cat='all', q='') {
  feedCat = cat;
  const scr = document.getElementById('feedScreen');

  // \uC2A4\uCF08\uB808\uD1A4 \uCE74\uB4DC 3\uC7A5
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
      + (cat==='recommended' ? '\uCD94\uCC9C \uC5C5\uCCB4\uAC00 \uC5C6\uC5B4\uC694' : q ? '"'+q+'" \uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694' : '\uB4F1\uB85D\uB41C \uC0F5\uC774 \uC5C6\uC5B4\uC694') + '</p></div>';
    return;
  }

  // \u2500\u2500 \uD504\uB9AC\uBBF8\uC5C4 \uC5C5\uCCB4 5\uC7A5\uB9C8\uB2E4 \uC7AC\uC0BD\uC785 \u2500\u2500
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

  // \uCE74\uB4DC \uB80C\uB354
  scr.innerHTML = merged.map(feedCardHTML).join('');
  scr.scrollTop = 0;

  // \uCE74\uB4DC \uC2A4\uD06C\uB864 \uC815\uC9C0 \uAC10\uC9C0 Observer \uC5F0\uACB0
  initFeedStopObserver();
}

// \u2500\u2500 \uC2A4\uD06C\uB864 \uAE30\uBC18\uC73C\uB85C \uD604\uC7AC \uCE74\uB4DC \uAC10\uC9C0 \u2192 \uC7AC\uC0DD/\uC815\uC9C0 \u2500\u2500
let _feedCurrentCard = null;
let _feedScrollTimer = null;

function feedActivateCard(ytDiv) {
  if (_feedCurrentCard === ytDiv) return;
  // \uC774\uC804 \uCE74\uB4DC \uC815\uC9C0: src\uB97C about:blank\uB85C
  if (_feedCurrentCard) {
    const prev = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (prev && !prev.dataset.paused) {
      prev.dataset.paused = '1';
      prev.src = 'about:blank';
    }
  }
  _feedCurrentCard = ytDiv;
  // \uD53C\uB4DC \uD0ED\uC774 \uC544\uB2C8\uBA74 \uC7AC\uC0DD\uD558\uC9C0 \uC54A\uC74C (\uB9B4\uC2A4 \uB4F1 \uB2E4\uB978 \uD0ED\uC5D0\uC11C \uD638\uCD9C \uBC29\uC9C0)
  if (!document.getElementById('feedScreen').classList.contains('active')) return;
  // \uD604\uC7AC \uCE74\uB4DC \uC7AC\uC0DD
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
  // \uD654\uBA74 \uC911\uC559\uC5D0 \uAC00\uC7A5 \uB9CE\uC774 \uACA9\uCE58\uB294 .yt-area \uCC3E\uAE30
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

  // \uC2A4\uD06C\uB864 \uB9AC\uC2A4\uB108 \uC911\uBCF5 \uBC29\uC9C0
  if (scr._feedScrollHandler) scr.removeEventListener('scroll', scr._feedScrollHandler);
  scr._feedScrollHandler = () => {
    clearTimeout(_feedScrollTimer);
    _feedScrollTimer = setTimeout(() => {
      const cur = feedFindCurrentCard(scr);
      if (cur) feedActivateCard(cur);
    }, 150);
  };
  scr.addEventListener('scroll', scr._feedScrollHandler, { passive: true });

  // \uCCAB \uBC88\uC9F8 \uCE74\uB4DC\uB294 \uD53C\uB4DC \uD0ED \uD65C\uC131 \uC2DC\uC5D0\uB9CC \uC7AC\uC0DD (switchTab('feed') \uC5D0\uC11C \uCC98\uB9AC)
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach((b)=>b.classList.remove('active'));
  btn.classList.add('active');
  loadFeed(cat, searchQ);
}

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \uAC80\uC0C9
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  if (searchOpen) _sessionTrackSearch(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uAC80\uC0C9 \uC5F4\uAE30
  const bar  = document.getElementById('searchBar');
  const icon = document.getElementById('searchBtnIcon');
  const catBar = document.getElementById('catBar');
  const sCatBar = document.getElementById('shortsCatBar');
  bar.classList.toggle('open', searchOpen);
  icon.className = searchOpen ? 'fas fa-times' : 'fas fa-search';
  // \uAC80\uC0C9\uBC14 \uB192\uC774(62px)\uB9CC\uD07C catBar \uC544\uB798\uB85C
  document.documentElement.style.setProperty('--sb', searchOpen ? '62px' : '0px');
  // \uB9B4\uC2A4 \uD0ED \uCE74\uD0C8\uB85C\uADF8\uBC14: \uAC80\uC0C9 \uC5F4\uB9B4 \uB54C \uC228\uAE30\uACE0, \uB2EB\uD790 \uB54C \uBCF5\uC6D0
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
      // \uC20F\uD3FC \uD0ED\uC740 \uAC80\uC0C9 \uBBF8\uC9C0\uC6D0 (\uC5C5\uCCB4 \uC804\uCCB4 \uD53C\uB4DC)
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
    // \uC20F\uD3FC\uC740 \uAC80\uC0C9 \uBBF8\uC9C0\uC6D0
  } else {
    loadFeed(feedCat, '');
  }
}

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \uB124\uC774\uBC84 \uC9C0\uB3C4
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
function waitNaverMap(cb, tries=0) {
  if (window.naver && window.naver.maps) { cb(); return; }
  if (tries > 40) { showToast('\uC9C0\uB3C4 \uB85C\uB4DC \uC2E4\uD328. \uC0C8\uB85C\uACE0\uCE68 \uD574\uC8FC\uC138\uC694'); return; }
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
  // display:none \uC6B0\uD68C: naverMap \uD06C\uAE30\uB97C window \uAE30\uC900\uC73C\uB85C \uAC15\uC81C \uC9C0\uC815
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

// \uCE74\uD14C\uACE0\uB9AC\uBCC4 \uBC30\uACBD\uC0C9 (\uC778\uB77C\uC778 \uC2A4\uD0C0\uC77C\uC6A9)
const CAT_COLOR = {
  '\uB9C8\uC0AC\uC9C0':'#10B981', '\uD5E4\uB4DC\uC2A4\uD30C':'#6366F1',
  '\uD53C\uBD80\uAD00\uB9AC':'#FF4D7D', '\uD5E4\uC5B4':'#F59E0B', '\uBA54\uC774\uD06C\uC5C5':'#C084FC',
  '\uC641\uC2F1':'#EC4899', '\uBC18\uC601\uAD6C':'#06B6D4', '\uBCD1\uC6D0':'#3B82F6', '\uADF8\uC678':'#8B5CF6',
};
function pinColor(cat) { return CAT_COLOR[cat] || '#FF4D7D'; }

// DOM \uC5D8\uB9AC\uBA3C\uD2B8 \uBC29\uC2DD\uC73C\uB85C \uB9C8\uCEE4 \uC0DD\uC131 (\uC378\uB124\uC77C \uCE74\uB4DC\uD615)
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

  // \uC378\uB124\uC77C: \uC720\uD29C\uBE0C \uC6B0\uC120 \u2192 \uB4F1\uB85D \uC378\uB124\uC77C \u2192 \uCE74\uD14C\uACE0\uB9AC \uC0C9 \uBC30\uACBD
  const thumbUrl = shop.youtubeId
    ? 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg'
    : shop.thumbnail || '';

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'display:flex;flex-direction:column;align-items:center;',
    'cursor:pointer;',
    'transform:' + scale + ';transition:transform .2s;',
  ].join('');

  // \uD504\uB9AC\uBBF8\uC5C4 \uAE00\uB85C\uC6B0 \uB9C1 (\uC560\uB2C8\uBA54\uC774\uC158)
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

  // \uCE74\uB4DC \uBCF8\uCCB4
  const card = document.createElement('div');
  card.style.cssText = [
    'border-radius:10px;overflow:hidden;',
    'box-shadow:' + shadow + ';',
    'border:' + border + ';',
    'width:' + cardWidth + ';',
    'background:' + (isPrem ? '#1a1500' : '#111') + ';',
    'position:relative;',
  ].join('');

  // \uD504\uB9AC\uBBF8\uC5C4 \uBC43\uC9C0 (\uCE74\uB4DC \uC704)
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
    badge.textContent = '\u2726 PREMIUM';
    card.appendChild(badge);
  }

  // \uC378\uB124\uC77C \uC601\uC5ED
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
    imgWrap.innerHTML = '<span style="font-size:' + (isPrem ? '26px' : '22px') + '">\u{1F484}</span>';
  }

  // \uC720\uD29C\uBE0C \uC544\uC774\uCF58 \uBC43\uC9C0
  if (shop.youtubeId) {
    const ytBadge = document.createElement('div');
    ytBadge.style.cssText = [
      'position:absolute;bottom:3px;right:3px;',
      'background:rgba(255,0,0,.85);border-radius:3px;',
      'padding:1px 4px;font-size:9px;color:#fff;font-weight:700;',
    ].join('');
    ytBadge.textContent = '\u25B6';
    imgWrap.appendChild(ytBadge);
  }

  // \uC5C5\uCCB4\uBA85 \uB77C\uBCA8
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

  // \uB9D0\uD48D\uC120 \uAF2C\uB9AC
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
  // \uC9C0\uB3C4 \uB80C\uB354 \uC644\uB8CC \uD6C4 fitBounds (\uD0C0\uC774\uBC0D \uB109\uB109\uD788)
  setTimeout(() => fitMapToBounds(shops), 100);
  setTimeout(() => fitMapToBounds(shops), 600);
}

function selectShopOnMap(id) {
  _sessionTrackMapPin(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uC9C0\uB3C4 \uB9C8\uCEE4 \uD074\uB9AD
  const shop = allShops.find(s=>s.id===id);
  if (!shop) return;
  _sessionEvent('map_pin', shop);     // \u{1F441}\uFE0F \uC5C5\uCCB4 \uC774\uBCA4\uD2B8
  curShop = shop;

  // \uB9C8\uCEE4 \uC120\uD0DD \uC0C1\uD0DC \uAC31\uC2E0
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (!s) return;
    overlay.setContent(buildMarkerEl(s, +sid===id));
    overlay.setZIndex(+sid===id ? 200 : (s.isPremium ? 150 : s.featured ? 100 : 10));
  });

  // \uC9C0\uB3C4 \uC911\uC2EC \uC774\uB3D9 (\uD31D\uC5C5 \uB192\uC774\uB9CC\uD07C \uC704\uB85C offset)
  naverMap.panTo(new naver.maps.LatLng(shop.lat, shop.lng));



  // \u2500\u2500 \uC9C0\uB3C4 \uC704 \uD31D\uC5C5 \uCE74\uB4DC \uC5F4\uAE30 \u2500\u2500
  openMapPopup(shop);
}

// \u2500\u2500 \uC9C0\uB3C4 \uC704 \uD31D\uC5C5 \uCE74\uB4DC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let popupYtLoaded = false;

function openMapPopup(shop) {
  const popup = document.getElementById('mapPopup');
  const ytEl  = document.getElementById('mpYt');

  // \uC720\uD29C\uBE0C or \uC378\uB124\uC77C
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

  // \uD14D\uC2A4\uD2B8 \uC815\uBCF4
  const bg = pinColor(shop.category);
  document.getElementById('mpBadge').innerHTML =
    \`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:\${bg};margin-right:4px"></span>\${shop.category}\`;
  document.getElementById('mpName').textContent  = shop.name;
  document.getElementById('mpMeta').innerHTML    =
    \`<i class="fas fa-map-marker-alt" style="color:var(--green)"></i>\${shop.district}&nbsp;\xB7&nbsp;\${shop.price}\`;
  document.getElementById('mpDesc').textContent  = shop.desc || '';
  document.getElementById('mpTags').innerHTML    =
    shop.tags.map(t=>\`<span class="mp-tag">\${t}</span>\`).join('');

  // \uD504\uB9AC\uBBF8\uC5C4 \uBC43\uC9C0
  const mpPremEl = document.getElementById('mpPremiumBadge');
  if (mpPremEl) {
    mpPremEl.style.display = shop.isPremium ? 'inline-flex' : 'none';
  }
  // \uD504\uB9AC\uBBF8\uC5C4 \uD31D\uC5C5 \uD14C\uB450\uB9AC \uAC15\uC870
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
  // \uD504\uB9AC\uBBF8\uC5C4 \uC608\uC57D \uBC84\uD2BC \uC2A4\uD0C0\uC77C
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
  // \uC9C0\uB3C4 \uD31D\uC5C5 \uC378\uB124\uC77C \uD074\uB9AD \u2192 \uC601\uC0C1\uC870\uD68C \uCE74\uC6B4\uD305 (\uC138\uC158 \uB0B4 1\uD68C, \uCD9C\uCC98: map)
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
  // \uC720\uD29C\uBE0C \uBA48\uCD94\uAE30
  document.getElementById('mpYt').innerHTML = '';
  // \uB9C8\uCEE4 \uC120\uD0DD \uD574\uC81C
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
    fab.innerHTML='<i class="fas fa-location-arrow"></i> \uB0B4 \uC8FC\uBCC0';
    if (userMarker) { userMarker.setMap(null); userMarker=null; }
    loadMapShops(mapCat, false);
    return;
  }
  if (!navigator.geolocation) { showToast('\uC704\uCE58 \uC11C\uBE44\uC2A4\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544\uC694'); return; }
  showToast('\u{1F4CD} \uC704\uCE58 \uD655\uC778 \uC911...');
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude; userLng=pos.coords.longitude;
    nearbyOn=true;
    fab.classList.add('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> \uB0B4 \uC8FC\uBCC0 ON';
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
    showToast('\u{1F4CD} \uB0B4 \uC8FC\uBCC0 \uC0F5\uC744 \uCC3E\uC558\uC5B4\uC694!');
  }, ()=>{ showToast('\uC704\uCE58 \uAD8C\uD55C\uC774 \uD544\uC694\uD574\uC694'); }, {timeout:8000,enableHighAccuracy:true});
}

// \u2500\u2500 \uD53C\uB4DC \uBC14\uD140\uC2DC\uD2B8 (\uD53C\uB4DC \uD0ED \uC804\uC6A9) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
// \u2500\u2500 \uB9C8\uC9C0\uB9C9 \uC601\uC0C1 \uC7AC\uC0DD \uCD9C\uCC98 \uAE30\uC5B5 (\uC608\uC57D\uD074\uB9AD \uC804\uD658\uC728 \uBD84\uC11D\uC6A9) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// trackView() \uD638\uCD9C \uC2DC \uAC31\uC2E0 \u2192 \uC608\uC57D\uD074\uB9AD \uC2DC \uCC38\uC870
let lastViewSrc = null; // 'feed' | 'catalog' | 'map' | null

// \uD53C\uB4DC \uC608\uC57D \uD2B8\uB798\uD0B9 (\uC601\uC0C1 \uC2DC\uCCAD \uCD9C\uCC98 \uD3EC\uD568)
function trackSP() {
  if (!curShop) return;
  fetch('/api/track/sp/' + curShop.id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// \uC9C0\uB3C4 \uC608\uC57D \uD2B8\uB798\uD0B9 (\uC601\uC0C1 \uC2DC\uCCAD \uCD9C\uCC98 \uD3EC\uD568)
function trackMapSP(id) {
  fetch('/api/track/mapsp/' + id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// \uC9C0\uB3C4 \uD31D\uC5C5 \uC608\uC57D\uBC84\uD2BC \uC804\uC6A9 (\uC778\uB77C\uC778 onclick \uB300\uCCB4)
function trackMapSPWithSrc(id) {
  _sessionTrackMapBook(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uC9C0\uB3C4 \uC608\uC57D\uD074\uB9AD
  _sessionEvent('map_book', curShop); // \u{1F441}\uFE0F \uC5C5\uCCB4 \uC774\uBCA4\uD2B8
  trackMapSP(id);
}

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \uC608\uC57D \uBAA8\uB2EC (m.place.naver.com iframe)
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let _rsvOrigUrl = '';
function openInapp() {
  if (!curShop || !curShop.smartPlaceUrl) { showToast('\uC608\uC57D \uB9C1\uD06C\uAC00 \uC5C6\uC5B4\uC694'); return; }
  trackSP();
  _rsvOrigUrl = curShop.smartPlaceUrl;
  const name = curShop.name || '';
  document.getElementById('rsvTitle').textContent = name + ' \uC608\uC57D\uD558\uAE30';
  // \uC678\uBD80\uC5F4\uAE30 \uBC84\uD2BC \u2192 \uC6D0\uBCF8 naver.me URL \uC720\uC9C0
  document.getElementById('rsvExtBtn').onclick = () =>
    window.open(_rsvOrigUrl, '_blank', 'noopener,noreferrer');
  // \uBAA8\uB2EC \uBA3C\uC800 \uC5F4\uACE0
  const frame   = document.getElementById('rsvFrame');
  const loading = document.getElementById('rsvLoading');
  frame.src = '';
  loading.classList.remove('hide');
  document.getElementById('rsvDim').classList.add('show');
  document.getElementById('rsvModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  // \uC11C\uBC84\uC5D0\uC11C naver.me \u2192 m.place.naver.com \uBCC0\uD658
  fetch('/api/resolve-naver?url=' + encodeURIComponent(_rsvOrigUrl))
    .then(r => r.json())
    .then(d => {
      frame.src = d.resolved;
      frame.onload = () => loading.classList.add('hide');
    })
    .catch(() => {
      // \uC2E4\uD328 \uC2DC \uC6D0\uBCF8 URL \uC9C1\uC811 \uC0AC\uC6A9
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
// \uC2A4\uC640\uC774\uD504 \uB2E4\uC6B4\uC73C\uB85C \uB2EB\uAE30 (topbar \uC601\uC5ED\uB9CC)
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

// \u2500\u2500 \uC9C0\uB3C4 iframe \u2192 \uBA54\uC778 \uD398\uC774\uC9C0 \uC608\uC57D \uBAA8\uB2EC \uD2B8\uB9AC\uAC70 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.addEventListener('message', e => {
  if (e.data?.type === 'openInapp' && e.data.shop) {
    curShop = e.data.shop;
    openInapp();
  }
});

// \uC2A4\uC640\uC774\uD504 \uB2E4\uC6B4\uC73C\uB85C \uD53C\uB4DC \uC2DC\uD2B8 \uB2EB\uAE30
let tsY=0;
const sh=document.getElementById('sheet');
sh.addEventListener('touchstart',e=>{tsY=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchend',  e=>{if(e.changedTouches[0].clientY-tsY>70)closeFeedSheet()},{passive:true});

// \u2500\u2500 \uD1A0\uC2A4\uD2B8 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
    showToast('\u26A0\uFE0F \uD544\uC218 \uD56D\uBAA9\uC744 \uBAA8\uB450 \uC785\uB825\uD574 \uC8FC\uC138\uC694');
    return;
  }
  if (!agreed) {
    showToast('\u26A0\uFE0F \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD574 \uC8FC\uC138\uC694');
    return;
  }
  const url = document.getElementById('iq-url').value.trim();
  const msg = document.getElementById('iq-msg').value.trim();
  _sessionTrackInquiry(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uBB38\uC758 \uC81C\uCD9C
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
    showToast('\u274C \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694');
  });
}

// \uC571 \uC9C4\uC785 \uC2DC \uBC29\uBB38\uC790 \uCE74\uC6B4\uD305 (\uC0C8\uB85C\uACE0\uCE68\xB7\uCD5C\uCD08\uC9C4\uC785 \uBAA8\uB450 \uD3EC\uD568)
fetch('/api/track/visit', { method: 'POST' }).catch(() => {});

loadFeed('all');
</script>
</body>
</html>`;
}
function shopDetailPage(shop, baseUrl) {
  const title = seoTitle(shop);
  const desc = seoDesc(shop);
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const loc = region || city;
  const type = schemaType(shop.category);
  const ogImg = shop.thumbnail || `${baseUrl}/og-image.jpg`;
  const pageUrl = `${baseUrl}/shop/${shop.id}`;
  const tags = Array.isArray(shop.tags) ? shop.tags : [];
  const catEmoji = { \uB9C8\uC0AC\uC9C0: "\u{1F486}", \uD5E4\uB4DC\uC2A4\uD30C: "\u{1F9D6}", \uD53C\uBD80\uAD00\uB9AC: "\u2728", \uD5E4\uC5B4: "\u{1F487}", \uBA54\uC774\uD06C\uC5C5: "\u{1F484}", \uC641\uC2F1: "\u{1F338}", \uBC18\uC601\uAD6C: "\u{1F441}", \uBCD1\uC6D0: "\u{1F3E5}", \uADF8\uC678: "\u{1F31F}" };
  const emoji = catEmoji[shop.category] || "\u{1F31F}";
  const schemaObj = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageUrl,
    name: shop.name,
    description: desc,
    url: pageUrl,
    telephone: shop.phone || void 0,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: loc,
      addressRegion: city,
      addressCountry: "KR"
    },
    geo: shop.lat && shop.lng ? {
      "@type": "GeoCoordinates",
      latitude: shop.lat,
      longitude: shop.lng
    } : void 0,
    image: shop.thumbnail ? {
      "@type": "ImageObject",
      url: shop.thumbnail,
      width: 800,
      height: 600
    } : void 0,
    priceRange: shop.price || void 0,
    hasMap: shop.smartPlaceUrl || void 0,
    sameAs: shop.smartPlaceUrl ? [shop.smartPlaceUrl] : void 0,
    // 네이버 지도 연동 강화
    ...shop.category === "\uB9C8\uC0AC\uC9C0" && { serviceType: "\uB9C8\uC0AC\uC9C0\xB7\uC2A4\uD30C" },
    ...shop.category === "\uD5E4\uB4DC\uC2A4\uD30C" && { serviceType: "\uD5E4\uB4DC\uC2A4\uD30C\xB7\uB450\uD53C\uCF00\uC5B4" },
    ...shop.category === "\uD53C\uBD80\uAD00\uB9AC" && { serviceType: "\uD53C\uBD80\uAD00\uB9AC\xB7\uC5D0\uC2A4\uD14C\uD2F1" },
    ...shop.category === "\uD5E4\uC5B4" && { serviceType: "\uD5E4\uC5B4\uC0B4\uB871\xB7\uBBF8\uC6A9\uC2E4" }
  };
  const schema = JSON.stringify(schemaObj);
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "\uB9C8\uC774\uBDF0\uD2F0\uB9F5", item: baseUrl },
      { "@type": "ListItem", position: 2, name: `${loc} ${shop.category}`, item: `${baseUrl}/c/${encodeURIComponent(shop.category)}/${encodeURIComponent(loc)}` },
      { "@type": "ListItem", position: 3, name: shop.name, item: pageUrl }
    ]
  });
  const kws = [
    shop.name,
    `${loc} ${shop.category}`,
    `${loc} ${shop.category} \uCD94\uCC9C`,
    `${loc} ${shop.category} \uC798\uD558\uB294 \uACF3`,
    `${loc} ${shop.category} \uC608\uC57D`,
    `${loc} ${shop.category} \uAC00\uACA9`,
    `${loc} ${shop.category} \uD6C4\uAE30`,
    `${city} ${shop.category}`,
    `${shop.name} \uC608\uC57D`,
    `${shop.name} \uC704\uCE58`,
    ...tags.map((t) => `${loc} ${t}`)
  ].filter(Boolean).join(",");
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${kws}"/>
<link rel="canonical" href="${pageUrl}"/>
<meta property="og:type"        content="business.business"/>
<meta property="og:site_name"   content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>
<meta property="og:title"       content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image"       content="${ogImg}"/>
<meta property="og:url"         content="${pageUrl}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image"       content="${ogImg}"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${schema}</script>
<script type="application/ld+json">${breadcrumb}</script>
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
/* SEO\uC6A9 \uC228\uAE34 \uD14D\uC2A4\uD2B8 (\uD06C\uB864\uB7EC \uAC00\uB3C5\uC131\u2191) */
.seo-text{font-size:13px;color:rgba(255,255,255,.45);line-height:1.8;padding:20px 16px 0}
.seo-text h2{font-size:15px;font-weight:700;margin-bottom:8px;color:rgba(255,255,255,.6)}
/* \uC608\uC57D \uBC84\uD2BC */
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
    <span class="site-nm">\uB9C8\uC774\uBDF0\uD2F0\uB9F5</span>
  </div>

  ${shop.thumbnail ? `<img class="thumb" src="${shop.thumbnail}" alt="${shop.name} ${loc} ${shop.category} \uB300\uD45C\uC0AC\uC9C4" loading="eager"/>` : `<div class="thumb-ph">${emoji}</div>`}

  <div class="info">
    <div class="badge">${emoji} ${shop.category}</div>
    <h1>${shop.name}</h1>
    <p class="addr">\u{1F4CD} <span>${shop.address}</span></p>
    ${shop.phone ? `<p class="addr">\u{1F4DE} <a href="tel:${shop.phone}" style="color:inherit;text-decoration:none">${shop.phone}</a></p>` : ""}
    ${shop.desc ? `<p class="shop-desc">${shop.desc}</p>` : ""}
    ${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">#${t}</span>`).join("")}</div>` : ""}
  </div>

  ${shop.price ? `<div class="price-box"><div class="price-lbl">\u{1F4B0} \uAC00\uACA9 \uC548\uB0B4</div><div class="price-val">${shop.price}</div></div>` : ""}

  ${shop.smartPlaceUrl ? `<a class="map-btn" href="${shop.smartPlaceUrl}" target="_blank" rel="noopener">\u{1F5FA}\uFE0F \uB124\uC774\uBC84 \uC9C0\uB3C4\uC5D0\uC11C \uBCF4\uAE30</a>` : ""}

  <!-- SEO \uD14D\uC2A4\uD2B8 \uC601\uC5ED \u2013 \uD06C\uB864\uB7EC \uD0A4\uC6CC\uB4DC \uBCF4\uAC15 -->
  <div class="seo-text">
    <h2>${loc} ${shop.category} \uCD94\uCC9C \u2013 ${shop.name}</h2>
    <p>${shop.name}\uC740(\uB294) ${shop.address}\uC5D0 \uC704\uCE58\uD55C ${loc} ${shop.category} \uC804\uBB38\uC0F5\uC785\uB2C8\uB2E4.
    ${tags.length ? tags.join(", ") + " \uB4F1 \uB2E4\uC591\uD55C \uC2DC\uC220\uC744 \uC81C\uACF5\uD558\uBA70," : ""}
    ${shop.price ? "\uAC00\uACA9\uC740 " + shop.price + "\uC785\uB2C8\uB2E4." : ""}
    ${loc} ${shop.category} \uC608\uC57D\uC740 \uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0\uC11C \uBC14\uB85C \uD655\uC778\uD558\uC138\uC694.</p>
  </div>

  <div class="related" id="relShops"></div>
</div>

<div class="rsv-bar">
  <div class="rsv-inner">
    ${shop.smartPlaceUrl ? `<button class="btn-rsv" onclick="window.open('${shop.smartPlaceUrl}','_blank','noopener')">\u{1F4C5} \uB124\uC774\uBC84\uB85C \uC608\uC57D\uD558\uAE30</button>` : `<button class="btn-rsv" onclick="location.href='/'">\u{1F4C5} \uB2E4\uB978 \uC0F5 \uC608\uC57D\uD558\uAE30</button>`}
    <a class="btn-home" href="/">\uD648</a>
  </div>
</div>

<script>
(async()=>{
  try{
    const r=await fetch('/api/shops?category=${encodeURIComponent(shop.category)}');
    const list=await r.json();
    const others=list.filter(s=>s.id!==${shop.id}).slice(0,4);
    if(!others.length)return;
    const el=document.getElementById('relShops');
    el.innerHTML='<div class="rel-hd">\u{1F4CD} ${loc} \uADFC\uCC98 ${shop.category} \uC0F5</div>'
      +'<div class="rel-grid">'+others.map(s=>{
        const a=(s.address||'').split(' ').slice(1,3).join(' ');
        return '<a class="rel-card" href="/shop/'+s.id+'">'
          +'<div class="rel-cat">'+s.category+'</div>'
          +'<div class="rel-nm">'+s.name+'</div>'
          +'<div class="rel-addr">\u{1F4CD} '+a+'</div>'
          +'</a>';
      }).join('')+'</div>';
  }catch(e){}
})();
</script>
</body>
</html>`;
}
function categoryLandingPage(category, region, shops, baseUrl) {
  const title = catSeoTitle(category, region);
  const desc = catSeoDesc(category, region, shops.length);
  const kws = catSeoKeywords(category, region);
  const pageUrl = `${baseUrl}/c/${encodeURIComponent(category)}/${encodeURIComponent(region)}`;
  const catEmoji = { \uB9C8\uC0AC\uC9C0: "\u{1F486}", \uD5E4\uB4DC\uC2A4\uD30C: "\u{1F9D6}", \uD53C\uBD80\uAD00\uB9AC: "\u2728", \uD5E4\uC5B4: "\u{1F487}", \uBA54\uC774\uD06C\uC5C5: "\u{1F484}", \uC641\uC2F1: "\u{1F338}", \uBC18\uC601\uAD6C: "\u{1F441}", \uBCD1\uC6D0: "\u{1F3E5}", \uADF8\uC678: "\u{1F31F}" };
  const emoji = catEmoji[category] || "\u{1F31F}";
  const catList = ["\uB9C8\uC0AC\uC9C0", "\uD5E4\uB4DC\uC2A4\uD30C", "\uD53C\uBD80\uAD00\uB9AC", "\uD5E4\uC5B4", "\uBA54\uC774\uD06C\uC5C5", "\uC641\uC2F1", "\uBC18\uC601\uAD6C", "\uBCD1\uC6D0", "\uADF8\uC678"];
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: desc,
    url: pageUrl,
    numberOfItems: shops.length,
    itemListElement: shops.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${baseUrl}/shop/${s.id}`,
      description: seoDesc(s)
    }))
  });
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "\uB9C8\uC774\uBDF0\uD2F0\uB9F5", item: baseUrl },
      { "@type": "ListItem", position: 2, name: `${region} ${category}`, item: pageUrl }
    ]
  });
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${kws}"/>
<link rel="canonical" href="${pageUrl}"/>
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>
<meta property="og:title"       content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image"       content="${baseUrl}/og-image.jpg"/>
<meta property="og:url"         content="${pageUrl}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image"       content="${baseUrl}/og-image.jpg"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="\uB9C8\uC774\uBDF0\uD2F0\uB9F5"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${schema}</script>
<script type="application/ld+json">${breadcrumb}</script>
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
/* \uD788\uC5B4\uB85C */
.hero{padding:28px 16px 22px;background:linear-gradient(180deg,rgba(255,77,125,.07) 0%,transparent 100%)}
.hero-emoji{font-size:44px;margin-bottom:12px}
h1{font-size:26px;font-weight:800;line-height:1.25;margin-bottom:8px;letter-spacing:-.5px}
.hero-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:12px}
.hero-cnt{display:inline-block;background:rgba(255,77,125,.12);color:#FF4D7D;
  font-size:12px;font-weight:700;padding:4px 13px;border-radius:20px}
/* \uBE75\uBD80\uC2A4\uB7EC\uAE30 */
.bread{padding:12px 16px;font-size:12px;color:rgba(255,255,255,.3);display:flex;align-items:center;gap:6px}
.bread a{color:rgba(255,255,255,.3);text-decoration:none}
.bread a:hover{color:#FF4D7D}
/* \uCE74\uD14C\uACE0\uB9AC \uD0ED */
.cat-tabs{display:flex;gap:6px;padding:10px 16px;overflow-x:auto;scrollbar-width:none;
  border-bottom:1px solid rgba(255,255,255,.06)}
.cat-tabs::-webkit-scrollbar{display:none}
.ctab{flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.1);
  background:transparent;color:rgba(255,255,255,.45);font-size:12px;font-weight:600;
  cursor:pointer;text-decoration:none;white-space:nowrap;transition:all .2s}
.ctab.on{background:#FF4D7D;border-color:#FF4D7D;color:#fff}
/* \uC5C5\uCCB4 \uB9AC\uC2A4\uD2B8 */
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
/* \uBE48 \uC0C1\uD0DC */
.empty{text-align:center;padding:60px 16px;color:rgba(255,255,255,.3)}
.empty-icon{font-size:52px;margin-bottom:14px}
/* SEO \uD14D\uC2A4\uD2B8 */
.seo-text{padding:24px 16px 0;font-size:13px;color:rgba(255,255,255,.38);line-height:1.8}
.seo-text h2{font-size:14px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:6px}
.seo-text p{margin-bottom:10px}
/* \uB2E4\uB978 \uCE74\uD14C\uACE0\uB9AC */
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
    <span class="site-nm">\uB9C8\uC774\uBDF0\uD2F0\uB9F5</span>
  </div>

  <!-- \uBE75\uBD80\uC2A4\uB7EC\uAE30 (SEO) -->
  <nav class="bread" aria-label="breadcrumb">
    <a href="/">\uB9C8\uC774\uBDF0\uD2F0\uB9F5</a> \u203A <span>${region} ${category}</span>
  </nav>

  <!-- \uD788\uC5B4\uB85C -->
  <div class="hero">
    <div class="hero-emoji">${emoji}</div>
    <h1>${region} ${category} \uCD94\uCC9C TOP</h1>
    <p class="hero-sub">
      ${region} \uC778\uADFC ${category} \uC804\uBB38\uC0F5 ${shops.length}\uACF3 \uBAA8\uC74C<br>
      \uAC00\uACA9\xB7\uC704\uCE58\xB7\uC608\uC57D\xB7\uD6C4\uAE30\uAE4C\uC9C0 \uD55C\uB208\uC5D0 \uD655\uC778\uD558\uC138\uC694
    </p>
    <span class="hero-cnt">\uCD1D ${shops.length}\uACF3</span>
  </div>

  <!-- \uCE74\uD14C\uACE0\uB9AC \uD0ED -->
  <div class="cat-tabs">
    ${catList.map((c) => `<a class="ctab${c === category ? " on" : ""}" href="/c/${encodeURIComponent(c)}/${encodeURIComponent(region)}">${catEmoji[c] || "\u{1F31F}"} ${c}</a>`).join("")}
  </div>

  <!-- \uC5C5\uCCB4 \uBAA9\uB85D -->
  <div class="list">
    ${shops.length ? shops.map((s, i) => {
    const tags = Array.isArray(s.tags) ? s.tags : [];
    const addrShort = (s.address || "").split(" ").slice(1, 3).join(" ");
    const rank = i === 0 ? "\u{1F947}" : i === 1 ? "\u{1F948}" : i === 2 ? "\u{1F949}" : `${i + 1}.`;
    return `<a class="card" href="/shop/${s.id}">
        ${s.thumbnail ? `<img class="card-img" src="${s.thumbnail}" alt="${s.name} ${region} ${category}" loading="lazy"/>` : `<div class="card-ph">${emoji}</div>`}
        <div class="card-body">
          <div class="card-cat">${rank} ${s.category}</div>
          <div class="card-nm">${s.name}</div>
          <div class="card-addr">\u{1F4CD} ${addrShort}</div>
          ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="card-tag">#${t}</span>`).join("")}</div>` : ""}
          ${s.price ? `<div class="card-price">\u{1F4B0} ${s.price}</div>` : ""}
        </div>
        <div class="card-arrow">\u203A</div>
      </a>`;
  }).join("") : `
    <div class="empty">
      <div class="empty-icon">${emoji}</div>
      <div>${region} ${category} \uC5C5\uCCB4\uB97C \uC900\uBE44 \uC911\uC774\uC5D0\uC694</div>
      <a href="/" style="color:#FF4D7D;font-size:13px;margin-top:12px;display:inline-block">\uC804\uCCB4 \uBCF4\uAE30 \u2192</a>
    </div>`}
  </div>

  <!-- SEO \uD14D\uC2A4\uD2B8 (\uD06C\uB864\uB7EC \uD0A4\uC6CC\uB4DC \uBCF4\uAC15) -->
  <div class="seo-text">
    <h2>${region} ${category} \uCD94\uCC9C \uAC00\uC774\uB4DC</h2>
    <p>${region} ${category} \uC798\uD558\uB294 \uACF3\uC744 \uCC3E\uACE0 \uACC4\uC2E0\uAC00\uC694? \uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0\uC11C ${region} \uADFC\uCC98 ${category} \uC804\uBB38\uC0F5 ${shops.length}\uACF3\uC744 \uD55C\uB208\uC5D0 \uBE44\uAD50\uD574 \uBCF4\uC138\uC694. \uAC00\uACA9, \uC704\uCE58, \uC608\uC57D, \uD6C4\uAE30\uAE4C\uC9C0 \uBAA8\uB450 \uD655\uC778 \uAC00\uB2A5\uD569\uB2C8\uB2E4.</p>
    <p>${region} ${category} \uC608\uC57D \uBC29\uBC95, \uAC00\uACA9 \uBE44\uAD50, \uC798\uD558\uB294 \uACF3 \uCD94\uCC9C \uC815\uBCF4\uB97C \uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694. ${category} \uC804\uBB38 \uC5C5\uCCB4\uB4E4\uC758 \uC0C1\uC138 \uC815\uBCF4\uC640 \uB124\uC774\uBC84 \uC608\uC57D \uB9C1\uD06C\uB97C \uBC14\uB85C \uC774\uC6A9\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>
  </div>

  <!-- \uB2E4\uB978 \uCE74\uD14C\uACE0\uB9AC -->
  <div class="other">
    <div class="other-hd">\u{1F50D} \uB2E4\uB978 \uCE74\uD14C\uACE0\uB9AC\uB3C4 \uCC3E\uC544\uBCF4\uAE30</div>
    <div class="chips">
      ${catList.filter((c) => c !== category).map(
    (c) => `<a class="chip" href="/c/${encodeURIComponent(c)}/${encodeURIComponent(region)}">${catEmoji[c] || "\u{1F31F}"} ${region} ${c}</a>`
  ).join("")}
    </div>
  </div>
</div>
</body>
</html>`;
}
function mapPage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a;
  font-family:-apple-system,'Pretendard',sans-serif}
#naverMap{width:100%;height:100%;}

/* \u2500\u2500 \uD558\uB2E8 \uCE74\uB4DC (\uBAA8\uBC14\uC77C) \u2500\u2500 */
#card{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:#141414;
  border-radius:22px 22px 0 0;
  box-shadow:0 -4px 40px rgba(0,0,0,.8);
  border-top:1px solid rgba(255,255,255,.08);
  transform:translateY(100%);
  transition:transform .32s cubic-bezier(.22,.68,0,1.2);
  overflow-y:auto;   /* hidden \uC81C\uAC70 \u2192 \uC2A4\uD06C\uB864 \uAC00\uB2A5 */
  max-height:85vh;
}
#card.open{transform:translateY(0)}

/* \u2500\u2500 PC: \uC624\uB978\uCABD \uC0AC\uC774\uB4DC \uD328\uB110 \u2500\u2500 */
@media(min-width:768px){
  #card{
    top:0;bottom:0;right:0;left:auto;
    width:360px;
    border-radius:0;
    border-top:none;
    border-left:1px solid rgba(255,255,255,.08);
    box-shadow:-4px 0 40px rgba(0,0,0,.8);
    /* iframe \uBD80\uBAA8\uAC00 100vh\uBCF4\uB2E4 \uC791\uC744 \uC218 \uC788\uC73C\uBBC0\uB85C 100% \uC0AC\uC6A9 */
    max-height:100%;
    transform:translateX(100%);
    transition:transform .32s cubic-bezier(.22,.68,0,1.2);
    overflow-y:auto;
    /* \uC2A4\uD06C\uB864\uBC14 \uC2A4\uD0C0\uC77C */
    scrollbar-width:thin;
    scrollbar-color:rgba(255,255,255,.15) transparent;
  }
  #card.open{transform:translateX(0)}
  .card-handle{display:none}
  .card-close{top:14px;right:14px}
}

/* PC: 360px \uB108\uBE44 \uACE0\uC815 \u2192 16:9 = 202px \uB192\uC774 \uBA85\uC2DC (overflow-y:auto \uC548\uC5D0\uC11C\uB3C4 \uD655\uC2E4\uD558\uAC8C \uB3D9\uC791) */
@media(min-width:768px){
  .card-media{
    height:202px !important;
    padding-top:0 !important;
    flex-shrink:0;
  }
}
.card-handle{width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.18);margin:10px auto 0;flex-shrink:0}

/* \uBBF8\uB514\uC5B4 \uC601\uC5ED (\uC720\uD29C\uBE0C or \uC378\uB124\uC77C) */
.card-media{
  position:relative;
  width:100%;
  aspect-ratio:16/9;   /* \uBAA8\uBC14\uC77C: aspect-ratio \uC815\uC0C1 \uB3D9\uC791 */
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
/* \uC378\uB124\uC77C \uC704 \uD50C\uB808\uC774 \uBC84\uD2BC */
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
/* \uCE74\uB4DC \uC0C1\uB2E8 \uBC43\uC9C0 \uC624\uBC84\uB808\uC774 */
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

/* \uCE74\uB4DC \uBC14\uB514 */
.card-body{padding:14px 16px 28px}
.card-name{
  font-size:18px;font-weight:800;color:#fff;
  margin-bottom:8px;letter-spacing:-.4px;
}
/* \uC704\uCE58 + \uAC00\uACA9 \uD55C \uC904 */
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
/* \uC124\uBA85 */
.card-desc{
  font-size:13px;color:rgba(255,255,255,.55);
  line-height:1.55;margin-bottom:12px;
}
/* \uD0DC\uADF8 */
.card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.card-tag{
  font-size:11px;color:rgba(255,255,255,.45);
  background:rgba(255,255,255,.06);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,255,255,.09);
}
/* \uC608\uC57D \uBC84\uD2BC */
.btn-reserve{
  width:100%;height:46px;border-radius:14px;border:none;
  background:#03C75A;color:#fff;
  font-size:14px;font-weight:800;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-family:inherit;letter-spacing:-.2px;transition:opacity .15s;
}
.btn-reserve:hover{opacity:.88}

/* \u2500\u2500 \uC9C0\uB3C4 \uC778\uC571 \uBE0C\uB77C\uC6B0\uC800 \uC2DC\uD2B8 \u2500\u2500 */
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

<!-- \uD558\uB2E8 \uCE74\uB4DC -->
<div id="card">
  <div class="card-handle"></div>
  <!-- \uBBF8\uB514\uC5B4 -->
  <div class="card-media" id="cardMedia">
    <!-- \uC378\uB124\uC77C+\uD50C\uB808\uC774\uBC84\uD2BC \uB798\uD37C: \uC804\uCCB4 \uD074\uB9AD \uC2DC \uC7AC\uC0DD -->
    <div id="thumbWrap" style="position:absolute;inset:0;cursor:pointer" onclick="playVideo()">
      <img id="cardThumb" src="about:blank" alt="" style="width:100%;height:100%;object-fit:cover;display:block">
      <div class="play-btn" id="playBtn" style="display:none">
        <div class="play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <!-- \uC2E4\uC81C \uC720\uD29C\uBE0C iframe (\uD074\uB9AD \uD6C4 \uB85C\uB4DC) -->
    <iframe id="cardIframe" src="about:blank" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen style="display:none;position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>
    <!-- \uC624\uBC84\uB808\uC774 \uBC43\uC9C0 -->
    <div class="card-overlay">
      <span id="cardCatBadge" class="card-cat-badge"></span>
      <span id="cardFeatBadge" class="card-feat-badge" style="display:none">\u2B50 PICK</span>
    </div>
    <button class="card-close" onclick="closeCard()">\u2715</button>
  </div>
  <!-- \uBC14\uB514 -->
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
      \uB124\uC774\uBC84 \uC608\uC57D\uD558\uAE30
    </button>
  </div>
</div>

<!-- \uC778\uC571 \uBE0C\uB77C\uC6B0\uC800 \uC2DC\uD2B8 (\uC608\uC57D\uD558\uAE30) -->

<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=xjjg4490h8"></script>
<script>
const CAT_COLOR = {
  '\uB9C8\uC0AC\uC9C0':'#10B981','\uD5E4\uB4DC\uC2A4\uD30C':'#6366F1','\uD53C\uBD80\uAD00\uB9AC':'#FF4D7D',
  '\uD5E4\uC5B4':'#F59E0B','\uBA54\uC774\uD06C\uC5C5':'#C084FC','\uC641\uC2F1':'#EC4899','\uBC18\uC601\uAD6C':'#06B6D4','\uBCD1\uC6D0':'#3B82F6','\uADF8\uC678':'#8B5CF6'
};

let map = null, markers = [], curCat = 'all', curShop = null;

window.addEventListener('message', e => {
  if (e.data?.type === 'filterCat') { curCat = e.data.cat; renderMarkers(); }
  if (e.data?.type === 'fitBounds') {
    // \uC9C0\uB3C4 \uD06C\uAE30 \uC7AC\uACC4\uC0B0 \uD6C4 fitBounds \uC7AC\uC2E4\uD589
    if (map) {
      map.autoResize();
      setTimeout(() => fitToBounds(curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat)), 200);
    }
  }
});

/* \u2500\u2500 \uCE74\uB4DC \uB2EB\uAE30 \u2500\u2500 */
function closeCard() {
  document.getElementById('card').classList.remove('open');
  // iframe \uC815\uC9C0 (src='' \uD558\uBA74 \uBE0C\uB77C\uC6B0\uC800\uAC00 \uD604\uC7ACURL\uB85C \uBCC0\uD658 \u2192 about:blank \uC0AC\uC6A9)
  document.getElementById('cardIframe').src = 'about:blank';
  document.getElementById('cardIframe').style.display = 'none';
  document.getElementById('thumbWrap').style.display = 'block';
  document.getElementById('playBtn').style.display = 'none';
  curShop = null;
}

/* \u2500\u2500 \uC720\uD29C\uBE0C \uC7AC\uC0DD \u2500\u2500 */
function playVideo() {
  // \uC720\uD29C\uBE0C \uC5C6\uC73C\uBA74 \uC544\uBB34\uAC83\uB3C4 \uC548 \uD568
  if (!curShop?.youtubeId) return;
  // \uC9C0\uB3C4 \uD558\uB2E8 \uCE74\uB4DC \uC378\uB124\uC77C \uD074\uB9AD \u2192 \uC601\uC0C1\uC870\uD68C \uCE74\uC6B4\uD305 (\uC138\uC158 \uB0B4 1\uD68C, \uCD9C\uCC98: map)
  trackView(curShop.id, 'map');
  const iframe = document.getElementById('cardIframe');
  // \uC378\uB124\uC77C \uC9C1\uC811 \uD074\uB9AD \u2192 mute \uC5C6\uC774 \uC7AC\uC0DD (\uAD11\uACE0 \uC218\uC775 \uD65C\uC131\uD654)
  iframe.src = \`https://www.youtube.com/embed/\${curShop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
  iframe.style.display = 'block';
  document.getElementById('thumbWrap').style.display = 'none';
}

/* \u2500\u2500 \uC608\uC57D \uBC84\uD2BC \u2500\u2500 */
// /reserve iframe \u2192 \uBA54\uC778 \uD398\uC774\uC9C0\uB85C postMessage \u2192 openInapp() \uC2E4\uD589
function openReserve() {
  if (!curShop?.smartPlaceUrl) return;
  _sessionTrackMapBook(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uC9C0\uB3C4 \uD31D\uC5C5 \uC608\uC57D\uD074\uB9AD
  _sessionEvent('map_book', curShop);  // \u{1F441}\uFE0F \uC5C5\uCCB4 \uC774\uBCA4\uD2B8
  // viewSrc\uB294 \uC9C0\uB3C4 iframe \uB0B4\uBD80\uC774\uBBC0\uB85C \uD56D\uC0C1 'map'
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

/* \u2500\u2500 \uCE74\uB4DC \uC5F4\uAE30 \u2500\u2500 */
function openCard(shop) {
  _sessionTrackFeedCard(); // \u{1F441}\uFE0F \uC138\uC158 \uCD94\uC801 - \uD53C\uB4DC \uC5C5\uCCB4\uCE74\uB4DC \uD074\uB9AD
  _sessionEvent('feed_card', shop);   // \u{1F441}\uFE0F \uC5C5\uCCB4 \uC774\uBCA4\uD2B8
  curShop = shop;
  const color = CAT_COLOR[shop.category] || '#FF4D7D';

  const iframe   = document.getElementById('cardIframe');
  const thumbWrap = document.getElementById('thumbWrap');
  const thumb    = document.getElementById('cardThumb');
  const playBtn  = document.getElementById('playBtn');

  // \u2500\u2500 \uC720\uD29C\uBE0C \uC788\uC74C \u2192 \uCE74\uB4DC \uC5F4\uB9AC\uC790\uB9C8\uC790 \uBC14\uB85C iframe \uC7AC\uC0DD \u2500\u2500
  if (shop.youtubeId) {
    // \uC378\uB124\uC77C \uD074\uB9AD \uC7AC\uC0DD \u2192 mute \uC5C6\uC774 (\uAD11\uACE0 \uC218\uC775 \uD65C\uC131\uD654)
    iframe.src = \`https://www.youtube.com/embed/\${shop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
    iframe.style.display = 'block';
    thumbWrap.style.display = 'none';
    playBtn.style.display = 'none';

  // \u2500\u2500 \uC720\uD29C\uBE0C \uC5C6\uC74C \u2192 \uC0AC\uC9C4(\uC378\uB124\uC77C)\uB9CC \uD45C\uC2DC, \uD074\uB9AD \uBD88\uAC00 \u2500\u2500
  } else {
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    thumbWrap.style.display = 'block';
    thumbWrap.style.cursor = 'default';
    thumbWrap.onclick = null;  // \uD074\uB9AD \uC774\uBCA4\uD2B8 \uC81C\uAC70 (\uC0AC\uC9C4\uB9CC)
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

  // \uBC43\uC9C0
  const catBadge = document.getElementById('cardCatBadge');
  catBadge.textContent = shop.category;
  catBadge.style.background = color + '99';

  document.getElementById('cardFeatBadge').style.display = shop.featured ? 'block' : 'none';

  // \uD14D\uC2A4\uD2B8
  document.getElementById('cardName').textContent = shop.name;
  document.getElementById('cardAddress').textContent = shop.address || shop.district || '';
  document.getElementById('cardPrice').textContent = shop.price;
  document.getElementById('cardDesc').textContent = shop.desc || '';

  // \uD0DC\uADF8
  document.getElementById('cardTags').innerHTML =
    (shop.tags || []).map(t => \`<span class="card-tag">#\${t}</span>\`).join('');

  // \uC608\uC57D \uBC84\uD2BC
  const reserveBtn = document.getElementById('btnReserve');
  reserveBtn.style.display = shop.smartPlaceUrl ? 'flex' : 'none';

  document.getElementById('card').classList.add('open');
  window.parent.postMessage({ type:'shopSelected', id: shop.id }, '*');
  map.panTo(new naver.maps.LatLng(shop.lat, shop.lng));
  // position:fixed \uCE74\uB4DC\uAC00 iframe \uCCAB \uB80C\uB354 \uC2DC \uBDF0\uD3EC\uD2B8 \uBC16\uC5D0 \uC228\uB294 \uBB38\uC81C \uD574\uACB0
  // \u2192 map.autoResize()\uB85C \uAC15\uC81C \uB9AC\uD398\uC778\uD2B8 \uD2B8\uB9AC\uAC70
  requestAnimationFrame(() => { try { map.autoResize(); } catch(e){} });
}

/* \uB9C8\uCEE4 \uC0DD\uC131 */
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

/* \uB9C8\uCEE4 \uB80C\uB354\uB9C1 */
let allShops = [];
function renderMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  const list = curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat);
  list.forEach(s => markers.push(makeMarker(s)));
  // \uC5C5\uCCB4 \uC804\uCCB4\uAC00 \uBCF4\uC774\uB3C4\uB85D \uC790\uB3D9 \uBC94\uC704 \uC870\uC815
  fitToBounds(list);
}

/* \uC804\uCCB4 \uC5C5\uCCB4\uAC00 \uD654\uBA74\uC5D0 \uB4E4\uC5B4\uC624\uB3C4\uB85D \uBC94\uC704 \uC870\uC815 */
function fitToBounds(list) {
  if (!list.length || !map) return;
  if (list.length === 1) {
    // \uC5C5\uCCB4 1\uAC1C: \uC801\uB2F9\uD55C \uC90C(14)\uC73C\uB85C \uC911\uC559 \uD45C\uC2DC
    map.setCenter(new naver.maps.LatLng(list[0].lat, list[0].lng));
    map.setZoom(14);
  } else {
    const lats = list.map(s => s.lat);
    const lngs = list.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds, { top:80, right:60, bottom:140, left:60 });
    // fitBounds \uD6C4 \uB108\uBB34 \uAC00\uAE4C\uC774 \uC90C\uC778\uB410\uC73C\uBA74 \uCD5C\uB300 \uC90C 14\uB85C \uC81C\uD55C
    setTimeout(() => {
      if (map.getZoom() > 14) map.setZoom(14);
    }, 350);
  }
}

/* \uC9C0\uB3C4 \uCD08\uAE30\uD654 \u2014 \uB124\uC774\uBC84 \uC9C0\uB3C4 \uC2A4\uD06C\uB9BD\uD2B8 \uC644\uC804 \uB85C\uB4DC \uD6C4 \uC2E4\uD589 */
function waitNaver(cb, t=0) {
  if (window.naver && window.naver.maps && window.naver.maps.Map) { cb(); return; }
  if (t > 50) return; // 10\uCD08 \uCD08\uACFC \uD3EC\uAE30
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
</script>
</body>
</html>`;
}
function reportPage(token) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \xB7 \uC5C5\uCCB4 \uB9AC\uD3EC\uD2B8</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --purple:#7c3aed;--purple-l:#a78bfa;--purple-ll:#c4b5fd;
  --green:#10b981;--pink:#FF4D7D;
  --bg:#09090f;--card:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
  --t1:#f1f5f9;--t2:#94a3b8;--t3:#475569;
}
body{background:var(--bg);color:var(--t1);font-family:'Pretendard',-apple-system,sans-serif;min-height:100vh}

/* \u2500\u2500 \uC7A0\uAE08 \u2500\u2500 */
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

/* \u2500\u2500 \uB9AC\uD3EC\uD2B8 \u2500\u2500 */
#reportScreen{display:none;max-width:460px;margin:0 auto;padding-bottom:60px}

/* \uD5E4\uB354 */
.rp-header{padding:36px 20px 28px;text-align:center}
.rp-logo{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--purple-l);
  text-transform:uppercase;margin-bottom:12px}
.rp-name{font-size:26px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px}
.rp-cat{font-size:13px;color:var(--t2);margin-bottom:18px}
.rp-period{display:inline-flex;align-items:center;gap:6px;
  background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.25);
  border-radius:20px;padding:7px 16px;font-size:12px;font-weight:600;color:var(--purple-ll)}

/* \uAD6C\uBD84\uC120 */
.divider{height:1px;background:var(--border);margin:0 16px}

/* \u2500\u2500 \uBE45 \uC870\uD68C\uC218 \uCE74\uB4DC \u2500\u2500 */
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

/* \u2500\u2500 \uC561\uC158 \uC218 \uCE74\uB4DC \u2500\u2500 */
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

/* \u2500\u2500 30\uC77C \uCC28\uD2B8 \u2500\u2500 */
.chart-section{margin:20px 16px 0}
.chart-title{font-size:12px;font-weight:700;color:var(--t2);margin-bottom:12px;
  display:flex;align-items:center;gap:6px}
.chart-box{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:18px 12px 12px}
.chart-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;padding:0 4px}
.leg{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--t2)}
.leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* \u2500\u2500 \uB204\uC801 \uD55C\uC904 \u2500\u2500 */
.total-bar{margin:16px 16px 0;background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:16px 20px;
  display:flex;align-items:center;justify-content:space-between}
.total-lbl{font-size:12px;color:var(--t2)}
.total-num{font-size:18px;font-weight:900;color:var(--purple-l)}
.total-unit{font-size:12px;color:var(--t3);margin-left:2px}

/* \u2500\u2500 \uC751\uC6D0 \uBA54\uC2DC\uC9C0 \u2500\u2500 */
.cheer-box{margin:20px 16px 0;
  background:linear-gradient(135deg,rgba(255,77,125,.1),rgba(255,143,163,.05));
  border:1px solid rgba(255,77,125,.2);border-radius:18px;padding:22px 20px;
  display:flex;gap:14px;align-items:flex-start}
.cheer-icon{font-size:26px;flex-shrink:0}
.cheer-head{font-size:16px;font-weight:800;color:#fff;margin-bottom:5px;line-height:1.3}
.cheer-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.6}

/* \uD478\uD130 */
.rp-footer{margin:28px 16px 0;text-align:center;font-size:11px;color:var(--t3);line-height:1.9}
.rp-footer a{color:var(--purple-l);text-decoration:none}
</style>
</head>
<body>

<!-- \uC7A0\uAE08 -->
<div id="lockScreen">
  <div class="lock-logo">\u2726 \uB9C8\uC774\uBDF0\uD2F0\uB9F5</div>
  <div class="lock-card">
    <div class="lock-icon">\u{1F510}</div>
    <div class="lock-title">\uC5C5\uCCB4 \uB9AC\uD3EC\uD2B8</div>
    <div class="lock-desc">\uB4F1\uB85D\uD558\uC2E0 \uC804\uD654\uBC88\uD638\uC758<br><strong>\uB9C8\uC9C0\uB9C9 4\uC790\uB9AC</strong>\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694</div>
    <input class="lock-input" id="phoneInput" type="number" placeholder="\u2022\u2022\u2022\u2022"
      oninput="if(this.value.length>4)this.value=this.value.slice(0,4)"
      onkeydown="if(event.key==='Enter')doVerify()"/>
    <button class="lock-btn" id="lockBtn" onclick="doVerify()">\uD655\uC778</button>
    <div class="lock-error" id="lockError"></div>
  </div>
</div>

<!-- \uB9AC\uD3EC\uD2B8 -->
<div id="reportScreen" style="display:none">

  <div class="rp-header">
    <div class="rp-logo">\u2726 \uB9C8\uC774\uBDF0\uD2F0\uB9F5 \uB9AC\uD3EC\uD2B8</div>
    <div class="rp-name" id="rName">\u2014</div>
    <div class="rp-cat"  id="rCat">\u2014</div>
    <div class="rp-period" id="rPeriod">\u{1F4C5} \uC774\uBC88 \uB2EC \uAE30\uC900</div>
  </div>

  <div class="divider"></div>

  <!-- \uC601\uC0C1 \uC870\uD68C\uC218 (\uD575\uC2EC) -->
  <div class="hero-card">
    <div class="hero-lbl">\u{1F441} \uC774\uBC88 \uB2EC \uC601\uC0C1 \uC870\uD68C\uC218</div>
    <div class="hero-num"><span id="kViews">0</span><small>\uBA85</small></div>
    <div class="hero-badge badge-same" id="kViewsBadge">\u2014</div>
    <div class="hero-sub" id="kViewsSub"></div>
  </div>

  <!-- \uC608\uC57D+\uC9C0\uB3C4 \uD569\uC0B0 \uC561\uC158 -->
  <div class="action-card">
    <div class="action-left">
      <div class="action-lbl">\u{1F3AF} \uC774\uBC88 \uB2EC \uACE0\uAC1D \uC561\uC158</div>
      <div class="action-num"><span id="kAction">0</span><small>\uAC74</small></div>
      <div class="action-sub">\uC608\uC57D \uBC84\uD2BC + \uC9C0\uB3C4 \uD074\uB9AD \uD569\uC0B0</div>
    </div>
    <div class="action-right">
      <div class="action-prev-lbl">\uC9C0\uB09C\uB2EC</div>
      <div class="action-prev" id="kActionPrev">\u2014</div>
      <div class="action-badge badge-same" id="kActionBadge"></div>
    </div>
  </div>

  <!-- 30\uC77C \uCD94\uC774 \uCC28\uD2B8 -->
  <div class="chart-section">
    <div class="chart-title">\u{1F4C8} \uCD5C\uADFC 30\uC77C \uCD94\uC774</div>
    <div class="chart-box">
      <canvas id="trendChart" height="160"></canvas>
      <div class="chart-legend">
        <div class="leg"><span class="leg-dot" style="background:#a78bfa"></span>\uC601\uC0C1\uC870\uD68C</div>
        <div class="leg"><span class="leg-dot" style="background:#34d399"></span>\uACE0\uAC1D\uC561\uC158</div>
      </div>
    </div>
  </div>

  <!-- \uB204\uC801 \uC870\uD68C\uC218 \uD55C\uC904 -->
  <div class="total-bar">
    <div class="total-lbl">\u{1F4CA} \uC11C\uBE44\uC2A4 \uC2DC\uC791 \uC774\uD6C4 \uB204\uC801 \uC870\uD68C\uC218</div>
    <div><span class="total-num" id="tViews">0</span><span class="total-unit">\uBA85</span></div>
  </div>

  <!-- \uC751\uC6D0 \uBA54\uC2DC\uC9C0 -->
  <div class="cheer-box" id="cheerBox">
    <div class="cheer-icon" id="cheerIcon">\u{1F4A1}</div>
    <div>
      <div class="cheer-head" id="cheerHead">\u2014</div>
      <div class="cheer-sub"  id="cheerSub">\u2014</div>
    </div>
  </div>

  <div class="rp-footer">
    \uB9C8\uC774\uBDF0\uD2F0\uB9F5 \xB7 \uBDF0\uD2F0 \uC20F\uD3FC \uBCF4\uACE0 \uBC14\uB85C \uC608\uC57D<br>
    <a href="/">mybeautymap.co.kr</a>
  </div>
</div>

<script>
const TOKEN = '${token}';

async function doVerify() {
  const v = document.getElementById('phoneInput').value.trim();
  if (v.length !== 4) { document.getElementById('lockError').textContent = '4\uC790\uB9AC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694'; return; }
  document.getElementById('lockError').textContent = '';
  const btn = document.getElementById('lockBtn');
  btn.disabled = true; btn.textContent = '\uD655\uC778 \uC911...';
  try {
    const res = await fetch('/api/report/' + TOKEN + '/verify', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phone4: v })
    });
    if (res.status === 401) { document.getElementById('lockError').textContent = '\uC804\uD654\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC544\uC694'; btn.disabled=false; btn.textContent='\uD655\uC778'; return; }
    if (!res.ok)            { document.getElementById('lockError').textContent = '\uC798\uBABB\uB41C \uB9C1\uD06C\uC608\uC694';           btn.disabled=false; btn.textContent='\uD655\uC778'; return; }
    renderReport(await res.json());
  } catch(e) {
    document.getElementById('lockError').textContent = '\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694';
    btn.disabled=false; btn.textContent='\uD655\uC778';
  }
}

const fmt = n => (n||0).toLocaleString();

function pctBadge(curr, prev) {
  if (!prev) return { text:'\uCCAB \uB2EC \uB370\uC774\uD130', cls:'badge-same' };
  const p = Math.round(((curr-prev)/prev)*100);
  if (p > 0) return { text:'\u25B2 '+p+'% \uC9C0\uB09C\uB2EC\uBCF4\uB2E4 \uC0C1\uC2B9', cls:'badge-up' };
  if (p < 0) return { text:'\u25BC '+Math.abs(p)+'% \uC9C0\uB09C\uB2EC\uBCF4\uB2E4 \uD558\uB77D', cls:'badge-down' };
  return { text:'\u2192 \uC9C0\uB09C\uB2EC\uACFC \uB3D9\uC77C', cls:'badge-same' };
}

function renderReport(d) {
  document.getElementById('lockScreen').style.display   = 'none';
  document.getElementById('reportScreen').style.display = 'block';

  const now = new Date();
  const tm  = d.thisMonth || {};
  const lm  = d.lastMonth || {};

  /* \uD5E4\uB354 */
  document.getElementById('rName').textContent   = d.shop.name;
  document.getElementById('rCat').textContent    = d.shop.category + ' \xB7 ' + (d.shop.address||'').split(' ').slice(0,2).join(' ');
  document.getElementById('rPeriod').textContent = '\u{1F4C5} ' + now.getFullYear() + '\uB144 ' + (now.getMonth()+1) + '\uC6D4 \uAE30\uC900';

  /* \u2500\u2500 \uC601\uC0C1 \uC870\uD68C\uC218 \u2500\u2500 */
  document.getElementById('kViews').textContent = fmt(tm.views);

  const vb = pctBadge(tm.views, lm.views);
  const badge = document.getElementById('kViewsBadge');
  badge.textContent = vb.text; badge.className = 'hero-badge ' + vb.cls;

  document.getElementById('kViewsSub').textContent = tm.views > 0
    ? '\uC774\uBC88 \uB2EC \uB0B4 \uC601\uC0C1\uC744 \uC2DC\uCCAD\uD55C \uC7A0\uC7AC \uACE0\uAC1D \uC218\uC608\uC694'
    : '\uC544\uC9C1 \uC774\uBC88 \uB2EC \uB370\uC774\uD130\uAC00 \uC313\uC774\uB294 \uC911\uC774\uC5D0\uC694';

  /* \u2500\u2500 \uACE0\uAC1D \uC561\uC158 (\uC608\uC57D+\uC9C0\uB3C4 \uD569\uC0B0) \u2500\u2500 */
  const thisAction = (tm.feedSP||0) + (tm.mapSP||0);
  const lastAction = (lm.feedSP||0) + (lm.mapSP||0);
  document.getElementById('kAction').textContent    = fmt(thisAction);
  document.getElementById('kActionPrev').textContent = fmt(lastAction) + '\uAC74';

  const ab = pctBadge(thisAction, lastAction);
  const abadge = document.getElementById('kActionBadge');
  abadge.textContent = ab.text; abadge.className = 'action-badge ' + ab.cls;

  /* \u2500\u2500 30\uC77C \uCC28\uD2B8 (\uC870\uD68C + \uC561\uC158 \uD569\uC0B0) \u2500\u2500 */
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
      { label:'\uC601\uC0C1\uC870\uD68C', data:views,   borderColor:'#a78bfa', backgroundColor:'rgba(167,139,250,.12)',
        tension:.4, fill:true, pointRadius:2, borderWidth:2 },
      { label:'\uACE0\uAC1D\uC561\uC158', data:actions, borderColor:'#34d399', backgroundColor:'rgba(52,211,153,.08)',
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

  /* \u2500\u2500 \uB204\uC801 \uC870\uD68C\uC218 \u2500\u2500 */
  document.getElementById('tViews').textContent = fmt(d.total.views);

  /* \u2500\u2500 \uC751\uC6D0 \uBA54\uC2DC\uC9C0 \u2500\u2500 */
  const cPct = lm.views > 0 ? Math.round(((tm.views - lm.views) / lm.views) * 100) : null;
  const totalAct = (tm.views||0) + thisAction;
  let icon = '\u{1F4A1}', head = '', sub = '';

  if (totalAct === 0) {
    icon = '\u{1F331}'; head = '\uB370\uC774\uD130\uAC00 \uC313\uC774\uB294 \uC911\uC774\uC5D0\uC694';
    sub  = '\uACE7 \uACB0\uACFC\uAC00 \uB098\uD0C0\uB0A0 \uAC70\uC608\uC694. \uC601\uC0C1\uC744 \uCD5C\uC2E0\uC73C\uB85C \uC720\uC9C0\uD574\uBCF4\uC138\uC694!';
  } else if (cPct !== null && cPct >= 30) {
    icon = '\u{1F680}'; head = '\uC774\uBC88 \uB2EC \uC870\uD68C\uC218\uAC00 \uD06C\uAC8C \uC62C\uB790\uC5B4\uC694! +' + cPct + '%';
    sub  = '\uC9C0\uB09C\uB2EC\uBCF4\uB2E4 \uD6E8\uC52C \uB9CE\uC740 \uC7A0\uC7AC \uACE0\uAC1D\uC774 \uC5C5\uCCB4\uB97C \uBC1C\uACAC\uD558\uACE0 \uC788\uC5B4\uC694.';
  } else if (thisAction >= 5) {
    icon = '\u{1F389}'; head = fmt(thisAction) + '\uBA85\uC774 \uC9C1\uC811 \uD589\uB3D9\uD588\uC5B4\uC694!';
    sub  = '\uC601\uC0C1\uC744 \uBCF4\uACE0 \uC608\uC57D \uB610\uB294 \uC9C0\uB3C4\uB97C \uD074\uB9AD\uD55C \uC2E4\uC9C8\uC801\uC778 \uAD00\uC2EC \uACE0\uAC1D\uC774\uC5D0\uC694.';
  } else if ((tm.views||0) >= 20) {
    icon = '\u{1F4E3}'; head = fmt(tm.views) + '\uBA85\uC774 \uB0B4 \uC601\uC0C1\uC744 \uBD24\uC5B4\uC694';
    sub  = '\uB9CE\uC740 \uC7A0\uC7AC \uACE0\uAC1D\uC774 \uAD00\uC2EC\uC744 \uBCF4\uC774\uACE0 \uC788\uC5B4\uC694. \uAFB8\uC900\uD788 \uB178\uCD9C\uB418\uB294 \uC911\uC774\uC5D0\uC694.';
  } else {
    icon = '\u{1F4C8}'; head = '\uAFB8\uC900\uD788 \uB178\uCD9C\uB418\uACE0 \uC788\uC5B4\uC694';
    sub  = '\uB9C8\uC774\uBDF0\uD2F0\uB9F5\uC5D0\uC11C \uC5C5\uCCB4 \uC815\uBCF4\uAC00 \uACE0\uAC1D\uB4E4\uC5D0\uAC8C \uC804\uB2EC\uB418\uACE0 \uC788\uC5B4\uC694.';
  }
  document.getElementById('cheerIcon').textContent = icon;
  document.getElementById('cheerHead').textContent = head;
  document.getElementById('cheerSub').textContent  = sub;
}
</script>
</body>
</html>`;
}
function adminPage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>\uAD00\uB9AC\uC790 \u2013 \uB9C8\uC774\uBDF0\uD2F0\uB9F5</title>
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

/* \u2500\u2500 \uC0C1\uB2E8\uBC14 \u2500\u2500 */
.top{background:rgba(14,14,14,.98);border-bottom:1px solid var(--border);
  padding:0 16px;height:54px;display:flex;align-items:center;gap:10px;
  position:sticky;top:0;z-index:50;backdrop-filter:blur(12px)}
.back{font-size:20px;color:var(--t3);text-decoration:none;display:flex;align-items:center}
.back:hover{color:var(--t1)}
.ttl{font-size:16px;font-weight:800;flex:1}
.add-btn{background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}

/* \u2500\u2500 \uD0ED\uBC14 \u2500\u2500 */
.tabbar{display:flex;border-bottom:1px solid var(--border);background:rgba(14,14,14,.92);
  position:sticky;top:54px;z-index:40;backdrop-filter:blur(8px)}
.tabbtn{flex:1;padding:12px 4px;text-align:center;font-size:11px;font-weight:700;
  color:var(--t3);background:none;border:none;cursor:pointer;
  font-family:inherit;border-bottom:2px solid transparent;transition:all .2s;
  display:flex;flex-direction:column;align-items:center;gap:3px}
.tabbtn i{font-size:15px}
.tabbtn.on{color:var(--pink);border-bottom-color:var(--pink)}

/* \u2500\u2500 \uACF5\uD1B5 \uB808\uC774\uC544\uC6C3 \u2500\u2500 */
.wrap{max-width:640px;margin:0 auto;padding:14px 14px 100px}
.section-title{font-size:11px;font-weight:700;color:var(--t3);
  letter-spacing:.6px;text-transform:uppercase;margin:18px 0 10px 2px;
  display:flex;align-items:center;gap:6px}
.section-title::after{content:'';flex:1;height:1px;background:var(--border)}

/* \u2500\u2500 \uC624\uB298 KPI \uADF8\uB9AC\uB4DC (2x2) \u2500\u2500 */
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

/* \u2500\u2500 \uC624\uB298 vs \uB204\uC801 \uC694\uC57D\uBC14 \u2500\u2500 */
.summary-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
.sb-item{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:10px 8px;text-align:center}
.sb-val{font-size:18px;font-weight:800;color:rgba(255,255,255,.85)}
.sb-lbl{font-size:9px;color:var(--t3);font-weight:600;margin-top:3px}

/* \u2500\u2500 \uCC28\uD2B8 \uC139\uC158 \u2500\u2500 */
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

/* \u2500\u2500 \uC5C5\uCCB4\uBCC4 \uC624\uB298 \uB7AD\uD0B9 \u2500\u2500 */
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

/* \u2500\u2500 \uD22C\uC790\uC790 \uC9C0\uD45C \uC139\uC158 \u2500\u2500 */
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
/* \uC804\uD658\uC728 \uAC8C\uC774\uC9C0 \uBC14 */
.cvr-gauge{margin-top:8px;height:4px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.cvr-gauge-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#f59e0b,#d97706);transition:width .6s}
/* \uC5C5\uCCB4\uBCC4 \uC778\uC0AC\uC774\uD2B8 \uB9AC\uC2A4\uD2B8 */
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
/* \uC218\uC775\uD654 \uD37C\uB110 */
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

/* \u2500\u2500 \uC5C5\uCCB4 \uAD00\uB9AC \uCE74\uB4DC \u2500\u2500 */
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
/* \uD074\uB9AD \uC8FC\uC694 \uC9C0\uD45C (\uD53C\uB4DC+\uC9C0\uB3C4) */
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
/* \uD074\uB9AD \uD569\uACC4 \uAC15\uC870 */
.sc-total-click{display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:7px 10px}
.stc-val{font-size:16px;font-weight:900;color:#fff}
.stc-lbl{font-size:10px;color:var(--t3);font-weight:600}
/* \uCD9C\uCC98\uBCC4 \uC601\uC0C1\uC870\uD68C \uBD84\uC11D \uCE69 */
.sc-view-src{margin-top:6px;padding:7px 10px;background:rgba(167,139,250,.06);
  border:1px solid rgba(167,139,250,.18);border-radius:8px}
.vsrc-title{font-size:9px;color:#a78bfa;font-weight:700;margin-bottom:5px;letter-spacing:.4px}
.vsrc-row{display:flex;gap:5px;flex-wrap:wrap}
.vsrc-chip{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap}
.vsrc-feed{background:rgba(16,185,129,.12);color:#10B981;border:1px solid rgba(16,185,129,.25)}
.vsrc-cat{background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.25)}
.vsrc-map{background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25)}
/* \uCD9C\uCC98\uBCC4 \uC804\uD658\uC728 */
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

/* \u2500\u2500 \uAD6C\uB3C5\uAD00\uB9AC \u2500\u2500 */
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

/* \u2500\u2500 \uC785\uC810\uBB38\uC758 \u2500\u2500 */
.inq-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px}
.inq-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.inq-name{font-size:14px;font-weight:700}
.inq-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(255,77,125,.1);color:var(--pink)}
.inq-time{font-size:10px;color:var(--t3);margin-left:auto}
.inq-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:5px}
.inq-kv{font-size:11px;color:var(--t3)}
.inq-kv strong{color:var(--t2);font-weight:600}
.inq-msg{font-size:12px;color:var(--t3);line-height:1.6;border-top:1px solid var(--border);margin-top:8px;padding-top:8px}

/* \u2500\u2500 \uBE48 \uC0C1\uD0DC \u2500\u2500 */
.empty{text-align:center;padding:44px 16px;color:var(--t3);font-size:13px}

/* \u2500\u2500 \uBAA8\uB2EC \u2500\u2500 */
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

/* \u2500\u2500 \uACB0\uC81C \uBAA8\uB2EC \u2500\u2500 */
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

<!-- \uC0C1\uB2E8\uBC14 -->
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">\uB9C8\uC774\uBDF0\uD2F0\uB9F5 \uAD00\uB9AC\uC790</span>
  <button class="add-btn" onclick="openModal()"><i class="fas fa-plus"></i> \uC5C5\uCCB4 \uCD94\uAC00</button>
</div>

<!-- \uD0ED\uBC14 -->
<div class="tabbar">
  <button class="tabbtn on" id="tab-stats" onclick="switchTab('stats')">
    <i class="fas fa-chart-line"></i>\uD1B5\uACC4
  </button>
  <button class="tabbtn" id="tab-ranking" onclick="switchTab('ranking')">
    <i class="fas fa-trophy"></i>\uC5C5\uCCB4\uC21C\uC704
  </button>
  <button class="tabbtn" id="tab-shops" onclick="switchTab('shops')">
    <i class="fas fa-store"></i>\uC5C5\uCCB4
  </button>
  <button class="tabbtn" id="tab-shorts-admin" onclick="switchTab('shorts-admin')">
    <i class="fas fa-bolt" style="font-size:11px"></i>\uC20F\uD3FC
  </button>
  <button class="tabbtn" id="tab-inq" onclick="switchTab('inq')">
    <i class="fas fa-envelope"></i>\uBB38\uC758
  </button>
  <button class="tabbtn" id="tab-pay" onclick="switchTab('pay')">
    <i class="fas fa-credit-card"></i>\uAD6C\uB3C5
  </button>
</div>

<!-- \uCF58\uD150\uCE20 -->
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

<!-- \uC5C5\uCCB4 \uCD94\uAC00/\uC218\uC815 \uBAA8\uB2EC -->
<div class="modal-bg hidden" id="modalBg" onclick="bgClick(event)">
<div class="modal" id="modal">
  <div class="modal-handle"></div>
  <div class="modal-ttl" id="modalTtl">\uC5C5\uCCB4 \uCD94\uAC00</div>
  <div class="field">
    <label>\u{1F4E1} \uB178\uCD9C \uBC29\uC2DD</label>
    <div class="mode-select">
      <div class="mode-opt sel-both" id="mo-both" onclick="setMode('both')"><div class="mo-icon">\u{1F3AC}\u{1F5FA}\uFE0F</div>\uC601\uC0C1+\uC9C0\uB3C4</div>
      <div class="mode-opt" id="mo-feed" onclick="setMode('feed')"><div class="mo-icon">\u{1F3AC}</div>\uC601\uC0C1\uB9CC</div>
      <div class="mode-opt" id="mo-map"  onclick="setMode('map')"><div class="mo-icon">\u{1F5FA}\uFE0F</div>\uC9C0\uB3C4\uB9CC</div>
    </div>
    <input type="hidden" id="f-mode" value="both"/>
  </div>
  <div class="field"><label>\uC5C5\uCCB4\uBA85 *</label><input id="f-name" type="text" placeholder="\uC608: \uBC38\uB7F0\uC2A4 \uC5D8 \uC2A4\uD2B8\uB808\uCE6D"/></div>
  <div class="row2">
    <div class="field"><label>\uCE74\uD14C\uACE0\uB9AC *</label>
      <select id="f-cat">
        <option>\uB9C8\uC0AC\uC9C0</option><option>\uD5E4\uB4DC\uC2A4\uD30C</option><option>\uD53C\uBD80\uAD00\uB9AC</option>
        <option>\uD5E4\uC5B4</option><option>\uBA54\uC774\uD06C\uC5C5</option><option>\uC641\uC2F1</option>
        <option>\uBC18\uC601\uAD6C</option><option>\uBCD1\uC6D0</option><option>\uADF8\uC678</option>
      </select>
    </div>
    <div class="field"><label>\uAC00\uACA9\uB300</label><input id="f-price" type="text" placeholder="\uC608: 5\uB9CC\uC6D0~"/></div>
  </div>
  <div class="field">
    <label>\u{1F5BC}\uFE0F \uC378\uB124\uC77C \uC774\uBBF8\uC9C0</label>
    <div class="thumb-wrap">
      <img id="thumbPreview" class="thumb-preview"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"/>
      <div class="thumb-right">
        <label class="upload-btn" for="thumbFile"><i class="fas fa-upload"></i> \uD30C\uC77C \uC120\uD0DD</label>
        <input type="file" id="thumbFile" accept="image/*" style="display:none" onchange="handleThumbFile(event)"/>
        <input class="thumb-url-inp" id="f-thumb" type="text" placeholder="\uB610\uB294 \uC774\uBBF8\uC9C0 URL" oninput="updateThumbPreview(this.value)"/>
      </div>
    </div>
  </div>
  <div class="field" id="ytField">
    <label>\u{1F3AC} \uC720\uD29C\uBE0C URL (\uB610\uB294 \uC601\uC0C1 ID)</label>
    <input id="f-yt" type="text" placeholder="https://youtu.be/xxxxx" oninput="previewYt(this.value)"/>
    <div class="yt-preview" id="ytPreview"><iframe id="ytFrame" src="" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>
  </div>
  <div class="field" id="addrField">
    <label>\u{1F4CD} \uC8FC\uC18C *</label>
    <div class="geo-row">
      <input id="f-addr" type="text" placeholder="\uC608: \uC11C\uC6B8 \uAC15\uB0A8\uAD6C \uB17C\uD604\uB85C 123" style="flex:1"
        onkeydown="if(event.key==='Enter'){event.preventDefault();geocodeAddr()}"/>
      <button class="geo-btn" onclick="geocodeAddr()" id="geoBtn"><i class="fas fa-crosshairs"></i> \uC88C\uD45C\uCC3E\uAE30</button>
    </div>
    <div class="geo-status" id="geoStatus"></div>
  </div>
  <div class="row2" id="distRow">
    <div class="field"><label>\uAD6C/\uC9C0\uC5ED <small style="color:var(--t4)">(\uC790\uB3D9)</small></label><input id="f-dist" type="text" placeholder="\uAC15\uB0A8\uAD6C"/></div>
    <div class="field"><label>\uC804\uD654\uBC88\uD638</label><input id="f-phone" type="text" placeholder="02-1234-5678"/></div>
  </div>
  <div class="row2" id="latRow">
    <div class="field"><label>\uC704\uB3C4 <small style="color:var(--t4)">(\uC790\uB3D9)</small></label><input id="f-lat" type="number" step="0.000001" placeholder="\uC790\uB3D9\uC785\uB825"/></div>
    <div class="field"><label>\uACBD\uB3C4 <small style="color:var(--t4)">(\uC790\uB3D9)</small></label><input id="f-lng" type="number" step="0.000001" placeholder="\uC790\uB3D9\uC785\uB825"/></div>
  </div>
  <div class="field"><label>\u{1F4C5} \uB124\uC774\uBC84 \uC608\uC57D URL</label><input id="f-url" type="text" placeholder="https://naver.me/xxxxx"/></div>
  <div class="field"><label>\uD0DC\uADF8 (\uC27C\uD45C\uB85C \uAD6C\uBD84)</label><input id="f-tags" type="text" placeholder="\uB9AC\uD504\uD305, \uBCF4\uC2B5, \uD2B8\uB7EC\uBE14\uCF00\uC5B4"/></div>
  <div class="field"><label>\uC5C5\uCCB4 \uC18C\uAC1C</label><textarea id="f-desc" placeholder="\uC5C5\uCCB4 \uAC04\uB2E8 \uC18C\uAC1C"></textarea></div>
  <div class="row2">
    <div class="field"><label>\uC0C1\uB2E8 \uB178\uCD9C</label>
      <select id="f-feat"><option value="false">\uC77C\uBC18</option><option value="true">\u2B50 \uCD94\uCC9C \uC0C1\uB2E8</option></select>
    </div>
    <div class="field"><label>\uACF5\uAC1C \uC5EC\uBD80</label>
      <select id="f-active"><option value="true">\uACF5\uAC1C</option><option value="false">\uBE44\uACF5\uAC1C</option></select>
    </div>
  </div>
  <!-- \u2B50 \uCD94\uCC9C\uD0ED \uD1A0\uAE00 -->
  <div class="field" style="margin-bottom:18px">
    <label>\u2B50 \uCD94\uCC9C\uD0ED \uB178\uCD9C</label>
    <div id="rec-toggle-wrap" onclick="toggleRecInModal()" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:2px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);transition:all .25s" id="recToggleWrap">
      <div id="rec-toggle-track" style="width:44px;height:24px;border-radius:12px;background:#374151;position:relative;transition:background .25s;flex-shrink:0">
        <div id="rec-toggle-thumb" style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .25s"></div>
      </div>
      <div>
        <div id="rec-toggle-label" style="font-size:13px;font-weight:700;color:#94a3b8">\uCD94\uCC9C\uD0ED \uBBF8\uB178\uCD9C</div>
        <div style="font-size:11px;color:#475569;margin-top:1px">\u2B50\uCD94\uCC9C \uD0ED\uC5D0 \uC774 \uC5C5\uCCB4\uB97C \uB178\uCD9C\uD569\uB2C8\uB2E4</div>
      </div>
    </div>
    <input type="hidden" id="f-rec" value="false"/>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closeModal()">\uCDE8\uC18C</button>
    <button class="btn-save" onclick="saveShop()"><i class="fas fa-save"></i> \uC800\uC7A5\uD558\uAE30</button>
  </div>
</div>
</div>

<!-- \uACB0\uC81C \uC218\uC815 \uBAA8\uB2EC -->
<div class="pay-modal-bg hidden" id="payModalBg" onclick="if(event.target===this)closePayModal()">
<div class="pay-modal" id="payModal">
  <div class="pm-handle"></div>
  <div class="pm-ttl">\u{1F4B3} \uAD6C\uB3C5 \uAD00\uB9AC</div>
  <div class="pm-sub" id="pmShopName">\uC5C5\uCCB4\uBA85</div>
  <div class="field"><label>\u{1F4E6} \uD50C\uB79C</label></div>
  <div class="pm-plan-grid">
    <div class="pm-plan-opt sel-shoot" id="pm-plan-shoot" onclick="setPmPlan('shoot')">
      <div class="po-icon">\u{1F3AC}</div><div class="po-name">\uCD2C\uC601 \uD50C\uB79C</div>
      <div class="po-price">\uCD2C\uC601\uBE44 3\uB9CC\uC6D0 \xB7 6\uAC1C\uC6D4 \uBB34\uB8CC<br>\uC774\uD6C4 \uC6D4 10,000\uC6D0</div>
    </div>
    <div class="pm-plan-opt" id="pm-plan-basic" onclick="setPmPlan('basic')">
      <div class="po-icon">\u{1F4CD}</div><div class="po-name">\uAE30\uBCF8 \uD50C\uB79C</div>
      <div class="po-price">\uC601\uC0C1 \uC5C6\uC774 \uB9F5\uB9CC<br>\uC6D4 10,000\uC6D0</div>
    </div>
  </div>
  <div class="field"><label>\u{1F4CA} \uACB0\uC81C \uC0C1\uD0DC</label></div>
  <div class="pm-status-grid">
    <div class="pm-status-opt" id="pm-st-paid"    onclick="setPmStatus('paid')">\u2705<br>\uACB0\uC81C\uC644\uB8CC</div>
    <div class="pm-status-opt" id="pm-st-free"    onclick="setPmStatus('free')">\u{1F381}<br>\uBB34\uB8CC\uAE30\uAC04</div>
    <div class="pm-status-opt" id="pm-st-unpaid"  onclick="setPmStatus('unpaid')">\u{1F4B3}<br>\uBBF8\uACB0\uC81C</div>
    <div class="pm-status-opt" id="pm-st-expired" onclick="setPmStatus('expired')">\u26A0\uFE0F<br>\uB9CC\uB8CC</div>
  </div>
  <div class="field">
    <label>\u{1F4C6} \uAD6C\uB3C5 \uB9CC\uB8CC\uC77C</label>
    <input id="pm-until" type="date" style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none"/>
  </div>
  <div style="display:flex;gap:6px;margin-top:-6px;margin-bottom:14px">
    <button onclick="addMonths(1)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+1\uAC1C\uC6D4</button>
    <button onclick="addMonths(3)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+3\uAC1C\uC6D4</button>
    <button onclick="addMonths(6)"  style="flex:1;background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.22);color:var(--green);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+6\uAC1C\uC6D4</button>
    <button onclick="addMonths(12)" style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+12\uAC1C\uC6D4</button>
  </div>
  <div class="field">
    <label>\u{1F4DD} \uBA54\uBAA8</label>
    <textarea id="pm-memo" placeholder="\uC608) \uD64D\uAE38\uB3D9 \uACC4\uC88C\uC774\uCCB4 30,000\uC6D0 24.01.15"
      style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;resize:vertical;min-height:60px"></textarea>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closePayModal()">\uCDE8\uC18C</button>
    <button class="btn-save" onclick="savePayment()"><i class="fas fa-save"></i> \uC800\uC7A5\uD558\uAE30</button>
  </div>
</div>
</div>

<script>
// \u2500\u2500 \uC804\uC5ED \uC0C1\uD0DC
let editId = null, payEditId = null;
let pmPlan = 'shoot', pmStatus = 'unpaid';
let curTab = 'stats';
let shopData = [];
let thumbDataUrl = '';
let _stats = null, _dvRows = [], _chartMode = 'view', _rankMode = 'today', _insightMode = 'top';

// \u2500\u2500 \uD0ED \uC804\uD658
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

// \u2500\u2500 \uD1A0\uC2A4\uD2B8
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

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// \u26A1 \uAD00\uB9AC\uC790 \uC20F\uD3FC \uAD00\uB9AC
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
let _shortsAdminItems = [];
let _shortsAdminEditId = null;
let _shortsAdminTab = 'overview'; // overview | items | daily

const CAT_OPTIONS = ['\uB9C8\uC0AC\uC9C0','\uD5E4\uB4DC\uC2A4\uD30C','\uD53C\uBD80\uAD00\uB9AC','\uD5E4\uC5B4','\uBA54\uC774\uD06C\uC5C5','\uC641\uC2F1','\uBC18\uC601\uAD6C','\uBCD1\uC6D0','\uADF8\uC678'];

async function loadShortsAdmin() {
  const p = document.getElementById('panel-shorts-admin');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b">\uBD88\uB7EC\uC624\uB294 \uC911...</div>';
  _shortsAdminItems = await fetch('/api/admin/shorts').then(r=>r.json());
  renderShortsAdminShell();
  switchShortsAdminTab(_shortsAdminTab);
}

// \u2500\u2500 \uC678\uBD80 \uAECD\uB370\uAE30(\uD0ED\uBC14 + \uCEE8\uD150\uCE20 \uC601\uC5ED + \uBAA8\uB2EC) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderShortsAdminShell() {
  const p = document.getElementById('panel-shorts-admin');
  const tabBtn = (key, label, icon) =>
    '<button onclick="switchShortsAdminTab(&quot;'+key+'&quot;)" id="sat-'+key+'" style="flex:1;border:none;border-bottom:2px solid transparent;background:none;color:#64748b;font-size:12px;font-weight:700;padding:10px 4px;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px"><i class="fas '+icon+'" style="font-size:14px"></i>'+label+'</button>';

  p.innerHTML =
    // \uD0ED \uD5E4\uB354
    '<div style="position:sticky;top:0;z-index:10;background:#111;border-bottom:1px solid rgba(255,255,255,.08)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0">' +
        '<div style="font-size:15px;font-weight:800;color:#e879f9">\u26A1 \uC20F\uD3FC \uAD00\uB9AC</div>' +
        '<button onclick="openShortsModal(null)" style="background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:10px;padding:7px 13px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit">+ \uCD94\uAC00</button>' +
      '</div>' +
      '<div style="display:flex;margin-top:8px">' +
        tabBtn('overview','\uD604\uD669\uC694\uC57D','fa-chart-pie') +
        tabBtn('items','\uC5C5\uCCB4\uBCC4','fa-list') +
        tabBtn('daily','\uC77C\uBCC4\uCD94\uC774','fa-chart-bar') +
      '</div>' +
    '</div>' +
    '<div id="shorts-admin-body" style="padding:14px"></div>' +
    // \uBAA8\uB2EC
    _shortsAdminModalHtml();

  // \uD30C\uC77C onchange\uB294 \uC778\uB77C\uC778\uC73C\uB85C \uCC98\uB9AC (innerHTML \uAD50\uCCB4 \uC2DC \uB9AC\uC2A4\uB108 \uC720\uC2E4 \uBC29\uC9C0)
}

function _shortsAdminModalHtml() {
  const inp = adminInputStyle();
  return (
    '<div id="shortsModalBg" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;align-items:flex-end;backdrop-filter:blur(4px)" onclick="if(event.target===this)closeShortsModal()">' +
    '<div id="shortsAdminModal" style="background:#161616;border-radius:24px 24px 0 0;padding:22px 20px 32px;width:100%;max-height:92vh;overflow-y:auto">' +

      // \u2500\u2500 \uD5E4\uB354
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">' +
        '<div id="shortsModalTitle" style="font-size:16px;font-weight:900;color:#fff">\uC20F\uD3FC \uCD94\uAC00</div>' +
        '<button onclick="closeShortsModal()" style="background:rgba(255,255,255,.08);border:none;color:#94a3b8;border-radius:50%;width:30px;height:30px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit">\u2715</button>' +
      '</div>' +

      // \u2500\u2500 STEP 1: \uC601\uC0C1
      '<div style="margin-bottom:16px">' +
        '<div style="font-size:11px;font-weight:800;color:#e879f9;letter-spacing:.05em;margin-bottom:8px">STEP 1 \xB7 \uC601\uC0C1 \uC120\uD0DD</div>' +
        // \uD30C\uC77C \uC5C5\uB85C\uB4DC \uB4DC\uB86D\uC874
        '<label for="s-vid-file" id="s-vid-label" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;padding:20px 12px;border:2px dashed rgba(232,121,249,.35);border-radius:16px;cursor:pointer;background:rgba(232,121,249,.04);transition:all .2s;box-sizing:border-box">' +
          '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
          '<span style="font-size:13px;font-weight:700;color:#e879f9">\uC601\uC0C1 \uD30C\uC77C \uC120\uD0DD</span>' +
          '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
        '</label>' +
        '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>' +
        // \uC120\uD0DD \uD6C4 \uBBF8\uB9AC\uBCF4\uAE30 + \uC5C5\uB85C\uB4DC \uBC84\uD2BC
        // \uC5C5\uB85C\uB4DC \uC9C4\uD589 \uC0C1\uD0DC (\uD30C\uC77C \uC120\uD0DD \uC989\uC2DC \uD45C\uC2DC)
        '<div id="s-upload-status" style="display:none;font-size:12px;color:#94a3b8;margin-top:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.04);text-align:center"></div>' +
        // \uC5C5\uB85C\uB4DC \uC644\uB8CC \uD6C4 \uC601\uC0C1 \uBBF8\uB9AC\uBCF4\uAE30
        '<div id="s-cl-preview" style="display:none;margin-top:12px">' +
          '<div style="display:flex;align-items:center;gap:10px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:12px;padding:10px 12px">' +
            '<i class="fas fa-circle-check" style="color:#22c55e;font-size:18px;flex-shrink:0"></i>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-size:11px;font-weight:700;color:#22c55e;margin-bottom:2px">\uC601\uC0C1 \uB4F1\uB85D\uB428</div>' +
              '<div id="s-cl-id-label" style="font-size:10px;color:#475569;word-break:break-all"></div>' +
            '</div>' +
            '<video id="s-cl-vid" style="width:44px;height:78px;border-radius:6px;object-fit:cover;flex-shrink:0" muted playsinline></video>' +
          '</div>' +
          // \uC228\uACA8\uC9C4 \uC2E4\uC81C ID input (saveShorts\uC5D0\uC11C \uC77D\uC74C)
          '<input id="s-clid" style="display:none"/>' +
        '</div>' +
      '</div>' +

      // \u2500\u2500 STEP 2: \uB124\uC774\uBC84 \uC608\uC57D\uB9C1\uD06C
      '<div style="margin-bottom:16px">' +
        '<div style="font-size:11px;font-weight:800;color:#e879f9;letter-spacing:.05em;margin-bottom:8px">STEP 2 \xB7 \uB124\uC774\uBC84 \uC608\uC57D\uB9C1\uD06C</div>' +
        '<input id="s-place" placeholder="https://naver.me/xxxxx  \uB610\uB294  \uC2A4\uB9C8\uD2B8\uD50C\uB808\uC774\uC2A4 URL" style="'+inp+'" oninput="autoFetchNaverInfo(this.value)"/>' +
        // \uC790\uB3D9 \uCD94\uCD9C \uC0C1\uD0DC
        '<div id="s-naver-status" style="display:none;font-size:11px;margin-top:6px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.04)"></div>' +
      '</div>' +

      // \u2500\u2500 \uCD94\uAC00 \uC815\uBCF4 (\uC811\uAE30 \uAC00\uB2A5)
      '<details id="s-extra-details" style="border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px 14px;margin-bottom:16px">' +
        '<summary style="font-size:12px;font-weight:700;color:#64748b;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between">' +
          '<span><i class="fas fa-sliders" style="margin-right:6px;opacity:.6"></i>\uCD94\uAC00 \uC815\uBCF4 (\uC120\uD0DD)</span>' +
          '<i class="fas fa-chevron-down" style="font-size:10px;opacity:.4"></i>' +
        '</summary>' +
        '<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">' +
          // \uC5C5\uCCB4\uBA85
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">\uC5C5\uCCB4\uBA85</label>' +
            '<input id="s-name" placeholder="\uC790\uB3D9 \uC785\uB825 \uB610\uB294 \uC9C1\uC811 \uC785\uB825" style="'+inp+'"/>' +
          '</div>' +
          // \uCE74\uD14C\uACE0\uB9AC
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">\uCE74\uD14C\uACE0\uB9AC</label>' +
            '<select id="s-cat" style="'+inp+'background:#1b1b1b;color:#fff;appearance:auto"><option value="" style="background:#1b1b1b;color:#fff">\uC120\uD0DD \uC548\uD568</option></select>' +
          '</div>' +
          // \uC8FC\uC18C
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">\uC8FC\uC18C</label>' +
            '<input id="s-addr" placeholder="\uC790\uB3D9 \uC785\uB825 \uB610\uB294 \uC9C1\uC811 \uC785\uB825" style="'+inp+'"/>' +
          '</div>' +
          // \uC720\uD29C\uBE0C fallback
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">\uC720\uD29C\uBE0C \uB9C1\uD06C (Cloudinary \uC5C6\uC744 \uB54C \uB300\uCCB4)</label>' +
            '<input id="s-ytid" placeholder="https://youtube.com/shorts/xxxxx" style="'+inp+'"/>' +
          '</div>' +
          // \uC21C\uC11C + \uB178\uCD9C
          '<div style="display:flex;gap:10px;align-items:center">' +
            '<div style="flex:1">' +
              '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">\uC815\uB82C \uC21C\uC11C</label>' +
              '<input id="s-order" type="number" value="0" style="'+inp+'"/>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:16px">' +
              '<label style="font-size:11px;color:#64748b;font-weight:700">\uB178\uCD9C</label>' +
              '<input id="s-active" type="checkbox" checked style="width:22px;height:22px;cursor:pointer;accent-color:#c026d3"/>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</details>' +

      // \u2500\u2500 \uC800\uC7A5 \uBC84\uD2BC
      '<button onclick="saveShorts()" style="width:100%;background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:.01em">\uB4F1\uB85D\uD558\uAE30</button>' +

    '</div>' +
  '</div>'
  );
}

// \u2500\u2500 \uD0ED \uC804\uD658 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
  body.innerHTML = '<div style="text-align:center;padding:20px;color:#475569">\uBD88\uB7EC\uC624\uB294 \uC911...</div>';
  if (tab==='overview') renderShortsOverview();
  else if (tab==='items') renderShortsItems();
  else if (tab==='daily') renderShortsDaily();
}

// \u2500\u2500 \uD0ED1: \uD604\uD669 \uC694\uC57D \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
      '<span style="font-size:10px;padding:1px 6px;border-radius:6px;margin-left:5px;background:'+(v>=0?'rgba(52,211,153,.15)':'rgba(248,113,113,.15)')+';color:'+(v>=0?'#34d399':'#f87171')+'">'+(v>=0?'\u25B2':'\u25BC')+Math.abs(v)+'%</span>';

    const kpiCard = (icon, label, val, sub, color) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;flex:1;min-width:0">' +
        '<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:6px"><i class="fas '+icon+'" style="color:'+color+';margin-right:4px"></i>'+label+'</div>' +
        '<div style="font-size:22px;font-weight:900;color:#f1f5f9">'+val+'</div>' +
        '<div style="font-size:10px;color:#475569;margin-top:3px">'+sub+'</div>' +
      '</div>';

    body.innerHTML =
      // KPI 4\uAC1C
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
        kpiCard('fa-eye','\uC624\uB298 \uC870\uD68C',s.today_views.toLocaleString()+'\uD68C', '\uC5B4\uC81C '+s.yest_views.toLocaleString()+'\uD68C'+diffBadge(todayVsDiff), '#6366f1') +
        kpiCard('fa-calendar-check','\uC624\uB298 \uC608\uC57D\uD074\uB9AD',s.today_sp.toLocaleString()+'\uD68C', '\uC5B4\uC81C '+s.yest_sp.toLocaleString()+'\uD68C'+diffBadge(todaySpDiff), '#FF4D7D') +
        kpiCard('fa-chart-line','7\uC77C \uC870\uD68C',s.week_views.toLocaleString()+'\uD68C', 'CTR '+weekCtr+'%', '#f59e0b') +
        kpiCard('fa-video','\uCD1D \uC20F\uD3FC',s.total_items+'\uAC1C', '\uB178\uCD9C\uC911 '+s.active_items+'\uAC1C', '#e879f9') +
      '</div>' +
      // \uB204\uC801 \uD569\uACC4 \uBC14
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:14px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px">\u{1F4CA} \uB204\uC801 \uC804\uCCB4 \uC2E4\uC801</div>' +
        '<div style="display:flex;justify-content:space-around;text-align:center">' +
          '<div><div style="font-size:20px;font-weight:900;color:#6366f1">'+s.total_views.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">\uCD1D \uC870\uD68C\uC218</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#FF4D7D">'+s.total_sp.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">\uCD1D \uC608\uC57D\uD074\uB9AD</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#f59e0b">'+totalCtr+'%</div><div style="font-size:10px;color:#64748b;margin-top:2px">\uC804\uCCB4 CTR</div></div>' +
        '</div>' +
      '</div>' +
      // TOP 3
      await _shortsTop3Html();
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">\uC624\uB958: '+e.message+'</div>';
  }
}

async function _shortsTop3Html() {
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) return '';
    const top3 = items.slice(0,3);
    const rows = top3.map((it,i) => {
      const medals = ['\u{1F947}','\u{1F948}','\u{1F949}'];
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<div style="font-size:18px;flex-shrink:0">'+medals[i]+'</div>' +
        '<img src="https://img.youtube.com/vi/'+it.youtube_id+'/mqdefault.jpg" style="width:52px;height:34px;object-fit:cover;border-radius:6px;flex-shrink:0"/>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(it.name||'-')+'</div>' +
          '<div style="font-size:10px;color:#64748b">'+(it.category||'')+'</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:12px;font-weight:800;color:#6366f1">'+Number(it.total_views).toLocaleString()+'<span style="font-size:9px;color:#475569">\uD68C</span></div>' +
          '<div style="font-size:10px;color:#FF4D7D">CTR '+it.ctr+'%</div>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">\u{1F3C6} \uC870\uD68C\uC218 TOP 3</div>' +
      rows +
    '</div>';
  } catch(_) { return ''; }
}

// \u2500\u2500 \uD0ED2: \uC5C5\uCCB4\uBCC4 \uC2E4\uC801 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function renderShortsItems() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) {
      body.innerHTML = '<div style="padding:40px;text-align:center;color:#475569">\uB4F1\uB85D\uB41C \uC20F\uD3FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4</div>';
      return;
    }

    const maxViews = Math.max(...items.map(it=>Number(it.total_views)||0), 1);

    const cards = items.map(item => {
      const pct = Math.round((Number(item.total_views)||0) / maxViews * 100);
      const thumb = item.youtube_id
        ? '<img src="https://img.youtube.com/vi/'+item.youtube_id+'/mqdefault.jpg" style="width:72px;height:46px;object-fit:cover;border-radius:7px;flex-shrink:0"/>'
        : '<div style="width:72px;height:46px;background:rgba(255,255,255,.06);border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">\u{1F4ED}</div>';
      return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:8px">' +
        '<div style="display:flex;gap:10px;align-items:flex-start">' +
          thumb +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<div style="font-size:13px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+(item.name||'(\uC5C5\uCCB4\uBA85 \uC5C6\uC74C)')+'</div>' +
              '<span style="font-size:9px;padding:1px 5px;border-radius:5px;flex-shrink:0;background:'+(item.active?'rgba(52,211,153,.15)':'rgba(255,255,255,.06)')+';color:'+(item.active?'#34d399':'#64748b')+'">'+(item.active?'\uB178\uCD9C':'\uC228\uAE40')+'</span>' +
            '</div>' +
            '<div style="font-size:10px;color:#64748b;margin-bottom:6px">'+(item.category||'')+'</div>' +
            // \uC870\uD68C\uC218 \uBC14
            '<div style="background:rgba(255,255,255,.06);border-radius:4px;height:4px;margin-bottom:6px">' +
              '<div style="width:'+pct+'%;height:4px;border-radius:4px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#6366f1">'+Number(item.total_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">\uC804\uCCB4\uC870\uD68C</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#f59e0b">'+Number(item.week_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">7\uC77C\uC870\uD68C</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#FF4D7D">'+Number(item.total_sp).toLocaleString()+'</div><div style="font-size:9px;color:#475569">\uC608\uC57D\uD074\uB9AD</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#34d399">'+item.ctr+'%</div><div style="font-size:9px;color:#475569">CTR</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end">' +
          '<button onclick="showShortsItemDaily('+item.id+',&quot;'+((item.name||'').replace(/"/g,''))+'&quot;)" style="background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit"><i class="fas fa-chart-bar" style="margin-right:3px"></i>\uC77C\uBCC4</button>' +
          '<button onclick="openShortsModal('+item.id+')" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#f1f5f9;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">\uC218\uC815</button>' +
          '<button onclick="delShorts('+item.id+')" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">\uC0AD\uC81C</button>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML = '<div style="font-size:11px;color:#64748b;margin-bottom:10px">\uCD1D <b style="color:#e879f9">'+items.length+'</b>\uAC1C \xB7 \uC870\uD68C\uC218 \uB192\uC740 \uC21C</div>' + cards;
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">\uC624\uB958: '+e.message+'</div>';
  }
}

// \uD2B9\uC815 \uC5C5\uCCB4 \uC77C\uBCC4 \uD31D\uC5C5
async function showShortsItemDaily(id, name) {
  const data = await fetch('/api/admin/shorts/stats/item/'+id).then(r=>r.json());
  const body = document.getElementById('shorts-admin-body');

  if (!data.length) {
    alert(name+' - \uC544\uC9C1 \uC77C\uBCC4 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. (\uC624\uB298\uBD80\uD130 \uC870\uD68C\uC218\uAC00 \uC313\uC774\uBA74 \uD45C\uC2DC\uB429\uB2C8\uB2E4)');
    return;
  }

  // \uAC04\uB2E8\uD55C \uD14D\uC2A4\uD2B8 \uBC14 \uCC28\uD2B8 \uC624\uBC84\uB808\uC774
  const maxV = Math.max(...data.map(d=>Number(d.views)||0), 1);
  const rows = data.slice(-14).map(d => {  // \uCD5C\uADFC 14\uC77C
    const pct = Math.round((Number(d.views)||0) / maxV * 100);
    const dd  = d.date.slice(5);  // MM-DD
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
      '<div style="font-size:10px;color:#64748b;width:32px;flex-shrink:0">'+dd+'</div>' +
      '<div style="flex:1;background:rgba(255,255,255,.06);border-radius:3px;height:18px;position:relative">' +
        '<div style="width:'+pct+'%;height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
        '<span style="position:absolute;right:6px;top:2px;font-size:10px;color:#f1f5f9;font-weight:700">'+Number(d.views).toLocaleString()+'</span>' +
      '</div>' +
      '<div style="font-size:10px;color:#FF4D7D;width:28px;text-align:right;flex-shrink:0">'+Number(d.sp)+'\uD074</div>' +
    '</div>';
  }).join('');

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end';
  overlay.innerHTML =
    '<div style="background:#161616;border-radius:20px 20px 0 0;padding:20px;width:100%;max-height:80vh;overflow-y:auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div style="font-size:14px;font-weight:800;color:#f1f5f9">\u{1F4CA} '+name+' \xB7 \uCD5C\uADFC 14\uC77C</div>' +
        '<button id="shorts-daily-close-btn" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;padding:0 4px">\u2715</button>' +
      '</div>' +
      '<div style="font-size:10px;color:#64748b;margin-bottom:10px;display:flex;gap:14px">' +
        '<span><span style="color:#6366f1">\u25A0</span> \uC870\uD68C\uC218</span>' +
        '<span><span style="color:#FF4D7D">\u25A0</span> \uC608\uC57D\uD074\uB9AD</span>' +
      '</div>' +
      rows +
    '</div>';
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  const closeBtn = overlay.querySelector('#shorts-daily-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
}

// \u2500\u2500 \uD0ED3: \uC77C\uBCC4 \uCD94\uC774 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function renderShortsDaily() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const data = await fetch('/api/admin/shorts/stats/daily').then(r=>r.json());

    if (!data.length) {
      body.innerHTML =
        '<div style="text-align:center;padding:40px 20px;color:#475569">' +
          '<div style="font-size:32px;margin-bottom:10px">\u{1F4CA}</div>' +
          '<div style="font-size:13px">\uC544\uC9C1 \uC77C\uBCC4 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</div>' +
          '<div style="font-size:11px;color:#334155;margin-top:6px">\uC20F\uD3FC\uC774 \uC870\uD68C\uB418\uBA74 \uC790\uB3D9\uC73C\uB85C \uAE30\uB85D\uB429\uB2C8\uB2E4</div>' +
        '</div>';
      return;
    }

    const recent = data.slice(-30);
    const maxV = Math.max(...recent.map(d=>Number(d.views)||0), 1);
    const maxS = Math.max(...recent.map(d=>Number(d.sp)||0), 1);
    const totalV = recent.reduce((s,d)=>s+Number(d.views),0);
    const totalS = recent.reduce((s,d)=>s+Number(d.sp),0);

    // \uBC14 \uCC28\uD2B8 (\uC218\uD3C9)
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
      // \uC694\uC57D \uBC30\uC9C0
      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<div style="flex:1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#818cf8">'+totalV.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30\uC77C \uCD1D \uC870\uD68C</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(255,77,125,.1);border:1px solid rgba(255,77,125,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#FF4D7D">'+totalS.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30\uC77C \uC608\uC57D\uD074\uB9AD</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#f59e0b">'+(totalV>0?(totalS/totalV*100).toFixed(1):'0.0')+'%</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">\uD3C9\uADE0 CTR</div>' +
        '</div>' +
      '</div>' +
      // \uBC94\uB840
      '<div style="font-size:10px;color:#64748b;margin-bottom:8px;display:flex;gap:12px">' +
        '<span><span style="color:#818cf8">\u25A0</span> \uC870\uD68C\uC218 (\uC704)</span>' +
        '<span><span style="color:#FF4D7D">\u25A0</span> \uC608\uC57D\uD074\uB9AD (\uC544\uB798)</span>' +
      '</div>' +
      // \uCC28\uD2B8
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px">' +
        rows +
      '</div>';

  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">\uC624\uB958: '+e.message+'</div>';
  }
}

function renderShortsAdmin() { renderShortsAdminShell(); switchShortsAdminTab(_shortsAdminTab); }

// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
// \u{1F441}\uFE0F \uBC29\uBB38\uC790 \uD604\uD669 \uAD00\uB9AC\uC790 UI
// \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
let _visitorsRefreshTimer = null;

async function loadVisitors() {
  const p = document.getElementById('panel-visitors');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:13px">\uBD88\uB7EC\uC624\uB294 \uC911...</div>';
  clearInterval(_visitorsRefreshTimer);

  try {
    const [summary, sessions] = await Promise.all([
      fetch('/api/admin/sessions/summary').then(r => r.json()),
      fetch('/api/admin/sessions').then(r => r.json()),
    ]);
    renderVisitors(summary, sessions);

    // 30\uCD08\uB9C8\uB2E4 \uC790\uB3D9 \uC0C8\uB85C\uACE0\uCE68
    _visitorsRefreshTimer = setInterval(async () => {
      if (curTab !== 'visitors') { clearInterval(_visitorsRefreshTimer); return; }
      const [s2, ses2] = await Promise.all([
        fetch('/api/admin/sessions/summary').then(r => r.json()),
        fetch('/api/admin/sessions').then(r => r.json()),
      ]);
      renderVisitors(s2, ses2);
    }, 30000);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">\uC624\uB958: ' + e.message + '</div>';
  }
}

function renderVisitors(s, sessions) {
  const p = document.getElementById('panel-visitors');
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'\uCD08'; return Math.floor(sec/60)+'\uBD84 '+(sec%60)+'\uCD08'; };
  const tabLabel = (t) => ({'shorts':'\u26A1\uB9B4\uC2A4','feed':'\u{1F3AC}\uC601\uC0C1','map':'\u{1F5FA}\uFE0F\uC9C0\uB3C4','inquiry':'\u2709\uFE0F\uBB38\uC758'}[t] || t);

  const total    = sessions.length;
  const nowActive = sessions.filter(x => Date.now() - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const pct = (a,b) => b > 0 ? Math.round(a/b*100) : 0;

  // \u2500\u2500 \uBC30\uC9C0 \uD5EC\uD37C
  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 6px;border-radius:5px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count) > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','\u26A1'+n(sess.shorts_count)));
    if (n(sess.shorts_book)  > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','\uB9B4\uC2A4\uC608\uC57D'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt)> 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','\u{1F3AC}'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt)> 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','\uC601\uC0C1\uC608\uC57D'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','\u{1F4CD}'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','\uC9C0\uB3C4\uC608\uC57D'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)   > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','\u{1F50D}'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','\u2709\uFE0F'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:10px">\uC870\uC6A9\uD55C \uBC29\uBB38</span>';
  };

  // \u2500\u2500 \uC138\uC158 \uCE74\uB4DC
  const cards = sessions.map(sess => {
    const isNow  = Date.now() - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur    = fmtSec(sess.duration_sec);
    const device = sess.device === 'mobile' ? '\u{1F4F1}' : '\u{1F5A5}\uFE0F';
    const tabs   = (sess.tabs_visited||[]).map(tabLabel).join(' \u2192 ') || '\uC9C4\uC785\uB9CC';
    const sid    = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);
    const hasBook = n(sess.book_count) > 0 || n(sess.shorts_book) > 0 || n(sess.feed_book_cnt) > 0 || n(sess.map_book_cnt) > 0;

    return (
      '<div style="border:1px solid rgba(255,255,255,'+(isNow?'.18':'.06')+');border-radius:14px;margin-bottom:7px;overflow:hidden;background:rgba(255,255,255,.02)'+(hasBook?';border-color:rgba(255,77,125,.3)':'')+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.2)':'')+'">' +
        // \uCE74\uB4DC \uD5E4\uB354 \uD074\uB9AD \uC601\uC5ED
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:10px 12px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
            '<div style="display:flex;align-items:center;gap:6px">' +
              '<span style="font-size:13px">'+device+'</span>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:12px;font-weight:800;color:#f1f5f9">'+timeStr+'</span>' +
                  '<span style="font-size:10px;color:#475569">'+dateStr+'</span>' +
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 5px;border-radius:4px;font-weight:700;animation:pulse 2s infinite">\u25CF \uC811\uC18D\uC911</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-weight:700">\u{1F3AF}\uC608\uC57D</span>' : '') +
                '</div>' +
                '<div style="font-size:10px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:11px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:10px;color:'+(totalActs>0?'#818cf8':'#334155')+';background:rgba(99,102,241,.08);padding:1px 6px;border-radius:4px;margin-top:2px">'+totalActs+'\uD589\uB3D9 \u25BE</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        // \uD0C0\uC784\uB77C\uC778 (\uC228\uAE40)
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.25)">' +
          '<div style="font-size:10px;color:#475569">\uB85C\uB529 \uC911...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:40px;color:#334155;font-size:13px">\uBC29\uBB38\uC790 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</div>';

  p.innerHTML =
    '<div style="padding:14px">' +
      // \uD5E4\uB354
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">\u{1F441}\uFE0F \uBC29\uBB38\uC790 \uBAA9\uB85D</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">\u25CF \uC9C0\uAE08 '+nowActive+'\uBA85</span>' : '') +
          '<button onclick="loadVisitors()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
        '</div>' +
      '</div>' +
      // \uBBF8\uB2C8 KPI
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">' +
        '<div style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#818cf8">'+total+'</div><div style="font-size:9px;color:#64748b">\uC624\uB298\xB7\uC5B4\uC81C</div></div>' +
        '<div style="background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#34d399">'+nowActive+'</div><div style="font-size:9px;color:#64748b">\uC811\uC18D\uC911</div></div>' +
        '<div style="background:rgba(232,121,249,.08);border:1px solid rgba(232,121,249,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#e879f9">'+sessions.filter(x=>Number(x.shorts_count)>0||Number(x.feed_card_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">\uCF58\uD150\uCE20\uC2DC\uCCAD</div></div>' +
        '<div style="background:rgba(255,77,125,.08);border:1px solid rgba(255,77,125,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#FF4D7D">'+sessions.filter(x=>Number(x.book_count)>0||Number(x.shorts_book)>0||Number(x.feed_book_cnt)>0||Number(x.map_book_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">\uC608\uC57D\uD074\uB9AD</div></div>' +
      '</div>' +
      // \uC548\uB0B4
      '<div style="font-size:10px;color:#334155;text-align:right;margin-bottom:8px">\u25BE \uCE74\uB4DC \uD074\uB9AD \uC2DC \uC5C5\uCCB4\uBCC4 \uD589\uB3D9 \uD0C0\uC784\uB77C\uC778</div>' +
      cards +
    '</div>';
}
// \uC138\uC158 \uD0C0\uC784\uB77C\uC778 \uD3BC\uCE58\uAE30/\uC811\uAE30
const _tlOpen = {};
async function toggleSessTimeline(sid) {
  const tl = document.getElementById('tl-' + sid);
  if (!tl) return;
  const isOpen = _tlOpen[sid];
  _tlOpen[sid] = !isOpen;
  tl.style.display = isOpen ? 'none' : 'block';
  if (isOpen) return; // \uC811\uAE30\uB294 \uB05D

  // \uD0C0\uC784\uB77C\uC778 \uB85C\uB4DC
  tl.innerHTML = '<div style="font-size:10px;color:#475569;padding:4px 0">\uBD88\uB7EC\uC624\uB294 \uC911...</div>';
  try {
    const evts = await fetch('/api/admin/sessions/' + sid + '/events').then(r => r.json());
    if (!evts.length) {
      tl.innerHTML = '<div style="font-size:11px;color:#334155;padding:4px 0">\uAE30\uB85D\uB41C \uC5C5\uCCB4 \uD589\uB3D9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4</div>';
      return;
    }
    const evtIcon  = {shorts_view:'\u26A1',shorts_view_end:'\u23F1\uFE0F',shorts_book:'\u{1F3AF} ',feed_card:'\u{1F3AC}',feed_book:'\u{1F3AF} ',map_pin:'\u{1F4CD}',map_book:'\u{1F3AF} '};
    const evtLabel = {shorts_view:'\uB9B4\uC2A4 \uC2DC\uCCAD',shorts_view_end:'\uB9B4\uC2A4 \uC774\uD0C8',shorts_book:'\uB9B4\uC2A4 \uC608\uC57D\uD074\uB9AD',
                      feed_card:'\uC601\uC0C1 \uC5C5\uCCB4 \uC870\uD68C',feed_book:'\uC601\uC0C1 \uC608\uC57D\uD074\uB9AD',
                      map_pin:'\uC9C0\uB3C4 \uD540 \uC120\uD0DD',map_book:'\uC9C0\uB3C4 \uC608\uC57D\uD074\uB9AD'};
    const evtColor = {shorts_view:'#e879f9',shorts_view_end:'#a855f7',shorts_book:'#FF4D7D',
                      feed_card:'#818cf8',feed_book:'#FF4D7D',map_pin:'#34d399',map_book:'#FF4D7D'};
    const fmtSec = (s) => { s=Number(s)||0; if(!s) return ''; return s<60?s+'\uCD08':Math.floor(s/60)+'\uBD84'+(s%60)+'\uCD08'; };

    const rows = evts.map((e, i) => {
      const t    = new Date(e.occurred_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const icon = evtIcon[e.event_type] || '\u25CF';
      const lbl  = evtLabel[e.event_type] || e.event_type;
      const col  = evtColor[e.event_type] || '#64748b';
      const isBook = e.event_type.endsWith('_book');
      const secStr = e.viewed_sec > 0 ? ' <span style="color:#64748b;font-size:9px">('+fmtSec(e.viewed_sec)+')</span>' : '';
      return (
        '<div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)">' +
          // \uD0C0\uC784\uB77C\uC778 \uC120
          '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">' +
            '<div style="width:20px;height:20px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-size:9px">'+icon+'</div>' +
            (i < evts.length-1 ? '<div style="width:1px;background:rgba(255,255,255,.08);flex:1;min-height:6px"></div>' : '') +
          '</div>' +
          // \uB0B4\uC6A9
          '<div style="flex:1;padding-bottom:4px">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<span style="font-size:10px;font-weight:700;color:'+col+'">'+lbl+'</span>' +
              (isBook ? '<span style="font-size:8px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:0 4px;border-radius:3px">\uC608\uC57D</span>' : '') +
              secStr +
            '</div>' +
            (e.shop_name ? '<div style="font-size:11px;color:#f1f5f9;font-weight:600">'+e.shop_name+'</div>' : '') +
            (e.shop_cat  ? '<div style="font-size:10px;color:#475569">'+e.shop_cat+'</div>' : '') +
            '<div style="font-size:9px;color:#334155;margin-top:2px">'+t+'</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    tl.innerHTML = '<div style="font-size:10px;color:#475569;margin-bottom:6px">\uC5C5\uCCB4\uBCC4 \uD589\uB3D9 \uAE30\uB85D ('+evts.length+'\uAC74)</div>' + rows;
  } catch(e) {
    tl.innerHTML = '<div style="font-size:10px;color:#f87171">\uB85C\uB4DC \uC2E4\uD328: ' + e.message + '</div>';
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
      '<span style="position:absolute;left:8px;top:2px;font-size:11px;color:#fff;font-weight:700">' + count + '\uBA85</span>' +
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

  // \uC81C\uBAA9
  document.getElementById('shortsModalTitle').textContent = id ? '\uC20F\uD3FC \uC218\uC815' : '\uC20F\uD3FC \uCD94\uAC00';

  // \uAE30\uBCF8 \uD544\uB4DC
  (document.getElementById('s-name')).value = item?.name             || '';
  (document.getElementById('s-addr')).value = item?.address          || '';
  (document.getElementById('s-place')).value = item?.smart_place_url  || '';
  (document.getElementById('s-ytid')).value = item?.youtube_id       || '';
  (document.getElementById('s-order')).value = String(item?.sort_order ?? 0);
  (document.getElementById('s-active')).checked = item ? item.active : true;

  // \uCE74\uD14C\uACE0\uB9AC
  const sCat = document.getElementById('s-cat');
  sCat.innerHTML = '<option value="" style="background:#1b1b1b;color:#fff">\uC120\uD0DD \uC548\uD568</option>' +
    CAT_OPTIONS.map(c => '<option value="'+c+'" style="background:#1b1b1b;color:#fff"'+(item?.category===c?' selected':'')+'>'+c+'</option>').join('');

  // Cloudinary \uC601\uC0C1 \uC0C1\uD0DC \uCD08\uAE30\uD654
  const clId      = item?.cloudinary_public_id || '';
  const clPreview = document.getElementById('s-cl-preview');
  const clVid     = document.getElementById('s-cl-vid');
  const clIdInp   = document.getElementById('s-clid');
  const naverSt   = document.getElementById('s-naver-status');
  // \uC5C5\uB85C\uB4DC \uC0C1\uD0DC div \uD56D\uC0C1 \uCD08\uAE30\uD654 (\uC774\uC804 \uC5D0\uB7EC \uBA54\uC2DC\uC9C0 \uC81C\uAC70)
  const uploadSt  = document.getElementById('s-upload-status');
  if (uploadSt) { uploadSt.style.display = 'none'; uploadSt.textContent = ''; }
  // \uD30C\uC77C \uC120\uD0DD \uB77C\uBCA8 \uCD08\uAE30\uD654
  const vidLabel = document.getElementById('s-vid-label');
  if (vidLabel) vidLabel.innerHTML =
    '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
    '<span style="font-size:13px;font-weight:700;color:#e879f9">\uC601\uC0C1 \uD30C\uC77C \uC120\uD0DD</span>' +
    '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
    '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
  if (clId) {
    clIdInp.value = clId;
    clVid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4';
    const lbl = document.getElementById('s-cl-id-label');
    if (lbl) lbl.textContent = clId;
    if (clPreview) clPreview.style.display = 'block';
  } else {
    clIdInp.value = '';
    clVid.src = '';
    if (clPreview) clPreview.style.display = 'none';
  }
  if (naverSt) naverSt.style.display = 'none';

  // \uC218\uC815 \uC2DC \uCD94\uAC00\uC815\uBCF4 \uD3BC\uCE58\uAE30
  const details = document.getElementById('s-extra-details');
  if (details) details.open = !!id;

  document.getElementById('shortsModalBg').style.display = 'flex';
}

// \uB124\uC774\uBC84 \uB9C1\uD06C \uC785\uB825 \u2192 \uC5C5\uCCB4\uBA85/\uC8FC\uC18C \uC790\uB3D9\uCD94\uCD9C \uC2DC\uB3C4
let _naverFetchTimer;
function autoFetchNaverInfo(val) {
  clearTimeout(_naverFetchTimer);
  const st = document.getElementById('s-naver-status');
  if (!val.trim()) { if(st) st.style.display='none'; return; }
  if (st) { st.style.display='block'; st.style.color='#94a3b8'; st.textContent='\u{1F50D} \uC5C5\uCCB4 \uC815\uBCF4 \uC870\uD68C \uC911...'; }
  _naverFetchTimer = setTimeout(async () => {
    try {
      const r = await fetch('/api/admin/fetch-naver-info', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: val.trim() })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || '\uC870\uD68C \uC2E4\uD328');
      const nameEl = document.getElementById('s-name');
      const addrEl = document.getElementById('s-addr');
      if (d.name  && !nameEl.value) nameEl.value = d.name;
      if (d.address && !addrEl.value) addrEl.value = d.address;
      // \uCE74\uD14C\uACE0\uB9AC \uC790\uB3D9 \uB9E4\uD551
      if (d.category) {
        const sCat = document.getElementById('s-cat');
        const matched = CAT_OPTIONS.find(c => d.category.includes(c));
        if (matched && !sCat.value) sCat.value = matched;
      }
      if (st) { st.style.color='#22c55e'; st.textContent='\u2705 ' + (d.name||'') + (d.address?' \xB7 '+d.address:'') + ' \uC790\uB3D9 \uC785\uB825\uB428'; }
      // \uCD94\uAC00\uC815\uBCF4 \uC790\uB3D9 \uD3BC\uCE58\uAE30
      const details = document.getElementById('s-extra-details');
      if (details) details.open = true;
    } catch(e) {
      if (st) { st.style.color='#64748b'; st.textContent='\uC9C1\uC811 \uC785\uB825\uD558\uC138\uC694 (\uC790\uB3D9\uCD94\uCD9C \uBD88\uAC00)'; }
    }
  }, 800);
}

function closeShortsModal() {
  document.getElementById('shortsModalBg').style.display = 'none';
}

// \uC720\uD29C\uBE0C URL \u2192 \uC601\uC0C1 ID \uCD94\uCD9C (\uC815\uADDC\uC2DD \uC5C6\uC774 \uBB38\uC790\uC5F4 \uD30C\uC2F1)
function extractYtId(raw) {
  if (!raw) return '';
  raw = raw.trim();
  // shorts/XXXXXXXXXXX \uD615\uD0DC
  var si = raw.indexOf('shorts/');
  if (si !== -1) return raw.slice(si + 7, si + 18);
  // youtu.be/XXXXXXXXXXX \uD615\uD0DC
  var bi = raw.indexOf('youtu.be/');
  if (bi !== -1) return raw.slice(bi + 9, bi + 20).split('?')[0];
  // watch?v=XXXXXXXXXXX \uD615\uD0DC
  var vi = raw.indexOf('v=');
  if (vi !== -1) return raw.slice(vi + 2, vi + 13).split('&')[0];
  // embed/XXXXXXXXXXX \uD615\uD0DC
  var ei = raw.indexOf('embed/');
  if (ei !== -1) return raw.slice(ei + 6, ei + 17).split('?')[0];
  // 11\uC790\uB9AC ID\uB9CC \uC785\uB825\uD55C \uACBD\uC6B0
  if (raw.length === 11) return raw;
  return '';
}

// Cloudinary \uC5C5\uB85C\uB4DC \uD578\uB4E4\uB7EC
// \uD30C\uC77C \uC120\uD0DD \uC989\uC2DC \uC790\uB3D9 \uD638\uCD9C (file \uD30C\uB77C\uBBF8\uD130\uB85C \uBC1B\uC74C)
async function uploadShortsVideo(file) {
  if (!file) return;

  // UI \uC0C1\uD0DC: \uC5C5\uB85C\uB4DC \uC911
  const label  = document.getElementById('s-vid-label');
  const status = document.getElementById('s-upload-status');

  if (label) label.innerHTML =
    '<i class="fas fa-spinner fa-spin" style="font-size:20px;color:#e879f9"></i>' +
    '<span style="font-size:12px;font-weight:700;color:#e879f9">\uC5C5\uB85C\uB4DC \uC911...</span>' +
    '<span style="font-size:11px;color:#475569">' + file.name + '</span>' +
    '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
  if (status) { status.style.display = 'block'; status.style.color = '#94a3b8'; status.textContent = '\uC11C\uBC84\uC5D0\uC11C \uC11C\uBA85 \uBC1B\uB294 \uC911...'; }

  try {
    // 1) \uC11C\uBC84\uC5D0\uC11C \uC11C\uBA85\uB9CC \uBC1B\uAE30 (\uD30C\uC77C \uC804\uC1A1 \uC5C6\uC74C)
    const signRes = await fetch('/api/admin/cloudinary-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'mybeautymap/shorts' })
    });
    const signJson = await signRes.json();
    if (!signRes.ok || signJson.error) throw new Error(signJson.error || '\uC11C\uBA85 \uBC1C\uAE09 \uC2E4\uD328');
    const sign = signJson;

    if (status) status.textContent = 'Cloudinary \uC5C5\uB85C\uB4DC \uC911... (\uD30C\uC77C \uD06C\uAE30\uC5D0 \uB530\uB77C 30\uCD08~2\uBD84 \uC18C\uC694)';

    // 2) \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C Cloudinary\uB85C \uC9C1\uC811 \uC5C5\uB85C\uB4DC (multipart)
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sign.apiKey);
    fd.append('timestamp', sign.timestamp);
    fd.append('signature', sign.signature);
    fd.append('folder', sign.folder);
    fd.append('resource_type', 'video');

    const upRes = await fetch('https://api.cloudinary.com/v1_1/' + sign.cloudName + '/video/upload', {
      method: 'POST', body: fd
    });
    const json = await upRes.json();
    if (!upRes.ok || !json.public_id) throw new Error(json.error?.message || '\uC5C5\uB85C\uB4DC \uC2E4\uD328');

    // 3) \uC131\uACF5 UI
    const clIdInp = document.getElementById('s-clid');
    if (clIdInp) clIdInp.value = json.public_id;

    const clPreview = document.getElementById('s-cl-preview');
    const clVid     = document.getElementById('s-cl-vid');
    const lbl       = document.getElementById('s-cl-id-label');
    if (clPreview) clPreview.style.display = 'block';
    if (clVid)     clVid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + json.public_id + '.mp4';
    if (lbl)       lbl.textContent = json.public_id;
    if (status)    { status.style.color = '#22c55e'; status.textContent = '\u2705 \uC5C5\uB85C\uB4DC \uC644\uB8CC!'; }
    if (label) label.innerHTML =
      '<i class="fas fa-circle-check" style="font-size:20px;color:#22c55e"></i>' +
      '<span style="font-size:12px;font-weight:700;color:#22c55e">\uC5C5\uB85C\uB4DC \uC644\uB8CC</span>' +
      '<span style="font-size:11px;color:#475569">' + file.name + '</span>' +
      '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';

    toast('\u{1F3AC} \uC601\uC0C1 \uC5C5\uB85C\uB4DC \uC644\uB8CC! \uB4F1\uB85D\uD558\uAE30\uB97C \uB20C\uB7EC \uC800\uC7A5\uD558\uC138\uC694');
  } catch(e) {
    if (status) { status.style.color = '#ef4444'; status.textContent = '\u274C ' + e.message; }
    if (label) label.innerHTML =
      '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
      '<span style="font-size:13px;font-weight:700;color:#e879f9">\uB2E4\uC2DC \uC120\uD0DD</span>' +
      '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
      '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
    toast('\uC5C5\uB85C\uB4DC \uC2E4\uD328: ' + e.message);
  }
}

async function saveShorts() {
  const clId  = (document.getElementById('s-clid'))?.value.trim() || '';
  const rawYt = (document.getElementById('s-ytid'))?.value.trim() || '';
  const ytId  = extractYtId(rawYt) || rawYt;
  const place = (document.getElementById('s-place'))?.value.trim() || '';

  // \uC601\uC0C1(Cloudinary) \uB610\uB294 \uB124\uC774\uBC84\uB9C1\uD06C \uC911 \uD558\uB098\uB294 \uD544\uC218
  if (!clId && !ytId && !place) {
    toast('\uC601\uC0C1\uC744 \uC5C5\uB85C\uB4DC\uD558\uAC70\uB098 \uB124\uC774\uBC84 \uB9C1\uD06C\uB97C \uC785\uB825\uD558\uC138\uC694'); return;
  }

  // \uC5C5\uCCB4\uBA85: \uC790\uB3D9\uC785\uB825 \u2192 \uB124\uC774\uBC84\uB9C1\uD06C \uC788\uC73C\uBA74 \uC784\uC2DC\uBA85 \u2192 \uAE30\uBCF8\uAC12
  let name = (document.getElementById('s-name'))?.value.trim() || '';
  if (!name && place) name = '\uBBF8\uB4F1\uB85D\uC5C5\uCCB4';
  if (!name && clId)  name = '\uBBF8\uB4F1\uB85D\uC5C5\uCCB4';
  if (!name) name = '\uBBF8\uB4F1\uB85D\uC5C5\uCCB4'; // \uC5B4\uB5A4 \uACBD\uC6B0\uB3C4 \uD1B5\uACFC

  const body = {
    name,
    category:           (document.getElementById('s-cat'))?.value || '',
    address:            (document.getElementById('s-addr'))?.value.trim() || '',
    smartPlaceUrl:      place,
    cloudinaryPublicId: clId,
    youtubeId:          ytId,
    sortOrder:          parseInt((document.getElementById('s-order'))?.value) || 0,
    active:             (document.getElementById('s-active'))?.checked ?? true,
  };
  const url    = _shortsAdminEditId ? '/api/admin/shorts/'+_shortsAdminEditId : '/api/admin/shorts';
  const method = _shortsAdminEditId ? 'PUT' : 'POST';
  try {
    const r = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    if (r.ok) {
      closeShortsModal();
      toast(_shortsAdminEditId ? '\u2705 \uC218\uC815 \uC644\uB8CC!' : '\u{1F3AC} \uC20F\uD3FC \uB4F1\uB85D \uC644\uB8CC!');
      await loadShortsAdmin();
    } else {
      let errMsg = '\uC800\uC7A5 \uC2E4\uD328';
      try { const ej = await r.json(); errMsg = ej.error || ej.message || errMsg; } catch(_) {}
      toast('\u274C ' + errMsg);
    }
  } catch(e) {
    toast('\u274C \uB124\uD2B8\uC6CC\uD06C \uC624\uB958: ' + e.message);
  }
}

async function delShorts(id) {
  const found = _shortsAdminItems.find(x => x.id === id);
  const name = found ? found.name : '\uC774 \uC20F\uD3FC\uC744';
  if (!confirm(name+' \uC0AD\uC81C\uD560\uAE4C\uC694?')) return;
  const r = await fetch('/api/admin/shorts/'+id, {method:'DELETE'});
  if (r.ok) { toast('\uC0AD\uC81C \uC644\uB8CC'); await loadShortsAdmin(); }
  else toast('\uC0AD\uC81C \uC2E4\uD328');
}

// \u2500\u2500 \uC99D\uAC10 \uD5EC\uD37C
function deltaHtml(today, yest) {
  if (yest===0 && today===0) return '<span class="kpi-delta flat">\u2014</span>';
  if (yest===0 && today>0)   return '<span class="kpi-delta up">\u25B2 NEW</span>';
  const d = today-yest, p = Math.round(Math.abs(d)/yest*100);
  if (d>0) return '<span class="kpi-delta up">\u25B2 +' + d.toLocaleString() + ' (' + p + '%)</span>';
  if (d<0) return '<span class="kpi-delta down">\u25BC ' + d.toLocaleString() + ' (' + p + '%)</span>';
  return '<span class="kpi-delta flat">\u2014 \uB3D9\uC77C</span>';
}

// \u2500\u2500 \uB370\uC774\uD130 \uB85C\uB4DC
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

// \u2500\u2500 \uC2E0\uADDC: \uD1B5\uACC4 \uD0ED \uB85C\uB4DC (\uBC29\uBB38\uC790 \uC694\uC57D + \uC77C\uBCC4\uCD94\uC774 + \uAE30\uC874stats \uBCD1\uD569)
let _visitorSummary = null;
let _dailyTrend = [];
async function loadStats() {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> \uBD88\uB7EC\uC624\uB294 \uC911...</div>';
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
    p.innerHTML = '<div style="padding:20px;color:#f87171">\uB85C\uB4DC \uC2E4\uD328: '+e.message+'</div>';
  }
}
let _statsSessions = [];

// \u2500\u2500 \uC2E0\uADDC: \uC5C5\uCCB4 \uB7AD\uD0B9 \uD0ED \uB85C\uB4DC
let _rankingData = [];
let _rankingDays = 7;
async function loadRanking(days) {
  if (days) _rankingDays = days;
  const p = document.getElementById('panel-ranking');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> \uBD88\uB7EC\uC624\uB294 \uC911...</div>';
  try {
    const data = await fetch('/api/admin/shop-ranking?days='+_rankingDays).then(r=>r.json());
    _rankingData = Array.isArray(data) ? data : [];
    renderRankingTab(_rankingData);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">\uB85C\uB4DC \uC2E4\uD328: '+e.message+'</div>';
  }
}

// ======================================================
// \uD1B5\uACC4 \uD0ED \uB80C\uB354\uB9C1 (KPI + 1\uC778\uB2F9\uD3C9\uADE0 + \uD37C\uB110 + 7\uC77C\uCC28\uD2B8 + \uC138\uC158\uCE74\uB4DC \uD1B5\uD569)
// ======================================================
function renderStatsTab(s, trend, sessions) {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'\uCD08'; return Math.floor(sec/60)+'\uBD84 '+(sec%60)+'\uCD08'; };
  const pct = (a,b) => b>0 ? Math.round(a/b*100) : 0;
  const nowMs = Date.now();

  // \u2500\u2500 KPI 4\uCE78
  const total    = n(s.today_total);
  const nowActive = (sessions||[]).filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const kpiSection =
    '<div style="padding:14px 14px 0">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<div style="font-size:16px;font-weight:900;color:#f1f5f9">\u{1F4CA} \uC624\uB298 \uD1B5\uACC4</div>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">\u25CF \uC9C0\uAE08 '+nowActive+'\uBA85</span>' : '') +
        '<button onclick="loadStats()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">' +
      _kpiCard('fa-user-friends','\uC624\uB298 \uBC29\uBB38\uC790', n(s.today_total)+'\uBA85', '\uC5B4\uC81C '+n(s.yest_total)+'\uBA85 \xB7 7\uC77C '+n(s.week_total)+'\uBA85', '#6366f1') +
      _kpiCard('fa-clock','\uD3C9\uADE0 \uCCB4\uB958\uC2DC\uAC04', fmtSec(n(s.today_avg_sec)), '\uBAA8\uBC14\uC77C '+n(s.today_mobile)+' / PC '+n(s.today_desktop), '#f59e0b') +
      _kpiCard('fa-fire','\uC608\uC57D \uD074\uB9AD', n(s.today_booked)+'\uBA85', '\uB9B4\uC2A4 '+n(s.sum_shorts_book)+' \xB7 \uC601\uC0C1 '+n(s.sum_feed_book)+' \xB7 \uC9C0\uB3C4 '+n(s.sum_map_book), '#FF4D7D') +
      _kpiCard('fa-mobile-alt','\uBAA8\uBC14\uC77C \uBE44\uC728', total>0?Math.round(n(s.today_mobile)/total*100)+'%':'-', '\uCF58\uD150\uCE20\uC774\uC6A9 '+n(s.today_watched)+'\uBA85', '#e879f9') +
    '</div>' +
    '</div>';

  // \u2500\u2500 1\uC778\uB2F9 \uD3C9\uADE0 \uD589\uB3D9\uB7C9
  const avgSection =
    '<div style="margin:0 14px 10px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(168,85,247,.08));border:1px solid rgba(99,102,241,.25);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="fas fa-chart-bar"></i> 1\uC778\uB2F9 \uD3C9\uADE0 \uD589\uB3D9\uB7C9</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">' +
        _avgChip('\u26A1 \uB9B4\uC2A4', n(s.avg_shorts).toFixed(1)+'\uAC1C', n(s.today_watched)+'\uBA85 \uC774\uC6A9', '#e879f9') +
        _avgChip('\u{1F3AC} \uC601\uC0C1', n(s.avg_feed_card).toFixed(1)+'\uAC1C', n(s.used_feed)+'\uBA85 \uC774\uC6A9', '#818cf8') +
        _avgChip('\u{1F5FA}\uFE0F \uC9C0\uB3C4', n(s.avg_map_pin).toFixed(1)+'\uACF3', n(s.used_map)+'\uBA85 \uC774\uC6A9', '#34d399') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">' +
        _miniChip('\uB9B4\uC2A4\uC608\uC57D', n(s.sum_shorts_book)+'\uD68C', '#FF4D7D') +
        _miniChip('\uC601\uC0C1\uC608\uC57D', n(s.sum_feed_book)+'\uD68C', '#FF4D7D') +
        _miniChip('\uC9C0\uB3C4\uC608\uC57D', n(s.sum_map_book)+'\uD68C', '#FF4D7D') +
        _miniChip('\u{1F50D}\uAC80\uC0C9', n(s.sum_search)+'\uD68C', '#fbbf24') +
      '</div>' +
    '</div>';

  // \u2500\u2500 \uC804\uD658 \uD37C\uB110
  const watched = n(s.today_watched) + n(s.used_feed);
  const mapUsed = n(s.used_map);
  const booked  = n(s.today_booked);
  const funnelSection =
    '<div style="margin:0 14px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px"><i class="fas fa-filter" style="margin-right:5px"></i>\uC804\uD658 \uD37C\uB110</div>' +
      _funnelRow('\u{1F463} \uC9C4\uC785', total, 100, '#6366f1', '') +
      _funnelRow('\u{1F4F9} \uCF58\uD150\uCE20 \uC2DC\uCCAD', watched, pct(watched,total), '#e879f9', total>0?'\uC9C4\uC785\uC758 '+pct(watched,total)+'%':'') +
      _funnelRow('\u{1F5FA}\uFE0F \uC9C0\uB3C4 \uD0D0\uC0C9', mapUsed, pct(mapUsed,total), '#34d399', watched>0?'\uC2DC\uCCAD\uC758 '+pct(mapUsed,watched)+'%':'') +
      _funnelRow('\u{1F50D} \uAC80\uC0C9 \uC0AC\uC6A9', n(s.sum_search), pct(n(s.sum_search),total), '#fbbf24', '') +
      _funnelRow('\u{1F3AF} \uC608\uC57D \uD074\uB9AD', booked, pct(booked,total), '#FF4D7D', total>0?'\uC9C4\uC785\uC758 '+pct(booked,total)+'%':'') +
    '</div>';

  // \u2500\u2500 7\uC77C \uCD94\uC774 \uCC28\uD2B8
  const trendSection = _buildTrendChart(trend);

  // \u2500\u2500 \uBC29\uBB38\uC790 \uC138\uC158 \uCE74\uB4DC (\uD1B5\uD569)
  const sessSection = _buildSessionCards(sessions || [], s);

  p.innerHTML = kpiSection + avgSection + funnelSection + trendSection + sessSection;
}

// \u2500\u2500 \uC138\uC158 \uCE74\uB4DC \uBE4C\uB354 (\uD1B5\uACC4 \uD0ED \uD558\uB2E8 \uD1B5\uD569\uC6A9)
function _buildSessionCards(sessions, s) {
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'\uCD08'; return Math.floor(sec/60)+'\uBD84 '+(sec%60)+'\uCD08'; };
  const tabLabel = (t) => ({'shorts':'\u26A1\uB9B4\uC2A4','feed':'\u{1F3AC}\uC601\uC0C1','map':'\u{1F5FA}\uFE0F\uC9C0\uB3C4','inquiry':'\u2709\uFE0F\uBB38\uC758'}[t] || t);
  const nowMs = Date.now();
  const nowActive = sessions.filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;

  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count)  > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','\u26A1'+n(sess.shorts_count)));
    if (n(sess.shorts_book)   > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','\uB9B4\uC2A4\uC608\uC57D'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt) > 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','\u{1F3AC}'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','\uC601\uC0C1\uC608\uC57D'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','\u{1F4CD}'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt)  > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','\uC9C0\uB3C4\uC608\uC57D'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)    > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','\u{1F50D}'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','\u2709\uFE0F'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:9px">\uC870\uC6A9\uD55C \uBC29\uBB38</span>';
  };

  const cards = sessions.map(sess => {
    const isNow   = nowMs - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur     = fmtSec(sess.duration_sec);
    const device  = sess.device === 'mobile' ? '\u{1F4F1}' : '\u{1F5A5}\uFE0F';
    const tabs    = (sess.tabs_visited||[]).map(tabLabel).join(' \u2192 ') || '\uC9C4\uC785\uB9CC';
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
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 4px;border-radius:3px;font-weight:700">\u25CF \uC811\uC18D\uC911</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 4px;border-radius:3px;font-weight:700">\u{1F3AF}\uC608\uC57D</span>' : '') +
                '</div>' +
                '<div style="font-size:9px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;flex-shrink:0">' +
              '<div style="font-size:10px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:9px;color:'+(totalActs>0?'#818cf8':'#2d3748')+';background:rgba(99,102,241,.07);padding:1px 5px;border-radius:3px;margin-top:1px">'+totalActs+'\uD589\uB3D9 \u25BE</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.2)">' +
          '<div style="font-size:10px;color:#475569">\uB85C\uB529 \uC911...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:30px;color:#334155;font-size:12px">\uC624\uB298\xB7\uC5B4\uC81C \uBC29\uBB38\uC790 \uC5C6\uC74C</div>';

  return (
    '<div style="margin:0 14px 14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
        '<div style="font-size:12px;font-weight:800;color:#94a3b8">\u{1F441}\uFE0F \uBC29\uBB38\uC790 \uBAA9\uB85D <span style="font-size:10px;font-weight:500;color:#475569">(\uC624\uB298\xB7\uC5B4\uC81C \uCD5C\uB300 200\uBA85)</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.12);color:#34d399;padding:2px 7px;border-radius:10px;font-weight:700">\u25CF '+nowActive+'\uBA85 \uC811\uC18D\uC911</span>' : '') +
          '<span style="font-size:9px;color:#334155">\u25BE\uD074\uB9AD \uC2DC \uD0C0\uC784\uB77C\uC778</span>' +
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
        '<span style="font-size:12px;font-weight:700;color:'+color+'">'+count+'\uBA85 <span style="font-size:10px;font-weight:500;color:#64748b">'+pctVal+'%</span></span>' +
      '</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,.06);border-radius:6px;height:8px;overflow:hidden">' +
      '<div style="width:'+pctVal+'%;height:100%;background:'+color+';border-radius:6px;transition:width .5s"></div>' +
    '</div>' +
  '</div>';
}

function _buildTrendChart(trend) {
  if (!trend || !trend.length) return '<div style="margin:0 14px 10px;padding:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;text-align:center;color:#334155;font-size:12px">7\uC77C \uCD94\uC774 \uB370\uC774\uD130 \uC5C6\uC74C</div>';
  const maxVal = Math.max(...trend.map(r => r.total), 1);
  const days = ['\uC77C','\uC6D4','\uD654','\uC218','\uBAA9','\uAE08','\uD1A0'];
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
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#6366f1;border-radius:2px"></div><span style="font-size:9px;color:#64748b">\uBC29\uBB38</span></div>' +
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:rgba(255,77,125,.7);border-radius:2px"></div><span style="font-size:9px;color:#64748b">\uC608\uC57D\uD074\uB9AD</span></div>' +
    '</div>';
  return '<div style="margin:0 14px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
    '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px"><i class="fas fa-chart-bar" style="margin-right:5px"></i>7\uC77C \uBC29\uBB38 \uCD94\uC774</div>' +
    legend +
    '<div style="display:flex;align-items:flex-end;gap:4px;height:96px">'+bars+'</div>' +
  '</div>';
}

// ======================================================
// \uC5C5\uCCB4 \uB7AD\uD0B9 \uD0ED \uB80C\uB354\uB9C1
// ======================================================
function renderRankingTab(data) {
  const p = document.getElementById('panel-ranking');
  if (!p) return;

  const fmtSec = (s) => { s=Number(s)||0; if(!s) return '-'; if(s<60) return s+'\uCD08'; return Math.floor(s/60)+'\uBD84'+(s%60?+(s%60)+'\uCD08':''); };
  const dayBtns =
    '<div style="display:flex;gap:6px;margin-bottom:12px">' +
      [['7\uC77C','7'],['30\uC77C','30'],['\uC804\uCCB4','365']].map(([label,d]) =>
        '<button onclick="loadRanking('+d+')" style="flex:1;padding:7px;border:1px solid rgba(255,255,255,'+(String(_rankingDays)===d?'.3':'.08')+');border-radius:8px;background:rgba(255,255,255,'+(String(_rankingDays)===d?'.1':'.03')+');color:'+(String(_rankingDays)===d?'#f1f5f9':'#64748b')+';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">'+label+'</button>'
      ).join('') +
    '</div>';

  if (!data.length) {
    p.innerHTML = '<div style="padding:14px">'+dayBtns+'<div style="padding:40px;text-align:center;color:#334155;font-size:13px">\uC5C5\uCCB4 \uD589\uB3D9 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4<br><span style="font-size:11px;color:#475569">\uBC29\uBB38\uC790\uAC00 \uC5C5\uCCB4\uB97C \uC870\uD68C\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4</span></div></div>';
    return;
  }

  // \uC0C1\uC704 3\uAC1C \uD558\uC774\uB77C\uC774\uD2B8
  const top3 = data.slice(0,3);
  const medals = ['\u{1F947}','\u{1F948}','\u{1F949}'];
  const top3Html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">' +
    top3.map((shop, i) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,'+(i===0?'.2':'.08')+');border-radius:14px;padding:12px;text-align:center'+(i===0?';box-shadow:0 0 0 1px rgba(251,191,36,.2)':'')+'">' +
        '<div style="font-size:18px">'+medals[i]+'</div>' +
        '<div style="font-size:11px;font-weight:800;color:#f1f5f9;margin:4px 0;line-height:1.3">'+shop.shop_name+'</div>' +
        '<div style="font-size:9px;color:#64748b;margin-bottom:5px">'+shop.shop_cat+'</div>' +
        '<div style="font-size:16px;font-weight:900;color:#e879f9">'+shop.view_cnt+'</div>' +
        '<div style="font-size:9px;color:#64748b">\uCD1D \uC870\uD68C</div>' +
        '<div style="margin-top:5px;font-size:10px;color:#FF4D7D;font-weight:700">'+(shop.book_cnt>0?'\u{1F3AF} \uC608\uC57D'+shop.book_cnt+'\uD68C':'')+'</div>' +
      '</div>'
    ).join('') +
  '</div>';

  // \uC804\uCCB4 \uC21C\uC704 \uD14C\uC774\uBE14
  const maxView = Math.max(...data.map(r => r.view_cnt), 1);
  const rows = data.map((shop, i) => {
    const convRate = shop.uniq_sessions > 0 ? Math.round(shop.book_cnt/shop.uniq_sessions*100) : 0;
    const barW = Math.round(shop.view_cnt/maxView*100);
    const catColors = {'\uB9C8\uC0AC\uC9C0':'#e879f9','\uD5E4\uB4DC\uC2A4\uD30C':'#818cf8','\uD53C\uBD80\uAD00\uB9AC':'#34d399','\uD5E4\uC5B4':'#fbbf24','\uBA54\uC774\uD06C\uC5C5':'#f87171','\uC641\uC2F1':'#fb923c','\uBC18\uC601\uAD6C':'#a78bfa','\uBCD1\uC6D0':'#38bdf8','\uADF8\uC678':'#64748b'};
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
          '<div style="font-size:9px;color:#475569">\uC870\uD68C</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;padding-left:26px">' +
        '<span style="font-size:10px;background:rgba(232,121,249,.1);color:#e879f9;padding:1px 6px;border-radius:4px">\u26A1\uB9B4\uC2A4 '+shop.shorts_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(99,102,241,.1);color:#818cf8;padding:1px 6px;border-radius:4px">\u{1F3AC}\uC601\uC0C1 '+shop.feed_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(52,211,153,.1);color:#34d399;padding:1px 6px;border-radius:4px">\u{1F4CD}\uC9C0\uB3C4 '+shop.map_cnt+'</span>' +
        (shop.book_cnt>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.15);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:700">\u{1F3AF}\uC608\uC57D '+shop.book_cnt+'\uD68C</span>' : '') +
        '<span style="font-size:10px;background:rgba(255,255,255,.05);color:#64748b;padding:1px 6px;border-radius:4px">\u{1F465}'+shop.uniq_sessions+'\uBA85</span>' +
        (shop.total_view_sec>0 ? '<span style="font-size:10px;background:rgba(251,191,36,.1);color:#fbbf24;padding:1px 6px;border-radius:4px">\u23F1'+fmtSec(shop.total_view_sec)+'</span>' : '') +
        (convRate>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:800">\uC804\uD658 '+convRate+'%</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  p.innerHTML =
    '<div style="padding:14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">\u{1F3C6} \uC5C5\uCCB4 \uC778\uAE30 \uC21C\uC704</div>' +
        '<button onclick="loadRanking()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
      dayBtns +
      (data.length >= 3 ? top3Html : '') +
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">\uC804\uCCB4 \uC21C\uC704 ('+data.length+'\uAC1C \uC5C5\uCCB4)</div>' +
        rows +
      '</div>' +
    '</div>';
}

// ======================================================
// \uB300\uC2DC\uBCF4\uB4DC \uD0ED (\uAE30\uC874 \uC720\uC9C0 \u2014 loadAll\uC5D0\uC11C \uD638\uCD9C)
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

  // 1) \uC624\uB298 KPI
  const kpi =
    '<div class="section-title">\u{1F4C5} \uC624\uB298 \uD604\uD669 <span style="font-size:10px;font-weight:500;color:var(--t3);margin-left:4px">' + todayLabel + '</span></div>' +
    '<div class="kpi-grid" style="grid-template-columns:repeat(2,1fr)">' +
      '<div class="kpi-card kpi-visit"><div class="kpi-icon">\u{1F64B}</div><div class="kpi-val">' + todayVisit.toLocaleString() + '</div><div class="kpi-lbl">\uBC29\uBB38\uC790</div>' + deltaHtml(todayVisit,yestVisit) + '</div>' +
      '<div class="kpi-card kpi-view"><div class="kpi-icon">\u{1F441}</div><div class="kpi-val">' + tV.toLocaleString() + '</div><div class="kpi-lbl">\uC601\uC0C1 \uC870\uD68C</div>' + deltaHtml(tV,yV) + '</div>' +
      '<div class="kpi-card kpi-feed"><div class="kpi-icon">\u{1F4F9}</div><div class="kpi-val">' + tF.toLocaleString() + '</div><div class="kpi-lbl">\uD53C\uB4DC \uD074\uB9AD</div>' + deltaHtml(tF,yF) + '</div>' +
      '<div class="kpi-card kpi-map"><div class="kpi-icon">\u{1F5FA}\uFE0F</div><div class="kpi-val">' + tM.toLocaleString() + '</div><div class="kpi-lbl">\uC9C0\uB3C4 \uD074\uB9AD</div>' + deltaHtml(tM,yM) + '</div>' +
    '</div>' +
    // \u2B50 \uCD94\uCC9C\uD0ED \uC870\uD68C \uBCC4\uB3C4 \uAC15\uC870 \uBC30\uB108
    (tR > 0 || yR > 0
      ? '<div style="margin-top:10px;padding:12px 16px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);border-radius:12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div><span style="font-size:18px">\u2B50</span> <strong style="color:#fbbf24;font-size:15px">' + tR.toLocaleString() + '</strong> <span style="font-size:12px;color:#94a3b8">\uCD94\uCC9C\uD0ED \uC870\uD68C (\uC624\uB298)</span></div>' +
          deltaHtml(tR, yR) +
        '</div>'
      : '<div style="margin-top:10px;padding:10px 16px;background:rgba(251,191,36,.05);border:1px dashed rgba(251,191,36,.2);border-radius:12px;font-size:12px;color:#64748b;text-align:center">\u2B50 \uCD94\uCC9C\uD0ED \uC870\uD68C \uB370\uC774\uD130 \uC5C6\uC74C (\uC624\uB298)</div>'
    );

  // 2) \uB204\uC801 \uC694\uC57D
  const totalClicks = (d.totalFeedSP||0)+(d.totalMapSP||0);
  const accum =
    '<div class="section-title">\u{1F4CA} \uB204\uC801 \uD569\uACC4</div>' +
    '<div class="summary-bar">' +
      '<div class="sb-item"><div class="sb-val" style="color:#FF8FA3">' + (d.totalViews||0).toLocaleString() + '</div><div class="sb-lbl">\uCD1D \uC601\uC0C1\uC870\uD68C</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:var(--green)">' + totalClicks.toLocaleString() + '</div><div class="sb-lbl">\uCD1D \uC608\uC57D\uD074\uB9AD</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:#a78bfa">' + (d.totalShops||0) + '</div><div class="sb-lbl">\uB4F1\uB85D \uC5C5\uCCB4</div></div>' +
    '</div>';

  // 3) \uD22C\uC790\uC790 \uC9C0\uD45C
  const invest = buildInvestMetrics(d, dv);

  // 4) 14\uC77C \uCC28\uD2B8
  const chart = buildChart14(_chartMode);

  // 5) \uC5C5\uCCB4\uBCC4 \uC804\uD658\uC728 \uC778\uC0AC\uC774\uD2B8
  const shopInsight = buildShopInsight();

  // 6) \uC624\uB298 \uC5C5\uCCB4 \uB7AD\uD0B9
  const rank = buildRank(_rankMode);

  // 7) \uCD94\uCC9C\uD0ED \uC870\uD68C \uB7AD\uD0B9 (7\uC77C)
  const recRank = buildRecRank();

  p.innerHTML = kpi + accum + invest + chart + shopInsight + rank + recRank;
}

// \u2500\u2500 \uCD94\uCC9C\uD0ED \uC804\uCCB4 \uD604\uD669 \uC139\uC158
function buildRecRank() {
  const all  = shopData || [];
  const recOn = all.filter(s => s.isRecommended);
  // \uC804\uCCB4 7\uC77C/\uC624\uB298 \uD569\uACC4
  const totalWeek  = recOn.reduce((a,s) => a + (s.weekRecView||0), 0);
  const totalToday = recOn.reduce((a,s) => a + (s.todayRecView||0), 0);
  // 14\uC77C \uCC28\uD2B8 (weekChart\uC5D0\uC11C recView \uCD94\uCD9C)
  const chart = (_stats && _stats.weekChart) ? _stats.weekChart : [];

  // \uD5E4\uB354 KPI
  const header =
    '<div class="section-title" style="margin-top:20px">\u2B50 \uCD94\uCC9C\uD0ED \uD604\uD669</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + recOn.length + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">\uB178\uCD9C \uC5C5\uCCB4 \uC218</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + (totalWeek > 0 ? totalWeek.toLocaleString() : '\u2014') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">7\uC77C \uC804\uCCB4 \uC870\uD68C</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#f59e0b">' + (totalToday > 0 ? '+'+totalToday : '\u2014') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">\uC624\uB298 \uC870\uD68C</div>' +
      '</div>' +
    '</div>';

  // 14\uC77C \uCD94\uC774 \uBBF8\uB2C8 \uBC14 \uCC28\uD2B8
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
        '<div style="font-size:10px;color:#92400e;font-weight:700;margin-bottom:8px">\u{1F4C8} \uCD94\uCC9C\uD0ED \uC77C\uBCC4 \uC870\uD68C \uCD94\uC774 (14\uC77C)</div>' +
        '<div style="display:flex;gap:2px;align-items:flex-end">' + bars + '</div>' +
      '</div>';
  }

  // \uC5C5\uCCB4\uBCC4 \uB7AD\uD0B9
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
      const medal = i===0?'\u{1F947}':i===1?'\u{1F948}':i===2?'\u{1F949}':(i+1)+'\uC704';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<span style="font-size:12px;min-width:26px;text-align:center">' + medal + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:600;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + s.name + '</div>' +
          '<div style="height:3px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:5px">' +
            '<div style="height:3px;border-radius:2px;background:linear-gradient(90deg,#f59e0b,#fbbf24);width:' + bar + '%"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;min-width:80px">' +
          '<div style="font-size:13px;font-weight:700;color:#fbbf24">' + w.toLocaleString() + ' <span style="font-size:9px;color:#92400e">7\uC77C</span></div>' +
          (t > 0
            ? '<div style="font-size:10px;color:#f59e0b;font-weight:600">\uC624\uB298 +' + t + '</div>'
            : '<div style="font-size:10px;color:#374151">\uC624\uB298 \u2014</div>') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // \uB370\uC774\uD130 \uC5C6\uB294 \uCD94\uCC9C \uC5C5\uCCB4 (\uC870\uD68C 0)
  let noDataHtml = '';
  if (noData.length > 0) {
    noDataHtml =
      '<div style="margin-top:8px;padding:8px 12px;background:rgba(255,255,255,.02);border-radius:8px">' +
        '<div style="font-size:10px;color:#475569;margin-bottom:4px">\uC870\uD68C 0 (\uB178\uCD9C \uC911)</div>' +
        '<div style="font-size:11px;color:#64748b">' + noData.map(s=>s.name).join(' \xB7 ') + '</div>' +
      '</div>';
  }

  const body = list.length > 0
    ? '<div style="background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.15);border-radius:12px;padding:12px 16px">' + rankHtml + noDataHtml + '</div>'
    : '<div style="padding:16px;text-align:center;font-size:12px;color:#475569;background:rgba(251,191,36,.03);border:1px dashed rgba(251,191,36,.15);border-radius:12px">\uC544\uC9C1 \uCD94\uCC9C\uD0ED \uC870\uD68C \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</div>';

  return header + chartHtml + body;
}

// \u2500\u2500 \uD22C\uC790\uC790 \uC9C0\uD45C \uC139\uC158
function buildInvestMetrics(d, dv) {
  const list = shopData || [];

  // \u2460 \uC804\uD658\uC728 (\uB204\uC801 view \u2192 feed\uD074\uB9AD)
  const totalV = d.totalViews  || 0;
  const totalF = d.totalFeedSP || 0;
  const totalM = d.totalMapSP  || 0;
  const cvr    = totalV ? ((totalF / totalV) * 100) : 0;
  const cvrStr = cvr.toFixed(1) + '%';
  const cvrW   = Math.min(cvr * 5, 100).toFixed(1); // \uAC8C\uC774\uC9C0 (20%=\uD480)
  const cvrComment = cvr >= 5 ? '\uC6B0\uC218' : cvr >= 2 ? '\uBCF4\uD1B5' : '\uAC1C\uC120 \uD544\uC694';
  const cvrColor   = cvr >= 5 ? '#34d399' : cvr >= 2 ? '#f59e0b' : '#f87171';

  // \u2461 \uC8FC\uAC04 \uC131\uC7A5\uB960 (\uC5B4\uC81C \uAE30\uC900 7\uC77C \uC804 \uB300\uBE44)
  const chart = d.weekChart || [];
  const chartMap = {};
  chart.forEach(r => { chartMap[r.date] = r.views || 0; });
  const todayKST = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  // \uCD5C\uADFC 3\uC77C \uD569\uACC4 vs \uADF8 \uC774\uC804 3\uC77C
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
  const growthComment = growthPct >= 10 ? '\uC131\uC7A5 \uC911 \u{1F680}' : growthPct >= 0 ? '\uC720\uC9C0 \uC911 \u2192' : '\uAC10\uC18C \uC911 \u26A0\uFE0F';

  // \u2462 DAU/MAU (\uBC29\uBB38\uC790 \uAE30\uC900)
  const dvRows = Array.isArray(dv) ? dv : [];
  const mau30  = dvRows.slice(0, 30).reduce((s, r) => s + (parseInt(r.visit_cnt)||0), 0);
  const dau    = dvRows[0] ? (parseInt(dvRows[0].visit_cnt)||0) : 0; // \uC5B4\uC81C(\uCD5C\uADFC \uC644\uC131\uC77C)
  const dauMau = mau30 > 0 ? ((dau / (mau30 / 30)) * 100).toFixed(0) : '\u2014';
  const dauMauComment = mau30 > 0 ? '\uC77C\uD3C9\uADE0 ' + Math.round(mau30/Math.min(dvRows.length,30)).toLocaleString() + '\uBA85' : '\uB370\uC774\uD130 \uB204\uC801 \uC911';

  // \u2463 \uC218\uC775\uD654 \uD604\uD669
  const paid    = list.filter(s => s.paymentStatus === 'paid').length;
  const free    = list.filter(s => s.paymentStatus === 'free').length;
  const total   = list.length;
  const payRate = total > 0 ? ((paid / total) * 100).toFixed(0) : 0;
  const payComment = paid > 0 ? paid + '\uAC1C \uACB0\uC81C \xB7 ' + free + '\uAC1C \uBB34\uB8CC' : '\uBB34\uB8CC ' + free + '\uAC1C \xB7 \uBBF8\uACB0\uC81C ' + (total-free) + '\uAC1C';

  // \u2500\u2500 \uB80C\uB354\uB9C1
  const insightCards =
    '<div class="insight-grid">' +
      // \uC804\uD658\uC728
      '<div class="insight-card ic-cvr">' +
        '<div class="insight-icon">\u{1F3AF}</div>' +
        '<div class="insight-val">' + cvrStr + '</div>' +
        '<div class="insight-lbl">\uC608\uC57D \uC804\uD658\uC728</div>' +
        '<div class="cvr-gauge"><div class="cvr-gauge-fill" style="width:' + cvrW + '%"></div></div>' +
        '<div class="insight-sub" style="margin-top:5px">view\u2192\uD53C\uB4DC\uD074\uB9AD <b style="color:' + cvrColor + '">' + cvrComment + '</b><br>' +
          '\uC870\uD68C ' + totalV.toLocaleString() + ' \u2192 \uD074\uB9AD ' + totalF.toLocaleString() + '</div>' +
      '</div>' +
      // \uC131\uC7A5\uB960
      '<div class="insight-card ic-growth">' +
        '<div class="insight-icon">\u{1F4C8}</div>' +
        '<div class="insight-val" style="color:' + growthColor + '">' + growthStr + '</div>' +
        '<div class="insight-lbl">\uC8FC\uAC04 \uC131\uC7A5\uB960</div>' +
        '<div class="insight-sub">\uCD5C\uADFC 3\uC77C vs \uC774\uC804 3\uC77C<br>' +
          '<b>' + recent3.toLocaleString() + '</b> vs <b>' + prev3.toLocaleString() + '</b> \uC601\uC0C1\uC870\uD68C<br>' +
          '<b style="color:' + growthColor + '">' + growthComment + '</b></div>' +
      '</div>' +
      // DAU/MAU
      '<div class="insight-card ic-daumau">' +
        '<div class="insight-icon">\u{1F501}</div>' +
        '<div class="insight-val">' + dauMau + (mau30 > 0 ? '%' : '') + '</div>' +
        '<div class="insight-lbl">\uC7AC\uBC29\uBB38 \uC9C0\uC218</div>' +
        '<div class="insight-sub">\uC77C\uBC29\uBB38 / \uC6D4\uD3C9\uADE0 \uBE44\uC728<br>' + dauMauComment + '<br>' +
          '<b style="color:var(--t3)">\uB192\uC744\uC218\uB85D \uC2B5\uAD00\uC131 \uC571</b></div>' +
      '</div>' +
      // \uC218\uC775\uD654
      '<div class="insight-card ic-pay">' +
        '<div class="insight-icon">\u{1F4B0}</div>' +
        '<div class="insight-val">' + payRate + '%</div>' +
        '<div class="insight-lbl">\uC720\uB8CC \uC804\uD658\uC728</div>' +
        '<div class="insight-sub">\uC804\uCCB4 ' + total + '\uAC1C \uC5C5\uCCB4 \uC911<br>' + payComment + '<br>' +
          (paid > 0 ? '<b style="color:#a78bfa">\uC218\uC775\uD654 \uC9C4\uD589 \uC911</b>' : '<b style="color:var(--t3)">\uC218\uC775\uD654 \uC900\uBE44 \uB2E8\uACC4</b>') + '</div>' +
      '</div>' +
    '</div>';

  // \u2500\u2500 \uC218\uC775\uD654 \uD37C\uB110 (\uBC29\uBB38\u2192\uC870\uD68C\u2192\uD074\uB9AD \uB4DC\uB86D\uC624\uD504)
  const maxFunnel = Math.max(mau30 || dau || 1, totalV || 1);
  const funnelVisit = mau30 || dau;
  const funnelView  = totalV;
  const funnelFeed  = totalF;
  const funnelMap   = totalM;
  const fw = (n) => Math.max((n / (maxFunnel || 1) * 100), n > 0 ? 2 : 0).toFixed(1);
  const drop1 = funnelVisit > 0 ? ((funnelView / funnelVisit)*100).toFixed(0) + '% \uC9C4\uC785' : '\u2014';
  const drop2 = funnelView  > 0 ? ((funnelFeed / funnelView)*100).toFixed(1) + '% \uC804\uD658' : '\u2014';

  const funnel =
    '<div class="section-title">\u{1F53D} \uC0AC\uC6A9\uC790 \uD37C\uB110</div>' +
    '<div class="funnel-bar">' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">\uBC29\uBB38\uC790</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-visit" style="width:100%"></div></div>' +
        '<div class="funnel-num">' + (funnelVisit||0).toLocaleString() + '</div>' +
        '<div class="funnel-pct">100%</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">\uC601\uC0C1\uC870\uD68C</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-view" style="width:' + fw(funnelView) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelView.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#f59e0b">' + drop1 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">\uD53C\uB4DC\uD074\uB9AD</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-feed" style="width:' + fw(funnelFeed) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelFeed.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#34d399">' + drop2 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">\uC9C0\uB3C4\uD074\uB9AD</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-map" style="width:' + fw(funnelMap) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelMap.toLocaleString() + '</div>' +
        '<div class="funnel-pct">' + (funnelView > 0 ? ((funnelMap/funnelView)*100).toFixed(1)+'%' : '\u2014') + '</div>' +
      '</div>' +
    '</div>';

  return '<div class="section-title">\u{1F4A1} \uD575\uC2EC \uC9C0\uD45C</div>' + insightCards + funnel;
}

// \u2500\u2500 \uC5C5\uCCB4\uBCC4 \uC804\uD658\uC728 \uC778\uC0AC\uC774\uD2B8
function buildShopInsight() {
  const list = shopData || [];
  if (!list.length) return '';

  // \uC804\uD658\uC728 \uACC4\uC0B0 (view\u2192feed, \uC870\uD68C 50 \uC774\uC0C1\uB9CC)
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
      '<div class="si-rank" style="color:' + (isAlert ? '#f87171' : '#34d399') + '">' + (isAlert ? '\u26A0' : '\u2713') + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="si-name">' + s.name + '</div>' +
        '<div class="si-cat">' + s.category + ' \xB7 \uC870\uD68C ' + (s.views||0).toLocaleString() + '</div>' +
      '</div>' +
      '<div class="si-right">' +
        '<div class="si-cvr ' + cls + '">' + cvrN.toFixed(1) + '%</div>' +
        '<div class="si-sub">\uC804\uD658\uC728</div>' +
      '</div>' +
    '</div>';
  };

  return '<div class="section-title">\u{1F52C} \uC5C5\uCCB4\uBCC4 \uC804\uD658\uC728</div>' +
    '<div style="display:flex;gap:6px;margin-bottom:8px">' +
      '<button class="rank-tab' + (_insightMode==='top'?' on':'') + '" data-m="top" onclick="switchInsight(this.dataset.m)">\u{1F3C6} \uC804\uD658\uC728 TOP</button>' +
      '<button class="rank-tab' + (_insightMode==='bot'?' on':'') + '" data-m="bot" onclick="switchInsight(this.dataset.m)">\u26A0\uFE0F \uAC1C\uC120 \uD544\uC694</button>' +
    '</div>' +
    '<div class="shop-insight-list">' +
    (_insightMode === 'top' ? top3 : bot3).map((s,i) => renderRow(s, i, _insightMode==='bot')).join('') +
    '</div>';
}

// \u2500\u2500 14\uC77C \uCC28\uD2B8 \uBE4C\uB4DC
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
    counts=days.map(d=>m[d]||0); barClass='bar-view'; chartLabel='\u{1F441} \uC601\uC0C1\uC870\uD68C';
  } else if (mode==='feed') {
    const m={}; chart.forEach(r=>{m[r.date]=r.feedSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-feed'; chartLabel='\u{1F4F9} \uD53C\uB4DC\uD074\uB9AD';
  } else if (mode==='map') {
    const m={}; chart.forEach(r=>{m[r.date]=r.mapSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-map'; chartLabel='\u{1F5FA}\uFE0F \uC9C0\uB3C4\uD074\uB9AD';
  } else {
    const m={}; dv.forEach(r=>{m[r.visit_date]=parseInt(r.visit_cnt)||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-visit'; chartLabel='\u{1F64B} \uBC29\uBB38\uC790';
  }

  const maxV = Math.max(...counts,1);
  const total = counts.reduce((a,b)=>a+b,0);
  const empty = counts.every(c=>c===0);

  const tabOn = {view:'on-v', feed:'on-f', map:'on-m', visit:'on-a'};

  const barsHtml = empty ? '<div class="chart-empty">\uB370\uC774\uD130\uAC00 \uC313\uC774\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694</div>' :
    '<div class="chart-body">' +
    days.map((d,i)=>{
      const c=counts[i], h=Math.max(Math.round((c/maxV)*72),c>0?4:2);
      const isT=d===todayStr;
      return '<div class="bar-col">' +
        '<div class="bar-cnt">'+(c>0?c:'')+'</div>' +
        '<div class="bar-fill '+(isT?'bar-today':barClass)+'" style="height:'+h+'px"></div>' +
        '<div class="bar-date">'+(isT?'\uC624\uB298':d.slice(5))+'</div>' +
      '</div>';
    }).join('') +
    '</div>';

  return '<div class="section-title">\u{1F4C8} 14\uC77C \uCD94\uC774</div>' +
    '<div class="chart-card">' +
      '<div class="chart-header">' +
        '<span class="chart-title">' + chartLabel + ' \xB7 14\uC77C \uD569\uACC4 ' +
          '<strong style="color:var(--t1)">' + total.toLocaleString() + '</strong></span>' +
        '<div class="chart-tabs">' +
          '<button class="ctab '+(mode==='visit'?tabOn.visit:'')+'" data-m="visit" onclick="switchChart(this.dataset.m)">\uBC29\uBB38</button>' +
          '<button class="ctab '+(mode==='view'?tabOn.view:'')+'" data-m="view" onclick="switchChart(this.dataset.m)">\uC601\uC0C1</button>' +
          '<button class="ctab '+(mode==='feed'?tabOn.feed:'')+'" data-m="feed" onclick="switchChart(this.dataset.m)">\uD53C\uB4DC</button>' +
          '<button class="ctab '+(mode==='map'?tabOn.map:'')+'" data-m="map" onclick="switchChart(this.dataset.m)">\uC9C0\uB3C4</button>' +
        '</div>' +
      '</div>' +
      barsHtml +
      '<div class="chart-footer">' +
        '<span class="chart-legend">\u{1F7E1} \uC624\uB298</span>' +
        '<button class="reset-btn" onclick="confirmReset()">\u{1F5D1} \uD1B5\uACC4 \uCD08\uAE30\uD654</button>' +
      '</div>' +
    '</div>';
}

function switchChart(m) { _chartMode=m; renderDashboard(); }
function switchInsight(m) { _insightMode=m; renderDashboard(); }

// \u2500\u2500 \uC5C5\uCCB4 \uB7AD\uD0B9 \uBE4C\uB4DC
function buildRank(mode) {
  const list = shopData || [];
  if (!list.length) return '<div class="empty">\uB4F1\uB85D\uB41C \uC5C5\uCCB4\uAC00 \uC5C6\uC5B4\uC694</div>';
  const fb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";

  // \uC815\uB82C: \uC624\uB298 or \uB204\uC801
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
    '<div class="section-title">\u{1F3C6} \uC5C5\uCCB4\uBCC4 \uC131\uACFC</div>' +
    '<div class="rank-tabs">' +
      '<button class="rank-tab'+tabOn_today+'" data-m="today" onclick="switchRank(this.dataset.m)">\uC624\uB298 \uC131\uACFC</button>' +
      '<button class="rank-tab'+tabOn_total+'" data-m="total" onclick="switchRank(this.dataset.m)">\uB204\uC801 \uC131\uACFC</button>' +
    '</div>';

  const items = sorted.map((s,i) => {
    const img = s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg' : fb);
    const hq  = img;
    const rc  = i===0?'rn1':i===1?'rn2':i===2?'rn3':'rnN';
    const vv  = mode==='today' ? (s.todayViews||0)  : (s.views||0);
    const fv  = mode==='today' ? (s.todayFeedSP||0) : (s.feedSP||0);
    const mv  = mode==='today' ? (s.todayMapSP||0)  : (s.mapSP||0);
    const tot = vv+fv+mv;
    const unit = mode==='today' ? '\uC624\uB298' : '\uB204\uC801';
    return '<div class="rank-item">' +
      '<div class="rank-num '+rc+'">'+(i+1)+'</div>' +
      '<img class="rank-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
      '<div class="rank-info">' +
        '<div class="rank-name">'+s.name+'</div>' +
        '<div class="rank-cat">'+s.category+(s.district?' \xB7 '+s.district:'')+'</div>' +
        '<div class="rank-stats">' +
          '<span class="rank-stat rs-view">\u{1F441} '+vv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-feed">\u{1F4F9} '+fv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-map">\u{1F5FA}\uFE0F '+mv.toLocaleString()+'</span>' +
        '</div>' +
      '</div>' +
      '<div class="rank-total">'+tot.toLocaleString()+'<small>'+unit+' \uD569\uACC4</small></div>' +
    '</div>';
  }).join('');

  return header + items;
}

function switchRank(m) { _rankMode=m; renderDashboard(); }

async function confirmReset() {
  if (!confirm('\uD1B5\uACC4\uB97C \uCD08\uAE30\uD654\uD560\uAE4C\uC694? (\uBC29\uBB38\uC790/\uC601\uC0C1\uC870\uD68C/\uC608\uC57D\uD074\uB9AD \uBAA8\uB450 \uB9AC\uC14B)')) return;
  const r = await fetch('/api/admin/reset-stats', {method:'POST'});
  if (r.ok) { toast('\uD1B5\uACC4\uAC00 \uCD08\uAE30\uD654\uB410\uC5B4\uC694'); loadAll(); }
  else toast('\uCD08\uAE30\uD654 \uC2E4\uD328');
}

// ======================================================
// \uC5C5\uCCB4 \uAD00\uB9AC \uD0ED
// ======================================================
function modeLabel(m) {
  if (m==='feed') return '<span class="sc-mode mode-feed">\u{1F3AC} \uC601\uC0C1\uC804\uC6A9</span>';
  if (m==='map')  return '<span class="sc-mode mode-map">\u{1F5FA}\uFE0F \uC9C0\uB3C4\uC804\uC6A9</span>';
  return '<span class="sc-mode mode-both">\u{1F3AC}\u{1F5FA}\uFE0F \uC601\uC0C1+\uC9C0\uB3C4</span>';
}
function planBadge(s) {
  const plan = s.plan||'basic', st = s.paymentStatus||'unpaid';
  const pB = plan==='shoot'
    ? '<span class="badge b-plan-shoot">\u{1F3AC} \uCD2C\uC601\uD50C\uB79C</span>'
    : '<span class="badge b-plan-basic">\u{1F4CD} \uAE30\uBCF8\uD50C\uB79C</span>';
  let sB = '';
  if (st==='paid')    sB='<span class="badge b-paid">\u2705 \uACB0\uC81C\uC644\uB8CC</span>';
  else if (st==='free') sB='<span class="badge b-free">\u{1F381} \uBB34\uB8CC\uAE30\uAC04</span>';
  else if (st==='expired') sB='<span class="badge b-expired">\u26A0\uFE0F \uB9CC\uB8CC</span>';
  else sB='<span class="badge b-unpaid">\u{1F4B3} \uBBF8\uACB0\uC81C</span>';
  let exp='';
  if (s.paidUntil) {
    const d=new Date(s.paidUntil), diff=Math.ceil((d-new Date())/86400000);
    const ds=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'});
    exp = diff>0
      ? '<span class="badge" style="background:rgba(255,255,255,.06);color:var(--t3)">\u{1F4C6} '+ds+' ('+diff+'\uC77C)</span>'
      : '<span class="badge b-expired">\u{1F4C6} \uB9CC\uB8CC ('+Math.abs(diff)+'\uC77C \uACBD\uACFC)</span>';
  }
  return pB+sB+exp;
}

function renderShops(list) {
  const p = document.getElementById('panel-shops');
  if (!list.length) { p.innerHTML='<div class="empty">\uB4F1\uB85D\uB41C \uC5C5\uCCB4\uAC00 \uC5C6\uC5B4\uC694</div>'; return; }
  const fb="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";
  const thumb   = s => s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
  const thumbHq = thumb;
  p.innerHTML = '<div class="section-title">\u{1F3EA} \uC5C5\uCCB4 \uBAA9\uB85D <span style="font-weight:500;font-size:10px">'+list.length+'\uAC1C</span></div>' +
  list.map(s => {
    const totToday=(s.todayViews||0)+(s.todayFeedSP||0)+(s.todayMapSP||0);
    return '<div class="shop-card" id="card-'+s.id+'">' +
      '<div class="sc-top">' +
        '<img class="sc-thumb" src="'+thumb(s)+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+thumbHq(s)+'" data-fb="'+fb+'"/>' +
        '<div class="sc-info">' +
          '<div class="sc-name">'+s.name+
            (s.featured?'<span class="badge b-feat">\uCD94\uCC9C</span>':'')+
            (!s.active?'<span class="badge b-hide">\uBE44\uACF5\uAC1C</span>':'') +
          '</div>' +
          '<div class="sc-cat">'+s.category+'</div>' +
          '<div class="sc-addr">'+( s.address||'')+'</div>' +
          modeLabel(s.displayMode||'both') +
        '</div>' +
      '</div>' +
      '<div class="sc-mid">'+planBadge(s)+
        (s.paymentMemo?'<span class="badge" style="background:rgba(255,255,255,.05);color:var(--t3);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+s.paymentMemo+'">\u{1F4DD} '+s.paymentMemo+'</span>':'')+
      '</div>' +
      '<div class="sc-nums">' +
        // \u2500\u2500 \uC8FC\uC694 \uC9C0\uD45C: \uD53C\uB4DC\uD074\uB9AD + \uC9C0\uB3C4\uD074\uB9AD (\uD06C\uAC8C)
        '<div class="sc-click-row">' +
          '<div class="sc-num main c-feed">' +
            '<div class="sn-v">\u{1F4C5} '+(s.feedSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">\uD53C\uB4DC \uC608\uC57D\uD074\uB9AD</div>' +
          '</div>' +
          '<div class="sc-num main c-map">' +
            '<div class="sn-v">\u{1F4CD} '+(s.mapSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">\uC9C0\uB3C4 \uC608\uC57D\uD074\uB9AD</div>' +
          '</div>' +
        '</div>' +
        // \u2500\u2500 \uCD1D \uD074\uB9AD + \uBCF4\uC870: \uC601\uC0C1\uC870\uD68C \uD569\uACC4
        '<div class="sc-total-click">' +
          '<div><div class="stc-lbl">\uCD1D \uC608\uC57D\uD074\uB9AD</div><div class="stc-val">'+((s.feedSP||0)+(s.mapSP||0)).toLocaleString()+'</div></div>' +
          '<div style="text-align:right"><div class="stc-lbl">\u{1F441} \uC601\uC0C1\uC870\uD68C</div><div class="sn-v sub">'+(s.views||0).toLocaleString()+'</div></div>' +
        '</div>' +
        // \u2500\u2500 \uCD9C\uCC98\uBCC4 \uC601\uC0C1\uC870\uD68C \uBD84\uC11D (\uC624\uB298)
        ((s.todayFeedView||0)+(s.todayCatalogView||0)+(s.todayMapView||0) > 0
          ? '<div class="sc-view-src">' +
              '<div class="vsrc-title">\uC624\uB298 \uC601\uC0C1\uC870\uD68C \uCD9C\uCC98</div>' +
              '<div class="vsrc-row">' +
                '<span class="vsrc-chip vsrc-feed">\u{1F4DC} \uD53C\uB4DC '+(s.todayFeedView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-cat">\u{1F4C2} \uCE74\uD0C8\uB85C\uADF8 '+(s.todayCatalogView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-map">\u{1F5FA} \uC9C0\uB3C4 '+(s.todayMapView||0)+'</span>' +
              '</div>' +
            '</div>'
          : '') +
        // \u2500\u2500 \uCD9C\uCC98\uBCC4 \uC804\uD658\uC728 (\uC601\uC0C1\u2192\uC608\uC57D, \uC624\uB298)
        (function(){
          const vF=s.todayFeedView||0, vC=s.todayCatalogView||0, vM=s.todayMapView||0;
          const tF=s.todayVtsFeed||0,  tC=s.todayVtsCatalog||0,  tM=s.todayVtsMap||0;
          if (tF+tC+tM === 0) return '';
          const cvr = (v,t) => v>0 ? Math.round(t/v*100)+'%' : '\u2014';
          const bar = (pct,col) => {
            const n = parseInt(pct)||0;
            return '<div style="height:4px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:3px">'
              +'<div style="height:4px;border-radius:2px;background:'+col+';width:'+Math.min(n,100)+'%"></div></div>';
          };
          return '<div class="sc-cvr-wrap">'
            +'<div class="sc-cvr-title">\uC624\uB298 \uC601\uC0C1\u2192\uC608\uC57D \uC804\uD658\uC728</div>'
            +'<div class="sc-cvr-row">'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">\u{1F4DC} \uD53C\uB4DC</div>'
                +'<div class="sc-cvr-val" style="color:#10b981">'+cvr(vF,tF)+'</div>'
                +'<div class="sc-cvr-sub">'+tF+'/'+vF+'\uBA85'+'</div>'
                +bar(parseInt(cvr(vF,tF)),'#10b981')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">\u{1F4C2} \uCE74\uD0C8\uB85C\uADF8</div>'
                +'<div class="sc-cvr-val" style="color:#f59e0b">'+cvr(vC,tC)+'</div>'
                +'<div class="sc-cvr-sub">'+tC+'/'+vC+'\uBA85'+'</div>'
                +bar(parseInt(cvr(vC,tC)),'#f59e0b')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">\u{1F5FA} \uC9C0\uB3C4</div>'
                +'<div class="sc-cvr-val" style="color:#818cf8">'+cvr(vM,tM)+'</div>'
                +'<div class="sc-cvr-sub">'+tM+'/'+vM+'\uBA85'+'</div>'
                +bar(parseInt(cvr(vM,tM)),'#818cf8')
              +'</div>'
            +'</div>'
          +'</div>';
        }()) +
      '</div>' +
      (totToday>0?'<div style="margin-top:6px;padding:6px 10px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:8px;font-size:10px;color:#f59e0b;font-weight:700">' +
        '\uC624\uB298 \u{1F4C5}'+(s.todayFeedSP||0)+' \u{1F4CD}'+(s.todayMapSP||0)+' <span style="color:#64748b;font-weight:500">\u{1F441}'+(s.todayViews||0)+'</span></div>':'') +
      // \u2500\u2500 \uCD94\uCC9C\uD0ED \uC5B4\uD544 \uBC30\uB108
      (function(){
        const totalViews = s.views || 0;
        const totalClicks = (s.feedSP||0) + (s.mapSP||0);
        const weekRec = s.weekRecView || 0;
        const todayRec = s.todayRecView || 0;

        if (s.isRecommended) {
          // \u2500 \uCD94\uCC9C\uC911: 7\uC77C/\uC624\uB298 rec_view\uB9CC \uD45C\uC2DC
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px solid rgba(251,191,36,.3)">' +
            '<div style="background:linear-gradient(90deg,rgba(251,191,36,.15),rgba(251,191,36,.05));padding:7px 12px;display:flex;align-items:center;justify-content:space-between">' +
              '<span style="font-size:11px;font-weight:700;color:#fbbf24">\u2B50 \uCD94\uCC9C\uD0ED \uB178\uCD9C \uC911</span>' +
              '<span style="font-size:10px;color:#92400e;background:rgba(251,191,36,.2);padding:1px 7px;border-radius:20px">ON</span>' +
            '</div>' +
            '<div style="padding:8px 12px;background:rgba(251,191,36,.04);display:grid;grid-template-columns:repeat(2,1fr);gap:4px;text-align:center">' +
              '<div><div style="font-size:17px;font-weight:800;color:#fbbf24">'+(weekRec>0?weekRec.toLocaleString():'\u2014')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">7\uC77C \uC870\uD68C</div></div>' +
              '<div><div style="font-size:17px;font-weight:800;color:#f59e0b">'+(todayRec>0?'+'+todayRec:'\u2014')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">\uC624\uB298 \uC870\uD68C</div></div>' +
            '</div>' +
          '</div>';
        } else {
          // \u2500 \uBBF8\uCD94\uCC9C: \uC7A0\uC7AC \uC131\uACFC\uB85C \uC5B4\uD544
          const potentialMsg = totalViews >= 500
            ? '\uC601\uC0C1 \uC870\uD68C '+totalViews.toLocaleString()+'\uD68C \u2014 \uCD94\uCC9C\uD0ED \uCD94\uAC00 \uC2DC \uC0C1\uB2E8 \uB178\uCD9C \uAC00\uB2A5'
            : totalClicks > 0
            ? '\uC608\uC57D\uD074\uB9AD '+totalClicks+'\uD68C \uC2E4\uC801 \u2014 \uCD94\uCC9C\uD0ED\uC73C\uB85C \uB354 \uB9CE\uC740 \uACE0\uAC1D \uC720\uC785 \uAC00\uB2A5'
            : '\uCD94\uCC9C\uD0ED \uB178\uCD9C \uC2DC \uC7A0\uC7AC \uACE0\uAC1D\uC5D0\uAC8C \uBC14\uB85C \uBCF4\uC785\uB2C8\uB2E4';
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px dashed rgba(251,191,36,.2)">' +
            '<div style="background:rgba(251,191,36,.03);padding:8px 12px;display:flex;align-items:flex-start;gap:8px">' +
              '<span style="font-size:14px;flex-shrink:0;margin-top:1px">\u2606</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:11px;font-weight:700;color:#92400e;margin-bottom:2px">\uCD94\uCC9C\uD0ED \uBBF8\uB178\uCD9C</div>' +
                '<div style="font-size:10px;color:#64748b;line-height:1.4">'+potentialMsg+'</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }
      }()) +
      '<div class="sc-btns">' +
        '<button class="btn-edit" data-id="'+s.id+'" onclick="openModal(+this.dataset.id)"><i class="fas fa-edit"></i> \uC218\uC815</button>' +
        '<button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-credit-card"></i> \uACB0\uC81C</button>' +
        '<button class="btn-report" data-id="'+s.id+'" onclick="copyReportLink(+this.dataset.id,this)"><i class="fas fa-chart-line"></i> \uB9AC\uD3EC\uD2B8</button>' +
        '<button class="btn-rec '+(s.isRecommended?'btn-rec-on':'')+'" data-id="'+s.id+'" data-rec="'+(s.isRecommended?'1':'0')+'" onclick="toggleRec(+this.dataset.id,+this.dataset.rec===1,this)">'+
          (s.isRecommended ? '\u2B50 \uCD94\uCC9C\uC911' : '\u2606 \uCD94\uCC9C') +
        '</button>' +
        '<button class="btn-del" data-id="'+s.id+'" data-name="'+s.name.replace(/"/g,'&quot;')+'" onclick="delShop(+this.dataset.id,this.dataset.name)"><i class="fas fa-trash"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ======================================================
// \uAD6C\uB3C5\uAD00\uB9AC \uD0ED
// ======================================================
let payFilter='all';
function renderPayTab(filter) {
  if (filter!==undefined) payFilter=filter;
  const p = document.getElementById('panel-pay');
  const list = shopData;
  if (!list.length) { p.innerHTML='<div class="empty">\uB4F1\uB85D\uB41C \uC5C5\uCCB4\uAC00 \uC5C6\uC5B4\uC694</div>'; return; }
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
    {k:'all',l:'\uC804\uCCB4 '+list.length},
    {k:'paid',l:'\u2705 \uACB0\uC81C '+paid},
    {k:'free',l:'\u{1F381} \uBB34\uB8CC '+free},
    {k:'unpaid',l:'\u{1F4B3} \uBBF8\uACB0\uC81C '+unpaid},
    {k:'expired',l:'\u26A0\uFE0F \uB9CC\uB8CC '+expired},
    {k:'soon',l:'\u{1F514} \uC784\uBC15 '+soon},
  ].map(b=>'<button class="pf-btn'+(payFilter===b.k?' on':'')+'" data-k="'+b.k+'" onclick="renderPayTab(this.dataset.k)">'+b.l+'</button>').join('');

  const stMap={paid:'\u2705 \uACB0\uC81C\uC644\uB8CC',free:'\u{1F381} \uBB34\uB8CC\uAE30\uAC04',unpaid:'\u{1F4B3} \uBBF8\uACB0\uC81C',expired:'\u26A0\uFE0F \uB9CC\uB8CC'};
  const stColor={paid:'var(--green)',free:'var(--blue)',unpaid:'#FFA500',expired:'var(--pink)'};

  const cards=filtered.map(s=>{
    const img=s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
    const hq=img;
    const plan=s.plan||'basic', st=s.paymentStatus||'unpaid';
    let expHtml='<strong>\uBBF8\uC124\uC815</strong>';
    if(s.paidUntil){
      const d=new Date(s.paidUntil),diff=Math.ceil((d-new Date())/86400000);
      const ds=d.toLocaleDateString('ko-KR',{year:'2-digit',month:'2-digit',day:'2-digit'});
      if(diff>30) expHtml='<strong style="color:var(--green)">'+ds+'</strong>';
      else if(diff>0) expHtml='<strong style="color:#FFA500">'+ds+' ('+diff+'\uC77C \uB0A8\uC74C)</strong>';
      else expHtml='<strong style="color:var(--pink)">'+ds+' ('+Math.abs(diff)+'\uC77C \uACBD\uACFC)</strong>';
    }
    return '<div class="pay-card status-'+st+'">' +
      '<div class="pay-top">' +
        '<img class="pay-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
        '<div class="pay-info">' +
          '<div class="pay-name">'+s.name+'</div>' +
          '<div class="pay-sub">'+s.category+' \xB7 '+(s.district||'')+'</div>' +
          '<div class="pay-badges">' +
            (plan==='shoot'?'<span class="badge b-plan-shoot">\u{1F3AC} \uCD2C\uC601\uD50C\uB79C</span>':'<span class="badge b-plan-basic">\u{1F4CD} \uAE30\uBCF8\uD50C\uB79C</span>') +
            '<span class="badge" style="background:rgba(255,255,255,.06);color:'+( stColor[st]||'#fff')+'">'+( stMap[st]||st)+'</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="pay-body">' +
        '<div class="pay-kv">\u{1F4C6} \uB9CC\uB8CC\uC77C'+expHtml+'</div>' +
        '<div class="pay-kv">\u{1F4CB} \uD50C\uB79C<strong>'+(plan==='shoot'?'\uCD2C\uC601 (3\uB9CC+\uC6D41\uB9CC)':'\uAE30\uBCF8 (\uC6D41\uB9CC)')+'</strong></div>' +
      '</div>' +
      (s.paymentMemo?'<div class="pay-memo"><i class="fas fa-sticky-note" style="color:var(--t4);flex-shrink:0;margin-top:1px"></i><span>'+s.paymentMemo+'</span></div>':'') +
      '<div class="pay-btns"><button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-edit"></i> \uACB0\uC81C \uC815\uBCF4 \uC218\uC815</button></div>' +
    '</div>';
  }).join('')||'<div class="empty">\uD574\uB2F9 \uD56D\uBAA9\uC774 \uC5C6\uC5B4\uC694</div>';

  p.innerHTML =
    '<div class="section-title">\u{1F4B3} \uAD6C\uB3C5 \uD604\uD669</div>' +
    '<div class="pay-summary">' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--green)">'+paid+'</div><div class="pay-sv-l">\u2705 \uACB0\uC81C\uC644\uB8CC</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--blue)">'+free+'</div><div class="pay-sv-l">\u{1F381} \uBB34\uB8CC\uAE30\uAC04</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:#FFA500">'+unpaid+'</div><div class="pay-sv-l">\u{1F4B3} \uBBF8\uACB0\uC81C</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--pink)">'+expired+'</div><div class="pay-sv-l">\u26A0\uFE0F \uB9CC\uB8CC</div></div>' +
    '</div>' +
    '<div class="pay-filter">'+fbtns+'</div>' +
    cards;
}

// \u2500\u2500 \uACB0\uC81C \uBAA8\uB2EC
function openPayModal(id) {
  const s=shopData.find(x=>x.id===id); if(!s)return;
  payEditId=id;
  document.getElementById('pmShopName').textContent=s.name+' \xB7 '+(s.category||'');
  setPmPlan(s.plan||'basic'); setPmStatus(s.paymentStatus||'unpaid');
  document.getElementById('pm-until').value=s.paidUntil?s.paidUntil.slice(0,10):'';
  document.getElementById('pm-memo').value=s.paymentMemo||'';
  document.getElementById('payModalBg').classList.remove('hidden');
}
function closePayModal(){document.getElementById('payModalBg').classList.add('hidden');}

// \uCD94\uCC9C \uD0ED ON/OFF \uD1A0\uAE00
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
    btn.textContent = next ? '\u2B50 \uCD94\uCC9C\uC911' : '\u2606 \uCD94\uCC9C';
    showToast(next ? '\u2B50 \uCD94\uCC9C \uD0ED\uC5D0 \uCD94\uAC00\uB410\uC5B4\uC694!' : '\uCD94\uCC9C \uD0ED\uC5D0\uC11C \uC81C\uAC70\uB410\uC5B4\uC694');
  } catch(e) {
    showToast('\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694');
  }
  btn.disabled = false;
}

// \uB9AC\uD3EC\uD2B8 \uB9C1\uD06C \uBCF5\uC0AC
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
    btn.innerHTML = '<i class="fas fa-check"></i> \uBCF5\uC0AC\uB428!';
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
    toast('\uB9C1\uD06C \uBCF5\uC0AC \uC2E4\uD328: ' + e.message);
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
  if(r.ok){closePayModal();await loadAll();if(curTab==='pay')renderPayTab();toast('\uACB0\uC81C \uC815\uBCF4\uAC00 \uC800\uC7A5\uB410\uC5B4\uC694');}
  else alert('\uC800\uC7A5 \uC2E4\uD328: '+r.status);
}

// ======================================================
// \uC785\uC810\uBB38\uC758
// ======================================================
async function loadInquiries(){
  const p=document.getElementById('panel-inq');
  p.innerHTML='<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const rows=await(await fetch('/api/admin/inquiries')).json();
  if(!rows.length){p.innerHTML='<div class="empty">\u{1F4ED} \uC811\uC218\uB41C \uC785\uC810\uBB38\uC758\uAC00 \uC5C6\uC5B4\uC694</div>';return;}
  p.innerHTML='<div class="section-title">\u{1F4EC} \uC785\uC810 \uBB38\uC758</div>'+rows.map(r=>{
    const d=new Date(r.created_at);
    const dt=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'})+' '+d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    return '<div class="inq-card"><div class="inq-top"><span class="inq-name">'+(r.owner||r.name||'\uC774\uB984\uC5C6\uC74C')+'</span>'+(r.category?'<span class="inq-badge">'+r.category+'</span>':'')+'<span class="inq-time">'+dt+'</span></div><div class="inq-row"><span class="inq-kv">\u{1F3EA} \uC0F5\uBA85 <strong>'+(r.name||'-')+'</strong></span><span class="inq-kv">\u{1F4CD} \uC9C0\uC5ED <strong>'+(r.area||'-')+'</strong></span><span class="inq-kv">\u{1F4DE} <strong>'+(r.phone||'-')+'</strong></span></div>'+(r.url?'<div class="inq-row"><span class="inq-kv">\u{1F517} <strong style="color:var(--blue)">'+r.url+'</strong></span></div>':'')+(r.message?'<div class="inq-msg">\u{1F4AC} '+r.message+'</div>':'')+'</div>';
  }).join('');
}

// ======================================================
// \uB2EC\uB825 \uD0ED
// ======================================================
let _calYear  = new Date().getFullYear();
let _calMonth = new Date().getMonth() + 1;
let _calData  = null;
let _calSel   = null; // \uC120\uD0DD\uB41C \uB0A0\uC9DC

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
  // \uC5C5\uCCB4\uBCC4 \uC0C1\uC138 \uB85C\uB4DC
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
    detailEl.innerHTML = '<div class="empty" style="padding:24px;color:var(--t3);text-align:center">\u{1F4ED} \uD574\uB2F9 \uB0A0\uC9DC\uC5D0 \uAE30\uB85D\uB41C \uB370\uC774\uD130\uAC00 \uC5C6\uC5B4\uC694</div>';
    return;
  }
  const fmt = function(n) { return (n||0).toLocaleString(); };
  const maxTotal = Math.max.apply(null, [1].concat(shops.map(function(s) { return (s.views||0)+(s.feedSP||0)+(s.mapSP||0); })));
  const mm = dateStr.slice(5,7)+'\uC6D4', dd2 = dateStr.slice(8,10)+'\uC77C';

  let html = '<div style="background:#111;border:1px solid var(--border);border-radius:14px;overflow:hidden">'
    + '<div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    + '<div style="font-size:13px;font-weight:700;color:var(--t1)">\u{1F4C5} '+mm+' '+dd2+' \uC5C5\uCCB4\uBCC4 \uC2E4\uC801</div>'
    + '<div style="font-size:11px;color:var(--t3)">'+shops.length+'\uAC1C \uC5C5\uCCB4</div>'
    + '</div>';

  shops.forEach(function(s, i) {
    const total  = (s.views||0) + (s.feedSP||0) + (s.mapSP||0);
    const barPct = Math.round(total / maxTotal * 100);
    const rankColors = ['#fbbf24','#aaa','#cd7f32'];
    const rankEmoji  = i===0 ? '\u{1F947}' : i===1 ? '\u{1F948}' : i===2 ? '\u{1F949}' : '';
    const rankColor  = rankColors[i] || 'var(--t3)';
    const rankSize   = i < 3 ? '18' : '12';
    const rankLabel  = rankEmoji || String(i+1);
    const thumb = s.thumbnail
      ? '<img src="'+s.thumbnail+'" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex-shrink:0">'
      : '<div style="width:38px;height:38px;border-radius:9px;background:#222;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">\u{1F484}</div>';
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
      +   (s.views  ? '<span style="font-size:11px;background:rgba(100,149,237,.15);color:#9ab4f0;padding:3px 8px;border-radius:6px">\u{1F441} '+fmt(s.views)+'</span>' : '')
      +   (s.feedSP ? '<span style="font-size:11px;background:rgba(255,138,170,.15);color:#ff8aaa;padding:3px 8px;border-radius:6px">\u{1F4F9} '+fmt(s.feedSP)+'</span>' : '')
      +   (s.mapSP  ? '<span style="font-size:11px;background:rgba(93,224,160,.15);color:#5de0a0;padding:3px 8px;border-radius:6px">\u{1F5FA}\uFE0F '+fmt(s.mapSP)+'</span>' : '')
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
  var DOW = ['\uC77C','\uC6D4','\uD654','\uC218','\uBAA9','\uAE08','\uD1A0'];

  var totalVisits = mt.visits||0;
  var totalViews  = mt.views||0;
  var totalFeed   = mt.feedSP||0;
  var totalMap    = mt.mapSP||0;
  var totalAll    = totalViews + totalFeed + totalMap;

  var activeDays = d.daily.filter(function(x){return (x.views||0)+(x.feedSP||0)+(x.mapSP||0)+(x.visits||0)>0;}).length || 1;
  var avgVisits  = (totalVisits/activeDays).toFixed(1);
  var avgViews   = (totalViews/activeDays).toFixed(1);

  var html = '';

  // \u2460 \uC6D4 \uB124\uBE44\uAC8C\uC774\uC158 \uD5E4\uB354
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'
    + '<button onclick="calMove(-1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9664;</button>'
    + '<div style="text-align:center">'
    +   '<div style="font-size:20px;font-weight:800;color:var(--t1)">'+_calYear+'\uB144 '+_calMonth+'\uC6D4</div>'
    +   '<div style="font-size:11px;color:var(--t3);margin-top:3px">\uD65C\uC131\uC77C '+activeDays+'\uC77C &middot; \uC77C\uD3C9\uADE0 \uBC29\uBB38 '+avgVisits+' &middot; \uC77C\uD3C9\uADE0 \uC870\uD68C '+avgViews+'</div>'
    + '</div>'
    + '<button onclick="calMove(1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9654;</button>'
    + '</div>';

  // \u2461 \uC6D4 \uD569\uACC4 \uD1B5\uACC4 \uCE74\uB4DC (4\uAC1C)
  var statCards = [
    { emoji:'\u{1F64B}', label:'\uBC29\uBB38\uC790',     val:totalVisits, color:'#fbbf24', bg:'rgba(251,191,36,.1)',   bdr:'rgba(251,191,36,.25)' },
    { emoji:'\u{1F441}', label:'\uC601\uC0C1\uC870\uD68C',val:totalViews,  color:'#6495ed', bg:'rgba(100,149,237,.1)', bdr:'rgba(100,149,237,.25)' },
    { emoji:'\u{1F4F9}', label:'\uD53C\uB4DC\uD074\uB9AD',val:totalFeed,   color:'#ff8aaa', bg:'rgba(255,138,170,.1)', bdr:'rgba(255,138,170,.25)' },
    { emoji:'\u{1F5FA}\uFE0F',label:'\uC9C0\uB3C4\uD074\uB9AD',val:totalMap, color:'#5de0a0',bg:'rgba(93,224,160,.1)', bdr:'rgba(93,224,160,.25)' },
  ];

  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">';
  statCards.forEach(function(sc) {
    var pct = totalAll > 0 && sc.label !== '\uBC29\uBB38\uC790'
      ? Math.round(sc.val / Math.max(1,totalAll) * 100) : 0;
    var barHtml = sc.label !== '\uBC29\uBB38\uC790'
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

  // \u2462 \uCD5C\uADFC 14\uC77C \uD2B8\uB80C\uB4DC \uB9C9\uB300
  var last14 = [];
  for (var ti = 13; ti >= 0; ti--) {
    var dt14 = new Date(Date.now()+9*3600*1000 - ti*86400*1000).toISOString().slice(0,10);
    var dd14 = dayMap[dt14];
    last14.push({ date:dt14, visits:visitMap[dt14]||0, views:dd14?(dd14.views||0):0 });
  }
  var maxBar14 = Math.max.apply(null,[1].concat(last14.map(function(x){return Math.max(x.visits,x.views);})));

  html += '<div style="background:#111;border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px">'
    + '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:10px">\u{1F4C8} \uCD5C\uADFC 14\uC77C \uD2B8\uB80C\uB4DC</div>'
    + '<div style="display:flex;align-items:flex-end;gap:3px;height:52px">';
  last14.forEach(function(x14) {
    var hv14 = maxBar14 ? Math.round(x14.visits/maxBar14*48) : 0;
    var hw14 = maxBar14 ? Math.round(x14.views/maxBar14*48) : 0;
    var isT14 = x14.date===today;
    var dd14s = x14.date.slice(8,10);
    var todayLbl = isT14 ? '<div style="position:absolute;top:-14px;font-size:8px;color:var(--amber);font-weight:800;white-space:nowrap">\uC624\uB298</div>' : '';
    var dtTip = x14.date+' \uBC29\uBB38:'+x14.visits+' \uC870\uD68C:'+x14.views;
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
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(251,191,36,.8);border-radius:1px"></span>\uBC29\uBB38\uC790</span>'
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(100,149,237,.7);border-radius:1px"></span>\uC601\uC0C1\uC870\uD68C</span>'
    + '</div>'
    + '</div>';

  // \u2463 \uB2EC\uB825 \uD788\uD2B8\uB9F5 \uADF8\uB9AC\uB4DC
  html += '<div style="background:#111;border-radius:14px;overflow:hidden;border:1px solid var(--border);margin-bottom:12px">';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border)">';
  DOW.forEach(function(dw,i) {
    var c = i===0 ? '#ff6b6b' : i===6 ? '#6495ed' : 'var(--t3)';
    html += '<div style="text-align:center;padding:8px 0;font-size:11px;font-weight:700;color:'+c+'">'+dw+'</div>';
  });
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr)">';

  // \uC774\uC804\uB2EC \uBE48\uCE78
  for (var pi = 0; pi < firstDay; pi++) {
    var pdd = prevLastDate - firstDay + pi + 1;
    html += '<div style="padding:6px 5px;min-height:64px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+pdd+'</div></div>';
  }

  // \uC774\uBC88\uB2EC \uB0A0\uC9DC
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
      if (vis)           html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">\u{1F64B}</span><span style="font-size:9px;color:#fbbf24;font-weight:700">'+fmt(vis)+'</span></div>';
      if (dd && dd.views)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">\u{1F441}</span><span style="font-size:9px;color:#9ab4f0;font-weight:700">'+fmt(dd.views)+'</span></div>';
      if (dd && dd.feedSP) html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">\u{1F4F9}</span><span style="font-size:9px;color:#ff8aaa;font-weight:700">'+fmt(dd.feedSP)+'</span></div>';
      if (dd && dd.mapSP)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">\u{1F5FA}\uFE0F</span><span style="font-size:9px;color:#5de0a0;font-weight:700">'+fmt(dd.mapSP)+'</span></div>';
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

  // \uB2E4\uC74C\uB2EC \uBE48\uCE78
  var remaining = (7 - (firstDay + lastDate) % 7) % 7;
  for (var ri = 1; ri <= remaining; ri++) {
    html += '<div style="padding:6px 5px;min-height:64px;border-bottom:none;opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+ri+'</div></div>';
  }
  html += '</div></div>';

  // \u2464 \uBC94\uB840
  var heatBars = [0.1,0.2,0.35,0.5,0.65,0.85].map(function(v){
    return '<div style="width:16px;height:10px;border-radius:2px;background:rgba(100,149,237,'+v+')"></div>';
  }).join('');
  html += '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:16px;padding:8px 10px;background:#111;border:1px solid var(--border);border-radius:10px">'
    + '<span style="font-size:10px;color:var(--t3);font-weight:600">\uD788\uD2B8\uB9F5:</span>'
    + '<div style="display:flex;gap:2px;align-items:center">'+heatBars+'</div>'
    + '<span style="font-size:10px;color:var(--t3)">\uB099\uC74C &#8594; \uB192\uC74C</span>'
    + '<span style="margin-left:4px;font-size:10px;color:#fbbf24">&#9632; \uC624\uB298</span>'
    + '<span style="font-size:10px;color:var(--pink)">&#9632; \uC120\uD0DD</span>'
    + '<div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">'
    +   '<span style="font-size:10px;color:#fbbf24">\u{1F64B}\uBC29\uBB38\uC790</span>'
    +   '<span style="font-size:10px;color:#9ab4f0">\u{1F441}\uC601\uC0C1\uC870\uD68C</span>'
    +   '<span style="font-size:10px;color:#ff8aaa">\u{1F4F9}\uD53C\uB4DC</span>'
    +   '<span style="font-size:10px;color:#5de0a0">\u{1F5FA}\uFE0F\uC9C0\uB3C4</span>'
    + '</div>'
    + '</div>';

  // \u2465 \uB0A0\uC9DC \uD074\uB9AD \uC0C1\uC138
  html += '<div id="cal-detail" style="margin-top:4px">'
    + '<div class="empty" style="padding:20px;color:var(--t3);text-align:center">\u{1F4C5} \uB0A0\uC9DC\uB97C \uD074\uB9AD\uD558\uBA74 \uC5C5\uCCB4\uBCC4 \uC0C1\uC138 \uB370\uC774\uD130\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4</div>'
    + '</div>';

  var p = document.getElementById('panel-cal');
  p.innerHTML = '<div class="section" style="padding:16px">'+html+'</div>';

  if (_calSel && _calData) {
    var found = _calData.daily.find(function(x) { return x.date === _calSel; });
    if (!found) renderCalDetail(_calSel, []);
  }
}

// ======================================================
// \uC5C5\uCCB4 \uCD94\uAC00/\uC218\uC815 \uBAA8\uB2EC
// ======================================================
function openModal(id) {
  editId=id||null;
  document.getElementById('modalTtl').textContent=id?'\uC5C5\uCCB4 \uC218\uC815':'\uC5C5\uCCB4 \uCD94\uAC00';
  if(id){
    const s=shopData.find(x=>x.id===id); if(!s)return;
    document.getElementById('f-name').value=s.name||'';
    document.getElementById('f-cat').value=s.category||'\uB9C8\uC0AC\uC9C0';
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
    document.getElementById('f-cat').value='\uB9C8\uC0AC\uC9C0';
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
    label.textContent = '\u2B50 \uCD94\uCC9C\uD0ED \uB178\uCD9C \uC911';
    label.style.color = '#fbbf24';
    wrap.style.borderColor = 'rgba(251,191,36,.4)';
    wrap.style.background  = 'rgba(251,191,36,.07)';
  } else {
    track.style.background = '#374151';
    thumb.style.left = '3px';
    label.textContent = '\uCD94\uCC9C\uD0ED \uBBF8\uB178\uCD9C';
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
  btn.disabled=true; btn.textContent='\uAC80\uC0C9\uC911...';
  st.style.display='block'; st.style.color='rgba(255,255,255,.4)'; st.textContent='\uC88C\uD45C\uB97C \uAC80\uC0C9\uD558\uB294 \uC911...';
  try{
    const r=await fetch('/api/geocode?query='+encodeURIComponent(addr));
    const d=await r.json();
    if(d.lat&&d.lng){
      document.getElementById('f-lat').value=d.lat;
      document.getElementById('f-lng').value=d.lng;
      if(d.district)document.getElementById('f-dist').value=d.district;
      st.style.color='#03C75A'; st.textContent='\uC88C\uD45C \uD655\uC778: '+d.lat+', '+d.lng;
    } else { st.style.color='var(--pink)'; st.textContent='\uC8FC\uC18C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694'; }
  } catch { st.style.color='var(--pink)'; st.textContent='\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694'; }
  btn.disabled=false; btn.innerHTML='<i class="fas fa-crosshairs"></i> \uC88C\uD45C\uCC3E\uAE30';
}

async function saveShop(){
  const name=document.getElementById('f-name').value.trim();
  const addr=document.getElementById('f-addr').value.trim();
  const mode=document.getElementById('f-mode').value;
  if(!name){alert('\uC5C5\uCCB4\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694');return;}
  if((mode==='both'||mode==='map')&&!addr){alert('\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694');return;}
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
    // \uCD94\uCC9C\uD0ED \uC0C1\uD0DC \uBCC4\uB3C4 \uC800\uC7A5
    await fetch('/api/admin/shops/'+savedId+'/recommended',{
      method:'PUT',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({isRecommended:body.isRecommended})
    });
    closeModal();await loadAll();toast(editId?'\uC5C5\uCCB4\uAC00 \uC218\uC815\uB410\uC5B4\uC694':'\uC5C5\uCCB4\uAC00 \uCD94\uAC00\uB410\uC5B4\uC694');
  } else alert('\uC800\uC7A5 \uC2E4\uD328: '+r.status);
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
    btn.innerHTML = '<i class="fas fa-check"></i> \uBCF5\uC0AC\uB428!';
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
    alert('\uB9C1\uD06C \uC0DD\uC131 \uC2E4\uD328: ' + e.message);
  }
}

async function delShop(id,name){
  if(!confirm('['+name+'] \uC5C5\uCCB4\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?'))return;
  const r=await fetch('/api/admin/shops/'+id,{method:'DELETE'});
  if(r.ok)loadAll(); else alert('\uC0AD\uC81C \uC2E4\uD328');
}

/* \uC2DC\uC791 */
loadAll();
loadStats();
setInterval(() => {
  loadAll();
  if (curTab === 'stats')   loadStats();
  if (curTab === 'ranking') loadRanking();
}, 30000);
</script>
</body>
</html>`;
}
var src_default = app;

// api/_entry.ts
var config = { maxDuration: 60 };
async function handler(req, res) {
  const url = `http://${req.headers.host || "localhost"}${req.url}`;
  const method = req.method || "GET";
  const chunks = [];
  await new Promise((resolve) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", resolve);
  });
  const body = chunks.length > 0 ? Buffer.concat(chunks) : void 0;
  const headers = new Headers();
  for (const [k, v2] of Object.entries(req.headers)) {
    if (typeof v2 === "string") headers.set(k, v2);
    else if (Array.isArray(v2)) v2.forEach((val) => headers.append(k, val));
  }
  const fetchReq = new Request(url, {
    method,
    headers,
    body: body && body.length > 0 ? body : void 0
  });
  const fetchRes = await src_default.fetch(fetchReq);
  res.statusCode = fetchRes.status;
  fetchRes.headers.forEach((v2, k) => res.setHeader(k, v2));
  const resBody = await fetchRes.arrayBuffer();
  res.end(Buffer.from(resBody));
}
export {
  config,
  handler as default
};
/*! Bundled license information:

@neondatabase/serverless/index.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  *)
*/
