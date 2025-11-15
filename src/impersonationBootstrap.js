// src/impersonationBootstrap.js
(function () {
  // patch fetch فقط
  if (window.fetch && !window.__IMP_FETCH_PATCHED__) {
    const origFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      try {
        const isImp = sessionStorage.getItem("impersonation") === "1";
        const t = isImp && sessionStorage.getItem("token");
        if (t) {
          init.headers = new Headers(init.headers || {});
          init.headers.set("Authorization", `Bearer ${t}`);
        }
      } catch (_) {}
      return origFetch(input, init);
    };
    window.__IMP_FETCH_PATCHED__ = true;
  }

  // علّقي بلوك XHR لتجنب ازدواج الهيدر مع axios
  /*
  if (window.XMLHttpRequest && !window.__IMP_XHR_PATCHED__) {
    const XHR = window.XMLHttpRequest;
    const open = XHR.prototype.open;
    const send = XHR.prototype.send;
    const setHeader = XHR.prototype.setRequestHeader;
    XHR.prototype.open = function () {
      this.__imp_opened__ = true;
      return open.apply(this, arguments);
    };
    XHR.prototype.send = function (body) {
      try {
        const isImp = sessionStorage.getItem("impersonation") === "1";
        const t = isImp && sessionStorage.getItem("token");
        if (isImp && t) setHeader.call(this, "Authorization", `Bearer ${t}`);
      } catch (_) {}
      return send.apply(this, arguments);
    };
    window.__IMP_XHR_PATCHED__ = true;
  }
  */
})();
