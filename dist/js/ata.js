!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r={sectionsHook:"[data-section]",sectionsStateClass:"is-visible"},o={navTriggerHook:".hamburger",navTriggerStateClass:"is-active",navStateClass:"nav-is-open"};document.addEventListener("DOMContentLoaded",(function(){for(var e=document.querySelectorAll(o.navTriggerHook),t=e.length,n=function(n){var r=e[n],s=o.navTriggerStateClass,a=(n+1)%t;r.addEventListener("click",(function(){var t,n,i;(n=document.body,i=o.navStateClass,n.classList.contains(i)?(n.classList.remove(i),t=!1):(n.classList.add(i),t=!0),t)?(r.classList.add(s),e[a].classList.add(s)):(r.classList.remove(s),e[a].classList.remove(s))}),!1)},s=0;s<t;s++)n(s);var a=document.querySelectorAll(r.sectionsHook),i=r.sectionsStateClass;setTimeout((function(){for(var e=0;e<a.length;e++){a[e].classList.add(i)}}),800)}))}]);