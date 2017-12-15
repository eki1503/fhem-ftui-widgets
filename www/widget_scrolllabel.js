/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_scrolllabel (){
	var mainCSS = $('head').find("[href$='fhem-tablet-ui-user.css']");
	if (mainCSS.length)
		mainCSS.before('<link rel="stylesheet" href="'+ ftui.config.basedir + '/../css/ftui_scrolllabel.css" type="text/css" />');
	else
		$('head').append('<link rel="stylesheet" href="'+ ftui.config.basedir + '/../css/ftui_scrolllabel.css" type="text/css" />');

	if (!window.addResizeListener) {
		(function(){
			var attachEvent = document.attachEvent;
			var isIE = navigator.userAgent.match(/Trident/);
			//console.log(isIE);

			var requestFrame = (function(){
				var raf =	window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							function(fn){ return window.setTimeout(fn, 20); };
				return function(fn){ return raf(fn); };
			})();
			
			var cancelFrame = (function(){
				var cancel =	window.cancelAnimationFrame ||
								window.mozCancelAnimationFrame ||
								window.webkitCancelAnimationFrame ||
								window.clearTimeout;
				return function(id){ return cancel(id); };
			})();
			
			function resizeListener(e){
				var win = e.target || e.srcElement;
				if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
				win.__resizeRAF__ = requestFrame(function(){
					var trigger = win.__resizeTrigger__;
					trigger.__resizeListeners__.forEach(function(fn){
						fn.call(trigger, e);
					});
				});
			}
				
			function objectLoad(e){
				this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
				this.contentDocument.defaultView.addEventListener('resize', resizeListener);
			}
			
			window.checkResizeListener = function(element){
				if (element.__resizeListeners__ && element.__resizeListeners__.length && element.__resizeListeners__.length > 0)
					return true;
				else
					return false;
			};
			
			window.addResizeListener = function(element, fn){
				if (!element.__resizeListeners__) {
					element.__resizeListeners__ = [];
					if (attachEvent) {
						element.__resizeTrigger__ = element;
						element.attachEvent('onresize', resizeListener);
					}
					else {
						if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
						var obj = element.__resizeTrigger__ = document.createElement('object'); 
						obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
						obj.__resizeElement__ = element;
						obj.onload = objectLoad;
						obj.type = 'text/html';
						if (isIE) element.appendChild(obj);
						obj.data = 'about:blank';
						if (!isIE) element.appendChild(obj);
					}
				}
				element.__resizeListeners__.push(fn);
			};
			
			window.removeResizeListener = function(element, fn){
				element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
				if (!element.__resizeListeners__.length) {
					if (attachEvent) element.detachEvent('onresize', resizeListener);
					else {
						element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
						element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
					}
				}
			}
		})();
	}

	if (!$.fn.visibilityChanged) {
		(function ($) {
			var defaults = {
				callback: function () { },
				runOnLoad: true,
				frequency: 500,
				previousVisibility : null
			};

			var methods = {};
			methods.checkVisibility = function (element, options) {
				if (jQuery.contains(document, element[0])) {
					var previousVisibility = options.previousVisibility;
					var isVisible = element.is(':visible');
					options.previousVisibility = isVisible;
					if (previousVisibility === null) {
						if (options.runOnLoad) {
							options.callback(element, isVisible);
						}
					} else if (previousVisibility !== isVisible) {
						options.callback(element, isVisible);
					}

					setTimeout(function() {
						methods.checkVisibility(element, options);
					}, options.frequency);
				} 
			};

			$.fn.visibilityChanged = function (options) {
				var settings = $.extend({}, defaults, options);
				return this.each(function () {
					methods.checkVisibility($(this), settings);
				});
			};
		})(jQuery);
	}

    if (typeof Modul_label == 'undefined')
        return ["label"];
}

