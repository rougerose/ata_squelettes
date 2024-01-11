var atlas = (function (exports) {
    'use strict';

    const config = {
        windowBreakpoint: 768,
        markerSize: {
            xs: 34,
            s: 44,
            m: 54,
            l: 64,
            xl: 74,
            xxl: 84,
        },
        searchBox: {
            id: "#SearchBox",
            btnAdvancedId: "#openAdvancedSearch",
            panelClassName: "mp-SearchBox_Panel",
        },
        keywords: {
            ulClassName: "mp-Keywords_List",
            liClassName: {
                main: "mp-Keywords_Item",
                variant: "mp-Keywords_Item-selected",
            },
            labelClassName: "mp-Keywords_Label",
            btnDeleteClassName: "mp-Keywords_BtnDelete",
        },
        modal: {
            setTabIndex: true,
            openedClass: "is-opened",
            closedClass: "is-closed",
            bottomBarClass: "mp-Modal_Bar",
            containerId: "Modal",
        },
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */

    function isObject$2(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$2;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$2 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$2;

    var root$1 = _root;

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now$1 = function() {
      return root$1.Date.now();
    };

    var now_1 = now$1;

    /** Used to match a single whitespace character. */

    var reWhitespace = /\s/;

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
     * character of `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the index of the last non-whitespace character.
     */
    function trimmedEndIndex$1(string) {
      var index = string.length;

      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }

    var _trimmedEndIndex = trimmedEndIndex$1;

    var trimmedEndIndex = _trimmedEndIndex;

    /** Used to match leading whitespace. */
    var reTrimStart = /^\s+/;

    /**
     * The base implementation of `_.trim`.
     *
     * @private
     * @param {string} string The string to trim.
     * @returns {string} Returns the trimmed string.
     */
    function baseTrim$1(string) {
      return string
        ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
        : string;
    }

    var _baseTrim = baseTrim$1;

    var root = _root;

    /** Built-in value references. */
    var Symbol$2 = root.Symbol;

    var _Symbol = Symbol$2;

    var Symbol$1 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto$1.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag$1(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag$1;

    /** Used for built-in method references. */

    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString$1(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString$1;

    var Symbol = _Symbol,
        getRawTag = _getRawTag,
        objectToString = _objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag$1(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$1;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */

    function isObjectLike$1(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$1;

    var baseGetTag = _baseGetTag,
        isObjectLike = isObjectLike_1;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol$1(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    var isSymbol_1 = isSymbol$1;

    var baseTrim = _baseTrim,
        isObject$1 = isObject_1,
        isSymbol = isSymbol_1;

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber$1(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject$1(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject$1(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    var toNumber_1 = toNumber$1;

    var isObject = isObject_1,
        now = now_1,
        toNumber = toNumber_1;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    var debounce_1 = debounce;

    var debounce$1 = /*@__PURE__*/getDefaultExportFromCjs(debounce_1);

    /*eslint no-fallthrough: "off"*/
    const callbackEvents = [ 'hide', 'show' ];

    /**
     * Tablist constructor
     * @constructor
     * @param {Node} el - DOM node
     */
    class Tablist{

      constructor( el ){
        if ( !el || !el.nodeName ) {
          throw new Error( 'No DOM node provided. Abort.' );
        }

        this.el = el;

        this._tablist = {};

        this._callbacks = {};

        this._handleDisplay = this._handleDisplay.bind( this );
        this._handleFocus = this._handleFocus.bind( this );
        this._handleTab = this._handleTab.bind( this );
        this._handlePanelFocus = this._handlePanelFocus.bind( this );
        this._handlePanel = this._handlePanel.bind( this );
      }

      /**
       * Retrieve first activable tab (that does not have `disabled` attribute)
       */
      _firstActiveTab() {
        let activeTab;

        for( let i = 0; i < this._tablist.tabs.length; i++ ) {
          if( !this._tablist.tabs[ i ].disabled ){
            activeTab = i;
            break;
          }
        }

        return activeTab;
      }

      /**
       * Toggle display of the tabPanel (show/hide)
       * @param {DOMEvent} e - Can be a `MouseEvent` or a `KeyboardEvent` object
       */
      _handleDisplay( e ){
        e.preventDefault();

        const tab = e.currentTarget;

        if( tab.disabled ){
          return;
        }

        // ensure the tab has the focus when a click occurs
        if( tab !== document.activeElement ){
          tab.focus();
        }

        this._toggleDisplay( this._tablist.tabs.indexOf( tab ));
      }


      /**
       * Update the current tab index before selecting the current tab
       * @param {DOMEvent} e - A `FocusEvent` object
       */
      _handleFocus( e ){
        const tab = e.currentTarget;

        if( tab.disabled ){
          return;
        }

        this._tablist.currentTabIndex = this._tablist.tabs.indexOf( tab );

        this._select( this._tablist.tabs[ this._tablist.currentTabIndex ]);
      }


      /**
       * Handle keystroke on [role=tabpanel]
       * @param {DOMEvent} e - A `KeyboardEvent` object
       */
      _handlePanel( e ){

        if ( this._tablist.currentTabIndex === undefined ) {
          this._handlePanelFocus( e );
        }

        switch( e.keyCode ){
          // ctrl + page up
          case 33:
            if( e.ctrlKey ){
              e.preventDefault();
              // focus the previous tab
              this._switchTab( this._tablist.currentTabIndex - 1 );
            }
            break;
          // ctrl + page down
          case 34:
            if( e.ctrlKey ){
              e.preventDefault();
              // focus the next tab
              this._switchTab( this._tablist.currentTabIndex + 1 );
            }
            break;

          // focus back to tab
          // ctrl + up
          case 38:
            if( e.ctrlKey ){
              e.preventDefault();
              // focus linked tab
              this._switchTab( this._tablist.currentTabIndex );
            }
            break;
        }
      }


      /**
       * Ensure that the current tab index is the one matching the tabPanel
       * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
       */
      _handlePanelFocus( e ){

        if( e.target.doubleFocus ){
          e.preventDefault();
          delete e.target.doubleFocus;

          return;
        }

        const tabPanel = e.currentTarget;

        this._tablist.currentTabIndex = this._tablist.tabPanels.indexOf( tabPanel );

        // prevent double focus event when the inputs are focused
        if([ 'radio', 'checkbox' ].indexOf( e.target.type ) >= 0 ){
          e.target.doubleFocus = true;
        }
      }


      /**
       * Handle keystroke on [role=tab]
       * @param {DOMEvent} e - A `KeyboardEvent` object
       */
      _handleTab( e ){

        if ( this._tablist.currentTabIndex === undefined ) {
          this._handleFocus( e );
        }

        switch( e.keyCode ){
          // space
          case 32:
          // return
          case 13:
            // toggle the display of the linked tabpanel
            this._handleDisplay( e );
            break;

            // end
          case 35:
            e.preventDefault();
            // focus the last tab
            this._switchTab( this._tablist.tabs.length - 1 );
            break;

            // home
          case 36:
            e.preventDefault();
            // focus the first active tab
            this._switchTab( this._firstActiveTab());
            break;

            // left
          case 37:
          // up
          case 38:
            e.preventDefault();
            // focus the previous tab
            this._switchTab( this._tablist.currentTabIndex - 1 );
            break;

            // right
          case 39:
          // down
          case 40:
            e.preventDefault();
            // focus the next tab
            this._switchTab( this._tablist.currentTabIndex + 1 );
            break;
        }
      }

      /**
       * Dummy function
       */
      _noop(){}

      /**
       * Update tab selected attributes (`aria-selected`, `tabindex`)
       * based on the `tabToSelect` attribute
       * @param {DOMElement} tabToSelect - Tab element to select
       */
      _select( tabToSelect ){
        // loop on each tab
        this._tablist.tabs.forEach(( tab, index ) => {
          const shouldSelect = tabToSelect === tab;

          tab.setAttribute( 'aria-selected', shouldSelect );
          tab.setAttribute( 'tabindex', shouldSelect ? 0 : -1 );

          // only for tab to be selected
          if ( shouldSelect ) {
            this._toggleDisplay( index );
          }
        });
      }

      /**
       * Move the focus to the tab based on the index
       * @param {number} index - Index of the element to focus
       */
      _switchTab( index ){

        // handle disabled tab
        if( this._tablist.tabs[ index ] && this._tablist.tabs[ index ].disabled ){

          // cycling forward? Then go one item farther
          const newIndex = index > this._tablist.currentTabIndex ? index + 1 : index - 1;

          this._switchTab( newIndex );

          return;
        }

        this._tablist.currentTabIndex = index;

        if( this._tablist.currentTabIndex < this._firstActiveTab()){
          this._tablist.currentTabIndex = this._tablist.tabsLength - 1;
        }
        else if( this._tablist.currentTabIndex >= this._tablist.tabsLength ){
          this._tablist.currentTabIndex = this._firstActiveTab();
        }

        this._tablist.tabs[ this._tablist.currentTabIndex ].focus();
      }


      /**
       * Toggle the `aria-hidden` attribute on the tabpanel based on the passed tab
       * @param {integer} index - index of the tab
       * @param {boolean} show - whether or not display the panel
       */
      _toggleDisplay( index, show = true ){
        if( show && index === this._tablist.openedIndex ){
          return;
        }

        const tab = this._tablist.tabs[ index ];
        const tabPanel = this._tablist.tabPanels[ index ];

        // close the previous tab
        if( show && this._tablist.openedIndex !== undefined ){
          this._toggleDisplay( this._tablist.openedIndex, false );
        }

        tabPanel.setAttribute( 'aria-hidden', !show );

        if( show ){
          this._tablist.openedIndex = index;

          if( this._tablist.openedIndex !== undefined ){
            this._trigger( 'show', [ tab, tabPanel ]);
          }
        }
        else if( this._tablist.openedIndex !== undefined ){
          this._trigger( 'hide', [ tab, tabPanel ]);
        }
      }

      _trigger( eventName, params ){
        if( !this._callbacks[ eventName ]){
          return;
        }

        this._callbacks[ eventName ].forEach( callback => {
          callback.apply( this, params );
        });
      }

      /**
       * Parse tablist element to setup the tab and tabpanel elements
       */
      mount(){
        let firstTabIndex;

        // create reference arrays
        this._tablist.tabs = [];
        this._tablist.tabPanels = [];

        // loop on each tab elements to find tabpanel elements and update their attributes
        Array.from( this.el.querySelectorAll( '[role=tab]' )).forEach(( tab, index ) => {
          const controls = tab.getAttribute( 'aria-controls' );
          let tabPanel;
          let openedTab = false;

          // get the tabpanel linked to the tab element
          if( controls ){
            tabPanel = document.getElementById( controls );
          }
          else if( tab.nextElementSibling && tab.nextElementSibling.getAttribute( 'aria-labelledby' ) === tab.id ){
            tabPanel = tab.nextElementSibling;
          }

          if( !tabPanel ){
            throw new Error( `Could not find associated tabpanel for tab ${tab.id}. Use [aria-controls="tabpanelId"] on the [role="tab"] element to link them together` );
          }

          // store the tab and the tabpanel on their respective arrays on the tablist
          this._tablist.tabs.push( tab );
          this._tablist.tabPanels.push( tabPanel );

          tab.disabled = tab.hasAttribute( 'disabled' ) || tab.getAttribute( 'aria-disabled' ) === 'true';

          // if there's no opened tab yet
          if( tab.getAttribute( 'data-open' ) === 'true' && !tab.disabled ){
            if( this._tablist.openedIndex === undefined ){
              this._toggleDisplay( index, true );

              openedTab = true;
            }
          }

          // remove setup data attributes
          tab.removeAttribute( 'data-open' );

          // get first non-disabled tab
          if( firstTabIndex === undefined && !tab.disabled ){
            firstTabIndex = index;
          }

          // set the attributes according the the openedTab status
          tab.setAttribute( 'tabindex', -1 );
          tabPanel.setAttribute( 'aria-hidden', !openedTab );

          // subscribe internal events for tab and tap panel
          tab.addEventListener( 'click', this._handleDisplay );
          tab.addEventListener( 'focus', this._handleFocus );
          tab.addEventListener( 'keydown', this._handleTab );
          tabPanel.addEventListener( 'focus', this._handlePanelFocus, true );
          tabPanel.addEventListener( 'keydown', this._handlePanel );
        });

        // store constants
        this._tablist.tabsLength = this._tablist.tabs.length;
        this._tablist.tabPanelsLength = this._tablist.tabPanels.length;

        // set the tabindex so the first opened tab or the first non-disabled tab can be focused on tab navigation
        if( this._tablist.openedIndex !== undefined ){
          this._tablist.tabs[ this._tablist.openedIndex ].setAttribute( 'tabindex', 0 );
          this._tablist.tabs[ this._tablist.openedIndex ].setAttribute( 'aria-selected', 'true' );
        }
        // if there's no opened tab and it's not an accordion open the first tab
        else {
          this._toggleDisplay( firstTabIndex, true );

          this._tablist.tabs[ firstTabIndex ].setAttribute( 'tabindex', 0 );
          this._tablist.tabs[ firstTabIndex ].setAttribute( 'aria-selected', 'true' );
        }
      }

      off( event, callback ){
        if( !this._callbacks[ event ]){
          return;
        }

        const callbackIndex = this._callbacks[ event ].indexOf( callback );

        if( callbackIndex < 0 ){
          return;
        }

        this._callbacks[ event ].splice( callbackIndex, 1 );
      }

      on( event, callback ){
        if( callbackEvents.indexOf( event ) < 0 ){
          return;
        }

        if( !this._callbacks[ event ]){
          this._callbacks[ event ] = [];
        }

        this._callbacks[ event ].push( callback );
      }

      /**
       * Returns the opened tab or array of opened tabs
       */
      get current(){
        const tab = this._tablist.tabs[ this._tablist.openedIndex ];
        const tabPanel = this._tablist.tabPanels[ this._tablist.openedIndex ];

        return {
          tab,
          tabPanel
        };
      }

      /**
       * unbind tablist
       */
      unmount(){
        this._tablist.tabs.forEach(( tab, index ) => {
          const tabPanel = this._tablist.tabPanels[ index ];

          // unsubscribe internal events for tab and tap panel
          tab.removeEventListener( 'click', this._handleDisplay );
          tab.removeEventListener( 'focus', this._handleFocus );
          tab.removeEventListener( 'keydown', this._handleTab );

          tab.removeAttribute( 'tabindex' );
          tab.removeAttribute( 'aria-selected' );

          tabPanel.removeEventListener( 'focus', this._handlePanelFocus, true );
          tabPanel.removeEventListener( 'keydown', this._handlePanel );
          tabPanel.setAttribute( 'aria-hidden', 'false' );
        });


        this._tablist = {};
      }
    }

    class AtlasBase {
        constructor(map, state, conf) {
            this.map = map;
            this.configMap();

            // Ajouter gestionnaire sur window.onresize
            this.handleResize = this._handleResize.bind(this);
            window.addEventListener("resize", debounce$1(this.handleResize, 250));

            this.container = document.getElementById(conf.containerId);
            this.dispatch = conf.dispatch;
            this.state = state;
            this.memory = {};

            // Activer les modules "controls"
            const controlModules = conf.controls;
            const container = this.container;
            const dispatch = this.dispatch;

            this.controls = controlModules.map(
                (controlModule) => new controlModule(state, { container, dispatch })
            );

            // Activer Tablist @accede-web/tablist
            const list = this.container.querySelector("#Tab ul[role='tablist']");
            if (list) {
                let tablist = new Tablist(list);
                tablist.mount();
            }
        }

        configMap() {
            // Bug Leaflet : le click sur un marqueur est envoyé deux fois. Solution provisoire :
            // désactiver l'option "tap" : https://github.com/Leaflet/Leaflet/issues/7255
            L.Util.setOptions(this.map, { tap: false });

            // Position du crédit carto...
            L.Control.Attribution.prototype.options.position = "bottomleft";
            // ... et du zoom
            L.Control.Zoom.prototype.options.position = "bottomright";

            // Bouton Ajout d'une association
            const addOrgBtn = L.easyButton({
                position: "bottomright",
                states: [
                    {
                        stateName: 'add-association',
                        icon: '<span class="mp-ControlAddBtn"> </span>',
                        onClick: function () {
                            location.href =
                                "https://docs.google.com/forms/d/e/1FAIpQLSdSSlbwy710Qu9XRhUwpzyZ2BjKXnzZV8S4Z62CjaKaEYwWYw/viewform";
                        },
                    },
                ],
            });
            addOrgBtn.button.title = "Ajouter une association";
            addOrgBtn.addTo(this.map);

            // Ajouter un gestionnaire de click sur chaque marqueur, mais après "ready"
            // car le module est chargé lors de l'événement "load" et les marqueurs
            // ne sont pas encore disponibles.
            let onready = () => {
                this.setInitialState();
                this._handleClickMarker();
                // Si un marker est appelé explicitement à l'ouverture :
                // ouvrir modalAssociation
                if (this.map.options.openId) {
                    this.map.options.openId;
                    this.dispatch({
                        type: "addModalContent",
                        openId: this.map.options.openId,
                        modalId: "modalAssociation",
                    });
                }
                jQuery("#" + this.map._container.id).off("ready", onready);
            };
            jQuery("#" + this.map._container.id).on("ready", onready);

            // Personnaliser les icones des clusters
            if (this.map.options.cluster) {
                this.map.options.clusterOptions.iconCreateFunction = this.clusterIcon;
            }
        }

        // Clusters personnalisés
        clusterIcon(cluster) {
            const SIZE = config.markerSize;
            let size, variant, count;
            count = cluster.getChildCount();
            if (count <= 3) {
                variant = "-xs";
                size = SIZE.xs;
            } else if (count <= 10) {
                variant = "-s";
                size = SIZE.s;
            } else if (count <= 50) {
                variant = "-m";
                size = SIZE.m;
            } else if (count <= 100) {
                variant = "-l";
                size = SIZE.l;
            } else if (count <= 250) {
                variant = "-xl";
                size = SIZE.xl;
            } else {
                variant = "-xxl";
                size = SIZE.xxl;
            }
            return new L.DivIcon({
                html: "<div><span>" + count + "</span></div>",
                className: "mp-MarkerCluster mp-MarkerCluster" + variant,
                iconSize: new L.Point(size, size),
            });
        }

        syncState(state) {
            if (state.keywordsSelected.size !== this.state.keywordsSelected.size) {
                if (state.keywordsSelected.size !== 0) {
                    this.searchCollection(state.keywordsSelected);
                    this.state = state;
                } else {
                    // recharger la carte dans son état initial
                    this.resetMap();
                    this.state = state;
                }
            }

            if (Object.keys(state.centerMarker).length > 0) {
                this.centerOnMarker(state.centerMarker.id);
            }

            if (state.moveZoom !== "") {
                this.moveZoom(state.moveZoom);
            }

            this.state = state;
            for (let ctrl of this.controls) {
                ctrl.syncState(state);
            }
        }

        // Compléter state.windowWidth
        setInitialState() {
            const self = this;
            if (!self.state.windowWidth) {
                self.dispatch({
                    type: "updateWindowWidth",
                    windowWidth: self._getWindowWidth(),
                });
            }
        }

        _handleResize(event) {
            // resize : vérifier si la largeur de la fenêtre a changé
            this._checkWindowWidth();
        }

        _handleClickMarker() {
            const self = this;
            let markers = {};
            let cb = function (event) {
                self.dispatch({
                    type: "addModalContent",
                    openId: this.feature.id,
                    modalId: "modalAssociation",
                });
                self.dispatch({
                    type: "centerOnMarker",
                    id: this.feature.id,
                });
            };
            this.map.markerCluster.eachLayer((layer) => {
                // garder en mémoire les marqueurs afin de pouvoir les réutiliser
                markers[layer.id] = layer;
                layer.on("click", cb);
            });
            this.memory.markers = markers;
        }

        _getWindowWidth() {
            const breakpoint = config.windowBreakpoint;
            let windowWidth =
                window.innerWidth >= breakpoint ? "desktop" : "mobile";
            return windowWidth;
        }

        _checkWindowWidth() {
            let currentWidth = this._getWindowWidth();
            if (this.state.windowWidth !== currentWidth) {
                this.dispatch({
                    type: "updateWindowWidth",
                    windowWidth: currentWidth,
                });
            }
        }

        handleAction(state, action) {
            // Corriger un écart entre les listes de mots-clés.
            // La liste keywords est celle qui est à jour
            // (en l'occurence qu'il n'y a plus aucun mot-clé sélectionné).
            if (state.keywords.size == 0 && state.keywordsSelected.size > 0) {
                state.keywordsSelected = new Map();
            }
            // Conserver en mémoire l'état actuel, et le distribuer à tous les
            // modules enfants, sauf celui relatif aux modales qui est temporaire.
            let currentState = this.state;
            currentState.modalAction = "";
            currentState.modalArgs = {};
            currentState.modalOpenId = "";
            currentState.modalId = "";
            currentState.centerMarker = {};
            currentState.moveZoom = "";

            let keywords;
            let keywordsSelected;

            switch (action.type) {
                case "addKeyword":
                    keywords = new Map(state.keywords);
                    keywordsSelected = new Map(state.keywordsSelected);
                    keywords.set(action.keyword.value, action.keyword.label);
                    keywordsSelected.set(
                        action.keyword.value,
                        action.keyword.label
                    );

                    state = Object.assign({}, currentState, {
                        keywords: keywords,
                        keywordsSelected: keywordsSelected,
                    });
                    break;
                case "removeKeywordSelected":
                    keywords = new Map(state.keywords);
                    keywordsSelected = new Map(state.keywordsSelected);
                    keywords.delete(action.keyword.value);
                    keywordsSelected.delete(action.keyword.value);

                    state = Object.assign({}, currentState, {
                        keywords: keywords,
                        keywordsSelected: keywordsSelected,
                    });
                    break;
                case "addModalContent":
                    action.action = "addModalContent";
                    action.modalId = action.modalId;
                    action.openId = action.openId || "";
                    action.args = action.args || {};

                    state = Object.assign({}, currentState, {
                        modalAction: action.action,
                        modalOpenId: action.openId,
                        modalArgs: action.args,
                        modalId: action.modalId,
                    });
                    break;
                case "updateModalPosition":
                    action.action = action.action || "";
                    action.modalId = action.modalId || "";
                    action.openId = action.openId || "";
                    action.args = action.args || {};

                    state = Object.assign({}, currentState, {
                        modalAction: action.action,
                        modalOpenId: action.openId,
                        modalArgs: action.args,
                        modalId: action.modalId,
                    });
                    break;
                case "updateWindowWidth":
                    state = Object.assign({}, currentState, {
                        windowWidth: action.windowWidth,
                    });
                    break;
                case "updateSearchboxHeight":
                    if (!action.searchboxHeight) {
                        // Si null, elle sera mise à jour via searchbox.syncState
                        action.searchboxHeight = null;
                    }
                    state = Object.assign({}, currentState, {
                        searchboxHeight: action.searchboxHeight,
                    });
                    break;
                case "centerOnMarker":
                    state = Object.assign({}, currentState, {
                        centerMarker: { id: action.id },
                    });
                    break;
                case "moveZoom":
                    state = Object.assign({}, currentState, {
                        moveZoom: action.height,
                    });
                    break;
            }
            return state;
        }

        autocompleteAddKeyword(keyword) {
            this.dispatch({ type: "addKeyword", keyword: keyword });
        }

        centerOnMarker(id) {
            const self = this;
            const marker = this.memory.markers[id];
            this.map.getZoom();

            this.map.markerCluster.zoomToShowLayer(marker, function () {
                const latlng = marker._latlng;

                /* Afficher le marqueur à un niveau de zoom *minimum*,
                (plutôt qu'un zoom *maximum* qui est la valeur calculée par défaut
                avec .flyToBounds() et méthodes plus ou moins similaires).
                Solution un peu "tricky", disponible ici
                https://github.com/Leaflet/Leaflet.markercluster/issues/954 */
                const clusterBounds = marker.__parent.getBounds();
                const zoomLevel = self.map.getBoundsZoom(clusterBounds);

                // Ajouter un padding en version desktop
                if (self.state.windowWidth === "desktop") {
                    const searchbox = self.container.querySelector(
                        config.searchBox.id
                    );
                    const searchboxWidth = searchbox.offsetWidth;
                    const bounds = L.latLngBounds([latlng]);
                    const options = {
                        paddingTopLeft: [searchboxWidth, 10],
                        maxZoom: zoomLevel,
                    };
                    self.map.fitBounds(bounds, options);
                } else {
                    self.map.setView(latlng, zoomLevel);
                }
                marker.openPopup();
            });
        }

        moveZoom(height) {
            /* Viser le container "bas droite" pour que la transition s'applique
            à l'ensemble des boutons */
            const zoomControl = this.map.zoomControl.getContainer().parentElement;
            zoomControl.style.transform = "translateY(" + height + "px)";
        }

        resetMap() {
            this.map.removeAllMarkers();
            this.map.loadData();
            this.dispatch({ type: "updateModalPosition", action: "closeModals" });
            let onready = () => {
                this._handleClickMarker();
            };
            jQuery("#" + this.map._container.id).on("ready", onready);
        }

        createQuery(keywords) {
            let query = {
                id_association: [],
                id_mot: [],
                id_adresse: [],
                limit: this.map.options.json_points.limit,
            };

            // la syntaxe key est la forme suivante : "id_objet_spip:identifiant_numerique"
            for (const [key] of keywords) {
                const objet_spip = key.split(":");
                const index = query[objet_spip[0]].length;
                query[objet_spip[0]][index] = objet_spip[1];
            }

            return query;
        }

        searchCollection(keywords) {
            const self = this;
            const map = self.map;
            const URL = "http.api/collectionjson/associations";
            let query = self.createQuery(keywords);
            query = jQuery.param(query);

            let collection = jQuery.getJSON(URL, query);
            let associations = { id_association: [] };
            collection.done(function (json) {
                let items = json.collection.items;
                for (const key in items) {
                    if (Object.hasOwnProperty.call(items, key)) {
                        associations.id_association.push(items[key].data[0].value);
                    }
                }
                let args = {};
                jQuery.extend(
                    true,
                    args,
                    map.options.json_points.env,
                    associations
                );
                args.objets = "associations_recherche";
                args.limit = map.options.json_points.limit;
                self.searchFeatures(map.options.json_points.url, args);
            });

            collection.fail(function (jqxhr, textStatus, error) {
                associations.id_association.push(0);
                // var err = textStatus + ", " + error;
                // console.log("Request Failed: " + err);
                self.dispatch({
                    type: "addModalContent",
                    args: associations,
                    modalId: "modalRecherche",
                });
            });
        }

        searchFeatures(url, args) {
            const self = this;
            const map = self.map;

            jQuery.getJSON(url, args, (data) => {
                if (data) {
                    map.removeAllMarkers();
                    // centrer la carte sur les marqueurs correspondant à la recherche
                    // relancer le gestionnaire de click sur les marqueurs.
                    let coords = [];
                    coords = data.features.map((feature) =>
                        feature.geometry.coordinates.slice().reverse()
                    );
                    const bounds = L.latLngBounds(coords);
                    map.parseGeoJson(data);
                    map.fitBounds(bounds);
                    self._handleClickMarker();

                    self.dispatch({
                        type: "addModalContent",
                        args: args,
                        modalId: "modalRecherche",
                    });
                }
            });
        }
    }

    class SearchBox {
        constructor(state, { container, dispatch }) {
            this.state = state;
            this._container = container.querySelector(config.searchBox.id);
            this._advancedSearchIsOpen = false;
            this.dispatch = dispatch;
            this._initLayout(this._container);
        }

        _getHeight() {
            return this._container.offsetHeight;
        }

        getWidth() {
            return this._container.offsetWidth;
        }

        updateHeight(value) {
            let height = value || this._getHeight();
            this.dispatch({
                type: "updateSearchboxHeight",
                searchboxHeight: height,
            });
        }

        _initLayout(container) {
            // Inputs text
            this._inputs = container.querySelectorAll("input[type=text]");
            [].forEach.call(this._inputs, (input) => {
                input.addEventListener("focus", this._handlerInputEvent);
                input.addEventListener("blur", this._handlerInputEvent);
            });

            // Cancel Buttons (formulaires)
            this._cancelBtns = container.querySelectorAll("button[type=reset]");
            [].forEach.call(this._cancelBtns, (cancelBtn) => {
                const uid = cancelBtn.dataset.relId;
                const input = container.querySelector("[data-id='" + uid + "']");
                cancelBtn.addEventListener(
                    "click",
                    this._onclickCancelBtn.bind(input)
                );
            });

            // Advanced Search button
            this._advancedSearchBtn = container.querySelector(
                config.searchBox.btnAdvancedId
            );
            this._advancedSearchBtn.addEventListener("click", () => {
                this._togglePanels();
            });

            // Panels fulltext/advanced
            this._panels = container.querySelectorAll(
                "." + config.searchBox.panelClassName
            );
            if (!this._advancedSearchIsOpen) {
                for (let index = 0; index < this._panels.length; index++) {
                    const panel = this._panels[index];
                    if (index == 0) {
                        panel.setAttribute("aria-hidden", "false");
                    } else {
                        panel.setAttribute("aria-hidden", "true");
                    }
                }
            }
        }

        _togglePanels() {
            // Quel panneau doit être affiché ?
            let panelToShow = this._advancedSearchIsOpen ? 0 : 1;
            if (this._advancedSearchIsOpen) {
                // Fermer (état initial)
                this._advancedSearchBtn.setAttribute("aria-expanded", "false");
                this._advancedSearchBtn.classList.remove("is-open");
                this._advancedSearchIsOpen = false;
            } else {
                // Ouvrir
                this._advancedSearchBtn.setAttribute("aria-expanded", "true");
                this._advancedSearchBtn.classList.add("is-open");
                this._advancedSearchIsOpen = true;
            }
            // sélectionner le panneau à fermer
            const closePanel = this._panels[1 - panelToShow];
            // et celui à ouvrir
            const openPanel = this._panels[panelToShow];

            this.close(closePanel);
            this.open(openPanel);
        }

        close(panel) {
            panel.setAttribute("aria-hidden", "true");
        }

        open(panel) {
            panel.setAttribute("aria-hidden", "false");
            this.updateHeight();
        }

        _handlerInputEvent(event) {
            const parentElement = this.offsetParent;
            if (event.type === "focus") {
                parentElement.classList.add("is-focused");
            } else if (event.type === "blur" && event.target.value === "") {
                parentElement.classList.remove("is-focused");
            }
        }

        _onclickCancelBtn(event) {
            event.preventDefault();
            const input = this;
            input.value = null;
            input.offsetParent.classList.remove("is-focused");
        }

        syncState(state) {
            this.state = state;
            if (this.state.searchboxHeight === null) {
                let height = this._getHeight();
                this.state.searchboxHeight = height;
                this.updateHeight(height);
            }
        }
    }

    class Keyword {
        constructor(state, { container, dispatch }) {
            this.state = state;
            this.dispatch = dispatch;
            this.container = container.querySelector("#Keyword");

            // listbox
            this.listbox = container.querySelector("#listBox");
            this.options = { prevKeys: 37, nextKeys: 39 };
            this._setupOptions(this.options);
            this._handleClick = this._handleClick.bind(this);
            this._handleKeydown = this._handleKeydown.bind(this);
            this._mount();
        }

        syncState(state) {
            if (state.keywords.size !== this.state.keywords.size) {
                if (state.keywords.size === 0) {
                    // Supprimer toute la sélection
                    this._clearTabIndexes();
                    this._clearAllSelectedItems();
                    this.state.keywords = state.keywords;
                } else {
                    // Supprimer, mais sélectionner à nouveau l'éventuel mot-clé
                    // qui appartient à la liste gérée par ce module.
                    this._clearTabIndexes();
                    this._clearAllSelectedItems();
                    // mettre à jour state pour éviter une boucle sans fin.
                    this.state.keywords = state.keywords;
                    for (const [key] of state.keywords) {
                        const item = this.listbox.querySelector('li[data-value="' + key + '"]');
                        // Le mot-clé à ajouter n'appartient pas nécessairement à la liste gérée par ce modèle.
                        if (item) {
                            this._select(item);
                        }
                    }
                }
            }
            this.state = state;
        }

        dispatchAction(action, keyword) {
            this.dispatch({
                type: action,
                keyword: keyword,
            });
        }

        add(keyword) {
            if (!this.state.keywords.has(keyword.value)) {
                this.dispatchAction("addKeyword", keyword);
            }
        }

        remove(keyword) {
            if (this.state.keywords.has(keyword.value)) {
                this.dispatchAction("removeKeyword", keyword);
            }
        }

        _setupOptions(options) {
            let opts = options || {};
            opts.prevKeys = this._normalizeKeyOptions(opts.prevKeys, [38]);
            opts.nextKeys = this._normalizeKeyOptions(opts.nextKeys, [40]);
            opts.selectKeys = this._normalizeKeyOptions(opts.selectKeys, [13, 32]);
            this.options = opts;
        }

        _normalizeKeyOptions(keys, defaults) {
            if (!Array.isArray(keys)) {
                keys = keys ? [keys] : defaults;
            }
            return keys.map(function (k) {
                return typeof k === "string" && !Number(k)
                    ? k.charCodeAt(0)
                    : Number(k);
            });
        }

        _clearTabIndexes() {
            let tabindexes = this.listbox.querySelectorAll("[tabindex]");
            for (let index = 0; index < tabindexes.length; index++) {
                tabindexes[index].removeAttribute("tabindex");
            }
        }

        _clearAllSelectedItems() {
            let items = this.listbox.querySelectorAll("[aria-selected=true]");
            for (let index = 0; index < items.length; index++) {
                items[index].setAttribute("aria-selected", "false");
            }
        }

        _handleClick(event) {
            event.preventDefault();
            let optionEl = this._optionNode(event);
            if (optionEl) {
                this._select(optionEl);
            }
        }

        _handleKeydown(event) {
            let optionEl = this._optionNode(event),
                code = event.keyCode || event.code;

            if (!optionEl) {
                return;
            }

            if (this.options.selectKeys.indexOf(code) !== -1) {
                this._select(optionEl);
            } else if (
                event.target &&
                event.target.getAttribute("role") === "option"
            ) {
                this._handleKey(optionEl, code, this.options.nextKeys, 1);
                this._handleKey(optionEl, code, this.options.prevKeys, -1);
            }
        }

        _handleKey(optionEl, code, keys, delta) {
            if (keys.indexOf(code) !== -1) {
                const optionEls = this.listbox.querySelectorAll(
                        '[role="option"]:not([aria-disabled="true"])'
                    ),
                    idx = Array.prototype.indexOf.call(optionEls, optionEl);

                const next = optionEls[idx + delta];
                if (next) {
                    this._clearTabIndexes();
                    next.setAttribute("tabindex", 0);
                    next.focus();
                }
            }
        }

        _mount() {
            let firstSelected = this.listbox.querySelector(
                '[aria-selected="true"]'
            );

            if (firstSelected) {
                firstSelected.setAttribute("tabindex", "0");
            } else {
                let options = this.listbox.querySelectorAll(
                    '[role="option"]:not([aria-disabled="true"])'
                );
                if (options.length) {
                    options[0].setAttribute("tabindex", 0);
                }
            }

            this.listbox.addEventListener("click", this._handleClick);
            this.listbox.addEventListener("keydown", this._handleKeydown);
        }

        _select(child) {
            if (child.getAttribute("aria-disabled") === "true") {
                return;
            }
            const multiselect =
                this.listbox.getAttribute("aria-multiselectable") === "true";
            if (!multiselect) {
                this._clearAllSelectedItems();
            }

            if (multiselect && child.getAttribute("aria-selected") === "true") {
                //! Si click sur un élément déjà sélectionné. La suppression se fait uniquement dans la liste des mots-clés en selection (keywordSelected)
                return;
                // child.removeAttribute("aria-selected");
                // this.remove({ value: child.dataset.value, label: child.dataset.label });
            } else {
                this._clearTabIndexes();
                child.setAttribute("aria-selected", "true");
                child.setAttribute("tabindex", "0");
                child.focus();

                if (multiselect) {
                    this.add({
                        value: child.dataset.value,
                        label: child.dataset.label,
                    });
                }
            }
        }

        _optionNode(event) {
            let optionEl = event.target;
            while (optionEl && optionEl.getAttribute("role") !== "option") {
                optionEl = optionEl.parentElement;
            }
            return optionEl;
        }
    }

    // TODO : Ajouter un role Listbox sur le html + gestion du focus ?

    class KeywordSelected {
        constructor(state, { container, dispatch }) {
            this.state = state;
            this.dispatch = dispatch;
            this.container = container.querySelector("#KeywordSelected");
            this._deleteListener = this._deleteEvent.bind(this);
            this.container.addEventListener("animationstart", () => {
                this.dispatch({
                    type: "updateSearchboxHeight",
                    searchboxHeight: null,
                });
            });
        }

        syncState(state) {
            if (state.keywordsSelected.size !== this.state.keywordsSelected.size) {
                this.state = state;
                if (state.keywordsSelected.size > 0) {
                    this.updateKeywordSelectedList();
                }
            }
            this.state = state;
        }

        updateKeywordSelectedList() {
            // récupérer ou créer <ul>
            let list = this.getUL();
            // Avant d'afficher tous les mots-clés demandés,
            // supprimer ceux déjà présents
            let listItems = list.querySelectorAll("li");
            for (let index = 0; index < listItems.length; index++) {
                this.removeKeyword(listItems[index], false);
            }
            //
            for (const [key, val] of this.state.keywordsSelected) {
                let keyword = this.addKeyword(key, val);
                list.appendChild(keyword);
            }
            this.dispatch({ type: "updateKeywordSelectedList" });
        }

        dispatchAction(action, keyword) {
            this.dispatch({
                type: action,
                keyword: keyword,
            });
        }

        getUL() {
            let ul = this.container.firstElementChild;
            if (!ul) {
                ul = document.createElement("ul");
                ul.className = config.keywords.ulClassName;
                this.container.appendChild(ul);
            }
            return ul;
        }

        addKeyword(value, label) {
            let li = this._addMarkupLi(value, label);
            return li;
        }

        removeKeyword(el, removeParent) {
            const parent = el.parentNode;
            el.remove();

            if (removeParent && !parent.firstElementChild) {
                parent.remove();
                this.dispatch({
                    type: "updateSearchboxHeight",
                    searchboxHeight: null,
                });
            }
        }

        _deleteEvent(event) {
            let btn = event.target;
            btn.removeEventListener("click", this._deleteListener);
            const keywordElement = btn.parentElement;
            this.removeKeyword(keywordElement, true);
            const keyword = {
                value: keywordElement.dataset.value,
                label: keywordElement.dataset.label,
            };
            this.dispatchAction("removeKeywordSelected", keyword);
        }

        _addMarkupLi(value, label) {
            // <li>
            const li = document.createElement("li");
            // li.class
            const liClassFrag1 = config.keywords.liClassName.main;
            const liClassFrag2 = config.keywords.liClassName.variant;
            // La clé du mot-clé permet de déterminer
            // l'icone de la catégorie à afficher
            const key = value.split(":");
            let category;
            switch (key[0]) {
                case "id_association":
                    category = "-org";
                    break;
                case "id_adresse":
                    category = "-city";
                    break;
                case "id_mot":
                    category = "-activity";
            }
            let liClassName = liClassFrag1;
            liClassName += " " + liClassFrag1 + category;
            liClassName += " " + liClassFrag2;
            li.className = liClassName;
            // li dataset
            li.dataset.value = value;
            li.dataset.label = label;

            // span
            const span = document.createElement("span");
            span.className = config.keywords.labelClassName;
            span.appendChild(document.createTextNode(label));

            // <button>
            const btn = document.createElement("button");
            btn.className = "o-btn " + config.keywords.btnDeleteClassName;
            btn.setAttribute("aria-label", "Supprimer ce critère de recherche");
            btn.addEventListener("click", this._deleteListener);

            // Ajouter à la balise li :
            // le span, le bouton supprimer
            li.appendChild(span);
            li.appendChild(btn);

            return li;
        }
    }

    class Modal {
        constructor(state, { container, dispatch }) {
            this.state = state;
            this.dispatch = dispatch;
            this.atlasContainer = container;
            this.modals = {};
            this.memory = {
                modalAssociation: {
                    position: "",
                    btns: [],
                    transitions: {
                        transitionOn: "",
                        transitionOnPreview: "",
                        transitionOff: "",
                    },
                },
                modalRecherche: {
                    position: "",
                    btns: [],
                    transitions: {
                        transitionOn: "",
                        transitionOnPreview: null,
                        transitionOff: "",
                    },
                },
                previewHeight: "",
                bottomBarHeight: "",
                working: false,
            };

            this.setUpModal();
            this._handlerClickBtns = this.handlerClickBtns.bind(this);
            this._handlerClickList = this.handlerClickList.bind(this);
        }

        syncState(state) {
            if (state.modalAction === "addModalContent") {
                this.addContent(state);
            } else if (state.modalAction === "closeModals") {
                this.closeAllModals();
            } else if (
                state.windowWidth === "desktop" &&
                state.windowWidth === this.state.windowWidth &&
                state.searchboxHeight !== this.state.searchoxHeight &&
                (this.state.modalAssociation === "openedFull" ||
                    this.state.modalRecherche === "openedFull")
            ) {
                this.updateLayout(state.searchboxHeight);
            }

            this.state = state;
        }

        async addContent(state) {
            let modalId = state.modalId;
            let args, history;

            if (state.modalOpenId) {
                args = { id_gis: state.modalOpenId };
                history = true;
            } else if (state.modalArgs) {
                args = { id_association: state.modalArgs.id_association };
                history = false;
            }

            /* Fermer la modale si elle est déjà ouverte */
            if (this.memory[modalId].position !== "closed") {
                await this.close(modalId, true);
            }

            if (modalId === "modalRecherche" && this.memory.modalAssociation.position !== "closed") {
                await this.close("modalAssociation", true);
            }

            /* Charger le contenu via ajaxReload et ouvrir via le callback */
            const openCallback = () => {
                /* Memoriser le nouveau contenu */
                const modal = this.atlasContainer.querySelector("#" + modalId);
                this.modals[modalId] = modal;

                /* Ajouter les gestionnaires d'événements */
                this.bindListeners(modalId);

                /* Position et transitions */
                this.setPosition(modalId);

                if (
                    modalId === "modalRecherche" &&
                    this.state.windowWidth === "mobile"
                ) {
                    // Ouvrir seulement la barre en bas de fenêtre
                    this.toggleVisibility(modalId);
                } else {
                    // Ouvrir la modale
                    this.open(modalId, true);
                }
            };

            window.ajaxReload(modalId, {
                callback: openCallback,
                args: args,
                history: history,
            });
        }

        closeAllModals() {
            this.memory.working = true;
            for (const key in this.modals) {
                const modalId = this.modals[key].id;
                if (this.memory[modalId].position !== "closed") {
                    this.close(modalId, true);
                }
            }
            if (this.state.windowWidth === "mobile") {
                this.memory.bottomBarHeight = "";
                this.dispatch({
                    type: "moveZoom",
                    height: 0,
                });
            }
            this.memory.working = false;
        }

        async close(modalId, bool) {
            let modal = this.modals[modalId];
            let toggleAria = typeof bool === "undefined" ? true : bool;

            if (
                !toggleAria &&
                modalId === "modalRecherche" &&
                this.state.windowWidth === "mobile"
            ) {
                modal = modal.firstElementChild.firstElementChild;
                toggleAria = false;
            }

            this.memory.working = true;

            await this.closeTransition(
                modal,
                this.memory[modalId].transitions.transitionOff,
                toggleAria
            );

            if (toggleAria) {
                this.memory[modalId].position = "closed";
                this.unbindListeners(modalId);

                if (this.state.windowWidth === "mobile" && this.memory.modalRecherche.position === "closed") {
                    this.dispatch({
                        type: "moveZoom",
                        height: 0,
                    });
                }
            } else {
                this.memory[modalId].position = "visible";
            }

            this.memory.working = false;

            return modal;
        }

        async open(modalId, bool) {
            let modal = this.modals[modalId];
            let toggleAria = typeof bool === "undefined" ? true : bool;
            let transition, btnToggleClass, moveZoom;

            // Selon la modale et la largeur de la fenêtre, le bloc à manipuler n'est pas le même.
            if (
                modalId === "modalRecherche" &&
                this.state.windowWidth === "mobile"
            ) {
                modal = modal.firstElementChild.firstElementChild;
                toggleAria = false;
                moveZoom = this.memory.bottomBarHeight;
            }

            if (this.memory[modalId].position === "openedPreview") {
                transition = this.memory[modalId].transitions.transitionOnPreview;
                btnToggleClass = "is-toggle-up";
                if (this.memory.modalRecherche.position === "closed") {
                    moveZoom = this.memory.previewHeight;
                }
            } else {
                transition = this.memory[modalId].transitions.transitionOn;
                btnToggleClass = "is-toggle-down";
            }

            this.memory.working = true;

            await this.openTransition(modal, transition, toggleAria);

            this.memory[modalId].btns.forEach((btn) => {
                btn.classList.add("is-ready-to-animate");
                if (btn.dataset.modalAction === "toggle") {
                    btn.classList.add(btnToggleClass);
                }
            });

            if (typeof moveZoom !== "undefined") {
                this.dispatch({
                    type: "moveZoom",
                    height: moveZoom,
                });
            }

            this.memory.working = false;

            return modal;
        }

        toggleVisibility(modalId) {
            const modal = this.modals[modalId];

            if (modal.getAttribute("aria-hidden") === "false") {
                modal.setAttribute("aria-hidden", "true");
                this.memory[modalId].position = "closed";
            } else {
                modal.setAttribute("aria-hidden", "false");
                this.memory[modalId].position = "visible";
                this.dispatch({ type: "moveZoom", height: this.memory.bottomBarHeight });
            }
        }

        bindListeners(modalId) {
            const modal = this.modals[modalId];
            const btns = modal.querySelectorAll("button");
            this.memory[modalId].btns = btns;

            btns.forEach((btn) => {
                btn.addEventListener("click", this._handlerClickBtns);
                btn.setAttribute("tabindex", "0");

                if (modalId === "modalAssociation") {
                    this.setAnimationBtn(btn);
                }
            });

            if (modalId === "modalRecherche") {
                const list = modal.querySelectorAll("li");
                this.memory[modalId].list = list;
                list.forEach((item) => {
                    item.addEventListener("click", this._handlerClickList);
                });
            }
        }

        unbindListeners(modalId) {
            const btns = this.memory[modalId].btns;
            btns.forEach((btn) => {
                btn.removeEventListener("click", this._handlerClickBtns);
                btn.setAttribute("tabindex", "-1");
            });

            const list = this.memory[modalId].list;
            if (typeof list !== "undefined" && list.length > 0) {
                list.forEach((item) => {
                    item.removeEventListener("click", this._handlerClickList);
                });
            }
        }

        ///\\\
        calcBottomBarHeight(modal) {
            const bottomBar = modal.querySelector("." + config.modal.bottomBarClass);
            return -Math.abs(bottomBar.offsetHeight);
        }

        calcPreviewHeight(modal) {
            const body = modal.querySelector("article h2");
            const previewHeight = -Math.abs(body.nextElementSibling.offsetTop + 36);
            return previewHeight;
        }

        getModals() {
            const modals = this.atlasContainer.querySelectorAll("[data-modal]");
            return modals;
        }

        handlerClickBtns(event) {
            const btn = event.target;
            const modal = event.target.closest("[data-modal]");
            const modalId = modal.id;
            const action = event.target.dataset.modalAction;
            // position demandée
            const position = this.memory[modalId].position;

            if (modal.id === "modalRecherche" && action === "toggle") {
                if (this.memory.working) {
                    return;
                }

                // Manipuler le texte du bouton
                if (btn.getAttribute("data-text-toggle") == btn.innerHTML) {
                    btn.innerHTML = btn.getAttribute("data-text-original");
                } else {
                    btn.setAttribute("data-text-original", btn.innerHTML);
                    btn.innerHTML = btn.getAttribute("data-text-toggle");
                }

                // Si position "visible", alors seule la barre en bas de la fenêtre est visible.
                // sinon position "openedFull".
                if (position === "visible") {
                    this.memory[modalId].position = "openedFull";
                    this.open(modalId, false);
                } else {
                    this.memory[modalId].position = "visible";
                    this.close(modalId, false);
                }
            } else if (modal.id === "modalAssociation") {
                if (this.memory.working) {
                    return;
                }

                if (action === "toggle" && position === "openedPreview") {
                    this.memory[modalId].position = "openedFull";
                    this.open(modalId, false);
                } else {
                    this.close(modalId, true);
                }
            }
        }

        handlerClickList(event) {
            const li = event.target.closest("[data-id-gis]");
            if (li) {
                this.dispatch({
                    type: "addModalContent",
                    openId: li.dataset.idGis,
                    modalId: "modalAssociation",
                });
                this.dispatch({
                    type: "centerOnMarker",
                    coords: [li.dataset.lon, li.dataset.lat],
                    id: li.dataset.idGis,
                });
            }
        }

        openTransition(el, transition, bool) {
            return new Promise((resolve) => {
                if (bool) {
                    el.setAttribute("aria-hidden", "false");
                }
                el.addEventListener("transitionend", function _f() {
                    resolve(el);
                    this.removeEventListener("transitionend", _f);
                });
                el.style.transform = transition;
            });
        }

        closeTransition(el, transition, bool) {
            return new Promise((resolve) => {
                el.addEventListener("transitionend", function _f() {
                    if (bool) {
                        el.setAttribute("aria-hidden", "true");
                    }
                    el.style.transform = "";
                    resolve(el);
                    this.removeEventListener("transitionend", _f);
                });
                el.style.transform = transition;
            });
        }

        setAnimationBtn(button) {
            const circle = button.querySelector("circle");
            if (circle) {
                const circumference = (
                    2 *
                    Math.PI *
                    circle.getAttribute("r")
                ).toFixed(2);
                circle.setAttribute("stroke-dashoffset", circumference);
                circle.setAttribute("stroke-dasharray", circumference);
            }
        }

        /*
            Définir position et transitions en fonction de la modale à ouvrir
            et en fonction de la largeur de la fenêtre.
         */
        setPosition(modalId) {
            const modal = this.modals[modalId];
            let position, transitions;
            if (this.state.windowWidth === "desktop") {
                this.updateLayout(this.state.searchboxHeight);
                position = "openedFull";
                transitions = this.setStyleTransitions(this.state.windowWidth);
            } else {
                if (modalId === "modalAssociation") {
                    position = "openedPreview";
                    this.memory.previewHeight = this.calcPreviewHeight(modal);
                    transitions = this.setStyleTransitions(this.state.windowWidth);
                } else {
                    position = "openedFull";
                    transitions = this.setStyleTransitions(this.state.windowWidth);
                    this.memory.bottomBarHeight = this.calcBottomBarHeight(modal);
                }
            }

            this.memory[modalId].position = position;
            this.memory[modalId].transitions = transitions;
        }

        setStyleTransitions(windowWidth) {
            let transitions = {};
            if (windowWidth === "desktop") {
                transitions.transitionOn = "translateX(0)";
                transitions.transitionOnPreview = null;
                transitions.transitionOff = "translateX(-100%)";
            } else {
                if (this.memory.previewHeight) {
                    transitions.transitionOnPreview =
                        "translateY(" + this.memory.previewHeight + "px)";
                } else {
                    transitions.transitionOnPreview = null;
                }
                transitions.transitionOn = "translateY(-100%)";
                transitions.transitionOff = "translateY(0)";
            }
            return transitions;
        }

        setTabIndex(el, bool) {
            if (bool) {
                el.setAttribute("tabindex", "-1");
            } else {
                el.removeAttribute("tabindex");
            }
        }

        setUpModal() {
            const modals = this.getModals();

            if (modals) {
                modals.forEach((modal) => {
                    const modalId = modal.id;
                    this.modals[modalId] = modal;
                    if (modal.classList.contains(config.modal.openedClass)) ; else {
                        modal.setAttribute("aria-hidden", "true");
                        // modal.classList.add(config.modal.closedClass);
                        this.setTabIndex(modal, true);
                        this.memory[modalId].position = "closed";
                    }
                });
            }
        }

        /*
        Si la fenêtre du navigateur est en position "desktop",
        on ajoute une marge intérieure qui varie selon la hauteur
        du module Searchbox.
        */
        updateLayout(value) {
            for (const key in this.modals) {
                let innerDiv = this.modals[key].firstElementChild.firstElementChild;
                innerDiv.style.paddingTop = value + "px";
            }
        }
    }

    let atlas;
    let state = {
        windowWidth: null,
        searchboxHeight: null,
        keywords: new Map(),
        keywordsSelected: new Map(),
        modalAction: "",
        modalArgs: {},
        modalOpenId: "",
        modalId: "",
        centerMarker: {},
        moveZoom: "",
    };

    let init = (leafletmap) => {
        let conf = {
            containerId: "atlas",
            controls: [SearchBox, Keyword, KeywordSelected, Modal],
            dispatch: function dispatch(action) {
                state = atlas.handleAction(state, action);
                atlas.syncState(state);
            },
        };
        atlas = new AtlasBase(leafletmap, state, conf);
    };

    const addKeyword = (keyword) => {
        atlas.autocompleteAddKeyword(keyword);
    };

    exports.addKeyword = addKeyword;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
