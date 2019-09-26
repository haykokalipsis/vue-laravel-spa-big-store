webpackJsonp([0],Array(47).concat([
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(57)
}
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(59)
/* template */
var __vue_template__ = __webpack_require__(79)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ca2e4be8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/views/Admin.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca2e4be8", Component.options)
  } else {
    hotAPI.reload("data-v-ca2e4be8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(56)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(55)("146c07d4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ca2e4be8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Admin.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ca2e4be8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Admin.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(46)(false);
// imports


// module
exports.push([module.i, "\n.hero-section[data-v-ca2e4be8] {\n    height: 20vh;\n    background: #ababab;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-bottom: 20px;\n    margin-top: -20px;\n}\n.title[data-v-ca2e4be8] {\n    font-size: 60px;\n    color: #ffffff;\n}\n", ""]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_admin_Main__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_admin_Main___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_admin_Main__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_admin_Users__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_admin_Users___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_admin_Users__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_admin_Products__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_admin_Products___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_admin_Products__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_admin_Orders__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_admin_Orders___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_admin_Orders__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/*
* For the admin board, we will use four different components, which we will mount based on the url a user is accessing.
* we import and register four components,
* They’ll be used as components inside Admin.vue parent component.
* In our template, we defined the navigation for switching between the components.
* Each navigation link calls the setComponent method and then passes a value to it.
* The setComponent method just sets the component using a switch statement.
*/
/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            user: null,
            activeComponent: null
        };
    },


    components: {
        Main: __WEBPACK_IMPORTED_MODULE_0__components_admin_Main___default.a, Users: __WEBPACK_IMPORTED_MODULE_1__components_admin_Users___default.a, Products: __WEBPACK_IMPORTED_MODULE_2__components_admin_Products___default.a, Orders: __WEBPACK_IMPORTED_MODULE_3__components_admin_Orders___default.a
    },

    beforeMount: function beforeMount() {
        this.setComponent(this.$route.params.page);
        this.user = JSON.parse(localStorage.getItem('user'));
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');
    },


    methods: {
        setComponent: function setComponent(value) {
            switch (value) {
                case "users":
                    this.activeComponent = __WEBPACK_IMPORTED_MODULE_1__components_admin_Users___default.a;
                    this.$router.push({ name: 'admin-pages', params: { page: 'users' } });
                    break;
                case "orders":
                    this.activeComponent = __WEBPACK_IMPORTED_MODULE_3__components_admin_Orders___default.a;
                    this.$router.push({ name: 'admin-pages', params: { page: 'orders' } });
                    break;
                case "products":
                    this.activeComponent = __WEBPACK_IMPORTED_MODULE_2__components_admin_Products___default.a;
                    this.$router.push({ name: 'admin-pages', params: { page: 'products' } });
                    break;
                default:
                    this.activeComponent = __WEBPACK_IMPORTED_MODULE_0__components_admin_Main___default.a;
                    this.$router.push({ name: 'admin' });
                    break;
            }
        }
    }
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(61)
}
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(63)
/* template */
var __vue_template__ = __webpack_require__(64)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-63080d70"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/admin/Main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63080d70", Component.options)
  } else {
    hotAPI.reload("data-v-63080d70", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(55)("13936d58", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63080d70\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63080d70\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(46)(false);
// imports


// module
exports.push([module.i, "\n.big-text[data-v-63080d70] {\n        font-size: 28px;\n}\n.product-box[data-v-63080d70] {\n        border: 1px solid #cccccc;\n        padding: 10px 15px;\n        height: 20vh\n}\n", ""]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            user: null,
            orders: [],
            products: [],
            users: []
        };
    },
    mounted: function mounted() {
        var _this = this;

        axios.get('/api/users/').then(function (response) {
            _this.users = response.data;
        }).catch(function (error) {
            console.error(error);
        });

        axios.get('/api/products/').then(function (response) {
            _this.products = response.data;
        }).catch(function (error) {
            console.error(error);
        });

        axios.get('/api/orders/').then(function (response) {
            _this.orders = response.data;
        }).catch(function (error) {
            console.error(error);
        });
    }
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row" }, [
    _c(
      "div",
      {
        staticClass:
          "col-md-4 product-box d-flex align-content-center justify-content-center flex-wrap big-text"
      },
      [
        _c("a", { attrs: { href: "/admin/orders" } }, [
          _vm._v("Orders (" + _vm._s(_vm.orders.length) + ")")
        ])
      ]
    ),
    _vm._v(" "),
    _c("hr"),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass:
          "col-md-4 product-box d-flex align-content-center justify-content-center flex-wrap big-text"
      },
      [
        _c("a", { attrs: { href: "/admin/products" } }, [
          _vm._v("Products (" + _vm._s(_vm.products.length) + ")")
        ])
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass:
          "col-md-4 product-box d-flex align-content-center justify-content-center flex-wrap big-text"
      },
      [
        _c("a", { attrs: { href: "/admin/users" } }, [
          _vm._v("Users (" + _vm._s(_vm.users.length) + ")")
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-63080d70", module.exports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(66)
/* template */
var __vue_template__ = __webpack_require__(67)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/admin/Users.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24d856e1", Component.options)
  } else {
    hotAPI.reload("data-v-24d856e1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            users: []
        };
    },
    beforeMount: function beforeMount() {
        var _this = this;

        axios.get('/api/users/').then(function (response) {
            _this.users = response.data;
        }).catch(function (error) {
            console.error(error);
        });
    }
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("table", { staticClass: "table table-responsive table-striped" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "tbody",
        _vm._l(_vm.users, function(user, index) {
          return _c("tr", { on: { key: index } }, [
            _c("td", [_vm._v(_vm._s(index + 1))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(user.name))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(user.email))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(user.created_at))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(user.orders.length))])
          ])
        }),
        0
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("td"),
        _vm._v(" "),
        _c("td", [_vm._v("Name")]),
        _vm._v(" "),
        _c("td", [_vm._v("Email")]),
        _vm._v(" "),
        _c("td", [_vm._v("Joined")]),
        _vm._v(" "),
        _c("td", [_vm._v("Total Orders")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-24d856e1", module.exports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(69)
/* template */
var __vue_template__ = __webpack_require__(75)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/admin/Products.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2739241b", Component.options)
  } else {
    hotAPI.reload("data-v-2739241b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProductModal__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProductModal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ProductModal__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            products: [],
            editingItem: null,
            addingProduct: null
        };
    },

    components: {
        Modal: __WEBPACK_IMPORTED_MODULE_0__ProductModal___default.a
    },
    beforeMount: function beforeMount() {
        var _this = this;

        axios.get('/api/products/').then(function (response) {
            _this.products = response.data;
        }).catch(function (error) {
            console.error(error);
        });
    },

    methods: {
        newProduct: function newProduct() {
            this.addingProduct = {
                name: null,
                units: null,
                price: null,
                description: null,
                image: null
            };
        },
        endEditing: function endEditing(product) {
            var _this2 = this;

            this.editingItem = null;
            var index = this.products.indexOf(product);
            axios.put('/api/products/' + product.id, {
                name: product.name,
                units: product.units,
                price: product.price,
                description: product.description
            }).then(function (response) {
                _this2.products[index] = product;
            }).catch(function (response) {});
        },
        addProduct: function addProduct(product) {
            var _this3 = this;

            this.addingProduct = null;
            axios.post("/api/products/", {
                name: product.name,
                units: product.units,
                price: product.price,
                description: product.description,
                image: product.image
            }).then(function (response) {
                _this3.products.push(product);
            }).catch(function (response) {});
        }
    }
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(71)
}
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(73)
/* template */
var __vue_template__ = __webpack_require__(74)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-63afc935"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/admin/ProductModal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63afc935", Component.options)
  } else {
    hotAPI.reload("data-v-63afc935", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(55)("27f8370a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63afc935\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ProductModal.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63afc935\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ProductModal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(46)(false);
// imports


// module
exports.push([module.i, "\n.modal-mask[data-v-63afc935] {\r\n  position: fixed;\r\n  z-index: 9998;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0, .5);\r\n  display: table;\r\n  -webkit-transition: opacity .3s ease;\r\n  transition: opacity .3s ease;\n}\n.modal-wrapper[data-v-63afc935] {\r\n  display: table-cell;\r\n  vertical-align: middle;\n}\n.modal-container[data-v-63afc935] {\r\n  width: 300px;\r\n  margin: 0px auto;\r\n  padding: 20px 30px;\r\n  background-color: #fff;\r\n  border-radius: 2px;\r\n  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, .33);\r\n          box-shadow: 0 2px 8px rgba(0, 0, 0, .33);\r\n  -webkit-transition: all .3s ease;\r\n  transition: all .3s ease;\r\n  font-family: Helvetica, Arial, sans-serif;\n}\n.modal-header h3[data-v-63afc935] {\r\n  margin-top: 0;\r\n  color: #42b983;\n}\n.modal-body[data-v-63afc935] {\r\n  margin: 20px 0;\n}\n.modal-default-button[data-v-63afc935] {\r\n  float: right;\n}\n.modal-enter[data-v-63afc935] {\r\n  opacity: 0;\n}\n.modal-leave-active[data-v-63afc935] {\r\n  opacity: 0;\n}\n.modal-enter .modal-container[data-v-63afc935],\r\n.modal-leave-active .modal-container[data-v-63afc935] {\r\n  -webkit-transform: scale(1.1);\r\n  transform: scale(1.1);\n}\r\n", ""]);

// exports


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['product'],
  data: function data() {
    return {
      attachment: null
    };
  },

  computed: {
    data: function data() {
      if (this.product != null) {
        return this.product;
      } else {
        return {
          name: "",
          units: "",
          price: "",
          description: "",
          image: false

        };
      }
    }
  },
  methods: {
    attachFile: function attachFile(event) {
      this.attachment = event.target.files[0];
    },
    uploadFile: function uploadFile(event) {
      var _this = this;

      if (this.attachment != null) {
        var formData = new FormData();
        formData.append("image", this.attachment);
        axios.post("/api/upload-file", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          _this.product.image = response.data;
          _this.$emit('close', _this.product);
        });
      } else {
        this.$emit('close', this.product);
      }
    }
  }
});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "modal-mask" }, [
    _c("div", { staticClass: "modal-wrapper" }, [
      _c("div", { staticClass: "modal-container" }, [
        _c("div", { staticClass: "modal-header" }, [_vm._t("header")], 2),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "modal-body" },
          [
            _vm._t("body", [
              _vm._v("\n          Name: "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.data.name,
                    expression: "data.name"
                  }
                ],
                attrs: { type: "text" },
                domProps: { value: _vm.data.name },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.data, "name", $event.target.value)
                  }
                }
              }),
              _vm._v("\n          Units: "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.data.units,
                    expression: "data.units"
                  }
                ],
                attrs: { type: "text" },
                domProps: { value: _vm.data.units },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.data, "units", $event.target.value)
                  }
                }
              }),
              _vm._v("\n          Price: "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.data.price,
                    expression: "data.price"
                  }
                ],
                attrs: { type: "text" },
                domProps: { value: _vm.data.price },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.data, "price", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("textarea", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.data.description,
                    expression: "data.description"
                  }
                ],
                attrs: { placeholder: "description" },
                domProps: { value: _vm.data.description },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.data, "description", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("span", [
                _c("img", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.data.image != null,
                      expression: "data.image != null"
                    }
                  ],
                  attrs: { src: _vm.data.image }
                }),
                _vm._v(" "),
                _c("input", {
                  attrs: { type: "file", id: "file" },
                  on: { change: _vm.attachFile }
                })
              ])
            ])
          ],
          2
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "modal-footer" },
          [
            _vm._t("footer", [
              _c(
                "button",
                {
                  staticClass: "modal-default-button",
                  on: { click: _vm.uploadFile }
                },
                [_vm._v("\n            Finish\n          ")]
              )
            ])
          ],
          2
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-63afc935", module.exports)
  }
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("table", { staticClass: "table table-responsive table-striped" }, [
        _vm._m(0),
        _vm._v(" "),
        _c(
          "tbody",
          _vm._l(_vm.products, function(product, index) {
            return _c(
              "tr",
              {
                on: {
                  key: index,
                  dblclick: function($event) {
                    _vm.editingItem = product
                  }
                }
              },
              [
                _c("td", [_vm._v(_vm._s(index + 1))]),
                _vm._v(" "),
                _c("td", { domProps: { innerHTML: _vm._s(product.name) } }),
                _vm._v(" "),
                _c(
                  "td",
                  {
                    model: {
                      value: product.units,
                      callback: function($$v) {
                        _vm.$set(product, "units", $$v)
                      },
                      expression: "product.units"
                    }
                  },
                  [_vm._v(_vm._s(product.units))]
                ),
                _vm._v(" "),
                _c(
                  "td",
                  {
                    model: {
                      value: product.price,
                      callback: function($$v) {
                        _vm.$set(product, "price", $$v)
                      },
                      expression: "product.price"
                    }
                  },
                  [_vm._v(_vm._s(product.price))]
                ),
                _vm._v(" "),
                _c(
                  "td",
                  {
                    model: {
                      value: product.price,
                      callback: function($$v) {
                        _vm.$set(product, "price", $$v)
                      },
                      expression: "product.price"
                    }
                  },
                  [_vm._v(_vm._s(product.description))]
                )
              ]
            )
          }),
          0
        )
      ]),
      _vm._v(" "),
      _c("modal", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.editingItem != null,
            expression: "editingItem != null"
          }
        ],
        attrs: { product: _vm.editingItem },
        on: { close: _vm.endEditing }
      }),
      _vm._v(" "),
      _c("modal", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.addingProduct != null,
            expression: "addingProduct != null"
          }
        ],
        attrs: { product: _vm.addingProduct },
        on: { close: _vm.addProduct }
      }),
      _vm._v(" "),
      _c("br"),
      _vm._v(" "),
      _c(
        "button",
        { staticClass: "btn btn-primary", on: { click: _vm.newProduct } },
        [_vm._v("Add New Product")]
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("td"),
        _vm._v(" "),
        _c("td", [_vm._v("Product")]),
        _vm._v(" "),
        _c("td", [_vm._v("Units")]),
        _vm._v(" "),
        _c("td", [_vm._v("Price")]),
        _vm._v(" "),
        _c("td", [_vm._v("Description")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2739241b", module.exports)
  }
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(77)
/* template */
var __vue_template__ = __webpack_require__(78)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/admin/Orders.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-129a08dc", Component.options)
  } else {
    hotAPI.reload("data-v-129a08dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            orders: []
        };
    },
    beforeMount: function beforeMount() {
        var _this = this;

        axios.get('/api/orders/').then(function (response) {
            _this.orders = response.data;
        }).catch(function (error) {
            console.error(error);
        });
    },

    methods: {
        deliver: function deliver(index) {
            var _this2 = this;

            var order = this.orders[index];
            axios.patch('/api/orders/' + order.id + '/deliver').then(function (response) {
                _this2.orders[index].is_delivered = 1;
                _this2.$forceUpdate();
            }).catch(function (error) {
                console.error(error);
            });
        }
    }
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("table", { staticClass: "table table-responsive table-striped" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "tbody",
        _vm._l(_vm.orders, function(order, index) {
          return _c("tr", { on: { key: index } }, [
            _c("td", [_vm._v(_vm._s(index + 1))]),
            _vm._v(" "),
            _c("td", { domProps: { innerHTML: _vm._s(order.product.name) } }),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(order.quantity))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(order.quantity * order.product.price))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(order.address))]),
            _vm._v(" "),
            _c("td", [_vm._v(_vm._s(order.is_delivered == 1 ? "Yes" : "No"))]),
            _vm._v(" "),
            order.is_delivered == 0
              ? _c("td", [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-success",
                      on: {
                        click: function($event) {
                          return _vm.deliver(index)
                        }
                      }
                    },
                    [_vm._v("Deliver")]
                  )
                ])
              : _vm._e()
          ])
        }),
        0
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("td"),
        _vm._v(" "),
        _c("td", [_vm._v("Product")]),
        _vm._v(" "),
        _c("td", [_vm._v("Quantity")]),
        _vm._v(" "),
        _c("td", [_vm._v("Cost")]),
        _vm._v(" "),
        _c("td", [_vm._v("Delivery Address")]),
        _vm._v(" "),
        _c("td", [_vm._v("is Delivered?")]),
        _vm._v(" "),
        _c("td", [_vm._v("Action")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-129a08dc", module.exports)
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "container" }, [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-3" }, [
          _c("ul", { staticStyle: { "list-style-type": "none" } }, [
            _c("li", { staticClass: "active" }, [
              _c(
                "button",
                {
                  staticClass: "btn",
                  on: {
                    click: function($event) {
                      return _vm.setComponent("main")
                    }
                  }
                },
                [_vm._v("Dashboard")]
              )
            ]),
            _vm._v(" "),
            _c("li", [
              _c(
                "button",
                {
                  staticClass: "btn",
                  on: {
                    click: function($event) {
                      return _vm.setComponent("orders")
                    }
                  }
                },
                [_vm._v("Orders")]
              )
            ]),
            _vm._v(" "),
            _c("li", [
              _c(
                "button",
                {
                  staticClass: "btn",
                  on: {
                    click: function($event) {
                      return _vm.setComponent("products")
                    }
                  }
                },
                [_vm._v("Products")]
              )
            ]),
            _vm._v(" "),
            _c("li", [
              _c(
                "button",
                {
                  staticClass: "btn",
                  on: {
                    click: function($event) {
                      return _vm.setComponent("users")
                    }
                  }
                },
                [_vm._v("Users")]
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-md-9" },
          [_c(_vm.activeComponent, { tag: "component" })],
          1
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass:
          "container-fluid hero-section d-flex align-content-center justify-content-center flex-wrap ml-auto"
      },
      [_c("h2", { staticClass: "title" }, [_vm._v("Admin Dashboard")])]
    )
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ca2e4be8", module.exports)
  }
}

/***/ })
]));