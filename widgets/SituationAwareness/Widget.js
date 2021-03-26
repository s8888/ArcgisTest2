﻿// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
    cache: {
        "jimu/dijit/Report": function() {
            define("dojo/_base/declare jimu/BaseWidget jimu/utils dojo/Evented ./PageUtils dojo/text!./templates/ReportTemplate.html dojo/_base/lang dojo/_base/array dojo/_base/window dojo/dom-construct dojo/dom-class dojo/dom-style dojo/dom dojo/string dojo/on esri/tasks/PrintParameters esri/tasks/PrintTemplate esri/tasks/PrintTask".split(" "), function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q) {
                return r([n, v], {
                    baseClass: "jimu-report",
                    _printService: null,
                    _printWindow: null,
                    _sizeInPixels: {},
                    _windowOpenedTimer: null,
                    _shownUnableToPrintMapMsg: !1,
                    printTaskUrl: null,
                    reportLogo: "",
                    reportLayout: {},
                    maxNoOfCols: 3,
                    styleSheets: [],
                    styleText: "",
                    constructor: function() {
                        this.inherited(arguments);
                        this._sizeInPixels = {};
                        this.printTaskUrl = null;
                        this.reportLayout = {};
                        this.styleSheets = []
                    },
                    postMixInProperties: function() {
                        this.nls = g.mixin(window.jimuNls.common, window.jimuNls.report)
                    },
                    postCreate: function() {
                        var a;
                        a = {
                            pageSize: m.PageSizes.A4,
                            orientation: m.Orientation.Portrait
                        };
                        this.inherited(arguments);
                        this.setReportLayout(this.reportLayout, a);
                        this.reportLayout.dpi = 96;
                        this.printTaskUrl && this._createPrintTask()
                    },
                    setReportLayout: function(a, d) {
                        d || (d = this.reportLayout);
                        this._validateParameters(a) ? this.reportLayout = g.mixin(d, a) : this.reportLayout = d
                    },
                    setMapLayout: function(a) {
                        var d;
                        d = this.reportLayout.pageSize.MapLayout ? this.reportLayout.pageSize.MapLayout : "MAP_ONLY";
                        if ("MAP_ONLY" === d) a.exportOptions = {
                                dpi: this.reportLayout.dpi
                            }, this.reportLayout.orientation.Type === m.Orientation.Landscape.Type && this.reportLayout.pageSize !==
                            m.PageSizes.Custom ? (a.exportOptions.width = this._sizeInPixels.Height, a.exportOptions.height = this._sizeInPixels.Width) : (a.exportOptions.width = this._sizeInPixels.Width, a.exportOptions.height = this._sizeInPixels.Height);
                        else if (d && m.PageSizes[d]) d += " " + this.reportLayout.orientation.Type;
                        else {
                            var b = [];
                            Object.keys(m.PageSizes).forEach(function(a) {
                                b.push(m.PageSizes[a].MapLayout)
                            }); - 1 < b.indexOf(d) && (d += " " + this.reportLayout.orientation.Type)
                        }
                        a.layout = d;
                        return a
                    },
                    _validateParameters: function() {
                        return this.reportLayout.pageSize !==
                            m.PageSizes.Custom || this.reportLayout.size ? !0 : !1
                    },
                    _createPrintTask: function() {
                        this._printService = new q(this.printTaskUrl, {
                            async: !1
                        })
                    },
                    _createPrintMapParameters: function(a) {
                        var b, c;
                        c = new d;
                        a.printTemplate ? (c = a.printTemplate, c.format ? (b = c.format.toLowerCase(), "png32" !== b && "png8" !== b && "jpg" !== b && "gif" !== b && (c.format = "jpg")) : c.format = "jpg") : (c = this.setMapLayout(c), c.layoutOptions = {
                            customTextElements: [{
                                Date: ""
                            }]
                        }, c.preserveScale = !1, c.showAttribution = !0, c.format = "jpg");
                        b = new h;
                        b.map = a.map;
                        b.template = c;
                        return b
                    },
                    print: function(d, b) {
                        var c, h;
                        this._printService ? (this._shownUnableToPrintMapMsg = !1, c = screen.width / 2, h = screen.height / 1.5, c = 11 === u.has("ie") ? "toolbar\x3dno, location\x3dno, directories\x3dno, status\x3dyes, menubar\x3dno,scrollbars\x3dyes, resizable\x3dyes, width\x3d" + c + ", height\x3d" + h + ", top\x3d" + (screen.height / 2 - h / 2) + ", left\x3d" + (screen.width / 2 - c / 2) : null, h = u.detectUserAgent(), (h.browser.hasOwnProperty("firefox") && h.browser.firefox || h.os.hasOwnProperty("ipad") && h.os.ipad || h.os.hasOwnProperty("iphone") &&
                            h.os.iphone) && this._printWindow && this._printWindow.close(), this._printWindow = window.open("", "report", c, !0), this._windowOpenedTimer && clearInterval(this._windowOpenedTimer), this._windowOpenedTimer = setInterval(g.hitch(this, function() {
                            this._printWindow.closed && (clearInterval(this._windowOpenedTimer), this.emit("report-window-closed"))
                        }), 500), this._printWindow.focus(), setTimeout(g.hitch(this, function() {
                            k.withDoc(this._printWindow.document, g.hitch(this, function() {
                                this._printWindow.document.open("text/html",
                                    "replace");
                                this._printWindow.document.write(l);
                                window.isRTL && x.add(a.byId("reportBody"), "jimu-rtl");
                                (this.styleSheets && 0 < this.styleSheets.length || this.styleText && "" !== this.styleText) && this._addExternalStyleSheets();
                                this._setPageSize();
                                this._setButtonLabels();
                                this._setReportSizeMessage();
                                this._setReportLogo();
                                this._setReportTitle(d);
                                this._setReportData(b);
                                this._setFootNotes();
                                this._printWindow.document.close()
                            }))
                        }), 500)) : this.emit("reportError")
                    },
                    _addExternalStyleSheets: function() {
                        var d = a.byId("reportHead");
                        d && (e.forEach(this.styleSheets, g.hitch(this, function(a) {
                            t.create("link", {
                                rel: "stylesheet",
                                type: "text/css",
                                href: a
                            }, d)
                        })), this.styleText && t.create("style", {
                            type: "text/css",
                            innerHTML: this.styleText
                        }, d))
                    },
                    _setPageSize: function() {
                        var d, b, h;
                        h = a.byId("reportMain");
                        this.reportLayout && (d = this.reportLayout.pageSize, this.reportLayout.pageSize === m.PageSizes.Custom && this.reportLayout.size && (d = this.reportLayout.size), d = m.getPageSizeInPixels(d, this.reportLayout.dpi));
                        b = this.reportLayout.orientation.Type === m.Orientation.Landscape.Type &&
                            this.reportLayout.pageSize !== m.PageSizes.Custom ? d.Height : d.Width;
                        this._sizeInPixels = d;
                        c.set(h, {
                            width: b + "px"
                        })
                    },
                    _setReportData: function(d) {
                        var b = a.byId("reportData"),
                            c = a.byId("showErrorButton");
                        c.innerHTML = this.nls.unableToPrintMapMsg;
                        b && e.forEach(d, g.hitch(this, function(a) {
                            var d = t.create("div", {}, b);
                            a.addPageBreak && x.add(d, "esriCTPageBreak");
                            "table" === a.type ? this._formatAndRenderTables(d, a) : "html" === a.type ? this._renderHTMLData(d, a) : "map" === a.type ? (a.title && this._addSectionTitle(a.title, d), x.add(d,
                                "esriCTReportMap esriCTReportMapWait"), a.extent && a.data.map.setExtent(a.extent), this._executePrintTask(a, d, c)) : "note" === a.type && this._createReportNote(d, a)
                        }))
                    },
                    _setFootNotes: function() {
                        var d, b;
                        (b = a.byId("footNotes")) && this.footNotes && (d = u.sanitizeHTML(this.footNotes ? this.footNotes : ""), b.innerHTML = u.fieldFormatter.getFormattedUrl(d))
                    },
                    _setReportLogo: function() {
                        var d, h, f, e;
                        (d = a.byId("reportLogo")) && this.reportLogo && (x.remove(d, "esriCTHidden"), d.src = this.reportLogo, e = a.byId("reportHeader"), h = a.byId("reportMain"),
                            f = a.byId("printTitleDiv"), window.isRTL && t.place(f, e, "first"), h && f && (d.complete && c.set(f, {
                                width: h.clientWidth - d.clientWidth - 51 + "px"
                            }), this.own(b(d, "load", g.hitch(this, function() {
                                setTimeout(g.hitch(this, function() {
                                    c.set(f, {
                                        width: h.clientWidth - d.clientWidth - 51 + "px"
                                    })
                                }), 300)
                            })))))
                    },
                    _setReportTitle: function(d) {
                        var b = a.byId("reportTitle");
                        b && d && (b.value = d)
                    },
                    _createReportNote: function(a, d) {
                        var c, h = "",
                            f;
                        d.title && (h = d.title);
                        h = this._addSectionTitle(h, a);
                        x.add(h, "esriCTNotesTitle");
                        c = t.create("textarea", {
                            "class": "esriCTReportNotes",
                            placeholder: this.nls.notesHint,
                            rows: 5
                        }, a);
                        f = t.create("p", {
                            "class": "esriCTReportNotesParagraph"
                        }, a);
                        x.add(a, "esriCTNotesContainer");
                        d.defaultText && (c.value = d.defaultText);
                        this.own(b(c, "keydown, change", function() {
                            c.style.height = "auto";
                            f.innerHTML = u.sanitizeHTML(c.value ? c.value : "");
                            c.style.height = c.scrollHeight + "px"
                        }))
                    },
                    _setReportSizeMessage: function() {
                        var d, b;
                        this.reportLayout.pageSize === m.PageSizes.Custom && this.reportLayout.size ? (d = this.reportLayout.size, b = this.reportLayout.pageSize) : (d = this.reportLayout.pageSize,
                            b = this.reportLayout.pageSize.SizeName ? this.reportLayout.pageSize.SizeName : this.reportLayout.SizeName);
                        d = this.reportLayout.orientation.Type === m.Orientation.Landscape.Type && this.reportLayout.pageSize !== m.PageSizes.Custom ? " (" + d.Height + "'' X " + d.Width + "'') " : " (" + d.Width + "'' X " + d.Height + "'') ";
                        a.byId("reportBarMsg").innerHTML = f.substitute(this.nls.reportDimensionsMsg, {
                            paperSize: b + d + this.reportLayout.orientation.Text
                        })
                    },
                    _setButtonLabels: function() {
                        var d = a.byId("printButton");
                        d.innerHTML = this.nls.printButtonLabel;
                        d.title = this.nls.printButtonLabel;
                        d = a.byId("closeButton");
                        d.innerHTML = this.nls.close;
                        d.title = this.nls.close
                    },
                    _executePrintTask: function(a, d, b) {
                        a = this._createPrintMapParameters(a);
                        this._printService.execute(a, g.hitch(this, function(a) {
                            d && (x.remove(d, "esriCTReportMapWait"), a = t.create("img", {
                                src: a.url,
                                "class": "esriCTReportMapImg"
                            }, d), this.reportLayout.orientation.Type === m.Orientation.Landscape.Type && x.add(a, "esriCTReportLandscapeMapImg"));
                            this.emit("report-export-task-completed")
                        }), g.hitch(this, function() {
                            x.replace(d,
                                "esriCTReportMapFail", "esriCTPageBreak esriCTReportMapWait");
                            this._shownUnableToPrintMapMsg || (this._shownUnableToPrintMapMsg = !0, b.click());
                            this.emit("report-export-task-failed")
                        }))
                    },
                    _renderHTMLData: function(a, d) {
                        a = t.create("div", {
                            "class": "esriCTHTMLData"
                        }, a);
                        d.title && this._addSectionTitle(d.title, a);
                        t.create("div", {
                            innerHTML: d.data
                        }, a)
                    },
                    _addSectionTitle: function(a, d) {
                        a = u.sanitizeHTML(a ? a : "");
                        return t.create("div", {
                            innerHTML: a,
                            "class": a ? "esriCTSectionTitle" : ""
                        }, d)
                    },
                    _formatAndRenderTables: function(a,
                        d) {
                        var b = d.data,
                            c, h, f, e, g = this.maxNoOfCols;
                        b.maxNoOfCols && (g = b.maxNoOfCols);
                        b.cols.length > g && 2 >= b.cols.length - g && (g = b.cols.length);
                        c = 0;
                        for (h = b.cols.length; c < h; c += g) {
                            var q = {
                                    cols: [],
                                    rows: []
                                },
                                K = c + g,
                                k = !1;
                            q.title = 0 === c ? d.title : "";
                            f = b.cols.length - K;
                            2 >= f && 0 < f && (K += f, k = !0);
                            f = b.cols.slice(c, K);
                            e = [];
                            for (var w = 0; w < b.rows.length; w++) e.push(b.rows[w].slice(c, K));
                            q.cols = f;
                            q.rows = e;
                            this._renderTable(t.create("div", {}, a), q, d.data.showRowIndex);
                            if (k) break
                        }
                    },
                    _renderTable: function(a, d, b) {
                        var c, h;
                        this._addSectionTitle(d.title,
                            a);
                        a = t.create("table", {
                            cellpadding: 5,
                            style: {
                                width: "100%"
                            },
                            "class": "esriCTTable"
                        }, a);
                        c = t.create("tbody", {}, a);
                        h = t.create("tr", {}, c);
                        b && t.create("th", {
                            innerHTML: "#",
                            style: {
                                width: "20px"
                            }
                        }, h);
                        e.forEach(d.cols, g.hitch(this, function(a) {
                            t.create("th", {
                                innerHTML: a
                            }, h)
                        }));
                        e.forEach(d.rows, g.hitch(this, function(a, d) {
                            var h;
                            h = t.create("tr", {}, c);
                            b && t.create("td", {
                                innerHTML: d + 1,
                                style: {
                                    "word-wrap": "normal"
                                }
                            }, h);
                            e.forEach(a, g.hitch(this, function(a) {
                                a = u.fieldFormatter.getFormattedUrl(a);
                                t.create("td", {
                                        innerHTML: a
                                    },
                                    h)
                            }))
                        }))
                    }
                })
            })
        },
        "jimu/dijit/PageUtils": function() {
            define([], function() {
                var r = {};
                r.Orientation = {
                    Landscape: {
                        Type: "Landscape",
                        Text: window.jimuNls.report.landscape
                    },
                    Portrait: {
                        Type: "Portrait",
                        Text: window.jimuNls.report.portrait
                    }
                };
                r.PageSizes = {
                    A0: {
                        Height: 46.8,
                        Width: 33.1,
                        SizeName: window.jimuNls.report.a0,
                        MapLayout: "MAP_ONLY"
                    },
                    A1: {
                        Height: 33.1,
                        Width: 23.4,
                        SizeName: window.jimuNls.report.a1,
                        MapLayout: "MAP_ONLY"
                    },
                    A2: {
                        Height: 23.4,
                        Width: 16.5,
                        SizeName: window.jimuNls.report.a2,
                        MapLayout: "MAP_ONLY"
                    },
                    A3: {
                        Height: 16.5,
                        Width: 11.7,
                        SizeName: window.jimuNls.report.a3,
                        MapLayout: "A3"
                    },
                    A4: {
                        Height: 11.7,
                        Width: 8.3,
                        SizeName: window.jimuNls.report.a4,
                        MapLayout: "A4"
                    },
                    A5: {
                        Height: 8.3,
                        Width: 5.8,
                        SizeName: window.jimuNls.report.a5,
                        MapLayout: "MAP_ONLY"
                    },
                    Letter_ANSI_A: {
                        Height: 11,
                        Width: 8.5,
                        SizeName: window.jimuNls.report.letter + " " + window.jimuNls.report.ansi_a,
                        MapLayout: "Letter ANSI A"
                    },
                    Tabloid_ANSI_B: {
                        Height: 17,
                        Width: 11,
                        SizeName: window.jimuNls.report.tabloid + " " + window.jimuNls.report.ansi_b,
                        MapLayout: "Tabloid ANSI B"
                    },
                    ANSI_C: {
                        Height: 22,
                        Width: 17,
                        SizeName: window.jimuNls.report.ansi_c,
                        MapLayout: "MAP_ONLY"
                    },
                    ANSI_D: {
                        Height: 34,
                        Width: 22,
                        SizeName: window.jimuNls.report.ansi_d,
                        MapLayout: "MAP_ONLY"
                    },
                    ANSI_E: {
                        Height: 44,
                        Width: 34,
                        SizeName: window.jimuNls.report.ansi_e,
                        MapLayout: "MAP_ONLY"
                    },
                    Legal: {
                        Height: 14,
                        Width: 8.5,
                        SizeName: window.jimuNls.report.legal,
                        MapLayout: "MAP_ONLY"
                    },
                    Custom: window.jimuNls.common.custom
                };
                r.getPageSizeInPixels = function(n, r) {
                    return {
                        Height: n.Height * r,
                        Width: n.Width * r
                    }
                };
                return r
            })
        },
        "esri/tasks/PrintParameters": function() {
            define(["dojo/_base/declare",
                "dojo/_base/lang", "dojo/has", "../kernel"
            ], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.PrintParameters",
                    map: null,
                    template: null,
                    outSpatialReference: null,
                    extraParameters: null
                });
                u("extend-esri") && n.setObject("tasks.PrintParameters", r, v);
                return r
            })
        },
        "esri/tasks/PrintTemplate": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.PrintTemplate",
                    label: null,
                    exportOptions: {
                        width: 800,
                        height: 1100,
                        dpi: 96
                    },
                    layoutOptions: null,
                    format: "PNG32",
                    layout: "MAP_ONLY",
                    outScale: 0,
                    preserveScale: !0,
                    forceFeatureAttributes: !1,
                    showAttribution: null,
                    showLabels: !0
                });
                u("extend-esri") && n.setObject("tasks.PrintTemplate", r, v);
                return r
            })
        },
        "esri/tasks/PrintTask": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../lang ../layerUtils ../deferredUtils ../Color ../request ../urlUtils ../geometry/Polygon ../renderers/SimpleRenderer ../symbols/FillSymbol ./Geoprocessor ./PrintTemplate ./Task dojo/dom-attr dojo/dom-construct dojox/gfx/_base dojox/gfx/canvas dojox/json/query dojo/has!extend-esri?./PrintParameters dojo/has!extend-esri?./LegendLayer".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C, z, I) {
                    r = r(w, {
                        declaredClass: "esri.tasks.PrintTask",
                        constructor: function(a, b) {
                            this.url = a;
                            this.printGp = new d(this.url);
                            this._handler = n.hitch(this, this._handler);
                            b && b.async && (this.async = !0);
                            this._colorEvaluator = I("$..color")
                        },
                        async: !1,
                        _vtlExtent: null,
                        _cimVersion: null,
                        _is11xService: !1,
                        _loadGpServerMetadata: !0,
                        execute: function(a, d, b) {
                            if (!this._loadGpServerMetadata) return this._execute(a, d, b);
                            var h = new m(t._dfdCanceller),
                                f = this._url.path,
                                g = f.lastIndexOf("/GPServer/");
                            0 < g && (f = f.slice(0, g + 9));
                            h._pendingDfd = c({
                                url: f,
                                callbackParamName: "callback",
                                content: n.mixin({}, this._url.query, {
                                    f: "json"
                                })
                            }).then(n.hitch(this, function(d) {
                                this._loadGpServerMetadata = !1;
                                this.async = "esriExecutionTypeAsynchronous" === d.executionType;
                                this._cimVersion = d.cimVersion;
                                this._is11xService = !!this._cimVersion;
                                h._pendingDfd = this._execute(a);
                                return h._pendingDfd
                            })).then(n.hitch(this, function(a) {
                                this._successHandler([a], null, d, h)
                            })).otherwise(n.hitch(this, function(a) {
                                this._errorHandler(a, b, h)
                            }));
                            return h
                        },
                        _handler: function(a, d, b, c, h) {
                            try {
                                var f;
                                this.async ? "esriJobSucceeded" === a.jobStatus && this.printGp.getResultData(a.jobId, "Output_File", n.hitch(this, function(a) {
                                    f = a.value;
                                    this._successHandler([f], "onComplete", b, h)
                                })) : (f = a[0].value, this._successHandler([f], "onComplete", b, h))
                            } catch (A) {
                                this._errorHandler(A, c, h)
                            }
                        },
                        _execute: function(a, d, b) {
                            var c = this._handler,
                                h = this._errorHandler,
                                f = a.template || new q;
                            f.hasOwnProperty("showLabels") || (f.showLabels = !0);
                            var A = f.exportOptions,
                                g;
                            A && (g = {
                                outputSize: [A.width,
                                    A.height
                                ],
                                dpi: A.dpi
                            });
                            var A = f.layoutOptions,
                                k, D = [];
                            if (A) {
                                this.legendAll = !1;
                                A.legendLayers ? u.forEach(A.legendLayers, function(a) {
                                    var d = {};
                                    d.id = a.layerId;
                                    a.subLayerIds && (d.subLayerIds = a.subLayerIds);
                                    D.push(d)
                                }) : this.legendAll = !0;
                                var y, Q;
                                if ("Miles" === A.scalebarUnit || "Kilometers" === A.scalebarUnit) y = "esriKilometers", Q = "esriMiles";
                                else if ("Meters" === A.scalebarUnit || "Feet" === A.scalebarUnit) y = "esriMeters", Q = "esriFeet";
                                k = {
                                    esriMiles: "mi",
                                    esriKilometers: "km",
                                    esriFeet: "ft",
                                    esriMeters: "m"
                                };
                                k = {
                                    titleText: A.titleText,
                                    authorText: A.authorText,
                                    copyrightText: A.copyrightText,
                                    customTextElements: A.customTextElements,
                                    scaleBarOptions: {
                                        metricUnit: y,
                                        metricLabel: k[y],
                                        nonMetricUnit: Q,
                                        nonMetricLabel: k[Q]
                                    },
                                    legendOptions: {
                                        operationalLayers: D
                                    }
                                }
                            }
                            y = this._getPrintDefinition(a.map, f);
                            a.outSpatialReference && (y.mapOptions.spatialReference = a.outSpatialReference.toJson());
                            a.template && e.isDefined(a.template.showAttribution) && (y.mapOptions.showAttribution = a.template.showAttribution);
                            n.mixin(y, {
                                exportOptions: g,
                                layoutOptions: k
                            });
                            this.allLayerslegend &&
                                n.mixin(y.layoutOptions, {
                                    legendOptions: {
                                        operationalLayers: this.allLayerslegend
                                    }
                                });
                            if (y.operationalLayers) {
                                g = y.operationalLayers;
                                var w, l = function(a) {
                                        return e.fixJson(n.mixin(a, {
                                            type: "esriSLS",
                                            cap: void 0,
                                            join: void 0,
                                            meterLimit: void 0
                                        }))
                                    },
                                    S = /[\u4E00-\u9FFF\u0E00-\u0E7F\u0900-\u097F\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/,
                                    B = /[\u0600-\u06FF]/,
                                    z = function(a) {
                                        var d = a.text,
                                            b = (a = a.font) && a.family && a.family.toLowerCase();
                                        d && a && ("arial" === b || "arial unicode ms" === b) && (a.family = S.test(d) ? "Arial Unicode MS" : "Arial",
                                            "normal" !== a.style && B.test(d) && (a.family = "Arial Unicode MS"))
                                    };
                                for (k = 0; k < g.length; k++)
                                    if (g[k].featureCollection && g[k].featureCollection.layers)
                                        for (Q = 0; Q < g[k].featureCollection.layers.length; Q++) {
                                            var x = g[k].featureCollection.layers[Q];
                                            x.layerDefinition && x.layerDefinition.drawingInfo && x.layerDefinition.drawingInfo.renderer && x.layerDefinition.drawingInfo.renderer.symbol && (w = x.layerDefinition.drawingInfo.renderer, "esriCLS" === w.symbol.type ? w.symbol = l(w.symbol) : "esriTS" === w.symbol.type ? z(w.symbol) : w.symbol.outline &&
                                                "esriCLS" === w.symbol.outline.type && (w.symbol.outline = l(w.symbol.outline)));
                                            if (x.featureSet && x.featureSet.features)
                                                for (A = 0; A < x.featureSet.features.length; A++) w = x.featureSet.features[A], w.symbol && ("esriCLS" === w.symbol.type ? w.symbol = l(w.symbol) : "esriTS" === w.symbol.type ? z(w.symbol) : w.symbol.outline && "esriCLS" === w.symbol.outline.type && (w.symbol.outline = l(w.symbol.outline)))
                                        }
                            }
                            f = {
                                Web_Map_as_JSON: v.toJson(e.fixJson(y)),
                                Format: f.format,
                                Layout_Template: f.layout
                            };
                            a.extraParameters && (f = n.mixin(f, a.extraParameters));
                            var I = new m(t._dfdCanceller);
                            a = function(a, h) {
                                c(a, h, d, b, I)
                            };
                            y = function(a) {
                                h(a, b, I)
                            };
                            I._pendingDfd = this.async ? this.printGp.submitJob(f, a, null, y) : this.printGp.execute(f, a, y);
                            return I
                        },
                        onComplete: function() {},
                        _createMultipointLayer: function() {
                            return {
                                layerDefinition: {
                                    name: "multipointLayer",
                                    geometryType: "esriGeometryMultipoint",
                                    drawingInfo: {
                                        renderer: null
                                    }
                                },
                                featureSet: {
                                    geometryType: "esriGeometryMultipoint",
                                    features: []
                                }
                            }
                        },
                        _createPolygonLayer: function() {
                            return {
                                layerDefinition: {
                                    name: "polygonLayer",
                                    geometryType: "esriGeometryPolygon",
                                    drawingInfo: {
                                        renderer: null
                                    }
                                },
                                featureSet: {
                                    geometryType: "esriGeometryPolygon",
                                    features: []
                                }
                            }
                        },
                        _createPointLayer: function() {
                            return {
                                layerDefinition: {
                                    name: "pointLayer",
                                    geometryType: "esriGeometryPoint",
                                    drawingInfo: {
                                        renderer: null
                                    }
                                },
                                featureSet: {
                                    geometryType: "esriGeometryPoint",
                                    features: []
                                }
                            }
                        },
                        _createPolylineLayer: function() {
                            return {
                                layerDefinition: {
                                    name: "polylineLayer",
                                    geometryType: "esriGeometryPolyline",
                                    drawingInfo: {
                                        renderer: null
                                    }
                                },
                                featureSet: {
                                    geometryType: "esriGeometryPolyline",
                                    features: []
                                }
                            }
                        },
                        _convertSvgSymbol: function(a) {
                            if (!(8 >=
                                    l("ie") || !a.path && "image/svg+xml" !== a.contentType)) {
                                var d, b = z.createSurface(M.create("div"), 1024, 1024);
                                d = "image/svg+xml" === a.contentType ? b.createObject(z.Image, {
                                    src: "data:image/svg+xml;base64," + a.imageData,
                                    width: C.pt2px(a.width),
                                    height: C.pt2px(a.height),
                                    x: 0,
                                    y: 0
                                }) : b.createObject(z.Path, a.path).setFill(a.color).setStroke(a.outline);
                                "pendingRender" in b && b._render(!0);
                                var c = b.rawNode.getContext("2d"),
                                    h = Math.ceil(d.getBoundingBox().width),
                                    f = Math.ceil(d.getBoundingBox().height);
                                d = c.getImageData(d.getBoundingBox().x,
                                    d.getBoundingBox().y, h, f);
                                c.canvas.width = h;
                                c.canvas.height = f;
                                c.putImageData(d, 0, 0);
                                c = c.canvas.toDataURL("image/png");
                                a = {
                                    type: "esriPMS",
                                    imageData: c.substr(22, c.length),
                                    angle: a.angle,
                                    contentType: "image/png",
                                    height: a.size ? a.size : C.px2pt(f),
                                    width: a.size ? h / f * a.size : C.px2pt(h),
                                    xoffset: a.xoffset,
                                    yoffset: a.yoffset
                                };
                                b.destroy();
                                return a
                            }
                        },
                        _convertSvgRenderer: function(a) {
                            "simple" === a.type && a.symbol && (a.symbol.path || "image/svg+xml" === a.symbol.contentType) ? a.symbol = this._convertSvgSymbol(a.symbol) : "uniqueValue" ===
                                a.type ? (a.defaultSymbol && (a.defaultSymbol.path || "image/svg+xml" === a.defaultSymbol.contentType) && (a.defaultSymbol = this._convertSvgSymbol(a.defaultSymbol)), a.uniqueValueInfos && u.forEach(a.uniqueValueInfos, function(a) {
                                    if (a.symbol.path || "image/svg+xml" === a.symbol.contentType) a.symbol = this._convertSvgSymbol(a.symbol)
                                }, this)) : "classBreaks" === a.type && (a.defaultSymbol && (a.defaultSymbol.path || "image/svg+xml" === a.defaultSymbol.contentType) && (a.defaultSymbol = this._convertSvgSymbol(a.defaultSymbol)), a.classBreakInfos &&
                                    u.forEach(a.classBreakInfos, function(a) {
                                        if (a.symbol.path || "image/svg+xml" === a.symbol.contentType) a.symbol = this._convertSvgSymbol(a.symbol)
                                    }, this))
                        },
                        _createFeatureCollection: function(a, d, b, c) {
                            var h = this._createPolygonLayer(),
                                g = this._createPolylineLayer(),
                                A = this._createPointLayer(),
                                K = this._createMultipointLayer(),
                                e = this._createPointLayer();
                            e.layerDefinition.name = "textLayer";
                            delete e.layerDefinition.drawingInfo;
                            if ("esri.layers.FeatureLayer" === a.declaredClass || "esri.layers.StreamLayer" === a.declaredClass) h.layerDefinition.name =
                                g.layerDefinition.name = A.layerDefinition.name = K.layerDefinition.name = n.getObject("arcgisProps.title", !1, a) || a.name || a.id;
                            var D = a.renderer && "esri.renderer.SimpleRenderer" === a.renderer.declaredClass;
                            if (!a.renderer || a.renderer.valueExpression || n.isFunction(a.renderer.attributeField)) delete h.layerDefinition.drawingInfo, delete g.layerDefinition.drawingInfo, delete A.layerDefinition.drawingInfo, delete K.layerDefinition.drawingInfo;
                            else {
                                var y = a.renderer.toJson({
                                    useLegacyRotationProperties: !0
                                });
                                if ("temporal" ===
                                    y.type) {
                                    var y = {
                                            latestObservationRenderer: y.latestObservationRenderer,
                                            trackLinesRenderer: y.trackRenderer,
                                            observationAger: y.observationAger,
                                            renderer: y.observationRenderer
                                        },
                                        q = {};
                                    a._trackIdField && (q.trackIdField = a._trackIdField);
                                    a._startTimeField && (q.startTimeField = a._startTimeField);
                                    a._endTimeField && (q.endTimeField = a._endTimeField);
                                    h.layerDefinition.drawingInfo = y;
                                    h.layerDefinition.timeInfo = q;
                                    g.layerDefinition.drawingInfo = y;
                                    g.layerDefinition.timeInfo = q;
                                    A.layerDefinition.drawingInfo = y;
                                    A.layerDefinition.timeInfo =
                                        q;
                                    K.layerDefinition.drawingInfo = y;
                                    K.layerDefinition.timeInfo = q
                                } else h.layerDefinition.drawingInfo.renderer = y, g.layerDefinition.drawingInfo.renderer = y, A.layerDefinition.drawingInfo.renderer = y, K.layerDefinition.drawingInfo.renderer = y
                            }
                            y = a.fields;
                            y || !a.renderer || a.renderer.valueExpression || n.isFunction(a.renderer.attributeField) || ("esri.renderer.ClassBreaksRenderer" === a.renderer.declaredClass ? (y = [{
                                name: a.renderer.attributeField,
                                type: "esriFieldTypeDouble"
                            }], a.renderer.normalizationField && y.push({
                                name: a.renderer.normalizationField,
                                type: "esriFieldTypeDouble"
                            })) : "esri.renderer.UniqueValueRenderer" === a.renderer.declaredClass && (y = [{
                                name: a.renderer.attributeField,
                                type: "esriFieldTypeString"
                            }], a.renderer.attributeField2 && y.push({
                                name: a.renderer.attributeField2,
                                type: "esriFieldTypeString"
                            }), a.renderer.attributeField3 && y.push({
                                name: a.renderer.attributeField3,
                                type: "esriFieldTypeString"
                            })));
                            y && (h.layerDefinition.fields = y, g.layerDefinition.fields = y, A.layerDefinition.fields = y, K.layerDefinition.fields = y);
                            y = a.graphics;
                            a.isFeatureReductionActive &&
                                a.isFeatureReductionActive() && (y = a.getSingleGraphics());
                            var q = y.length,
                                k, w;
                            for (w = 0; w < q; w++) {
                                var t = y[w];
                                if (!1 !== t.visible && t.geometry) {
                                    k = t.toJson();
                                    k.symbol && k.symbol.outline && k.symbol.outline.color && k.symbol.outline.color[3] && !this._is11xService && (k.symbol.outline.color[3] = 255);
                                    if (a.renderer && !k.symbol && (n.isFunction(a.renderer.attributeField) || a.renderer.valueExpression || this._isFeatureCollectionRequired(a.renderer, a) || "esri.renderer.DotDensityRenderer" === a.renderer.declaredClass || b)) {
                                        b = b || a.renderer;
                                        var l = null;
                                        try {
                                            l = b.getSymbol(t)
                                        } catch (U) {}
                                        if (!l) continue;
                                        k.symbol = l.toJson();
                                        this._isFeatureCollectionRequired(b, a) && this._applyVisualVariables(k.symbol, {
                                            renderer: b,
                                            graphic: t,
                                            symbol: l,
                                            mapResolution: d && d.getResolutionInMeters(),
                                            mapScale: d && d.getScale()
                                        })
                                    }
                                    k.symbol && (k.symbol.path || "image/svg+xml" === k.symbol.contentType ? k.symbol = this._convertSvgSymbol(k.symbol) : k.symbol.text && delete k.attributes);
                                    switch (t.geometry.type) {
                                        case "polygon":
                                            h.featureSet.features.push(k);
                                            break;
                                        case "polyline":
                                            g.featureSet.features.push(k);
                                            break;
                                        case "point":
                                            k.symbol && k.symbol.text ? e.featureSet.features.push(k) : A.featureSet.features.push(k);
                                            break;
                                        case "multipoint":
                                            K.featureSet.features.push(k);
                                            break;
                                        case "extent":
                                            k.geometry = f.fromExtent(t.geometry).toJson(), h.featureSet.features.push(k)
                                    }
                                }
                            }
                            d = [];
                            0 < h.featureSet.features.length && d.push(h);
                            0 < g.featureSet.features.length && d.push(g);
                            0 < K.featureSet.features.length && d.push(K);
                            0 < A.featureSet.features.length && d.push(A);
                            0 < e.featureSet.features.length && d.push(e);
                            if (!d.length) return null;
                            u.forEach(d,
                                function(a) {
                                    var d = u.every(a.featureSet.features, function(a) {
                                        return a.symbol
                                    });
                                    if (D || d) c && c.forceFeatureAttributes || u.forEach(a.featureSet.features, function(a) {
                                        delete a.attributes
                                    }), c.forceFeatureAttributes || delete a.layerDefinition.fields;
                                    d && delete a.layerDefinition.drawingInfo
                                });
                            u.forEach(d, function(a) {
                                a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && this._convertSvgRenderer(a.layerDefinition.drawingInfo.renderer)
                            }, this);
                            return {
                                id: a.id,
                                opacity: a.opacity,
                                minScale: a.minScale ||
                                    0,
                                maxScale: a.maxScale || 0,
                                featureCollection: {
                                    layers: d
                                }
                            }
                        },
                        _getPrintDefinition: function(a, d) {
                            var b = {
                                    operationalLayers: this._createOperationalLayers(a, d)
                                },
                                c = this._vtlExtent || a.extent,
                                h = a.spatialReference;
                            this._vtlExtent = null;
                            a.spatialReference._isWrappable() && (c = c._normalize(!0), h = c.spatialReference);
                            c = {
                                mapOptions: {
                                    showAttribution: a.showAttribution,
                                    extent: c.toJson(),
                                    spatialReference: h.toJson()
                                }
                            };
                            d.preserveScale && n.mixin(c.mapOptions, {
                                scale: d.outScale || a.getScale()
                            });
                            a.timeExtent && n.mixin(c.mapOptions, {
                                time: [a.timeExtent.startTime.getTime(), a.timeExtent.endTime.getTime()]
                            });
                            a = {};
                            n.mixin(a, c, b);
                            return a
                        },
                        _createOperationalLayers: function(d, c) {
                            var h, f, e, q, A = [],
                                w = 0;
                            c.preserveScale && (w = c.outScale || d.getScale());
                            this.allLayerslegend = this.legendAll ? [] : null;
                            this._vtlExtent = null;
                            var t = u.map(d.layerIds, d.getLayer, d);
                            d._mapImageLyr && t.push(d._mapImageLyr);
                            for (h = 0; h < t.length; h++)
                                if (f = t[h], f.loaded && f.visible && (!w || f.isVisibleAtScale(w))) switch (e = f.declaredClass, q = {
                                        id: f.id,
                                        title: n.getObject("arcgisProps.title",
                                            !1, f) || f.id,
                                        opacity: f.opacity,
                                        minScale: f.minScale || 0,
                                        maxScale: f.maxScale || 0
                                    }, q = n.mixin(q, this._getUrlAndToken(f)), f.getNode() && B.get(f.getNode(), "data-reference") && (q._isRefLayer = !0), e) {
                                    case "esri.layers.ArcGISDynamicMapServiceLayer":
                                        var D = [];
                                        e = !!f._params.layers;
                                        if (f._params.dynamicLayers) e = c.outScale ? f._getDynLayerObjs(c.outScale) : v.fromJson(f._params.dynamicLayers), u.forEach(e, function(a) {
                                                D.push({
                                                    id: a.id,
                                                    name: a.name,
                                                    layerDefinition: a
                                                });
                                                delete a.id;
                                                delete a.name;
                                                delete a.maxScale;
                                                delete a.minScale
                                            }),
                                            0 === D.length && (q.visibleLayers = [-1]);
                                        else if (f.supportsDynamicLayers) {
                                            if (e || f.layerDefinitions || f.layerTimeOptions) {
                                                var y = f.createDynamicLayerInfosFromLayerInfos(),
                                                    Q = null;
                                                e && (Q = f.visibleLayers);
                                                var Q = k._getVisibleLayers(y, Q),
                                                    l = k._getLayersForScale(c.outScale || d.getScale(), y);
                                                u.forEach(y, function(a) {
                                                    if (!a.subLayerIds) {
                                                        var d = a.id; - 1 < u.indexOf(Q, d) && -1 < u.indexOf(l, d) && (a = {
                                                                source: a.source.toJson()
                                                            }, f.layerDefinitions && f.layerDefinitions[d] && (a.definitionExpression = f.layerDefinitions[d]), f.layerTimeOptions &&
                                                            f.layerTimeOptions[d] && (a.layerTimeOptions = f.layerTimeOptions[d].toJson()), D.push({
                                                                id: d,
                                                                layerDefinition: a
                                                            }))
                                                    }
                                                });
                                                0 === D.length && (q.visibleLayers = [-1])
                                            }
                                        } else u.forEach(f.layerInfos, function(a) {
                                            var d = {
                                                id: a.id,
                                                layerDefinition: {}
                                            };
                                            f.layerDefinitions && f.layerDefinitions[a.id] && (d.layerDefinition.definitionExpression = f.layerDefinitions[a.id]);
                                            f.layerTimeOptions && f.layerTimeOptions[a.id] && (d.layerDefinition.layerTimeOptions = f.layerTimeOptions[a.id].toJson());
                                            (d.layerDefinition.definitionExpression || d.layerDefinition.layerTimeOptions) &&
                                            D.push(d)
                                        }), e && (q.visibleLayers = f.visibleLayers.length ? f.visibleLayers : [-1]);
                                        D.length && (q.layers = D);
                                        A.push(q);
                                        this.allLayerslegend && this.allLayerslegend.push({
                                            id: f.id,
                                            subLayerIds: f.visibleLayers
                                        });
                                        break;
                                    case "esri.layers.ArcGISImageServiceLayer":
                                        q = n.mixin(q, {
                                            url: f.url,
                                            bandIds: f.bandIds,
                                            compressionQuality: f.compressionQuality,
                                            format: f.format,
                                            interpolation: f.interpolation
                                        });
                                        f.mosaicRule && n.mixin(q, {
                                            mosaicRule: f.mosaicRule.toJson()
                                        });
                                        if (f.renderingRule || f.renderer) this._is11xService ? (f.renderingRule &&
                                            (q.renderingRule = f.renderingRule.toJson()), f.renderer && (q.layerDefinition = q.layerDefinition || {}, q.layerDefinition.drawingInfo = q.layerDefinition.drawingInfo || {}, q.layerDefinition.drawingInfo.renderer = f.renderer.toJson())) : (e = f.getExportImageRenderingRule()) && n.mixin(q, {
                                            renderingRule: e.toJson()
                                        });
                                        A.push(q);
                                        this.allLayerslegend && this.allLayerslegend.push({
                                            id: f.id
                                        });
                                        break;
                                    case "esri.layers.WMSLayer":
                                        q = n.mixin(q, {
                                            url: f.url,
                                            title: f.title,
                                            type: "wms",
                                            version: f.version,
                                            transparentBackground: f.imageTransparency,
                                            visibleLayers: f.visibleLayers
                                        });
                                        A.push(q);
                                        this.allLayerslegend && this.allLayerslegend.push({
                                            id: f.id,
                                            subLayerIds: f.visibleLayers
                                        });
                                        break;
                                    case "esri.virtualearth.VETiledLayer":
                                        e = f.mapStyle;
                                        "roadOnDemand" === e ? e = "Road" : "aerialWithLabelsOnDemand" === e && (e = "Hybrid");
                                        q = n.mixin(q, {
                                            visibility: f.visible,
                                            type: "BingMaps" + e,
                                            culture: f.culture,
                                            key: f.bingMapsKey
                                        });
                                        A.push(q);
                                        break;
                                    case "esri.layers.OpenStreetMapLayer":
                                        q = n.mixin(q, {
                                            credits: f.copyright,
                                            type: "OpenStreetMap",
                                            url: a.getAbsoluteUrl(f.tileServers[0])
                                        });
                                        A.push(q);
                                        break;
                                    case "esri.layers.WMTSLayer":
                                        q = n.mixin(q, {
                                            url: f.url,
                                            type: "wmts",
                                            layer: f._identifier,
                                            style: f._style,
                                            format: f.format,
                                            tileMatrixSet: f._tileMatrixSetId
                                        });
                                        A.push(q);
                                        break;
                                    case "esri.layers.MapImageLayer":
                                        e = f.getImages();
                                        u.forEach(e, function(a, d) {
                                            a.visible && a.href && (q = {
                                                    id: f.id + "_image" + d,
                                                    type: "image",
                                                    title: f.id,
                                                    minScale: f.minScale || 0,
                                                    maxScale: f.maxScale || 0,
                                                    opacity: f.opacity * a.opacity,
                                                    extent: a.extent.toJson()
                                                }, "data:image/png;base64," === a.href.substr(0, 22) ? q.imageData = a.href.substr(22) : q.url = a.href,
                                                A.push(q))
                                        });
                                        break;
                                    case "esri.layers.VectorTileLayer":
                                        delete q.url;
                                        delete q.token;
                                        if (this._is11xService && f.currentStyleInfo.serviceUrl && f.currentStyleInfo.styleUrl && (e = g.id && g.id.findCredential(f.currentStyleInfo.styleUrl), y = g.id && g.id.findCredential(f.currentStyleInfo.serviceUrl), !e && !y || "2.1.0" !== this._cimVersion)) {
                                            q.type = "VectorTileLayer";
                                            q.styleUrl = f.currentStyleInfo.styleUrl;
                                            e && (q.token = e.token);
                                            y && y.token !== q.token && (q.additionalTokens = [{
                                                url: f.currentStyleInfo.serviceUrl,
                                                token: y.token
                                            }]);
                                            A.push(q);
                                            break
                                        }
                                        q.type = "image";
                                        e = this._vtlExtent || d.extent.offset(0, 0);
                                        var z = c.exportOptions && c.exportOptions.dpi || 96,
                                            y = {
                                                format: "png",
                                                pixelRatio: z / 96
                                            };
                                        "MAP_ONLY" !== c.layout || !c.preserveScale || c.outScale && c.outScale !== d.getScale() || 96 !== z || !c.exportOptions || c.exportOptions.width % 2 === d.width % 2 && c.exportOptions.height % 2 === d.height % 2 || (y.area = {
                                            x: 0,
                                            y: 0,
                                            width: d.width,
                                            height: d.height
                                        }, c.exportOptions.width % 2 !== d.width % 2 && --y.area.width, c.exportOptions.height % 2 !== d.height % 2 && --y.area.height, this._vtlExtent || (z = d.toMap({
                                            x: y.area.width,
                                            y: y.area.height
                                        }), e.update(e.xmin, z.y, z.x, e.ymax, e.spatialReference), this._vtlExtent = e));
                                        q.extent = e._normalize(!0).toJson();
                                        e = f.takeScreenshot(y);
                                        e.isResolved() ? e.then(function(a) {
                                            "data:image/png;base64," === a.dataURL.substr(0, 22) && (q.imageData = a.dataURL.substr(22))
                                        }) : console.error("PrintTask: VectorTileLayer.takeScreenshot() returned an unresolved Promise");
                                        q.imageData && A.push(q);
                                        break;
                                    case "esri.layers.WebTiledLayer":
                                        e = f.url.replace(/\$\{/g, "{");
                                        q = n.mixin(q, {
                                            type: "WebTiledLayer",
                                            urlTemplate: e,
                                            credits: f.copyright
                                        });
                                        f.subDomains && 0 < f.subDomains.length && (q.subDomains = f.subDomains);
                                        f._wmtsInfo && (q.wmtsInfo = f._wmtsInfo);
                                        delete q.url;
                                        A.push(q);
                                        break;
                                    default:
                                        if (f.getTileUrl || f.getImageUrl) q = n.mixin(q, {
                                            url: f.url
                                        }), A.push(q)
                                }
                            t = u.map(d.graphicsLayerIds, d.getLayer, d);
                            for (h = 0; h < t.length; h++) f = t[h], f.isFeatureReductionActive && f.isFeatureReductionActive() && (f.getSingleGraphics().length ? t.splice(++h, 0, f.getFeatureReductionLayer()) : t[h] = f.getFeatureReductionLayer());
                            for (h = 0; h < t.length; h++)
                                if (f = t[h], f.loaded && f.visible && (!w ||
                                        f.isVisibleAtScale(w))) switch (e = f.declaredClass, e) {
                                    case "esri.layers.CSVLayer":
                                        if (this._is11xService) {
                                            q = {
                                                id: f.id,
                                                url: f.url,
                                                title: f.title,
                                                opacity: f.opacity,
                                                minScale: f.minScale || 0,
                                                maxScale: f.maxScale || 0,
                                                type: "CSV",
                                                locationInfo: {
                                                    latitudeFieldName: f.latitudeFieldName,
                                                    longitudeFieldName: f.longitudeFieldName
                                                },
                                                layerDefinition: {
                                                    drawingInfo: {
                                                        renderer: f.renderer && f.renderer.toJson({
                                                            useLegacyRotationProperties: !0
                                                        })
                                                    }
                                                }
                                            };
                                            A.push(q);
                                            break
                                        }
                                        case "esri.layers.FeatureLayer":
                                        case "esri.layers.LabelLayer":
                                        case "esri.layers.StreamLayer":
                                            if ("esri.layers.LabelLayer" ===
                                                e && !c.showLabels || f.renderer && "esri.renderer.HeatmapRenderer" === f.renderer.declaredClass) continue;
                                            e = null;
                                            f.url && f.renderer && ("esri.renderer.ScaleDependentRenderer" === f.renderer.declaredClass ? "scale" === f.renderer.rangeType ? e = f.renderer.getRendererInfoByScale(d.getScale()) && f.renderer.getRendererInfoByScale(d.getScale()).renderer : "zoom" === f.renderer.rangeType && (e = f.renderer.getRendererInfoByZoom(d.getZoom()) && f.renderer.getRendererInfoByZoom(d.getZoom()).renderer) : e = f.renderer);
                                            y = e && "esri.layers.CSVLayer" !==
                                                f.declaredClass && !this._isFeatureCollectionRequired(e, f) && !e.valueExpression;
                                            z = f.isFeatureReductionActive && f.isFeatureReductionActive();
                                            if (e && !z && "esri.renderer.DotDensityRenderer" !== e.declaredClass && "esri.layers.StreamLayer" !== f.declaredClass && (this._is11xService || y) && ("esri.renderer.SimpleRenderer" === e.declaredClass || "esri.renderer.TemporalRenderer" === e.declaredClass || null == e.attributeField || n.isString(e.attributeField) && f._getField(e.attributeField, !0)))
                                                if (q = {
                                                        id: f.id,
                                                        title: n.getObject("arcgisProps.title",
                                                            !1, f) || f.id,
                                                        opacity: f.opacity,
                                                        minScale: f.minScale || 0,
                                                        maxScale: f.maxScale || 0,
                                                        layerDefinition: {
                                                            drawingInfo: {
                                                                renderer: e.toJson({
                                                                    useLegacyRotationProperties: !0
                                                                })
                                                            }
                                                        }
                                                    }, q = n.mixin(q, this._getUrlAndToken(f)), "esri.renderer.TemporalRenderer" === e.declaredClass && (y = q.layerDefinition.drawingInfo, y.latestObservationRenderer = y.renderer.latestObservationRenderer, y.trackLinesRenderer = y.renderer.trackRenderer, y.observationAger = y.renderer.observationAger, y.renderer = y.renderer.observationRenderer, f._trackIdField && (q.layerDefinition.timeInfo = {
                                                        trackIdField: f._trackIdField
                                                    })), this._convertSvgRenderer(q.layerDefinition.drawingInfo.renderer), this._is11xService || 1 > f.opacity || "esri.renderer.TemporalRenderer" === e.declaredClass || this._updateLayerOpacity(q))
                                                    if (f._params.source && (e = f._params.source.toJson(), n.mixin(q.layerDefinition, {
                                                            source: e
                                                        })), f.getDefinitionExpression() && n.mixin(q.layerDefinition, {
                                                            definitionExpression: f.getDefinitionExpression()
                                                        }), 2 !== f.mode) 0 < f.getSelectedFeatures().length && (e = u.map(f.getSelectedFeatures(), function(a) {
                                                            return a.attributes[f.objectIdField]
                                                        }),
                                                        0 < e.length && f.getSelectionSymbol() && n.mixin(q, {
                                                            selectionObjectIds: e,
                                                            selectionSymbol: f.getSelectionSymbol().toJson()
                                                        }));
                                                    else {
                                                        e = u.map(f.getSelectedFeatures(), function(a) {
                                                            return a.attributes[f.objectIdField]
                                                        });
                                                        if (0 === e.length || !f._params.drawMode) break;
                                                        n.mixin(q.layerDefinition, {
                                                            objectIds: e
                                                        });
                                                        e = null;
                                                        f.getSelectionSymbol() && (e = new b(f.getSelectionSymbol()));
                                                        n.mixin(q.layerDefinition.drawingInfo, {
                                                            renderer: e && e.toJson()
                                                        })
                                                    }
                                            else q = this._createFeatureCollection(f, d, null, c);
                                            else q = e && (e.valueExpression || this._isFeatureCollectionRequired(e,
                                                f) || "esri.renderer.DotDensityRenderer" === e.declaredClass) ? this._createFeatureCollection(f, d, e, c) : this._createFeatureCollection(f, d, null, c);
                                            if (!q) continue;
                                            A.push(q);
                                            this.allLayerslegend && this.allLayerslegend.push({
                                                id: f.id
                                            });
                                            break;
                                        case "esri.layers._GraphicsLayer":
                                        case "esri.layers.GraphicsLayer":
                                        case "esri.layers.WFSLayer":
                                            q = this._createFeatureCollection(f, d, null, c);
                                            if (!q) continue;
                                            A.push(q);
                                            this.allLayerslegend && this.allLayerslegend.push({
                                                id: f.id
                                            });
                                            break;
                                        case "esri.layers.ArcGISImageServiceVectorLayer":
                                            q = {
                                                id: f.id,
                                                title: n.getObject("arcgisProps.title", !1, f) || f.id,
                                                opacity: f.opacity,
                                                minScale: f.minScale || 0,
                                                maxScale: f.maxScale || 0,
                                                visibility: f.visible,
                                                symbolTileSize: f.symbolTileSize,
                                                layerDefinition: {
                                                    drawingInfo: {
                                                        renderer: f.renderer.toJson({
                                                            useLegacyRotationProperties: !0
                                                        })
                                                    }
                                                }
                                            }, q = n.mixin(q, this._getUrlAndToken(f)), f.mosaicRule && n.mixin(q, {
                                                mosaicRule: f.mosaicRule.toJson()
                                            }), A.push(q), this.allLayerslegend && this.allLayerslegend.push({
                                                id: f.id
                                            })
                                }
                            w && u.forEach(A, function(a) {
                                a.minScale = 0;
                                a.maxScale = 0
                            });
                            d.graphics &&
                                0 < d.graphics.graphics.length && (q = this._createFeatureCollection(d.graphics, d, null, c)) && A.push(q);
                            d._labels && c.showLabels && (q = this._createFeatureCollection(d._labels, d, null, c)) && A.push(q);
                            u.forEach(A, function(a, d, b) {
                                a._isRefLayer && (delete a._isRefLayer, b.splice(d, 1), b.push(a))
                            });
                            return A
                        },
                        _getUrlAndToken: function(a) {
                            return {
                                token: a._getToken(),
                                url: a._url ? a._url.path : null
                            }
                        },
                        _updateLayerOpacity: function(a) {
                            var d = this._colorEvaluator(a),
                                d = u.filter(d, function(a) {
                                    return n.isArray(a) && 4 === a.length
                                }),
                                b = !0;
                            if (d.length) {
                                var f = d[0][3],
                                    c;
                                for (c = 1; c < d.length; c++)
                                    if (f !== d[c][3]) {
                                        b = !1;
                                        break
                                    } if (b)
                                    for (a.opacity = f / 255, c = 0; c < d.length; c++) d[c][3] = 255
                            }
                            return b
                        },
                        _isFeatureCollectionRequired: function(a, d) {
                            if (d && d.isFeatureReductionActive && d.isFeatureReductionActive()) return !0;
                            var b = !1;
                            if (d = this._getVariable(a, "rotationInfo", !1)) b = (b = d.field) && n.isFunction(b) || d.valueExpression;
                            return a.hasVisualVariables("sizeInfo") || a.hasVisualVariables("colorInfo") || a.hasVisualVariables("opacityInfo") || b
                        },
                        _getVariable: function(a,
                            d, b) {
                            var f;
                            a && (f = (a = a.getVisualVariablesForType(d, b)) && a[0]);
                            return f
                        },
                        _applyVisualVariables: function(a, d) {
                            var b = d.renderer,
                                f = d.graphic,
                                c = d.symbol,
                                e = d.mapResolution,
                                q = d.mapScale,
                                g = c.type;
                            if ("textsymbol" !== g && "shieldlabelsymbol" !== g) {
                                var k = this._getVariable(b, "sizeInfo", !1),
                                    D = this._getVariable(b, "colorInfo", !1),
                                    y = this._getVariable(b, "opacityInfo", !1);
                                d = this._getVariable(b, "rotationInfo", !1);
                                c instanceof h && (k = this._getVariable(b, "sizeInfo", "outline") || k);
                                e = k ? b.getSize(f, {
                                    sizeInfo: k,
                                    shape: "simplemarkersymbol" ===
                                        g ? c.style : null,
                                    resolution: e,
                                    scale: q
                                }) : f.size;
                                null != e && ("simplemarkersymbol" === g ? a.size = C.px2pt(e) : "picturemarkersymbol" === g ? (q = c.width / c.height * e, a.width = C.px2pt(q), a.height = C.px2pt(e), 0 !== c.xoffset && (a.xoffset = C.px2pt(c.xoffset / c.width * q)), 0 !== c.yoffset && (a.yoffset = C.px2pt(c.yoffset / c.height * e))) : "simplelinesymbol" === g ? a.width = C.px2pt(e) : a.outline && (a.outline.width = C.px2pt(e)));
                                D && (!(c = b.getColor(f, {
                                    colorInfo: D
                                })) || "simplemarkersymbol" !== g && "simplelinesymbol" !== g && "simplefillsymbol" !== g || (a.color =
                                    x.toJsonColor(c)));
                                y && (c = b.getOpacity(f, {
                                    opacityInfo: y
                                }), null != c && a.color && (a.color[3] = Math.round(255 * c)));
                                d && (b = b.getRotationAngle(f, {
                                    rotationInfo: d
                                })) && (a.angle = -b)
                            }
                        }
                    });
                    l("extend-esri") && n.setObject("tasks.PrintTask", r, g);
                    return r
                })
        },
        "esri/tasks/Geoprocessor": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has dojo/io-query ../kernel ../request ../deferredUtils ../geometry/normalizeUtils ./Task ./FeatureSet ./JobInfo ./GPMessage ./LinearUnit ./DataFile ./RasterData ./Date ./ParameterValue ./GPResultImageLayer ../layers/ArcGISDynamicMapServiceLayer ../layers/MapImage".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C, z) {
                    r = r(c, {
                        declaredClass: "esri.tasks.Geoprocessor",
                        _eventMap: {
                            "execute-complete": ["results", "messages"],
                            "get-result-data-complete": ["result"],
                            "get-result-image-complete": ["mapImage"],
                            "get-result-image-layer-complete": ["layer"],
                            "job-cancel": ["jobInfo"],
                            "job-complete": ["jobInfo"],
                            "status-update": ["jobInfo"]
                        },
                        constructor: function(a) {
                            this._jobUpdateHandler = n.hitch(this, this._jobUpdateHandler);
                            this._getJobStatus = n.hitch(this, this._getJobStatus);
                            this._getResultDataHandler =
                                n.hitch(this, this._getResultDataHandler);
                            this._getResultImageHandler = n.hitch(this, this._getResultImageHandler);
                            this._executeHandler = n.hitch(this, this._executeHandler);
                            this._updateTimers = [];
                            this.registerConnectEvents()
                        },
                        updateDelay: 1E3,
                        processSpatialReference: null,
                        outputSpatialReference: null,
                        outSpatialReference: null,
                        setUpdateDelay: function(a) {
                            this.updateDelay = a
                        },
                        setProcessSpatialReference: function(a) {
                            this.processSpatialReference = a
                        },
                        setOutputSpatialReference: function(a) {
                            this._setOutSR(a)
                        },
                        setOutSpatialReference: function(a) {
                            this._setOutSR(a)
                        },
                        __msigns: [{
                            n: "execute",
                            c: 3,
                            a: [{
                                i: 0,
                                p: ["*"]
                            }],
                            e: 2,
                            f: 1
                        }, {
                            n: "submitJob",
                            c: 4,
                            a: [{
                                i: 0,
                                p: ["*"]
                            }],
                            e: 3
                        }],
                        _setOutSR: function(a) {
                            this.outSpatialReference = this.outputSpatialReference = a
                        },
                        _getOutSR: function() {
                            return this.outSpatialReference || this.outputSpatialReference
                        },
                        _gpEncode: function(a, d, b) {
                            for (var c in a) {
                                var f = a[c];
                                n.isArray(f) ? a[c] = m.toJson(u.map(f, function(a) {
                                    return this._gpEncode({
                                        item: a
                                    }, !0).item
                                }, this)) : f instanceof Date && (a[c] = f.getTime())
                            }
                            return this._encode(a, d, b)
                        },
                        _decode: function(b) {
                            var c = b.dataType,
                                f = new B(b);
                            if (-1 !== u.indexOf(["GPBoolean", "GPDouble", "GPLong", "GPString"], c)) return f;
                            if ("GPLinearUnit" === c) f.value = new h(f.value);
                            else if ("GPFeatureRecordSetLayer" === c || "GPRecordSet" === c) f.value = new a(f.value);
                            else if ("GPDataFile" === c) f.value = new d(f.value);
                            else if ("GPDate" === c) b = f.value, n.isString(b) ? f.value = new w({
                                date: b
                            }) : f.value = new Date(b);
                            else if ("GPRasterData" === c || "GPRasterDataLayer" === c) b = b.value.mapImage, f.value = b ? new z(b) : new q(f.value);
                            else if (-1 !== c.indexOf("GPMultiValue:")) {
                                var e = c.split(":")[1];
                                b = f.value;
                                f.value = u.map(b, function(a) {
                                    return this._decode({
                                        paramName: "_name",
                                        dataType: e,
                                        value: a
                                    }).value
                                }, this)
                            } else console.log(this.declaredClass + " : GP Data type not handled. : " + f.dataType), f = null;
                            return f
                        },
                        submitJob: function(a, d, b, f, c) {
                            var h = this._getOutSR(),
                                e = c.assembly;
                            a = this._gpEncode(n.mixin({}, this._url.query, {
                                f: "json",
                                "env:outSR": h ? h.wkid || m.toJson(h.toJson()) : null,
                                "env:processSR": this.processSpatialReference ? this.processSpatialReference.wkid || m.toJson(this.processSpatialReference.toJson()) : null
                            }, a), null, e && e[0]);
                            var q = this._jobUpdateHandler,
                                g = this._errorHandler;
                            return k({
                                url: this._url.path + "/submitJob",
                                content: a,
                                callbackParamName: "callback",
                                load: function(a, f) {
                                    q(a, f, !1, d, b, c.dfd)
                                },
                                error: function(a) {
                                    g(a, f, c.dfd)
                                }
                            })
                        },
                        _jobUpdateHandler: function(a, d, b, c, h, e) {
                            var q = a.jobId;
                            d = new f(a);
                            this._successHandler([d], "onStatusUpdate", h, b && e);
                            if (!b) switch (clearTimeout(this._updateTimers[q]), this._updateTimers[q] = null, e && e.progress(d), a.jobStatus) {
                                case f.STATUS_SUBMITTED:
                                case f.STATUS_EXECUTING:
                                case f.STATUS_WAITING:
                                case f.STATUS_NEW:
                                    var A =
                                        this._getJobStatus;
                                    this._updateTimers[q] = setTimeout(function() {
                                        A(q, b, c, h, e)
                                    }, this.updateDelay);
                                    break;
                                default:
                                    this._successHandler([d], "onJobComplete", c, e)
                            }
                        },
                        _getJobStatus: function(a, d, b, f, c) {
                            var h = this._jobUpdateHandler;
                            k({
                                url: this._url.path + "/jobs/" + a,
                                content: n.mixin({}, this._url.query, {
                                    f: "json"
                                }),
                                callbackParamName: "callback",
                                load: function(a, e) {
                                    h(a, e, d, b, f, c)
                                },
                                error: this._errorHandler
                            })
                        },
                        _getResultDataHandler: function(a, d, b, f, c) {
                            try {
                                var h = this._decode(a);
                                this._successHandler([h], "onGetResultDataComplete",
                                    b, c)
                            } catch (G) {
                                this._errorHandler(G, f, c)
                            }
                        },
                        getResultData: function(a, d, b, f) {
                            var c = this._getResultDataHandler,
                                h = this._errorHandler,
                                e = new v(t._dfdCanceller);
                            e._pendingDfd = k({
                                url: this._url.path + "/jobs/" + a + "/results/" + d,
                                content: n.mixin({}, this._url.query, {
                                    f: "json",
                                    returnType: "data"
                                }),
                                callbackParamName: "callback",
                                load: function(a, d) {
                                    c(a, d, b, f, e)
                                },
                                error: function(a) {
                                    h(a, f, e)
                                }
                            });
                            return e
                        },
                        checkJobStatus: function(a, d, b) {
                            var f = this._jobUpdateHandler,
                                c = this._errorHandler,
                                h = new v(t._dfdCanceller);
                            h._pendingDfd =
                                k({
                                    url: this._url.path + "/jobs/" + a,
                                    content: n.mixin({}, this._url.query, {
                                        f: "json"
                                    }),
                                    callbackParamName: "callback",
                                    load: function(a, b) {
                                        f(a, b, !0, null, d, h)
                                    },
                                    error: function(a) {
                                        c(a, b, h)
                                    }
                                });
                            return h
                        },
                        cancelJob: function(a, d, b) {
                            var f = this._errorHandler,
                                c = new v(t._dfdCanceller);
                            c._pendingDfd = k({
                                url: this._url.path + "/jobs/" + a + "/cancel",
                                content: n.mixin({}, this._url.query, {
                                    f: "json"
                                }),
                                callbackParamName: "callback",
                                load: n.hitch(this, function(a, b) {
                                    this._successHandler([a], "onJobCancel", d, c)
                                }),
                                error: function(a) {
                                    f(a, b, c)
                                }
                            });
                            return c
                        },
                        execute: function(a, d, b, c) {
                            var f = this._getOutSR(),
                                h = c.assembly;
                            a = this._gpEncode(n.mixin({}, this._url.query, {
                                f: "json",
                                "env:outSR": f ? f.wkid || m.toJson(f.toJson()) : null,
                                "env:processSR": this.processSpatialReference ? this.processSpatialReference.wkid || m.toJson(this.processSpatialReference.toJson()) : null
                            }, a), null, h && h[0]);
                            var e = this._executeHandler,
                                q = this._errorHandler;
                            return k({
                                url: this._url.path + "/execute",
                                content: a,
                                callbackParamName: "callback",
                                load: function(a, f) {
                                    e(a, f, d, b, c.dfd)
                                },
                                error: function(a) {
                                    q(a,
                                        b, c.dfd)
                                }
                            })
                        },
                        _executeHandler: function(a, d, f, c, h) {
                            try {
                                var e = a.results,
                                    q, g, k = a.messages;
                                q = 0;
                                for (g = e.length; q < g; q++) e[q] = this._decode(e[q]);
                                q = 0;
                                for (g = k.length; q < g; q++) k[q] = new b(k[q]);
                                this._successHandler([e, k], "onExecuteComplete", f, h)
                            } catch (H) {
                                this._errorHandler(H, c, h)
                            }
                        },
                        _getResultImageHandler: function(a, d, b, f, c) {
                            try {
                                var h = this._decode(a);
                                this._successHandler([h], "onGetResultImageComplete", b, c)
                            } catch (G) {
                                this._errorHandler(G, f, c)
                            }
                        },
                        getResultImage: function(a, d, b, f, c) {
                            var h = this._getResultImageHandler,
                                e = this._errorHandler;
                            b = this._gpEncode(n.mixin({}, this._url.query, {
                                f: "json"
                            }, b.toJson()));
                            var q = new v(t._dfdCanceller);
                            q._pendingDfd = k({
                                url: this._url.path + "/jobs/" + a + "/results/" + d,
                                content: b,
                                callbackParamName: "callback",
                                load: function(a, d) {
                                    h(a, d, f, c, q)
                                },
                                error: function(a) {
                                    e(a, c, q)
                                }
                            });
                            return q
                        },
                        cancelJobStatusUpdates: function(a) {
                            clearTimeout(this._updateTimers[a]);
                            this._updateTimers[a] = null
                        },
                        getResultImageLayer: function(a, d, b, c) {
                            if (null == d) {
                                var f = this._url.path.indexOf("/GPServer/");
                                a = this._url.path.substring(0,
                                    f) + "/MapServer/jobs/" + a
                            } else a = this._url.path + "/jobs/" + a + "/results/" + d;
                            this._url.query && (a += "?" + g.objectToQuery(this._url.query));
                            d = null == d ? new C(a, {
                                imageParameters: b
                            }) : new M(a, {
                                imageParameters: b
                            }, !0);
                            this.onGetResultImageLayerComplete(d);
                            c && c(d);
                            return d
                        },
                        onStatusUpdate: function() {},
                        onJobComplete: function() {},
                        onExecuteComplete: function() {},
                        onGetResultDataComplete: function() {},
                        onGetResultImageComplete: function() {},
                        onGetResultImageLayerComplete: function() {},
                        onJobCancel: function() {}
                    });
                    x._createWrappers(r);
                    l("extend-esri") && n.setObject("tasks.Geoprocessor", r, e);
                    return r
                })
        },
        "esri/tasks/JobInfo": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "./GPMessage"], function(r, n, u, v, m) {
                r = r(null, {
                    declaredClass: "esri.tasks.JobInfo",
                    constructor: function(l) {
                        this.messages = [];
                        n.mixin(this, l);
                        l = this.messages;
                        var g, e = l.length;
                        for (g = 0; g < e; g++) l[g] = new m(l[g])
                    },
                    jobId: "",
                    jobStatus: ""
                });
                n.mixin(r, {
                    STATUS_CANCELLED: "esriJobCancelled",
                    STATUS_CANCELLING: "esriJobCancelling",
                    STATUS_DELETED: "esriJobDeleted",
                    STATUS_DELETING: "esriJobDeleting",
                    STATUS_EXECUTING: "esriJobExecuting",
                    STATUS_FAILED: "esriJobFailed",
                    STATUS_NEW: "esriJobNew",
                    STATUS_SUBMITTED: "esriJobSubmitted",
                    STATUS_SUCCEEDED: "esriJobSucceeded",
                    STATUS_TIMED_OUT: "esriJobTimedOut",
                    STATUS_WAITING: "esriJobWaiting"
                });
                u("extend-esri") && n.setObject("tasks.JobInfo", r, v);
                return r
            })
        },
        "esri/tasks/GPMessage": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.GPMessage",
                    constructor: function(m) {
                        n.mixin(this,
                            m)
                    }
                });
                n.mixin(r, {
                    TYPE_INFORMATIVE: "esriJobMessageTypeInformative",
                    TYPE_PROCESS_DEFINITION: "esriJobMessageTypeProcessDefinition",
                    TYPE_PROCESS_START: "esriJobMessageTypeProcessStart",
                    TYPE_PROCESS_STOP: "esriJobMessageTypeProcessStop",
                    TYPE_WARNING: "esriJobMessageTypeWarning",
                    TYPE_ERROR: "esriJobMessageTypeError",
                    TYPE_EMPTY: "esriJobMessageTypeEmpty",
                    TYPE_ABORT: "esriJobMessageTypeAbort"
                });
                u("extend-esri") && n.setObject("tasks.GPMessage", r, v);
                return r
            })
        },
        "esri/tasks/LinearUnit": function() {
            define(["dojo/_base/declare",
                "dojo/_base/lang", "dojo/has", "../kernel"
            ], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.LinearUnit",
                    constructor: function(m) {
                        m && n.mixin(this, m)
                    },
                    distance: 0,
                    units: null,
                    toJson: function() {
                        var m = {};
                        this.distance && (m.distance = this.distance);
                        this.units && (m.units = this.units);
                        return m
                    }
                });
                u("extend-esri") && n.setObject("tasks.LinearUnit", r, v);
                return r
            })
        },
        "esri/tasks/DataFile": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.DataFile",
                    constructor: function(m) {
                        m && n.mixin(this, m)
                    },
                    url: null,
                    itemID: null,
                    toJson: function() {
                        var m = {};
                        this.url && (m.url = this.url);
                        this.itemID && (m.itemID = this.itemID);
                        return m
                    }
                });
                u("extend-esri") && n.setObject("tasks.DataFile", r, v);
                return r
            })
        },
        "esri/tasks/RasterData": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.RasterData",
                    constructor: function(m) {
                        m && n.mixin(this, m)
                    },
                    url: null,
                    format: null,
                    itemID: null,
                    toJson: function() {
                        var m = {};
                        this.url && (m.url = this.url);
                        this.format && (m.format = this.format);
                        this.itemID && (m.itemID = this.itemID);
                        return m
                    }
                });
                u("extend-esri") && n.setObject("tasks.RasterData", r, v);
                return r
            })
        },
        "esri/tasks/Date": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/date/locale", "dojo/has", "../kernel"], function(r, n, u, v, m) {
                r = r(null, {
                    declaredClass: "esri.tasks.Date",
                    constructor: function(l) {
                        l && (l.format && (this.format = l.format), this.date = u.parse(l.date, {
                            selector: "date",
                            datePattern: this.format
                        }))
                    },
                    date: new Date,
                    format: "EEE MMM dd HH:mm:ss zzz yyyy",
                    toJson: function() {
                        return {
                            date: u.format(this.date, {
                                selector: "date",
                                datePattern: this.format
                            }),
                            format: this.format
                        }
                    }
                });
                v("extend-esri") && n.setObject("tasks.Date", r, m);
                return r
            })
        },
        "esri/tasks/ParameterValue": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.ParameterValue",
                    constructor: function(m) {
                        n.mixin(this, m)
                    }
                });
                u("extend-esri") && n.setObject("tasks.ParameterValue", r, v);
                return r
            })
        },
        "esri/tasks/GPResultImageLayer": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/json dojo/has dojo/io-query ../kernel ../layers/ArcGISDynamicMapServiceLayer".split(" "), function(r, n, u, v, m, l, g) {
                r = r(g, {
                    declaredClass: "esri.tasks._GPResultImageLayer",
                    constructor: function(e, g) {
                        g && g.imageParameters && g.imageParameters.extent && (this.initialExtent = this.fullExtent = g.imageParameters.extent, this.spatialReference = this.initialExtent.spatialReference);
                        this.getImageUrl = n.hitch(this, this.getImageUrl);
                        this.loaded = !0;
                        this.onLoad(this)
                    },
                    getImageUrl: function(e, g, t, l) {
                        var c = e.spatialReference.wkid;
                        l(this._url.path + "?" + m.objectToQuery(n.mixin(this._params, {
                            f: "image",
                            bbox: u.toJson(e.toJson()),
                            bboxSR: c,
                            imageSR: c,
                            size: g + "," + t
                        })))
                    }
                });
                v("extend-esri") && n.setObject("tasks._GPResultImageLayer", r, l);
                return r
            })
        },
        "dojox/gfx/canvas": function() {
            define("./_base dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/_base/window dojo/dom-geometry dojo/dom ./shape ./path ./arc ./matrix ./decompose ./bezierutils".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a) {
                    function f(a, d, b, c, f, h, e, q, g, A) {
                        var y, k, D = d.length,
                            w = 0;
                        A ? (k = A.l / f, w = A.i) : k = d[0] / f;
                        for (; h < e;) h + k > e && (y = {
                            l: (h + k - e) * f,
                            i: w
                        }, k = e - h), w % 2 || (a.beginPath(), a.arc(b, c, f, h, h + k, q), g && a.stroke()), h += k, ++w, k = d[w % D] / f;
                        return y
                    }

                    function b(d, b, f, c) {
                        var h = 0,
                            e = 0,
                            q, y = 0;
                        c ? (q = c.l, y = c.i) : q = b[0];
                        for (; 1 > e;) e = a.tAtLength(d, q), 1 == e && (h = a.computeLength(d), h = {
                            l: q - h,
                            i: y
                        }), d = a.splitBezierAtT(d, e), y % 2 || f.push(d[0]), d = d[1], ++y, q = b[y % b.length];
                        return h
                    }

                    function h(a, d, f, c) {
                        var h = [d.last.x, d.last.y].concat(f),
                            e = !(a instanceof Array);
                        f = 4 === f.length ? "quadraticCurveTo" : "bezierCurveTo";
                        var q = [];
                        d = b(h, d.canvasDash, q, c);
                        for (c = 0; c < q.length; ++c) h = q[c], e ? (a.moveTo(h[0], h[1]), a[f].apply(a, h.slice(2))) : (a.push("moveTo", [h[0], h[1]]), a.push(f, h.slice(2)));
                        return d
                    }

                    function d(d, b, f, c, h, e, q) {
                        var g = 0,
                            y = 0,
                            A = 0,
                            k = a.distance(f, c, h, e),
                            w = 0;
                        b = b.canvasDash;
                        var D = f,
                            t = c,
                            l, Q = !(d instanceof Array);
                        q ? (A = q.l, w = q.i) : A += b[0];
                        for (; .01 < Math.abs(1 - y);) A > k && (g = {
                            l: A - k,
                            i: w
                        }, A = k), y = A / k, q = f + (h - f) * y, l = c + (e - c) * y, w++ % 2 || (Q ? (d.moveTo(D, t), d.lineTo(q,
                            l)) : (d.push("moveTo", [D, t]), d.push("lineTo", [q, l]))), D = q, t = l, A += b[w % b.length];
                        return g
                    }
                    var q = r.canvas = {},
                        w = null,
                        B = x.multiplyPoint,
                        M = Math.PI,
                        C = 2 * M,
                        z = M / 2;
                    c = n.extend;
                    if (m.global.CanvasRenderingContext2D) {
                        m = m.doc.createElement("canvas").getContext("2d");
                        var I = "function" == typeof m.setLineDash,
                            S = "function" == typeof m.fillText
                    }
                    var E = {
                        solid: "none",
                        shortdash: [4, 1],
                        shortdot: [1, 1],
                        shortdashdot: [4, 1, 1, 1],
                        shortdashdotdot: [4, 1, 1, 1, 1, 1],
                        dot: [1, 3],
                        dash: [4, 3],
                        longdash: [8, 3],
                        dashdot: [4, 3, 1, 3],
                        longdashdot: [8, 3, 1, 3],
                        longdashdotdot: [8, 3, 1, 3, 1, 3]
                    };
                    q.Shape = v("dojox.gfx.canvas.Shape", e.Shape, {
                        _render: function(a) {
                            a.save();
                            this._renderTransform(a);
                            this._renderClip(a);
                            this._renderShape(a);
                            this._renderFill(a, !0);
                            this._renderStroke(a, !0);
                            a.restore()
                        },
                        _renderClip: function(a) {
                            this.canvasClip && (this.canvasClip.render(a), a.clip())
                        },
                        _renderTransform: function(a) {
                            if ("canvasTransform" in this) {
                                var d = this.canvasTransform;
                                a.translate(d.dx, d.dy);
                                a.rotate(d.angle2);
                                a.scale(d.sx, d.sy);
                                a.rotate(d.angle1)
                            }
                        },
                        _renderShape: function(a) {},
                        _renderFill: function(a, d) {
                            if ("canvasFill" in this) {
                                var b = this.fillStyle;
                                if ("canvasFillImage" in this) {
                                    var f = b.width,
                                        c = b.height,
                                        h = this.canvasFillImage.width,
                                        e = this.canvasFillImage.height,
                                        q = Math.min(f == h ? 1 : f / h, c == e ? 1 : c / e),
                                        g = (f - q * h) / 2,
                                        y = (c - q * e) / 2;
                                    w.width = f;
                                    w.height = c;
                                    var A = w.getContext("2d");
                                    A.clearRect(0, 0, f, c);
                                    A.drawImage(this.canvasFillImage, 0, 0, h, e, g, y, q * h, q * e);
                                    this.canvasFill = a.createPattern(w, "repeat");
                                    delete this.canvasFillImage
                                }
                                a.fillStyle = this.canvasFill;
                                d && ("pattern" !== b.type || 0 === b.x && 0 === b.y ||
                                    a.translate(b.x, b.y), a.fill())
                            } else a.fillStyle = "rgba(0,0,0,0.0)"
                        },
                        _renderStroke: function(a, d) {
                            var b = this.strokeStyle;
                            b ? (a.strokeStyle = b.color.toString(), a.lineWidth = b.width, a.lineCap = b.cap, "number" == typeof b.join ? (a.lineJoin = "miter", a.miterLimit = b.join) : a.lineJoin = b.join, this.canvasDash ? I ? (a.setLineDash(this.canvasDash), d && a.stroke()) : this._renderDashedStroke(a, d) : d && a.stroke()) : d || (a.strokeStyle = "rgba(0,0,0,0.0)")
                        },
                        _renderDashedStroke: function(a, d) {},
                        getEventSource: function() {
                            return null
                        },
                        on: function() {},
                        connect: function() {},
                        disconnect: function() {},
                        canvasClip: null,
                        setClip: function(a) {
                            this.inherited(arguments);
                            var d = a ? "width" in a ? "rect" : "cx" in a ? "ellipse" : "points" in a ? "polyline" : "d" in a ? "path" : null : null;
                            if (a && !d) return this;
                            this.canvasClip = a ? N(d, a) : null;
                            this.parent && this.parent._makeDirty();
                            return this
                        }
                    });
                    var N = function(a, d) {
                            switch (a) {
                                case "ellipse":
                                    return {
                                        canvasEllipse: A({
                                            shape: d
                                        }), render: function(a) {
                                            return q.Ellipse.prototype._renderShape.call(this, a)
                                        }
                                    };
                                case "rect":
                                    return {
                                        shape: n.delegate(d, {
                                                r: 0
                                            }),
                                            render: function(a) {
                                                return q.Rect.prototype._renderShape.call(this, a)
                                            }
                                    };
                                case "path":
                                    return {
                                        canvasPath: K(d), render: function(a) {
                                            this.canvasPath._renderShape(a)
                                        }
                                    };
                                case "polyline":
                                    return {
                                        canvasPolyline: d.points, render: function(a) {
                                            return q.Polyline.prototype._renderShape.call(this, a)
                                        }
                                    }
                            }
                            return null
                        },
                        K = function(a) {
                            var d = new dojox.gfx.canvas.Path;
                            d.canvasPath = [];
                            d._setPath(a.d);
                            return d
                        },
                        F = function(a, d, b) {
                            var f = a.prototype[d];
                            a.prototype[d] = b ? function() {
                                this.parent && this.parent._makeDirty();
                                f.apply(this, arguments);
                                b.call(this);
                                return this
                            } : function() {
                                this.parent && this.parent._makeDirty();
                                return f.apply(this, arguments)
                            }
                        };
                    F(q.Shape, "setTransform", function() {
                        this.matrix ? this.canvasTransform = r.decompose(this.matrix) : delete this.canvasTransform
                    });
                    F(q.Shape, "setFill", function() {
                        var a = this.fillStyle,
                            d;
                        if (a) {
                            if ("object" == typeof a && "type" in a) {
                                var b = this.surface.rawNode.getContext("2d");
                                switch (a.type) {
                                    case "linear":
                                    case "radial":
                                        d = "linear" == a.type ? b.createLinearGradient(a.x1, a.y1, a.x2, a.y2) : b.createRadialGradient(a.cx,
                                            a.cy, 0, a.cx, a.cy, a.r);
                                        u.forEach(a.colors, function(a) {
                                            d.addColorStop(a.offset, r.normalizeColor(a.color).toString())
                                        });
                                        break;
                                    case "pattern":
                                        w || (w = document.createElement("canvas")), b = new Image, this.surface.downloadImage(b, a.src), this.canvasFillImage = b
                                }
                            } else d = a.toString();
                            this.canvasFill = d
                        } else delete this.canvasFill
                    });
                    F(q.Shape, "setStroke", function() {
                        var a = this.strokeStyle;
                        if (a) {
                            var d = this.strokeStyle.style.toLowerCase();
                            d in E && (d = E[d]);
                            if (d instanceof Array) {
                                this.canvasDash = d = d.slice();
                                var b;
                                for (b =
                                    0; b < d.length; ++b) d[b] *= a.width;
                                if ("butt" != a.cap) {
                                    for (b = 0; b < d.length; b += 2) d[b] -= a.width, 1 > d[b] && (d[b] = 1);
                                    for (b = 1; b < d.length; b += 2) d[b] += a.width
                                }
                            } else delete this.canvasDash
                        } else delete this.canvasDash;
                        this._needsDash = !I && !!this.canvasDash
                    });
                    F(q.Shape, "setShape");
                    q.Group = v("dojox.gfx.canvas.Group", q.Shape, {
                        constructor: function() {
                            e.Container._init.call(this)
                        },
                        _render: function(a) {
                            a.save();
                            this._renderTransform(a);
                            this._renderClip(a);
                            for (var d = 0; d < this.children.length; ++d) this.children[d]._render(a);
                            a.restore()
                        },
                        destroy: function() {
                            e.Container.clear.call(this, !0);
                            q.Shape.prototype.destroy.apply(this, arguments)
                        }
                    });
                    q.Rect = v("dojox.gfx.canvas.Rect", [q.Shape, e.Rect], {
                        _renderShape: function(a) {
                            var d = this.shape,
                                b = Math.min(d.r, d.height / 2, d.width / 2),
                                f = d.x,
                                c = f + d.width,
                                h = d.y,
                                d = h + d.height,
                                e = f + b,
                                q = c - b,
                                g = h + b,
                                A = d - b;
                            a.beginPath();
                            a.moveTo(e, h);
                            b ? (a.arc(q, g, b, -z, 0, !1), a.arc(q, A, b, 0, z, !1), a.arc(e, A, b, z, M, !1), a.arc(e, g, b, M, M + z, !1)) : (a.lineTo(q, h), a.lineTo(c, A), a.lineTo(e, d), a.lineTo(f, g));
                            a.closePath()
                        },
                        _renderDashedStroke: function(a,
                            b) {
                            var c = this.shape,
                                h = Math.min(c.r, c.height / 2, c.width / 2),
                                e = c.x,
                                q = e + c.width,
                                g = c.y,
                                A = g + c.height,
                                k = e + h,
                                w = q - h,
                                y = g + h,
                                t = A - h;
                            h ? (a.beginPath(), c = d(a, this, k, g, w, g), b && a.stroke(), c = f(a, this.canvasDash, w, y, h, -z, 0, !1, b, c), a.beginPath(), c = d(a, this, q, y, q, t, c), b && a.stroke(), c = f(a, this.canvasDash, w, t, h, 0, z, !1, b, c), a.beginPath(), c = d(a, this, w, A, k, A, c), b && a.stroke(), c = f(a, this.canvasDash, k, t, h, z, M, !1, b, c), a.beginPath(), c = d(a, this, e, t, e, y, c), b && a.stroke(), f(a, this.canvasDash, k, y, h, M, M + z, !1, b, c)) : (a.beginPath(), c = d(a,
                                this, k, g, w, g), c = d(a, this, w, g, q, t, c), c = d(a, this, q, t, k, A, c), d(a, this, k, A, e, y, c), b && a.stroke())
                        }
                    });
                    var G = [];
                    (function() {
                        var a = t.curvePI4;
                        G.push(a.s, a.c1, a.c2, a.e);
                        for (var d = 45; 360 > d; d += 45) {
                            var b = x.rotateg(d);
                            G.push(B(b, a.c1), B(b, a.c2), B(b, a.e))
                        }
                    })();
                    var A = function(a) {
                        var d, c, f, h = [],
                            e = a.shape,
                            q = x.normalize([x.translate(e.cx, e.cy), x.scale(e.rx, e.ry)]);
                        d = B(q, G[0]);
                        h.push([d.x, d.y]);
                        for (e = 1; e < G.length; e += 3) c = B(q, G[e]), f = B(q, G[e + 1]), d = B(q, G[e + 2]), h.push([c.x, c.y, f.x, f.y, d.x, d.y]);
                        if (a._needsDash) {
                            d = [];
                            c =
                                h[0];
                            for (e = 1; e < h.length; ++e) f = [], b(c.concat(h[e]), a.canvasDash, f), c = [h[e][4], h[e][5]], d.push(f);
                            a._dashedPoints = d
                        }
                        return h
                    };
                    q.Ellipse = v("dojox.gfx.canvas.Ellipse", [q.Shape, e.Ellipse], {
                        setShape: function() {
                            this.inherited(arguments);
                            this.canvasEllipse = A(this);
                            return this
                        },
                        setStroke: function() {
                            this.inherited(arguments);
                            I || (this.canvasEllipse = A(this));
                            return this
                        },
                        _renderShape: function(a) {
                            var d = this.canvasEllipse,
                                b;
                            a.beginPath();
                            a.moveTo.apply(a, d[0]);
                            for (b = 1; b < d.length; ++b) a.bezierCurveTo.apply(a, d[b]);
                            a.closePath()
                        },
                        _renderDashedStroke: function(a, d) {
                            var b = this._dashedPoints;
                            a.beginPath();
                            for (var c = 0; c < b.length; ++c)
                                for (var f = b[c], h = 0; h < f.length; ++h) {
                                    var e = f[h];
                                    a.moveTo(e[0], e[1]);
                                    a.bezierCurveTo(e[2], e[3], e[4], e[5], e[6], e[7])
                                }
                            d && a.stroke()
                        }
                    });
                    q.Circle = v("dojox.gfx.canvas.Circle", [q.Shape, e.Circle], {
                        _renderShape: function(a) {
                            var d = this.shape;
                            a.beginPath();
                            a.arc(d.cx, d.cy, d.r, 0, C, 1)
                        },
                        _renderDashedStroke: function(a, d) {
                            var b = this.shape,
                                c = 0,
                                f, h = this.canvasDash.length;
                            for (i = 0; c < C;) f = this.canvasDash[i %
                                h] / b.r, i % 2 || (a.beginPath(), a.arc(b.cx, b.cy, b.r, c, c + f, 0), d && a.stroke()), c += f, ++i
                        }
                    });
                    q.Line = v("dojox.gfx.canvas.Line", [q.Shape, e.Line], {
                        _renderShape: function(a) {
                            var d = this.shape;
                            a.beginPath();
                            a.moveTo(d.x1, d.y1);
                            a.lineTo(d.x2, d.y2)
                        },
                        _renderDashedStroke: function(a, b) {
                            var c = this.shape;
                            a.beginPath();
                            d(a, this, c.x1, c.y1, c.x2, c.y2);
                            b && a.stroke()
                        }
                    });
                    q.Polyline = v("dojox.gfx.canvas.Polyline", [q.Shape, e.Polyline], {
                        setShape: function() {
                            this.inherited(arguments);
                            var a = this.shape.points,
                                d = a[0],
                                b, c;
                            this.bbox = null;
                            this._normalizePoints();
                            if (a.length)
                                if ("number" == typeof d) d = a;
                                else
                                    for (d = [], c = 0; c < a.length; ++c) b = a[c], d.push(b.x, b.y);
                            else d = [];
                            this.canvasPolyline = d;
                            return this
                        },
                        _renderShape: function(a) {
                            var d = this.canvasPolyline;
                            if (d.length) {
                                a.beginPath();
                                a.moveTo(d[0], d[1]);
                                for (var b = 2; b < d.length; b += 2) a.lineTo(d[b], d[b + 1])
                            }
                        },
                        _renderDashedStroke: function(a, b) {
                            var c = this.canvasPolyline,
                                f = 0;
                            a.beginPath();
                            for (var h = 0; h < c.length; h += 2) f = d(a, this, c[h], c[h + 1], c[h + 2], c[h + 3], f);
                            b && a.stroke()
                        }
                    });
                    q.Image = v("dojox.gfx.canvas.Image",
                        [q.Shape, e.Image], {
                            setShape: function() {
                                this.inherited(arguments);
                                var a = new Image;
                                this.surface.downloadImage(a, this.shape.src);
                                this.canvasImage = a;
                                return this
                            },
                            _renderShape: function(a) {
                                var d = this.shape;
                                a.drawImage(this.canvasImage, d.x, d.y, d.width, d.height)
                            }
                        });
                    q.Text = v("dojox.gfx.canvas.Text", [q.Shape, e.Text], {
                        _setFont: function() {
                            this.fontStyle ? this.canvasFont = r.makeFontString(this.fontStyle) : delete this.canvasFont
                        },
                        getTextWidth: function() {
                            var a = this.shape,
                                d = 0,
                                b;
                            a.text && (b = this.surface.rawNode.getContext("2d"),
                                b.save(), this._renderTransform(b), this._renderFill(b, !1), this._renderStroke(b, !1), this.canvasFont && (b.font = this.canvasFont), d = b.measureText(a.text).width, b.restore());
                            return d
                        },
                        _render: function(a) {
                            a.save();
                            this._renderTransform(a);
                            this._renderFill(a, !1);
                            this._renderStroke(a, !1);
                            this._renderShape(a);
                            a.restore()
                        },
                        _renderShape: function(a) {
                            var d = this.shape;
                            d.text && (a.textAlign = "middle" === d.align ? "center" : d.align, this.canvasFont && (a.font = this.canvasFont), this.canvasFill && a.fillText(d.text, d.x, d.y), this.strokeStyle &&
                                (a.beginPath(), a.strokeText(d.text, d.x, d.y), a.closePath()))
                        }
                    });
                    F(q.Text, "setFont");
                    S || q.Text.extend({
                        getTextWidth: function() {
                            return 0
                        },
                        getBoundingBox: function() {
                            return null
                        },
                        _renderShape: function() {}
                    });
                    var X = {
                        M: "_moveToA",
                        m: "_moveToR",
                        L: "_lineToA",
                        l: "_lineToR",
                        H: "_hLineToA",
                        h: "_hLineToR",
                        V: "_vLineToA",
                        v: "_vLineToR",
                        C: "_curveToA",
                        c: "_curveToR",
                        S: "_smoothCurveToA",
                        s: "_smoothCurveToR",
                        Q: "_qCurveToA",
                        q: "_qCurveToR",
                        T: "_qSmoothCurveToA",
                        t: "_qSmoothCurveToR",
                        A: "_arcTo",
                        a: "_arcTo",
                        Z: "_closePath",
                        z: "_closePath"
                    };
                    q.Path = v("dojox.gfx.canvas.Path", [q.Shape, k.Path], {
                        constructor: function() {
                            this.lastControl = {}
                        },
                        setShape: function() {
                            this.canvasPath = [];
                            this._dashedPath = [];
                            return this.inherited(arguments)
                        },
                        setStroke: function() {
                            this.inherited(arguments);
                            I || (this.segmented = !1, this._confirmSegmented());
                            return this
                        },
                        _setPath: function() {
                            this._dashResidue = null;
                            this.inherited(arguments)
                        },
                        _updateWithSegment: function(a) {
                            var d = n.clone(this.last);
                            this[X[a.action]](this.canvasPath, a.action, a.args, this._needsDash ? this._dashedPath :
                                null);
                            this.last = d;
                            this.inherited(arguments)
                        },
                        _renderShape: function(a) {
                            var d = this.canvasPath;
                            a.beginPath();
                            for (var b = 0; b < d.length; b += 2) a[d[b]].apply(a, d[b + 1])
                        },
                        _renderDashedStroke: I ? function() {} : function(a, d) {
                            var b = this._dashedPath;
                            a.beginPath();
                            for (var c = 0; c < b.length; c += 2) a[b[c]].apply(a, b[c + 1]);
                            d && a.stroke()
                        },
                        _moveToA: function(a, b, c, f) {
                            a.push("moveTo", [c[0], c[1]]);
                            f && f.push("moveTo", [c[0], c[1]]);
                            for (b = 2; b < c.length; b += 2) a.push("lineTo", [c[b], c[b + 1]]), f && (this._dashResidue = d(f, this, c[b - 2], c[b - 1], c[b],
                                c[b + 1], this._dashResidue));
                            this.last.x = c[c.length - 2];
                            this.last.y = c[c.length - 1];
                            this.lastControl = {}
                        },
                        _moveToR: function(a, b, c, f) {
                            b = "x" in this.last ? [this.last.x += c[0], this.last.y += c[1]] : [this.last.x = c[0], this.last.y = c[1]];
                            a.push("moveTo", b);
                            f && f.push("moveTo", b);
                            for (b = 2; b < c.length; b += 2) a.push("lineTo", [this.last.x += c[b], this.last.y += c[b + 1]]), f && (this._dashResidue = d(f, this, f[f.length - 1][0], f[f.length - 1][1], this.last.x, this.last.y, this._dashResidue));
                            this.lastControl = {}
                        },
                        _lineToA: function(a, b, c, f) {
                            for (b =
                                0; b < c.length; b += 2) f && (this._dashResidue = d(f, this, this.last.x, this.last.y, c[b], c[b + 1], this._dashResidue)), a.push("lineTo", [c[b], c[b + 1]]);
                            this.last.x = c[c.length - 2];
                            this.last.y = c[c.length - 1];
                            this.lastControl = {}
                        },
                        _lineToR: function(a, b, c, f) {
                            for (b = 0; b < c.length; b += 2) a.push("lineTo", [this.last.x += c[b], this.last.y += c[b + 1]]), f && (this._dashResidue = d(f, this, f[f.length - 1][0], f[f.length - 1][1], this.last.x, this.last.y, this._dashResidue));
                            this.lastControl = {}
                        },
                        _hLineToA: function(a, b, c, f) {
                            for (b = 0; b < c.length; ++b) a.push("lineTo",
                                [c[b], this.last.y]), f && (this._dashResidue = d(f, this, f[f.length - 1][0], f[f.length - 1][1], c[b], this.last.y, this._dashResidue));
                            this.last.x = c[c.length - 1];
                            this.lastControl = {}
                        },
                        _hLineToR: function(a, b, c, f) {
                            for (b = 0; b < c.length; ++b) a.push("lineTo", [this.last.x += c[b], this.last.y]), f && (this._dashResidue = d(f, this, f[f.length - 1][0], f[f.length - 1][1], this.last.x, this.last.y, this._dashResidue));
                            this.lastControl = {}
                        },
                        _vLineToA: function(a, b, c, f) {
                            for (b = 0; b < c.length; ++b) a.push("lineTo", [this.last.x, c[b]]), f && (this._dashResidue =
                                d(f, this, f[f.length - 1][0], f[f.length - 1][1], this.last.x, c[b], this._dashResidue));
                            this.last.y = c[c.length - 1];
                            this.lastControl = {}
                        },
                        _vLineToR: function(a, b, c, f) {
                            for (b = 0; b < c.length; ++b) a.push("lineTo", [this.last.x, this.last.y += c[b]]), f && (this._dashResidue = d(f, this, f[f.length - 1][0], f[f.length - 1][1], this.last.x, this.last.y, this._dashResidue));
                            this.lastControl = {}
                        },
                        _curveToA: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 6) a.push("bezierCurveTo", b.slice(d, d + 6)), c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                            this.last.x = b[b.length - 2];
                            this.last.y = b[b.length - 1];
                            this.lastControl.x = b[b.length - 4];
                            this.lastControl.y = b[b.length - 3];
                            this.lastControl.type = "C"
                        },
                        _curveToR: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 6) a.push("bezierCurveTo", [this.last.x + b[d], this.last.y + b[d + 1], this.lastControl.x = this.last.x + b[d + 2], this.lastControl.y = this.last.y + b[d + 3], this.last.x + b[d + 4], this.last.y + b[d + 5]]), c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue)), this.last.x += b[d + 4], this.last.y += b[d + 5];
                            this.lastControl.type = "C"
                        },
                        _smoothCurveToA: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 4) {
                                var f = "C" == this.lastControl.type;
                                a.push("bezierCurveTo", [f ? 2 * this.last.x - this.lastControl.x : this.last.x, f ? 2 * this.last.y - this.lastControl.y : this.last.y, b[d], b[d + 1], b[d + 2], b[d + 3]]);
                                c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                                this.lastControl.x = b[d];
                                this.lastControl.y = b[d + 1];
                                this.lastControl.type = "C"
                            }
                            this.last.x = b[b.length - 2];
                            this.last.y = b[b.length - 1]
                        },
                        _smoothCurveToR: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 4) {
                                var f = "C" ==
                                    this.lastControl.type;
                                a.push("bezierCurveTo", [f ? 2 * this.last.x - this.lastControl.x : this.last.x, f ? 2 * this.last.y - this.lastControl.y : this.last.y, this.last.x + b[d], this.last.y + b[d + 1], this.last.x + b[d + 2], this.last.y + b[d + 3]]);
                                c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                                this.lastControl.x = this.last.x + b[d];
                                this.lastControl.y = this.last.y + b[d + 1];
                                this.lastControl.type = "C";
                                this.last.x += b[d + 2];
                                this.last.y += b[d + 3]
                            }
                        },
                        _qCurveToA: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 4) a.push("quadraticCurveTo",
                                b.slice(d, d + 4));
                            c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                            this.last.x = b[b.length - 2];
                            this.last.y = b[b.length - 1];
                            this.lastControl.x = b[b.length - 4];
                            this.lastControl.y = b[b.length - 3];
                            this.lastControl.type = "Q"
                        },
                        _qCurveToR: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 4) a.push("quadraticCurveTo", [this.lastControl.x = this.last.x + b[d], this.lastControl.y = this.last.y + b[d + 1], this.last.x + b[d + 2], this.last.y + b[d + 3]]), c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue)), this.last.x += b[d +
                                2], this.last.y += b[d + 3];
                            this.lastControl.type = "Q"
                        },
                        _qSmoothCurveToA: function(a, d, b, c) {
                            for (d = 0; d < b.length; d += 2) {
                                var f = "Q" == this.lastControl.type;
                                a.push("quadraticCurveTo", [this.lastControl.x = f ? 2 * this.last.x - this.lastControl.x : this.last.x, this.lastControl.y = f ? 2 * this.last.y - this.lastControl.y : this.last.y, b[d], b[d + 1]]);
                                c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                                this.lastControl.type = "Q"
                            }
                            this.last.x = b[b.length - 2];
                            this.last.y = b[b.length - 1]
                        },
                        _qSmoothCurveToR: function(a, d, b, c) {
                            for (d =
                                0; d < b.length; d += 2) {
                                var f = "Q" == this.lastControl.type;
                                a.push("quadraticCurveTo", [this.lastControl.x = f ? 2 * this.last.x - this.lastControl.x : this.last.x, this.lastControl.y = f ? 2 * this.last.y - this.lastControl.y : this.last.y, this.last.x + b[d], this.last.y + b[d + 1]]);
                                c && (this._dashResidue = h(c, this, a[a.length - 1], this._dashResidue));
                                this.lastControl.type = "Q";
                                this.last.x += b[d];
                                this.last.y += b[d + 1]
                            }
                        },
                        _arcTo: function(a, d, b, c) {
                            d = "a" == d;
                            for (var f = 0; f < b.length; f += 7) {
                                var e = b[f + 5],
                                    q = b[f + 6];
                                d && (e += this.last.x, q += this.last.y);
                                var g =
                                    t.arcAsBezier(this.last, b[f], b[f + 1], b[f + 2], b[f + 3] ? 1 : 0, b[f + 4] ? 1 : 0, e, q);
                                u.forEach(g, function(d) {
                                    a.push("bezierCurveTo", d)
                                });
                                c && (this._dashResidue = h(c, this, p, this._dashResidue));
                                this.last.x = e;
                                this.last.y = q
                            }
                            this.lastControl = {}
                        },
                        _closePath: function(a, b, c, f) {
                            a.push("closePath", []);
                            f && (this._dashResidue = d(f, this, this.last.x, this.last.y, f[1][0], f[1][1], this._dashResidue));
                            this.lastControl = {}
                        }
                    });
                    u.forEach("moveTo lineTo hLineTo vLineTo curveTo smoothCurveTo qCurveTo qSmoothCurveTo arcTo closePath".split(" "),
                        function(a) {
                            F(q.Path, a)
                        });
                    q.TextPath = v("dojox.gfx.canvas.TextPath", [q.Shape, k.TextPath], {
                        _renderShape: function(a) {},
                        _setText: function() {},
                        _setFont: function() {}
                    });
                    q.Surface = v("dojox.gfx.canvas.Surface", e.Surface, {
                        constructor: function() {
                            e.Container._init.call(this);
                            this.pendingImageCount = 0;
                            this.makeDirty()
                        },
                        destroy: function() {
                            e.Container.clear.call(this, !0);
                            this.inherited(arguments)
                        },
                        setDimensions: function(a, d) {
                            this.width = r.normalizedLength(a);
                            this.height = r.normalizedLength(d);
                            if (!this.rawNode) return this;
                            a = !1;
                            this.rawNode.width != this.width && (this.rawNode.width = this.width, a = !0);
                            this.rawNode.height != this.height && (this.rawNode.height = this.height, a = !0);
                            a && this.makeDirty();
                            return this
                        },
                        getDimensions: function() {
                            return this.rawNode ? {
                                width: this.rawNode.width,
                                height: this.rawNode.height
                            } : null
                        },
                        _render: function(a) {
                            !this.rawNode || !a && this.pendingImageCount || (a = this.rawNode.getContext("2d"), a.clearRect(0, 0, this.rawNode.width, this.rawNode.height), this.render(a), "pendingRender" in this && (clearTimeout(this.pendingRender),
                                delete this.pendingRender))
                        },
                        render: function(a) {
                            a.save();
                            for (var d = 0; d < this.children.length; ++d) this.children[d]._render(a);
                            a.restore()
                        },
                        makeDirty: function() {
                            this.pendingImagesCount || "pendingRender" in this || this._batch || (this.pendingRender = setTimeout(n.hitch(this, this._render), 0))
                        },
                        downloadImage: function(a, d) {
                            var b = n.hitch(this, this.onImageLoad);
                            !this.pendingImageCount++ && "pendingRender" in this && (clearTimeout(this.pendingRender), delete this.pendingRender);
                            a.onload = b;
                            a.onerror = b;
                            a.onabort = b;
                            a.src =
                                d
                        },
                        onImageLoad: function() {
                            --this.pendingImageCount || (this.onImagesLoaded(), this._render())
                        },
                        onImagesLoaded: function() {},
                        getEventSource: function() {
                            return null
                        },
                        connect: function() {},
                        disconnect: function() {},
                        on: function() {}
                    });
                    q.createSurface = function(a, d, b) {
                        if (!d && !b) {
                            var c = l.position(a);
                            d = d || c.w;
                            b = b || c.h
                        }
                        "number" == typeof d && (d += "px");
                        "number" == typeof b && (b += "px");
                        c = new q.Surface;
                        a = g.byId(a);
                        var f = a.ownerDocument.createElement("canvas");
                        f.width = r.normalizedLength(d);
                        f.height = r.normalizedLength(b);
                        a.appendChild(f);
                        c.rawNode = f;
                        c._parent = a;
                        return c.surface = c
                    };
                    var H = e.Container;
                    v = {
                        openBatch: function() {
                            ++this._batch;
                            return this
                        },
                        closeBatch: function() {
                            this._batch = 0 < this._batch ? --this._batch : 0;
                            this._makeDirty();
                            return this
                        },
                        _makeDirty: function() {
                            this._batch || this.surface.makeDirty()
                        },
                        add: function(a) {
                            this._makeDirty();
                            return H.add.apply(this, arguments)
                        },
                        remove: function(a, d) {
                            this._makeDirty();
                            return H.remove.apply(this, arguments)
                        },
                        clear: function() {
                            this._makeDirty();
                            return H.clear.apply(this, arguments)
                        },
                        getBoundingBox: H.getBoundingBox,
                        _moveChildToFront: function(a) {
                            this._makeDirty();
                            return H._moveChildToFront.apply(this, arguments)
                        },
                        _moveChildToBack: function(a) {
                            this._makeDirty();
                            return H._moveChildToBack.apply(this, arguments)
                        }
                    };
                    k = {
                        createObject: function(a, d) {
                            a = new a;
                            a.surface = this.surface;
                            a.setShape(d);
                            this.add(a);
                            return a
                        }
                    };
                    c(q.Group, v);
                    c(q.Group, e.Creator);
                    c(q.Group, k);
                    c(q.Surface, v);
                    c(q.Surface, e.Creator);
                    c(q.Surface, k);
                    q.fixTarget = function(a, d) {
                        return !0
                    };
                    return q
                })
        },
        "dojox/gfx/shape": function() {
            define("./_base dojo/_base/lang dojo/_base/declare dojo/_base/kernel dojo/_base/sniff dojo/on dojo/_base/array dojo/dom-construct dojo/_base/Color ./matrix".split(" "),
                function(r, n, u, v, m, l, g, e, k, t) {
                    function x(a, c) {
                        for (var b = a.length - 1; c < b;) a[c] = a[++c];
                        a.length = b
                    }
                    var c = r.shape = {};
                    c.Shape = u("dojox.gfx.shape.Shape", null, {
                        constructor: function() {
                            this.parentMatrix = this.parent = this.bbox = this.strokeStyle = this.fillStyle = this.matrix = this.shape = this.rawNode = null;
                            if (m("gfxRegistry")) {
                                var a = c.register(this);
                                this.getUID = function() {
                                    return a
                                }
                            }
                        },
                        destroy: function() {
                            m("gfxRegistry") && c.dispose(this);
                            this.rawNode && "__gfxObject__" in this.rawNode && (this.rawNode.__gfxObject__ = null);
                            this.rawNode =
                                null
                        },
                        getNode: function() {
                            return this.rawNode
                        },
                        getShape: function() {
                            return this.shape
                        },
                        getTransform: function() {
                            return this.matrix
                        },
                        getFill: function() {
                            return this.fillStyle
                        },
                        getStroke: function() {
                            return this.strokeStyle
                        },
                        getParent: function() {
                            return this.parent
                        },
                        getBoundingBox: function() {
                            return this.bbox
                        },
                        getTransformedBoundingBox: function() {
                            var a = this.getBoundingBox();
                            if (!a) return null;
                            var c = this._getRealMatrix();
                            return [t.multiplyPoint(c, a.x, a.y), t.multiplyPoint(c, a.x + a.width, a.y), t.multiplyPoint(c, a.x +
                                a.width, a.y + a.height), t.multiplyPoint(c, a.x, a.y + a.height)]
                        },
                        getEventSource: function() {
                            return this.rawNode
                        },
                        setClip: function(a) {
                            this.clip = a
                        },
                        getClip: function() {
                            return this.clip
                        },
                        setShape: function(a) {
                            this.shape = r.makeParameters(this.shape, a);
                            this.bbox = null;
                            return this
                        },
                        setFill: function(a) {
                            if (!a) return this.fillStyle = null, this;
                            var c = null;
                            if ("object" == typeof a && "type" in a) switch (a.type) {
                                case "linear":
                                    c = r.makeParameters(r.defaultLinearGradient, a);
                                    break;
                                case "radial":
                                    c = r.makeParameters(r.defaultRadialGradient,
                                        a);
                                    break;
                                case "pattern":
                                    c = r.makeParameters(r.defaultPattern, a)
                            } else c = r.normalizeColor(a);
                            this.fillStyle = c;
                            return this
                        },
                        setStroke: function(a) {
                            if (!a) return this.strokeStyle = null, this;
                            if ("string" == typeof a || n.isArray(a) || a instanceof k) a = {
                                color: a
                            };
                            a = this.strokeStyle = r.makeParameters(r.defaultStroke, a);
                            a.color = r.normalizeColor(a.color);
                            return this
                        },
                        setTransform: function(a) {
                            this.matrix = t.clone(a ? t.normalize(a) : t.identity);
                            return this._applyTransform()
                        },
                        _applyTransform: function() {
                            return this
                        },
                        moveToFront: function() {
                            var a =
                                this.getParent();
                            a && (a._moveChildToFront(this), this._moveToFront());
                            return this
                        },
                        moveToBack: function() {
                            var a = this.getParent();
                            a && (a._moveChildToBack(this), this._moveToBack());
                            return this
                        },
                        _moveToFront: function() {},
                        _moveToBack: function() {},
                        applyRightTransform: function(a) {
                            return a ? this.setTransform([this.matrix, a]) : this
                        },
                        applyLeftTransform: function(a) {
                            return a ? this.setTransform([a, this.matrix]) : this
                        },
                        applyTransform: function(a) {
                            return a ? this.setTransform([this.matrix, a]) : this
                        },
                        removeShape: function(a) {
                            this.parent &&
                                this.parent.remove(this, a);
                            return this
                        },
                        _setParent: function(a, c) {
                            this.parent = a;
                            return this._updateParentMatrix(c)
                        },
                        _updateParentMatrix: function(a) {
                            this.parentMatrix = a ? t.clone(a) : null;
                            return this._applyTransform()
                        },
                        _getRealMatrix: function() {
                            for (var a = this.matrix, c = this.parent; c;) c.matrix && (a = t.multiply(c.matrix, a)), c = c.parent;
                            return a
                        }
                    });
                    c._eventsProcessing = {
                        on: function(a, f) {
                            return l(this.getEventSource(), a, c.fixCallback(this, r.fixTarget, f))
                        },
                        connect: function(a, c, b) {
                            "on" == a.substring(0, 2) && (a = a.substring(2));
                            return this.on(a, b ? n.hitch(c, b) : c)
                        },
                        disconnect: function(a) {
                            return a.remove()
                        }
                    };
                    c.fixCallback = function(a, c, b, h) {
                        h || (h = b, b = null);
                        if (n.isString(h)) {
                            b = b || v.global;
                            if (!b[h]) throw ['dojox.gfx.shape.fixCallback: scope["', h, '"] is null (scope\x3d"', b, '")'].join("");
                            return function(d) {
                                return c(d, a) ? b[h].apply(b, arguments || []) : void 0
                            }
                        }
                        return b ? function(d) {
                            return c(d, a) ? h.apply(b, arguments || []) : void 0
                        } : function(d) {
                            return c(d, a) ? h.apply(b, arguments) : void 0
                        }
                    };
                    n.extend(c.Shape, c._eventsProcessing);
                    c.Container = {
                        _init: function() {
                            this.children = [];
                            this._batch = 0
                        },
                        openBatch: function() {
                            return this
                        },
                        closeBatch: function() {
                            return this
                        },
                        add: function(a) {
                            var c = a.getParent();
                            c && c.remove(a, !0);
                            this.children.push(a);
                            return a._setParent(this, this._getRealMatrix())
                        },
                        remove: function(a, c) {
                            for (var b = 0; b < this.children.length; ++b)
                                if (this.children[b] == a) {
                                    c || (a.parent = null, a.parentMatrix = null);
                                    x(this.children, b);
                                    break
                                } return this
                        },
                        clear: function(a) {
                            for (var c, b = 0; b < this.children.length; ++b) c = this.children[b], c.parent = null, c.parentMatrix = null, a && c.destroy();
                            this.children = [];
                            return this
                        },
                        getBoundingBox: function() {
                            if (this.children) {
                                var a = null;
                                g.forEach(this.children, function(c) {
                                    var b = c.getBoundingBox();
                                    b && ((c = c.getTransform()) && (b = t.multiplyRectangle(c, b)), a ? (a.x = Math.min(a.x, b.x), a.y = Math.min(a.y, b.y), a.endX = Math.max(a.endX, b.x + b.width), a.endY = Math.max(a.endY, b.y + b.height)) : a = {
                                        x: b.x,
                                        y: b.y,
                                        endX: b.x + b.width,
                                        endY: b.y + b.height
                                    })
                                });
                                a && (a.width = a.endX - a.x, a.height = a.endY - a.y);
                                return a
                            }
                            return null
                        },
                        _moveChildToFront: function(a) {
                            for (var c = 0; c < this.children.length; ++c)
                                if (this.children[c] ==
                                    a) {
                                    x(this.children, c);
                                    this.children.push(a);
                                    break
                                } return this
                        },
                        _moveChildToBack: function(a) {
                            for (var c = 0; c < this.children.length; ++c)
                                if (this.children[c] == a) {
                                    x(this.children, c);
                                    this.children.unshift(a);
                                    break
                                } return this
                        }
                    };
                    c.Surface = u("dojox.gfx.shape.Surface", null, {
                        constructor: function() {
                            this._parent = this.rawNode = null;
                            this._nodes = [];
                            this._events = []
                        },
                        destroy: function() {
                            g.forEach(this._nodes, e.destroy);
                            this._nodes = [];
                            g.forEach(this._events, function(a) {
                                a && a.remove()
                            });
                            this._events = [];
                            this.rawNode = null;
                            if (m("ie"))
                                for (; this._parent.lastChild;) e.destroy(this._parent.lastChild);
                            else this._parent.innerHTML = "";
                            this._parent = null
                        },
                        getEventSource: function() {
                            return this.rawNode
                        },
                        _getRealMatrix: function() {
                            return null
                        },
                        isLoaded: !0,
                        onLoad: function(a) {},
                        whenLoaded: function(a, c) {
                            var b = n.hitch(a, c);
                            if (this.isLoaded) b(this);
                            else l.once(this, "load", function(a) {
                                b(a)
                            })
                        }
                    });
                    n.extend(c.Surface, c._eventsProcessing);
                    c.Rect = u("dojox.gfx.shape.Rect", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Rect");
                            this.rawNode =
                                a
                        },
                        getBoundingBox: function() {
                            return this.shape
                        }
                    });
                    c.Ellipse = u("dojox.gfx.shape.Ellipse", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Ellipse");
                            this.rawNode = a
                        },
                        getBoundingBox: function() {
                            if (!this.bbox) {
                                var a = this.shape;
                                this.bbox = {
                                    x: a.cx - a.rx,
                                    y: a.cy - a.ry,
                                    width: 2 * a.rx,
                                    height: 2 * a.ry
                                }
                            }
                            return this.bbox
                        }
                    });
                    c.Circle = u("dojox.gfx.shape.Circle", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Circle");
                            this.rawNode = a
                        },
                        getBoundingBox: function() {
                            if (!this.bbox) {
                                var a = this.shape;
                                this.bbox = {
                                    x: a.cx -
                                        a.r,
                                    y: a.cy - a.r,
                                    width: 2 * a.r,
                                    height: 2 * a.r
                                }
                            }
                            return this.bbox
                        }
                    });
                    c.Line = u("dojox.gfx.shape.Line", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Line");
                            this.rawNode = a
                        },
                        getBoundingBox: function() {
                            if (!this.bbox) {
                                var a = this.shape;
                                this.bbox = {
                                    x: Math.min(a.x1, a.x2),
                                    y: Math.min(a.y1, a.y2),
                                    width: Math.abs(a.x2 - a.x1),
                                    height: Math.abs(a.y2 - a.y1)
                                }
                            }
                            return this.bbox
                        }
                    });
                    c.Polyline = u("dojox.gfx.shape.Polyline", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Polyline");
                            this.rawNode = a
                        },
                        setShape: function(a,
                            c) {
                            a && a instanceof Array ? (this.inherited(arguments, [{
                                points: a
                            }]), c && this.shape.points.length && this.shape.points.push(this.shape.points[0])) : this.inherited(arguments, [a]);
                            return this
                        },
                        _normalizePoints: function() {
                            var a = this.shape.points,
                                c = a && a.length;
                            if (c && "number" == typeof a[0]) {
                                for (var b = [], h = 0; h < c; h += 2) b.push({
                                    x: a[h],
                                    y: a[h + 1]
                                });
                                this.shape.points = b
                            }
                        },
                        getBoundingBox: function() {
                            if (!this.bbox && this.shape.points.length) {
                                for (var a = this.shape.points, c = a.length, b = a[0], h = b.x, d = b.y, e = b.x, g = b.y, k = 1; k < c; ++k) b =
                                    a[k], h > b.x && (h = b.x), e < b.x && (e = b.x), d > b.y && (d = b.y), g < b.y && (g = b.y);
                                this.bbox = {
                                    x: h,
                                    y: d,
                                    width: e - h,
                                    height: g - d
                                }
                            }
                            return this.bbox
                        }
                    });
                    c.Image = u("dojox.gfx.shape.Image", c.Shape, {
                        constructor: function(a) {
                            this.shape = r.getDefault("Image");
                            this.rawNode = a
                        },
                        getBoundingBox: function() {
                            return this.shape
                        },
                        setStroke: function() {
                            return this
                        },
                        setFill: function() {
                            return this
                        }
                    });
                    c.Text = u(c.Shape, {
                        constructor: function(a) {
                            this.fontStyle = null;
                            this.shape = r.getDefault("Text");
                            this.rawNode = a
                        },
                        getFont: function() {
                            return this.fontStyle
                        },
                        setFont: function(a) {
                            this.fontStyle = "string" == typeof a ? r.splitFontString(a) : r.makeParameters(r.defaultFont, a);
                            this._setFont();
                            return this
                        },
                        getBoundingBox: function() {
                            var a = null;
                            this.getShape().text && (a = r._base._computeTextBoundingBox(this));
                            return a
                        }
                    });
                    c.Creator = {
                        createShape: function(a) {
                            switch (a.type) {
                                case r.defaultPath.type:
                                    return this.createPath(a);
                                case r.defaultRect.type:
                                    return this.createRect(a);
                                case r.defaultCircle.type:
                                    return this.createCircle(a);
                                case r.defaultEllipse.type:
                                    return this.createEllipse(a);
                                case r.defaultLine.type:
                                    return this.createLine(a);
                                case r.defaultPolyline.type:
                                    return this.createPolyline(a);
                                case r.defaultImage.type:
                                    return this.createImage(a);
                                case r.defaultText.type:
                                    return this.createText(a);
                                case r.defaultTextPath.type:
                                    return this.createTextPath(a)
                            }
                            return null
                        },
                        createGroup: function() {
                            return this.createObject(r.Group)
                        },
                        createRect: function(a) {
                            return this.createObject(r.Rect, a)
                        },
                        createEllipse: function(a) {
                            return this.createObject(r.Ellipse, a)
                        },
                        createCircle: function(a) {
                            return this.createObject(r.Circle,
                                a)
                        },
                        createLine: function(a) {
                            return this.createObject(r.Line, a)
                        },
                        createPolyline: function(a) {
                            return this.createObject(r.Polyline, a)
                        },
                        createImage: function(a) {
                            return this.createObject(r.Image, a)
                        },
                        createText: function(a) {
                            return this.createObject(r.Text, a)
                        },
                        createPath: function(a) {
                            return this.createObject(r.Path, a)
                        },
                        createTextPath: function(a) {
                            return this.createObject(r.TextPath, {}).setText(a)
                        },
                        createObject: function(a, c) {
                            return null
                        }
                    };
                    return c
                })
        },
        "dojox/gfx/path": function() {
            define(["./_base", "dojo/_base/lang",
                "dojo/_base/declare", "./matrix", "./shape"
            ], function(r, n, u, v, m) {
                m = u("dojox.gfx.path.Path", m.Shape, {
                    constructor: function(l) {
                        this.shape = n.clone(r.defaultPath);
                        this.segments = [];
                        this.tbbox = null;
                        this.absolute = !0;
                        this.last = {};
                        this.rawNode = l;
                        this.segmented = !1
                    },
                    setAbsoluteMode: function(l) {
                        this._confirmSegmented();
                        this.absolute = "string" == typeof l ? "absolute" == l : l;
                        return this
                    },
                    getAbsoluteMode: function() {
                        this._confirmSegmented();
                        return this.absolute
                    },
                    getBoundingBox: function() {
                        this._confirmSegmented();
                        return this.bbox &&
                            "l" in this.bbox ? {
                                x: this.bbox.l,
                                y: this.bbox.t,
                                width: this.bbox.r - this.bbox.l,
                                height: this.bbox.b - this.bbox.t
                            } : null
                    },
                    _getRealBBox: function() {
                        this._confirmSegmented();
                        if (this.tbbox) return this.tbbox;
                        var l = this.bbox,
                            g = this._getRealMatrix();
                        this.bbox = null;
                        for (var e = 0, k = this.segments.length; e < k; ++e) this._updateWithSegment(this.segments[e], g);
                        g = this.bbox;
                        this.bbox = l;
                        return this.tbbox = g ? [{
                            x: g.l,
                            y: g.t
                        }, {
                            x: g.r,
                            y: g.t
                        }, {
                            x: g.r,
                            y: g.b
                        }, {
                            x: g.l,
                            y: g.b
                        }] : null
                    },
                    getLastPosition: function() {
                        this._confirmSegmented();
                        return "x" in
                            this.last ? this.last : null
                    },
                    _applyTransform: function() {
                        this.tbbox = null;
                        return this.inherited(arguments)
                    },
                    _updateBBox: function(l, g, e) {
                        e && (g = v.multiplyPoint(e, l, g), l = g.x, g = g.y);
                        this.bbox && "l" in this.bbox ? (this.bbox.l > l && (this.bbox.l = l), this.bbox.r < l && (this.bbox.r = l), this.bbox.t > g && (this.bbox.t = g), this.bbox.b < g && (this.bbox.b = g)) : this.bbox = {
                            l: l,
                            b: g,
                            r: l,
                            t: g
                        }
                    },
                    _updateWithSegment: function(l, g) {
                        var e = l.args,
                            k = e.length,
                            t;
                        switch (l.action) {
                            case "M":
                            case "L":
                            case "C":
                            case "S":
                            case "Q":
                            case "T":
                                for (t = 0; t < k; t += 2) this._updateBBox(e[t],
                                    e[t + 1], g);
                                this.last.x = e[k - 2];
                                this.last.y = e[k - 1];
                                this.absolute = !0;
                                break;
                            case "H":
                                for (t = 0; t < k; ++t) this._updateBBox(e[t], this.last.y, g);
                                this.last.x = e[k - 1];
                                this.absolute = !0;
                                break;
                            case "V":
                                for (t = 0; t < k; ++t) this._updateBBox(this.last.x, e[t], g);
                                this.last.y = e[k - 1];
                                this.absolute = !0;
                                break;
                            case "m":
                                t = 0;
                                "x" in this.last || (this._updateBBox(this.last.x = e[0], this.last.y = e[1], g), t = 2);
                                for (; t < k; t += 2) this._updateBBox(this.last.x += e[t], this.last.y += e[t + 1], g);
                                this.absolute = !1;
                                break;
                            case "l":
                            case "t":
                                for (t = 0; t < k; t += 2) this._updateBBox(this.last.x +=
                                    e[t], this.last.y += e[t + 1], g);
                                this.absolute = !1;
                                break;
                            case "h":
                                for (t = 0; t < k; ++t) this._updateBBox(this.last.x += e[t], this.last.y, g);
                                this.absolute = !1;
                                break;
                            case "v":
                                for (t = 0; t < k; ++t) this._updateBBox(this.last.x, this.last.y += e[t], g);
                                this.absolute = !1;
                                break;
                            case "c":
                                for (t = 0; t < k; t += 6) this._updateBBox(this.last.x + e[t], this.last.y + e[t + 1], g), this._updateBBox(this.last.x + e[t + 2], this.last.y + e[t + 3], g), this._updateBBox(this.last.x += e[t + 4], this.last.y += e[t + 5], g);
                                this.absolute = !1;
                                break;
                            case "s":
                            case "q":
                                for (t = 0; t < k; t +=
                                    4) this._updateBBox(this.last.x + e[t], this.last.y + e[t + 1], g), this._updateBBox(this.last.x += e[t + 2], this.last.y += e[t + 3], g);
                                this.absolute = !1;
                                break;
                            case "A":
                                for (t = 0; t < k; t += 7) this._updateBBox(e[t + 5], e[t + 6], g);
                                this.last.x = e[k - 2];
                                this.last.y = e[k - 1];
                                this.absolute = !0;
                                break;
                            case "a":
                                for (t = 0; t < k; t += 7) this._updateBBox(this.last.x += e[t + 5], this.last.y += e[t + 6], g);
                                this.absolute = !1
                        }
                        l = [l.action];
                        for (t = 0; t < k; ++t) l.push(r.formatNumber(e[t], !0));
                        if ("string" == typeof this.shape.path) this.shape.path += l.join("");
                        else
                            for (t =
                                0, k = l.length; t < k; ++t) this.shape.path.push(l[t])
                    },
                    _validSegments: {
                        m: 2,
                        l: 2,
                        h: 1,
                        v: 1,
                        c: 6,
                        s: 4,
                        q: 4,
                        t: 2,
                        a: 7,
                        z: 0
                    },
                    _pushSegment: function(l, g) {
                        this.tbbox = null;
                        var e = this._validSegments[l.toLowerCase()];
                        "number" == typeof e && (e ? g.length >= e && (l = {
                            action: l,
                            args: g.slice(0, g.length - g.length % e)
                        }, this.segments.push(l), this._updateWithSegment(l)) : (l = {
                            action: l,
                            args: []
                        }, this.segments.push(l), this._updateWithSegment(l)))
                    },
                    _collectArgs: function(l, g) {
                        for (var e = 0; e < g.length; ++e) {
                            var k = g[e];
                            "boolean" == typeof k ? l.push(k ? 1 : 0) :
                                "number" == typeof k ? l.push(k) : k instanceof Array ? this._collectArgs(l, k) : "x" in k && "y" in k && l.push(k.x, k.y)
                        }
                    },
                    moveTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "M" : "m", l);
                        return this
                    },
                    lineTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "L" : "l", l);
                        return this
                    },
                    hLineTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ?
                            "H" : "h", l);
                        return this
                    },
                    vLineTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "V" : "v", l);
                        return this
                    },
                    curveTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "C" : "c", l);
                        return this
                    },
                    smoothCurveTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "S" : "s", l);
                        return this
                    },
                    qCurveTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "Q" : "q", l);
                        return this
                    },
                    qSmoothCurveTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "T" : "t", l);
                        return this
                    },
                    arcTo: function() {
                        this._confirmSegmented();
                        var l = [];
                        this._collectArgs(l, arguments);
                        this._pushSegment(this.absolute ? "A" : "a", l);
                        return this
                    },
                    closePath: function() {
                        this._confirmSegmented();
                        this._pushSegment("Z", []);
                        return this
                    },
                    _confirmSegmented: function() {
                        if (!this.segmented) {
                            var l =
                                this.shape.path;
                            this.shape.path = [];
                            this._setPath(l);
                            this.shape.path = this.shape.path.join("");
                            this.segmented = !0
                        }
                    },
                    _setPath: function(l) {
                        l = n.isArray(l) ? l : l.match(r.pathSvgRegExp);
                        this.segments = [];
                        this.absolute = !0;
                        this.bbox = {};
                        this.last = {};
                        if (l) {
                            for (var g = "", e = [], k = l.length, t = 0; t < k; ++t) {
                                var x = l[t],
                                    c = parseFloat(x);
                                isNaN(c) ? (g && this._pushSegment(g, e), e = [], g = x) : e.push(c)
                            }
                            this._pushSegment(g, e)
                        }
                    },
                    setShape: function(l) {
                        this.inherited(arguments, ["string" == typeof l ? {
                            path: l
                        } : l]);
                        this.segmented = !1;
                        this.segments = [];
                        r.lazyPathSegmentation || this._confirmSegmented();
                        return this
                    },
                    _2PI: 2 * Math.PI
                });
                u = u("dojox.gfx.path.TextPath", m, {
                    constructor: function(l) {
                        "text" in this || (this.text = n.clone(r.defaultTextPath));
                        "fontStyle" in this || (this.fontStyle = n.clone(r.defaultFont))
                    },
                    getText: function() {
                        return this.text
                    },
                    setText: function(l) {
                        this.text = r.makeParameters(this.text, "string" == typeof l ? {
                            text: l
                        } : l);
                        this._setText();
                        return this
                    },
                    getFont: function() {
                        return this.fontStyle
                    },
                    setFont: function(l) {
                        this.fontStyle = "string" == typeof l ?
                            r.splitFontString(l) : r.makeParameters(r.defaultFont, l);
                        this._setFont();
                        return this
                    }
                });
                return r.path = {
                    Path: m,
                    TextPath: u
                }
            })
        },
        "dojox/gfx/arc": function() {
            define(["./_base", "dojo/_base/lang", "./matrix"], function(r, n, u) {
                function v(e) {
                    var g = Math.cos(e);
                    e = Math.sin(e);
                    var c = {
                        x: g + 4 / 3 * (1 - g),
                        y: e - 4 / 3 * g * (1 - g) / e
                    };
                    return {
                        s: {
                            x: g,
                            y: -e
                        },
                        c1: {
                            x: c.x,
                            y: -c.y
                        },
                        c2: c,
                        e: {
                            x: g,
                            y: e
                        }
                    }
                }
                var m = 2 * Math.PI,
                    l = Math.PI / 4,
                    g = Math.PI / 8,
                    e = l + g,
                    k = v(g);
                return r.arc = {
                    unitArcAsBezier: v,
                    curvePI4: k,
                    arcAsBezier: function(t, x, c, a, f, b, h, d) {
                        f = !!f;
                        b = !!b;
                        var q = u._degToRad(a);
                        a = x * x;
                        var w = c * c,
                            B = u.multiplyPoint(u.rotate(-q), {
                                x: (t.x - h) / 2,
                                y: (t.y - d) / 2
                            }),
                            n = B.x * B.x,
                            C = B.y * B.y;
                        a = Math.sqrt((a * w - a * C - w * n) / (a * C + w * n));
                        isNaN(a) && (a = 0);
                        a = {
                            x: a * x * B.y / c,
                            y: -a * c * B.x / x
                        };
                        f == b && (a = {
                            x: -a.x,
                            y: -a.y
                        });
                        a = u.multiplyPoint([u.translate((t.x + h) / 2, (t.y + d) / 2), u.rotate(q)], a);
                        x = u.normalize([u.translate(a.x, a.y), u.rotate(q), u.scale(x, c)]);
                        a = u.invert(x);
                        t = u.multiplyPoint(a, t);
                        d = u.multiplyPoint(a, h, d);
                        h = Math.atan2(t.y, t.x);
                        a = h - Math.atan2(d.y, d.x);
                        b && (a = -a);
                        0 > a ? a += m : a > m && (a -= m);
                        c = g;
                        d = k;
                        c = b ? c : -c;
                        t = [];
                        for (f = a; 0 < f; f -= l) f < e && (c = f / 2, d = v(c), c = b ? c : -c, f = 0), B = u.normalize([x, u.rotate(h + c)]), b ? (a = u.multiplyPoint(B, d.c1), q = u.multiplyPoint(B, d.c2), B = u.multiplyPoint(B, d.e)) : (a = u.multiplyPoint(B, d.c2), q = u.multiplyPoint(B, d.c1), B = u.multiplyPoint(B, d.s)), t.push([a.x, a.y, q.x, q.y, B.x, B.y]), h += 2 * c;
                        return t
                    }
                }
            })
        },
        "dojox/gfx/decompose": function() {
            define(["./_base", "dojo/_base/lang", "./matrix"], function(r, n, u) {
                function v(e, g) {
                    return Math.abs(e - g) <= 1E-6 * (Math.abs(e) + Math.abs(g))
                }

                function m(e, g, l, c) {
                    if (!isFinite(e)) return l;
                    if (!isFinite(l)) return e;
                    g = Math.abs(g);
                    c = Math.abs(c);
                    return (g * e + c * l) / (g + c)
                }

                function l(e) {
                    e = u.normalize(e);
                    var g = -e.xx - e.yy,
                        k = e.xx * e.yy - e.xy * e.yx,
                        c = Math.sqrt(g * g - 4 * k),
                        g = -(g + (0 > g ? -c : c)) / 2,
                        k = k / g,
                        c = e.xy / (g - e.xx),
                        a = 1,
                        f = e.xy / (k - e.xx),
                        b = 1;
                    v(g, k) && (c = 1, f = a = 0, b = 1);
                    isFinite(c) || (c = 1, a = (g - e.xx) / e.xy, isFinite(a) || (c = (g - e.yy) / e.yx, a = 1, isFinite(c) || (c = 1, a = e.yx / (g - e.yy))));
                    isFinite(f) || (f = 1, b = (k - e.xx) / e.xy, isFinite(b) || (f = (k - e.yy) / e.yx, b = 1, isFinite(f) || (f = 1, b = e.yx / (k - e.yy))));
                    e = Math.sqrt(c * c + a * a);
                    var h = Math.sqrt(f *
                        f + b * b);
                    isFinite(c /= e) || (c = 0);
                    isFinite(a /= e) || (a = 0);
                    isFinite(f /= h) || (f = 0);
                    isFinite(b /= h) || (b = 0);
                    return {
                        value1: g,
                        value2: k,
                        vector1: {
                            x: c,
                            y: a
                        },
                        vector2: {
                            x: f,
                            y: b
                        }
                    }
                }

                function g(e, g) {
                    var k = 0 > e.xx * e.yy || 0 < e.xy * e.yx ? -1 : 1,
                        c = g.angle1 = (Math.atan2(e.yx, e.yy) + Math.atan2(-k * e.xy, k * e.xx)) / 2,
                        k = Math.cos(c),
                        c = Math.sin(c);
                    g.sx = m(e.xx / k, k, -e.xy / c, c);
                    g.sy = m(e.yy / k, k, e.yx / c, c);
                    return g
                }

                function e(e, g) {
                    var k = 0 > e.xx * e.yy || 0 < e.xy * e.yx ? -1 : 1,
                        c = g.angle2 = (Math.atan2(k * e.yx, k * e.xx) + Math.atan2(-e.xy, e.yy)) / 2,
                        k = Math.cos(c),
                        c = Math.sin(c);
                    g.sx = m(e.xx / k, k, e.yx / c, c);
                    g.sy = m(e.yy / k, k, -e.xy / c, c);
                    return g
                }
                return r.decompose = function(k) {
                    var t = u.normalize(k);
                    k = {
                        dx: t.dx,
                        dy: t.dy,
                        sx: 1,
                        sy: 1,
                        angle1: 0,
                        angle2: 0
                    };
                    if (v(t.xy, 0) && v(t.yx, 0)) return n.mixin(k, {
                        sx: t.xx,
                        sy: t.yy
                    });
                    if (v(t.xx * t.yx, -t.xy * t.yy)) return g(t, k);
                    if (v(t.xx * t.xy, -t.yx * t.yy)) return e(t, k);
                    var m, c = new u.Matrix2D(t);
                    m = n.mixin(c, {
                        dx: 0,
                        dy: 0,
                        xy: c.yx,
                        yx: c.xy
                    });
                    c = l([t, m]);
                    m = l([m, t]);
                    c = new u.Matrix2D({
                        xx: c.vector1.x,
                        xy: c.vector2.x,
                        yx: c.vector1.y,
                        yy: c.vector2.y
                    });
                    m = new u.Matrix2D({
                        xx: m.vector1.x,
                        xy: m.vector1.y,
                        yx: m.vector2.x,
                        yy: m.vector2.y
                    });
                    t = new u.Matrix2D([u.invert(c), t, u.invert(m)]);
                    g(m, k);
                    t.xx *= k.sx;
                    t.yy *= k.sy;
                    e(c, k);
                    t.xx *= k.sx;
                    t.yy *= k.sy;
                    return n.mixin(k, {
                        sx: t.xx,
                        sy: t.yy
                    })
                }
            })
        },
        "dojox/gfx/bezierutils": function() {
            define(["./_base"], function(r) {
                r = r.bezierutils = {};
                r.tAtLength = function(g, e) {
                    var k = 0,
                        t = 6 == g.length,
                        m = 0,
                        c = 0,
                        a = t ? v : l,
                        f = function(b, h) {
                            for (var d = 0, q = 0; q < b.length - 2; q += 2) d += u(b[q], b[q + 1], b[q + 2], b[q + 3]);
                            q = t ? u(g[0], g[1], g[4], g[5]) : u(g[0], g[1], g[6], g[7]);
                            d - q > h || m + d > e + h ? (++c, b = a(b, .5),
                                f(b[0], h), Math.abs(m - e) <= h || f(b[1], h)) : (m += d, k += 1 / (1 << c))
                        };
                    e && f(g, .5);
                    return k
                };
                var n = r.computeLength = function(g) {
                        for (var e = 6 == g.length, k = 0, t = 0; t < g.length - 2; t += 2) k += u(g[t], g[t + 1], g[t + 2], g[t + 3]);
                        t = e ? u(g[0], g[1], g[4], g[5]) : u(g[0], g[1], g[6], g[7]);
                        .1 < k - t && (g = e ? v(g, .5) : m(g, .5), k = n(g[0], e), k += n(g[1], e));
                        return k
                    },
                    u = r.distance = function(g, e, k, t) {
                        return Math.sqrt((k - g) * (k - g) + (t - e) * (t - e))
                    },
                    v = function(g, e) {
                        var k = 1 - e,
                            t = k * k,
                            l = e * e,
                            c = g[0],
                            a = g[1],
                            f = g[2],
                            b = g[3],
                            h = g[4];
                        g = g[5];
                        var d = t * c + 2 * k * e * f + l * h,
                            t = t * a + 2 * k * e * b + l *
                            g;
                        return [
                            [c, a, k * c + e * f, k * a + e * b, d, t],
                            [d, t, k * f + e * h, k * b + e * g, h, g]
                        ]
                    },
                    m = function(g, e) {
                        var k = 1 - e,
                            t = k * k,
                            l = t * k,
                            c = e * e,
                            a = c * e,
                            f = g[0],
                            b = g[1],
                            h = g[2],
                            d = g[3],
                            q = g[4],
                            w = g[5],
                            B = g[6];
                        g = g[7];
                        var m = l * f + 3 * t * e * h + 3 * k * c * q + a * B,
                            l = l * b + 3 * t * e * d + 3 * k * c * w + a * g;
                        return [
                            [f, b, k * f + e * h, k * b + e * d, t * f + 2 * k * e * h + c * q, t * b + 2 * k * e * d + c * w, m, l],
                            [m, l, t * h + 2 * k * e * q + c * B, t * d + 2 * k * e * w + c * g, k * q + e * B, k * w + e * g, B, g]
                        ]
                    },
                    l = r.splitBezierAtT = function(g, e) {
                        return 6 == g.length ? v(g, e) : m(g, e)
                    };
                return r
            })
        },
        "dojox/json/query": function() {
            define(["dojo/_base/kernel", "dojo/_base/lang",
                "dojox", "dojo/_base/array"
            ], function(r, n, u) {
                n.getObject("json", !0, u);
                u.json._slice = function(n, m, l, g) {
                    var e = n.length,
                        k = [];
                    l = l || e;
                    m = 0 > m ? Math.max(0, m + e) : Math.min(e, m);
                    for (l = 0 > l ? Math.max(0, l + e) : Math.min(e, l); m < l; m += g) k.push(n[m]);
                    return k
                };
                u.json._find = function(n, m) {
                    function l(e) {
                        m && (!0 !== m || e instanceof Array ? e[m] && g.push(e[m]) : g.push(e));
                        for (var k in e) {
                            var n = e[k];
                            m ? n && "object" == typeof n && l(n) : g.push(n)
                        }
                    }
                    var g = [];
                    if (m instanceof Array) {
                        if (1 == m.length) return n[m[0]];
                        for (var e = 0; e < m.length; e++) g.push(n[m[e]])
                    } else l(n);
                    return g
                };
                u.json._distinctFilter = function(n, m) {
                    for (var l = [], g = {}, e = 0, k = n.length; e < k; ++e) {
                        var t = n[e];
                        m(t, e, n) && ("object" == typeof t && t ? t.__included || (t.__included = !0, l.push(t)) : g[t + typeof t] || (g[t + typeof t] = !0, l.push(t)))
                    }
                    e = 0;
                    for (k = l.length; e < k; ++e) l[e] && delete l[e].__included;
                    return l
                };
                return u.json.query = function(n, m) {
                    function l(c, a, f, b, h, d, q, g) {
                        return e[g].match(/[\*\?]/) || "~" == q ? "/^" + e[g].substring(1, e[g].length - 1).replace(/\\([btnfr\\"'])|([^\w\*\?])/g, "\\$1$2").replace(/([\*\?])/g, "[\\w\\W]$1") +
                            ("~" == q ? "$/i" : "$/") + ".test(" + a + ")" : c
                    }
                    var g = 0,
                        e = [];
                    n = n.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g, function(c) {
                        g += "[" == c ? 1 : "]" == c ? -1 : 0;
                        return "]" == c && 0 < g ? "`]" : '"' == c.charAt(0) || "'" == c.charAt(0) ? "`" + (e.push(c) - 1) : c
                    });
                    var k = "";
                    n.replace(/(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/, function() {
                        throw Error("Unsafe function call");
                    });
                    n = n.replace(/([^<>=]=)([^=])/g, "$1\x3d$2").replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g, function(c) {
                        return "." == c.charAt(0) ? c : "@" == c ? "$obj" : (c.match(/:|^(\$|Math|true|false|null)$/) ?
                            "" : "$obj.") + c
                    }).replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g, function(c, a, f) {
                        return (a = c.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/)) ? (f = "", c.match(/^\./) && (k = "dojox.json._find(" + k, f = ",true)"), k = (a[1].match(/\=/) ? "dojo.map" : a[1].match(/\^/) ? "dojox.json._distinctFilter" : "dojo.filter") + "(" + k, f + ",function($obj){return " + a[2] + "})") : (a = c.match(/^\[\s*([\/\\].*)\]/)) ? ".concat().sort(function(a,b){" + a[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g, function(a, c, d) {
                            return "var av\x3d " + d.replace(/\$obj/,
                                "a") + ",bv\x3d " + d.replace(/\$obj/, "b") + ";if(av\x3ebv||bv\x3d\x3dnull){return " + ("/" == c ? 1 : -1) + ";}\nif(bv\x3eav||av\x3d\x3dnull){return " + ("/" == c ? -1 : 1) + ";}\n"
                        }) + "return 0;})" : (a = c.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/)) ? (k = "dojox.json._slice(" + k, "," + (a[1] || 0) + "," + (a[2] || 0) + "," + (a[3] || 1) + ")") : c.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/) ? (k = "dojox.json._find(" + k, ("." == c.charAt(1) ? ",'" + f + "'" : c.match(/,/) ? "," + c : "") + ")") : c
                    }).replace(/(\$obj\s*((\.\s*[\w_$]+\s*)|(\[\s*`([0-9]+)\s*`\]))*)(==|~)\s*`([0-9]+)/g,
                        l).replace(/`([0-9]+)\s*(==|~)\s*(\$obj\s*((\.\s*[\w_$]+)|(\[\s*`([0-9]+)\s*`\]))*)/g, function(c, a, f, b, h, d, e, g) {
                        return l(c, b, h, d, e, g, f, a)
                    });
                    n = k + ("$" == n.charAt(0) ? "" : "$") + n.replace(/`([0-9]+|\])/g, function(c, a) {
                        return "]" == a ? "]" : e[a]
                    });
                    for (var t = eval("1\x26\x26function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj\x3d$;return " + n + "}"), x = 0; x < arguments.length - 1; x++) arguments[x] = arguments[x + 1];
                    return m ? t.apply(this, arguments) : t
                }
            })
        },
        "esri/tasks/locator": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has ../kernel ../request ../deferredUtils ./Task ./AddressCandidate".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x) {
                    r = r(t, {
                        declaredClass: "esri.tasks.Locator",
                        _eventMap: {
                            "address-to-locations-complete": ["addresses"],
                            "addresses-to-locations-complete": ["addresses"],
                            "location-to-address-complete": ["address"],
                            "suggest-locations-complete": ["suggestions"]
                        },
                        constructor: function(c) {
                            this._geocodeHandler = n.hitch(this, this._geocodeHandler);
                            this._geocodeAddressesHandler = n.hitch(this, this._geocodeAddressesHandler);
                            this._reverseGeocodeHandler = n.hitch(this, this._reverseGeocodeHandler);
                            this.registerConnectEvents()
                        },
                        outSpatialReference: null,
                        setOutSpatialReference: function(c) {
                            this.outSpatialReference = c
                        },
                        _geocodeHandler: function(c, a, f, b, h) {
                            try {
                                var d = c.candidates,
                                    e;
                                a = [];
                                var g, k = d.length,
                                    l = c.spatialReference,
                                    t;
                                for (g = 0; g < k; g++) {
                                    e = d[g];
                                    if (t = e.location) t.spatialReference = l;
                                    a[g] = new x(e)
                                }
                                this._successHandler([a], "onAddressToLocationsComplete", f, h)
                            } catch (z) {
                                this._errorHandler(z, b, h)
                            }
                        },
                        _geocodeAddressesHandler: function(c, a, f, b, h) {
                            try {
                                var d = c.locations;
                                a = [];
                                var e, g = d.length,
                                    k = c.spatialReference,
                                    l;
                                for (e = 0; e < g; e++) {
                                    if (l =
                                        d[e].location) l.spatialReference = k;
                                    a[e] = new x(d[e])
                                }
                                this._successHandler([a], "onAddressesToLocationsComplete", f, h)
                            } catch (C) {
                                this._errorHandler(C, b, h)
                            }
                        },
                        addressToLocations: function(c, a, f, b, h) {
                            var d, q, g, l, t, x, z;
                            c.address && (b = f, f = a, a = c.outFields, h = c.searchExtent, z = c.countryCode, d = c.magicKey, q = c.distance, x = c.categories, c.location && this.normalization && (g = c.location.normalize()), l = c.maxLocations, t = c.forStorage, c = c.address);
                            h && (h = h.shiftCentralMeridian());
                            var r = this.outSpatialReference;
                            c = this._encode(n.mixin({},
                                this._url.query, c, {
                                    f: "json",
                                    outSR: r && m.toJson(r.toJson()),
                                    outFields: a && a.join(",") || null,
                                    searchExtent: h && m.toJson(h.toJson()),
                                    category: x && x.join(",") || null,
                                    countryCode: z || null,
                                    magicKey: d || null,
                                    distance: q || null,
                                    location: g || null,
                                    maxLocations: l || null,
                                    forStorage: t || null
                                }));
                            var u = this._geocodeHandler,
                                E = this._errorHandler,
                                N = new v(k._dfdCanceller);
                            N._pendingDfd = e({
                                url: this._url.path + "/findAddressCandidates",
                                content: c,
                                callbackParamName: "callback",
                                load: function(a, d) {
                                    u(a, d, f, b, N)
                                },
                                error: function(a) {
                                    E(a, b, N)
                                }
                            });
                            return N
                        },
                        suggestLocations: function(c) {
                            var a;
                            a = new v(k._dfdCanceller);
                            c.hasOwnProperty("location") && this.normalization && (c.location = c.location.normalize());
                            c.searchExtent && (c.searchExtent = c.searchExtent.shiftCentralMeridian());
                            c = this._encode(n.mixin({}, this._url.query, {
                                f: "json",
                                text: c.text,
                                maxSuggestions: c.maxSuggestions,
                                searchExtent: c.searchExtent && m.toJson(c.searchExtent.toJson()),
                                category: c.categories && c.categories.join(",") || null,
                                countryCode: c.countryCode || null,
                                location: c.location || null,
                                distance: c.distance ||
                                    null
                            }, {
                                f: "json"
                            }));
                            c = e({
                                url: this._url.path + "/suggest",
                                content: c,
                                callbackParamName: "callback"
                            });
                            a._pendingDfd = c;
                            c.then(n.hitch(this, function(c) {
                                c = c.suggestions || [];
                                this.onSuggestLocationsComplete(c);
                                a.resolve(c)
                            }), n.hitch(this, function(c) {
                                this._errorHandler(c);
                                a.reject(c)
                            }));
                            return a
                        },
                        addressesToLocations: function(c, a, f) {
                            var b = this.outSpatialReference,
                                h = [],
                                d = c.categories,
                                g = c.countryCode;
                            u.forEach(c.addresses, function(a, d) {
                                h.push({
                                    attributes: a
                                })
                            });
                            c = this._encode(n.mixin({}, this._url.query, {
                                category: d &&
                                    d.join(",") || null,
                                sourceCountry: g || null
                            }, {
                                addresses: m.toJson({
                                    records: h
                                })
                            }, {
                                f: "json",
                                outSR: b && m.toJson(b.toJson())
                            }));
                            var w = this._geocodeAddressesHandler,
                                l = this._errorHandler,
                                t = new v(k._dfdCanceller);
                            t._pendingDfd = e({
                                url: this._url.path + "/geocodeAddresses",
                                content: c,
                                callbackParamName: "callback",
                                load: function(d, b) {
                                    w(d, b, a, f, t)
                                },
                                error: function(a) {
                                    l(a, f, t)
                                }
                            });
                            return t
                        },
                        _reverseGeocodeHandler: function(c, a, f, b, h) {
                            try {
                                var d = new x({
                                    address: c.address,
                                    location: c.location,
                                    score: 100
                                });
                                this._successHandler([d],
                                    "onLocationToAddressComplete", f, h)
                            } catch (q) {
                                this._errorHandler(q, b, h)
                            }
                        },
                        locationToAddress: function(c, a, f, b) {
                            c && this.normalization && (c = c.normalize());
                            var h = this.outSpatialReference;
                            c = this._encode(n.mixin({}, this._url.query, {
                                outSR: h && m.toJson(h.toJson()),
                                location: c && m.toJson(c.toJson()),
                                distance: a,
                                f: "json"
                            }));
                            var d = this._reverseGeocodeHandler,
                                g = this._errorHandler,
                                w = new v(k._dfdCanceller);
                            w._pendingDfd = e({
                                url: this._url.path + "/reverseGeocode",
                                content: c,
                                callbackParamName: "callback",
                                load: function(a, c) {
                                    d(a,
                                        c, f, b, w)
                                },
                                error: function(a) {
                                    g(a, b, w)
                                }
                            });
                            return w
                        },
                        onSuggestLocationsComplete: function() {},
                        onAddressToLocationsComplete: function() {},
                        onAddressesToLocationsComplete: function() {},
                        onLocationToAddressComplete: function() {}
                    });
                    l("extend-esri") && n.setObject("tasks.Locator", r, g);
                    return r
                })
        },
        "esri/tasks/AddressCandidate": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../geometry/Point"], function(r, n, u, v, m) {
                r = r(null, {
                    declaredClass: "esri.tasks.AddressCandidate",
                    constructor: function(l) {
                        n.mixin(this,
                            l);
                        this.location = new m(this.location)
                    }
                });
                u("extend-esri") && n.setObject("tasks.AddressCandidate", r, v);
                return r
            })
        },
        "esri/tasks/LegendLayer": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(r, n, u, v) {
                r = r(null, {
                    declaredClass: "esri.tasks.LegendLayer",
                    layerId: null,
                    subLayerIds: null
                });
                u("extend-esri") && n.setObject("tasks.LegendLayer", r, v);
                return r
            })
        },
        "esri/dijit/AttributeInspector": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/sniff dojo/_base/kernel dojo/has dojo/dom-style dojo/dom-construct ../kernel ../lang ../domUtils ../layers/InheritedDomain ../layers/FeatureLayer dojo/i18n!../nls/jsapi dojo/fx dojox/gfx dijit/_Widget dijit/_Templated dijit/Editor dijit/_editor/plugins/LinkDialog dijit/_editor/plugins/TextColor ./_EventedWidget ./editing/AttachmentEditor ./editing/Util ../tasks/query dijit/form/DateTextBox dijit/form/TextBox dijit/form/NumberTextBox dijit/form/FilteringSelect dijit/form/NumberSpinner dijit/form/Button dijit/form/SimpleTextarea dijit/form/ValidationTextBox dijit/form/TimeTextBox dijit/Tooltip dojo/data/ItemFileReadStore dojox/date/islamic dojox/date/islamic/Date dojox/date/islamic/locale dojo/text!./templates/AttributeInspector.html".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C, z, I, S, E, N, K, F, G, A, X, H, D, y, Q, R, O, T, W, U) {
                    var J = r([z, q, w], {
                        declaredClass: "esri.dijit.AttributeInspector",
                        widgetsInTemplate: !0,
                        templateString: U,
                        onUpdate: function() {},
                        onDelete: function() {},
                        onAttributeChange: function() {},
                        onNext: function() {},
                        onReset: function() {},
                        onCancel: function() {},
                        _navMessage: "( ${idx} ${of} ${numFeatures} )",
                        _currentAttributeFieldName: null,
                        _aiConnects: [],
                        _selection: [],
                        _toolTips: [],
                        _numFeatures: 0,
                        _featureIdx: 0,
                        _currentLInfo: null,
                        _currentFeature: null,
                        _rollbackInfo: null,
                        _eventMap: {
                            update: !0,
                            "delete": ["feature"],
                            "attribute-change": ["feature", "fieldName", "fieldValue"],
                            next: ["feature"],
                            reset: !0,
                            cancel: !0
                        },
                        _defaultRichTextPlugins: "bold italic underline foreColor hiliteColor | justifyLeft justifyCenter justifyRight justifyFull | insertOrderedList insertUnorderedList indent outdent | createLink".split(" "),
                        css: {
                            label: "atiLabel",
                            field: "atiField",
                            textArea: "atiTextAreaField",
                            richText: "atiRichTextField",
                            attachmentEditor: "atiAttachmentEditor",
                            red: "atiRequiredField"
                        },
                        constructor: function(a, d) {
                            n.mixin(this, b.widgets.attributeInspector);
                            a = a || {};
                            a.featureLayer || a.layerInfos || console.error("esri.AttributeInspector: please provide correct parameter in the constructor");
                            this._datePackage = this._getDatePackage(a);
                            this._layerInfos = a.layerInfos || [{
                                featureLayer: a.featureLayer,
                                options: a.options || []
                            }];
                            this._layerInfos = u.filter(this._layerInfos, function(a) {
                                return !a.disableAttributeUpdate
                            });
                            this._hideNavButtons = a.hideNavButtons || !1
                        },
                        postCreate: function() {
                            if (u.every(this._layerInfos,
                                    function(a) {
                                        return a.featureLayer.loaded
                                    })) this._initLayerInfos(), this._createAttachmentEditor(), this.onFirstFeature();
                            else {
                                var a = this._layerInfos.length;
                                u.forEach(this._layerInfos, function(d) {
                                    d = d.featureLayer;
                                    if (d.loaded) a--;
                                    else var b = v.connect(d, "onLoad", this, function(d) {
                                        v.disconnect(b);
                                        b = null;
                                        a--;
                                        a || (this._initLayerInfos(), this._createAttachmentEditor(), this.onFirstFeature())
                                    })
                                }, this)
                            }
                        },
                        destroy: function() {
                            this._destroyAttributeTable();
                            u.forEach(this._aiConnects, v.disconnect);
                            delete this._aiConnects;
                            this._attachmentEditor && (this._attachmentEditor.destroy(), delete this._attachmentEditor);
                            delete this._layerInfos;
                            this._selection = this._currentFeature = this._currentLInfo = this._attributes = this._layerInfos = null;
                            this.inherited(arguments)
                        },
                        refresh: function() {
                            this._updateSelection()
                        },
                        first: function() {
                            this.onFirstFeature()
                        },
                        last: function() {
                            this.onLastFeature()
                        },
                        next: function() {
                            this.onNextFeature()
                        },
                        previous: function() {
                            this.onPreviousFeature()
                        },
                        showFeature: function(a, d) {
                            d && (this._createOnlyFirstTime = !0);
                            this._updateSelection([a], d);
                            this._updateUI()
                        },
                        onLayerSelectionChange: function(a, d, b) {
                            this._createOnlyFirstTime = !1;
                            this._featureIdx = b === f.SELECTION_NEW ? 0 : this._featureIdx;
                            this._updateSelection();
                            this._updateUI()
                        },
                        onLayerSelectionClear: function() {
                            !this._selection || 0 >= this._selection.length || (this._featureIdx = this._numFeatures = 0, this._selection = [], this._currentLInfo = this._currentFeature = null, this._updateUI())
                        },
                        onLayerUpdateEnd: function(a, d, b, c) {},
                        onLayerError: function(a, d, b, c) {},
                        onLayerEditsError: function(a,
                            d, b, c) {},
                        onLayerEditsComplete: function(a, d, b, c) {
                            c = c || [];
                            if (c.length) {
                                var f = this._selection,
                                    h = a.featureLayer.objectIdField;
                                u.forEach(c, n.hitch(this, function(a) {
                                    u.some(f, n.hitch(this, function(d, b) {
                                        if (d.attributes[h] !== a.objectId) return !1;
                                        this._selection.splice(b, 1);
                                        return !0
                                    }))
                                }))
                            }
                            d = d || [];
                            d.length && (this._selection = S.findFeatures(d, a.featureLayer), this._featureIdx = 0);
                            c = this._numFeatures = (this._selection = S.sortFeaturesById(this._layerInfos, this._selection)) ? this._selection.length : 0;
                            if (d.length) {
                                if (d =
                                    c ? this._selection[this._featureIdx] : null) c = d.getLayer().getEditCapabilities(), c.canCreate && !c.canUpdate || this._showFeature(d);
                                this._updateUI()
                            }
                            b = b || [];
                            if (b.length) {
                                var e = this._rollbackInfo;
                                u.forEach(b, function(d) {
                                    var c = S.findFeatures(b, a.featureLayer)[0];
                                    if (!d.success && c.attributes[a.featureLayer.objectIdField] === d.objectId && e) {
                                        var f = e.field;
                                        d = e.graphic.attributes[f.name];
                                        var h = u.filter(this._currentLInfo.fieldInfos, function(a) {
                                            return a.fieldName === f.name
                                        }, this)[0].dijit;
                                        c.attributes[f.name] = d;
                                        "esriFieldTypeDate" ===
                                        f.type && (d = new Date(d));
                                        this._setValue(h, d)
                                    }
                                }, this)
                            }
                            this._rollbackInfo = null
                        },
                        onFieldValueChange: function(a, d) {
                            var b = a.field,
                                c = a.dijit,
                                f = this._currentFeature,
                                h = this._currentLInfo,
                                e = b.name;
                            a = this._isFieldRequired(b, a);
                            if ("" === c.displayedValue || "dijit.form.ValidationTextBox" !== c.declaredClass || c.isValid())
                                if ("" !== c.displayedValue && c.displayedValue !== d && c.isValid && !c.isValid()) this._setValue(c, f.attributes[b.name]);
                                else {
                                    var g = !("esriFieldTypeInteger" !== b.type && "esriFieldTypeSmallInteger" !== b.type && "esriFieldTypeSingle" !==
                                        b.type && "esriFieldTypeDouble" !== b.type);
                                    if (a && (null === d || "" === d || "undefined" === typeof d || g && isNaN(d))) {
                                        e = f.attributes[b.name];
                                        if ("esriFieldTypeDate" === b.type && (e = new Date(e), c instanceof Array)) {
                                            this._setValue(c[0], e);
                                            this._setValue(c[1], e);
                                            return
                                        }
                                        this._setValue(c, e)
                                    } else {
                                        if (g) {
                                            if (isNaN(d) || "" === d) d = null;
                                            g && null !== d && (d = Number(d))
                                        }
                                        "esriFieldTypeDate" === b.type && (c instanceof Array ? (d = c[0].getValue(), c = c[1].getValue(), d = d && c ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), c.getHours(), c.getMinutes(),
                                            c.getSeconds(), c.getMilliseconds()) : d || c || null) : (d = c.getValue(), b.domain && (d = Number(d))), d = d && d.getTime ? d.getTime() : d && d.toGregorian ? d.toGregorian().getTime() : d);
                                        if (this._currentFeature.attributes[b.name] !== d) {
                                            if (e === h.typeIdField) {
                                                var q = this._findFirst(h.types, "id", d);
                                                u.forEach(h.fieldInfos, function(a) {
                                                    (b = a.field) && b.name !== h.typeIdField && (a = a.dijit, this._setFieldDomain(a, q, b) && a && (this._setValue(a, f.attributes[b.name] + ""), !1 === a.isValid() && this._setValue(a, null)))
                                                }, this)
                                            }
                                            this.onAttributeChange(f,
                                                e, d)
                                        }
                                    }
                                }
                            else this._setValue(c, f.attributes[b.name])
                        },
                        onDeleteBtn: function(a) {
                            this._deleteFeature()
                        },
                        onNextFeature: function(a) {
                            this._onNextFeature(1)
                        },
                        onPreviousFeature: function(a) {
                            this._onNextFeature(-1)
                        },
                        onFirstFeature: function(a) {
                            this._onNextFeature(-1 * this._featureIdx)
                        },
                        onLastFeature: function(a) {
                            this._onNextFeature(this._numFeatures - 1 - this._featureIdx)
                        },
                        _initLayerInfos: function() {
                            var a = this._layerInfos;
                            this._editorTrackingInfos = {};
                            u.forEach(a, this._initLayerInfo, this)
                        },
                        _initLayerInfo: function(a) {
                            var d =
                                a.featureLayer,
                                b, c;
                            this._userIds = {};
                            c = d.id;
                            d.credential && (this._userIds[c] = d.credential.userId);
                            a.userId && (this._userIds[c] = a.userId);
                            this._connect(d, "onSelectionComplete", n.hitch(this, "onLayerSelectionChange", a));
                            this._connect(d, "onSelectionClear", n.hitch(this, "onLayerSelectionClear", a));
                            this._connect(d, "onEditsComplete", n.hitch(this, "onLayerEditsComplete", a));
                            this._connect(d, "error", n.hitch(this, "onLayerError", a));
                            this._connect(d, "onUpdateEnd", n.hitch(this, "onLayerUpdateEnd", a));
                            a.showAttachments =
                                d.hasAttachments ? x.isDefined(a.showAttachments) ? a.showAttachments : !0 : !1;
                            a.hideFields = a.hideFields || [];
                            a.htmlFields = a.htmlFields || [];
                            a.isEditable = d.isEditable() ? x.isDefined(a.isEditable) ? a.isEditable : !0 : !1;
                            a.typeIdField = d.typeIdField;
                            a.layerId = d.id;
                            a.types = d.types;
                            d.globalIdField && ((b = this._findFirst(a.fieldInfos, "fieldName", d.globalIdField)) || a.showGlobalID || a.hideFields.push(d.globalIdField));
                            (c = this._findFirst(a.fieldInfos, "fieldName", d.objectIdField)) || a.showObjectID || a.hideFields.push(d.objectIdField);
                            var f = this._getFields(a.featureLayer);
                            if (f) {
                                var h = a.fieldInfos || [],
                                    h = u.map(h, function(a) {
                                        return n.mixin({}, a)
                                    });
                                h.length ? a.fieldInfos = u.filter(u.map(h, n.hitch(this, function(d) {
                                    var b = d.stringFieldOption || (this._isInFields(d.fieldName, a.htmlFields) ? J.STRING_FIELD_OPTION_RICHTEXT : J.STRING_FIELD_OPTION_TEXTBOX);
                                    return n.mixin(d, {
                                        field: this._findFirst(f, "name", d.fieldName),
                                        stringFieldOption: b
                                    })
                                })), "return item.field;") : (f = u.filter(f, n.hitch(this, function(d) {
                                        return !this._isInFields(d.name, a.hideFields)
                                    })),
                                    a.fieldInfos = u.map(f, n.hitch(this, function(d) {
                                        var b = this._isInFields(d.name, a.htmlFields) ? J.STRING_FIELD_OPTION_RICHTEXT : J.STRING_FIELD_OPTION_TEXTBOX;
                                        return {
                                            fieldName: d.name,
                                            field: d,
                                            stringFieldOption: b
                                        }
                                    })));
                                a.showGlobalID && !b && h.push(this._findFirst(f, "name", d.globalIdField));
                                a.showObjectID && !c && h.push(this._findFirst(f, "name", d.objectIdField));
                                b = [];
                                d.editFieldsInfo && (d.editFieldsInfo.creatorField && b.push(d.editFieldsInfo.creatorField), d.editFieldsInfo.creationDateField && b.push(d.editFieldsInfo.creationDateField),
                                    d.editFieldsInfo.editorField && b.push(d.editFieldsInfo.editorField), d.editFieldsInfo.editDateField && b.push(d.editFieldsInfo.editDateField));
                                this._editorTrackingInfos[d.id] = b
                            }
                        },
                        _createAttachmentEditor: function() {
                            this._attachmentEditor = null;
                            var a = u.filter(this._layerInfos, function(a) {
                                return a.showAttachments
                            });
                            a && a.length && (this._attachmentEditor = new I({
                                "class": this.css.attachmentEditor
                            }, this.attachmentEditor), this._attachmentEditor.startup())
                        },
                        _setCurrentLInfo: function(a) {
                            var d = this._currentLInfo ? this._currentLInfo.featureLayer :
                                null,
                                b = a.featureLayer;
                            if (d && d.id === b.id && !d.ownershipBasedAccessControlForFeatures && (d = b.getEditCapabilities(), !d.canCreate || d.canUpdate)) return;
                            this._currentLInfo = a;
                            this._createTable()
                        },
                        _updateSelection: function(a, d) {
                            this._selection = a || [];
                            u.forEach(this._layerInfos, this._getSelection, this);
                            this._selection = S.sortFeaturesById(this._layerInfos, this._selection);
                            this._numFeatures = this._selection.length;
                            this._showFeature(this._numFeatures ? this._selection[this._featureIdx] : null, d)
                        },
                        _getSelection: function(a) {
                            a =
                                a.featureLayer.getSelectedFeatures();
                            this._selection = this._selection.concat(a)
                        },
                        _updateUI: function() {
                            var a = this._numFeatures,
                                d = this._currentLInfo;
                            this.layerName.innerHTML = d && 0 !== a ? d.featureLayer ? d.featureLayer.name : "" : this.NLS_noFeaturesSelected;
                            e.set(this.attributeTable, "display", a ? "" : "none");
                            e.set(this.editButtons, "display", a ? "" : "none");
                            e.set(this.navButtons, "display", !this._hideNavButtons && 1 < a ? "" : "none");
                            this.navMessage.innerHTML = x.substitute({
                                    idx: this._featureIdx + 1,
                                    of: this.NLS_of,
                                    numFeatures: this._numFeatures
                                },
                                this._navMessage);
                            this._attachmentEditor && e.set(this._attachmentEditor.domNode, "display", d && d.showAttachments && a ? "" : "none");
                            e.set(this.deleteBtn.domNode, "display", d && !1 === d.showDeleteButton || !this._canDelete ? "none" : "");
                            this.domNode.parentNode && 0 < this.domNode.parentNode.scrollTop && (this.domNode.parentNode.scrollTop = 0)
                        },
                        _onNextFeature: function(a) {
                            this._featureIdx += a;
                            0 > this._featureIdx ? this._featureIdx = this._numFeatures - 1 : this._featureIdx >= this._numFeatures && (this._featureIdx = 0);
                            a = this._selection.length ?
                                this._selection[this._featureIdx] : null;
                            this._showFeature(a);
                            this._updateUI();
                            this.onNext(a)
                        },
                        _deleteFeature: function() {
                            this.onDelete(this._currentFeature)
                        },
                        _showFeature: function(a, d) {
                            if (a) {
                                this._currentFeature = a;
                                d = d ? d : a.getLayer();
                                var b = d.getEditCapabilities({
                                    feature: a,
                                    userId: this._userIds[d.id]
                                });
                                this._canUpdate = b.canUpdate;
                                this._canDelete = b.canDelete;
                                if (b = this._getLInfoFromFeatureLayer(d)) {
                                    this._setCurrentLInfo(b);
                                    var f = a.attributes,
                                        h = this._findFirst(b.types, "id", f[b.typeIdField]),
                                        e = null;
                                    u.forEach(b.fieldInfos,
                                        function(a) {
                                            e = a.field;
                                            var d = [];
                                            a.dijit && 1 < a.dijit.length ? u.forEach(a.dijit, function(a) {
                                                d.push(a)
                                            }) : d.push(a.dijit);
                                            u.forEach(d, n.hitch(this, function(a) {
                                                if (a) {
                                                    var d = this._setFieldDomain(a, h, e),
                                                        b = f[e.name],
                                                        b = b && d && d.codedValues && d.codedValues.length ? d.codedValues[b] ? d.codedValues[b].name : b : b;
                                                    x.isDefined(b) || (b = "");
                                                    "dijit.form.DateTextBox" === a.declaredClass || "dijit.form.TimeTextBox" === a.declaredClass ? b = "" === b ? null : new Date(b) : "dijit.form.FilteringSelect" === a.declaredClass && (a._lastValueReported = null,
                                                        b = f[e.name] + "");
                                                    try {
                                                        this._setValue(a, b), "dijit.form.FilteringSelect" === a.declaredClass && !1 === a.isValid() && this._setValue(a, null)
                                                    } catch (ba) {
                                                        a.set("displayedValue", this.NLS_errorInvalid, !1)
                                                    }
                                                }
                                            }))
                                        }, this);
                                    this._attachmentEditor && b.showAttachments && this._attachmentEditor.showAttachments(this._currentFeature, d);
                                    (a = d.getEditSummary(a)) ? (this.editorTrackingInfoDiv.innerHTML = a, c.show(this.editorTrackingInfoDiv)) : c.hide(this.editorTrackingInfoDiv)
                                }
                            }
                        },
                        _setFieldDomain: function(d, b, c) {
                            if (!d) return null;
                            var f = c.domain;
                            b && b.domains && b.domains[c.name] && !1 === b.domains[c.name] instanceof a && (f = b.domains[c.name]);
                            if (!f) return null;
                            f.codedValues && 0 < f.codedValues.length ? (d.set("store", this._toStore(u.map(f.codedValues, function(a) {
                                return {
                                    id: a.code += "",
                                    name: a.name
                                }
                            }))), this._setValue(d, f.codedValues[0].code)) : (d.constraints = {
                                min: x.isDefined(f.minValue) ? f.minValue : Number.MIN_VALUE,
                                max: x.isDefined(f.maxValue) ? f.maxValue : Number.MAX_VALUE
                            }, this._setValue(d, d.constraints.min));
                            return f
                        },
                        _setValue: function(a, d) {
                            a.set && (a._onChangeActive = !1, a.set("value", d, !0), a._onChangeActive = !0)
                        },
                        _getFields: function(a) {
                            var d = a._getOutFields();
                            if (!d) return null;
                            a = a.fields;
                            return "*" == d ? a : u.filter(u.map(d, n.hitch(this, "_findFirst", a, "name")), x.isDefined)
                        },
                        _isInFields: function(a, d) {
                            return a && (d || d.length) ? u.some(d, function(d) {
                                return d.toLowerCase() === a.toLowerCase()
                            }) : !1
                        },
                        _isFieldNullable: function(a, d) {
                            return !(!1 === a.nullable || d.field && !1 === d.field.nullable)
                        },
                        _isFieldRequired: function(a, d) {
                            return !1 !== a.editable && !1 !== d.isEditable && !this._isFieldNullable(a,
                                d)
                        },
                        _findFirst: function(a, d, b) {
                            return (a = u.filter(a, function(a) {
                                return a.hasOwnProperty(d) && a[d] === b
                            })) && a.length ? a[0] : null
                        },
                        _getLInfoFromFeatureLayer: function(a) {
                            return this._findFirst(this._layerInfos, "layerId", a ? a.id : null)
                        },
                        _createTable: function() {
                            this._destroyAttributeTable();
                            this.attributeTable.innerHTML = "";
                            this._attributes = k.create("table", {
                                cellspacing: "0",
                                cellpadding: "0"
                            }, this.attributeTable);
                            var a = k.create("tbody", null, this._attributes),
                                d = this._currentLInfo,
                                b = this._findFirst(d.types, "id", this._currentFeature.attributes[d.typeIdField]);
                            u.forEach(d.fieldInfos, n.hitch(this, "_createField", b, a), this);
                            this._createOnlyFirstTime = !1
                        },
                        _createField: function(a, d, b) {
                            var c = this._currentLInfo,
                                f = b.field;
                            if (!this._isInFields(f.name, c.hideFields) && !this._isInFields(f.name, this._editorTrackingInfos[c.featureLayer.id])) {
                                var h = !1,
                                    e, g, q;
                                d = k.create("tr", null, d);
                                e = k.create("td", {
                                    innerHTML: b.label || f.alias || f.name,
                                    "class": this.css.label,
                                    "data-fieldname": f.name
                                }, d);
                                this._isFieldRequired(f, b) && k.create("span", {
                                    "class": this.css.red,
                                    innerHTML: " *"
                                }, e);
                                d = k.create("td",
                                    null, d);
                                if (b.customField) k.place(b.customField.domNode || b.customField, k.create("div", null, d), "first"), g = b.customField;
                                else if (!1 === c.isEditable || !1 === f.editable || !1 === b.isEditable || "esriFieldTypeOID" === f.type || "esriFieldTypeGlobalID" === f.type || !this._canUpdate && !this._createOnlyFirstTime) h = !0;
                                c = c.typeIdField && f.name.toLowerCase() == c.typeIdField.toLowerCase();
                                e = !!this._getDomainForField(f, a);
                                !g && c ? g = this._createTypeField(f, b, d) : !g && e && (g = this._createDomainField(f, b, a, d));
                                if (!g) switch (f.type) {
                                    case "esriFieldTypeString":
                                        g =
                                            this._createStringField(f, b, d);
                                        break;
                                    case "esriFieldTypeDate":
                                        g = this._createDateField(f, b, d);
                                        b.format && b.format.time && (q = this._createTimeField(f, b, d));
                                        break;
                                    case "esriFieldTypeInteger":
                                    case "esriFieldTypeSmallInteger":
                                        g = this._createIntField(f, b, d);
                                        break;
                                    case "esriFieldTypeSingle":
                                    case "esriFieldTypeDouble":
                                        g = this._createFltField(f, b, d);
                                        break;
                                    default:
                                        g = this._createStringField(f, b, d)
                                }
                                b.tooltip && b.tooltip.length && this._toolTips.push(new Q({
                                    connectId: [g.id],
                                    label: b.tooltip
                                }));
                                g.onChange = n.hitch(this,
                                    "onFieldValueChange", b);
                                g.set("disabled", h);
                                q ? (b.dijit = [g, q], q.onChange = n.hitch(this, "onFieldValueChange", b), q.set("disabled", h)) : b.dijit = g
                            }
                        },
                        _createTypeField: function(a, d, b) {
                            b = k.create("div", null, b);
                            var c = a.domain;
                            return c && "range" === c.type && c.minValue === c.maxValue ? new D({
                                "class": this.css.field,
                                trim: !0,
                                maxLength: a.length,
                                name: a.alias || a.name,
                                required: this._isFieldRequired(a, d)
                            }, b) : new G({
                                "class": this.css.field,
                                name: a.alias || a.name,
                                required: this._isFieldRequired(a, d),
                                store: this._toStore(u.map(this._currentLInfo.types,
                                    function(a) {
                                        return {
                                            id: a.id,
                                            name: a.name
                                        }
                                    })),
                                searchAttr: "name"
                            }, b)
                        },
                        _getDomainForField: function(d, b) {
                            var c = d.domain;
                            (d = d.name) && b && b.domains && b.domains[d] && !1 === b.domains[d] instanceof a && (c = b.domains[d]);
                            return c || null
                        },
                        _createDomainField: function(a, d, b, c) {
                            b = this._getDomainForField(a, b);
                            c = k.create("div", null, c);
                            return b.codedValues ? new G({
                                "class": this.css.field,
                                name: a.alias || a.name,
                                searchAttr: "name",
                                required: this._isFieldRequired(a, d)
                            }, c) : new A({
                                "class": this.css.field
                            }, c)
                        },
                        _createStringField: function(a,
                            d, b) {
                            b = k.create("div", null, b);
                            var c = {
                                trim: !0,
                                maxLength: a.length,
                                required: this._isFieldRequired(a, d)
                            };
                            if (d.stringFieldOption === J.STRING_FIELD_OPTION_TEXTAREA) return c["class"] = this.css.field + " " + this.css.textArea, new H(c, b);
                            if (d.stringFieldOption === J.STRING_FIELD_OPTION_RICHTEXT) return c["class"] = this.css.field + " " + this.css.richText, c.height = "100%", c.width = "100%", c.plugins = d.richTextPlugins || this._defaultRichTextPlugins, b = new B(c, b), b.startup(), b;
                            var f = this;
                            c.validator = function(b, c) {
                                this._maskValidSubsetError = !1;
                                this._hasBeenBlurred = !0;
                                return f._isFieldNullable(a, d) || !("" === b || null === b)
                            };
                            return new D(c, b)
                        },
                        _createTimeField: function(a, d, b) {
                            b = k.create("div", null, b);
                            a = {
                                "class": this.css.field,
                                trim: !0,
                                required: this._isFieldRequired(a, d),
                                constraints: {
                                    formatLength: "medium"
                                }
                            };
                            this._datePackage && (a.datePackage = this._datePackage);
                            return new y(a, b)
                        },
                        _createDateField: function(a, d, b) {
                            b = k.create("div", null, b);
                            a = {
                                "class": this.css.field,
                                trim: !0,
                                required: this._isFieldRequired(a, d)
                            };
                            this._datePackage && (a.datePackage = this._datePackage);
                            return new N(a, b)
                        },
                        _createIntField: function(a, d, b) {
                            b = k.create("div", null, b);
                            return new F({
                                "class": this.css.field,
                                constraints: "esriFieldTypeSmallInteger" === a.type ? {
                                    min: -32768,
                                    max: 32767,
                                    places: 0
                                } : {
                                    places: 0
                                },
                                trim: !0,
                                invalidMessage: this.NLS_validationInt,
                                required: this._isFieldRequired(a, d)
                            }, b)
                        },
                        _createFltField: function(a, d, b) {
                            b = k.create("div", null, b);
                            return new F({
                                "class": this.css.field,
                                constraints: {
                                    max: Infinity,
                                    min: -Infinity,
                                    places: "0,20"
                                },
                                trim: !0,
                                invalidMessage: this.NLS_validationFlt,
                                required: this._isFieldRequired(a,
                                    d)
                            }, b)
                        },
                        _toStore: function(a) {
                            return new R({
                                data: {
                                    identifier: "id",
                                    label: "name",
                                    items: a
                                }
                            })
                        },
                        _connect: function(a, d, b) {
                            this._aiConnects.push(v.connect(a, d, b))
                        },
                        _getDatePackage: function(a) {
                            return null === a.datePackage ? null : a.datePackage ? a.datePackage : "ar" === l.locale ? "dojox.date.islamic" : null
                        },
                        _destroyAttributeTable: function() {
                            u.forEach(this._layerInfos, function(a) {
                                u.forEach(a.fieldInfos, function(a) {
                                    var d = a.dijit;
                                    if (d) {
                                        d._onChangeHandle = null;
                                        if (a.customField) return;
                                        d instanceof Array ? u.forEach(d, n.hitch(this,
                                            function(a) {
                                                a.destroyRecursive ? a.destroyRecursive() : a.destroy && a.destroy();
                                                a._onChangeHandle = null
                                            })) : d.destroyRecursive ? d.destroyRecursive() : d.destroy && d.destroy()
                                    }
                                    a.dijit = null
                                }, this)
                            }, this);
                            u.forEach(this._toolTips, function(a) {
                                a.destroy()
                            });
                            this._toolTips = [];
                            this._attributes && k.destroy(this._attributes)
                        }
                    });
                    n.mixin(J, {
                        STRING_FIELD_OPTION_RICHTEXT: "richtext",
                        STRING_FIELD_OPTION_TEXTAREA: "textarea",
                        STRING_FIELD_OPTION_TEXTBOX: "textbox"
                    });
                    g("extend-esri") && n.setObject("dijit.AttributeInspector", J, t);
                    return J
                })
        },
        "dijit/Editor": function() {
            define("require dojo/_base/array dojo/_base/declare dojo/Deferred dojo/i18n dojo/dom-attr dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/keys dojo/_base/lang dojo/sniff dojo/string dojo/topic ./_Container ./Toolbar ./ToolbarSeparator ./layout/_LayoutWidget ./form/ToggleButton ./_editor/_Plugin ./_editor/plugins/EnterKeyHandling ./_editor/html ./_editor/range ./_editor/RichText ./main dojo/i18n!./_editor/nls/commands".split(" "), function(r, n, u, v, m, l, g, e,
                k, t, x, c, a, f, b, h, d, q, w, B, M, C, z, I, S) {
                function E(a) {
                    return new B({
                        command: a.name
                    })
                }

                function N(a) {
                    return new B({
                        buttonClass: w,
                        command: a.name
                    })
                }
                u = u("dijit.Editor", I, {
                    plugins: null,
                    extraPlugins: null,
                    constructor: function() {
                        x.isArray(this.plugins) || (this.plugins = ["undo", "redo", "|", "cut", "copy", "paste", "|", "bold", "italic", "underline", "strikethrough", "|", "insertOrderedList", "insertUnorderedList", "indent", "outdent", "|", "justifyLeft", "justifyRight", "justifyCenter", "justifyFull", M]);
                        this._plugins = [];
                        this._editInterval =
                            1E3 * this.editActionInterval;
                        if (c("ie") || c("trident") || c("edge")) this.events.push("onBeforeDeactivate"), this.events.push("onBeforeActivate")
                    },
                    postMixInProperties: function() {
                        this.setValueDeferred = new v;
                        this.inherited(arguments)
                    },
                    postCreate: function() {
                        this.inherited(arguments);
                        this._steps = this._steps.slice(0);
                        this._undoedSteps = this._undoedSteps.slice(0);
                        x.isArray(this.extraPlugins) && (this.plugins = this.plugins.concat(this.extraPlugins));
                        this.commands = m.getLocalization("dijit._editor", "commands", this.lang);
                        c("webkit") && k.set(this.domNode, "KhtmlUserSelect", "none")
                    },
                    startup: function() {
                        this.inherited(arguments);
                        this.toolbar || (this.toolbar = new h({
                            ownerDocument: this.ownerDocument,
                            dir: this.dir,
                            lang: this.lang,
                            "aria-label": this.id
                        }), this.header.appendChild(this.toolbar.domNode));
                        n.forEach(this.plugins, this.addPlugin, this);
                        this.setValueDeferred.resolve(!0);
                        g.add(this.iframe.parentNode, "dijitEditorIFrameContainer");
                        g.add(this.iframe, "dijitEditorIFrame");
                        l.set(this.iframe, "allowTransparency", !0);
                        this.toolbar.startup();
                        this.onNormalizedDisplayChanged()
                    },
                    destroy: function() {
                        n.forEach(this._plugins, function(a) {
                            a && a.destroy && a.destroy()
                        });
                        this._plugins = [];
                        this.toolbar.destroyRecursive();
                        delete this.toolbar;
                        this.inherited(arguments)
                    },
                    addPlugin: function(a, d) {
                        var b = x.isString(a) ? {
                            name: a
                        } : x.isFunction(a) ? {
                            ctor: a
                        } : a;
                        if (!b.setEditor) {
                            var c = {
                                args: b,
                                plugin: null,
                                editor: this
                            };
                            b.name && (B.registry[b.name] ? c.plugin = B.registry[b.name](b) : f.publish(S._scopeName + ".Editor.getPlugin", c));
                            if (!c.plugin) try {
                                var h = b.ctor || x.getObject(b.name) ||
                                    r(b.name);
                                h && (c.plugin = new h(b))
                            } catch (H) {
                                throw Error(this.id + ": cannot find plugin [" + b.name + "]");
                            }
                            if (!c.plugin) throw Error(this.id + ": cannot find plugin [" + b.name + "]");
                            a = c.plugin
                        }
                        1 < arguments.length ? this._plugins[d] = a : this._plugins.push(a);
                        a.setEditor(this);
                        x.isFunction(a.setToolbar) && a.setToolbar(this.toolbar)
                    },
                    resize: function(a) {
                        a && q.prototype.resize.apply(this, arguments)
                    },
                    layout: function() {
                        var a = this._contentBox.h - (this.getHeaderHeight() + this.getFooterHeight() + e.getPadBorderExtents(this.iframe.parentNode).h +
                            e.getMarginExtents(this.iframe.parentNode).h);
                        this.editingArea.style.height = a + "px";
                        this.iframe && (this.iframe.style.height = "100%");
                        this._layoutMode = !0
                    },
                    _onIEMouseDown: function(a) {
                        var d, b = this.document.body,
                            c = b.clientWidth,
                            f = b.clientHeight,
                            h = b.clientLeft,
                            e = b.offsetWidth,
                            g = b.offsetHeight,
                            q = b.offsetLeft;
                        /^rtl$/i.test(b.dir || "") ? c < e && a.x > c && a.x < e && (d = !0) : a.x < h && a.x > q && (d = !0);
                        d || f < g && a.y > f && a.y < g && (d = !0);
                        d || (delete this._cursorToStart, delete this._savedSelection, "BODY" == a.target.tagName && this.defer("placeCursorAtEnd"),
                            this.inherited(arguments))
                    },
                    onBeforeActivate: function() {
                        this._restoreSelection()
                    },
                    onBeforeDeactivate: function(a) {
                        this.customUndo && this.endEditing(!0);
                        "BODY" != a.target.tagName && this._saveSelection()
                    },
                    customUndo: !0,
                    editActionInterval: 3,
                    beginEditing: function(a) {
                        this._inEditing || (this._inEditing = !0, this._beginEditing(a));
                        0 < this.editActionInterval && (this._editTimer && this._editTimer.remove(), this._editTimer = this.defer("endEditing", this._editInterval))
                    },
                    _steps: [],
                    _undoedSteps: [],
                    execCommand: function(a) {
                        if (!this.customUndo ||
                            "undo" != a && "redo" != a) {
                            this.customUndo && (this.endEditing(), this._beginEditing());
                            var d = this.inherited(arguments);
                            this.customUndo && this._endEditing();
                            return d
                        }
                        return this[a]()
                    },
                    _pasteImpl: function() {
                        return this._clipboardCommand("paste")
                    },
                    _cutImpl: function() {
                        return this._clipboardCommand("cut")
                    },
                    _copyImpl: function() {
                        return this._clipboardCommand("copy")
                    },
                    _clipboardCommand: function(d) {
                        var b;
                        try {
                            if (b = this.document.execCommand(d, !1, null), c("webkit") && !b) throw {};
                        } catch (G) {
                            b = a.substitute, alert(b(this.commands.systemShortcut,
                                [this.commands[d], b(this.commands[c("mac") ? "appleKey" : "ctrlKey"], [{
                                    cut: "X",
                                    copy: "C",
                                    paste: "V"
                                } [d]])])), b = !1
                        }
                        return b
                    },
                    queryCommandEnabled: function(a) {
                        return !this.customUndo || "undo" != a && "redo" != a ? this.inherited(arguments) : "undo" == a ? 1 < this._steps.length : 0 < this._undoedSteps.length
                    },
                    _moveToBookmark: function(a) {
                        var d = a.mark,
                            b = a.mark;
                        a = a.isCollapsed;
                        var f, h, e;
                        b && (9 > c("ie") || 9 === c("ie") && c("quirks") ? x.isArray(b) ? (d = [], n.forEach(b, function(a) {
                            d.push(z.getNode(a, this.editNode))
                        }, this), this.selection.moveToBookmark({
                            mark: d,
                            isCollapsed: a
                        })) : b.startContainer && b.endContainer && (e = z.getSelection(this.window)) && e.removeAllRanges && (e.removeAllRanges(), a = z.create(this.window), f = z.getNode(b.startContainer, this.editNode), h = z.getNode(b.endContainer, this.editNode), f && h && (a.setStart(f, b.startOffset), a.setEnd(h, b.endOffset), e.addRange(a))) : (e = z.getSelection(this.window)) && e.removeAllRanges && (e.removeAllRanges(), a = z.create(this.window), f = z.getNode(b.startContainer, this.editNode), h = z.getNode(b.endContainer, this.editNode), f && h && (a.setStart(f,
                            b.startOffset), a.setEnd(h, b.endOffset), e.addRange(a))))
                    },
                    _changeToStep: function(a, d) {
                        this.setValue(d.text);
                        (a = d.bookmark) && this._moveToBookmark(a)
                    },
                    undo: function() {
                        var a = !1;
                        if (!this._undoRedoActive) {
                            this._undoRedoActive = !0;
                            this.endEditing(!0);
                            var d = this._steps.pop();
                            d && 0 < this._steps.length && (this.focus(), this._changeToStep(d, this._steps[this._steps.length - 1]), this._undoedSteps.push(d), this.onDisplayChanged(), delete this._undoRedoActive, a = !0);
                            delete this._undoRedoActive
                        }
                        return a
                    },
                    redo: function() {
                        var a = !1;
                        if (!this._undoRedoActive) {
                            this._undoRedoActive = !0;
                            this.endEditing(!0);
                            var d = this._undoedSteps.pop();
                            d && 0 < this._steps.length && (this.focus(), this._changeToStep(this._steps[this._steps.length - 1], d), this._steps.push(d), this.onDisplayChanged(), a = !0);
                            delete this._undoRedoActive
                        }
                        return a
                    },
                    endEditing: function(a) {
                        this._editTimer && (this._editTimer = this._editTimer.remove());
                        this._inEditing && (this._endEditing(a), this._inEditing = !1)
                    },
                    _getBookmark: function() {
                        var a = this.selection.getBookmark(),
                            d = [];
                        if (a && a.mark) {
                            var b =
                                a.mark;
                            if (9 > c("ie") || 9 === c("ie") && c("quirks")) {
                                var f = z.getSelection(this.window);
                                if (x.isArray(b)) n.forEach(a.mark, function(a) {
                                    d.push(z.getIndex(a, this.editNode).o)
                                }, this), a.mark = d;
                                else if (f) {
                                    var h;
                                    f.rangeCount && (h = f.getRangeAt(0));
                                    a.mark = h ? h.cloneRange() : this.selection.getBookmark()
                                }
                            }
                            try {
                                a.mark && a.mark.startContainer && (d = z.getIndex(a.mark.startContainer, this.editNode).o, a.mark = {
                                    startContainer: d,
                                    startOffset: a.mark.startOffset,
                                    endContainer: a.mark.endContainer === a.mark.startContainer ? d : z.getIndex(a.mark.endContainer,
                                        this.editNode).o,
                                    endOffset: a.mark.endOffset
                                })
                            } catch (H) {
                                a.mark = null
                            }
                        }
                        return a
                    },
                    _beginEditing: function() {
                        0 === this._steps.length && this._steps.push({
                            text: C.getChildrenHtml(this.editNode),
                            bookmark: this._getBookmark()
                        })
                    },
                    _endEditing: function() {
                        var a = C.getChildrenHtml(this.editNode);
                        this._undoedSteps = [];
                        this._steps.push({
                            text: a,
                            bookmark: this._getBookmark()
                        })
                    },
                    onKeyDown: function(a) {
                        c("ie") || this.iframe || a.keyCode != t.TAB || this.tabIndent || this._saveSelection();
                        if (this.customUndo) {
                            var d = a.keyCode;
                            if (a.ctrlKey &&
                                !a.shiftKey && !a.altKey) {
                                if (90 == d || 122 == d) {
                                    a.stopPropagation();
                                    a.preventDefault();
                                    this.undo();
                                    return
                                }
                                if (89 == d || 121 == d) {
                                    a.stopPropagation();
                                    a.preventDefault();
                                    this.redo();
                                    return
                                }
                            }
                            this.inherited(arguments);
                            switch (d) {
                                case t.ENTER:
                                case t.BACKSPACE:
                                case t.DELETE:
                                    this.beginEditing();
                                    break;
                                case 88:
                                case 86:
                                    if (a.ctrlKey && !a.altKey && !a.metaKey) {
                                        this.endEditing();
                                        88 == a.keyCode ? this.beginEditing("cut") : this.beginEditing("paste");
                                        this.defer("endEditing", 1);
                                        break
                                    }
                                    default:
                                        if (!a.ctrlKey && !a.altKey && !a.metaKey && (a.keyCode <
                                                t.F1 || a.keyCode > t.F15)) {
                                            this.beginEditing();
                                            break
                                        }
                                        case t.ALT:
                                            this.endEditing();
                                            break;
                                        case t.UP_ARROW:
                                        case t.DOWN_ARROW:
                                        case t.LEFT_ARROW:
                                        case t.RIGHT_ARROW:
                                        case t.HOME:
                                        case t.END:
                                        case t.PAGE_UP:
                                        case t.PAGE_DOWN:
                                            this.endEditing(!0);
                                        case t.CTRL:
                                        case t.SHIFT:
                                        case t.TAB:
                            }
                        } else this.inherited(arguments)
                    },
                    _onBlur: function() {
                        this.inherited(arguments);
                        this.endEditing(!0)
                    },
                    _saveSelection: function() {
                        try {
                            this._savedSelection = this._getBookmark()
                        } catch (K) {}
                    },
                    _restoreSelection: function() {
                        this._savedSelection &&
                            (delete this._cursorToStart, this.selection.isCollapsed() && this._moveToBookmark(this._savedSelection), delete this._savedSelection)
                    },
                    onClick: function() {
                        this.endEditing(!0);
                        this.inherited(arguments)
                    },
                    replaceValue: function(a) {
                        this.customUndo ? this.isClosed ? this.setValue(a) : (this.beginEditing(), a || (a = "\x26#160;"), this.setValue(a), this.endEditing()) : this.inherited(arguments)
                    },
                    _setDisabledAttr: function(a) {
                        this.setValueDeferred.then(x.hitch(this, function() {
                            !this.disabled && a || !this._buttonEnabledPlugins && a ?
                                n.forEach(this._plugins, function(a) {
                                    a.set("disabled", !0)
                                }) : this.disabled && !a && n.forEach(this._plugins, function(a) {
                                    a.set("disabled", !1)
                                })
                        }));
                        this.inherited(arguments)
                    },
                    _setStateClass: function() {
                        try {
                            this.inherited(arguments), this.document && this.document.body && (k.set(this.document.body, "color", k.get(this.iframe, "color")), k.set(this.document.body, "background-color", k.get(this.iframe, "background-color")))
                        } catch (K) {}
                    }
                });
                x.mixin(B.registry, {
                    undo: E,
                    redo: E,
                    cut: E,
                    copy: E,
                    paste: E,
                    insertOrderedList: E,
                    insertUnorderedList: E,
                    indent: E,
                    outdent: E,
                    justifyCenter: E,
                    justifyFull: E,
                    justifyLeft: E,
                    justifyRight: E,
                    "delete": E,
                    selectAll: E,
                    removeFormat: E,
                    unlink: E,
                    insertHorizontalRule: E,
                    bold: N,
                    italic: N,
                    underline: N,
                    strikethrough: N,
                    subscript: N,
                    superscript: N,
                    "|": function() {
                        return new B({
                            setEditor: function(a) {
                                this.editor = a;
                                this.button = new d({
                                    ownerDocument: a.ownerDocument
                                })
                            }
                        })
                    }
                });
                return u
            })
        },
        "dijit/Toolbar": function() {
            define("require dojo/_base/declare dojo/has dojo/keys dojo/ready ./_Widget ./_KeyNavContainer ./_TemplatedMixin".split(" "),
                function(r, n, u, v, m, l, g, e) {
                    u("dijit-legacy-requires") && m(0, function() {
                        r(["dijit/ToolbarSeparator"])
                    });
                    return n("dijit.Toolbar", [l, e, g], {
                        templateString: '\x3cdiv class\x3d"dijit" role\x3d"toolbar" tabIndex\x3d"${tabIndex}" data-dojo-attach-point\x3d"containerNode"\x3e\x3c/div\x3e',
                        baseClass: "dijitToolbar",
                        _onLeftArrow: function() {
                            this.focusPrev()
                        },
                        _onRightArrow: function() {
                            this.focusNext()
                        }
                    })
                })
        },
        "dijit/ToolbarSeparator": function() {
            define(["dojo/_base/declare", "dojo/dom", "./_Widget", "./_TemplatedMixin"],
                function(r, n, u, v) {
                    return r("dijit.ToolbarSeparator", [u, v], {
                        templateString: '\x3cdiv class\x3d"dijitToolbarSeparator dijitInline" role\x3d"presentation"\x3e\x3c/div\x3e',
                        buildRendering: function() {
                            this.inherited(arguments);
                            n.setSelectable(this.domNode, !1)
                        },
                        isFocusable: function() {
                            return !1
                        }
                    })
                })
        },
        "dijit/_editor/_Plugin": function() {
            define(["dojo/_base/connect", "dojo/_base/declare", "dojo/_base/lang", "../Destroyable", "../form/Button"], function(r, n, u, v, m) {
                n = n("dijit._editor._Plugin", v, {
                    constructor: function(l) {
                        this.params =
                            l || {};
                        u.mixin(this, this.params);
                        this._attrPairNames = {}
                    },
                    editor: null,
                    iconClassPrefix: "dijitEditorIcon",
                    button: null,
                    command: "",
                    useDefaultCommand: !0,
                    buttonClass: m,
                    disabled: !1,
                    getLabel: function(l) {
                        return this.editor.commands[l]
                    },
                    _initButton: function() {
                        if (this.command.length) {
                            var l = this.getLabel(this.command),
                                g = this.editor,
                                e = this.iconClassPrefix + " " + this.iconClassPrefix + this.command.charAt(0).toUpperCase() + this.command.substr(1);
                            this.button || (l = u.mixin({
                                label: l,
                                ownerDocument: g.ownerDocument,
                                dir: g.dir,
                                lang: g.lang,
                                showLabel: !1,
                                iconClass: e,
                                dropDown: this.dropDown,
                                tabIndex: "-1"
                            }, this.params || {}), delete l.name, this.button = new this.buttonClass(l))
                        }
                        this.get("disabled") && this.button && this.button.set("disabled", this.get("disabled"))
                    },
                    destroy: function() {
                        this.dropDown && this.dropDown.destroyRecursive();
                        this.inherited(arguments)
                    },
                    connect: function(l, g, e) {
                        this.own(r.connect(l, g, this, e))
                    },
                    updateState: function() {
                        var l = this.editor,
                            g = this.command,
                            e, k;
                        if (l && l.isLoaded && g.length) {
                            var t = this.get("disabled");
                            if (this.button) try {
                                var m =
                                    l._implCommand(g);
                                k = !t && (this[m] ? this[m](g) : l.queryCommandEnabled(g));
                                this.enabled !== k && (this.enabled = k, this.button.set("disabled", !k));
                                k && "boolean" == typeof this.button.checked && (e = l.queryCommandState(g), this.checked !== e && (this.checked = e, this.button.set("checked", l.queryCommandState(g))))
                            } catch (c) {
                                console.log(c)
                            }
                        }
                    },
                    setEditor: function(l) {
                        this.editor = l;
                        this._initButton();
                        this.button && this.useDefaultCommand && (this.editor.queryCommandAvailable(this.command) ? this.own(this.button.on("click", u.hitch(this.editor,
                            "execCommand", this.command, this.commandArg))) : this.button.domNode.style.display = "none");
                        this.own(this.editor.on("NormalizedDisplayChanged", u.hitch(this, "updateState")))
                    },
                    setToolbar: function(l) {
                        this.button && l.addChild(this.button)
                    },
                    set: function(l, g) {
                        if ("object" === typeof l) {
                            for (var e in l) this.set(e, l[e]);
                            return this
                        }
                        e = this._getAttrNames(l);
                        if (this[e.s]) var k = this[e.s].apply(this, Array.prototype.slice.call(arguments, 1));
                        else this._set(l, g);
                        return k || this
                    },
                    get: function(l) {
                        var g = this._getAttrNames(l);
                        return this[g.g] ? this[g.g]() : this[l]
                    },
                    _setDisabledAttr: function(l) {
                        this._set("disabled", l);
                        this.updateState()
                    },
                    _getAttrNames: function(l) {
                        var g = this._attrPairNames;
                        if (g[l]) return g[l];
                        var e = l.charAt(0).toUpperCase() + l.substr(1);
                        return g[l] = {
                            s: "_set" + e + "Attr",
                            g: "_get" + e + "Attr"
                        }
                    },
                    _set: function(l, g) {
                        this[l] = g
                    }
                });
                n.registry = {};
                return n
            })
        },
        "dijit/_editor/plugins/EnterKeyHandling": function() {
            define("dojo/_base/declare dojo/dom-construct dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/_base/window dojo/window ../_Plugin ../RichText ../range".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x) {
                    return r("dijit._editor.plugins.EnterKeyHandling", k, {
                        blockNodeForEnter: "BR",
                        constructor: function(c) {
                            c && ("blockNodeForEnter" in c && (c.blockNodeForEnter = c.blockNodeForEnter.toUpperCase()), v.mixin(this, c))
                        },
                        setEditor: function(c) {
                            if (this.editor !== c)
                                if (this.editor = c, "BR" == this.blockNodeForEnter) this.editor.customUndo = !0, c.onLoadDeferred.then(v.hitch(this, function(a) {
                                    this.own(m(c.document, "keydown", v.hitch(this, function(a) {
                                        if (a.keyCode == u.ENTER) {
                                            var b = v.mixin({}, a);
                                            b.shiftKey = !0;
                                            this.handleEnterKey(b) || (a.stopPropagation(), a.preventDefault())
                                        }
                                    })));
                                    9 <= l("ie") && 10 >= l("ie") && this.own(m(c.document, "paste", v.hitch(this, function(a) {
                                        setTimeout(v.hitch(this, function() {
                                            var a = this.editor.document.selection.createRange();
                                            a.move("character", -1);
                                            a.select();
                                            a.move("character", 1);
                                            a.select()
                                        }), 0)
                                    })));
                                    return a
                                }));
                                else if (this.blockNodeForEnter) {
                                var a = v.hitch(this, "handleEnterKey");
                                c.addKeyHandler(13, 0, 0, a);
                                c.addKeyHandler(13, 0, 1, a);
                                this.own(this.editor.on("KeyPressed", v.hitch(this, "onKeyPressed")))
                            }
                        },
                        onKeyPressed: function() {
                            if (this._checkListLater) {
                                if (this.editor.selection.isCollapsed()) {
                                    var c = this.editor.selection.getAncestorElement("LI");
                                    if (c) {
                                        l("mozilla") && "LI" == c.parentNode.parentNode.nodeName && (c = c.parentNode.parentNode);
                                        var a = c.firstChild;
                                        !a || 1 != a.nodeType || "UL" != a.nodeName && "OL" != a.nodeName || (c.insertBefore(a.ownerDocument.createTextNode("\u00a0"), a), a = x.create(this.editor.window), a.setStart(c.firstChild, 0), c = x.getSelection(this.editor.window, !0), c.removeAllRanges(), c.addRange(a))
                                    } else t.prototype.execCommand.call(this.editor,
                                        "formatblock", this.blockNodeForEnter), (c = this.editor.selection.getAncestorElement(this.blockNodeForEnter)) ? (c.innerHTML = this.bogusHtmlContent, 9 >= l("ie") && (c = this.editor.document.selection.createRange(), c.move("character", -1), c.select())) : console.error("onKeyPressed: Cannot find the new block node")
                                }
                                this._checkListLater = !1
                            }
                            this._pressedEnterInBlock && (this._pressedEnterInBlock.previousSibling && this.removeTrailingBr(this._pressedEnterInBlock.previousSibling), delete this._pressedEnterInBlock)
                        },
                        bogusHtmlContent: "\x26#160;",
                        blockNodes: /^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,
                        handleEnterKey: function(c) {
                            var a, f, b, h, d = this.editor.document,
                                g, k, m;
                            if (c.shiftKey) {
                                c = this.editor.selection.getParentElement();
                                if (h = x.getAncestor(c, this.blockNodes)) {
                                    if ("LI" == h.tagName) return !0;
                                    c = x.getSelection(this.editor.window);
                                    a = c.getRangeAt(0);
                                    a.collapsed || (a.deleteContents(), c = x.getSelection(this.editor.window), a = c.getRangeAt(0));
                                    if (x.atBeginningOfContainer(h, a.startContainer, a.startOffset)) g = d.createElement("br"), a = x.create(this.editor.window), h.insertBefore(g,
                                        h.firstChild), a.setStartAfter(g), c.removeAllRanges(), c.addRange(a);
                                    else if (x.atEndOfContainer(h, a.startContainer, a.startOffset)) a = x.create(this.editor.window), g = d.createElement("br"), h.appendChild(g), h.appendChild(d.createTextNode("\u00a0")), a.setStart(h.lastChild, 0), c.removeAllRanges(), c.addRange(a);
                                    else return (k = a.startContainer) && 3 == k.nodeType ? (m = k.nodeValue, f = d.createTextNode(m.substring(0, a.startOffset)), b = d.createTextNode(m.substring(a.startOffset)), h = d.createElement("br"), "" == b.nodeValue &&
                                        l("webkit") && (b = d.createTextNode("\u00a0")), n.place(f, k, "after"), n.place(h, f, "after"), n.place(b, h, "after"), n.destroy(k), a = x.create(this.editor.window), a.setStart(b, 0), c.removeAllRanges(), c.addRange(a), !1) : !0
                                } else c = x.getSelection(this.editor.window), c.rangeCount ? (a = c.getRangeAt(0)) && a.startContainer && (a.collapsed || (a.deleteContents(), c = x.getSelection(this.editor.window), a = c.getRangeAt(0)), (k = a.startContainer) && 3 == k.nodeType ? (h = a.startOffset, k.length < h && (b = this._adjustNodeAndOffset(k, h), k = b.node, h =
                                        b.offset), m = k.nodeValue, f = d.createTextNode(m.substring(0, h)), b = d.createTextNode(m.substring(h)), h = d.createElement("br"), b.length || (b = d.createTextNode("\u00a0")), f.length ? n.place(f, k, "after") : f = k, n.place(h, f, "after"), n.place(b, h, "after"), n.destroy(k)) : (0 <= a.startOffset && (g = k.childNodes[a.startOffset]), h = d.createElement("br"), b = d.createTextNode("\u00a0"), g ? (n.place(h, g, "before"), n.place(b, h, "after")) : (k.appendChild(h), k.appendChild(b))), a = x.create(this.editor.window), a.setStart(b, 0), a.setEnd(b, b.length),
                                    c.removeAllRanges(), c.addRange(a), this.editor.selection.collapse(!0)) : t.prototype.execCommand.call(this.editor, "inserthtml", "\x3cbr\x3e");
                                return !1
                            }
                            var r = !0;
                            c = x.getSelection(this.editor.window);
                            a = c.getRangeAt(0);
                            a.collapsed || (a.deleteContents(), c = x.getSelection(this.editor.window), a = c.getRangeAt(0));
                            g = x.getBlockAncestor(a.endContainer, null, this.editor.editNode);
                            var u = g.blockNode;
                            if (this._checkListLater = u && ("LI" == u.nodeName || "LI" == u.parentNode.nodeName)) return l("mozilla") && (this._pressedEnterInBlock =
                                u), /^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(u.innerHTML) && (u.innerHTML = "", l("webkit") && (a = x.create(this.editor.window), a.setStart(u, 0), c.removeAllRanges(), c.addRange(a)), this._checkListLater = !1), !0;
                            if (!g.blockNode || g.blockNode === this.editor.editNode) {
                                try {
                                    t.prototype.execCommand.call(this.editor, "formatblock", this.blockNodeForEnter)
                                } catch (z) {}
                                g = {
                                    blockNode: this.editor.selection.getAncestorElement(this.blockNodeForEnter),
                                    blockContainer: this.editor.editNode
                                };
                                if (g.blockNode) {
                                    if (g.blockNode != this.editor.editNode && !(g.blockNode.textContent || g.blockNode.innerHTML).replace(/^\s+|\s+$/g, "").length) return this.removeTrailingBr(g.blockNode), !1
                                } else g.blockNode = this.editor.editNode;
                                c = x.getSelection(this.editor.window);
                                a = c.getRangeAt(0)
                            }
                            u = d.createElement(this.blockNodeForEnter);
                            u.innerHTML = this.bogusHtmlContent;
                            this.removeTrailingBr(g.blockNode);
                            b = a.endOffset;
                            r = a.endContainer;
                            r.length < b && (b = this._adjustNodeAndOffset(r, b), r =
                                b.node, b = b.offset);
                            if (x.atEndOfContainer(g.blockNode, r, b)) g.blockNode === g.blockContainer ? g.blockNode.appendChild(u) : n.place(u, g.blockNode, "after"), r = !1, a = x.create(this.editor.window), a.setStart(u, 0), c.removeAllRanges(), c.addRange(a), this.editor.height && e.scrollIntoView(u);
                            else if (x.atBeginningOfContainer(g.blockNode, a.startContainer, a.startOffset)) n.place(u, g.blockNode, g.blockNode === g.blockContainer ? "first" : "before"), u.nextSibling && this.editor.height && (a = x.create(this.editor.window), a.setStart(u.nextSibling,
                                0), c.removeAllRanges(), c.addRange(a), e.scrollIntoView(u.nextSibling)), r = !1;
                            else {
                                g.blockNode === g.blockContainer ? g.blockNode.appendChild(u) : n.place(u, g.blockNode, "after");
                                r = !1;
                                g.blockNode.style && u.style && g.blockNode.style.cssText && (u.style.cssText = g.blockNode.style.cssText);
                                if ((k = a.startContainer) && 3 == k.nodeType) {
                                    b = a.endOffset;
                                    k.length < b && (b = this._adjustNodeAndOffset(k, b), k = b.node, b = b.offset);
                                    m = k.nodeValue;
                                    f = d.createTextNode(m.substring(0, b));
                                    b = d.createTextNode(m.substring(b, m.length));
                                    n.place(f, k,
                                        "before");
                                    n.place(b, k, "after");
                                    n.destroy(k);
                                    for (a = f.parentNode; a !== g.blockNode;) {
                                        m = d.createElement(a.tagName);
                                        a.style && m.style && a.style.cssText && (m.style.cssText = a.style.cssText);
                                        "FONT" === a.tagName && (a.color && (m.color = a.color), a.face && (m.face = a.face), a.size && (m.size = a.size));
                                        for (; b;) k = b.nextSibling, m.appendChild(b), b = k;
                                        n.place(m, a, "after");
                                        f = a;
                                        b = m;
                                        a = a.parentNode
                                    }
                                    if (1 == b.nodeType || 3 == b.nodeType && b.nodeValue) u.innerHTML = "";
                                    for (f = b; b;) k = b.nextSibling, u.appendChild(b), b = k
                                }
                                a = x.create(this.editor.window);
                                d = f;
                                if ("BR" !== this.blockNodeForEnter) {
                                    for (; d;) h = d, d = k = d.firstChild;
                                    h && h.parentNode ? (u = h.parentNode, a.setStart(u, 0), c.removeAllRanges(), c.addRange(a), this.editor.height && e.scrollIntoView(u), l("mozilla") && (this._pressedEnterInBlock = g.blockNode)) : r = !0
                                } else a.setStart(u, 0), c.removeAllRanges(), c.addRange(a), this.editor.height && e.scrollIntoView(u), l("mozilla") && (this._pressedEnterInBlock = g.blockNode)
                            }
                            return r
                        },
                        _adjustNodeAndOffset: function(c, a) {
                            for (; c.length < a && c.nextSibling && 3 == c.nextSibling.nodeType;) a -=
                                c.length, c = c.nextSibling;
                            return {
                                node: c,
                                offset: a
                            }
                        },
                        removeTrailingBr: function(c) {
                            if (c = /P|DIV|LI/i.test(c.tagName) ? c : this.editor.selection.getParentOfType(c, ["P", "DIV", "LI"])) c.lastChild && (1 < c.childNodes.length && 3 == c.lastChild.nodeType && /^[\s\xAD]*$/.test(c.lastChild.nodeValue) || "BR" == c.lastChild.tagName) && n.destroy(c.lastChild), c.childNodes.length || (c.innerHTML = this.bogusHtmlContent)
                        }
                    })
                })
        },
        "dijit/_editor/RichText": function() {
            define("dojo/_base/array dojo/_base/config dojo/_base/declare dojo/_base/Deferred dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/query dojo/domReady dojo/sniff dojo/string dojo/topic dojo/_base/unload dojo/_base/url dojo/window ../_Widget ../_CssStateMixin ../selection ./range ./html ../focus ../main".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C, z, I, S, E, N, K, F) {
                    var G = u("dijit._editor.RichText", [z, I], {
                        constructor: function(d) {
                            this.contentPreFilters = [];
                            this.contentPostFilters = [];
                            this.contentDomPreFilters = [];
                            this.contentDomPostFilters = [];
                            this.editingAreaStyleSheets = [];
                            this.events = [].concat(this.events);
                            this._keyHandlers = {};
                            d && a.isString(d.value) && (this.value = d.value);
                            this.onLoadDeferred = new v
                        },
                        baseClass: "dijitEditor",
                        inheritWidth: !1,
                        focusOnLoad: !1,
                        name: "",
                        styleSheets: "",
                        height: "300px",
                        minHeight: "1em",
                        isClosed: !0,
                        isLoaded: !1,
                        _SEPARATOR: "@@**%%__RICHTEXTBOUNDRY__%%**@@",
                        _NAME_CONTENT_SEP: "@@**%%:%%**@@",
                        onLoadDeferred: null,
                        isTabIndent: !1,
                        disableSpellCheck: !1,
                        postCreate: function() {
                            "textarea" === this.domNode.tagName.toLowerCase() && console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
                            this.contentPreFilters = [a.trim, a.hitch(this, "_preFixUrlAttributes")].concat(this.contentPreFilters);
                            d("mozilla") && (this.contentPreFilters = [this._normalizeFontStyle].concat(this.contentPreFilters),
                                this.contentPostFilters = [this._removeMozBogus].concat(this.contentPostFilters));
                            d("webkit") && (this.contentPreFilters = [this._removeWebkitBogus].concat(this.contentPreFilters), this.contentPostFilters = [this._removeWebkitBogus].concat(this.contentPostFilters));
                            if (d("ie") || d("trident")) this.contentPostFilters = [this._normalizeFontStyle].concat(this.contentPostFilters), this.contentDomPostFilters = [a.hitch(this, "_stripBreakerNodes")].concat(this.contentDomPostFilters);
                            this.contentDomPostFilters = [a.hitch(this,
                                "_stripTrailingEmptyNodes")].concat(this.contentDomPostFilters);
                            this.inherited(arguments);
                            w.publish(F._scopeName + "._editor.RichText::init", this)
                        },
                        startup: function() {
                            this.inherited(arguments);
                            this.open();
                            this.setupDefaultShortcuts()
                        },
                        setupDefaultShortcuts: function() {
                            var b = a.hitch(this, function(a, d) {
                                    return function() {
                                        return !this.execCommand(a, d)
                                    }
                                }),
                                c = {
                                    b: b("bold"),
                                    i: b("italic"),
                                    u: b("underline"),
                                    a: b("selectall"),
                                    s: function() {
                                        this.save(!0)
                                    },
                                    m: function() {
                                        this.isTabIndent = !this.isTabIndent
                                    },
                                    1: b("formatblock",
                                        "h1"),
                                    2: b("formatblock", "h2"),
                                    3: b("formatblock", "h3"),
                                    4: b("formatblock", "h4"),
                                    "\\": b("insertunorderedlist")
                                };
                            d("ie") || (c.Z = b("redo"));
                            for (var f in c) this.addKeyHandler(f, !0, !1, c[f])
                        },
                        events: ["onKeyDown", "onKeyUp"],
                        captureEvents: [],
                        _editorCommandsLocalized: !1,
                        _localizeEditorCommands: function() {
                            if (G._editorCommandsLocalized) this._local2NativeFormatNames = G._local2NativeFormatNames, this._native2LocalFormatNames = G._native2LocalFormatNames;
                            else {
                                G._editorCommandsLocalized = !0;
                                G._local2NativeFormatNames = {};
                                G._native2LocalFormatNames = {};
                                this._local2NativeFormatNames = G._local2NativeFormatNames;
                                this._native2LocalFormatNames = G._native2LocalFormatNames;
                                for (var d = "div p pre h1 h2 h3 h4 h5 h6 ol ul address".split(" "), b = "", c, f = 0; c = d[f++];) b = "l" !== c.charAt(1) ? b + ("\x3c" + c + "\x3e\x3cspan\x3econtent\x3c/span\x3e\x3c/" + c + "\x3e\x3cbr/\x3e") : b + ("\x3c" + c + "\x3e\x3cli\x3econtent\x3c/li\x3e\x3c/" + c + "\x3e\x3cbr/\x3e");
                                var h = e.create("div", {
                                    style: {
                                        position: "absolute",
                                        top: "0px",
                                        zIndex: 10,
                                        opacity: .01
                                    },
                                    innerHTML: b
                                });
                                this.ownerDocumentBody.appendChild(h);
                                d = a.hitch(this, function() {
                                    for (var a = h.firstChild; a;) try {
                                        this.selection.selectElement(a.firstChild);
                                        var d = a.tagName.toLowerCase();
                                        this._local2NativeFormatNames[d] = document.queryCommandValue("formatblock");
                                        this._native2LocalFormatNames[this._local2NativeFormatNames[d]] = d;
                                        a = a.nextSibling.nextSibling
                                    } catch (O) {}
                                    e.destroy(h)
                                });
                                this.defer(d)
                            }
                        },
                        open: function(b) {
                            if (!this.onLoadDeferred || 0 <= this.onLoadDeferred.fired) this.onLoadDeferred = new v;
                            this.isClosed || this.close();
                            w.publish(F._scopeName + "._editor.RichText::open",
                                this);
                            1 === arguments.length && b.nodeName && (this.domNode = b);
                            var c = this.domNode,
                                h;
                            if (a.isString(this.value)) h = this.value, c.innerHTML = "";
                            else if (c.nodeName && "textarea" == c.nodeName.toLowerCase()) {
                                var q = this.textarea = c;
                                this.name = q.name;
                                h = q.value;
                                c = this.domNode = this.ownerDocument.createElement("div");
                                c.setAttribute("widgetId", this.id);
                                q.removeAttribute("widgetId");
                                c.cssText = q.cssText;
                                c.className += " " + q.className;
                                e.place(c, q, "before");
                                var k = a.hitch(this, function() {
                                    t.set(q, {
                                        display: "block",
                                        position: "absolute",
                                        top: "-1000px"
                                    });
                                    if (d("ie")) {
                                        var a = q.style;
                                        this.__overflow = a.overflow;
                                        a.overflow = "hidden"
                                    }
                                });
                                d("ie") ? this.defer(k, 10) : k();
                                if (q.form) {
                                    var A = q.value;
                                    this.reset = function() {
                                        this.getValue() !== A && this.replaceValue(A)
                                    };
                                    f(q.form, "submit", a.hitch(this, function() {
                                        l.set(q, "disabled", this.disabled);
                                        q.value = this.getValue()
                                    }))
                                }
                            } else h = N.getChildrenHtml(c), c.innerHTML = "";
                            this.value = h;
                            c.nodeName && "LI" === c.nodeName && (c.innerHTML = " \x3cbr\x3e");
                            this.header = c.ownerDocument.createElement("div");
                            c.appendChild(this.header);
                            this.editingArea = c.ownerDocument.createElement("div");
                            c.appendChild(this.editingArea);
                            this.footer = c.ownerDocument.createElement("div");
                            c.appendChild(this.footer);
                            this.name || (this.name = this.id + "_AUTOGEN");
                            if ("" !== this.name && (!n.useXDomain || n.allowXdRichTextSave)) {
                                if ((h = m.byId(F._scopeName + "._editor.RichText.value")) && "" !== h.value)
                                    for (var k = h.value.split(this._SEPARATOR), z = 0, u; u = k[z++];)
                                        if (u = u.split(this._NAME_CONTENT_SEP), u[0] === this.name) {
                                            this.value = u[1];
                                            k = k.splice(z, 1);
                                            h.value = k.join(this._SEPARATOR);
                                            break
                                        } G._globalSaveHandler || (G._globalSaveHandler = {}, B.addOnUnload(function() {
                                    for (var d in G._globalSaveHandler) {
                                        var b = G._globalSaveHandler[d];
                                        a.isFunction(b) && b()
                                    }
                                }));
                                G._globalSaveHandler[this.id] = a.hitch(this, "_saveContent")
                            }
                            this.isClosed = !1;
                            h = this.editorObject = this.iframe = this.ownerDocument.createElement("iframe");
                            h.id = this.id + "_iframe";
                            h.style.border = "none";
                            h.style.width = "100%";
                            this._layoutMode ? h.style.height = "100%" : 7 <= d("ie") ? (this.height && (h.style.height = this.height), this.minHeight && (h.style.minHeight =
                                this.minHeight)) : h.style.height = this.height ? this.height : this.minHeight;
                            h.frameBorder = 0;
                            h._loadFunc = a.hitch(this, function(a) {
                                this.window = a;
                                this.document = a.document;
                                this.selection = new S.SelectionManager(a);
                                d("ie") && this._localizeEditorCommands();
                                this.onLoad(this.get("value"))
                            });
                            k = this._getIframeDocTxt().replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                            k = 11 > d("ie") ? 'javascript:document.open();try{parent.window;}catch(e){document.domain\x3d"' + document.domain + "\";}document.write('" + k + "');document.close()" : "javascript: '" +
                                k + "'";
                            this.editingArea.appendChild(h);
                            h.src = k;
                            "LI" === c.nodeName && (c.lastChild.style.marginTop = "-1.2em");
                            g.add(this.domNode, this.baseClass)
                        },
                        _local2NativeFormatNames: {},
                        _native2LocalFormatNames: {},
                        _getIframeDocTxt: function() {
                            var c = t.getComputedStyle(this.domNode),
                                f;
                            if (this["aria-label"]) f = this["aria-label"];
                            else {
                                var h = b('label[for\x3d"' + this.id + '"]', this.ownerDocument)[0] || m.byId(this["aria-labelledby"], this.ownerDocument);
                                h && (f = h.textContent || h.innerHTML || "")
                            }
                            var h = "\x3cdiv id\x3d'dijitEditorBody' role\x3d'textbox' aria-multiline\x3d'true' " +
                                (f ? " aria-label\x3d'" + q.escape(f) + "'" : "") + "\x3e\x3c/div\x3e",
                                e = [c.fontWeight, c.fontSize, c.fontFamily].join(" "),
                                g = c.lineHeight,
                                g = 0 <= g.indexOf("px") ? parseFloat(g) / parseFloat(c.fontSize) : 0 <= g.indexOf("em") ? parseFloat(g) : "normal",
                                k = "",
                                l = this;
                            this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig, function(d) {
                                d = d.replace(/^;/ig, "") + ";";
                                var b = d.split(":")[0];
                                if (b) {
                                    var b = a.trim(b),
                                        b = b.toLowerCase(),
                                        c, f = "";
                                    for (c = 0; c < b.length; c++) {
                                        var h = b.charAt(c);
                                        switch (h) {
                                            case "-":
                                                c++, h = b.charAt(c).toUpperCase();
                                            default:
                                                f +=
                                                    h
                                        }
                                    }
                                    t.set(l.domNode, f, "")
                                }
                                k += d + ";"
                            });
                            this.iframe.setAttribute("title", f);
                            return ["\x3c!DOCTYPE html\x3e", "\x3chtml lang\x3d'" + (this.lang || x.locale.replace(/-.*/, "")) + "'" + (this.isLeftToRight() ? "" : " dir\x3d'rtl'") + "\x3e\n", "\x3chead\x3e\n\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html'\x3e\n", f ? "\x3ctitle\x3e" + q.escape(f) + "\x3c/title\x3e" : "", "\x3cstyle\x3e\n\tbody,html {\n\t\tbackground:transparent;\n\t\tpadding: 1px 0 0 0;\n\t\tmargin: -1px 0 0 0;\n\t}\n\tbody,html,#dijitEditorBody { outline: none; }html { height: 100%; width: 100%; overflow: hidden; }\n",
                                this.height ? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n" : "\tbody,#dijitEditorBody { min-height: " + this.minHeight + "; width: 100%; overflow-x: auto; overflow-y: hidden; }\n", "\tbody{\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\tfont:", e, ";\n", this.height || d("opera") ? "" : "\t\tposition: fixed;\n", "\t\tline-height:", g, ";\n\t}\n\tp{ margin: 1em 0; }\n\tli \x3e ul:-moz-first-node, li \x3e ol:-moz-first-node{ padding-top: 1.2em; }\n", d("ie") || d("trident") || d("edge") ? "" : "\tli{ min-height:1.2em; }\n",
                                "\x3c/style\x3e\n", this._applyEditingAreaStyleSheets(), "\n\x3c/head\x3e\n\x3cbody role\x3d'application'", f ? " aria-label\x3d'" + q.escape(f) + "'" : "", "onload\x3d'try{frameElement \x26\x26 frameElement._loadFunc(window,document)}catch(e){document.domain\x3d\"" + document.domain + "\";frameElement._loadFunc(window,document)}' ", "style\x3d'" + k + "'\x3e", h, "\x3c/body\x3e\n\x3c/html\x3e"
                            ].join("")
                        },
                        _applyEditingAreaStyleSheets: function() {
                            var a = [];
                            this.styleSheets && (a = this.styleSheets.split(";"), this.styleSheets =
                                "");
                            a = a.concat(this.editingAreaStyleSheets);
                            this.editingAreaStyleSheets = [];
                            for (var d = "", b = 0, c, f = C.get(this.ownerDocument); c = a[b++];) c = (new M(f.location, c)).toString(), this.editingAreaStyleSheets.push(c), d += '\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"' + c + '"/\x3e';
                            return d
                        },
                        addStyleSheet: function(d) {
                            var b = d.toString(),
                                c = C.get(this.ownerDocument);
                            if ("." === b.charAt(0) || "/" !== b.charAt(0) && !d.host) b = (new M(c.location, b)).toString(); - 1 < r.indexOf(this.editingAreaStyleSheets, b) || (this.editingAreaStyleSheets.push(b),
                                this.onLoadDeferred.then(a.hitch(this, function() {
                                    if (this.document.createStyleSheet) this.document.createStyleSheet(b);
                                    else {
                                        var a = this.document.getElementsByTagName("head")[0],
                                            d = this.document.createElement("link");
                                        d.rel = "stylesheet";
                                        d.type = "text/css";
                                        d.href = b;
                                        a.appendChild(d)
                                    }
                                })))
                        },
                        removeStyleSheet: function(a) {
                            var d = a.toString(),
                                c = C.get(this.ownerDocument);
                            if ("." === d.charAt(0) || "/" !== d.charAt(0) && !a.host) d = (new M(c.location, d)).toString();
                            a = r.indexOf(this.editingAreaStyleSheets, d); - 1 !== a && (delete this.editingAreaStyleSheets[a],
                                b('link[href\x3d"' + d + '"]', this.window.document).orphan())
                        },
                        disabled: !1,
                        _mozSettingProps: {
                            styleWithCSS: !1
                        },
                        _setDisabledAttr: function(a) {
                            a = !!a;
                            this._set("disabled", a);
                            if (this.isLoaded) {
                                var b = d("ie") && (this.isLoaded || !this.focusOnLoad);
                                b && (this.editNode.unselectable = "on");
                                this.editNode.contentEditable = !a;
                                this.editNode.tabIndex = a ? "-1" : this.tabIndex;
                                b && this.defer(function() {
                                    this.editNode && (this.editNode.unselectable = "off")
                                });
                                if (d("mozilla") && !a && this._mozSettingProps) {
                                    a = this._mozSettingProps;
                                    for (var c in a)
                                        if (a.hasOwnProperty(c)) try {
                                            this.document.execCommand(c,
                                                !1, a[c])
                                        } catch (D) {}
                                }
                                this._disabledOK = !0
                            }
                        },
                        onLoad: function(b) {
                            this.window.__registeredWindow || (this.window.__registeredWindow = !0, this._iframeRegHandle = K.registerIframe(this.iframe));
                            this.editNode = this.document.body.firstChild;
                            var c = this;
                            this.beforeIframeNode = e.place("\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e", this.iframe, "before");
                            this.afterIframeNode = e.place("\x3cdiv tabIndex\x3d-1\x3e\x3c/div\x3e", this.iframe, "after");
                            this.iframe.onfocus = this.document.onfocus = function() {
                                c.editNode.focus()
                            };
                            this.focusNode =
                                this.editNode;
                            var g = this.events.concat(this.captureEvents),
                                q = this.iframe ? this.document : this.editNode;
                            this.own.apply(this, r.map(g, function(d) {
                                var b = d.toLowerCase().replace(/^on/, "");
                                return f(q, b, a.hitch(this, d))
                            }, this));
                            this.own(f(q, "mouseup", a.hitch(this, "onClick")));
                            d("ie") && (this.own(f(this.document, "mousedown", a.hitch(this, "_onIEMouseDown"))), this.editNode.style.zoom = 1);
                            d("webkit") && (this._webkitListener = this.own(f(this.document, "mouseup", a.hitch(this, "onDisplayChanged")))[0], this.own(f(this.document,
                                "mousedown", a.hitch(this, function(a) {
                                    a = a.target;
                                    !a || a !== this.document.body && a !== this.document || this.defer("placeCursorAtEnd")
                                }))));
                            if (d("ie")) try {
                                this.document.execCommand("RespectVisibilityInDesign", !0, null)
                            } catch (y) {}
                            this.isLoaded = !0;
                            this.set("disabled", this.disabled);
                            g = a.hitch(this, function() {
                                this.setValue(b);
                                this.onLoadDeferred && !this.onLoadDeferred.isFulfilled() && this.onLoadDeferred.resolve(!0);
                                this.onDisplayChanged();
                                this.focusOnLoad && h(a.hitch(this, "defer", "focus", this.updateInterval));
                                this.value =
                                    this.getValue(!0)
                            });
                            this.setValueDeferred ? this.setValueDeferred.then(g) : g()
                        },
                        onKeyDown: function(a) {
                            if (a.keyCode === c.SHIFT || a.keyCode === c.ALT || a.keyCode === c.META || a.keyCode === c.CTRL) return !0;
                            a.keyCode === c.TAB && this.isTabIndent && (a.stopPropagation(), a.preventDefault(), this.queryCommandEnabled(a.shiftKey ? "outdent" : "indent") && this.execCommand(a.shiftKey ? "outdent" : "indent"));
                            if (a.keyCode == c.TAB && !this.isTabIndent && !a.ctrlKey && !a.altKey) return a.shiftKey ? this.beforeIframeNode.focus() : this.afterIframeNode.focus(),
                                !0;
                            9 > d("ie") && a.keyCode === c.BACKSPACE && "Control" === this.document.selection.type && (a.stopPropagation(), a.preventDefault(), this.execCommand("delete"));
                            d("ff") && (a.keyCode === c.PAGE_UP || a.keyCode === c.PAGE_DOWN) && this.editNode.clientHeight >= this.editNode.scrollHeight && a.preventDefault();
                            var b = this._keyHandlers[a.keyCode],
                                f = arguments;
                            b && !a.altKey && r.some(b, function(d) {
                                if (!(d.shift ^ a.shiftKey || d.ctrl ^ (a.ctrlKey || a.metaKey))) return d.handler.apply(this, f) || a.preventDefault(), !0
                            }, this);
                            this.defer("onKeyPressed",
                                1);
                            return !0
                        },
                        onKeyUp: function() {},
                        setDisabled: function(a) {
                            x.deprecated("dijit.Editor::setDisabled is deprecated", 'use dijit.Editor::attr("disabled",boolean) instead', 2);
                            this.set("disabled", a)
                        },
                        _setValueAttr: function(a) {
                            this.setValue(a)
                        },
                        _setDisableSpellCheckAttr: function(d) {
                            this.document ? l.set(this.document.body, "spellcheck", !d) : this.onLoadDeferred.then(a.hitch(this, function() {
                                l.set(this.document.body, "spellcheck", !d)
                            }));
                            this._set("disableSpellCheck", d)
                        },
                        addKeyHandler: function(d, b, c, f) {
                            "string" ==
                            typeof d && (d = d.toUpperCase().charCodeAt(0));
                            a.isArray(this._keyHandlers[d]) || (this._keyHandlers[d] = []);
                            this._keyHandlers[d].push({
                                shift: c || !1,
                                ctrl: b || !1,
                                handler: f
                            })
                        },
                        onKeyPressed: function() {
                            this.onDisplayChanged()
                        },
                        onClick: function(a) {
                            this.onDisplayChanged(a)
                        },
                        _onIEMouseDown: function() {
                            this.focused || this.disabled || this.focus()
                        },
                        _onBlur: function(a) {
                            (d("ie") || d("trident")) && this.defer(function() {
                                K.curNode || this.ownerDocumentBody.focus()
                            });
                            this.inherited(arguments);
                            var b = this.getValue(!0);
                            if (b !== this.value) this.onChange(b);
                            this._set("value", b)
                        },
                        _onFocus: function(a) {
                            this.disabled || (this._disabledOK || this.set("disabled", !1), this.inherited(arguments))
                        },
                        blur: function() {
                            !d("ie") && this.window.document.documentElement && this.window.document.documentElement.focus ? this.window.document.documentElement.focus() : this.ownerDocumentBody.focus && this.ownerDocumentBody.focus()
                        },
                        focus: function() {
                            this.isLoaded ? 9 > d("ie") ? this.iframe.fireEvent("onfocus", document.createEventObject()) : this.editNode.focus() : this.focusOnLoad = !0
                        },
                        updateInterval: 200,
                        _updateTimer: null,
                        onDisplayChanged: function() {
                            this._updateTimer && this._updateTimer.remove();
                            this._updateTimer = this.defer("onNormalizedDisplayChanged", this.updateInterval)
                        },
                        onNormalizedDisplayChanged: function() {
                            delete this._updateTimer
                        },
                        onChange: function() {},
                        _normalizeCommand: function(a, b) {
                            a = a.toLowerCase();
                            "formatblock" === a ? d("safari") && void 0 === b && (a = "heading") : "hilitecolor" !== a || d("mozilla") || (a = "backcolor");
                            return a
                        },
                        _implCommand: function(a) {
                            return "_" + this._normalizeCommand(a) + "EnabledImpl"
                        },
                        _qcaCache: {},
                        queryCommandAvailable: function(a) {
                            var d = this._qcaCache[a];
                            return void 0 !== d ? d : this._qcaCache[a] = this._queryCommandAvailable(a)
                        },
                        _queryCommandAvailable: function(a) {
                            switch (a.toLowerCase()) {
                                case "bold":
                                case "italic":
                                case "underline":
                                case "subscript":
                                case "superscript":
                                case "fontname":
                                case "fontsize":
                                case "forecolor":
                                case "hilitecolor":
                                case "justifycenter":
                                case "justifyfull":
                                case "justifyleft":
                                case "justifyright":
                                case "delete":
                                case "selectall":
                                case "toggledir":
                                case "createlink":
                                case "unlink":
                                case "removeformat":
                                case "inserthorizontalrule":
                                case "insertimage":
                                case "insertorderedlist":
                                case "insertunorderedlist":
                                case "indent":
                                case "outdent":
                                case "formatblock":
                                case "inserthtml":
                                case "undo":
                                case "redo":
                                case "strikethrough":
                                case "tabindent":
                                case "cut":
                                case "copy":
                                case "paste":
                                    return !0;
                                case "blockdirltr":
                                case "blockdirrtl":
                                case "dirltr":
                                case "dirrtl":
                                case "inlinedirltr":
                                case "inlinedirrtl":
                                    return d("ie") || d("trident") || d("edge");
                                case "inserttable":
                                case "insertcell":
                                case "insertcol":
                                case "insertrow":
                                case "deletecells":
                                case "deletecols":
                                case "deleterows":
                                case "mergecells":
                                case "splitcell":
                                    return !d("webkit");
                                default:
                                    return !1
                            }
                        },
                        execCommand: function(a, b) {
                            var c;
                            this.focused && this.focus();
                            a = this._normalizeCommand(a, b);
                            if (void 0 !== b) {
                                if ("heading" === a) throw Error("unimplemented");
                                "formatblock" ===
                                a && (d("ie") || d("trident")) && (b = "\x3c" + b + "\x3e")
                            }
                            var f = "_" + a + "Impl";
                            if (this[f]) c = this[f](b);
                            else if ((b = 1 < arguments.length ? b : null) || "createlink" !== a) c = this.document.execCommand(a, !1, b);
                            this.onDisplayChanged();
                            return c
                        },
                        queryCommandEnabled: function(a) {
                            if (this.disabled || !this._disabledOK) return !1;
                            a = this._normalizeCommand(a);
                            var d = this._implCommand(a);
                            return this[d] ? this[d](a) : this._browserQueryCommandEnabled(a)
                        },
                        queryCommandState: function(a) {
                            if (this.disabled || !this._disabledOK) return !1;
                            a = this._normalizeCommand(a);
                            try {
                                return this.document.queryCommandState(a)
                            } catch (X) {
                                return !1
                            }
                        },
                        queryCommandValue: function(a) {
                            if (this.disabled || !this._disabledOK) return !1;
                            a = this._normalizeCommand(a);
                            if (d("ie") && "formatblock" === a) a = this._native2LocalFormatNames[this.document.queryCommandValue(a)];
                            else if (d("mozilla") && "hilitecolor" === a) {
                                var b;
                                try {
                                    b = this.document.queryCommandValue("styleWithCSS")
                                } catch (H) {
                                    b = !1
                                }
                                this.document.execCommand("styleWithCSS", !1, !0);
                                a = this.document.queryCommandValue(a);
                                this.document.execCommand("styleWithCSS",
                                    !1, b)
                            } else a = this.document.queryCommandValue(a);
                            return a
                        },
                        _sCall: function(a, d) {
                            return this.selection[a].apply(this.selection, d)
                        },
                        placeCursorAtStart: function() {
                            this.focus();
                            var a = !1;
                            if (d("mozilla"))
                                for (var b = this.editNode.firstChild; b;) {
                                    if (3 === b.nodeType) {
                                        if (0 < b.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                                            a = !0;
                                            this.selection.selectElement(b);
                                            break
                                        }
                                    } else if (1 === b.nodeType) {
                                        var a = !0,
                                            c = b.tagName ? b.tagName.toLowerCase() : "";
                                        /br|input|img|base|meta|area|basefont|hr|link/.test(c) ? this.selection.selectElement(b) :
                                            this.selection.selectElementChildren(b);
                                        break
                                    }
                                    b = b.nextSibling
                                } else a = !0, this.selection.selectElementChildren(this.editNode);
                            a && this.selection.collapse(!0)
                        },
                        placeCursorAtEnd: function() {
                            this.focus();
                            var a = !1;
                            if (d("mozilla"))
                                for (var b = this.editNode.lastChild; b;) {
                                    if (3 === b.nodeType) {
                                        if (0 < b.nodeValue.replace(/^\s+|\s+$/g, "").length) {
                                            a = !0;
                                            this.selection.selectElement(b);
                                            break
                                        }
                                    } else if (1 === b.nodeType) {
                                        a = !0;
                                        this.selection.selectElement(b.lastChild || b);
                                        break
                                    }
                                    b = b.previousSibling
                                } else a = !0, this.selection.selectElementChildren(this.editNode);
                            a && this.selection.collapse(!1)
                        },
                        getValue: function(a) {
                            return !this.textarea || !this.isClosed && this.isLoaded ? this.isLoaded ? this._postFilterContent(null, a) : this.value : this.textarea.value
                        },
                        _getValueAttr: function() {
                            return this.getValue(!0)
                        },
                        setValue: function(d) {
                            if (this.isLoaded) {
                                if (!this.textarea || !this.isClosed && this.isLoaded) {
                                    d = this._preFilterContent(d);
                                    var b = this.isClosed ? this.domNode : this.editNode;
                                    b.innerHTML = d;
                                    this._preDomFilterContent(b)
                                } else this.textarea.value = d;
                                this.onDisplayChanged();
                                this._set("value",
                                    this.getValue(!0))
                            } else this.onLoadDeferred.then(a.hitch(this, function() {
                                this.setValue(d)
                            }))
                        },
                        replaceValue: function(a) {
                            this.isClosed ? this.setValue(a) : this.window && this.window.getSelection && !d("mozilla") ? this.setValue(a) : this.window && this.window.getSelection ? (a = this._preFilterContent(a), this.execCommand("selectall"), this.execCommand("inserthtml", a), this._preDomFilterContent(this.editNode)) : this.document && this.document.selection && this.setValue(a);
                            this._set("value", this.getValue(!0))
                        },
                        _preFilterContent: function(a) {
                            var d =
                                a;
                            r.forEach(this.contentPreFilters, function(a) {
                                a && (d = a(d))
                            });
                            return d
                        },
                        _preDomFilterContent: function(d) {
                            d = d || this.editNode;
                            r.forEach(this.contentDomPreFilters, function(b) {
                                b && a.isFunction(b) && b(d)
                            }, this)
                        },
                        _postFilterContent: function(d, b) {
                            var c;
                            a.isString(d) ? c = d : (d = d || this.editNode, this.contentDomPostFilters.length && (b && (d = a.clone(d)), r.forEach(this.contentDomPostFilters, function(a) {
                                d = a(d)
                            })), c = N.getChildrenHtml(d));
                            a.trim(c.replace(/^\xA0\xA0*/, "").replace(/\xA0\xA0*$/, "")).length || (c = "");
                            r.forEach(this.contentPostFilters,
                                function(a) {
                                    c = a(c)
                                });
                            return c
                        },
                        _saveContent: function() {
                            var a = m.byId(F._scopeName + "._editor.RichText.value");
                            a && (a.value && (a.value += this._SEPARATOR), a.value += this.name + this._NAME_CONTENT_SEP + this.getValue(!0))
                        },
                        escapeXml: function(a, d) {
                            a = a.replace(/&/gm, "\x26amp;").replace(/</gm, "\x26lt;").replace(/>/gm, "\x26gt;").replace(/"/gm, "\x26quot;");
                            d || (a = a.replace(/'/gm, "\x26#39;"));
                            return a
                        },
                        getNodeHtml: function(a) {
                            x.deprecated("dijit.Editor::getNodeHtml is deprecated", "use dijit/_editor/html::getNodeHtml instead",
                                2);
                            return N.getNodeHtml(a)
                        },
                        getNodeChildrenHtml: function(a) {
                            x.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated", "use dijit/_editor/html::getChildrenHtml instead", 2);
                            return N.getChildrenHtml(a)
                        },
                        close: function(a) {
                            if (!this.isClosed) {
                                arguments.length || (a = !0);
                                a && this._set("value", this.getValue(!0));
                                this.interval && clearInterval(this.interval);
                                this._webkitListener && (this._webkitListener.remove(), delete this._webkitListener);
                                d("ie") && (this.iframe.onfocus = null);
                                this.iframe._loadFunc = null;
                                this._iframeRegHandle &&
                                    (this._iframeRegHandle.remove(), delete this._iframeRegHandle);
                                if (this.textarea) {
                                    var b = this.textarea.style;
                                    b.position = "";
                                    b.left = b.top = "";
                                    d("ie") && (b.overflow = this.__overflow, this.__overflow = null);
                                    this.textarea.value = this.value;
                                    e.destroy(this.domNode);
                                    this.domNode = this.textarea
                                } else this.domNode.innerHTML = this.value;
                                delete this.iframe;
                                g.remove(this.domNode, this.baseClass);
                                this.isClosed = !0;
                                this.isLoaded = !1;
                                delete this.editNode;
                                delete this.focusNode;
                                this.window && this.window._frameElement && (this.window._frameElement =
                                    null);
                                this.editorObject = this.editingArea = this.document = this.window = null
                            }
                        },
                        destroy: function() {
                            this.isClosed || this.close(!1);
                            this._updateTimer && this._updateTimer.remove();
                            this.inherited(arguments);
                            G._globalSaveHandler && delete G._globalSaveHandler[this.id]
                        },
                        _removeMozBogus: function(a) {
                            return a.replace(/\stype="_moz"/gi, "").replace(/\s_moz_dirty=""/gi, "").replace(/_moz_resizing="(true|false)"/gi, "")
                        },
                        _removeWebkitBogus: function(a) {
                            a = a.replace(/\sclass="webkit-block-placeholder"/gi, "");
                            a = a.replace(/\sclass="apple-style-span"/gi,
                                "");
                            return a = a.replace(/<meta charset=\"utf-8\" \/>/gi, "")
                        },
                        _normalizeFontStyle: function(a) {
                            return a.replace(/<(\/)?strong([ \>])/gi, "\x3c$1b$2").replace(/<(\/)?em([ \>])/gi, "\x3c$1i$2")
                        },
                        _preFixUrlAttributes: function(a) {
                            return a.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi, "$1$4$2$3$5$2 _djrealurl\x3d$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi, "$1$4$2$3$5$2 _djrealurl\x3d$2$3$5$2")
                        },
                        _browserQueryCommandEnabled: function(a) {
                            if (!a) return !1;
                            if (d("ie") || d("trident") || d("edge")) return this.focused && !this.disabled;
                            var b = 9 > d("ie") ? this.document.selection.createRange() : this.document;
                            try {
                                return b.queryCommandEnabled(a)
                            } catch (H) {
                                return !1
                            }
                        },
                        _createlinkEnabledImpl: function() {
                            var a = !0;
                            return a = d("opera") ? this.window.getSelection().isCollapsed ? !0 : this.document.queryCommandEnabled("createlink") : this._browserQueryCommandEnabled("createlink")
                        },
                        _unlinkEnabledImpl: function() {
                            var a = !0;
                            return a = d("mozilla") || d("webkit") || d("ie") || d("trident") || d("edge") ?
                                this.selection.hasAncestorElement("a") : this._browserQueryCommandEnabled("unlink")
                        },
                        _inserttableEnabledImpl: function() {
                            var a = !0;
                            return a = d("mozilla") || d("webkit") ? !0 : this._browserQueryCommandEnabled("inserttable")
                        },
                        _cutEnabledImpl: function() {
                            var a = !0;
                            d("webkit") ? ((a = this.window.getSelection()) && (a = a.toString()), a = !!a) : a = this._browserQueryCommandEnabled("cut");
                            return a
                        },
                        _copyEnabledImpl: function() {
                            var a = !0;
                            d("webkit") ? ((a = this.window.getSelection()) && (a = a.toString()), a = !!a) : a = this._browserQueryCommandEnabled("copy");
                            return a
                        },
                        _pasteEnabledImpl: function() {
                            var a = !0;
                            return d("webkit") ? !0 : a = this._browserQueryCommandEnabled("paste")
                        },
                        _inserthorizontalruleImpl: function(a) {
                            return d("ie") ? this._inserthtmlImpl("\x3chr\x3e") : this.document.execCommand("inserthorizontalrule", !1, a)
                        },
                        _unlinkImpl: function(a) {
                            return this.queryCommandEnabled("unlink") && (d("mozilla") || d("webkit")) ? (a = this.selection.getAncestorElement("a"), this.selection.selectElement(a), this.document.execCommand("unlink", !1, null)) : this.document.execCommand("unlink",
                                !1, a)
                        },
                        _hilitecolorImpl: function(a) {
                            var b;
                            this._handleTextColorOrProperties("hilitecolor", a) || (d("mozilla") ? (this.document.execCommand("styleWithCSS", !1, !0), console.log("Executing color command."), b = this.document.execCommand("hilitecolor", !1, a), this.document.execCommand("styleWithCSS", !1, !1)) : b = this.document.execCommand("hilitecolor", !1, a));
                            return b
                        },
                        _backcolorImpl: function(a) {
                            d("ie") && (a = a ? a : null);
                            var b = this._handleTextColorOrProperties("backcolor", a);
                            b || (b = this.document.execCommand("backcolor",
                                !1, a));
                            return b
                        },
                        _forecolorImpl: function(a) {
                            d("ie") && (a = a ? a : null);
                            var b = !1;
                            (b = this._handleTextColorOrProperties("forecolor", a)) || (b = this.document.execCommand("forecolor", !1, a));
                            return b
                        },
                        _inserthtmlImpl: function(a) {
                            a = this._preFilterContent(a);
                            var b = !0;
                            if (9 > d("ie")) {
                                var c = this.document.selection.createRange();
                                if ("CONTROL" === this.document.selection.type.toUpperCase()) {
                                    for (var f = c.item(0); c.length;) c.remove(c.item(0));
                                    f.outerHTML = a
                                } else c.pasteHTML(a);
                                c.select()
                            } else if (8 > d("trident")) {
                                var h = E.getSelection(this.window);
                                if (h && h.rangeCount && h.getRangeAt) {
                                    c = h.getRangeAt(0);
                                    c.deleteContents();
                                    var g = e.create("div");
                                    g.innerHTML = a;
                                    for (var q, f = this.document.createDocumentFragment(); a = g.firstChild;) q = f.appendChild(a);
                                    c.insertNode(f);
                                    q && (c = c.cloneRange(), c.setStartAfter(q), c.collapse(!1), h.removeAllRanges(), h.addRange(c))
                                }
                            } else d("mozilla") && !a.length ? this.selection.remove() : b = this.document.execCommand("inserthtml", !1, a);
                            return b
                        },
                        _boldImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(), b = this._adaptIEFormatAreaAndExec("bold");
                            b || (b = this.document.execCommand("bold", !1, a));
                            return b
                        },
                        _italicImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(), b = this._adaptIEFormatAreaAndExec("italic");
                            b || (b = this.document.execCommand("italic", !1, a));
                            return b
                        },
                        _underlineImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(), b = this._adaptIEFormatAreaAndExec("underline");
                            b || (b = this.document.execCommand("underline", !1, a));
                            return b
                        },
                        _strikethroughImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(),
                                b = this._adaptIEFormatAreaAndExec("strikethrough");
                            b || (b = this.document.execCommand("strikethrough", !1, a));
                            return b
                        },
                        _superscriptImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(), b = this._adaptIEFormatAreaAndExec("superscript");
                            b || (b = this.document.execCommand("superscript", !1, a));
                            return b
                        },
                        _subscriptImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident")) this._adaptIESelection(), b = this._adaptIEFormatAreaAndExec("subscript");
                            b || (b = this.document.execCommand("subscript", !1, a));
                            return b
                        },
                        _fontnameImpl: function(a) {
                            var b;
                            if (d("ie") || d("trident")) b = this._handleTextColorOrProperties("fontname", a);
                            b || (b = this.document.execCommand("fontname", !1, a));
                            return b
                        },
                        _fontsizeImpl: function(a) {
                            var b;
                            if (d("ie") || d("trident")) b = this._handleTextColorOrProperties("fontsize", a);
                            b || (b = this.document.execCommand("fontsize", !1, a));
                            return b
                        },
                        _insertorderedlistImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident") || d("edge")) b = this._adaptIEList("insertorderedlist", a);
                            b || (b = this.document.execCommand("insertorderedlist",
                                !1, a));
                            return b
                        },
                        _insertunorderedlistImpl: function(a) {
                            var b = !1;
                            if (d("ie") || d("trident") || d("edge")) b = this._adaptIEList("insertunorderedlist", a);
                            b || (b = this.document.execCommand("insertunorderedlist", !1, a));
                            return b
                        },
                        getHeaderHeight: function() {
                            return this._getNodeChildrenHeight(this.header)
                        },
                        getFooterHeight: function() {
                            return this._getNodeChildrenHeight(this.footer)
                        },
                        _getNodeChildrenHeight: function(a) {
                            var d = 0;
                            if (a && a.childNodes) {
                                var b;
                                for (b = 0; b < a.childNodes.length; b++) var c = k.position(a.childNodes[b]),
                                    d = d + c.h
                            }
                            return d
                        },
                        _isNodeEmpty: function(a, d) {
                            return 1 === a.nodeType ? 0 < a.childNodes.length ? this._isNodeEmpty(a.childNodes[0], d) : !0 : 3 === a.nodeType ? "" === a.nodeValue.substring(d) : !1
                        },
                        _removeStartingRangeFromRange: function(a, d) {
                            if (a.nextSibling) d.setStart(a.nextSibling, 0);
                            else {
                                for (a = a.parentNode; a && null == a.nextSibling;) a = a.parentNode;
                                a && d.setStart(a.nextSibling, 0)
                            }
                            return d
                        },
                        _adaptIESelection: function() {
                            var a = E.getSelection(this.window);
                            if (a && a.rangeCount && !a.isCollapsed) {
                                for (var d = a.getRangeAt(0), b = d.startContainer,
                                        c = d.startOffset; 3 === b.nodeType && c >= b.length && b.nextSibling;) c -= b.length, b = b.nextSibling;
                                for (var f = null; this._isNodeEmpty(b, c) && b !== f;) f = b, d = this._removeStartingRangeFromRange(b, d), b = d.startContainer, c = 0;
                                a.removeAllRanges();
                                a.addRange(d)
                            }
                        },
                        _adaptIEFormatAreaAndExec: function(a) {
                            var d = E.getSelection(this.window),
                                b = this.document,
                                c, f, h, g, q, k, l;
                            if (a && d && d.isCollapsed) {
                                if (this.queryCommandValue(a)) {
                                    a = this._tagNamesForCommand(a);
                                    h = d.getRangeAt(0);
                                    g = h.startContainer;
                                    3 === g.nodeType && (f = h.endOffset, g.length <
                                        f && (f = this._adjustNodeAndOffset(c, f), g = f.node, f = f.offset));
                                    for (; g && g !== this.editNode;) {
                                        c = g.tagName ? g.tagName.toLowerCase() : "";
                                        if (-1 < r.indexOf(a, c)) {
                                            l = g;
                                            break
                                        }
                                        g = g.parentNode
                                    }
                                    if (l && (c = h.startContainer, a = b.createElement(l.tagName), e.place(a, l, "after"), c && 3 === c.nodeType)) {
                                        f = h.endOffset;
                                        c.length < f && (f = this._adjustNodeAndOffset(c, f), c = f.node, f = f.offset);
                                        g = c.nodeValue;
                                        h = b.createTextNode(g.substring(0, f));
                                        var t = g.substring(f, g.length);
                                        t && (q = b.createTextNode(t));
                                        e.place(h, c, "before");
                                        q && (k = b.createElement("span"),
                                            k.className = "ieFormatBreakerSpan", e.place(k, c, "after"), e.place(q, k, "after"), q = k);
                                        e.destroy(c);
                                        f = h.parentNode;
                                        for (c = []; f !== l;) {
                                            g = f.tagName;
                                            h = {
                                                tagName: g
                                            };
                                            c.push(h);
                                            g = b.createElement(g);
                                            f.style && g.style && f.style.cssText && (g.style.cssText = f.style.cssText, h.cssText = f.style.cssText);
                                            "FONT" === f.tagName && (f.color && (g.color = f.color, h.color = f.color), f.face && (g.face = f.face, h.face = f.face), f.size && (g.size = f.size, h.size = f.size));
                                            f.className && (g.className = f.className, h.className = f.className);
                                            if (q)
                                                for (; q;) h = q.nextSibling,
                                                    g.appendChild(q), q = h;
                                            g.tagName == f.tagName ? (k = b.createElement("span"), k.className = "ieFormatBreakerSpan", e.place(k, f, "after"), e.place(g, k, "after")) : e.place(g, f, "after");
                                            h = f;
                                            q = g;
                                            f = f.parentNode
                                        }
                                        if (q) {
                                            if (1 === q.nodeType || 3 === q.nodeType && q.nodeValue) a.innerHTML = "";
                                            for (; q;) h = q.nextSibling, a.appendChild(q), q = h
                                        }
                                        if (c.length) {
                                            h = c.pop();
                                            q = b.createElement(h.tagName);
                                            h.cssText && q.style && (q.style.cssText = h.cssText);
                                            h.className && (q.className = h.className);
                                            "FONT" === h.tagName && (h.color && (q.color = h.color), h.face && (q.face =
                                                h.face), h.size && (q.size = h.size));
                                            for (e.place(q, a, "before"); c.length;) h = c.pop(), l = b.createElement(h.tagName), h.cssText && l.style && (l.style.cssText = h.cssText), h.className && (l.className = h.className), "FONT" === h.tagName && (h.color && (l.color = h.color), h.face && (l.face = h.face), h.size && (l.size = h.size)), q.appendChild(l), q = l;
                                            l = b.createTextNode(".");
                                            k.appendChild(l);
                                            q.appendChild(l)
                                        } else k = b.createElement("span"), k.className = "ieFormatBreakerSpan", l = b.createTextNode("."), k.appendChild(l), e.place(k, a, "before");
                                        q =
                                            E.create(this.window);
                                        q.setStart(l, 0);
                                        q.setEnd(l, l.length);
                                        d.removeAllRanges();
                                        d.addRange(q);
                                        this.selection.collapse(!1);
                                        l.parentNode.innerHTML = "";
                                        a.firstChild || e.destroy(a);
                                        return !0
                                    }
                                    return !1
                                }
                                h = d.getRangeAt(0);
                                if ((c = h.startContainer) && 3 === c.nodeType) return f = h.startOffset, c.length < f && (f = this._adjustNodeAndOffset(c, f), c = f.node, f = f.offset), g = c.nodeValue, h = b.createTextNode(g.substring(0, f)), t = g.substring(f), "" !== t && (q = b.createTextNode(g.substring(f))), k = b.createElement("span"), l = b.createTextNode("."),
                                    k.appendChild(l), h.length ? e.place(h, c, "after") : h = c, e.place(k, h, "after"), q && e.place(q, k, "after"), e.destroy(c), q = E.create(this.window), q.setStart(l, 0), q.setEnd(l, l.length), d.removeAllRanges(), d.addRange(q), b.execCommand(a), e.place(k.firstChild, k, "before"), e.destroy(k), q.setStart(l, 0), q.setEnd(l, l.length), d.removeAllRanges(), d.addRange(q), this.selection.collapse(!1), l.parentNode.innerHTML = "", !0
                            } else return !1
                        },
                        _adaptIEList: function(a) {
                            var d = E.getSelection(this.window);
                            if (d.isCollapsed && d.rangeCount &&
                                !this.queryCommandValue(a)) {
                                var b = d.getRangeAt(0),
                                    c = b.startContainer;
                                if (c && 3 == c.nodeType && !b.startOffset) return b = "ul", "insertorderedlist" === a && (b = "ol"), a = this.document.createElement(b), b = e.create("li", null, a), e.place(a, c, "before"), b.appendChild(c), e.create("br", null, a, "after"), a = E.create(this.window), a.setStart(c, 0), a.setEnd(c, c.length), d.removeAllRanges(), d.addRange(a), this.selection.collapse(!0), !0
                            }
                            return !1
                        },
                        _handleTextColorOrProperties: function(a, b) {
                            var c = E.getSelection(this.window),
                                f = this.document,
                                h, g, q, k, l;
                            b = b || null;
                            if (a && c && c.isCollapsed && c.rangeCount && (g = c.getRangeAt(0), (h = g.startContainer) && 3 === h.nodeType)) {
                                l = g.startOffset;
                                h.length < l && (g = this._adjustNodeAndOffset(h, l), h = g.node, l = g.offset);
                                q = h.nodeValue;
                                g = f.createTextNode(q.substring(0, l));
                                "" !== q.substring(l) && (k = f.createTextNode(q.substring(l)));
                                q = f.createElement("span");
                                l = f.createTextNode(".");
                                q.appendChild(l);
                                f = f.createElement("span");
                                q.appendChild(f);
                                g.length ? e.place(g, h, "after") : g = h;
                                e.place(q, g, "after");
                                k && e.place(k, q, "after");
                                e.destroy(h);
                                h = E.create(this.window);
                                h.setStart(l, 0);
                                h.setEnd(l, l.length);
                                c.removeAllRanges();
                                c.addRange(h);
                                if (d("webkit")) {
                                    c = "color";
                                    if ("hilitecolor" === a || "backcolor" === a) c = "backgroundColor";
                                    t.set(q, c, b);
                                    this.selection.remove();
                                    e.destroy(f);
                                    q.innerHTML = "\x26#160;";
                                    this.selection.selectElement(q);
                                    this.focus()
                                } else this.execCommand(a, b), e.place(q.firstChild, q, "before"), e.destroy(q), h.setStart(l, 0), h.setEnd(l, l.length), c.removeAllRanges(), c.addRange(h), this.selection.collapse(!1), l.parentNode.removeChild(l);
                                return !0
                            }
                            return !1
                        },
                        _adjustNodeAndOffset: function(a, d) {
                            for (; a.length < d && a.nextSibling && 3 === a.nextSibling.nodeType;) d -= a.length, a = a.nextSibling;
                            return {
                                node: a,
                                offset: d
                            }
                        },
                        _tagNamesForCommand: function(a) {
                            return "bold" === a ? ["b", "strong"] : "italic" === a ? ["i", "em"] : "strikethrough" === a ? ["s", "strike"] : "superscript" === a ? ["sup"] : "subscript" === a ? ["sub"] : "underline" === a ? ["u"] : []
                        },
                        _stripBreakerNodes: function(a) {
                            if (this.isLoaded) return b(".ieFormatBreakerSpan", a).forEach(function(a) {
                                for (; a.firstChild;) e.place(a.firstChild, a, "before");
                                e.destroy(a)
                            }), a
                        },
                        _stripTrailingEmptyNodes: function(a) {
                            function d(a) {
                                return /^(p|div|br)$/i.test(a.nodeName) && 0 == a.children.length && /^[\s\xA0]*$/.test(a.textContent || a.innerText || "") || 3 === a.nodeType && /^[\s\xA0]*$/.test(a.nodeValue)
                            }
                            for (; a.lastChild && d(a.lastChild);) e.destroy(a.lastChild);
                            return a
                        },
                        _setTextDirAttr: function(d) {
                            this._set("textDir", d);
                            this.onLoadDeferred.then(a.hitch(this, function() {
                                this.editNode.dir = d
                            }))
                        }
                    });
                    return G
                })
        },
        "dijit/_editor/range": function() {
            define(["dojo/_base/array", "dojo/_base/declare",
                "dojo/_base/lang"
            ], function(r, n, u) {
                var v = {
                    getIndex: function(g, e) {
                        for (var k = [], l = [], m = g, c, a; g != e;) {
                            var f = 0;
                            for (c = g.parentNode; a = c.childNodes[f++];)
                                if (a === g) {
                                    --f;
                                    break
                                } k.unshift(f);
                            l.unshift(f - c.childNodes.length);
                            g = c
                        }
                        if (0 < k.length && 3 == m.nodeType) {
                            for (a = m.previousSibling; a && 3 == a.nodeType;) k[k.length - 1]--, a = a.previousSibling;
                            for (a = m.nextSibling; a && 3 == a.nodeType;) l[l.length - 1]++, a = a.nextSibling
                        }
                        return {
                            o: k,
                            r: l
                        }
                    },
                    getNode: function(g, e) {
                        if (!u.isArray(g) || 0 == g.length) return e;
                        var k = e;
                        r.every(g, function(e) {
                            if (0 <=
                                e && e < k.childNodes.length) k = k.childNodes[e];
                            else return k = null, !1;
                            return !0
                        });
                        return k
                    },
                    getCommonAncestor: function(g, e, k) {
                        k = k || g.ownerDocument.body;
                        var l = function(a) {
                            for (var c = []; a;)
                                if (c.unshift(a), a !== k) a = a.parentNode;
                                else break;
                            return c
                        };
                        g = l(g);
                        e = l(e);
                        for (var l = Math.min(g.length, e.length), m = g[0], c = 1; c < l; c++)
                            if (g[c] === e[c]) m = g[c];
                            else break;
                        return m
                    },
                    getAncestor: function(g, e, k) {
                        for (k = k || g.ownerDocument.body; g && g !== k;) {
                            var l = g.nodeName.toUpperCase();
                            if (e.test(l)) return g;
                            g = g.parentNode
                        }
                        return null
                    },
                    BlockTagNames: /^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,
                    getBlockAncestor: function(g, e, k) {
                        k = k || g.ownerDocument.body;
                        e = e || v.BlockTagNames;
                        for (var l = null, m; g && g !== k;) {
                            var c = g.nodeName.toUpperCase();
                            !l && e.test(c) && (l = g);
                            !m && /^(?:BODY|TD|TH|CAPTION)$/.test(c) && (m = g);
                            g = g.parentNode
                        }
                        return {
                            blockNode: l,
                            blockContainer: m || g.ownerDocument.body
                        }
                    },
                    atBeginningOfContainer: function(g, e, k) {
                        var l = !1,
                            m = 0 == k;
                        m || 3 != e.nodeType || /^[\s\xA0]+$/.test(e.nodeValue.substr(0, k)) && (m = !0);
                        if (m)
                            for (l = !0; e && e !== g;) {
                                if (e.previousSibling) {
                                    l = !1;
                                    break
                                }
                                e = e.parentNode
                            }
                        return l
                    },
                    atEndOfContainer: function(g, e, k) {
                        var l = !1,
                            m = k == (e.length || e.childNodes.length);
                        m || 3 != e.nodeType || /^[\s\xA0]+$/.test(e.nodeValue.substr(k)) && (m = !0);
                        if (m)
                            for (l = !0; e && e !== g;) {
                                if (e.nextSibling) {
                                    l = !1;
                                    break
                                }
                                e = e.parentNode
                            }
                        return l
                    },
                    adjacentNoneTextNode: function(g, e) {
                        var k = g;
                        g = 0 - g.length || 0;
                        for (e = e ? "nextSibling" : "previousSibling"; k && 3 == k.nodeType;) g += k.length, k = k[e];
                        return [k, g]
                    },
                    create: function(g) {
                        g = g || window;
                        return g.getSelection ? g.document.createRange() : new l
                    },
                    getSelection: function(g,
                        e) {
                        if (g.getSelection) return g.getSelection();
                        g = new m.selection(g);
                        e || g._getCurrentSelection();
                        return g
                    }
                };
                if (!window.getSelection) var m = v.ie = {
                        cachedSelection: {},
                        selection: function(g) {
                            this._ranges = [];
                            this.addRange = function(e, g) {
                                this._ranges.push(e);
                                g || e._select();
                                this.rangeCount = this._ranges.length
                            };
                            this.removeAllRanges = function() {
                                this._ranges = [];
                                this.rangeCount = 0
                            };
                            this.getRangeAt = function(e) {
                                return this._ranges[e]
                            };
                            this._getCurrentSelection = function() {
                                this.removeAllRanges();
                                var e;
                                e = g.document.selection.createRange();
                                e = "CONTROL" == g.document.selection.type.toUpperCase() ? new l(m.decomposeControlRange(e)) : new l(m.decomposeTextRange(e));
                                this.addRange(e, !0), this.isCollapsed = e.collapsed
                            }
                        },
                        decomposeControlRange: function(g) {
                            var e = g.item(0),
                                k = g.item(g.length - 1);
                            g = e.parentNode;
                            var l = k.parentNode,
                                e = v.getIndex(e, g).o[0],
                                k = v.getIndex(k, l).o[0] + 1;
                            return [g, e, l, k]
                        },
                        getEndPoint: function(g, e) {
                            var k = g.duplicate();
                            k.collapse(!e);
                            var l = "EndTo" + (e ? "End" : "Start"),
                                m = k.parentElement(),
                                c, a, f;
                            0 < m.childNodes.length ? r.every(m.childNodes,
                                function(b, h) {
                                    var d;
                                    if (3 != b.nodeType)
                                        if (k.moveToElementText(b), 0 < k.compareEndPoints(l, g))
                                            if (f && 3 == f.nodeType) c = f, d = !0;
                                            else return c = m, a = h, !1;
                                    else {
                                        if (h == m.childNodes.length - 1) return c = m, a = m.childNodes.length, !1
                                    } else h == m.childNodes.length - 1 && (c = b, d = !0);
                                    if (d && c) return c = (b = v.adjacentNoneTextNode(c)[0]) ? b.nextSibling : m.firstChild, h = v.adjacentNoneTextNode(c), b = h[0], h = h[1], b ? (k.moveToElementText(b), k.collapse(!1)) : k.moveToElementText(m), k.setEndPoint(l, g), a = k.text.length - h, !1;
                                    f = b;
                                    return !0
                                }) : (c = m, a = 0);
                            e || 1 != c.nodeType || a != c.childNodes.length || (e = c.nextSibling) && 3 == e.nodeType && (c = e, a = 0);
                            return [c, a]
                        },
                        setEndPoint: function(g, e, k) {
                            g = g.duplicate();
                            var l;
                            if (3 != e.nodeType)
                                if (0 < k) {
                                    if (l = e.childNodes[k - 1])
                                        if (3 == l.nodeType) e = l, k = l.length;
                                        else if (l.nextSibling && 3 == l.nextSibling.nodeType) e = l.nextSibling, k = 0;
                                    else {
                                        g.moveToElementText(l.nextSibling ? l : e);
                                        var m = l.parentNode;
                                        l = m.insertBefore(l.ownerDocument.createTextNode(" "), l.nextSibling);
                                        g.collapse(!1);
                                        m.removeChild(l)
                                    }
                                } else g.moveToElementText(e), g.collapse(!0);
                            3 == e.nodeType && (l = v.adjacentNoneTextNode(e), m = l[0], l = l[1], m ? (g.moveToElementText(m), g.collapse(!1), "inherit" != m.contentEditable && l++) : (g.moveToElementText(e.parentNode), g.collapse(!0), g.move("character", 1), g.move("character", -1)), k += l, 0 < k && g.move("character", k) != k && console.error("Error when moving!"));
                            return g
                        },
                        decomposeTextRange: function(g) {
                            var e = m.getEndPoint(g),
                                k = e[0],
                                l = e[1],
                                n = e[0],
                                e = e[1];
                            g.htmlText.length && (g.htmlText == g.text ? e = l + g.text.length : (e = m.getEndPoint(g, !0), n = e[0], e = e[1]));
                            return [k, l,
                                n, e
                            ]
                        },
                        setRange: function(g, e, k, l, n, c) {
                            e = m.setEndPoint(g, e, k);
                            g.setEndPoint("StartToStart", e);
                            if (!c) var a = m.setEndPoint(g, l, n);
                            g.setEndPoint("EndToEnd", a || e);
                            return g
                        }
                    },
                    l = v.W3CRange = n(null, {
                        constructor: function() {
                            0 < arguments.length ? (this.setStart(arguments[0][0], arguments[0][1]), this.setEnd(arguments[0][2], arguments[0][3])) : (this.startContainer = this.commonAncestorContainer = null, this.startOffset = 0, this.endContainer = null, this.endOffset = 0, this.collapsed = !0)
                        },
                        _updateInternal: function() {
                            this.commonAncestorContainer =
                                this.startContainer !== this.endContainer ? v.getCommonAncestor(this.startContainer, this.endContainer) : this.startContainer;
                            this.collapsed = this.startContainer === this.endContainer && this.startOffset == this.endOffset
                        },
                        setStart: function(g, e) {
                            e = parseInt(e);
                            if (this.startContainer !== g || this.startOffset != e) delete this._cachedBookmark, this.startContainer = g, this.startOffset = e, this.endContainer ? this._updateInternal() : this.setEnd(g, e)
                        },
                        setEnd: function(g, e) {
                            e = parseInt(e);
                            if (this.endContainer !== g || this.endOffset != e) delete this._cachedBookmark,
                                this.endContainer = g, this.endOffset = e, this.startContainer ? this._updateInternal() : this.setStart(g, e)
                        },
                        setStartAfter: function(g, e) {
                            this._setPoint("setStart", g, e, 1)
                        },
                        setStartBefore: function(g, e) {
                            this._setPoint("setStart", g, e, 0)
                        },
                        setEndAfter: function(g, e) {
                            this._setPoint("setEnd", g, e, 1)
                        },
                        setEndBefore: function(g, e) {
                            this._setPoint("setEnd", g, e, 0)
                        },
                        _setPoint: function(g, e, k, l) {
                            k = v.getIndex(e, e.parentNode).o;
                            this[g](e.parentNode, k.pop() + l)
                        },
                        _getIERange: function() {
                            var g = (this._body || this.endContainer.ownerDocument.body).createTextRange();
                            m.setRange(g, this.startContainer, this.startOffset, this.endContainer, this.endOffset, this.collapsed);
                            return g
                        },
                        getBookmark: function() {
                            this._getIERange();
                            return this._cachedBookmark
                        },
                        _select: function() {
                            this._getIERange().select()
                        },
                        deleteContents: function() {
                            var g = this.startContainer,
                                e = this._getIERange();
                            3 !== g.nodeType || this.startOffset || this.setStartBefore(g);
                            e.pasteHTML("");
                            this.endContainer = this.startContainer;
                            this.endOffset = this.startOffset;
                            this.collapsed = !0
                        },
                        cloneRange: function() {
                            var g = new l([this.startContainer,
                                this.startOffset, this.endContainer, this.endOffset
                            ]);
                            g._body = this._body;
                            return g
                        },
                        detach: function() {
                            this.startContainer = this.commonAncestorContainer = this._body = null;
                            this.startOffset = 0;
                            this.endContainer = null;
                            this.endOffset = 0;
                            this.collapsed = !0
                        }
                    });
                u.setObject("dijit.range", v);
                return v
            })
        },
        "dijit/_editor/html": function() {
            define(["dojo/_base/array", "dojo/_base/lang", "dojo/sniff"], function(r, n, u) {
                var v = {};
                n.setObject("dijit._editor.html", v);
                var m = v.escapeXml = function(l, g) {
                    l = l.replace(/&/gm, "\x26amp;").replace(/</gm,
                        "\x26lt;").replace(/>/gm, "\x26gt;").replace(/"/gm, "\x26quot;");
                    g || (l = l.replace(/'/gm, "\x26#39;"));
                    return l
                };
                v.getNodeHtml = function(l) {
                    var g = [];
                    v.getNodeHtmlHelper(l, g);
                    return g.join("")
                };
                v.getNodeHtmlHelper = function(l, g) {
                    switch (l.nodeType) {
                        case 1:
                            var e = l.nodeName.toLowerCase();
                            if (!e || "/" == e.charAt(0)) return "";
                            g.push("\x3c", e);
                            var k = [],
                                t = {},
                                n;
                            if (u("dom-attributes-explicit") || u("dom-attributes-specified-flag"))
                                for (var c = 0; n = l.attributes[c++];) {
                                    var a = n.name;
                                    "_dj" === a.substr(0, 3) || u("dom-attributes-specified-flag") &&
                                        !n.specified || a in t || (n = n.value, ("src" == a || "href" == a) && l.getAttribute("_djrealurl") && (n = l.getAttribute("_djrealurl")), 8 === u("ie") && "style" === a && (n = n.replace("HEIGHT:", "height:").replace("WIDTH:", "width:")), k.push([a, n]), t[a] = n)
                                } else {
                                    var f = (/^input$|^img$/i.test(l.nodeName) ? l : l.cloneNode(!1)).outerHTML,
                                        t = f.match(/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi),
                                        f = f.substr(0, f.indexOf("\x3e"));
                                    r.forEach(t, function(a) {
                                        if (a) {
                                            var b = a.indexOf("\x3d");
                                            if (0 < b && (a = a.substring(0, b), "_dj" != a.substr(0, 3)))
                                                if ("src" != a && "href" !=
                                                    a || !l.getAttribute("_djrealurl")) {
                                                    var d;
                                                    switch (a) {
                                                        case "style":
                                                            d = l.style.cssText.toLowerCase();
                                                            break;
                                                        case "class":
                                                            d = l.className;
                                                            break;
                                                        case "width":
                                                            if ("img" === e) {
                                                                (b = /width=(\S+)/i.exec(f)) && (d = b[1]);
                                                                break
                                                            }
                                                            case "height":
                                                                if ("img" === e) {
                                                                    (b = /height=(\S+)/i.exec(f)) && (d = b[1]);
                                                                    break
                                                                }
                                                                default:
                                                                    d = l.getAttribute(a)
                                                    }
                                                    null != d && k.push([a, d.toString()])
                                                } else k.push([a, l.getAttribute("_djrealurl")])
                                        }
                                    }, this)
                                }
                            k.sort(function(a, c) {
                                return a[0] < c[0] ? -1 : a[0] == c[0] ? 0 : 1
                            });
                            for (t = 0; n = k[t++];) g.push(" ", n[0], '\x3d"', "string" ===
                                typeof n[1] ? m(n[1], !0) : n[1], '"');
                            switch (e) {
                                case "br":
                                case "hr":
                                case "img":
                                case "input":
                                case "base":
                                case "meta":
                                case "area":
                                case "basefont":
                                    g.push(" /\x3e");
                                    break;
                                case "script":
                                    g.push("\x3e", l.innerHTML, "\x3c/", e, "\x3e");
                                    break;
                                default:
                                    g.push("\x3e"), l.hasChildNodes() && v.getChildrenHtmlHelper(l, g), g.push("\x3c/", e, "\x3e")
                            }
                            break;
                        case 4:
                        case 3:
                            g.push(m(l.nodeValue, !0));
                            break;
                        case 8:
                            g.push("\x3c!--", m(l.nodeValue, !0), "--\x3e");
                            break;
                        default:
                            g.push("\x3c!-- Element not recognized - Type: ", l.nodeType, " Name: ",
                                l.nodeName, "--\x3e")
                    }
                };
                v.getChildrenHtml = function(l) {
                    var g = [];
                    v.getChildrenHtmlHelper(l, g);
                    return g.join("")
                };
                v.getChildrenHtmlHelper = function(l, g) {
                    if (l)
                        for (var e = l.childNodes || l, k = !u("ie") || e !== l, m, n = 0; m = e[n++];) k && m.parentNode != l || v.getNodeHtmlHelper(m, g)
                };
                return v
            })
        },
        "dijit/_editor/plugins/LinkDialog": function() {
            define("require dojo/_base/declare dojo/dom-attr dojo/keys dojo/_base/lang dojo/on dojo/sniff dojo/query dojo/string ../_Plugin ../../form/DropDownButton ../range".split(" "), function(r,
                n, u, v, m, l, g, e, k, t, x, c) {
                var a = n("dijit._editor.plugins.LinkDialog", t, {
                        buttonClass: x,
                        useDefaultCommand: !1,
                        urlRegExp: "((https?|ftps?|file)\\://|./|../|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",
                        emailRegExp: "\x3c?(mailto\\:)([!#-'*+\\-\\/-9\x3d?A-Z^-~]+[.])*[!#-'*+\\-\\/-9\x3d?A-Z^-~]+@((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*\x3e?",
                        htmlTemplate: '\x3ca href\x3d"${urlInput}" _djrealurl\x3d"${urlInput}" target\x3d"${targetSelect}"\x3e${textInput}\x3c/a\x3e',
                        tag: "a",
                        _hostRxp: /^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/,
                        _userAtRxp: /^([!#-'*+\-\/-9=?A-Z^-~]+[.])*[!#-'*+\-\/-9=?A-Z^-~]+@/i,
                        linkDialogTemplate: "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_urlInput'\x3e${url}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_urlInput' name\x3d'urlInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'true' id\x3d'${id}_textInput' name\x3d'textInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_targetSelect'\x3e${target}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cselect id\x3d'${id}_targetSelect' name\x3d'targetSelect' data-dojo-type\x3d'dijit.form.Select'\x3e\x3coption selected\x3d'selected' value\x3d'_self'\x3e${currentWindow}\x3c/option\x3e\x3coption value\x3d'_blank'\x3e${newWindow}\x3c/option\x3e\x3coption value\x3d'_top'\x3e${topWindow}\x3c/option\x3e\x3coption value\x3d'_parent'\x3e${parentWindow}\x3c/option\x3e\x3c/select\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
                        _initButton: function() {
                            this.inherited(arguments);
                            this.button.loadDropDown = m.hitch(this, "_loadDropDown");
                            this._connectTagEvents()
                        },
                        _loadDropDown: function(a) {
                            r("dojo/i18n ../../TooltipDialog ../../registry ../../form/Button ../../form/Select ../../form/ValidationTextBox dojo/i18n!../../nls/common dojo/i18n!../nls/LinkDialog".split(" "), m.hitch(this, function(b, d, c) {
                                var f = this;
                                this.tag = "insertImage" == this.command ? "img" : "a";
                                b = m.delegate(b.getLocalization("dijit", "common", this.lang), b.getLocalization("dijit._editor",
                                    "LinkDialog", this.lang));
                                var h = this.dropDown = this.button.dropDown = new d({
                                    title: b[this.command + "Title"],
                                    ownerDocument: this.editor.ownerDocument,
                                    dir: this.editor.dir,
                                    execute: m.hitch(this, "setValue"),
                                    onOpen: function() {
                                        f._onOpenDialog();
                                        d.prototype.onOpen.apply(this, arguments)
                                    },
                                    onCancel: function() {
                                        setTimeout(m.hitch(f, "_onCloseDialog"), 0)
                                    }
                                });
                                b.urlRegExp = this.urlRegExp;
                                b.id = c.getUniqueId(this.editor.id);
                                this._uniqueId = b.id;
                                this._setContent(h.title + "\x3cdiv style\x3d'border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'\x3e\x3c/div\x3e" +
                                    k.substitute(this.linkDialogTemplate, b));
                                h.startup();
                                this._urlInput = c.byId(this._uniqueId + "_urlInput");
                                this._textInput = c.byId(this._uniqueId + "_textInput");
                                this._setButton = c.byId(this._uniqueId + "_setButton");
                                this.own(c.byId(this._uniqueId + "_cancelButton").on("click", m.hitch(this.dropDown, "onCancel")));
                                this._urlInput && this.own(this._urlInput.on("change", m.hitch(this, "_checkAndFixInput")));
                                this._textInput && this.own(this._textInput.on("change", m.hitch(this, "_checkAndFixInput")));
                                this._urlRegExp = new RegExp("^" +
                                    this.urlRegExp + "$", "i");
                                this._emailRegExp = new RegExp("^" + this.emailRegExp + "$", "i");
                                this._urlInput.isValid = m.hitch(this, function() {
                                    var a = this._urlInput.get("value");
                                    return this._urlRegExp.test(a) || this._emailRegExp.test(a)
                                });
                                this.own(l(h.domNode, "keydown", m.hitch(this, m.hitch(this, function(a) {
                                    !a || a.keyCode != v.ENTER || a.shiftKey || a.metaKey || a.ctrlKey || a.altKey || this._setButton.get("disabled") || (h.onExecute(), h.execute(h.get("value")))
                                }))));
                                a()
                            }))
                        },
                        _checkAndFixInput: function() {
                            var a = this,
                                c = this._urlInput.get("value");
                            this._delayedCheck && (clearTimeout(this._delayedCheck), this._delayedCheck = null);
                            this._delayedCheck = setTimeout(function() {
                                var d = c,
                                    b = !1,
                                    f = !1;
                                d && 1 < d.length && (d = m.trim(d), 0 !== d.indexOf("mailto:") && (0 < d.indexOf("/") ? -1 === d.indexOf("://") && "/" !== d.charAt(0) && d.indexOf("./") && 0 !== d.indexOf("../") && a._hostRxp.test(d) && (b = !0) : a._userAtRxp.test(d) && (f = !0)));
                                b && a._urlInput.set("value", "http://" + d);
                                f && a._urlInput.set("value", "mailto:" + d);
                                a._setButton.set("disabled", !a._isValid())
                            }, 250)
                        },
                        _connectTagEvents: function() {
                            this.editor.onLoadDeferred.then(m.hitch(this,
                                function() {
                                    this.own(l(this.editor.editNode, "mouseup", m.hitch(this, "_onMouseUp")));
                                    this.own(l(this.editor.editNode, "dblclick", m.hitch(this, "_onDblClick")))
                                }))
                        },
                        _isValid: function() {
                            return this._urlInput.isValid() && this._textInput.isValid()
                        },
                        _setContent: function(a) {
                            this.dropDown.set({
                                parserScope: "dojo",
                                content: a
                            })
                        },
                        _checkValues: function(a) {
                            a && a.urlInput && (a.urlInput = a.urlInput.replace(/"/g, "\x26quot;"));
                            return a
                        },
                        _createlinkEnabledImpl: function() {
                            return !0
                        },
                        setValue: function(a) {
                            this._onCloseDialog();
                            if (9 > g("ie")) {
                                var b = c.getSelection(this.editor.window).getRangeAt(0).endContainer;
                                3 === b.nodeType && (b = b.parentNode);
                                b && b.nodeName && b.nodeName.toLowerCase() !== this.tag && (b = this.editor.selection.getSelectedElement(this.tag));
                                b && b.nodeName && b.nodeName.toLowerCase() === this.tag && this.editor.queryCommandEnabled("unlink") && (this.editor.selection.selectElementChildren(b), this.editor.execCommand("unlink"))
                            }
                            a = this._checkValues(a);
                            this.editor.execCommand("inserthtml", k.substitute(this.htmlTemplate, a));
                            e("a",
                                this.editor.document).forEach(function(a) {
                                a.innerHTML || u.has(a, "name") || a.parentNode.removeChild(a)
                            }, this)
                        },
                        _onCloseDialog: function() {
                            this.editor.focused && this.editor.focus()
                        },
                        _getCurrentValues: function(a) {
                            var b, d, c;
                            a && a.tagName.toLowerCase() === this.tag ? (b = a.getAttribute("_djrealurl") || a.getAttribute("href"), c = a.getAttribute("target") || "_self", d = a.textContent || a.innerText, this.editor.selection.selectElement(a, !0)) : d = this.editor.selection.getSelectedText();
                            return {
                                urlInput: b || "",
                                textInput: d || "",
                                targetSelect: c ||
                                    ""
                            }
                        },
                        _onOpenDialog: function() {
                            var a, f;
                            if (g("ie")) {
                                if (f = c.getSelection(this.editor.window), f.rangeCount) {
                                    var d = f.getRangeAt(0);
                                    a = d.endContainer;
                                    3 === a.nodeType && (a = a.parentNode);
                                    a && a.nodeName && a.nodeName.toLowerCase() !== this.tag && (a = this.editor.selection.getSelectedElement(this.tag));
                                    if (!a || a.nodeName && a.nodeName.toLowerCase() !== this.tag)(f = this.editor.selection.getAncestorElement(this.tag)) && f.nodeName && f.nodeName.toLowerCase() == this.tag ? (a = f, this.editor.selection.selectElement(a)) : d.startContainer ===
                                        d.endContainer && (f = d.startContainer.firstChild) && f.nodeName && f.nodeName.toLowerCase() == this.tag && (a = f, this.editor.selection.selectElement(a))
                                }
                            } else a = this.editor.selection.getAncestorElement(this.tag);
                            this.dropDown.reset();
                            this._setButton.set("disabled", !0);
                            this.dropDown.set("value", this._getCurrentValues(a))
                        },
                        _onDblClick: function(a) {
                            if (a && a.target && (a = a.target, (a.tagName ? a.tagName.toLowerCase() : "") === this.tag && u.get(a, "href"))) {
                                var b = this.editor;
                                this.editor.selection.selectElement(a);
                                b.onDisplayChanged();
                                b._updateTimer && (b._updateTimer.remove(), delete b._updateTimer);
                                b.onNormalizedDisplayChanged();
                                var d = this.button;
                                setTimeout(function() {
                                    d.set("disabled", !1);
                                    d.loadAndOpenDropDown().then(function() {
                                        d.dropDown.focus && d.dropDown.focus()
                                    })
                                }, 10)
                            }
                        },
                        _onMouseUp: function() {
                            if (g("ff")) {
                                var a = this.editor.selection.getAncestorElement(this.tag);
                                if (a) {
                                    var f = c.getSelection(this.editor.window).getRangeAt(0);
                                    if (f.collapsed && a.childNodes.length) {
                                        var d = f.cloneRange();
                                        d.selectNodeContents(a.childNodes[a.childNodes.length -
                                            1]);
                                        d.setStart(a.childNodes[0], 0);
                                        1 !== f.compareBoundaryPoints(d.START_TO_START, d) ? f.setStartBefore(a) : -1 !== f.compareBoundaryPoints(d.END_TO_START, d) && f.setStartAfter(a)
                                    }
                                }
                            }
                        }
                    }),
                    f = n("dijit._editor.plugins.ImgLinkDialog", [a], {
                        linkDialogTemplate: "\x3ctable role\x3d'presentation'\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_urlInput'\x3e${url}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput dojoType\x3d'dijit.form.ValidationTextBox' regExp\x3d'${urlRegExp}' required\x3d'true' id\x3d'${id}_urlInput' name\x3d'urlInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3clabel for\x3d'${id}_textInput'\x3e${text}\x3c/label\x3e\x3c/td\x3e\x3ctd\x3e\x3cinput data-dojo-type\x3d'dijit.form.ValidationTextBox' required\x3d'false' id\x3d'${id}_textInput' name\x3d'textInput' data-dojo-props\x3d'intermediateChanges:true'/\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'submit' id\x3d'${id}_setButton'\x3e${set}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' type\x3d'button' id\x3d'${id}_cancelButton'\x3e${buttonCancel}\x3c/button\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",
                        htmlTemplate: '\x3cimg src\x3d"${urlInput}" _djrealurl\x3d"${urlInput}" alt\x3d"${textInput}" /\x3e',
                        tag: "img",
                        _getCurrentValues: function(a) {
                            var b, d;
                            a && a.tagName.toLowerCase() === this.tag ? (b = a.getAttribute("_djrealurl") || a.getAttribute("src"), d = a.getAttribute("alt"), this.editor.selection.selectElement(a, !0)) : d = this.editor.selection.getSelectedText();
                            return {
                                urlInput: b || "",
                                textInput: d || ""
                            }
                        },
                        _isValid: function() {
                            return this._urlInput.isValid()
                        },
                        _connectTagEvents: function() {
                            this.inherited(arguments);
                            this.editor.onLoadDeferred.then(m.hitch(this,
                                function() {
                                    this.own(l(this.editor.editNode, "mousedown", m.hitch(this, "_selectTag")))
                                }))
                        },
                        _selectTag: function(a) {
                            a && a.target && (a = a.target, (a.tagName ? a.tagName.toLowerCase() : "") === this.tag && this.editor.selection.selectElement(a))
                        },
                        _checkValues: function(a) {
                            a && a.urlInput && (a.urlInput = a.urlInput.replace(/"/g, "\x26quot;"));
                            a && a.textInput && (a.textInput = a.textInput.replace(/"/g, "\x26quot;"));
                            return a
                        },
                        _onDblClick: function(a) {
                            if (a && a.target && (a = a.target, (a.tagName ? a.tagName.toLowerCase() : "") === this.tag && u.get(a,
                                    "src"))) {
                                var b = this.editor;
                                this.editor.selection.selectElement(a);
                                b.onDisplayChanged();
                                b._updateTimer && (b._updateTimer.remove(), delete b._updateTimer);
                                b.onNormalizedDisplayChanged();
                                var d = this.button;
                                setTimeout(function() {
                                    d.set("disabled", !1);
                                    d.loadAndOpenDropDown().then(function() {
                                        d.dropDown.focus && d.dropDown.focus()
                                    })
                                }, 10)
                            }
                        }
                    });
                t.registry.createLink = function() {
                    return new a({
                        command: "createLink"
                    })
                };
                t.registry.insertImage = function() {
                    return new f({
                        command: "insertImage"
                    })
                };
                a.ImgLinkDialog = f;
                return a
            })
        },
        "dijit/_editor/plugins/TextColor": function() {
            define("require dojo/colors dojo/_base/declare dojo/_base/lang ../_Plugin ../../form/DropDownButton".split(" "), function(r, n, u, v, m, l) {
                var g = u("dijit._editor.plugins.TextColor", m, {
                    buttonClass: l,
                    colorPicker: "dijit/ColorPalette",
                    useDefaultCommand: !1,
                    _initButton: function() {
                        this.command = this.name;
                        this.inherited(arguments);
                        var e = this;
                        this.button.loadDropDown = function(g) {
                            function k(k) {
                                e.button.dropDown = new k({
                                    dir: e.editor.dir,
                                    ownerDocument: e.editor.ownerDocument,
                                    value: e.value,
                                    onChange: function(c) {
                                        e.editor.execCommand(e.command, c)
                                    },
                                    onExecute: function() {
                                        e.editor.execCommand(e.command, this.get("value"))
                                    }
                                });
                                g()
                            }
                            "string" == typeof e.colorPicker ? r([e.colorPicker], k) : k(e.colorPicker)
                        }
                    },
                    updateState: function() {
                        var e = this.editor,
                            g = this.command;
                        if (e && e.isLoaded && g.length) {
                            if (this.button) {
                                var l = this.get("disabled");
                                this.button.set("disabled", l);
                                if (l) return;
                                var m;
                                try {
                                    m = e.queryCommandValue(g) || ""
                                } catch (c) {
                                    m = ""
                                }
                            }
                            "" == m && (m = "#000000");
                            "transparent" == m && (m = "#ffffff");
                            "string" ==
                            typeof m ? -1 < m.indexOf("rgb") && (m = n.fromRgb(m).toHex()) : (m = ((m & 255) << 16 | m & 65280 | (m & 16711680) >>> 16).toString(16), m = "#000000".slice(0, 7 - m.length) + m);
                            this.value = m;
                            (e = this.button.dropDown) && e.get && m !== e.get("value") && e.set("value", m, !1)
                        }
                    }
                });
                m.registry.foreColor = function(e) {
                    return new g(e)
                };
                m.registry.hiliteColor = function(e) {
                    return new g(e)
                };
                return g
            })
        },
        "esri/dijit/editing/AttachmentEditor": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/kernel dojo/has dojo/query dojo/io-query dojo/dom-attr dijit/_Widget dijit/_Templated dijit/ProgressBar ../../kernel ../../lang ../../domUtils dojo/text!./templates/AttachmentEditor.html dojo/i18n!../../nls/jsapi dojo/NodeList-dom".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d) {
                    r = r([t, x], {
                        declaredClass: "esri.dijit.editing.AttachmentEditor",
                        widgetsInTemplate: !0,
                        templateString: h,
                        _listHtml: "\x3cspan id\x3d'node_${oid}_${attid}' style\x3d'display: flex;'\x3e\x3ca href\x3d'${href}' target\x3d'_blank'\x3e${name}\x3c/a\x3e",
                        _deleteBtnHtml: "\x3cspan style\x3d'cursor:pointer;color:red;font-weight:bold;padding:0 2px;' class\x3d'deleteAttachment' id\x3d'${attid}');'\x3eX\x3c/span\x3e",
                        _endHtml: "\x3cbr/\x3e\x3c/span\x3e",
                        _aeConnects: [],
                        _layerEditingCapChecked: {},
                        _layerEditingCap: {},
                        constructor: function(a, b) {
                            n.mixin(this, d.widgets.attachmentEditor)
                        },
                        startup: function() {
                            this.inherited(arguments);
                            this._uploadField_connect = u.connect(this._uploadField, "onchange", this, function() {
                                0 < this._uploadField.value.length && this._addAttachment()
                            });
                            this._uploadFieldFocus_connect = u.connect(this._uploadField, "onfocus", n.hitch(this, function(a) {
                                b.hide(this._attachmentError)
                            }))
                        },
                        destroy: function() {
                            v.forEach(this._aeConnects, u.disconnect);
                            u.disconnect(this._uploadField_connect);
                            u.disconnect(this._uploadFieldFocus_connect);
                            this.inherited(arguments)
                        },
                        showAttachments: function(a, d) {
                            this._attachmentList.innerHTML = this.NLS_none;
                            this._uploadField.value = "";
                            v.forEach(this.domNode.children, function(a, d) {
                                b.show(a)
                            });
                            b.hide(this._attachmentError);
                            a && (this._featureLayer = a.getLayer() || d) && ("esri.layers.FeatureLayer" === this._featureLayer.declaredClass && this._featureLayer.getEditCapabilities ? (this._currentLayerId = this._featureLayer.id, this._layerEditingCapChecked[this._currentLayerId] || (this._layerEditingCap[this._currentLayerId] =
                                this._featureLayer.getEditCapabilities(), this._layerEditingCapChecked[this._currentLayerId] = !0), this._featureCanUpdate = this._featureLayer.getEditCapabilities({
                                feature: a
                            }).canUpdate, this._oid = a.attributes[this._featureLayer.objectIdField], this._getAttachments(a)) : d && d.getEditCapabilities() || (b.hide(this._uploadForm), v.forEach(this.domNode.children, function(a, d) {
                                b.hide(a)
                            })))
                        },
                        _getAttachments: function(a) {
                            this._featureLayer && this._featureLayer.queryAttachmentInfos && this._featureLayer.queryAttachmentInfos(this._oid,
                                n.hitch(this, "_onQueryAttachmentInfosComplete"))
                        },
                        _addAttachment: function() {
                            b.hide(this._attachmentError);
                            this._featureLayer && this._featureLayer.addAttachment ? (b.show(this._attachmentProgress), this._featureLayer.addAttachment(this._oid, this._uploadForm, n.hitch(this, "_onAddAttachmentComplete"), n.hitch(this, "_onAddAttachmentError"))) : this._tempUpload = this._uploadForm
                        },
                        _chainAttachment: function(a, d) {
                            this._tempUpload && (b.show(this._attachmentProgress), d.addAttachment(a, this._tempUpload, n.hitch(this, "_onAddAttachmentComplete"),
                                n.hitch(this, "_onAddAttachmentError")));
                            this._tempUpload = null
                        },
                        _deleteAttachment: function(a, d) {
                            b.show(this._attachmentProgress);
                            this._featureLayer.deleteAttachments(a, [d], n.hitch(this, "_onDeleteAttachmentComplete"))
                        },
                        _onQueryAttachmentInfosComplete: function(a) {
                            var d = this._listHtml + this._deleteBtnHtml + this._endHtml;
                            this._uploadForm.style.display = "block";
                            !this._featureCanUpdate && this._layerEditingCap[this._currentLayerId].canUpdate || !this._layerEditingCap[this._currentLayerId].canCreate && !this._layerEditingCap[this._currentLayerId].canUpdate ?
                                (d = this._listHtml + this._endHtml, this._uploadForm.style.display = "none") : this._layerEditingCap[this._currentLayerId].canCreate && !this._layerEditingCap[this._currentLayerId].canUpdate && (d = this._listHtml + this._endHtml);
                            var b = this._attachmentList;
                            a = v.map(a, n.hitch(this, function(a) {
                                return f.substitute({
                                    href: a.url,
                                    name: a.name,
                                    oid: a.objectId,
                                    attid: a.id
                                }, d)
                            }));
                            b.innerHTML = a.join("") || this.NLS_none;
                            this._updateConnects()
                        },
                        _onAddAttachmentComplete: function(a) {
                            b.hide(this._attachmentProgress.domNode);
                            var d = this._attachmentList,
                                c = this._uploadField,
                                h = c.value,
                                g = h.lastIndexOf("\\"); - 1 < g && (h = h.substring(g + 1, h.length));
                            var h = h.replace(/\ /g, "_"),
                                g = e.objectToQuery({
                                    gdbVersion: this._featureLayer.gdbVersion,
                                    token: this._featureLayer._getToken()
                                }),
                                q = this._listHtml + this._deleteBtnHtml + this._endHtml;
                            this._layerEditingCap[this._currentLayerId].canCreate && !this._layerEditingCap[this._currentLayerId].canUpdate && (q = this._listHtml + this._endHtml);
                            a = f.substitute({
                                href: this._featureLayer._url.path + "/" + a.objectId + "/attachments/" + a.attachmentId +
                                    (g ? "?" + g : ""),
                                name: h,
                                oid: a.objectId,
                                attid: a.attachmentId
                            }, q);
                            d.innerHTML = d.innerHTML == this.NLS_none ? a : d.innerHTML + a;
                            this._updateConnects();
                            c.value = ""
                        },
                        _onAddAttachmentError: function(a) {
                            b.hide(this._attachmentProgress.domNode);
                            if (a && f.isDefined(a.code)) {
                                var d = this._attachmentError;
                                k.set(d, "innerHTML", (400 === a.code ? this.NLS_fileNotSupported : a.message || a.details && a.details.length && a.details[0]) || this.NLS_error);
                                b.show(d)
                            }
                        },
                        _onDeleteAttachmentComplete: function(a) {
                            b.hide(this._attachmentProgress.domNode);
                            var d = this._attachmentList;
                            v.every(a, function(a) {
                                return a.success
                            }) && (m.query("#node_" + a[0].objectId + "_" + a[0].attachmentId).orphan(), d.children && d.children.length || (d.innerHTML = this.NLS_none))
                        },
                        _updateConnects: function() {
                            v.forEach(this._aeConnects, u.disconnect);
                            m.query(".deleteAttachment").forEach(function(a) {
                                this._aeConnects.push(u.connect(a, "onclick", n.hitch(this, "_deleteAttachment", this._oid, a.id)))
                            }, this)
                        }
                    });
                    l("extend-esri") && n.setObject("dijit.editing.AttachmentEditor", r, a);
                    return r
                })
        },
        "dijit/ProgressBar": function() {
            define("require dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/number ./_Widget ./_TemplatedMixin dojo/text!./templates/ProgressBar.html".split(" "),
                function(r, n, u, v, m, l, g, e) {
                    return n("dijit.ProgressBar", [l, g], {
                        progress: "0",
                        value: "",
                        maximum: 100,
                        places: 0,
                        indeterminate: !1,
                        label: "",
                        name: "",
                        templateString: e,
                        _indeterminateHighContrastImagePath: r.toUrl("./themes/a11y/indeterminate_progress.gif"),
                        postMixInProperties: function() {
                            this.inherited(arguments);
                            this.params && "value" in this.params || (this.value = this.indeterminate ? Infinity : this.progress)
                        },
                        buildRendering: function() {
                            this.inherited(arguments);
                            this.indeterminateHighContrastImage.setAttribute("src", this._indeterminateHighContrastImagePath.toString());
                            this.update()
                        },
                        _setDirAttr: function(e) {
                            var g = "rtl" == e.toLowerCase();
                            u.toggle(this.domNode, "dijitProgressBarRtl", g);
                            u.toggle(this.domNode, "dijitProgressBarIndeterminateRtl", this.indeterminate && g);
                            this.inherited(arguments)
                        },
                        update: function(e) {
                            v.mixin(this, e || {});
                            e = this.internalProgress;
                            var g = this.domNode,
                                k = 1;
                            this.indeterminate ? g.removeAttribute("aria-valuenow") : (-1 != String(this.progress).indexOf("%") ? (k = Math.min(parseFloat(this.progress) / 100, 1), this.progress = k * this.maximum) : (this.progress = Math.min(this.progress,
                                this.maximum), k = this.maximum ? this.progress / this.maximum : 0), g.setAttribute("aria-valuenow", this.progress));
                            g.setAttribute("aria-labelledby", this.labelNode.id);
                            g.setAttribute("aria-valuemin", 0);
                            g.setAttribute("aria-valuemax", this.maximum);
                            this.labelNode.innerHTML = this.report(k);
                            u.toggle(this.domNode, "dijitProgressBarIndeterminate", this.indeterminate);
                            u.toggle(this.domNode, "dijitProgressBarIndeterminateRtl", this.indeterminate && !this.isLeftToRight());
                            e.style.width = 100 * k + "%";
                            this.onChange()
                        },
                        _setValueAttr: function(e) {
                            this._set("value",
                                e);
                            Infinity == e ? this.update({
                                indeterminate: !0
                            }) : this.update({
                                indeterminate: !1,
                                progress: e
                            })
                        },
                        _setLabelAttr: function(e) {
                            this._set("label", e);
                            this.update()
                        },
                        _setIndeterminateAttr: function(e) {
                            this._set("indeterminate", e);
                            this.update()
                        },
                        report: function(e) {
                            return this.label ? this.label : this.indeterminate ? "\x26#160;" : m.format(e, {
                                type: "percent",
                                places: this.places,
                                locale: this.lang
                            })
                        },
                        onChange: function() {}
                    })
                })
        },
        "esri/dijit/editing/Util": function() {
            define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "../../kernel"],
                function(r, n, u, v) {
                    var m = {},
                        m = {
                            findFeatures: function(l, g, e) {
                                var k = g.objectIdField;
                                g = n.filter(g.graphics, function(e) {
                                    return n.some(l, function(g) {
                                        return e.attributes[k] === g.objectId
                                    })
                                });
                                if (e) e(g);
                                else return g
                            },
                            getSelection: function(l) {
                                var g = [];
                                n.forEach(l, function(e) {
                                    e = e.getSelectedFeatures();
                                    n.forEach(e, function(e) {
                                        g.push(e)
                                    })
                                });
                                return g
                            },
                            sortFeaturesById: function(l, g) {
                                var e = n.map(l, function(e) {
                                    return e.featureLayer
                                });
                                g.sort(function(g, l) {
                                    var k = g.getLayer(),
                                        c = l.getLayer();
                                    if (!k) return -1;
                                    if (!c) return 1;
                                    var a = n.indexOf(e, k),
                                        c = n.indexOf(e, c),
                                        a = a - c;
                                    a || (k = k.objectIdField, a = g.attributes[k] - l.attributes[k]);
                                    return a
                                });
                                return g
                            }
                        };
                    u("extend-esri") && r.setObject("dijit.editing.Util.LayerHelper", m, v);
                    return m
                })
        },
        "dijit/form/TimeTextBox": function() {
            define("dojo/_base/declare dojo/keys dojo/query dojo/_base/lang ../_TimePicker ./_DateTimeTextBox".split(" "), function(r, n, u, v, m, l) {
                return r("dijit.form.TimeTextBox", l, {
                    baseClass: "dijitTextBox dijitComboBox dijitTimeTextBox",
                    popupClass: m,
                    _selector: "time",
                    value: new Date(""),
                    maxHeight: -1,
                    openDropDown: function(g) {
                        this.inherited(arguments);
                        var e = u(".dijitTimePickerItemSelected", this.dropDown.domNode),
                            l = this.dropDown.domNode.parentNode;
                        l.scrollTop = e[0] ? e[0].offsetTop - (l.clientHeight - e[0].clientHeight) / 2 : (l.scrollHeight - l.clientHeight) / 2;
                        this.dropDown.on("input", v.hitch(this, function() {
                            this.set("value", this.dropDown.get("value"), !1)
                        }))
                    },
                    _onInput: function() {
                        this.inherited(arguments);
                        var g = this.get("displayedValue");
                        this.filterString = g && !this.parse(g, this.constraints) ? g.toLowerCase() :
                            "";
                        this._opened && this.closeDropDown();
                        this.openDropDown()
                    }
                })
            })
        },
        "dijit/_TimePicker": function() {
            define("dojo/_base/array dojo/date dojo/date/locale dojo/date/stamp dojo/_base/declare dojo/dom-class dojo/dom-construct dojo/_base/kernel dojo/keys dojo/_base/lang dojo/sniff dojo/query dojo/mouse dojo/on ./_WidgetBase ./form/_ListMouseMixin".split(" "), function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h) {
                return m("dijit._TimePicker", [b, h], {
                    baseClass: "dijitTimePicker",
                    pickerMin: "T00:00:00",
                    pickerMax: "T23:59:59",
                    clickableIncrement: "T00:15:00",
                    visibleIncrement: "T01:00:00",
                    value: new Date,
                    _visibleIncrement: 2,
                    _clickableIncrement: 1,
                    _totalIncrements: 10,
                    constraints: {},
                    serialize: v.toISOString,
                    buildRendering: function() {
                        this.inherited(arguments);
                        this.timeMenu = this.containerNode = this.domNode
                    },
                    setValue: function(a) {
                        e.deprecated("dijit._TimePicker:setValue() is deprecated.  Use set('value', ...) instead.", "", "2.0");
                        this.set("value", a)
                    },
                    _setValueAttr: function(a) {
                        this._set("value", a);
                        this._showText()
                    },
                    _setFilterStringAttr: function(a) {
                        this._set("filterString",
                            a);
                        this._showText()
                    },
                    isDisabledDate: function() {
                        return !1
                    },
                    _getFilteredNodes: function(a, b, c, f) {
                        a = this.ownerDocument.createDocumentFragment();
                        for (b = 0; b < this._maxIncrement; b++)(c = this._createOption(b)) && a.appendChild(c);
                        return a
                    },
                    _showText: function() {
                        var a = v.fromISOString;
                        this.domNode.innerHTML = "";
                        this._clickableIncrementDate = a(this.clickableIncrement);
                        this._visibleIncrementDate = a(this.visibleIncrement);
                        var b = function(a) {
                                return 3600 * a.getHours() + 60 * a.getMinutes() + a.getSeconds()
                            },
                            c = b(this._clickableIncrementDate),
                            b = b(this._visibleIncrementDate);
                        (this.value || this.currentFocus).getTime();
                        this._refDate = a(this.pickerMin);
                        this._refDate.setFullYear(1970, 0, 1);
                        this._clickableIncrement = 1;
                        this._visibleIncrement = b / c;
                        a = a(this.pickerMax);
                        a.setFullYear(1970, 0, 1);
                        a = .001 * (a.getTime() - this._refDate.getTime());
                        this._maxIncrement = Math.ceil((a + 1) / c);
                        c = this._getFilteredNodes();
                        !c.firstChild && this.filterString ? (this.filterString = "", this._showText()) : this.domNode.appendChild(c)
                    },
                    constructor: function() {
                        this.constraints = {}
                    },
                    postMixInProperties: function() {
                        this.inherited(arguments);
                        this._setConstraintsAttr(this.constraints)
                    },
                    _setConstraintsAttr: function(a) {
                        for (var d in {
                                clickableIncrement: 1,
                                visibleIncrement: 1,
                                pickerMin: 1,
                                pickerMax: 1
                            }) d in a && (this[d] = a[d]);
                        a.locale || (a.locale = this.lang)
                    },
                    _createOption: function(a) {
                        var d = new Date(this._refDate),
                            b = this._clickableIncrementDate;
                        d.setHours(d.getHours() + b.getHours() * a, d.getMinutes() + b.getMinutes() * a, d.getSeconds() + b.getSeconds() * a);
                        "time" == this.constraints.selector && d.setFullYear(1970, 0, 1);
                        var c = u.format(d, this.constraints);
                        if (this.filterString &&
                            0 !== c.toLowerCase().indexOf(this.filterString)) return null;
                        b = this.ownerDocument.createElement("div");
                        b.className = this.baseClass + "Item";
                        b.date = d;
                        b.idx = a;
                        g.create("div", {
                            "class": this.baseClass + "ItemInner",
                            innerHTML: c
                        }, b);
                        c = 1 > a % this._visibleIncrement && -1 < a % this._visibleIncrement;
                        a = !c && !(a % this._clickableIncrement);
                        c ? b.className += " " + this.baseClass + "Marker" : a && (b.className += " " + this.baseClass + "Tick");
                        this.isDisabledDate(d) && (b.className += " " + this.baseClass + "ItemDisabled");
                        this.value && !n.compare(this.value,
                            d, this.constraints.selector) && (b.selected = !0, b.className += " " + this.baseClass + "ItemSelected", this._selectedDiv = b, c ? b.className += " " + this.baseClass + "MarkerSelected" : a && (b.className += " " + this.baseClass + "TickSelected"), this._highlightOption(b, !0));
                        return b
                    },
                    onOpen: function() {
                        this.inherited(arguments);
                        this.set("selected", this._selectedDiv)
                    },
                    _onOptionSelected: function(a, b) {
                        (a = a.target.date || a.target.parentNode.date) && !this.isDisabledDate(a) && (this._set("value", a), this.emit("input"), b && (this._highlighted_option =
                            null, this.set("value", a), this.onChange(a)))
                    },
                    onChange: function() {},
                    _highlightOption: function(a, b) {
                        if (a) {
                            if (b) this._highlighted_option && this._highlightOption(this._highlighted_option, !1), this._highlighted_option = a;
                            else {
                                if (this._highlighted_option !== a) return;
                                this._highlighted_option = null
                            }
                            l.toggle(a, this.baseClass + "ItemHover", b);
                            l.contains(a, this.baseClass + "Marker") ? l.toggle(a, this.baseClass + "MarkerHover", b) : l.toggle(a, this.baseClass + "TickHover", b)
                        }
                    },
                    handleKey: function(a) {
                        if (a.keyCode == k.DOWN_ARROW) return this.selectNextNode(),
                            this._onOptionSelected({
                                target: this._highlighted_option
                            }, !1), a.stopPropagation(), a.preventDefault(), !1;
                        if (a.keyCode == k.UP_ARROW) return this.selectPreviousNode(), this._onOptionSelected({
                            target: this._highlighted_option
                        }, !1), a.stopPropagation(), a.preventDefault(), !1;
                        if (a.keyCode == k.ENTER || a.keyCode === k.TAB) {
                            if (!this._keyboardSelected && a.keyCode === k.TAB) return !0;
                            this._highlighted_option && this._onOptionSelected({
                                target: this._highlighted_option
                            }, !0);
                            return a.keyCode === k.TAB
                        }
                    },
                    onHover: function(a) {
                        this._highlightOption(a,
                            !0)
                    },
                    onUnhover: function(a) {
                        this._highlightOption(a, !1)
                    },
                    onSelect: function(a) {
                        this._highlightOption(a, !0)
                    },
                    onDeselect: function(a) {
                        this._highlightOption(a, !1)
                    },
                    onClick: function(a) {
                        this._onOptionSelected({
                            target: a
                        }, !0)
                    }
                })
            })
        },
        "dojox/date/islamic": function() {
            define(["dojox/main", "dojo/_base/lang", "dojo/date", "./islamic/Date"], function(r, n, u, v) {
                var m = n.getObject("date.islamic", !0, r);
                m.getDaysInMonth = function(l) {
                    return l.getDaysInIslamicMonth(l.getMonth(), l.getFullYear())
                };
                m.compare = function(l, g, e) {
                    l instanceof
                    v && (l = l.toGregorian());
                    g instanceof v && (g = g.toGregorian());
                    return u.compare.apply(null, arguments)
                };
                m.add = function(l, g, e) {
                    var k = new v(l);
                    switch (g) {
                        case "day":
                            k.setDate(l.getDate() + e);
                            break;
                        case "weekday":
                            var m = l.getDay();
                            if (5 > m + e && 0 < m + e) k.setDate(l.getDate() + e);
                            else {
                                var n = g = 0;
                                5 == m ? (m = 4, n = 0 < e ? -1 : 1) : 6 == m && (m = 4, n = 0 < e ? -2 : 2);
                                var m = 0 < e ? 5 - m - 1 : -m,
                                    c = e - m,
                                    a = parseInt(c / 5);
                                0 != c % 5 && (g = 0 < e ? 2 : -2);
                                g = g + 7 * a + c % 5 + m;
                                k.setDate(l.getDate() + g + n)
                            }
                            break;
                        case "year":
                            k.setFullYear(l.getFullYear() + e);
                            break;
                        case "week":
                            e *= 7;
                            k.setDate(l.getDate() +
                                e);
                            break;
                        case "month":
                            l = l.getMonth();
                            k.setMonth(l + e);
                            break;
                        case "hour":
                            k.setHours(l.getHours() + e);
                            break;
                        case "minute":
                            k._addMinutes(e);
                            break;
                        case "second":
                            k._addSeconds(e);
                            break;
                        case "millisecond":
                            k._addMilliseconds(e)
                    }
                    return k
                };
                m.difference = function(l, g, e) {
                    g = g || new v;
                    e = e || "day";
                    var k = g.getFullYear() - l.getFullYear(),
                        n = 1;
                    switch (e) {
                        case "weekday":
                            k = Math.round(m.difference(l, g, "day"));
                            n = parseInt(m.difference(l, g, "week"));
                            if (0 == k % 7) k = 5 * n;
                            else {
                                e = 0;
                                var u = l.getDay(),
                                    c = g.getDay(),
                                    n = parseInt(k / 7);
                                g = k % 7;
                                l =
                                    new v(l);
                                l.setDate(l.getDate() + 7 * n);
                                l = l.getDay();
                                if (0 < k) switch (!0) {
                                    case 5 == u:
                                        e = -1;
                                        break;
                                    case 6 == u:
                                        e = 0;
                                        break;
                                    case 5 == c:
                                        e = -1;
                                        break;
                                    case 6 == c:
                                        e = -2;
                                        break;
                                    case 5 < l + g:
                                        e = -2
                                } else if (0 > k) switch (!0) {
                                    case 5 == u:
                                        e = 0;
                                        break;
                                    case 6 == u:
                                        e = 1;
                                        break;
                                    case 5 == c:
                                        e = 2;
                                        break;
                                    case 6 == c:
                                        e = 1;
                                        break;
                                    case 0 > l + g:
                                        e = 2
                                }
                                k = k + e - 2 * n
                            }
                            n = k;
                            break;
                        case "year":
                            n = k;
                            break;
                        case "month":
                            e = g.toGregorian() > l.toGregorian() ? g : l;
                            u = g.toGregorian() > l.toGregorian() ? l : g;
                            n = e.getMonth();
                            c = u.getMonth();
                            if (0 == k) n = e.getMonth() - u.getMonth();
                            else
                                for (n = 12 - c + n, k =
                                    u.getFullYear() + 1, e = e.getFullYear(), k; k < e; k++) n += 12;
                            g.toGregorian() < l.toGregorian() && (n = -n);
                            break;
                        case "week":
                            n = parseInt(m.difference(l, g, "day") / 7);
                            break;
                        case "day":
                            n /= 24;
                        case "hour":
                            n /= 60;
                        case "minute":
                            n /= 60;
                        case "second":
                            n /= 1E3;
                        case "millisecond":
                            n *= g.toGregorian().getTime() - l.toGregorian().getTime()
                    }
                    return Math.round(n)
                };
                return m
            })
        },
        "dojox/date/islamic/Date": function() {
            define(["dojo/_base/lang", "dojo/_base/declare", "dojo/date"], function(r, n, u) {
                var v = n("dojox.date.islamic.Date", null, {
                    _date: 0,
                    _month: 0,
                    _year: 0,
                    _hours: 0,
                    _minutes: 0,
                    _seconds: 0,
                    _milliseconds: 0,
                    _day: 0,
                    _GREGORIAN_EPOCH: 1721425.5,
                    _ISLAMIC_EPOCH: 1948439.5,
                    constructor: function() {
                        var m = arguments.length;
                        m ? 1 == m ? (m = arguments[0], "number" == typeof m && (m = new Date(m)), m instanceof Date ? this.fromGregorian(m) : "" == m ? this._date = new Date("") : (this._year = m._year, this._month = m._month, this._date = m._date, this._hours = m._hours, this._minutes = m._minutes, this._seconds = m._seconds, this._milliseconds = m._milliseconds)) : 3 <= m && (this._year += arguments[0], this._month +=
                            arguments[1], this._date += arguments[2], this._hours += arguments[3] || 0, this._minutes += arguments[4] || 0, this._seconds += arguments[5] || 0, this._milliseconds += arguments[6] || 0) : this.fromGregorian(new Date)
                    },
                    getDate: function() {
                        return this._date
                    },
                    getMonth: function() {
                        return this._month
                    },
                    getFullYear: function() {
                        return this._year
                    },
                    getDay: function() {
                        return this.toGregorian().getDay()
                    },
                    getHours: function() {
                        return this._hours
                    },
                    getMinutes: function() {
                        return this._minutes
                    },
                    getSeconds: function() {
                        return this._seconds
                    },
                    getMilliseconds: function() {
                        return this._milliseconds
                    },
                    setDate: function(m) {
                        m = parseInt(m);
                        if (!(0 < m && m <= this.getDaysInIslamicMonth(this._month, this._year))) {
                            var l;
                            if (0 < m)
                                for (l = this.getDaysInIslamicMonth(this._month, this._year); m > l; m -= l, l = this.getDaysInIslamicMonth(this._month, this._year)) this._month++, 12 <= this._month && (this._year++, this._month -= 12);
                            else
                                for (l = this.getDaysInIslamicMonth(0 <= this._month - 1 ? this._month - 1 : 11, 0 <= this._month - 1 ? this._year : this._year - 1); 0 >= m; l = this.getDaysInIslamicMonth(0 <= this._month - 1 ? this._month - 1 : 11, 0 <= this._month - 1 ? this._year :
                                        this._year - 1)) this._month--, 0 > this._month && (this._year--, this._month += 12), m += l
                        }
                        this._date = m;
                        return this
                    },
                    setFullYear: function(m) {
                        this._year = +m
                    },
                    setMonth: function(m) {
                        this._year += Math.floor(m / 12);
                        this._month = 0 < m ? Math.floor(m % 12) : Math.floor((m % 12 + 12) % 12)
                    },
                    setHours: function() {
                        var m = arguments.length,
                            l = 0;
                        1 <= m && (l = parseInt(arguments[0]));
                        2 <= m && (this._minutes = parseInt(arguments[1]));
                        3 <= m && (this._seconds = parseInt(arguments[2]));
                        4 == m && (this._milliseconds = parseInt(arguments[3]));
                        for (; 24 <= l;) this._date++, m = this.getDaysInIslamicMonth(this._month,
                            this._year), this._date > m && (this._month++, 12 <= this._month && (this._year++, this._month -= 12), this._date -= m), l -= 24;
                        this._hours = l
                    },
                    _addMinutes: function(m) {
                        m += this._minutes;
                        this.setMinutes(m);
                        this.setHours(this._hours + parseInt(m / 60));
                        return this
                    },
                    _addSeconds: function(m) {
                        m += this._seconds;
                        this.setSeconds(m);
                        this._addMinutes(parseInt(m / 60));
                        return this
                    },
                    _addMilliseconds: function(m) {
                        m += this._milliseconds;
                        this.setMilliseconds(m);
                        this._addSeconds(parseInt(m / 1E3));
                        return this
                    },
                    setMinutes: function(m) {
                        this._minutes =
                            m % 60;
                        return this
                    },
                    setSeconds: function(m) {
                        this._seconds = m % 60;
                        return this
                    },
                    setMilliseconds: function(m) {
                        this._milliseconds = m % 1E3;
                        return this
                    },
                    toString: function() {
                        if (isNaN(this._date)) return "Invalidate Date";
                        var m = new Date;
                        m.setHours(this._hours);
                        m.setMinutes(this._minutes);
                        m.setSeconds(this._seconds);
                        m.setMilliseconds(this._milliseconds);
                        return this._month + " " + this._date + " " + this._year + " " + m.toTimeString()
                    },
                    toGregorian: function() {
                        var m = this._year,
                            m = Math.floor(this._date + Math.ceil(29.5 * this._month) + 354 *
                                (m - 1) + Math.floor((3 + 11 * m) / 30) + this._ISLAMIC_EPOCH - 1 - .5) + .5,
                            l = m - this._GREGORIAN_EPOCH,
                            g = Math.floor(l / 146097),
                            e = this._mod(l, 146097),
                            l = Math.floor(e / 36524),
                            k = this._mod(e, 36524),
                            e = Math.floor(k / 1461),
                            k = this._mod(k, 1461),
                            k = Math.floor(k / 365),
                            g = 400 * g + 100 * l + 4 * e + k;
                        4 != l && 4 != k && g++;
                        l = m - (this._GREGORIAN_EPOCH + 365 * (g - 1) + Math.floor((g - 1) / 4) - Math.floor((g - 1) / 100) + Math.floor((g - 1) / 400));
                        e = this._GREGORIAN_EPOCH - 1 + 365 * (g - 1) + Math.floor((g - 1) / 4) - Math.floor((g - 1) / 100) + Math.floor((g - 1) / 400) + Math.floor(739 / 12 + (u.isLeapYear(new Date(g,
                            3, 1)) ? -1 : -2) + 1);
                        e = m < e ? 0 : u.isLeapYear(new Date(g, 3, 1)) ? 1 : 2;
                        l = Math.floor((12 * (l + e) + 373) / 367);
                        e = this._GREGORIAN_EPOCH - 1 + 365 * (g - 1) + Math.floor((g - 1) / 4) - Math.floor((g - 1) / 100) + Math.floor((g - 1) / 400) + Math.floor((367 * l - 362) / 12 + (2 >= l ? 0 : u.isLeapYear(new Date(g, l - 1, 1)) ? -1 : -2) + 1);
                        return new Date(g, l - 1, m - e + 1, this._hours, this._minutes, this._seconds, this._milliseconds)
                    },
                    fromGregorian: function(m) {
                        m = new Date(m);
                        var l = m.getFullYear(),
                            g = m.getMonth(),
                            e = m.getDate(),
                            l = this._GREGORIAN_EPOCH - 1 + 365 * (l - 1) + Math.floor((l - 1) / 4) +
                            -Math.floor((l - 1) / 100) + Math.floor((l - 1) / 400) + Math.floor((367 * (g + 1) - 362) / 12 + (2 >= g + 1 ? 0 : u.isLeapYear(m) ? -1 : -2) + e),
                            l = Math.floor(l) + .5,
                            l = l - this._ISLAMIC_EPOCH,
                            g = Math.floor((30 * l + 10646) / 10631),
                            e = Math.ceil((l - 29 - this._yearStart(g)) / 29.5),
                            e = Math.min(e, 11);
                        this._date = Math.ceil(l - this._monthStart(g, e)) + 1;
                        this._month = e;
                        this._year = g;
                        this._hours = m.getHours();
                        this._minutes = m.getMinutes();
                        this._seconds = m.getSeconds();
                        this._milliseconds = m.getMilliseconds();
                        this._day = m.getDay();
                        return this
                    },
                    valueOf: function() {
                        return this.toGregorian().valueOf()
                    },
                    _yearStart: function(m) {
                        return 354 * (m - 1) + Math.floor((3 + 11 * m) / 30)
                    },
                    _monthStart: function(m, l) {
                        return Math.ceil(29.5 * l) + 354 * (m - 1) + Math.floor((3 + 11 * m) / 30)
                    },
                    _civilLeapYear: function(m) {
                        return 11 > (14 + 11 * m) % 30
                    },
                    getDaysInIslamicMonth: function(m, l) {
                        var g = 0,
                            g = 29 + (m + 1) % 2;
                        11 == m && this._civilLeapYear(l) && g++;
                        return g
                    },
                    _mod: function(m, l) {
                        return m - l * Math.floor(m / l)
                    }
                });
                v.getDaysInIslamicMonth = function(m) {
                    return (new v).getDaysInIslamicMonth(m.getMonth(), m.getFullYear())
                };
                return v
            })
        },
        "dojox/date/islamic/locale": function() {
            define("dojox/main dojo/_base/lang dojo/_base/array dojo/date dojo/i18n dojo/regexp dojo/string ./Date dojo/i18n!dojo/cldr/nls/islamic".split(" "),
                function(r, n, u, v, m, l, g, e, k) {
                    function t(a, c, d, f, e) {
                        return e.replace(/([a-z])\1*/ig, function(d) {
                            var b, f, h = d.charAt(0);
                            d = d.length;
                            var q = ["abbr", "wide", "narrow"];
                            switch (h) {
                                case "G":
                                    b = c.eraAbbr[0];
                                    break;
                                case "y":
                                    b = String(a.getFullYear());
                                    break;
                                case "M":
                                    b = a.getMonth();
                                    3 > d ? (b += 1, f = !0) : (h = ["months-format", q[d - 3]].join("-"), b = c[h][b]);
                                    break;
                                case "d":
                                    b = a.getDate(!0);
                                    f = !0;
                                    break;
                                case "E":
                                    b = a.getDay();
                                    3 > d ? (b += 1, f = !0) : (h = ["days-format", q[d - 3]].join("-"), b = c[h][b]);
                                    break;
                                case "a":
                                    b = 12 > a.getHours() ? "am" : "pm";
                                    b = c["dayPeriods-format-wide-" +
                                        b];
                                    break;
                                case "h":
                                case "H":
                                case "K":
                                case "k":
                                    f = a.getHours();
                                    switch (h) {
                                        case "h":
                                            b = f % 12 || 12;
                                            break;
                                        case "H":
                                            b = f;
                                            break;
                                        case "K":
                                            b = f % 12;
                                            break;
                                        case "k":
                                            b = f || 24
                                    }
                                    f = !0;
                                    break;
                                case "m":
                                    b = a.getMinutes();
                                    f = !0;
                                    break;
                                case "s":
                                    b = a.getSeconds();
                                    f = !0;
                                    break;
                                case "S":
                                    b = Math.round(a.getMilliseconds() * Math.pow(10, d - 3));
                                    f = !0;
                                    break;
                                case "z":
                                    if (b = v.getTimezoneName(a.toGregorian())) break;
                                    d = 4;
                                case "Z":
                                    b = a.toGregorian().getTimezoneOffset();
                                    b = [0 >= b ? "+" : "-", g.pad(Math.floor(Math.abs(b) / 60), 2), g.pad(Math.abs(b) % 60, 2)];
                                    4 == d && (b.splice(0,
                                        0, "GMT"), b.splice(3, 0, ":"));
                                    b = b.join("");
                                    break;
                                default:
                                    throw Error("dojox.date.islamic.locale.formatPattern: invalid pattern char: " + e);
                            }
                            f && (b = g.pad(b, d));
                            return b
                        })
                    }

                    function x(a, c, d, f) {
                        var b = function(a) {
                            return a
                        };
                        c = c || b;
                        d = d || b;
                        f = f || b;
                        var h = a.match(/(''|[^'])+/g),
                            e = "'" == a.charAt(0);
                        u.forEach(h, function(a, b) {
                            a ? (h[b] = (e ? d : c)(a), e = !e) : h[b] = ""
                        });
                        return f(h.join(""))
                    }

                    function c(a, c, d, f) {
                        f = l.escapeString(f);
                        m.normalizeLocale(d.locale);
                        return f.replace(/([a-z])\1*/ig, function(b) {
                            var f;
                            f = b.charAt(0);
                            var h =
                                b.length,
                                e = "";
                            d.strict ? 1 < h && (e = "0{" + (h - 1) + "}") : e = "0?";
                            switch (f) {
                                case "y":
                                    f = "\\d+";
                                    break;
                                case "M":
                                    f = 2 < h ? "\\S+ ?\\S+" : e + "[1-9]|1[0-2]";
                                    break;
                                case "d":
                                    f = "[12]\\d|" + e + "[1-9]|3[01]";
                                    break;
                                case "E":
                                    f = "\\S+";
                                    break;
                                case "h":
                                    f = e + "[1-9]|1[0-2]";
                                    break;
                                case "k":
                                    f = e + "\\d|1[01]";
                                    break;
                                case "H":
                                    f = e + "\\d|1\\d|2[0-3]";
                                    break;
                                case "K":
                                    f = e + "[1-9]|1\\d|2[0-4]";
                                    break;
                                case "m":
                                case "s":
                                    f = e + "\\d|[0-5]\\d";
                                    break;
                                case "S":
                                    f = "\\d{" + h + "}";
                                    break;
                                case "a":
                                    h = d.am || c["dayPeriods-format-wide-am"];
                                    e = d.pm || c["dayPeriods-format-wide-pm"];
                                    d.strict ? f = h + "|" + e : (f = h + "|" + e, h != h.toLowerCase() && (f += "|" + h.toLowerCase()), e != e.toLowerCase() && (f += "|" + e.toLowerCase()));
                                    break;
                                default:
                                    f = ".*"
                            }
                            a && a.push(b);
                            return "(" + f + ")"
                        }).replace(/[\xa0 ]/g, "[\\s\\xa0]")
                    }
                    var a = n.getObject("date.islamic.locale", !0, r);
                    a.format = function(b, c) {
                        c = c || {};
                        var d = m.normalizeLocale(c.locale),
                            f = c.formatLength || "short",
                            h = a._getIslamicBundle(d),
                            e = [],
                            d = n.hitch(this, t, b, h, d, c.fullYear);
                        if ("year" == c.selector) return b.getFullYear();
                        "time" != c.selector && (b = c.datePattern || h["dateFormat-" +
                            f]) && e.push(x(b, d));
                        "date" != c.selector && (c = c.timePattern || h["timeFormat-" + f]) && e.push(x(c, d));
                        return e.join(" ")
                    };
                    a.regexp = function(b) {
                        return a._parseInfo(b).regexp
                    };
                    a._parseInfo = function(b) {
                        b = b || {};
                        var f = m.normalizeLocale(b.locale),
                            f = a._getIslamicBundle(f),
                            d = b.formatLength || "short",
                            e = b.datePattern || f["dateFormat-" + d],
                            d = b.timePattern || f["timeFormat-" + d],
                            g = [];
                        return {
                            regexp: x("date" == b.selector ? e : "time" == b.selector ? d : "undefined" == typeof d ? e : e + " " + d, n.hitch(this, c, g, f, b)),
                            tokens: g,
                            bundle: f
                        }
                    };
                    a.parse =
                        function(b, c) {
                            b = b.replace(/[\u200E\u200F\u202A\u202E]/g, "");
                            c || (c = {});
                            var d = a._parseInfo(c),
                                f = d.tokens,
                                h = d.bundle,
                                d = d.regexp.replace(/[\u200E\u200F\u202A\u202E]/g, "");
                            b = (new RegExp("^" + d + "$")).exec(b);
                            m.normalizeLocale(c.locale);
                            if (!b) return null;
                            var g = [1389, 0, 1, 0, 0, 0, 0],
                                l = "",
                                k = ["abbr", "wide", "narrow"];
                            u.every(b, function(a, d) {
                                if (!d) return !0;
                                d = f[d - 1];
                                var b = d.length;
                                switch (d.charAt(0)) {
                                    case "y":
                                        g[0] = Number(a);
                                        break;
                                    case "M":
                                        if (2 < b) {
                                            if (d = h["months-format-" + k[b - 3]].concat(), c.strict || (a = a.replace(".",
                                                    "").toLowerCase(), d = u.map(d, function(a) {
                                                    return a ? a.replace(".", "").toLowerCase() : a
                                                })), a = u.indexOf(d, a), -1 == a) return !1
                                        } else a--;
                                        g[1] = Number(a);
                                        break;
                                    case "D":
                                        g[1] = 0;
                                    case "d":
                                        g[2] = Number(a);
                                        break;
                                    case "a":
                                        d = c.am || h["dayPeriods-format-wide-am"];
                                        b = c.pm || h["dayPeriods-format-wide-pm"];
                                        if (!c.strict) {
                                            var e = /\./g;
                                            a = a.replace(e, "").toLowerCase();
                                            d = d.replace(e, "").toLowerCase();
                                            b = b.replace(e, "").toLowerCase()
                                        }
                                        if (c.strict && a != d && a != b) return !1;
                                        l = a == b ? "p" : a == d ? "a" : "";
                                        break;
                                    case "K":
                                        24 == a && (a = 0);
                                    case "h":
                                    case "H":
                                    case "k":
                                        g[3] =
                                            Number(a);
                                        break;
                                    case "m":
                                        g[4] = Number(a);
                                        break;
                                    case "s":
                                        g[5] = Number(a);
                                        break;
                                    case "S":
                                        g[6] = Number(a)
                                }
                                return !0
                            });
                            b = +g[3];
                            "p" === l && 12 > b ? g[3] = b + 12 : "a" === l && 12 == b && (g[3] = 0);
                            return new e(g[0], g[1], g[2], g[3], g[4], g[5], g[6])
                        };
                    var f = [];
                    a.addCustomFormats = function(a, c) {
                        f.push({
                            pkg: a,
                            name: c
                        })
                    };
                    a._getIslamicBundle = function(a) {
                        var b = {};
                        u.forEach(f, function(d) {
                            d = m.getLocalization(d.pkg, d.name, a);
                            b = n.mixin(b, d)
                        }, this);
                        return b
                    };
                    a.addCustomFormats("dojo.cldr", "islamic");
                    a.getNames = function(b, c, d, f, e) {
                        var h;
                        f = a._getIslamicBundle(f);
                        b = [b, d, c];
                        "standAlone" == d && (d = b.join("-"), h = f[d], 1 == h[0] && (h = void 0));
                        b[1] = "format";
                        return (h || f[b.join("-")]).concat()
                    };
                    a.weekDays = a.getNames("days", "wide", "format");
                    a.months = a.getNames("months", "wide", "format");
                    return a
                })
        },
        "widgets/SituationAwareness/js/SummaryInfo": function() {
            define("dojo/_base/declare dojo/Evented dojo/_base/array dojo/DeferredList dojo/Deferred dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/on jimu/utils jimu/dijit/Message esri/graphic esri/layers/FeatureLayer esri/tasks/query esri/tasks/QueryTask ./analysisUtils".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h) {
                    return r("SummaryInfo", [n], {
                        summaryLayer: null,
                        summaryFields: [],
                        summaryIds: [],
                        summaryFeatures: [],
                        tabNum: null,
                        symbolField: null,
                        graphicsLayer: null,
                        lyrRenderer: null,
                        lyrSymbol: null,
                        featureCount: 0,
                        mapServiceLayer: !1,
                        loading: !1,
                        queryOnLoad: !1,
                        incidentCount: 0,
                        allFields: !1,
                        constructor: function(a, b, c) {
                            this.tab = a;
                            this.container = b;
                            this.parent = c;
                            this.config = c.config;
                            this.graphicsLayer = null;
                            this.baseLabel = "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers
                        },
                        queryTabCount: function(d,
                            b, c, f) {
                            var e = new m;
                            this.incidentCount = d.length;
                            var h = [this.tab.tabLayers[0]];
                            this.mapServiceLayer && 1 < this.tab.tabLayers.length && (h = [this.tab.tabLayers[1]]);
                            if (0 < this.tab.tabLayers.length && this.tab.tabLayers[0].url && -1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                                this.mapServiceLayer = !0;
                                var g;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer = this.tab.tabLayers[0], this.summaryLayer.hasOwnProperty("loaded") && this.summaryLayer.loaded ? (this.summaryFields = this._getFields(this.summaryLayer),
                                    this._performQuery(d, b, c, f, h).then(function(a) {
                                        e.resolve(a)
                                    })) : (g = new a(this.summaryLayer.url), g.infoTemplate = this.tab.tabLayers[0].infoTemplate, h = [g], this.tab.tabLayers = h, k(g, "load", l.hitch(this, function() {
                                    this.summaryLayer = g;
                                    this.summaryFields = this._getFields(this.summaryLayer);
                                    this._performQuery(d, b, c, f, h).then(function(a) {
                                        e.resolve(a)
                                    })
                                })))) : this.loading || (g = new a(this.tab.tabLayers[0].url), this.loading = !0, k(g, "load", l.hitch(this, function() {
                                    this.summaryLayer = g;
                                    this.summaryFields = this._getFields(this.summaryLayer);
                                    for (var a = this.tab.tabLayers[0].url.split("MapServer/")[1], q = this.parent.map.itemInfo.itemData.operationalLayers, l = 0; l < q.length; l++) {
                                        var k = q[l];
                                        if (-1 < this.tab.tabLayers[0].url.indexOf(k.url) && "undefined" !== typeof k.layerObject)
                                            if (k.layerObject.infoTemplates) {
                                                if (k = k.layerObject.infoTemplates[a]) {
                                                    g.infoTemplate = k.infoTemplate;
                                                    break
                                                }
                                            } else if (k.layerObject.infoTemplate) {
                                            g.infoTemplate = k.layerObject.infoTemplate;
                                            break
                                        }
                                    }
                                    h = [g];
                                    this.tab.tabLayers = h;
                                    this.loading = !1;
                                    this._performQuery(d, b, c, f, h).then(function(a) {
                                        e.resolve(a)
                                    })
                                })))
                            }
                            this.mapServiceLayer ||
                                this._performQuery(d, b, c, f, h).then(function(a) {
                                    e.resolve(a)
                                });
                            return e
                        },
                        _performQuery: function(a, b, c, f, e) {
                            var d = new m,
                                g = [],
                                q, k;
                            0 < b.length ? k = h.getGeoms(b) : 0 < a.length && (k = h.getGeoms(a));
                            this.summaryGeoms = k;
                            if (0 < k.length)
                                for (a = 0; a < k.length; a++) g = k[a], b = h.createDefArray(e, g, this.parent.opLayers, this.tab), q = 0 === a ? g = b : g = q.concat(b);
                            (new v(g)).then(l.hitch(this, function(a) {
                                for (var b = 0, e = 0; e < a.length; e++) {
                                    var h = a[e][1];
                                    isNaN(h) ? h && h.features ? b += h.features.length : h && "undefined" !== typeof h.length && (b += h.length) :
                                        b += h
                                }
                                this.updateTabCount(b, c, f);
                                this.queryOnLoad && l.hitch(this, this._queryFeatures(this.summaryGeoms));
                                d.resolve(b)
                            }));
                            return d
                        },
                        updateTabCount: function(a, b, c) {
                            this.featureCount = a;
                            h.updateTabCount(this.featureCount, b, c, this.baseLabel, this.incidentCount)
                        },
                        updateForIncident: function(d, b, c, f, e, h, n) {
                            this.incidentCount = d.length;
                            this.allFields = "undefined" !== typeof h && "undefined" !== typeof n ? h ? !0 : n : !1;
                            var q = "undefined" !== typeof e,
                                w;
                            this.tabNum = f;
                            q ? w = new m : (this.container.innerHTML = "", g.add(this.container,
                                "loading"));
                            this.summaryIds = [];
                            this.summaryFeatures = [];
                            if (0 < this.tab.tabLayers.length) {
                                var t = this.summaryGeoms,
                                    z;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer = this.tab.tabLayers[0], z = new a(this.summaryLayer.url), z.infoTemplate = this.tab.tabLayers[0].infoTemplate, this.tab.tabLayers[1] = z, this.summaryFields = this._getFields(this.tab.tabLayers[0]), q ? this._queryFeatures(t, q).then(function(a) {
                                    w.resolve(a)
                                }) : (this._initGraphicsLayer(c), l.hitch(this, this._queryFeatures(t)))) : (z =
                                    new a(this.tab.tabLayers[0].url), k(z, "load", l.hitch(this, function() {
                                        this.summaryLayer = z;
                                        if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer"))
                                            for (var a = this.tab.tabLayers[0].url.split("MapServer/")[1], d = this.parent.map.itemInfo.itemData.operationalLayers, b = 0; b < d.length; b++) {
                                                var f = d[b];
                                                if (-1 < this.tab.tabLayers[0].url.indexOf(f.url) && "undefined" !== typeof f.layerObject && f.layerObject.infoTemplates && (f = f.layerObject.infoTemplates[a])) {
                                                    z.infoTemplate = f.infoTemplate;
                                                    break
                                                }
                                            }
                                        this.tab.tabLayers[1] = z;
                                        this.summaryLayer =
                                            this.tab.tabLayers[1];
                                        this.summaryFields = this._getFields(this.tab.tabLayers[1]);
                                        q ? this._queryFeatures(t, q).then(function(a) {
                                            w.resolve(a)
                                        }) : (this._initGraphicsLayer(c), l.hitch(this, this._queryFeatures(t)))
                                    })));
                                if (q) return w
                            }
                        },
                        _initGraphicsLayer: function(a) {
                            null !== a && (this.graphicsLayer = a, this.graphicsLayer.clear(), this.summaryLayer && this.summaryLayer.renderer && (this.lyrRenderer = this.summaryLayer.renderer, this.graphicsLayer.renderer = this.lyrRenderer, "undefined" !== typeof this.summaryLayer.renderer.attributeField ?
                                this.symbolField = this.summaryLayer.renderer.attributeField : this.lyrSymbol = this.lyrRenderer.symbol))
                        },
                        _queryFeatures: function(a, b) {
                            var d;
                            b && (d = new m);
                            for (var c = [], e = -1 === [null, void 0, ""].indexOf(this.tab.tabLayers[0].id) ? this.tab.tabLayers[0].id : this.tab.layers, e = h.getFilter(e, this.parent.opLayers), g = new f, q = 0; q < a.length; q++) g.geometry = a[q], g.where = e, c.push(this.summaryLayer.queryIds(g));
                            (new v(c)).then(l.hitch(this, function(a) {
                                for (var c, f, e = 0; e < a.length; e++) a[e][0] && (c = a[e][1], f = c = 0 === e ? c : f.concat(c));
                                c ? (this.summaryIds = c, 0 < this.summaryIds.length ? b ? this._queryFeaturesByIds(b).then(function(a) {
                                    d.resolve(a)
                                }) : this._queryFeaturesByIds() : b || this._processResults()) : b || this._processResults()
                            }), l.hitch(this, function(a) {
                                console.error(a);
                                new x({
                                    message: a
                                })
                            }));
                            if (b) return d
                        },
                        _queryFeaturesByIds: function(a) {
                            var d, c = [];
                            a && (d = new m);
                            var e = this.summaryLayer.maxRecordCount || 1E3,
                                k = this.summaryIds.slice(0, e);
                            this.summaryIds.splice(0, e);
                            var n = new f;
                            n.where = h.getFilter(this.summaryLayer.id, this.parent.opLayers);
                            var t = !1;
                            u.some(this.summaryFields, l.hitch(this, function(a) {
                                if ("area" === a.type || "length" === a.type || this.graphicsLayer) return t = !0
                            }));
                            a && (t = !0);
                            n.returnGeometry = t;
                            n.outSpatialReference = this.parent.map.spatialReference;
                            n.outFields = ["*"];
                            n.objectIds = k;
                            var r = new b(this.summaryLayer.url);
                            for (c.push(r.execute(n)); 0 < this.summaryIds.length;) k = this.summaryIds.slice(0, e), this.summaryIds.splice(0, e), n.objectIds = k, c.push(r.execute(n));
                            (new v(c)).then(l.hitch(this, function(b) {
                                this.summaryFeatures = [];
                                for (var c =
                                        0; c < b.length; c++)
                                    if (b[c][0]) {
                                        var f = b[c][1];
                                        f.features && (this.summaryFeatures = this.summaryFeatures.concat(f.features))
                                    } a ? this._processResults(a).then(l.hitch(this, function(a) {
                                    this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing");
                                    d.resolve(a)
                                })) : (this._processResults(), this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing"));
                                this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing")
                            }), l.hitch(this, function(a) {
                                console.error(a);
                                new x({
                                    message: a
                                })
                            }));
                            if (a) return d
                        },
                        _prepResults: function() {
                            for (var a = 0; a < this.summaryFields.length; a++) {
                                var b = this.summaryFields[a],
                                    c = b.field,
                                    f = b.total;
                                switch (b.type) {
                                    case "count":
                                        f = this.summaryFeatures.length;
                                        break;
                                    case "area":
                                        f = h.getArea(this.summaryFeatures, this.summaryGeoms, this.config.distanceSettings, this.config.distanceUnits, this.tab.advStat);
                                        break;
                                    case "length":
                                        f = h.getLength(this.summaryFeatures, this.summaryGeoms, this.config.distanceSettings, this.config.distanceUnits, this.tab.advStat);
                                        break;
                                    case "sum":
                                        f = h.getSum(this.summaryFeatures,
                                            c);
                                        break;
                                    case "avg":
                                        f = h.getSum(this.summaryFeatures, c) / this.summaryFeatures.length;
                                        break;
                                    case "min":
                                        f = h.getMin(this.summaryFeatures, c);
                                        break;
                                    case "max":
                                        f = h.getMax(this.summaryFeatures, c)
                                }
                                b.total = f
                            }
                        },
                        _processResults: function(a) {
                            this._prepResults();
                            var b, d = this.summaryFields,
                                f = 0,
                                n;
                            if (a) b = new m;
                            else {
                                this.container.innerHTML = "";
                                g.remove(this.container, "loading");
                                if (0 === this.summaryFeatures.length) {
                                    this.container.innerHTML = this.parent.nls.noFeaturesFound;
                                    return
                                }
                                n = e.create("div", {
                                    style: "width:" + 220 * (d.length +
                                        1) + "px;"
                                }, this.container);
                                g.add(n, "SAT_tabPanelContent");
                                var u = e.create("div", {}, n);
                                g.add(u, "SATcolExport");
                                g.add(u, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder");
                                u = e.create("div", {
                                    "data-dojo-attach-point": "SA_SAT_download",
                                    title: this.parent.nls.downloadCSV
                                }, u);
                                g.add(u, [this.parent.isBlackTheme ? "btnExportBlack" : "btnExport", "download"]);
                                k(u, "click", l.hitch(this, this._exportToCSV, d))
                            }
                            for (var u = [], z = 0; z < d.length; z++) {
                                var r = d[z],
                                    v = t.stripHTML(r.alias ? r.alias : "") + "\x3cbr/\x3e",
                                    r = h.formatNumber(r.total,
                                        r),
                                    f = r.total,
                                    r = r.num;
                                if (a) u.push({
                                    num: r,
                                    info: v,
                                    total: f
                                });
                                else {
                                    f = e.create("div", {
                                        "class": "SATcol"
                                    }, n);
                                    g.add(f, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder");
                                    var x = e.create("div", {
                                        style: "max-height: 60px;"
                                    }, f);
                                    e.create("div", {
                                        "class": " SATcolWrap",
                                        style: "max-height: 30px; overflow: hidden;",
                                        innerHTML: v
                                    }, x);
                                    e.create("div", {
                                        "class": " colSummary",
                                        innerHTML: r
                                    }, f)
                                }
                            }
                            d = [];
                            n = null !== this.graphicsLayer;
                            !a && n && (this.graphicsLayer.clear(), this.tab.tabLayers[1].clear());
                            if (this.summaryFeatures)
                                for (z =
                                    0; z < this.summaryFeatures.length; z++) v = this.summaryFeatures[z], this.lyrSymbol ? v.symbol = this.lyrSymbol : n && this.graphicsLayer.renderer ? (r = this.graphicsLayer.renderer.getSymbol(v), v.symbol = r) : this.summaryLayer.renderer && this.summaryLayer.renderer.getSymbol && (v.symbol = this.summaryLayer.renderer.getSymbol(v)), v = v.toJson ? new c(v.toJson()) : v, !a && n ? (this.graphicsLayer.add(v), this.tab.tabLayers[1].add(v)) : d.push(v);
                            !a && n && (this.graphicsLayer.setVisibility(!0), this.parent._toggleTabLayersNew(this.tabNum), this.tab.restore &&
                                this.emit("summary-complete", {
                                    bubbles: !0,
                                    cancelable: !0,
                                    tab: this.tabNum
                                }));
                            if (a) return b.resolve({
                                graphics: d,
                                analysisResults: u,
                                context: this
                            }), b
                        },
                        _exportToCSV: function(a, b, c, f) {
                            a = h.exportToCSV(this.summaryFeatures, b, c, f, {
                                type: "summary",
                                baseLabel: this.baseLabel,
                                csvAllFields: this.parent.config.csvAllFields,
                                layer: this.summaryLayer,
                                opLayers: this.parent.opLayers,
                                nlsValue: this.parent.nls.summary,
                                nlsCount: this.parent.nls.count,
                                summaryFields: this.summaryFields,
                                calcFields: this.calcFields
                            });
                            this.summaryLayer =
                                a.summaryLayer;
                            return a.details
                        },
                        _getFieldInfoByFieldInfo: function(a, b, c) {
                            return this._getFieldInfo(a[b], b, c)
                        },
                        _getFieldInfoByName: function(a, b) {
                            var d = ["count", "area", "length", "tabCount"],
                                c;
                            for (c in a)
                                if (-1 === d.indexOf(c)) return this._getFieldInfo(a[c], c, b)
                        },
                        _getFieldInfo: function(a, b, c) {
                            for (var d = 0; d < a.length; d++) {
                                var f = a[d];
                                if (f.expression && f.expression === c) return {
                                    field: {
                                        field: f.expression,
                                        alias: f.label,
                                        type: b,
                                        modify: f.modify,
                                        round: f.round,
                                        roundPlaces: f.roundPlaces,
                                        truncate: f.truncate,
                                        truncatePlaces: f.truncatePlaces,
                                        total: 0
                                    },
                                    index: d
                                }
                            }
                        },
                        _getFields: function(a) {
                            this.layerDefinition = t.getFeatureLayerDefinition(a);
                            this.layerObject = a;
                            var b = h.getSkipFields(a),
                                d = [];
                            if ("undefined" !== typeof this.tab.advStat) {
                                var c = l.clone(this.tab.advStat.stats);
                                this.tab.advStat.fieldOrder && u.forEach(this.tab.advStat.fieldOrder, l.hitch(this, function(a) {
                                    if ((a = a && a.hasOwnProperty("fieldName") ? this._getFieldInfoByFieldInfo(c, a.fieldType, a.fieldName) : this._getFieldInfoByName(c, a)) && a.field) {
                                        var b = c[a.field.type];
                                        b.splice(a.index, 1);
                                        0 === b.length &&
                                            delete c[a.field.type];
                                        d.push(a.field)
                                    }
                                }));
                                for (var f in c) 0 < c[f].length && u.forEach(c[f], function(a) {
                                    d.push({
                                        field: a.expression,
                                        alias: a.label,
                                        type: f,
                                        modify: a.modify,
                                        round: a.round,
                                        roundPlaces: a.roundPlaces,
                                        truncate: a.truncate,
                                        truncatePlaces: a.truncatePlaces,
                                        total: 0
                                    })
                                })
                            } else {
                                var e;
                                if (a.infoTemplate) e = a.infoTemplate.info.fieldInfos;
                                else if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                                    var g = this.tab.tabLayers[0].url.split("MapServer/")[1],
                                        k = this.parent.map.itemInfo.itemData.operationalLayers;
                                    e = null;
                                    for (var m = 0; m < k.length; m++) {
                                        var n = k[m];
                                        if (n.layerObject.infoTemplates && (n = n.layerObject.infoTemplates[g])) {
                                            e = n.infoTemplate.info.fieldInfos;
                                            break
                                        }
                                    }
                                } else e = a.fields;
                                e || (e = a.fields);
                                for (g = 0; g < e.length; g++)
                                    if (k = e[g], "undefined" !== typeof a.fields) {
                                        var m = a.fields[g].type,
                                            r;
                                        k.name === a.objectIdField || "esriFieldTypeDouble" !== m && "esriFieldTypeInteger" !== m && "esriFieldTypeSmallInteger" !== m || ("undefined" !== typeof k.visible ? k.visible && (r = {
                                            field: k.fieldName,
                                            alias: k.label,
                                            type: "sum",
                                            total: 0
                                        }) : r = {
                                            field: k.name,
                                            alias: k.alias,
                                            type: "sum",
                                            total: 0
                                        }, r && -1 === b.indexOf(r.field) && d.push(r), r = null)
                                    }
                            }
                            this.calcFields = l.clone(d);
                            if (this.allFields)
                                for (e = 0; e < a.fields.length; e++) {
                                    r = a.fields[e];
                                    g = !0;
                                    k = 0;
                                    b: for (; k < d.length; k++)
                                        if (r.name === d[k].field) {
                                            g = !1;
                                            break b
                                        } - 1 === b.indexOf(r.name) && g && d.push({
                                        field: r.name,
                                        alias: r.alias,
                                        type: r.type
                                    })
                                }
                            a = h.getSpecialFields(a);
                            this.dateFields = a.dateFields;
                            this.specialFields = a.specialFields;
                            this.typeIdField = a.typeIdField;
                            this.types = a.types;
                            return d
                        }
                    })
                })
        },
        "widgets/SituationAwareness/js/analysisUtils": function() {
            define("dojo/_base/array dojo/_base/lang dojo/dom-class dojo/dom-geometry dojo/dom-style esri/tasks/query esri/geometry/geometryEngine esri/geometry/Polyline ./CSVUtils jimu/utils".split(" "),
                function(r, n, u, v, m, l, g, e, k, t) {
                    function x(c) {
                        return function(a, f) {
                            return a.attributes[c] < f.attributes[c] ? -1 : a.attributes[c] > f.attributes[c] ? 1 : 0
                        }
                    }
                    return {
                        getFields: function(c, a, f, b) {
                            var e = this.getSkipFields(c),
                                d = [];
                            if (!f && a.advStat && a.advStat.stats && a.advStat.stats.outFields && 0 < a.advStat.stats.outFields.length) r.forEach(a.advStat.stats.outFields, function(a) {
                                d.push(a.expression)
                            });
                            else {
                                if (c.infoTemplate) a = c.infoTemplate.info.fieldInfos;
                                else if (0 < b.map.itemInfo.itemData.operationalLayers.length) {
                                    b = b.map.itemInfo.itemData.operationalLayers;
                                    a = null;
                                    var g = 0;
                                    a: for (; g < b.length; g++) {
                                        var k = b[g];
                                        if ("ArcGISMapServiceLayer" === k.layerType && "undefined" !== typeof k.layers)
                                            for (var l = 0; l < k.layers.length; l++) {
                                                var m = k.layers[l];
                                                if (m.id === c.layerId && m.popupInfo) {
                                                    a = m.popupInfo.fieldInfos;
                                                    break a
                                                }
                                            }
                                    }
                                    a || (a = c.fields)
                                } else a = c.fields;
                                if (a)
                                    for (b = 0; b < a.length; b++) g = a[b], f || "undefined" === typeof g.visible ? (g = g.name ? g.name : g.fieldName, -1 === e.indexOf(g) && d.push(g)) : g.visible && -1 === e.indexOf(g.fieldName) && d.push(g.fieldName)
                            }
                            c = this.getSpecialFields(c);
                            return {
                                dateFields: c.dateFields,
                                specialFields: c.specialFields,
                                typeIdField: c.typeIdField,
                                types: c.types,
                                fields: 3 < d.length && !f ? d.slice(0, 3) : d,
                                allFields: d
                            }
                        },
                        getField: function(c, a) {
                            for (var f = 0; f < c.length; f++) {
                                var b = c[f];
                                if (b.name === a || b.alias === a) return b
                            }
                        },
                        getFieldValue: function(c, a, f, b, e, d, g, k, l, m) {
                            d = !1;
                            g = a;
                            f[c] && "esriFieldTypeDate" === f[c].type && (d = !0, -1 < Object.keys(b).indexOf(c) ? (f = b[c], e = "undefined" !== typeof f ? {
                                dateFormat: f
                            } : {
                                dateFormat: e
                            }) : e = {
                                dateFormat: e
                            }, g = t.fieldFormatter.getFormattedDate(new Date(a), e));
                            !d && k && l && (g = (c = t.getDisplayValueForCodedValueOrSubtype(k,
                                c, l)) && c.hasOwnProperty("displayValue") && c.isCodedValueOrSubtype ? c.displayValue : this.formatNumber(g, m).num);
                            return g
                        },
                        getSkipFields: function(c) {
                            var a = [];
                            if (c.fields)
                                for (var f = 0; f < c.fields.length; f++) {
                                    var b = c.fields[f];
                                    b && b.type && b.name && "esriFieldTypeGeometry" === b.type && a.push(b.name)
                                }
                            c.globalIdField && "" !== c.globalIdField && a.push(c.globalIdField);
                            c.objectIdField && "" !== c.objectIdField && a.push(c.objectIdField);
                            return a
                        },
                        getSpecialFields: function(c) {
                            var a = {},
                                f = [];
                            c.fields && r.forEach(c.fields, n.hitch(this,
                                function(b) {
                                    if ("esriFieldTypeDate" === b.type || b.domain || b.name === c.typeIdField) {
                                        if ("esriFieldTypeDate" === b.type && c.infoTemplate)
                                            for (var e in c.infoTemplate._fieldsMap) "undefined" !== typeof c.infoTemplate._fieldsMap[e].fieldName && c.infoTemplate._fieldsMap[e].fieldName === b.name && c.infoTemplate._fieldsMap[e].format && "undefined" !== typeof c.infoTemplate._fieldsMap[e].format.dateFormat && (f[b.name] = c.infoTemplate._fieldsMap[e].format.dateFormat);
                                        a[b.name] = b
                                    }
                                }));
                            return {
                                specialFields: a,
                                dateFields: f,
                                typeIdField: c.typeIdField,
                                types: c.types
                            }
                        },
                        getSummaryFields: function() {},
                        getPopupFields: function(c) {
                            var a = [];
                            0 < c.tabLayers.length && r.forEach(c.tabLayers, n.hitch(this, function(c) {
                                var b = this.getSkipFields(c);
                                "undefined" !== typeof c.popupInfo ? r.forEach(c.popupInfo.fieldInfos, n.hitch(this, function(c) {
                                    if (c.visible && -1 === b.indexOf(c.fieldName)) {
                                        var d = {
                                            value: 0
                                        };
                                        d.expression = c.fieldName;
                                        d.label = c.label;
                                        a.push(d)
                                    }
                                })) : c.infoTemplate && r.forEach(c.infoTemplate.info.fieldInfos, n.hitch(this, function(c) {
                                    if (c.visible && -1 === b.indexOf(c.fieldName)) {
                                        var d = {
                                            value: 0
                                        };
                                        d.expression = c.fieldName;
                                        d.label = c.label;
                                        a.push(d)
                                    }
                                }))
                            }));
                            return a
                        },
                        getDisplayFields: function(c) {
                            var a;
                            "undefined" !== typeof c.advStat && "undefined" !== typeof c.advStat.stats && "undefined" !== typeof c.advStat.stats.outFields ? a = c.advStat.stats.outFields : (a = [], 0 < c.tabLayers.length && r.forEach(c.tabLayers, n.hitch(this, function(c) {
                                "undefined" !== typeof c.popupInfo ? r.forEach(c.popupInfo.fieldInfos, n.hitch(this, function(b) {
                                        if (b.visible) {
                                            var c = {
                                                value: 0
                                            };
                                            c.expression = b.fieldName;
                                            c.label = b.label;
                                            a.push(c)
                                        }
                                    })) :
                                    c.infoTemplate ? r.forEach(c.infoTemplate.info.fieldInfos, n.hitch(this, function(b) {
                                        if (b.visible) {
                                            var c = {
                                                value: 0
                                            };
                                            c.expression = b.fieldName;
                                            c.label = b.label;
                                            a.push(c)
                                        }
                                    })) : r.forEach((c.layerObject ? c.layerObject : c).fields, n.hitch(this, function(b) {
                                        var c = {
                                            value: 0
                                        };
                                        c.expression = b.name;
                                        c.label = b.alias;
                                        a.push(c)
                                    }))
                            })));
                            return a
                        },
                        exportToCSV: function(c, a, f, b, e) {
                            if (0 === c.length) return !1;
                            var d = e.baseLabel,
                                g = [],
                                h = [];
                            "proximity" === e.type && c.sort(this.compareDistance);
                            var l;
                            "undefined" === typeof a.altKey ? l = a : (l = !1,
                                f = e.csvAllFields);
                            r.forEach(c, n.hitch(this, function(a) {
                                "closest" === e.type && delete a.attributes.DISTANCE;
                                "proximity" === e.type && (a.attributes.DISTANCE = this.getDistanceLabel(a.attributes.DISTANCE, e.unit, e.approximateLabel));
                                g.push(a.attributes)
                            }));
                            if ("summary" === e.type || "grouped" === e.type)
                                if (!0 === e.csvAllFields || "true" === e.csvAllFields)
                                    for (var m in g[0]) h.push(m);
                                else
                                    for (c = 0; c < e.summaryFields.length; c++) h.push(e.summaryFields[c].field);
                            else
                                for (var t in g[0]) h.push(t);
                            c = e.layer;
                            m = c.fields;
                            if (c && c.loaded &&
                                m || l) {
                                t = a ? [] : this.getSkipFields(c);
                                var u = {};
                                if (e.opLayers && e.opLayers._layerInfos) {
                                    var v = e.opLayers.getLayerInfoById(c.id);
                                    v && (u.popupInfo = v.getPopupInfo())
                                }
                                var v = [],
                                    x = 0;
                                for (; x < h.length; x++) {
                                    var E = h[x];
                                    if (-1 === t.indexOf(E)) {
                                        var N = !1,
                                            K, F = 0;
                                        b: for (; F < m.length; F++)
                                            if (K = m[F], K.name === E) {
                                                N = !0;
                                                break b
                                            } N ? v.push(K) : v.push({
                                            name: E,
                                            alias: E,
                                            show: !0,
                                            type: "esriFieldTypeString"
                                        })
                                    }
                                }
                                u.datas = g;
                                u.fromClient = !1;
                                u.withGeometry = !1;
                                u.outFields = v;
                                u.formatDate = !0;
                                u.formatCodedValue = !0;
                                u.formatNumber = !1;
                                var G = [],
                                    A = [];
                                if (!a &&
                                    f && "undefined" !== typeof b) switch (e.type) {
                                    case "proximity":
                                        G.push(e.nlsCount);
                                        A.push(b);
                                        break;
                                    case "closest":
                                        var X = 0;
                                        r.forEach(b, n.hitch(this, function(a) {
                                            0 === X && (r.forEach(a, function(a) {
                                                G.push(a.label)
                                            }), X += 1);
                                            var b = [];
                                            r.forEach(a, function(a) {
                                                b.push(a.value)
                                            });
                                            A.push(b)
                                        }));
                                        break;
                                    case "summary":
                                        r.forEach(b, n.hitch(this, function(a) {
                                            var b = a.info.replace("\x3cbr/\x3e", ""),
                                                d = !1,
                                                c = 0;
                                            a: for (; c < e.calcFields.length; c++)
                                                if (b === e.calcFields[c].alias) {
                                                    d = !0;
                                                    break a
                                                } d && (G.push(b), A.push(a.total))
                                        }));
                                        break;
                                    case "grouped":
                                        r.forEach(b,
                                            function(a) {
                                                G.push(a.info.replace("\x3cbr/\x3e", ""));
                                                A.push(a.total)
                                            })
                                }
                                if (l) return {
                                    summaryLayer: c,
                                    details: v
                                };
                                k.exportCSVFromFeatureLayer(d, c, u);
                                return {
                                    summaryLayer: c,
                                    details: {
                                        appendColumns: G,
                                        appendDatas: A,
                                        name: d,
                                        type: e.nlsValue
                                    }
                                }
                            }
                            k.exportCSV(d, g, h)
                        },
                        isURL: function(c) {
                            return /(https?:\/\/|ftp:)/g.test(c)
                        },
                        isEmail: function(c) {
                            return /\S+@\S+\.\S+/.test(c)
                        },
                        queryTabCount: function() {},
                        performQuery: function() {},
                        getFilter: function(c, a) {
                            var f = "";
                            a.traversal(function(a) {
                                if (c === a.id && a.getFilter()) return f =
                                    a.getFilter(), !0
                            });
                            return f
                        },
                        getGeoms: function(c) {
                            for (var a = [], f = [], b = 0; b < c.length; b++) {
                                var e = c[b].geometry ? c[b].geometry : c[b];
                                if ("polygon" === e.type && -1 === a.indexOf(b)) {
                                    for (var d = 0; d < c.length; d++)
                                        if (d !== b && -1 === a.indexOf(d)) {
                                            var k = c[d].geometry ? c[d].geometry : c[d];
                                            "polygon" === k.type ? g.intersects(e, k) && (a.push(d), e = g.union(e, k)) : a.push(d)
                                        } f.push(e)
                                }
                            }
                            return f
                        },
                        createDefArray: function(c, a, f, b) {
                            for (var e = [], d = 0; d < c.length; d++) {
                                var g = c[d];
                                if (g) {
                                    var k = new l;
                                    k.returnGeometry = !1;
                                    k.geometry = a;
                                    var m = -1 === [null,
                                        void 0, ""
                                    ].indexOf(g.id) ? g.id : b.layers;
                                    k.where = this.getFilter(m, f);
                                    "undefined" !== typeof g.queryCount ? e.push(g.queryCount(k)) : "undefined" !== typeof g.queryIds ? e.push(g.queryIds(k)) : "undefined" !== typeof g.queryFeatures && e.push(g.queryFeatures(k))
                                }
                            }
                            return e
                        },
                        updateTabCount: function(c, a, f, b, e) {
                            var d = "undefined" !== typeof e && 0 < e ? !0 : !1;
                            e = v.position(a).w;
                            "undefined" !== typeof c && 0 === c ? (u.remove(a, "noFeatures"), u.remove(a, "noFeaturesActive"), u.add(a, d ? "noFeaturesActive" : "noFeatures")) : (d && u.contains(a, "noFeatures") &&
                                u.remove(a, "noFeatures"), d && u.contains(a, "noFeaturesActive") && u.remove(a, "noFeaturesActive"));
                            f && (c = "undefined" !== typeof c ? b + " (" + t.localizeNumber(c).toString() + ")" : b, a.innerHTML = c);
                            f = v.position(a).w;
                            c = 0;
                            var g;
                            f > e ? (g = !0, c = f - e) : e > f && (g = !1, c = e - f);
                            e = v.position(a.parentNode).w;
                            if (0 < e) {
                                g = g ? e + c : e - c;
                                m.set(a.parentNode, "width", g + "px");
                                a = a.parentNode.parentNode;
                                e = a.parentNode;
                                var h;
                                if (e && e.children && 0 < e.children.length)
                                    for (c = 0; c < e.children.length; c++)
                                        if (f = e.children[c], -1 < f.className.indexOf("SA_panelRight")) {
                                            h =
                                                f;
                                            break
                                        } h && a && (g > v.position(e).w ? (m.set(a, "right", "58px"), m.set(h, "display", "block")) : (m.set(a, "right", "24px"), m.set(h, "display", "none")))
                            }
                        },
                        getDistanceLabel: function(c, a, f) {
                            return Math.round(100 * c) / 100 + " " + a + " (" + f + ")"
                        },
                        getSum: function(c, a) {
                            var f = 0;
                            r.forEach(c, function(b) {
                                f += b.attributes[a]
                            });
                            return f
                        },
                        getMin: function(c, a) {
                            c.sort(x(a));
                            return c[0].attributes[a]
                        },
                        getMax: function(c, a) {
                            c.sort(x(a));
                            c.reverse();
                            return c[0].attributes[a]
                        },
                        getArea: function(c, a, f, b, e) {
                            var d = 0;
                            f = n.clone(f);
                            f.miles = 109413;
                            f.kilometers = 109414;
                            f.feet = 109405;
                            f.meters = 109404;
                            f.yards = 109442;
                            f.nauticalMiles = 109409;
                            var h = f[b],
                                k;
                            e && e.stats && e.stats.area && 0 < e.stats.area.length && (k = e.stats.area[0]);
                            r.forEach(c, function(b) {
                                for (var c = 0; c < a.length; c++) {
                                    var f = g.intersect(b.geometry, a[c]);
                                    if (null !== f) {
                                        var e = f.spatialReference;
                                        d = 4326 === e.wkid || e.isWebMercator() || e.isGeographic && e.isGeographic() ? d + g.geodesicArea(f, h) : d + g.planarArea(f, h)
                                    }
                                }
                            });
                            return this.formatNumber(d, k).total
                        },
                        getLength: function(c, a, f, b, e) {
                            var d = 0,
                                h = f[b],
                                k;
                            e && e.stats &&
                                e.stats.length && 0 < e.stats.length.length && (k = e.stats.length[0]);
                            r.forEach(c, function(b) {
                                for (var c = 0; c < a.length; c++) {
                                    var f = g.intersect(b.geometry, a[c]);
                                    if (null !== f) {
                                        var e = f.spatialReference;
                                        d = 4326 === e.wkid || e.isWebMercator() || e.isGeographic && e.isGeographic() ? d + g.geodesicLength(f, h) : d + g.planarLength(f, h)
                                    }
                                }
                            });
                            return this.formatNumber(d, k).total
                        },
                        getDistance: function(c, a, f) {
                            var b = "point" !== c.type ? c.getExtent().getCenter() : c;
                            a = "point" !== a.type ? a.getExtent().getCenter() : a;
                            b = new e([
                                [b.x, b.y],
                                [a.x, a.y]
                            ]);
                            b.spatialReference = c.spatialReference;
                            f = "nauticalMiles" === f ? "nautical-miles" : f;
                            return 4326 === c.spatialReference.wkid || c.spatialReference.isWebMercator() ? g.geodesicLength(b, f) : g.planarLength(b, f)
                        },
                        compareDistance: function(c, a) {
                            return c.attributes.DISTANCE < a.attributes.DISTANCE ? -1 : c.attributes.DISTANCE > a.attributes.DISTANCE ? 1 : 0
                        },
                        formatNumber: function(c, a) {
                            var f = c;
                            if (!isNaN(c) && null !== c && "" !== c) {
                                var f = a && a.modify && !isNaN(c),
                                    b;
                                f && "undefined" !== typeof a.truncatePlaces && !isNaN(a.truncatePlaces) && (b = new RegExp(0 <
                                    a.truncatePlaces ? "^\\d*[.]?\\d{0," + a.truncatePlaces + "}" : "^\\d*"));
                                f = f && a.round ? 1 * c.toFixed(a.roundPlaces) : f && a.truncate ? 1 * b.exec(c)[0] : c;
                                isNaN(f) && (f = 0)
                            }
                            return {
                                total: f,
                                num: isNaN(f) || null === f || "" === f ? f : t.localizeNumber(f)
                            }
                        }
                    }
                })
        },
        "widgets/SituationAwareness/js/CSVUtils": function() {
            define("exports dojo/_base/lang dojo/_base/array dojo/_base/html dojo/has dojo/Deferred jimu/utils esri/lang esri/tasks/QueryTask esri/tasks/query".split(" "), function(r, n, u, v, m, l, g, e, k, t) {
                function x(c) {
                    var a = n.clone(c.attributes);
                    (c = c.geometry) && "point" === c.type && ("x" in a ? a._x = c.x : a.x = c.x, "y" in a ? a._y = c.y : a.y = c.y);
                    return a
                }
                r.exportCSV = function(c, a, f, b, e) {
                    return r._createCSVStr(a, f, b, e).then(function(a) {
                        return r._download(c + ".csv", a)
                    })
                };
                r.exportCalculatedResultsCSV = function(c, a) {
                    var f = "",
                        b = 0;
                    u.forEach(a, function(e) {
                        f += e.name + " (" + e.type + ")\r\n";
                        r._createCSVStr([], [], e.appendColumns, e.appendDatas).then(function(d) {
                            f += d;
                            b++;
                            if (b === a.length) return r._download(c + ".csv", f);
                            f += "\r\n\r\n"
                        })
                    })
                };
                r.exportCSVFromFeatureLayer = function(c,
                    a, f) {
                    f = f || {};
                    return r._getExportData(a, {
                        datas: f.datas,
                        fromClient: f.fromClient,
                        withGeometry: f.withGeometry,
                        outFields: f.outFields,
                        filterExpression: f.filterExpression
                    }).then(function(b) {
                        return r._formattedData(a, b, {
                            formatNumber: f.formatNumber,
                            formatDate: f.formatDate,
                            formatCodedValue: f.formatCodedValue,
                            popupInfo: f.popupInfo,
                            appendColumns: f.appendColumns,
                            appendDatas: f.appendDatas
                        }).then(function(a) {
                            return r.exportCSV(c, a.datas, a.columns, a.appendColumns, a.appendDatas)
                        })
                    })
                };
                r.exportCSVByAttributes = function(c,
                    a, f, b) {
                    b = n.mixin({}, b);
                    b.datas = f;
                    return r.exportCSVFromFeatureLayer(c, a, b)
                };
                r.exportCSVByGraphics = function(c, a, f, b) {
                    f = u.map(f, function(a) {
                        return a.attributes
                    });
                    return r.exportCSVByAttributes(c, a, f, b)
                };
                r._createCSVStr = function(c, a, f, b) {
                    var e = new l,
                        d = "",
                        g = 0,
                        k = 0,
                        m = "",
                        n = "";
                    try {
                        if (a && 0 < a.length) {
                            u.forEach(a, function(a) {
                                d = d + m + a;
                                m = ","
                            });
                            for (var d = d + "\r\n", g = c.length, k = a.length, t = 0; t < g; t++) {
                                for (var m = "", r = 0; r < k; r++)(n = c[t][a[r]]) || "number" === typeof n || (n = ""), n && /[",\r\n]/g.test(n) && (n = '"' + n.replace(/(")/g,
                                    '""') + '"'), d = d + m + n, m = ",";
                                d += "\r\n"
                            }
                        }
                        "undefined" !== typeof f && "undefined" !== typeof b && 0 < f.length && 0 < b.length && (m = "", u.forEach(f, function(a) {
                            d = d + m + a;
                            m = ","
                        }), m = "", d += "\r\n", u.forEach(b, function(a) {
                            Array.isArray(a) ? (u.forEach(a, function(a) {
                                d = d + m + a;
                                m = ","
                            }), m = "", d += "\r\n") : (d = d + m + a, m = ",")
                        }));
                        e.resolve(d)
                    } catch (I) {
                        console.error(I), e.resolve("")
                    }
                    return e
                };
                r._isIE11 = function() {
                    return 11 === g.has("ie")
                };
                r._isEdge = function() {
                    return g.has("edge")
                };
                r._getDownloadUrl = function(c) {
                    return window.Blob && window.URL && window.URL.createObjectURL ?
                        (c = new Blob(["\ufeff" + c], {
                            type: "text/csv"
                        }), URL.createObjectURL(c)) : "data:attachment/csv;charset\x3dutf-8,\ufeff" + encodeURIComponent(c)
                };
                r._download = function(c, a) {
                    var f = new l;
                    try {
                        if (m("ie") && 10 > m("ie")) {
                            var b = window.top.open("about:blank", "_blank");
                            b.document.write("sep\x3d,\r\n" + a);
                            b.document.close();
                            b.document.execCommand("SaveAs", !0, c);
                            b.close()
                        } else if (10 === m("ie") || r._isIE11() || r._isEdge()) {
                            var e = new Blob(["\ufeff" + a], {
                                type: "text/csv"
                            });
                            navigator.msSaveBlob(e, c)
                        } else {
                            var d = v.create("a", {
                                href: r._getDownloadUrl(a),
                                target: "_blank",
                                download: c
                            }, document.body);
                            if (m("safari")) {
                                var g = document.createEvent("MouseEvents");
                                g.initEvent("click", !0, !0);
                                d.dispatchEvent(g)
                            } else d.click();
                            v.destroy(d)
                        }
                        f.resolve()
                    } catch (w) {
                        f.reject(w)
                    }
                    return f
                };
                r._getExportData = function(c, a) {
                    var f = new l,
                        b = null,
                        e = a.datas,
                        d = a.withGeometry,
                        b = a.outFields;
                    b && b.length || (b = c.fields);
                    b = n.clone(b);
                    if (d && !(e && 0 < e.length)) {
                        var g = "",
                            g = -1 !== b.indexOf("x") ? "_x" : "x";
                        b.push({
                            name: g,
                            alias: g,
                            format: {
                                digitSeparator: !1,
                                places: 6
                            },
                            show: !0,
                            type: "esriFieldTypeDouble"
                        });
                        g = -1 !== b.indexOf("y") ? "_y" : "y";
                        b.push({
                            name: g,
                            alias: g,
                            format: {
                                digitSeparator: !1,
                                places: 6
                            },
                            show: !0,
                            type: "esriFieldTypeDouble"
                        })
                    }
                    e && 0 < e.length ? f.resolve({
                        data: e || [],
                        outFields: b
                    }) : a.fromClient ? (e = u.map(c.graphics, function(a) {
                        return d ? x(a) : n.clone(a)
                    }), f.resolve({
                        data: e || [],
                        outFields: b
                    })) : r._getExportDataFromServer(c, b, a).then(function(a) {
                        f.resolve({
                            data: a || [],
                            outFields: b
                        })
                    });
                    return f
                };
                r._getExportDataFromServer = function(c, a, f) {
                    var b = new l;
                    if ("esri.layers.FeatureLayer" !== c.declaredClass) return b.resolve([]),
                        b;
                    var e = new k(c.url),
                        d = new t;
                    d.where = f.filterExpression || c.getDefinitionExpression && c.getDefinitionExpression() || "1\x3d1";
                    0 < a.length ? (c = u.map(a, function(a) {
                        return a.name
                    }), d.outFields = c) : d.outFields = ["*"];
                    d.returnGeometry = f.withGeometry;
                    e.execute(d, function(a) {
                        a = u.map(a.features, function(a) {
                            return x(a)
                        });
                        b.resolve(a)
                    }, function(a) {
                        console.error(a);
                        b.resolve([])
                    });
                    return b
                };
                r._formattedData = function(c, a, f) {
                    var b = new l,
                        e = [],
                        d = a.data;
                    a = a.outFields;
                    for (var k = g.getFeatureLayerDefinition(c), m = 0, n = d.length; m <
                        n; m++) {
                        for (var t = {}, v = 0; v < a.length; v++) {
                            var z = a[v];
                            t[z.alias || z.name] = r._getExportValue(d[m][z.name], z, c.objectIdField, c.typeIdField, d[m][c.typeIdField], c.types, f, k, d[m], c)
                        }
                        e.push(t)
                    }
                    c = u.map(a, function(a) {
                        return a.alias || a.name
                    });
                    b.resolve({
                        datas: e,
                        columns: c,
                        appendColumns: f.appendColumns,
                        appendDatas: f.appendDatas
                    });
                    return b
                };
                r._getExportValue = function(c, a, f, b, h, d, k, l, m, n) {
                    function q(a) {
                        if (t && e.isDefined(t.fieldInfos))
                            for (var b = 0, d = t.fieldInfos.length; b < d; b++) {
                                var c = t.fieldInfos[b];
                                if (c.fieldName ===
                                    a) return c.format
                            }
                        return null
                    }
                    var t = k.popupInfo,
                        r = !!a.domain && k.formatCodedValue;
                    k = "esriFieldTypeDate" === a.type && k.formatDate;
                    var w = f && a.name === f;
                    b = b && a.name === b;
                    n = n && n.renderer ? n : l;
                    return k ? g.fieldFormatter.getFormattedDate(c, q(a.name)) : (b || r) && l && m && (l = g.getDisplayValueForCodedValueOrSubtype(n, a.name, m)) && l.hasOwnProperty("displayValue") ? l.displayValue : r || k || w || b ? c : (r = null, f && d && 0 < d.length && (f = (f = u.filter(d, function(a) {
                            return a.id === h
                        })) && f[0]) && f.domains && f.domains[a.name] && f.domains[a.name].codedValues &&
                        (a = g.getDisplayValueForCodedValueOrSubtype(n, a.name, m)) && a.hasOwnProperty("displayValue") && (r = a.displayValue), null !== r ? r : c)
                }
            })
        },
        "widgets/SituationAwareness/js/GroupedCountInfo": function() {
            define("dojo/_base/declare dojo/Evented dojo/_base/array dojo/DeferredList dojo/Deferred dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/on jimu/utils jimu/dijit/Message esri/graphic esri/layers/FeatureLayer esri/tasks/query ./analysisUtils".split(" "), function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b) {
                return r("GroupedCountInfo",
                    [n], {
                        summaryLayer: null,
                        summaryFields: [],
                        summaryIds: [],
                        summaryFeatures: [],
                        tabNum: null,
                        popupFields: [],
                        groupedResults: {},
                        specialFields: null,
                        dateFields: {},
                        symbolField: null,
                        graphicsLayer: null,
                        lyrRenderer: null,
                        lyrSymbol: null,
                        featureCount: 0,
                        incidentCount: 0,
                        displayCount: !1,
                        allFields: !1,
                        constructor: function(a, b, c) {
                            this.tab = a;
                            this.container = b;
                            this.parent = c;
                            this.config = c.config;
                            this.graphicsLayer = null;
                            this.specialFields = {};
                            this.typeIdField = "";
                            this.types = [];
                            this.dateFields = {};
                            this.baseLabel = "" !== a.label ? a.label :
                                a.layerTitle ? a.layerTitle : a.layers
                        },
                        queryTabCount: function(b, d, c, f) {
                            var e = new m;
                            this.displayCount = f;
                            this.incidentCount = b.length;
                            var g = [this.tab.tabLayers[0]];
                            this.mapServiceLayer && 1 < this.tab.tabLayers.length && (g = [this.tab.tabLayers[1]]);
                            if (0 < this.tab.tabLayers.length && this.tab.tabLayers[0].url && -1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                                this.mapServiceLayer = !0;
                                var h;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer = this.tab.tabLayers[0], this.summaryLayer.hasOwnProperty("loaded") &&
                                    this.summaryLayer.loaded ? (this.summaryFields = this._getFields(this.summaryLayer), this._performQuery(b, d, c, f, g).then(function(a) {
                                        e.resolve(a)
                                    })) : (h = new a(this.summaryLayer.url), h.infoTemplate = this.tab.tabLayers[0].infoTemplate, g = [h], this.tab.tabLayers = g, k(h, "load", l.hitch(this, function() {
                                        this.summaryLayer = h;
                                        this.summaryFields = this._getFields(this.summaryLayer);
                                        this._performQuery(b, d, c, f, g).then(function(a) {
                                            e.resolve(a)
                                        })
                                    })))) : this.loading || (h = new a(this.tab.tabLayers[0].url), this.loading = !0, k(h, "load",
                                    l.hitch(this, function() {
                                        this.summaryLayer = h;
                                        this.summaryFields = this._getFields(this.summaryLayer);
                                        for (var a = this.tab.tabLayers[0].url.split("MapServer/")[1], k = this.parent.map.itemInfo.itemData.operationalLayers, l = 0; l < k.length; l++) {
                                            var m = k[l];
                                            if (-1 < this.tab.tabLayers[0].url.indexOf(m.url) && "undefined" !== typeof m.layerObject)
                                                if (m.layerObject.infoTemplates) {
                                                    if (m = m.layerObject.infoTemplates[a]) {
                                                        h.infoTemplate = m.infoTemplate;
                                                        break
                                                    }
                                                } else if (m.layerObject.infoTemplate) {
                                                h.infoTemplate = m.layerObject.infoTemplate;
                                                break
                                            }
                                        }
                                        g = [h];
                                        this.tab.tabLayers = g;
                                        this.loading = !1;
                                        this._performQuery(b, d, c, f, g).then(function(a) {
                                            e.resolve(a)
                                        })
                                    })))
                            }
                            this.mapServiceLayer || this._performQuery(b, d, c, f, g).then(function(a) {
                                e.resolve(a)
                            });
                            return e
                        },
                        _performQuery: function(a, d, c, f, e) {
                            var g = new m,
                                h = [],
                                k, q;
                            0 < d.length ? q = b.getGeoms(d) : 0 < a.length && (q = b.getGeoms(a));
                            this.summaryGeoms = q;
                            if (0 < q.length)
                                for (a = 0; a < q.length; a++) h = q[a], d = b.createDefArray(e, h, this.parent.opLayers, this.tab), k = 0 === a ? h = d : h = k.concat(d);
                            (new v(h)).then(l.hitch(this, function(a) {
                                for (var b =
                                        0, d = 0; d < a.length; d++) {
                                    var e = a[d][1];
                                    isNaN(e) ? e && e.features ? b += e.features.length : e && "undefined" !== typeof e.length && (b += e.length) : b += e
                                }
                                this.updateTabCount(b, c, f);
                                this.queryOnLoad && l.hitch(this, this._queryFeatures(this.summaryGeoms));
                                g.resolve(b)
                            }));
                            return g
                        },
                        updateTabCount: function(a, d, c) {
                            this.displayCount = c;
                            this.featureCount = a;
                            b.updateTabCount(this.featureCount, d, c, this.baseLabel, this.incidentCount)
                        },
                        updateForIncident: function(b, d, c, f, e, n, t) {
                            this.incidentCount = b.length;
                            this.allFields = "undefined" !==
                                typeof n && "undefined" !== typeof t ? n ? !0 : t : !1;
                            var h = "undefined" !== typeof e,
                                q;
                            this.tabNum = f;
                            h ? q = new m : (this.container.innerHTML = "", g.add(this.container, "loading"));
                            this.summaryIds = [];
                            this.summaryFeatures = [];
                            this.groupedResults = {};
                            if (0 < this.tab.tabLayers.length) {
                                var u = [];
                                if (0 < d.length) u = d;
                                else
                                    for (d = 0; d < b.length; d++) f = b[d].geometry ? b[d].geometry : b[d], "polygon" === f.type && u.push(f);
                                var r;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer = this.tab.tabLayers[0], r = new a(this.summaryLayer.url),
                                    r.infoTemplate = this.tab.tabLayers[0].infoTemplate, this.tab.tabLayers[1] = r, this.summaryFields = this._getFields(this.tab.tabLayers[0]), h ? this._queryFeatures(u, h).then(function(a) {
                                        q.resolve(a)
                                    }) : (this._initGraphicsLayer(c), l.hitch(this, this._queryFeatures(u)))) : (r = new a(this.tab.tabLayers[0].url), k(r, "load", l.hitch(this, function() {
                                    this.summaryLayer = r;
                                    if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer"))
                                        for (var a = this.tab.tabLayers[0].url.split("MapServer/")[1], b = this.parent.map.itemInfo.itemData.operationalLayers,
                                                d = 0; d < b.length; d++) {
                                            var f = b[d];
                                            if (-1 < this.tab.tabLayers[0].url.indexOf(f.url) && "undefined" !== typeof f.layerObject && f.layerObject.infoTemplates && (f = f.layerObject.infoTemplates[a])) {
                                                r.infoTemplate = f.infoTemplate;
                                                break
                                            }
                                        }
                                    this.tab.tabLayers[1] = r;
                                    this.summaryLayer = this.tab.tabLayers[1];
                                    this.summaryFields = this._getFields(this.tab.tabLayers[1]);
                                    h ? this._queryFeatures(u, h).then(function(a) {
                                        q.resolve(a)
                                    }) : (this._initGraphicsLayer(c), l.hitch(this, this._queryFeatures(u)))
                                })));
                                if (h) return q
                            }
                        },
                        _initGraphicsLayer: function(a) {
                            null !==
                                a && (this.graphicsLayer = a, this.graphicsLayer.clear(), this.summaryLayer && this.summaryLayer.renderer && (this.lyrRenderer = this.summaryLayer.renderer, this.graphicsLayer.renderer = this.lyrRenderer, "undefined" !== typeof this.summaryLayer.renderer.attributeField ? this.symbolField = this.summaryLayer.renderer.attributeField : this.lyrSymbol = this.lyrRenderer.symbol))
                        },
                        _queryFeatures: function(a, d) {
                            var c;
                            d && (c = new m);
                            for (var e = [], g = -1 === [null, void 0, ""].indexOf(this.tab.tabLayers[0].id) ? this.tab.tabLayers[0].id : this.tab.layers,
                                    g = b.getFilter(g, this.parent.opLayers), h = new f, k = 0; k < a.length; k++) h.geometry = a[k], h.where = g, e.push(this.summaryLayer.queryIds(h));
                            (new v(e)).then(l.hitch(this, function(a) {
                                for (var b, f, e = 0; e < a.length; e++) a[e][0] && (b = a[e][1], f = b = 0 === e ? b : f.concat(b));
                                b ? (this.summaryIds = b, 0 < this.summaryIds.length ? d ? this._queryFeaturesByIds(d).then(function(a) {
                                    c.resolve(a)
                                }) : this._queryFeaturesByIds() : d || this._processResults()) : d || this._processResults()
                            }), l.hitch(this, function(a) {
                                console.error(a);
                                new x({
                                    message: a
                                })
                            }));
                            if (d) return c
                        },
                        _queryFeaturesByIds: function(a) {
                            var d, c = [];
                            a && (d = new m);
                            var e = this.summaryLayer.maxRecordCount || 1E3,
                                h = this.summaryIds.slice(0, e);
                            this.summaryIds.splice(0, e);
                            var k = new f,
                                n = -1 === [null, void 0, ""].indexOf(this.summaryLayer.id) ? this.summaryLayer.id : this.tab.layers;
                            k.where = b.getFilter(n, this.parent.opLayers);
                            var t = !1;
                            u.some(this.summaryFields, l.hitch(this, function(a) {
                                if ("area" === a.type || "length" === a.type || this.graphicsLayer) return t = !0
                            }));
                            a && (t = !0);
                            this.summaryLayer.supportsAdvancedQueries && (k.orderByFields = [this.summaryFields[0].field]);
                            k.returnGeometry = t;
                            k.outSpatialReference = this.parent.map.spatialReference;
                            k.outFields = ["*"];
                            k.objectIds = h;
                            for (c.push(this.summaryLayer.queryFeatures(k)); 0 < this.summaryIds.length;) h = this.summaryIds.slice(0, e), this.summaryIds.splice(0, e), k.objectIds = h, c.push(this.summaryLayer.queryFeatures(k));
                            (new v(c)).then(l.hitch(this, function(b) {
                                this.summaryFeatures = [];
                                for (var c = 0; c < b.length; c++)
                                    if (b[c][0]) {
                                        var f = b[c][1];
                                        f.features && (this.summaryFeatures = this.summaryFeatures.concat(f.features))
                                    } a ?
                                    this._processResults(a).then(l.hitch(this, function(a) {
                                        this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing");
                                        d.resolve(a)
                                    })) : (this._processResults(), this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing"));
                                this.SA_SAT_download && g.replace(this.SA_SAT_download, "download", "processing")
                            }), l.hitch(this, function(a) {
                                console.error(a);
                                new x({
                                    message: a
                                })
                            }));
                            if (a) return d
                        },
                        _prepGroupedResults: function() {
                            for (var a = 0; a < this.summaryFeatures.length; a++) {
                                var d = this.summaryFeatures[a];
                                if ("undefined" !== typeof this.summaryFields && 0 < this.summaryFields.length) {
                                    var c = b.getFieldValue(this.summaryFields[0].field, d.attributes[this.summaryFields[0].field], this.specialFields, this.dateFields, "longMonthDayYear", this.typeIdField, this.types, this.layerObject && this.layerObject.renderer ? this.layerObject : this.layerDefinition, d.attributes),
                                        c = "undefined" !== typeof c && null !== c ? t.stripHTML(c.toString()) : "";
                                    c in this.groupedResults ? this.groupedResults[c].features.push(d) : this.groupedResults[c] = {
                                        features: [d]
                                    }
                                }
                            }
                        },
                        _prepResults: function() {
                            for (var a in this.groupedResults) {
                                var b = this.summaryFields[0];
                                b.total = this.groupedResults[a].features.length;
                                this.groupedResults[a].total = b.total;
                                this.groupedResults[a].type = b.type;
                                this.groupedResults[a].label = b.alias
                            }
                        },
                        _processResults: function(a) {
                            this._prepGroupedResults();
                            this._prepResults();
                            var b = this.groupedResults,
                                f = 0,
                                h, n;
                            if (a) n = new m;
                            else {
                                this.container.innerHTML = "";
                                g.remove(this.container, "loading");
                                if (0 === Object.keys(this.groupedResults).length) {
                                    this.container.innerHTML =
                                        this.parent.nls.noFeaturesFound;
                                    return
                                }
                                var u = Object.keys(this.groupedResults).length + 1;
                                h = e.create("div", {
                                    style: "width:" + 220 * u + "px;"
                                }, this.container);
                                g.add(h, "SAT_tabPanelContent");
                                u = e.create("div", {}, h);
                                g.add(u, "SATcolExport");
                                g.add(u, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder");
                                u = e.create("div", {
                                    "data-dojo-attach-point": "SA_SAT_download",
                                    title: this.parent.nls.downloadCSV
                                }, u);
                                g.add(u, [this.parent.isBlackTheme ? "btnExportBlack" : "btnExport", "download"]);
                                k(u, "click", l.hitch(this, this._exportToCSV,
                                    b))
                            }
                            var r = Object.keys(b).sort(),
                                u = [];
                            this.displayCount && u.push({
                                total: this.featureCount,
                                a: void 0,
                                info: this.parent.nls.count,
                                c: void 0
                            });
                            for (var z in r) {
                                var f = r[z],
                                    v = b[f],
                                    x = t.stripHTML(f.toString()),
                                    f = v.total;
                                isNaN(f) && (f = 0);
                                var f = t.localizeNumber(f),
                                    E = "pre" === v.type ? v.label.trim() : x,
                                    x = "pre" === v.type ? x : v.label.trim(),
                                    v = "" !== v.label ? "colGroupedSummary" : "colSummary";
                                if (a) u.push({
                                    total: f,
                                    a: E,
                                    info: "" === x ? E : x,
                                    c: v
                                });
                                else {
                                    var N = e.create("div", {
                                        "class": "SATcol"
                                    }, h);
                                    g.add(N, this.parent.lightTheme ? "lightThemeBorder" :
                                        "darkThemeBorder");
                                    var K = e.create("div", {
                                        style: "max-height: 45px;"
                                    }, N);
                                    e.create("div", {
                                        "class": "SATcolWrap",
                                        style: "max-height: 30px; overflow: hidden;",
                                        innerHTML: E
                                    }, K);
                                    e.create("div", {
                                        "class": "SATcolWrap",
                                        style: "max-height: 30px; overflow: hidden;",
                                        innerHTML: x
                                    }, K);
                                    e.create("div", {
                                        "class": v,
                                        innerHTML: f
                                    }, N)
                                }
                            }
                            b = [];
                            z = null !== this.graphicsLayer;
                            !a && z && (this.graphicsLayer.clear(), this.tab.tabLayers[1] && this.tab.tabLayers[1].clear());
                            if (this.summaryFeatures)
                                for (h = 0; h < this.summaryFeatures.length; h++) r = this.summaryFeatures[h],
                                    this.lyrSymbol ? r.symbol = this.lyrSymbol : this.graphicsLayer ? this.graphicsLayer.renderer && (f = this.graphicsLayer.renderer.getSymbol(r), r.symbol = f) : this.summaryLayer.renderer && this.summaryLayer.renderer.getSymbol && (r.symbol = this.summaryLayer.renderer.getSymbol(r)), r = r.toJson ? new c(r.toJson()) : r, !a && z ? (this.graphicsLayer.add(r), this.tab.tabLayers[1].add(r)) : b.push(r);
                            !a && z && (this.graphicsLayer.setVisibility(!0), this.parent._toggleTabLayersNew(this.tabNum), this.tab.retsore && this.emit("summary-complete", {
                                bubbles: !0,
                                cancelable: !0,
                                tab: this.tabNum
                            }));
                            if (a) return n.resolve({
                                graphics: b,
                                analysisResults: u,
                                context: this
                            }), n
                        },
                        _exportToCSV: function(a, d, c, f) {
                            a = b.exportToCSV(this.summaryFeatures, d, c, f, {
                                type: "grouped",
                                baseLabel: this.baseLabel,
                                csvAllFields: this.parent.config.csvAllFields,
                                layer: this.summaryLayer,
                                opLayers: this.parent.opLayers,
                                nlsValue: this.parent.nls.groupedSummary,
                                nlsCount: this.parent.nls.count,
                                summaryFields: this.summaryFields
                            });
                            this.summaryLayer = a.summaryLayer;
                            return a.details
                        },
                        _getFields: function(a) {
                            this.layerDefinition =
                                t.getFeatureLayerDefinition(a);
                            this.layerObject = a;
                            var d = b.getSkipFields(a),
                                c, f = [];
                            if ("undefined" !== typeof this.tab.advStat) {
                                var e = this.tab.advStat.stats,
                                    g;
                                for (g in e) 0 < e[g].length && u.forEach(e[g], function(a) {
                                    var b = {
                                        field: a.expression,
                                        alias: a.label + "",
                                        type: g,
                                        total: 0
                                    };
                                    c = a.expression;
                                    f.push(b)
                                })
                            }
                            e = b.getSpecialFields(a);
                            this.dateFields = e.dateFields;
                            this.specialFields = e.specialFields;
                            this.typeIdField = e.typeIdField;
                            this.types = e.types;
                            if (this.allFields)
                                for (e = 0; e < a.fields.length; e++) {
                                    var h = a.fields[e]; - 1 ===
                                        d.indexOf(h.name) && c !== h.name && f.push({
                                            field: h.name,
                                            alias: h.alias,
                                            type: h.type
                                        })
                                }
                            return f
                        }
                    })
            })
        },
        "widgets/SituationAwareness/js/ClosestInfo": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/Color dojo/_base/array dojo/DeferredList dojo/Deferred dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/on jimu/utils esri/geometry/geometryEngine esri/graphic esri/Color esri/layers/FeatureLayer esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/symbols/Font esri/symbols/TextSymbol esri/tasks/query ./analysisUtils".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C) {
                    return r("ClosestInfo", null, {
                        featureCount: 0,
                        mapServiceLayer: !1,
                        loading: !1,
                        queryOnLoad: !1,
                        incidentCount: 0,
                        constructor: function(a, b, d) {
                            this.tab = a;
                            this.container = b;
                            this.parent = d;
                            this.graphicsLayer = this.incident = null;
                            this.map = d.map;
                            this.specialFields = {};
                            this.typeIdField = "";
                            this.types = [];
                            this.dateFields = {};
                            this.config = d.config;
                            this.baseLabel = "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers
                        },
                        queryTabCount: function(b, d, c, f) {
                            var e = new l;
                            this.incidentCount =
                                b.length;
                            var g = this.parent.config.distanceSettings[this.parent.config.distanceUnits],
                                k = this.parent.config.maxDistance;
                            d = [];
                            for (var m = 0; m < b.length; m++) d.push(a.buffer(b[m].geometry, k, g));
                            var q = [this.tab.tabLayers[0]];
                            this.mapServiceLayer && 1 < this.tab.tabLayers.length && (q = [this.tab.tabLayers[1]]);
                            if (0 < this.tab.tabLayers.length && this.tab.tabLayers[0].url && -1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                                this.mapServiceLayer = !0;
                                var t;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer =
                                        this.tab.tabLayers[0], this.summaryLayer.hasOwnProperty("loaded") && this.summaryLayer.loaded ? (this.summaryFields = this._getFields(this.summaryLayer), this._performQuery(b, d, c, f, q).then(function(a) {
                                            e.resolve(a)
                                        })) : (t = new h(this.summaryLayer.url), t.infoTemplate = this.tab.tabLayers[0].infoTemplate, q = [t], this.tab.tabLayers = q, x(t, "load", n.hitch(this, function() {
                                            this.summaryLayer = t;
                                            this.summaryFields = this._getFields(this.summaryLayer);
                                            this._performQuery(b, d, c, f, q).then(function(a) {
                                                e.resolve(a)
                                            })
                                        })))) : this.loading ||
                                    (t = new h(this.tab.tabLayers[0].url), this.loading = !0, x(t, "load", n.hitch(this, function() {
                                        this.summaryLayer = t;
                                        this.summaryFields = this._getFields(this.summaryLayer);
                                        for (var a = this.tab.tabLayers[0].url.split("MapServer/")[1], g = this.parent.map.itemInfo.itemData.operationalLayers, h = 0; h < g.length; h++) {
                                            var k = g[h];
                                            if (-1 < this.tab.tabLayers[0].url.indexOf(k.url) && "undefined" !== typeof k.layerObject && k.layerObject.infoTemplates && (k = k.layerObject.infoTemplates[a])) {
                                                t.infoTemplate = k.infoTemplate;
                                                break
                                            }
                                        }
                                        q = [t];
                                        this.tab.tabLayers =
                                            q;
                                        this.loading = !1;
                                        this._performQuery(b, d, c, f, q).then(function(a) {
                                            e.resolve(a)
                                        })
                                    })))
                            }
                            this.mapServiceLayer || this._performQuery(b, d, c, f, q).then(function(a) {
                                e.resolve(a)
                            });
                            return e
                        },
                        _performQuery: function(a, b, d, c, f) {
                            var e = new l,
                                g = [],
                                h, k;
                            this.summaryGeoms = b;
                            if (0 < b.length)
                                for (a = 0; a < b.length; a++) g = b[a], k = C.createDefArray(f, g, this.parent.opLayers, this.tab), h = 0 === a ? g = k : g = h.concat(k);
                            (new m(g)).then(n.hitch(this, function(a) {
                                for (var b = 0, f = 0; f < a.length; f++) {
                                    var g = a[f][1];
                                    isNaN(g) ? g && g.features ? 0 < g.features.length &&
                                        (b += 1) : g && "undefined" !== typeof g.length && 0 < g.length && (b += 1) : 0 < g && (b += 1)
                                }
                                this.updateTabCount(b, d, c);
                                e.resolve(b)
                            }));
                            return e
                        },
                        updateTabCount: function(a, b, d) {
                            this.featureCount = 0 === parseInt(a, 10) ? 0 : a;
                            C.updateTabCount(this.featureCount, b, d, this.baseLabel, this.incidentCount)
                        },
                        updateForIncident: function(a, b, d, c, f, e) {
                            this.incidentCount = a.length;
                            this.allFields = "undefined" !== typeof f && "undefined" !== typeof e ? f ? !0 : e : !1;
                            var g = "undefined" !== typeof c,
                                k;
                            v.forEach(this.tab.tabLayers, n.hitch(this, function(f) {
                                g && (k =
                                    new l);
                                if (f.url) {
                                    var e = new h(f.url, {
                                        mode: h.MODE_ONDEMAND,
                                        infoTemplate: f.infoTemplate
                                    });
                                    x(e, "load", n.hitch(this, function() {
                                        this.tab.tabLayers = [e];
                                        g ? this.processIncident(a, b, d, c).then(n.hitch(this, function(a) {
                                            k.resolve(a)
                                        }), n.hitch(this, function(a) {
                                            console.error(a);
                                            k.reject(a)
                                        })) : this.processIncident(a, b, d, c)
                                    }))
                                } else g ? this.processIncident(a, b, d, c).then(n.hitch(this, function(a) {
                                    k.resolve(a)
                                }), n.hitch(this, function(a) {
                                    console.error(a);
                                    k.reject(a)
                                })) : this.processIncident(a, b, d, c)
                            }));
                            if (g) return k
                        },
                        processIncident: function(b,
                            d, c, e) {
                            this.incidents = b;
                            var h, k = "undefined" !== typeof e;
                            k ? h = new l : (this.container.innerHTML = "", g.add(this.container, "loading"));
                            var q = [];
                            e = this.parent.config.distanceSettings[this.parent.config.distanceUnits];
                            for (var t = [], u = 0; u < b.length; u++) {
                                var r = b[u].geometry,
                                    w = a.buffer(r, d, e);
                                t.push({
                                    geometry: r,
                                    buffer: w
                                })
                            }(this.graphicsLayer = c) && this.graphicsLayer.clear();
                            b = [];
                            d = this.tab.tabLayers[0];
                            c = -1 === [null, void 0, ""].indexOf(d.id) ? d.id : this.tab.layers;
                            c = C.getFilter(c, this.parent.opLayers);
                            var v = this._getFields(d);
                            for (e = 0; e < t.length; e++) u = new M, u.returnGeometry = !0, u.outSpatialReference = this.parent.map.spatialReference, u.geometry = t[e].buffer, u.where = c, u.outFields = ["*"], "undefined" !== typeof d.queryFeatures && b.push(d.queryFeatures(u));
                            (new m(b)).then(n.hitch(this, function(a) {
                                for (var b = 0; b < a.length; b++)
                                    if (a[b][0]) {
                                        var d = a[b][1].features,
                                            c = [],
                                            e = t[b].geometry;
                                        if (d && 0 < d.length) {
                                            for (var g = 0; g < d.length; g++) {
                                                for (var l = new f(d[g].toJson()), m = C.getDistance(e, l.geometry, this.parent.config.distanceUnits), u = {
                                                            DISTANCE: m
                                                        },
                                                        r = 0; r < v.length; r++) u[v[r]] = l.attributes[v[r]];
                                                !0 === this.config.csvAllFields || "true" === this.config.csvAllFields ? l.attributes.DISTANCE = m : l.attributes = u;
                                                c.push(l)
                                            }
                                            c.sort(C.compareDistance);
                                            q.push(c[0])
                                        }
                                    } else a[b][1] && a[b][1].message && console.log(a[b][1].message);
                                q.sort(C.compareDistance);
                                k ? this._processResults(q, !0).then(n.hitch(this, function(a) {
                                    h.resolve(a)
                                })) : this._processResults(q)
                            }), n.hitch(this, function(a) {
                                console.error(a);
                                h.reject(a)
                            }));
                            if (k) return h
                        },
                        _processResults: function(a, h) {
                            var m, r, v = a &&
                                0 < a.length;
                            if (v && "point" !== a[0].geometry.type)
                                for (var z = a.length - 1; 0 <= z; z--) "undefined" === typeof a[z].geometry.getExtent() && a.splice(z, 1);
                            h ? m = new l : (this.container.innerHTML = "", g.remove(this.container, "loading"), v && (r = e.create("div", {
                                "class": "SAT_tabPanelContent"
                            }, this.container), z = e.create("div", {}, r), g.add(z, "SATcolExport"), g.add(z, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"), z = e.create("div", {
                                title: this.parent.nls.downloadCSV
                            }, z), g.add(z, "btnExport"), x(z, "click", n.hitch(this, this._exportToCSV,
                                a))));
                            var z = this.parent.nls[this.parent.config.distanceUnits],
                                F = [],
                                G = 220;
                            if (v)
                                for (var A = 0; A < a.length; A++) {
                                    var I = A + 1,
                                        H = a[A],
                                        D = H.geometry,
                                        y = D;
                                    "point" !== D.type && (y = D.getExtent().getCenter());
                                    var D = H.attributes,
                                        M;
                                    "point" === this.incidents[0].geometry.type && (M = Math.round(100 * D.DISTANCE) / 100 + " " + z + " (" + this.parent.nls.approximate + ")");
                                    var R = "",
                                        O = 0,
                                        T = [];
                                    if ("undefined" !== typeof this.displayFields)
                                        for (var W = 0; W < this.displayFields.length; W++) {
                                            var U = this.displayFields[W],
                                                J;
                                            a: for (J in D)
                                                if ("DISTANCE" !== J && 3 > O &&
                                                    U.expression === J) {
                                                    var L = C.getFieldValue(J, D[J], this.specialFields, this.dateFields, "longMonthDayYear", this.typeIdField, this.types, this.layerObject && this.layerObject.renderer ? this.layerObject : this.layerDefinition, D, U),
                                                        L = "undefined" !== typeof L && null !== L ? c.stripHTML(L.toString()) : "",
                                                        P = "undefined" !== typeof U.label && "" !== U.label ? U.label : void 0,
                                                        V = H._layer && H._layer.fields ? H._layer.fields : this.tab.tabLayers && this.tab.tabLayers[0] ? this.tab.tabLayers[0].fields : void 0;
                                                    V && "undefined" === typeof P && (V = C.getField(V,
                                                        J)) && (P = V.alias);
                                                    if ("undefined" === typeof P || P in ["", " ", null, void 0]) P = J;
                                                    C.isURL(L) ? L = '\x3ca href\x3d"' + L + '" target\x3d"_blank" style\x3d"color: inherit;"\x3e' + P + "\x3c/a\x3e" : C.isEmail(L) && (L = '\x3ca href\x3d"mailto:' + L + '" style\x3d"color: inherit;"\x3e' + P + "\x3c/a\x3e");
                                                    R += U.validLabel ? ("undefined" !== typeof U.label && "" !== U.label ? P + " " : "") + L + "\x3cbr/\x3e" : L + "\x3cbr/\x3e";
                                                    O += 1;
                                                    T.push({
                                                        value: -1 < L.indexOf(",") ? L.replace(",", "") : L,
                                                        label: P
                                                    });
                                                    break a
                                                }
                                        }
                                    F.push(T);
                                    h || (H = e.create("div", {}, r), g.add(H, "SATcolRec"),
                                        g.add(H, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"), O = e.create("div", {}, H), g.add(O, "SATcolRecBar"), T = e.create("div", {
                                            innerHTML: I
                                        }, O), g.add(T, "SATcolRecNum"), t.set(T, "backgroundColor", this.parent.config.activeColor), x(T, "click", n.hitch(this, this._zoomToLocation, y)), M && (T = e.create("div", {
                                            innerHTML: M
                                        }, O), g.add(T, "SATcolDistance")), this.parent.config.enableRouting && (O = e.create("div", {
                                            title: this.parent.nls.get_directions
                                        }, O), g.add(O, "SATcolDir"), x(O, "click", n.hitch(this, this._routeToIncident,
                                            y))), R = e.create("div", {
                                            "class": "SATcolWrap",
                                            innerHTML: R
                                        }, H), g.add(R, "SATcolInfo"), G += k.position(H).w, R = new q(q.STYLE_SOLID, new u.fromRgb(this.parent.config.activeMapGraphicColor), 1), R = new d(d.STYLE_CIRCLE, 24, R, new u.fromRgb(this.parent.config.activeMapGraphicColor)), H = new w, H.family = "Arial", H.size = "12px", I = new B(I, H, new b(this.parent.config.fontColor)), I.setOffset(0, -4), this.graphicsLayer.add(new f(y, R, D)), this.graphicsLayer.add(new f(y, I, D)))
                                }
                            if (!h && v) t.set(r, "width", G);
                            else if (v) return m.resolve({
                                graphics: a,
                                analysisResults: F,
                                context: this
                            }), m
                        },
                        _exportToCSV: function(a, b, d, c) {
                            a = C.exportToCSV(a, b, d, c, {
                                type: "closest",
                                baseLabel: this.baseLabel,
                                csvAllFields: this.parent.config.csvAllFields,
                                layer: this.tab.tabLayers[0],
                                opLayers: this.parent.opLayers,
                                nlsValue: this.parent.nls.closest,
                                nlsCount: this.parent.nls.count
                            });
                            this.summaryLayer = a.summaryLayer;
                            return a.details
                        },
                        _getFields: function(a) {
                            this.layerDefinition = c.getFeatureLayerDefinition(a);
                            this.layerObject = a;
                            a = C.getFields(a, this.tab, this.allFields, this.parent);
                            this.dateFields =
                                a.dateFields;
                            this.specialFields = a.specialFields;
                            this.typeIdField = a.typeIdField;
                            this.types = a.types;
                            this.displayFields = C.getDisplayFields(this.tab);
                            return a.fields
                        },
                        _zoomToLocation: function(a) {
                            this.parent.zoomToLocation(a)
                        },
                        _routeToIncident: function(a) {
                            this.parent.routeToIncident(a)
                        }
                    })
                })
        },
        "widgets/SituationAwareness/js/ProximityInfo": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/Color dojo/_base/array dojo/DeferredList dojo/Deferred dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dojo/on esri/graphic esri/Color esri/layers/FeatureLayer esri/symbols/SimpleMarkerSymbol esri/symbols/SimpleLineSymbol esri/symbols/Font esri/symbols/TextSymbol esri/tasks/query esri/geometry/geometryEngine jimu/utils ./analysisUtils".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C) {
                    return r("ProximityInfo", null, {
                        featureCount: 0,
                        mapServiceLayer: !1,
                        loading: !1,
                        queryOnLoad: !1,
                        incidentCount: 0,
                        constructor: function(a, b, d) {
                            this.tab = a;
                            this.container = b;
                            this.parent = d;
                            this.graphicsLayer = this.incident = null;
                            this.specialFields = {};
                            this.typeIdField = "";
                            this.types = [];
                            this.dateFields = {};
                            this.config = d.config;
                            this.baseLabel = "" !== a.label ? a.label : a.layerTitle ? a.layerTitle : a.layers
                        },
                        queryTabCount: function(a, b, d, c) {
                            var e = new l;
                            this.incidentCount = a.length;
                            var g = [this.tab.tabLayers[0]];
                            this.mapServiceLayer && 1 < this.tab.tabLayers.length && (g = [this.tab.tabLayers[1]]);
                            if (0 < this.tab.tabLayers.length && this.tab.tabLayers[0].url && -1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                                this.mapServiceLayer = !0;
                                var h;
                                "undefined" !== typeof this.tab.tabLayers[0].infoTemplate ? (this.summaryLayer = this.tab.tabLayers[0], this.summaryLayer.hasOwnProperty("loaded") && this.summaryLayer.loaded ? (this.summaryFields = this._getFields(this.summaryLayer), this._performQuery(a, b, d, c, g).then(function(a) {
                                        e.resolve(a)
                                    })) :
                                    (h = new f(this.summaryLayer.url), h.infoTemplate = this.tab.tabLayers[0].infoTemplate, g = [h], this.tab.tabLayers = g, x(h, "load", n.hitch(this, function() {
                                        this.summaryLayer = h;
                                        this.summaryFields = this._getFields(this.summaryLayer);
                                        this._performQuery(a, b, d, c, g).then(function(a) {
                                            e.resolve(a)
                                        })
                                    })))) : this.loading || (h = new f(this.tab.tabLayers[0].url), this.loading = !0, x(h, "load", n.hitch(this, function() {
                                    this.summaryLayer = h;
                                    this.summaryFields = this._getFields(this.summaryLayer);
                                    for (var f = this.tab.tabLayers[0].url.split("MapServer/")[1],
                                            g = this.parent.map.itemInfo.itemData.operationalLayers, k = 0; k < g.length; k++) {
                                        var l = g[k];
                                        if (-1 < this.tab.tabLayers[0].url.indexOf(l.url) && "undefined" !== typeof l.layerObject && l.layerObject.infoTemplates && (l = l.layerObject.infoTemplates[f])) {
                                            h.infoTemplate = l.infoTemplate;
                                            break
                                        }
                                    }
                                    this.tab.tabLayers = [h];
                                    this.loading = !1;
                                    this._performQuery(a, b, d, c, this.tab.tabLayers).then(function(a) {
                                        e.resolve(a)
                                    })
                                })))
                            }
                            this.mapServiceLayer || this._performQuery(a, b, d, c, g).then(function(a) {
                                e.resolve(a)
                            });
                            return e
                        },
                        _performQuery: function(a,
                            b, d, c, f) {
                            var e = new l,
                                g = [],
                                h, k;
                            0 < b.length ? k = C.getGeoms(b) : 0 < a.length && (k = C.getGeoms(a));
                            this.summaryGeoms = k;
                            if (0 < k.length)
                                for (a = 0; a < k.length; a++) g = k[a], b = C.createDefArray(f, g, this.parent.opLayers, this.tab), h = 0 === a ? g = b : g = h.concat(b);
                            (new m(g)).then(n.hitch(this, function(a) {
                                for (var b = 0, f = 0; f < a.length; f++) {
                                    var g = a[f][1];
                                    isNaN(g) ? g && g.features ? b += g.features.length : g && "undefined" !== typeof g.length && (b += g.length) : b += g
                                }
                                this.updateTabCount(b, d, c);
                                e.resolve(b)
                            }));
                            return e
                        },
                        updateTabCount: function(a, b, d) {
                            this.featureCount =
                                a;
                            C.updateTabCount(this.featureCount, b, d, this.baseLabel, this.incidentCount)
                        },
                        updateForIncident: function(a, b, d, c, e, g) {
                            this.incidentCount = a.length;
                            this.allFields = "undefined" !== typeof e && "undefined" !== typeof g ? e ? !0 : g : !1;
                            var h = "undefined" !== typeof c,
                                k;
                            v.forEach(this.tab.tabLayers, n.hitch(this, function(e) {
                                h && (k = new l);
                                if (e.url) {
                                    var g = new f(e.url, {
                                        mode: f.MODE_ONDEMAND,
                                        infoTemplate: e.infoTemplate
                                    });
                                    x(g, "load", n.hitch(this, function() {
                                        this.tab.tabLayers = [g];
                                        h ? this.processIncident(a, b, d, c).then(n.hitch(this,
                                            function(a) {
                                                k.resolve(a)
                                            }), n.hitch(this, function(a) {
                                            console.error(a);
                                            k.reject(a)
                                        })) : this.processIncident(a, b, d, c)
                                    }))
                                } else h ? this.processIncident(a, b, d, c).then(n.hitch(this, function(a) {
                                    k.resolve(a)
                                }), n.hitch(this, function(a) {
                                    console.error(a);
                                    k.reject(a)
                                })) : this.processIncident(a, b, d, c)
                            }));
                            if (h) return k
                        },
                        processIncident: function(a, b, d, c) {
                            this.incidents = a;
                            var f = [],
                                e;
                            if (0 === b.length)
                                for (var h = 0; h < a.length; h++) e = a[h], e = e.geometry ? e.geometry : e, "polygon" === e.type ? (b.push(e), f.push({
                                        geometry: e,
                                        buffer: e
                                    })) :
                                    f.push({
                                        geometry: void 0,
                                        buffer: void 0
                                    });
                            else
                                for (h = 0; h < a.length; h++) {
                                    e = a[h];
                                    var k = b[h].geometry ? b[h].geometry : b[h];
                                    e = e.geometry ? e.geometry : e;
                                    f.push({
                                        geometry: e,
                                        buffer: k
                                    })
                                }
                            if (0 !== b.length) {
                                for (a = 0; a < f.length; a++)
                                    if (b = f[a].buffer, "undefined" !== typeof b)
                                        for (e = 0; e < f.length; e++)
                                            if (e !== a && (h = f[e].buffer, "undefined" !== typeof h && B.overlaps(b, h))) {
                                                f[a].buffer = B.difference(b, h);
                                                f[e].buffer = B.difference(h, b);
                                                h = B.union(h, b);
                                                h = B.difference(h, f[a].buffer);
                                                h = B.difference(h, f[e].buffer);
                                                if (Array.isArray(f[a].geometry)) {
                                                    if (Array.isArray(f[e].geometry))
                                                        for (k =
                                                            0; k < f[e].geometry.length; k++) f[a].geometry.push(f[e].geometry[k]);
                                                    else f[a].geometry.push(f[e].geometry);
                                                    k = f[a].geometry
                                                } else if (k = [], k.push(f[a].geometry), Array.isArray(f[e].geometry))
                                                    for (var q = 0; q < f[e].geometry.length; q++) k.push(f[e].geometry[q]);
                                                else k.push(f[e].geometry);
                                                f.push({
                                                    geometry: k,
                                                    buffer: h
                                                })
                                            } var t, u = "undefined" !== typeof c;
                                u ? t = new l : (this.container.innerHTML = "", g.add(this.container, "loading"));
                                var r = [];
                                this.graphicsLayer = d;
                                d = this.tab.tabLayers[0];
                                var v = this._getFields(d);
                                c = -1 === [null,
                                    void 0, ""
                                ].indexOf(d.id) ? d.id : this.tab.layers;
                                c = C.getFilter(c, this.parent.opLayers);
                                a = [];
                                for (b = 0; b < f.length; b++) e = new w, e.returnGeometry = !0, e.outSpatialReference = this.parent.map.spatialReference, e.geometry = f[b].buffer, e.where = c, e.outFields = ["*"], "undefined" !== typeof d.queryFeatures && a.push(d.queryFeatures(e));
                                (new m(a)).then(n.hitch(this, function(a) {
                                    for (var b = 0; b < a.length; b++) {
                                        var d = a[b][1];
                                        if (d && d.features)
                                            for (var d = d.features, c = f[b].geometry, e = 0; e < d.length; e++) {
                                                var g = d[e],
                                                    h = g.geometry,
                                                    k;
                                                if (Array.isArray(c)) {
                                                    var l;
                                                    for (k = 0; k < c.length; k++) {
                                                        var m = C.getDistance(c[k], h, this.parent.config.distanceUnits);
                                                        if ("undefined" === typeof l || m < l) l = m
                                                    }
                                                    k = l;
                                                    h = {
                                                        DISTANCE: l
                                                    }
                                                } else k = C.getDistance(c, h, this.parent.config.distanceUnits), h = {
                                                    DISTANCE: k
                                                };
                                                for (m = 0; m < v.length; m++) h[v[m]] = g.attributes[v[m]];
                                                !0 === this.config.csvAllFields || "true" === this.config.csvAllFields ? g.attributes.DISTANCE = k : g.attributes = h;
                                                r.push(g)
                                            }
                                    }
                                    r.sort(C.compareDistance);
                                    if (u) {
                                        var q = {
                                            graphics: r,
                                            analysisResults: r.length,
                                            context: this
                                        };
                                        this._processResults(r, !0).then(n.hitch(this,
                                            function(a) {
                                                t.resolve(n.mixin(q, a))
                                            }))
                                    } else this._processResults(r)
                                }), n.hitch(this, function(a) {
                                    console.error(a);
                                    t.reject(a)
                                }));
                                if (u) return t
                            }
                        },
                        _processResults: function(f, m) {
                            var r, w, z = f && 0 < f.length;
                            if (z && "point" !== f[0].geometry.type)
                                for (var B = f.length - 1; 0 <= B; B--) "undefined" === typeof f[B].geometry.getExtent() && f.splice(B, 1);
                            m ? r = new l : (this.container.innerHTML = "", g.remove(this.container, "loading"), this.graphicsLayer.clear(), z && (w = e.create("div", {
                                "class": "SAT_tabPanelContent"
                            }, this.container), B = e.create("div", {}, w), g.add(B, "SATcolExport"), g.add(B, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"), B = e.create("div", {
                                title: this.parent.nls.downloadCSV
                            }, B), g.add(B, "btnExport"), x(B, "click", n.hitch(this, this._exportToCSV, f))));
                            var B = this.parent.nls[this.parent.config.distanceUnits],
                                F;
                            "undefined" !== typeof this.tab.advStat && "undefined" !== typeof this.tab.advStat.stats && "undefined" !== typeof this.tab.advStat.stats.outFields ? F = this.tab.advStat.stats.outFields : (F = [], 0 < this.tab.tabLayers.length && v.forEach(this.tab.tabLayers,
                                n.hitch(this, function(a) {
                                    "undefined" !== typeof a.popupInfo ? v.forEach(a.popupInfo.fieldInfos, n.hitch(this, function(a) {
                                        if (a.visible) {
                                            var b = {
                                                value: 0
                                            };
                                            b.expression = a.fieldName;
                                            b.label = a.label;
                                            F.push(b)
                                        }
                                    })) : a.infoTemplate ? v.forEach(a.infoTemplate.info.fieldInfos, n.hitch(this, function(a) {
                                        if (a.visible) {
                                            var b = {
                                                value: 0
                                            };
                                            b.expression = a.fieldName;
                                            b.label = a.label;
                                            F.push(b)
                                        }
                                    })) : v.forEach((a.layerObject ? a.layerObject : a).fields, n.hitch(this, function(a) {
                                        var b = {
                                            value: 0
                                        };
                                        b.expression = a.name;
                                        b.label = a.alias;
                                        F.push(b)
                                    }))
                                })));
                            var G = 220,
                                A = [];
                            if (z)
                                for (var I = 0; I < f.length; I++) {
                                    var H = I + 1,
                                        D = f[I],
                                        y = D.geometry,
                                        Q = y;
                                    "point" !== y.type && (Q = y.getExtent().getCenter());
                                    var y = D.attributes,
                                        R = C.getDistanceLabel(y.DISTANCE, B, this.parent.nls.approximate),
                                        O = "",
                                        T = 0,
                                        W = [];
                                    if ("undefined" !== typeof F) {
                                        for (var U = 0; U < F.length; U++) {
                                            var J = F[U],
                                                L;
                                            for (L in y)
                                                if ("DISTANCE" !== L && 3 > T && J.expression === L) {
                                                    var P = C.getFieldValue(L, y[L], this.specialFields, this.dateFields, "longMonthDayYear", this.typeIdField, this.types, this.layerObject && this.layerObject.renderer ?
                                                            this.layerObject : this.layerDefinition, y, J),
                                                        P = "undefined" !== typeof P && null !== P ? M.stripHTML(P.toString()) : "",
                                                        V = "undefined" !== typeof J.label && "" !== J.label ? J.label : void 0,
                                                        Y = D._layer && D._layer.fields ? D._layer.fields : this.tab.tabLayers && this.tab.tabLayers[0] ? this.tab.tabLayers[0].fields : void 0;
                                                    Y && "undefined" === typeof V && (Y = C.getField(Y, L)) && (V = Y.alias);
                                                    if ("undefined" === typeof V || V in ["", " ", null, void 0]) V = L;
                                                    C.isURL(P) ? P = '\x3ca href\x3d"' + P + '" target\x3d"_blank" style\x3d"color: inherit;"\x3e' + V + "\x3c/a\x3e" :
                                                        C.isEmail(P) && (P = '\x3ca href\x3d"mailto:' + P + '" style\x3d"color: inherit;"\x3e' + V + "\x3c/a\x3e");
                                                    O += J.validLabel ? ("undefined" !== typeof J.label && "" !== J.label ? V + " " : "") + P + "\x3cbr/\x3e" : P + "\x3cbr/\x3e";
                                                    T += 1;
                                                    W.push({
                                                        label: V,
                                                        value: P
                                                    })
                                                }
                                        }
                                        W.push({
                                            label: this.parent.nls.distance,
                                            value: R
                                        });
                                        0 < W.length && A.push(W)
                                    }
                                    if ("測試建物" == this.baseLabel) {
                                        O = y.city + y.town + "<br/>" + y.address + "，共" + y.totalfloor + "<br/>" + y.seq
                                    }
                                    m || (D = e.create("div", {}, w), g.add(D, "SATcolRec"), g.add(D, this.parent.lightTheme ? "lightThemeBorder" : "darkThemeBorder"), x(D, "click", n.hitch(this, this._toggleElements, D, Q)), T = e.create("div", {}, D), g.add(T, "SATcolRecBar"), W = e.create("div", {
                                        innerHTML: H
                                    }, T), g.add(W,
                                        "SATcolRecNum"), t.set(W, "backgroundColor", this.parent.config.activeColor), x(W, "click", n.hitch(this, this._zoomToLocation, Q)), "point" === this.incidents[0].geometry.type && (R = e.create("div", {
                                        innerHTML: R
                                    }, T), g.add(R, "SATcolDistance")), this.parent.config.enableRouting && (R = e.create("div", {
                                        title: this.parent.nls.get_directions
                                    }, T), g.add(R, "SATcolDir"), x(R, "click", n.hitch(this, this._routeToIncident, Q))), O = e.create("div", {
                                        "class": "SATcolWrap",
                                        innerHTML: O
                                    }, D), g.add(O, "SATcolInfo"), G += k.position(D).w, O = new h(h.STYLE_SOLID,
                                        new u.fromString(this.parent.config.activeMapGraphicColor), 1), O = new b(b.STYLE_CIRCLE, 24, O, new u.fromString(this.parent.config.activeMapGraphicColor)), R = new d, R.family = "Arial", R.size = "12px", H = new q(H, R, new a(this.parent.config.fontColor)), H.setOffset(0, -4), this.graphicsLayer.add(new c(Q, O, y)), this.graphicsLayer.add(new c(Q, H, y)))
                                }
                            if (!m && z) t.set(w, "width", G + "px");
                            else return r.resolve({
                                reportResults: A
                            }), r
                        },
                        _exportToCSV: function(a, b, d, c) {
                            a = C.exportToCSV(a, b, d, c, {
                                type: "proximity",
                                baseLabel: this.baseLabel,
                                csvAllFields: this.parent.config.csvAllFields,
                                layer: this.tab.tabLayers[0],
                                opLayers: this.parent.opLayers,
                                nlsValue: this.parent.nls.proximity,
                                nlsCount: this.parent.nls.count,
                                unit: this.parent.nls[this.parent.config.distanceUnits],
                                approximateLabel: this.parent.nls.approximate
                            });
                            this.summaryLayer = a.summaryLayer;
                            return a.details
                        },
                        _getFields: function(a) {
                            this.layerDefinition = M.getFeatureLayerDefinition(a);
                            this.layerObject = a;
                            a = C.getFields(a, this.tab, this.allFields, this.parent);
                            this.dateFields = a.dateFields;
                            this.specialFields =
                                a.specialFields;
                            this.typeIdField = a.typeIdField;
                            this.types = a.types;
                            this.displayFields = C.getDisplayFields(this.tab);
                            return a.fields
                        },
                        _zoomToLocation: function(a) {
                            this.parent.zoomToLocation(a)
                        },
                        _routeToIncident: function(a) {
                            this.parent.routeToIncident(a)
                        }
                    })
                })
        },
        "widgets/SituationAwareness/js/SnapShotUtils": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/Deferred dojo/DeferredList dojo/_base/array jimu/utils jimu/dijit/SnapShot ./CSVUtils".split(" "), function(r, n, u, v, m, l, g, e) {
                return r("SnapShotUtils",
                    null, {
                        portal: null,
                        portalUrl: "",
                        logo: "",
                        originMapId: "",
                        originAppId: "",
                        credential: null,
                        nls: null,
                        layerArray: [],
                        parent: null,
                        downloadAll: !1,
                        time: null,
                        constructor: function(e) {
                            this.parent = e;
                            this.snapshot = new g(e.appConfig, e.map);
                            this.map = this.parent.map;
                            this.extent = this.map.extent;
                            this.nls = n.mixin({}, e.nls, window.jimuNls.drawBox, window.jimuNls.snapshot)
                        },
                        createSnapShot: function(e) {
                            var g = new u,
                                k = l.stripHTML(e.name),
                                c = this._getTime(e.time);
                            this.createLayerItems(e, c, k).then(n.hitch(this, function(a) {
                                this.snapshot.createSnapShot({
                                    folderOptions: {
                                        folderName: k +
                                            "_" + c,
                                        title: k + "_" + c,
                                        description: k + " " + this.nls.snapshot
                                    },
                                    mapTitle: k + " (" + this.nls.snapshot_append + " " + c + ")",
                                    name: k + " (" + c + ")",
                                    shareWith: {
                                        everyone: !1,
                                        org: !1,
                                        groups: e.groups.join()
                                    },
                                    mapExtent: this.map.extent,
                                    data: a
                                }).then(function() {
                                    g.resolve()
                                })
                            }));
                            return g
                        },
                        _getTime: function(e) {
                            e = new Date(e);
                            var g = e.getTimezoneOffset();
                            return l.fieldFormatter.getFormattedDate(e, {
                                dateFormat: "shortDateShortTime"
                            }) + " " + this.nls.utc + (0 > g ? "+" + Math.abs(g) / 60 : "-" + g / 60)
                        },
                        createLayerItems: function(e, g, l) {
                            var c = new u,
                                a = e.layers.reverse();
                            this.buffers = e.buffers;
                            this.incidents = e.incidents;
                            e = [];
                            for (var f = 0; f < a.length; f++) {
                                var b = !0;
                                a[f].analysisObject && "undefined" !== typeof a[f].analysisObject.featureCount && 0 === a[f].analysisObject.featureCount && (b = !1);
                                a[f].graphics && 0 === a[f].graphics.length && (b = !1);
                                b && e.push(this.createItem(a[f], this.incidents, this.buffers, g, this.nls, l))
                            }
                            var h = [];
                            (new v(e)).then(n.hitch(this, function(a) {
                                    for (var b = 0; b < a.length; b++) {
                                        var d = a[b][1];
                                        if (Array.isArray(d))
                                            for (var f = 0; f < d.length; f++) h.push(d[f]);
                                        else h.push(d)
                                    }
                                    c.resolve(h)
                                }),
                                n.hitch(this, function(a) {
                                    c.reject(a)
                                }));
                            return c
                        },
                        createItem: function(e, g, l, c, a, f) {
                            var b = new u,
                                h = {
                                    label: e.label,
                                    title: e.label + "_" + c,
                                    desc: a.snapshot_append + " " + a.of_append + " " + (e.type ? e.type : e.label) + " " + a.layer_append + " " + e.label + " (" + c + ")",
                                    name: e.label + " (" + c + ")",
                                    tags: [f + "," + a.snapshot_append]
                                };
                            if (e.layerObject) {
                                var d = e.layerObject;
                                f = e.analysisObject;
                                var k;
                                d.infoTemplate && d.infoTemplate.info && (k = d.infoTemplate.info);
                                h.popupInfo = k;
                                "groupedSummary" === e.type || "summary" === e.type ? f.updateForIncident(g,
                                    l, null, null, !0, !0, !0).then(n.hitch(this, function(f) {
                                    f = this.createAnalysisLayerJSON(f, d, a, c, h);
                                    b.resolve(f)
                                })) : f.updateForIncident(g, "closest" === e.type ? this.parent.config.maxDistance : l, null, !0, !0, !0).then(n.hitch(this, function(f) {
                                    f = this.createAnalysisLayerJSON(f, d, a, c, h);
                                    b.resolve(f)
                                }))
                            } else e = this.createIncidentBufferLayerJSON(e.graphics, a, c, h), b.resolve(e);
                            return b
                        },
                        createAnalysisLayerJSON: function(e, g, l, c, a) {
                            l = e.graphics;
                            c = e.context._exportToCSV(l, !0);
                            e = [];
                            for (var f = 0; f < c.length; f++) {
                                var b = c[f];
                                "esriFieldTypeOID" !== b.type && e.push(b)
                            }
                            for (c = 0; c < l.length; c++) f = l[c], f.geometry.cache && (f.geometry.clearCache(), delete f.geometry.cahce);
                            return {
                                graphics: l,
                                renderer: g.renderer,
                                infoTemplate: a.popupInfo,
                                fields: e,
                                tags: a.tags,
                                description: a.desc,
                                name: a.name,
                                visibleOnStartup: !1,
                                typeIdField: g.typeIdField,
                                types: g.types,
                                minScale: g.minScale,
                                maxScale: g.maxScale
                            }
                        },
                        createIncidentBufferLayerJSON: function(e, g, l, c) {
                            var a = [],
                                f = [],
                                b = [];
                            g = [];
                            m.forEach(e, function(d) {
                                switch (d.geometry.type) {
                                    case "point":
                                        a.push(d);
                                        break;
                                    case "polyline":
                                        f.push(d);
                                        break;
                                    case "polygon":
                                        b.push(d)
                                }
                            });
                            e = [];
                            0 < a.length && e.push(a);
                            0 < f.length && e.push(f);
                            0 < b.length && e.push(b);
                            l = {
                                point: this.nls.point,
                                polyline: this.nls.line,
                                polygon: this.nls.polygon
                            };
                            for (var h = 0; h < e.length; h++) {
                                var d = e[h],
                                    k;
                                0 < d.length && (k = d[0], k = l["undefined" !== typeof k.geometry ? k.geometry.type : k.type], g.push({
                                    graphics: d,
                                    fields: [],
                                    tags: c.tags,
                                    description: c.desc,
                                    name: 1 === e.length ? c.name : k + " " + c.name,
                                    visibleOnStartup: !1
                                }))
                            }
                            return g
                        },
                        createDownloadZip: function(g, l, m) {
                            var c = new u,
                                a = this.nls.calculated_results;
                            this._performAnalysis(g, l, m, this.downloadAll, !1).then(function(f) {
                                for (var b = [], g = 0; g < f.length; g++) {
                                    var d = f[g];
                                    (d = d.context._exportToCSV(d.graphics, !1, !0, d.analysisResults)) && b.push(d)
                                }
                                0 < b.length && e.exportCalculatedResultsCSV(a, b);
                                c.resolve("success")
                            }, function(a) {
                                c.reject(a)
                            });
                            return c
                        },
                        _performAnalysis: function(e, g, l, c, a) {
                            for (var f = new u, b = [], h = 0; h < e.length; h++) {
                                var d = e[h];
                                console.log("AO: " + d);
                                var k = !0;
                                d.analysisObject && "undefined" !== typeof d.analysisObject.featureCount &&
                                    0 === d.analysisObject.featureCount && (k = !1);
                                k && ("groupedSummary" === d.type || "summary" === d.type ? b.push(d.analysisObject.updateForIncident(g, l, null, null, !0, a, c)) : b.push(d.analysisObject.updateForIncident(g, "closest" === d.type ? this.parent.config.maxDistance : l, null, !0, a, c)))
                            }
                            var m = [];
                            (new v(b)).then(n.hitch(this, function(a) {
                                for (var b = 0; b < a.length; b++) m.push(a[b][1]);
                                f.resolve(m)
                            }), n.hitch(this, function(a) {
                                console.error(a);
                                f.reject(a)
                            }));
                            return f
                        }
                    })
            })
        },
        "jimu/dijit/SnapShot": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/DeferredList jimu/utils esri/request esri/geometry/webMercatorUtils esri/geometry/Polygon esri/geometry/Polyline jimu/portalUtils jimu/tokenUtils jimu/dijit/Message".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a) {
                    return r("Snapshot", null, {
                        _portal: null,
                        _portalUrl: "",
                        _layerArray: [],
                        _originMapId: "",
                        _originAppId: "",
                        _credential: null,
                        name: "",
                        appendTimeStamp: null,
                        baseMap: null,
                        tags: "",
                        description: "",
                        shareWith: null,
                        logo: "",
                        time: null,
                        constructor: function(a, b) {
                            this.map = b;
                            this.appConfig = a;
                            this._originAppId = a.appId;
                            this._originMapId = b.itemId;
                            this._mapItemInfo = b.itemInfo;
                            this._portalUrl = a.portalUrl;
                            this._portal = x.getPortal(this._portalUrl);
                            this._baseUrl = this._portalUrl + "sharing/rest/";
                            this.nls = n.mixin({}, window.jimuNls.drawBox, window.jimuNls.snapshot)
                        },
                        createSnapShot: function(a) {
                            this.ids = [];
                            this.layerArray = [];
                            this.time = this._getDateString(Date.now());
                            this.name = (a.appendTimeStamp && a.name ? a.name + "_" + this.time : a.name) || this._mapItemInfo.item.title + "_" + this.time;
                            this.extent = a.mapExtent || this.map.extent;
                            this.logo = a.logo || this.appConfig.logo;
                            this.mapName = a.mapTitle || this.name;
                            this.shareWith = a.shareWith || {
                                everyone: !1,
                                org: !1,
                                groups: ""
                            };
                            var b = a.folderOptions;
                            b.name = a.folderOptions.name ||
                                this.name;
                            b.title = a.folderOptions.title || this.name;
                            b.description = a.folderOptions.description || this.name;
                            a = a.data.reverse();
                            return this._createSnapshot(b, a)
                        },
                        _createSnapshot: function(a, b) {
                            var c = new v;
                            this._portal.getUser().then(n.hitch(this, this._processUser), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._createFolder, a), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._createItems, b), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._addLayers), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._createMap,
                                this._mapItemInfo), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._processMap), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._shareItems), function(a) {
                                c.reject(a)
                            }).then(n.hitch(this, this._showMessage), function(a) {
                                c.reject(a)
                            }).then(function() {
                                c.resolve()
                            });
                            return c
                        },
                        _processUser: function(a) {
                            var b = new v;
                            this.user = a;
                            this.groups = a.groups;
                            b.resolve();
                            return b
                        },
                        _createFolder: function(a) {
                            var b = new v;
                            a = {
                                url: this._baseUrl + "content/users/" + this.user.username + "/createFolder",
                                content: n.mixin({
                                        f: "json"
                                    },
                                    a),
                                handleAs: "json",
                                callbackParamName: "callback"
                            };
                            this._isValidCredential() && (a.content.token = this._credential.token);
                            g(a, {
                                usePost: !0
                            }).then(n.hitch(this, function(a) {
                                a.success ? ((this.folder = a.folder) && this.folder.id && this.ids.push(this.folder.id), b.resolve(a.folder)) : (console.log(a), b.reject(a))
                            }), n.hitch(this, function(a) {
                                b.reject(a)
                            }));
                            return b
                        },
                        _createItems: function(a) {
                            var b = new v,
                                c = [];
                            u.forEach(a, n.hitch(this, function(a) {
                                a.graphics && 0 < a.graphics.length && c.push(this._createLayerItem(a))
                            }));
                            var d = [];
                            (new m(c)).then(n.hitch(this, function(a) {
                                for (var c = 0; c < a.length; c++) d.push(a[c][1]);
                                b.resolve(d)
                            }), n.hitch(this, function(a) {
                                b.reject(a)
                            }));
                            return b
                        },
                        _addLayers: function(a) {
                            for (var b = new v, c = [], d = 0; d < a.length; d++) c.push(this.user.addItem(a[d], this.folder.id));
                            var f = [];
                            (new m(c)).then(n.hitch(this, function(a) {
                                for (var c = 0; c < a.length; c++) {
                                    var d = a[c][1];
                                    d.success && (f.push(d.id), this.ids.push(d.id))
                                }
                                b.resolve(f)
                            }), n.hitch(this, function(a) {
                                b.reject(a)
                            }));
                            return b
                        },
                        _createMap: function(a, b) {
                            for (var c = a.itemData,
                                    d = this.name, f = [], g = 0; g < c.baseMap.baseMapLayers.length; g++) {
                                var k = c.baseMap.baseMapLayers[g];
                                f.push({
                                    id: k.id,
                                    layerType: k.layerType,
                                    url: k.url,
                                    visibility: k.visibility,
                                    opacity: k.opacity,
                                    title: k.title,
                                    styleUrl: k.styleUrl,
                                    itemId: k.itemId
                                })
                            }
                            c = {
                                baseMapLayers: f
                            };
                            f = [];
                            for (g = 0; g < this.layerArray.length; g++) k = this.layerArray[g], f.push({
                                id: k.layer.id,
                                layerType: "ArcGISFeatureLayer",
                                visibility: k.layer.visible,
                                opacity: k.layer.opacity,
                                title: k.label,
                                type: "Feature Collection",
                                itemId: b[g]
                            });
                            b = e.webMercatorToGeographic(this.extent);
                            a = {
                                title: d,
                                type: "Web Map",
                                item: d,
                                extent: b.xmin + "," + b.ymin + "," + b.xmax + "," + b.ymax,
                                text: JSON.stringify({
                                    operationalLayers: f,
                                    baseMap: c,
                                    spatialReference: this.map.spatialReference,
                                    version: a && a.itemData && a.itemData.version ? a.itemData.version : "2.4"
                                }),
                                tags: this.name + "," + this.nls.snapshot_append,
                                wabType: "HTML"
                            };
                            return this.user.addItem(a, this.folder.id)
                        },
                        _processMap: function(a) {
                            var b = new v;
                            a.id && this.ids.push(a.id);
                            a.success ? b.resolve(a.id) : b.reject("fail");
                            return b
                        },
                        _shareItems: function(a) {
                            var b = new v,
                                c = {
                                    url: this._baseUrl +
                                        "content/users/" + this.user.username + "/shareItems",
                                    content: {
                                        f: "json",
                                        everyone: this.shareWith.everyone,
                                        org: this.shareWith.org,
                                        items: this.ids.join(),
                                        groups: this.shareWith.groups,
                                        confirmItemControl: this._validateGroupItemControl(this.shareWith.groups)
                                    },
                                    handleAs: "json",
                                    callbackParamName: "callback"
                                };
                            this._isValidCredential() && (c.content.token = this._credential.token);
                            g(c, {
                                usePost: !0
                            }).then(n.hitch(this, function(c) {
                                c.results && 0 < c.results.length ? b.resolve(this._portalUrl + "home/webmap/viewer.html?webmap\x3d" +
                                    a) : b.reject("fail")
                            }), n.hitch(this, function(a) {
                                b.reject(a)
                            }));
                            return b
                        },
                        _validateGroupItemControl: function(a) {
                            var b = a.split(",");
                            return 0 < this.groups.filter(function(a) {
                                var c = a.capabilities || [];
                                return -1 < b.indexOf(a.id) && -1 < c.indexOf("updateitemcontrol")
                            }).length
                        },
                        _showMessage: function(c) {
                            var b = new v;
                            "fail" === c ? (new a({
                                message: this.nls.snapshot_failed
                            }), b.reject(c)) : (new a({
                                message: '\x3ca href\x3d"' + c + '" target\x3d"_blank"\x3e' + this.nls.snapshot_complete + "\x3c/a\x3e"
                            }), b.resolve("success"));
                            return b
                        },
                        _getDateString: function(a) {
                            a = new Date(a);
                            var b = a.getTimezoneOffset();
                            return l.fieldFormatter.getFormattedDate(a, {
                                dateFormat: "shortDateShortTime"
                            }) + " " + this.nls.utc + (0 > b ? "+" + Math.abs(b) / 60 : "-" + b / 60)
                        },
                        _checkCredential: function() {
                            var a = c.isValidCredential(this._credential);
                            a || this._clearCredential();
                            return a
                        },
                        _isValidCredential: function() {
                            this._updateCredential();
                            return this._checkCredential()
                        },
                        _updateCredential: function() {
                            this._checkCredential() || (this._credential = c.getPortalCredential(this._portalUrl))
                        },
                        _clearCredential: function() {
                            this._credential = null
                        },
                        _createLayerItem: function(a) {
                            var b = new v;
                            a = this._createLayer(a.graphics, n.mixin({}, {
                                description: a.name,
                                name: a.name,
                                tags: [a.name]
                            }, a));
                            b.resolve(a);
                            return b
                        },
                        _createLayer: function(a, b) {
                            var c = this.nls,
                                d = this.time,
                                f = a[0],
                                e = {
                                    point: "esriGeometryPoint",
                                    polyline: "esriGeometryPolyline",
                                    polygon: "esriGeometryPolygon"
                                } ["undefined" !== typeof f.geometry ? f.geometry.type : f.type],
                                f = f.symbol ? f.symbol.toJson() : "",
                                g = [],
                                l = [{
                                        name: "ObjectID",
                                        alias: "ObjectID",
                                        type: "esriFieldTypeOID"
                                    },
                                    {
                                        name: c.snapshot_append,
                                        alias: c.snapshot_append,
                                        type: "esriFieldTypeString"
                                    }
                                ];
                            b.fields && 0 < b.fields.length && u.forEach(b.fields, function(a) {
                                l.push({
                                    name: a.name,
                                    alias: a.alias,
                                    type: a.type,
                                    domain: a.domain
                                })
                            });
                            var m = 0;
                            u.forEach(a, function(a) {
                                var f;
                                switch (e) {
                                    case "esriGeometryPolyline":
                                        f = a.geometry.paths;
                                        break;
                                    case "esriGeometryPolygon":
                                        f = a.geometry.rings;
                                        break;
                                    case "esriGeometryPoint":
                                        f = [a.geometry]
                                }
                                var h = 0,
                                    l;
                                u.forEach(f, function(f) {
                                    switch (e) {
                                        case "esriGeometryPolyline":
                                            l = new t(f);
                                            l.spatialReference = a.geometry.spatialReference;
                                            break;
                                        case "esriGeometryPolygon":
                                            l = new k(f);
                                            l.spatialReference = a.geometry.spatialReference;
                                            break;
                                        case "esriGeometryPoint":
                                            l = f
                                    }
                                    var n = {
                                        attributes: {
                                            ObjectID: m + h
                                        },
                                        geometry: l
                                    };
                                    n.attributes[c.snapshot_append] = d;
                                    b.fields && 0 < b.fields.length && u.forEach(b.fields, function(b) {
                                        n.attributes[b.name] = a.attributes[b.name]
                                    });
                                    g.push(n);
                                    h += 1
                                });
                                m += 1
                            });
                            a = {
                                xmin: this.extent.xmin,
                                ymin: this.extent.ymin,
                                xmax: this.extent.xmax,
                                ymax: this.extent.ymax,
                                spatialReference: this.extent.spatialReference
                            };
                            f = b.renderer && b.renderer.toJson ?
                                b.renderer.toJson() : b.renderer ? JSON.stringify(b.renderer) : {
                                    type: "simple",
                                    label: "",
                                    description: "",
                                    symbol: f
                                };
                            this.layerArray.push({
                                layer: {
                                    id: b.name,
                                    label: b.name,
                                    opacity: 1,
                                    visible: b.visibleOnStartup
                                },
                                label: b.name
                            });
                            return {
                                title: b.name,
                                type: "Feature Collection",
                                tags: b.tags,
                                description: b.description,
                                extent: a,
                                name: b.name,
                                text: JSON.stringify({
                                    layers: [{
                                        layerDefinition: {
                                            name: b.name,
                                            geometryType: e,
                                            objectIdField: "ObjectID",
                                            typeIdField: b.typeIdField,
                                            types: b.types,
                                            type: "Feature Layer",
                                            extent: a,
                                            drawingInfo: {
                                                renderer: f
                                            },
                                            fields: l,
                                            minScale: b.minScale,
                                            maxScale: b.maxScale
                                        },
                                        popupInfo: b.infoTemplate && b.infoTemplate.info ? b.infoTemplate.info : b.infoTemplate ? b.infoTemplate : void 0,
                                        featureSet: {
                                            features: g,
                                            geometryType: e
                                        }
                                    }]
                                }),
                                f: "json"
                            }
                        }
                    })
                })
        },
        "widgets/SituationAwareness/js/PropertyHelper": function() {
            define("dojo/_base/declare dijit/_WidgetsInTemplateMixin dojo/_base/lang dojo/_base/html dojo/dom-class dojo/on dojo/query dojo/Deferred jimu/BaseWidget jimu/portalUtils dojo/Evented dojo/text!./PropertyHelper.html dijit/form/Select dijit/form/ValidationTextBox".split(" "),
                function(r, n, u, v, m, l, g, e, k, t, x, c, a) {
                    return r([k, n, x], {
                        templateString: c,
                        baseClass: "jimu-widget-SAT-property-helper",
                        constructor: function() {},
                        postMixInProperties: function() {
                            this.inherited(arguments);
                            this.nls.common = window.jimuNls.common
                        },
                        postCreate: function() {
                            this.inherited(arguments);
                            this.windowResize = this.own(l(window, "resize", u.hitch(this, this._resize)));
                            "report" === this.type ? this.initReportControls() : this.initSnapshotControls();
                            this.startup()
                        },
                        _resize: function() {
                            var a = !isNaN(window.innerWidth) &&
                                null !== window.innerWidth && "" !== window.innerWidth && window.innerWidth ? window.innerWidth : 450;
                            this.popup.width = 450 <= a ? 450 : a
                        },
                        startup: function() {
                            this.snapshotName.invalidMessage = this.invalidMessage;
                            this.snapshotName.validator = "report" === this.type ? this.checkReportString : this.checkString;
                            this.btnCancel.innerText = this.nls.common.cancel;
                            this.own(l(this.btnCancel, "click", u.hitch(this, function() {
                                this.emit("cancel")
                            })));
                            this.btnOk.innerText = this.nls.common.ok;
                            this.own(l(this.btnOk, "click", u.hitch(this, function() {
                                if (!m.contains(this.btnOk,
                                        "jimu-state-disabled")) {
                                    var a = {
                                        name: this.snapshotName.value.trim()
                                    };
                                    "report" === this.type ? a = u.mixin(a, {
                                        reportLayout: {
                                            orientation: this.pageUtils.Orientation[this.orientationSelect.selectControl.value],
                                            pageSize: this.pageUtils.PageSizes[this.pageSizeSelect.selectControl.value]
                                        },
                                        comments: this.commentTextArea.value
                                    }) : a.groups = [this.shareSelect.selectControl.value !== this.nls.choose_group ? this.shareSelect.selectControl.value : ""];
                                    this.emit("ok", a)
                                }
                            })))
                        },
                        initWidth: function() {
                            this._resize()
                        },
                        checkString: function(a) {
                            a =
                                a.trim();
                            a = 50 > a.length && /^[\w ]+$/.test(a) ? !0 : !1;
                            var b = g(".snapshot-name-footer")[0];
                            b && (this.hasNoGroups ? v.addClass(b.children[0], "jimu-state-disabled") : a ? v.removeClass(b.children[0], "jimu-state-disabled") : v.addClass(b.children[0], "jimu-state-disabled"));
                            return a
                        },
                        checkReportString: function(a) {
                            a = 0 < a.trim().length ? !0 : !1;
                            var b = g(".snapshot-name-footer")[0];
                            b && (a ? v.removeClass(b.children[0], "jimu-state-disabled") : v.addClass(b.children[0], "jimu-state-disabled"));
                            return a
                        },
                        getPageUtilValues: function(a,
                            b, c) {
                            var d = "A3 A4 Letter_ANSI_A Tabloid_ANSI_B Landscape Portrait".split(" "),
                                e = ["Letter ANSI A", "Portrait"],
                                f = Object.keys(a),
                                g = [],
                                h;
                            for (h in f) {
                                var k = f[h],
                                    l = a[k];
                                k && l.hasOwnProperty(b) && -1 < d.indexOf(k) && g.push({
                                    label: l[b],
                                    value: k,
                                    selected: l[b] === c || -1 < e.indexOf(l[b])
                                })
                            }
                            return g
                        },
                        getGroupValues: function(a) {
                            var b = new e;
                            t.getPortal(this.portalUrl).getUser().then(u.hitch(this, function(c) {
                                    var d = [],
                                        e;
                                    for (e in c.groups) {
                                        var f = c.groups[e];
                                        d.push({
                                            label: f.title,
                                            value: f.id,
                                            selected: f.title === a
                                        })
                                    }
                                    b.resolve(d)
                                }),
                                u.hitch(this, function(a) {
                                    console.log(a);
                                    b.resolve([])
                                }));
                            return b
                        },
                        initSnapshotControls: function() {
                            this.nameSpan.innerHTML = this.nls.common.name + ":";
                            this.shareSpan.innerHTML = this.nls.select_group + ":";
                            this.toggleRow(this.shareRow, !1);
                            this.toggleRow(this.orientationRow, !0);
                            this.toggleRow(this.pageSizeRow, !0);
                            this.toggleRow(this.commentsRow, !0);
                            var a;
                            if (null !== this.storedProps) {
                                var b = JSON.parse(this.storedProps, !0);
                                b.share && (a = b.share)
                            }
                            this.getGroupValues(a).then(u.hitch(this, function(a) {
                                this.snapshotName.hasNoGroups =
                                    0 === a.length ? !0 : !1;
                                this.addSelect(this.shareSelect, a)
                            }))
                        },
                        initReportControls: function() {
                            this.nameSpan.innerHTML = this.nls.common.title + ":";
                            this.toggleRow(this.orientationRow, !1);
                            this.toggleRow(this.pageSizeRow, !1);
                            this.toggleRow(this.commentsRow, !1);
                            this.toggleRow(this.shareRow, !0);
                            var a, b;
                            if (null !== this.storedProps) {
                                var c = JSON.parse(this.storedProps, !0);
                                c.reportLayout && (b = c.reportLayout.pageSize, a = c.reportLayout.orientation.Text, b = b.SizeName)
                            }
                            this.addSelect(this.orientationSelect, this.getPageUtilValues(this.pageUtils.Orientation,
                                "Text", a));
                            this.addSelect(this.pageSizeSelect, this.getPageUtilValues(this.pageUtils.PageSizes, "SizeName", b))
                        },
                        addSelect: function(c, b) {
                            c.selectControl = new a({
                                options: b,
                                style: "width: 100%;"
                            });
                            c.selectControl.placeAt(c).startup()
                        },
                        toggleRow: function(a, b) {
                            m.contains(a, b ? "display-on" : "display-off") && m.remove(a, b ? "display-on" : "display-off");
                            m.add(a, b ? "display-off" : "display-on")
                        },
                        destroy: function() {}
                    })
                })
        },
        "widgets/SituationAwareness/_build-generate_module": function() {
            define(["dojo/text!./Widget.html", "dojo/text!./css/style.css",
                "dojo/i18n!./nls/strings"
            ], function() {})
        },
        "url:jimu/dijit/templates/ReportTemplate.html": '\x3c!DOCTYPE HTML\x3e\r\n\x3chtml lang\x3d"en" dir\x3d"ltr"\x3e\r\n\r\n\x3chead id\x3d"reportHead"\x3e\r\n  \x3cmeta charset\x3d"utf-8"\x3e\r\n  \x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3dEdge,chrome\x3d1"\x3e\r\n  \x3ctitle\x3e\x3c/title\x3e\r\n  \x3cscript\x3e\r\n    // Show/hide text area controls based on the value\r\n    function onPrintButtonClicked() {\r\n      var notesContainer, i;\r\n      notesContainer \x3d document.getElementsByClassName("esriCTNotesContainer");\r\n      //process notes to show/hide based on contents\r\n      for (i \x3d 0; i \x3c notesContainer.length; i++) {\r\n        if (notesContainer[i]) {\r\n          //Hide the notes which are not having values\r\n          if (notesContainer[i].children[1].value.trim() \x3d\x3d\x3d "") {\r\n            notesContainer[i].className +\x3d " esriCTHideReportNotes";\r\n          }\r\n          else {\r\n            //Removes hidden class if available\r\n            notesContainer[i].className \x3d\r\n              notesContainer[i].className.replace("esriCTHideReportNotes", "");\r\n          }\r\n        }\r\n      }\r\n      //after processing notes, print the window\r\n      window.print();\r\n    }\r\n  \x3c/script\x3e\r\n  \x3c!-- Report prev page css --\x3e\r\n  \x3cstyle type\x3d"text/css"\x3e\r\n    .esriCTReportMapWait {\r\n      height: 5px;\r\n      width: 100%;\r\n      position: relative;\r\n      overflow: hidden;\r\n      background-color: #ddd;\r\n    }\r\n\r\n    .esriCTReportMapWait:before {\r\n      display: block;\r\n      position: absolute;\r\n      content: "";\r\n      left: -200px;\r\n      width: 200px;\r\n      height: 5px;\r\n      background-color: #2980b9;\r\n      animation: loading 2s linear infinite;\r\n    }\r\n\r\n    @keyframes loading {\r\n      from {\r\n        left: -200px;\r\n        width: 30%;\r\n      }\r\n      50% {\r\n        width: 30%;\r\n      }\r\n      70% {\r\n        width: 70%;\r\n      }\r\n      80% {\r\n        left: 50%;\r\n      }\r\n      95% {\r\n        left: 120%;\r\n      }\r\n      to {\r\n        left: 100%;\r\n      }\r\n    }\r\n\r\n    .esriCTHTMLData {\r\n      position: relative;\r\n      width: 100%;\r\n      height: auto;\r\n    }\r\n\r\n    .jimu-rtl .esriCTHTMLData {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTTable {\r\n      margin-top: 10px;\r\n      padding: 0;\r\n      border-collapse: collapse;\r\n      border-spacing: 0;\r\n      width: 100%;\r\n      page-break-inside: avoid;\r\n      table-layout: fixed;\r\n    }\r\n\r\n    .jimu-rtl .esriCTTable {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTTable th {\r\n      border: 1px solid gray;\r\n      background-color: #E4E4E4;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTTable td {\r\n      border: 1px solid gray;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTSectionTitle {\r\n      font-size: 18px;\r\n      color: #0f96cc;\r\n      font-weight: bold;\r\n      margin: 30px 0px;\r\n      width: calc(100% - 10px);\r\n      word-break: break-all;\r\n    }\r\n\r\n    .jimu-rtl .esriCTSectionTitle {\r\n      float: right;\r\n      direction: rtl;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportMap .esriCTSectionTitle {\r\n      float: none;\r\n    }\r\n\r\n    .esriCTReportLogo {\r\n      float: left;\r\n      max-width: calc(50% - 10px);\r\n      margin: auto 10px auto 0;\r\n      max-height: 90%;\r\n      position: absolute;\r\n      top: 0;\r\n      bottom: 0;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportLogo {\r\n      float: right;\r\n      margin: auto 0 auto 10px;\r\n    }\r\n\r\n    .esriCTPrintTitleDiv {\r\n      height: 56px;\r\n      float: right;\r\n      min-width: 50%;\r\n    }\r\n\r\n    .jimu-rtl .esriCTPrintTitleDiv {\r\n      float: left;\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTInputTitle {\r\n      height: 55px;\r\n      line-height: 55px;\r\n      border: none;\r\n      font-size: 25px;\r\n      width: 100%;\r\n      padding: 0px;\r\n    }\r\n\r\n    .esriCTInputTitle::-ms-clear {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportMain {\r\n      background: #FFF;\r\n      border: solid 1px #000;\r\n      margin: 0 auto;\r\n      padding: 20px;\r\n      width: 797px;\r\n    }\r\n\r\n    .esriCTReportMap {\r\n      text-align: center;\r\n    }\r\n\r\n    .esriCTReportMapImg {\r\n      max-width: 96%;\r\n      margin-top: 10px;\r\n    }\r\n\r\n    .esriCTReportLandscapeMapImg {\r\n      max-width: 80%;\r\n    }\r\n\r\n    .esriCTReportMapFail {\r\n      height: 50px;\r\n    }\r\n\r\n    .esriCTReportFooter {\r\n      text-align: center;\r\n      font-size: 80%;\r\n      padding: 10px 0;\r\n      white-space: pre-wrap;\r\n      word-wrap: break-word;\r\n    }\r\n\r\n    .esriCTPrintPage {\r\n      padding: 30px 0;\r\n      margin: 20px auto;\r\n      font-family: arial, sans-serif;\r\n      font-size: 13px;\r\n    }\r\n\r\n    .esriCTReportBar {\r\n      width: 100%;\r\n      position: fixed;\r\n      left: 0;\r\n      top: 0;\r\n      z-index: 6;\r\n      height: 50px;\r\n      background: #e2f1fc;\r\n      border-bottom: 1px solid #000;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportBar {\r\n      left: inherit;\r\n      right: 0;\r\n    }\r\n\r\n    .esriCTPrintButton,\r\n    .esriCTCloseButton {\r\n      color: #444;\r\n      font-family: Verdana, Helvetica, sans-serif;\r\n      font-size: 12px;\r\n      -moz-border-radius: 3px;\r\n      -webkit-border-radius: 3px;\r\n      border-radius: 3px;\r\n      border: 1px solid #8b8b8b;\r\n      box-shadow: none;\r\n      -webkit-box-shadow: none;\r\n      background: #F2F2F2;\r\n      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);\r\n      background: -moz-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #F2F2F2), color-stop(100%, #D1D1D1));\r\n      background: -webkit-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -o-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: -ms-linear-gradient(top, #F2F2F2 0%, #D1D1D1 100%);\r\n      background: linear-gradient(to bottom, #F2F2F2 0%, #D1D1D1 100%);\r\n      filter: progid: DXImageTransform.Microsoft.gradient(startColorstr\x3d\'#F2F2F2\', endColorstr\x3d\'#D1D1D1\', GradientType\x3d0);\r\n      margin: 10px 20px;\r\n      line-height: 16px;\r\n      display: block;\r\n      padding: 5px 10px;\r\n      outline: 0;\r\n      text-decoration: none;\r\n      cursor: pointer;\r\n      font-weight: 400;\r\n      white-space: nowrap;\r\n      float: right;\r\n    }\r\n\r\n    .jimu-rtl .esriCTPrintButton,\r\n    .jimu-rtl .esriCTCloseButton {\r\n      float: left;\r\n    }\r\n\r\n    .esriCTPrintButton:hover,\r\n    .esriCTPrintButton:focus,\r\n    .esriCTCloseButton:hover,\r\n    .esriCTCloseButton:focus {\r\n      background: #E5E6E6;\r\n      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);\r\n      background: -moz-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #E5E6E6), color-stop(100%, #A0A1A1));\r\n      background: -webkit-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -o-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: -ms-linear-gradient(top, #E5E6E6 0%, #A0A1A1 100%);\r\n      background: linear-gradient(to bottom, #E5E6E6 0%, #A0A1A1 100%);\r\n      filter: progid: DXImageTransform.Microsoft.gradient(startColorstr\x3d\'#E5E6E6\', endColorstr\x3d\'#A0A1A1\', GradientType\x3d0);\r\n    }\r\n\r\n    .esriCTReportHeader {\r\n      display: block;\r\n      width: 100%;\r\n      height: 60px;\r\n      border-bottom: 1px solid #000;\r\n      margin-bottom: 5px;\r\n      position: relative;\r\n    }\r\n\r\n    .esriCTReportBarMsg {\r\n      text-align: center;\r\n      margin-top: 16px;\r\n    }\r\n\r\n    .jimu-rtl .esriCTReportBarMsg {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTNotesContainer {\r\n      width: 100%;\r\n      margin-top: 30px;\r\n    }\r\n\r\n    .esriCTReportNotes {\r\n      resize: none;\r\n      width: calc(100% - 5px);\r\n      max-width: calc(100% - 5px);\r\n      font-family: "Arial";\r\n      font-size: 13px;\r\n      border: 1px solid gray;\r\n      overflow-y: hidden;\r\n      /* prevents scroll bar flash */\r\n    }\r\n\r\n    .esriCTReportNotesParagraph {\r\n      display: none;\r\n      white-space: pre-wrap;\r\n      word-wrap: break-word;\r\n    }\r\n    \r\n    .jimu-rtl .esriCTReportNotesParagraph {\r\n      float: right;\r\n      direction: rtl;\r\n    }\r\n    \r\n    .jimu-rtl .esriCTReportNotes {\r\n      direction: rtl;\r\n    }\r\n\r\n    .esriCTHidden {\r\n      display: none;\r\n    }\r\n  \x3c/style\x3e\r\n  \x3c!-- Media print css --\x3e\r\n  \x3cstyle type\x3d"text/css" media\x3d"print"\x3e\r\n    .esriCTPrintPage {\r\n      padding: 0;\r\n      color: #000;\r\n      margin: 0;\r\n      float: none;\r\n      background: #fff url(none);\r\n    }\r\n\r\n    .esriCTTable {\r\n      page-break-inside: avoid;\r\n      border-collapse: collapse;\r\n      border-spacing: 0;\r\n    }\r\n\r\n    .esriCTPageBreak {\r\n      page-break-after: always;\r\n    }\r\n\r\n    .esriCTReportFooter {\r\n      font-size: 75%;\r\n    }\r\n\r\n    .esriCTReportBar {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportMain {\r\n      border: none;\r\n    }\r\n\r\n    .esriCTReportMapImg {\r\n      box-shadow: none;\r\n      border: none;\r\n    }\r\n\r\n    .esriCTReportNotes {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTReportNotesParagraph {\r\n      display: block;\r\n    }\r\n\r\n    .esriCTHideReportNotes {\r\n      display: none;\r\n    }\r\n\r\n    .esriCTTable th {\r\n      border: 1px solid gray;\r\n    }\r\n\r\n    .esriCTTable td {\r\n      border: 1px solid gray;\r\n    }\r\n\t\r\n  \x3c/style\x3e\r\n  \x3cscript\x3e\r\n    function showError(evt) {\r\n      alert(document.getElementById(\'showErrorButton\').innerHTML);\r\n    }\r\n  \x3c/script\x3e\r\n\x3c/head\x3e\r\n\r\n\x3cbody id\x3d"reportBody" class\x3d"esriCTPrintPage"\x3e\r\n  \x3cbutton id\x3d"showErrorButton" style\x3d"display: none" onclick\x3d"showError()"\x3e\x3c/button\x3e\r\n  \x3cdiv class\x3d"esriCTReportBar"\x3e\r\n    \x3cdiv id\x3d"closeButton" class\x3d"esriCTCloseButton" title\x3d"Close" onclick\x3d"window.close();"\x3eClose\x3c/div\x3e\r\n    \x3cdiv id\x3d"printButton" class\x3d"esriCTPrintButton" title\x3d"Print" onclick\x3d"onPrintButtonClicked();"\x3ePrint\x3c/div\x3e\r\n    \x3cdiv id\x3d"reportBarMsg" class\x3d"esriCTReportBarMsg"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv id\x3d"reportMain" class\x3d"esriCTReportMain"\x3e\r\n    \x3cdiv id\x3d"reportHeader" class\x3d"esriCTReportHeader"\x3e\r\n      \x3cimg id\x3d"reportLogo" class\x3d"esriCTReportLogo esriCTHidden" src\x3d""\x3e\r\n      \x3cdiv id\x3d"printTitleDiv" class\x3d"esriCTPrintTitleDiv"\x3e\r\n        \x3cinput id\x3d"reportTitle" type\x3d"text" class\x3d"esriCTInputTitle"\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv id\x3d"reportData"\x3e\x3c/div\x3e\r\n    \x3cdiv id\x3d"footNotes" class\x3d"esriCTReportFooter"\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/body\x3e\r\n\r\n\x3c/html\x3e',
        "url:dijit/templates/ProgressBar.html": '\x3cdiv class\x3d"dijitProgressBar dijitProgressBarEmpty" role\x3d"progressbar"\r\n\t\x3e\x3cdiv  data-dojo-attach-point\x3d"internalProgress" class\x3d"dijitProgressBarFull"\r\n\t\t\x3e\x3cdiv class\x3d"dijitProgressBarTile" role\x3d"presentation"\x3e\x3c/div\r\n\t\t\x3e\x3cspan style\x3d"visibility:hidden"\x3e\x26#160;\x3c/span\r\n\t\x3e\x3c/div\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"labelNode" class\x3d"dijitProgressBarLabel" id\x3d"${id}_label"\x3e\x3c/div\r\n\t\x3e\x3cspan data-dojo-attach-point\x3d"indeterminateHighContrastImage"\r\n\t\t   class\x3d"dijitInline dijitProgressBarIndeterminateHighContrastImage"\x3e\x3c/span\r\n\x3e\x3c/div\x3e\r\n',
        "url:esri/dijit/editing/templates/AttachmentEditor.html": "\x3cdiv class\x3d\"attachmentEditor\"\x3e\r\n    \x3cbr /\x3e\r\n    \x3cdiv\x3e\r\n        \x3cb\x3e${NLS_attachments}\x3c/b\x3e\r\n        \x3chr /\x3e\r\n        \x3cdiv dojoAttachPoint\x3d\"_attachmentError\" style\x3d'color:red;display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e\r\n        \x3cspan dojoAttachPoint\x3d'_attachmentList' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e\r\n        \x3cbr\x3e\x3cbr\x3e\r\n        \x3cdiv data-dojo-type\x3d\"dijit/ProgressBar\" dojoAttachPoint\x3d\"_attachmentProgress\" indeterminate\x3d\"true\" style\x3d'display:none'\x3e\x3c/div\x3e\r\n        \x3cbr /\x3e        \r\n        \x3cform dojoAttachPoint\x3d'_uploadForm'\x3e ${NLS_add}:\x26nbsp;\x26nbsp;\x3cinput type\x3d'file' name\x3d'attachment' dojoAttachPoint\x3d'_uploadField' /\x3e \x3c/form\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e",
        "url:esri/dijit/templates/AttributeInspector.html": '\x3cdiv class\x3d"esriAttributeInspector"\x3e\r\n    \x3cdiv class\x3d"atiLayerName" dojoAttachPoint\x3d"layerName"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiAttributes" dojoAttachPoint\x3d"attributeTable"\x3e\x3c/div\x3e\r\n    \x3cdiv dojoAttachPoint\x3d"attachmentEditor"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiEditorTrackingInfo" dojoAttachPoint\x3d"editorTrackingInfoDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"atiButtons" dojoAttachPoint\x3d"editButtons"\x3e\r\n        \x3cbutton  dojoType\x3d"dijit.form.Button" class\x3d"atiButton atiDeleteButton"  dojoAttachPoint\x3d"deleteBtn" dojoAttachEvent\x3d"onClick: onDeleteBtn" showLabel\x3d"true" type\x3d"button"\x3e${NLS_deleteFeature}\x3c/button\x3e\r\n        \x3cdiv class\x3d"atiNavButtons" dojoAttachPoint\x3d"navButtons"\x3e\r\n            \x3cdiv class\x3d"atiNavMessage" dojoAttachPoint\x3d"navMessage"\x3e\x3c/div\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiFirstIcon" dojoAttachPoint\x3d"firstFeatureButton" dojoAttachEvent\x3d"onClick: onFirstFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_first}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiPrevIcon" dojoAttachPoint\x3d"prevFeatureButton" dojoAttachEvent\x3d"onClick: onPreviousFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_previous}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiNextIcon" dojoAttachPoint\x3d"nextFeatureButton" dojoAttachEvent\x3d"onClick: onNextFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_next}\x3c/button\x3e\r\n            \x3cbutton  dojoType\x3d"dijit.form.Button" iconClass\x3d"atiButton atiLastIcon" dojoAttachPoint\x3d"lastFeatureButton" dojoAttachEvent\x3d"onClick: onLastFeature" showLabel\x3d"false" type\x3d"button"\x3e${NLS_last}\x3c/button\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
        "url:widgets/SituationAwareness/js/PropertyHelper.html": '\x3cdiv\x3e  \r\n  \x3cdiv class\x3d"jimu-r-row"\x3e\r\n    \x3ctable class\x3d"width-all"\x3e\r\n      \x3c!--name--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"nameRow"\x3e\r\n        \x3ctd class\x3d"col-1-2"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"nameSpan"\x3e\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2"\x3e\r\n          \x3cinput class\x3d"width-all" data-dojo-attach-point\x3d"snapshotName" data-dojo-type\x3d"dijit/form/ValidationTextBox" /\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--share--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"shareRow"\x3e\r\n        \x3ctd class\x3d"width-all pad-top-10"\x3e\r\n          \x3cspan class\x3d"hintText"\x3e${nls.select_group_instruction}\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"shareSpan"\x3e\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"shareSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--orientation--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"orientationRow"\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"orientationSpan"\x3e${nls.orientation}:\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"orientationSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n      \x3c!--page size--\x3e\r\n      \x3ctr data-dojo-attach-point\x3d"pageSizeRow"\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cspan class\x3d"label" data-dojo-attach-point\x3d"pageSizeSpan"\x3e${nls.pageSize}:\x3c/span\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd class\x3d"col-1-2 pad-top-10"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"pageSizeSelect"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n  \x3c!--comments--\x3e\r\n  \x3cdiv class\x3d"display-off pad-top-10" data-dojo-attach-point\x3d"commentsRow"\x3e\r\n    \x3cdiv class\x3d"jimu-r-row pad-top-5"\x3e\r\n      \x3cdiv class\x3d"jimu-r-row"\x3e\r\n        \x3cspan class\x3d"label" data-dojo-attach-point\x3d"commentsSpan"\x3e${nls.comments}:\x3c/span\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"jimu-r-row pad-top-5"\x3e\r\n      \x3ctextarea class\x3d"commentTextArea" data-dojo-attach-point\x3d"commentTextArea" rows\x3d"5"\x3e\x3c/textarea\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"snapshot-name-footer jimu-float-trailing pad-top-10"\x3e\r\n    \x3cdiv class\x3d"jimu-btn ok pad-right-5 jimu-state-disabled" data-dojo-attach-point\x3d"btnOk"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"jimu-btn cancel" data-dojo-attach-point\x3d"btnCancel"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
        "url:widgets/SituationAwareness/Widget.html": '\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"panelBottom" class\x3d"panelBottom"\x3e\r\n\r\n    \x3c!-- Panel Footer --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"footerNode" class\x3d"SA_panelFooter dart-bgcolor box-bgcolor jimu-main-background"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"panelLeft" class\x3d"SA_panelLeft" data-dojo-attach-event\x3d"onclick:_navTabsLeft"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"footerContentNode" class\x3d"SA_panelFooterContent"\x3e\r\n        \x3c!-- Tabs --\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"tabsNode" class\x3d"SA_SAT_tabs"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"panelRight" class\x3d"SA_panelRight" data-dojo-attach-event\x3d"onclick:_navTabsRight"\x3e\x3c/div\x3e\r\n      \x3cdiv class\x3d"SA_panelClose" data-dojo-attach-event\x3d"onclick:_close"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3c!--Panel Container --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"panelContainer" class\x3d"panelContainer dart-bgcolor box-bgcolor jimu-main-background"\x3e\r\n      \x3c!-- Panel Incident --\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"innerBL" class\x3d"innerBL" data-dojo-attach-event\x3d"onclick:_navLeft"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"SA_tabPanel0" class\x3d"SAT_tabPanel"\x3e\r\n        \x3cdiv class\x3d"SAT_tabPanelContent" style\x3d"min-width: 650px"\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"incidentsLocate" class\x3d"SATcolLocate" style\x3d"width:auto; min-width:220px"\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"locateIncident" class\x3d"label locateIncident"\x3e\x3c/div\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"clearIncident" class\x3d"label clearIncident" data-dojo-attach-event\x3d"onclick:_clear"\x3e\r\n              ${nls.clearIncident}\r\n            \x3c/div\x3e\r\n            \x3cbr /\x3e\r\n            \x3cdiv class\x3d"locateIncidentContainer"\x3e\r\n              \x3cdiv class\x3d"colBar SATdrawCol"\x3e\r\n                \x3cdiv data-dojo-attach-point\x3d"imgContainer" class\x3d"imgContainer"\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cimg class\x3d"btn32img" data-dojo-attach-point\x3d"SA_btn0"\x3e \x3c/img\x3e \x3c/span\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cimg class\x3d"btn32img" data-dojo-attach-point\x3d"SA_btn1"\x3e \x3c/img\x3e \x3c/span\x3e\r\n                  \x3cspan class\x3d"btn32 displayTC"\x3e \x3cimg class\x3d"btn32img" data-dojo-attach-point\x3d"SA_btn2"\x3e \x3c/img\x3e \x3c/span\x3e\r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n              \x3cdiv class\x3d"bufferIncidentContainer"\x3e\r\n                \x3cdiv class\x3d"bufferControlsContainer"\x3e\r\n                  \x3cdiv data-dojo-attach-point\x3d"buffer_lbl" class\x3d"label bufferLabel"\x3e\x3c/div\x3e          \r\n                  \x3cdiv class\x3d"spinnerValueDIV"\x3e\r\n                    \x3cinput data-dojo-attach-point\x3d"spinnerValue" data-dojo-type\x3d"dijit/form/NumberSpinner" class\x3d"spinnerValue" name\x3d"spinnerValue"/\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"buffer_lbl_unit" class\x3d"label bufferUnit"\x3e\x3c/div\x3e\r\n                  \x3c/div\x3e       \r\n                \x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"saveOptions" class\x3d"SATcol2"\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"borderCol" class\x3d"borderCol display-off"\x3e\x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"div_reverse_geocoding" class\x3d"SATcol reverseGeocodingDIV"\x3e\r\n            \x3cdiv class\x3d"label"\x3e\r\n              ${nls.reverse_geocoded_address}\r\n            \x3c/div\x3e\r\n            \x3c/br\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"div_reversed_address" class\x3d"label reversedAddressDIV"\x3e\x3c/div\x3e\r\n          \x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"innerBR" class\x3d"innerBR" data-dojo-attach-event\x3d"onclick:_navRight"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3c!-- Panel Message --\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"messageNode" class\x3d"SA_panelMessage"\x3e\r\n      \x3cspan data-dojo-attach-point\x3d"messageTextNode"\x3e\x3c/span\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n',
        "url:widgets/SituationAwareness/css/style.css": ".jimu-widget-SAT {color: #ffffff !important; background-color: #4c4c4c; left: 0px; right: 0px; bottom: 0px; height: 155px !important; display: block; z-index: 100 !important;}.action2 {padding-left: 10px;}.jimu-widget-SAT .innerBL {display: none; width: 10px; height: 20px; background-image: url('images/nav_left.png'); background-repeat: no-repeat; background-size:cover; position: fixed; bottom: 45px; left: 0px; z-index: 2; background-size:cover; opacity: .6;}.jimu-rtl .jimu-widget-SAT .innerBL {right: 0px;}.jimu-widget-SAT .innerBL:hover {width: 20px; height: 35px; opacity: 1; cursor: pointer; bottom: 30px;}.jimu-widget-SAT .innerBR {display: none; width: 10px; height: 20px; background-image: url('images/nav_right.png'); background-repeat: no-repeat; background-size:cover; position: fixed; bottom: 45px; right: 0px; z-index: 2; opacity: .6;}.jimu-rtl .jimu-widget-SAT .innerBR {left: 0px;}.jimu-widget-SAT .innerBR:hover {width: 20px; height: 35px; opacity: 1; cursor: pointer; bottom: 30px;}.jimu-widget-SAT .rounded {-moz-border-radius: 5px 5px 5px 5px; -webkit-border-radius: 5px 5px 5px 5px; border-radius: 5px 5px 5px 5px;}.jimu-widget-SAT .roundedL {-moz-border-radius: 5px 0px 0px 5px; -webkit-border-radius: 5px 0px 0px 5px; border-radius: 5px 0px 0px 5px;}.jimu-widget-SAT .roundedR {-moz-border-radius: 0px 5px 5px 0px; -webkit-border-radius: 0px 5px 5px 0px; border-radius: 0px 5px 5px 0px;}.jimu-widget-SAT .reverseGeocodingDIV {visibility: hidden;}.jimu-widget-SAT .reversedAddressDIV {width:100%;}.jimu-widget-SAT .spinnerValue {width: 80px; align: left;}.jimu-widget-SAT .panelBottom {position: absolute; width: 100%; height: 155px; left: 0px; top: 0px; text-align: center; color: #ffffff; padding: 0px;}.jimu-widget-SAT .SA_panelMessage {position: absolute; top: 0px; text-align: center; width: 100%; height: 40px; line-height: 40px; display: none;}.jimu-widget-SAT .SA_panelFooter {position: absolute; top: 0px; left: 0px; right: 0px; height: 30px; line-height: 30px; overflow: hidden; border-bottom: 1px solid #353535; border-bottom: 1px solid rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .SA_panelFooterContent {position: absolute; left: 0px; right: 24px; height: 30px; overflow-x: hidden; overflow-y: hidden; display: block;}.jimu-rtl .jimu-widget-SAT .SA_panelFooterContent {position: absolute; left: 24px; right: 0px;}.jimu-widget-SAT .SA_panelClose {position: absolute; left: auto; right: 0px; width: 24px; height: 30px; line-height: 30px; text-align: center; display: block; cursor: pointer; background-image: url('images/x.png'); background-repeat: no-repeat; background-position: center center; background-size: 12px;}.jimu-widget-SAT .SA_panelRight {display: none; position: absolute; left: auto; right: 24px; width: 34px; height: 30px; line-height: 30px; cursor: pointer; background-image: url('images/nav_right.png'); background-repeat: no-repeat; background-position: center center; background-size: 10px; opacity: .4;}.jimu-widget-SAT .SA_panelRight:hover {opacity: 1; background-size: 16px;}.jimu-widget-SAT .SA_panelLeft {display: none; position: absolute; left: 0px; right: auto; height: 30px; line-height: 30px; cursor: pointer; background-image: url('images/nav_left.png'); background-repeat: no-repeat; background-position: center center; background-size: 10px; opacity: .4;}.jimu-widget-SAT .SA_panelLeft:hover {opacity: 1; background-size: 16px;}.jimu-rtl .jimu-widget-SAT .SA_panelClose {position: absolute; left: 0px; right: auto;}.jimu-widget-SAT .panelContainer {position: absolute; top: 30px; width: 100%; height: 125px; overflow: hidden; display: block;}.jimu-widget-SAT .SAT_tabPanel {position: absolute; top: 10px; left: 0px; right: 0px; height: 115px; display: none; overflow: auto;}.jimu-widget-SAT .SAT_tabPanelContent {position: absolute; top: 0px; height: 100px; white-space: nowrap; display: block; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;}.jimu-widget-SAT .locateIncidentContainer {display: flex; float: left; margin-top: 20px;}.jimu-rtl .jimu-widget-SAT .locateIncidentContainer {display: flex; float: right; margin-top: 20px;}.jimu-widget-SAT .bufferIncidentContainer {display: table-cell;}.jimu-widget-SAT .bufferControlsContainer {float: left; padding-left: 20px;}.jimu-widget-SAT .SA_SAT_tabs {position: absolute; white-space: nowrap; height: 30px; padding: 0px; overflow-x: visible; overflow-y: hidden;}.jimu-widget-SAT .SATTab {width: auto; max-width: 220px; overflow: hidden; text-overflow: ellipsis; height: 30px; float: left; line-height: 30px; font-size: 13px; padding: 0 30px 0 30px; cursor: pointer; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; opacity: .85; border-right: 1px solid #d2dae2;}.jimu-rtl .jimu-widget-SAT .SATTab {float: right;}.jimu-widget-SAT .active {background-color: #353535; background-color: rgba(0, 0, 0, 0.3); opacity: 1; border-top: 2px solid #15a4fa;}.jimu-widget-SAT .activeBlack {background-color: #353535; opacity: 1; border-top: 2px solid #15a4fa;}.jimu-widget-SAT .SATcol {float: left; height: 100px; width: 220px; border-left: none; margin-left: 0; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcol {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .SATcolExport {float: left; height: 100px; width: 65px; border-left: none; margin-left: 0; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcolExport {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .lightThemeBorder{border-right: 1px solid #353535; border-right: 1px solid rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .darkThemeBorder{border-right: 1px solid #ffffff; border-right: 1px solid rgba(255, 255, 255, 0.5);}.jimu-rtl .jimu-widget-SAT .lightThemeBorder{border-left: 1px solid #353535; border-left: 1px solid rgba(0, 0, 0, 0.3);}.jimu-rtl .jimu-widget-SAT .darkThemeBorder{border-left: 1px solid #ffffff; border-left: 1px solid rgba(255, 255, 255, 0.5);}.jimu-widget-SAT .SATcolLocate {float: left; height: 100px; width: 220px; border-left: none; margin-left: 0; padding: 0 30px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden;}.jimu-rtl .jimu-widget-SAT .SATcolLocate {float: right; border-right: none; overflow: hidden;}.jimu-widget-SAT .SATcolWrap {white-space: pre-wrap; white-space: -moz-pre-wrap; word-wrap: break-word;}.jimu-widget-SAT .SATcol2 {float: left; height: 100px; border-left: none; margin-left: 5px; padding: 0 10px; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; overflow: hidden; display: table;}.jimu-rtl .jimu-widget-SAT .SATcol2 {float: right; border-right: none; overflow: hidden; margin-right: 5px;}.jimu-widget-SAT .borderCol {height: 100px; float: left;}.jimu-widget-SAT .SATcolSmall {float: left; height: 90px; width: 165px; border-left: none; margin-left: 0; padding: 0 20px; overflow: hidden; text-overflow: ellipsis;}.jimu-rtl .jimu-widget-SAT .SATcolSmall {float: right; border-right: none;}.jimu-widget-SAT .SATcolLast {border-left: none; border-right: none;}.jimu-widget-SAT .SATcol .label,.jimu-widget-SAT .SATcolSmall .label {font-size: 13px; padding: 2px 0;}.jimu-widget-SAT .SATcol .colBar {height: 32px; display: table-cell; width: 130px;}.jimu-widget-SAT .SATdrawCol {display: block; float: left;}.jimu-rtl .jimu-widget-SAT .SATdrawCol {display: block; float: right;}.jimu-widget-SAT .displayTC{display: table-cell;}.jimu-widget-SAT .displayTR{display: table-row;}.jimu-widget-SAT .displayT{display: table;}.jimu-widget-SAT .display-on{display: block;}.jimu-widget-SAT .display-off{display: none;}.jimu-widget-SAT .btnOn {border: 1px solid #ffffff; border: 1px solid rgba(255, 255, 255, 0.75); background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btn32 {width: 32px; height: 32px; border-radius: 2px; margin-right: 5px; cursor: pointer;}.jimu-widget-SAT .btn32img {padding: 8px;}.jimu-widget-SAT .lightThemeBackground{background-color: #353535; background-color: rgba(0, 0, 0, 0.3);}.jimu-widget-SAT .darkThemeBackground{}.jimu-widget-SAT .btn32img:hover {background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btn32imgBlack {padding: 8px;}.jimu-widget-SAT .btn32imgBlack:hover {background-color: #262626;}.jimu-widget-SAT .dijitTextBox,.jimu-widget-SAT .dijitTextBoxHover,.jimu-widget-SAT .dijitTextBoxFocused,.jimu-widget-SAT .dijitTextBoxHoverFocused {background-color: #393939; background-color: rgba(0, 0, 0, 0.25) !important; color: #ffffff !important; border: 1px solid #a6a6a6; border: 1px solid rgba(255, 255, 255, 0.5) !important; height: 26px !important; line-height: 26px !important;}.jimu-widget-SAT .dijitTextBoxFocused,.jimu-widget-SAT .dijitInputInner,.jimu-widget-SAT .dijitInputContainer {background: transparent !important; color: #ffffff !important; height: 26px !important; line-height: 26px !important;}.jimu-widget-SAT .dijitInputField {padding: 0px 10px !important;}.jimu-widget-SAT .btnExport {border-radius: 2px; padding: 10px 10px 10px 10px; background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right center; cursor: pointer; height: 40px;}.jimu-widget-SAT .btnExport:hover {background-color: #262626; background-color: rgba(0, 0, 0, 0.5);}.jimu-widget-SAT .btnExportBlack {border-radius: 2px; padding: 10px 10px 10px 10px; background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right center; cursor: pointer; height: 40px;}.jimu-widget-SAT .btnExportBlack:hover {background-color: #262626;}.jimu-widget-SAT .download {background-image: url('images/download.png'); background-repeat: no-repeat; background-position: right 0px center;}.jimu-widget-SAT .processing {background-image: url('images/processing.gif'); background-repeat: no-repeat; background-position: right 10px center;}.jimu-widget-SAT .loading {background-image: url('images/loading.gif'); background-repeat: no-repeat; background-position: center 10px;}.jimu-widget-SAT .btnDisabled {opacity: .5; cursor: default;}.jimu-widget-SAT .colSummary {font-size: 28px; padding-top: 10px;}.jimu-widget-SAT .colGroupedSummary {font-size: 28px; padding-top: 3px;}.jimu-widget-SAT .SATcolRec {float: left; height: 100%; border-left: none; margin-left: 0; padding: 0 10px; text-align: left; text-overflow: ellipsis; user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none; min-width: 220px; max-width: 300px;}.jimu-rtl .jimu-widget-SAT .SATcolRec {float: right; border-right: none; text-align: right;}.jimu-widget-SAT .SATcolRecBar {position: relative; height: 26px; width: 100%; display: block;}.jimu-widget-SAT .SATcolRecNum {position: absolute; width: 26px; height: 26px; background-color: #393939; background-color: rgba(0, 0, 0, 0.25); line-height: 26px; text-align: center; border-radius: 13px; font-size: 11px; cursor: pointer;}.jimu-widget-SAT .SATcolDir {position: absolute; right: 0px; width: 26px; height: 26px; background-image: url('images/car.png'); background-repeat: no-repeat; background-position: center center; cursor: pointer;}.jimu-rtl .jimu-widget-SAT .SATcolDir {position: absolute; left: 0px; right: auto;}.jimu-widget-SAT .SATcolDistance {position: absolute; left: 30px; right: 30px; height: 26px; font-size: 11px; line-height: 26px;}.jimu-widget-SAT .SATcolInfo {position: relative; margin-top: 5px; width: 100%; display: block; overflow: hidden;}.jimu-widget-SAT .noFeaturesActive {opacity: .5; cursor: default;}.jimu-widget-SAT .noFeatures {display: none;}.jimu-widget-SAT .locateIncident{float: left;}.jimu-rtl .jimu-widget-SAT .locateIncident{float: right;}.jimu-widget-SAT .clearIncident{float: right; text-decoration: underline; cursor: pointer;}.jimu-rtl .jimu-widget-SAT .clearIncident{float: left; text-decoration: underline; cursor: pointer;}.jimu-widget-SAT .imgContainer{display: table; width: 130px; padding-top: 10px;}.jimu-widget-SAT .bufferLabel{}.jimu-widget-SAT .spinnerValueDIV{float: right; margin-top: 8px; margin-left: 4px; display: table-row;}.jimu-rtl .jimu-widget-SAT .spinnerValueDIV{float: left; margin-top: 8px; margin-right: 4px; display: table-row;}.jimu-widget-SAT .bufferUnit{display: inline; margin-left: 4px; margin-top: 7px;}.jimu-widget-SAT .saveIncidentDiv{position: absolute; top: 0px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .saveIncidentDiv{position: absolute; top: 0px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .downlaodAllDiv{position: absolute; top: 35px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .downlaodAllDiv{position: absolute; top: 35px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .createSnapshotDiv{position: absolute; top: 70px; left: 270px; line-height: 26px; font-size: 13px;}.jimu-rtl .jimu-widget-SAT .createSnapshotDiv{position: absolute; top: 70px; right: 270px; line-height: 26px; font-size: 13px;}.jimu-widget-SAT .pad-top-5{padding-top: 5px;}.jimu-widget-SAT .pad-top-10{padding-top: 10px;}.jimu-popup .SAT-warning-icon {width: 25px; height: 25px; position: relative; background-size: contain; background-repeat: no-repeat; background-image: url('../images/warning.png'); margin-top: 8px;}.jimu-popup .SAT-warning-hint {color: #898989; font-size: 11px; margin-bottom: 10px;}.jimu-widget-SAT-property-helper .pad-top-5{padding-top: 5px;}.jimu-widget-SAT-property-helper .pad-top-10{padding-top: 10px;}.jimu-widget-SAT-property-helper .pad-right-5{padding-right: 5px;}.jimu-rtl .jimu-widget-SAT-property-helper .pad-right-5{padding-left: 5px;}.jimu-widget-SAT-property-helper .commentTextArea{width: 100%;}.jimu-widget-SAT-property-helper .width-all{width: 100%;}.jimu-widget-SAT-property-helper .display-on{display: block;}.jimu-widget-SAT-property-helper .display-off{display: none;}.jimu-widget-SAT-property-helper .dijitSelectLabel {text-align: left; text-overflow: ellipsis; overflow: hidden; max-width: 153px;}@media screen and (max-width: 420px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 133px;}}@media screen and (max-width: 400px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 113px;}}@media screen and (max-width: 360px ) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 105px;}}@media screen and (max-width: 320px) {.jimu-widget-SAT-property-helper .dijitSelectLabel {max-width: 87px;}}.jimu-widget-SAT-property-helper .hintText {font-size: 12px; color: #a0acbf; font-style: oblique;}.jimu-widget-SAT-ai .esriAttributeInspector .atiRichTextField{}.jimu-widget-SAT-ai .esriAttributeInspector div.dijitEditorIFrameContainer {height: 78px; width: 100%;}.jimu-widget-SAT-ai .esriAttributeInspector .dijitTextBox.dijitTextArea {height: 32px;}.jimu-widget-SAT-ai .esriAttributeInspector .atiButton {padding-top:2px; margin-right: 10px; display: inline-table; background-image: none;}.jimu-widget-SAT-ai .esriAttributeInspector .atiButtons {height:30px; width:100%; display:inline-block; width:100%;}.jimu-widget-SAT-ai .esriAttributeInspector {display:inline-block;}.jimu-widget-SAT-ai .esriAttributeInspector .dijitArrowButtonContainer {margin-top:0px; margin-right:0px; margin-bottom:0px; width:18px;}.jimu-widget-SAT-ai .esriAttributeInspector .atiNavButtons {display:none; visibility:hidden; height: 0px;}.jimu-widget-SAT-ai .esriPopup .spinner {display: none;}",
        "*now": function(r) {
            r(['dojo/i18n!*preload*widgets/SituationAwareness/nls/Widget*["ar","bs","ca","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]'])
        },
        "*noref": 1
    }
});
define("dojo/_base/declare dijit/_WidgetsInTemplateMixin dijit/form/Button jimu/BaseWidget jimu/dijit/Message jimu/utils jimu/LayerInfos/LayerInfos jimu/portalUtils jimu/dijit/Report jimu/dijit/PageUtils dojo/_base/Color dojo/_base/html dojo/dom dojo/on dojo/dom-style dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/_base/lang dojo/_base/array dojo/_base/xhr dojo/query dojo/json dojo/topic dojo/Deferred dojo/DeferredList dojo/string dojo/colors esri/geometry/geometryEngine esri/geometry/Point esri/geometry/webMercatorUtils esri/tasks/ProjectParameters esri/geometry/jsonUtils esri/graphic esri/graphicsUtils esri/geometry/geodesicUtils esri/Color esri/layers/GraphicsLayer esri/layers/FeatureLayer esri/SpatialReference esri/symbols/Font esri/symbols/SimpleLineSymbol esri/symbols/SimpleFillSymbol esri/symbols/SimpleMarkerSymbol esri/symbols/TextSymbol esri/tasks/locator esri/tasks/GeometryService esri/tasks/PrintTemplate esri/tasks/LegendLayer esri/toolbars/draw esri/dijit/AttributeInspector jimu/dijit/Popup esri/tasks/query esri/request esri/lang ./js/SummaryInfo ./js/GroupedCountInfo ./js/ClosestInfo ./js/ProximityInfo ./js/SnapShotUtils ./js/PropertyHelper ./js/analysisUtils dojo/keys dojo/domReady!".split(" "), function(r,
    n, u, v, m, l, g, e, k, t, x, c, a, f, b, h, d, q, w, B, M, C, z, I, S, E, N, K, F, G, A, X, H, D, y, Q, R, O, T, W, U, J, L, P, V, Y, ea, fa, ga, Z, ha, ia, ja, ba, ca, ka, la, ma, na, aa, oa, da, pa) {
    return r([v, n], {
        baseClass: "jimu-widget-SAT",
        name: "IncidentAnalysis",
        opLayers: null,
        curTab: 0,
        lyrBuffer: null,
        lyrIncidents: null,
        lyrClosest: null,
        lyrProximity: null,
        lyrSummary: null,
        lyrEdit: null,
        toolbar: null,
        tool: -1,
        symPoint: null,
        symLine: null,
        symPoly: null,
        symBuffer: null,
        symRoute: null,
        incidents: [],
        buffers: [],
        gsvc: null,
        locator: null,
        stops: [],
        initalLayerVisibility: {},
        startX: 0,
        mouseDown: !1,
        btnNodes: [],
        panelNodes: [],
        tabNodes: [],
        currentSumLayer: null,
        currentGrpLayer: null,
        mapBottom: null,
        mapResize: null,
        geomExtent: void 0,
        selectedGraphic: !1,
        honorTemplate: !1,
        Incident_Local_Storage_Key: "SAT_Incident",
        SLIDER_MAX_VALUE: 1E4,
        postCreate: function() {
            this.inherited(arguments);
            this.nls = w.mixin(this.nls, window.jimuNls.units);
            this.widgetActive = !0;
            window.localStorage.setItem(this.Incident_Local_Storage_Key, null)
        },
        startup: function() {
            this.inherited(arguments);
            this.updateTabs();
            this.btnNodes = [];
            this.panelNodes = [];
            this.tabNodes = [];
            this.reportSrc = this.folderUrl + "css/images/report.png";
            this.saveSrc = this.folderUrl + "css/images/save.png";
            this.downloadAllSrc = this.folderUrl + "css/images/download_all.png";
            this.snapshotSrc = this.folderUrl + "css/images/snapshot.png";
            this.processingSrc = this.folderUrl + "css/images/processing.gif";
            this.editTemplate = this.config.editTemplate;
            this.saveEnabled = this.config.saveEnabled;
            this.summaryDisplayEnabled = this.config.summaryDisplayEnabled;
            this.snapshotEnabled = "undefined" !==
                typeof this.config.snapshotEnabled ? this.config.snapshotEnabled : !1;
            this.reportEnabled = "undefined" !== typeof this.config.reportEnabled ? this.config.reportEnabled : !1;
            this.allEnabled = this.saveEnabled && this.snapshotEnabled && this.reportEnabled;
            this.SLIDER_MAX_VALUE = parseFloat(this.config.bufferRange.maximum.toString().replace(/,/g, ""), 10);
            this.SLIDER_MIN_VALUE = parseFloat(this.config.bufferRange.minimum.toString().replace(/,/g, ""), 10);
            "undefined" === typeof this.config.bufferRange._default && (this.config.bufferRange._default =
                this.config.bufferRange.minimum);
            this.SLIDER_DEFAULT_VALUE = parseFloat(this.config.bufferRange._default.toString().replace(/,/g, ""), 10);
            g.getInstance(this.map, this.map.itemInfo).then(w.hitch(this, function(a) {
                this.opLayers = a;
                this._initJimuLayerInfos();
                this._getStyleColor();
                this._createUI();
                this._loadUI();
                this._initLayers();
                this._verifyRouting();
                this._getAttributeTable();
                this._mapLoaded()
            }))
        },
        _togglePopupClass: function(a) {
            if (this.map.infoWindow && this.map.infoWindow.domNode && this.saveEnabled) {
                var b = C(".contentPane",
                    this.map.infoWindow.domNode)[0];
                b && (a ? h.add : h.remove)(b, "jimu-widget-SAT-ai")
            }
        },
        updateTabs: function() {
            if (this.config && this.config.tabs && this.config.tabs.length)
                for (var a = this.config.tabs, b = 0; b < a.length; b++) {
                    var c = a[b];
                    c.type && "weather" === c.type && a.splice(b, 1)
                }
        },
        onOpen: function() {
            this.inherited(arguments);
            this.widgetActive = !0;
            this.map.infoWindow.isShowing && this.map.infoWindow.hide();
            this.setPosition();
            this.windowResize = f(window, "resize", w.hitch(this, this._resize));
            null === this.mapResize && (this.mapResize =
                this.map.on("resize", w.hitch(this, this._mapResize)));
            this._mapResize();
            this.own(I.subscribe("changeMapPosition", w.hitch(this, this._onMapPositionChange)));
            (this.disableVisibilityManagement = "undefined" !== typeof this.config.disableVisibilityManagement ? this.config.disableVisibilityManagement : !1) || this._storeInitalVisibility();
            this._checkHideContainer();
            this._initEditInfo();
            this._clickTab(0);
            this._updateCounts(!0);
            this._restoreIncidents()
        },
        _checkHideContainer: function() {
            this.hideContainer = !1;
            var a = this.map.infoWindow;
            a.popupInfoView && a.popupInfoView.container && (this.hideContainer = !0, this.own(f(a, "show", w.hitch(this, this._handlePopup))))
        },
        onClose: function() {
            this._storeIncidents();
            this._toggleTabLayersOld();
            this._resetInfoWindow();
            this.mapResize && (this.mapResize.remove(), this.mapResize = null);
            this.windowResize.remove();
            this.windowResize = null;
            this._clear(!0);
            this.widgetActive = !1;
            this.saveEnabled && (this.scSignal.remove(), this.sfSignal.remove());
            this._mapResize();
            this.disableVisibilityManagement || this._resetInitalVisibility();
            this.inherited(arguments);
            this._resetMapPosition();
            this._togglePopupClass(!1)
        },
        onDeActive: function() {
            this._clickIncidentsButton(-1)
        },
        destroy: function() {
            this._clear(!0);
            this._toggleTabLayersOld();
            this.lyrBuffer && this.map.removeLayer(this.lyrBuffer);
            this.lyrIncidents && this.map.removeLayer(this.lyrIncidents);
            this.lyrClosest && this.map.removeLayer(this.lyrClosest);
            this.lyrProximity && this.map.removeLayer(this.lyrProximity);
            this.lyrSummary && this.map.removeLayer(this.lyrSummary);
            this.lyrGroupedSummary && this.map.removeLayer(this.lyrGroupedSummary);
            this.inherited(arguments)
        },
        onAppConfigChanged: function(a, b) {
            switch (b) {
                case "themeChange":
                case "layoutChange":
                case "styleChange":
                    this._updateUI(a);
                    break;
                case "widgetPoolChange":
                    this._verifyRouting();
                    break;
                case "mapChange":
                    window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
                    break;
                case "attributeChange":
                    this._updateUI(a)
            }
        },
        _handlePopup: function() {
            this._clearMobileSetAsIncidentStyle();
            var b = a.byId("main-page"),
                c, d, e;
            this.map.infoWindow.popupInfoView ? (c = this.map.infoWindow.popupInfoView.container,
                d = ".mainSection { overflow-y: auto; height: " + (b.clientHeight - 60).toString() + "px; }", e = ".atiAttributes {overflow: auto; height: " + (b.clientHeight - 130).toString() + "px; }") : (c = C("div.atiAttributes", this.map.infoWindow.domNode)[0], d = ".mainSection { overflow-y: none; }", e = ".atiAttributes {overflow: none; }");
            b.clientHeight && c && (b = document.createElement("style"), b.type = "text/css", b.id = "_tempMainSectionOverride", c.appendChild(b), b.sheet.insertRule(d, 0), b.sheet.insertRule(e, 1))
        },
        _updateUI: function(a) {
            this._getStyleColor(a)
        },
        _updateFontColor: function(a) {
            "undefined" === typeof a && (a = this.appConfig);
            a = d.create("div", {
                id: "tempTitle",
                innerHTML: a.title
            }).getElementsByTagName("font");
            this.config.fontColor = a && 0 < a.length ? /^#[0-9A-F]{6}$/i.test(a[0].color) ? a[0].color : "#ffffff" : "#ffffff";
            d.destroy("tempTitle");
            a = document.querySelectorAll(".panelBottom ");
            for (var b = 0; b < a.length; b++) a[b].style.color = this.config.fontColor
        },
        _updateButtonBackgrounds: function(a, b) {
            B.forEach(this.imgContainer.children, function(c) {
                h.contains(c.children[0],
                    a ? "btn32img" : "btn32imgBlack") && h.remove(c.children[0], a ? "btn32img" : "btn32imgBlack");
                h.add(c.children[0], a ? "btn32imgBlack" : "btn32img");
                h.contains(c.children[0], b ? "darkThemeBackground" : "lightThemeBackground") && h.remove(c.children[0], b ? "darkThemeBackground" : "lightThemeBackground");
                h.add(c.children[0], b ? "lightThemeBackground" : "darkThemeBackground")
            });
            var c = this.allEnabled;
            B.forEach(this.saveOptions.children, function(d) {
                c ? B.forEach(d.children, function(c) {
                    h.contains(c.children[0], a ? "btn32img" : "btn32imgBlack") &&
                        h.remove(c.children[0], a ? "btn32img" : "btn32imgBlack");
                    h.add(c.children[0], a ? "btn32imgBlack" : "btn32img");
                    h.contains(c.children[0], b ? "darkThemeBackground" : "lightThemeBackground") && h.remove(c.children[0], b ? "darkThemeBackground" : "lightThemeBackground");
                    h.add(c.children[0], b ? "lightThemeBackground" : "darkThemeBackground")
                }) : (h.contains(d.children[0], a ? "btn32img" : "btn32imgBlack") && h.remove(d.children[0], a ? "btn32img" : "btn32imgBlack"), h.add(d.children[0], a ? "btn32imgBlack" : "btn32img"), h.contains(d.children[0],
                    b ? "darkThemeBackground" : "lightThemeBackground") && h.remove(d.children[0], b ? "darkThemeBackground" : "lightThemeBackground"), h.add(d.children[0], b ? "lightThemeBackground" : "darkThemeBackground"))
            })
        },
        _getStyleColor: function(a) {
            this._updateFontColor(a);
            setTimeout(w.hitch(this, function() {
                if (this.footerNode) {
                    var a = window.getComputedStyle(this.footerNode, null).getPropertyValue("background-color");
                    this.config.activeMapGraphicColor = a;
                    a = x.fromRgb(a);
                    this.lightTheme = 210 > .2126 * a.r + .7152 * a.g + .0722 * a.b ? !1 : !0;
                    this.config.color =
                        a.toHex();
                    this.isBlackTheme = "#000000" === this.config.color ? !0 : !1;
                    this._updateButtonBackgrounds(this.isBlackTheme, this.lightTheme);
                    this.updateActiveNodes(this.lightTheme, !0);
                    this.updateActiveNodes(this.lightTheme, !1);
                    this.isBlackTheme ? (h.remove(this.tabNodes[this.curTab], "active"), h.add(this.tabNodes[this.curTab], "activeBlack"), this.config.activeColor = "rgb(53, 53, 53)") : (h.remove(this.tabNodes[this.curTab], "activeBlack"), h.add(this.tabNodes[this.curTab], "active"), this.config.activeColor = "rgba(39, 39, 39, 0.3)");
                    this._setupSymbols();
                    this.dataValue ? this._drawIncident(this.dataValue, void 0, void 0, !0).then(w.hitch(this, function() {
                        this.dataValue = void 0;
                        this._bufferIncident()
                    })) : this._bufferIncident()
                }
            }), 300)
        },
        updateActiveNodes: function(a, b) {
            var c, d;
            b ? (b = [".SATcolLocate", ".SATcol", ".SATcolRec", ".borderCol", ".SATcolSmall"], c = "lightThemeBorder", d = "darkThemeBorder") : (b = ".btn32img .innerBL .innerBR .SA_panelClose .SA_panelRight .SA_panelLeft".split(" "), c = "lightThemeBackground", d = "darkThemeBackground");
            B.forEach(b,
                function(b) {
                    b = C(b);
                    for (var e = 0; e < b.length; e++) {
                        var f = b[e];
                        h.remove(f, a ? d : c);
                        h.add(f, a ? c : d)
                    }
                })
        },
        setPosition: function(a, b) {
            this.widgetActive && (b = window.jimuConfig.layoutId, "TabTheme" === this.appConfig.theme.name ? this.position = {
                left: this.widgetManager.getControllerWidgets()[0].domNode.clientWidth,
                right: 0,
                bottom: 24,
                height: 155,
                relativeTo: "browser"
            } : "DashboardTheme" === this.appConfig.theme.name ? (this.position = {
                left: 0,
                right: 0,
                bottom: 0,
                height: 155
            }, b = this.map.id) : this.position = {
                left: 0,
                right: 0,
                bottom: 0,
                height: 155,
                relativeTo: "browser"
            }, a = l.getPositionStyle(this.position), a.position = "absolute", c.place(this.domNode, b), c.setStyle(this.domNode, a), this.started && this.resize(), I.publish("changeMapPosition", {
                bottom: 155
            }))
        },
        disableWebMapPopup: function() {
            this.map && this.map.setInfoWindowOnClick(!1)
        },
        enableWebMapPopup: function() {
            this.map && this.map.setInfoWindowOnClick(!0)
        },
        _setEventLocation: function(a) {
            var b = a.feature ? a.feature : this.map.infoWindow.getSelectedFeature();
            if (a && "add" === a.type) b = {
                eventType: "IncidentLocationAdd",
                dataValue: b
            }, this.incidents = [], this.buffers = [], this.lyrIncidents.clear(), this.lyrBuffer.clear();
            else {
                for (var d = !0, e, f = 0; f < this.lyrIncidents.graphics.length; f++) {
                    var g = this.lyrIncidents.graphics[f];
                    if (g.geometry.type === b.geometry.type) {
                        var h = !F.equals(g.geometry, b.geometry);
                        g.attributes && b.attributes && !h && (h = h && z.stringify(g.attributes) === z.stringify(b.attributes));
                        d = d && h;
                        h || (e = g)
                    }
                }
                b = {
                    eventType: d ? "IncidentLocationAdd" : "IncidentLocationRemove",
                    dataValue: b,
                    removeGraphic: e
                }
            }
            this.onReceiveData("", "", b);
            this.map.infoWindow.isShowing && this.map.infoWindow.hide();
            a && (a = this.map.infoWindow, a.popupNavigationBar && (b = C(".esriMobileNavigationBar", a.popupNavigationBar.domNode), 0 < b.length && c.setStyle(b[0], "display", "none")), a.popupInfoView && (b = C(".esriMobileInfoView", a.popupInfoView.domNode), 0 < b.length && c.setStyle(b[0], "display", "none")))
        },
        _initLayers: function() {
            this.gsvc = new ea(this.config.geometryService && this.config.geometryService.url ? this.config.geometryService.url : this.appConfig.geometryService);
            this.locator =
                new Y(this.config.geocodeService.url);
            this.own(f(this.locator, "location-to-address-complete", w.hitch(this, this._showIncidentAddress)));
            this.own(f(this.locator, "error", w.hitch(this, this._onAddressError)));
            this.lyrBuffer = new O;
            this.map.addLayer(this.lyrBuffer);
            this.lyrIncidents = new O;
            this.map.addLayer(this.lyrIncidents);
            this.lyrClosest = new O;
            this.lyrClosest.setVisibility(!1);
            this.map.addLayer(this.lyrClosest);
            this.lyrProximity = new O;
            this.lyrProximity.setVisibility(!1);
            this.map.addLayer(this.lyrProximity);
            this.summaryDisplayEnabled && (this.lyrSummary = new O, this.lyrSummary.setVisibility(!1), this.map.addLayer(this.lyrSummary), this.lyrGroupedSummary = new O, this.lyrGroupedSummary.setVisibility(!1), this.map.addLayer(this.lyrGroupedSummary))
        },
        _mapLoaded: function() {
            C("[data-reference]").style("z-index", 0);
            this._processOperationalLayers();
            this.saveEnabled && this._initEdit();
            var a = this.map.itemInfo.itemData.baseMap.baseMapLayers[0];
            "ArcGISTiledMapServiceLayer" === a.layerType && a.resourceInfo.singleFusedMapCache ||
                (this.config.defaultZoomLevel = .5);
            this._clickTab(0)
        },
        _initEdit: function() {
            var a = this.map.infoWindow;
            this.config.saveEnabled && "undefined" === typeof this.config.savePolys && "undefined" === typeof this.config.saveLines && "undefined" === typeof this.config.savePoints && (this.config.savePolys = !0, this.config.polyEditLayer = this.config.editLayer, this.polyTemplate = this.config.editTemplate, this.honorTemplate = !0);
            this.config.savePoints && this._initEditLayer(this.config.pointEditLayer, "point");
            this.config.saveLines &&
                this._initEditLayer(this.config.lineEditLayer, "line");
            this.config.savePolys && this._initEditLayer(this.config.polyEditLayer, "poly");
            this.scSignal = f(a, "selection-change", w.hitch(this, this._selectionChanged));
            this.sfSignal = f(a, "set-features", w.hitch(this, this._setPopupFeature));
            var b = C(".esriPopupWrapper", a.domNode);
            0 < b.length && "undefined" !== typeof b[0].clientHeight && "undefined" !== typeof b[0].clientWidth && (this.defaultPopupSize = {
                width: b[0].clientWidth
            });
            a.highlight = !0
        },
        _getLayerIDs: function() {
            var a = [];
            B.forEach(this.opLayers._layerInfos, w.hitch(this, function(b) {
                0 < b.newSubLayers.length ? this._recurseLayersIDs(b.newSubLayers, a) : a.push({
                    id: b.id,
                    title: b.title
                })
            }));
            return a
        },
        _recurseLayersIDs: function(a, b) {
            B.forEach(a, w.hitch(this, function(a) {
                0 < a.newSubLayers.length ? this._recurseLayersIDs(a.newSubLayers, b) : b.push({
                    id: a.id,
                    title: a.title
                })
            }))
        },
        _initJimuLayerInfos: function() {
            if (this.config && this.config.tabs && this.config.tabs.length) {
                for (var a = this.config.tabs, b = [], c = this._getLayerIDs(), e = a.length - 1; 0 <=
                    e; e--) {
                    var f = a[e],
                        g = f.layerTitle ? f.layerTitle : f.layers;
                    if (f.layers && (f.jimuLayerInfo = this.opLayers.getLayerInfoById(f.layers), !f.jimuLayerInfo)) {
                        if (c && c.hasOwnProperty("length") && 0 < c.length) {
                            var h = 0;
                            a: for (; h < c.length; h++) {
                                var k = c[h];
                                if (k && k.hasOwnProperty("title") && k.title === g) {
                                    f.jimuLayerInfo = this.opLayers.getLayerInfoById(k.id);
                                    break a
                                }
                            }
                        }
                        f.jimuLayerInfo || (this.config.tabs.splice(e, 1), b.push(g))
                    }
                }
                if (0 < b.length) {
                    var l = "";
                    B.forEach(b, w.hitch(this, function(a) {
                        l += ca.substitute({
                                name: a
                            }, this.nls.missingLayer) +
                            "\x3c/br\x3e\x3c/br\x3e"
                    }));
                    a = d.create("div", {
                        style: "max-height:500px;overflow:auto;"
                    });
                    d.create("div", {
                        className: "SAT-warning-hint",
                        innerHTML: this.nls.missingLayerHint
                    }, a);
                    d.create("div", {
                        innerHTML: l.substr(0, l.lastIndexOf("\x3c/br\x3e\x3c/br\x3e")),
                        style: "padding-" + (window.isRTL ? "right" : "left") + ": 10px;"
                    }, a);
                    new m({
                        titleLabel: "\x3cdiv class\x3d'SAT-warning-icon' style\x3d'float: " + (window.isRTL ? "right; margin-left" : "left; margin-right") + ": 10px;'\x3e\x3c/div\x3e" + this.nls.layerNotAvalible,
                        message: a,
                        maxWidth: 350
                    })
                }
            }
        },
        _initEditLayer: function(a, b) {
            var c;
            "point" === b ? (this.pointEditLayer = this.opLayers.getLayerInfoById(a).layerObject, this.isPointEditable = this._isEditable(this.pointEditLayer), c = this.pointEditLayer, c.templates && 0 < c.templates.length ? this.pointTemplate = c.templates[0] : c.types && 0 < c.types.length && (this.pointTemplate = c.types[0].templates[0]), this.pointTemplate && (this.pointEditLayerPrototype = this.pointTemplate.prototype)) : "line" === b ? (this.lineEditLayer = this.opLayers.getLayerInfoById(a).layerObject,
                this.isLineEditable = this._isEditable(this.lineEditLayer), c = this.lineEditLayer, c.templates && 0 < c.templates.length ? this.lineTemplate = c.templates[0] : c.types && 0 < c.types.length && (this.lineTemplate = c.types[0].templates[0]), this.lineTemplate && (this.lineEditLayerPrototype = this.lineTemplate.prototype)) : "poly" === b && (this.polyEditLayer = this.opLayers.getLayerInfoById(a).layerObject, this.isPolyEditable = this._isEditable(this.polyEditLayer), c = this.polyEditLayer, this.honorTemplate || (c.templates && 0 < c.templates.length ?
                this.polyTemplate = c.templates[0] : c.types && 0 < c.types.length && (this.polyTemplate = c.types[0].templates[0])), this.polyTemplate && (this.polyEditLayerPrototype = this.polyTemplate.prototype));
            c && this.own(f(c, "click", w.hitch(this, function(a) {
                if (a.graphic) switch (a = a.graphic, a.geometry.type) {
                    case "point":
                        this.pointUpdateFeature = a;
                        break;
                    case "polyline":
                        this.lineUpdateFeature = a;
                        break;
                    case "polygon":
                        this.polyUpdateFeature = a
                }
            })))
        },
        _isEditable: function(a) {
            var b = !1;
            a.isEditable() && a.getEditCapabilities && (b = a.getEditCapabilities());
            return b && b.canUpdate && b.canCreate
        },
        _initEditInfo: function() {
            if (this.saveEnabled) {
                var a = !1;
                this.polyEditLayer && this.isPolyEditable && (a = !0, this.defaultPolyContent = this.polyEditLayer.infoTemplate ? this.polyEditLayer.infoTemplate.content : void 0, this.polyEditLayer.infoTemplate.setContent(w.hitch(this, this._setEditLayerPopup)));
                this.lineEditLayer && this.isLineEditable && (a = !0, this.defaultLineContent = this.lineEditLayer.infoTemplate ? this.lineEditLayer.infoTemplate.content : void 0, this.lineEditLayer.infoTemplate.setContent(w.hitch(this,
                    this._setEditLayerPopup)));
                this.pointEditLayer && this.isPointEditable && (a = !0, this.defaultPointContent = this.pointEditLayer.infoTemplate ? this.pointEditLayer.infoTemplate.content : void 0, this.pointEditLayer.infoTemplate.setContent(w.hitch(this, this._setEditLayerPopup)));
                a && this.map.infoWindow.resize(350, 340)
            }
        },
        _setPopupFeature: function() {
            if (0 < this.map.infoWindow.count) {
                var a = this.map.infoWindow.getSelectedFeature();
                switch (a.geometry.type) {
                    case "point":
                        this.pointUpdateFeature = a;
                        break;
                    case "polyline":
                        this.lineUpdateFeature =
                            a;
                        break;
                    case "poly":
                        this.polyUpdateFeature = a
                }
            }
        },
        _selectionChanged: function() {
            if (0 < this.map.infoWindow.count) {
                var a = this.map.infoWindow.getSelectedFeature();
                switch (a.geometry.type) {
                    case "point":
                        this.pointUpdateFeature = a;
                        break;
                    case "polyline":
                        this.lineUpdateFeature = a;
                        break;
                    case "poly":
                        this.polyUpdateFeature = a
                }
            }
        },
        _setEditLayerPopup: function(a) {
            var b;
            "polygon" === a.geometry.type && (b = this.polyEditLayer);
            "polyline" === a.geometry.type && (b = this.lineEditLayer);
            "point" === a.geometry.type && (b = this.pointEditLayer);
            for (var c = [], e = this._getPopupFields(b), g = 0; g < e.length; g++) {
                var h = e[g];
                h.isEditable && h.isEditableOnLayer && c.push({
                    fieldName: h.fieldName,
                    isEditable: h.isEditable
                })
            }
            this.attInspector = new ha({
                layerInfos: [{
                    featureLayer: b,
                    showAttachments: !1,
                    isEditable: !0,
                    fieldInfos: c
                }]
            }, d.create("div"));
            c = new u({
                label: this.nls.update_btn,
                "class": " atiButton"
            }, d.create("div"));
            d.place(c.domNode, this.attInspector.deleteBtn.domNode.parentNode);
            this._togglePopupClass(!0);
            this.own(f(c, "click", w.hitch(this, function() {
                b.applyEdits(null,
                    [a], null, w.hitch(this, function() {
                        this.map.infoWindow.hide()
                    }),
                    function(a) {
                        var b = "Error";
                        "undefined" !== typeof a.details && (b = a.details);
                        "undefined" !== typeof a.message && (b = a.message);
                        new m({
                            message: b
                        })
                    })
            })));
            this.own(f(this.attInspector, "attribute-change", w.hitch(this, function(a) {
                switch (a.feature.geometry.type) {
                    case "point":
                        this.pointUpdateFeature = a.feature;
                        this.pointUpdateFeature.attributes[a.fieldName] = a.fieldValue;
                        break;
                    case "polyline":
                        this.lineUpdateFeature = a.feature;
                        this.lineUpdateFeature.attributes[a.fieldName] =
                            a.fieldValue;
                        break;
                    case "polygon":
                        this.polyUpdateFeature = a.feature, this.polyUpdateFeature.attributes[a.fieldName] = a.fieldValue
                }
            })));
            this.own(f(this.attInspector, "next", w.hitch(this, function(a) {
                switch (a.feature.geometry.type) {
                    case "point":
                        this.pointUpdateFeature = a.feature;
                        break;
                    case "polyline":
                        this.pointUpdateFeature = a.feature;
                        break;
                    case "poly":
                        this.pointUpdateFeature = a.feature
                }
            })));
            this.own(f(this.attInspector, "delete", w.hitch(this, function(a) {
                var c = !1;
                if (0 < this.incidents.length) {
                    for (var d = 0; d < this.incidents.length; d++) F.equals(a.feature.geometry,
                        this.incidents[d].geometry) && (c = !0);
                    if (!c && 0 < this.lyrBuffer.graphics.length)
                        for (d = 0; d < length; d++) F.equals(a.feature.geometry, this.lyrBuffer.graphics[d].geometry) && (c = !0)
                }
                b.applyEdits(null, null, [a.feature], function() {}, function(a) {
                    var b = "Error";
                    "undefined" !== typeof a.details && (b = a.details);
                    "undefined" !== typeof a.message && (b = a.message);
                    new m({
                        message: b
                    })
                });
                this.pointEditLayer && (this.pointUpdateFeature = this.pointEditLayerPrototype);
                this.lineEditLayer && (this.lineUpdateFeature = this.lineEditLayerPrototype);
                this.polyEditLayer && (this.polyUpdateFeature = this.polyEditLayerPrototype);
                c && this._clear(!1);
                this.map.infoWindow.hide()
            })));
            switch (a.geometry.type) {
                case "point":
                    this.pointUpdateFeature = a;
                    break;
                case "polyline":
                    this.lineUpdateFeature = a;
                    break;
                case "polygon":
                    this.polyUpdateFeature = a
            }
            this.attInspector.showFeature(a);
            return this.attInspector.domNode
        },
        _getPopupFields: function(a) {
            var b;
            if (a.infoTemplate) b = a.infoTemplate.info.fieldInfos;
            else if (-1 < this.tab.tabLayers[0].url.indexOf("MapServer")) {
                var c = this.tab.tabLayers[0].url.split("MapServer/")[1],
                    d = this.parent.map.itemInfo.itemData.operationalLayers;
                b = null;
                for (var e = 0; e < d.length; e++) {
                    var f = d[e];
                    if (f.layerObject.infoTemplates && (f = f.layerObject.infoTemplates[c])) {
                        b = f.infoTemplate.info.fieldInfos;
                        break
                    }
                }
            } else b = a.fields;
            b || (b = a.fields);
            return b
        },
        _updatePopup: function(a, b, c) {
            b = [];
            for (c = 0; c < a.length; c++) {
                var d = a[c],
                    e = new ja;
                e.objectIds = [d.oid];
                b.push(d.layer.selectFeatures(e, T.SELECTION_NEW))
            }(new E(b)).then(w.hitch(this, function(a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = a[c];
                    if (d[0]) {
                        d = d[1][0];
                        b.push(d);
                        switch (d.geometry.type) {
                            case "point":
                                this.pointUpdateFeature = d;
                                break;
                            case "polyline":
                                this.lineUpdateFeature = d;
                                break;
                            case "poly":
                                this.polyUpdateFeature = d
                        }
                        this.attInspector || this._setEditLayerPopup(d);
                        this.attInspector && this.attInspector.showFeature(d)
                    }
                }
            }))
        },
        _processOperationalLayers: function() {
            for (var a = 0; a < this.config.tabs.length; a++) {
                var b = this.config.tabs[a];
                b.layers && "" !== b.layers && (this.hasLayerTitle = "undefined" !== typeof b.layerTitle, b.tabLayers = this._getTabLayers(b.layers))
            }
        },
        _createUI: function() {
            var a =
                l.stripHTML(this.config.bufferLabel ? this.config.bufferLabel : "");
            this.buffer_lbl.innerHTML = a;
            this.buffer_lbl_unit.innerHTML = this.nls[this.config.distanceUnits];
            this.spinnerValue.constraints = {
                min: this.SLIDER_MIN_VALUE,
                max: this.SLIDER_MAX_VALUE
            };
            this.spinnerValue.intermediateChanges = !0;
            a = ca.substitute({
                min: this.SLIDER_MIN_VALUE,
                max: this.SLIDER_MAX_VALUE
            }, this.nls.buffer_invalid);
            this.spinnerValue.invalidMessage = a;
            this.spinnerValue.rangeMessage = a;
            this.spinnerValue.set("value", this.SLIDER_DEFAULT_VALUE);
            this.locateIncident.innerHTML = "undefined" !== typeof this.config.locateIncidentLabel ? this.config.locateIncidentLabel : this.nls.locate_incident;
            this.config.tabs.splice(0, 0, {
                type: "incidents",
                label: "undefined" !== typeof this.config.incidentLabel ? this.config.incidentLabel : this.nls.incident,
                color: this.config.color
            });
            this.panelNodes.push(this.SA_tabPanel0);
            for (var a = this.panelContainer, c = this.tabsNode, e = 0, g = 0; g < this.config.tabs.length; g++) {
                var k = this.config.tabs[g],
                    m = k.label;
                m && "" !== m || (m = k.layerTitle ? k.layerTitle :
                    k.layers);
                m = d.create("div", {
                    "data-dojo-attach-point": "SA_tab" + g,
                    innerHTML: l.stripHTML(m ? m : "")
                }, c);
                this.tabNodes.push(m);
                h.add(m, "SATTab");
                e += q.position(m).w;
                f(m, "click", w.hitch(this, this._clickTab, g));
                0 < g && (m = d.create("div", {
                    "data-dojo-attach-point": "SA_tabPanel" + g,
                    innerHTML: ""
                }, a), this.panelNodes.push(m), h.add(m, "SAT_tabPanel"), "summary" === k.type && (k.summaryInfo = new ka(k, m, this), this.own(f(k.summaryInfo, "summary-complete", w.hitch(this, this.restore)))), "groupedSummary" === k.type && (k.groupedSummaryInfo =
                    new la(k, m, this), this.own(f(k.groupedSummaryInfo, "summary-complete", w.hitch(this, this.restore)))), "closest" === k.type && (k.closestInfo = new ma(k, m, this)), "proximity" === k.type && (k.proximityInfo = new na(k, m, this)))
            }
            e += 10;
            b.set(c, "width", e + "px");
            e > q.position(this.footerNode).w && (b.set(this.footerContentNode, "right", "58px"), b.set(this.panelRight, "display", "block"));
            f(c, "scroll", w.hitch(this, this._onPanelScroll))
        },
        restore: function(a) {
            a.tab === this.curTab && this._clickTab(a.tab)
        },
        validateSavePrivileges: function() {
            var a =
                new S;
            e.getPortal(this.appConfig.portalUrl).getUser().then(w.hitch(this, function(b) {
                b && b.privileges ? a.resolve(-1 < b.privileges.indexOf("features:user:edit") ? !0 : !1) : a.resolve(!0)
            }), w.hitch(this, function(b) {
                console.log(b);
                a.resolve(!0)
            }));
            return a
        },
        validateSnapshotPrivileges: function() {
            var a = new S;
            e.getPortal(this.appConfig.portalUrl).getUser().then(w.hitch(this, function(b) {
                b && b.privileges ? a.resolve(-1 < b.privileges.indexOf("portal:publisher:publishFeatures") && -1 < b.privileges.indexOf("portal:user:createItem") ?
                    !0 : !1) : a.resolve(!1)
            }), w.hitch(this, function(b) {
                console.log(b);
                a.resolve(!1)
            }));
            return a
        },
        _loadUI: function() {
            var a = this.allEnabled ? d.create("div", {
                    "class": "displayT pad-top-5"
                }, this.saveOptions) : this.saveOptions,
                b = this.allEnabled ? d.create("div", {
                    "class": "displayT pad-top-10"
                }, this.saveOptions) : this.saveOptions,
                e = this.allEnabled ? "displayTC" : "displayTR";
            this.reportEnabled && (this.createReportButtonSpan = d.create("span", {
                "class": "btn32 " + e
            }, a), this.createReportButton = d.create("img", {
                "class": "btn32img",
                title: this.nls.createReport,
                src: this.reportSrc
            }, this.createReportButtonSpan), this.own(f(this.createReportButton, "click", w.hitch(this, this._createReport))));
            this.saveEnabled && (this.saveButtonSpan = d.create("span", {
                "class": "btn32 " + e
            }, a), this.validateSavePrivileges().then(w.hitch(this, function(a) {
                this.userCanSave = a;
                this.saveButton = d.create("img", {
                    "class": a ? "btn32img" : "btn32img btnDisabled",
                    title: a ? this.nls.saveIncident : this.nls.user_credentials,
                    src: this.saveSrc
                }, this.saveButtonSpan);
                a && this.own(f(this.saveButton,
                    "click", w.hitch(this, this._saveIncident)))
            }), function(a) {
                console.log(a)
            }));
            a = d.create("span", {
                "class": "btn32 " + e
            }, b);
            this.downloadAllButon = d.create("img", {
                "class": "btn32img",
                title: this.nls.downloadAll,
                src: this.downloadAllSrc
            }, a);
            this.own(f(this.downloadAllButon, "click", w.hitch(this, this._downloadAll)));
            this.snapshotEnabled && (this.createSnapshotButtonSpan = d.create("span", {
                "class": "btn32 " + e
            }, b), this.validateSnapshotPrivileges().then(w.hitch(this, function(a) {
                this.userCanSnapshot = a;
                this.createSnapshotButton =
                    d.create("img", {
                        "class": a ? "btn32img" : "btn32img btnDisabled",
                        title: a ? this.nls.createSnapshot : this.nls.user_credentials,
                        src: this.snapshotSrc
                    }, this.createSnapshotButtonSpan);
                a && this.own(f(this.createSnapshotButton, "click", w.hitch(this, this._createSnapshot)))
            }), function(a) {
                console.log(a)
            }));
            b = {
                0: this.nls.drawPoint,
                1: this.nls.drawLine,
                2: this.nls.drawPolygon
            };
            this.btnNodes = [this.SA_btn0, this.SA_btn1, this.SA_btn2];
            for (e = 0; 3 > e; e++) a = this.btnNodes[e], c.setAttr(a, "src", this.folderUrl + "images/btn" + e + ".png"),
                c.setAttr(a, "title", b[e]), this.own(f(a, "click", w.hitch(this, this._clickIncidentsButton, e)));
            this.toolbar = new Z(this.map, {
                tooltipOffset: 20,
                drawTime: 90
            });
            this.toolbar.on("draw-complete", w.hitch(this, this._drawIncident));
            this.own(f(this.spinnerValue, "change", w.hitch(this, function() {
                this._updateSpinnerValue(!1)
            })));
            this.own(f(this.spinnerValue, "blur", w.hitch(this, function(a) {
                this._updateSpinnerValue(!0)
            })));
            this.own(f(this.spinnerValue, "keyup", w.hitch(this, function(a) {
                a.keyCode === pa.ENTER ? this._updateSpinnerValue(!0) :
                    this._updateSpinnerValue(!1)
            })))
        },
        _locateBuffer: function(a) {
            if (null !== a && (a = "extent" === a.type ? a : a.getExtent(), null !== a)) {
                a = a.expand(1.5);
                var b = 80 / this.map.height,
                    c = a.getHeight();
                a.update(a.xmin, a.ymin - c * b, a.xmax, a.ymax - c * b, this.map.spatialReference);
                this.map.setExtent(a, !0)
            }
        },
        _clickIncidentsButton: function(a) {
            var b;
            if (3 > a) {
                for (var c = 0; 3 > c; c++) b = this.btnNodes[c], h.remove(b, "btnOn"); - 1 < a && a !== this.tool ? (b = this.btnNodes[a], 3 > a && h.add(b, "btnOn"), this.tool = a) : this.tool = -1;
                switch (this.tool) {
                    case -1:
                        this.toolbar.deactivate();
                        this.enableWebMapPopup();
                        break;
                    case 0:
                        this._clear(!1);
                        this.toolbar.activate(Z.POINT);
                        this.disableWebMapPopup();
                        break;
                    case 1:
                        this._clear(!1);
                        this.toolbar.activate(Z.POLYLINE);
                        this.disableWebMapPopup();
                        break;
                    case 2:
                        this._clear(!1), this.toolbar.activate(Z.POLYGON), this.disableWebMapPopup()
                }
            } else this._clear(!0)
        },
        _saveIncident: function() {
            this.map.infoWindow.hide();
            this._updateProcessing(this.saveButton, !0, this.saveSrc);
            var a = [];
            this.config.saveEnabled && "undefined" === typeof this.config.savePolys && "undefined" ===
                typeof this.config.saveLines && "undefined" === typeof this.config.savePoints && (this.config.savePolys = !0);
            if (this.config.savePolys) {
                var b = this._getIncidentGraphics("polygon", this.polyEditLayerPrototype);
                0 < b.length && a.push({
                    layer: this.polyEditLayer,
                    graphics: b
                })
            }
            this.config.saveLines && (b = this._getIncidentGraphics("polyline", this.lineEditLayerPrototype), 0 < b.length && a.push({
                layer: this.lineEditLayer,
                graphics: b
            }));
            this.config.savePoints && (b = this._getIncidentGraphics("point", this.pointEditLayerPrototype), 0 <
                b.length && a.push({
                    layer: this.pointEditLayer,
                    graphics: b
                }));
            0 < a.length ? this._applyEdits(a) : this._updateProcessing(this.saveButton, !1, this.saveSrc);
            this._clickIncidentsButton(-1)
        },
        _getIncidentGraphics: function(a, b) {
            var c = [];
            b = z.parse(z.stringify(b));
            if ("polygon" === a)
                for (var d = 0; d < this.lyrBuffer.graphics.length; d++) {
                    var e = this.lyrBuffer.graphics[d],
                        f = new D;
                    f.geometry = e.geometry;
                    f.setAttributes(b.attributes);
                    c.push(f)
                }
            for (d = 0; d < this.incidents.length; d++) e = this.incidents[d], e.geometry.type === a && (f = new D,
                f.geometry = e.geometry, f.setAttributes(b.attributes), c.push(f));
            return c
        },
        _applyEdits: function(a) {
            for (var b = new S, c = [], d = [], e = 0; e < a.length; e++) {
                var f = a[e];
                f.layer.visible || f.layer.setVisibility(!0);
                var g = [];
                if (1 < f.graphics.length && "polygon" === f.graphics[0].geometry.type) {
                    var h = f.graphics[0],
                        k = f.graphics.map(function(a) {
                            return a.geometry
                        });
                    if (k = F.union(k)) h.geometry = k, g.push(h)
                }
                c.push(f.layer.applyEdits(0 < g.length ? g : f.graphics, null, null))
            }(new E(c)).then(w.hitch(this, function(c) {
                for (var e = !1, f = 0; f <
                    c.length; f++) {
                    var g = c[f][1][0];
                    g.success && (e = !0, g.hasOwnProperty("objectId") && d.push({
                        oid: g.objectId,
                        layer: a[f].layer
                    }))
                }
                this._smartEdit();
                if (!this.map.infoWindow.isShowing) {
                    c = this.incidents[0].geometry;
                    var h;
                    switch (c.type) {
                        case "point":
                            h = c;
                            break;
                        case "polyline":
                            h = c.paths[0][parseInt(c.paths[0].length / 2, 10)];
                            h = new G(h[0], h[1], c.spatialReference);
                            break;
                        case "polygon":
                            h = c.getCentroid()
                    }
                    c = this.map.toScreen(h);
                    0 < d.length && this._updatePopup(d, h, c);
                    this._updateProcessing(this.saveButton, !1, this.saveSrc);
                    this.map.emit("click", {
                        bubbles: !0,
                        cancelable: !0,
                        screenPoint: c,
                        mapPoint: h
                    })
                }
                b.resolve(e)
            }), w.hitch(this, function(a) {
                console.error(a);
                this._updateProcessing(this.saveButton, !1, this.saveSrc);
                new m({
                    message: a
                });
                b.reject(a)
            }));
            return b
        },
        _smartEdit: function() {
            if (!this.smartEditor) {
                var a = this.appConfig.getConfigElementsByName("SmartEditor");
                B.forEach(a, w.hitch(this, function(a) {
                    "SmartEditor" === a.name && (this.smartEditor = this.widgetManager.getWidgetById(a.id))
                }))
            }
            this.smartEditor && this.smartEditor.state && "opened" ===
                this.smartEditor.state && this.smartEditor._mapClickHandler(!0)
        },
        _clear: function(a) {
            this.map.graphics.clear();
            this.lyrIncidents.clear();
            this.lyrBuffer.clear();
            this.lyrProximity.clear();
            this.lyrClosest.clear();
            this.geomExtent = void 0;
            this.summaryDisplayEnabled && this.lyrSummary && this.lyrSummary.clear();
            this.summaryDisplayEnabled && this.lyrGroupedSummary && this.lyrGroupedSummary.clear();
            this.saveOptions && (h.remove(this.saveOptions, "displayT"), h.add(this.saveOptions, "display-off"));
            this.borderCol && (h.remove(this.borderCol,
                "display-on"), h.add(this.borderCol, "display-off"));
            this.clearIncident && (h.remove(this.clearIncident, "display-on"), h.add(this.clearIncident, "display-off"));
            this.smartEditor && this.smartEditor._onCancelButtonClicked();
            this.incidents = [];
            this.buffers = [];
            this.div_reversed_address && (this.div_reversed_address.innerHTML = "");
            this.div_reverse_geocoding && c.setStyle(this.div_reverse_geocoding, "visibility", "hidden");
            this._updateCounts(!0);
            this._clearGraphics();
            a && this.spinnerValue && this.spinnerValue.set("value",
                this.SLIDER_DEFAULT_VALUE);
            this.pointEditLayer && (this.pointUpdateFeature = this.pointEditLayerPrototype);
            this.lineEditLayer && (this.lineUpdateFeature = this.lineEditLayerPrototype);
            this.polyEditLayer && (this.polyUpdateFeature = this.polyEditLayerPrototype);
            this._clearMobileSetAsIncidentStyle()
        },
        _clearMobileSetAsIncidentStyle: function() {
            d.destroy(a.byId("_tempMainSectionOverride"))
        },
        _updateSpinnerValue: function(a) {
            if (this.spinnerValue.validate()) {
                var b = this.spinnerValue.displayedValue;
                "string" === typeof b &&
                    (b = parseFloat(b.toString().replace(/,/g, ""), 10));
                b < this.SLIDER_MIN_VALUE ? this.spinnerValue.set("value", this.SLIDER_MIN_VALUE) : b > this.SLIDER_MAX_VALUE && this.spinnerValue.set("value", this.SLIDER_MAX_VALUE);
                a && this._bufferIncident()
            }
        },
        _clickTab: function(a) {
            this._validateFeatureCount(a) && (this._toggleTabs(a), this._toggleTabLayers(a), this.curTab = a, this._clickIncidentsButton(-1))
        },
        _validateFeatureCount: function(a) {
            var b = !0;
            a = this.config.tabs[a];
            switch (a.type) {
                case "summary":
                    b = 0 < a.summaryInfo.featureCount;
                    break;
                case "groupedSummary":
                    b = 0 < a.groupedSummaryInfo.featureCount;
                    break;
                case "closest":
                    b = 0 < a.closestInfo.featureCount;
                    break;
                case "proximity":
                    b = 0 < a.proximityInfo.featureCount
            }
            return b
        },
        _toggleTabs: function(a) {
            for (var c = 0; c < this.config.tabs.length; c++) c === a ? (h.add(this.tabNodes[c], this.isBlackTheme ? "activeBlack" : "active"), b.set(this.panelNodes[c], "display", "block")) : (h.remove(this.tabNodes[c], "active"), h.remove(this.tabNodes[c], "activeBlack"), b.set(this.panelNodes[c], "display", "none"));
            this._scrollToTab(a)
        },
        _toggleTabLayers: function(a) {
            this._toggleTabLayersOld();
            this._toggleTabLayersNew(a)
        },
        _toggleTabLayersOld: function() {
            var a = this.config.tabs[this.curTab];
            a && (this.lyrClosest.setVisibility(!1), this.lyrProximity.setVisibility(!1), this.lyrSummary && this.lyrSummary.setVisibility(!1), this.lyrGroupedSummary && this.lyrGroupedSummary.setVisibility(!1), this._setLayerVisible(a, !1))
        },
        _toggleTabLayersNew: function(a) {
            var b = this.config.tabs[a];
            switch (b.type) {
                case "summary":
                    var c = !1;
                    this.lyrSummary && (this.currentSumLayer !==
                        a && (c = !0), this.lyrSummary.clear());
                    b.tabLayers && 1 < b.tabLayers.length && (this.lyrSummary && (this.lyrSummary.infoTemplate = b.tabLayers[1].infoTemplate, B.forEach(b.tabLayers[1].graphics, w.hitch(this, function(a) {
                        this.lyrSummary.add(a)
                    })), this.lyrSummary.setVisibility(!0)), c && (this.currentSumLayer = a, this._toggleTabLayersNew(a)));
                    0 < this.incidents.length && !0 === b.updateFlag && (b.summaryInfo.updateForIncident(this.incidents, this.buffers, this.summaryDisplayEnabled ? this.lyrSummary : null, a), this.currentSumLayer = a);
                    break;
                case "groupedSummary":
                    this.lyrGroupedSummary && (this.currentSumLayer !== a && (c = !0), this.lyrGroupedSummary.clear());
                    b.tabLayers && 1 < b.tabLayers.length && (this.lyrGroupedSummary && (this.lyrGroupedSummary.infoTemplate = b.tabLayers[1].infoTemplate, B.forEach(b.tabLayers[1].graphics, w.hitch(this, function(a) {
                        this.lyrGroupedSummary.add(a)
                    })), this.lyrGroupedSummary.setVisibility(!0)), c && (this.currentSumLayer = a, this._toggleTabLayersNew(a)));
                    0 < this.incidents.length && !0 === b.updateFlag && (b.groupedSummaryInfo.updateForIncident(this.incidents,
                        this.buffers, this.summaryDisplayEnabled ? this.lyrGroupedSummary : null, a), this.currentGrpLayer = a);
                    break;
                case "closest":
                    this._setLayerVisible(b, !0);
                    this.lyrClosest.setVisibility(!0);
                    0 < this.incidents.length && (b.closestInfo && b.closestInfo.container && (b.closestInfo.container.innerHTML = "", h.add(b.closestInfo.container, "loading")), !1 === b.updateFlag && this.lyrClosest.clear(), b.closestInfo.updateForIncident(this.incidents, this.config.maxDistance, this.lyrClosest));
                    break;
                case "proximity":
                    this._setLayerVisible(b,
                        !0), this.lyrProximity.setVisibility(!0), 0 < this.incidents.length && (b.proximityInfo && b.proximityInfo.container && (b.proximityInfo.container.innerHTML = "", h.add(b.proximityInfo.container, "loading")), !1 === b.updateFlag && this.lyrProximity.clear(), b.proximityInfo.updateForIncident(this.incidents, this.buffers, this.lyrProximity))
            }
            b.updateFlag = !1
        },
        _setLayerVisible: function(a, b) {
            this.disableVisibilityManagement || a.tabLayers && B.forEach(a.tabLayers, function(c) {
                "undefined" !== typeof c.visible && c.setVisibility(b);
                a && a.jimuLayerInfo && a.jimuLayerInfo.setTopLayerVisible && a.jimuLayerInfo.setTopLayerVisible(b)
            })
        },
        _drawIncident: function(a, b, c, d) {
            var e = new S;
            a = Array.isArray(a) ? a : [a];
            for (var f = !1, g = [], h = [], k = [], l = 0; l < a.length; l++) {
                var m = a[l],
                    n = m.geometry.type;
                null === this.symPoint && this._getStyleColor();
                "point" === n && (d = !0, this._getIncidentAddress(m.geometry));
                f = "polyline" === n ? this.isLineEditable : "polygon" === n ? this.isPolyEditable : this.isPointEditable;
                d ? k.push(m.geometry) : g.push(this._updateGeom(m.geometry));
                h.push({
                    symbol: "polyline" ===
                        n ? this.symLine : "polygon" === n ? this.symPoly : this.symPoint,
                    attributes: m.attributes,
                    infoTemplate: m.infoTemplate
                })
            }
            d ? (this._drawIncidentComplete(k, h, f, b, c), e.resolve()) : (new E(g)).then(w.hitch(this, function(a) {
                B.forEach(a, function(a) {
                    k.push(a[1])
                });
                this._drawIncidentComplete(k, h, f, b, c);
                e.resolve()
            }));
            return e
        },
        _drawIncidentComplete: function(a, b, c, d, e) {
            for (var f = 0; f < a.length; f++) {
                var g = b[f],
                    g = new D(a[f], g.symbol, g.attributes, g.infoTemplate);
                this.incidents.push(g);
                this.lyrIncidents.add(g)
            }
            this._updatePanel(c);
            this.toolbar.deactivate();
            this._clickIncidentsButton(-1);
            this._bufferIncident(d, e)
        },
        _updatePanel: function(a) {
            this.div_reversed_address.innerHTML = "";
            c.setStyle(this.div_reverse_geocoding, "visibility", "hidden");
            this.saveEnabled && (h.remove(this.saveButton, "display-off"), (a = a && this.userCanSave) && h.contains(this.saveButton, "btnDisabled") && h.remove(this.saveButton, "btnDisabled"), h.add(this.saveButton, a ? "displayT" : "displayT btnDisabled"));
            h.remove(this.saveOptions, "display-off");
            h.add(this.saveOptions, "displayT");
            h.remove(this.borderCol, "display-off");
            h.add(this.borderCol, "display-on");
            h.remove(this.clearIncident, "display-off");
            h.add(this.clearIncident, "display-on")
        },
        _updateGeom: function(a) {
            var b = new S,
                c = a.spatialReference;
            this.config.drawGeodesic ? this._getGeographicGeom(a).then(w.hitch(this, function(d) {
                d = Q.geodesicDensify(d, 5E3);
                if (A.canProject(d, c)) b.resolve(A.project(d, c));
                else if (this.transformation) {
                    var e = new X;
                    e.outSR = c;
                    e.geometries = [d];
                    isNaN(this.transformation) || (e.transformForward = !1);
                    e.transformation =
                        this.transformation;
                    try {
                        this.gsvc.project(e, w.hitch(this, function(a) {
                            b.resolve(a[0])
                        }))
                    } catch (sa) {
                        console.log(sa), b.resolve(a)
                    }
                } else b.resolve(a)
            }), w.hitch(this, function(c) {
                console.log(c);
                b.resolve(a)
            })) : b.resolve(a);
            return b
        },
        _getIncidentAddress: function(a) {
            this.incidentPoint = a;
            this.map.graphics.clear();
            this._getGeographicGeom(a).then(w.hitch(this, function(a) {
                this.locator.locationToAddress(a, 100)
            }), function(a) {
                console.log(a)
            })
        },
        _getGeographicGeom: function(a) {
            var b = new S,
                c = new W(3857);
            A.canProject(a,
                c) ? b.resolve(A.webMercatorToGeographic(A.project(a, c))) : (c = F.buffer(a, 100, 9001), c = {
                url: this.gsvc.url + "/findTransformations",
                content: {
                    f: "json",
                    inSR: a.spatialReference.wkid,
                    outSR: 4326,
                    extentOfInterest: z.stringify(c.getExtent().toJson())
                },
                handleAs: "json",
                callbackParamName: "callback"
            }, ba(c, {
                usePost: !1
            }).then(w.hitch(this, function(c) {
                (c = c && c.transformations ? c.transformations : void 0) && 0 < c.length && (this.transformation = c[0].wkid ? c[0].wkid : c[0].geoTransforms ? c[0] : void 0);
                c = new X;
                c.outSR = new W(4326);
                c.geometries = [a];
                c.transformation = this.transformation;
                try {
                    this.gsvc.project(c, w.hitch(this, function(a) {
                        b.resolve(a[0])
                    }))
                } catch (ra) {
                    console.log(ra), b.resolve(a)
                }
            }), w.hitch(this, function(a) {
                b.reject(a)
            })));
            return b
        },
        _showIncidentAddress: function(a) {
            if (a.address.address) {
                var b = a.address.address.Address,
                    d = new U;
                d.family = "Arial";
                d.size = "18px";
                d = new V(b, d, new R("#000000"));
                d.setOffset(20, -4);
                d.horizontalAlignment = "left";
                this.map.graphics.add(new D(this.incidentPoint, d, {}));
                this.div_reversed_address.innerHTML = b + "\x3c/br\x3e" +
                    a.address.address.City + ", " + a.address.address.Region + " " + a.address.address.Postal;
                c.setStyle(this.div_reverse_geocoding, "visibility", "visible")
            }
        },
        _onAddressError: function() {
            this.div_reversed_address.innerHTML = this.nls.reverse_geocoded_error;
            c.setStyle(this.div_reverse_geocoding, "visibility", "visible")
        },
        _bufferIncident: function(a, b) {
            var c = new S;
            if (0 !== this.incidents.length && this.spinnerValue.validate()) {
                for (var d = 0; d < this.config.tabs.length; d++) this.config.tabs[d].updateFlag = !0;
                this.buffers = [];
                this.lyrBuffer.clear();
                for (var e = !1, d = [], f = 0; f < this.incidents.length; f++) {
                    var g = this.incidents[f],
                        h = this.spinnerValue.get("value"),
                        k = this.config.distanceSettings[this.config.distanceUnits];
                    if (0 < h) {
                        var l = g.geometry.spatialReference.wkid,
                            m;
                        this.config.drawGeodesic ? 4326 === l || g.geometry.spatialReference.isWebMercator() ? (m = F.geodesicBuffer(g.geometry, h, k), this.buffers.push(m)) : d.push(this._updateGeom(g.geometry)) : (m = F.buffer(g.geometry, h, k), this.buffers.push(m))
                    } else a = !1, g = g.geometry.type, "polyline" !== g || e || (e = this.isLineEditable),
                        "polygon" !== g || e || (e = this.isPolyEditable), "point" !== g || e || (e = this.isPointEditable)
                }
                0 < d.length ? (new E(d)).then(w.hitch(this, function(d) {
                    B.forEach(d, w.hitch(this, function(a) {
                        m = F.geodesicBuffer(a[1], h, k);
                        this.buffers.push(m)
                    }));
                    this._useBuffers(a, b, e);
                    c.resolve()
                })) : (this._useBuffers(a, b, e), c.resolve());
                return c
            }
        },
        _useBuffers: function(a, b, c) {
            0 < this.buffers.length ? (this.saveEnabled && (h.remove(this.saveButton, "display-off"), h.contains(this.saveButton, "btnDisabled") && this.isPolyEditable && this.userCanSave &&
                h.remove(this.saveButton, "btnDisabled"), h.add(this.saveButton, "displayT")), this._handleBuffers(this.symPoly, a)) : (this.saveEnabled && (c && this.userCanSave ? h.contains(this.saveButton, "btnDisabled") && h.remove(this.saveButton, "btnDisabled") : h.add(this.saveButton, "btnDisabled")), this.zoomToIncidents(b))
        },
        _handleBuffers: function(a, b) {
            this.bufferLookUp = [];
            for (var c = 0; c < this.buffers.length; c++) {
                var d = new D(this.buffers[c], a);
                this.lyrBuffer.add(d);
                this.bufferLookUp[c] = d
            }
            b || this._locateBuffer(F.union(this.buffers));
            this._performAnalysis()
        },
        _performAnalysis: function() {
            this._updateCounts(!1);
            this._toggleTabLayersNew(this.curTab)
        },
        _updateCounts: function(a) {
            for (var b = [], c = 0; c < this.config.tabs.length; c++) {
                a && 0 < c && this.panelNodes[c] && (this.panelNodes[c].innerHTML = "");
                var d = this.config.tabs[c],
                    e = this.tabNodes[c],
                    f = null,
                    g = !1;
                d.advStat && d.advStat.stats && ("undefined" !== typeof d.advStat.stats.tabCount ? g = d.advStat.stats.tabCount : d.advStat.stats.count && (g = !0));
                "proximity" === d.type ? f = d.proximityInfo : "closest" === d.type ? f =
                    d.closestInfo : "summary" === d.type ? f = d.summaryInfo : "groupedSummary" === d.type && (f = d.groupedSummaryInfo);
                f && (a ? ("undefined" !== typeof f.incidentCount && (f.incidentCount = 0), f.updateTabCount(0, e, g)) : b.push(f.queryTabCount(this.incidents, this.buffers, e, g)))
            }(new E(b)).then(w.hitch(this, function(a) {
                for (var b = 0, c = 0; c < a.length; c++) {
                    var d = a[c][1];
                    isNaN(d) || (b += d)
                }
                this._updateBtnState(this.downloadAllButon, "btnDisabled", b);
                this.userCanSnapshot && this._updateBtnState(this.createSnapshotButton, "btnDisabled", b)
            }))
        },
        _updateBtnState: function(a, b, c) {
            a && (0 === c ? h.add(a, b) : h.contains(a, b) && h.remove(a, b))
        },
        _verifyRouting: function() {
            if (this.config.enableRouting) {
                this.config.enableRouting = !1;
                var a = this.appConfig.getConfigElementsByName("Directions");
                B.forEach(a, w.hitch(this, function(a) {
                    "Directions" === a.name && (this.dirConfig = a, this.config.enableRouting = !0)
                }))
            }
        },
        _getAttributeTable: function() {
            var a = this.appConfig.getConfigElementsByName("AttributeTable");
            B.forEach(a, w.hitch(this, function(a) {
                "AttributeTable" === a.name && (this.attributeTable =
                    a)
            }))
        },
        zoomToIncidents: function(a) {
            var b, c = !1;
            if (0 < this.incidents.length) {
                var d;
                1 < this.buffers.length ? d = F.union(this.buffers) : 1 === this.buffers.length && (d = this.buffers[0]);
                b = this.incidents;
                var e;
                d && (c = !0, e = new D(d, d.spatialReference), b.push(e));
                this.geomExtent = y.graphicsExtent(this.incidents);
                e && e.destroy && e.destroy()
            }
            "undefined" === typeof a && (this.geomExtent ? this.map.setExtent(this.geomExtent.expand(1.5)) : b && (a = b[0].geometry && "point" === b[0].geometry.type ? b[0].geometry : b[0].geometry.getCentroid(), this.map.centerAndZoom(a,
                this.config.defaultZoomLevel)));
            if (!c) {
                for (a = 0; a < this.incidents.length; a++)
                    if ("polygon" === this.incidents[a].geometry.type) {
                        c = !0;
                        break
                    } this._performAnalysis()
            }
            c && this._performAnalysis()
        },
        zoomToLocation: function(a) {
            var b;
            if (.5 === this.config.defaultZoomLevel) {
                var c;
                if (0 < this.buffers.length) c = F.union(this.buffers)._extent;
                else if (0 < this.incidents.length) {
                    for (var d = [], e = [], f = [], g = 0; g < this.incidents.length; g++) {
                        var h = this.incidents[g];
                        switch (h.geometry.type) {
                            case "point":
                                d.push(h.geometry._extent);
                                break;
                            case "polyline":
                                e.push(h.geometry);
                                break;
                            case "polygon":
                                f.push(h.geometry)
                        }
                    }
                    g = [];
                    0 < d.length && g.push(F.union(d)._extent);
                    0 < e.length && g.push(F.union(e)._extent);
                    0 < f.length && g.push(F.union(f)._extent);
                    1 < g.length ? c = F.union(g)._extent : 1 === g.length && (1 < d.length || 0 < e.length || 0 < f.length) && (c = g[0])
                }
                c && (b = c.expand(.5))
            }
            "undefined" === typeof a && (a = b.getCentroid());
            b && this.map.setExtent(b);
            this.map.centerAt(a)
        },
        routeToIncident: function(a) {
            var b = this.incidents[0].geometry,
                c = b;
            "point" !== b.type && (c = null);
            this.stops = [c, a];
            this.widgetManager.triggerWidgetOpen(this.dirConfig.id).then(w.hitch(this, function(a) {
                if (a && "closed" !== a.state) {
                    var b = a._dijitDirections;
                    b ? this._addStops(b) : a.getDirectionsDijit().then(w.hitch(this, function(a) {
                        this._addStops(a)
                    }))
                }
            }))
        },
        _addStops: function(a) {
            a.clearDirections();
            a.removeStops();
            a.reset();
            a.addStops(this.stops)
        },
        _getTabLayers: function(a) {
            var b = [];
            B.forEach(this.opLayers._layerInfos, w.hitch(this, function(c) {
                if (0 < c.newSubLayers.length) this._recurseOpLayers(c.newSubLayers, b, a);
                else {
                    var d =
                        this.hasLayerTitle ? c.id : c.title;
                    if (Array.isArray(a) ? -1 < a.indexOf(d) : a === d) b.push(c.layerObject), "undefined" === typeof c.layerObject.visible || c.layerObject.visible || (c.layerObject.setVisibility(!0), c.layerObject.setVisibility(!1))
                }
            }));
            return b
        },
        _recurseOpLayers: function(a, b, c) {
            B.forEach(a, w.hitch(this, function(a) {
                if (0 < a.newSubLayers.length) this._recurseOpLayers(a.newSubLayers, b, c);
                else {
                    var d = this.hasLayerTitle ? a.id : a.title;
                    (Array.isArray(c) ? -1 < c.indexOf(d) : c === d) && b.push(a.layerObject)
                }
            }))
        },
        _setupSymbols: function() {
            var a =
                x.fromString(this.config.color),
                b = a.toRgb();
            b.push(.2);
            var c = x.fromString("#000000"),
                a = x.blendColors(a, c, .2).toRgb(),
                c = new J(J.STYLE_SOLID, new x([255, 255, 255, .25]), 1);
            this.symPoint = new P(P.STYLE_CIRCLE, 20, c, new x([a[0], a[1], a[2], .7]));
            this.symLine = new J(J.STYLE_SOLID, new x([a[0], a[1], a[2], .7]), 3);
            this.symPoly = new L(L.STYLE_SOLID, this.symLine, new x([a[0], a[1], a[2], .3]));
            this.symBuffer = new L(L.STYLE_SOLID, c, new x(b));
            this.symSelection = new L(L.STYLE_NULL, new J(J.STYLE_SOLID, new x([0, 255, 255]), 2), new x([0,
                0, 0, 0
            ]))
        },
        onReceiveData: function(a, b, c) {
            null !== c && c.eventType && ("IncidentLocationAdd" === c.eventType ? c.dataValue && null !== c.dataValue && (this._clickTab(0), null === this.symPoint ? this.dataValue = c.dataValue : this._drawIncident(c.dataValue, void 0, void 0, !0)) : "IncidentLocationRemove" === c.eventType ? (a = this.incidents.indexOf(c.removeGraphic), this.incidents.splice(a, 1), this.lyrIncidents.remove(c.removeGraphic), this.bufferLookUp && 0 < this.bufferLookUp.length && (this.lyrBuffer.remove(this.bufferLookUp[a]), this.bufferLookUp.splice(a,
                1)), this.buffers && 0 < this.buffers.length && this.buffers.splice(a, 1), this.incidents && 0 < this.incidents.length ? (this.config.tabs[this.curTab].updateFlag = !0, this._performAnalysis()) : this._clear(!1)) : "WebMapChanged" === c.eventType && this._storeIncidents())
        },
        _storeIncidents: function() {
            if (0 < this.incidents.length) {
                for (var a = [], b = 0; b < this.incidents.length; b++) a.push(z.stringify(this.incidents[b].geometry.toJson()));
                a = {
                    location: z.stringify(a),
                    hasBuffer: 0 < this.lyrBuffer.graphics.length,
                    buffer_dist: this.spinnerValue.get("value"),
                    unit: this.config.distanceUnits,
                    curTab: this.curTab,
                    extent: z.stringify(this.map.extent.toJson())
                };
                a = z.stringify(a);
                window.localStorage.setItem(this.Incident_Local_Storage_Key, a);
                console.log("Incident saved to storage")
            }
        },
        _restoreIncidents: function() {
            var a = window.localStorage.getItem(this.Incident_Local_Storage_Key);
            if (null !== a && "null" !== a) {
                window.localStorage.setItem(this.Incident_Local_Storage_Key, null);
                var b = z.parse(a, !0),
                    c = b.buffer_dist,
                    d = z.parse(b.location);
                this.curTab = b.curTab;
                for (var a = [], e = 0; e <
                    d.length; e++) a.push({
                    geometry: H.fromJson(z.parse(d[e]))
                });
                this.spinnerValue.set("value", c);
                for (c = 0; c < this.config.tabs.length; c++) this.config.tabs[c].restore = !0;
                this._drawIncident(a, !0, !0, !0).then(w.hitch(this, function() {
                    this._clickTab(0, !0);
                    this._toggleTabs(b.curTab);
                    this._toggleTabLayers(b.curTab);
                    this.curTab = b.curTab;
                    this._clickIncidentsButton(-1);
                    this._updateW();
                    var a = H.fromJson(z.parse(b.extent));
                    F.equals(a, this.map.extent) || this.map.setExtent(a, !1)
                }))
            } else h.remove(this.saveOptions, "displayT"),
                h.add(this.saveOptions, "display-off"), h.remove(this.borderCol, "display-on"), h.add(this.borderCol, "display-off"), h.remove(this.clearIncident, "display-on"), h.add(this.clearIncident, "display-off")
        },
        _updateW: function() {
            for (var a = 0, c = 0; c < this.tabNodes.length; c++) a += q.position(this.tabNodes[c]).w;
            a += 10;
            b.set(this.tabsNode, "width", a + "px");
            a > q.position(this.footerNode).w && (b.set(this.footerContentNode, window.isRTL ? "left" : "right", "58px"), b.set(this.panelRight, "display", "block"))
        },
        _mapResize: function() {
            var a =
                b.getComputedStyle(this.map.container);
            if (a) {
                var c = this._getSAPanelHeight(),
                    a = parseFloat(a.bottom.replace("px", ""));
                if ("opened" === this.state || "active" === this.state) {
                    var d = this._getAttributeTableHeight();
                    d > c && (c = d);
                    a <= c && I.publish("changeMapPosition", {
                        bottom: c
                    })
                }
            }
        },
        _onMapPositionChange: function(a) {
            a && (this.left = a.left, this.right = a.right, isFinite(this.left) && "number" === typeof this.left && b.set(this.domNode, window.isRTL ? "right" : "left", parseFloat(this.left) + "px"), isFinite(this.right) && "number" === typeof this.right &&
                b.set(this.domNode, window.isRTL ? "left" : "right", parseFloat(this.right) + "px"));
            this._onPanelScroll()
        },
        _resetMapPosition: function() {
            I.publish("changeMapPosition", {
                bottom: this._getAttributeTableHeight()
            })
        },
        _getSAPanelHeight: function() {
            var a = parseInt(this.position.height.toString().replace("px", ""), 10),
                b = parseInt(this.position.bottom.toString().replace("px", ""), 10);
            return a + b
        },
        _getAttributeTableHeight: function() {
            var c = parseInt(this.position.bottom.toString().replace("px", ""), 10);
            if (this.attributeTable) {
                var d =
                    a.byId(this.attributeTable.id);
                d && (d = b.getComputedStyle(d)) && d.height && (c += parseInt(d.height.toString().replace("px", ""), 10))
            }
            return c
        },
        _resize: function(a) {
            try {
                this._onPanelScroll(this.curTab), this.hideContainer && this._handlePopup(), this._clearMobileSetAsIncidentStyle(), this._resetInfoWindow(), this._initEditInfo(), this._checkHideContainer()
            } catch (qa) {
                console.log(qa)
            }
        },
        _onPanelScroll: function(a) {
            var c, d, e, f;
            a = this.footerContentNode.getBoundingClientRect();
            for (var g = 0; g < this.tabsNode.children.length; g++)
                if (f =
                    this.tabsNode.children[g], f = f.getBoundingClientRect(), f = window.isRTL ? f.right : f.left, 0 <= f) {
                    c = g;
                    e = f;
                    break
                } for (g = 0; g < this.tabsNode.children.length; g++)
                if (f = this.tabsNode.children[g], f = f.getBoundingClientRect(), (window.isRTL ? f.left : f.right) > (window.isRTL ? a.left : a.right)) {
                    d = g;
                    break
                } a = this.footerContentNode;
            d = d <= this.tabsNode.children.length;
            b.set(a, window.isRTL ? "left" : "right", d ? "58px" : "24px");
            b.set(this.panelRight, "display", d ? "block" : "none");
            d = 0;
            "TabTheme" === this.appConfig.theme.name && (d += window.isRTL ?
                this.right : this.left);
            c = 1 <= c || e < d;
            b.set(a, window.isRTL ? "right" : "left", c ? "34px" : "0px");
            b.set(this.panelLeft, "display", c ? "block" : "none");
            b.set(this.panelLeft, "width", c ? "34px" : "0px")
        },
        _scrollToTab: function(a) {
            var b = q.position(this.footerContentNode).w;
            if (q.position(this.tabsNode).w > b) {
                var c = q.getMarginBox(this.tabNodes[a]);
                this.footerContentNode.scrollLeft = c.l - (b - c.w) / 2
            }
            this._onPanelScroll(a)
        },
        _navLeft: function(a) {},
        _navRight: function(a) {},
        _navTabsLeft: function(a) {
            this._navTabs(!1)
        },
        _navTabsRight: function(a) {
            this._navTabs(!0)
        },
        _navTabs: function(a) {
            for (var b = this.footerContentNode.getBoundingClientRect(), c = 0; c < this.tabsNode.children.length; c++) {
                var d = this.tabsNode.children[c].getBoundingClientRect();
                if (a) {
                    if (d.right > b.right) {
                        this._scrollToTab(c);
                        break
                    }
                } else if (0 < d.right) {
                    this._scrollToTab(c);
                    break
                }
            }
        },
        _storeInitalVisibility: function() {
            B.forEach(this.config.tabs, w.hitch(this, function(a) {
                B.forEach(a.tabLayers, w.hitch(this, function(b) {
                    "undefined" !== typeof b.visible && (!b.id || b.id in this.initalLayerVisibility || (this.initalLayerVisibility[b.id] =
                        b.visible), b.setVisibility(!1));
                    a && a.jimuLayerInfo && a.jimuLayerInfo.setTopLayerVisible && (b = a.jimuLayerInfo.isShowInMap(), this.initalLayerVisibility.hasOwnProperty(a.jimuLayerInfo.id) || (this.initalLayerVisibility[a.jimuLayerInfo.id] = b), b && a.jimuLayerInfo.setTopLayerVisible(!1))
                }))
            }))
        },
        _resetInitalVisibility: function() {
            B.forEach(this.config.tabs, w.hitch(this, function(a) {
                B.forEach(a.tabLayers, w.hitch(this, function(b) {
                    "undefined" !== typeof b.visible && b.id && b.id in this.initalLayerVisibility && (b.setVisibility(this.initalLayerVisibility[b.id]),
                        b.hasOwnProperty("visible") && (b.visible = this.initalLayerVisibility[b.id]), b.redraw ? b.redraw() : b.refresh && b.refresh());
                    a && a.jimuLayerInfo && a.jimuLayerInfo.setTopLayerVisible && a.jimuLayerInfo.isShowInMap() !== this.initalLayerVisibility[a.jimuLayerInfo.id] && a.jimuLayerInfo.setTopLayerVisible(this.initalLayerVisibility[a.jimuLayerInfo.id])
                }))
            }));
            this.initalLayerVisibility = []
        },
        _clearGraphics: function() {
            B.forEach(this.config.tabs, w.hitch(this, function(a) {
                if ("summary" === a.type && a.tabLayers && 1 < a.tabLayers.length)
                    for (var b =
                            1; b < a.tabLayers.length; b++) a.tabLayers.pop()
            }))
        },
        _resetInfoWindow: function() {
            this.defaultPointContent && this.pointEditLayer.infoTemplate.setContent(this.defaultPointContent);
            this.defaultLineContent && this.lineEditLayer.infoTemplate.setContent(this.defaultLineContent);
            this.defaultPolyContent && this.polyEditLayer.infoTemplate.setContent(this.defaultPolyContent);
            this.defaultPopupSize && this.map.infoWindow.resize(this.defaultPopupSize.width, "auto");
            this.map.infoWindow.isShowing && this.map.infoWindow.hide()
        },
        _close: function() {
            this.widgetManager.closeWidget(this.id)
        },
        _downloadAll: function() {
            for (var a = this.downloadAllButon.classList ? this.downloadAllButon.classList : this.downloadAllButon.className.split(" "), b = !0, c = 0; c < a.length; c++)
                if ("btnDisabled" === a[c]) {
                    b = !1;
                    break
                } b && (this._updateProcessing(this.downloadAllButon, !0, this.downloadAllSrc), this._verifyIncident(!1) && (a = this._getAnalysisObjects(), (new aa(this)).createDownloadZip(a, this.incidents, this.buffers).then(w.hitch(this, function(a) {
                this._updateProcessing(this.downloadAllButon,
                    !1, this.downloadAllSrc)
            }), function(a) {
                this._updateProcessing(this.downloadAllButon, !1, this.downloadAllSrc);
                new m({
                    message: a.message
                })
            })))
        },
        _updateProcessing: function(a, b, d) {
            c.setAttr(a, "src", b ? this.processingSrc : d)
        },
        _getAnalysisObjects: function() {
            var a = ["proximity", "closest", "summary", "groupedSummary"],
                b = [];
            B.forEach(this.config.tabs, function(c) {
                if (-1 < a.indexOf(c.type)) {
                    var d;
                    switch (c.type) {
                        case "proximity":
                            d = c.proximityInfo;
                            break;
                        case "closest":
                            d = c.closestInfo;
                            break;
                        case "summary":
                            d = c.summaryInfo;
                            break;
                        case "groupedSummary":
                            d = c.groupedSummaryInfo
                    }
                    var e = "undefined" !== typeof c.layerTitle ? c.layerTitle : c.layers;
                    b.push({
                        layerObject: c.tabLayers[0],
                        label: "" !== c.label ? c.label : e,
                        analysisObject: d,
                        type: c.type
                    })
                }
            });
            return b.reverse()
        },
        _verifyIncident: function(a, b) {
            if (0 === this.buffers.length) {
                for (var c = !1, d = 0; d < this.incidents.length; d++)
                    if ("polygon" === this.incidents[d].geometry.type) {
                        c = !0;
                        break
                    } c || (c = 0 < this.config.tabs.filter(function(a) {
                    return "closest" === a.type
                }).length && 0 < parseInt(this.config.maxDistance,
                    10));
                c || (new m({
                    message: a ? this.nls.notPolySnapShot : b ? this.nls.notPolyReport : this.nls.notValidDownload
                }), this._updateProcessing(a ? this.createSnapshotButton : b ? this.createReportButton : this.downloadAllButon, !1, a ? this.snapshotSrc : b ? this.reportSrc : this.downloadAllSrc));
                return c
            }
            return !0
        },
        _createSnapshot: function() {
            for (var a = this.createSnapshotButton.classList ? this.createSnapshotButton.classList : this.createSnapshotButton.className.split(" "), b = !0, c = 0; c < a.length; c++)
                if ("btnDisabled" === a[c]) {
                    b = !1;
                    break
                } b &&
                this._verifyIncident(!0) && this._getName("snapshot").then(w.hitch(this, function(a) {
                    if (a && "cancel" !== a) {
                        this._updateProcessing(this.createSnapshotButton, !0, this.snapshotSrc);
                        var b = [];
                        0 < this.buffers.length && b.push({
                            graphics: this.lyrBuffer.graphics,
                            label: 1 < this.buffers.length ? this.nls.buffers : this.nls.buffer
                        });
                        b.push({
                            graphics: this.incidents,
                            label: 1 < this.incidents.length ? this.nls.incidents : this.nls.incident
                        });
                        (new aa(this)).createSnapShot({
                            layers: b.concat(this._getAnalysisObjects()),
                            incidents: this.incidents,
                            buffers: this.buffers,
                            time: Date.now(),
                            name: a.name,
                            groups: a.groups
                        }).then(w.hitch(this, function(a) {
                            this._updateProcessing(this.createSnapshotButton, !1, this.snapshotSrc)
                        }), w.hitch(this, function(a) {
                            this._updateProcessing(this.createSnapshotButton, !1, this.snapshotSrc);
                            new m({
                                message: a.message
                            })
                        }))
                    } else this._updateProcessing(this.createSnapshotButton, !1, this.snapshotSrc)
                }))
        },
        _initReportDijit: function(a) {
            var b = "";
            a.logo && (b = a.logo, b = -1 < b.indexOf("${appPath}") ? N.substitute(b, {
                appPath: this.folderUrl.slice(0,
                    this.folderUrl.lastIndexOf("widgets"))
            }) : b);
            this.reportDijit = new k({
                alignNumbersToRight: window.isRTL,
                reportLogo: b,
                appConfig: this.appConfig,
                footNotes: a.footnote,
                printTaskUrl: a.printTaskURL,
                reportLayout: a.reportLayout,
                styleSheets: [this.folderUrl + "/css/reportDijitOverrides.css"],
                styleText: ".esriCTTable th{background-color: " + a.textColor + "; color: " + this.getTextColor(a.textColor) + ";} .esriCTSectionTitle{color: black;} .esriCTHTMLData{height:100%;}",
                maxNoOfCols: 7
            });
            this.own(f(this.reportDijit, "reportError",
                w.hitch(this, function() {
                    new m({
                        message: window.jimuNls.common.error
                    })
                })))
        },
        getTextColor: function(a) {
            a = (new K(a)).toRgb();
            return .5 > 1 - (.299 * a[0] + .587 * a[1] + .114 * a[2]) / 255 ? "#000" : "#fff"
        },
        _getName: function(a) {
            var b = new S,
                c = new oa({
                    nls: this.nls,
                    type: a,
                    pageUtils: t,
                    storedProps: this._getStoredPropData("SA-REPORT-PROPS"),
                    portalUrl: this.appConfig.portalUrl
                }),
                d = new ia({
                    autoHeight: !0,
                    content: c,
                    titleLabel: "report" === a ? this.nls.report_name : this.nls.snapshot_name,
                    invalidMessage: "report" === a ? this.nls.invalid_report_name : this.nls.invalid_snapshot_name
                });
            c.initWidth();
            this.own(f(c, "ok", w.hitch(this, function(a) {
                c.destroy();
                c = null;
                d.close();
                this._storePropData("SA-REPORT-PROPS", a);
                b.resolve(a)
            })));
            this.own(f(c, "cancel", w.hitch(this, function() {
                c.destroy();
                c = null;
                d.close();
                b.resolve("cancel")
            })));
            return b
        },
        _storePropData: function(a, b) {
            window.localStorage.setItem(a, z.stringify(b))
        },
        _getStoredPropData: function(a) {
            return window.localStorage.getItem(a)
        },
        _createReport: function() {
            this.reportEnabled && this._verifyIncident(!1,
                !0) && (this._updateProcessing(this.createReportButton, !0, this.reportSrc), this._getReportData().then(w.hitch(this, function(a) {
                this._updateProcessing(this.createReportButton, !1, this.reportSrc);
                this._getName("report").then(w.hitch(this, function(b) {
                    if (b && "cancel" !== b) {
                        this._updateProcessing(this.createReportButton, !0, this.reportSrc);
                        this._initReportDijit(w.mixin(this.config.reportSettings, b));
                        for (var c, d = 0; d < a.length; d++) {
                            var e = a[d];
                            if ("map" === e.type) {
                                c = d;
                                e.printTemplate = this._getPrintTemplate();
                                break
                            }
                        }
                        b.comments &&
                            "" !== b.comments && a.splice(c + 1, 0, {
                                type: "html",
                                data: "\x3cp style\x3d'white-space: pre-wrap;'\x3e" + b.comments + "\x3c/p\x3e"
                            });
                        this.reportDijit.maxNoOfCols = "Landscape" === b.reportLayout.orientation.Type ? 12 : 7;
                        this.reportDijit.print(b.name, a)
                    }
                    this._updateProcessing(this.createReportButton, !1, this.reportSrc)
                }))
            })))
        },
        _getReportData: function(a) {
            var b = new S,
                c = [];
            c.push({
                addPageBreak: !0,
                type: "map",
                map: this.map
            });
            a = this._getAnalysisObjects().reverse();
            var d = this.nls;
            (new aa(this))._performAnalysis(a, this.incidents,
                this.buffers, !1, !0).then(function(a) {
                B.forEach(a, w.hitch(this, function(a) {
                    if (a) {
                        for (var b = a.context.tab.type, e = "summary" === b ? d.summary : "closest" === b ? d.closest : "proximity" === b ? d.proximity : d.groupedSummary, f = [], g = [], h = [], k = "proximity" === b ? a.reportResults : a.analysisResults, l = 0; l < k.length; l++) {
                            var m = k[l];
                            if ("summary" !== b && "groupedSummary" !== b) h = [], 0 === l && B.forEach(m, function(a) {
                                f.push(a.label)
                            }), B.forEach(m, function(a) {
                                h.push(a.value)
                            }), g.push(h);
                            else if ("summary" === b) {
                                var n = [];
                                B.forEach(a.context.calcFields,
                                    function(a) {
                                        n.push(a.alias ? a.alias : a.field)
                                    });
                                0 < n.length && -1 < n.indexOf(m.info.replace("\x3cbr/\x3e", "")) && (f.push(m.info.replace("\x3cbr/\x3e", "")), h.push(m.num))
                            } else f.push(-1 === ["", null, void 0].indexOf(m.a) ? m.a + " " + m.info : m.info), h.push(m.total)
                        }
                        "summary" !== b && "groupedSummary" !== b || g.push(h);
                        c.push({
                            title: a.context.baseLabel + " (" + e + ")",
                            addPageBreak: !1,
                            type: "table",
                            data: {
                                cols: f,
                                rows: g
                            }
                        });
                        var q = {},
                            f = [],
                            g = [],
                            h = [],
                            b = da.getPopupFields(a.context.tab);
                        if (0 < b.length) {
                            B.forEach(b, function(a) {
                                q[a.expression] =
                                    a.label
                            });
                            for (b = 0; b < a.graphics.length; b++) {
                                var h = [],
                                    r = a.graphics[b].attributes,
                                    e = Object.keys(r);
                                0 === b && B.forEach(e, function(a) {
                                    q.hasOwnProperty(a) && f.push(q[a])
                                });
                                B.forEach(e, function(b) {
                                    q.hasOwnProperty(b) && h.push(da.getFieldValue(b, r[b], a.context.specialFields, a.context.dateFields, a.context.defaultDateFormat, a.context.typeIdField, a.context.types, a.context.layerObject && a.context.layerObject.renderer ? a.context.layerObject : a.context.layerDefinition, r))
                                });
                                g.push(h)
                            }
                            c.push({
                                title: a.context.baseLabel,
                                addPageBreak: !1,
                                type: "table",
                                data: {
                                    cols: f,
                                    rows: g
                                }
                            })
                        }
                    }
                }));
                b.resolve(c)
            }, function(a) {
                this._updateProcessing(this.createReportButton, !1, this.reportSrc);
                new m({
                    message: a.message
                })
            });
            return b
        },
        _getPrintTemplate: function() {
            var a, b = [];
            a = new fa;
            this.reportDijit._printService.legendAll = !0;
            this.reportDijit._printService._getPrintDefinition(this.map, a);
            B.forEach(this.reportDijit._printService.allLayerslegend, w.hitch(this, function(a) {
                var c;
                a.id !== this.lyrIncidents.id && a.id !== this.lyrBuffer.id && (c = new ga, c.layerId =
                    a.id, a.subLayerIds && (c.subLayerIds = a.subLayerIds), b.push(c))
            }));
            this.reportDijit._printService.legendAll = !1;
            a.layoutOptions = {
                legendLayers: b,
                customTextElements: [{
                    Date: (new Date).toLocaleString()
                }]
            };
            a = this.reportDijit.setMapLayout(a);
            a.preserveScale = !1;
            a.showAttribution = !0;
            a.format = "jpg";
            return a
        }
    })
});