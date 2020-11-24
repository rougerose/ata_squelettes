/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/ataConfig.js":
/*!*****************************!*\
  !*** ./src/js/ataConfig.js ***!
  \*****************************/
/*! exports provided: config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"config\", function() { return config; });\nvar config = {\n  sections: {\n    sectionsHook: \"[data-section]\",\n    sectionsStateClass: \"is-visible\"\n  },\n  header: {\n    navTriggerHook: \".hamburger\",\n    navTriggerStateClass: \"is-active\",\n    navStateClass: \"nav-is-open\"\n  }\n};\n\n//# sourceURL=webpack:///./src/js/ataConfig.js?");

/***/ }),

/***/ "./src/js/components/navState.js":
/*!***************************************!*\
  !*** ./src/js/components/navState.js ***!
  \***************************************/
/*! exports provided: navState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"navState\", function() { return navState; });\n/* harmony import */ var _ataConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ataConfig */ \"./src/js/ataConfig.js\");\n\nvar navState = function navState() {\n  var body = document.body;\n  var state;\n  var navStateClass = _ataConfig__WEBPACK_IMPORTED_MODULE_0__[\"config\"].header.navStateClass;\n\n  if (body.classList.contains(navStateClass)) {\n    body.classList.remove(navStateClass);\n    state = false;\n  } else {\n    body.classList.add(navStateClass);\n    state = true;\n  }\n\n  return state;\n};\n\n//# sourceURL=webpack:///./src/js/components/navState.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ataConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ataConfig */ \"./src/js/ataConfig.js\");\n/* harmony import */ var _components_navState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/navState */ \"./src/js/components/navState.js\");\n\n\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  // Nav_Trigger : handle click event\n  // ==================================\n  var navTriggers = document.querySelectorAll(_ataConfig__WEBPACK_IMPORTED_MODULE_1__[\"config\"].header.navTriggerHook);\n  var total = navTriggers.length;\n\n  var _loop = function _loop(i) {\n    var navTrigger = navTriggers[i];\n    var navTriggerStateClass = _ataConfig__WEBPACK_IMPORTED_MODULE_1__[\"config\"].header.navTriggerStateClass; // Identifier l'autre bouton (sur un total de 2)\n    // afin de gérer son état également lors du clic\n\n    var i_alt = (i + 1) % total;\n    navTrigger.addEventListener(\"click\", function () {\n      var open = Object(_components_navState__WEBPACK_IMPORTED_MODULE_2__[\"navState\"])();\n\n      if (open) {\n        navTrigger.classList.add(navTriggerStateClass);\n        navTriggers[i_alt].classList.add(navTriggerStateClass);\n      } else {\n        navTrigger.classList.remove(navTriggerStateClass);\n        navTriggers[i_alt].classList.remove(navTriggerStateClass);\n      }\n    }, false);\n  };\n\n  for (var i = 0; i < total; i++) {\n    _loop(i);\n  } // Animation sections (header, main and footer)\n  // ================================================\n\n\n  var pageSections = document.querySelectorAll(_ataConfig__WEBPACK_IMPORTED_MODULE_1__[\"config\"].sections.sectionsHook);\n  var sectionClass = _ataConfig__WEBPACK_IMPORTED_MODULE_1__[\"config\"].sections.sectionsStateClass;\n  setTimeout(function () {\n    for (var _i = 0; _i < pageSections.length; _i++) {\n      var section = pageSections[_i];\n      section.classList.add(sectionClass);\n    }\n  }, 800);\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = jQuery;\n\n//# sourceURL=webpack:///external_%22jQuery%22?");

/***/ })

/******/ });