var Modul_scrolllabel = function() {

	var widget_scrolllabel = {
		timers:[],
		widgetname:"scrolllabel",
		actualspeed:null,
		updatetime:2000,

		scrollscl: function(inst,elem) {
			//console.log('entering scrolltimer ',inst,elem,widget_scrolllabel.timers[inst]);

			widget_scrolllabel.timers[inst].running = true;
			
			if (widget_scrolllabel.timers[inst].id) { // first time of calling scrollscl do nothing and wait for first timer to fire
				var horizontal = (elem.data('orientation')=='horizontal');
				var sclTextContainer = elem.find("[id*='sclTextContainer_']");
				var sclsize = horizontal?elem.find("[id*='sclViewport_']")[0].offsetWidth:elem.find("[id*='sclViewport_']")[0].offsetHeight;
				var actualsize=horizontal?sclTextContainer[0].offsetWidth*2:sclTextContainer[0].offsetHeight*2; //height of scl content (much of which is hidden from view)
				if (elem.data('invert')) {
					var actualRef = horizontal?Math.max(parseInt(sclTextContainer[0].style.left),parseInt(sclTextContainer[1].style.left)):Math.max(parseInt(sclTextContainer[0].style.top),parseInt(sclTextContainer[1].style.top));
				} else {
					var actualRef = horizontal?Math.min(parseInt(sclTextContainer[0].style.left),parseInt(sclTextContainer[1].style.left)):Math.min(parseInt(sclTextContainer[0].style.top),parseInt(sclTextContainer[1].style.top));				
				}
				var stoppoint = (actualRef%(sclsize-1)==0);
				var step = elem.data('invert')?parseInt(elem.data('actualspeed'))*-1:parseInt(elem.data('actualspeed'));
				var time = elem.data('updatetime');
				if (sclTextContainer[0]) {
					if ((!elem.data('invert') && parseInt(actualRef)>((actualsize/2)*(-1))) || (elem.data('invert') && parseInt(actualRef)-step<((actualsize/2)))) { //if scroller hasn't reached the end of its height
						if (horizontal) {
							sclTextContainer[0].style.left=parseInt(actualRef)-step+"px"; //move scroller left
							sclTextContainer[1].style.left=parseInt(sclTextContainer[1].style.left)-step+"px"; //move scroller left
						} else {
							sclTextContainer[0].style.top=parseInt(actualRef)-step+"px"; //move scroller upwards
							sclTextContainer[1].style.top=parseInt(sclTextContainer[1].style.top)-step+"px"; //move scroller left
						}
					} else { //else, reset to start position
						if (horizontal) {
							sclTextContainer[0].style.left=parseInt(sclTextContainer[1].style.left)+parseInt(sclTextContainer[0].offsetWidth)*(elem.data('invert')?-1:1)+"px";
							var el = elem.find("[id*='sclTextContainer_']").first().remove();
							elem.find("[id*='sclViewport_']").append(el); // put old first as new second text container
						} else {
							sclTextContainer[0].style.top=parseInt(sclTextContainer[1].style.top)+parseInt(sclTextContainer[0].offsetHeight)*(elem.data('invert')?-1:1)+"px";
							var el = elem.find("[id*='sclTextContainer_']").first().remove();
							elem.find("[id*='sclViewport_']").append(el); // put old first as new second text container
						}
						time = 0;
					}
				}
			}
			widget_scrolllabel.timers[inst].id = setTimeout(function() {widget_scrolllabel.scrollscl(inst,elem)}, time);
		},
		doEvent: function(event) {
			var elem = $(event.delegateTarget).parent();
			switch (event.type) { // split into different activities for different events
				case 'mouseover':
					elem.data('actualspeed', elem.data('pausespeed'));
					break;
				case 'mouseout':
					elem.data('actualspeed', elem.data('sclspeed'));
					break;
			}
		},
		getTextContainerWidth: function(elem,string) {
			var tDummy = $('<div><a>'+string+'</a></div>');
			tDummy.attr('style','width: 10000%');
			tDummy.find('a').attr({'style':'box-sizing: border-box'+'; font-family: '+elem.css('font-family')+'; font-size: '+elem.css('font-size')+'; font-weight: '+elem.css('font-weight')});
			$(document).find('body').append(tDummy);
			var width = tDummy.find('a')[0].getBoundingClientRect().width; //simple calculation of width
			tDummy.remove();
			return width+'px';
		},
		getLineHeight: function(elem) {
			var tDummy = $("<span id='def' style='line-height:inherit;display:none;'>&nbsp;</span>");
			elem.append(tDummy);
			var height = tDummy.height(); //simple calculation of width
			tDummy.remove();
			return parseInt(height);
		},
		updatescl: function(elem) {
			var str = elem.attr('value');
			if (elem.find("[id*='sclViewport_']").length > 0) { // element is already initialized, reset old one first
				var instance = elem.attr('instance');
				var time = elem.data('updatetime')*1.1;
				if (widget_scrolllabel.timers[instance].running) {
					widget_scrolllabel.timers[instance].running = false;
					clearTimeout(widget_scrolllabel.timers[instance].id);
					setTimeout(function() {widget_scrolllabel.initializescl(elem,str);},time); // wait until scrolltimer has been reset
				} else {
					widget_scrolllabel.initializescl(elem,str);					
				}
			} else {
				widget_scrolllabel.initializescl(elem,str);
			}
		},
		initializescl: function(elem,str){
			if (widget_scrolllabel.getLineHeight(elem) == 0) return; // if the line height does not deliver correct values, object might be invisible, ignore call
			var height = elem.data("height")?"height: "+elem.data("height"):"height: "+widget_scrolllabel.getLineHeight(elem)*parseInt(elem.data('lines'))+'px';
			var horizontal = (elem.data('orientation')=='horizontal');
			var cmString = horizontal?str+(elem.data('offset')?'&nbsp'.repeat(elem.data('offset')):'&nbsp'):str;
			if (elem.data('offset')) 
			var cmSize = horizontal?'height: 98%; width: '+widget_scrolllabel.getTextContainerWidth(elem,cmString)+';':'width: 98%;';
			var instance;

			elem.data('updatetime', widget_scrolllabel.updatetime);

			var speedclass = 'normal'
			switch(elem.data('scrollspeed')) {
				case 'fast':
					speedclass = 'fast';
					elem.data('updatetime', widget_scrolllabel.updatetime/2);
					break;
				case 'slow':
					speedclass = 'slow';
					elem.data('updatetime', widget_scrolllabel.updatetime*2);
					break;
				default:
					if ($.isNumeric(elem.data('scrollspeed'))) {
						speedclass = 'numeric_speed';
						elem.data('updatetime',parseInt(elem.data('scrollspeed')));
					}
			}

			elem.data('pausespeed',0);

			if (elem.find("[id*='sclViewport_']").length > 0) {
				instance=elem.attr('instance');
			} else {
				/*elem.sizeChanged({callback: function(element) {
					if (element.find("[id*='sclViewport_']").length > 0) widget_scrolllabel.updatescl(element);
				}});*/
				instance=$(document).find("[id^=sclViewport]").length;
				instance++;
				elem.attr('instance',instance);
				widget_scrolllabel.timers[instance] = {'running':false};

				elem.html(	"<div style='"+height+"; position:relative; overflow:hidden;' id='sclViewport_"+instance+"'>" + 
							"<div id='sclTextContainer_"+instance+"' class='scrolllabel "+speedclass+"' style='position: absolute; "+cmSize+"'>" + cmString + '</div></div>');
				window.addResizeListener(elem[0], function () {
					//console.log('Resize Listener',elem.attr('instance'),elem.attr('value'));
					widget_scrolllabel.updatescl(elem);
				});
			}

			var sclViewport = elem.find("#sclViewport_"+instance);
			var sclTextContainer=elem.find("[id*='sclTextContainer_']");
			if (horizontal && (sclViewport[0].offsetWidth >= parseInt(widget_scrolllabel.getTextContainerWidth(elem,cmString)))) { // size fits in viewport, no scrolling
				sclTextContainer[0].style.width = '98%';
			} else if (horizontal) {
				sclTextContainer[0].style.width = widget_scrolllabel.getTextContainerWidth(elem,cmString);
				if (sclTextContainer.length > 1) sclTextContainer[1].style.width = widget_scrolllabel.getTextContainerWidth(elem,cmString);
			}

			if (sclTextContainer.length <= 1){ // add sencond text container to get seemless scrolling
				sclViewport.append($("<div id='sclTextContainer_"+instance+"' class='scrolllabel "+speedclass+"' style='position: absolute; "+cmSize+"'>" + cmString + '</div>'));
				sclTextContainer=elem.find("[id*=sclTextContainer_]");
				if (horizontal) sclTextContainer[1].style.width = widget_scrolllabel.getTextContainerWidth(elem,cmString);
			}
			sclTextContainer.each(function() {
				this.innerHTML = cmString;
				if (speedclass == 'numeric_speed') { // generate transition values
					var transType = elem.hasClass('ease')?'ease':(elem.hasClass('linear')?'linear':(horizontal?'linear':'ease'));
					this.style.transition = 'top '+elem.data('updatetime')+'ms '+transType+', left '+elem.data('updatetime')+'ms '+transType;
				}
			});
			sclViewport.on('mouseover mouseout',function(event) {widget_scrolllabel.doEvent(event);});
			sclViewport = sclViewport[0];
			elem.data('actualspeed',horizontal?parseInt(sclViewport.offsetWidth):parseInt(sclViewport.offsetHeight)*elem.data('scroll-lines')/elem.data('lines'));
			elem.data('sclspeed',horizontal?parseInt(sclViewport.offsetWidth):parseInt(sclViewport.offsetHeight)*elem.data('scroll-lines')/elem.data('lines'));
			var keepClass=$(sclTextContainer[0]).attr('class');
			if (horizontal) {
				$(sclTextContainer[0]).attr('class',""); // avoid slow scrolling for this change
				sclTextContainer[0].style.left=0;
				setTimeout(function() {$(sclTextContainer[0]).attr('class',keepClass);},100);
				if (sclTextContainer.length > 1) {
					$(sclTextContainer[1]).attr('class',"");
					sclTextContainer[1].style.left=sclTextContainer[0].offsetWidth*(elem.data('invert')?-1:1)+'px';
					setTimeout(function() {$(sclTextContainer[1]).attr('class',keepClass);},100);
				}
			} else {
				$(sclTextContainer[0]).attr('class',""); // avoid slow scrolling for this change
				sclTextContainer[0].style.top=0;
				sclTextContainer[0].style.width='100%';
				setTimeout(function() {$(sclTextContainer[0]).attr('class',keepClass);},100);
				if (sclTextContainer.length > 1) {
					$(sclTextContainer[1]).attr('class',"");
					//sclTextContainer[1].style.width='100%';
					sclTextContainer[1].style.top=sclTextContainer[0].offsetHeight*(elem.data('invert')?-1:1)+'px';
					setTimeout(function() {$(sclTextContainer[1]).attr('class',keepClass);},100);
				}
			}				

			var sclsize = horizontal?sclViewport.offsetWidth:sclViewport.offsetHeight;
			var actualsize=horizontal?sclTextContainer[0].offsetWidth*2:sclTextContainer[0].offsetHeight*2; //height of scl content (much of which is hidden from view)
			if (sclsize==0) {
				sclsize = actualsize;
				if (horizontal) {
					sclViewport.each(function(){$(this).style.width = actualsize+"px";});
				} else {
					sclViewport.each(function(){$(this).style.height = actualsize+"px";});
				}
			}

			if (window.opera || navigator.userAgent.indexOf("Netscape/7")!=-1){ //if Opera or Netscape 7x, add scrollbars to scroll and exit
				sclTextContainer[0].innerHTML = cmString;
				elem.find("#sclTextContainer_"+instance).last().remove();
				if (horizontal) {
					sclTextContainer[0].style.widht=sclsize+"px";
				} else {
					sclTextContainer[0].style.height=sclsize+"px";
				}
				sclTextContainer[0].style.overflow="scroll";
				return;
			}
			ftui.log(3,"Scroll Label (" + instance + ") actual height: " + actualsize + " scl height: " + sclsize);
			if (actualsize/2 > (sclsize)) {
				if (!widget_scrolllabel.timers[instance].running) widget_scrolllabel.scrollscl(instance,elem);
			} else {
				if (sclTextContainer.length > 1) sclTextContainer.last().remove();
			}
		},

		doscrolltext: function (elem) {		
			if (elem.is(':visible')) {
				widget_scrolllabel.updatescl(elem);
			} else {
				elem.visibilityChanged({callback: function(element) {
					widget_scrolllabel.updatescl(element);
				}, runOnLoad: false, frequency: 500});
			}
		},
	};

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('unit', '');
        elem.initData('color', '');
        elem.initData('limits', elem.data('states') || []);
        elem.initData('colors', ['#505050']);
        elem.initData('limits-get', (elem.data('device')) ? elem.data('device') + ':' + elem.data('get') : elem.data('get'));
        elem.initData('limits-part', elem.data('part'));
        elem.initData('substitution', '');
        elem.initData('pre-text', '');
        elem.initData('post-text', '');
        elem.initData('refresh', 0);
		elem.initData('lines',			elem.data('lines')					|| 1);
		elem.initData('scroll-lines',	elem.data('scroll-lines')			|| elem.data('lines'));
		elem.initData('invert',			elem.data('invert')					|| false);
		elem.initData('orientation',	elem.data('orientation')			|| 'vertical');
		elem.initData('offset',			elem.data('offset')					|| 0);
		elem.initData('scrollspeed',	elem.data('scrollspeed')			|| 'normal');

        // if hide reading is defined, set defaults for comparison
        if (elem.isValidData('hide')) {
            elem.initData('hide-on', 'true|1|on');
        }
        elem.initData('hide', elem.data('get'));
        if (elem.isValidData('hide-on')) {
            elem.initData('hide-off', '!on');
        }
        me.addReading(elem, 'hide');

        // fill up colors to limits.length
        // if an index s isn't set, use the value of s-1
        for (var s = 0, len = elem.data('limits').length; s < len; s++) {
            if (typeof elem.data('colors')[s] == 'undefined') {
                elem.data('colors')[s] = elem.data('colors')[s > 0 ? s - 1 : 0];
            }
        }

        elem.data('fix', ($.isNumeric(elem.data('fix'))) ? Number(elem.data('fix')) : -1);

        me.addReading(elem, 'get');
        me.addReading(elem, 'limits-get');
        if (elem.isDeviceReading('color')) {
            me.addReading(elem, 'color');
        }
    }

    function init_ui(elem) {
        var interval = elem.data('refresh');
        if ($.isNumeric(interval) && interval > 0) {
            var tid = setInterval(function () {
                if (elem && elem.data('get')) {

                    me.update_value(elem);

                } else {
                    clearInterval(tid);
                }
            }, Number(interval) * 1000);
        }

    }

    function update_value(elem) {

        var value = (elem.hasClass('timestamp')) ? elem.getReading('get').date : elem.getReading('get').val;

        if (ftui.isValid(value)) {
            var val = ftui.getPart(value, elem.data('part'));
            var unit = elem.data('unit');
            val = me.substitution(val, elem.data('substitution'));
            val = me.map(elem.data('map-get'), val, val);
            val = me.fix(val, elem.data('fix'));
            val = elem.data('pre-text') + val + elem.data('post-text');
            if (!isNaN(parseFloat(val)) && isFinite(val) && val.indexOf('.') > -1) {
                var vals = val.split('.');
                val = "<span class='label-precomma'>" + vals[0] + "</span>" +
                    "<span class='label-comma'>.</span>" +
                    "<span class='label-aftercomma'>" + vals[1] + "</span>";
            }

            if (!elem.hasClass('fixedlabel') && !elem.hasClass('fixcontent')) {
                if (unit) val = val + "<span class='label-unit'>" + window.unescape(unit) + "</span>";

				elem.attr('value',val);
				
				widget_scrolllabel.doscrolltext(elem);

                if (elem.children().length > 0) {
                    elem.trigger('domChanged');
                }
            }
            me.update_cb(elem, val);
        }
        var color = elem.data('color');
        if (color && !elem.isDeviceReading('color')) {
            elem.css("color", ftui.getStyle('.' + color, 'color') || color);
        }

    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                update_value($(this));
            });

        //extra reading for dynamic color
        me.elements.filterDeviceReading('color', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('color').val;
                if (ftui.isValid(val)) {
                    val = '#' + val.replace('#', '');
                    elem.css("color", val);
                }
            });

        //extra reading for hide
        me.update_hide(dev, par);

        //extra reading for colorize
        me.elements.filterDeviceReading('limits-get', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('limits-get').val;
                if (ftui.isValid(val)) {
                    var v = ftui.getPart(val, elem.data('limits-part'));
                    me.update_colorize(v, elem);
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_label(), {
        //override or own public members
        widgetname: 'scrolllabel',
        init_attr: init_attr,
        init_ui: init_ui,
        update_value: update_value,
        update: update
    });
	
	return me;
};