/*
 AngularJS v1.5.11
 (c) 2010-2017 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(R,b){'use strict';function G(s,g){g=g||{};b.forEach(g,function(b,k){delete g[k]});for(var k in s)!s.hasOwnProperty(k)||"$"===k.charAt(0)&&"$"===k.charAt(1)||(g[k]=s[k]);return g}var y=b.$$minErr("$resource"),N=/^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;b.module("ngResource",["ng"]).provider("$resource",function(){var s=/^https?:\/\/[^/]*/,g=this;this.defaults={stripTrailingSlashes:!0,cancellable:!1,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},
"delete":{method:"DELETE"}}};this.$get=["$http","$log","$q","$timeout",function(k,M,H,I){function z(b,e){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,e?"%20":"+")}function B(b,e){this.template=b;this.defaults=r({},g.defaults,e);this.urlParams={}}function J(A,e,p,m){function c(a,d){var c={};d=r({},e,d);u(d,function(d,e){w(d)&&(d=d(a));var f;if(d&&d.charAt&&"@"===d.charAt(0)){f=a;var l=d.substr(1);if(null==l||""===l||
"hasOwnProperty"===l||!N.test("."+l))throw y("badmember",l);for(var l=l.split("."),h=0,g=l.length;h<g&&b.isDefined(f);h++){var q=l[h];f=null!==f?f[q]:void 0}}else f=d;c[e]=f});return c}function O(a){return a.resource}function h(a){G(a||{},this)}var s=new B(A,m);p=r({},g.defaults.actions,p);h.prototype.toJSON=function(){var a=r({},this);delete a.$promise;delete a.$resolved;delete a.$cancelRequest;return a};u(p,function(a,d){var b=/^(POST|PUT|PATCH)$/i.test(a.method),e=a.timeout,g=K(a.cancellable)?
a.cancellable:s.defaults.cancellable;e&&!P(e)&&(M.debug("ngResource:\n  Only numeric values are allowed as `timeout`.\n  Promises are not supported in $resource, because the same value would be used for multiple requests. If you are looking for a way to cancel requests, you should use the `cancellable` option."),delete a.timeout,e=null);h[d]=function(f,l,m,A){var q={},p,v,C;switch(arguments.length){case 4:C=A,v=m;case 3:case 2:if(w(l)){if(w(f)){v=f;C=l;break}v=l;C=m}else{q=f;p=l;v=m;break}case 1:w(f)?
v=f:b?p=f:q=f;break;case 0:break;default:throw y("badargs",arguments.length);}var D=this instanceof h,n=D?p:a.isArray?[]:new h(p),t={},z=a.interceptor&&a.interceptor.response||O,B=a.interceptor&&a.interceptor.responseError||void 0,x,E;u(a,function(a,d){switch(d){default:t[d]=Q(a);case "params":case "isArray":case "interceptor":case "cancellable":}});!D&&g&&(x=H.defer(),t.timeout=x.promise,e&&(E=I(x.resolve,e)));b&&(t.data=p);s.setUrlParams(t,r({},c(p,a.params||{}),q),a.url);q=k(t).then(function(f){var c=
f.data;if(c){if(L(c)!==!!a.isArray)throw y("badcfg",d,a.isArray?"array":"object",L(c)?"array":"object",t.method,t.url);if(a.isArray)n.length=0,u(c,function(a){"object"===typeof a?n.push(new h(a)):n.push(a)});else{var b=n.$promise;G(c,n);n.$promise=b}}f.resource=n;return f},function(a){(C||F)(a);return H.reject(a)});q["finally"](function(){n.$resolved=!0;!D&&g&&(n.$cancelRequest=F,I.cancel(E),x=E=t.timeout=null)});q=q.then(function(a){var d=z(a);(v||F)(d,a.headers,a.status,a.statusText);return d},
B);return D?q:(n.$promise=q,n.$resolved=!1,g&&(n.$cancelRequest=x.resolve),n)};h.prototype["$"+d]=function(a,c,b){w(a)&&(b=c,c=a,a={});a=h[d].call(this,a,this,c,b);return a.$promise||a}});h.bind=function(a){a=r({},e,a);return J(A,a,p,m)};return h}var F=b.noop,u=b.forEach,r=b.extend,Q=b.copy,L=b.isArray,K=b.isDefined,w=b.isFunction,P=b.isNumber;B.prototype={setUrlParams:function(b,e,g){var m=this,c=g||m.template,k,h,r="",a=m.urlParams={};u(c.split(/\W/),function(d){if("hasOwnProperty"===d)throw y("badname");
!/^\d+$/.test(d)&&d&&(new RegExp("(^|[^\\\\]):"+d+"(\\W|$)")).test(c)&&(a[d]={isQueryParamValue:(new RegExp("\\?.*=:"+d+"(?:\\W|$)")).test(c)})});c=c.replace(/\\:/g,":");c=c.replace(s,function(a){r=a;return""});e=e||{};u(m.urlParams,function(a,b){k=e.hasOwnProperty(b)?e[b]:m.defaults[b];K(k)&&null!==k?(h=a.isQueryParamValue?z(k,!0):z(k,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),c=c.replace(new RegExp(":"+b+"(\\W|$)","g"),function(a,b){return h+b})):c=c.replace(new RegExp("(/?):"+
b+"(\\W|$)","g"),function(a,b,d){return"/"===d.charAt(0)?d:b+d})});m.defaults.stripTrailingSlashes&&(c=c.replace(/\/+$/,"")||"/");c=c.replace(/\/\.(?=\w+($|\?))/,".");b.url=r+c.replace(/\/\\\./,"/.");u(e,function(a,c){m.urlParams[c]||(b.params=b.params||{},b.params[c]=a)})}};return J}]})})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map