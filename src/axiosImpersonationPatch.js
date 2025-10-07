// src/axiosImpersonationPatch.js
import axios from "axios";

// أضِف Authorization من sessionStorage فقط لو التاب منتحلة
function applyImpersonationHeader(config) {
  try {
    const isImp = sessionStorage.getItem("impersonation") === "1";
    const t = isImp && sessionStorage.getItem("token");
    if (t) {
      // ما نمسحش حاجة موجودة؛ نكتب فوقها إن لزم
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${t}`;
    }
  } catch (_) {}
  return config;
}

// فعّله على axios الرئيسي
axios.interceptors.request.use(applyImpersonationHeader);

// وغطّي كل axios.create()
const _create = axios.create.bind(axios);
axios.create = function (...args) {
  const inst = _create(...args);
  inst.interceptors.request.use(applyImpersonationHeader);
  return inst;
};
