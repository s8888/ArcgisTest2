// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define(["dojo/_base/declare","dojo/_base/lang","dojo/topic","./Feedback"],function(d,b,c,e){return d([e],{constructor:function(){this.syncEvents();this.inherited(arguments)},syncEvents:function(){c.subscribe("visibility-observer-point-input",b.hitch(this,this.onCenterPointManualInputHandler));c.subscribe("clear-points",b.hitch(this,this.clearPoints))},clearPoints:function(){this._points=[];this.map.graphics.clear()},clearGraphics:function(){this.map.graphics.clear()},onCenterPointManualInputHandler:function(a){this._points=
[];this._points.push(a.offset(0,0));this.set("startPoint",this._points[0]);this.map.centerAt(a)},_onClickHandler:function(a){var b;this.map.snappingManager&&(b=this.map.snappingManager._snappingPoint);a=b||a.mapPoint;this._points.push(a.offset(0,0));this.set("startPoint",this._points[0]);this._drawEnd(a)},cleanup:function(){}})});