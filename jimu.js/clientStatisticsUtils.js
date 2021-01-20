// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define(["dojo/_base/lang","moment/moment","./_chartHelpUtils","jimu/utils"],function(m,l,q,k){window.makeTwix&&window.makeTwix(l);return{getClietStatisticsData:function(a){var b=a.mode;if("feature"===b)return this.getFeatureModeStatisticsData(a);if("category"===b)return this.getCategoryModeStatisticsData(a);if("count"===b)return this.getCountModeStatisticsData(a);if("field"===b)return this.getFieldModeStatisticsData(a)},sortClientStatisticsData:function(a,b){return this.sortStatisticsData(a,b.mode,
b.sortOrder,b.clusterField,b.valueFields)},getDataForMaxLabels:function(a,b){return a&&a.length&&"number"===typeof b&&0<b&&b<a.length?a.slice(0,b):a},getFeatureModeStatisticsData:function(a){var b=a.features,d=a.clusterField,c=a.valueFields;a=void 0!==a.showNullLabelData?a.showNullLabelData:!0;var e=this.separateFeaturesWhetherFieldValueNull(d,b),b=e.notNullLabelFeatures,e=e.nullLabelFeatures,b=a?b.concat(e):b;a=[];return a=b.map(function(a){var b=a.attributes,f=b&&b[d],f=this.convertingNullOrUndefinedAsPlaceholders(f);
a={label:f,values:[],features:[a]};a.values=c.map(function(a){return b[a]});return a}.bind(this))},getCategoryModeStatisticsData:function(a){function b(a){var b=[],h=null,g;for(g in a){h=a[g];g=this.keepFieldValueType(g,h.type,f);var n=this.calcValuesByFeaturesForCatetoryMode(c,h,d,e,t);b.push({label:g,values:n,features:h.features,unit:h.unit})}return b}var d=a.hasStatisticsed,c=a.valueFields,e=a.operation,f=a.dateConfig,g=void 0!==a.showNullLabelData?a.showNullLabelData:!0,t=a.nullValue,h=[],h=this.getCluseringObj(a.clusterField,
a.features,f);a=h.nullLabel;h=b.call(this,h.notNullLabel);a=b.call(this,a);return h=g?h.concat(a):h},getCountModeStatisticsData:function(a){function b(a){var b=[],c=null,e;for(e in a){var c=a[e],g=this.calcValuesByFeaturesForCountMode(c,f);e=this.keepFieldValueType(e,c.type,d);b.push({label:e,values:g,features:c.features,unit:c.unit})}return b}var d=a.dateConfig,c=void 0!==a.showNullLabelData?a.showNullLabelData:!0,e=[],f=a.hasStatisticsed&&!d,e=this.getCluseringObj(a.clusterField,a.features,d);a=
e.nullLabel;e=b.call(this,e.notNullLabel);a=b.call(this,a);return e=c?e.concat(a):e},calcValuesByFeaturesForCountMode:function(a,b){return b?a.features.map(function(a){var b=(a=a.attributes)&&a.STAT_COUNT;"undefined"===typeof b&&(b=a.stat_count);return b}.bind(this)):[a.count]},getFieldModeStatisticsData:function(a){var b=a.hasStatisticsed,d=a.features,c=a.operation,e=a.nullValue,f=[];return f=a.valueFields.map(m.hitch(this,function(a){var f=this.getValuesByValueFieldForFieldMode(a,d,b,c),f=this.calcValueByOperation(f,
c,e);return{label:a,values:[f]}}))},getValuesByValueFieldForFieldMode:function(a,b,d,c){c="average"===c?"avg":c;if(d)var e=k.upperCaseString(a+"_"+c),f=k.lowerCaseString(a+"_"+c);return b.map(m.hitch(this,function(b){if(b=b.attributes){var c;d?(c=b[e],"undefined"===typeof c&&(c=b[f])):c=b[a];return c}}))},sortStatisticsData:function(a,b,d,c,e){function f(a,b,d){var f;if("category"===b)d.isLabelAxis?d.isLabelAxis&&(f=a.label):d.field||1!==a.values.length?(d=e.indexOf(d.field),f=a.values[d]):f=a.values[0];
else if("count"===b)f=a.label,f=d.isLabelAxis?f:a.values[0];else if("field"===b)f=d.isLabelAxis?a.label:a.values[0];else if("feature"===b){var g=d.field;a&&a.features&&a.features[0]&&(b=a.features[0].attributes)&&(d.isLabelAxis?f=b[c]:g?f=b[g]:a.values.length&&(f=a.values[0]))}return f}if(!d)return a;var g=d.isAsc;if(!Array.isArray(a))return a;a.sort(function(a,c){a=f(a,b,d);c=f(c,b,d);"_NULL\x26UNDEFINED_"===a&&(a=Infinity);"_NULL\x26UNDEFINED_"===c&&(c=Infinity);k.isNumberOrNumberString(a)&&(a=
Number(a));k.isNumberOrNumberString(c)&&(c=Number(c));var e=a>c?g:!g;Infinity===a?e=g:Infinity===c&&(e=!g);var h=0;a!==c&&(h=e?1:-1);return h}.bind(this));return a},convertingNullOrUndefinedAsPlaceholders:function(a){return null===a||void 0===a?"_NULL\x26UNDEFINED_":a},keepFieldValueType:function(a,b,d){"number"===b&&(a=Number(a));d&&"_NULL\x26UNDEFINED_"!==a&&(a=Number(a));return a},calcValuesByFeaturesForCatetoryMode:function(a,b,d,c,e){return a.map(function(a){a=this.getValuesByValueFieldForCategoryMode(a,
b.features,d,c);return this.calcValueByOperation(a,c,e)}.bind(this))},getValuesByValueFieldForCategoryMode:function(a,b,d,c){c="average"===c?"avg":c;if(d)var e=k.upperCaseString(a+"_"+c),f=k.lowerCaseString(a+"_"+c);return b.map(m.hitch(this,function(b){if(b=b.attributes){var c;d?(c=b[e],"undefined"===typeof c&&(c=b[f])):c=b[a];return c}}))},_isNumber:function(a){return"[object number]"===Object.prototype.toString.call(a).toLowerCase()},_getDateUnit:function(a,b){var d=b;"automatic"===b&&(b=l(a[0]).local(),
a=l(a[1]).local(),a=Math.round(a.diff(b,"minute",!0)),0<=a&&1>=a?d="second":1<a&&60>=a?d="minute":60<a&&1440>=a?d="hour":1440<a&&43200>=a?d="day":43200<a&&518400>=a?d="month":518400<a&&(d="year"));return d},_getTimeRange:function(a,b){var d=a.map(m.hitch(this,function(a){return(a=a.attributes)&&a[b]})),d=d.filter(function(a){return!!a});a=Math.min.apply(Math,d);d=Math.max.apply(Math,d);return[a,d]},_getTimeTwixs:function(a,b,d){if(0>"year month day hour minute second automatic".split(" ").indexOf(d))return console.log("Invaild data formatter: "+
d),!1;a=this._getTimeRange(a,b);if(a[0]===a[1])return!1;d=this._getDateUnit(a,d);b=this.getStartTimeByUnit(a[0],d);b=l(b).local();a=l(a[1]).local();a=b.twix(a).split(1,d);b={startValue:a[a.length-1].end().valueOf(),endValue:Infinity};a.push(b);return{twixs:a,dateUnit:d}},getCluseringObj:function(a,b,d){var c={},e={};d?(a=this.getClusteringObjForDateType(a,b,d),c=a.notNullLabel,e=a.nullLabel):(c=this.separateFeaturesWhetherFieldValueNull(a,b),b=c.nullLabelFeatures,c=this.getClusteringObjByField(c.notNullLabelFeatures,
a),e=this.getClusteringObjByField(b,a));return{notNullLabel:c,nullLabel:e}},calcValueByOperation:function(a,b,d){if(a&&1===a.length){if(!d)return a[0];if(!this._isNumber(a[0]))return 0}var c;if(0!==a.length){c=0;"max"===b?c=-Infinity:"min"===b&&(c=Infinity);a=d?a.map(function(a){this._isNumber(a)||(a=0);return a}.bind(this)):a.filter(function(a){return this._isNumber(a)}.bind(this));var e=0;a.forEach(m.hitch(this,function(a){e++;"average"===b||"sum"===b?c+=a:"max"===b?c=Math.max(c,a):"min"===b&&(c=
Math.min(c,a))}));0<e?"average"===b&&(c/=e):c=null}else c=null;return c},getClusteringObjByField:function(a,b){var d={};a.forEach(m.hitch(this,function(a){var c=a.attributes,c=c&&c[b],f=typeof c,c=this.convertingNullOrUndefinedAsPlaceholders(c),g=null;d.hasOwnProperty(c)?(g=d[c],g.features.push(a),g.count++):(g={count:1,features:[a],type:f},d[c]=g)}));return d},_removeNaNDataItem:function(a){return a.filter(function(a){var b=!1;a=a.category;"number"===typeof a&&(b=isNaN(a));return!b})},separateFeaturesWhetherFieldValueNull:function(a,
b){var d=[],c=[];Array.isArray(b)&&(c=b.filter(function(b){var c=b.attributes,c=c&&c[a];if(null===c||void 0===c)d.push(b);else return!0}));return{nullLabelFeatures:d,notNullLabelFeatures:c}},getStartTimeByUnit:function(a,b){return l(a).startOf(b).utc().valueOf()},_mosaicFieldNameWithOperatorAndUpper:function(a,b){return k.upperCaseString(a+"_"+b)},_mosaicFieldNameWithOperatorAndLower:function(a,b){return k.lowerCaseString(a+"_"+b)},getClusteringObjForDateType:function(a,b,d){function c(a,b,c){a[b]?
(a=a[b],a.count+=c.count,a.features=a.features.concat(c.features)):a[b]=c}function e(a,b,c,d){b=Number(b);d=this.getStartTimeByUnit(b,d);a[d]?(a=a[d],a.count+=c.count,a.features=a.features.concat(c.features)):(c.originTime=b,a[d]=c)}function f(a,b,c){c[a[0].attributes[b]]={count:1,features:a};return c}var g=this.separateFeaturesWhetherFieldValueNull(a,b),k=g.notNullLabelFeatures;b={};b=this.getClusteringObjByField(g.nullLabelFeatures,a);g={};if(1===k.length)g=f.call(this,k,a,g,d);else if(0!==k.length){var h=
this._getTimeTwixs(k,a,d.minPeriod);if(h){var n={},l=h.dateUnit;h.twixs.forEach(function(b){var f="undefined"!==typeof b.startValue?b.startValue:b.start().valueOf(),e="undefined"!==typeof b.endValue?b.endValue:b.end().valueOf(),g={unit:l,count:0,features:[]};k.forEach(m.hitch(this,function(b){var c=b.attributes,c=c&&c[a];c>=f&&c<e&&(g.features.push(b),g.count++)}));d.isNeedFilled?c.call(this,n,f,g):0<g.count&&c.call(this,n,f,g)}.bind(this));var h={},p,r;for(p in n)n.hasOwnProperty(p)&&(r=n[p],e.call(this,
h,p,r,l));for(p in h)if(h.hasOwnProperty(p)){r=h[p];var q=r.originTime;delete r.originTime;g[q]=r}}else g=f.call(this,k,a,g,d)}return{notNullLabel:g,nullLabel:b}},_mapOptions:function(a,b){"feature"===b?(b=a.labelField,delete a.labelField,a.clusterField=b,a.showNullLabelData=!0):"category"===b?(b=a.categoryField,delete a.categoryField,a.clusterField=b,a.showNullLabelData=!0):"count"===b?(b=a.categoryField,delete a.categoryField,a.clusterField=b):"field"===b&&(a.showNullLabelData=!0);return a},_mapDataItemForStatisticsChart:function(a,
b){var d,c,e;return a.map(function(a){d=a.label;delete a.label;c=a.values;delete a.values;e=a.features;delete a.features;"feature"===b?(a.category=d,a.valueFields=c,a.dataFeatures=e):"category"===b?(a.category=d,a.valueFields=c,a.dataFeatures=e):"count"===b?(a.fieldValue=d,a.count=c[0],a.dataFeatures=e):"field"===b&&(a.label=d,a.value=c[0]);return a})},getFeatureModeStatisticsInfo:function(a){var b=new q({featureLayer:a.layerDefinition,popupInfo:a.popupFieldInfosObj});a=this._mapOptions(a,"feature");
var d=a.clusterField,c=this.getFeatureModeStatisticsData(a),c=this.sortStatisticsData(c,"feature",a.sortOrder,d),c=this.getDataForMaxLabels(c,a.maxLabels),c=b.getBestLabelDisplay(c,d,"feature"),c=b.keepStatisticsDataBestDecimalPlace(a,c,"feature");return this._mapDataItemForStatisticsChart(c,"feature")},getCategoryModeStatisticsInfo:function(a){var b=new q({featureLayer:a.layerDefinition,popupInfo:a.popupFieldInfosObj});a=this._mapOptions(a,"category");var d=a.clusterField,c=this.getCategoryModeStatisticsData(a),
c=this.sortStatisticsData(c,"category",a.sortOrder,null,a.valueFields),c=this._removeNaNDataItem(c),c=this.getDataForMaxLabels(c,a.maxLabels),c=b.getBestLabelDisplay(c,d,"category"),c=b.keepStatisticsDataBestDecimalPlace(a,c,"category");return this._mapDataItemForStatisticsChart(c,"category")},getCountModeStatisticsInfo:function(a){var b=new q({featureLayer:a.layerDefinition,popupInfo:a.popupFieldInfosObj});a=this._mapOptions(a,"count");var d=a.clusterField,c=this.getCountModeStatisticsData(a),c=
this.sortStatisticsData(c,"count",a.sortOrder),c=this.getDataForMaxLabels(c,a.maxLabels),c=b.getBestLabelDisplay(c,d,"count");return this._mapDataItemForStatisticsChart(c,"count")},getFieldModeStatisticsInfo:function(a){var b=new q({featureLayer:a.layerDefinition,popupInfo:a.popupFieldInfosObj});a=this._mapOptions(a,"category");var d=this.getFieldModeStatisticsData(a),d=this.sortStatisticsData(d,"field",a.sortOrder),d=this.getDataForMaxLabels(d,a.maxLabels),d=b.getBestLabelDisplay(d,null,"field"),
d=b.keepStatisticsDataBestDecimalPlace(a,d,"field");return this._mapDataItemForStatisticsChart(d,"field")}}});