/** Image lazy load plugin v0.1.1
 *  created at 2016-12-10 by dcirplan@gmail.com
 *  Released under the MIT License.
 */

;(function (win, id, factory) {
    "use strict";
    if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(id, win);
    } else if (typeof (define) === 'function' && define.amd ) { // AMD
        define(function () {
            return factory(id, win);
        });
    } else { // <script>
        win[id] = factory(id, win);
    }

})(window, 'LazyLoad', function (id, window) {
    "use strict";
    /*
    *  option {object}
    *         container {Element} 监听元素，默认为 window
    *         prefix    {String}  图片 src 属性，默认为 data-url
    *         class     {String}  需要懒加载的标记样式，默认为 .lazy
    *         async     {Bealoon} 页面中是否有异步加载，默认为 false
    * */
    function lazyLoadCtrl (option) {
        var _option = {
            container: window,
            prefix: 'data-url',
            class: '.lazy',
            async: false
        }

        ;(new LazyLoad(Object.assign(_option, option))).init()
    }

    function LazyLoad (option) {
        this.option = option
        this.list = []
        this.listenHandle = null
        this.insertHandle = null
    }

    LazyLoad.prototype = {
        constructor: LazyLoad,

        init: function () {
            this._scan()
            this.listenHandle = this._listen()
            this.listenHandle()
            this._on()
        },

        _scan: function () {
            var selector = this.option.class
            var list = document.querySelectorAll(selector),
                imgCache = []

            list.forEach((item) => {
                imgCache.push(item)
            })

            this.list = imgCache
        },

        _listen: function () {
            var self = this
            return throttle(() => {
                self._update()
                if (!self.option.async && !self.list.length) {
                    self._off()
                }
            }, 300)
        },

        _update: function () {
            var list = this.list,
                option = this.option,
                item,
                tempList = []

            for (var i = 0; i < list.length; i++) {
                item = list[i]
                if (this._elemInViewport(item, option.container)) {
                    var url = item.getAttribute(option.prefix)
                    if (url) {
                        item.src = url
                        item.removeAttribute(option.prefix)
                        item.classList.remove(option.class.substr(1))
                    }
                } else {
                    tempList.push(item)
                }
            }

            this.list = tempList
        },

        _elemInViewport: function (el, container) {
            var rect = el.getBoundingClientRect(),
                containerHeight

            container = container || window

            if (isWindow(container)) {
                containerHeight = window.innerHeight
            } else {
                containerHeight = container.offsetHeight
            }

            return (rect.top >= 0 && rect.top - containerHeight <= 0) ||
                (rect.bottom >= 0 && rect.bottom - containerHeight <= 0)
        },

        _async: function () {
            var option = this.option
            var self = this,
                wrap = isWindow(option.container) ?
                        document.body :
                        option.container

            if (!self.insertHandle) {
                self.insertHandle = throttle(() => {
                    self._scan()
                    self.listenHandle()
                }, 300)
            }
            wrap.addEventListener('DOMNodeInserted', self.insertHandle)
        },

        _on: function () {
            this.option.container.addEventListener('scroll', this.listenHandle)
            this.option.async && this._async()
        },

        _off () {
            this.option.container.removeEventListener('scroll', this.listenHandle)
        }
    }

    function throttle (action, delay) {
        var handle = null,
            lastRun = 0

        return () => {
            if (handle) return
            var time = Date.now() - lastRun,
                context = this,
                args = arguments,
                callback = function () {
                    lastRun = Date.now()
                    handle = false
                    action.apply(context, args)
                }

            if (time > delay) {
                callback()
            } else {
                handle = setTimeout(callback, delay)
            }
        }
    }

    function isWindow (obj) {
        return obj != null && obj == obj.window
    }

    return lazyLoadCtrl

});