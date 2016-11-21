//webank.js 1.0.0
if (typeof jQuery === 'undefined') { throw new Error('Webank\'s JavaScript requires jQuery'); }

(function() {
	var webank = function(obj) {
		if (obj instanceof webank) return obj;
		if (!(this instanceof webank)) return new webank(obj);
	};
	window.webank = webank;
	
	// Current version.
	webank.VERSION = '1.0.0';
	console = window.console || {log: function() {}};
	
	+function(webank) {
		'use strict';
		function resizeIframe($iframe, iframeContainerSelector, height) {
			if($iframe[0] == null) return false;
			
			height = height || jQuery($iframe[0].contentWindow.document.body).find(iframeContainerSelector).outerHeight();
			console.log(height);
			$iframe.height(height);
		}
		
		function resizeIframeCascade() {
			var lastHtmlLevel;
			var isLastHtmLevel = false;
			
			lastHtmlLevel = window;
			while(!isLastHtmLevel) {
				resizeIframe(jQuery(jQuery(lastHtmlLevel)[0].frameElement), '.container-fluid');
				
				if(lastHtmlLevel.location == parent.location) {
					isLastHtmLevel = true;
				} else {
					lastHtmlLevel = lastHtmlLevel.parent;
				}
			}
		}
		
		webank.resizeIframe = resizeIframe;
		webank.resizeIframeCascade = resizeIframeCascade;
	}(webank);
	
	+function(webank) {
		'use strict';
		
		var lastHtmlLevel;
		
		function startSpinner(opts) {
			opts = opts || {};
			
			var spinner = findSpinner();
			var $menu = jQuery(lastHtmlLevel.document);
			spinner.spin();
			$menu.find('#spinner-efs').html(spinner.el);
			
			if(opts.showBackDrop) {
				var $content = jQuery(lastHtmlLevel.document).find('.content');
				$content.prepend('<div class="spinner-backdrop"></div>');
			}
		}
		
		function stopSpinner() {
			var spinner = findSpinner();
			if (spinner) spinner.stop();
			jQuery(lastHtmlLevel.document).find('.spinner-backdrop').remove();
		}
		
		function findSpinner() {
			lastHtmlLevel = window;
			var spinner = lastHtmlLevel.spinner;
			
			while(spinner == null && lastHtmlLevel.frameElement) {
				lastHtmlLevel = lastHtmlLevel.parent;
				spinner = lastHtmlLevel.spinner;
			}
			
			return spinner;
		}
		
		webank.startSpinner = startSpinner;
		webank.stopSpinner = stopSpinner;
	}(webank);
	
	+function(webank) {
		'use strict';
		
		function manageTabs($tabs, $tabsContent, callback, opts) {
			opts = opts || {};
			
			$tabs.on('click', 'li', function() {
				var $previous = $tabs.find('.active');
				var $this = jQuery(this);
				if($this.hasClass('empty')) return;
				if($this.is($previous.get(0))) return;
				
				var previousTarget = $previous.data('target');
				var thisTarget = jQuery(this).data('target');
				
				$previous.removeClass('active');
				jQuery(previousTarget).removeClass('active');
				$this.addClass('active');
				jQuery(thisTarget).addClass('active');
				
				if (callback && typeof callback == 'function') callback($this, $previous);
			});
		}
		
		webank.manageTabs = manageTabs;
	}(webank);
	
	+function(webank) {
		'use strict';
		function manageInputFile($inputFile) {
			$inputFile.on('change', function() {
				var $inputFile = jQuery(this);
				var label = $inputFile.val().replace(/\\/g, '/').replace(/.*\//, '');
				var $inputTxt = $inputFile.parents('.input-group').find(':text');
				
				if(label.indexOf("'") != -1) {
					$inputFile.val("")
					$inputTxt.val("");
					alert("Le sigle ' n'est pas valide dans le nom de votre fichier");
				} else {
					$inputTxt.val(label);
				}
			});
		}
		
		webank.manageInputFile = manageInputFile;
	}(webank);
	
	+function(webank) {
		'use strict';
		function controlAmount(amount, decim) {
			if (amount.value.indexOf(',') != -1) {
				amount.value = amount.value.replace(',', '.');
			}
			
			if (amount.value.indexOf('.') == -1) {
				var nbDecim = getRightDecimal(decim);
				if (nbDecim > 0)
					amount.value = amount.value + "." + repeatString('0', nbDecim);
			}
			// Suppression des zeros à droite après les décimals
			amount.value = amount.value.replace(/^(\d+\.\d*?[1-9])0+$/, "$1");
		}
		
		function repeatString(strInput, intCount) {
			var arrTmp = new Array(intCount+1);
			return arrTmp.join(strInput);
		}
		
		function getRightDecimal(decim) {
			var tabDeci0="BIF,CLP,DJF,GNF,JPY,KMF,KRW,MGF,PYG,RWF,TJS,TRL,UGX,VUV,XAF,XAU,XOF,XPF";
			var tabDeci3="BHD,IQD,JOD,KWD,LYD,OMR,TND";
			
			if (tabDeci3.indexOf(decim) != -1) return 3;
			if (tabDeci0.indexOf(decim) != -1) return 0;
			return 2;
		}
		
		webank.controlAmount = controlAmount;
	}(webank);
}.call(this));