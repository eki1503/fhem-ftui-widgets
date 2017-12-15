/* FTUI Plugin
 * Copyright (c) 2015-2017 Kurt Eckert
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
/* Version 1.0
/* Compatible FTUI Version >= 2.6
*/

"use strict";

function depends_gmaps (){
	if (!window.addResizeListener) {
		(function(){
			var attachEvent = document.attachEvent;
			var isIE = navigator.userAgent.match(/Trident/);
			console.log(isIE);

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
	
	if (!$.fn.fontNameToUnicode) {
		$.fn.fontNameToUnicode = function(name) {
			var FONT_AWESOME = {"fa-500px":"\uf26e","fa-adjust":"\uf042","fa-adn":"\uf170","fa-align-center":"\uf037","fa-align-justify":"\uf039","fa-align-left":"\uf036","fa-align-right":"\uf038","fa-amazon":"\uf270","fa-ambulance":"\uf0f9","fa-anchor":"\uf13d","fa-android":"\uf17b","fa-angellist":"\uf209","fa-angle-double-down":"\uf103","fa-angle-double-left":"\uf100","fa-angle-double-right":"\uf101","fa-angle-double-up":"\uf102","fa-angle-down":"\uf107","fa-angle-left":"\uf104","fa-angle-right":"\uf105","fa-angle-up":"\uf106","fa-apple":"\uf179","fa-archive":"\uf187","fa-area-chart":"\uf1fe","fa-arrow-circle-down":"\uf0ab","fa-arrow-circle-left":"\uf0a8","fa-arrow-circle-o-down":"\uf01a","fa-arrow-circle-o-left":"\uf190","fa-arrow-circle-o-right":"\uf18e","fa-arrow-circle-o-up":"\uf01b","fa-arrow-circle-right":"\uf0a9","fa-arrow-circle-up":"\uf0aa","fa-arrow-down":"\uf063","fa-arrow-left":"\uf060","fa-arrow-right":"\uf061","fa-arrow-up":"\uf062","fa-arrows":"\uf047","fa-arrows-alt":"\uf0b2","fa-arrows-h":"\uf07e","fa-arrows-v":"\uf07d","fa-asterisk":"\uf069","fa-at":"\uf1fa","fa-automobile":"\uf1b9","fa-backward":"\uf04a","fa-balance-scale":"\uf24e","fa-ban":"\uf05e","fa-bank":"\uf19c","fa-bar-chart":"\uf080","fa-bar-chart-o":"\uf080","fa-barcode":"\uf02a","fa-bars":"\uf0c9","fa-battery-0":"\uf244","fa-battery-1":"\uf243","fa-battery-2":"\uf242","fa-battery-3":"\uf241","fa-battery-4":"\uf240","fa-battery-empty":"\uf244","fa-battery-full":"\uf240","fa-battery-half":"\uf242","fa-battery-quarter":"\uf243","fa-battery-three-quarters":"\uf241","fa-bed":"\uf236","fa-beer":"\uf0fc","fa-behance":"\uf1b4","fa-behance-square":"\uf1b5","fa-bell":"\uf0f3","fa-bell-o":"\uf0a2","fa-bell-slash":"\uf1f6","fa-bell-slash-o":"\uf1f7","fa-bicycle":"\uf206","fa-binoculars":"\uf1e5","fa-birthday-cake":"\uf1fd","fa-bitbucket":"\uf171","fa-bitbucket-square":"\uf172","fa-bitcoin":"\uf15a","fa-black-tie":"\uf27e","fa-bold":"\uf032","fa-bolt":"\uf0e7","fa-bomb":"\uf1e2","fa-book":"\uf02d","fa-bookmark":"\uf02e","fa-bookmark-o":"\uf097","fa-briefcase":"\uf0b1","fa-btc":"\uf15a","fa-bug":"\uf188","fa-building":"\uf1ad","fa-building-o":"\uf0f7","fa-bullhorn":"\uf0a1","fa-bullseye":"\uf140","fa-bus":"\uf207","fa-buysellads":"\uf20d","fa-cab":"\uf1ba","fa-calculator":"\uf1ec","fa-calendar":"\uf073","fa-calendar-check-o":"\uf274","fa-calendar-minus-o":"\uf272","fa-calendar-o":"\uf133","fa-calendar-plus-o":"\uf271","fa-calendar-times-o":"\uf273","fa-camera":"\uf030","fa-camera-retro":"\uf083","fa-car":"\uf1b9","fa-caret-down":"\uf0d7","fa-caret-left":"\uf0d9","fa-caret-right":"\uf0da","fa-caret-square-o-down":"\uf150","fa-caret-square-o-left":"\uf191","fa-caret-square-o-right":"\uf152","fa-caret-square-o-up":"\uf151","fa-caret-up":"\uf0d8","fa-cart-arrow-down":"\uf218","fa-cart-plus":"\uf217","fa-cc":"\uf20a","fa-cc-amex":"\uf1f3","fa-cc-diners-club":"\uf24c","fa-cc-discover":"\uf1f2","fa-cc-jcb":"\uf24b","fa-cc-mastercard":"\uf1f1","fa-cc-paypal":"\uf1f4","fa-cc-stripe":"\uf1f5","fa-cc-visa":"\uf1f0","fa-certificate":"\uf0a3","fa-chain":"\uf0c1","fa-chain-broken":"\uf127","fa-check":"\uf00c","fa-check-circle":"\uf058","fa-check-circle-o":"\uf05d","fa-check-square":"\uf14a","fa-check-square-o":"\uf046","fa-chevron-circle-down":"\uf13a","fa-chevron-circle-left":"\uf137","fa-chevron-circle-right":"\uf138","fa-chevron-circle-up":"\uf139","fa-chevron-down":"\uf078","fa-chevron-left":"\uf053","fa-chevron-right":"\uf054","fa-chevron-up":"\uf077","fa-child":"\uf1ae","fa-chrome":"\uf268","fa-circle":"\uf111","fa-circle-o":"\uf10c","fa-circle-o-notch":"\uf1ce","fa-circle-thin":"\uf1db","fa-clipboard":"\uf0ea","fa-clock-o":"\uf017","fa-clone":"\uf24d","fa-close":"\uf00d","fa-cloud":"\uf0c2","fa-cloud-download":"\uf0ed","fa-cloud-upload":"\uf0ee","fa-cny":"\uf157","fa-code":"\uf121","fa-code-fork":"\uf126","fa-codepen":"\uf1cb","fa-coffee":"\uf0f4","fa-cog":"\uf013","fa-cogs":"\uf085","fa-columns":"\uf0db","fa-comment":"\uf075","fa-comment-o":"\uf0e5","fa-commenting":"\uf27a","fa-commenting-o":"\uf27b","fa-comments":"\uf086","fa-comments-o":"\uf0e6","fa-compass":"\uf14e","fa-compress":"\uf066","fa-connectdevelop":"\uf20e","fa-contao":"\uf26d","fa-copy":"\uf0c5","fa-copyright":"\uf1f9","fa-creative-commons":"\uf25e","fa-credit-card":"\uf09d","fa-crop":"\uf125","fa-crosshairs":"\uf05b","fa-css3":"\uf13c","fa-cube":"\uf1b2","fa-cubes":"\uf1b3","fa-cut":"\uf0c4","fa-cutlery":"\uf0f5","fa-dashboard":"\uf0e4","fa-dashcube":"\uf210","fa-database":"\uf1c0","fa-dedent":"\uf03b","fa-delicious":"\uf1a5","fa-desktop":"\uf108","fa-deviantart":"\uf1bd","fa-diamond":"\uf219","fa-digg":"\uf1a6","fa-dollar":"\uf155","fa-dot-circle-o":"\uf192","fa-download":"\uf019","fa-dribbble":"\uf17d","fa-dropbox":"\uf16b","fa-drupal":"\uf1a9","fa-edit":"\uf044","fa-eject":"\uf052","fa-ellipsis-h":"\uf141","fa-ellipsis-v":"\uf142","fa-empire":"\uf1d1","fa-envelope":"\uf0e0","fa-envelope-o":"\uf003","fa-envelope-square":"\uf199","fa-eraser":"\uf12d","fa-eur":"\uf153","fa-euro":"\uf153","fa-exchange":"\uf0ec","fa-exclamation":"\uf12a","fa-exclamation-circle":"\uf06a","fa-exclamation-triangle":"\uf071","fa-expand":"\uf065","fa-expeditedssl":"\uf23e","fa-external-link":"\uf08e","fa-external-link-square":"\uf14c","fa-eye":"\uf06e","fa-eye-slash":"\uf070","fa-eyedropper":"\uf1fb","fa-facebook":"\uf09a","fa-facebook-f":"\uf09a","fa-facebook-official":"\uf230","fa-facebook-square":"\uf082","fa-fast-backward":"\uf049","fa-fast-forward":"\uf050","fa-fax":"\uf1ac","fa-feed":"\uf09e","fa-female":"\uf182","fa-fighter-jet":"\uf0fb","fa-file":"\uf15b","fa-file-archive-o":"\uf1c6","fa-file-audio-o":"\uf1c7","fa-file-code-o":"\uf1c9","fa-file-excel-o":"\uf1c3","fa-file-image-o":"\uf1c5","fa-file-movie-o":"\uf1c8","fa-file-o":"\uf016","fa-file-pdf-o":"\uf1c1","fa-file-photo-o":"\uf1c5","fa-file-picture-o":"\uf1c5","fa-file-powerpoint-o":"\uf1c4","fa-file-sound-o":"\uf1c7","fa-file-text":"\uf15c","fa-file-text-o":"\uf0f6","fa-file-video-o":"\uf1c8","fa-file-word-o":"\uf1c2","fa-file-zip-o":"\uf1c6","fa-files-o":"\uf0c5","fa-film":"\uf008","fa-filter":"\uf0b0","fa-fire":"\uf06d","fa-fire-extinguisher":"\uf134","fa-firefox":"\uf269","fa-flag":"\uf024","fa-flag-checkered":"\uf11e","fa-flag-o":"\uf11d","fa-flash":"\uf0e7","fa-flask":"\uf0c3","fa-flickr":"\uf16e","fa-floppy-o":"\uf0c7","fa-folder":"\uf07b","fa-folder-o":"\uf114","fa-folder-open":"\uf07c","fa-folder-open-o":"\uf115","fa-font":"\uf031","fa-fonticons":"\uf280","fa-forumbee":"\uf211","fa-forward":"\uf04e","fa-foursquare":"\uf180","fa-frown-o":"\uf119","fa-futbol-o":"\uf1e3","fa-gamepad":"\uf11b","fa-gavel":"\uf0e3","fa-gbp":"\uf154","fa-ge":"\uf1d1","fa-gear":"\uf013","fa-gears":"\uf085","fa-genderless":"\uf22d","fa-get-pocket":"\uf265","fa-gg":"\uf260","fa-gg-circle":"\uf261","fa-gift":"\uf06b","fa-git":"\uf1d3","fa-git-square":"\uf1d2","fa-github":"\uf09b","fa-github-alt":"\uf113","fa-github-square":"\uf092","fa-gittip":"\uf184","fa-glass":"\uf000","fa-globe":"\uf0ac","fa-google":"\uf1a0","fa-google-plus":"\uf0d5","fa-google-plus-square":"\uf0d4","fa-google-wallet":"\uf1ee","fa-graduation-cap":"\uf19d","fa-gratipay":"\uf184","fa-group":"\uf0c0","fa-h-square":"\uf0fd","fa-hacker-news":"\uf1d4","fa-hand-grab-o":"\uf255","fa-hand-lizard-o":"\uf258","fa-hand-o-down":"\uf0a7","fa-hand-o-left":"\uf0a5","fa-hand-o-right":"\uf0a4","fa-hand-o-up":"\uf0a6","fa-hand-paper-o":"\uf256","fa-hand-peace-o":"\uf25b","fa-hand-pointer-o":"\uf25a","fa-hand-rock-o":"\uf255","fa-hand-scissors-o":"\uf257","fa-hand-spock-o":"\uf259","fa-hand-stop-o":"\uf256","fa-hdd-o":"\uf0a0","fa-header":"\uf1dc","fa-headphones":"\uf025","fa-heart":"\uf004","fa-heart-o":"\uf08a","fa-heartbeat":"\uf21e","fa-history":"\uf1da","fa-home":"\uf015","fa-hospital-o":"\uf0f8","fa-hotel":"\uf236","fa-hourglass":"\uf254","fa-hourglass-1":"\uf251","fa-hourglass-2":"\uf252","fa-hourglass-3":"\uf253","fa-hourglass-end":"\uf253","fa-hourglass-half":"\uf252","fa-hourglass-o":"\uf250","fa-hourglass-start":"\uf251","fa-houzz":"\uf27c","fa-html5":"\uf13b","fa-i-cursor":"\uf246","fa-ils":"\uf20b","fa-image":"\uf03e","fa-inbox":"\uf01c","fa-indent":"\uf03c","fa-industry":"\uf275","fa-info":"\uf129","fa-info-circle":"\uf05a","fa-inr":"\uf156","fa-instagram":"\uf16d","fa-institution":"\uf19c","fa-internet-explorer":"\uf26b","fa-intersex":"\uf224","fa-ioxhost":"\uf208","fa-italic":"\uf033","fa-joomla":"\uf1aa","fa-jpy":"\uf157","fa-jsfiddle":"\uf1cc","fa-key":"\uf084","fa-keyboard-o":"\uf11c","fa-krw":"\uf159","fa-language":"\uf1ab","fa-laptop":"\uf109","fa-lastfm":"\uf202","fa-lastfm-square":"\uf203","fa-leaf":"\uf06c","fa-leanpub":"\uf212","fa-legal":"\uf0e3","fa-lemon-o":"\uf094","fa-level-down":"\uf149","fa-level-up":"\uf148","fa-life-bouy":"\uf1cd","fa-life-buoy":"\uf1cd","fa-life-ring":"\uf1cd","fa-life-saver":"\uf1cd","fa-lightbulb-o":"\uf0eb","fa-line-chart":"\uf201","fa-link":"\uf0c1","fa-linkedin":"\uf0e1","fa-linkedin-square":"\uf08c","fa-linux":"\uf17c","fa-list":"\uf03a","fa-list-alt":"\uf022","fa-list-ol":"\uf0cb","fa-list-ul":"\uf0ca","fa-location-arrow":"\uf124","fa-lock":"\uf023","fa-long-arrow-down":"\uf175","fa-long-arrow-left":"\uf177","fa-long-arrow-right":"\uf178","fa-long-arrow-up":"\uf176","fa-magic":"\uf0d0","fa-magnet":"\uf076","fa-mail-forward":"\uf064","fa-mail-reply":"\uf112","fa-mail-reply-all":"\uf122","fa-male":"\uf183","fa-map":"\uf279","fa-map-marker":"\uf041","fa-map-o":"\uf278","fa-map-pin":"\uf276","fa-map-signs":"\uf277","fa-mars":"\uf222","fa-mars-double":"\uf227","fa-mars-stroke":"\uf229","fa-mars-stroke-h":"\uf22b","fa-mars-stroke-v":"\uf22a","fa-maxcdn":"\uf136","fa-meanpath":"\uf20c","fa-medium":"\uf23a","fa-medkit":"\uf0fa","fa-meh-o":"\uf11a","fa-mercury":"\uf223","fa-microphone":"\uf130","fa-microphone-slash":"\uf131","fa-minus":"\uf068","fa-minus-circle":"\uf056","fa-minus-square":"\uf146","fa-minus-square-o":"\uf147","fa-mobile":"\uf10b","fa-mobile-phone":"\uf10b","fa-money":"\uf0d6","fa-moon-o":"\uf186","fa-mortar-board":"\uf19d","fa-motorcycle":"\uf21c","fa-mouse-pointer":"\uf245","fa-music":"\uf001","fa-navicon":"\uf0c9","fa-neuter":"\uf22c","fa-newspaper-o":"\uf1ea","fa-object-group":"\uf247","fa-object-ungroup":"\uf248","fa-odnoklassniki":"\uf263","fa-odnoklassniki-square":"\uf264","fa-opencart":"\uf23d","fa-openid":"\uf19b","fa-opera":"\uf26a","fa-optin-monster":"\uf23c","fa-outdent":"\uf03b","fa-pagelines":"\uf18c","fa-paint-brush":"\uf1fc","fa-paper-plane":"\uf1d8","fa-paper-plane-o":"\uf1d9","fa-paperclip":"\uf0c6","fa-paragraph":"\uf1dd","fa-paste":"\uf0ea","fa-pause":"\uf04c","fa-paw":"\uf1b0","fa-paypal":"\uf1ed","fa-pencil":"\uf040","fa-pencil-square":"\uf14b","fa-pencil-square-o":"\uf044","fa-phone":"\uf095","fa-phone-square":"\uf098","fa-photo":"\uf03e","fa-picture-o":"\uf03e","fa-pie-chart":"\uf200","fa-pied-piper":"\uf1a7","fa-pied-piper-alt":"\uf1a8","fa-pinterest":"\uf0d2","fa-pinterest-p":"\uf231","fa-pinterest-square":"\uf0d3","fa-plane":"\uf072","fa-play":"\uf04b","fa-play-circle":"\uf144","fa-play-circle-o":"\uf01d","fa-plug":"\uf1e6","fa-plus":"\uf067","fa-plus-circle":"\uf055","fa-plus-square":"\uf0fe","fa-plus-square-o":"\uf196","fa-power-off":"\uf011","fa-print":"\uf02f","fa-puzzle-piece":"\uf12e","fa-qq":"\uf1d6","fa-qrcode":"\uf029","fa-question":"\uf128","fa-question-circle":"\uf059","fa-quote-left":"\uf10d","fa-quote-right":"\uf10e","fa-ra":"\uf1d0","fa-random":"\uf074","fa-rebel":"\uf1d0","fa-recycle":"\uf1b8","fa-reddit":"\uf1a1","fa-reddit-square":"\uf1a2","fa-refresh":"\uf021","fa-registered":"\uf25d","fa-remove":"\uf00d","fa-renren":"\uf18b","fa-reorder":"\uf0c9","fa-repeat":"\uf01e","fa-reply":"\uf112","fa-reply-all":"\uf122","fa-retweet":"\uf079","fa-rmb":"\uf157","fa-road":"\uf018","fa-rocket":"\uf135","fa-rotate-left":"\uf0e2","fa-rotate-right":"\uf01e","fa-rouble":"\uf158","fa-rss":"\uf09e","fa-rss-square":"\uf143","fa-rub":"\uf158","fa-ruble":"\uf158","fa-rupee":"\uf156","fa-safari":"\uf267","fa-save":"\uf0c7","fa-scissors":"\uf0c4","fa-search":"\uf002","fa-search-minus":"\uf010","fa-search-plus":"\uf00e","fa-sellsy":"\uf213","fa-send":"\uf1d8","fa-send-o":"\uf1d9","fa-server":"\uf233","fa-share":"\uf064","fa-share-alt":"\uf1e0","fa-share-alt-square":"\uf1e1","fa-share-square":"\uf14d","fa-share-square-o":"\uf045","fa-shekel":"\uf20b","fa-sheqel":"\uf20b","fa-shield":"\uf132","fa-ship":"\uf21a","fa-shirtsinbulk":"\uf214","fa-shopping-cart":"\uf07a","fa-sign-in":"\uf090","fa-sign-out":"\uf08b","fa-signal":"\uf012","fa-simplybuilt":"\uf215","fa-sitemap":"\uf0e8","fa-skyatlas":"\uf216","fa-skype":"\uf17e","fa-slack":"\uf198","fa-sliders":"\uf1de","fa-slideshare":"\uf1e7","fa-smile-o":"\uf118","fa-soccer-ball-o":"\uf1e3","fa-sort":"\uf0dc","fa-sort-alpha-asc":"\uf15d","fa-sort-alpha-desc":"\uf15e","fa-sort-amount-asc":"\uf160","fa-sort-amount-desc":"\uf161","fa-sort-asc":"\uf0de","fa-sort-desc":"\uf0dd","fa-sort-down":"\uf0dd","fa-sort-numeric-asc":"\uf162","fa-sort-numeric-desc":"\uf163","fa-sort-up":"\uf0de","fa-soundcloud":"\uf1be","fa-space-shuttle":"\uf197","fa-spinner":"\uf110","fa-spoon":"\uf1b1","fa-spotify":"\uf1bc","fa-square":"\uf0c8","fa-square-o":"\uf096","fa-stack-exchange":"\uf18d","fa-stack-overflow":"\uf16c","fa-star":"\uf005","fa-star-half":"\uf089","fa-star-half-empty":"\uf123","fa-star-half-full":"\uf123","fa-star-half-o":"\uf123","fa-star-o":"\uf006","fa-steam":"\uf1b6","fa-steam-square":"\uf1b7","fa-step-backward":"\uf048","fa-step-forward":"\uf051","fa-stethoscope":"\uf0f1","fa-sticky-note":"\uf249","fa-sticky-note-o":"\uf24a","fa-stop":"\uf04d","fa-street-view":"\uf21d","fa-strikethrough":"\uf0cc","fa-stumbleupon":"\uf1a4","fa-stumbleupon-circle":"\uf1a3","fa-subscript":"\uf12c","fa-subway":"\uf239","fa-suitcase":"\uf0f2","fa-sun-o":"\uf185","fa-superscript":"\uf12b","fa-support":"\uf1cd","fa-table":"\uf0ce","fa-tablet":"\uf10a","fa-tachometer":"\uf0e4","fa-tag":"\uf02b","fa-tags":"\uf02c","fa-tasks":"\uf0ae","fa-taxi":"\uf1ba","fa-television":"\uf26c","fa-tencent-weibo":"\uf1d5","fa-terminal":"\uf120","fa-text-height":"\uf034","fa-text-width":"\uf035","fa-th":"\uf00a","fa-th-large":"\uf009","fa-th-list":"\uf00b","fa-thumb-tack":"\uf08d","fa-thumbs-down":"\uf165","fa-thumbs-o-down":"\uf088","fa-thumbs-o-up":"\uf087","fa-thumbs-up":"\uf164","fa-ticket":"\uf145","fa-times":"\uf00d","fa-times-circle":"\uf057","fa-times-circle-o":"\uf05c","fa-tint":"\uf043","fa-toggle-down":"\uf150","fa-toggle-left":"\uf191","fa-toggle-off":"\uf204","fa-toggle-on":"\uf205","fa-toggle-right":"\uf152","fa-toggle-up":"\uf151","fa-trademark":"\uf25c","fa-train":"\uf238","fa-transgender":"\uf224","fa-transgender-alt":"\uf225","fa-trash":"\uf1f8","fa-trash-o":"\uf014","fa-tree":"\uf1bb","fa-trello":"\uf181","fa-tripadvisor":"\uf262","fa-trophy":"\uf091","fa-truck":"\uf0d1","fa-try":"\uf195","fa-tty":"\uf1e4","fa-tumblr":"\uf173","fa-tumblr-square":"\uf174","fa-turkish-lira":"\uf195","fa-tv":"\uf26c","fa-twitch":"\uf1e8","fa-twitter":"\uf099","fa-twitter-square":"\uf081","fa-umbrella":"\uf0e9","fa-underline":"\uf0cd","fa-undo":"\uf0e2","fa-university":"\uf19c","fa-unlink":"\uf127","fa-unlock":"\uf09c","fa-unlock-alt":"\uf13e","fa-unsorted":"\uf0dc","fa-upload":"\uf093","fa-usd":"\uf155","fa-user":"\uf007","fa-user-md":"\uf0f0","fa-user-plus":"\uf234","fa-user-secret":"\uf21b","fa-user-times":"\uf235","fa-users":"\uf0c0","fa-venus":"\uf221","fa-venus-double":"\uf226","fa-venus-mars":"\uf228","fa-viacoin":"\uf237","fa-video-camera":"\uf03d","fa-vimeo":"\uf27d","fa-vimeo-square":"\uf194","fa-vine":"\uf1ca","fa-vk":"\uf189","fa-volume-down":"\uf027","fa-volume-off":"\uf026","fa-volume-up":"\uf028","fa-warning":"\uf071","fa-wechat":"\uf1d7","fa-weibo":"\uf18a","fa-weixin":"\uf1d7","fa-whatsapp":"\uf232","fa-wheelchair":"\uf193","fa-wifi":"\uf1eb","fa-wikipedia-w":"\uf266","fa-windows":"\uf17a","fa-won":"\uf159","fa-wordpress":"\uf19a","fa-wrench":"\uf0ad","fa-xing":"\uf168","fa-xing-square":"\uf169","fa-y-combinator":"\uf23b","fa-y-combinator-square":"\uf1d4","fa-yahoo":"\uf19e","fa-yc":"\uf23b","fa-yc-square":"\uf1d4","fa-yelp":"\uf1e9","fa-yen":"\uf157","fa-youtube":"\uf167","fa-youtube-play":"\uf16a","fa-youtube-square":"\uf166"};
			var FONT_OPENAUTOMATION = {"oa-weather_winter":"\ue600","oa-weather_wind_speed":"\ue601","oa-weather_wind_directions_w":"\ue602","oa-weather_wind_directions_sw":"\ue603","oa-weather_wind_directions_se":"\ue604","oa-weather_wind_directions_s":"\ue605","oa-weather_wind_directions_nw":"\ue606","oa-weather_wind_directions_ne":"\ue607","oa-weather_wind_directions_n":"\ue608","oa-weather_wind_directions_e":"\ue609","oa-weather_wind":"\ue60a","oa-weather_thunderstorm":"\ue60b","oa-weather_sunset":"\ue60c","oa-weather_sunrise":"\ue60d","oa-weather_sun":"\ue60e","oa-weather_summer":"\ue60f","oa-weather_storm":"\ue610","oa-weather_station_quadra":"\ue611","oa-weather_station":"\ue612","oa-weather_snow_light":"\ue613","oa-weather_snow_heavy":"\ue614","oa-weather_snow":"\ue615","oa-weather_rain_meter":"\ue616","oa-weather_rain_light":"\ue617","oa-weather_rain_heavy":"\ue618","oa-weather_rain_gauge":"\ue619","oa-weather_rain":"\ue61a","oa-weather_pollen":"\ue61b","oa-weather_moonset":"\ue61c","oa-weather_moonrise":"\ue61d","oa-weather_moon_phases_8":"\ue61e","oa-weather_moon_phases_7_half":"\ue61f","oa-weather_moon_phases_6":"\ue620","oa-weather_moon_phases_5_full":"\ue621","oa-weather_moon_phases_4":"\ue622","oa-weather_moon_phases_3_half":"\ue623","oa-weather_moon_phases_2":"\ue624","oa-weather_moon_phases_1_new":"\ue625","oa-weather_light_meter":"\ue626","oa-weather_humidity":"\ue627","oa-weather_frost":"\ue628","oa-weather_directions":"\ue629","oa-weather_cloudy_light":"\ue62a","oa-weather_cloudy_heavy":"\ue62b","oa-weather_cloudy":"\ue62c","oa-weather_barometric_pressure":"\ue62d","oa-weather_baraometric_pressure":"\ue62e","oa-vent_ventilation_level_manual_m":"\ue62f","oa-vent_ventilation_level_automatic":"\ue630","oa-vent_ventilation_level_3":"\ue631","oa-vent_ventilation_level_2":"\ue632","oa-vent_ventilation_level_1":"\ue633","oa-vent_ventilation_level_0":"\ue634","oa-vent_ventilation_control":"\ue635","oa-vent_ventilation":"\ue636","oa-vent_used_air":"\ue637","oa-vent_supply_air":"\ue638","oa-vent_exhaust_air":"\ue639","oa-vent_bypass":"\ue63a","oa-vent_ambient_air":"\ue63b","oa-user_ext_away":"\ue63c","oa-user_away":"\ue63d","oa-user_available":"\ue63e","oa-time_timer":"\ue63f","oa-time_statistic":"\ue640","oa-time_note":"\ue641","oa-time_manual_mode":"\ue642","oa-time_graph":"\ue643","oa-time_eco_mode":"\ue644","oa-time_clock":"\ue645","oa-time_calendar":"\ue646","oa-time_automatic":"\ue647","oa-text_min":"\ue648","oa-text_max":"\ue649","oa-temp_windchill":"\ue64a","oa-temp_temperature_min":"\ue64b","oa-temp_temperature_max":"\ue64c","oa-temp_temperature":"\ue64d","oa-temp_outside":"\ue64e","oa-temp_inside":"\ue64f","oa-temp_frost":"\ue650","oa-temp_control":"\ue651","oa-status_standby":"\ue652","oa-status_open":"\ue653","oa-status_night":"\ue654","oa-status_locked":"\ue655","oa-status_frost":"\ue656","oa-status_comfort":"\ue657","oa-status_away_2":"\ue658","oa-status_away_1":"\ue659","oa-status_available":"\ue65a","oa-status_automatic":"\ue65b","oa-secur_smoke_detector":"\ue65c","oa-secur_open":"\ue65d","oa-secur_locked":"\ue65e","oa-secur_heat_protection":"\ue65f","oa-secur_frost_protection":"\ue660","oa-secur_encoding":"\ue661","oa-secur_alarm":"\ue662","oa-scene_x-mas":"\ue663","oa-scene_workshop":"\ue664","oa-scene_wine_cellar":"\ue665","oa-scene_washing_machine":"\ue666","oa-scene_visit_guests":"\ue667","oa-scene_toilet_alternat":"\ue668","oa-scene_toilet":"\ue669","oa-scene_terrace":"\ue66a","oa-scene_swimming":"\ue66b","oa-scene_summerhouse":"\ue66c","oa-scene_stove":"\ue66d","oa-scene_storeroom":"\ue66e","oa-scene_stairs":"\ue66f","oa-scene_sleeping_alternat":"\ue670","oa-scene_sleeping":"\ue671","oa-scene_shower":"\ue672","oa-scene_scene":"\ue673","oa-scene_sauna":"\ue674","oa-scene_robo_lawnmower":"\ue675","oa-scene_pool":"\ue676","oa-scene_party":"\ue677","oa-scene_office":"\ue678","oa-scene_night":"\ue679","oa-scene_microwave_oven":"\ue67a","oa-scene_making_love_clean":"\ue67b","oa-scene_making_love":"\ue67c","oa-scene_livingroom":"\ue67d","oa-scene_laundry_room_fem":"\ue67e","oa-scene_laundry_room":"\ue67f","oa-scene_keyboard":"\ue680","oa-scene_hall":"\ue681","oa-scene_garden":"\ue682","oa-scene_gaming":"\ue683","oa-scene_fitness":"\ue684","oa-scene_dressing_room":"\ue685","oa-scene_dishwasher":"\ue686","oa-scene_dinner":"\ue687","oa-scene_day":"\ue688","oa-scene_cubby":"\ue689","oa-scene_cooking":"\ue68a","oa-scene_cockle_stove":"\ue68b","oa-scene_clothes_dryer":"\ue68c","oa-scene_cleaning":"\ue68d","oa-scene_cinema":"\ue68e","oa-scene_childs_room":"\ue68f","oa-scene_bathroom":"\ue690","oa-scene_bath":"\ue691","oa-scene_baking_oven":"\ue692","oa-scene_baby":"\ue693","oa-sani_water_tap":"\ue694","oa-sani_water_hot":"\ue695","oa-sani_water_cold":"\ue696","oa-sani_supply_temp":"\ue697","oa-sani_sprinkling":"\ue698","oa-sani_solar_temp":"\ue699","oa-sani_solar":"\ue69a","oa-sani_return_temp":"\ue69b","oa-sani_pump":"\ue69c","oa-sani_irrigation":"\ue69d","oa-sani_heating_temp":"\ue69e","oa-sani_heating_manual":"\ue69f","oa-sani_heating_automatic":"\ue6a0","oa-sani_heating":"\ue6a1","oa-sani_garden_pump":"\ue6a2","oa-sani_floor_heating":"\ue6a3","oa-sani_earth_source_heat_pump":"\ue6a4","oa-sani_domestic_waterworks":"\ue6a5","oa-sani_buffer_temp_up":"\ue6a6","oa-sani_buffer_temp_down":"\ue6a7","oa-sani_buffer_temp_all":"\ue6a8","oa-sani_boiler_temp":"\ue6a9","oa-phone_ring_out":"\ue6aa","oa-phone_ring_in":"\ue6ab","oa-phone_ring":"\ue6ac","oa-phone_missed_out":"\ue6ad","oa-phone_missed_in":"\ue6ae","oa-phone_dial":"\ue6af","oa-phone_call_out":"\ue6b0","oa-phone_call_in":"\ue6b1","oa-phone_call_end_out":"\ue6b2","oa-phone_call_end_in":"\ue6b3","oa-phone_call_end":"\ue6b4","oa-phone_call":"\ue6b5","oa-phone_answersing":"\ue6b6","oa-message_tendency_upward":"\ue6b7","oa-message_tendency_steady":"\ue6b8","oa-message_tendency_downward":"\ue6b9","oa-message_socket_on_off":"\ue6ba","oa-message_socket_ch_3":"\ue6bb","oa-message_socket_ch":"\ue6bc","oa-message_socket":"\ue6bd","oa-message_service":"\ue6be","oa-message_presence_disabled":"\ue6bf","oa-message_presence":"\ue6c0","oa-message_ok":"\ue6c1","oa-message_medicine":"\ue6c2","oa-message_mail_open":"\ue6c3","oa-message_mail":"\ue6c4","oa-message_light_intensity":"\ue6c5","oa-message_garbage":"\ue6c6","oa-message_attention":"\ue6c7","oa-measure_water_meter":"\ue6c8","oa-measure_voltage":"\ue6c9","oa-measure_power_meter":"\ue6ca","oa-measure_power":"\ue6cb","oa-measure_photovoltaic_inst":"\ue6cc","oa-measure_current":"\ue6cd","oa-measure_battery_100":"\ue6ce","oa-measure_battery_75":"\ue6cf","oa-measure_battery_50":"\ue6d0","oa-measure_battery_25":"\ue6d1","oa-measure_battery_0":"\ue6d2","oa-light_wire_system_2":"\ue6d3","oa-light_wire_system_1":"\ue6d4","oa-light_wall_3":"\ue6d5","oa-light_wall_2":"\ue6d6","oa-light_wall_1":"\ue6d7","oa-light_uplight":"\ue6d8","oa-light_stairs":"\ue6d9","oa-light_pendant_light_round":"\ue6da","oa-light_pendant_light":"\ue6db","oa-light_party":"\ue6dc","oa-light_outdoor":"\ue6dd","oa-light_office_desk":"\ue6de","oa-light_office":"\ue6df","oa-light_mirror":"\ue6e0","oa-light_light_dim_100":"\ue6e1","oa-light_light_dim_90":"\ue6e2","oa-light_light_dim_80":"\ue6e3","oa-light_light_dim_70":"\ue6e4","oa-light_light_dim_60":"\ue6e5","oa-light_light_dim_50":"\ue6e6","oa-light_light_dim_40":"\ue6e7","oa-light_light_dim_30":"\ue6e8","oa-light_light_dim_20":"\ue6e9","oa-light_light_dim_10":"\ue6ea","oa-light_light_dim_00":"\ue6eb","oa-light_light":"\ue6ec","oa-light_led_stripe_rgb":"\ue6ed","oa-light_led_stripe":"\ue6ee","oa-light_led":"\ue6ef","oa-light_floor_lamp":"\ue6f0","oa-light_fairy_lights":"\ue6f1","oa-light_downlight":"\ue6f2","oa-light_dinner_table":"\ue6f3","oa-light_diffused":"\ue6f4","oa-light_control":"\ue6f5","oa-light_ceiling_light":"\ue6f6","oa-light_cabinet":"\ue6f7","oa-it_wireless_dcf77":"\ue6f8","oa-it_wifi":"\ue6f9","oa-it_television":"\ue6fa","oa-it_telephone":"\ue6fb","oa-it_smartphone":"\ue6fc","oa-it_server":"\ue6fd","oa-it_satellite_dish_heating":"\ue6fe","oa-it_satellite_dish":"\ue6ff","oa-it_router":"\ue700","oa-it_remote":"\ue701","oa-it_radio":"\ue702","oa-it_pc":"\ue703","oa-it_network":"\ue704","oa-it_net":"\ue705","oa-it_nas":"\ue706","oa-it_internet":"\ue707","oa-it_fax":"\ue708","oa-it_camera":"\ue709","oa-fts_window_roof_shutter":"\ue70a","oa-fts_window_roof_open_2":"\ue70b","oa-fts_window_roof_open_1":"\ue70c","oa-fts_window_roof":"\ue70d","oa-fts_window_louvre_open":"\ue70e","oa-fts_window_louvre":"\ue70f","oa-fts_window_2w_tilt_r":"\ue710","oa-fts_window_2w_tilt_lr":"\ue711","oa-fts_window_2w_tilt_l_open_r":"\ue712","oa-fts_window_2w_tilt_l":"\ue713","oa-fts_window_2w_tilt":"\ue714","oa-fts_window_2w_open_r":"\ue715","oa-fts_window_2w_open_lr":"\ue716","oa-fts_window_2w_open_l_tilt_r":"\ue717","oa-fts_window_2w_open_l":"\ue718","oa-fts_window_2w_open":"\ue719","oa-fts_window_2w":"\ue71a","oa-fts_window_1w_tilt":"\ue71b","oa-fts_window_1w_open":"\ue71c","oa-fts_window_1w":"\ue71d","oa-fts_sunblind":"\ue71e","oa-fts_sliding_gate":"\ue71f","oa-fts_shutter_up":"\ue720","oa-fts_shutter_manual":"\ue721","oa-fts_shutter_down":"\ue722","oa-fts_shutter_automatic":"\ue723","oa-fts_shutter_100":"\ue724","oa-fts_shutter_90":"\ue725","oa-fts_shutter_80":"\ue726","oa-fts_shutter_70":"\ue727","oa-fts_shutter_60":"\ue728","oa-fts_shutter_50":"\ue729","oa-fts_shutter_40":"\ue72a","oa-fts_shutter_30":"\ue72b","oa-fts_shutter_20":"\ue72c","oa-fts_shutter_10":"\ue72d","oa-fts_shutter":"\ue72e","oa-fts_light_dome_open":"\ue72f","oa-fts_light_dome":"\ue730","oa-fts_garage_door_100":"\ue731","oa-fts_garage_door_90":"\ue732","oa-fts_garage_door_80":"\ue733","oa-fts_garage_door_70":"\ue734","oa-fts_garage_door_60":"\ue735","oa-fts_garage_door_50":"\ue736","oa-fts_garage_door_40":"\ue737","oa-fts_garage_door_30":"\ue738","oa-fts_garage_door_20":"\ue739","oa-fts_garage_door_10":"\ue73a","oa-fts_garage":"\ue73b","oa-fts_door_slide_open_m":"\ue73c","oa-fts_door_slide_open":"\ue73d","oa-fts_door_slide_m":"\ue73e","oa-fts_door_slide_2w_open_r":"\ue73f","oa-fts_door_slide_2w_open_lr":"\ue740","oa-fts_door_slide_2w_open_l":"\ue741","oa-fts_door_slide_2w":"\ue742","oa-fts_door_slide":"\ue743","oa-fts_door_open":"\ue744","oa-fts_door":"\ue745","oa-fts_blade_z_sun":"\ue746","oa-fts_blade_z":"\ue747","oa-fts_blade_s_sun":"\ue748","oa-fts_blade_s":"\ue749","oa-fts_blade_arc_sun":"\ue74a","oa-fts_blade_arc_close_100":"\ue74b","oa-fts_blade_arc_close_50":"\ue74c","oa-fts_blade_arc_close_00":"\ue74d","oa-fts_blade_arc":"\ue74e","oa-edit_sort":"\ue74f","oa-edit_settings":"\ue750","oa-edit_save":"\ue751","oa-edit_paste":"\ue752","oa-edit_open":"\ue753","oa-edit_expand":"\ue754","oa-edit_delete":"\ue755","oa-edit_cut":"\ue756","oa-edit_copy":"\ue757","oa-edit_collapse":"\ue758","oa-control_zoom_out":"\ue759","oa-control_zoom_in":"\ue75a","oa-control_x":"\ue75b","oa-control_standby":"\ue75c","oa-control_return":"\ue75d","oa-control_reboot":"\ue75e","oa-control_plus":"\ue75f","oa-control_outside_on_off":"\ue760","oa-control_on_off":"\ue761","oa-control_minus":"\ue762","oa-control_home":"\ue763","oa-control_centr_arrow_up_right":"\ue764","oa-control_centr_arrow_up_left":"\ue765","oa-control_centr_arrow_up":"\ue766","oa-control_centr_arrow_right":"\ue767","oa-control_centr_arrow_left":"\ue768","oa-control_centr_arrow_down_right":"\ue769","oa-control_centr_arrow_down_left":"\ue76a","oa-control_centr_arrow_down":"\ue76b","oa-control_building_s_og":"\ue76c","oa-control_building_s_kg":"\ue76d","oa-control_building_s_eg":"\ue76e","oa-control_building_s_dg":"\ue76f","oa-control_building_s_all":"\ue770","oa-control_building_outside":"\ue771","oa-control_building_og":"\ue772","oa-control_building_modern_s_okg_og":"\ue773","oa-control_building_modern_s_okg_eg":"\ue774","oa-control_building_modern_s_okg_dg":"\ue775","oa-control_building_modern_s_okg_all":"\ue776","oa-control_building_modern_s_og":"\ue777","oa-control_building_modern_s_kg":"\ue778","oa-control_building_modern_s_eg":"\ue779","oa-control_building_modern_s_dg":"\ue77a","oa-control_building_modern_s_all":"\ue77b","oa-control_building_modern_s_2og_og2":"\ue77c","oa-control_building_modern_s_2og_og1":"\ue77d","oa-control_building_modern_s_2og_kg":"\ue77e","oa-control_building_modern_s_2og_eg":"\ue77f","oa-control_building_modern_s_2og_dg":"\ue780","oa-control_building_modern_s_2og_all":"\ue781","oa-control_building_kg":"\ue782","oa-control_building_filled":"\ue783","oa-control_building_empty":"\ue784","oa-control_building_eg":"\ue785","oa-control_building_dg":"\ue786","oa-control_building_control":"\ue787","oa-control_building_all":"\ue788","oa-control_building_2_s_kg":"\ue789","oa-control_building_2_s_eg":"\ue78a","oa-control_building_2_s_dg":"\ue78b","oa-control_building_2_s_all":"\ue78c","oa-control_arrow_upward":"\ue78d","oa-control_arrow_up_right":"\ue78e","oa-control_arrow_up_left":"\ue78f","oa-control_arrow_up":"\ue790","oa-control_arrow_turn_right":"\ue791","oa-control_arrow_turn_left":"\ue792","oa-control_arrow_rightward":"\ue793","oa-control_arrow_right":"\ue794","oa-control_arrow_leftward":"\ue795","oa-control_arrow_left":"\ue796","oa-control_arrow_downward":"\ue797","oa-control_arrow_down_right":"\ue798","oa-control_arrow_down_left":"\ue799","oa-control_arrow_down":"\ue79a","oa-control_all_on_off":"\ue79b","oa-control_4":"\ue79c","oa-control_3":"\ue79d","oa-control_2":"\ue79e","oa-control_1":"\ue79f","oa-audio_volume_mute":"\ue7a0","oa-audio_volume_mid":"\ue7a1","oa-audio_volume_low":"\ue7a2","oa-audio_volume_high":"\ue7a3","oa-audio_stop":"\ue7a4","oa-audio_sound":"\ue7a5","oa-audio_shuffle":"\ue7a6","oa-audio_rew":"\ue7a7","oa-audio_repeat":"\ue7a8","oa-audio_rec":"\ue7a9","oa-audio_playlist":"\ue7aa","oa-audio_play":"\ue7ab","oa-audio_pause":"\ue7ac","oa-audio_mic_mute":"\ue7ad","oa-audio_mic":"\ue7ae","oa-audio_loudness":"\ue7af","oa-audio_headphone":"\ue7b0","oa-audio_ff":"\ue7b1","oa-audio_fade":"\ue7b2","oa-audio_eq":"\ue7b3","oa-audio_eject":"\ue7b4","oa-audio_audio":"\ue7b5"};
			var FONT_FHEMSVG = {"fs-user_unknown":"\ue600","fs-usb_stick":"\ue601","fs-usb":"\ue602","fs-unlock":"\ue603","fs-unknown":"\ue604","fs-temperature_humidity":"\ue605","fs-taster_ch6_6":"\ue606","fs-taster_ch6_5":"\ue607","fs-taster_ch6_4":"\ue608","fs-taster_ch6_3":"\ue609","fs-taster_ch6_2":"\ue60a","fs-taster_ch6_1":"\ue60b","fs-taster_ch_aus_rot .path1":"\ue60c","fs-taster_ch_aus_rot .path2":"\ue60d","fs-taster_ch_aus_rot .path3":"\ue60e","fs-taster_ch_aus_rot .path4":"\ue60f","fs-taster_ch_aus_rot .path5":"\ue610","fs-taster_ch_aus_rot .path6":"\ue611","fs-taster_ch_an_gruen .path1":"\ue612","fs-taster_ch_an_gruen .path2":"\ue613","fs-taster_ch_an_gruen .path3":"\ue614","fs-taster_ch_an_gruen .path4":"\ue615","fs-taster_ch_an_gruen .path5":"\ue616","fs-taster_ch_2":"\ue617","fs-taster_ch_1":"\ue618","fs-taster_ch":"\ue619","fs-taster":"\ue61a","fs-system_fhem_update":"\ue61b","fs-system_fhem_reboot":"\ue61c","fs-system_fhem":"\ue61d","fs-system_backup":"\ue61e","fs-socket_timer":"\ue61f","fs-security_password":"\ue620","fs-security":"\ue621","fs-sdcard":"\ue622","fs-scc_868":"\ue623","fs-sani_heating_timer":"\ue624","fs-sani_heating_level_100":"\ue625","fs-sani_heating_level_90":"\ue626","fs-sani_heating_level_80":"\ue627","fs-sani_heating_level_70":"\ue628","fs-sani_heating_level_60":"\ue629","fs-sani_heating_level_50":"\ue62a","fs-sani_heating_level_40":"\ue62b","fs-sani_heating_level_30":"\ue62c","fs-sani_heating_level_20":"\ue62d","fs-sani_heating_level_10":"\ue62e","fs-sani_heating_level_0":"\ue62f","fs-sani_heating_calendar":"\ue630","fs-sani_heating_boost":"\ue631","fs-sani_floor_heating_off":"\ue632","fs-sani_floor_heating_neutral":"\ue633","fs-RPi .path1":"\ue634","fs-RPi .path2":"\ue635","fs-RPi .path3":"\ue636","fs-RPi .path4":"\ue637","fs-RPi .path5":"\ue638","fs-RPi .path6":"\ue639","fs-RPi .path7":"\ue63a","fs-RPi .path8":"\ue63b","fs-RPi .path9":"\ue63c","fs-RPi .path10":"\ue63d","fs-RPi .path11":"\ue63e","fs-RPi .path12":"\ue63f","fs-RPi .path13":"\ue640","fs-RPi .path14":"\ue641","fs-RPi .path15":"\ue642","fs-RPi .path16":"\ue643","fs-RPi .path17":"\ue644","fs-RPi .path18":"\ue645","fs-RPi .path19":"\ue646","fs-RPi .path20":"\ue647","fs-RPi .path21":"\ue648","fs-remote_control":"\ue649","fs-refresh":"\ue64a","fs-recycling":"\ue64b","fs-rc_YELLOW .path1":"\ue64c","fs-rc_YELLOW .path2":"\ue64d","fs-rc_WEB":"\ue64e","fs-rc_VOLUP":"\ue64f","fs-rc_VOLPLUS":"\ue650","fs-rc_VOLMINUS":"\ue651","fs-rc_VOLDOWN":"\ue652","fs-rc_VIDEO":"\ue653","fs-rc_USB":"\ue654","fs-rc_UP":"\ue655","fs-rc_TVstop":"\ue656","fs-rc_TV":"\ue657","fs-rc_TEXT":"\ue658","fs-rc_templatebutton":"\ue659","fs-rc_SUB":"\ue65a","fs-rc_STOP":"\ue65b","fs-rc_SHUFFLE":"\ue65c","fs-rc_SETUP":"\ue65d","fs-rc_SEARCH":"\ue65e","fs-rc_RIGHT":"\ue65f","fs-rc_REWred":"\ue660","fs-rc_REW":"\ue661","fs-rc_REPEAT":"\ue662","fs-rc_RED .path1":"\ue663","fs-rc_RED .path2":"\ue664","fs-rc_REC .path1":"\ue665","fs-rc_REC .path2":"\ue666","fs-rc_RADIOred":"\ue667","fs-rc_RADIO":"\ue668","fs-rc_PREVIOUS":"\ue669","fs-rc_POWER":"\ue66a","fs-rc_PLUS":"\ue66b","fs-rc_PLAYgreen":"\ue66c","fs-rc_PLAY":"\ue66d","fs-rc_PAUSEyellow":"\ue66e","fs-rc_PAUSE":"\ue66f","fs-rc_OPTIONS":"\ue670","fs-rc_OK":"\ue671","fs-rc_NEXT":"\ue672","fs-rc_MUTE":"\ue673","fs-rc_MINUS":"\ue674","fs-rc_MENU":"\ue675","fs-rc_MEDIAMENU":"\ue676","fs-rc_LEFT":"\ue677","fs-rc_INFO":"\ue678","fs-rc_HOME":"\ue679","fs-rc_HELP":"\ue67a","fs-rc_HDMI":"\ue67b","fs-rc_GREEN .path1":"\ue67c","fs-rc_GREEN .path2":"\ue67d","fs-rc_FFblue":"\ue67e","fs-rc_FF":"\ue67f","fs-rc_EXIT":"\ue680","fs-rc_EPG":"\ue681","fs-rc_EJECT":"\ue682","fs-rc_DOWN":"\ue683","fs-rc_dot":"\ue684","fs-rc_BLUE .path1":"\ue685","fs-rc_BLUE .path2":"\ue686","fs-rc_BLANK":"\ue687","fs-rc_BACK":"\ue688","fs-rc_AV":"\ue689","fs-rc_AUDIO":"\ue68a","fs-rc_9":"\ue68b","fs-rc_8":"\ue68c","fs-rc_7":"\ue68d","fs-rc_6":"\ue68e","fs-rc_5":"\ue68f","fs-rc_4":"\ue690","fs-rc_3":"\ue691","fs-rc_2":"\ue692","fs-rc_1":"\ue693","fs-rc_0":"\ue694","fs-people_sensor":"\ue695","fs-outside_socket":"\ue696","fs-motion_detector":"\ue697","fs-message_socket_unknown":"\ue698","fs-message_socket_on2":"\ue699","fs-message_socket_off2":"\ue69a","fs-message_socket_off":"\ue69b","fs-message_socket_enabled":"\ue69c","fs-message_socket_disabled":"\ue69d","fs-max_wandthermostat":"\ue69e","fs-max_heizungsthermostat":"\ue69f","fs-lock":"\ue6a0","fs-light_toggle":"\ue6a1","fs-light_question .path1":"\ue6a2","fs-light_question .path2":"\ue6a3","fs-light_question .path3":"\ue6a4","fs-light_question .path4":"\ue6a5","fs-light_question .path5":"\ue6a6","fs-light_question .path6":"\ue6a7","fs-light_outdoor":"\ue6a8","fs-light_on-for-timer":"\ue6a9","fs-light_off-for-timer":"\ue6aa","fs-light_exclamation .path1":"\ue6ab","fs-light_exclamation .path2":"\ue6ac","fs-light_exclamation .path3":"\ue6ad","fs-light_exclamation .path4":"\ue6ae","fs-light_exclamation .path5":"\ue6af","fs-light_exclamation .path6":"\ue6b0","fs-light_dim_up":"\ue6b1","fs-light_dim_down":"\ue6b2","fs-light_ceiling_off":"\ue6b3","fs-light_ceiling":"\ue6b4","fs-lan_rs485":"\ue6b5","fs-it_remote_folder .path1":"\ue6b6","fs-it_remote_folder .path2":"\ue6b7","fs-it_remote_folder .path3":"\ue6b8","fs-it_remote_folder .path4":"\ue6b9","fs-it_remote_folder .path5":"\ue6ba","fs-it_remote_folder .path6":"\ue6bb","fs-it_remote_folder .path7":"\ue6bc","fs-it_remote_folder .path8":"\ue6bd","fs-it_remote_folder .path9":"\ue6be","fs-it_remote_folder .path10":"\ue6bf","fs-it_remote_folder .path11":"\ue6c0","fs-it_remote_folder .path12":"\ue6c1","fs-it_remote_folder .path13":"\ue6c2","fs-it_remote_folder .path14":"\ue6c3","fs-it_remote_folder .path15":"\ue6c4","fs-it_remote_folder .path16":"\ue6c5","fs-it_remote_folder .path17":"\ue6c6","fs-it_remote_folder .path18":"\ue6c7","fs-it_remote_folder .path19":"\ue6c8","fs-it_remote_folder .path20":"\ue6c9","fs-it_remote_folder .path21":"\ue6ca","fs-it_i-net":"\ue6cb","fs-it_hue_bridge .path1":"\ue6cc","fs-it_hue_bridge .path2":"\ue6cd","fs-it_hue_bridge .path3":"\ue6ce","fs-it_hue_bridge .path4":"\ue6cf","fs-it_hue_bridge .path5":"\ue6d0","fs-it_hue_bridge .path6":"\ue6d1","fs-it_hue_bridge .path7":"\ue6d2","fs-it_hue_bridge .path8":"\ue6d3","fs-it_hue_bridge .path9":"\ue6d4","fs-it_hue_bridge .path10":"\ue6d5","fs-it_hue_bridge .path11":"\ue6d6","fs-it_hue_bridge .path12":"\ue6d7","fs-it_hue_bridge .path13":"\ue6d8","fs-it_hue_bridge .path14":"\ue6d9","fs-it_hue_bridge .path15":"\ue6da","fs-it_hue_bridge .path16":"\ue6db","fs-it_hue_bridge .path17":"\ue6dc","fs-it_hue_bridge .path18":"\ue6dd","fs-it_hue_bridge .path19":"\ue6de","fs-it_hue_bridge .path20":"\ue6df","fs-it_hue_bridge .path21":"\ue6e0","fs-it_hue_bridge .path22":"\ue6e1","fs-it_hue_bridge .path23":"\ue6e2","fs-IR":"\ue6e3","fs-Icon_Fisch":"\ue6e4","fs-humidity":"\ue6e5","fs-hue_bridge .path1":"\ue6e6","fs-hue_bridge .path2":"\ue6e7","fs-hue_bridge .path3":"\ue6e8","fs-hue_bridge .path4":"\ue6e9","fs-hue_bridge .path5":"\ue6ea","fs-hue_bridge .path6":"\ue6eb","fs-hue_bridge .path7":"\ue6ec","fs-hue_bridge .path8":"\ue6ed","fs-hue_bridge .path9":"\ue6ee","fs-hue_bridge .path10":"\ue6ef","fs-hue_bridge .path11":"\ue6f0","fs-hue_bridge .path12":"\ue6f1","fs-hue_bridge .path13":"\ue6f2","fs-hue_bridge .path14":"\ue6f3","fs-hue_bridge .path15":"\ue6f4","fs-hue_bridge .path16":"\ue6f5","fs-hue_bridge .path17":"\ue6f6","fs-hue_bridge .path18":"\ue6f7","fs-hue_bridge .path19":"\ue6f8","fs-hue_bridge .path20":"\ue6f9","fs-hue_bridge .path21":"\ue6fa","fs-hue_bridge .path22":"\ue6fb","fs-hue_bridge .path23":"\ue6fc","fs-hourglass":"\ue6fd","fs-hm-tc-it-wm-w-eu":"\ue6fe","fs-hm-dis-wm55":"\ue6ff","fs-hm-cc-rt-dn":"\ue700","fs-hm_lan":"\ue701","fs-hm_keymatic":"\ue702","fs-hm_ccu":"\ue703","fs-general_ok":"\ue704","fs-general_low":"\ue705","fs-general_aus_fuer_zeit":"\ue706","fs-general_aus":"\ue707","fs-general_an_fuer_zeit":"\ue708","fs-general_an":"\ue709","fs-garden_socket":"\ue70a","fs-fts_window_1wbb_open":"\ue70b","fs-fts_shutter_updown":"\ue70c","fs-fts_door_tilt":"\ue70d","fs-fts_door_right_open":"\ue70e","fs-fts_door_right":"\ue70f","fs-frost":"\ue710","fs-floor":"\ue711","fs-dustbin":"\ue712","fs-dreambox":"\ue713","fs-dog_silhouette":"\ue714","fs-DIN_rail_housing .path1":"\ue715","fs-DIN_rail_housing .path2":"\ue716","fs-DIN_rail_housing .path3":"\ue717","fs-DIN_rail_housing .path4":"\ue718","fs-DIN_rail_housing .path5":"\ue719","fs-DIN_rail_housing .path6":"\ue71a","fs-DIN_rail_housing .path7":"\ue71b","fs-DIN_rail_housing .path8":"\ue71c","fs-DIN_rail_housing .path9":"\ue71d","fs-DIN_rail_housing .path10":"\ue71e","fs-DIN_rail_housing .path11":"\ue71f","fs-DIN_rail_housing .path12":"\ue720","fs-DIN_rail_housing .path13":"\ue721","fs-DIN_rail_housing .path14":"\ue722","fs-DIN_rail_housing .path15":"\ue723","fs-DIN_rail_housing .path16":"\ue724","fs-DIN_rail_housing .path17":"\ue725","fs-DIN_rail_housing .path18":"\ue726","fs-DIN_rail_housing .path19":"\ue727","fs-DIN_rail_housing .path20":"\ue728","fs-DIN_rail_housing .path21":"\ue729","fs-DIN_rail_housing .path22":"\ue72a","fs-DIN_rail_housing .path23":"\ue72b","fs-DIN_rail_housing .path24":"\ue72c","fs-DIN_rail_housing .path25":"\ue72d","fs-DIN_rail_housing .path26":"\ue72e","fs-DIN_rail_housing .path27":"\ue72f","fs-DIN_rail_housing .path28":"\ue730","fs-DIN_rail_housing .path29":"\ue731","fs-DIN_rail_housing .path30":"\ue732","fs-DIN_rail_housing .path31":"\ue733","fs-DIN_rail_housing .path32":"\ue734","fs-DIN_rail_housing .path33":"\ue735","fs-DIN_rail_housing .path34":"\ue736","fs-DIN_rail_housing .path35":"\ue737","fs-DIN_rail_housing .path36":"\ue738","fs-DIN_rail_housing .path37":"\ue739","fs-DIN_rail_housing .path38":"\ue73a","fs-DIN_rail_housing .path39":"\ue73b","fs-DIN_rail_housing .path40":"\ue73c","fs-DIN_rail_housing .path41":"\ue73d","fs-DIN_rail_housing .path42":"\ue73e","fs-DIN_rail_housing .path43":"\ue73f","fs-DIN_rail_housing .path44":"\ue740","fs-DIN_rail_housing .path45":"\ue741","fs-DIN_rail_housing .path46":"\ue742","fs-DIN_rail_housing .path47":"\ue743","fs-DIN_rail_housing .path48":"\ue744","fs-DIN_rail_housing .path49":"\ue745","fs-day_night":"\ue746","fs-cul_usb":"\ue747","fs-cul_cul":"\ue748","fs-cul_868":"\ue749","fs-cul":"\ue74a","fs-christmas_tree":"\ue74b","fs-building_security":"\ue74c","fs-building_outside":"\ue74d","fs-building_carport_socket":"\ue74e","fs-building_carport_light":"\ue74f","fs-building_carport":"\ue750","fs-bluetooth":"\ue751","fs-batterie":"\ue752","fs-bag":"\ue753","fs-ampel_rot .path1":"\ue754","fs-ampel_rot .path2":"\ue755","fs-ampel_gruen .path1":"\ue756","fs-ampel_gruen .path2":"\ue757","fs-ampel_gelb .path1":"\ue758","fs-ampel_gelb .path2":"\ue759","fs-ampel_aus":"\ue75a","fs-alarm_system_password":"\ue75b","fs-access_keypad_2":"\ue75c","fs-access_keypad_1":"\ue75d"};
			var glyphs = name.split(' ');
			var ret = "";
			for (var i=0, ll=glyphs.length; i<ll; i++) {
				var res = (name.indexOf('fa-')>=0)?FONT_AWESOME[glyphs[i]]:(name.indexOf('fs-')>=0)?FONT_FHEMSVG[glyphs[i]]:FONT_OPENAUTOMATION[glyphs[i]];
				ret += (res!==undefined)?' '+res:glyphs[i];
			}
			return(ret.replace(/ /,''));
		}
	}
}

function loadGoogleMapsAPI() {
	if (($('head').find("script[src*='https://maps.googleapis.com/maps/api/js']").length <= 0)) {
		var apiKey = $("meta[name='GoogleMapsApiKey']").attr("content");
		if (apiKey) {
			var script = document.createElement("script");
			script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=gmapsAPIReady';
			document.getElementsByTagName("head")[0].appendChild(script);
		} else {
			ftui.toast('Could not find API Key, please add <meta name="GoogleMapsApiKey" content="<APIKey>"> to your html','error');
		}
	}
}

function gmapsAPIReady() {
	$("body").trigger("gmap_loaded");
}


var Modul_gmaps = function () {
	function refresh(elem) {
		
	}

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('name', 'NAME');
        elem.initData('alias', 'alias');
        elem.initData('start_address', 'start_address');
        elem.initData('end_address', 'end_address');
        elem.initData('latitude', 'latitude');
        elem.initData('longitude', 'longitude');
        elem.initData('GoogleMapsCenter', 'GoogleMapsCenter');
        elem.initData('GoogleMapsZoom', 'GoogleMapsZoom');
        elem.initData('GoogleMapsStroke', 'GoogleMapsStroke');
        elem.initData('GoogleMapsTrafficLayer', 'GoogleMapsTrafficLayer');
        elem.initData('waypoints', 'waypoints');
        elem.initData('returnWaypoints', 'returnWaypoints');
        elem.initData('travelMode', 'travelMode');
        elem.initData('includeReturn', 'includeReturn');
        elem.initData('language', 'language');
        elem.initData('delay', 'delay');
        elem.initData('distance', 'distance');
        elem.initData('duration', 'duration');
        elem.initData('return_duration', 'return_duration');
        elem.initData('duration_in_traffic', 'duration_in_traffic');
        elem.initData('return_duration_in_traffic', 'return_duration_in_traffic');
        elem.initData('eta', 'eta');

		elem.initData('api_key', '');
		elem.initData('api_initialized', false);
		elem.initData('module_initialized', false);
		elem.initData('language', 'de');
		elem.initData('device', '');
		elem.initData('size', 'auto');
		elem.initData('center', 'auto');
		elem.initData('zoom', 'auto');
		elem.initData('travel_mode', 'DRIVING');
		elem.initData('traffic', false);
		elem.initData('showdetails', false);
		elem.initData('stroke', '#ffffff,7,50,#ffffff,7,50');
		elem.initData('style', 'default');
		
		me.addReading(elem,'get');
		me.addReading(elem,'NAME');
		me.addReading(elem,'alias');
		me.addReading(elem,'start_address');
		me.addReading(elem,'end_address');
		me.addReading(elem,'latitude');
		me.addReading(elem,'longitude');
		me.addReading(elem,'GoogleMapsCenter');
		me.addReading(elem,'GoogleMapsZoom');
		me.addReading(elem,'GoogleMapsStroke');
		me.addReading(elem,'GoogleMapsTrafficLayer');
		me.addReading(elem,'waypoints');
		me.addReading(elem,'returnWaypoints');
		me.addReading(elem,'travelMode');
		me.addReading(elem,'includeReturn');
		me.addReading(elem,'language');
		me.addReading(elem,'delay');
		me.addReading(elem,'distance');
		me.addReading(elem,'duration');
		me.addReading(elem,'return_duration');
		me.addReading(elem,'duration_in_traffic');
		me.addReading(elem,'return_duration_in_traffic');
		me.addReading(elem,'eta');

		Date.prototype.hh = function() {
			var hh  = this.getHours().toString();
			return (hh[1]?hh:"0"+hh[0]);
		};
		Date.prototype.mm = function() {
			var mm  = this.getMinutes().toString();
			return (mm[1]?mm:"0"+mm[0]);
		};

	}

	function init_map_options(elem) {
		if (!elem.data('map_options')) elem.data('map_options',{});
		if (!elem.data('map_options').center) elem.data('map_options').center = (elem.data('center')&& elem.data('center')!='auto')? {lat: parseFloat(elem.data('center').split(",")[0]),lng: parseFloat(elem.data('center').split(",")[1])} : {lat: 0, lng: 0};
		if (!elem.data('map_options').zoom) elem.data('map_options').zoom = (elem.data('zoom')&&elem.data('zoom')!='auto') ? parseFloat(elem.data('zoom')) : 1;

		if (!elem.data('direction_request')) elem.data('direction_request',{});
		elem.data('direction_request').provideRouteAlternatives = false;
		if (!elem.data('direction_request').travelMode) elem.data('direction_request').travelMode = elem.data('travel_mode') ? elem.data('travel_mode').toUpperCase() : 'DRIVING';

		//elem.data('size') =  elem.data('size');
	}
	
    function init() {
        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            me.init_attr(elem);
			me.init_map_options(elem);
            me.init_ui(elem);
		});
	}

	function init_map() {
        me.elements.each(function (index) {
            var elem = $(this);
			elem.data('api_initialized',true);
		});
	}

	function check_reading(elem,reading,recalc) {
		var val;
		val = elem.getReading(reading).val;
		//console.log('Got new parameter: '+val+' for reading '+reading);
		if (val) return recalc?recalc(val):val;
	}
	
	function add_elems(elem,elems) { // check if elem is already part of elems and add elem to elems if not
		var found = false;
		$.each(elems, function(ind,val){
			if (val==this) found = true;
		});
		if (!found) elems[elems.length]=elem; // add new element
	}
	
	function set_content(elem) {
		var data = elem.data();
		var title = check_reading(elem,'alias')?check_reading(elem,'alias'):(check_reading(elem,'name')?check_reading(elem,'name'):'');
		var start = check_reading(elem,'start_address');
		var now = new Date();
		var resArrival = undefined; // need to get direct arrival Time if reading is not available
		if (data.directionsDisplay.result) {
			var now = new Date();
			now.setTime(now.getTime()+data.directionsDisplay.result.duration_in_traffic.value*1000);
			resArrival = now.hh() + ':' + now.mm();
		}
		if (start!=undefined) {
			switch (elem.data('language')) {
				case 'de': default:
					var ret_normal = check_reading(elem,'return_duration')?' Zurück:'+check_reading(elem,'return_duration'):''
					var ret_traffic = check_reading(elem,'return_duration_in_traffic')?' Zurück:'+check_reading(elem,'return_duration_in_traffic'):''
					var normal = check_reading(elem,'duration')?' Hin:'+check_reading(elem,'duration'):data.directionsDisplay.result.duration?data.directionsDisplay.result.duration.text:''
					var in_traffic = check_reading(elem,'duration_in_traffic')?' Hin:'+check_reading(elem,'duration_in_traffic'):data.directionsDisplay.result.duration_in_traffic?data.directionsDisplay.result.duration_in_traffic.text:''
					var arrival = check_reading(elem,'eta')?check_reading(elem,'eta'):resArrival?resArrival:'';
					var str =
					'<div id="content" class="map_infowindow">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h3 id="firstHeading" class="firstHeading">'+title+'</h3>'+
						'<div id="bodyContent" class="bodyContent">'+
							'<p><b>Start:</b> '+start+'<br>'+
							'<b>Ende:</b> '+check_reading(elem,'end_address')+'<br>'+
							'<b>Normal:</b> '+normal+ret_normal+'<br>'+
							'<b>Aktuell:</b> '+in_traffic+ret_traffic+'<br>'+
							'<b>Ankunft:</b> '+arrival+'<br></p>'+
						'</div>'+
					'</div>';
					break;
				case 'en':
					var ret_normal = check_reading(elem,'return_duration')?' Return:'+check_reading(elem,'return_duration'):''
					var ret_traffic = check_reading(elem,'return_duration_in_traffic')?' Return:'+check_reading(elem,'return_duration_in_traffic'):''
					var normal = check_reading(elem,'duration')?' To:'+check_reading(elem,'duration'):''
					var in_traffic = check_reading(elem,'duration_in_traffic')?' To:'+check_reading(elem,'duration_in_traffic'):''
					var arrival = check_reading(elem,'eta')?check_reading(elem,'eta'):resArrival?resArrival:'';
					var str =
					'<div id="content" class="map_infowindow">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h3 id="firstHeading" class="firstHeading">'+title+'</h3>'+
						'<div id="bodyContent" class="bodyContent">'+
							'<p><b>Start:</b> '+start+'<br>'+
							'<b>End:</b> '+check_reading(elem,'end_address')+'<br>'+
							'<b>Normal:</b> '+normal+ret_normal+'<br>'+
							'<b>Current:</b> '+in_traffic+ret_traffic+'<br>'+
							'<b>Arrival:</b> '+arrival+'<br></p>'+
						'</div>'+
					'</div>';
					break;
			}
		} else {
			var str = '<div id="content" class="map_infowindow"><b>'+title+'</b></div>';				
		}

		return str;
	}
	
	function get_options(elem,options,data,type,inScale) {
		var scale = inScale?inScale:1;
		var plOptions = data.getPolylineOptions()[0];
		var symbol = {
			//path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
			path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
			fillColor: plOptions.strokeColor,
			strokeColor: plOptions.strokeColor,
			strokeOpacity: plOptions.strokeOpacity,
			anchor: new google.maps.Point(0,0),
			scale: plOptions.strokeWeight/22*scale,
			labelOrigin: new google.maps.Point(0,(plOptions.strokeWeight/-2*scale)),
			strokeWeight: 1,
			fillOpacity: plOptions.strokeOpacity
		};

		if (data.label) {
			var label = {};
			if (data.label.indexOf('fa-')==0) {
				label.fontFamily = 'FontAwesome';
				label.text = elem.fontNameToUnicode(data.label);
			} else if (data.label.indexOf('fs-')==0) {
				label.fontFamily = 'fhemSVG';
				label.text = elem.fontNameToUnicode(data.label);
			} else if (data.label.indexOf('oa-')==0) {
				label.fontFamily = 'openautomation';
				label.text = elem.fontNameToUnicode(data.label);
			} else {
				label.text = data.label;
			}
			if (data.icon && data.icon == 'no-icon') label.color = plOptions.strokeColor; // if no icon is drawn, the label will be drawn in stroke color
			label.fontSize = plOptions.strokeWeight*scale+'px';
		}
		if (data.icon) {
			var icon = {
				url: (data.icon.indexOf('http')>-1)?data.icon:document.location.origin + '/fhem/images/' + data.icon,
				scaledSize: {width: parseFloat(plOptions.strokeWeight)*scale, height: parseFloat(plOptions.strokeWeight)*scale},
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(parseFloat(plOptions.strokeWeight)*scale/2.,parseFloat(plOptions.strokeWeight)/2.*scale)
			};
		}

		switch (type) {
			case 'marker':
				options.icon = symbol;
				if (label) options.label = label;
				if (icon) options.icon = icon;
				break;
				
			case 'polyline':
				options.polylineOptions = plOptions;
				if (!options.markerOptions) options.markerOptions = {};
				options.markerOptions.icon = symbol;
				if (label) options.markerOptions.label = label;
				if (icon) options.markerOptions.icon = icon;
				break;
		}
		
		return options;
	}
	
	function add_map_point(elem,point,position,title,makeContent,scale)
	{
		var data = elem.data();

		if (!point) point = {};
		if (!point.infowindow) { // there should be only one infowindow per route
			point.infowindow = new google.maps.InfoWindow({
				content: makeContent(elem)
			});
			elem.data('saved_center',data.map_options.center);
			point.infowindow.addListener('closeclick',function() {
				point.infowindow.close();
				elem.data('map').setCenter(elem.data('saved_center'));
				point.marker.setPosition(position);
				point.marker.setTitle(title);
				point.marker.setVisible(true);
			});
		}

		if (!point.marker) {
			var options = {
				position: position,
				map: elem.data('map'),
				title: title
			};

			if (data.stroke) options = get_options(elem,options,data,'marker',scale);
			if (scale) options
			point.marker = new google.maps.Marker(options);
			point.marker.addListener('click',function() {
				elem.data('saved_center',elem.data('map_options').center);
				point.marker.setVisible(false);
				point.infowindow.open(elem.data('map'));
				point.infowindow.setPosition(options.position);
			});
		}

		if (data.showdetails) {
			point.marker.setVisible(false);
			point.infowindow.setPosition(position);
			point.infowindow.open(data.map);
			point.infowindow.addListener('domready',function() {
				$('.gm-style-iw').parent().addClass('gm-style-iw-parent'); // class needed to make infowindow transparent etc.
			});
		} else {
				point.marker.setPosition(position);
				point.marker.setTitle(title);
		}
		
		elem.data(data);
		return point;
	}
	
	function update_value(elem) {	
	}
	
	function update_map(elem,withRoute) {
		if (elem.data('module_initialized')) {
			if (elem.data('center') != 'auto' || elem.data('zoom') != 'auto') elem.data('directionsDisplay').setOptions({preserveViewport: true});
			var options = {};
			var data = elem.data();
			if (data.stroke) options = get_options(elem,options,data,'polyline',2);
			data.directionsDisplay.setOptions(options);
			if (withRoute && data.direction_request && data.direction_request.origin && data.direction_request.destination) {
				data.directionsService.route(data.direction_request, function(result, status) {
					if (status == 'OK') {
						data.directionsDisplay.setDirections(result);
						if (data.zoom!='auto' && data.center=='auto') { // not both parameters are 'auto' so we have deactivated viewport change, got to do it by hand for bounds
							var bounds = result.routes[0].bounds;
							data.map_options.center = {
								lat: (bounds.getNorthEast().lat()+bounds.getSouthWest().lat())/2.,
								lng: (bounds.getNorthEast().lng()+bounds.getSouthWest().lng())/2.
							}
							data.map.setCenter(data.map_options.center);
						}
						var map = data.map;
						google.maps.event.addListener(data.directionsDisplay,'directions_changed', function() {
						});
						
						var title = check_reading(elem,'alias')?check_reading(elem,'alias'):(check_reading(elem,'name')?check_reading(elem,'name'):'');
						var path = result.routes[0].overview_path;
						data.directionsDisplay.result=result.routes[0].legs[0];
						var pathCenter = {lat: path[parseInt(path.length/2)].lat(), lng: path[parseInt(path.length/2)].lng()};
						data.route = add_map_point(elem,data.route,pathCenter,title,set_content,2);
					}
				});
			}
			if (data.position && data.position.latitude && data.position.longitude) {
				var title = check_reading(elem,'alias')?check_reading(elem,'alias'):(check_reading(elem,'name')?check_reading(elem,'name'):'');
				var position = {lat:parseFloat(data.position.latitude),lng:parseFloat(data.position.longitude)};
				data.point = add_map_point(elem,data.point,position,title,set_content);
			}

			if (data.center != 'auto') data.map.setCenter(data.map_options.center);
			if (data.zoom != 'auto') data.map.setZoom(data.map_options.zoom);

			elem.data(data);
		} else {
			setTimeout(function(){update_map(elem,withRoute);},200);
		}
	}
	
    function init_ui(elem) {
		$("body").bind("gmap_loaded", function(){
			init_map();
		});
		loadGoogleMapsAPI();
		
//		if (!$.fn.google) { // add google bootstrap script
//			var url = 'https://maps.googleapis.com/maps/api/js?key='+elem.data('api_key')+'';
//			ftui.dynamicload(url, false).done(function () {
//			$('head').load(url,function(responseText,textStatus,jqXHR) {
//                init_map();
//            });
//			$('head').append('<script src="'+url+'"></script>');
//			init_map();
//			$.fn.google = function() {};
//		}

		if (elem.data('api_initialized')) {
			var map=undefined;
			$(document).find("[id*='map-']").each(function(index){
				if ($(this).parent().data('mapgroup') && elem.data('mapgroup') &&  $(this).parent().data('mapgroup') == elem.data('mapgroup')) {
					if ($(this).parent().data('map')) map = $(this).parent().data('map');
				}
			});

			if (elem.data('stroke')) {
				var data = elem.data();
				data.getPolylineOptions = function() {
					var values = this.stroke.split(',');
					var PolyLineOptions = [];
					if ($.isArray(values)) {
						PolyLineOptions[0] = {strokeColor:values[0],strokeOpacity:1,strokeWeight:6}; // there is a setting for the path color
						if (values.length > 1) {
							if (!$.isNumeric(values[1])) {
								PolyLineOptions[1] = {strokeColor:values[1],strokeWeight:(values.length>1)?parseFloat(values[2]):1,strokeOpacity:(values.length>2)?values[3]/100:1};
							} else {
								PolyLineOptions[0].strokeWeight = parseFloat(values[1]);
								if (values.length > 2) PolyLineOptions[0].strokeOpacity = values[2]/100;
								if (values.length > 3) PolyLineOptions[1] = {strokeColor:values[3],strokeWeight:(values.length>4)?parseFloat(values[4]):1,strokeOpacity:(values.length>5)?values[5]/100:1};
							}
						}
						return PolyLineOptions;
					}
				};
				elem.data(data);
			}
			if (!map) { // check if map of same mapgroup is already existing, if not create new one
				var gmaps_elem = $('<div class="gmaps_map" id="map-'+(elem.data('mapgroup')?elem.data('mapgroup').toString():'')+'" style="height:100%;"></div>').data(elem.data()).appendTo(elem);
				map = new google.maps.Map(gmaps_elem.get(0),elem.data('map_options'));
			}

			map.addListener('bounds_changed', function() {
				if (isNaN(elem.data('map_options').center.lat) || isNaN(elem.data('map_options').center.lng)) {
					elem.data('map_options').center = {
						lat: (elem.data('map').getBounds().getNorthEast().lat()+elem.data('map').getBounds().getSouthWest().lat())/2.,
						lng: (elem.data('map').getBounds().getNorthEast().lng()+elem.data('map').getBounds().getSouthWest().lng())/2.
					}
				}
				if (elem.data('center') != 'auto') elem.data('map').setCenter(elem.data('map_options').center);
				if (elem.data('zoom') != 'auto')elem.data('map').setZoom(elem.data('map_options').zoom);
			});
			map.addListener('zoom_changed', function() {
				elem.data('map_options').zoom = this.getZoom();
			});
			map.addListener('center_changed', function() {
				elem.data('map_options').center = {lat: this.getCenter().lat(), lng: this.getCenter().lng()};
			});

			var directionsService = new google.maps.DirectionsService();
			var data = elem.data();
			var options = {};
			if (data.stroke) options = get_options(elem,options,data,'polyline');
			var directionsDisplay = new google.maps.DirectionsRenderer(options);
			if (data.center != 'auto' || data.zoom != 'auto') directionsDisplay.setOptions({preserveViewport: true});
			directionsDisplay.setMap(map);

			if (elem.data('traffic')) {
				var trafficLayer = new google.maps.TrafficLayer();
				trafficLayer.setMap(map);
			}

			elem.data('map', map);
			elem.data('directionsService', directionsService);
			elem.data('directionsDisplay', directionsDisplay);
			elem.data('module_initialized',true);
		} else {
			setTimeout(function(){init_ui(elem);},200);
		}
    }

    function update(dev, par) {
		var doUpdate = false;
		var doRoute = false
		var elems = [];
		
        me.elements.filterDeviceReading('start_address', dev, par)
		.each(function (index) {
			var elem = $(this);
			var start_address = check_reading(elem,'start_address');
			if (start_address) elem.data('direction_request').origin = start_address;
			add_elems(elem,elems);
			doRoute = true;
			doUpdate = true;
		});

        me.elements.filterDeviceReading('end_address', dev, par)
		.each(function (index) {
			var elem = $(this);
			var end_address = check_reading(elem,'end_address');
			if (end_address) elem.data('direction_request').destination = end_address;
			add_elems(elem,elems);
			doRoute = true;
			doUpdate = true;
		});

        me.elements.filterDeviceReading('latitude', dev, par)
		.each(function (index) {
			var elem = $(this);
			var latitude = check_reading(elem,'latitude');
			if (!elem.data('position')) elem.data('position',{latitude:0, longitude:0});
			if (latitude) elem.data('position').latitude = latitude;
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('longitude', dev, par)
		.each(function (index) {
			var elem = $(this);
			var longitude = check_reading(elem,'longitude');
			if (!elem.data('position')) elem.data('position',{latitude:0, longitude:0});
			if (longitude) elem.data('position').longitude = longitude;
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('GoogleMapsZoom', dev, par)
		.each(function (index) {
			var elem = $(this);
			var zoom = check_reading(elem,'GoogleMapsZoom');
			if (zoom) {
				elem.data('map_options').zoom = parseFloat(zoom);
				elem.data('zoom',zoom);
			}
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('GoogleMapsCenter', dev, par)
		.each(function (index) {
			var elem = $(this);
			var center = check_reading(elem,'GoogleMapsCenter',function(value){if (value) return value.split(',');});
			if ($.isArray(center) && center.length > 0) elem.data('map_options').center.lat = parseFloat(center[0]);
			if ($.isArray(center) && center.length > 1) elem.data('map_options').center.lng = parseFloat(center[1]);
			if (center) elem.data('center',center.join(','));
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('GoogleMapsTrafficLayer', dev, par)
		.each(function (index) {
			var elem = $(this);
			var traffic = check_reading(elem,'GoogleMapsTrafficLayer');
			if (traffic) elem.data('traffic',parseInt(traffic));
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('GoogleMapsStroke', dev, par)
		.each(function (index) {
			var elem = $(this);
			var stroke = check_reading(elem,'GoogleMapsStroke');
			if (stroke) elem.data('stroke',stroke);
			add_elems(elem,elems);
			doUpdate = true;
		});

        me.elements.filterDeviceReading('waypoints', dev, par)
		.each(function (index) {
			var elem = $(this);
			var waypoints = check_reading(elem,'waypoints',function(value){if (value) return value.split('|');});
			if ($.isArray(waypoints)) {
				elem.data('direction_request').wayPoints = [];
				$.each(waypoints, function(ind, val) {
					elem.data('direction_request').waypoints[ind] = {location: val, stopover: false};
				});
			}
			elem.data('direction_request').drivingOptions = {departureTime: new Date(), trafficModel: 'bestguess'};
			add_elems(elem,elems);
			doRoute = true;
			doUpdate = true;
		});

        me.elements.filterDeviceReading('travelMode', dev, par)
		.each(function (index) {
			var elem = $(this);
			var travelMode = check_reading(elem,'travelMode');
			if (travelMode) elem.data('direction_request').travelMode = travelMode.toUpperCase();
			elem.data('direction_request').drivingOptions = {departureTime: new Date(), trafficModel: 'pessimistic'};
			add_elems(elem,elems);
			doRoute = true;
			doUpdate = true;
		});

        me.elements.filterDeviceReading('includeReturnxxx', dev, par)
		.each(function (index) {
			var elem = $(this);
			var includeReturn = check_reading(elem,'includeReturn');
			if (includeReturn) elem.data('direction_request').includeReturn = includeReturn;
			add_elems(elem,elems);
			doRoute = true;
			doUpdate = true;
		});

		if (doUpdate) {
			$.each(elems,function(ind,val) {me.update_map($(this),doRoute)});
		}
	}

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'gmaps',
        init: init,
        init_ui: init_ui,
        init_attr: init_attr,
		init_map: init_map,
        update: update,
		update_value: update_value,
		init_map_options: init_map_options,
		update_map: update_map
    });
	
    return me;
};
