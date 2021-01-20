// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"url:jimu/dijit/templates/_FilterSet.html":'\x3cdiv\x3e\r\n\t\x3ctable class\x3d"header-table" cellspacing\x3d"0" cellpadding\x3d"0"\x3e\r\n\t\t\x3ctbody\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd\x3e\r\n\t\t\t\t\t\x3cdiv\x3e\r\n\t\t\t\t\t\t\x3cselect data-dojo-attach-point\x3d"allAnySelect"\x3e\r\n\t\t\t\t\t\t\t\x3coption value\x3d"AND" selected\x3e${nls.matchMsgSetAll}\x3c/option\x3e\r\n\t\t\t\t\t\t\t\x3coption value\x3d"OR"\x3e${nls.matchMsgSetAny}\x3c/option\x3e\r\n\t\t\t\t\t\t\x3c/select\x3e\r\n\t\t\t\t\t\x3c/div\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3ctd class\x3d"jimu-filter-set-delete"\x3e\r\n\t\t\t\t\t\x3cdiv data-dojo-attach-point\x3d"btnDelete" data-dojo-attach-event\x3d"onclick:_destroySelf"\r\n\t\t\t\t\t class\x3d"jimu-icon jimu-icon-delete"\x3e\x3c/div\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\t\x3ctd class\x3d"jimu-filter-set-add"\x3e\r\n\t\t\t\t\t\x3cdiv data-dojo-attach-point\x3d"btnAdd" class\x3d"jimu-icon jimu-icon-add"\x3e\x3c/div\x3e\r\n\t\t\t\t\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"allExpsBox" class\x3d"jimu-filter-exps-box"\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e'}});
define("dojo/Evented dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!./templates/_FilterSet.html dijit/registry dojo/_base/lang dojo/_base/html dojo/_base/array dojo/on dojo/aspect dojo/query ./_SingleFilter".split(" "),function(h,k,l,m,n,p,e,b,c,d,f,q,g,r){return k([l,m,n,h],{templateString:p,baseClass:"jimu-filter-set",nls:null,url:null,layerInfo:null,popupFieldsInfo:[],stringFieldType:"",dateFieldType:"",numberFieldTypes:[],partsObj:null,OPERATORS:null,
enableAskForValues:!1,isHosted:!1,valueProviderFactory:null,runtime:!1,postMixInProperties:function(){this.nls=window.jimuNls.filterBuilder;this.inherited(arguments)},postCreate:function(){this.inherited(arguments);this._initSelf()},toJson:function(){var a=g(".jimu-single-filter",this.allExpsBox),a=d.map(a,b.hitch(this,function(a){return e.byNode(a).toJson()}));return d.every(a,b.hitch(this,function(a){return!!a}))&&0<a.length?{logicalOperator:this.allAnySelect.value,parts:a}:null},showDelteIcon:function(){c.setStyle(this.btnDelete,
"display","block")},hideDeleteIcon:function(){c.setStyle(this.btnDelete,"display","none")},_initSelf:function(){this.own(f(this.btnAdd,"click",b.hitch(this,function(){this._addSingleFilter();this.emit("change")})));if(this.partsObj){this.allAnySelect.value=this.partsObj.logicalOperator;var a=this.partsObj.parts||[];0===a.length?(this._addSingleFilter(),this._addSingleFilter()):1===a.length?(this._addSingleFilter(a[0]),this._addSingleFilter()):d.forEach(a,b.hitch(this,function(a){this._addSingleFilter(a)}))}else this._addSingleFilter(),
this._addSingleFilter()},_addSingleFilter:function(a){a=new r({url:this.url,layerInfo:this.layerInfo,popupFieldsInfo:this.popupFieldsInfo,stringFieldType:this.stringFieldType,dateFieldType:this.dateFieldType,numberFieldTypes:this.numberFieldTypes,part:a,OPERATORS:this.OPERATORS,enableAskForValues:this.enableAskForValues,isHosted:this.isHosted,valueProviderFactory:this.valueProviderFactory,isInFilterSet:!0,runtime:this.runtime});a.placeAt(this.allExpsBox);a.startup();this.own(q.after(a,"_destroySelf",
b.hitch(this,this._checkFilterNumbers)));this.own(f(a,"change",b.hitch(this,function(){this.emit("change")})));this._checkFilterNumbers();return a},_checkFilterNumbers:function(){var a=g(".jimu-single-filter",this.allExpsBox),c=2<a.length;d.forEach(a,b.hitch(this,function(a){a=e.byNode(a);c?a.showDelteIcon():a.hideDeleteIcon()}))},_destroySelf:function(){this.destroy()}})});