var style = new function () {
	var base = this; 
	this.fonts = (typeof FONTS != 'undefined') ? FONTS : [];
	var getPropertyValue = function(k,v) {
		var checkRatioPadding = (typeof base.property.__ratio_padding_top != 'undefined' || typeof base.property.__ratio_padding_bottom != 'undefined') ? true : false;

		switch(k) {
			case 'background':
				base.property.bg = v;
				var colorRegex = /#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)/,
					match = v.match(colorRegex);
				if(match) {
					for (var i = 0; i < match.length; i++) {
						if (match[i] !== 'transparent') {
							base.property.bgColor = match[i];
							break;
						}
					}
				}
				break;
			case 'background-color':
				base.property.bgColor = v;
				break;
			case 'background-image':
				base.property.bgUrl = v;
				if( (v == '' || v == 'none') 
					&& $(base.selector).length > 0 
					&& typeof $(base.selector).css('background-image') != 'undefined' && $(base.selector).css('background-image') != 'none'
				) {
					base.property.bgUrl = $(base.selector).css('background-image');    
				}
				break;
			case 'background-repeat':
				// base.property.bgRepeat = (!base.property.bgRepeat) ? 'no-repeat' : $(base.selector).css('background-repeat');
				if($(base.selector).attr('data-aosinfo')=="false" && $(base.selector).attr('data-parallax')=="true" && typeof v !='undefined' && v) base.property.bgRepeat = v;
				else base.property.bgRepeat = $(base.selector).css('background-repeat');
				break;
			case 'background-position':
				// base.property.bgPosition = (!base.property.bgPosition || base.property.bgPosition=='0% 0%') ? 'center center' : $(base.selector).css('background-position');

				/* parallax on-off 기능 추가 ::: bootstrap-override.css의 [data-parallax="false"] css 적용됨에 따라 수정됨 ******/
				if($(base.selector).attr('data-aosinfo')=="false" && $(base.selector).attr('data-parallax')=="true" && typeof v !='undefined' && v) _bgposition = v;
				else _bgposition = $(base.selector).css('background-position');
				//var _bgposition = (typeof v !='undefined' && v) ? v : $(base.selector).css('background-position');
				/*************************************************************************************************************/
				
				if(		$.inArray(_bgposition,['left top','0% 0%','0% 0','0 0%','0px 0','0 0px','0px 0%','0% 0px','0% 0px','0px 0%','0px 0px','0 0'])	> -1) _bgposition = 'left top';
				else if($.inArray(_bgposition,['center top','50% 0%','50% 0px','50% 0','top','center 0%','center 0px','center 0'])	> -1) _bgposition = 'center top';
				else if($.inArray(_bgposition,['right top','100% 0%','100% 0px','100% 0'])	> -1) _bgposition = 'right top';
				else if($.inArray(_bgposition,['left center','center left','left','0 50%','0px 50%','0% 50%','0% center','0px center','0 center','left 50%']) > -1) _bgposition = 'left center';
				else if($.inArray(_bgposition,['center center','center','50% 50%','center 50%','50% center','50%']) > -1) _bgposition = 'center center';
				else if($.inArray(_bgposition,['right center','center right','right','100% 50%','100% center','right 50%']) > -1) _bgposition = 'right center';
				else if($.inArray(_bgposition,['left bottom','bottom left','0% 100%','0px 100%','0 100%','left 100%','0% bottom','0px bottom','0 bottom']) > -1) _bgposition = 'left bottom';
				else if($.inArray(_bgposition,['center bottom','bottom center','bottom','50% 100%','center 100%','50% bottom']) > -1) _bgposition = 'center bottom';
				else if($.inArray(_bgposition,['right bottom','bottom right','100% 100%','right 100%','100% bottom']) > -1) _bgposition = 'right bottom';

				base.property.bgPosition = _bgposition;
				break;
			case 'background-attach':
				base.property.bgAttach = $(base.selector).css('background-attach');
				break;
			case 'background-size':
				// base.property.bgSize = (!base.property.bgSize) ? 'cover' : $(base.selector).css('background-size');
				if($(base.selector).attr('data-aosinfo')=="false" && $(base.selector).attr('data-parallax')=="true" && typeof v !='undefined' && v) base.property.bgSize = v;
				else base.property.bgSize = $(base.selector).css('background-size');
				//base.property.bgSize = (typeof v !='undefined' && v) ? v : $(base.selector).css('background-size');
				break;
			// case 'background-attachment':
			// 	base.property.bgAttachment = (base.property.bgSize == 'cover') ? 'fixed' : 'scroll';
			// 	break;
			case 'fill':
				base.property.fill = v;
				break;
			case 'color':
				var _txcolor = Coloris.getColorInfo(v);
				base.property.txColor = (_txcolor) ? _txcolor : '';
				break;
			
			case 'padding': case 'padding-left': case 'padding-right': case 'padding-top': case 'padding-bottom':
				if(!checkRatioPadding) {
					base.property.pdTop = ($(base.selector).css('padding-top')!=null) ? $(base.selector).css('padding-top').replace('px','') : '';
					base.property.pdBottom = ($(base.selector).css('padding-bottom')!=null) ? $(base.selector).css('padding-bottom').replace('px','') : '';
					base.property.pdLeft = ($(base.selector).css('padding-left')!=null) ? $(base.selector).css('padding-left').replace('px','') : '';
					base.property.pdRight = ($(base.selector).css('padding-right')!=null) ? $(base.selector).css('padding-right').replace('px','') : '';
				}
				break;

			case 'font-size':
				var _txSize = $(base.selector).css('font-size');
				base.property.txSize = (_txSize!=null) ? $(base.selector).css('font-size').replace('px','') : (v ? v.replace('px','') : 0);
				break;

			case 'font-family':
				if($(base.selector).length > 0 && typeof $(base.selector).css('font-family') != 'undefined') {
					base.property.txName = ($(base.selector).css('font-family')!=null) ? $(base.selector).css('font-family').replace(/\'/gi,'').replace(/\"/gi,'') : '';
				} else {
					base.property.txName = v.replace(/\'/gi,'').replace(/\"/gi,'');
				}
				break;

			case 'font-weight':
				base.property.txWeight = /^(bold|normal|\d{3})$/.test(v) ? v : '';
				break;
			case 'font-style':
				base.property.txStyle = /^(normal|italic)$/.test(v) ? v : '';
				break;
			case 'text-decoration':
				base.property.txDecoration = /^(none|underline|overline|line-through)$/.test(v) ? v : '';
				break;

			case 'width':
				base.property.width = (v == 'auto') ? v : parseInt(v);
				break;
			case 'height':
				var _height = v;
				base.property.height = (v == 'auto') ? v : parseInt(v);
				break;

			case 'border-width':
				base.property.borderWidth = v;
				break;
			case 'border-style':
				base.property.borderStyle = v;
				break;
			case 'border-color':
				base.property.borderColor = v;
				break;

			case 'border':
			case 'border-top':
			case 'border-bottom':
			case 'border-right':
			case 'border-left':
				var border_color = Coloris.getColorInfo(v,'org');
				if(Coloris.getColorRegex().exec(border_color) != null) {
					base.property.borderColor = border_color;

					if(typeof v != 'string') v = v.pop();
					var style_tmp = v.match(/\b(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)\b/);
					base.property.borderStyle = (style_tmp && typeof style_tmp[0] != 'undefined' && style_tmp[0]) ? style_tmp[0] : 'none';
	
					// var style_tmp = v.match(/\b(\d+(?:\.\d+)?(px|em|rem|%)|thin|medium|thick)\b/);
					var width_tmp = v.match(/\b(\d+(?:\.\d+)?(px)|thin|medium|thick)\b/),
						width_tmp2 = (width_tmp && typeof width_tmp[0] != 'undefined' && width_tmp[0]) ? width_tmp[0] : '0px';
					base.property.borderWidth = (width_tmp2.indexOf('px')) ? width_tmp2.replace('px','') * 1 : width_tmp2;
				}
				break;

			default:
				// root css
				if(k.match(/^\-\-/) !== null) {
					var _key = k.replace(/\-/gi,'_');
					base.property[_key] = v;
				}
				break;

		}

	};

	var getPropertyValueCustom = function(k,v,selector) {
		if(typeof v == 'undefined') return;

		switch(k) {
			case 'line-height':
				var _txlineheight = v,
					_txfontsize = $(selector).css('font-size');
					_txfontsize = parseInt(_txfontsize.replace('px',''));

				if(_txlineheight.indexOf('%') > -1)	_txlineheight = _txlineheight.replace('%','');
				else if(_txlineheight.indexOf('px') > -1) _txlineheight = (parseFloat(Number(_txlineheight.replace('px','')).toFixed(3)) / _txfontsize) * 100;
				else if(_txlineheight.indexOf('.') > -1) _txlineheight = parseFloat(Number(_txlineheight)) * 100;

				base.property.txLineheight = parseInt(Number(_txlineheight));
				break;
			case 'fill':
				var _fill = v;
				base.property.fill = _fill;
				break;
			default:
				break;
		}
	};


	this.get = function(j,selector) {
		this.property = {
			undefined: true,

			bg: '',
			bgColor : '',
			bgPosition : '',
			bgRepeat : '',
			bgUrl : '',
			bgAttach : '',
			bgSize : '',
			bgAttachment: '',

			borderColor: '',
			borderWidth: 0,
			borderStyle: 'none',

			fill: '',
			txColor : '',
			txSize : 0,
			txName : '',
			
			pdTop : 0,
			pdBottom : 0,
			pdLeft : 0,
			pdRight : 0
		};
		if(typeof selector == 'undefined') return base.property;

		selector = (selector[0] == '.') ? selector : '.' + selector;
		this.selector = $(selector);

		var bg_set = ['center center', 'no-repeat', 'cover'];
		if(this.selector.find('.cl-menu-option').length > 0) bg_set[0] = 'center top';
		if(typeof j['children'] == 'undefined') return base.property;
		if(typeof j['children'][selector] != 'undefined') {
			this.property.undefined = false;

			var c = j['children'][selector]['attributes'];
			$.each(c,function(k,v) {
				getPropertyValue(k,v);
			});

			if(!this.property.bgPosition) this.property.bgPosition = bg_set[0];
			if(!this.property.bgRepeat) this.property.bgRepeat = bg_set[1];
			if(!this.property.bgSize) this.property.bgSize = bg_set[2];
			if(!this.property.bgAttachment) this.property.bgAttachment = 'scroll';
			if(selector.indexOf('.figure.like > svg') > -1) {
				getPropertyValueCustom('fill', j['children'][selector]['attributes']['fill'], selector);
			}
		} else {
			this.property.undefined = true;
		}

		var checkMenu = (typeof selectEL != 'undefined' && selectEL == 'el-menu') ? true : false,
			checkFooter = (typeof selectEL != 'undefined' && selectEL == 'el-footer') ? true : false;

		if(checkMenu || checkFooter) {

			var checkSidebar		= (checkMenu) ? $(selector).closest('header.navbar').hasClass('sidebar') : false,
				checkNavLineHeight	= (checkMenu && selector == '.menu-'+SID+' ul.navbar-nav > li > a') ? true : false,
				checkLogoLineHeight	= (checkMenu && selector == '.menu-'+SID+' #tpl-logo-text') ? true : false,
				checkLogoPadding	= (checkMenu && selector == '.menu-'+SID+' .navbar-header') ? true : false;

			var checkFLogoLineHeight= (checkFooter && selector == '.footer-'+SID+' #tpl-logo-text-footer') ? true : false;

			if(checkLogoLineHeight || checkFLogoLineHeight) {
				getPropertyValueCustom('line-height', j['children'][selector]['attributes']['line-height'], selector);
			
			} else if(checkNavLineHeight || checkLogoPadding) {

				if(	typeof j["children"]['@media (min-width: 769px)'] != 'undefined' &&
					typeof j["children"]['@media (min-width: 769px)']["children"][selector] != 'undefined'
				) {
					var children_c = j['children']['@media (min-width: 769px)']['children'][selector]['attributes'];

					if(checkNavLineHeight) {
						if(checkSidebar) {
							if(typeof children_c['padding'] != 'undefined' && children_c['padding']) {
								var nav_pd = {'top':0,'bottom':0,'left':0,'right':0};
								$.each(children_c,function(c_k,c_v) {
									if(c_k == 'padding-top')	nav_pd['top'] = c_v;
									if(c_k == 'padding-bottom')	nav_pd['bottom'] = c_v;
									if(c_k == 'padding-left')	nav_pd['left'] = c_v;
									if(c_k == 'padding-right')	nav_pd['right'] = c_v;
									if(c_k == 'padding') {
										var pd_arr = c_v.replace(/px/gi,'').split(' ');
										nav_pd['top']	= (typeof pd_arr[0] != 'undefined' && pd_arr[0]) ? pd_arr[0] : 0;
										nav_pd['right']	= (typeof pd_arr[1] != 'undefined' && pd_arr[1]) ? pd_arr[1] : nav_pd['top'];
										nav_pd['bottom']= (typeof pd_arr[2] != 'undefined' && pd_arr[2]) ? pd_arr[2] : nav_pd['top'];
										nav_pd['left']	= (typeof pd_arr[3] != 'undefined' && pd_arr[3]) ? pd_arr[3] : nav_pd['right'];
									}
								});

								var nav_f_s = $('.menu-'+SID+' ul.navbar-nav:not("#fixed-menu") > li > a').css('font-size');
								nav_f_s = parseInt(nav_f_s.replace('px',''));

								var nav_f_h = nav_f_s * 1.6,
									nav_pdTopBottom = parseInt(nav_pd['top']) + parseInt(nav_pd['bottom']),
									nav_li_val = parseInt((nav_f_h + nav_pdTopBottom) / nav_f_s * 100);

								this.property.pdTop		= nav_pd['top'];
								this.property.pdBottom	= nav_pd['bottom'];
								this.property.pdLeft	= nav_pd['left'];
								this.property.pdRight	= nav_pd['right'];
								this.property.txLineheight = nav_li_val;
							}
						} else {
							if(typeof children_c['line-height'] != 'undefined' && children_c['line-height']) {
								var li_val = children_c['line-height'];
								if(li_val.indexOf('%') > -1) li_val.replace('%','');
								else if(li_val.indexOf('px') > -1) li_val.replace('px','');
								else if(li_val.indexOf('.') > -1) parseInt(li_val) * 100;

								this.property.txLineheight = parseInt(li_val);
							}
						}
					}

					if(checkLogoPadding) {
						$.each(children_c,function(c_k,c_v) {
							getPropertyValue(c_k,c_v);
						});
					}
				}


			} else {
				var check_el = (checkMenu) ? '.menu-'+SID : '.footer-'+SID;
				this.property.pdTop = parseInt($(check_el).css('padding-top'));
				this.property.pdBottom = parseInt($(check_el).css('padding-bottom'));
			}
		}
		
		// return this.property;
		return base.property;
	};

	this.set = function(j,o,selector,key,val,path) {
		selector = (selector[0] == '.') ? selector : '.' + selector;

		var checkMenu		= (selectEL == 'el-menu') ? true : false,
			checkFooter		= (selectEL == 'el-footer') ? true : false;

		var	checkSidebar	= (checkMenu) ? $(selector).closest('header.navbar').hasClass('sidebar') : false,
			checkNavLineHeight	= (checkMenu && key.indexOf('line-height') > -1 && selector == '.menu-'+SID+' ul.navbar-nav > li > a') ? true : false,
			checkLogoLineHeight	= (checkMenu && key == 'line-height' && selector == '.menu-'+SID+' #tpl-logo-text') ? true : false,
			checkLogoPadding	= (checkMenu && key.indexOf('padding') > -1 && selector == '.menu-'+SID+' .navbar-header') ? true : false,
			checkHeaderPadding	= (checkMenu && key.indexOf('padding') > -1 && selector == '.el-menu') ? true : false;

		var checkFLogoLineHeight= (checkFooter && key == 'line-height' && selector == '.footer-'+SID+' #tpl-logo-text-footer') ? true : false,
			checkGalleryProject = (selector.indexOf('galProjectBg') > -1) ? true : false;
		
		var checkElRoot = (key.match(/^\-\-/) !== null) ? true : false,
			checkRatioPadding = (typeof o.__ratio_padding_top != 'undefined' || typeof o.__ratio_padding_bottom != 'undefined') ? true : false;

		if(!checkNavLineHeight && !checkLogoPadding) {
			var r = initObject(j,selector);
		}

		switch(key) {
			case 'background-color-all':
			case 'background-color':
				o.bgColor = style.getColorORTransparent(val);
				
				if(selectEL=='el-menu') { 
					style.setCssProperty(j,selector,key,o.bgColor); 
				}
				break;
			case 'background-position': 	
				o.bgPosition = (!o.bgPosition || o.bgPosition=='0% 0%') ? 'center center' : o.bgPosition;
				break;
			case 'background-image': 		
				//o.bgUrl = 'url(' + p + '/1200/' + val + ')';
				// val = encodeURIComponent(val);
				var src = getServeImage(val,'0',path);
				o.bgUrl = (val!='none') ? "url('" + src + "')" : val;
				if(selectEL=='el-menu') {
					var version = ($('.'+selectEL).find('header').hasClass('navbar-simple')) ? 'simple' : 'default';
					if($('.'+selectEL).find('.cl-menu-option').length > 0) version = 'moption';
					if(version == 'moption') {
						var moptionEL = $('.'+selectEL).find('.cl-menu-option');
						if(moptionEL.length > 0) {
						} else {							
							var init_bgcolor = j["children"][selector]["attributes"]['background-color'],
								root_bgcolor = (val == 'none') ? init_bgcolor : 'transparent';
							j["children"][selector]["attributes"]['--menu-bgcolor'] = root_bgcolor;
							j["children"][selector]["attributes"]['--menu-bgcolor-hover'] = root_bgcolor;
							j["children"][selector]["attributes"]['--menu-bgcolor-active'] = root_bgcolor;
						}
					} else {
						var selector_set = getMenuCssSelector(key,selector,version);

						if(!$.isEmptyObject(selector_set.delete)) {
							$.each(selector_set.delete, function(k,v) {
								style.deleteCssProperty(j,v);
							});
						}
						
						if(!$.isEmptyObject(selector_set.set)) {
							$.each(selector_set.set, function(k,v) {
								if(k.match(/^media\_/gi) != null) return true;

								v = (v.indexOf('↵') > -1) ? v.replace(/↵/gi, '\n') : v;
								v = v.replace(/\, /gi,'\,');

								if(typeof j["children"][v] == "undefined") initObject(j,v);
								if(val == 'none') {
									var bg_color = $('.bg-picker-el-menu').css('background-color');
									j["children"][v]["attributes"]['background-color'] = bg_color;
								} else {
									if(k.match(/main/gi) !== null) j["children"][v]["attributes"]['background-color'] = 'transparent';
								}
							});
						}
					}

				}
				break;
			// case 'background-attachment': 	
			// 	o.bgAttachment = (o.bgSize == 'cover') ? 'fixed' : 'scroll';
			// 	break;
			case 'background-repeat':
				o.bgRepeat = (!o.bgRepeat) ? 'no-repeat' : o.bgRepeat;
				break;
			case 'background-size': 		
				o.bgSize = (!o.bgSize) ? 'cover' : o.bgSize;
				break;
			case 'color': 					o.txColor = val; break;
			case 'padding':
				if(checkNavLineHeight) return false;
				o.pdTop = this.selector.css('padding-top').replace('px','');
				o.pdBottom = this.selector.css('padding-bottom').replace('px','');
				o.pdLeft = this.selector.css('padding-left').replace('px','');
				o.pdRight = this.selector.css('padding-right').replace('px','');
				break;

			default:
				// root css
				if(checkElRoot) {
					var _key = key.replace(/\-/gi,'_');
					o[_key] = val;

					if($(this.selector).is('[data-gjs="fixedscroll4"]') && key == '--cursor-color') {
						var gseq = this.selector.attr('data-id'),
							gcss = { 'fixedscroll4' : $('#gCSS_fixedscroll4_'+gseq).outerHTML() };
						$('#gCSS_fixedscroll4_'+gseq).replaceWith(gcss.fixedscroll4.replace(/ fill\=\'\%23[a-zA-Z0-9]*\' /gi,' fill=\'' + val.replace(/^\#/,'\%23') + '\' ')
																					.replace(/ stroke\=\'\%23[a-zA-Z0-9]*\' /gi,' stroke=\'' + val.replace(/^\#/,'\%23') + '\' '));
					}
				}
				break;
		}

		if(checkNavLineHeight || checkLogoPadding) {
			// MENU NAV > line-hieght or MENU(sidebar) LOGO > padding
			if(	typeof j["children"]['@media (min-width: 769px)'] == "undefined" ) {
				j["children"]['@media (min-width: 769px)'] = {};				
				j["children"]['@media (min-width: 769px)']["children"] = {};				
				j["children"]['@media (min-width: 769px)']["attributes"] = {};				
			}
			if(	typeof j["children"]['@media (min-width: 769px)']["children"][selector] == "undefined" ) {
				j["children"]['@media (min-width: 769px)']["children"][selector] = {};
				j["children"]['@media (min-width: 769px)']["children"][selector]["children"] = {};
				j["children"]['@media (min-width: 769px)']["children"][selector]["attributes"] = {};
			}

			if(checkSidebar && checkNavLineHeight) {
				if(typeof j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.dropdown-menu > li > a'] == "undefined") {
					j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.dropdown-menu > li > a'] = {};
					j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.dropdown-menu > li > a']["children"] = {};
					j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.dropdown-menu > li > a']["attributes"] = {};
				}

				var nav_val = val.split(',');
				key = 'padding';
				val = nav_val[0];
				j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.dropdown-menu > li > a']["attributes"][key] = nav_val[1];
                
				if(typeof j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.navbar-nav:not(#fixed-menu) > li.dropdown > ul.dropdown-menu'] != "undefined") {
					var nav_pd = val.replace(/px/gi,'').split(' '),
						sub_nav_mgTop = parseInt(parseInt(nav_pd[0]) * 0.4);
					j["children"]['@media (min-width: 769px)']["children"]['.menu-'+SID+' ul.navbar-nav:not(#fixed-menu) > li.dropdown > ul.dropdown-menu']["attributes"]['margin-top'] = -sub_nav_mgTop + 'px';
				}
			}

			j["children"]['@media (min-width: 769px)']["children"][selector]["attributes"][key] = val;

		} else if(checkLogoLineHeight || checkFLogoLineHeight) {
			// MENU LOGO > line-hieght
			j["children"][selector]["attributes"]["line-height"] = val;

		} else if(checkHeaderPadding) {
			delete j["children"]['.menu-'+SID]["attributes"]["padding-left"];
			delete j["children"]['.menu-'+SID]["attributes"]["padding-right"];
			delete j["children"]['.menu-'+SID]["attributes"]["padding-top"];
			delete j["children"]['.menu-'+SID]["attributes"]["padding-bottom"];

			j["children"]['.menu-'+SID]["attributes"]["padding"] = o.pdTop + 'px ' + o.pdRight + 'px ' + o.pdBottom + 'px ' + o.pdLeft + 'px';
		} else {

			// BLOCK (default)
			if(!checkRatioPadding) {
				delete j["children"][selector]["attributes"]["padding-top"];
				delete j["children"][selector]["attributes"]["padding-bottom"];
				delete j["children"][selector]["attributes"]["padding-left"];
				delete j["children"][selector]["attributes"]["padding-right"];
			}

			j["children"][selector]["attributes"]["background-color"] = o.bgColor;
			j["children"][selector]["attributes"]["background-image"] = o.bgUrl;
			// if($(selector).attr('data-parallax') == "true") {
			// 	j["children"][selector]["attributes"]["background-attachment"] = 'fixed';
			// }
			/*
			j["children"][selector]["attributes"]["background-repeat"] = (!j["children"][selector]["attributes"]["background-repeat"]) ? "no-repeat" : this.selector.css('background-repeat');
			j["children"][selector]["attributes"]["background-position"] = (!j["children"][selector]["attributes"]["background-position"]) ? "center center" : this.selector.css('background-position');
			j["children"][selector]["attributes"]["background-size"] = (!j["children"][selector]["attributes"]["background-size"]) ? "cover" : this.selector.css('background-size');
			*/
			j["children"][selector]["attributes"]["background-repeat"] = o.bgRepeat;
			j["children"][selector]["attributes"]["background-position"] = o.bgPosition;
			j["children"][selector]["attributes"]["background-size"] = o.bgSize;
			// j["children"][selector]["attributes"]["background-attachment"] = o.bgAttachment;

			if(!checkGalleryProject) {
				if(!checkRatioPadding) j["children"][selector]["attributes"]["padding"] = o.pdTop+'px ' + o.pdRight+'px ' + o.pdBottom+'px ' + o.pdLeft+'px';
				j["children"][selector]["attributes"]["color"] = o.txColor;
				j["children"][selector]["attributes"]["font-family"] = (typeof this.selector.css('font-family')!='undefined' && this.selector.css('font-family')) ? this.selector.css('font-family') : '';
				j["children"][selector]["attributes"]["font-size"] = (typeof this.selector.css('font-size')!='undefined' && this.selector.css('font-size')) ? this.selector.css('font-size') : '';
			}

			if(checkElRoot) {
				var _key = key.replace(/\-/gi,'_'),
					_val = o[_key];
				j["children"][selector]["attributes"][key] = _val;
			}

		}
		
		return j;
	}


	var getMenuCssSelector = function(key, selector, version) {
		if(version == 'moption') return {'delete': {}, 'set': {}};

		var str = '',
			user = '.menu-' + SID,
			simple_user = (selector.indexOf('menu-temp-')>-1) ? '.menu-temp-' + SID : user,
			default_selector = {
				"color" : { 
					"default" : user + " ul.navbar-nav > li > a,\n" 
								+ user + " ul.navbar-nav > li > a:active,\n"
								+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:active,\n"
								+ user + " .dropdown-menu > li > a:focus",
					"hover"	  : user + ".navbar-default .navbar-nav > li > a:hover,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a:focus,\n" 
								+ user + ".navbar-default .navbar-nav > li:hover > a:active,\n" 
								+ user + ".navbar-default .navbar-nav > li.active > a,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:active,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a:focus,\n" 
								+ user + ".navbar-default .dropdown-menu > li:hover > a:active,\n" 
								+ user + ".navbar-default .dropdown-menu > li.active > a,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:focus,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:active,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:hover",
				},
				"background-color" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu,\n"
								+ user + " .navbar-nav#tpl-menu",
					"init"	  : user + " ul.navbar-nav > li > a,\n" 
								+ user + " ul.navbar-nav > li > a:active,\n"
								+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:active,\n"
								+ user + " .dropdown-menu > li > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li > a,\n"
								+ user + ".navbar-default .navbar-nav > li > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li > a:hover,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a,\n"
								+ user + ".navbar-default .navbar-nav > li:hover > a:focus,\n" 
								+ user + ".navbar-default .navbar-nav > li:hover > a:active,\n" 
								+ user + ".navbar-default .navbar-nav > li.active > a,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:focus,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:active,\n"
								+ user + ".navbar-default .navbar-nav > li.active > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li > a:hover,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a,\n"
								+ user + ".navbar-default .dropdown-menu > li:hover > a:focus,\n" 
								+ user + ".navbar-default .dropdown-menu > li:hover > a:active,\n" 
								+ user + ".navbar-default .dropdown-menu > li.active > a,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:focus,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:active,\n"
								+ user + ".navbar-default .dropdown-menu > li.active > a:hover",
				},
				"background-color-all" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu,\n"
								+ user + " .navbar-nav#tpl-menu",
				},
				"background-image" : {
					"default" : user + " .navbar-nav#tpl-menu .dropdown .dropdown-menu",
				},
				"border-color" : {
					"default" : "",
				},
				"font-size" : {
					"default" : user + " ul.navbar-nav > li > a,\n" 
						  		+ user + " ul.navbar-nav > li > a:focus,\n"
								+ user + " .dropdown-menu > li > a,\n"
								+ user + " .dropdown-menu > li > a:focus",
				},
				"font-family" : {
					"default" : user + " ul.navbar-nav > li > a,\n"
								+ user + " .dropdown-menu > li > a",
				},

			},
			simple_selector = {
				"color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color-all" : {
					"menublock"		: simple_user,
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-image" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"border-color" : {
					"main_default"	: " ",
					"main_hover"	: " ",
					"main_active"	: " ",
					"sub_default"	: " ",
					"sub_hover"		: " ",
					"sub_active"	: " ",
				},
				"font-size" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"font-family" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"logo-color"  : {
					"color"				: simple_user + " #mini-home",
				},
			},
			fheader_selector = {
				"color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav:not(#fixed-menu) > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav:not(#fixed-menu) > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav:not(#fixed-menu) > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav:not(#fixed-menu) > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-color-all" : {
					"menublock"		: simple_user,
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav:not(#fixed-menu) > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav:not(#fixed-menu) > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"background-image" : {
					"main_default"	: simple_user   + " ul.navbar-nav > li > a,\n"
									  + simple_user + " ul.navbar-nav > li > a:focus",
					"main_hover"	: simple_user   + " ul.navbar-nav:not(#fixed-menu) > li > a:hover,\n"
									  + simple_user + " ul.navbar-nav:not(#fixed-menu) > li:hover > a",
					"main_active"	: simple_user   + " ul.navbar-nav > li.active > a,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:focus,\n"
									  + simple_user + " ul.navbar-nav > li.active > a:hover",
					"sub_default"	: simple_user   + " ul.dropdown-menu > li > a,\n"
									  + simple_user + " ul.dropdown-menu > li > a:focus",
					"sub_hover"		: simple_user   + " ul.dropdown-menu > li > a:hover,\n"
									  + simple_user + " ul.dropdown-menu > li:hover > a",
					"sub_active"	: simple_user   + " ul.dropdown-menu > li.active > a,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:focus,\n"
									  + simple_user + " ul.dropdown-menu > li.active > a:hover",
				},
				"border-color" : {
					"main_default"	: " ",
					"main_hover"	: " ",
					"main_active"	: " ",
					"sub_default"	: " ",
					"sub_hover"		: " ",
					"sub_active"	: " ",
				},
				"font-size" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"font-family" : {
					"main_default" : user + " ul.navbar-nav > li > a" ,
					"sub_default"  : user + " ul.dropdown-menu > li > a",
				},
				"logo-color"  : {
					"color"				: simple_user + " #mini-home",
				},
			};


		if(version == 'mnormalsidebar') {
			var tmp_del = (typeof default_selector[key] != 'undefined') ? default_selector[key] : {};

			switch(key) {
				case 'background-color':
					tmp_del = Object.assign(tmp_del, fheader_selector[key]);
					break;

				case '--menu-color':
					if(typeof tmp_del['media_max_768'] == 'undefined') tmp_del['media_max_768'] = [];
					var tmp_add = ['.el-menu .siteCART.micon', '#mobile-nav.mobile-design-clear .mobilenav_top a', '#mobile-nav.mobile-design-clear .mobilenav_top svg','#mobile-nav.mobile-design-clear #tpl-menu li.menu-has-children i,					#mobile-nav.mobile-design-clear #tpl-menu li.menu-has-children i:focus','#mobile-nav.mobile-design-clear #tpl-menu li.menu-has-children.active i'],
						tmp_sum = tmp_del['media_max_768'].concat(tmp_add);
					tmp_del['media_max_768'] = tmp_sum.filter((s, v) => tmp_sum.indexOf(s) === v);
					break;

				case '--menu-fname':
				case '--sub-menu-fname':
					if(typeof tmp_del['media_max_768'] == 'undefined') tmp_del['media_max_768'] = [];
					var tmp_add = ['#mobile-nav','#mobile-nav'],
						tmp_sum = tmp_del['media_max_768'].concat(tmp_add);
					tmp_del['media_max_768'] = tmp_sum.filter((s, v) => tmp_sum.indexOf(s) === v);
					break;

				default:
					break;
			}
			
			str = {'delete': tmp_del, 'set': {}};
		} else if(version == 'fheader') {
			str = { "set" : fheader_selector[key] } ;
		} else if(version == 'simple') {
			str = { "delete" : default_selector[key], "set" : simple_selector[key] } ;
		} else {
			str = { "delete" : {}, "set" : default_selector[key] };
		}

		return str;
	}

	var setFlogoCssSelector = function(key, selector, version) {		
		var str = '',
			user = '.footer-' + SID,
			fheader_selector = {
				'logo-color'  : {
					'color'				: user + ' #mini-home-footer',
				},
			};

		if(version == 'footerlogo') {
			str = { 'set' : fheader_selector[key] } ;
		} 

		return str;
	}


	this.setCssProperty = function(j,selector,key,val) {
		selector = (selector.indexOf('↵') > -1) ? selector.replace(/↵/gi, '\n') : selector;
		selector = selector.replace(/\, /gi,'\,');
		if(selector == '.dsgn-body') selectEL = '';

		if(typeof j['children'][selector] == 'undefined') j = initObject(j,selector);
		var isfooterAttach = false;
		if(selectEL == 'el-footer') {
			isfooterAttach = typeof $('.'+selectEL+' .footer-brand img').attr('data-footer-attach') == 'undefined' ? false : $('.'+selectEL+' .footer-brand img').attr('data-footer-attach');
		}

		if(selectEL == 'el-menu') {	
            var selectorKey = (key == 'color' && selector == '.menu-'+SID+' #tpl-logo-text') ? 'logo-color' : key,
				version = ($('.'+selectEL).find('header').hasClass('navbar-simple')) ? 'simple' : 'default';
			if($('.'+selectEL).find('[class*=cl-menu-]').length > 0) version = ($('.'+selectEL).find('.cl-menu-option').length > 0) ? 'moption' : 'mnormalsidebar';
			else if($('.'+selectEL).find('header').hasClass('navbar-fheader')) version = 'fheader';

			var selector_set = getMenuCssSelector(key,selector,version);
			if(!$.isEmptyObject(selector_set.delete)) {
				$.each(selector_set.delete, function(k,v) {
					if(k.match(/^media\_/gi) != null) style.deleteMediaCssProperty(j,v,k);
					else style.deleteCssProperty(j,v);
				});
			}

			if(key == 'background-color-all') key = 'background-color'; //menu block - all background color change
			if(!$.isEmptyObject(selector_set.set)) {
				if( selector == '.menu-'+SID+' ul#tpl-menu > li > a' || selector == '.menu-' + SID || selector == '.menu-temp-' + SID ) {
					if(selector == '.menu-'+SID+' ul#tpl-menu > li > a') style.deleteCssProperty(j,selector);
					
					var color = (key == 'color') ? this.setStyle(j,hex2rgb(val),'el-menu') : [];
				
					$.each(selector_set.set, function(k,v) {
						if(k.match(/^media\_/gi) != null) return true;

						v = (v.indexOf('↵') > -1) ? v.replace(/↵/gi, '\n') : v;
						v = v.replace(/\, /gi,'\,');

						var value = (color.length== 0) ? val : ((k.match(/default/gi) !== null) ? color[0] : color[1]);
						if(typeof j['children'][v] == 'undefined') initObject(j,v);

						if( key == 'background-color' && value.indexOf('transparent') == -1 && value.indexOf('rgba(0,0,0,0)') == -1 ) {
							var menu_bg_img = (typeof $('.'+selectEL).find('header').css('background-image') != 'undefined') ? $('.'+selectEL).find('header').css('background-image') : '';
							if(menu_bg_img && menu_bg_img!='none' && menu_bg_img!='initial' && menu_bg_img!='inherit') {
								// [MENU BLOCK] used Background-Image, ==> main menu bg : transparent, sub menu bg : color
								if(k.match(/main/gi) !== null ) value ='transparent';
							}
						}
						
						if( key == 'font-size' && k.match(/sub/gi) !== null ) { //Sub Menu Font size 
							var f_size = parseInt(value.replace('px',''));
							value = (f_size - 2 ) + 'px';
						}

						if( key == 'color' && (version == 'simple' || version == 'fheader') && k == 'main_default' ) { //Menu text color Change ==> Mobile Toggle bar color
							var block_selector = (selector.indexOf('menu-temp-')>-1) ? '.menu-temp-' + SID : '.menu-' + SID,
								toggle_bar_selector = block_selector + ' .navbar-toggle .icon-bar';

							if(typeof j['children'][toggle_bar_selector] == 'undefined') initObject(j,toggle_bar_selector);
                            j['children'][toggle_bar_selector]['attributes']['background-color'] = value;
						}

						j['children'][v]['attributes'][key] = value;
					});

				} else {
					
                    if(selectorKey == 'logo-color') { //logo text color Change ==> Logo Top btn color width Change

                        var menu_btn_set = getMenuCssSelector(selectorKey,selector,version);
                        if(typeof menu_btn_set.set != 'undefined' && menu_btn_set.set) {
	                        $.each(menu_btn_set.set, function(k,v) {
								if(k.match(/^media\_/gi) != null) return true;

	                            if(typeof j['children'][v] == 'undefined') initObject(j,v);
	                            j['children'][v]['attributes'][k] = val;
	                        });
                        }
                    }
					j['children'][selector]['attributes'][key] = val;
				}
			} else {
				j['children'][selector]['attributes'][key] = val;
				
				if($.inArray(version, ['moption', 'mnormalsidebar']) > -1) {
					switch(key) {
						case 'background-color':
							j['children'][selector]['attributes']['--block-bgcolor'] = val; 
							j['children'][selector]['attributes']['--menu-bgcolor'] = val; 
							j['children'][selector]['attributes']['--menu-bgcolor-hover'] = val; 
							j['children'][selector]['attributes']['--menu-bgcolor-active'] = val; 
							j['children'][selector]['attributes']['--sub-menu-bgcolor'] = val; 
							j['children'][selector]['attributes']['--sub-menu-bgcolor-hover'] = val; 
							j['children'][selector]['attributes']['--sub-menu-bgcolor-active'] = val; 
							break;

						case '--block-bgcolor': 
							j['children'][selector]['attributes']['background-color'] = val; 
							break;

						default:
							break;
					}
				}
			}

		} else if(selectEL=='el-footer' && isfooterAttach) {

			var selectorKey = (key == 'color' && selector == '.footer-'+SID+' #tpl-logo-text-footer') ? 'logo-color' : key;

			if(selectorKey == 'logo-color') { 
                var footer_logo_set = setFlogoCssSelector(selectorKey, '' ,'footerlogo');
                if(typeof footer_logo_set.set != 'undefined' && footer_logo_set.set) {
                    $.each(footer_logo_set.set, function(k,v) {
                        if(typeof j['children'][v] == 'undefined') initObject(j,v);
                        j['children'][v]['attributes'][k] = val;
                    });
                }
            }

			j['children'][selector]['attributes'][key] = val;
		} else {

			if(selector.indexOf('.figure.like') > -1) {
				if(selector.indexOf('.figure-like-cnt') == -1 && selector.indexOf('svg') == -1) {
					style.deleteCssProperty(j, selector);
					if(j['children'][selector+' > svg'] === undefined) initObject(j,selector+' > svg');
					if(j['children'][selector + ' .figure-like-cnt'] === undefined) initObject(j,selector+' .figure-like-cnt');

					if(selector.indexOf('.active') > -1) {
						style.deleteCssProperty(j, selector+' > svg');
						if(j['children'][selector+' > svg,\n'+selector+' > svg > path:first-child'] === undefined) initObject(j,selector+' > svg,\n'+selector+' > svg > path:first-child');
						j['children'][selector+' > svg,\n'+selector+' > svg > path:first-child']['attributes']['fill'] = val;
					} else {
						j['children'][selector+' > svg']['attributes']['fill'] = val;
					}

					j['children'][selector + ' .figure-like-cnt']['attributes']['color'] = val;
				} else {
					if(selector.indexOf('svg') > -1) {
						j['children'][selector]['attributes']['fill'] = val;
					}
					if(selector.indexOf('.figure-like-cnt') > -1) j['children'][selector]['attributes']['color'] = val;
				}
			} else {
				if(key == 'font-hover-color') { //forum block - list hover color change
					key = 'color';
					j['children'][selector]['attributes']['fill'] = val;
					val = val + ' !important';
				}
				if(key == 'fmap-point-color') {
					// if(j['children'][selector]) return true;
					j['children'][selector + ' .form-group .dropdown-toggle:focus,\n' + selector + ' .form-group input[type="text"]:focus']['attributes']['border-color'] = val;
					
					if(j['children'][selector + ' .btn.map-search-btn']['attributes']['fill'] != undefined) {
						j['children'][selector + ' .btn.map-search-btn']['attributes']['fill'] = val;
					} else {
						j['children'][selector + ' .btn.map-search-btn']['attributes']['background-color'] = val;
					}

					if(j['children'][selector + ' .map-search-wrap']['attributes']['background-color'] != undefined && $(selector + ' .map-search-wrap').hasClass('fm-pcolor-background')) {
						let opacity = Coloris.getColorInfo(j['children'][selector + ' .map-search-wrap']['attributes']['background-color'], 'alpha');
						let bgColor = getRgbaValArray(val, opacity);
						j['children'][selector + ' .map-search-wrap']['attributes']['background-color'] = bgColor.rgba_txt;
					}

					if(j['children'][selector + ' .map-item-list .item:hover'] != undefined) {
						if(j['children'][selector + ' .map-item-list .item:hover']['attributes']['border-color'] != undefined) {
							let opacity = Coloris.getColorInfo(j['children'][selector + ' .map-item-list .item:hover']['attributes']['border-color'], 'alpha');
							let borderHoverColor = getRgbaValArray(val, opacity);

							key = 'border-color';
							j['children'][selector + ' .map-item-list .item:hover']['attributes']['border-color'] = borderHoverColor.rgba_txt;
						}
						if(j['children'][selector + ' .map-item-list .item:hover']['attributes']['background-color'] != undefined) {
							let opacity_selected = Coloris.getColorInfo(j['children'][selector + ' .map-item-list .item.selected']['attributes']['background-color'], 'alpha');
							let opacity_hover = Coloris.getColorInfo(j['children'][selector + ' .map-item-list .item:hover']['attributes']['background-color'], 'alpha');
							let bgSelectedColor = getRgbaValArray(val, opacity_selected);
							let bgHoverColor = getRgbaValArray(val, opacity_hover);
							key = 'background-color';
							val = bgSelectedColor.rgba_txt;
							j['children'][selector + ' .map-item-list .item:hover']['attributes']['background-color'] = bgHoverColor.rgba_txt;
						}
					}
					
					if(j['children'][selector + ' .map-item-list .item:hover .overlay'] != undefined && $(selector + ' .map-item-list .item .overlay').hasClass('fm-pcolor-background')) {
						let opacity_selected = Coloris.getColorInfo(j['children'][selector + ' .map-item-list .item.selected .overlay']['attributes']['background-color'], 'alpha');
						let opacity_hover = Coloris.getColorInfo(j['children'][selector + ' .map-item-list .item:hover .overlay']['attributes']['background-color'], 'alpha');
						let bgSelectedColor = getRgbaValArray(val, opacity_selected);
						let bgHoverColor = getRgbaValArray(val, opacity_hover);
						key = 'background-color';
						val = bgSelectedColor.rgba_txt;
						j['children'][selector + ' .map-item-list .item:hover .overlay']['attributes']['background-color'] = bgHoverColor.rgba_txt;

						selector = selector + ' .map-item-list .item.selected .overlay';
					} else {
						key = 'border-color';
						selector = selector + ' .map-item-list .item.selected';
					}
					console.log('key', key);
				}
				if(selector.indexOf('p.figure') > -1 && key=='color'){
					j['children'][selector]['attributes']['fill'] = val;
				}
				if(selector.indexOf('.figure.like') > -1 && selector.indexOf('.active') == -1) {
					j['children'][selector+' > svg']['attributes']['fill'] = val;
					selector = selector + ' .figure-like-cnt';
				}
				if(selector.indexOf('.figure.like.active') > -1) {
					j['children'][selector+' > svg,\n'+selector+' > svg > path:first-child']['attributes']['fill'] = val;
					selector = selector + ' .figure-like-cnt';
				}
				if(selector.indexOf('.tpl-forum-list-etc') > -1) {
					if(j['children'][selector+' > svg'] === undefined) initObject(j,selector+' > svg');
					if(val.indexOf('px') > -1) {
						j['children'][selector+' > svg']['attributes']['width'] = val;
						j['children'][selector+' > svg']['attributes']['height'] = val;
					} else {
						if(key == 'color') j['children'][selector+' > svg']['attributes']['fill'] = val;
					}

					var forumLikeSelector = selector.replace('.tpl-forum-list-etc', '.tpl-forum-list-like');
					if(j['children'][forumLikeSelector+' .forum-like-cnt'] === undefined)  initObject(j, forumLikeSelector+' .forum-like-cnt');
					if(key == 'color') j['children'][forumLikeSelector+' .forum-like-cnt']['attributes']['color'] = val;
				}
				if(selector.indexOf('.tpl-forum-list-icon') > -1) { 
					if(j['children'][selector+' > svg'] === undefined) initObject(j,selector+' > svg');
					if(val.indexOf('px') > -1) {
						j['children'][selector+' > svg']['attributes']['width'] = val;
						j['children'][selector+' > svg']['attributes']['height'] = val;
					} else {
						if(key == 'color') j['children'][selector+' > svg']['attributes']['fill'] = val;
					}
				}
				if(selector.indexOf('.gallery-sort-nav') > -1 || selector.indexOf('.review-sort-nav') > -1) {
					if(key == 'color') j['children'][selector]['attributes']['fill'] = val;
				}
				j['children'][selector]['attributes'][key] = val;
				//Media Query Css도 변경
				$.each(j['children'],function(i,v){
					if(i.indexOf('@media') > -1 && typeof j['children'][i]['children'][selector] != 'undefined') {
						if(typeof j['children'][i]['children'][selector]['attributes'][key] != 'undefined') j['children'][i]['children'][selector]['attributes'][key] = val;
					}
				});
			}


		}
	
		return j;
	}
	
	this.getCssProperty = function(j,selector,key) {
		if(typeof j['children'][selector] == 'undefined') j = initObject(j,selector);
		if(typeof j['children'][selector]['attributes'][key] == 'undefined') {
			var tmp_v = 'initial';
			if(key == 'border-color') {
				var colorRegex = Coloris.getColorRegex(),
					tmp_color = (typeof j['children'][selector]['attributes']['border'] != 'undefined') ? j['children'][selector]['attributes']['border'] : '',
					tmp_matches = tmp_color.match(colorRegex);

				if(tmp_matches != null) tmp_v = tmp_matches.pop();
			}

			j['children'][selector]['attributes'][key] = tmp_v;
		}
		return j['children'][selector]['attributes'][key];
	}

	this.deleteMediaCssProperty = function(j,selector,media,key) {
		if(typeof key == 'undefined') key = '';

		var tmp = media.split('_'),
			tmp_media_minmax = tmp[1],
			tmp_media_size = tmp[2],
			tmp_media_size_selector = [];

		switch(tmp_media_size) {
			case '767':
				tmp_media_size_selector.push('@media (max-width: 767px)');
				tmp_media_size_selector.push('@media only screen and (max-width:767px)');
				break;
			case '768':
				tmp_media_size_selector.push('@media (max-width: 768px)');
				tmp_media_size_selector.push('@media only screen and (max-width:768px)');
				break;
			case '991':
				tmp_media_size_selector.push('@media (max-width: 991px)');
				tmp_media_size_selector.push('@media only screen and (max-width:991px)');
				break;
			default:
				break;
		}

		$.each(tmp_media_size_selector, function(tmp_idx, tmp_selector) {
			if(	typeof j['children'][tmp_selector] != 'undefined' && 
				typeof j['children'][tmp_selector]['children'] != 'undefined'
			) {

				$.each(selector, function(tmp_idx2, tmp_selector2) {
					if(typeof j['children'][tmp_selector]['children'][tmp_selector2] != 'undefined') {
						if(key == '') {
							delete j['children'][tmp_selector]['children'][tmp_selector2];
						} else {                            
							if(typeof j['children'][tmp_selector]['children'][tmp_selector2]['attributes'] != 'undefined' && typeof j['children'][tmp_selector]['children'][tmp_selector2]['attributes'][key] != 'undefined') {
								delete j['children'][tmp_selector]['children'][tmp_selector2]['attributes'][key];
							}
							if(JSON.stringify(j['children'][tmp_selector]['children'][tmp_selector2]['attributes']) === '{}') delete j['children'][tmp_selector]['children'][tmp_selector2];
						}
					}
				});
			}
		});
		return j;
	}
	this.deleteCssProperty = function(j,selector,key) {
		if(typeof key == 'undefined') key = [];
		else if(typeof key == 'string') key = key.split(',');

		if(typeof j['children'][selector] == 'undefined') j = initObject(j,selector);

		if(key.length == 0) {
			delete j['children'][selector];
		} else {
			$.each(key, function(i,k) {
				if(typeof j['children'][selector]['attributes'] != 'undefined' && typeof j['children'][selector]['attributes'][k] != 'undefined') {
					delete j['children'][selector]['attributes'][k];
				}
			});
			if(JSON.stringify(j['children'][selector]['attributes']) === '{}') delete j['children'][selector];
		}
		return j;
	}


	this.replaceCss = function(j,change) {
		if(typeof j == 'undefined') return {};
		if(typeof change == 'undefined') return j;

		var return_type = typeof j,
			tmp_j = (return_type == 'object') ? CSSJSON.toCSS(j) : j;

		function repalceEscapeRegExp(str) {
			return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}

		$.each(change, function(i,tmp_o) {
			if(typeof tmp_o.before === 'undefined' 
				|| typeof tmp_o.after === 'undefined'
			) {
				return true;
			}

			var tmp_escaped_before = repalceEscapeRegExp(tmp_o.before),
				tmp_regex = new RegExp(tmp_escaped_before, 'g');
			tmp_j = tmp_j.replace(tmp_regex, tmp_o.after);
		})

		return (return_type == 'string') ? tmp_j : CSSJSON.toJSON(htmlspecialchars_decode(tmp_j));
	}

	this.find = function(j,selector) {
		for(var key in j.children) {
			// if(key.indexOf(selector)>-1) return j.children[key].attributes['background-image'].trim().replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
			if(key.indexOf(selector)>-1) {
				var r = (typeof j.children[key].attributes['background-image'] != 'undefined' && j.children[key].attributes['background-image']) ? j.children[key].attributes['background-image'].trim() : '';
				if(r.length > 0 && r.match(/url\((.*?)\)/) !== null) r =  r.match(/url\((.*?)\)/)[1].replace(/('|")/g,'');
				
				return (r) ? r : '';
			}
		}
	}

	this.setTargetBackground = function(j,selector,val,p) {
		val = encodeURIComponent(val);
		for(var key in j.children) {
			if(key.indexOf(selector)>-1) {
				val = encodeURIComponent(val);
				j.children[key].attributes['background-image'] = "url(" + p + '/' + val + ")";
			}
		}
		return j;
	}

	this.getHex = function(rgb) {
		if(rgb == 'transparent') return rgb;

		var rgb = this.getRGBobject(rgb),
	    	r = parseInt(rgb.r, 10).toString(16),
        	g = parseInt(rgb.g, 10).toString(16),
        	b = parseInt(rgb.b, 10).toString(16);

    	return '#'+ (
		        (r.length == 1 ? '0'+ r : r) +
		        (g.length == 1 ? '0'+ g : g) +
		        (b.length == 1 ? '0'+ b : b)
	        );
	}

	this.getRGBobject = function(rgb) {
		if(typeof rgb == 'undefined') rgb = 'rgb(255,255,255)';
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		var r = [];

		r.r = rgb[1], r.g = rgb[2], r.b = rgb[3];
    	return r;
	}

	this.getRgbaAlpha = function(rgba) {
		if(typeof rgba != 'undefined' && rgba && rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i) != null) {
			var rgba = rgba.split(',');
			return rgba[3].replace(/\)/,'');
		} else {
			return '';
		}
	}

	function cutHex(h) {return (h.charAt(0)=='#') ? h.substring(1,7):h}

	this.setStyle = function(j,rgb,el) {
		var r = parseInt(rgb.r), g = parseInt(rgb.g), b = parseInt(rgb.b),
			r1 = (r + 50 < 256) ? r + 50 : 255,
			g1 = (g + 50 < 256) ? g + 50 : 255,
			b1 = (b + 50 < 256) ? b + 50 : 255,
			r2 = (r - 50 > -1 ) ? r - 50 : 0,
			g2 = (g - 50 > -1 ) ? g - 50 : 0,
			b2 = (b - 50 > -1 ) ? b - 50 : 0,
			r3 = (r + 100 < 256 ) ? r + 100 : 255,
			g3 = (g + 100 < 256 ) ? g + 100 : 255,
			b3 = (b + 100 < 256 ) ? b + 100 : 255;

		var c1 = rgb2hex(r,g,b),
			c2 = rgb2hex(r1,g1,b1),
			c3 = rgb2hex(r2,g2,b2),
			c4 = rgb2hex(r3,g3,b3);

		if(el == 'el-menu') {
			return [c1,c2];
		} else if (el =='rolling-index') {
			if(r<80 && g<80 && b<80) return [c1,c4];
			else if (r<150 && g<150 && b<150) return [c1,c2];
			else return [c1,c3];
		} else {
			return setStyleValue(j,c1,c2,c3);
		}
		
	}

	var setStyleValue = function(j,c1,c2,c3) {
		$.each(j.children, function(k,v) {
			switch(k) {
				// color
				case '.dsgn-body h3,\n.dsgn-body h4,\n.dsgn-body h5' :
				case '.dsgn-body a':
				case '.dsgn-body .alternative-font':
				case '.dsgn-body div.tabs ul.nav-tabs a,\n.dsgn-body div.tabs ul.nav-tabs a:hover':
					v.attributes['color'] = c1;
					break;

				case '.dsgn-body header ul.nav-main > li:hover > a,\n.dsgn-body header ul.nav-main li.active > a,\n.dsgn-body header ul.nav-main li.active > a:hover,\n.dsgn-body header ul.nav-main li.active > a:focus,\n.dsgn-body header ul.nav-main li.active i.icon-caret-down':
					v.attributes['color'] = c1 + ' !important';
					break;

				case '.dsgn-body a:hover':
					v.attributes['color'] = c2;
					break;

				case '.dsgn-body a:active':
					v.attributes['color'] = c3;
					break;

				// background-color
				case '.dsgn-body .text-bg':
				case '.dsgn-body .pagination > .active > a,\n.dsgn-body .pagination > .active > span,\n.dsgn-body .pagination > .active > a:hover,\n.dsgn-body .pagination > .active > span:hover,\n.dsgn-body .pagination > .active > a:focus,\n.dsgn-body .pagination > .active > span:focus':
				case '.dsgn-body .label-primary':
					v.attributes['background-color'] = c1 + ' !important';
					break;

				// background-color + border-color
				case '.dsgn-body .btn-primary,\n.dsgn-body .pagination > .active > a,\n.dsgn-body ul.nav-pills > li.active > a':
					v.attributes['background-color'] = c1;
					v.attributes['border-color'] = '#006da3';
					break;
				/*
				case '.dsgn-body .btn-primary:hover,\n.dsgn-body .pagination > .active > a:hover,\n.dsgn-body ul.nav-pills > li.active > a:hover':
					v.attributes['background-color'] = '#008fd6';
					v.attributes['border-color'] = '#0074ad';
					break;
				*/
				case '.dsgn-body .btn-primary:focus,\n.dsgn-body .pagination > .active > a:focus,\n.dsgn-body ul.nav-pills > li.active > a:focus':
					v.attributes['background-color'] = '#007ab8';
					v.attributes['border-color'] = '#007ab8';
					break;

				case '.dsgn-body .btn-default,\n.dsgn-body .btn-default.btn-lg,\n.dsgn-body .btn-default.btn-sm,\n.dsgn-body .btn-default.btn-xs':
				case '.dsgn-body .label-default':
					v.attributes['border-color'] = c1;
					v.attributes['background-color'] = 'transparent';
					v.attributes['color'] = c1;
					break;

				case '.dsgn-body .btn-default:hover,\n.dsgn-body .btn-default.btn-lg:hover,\n.dsgn-body .btn-default.btn-sm:hover,\n.dsgn-body .btn-default.btn-xs:hover':
					v.attributes['border-color'] = c2;
					v.attributes['background-color'] = '#0D0D0D';
					v.attributes['color'] = c2;
					break;

				case '.dsgn-body .btn-default:focus,\n.dsgn-body .btn-default.btn-lg:focus,\n.dsgn-body .btn-default.btn-sm:focus,\n.dsgn-body .btn-default.btn-xs:focus':
					v.attributes['border-color'] = c3;
					v.attributes['background-color'] = '#000000';
					v.attributes['color'] = c3;
					break;

				case '.dsgn-body div.tabs ul.nav-tabs a:hover':
					v.attributes['border-top-color'] = c1;
					break;

				case '.dsgn-body div.tabs ul.nav-tabs li.active a':
					v.attributes['border-top-color'] = c1;
					v.attributes['color'] = c1;
					break;
			}
		});
		return j;
	}

	this.selectFontForm = function(cls,fn,font) {
		if(typeof font=='undefined' || !font) {
			// console.log('undefined font-family');
			return false;
		}
		var tf = font.split(',');
		fn = tf[0].replace(/'/g,'').replace(/"/g,'').replace('-',' ').trim();
		var str = '';

		str = '<div class="' + cls + '">';
		for(i=0;i<this.fonts.length;i++) {
			fonts_check = (fn==this.fonts[i]) ? 'class="active"' : '';
			var font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(font_name.substring(0,1) != '@')
				str = str + '<div value="' + this.fonts[i] + '" ' + fonts_check + ' data-font-family="' + this.fonts[i] + '" style="font-family:' + this.fonts[i] + ';">' + font_name + '</div>';
			else
				str = str + '<hr />';
		}
		str = str + '</div>';
		return str;
	}

	this.rgbahex = function(rgb) {
		var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? '#' +
				('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
				('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
				('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	this.selectGalleryCategoryColorSetForm = function(cls,fn,el,elname,colortype) {

		var now_palette_html = '',
			now_palette_arr = {},
			pn = '',
			selector = {
				'default': '.'+elname+' .gallery-category-nav li:not(.active) a, .'+elname+' .gallery-category-nav li:not(.active):before',
				'active': '.'+elname+' .gallery-category-nav li.active a, .'+elname+' .gallery-category-nav li a:hover, .'+elname+' .gallery-category-nav li a:focus, .'+elname+' .gallery-category-nav li.active:after',
			}
			default_color = ($('.'+elname).css('color') != 'undefined') ? $('.'+elname).css('color') : $('.dsgn-body').css('color');

		$.each(fn, function(i,v) {
			var checkColor = (typeof v == 'undefined' || v == '') ? false : ((Coloris.getColorInfo(v,'alpha') > 0) ? true : false),
				color = v,
				tmp_pn = i.match(/gc_color_(.*?)(?:_active|$)/)[1],
				tmp_status = (i.match(/\_active$/) != null) ? 'active' : 'default';

			if(checkColor) {
				pn += ((pn != '') ? ',' : '') + i;
			}

			if(typeof now_palette_arr[tmp_pn] == 'undefined') now_palette_arr[tmp_pn] = [];
			var gc_state = (tmp_pn != 'font') ? 'data-gc-state="'+checkColor+'"' : '',
				clr_pn = (tmp_pn == 'font') ? 'color' : tmp_pn+'-color',
				clr_picker = (checkColor) ? getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alphaoff clr-tooltipoff'}) : '';

			now_palette_arr[tmp_pn].push(`
					<div class="${tmp_status}-color" ${gc_state}>
						${clr_picker}
					</div>
			`);
		});

		$.each(now_palette_arr, function(i, arr) {
			if(arr.length == 0 || arr[0].match(/data\-gc\-state\=\"false\"/) != null && arr[1].match(/data\-gc\-state\=\"false\"/) != null) return;

			now_palette_html += `
				<div class="color-line">
					<div class="option_name">${$.lang[LANG]['editor.gallery.category.'+i]}</div>
					${arr[0]}
					${arr[1]}
				</div>
			`;
		})

		var colorset = ['black', 'gray', 'white', ''];
		$.each(colorset, function(i, v) {
			colorset[i] = (v == colortype) ? 'active' : '';
		});

		var str = '\
			<div class="btn-group btn-group-sm">\
				<div  class="btn-color-mode ' + colorset[0] + '">\
					<button type="button" class="ctrl-gc-color" data-type="black" data-elname="' + elname + '" data-pn="' + pn + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorset[1] + '">\
					<button type="button" class="ctrl-gc-color" data-type="gray" data-elname="' + elname + '" data-pn="' + pn + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorset[2] + '">\
					<button type="button" class="ctrl-gc-color" data-type="white" data-elname="' + elname + '" data-pn="' + pn + '"></button>\
				</div>\
				<div class="btn-color-mode btn-group now-color-palette ' + colorset[3] + '">\
					<button type="button" class="ctrl-gc-color" data-type="custom">'+ initSVGIcon('cog_15','bc-svg-config')+ '</button>\
					<div class="dropdown-menu">\
						<div class="color-picker-wrap">\
							<div class="header-line">\
								<div class="option_name"></div>\
								<div class="default_color">' + $.lang[LANG]["editor.gallery.category.standard"] + '</div>\
								<div class="active_color">' + $.lang[LANG]["editor.gallery.category.rollover"] + '</div>\
							</div>\
							' + now_palette_html + '\
						</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;
	}

	this.selectTabsCategoryColorSetForm = function(cls,fn,el,elname,colortype,tab_case) { //qwer
		var now_palette_html = '',
			now_palette_arr = {},
			pn = '',
			selector = {
				'default': '.'+elname+' .tab',
				'active': '.'+elname+' .tab.active',
				'hover' : '.'+elname+' .tab.hover'
			}
			default_color = ($('.'+elname).css('color') != 'undefined') ? $('.'+elname).css('color') : $('.dsgn-body').css('color'),
			isborder = ($('.'+elname).attr('tab-borderchk') != 'undefined') ? $('.'+elname).attr('tab-borderchk') : 'false',
			borderchk = (isborder == 'false') ? 'disabled' : '',
			isbackground = ($('.'+elname).attr('tab-backgroundchk') != 'undefined') ? $('.'+elname).attr('tab-backgroundchk') : 'false',
			backgroundchk = (isbackground == 'false') ? 'disabled' : '';

		$.each(fn, function(i,v) {
			var checkColor = true,
				color = v,
				tmp_pn = i.match(/gc_color_(.*?)(?:_active|_hover|$)/)[1],
				tmp_status = (i.match(/\_active$/) != null) ? 'active' : (i.match(/\_hover$/) != null)? 'hover' : 'default';
			if(checkColor) {
				pn += ((pn != '') ? ',' : '') + i;
			}

			if(typeof now_palette_arr[tmp_pn] == 'undefined') now_palette_arr[tmp_pn] = [];
			var gc_state = (tmp_pn != 'font') ? 'data-gc-state="'+checkColor+'"' : '',
				clr_pn = (tmp_pn == 'font') ? 'color' : tmp_pn+'-color',
				clr_picker = '';

			if(tab_case == 'tab6') {
				if(tmp_pn == 'border') {
					if(tmp_status == 'hover') {
						clr_picker = getColorisHtml(color,'gcconfig',{'pn':'--tab-bg-hover', 'el':selectEL, 'selector': '.'+elname},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBorder'});
					} else if(tmp_status == 'active') {
						clr_picker = getColorisHtml(color,'gcconfig',{'pn':'--tab-bg-active', 'el':selectEL, 'selector': '.'+elname},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBorder'});
					} else {
						clr_picker = getColorisHtml(color,'gcconfig',{'pn':'--tab-bg-default', 'el':selectEL, 'selector': '.'+elname},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBorder'});
					}

				} else if(tmp_pn == 'background') clr_picker = getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBackground'});
				else clr_picker = getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsColor'});
			} else {
				if(tmp_pn == 'border') clr_picker = getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBorder'});
				else if(tmp_pn == 'background') clr_picker = getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsBackground'});
				else clr_picker = getColorisHtml(color,'gcconfig',{'pn':clr_pn, 'el':selectEL, 'selector':selector[tmp_status]},'thumbnail',true,{'input':'clr-alpha clr-tooltipoff tabsColor'});
			}

			if(tmp_pn == 'border') {
				now_palette_arr[tmp_pn].push(`
					<div class="${tmp_status}-color ${borderchk}" ${gc_state}>
						${clr_picker}
					</div>
				`);
			} else if(tmp_pn == 'background') {
				now_palette_arr[tmp_pn].push(`
					<div class="${tmp_status}-color ${backgroundchk}" ${gc_state}>
						${clr_picker}
					</div>
				`);
			} else {
				now_palette_arr[tmp_pn].push(`
					<div class="${tmp_status}-color 11" ${gc_state}>
						${clr_picker}
					</div>
				`);
			}
		});

		$.each(now_palette_arr, function(i, arr) {
			if((i == 'border' && isborder == 'true') || (i == 'background' && isbackground == 'true')) var chkbox = '<input type="checkbox" name="chk" class="'+ i +'chk" value="" checked>';
			else var chkbox = '<input type="checkbox" name="chk" class="'+ i +'chk" value="">';
			
			if(tab_case == 'tab6' || tab_case == 'tab7') { if(i == 'border') i = 'line'; }
			if(arr.length == 0 || arr[0].match(/data\-gc\-state\=\"false\"/) != null && arr[1].match(/data\-gc\-state\=\"false\"/) != null && arr[2].match(/data\-gc\-state\=\"false\"/) != null) return;
				now_palette_html += '\
					<div class="color-line tabs'+ i +'">\
				';
				if(i == 'border' || i == 'line' || i == 'background') now_palette_html += chkbox + '<div class="option_name" lang="'+ LANG +'">'+ $.lang[LANG]['editor.tab.category.'+i] +'</div>';
				else now_palette_html += '<div class="option_name" lang="'+ LANG +'">'+ $.lang[LANG]['editor.tab.category.'+i] +'</div>';

				if(i == 'border' || i == 'line') {
					if(tab_case == 'tab6' || tab_case == 'tab7') {
						now_palette_html += '\
								<div class="default_color '+ borderchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.default"] +'</div>'+ arr[0] +'\
							</div>\
						';
					} else {
						now_palette_html += '\
								<div class="default_color '+ borderchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.default"] +'</div>'+ arr[0] +'\
								<div class="hover_color '+ borderchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.rollover"] +'</div>'+ arr[1] +'\
								<div class="active_color '+ borderchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.active"] +'</div>'+ arr[2] +'\
							</div>\
						';
					}
				} else if(i == 'background') {
					now_palette_html += '\
							<div class="default_color '+ backgroundchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.default"] +'</div>'+ arr[0] +'\
							<div class="hover_color '+ backgroundchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.rollover"] +'</div>'+ arr[1] +'\
							<div class="active_color '+ backgroundchk +'">'+ $.lang[LANG]["bc.tp.block-tab-color.active"] +'</div>'+ arr[2] +'\
						</div>\
					';
				} else {
					now_palette_html += '\
							<div class="default_color">'+ $.lang[LANG]["bc.tp.block-tab-color.default"] +'</div>'+ arr[0] +'\
							<div class="hover_color">'+ $.lang[LANG]["bc.tp.block-tab-color.rollover"] +'</div>'+ arr[1] +'\
							<div class="active_color">'+ $.lang[LANG]["bc.tp.block-tab-color.active"] +'</div>'+ arr[2] +'\
						</div>\
					';
				}
				
		});

		var colorset = ['black', 'gray', 'white', ''];
		$.each(colorset, function(i, v) {
			colorset[i] = (v == colortype) ? 'active' : '';
		});

		var str = '\
			<div class="btn-group btn-group-sm">\
				<div  class="btn-color-mode ' + colorset[0] + '">\
					<button type="button" class="ctrl-tabs-color" data-type="black" data-elname="' + elname + '" data-pn="' + pn + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorset[1] + '">\
					<button type="button" class="ctrl-tabs-color" data-type="gray" data-elname="' + elname + '" data-pn="' + pn + '"></button>\
				</div>\
				<div  class="btn-color-mode ' + colorset[2] + '">\
					<button type="button" class="ctrl-tabs-color" data-type="white" data-elname="' + elname + '" data-pn="' + pn + '" data-toggle="tooltip" data-placement="top" data-html="true" data-original-title="'+ $.lang[LANG]["bc.tp.block-tab-color.white.info"] +'"></button>\
				</div>\
				<div class="btn-color-mode btn-group now-color-palette ' + colorset[3] + '">\
					<button type="button" class="ctrl-tabs-color" data-type="custom">'+ initSVGIcon('cog_15','bc-svg-config')+ '</button>\
					<div class="dropdown-menu tabDrop '+ LANG +'">\
						<div class="color-picker-wrap">\
							' + now_palette_html + '\
						</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;
	}

	this.selectTabsNaviColorSetForm = function(cls,fn,el,elname,colortype,tab_case) { //qwer
		var now_palette_html = '',
			clr_picker = '',
			pn = 'fill',
			selector = '.'+elname+'[navigation-use=\'1\'] .left-arrow .before, .'+elname+'[navigation-use=\'1\'] .right-arrow .after',
			color = fn;

		clr_picker = getColorisHtml(color,'tabsconfig',{'pn':pn, 'el':selectEL, 'selector':selector},'thumbnail',true,{'input':'clr-alphaoff clr-tooltipoff arrowColor'});
		now_palette_html += `
				<div class="arrow-color">
					${clr_picker}
				</div>
		`;

		var str = '\
			<div class="btn-group btn-group-sm">\
				<div class="color-picker-wrap">\
					' + now_palette_html + '\
				</div>\
			</div>\
		';

		return str;
	}

// 	this.selectTabCategoryColorSetForm = function(cls,fn,el,elname,colortype,tab_case) { //qwer
// 		console.log(fn);
// 		// console.log('cls: ' + cls + ', el: ' + el + ', elname: ' + elname + ', colortype: ' + colortype);
// 		var selector = '.'+elname+' .tab-box .tab',
// 			hover_selector = '.'+elname+' .tab-box .tab.hover',
//             active_selector = '.'+elname+' .tab-box .tab.active',
// 			gc_type = [],
// 			gc_color = [],
// 			gc_colorHex = [],
// 			gc_colorOpacity = [],
// 			gc_colorset_state = [],
// 			default_color = ($('.'+elname).css('color') != 'undefined') ? $('.'+elname).css('color') : $('.dsgn-body').css('color');

// 		var col = $(hover_selector).css('color');
// 		console.log(col);

// 		$.each(fn, function(i,v) {
// 			var color = (!v) ? default_color : v,
// 				opacity = '',
// 				colorHex = '',
// 				css_status = true;

// 			if(typeof v == 'undefined' || !v) {
// 				opacity = '0';
// 				css_status = false;

// 				if( i.indexOf('font')>-1 ) { 
// 					color = (i.indexOf('active')==-1) ? 'rgb(135, 135, 135)' : 'rgb(175, 175, 175)';
// 					opacity = '';
// 					colorHex = style.rgbahex(color);
// 				} 
// 				if ( i.indexOf('border')>-1 ) {
// 					color = '';
// 					colorHex = 'transparent';
// 				} 

// 			} else {
// 				colorHex = style.rgbahex(color);
// 				if(color.match(/\,/g) != null && color.match(/\,/g).length ==3) {
// 					opacity = color.substr((color.lastIndexOf(',')+1),(color.lastIndexOf(')')- (color.lastIndexOf(',')+1))).trim();
// 					colorHex = (opacity=='0') ? 'transparent' : colorHex;
// 					css_status = (opacity=='0') ? true : css_status;
// 				}
// 			}

// 			gc_type.push(i);
// 			gc_color.push(color);
// 			gc_colorHex.push(colorHex);
// 			gc_colorOpacity.push(opacity);
// 			gc_colorset_state.push(css_status);
// 		});
// 		// console.log(gc_type);
// 		// console.log(gc_color);
// 		console.log(gc_colorHex);
// 		// console.log(gc_colorOpacity);
// 		// console.log(gc_colorset_state);
// // console.log(gc_colorHex);
// // var gc_color_set = {
// // 	gc_color_font : gc_color_font,
// // 	gc_color_hover : gc_color_font_hover,
// // 	gc_color_font_active : gc_color_font_active,
// // 	gc_color_background : gc_color_background,
// // 	gc_color_background_hover : gc_color_background_hover,
// // 	gc_color_background_active : gc_color_background_active,
// // 	gc_color_border : gc_color_border,
// // 	gc_color_border_hover : gc_color_border_hover,
// // 	gc_color_border_active : gc_color_border_active
// // }
// 		var now_palette = '\
// 						<div class="color-line cg-font">\
// 							<div class="option_name">' + $.lang[LANG]["bc.tp.block-tab-color.font"] + '</div>\
// 							<div class="default_name">' + $.lang[LANG]["bc.tp.block-tab-color.default"] + '</div>\
// 							<div class="default-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="color" data-toggle="tooltip" data-num="1" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[0]+'"></span>\
// 								</span>\
// 							</div>\
// 							<div class="active_name">' + $.lang[LANG]["bc.tp.block-tab-color.rollover"] + '</div>\
// 							<div class="active-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + hover_selector + '" pn="color" data-toggle="tooltip" data-num="2" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[1]+'"></span>\
// 								</span>\
// 							</div>\
// 							<div class="strong_name">' + $.lang[LANG]["bc.tp.block-tab-color.strong"] + '</div>\
// 							<div class="strong-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="color" data-toggle="tooltip" data-num="3" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[2]+'"></span>\
// 								</span>\
// 							</div>\
// 						</div>';
// 			if(tab_case == 'B' || tab_case == 'C' ||  tab_case == 'E' ||  tab_case == 'F') {
// 				now_palette += '\
// 						<div class="color-line cg-box">\
// 							<div class="option_name">' + $.lang[LANG]["bc.tp.block-tab-color.background"] + '</div>\
// 							<div class="default_name">' + $.lang[LANG]["bc.tp.block-tab-color.default"] + '</div>\
// 							<div class="default-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="background-color" data-toggle="tooltip" data-num="4" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[3]+'" style="background-color: '+gc_colorHex[3]+'"></span>\
// 								</span>\
// 							</div>\
// 							<div class="active_name">' + $.lang[LANG]["bc.tp.block-tab-color.rollover"] + '</div>\
// 							<div class="active-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + hover_selector + '" pn="background-color" data-toggle="tooltip" data-num="5" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[4]+'" style="background-color: '+gc_colorHex[4]+'"></span>\
// 								</span>\
// 							</div>\
// 							<div class="strong_name">' + $.lang[LANG]["bc.tp.block-tab-color.strong"] + '</div>\
// 							<div class="strong-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="background-color" data-toggle="tooltip" data-num="6" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[5]+'"></span>\
// 								</span>\
// 							</div>\
// 						</div>\
// 						';
// 			}
// 			if(tab_case != 'F') { // 선
// 				now_palette += '\
// 						<div class="color-line cg-box">\
// 							<div class="option_name">' + $.lang[LANG]["bc.tp.block-tab-color.line"] + '&nbsp;&nbsp;&nbsp;</div>\
// 							<div class="default_name">' + $.lang[LANG]["bc.tp.block-tab-color.default"] + '</div>\
// 							<div class="default-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + selector + '" pn="border-color" data-toggle="tooltip" data-num="7" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[6]+'" style="background-color: '+gc_colorHex[6]+'"></span>\
// 								</span>\
// 							</div>';
// 					if(tab_case == 'B' || tab_case == 'D' || tab_case == 'E') {
// 						now_palette += '\
// 							<div class="active_name disabled">' + $.lang[LANG]["bc.tp.block-tab-color.rollover"] + '</div>\
// 							<div class="active-color">\
// 								<span class="color-picker">\
// 								    <span class="disabled color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + hover_selector + '" pn="border-color" data-toggle="tooltip" data-num="8" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[7]+'" style="background-color: '+gc_colorHex[7]+'"></span>\
// 								</span>\
// 								';
// 					} else {
// 						now_palette += '\
// 							<div class="active_name">' + $.lang[LANG]["bc.tp.block-tab-color.rollover"] + '</div>\
// 							<div class="active-color">\
// 								<span class="color-picker">\
// 								    <span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + hover_selector + '" pn="border-color" data-toggle="tooltip" data-num="8" data-placement="top" title="color" data-opacity="'+gc_colorOpacity[7]+'" style="background-color: '+gc_colorHex[7]+'"></span>\
// 								</span>\
// 								';
// 					}
// 				now_palette += '</div>';

// 					if(tab_case == 'B' || tab_case == 'D') {
// 						now_palette += '\
// 							<div class="strong_name disabled">' + $.lang[LANG]["bc.tp.block-tab-color.strong"] + '</div>\
// 							<div class="strong-color">\
// 								<span class="color-picker">\
// 									<span class="disabled color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="border-color" data-toggle="tooltip" data-num="9" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[8]+'"></span>\
// 								</span>\
// 								';
// 					} else {
// 						now_palette += '\
// 							<div class="strong_name">' + $.lang[LANG]["bc.tp.block-tab-color.strong"] + '</div>\
// 							<div class="strong-color">\
// 								<span class="color-picker">\
// 									<span class="color tooltips ctrl-gc-color-picker-' + el + '" el="' + el + '" data-selector="' + active_selector + '" pn="border-color" data-toggle="tooltip" data-num="9" data-placement="top" title="color" data-opacity="" style="background-color: '+gc_colorHex[8]+'"></span>\
// 								</span>\
// 								';
// 					}
// 				now_palette += '</div></div>';
// 			}

// 		var pnStr = '';
// 		$.each(gc_type, function(i,v) {
// 			if(gc_colorset_state[i]) pnStr = pnStr + v + ',';
// 		});

// 		var colorSet = ['black', 'gray', 'white', ''];
// 		$.each(colorSet, function(i, v) {
// 			colorSet[i] = (v == colortype) ? 'active' : '';
// 		});

// 		var str = '\
// 			<div class="btn-group btn-group-sm">\
// 				<div  class="btn-color-mode ' + colorSet[0] + '">\
// 					<button type="button" class="ctrl-gc-color" data-type="black" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
// 				</div>\
// 				<div  class="btn-color-mode ' + colorSet[1] + '">\
// 					<button type="button" class="ctrl-gc-color" data-type="gray" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
// 				</div>\
// 				<div  class="btn-color-mode ' + colorSet[2] + '">\
// 					<button type="button" class="ctrl-gc-color" data-type="white" data-elname="' + elname + '" data-pn="' + pnStr + '"></button>\
// 				</div>\
// 				<div class="btn-color-mode btn-group now-color-palette ' + colorSet[3] + '">\
// 					<button type="button" class="ctrl-gc-color" data-type="custom">'+ initSVGIcon('cog_15','bc-svg-config')+ '</button>\
// 					<div class="dropdown-menu">\
// 						<div class="color-picker-wrap">\
// 							' + now_palette + '\
// 						</div>\
// 					</div>\
// 				</div>\
// 			</div>\
// 		';

// 		return str;
// 	}

	this.selectTextAlignForm = function(cls,fn,elname) {
		elname = (elname=='none' || typeof elname=='undefined') ? '.dsgn-body' : elname;
		var text_align_undefined = ['start', '-webkit-auto'];

		var ta = ($(elname).css('text-align') && $.inArray($(elname).css('text-align'),text_align_undefined)==-1) ? $(elname).css('text-align') : 'left',
			ta_l = (ta == 'left') ? 'active' : '',
			ta_c = (ta == 'center') ? 'active' : '',
			ta_r = (ta == 'right') ? 'active' : ''; 

		var str = '';

		str = '\
			<div class="btn-group btn-group-sm" data-toggle="buttons" role="group" aria-label="gallery category align">\
				<label class="ctrl-text-align-el btn btn-default '+ta_l+'" data-text-align="left" data-elname="'+elname+'" data-toggle="tooltip" data-placement="bottom" data-original-title="'+ $.lang[LANG]['bc.canvas.img.align.left'] +'"><input type="radio" name="gcalign" id="gcAlignLeft" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-left.gif" alt="gallery category align left" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-left_on.gif" alt="gallery category align left" /></label>\
				<label class="ctrl-text-align-el btn btn-default '+ta_c+'" data-text-align="center" data-elname="'+elname+'" data-toggle="tooltip" data-placement="bottom" data-original-title="'+ $.lang[LANG]['bc.canvas.img.align.center'] +'"><input type="radio" name="gcalign" id="gcAlignCenter" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-center.gif" alt="gallery category align center" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-center_on.gif" alt="gallery category align center" /></label>\
				<label class="ctrl-text-align-el btn btn-default '+ta_r+'" data-text-align="right" data-elname="'+elname+'" data-toggle="tooltip" data-placement="bottom" data-original-title="'+ $.lang[LANG]['bc.canvas.img.align.right'] +'"><input type="radio" name="gcalign" id="gcAlignRight" autocomplete="off" /><img class="fa" src="https://storage.googleapis.com/i.addblock.net/icon-align-right.gif" alt="gallery category align right" /><img class="fa on" src="https://storage.googleapis.com/i.addblock.net/icon/icon-align-right_on.gif" alt="gallery category align right" /></label>\
			</div>\
		';
		return str;
	}

	this.selectTabAlignForm = function(cls,fn,elname) {
		elname = (elname=='none' || typeof elname=='undefined') ? '.dsgn-body' : elname;

		var ta = ($(elname).css('justify-content')) ? $(elname).css('justify-content') : 'center',
			ta_l = (ta == 'flex-start') ? 'checked' : '',
			ta_c = (ta == 'center') ? 'checked' : '',
			ta_r = (ta == 'flex-end') ? 'checked' : ''; 

		var str = '';

		str = '\
			<div class="btn-group btn-group-sm" data-toggle="buttons" role="group" aria-label="gallery category align">\
				<label class="ctrl-tab-align-el '+LANG+'" data-tab-align="flex-start" data-elname="'+elname+'"><input type="radio" name="gcalign" value="left" id="gcAlignLeft" '+ta_l+' />'+ $.lang[LANG]['editor.menu.align.menu.horizontal.left'] +'</label>\
				<label class="ctrl-tab-align-el '+LANG+'" data-tab-align="center" data-elname="'+elname+'"><input type="radio" name="gcalign" value="center" id="gcAlignCenter" '+ta_c+' />'+ $.lang[LANG]['editor.menu.align.menu.horizontal.center'] +'</label>\
				<label class="ctrl-tab-align-el '+LANG+'" data-tab-align="flex-end" data-elname="'+elname+'"><input type="radio" name="gcalign" value="right" id="gcAlignRight" '+ta_r+' />'+ $.lang[LANG]['editor.menu.align.menu.horizontal.right'] +'</label>\
			</div>\
		';
		return str;
	}
	
	this.getRootLineheight = function(v,fsize) {
		var _txlineheight = v,
			_txfontsize = fsize;
		_txfontsize = parseInt(_txfontsize.replace('px',''));

		if(_txlineheight.indexOf('%') > -1)			_txlineheight = _txlineheight.replace('%','');
		else if(_txlineheight.indexOf('px') > -1)	_txlineheight = (parseFloat(_txlineheight.replace('px','').toFixed(3)) / _txfontsize) * 100;
		else if(_txlineheight.indexOf('.') > -1)	_txlineheight = parseFloat(_txlineheight) * 100;

		return parseInt(_txlineheight);
	}
	this.selectRootFontForm = function(fel,fselector,fname,froot) {
		if(FONTS != this.fonts) { 
			this.fonts = FONTS ;
		}

		if(typeof fel == 'undefined' || fel == '' || $('.'+fel).length == 0) fel = 'dsgn-body';
		if(typeof fselector == 'undefined' || fselector == '' || $('.'+fselector).length == 0) fselector = fel;

		var tf = (fselector == 'dsgn-body') ? $('.'+fselector).css('font-family') : fname;
		if(tf==null) {
			alert('Block config error : ' + elname + '\r\nstyle.js line: 306');
			return false;
		}
		tf = explode(",",tf);

		var fn_name = tf[0],
			str = '';
		for(i=0;i<this.fonts.length;i++) {
			var fonts_check = '',
				font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(fname == this.fonts[i]) {
				fonts_check = 'active';
				fn_name = font_name;
			}

			if(font_name.substring(0,1) != '@')
				str = str + '<li class="el-root-font ' + fonts_check + '" el="' + fel + '" selector=".' + fselector + '" data-root="' + froot + '" data-val="' + this.fonts[i] + '" style="font-family:\'' + this.fonts[i] + '\';"><a href="javascript:;">' + font_name + '</a></li>';
			else
				str = str + '<li class="dividers"><hr /></li>';
		}

		return '\
        <div class="btn-group">\
            <button type="button" class="btn btn-default dropdown-toggle font-preview" data-toggle="dropdown"><span class="el-root-font-active" data-root="' + froot + '" style="font-family:\'' + fname + '\'">' + fn_name + '</span> <svg viewBox="0 0 13 13" width="13" height="13"><g><path d="m6.5 9.55-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4-4.7 4.7z"/></path></g></svg></button>\
            <ul class="dropdown-menu scrollable-menu" role="menu">\
		        ' + str + '\
            </ul>\
            <div class="default-language-box"><span class="btn-default-language"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_plus_icon_b.png" alt="" /> '+ $.lang[LANG]['editor.languages-support'] +'</span></div>\
        </div>\
        ';
	}


	this.selectFontSizeForm = function(cls,elselector,fs,max_fs) {
		fs = (typeof fs != 'undefined' && /^[0-9]+$/.test(fs)) ? Number(fs) : 0;
		max_fs = (typeof max_fs != 'undefined' && /^[0-9]+$/.test(max_fs)) ? Number(max_fs) : 80;

		var fs_li = '';
		for (var i = 10; i <= max_fs; i++){
			fs_li += `<li class="${(i == fs) ? 'active' : ''}" data-fontselect="${i}"><a>${i}</a></li>`;
		}
		
		return `
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
				<span class="${cls} " pn="font-size" data-slider-max="${max_fs}" selector="${elselector}">${fs}</span>
				<svg viewBox="0 0 13 13" width="13" height="13"><g><path d="m6.5 9.55-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4-4.7 4.7z"/></path></g></svg>
			</button>
			<ul class="dropdown-menu scrollable-menu">${fs_li}</ul>
		</div>
		`;
	}

	this.selectLatestFontSizeTitle = function(cls,elselector,fs,max_fs) {
		fs = (typeof fs != 'undefined' && /^[0-9]+$/.test(fs)) ? Number(fs) : 0;
		max_fs = (typeof max_fs != 'undefined' && /^[0-9]+$/.test(max_fs)) ? Number(max_fs) : 80;

		var fs_li = '';
		for (var i = 10; i <= max_fs; i++){
			fs_li += `<li class="${(i == fs) ? 'active' : ''} ${cls}" data-elname="${elselector} .latest-table-header .lt-header" data-fontselect="${i}"><a>${i}</a></li>`;
		}
		
		return `
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle font-preview-size" data-toggle="dropdown">
				<span class="ctrl-title-font-size-el-active " pn="font-size" data-slider-max="${max_fs}" selector="${elselector}">${fs}</span>
				<svg viewBox="0 0 13 13" width="13" height="13"><g><path d="m6.5 9.55-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4-4.7 4.7z"/></path></g></svg>
			</button>
			<ul class="dropdown-menu scrollable-menu">${fs_li}</ul>
		</div>
		`;
	}

	this.selectLatestFontSize = function(cls,elselector,fs,max_fs) {
		fs = (typeof fs != 'undefined' && /^[0-9]+$/.test(fs)) ? Number(fs) : 0;
		max_fs = (typeof max_fs != 'undefined' && /^[0-9]+$/.test(max_fs)) ? Number(max_fs) : 80;

		var fs_li = '';
		for (var i = 10; i <= max_fs; i++){
			fs_li += `<li class="${(i == fs) ? 'active' : ''} ${cls}" data-elname="${elselector} .latest-post-list-title" data-eldate="${elselector} .latest-post-list-date" data-fontselect="${i}"><a>${i}</a></li>`;
		}
		
		return `
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle font-preview-size" data-toggle="dropdown">
				<span class="ctrl-font-size-el-active " pn="font-size" data-slider-max="${max_fs}" selector="${elselector}">${fs}</span>
				<svg viewBox="0 0 13 13" width="13" height="13"><g><path d="m6.5 9.55-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4-4.7 4.7z"/></path></g></svg>
			</button>
			<ul class="dropdown-menu scrollable-menu">${fs_li}</ul>
		</div>
		`;
	}

	this.selectFontSelectForm = function(cls,fn,elname) {
		
		if(FONTS != this.fonts) { 
			this.fonts = FONTS ;
		}
		elname = (elname=='none' || typeof elname=='undefined') ? '.dsgn-body' : elname;
		var tf = $(elname).css('font-family');

		if(cls=='ctrl-font-family-el') tf = fn;

		if(tf==null) {
			alert('Block config error : ' + elname + '\r\nstyle.js line: 306');
			return false;
		}
		tf = explode(",",tf);

		var fn_name = fn.replace(/\"/gi, ""),
			str = '';
		for(i=0;i<this.fonts.length;i++) {
			var fonts_check = '',
				font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(fn==this.fonts[i]) {
				fonts_check = 'active';
				fn_name = font_name;
			}

			if(font_name.substring(0,1) != '@')
				str = str + '<li class="' + cls + ' ' + fonts_check + '" data-elname="' + elname + '" data-font-family="' + this.fonts[i] + '" style="font-family:\'' + this.fonts[i] + '\';"><a href="javascript:;">' + font_name + '</a></li>';
			else
				str = str + '<li class="dividers"><hr /></li>';
		}

		return '\
        <div class="btn-group">\
            <button type="button" class="btn btn-default dropdown-toggle font-preview font-preview-family" data-toggle="dropdown"><span class="' + cls + '-active" style="font-family:\'' + fn + '\'">' + fn_name + '</span> <svg viewBox="0 0 13 13" width="13" height="13"><g><path d="m6.5 9.55-4.7-4.7 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4-4.7 4.7z"/></path></g></svg></button>\
            <ul class="dropdown-menu scrollable-menu" role="menu">\
		        ' + str + '\
            </ul>\
            <div class="default-language-box"><span class="btn-default-language"><img src="https://storage.googleapis.com/i.addblock.net/icon/fa_plus_icon_b.png" alt="" /> '+ $.lang[LANG]['editor.languages-support'] +'</span></div>\
        </div>\
        ';
	}

	this.selectBackgroundSelectForm = function(type,id,val,elname,ctrl_class) {
		// var position = ['left top','left center','left bottom','center top','center center','center bottom','right top','right center','right bottom'],
		var position = ['left top','center top','right top','left center','center center','right center','left bottom','center bottom','right bottom'],
			repeat = ['repeat','repeat-x','repeat-y','no-repeat'],
			bgsize = ['auto','cover','contain'],
			property = [];

		elname = (typeof elname == 'undefined') ? '' : elname;
		ctrl_class = (typeof ctrl_class == 'undefined') ? '' : ctrl_class;
		langCtrl = '';
		switch(type) {
			case 'position' : 
				property = position; 
				langCtrl = type; 

				var position_center = ['initial', '50% 50%', '50%', 'center'];
				val = ($.inArray(val, position_center) > -1) ? 'center center' : val;

				var position_svg = '<svg viewBox="0 0 22 22" width="22" height="22">\
										<rect width="6" height="6" class="bp-left-top" />\
										<rect width="6" height="6" class="bp-center-top" x="8" />\
										<rect width="6" height="6" class="bp-right-top" x="16" />\
										<rect width="6" height="6" class="bp-left-center" y="8" />\
										<rect width="6" height="6" class="bp-center-center" x="8" y="8" />\
										<rect width="6" height="6" class="bp-right-center" x="16" y="8" />\
										<rect width="6" height="6" class="bp-left-bottom" y="16" />\
										<rect width="6" height="6" class="bp-center-bottom" x="8" y="16" />\
										<rect width="6" height="6" class="bp-right-bottom" x="16" y="16" />\
									</svg>',
					position_icon = '<span class="bc-bp-icon bc-svg" data-bp="' + val + '">' + position_svg + '</span>',
					position_str = ''
					position_html = '';

				for(i=0;i<property.length;i++) {
					var check = (property[i]==val) ? 'selected' : '',
						strlang = 'editor.background.' + langCtrl + '.' + property[i].replace(' ','-');
					if(check) position_str = $.lang[LANG][strlang];

					position_html += '\
						<li data-value="' + property[i] + '" data-name="' + $.lang[LANG][strlang] + '"><span></span></li>\
					';
				}

				var bp_idx = $('#el-blockConfig').find('.dropdown-toggle[id^=bcBackgroundPosition]').length,
					str = '\
					<a class="bc-bp-select btn dropdown-toggle" href="#" role="button" id="bcBackgroundPosition' + bp_idx + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + position_icon + ' <span class="bc-bp-active">' + ((!position_str) ? val : position_str) + '</span></a>\
					<div class="bc-bp-option dropdown-menu" aria-labelledby="bcBackgroundPosition' + bp_idx + '">\
						<ul data-bp="' + val + '" data-id="' + id + '" data-elname="' + elname + '" >\
							' + position_html + '\
						</ul>\
						<p class="bc-bp-active">' + position_str + '</p>\
					</div>\
				';

				return str;
				break;

			case 'repeat' : 
				property = repeat; 
				langCtrl = type; 
				val = (val=='initial') ? 'no-repeat' : val;
				break;

			case 'bgsize' : 
				property = bgsize; 
				langCtrl = 'size'; 
				val = (val=='initial') ? 'cover' : val;
				break;
		}

		// var str = '<select class="form-control property-form ' + ctrl_class + '" id="' + id + '" data-elname="' + elname + '">';
		// for(i=0;i<property.length;i++) {
		// 	check = (property[i]==val) ? 'selected' : '';
		// 	var strlang = 'editor.background.' + langCtrl + '.' + property[i].replace(' ','-');
		// 	str = str + '<option value="' + property[i] + '" ' + check + '>' + $.lang[LANG][strlang] + '</option>';
		// }
		// str = str + '</select>';

		var dropdown_html = '';
		for(i=0;i<property.length;i++) {
			check = (property[i]==val) ? 'selected' : '';
			var strlang = 'editor.background.' + langCtrl + '.' + property[i].replace(' ','-');
			if(check) check_str = $.lang[LANG][strlang];

			dropdown_html += '<li data-name="' + $.lang[LANG][strlang] + '" data-value="' + property[i] + '" ' + check + '>' + $.lang[LANG][strlang] + '</li>';
		}

		var str = '\
			<a class="bc-bg-select btn dropdown-toggle ' + ctrl_class + '" href="#" role="button" id="' + id + '" data-elname="' + elname + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
				<span class="bc-bg-active">' + ((!check_str) ? val : check_str) + '</span>\
			</a>\
			<div class="bc-bg-option dropdown-menu" aria-labelledby="' + id + '">\
				<ul data-id="' + id + '" data-elname="' + elname + '" >\
					' + dropdown_html + '\
				</ul>\
			</div>\
		';

		return str;
	}

	var hex2rgb = function(hex) {
	    if (hex.lastIndexOf('#') > -1) {
	        hex = hex.replace(/#/, '0x');
	    } else {
	        hex = '0x' + hex;
	    }
	    var r = hex >> 16;
	    var g = (hex & 0x00FF00) >> 8;
	    var b = hex & 0x0000FF;
	    return rgb = { r : r, g : g, b : b};
	}

	var rgb2hex = function(r,g,b) {
		return '#' +
		('0' + parseInt(r,10).toString(16)).slice(-2) +
		('0' + parseInt(g,10).toString(16)).slice(-2) +
		('0' + parseInt(b,10).toString(16)).slice(-2);
	}

	var initObject = function(j,selector) {
		if(typeof j['children'][selector] == 'undefined') {
			j['children'][selector] = {};
			j['children'][selector]['attributes'] = {};
		}
		return j;
	}

	var trim = function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}

	this.getBorderColor = function(selector) {
		var is_indicator = (selector.indexOf('carousel-indicators li') != -1 && $(selector).parents('.carousel-indicators').attr('data-indicator')=='background') ? true : false,
			rgbExp = /rgb\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\)\s*/,
			rgbExp = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
			color = (is_indicator) ? $(selector).css('background-color') : $(selector).css('border-top-color');

		if(!is_indicator) {
			var checkBorder = {
				all :		($(selector).css('border-width') != '0px')	? true : false,
				top :		($(selector).css('border-top-width') != '0px'	&&	$(selector).css('border-top-color') != 'rgba(0, 0, 0, 0)')	? true : false,
				right :		($(selector).css('border-right-width') != '0px'	&&	$(selector).css('border-right-color') != 'rgba(0, 0, 0, 0)')	? true : false,
				bottom :	($(selector).css('border-bottom-width') != '0px'&&	$(selector).css('border-bottom-color') != 'rgba(0, 0, 0, 0)')	? true : false,
				left :		($(selector).css('border-left-width') != '0px'	&&	$(selector).css('border-left-color') != 'rgba(0, 0, 0, 0)')	? true : false,
			}
			if(!checkBorder.all) return '';
			else if(!checkBorder.top) {
				if(checkBorder.right) color = $(selector).css('border-right-color');
				else if(checkBorder.bottom) color = $(selector).css('border-bottom-color');
				else if(checkBorder.left) color = $(selector).css('border-left-color');
			}
		}

		if($(selector).length == 0) color = 'rgb(0,0,0)';

		var colorMatch = color.match(rgbExp);

		if(colorMatch == null) return '';
		else {
			var colorHex = this.getHex(colorMatch[0].trim());
			return colorHex;
		}		
	}

	this.getBorderRadius = function(selector) {
		var radius = $(selector).css('border-radius');

		var checkBorder = ($(selector).css('border-width') != '0px') ? true : false;
		if(!checkBorder) return '';

		if($(selector).length == 0) radius = '0px';

		var radiusMatch = radius.replace('px', '');

		if(radiusMatch == null) return '';
		else {
			var radius = radiusMatch.trim();
			return radius;
		}		
	}

	this.getAttributesMoreBtnColor = function(j,selector,key,hover) {
		if(!j['children'][selector]) {
			$.each(j['children'], function(s,o) {
				if(s.indexOf(selector) > -1) j['children'][selector] = o;
			});
		}
		var selector_ori = (hover) ? selector.substring(0,selector.indexOf(':hover')) : '',
			color_val = '',
			opacity_val = '';
		switch(key) {			
			case 'color' :
				color_val = (j['children'][selector]) ? j['children'][selector]['attributes'][key] : '';
				if(!color_val && hover) {
					color_val = (j['children'][selector_ori]) ? j['children'][selector_ori]['attributes'][key] : '';
				}
				if(color_val == 'inherit') color_val = '#aaa';
				if(!color_val) {
					if(hover) color_val = '#fff'; else color_val = '#aaa';
				} 
				break;

			case 'background-color' :
				color_val = (j['children'][selector] && j['children'][selector]['attributes'][key]) ? j['children'][selector]['attributes'][key] : '';
				
				if(color_val.indexOf('#')>-1) {
					opacity_val = (j['children'][selector]) ? ((typeof j['children'][selector]['attributes']['opacity']!='undefined' && j['children'][selector]['attributes']['opacity']) ? j['children'][selector]['attributes']['opacity'] : j['children'][selector]['attributes']['opacity_re']) : '';
				}	
			
				if(!color_val && hover) {
					color_val = (j['children'][selector_ori]) ? j['children'][selector_ori]['attributes'][key] : '';
				}

				if(!color_val) {
					if(hover) color_val = '#000'; else color_val = '#E5E5E5';
				}
				break;

			case 'border-color' :
				if(j['children'][selector]) {
					key = (typeof j['children'][selector]['attributes']['border-color'] != 'undefined') ? 'border-color' : 'border';
					color_val = j['children'][selector]['attributes'][key];
				} else {
					key = 'border';
					color_val = '';
				}
				
				var regexRgba = /(rgb(a)?)(\([0-999]*\,[0-999]*\,[0-999]*(\,\d*[.]?\d{1,2})?)\)|(#[0-9a-f]{3,6})|(transparent)|(none)/gi;		        

				if(!color_val) {
					border_css = (j['children'][selector]) ? j['children'][selector]['attributes']['border'] : '';
					if(hover && !border_css) {
						color_val = (j['children'][selector_ori]) ? j['children'][selector_ori]['attributes'][key] : '';
						color_val = (color_val) ? ((color_val.match(regexRgba)) ? color_val.match(regexRgba)[0] : 'rgba(255,255,255,1)') : '';
						if(!color_val) border_css = (j['children'][selector_ori]) ? j['children'][selector_ori]['attributes']['border'] : '';
					}
					if(border_css) {
						border_arry = border_css.toString().split(" ");
						$.each(border_arry, function(i,v){
							if(v.indexOf('#') > -1 || v.indexOf('transparent') > -1 || v.indexOf('none') > -1) color_val = v;
						});
					}
				} else {
					color_val = (color_val.match(regexRgba)) ? color_val.match(regexRgba)[0] : ((color_val.indexOf('none')>-1) ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)');
				}

				if(!color_val) color_val = '';
				break;
		}

		var setbg_color_array = [],
			bg_array = [],
			bg_info = {};
			
		bg_array = getRgbaValArray(color_val,opacity_val);
		bg_info = getColorAndOpacity('','','',bg_array);
	
		return bg_info;
	}

	this.getMenuNavbarStyle = function(sid,css,obj) {
		var m_reg = new RegExp('.menu-'+sid+'[a-zA-Z. -]+(.navbar-nav[\> ]+li[\> ]+a)','gi');
			m_property = {
				txColor : '',
				txSize : 0,
				txName : '',
			};

		$.each(css['children'], function(s,o) {
			var checkMenuNavbar = m_reg.test(s);
			if(checkMenuNavbar) {
				if(typeof o['attributes']['font-family'] != 'undefined' && o['attributes']['font-family']) m_property.txName = o['attributes']['font-family'].replace(/'/g,'').replace(/"/g,'');
				if(typeof o['attributes']['font-size'] != 'undefined' && o['attributes']['font-size']) m_property.txSize = o['attributes']['font-size'].replace('px','');
				if(typeof o['attributes']['color'] != 'undefined' && o['attributes']['color']) m_property.txColor = o['attributes']['color'];
			}
		});

		return m_property;
	}
	
	this.getMenuClFixbtnStyle = function(sid,css) {
		var fixbtn_color = {'selector' : '','pn':''};
		$.each(css['children'], function(key,value) {
			if(key.match(/cl-fixbtn|mobilenav_top/gi)!=null) {
				if(key.match(/:hover/gi)!=null || key.match(/cart-active/gi)!=null) return;
				var pn_array = ['color','background-color','border-color','fill'],
					c = value['attributes'],
					pn_val = '',
					pns_cssopt = [],
					change_obj = [];

				$.each(c,function(pn,val){
					if($.inArray(pn,pn_array)>-1) {
						pns_cssopt.push(pn);
						pn_val = val;
					}
				});

				var check_str = (fixbtn_color['selector']!='') ? ',' : '';
				fixbtn_color = {'selector' : fixbtn_color['selector'] + check_str + key +'('+pns_cssopt.join('/')+')'};	

			}
		});
		
		return fixbtn_color;
	}

	this.getPadding = function(j,selector) {
		var padding = {
			top : 0,
			bottom : 0,
			left : 0,
			right : 0

		}
		selector = '.' + selector;
		j = initObject(j,selector);

		$.each(j['children'][selector]['attributes'], function(k,v) {
			if(v == '' || v == 'initial') v = 0;
			switch(k) {
				case 'padding-top':
					v = v.replace(/px/g,'');
					padding.top = v;
					break;
				case 'padding-bottom':
					v = v.replace(/px/g,'');
					padding.bottom = v;
					break;
				case 'padding':
					v = v.replace(/px/g,'');
					var p = v.split(' ');
					
					switch(p.length) {
						case 1:
							padding.top = p[0];
							padding.right = p[0];
							padding.bottom = p[0];
							padding.left = p[0];
							break;
						case 2:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[0];
							padding.left = p[1];
							break;
						case 3:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[2];
							padding.left = p[1];
							break;
						case 4:
							padding.top = p[0];
							padding.right = p[1];
							padding.bottom = p[2];
							padding.left = p[3];
							break;
					}
					break;
			}
		});
		return padding;
	}	
	this.getUserFontsArr = function(cls,fn) {
		if(FONTS != this.fonts) { 
			this.fonts = FONTS ;
		}

		var arr = {};

		for(i=0;i<this.fonts.length;i++) {
			var font_tmp = this.fonts[i].replace(/ /g,'-'),
				font_name = (font_tmp in $.lang[LANG]) ? $.lang[LANG][font_tmp] : this.fonts[i];

			if(font_name.substring(0,1) != '@')
				// str = str + "<li class='" + cls + " " + fonts_check + "' data-elname='" + elname + "' data-font-family='" + this.fonts[i] + "' style=\"font-family:'" + this.fonts[i] + "'\"><a href='javascript:;'>" + font_name + "</a></li>";
				arr[this.fonts[i]] = font_name
		}
		return arr;
	}
	this.getFontcss = function(fonts) {
		fonts = fonts.replace(/'/g,'').replace(/"/g,'');
		var arr = fonts.split(','),
			r = arr[0];
		return r.trim();
	}

	this.getColorORTransparent = function(color) {
		if(typeof color == 'undefined') return 'transparent';

		color = color.replace(/ /gi,'').replace(/!important/gi,'');
		var color_16 = /#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?/,
			color_regexp = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$/i,
			check_regexp = ( color_16.test(color) || color_regexp.test(color) ) ? true : false,
			check_not_tp = ( color!='rgba(0,0,0,0)' && color.indexOf('transparent')==-1 ) ? true : false;

		return (check_regexp && check_not_tp) ? color : 'transparent';        	
	}


	this.menuColorSetForm = function(j,selector) {
		var checkMenuFheader = ($('header.'+selector).hasClass('navbar-fheader')) ? true : false,
			tpl_selector = {
				'main_default'	: 'ul.navbar-nav li:not(.active) a ',
				'main_hover'	: 'ul.navbar-nav li:not(.active) a:hover ',
				'main_active'	: 'ul.navbar-nav li.active a ',
				'sub_default'	: 'ul.dropdown-menu li:not(.active) a ',
				'sub_hover'		: 'ul.dropdown-menu li:not(.active) a:hover ',
				'sub_active'	: 'ul.dropdown-menu li.active a ',
				'fixbtn_default_font': 'ul#fixed-menu .cl-fixbtn a:not(.cl-langlist) ',
				'fixbtnlang_default_bdColor'	: 'ul#fixed-menu .cl-fixbtn.siteLANG .cl-lang ',				
				'fixbtn_default_svg' : 'ul#fixed-menu .cl-fixbtn a:not(.cl-langlist):hover svg ',					
				'fixbtn_default_after'	: 'ul#fixed-menu li.cl-fixbtn:not(:last-child):after ',
				'fixbtn_hover_font'	: 'ul#fixed-menu .cl-fixbtn a:not(.cl-langlist):hover ',
				'fixbtn_hover_svg' : 'ul#fixed-menu .cl-fixbtn a:not(.cl-langlist):hover svg ',
				'cart_default'	: 'ul#fixed-menu .cl-fixbtn .cart-active ',
			},
			user = '.menu-edit-' + SID,
			main_hover_selector = (checkMenuFheader) ? user + ' ul.navbar-nav:not(#fixed-menu) > li > a:hover,\n '+ user + ' ul.navbar-nav:not(#fixed-menu) > li:hover > a ' : user + ' ul.navbar-nav > li > a:hover,\n '+ user + ' ul.navbar-nav > li:hover > a ',
			init_selector = {
				'main_default'	: user + ' ul.navbar-nav > li > a,\n '+ user + ' ul.navbar-nav > li > a:focus ',
				'main_hover'	: main_hover_selector ,
				'main_active'	: user + ' ul.navbar-nav > li.active > a,\n '+ user + ' ul.navbar-nav > li.active > a:focus,\n'+ user + ' ul.navbar-nav > li.active > a:hover ',
				'sub_default'	: user + ' ul.dropdown-menu > li > a,\n '+ user + ' ul.dropdown-menu > li > a:focus ',
				'sub_hover'		: user + ' ul.dropdown-menu > li > a:hover,\n '+ user + ' ul.dropdown-menu > li:hover > a ',
				'sub_active'	: user + ' ul.dropdown-menu > li.active > a,\n '+ user + ' ul.dropdown-menu > li.active > a:focus,\n'+ user + ' ul.dropdown-menu > li.active > a:hover ',
			},
			tpl_color_state = {
				'main_default_font' : false,
				'main_hover_font' : false,
				'main_active_font' : false,
				'main_default_bg' : false,
				'main_hover_bg' : false,
				'main_active_bg' : false,
				'sub_default_font' : false,
				'sub_hover_font' : false,
				'sub_active_font' : false,
				'sub_default_bg' : false,
				'sub_hover_bg' : false,
				'sub_active_bg' : false,
				'fixbtn_default_font': false,
				'fixbtnlang_default_bdColor' : false,				
				'fixbtn_default_svg' : false,					
				'fixbtn_default_after'	: false,
				'fixbtn_hover_font'	: false,
				'fixbtn_hover_svg' : false,
				'cart_default_font' : false,
				'cart_default_bg' : false,
			},
			tpl_color_set = {
				'main_default_font' : '',
				'main_hover_font' : '',
				'main_active_font' : '',
				'main_default_bg' : '',
				'main_hover_bg' : '',
				'main_active_bg' : '',
				'sub_default_font' : '',
				'sub_hover_font' : '',
				'sub_active_font' : '',
				'sub_default_bg' : '',
				'sub_hover_bg' : '',
				'sub_active_bg' : '',
				'fixbtn_default_font' : '',
				'fixbtnlang_default_bdColor' : '',
				'fixbtn_hover_font' : '',
				'cart_default_font' : '',
				'cart_default_bg' : '',
			},
			tpl_color_hex = new Object(),
			tpl_color_opacity = new Object(),
			tpl_color_selector = new Object(),
			tpl_etc_list = new Object();
			tpl_fixbtn_color = new Object();

		$.each(j['children'], function(key,value) {
			var tpl_key = key.replace(/ /gi,''),
				check_nav = (tpl_key.match(/ul.navbar-nav>li/gi) !== null || tpl_key.match(/ul.navbar-nav:not\(#fixed-menu\)>li/gi) !== null) ? true : false,
				check_subnav = (tpl_key.match(/ul.dropdown-menu>li/gi) !== null) ? true : false,
				check_fixbtnnav = (tpl_key.match(/.cl-fixbtn/gi) !== null) ? true : false;

			if(!check_nav && !check_subnav && !check_fixbtnnav) return;

			var c = value['attributes'],
				key_mode = (key.match(/hover/gi)!=null) ? 'hover' : 'default',
				main_hover_str1 = (checkMenuFheader) ? /ul.navbar-nav:not\(#fixed-menu\)>li>a:hover/gi : /ul.navbar-nav>li>a:hover/gi,
				main_hover_str2 = (checkMenuFheader) ? /ul.navbar-nav:not\(#fixed-menu\)>li:hover>a/gi : /ul.navbar-nav>li:hover>a/gi,
				check = {
					'main_default' : (tpl_key.match(/ul.navbar-nav>li>a/gi) !== null) ? true : false,
					'main_hover' : (tpl_key.match(/.cl-fixbtn/gi) == null && (tpl_key.match(main_hover_str1) !== null || tpl_key.match(main_hover_str2) !== null)) ? true : false,
					'main_active' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/ul.navbar-nav>li.active>a/gi) !== null) ? true : false,
					'main_after' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/:after/gi) !== null) ? true : false,
					'main_before' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/:before/gi) !== null) ? true : false,
					'sub_default' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/ul.dropdown-menu>li>a/gi) !== null) ? true : false,
					'sub_hover' : (tpl_key.match(/.cl-fixbtn/gi) == null && (tpl_key.match(/ul.dropdown-menu>li>a:hover/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover>a/gi) !== null)) ? true : false,
					'sub_active' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/ul.dropdown-menu>li.active>a/gi) !== null) ? true : false,
					'sub_after' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/:after/gi) !== null) ? true : false,
					'sub_before' : (tpl_key.match(/.cl-fixbtn/gi) == null && tpl_key.match(/:before/gi) !== null ) ? true : false,
				},
				check_etc = {
					'main_default_before' : (tpl_key.match(/ul.navbar-nav>li>a:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li:before/gi) !== null) ? true : false,
					'main_hover_before' : (tpl_key.match(/ul.navbar-nav>li>a:hover:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li:hover:before/gi) !== null) ? true : false,
					'main_active_before' : (tpl_key.match(/ul.navbar-nav>li.active>a:before/gi) !== null || tpl_key.match(/ul.navbar-nav>li.active:before/gi) !== null) ? true : false,
					'main_default_after' : (tpl_key.match(/ul.navbar-nav>li>a:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li:after/gi) !== null) ? true : false,
					'main_hover_after' : (tpl_key.match(/ul.navbar-nav>li>a:hover:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li:hover:after/gi) !== null) ? true : false,
					'main_active_after' : (tpl_key.match(/ul.navbar-nav>li.active>a:after/gi) !== null || tpl_key.match(/ul.navbar-nav>li.active:after/gi) !== null) ? true : false,
					'sub_default_before' : (tpl_key.match(/ul.dropdown-menu>li>a:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:before/gi) !== null) ? true : false,
					'sub_hover_before' : (tpl_key.match(/ul.dropdown-menu>li>a:hover:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover:before/gi) !== null) ? true : false,
					'sub_active_before' : (tpl_key.match(/ul.dropdown-menu>li.active>a:before/gi) !== null || tpl_key.match(/ul.dropdown-menu>li.active:before/gi) !== null) ? true : false,
					'sub_default_after' : (tpl_key.match(/ul.dropdown-menu>li>a:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:after/gi) !== null) ? true : false,
					'sub_hover_after' : (tpl_key.match(/ul.dropdown-menu>li>a:hover:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li:hover:after/gi) !== null) ? true : false,
					'sub_active_after' : (tpl_key.match(/ul.dropdown-menu>li.active>a:after/gi) !== null || tpl_key.match(/ul.dropdown-menu>li.active:after/gi) !== null) ? true : false,
				};


			var type = (tpl_key.match(/ul.navbar-nav>li/gi) != null || tpl_key.match(/ul.navbar-nav:not\(#fixed-menu\)>li/gi) != null) ? 'main' : 'sub',
				mode = '';

			type = (tpl_key.match(/.cl-fixbtn/gi) != null) ? ((tpl_key.match(/.cl-fixbtn.siteLANG/gi) != null) ? 'fixbtnlang' : 'fixbtn') : type;
			type = (tpl_key.match(/cart-active/gi) != null) ? 'cart' : type;

			if(check[type+'_default'] && !check[type+'_hover'] && !check[type+'_after'] && !check[type+'_before'] ) {
				mode = 'default';
			} else if ( check[type+'_hover'] && !check[type+'_after'] && !check[type+'_before']) {
				mode = 'hover';
			} else if ( check[type+'_active'] && !check[type+'_after'] && !check[type+'_before'] ) {
				mode = 'active';
			} 

			var used_menu_etc = Object.keys(check_etc).map(function(key) { 
				 return check_etc[key];
			});
			if($.inArray(true,used_menu_etc) > -1) {

				$.each(check_etc, function(k,check) {
					if(check) {
						var etc_ctype = (typeof c['color'] != 'undefined') ? 'color' : ( (typeof c['border-color'] != 'undefined') ? 'border-color' : 'background-color'),
							used_etc_effect = true;
							
						etc_ctype = (typeof c['fill'] != 'undefined') ? 'fill' : etc_ctype;

						if(typeof c['opacity'] != 'undefined' && c['opacity'] == 0) { used_etc_effect = false; }
						if(typeof c['display'] != 'undefined' && c['opacity'] == 'none') { used_etc_effect = false; }
						if(typeof c['width'] != 'undefined' && c['width'] == '0px') { used_etc_effect = false; }
						if(typeof c['height'] != 'undefined' && c['height'] == '0px') { used_etc_effect = false; }

						if(style.getColorORTransparent(c[etc_ctype]) == 'transparent') { used_etc_effect = false; }

						if(used_etc_effect) {
							tpl_etc_list[k] = {
								'selector' : key,
								'css_type' : etc_ctype
							};
						}

					}
				});
			}

			if(mode) {
				tpl_color_selector[type+'_'+mode] = key;

				if( typeof c['color'] != 'undefined' ) tpl_color_set[type+'_'+mode+'_font'] = c['color'];
				if( typeof c['background-color'] != 'undefined' ) tpl_color_set[type+'_'+mode+'_bg'] = c['background-color'];

				if(typeof c['opacity'] != 'undefined' && typeof tpl_color_set[type+'_'+mode+'_bg']) tpl_color_opacity[type+'_'+mode+'_bg'] = c['opacity'];
			}

			if(key.match(/cl-fixbtn/gi)!=null) {
				var pn_array = ['color','background-color','border-color','fill'],
					pn_val = '',
					pns_cssopt = [],
					change_obj = [],
					check_cart = (key.match(/cart-active/gi)!=null) ? 'cart' : 'fixbtn',
					fixbtnTypeKey = check_cart+'_'+key_mode;

				$.each(c,function(pn,val){
					if($.inArray(pn,pn_array)>-1) {
						pns_cssopt.push(pn);
						pn_val = val;
					}
				});

				if(tpl_fixbtn_color[fixbtnTypeKey]) {
					var check_str = (tpl_fixbtn_color[fixbtnTypeKey]['selector']!='') ? ',' : '';
					tpl_fixbtn_color[fixbtnTypeKey] = {'selector' : tpl_fixbtn_color[fixbtnTypeKey]['selector'] + check_str + key+'('+pns_cssopt.join('/')+')'};
				} else {
					tpl_fixbtn_color[fixbtnTypeKey] = {'selector' : key}
					tpl_fixbtn_color[fixbtnTypeKey]['selector'] = tpl_fixbtn_color[fixbtnTypeKey]['selector']+'('+pns_cssopt.join('/')+')';
				}

				if(!tpl_fixbtn_color[fixbtnTypeKey]['colorVal']) {
					if(pn_val.indexOf('rgba')>-1) {
						var rgba_color = getRgbaValArray(pn_val);
						pn_val = rgba_color['val'];
					}
					tpl_fixbtn_color[fixbtnTypeKey]['colorVal'] = (typeof pn_val!='undefined' && pn_val) ? pn_val : 'transparent';
				}
			}

		});

		var default_font = ( typeof $('.'+selector).css('color') != 'undefined' ) ? style.getColorORTransparent($('.'+selector).css('color')) : style.getColorORTransparent($('.dsgn-body').css('color')),
			default_bg = ( typeof $('.'+selector).css('background-color') != 'undefined' ) ? style.getColorORTransparent($('.'+selector).css('background-color')) : style.getColorORTransparent($('.dsgn-body').css('background-color'));

		$.each(tpl_color_set, function(k,v) {
			var type = (k.indexOf('main_') > -1) ? 'main' : 'sub',
				mode = k.substr(k.indexOf('_')+1, (k.lastIndexOf('_')-(k.indexOf('_')+1))),
				fn = (k.indexOf('font') > -1) ? 'font' : 'bg';

			if(v.indexOf('important') > -1) { v = v.trim().replace('!important',''); }

			if(!v) {
				var color = (fn == 'font') ? $('.'+selector).find(tpl_selector[type+'_'+mode]).css('color') : $('.'+selector).find(tpl_selector[type+'_'+mode]).css('background-color');
				color = (style.getColorORTransparent(color) != 'transparent') ? style.getColorORTransparent(color) : style.getColorORTransparent(eval('default_' + fn));

				if(color != 'transparent') v = color;
				else if( mode != 'default') {
					var sub_key = (mode == 'hover') ? type+'_active_'+fn : type+'_hover_'+fn;
					
					if(tpl_color_set[sub_key]) v = tpl_color_set[sub_key];
					else v = tpl_color_set[type+'_default_'+fn];
				}

				tpl_color_opacity[k] = (v) ? 1 : 0;
				if(v) {
					tpl_color_state[k] = true;
					tpl_color_set[k] = v;
				}

			} else {
				v = style.getColorORTransparent(v);
				tpl_color_state[k] = true;
			}

			if(typeof tpl_color_opacity[k] == 'undefined') {
				var opacity_val = (v == 'transparent' || !tpl_color_set[k]) ? 0 : 1;
				tpl_color_opacity[k] = (v.indexOf('rgba') > -1) ? v.substr((v.lastIndexOf(',')+1),(v.lastIndexOf(')')- (v.lastIndexOf(',')+1))).trim() : opacity_val;
			}

			tpl_color_hex[k] = (v.indexOf('#') > -1 ) ? v : style.rgbahex(v);

		});


		var getColorBox = function(menu_type, css_type, color_set) {
			var pn = (css_type == 'font') ? 'color' : 'background-color',
				// menu_el = 'el-menu',
				menu_selector = '.menu-' + SID,
				menu_css = MCSS,
				menu_s = style.get(menu_css,menu_selector),
				menu_bgpicker = $('#bc-default-background .coloris[data-clr="elconfig"][pn="background-color"][selector=".menu-'+SID+'"]');
				menu_bgcolor = (menu_bgpicker.length > 0) ? menu_bgpicker.val() : Coloris.getChangeColorVal(menu_s.bgColor,'a',1),
				menu_bgimg = (menu_bgpicker.closest('.panel-item').next('.panel-item').find('.attach-thumb').length > 0) ? true : false,
				menu_bgtransparent = ( (menu_bgpicker.length > 0 && menu_bgpicker.closest('.coloris-picker').hasClass('clr-transparent')) ||
										(menu_bgpicker.lenght == 0 && Coloris.getColorInfo(menu_s.bgColor,'alpha') == 0)
									) ? 'clr-transparent' : '',
				menu_bgtooltip = '';

			if(pn == 'background-color') {
				if(menu_bgimg) menu_bgtooltip = $.lang[LANG]['editor.menu.color.transparent.edit.info2'];
				else if(menu_bgtransparent != '') menu_bgtooltip = $.lang[LANG]['editor.menu.color.transparent.edit.info'];
			}

			if(menu_type == 'menublock') {
				return '\
					<div class="menu-bg color-box ' + menu_bgtransparent.replace('clr-','checked-') + '" data-ctype="bg" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + menu_bgtooltip + '">\
						' + getColorisHtml(menu_bgcolor,'menuconfig',{'pn':'background-color-all', 'el':'el-menu', 'selector':'.menu-temp-' + SID},'thumbnail',true,{'wrap':menu_bgtransparent, 'input':'clr-alphaoff clr-tooltipoff'}) + '\
					</div>\
				'; 
			} else {
				var mode = ['default','hover','active'],
					this_html = '',
					check_return = false;

				var this_transparent = '';
				if(pn == 'background-color') {
					this_transparent = ( menu_bgtransparent == 'clr-transparent' &&
										 Coloris.getColorInfo($(menu_selector).find('ul.navbar-nav > li > a').css('background-color'),'alpha') == 0 &&
										 Coloris.getColorInfo($(menu_selector).find('ul.dropdown-menu > li > a').css('background-color'),'alpha') == 0 
										) ? 'clr-transparent' : '';
				}

				mode.forEach(function(i,v) {
					var checkTypeFixedIcon = ($.inArray(menu_type, ['fixbtn','cart']) > -1) ? true : false,
						checkEtc = (typeof tpl_etc_list[menu_type+'_'+i+'_before'] != 'undefined' || typeof tpl_etc_list[menu_type+'_'+i+'_after'] != 'undefined') ? true : false,
						this_opacity = (tpl_color_opacity[menu_type+'_'+i+'_'+css_type] == 0 || checkTypeFixedIcon && v < 2 || this_transparent == 'clr-transparent') ? 'transparent' : '',
						this_colorbox = '',
						this_tooltip = '',
						this_etc_html = '';

					if(css_type == 'bg') {
						if(menu_bgtooltip != '') this_tooltip = menu_bgtooltip;
						else if(this_opacity != '') this_tooltip = $.lang[LANG]['editor.menu.color.transparent.edit.info'];

						this_colorbox = this_opacity + ((menu_bgimg) ? ' used-bg' : '');
					}

					if(pn == 'color' && checkEtc) {
						if(typeof tpl_etc_list[menu_type+'_'+i+'_before'] != 'undefined') {
							this_etc_html += '<input type="hidden" class="menu-etc" value="' + tpl_etc_list[menu_type+'_'+i+'_before']['css_type'] + '" data-selector="' + tpl_etc_list[menu_type+'_'+i+'_before']['selector'] + '"/>';
						}
						if(typeof tpl_etc_list[menu_type+'_'+i+'_after'] != 'undefined') {
							this_etc_html += '<input type="hidden" class="menu-etc" value="' + tpl_etc_list[menu_type+'_'+i+'_after']['css_type'] + '" data-selector="' + tpl_etc_list[menu_type+'_'+i+'_after']['selector'] + '"/>';
						}
					}

					if(menu_type == 'main' && css_type == 'font' && v == 0) { //Menu Color Settings - Menu text color Change ==> Mobile Toggle bar color
						var this_selector = (selector.indexOf('menu-temp-')>-1) ? '.menu-temp-' + SID : '.menu-' + SID;
						this_etc_html += '<input type="hidden" class="menu-etc" value="background-color" data-selector="' + this_selector + ' .navbar-toggle .icon-bar" />';
					}

					if(checkTypeFixedIcon && typeof tpl_fixbtn_color[css_type+'_'+i]=='undefined') {
						check_return = true;
						return this_html;
					}

					var tpl_cstate = (checkTypeFixedIcon && v < 2) ? 'true' : tpl_color_state[menu_type+'_'+i+'_'+css_type],
						// tpl_opacity = (checkTypeFixedIcon && v < 2) ? 'true' : tpl_color_opacity[menu_type+'_'+i+'_'+css_type],
						tpl_color = (checkTypeFixedIcon && v < 2) ? tpl_fixbtn_color[css_type+'_'+i]['colorVal'] : tpl_color_hex[menu_type+'_'+i+'_'+css_type],
						tpl_selector = (checkTypeFixedIcon && v < 2) ? tpl_fixbtn_color[css_type+'_'+i]['selector'] : tpl_color_selector[menu_type+'_'+i],
						tpl_pn = (checkTypeFixedIcon && v < 2) ? 'fixbtn' : pn;
	

					this_html += '\
								<div class="color-box ' + this_colorbox + '" data-type="' + menu_type + '" data-mode="' + i + '" data-ctype="' + css_type + '" data-cstate="' + tpl_cstate + '"  data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + this_tooltip + '">\
									' + getColorisHtml(tpl_color,'menuconfig',{'pn':tpl_pn, 'el':'elmenu-color-edit', 'selector':tpl_selector},'thumbnail',true,{'wrap':this_transparent, 'input':'clr-alphaoff clr-tooltipoff'}) + '\
									' + this_etc_html + '\
								</div>\
					';
					if(v == 2) check_return = true;
				});

				if(check_return) return this_html;
			}
		}

		var fixbtn_str = '', cart_str = '';
		if($('.el-menu .cl-fixbtn.cl-visible').length > 0 && VALIDTYPE) {
			fixbtn_str = '\
					<div class="clearfix"></div>\
					<hr/>\
					\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6 style="margin-top: 9px">' + $.lang[LANG]["editor.menu.color.fixbtn"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-9 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										<div class="option_name"></div>\
										' + getColorBox('fixbtn','fixbtn',tpl_fixbtn_color) + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
			'
		} 
		
		if($('.el-menu .cl-fixbtn.siteCART').is(':visible') && VALIDTYPE == 'SM') {
			cart_str = '\
					<div class="clearfix"></div>\
					<hr/>\
					\
					<div class="col-xs-3 col-sm-3 col-md-4">\
						<h6 style="margin-top: 9px">' + $.lang[LANG]["editor.menu.color.cart"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-8 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line cart_palette">\
										<div class="option_name"></div>\
										' + getColorBox('cart','cart',tpl_fixbtn_color) + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
			'
		}

		var str = '\
			<div class="elmenu-color-sidebar">\
				<h5 class="text-center">' + $.lang[LANG]["editor.menu.color-edit"] + '</h5>\
				<div class="row">\
					<div class="col-xs-9 col-sm-9 col-md-9 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 clearfix">\
									<div class="header-line">\
										<div class="mode_name default_color">' + $.lang[LANG]["editor.menu.color.default"] + '</div>\
										<div class="mode_name hover_color">' + $.lang[LANG]["editor.menu.color.hover"] + '</div>\
										<div class="mode_name active_color">' + $.lang[LANG]["editor.menu.color.active"] + '</div>\
									</div>\
					</div>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6>' + $.lang[LANG]["editor.menu.color.menu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-9 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.font"] + '</div>\
										' + getColorBox('main','font',tpl_color_set) + '\
									</div>\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
										' + getColorBox('main','bg',tpl_color_set) + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6>' + $.lang[LANG]["editor.menu.color.submenu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-9 no-padding">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.font"] + '</div>\
										' + getColorBox('sub','font',tpl_color_set) + '\
									</div>\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
										' + getColorBox('sub','bg',tpl_color_set) + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				' + fixbtn_str + '\
				' + cart_str + '\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-3">\
						<h6 style="' + ((LANG == 'en') ? 'margin-top: 0;' : 'margin-top: 9px') + '">' + $.lang[LANG]["editor.menu.color.menublock"] + '</h6>\
					</div>\
					<div class="no-padding '+ ((LANG == 'en') ? 'col-xs-8 col-sm-8 col-md-8 col-xs-offset-1 col-sm-offset-1 col-md-offset-1' : 'col-xs-9 col-sm-9 col-md-9') + '">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										' + getColorBox('menublock','bg',tpl_color_set) + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<div class="btn-wrap">\
							<div class="btn btn-default btn-sm close-btn-menuColorSet">' + $.lang[LANG]["config.cancel"] + '</div>\
							<div class="btn btn-primary btn-sm save-btn-menuColorSet">' + $.lang[LANG]["config.save"] + '</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;

	}

	this.menuRootColorSetForm = function(j,selector) {
		var checkMenuFheader = ($('header.'+selector).hasClass('navbar-fheader')) ? true : false,
			checkMenuBgcolorHide = ($('header.'+selector).find('.cl-menu-option').length > 0) ? true : false,
			j_s = style.get(j, selector);

		/*
			MENU Root CSS
			메인메뉴	폰트		--menu-color / --menu-color-hover / --menu-color-active
						배경		--menu-bgcolor / --menu-bgcolor-hover / --menu-bgcolor-active
			
			서브메뉴	폰트		--sub-menu-color / --sub-menu-color-hover / --sub-menu-color-active
						배경		--sub-menu-bgcolor / --sub-menu-bgcolor-hover / --sub-menu-bgcolor-active

			확장기능			--fixed-menu-color (--fixed-menu-color2) / --fixed-menu-color-hover (--fixed-menu-color-hover2)
			장바구니 수량		--fixed-menu-point

			전체배경			--block-bgcolor
			펼침메뉴 배경		--moption-bgcolor
		*/

		var getRootColorBox = function(root_selector,root_style,root_key) {
			if(typeof root_key == 'undefined' || root_key == '') return '';

			var root_group = [root_key],
				checkHover = (root_key.match(/^\_\_(sub\_)?menu\_/i) != null || root_key == '__fixed_menu_color') ? true : false,
				checkActive = (root_key.match(/^\_\_(sub\_)?menu\_/i) != null) ? true : false;

			if(checkHover) root_group.push(root_key+'_hover');
			if(checkActive) root_group.push(root_key+'_active');

			var init_color = (root_key.indexOf('_bgcolor') > -1) ? root_style.bgColor : root_style.txColor,
				init_key = (root_key.indexOf('_bgcolor') > -1) ? '--block-bgcolor' : '--block-color',
				init_check = true,
				root_str = '';
			$.each(root_group, function(i, r_k) {
				var r_v = root_style[r_k];
				var r_v_empty = (typeof r_v == 'undefined' || r_v == '') ? true : false;
				if(r_v_empty) {
					r_v = init_color;
				} else {
					if(init_check) {
						init_color = r_v;
						init_key = r_k.replace(/\_/gi,'-');
						init_check = false;
					}
				}

				var r_v_transparent = (style.getColorORTransparent(r_v) == 'transparent') ? ' transparent' : '',
					r_v_block_transparent =  (root_style.bgColor == 'transparent') ? ' bg-transparent' : '',
					r_v_block_bgurl = (root_style.bgUrl != 'none') ? ' bg-url' : '',
					color_tooltip = '';

				if(r_v_transparent != '' && r_v_block_bgurl != '') color_tooltip = $.lang[LANG]['editor.menu.color.transparent.edit.info2'];
				else if(r_v_transparent != '') color_tooltip = $.lang[LANG]['editor.menu.color.transparent.edit.info'];
				var color_box_tooltip = (color_tooltip != '') ? 'data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="'+color_tooltip + '"' : '';
				root_str += '\
					<div class="color-box rv ' + r_v_transparent + r_v_block_transparent + r_v_block_bgurl + '" ' + color_box_tooltip + '>\
						' + getColorisHtml(r_v,'elconfig',{'data-root':r_k.replace(/\_/gi,'-'), 'el':selectEL, 'selector':'.'+root_selector, 'data-init':((r_v_empty) ? init_key : '')},'thumbnail',true,{'input':'clr-alphaoff'}) +  '\
					</div>\
				';
			});
 
			return root_str;
		}

		var fixedmenu_str = '';
		if(typeof VALIDPLAN != 'undefined' && VALIDPLAN) {

			if($('.el-menu .cl-fixbtn.cl-visible').length > 0) {
				fixedmenu_str += '\
					<div class="clearfix"></div>\
					<hr/>\
					\
					<div class="col-xs-3 col-sm-3 col-md-4">\
						<h6 style="margin-top: 9px">' + $.lang[LANG]["editor.menu.color.fixbtn"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-8 no-padding" style="padding-left: 22px;">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										' + getRootColorBox(selector,j_s,'__fixed_menu_color') + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				';
			}

			if($('.el-menu .cl-fixbtn.siteCART').is(':visible') && VALIDTYPE == 'SM') {
				fixedmenu_str += '\
					<div class="clearfix"></div>\
					<hr/>\
					\
					<div class="col-xs-3 col-sm-3 col-md-4">\
						<h6 style="margin-top: 9px">' + $.lang[LANG]["editor.menu.color.cart"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-8 no-padding" style="padding-left: 22px;">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										' + getRootColorBox(selector,j_s,'__fixed_menu_point') + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				';
			}
		}



		var tmp_str = (checkMenuBgcolorHide) ? ['4','style="margin-top: 9px"','8',' style="padding-left: 22px;"','',$.lang[LANG]['editor.menu.color.blockbgcolor']] : ['3','','9','','<div class="option_name">' + $.lang[LANG]["editor.menu.color.font"] + '</div>',$.lang[LANG]['editor.menu.color.menublock']],
			str = '\
			<div class="elmenu-color-sidebar">\
				<h5 class="text-center">' + $.lang[LANG]["editor.menu.color-edit"] + '</h5>\
				<div class="row">\
					<div class="col-xs-9 col-sm-9 col-md-9 col-xs-offset-3 col-sm-offset-3 col-md-offset-3 clearfix">\
						<div class="header-line" ' + ((LANG == 'en') ? 'style="padding-right: 20px;"' : '') + '>\
							<div class="mode_name default_color">' + $.lang[LANG]["editor.menu.color.default"] + '</div>\
							<div class="mode_name hover_color">' + $.lang[LANG]["editor.menu.color.hover"] + '</div>\
							<div class="mode_name active_color">' + $.lang[LANG]["editor.menu.color.active"] + '</div>\
						</div>\
					</div>\
				\
					<div class="col-xs-3 col-sm-3 col-md-'+tmp_str[0]+'">\
						<h6 '+tmp_str[1]+'>' + $.lang[LANG]["editor.menu.color.menu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-'+tmp_str[2]+' no-padding" '+tmp_str[3]+'>\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										'+tmp_str[4]+'\
										' + getRootColorBox(selector,j_s,'__menu_color') + '\
									</div>\
		';
		if(!checkMenuBgcolorHide) str += '\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
										' + getRootColorBox(selector,j_s,'__menu_bgcolor') + '\
									</div>\
		';
		str += '\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-'+tmp_str[0]+'">\
						<h6 '+tmp_str[1]+'>' + $.lang[LANG]["editor.menu.color.submenu"] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-'+tmp_str[2]+' no-padding" '+tmp_str[3]+'>\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										'+tmp_str[4]+'\
										' + getRootColorBox(selector,j_s,'__sub_menu_color') + '\
									</div>\
		';
		if(!checkMenuBgcolorHide) str += '\
									<div class="color-line">\
										<div class="option_name">' + $.lang[LANG]["editor.menu.color.bg"] + '</div>\
										' + getRootColorBox(selector,j_s,'__sub_menu_bgcolor') + '\
									</div>\
		';
		str += '\
								</div>\
							</div>\
						</div>\
					</div>\
				\
					' + fixedmenu_str + '\
				\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-4">\
						<h6 style="' + ((LANG == 'en') ? 'margin-top: 0;' : 'margin-top: 9px') + '">' + tmp_str[5] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-8 no-padding" style="padding-left: 22px;">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										' + getRootColorBox(selector,j_s,'__block_bgcolor') + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				\
		';
		if(checkMenuBgcolorHide) {
			str += '\
					<div class="clearfix"></div>\
					<hr/>\
				\
					<div class="col-xs-3 col-sm-3 col-md-4">\
						<h6 style="' + ((LANG == 'en') ? 'margin-top: 0;' : 'margin-top: 9px') + '">' + $.lang[LANG]['editor.menu.color.moptionblock'] + '</h6>\
					</div>\
					<div class="col-xs-9 col-sm-9 col-md-8 no-padding" style="padding-left: 22px;">\
						<div class="btn-group btn-group-sm">\
							<div class="btn-color-mode btn-group color-palette">\
								<div class="color-picker-wrap">\
									<div class="color-line">\
										' + getRootColorBox(selector,j_s,'__moption_bgcolor') + '\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				\
			';
		}
		str += '\
					<div class="clearfix"></div>\
					<div class="btn-wrap">\
							<div class="btn btn-default btn-sm close-btn-menuColorSet">' + $.lang[LANG]["config.cancel"] + '</div>\
							<div class="btn btn-primary btn-sm save-btn-menuColorSet">' + $.lang[LANG]["config.save"] + '</div>\
					</div>\
				</div>\
			</div>\
		';

		return str;
	}


	this.checkBlockRootCSS = function(tp) {
		if(typeof $.bcModal.select_el == 'undefined') return false;

		var this_el = $.bcModal.select_el,
			this_elstyle = ($.bcModal.data.checkMenu) ? window.getComputedStyle(document.querySelector(`.${this_el} header`)) : window.getComputedStyle(document.querySelector(`.${this_el}`)),
			check_properties = [],
			onoff = false;

		switch(tp) {
			case 'root-layout':
				check_properties.push('--layout-gap-col','--layout-gap-row','--layout-col-p','--layout-imgh');
				break;

			case 'swiper-option':
				check_properties.push('--swiper-view','--swiper-space','--swiper-height');
				break;

			case 'slick-config':
				check_properties.push('--slick-speed','--slick-autoplay','--slick-autoplay-speed');
				break;

			case 'slick-option':
				check_properties.push('--slick-view','--slick-space','--slick-height');
				break;

			case 'slick-option':
				check_properties.push('--sync-view','--sync-space','--sync-height');
				break;

			case 'root-btn-color':
				check_properties.push('--btn-color','--btn-bgcolor','--btn-line','--btn-color-hover','--btn-bgcolor-hover','--btn-line-hover');
				break;

			case 'ctrl-root-border':
				check_properties.push('--block-line-color','--block-outline-color','--block-boxline-color');
				break;

			case 'ctrl-root-svg':
				check_properties.push('--block-svg-color');
				break;

			case 'ratio-padding':
				check_properties.push('--ratio-padding-top','--ratio-padding-bottom');
				break;

			case 'pagination-color':
				check_properties.push('--pagination-btn-color','--pagination-btn-bgcolor','--pagination-dot-color','--slick-arrow-color','--slick-dot-color');
				break;

			case 'tab-color':
				check_properties.push('--tab-color','--tab-line-color','--tab-bgcolor');
				break;

			default:
				check_properties.push('default');
				break;
		}

		if(check_properties[0] == 'default') {
			if(typeof tp != 'undefined' && tp) {
				if(!/^--/.test(tp)) tp = '--'+tp;
				if(typeof this_elstyle.getPropertyValue(tp) != 'undefined' && this_elstyle.getPropertyValue(tp)) onoff = true;
			}
		} else {
			onoff = check_properties.some(prop => this_elstyle.getPropertyValue(prop));
		}

		return onoff;
	}


}