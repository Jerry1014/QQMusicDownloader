/**
 * 曹杰峰音乐播放器
 * author: Cao(曹杰峰的博客)
 * qq: 1711315011
 * motto: php是世界上最好的语言(开个玩笑😂)
 * version: 2.2.1
 * webSite: https://www.caojiefeng.com/
 * time: 2019/03/24
 * disclaimer: 插件修改于明月浩空免费版，仅用于学习交流，无商业价值
 *             如发现商业传播，将禁止软件的免费使用
 *
 * Jerry1014 于2019/06/13 二次开发 主要工作为
 * 将播放器修改为本地播放器，歌曲的播放地址，图片，歌词等由本地提供
 */

/*
*脚本逻辑
* 定义各种各样的监听
* 通过某处的$.ajax进行异步的方式获取数据，并调用lzxPlayer.playList.creat.album
* 上一步的方法中再通过lzxMedia.getinfos获得歌曲属性
* 再在调用netmusic获取歌曲信息和播放地址
*/
// 检查jQuery插件是否安装
if (typeof jQuery === 'undefined') {
    throw new Error('请先加载jQuery插件！');
}

//这三个插件具体作用未知
/*mousewheel plugin*/
(function (a) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], a)
    } else {
        if (typeof exports === "object") {
            module.exports = a
        } else {
            a(jQuery)
        }
    }
}(function (c) {
    var d = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        k = ("onwheel" in document || document.documentMode >= 9) ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        h = Array.prototype.slice, j, b;
    if (c.event.fixHooks) {
        for (var e = d.length; e;) {
            c.event.fixHooks[d[--e]] = c.event.mouseHooks
        }
    }
    var f = c.event.special.mousewheel = {
        version: "3.1.9", setup: function () {
            if (this.addEventListener) {
                for (var m = k.length; m;) {
                    this.addEventListener(k[--m], l, false)
                }
            } else {
                this.onmousewheel = l
            }
            c.data(this, "mousewheel-line-height", f.getLineHeight(this));
            c.data(this, "mousewheel-page-height", f.getPageHeight(this))
        }, teardown: function () {
            if (this.removeEventListener) {
                for (var m = k.length; m;) {
                    this.removeEventListener(k[--m], l, false)
                }
            } else {
                this.onmousewheel = null
            }
        }, getLineHeight: function (i) {
            return parseInt(c(i)["offsetParent" in c.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
        }, getPageHeight: function (i) {
            return c(i).height()
        }, settings: {adjustOldDeltas: true}
    };
    c.fn.extend({
        mousewheel: function (i) {
            return i ? this.bind("mousewheel", i) : this.trigger("mousewheel")
        }, unmousewheel: function (i) {
            return this.unbind("mousewheel", i)
        }
    });

    function l(i) {
        var n = i || window.event, r = h.call(arguments, 1), t = 0, p = 0, o = 0, q = 0;
        i = c.event.fix(n);
        i.type = "mousewheel";
        if ("detail" in n) {
            o = n.detail * -1
        }
        if ("wheelDelta" in n) {
            o = n.wheelDelta
        }
        if ("wheelDeltaY" in n) {
            o = n.wheelDeltaY
        }
        if ("wheelDeltaX" in n) {
            p = n.wheelDeltaX * -1
        }
        if ("axis" in n && n.axis === n.HORIZONTAL_AXIS) {
            p = o * -1;
            o = 0
        }
        t = o === 0 ? p : o;
        if ("deltaY" in n) {
            o = n.deltaY * -1;
            t = o
        }
        if ("deltaX" in n) {
            p = n.deltaX;
            if (o === 0) {
                t = p * -1
            }
        }
        if (o === 0 && p === 0) {
            return
        }
        if (n.deltaMode === 1) {
            var s = c.data(this, "mousewheel-line-height");
            t *= s;
            o *= s;
            p *= s
        } else {
            if (n.deltaMode === 2) {
                var m = c.data(this, "mousewheel-page-height");
                t *= m;
                o *= m;
                p *= m
            }
        }
        q = Math.max(Math.abs(o), Math.abs(p));
        if (!b || q < b) {
            b = q;
            if (a(n, q)) {
                b /= 40
            }
        }
        if (a(n, q)) {
            t /= 40;
            p /= 40;
            o /= 40
        }
        t = Math[t >= 1 ? "floor" : "ceil"](t / b);
        p = Math[p >= 1 ? "floor" : "ceil"](p / b);
        o = Math[o >= 1 ? "floor" : "ceil"](o / b);
        i.deltaX = p;
        i.deltaY = o;
        i.deltaFactor = b;
        i.deltaMode = 0;
        r.unshift(i, t, p, o);
        if (j) {
            clearTimeout(j)
        }
        j = setTimeout(g, 200);
        return (c.event.dispatch || c.event.handle).apply(this, r)
    }

    function g() {
        b = null
    }

    function a(m, i) {
        return f.settings.adjustOldDeltas && m.type === "mousewheel" && i % 120 === 0
    }
}));
/*scrollbar plugin*/
(function (c) {
    var b = {
        init: function (e) {
            var f = {
                set_width: false,
                set_height: false,
                horizontalScroll: false,
                scrollInertia: 950,
                mouseWheel: true,
                mouseWheelPixels: "auto",
                autoDraggerLength: true,
                autoHideScrollbar: false,
                alwaysShowScrollbar: false,
                snapAmount: null,
                snapOffset: 0,
                scrollButtons: {enable: false, scrollType: "continuous", scrollSpeed: "auto", scrollAmount: 40},
                advanced: {
                    updateOnBrowserResize: true,
                    updateOnContentResize: false,
                    autoExpandHorizontalScroll: false,
                    autoScrollOnFocus: true,
                    normalizeMouseWheelDelta: false
                },
                contentTouchScroll: true,
                callbacks: {
                    onScrollStart: function () {
                    }, onScroll: function () {
                    }, onTotalScroll: function () {
                    }, onTotalScrollBack: function () {
                    }, onTotalScrollOffset: 0, onTotalScrollBackOffset: 0, whileScrolling: function () {
                    }
                },
                theme: "light"
            }, e = c.extend(true, f, e);
            return this.each(function () {
                var m = c(this);
                if (e.set_width) {
                    m.css("width", e.set_width)
                }
                if (e.set_height) {
                    m.css("height", e.set_height)
                }
                if (!c(document).data("mCustomScrollbar-index")) {
                    c(document).data("mCustomScrollbar-index", "1")
                } else {
                    var t = parseInt(c(document).data("mCustomScrollbar-index"));
                    c(document).data("mCustomScrollbar-index", t + 1)
                }
                m.wrapInner("<div class='mCustomScrollBox mCS-" + e.theme + "' id='mCSB_" + c(document).data("mCustomScrollbar-index") + "' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_" + c(document).data("mCustomScrollbar-index"));
                var g = m.children(".mCustomScrollBox");
                if (e.horizontalScroll) {
                    g.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");
                    var k = g.children(".mCSB_h_wrapper");
                    k.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({
                        width: k.children().outerWidth(),
                        position: "relative"
                    }).unwrap()
                } else {
                    g.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />")
                }
                var o = g.children(".mCSB_container");
                if (c.support.touch) {
                    o.addClass("mCS_touch")
                }
                o.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");
                var l = g.children(".mCSB_scrollTools"), h = l.children(".mCSB_draggerContainer"),
                    q = h.children(".mCSB_dragger");
                if (e.horizontalScroll) {
                    q.data("minDraggerWidth", q.width())
                } else {
                    q.data("minDraggerHeight", q.height())
                }
                if (e.scrollButtons.enable) {
                    if (e.horizontalScroll) {
                        l.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>")
                    } else {
                        l.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>")
                    }
                }
                g.bind("scroll", function () {
                    if (!m.is(".mCS_disabled")) {
                        g.scrollTop(0).scrollLeft(0)
                    }
                });
                m.data({
                    mCS_Init: true,
                    mCustomScrollbarIndex: c(document).data("mCustomScrollbar-index"),
                    horizontalScroll: e.horizontalScroll,
                    scrollInertia: e.scrollInertia,
                    scrollEasing: "mcsEaseOut",
                    mouseWheel: e.mouseWheel,
                    mouseWheelPixels: e.mouseWheelPixels,
                    autoDraggerLength: e.autoDraggerLength,
                    autoHideScrollbar: e.autoHideScrollbar,
                    alwaysShowScrollbar: e.alwaysShowScrollbar,
                    snapAmount: e.snapAmount,
                    snapOffset: e.snapOffset,
                    scrollButtons_enable: e.scrollButtons.enable,
                    scrollButtons_scrollType: e.scrollButtons.scrollType,
                    scrollButtons_scrollSpeed: e.scrollButtons.scrollSpeed,
                    scrollButtons_scrollAmount: e.scrollButtons.scrollAmount,
                    autoExpandHorizontalScroll: e.advanced.autoExpandHorizontalScroll,
                    autoScrollOnFocus: e.advanced.autoScrollOnFocus,
                    normalizeMouseWheelDelta: e.advanced.normalizeMouseWheelDelta,
                    contentTouchScroll: e.contentTouchScroll,
                    onScrollStart_Callback: e.callbacks.onScrollStart,
                    onScroll_Callback: e.callbacks.onScroll,
                    onTotalScroll_Callback: e.callbacks.onTotalScroll,
                    onTotalScrollBack_Callback: e.callbacks.onTotalScrollBack,
                    onTotalScroll_Offset: e.callbacks.onTotalScrollOffset,
                    onTotalScrollBack_Offset: e.callbacks.onTotalScrollBackOffset,
                    whileScrolling_Callback: e.callbacks.whileScrolling,
                    bindEvent_scrollbar_drag: false,
                    bindEvent_content_touch: false,
                    bindEvent_scrollbar_click: false,
                    bindEvent_mousewheel: false,
                    bindEvent_buttonsContinuous_y: false,
                    bindEvent_buttonsContinuous_x: false,
                    bindEvent_buttonsPixels_y: false,
                    bindEvent_buttonsPixels_x: false,
                    bindEvent_focusin: false,
                    bindEvent_autoHideScrollbar: false,
                    mCSB_buttonScrollRight: false,
                    mCSB_buttonScrollLeft: false,
                    mCSB_buttonScrollDown: false,
                    mCSB_buttonScrollUp: false
                });
                if (e.horizontalScroll) {
                    if (m.css("max-width") !== "none") {
                        if (!e.advanced.updateOnContentResize) {
                            e.advanced.updateOnContentResize = true
                        }
                    }
                } else {
                    if (m.css("max-height") !== "none") {
                        var s = false, r = parseInt(m.css("max-height"));
                        if (m.css("max-height").indexOf("%") >= 0) {
                            s = r, r = m.parent().height() * s / 100
                        }
                        m.css("overflow", "hidden");
                        g.css("max-height", r)
                    }
                }
                m.mCustomScrollbar("update");
                if (e.advanced.updateOnBrowserResize) {
                    var i, j = c(window).width(), u = c(window).height();
                    c(window).bind("resize." + m.data("mCustomScrollbarIndex"), function () {
                        if (i) {
                            clearTimeout(i)
                        }
                        i = setTimeout(function () {
                            if (!m.is(".mCS_disabled") && !m.is(".mCS_destroyed")) {
                                var w = c(window).width(), v = c(window).height();
                                if (j !== w || u !== v) {
                                    if (m.css("max-height") !== "none" && s) {
                                        g.css("max-height", m.parent().height() * s / 100)
                                    }
                                    m.mCustomScrollbar("update");
                                    j = w;
                                    u = v
                                }
                            }
                        }, 150)
                    })
                }
                if (e.advanced.updateOnContentResize) {
                    var p;
                    if (e.horizontalScroll) {
                        var n = o.outerWidth()
                    } else {
                        var n = o.outerHeight()
                    }
                    p = setInterval(function () {
                        if (e.horizontalScroll) {
                            if (e.advanced.autoExpandHorizontalScroll) {
                                o.css({
                                    position: "absolute",
                                    width: "auto"
                                }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
                                    width: o.outerWidth(),
                                    position: "relative"
                                }).unwrap()
                            }
                            var v = o.outerWidth()
                        } else {
                            var v = o.outerHeight()
                        }
                        if (v != n) {
                            m.mCustomScrollbar("update");
                            n = v
                        }
                    }, 300)
                }
            })
        }, update: function () {
            var n = c(this), k = n.children(".mCustomScrollBox"), q = k.children(".mCSB_container");
            q.removeClass("mCS_no_scrollbar");
            n.removeClass("mCS_disabled mCS_destroyed");
            k.scrollTop(0).scrollLeft(0);
            var y = k.children(".mCSB_scrollTools"), o = y.children(".mCSB_draggerContainer"),
                m = o.children(".mCSB_dragger");
            if (n.data("horizontalScroll")) {
                var A = y.children(".mCSB_buttonLeft"), t = y.children(".mCSB_buttonRight"), f = k.width();
                if (n.data("autoExpandHorizontalScroll")) {
                    q.css({
                        position: "absolute",
                        width: "auto"
                    }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
                        width: q.outerWidth(),
                        position: "relative"
                    }).unwrap()
                }
                var z = q.outerWidth()
            } else {
                var w = y.children(".mCSB_buttonUp"), g = y.children(".mCSB_buttonDown"), r = k.height(),
                    i = q.outerHeight()
            }
            if (i > r && !n.data("horizontalScroll")) {
                y.css("display", "block");
                var s = o.height();
                if (n.data("autoDraggerLength")) {
                    var u = Math.round(r / i * s), l = m.data("minDraggerHeight");
                    if (u <= l) {
                        m.css({height: l})
                    } else {
                        if (u >= s - 10) {
                            var p = s - 10;
                            m.css({height: p})
                        } else {
                            m.css({height: u})
                        }
                    }
                    m.children(".mCSB_dragger_bar").css({"line-height": m.height() + "px"})
                }
                var B = m.height(), x = (i - r) / (s - B);
                n.data("scrollAmount", x).mCustomScrollbar("scrolling", k, q, o, m, w, g, A, t);
                var D = Math.abs(q.position().top);
                n.mCustomScrollbar("scrollTo", D, {scrollInertia: 0, trigger: "internal"})
            } else {
                if (z > f && n.data("horizontalScroll")) {
                    y.css("display", "block");
                    var h = o.width();
                    if (n.data("autoDraggerLength")) {
                        var j = Math.round(f / z * h), C = m.data("minDraggerWidth");
                        if (j <= C) {
                            m.css({width: C})
                        } else {
                            if (j >= h - 10) {
                                var e = h - 10;
                                m.css({width: e})
                            } else {
                                m.css({width: j})
                            }
                        }
                    }
                    var v = m.width(), x = (z - f) / (h - v);
                    n.data("scrollAmount", x).mCustomScrollbar("scrolling", k, q, o, m, w, g, A, t);
                    var D = Math.abs(q.position().left);
                    n.mCustomScrollbar("scrollTo", D, {scrollInertia: 0, trigger: "internal"})
                } else {
                    k.unbind("mousewheel focusin");
                    if (n.data("horizontalScroll")) {
                        m.add(q).css("left", 0)
                    } else {
                        m.add(q).css("top", 0)
                    }
                    if (n.data("alwaysShowScrollbar")) {
                        if (!n.data("horizontalScroll")) {
                            m.css({height: o.height()})
                        } else {
                            if (n.data("horizontalScroll")) {
                                m.css({width: o.width()})
                            }
                        }
                    } else {
                        y.css("display", "none");
                        q.addClass("mCS_no_scrollbar")
                    }
                    n.data({bindEvent_mousewheel: false, bindEvent_focusin: false})
                }
            }
        }, scrolling: function (i, q, n, k, A, f, D, w) {
            var l = c(this);
            if (!l.data("bindEvent_scrollbar_drag")) {
                var o, p, C, z, e;
                if (c.support.pointer) {
                    C = "pointerdown";
                    z = "pointermove";
                    e = "pointerup"
                } else {
                    if (c.support.msPointer) {
                        C = "MSPointerDown";
                        z = "MSPointerMove";
                        e = "MSPointerUp"
                    }
                }
                if (c.support.pointer || c.support.msPointer) {
                    k.bind(C, function (K) {
                        K.preventDefault();
                        l.data({on_drag: true});
                        k.addClass("mCSB_dragger_onDrag");
                        var J = c(this), M = J.offset(), I = K.originalEvent.pageX - M.left,
                            L = K.originalEvent.pageY - M.top;
                        if (I < J.width() && I > 0 && L < J.height() && L > 0) {
                            o = L;
                            p = I
                        }
                    });
                    c(document).bind(z + "." + l.data("mCustomScrollbarIndex"), function (K) {
                        K.preventDefault();
                        if (l.data("on_drag")) {
                            var J = k, M = J.offset(), I = K.originalEvent.pageX - M.left,
                                L = K.originalEvent.pageY - M.top;
                            G(o, p, L, I)
                        }
                    }).bind(e + "." + l.data("mCustomScrollbarIndex"), function (x) {
                        l.data({on_drag: false});
                        k.removeClass("mCSB_dragger_onDrag")
                    })
                } else {
                    k.bind("mousedown touchstart", function (K) {
                        K.preventDefault();
                        K.stopImmediatePropagation();
                        var J = c(this), N = J.offset(), I, M;
                        if (K.type === "touchstart") {
                            var L = K.originalEvent.touches[0] || K.originalEvent.changedTouches[0];
                            I = L.pageX - N.left;
                            M = L.pageY - N.top
                        } else {
                            l.data({on_drag: true});
                            k.addClass("mCSB_dragger_onDrag");
                            I = K.pageX - N.left;
                            M = K.pageY - N.top
                        }
                        if (I < J.width() && I > 0 && M < J.height() && M > 0) {
                            o = M;
                            p = I
                        }
                    }).bind("touchmove", function (K) {
                        K.preventDefault();
                        K.stopImmediatePropagation();
                        var N = K.originalEvent.touches[0] || K.originalEvent.changedTouches[0], J = c(this),
                            M = J.offset(), I = N.pageX - M.left, L = N.pageY - M.top;
                        G(o, p, L, I)
                    });
                    c(document).bind("mousemove." + l.data("mCustomScrollbarIndex"), function (K) {
                        if (l.data("on_drag")) {
                            var J = k, M = J.offset(), I = K.pageX - M.left, L = K.pageY - M.top;
                            G(o, p, L, I)
                        }
                    }).bind("mouseup." + l.data("mCustomScrollbarIndex"), function (x) {
                        l.data({on_drag: false});
                        k.removeClass("mCSB_dragger_onDrag")
                    })
                }
                l.data({bindEvent_scrollbar_drag: true})
            }

            function G(J, K, L, I) {
                if (l.data("horizontalScroll")) {
                    l.mCustomScrollbar("scrollTo", (k.position().left - (K)) + I, {
                        moveDragger: true,
                        trigger: "internal"
                    })
                } else {
                    l.mCustomScrollbar("scrollTo", (k.position().top - (J)) + L, {
                        moveDragger: true,
                        trigger: "internal"
                    })
                }
            }

            if (c.support.touch && l.data("contentTouchScroll")) {
                if (!l.data("bindEvent_content_touch")) {
                    var m, E, s, t, v, F, H;
                    q.bind("touchstart", function (x) {
                        x.stopImmediatePropagation();
                        m = x.originalEvent.touches[0] || x.originalEvent.changedTouches[0];
                        E = c(this);
                        s = E.offset();
                        v = m.pageX - s.left;
                        t = m.pageY - s.top;
                        F = t;
                        H = v
                    });
                    q.bind("touchmove", function (x) {
                        x.preventDefault();
                        x.stopImmediatePropagation();
                        m = x.originalEvent.touches[0] || x.originalEvent.changedTouches[0];
                        E = c(this).parent();
                        s = E.offset();
                        v = m.pageX - s.left;
                        t = m.pageY - s.top;
                        if (l.data("horizontalScroll")) {
                            l.mCustomScrollbar("scrollTo", H - v, {trigger: "internal"})
                        } else {
                            l.mCustomScrollbar("scrollTo", F - t, {trigger: "internal"})
                        }
                    })
                }
            }
            if (!l.data("bindEvent_scrollbar_click")) {
                n.bind("click", function (I) {
                    var x = (I.pageY - n.offset().top) * l.data("scrollAmount"), y = c(I.target);
                    if (l.data("horizontalScroll")) {
                        x = (I.pageX - n.offset().left) * l.data("scrollAmount")
                    }
                    if (y.hasClass("mCSB_draggerContainer") || y.hasClass("mCSB_draggerRail")) {
                        l.mCustomScrollbar("scrollTo", x, {trigger: "internal", scrollEasing: "draggerRailEase"})
                    }
                });
                l.data({bindEvent_scrollbar_click: true})
            }
            if (l.data("mouseWheel")) {
                if (!l.data("bindEvent_mousewheel")) {
                    i.bind("mousewheel", function (K, M) {
                        var J, I = l.data("mouseWheelPixels"), x = Math.abs(q.position().top), L = k.position().top,
                            y = n.height() - k.height();
                        if (l.data("normalizeMouseWheelDelta")) {
                            if (M < 0) {
                                M = -1
                            } else {
                                M = 1
                            }
                        }
                        if (I === "auto") {
                            I = 100 + Math.round(l.data("scrollAmount") / 2)
                        }
                        if (l.data("horizontalScroll")) {
                            L = k.position().left;
                            y = n.width() - k.width();
                            x = Math.abs(q.position().left)
                        }
                        if ((M > 0 && L !== 0) || (M < 0 && L !== y)) {
                            K.preventDefault();
                            K.stopImmediatePropagation()
                        }
                        J = x - (M * I);
                        l.mCustomScrollbar("scrollTo", J, {trigger: "internal"})
                    });
                    l.data({bindEvent_mousewheel: true})
                }
            }
            if (l.data("scrollButtons_enable")) {
                if (l.data("scrollButtons_scrollType") === "pixels") {
                    if (l.data("horizontalScroll")) {
                        w.add(D).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend", j, h);
                        l.data({bindEvent_buttonsContinuous_x: false});
                        if (!l.data("bindEvent_buttonsPixels_x")) {
                            w.bind("click", function (x) {
                                x.preventDefault();
                                r(Math.abs(q.position().left) + l.data("scrollButtons_scrollAmount"))
                            });
                            D.bind("click", function (x) {
                                x.preventDefault();
                                r(Math.abs(q.position().left) - l.data("scrollButtons_scrollAmount"))
                            });
                            l.data({bindEvent_buttonsPixels_x: true})
                        }
                    } else {
                        f.add(A).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend", j, h);
                        l.data({bindEvent_buttonsContinuous_y: false});
                        if (!l.data("bindEvent_buttonsPixels_y")) {
                            f.bind("click", function (x) {
                                x.preventDefault();
                                r(Math.abs(q.position().top) + l.data("scrollButtons_scrollAmount"))
                            });
                            A.bind("click", function (x) {
                                x.preventDefault();
                                r(Math.abs(q.position().top) - l.data("scrollButtons_scrollAmount"))
                            });
                            l.data({bindEvent_buttonsPixels_y: true})
                        }
                    }

                    function r(x) {
                        if (!k.data("preventAction")) {
                            k.data("preventAction", true);
                            l.mCustomScrollbar("scrollTo", x, {trigger: "internal"})
                        }
                    }
                } else {
                    if (l.data("horizontalScroll")) {
                        w.add(D).unbind("click");
                        l.data({bindEvent_buttonsPixels_x: false});
                        if (!l.data("bindEvent_buttonsContinuous_x")) {
                            w.bind("mousedown touchstart MSPointerDown pointerdown", function (y) {
                                y.preventDefault();
                                var x = B();
                                l.data({
                                    mCSB_buttonScrollRight: setInterval(function () {
                                        l.mCustomScrollbar("scrollTo", Math.abs(q.position().left) + x, {
                                            trigger: "internal",
                                            scrollEasing: "easeOutCirc"
                                        })
                                    }, 17)
                                })
                            });
                            var j = function (x) {
                                x.preventDefault();
                                clearInterval(l.data("mCSB_buttonScrollRight"))
                            };
                            w.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout", j);
                            D.bind("mousedown touchstart MSPointerDown pointerdown", function (y) {
                                y.preventDefault();
                                var x = B();
                                l.data({
                                    mCSB_buttonScrollLeft: setInterval(function () {
                                        l.mCustomScrollbar("scrollTo", Math.abs(q.position().left) - x, {
                                            trigger: "internal",
                                            scrollEasing: "easeOutCirc"
                                        })
                                    }, 17)
                                })
                            });
                            var h = function (x) {
                                x.preventDefault();
                                clearInterval(l.data("mCSB_buttonScrollLeft"))
                            };
                            D.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout", h);
                            l.data({bindEvent_buttonsContinuous_x: true})
                        }
                    } else {
                        f.add(A).unbind("click");
                        l.data({bindEvent_buttonsPixels_y: false});
                        if (!l.data("bindEvent_buttonsContinuous_y")) {
                            f.bind("mousedown touchstart MSPointerDown pointerdown", function (y) {
                                y.preventDefault();
                                var x = B();
                                l.data({
                                    mCSB_buttonScrollDown: setInterval(function () {
                                        l.mCustomScrollbar("scrollTo", Math.abs(q.position().top) + x, {
                                            trigger: "internal",
                                            scrollEasing: "easeOutCirc"
                                        })
                                    }, 17)
                                })
                            });
                            var u = function (x) {
                                x.preventDefault();
                                clearInterval(l.data("mCSB_buttonScrollDown"))
                            };
                            f.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout", u);
                            A.bind("mousedown touchstart MSPointerDown pointerdown", function (y) {
                                y.preventDefault();
                                var x = B();
                                l.data({
                                    mCSB_buttonScrollUp: setInterval(function () {
                                        l.mCustomScrollbar("scrollTo", Math.abs(q.position().top) - x, {
                                            trigger: "internal",
                                            scrollEasing: "easeOutCirc"
                                        })
                                    }, 17)
                                })
                            });
                            var g = function (x) {
                                x.preventDefault();
                                clearInterval(l.data("mCSB_buttonScrollUp"))
                            };
                            A.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout", g);
                            l.data({bindEvent_buttonsContinuous_y: true})
                        }
                    }

                    function B() {
                        var x = l.data("scrollButtons_scrollSpeed");
                        if (l.data("scrollButtons_scrollSpeed") === "auto") {
                            x = Math.round((l.data("scrollInertia") + 100) / 40)
                        }
                        return x
                    }
                }
            }
            if (l.data("autoScrollOnFocus")) {
                if (!l.data("bindEvent_focusin")) {
                    i.bind("focusin", function () {
                        i.scrollTop(0).scrollLeft(0);
                        var x = c(document.activeElement);
                        if (x.is("input,textarea,select,button,a[tabindex],area,object")) {
                            var J = q.position().top, y = x.position().top, I = i.height() - x.outerHeight();
                            if (l.data("horizontalScroll")) {
                                J = q.position().left;
                                y = x.position().left;
                                I = i.width() - x.outerWidth()
                            }
                            if (J + y < 0 || J + y > I) {
                                l.mCustomScrollbar("scrollTo", y, {trigger: "internal"})
                            }
                        }
                    });
                    l.data({bindEvent_focusin: true})
                }
            }
            if (l.data("autoHideScrollbar") && !l.data("alwaysShowScrollbar")) {
                if (!l.data("bindEvent_autoHideScrollbar")) {
                    i.bind("mouseenter", function (x) {
                        i.addClass("mCS-mouse-over");
                        d.showScrollbar.call(i.children(".mCSB_scrollTools"))
                    }).bind("mouseleave touchend", function (x) {
                        i.removeClass("mCS-mouse-over");
                        if (x.type === "mouseleave") {
                            d.hideScrollbar.call(i.children(".mCSB_scrollTools"))
                        }
                    });
                    l.data({bindEvent_autoHideScrollbar: true})
                }
            }
        }, scrollTo: function (e, f) {
            var i = c(this), o = {
                    moveDragger: false,
                    trigger: "external",
                    callbacks: true,
                    scrollInertia: i.data("scrollInertia"),
                    scrollEasing: i.data("scrollEasing")
                }, f = c.extend(o, f), p, g = i.children(".mCustomScrollBox"), k = g.children(".mCSB_container"),
                r = g.children(".mCSB_scrollTools"), j = r.children(".mCSB_draggerContainer"),
                h = j.children(".mCSB_dragger"), t = draggerSpeed = f.scrollInertia, q, s, m, l;
            if (!k.hasClass("mCS_no_scrollbar")) {
                i.data({mCS_trigger: f.trigger});
                if (i.data("mCS_Init")) {
                    f.callbacks = false
                }
                if (e || e === 0) {
                    if (typeof (e) === "number") {
                        if (f.moveDragger) {
                            p = e;
                            if (i.data("horizontalScroll")) {
                                e = h.position().left * i.data("scrollAmount")
                            } else {
                                e = h.position().top * i.data("scrollAmount")
                            }
                            draggerSpeed = 0
                        } else {
                            p = e / i.data("scrollAmount")
                        }
                    } else {
                        if (typeof (e) === "string") {
                            var v;
                            if (e === "top") {
                                v = 0
                            } else {
                                if (e === "bottom" && !i.data("horizontalScroll")) {
                                    v = k.outerHeight() - g.height()
                                } else {
                                    if (e === "left") {
                                        v = 0
                                    } else {
                                        if (e === "right" && i.data("horizontalScroll")) {
                                            v = k.outerWidth() - g.width()
                                        } else {
                                            if (e === "first") {
                                                v = i.find(".mCSB_container").find(":first")
                                            } else {
                                                if (e === "last") {
                                                    v = i.find(".mCSB_container").find(":last")
                                                } else {
                                                    v = i.find(e)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (v.length === 1) {
                                if (i.data("horizontalScroll")) {
                                    e = v.position().left
                                } else {
                                    e = v.position().top
                                }
                                p = e / i.data("scrollAmount")
                            } else {
                                p = e = v
                            }
                        }
                    }
                    if (i.data("horizontalScroll")) {
                        if (i.data("onTotalScrollBack_Offset")) {
                            s = -i.data("onTotalScrollBack_Offset")
                        }
                        if (i.data("onTotalScroll_Offset")) {
                            l = g.width() - k.outerWidth() + i.data("onTotalScroll_Offset")
                        }
                        if (p < 0) {
                            p = e = 0;
                            clearInterval(i.data("mCSB_buttonScrollLeft"));
                            if (!s) {
                                q = true
                            }
                        } else {
                            if (p >= j.width() - h.width()) {
                                p = j.width() - h.width();
                                e = g.width() - k.outerWidth();
                                clearInterval(i.data("mCSB_buttonScrollRight"));
                                if (!l) {
                                    m = true
                                }
                            } else {
                                e = -e
                            }
                        }
                        var n = i.data("snapAmount");
                        if (n) {
                            e = Math.round(e / n) * n - i.data("snapOffset")
                        }
                        d.mTweenAxis.call(this, h[0], "left", Math.round(p), draggerSpeed, f.scrollEasing);
                        d.mTweenAxis.call(this, k[0], "left", Math.round(e), t, f.scrollEasing, {
                            onStart: function () {
                                if (f.callbacks && !i.data("mCS_tweenRunning")) {
                                    u("onScrollStart")
                                }
                                if (i.data("autoHideScrollbar") && !i.data("alwaysShowScrollbar")) {
                                    d.showScrollbar.call(r)
                                }
                            }, onUpdate: function () {
                                if (f.callbacks) {
                                    u("whileScrolling")
                                }
                            }, onComplete: function () {
                                if (f.callbacks) {
                                    u("onScroll");
                                    if (q || (s && k.position().left >= s)) {
                                        u("onTotalScrollBack")
                                    }
                                    if (m || (l && k.position().left <= l)) {
                                        u("onTotalScroll")
                                    }
                                }
                                h.data("preventAction", false);
                                i.data("mCS_tweenRunning", false);
                                if (i.data("autoHideScrollbar") && !i.data("alwaysShowScrollbar")) {
                                    if (!g.hasClass("mCS-mouse-over")) {
                                        d.hideScrollbar.call(r)
                                    }
                                }
                            }
                        })
                    } else {
                        if (i.data("onTotalScrollBack_Offset")) {
                            s = -i.data("onTotalScrollBack_Offset")
                        }
                        if (i.data("onTotalScroll_Offset")) {
                            l = g.height() - k.outerHeight() + i.data("onTotalScroll_Offset")
                        }
                        if (p < 0) {
                            p = e = 0;
                            clearInterval(i.data("mCSB_buttonScrollUp"));
                            if (!s) {
                                q = true
                            }
                        } else {
                            if (p >= j.height() - h.height()) {
                                p = j.height() - h.height();
                                e = g.height() - k.outerHeight();
                                clearInterval(i.data("mCSB_buttonScrollDown"));
                                if (!l) {
                                    m = true
                                }
                            } else {
                                e = -e
                            }
                        }
                        var n = i.data("snapAmount");
                        if (n) {
                            e = Math.round(e / n) * n - i.data("snapOffset")
                        }
                        d.mTweenAxis.call(this, h[0], "top", Math.round(p), draggerSpeed, f.scrollEasing);
                        d.mTweenAxis.call(this, k[0], "top", Math.round(e), t, f.scrollEasing, {
                            onStart: function () {
                                if (f.callbacks && !i.data("mCS_tweenRunning")) {
                                    u("onScrollStart")
                                }
                                if (i.data("autoHideScrollbar") && !i.data("alwaysShowScrollbar")) {
                                    d.showScrollbar.call(r)
                                }
                            }, onUpdate: function () {
                                if (f.callbacks) {
                                    u("whileScrolling")
                                }
                            }, onComplete: function () {
                                if (f.callbacks) {
                                    u("onScroll");
                                    if (q || (s && k.position().top >= s)) {
                                        u("onTotalScrollBack")
                                    }
                                    if (m || (l && k.position().top <= l)) {
                                        u("onTotalScroll")
                                    }
                                }
                                h.data("preventAction", false);
                                i.data("mCS_tweenRunning", false);
                                if (i.data("autoHideScrollbar") && !i.data("alwaysShowScrollbar")) {
                                    if (!g.hasClass("mCS-mouse-over")) {
                                        d.hideScrollbar.call(r)
                                    }
                                }
                            }
                        })
                    }
                    if (i.data("mCS_Init")) {
                        i.data({mCS_Init: false})
                    }
                }
            }

            function u(w) {
                if (i.data("mCustomScrollbarIndex")) {
                    this.mcs = {
                        top: k.position().top,
                        left: k.position().left,
                        draggerTop: h.position().top,
                        draggerLeft: h.position().left,
                        topPct: Math.round((100 * Math.abs(k.position().top)) / Math.abs(k.outerHeight() - g.height())),
                        leftPct: Math.round((100 * Math.abs(k.position().left)) / Math.abs(k.outerWidth() - g.width()))
                    };
                    switch (w) {
                        case"onScrollStart":
                            i.data("mCS_tweenRunning", true).data("onScrollStart_Callback").call(i, this.mcs);
                            break;
                        case"whileScrolling":
                            i.data("whileScrolling_Callback").call(i, this.mcs);
                            break;
                        case"onScroll":
                            i.data("onScroll_Callback").call(i, this.mcs);
                            break;
                        case"onTotalScrollBack":
                            i.data("onTotalScrollBack_Callback").call(i, this.mcs);
                            break;
                        case"onTotalScroll":
                            i.data("onTotalScroll_Callback").call(i, this.mcs);
                            break
                    }
                }
            }
        }, stop: function () {
            var g = c(this), e = g.children().children(".mCSB_container"),
                f = g.children().children().children().children(".mCSB_dragger");
            d.mTweenAxisStop.call(this, e[0]);
            d.mTweenAxisStop.call(this, f[0])
        }, disable: function (e) {
            var j = c(this), f = j.children(".mCustomScrollBox"), h = f.children(".mCSB_container"),
                g = f.children(".mCSB_scrollTools"), i = g.children().children(".mCSB_dragger");
            f.unbind("mousewheel focusin mouseenter mouseleave touchend");
            h.unbind("touchstart touchmove");
            if (e) {
                if (j.data("horizontalScroll")) {
                    i.add(h).css("left", 0)
                } else {
                    i.add(h).css("top", 0)
                }
            }
            g.css("display", "none");
            h.addClass("mCS_no_scrollbar");
            j.data({
                bindEvent_mousewheel: false,
                bindEvent_focusin: false,
                bindEvent_content_touch: false,
                bindEvent_autoHideScrollbar: false
            }).addClass("mCS_disabled")
        }, destroy: function () {
            var e = c(this);
            e.removeClass("mCustomScrollbar _mCS_" + e.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove();
            c(document).unbind("mousemove." + e.data("mCustomScrollbarIndex") + " mouseup." + e.data("mCustomScrollbarIndex") + " MSPointerMove." + e.data("mCustomScrollbarIndex") + " MSPointerUp." + e.data("mCustomScrollbarIndex"));
            c(window).unbind("resize." + e.data("mCustomScrollbarIndex"))
        }
    }, d = {
        showScrollbar: function () {
            this.stop().animate({opacity: 1}, "fast")
        }, hideScrollbar: function () {
            this.stop().animate({opacity: 0}, "fast")
        }, mTweenAxis: function (g, i, h, f, o, y) {
            var y = y || {}, v = y.onStart || function () {
            }, p = y.onUpdate || function () {
            }, w = y.onComplete || function () {
            };
            var n = t(), l, j = 0, r = g.offsetTop, s = g.style;
            if (i === "left") {
                r = g.offsetLeft
            }
            var m = h - r;
            q();
            e();

            function t() {
                if (window.performance && window.performance.now) {
                    return window.performance.now()
                } else {
                    if (window.performance && window.performance.webkitNow) {
                        return window.performance.webkitNow()
                    } else {
                        if (Date.now) {
                            return Date.now()
                        } else {
                            return new Date().getTime()
                        }
                    }
                }
            }

            function x() {
                if (!j) {
                    v.call()
                }
                j = t() - n;
                u();
                if (j >= g._time) {
                    g._time = (j > g._time) ? j + l - (j - g._time) : j + l - 1;
                    if (g._time < j + 1) {
                        g._time = j + 1
                    }
                }
                if (g._time < f) {
                    g._id = _request(x)
                } else {
                    w.call()
                }
            }

            function u() {
                if (f > 0) {
                    g.currVal = k(g._time, r, m, f, o);
                    s[i] = Math.round(g.currVal) + "px"
                } else {
                    s[i] = h + "px"
                }
                p.call()
            }

            function e() {
                l = 1000 / 60;
                g._time = j + l;
                _request = (!window.requestAnimationFrame) ? function (z) {
                    u();
                    return setTimeout(z, 0.01)
                } : window.requestAnimationFrame;
                g._id = _request(x)
            }

            function q() {
                if (g._id == null) {
                    return
                }
                if (!window.requestAnimationFrame) {
                    clearTimeout(g._id)
                } else {
                    window.cancelAnimationFrame(g._id)
                }
                g._id = null
            }

            function k(B, A, F, E, C) {
                switch (C) {
                    case"linear":
                        return F * B / E + A;
                        break;
                    case"easeOutQuad":
                        B /= E;
                        return -F * B * (B - 2) + A;
                        break;
                    case"easeInOutQuad":
                        B /= E / 2;
                        if (B < 1) {
                            return F / 2 * B * B + A
                        }
                        B--;
                        return -F / 2 * (B * (B - 2) - 1) + A;
                        break;
                    case"easeOutCubic":
                        B /= E;
                        B--;
                        return F * (B * B * B + 1) + A;
                        break;
                    case"easeOutQuart":
                        B /= E;
                        B--;
                        return -F * (B * B * B * B - 1) + A;
                        break;
                    case"easeOutQuint":
                        B /= E;
                        B--;
                        return F * (B * B * B * B * B + 1) + A;
                        break;
                    case"easeOutCirc":
                        B /= E;
                        B--;
                        return F * Math.sqrt(1 - B * B) + A;
                        break;
                    case"easeOutSine":
                        return F * Math.sin(B / E * (Math.PI / 2)) + A;
                        break;
                    case"easeOutExpo":
                        return F * (-Math.pow(2, -10 * B / E) + 1) + A;
                        break;
                    case"mcsEaseOut":
                        var D = (B /= E) * B, z = D * B;
                        return A + F * (0.499999999999997 * z * D + -2.5 * D * D + 5.5 * z + -6.5 * D + 4 * B);
                        break;
                    case"draggerRailEase":
                        B /= E / 2;
                        if (B < 1) {
                            return F / 2 * B * B * B + A
                        }
                        B -= 2;
                        return F / 2 * (B * B * B + 2) + A;
                        break
                }
            }
        }, mTweenAxisStop: function (e) {
            if (e._id == null) {
                return
            }
            if (!window.requestAnimationFrame) {
                clearTimeout(e._id)
            } else {
                window.cancelAnimationFrame(e._id)
            }
            e._id = null
        }, rafPolyfill: function () {
            var f = ["ms", "moz", "webkit", "o"], e = f.length;
            while (--e > -1 && !window.requestAnimationFrame) {
                window.requestAnimationFrame = window[f[e] + "RequestAnimationFrame"];
                window.cancelAnimationFrame = window[f[e] + "CancelAnimationFrame"] || window[f[e] + "CancelRequestAnimationFrame"]
            }
        }
    };
    d.rafPolyfill.call();
    c.support.touch = !!("ontouchstart" in window);
    c.support.pointer = window.navigator.pointerEnabled;
    c.support.msPointer = window.navigator.msPointerEnabled;
    var a = ("https:" == document.location.protocol) ? "https:" : "http:";
    c.event.special.mousewheel || document.write('<script src="' + a + '//music.caojiefeng.com/static/js/jquery.mousewheel.min.js"><\/script>');
    c.fn.mCustomScrollbar = function (e) {
        if (b[e]) {
            return b[e].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof e === "object" || !e) {
                return b.init.apply(this, arguments)
            } else {
                c.error("Method " + e + " does not exist")
            }
        }
    }
})(jQuery);
/*cookie plugin*/
jQuery.cookie = function (b, j, m) {
    if (typeof j != "undefined") {
        m = m || {};
        if (j === null) {
            j = "";
            m.expires = -1
        }
        var e = "";
        if (m.expires && (typeof m.expires == "number" || m.expires.toUTCString)) {
            var f;
            if (typeof m.expires == "number") {
                f = new Date();
                f.setTime(f.getTime() + (m.expires * 24 * 60 * 60 * 1000))
            } else {
                f = m.expires
            }
            e = "; expires=" + f.toUTCString()
        }
        var l = m.path ? "; path=" + (m.path) : "";
        var g = m.domain ? "; domain=" + (m.domain) : "";
        var a = m.secure ? "; secure" : "";
        document.cookie = [b, "=", encodeURIComponent(j), e, l, g, a].join("")
    } else {
        var d = null;
        if (document.cookie && document.cookie != "") {
            var k = document.cookie.split(";");
            for (var h = 0; h < k.length; h++) {
                var c = jQuery.trim(k[h]);
                if (c.substring(0, b.length + 1) == (b + "=")) {
                    d = decodeURIComponent(c.substring(b.length + 1));
                    break
                }
            }
        }
        return d
    }
};

//载入播放器，音乐地址等
var lzxPlayerInit = function () {
    //判断是否为移动客户端，影响歌词的展示
    var isPhone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|Nokia|Black Berry|MIDP|Phone)/i)) {
        isPhone = true
    }

    // Test环境
    //影响未知
    var isTest = typeof lzxPlayerTest !== "undefined" && lzxPlayerTest;
    var testKey = typeof lzxPlayerTestKey !== "undefined" ? lzxPlayerTestKey : null;
    var styleLoaded = typeof lzxPlayerStyleLoaded !== "undefined" && lzxPlayerStyleLoaded;

    if (!isTest) {
        // 判断是否已经加载
        var isLoad = localStorage.getItem("isLoad");
        var lastFeed = localStorage.getItem("lastFeed");
        isLoad = typeof isLoad === "undefined" ? false : isLoad === "true";
        isLoad = isLoad && typeof lastFeed !== "undefined" && new Date().getTime() - parseInt(lastFeed) < 2000;

        //禁止iframe嵌套 || 是否已加载
        if (top.location !== self.location || isLoad) {
            return
        }
        localStorage.setItem("isLoad", "true");
    }

    // 如果测试环境 && 未指定testKey
    if (isTest && testKey == null) {
        return;
    }

    //播放地址和播放key
    //webURL为域名
    var jsUrl = "https://music.caojiefeng.com/";
    var webURL = jsUrl.startsWith("http") ? jsUrl.substring(0, jsUrl.indexOf("/", 8)) : window.location.origin;
    var keyId = isTest ? testKey : "29ae13009b6142b489f48b38e6a26d33";

    //载入css
    if (!styleLoaded) {
        $("head").append('<link rel="stylesheet" type="text/css" href="' + webURL + '/player/css/player.css">');
        $("head").append('<link href="https://libs.baidu.com/fontawesome/4.2.0/css/font-awesome.css" rel="stylesheet" type="text/css">');
        lzxPlayerStyleLoaded = true;
    }

    //添加向html中添加播放器的标签
    $("body").append('' +
        '<div id="lzxPlayer">\n' +
        '    <div class="player">\n' +
        '        <canvas class="blur-img" width="365" height="155" id="canvas">您的浏览器不支持canvas，请更换高级版的浏览器！</canvas>\n' +
        '        <div class="blur-img">\n' +
        '            <img src="#" class="blur" style="top: 0; display: inline;"></div>\n' +
        '        <div class="infos">\n' +
        '            <div class="songstyle">\n' +
        '                <span>\n' +
        '                    <i class="fa fa-music"></i>\n' +
        '                    <span class="song"></span>\n' +
        '                </span>\n' +
        '                <span style="float: right;">\n' +
        '                    <i class="fa fa-clock-o"></i>\n' +
        '                    <span class="time">00:00 / 00:00</span></span>\n' +
        '            </div>\n' +
        '            <div class="artiststyle">\n' +
        '                <i class="fa fa-user"></i>\n' +
        '                <span class="artist"></span>\n' +
        '                <span class="moshi">\n' +
        '                    <i class="loop fa fa-random current"></i> 随机播放</span>\n' +
        '            </div>\n' +
        '            <div class="artiststyle">\n' +
        '                <i class="fa fa-folder"></i>\n' +
        '                <span class="artist1"></span>\n' +
        '                <span class="geci"></span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="control">\n' +
        '            <span style="float:left">\n' +
        '                <i class="loop fa fa-retweet" title="顺序播放"></i>\n' +
        '                <i class="prev fa fa-backward" title="上一首"></i>\n' +
        '            </span>\n' +
        '            <span style="float:right">\n' +
        '                <i class="next fa fa-forward" title="下一首"></i>\n' +
        '                <i class="random fa fa-random current" title="随机播放"></i>\n' +
        '            </span>\n' +
        '        </div>\n' +
        '        <div class="status">\n' +
        '            <b>\n' +
        '                <i class="play fa fa-play" title="播放"></i>\n' +
        '                <i class="pause fa fa-pause" title="暂停"></i>\n' +
        '            </b>\n' +
        '            <div id="div1" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '            <div id="div2" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '            <div id="div3" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="musicbottom">\n' +
        '            <div class="rate">\n' +
        '                <div class="progress">\n' +
        '                    <div class="rate-buffered"></div>' +
        '                    <div class="rate-on" style="width: 0;">\n' +
        '                        <div class="drag"></div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="icons">\n' +
        '                <div class="switch-playlist">\n' +
        '                    <i class="fa fa-bars" title="播放列表"></i>\n' +
        '                </div>\n' +
        '                <div class="switch-ksclrc">\n' +
        '                    <i class="fa fa-toggle-on" title="关闭歌词"></i>\n' +
        '                </div>\n' +
        '                <div class="switch-down">\n' +
        '                    <a class="down">\n' +
        '                        <i class="fa fa-cloud-download" title="歌曲下载"></i>\n' +
        '                    </a>\n' +
        '                </div>\n' +
        '                <div class="new-volume">\n' +
        '                    <i class="volumeup fa fa-volume-up" title="音量"></i>\n' +
        '                    <div class="volume-controls" style="">\n' +
        '                        <div class="slider" data-direction="vertical">\n' +
        '                            <div class="progress2" style="height: 66%;">\n' +
        '                                <div class="drag" id="volume-drag"></div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="cover"></div>\n' +
        '    </div>\n' +
        '    <div class="playlist">\n' +
        '        <div class="playlist-bd">\n' +
        '            <div class="album-list">\n' +
        '                <div class="musicheader"></div>\n' +
        '                <div class="list"></div>\n' +
        '            </div>\n' +
        '            <div class="song-list">\n' +
        '                <div class="musicheader">\n' +
        '                    <i class="fa fa-angle-right"></i>\n' +
        '                    <span></span>\n' +
        '                </div>\n' +
        '                <div class="list">\n' +
        '                    <ul></ul>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="switch-player">\n' +
        '        <i class="fa fa-angle-right" style="margin-top: 20px;"></i>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div id="lzxTips"></div>\n' +
        '<div id="lzxLrc"></div>');

    // 全局主色
    mainColor = '0,0,0';

    var audio = new Audio(),
        $player = $('#lzxPlayer'),
        $tips = $('#lzxTips'),
        $lk = $('#lzxKsc,#lzxLrc'),
        $switchPlayer = $('.switch-player', $player),
        $btns = $('.status', $player),
        $songName = $('.song', $player),
        $cover = $('.cover', $player),
        $songTime = $('.time', $player),
        $songList = $('.song-list .list', $player),
        $albumList = $('.album-list', $player),
        $player_infos_artist = $('.player .artist', $player),
        $player_infos_album = $('.player .artist1', $player),
        $player_infos_play_mode = $('.player .moshi', $player),
        $player_infos_lyric = $('.player .geci', $player),
        $player_controls_switch_of_lrc = $('.player .switch-ksclrc', $player),
        $volumeSlider = $('.volume-controls .slider', $player);
    $rateBuffered = $('.musicbottom .rate-buffered', $player);
    $rateSlider = $('.rate .progress', $player);
    songFrom33 = '开启',
        songFrom44 = '',
        songFrom55 = '',
        roundcolor = '#6c6971',
        lightcolor = '#81c300',
        cur = 'current',
        ycgeci = true,
        first = 1,
        volume = $.cookie('lzx_player_volume') ? $.cookie('lzx_player_volume') : '0.666',
        albumId = 0,
        songId = 0,
        songTotal = 0,
        random = true,
        rateIsDown = false,
        rateMouse = {},
        rateTouch = {},
        hasgeci = true,
        cicleTime = null,
        hasLrc = false,
        lrcTimeLine = [],
        lrcHeight = 40,
        lrcTime = null,
        lrcCont = '',
        dogInterval = null,
        songFroms = {
            "wy": "网易音乐",
            "kg": "酷狗音乐",
            "qq": "QQ音乐",
            "xm": "虾米音乐",
            "local": "本地音乐"
        };

    if (isPhone) {
        $('#lzxLrc').addClass('phone');
        $player.addClass('phone');
        $(".new-volume", $player).hide();
    }

    //将秒数转换为分钟:秒钟的形式 如 100 -》 01:40
    function formatSecond(t) {
        return ('00' + Math.floor(t / 60)).substr(-2) + ':' + ('00' + Math.floor(t % 60)).substr(-2)
    }

    $cover.html('<img src="" onerror="this.src=\'img/album_none.png\'">');
    $songName.html('<a style="color:#f00">等待播放</a>');
    $player_infos_artist.html('<a style="color:#f00">Jerry</a>');
    $player_infos_album.html('<a style="color:#f00">音乐播放器</a>');
    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词未载入');

    // 播放器重载前的清理
    window.lzxPlayerReload = function () {
        try {
            clearInterval(cicleTime);
        } catch (e) {
        }
        try {
            clearInterval(lrcTime);
        } catch (e) {
        }
        try {
            clearInterval(dogInterval);
        } catch (e) {
        }
        $("#lzxPlayer").remove();
        $("#lzxLrc").remove();
        $("#lzxTips").remove();
        audio.pause();
    };

    //音乐播放控制
    var lzxMedia = {
        play: function () {
            $cover.addClass('coverplay');
            $player.addClass('playing');
            $rateBuffered.width(0);
            // 播放进度更新秒表
            cicleTime = setInterval(function () {
                if (!rateMouse.isDown && !rateTouch.isTouchDown) {
                    $songTime.text(formatSecond(audio.currentTime) + ' / ' + formatSecond(audio.duration));
                    $(".rate-on", $rateSlider).width(audio.currentTime / audio.duration * 100 + "%");
                }

                if (audio.currentTime < audio.duration / 2) {
                    $btns.css('background-image', 'linear-gradient(90deg, ' + roundcolor
                        + ' 50%, transparent 50%, transparent), linear-gradient('
                        + (90 + (270 - 90) / (audio.duration / 2) * audio.currentTime) + 'deg, ' + lightcolor + ' 50%, '
                        + roundcolor + ' 50%, ' + roundcolor + ')')
                } else {
                    $btns.css('background-image', 'linear-gradient('
                        + (90 + (270 - 90) / (audio.duration / 2) * audio.currentTime) + 'deg, ' + lightcolor
                        + ' 50%, transparent 50%, transparent), linear-gradient(270deg, ' + lightcolor + ' 50%, '
                        + roundcolor + ' 50%, ' + roundcolor + ')')
                }

                var timeRanges = audio.buffered;
                // 获取已缓存的时间  timeRanges.end(timeRanges.length - 1)

                // 计算百分比 展示进度
                if (timeRanges.length !== 0) {
                    $rateBuffered.width(parseInt(timeRanges.end(timeRanges.length - 1) * 100 / audio.duration * 100) / 100 + '%')
                }
            }, 800);
            if (hasLrc) {
                lrcTime = setInterval(lzxLrc.lrc.play, 500);
                $('#lzxLrc').addClass('show');
                $('.switch-down').css('right', '65px');
                $('.switch-ksclrc').show()
            }
        },
        pause: function () {
            clearInterval(cicleTime);
            $player.removeClass('playing');
            $('.switch-ksclrc').hide();
            $('.switch-down').css('right', '35px');
            if (hasLrc) {
                lzxLrc.lrc.hide()
            }
        },
        error: function () {
            clearInterval(cicleTime);
            $player.removeClass('playing');
            lzxTips.show(songSheetList[albumId].songNames[songId] + ' - 资源获取失败！尝试获取下一首...');
            lzxMedia.next();
        },
        seeking: function () {
            lzxTips.show('加载中...')
        },
        volumechange: function () {
            var vol = window.parseInt(audio.volume * 100);
            $('.progress2', $volumeSlider).height(vol + '%');
            lzxTips.show('音量：' + vol + '%');
            $.cookie("lzx_player_volume", audio.volume);
        },
        getInfos: function (id) {
            $cover.removeClass('coverplay');
            songId = id;
            allmusic();
            songFrom55 = songFroms[songSheetList[albumId].songTypes[songId]];
            musictype = songSheetList[albumId].songTypes[songId];
            netmusic();
        },
        getSongId: function (n) {
            return n >= songTotal ? 0 : n < 0 ? songTotal - 1 : n
        },
        next: function () {
            clearInterval(cicleTime);
            random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                : lzxMedia.getInfos(lzxMedia.getSongId(songId + 1));
        },
        prev: function () {
            clearInterval(cicleTime);
            random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                : lzxMedia.getInfos(lzxMedia.getSongId(songId - 1));
        }
    };
    var lzxTipsTime = null;
    var lzxTips = {
        show: function (cont) {
            clearTimeout(lzxTipsTime);
            $('#lzxTips').text(cont).addClass('show');
            this.hide()
        },
        hide: function () {
            lzxTipsTime = setTimeout(function () {
                $('#lzxTips').removeClass('show');
            }, 3000)
        }
    };
    //给audio添加监听事件  执行相应的函数
    audio.addEventListener('play', lzxMedia.play, false);
    audio.addEventListener('pause', lzxMedia.pause, false);
    audio.addEventListener('ended', lzxMedia.next, false);
    audio.addEventListener('playing', lzxMedia.playing, false);
    audio.addEventListener('volumechange', lzxMedia.volumechange, false);
    audio.addEventListener('error', lzxMedia.error, false);
    audio.addEventListener('seeking', lzxMedia.seeking, false);

    //侧边按钮点击事件
    $switchPlayer.click(function () {
        $player.toggleClass('show')
    });
    //音乐暂停事件
    $('.pause', $player).click(function () {
        hasgeci = false;
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("暂停播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        lzxTips.show('暂停播放 - ' + songSheetList[albumId].songNames[songId]);
        $cover.removeClass('coverplay');
        audio.pause();
        setTimeout(function () {
            lzxTips.show("播放器下次访问将自动暂停");
        }, 4000);
        $.cookie("auto_playre", "no");
    });
    //音乐播放事件
    $('.play', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("当前播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        startPlay();
        setTimeout(function () {
            lzxTips.show("播放器下次访问将自动播放");
        }, 4000);
        $.cookie("auto_playre", "yes");
    });
    //上一首事件
    $('.prev', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        lzxMedia.prev();
        $.cookie("auto_playre", "yes");
    });
    //下一首事件
    $('.next', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        lzxMedia.next();
        $.cookie("auto_playre", "yes");
    });
    //随机播放按钮事件
    $('.random', $player).click(function () {
        $(this).addClass(cur);
        $('.loop', $player).removeClass(cur);
        random = true;
        lzxTips.show('随机播放');
        $player_infos_play_mode.html('<i class="random fa fa-random current"></i> 随机播放')
        $.cookie("random_play", true)
    });
    //顺序播放按钮事件
    $('.loop', $player).click(function () {
        $(this).addClass(cur);
        $('.random', $player).removeClass(cur);
        random = false;
        lzxTips.show('顺序播放');
        $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放')
        $.cookie("random_play", false)
    });
    //音量组件拖动事件
    $volumeSlider.click(function (e) {
        var documentTop = $(document).scrollTop();
        var progressHeight = $volumeSlider.height(),
            progressOffsetTop = $volumeSlider.offset().top - documentTop;
        var calcVolume = (1 - (e.clientY - progressOffsetTop) / progressHeight).toFixed(2);
        audio.volume = calcVolume > 1 ? 1 : calcVolume;
    });
    //播放进度条点击事件
    $rateSlider.click(function (e) {
        var progressWidth = $rateSlider.width(),
            progressOffsetLeft = $rateSlider.offset().left,
            eClientX = e.clientX;

        audio.currentTime = audio.duration * ((eClientX - progressOffsetLeft) / progressWidth)
    });
    //播放进度音量大小拖动圆点
    var isDown = false;
    $('.drag', $volumeSlider).mousedown(function () {
        isDown = true;
    });

    $('.drag', $rateSlider).on("touchstart", (function (e) {
        rateTouch.progressWidth = $rateSlider.width();
        rateTouch.isTouchDown = true;
        rateTouch.startX = e.originalEvent.touches[0].clientX;
        rateTouch.rateOnWidth = parseFloat(($(".rate-on", $rateSlider).width() / rateTouch.progressWidth).toFixed(2));
    }));

    $('.drag', $rateSlider).mousedown(function (e) {
        rateMouse.progressWidth = $rateSlider.width();
        rateMouse.isDown = true;
        rateMouse.startX = e.clientX;
        rateMouse.rateOnWidth = parseFloat(($(".rate-on", $rateSlider).width() / rateMouse.progressWidth).toFixed(2));
    });

    //touchmove 当手指在屏幕上滑动的时候连续地触发
    window.addEventListener("touchmove", function (e) {
        if (rateTouch.isTouchDown) {
            var rate = parseFloat(((e.touches[0].clientX - rateTouch.startX) / rateTouch.progressWidth)
                .toFixed(2)) + rateTouch.rateOnWidth;
            if (rate >= 0 && rate <= 1) {
                $(".rate-on", $rateSlider).width(rate * 100 + '%');
                rateTouch.currentTime = audio.duration * rate;
                $songTime.text(formatSecond(rateTouch.currentTime) + ' / ' + formatSecond(audio.duration));
            }
        }
        return false;
    }, {passive: false});
    //鼠标相关
    $(window).on({
        mousemove: function (e) {
            if (isDown) {
                var documentTop = $(document).scrollTop();
                var progressHeight = $volumeSlider.height(),
                    progressOffsetTop = $volumeSlider.offset().top - documentTop,
                    eClientY = e.clientY;
                if (eClientY >= progressOffsetTop && eClientY <= progressOffsetTop + progressHeight) {
                    audio.volume = (1 - (eClientY - progressOffsetTop) / progressHeight).toFixed(2);
                }
            } else if (rateMouse.isDown) {
                var rate = parseFloat(((e.clientX - rateMouse.startX) / rateMouse.progressWidth)
                    .toFixed(2)) + rateMouse.rateOnWidth;
                if (rate >= 0 && rate <= 1) {
                    $(".rate-on", $rateSlider).width(rate * 100 + '%');
                    rateMouse.currentTime = audio.duration * rate;
                    $songTime.text(formatSecond(rateMouse.currentTime) + ' / ' + formatSecond(audio.duration));
                }
            }
        },
        mouseup: function () {
            isDown = false;
            if (rateMouse.isDown) {
                audio.currentTime = rateMouse.currentTime;
                rateMouse.isDown = false;
            }
        },
        touchend: function (e) {
            if (rateTouch.isTouchDown) {
                audio.currentTime = rateTouch.currentTime;
                rateTouch.isTouchDown = false;
            }
        }
    });
    //播放列表按钮点击事件
    $('.switch-playlist').click(function () {
        $player.toggleClass('showAlbumList')
    });
    //返回专辑列表事件
    $songList.mCustomScrollbar();
    $('.song-list .musicheader,.song-list .fa-angle-right', $player).click(function () {
        $player.removeClass('showSongList')
    });
    //打开关闭歌词显示
    $('.switch-ksclrc').click(function () {
        $player.toggleClass('ksclrc');
        $('#lzxLrc').toggleClass('hide');
        $('#lzxKsc').toggleClass('hidePlayer');
        if (!$('#lzxLrc').hasClass('hide')) {
            ycgeci = true;
            if (hasLrc) {
                $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词开启')
            }
            lzxTips.show('开启歌词显示');
            songFrom33 = '开启';
            $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-on" title="关闭歌词"></i>');
        } else {
            ycgeci = false;
            if (hasLrc) {
                $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词关闭');
            }
            lzxTips.show('歌词显示已关闭');
            songFrom33 = '关闭';
            $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="打开歌词"></i>')
        }
        musicTooltip();
    });
    //播放列表设置
    lzxPlayer.playList = {
        creat: {
            album: function () {
                $('.musicheader', $albumList).html('播放列表');
                var albumTotal = songSheetList.length,
                    albumList = '';
                for (var c = 0; c < albumTotal; c++) {
                    albumList += '<li><i class="fa fa-angle-right"></i><span class="index">' + (c + 1)
                        + '</span><span class="artist"></span>《' + songSheetList[c].songSheetName + "》 - "
                        + songSheetList[c].author + "</li>";
                }
                $('.list', $albumList).html('<ul>' + albumList + '</ul>').mCustomScrollbar();

                $("li", $albumList).click(function () {
                    var a = $(this).index();
                    $(this).hasClass(cur) ? lzxPlayer.playList.creat.song(a, true)
                        : lzxPlayer.playList.creat.song(a, false);
                    $player.addClass("showSongList")
                });
                songTotal = songSheetList[albumId].songIds.length;

                random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                    : lzxMedia.getInfos(lzxMedia.getSongId(0));

            },
            song: function (id, isThisAlbum) {
                songTotal = songSheetList[id].songIds.length;
                $(".song-list .musicheader span", $player)
                    .text(songSheetList[id].songSheetName + "(" + songTotal + ")");
                var songList = '';

                for (var i = 0; i < songTotal; i++) {
                    songList += '<li><span class="index">' + (i + 1) + '</span><span class="artist"></span>'
                        + songSheetList[id].songNames[i] + '</li>'
                }
                $('ul', $songList).html(songList);
                $songList.mCustomScrollbar('update');
                if (isThisAlbum) {
                    $("li", $songList).eq(songId).addClass(cur).siblings().removeClass(cur);
                    $songList.mCustomScrollbar("scrollTo", $("li.current", $songList).position().top - 120);
                } else {
                    $songList.mCustomScrollbar("scrollTo", "top");
                }
                $('li', $songList).click(function () {
                    hasgeci = true;
                    $('#lzxLrc,#lzxKsc').show();
                    albumId = id;
                    if ($(this).hasClass(cur)) {
                        lzxTips.show('正在播放 - '
                            + songSheetList[albumId].songNames[songId].replace(songId + 1 + '#', ''))
                    } else {
                        $.cookie("auto_playre", "yes");
                        songId = $(this).index();
                        lzxMedia.getInfos(songId);
                    }
                })
            }
        }
    };
    var lzxLrc = {
        load: function () {
            lzxLrc.lrc.hide();
            hasLrc = false;
            $('#lzxLrc,#lzxKsc').html('');
            setTimeout(function () {
                if (hasgeci) {
                    $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词' + songFrom33)
                } else {
                    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词' + songFrom33)
                }
                $('.switch-down').css('right', '65px');
                $('.switch-ksclrc').show();
                $.ajax({
                    url: webURL + "/api/musicLyric?songId=" + songSheetList[albumId].songIds[songId] + "&type="
                        + songSheetList[albumId].songTypes[songId],
                    type: 'GET',
                    dataType: 'script',
                    success: function () {
                        if (lrcstr == '') {
                            songFrom44 = ' - 暂无歌词!';
                            $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                            $('.switch-ksclrc').hide();
                            $('.switch-down').css('right', '35px');
                        } else {
                            if (lrcstr.indexOf('[00') >= 0) {
                                setTimeout(function () {
                                        if (!$('#lzxLrc').hasClass('hide')) {
                                            songFrom44 = ' - 歌词获取成功!'
                                        } else {
                                            songFrom44 = ' - 歌词已关闭！'
                                        }
                                        lzxLrc.lrc.format(lrcstr)
                                    },
                                    500)
                            } else {
                                songFrom44 = ' - 暂无歌词!';
                                $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                                $('.switch-ksclrc').hide();
                                $('.switch-down').css('right', '35px');
                            }
                        }
                    },
                    error: function () {
                        songFrom44 = ' - 暂无歌词!';
                        $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                        $('.switch-ksclrc').hide();
                        $('.switch-down').css('right', '35px');
                    }
                })
            }, 50)
        },
        lrc: {
            format: function (cont) {
                hasLrc = true;

                function formatTime(t) {
                    var sp = t.split(':'),
                        min = +sp[0],
                        sec = +sp[1].split('.')[0],
                        ksec = +sp[1].split('.')[1];
                    return min * 60 + sec + Math.round(ksec / 1000)
                }

                var lrcCont = cont.replace(/\[[A-Za-z]+:(.*?)]/g, '').split(/[\]\[]/g),
                    lrcLine = '';
                lrcTimeLine = [];
                for (var i = 1; i < lrcCont.length; i += 2) {
                    var timer = formatTime(lrcCont[i]);
                    lrcTimeLine.push(timer);
                    if (i == 1) {
                        lrcLine += '<li class="lzxLrc' + timer + ' current" style="color:rgba(' + mainColor + ',1)">' + lrcCont[i + 1] + '</li>'
                    } else {
                        lrcLine += '<li class="lzxLrc' + timer + '">' + lrcCont[i + 1] + '</li>'
                    }
                }
                $('#lzxLrc').html('<ul>' + lrcLine + '</ul>');
                setTimeout(function () {
                        if (audio.paused) {
                            $('.switch-ksclrc').hide();
                            $('.switch-down').css('right', '35px');
                        } else {
                            $('#lzxLrc').addClass('show')
                        }
                    },
                    500);
                lrcTime = setInterval(lzxLrc.lrc.play, 500)
            },
            play: function () {
                var timeNow = Math.round(audio.currentTime);
                if ($.inArray(timeNow, lrcTimeLine) > 0) {
                    var $lineNow = $('.lzxLrc' + timeNow);
                    if (!$lineNow.hasClass(cur)) {
                        $lineNow.css('color', 'rgba(' + mainColor + ',1)');
                        $lineNow.addClass(cur).siblings().removeClass(cur).css('color', '');
                        $('#lzxLrc').animate({
                            scrollTop: lrcHeight * $lineNow.index()
                        });
                    }
                } else {
                    lrcCont = ''
                }
            },
            hide: function () {
                clearInterval(lrcTime);
                $('#lzxLrc').removeClass('show')
            }
        }
    };
    //设置默认音量
    audio.volume = volume;
    if (volume == 1) {
        $('.volume-on', $player).width('100%');
    }

    //获取歌单列表数据
    //自改测试
    var autoPlayer = 0, randomPlayer = 0, defaultVolume = 75, showLrc = 1, greeting = '来啦，老弟',
        showGreeting = 0, defaultAlbum = 1, siteName = 'Jerry', background = 1, playerWidth = -1, coverWidth = -1,
        showNotes = 1, autoPopupPlayer = -1;
    var songSheetList = []
    function startmusic(){
        //此处的push为设置用，实际使用时应当由参数传入
        songSheetList.push({
            "songSheetName": "test",
            "author": "test",
            "songIds": ['http://ws.stream.qqmusic.qq.com/C400004EzHKM2jXY9i.m4a?fromtag=0&guid=126548448&vkey=E376F4C8AB20BC8116C3FA51BA94150FBE0F794A1F0B59022254A59B2CA75472099C73477359D972B211D0116601C5869CC910132C564915'],
            "songNames": ['红玫瑰'],
            "songTypes": ['108242'],
            "albumNames": ['认了吧'],
            "artistNames": ['陈奕迅'],
            "albumCovers": ['http://imgcache.qq.com/music/photo/album_300/26/300_albumpic_31526_0.jpg'],
            "lrc": ['']
        })
        lzxPlayer.playList.creat.album()
    }
    startmusic();
    if (playerWidth !== -1) {
        document.body.style.setProperty('--player-width', playerWidth + 'px');
    }
    if (coverWidth !== -1) {
        document.body.style.setProperty('--cover-width', coverWidth + 'px');
    }
    if (showNotes !== 1) {
        $(".status .note", $player).hide()
    }
    if (autoPopupPlayer !== -1) {
        setTimeout(function () {
            $player.addClass('show')
        }, autoPopupPlayer * 1000)
    }
    if ($.cookie("random_play") != null) {
        if ($.cookie("random_play") == "true") {
            $('.loop', $player).removeClass(cur);
            $('.random', $player).addClass(cur);
            $player_infos_play_mode.html('<i class="random fa fa-random"></i> 随机播放');
            random = true;
        } else {
            $('.loop', $player).addClass(cur);
            $('.random', $player).removeClass(cur);
            $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放');
            random = false;
        }
    } else {
        if (randomPlayer != 1) {
            $('.loop', $player).addClass(cur);
            $('.random', $player).removeClass(cur);
            random = false;
            $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放');
        }
    }
    if ($.cookie("lzx_player_volume") == '0.666') {
        volume = (defaultVolume / 100);
        audio.volume = volume;
    }
    // 防止百分百音量无触发事件
    lzxMedia.volumechange();
    albumId = defaultAlbum - 1;
    if (showLrc == 0) {
        //隐藏歌词
        $('#lzxLrc').addClass('hide');
        ycgeci = false;
        if (hasLrc) {
            $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词关闭');
        }
        lzxTips.show('歌词显示已关闭');
        songFrom33 = '关闭';
        $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="打开歌词"></i>')
    }
    if (showGreeting == 1) {
        lzxTips.show(greeting);
    }

    // 喂狗
    dogInterval = setInterval(function () {
        if (!isTest) {
            localStorage.setItem("lastFeed", new Date().getTime().toString());
        }
        // 检查css变量
        var currPlayerWidth = document.body.style.getPropertyValue('--player-width');
        if (typeof playerWidth != "undefined" && playerWidth !== -1 && currPlayerWidth != (playerWidth + 'px')) {
            document.body.style.setProperty('--player-width', playerWidth + 'px');
        }
        var currCoverWidth = document.body.style.getPropertyValue('--cover-width');
        if (typeof coverWidth != "undefined" && coverWidth !== -1 && currCoverWidth != (coverWidth + 'px')) {
            document.body.style.setProperty('--cover-width', coverWidth + 'px');
        }
    }, 1000);

    // 浏览器关闭事件监听器
    window.addEventListener('beforeunload', function (event) {
        localStorage.setItem("isLoad", "false");
    }, true);

    //一脸懵逼，不知道啥意思，我猜是防止歌名等过长的
    function LimitStr(str, num, t) {
        num = num || 6;
        t = t || '...';
        var re = '';
        var leg = str.length;
        var h = 0;
        for (var i = 0; h < num * 2 && i < leg; i++) {
            h += str.charCodeAt(i) > 128 ? 2 : 1;
            re += str.charAt(i)
        }
        if (i < leg) re += t;
        return re
    }

    //通过网易云的api获取歌曲，我要修改的也是这部分
    function netmusic() {
        audio.src = songSheetList[albumId].songIds[songId];
        $('.switch-down').show();
        $('.switch-down').html('<a class="down"><i class="fa fa-cloud-download" title="从' + songFrom55 + '下载：'
            + songSheetList[albumId].songNames[songId] + ' - ' + songSheetList[albumId].artistNames[songId] + '"></i></a>');
        $('.down').click(function () {
            window.open(audio.src, 'newwindow')
        });
        //lrcurl = songSheetList[albumId].lyrics[songId];
        $songName.html('<span title="' + songSheetList[albumId].songNames[songId] + '">'
            + LimitStr(songSheetList[albumId].songNames[songId]) + '</span>');
        window.console.log(name + ' - 当前播放：' + songSheetList[albumId].songNames[songId] + ' - '
            + songSheetList[albumId].artistNames[songId]);
        $player_infos_artist.html('<span title="' + songSheetList[albumId].artistNames[songId] + '">'
            + LimitStr(songSheetList[albumId].artistNames[songId]) + '</span>');
        $player_infos_album.html('<span title="' + songSheetList[albumId].albumNames[songId] + '">'
            + LimitStr(songSheetList[albumId].albumNames[songId]) + '</span>');
        var coverImg = new Image();
        coverImg.src = songSheetList[albumId].albumCovers[songId];
        $cover.addClass('changing');
        coverImg.onload = function () {
            $cover.removeClass('changing');
            $.ajax({
                // 这个url存在的意义未知
                url: webURL + '/api/mainColor',
                type: 'GET',
                dataType: 'script',
                data: {
                    url: coverImg.src
                },
                success: function () {
                    playerColor()
                },
                error: function () {
                    playerColor()
                }
            })
        };
        coverImg.error = function () {
            coverImg.src = '../img/album_none.png';
            setTimeout(function () {
                    lzxTips.show(songSheetList[albumId].songNames[songId] + ' - 专辑图片获取失败！')
                },
                4000)
        };
        $cover.html(coverImg);
        if (background == 1) {
            $('.blur-img .blur', $player).attr("src", songSheetList[albumId].albumCovers[songId]); //虚化背景
        } else {
            if ($(".blur-img").length > 0) {
                $(".blur-img").remove();
            }
        }
        lzxLrc.load(); //加载歌词

        if (first == 1) {
            first = 2;
            if (autoPlayer == 1 && ($.cookie("auto_playre") == null || $.cookie("auto_playre") === "yes")) {
                startPlay()
            } else {
                lzxTips.show('播放器自动暂停');
                $cover.removeClass('coverplay');
                audio.pause();
            }
        } else {
            startPlay()
        }
        // 歌词自动隐藏
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(window.document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if (hasgeci && ycgeci) {
                    $player.addClass('ksclrc');
                    $('#lzxLrc').addClass('hide');
                    $('#lzxKsc').addClass('hidePlayer');
                    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词隐藏');
                    $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="歌词隐藏"></i>');
                    if (hasLrc) {
                        lzxTips.show('歌词自动隐藏')
                    }
                }
            } else {
                if (hasgeci && ycgeci) {
                    $player.removeClass('ksclrc');
                    $('#lzxLrc').removeClass('hide');
                    $('#lzxKsc').removeClass('hidePlayer');
                    if (hasLrc) {
                        $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词开启')
                    }
                    $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-on" title="关闭歌词"></i>')
                }
            }
        });
        musicTooltip();
    }

    function startPlay() {
        lzxTips.show('开始从' + songFrom55 + '播放 - ' + songSheetList[albumId].songNames[songId]);
        audio.play();
    }

    function allmusic() {
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("当前播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        $songList.find("li").eq(songId).addClass(cur).siblings().removeClass(cur);
        if ($('ul', $songList).html() != '') $songList.mCustomScrollbar("scrollTo", $("li.current", $songList)
            .position().top - 120);
    }

    function playerColor() {
        $player.css({
            background: 'rgba(' + mainColor + ',.8)'
        });
        $switchPlayer.css({
            background: 'rgba(' + mainColor + ',.3)'
        });
        $tips.css({
            background: 'rgba(' + mainColor + ',.6)'
        });
        $lk.css({
            background: 'rgba(' + mainColor + ',.3)'
        });
        $(".infos,.control,.status .note", $player).css({
            color: 'rgb(' + font_color + ')'
        });
    }

    function musicTooltip() {
        if (isPhone) {
            return;
        }
        $('#lzxPlayer span,#lzxPlayer i').each(function () {
            $('#tooltip').remove();
            if (this.title) {
                var a = this.title;
                $(this).unbind("mouseover mouseout");
                $(this).mouseover(function (b) {
                    this.title = '';
                    $('body').append('<div id="tooltip">' + a + '</div>');
                    $('#tooltip').css({
                        left: b.pageX - 15 + 'px',
                        top: b.pageY + 30 + 'px',
                        opacity: '0.8'
                    }).fadeIn(250)
                }).mouseout(function () {
                    this.title = a;
                    $('#tooltip').remove()
                }).mousemove(function (b) {
                    $('#tooltip').css({
                        left: b.pageX - 15 + 'px',
                        top: b.pageY + 30 + 'px'
                    });
                });
            }
        });
    }
};
lzxPlayerInit();