// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
require({cache:{"url:widgets/Infographic/setting/dijitsSetting/GaugeDijitSetting.html":'\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"settingTitle" class\x3d"flex-lc text-label setting-title"\x3e${nls.gaugeSettings}\x3c/div\x3e\r\n  \x3cdiv class\x3d"infohraphic-setting-tab-container" style\x3d"width:100%;"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"tabNode" class\x3d"infohraphic-setting-tab-container"\x3e\x3c/div\x3e\r\n    \x3c!-- data tab --\x3e\r\n    \x3cdiv style\x3d"margin-top: 10px;" class\x3d"setting-tab" data-dojo-attach-point\x3d"dataTab"\x3e\r\n      \x3cdiv class\x3d"value-container" data-dojo-attach-point\x3d"valueContainer"\x3e\x3c/div\x3e\r\n      \x3cdiv class\x3d"min-container" data-dojo-attach-point\x3d"minContainer"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"maxContainer"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3c!-- display tab --\x3e\r\n    \x3cdiv style\x3d"margin-top: 20px;" data-dojo-attach-point\x3d"display" class\x3d"display-container paddingRight10"\x3e\r\n\r\n      \x3cdiv class\x3d"flex flex-leave1 align-items-center"\x3e\r\n        \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.backgroundColor}"\x3e${nls.backgroundColor}\x3c/div\x3e\r\n         \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n           \x3cdiv data-dojo-attach-point\x3d"backgroundColorPickerDiv"\x3e\x3c/div\x3e\r\n         \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n        \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.gaugeColor}"\x3e${nls.gaugeColor}\x3c/div\x3e\r\n         \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n         \x3c/div\x3e\r\n      \x3c/div\x3e\r\n\r\n      \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n        \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.gaugeColor}"\x3e${nls.front}\x3c/div\x3e\r\n         \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n           \x3cdiv data-dojo-attach-point\x3d"frontColorPickerDiv"\x3e\x3c/div\x3e\r\n         \x3c/div\x3e\r\n      \x3c/div\x3e\r\n\r\n      \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n        \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.gaugeColor}"\x3e${nls.back}\x3c/div\x3e\r\n         \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n           \x3cdiv data-dojo-attach-point\x3d"backColorPickerDiv"\x3e\x3c/div\x3e\r\n         \x3c/div\x3e\r\n      \x3c/div\x3e\r\n\r\n\r\n      \x3cdiv data-dojo-attach-point\x3d"dataLabelsToggle" class\x3d"margin-top-11"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"dataLabelsSettingNode" class\x3d"top-bottom-setting-div"\x3e\r\n\r\n        \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n          \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.textColor}"\x3e${nls.textColor}\x3c/div\x3e\r\n           \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n             \x3cdiv data-dojo-attach-point\x3d"dataLabelsColorPickerNode"\x3e\x3c/div\x3e\r\n           \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \r\n        \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n          \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.dataRange}"\x3e${nls.dataRange}\x3c/div\x3e\r\n           \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n             \x3cdiv data-dojo-attach-point\x3d"dataRangeSwitch" class\x3d"toggle toggle-on"\x3e\x3c/div\x3e\r\n           \x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \r\n        \x3cdiv class\x3d"flex flex-leave1 margin-top-11 align-items-center"\x3e\r\n          \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.targetValue}"\x3e\x3cdiv\x3e${nls.targetValue}\x3c/div\x3e\x3c/div\x3e\r\n           \x3cdiv class\x3d"flex flex-leave2-right"\x3e\r\n             \x3cdiv data-dojo-attach-point\x3d"targetValueSwitch" class\x3d"toggle toggle-off"\x3e\x3c/div\x3e\r\n           \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n      \x3c/div\x3e\r\n\r\n      \x3cdiv data-dojo-attach-point\x3d"currentValueToggle"\x3e\x3c/div\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"currentValueSettingNode"\x3e\r\n        \x3c!-- display in --\x3e\r\n        \x3cdiv style\x3d"margin-top: 15px" class\x3d"flex flex-leave1"\x3e\r\n          \x3cdiv class\x3d"flex-leave2-left textOverFlow font-style" title\x3d"${nls.displayValueIn}"\x3e${nls.displayValueIn}\x3c/div\x3e\r\n           \x3cdiv class\x3d"flex-start flex-leave2-right"\x3e\r\n              \x3cinput type\x3d"radio" name\x3d"displayIn" data-dojo-attach-event\x3d"change:_onDiaplayInRatio" data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"ratioBtn"\x3e\r\n              \x3clabel class\x3d"marginleft10"\x3e${nls.ratio}\x3c/label\x3e\r\n           \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n        \x3cdiv class\x3d"flex flex-leave1 margin-top-11"\x3e\r\n          \x3cdiv class\x3d"flex-leave2-left font-style"\x3e\x3c/div\x3e\r\n           \x3cdiv class\x3d"flex-start flex-leave2-right"\x3e\r\n              \x3cinput type\x3d"radio" checked\x3d"true" name\x3d"displayIn" data-dojo-attach-event\x3d"change:_onDisplayInTrueValue" data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"trueValueBtn"\x3e\r\n              \x3clabel class\x3d"marginleft10"\x3e${nls.trueValue}\x3c/label\x3e\r\n           \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n        \x3cdiv data-dojo-attach-point\x3d"dataFormatSettingNode" class\x3d"margin-top-11"\x3e\x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"fontSettingNode"\x3e\x3c/div\x3e\r\n\r\n      \x3c/div\x3e\r\n\r\n    \x3c/div\x3e\r\n    \x3c!-- indicators tab --\x3e\r\n  \t\x3cdiv style\x3d"margin-top: 20px;" class\x3d"indicatorsTitlePane paddingRight10" data-dojo-attach-point\x3d"indicatorsDiv"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("dojo/_base/declare dijit/_WidgetsInTemplateMixin dojo/_base/lang dojo/_base/html dojo/_base/Color dojo/on ./BaseDijitSetting dojo/text!./GaugeDijitSetting.html ./_dijits/FontSetting ./_dijits/DataFormatSetting ./_dijits/NumberIndicator/MultipleIndicators ./_dijits/ValueProvider/RangeProvider ./_dijits/ValueProvider/ValueProvider ./_dijits/TogglePocket jimu/dijit/TabContainer3 jimu/dijit/ColorPickerPopup jimu/utils jimu/dijit/Message ../utils dijit/TitlePane".split(" "),function(m,n,d,f,g,
e,p,q,r,t,u,k,v,l,w,x,y,z,h){return m([p,n],{templateString:q,baseClass:"infographic-gauge-dijit-setting",type:"gauge",postMixInProperties:function(){d.mixin(this.nls,window.jimuNls.common)},postCreate:function(){this.inherited(arguments);this._ignoreEvent();this.shape=this.config&&this.config.shape;this._init();this._careEvent()},setDataSource:function(a){this.dataSource=a},setLayerDefinition:function(a,b,c){a&&(this.definition=a=h.preProcessDefinition(a));this.mainValue&&this.mainValue.setLayerDefinition(this.definition);
this.range1&&b&&(b=h.preProcessDefinition(b),this.range1.setLayerDefinition(b));this.range2&&c&&(c=h.preProcessDefinition(c),this.range2.setLayerDefinition(c))},setLayerObject:function(a){a&&(this.layerObject=a)},reset:function(){this.config=this.rangeDefinition2=this.rangeDefinition1=this.definition=this.dataSource=null;this.mainValue&&this.mainValue.reset();this.range1&&this.range1.reset();this.range2&&this.range2.reset()},_getStatistics:function(){if(this.mainValue&&this.range1&&this.range2){var a=
this.mainValue.getConfig(),b=this.range1.getConfig(),c=this.range2.getConfig();return[{type:"value",config:a},{type:"range",name:"range1",config:b},{type:"range",name:"range2",config:c}]}},_ignoreEvent:function(){this._ignoreEvents=!0},_careEvent:function(){setTimeout(function(){this._ignoreEvents=!1}.bind(this),200)},getConfig:function(a){if(!this.isValid(a))return!1;a={shape:this.shape};var b=this._getStatistics();a.statistics=b;b=this.indicators.getConfig();a.indicators=b;b={};this.backgroundColorPicker&&
(b.backgroundColor=this.backgroundColorPicker.getColor().toHex());this.frontColorPicker&&(b.gaugeColor=this.frontColorPicker.getColor().toHex());this.backColorPicker&&(b.bgColor=this.backColorPicker.getColor().toHex());var c={};c.state=this.dataLabelsTogglePocket.getState();this.dataLabelsColorPicker&&(c.textColor=this.dataLabelsColorPicker.getColor().toHex());c.dataRange=f.hasClass(this.dataRangeSwitch,"toggle-on");c.targetValue=f.hasClass(this.targetValueSwitch,"toggle-on");b.dataLabels=c;c={};
c.state=this.currentValueTogglePocket.getState();c.isRatio=!!this.ratioBtn.checked;this.fontSetting&&(c.font=this.fontSetting.getConfig());this.dataFormatSetting&&(c.dataFormat=this.dataFormatSetting.getConfig());b.currentValue=c;a.display=b;return this.config=a},_setStatistics:function(a){a&&a.length&&a.forEach(function(a){"value"===a.type?this.mainValue&&this.mainValue.setConfig(a.config):"range1"===a.name?this.range1&&this.range1.setConfig(a.config):"range2"===a.name&&this.range2&&this.range2.setConfig(a.config)}.bind(this))},
setConfig:function(a){this._ignoreEvent();if(this.config=a)if(this._setStatistics(a.statistics),this.indicators.setConfig(this.config),a=this.config.display){a.backgroundColor&&this.backgroundColorPicker.setColor(new g(a.backgroundColor));a.gaugeColor&&this.frontColorPicker.setColor(new g(a.gaugeColor));a.bgColor&&this.backColorPicker.setColor(new g(a.bgColor));var b=a.dataLabels;b&&(b.textColor&&this.dataLabelsColorPicker.setColor(new g(b.textColor)),this._handleToggleBtn(this.dataRangeSwitch,!!b.dataRange),
this._handleToggleBtn(this.targetValueSwitch,!!b.targetValue),this.dataLabelsTogglePocket.setState(b.state));if(a=a.currentValue)b=a.isRatio,this.ratioBtn.setChecked(b),this.trueValueBtn.setChecked(!b),a.dataFormat&&this.dataFormatSetting.setConfig(a.dataFormat),a.font&&this.fontSetting.setConfig(a.font),this.currentValueTogglePocket.setState(a.state);this._careEvent()}},_onSettingsChange:function(){!this._ignoreEvents&&this.domNode&&(this.getConfig(),this.updateDijit())},_setRangeFeaturesToDijit:function(a,
b){this.dijit&&(this.dijit.setRangeFeatures(a,b),this.dijit.startRendering())},updateDijit:function(){y.isEqual(this.cacheConfig,this.config)||(this.dijit.setConfig(this.config),this.dijit.startRendering());this.cacheConfig=null;this.cacheConfig=d.clone(this.config)},destroy:function(){this.indicators&&(this.indicators.destroy(),this.indicators=null);this.inherited(arguments)},isValid:function(a){return!this.indicators.getConfig(a)&&a?(this.tab.selectTab(this.nls.indicators),new z({message:this.nls.setCorrectyIndicatorTip}),
!1):this.mainValue.isValid()&&this.range1.isValid()&&this.range2.isValid()&&this.fontSetting.isValid()&&this.dataFormatSetting.isValid()?!0:!1},_init:function(){this._initTabs();this._initValueProvider();this._initDisplay();this._initIndicators();this._initEvent()},_initTabs:function(){this.tab=new w({average:!0,tabs:[{title:this.nls.data,content:this.dataTab},{title:this.nls.display,content:this.display},{title:this.nls.indicators,content:this.indicatorsDiv}]},this.tabNode)},_initValueProvider:function(){this.mainValue=
new v({nls:this.nls,titleText:this.nls.displayValue});this.mainValue.placeAt(this.valueContainer);this.own(e(this.mainValue,"change",d.hitch(this,function(a){this._handleDePlacesForMainValue(a);this._onSettingsChange()})));this.range1=new k({nls:this.nls,appConfig:this.appConfig,titleText:this.nls.min});this.range1.placeAt(this.minContainer);this.own(e(this.range1,"change",d.hitch(this,function(){this._onSettingsChange()})));this.own(e(this.range1,"ds-change",d.hitch(this,function(a){this._onRangeDataSourceChanged(a,
"range1")})));this.range2=new k({nls:this.nls,appConfig:this.appConfig,titleText:this.nls.max});this.range2.placeAt(this.maxContainer);this.own(e(this.range2,"change",d.hitch(this,function(){this._onSettingsChange()})));this.own(e(this.range2,"ds-change",d.hitch(this,function(a){this._onRangeDataSourceChanged(a,"range2")})))},_onRangeDataSourceChanged:function(a,b){this.igUtils&&this.igUtils.getFeaturesForFrameDS(a).then(function(a){this._setRangeFeaturesToDijit(a.features,b)}.bind(this))},_handleDePlacesForMainValue:function(a){if(a=
a&&a.value){var b=this.dataFormatSetting.getConfig(),c=b.decimalPlaces;if("count"===a.type){if("number"!==typeof c||2===c)b.decimalPlaces=0}else if("number"!==typeof c||0===c)b.decimalPlaces=2;this.dataFormatSetting.setConfig(b)}},_initToggle:function(){this.dataLabelsTogglePocket=new l({titleLabel:this.nls.dataLabels,content:this.dataLabelsSettingNode});this.dataLabelsTogglePocket.placeAt(this.dataLabelsToggle);this.dataLabelsTogglePocket.startup();this.dataLabelsTogglePocket.setState(!0);this.own(e(this.dataLabelsTogglePocket,
"change",d.hitch(this,function(){this._onSettingsChange()})));this.currentValueTogglePocket=new l({titleLabel:this.nls.currentValue,content:this.currentValueSettingNode});this.currentValueTogglePocket.placeAt(this.currentValueToggle);this.currentValueTogglePocket.startup();this.currentValueTogglePocket.setState(!0);this.own(e(this.currentValueTogglePocket,"change",d.hitch(this,function(){this._onSettingsChange()})))},_initDisplay:function(){this._initToggle();this.backgroundColorPicker=this._createColorPicker(this.backgroundColorPickerDiv,
"#FFFFFF");this.own(e(this.backgroundColorPicker,"change",d.hitch(this,function(){this.backgroundColorPicker.hideTooltipDialog();this._onSettingsChange()})));this.frontColorPicker=this._createColorPicker(this.frontColorPickerDiv,"#49B4CB");this.own(e(this.frontColorPicker,"change",d.hitch(this,function(){this.frontColorPicker.hideTooltipDialog();this._onSettingsChange()})));this.backColorPicker=this._createColorPicker(this.backColorPickerDiv,this.config&&this.config.display&&this.config.display.bgColor||
"#E5E5E5");this.own(e(this.backColorPicker,"change",d.hitch(this,function(){this.backColorPicker.hideTooltipDialog();this._onSettingsChange()})));this.dataLabelsColorPicker=this._createColorPicker(this.dataLabelsColorPickerNode,"#000001");this.own(e(this.dataLabelsColorPicker,"change",d.hitch(this,function(){this._onSettingsChange()})));this.dataFormatSetting=new t({nls:this.nls});this.dataFormatSetting.placeAt(this.dataFormatSettingNode);this.dataFormatSetting.startup();this.own(e(this.dataFormatSetting,
"change",d.hitch(this,function(){this._onSettingsChange()})));this.fontSetting=new r({appearance:{underline:!1},nls:this.nls});this.fontSetting.placeAt(this.fontSettingNode);this.fontSetting.startup();this.own(e(this.fontSetting,"change",d.hitch(this,function(){this._onSettingsChange()})))},_createColorPicker:function(a,b){var c=new x({appearance:{showTransparent:!1,showColorPalette:!0,showCoustom:!0,showCoustomRecord:!0}});c.placeAt(a);c.startup();c.setColor(new g(b));return c},_initIndicators:function(){this.indicators=
new u({type:"gauge",nls:this.nls,folderUrl:this.folderUrl});this.indicators.placeAt(this.indicatorsDiv);this.indicators.startup();this.own(e(this.indicators,"change",d.hitch(this,function(){this._onSettingsChange()})))},_initEvent:function(){this.own(e(this.dataRangeSwitch,"click",d.hitch(this,function(){this._handleToggleBtn(this.dataRangeSwitch,!f.hasClass(this.dataRangeSwitch,"toggle-on"))})));this.own(e(this.targetValueSwitch,"click",d.hitch(this,function(){this._handleToggleBtn(this.targetValueSwitch,
!f.hasClass(this.targetValueSwitch,"toggle-on"))})))},_handleToggleBtn:function(a,b){b?(f.removeClass(a,"toggle-off"),f.addClass(a,"toggle-on")):(f.removeClass(a,"toggle-on"),f.addClass(a,"toggle-off"));this._onSettingsChange()},_onDisplayInChange:function(a){"ratio"===a?(this.dataFormatSetting.setConfig({unit:"percentage"}),this.dataFormatSetting.disableItem("unit")):(this.dataFormatSetting.setConfig({unit:"none"}),this.dataFormatSetting.enableItem("unit"));this._onSettingsChange()},_onDiaplayInRatio:function(a){a&&
this._onDisplayInChange("ratio")},_onDisplayInTrueValue:function(a){a&&this._onDisplayInChange("trueValue")}})});