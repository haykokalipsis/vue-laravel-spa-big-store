webpackJsonp([5],{

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(80)
}
var normalizeComponent = __webpack_require__(13)
/* script */
var __vue_script__ = __webpack_require__(82)
/* template */
var __vue_template__ = __webpack_require__(83)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7b3dab19"
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
Component.options.__file = "resources/assets/js/views/Checkout.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b3dab19", Component.options)
  } else {
    hotAPI.reload("data-v-7b3dab19", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 55:
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

/***/ 56:
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

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(55)("1096fa1d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b3dab19\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Checkout.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b3dab19\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Checkout.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(46)(false);
// imports


// module
exports.push([module.i, "\n.small-text[data-v-7b3dab19] {\n    font-size: 18px;\n}\n.order-box[data-v-7b3dab19] {\n    border: 1px solid #cccccc;\n    padding: 10px 15px;\n}\n.title[data-v-7b3dab19] {\n    font-size: 36px;\n}\n", ""]);

// exports


/***/ }),

/***/ 82:
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
//
//
//
//
//

/*
* Above we defined the beforeMount method where we fetch product information.
* Then we have the mounted method where we check authentication status.
* In the methods property, we defined the checkUnits method that checks how many units the user wants to order,
* and then we define the placeOrder method that places the order.
*/

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['pid'],
    data: function data() {
        return {
            address: "",
            quantity: 1,
            isLoggedIn: null,
            product: []
        };
    },
    mounted: function mounted() {
        this.isLoggedIn = localStorage.getItem('jwt') != null;
    },
    beforeMount: function beforeMount() {
        var _this = this;

        axios.get('/api/products/' + this.pid).then(function (response) {
            _this.product = response.data;
        }).catch(function (error) {
            console.error(error);
        });
        if (localStorage.getItem('jwt') != null) {
            this.user = JSON.parse(localStorage.getItem('user'));
            axios.defaults.headers.common['Content-Type'] = 'application/json';
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');
        }
    },


    methods: {
        login: function login() {
            this.$router.push({ name: 'login', params: { nextUrl: this.$route.fullPath } });
        },
        register: function register() {
            this.$router.push({ name: 'register', params: { nextUrl: this.$route.fullPath } });
        },
        placeOrder: function placeOrder(e) {
            var _this2 = this;

            e.preventDefault();
            axios.post('api/orders/', {
                address: this.address,
                quantity: this.quantity,
                product: this.product.id
            }).then(function (response) {
                _this2.$router.push('/confirmation');
            }).catch(function (error) {
                console.error(error);
            });
        },
        checkUnits: function checkUnits(e) {
            if (this.quantity > this.product.units) {
                this.quantity = this.product.units;
            }
        }
    }
});

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container" }, [
    _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col-md-8 offset-md-2" }, [
        _c("div", { staticClass: "order-box" }, [
          _c("img", {
            attrs: { src: _vm.product.image, alt: _vm.product.name }
          }),
          _vm._v(" "),
          _c("h2", {
            staticClass: "title",
            domProps: { innerHTML: _vm._s(_vm.product.name) }
          }),
          _vm._v(" "),
          _c("p", { staticClass: "small-text text-muted float-left" }, [
            _vm._v("$ " + _vm._s(_vm.product.price))
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "small-text text-muted float-right" }, [
            _vm._v("Available Units: " + _vm._s(_vm.product.units))
          ]),
          _vm._v(" "),
          _c("br"),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c("label", { staticClass: "row" }, [
            _c("span", { staticClass: "col-md-2 float-left" }, [
              _vm._v("Quantity: ")
            ]),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.quantity,
                  expression: "quantity"
                }
              ],
              staticClass: "col-md-2 float-left",
              attrs: {
                type: "number",
                name: "units",
                min: "1",
                max: _vm.product.units
              },
              domProps: { value: _vm.quantity },
              on: {
                change: _vm.checkUnits,
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.quantity = $event.target.value
                }
              }
            })
          ])
        ]),
        _vm._v(" "),
        _c("br"),
        _vm._v(" "),
        _c("div", [
          !_vm.isLoggedIn
            ? _c("div", [
                _c("h2", [_vm._v("You need to login to continue")]),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "col-md-4 btn btn-primary float-left",
                    on: { click: _vm.login }
                  },
                  [_vm._v("Login")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "col-md-4 btn btn-danger float-right",
                    on: { click: _vm.register }
                  },
                  [_vm._v("Create an account")]
                )
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.isLoggedIn
            ? _c("div", [
                _c("div", { staticClass: "row" }, [
                  _c(
                    "label",
                    {
                      staticClass: "col-md-3 col-form-label",
                      attrs: { for: "address" }
                    },
                    [_vm._v("Delivery Address")]
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-9" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.address,
                          expression: "address"
                        }
                      ],
                      staticClass: "form-control",
                      attrs: { id: "address", type: "text", required: "" },
                      domProps: { value: _vm.address },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.address = $event.target.value
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("br"),
                _vm._v(" "),
                _vm.isLoggedIn
                  ? _c(
                      "button",
                      {
                        staticClass:
                          "col-md-4 btn btn-sm btn-success float-right",
                        on: { click: _vm.placeOrder }
                      },
                      [_vm._v("Continue")]
                    )
                  : _vm._e()
              ])
            : _vm._e()
        ])
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
    require("vue-hot-reload-api")      .rerender("data-v-7b3dab19", module.exports)
  }
}

/***/ })

});