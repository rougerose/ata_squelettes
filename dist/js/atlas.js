!function(t){const e={xs:34,s:44,m:54,l:64,xl:74,xxl:84},i="#SearchBox",s="mp-Keywords_Item",a="mp-Keywords_Item-selected";var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function n(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var r=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},l="object"==typeof o&&o&&o.Object===Object&&o,d="object"==typeof self&&self&&self.Object===Object&&self,h=l||d||Function("return this")(),c=h,u=/\s/,p=/^\s+/,b=h.Symbol,m=b,y=Object.prototype,_=y.hasOwnProperty,f=y.toString,g=m?m.toStringTag:void 0,w=Object.prototype.toString,v=b?b.toStringTag:void 0,k=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":v&&v in Object(t)?function(t){var e=_.call(t,g),i=t[g];try{t[g]=void 0;var s=!0}catch(t){}var a=f.call(t);return s&&(e?t[g]=i:delete t[g]),a}(t):function(t){return w.call(t)}(t)},x=r,A=/^[-+]0x[0-9a-f]+$/i,S=/^0b[01]+$/i,I=/^0o[0-7]+$/i,O=parseInt,T=r,E=function(){return c.Date.now()},C=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&"[object Symbol]"==k(t)}(t))return NaN;if(x(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=x(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;var i;t=(i=t)?i.slice(0,function(t){for(var e=t.length;e--&&u.test(t.charAt(e)););return e}(i)+1).replace(p,""):i;var s=S.test(t);return s||I.test(t)?O(t.slice(2),s?2:8):A.test(t)?NaN:+t},M=Math.max,K=Math.min,P=function(t,e,i){var s,a,o,n,r,l,d=0,h=!1,c=!1,u=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(e){var i=s,o=a;return s=a=void 0,d=e,n=t.apply(o,i)}function b(t){var i=t-l;return void 0===l||i>=e||i<0||c&&t-d>=o}function m(){var t=E();if(b(t))return y(t);r=setTimeout(m,function(t){var i=e-(t-l);return c?K(i,o-(t-d)):i}(t))}function y(t){return r=void 0,u&&s?p(t):(s=a=void 0,n)}function _(){var t=E(),i=b(t);if(s=arguments,a=this,l=t,i){if(void 0===r)return function(t){return d=t,r=setTimeout(m,e),h?p(t):n}(l);if(c)return clearTimeout(r),r=setTimeout(m,e),p(l)}return void 0===r&&(r=setTimeout(m,e)),n}return e=C(e)||0,T(i)&&(h=!!i.leading,o=(c="maxWait"in i)?M(C(i.maxWait)||0,e):o,u="trailing"in i?!!i.trailing:u),_.cancel=function(){void 0!==r&&clearTimeout(r),d=0,s=l=a=r=void 0},_.flush=function(){return void 0===r?n:y(E())},_},H=n(P);const j=["hide","show"];class W{constructor(t){if(!t||!t.nodeName)throw new Error("No DOM node provided. Abort.");this.el=t,this._tablist={},this._callbacks={},this._handleDisplay=this._handleDisplay.bind(this),this._handleFocus=this._handleFocus.bind(this),this._handleTab=this._handleTab.bind(this),this._handlePanelFocus=this._handlePanelFocus.bind(this),this._handlePanel=this._handlePanel.bind(this)}_firstActiveTab(){let t;for(let e=0;e<this._tablist.tabs.length;e++)if(!this._tablist.tabs[e].disabled){t=e;break}return t}_handleDisplay(t){t.preventDefault();const e=t.currentTarget;e.disabled||(e!==document.activeElement&&e.focus(),this._toggleDisplay(this._tablist.tabs.indexOf(e)))}_handleFocus(t){const e=t.currentTarget;e.disabled||(this._tablist.currentTabIndex=this._tablist.tabs.indexOf(e),this._select(this._tablist.tabs[this._tablist.currentTabIndex]))}_handlePanel(t){switch(void 0===this._tablist.currentTabIndex&&this._handlePanelFocus(t),t.keyCode){case 33:t.ctrlKey&&(t.preventDefault(),this._switchTab(this._tablist.currentTabIndex-1));break;case 34:t.ctrlKey&&(t.preventDefault(),this._switchTab(this._tablist.currentTabIndex+1));break;case 38:t.ctrlKey&&(t.preventDefault(),this._switchTab(this._tablist.currentTabIndex))}}_handlePanelFocus(t){if(t.target.doubleFocus)return t.preventDefault(),void delete t.target.doubleFocus;const e=t.currentTarget;this._tablist.currentTabIndex=this._tablist.tabPanels.indexOf(e),["radio","checkbox"].indexOf(t.target.type)>=0&&(t.target.doubleFocus=!0)}_handleTab(t){switch(void 0===this._tablist.currentTabIndex&&this._handleFocus(t),t.keyCode){case 32:case 13:this._handleDisplay(t);break;case 35:t.preventDefault(),this._switchTab(this._tablist.tabs.length-1);break;case 36:t.preventDefault(),this._switchTab(this._firstActiveTab());break;case 37:case 38:t.preventDefault(),this._switchTab(this._tablist.currentTabIndex-1);break;case 39:case 40:t.preventDefault(),this._switchTab(this._tablist.currentTabIndex+1)}}_noop(){}_select(t){this._tablist.tabs.forEach(((e,i)=>{const s=t===e;e.setAttribute("aria-selected",s),e.setAttribute("tabindex",s?0:-1),s&&this._toggleDisplay(i)}))}_switchTab(t){if(this._tablist.tabs[t]&&this._tablist.tabs[t].disabled){const e=t>this._tablist.currentTabIndex?t+1:t-1;this._switchTab(e)}else this._tablist.currentTabIndex=t,this._tablist.currentTabIndex<this._firstActiveTab()?this._tablist.currentTabIndex=this._tablist.tabsLength-1:this._tablist.currentTabIndex>=this._tablist.tabsLength&&(this._tablist.currentTabIndex=this._firstActiveTab()),this._tablist.tabs[this._tablist.currentTabIndex].focus()}_toggleDisplay(t,e=!0){if(e&&t===this._tablist.openedIndex)return;const i=this._tablist.tabs[t],s=this._tablist.tabPanels[t];e&&void 0!==this._tablist.openedIndex&&this._toggleDisplay(this._tablist.openedIndex,!1),s.setAttribute("aria-hidden",!e),e?(this._tablist.openedIndex=t,void 0!==this._tablist.openedIndex&&this._trigger("show",[i,s])):void 0!==this._tablist.openedIndex&&this._trigger("hide",[i,s])}_trigger(t,e){this._callbacks[t]&&this._callbacks[t].forEach((t=>{t.apply(this,e)}))}mount(){let t;this._tablist.tabs=[],this._tablist.tabPanels=[],Array.from(this.el.querySelectorAll("[role=tab]")).forEach(((e,i)=>{const s=e.getAttribute("aria-controls");let a,o=!1;if(s?a=document.getElementById(s):e.nextElementSibling&&e.nextElementSibling.getAttribute("aria-labelledby")===e.id&&(a=e.nextElementSibling),!a)throw new Error(`Could not find associated tabpanel for tab ${e.id}. Use [aria-controls="tabpanelId"] on the [role="tab"] element to link them together`);this._tablist.tabs.push(e),this._tablist.tabPanels.push(a),e.disabled=e.hasAttribute("disabled")||"true"===e.getAttribute("aria-disabled"),"true"!==e.getAttribute("data-open")||e.disabled||void 0===this._tablist.openedIndex&&(this._toggleDisplay(i,!0),o=!0),e.removeAttribute("data-open"),void 0!==t||e.disabled||(t=i),e.setAttribute("tabindex",-1),a.setAttribute("aria-hidden",!o),e.addEventListener("click",this._handleDisplay),e.addEventListener("focus",this._handleFocus),e.addEventListener("keydown",this._handleTab),a.addEventListener("focus",this._handlePanelFocus,!0),a.addEventListener("keydown",this._handlePanel)})),this._tablist.tabsLength=this._tablist.tabs.length,this._tablist.tabPanelsLength=this._tablist.tabPanels.length,void 0!==this._tablist.openedIndex?(this._tablist.tabs[this._tablist.openedIndex].setAttribute("tabindex",0),this._tablist.tabs[this._tablist.openedIndex].setAttribute("aria-selected","true")):(this._toggleDisplay(t,!0),this._tablist.tabs[t].setAttribute("tabindex",0),this._tablist.tabs[t].setAttribute("aria-selected","true"))}off(t,e){if(!this._callbacks[t])return;const i=this._callbacks[t].indexOf(e);i<0||this._callbacks[t].splice(i,1)}on(t,e){j.indexOf(t)<0||(this._callbacks[t]||(this._callbacks[t]=[]),this._callbacks[t].push(e))}get current(){return{tab:this._tablist.tabs[this._tablist.openedIndex],tabPanel:this._tablist.tabPanels[this._tablist.openedIndex]}}unmount(){this._tablist.tabs.forEach(((t,e)=>{const i=this._tablist.tabPanels[e];t.removeEventListener("click",this._handleDisplay),t.removeEventListener("focus",this._handleFocus),t.removeEventListener("keydown",this._handleTab),t.removeAttribute("tabindex"),t.removeAttribute("aria-selected"),i.removeEventListener("focus",this._handlePanelFocus,!0),i.removeEventListener("keydown",this._handlePanel),i.setAttribute("aria-hidden","false")})),this._tablist={}}}class B{constructor(t,e,i){this.map=t,this.configMap(),this.handleResize=this._handleResize.bind(this),window.addEventListener("resize",H(this.handleResize,250)),this.container=document.getElementById(i.containerId),this.dispatch=i.dispatch,this.state=e,this.memory={};const s=i.controls,a=this.container,o=this.dispatch;this.controls=s.map((t=>new t(e,{container:a,dispatch:o})));const n=this.container.querySelector("#Tab ul[role='tablist']");n&&new W(n).mount()}configMap(){L.Util.setOptions(this.map,{tap:!1}),L.Control.Attribution.prototype.options.position="bottomleft",L.Control.Zoom.prototype.options.position="bottomright";const t=L.easyButton({position:"bottomright",states:[{stateName:"add-association",icon:'<span class="mp-ControlAddBtn"> </span>',onClick:function(){location.href="https://docs.google.com/forms/d/e/1FAIpQLSdSSlbwy710Qu9XRhUwpzyZ2BjKXnzZV8S4Z62CjaKaEYwWYw/viewform"}}]});t.button.title="Ajouter une association",t.addTo(this.map);let e=()=>{this.setInitialState(),this._handleClickMarker(),this.map.options.openId&&(this.map.options.openId,this.dispatch({type:"addModalContent",openId:this.map.options.openId,modalId:"modalAssociation"})),jQuery("#"+this.map._container.id).off("ready",e)};jQuery("#"+this.map._container.id).on("ready",e),this.map.options.cluster&&(this.map.options.clusterOptions.iconCreateFunction=this.clusterIcon)}clusterIcon(t){const i=e;let s,a,o;return o=t.getChildCount(),o<=3?(a="-xs",s=i.xs):o<=10?(a="-s",s=i.s):o<=50?(a="-m",s=i.m):o<=100?(a="-l",s=i.l):o<=250?(a="-xl",s=i.xl):(a="-xxl",s=i.xxl),new L.DivIcon({html:"<div><span>"+o+"</span></div>",className:"mp-MarkerCluster mp-MarkerCluster"+a,iconSize:new L.Point(s,s)})}syncState(t){t.keywordsSelected.size!==this.state.keywordsSelected.size&&(0!==t.keywordsSelected.size?(this.searchCollection(t.keywordsSelected),this.state=t):(this.resetMap(),this.state=t)),Object.keys(t.centerMarker).length>0&&this.centerOnMarker(t.centerMarker.id),""!==t.moveZoom&&this.moveZoom(t.moveZoom),this.state=t;for(let e of this.controls)e.syncState(t)}setInitialState(){const t=this;t.state.windowWidth||t.dispatch({type:"updateWindowWidth",windowWidth:t._getWindowWidth()})}_handleResize(t){this._checkWindowWidth()}_handleClickMarker(){const t=this;let e={},i=function(e){t.dispatch({type:"addModalContent",openId:this.feature.id,modalId:"modalAssociation"}),t.dispatch({type:"centerOnMarker",id:this.feature.id})};this.map.markerCluster.eachLayer((t=>{e[t.id]=t,t.on("click",i)})),this.memory.markers=e}_getWindowWidth(){return window.innerWidth>=768?"desktop":"mobile"}_checkWindowWidth(){let t=this._getWindowWidth();this.state.windowWidth!==t&&this.dispatch({type:"updateWindowWidth",windowWidth:t})}handleAction(t,e){0==t.keywords.size&&t.keywordsSelected.size>0&&(t.keywordsSelected=new Map);let i,s,a=this.state;switch(a.modalAction="",a.modalArgs={},a.modalOpenId="",a.modalId="",a.centerMarker={},a.moveZoom="",e.type){case"addKeyword":i=new Map(t.keywords),s=new Map(t.keywordsSelected),i.set(e.keyword.value,e.keyword.label),s.set(e.keyword.value,e.keyword.label),t=Object.assign({},a,{keywords:i,keywordsSelected:s});break;case"removeKeywordSelected":i=new Map(t.keywords),s=new Map(t.keywordsSelected),i.delete(e.keyword.value),s.delete(e.keyword.value),t=Object.assign({},a,{keywords:i,keywordsSelected:s});break;case"addModalContent":e.action="addModalContent",e.modalId=e.modalId,e.openId=e.openId||"",e.args=e.args||{},t=Object.assign({},a,{modalAction:e.action,modalOpenId:e.openId,modalArgs:e.args,modalId:e.modalId});break;case"updateModalPosition":e.action=e.action||"",e.modalId=e.modalId||"",e.openId=e.openId||"",e.args=e.args||{},t=Object.assign({},a,{modalAction:e.action,modalOpenId:e.openId,modalArgs:e.args,modalId:e.modalId});break;case"updateWindowWidth":t=Object.assign({},a,{windowWidth:e.windowWidth});break;case"updateSearchboxHeight":e.searchboxHeight||(e.searchboxHeight=null),t=Object.assign({},a,{searchboxHeight:e.searchboxHeight});break;case"centerOnMarker":t=Object.assign({},a,{centerMarker:{id:e.id}});break;case"moveZoom":t=Object.assign({},a,{moveZoom:e.height})}return t}autocompleteAddKeyword(t){this.dispatch({type:"addKeyword",keyword:t})}centerOnMarker(t){const e=this,s=this.memory.markers[t];this.map.getZoom(),this.map.markerCluster.zoomToShowLayer(s,(function(){const t=s._latlng,a=s.__parent.getBounds(),o=e.map.getBoundsZoom(a);if("desktop"===e.state.windowWidth){const s=e.container.querySelector(i).offsetWidth,a=L.latLngBounds([t]),n={paddingTopLeft:[s,10],maxZoom:o};e.map.fitBounds(a,n)}else e.map.setView(t,o);s.openPopup()}))}moveZoom(t){this.map.zoomControl.getContainer().parentElement.style.transform="translateY("+t+"px)"}resetMap(){this.map.removeAllMarkers(),this.map.loadData(),this.dispatch({type:"updateModalPosition",action:"closeModals"}),jQuery("#"+this.map._container.id).on("ready",(()=>{this._handleClickMarker()}))}createQuery(t){let e={id_association:[],id_mot:[],id_adresse:[],limit:this.map.options.json_points.limit};for(const[i]of t){const t=i.split(":"),s=e[t[0]].length;e[t[0]][s]=t[1]}return e}searchCollection(t){const e=this,i=e.map;let s=e.createQuery(t);s=jQuery.param(s);let a=jQuery.getJSON("http.api/collectionjson/associations",s),o={id_association:[]};a.done((function(t){let s=t.collection.items;for(const t in s)Object.hasOwnProperty.call(s,t)&&o.id_association.push(s[t].data[0].value);let a={};jQuery.extend(!0,a,i.options.json_points.env,o),a.objets="associations_recherche",a.limit=i.options.json_points.limit,e.searchFeatures(i.options.json_points.url,a)})),a.fail((function(t,i,s){o.id_association.push(0),e.dispatch({type:"addModalContent",args:o,modalId:"modalRecherche"})}))}searchFeatures(t,e){const i=this,s=i.map;jQuery.getJSON(t,e,(t=>{if(t){s.removeAllMarkers();let a=[];a=t.features.map((t=>t.geometry.coordinates.slice().reverse()));const o=L.latLngBounds(a);s.parseGeoJson(t),s.fitBounds(o),i._handleClickMarker(),i.dispatch({type:"addModalContent",args:e,modalId:"modalRecherche"})}}))}}class D{constructor(t,{container:e,dispatch:s}){this.state=t,this._container=e.querySelector(i),this._advancedSearchIsOpen=!1,this.dispatch=s,this._initLayout(this._container)}_getHeight(){return this._container.offsetHeight}getWidth(){return this._container.offsetWidth}updateHeight(t){let e=t||this._getHeight();this.dispatch({type:"updateSearchboxHeight",searchboxHeight:e})}_initLayout(t){if(this._inputs=t.querySelectorAll("input[type=text]"),[].forEach.call(this._inputs,(t=>{t.addEventListener("focus",this._handlerInputEvent),t.addEventListener("blur",this._handlerInputEvent)})),this._cancelBtns=t.querySelectorAll("button[type=reset]"),[].forEach.call(this._cancelBtns,(e=>{const i=e.dataset.relId,s=t.querySelector("[data-id='"+i+"']");e.addEventListener("click",this._onclickCancelBtn.bind(s))})),this._advancedSearchBtn=t.querySelector("#openAdvancedSearch"),this._advancedSearchBtn.addEventListener("click",(()=>{this._togglePanels()})),this._panels=t.querySelectorAll(".mp-SearchBox_Panel"),!this._advancedSearchIsOpen)for(let t=0;t<this._panels.length;t++){const e=this._panels[t];0==t?e.setAttribute("aria-hidden","false"):e.setAttribute("aria-hidden","true")}}_togglePanels(){let t=this._advancedSearchIsOpen?0:1;this._advancedSearchIsOpen?(this._advancedSearchBtn.setAttribute("aria-expanded","false"),this._advancedSearchBtn.classList.remove("is-open"),this._advancedSearchIsOpen=!1):(this._advancedSearchBtn.setAttribute("aria-expanded","true"),this._advancedSearchBtn.classList.add("is-open"),this._advancedSearchIsOpen=!0);const e=this._panels[1-t],i=this._panels[t];this.close(e),this.open(i)}close(t){t.setAttribute("aria-hidden","true")}open(t){t.setAttribute("aria-hidden","false"),this.updateHeight()}_handlerInputEvent(t){const e=this.offsetParent;"focus"===t.type?e.classList.add("is-focused"):"blur"===t.type&&""===t.target.value&&e.classList.remove("is-focused")}_onclickCancelBtn(t){t.preventDefault(),this.value=null,this.offsetParent.classList.remove("is-focused")}syncState(t){if(this.state=t,null===this.state.searchboxHeight){let t=this._getHeight();this.state.searchboxHeight=t,this.updateHeight(t)}}}class F{constructor(t,{container:e,dispatch:i}){this.state=t,this.dispatch=i,this.container=e.querySelector("#Keyword"),this.listbox=e.querySelector("#listBox"),this.options={prevKeys:37,nextKeys:39},this._setupOptions(this.options),this._handleClick=this._handleClick.bind(this),this._handleKeydown=this._handleKeydown.bind(this),this._mount()}syncState(t){if(t.keywords.size!==this.state.keywords.size)if(0===t.keywords.size)this._clearTabIndexes(),this._clearAllSelectedItems(),this.state.keywords=t.keywords;else{this._clearTabIndexes(),this._clearAllSelectedItems(),this.state.keywords=t.keywords;for(const[e]of t.keywords){const t=this.listbox.querySelector('li[data-value="'+e+'"]');t&&this._select(t)}}this.state=t}dispatchAction(t,e){this.dispatch({type:t,keyword:e})}add(t){this.state.keywords.has(t.value)||this.dispatchAction("addKeyword",t)}remove(t){this.state.keywords.has(t.value)&&this.dispatchAction("removeKeyword",t)}_setupOptions(t){let e=t||{};e.prevKeys=this._normalizeKeyOptions(e.prevKeys,[38]),e.nextKeys=this._normalizeKeyOptions(e.nextKeys,[40]),e.selectKeys=this._normalizeKeyOptions(e.selectKeys,[13,32]),this.options=e}_normalizeKeyOptions(t,e){return Array.isArray(t)||(t=t?[t]:e),t.map((function(t){return"string"!=typeof t||Number(t)?Number(t):t.charCodeAt(0)}))}_clearTabIndexes(){let t=this.listbox.querySelectorAll("[tabindex]");for(let e=0;e<t.length;e++)t[e].removeAttribute("tabindex")}_clearAllSelectedItems(){let t=this.listbox.querySelectorAll("[aria-selected=true]");for(let e=0;e<t.length;e++)t[e].setAttribute("aria-selected","false")}_handleClick(t){t.preventDefault();let e=this._optionNode(t);e&&this._select(e)}_handleKeydown(t){let e=this._optionNode(t),i=t.keyCode||t.code;e&&(-1!==this.options.selectKeys.indexOf(i)?this._select(e):t.target&&"option"===t.target.getAttribute("role")&&(this._handleKey(e,i,this.options.nextKeys,1),this._handleKey(e,i,this.options.prevKeys,-1)))}_handleKey(t,e,i,s){if(-1!==i.indexOf(e)){const e=this.listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"])'),i=e[Array.prototype.indexOf.call(e,t)+s];i&&(this._clearTabIndexes(),i.setAttribute("tabindex",0),i.focus())}}_mount(){let t=this.listbox.querySelector('[aria-selected="true"]');if(t)t.setAttribute("tabindex","0");else{let t=this.listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"])');t.length&&t[0].setAttribute("tabindex",0)}this.listbox.addEventListener("click",this._handleClick),this.listbox.addEventListener("keydown",this._handleKeydown)}_select(t){if("true"===t.getAttribute("aria-disabled"))return;const e="true"===this.listbox.getAttribute("aria-multiselectable");e||this._clearAllSelectedItems(),e&&"true"===t.getAttribute("aria-selected")||(this._clearTabIndexes(),t.setAttribute("aria-selected","true"),t.setAttribute("tabindex","0"),t.focus(),e&&this.add({value:t.dataset.value,label:t.dataset.label}))}_optionNode(t){let e=t.target;for(;e&&"option"!==e.getAttribute("role");)e=e.parentElement;return e}}class q{constructor(t,{container:e,dispatch:i}){this.state=t,this.dispatch=i,this.container=e.querySelector("#KeywordSelected"),this._deleteListener=this._deleteEvent.bind(this),this.container.addEventListener("animationstart",(()=>{this.dispatch({type:"updateSearchboxHeight",searchboxHeight:null})}))}syncState(t){t.keywordsSelected.size!==this.state.keywordsSelected.size&&(this.state=t,t.keywordsSelected.size>0&&this.updateKeywordSelectedList()),this.state=t}updateKeywordSelectedList(){let t=this.getUL(),e=t.querySelectorAll("li");for(let t=0;t<e.length;t++)this.removeKeyword(e[t],!1);for(const[e,i]of this.state.keywordsSelected){let s=this.addKeyword(e,i);t.appendChild(s)}this.dispatch({type:"updateKeywordSelectedList"})}dispatchAction(t,e){this.dispatch({type:t,keyword:e})}getUL(){let t=this.container.firstElementChild;return t||(t=document.createElement("ul"),t.className="mp-Keywords_List",this.container.appendChild(t)),t}addKeyword(t,e){return this._addMarkupLi(t,e)}removeKeyword(t,e){const i=t.parentNode;t.remove(),e&&!i.firstElementChild&&(i.remove(),this.dispatch({type:"updateSearchboxHeight",searchboxHeight:null}))}_deleteEvent(t){let e=t.target;e.removeEventListener("click",this._deleteListener);const i=e.parentElement;this.removeKeyword(i,!0);const s={value:i.dataset.value,label:i.dataset.label};this.dispatchAction("removeKeywordSelected",s)}_addMarkupLi(t,e){const i=document.createElement("li"),o=s,n=a;let r;switch(t.split(":")[0]){case"id_association":r="-org";break;case"id_adresse":r="-city";break;case"id_mot":r="-activity"}let l=o;l+=" "+o+r,l+=" "+n,i.className=l,i.dataset.value=t,i.dataset.label=e;const d=document.createElement("span");d.className="mp-Keywords_Label",d.appendChild(document.createTextNode(e));const h=document.createElement("button");return h.className="o-btn mp-Keywords_BtnDelete",h.setAttribute("aria-label","Supprimer ce critère de recherche"),h.addEventListener("click",this._deleteListener),i.appendChild(d),i.appendChild(h),i}}class z{constructor(t,{container:e,dispatch:i}){this.state=t,this.dispatch=i,this.atlasContainer=e,this.modals={},this.memory={modalAssociation:{position:"",btns:[],transitions:{transitionOn:"",transitionOnPreview:"",transitionOff:""}},modalRecherche:{position:"",btns:[],transitions:{transitionOn:"",transitionOnPreview:null,transitionOff:""}},previewHeight:"",bottomBarHeight:"",working:!1},this.setUpModal(),this._handlerClickBtns=this.handlerClickBtns.bind(this),this._handlerClickList=this.handlerClickList.bind(this)}syncState(t){"addModalContent"===t.modalAction?this.addContent(t):"closeModals"===t.modalAction?this.closeAllModals():"desktop"!==t.windowWidth||t.windowWidth!==this.state.windowWidth||t.searchboxHeight===this.state.searchoxHeight||"openedFull"!==this.state.modalAssociation&&"openedFull"!==this.state.modalRecherche||this.updateLayout(t.searchboxHeight),this.state=t}async addContent(t){let e,i,s=t.modalId;t.modalOpenId?(e={id_gis:t.modalOpenId},i=!0):t.modalArgs&&(e={id_association:t.modalArgs.id_association},i=!1),"closed"!==this.memory[s].position&&await this.close(s,!0),"modalRecherche"===s&&"closed"!==this.memory.modalAssociation.position&&await this.close("modalAssociation",!0),window.ajaxReload(s,{callback:()=>{const t=this.atlasContainer.querySelector("#"+s);this.modals[s]=t,this.bindListeners(s),this.setPosition(s),"modalRecherche"===s&&"mobile"===this.state.windowWidth?this.toggleVisibility(s):this.open(s,!0)},args:e,history:i})}closeAllModals(){this.memory.working=!0;for(const t in this.modals){const e=this.modals[t].id;"closed"!==this.memory[e].position&&this.close(e,!0)}"mobile"===this.state.windowWidth&&(this.memory.bottomBarHeight="",this.dispatch({type:"moveZoom",height:0})),this.memory.working=!1}async close(t,e){let i=this.modals[t],s=void 0===e||e;return s||"modalRecherche"!==t||"mobile"!==this.state.windowWidth||(i=i.firstElementChild.firstElementChild,s=!1),this.memory.working=!0,await this.closeTransition(i,this.memory[t].transitions.transitionOff,s),s?(this.memory[t].position="closed",this.unbindListeners(t),"mobile"===this.state.windowWidth&&"closed"===this.memory.modalRecherche.position&&this.dispatch({type:"moveZoom",height:0})):this.memory[t].position="visible",this.memory.working=!1,i}async open(t,e){let i,s,a,o=this.modals[t],n=void 0===e||e;return"modalRecherche"===t&&"mobile"===this.state.windowWidth&&(o=o.firstElementChild.firstElementChild,n=!1,a=this.memory.bottomBarHeight),"openedPreview"===this.memory[t].position?(i=this.memory[t].transitions.transitionOnPreview,s="is-toggle-up","closed"===this.memory.modalRecherche.position&&(a=this.memory.previewHeight)):(i=this.memory[t].transitions.transitionOn,s="is-toggle-down"),this.memory.working=!0,await this.openTransition(o,i,n),this.memory[t].btns.forEach((t=>{t.classList.add("is-ready-to-animate"),"toggle"===t.dataset.modalAction&&t.classList.add(s)})),void 0!==a&&this.dispatch({type:"moveZoom",height:a}),this.memory.working=!1,o}toggleVisibility(t){const e=this.modals[t];"false"===e.getAttribute("aria-hidden")?(e.setAttribute("aria-hidden","true"),this.memory[t].position="closed"):(e.setAttribute("aria-hidden","false"),this.memory[t].position="visible",this.dispatch({type:"moveZoom",height:this.memory.bottomBarHeight}))}bindListeners(t){const e=this.modals[t],i=e.querySelectorAll("button");if(this.memory[t].btns=i,i.forEach((e=>{e.addEventListener("click",this._handlerClickBtns),e.setAttribute("tabindex","0"),"modalAssociation"===t&&this.setAnimationBtn(e)})),"modalRecherche"===t){const i=e.querySelectorAll("li");this.memory[t].list=i,i.forEach((t=>{t.addEventListener("click",this._handlerClickList)}))}}unbindListeners(t){this.memory[t].btns.forEach((t=>{t.removeEventListener("click",this._handlerClickBtns),t.setAttribute("tabindex","-1")}));const e=this.memory[t].list;void 0!==e&&e.length>0&&e.forEach((t=>{t.removeEventListener("click",this._handlerClickList)}))}calcBottomBarHeight(t){const e=t.querySelector(".mp-Modal_Bar");return-Math.abs(e.offsetHeight)}calcPreviewHeight(t){const e=t.querySelector("article h2");return-Math.abs(e.nextElementSibling.offsetTop+36)}getModals(){return this.atlasContainer.querySelectorAll("[data-modal]")}handlerClickBtns(t){const e=t.target,i=t.target.closest("[data-modal]"),s=i.id,a=t.target.dataset.modalAction,o=this.memory[s].position;if("modalRecherche"===i.id&&"toggle"===a){if(this.memory.working)return;e.getAttribute("data-text-toggle")==e.innerHTML?e.innerHTML=e.getAttribute("data-text-original"):(e.setAttribute("data-text-original",e.innerHTML),e.innerHTML=e.getAttribute("data-text-toggle")),"visible"===o?(this.memory[s].position="openedFull",this.open(s,!1)):(this.memory[s].position="visible",this.close(s,!1))}else if("modalAssociation"===i.id){if(this.memory.working)return;"toggle"===a&&"openedPreview"===o?(this.memory[s].position="openedFull",this.open(s,!1)):this.close(s,!0)}}handlerClickList(t){const e=t.target.closest("[data-id-gis]");e&&(this.dispatch({type:"addModalContent",openId:e.dataset.idGis,modalId:"modalAssociation"}),this.dispatch({type:"centerOnMarker",coords:[e.dataset.lon,e.dataset.lat],id:e.dataset.idGis}))}openTransition(t,e,i){return new Promise((s=>{i&&t.setAttribute("aria-hidden","false"),t.addEventListener("transitionend",(function e(){s(t),this.removeEventListener("transitionend",e)})),t.style.transform=e}))}closeTransition(t,e,i){return new Promise((s=>{t.addEventListener("transitionend",(function e(){i&&t.setAttribute("aria-hidden","true"),t.style.transform="",s(t),this.removeEventListener("transitionend",e)})),t.style.transform=e}))}setAnimationBtn(t){const e=t.querySelector("circle");if(e){const t=(2*Math.PI*e.getAttribute("r")).toFixed(2);e.setAttribute("stroke-dashoffset",t),e.setAttribute("stroke-dasharray",t)}}setPosition(t){const e=this.modals[t];let i,s;"desktop"===this.state.windowWidth?(this.updateLayout(this.state.searchboxHeight),i="openedFull",s=this.setStyleTransitions(this.state.windowWidth)):"modalAssociation"===t?(i="openedPreview",this.memory.previewHeight=this.calcPreviewHeight(e),s=this.setStyleTransitions(this.state.windowWidth)):(i="openedFull",s=this.setStyleTransitions(this.state.windowWidth),this.memory.bottomBarHeight=this.calcBottomBarHeight(e)),this.memory[t].position=i,this.memory[t].transitions=s}setStyleTransitions(t){let e={};return"desktop"===t?(e.transitionOn="translateX(0)",e.transitionOnPreview=null,e.transitionOff="translateX(-100%)"):(this.memory.previewHeight?e.transitionOnPreview="translateY("+this.memory.previewHeight+"px)":e.transitionOnPreview=null,e.transitionOn="translateY(-100%)",e.transitionOff="translateY(0)"),e}setTabIndex(t,e){e?t.setAttribute("tabindex","-1"):t.removeAttribute("tabindex")}setUpModal(){const t=this.getModals();t&&t.forEach((t=>{const e=t.id;this.modals[e]=t,t.classList.contains("is-opened")||(t.setAttribute("aria-hidden","true"),this.setTabIndex(t,!0),this.memory[e].position="closed")}))}updateLayout(t){for(const e in this.modals)this.modals[e].firstElementChild.firstElementChild.style.paddingTop=t+"px"}}let N,Z={windowWidth:null,searchboxHeight:null,keywords:new Map,keywordsSelected:new Map,modalAction:"",modalArgs:{},modalOpenId:"",modalId:"",centerMarker:{},moveZoom:""};t.addKeyword=t=>{N.autocompleteAddKeyword(t)},t.init=t=>{let e={containerId:"atlas",controls:[D,F,q,z],dispatch:function(t){Z=N.handleAction(Z,t),N.syncState(Z)}};N=new B(t,Z,e)},Object.defineProperty(t,"__esModule",{value:!0})}({});
