if(typeof LANG == 'undefined') var LANG = getLanguage(); 
  
$(window).load(function(data) {
	setLanguage(LANG);
	collectionSortable();
});

$(function() {
	$('.pageIcon.nonpage a[href="#"]').click(function(e) {
		e.preventDefault();
	});


	$.fheader = {
		refreshFixedSub: function() {
			// console.log('refreshFixedSub');
			//ver4 ( ver3 + menu height )

			var body_width = (PAGE_MODE == 'c') ? $('body').width() : window.innerWidth,
				$fh = (typeof isElviewPage != 'undefined' && isElviewPage === true) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				fh_type = $fh.attr('data-fh-type'),
				fh_postion = (typeof $fh.attr('data-position') != 'undefined') ? $fh.attr('data-position') : '',
				fh_transparent = ($fh.hasClass('transparent')) ? true : false,
				checkFixTypeMenu = (typeof $fh.attr('data-fixtype') != 'undefined' && $fh.attr('data-fixtype')) ? true : false;

			if( $fh.find('#fixed-menu').length == 0 ||
				$fh.hasClass('sidebar') ||
				fh_type != 'right' ||
				$fh.find(' > .container[data-fh-align]').length == 0
			) { return false; }

			var fixedSubOn = ($fh.find('.fh-container').css('display') == 'none') ? false : true;

			if(!checkFixTypeMenu && window.innerWidth > 768) {
				var collapse_w	= $fh.find('.collapse').width(),
					tpl_nav_w	= $fh.find('#tpl-menu').outerWidth(),
					fixed_nav_w	= parseInt($fh.find('#fixed-menu').outerWidth()) + parseInt($fh.find('#fixed-menu').css('margin-left')) + parseInt($fh.find('#fixed-menu').css('margin-right')),
					checkWidth	= (parseInt(collapse_w) < parseInt(tpl_nav_w) + fixed_nav_w) ? true : false;

				if(checkWidth) {
					var checkOnepx = ((parseInt(tpl_nav_w) + fixed_nav_w) - parseInt(collapse_w) === 1) ? true : false;
					if(checkOnepx) checkWidth = false;
				}

				var tpl_nav_cnt	= $fh.find('#tpl-menu > li').length,
					tpl_nav_th	= (tpl_nav_cnt == 0) ? 0 : $fh.find('#tpl-menu > li').eq(0).position().top,
					tpl_nav_h	= (tpl_nav_cnt == 0) ? 0 : $fh.find('#tpl-menu > li').eq(tpl_nav_cnt-1).position().top,
					checkHeight	= (parseInt(tpl_nav_th) != parseInt(tpl_nav_h)) ? true : false;

				if(fixedSubOn) { // aready fixed menu sub show
					if(!checkWidth && !checkHeight) fixedSubOn = false;
				} else {
					if(checkWidth || checkHeight) fixedSubOn = true;
				}
			}

			if(fixedSubOn) {
				if($fh.hasClass('transparent')) {
					$fh.find('#tpl-menu').addClass('overflow-menu');
					$fh.find('#fixed-menu').addClass('overflow-menu');
					$fh.find('#fixed-menu-sub').addClass('overflow-menu');
				}
				var fh_nav_pdRight = parseInt($fh.find('#tpl-menu > li > a').css('padding-right')) + parseInt($fh.find('.collapse').css('padding-right')) - 10;

				if($fh.find('.navbar-center').length==0) {
					if(checkFixTypeMenu) return false;
					$('#fixed-menu').hide();
					$('#fixed-menu-sub').closest('.fh-container').eq(0).show().addClass('active');
				} 
				
				$('#fixed-menu-sub').css('margin-right',fh_nav_pdRight+'px');
			} else {
				$fh.find('#tpl-menu').removeClass('overflow-menu');
				$fh.find('#fixed-menu').removeClass('overflow-menu');
				$fh.find('#fixed-menu-sub').removeClass('overflow-menu');

				$('#fixed-menu').show();
				$('#fixed-menu-sub').closest('.fh-container').eq(0).hide().removeClass('active');
			}

			if($fh.hasClass('transparent') && $fh.hasClass('overflow-menu') && !$fh.find('#tpl-menu').hasClass('overflow-menu')) {
				$fh.find('#tpl-menu').addClass('overflow-menu');
				$fh.find('#fixed-menu').addClass('overflow-menu');
				$fh.find('#fixed-menu-sub').addClass('overflow-menu');
			}


			if(PAGE_MODE == 'c') {
				$('.addElementButton.addel-menu').css('top',$('header.navbar').outerHeight() + 'px');
			}

			if($('.element[data-feature*=fixedscroll]').length > 0) gjs01SetFixedscroll($('.element[data-feature*=fixedscroll]').eq(0));
		},
		init: function(mode) {
			// console.log('fheader init');
			var checkElviewer = '';
			if(window.parent && window.parent != this && $('.elviewhtml').length > 0) {
				checkElviewer = $('#el-list-image .elgrid.active', window.parent.document).find('.blockname-str').text().trim();
			}

			var s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				s_service = (PAGE_MODE == 'c') ? SERVICE : property.SERVICE,
				checkGabia = (s_service.indexOf('gabia') > -1) ? true : false,
				checkEllist = (typeof mode != 'undefined' && mode == 'ellist') ? true : false,
				checkTemplate = (typeof property != 'undefined' && property.TEMPLATE && property.TEMPLATE=='1') ? true : false,
				sid = (PAGE_MODE == 'c') ? ((checkEllist) ? checkElviewer.replace(/menu-/gi,'') : SID) : property.SID,
				$pc_nav = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				pc_nav_name = (checkEllist) ? $pc_nav.attr('data-name') : 'menu-'+sid,
				$mobile_nav = $pc_nav.find('#tpl-menu').closest('.navbar-'+pc_nav_name).clone(),
				checkFixTypeMenu = (typeof $pc_nav.attr('data-fixtype') != 'undefined' && $pc_nav.attr('data-fixtype')) ? true : false;

			if($pc_nav.find('.cl-menu-option').length > 0) $.moption.init(mode);

			$mobile_nav.prop({id:'mobile-nav'}).removeAttr('class').removeAttr('style');
			
			if(!$pc_nav.hasClass('navbar-fheader') || (checkFixTypeMenu && $pc_nav.find('.cl-fixed-menu').length>0)) return false;
			if(!checkFixTypeMenu && ($.inArray(s_validtype, ['BS','BN','SM']) > -1 || (checkGabia && s_validtype == 'FR'))) {

				var fh_sub = '',
					fh_type = $pc_nav.attr('data-fh-type');

				switch(s_validtype) {
					case 'FR':
					case 'BS':
						fh_sub = '\
							<li class="siteLANG"><a href="#"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a></li>\
						';
						break;
					case 'BN':
						fh_sub = '\
							<li class="siteUM"><a href="#"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></li>\
							<li class="siteLANG"><a href="#"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a></li>\
						';
						break;
					case 'SM':
						fh_sub = '\
							<li class="siteSEARCH"><a href="#"><i class="cl-icon cl_icon_magnifier" aria-hidden="true"></i></a></li>\
							<li class="siteUM"><a href="#"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></li>\
							<li class="siteCART"><a href="#"><i class="cl-icon cl_icon_cart" aria-hidden="true"></i></a></li>\
							<li class="siteLANG"><a href="#"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a></li>\
						';


						/* Shopping Only KO Site */
						// var slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
						// if(typeof slang != 'undefined' && typeof slang.select_code != 'undefined' && slang.select_code != 'ko') {
						// 	fh_sub = '\
						// 	<li class="siteUM"><a href="#"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></li>\
						// 	<li class="siteLANG"><a href="#"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a></li>\
						// 	';
						// }
						break;
					default:
						break;
				}

				if(fh_type == 'top') {
					var menu_container = $pc_nav.find(' > .container').attr('class'),
						fh_line = '<hr class="fh-line"  style="display: none;"/>',
						fh_nav_pdRight = parseInt($pc_nav.find('#tpl-menu > li > a').css('padding-right')) + parseInt($pc_nav.find('.collapse').css('padding-right')) - 10,
						fh_content = '\
							<div class="' + menu_container +' fh-container" style="display: none;">\
								<div class="navbar-wrap">\
									<ul class="navbar-nav navbar-top" id="fixed-menu">\
									' + fh_sub + '\
									</ul>\
								</div>\
							</div>\
						';

					if($pc_nav.find('.cl-drop-fixed-menu').length > 0) $pc_nav.find('.cl-drop-fixed-menu').remove();

					if($pc_nav.find('.fh-line').length > 0) $pc_nav.find('.fh-line').replaceWith(fh_line);
					else $pc_nav.prepend(fh_line);

					if($pc_nav.find('#fixed-menu').length > 0) $pc_nav.find('.fh-container').replaceWith(fh_content);
					else $pc_nav.prepend(fh_content);


					if(!checkEllist) {
						if($mobile_nav.find('#fixed-menu').length > 0) $mobile_nav.find('#fixed-menu').replaceWith($(fh_content).find('#fixed-menu').clone());
						else $mobile_nav.prepend($(fh_content).find('#fixed-menu').clone());
					}

				} else if(fh_type == 'right' || fh_type == 'sidebar') {
					var fixed_menu_str = (fh_type == 'sidebar') ? '' : 'navbar-right',
						fh_line = '<hr class="fh-line visible-xs" style="display: none;"/>',
						fh_content = '\
							<ul class="navbar-nav ' + fixed_menu_str + '" id="fixed-menu" style="display: none;">\
							' + fh_sub + '\
							</ul>\
						';

					if(checkEllist) {
						if(fh_type == 'right' && $pc_nav.find('.mini-home').length > 0) {
							$pc_nav.find('.mini-home').closest('.navbar-collapse').attr('style','display: inline-block !important');
						}
					} else {
						var fh_container = $pc_nav.find(' > .container[data-fh-align]'),
							fh_nav_pdRight = parseInt($pc_nav.find('#tpl-menu > li > a').css('padding-right')) + parseInt($pc_nav.find('.collapse').css('padding-right')) - 10,
							fh_content2 = (	fh_type == 'sidebar' || fh_container.length == 0 ) ? '' : '\
							<div class="' + fh_container.attr('class') +' fh-container" style="display: none;">\
								<div class="navbar-wrap">\
									<ul class="navbar-nav navbar-top" id="fixed-menu-sub" style="margin-right: '+fh_nav_pdRight+'px;">\
										' + fh_sub + '\
									</ul>\
								</div>\
							</div>\
						';
					}

					if($pc_nav.find('#fixed-menu').length > 0) $pc_nav.find('#fixed-menu').replaceWith(fh_content);
					else $pc_nav.find('#tpl-menu').before(fh_content);

					if($pc_nav.find('.fh-line').length > 0) $pc_nav.find('.fh-line').replaceWith(fh_line);
					else $pc_nav.find('#tpl-menu').before(fh_line);

					if(!checkEllist) {
						if(fh_content2.length > 0) {
							if($pc_nav.find('#fixed-menu-sub').length > 0) $pc_nav.find('.fh-container').replaceWith(fh_content2);
							else $pc_nav.prepend(fh_content2);
						}

						if($mobile_nav.find('#fixed-menu').length > 0) $mobile_nav.find('#fixed-menu').replaceWith($(fh_content).removeAttr('style').clone());
						else $mobile_nav.prepend($(fh_content).removeAttr('style').clone());
					}

				}
			}

			/* 메뉴 ::: 확장기능 버튼 추가 버전(20220928) *********************************************************/
			if(checkFixTypeMenu && ($.inArray(s_validtype, ['BS','BN','SM']) > -1 || (checkGabia && s_validtype == 'FR'))) {
				var fh_sub = '',
					fixbtnData = $.menuFixBtn.getData($pc_nav),
					parent_dsgnbody = (checkEllist && typeof PAGE_MODE!='undefined' && PAGE_MODE=='c') ? window.parent.document : '',
					lang_txt = (checkEllist) ? $(parent_dsgnbody).find('header.navbar-fheader .siteLANG.cl-fixbtn').attr('data-fixlang') : '',
					lang_code = (checkEllist) ? $(parent_dsgnbody).find('header.navbar-fheader .siteLANG.cl-fixbtn').attr('data-fixlangcode') : '',
					lang_sidebar = (fixbtnData['fh-type']=='sidebar') ? false : true,
					slang_html = '',
					lang_str = LANG,
					validArray = {},
					validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
					validplan = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN;

				if(checkEllist && typeof SLANG == 'undefined') {
					var slang_obj = {
							use_language : 'off',
							lists : {},
							select : lang_txt,
							select_code : lang_code
						}
					SLANG = slang_obj;
				} else SLANG = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
				
				if((typeof SLANG != 'undefined' && typeof SLANG.select_code != 'undefined' && SLANG.select_code)
			                || (!$.isEmptyObject(SLANG) && SLANG.use_language == 'on' && SLANG.select_code)) {
			        lang_str = (SLANG['select_code'].toLowerCase()!='ko') ? 'en' : 'ko';
			    } 
			   
				var validArray = {
					'validtype' : validtype,
					'validplan' : validplan
				}
			
				$mobile_nav.attr('data-fixtype',fixbtnData['fixtype'])
							.attr('data-fixlangtype',fixbtnData['fixlangtype'])
							.attr('data-fixsize',fixbtnData['fixsize'])
							.attr('data-fixlangsize',fixbtnData['fixlangsize']);			
			
				if(fixbtnData['fixtypeText']=='top') fh_sub += $.menuFixBtn.topSet(fixbtnData['fixtypeNum'],false,validArray,SLANG);
				else fh_sub += $.menuFixBtn.sidebarSet(fixbtnData['fixtypeNum'],false,validArray,SLANG); 				

				if(fixbtnData['fh-type'] == 'top') {
					var menu_container = $pc_nav.find(' > .container').attr('class'),
						/*fh_line = '<hr class="fh-line"  style="display: none;"/>',*/
						fh_nav_pdRight = parseInt($pc_nav.find('#tpl-menu > li > a').css('padding-right')) + parseInt($pc_nav.find('.collapse').css('padding-right')) - 10,
						fh_content = '\
							<div class="' + menu_container +' fh-container">\
								<div class="navbar-wrap">\
									<ul class="navbar-nav navbar-top cl-fixed-menu" id="fixed-menu">\
									' + fh_sub + '\
									</ul>\
								</div>\
							</div>\
						';

					if($pc_nav.find('input[class*="cl-menu-"]').length > 0) $pc_nav.find('input[class*="cl-menu-"]').last().after(fh_content);
					else $pc_nav.prepend(fh_content);
					
					//if(!checkEllist) {
						if($mobile_nav.find('#fixed-menu').length > 0) $mobile_nav.find('#fixed-menu').replaceWith($(fh_content).find('#fixed-menu').clone());
						else $mobile_nav.prepend($(fh_content).find('#fixed-menu').clone());
					//}
				} else if(fixbtnData['fh-type'] == 'right' || fixbtnData['fh-type'] == 'sidebar') {
					var fixed_menu_str = (fixbtnData['fh-type'] == 'sidebar') ? '' : 'navbar-right',
						fh_line = '<hr class="fh-line visible-xs" style="display: none;"/>',
						fh_content = '\
							<ul class="navbar-nav ' + fixed_menu_str + ' cl-fixed-menu" id="fixed-menu">\
							' + fh_sub + '\
							</ul>\
						';

					if(checkEllist) {
						if(fixbtnData['fh-type'] == 'right' && $pc_nav.find('.mini-home').length > 0) {
							$pc_nav.find('.mini-home').closest('.navbar-collapse').attr('style','display: inline-block !important');
						}
					}

					$pc_nav.find('#fixed-menu').remove();
					$pc_nav.find('#tpl-menu').before(fh_content);

					//if(!checkEllist) {
						if($mobile_nav.find('#fixed-menu').length > 0) $mobile_nav.find('#fixed-menu').replaceWith($(fh_content).removeAttr('style').clone());
						else {
							$(fh_content).removeAttr('style').clone();
							$mobile_nav.prepend($(fh_content).removeAttr('style').clone());
						}
					//}
				}

				/* 메뉴 디자인변경 :: slang make X => fheader init(pc_nav)에서 적용 ***/
				if(checkEllist) {
					slang_html = $.menuFixBtn.fixLangSet(fixbtnData['fixlangtypeNum'],lang_sidebar,SLANG,'',validArray);
					$pc_nav.find('.siteLANG.cl-fixbtn').remove();
					(fixbtnData['fh-type']=='sidebar') ? $pc_nav.find('.menu-inner').after(slang_html) : $pc_nav.find('#fixed-menu').append(slang_html);
											
					$pc_nav.find('.siteLANG').removeClass('dropup').removeClass('dropdown');
					$pc_nav.find('.siteLANG .cl-lang').removeClass('dropdown-toggle');
					$pc_nav.find('.siteLANG .dropdown-menu').remove();
				}
			}

			// $mobile_nav.find('#fixed-menu').removeAttr('class');
			// $mobile_nav.find('#tpl-menu').prop({class:'nav navbar-nav'}).find('ul').prop({class:'',id:''});
			// $mobile_nav.find('#tpl-menu').removeAttr('class');
			$mobile_nav.find('#tpl-menu').removeClass('hide').removeClass('preloading');
			$mobile_nav.find('#tpl-menu').removeAttr('style');

			$mobile_nav.find('.dropdown').not('.siteUM.cl-fixbtn').each(function() {
				$(this).addClass('menu-has-children').removeClass('dropdown');
				$(this).find('> a').removeClass('dropdown-toggle');
				$(this).find('> a i').remove();

				if(($(this).hasClass('active') || $(this).hasClass('open')) && $(this).find('li.active').length > 0) {
					if($(this).find('li.active').length > 0) $(this).removeClass('active').addClass('open');
					$(this).find('> a').nextAll('ul').eq(0).slideToggle();
					$(this).prepend('<i class="fa fa-chevron-up"></i>');
				} else {
					$(this).prepend('<i class="fa fa-chevron-down"></i>');
				}
			});

			if(checkFixTypeMenu && ($.inArray(s_validtype, ['BS','BN','SM']) > -1 || (checkGabia && s_validtype == 'FR'))) {
				$mobile_nav.find('#fixed-menu').wrap('<div class="mobilenav_top"></div>');
				
				/* 메뉴 디자인변경 :: slang make X => fheader init(mobile_nav)에서 적용 ***/
				if(checkEllist) {
					var psearch_ellist = '\
						<li class="siteSEARCH">\
							<a href="javascript:;" class="psearch-btn"><i class="cl-icon cl_icon_magnifier" aria-hidden="true"></i></a>\
							<div class="psearch-overlay">\
								<span class="psearch-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Product Search"></span></span>\
								<div class="psearch-body">\
									<span class="psearch-wrap">\
										<a href="#" class="psearch-icon"><i class="cl-icon cl_icon_magnifier"></i></a>\
										<input class="psearch-input" type="text" name="" placeholder="' + $.lang[LANG]['fheader.psearch'] + '">\
									</span>\
								</div>\
							</div>\
						</li>\
						',
						sitelangStr = $.menuFixBtn.fixLangSet(fixbtnData['fixlangtypeNum'],false,'',true);

					var hide_UM = (s_validtype=='BN' || s_validtype=='SM') ? '' : 'hide';
					$mobile_nav.find('.mobilenav_top').prepend('<div class="login-content siteUM"><a href="javascript:;" class="login '+hide_UM+'">' + $.lang[lang_str]['manager.site-um.mobile.login'] + clSVG('select_arrow',16,16) + '</a></div>');
					if(s_validtype=='SM') {
						$mobile_nav.find('#fixed-menu .siteSEARCH').replaceWith(psearch_ellist);
					}
					if(s_validtype && sitelangStr) $mobile_nav.append(sitelangStr).find('.cl-fixbtn.siteLANG');
				}
				//if(checkEllist) $mobile_nav.find('#fixed-menu .mobilenav_top').prepend(ellist_mobile_logincontent);
			}
			
			var fh_line = '<hr class="fh-line" />';
			(checkFixTypeMenu) ? $mobile_nav.find('.mobilenav_top').after(fh_line) : $mobile_nav.find('#fixed-menu').after(fh_line);
			//$mobile_nav.find('#tpl-menu').after(fh_line);

			var menu_selector = (checkEllist) ? '.elviewhtml .menu-'+sid : '.el-menu .menu-'+sid,
				$checkMenuEL = $(menu_selector),
				check_mobile_design = $checkMenuEL.hasClass('mobile-design-clear') ? false : true,
				check_mnormal = ($checkMenuEL.find('.cl-menu-normal').length > 0) ? true : false,
				check_msidebar = ($checkMenuEL.find('.cl-menu-sidebar').length > 0) ? true : false,
				check_moption = ($checkMenuEL.find('.cl-menu-option').length > 0) ? true : false;
			if(checkEllist) $mobile_nav.addClass('elview');
			if(check_moption) $mobile_nav.addClass('moption');
			else if(check_mnormal) $mobile_nav.addClass('mnormal');
			else if(check_msidebar) $mobile_nav.addClass('msidebar');
			if(!check_mobile_design) {
				$mobile_nav.addClass('mobile-design-clear menu-'+sid);
				$mobile_nav.find('.menu-has-children > ul').addClass('dropdown-menu');
			}
			
			$('.dsgn-body').append($mobile_nav);
			$('.dsgn-body').append('<div id="mobile-body-overly"><span class="pull-right hand" id="mobile-nav-toggle"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Menu"></span></div>');

			if(checkTemplate) {
				$(document).find('#mobile-nav').find('.mobilenav_top').hide();
				$(document).find('#mobile-nav').find('.mobilenav_top').next('.fh-line').hide();
			}

			var mobile_selector = (checkEllist) ? ['.elview','.elviewhtml'] : ['','.el-menu'];
			if(check_moption || check_mnormal || check_msidebar) {
				
				mobile_selector[0] += (check_moption) ? '.moption' : ((check_msidebar) ? '.msidebar' : '.mnormal');
				mobile_selector[1] +=  (check_moption) ? ' .cl-menu-option ~ .container' : ((check_msidebar) ? ' .cl-menu-sidebar ~ .container' : ' .cl-menu-normal ~ .container');
				
				var nav_font = getComputedStyle(document.querySelector(menu_selector)).getPropertyValue('--menu-fname'),
					nav_color = getComputedStyle(document.querySelector(menu_selector)).getPropertyValue('--menu-color'),
					nav_color_active = getComputedStyle(document.querySelector(menu_selector)).getPropertyValue('--menu-color-active'),
					nav_fixed_key = (check_mobile_design) ? '--menu-fname' : '--fixed-menu-color',
					fixed_color = (checkFixTypeMenu) ? getComputedStyle(document.querySelector(menu_selector)).getPropertyValue(nav_fixed_key) : '';
			} else {
				var nav_font = (checkFixTypeMenu) ? $('.menu-' + sid + ' ul#tpl-menu > li > a').css('font-family') : $('.menu-' + sid + ' ul.navbar-nav > li > a').css('font-family');
				if(typeof nav_font != 'undefined' && nav_font) {
					nav_font = nav_font.replace(/\'/gi,'').replace(/\"/gi,'');

					var nav_color = $('.menu-' + sid + ' ul.navbar-nav > li > a:not(:hover)').css('color'),
						nav_color_active = $('.menu-' + sid + ' ul.navbar-nav > li.active > a').css('color'),
						fixed_color = '';
					if(checkFixTypeMenu) {
						fixed_color = ($('.el-menu .navbar-fheader').hasClass('mobile-design-clear')) ? $('.menu-' + sid + ' ul.cl-fixed-menu > li.cl-fixbtn a').css('color') : $('.el-menu .navbar-toggle .icon-bar').css('background-color');
					}
				}

				if(typeof nav_color_active == 'undefined' || nav_color_active == '') nav_color_active = nav_color;
				var mcss_fixed = (checkFixTypeMenu) ? '\
						'+mobile_selector[1]+' .siteCART.micon {color : ' + fixed_color + '; }\
						#mobile-nav'+mobile_selector[0]+'.mobile-design-clear .mobilenav_top a {color : ' + fixed_color + '; }\
						#mobile-nav'+mobile_selector[0]+'.mobile-design-clear .mobilenav_top svg {fill : ' + fixed_color + '; }\
					' : '',
					mcss_more = '\
					@media only screen and (max-width:768px) {\
						#mobile-nav'+mobile_selector[0]+' { font-family: ' + nav_font + '; }\
						#mobile-nav'+mobile_selector[0]+'.mobile-design-clear #tpl-menu li.menu-has-children i,\
						#mobile-nav'+mobile_selector[0]+'.mobile-design-clear #tpl-menu li.menu-has-children i:focus { color: ' + nav_color + '; }\
						#mobile-nav'+mobile_selector[0]+'.mobile-design-clear #tpl-menu li.menu-has-children.active i { color: ' + nav_color_active + '; }\
						'+ mcss_fixed +'\
					}\
				';
	
				var menu_css_selector = (checkEllist) ? '.elviewcss' : '#menu-'+sid;
				$(menu_css_selector).append(mcss_more);
			}

			$('.el-menu').removeClass('_ready');
		},
		set: function(mode) {
			// console.log('fheader set');
			var checkEllist = (typeof mode != 'undefined' && mode=='ellist') ? true : false,
				checkStorageCapture = (typeof isStoragebox != 'undefined' && isStoragebox && typeof isCapture != 'undefined' && isCapture) ? true : false,
				$fh = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				fh_type = $fh.attr('data-fh-type'),
				checkFixTypeMenu = (typeof $fh.attr('data-fixtype') != 'undefined' && $fh.attr('data-fixtype')) ? true : false;
				
			if($fh.find('#fixed-menu').children().length == 0) {
				if(fh_type == 'top') $fh.find('.fh-container').remove();
				else if(fh_type == 'right' || fh_type == 'sidebar') $fh.find('#fixed-menu, .fh-line').remove();
				$('#mobile-nav #fixed-menu, #mobile-nav .fh-line').remove();
			}
			
			if(!checkFixTypeMenu) {
				if(checkStorageCapture) {
				} else {
					if(fh_type == 'top') {
						$fh.find('.fh-container').eq(0).slideToggle();
					} else if(fh_type == 'right' || fh_type == 'sidebar') {
						$fh.find('#fixed-menu').slideToggle();
					}
					
					$fh.find('.fh-line').slideToggle();
				}
			}			
			
			setTimeout(function() {				
				if(checkEllist) {
					if(fh_type == 'right' && $fh.find('.mini-home').length > 0) {
						$fh.find('.mini-home').closest('.navbar-collapse').attr('style','display: inline-block !important');
					} else if(checkFixTypeMenu && fh_type == 'sidebar') {
						$fh.find('#fixed-menu').css('overflow','');
					}
				} else {
					if($('#page-loading-css').length == 0) {
						setTimeout(function() {
							$.fheader.position();
						},400);
					}
				}
							
			},400);
		},
		position: function() {
			if(!$('header.navbar').hasClass('navbar-fheader')) {
	            var parentDocument = $(window.parent.document),
	                $detail_modal = parentDocument.find('.product-detail-modal');
	            if($detail_modal.length) {
	            	($('.openBandBanner').length) ? 
	            		$('.dsgn-body').css('padding-top','120px') :
	            		$('.dsgn-body').css('padding-top','0px');
	            }
				return false;
			}

			// console.log('fheader position');
			// if(!$('header.navbar').hasClass('navbar-fheader')) return false;

			var checkEllist = (typeof isElviewPage != 'undefined' && isElviewPage === true) ? true : false,
				$fh = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				fh_type = $fh.attr('data-fh-type'),
				fh_postion = (typeof $fh.attr('data-position') != 'undefined') ? $fh.attr('data-position') : '',
				fh_transparent = ($fh.hasClass('transparent')) ? true : false,
				checkFixTypeMenu = (typeof $fh.attr('data-fixtype') != 'undefined' && $fh.attr('data-fixtype')) ? true : false;
				
			var body_width = (PAGE_MODE == 'c') ? $('body').width() : window.innerWidth;
			
			if(body_width <= 768) {
				if(fh_type == 'right' && $fh.find('.mini-home').length > 0) { 
					$fh.find('.mini-home').parent().removeAttr('style'); 
				}
				$fh.find('.psearch-overlay.open').removeClass('open');
				$('.cl-popupBanner').removeClass('zindex20');
				if(!checkFixTypeMenu) $fh.find('#fixed-menu-sub').closest('.fh-container').eq(0).hide();
			} else {
				if(fh_type == 'right' && $fh.find('.mini-home').length > 0) {
					if(!checkFixTypeMenu) {
						$fh.find('.mini-home').closest('.navbar-collapse').attr('style','display: inline-block !important');
					} 
				}

				if(fh_type == 'right' && !$fh.hasClass('sidebar') && $fh.find(' > .container[data-fh-align]').length > 0) {
					$.fheader.refreshFixedSub();
				}

				$('#mobile-nav .psearch-overlay.open').removeClass('open');
				$('.cl-popupBanner').removeClass('zindex20');
				if($('.dsgn-body').hasClass('mobile-nav-active')) $fh.find('.navbar-toggle').click();
			}

			if(fh_transparent) {
				if($('.cl-bandBanner').length == 0) {
					$('.dsgn-body').css('padding-top','0px');
					if(PAGE_MODE == 'c') $('.el-menu_ctrl .config-element').removeAttr('style');
				}
			} else if(fh_postion != 'relative') {
				if(fh_type == 'sidebar' && body_width > 768) {
					var pt = '0px';
					if(typeof getComputedStyle(document.querySelector('.dsgn-body')).getPropertyValue('--bandBanner-height-pc') != 'undefined') {
						pt = getComputedStyle(document.querySelector('.dsgn-body')).getPropertyValue('--bandBanner-height-pc');
					}
					$('.dsgn-body').css('padding-top',pt);
					return false;
				}
			}

			if(PAGE_MODE == 'c') {
				if($('.dsgn-body').get(0).scrollHeight  > $('.dsgn-body').innerHeight()) {
					var scrollbar_gap = window.innerWidth - $('.dsgn-body').get(0).clientWidth;
					$('.navbar-fixed-top, .navbar-fixed-bottom').css('right',scrollbar_gap);
				} else {
	                $('.navbar-fixed-top, .navbar-fixed-bottom').removeAttr('style');
				}
			}
			if(checkEllist) {
				if(checkFixTypeMenu) setFixedMenuCss(true);
			} else {
				var delay_time = (PAGE_MODE == 'c') ? 800 : 0;
				setTimeout(function() {
					var header_h = (fh_transparent || ($fh.hasClass('sidebar') && $('.dsgn-body').width() > 767) ) ? 0 : $fh.outerHeight(),
						band_h = $.siteBanner.getBandHeight();
					if($fh.find('.cl-menu-option.open:not(.single:not(.nfullDrop))').length > 0 && $fh.find('.cl-menu-option.open').is('[data-moption="nfull"], [data-moption="ntoggle"]')) {
						var hide_h = $fh.find('.moption-container').outerHeight();
						header_h -= hide_h;
					}
					$('.dsgn-body').css('padding-top', (band_h + header_h)+'px'); 
					if($('.el_0.element').is('[data-type="gallery"][data-type2="premium"][data-feature*=fixedscroll]')) gjs01SetFixedscroll($('.el_0.element'));
				}, delay_time);

				if(PAGE_MODE == 'c') {
					setTimeout(function() {
						var btn_top = $('header.navbar').outerHeight();
						$('.addElementButton.addel-menu').css('top',btn_top + 'px');
					}, delay_time+200);
				}
			}
		}
	}

	$.moption = {
		getList: function(menu_selector) {
			var checkEditList = (menu_selector.match(/^\.elmenu-color-edit/gi)) ? true : false,
				moption_list = [];

			$(menu_selector).find('#tpl-menu > li').each(function() {
				var tmp_child = [],
					tmp_main = $(this);
				if(tmp_main.hasClass('dropdown')) {
					tmp_main.find('.dropdown-menu > li').each(function() {
						var tmp_sub = $(this);
						tmp_child.push({
							'idx0': moption_list.length,
							'idx1': tmp_child.length,
							'name': tmp_sub.find(' > a').eq(0).text().trim(),
							'active': (tmp_sub.hasClass('active')) ? 'active' : '',
							'href': (checkEditList) ? 'javascript:;' : '',
							'target': '',
							'isbookmark': '',
							'isflink': '',
							'depth': 1,
							'children': tmp_child, 
						});
					});
				}
			
				moption_list.push({
					'idx0': moption_list.length,
					'name': tmp_main.find(' > a').eq(0).text().trim(),
					'active': (tmp_main.hasClass('active')) ? 'active' : '',
					'href': (checkEditList) ? 'javascript:;' : '',
					'target': '',
					'isbookmark': '',
					'isflink': '',
					'depth': 0,
					'children': tmp_child, 
				});
			});
			return moption_list;
		},
		init: function(mode) {
			// console.log('fh moption(mode: '+mode+')');

			var checkElviewer = '';
			if(window.parent && window.parent != this && $('.elviewhtml').length > 0) {
				checkElviewer = $('#el-list-image .elgrid.active', window.parent.document).find('.blockname-str').text().trim();
			}

			var s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				s_service = (PAGE_MODE == 'c') ? SERVICE : property.SERVICE,
				checkGabia = (s_service.indexOf('gabia') > -1) ? true : false,
				checkEllist = (typeof mode != 'undefined' && mode == 'ellist') ? true : false,
				checkMenuEdit = (typeof mode != 'undefined' && mode == 'menuedit') ? true : false,
				checkTemplate = (typeof property != 'undefined' && property.TEMPLATE && property.TEMPLATE=='1') ? true : false,
				sid = (PAGE_MODE == 'c') ? ((checkEllist) ? checkElviewer.replace(/menu-/gi,'') : SID) : property.SID,
				pc_seletor = (checkEllist) ? '.elviewhtml header.navbar' : ((checkMenuEdit) ? '.elmenu-color-edit header.navbar' : '.el-menu header.navbar'),
				$pc_nav = $(pc_seletor),
				$mobile_nav = $pc_nav.find('#tpl-menu').closest('.navbar-menu-'+sid).clone(),
				checkFixTypeMenu = (typeof $pc_nav.attr('data-fixtype') != 'undefined' && $pc_nav.attr('data-fixtype')) ? true : false;

			var moption = $pc_nav.find('.cl-menu-option').attr('data-moption'),
				checkDrawClmoption = ($.inArray(moption, ['nfull','ntoggle']) > -1) ? true : false;
			if(checkDrawClmoption) {
				var moption_table = '<ul class="cl-'+moption+' cl-moption"></ul>',
					moption_col = '<li class="cl-moption-col"></li>',
					moption_row = '<div class="cl-moption-row"></div>';

				if($pc_nav.find('.container.moption-container').length > 0) $pc_nav.find('.container.moption-container').html('<div class="moption-row"></div>');
				else $pc_nav.find('.container:not(:is(.fh-container, .moption-container))').after('<div class="container moption-container"><div class="moption-row"></div></div>');
				var $moptionContainer = $pc_nav.find('.container.moption-container'),
					$moptionRow = $moptionContainer.find('.moption-row');
				if($pc_nav.find('.container:not(:is(.fh-container, .moption-container))').hasClass('full-width')) $moptionContainer.addClass('full-width');

				$moptionRow.append(moption_table);
				var menu_option = (PAGE_MODE == 'c') ? MENUOPTION : property.MENUOPTION,
					$moptionTable = $moptionContainer.find('.cl-moption');

				if(checkMenuEdit) menu_option = $.moption.getList(pc_seletor);
				$.each(menu_option, function(idx0, obj0) {
					var $tmpCol = $(moption_col),
						tmp_row = moption_row.replace(/cl\-moption\-row\"\>\</g,'cl-moption-row '+obj0.active+'"><a href="' + obj0.href + '" ' + obj0.target + obj0.isbookmark + obj0.isflink + '>' + obj0.name + '</a><');
					if(obj0.children.length > 0) {
						$.each(obj0.children, function(idx1, obj1) {
							tmp_row += moption_row.replace(/cl\-moption\-row\"\>\</g,'cl-moption-row '+obj1.active+'" data-parent="'+obj1.idx0+'"><a href="' + obj1.href + '" ' + obj1.target + obj1.isbookmark + obj1.isflink + '>' + obj1.name + '</a><');
						});
					}

					$tmpCol.append(tmp_row);
					if($tmpCol.find('.cl-moption-row').length > 1) $tmpCol.addClass('has-sub');
					if(menu_option.length-1 == idx0) $tmpCol.addClass('last-sub');
					$moptionTable.append($tmpCol);
				});
			}

			switch(moption) {
				case 'nfull':

					var hasSubMenu = (PAGE_MODE == 'c') ? MENUCHECK.sub : property.MENUCHECK.sub;
					if(hasSubMenu) $pc_nav.find('.cl-menu-option').removeClass('single');
					else $pc_nav.find('.cl-menu-option').addClass('single');

					$pc_nav.find('#tpl-menu > li, .moption-container').off('mouseover mouseleave').on({
						mouseover: function(e) {
							if($(this).find('.cl-moption').is(':empty') || (PAGE_MODE == 'c' && $('#el-blockConfig').hasClass('open') && selectEL != 'el-menu')) return false;

							$(this).closest('header').find('.cl-menu-option').addClass('open');
						},
						mouseleave: function(e) {
							if($(this).find('.cl-moption').is(':empty')) return false;

							if(	$(this).closest('header').find('.cl-menu-option').hasClass('fixed') ||
								$(this).closest('header').find('.cl-menu-option').hasClass('nfullDrop') ||
								$('#el-blockConfig').is('.open')
							) {
								return false;
							}

							$(this).closest('header').find('.cl-menu-option').removeClass('open');
							if($(this).closest('header').find('.cl-menu-option').is('[data-mwidth="all"]')) {
								$.fheader.position();
							}
						}
					});
					break;

				case 'ntoggle':
					break;

				default:
					break;
			}

			$pc_nav.find('.cl-drop-fixed-menu ~ .navbar-toggle, .cl-menu-option ~ .container .navbar-toggle').off('click').on({
				click: function() {
					if($('body').width() > 767) $.moption.setRootBlock($pc_nav,'--block-height',true);
				},
			});


			$pc_nav.ready(function() {
				setTimeout(function() {
					if($pc_nav.find('.cl-menu-option[data-moption="nfull"]').length > 0) $.moption.checkNfullDrop(pc_seletor);
					else if($pc_nav.find('.cl-menu-option[data-moption="ntoggle"]').length > 0 && $pc_nav.is('[data-fh-type="right"]')) $.moption.drawClDropFixedmenu($pc_nav);
				}, 300);
			});

            $(window).resize(function() {
                if(this.moptionResizeTO) {
                    clearTimeout(this.moptionResizeTO);
                }
                this.moptionResizeTO = setTimeout(function() {
                    $(this).trigger('resizeMoptionEnd');
                }, 300);
            });
            $(window).on('resizeMoptionEnd', function() {
                $.fheader.position();
                if($pc_nav.find('.cl-menu-option[data-moption="nfull"]').length > 0) $.moption.checkNfullDrop(pc_seletor);
				else if($pc_nav.find('.cl-menu-option[data-moption="ntoggle"]').length > 0 && $pc_nav.is('[data-fh-type="right"]')) $.moption.drawClDropFixedmenu($pc_nav);

				if($pc_nav.find('.cl-menu-option').length > 0  && $('body').width() < 767) {
					$pc_nav.find('.cl-menu-option').removeClass('open');
				} else {
			        if ($('header #tpl-menu').children().length) $('header.navbar-fheader .navbar-toggle').css({ 'visibility': 'visible' });
			        else $('header.navbar-fheader .navbar-toggle').css({ 'visibility': 'hidden' });
			        $('.dsgn-body').removeClass('mobile-nav-active');
			        $('#mobile-body-overly').removeClass('in');
			        $('#mobile-nav .siteLANG.cl-fixbtn').hide();
				}
            });
		},
		setRootBlock(thisBlock,root_key,usedtoggle) {
			if(	typeof thisBlock != 'undefined' && thisBlock.length > 0 && thisBlock.find('.cl-menu-option').length > 0) {
				if(root_key == '--block-height') {
					var h = thisBlock.outerHeight();
					document.querySelector('header').style.setProperty('--block-height', h + 'px', null);

					if($('#el-blockConfig').hasClass('open')) {
						if(!thisBlock.find('.cl-menu-option').hasClass('open')) thisBlock.find('.cl-menu-option').toggleClass('open');
					} else if(usedtoggle) {
						thisBlock.find('.cl-menu-option').toggleClass('open');
					} else {
						thisBlock.find('.cl-menu-option').removeClass('open');
					}

					if(thisBlock.find('.cl-menu-option').is('.nfullDrop[data-moption="nfull"]')) {
						var h_p_b = thisBlock.css('padding-bottom').replace(/[^0-9]/g,'') * 1;
						document.querySelector('header').style.setProperty('--cl-nfull-top', h_p_b + 'px', null);
					}
				}
			}

		},
		drawClDropFixedmenu: function(pcNav) {
			if($('header #fixed-menu').length > 0) {
				var drop_fixed_menu = '<ul class="cl-drop-fixed-menu">' + $('header #fixed-menu').html() + '</ul>';
				if(pcNav.find('.cl-drop-fixed-menu').length > 0) pcNav.find('.cl-drop-fixed-menu').replaceWith(drop_fixed_menu);
				else if(pcNav.find('.navbar-header .micon').length > 0) pcNav.find('.navbar-header .micon').before(drop_fixed_menu);
				else pcNav.find('.navbar-header .navbar-toggle').before(drop_fixed_menu);
			}
		},
		checkNfullDrop: function(nav_selector) {
			var $pc_nav = $(nav_selector),
				isellist = (nav_selector.match(/^\.elviewhtml/gi)) ? true : false,
				iselmenuedit = (nav_selector.match(/^\.elmenu-color-edit/gi)) ? true : false,
				isparent = (typeof window.parent != 'undefined' && window.parent != this) ? true : false;

			if($pc_nav.find('.cl-menu-option[data-moption="nfull"]').length > 0) {

				var checkBlockConfig = $('#el-blockConfig').hasClass('open');
				if(checkBlockConfig || isparent) {
					$pc_nav.find('.cl-drop-fixed-menu').remove();
					$pc_nav.find('.cl-menu-option').removeAttr('data-nfull-drop').removeClass('nfullDrop');
				}

				var delay = (checkBlockConfig) ? 500 : 0;
				setTimeout(function() {
					var checkMfullDrop = $pc_nav.find('.cl-menu-option').is('[data-nfull-drop]'),
						// checkMenuOrg = ($pc_nav.find('.cl-menu-option').is('[data-mwidth]')) ? false : true,
						// tpl_menu_selector = (checkMenuOrg) ? nav_selector+' #tpl-menu' : nav_selector+' .cl-moption',
						tpl_menu_selector = nav_selector + ' #tpl-menu',
						m_wrap = $(tpl_menu_selector).first().width(),
						m_w = 0,
						mdrop_onoff = (checkMfullDrop) ? $pc_nav.find('.cl-menu-option').hasClass('nfullDrop') : false;

					var fixed_menu_w = $pc_nav.find('#fixed-menu').outerWidth();
					if($pc_nav.is('[data-fh-type="right"][data-fixtextalign="center"]')) {
						$pc_nav.find(nav_selector+' #tpl-menu').css('padding-left',fixed_menu_w + 'px');
					} else {
						document.querySelector(nav_selector+' #tpl-menu').style.removeProperty('padding-left');
					}

					if(checkMfullDrop) {
						var m_container = $pc_nav.find('.container:not(.moption-container, .fh-container)').eq(0).width(),
							m_drop = $pc_nav.find('.cl-menu-option').attr('data-nfull-drop');
						if(Number(m_drop) > 0 && m_container > Number(m_drop)) {
							$pc_nav.find('.cl-menu-option[data-moption="nfull"]').removeClass('nfullDrop');
						} else {
							$pc_nav.find('.cl-menu-option[data-moption="nfull"]').addClass('nfullDrop');
							setFixedMenuCss(isellist);
						}
					} else {
						$(tpl_menu_selector).first().children().each(function() {
							m_w += $(this).outerWidth();
						});

						var m_top = $(tpl_menu_selector).first().children().first().offset().top,
							m_last = $(tpl_menu_selector).first().children().last().offset().top;
						if(m_top != m_last || m_w > m_wrap) {
							var mcontainer = $pc_nav.find('.container:not(.moption-container, .fh-container)').eq(0).width(),
								mdrop = mcontainer + (m_w - m_wrap);

							$pc_nav.find('.cl-menu-option[data-moption="nfull"]').attr('data-nfull-drop',mdrop).addClass('nfullDrop');
							setFixedMenuCss(isellist);
						} else {
							$pc_nav.find('.cl-menu-option[data-moption="nfull"]').removeAttr('data-nfull-drop');
						}
					}

					if($pc_nav.is('[data-fh-type="right"]') && $pc_nav.find('.cl-menu-option').hasClass('nfullDrop')) {
						$.moption.drawClDropFixedmenu($pc_nav);
					}

					// if(iselmenuedit) $pc_nav.find('.cl-menu-option[data-moption="nfull"]').removeClass('nfullDrop');
					if($('body').width() > 767) $.moption.setRootBlock($pc_nav,'--block-height',false);
				}, delay);
			} else {
				if($('body').width() > 767) $.moption.setRootBlock($pc_nav,'--block-height',false);
			}

		},
	}

	$.psearch = {
		init: function() {
			// console.log('psearch init');
			if(!$('.el-menu header.navbar').hasClass('navbar-fheader')) return false;

			// psearch - 쇼핑몰 요금제 사용여부 체크 후 on/off
            var s_validplan = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN,
                s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
                checkSM = (s_validplan && s_validtype == 'SM') ? true : false;

            if(checkSM) $.psearch.set('on');
			else $.psearch.set('off');
		},
		set: function(onoff) {
			// console.log('psearch set');
			if(!$('.el-menu header.navbar').hasClass('navbar-fheader')) return false;

			if(onoff.match(/on/gi)) $.psearch.makeSiteSEARCH();
			else {
				$('#fixed-menu, #fixed-menu-sub').find('.siteSEARCH').remove();
			}
		},
		makeSiteSEARCH: function() {
			// console.log('psearch makeSiteSearch');
			// 우선 PC, MOBILE 구조 동일하게 적용함 => (menufixbtn적용 전 메뉴블럭)
			
			/* Shopping Only KO Site */
			// var slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
			// if(typeof slang != 'undefined' && typeof slang.select_code != 'undefined' && slang.select_code != 'ko') {
			// 	$('#fixed-menu, #fixed-menu-sub').find('.siteSEARCH').remove();
			// 	return false;
			// }

			var pc_nav = $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub'),
				mobile_nav = $('#mobile-nav #fixed-menu'),
				checkFixTypeMenu = (typeof $('.el-menu header.navbar').attr('data-fixtype') != 'undefined' && $('.el-menu header.navbar').attr('data-fixtype')) ? true : false,
				checkLux = (PAGE_MODE == 'c') ? LUX : property.LUX,
				search_icon = (checkFixTypeMenu) ? clSVG('fixbtn_search4',28,28) : '<i class="cl-icon cl_icon_magnifier" aria-hidden="true"></i>';
				
			var content = (checkFixTypeMenu) ? '\
				<div class="psearch-overlay">\
                    <span class="psearch-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Product Search"></span></span>\
                    <div class="psearch-body">\
                        <span class="psearch-wrap">\
                            <a href="#" class="psearch-icon"><i class="cl-icon cl_icon_magnifier"></i></a>\
                            <input class="psearch-input" type="text" name="" placeholder="' + $.lang[LANG]['fheader.psearch'] + '">\
                        </span>\
                    </div>\
                </div>\
			' : '\
				<li class="siteSEARCH">\
                    <a href="javascript:;" class="psearch-btn"><i class="cl-icon cl_icon_magnifier" aria-hidden="true"></i></a>\
                    <div class="psearch-overlay">\
                        <span class="psearch-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Product Search"></span></span>\
                        <div class="psearch-body">\
                            <span class="psearch-wrap">\
                                <a href="#" class="psearch-icon"><i class="cl-icon cl_icon_magnifier"></i></a>\
                                <input class="psearch-input" type="text" name="" placeholder="' + $.lang[LANG]['fheader.psearch'] + '">\
                            </span>\
                        </div>\
                    </div>\
                </li>\
			', 
				mobile_content = '\
				<li class="siteSEARCH">\
					<a href="javascript:;" class="psearch-btn">'+search_icon+'</a>\
					<div class="psearch-overlay">\
						<span class="psearch-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Product Search"></span></span>\
						<div class="psearch-body">\
							<span class="psearch-wrap">\
								<a href="#" class="psearch-icon"><i class="cl-icon cl_icon_magnifier"></i></a>\
								<input class="psearch-input" type="text" name="" placeholder="' + $.lang[LANG]['fheader.psearch'] + '">\
							</span>\
						</div>\
					</div>\
				</li>\
			';
			
			if(pc_nav.find('.siteSEARCH').length > 0) {
				if(checkFixTypeMenu){
					pc_nav.find('.siteSEARCH').find('a').addClass('psearch-btn');
					pc_nav.find('.siteSEARCH').append(content);
				} else pc_nav.find('.siteSEARCH').replaceWith(content);
			} else pc_nav.prepend(content);
			
			if(mobile_nav.find('.siteSEARCH').length>0) {
				if(checkFixTypeMenu) {
					var regExp = new RegExp(/cl\-fixbtn|cl\-visible/, "gi"),
						addClass = (mobile_nav.find('.siteSEARCH').attr('class').match(regExp)!==null) ? mobile_nav.find('.siteSEARCH').attr('class').match(regExp).join(" ") : '',
						$site_search = mobile_nav.find('.siteSEARCH');

					mobile_nav.find('.siteSEARCH').find('a').addClass('psearch-btn');
					mobile_nav.find('.siteSEARCH').replaceWith(mobile_content);
					mobile_nav.find('.siteSEARCH').addClass(addClass);

					if(pc_nav.find('.siteSEARCH').css('display')=='none') mobile_nav.find('.siteSEARCH').hide();
				} else mobile_nav.find('.siteSEARCH').replaceWith(mobile_content);
			} else mobile_nav.prepend(mobile_content);
			
			// #fixed-menu-sub psearch not working 
			// pc_nav.each(function() {
			// 	if($(this).attr('id') == 'fixed-menu-sub') {
			// 		$(this).find('.psearch-overlay').remove();
			// 	}
			// });
		},
		view: function() {
			// console.log('psearch view');
			// var deferred = $.Deferred();

			var check_p = (property.PAGE == 'psearch') ? true : false;
			if(check_p) {
				var p_stx = (typeof property.PARENT['psearch_stx'] != 'undefined' && property.PARENT['psearch_stx']) ? property.PARENT['psearch_stx'] : '',
					p_total = (typeof property.PARENT['psearch_total'] != 'undefined' && property.PARENT['psearch_total']) ? property.PARENT['psearch_total'] : 0,
					p_list = property.PARENT['psearch_list'],
					p_page_num = property.PARENT['psearch_num'],
					p_view = property.PARENT['psearch_view'],
					p_selector = (property.LUX) ? 'psearch-block' : 'psearch-view';

				if(property.LUX) {
					//lux search view
					var str = property.PARENT['psearch_eltag'];
					if($('style#psearchblockcss').length == 0) {
						 $('body').append('<link rel="stylesheet" type="text/css" id="psearchblockcss" href="/css/block/psearch_block.css">');
					}
					if($('script#psearchblockjs').length == 0) {
						var psearchJS = document.createElement('script');
						psearchJS.setAttribute('src', '/js/block/psearch_block.js');
						psearchJS.setAttribute('id', 'psearchblockjs');
						document.body.appendChild(psearchJS);

						psearchJS.onload = function() {
							$('body').append('<input type="hidden" id="psearchblockjs" data-src="/js/block/psearch_block.js">');
							$('.'+p_selector).fadeIn().removeAttr('style');

							if($('.psearch-block .pfilter-fbox .fcol-c-ul:not([data-key="psearch"]) > li.active').length > 0) {
								if($('.psearch-block .pfilter-fbox .fcol-c-ul[data-key="brand"] > li.active').length > 0) {
									$('.psearch-block .pfilter-fbox .fcol-c-ul[data-key="brand"]').closest('.frow').addClass('open');
								}
								var cancel_svg = clSVG('close',10,10,true,'pick-cancel-btn');
								$('.psearch-block .pfilter-fbox .fcol-c-ul:not([data-key="psearch"]) > li.active').each(function() {
									var isOnly = $(this).closest('ul').is('[data-only="true"]'),
										pfilter_key = $(this).closest('ul').attr('data-key'),
										pfilter_name = $(this).text().trim(),
										pfilter_val = $(this).attr('data-val'),
										pfilter_input = (isOnly) ? pfilter_key : pfilter_key+'[]';
									if(isOnly) $('#psearchForm .psearch-pick.'+pfilter_key+'').remove();
									$('#psearchForm').append('<input type="hidden" class="psearch-pick '+pfilter_key+'" name="'+pfilter_input+'"  value="'+pfilter_val+'" />');
									$('.psearch-block .pfilter-fbox .frow.last .fcol-c-ul[data-key="psearch"]').append('<li data-key="'+pfilter_key+'" data-val="'+pfilter_val+'"><div class="fcol-c-label"><span class="fcol-c-name">'+pfilter_name+'</span>'+cancel_svg+'</div></li>');
								});
								$('.psearch-block .pfilter-fbox .frow.last').removeClass('hide');
							} else {
								$('.psearch-block .pfilter-fbox .frow.last').addClass('hide');
							}
						}
					}

				} else {
					//shopping search view
					var wrap = ($('header.navbar .container').hasClass('full-width')) ? 'full-width' : '',
						str = '\
					<div class="psearch-view" data-sid="'+property.SID+'" style="height:' + ($(document).height() * 0.2) + 'px; display: none;">\
						<input type="hidden" id="psearch-stx" value="' + p_stx + '" />\
						<input type="hidden" id="psearch-total" value="' + p_total + '" />\
						<div class="container ' + wrap + '">\
							<div class="psearch-body">\
								<div class="row">\
									<div class="col-sm-offset-2 col-md-offset-4 col-xs-12 col-sm-8 col-md-4">\
										<span class="psearch-wrap">\
											<a href="#" class="psearch-icon"><i class="cl-icon cl_icon_magnifier"></i></a>\
											<input class="psearch-input" type="text" name="" placeholder="' + $.lang[LANG]['fheader.psearch'] + '" value="' + p_stx + '">\
										</span>\
									</div>\
								</div>\
					';

					if(p_total == 0) str += '<div class="row text-center pitem-empty">' + $.lang[LANG]['fheader.psearch.pitem-empty'] + '</div>';
					else {
						// var p_settings = (typeof property.SETTINGS['psearch'] != 'undefined') ? $.parseJSON(property.SETTINGS['psearch']) : {};
						str += '<div class="row multi-columns-row" data-loop="true">\
						';
						for(var key in p_list) {
							str += '\
								' + $.psearch.pItem(p_list[key]) + '\
							';
						}
						str += '\
								</div>';
					}

					str += '\
					\
								<nav class="text-center clear">\
									<ul class="pagination pagination-sm psearch-pagination">\
										<li><a href="#" aria-label="Previous"><span aria-hidden="true"><i class="fa fa-angle-left"></i></span></a></li>\
										<li class="active"><a href="#">1</a></li>\
										<li><a href="#">2</a></li>\
										<li><a href="#">3</a></li>\
										<li><a href="#">4</a></li>\
										<li><a href="#">5</a></li>\
										<li><a href="#" aria-label="Next"><span aria-hidden="true"><i class="fa fa-angle-right"></i></span></a></li>\
									</ul>\
								</nav>\
					\
							</div>\
						</div>\
					</div>\
					';

					$('.psearchcss').remove();
					var p_color = $('.dsgn-body').css('color'),
						p_line_color = $('.dsgn-body').css('color'),
						p_size = $('.dsgn-body').css('font-size')
						p_css = '\
						.dsgn-body > .psearch-view[data-sid="'+property.SID+'"] .psearch-wrap { border-bottom-color: ' + p_line_color + '; }\
						.dsgn-body > .psearch-view[data-sid="'+property.SID+'"]  .psearch-input { color: ' + p_color + '; }\
						.dsgn-body > .psearch-view[data-sid="'+property.SID+'"] .psearch-pagination > li > a { color: ' + p_color + '; }\
					';
					$('#dsgn-body').after('<style class="psearchcss">' + p_css + '</style>');
				}


				$('.header.el-menu').after(str);
				var $pEL = $('.'+p_selector);
				changeBrokenImages($pEL);
				if(p_selector == 'psearch-view') $pEL.fadeIn().removeAttr('style');

				$pagination = $pEL.find('.psearch-pagination');
				$.psearch.setPagination($pagination,p_stx,p_total,p_page_num,p_view);

				if(p_total <= p_view) $pagination.addClass('hidden');
				else $pagination.removeClass('hidden');

				if(p_selector == 'psearch-view') {
					if(PAGE_MODE != 'c') $.psearch.showSiteProjectSEARCH(true);
					if(PAGE_MODE == 's' && typeof callbackEvtProductSearch == 'function') callbackEvtProductSearch(p_stx);
				}

			}


			// deferred.resolve();
		 //    return deferred.promise();
		},
		pItemEmpty: function() {
			// console.log('psearch pItemEmpty');
			var str = '\
				<div class="pitem sample-item">\
					<div class="col-xs-3 col-sm-3 col-md-3 no-padding">\
						<div class="center-block"><img src="//storage.googleapis.com/i.addblock.net/blitem_empty_img.png" alt="" class="img-responsive"/></div>\
					</div>\
				</div>\
			';
			return str;
		},
		pItem: function(o) {
			// console.log('psearch pItem');
			var img_path = (typeof o.settings.storage != 'undefined' && o.settings.storage) ? o.settings.storage : property.RPATH,
				img_original = (typeof o.settings.storage != 'undefined' && o.settings.storage) ? img_path + '1920/' : img_path,
				img_src = getServeImage(o.image,600,img_path),
				src_s0 = getServeImage(o.image,'0',img_path);

			var glink = (typeof o.settings.glink != 'undefined' && o.settings.glink) ? o.settings.glink : '',
				glink_target = (typeof o.settings.glink_target != 'undefined' && o.settings.glink_target) ? o.settings.glink_target : '';

			if(glink) {
				if(glink.match(/^\@/g) !== null) {															// link-type: link-bookmark ==> a[attr-bookmark]
					var bookmark_seq = glink.replace(/^\@/g,'');
					if(typeof property.SETTINGS.blockBookmarkList == 'undefined' || typeof property.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
						glink = '';
						glink_target = '';
					}
				} else if(glink.match(/^flink\@[0-9]/gi) !== null) {										// link-type: link-file     ==> a[attr-flink]
					glink_target = '';
				} else if($.inArray(glink.replace(/^\//g,'').replace(/ /g,'-'),property.MENULIST) > -1) {	// link-type: link-menu     ==> a[data-user-link]
				} else {																					// link-type: link-out      ==> a[attr-link]
					if(checkBase64Encode(glink)) glink = Base64.decode(glink);
				}
			}

			var pitem_src = '',
				pitem_option = '';

			if(glink) {
				pitem_src = makeLinkUrl(glink, property.ONE, property.VIEW);

				if(glink.match(/^\@/g) !== null) {
					pitem_option = 'attr-bookmark="' + glink.replace(/^\@/g,'') + '"';
				} else if(glink.match(/^flink\@[0-9]/g) !== null) {
					pitem_option = 'attr-flink="' + glink.replace(/^flink\@/g,'') + '"';
				} else if(property.MENULIST.includes(glink.replace(/ /g,'-'))) {
					pitem_option = 'data-user-link="' + pitem_src + '"';
				} else {
					var checkURL = /(http(s)?:\/\/)?\S+(\.[^(\n|\t|\s|\/))]+)+/gi;
					if(checkURL.test(glink)) pitem_option = 'attr-link="' + glink + '"';
					else pitem_src = 'javascript:;';
				}
			} else {
				if (o.p_mode == 'gallery') {
					if(property.MENULIST.indexOf(o.page) > -1 || property.ONE) {
						var pitem_cookie = (o.p_cookie == 'gallery') ? 'data-psearch-pid="' + o.pid + '"' : 'data-psearch-seq="' + o.id + '"';
						pitem_option = 'data-user-link="' + o.page + '" '+pitem_cookie;
						pitem_src = makeLinkUrl(o.page, property.ONE, property.VIEW);
					} else {
						pitem_src = 'javascript:;';
					}
				} else {
					pitem_src = ((property.URL=='/') ? '' : property.URL) + '/' + o.page + '/view/' + o.id;
				}
			}
			var str = '\
					<div class="col-xs-6 col-sm-4 col-md-3 no-padding pitem" data-index="' + o.num + '" data-pid="' + o.pid + '" data-gid="' + o.id + '">\
						<a href="'+pitem_src+'" '+ pitem_option + '>\
							<img src="' + o.thumb + '" alt="" class="img-responsive" />\
							<div class="info-wrap">\
								<h5>' + o.title + '</h5>\
								<p>' + o.cont + '</p>\
				';
				if(o.p_mode == 'shopping') {
					if(o.price) {
						str += '\
								<p class="price-box"><span class="figure-krw">￦</span> ' + o.price + '</p>\
								<span></span>\
						';
					}

					if(o.review_onoff && o.review_cnt > 0) {
						str += '\
								<ul class="review-box">\
									<li class="review-cnt">리뷰 <span class="sh-pcolor">' + o.review_cnt + '</span></li>\
									<li class="review-score">평점 <span class="sh-pcolor">' + o.review_score + '</span></li>\
								</ul>\
						';
					}

					var basket_class = (o.basket_off) ? 'cannotby hide' : '';
					str += '\
							<div class="basket-box ' + basket_class + '"><span class="basket-btn">장바구니 담기</span></div>\
					';
				}
				str += '\
							</div>\
						</a>\
					</div>\
			';
			return str;
		},
		setPagination: function($obj,stx,total,page_num,view) {
			// console.log('psearch setPagination');
			var checkLux = (PAGE_MODE == 'c') ? LUX : property.LUX;
			if(checkLux) stx += location.search;

			var p_url = (PAGE_MODE == 'r') ? '/render' : '',
				page_view = 5,
				total_page = Math.ceil(total/view),
				start_page = (page_num%page_view) ? page_num - (page_num%page_view) + 1 : page_num - (page_view-1), 
				end_page = start_page + (page_view-1);
			if(end_page > total_page) end_page = total_page;

			var prev_page = ((start_page-1) == 0) ? 1 : start_page-1,
				next_page = ((end_page+1) > total_page) ? end_page : end_page+1;

			$obj.find('li').addClass('psearch-page');

			var $first = $obj.children().first().clone(),
				$prev = $obj.children().first().clone(),
				$next = $obj.children().last().clone(),
				$last = $obj.children().last().clone();

			$obj.empty();
			$first.find('a').attr('href',p_url+'/psearch/num/1/stx/'+stx).find('i').removeClass('fa-angle-left').addClass('fa-angle-double-left');
			$prev.find('a').attr('href',p_url+'/psearch/num/'+prev_page+'/stx/'+stx);
			$next.find('a').attr('href',p_url+'/psearch/num/'+next_page+'/stx/'+stx);
			$last.find('a').attr('href',p_url+'/psearch/num/'+total_page+'/stx/'+stx).find('i').removeClass('fa-angle-right').addClass('fa-angle-double-right');

			$obj.append($prev).append($next);
			for(i=start_page; i<=end_page; i++) {
				var active = (i == page_num) ? 'active' : '';
				$obj.children().last().before($('<li class="psearch-page '+ active +'"><a href="'+p_url+'/psearch/num/'+i+'/stx/'+stx+'">' + i + '</a></li>'));
			}

			if(start_page == prev_page) $obj.children().eq(0).hide();
			if(end_page == next_page) $obj.children().last().hide();

			// if(start_page > page_view) $obj.prepend($first);
			// if(end_page < total_page) $obj.append($last);

		},
		showSiteProjectSEARCH: function(view_page) {
			// console.log('psearch showSiteProjectSEARCH');
			if(PAGE_MODE == 'c') return false;
			$('.cl-popupBanner.openPopupBanner').addClass('zindex20');

			var sid = property.SID,
				checkUsedMpcWeb = property.SETTINGS.vpMode_onoff;
			
			var active_nav = (window.innerWidth <= 768) ? $('#mobile-nav') : $('.el-menu header.navbar-fheader'),
				psearchWarp = active_nav.find('.psearch-overlay');

			if(view_page) psearchWarp = $('.psearch-view').find('.psearch-wrap');

			psearchWarp.find('input.psearch-input').live({
				focus: function() {
				},
				keydown: function(key) {
					if(key.keyCode == 13) psearchWarp.find('.psearch-icon').click();
				},
			});

			psearchWarp.find('.psearch-icon').live({
				click: function() {
					var psearch_wrap = $(this).closest('.psearch-body'),
						psearch_input = $(this).closest('.psearch-wrap').find('input.psearch-input'),
                        regExp = new RegExp('^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\?\@\! ]*$'),
						// regExp = /[@#$%*+|<>?:;`,{}\]\[/\'\"\\\']/gi,
						stx = psearch_input.val().trim(),
						error_str = '';

					if(stx.length == 0) error_str = '검색 내용을 입력하세요';
					else if(!regExp.test(stx)) error_str = $.lang[LANG]['siteum.regexp.check.name'];

					if(error_str.length > 0) {
						if(psearch_wrap.find('.error').length > 0) psearch_wrap.find('.error').html('<i class="cl-icon alert02"></i> ' + error_str);
						else psearch_input.closest('.psearch-wrap').after('<span class="error"><i class="cl-icon alert02"></i> ' + error_str + '</span>');
						
						psearch_input.focus();
						return;
					} else {
						psearch_wrap.find('.error').remove();
					}

					//check mpcWeb Mode
					if(checkUsedMpcWeb) {
						var viewportMode = property.SETTINGS.viewportMode,
							vpmode = (typeof $('.mobilepc_ch').attr('data-desktop-option') != 'undefined') ? $('.mobilepc_ch').attr('data-desktop-option') : viewportMode;
						$.cookie('desktop-option',vpmode, { path: '/' });
					}
					
					var url = (PAGE_MODE=='s') ? '' : '/render',
						href = url + '/psearch/num/1/stx/' + encodeURIComponent(stx);
					location.href = href;

				}
			});

		}
	}

	$.shopping = {
		init: function() {
			// console.log('shopping init');
			var checkEllist = (typeof isElviewPage != 'undefined' && isElviewPage === true) ? true : false,
				fheader_selec = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar');

			if(!fheader_selec.hasClass('navbar-fheader')) return false;

			var sid = (PAGE_MODE == 'c') ? SID : property.SID,				
				s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE;

			var scart = (s_validtype == 'SM') ? true : false;
			
			if(scart) $.shopping.set('on',checkEllist);
			else $.shopping.set('off',checkEllist);
		},
		set: function(onoff,checkEllist){
			// console.log('shopping set');
			var checkEllist = ( typeof checkEllist!='undefined' && checkEllist) ? checkEllist : false;
			fheader_selec = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar');
			if(!fheader_selec.hasClass('navbar-fheader')) return false;

			if(onoff.match(/on/gi)) $.shopping.makeSiteFixedCART();
			else {
				$('#fixed-menu, #fixed-menu-sub').find('.siteCART').remove();
				$('#tpl-menu').find('.siteCART').remove();
				$('div.siteCART.micon').remove();
			}
		},
		makeSiteFixedCART: function() {
			// console.log('shopping makeSiteFixedCART');
			var checkEllist = (typeof isElviewPage != 'undefined' && isElviewPage === true) ? true : false,
				pc_nav = (checkEllist) ? $('.elviewhtml header.navbar #fixed-menu, .elviewhtml header.navbar #fixed-menu-sub') : $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub'),
				mobile_nav = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				checkfixtype_nav = (checkEllist) ? $('.elviewhtml header.navbar') : $('.el-menu header.navbar'),
				checkFixTypeMenu = (typeof checkfixtype_nav.attr('data-fixtype') != 'undefined' && checkfixtype_nav.attr('data-fixtype')) ? true : false;

			var sid = (PAGE_MODE == 'c') ? SID : property.SID,
				cart_url = (PAGE_MODE == 'c' || PAGE_MODE == 'r') ? 'javascript:;' : '/_cart',
				content = '\
				<li class="siteCART">\
					<a href="' + cart_url + '"><i class="cl-icon cl_icon_cart" aria-hidden="true"></i></a>\
				</li>\
			',
				mobile_content = '\
				<div class="siteCART micon">\
					<a href="' + cart_url + '"><i class="cl-icon cl_icon_cart" aria-hidden="true"></i></a>\
				</div>\
			';

			/* Shopping Only KO Site */
			// var slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
			// if(typeof slang != 'undefined' && typeof slang.select_code != 'undefined' && slang.select_code != 'ko') {
			// 	$('#fixed-menu, #fixed-menu-sub').find('.siteCART').remove();
			// 	$('#tpl-menu').find('.siteCART').remove();
			// 	$('div.siteCART.micon').remove();
			// 	return false;
			// }

			if(pc_nav.find('.siteCART').length > 0) {
				if(checkFixTypeMenu) pc_nav.find('.siteCART').find('a').attr('href',cart_url);
				else pc_nav.find('.siteCART').replaceWith(content);
			} else pc_nav.append(content);

			if(mobile_nav.find('div.siteCART.micon').length>0) {
				if(checkFixTypeMenu) mobile_nav.find('div.siteCART.micon').find('a').attr('href',cart_url);
				else mobile_nav.find('div.siteCART.micon').replaceWith(mobile_content);
			} else {
				mobile_nav.find('.navbar-toggle').before(mobile_content);
			}

			if(pc_nav.find('.siteCART').css('display')=='none') mobile_nav.find('.siteCART.micon').hide();
			
			var fixed_a_color = (checkFixTypeMenu) ? '' : $('.el-menu .navbar-toggle .icon-bar').css('background-color');
			//var mobile_color = $('#mobile-nav').find('.cl-fixbtn.cl-visible').find('svg').css('fill');
			if(checkEllist && typeof PAGE_MODE!='undefined' && PAGE_MODE=='c') {
				fixed_a_color = mobile_nav.find('.navbar-toggle .icon-bar').css('background-color');
			}
			

			if(pc_nav.closest('header').find('.cl-menu-option').length > 0) {
			} else {
				mobile_nav.find('div.siteCART.micon').css({
					'color': fixed_a_color,
					'right': '56px',
					'display': (checkFixTypeMenu) ? $('header.navbar-fheader').find('.siteCART.cl-fixbtn').css('display') : ''
				});
			}
			
			if(PAGE_MODE == 's') {
				var cart_active = Number(property.CART);
				// $.ajax({
				// 	type: 'POST',
				// 	url: '/_basket/check',
				// 	data: { sid : sid },
				// 	dataType: 'json',
				// 	async: true,
				// 	success: function(r) {
				// 		if(typeof r.error != 'undefined' && r.error) {
				// 			// console.log(r.error);
				// 			return false;
				// 		}
				// console.log(property.CART);
						if(Number(cart_active) > 0) {
							if(checkFixTypeMenu) {
								var cart_active_str = cart_active.toString(),
									$selec = $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub'),
									fixtypeNum = $('.el-menu header.navbar').attr('data-fixtype').replace(/(top|sidebar)\_/gi,''),
									cart_active_selec = ($selec.find('.siteCART .cart-active-txt').length>0) ? $selec.find('.cart-active-txt') : $selec.find('.cart-active'),									
									cart_active_class = (cart_active_str.length>1 && cart_active_str.length<3) ? 'cartActive_2' : ((cart_active_str.length>2 && cart_active_str.length<4) ? 'cartActive_3' : ''),
									radius_arr = ['03','04','05','06','10'];

								cart_active_selec.text(cart_active);
								$('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.siteCART .cart-active').show();
								$('.el-menu header.navbar').find('.siteCART.micon .cl_icon_cart').html('<span class="cart-active"></span>');

								if($.inArray(fixtypeNum,radius_arr) > -1) $selec.find('.cart-active').removeClass('cartActive_2 cartActive_3').addClass(cart_active_class);
								
							} else {
								var cart_active = '<span class="cart-active"></span>';
								$('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.siteCART .cl_icon_cart').html(cart_active);
							}
							
						} else {
							var r = { member : property.UMEMBER },
								check_login = (typeof r.member != 'undefined') ? r.member.check_login : false;

							// if(!check_login) $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.siteCART .cart-active').hide();
							// else $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.siteCART .cart-active').show();

							if(checkFixTypeMenu && Number(cart_active)==0) {
								$('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.cart-active').hide();
							}
						}
				// 	}
				// });
			} else {
				if(PAGE_MODE=='r' && checkFixTypeMenu) $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub').find('.cart-active').remove();
			}

		}
	}


	$.slang = {
		init: function(data) {
			// console.log('slang init');
			if(typeof data != 'undefined' && data) {
				if(PAGE_MODE == 'c') SLANG = data;
				else property.SLANG = data;
			}

			var slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG,
				s_validplan = (PAGE_MODE == 'c') ? VALIDPLAN : property.VALIDPLAN,
				s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				checkFree = (!s_validplan || s_validtype == 'PK') ? true : false;

			if(checkFree || $.isEmptyObject(slang) || (!$.isEmptyObject(slang) && slang.use_language=='off')) {
				$.slang.set('off');
			} else {
				$.slang.set('on');
			}
		},
		set: function(onoff) {
			// console.log('slang set');
			var check_fh = ($('.el-menu header.navbar').hasClass('navbar-fheader')) ? true : false,
				pc_nav = (check_fh) ? (($('.el-menu > header.navbar').hasClass('sidebar')) ? $('.el-menu > header.navbar') : $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub')) : $('.el-menu header.navbar #tpl-menu'),
				mobile_nav = (check_fh) ? $('#mobile-nav #fixed-menu') : $('.el-menu header.navbar'),
				checkFixOnSearch = (typeof $('.el-menu header.navbar').attr('data-fixon') != 'undefined' && $('.el-menu header.navbar').attr('data-fixon').indexOf('search')>-1) ? true : false;

			if(onoff.match(/on/gi)) $.slang.make();
			else {
				$('.el-menu .siteLANG, #mobile-nav .siteLANG').remove();

				if(pc_nav.find('.siteUM').css('display')=='none') {
					if(!checkFixOnSearch) {
						mobile_nav.parent().addClass('hide');
					} else {
						mobile_nav.parent().find('.login-content').css('pointer-events','none');
						mobile_nav.parent().find('.login-content').children().css('visibility','hidden');
					}
				}
			}
		},
		make: function() {
			// console.log('slang make');
			var check_fh = ($('.el-menu > header.navbar').hasClass('navbar-fheader')) ? true : false,
				caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				slang_data = (PAGE_MODE == 'c') ? SLANG['lists'] : property.SLANG['lists'],
				slang_str = (PAGE_MODE == 'c') ? SLANG['select'] : property.SLANG['select'],
				slang_arrow = (slang_data.length > 1) ? '<i class="cl-icon arrow09" aria-hidden="true"></i>' : '',
				slang_list = '',
				checkFixLangTypeMenu = (typeof $('.el-menu > header.navbar').attr('data-fixlangtype') != 'undefined' && $('.el-menu > header.navbar').attr('data-fixlangtype')) ? true : false,
				pc_nav = (check_fh) ? (($('.el-menu > header.navbar').hasClass('sidebar')) ? $('.el-menu > header.navbar') : $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub')) : $('.el-menu header.navbar #tpl-menu'),
				mobile_nav = (check_fh) ? $('#mobile-nav #fixed-menu') : $('.el-menu header.navbar'),
				fixbtnData = ($('.el-menu > header.navbar').hasClass('sidebar')) ? $.menuFixBtn.getData(pc_nav) : $.menuFixBtn.getData($('.el-menu > header.navbar')),
				checkFixOnSearch = (typeof $('.el-menu header.navbar').attr('data-fixon') != 'undefined' && $('.el-menu header.navbar').attr('data-fixon').indexOf('search')>-1) ? true : false;
				

			$.each(slang_data, function(i,o) {
				var active = (o['name'] == slang_str) ? 'active' : '';

				/* Shopping Only KO Site */
				// if(active && o['code'] != 'ko') {
				// 	pc_nav.find('.makeSiteSEARCH').remove();
				// 	pc_nav.find('.siteCART').remove();
				// }

				slang_list += '\
						<li class="' + active + '"><a href="javascript:;" data-code="' + o['code'] + '">' + o['name'] + '</a></li>\
				';
			});

			/*SLANG = (PAGE_MODE == 'c') ? SLANG : property.SLANG;*/
			var content = (checkFixLangTypeMenu) ? ($('.el-menu > header.navbar').hasClass('sidebar') ? $.menuFixBtn.fixLangSet(fixbtnData['fixlangtypeNum'],false) : $.menuFixBtn.fixLangSet(fixbtnData['fixlangtypeNum'])) : '\
				<li class="siteLANG dropdown">\
					<a href="javascript:;" class="dropdown-toggle"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i> <span class="slang-active">' + slang_str + '</span>' + slang_arrow + '</a>\
					<ul class="dropdown-menu">\
						' + slang_list + '\
					</ul>\
				</li>\
				',
				mobile_content = (checkFixLangTypeMenu) ? $.menuFixBtn.fixLangSet(fixbtnData['fixlangtypeNum'],false,'',true) : ((check_fh) ? '\
								<li class="siteLANG dropdown">\
									<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target="#m-dropdown-wrap-lang"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a>\
									<div class="dropdown-menu-wrap" id="m-dropdown-wrap-lang">\
										<span class="dropdown-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Change Multilingual Site"></span></span>\
										<ul class="dropdown-menu">\
											' + slang_list + '\
										</ul>\
									</div>\
								</li>\
								':'\
								<div class="siteLANG micon dropdown">\
									<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target=".siteLANG-dmenu-wrap"><i class="cl-icon cl_icon_globe" aria-hidden="true"></i></a>\
								</div>\
								'),
				mobile_dropdown_menu = '\
				<div class="siteLANG-dmenu-wrap">\
					<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
					<ul class="dropdown-menu">\
						' + slang_list + '\
					</ul>\
				</div>\
			';

			if(pc_nav.find('.siteLANG').length > 0) {
				pc_nav.find('.siteLANG').replaceWith(content);
				if($('.el-menu > header.navbar').hasClass('sidebar')) {
					pc_nav.find('.fh-line').remove();
					pc_nav.parents('.menu-inner').after('<hr class="fh-line" />');
				} 
			} else {
				pc_nav.find('.siteLANG.cl-fixbtn').remove();
				if(checkFixLangTypeMenu && $('.el-menu > header.navbar').hasClass('sidebar')) {
					pc_nav.find('.fh-line').remove();
					$('.el-menu > header.navbar').find('.menu-inner').after(content);
					pc_nav.parents('.menu-inner').after('<hr class="fh-line" />');
				} else pc_nav.append(content);
			}
			if(pc_nav.find('.siteUM').css('display')=='none') {
				if(!checkFixOnSearch) {
					mobile_nav.parent().addClass('hide');
				} else {
					mobile_nav.parent().find('.login-content').css('pointer-events','none');
					mobile_nav.parent().find('.login-content').children().css('visibility','hidden');
				}
			}
		
			if(check_fh) {
				if(checkFixLangTypeMenu) {
					if(mobile_nav.find('.cl-fixbtn.siteLANG').length==0) {
						$('#mobile-nav').append(mobile_content);
						$('#mobile-nav').find('.cl-fixbtn.siteLANG.dropup .dropdown-backdrop').remove();
					}

					var mobile_color = mobile_nav.find('.siteSEARCH.cl-fixbtn svg').css('fill');
					
					$('#mobile-nav').find('.siteLANG.cl-fixbtn a').css({
						'color':mobile_color,
						'border-color':mobile_color
					})

					$('#mobile-nav').find('.siteLANG.cl-fixbtn a svg').css('fill',mobile_color);
				} else {
					if(mobile_nav.find('.siteLANG').length > 0) mobile_nav.find('.siteLANG').replaceWith(mobile_content);
					else mobile_nav.append(mobile_content);
				}
			} else {
				if(mobile_nav.find('div.siteLANG.micon').length>0) mobile_nav.find('div.siteLANG.micon').replaceWith(mobile_content);
				else mobile_nav.find('.navbar-toggle').before(mobile_content);

				if($('div.siteLANG-dmenu-wrap').length>0) $('div.siteLANG-dmenu-wrap').replaceWith(mobile_dropdown_menu);
				else if($('div.siteUM-dmenu-wrap').length>0) $('div.siteUM-dmenu-wrap').after(mobile_dropdown_menu);
				else $('#tpl-menu').parent().after(mobile_dropdown_menu);

				mobile_nav.find('div.siteLANG.micon').css({
					'color': $('.el-menu .navbar-toggle .icon-bar').css('background-color'),
					'right': '56px',
				});
			}
		}
	} /*slang end*/


	$.umember = {		
		init: function(um_used, um_lang, um_display, callback) {
			// console.log('umember init');
			
			if(typeof um_used != 'undefined' && um_used) {
				if(PAGE_MODE == 'c') SITEUM = um_used;
				else property.SITEUM = um_used;
			}

			if(typeof um_lang != 'undefined' && um_lang) {
				if(PAGE_MODE == 'c') SITEUMLANG = um_lang;
				else property.SITEUMLANG = um_lang;
			}

			if(typeof um_display != 'undefined' && um_display) {
				if(PAGE_MODE == 'c') SITEUMDISPLAY = um_display;
				else property.SITEUMDISPLAY = um_display;
			}

			var s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				check_fh = ($('.el-menu header.navbar').hasClass('navbar-fheader')) ? true : false;

			if(s_um == 0 || (typeof s_um == 'string' && s_um == '0')) {
				if(check_fh) {
					$('#fixed-menu, #fixed-menu-sub').find('.siteUM').remove();
					$('#mobile-nav').find('.siteUM').remove();
					$('#mobile-nav').find('.mobilenav_top').addClass('hide');
				} else {
					$('#tpl-menu').find('.siteUM').remove();
					$('div.siteUM.micon').remove();
					$('div.siteUM-dmenu-wrap').remove();
				}
				if(typeof callback == 'function') { callback(); }
			} else {
				if(check_fh) $.umember.makeSiteFixedUM(callback);
				else $.umember.makeSiteUM(callback);
			}
		},
		setUM: function(onoff,callback) {
			// console.log('umember setUM');
			var check_fh = ($('.el-menu header.navbar').hasClass('navbar-fheader')) ? true : false;
			// menu ver2 : navbar-simple(mobile design)
			// menu ver3 : navbar-fheader(+shopping cart, mobile slide nav)

			if(onoff.match(/on/gi)) {
				if(check_fh) $.umember.makeSiteFixedUM(callback);
				else $.umember.makeSiteUM(callback);
			} else {
				if(check_fh) {
					$('#fixed-menu, #fixed-menu-sub').find('.siteUM').remove();
					$('#mobile-nav').find('.siteUM').remove();
				} else {
					$('#tpl-menu').find('.siteUM').remove();
					$('div.siteUM.micon').remove();
					$('div.siteUM-dmenu-wrap').remove();
				}

				if(typeof callback == 'function') {
					callback();
				}
			}
		},
		makeSiteFixedUM: function(callback) {
			// console.log('umember makeSiteFixedUM');
			var sid = (PAGE_MODE == 'c') ? SID : property.SID,
				s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				s_um_lang = (PAGE_MODE == 'c') ? SITEUMLANG : property.SITEUMLANG,
				s_um_display = (PAGE_MODE == 'c') ? SITEUMDISPLAY : property.SITEUMDISPLAY,
				s_service = (PAGE_MODE == 'c') ? SERVICE : property.SERVICE;

			if( s_validtype != 'BN' && s_validtype != 'SM' ||
				s_validtype == 'BN' && s_um == '-1'
			) {
				$.umember.setUM('off',callback);
				return false;
			}

			if(s_validtype == 'SM' && s_um_display == 'join') s_um_display = 'login';

			if(PAGE_MODE == 'c') {
				if(typeof callback == 'function') {
					callback();
				}
				return false;
			}

			var display = (s_um == 1) ? 'login' : s_um_display,
				caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				str = (s_um == 1) ? $.lang[LANG]['manager.site-um.login'] : ((s_um_display) ? $.lang[s_um_lang]['manager.site-um.'+s_um_display] : '');
			
			// $.post('/umember/login/check', { sid : sid }, function(r) {
				var r = { member : property.UMEMBER };

				var check_login = (typeof r.member != 'undefined') ? r.member.check_login : false, 
					check_admin = (typeof r.member != 'undefined') ? r.member.check_adm : false, 
					check_uadmin = (typeof r.member != 'undefined') ? r.member.check_uadm : false,
					check_groot = (typeof r.member != 'undefined') ? r.member.check_groot : false,
					uadmin_type = (typeof r.member != 'undefined') ? r.member.uadmin_type : '',
					check_id_type = (typeof r.member != 'undefined') ? r.member.id_type : '',
 					login_id = (typeof r.member != 'undefined') ? r.member.id : '',
 					login_nick = (typeof r.member.nick != 'undefined') ? r.member.nick : login_id,
 					login_profile = (typeof r.member.profile != 'undefined') ? r.member.profile : '//storage.googleapis.com/i.addblock.net/defaultImg.png',
 					f_color = ($('.el-menu .navbar-fheader').hasClass('mobile-design-clear')) ? 'style="color:' + $('.el-menu ul.navbar-nav > li > a').css('color') + ';"' : '',
 					checkFixTypeMenu = (typeof $('.el-menu header.navbar').attr('data-fixtype') != 'undefined' && $('.el-menu header.navbar').attr('data-fixtype')) ? true : false,
 					fixtype_color = (checkFixTypeMenu) ? (($('.el-menu .navbar-fheader').hasClass('mobile-design-clear')) ? 'style="color:' + $('.el-menu ul.cl-fixed-menu > li > a').css('color') + ';"' : '') : f_color,
 					fixtype_menu_color = (checkFixTypeMenu) ? (($('.el-menu .navbar-fheader').hasClass('mobile-design-clear')) ? 'style="color:' + $('.el-menu #tpl-menu > li > a').css('color') + ';"' : '') : f_color,
 					checkFixOnSearch = (typeof $('.el-menu header.navbar').attr('data-fixon') != 'undefined' && $('.el-menu header.navbar').attr('data-fixon').indexOf('search')>-1) ? true : false;
					
				var hostAry = window.location.hostname.split('.'),
					checkDomain = (hostAry[1] != 'creatorlink' && hostAry[1] != 'addblock') ? true : false,
					checkPort = (location.port) ? ':'+location.port : '',
					host = (!checkDomain) ? hostAry[1]+'.'+hostAry[2] : 'creatorlink.net',
					host_url = (s_service.indexOf('gabia') > -1) ? '//creatorlink-gabia.com' : '//'+host+checkPort,
					// gabia test
					// host_url = '//'+host+checkPort,
					menu_url = {
					'dashboard': (check_uadmin) ? '/_admin/dashboard' : host_url + '/dashboard',
					'member'   : (check_uadmin) ? '/_admin/member' : host_url + '/manager/member',
				};

				var menu_dashboard_str = (check_admin || check_uadmin) ? '\
							<li><a href="' + menu_url['dashboard'] + '" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							' : '',
					menu_member_str = (check_admin) ? '\
							<li><a href="' + host_url + '/manager/member/" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.manage'] + '</a></li>\
							' : '',
					menu_mygabia_str = (s_service.indexOf('gabia') > -1 && (check_admin || (check_uadmin && check_groot))) ? '\
							<li><a href="https://www.gabia.com/mygabia/service" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.mypage.gabia'] + '</a></li>\
							' : '',
					menu_mypage_str = (check_admin) ? '' : ((checkFixTypeMenu) ? '\
							<li><a class="mypost cl-umMenu" href="/_mypost">' + $.lang[LANG]['manager.site-um.mypage.post'] + '</a></li>\
							<li><a class="hand cl-umMenu myinfo-change" href="javascript:;" onclick="myinfoChangeBtn(this)" id="myinfo-change-btn" data-sid="'+sid+'">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
							' : '<li><a class="mypage" href="javascript:;">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>');

				if(checkDomain && check_admin) {
					menu_dashboard_str = '\
							<li><a class="dashboard cl-umMenu" href="javascript:;" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							';
				}

				if(s_validtype == 'SM') {
					if(checkFixTypeMenu) {
						var propertySettings = (PAGE_MODE!='c' && typeof property.SETTINGS!='undefined') ? property.SETTINGS : {},
							smSettings = (PAGE_MODE!='c' && typeof property.SMSETTINGS!='undefined') ? property.SMSETTINGS : {},
							point_settings = (PAGE_MODE!='c' && typeof property.POINGSETTINGS!='undefined') ? property.POINGSETTINGS : {},
							point_user = (PAGE_MODE!='c' && typeof point_settings.point_use != 'undefined' && point_settings.point_use) ? point_settings.point_use : '',
							coupon_btn_str = (PAGE_MODE!='c' && typeof smSettings.coupon_use_yn != 'undefined' && smSettings.coupon_use_yn == 'Y') ? ('<li><a class="coupon cl-umMenu" href="/_coupon">' + $.lang[LANG]['manager.site-um.mypage.coupon'] + '</a></li>') : '',
							point_useStr = (PAGE_MODE!='c' && point_user && point_user=='Y' && LANG=='ko') ? '<li><a class="mypoint cl-umMenu" href="/_point">' + $.lang[LANG]['manager.site-um.mypage.point'] + '</a></li>' : '',
							wishlist_btn_str = (typeof propertySettings.product_wishlist_btn != 'undefined' && (propertySettings.product_wishlist_btn=='Y') && LANG=='ko') ? '<li><a class="mywishlist cl-umMenu" href="/_wishlist">' + $.lang[LANG]['manager.site-um.mypage.wishlistbtn'] + '</a></li>' : '';
						
						menu_mypage_str = (check_admin) ? '' : '\
								<li><a class="myorderlist cl-umMenu" href="/_mypage">' + $.lang[LANG]['manager.site-um.mypage.orderlist'] + '</a></li>' 
								+ wishlist_btn_str + coupon_btn_str + point_useStr + '\
								<li><a class="mypost cl-umMenu" href="/_mypost">' + $.lang[LANG]['manager.site-um.mypage.post'] + '</a></li>\
								<li><a class="hand myinfo-change cl-umMenu" href="javascript:;" onclick="myinfoChangeBtn(this)" id="myinfo-change-btn" data-sid="'+sid+'">' + $.lang[LANG]['manager.site-um.mypage.new'] + '</a></li>\
						';
					} else {
						menu_mypage_str = (check_admin) ? '' : '\
								<li><a class="mypage" href="javascript:;">' + $.lang[LANG]['manager.site-um.mypage.SM'] + '</a></li>\
						';
					}
				}

				if(login_id == 'naverpaytest') {
					menu_mypage_str = '';
				}

				var SLANG = (PAGE_MODE == 'c') ? SLANG : property.SLANG,
					lang_str = LANG;

				if((typeof SLANG != 'undefined' && typeof SLANG.select_code != 'undefined' && SLANG.select_code)
			                || (!$.isEmptyObject(SLANG) && SLANG.use_language == 'on' && SLANG.select_code)) {
			        lang_str = (SLANG['select_code'].toLowerCase()!='ko') ? 'en' : LANG;
			    } 
			  
				var login_url = (s_validtype == 'SM') ? '/_login' : 'javascript:;',	
					login_content_dropdown_class = (checkFixTypeMenu) ? 'dropdown-toggle' : '',
					login_content_dropdown = (checkFixTypeMenu) ? 'data-toggle="dropdown" data-target="#m-dropdown-wrap-um"' : '',
					login_svg = (checkFixTypeMenu) ? clSVG('arrow_next',16,16) : '',
					login_content = (!check_login) ? '<div class="login-content siteUM"><a href="javascript:;" class="' + display + '" ' + fixtype_color + '>' + $.lang[lang_str]['manager.site-um.mobile.'+s_um_display] + login_svg + '</a></div>' : '\
					<div class="login-content '+login_content_dropdown_class+'" '+login_content_dropdown+'>\
						<div class="login-profile">\
							<img src="' + login_profile + '" alt="" class="img-responsive" />\
						</div>\
						<div class="login-nick"  ' + fixtype_menu_color + '><span>' + login_nick + '</span> 님</div>\
					</div>',
					menu_str = menu_dashboard_str + menu_member_str + menu_mygabia_str + menu_mypage_str,
					pc_dropdown = (check_login) ? '\
					<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout cl-umMenu" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
						' : '',
					content = (!check_login) ? '\
					<li class="siteUM"><a href="javascript:;" class="' + display + '"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></li>' : '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle"><i class="cl-icon cl_icon_profile_on02" aria-hidden="true"></i></a>\
						'+ pc_dropdown +'\
					</li>\
					',
					mobile_dropdown = (check_login) ? '\
					<div class="dropdown-menu-wrap" id="m-dropdown-wrap-um">\
						<span class="dropdown-close"><img src="//storage.googleapis.com/i.addblock.net/fa-close-modal-white.png" alt="Close Member Menu"></span></span>\
						<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout cl-umMenu" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</div>\
					' : '',
					mobile_content = (!check_login) ? '\
					<li class="siteUM"><a href="javascript:;" class="' + display + '"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></li>' : '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target="#m-dropdown-wrap-um"><i class="cl-icon cl_icon_profile_on02" aria-hidden="true"></i></a>\
						'+ mobile_dropdown +'\
					</li>\
					';

				// IE ERROR_promise__H.20210603
				// var successSiteUMLogin = new Promise(function(resolve, reject) {
				var successSiteUMLogin = function() {
					var deferred = $.Deferred();

					var pc_nav = $('.el-menu header.navbar #fixed-menu, .el-menu header.navbar #fixed-menu-sub'),
						mobile_nav = $('#mobile-nav #fixed-menu'),
						checkFixTypeMenu = (typeof $('.el-menu header.navbar').attr('data-fixtype') != 'undefined' && $('.el-menu header.navbar').attr('data-fixtype')) ? true : false;

					if(pc_nav.find('.siteUM').length > 0) {
						if(checkFixTypeMenu) {
							setLoginLogoutAttribute(check_login,pc_nav,display);
							if(check_login) pc_nav.find('.siteUM').find('.cl-logout').after(pc_dropdown);										
						} else pc_nav.find('.siteUM').replaceWith(content);
					} else {
						if(pc_nav.find('.siteSEARCH').length > 0) pc_nav.find('.siteSEARCH').after(content);
						else if(pc_nav.find('.siteCART').length > 0) pc_nav.find('.siteCART').before(content);
						else if(pc_nav.find('.siteLANG').length > 0) pc_nav.find('.siteLANG').before(content);
						else pc_nav.append(content);
					}

					if(mobile_nav.find('.siteUM').length > 0) {
						if(checkFixTypeMenu) {
							setLoginLogoutAttribute(check_login,mobile_nav,display);
							if(check_login) mobile_nav.prepend(mobile_dropdown);
						} else mobile_nav.find('.siteUM').replaceWith(mobile_content);
					} else {
						if(mobile_nav.find('.siteSEARCH').length > 0) mobile_nav.find('.siteSEARCH').after(mobile_content);
						else if(mobile_nav.find('.siteCART').length > 0) mobile_nav.find('.siteCART').before(mobile_content);
						else if(mobile_nav.find('.siteLANG').length > 0) mobile_nav.find('.siteLANG').before(mobile_content);
						else mobile_nav.append(mobile_content);
					}

					
					if(mobile_nav.closest('#mobile-nav').find('.login-content').length > 0) mobile_nav.closest('#mobile-nav').find('.login-content').replaceWith(login_content);
					else mobile_nav.before(login_content);

					if(pc_nav.find('.siteUM').css('display')=='none') {
						if(!checkFixOnSearch) {
							mobile_nav.parent().addClass('hide');
						} else {
							mobile_nav.parent().find('.login-content').css('pointer-events','none');
							mobile_nav.parent().find('.login-content').children().css('visibility','hidden');
						}
					}

					// var loginStr = (checkFixTypeMenu && !check_login) ? mobile_nav.find('.siteUM').removeClass('dropdown').find('.cl-login').clone() : '';

					// if(checkFixTypeMenu && (mobile_nav.closest('#mobile-nav').find('.login-content').length > 0) && !check_login) {
					// 	$('.mobilenav_top .login-content').html(loginStr);
					// } 

				// IE ERROR_promise__H.20210603
				// 	resolve();
				// });
					deferred.resolve();
					return deferred.promise();
				}


				// IE ERROR_promise__H.20210603
				// successSiteUMLogin.then(function(value) {
				successSiteUMLogin().then(function(value) {
					if(typeof callback == 'function') {
						callback();
					}
				});


			// },'json');


		},
		makeSiteUM: function(callback) {
			// console.log('umember makeSiteUM');
			var sid = (PAGE_MODE == 'c') ? SID : property.SID,
				s_validtype = (PAGE_MODE == 'c') ? VALIDTYPE : property.VALIDTYPE,
				s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				s_um_lang = (PAGE_MODE == 'c') ? SITEUMLANG : property.SITEUMLANG,
				s_um_display = (PAGE_MODE == 'c') ? SITEUMDISPLAY : property.SITEUMDISPLAY,
				s_service = (PAGE_MODE == 'c') ? SERVICE : property.SERVICE;

			if( s_validtype != 'BN' && s_validtype != 'SM' ||
				s_validtype == 'BN' && s_um == '-1') {
				$.umember.setUM('off',callback);
				return false;
			}

			if(s_validtype == 'SM' && s_um_display == 'join') s_um_display = 'login';

			var display = (s_um == 1) ? 'login' : s_um_display,
				caret = ($('.el-menu > header.navbar').hasClass('sidebar')) ? 'fa fa-caret-right fa-1' : 'fa fa-caret-down fa-1',
				str = (s_um == 1) ? $.lang[LANG]['manager.site-um.login'] : ((s_um_display) ? $.lang[s_um_lang]['manager.site-um.'+s_um_display] : '');

			$.post('/umember/login/check', { sid : sid }, function(r) {
				var check_login = (typeof r.member != 'undefined') ? r.member.check_login : false, 
					check_admin = (typeof r.member != 'undefined') ? r.member.check_adm : false, 
					check_uadmin = (typeof r.member != 'undefined') ? r.member.check_uadm : false,
					uadmin_type = (typeof r.member != 'undefined') ? r.member.uadmin_type : '',
					check_id_type = (typeof r.member != 'undefined') ? r.member.id_type : '',
 					login_id = (typeof r.member != 'undefined') ? r.member.id : '',
 					login_nick = (typeof r.member.nick != 'undefined') ? r.member.nick : login_id;

                var hostAry = window.location.hostname.split('.'),
                    checkDomain = (hostAry[1] != 'creatorlink' && hostAry[1] != 'addblock') ? true : false,
                    checkPort = (location.port) ? ':'+location.port : '',
                    host = (!checkDomain) ? hostAry[1]+'.'+hostAry[2] : 'creatorlink.net',
                    host_url = (s_service.indexOf('gabia') > -1) ? '//creatorlink-gabia.com' : '//'+host+checkPort,
					menu_url = {
					'dashboard': (check_uadmin) ? '/_admin/dashboard' : host_url + '/dashboard',
					'member'   : (check_uadmin) ? '/_admin/member' : host_url + '/manager/member',
				};

				var menu_dashboard_str = (check_admin || check_uadmin) ? '\
							<li><a href="' + menu_url['dashboard'] + '" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							' : '',
					menu_member_str = (check_admin) ? '\
							<li><a href="' + host_url + '/manager/member" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.manage'] + '</a></li>\
							' : '',
					menu_mygabia_str = (s_service.indexOf('gabia') > -1 && (check_admin || (check_uadmin && check_groot))) ? '\
							<li><a href="https://www.gabia.com/mygabia/service" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.mypage.gabia'] + '</a></li>\
							' : '',
					menu_mypage_str = (check_admin) ? '' : '\
							<li><a class="mypost cl-umMenu" href="/_mypost">' + $.lang[LANG]['manager.site-um.mypage.post'] + '</a></li>\
							<li><a class="hand myinfo-change cl-umMenu" onclick="myinfoChangeBtn(this)" id="myinfo-change-btn" data-sid="'+sid+'">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
							';

				if(checkDomain && check_admin) {
					menu_dashboard_str = '\
							<li><a class="dashboard cl-umMenu" href="javascript:;" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							';
				}

				if(s_validtype == 'SM') {
					var propertySettings = (PAGE_MODE!='c' && typeof property.SETTINGS!='undefined') ? property.SETTINGS : {},
						smSettings = (PAGE_MODE!='c' && typeof property.SMSETTINGS!='undefined') ? property.SMSETTINGS : {},
						point_settings = (PAGE_MODE!='c' && typeof property.POINGSETTINGS!='undefined') ? property.POINGSETTINGS : {},
						point_user = (PAGE_MODE!='c' && typeof point_settings.point_use != 'undefined' && point_settings.point_use) ? point_settings.point_use : '',
						coupon_btn_str = (PAGE_MODE!='c' && typeof smSettings.coupon_use_yn != 'undefined' && smSettings.coupon_use_yn=='Y') ? ('<li><a class="coupon cl-umMenu" href="/_coupon">' + $.lang[LANG]['manager.site-um.mypage.coupon'] + '</a></li>') : '';
						point_useStr = (PAGE_MODE!='c' && point_user && point_user=='Y') ? '<li><a class="mypoint cl-umMenu" href="/_point">' + $.lang[LANG]['manager.site-um.mypage.point'] + '</a></li>' : '',
						wishlist_btn_str = (typeof propertySettings.product_wishlist_btn != 'undefined' && (propertySettings.product_wishlist_btn=='Y')) ? '<li><a class="mywishlist cl-umMenu" href="/_wishlist">' + $.lang[LANG]['manager.site-um.mypage.wishlistbtn'] + '</a></li>' : '';
					
					menu_mypage_str = (check_admin) ? '' : '\
							<li><a class="myorderlist cl-umMenu" href="/_mypage">' + $.lang[LANG]['manager.site-um.mypage.orderlist'] + '</a></li>'
							+ wishlist_btn_str + coupon_btn_str + point_useStr + '\
							<li><a class="mypost cl-umMenu" href="/_mypost">' + $.lang[LANG]['manager.site-um.mypage.post'] + '</a></li>\
							<li><a class="hand myinfo-change cl-umMenu" href="javascript:;" onclick="myinfoChangeBtn(this)" id="myinfo-change-btn" data-sid="'+sid+'">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
					';
				}

				var menu_str = menu_dashboard_str + menu_member_str + menu_mygabia_str + menu_mypage_str,
					content = (!check_login) ? '<li class="siteUM"><a class="' + display + '" href="javascript:;"><span class="glyphicon glyphicon-user"></span> ' + str + '</a></li>' : '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle">' + login_nick + ' <i class="' + caret + '" aria-hidden="true"></i></a>\
						<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</li>\
					',
					mobile_content = (!check_login) ? '<div class="siteUM micon"><a class="' + display + '" href="javascript:;"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a></div>' : '\
					<div class="siteUM micon dropdown">\
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-target=".siteUM-dmenu-wrap"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a>\
					</div>\
					',
					mobile_dropdown_menu = '\
					<div class="siteUM-dmenu-wrap">\
						<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
						<ul class="dropdown-menu">\
							' + menu_str + '\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</div>\
				';

				if(check_id_type == 'creatorlink' && !check_admin && login_id) { //creatorlink member
					var mypage_url = (s_service.indexOf('gabia') > -1) ? '//www.gabia.com/mygabia/service' : '//'+host_url+'/mypage',
						mypage_name = (s_service.indexOf('gabia') > -1) ? $.lang[LANG]['manager.site-um.mypage.gabia'] : $.lang[LANG]['manager.site-um.mypage'];

					content = '\
					<li class="siteUM dropdown">\
						<a href="javascript:;" class="dropdown-toggle">' + login_nick + ' <i class="' + caret + '" aria-hidden="true"></i></a>\
						<ul class="dropdown-menu">\
							<li><a href="' + host_url + '/dashboard" target="_blank" class="cl-umMenu">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
					';

					if(!check_uadmin) content +='\
							<li><a href="' + mypage_url + '" target="_blank" class="cl-umMenu">' + mypage_name + '</a></li>\
					';
					content += '\
							<li><a class="logout cl-umMenu" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</li>\
					';
					mobile_content = '\
					<div class="siteUM micon dropdown">\
						<a href="javascript:;" class="dropdown-toggle" data-target=".siteUM-dmenu-wrap"><i class="cl-icon cl_icon_profile" aria-hidden="true"></i></a>\
					</div>\
					';
					mobile_dropdown_menu = '\
					<div class="siteUM-dmenu-wrap">\
						<!--<span class="dropdown-close"><span class="icon-bar"></span><span class="icon-bar"></span></span>-->\
						<ul class="dropdown-menu">\
							<li><a href="' + host_url + '/dashboard" target="_blank">' + $.lang[LANG]['manager.site-um.dashboard'] + '</a></li>\
							<li><a href="' + mypage_url + '" target="_blank">' + $.lang[LANG]['manager.site-um.mypage'] + '</a></li>\
							<li><a class="logout" href="javascript:;">' + $.lang[LANG]['manager.site-um.logout'] + '</a></li>\
						</ul>\
					</div>\
					';
				} 


				// IE ERROR_promise__H.20210603
				// var successSiteUMLogin = new Promise(function(resolve, reject) {
				var successSiteUMLogin = function() {
					var deferred = $.Deferred();

					if($('#tpl-menu').find('.siteUM').length > 0) $('#tpl-menu').find('.siteUM').replaceWith(content);
					else {
						if($('#tpl-menu').find('.siteLANG').length > 0 ) $('#tpl-menu').find('.siteLANG').before(content);
						else $('#tpl-menu').append(content);
					}

					if($('div.siteUM.micon').length>0) $('div.siteUM.micon').replaceWith(mobile_content);
					else $('.el-menu .navbar-toggle').before(mobile_content);

					if($('div.siteUM-dmenu-wrap').length>0) $('div.siteUM-dmenu-wrap').replaceWith(mobile_dropdown_menu);
					else $('#tpl-menu').parent().after(mobile_dropdown_menu);

					var check_slang = (PAGE_MODE == 'c') ? SLANG : property.SLANG;
					$('.el-menu .navbar-header div.siteUM.micon').css({
						'color': $('.el-menu .navbar-toggle .icon-bar').css('background-color'),
						'right': ($.isEmptyObject(check_slang)) ? '56px' : '91px',
					});

				// IE ERROR_promise__H.20210603
				// 	resolve();
				// });
					deferred.resolve();
					return deferred.promise();
				}

				// IE ERROR_promise__H.20210603
				// successSiteUMLogin.then(function(value) {
				successSiteUMLogin().then(function(value) {
					if(typeof callback == 'function') {
						callback();
					}
				});
			},'json');

		},
		showMngModal: function(sid, content, id, backdrop, showcallback, showncallback, hiddencallback, callback, closecallback) {
			// console.log('umember showMngModal');
			var container = $(content),
				backdrop = (typeof backdrop == 'undefined') ? false : true;

			$('body').append(container);
			var newInstance = jQuery.extend(true, {}, container);
			var modalElement = newInstance.find('#' + id);

			modalElement.attr('data-sid',sid);

			if(backdrop) modalElement.modal({ backdrop : 'static'});
			else modalElement.modal();

			modalElement.on('show.bs.modal', function(e) {
				if(typeof showcallback == 'function') showcallback();
			});

			modalElement.on('shown.bs.modal', function(e) {
				var modal = document.querySelector('.modal');
				modal.style.position = 'absolute';
				setTimeout(function() {
					modal.style.position = 'fixed';
				},0);
				if(window.innerWidth <= 768) $.mobileToggleMenu.close();
				if(typeof showncallback == 'function') showncallback();
			});

			modalElement.on('hidden.bs.modal', function(e) {
				var flat_modal_id = $(this).attr('id');
				$('.editor-navbar').css('z-index','1040');
				var this_modal = $('#'+flat_modal_id).closest('.flat-modal');
				this_modal.next('.modal-backdrop').remove();
				this_modal.remove();

				if($('.modal-backdrop').length) {
					setTimeout(function() {
						$('body').addClass('modal-open');    
					},10);                
				}
				$('body').removeClass('no-fixed');

				if(typeof hiddencallback == "function") hiddencallback();
			});

			newInstance.find('.ok-button-dialog').bind('click', function () {
				if(typeof callback == 'function')
					callback();
			});

			newInstance.find('.close-button-dialog').bind('click', function () {
				if(typeof closecallback == 'function')
					closecallback();
			});

			return modalElement;
		},
		showJoinModal: function(sid,mode) {
			console.log('umember showJoinModal');
			mode = (typeof mode != 'undefined' && mode) ? '-' + mode : '';

			if($('#join-modal' + mode).length > 0) return false;
			if($('#login-modal').length > 0) $('#login-modal').delay(3000).modal('hide');

			$.post('/umember/get/type/join', { sid : sid, field : '*' }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}
				
				COLLECTION_REGEX = $.parseJSON(data['regExp']);

				var content = $.umember.makeJoinModalContent(sid,data,mode);
				$.umember.showMngModal(sid, content, 'join-modal' + mode, false,
										function() { $.umember.joinModalInit(mode); }, 
										function() { $.umember.joinModalKeyFunc(mode); }, '', '', '');
				
			}, 'json');
		},
		makeJoinCollectionsTypeVal: function(oval_i,oval_type,oval_v,org_field,optional_class,check_page,val) {
			var str = '';

			check_page = (typeof check_page != 'undefined' && check_page) ? check_page : '';
			val = (typeof val != 'undefined' && val) ? val : '';
	
			switch (oval_type) {
				case 'memo':
					str += '\
						<textarea class="cl-s-form-control" name="'+org_field+'" cols="120" rows="10" id="cl-etc-input-val-memo">'+oval_v+'</textarea>\
					';
					break;
				case 'radio':
					var oval_checked = ((check_page=='mypage') && (oval_v==val)) ? 'checked' : '';
					str += '\
						<div class="newcheckbox">\
							<label>\
								<div class="newcheckboxSvgRadio">\
									<input type="radio" class="cl-common-form-radio-hide cl-etc-input-val cl-s-form-control" name="'+org_field+'" value="'+oval_v+'" '+oval_checked+'>\
									<svg viewBox="0 0 18 18" width="18" height="18">\
										<path d="M9 0C4.03 0 0 4.03 0 9c0 4.97 4.03 9 9 9s9-4.03 9-9C18 4.03 13.97 0 9 0zM9 17c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8C17 13.41 13.41 17 9 17z"/>\
									</svg>\
									<svg class="active" viewBox="0 0 18 18" width="18" height="18">\
										<path d="M9 0C4.03 0 0 4.03 0 9c0 4.97 4.03 9 9 9s9-4.03 9-9C18 4.03 13.97 0 9 0zM9 17c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8C17 13.41 13.41 17 9 17z"/>\
										<circle cx="9" cy="9" r="6"/>\
									</svg>\
								</div>\
								<span>'+oval_v+'</span>\
							</label>\
						</div>\
					';
					
					break;				
					
				case 'check':
					var oval_checked = ((check_page=='mypage') && (oval_v==val)) ? 'checked' : '';
						if(check_page=='mypage' && (val.indexOf('`') > -1)) {
							if(val.indexOf(oval_v) > -1) {
								oval_checked = 'checked';
							}
						}
						str += '\
						<div class="newcheckbox">\
							<label>\
								<div class="newcheckboxSvg">\
									<input type="checkbox" class="cl-common-form-radio-hide cl-etc-input-val cl-s-form-control" id="" name="'+org_field+'" value="'+oval_v+'" '+oval_checked+'>\
									<svg viewBox="0 0 16 16" width="16" height="16">\
										<path class="st6" d="M3 0h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H3c-1.66 0-3-1.34-3-3V3C0 1.34 1.34 0 3 0z"></path>\
										<path class="st19" d="M13 1c1.1 0 2 0.9 2 2v10c0 1.1-0.9 2-2 2H3c-1.1 0-2-0.9-2-2V3c0-1.1 0.9-2 2-2H13M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0L13 0z"></path>\
									</svg>\
									<svg class="active" viewBox="0 0 16 16" width="16" height="16">\
										<rect x="2" y="2" class="st6" width="12" height="12"></rect>\
										<path class="st19" d="M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0zM13.03 6.03l-5.5 5.5C7.38 11.68 7.19 11.75 7 11.75s-0.38-0.07-0.53-0.22l-3.5-3.5c-0.29-0.29-0.29-0.77 0-1.06s0.77-0.29 1.06 0L7 9.94l4.97-4.97c0.29-0.29 0.77-0.29 1.06 0S13.32 5.74 13.03 6.03z"></path>\
									</svg>\
								</div>\
								<span>'+oval_v+'</span>\
							</label>\
						</div>\
						';
					
					break;

				case 'select':
					var selected = ((check_page=='mypage') && (oval_v==val)) ? 'selected' : '';
					str += '\
						<option value="'+oval_v+'" '+selected+'>'+oval_v+'</option>\
					';
					
					break;

				default:
					break;
			}
				if(org_field=='etc7') {
				console.log(oval_v);
				}
			return str;
						
		},
		makeJoinConditionsStr: function(sid,data,key,mode) {
			// console.log('umember makeJoinConditionsStr');
			switch(key) {
				case 'captcha' :
					return `
								<div class="kcaptcha-wrap clearfix ${(data['captcha'] == '1') ? '' : 'hide'}">
									<div class="col-xs-4 col-sm-4 col-md-4 no-padding kcaptcha-box">
										<p id="write_option"><img src="" id="kcaptcha" alt=""/></p>
									</div>
									<div class="col-xs-8 col-sm-8 col-md-8 text-left kcaptcha-key-wrap">
										<input type="text" id="wr_key" name="wr_key" class="col-xs-12 col-sm-12 col-md-12 ed" placeholder="${$.lang[LANG]['manager.join.cl.captcha-msg']}" />
										<a class="kcaptcha-change hand small">${$.lang[LANG]['manager.join.cl.captcha-change']}</a>
									</div>
								</div>
					`;
					break;

				case 'collections':
					var collections_html = '';
					$.each(data['collections'], function(field,o) {
						if(field == 'email') return;
						if(o['used']) {
							var org_field = (field == 'addr') ? field + '1' : field,
								optional = o['optional'],
								name = (o['name']) ? o['name'] : $.lang[LANG]['manager.list.info.'+org_field],
								optional_class = (optional) ? 'optional' : '',
								key_func = '',
								add_input = '',
								jcollection_val_str = '',
								etc_val_type = ['memo','radio','check','select'];

							if(field == 'birth') {
								name = $.lang[LANG]['siteum.mypage.Birth'];
								key_func = 'onkeyup="auto_date_format(event, this)" onkeypress="auto_date_format(event, this)"';
								key_func = 'onkeydown="auto_date_format(event, this)"';
							}

							var star = (optional) ? '<span class="input-star">*</span>' : '';
							if(field.indexOf('etc')>-1 && etc_val_type.includes(o['type'])) {
								var o_val = o['val'],
									o_val_arr = ((o_val.indexOf('`') > -1) && (o['type']=='radio' || o['type']=='check' || o['type']=='select')) ? o_val.split('`') : [o_val],
									description_class = (o['description_used']=='true' && (o['type']=='memo')) ? 'use_descr' : '';

								add_input = '\
								<div class="cl-s-join-collections-etcwrap cl-s-form-wrap ' + optional_class + '" data-jcoltype="'+o['type']+'">';
								add_input += '\
									<div class="cl-s-etc">\
										<span class="cl-s-etc-name">'+ name + star +'</span>\
										';
								add_input += (o['description_used']=='true') ? '<span class="cl-s-etc-description">'+ o['description'] +'</span>' : '';
								add_input += '\
									</div>\
									';

								add_input += '\
									<div class="cl-s-etc-val '+description_class+'">\
								';

								if(o['type']=='select') {
									add_input += '\
									<div class="cl-s-form-group cl-s-form-group-select">\
										<select class="cl-s-form-control" name="'+org_field+'" id="input-' + org_field + '" required="required">\
											<option value="">'+$.lang[LANG]['manager.list.info.gender.select']+'</option>\
									';
								} 
								if(o_val_arr.length > 0) {
									$.each(o_val_arr, function(oval_i,oval_v){
										jcollection_val_str += $.umember.makeJoinCollectionsTypeVal(oval_i,o['type'],oval_v,org_field,optional_class);
									});
								} 
								
								if(o['type']=='select') {
									jcollection_val_str += '\
										</select>\
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
									</div>\
									';
								}
								jcollection_val_str += '</div></div>';
								
							} else {
								add_input = '\
											<div class="cl-s-form-wrap ' + optional_class + '">\
												<div class="cl-s-form-group">\
													<input type="text" class="cl-s-form-control" name="'+org_field+'" id="input-' + org_field + '" required="required" value="" ' + key_func + '>\
													<label for="input" class="cl-s-control-label">' + name + star + '</label>\
												</div>\
											</div>\
									';
								
								if(field == 'addr') {
									var addr_modal = (mode.indexOf('shopping') > -1 || o['addrsearch']) ? 'readonly onfocus="addrSearchModal(\'input\')" ' : '';
									add_input = '\
											<div class="cl-s-form-wrap ' + optional_class + '">\
												<div class="cl-s-form-group">\
													<input type="hidden" class="cl-s-form-control" name="postcode" id="input-postcode" value="">\
													<input type="text" class="cl-s-form-control" name="'+org_field+'" id="input-' + org_field + '" required="required" value="" ' + addr_modal + '>\
													<label for="input" class="cl-s-control-label">' + $.lang[LANG]['manager.list.info.addr1'] + star + '</label>\
												</div>\
											</div>\
											<div class="cl-s-form-wrap">\
												<div class="cl-s-form-group">\
													<input type="text" class="cl-s-form-control" name="addr2" id="input-addr2" required="required" value="">\
													<label for="input" class="cl-s-control-label">' + $.lang[LANG]['manager.list.info.addr2'] + '</label>\
												</div>\
											</div>\
									';
								}

								if(field == 'gender') {
									add_input = '\
											<div class="cl-s-form-wrap ' + optional_class + '">\
												<div class="cl-s-form-group">\
													<select class="cl-s-form-control" name="'+org_field+'" id="input-' + org_field + '" required="required">\
														<option value="">'+$.lang[LANG]['manager.list.info.gender.select']+'</option>\
														<option value="01">'+$.lang[LANG]['manager.list.info.gender.01']+'</option>\
														<option value="02">'+$.lang[LANG]['manager.list.info.gender.02']+'</option>\
													</select>\
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
													<label for="input" class="cl-s-control-label">' + $.lang[LANG]['manager.list.info.gender'] + star + '</label>\
												</div>\
											</div>\
									';
								}

								if(mode == 'shopping_social' && !optional) add_input = '';
								if(mode.indexOf('cert') > -1) {
									switch (field) {
										case 'name':
										case 'gender':
										case 'birth':
										case 'tel':
											add_input = '<input id="input-' + org_field + '" type="hidden" name="' + org_field + '" value="">';
											break;
									}
								}
							}

							collections_html += add_input + jcollection_val_str;

						}
					});
					return collections_html;
					break;

				default:
					return data[key];
					break;
			}

		},
		makeJoinModalContent: function(sid,data,mode) {
			// console.log('umember makeJoinModalContent');
			if(PAGE_MODE == 's') { // 게시사이트 다국어 회원가입 페이지 한글과 섞여나오는 부분 방지
				if(property.SLANG.select_code == undefined) {
					LANG = 'ko';
				} else {
					if(property.SLANG.select_code == 'ko') LANG = 'ko';
					else LANG = 'en';
				}
			}
			var collections = $.umember.makeJoinConditionsStr(sid,data,'collections',mode),
				captcha = $.umember.makeJoinConditionsStr(sid,data,'captcha',mode),
				privacy_type = (LANG == 'ko') ? 'privacy-join' : 'privacy',
				approval = (typeof data.approval != 'undefined' && data.approval) ? data.approval : 'hand',
				mode2 = data.mode2;

			var sns_input = (mode == 'shopping_social' || (mode == 'shopping_cert' && mode2 == 'shopping_sns')) ? 'readonly="true"' : '',
				content = '\
					<div class="cl-s-form-wrap optional">\
						<div class="cl-s-form-group">\
							<input type="text" class="cl-s-form-control" name="email" id="input-email" required="required" value="" '+sns_input+'>\
							<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.login.email'] + '<span class="input-star">*</span></label>\
						</div>\
					</div>\
			';

			if(mode == 'shopping_social' || (mode == 'shopping_cert' && mode2 == 'shopping_sns')) {
				content += collections;
				var register_form_arr = {
					'content' : content
				}
			} else {
				content += '\
						<div class="cl-s-form-wrap optional">\
							<div class="cl-s-form-group">\
								<input type="password" class="cl-s-form-control" name="password" id="input-password" required="required" value="">\
								<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.login.password'] + '<span class="input-star">*</span></label>\
							</div>\
						</div>\
						<div class="cl-s-form-wrap optional">\
							<div class="cl-s-form-group">\
								<input type="password" class="cl-s-form-control" name="password_checked" id="input-password-checked" required="required" value="">\
								<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.login.password-check'] + '<span class="input-star">*</span></label>\
							</div>\
						</div>\
						<div class="cl-s-form-description">' + $.lang[LANG]['siteum.login.password.description'] + '</div>\
						' + collections + '\
				';
				var register_form_arr = {
					'content' : content,
					'captcha' : captcha
				}
			}
			return register_form_arr;
		},
		joinModalInit: function(mode) {
			// console.log('umember joinModalInit');
			mode = (mode) ? '-' + mode : '';
			var joinModal = $('#join-modal' + mode);

			joinModal.find('.form-group').each(function() {
				$(this).removeClass('focus');
				$(this).find('.error').remove();
				$(this).find('input.form-control').val('');
				$(this).find('#join-textarea').html('');
			});
			
			joinModal.find('#wr_key').val('');
		},
		joinModalKeyFunc: function(mode) {
			// console.log('umember joinModalKeyFunc');
			mode = (mode) ? '-' + mode : '';
			var joinModal = $('#join-modal' + mode);

			if(!joinModal.find('.kcaptcha-wrap').hasClass('hide')) {
				load_kcaptcha();
				joinModal.find('#wr_key').live({
					keyup: function() {
						if($(this).val().trim().length > 0) { $(this).next('.error').remove(); }
					}
				});
			}

			joinModal.find('input.form-control').live({
				focus: function() {
					$(this).closest('.form-group').addClass('focus').siblings().removeClass('focus');
				}, 
				blur: function() {
					$(this).closest('.form-group').removeClass('focus');
				},
				keydown: function(key) {
					if(key.keyCode == 13) $('#uJoin').click();
				},
				keyup: function() {
					var groupEl = $(this).closest('.form-group'),
						errorEL = $(this).next().next('.error'),
						field = $(this).attr('id').trim().replace(/input-/,''),
						reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
						reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
						reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

					if(field=='password' || field == 'password-checked') {
						var pwEl = joinModal.find('#input-password'),
							pw2El = joinModal.find('#input-password-checked'),
							error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];

						if(pwEl.val() == pw2El.val()) { 
							pw2El.next().next('.error').remove();
						} else {
							if(pw2El.val().length > 0) {
								if(pw2El.next().next('.error').length > 0) pw2El.next().next('.error').removeClass('empty').text(error_str);
								else pw2El.closest('.form-group').append('<span class="error">'+ error_str + '</span>');
							}
						}	
					}

					if(reg_has && errorEL.length > 0) { 

						var reg = new RegExp(reg_pattern);
						if(reg.test($(this).val())) errorEL.remove();
						else {
							if(errorEL.hasClass('empty')) errorEL.removeClass('empty').text(reg_ex);
						}

					}

				}
			});
		},
		showLoginModal: function(sid) {
			// console.log('umember showLoginModal');
			if($('#join-modal').length > 0 ) $('#join-modal').delay(3000).modal('hide');
			if($('#forgotpw-modal').length > 0 ) $('#forgotpw-modal').delay(3000).modal('hide');

			var content = $.umember.makeLoginModalContent();
			$.umember.showMngModal(sid, content, 'login-modal', false,
									function() { $.umember.LoginModalInit(); }, 
									function() { $.umember.loginModalKeyFunc(); }, '', '', '');
		},
		makeLoginModalContent: function() {
			// console.log('umember makeLoginModalContent');
			var s_um = (PAGE_MODE == 'c') ? SITEUM : property.SITEUM,
				join_btn = (s_um == 1) ? '' : '<div class="btn-join siteUM"><span class="join hand">' + $.lang[LANG]['manager.site-um.join.3'] + '</span></div>',
				privacy_type = (LANG == 'ko') ? 'privacy-join' : 'privacy';
	
			var loginModal_html = '\
				<div class="flat-modal mng-login-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['header.login'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<span class="form-group optional initial">\
										<input class="form-control" type="text" id="input-id" placeholder="' + $.lang[LANG]['siteum.login.id'] + '"/>\
										<label for="input-id">\
											<i class="fa fa-asterisk"></i>\
											<span>id</span>\
										</label>\
									</span>\
									<span class="form-group optional initial">\
										<input class="form-control" type="password" id="input-password" placeholder="' + $.lang[LANG]['siteum.login.password'] + '"/>\
										<label for="input-password">\
											<i class="fa fa-asterisk"></i>\
											<span>password</span>\
										</label>\
									</span>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uLogin">' + $.lang[LANG]['manager.site-um.login'] + '</button>\
									' + join_btn + '\
									<p class="modal-change-wrap siteUM"><span class="forgot-pw hand">' + $.lang[LANG]['siteum.forgot.id-pw'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
				';


			return loginModal_html;
		},
		loginModalInit: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var loginModal = $('#login-modal'+mode);

			loginModal.find('.form-group').each(function() {
				$(this).removeClass('focus');
				$(this).find('.error').remove();
				$(this).find('input.form-control').val('');
			});
		},
		loginModalKeyFunc: function(mode) {
			mode = (mode) ? '-' + mode : '';
			var loginModal = $('#login-modal'+mode);

			loginModal.find('input.form-control').live({
				focus:   function(e) { $(this).closest('.form-group').addClass('focus').siblings().removeClass('focus'); }, 
				blur: 	 function(e) { $(this).closest('.form-group').removeClass('focus'); },
				keydown: function(e) { 
					if($('.dsgn-body').hasClass('mobile-nav-active')) $('.el-menu header.navbar-fheader .navbar-toggle').click();
					if(e.keyCode == 13) $('#uLogin').click(); 
				},
				keyup: function(e) {
					var groupEl = $(this).closest('.form-group'),
						errorEL = $(this).next().next('.error');
					if($(this).val().length > 0) errorEL.remove();
				}
			});
		},
		showForgotIDModal: function(sid) {
			if($('#forgotpw-modal').length > 0 ) $('#forgotpw-modal').delay(3000).modal('hide');

			var content = $.umember.makeForgotIDModalContent();
			$.umember.showMngModal(sid, content, 'forgotid-modal', false, function() {
					$('#forgotid-modal').find('.error').remove();
					$('#forgotid-modal').find('input.form-control').val('');
					$('#forgotid-modal .modal-body').children().removeAttr('style');
					$('#forgotid-modal .modal-footer').children('button').removeAttr('style');
					$('#forgotid-modal').find('.forgot-id-result').text('');
				}, function() {
					$('#forgotid-modal').find('input.form-control').live({
						keydown: function(key) { if(key.keyCode == 13) $('#uForgotID').click(); },
						keyup: function() {
							$('#forgotid-modal .modal-body').children().removeAttr('style');
							$('#forgotid-modal .modal-footer').children('button').removeAttr('style');
							$('#forgotid-modal').find('.forgot-id-result').text('');
							var regexp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
								errorEL = $(this).closest('.form-group').find('.error');

							if(!regexp.test($(this).val())) errorEL.text($.lang[LANG]['siteum.regexp.check.email']);
							else errorEL.remove();
						}
					});
				}, '', '', '');
		},
		makeForgotIDModalContent: function() {
			var forgotIDModal_html = '\
				<div class="flat-modal mng-forgotid-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="forgotid-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['siteum.forgot.id.link'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<div>' + $.lang[LANG]['siteum.forgot.id.description'] + '</div>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-email" placeholder="' + $.lang[LANG]['siteum.forgot.pw.input-email'] + '"/>\
									</span>\
									<div class="forgot-id-result"></div>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uForgotID">' + $.lang[LANG]['siteum.forgot.id.btn'] + '</button>\
									<p class="modal-change-wrap siteUM"> <span class="forgot-pw hand">' + $.lang[LANG]['siteum.forgot.pw.link'] + '</span></p>\
									<p class="modal-change-wrap siteUM"> <span class="login hand">' + $.lang[LANG]['manager.site-um.login'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			return forgotIDModal_html;
		},
		showForgotPWModal: function(sid) {
			if($('#login-modal').length > 0 ) $('#login-modal').delay(3000).modal('hide');
			if($('#forgotid-modal').length > 0 ) $('#forgotid-modal').delay(3000).modal('hide');

			var content = $.umember.makeForgotPWModalContent();
			$.umember.showMngModal(sid, content, 'forgotpw-modal', false, function() {
					$('#forgotpw-modal').find('.focus').removeClass('focus');
					$('#forgotpw-modal').find('.error').remove();
					$('#forgotpw-modal').find('input.form-control').val('');
				}, function() {
					$('#forgotpw-modal').find('input.form-control').live({
						foucs: function() { $(this).closest('.form-group').addClass('focus').siblings().removeClass('focus'); },
						blur: function() { $(this).closest('.form-group').removeClass('focus'); },
						keydown: function(key) { if(key.keyCode == 13) $('#uForgotPW').click(); },
						keyup: function() { 
							var regexp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
								field = $(this).attr('id').trim().replace(/input-/,''),
								errorEL = $(this).closest('.form-group').find('.error');

							if(field == 'email' && !regexp.test($(this).val())) errorEL.text($.lang[LANG]['siteum.regexp.check.email']);
							else errorEL.remove();
						}
					});
				}, '', '', '');
		},
		makeForgotPWModalContent: function() {
			var forgotPWModal_html = '\
				<div class="flat-modal mng-forgotpw-modal mng-siteUM-modal">\
					<div class="modal modal-default fade" id="forgotpw-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
						<div class="modal-dialog" role="document">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
										<span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-siteUM-modal.png" alt="close"></span>\
									</button>\
									<h5 class="modal-title" id="exampleModalLabel">' + $.lang[LANG]['siteum.forgot.pw.title'] + '</h5>\
								</div>\
								<div class="modal-body">\
									<div>' + $.lang[LANG]['siteum.forgot.pw.description'] + '</div>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-id" placeholder="' + $.lang[LANG]['manager.list.info.id'] + '"/>\
									</span>\
									<span class="form-group">\
										<input class="form-control" type="text" id="input-email" placeholder="' + $.lang[LANG]['siteum.forgot.pw.input-email'] + '"/>\
									</span>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-primary" id="uForgotPW">' + $.lang[LANG]['siteum.forgot.pw.btn'] + '</button>\
									<p class="modal-change-wrap siteUM"> <span class="forgot-id hand">' + $.lang[LANG]['siteum.forgot.id.link'] + '</span></p>\
									<p class="modal-change-wrap siteUM"> <span class="login hand">' + $.lang[LANG]['manager.site-um.login'] + '</span></p>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			return forgotPWModal_html;
		},
		showMypageModal: function(sid) {
			if($('.mng-siteUM-modal').length > 0 ) $('.mng-siteUM-modal').children().first().modal('hide');

			$.getJSON('/umember/get/type/mypage', function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}
				// COLLECTION_REGEX = $.parseJSON(data['regExp']);
				COLLECTION_REGEX = data['regExp'];

				var content = $.umember.makeMypageContent(sid,data,'');
				$('body').find('.dsgn-body').append('<link rel="stylesheet" href="/css/manager.css" type="text/css" class="manager_css">');
				$.umember.showMngModal(sid, content, 'mypage-modal', false,
										function() { }, 
										function() { }, 
										function() { $('body .dsgn-body').find('link.manager_css').remove(); }, '', '');
			});
		},
		makeMypageConditionsStr: function(sid,data,mode,cert) {
			if(typeof cert === 'undefined' || !cert) cert = 'N';

			var collections = '',
				make_pass = ['sid', 'no', 'id', 'image', 'regExp', 'cert', 'cert_date', 'cert_adult', 'cert_adult_date'];
				
			$.each(data, function(field,o) {
				if (field != 'um_sns_key') {
					if($.inArray(field,make_pass) == -1) {
						var name = (o['name']) ? o['name'] : $.lang[LANG]['manager.list.info.'+field],
							optional = (o['optional']) ? o['optional'] : false,
							optional_class = (optional) ? 'optional' : '',
							prev_val = (field == 'email' || field == 'nick') ? 'data-prev="' + o['value'] + '"' : '',
							etc_val_type = ['memo','radio','check','select'],
							cl_val_str = '',
							add_input = '',
							jcollection_val_str = '';

						var star = (optional) ? '<span class="input-star">*</span>' : '';
				
						if(field.indexOf('etc')>-1 && etc_val_type.includes(o['type'])) {
							var o_val = o['value'],
								o_val_arr = ((o['jcol_val'].indexOf('`') > -1) && (o['type']=='radio' || o['type']=='check' || o['type']=='select')) ? o['jcol_val'].split('`') : [o_val],
								description_class = (o['description_used']=='true' && (o['type']=='memo')) ? 'use_descr' : '';

							add_input = '\
							<div class="cl-s-join-collections-etcwrap cl-s-form-wrap ' + optional_class + '" data-jcoltype="'+o['type']+'">';

													
							var text_class = (o_val && (o['type']=='memo')) ? 'textarea-active' : '';
							add_input += '\
								<div class="cl-s-etc '+text_class+'">\
									<span class="cl-s-etc-name">'+ name + star +'</span>\
									';
							add_input += (o['description_used']=='true') ? '<span class="cl-s-etc-description">'+ o['description'] +'</span>' : '';
							add_input += '\
								</div>\
								';

							add_input += '\
								<div class="cl-s-etc-val '+description_class+'">\
							';

							if(o['type']=='select') {
								add_input += '\
								<div class="cl-s-form-group cl-s-form-group-select">\
									<select class="cl-s-form-control" name="'+field+'" id="input-' + field + '" required="required">\
										<option value="">'+$.lang[LANG]['manager.list.info.gender.select']+'</option>\
								';
							} 

							if(o_val_arr.length > 0) {
								$.each(o_val_arr, function(oval_i,oval_v){			
									jcollection_val_str += $.umember.makeJoinCollectionsTypeVal(oval_i,o['type'],oval_v,field,optional_class,'mypage',o_val);
								});
							} 

							if(o['type']=='select') {
								jcollection_val_str += '\
									</select>\
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
								</div>\
								';
							}
							jcollection_val_str += '</div></div>';
							
						} else {
							add_input += '\
							<div class="cl-s-form-wrap ' + optional_class + '">\
								<div class="cl-s-form-group">\
									<input type="text" class="cl-s-form-control" name="'+field+'" id="input-' + field + '" required="required" value="' + o['value'] + '" ' + prev_val + '>\
									<label for="input" class="cl-s-control-label">' + name + star + '</label>\
								</div>\
							</div>\
						';
						
						}
						if(field == 'birth') {
							var birth = (o['name']) ? o['name'] : $.lang[LANG]['manager.list.info.'+field];

							add_input = '\
								<div class="cl-s-form-wrap ' + optional_class + '">\
									<div class="cl-s-form-group">\
										<input type="text" class="cl-s-form-control cl-s-form-birth" name="'+field+'" id="input-' + field + '" required="required" value="' + o['value'] + '" onkeyup="auto_date_format(event, this)" onkeypress="auto_date_format(event, this)">\
										<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.mypage.Birth'] + star + ' </label>\
									</div>\
								</div>\
							';
						} else if(field == 'addr') {
							var o_postcode = (o['value'][0]) ? o['value'][0].trim() : '',
								o_addr1 = (o['value'][1]) ? o['value'][1].trim() : '',
								o_addr2 = (o['value'][2]) ? o['value'][2].trim() : '',
								addr_has_clas = (o_postcode || o_addr1) ? 'has-value' : '',
								addr_modal = (mode == 'shopping' || o['addrsearch']) ? 'readonly onfocus="addrSearchModal(\'input\')" ' : '';

							add_input = '\
									<div class="cl-s-form-wrap ' + optional_class + '">\
										<div class="cl-s-form-group">\
											<input type="hidden" class="cl-s-form-control" name="postcode" id="input-postcode" value="' + o_postcode + '">\
											<input type="text" class="cl-s-form-control '+addr_has_clas+'" name="addr1" id="input-addr1" required="required" value="' + o_addr1 + '" ' + addr_modal + '>\
											<label for="input" class="cl-s-control-label">' + name + star + '</label>\
										</div>\
									</div>\
									<div class="cl-s-form-wrap">\
										<div class="cl-s-form-group">\
											<input type="text" class="cl-s-form-control" name="addr2" id="input-addr2" required="required" value="' + o_addr2 + '">\
											<label for="input" class="cl-s-control-label">' + $.lang[LANG]['manager.list.info.addr2'] + '</label>\
										</div>\
									</div>\
							';
						} else if(field == 'gender') {
							add_input = '\
									<div class="cl-s-form-wrap ' + optional_class + '">\
										<div class="cl-s-form-group">\
											<select class="cl-s-form-control" name="gender" id="input-gender" required="required">\
												<option value="">선택</option>';
							if(o['value'] == '01') {
								add_input += '\
												<option value="01" selected>남</option>\
												<option value="02">여</option>';
							} else if(o['value'] == '02') {
								add_input += '\
												<option value="01">남</option>\
												<option value="02" selected>여</option>';
							} else {
								add_input += '\
												<option value="01">남</option>\
												<option value="02">여</option>';
							}
							add_input += '\
											</select>\
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
											<label for="input" class="cl-s-control-label">' + name + star +'</label>\
										</div>\
									</div>\
							';
						}

						if(cert == 'Y') {
							switch (field) {
								case 'name':
								case 'gender':
								case 'birth':
								case 'tel':
									var value = (o['value'])? o['value']:'';
									add_input = '<input id="input-' + field + '" type="hidden" name="' + field + '" value="' + value + '">';
									break;
							}
						}
						
						collections += add_input + jcollection_val_str;

					}
				}
			});
			return collections;
		},

		makeMypageContent: function(sid,data,mode,cert) {
			if(typeof cert === 'undefined' || !cert) cert = 'N';
			
			var collections = $.umember.makeMypageConditionsStr(sid,data,mode,cert),
				s_validtype = (typeof VALIDTYPE != 'undefined') ? VALIDTYPE : property.VALIDTYPE;

			var default_info = '\
				<div class="profile-wrap cl-s-profile-box col-xs-12 col-sm-12 col-md-12 no-padding">\
					<div class="profile-image-wrap profile-image-box">\
						<svg viewBox="0 0 110 110">\
							<pattern id="profileMyImg" patternUnits="userSpaceOnUse" width="110" height="110">\
								<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + data['image'] + '" x="0" width="110" height="110"></image>\
							</pattern>\
							<circle cx="55" cy="56" r="54" fill="url(#profileMyImg)" stroke="#ededed"></circle>\
						</svg>\
					</div>\
					<div class="profile-text-wrap">\
						<div class="cl-s-form-wrap cl-s-info-id" disabled>\
							<input type="hidden" class="cl-s-form-control" name="id" id="input-id" required="required" value="' + data['id']['value'] + '">\
							<span class="id-text">' + data['id']['value'] + '</span>\
						</div>\
						<label for="profileMyImgFileupload">' + $.lang[LANG]['siteum.mypage.change.image'] + '</label>\
						<input id="profileMyImgFileupload" class="modal-upload-button um-image-upload" type="file" name="files[]" data-sid="' + sid + '" data-uid="' + data['id']['value'] + '" />\
						<p class="cl-s-image-size">' + $.lang[LANG]['manager.mypage.profile.image.note'] + ' ' + $.lang[LANG]['manager.mypage.profile.image.size'] + '</p>\
					</div>\
				</div>\
				<div class="clearfix"></div>\
				';

			var content = '\
				<div class="cl-s-form-wrap">\
					<div class="cl-s-form-group">\
						<input type="password" class="cl-s-form-control" name="password" id="input-password" required="required" value="">\
						<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.login.password.myinfo'] + '</label>\
					</div>\
				</div>\
				<div class="cl-s-form-wrap">\
					<div class="cl-s-form-group">\
						<input type="password" class="cl-s-form-control" name="password_checked" id="input-password-checked" required="required" value="">\
						<label for="input" class="cl-s-control-label">' + $.lang[LANG]['siteum.login.password-check'] + '</label>\
					</div>\
				</div>\
				<div class="cl-s-form-description">' + $.lang[LANG]['siteum.login.password.description'] + '</div>\
			';

			return { content: content, collections: collections, default_info: default_info };
		},
		showMyImageUploadModal: function(sid,uid,src) {
			var content = '\
				<div class="flat-modal mng-mypage-modal">\
					<div class="modal modal-default fade" id="my-image-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" data-sid="' + sid + '" data-uid="' + uid + '">\
						<div class="modal-dialog w385">\
							<div class="modal-content">\
								<button type="" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="https://storage.googleapis.com/i.addblock.net/fa-close-modal.png" alt="close"></span></button>\
								<div class="modal-body">\
									<div class="profile-image-wrap no-opacity">\
										<div>\
											<span class="top"></span>\
											<span class="bottom"></span>\
										</div>\
										<img class="my-image img-responsive" src="' + src + '" alt="profile image" />\
									</div>\
									<p>' + $.lang[LANG]['manager.mypage.profile.image.note'] + ' <strong>' + $.lang[LANG]['manager.mypage.profile.image.size'] + '</strong></p>\
								</div>\
								<div id="progress" class="progress">\
									<div class="progress-bar progress-bar-success"></div>\
								</div>\
								<div class="modal-footer">\
									<button type="button" class="btn btn-default" data-dismiss="modal">' + $.lang[LANG]['config.close'] + '</button>\
									<span class="btn btn-primary fileinput-button">\
										<span>' + $.lang[LANG]['manager.mypage.profile.image.apply'] + '</span>\
										<input id="profileUMFileupload" class="modal-upload-button um-image-upload" type="file" name="files[]" data-sid="' + sid + '" data-uid="' + uid + '" >\
									</span>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			';

			$.umember.showMngModal(sid, content, 'my-image-modal', false, '', '', '', '', '');				
		}
	} /*umember end*/

	// $.fixbtnConfig = {
	// 	html: function(e){
	// 		// console.log('fixbtnConfig html');

	// 		var $this = ($('.siteLANG').has(e.target).length || $(e.target).hasClass('siteLANG')) ? $('.el-menu .siteLANG') : $(e.target),
	// 			fixbtnPosition = $.fixbtnConfig.position($this),
	// 			checkSidebar = ($('.navbar-fheader').hasClass('sidebar')) ? true : false,
	// 			fh_type = $('header.navbar[data-fixtype]').attr('data-fh-type'),	
	// 			fixtypeNum = $('header.navbar').attr('data-fixtype').replace(/(top|sidebar)\_/gi,''),		
	// 			fixtypeArr = ['01','02','03','08'],
	// 			edit_html = '<div class="fixbtn_wrap"><span class="fixbtn_edit">' + clSVG('block-config',15,15) + '</span></div>',
	// 			checktarget = $.fixbtnConfig.checkTarget($this);
				
	// 		if(checktarget.indexOf('FixedMenu')>-1) {
	// 			if(checkSidebar) $('.navbar-fheader[data-fixtype] .cl-fixed-menu').prepend(edit_html);
	// 			else $('.navbar-fheader[data-fixtype] .cl-fixed-menu').before(edit_html);
	// 		} else {
	// 			$('.element [data-fixtype^="sidebar_"] .siteLANG.cl-fixbtn').prepend(edit_html);
	// 		}
			
	// 		$('.fixbtn_wrap').css('left',fixbtnPosition.left+'px');
			
	// 		if(checkSidebar && $.inArray(fixtypeNum, fixtypeArr) > -1) $('.fixbtn_wrap').css('top',fixbtnPosition.top+'px');
	// 		if(!checkSidebar) $('.fixbtn_wrap').css('height',fixbtnPosition.height+'px');
	// 		if(!checkSidebar && (fh_type=='top')) $('header.navbar[data-fixtype]').find('.cl-fixed-menu').css('padding-left','50px');
	// 	},
	// 	position: function($this){
	// 		// console.log('fixbtnConfig position');
	// 	    if((window.innerWidth < 769 && typeof MODE == 'undefined')) return false; 
	// 	    var height_arr = {},
	// 	    	fh_type = ($('c').attr('data-fh-type')) ? $('header.navbar[data-fixtype]').attr('data-fh-type') : 'top',
	// 	    	fixtextalign = ($('header.navbar[data-fixtype]').attr('data-fixtextalign')) ? $('header.navbar[data-fixtype]').attr('data-fixtextalign') : 'center',
	// 	        fixtypeNum = $('header.navbar').attr('data-fixtype').replace(/(top|sidebar)\_/gi,''),
	// 	        fixtypeArr = ['01','02','03','08'],
	// 	        checkSlang = ($('.cl-fixbtn.siteLANG').length > 0) ? true : false,
	// 	        checkFixedMenu = ($('.cl-fixed-menu').length > 0) ? true : false,
	// 	        checkSidebar = ($('.navbar-fheader').hasClass('sidebar')) ? true : false,
	// 	        checktarget = $.fixbtnConfig.checkTarget($this);

	// 			$this = (checktarget.indexOf('FixedMenu')>-1) ? $('.element header.navbar[data-fixtype] .cl-fixed-menu') : $('.element [data-fixtype^="sidebar_"] .siteLANG.cl-fixbtn');

	// 	    var $cl_fixbtn = ($('header.navbar[data-fixtype] .cl-fixed-menu .cl-fixbtn.cl-visible').length>0) ? $('header.navbar[data-fixtype] .cl-fixed-menu .cl-fixbtn.cl-visible') : '',
	// 	    	width_val = ($cl_fixbtn) ? $cl_fixbtn.width() : 0,
    //             clfixbtn_eq = (fixtextalign=='left' && checkSidebar && !$this.hasClass('siteLANG')) ? ($cl_fixbtn ? $cl_fixbtn.last() : $cl_fixbtn.first()) : ($this.hasClass('siteLANG') ? '' : $cl_fixbtn.first()),
    //             $selector = $this.hasClass('siteLANG') ? $this.find('.cl-lang').offset().left.toFixed(0) : 
	// 	        			( $cl_fixbtn ? ((clfixbtn_eq.find('> a:visible').length>0) ? clfixbtn_eq.find('> a:visible').offset().left.toFixed(0) : 0) : 0),
	//    			leftPosCal = (checkSidebar) ? 50 : 47,
	// 	        top_cal = '';

	//    			$selector = Number($selector);

   	// 		//사이드바 세로디자인 확장기능버튼(01,02,03,08) => a 태그 width 최대값 구하기
   	// 		if(checkSidebar && ($.inArray(fixtypeNum, fixtypeArr) > -1) && !$this.hasClass('siteLANG')) {  
	//         	var width_arr = [],
	//         		selector_arr = [];

    //             $cl_fixbtn.find('> a:visible').each(function(){
    //             	var w_val = $(this).width();
    //             	if(!top_cal) top_cal = Number(($(this).parents('li.cl-fixbtn.cl-visible').height() - 25) / 2);
            
    //             	width_arr.push(w_val);
    //             	selector_arr.push($(this));
    //             });

    //             var w_max = Math.max(...width_arr),
    //             	w_index = width_arr.indexOf(w_max);
	
    //         	$selector = Number($(selector_arr[w_index]).offset().left.toFixed(0));      
            	     	
    //         	width_val = w_max;
    //         } 
          	
    //         var fixed_left = ($this.hasClass('siteLANG')) ? ((fixtextalign=='left') ? $selector+$this.find('.cl-lang').width()-3 : $selector-47) : ((fixtextalign=='left' && checkSidebar) ? $selector+width_val : $selector-leftPosCal),
	// 	        fixed_height = ($this.height() < 15) ? 45 : (fh_type=='right' ? $('header.navbar[data-fixtype]').find('#tpl-menu li').height() + 1 : $('header.navbar[data-fixtype]').find('#fixed-menu').height());
	       
	// 	    height_arr = {
	// 	        'left' : fixed_left,
	// 	        'height' : fixed_height,
	// 	        'top' : top_cal
	// 	    }

	// 	    return height_arr;
	// 	},
	// 	checkTarget : function($this) {
	// 		// console.log('fixbtnConfig checkTarget');
	// 		var checkTarget = '',
	// 			checkSidebar = ($('.navbar-fheader').hasClass('sidebar')) ? true : false;

	// 		if(checkSidebar) {
	// 	    	checkTarget = ($this.has($('.siteLANG')).length>0 || $this.hasClass('siteLANG')) ? 'sidebarSiteLang' : 'sidebarFixedMenu';
	// 	    } else {	
	// 	    	checkTarget = 'topFixedMenu'
	// 	    }

	// 	    return checkTarget;
	// 	}
	// }

	var setLoginLogoutAttribute = function(check_login,nav,display) {
		if(!check_login) {
			nav.find('.siteUM').removeClass('dropdown').find('.cl-login').show().removeClass(display).addClass(display);
			nav.find('.siteUM').find('.cl-logout').hide();
		} else {
			nav.find('.siteUM').find('.cl-login').hide();				
			nav.find('.siteUM').find('.cl-logout').show();
			nav.find('.siteUM').find('.dropdown-menu').remove();
		}
	}

	var getJoinCollectionsList = function(sid) {
		var returnHtml = '';
		$.ajax({
			url: '/umember/collections',
			type: 'post',
			data: { sid : sid },
			dataType: 'html',
			success: function (list_html) {
				// $('.order-list-area').html(list_html);
				returnHtml += list_html;
			}, error: function () {
	
			}, complete: function () {
				// $.processOFF();
			}
		});
	   
		return returnHtml;
	}	
	
	/***********************************************************************************************************************************member-config page START*/
	var activePrev = $('#join-activate').selectpicker('val');
	$('#join-activate, #join-language, #join-approval, #join-display, #join-captcha').live('change', function () {
		var key = $(this).attr('id').replace(/join-/gi,''),
			val = ($(this).is('select')) ? $(this).val() : $(this).prop('checked');

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid : SID, key : key, val : val },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}
				if(data.cert_use !== undefined && data.cert_use) {
					$('#join-activate').selectpicker('val', activePrev);
		            var modal_str = $.lang[LANG]['manager.cert.disable.option.txt'];
		            $(this).showModalFlat($.lang[LANG]['manager.cert.disable.option'], modal_str,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-okbtn-pbt70 site-umember-modal');
		            return false;
				}
				activePrev = val;

				if(val == '0') {
					$('#section-top-menu li').addClass('disabled-cert');
				} else {
					$('#section-top-menu li').removeClass('disabled-cert');
				}
			}
		});
	});

	$('.mng-settings[data-type="collection"] .collection-item-used, .mng-settings[data-type="collection"] .collection-item-optional').live('click', function() {
		if($(this).closest('.checkboxs').hasClass('disabled')) {
			var modal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.required.message'], true, false, '', 'ok');
			return false;
		}
		
		var cl_val = $(this).prop('checked'),
			item_seq = $(this).parents('.collection-item').attr('data-seq'),
			jcol_name = $(this).parents('.collection-item').find('.collection-name').text(),
			update_data = {},
			jcol_data = {},
			d_index = 0,
			check_class = $(this).attr('class').replace(/collection-item-/gi,'');

		check_class = (check_class=='optional') ? 'require' : check_class;
				
		jcol_data[0] = {
			seq : item_seq,
			[check_class] : cl_val.toString()
		}
		
		$.ajax({
			type: 'POST',
			url: '/umember/setJoinCollections/type/jcol_update',
			data: { sid: SID, update_data: jcol_data },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}

				var slog_val = check_class+'.'+cl_val.toString(),
					slog_field = {'field_name':jcol_name};
				setSiteLogs('um.config.collection.new',slog_val,slog_field,'um.config.collection.new');
			},
			complete: function () {
				$.processOFF();
			}
		});
	});
	
	$('.cl-s-join-collections-etcwrap[data-jcoltype="memo"] textarea').live({
		focus : function(e){
			$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').addClass('etc-mouseEnter');
			if($(this).val()) {
				$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('textarea-active').addClass('textarea-active');
			} else {
				$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('textarea-active');
			}
		},
		focusout : function(e) {
			$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('etc-mouseEnter');
			$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('textarea-active-text').addClass('textarea-active-text');
			if($(this).val()) {
				$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('textarea-active').addClass('textarea-active');
			} else {
				$(this).parents('.cl-s-join-collections-etcwrap').find('.cl-s-etc').removeClass('textarea-active');
			}
		}
		
	});

	$('.mng-member .mng-settings[data-type="collection"] .collection-add').live('click',function() {

		if($('.mng-member .collection-content').find('.collection-item.additem').length>0) {
			return false;
		}
		// if($('.mng-member .collection-content').find('.collection-update').length>0) {
		// 	$('.mng-member .collection-content .collection-update').find('input').focus();
		// 	return false;
		// }
	
		if($('.mng-member .collection-content').find('.collection-item').length==15) $(this).hide();
		if($('.mng-member .collection-content').find('.collection-item').length>16) {
			var modal = $(this).showModalFlat('DELETE FIELD', $.lang[LANG]['manager.join.cl.item.max-add'], true, false, '', 'ok');
			return false;
		}

		var cl_etc_arr = $('.mng-member .collection-content .collection-item').map(function() { 
							var cl_type = $(this).attr('data-type');
							if(cl_type.match(/^etc/)) return cl_type.replace('etc','');
						}).get().sort(),
			cl_etc = $('.collection-content .collection-item').length-6;

		for (var i = 0; i < 10; i++) {
			if(typeof cl_etc_arr[i] == 'undefined' || parseInt(cl_etc_arr[i]) != (i+1) ) {
				cl_etc = i+1; 
				break;
			}
		}

		var str = collectionItem('',cl_etc);
		
        $('.mng-member .collection-content').append(str)
		
		
		$('.mng-member .collection-content').find('.collection-item[data-etc="' + cl_etc + '"] .collection-edit').click();
		$('.collection-type-selectbox select[name="jcollection-select-type"]').selectpicker();		
		
		$('.collection-item.additem').find('.collection-config').removeClass('hide').addClass('hide');
		collectionSortable('.mng-member .collection-item');
		
	});


	

    $('.mng-member .mng-settings[data-type="collection"] .collection-edit').live('click', function() {
		if($('.mng-member .collection-content').find('.collection-update').length > 0 ) {
			return false;
		}
		var selectCl = $(this).closest('.collection-item'),
			cl_name = selectCl.find('.collection-name').text(),
			input_text = addCollectionInput(cl_name);

		selectCl.removeClass('collection-status-edit').addClass('collection-status-edit');
		$('.mng-member .collection-content').removeClass('collection-status-disabled').addClass('collection-status-disabled');
		$(this).parents('.collection-item').siblings().find('.collection-config > .icons').removeClass('hide').addClass('hide');
		// $(input_text).prependTo(selectCl.find('.collection-info'));
		// $(input_text).prependTo(selectCl);

		// $(this).parents('.collection-item').find('.collection-info .collection-name').hide();
		// $('.mng-member .collection-content').find('.collection-item').css('pointer-events','none');
		// $('.mng-member .collection-content').find('.collection-update-cancel, .collection-update-save, .collection-update-name').css('pointer-events','auto');
		// $('.mng-member .collection-update .collection-update-name').focus();
		$('#join-collections,#mjoin-collections').sortable({cancel: '.collection-item' });
	});

	$('.mng-member .mng-settings[data-type="collection"] .collection-delete').live('click', function() {
		var selectCl = $(this).closest('.collection-item'),
			cl_etc = (typeof selectCl.attr('data-etc') != 'undefined' && selectCl.attr('data-etc')) ? selectCl.attr('data-etc') : '',
			cl_field = 'etc' + cl_etc,
			cl_name = selectCl.find('.collection-name').text(),
			item_seq = $(this).parents('.collection-item').attr('data-seq');

		var del_modal = $(this).showModalFlat($.lang[LANG]['manager.join.cl.item.delete.title'], $.lang[LANG]['manager.join.cl.item.delete'], true, true, function() {
			selectCl.addClass('delete_item');

			$.processON();

			$.ajax({
				type: 'POST',
				url: '/umember/setJoinCollections/type/jcol_delete',
				data: { sid: SID, d_seq : item_seq },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						alert(data.error);
						return false;
					}
			
					$('.mng-member .collection-content').find('.collection-item[data-etc="'+cl_etc+'"]').remove();
					if($('.mng-member .collection-content').find('.collection-item').length<16) {
						$('.mng-member .collection-add').show();
					}
					
					del_modal.modal('hide');

					setSiteLogs('um.config.collection','delete',{'field_name':cl_name,'field':cl_field},'um.config.collection');

				},
				complete: function () {
					$.processOFF();
				}
			});
		}, 'cancel',$.lang[LANG]['manager.join.cl.item.delete.btn.delete'],'cl-cmmodal cl-s-btn w560 cl-p130 cl-p0');
	});


	$('.mng-member .mng-settings[data-type="collection"] .collection-update-cancel').live('click', function() {
		if($('.mng-member .collection-content').find('.collection-item').length<16) $('.mng-member .collection-add').show();
		if(!$(this).closest('.collection-item').find('.collection-name').text()) {
			$(this).closest('.collection-item').remove();
		}
		$(this).parents('.collection-item').find('.collection-info .collection-name').show();
		$('.mng-member .collection-content').find('.config-error').remove();
		$('.mng-member .collection-content').find('.collection-item').removeAttr('style');
		$(this).closest('.collection-update').remove();
		collectionSortable();
	});

	$('.mng-member .collection-update-save').live('click', function(e) {
		var selectCl = $(this).closest('.collection-item'),
			cl_etc = (typeof selectCl.attr('data-etc') != 'undefined' && selectCl.attr('data-etc')) ? selectCl.attr('data-etc') : '',
			cl_field = 'etc' + cl_etc,
			cl_type = selectCl.find('.collection-item-type-select').val(),
			cl_name = selectCl.find('.collection-update-name').val().trim(),
			cl_prev = selectCl.find('.collection-name').text().trim(),
			regexp = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9\# ]+$/i,
			error_str = '';


		$('.collection-content .config-error').remove();
		$(this).parents('.collection-item').find('.collection-info .collection-name').show();

		if(cl_prev == cl_name) {
			if(selectCl.hasClass('additem')) {
				error_str = $.lang[LANG]['manager.join.cl.item.name.enter'];
			} else {
				$('.collection-content').find('.collection-item').removeAttr('style');
				$('.collection-content').find('.collection-update').remove();
				return false;
			}
		}


		if(cl_name.length == 0) error_str = $.lang[LANG]['board.enter-group-name'];
		else if(checkEmojis(cl_name)) error_str = $.lang[LANG]['config.unable.emoji'];
		else if(!regexp.test(cl_name)) error_str = $.lang[LANG]['board.allowed-chars'];
		else if(cl_name.length>20) error_str = $.lang[LANG]['board.enter-max-chars'];
		else if(cl_prev == cl_name) {
			if(selectCl.hasClass('additem')) {
				error_str = $.lang[LANG]['manager.join.cl.item.name.enter'];
			} else {
				$('.collection-content').find('.collection-item').removeAttr('style');
				$('.collection-content').find('.collection-update').remove();
				return false;
			}
		} else {
			var cl_name_list = $('.collection-content').find('.collection-name').map(function() { return $(this).text().trim(); }).get();
			if($.inArray(cl_name,cl_name_list) > -1) {
				error_str = $.lang[LANG]['manager.join.cl.item.name.inuse'];
			}
		}

		if(error_str.length > 0) {
			e.preventDefault();
			$(this).parents('.collection-item').find('.collection-info .collection-name').hide();
			selectCl.append('<div class="config-error collection-edit">' + error_str + '</div>');
			return false;
		}
			
		var collections = {};
		$('.mng-member .collection-content').children('.collection-item').each(function() {
			var field = $(this).attr('data-type'),
				name = (field == cl_field) ? cl_name : $(this).find('.collection-name').text().trim(),
				type = (field == cl_field) ? cl_type : $(this).find('.collection-item-type-select').val(),
				used = $(this).find('.collection-item-used').prop('checked'),
				optional = $(this).find('.collection-item-optional').prop('checked');

			collections[field] = {
				'used'	: used,
				'optional'	: optional,
				'name'	: name,
				'type'	: type
			};
		});
		
		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid: SID, key: 'collections_all', val: JSON.stringify(collections) },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}

				if(selectCl.hasClass('additem')) {
					selectCl.removeClass('additem');
					selectCl.find('#collection-item-used-additem').removeAttr('id').attr('id','collection-item-used-'+cl_field);
					// selectCl.find('label[for="collection-item-used-additem"]').removeAttr('for').attr('for','collection-item-used-'+cl_field);
					selectCl.find('#collection-item-optional-additem').removeAttr('id').attr('id','collection-item-optional-'+cl_field);
					// selectCl.find('label[for="collection-item-optional-additem"]').removeAttr('for').attr('for','collection-item-optional-'+cl_field);
				}
				selectCl.find('.collection-name').text(cl_name);

				$('.collection-content').find('.config-error').remove();
				$('.collection-content').find('.collection-item').removeAttr('style');
				selectCl.find('.collection-update').remove();
				collectionSortable();


				var checkAdd = (cl_prev == '') ? true : false,
					slog_val = (checkAdd) ? 'add' : 'edit',
					slog_field = (checkAdd) ? {'field_name':cl_name,'field':cl_field} : {'field_name':cl_prev,'field':cl_field,'before':cl_prev,'after':cl_name};
				setSiteLogs('um.config.collection',slog_val,slog_field,'um.config.collection');

			}
		});
	});


	$('#config-acces-terms, #config-privacy, #config-privacy-join, #config-privacy-nonmem, #config-description').live('blur', function(e) {
		var blur_id = $(this).attr('id'),
			key = blur_id.replace(/config-/gi,'').replace(/-/gi,'_'),
			val = $(this).val().trim(),
			mng_settings_el = $(this).closest('.mng-settings');

		if(key.charAt(0) == 'm') key = key.substring(1,key.length);

		$.ajax({
			type: 'POST',
			url: '/umember/update/type/condition',
			data: { sid : SID, key : key, val : val },
			dataType: 'json',
			async: true,
			success: function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					alert(data.error);
					return false;
				}
				mngShowToast('check', $.lang[LANG]['manager.check.save.text'] , mng_settings_el);

				if(typeof data.val  != 'undefined' && val == '') {
					$('#'+blur_id).val(data.val);
				}
			}
		});

	});


	/*가입 수집 항목 : type 변경 기능(추후) 사용되는 부분.*/
	$('.mng-settings[data-type="collection"] .collection-toggle').live('click', function() {
	    $(this).closest('.collection-item').toggleClass('item-content-open');
	    if($(this).closest('.collection-item').hasClass('item-content-open')) {
	        $(this).removeClass('fa-angle-down').addClass('fa-angle-up');
	        // $(this).closest('.collection-item').find('.collection-item-content').removeAttr('style');
	    } else {
	        $(this).removeClass('fa-angle-up').addClass('fa-angle-down');
	        // $(this).closest('.collection-item').find('.collection-item-content').css('display','none');
	    }
	});


    $('.mng-siteUM-modal .profile-image-wrap,#my-image-modal .profile-image-wrap').live({
		click: function() {
			var checkFirstStep = ($(this).find('#profileMyImg').length > 0) ? false : true;
			if(checkFirstStep) $('.mng-siteUM-modal .my-image-edit').click();
			else $('#profileUMFileupload').click();
		}
	});

    $('#profileUMFileupload').live({
		click: function() {
			
			var sid = $('#my-image-modal').attr('data-sid'),
				uid = $('#my-image-modal').attr('data-uid');

			$(this).fileupload({
				url: '/umember/update/type/myimage/sid/'+sid+'/uid/'+uid,
				dataType: 'json',
				pasteZone: null,
				async: true,
				add: function(e, data) {
					$('#loading').css('left','-100%');
					$.processON();
					data.submit();
				}, 
				done: function(e, data) {
					if(typeof data.result.error != 'undefined' && data.result.error) {
						alert(data.result.error);
						$('.progress .progress-bar').css('width','0%');
						$.processOFF();
						return;
					}
					if(data.result.src) {
						$('.profile-image-wrap .my-image').prop('src',data.result.src);
						if($('.dashboard._admin_dashboard').length > 0) $('#dashboard-image-top image').attr('xlink:href',data.result.src);
						if($('#mobile-nav').length > 0) $('#mobile-nav .login-profile img').prop('src',data.result.src);
					}
                    $.processOFF();
					$('#loading').css('left','50%');
				},
				progressall: function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('.progress .progress-bar').css(
						'width',
						progress + '%'
					);
				},
			}).prop('disabled', !$.support.fileInput)
				.parent().addClass($.support.fileInput ? undefined : 'disabled');

		}
	});


	$('#uJoin').live('click', function() {
		var joinModal = $('#join-modal'),
			approval = $(this).attr('data-approval'),
			input_data = {};

		if($(this).closest('#join-modal-preview').length != 0) {
			$(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
			return false; 
		}

		joinModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(), 
				optional = $(this).hasClass('optional'),
				empty_class = (optional && val.trim().length == 0) ? 'empty' : '',
				error_str =   (optional && val.trim().length == 0) ? $.lang[LANG]['manager.check.required.message'] : '';

			if(!error_str && val.trim().length > 0) {
				switch(field) {
					case 'password-checked': 
						if(joinModal.find('#input-password').val().trim() != val.trim()) {
							error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];
						}
						break;

					default:
						if(typeof  COLLECTION_REGEX[field] != 'undefined' &&  COLLECTION_REGEX[field]) {
							var pattern = COLLECTION_REGEX[field]['pattern_j'],
								reg = new RegExp(pattern);
							if(!reg.test(val)) error_str = COLLECTION_REGEX[field]['error'];
						}
						break;
				}
			}


			if(error_str.length > 0) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error ' + empty_class + '">' + error_str + '</span>');

				if(joinModal.find('.focus').length == 0) inputEL.focus();
			} else {
				errorEL.remove();
				if(field == 'id') val = val.toLowerCase();
				if(field == 'password') val = hex_md5(val);
				if(field == 'email') val = val.toLowerCase();

				if(field != 'password-checked') input_data[field] = val;
			}

			input_data['wr_key'] = $("#wr_key").val();
		});

		if(!joinModal.find('.kcaptcha-wrap').hasClass('hide')) {
			var captcha = joinModal.find('#wr_key'),
				val = captcha.val(),
				captcha_error = captcha.next('label.error'),
				error_str = '';

			if( val.trim().length == 0 ) {
				error_str = $.lang[LANG]['manager.join.regexp.captcha'];
			} else if( val && (Base64.encode(val.trim()) != md5_norobot_key)) {
				error_str = $.lang[LANG]['manager.join.regexp.captcha.wrong'];
			} 

			if( error_str.length > 0 ) {
				if(captcha_error.length > 0) captcha_error.text(error_str);
				else captcha.after('<label class="error">' +  error_str + '</label>');
				
				if(joinModal.find('.focus').length == 0) captcha.focus();
			} else {
				captcha_error.remove();
			}
		}


		if(joinModal.find('.error').length == 0) {

			var sid = joinModal.attr('data-sid');
			$.post('/umember/join/update', { sid : sid, data : JSON.stringify(input_data) }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(joinModal.find('#input-'+key).length > 0 ) {
							joinModal.find('#input-'+key).focus();
							joinModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
						} else { alert(str,'/manager/member'); return false; }
					});
					if(joinModal.find('.error').length > 0) return false;
				}
				
				if(typeof userSiteJoinCallback == 'function')
			    			userSiteJoinCallback();
			    		
				var okModal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.join.success.'+approval], true, false, '', $.lang[LANG]['config.close']);
				$.umember.joinModalInit();
				joinModal.modal('hide');
			},'json');

		}


	});


	$('.view-join-textarea').live('click', function() {
		var sid = $(this).closest('.modal-default').attr('data-sid'),
			type = $(this).attr('data-type').replace(/-/gi,'_');

		$.post('/umember/get/type/join', { sid : sid, field : type }, function(data) {
			if(typeof data.error != 'undefined' && data.error) {
				alert(data.error);
				return false;
			}

			$('#join-textarea').html(data);
			if($('#join-textarea').css('display') == 'none') $('#join-textarea').fadeIn();

		}, 'json');

	});


	$('#uLogin').live('click', function() {
		var loginModal = $('#login-modal'),
			input_data = {};

		loginModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(),
				error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.'+field+'.input'] : '';

			if(error_str.length > 0 ) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error">' + error_str + '</span>');

				if(loginModal.find('.focus').length == 0) inputEL.focus();
			} else {
				errorEL.remove();
				if(field == 'id') val = val.trim().toLowerCase();
				if(field == 'password') val = hex_md5(val);
				input_data[field] = val;
			}
		});

		if(loginModal.find('.error').length == 0) {

			var sid = loginModal.attr('data-sid');
			$.post('/umember/login/in', { sid : sid, data : JSON.stringify(input_data) }, function(data) {

				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(loginModal.find('#input-'+key).length > 0 ) {
							loginModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
						} else { alert(str,'/manager/member'); return false; }
					});
					if(loginModal.find('.error').length > 0) return false;
				}

				$.umember.loginModalInit();
				$.umember.init();
				loginModal.modal('hide');

				if(data.member.check_login) {
					if(typeof data.ss_url != 'undefined' && data.ss_url) {
						$.each(data.ss_url, function(i,url) {
							$('.dsgn-body').after('<img class="auth-img" src="' + url + '">');
						});
					}

					if(typeof data.ga_uid != 'undefined' && data.ga_uid) {
						localStorage.setItem('googleAnalyticsUID'+sid, data.ga_uid);
					}
				}

				if($('.menu-lock-block').length > 0 || $('.forum-view').length > 0) location.reload(); 
				if($('.element[data-type="latest"]').find('.latest-table-loop').hasClass('latest-table-empty')) location.reload();
				if($('.element[data-type="forum"]').length > 0) {
					if( 
						$('.element[data-type="forum"]').find('.tpl-forum-list-title[data-option="S"]').length > 0 ||
						$('.element[data-type="forum"]').find('.container .table tr > td[colspan="10"]').length > 0 ||
						$('.element[data-type="forum"]').find('.tpl-forum-write:contains(login)').length > 0 
					) location.reload();
				}

				$('.gallery-item').each(function () {
					if ($(this).hasClass('nonePrice')) {
						location.reload();
					}
				});

			},'json');

		}

	});

	$('#uForgotID').live('click', function() {
		var forgotIDModal = $('#forgotid-modal'),
			input_data = '';

		var groupEL = forgotIDModal.find('.form-group'),
			errorEL = groupEL.find('.error'),
			val		= forgotIDModal.find('input.form-control').val(),
			regexp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
			error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.email.input'] : '';
		
		if(error_str.length == 0 &&  !regexp.test(val)) {
			error_str = $.lang[LANG]['siteum.regexp.check.email'];
		}

		if(error_str.length > 0 ) {
			if(errorEL.length > 0) errorEL.text(error_str);
			else groupEL.append('<span class="error">' + error_str + '</span>');
			
			groupEL.find('input').focus();
		} else {
			errorEL.remove();
			input_data = val.toLowerCase();
		}

		if(forgotIDModal.find('.error').length == 0) {

			$.post('/umember/password/forgot', { fn:'id', email:input_data }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(forgotIDModal.find('#input-'+key).length > 0 ) {
							forgotIDModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
							forgotIDModal.find('#input-'+key).focus();
						} else { return false; }
					});
					if(forgotIDModal.find('.error').length > 0) return false;
				}

				forgotIDModal.find('input.form-control').val('');
				var num = ((data.uid.length/3)*2).toFixed(0),
					uid = data.uid.substr(0,num);
				for(var i=0; i<(data.uid.length-num); i++) {
					uid += '*';
				}
				forgotIDModal.find('.modal-body').children(':not(.forgot-id-result)').css({'opacity':0.4});
				forgotIDModal.find('.modal-footer').children('button').css({'opacity':0.4, 'pointer-events':'none'});
				forgotIDModal.find('.modal-body').find('.forgot-id-result').text(uid);

			},'json');

		}

	});

	$('#uForgotPW').live('click', function() {
		var forgotPWModal = $('#forgotpw-modal'),
			input_data = {};

		forgotPWModal.find('.form-group').each(function(i) { 
			var inputEL = $(this).find('input.form-control'),
				errorEL = $(this).find('.error'),
				field 	= inputEL.attr('id').trim().replace(/input-/,''),
				val		= inputEL.val(),
				regexp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
				error_str = (val.trim().length == 0) ? $.lang[LANG]['siteum.regexp.'+field+'.input'] : '';
			
			if(error_str.length == 0 &&  field == 'email' && !regexp.test(val)) {
				error_str = $.lang[LANG]['siteum.regexp.check.email'];
			}

			if(error_str.length > 0 ) {
				if(errorEL.length > 0) errorEL.text(error_str);
				else $(this).append('<span class="error">' + error_str + '</span>');

				if(forgotPWModal.find('.focus').length == 0) inputEL.closest('.form-group').addClass('focus').find('input').focus();
			} else {
				errorEL.remove();
				input_data[field] = val.toLowerCase();
			}
		});

		if(forgotPWModal.find('.error').length == 0) {

			$.post('/umember/password/forgot', { fn:'pw', uid:input_data['id'], email:input_data['email'] }, function(data) {
				if(typeof data.error != 'undefined' && data.error) {
					$.each(data.error, function(key,str) {
						if(forgotPWModal.find('#input-'+key).length > 0 ) {
							forgotPWModal.find('#input-'+key).closest('.form-group').append('<span class="error">' + str + '</span>');
							forgotPWModal.find('#input-'+key).focus();
						} else { return false; }
					});
					if(forgotPWModal.find('.error').length > 0) return false;
				}
				forgotPWModal.find('input.form-control').val('');
				forgotPWModal.modal('hide');

				var modal = $(this).showModalFlat('INFORMATION', data.result, true, false, '', 'ok');
				// var modal = $(this).showModalFlat('INFORMATION', '<h3>이메일 발송 완료!</h3><p>비밀번호 재설정 링크 확인 및 변경을 위한 이메일을 확인하세요.</p>', true, false, '', 'ok');

			},'json');

		}

	});



	/* [Fixed menu link] Click*/
	$(` .siteUM .join, 
		.siteUM .login, 
		.siteUM .logout, 
		.siteUM .forgot-id, 
		.siteUM .forgot-pw, 
		.siteUM .dashboard, 
		.siteUM .mypage, 
		.siteUM-dmenu-wrap .mypage, 
		.siteUM-dmenu-wrap .logout, 
		.cl-fixed-menu#fixed-menu .logout.cl-umMenu,
		.cl-fixnav-item.loginout > a.login,
		.cl-fixnav-item.loginout > a.logout,
		.cl-fixnav-item.loginout .cl-fixsubnav-item .logout
	`).live({
		click: function(e) {
			e.preventDefault();

			if(typeof PAGE_MODE != 'undefined' && PAGE_MODE == 's' && property.SITEFIXEDLANG && property.SITEFIXEDLANG != LANG) {
				LANG = property.SITEFIXEDLANG;
			}
			var sid = (typeof SID != 'undefined' && SID) ? SID : property.SID;


			var possible_page = ['s', 'um'];
			if(typeof PAGE_MODE != 'undefined' && PAGE_MODE && $.inArray(PAGE_MODE,possible_page) == -1) {
				var str = (PAGE_MODE == 'r') ? $.lang[LANG]['manager.check.no-support.render-mode'] : $.lang[LANG]['manager.check.no-support.config-mode'];
				$(this).showModalFlat('INFORMATION',str,true,false,'','ok');
				return false;
			} else {

				var checkUAdminMode = ($('header').hasClass('_admin')) ? true : false,
					s_validtype = (typeof VALIDTYPE != 'undefined' && VALIDTYPE) ? VALIDTYPE : ((typeof property != 'undefined' && property) ? property.VALIDTYPE : ''),
					s_siteum = (typeof SITEUM != 'undefined' && SITEUM) ? SITEUM : ((typeof property != 'undefined' && property) ? property.SITEUM : -1),
					checkShoppingUM = (!checkUAdminMode && s_validtype == 'SM') ? true : false,
					service = (typeof SERVICE == 'undefined') ? ((typeof property == 'undefined') ? '' : property.SERVICE) : SERVICE,
					checkGabia = (service.indexOf('gabia') > -1) ? true : false;

				if($(this).hasClass('join')) {

					var mode = (typeof $(this).attr('data-preview') == 'undefined') ? '' : 'preview';
					if(mode == 'preview') {
						var checkUadmin = ($('.mng-dashboard').hasClass('_admin')) ? true : false,
							check_url = (checkUadmin) ? '/_admin/dashboard/checkDomainConnect' : '/dashboard/checkDomainConnect',
							domains_flag = false;
					    $.ajax({
					        url: check_url,
					        type:'post',
					        dataType:'json',
					        data:{'sid' : SID},
					        success:function(data) {

					        	var domain = sid + '.' + getServiceHost(location.host);
					        	if(data.domains_active_list.length) {
					        		domain = data.domains_active_list[0].zone_domain;
					        	} else if(checkUadmin) {
					        		domain = getServiceHost(location.host);
					        	}
					        	
					        	var http_str = (checkGabia) ? 'http://' : '//';
								window.open(http_str + domain + '/_register/preview', '_blank');
					        }
					    });
					} else {
						location.href = '/_register';
						return false;
					}

					/*
					if(checkShoppingUM) {
						location.href = '/_register';
						return false;
					}

					var mode = (typeof $(this).attr('data-preview') == 'undefined') ? '' : 'preview';
					var joinModal = $.umember.showJoinModal(sid,mode);
					*/
				} else if($(this).hasClass('login')) {

					location.href = (location.port) ? '/_login' : 'https://'+location.host+'/_login';
					return false;
					/*
					if($('#join-modal-preview').length > 0) {
			            $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
						return false;
					}

					if($('header').hasClass('_admin')) { //goto url -> uadmin login page
						if($(this).closest('#join-modal-preview').length >0) {
				            $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok');
							return false;
						}
						if(location.pathname == '/_admin') $('.flat-modal[class*="mng-"] .modal').modal('hide');
						else location.replace('/_admin');
						return false;
					}

					if(checkShoppingUM) {
						location.href = (location.port) ? '/_login' : 'https://'+location.host+'/_login';
						return false;
					}

					if(typeof s_siteum != 'undefined' && s_siteum > 0)  var loginModal = $.umember.showLoginModal(sid);
					else return false;
					*/
				} else if($(this).hasClass('forgot-id')) {
					/*
					var forgotIDModal = $.umember.showForgotIDModal(sid);
					*/
				} else if($(this).hasClass('forgot-pw')) {
					/*
					var forgotPWModal = $.umember.showForgotPWModal(sid);
					*/
				} else if($(this).hasClass('logout')) {
					$.getJSON('/umember/login/out', function(r) {
						if($.cookie('cert_popup') !== undefined) {
							$.removeCookie('cert_popup', true, { path: '/', expires: 12 * 60 * 60 * 1000 });
						}
						
			            if(typeof sid!='undefined' && sid) {
			            	if($.cookie('domainSet-next-'+sid) !== undefined) $.removeCookie('domainSet-next-'+sid, { path: '/' });  
			            }

						var load_url =  (typeof r.url != 'undefined' && r.url) ? r.url : '/';
						if($('header').hasClass('_admin')) location.href = load_url;
						else if(s_validtype == 'SM')  location.href = load_url;
						else location.reload();
					},'json');
				} else if($(this).hasClass('dashboard')) {
					$.getJSON('/umember/goDashboard', function(r) {
						if(typeof r.url != 'undefined' && r.url) location.href = r.url;
					},'json');
				} else if($(this).hasClass('mypage')) {
					if(checkUAdminMode) {
							location.replace('/_myinfo');			
					} else {
						if(s_validtype == 'BN') {
							location.replace('/_mypost');
						} else {
							location.replace('/_mypage');
						}
					}

					return false;
					/*
					if(checkShoppingUM && $(this).attr('href') == 'javascript:;') {
						location.replace('/_mypage');
						return false;
					}

					var mypageModal = $.umember.showMypageModal(sid);
					*/
				}
			}

		}
	});


	/*************************************************************************************************************************************member-config page END*/



	/*************************************************************************************************************************************member-list page START*/
	$('.mng-settings.memberlist[data-type="member-list"] .mng-selectboxlist select.form-control').live('change',function() {
		// var sfl_type = $(this).attr('id').replace('sfl_',''),
		// 	val = $(this).val();
		// location.replace('/manager/member/list/page/1/'+sfl_type+'/'+val);

		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/list' : '/manager/member/list',
			sfl_sort = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_sort').val(),
			sfl_view = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_view').val(),
			stx =  $(this).parents('.mng-list').find('.mng-search-box').find('#stx').val();

		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view);
	});

	$('.mng-settings.memberlist[data-type="member-list"] .mng-search-box .search-btn').live('click',function(e) {
		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/list' : '/manager/member/list',
			sfl_sort = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_sort').val(),
			sfl_view = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_view').val(),
			stx =  $(this).parents('.mng-search-box').find('#stx').val();

		if(checkEmojis(stx)) {
			e.preventDefault();
			errorEmojisModal();
			return false;
		}

		setSiteLogs('um.list','search',{'stx':stx},'um.list');

		if(stx.length > 0) stx = '/stx/'+stx;
		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view+stx);
	});

    $('.mng-settings[data-type="member-list"] .mng-sortBtn').live('click',function() {
    	if ($('.mng-sortBtn').hasClass('active') === true) {
			$('.mng-sortBtn').removeClass('active');
			$('.mng-sortlistWrap').hide();	
    	} else {
			$('.mng-sortBtn').addClass('active');
			$('.mng-sortlistWrap').show();
		}
    });
    
    $('body').click(function(e){
    	if($(e.target).parents('.mng-sortWrap').length==0) {
    		$('.mng-sortBtn').removeClass("active");
			$('.mng-sortlistWrap').hide();
    	}
    });

	$('.member-message-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.message.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.message.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body message-modal">\
				<p class="desc">\
					' + selected_str + '\
				</p>\
				<div class="form-group">\
					<input type="text" class="form-control" id="message-title" placeholder="제목" />\
				</div>\
				<div class="form-group clearfix">\
					<textarea class="form-control" name="" id="message-content" cols="30" rows="2" placeholder="내용"></textarea>\
					<label for="message-content"><span class="write-count">0</span>/1000</label>\
				</div>\
				<div class="form-group">\
					<div class="btn-wrap">\
						<span class="btn btn-xs btn-white"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>파일첨부</span>\
					</div>\
				</div>\
			</div>\
		';

		$('#message-title, #message-content').live('keyup', function() {
			var type = ($(this).attr('id').match(/title/) !== null) ? 'title' : 'content',
				str = $(this).val();

			if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();
			$(this).next('label').find('.write-count').text(str.length);
			if(str.length > 1000 && type == 'content') {
				$(this).val($(this).val().substring(0, 1000));
			}
		});

		var message_modal = $(this).showModalFlat('SEND MESSAGE', modal_content, true, true, function() {
			var message_title = $('#message-title').val(),
				message_content = $('#message-content').val();

			if(message_title.length == 0) {
				$('#message-title').focus();
				$('#message-title').closest('.form-group').append('<div class="mng-error">제목을 입력하세요</div>');
				return false;
			}
			if(message_content.length == 0) {
				$('#message-content').focus();
				$('#message-content').closest('.form-group').append('<div class="mng-error">내용을 입력하세요</div>');
				return false;
			}
			//메시지 전송 기능 작업.

			message_modal.modal('hide');
			mngShowToast('check', '전송 완료', mng_settings_el);

		}, 'cancel', 'send', 'w480');
	});




	/*$('.member-sms-btn').live('click', function() {
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var others_str = (check_data.count<1) ? '' : ' 외 <span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">' + check_data.count + '</span> 명';
		var modal_content = '\
			<div class="mng-modal-body sms-modal">\
				<p class="desc">\
					<span class="addressee-name">' + check_data.name + '</span> \
					' + others_str + ' 에게 SMS를 보냅니다.\
				</p>\
				<div class="sms-recharge-btn-wrap">\
					<div>잔여 SMS <span class="sms-count point">8</span>건 </div>\
					<span class="sms-recharge-btn btn btn-xs btn-white">충전하기</span>\
				</div>\
				<div class="form-group">\
					<input type="text" class="form-control" id="sms-title" placeholder="보내는 번호" />\
				</div>\
				<div class="form-group clearfix">\
					<textarea class="form-control" name="" id="sms-content" cols="30" rows="2" placeholder="내용"></textarea>\
					<label for="sms-content"><span class="write-count">0</span>/90 Byte</label>\
					<span class="info">90바이트가 초과될 경우 MS로 전환되어 3건의 SMS가 차감됩니다.</span>\
				</div>\
				<div class="form-group clearfix">\
					<div class="btn-wrap pull-left">\
						<span class="btn btn-xs btn-white"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>파일첨부</span>\
					</div>\
					<div class="precautions pull-right">\
						<span data-toggle="tooltip" data-placement="right" data-html="true" data-original-title="' + $.lang[LANG]['manager.list.sms.precautions'] + '"><i class="fa fa-info-circle"></i> 광고성 SMS 전송 시 주의사항</span>\
					</div>\
				</div>\
			</div>\
		';

		$('#sms-title, #sms-content').live('keyup', function() {
			var type = ($(this).attr('id').match(/title/) !== null) ? 'title' : 'content',
				str = $(this).val(),
				str_len = $(this).val().length,
				cbyte = 0,
				clen = 0,
				maxInputByte = 90;

			if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();

			if(type == 'content') {
				for(var i=0; i<str_len; i++) {
					var is_one_char = $(this).val().charAt(i);
					if(escape(is_one_char).length > 4) {
						cbyte += 2; //korean 1 char == 2byte
					} else {
						cbyte++;
					}

					if(cbyte <= maxInputByte) {
						clen = i + 1;
					}
				}
				$(this).next('label').find('.write-count').text(parseInt(cbyte));
				if(parseInt(cbyte) > parseInt(maxInputByte)) {
					$(this).val($(this).val().substring(0, clen));
					$(this).next('label').find('.write-count').text(parseInt(maxInputByte));
				}
			}
		});

		var sms_modal = $(this).showModalFlat('SEND SMS', modal_content, true, true, function() {
			var sms_title = $('#sms-title').val(),
				sms_content = $('#sms-content').val();

			if(sms_title.length == 0) {
				$('#sms-title').focus();
				$('#sms-title').closest('.form-group').append('<div class="mng-error">보내실 번호를 입력하세요</div>');
				return false;
			}
			if(sms_content.length == 0) {
				$('#sms-content').focus();
				$('#sms-content').closest('.form-group').append('<div class="mng-error">내용을 입력하세요</div>');
				return false;
			}
			//SMS 전송 기능 작업.


			sms_modal.modal('hide');
			mngShowToast('check', '전송 완료', mng_settings_el);

		}, 'cancel', 'send', 'w480');

		$('.sms-recharge-btn').click(function() {
			smsRechargeModal(SID);
		});

	});/*sms*/


	/*$('.member-level-btn .dropdown-item').live('click', function() {
		var level = parseInt($(this).text().trim()),
			check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
			$(this).showModalFlat('INFORMATION', check_data.error, true, false, '', 'ok');
			return false;
		}

		var others_str = (check_data.count<1) ? '' : ' 외 <span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">' + check_data.count + '</span> 명';
		var modal_content = '\
			<div class="mng-modal-body level-modal">\
				<p class="addressee-wrap">\
					<span class="addressee-name">' + check_data.name + '</span> \
					' + others_str + ' 의 회원 레벨을 <br><span class="point">' + level + '</span> (으)로 적용하시겠습니까?\
				</p>\
			</div>\
		';

		var level_modal = $(this).showModalFlat('회원 등급 변경', modal_content, true, true, function() {
			var uids = check_data.ids;ㅈ

			$.ajax({
				type: 'POST',
				url: '/umember/update/type/level',
				data: { sid : SID, uids : uids, val : level },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						// alert(data.error);
						if(level_modal.find('.error').length == 0) level_modal.find('.level-modal').append('<span class="error">' + data.error + '</span>');
						else level_modal.find('.level-modal').find('.error').text(data.error);
						return false;
					}

					$.each(uids, function(i,v) {
						$(mng_settings_el).find('.mng-list table tbody tr[data-uid="'+v+'"]').find('.level').text(level);
					});

					level_modal.modal('hide');
					mngShowToast('check', '저장완료', mng_settings_el);
				}
			});


		});

	});/*level-all*/


	$('#member-level-select').live('change', function() {
		var conf = confirm("선택하신 회원의 레벨을 변경하시겠습니까?");
		if(conf){
			var uid = $(this).closest('tr').attr('data-uid')
			var level = $(this).val();

			if(typeof uid == 'undefined' || !uid) {
				window.location.reload();
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/umember/update/type/level',
				data: { sid : SID, uids : uid, val : level },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						alert(data.error);
						return false;
					}
					
					// setSiteLogs('um.edit','level.one',{'id':uid,'level':level},'um.list');
				}
			});
		}else{
			window.location.reload();
			return false;
		}
		
	});


	$('.member-leave-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
            $(this).showModalFlat($.lang[LANG]['manager.list.member.selected.empty.title'], check_data.error,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-member-list-block');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.leave.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.leave.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body leave-modal">\
				<p class="addressee-wrap">\
					' + selected_str + '\
				</p>\
			</div>\
		';

		var level_modal = $(this).showModalFlat($.lang[LANG]['manager.list.member.leave.title'], modal_content, true, true, function() {
			var uids = check_data.ids;

			$.ajax({
				type: 'POST',
				url: '/umember/update/type/leave',
				data: { sid : SID, uids : uids, val : 'deny' },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						// alert(data.error);
						if(level_modal.find('.error').length == 0) level_modal.find('.leave-modal').append('<span class="error">' + data.error + '</span>');
						else level_modal.find('.leave-modal').find('.error').text(data.error);
						return false;
					} else {
						level_modal.modal('hide');
						window.location.reload();
					}

				}
			});


		}, 'cancel','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0');

	});


	$('.member-block-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
            $(this).showModalFlat($.lang[LANG]['manager.list.member.selected.empty.title'], check_data.error,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-member-list-block');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ' + ((check_data.count == 0) ? $.lang[LANG]['manager.list.member.str'] : ''),
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.block.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.block.txt.2'];

		var modal_content = '\
			<div class="mng-modal-body block-modal">\
				<p class="addressee-wrap">\
					' + selected_str + '\
				</p>\
			</div>\
		';

		var block_modal = $(this).showModalFlat($.lang[LANG]['manager.list.member.block.title'], modal_content, true, true, function() {
			var val = check_data.ids;

			$.ajax({
				type: 'POST',
				url: '/umember/set/type/block',
				data: { sid : SID, key : 'id', val : val },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						// alert(data.error);
						if(block_modal.find('.error').length == 0) block_modal.find('.block-modal').append('<span class="error">' + data.error + '</span>');
						else block_modal.find('.block-modal').find('.error').text(data.error);
						return false;
					} else {
						block_modal.modal('hide');
						window.location.reload();
					}
				}
			});

		}, 'cancel','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0');
	});


	//레벨변경 탭 추가
	$('.member-level-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var blank = $('input[type="checkbox"]:checked').hasClass("blank");
		if(blank){
			$(this).showModalFlat($.lang[LANG]['manager.list.member.selected.empty.title'], $.lang[LANG]['manager.list.member.selected.blank'],true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-member-list-block');
			return false;
		}
		
		var check_data = getMemberListCheckData($(this)),
			mng_settings_el = $(this).closest('.mng-settings');

		if( typeof check_data.error != 'undefined' && check_data.error) {
            $(this).showModalFlat($.lang[LANG]['manager.list.member.selected.empty.title'], check_data.error,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0 cl-member-list-block');
			return false;
		}

		var first_name = (LANG == 'en' && check_data.count > 0) ? '' : '<span class="addressee-name">' + check_data.name + '</span> ',
			others_name = (LANG == 'en' || check_data.count < 1) ? '' :  $.lang[LANG]['manager.list.member.selected.multi.1'] + '\
						<span class="addressee-count point" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="' + check_data.names + '">\
						' + check_data.count + '</span>' + $.lang[LANG]['manager.list.member.selected.multi.2'],
			last_name = (LANG == 'en' && check_data.count > 0) ? $.lang[LANG]['manager.list.member.selected.multi.3'] : '',
			selected_str = $.lang[LANG]['manager.list.member.level.txt.1'] + first_name + others_name + last_name + $.lang[LANG]['manager.list.member.level.txt.2'];
		
		//레벨숫자버튼 생성
		var level_btn = "";
		for(var i=1; i < 11; i++){
			level_btn += '<button class="btn-lg btn-default level-btn" value="' + i + '">' + i + '</button>';
		}
		
		var modal_content = '\
			<div class="mng-modal-body level-modal">\
			<p class="addressee-wrap">\
				' + selected_str + '\
				</p>\
				' + level_btn + '\
			</div>\
		';
		
		var level_modal = $(this).showModalFlat($.lang[LANG]['manager.list.member.level.title'], modal_content, true, true, function() {
			var uids = check_data.ids;
			var level = $(".level-modal").children(".active").val();

			if(level == "undefined" || !level){
				alert("레벨을 선택해 주세요");
				return false;
			}

			if(typeof uids == 'undefined' || !uids) {
				window.location.reload();
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/umember/update/type/level',
				data: { sid : SID, uids : uids, val : level },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						//alert(data.error);
						if(level_modal.find('.error').length == 0) level_modal.find('.level-modal').append('<span class="error">' + data.error + '</span>');
						else level_modal.find('.level-modal').find('.error').text(data.error);
						return false;
					} else {
						level_modal.modal('hide');
					}
					location.reload(true);
				}
			});
			
		}, 'cancel','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0',true);
	});

	$('input[type="checkbox"].cl-etc-input-val').live('click',function(){ 
		if($(this).is(":checked")===true) {
			
			console.log($(this).prop('checked'));
			$(this).prop('checked',true);
		} else {
			
			console.log($(this).prop('checked'));
			$(this).prop('checked',false);
		}
	
	});
	
	$('.member-info').live('click', function() {
		var isGabia = ($('.dashboard_u.gabia').length > 0) ? true : false,
			checkViewMode = ($(this).find('.collection-view').length > 0) ? true : false,
			uid = $(this).closest('tr').attr('data-uid'),
			mng_settings_el = $(this).closest('.mng-settings'),
			list_type = mng_settings_el.attr('data-type'),
			list_str = '',
			no_active_btn = $('div[data-ssuser]').attr('data-ssuser');

		$.post('/umember/lists/type/memberinfo', { sid : SID, val : uid }, function(data) {
			if(typeof data.error != 'undefined' && data.error) {
				alert(data.error);
				return false;
			}

			var page_type = $('.mng-settings').attr('data-type'),
				slog_p = '';
			if(typeof page_type != 'undefined' && page_type) {
				if(page_type == 'member-waitlist') setSiteLogs('um.wait','info',{'id':uid},'um.waitlist');
				else setSiteLogs('um.list','info',{'id':uid},'um.list');
			}
			var cert_use = $('.memberlist-table').attr('data-cert');

			$.each(data, function(k,o) {
				if(isGabia && $.inArray(k, ['cert_date','cert_adult_date']) > -1) return true;

				var cl_name = (o['name']) ? o['name'] : $.lang[LANG]['manager.list.info.'+k],
					cl_type = (o['type']) ? o['type'] : 'text',
					cl_val = (o['value']) ? o['value'].replace(/\"/g,'&quot;').replace(/\'/g,'&#39;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;') : '',
					pass_field = ['no','addr2'],
					disabled_field = ['id','approvaldate'],
                    cl_jcol_list_type = ((o['type']=='check') || (o['type']=='radio')) ? 'cl-etc-list-type' : '';
					
				list_str += ($.inArray(k,pass_field) > -1) ? '' : '\
					<div class="form-group">\
						<label class="memW-title control-label '+cl_jcol_list_type+' " id="member-'+ k + '-label">'+ cl_name + '</label>\
						<div class="memW-info-wrap">\
				';

				if(k=='birth') cl_val = (cl_val=='0000-00-00') ? '' : cl_val;

				switch(k) {
					case 'no':
					case 'addr2': 
						break;

					case 'addr1':
						var addr2_str = (data['addr2']['value']) ? '||' + data['addr2']['value'] : '|| ',
							addr_str = (cl_val.indexOf('||') === -1) ? ' || '+cl_val+addr2_str : cl_val+addr2_str,
							addr = addr_str.split('||'),
							plan_type = (typeof property != 'undefined' && property) ? property.VALIDTYPE : VALIDTYPE,
							checkSM = (typeof plan_type != 'undefined' && (plan_type == 'SM' || plan_type == 'SHOPPING')) ? true : false,
							usedAddrSearchModal = (checkSM || o['addrsearch']) ? 'readonly onclick="addrSearchModal(\'member\')"' : '';

						if(list_type == 'member-list') {
							list_str += '\
								<input class="hide" id="member-postcode" type="hidden" value="' + addr[0].trim() + '">\
								<div class="cl-common-form-wrap nonplace-holder">\
			   						<div class="cl-common-form-group">\
                                       	<input class="member-info-input form-control" id="member-'+ k + '" type="text" value="' + addr[1].trim() + '" ' + usedAddrSearchModal + ' name="member-'+ k + '" required="required">\
			 						</div>\
			   					</div>\
			   					<div class="cl-common-form-wrap nonplace-holder">\
			   						<div class="cl-common-form-group">\
                                       	<input class="member-info-input form-control" id="member-addr2" type="text" value="' + addr[2].trim() + '" name="member-addr2" required="required">\
			 						</div>\
			   					</div>\
							';
						} else {
							list_str += '\
								<input class="hide" id="member-postcode" type="hidden" value="' + addr[0].trim() + '">\
								<span id="member-'+ k + '" '+usedAddrSearchModal+'>'
									+ addr[1].trim() + ((addr[2].trim() != '') ? '<br>'+addr[2].trim() : '') +
								'</span>\
							';
						}
						break;
					case 'gender':
						if(list_type == 'member-list') {
							var disabled = (cert_use == 'Y' || cert_use == 'A' || checkViewMode) ? ' disabled':'';
							list_str += '\
								<select class="form-control" name="member-'+ k + '" id="member-'+ k+ '"'+disabled+'>\
									<option value="">선택</option>';
							if(o['value'] == '01') {
								list_str += '\
									<option value="01" selected>남</option>\
									<option value="02">여</option>';
							} else if(o['value'] == '02') {
								list_str += '\
									<option value="01">남</option>\
									<option value="02" selected>여</option>';
							} else {
								list_str += '\
									<option value="01">남</option>\
									<option value="02">여</option>';
							}
							list_str += '\
								</select>\
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
							';
						} else {
							var gender_val = (cl_val)? ((cl_val == '01')? '남':'여'):'';
							list_str += '\
								<span id="member-'+ k + '">'
									+ gender_val +
								'</span>\
								';
						}
							
						break;
					case 'memo':
						var m_count = cl_val.length,
							checkReadonly = (checkViewMode) ? 'readonly' : '';
						if(list_type == 'member-list') {
							list_str += '\
								<textarea class="form-control" name="member-'+ k + '" id="member-'+ k+ '" rows="3" '+checkReadonly+'>' + cl_val + '</textarea>\
								<label for="member-'+ k + '"><span class="write-count">' + m_count + '</span>/1000</label>\
								';
						} else {
							list_str += '\
								<span id="member-'+ k+ '">' + cl_val + '</span>';
						}
						break;

					case 'birth':
						if(list_type == 'member-list') {
							var disabled = (cert_use == 'Y' || cert_use == 'A') ? ' disabled':'';
							list_str += '\
								<div class="cl-common-form-wrap nonplace-holder">\
			   						<div class="cl-common-form-group'+disabled+'">\
	                                       <input class="member-info-input form-control birthKeyCheck" id="member-'+ k + '" type="text" value="' + cl_val + '" name="member-'+ k + '" onkeyup="auto_date_format(event, this)" onkeypress="auto_date_format(event, this)" required="required"'+disabled+'>\
			 						</div>\
			   					</div>\
							';
						} else {
							list_str += '\
								<span id="member-'+ k + '" class="birthKeyCheck" onkeyup="auto_date_format(event, this)" onkeypress="auto_date_format(event, this)">'
									+ cl_val +
								'</span>\
							';
						}

						break;

					case 'cert_date':
					case 'cert_adult_date':
						if(list_type == 'member-list') {
							list_str += '\
		                            <div class="cl-common-form-wrap nonplace-holder member-'+ k + '-wrap">';
		                        if(cl_val != '' && cl_val != '0000-00-00 00:00:00') {
				   				list_str += '\
				   						<div class="cl-common-form-group">\
		                                    <input class="member-info-input form-control" id="member-'+ k + '" type="text" value="' + cl_val + '" name="member-'+ k + '" required="required" ' + prev_val + ' disabled>\
				 						</div>';
					 			}
				 			list_str += '\
				   					</div>\
								';
						} else {
							if(cl_val != '' && cl_val != '0000-00-00 00:00:00') {
								list_str += '\
									<span id="member-'+ k + '">'
										+ cl_val +
									'</span>\
								';
							}
						}

						break;
					default:
						var disabled = ($.inArray(k,disabled_field) > -1) ? 'disabled' : '',
							prev_val = (k == 'email' || k == 'nick') ? 'data-prev="' + cl_val + '"' : '',
							cl_type_str = '';

						if(list_type == 'member-list') {
							if($.inArray(k, ['name', 'tel']) > -1 && (cert_use == 'Y' || cert_use == 'A')) disabled = 'disabled';
							var list_jcolval = [o['jcol_val']];
							if((cl_type=='select') || (cl_type=='check') || (cl_type=='radio')) {
								list_jcolval =  (o['jcol_val'].indexOf('`') > -1) ? o['jcol_val'].split('`') : list_jcolval;
							}

							switch (cl_type) {
								case 'memo':
									cl_type_str += '<textarea class="form-control" name="member-'+ k + '" id="member-'+ k+ '" rows="3">' + cl_val + '</textarea>';
									break;
								case 'select':									
									if(list_jcolval.length > 0) {
										cl_type_str += '\
										<select class="form-control etc-select" name="member-'+ k + '" id="member-'+ k+ '"'+disabled+'>\
											<option value="">선택</option>';
										$.each(list_jcolval, function(i,v) {
											var selected = (v==cl_val) ? 'selected' : '';
											cl_type_str += '\
											<option value="'+v+'" '+selected+'>'+v+'</option>\
											';
										});
										cl_type_str += '\
										</select>\
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 4" width="8" height="4"><path d="m0 0 4 4 4-4z"/></svg>\
										';
									}
									
									break;

								case 'radio':
									if(list_jcolval.length > 0) {
										$.each(list_jcolval, function(i,v) {
											var checked = (v==cl_val) ? 'checked' : '';
											cl_type_str += '\
											<div class="newcheckbox cl-etc-jcoltype">\
												<label>\
													<div class="newcheckboxSvgRadio">\
														<input type="radio" class="form-control cl-common-form-radio-hide cl-etc-input-val cl-s-form-control" id="member-'+ k + '-'+i+'" name="member-'+ k + '" value="'+v+'" '+checked+'>\
														<svg viewBox="0 0 18 18" width="18" height="18">\
															<path d="M9 0C4.03 0 0 4.03 0 9c0 4.97 4.03 9 9 9s9-4.03 9-9C18 4.03 13.97 0 9 0zM9 17c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8C17 13.41 13.41 17 9 17z"/>\
														</svg>\
														<svg class="active" viewBox="0 0 18 18" width="18" height="18">\
															<path d="M9 0C4.03 0 0 4.03 0 9c0 4.97 4.03 9 9 9s9-4.03 9-9C18 4.03 13.97 0 9 0zM9 17c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8C17 13.41 13.41 17 9 17z"/>\
															<circle cx="9" cy="9" r="6"/>\
														</svg>\
													</div>\
													<span>'+v+'</span>\
												</label>\
											</div>\
											';
										});		
									}

									break;	

                                case 'check':
                                    if(list_jcolval.length > 0) {
                                        $.each(list_jcolval, function(i,v) {
											var checked = ((cl_val.indexOf('`') > -1) && (cl_val.indexOf(v.trim()) > -1)) ? 'checked' : (v==cl_val ? 'checked' : '');
											cl_type_str += '\
												<div class="newcheckbox cl-etc-jcoltype">\
													<label>\
														<div class="newcheckboxSvg">\
															<input type="checkbox" class="form-control cl-common-form-radio-hide cl-etc-input-val cl-s-form-control" id="member-'+ k + '-'+i+'" name="member-'+ k + '" value="'+v+'" '+checked+'>\
															<svg viewBox="0 0 16 16" width="16" height="16">\
																<path class="st6" d="M3 0h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H3c-1.66 0-3-1.34-3-3V3C0 1.34 1.34 0 3 0z"></path>\
																<path class="st19" d="M13 1c1.1 0 2 0.9 2 2v10c0 1.1-0.9 2-2 2H3c-1.1 0-2-0.9-2-2V3c0-1.1 0.9-2 2-2H13M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0L13 0z"></path>\
															</svg>\
															<svg class="active" viewBox="0 0 16 16" width="16" height="16">\
																<rect x="2" y="2" class="st6" width="12" height="12"></rect>\
																<path class="st19" d="M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0zM13.03 6.03l-5.5 5.5C7.38 11.68 7.19 11.75 7 11.75s-0.38-0.07-0.53-0.22l-3.5-3.5c-0.29-0.29-0.29-0.77 0-1.06s0.77-0.29 1.06 0L7 9.94l4.97-4.97c0.29-0.29 0.77-0.29 1.06 0S13.32 5.74 13.03 6.03z"></path>\
															</svg>\
														</div>\
														<span>'+v+'</span>\
													</label>\
												</div>\
											';
                                        });	
                                    }
                                   
                                    break;
                    
								default:
									cl_type_str += '\
									<div class="cl-common-form-wrap nonplace-holder" id="member-'+ k + '">\
										<div class="cl-common-form-group '+disabled+'">\
											<input class="member-info-input form-control" id="member-'+ k + '" type="text" value="' + cl_val + '" ' + disabled + ' name="member-'+ k + '" required="required" ' + prev_val + '>\
										</div>\
									</div>';
									break;
							}

							list_str += cl_type_str;

						} else {
							if((cl_type=='select') || (cl_type=='check') || (cl_type=='radio')) {
								cl_val =  (cl_val.indexOf('`') > -1) ? cl_val.replace(/`/gi,',') : cl_val;
							}
							list_str += '\
								<span id="member-'+ k + '">'
									+ cl_val +
								'</span>\
							';
						}
						break;
				}

				list_str += ($.inArray(k,pass_field) > -1) ? '' : '\
						</div>\
					</div>\
				';
			});
			
			var modal_view = (checkViewMode) ? 'readonly' : '',
				modal_content = '\
			<div class="mng-modal-body info-modal '+modal_view+'" data-uid="' + uid + '" data-list-type="' + list_type + '">\
				<div class="form-horizontal">\
					' + list_str + '\
				</div>\
			</div>\
			';

			if(list_type == 'member-list') {
				var closed_txt = (checkViewMode) ? 'close' : 'cancel';
				var info_modal = $(this).showModalFlat($.lang[LANG]['manager.member.details.title'], modal_content, true, !checkViewMode, function() {

					var info_data = {},
						regExp_arr = ['name','nick','email','tel','birth'],
						regexp = {
							name: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣 ]*$/i,
							nick: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣 ]*$/i,
							email: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
							tel: /^[0-9-+]*$/,
							birth: /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
						},
						check_error = false,
						slog_more = '',
						slog_more_array = {},
						etc_Array = [],
						etc_i= 0;

					$('.info-modal').find('.form-control:not([disabled])').each(function(i) {
						var type = $(this).attr('id').replace(/(member\-)|(\-\d)/gi,''),
							type_str = $(this).closest('.form-group').find('.control-label').text(),
							error_str = '',
							etc_type_arr = etc_Array[type];
							
                        if($(this).parents('.newcheckbox').hasClass('cl-etc-jcoltype')) {
							
							if($(this).is(":checked")) {								
								val = $(this).val().trim();
								var check_jcol_first = false;
								if((typeof $(this).parents('.form-group').attr('data-jcolval')=='undefined') || (!$(this).parents('.form-group').attr('data-jcolval'))) {
									check_jcol_first = true;
									$(this).parents('.form-group').attr('data-jcolval',val);
								}

								var jcolVal = $(this).parents('.form-group').attr('data-jcolval');
								if($(this).parents('.form-group').find('.cl-etc-input-val:checked').length>1 && val && !check_jcol_first) {
									val = jcolVal + '`' + val;
									val = val.replace(/\`$/gi, ''); 
									$(this).parents('.form-group').attr('data-jcolval',val);
								} 
							} else {
								if($(this).parents('.form-group').find('.cl-etc-input-val:checked').length==0) val = '';
							}

                        } else val = $(this).val().trim();
					
						if(typeof $(this).parents('.form-group').attr('data-jcolval') != 'undefined' && $(this).parents('.form-group').attr('data-jcolval')) {
							val = $(this).parents('.form-group').attr('data-jcolval');
						}					

						var emoji_val = (type.indexOf('addr') > -1) ? $('#member-addr1').val().trim() + ' ' + $('#member-addr2').val().trim() : val;
						if(checkEmojis(emoji_val)) error_str = $.lang[LANG]['config.unable.emoji'];
						else {
							// if(type == 'addr1') slog_more += type_str+' : '+val;
							// else if(type == 'addr2') slog_more += ' '+val+'<br>';
							// else slog_more += type_str+' : '+val+'<br>';

							if((val.length == 0 && type != 'email') || regExp_arr.indexOf(type) == -1) {
								if(type == 'addr1') val = $('#member-postcode').val() + ' || ' + val;																
								info_data[type] = val;
								
								if(type=='addr2') {
									slog_more_array[type_str] = info_data['addr1'] + ' ' + val;
								} else slog_more_array[type_str] = val;
								
								return true;
							}
							if(!regexp[type].test(val)) {
								error_str = $.lang[LANG]['siteum.regexp.check.'+type];
								if(val.length == 0 && type == 'email') error_str = $.lang[LANG]['manager.check.required.message'];
							} else if(type == 'nick' && (val.length < 1 || val.length > 20)) {
								error_str = $.lang[LANG]['siteum.regexp.check.nick'];
							} else {
								$(this).closest('.form-group').removeClass('has-error');
								$(this).parent().find('.mng-error').remove();

								info_data[type] = val;
								slog_more_array[type_str] = val;								
							}

							
							
						}
						
						var this_group = $(this).closest('.form-group');
						if(error_str.length > 0) {
							var error_icon = '\
									<svg class="error-icon" viewBox="0 0 13 13" width="13" height="13">\
										<path d="M6.5 0C2.91 0 0 2.91 0 6.5S2.91 13 6.5 13 13 10.09 13 6.5 10.09 0 6.5 0zM6.5 12C3.47 12 1 9.53 1 6.5S3.47 1 6.5 1 12 3.47 12 6.5 9.53 12 6.5 12z"/>\
										<rect x="6" y="3" width="1" height="5"/>\
										<rect x="6" y="9" width="1" height="1"/>\
									</svg>\
							';

							this_group.addClass('has-error');
							if(this_group.find('.mng-error').length > 0 ) this_group.find('.mng-error').html(error_icon + error_str);
							else this_group.append('<span class="mng-error">' + error_icon + error_str + '</span>');

							if($(this).closest('.form-horizontal').find('.has-error').length == 0) $(this).focus();
						}
					}).promise().done(function() {
						check_error = ($('.info-modal').find('.has-error').length == 0) ? true : false;
						if(!check_error) {
							$('.info-modal').find('.has-error').first().find('input').focus();
							return false;
						} else {
							$.ajax({
								type: 'POST',
								url: '/umember/update/type/member',
								data: { sid : SID, val: JSON.stringify(info_data), uid : uid },
								dataType: 'json',
								async: true,
								success: function(data) {

									if(typeof data.error != 'undefined' && data.error) {
										$.each(data.error, function(key,str) {
											if(info_modal.find('#member-'+key).length > 0 ) {
												info_modal.find('#member-'+key).focus();
												if(info_modal.find('#member-'+key).closest('.form-group').find('.mng-error').length > 0) info_modal.find('#member-'+key).closest('.form-group').find('.mng-error').text(str);
												else info_modal.find('#member-'+key).closest('.form-group').append('<span class="mng-error">' + str + '</span>');
											} else { alert(str); return false; }
										});
										if(info_modal.find('.mng-error').length > 0) return false;
									}

									slog_more += '\
									<div class="slog-jcol-wrap">\
										<ul class="slog-jcol-ul">\
										';
										$.each(slog_more_array, function(key,v){
											v = (v.indexOf('`')>-1) ? v.replace(/`/gi,', ') : v;					
											slog_more += '\
											<li class="slog-jcol-li">\
												<div class="slog-jcol-title">'+key+'</div>\
												<div class="slog-jcol-contents">'+v+'</div>\
											</li>\
											';
										});
					
									slog_more += '\
											</ul>\
										</div>\
									';

									console.log(slog_more);
									setSiteLogs('um.edit','info',{'id':uid,'more':slog_more},'um.list');

									info_modal.find('.mng-error').remove();									
									info_data.addr = info_data.addr1+' '+info_data.addr2;

									$.each(info_data, function(k, v) {
										if(k == 'gender') {
											v = (v == '01')? '남':'여';
										}
										$('.mng-list table tr[data-uid="' + uid + '"]').find('.'+k).text(v);
									});

									info_modal.modal('hide');
								}
							});
						}

					});

				}, closed_txt, 'save', 'memberinfo-modal cl-cmmodal cl-s-btn cover', true, '', function() {

					var regexp = {
							name: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣 ]*$/i,
							nick: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣 ]*$/i,
							email: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
							tel: /^[0-9-+]*$/,
							birth: /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
						};

					var info_recheck_regexp = function(input,event_type) {
						var type = $(input).attr('id').replace(/member-/i,''),
							val = $(input).val().trim(),
							emoji_val = (type.indexOf('addr') > -1) ? $('#member-addr1').val().trim() + ' ' + $('#member-addr2').val().trim() : '',
							error_str = '';

						if(checkEmojis(emoji_val)) error_str = $.lang[LANG]['config.unable.emoji'];
						else if(regexp.hasOwnProperty(type)) {
							if(!regexp[type].test(val)) error_str = $.lang[LANG]['siteum.regexp.check.'+type];
							else {
								var checkDuplicate = (	event_type == 'blur' &&
														$.inArray(type, ['email','nick']) > -1 &&
														typeof $(input).attr('data-prev') != 'undefined' && 
														$(input).attr('data-prev').trim().toLowerCase() != val.toLowerCase()
													) ? true : false;
								if(type == 'email' && $('input#member-id').val().trim().toLowerCase() == val.toLowerCase()) checkDuplicate = false;
								else if(type == 'nick' && ($('input#member-nick').val().trim().length < 1 || $('input#member-nick').val().trim().length > 20)) {
									checkDuplicate = false;
									error_str = $.lang[LANG]['siteum.regexp.check.nick'];
								}
								if(checkDuplicate) {
									var splan = (typeof VALIDTYPE != 'undefined' && VALIDTYPE) ? VALIDTYPE : '';
									$.post('/umember/join/used_check', { sid : SID, field : type, data : val, splan : splan }, function(check_result) {
										if(typeof check_result.error != 'undefined' && check_result.error) {
											error_str = check_result.error;
										}
									}, 'json');
								}
							}
						}

							
						if(error_str.length > 0) {
							var error_html = '<span class="mng-error">\
									<svg class="error-icon" viewBox="0 0 13 13" width="13" height="13">\
										<path d="M6.5 0C2.91 0 0 2.91 0 6.5S2.91 13 6.5 13 13 10.09 13 6.5 10.09 0 6.5 0zM6.5 12C3.47 12 1 9.53 1 6.5S3.47 1 6.5 1 12 3.47 12 6.5 9.53 12 6.5 12z"/>\
										<rect x="6" y="3" width="1" height="5"/>\
										<rect x="6" y="9" width="1" height="1"/>\
									</svg>' + error_str + '</span>\
							';

							$(input).closest('.form-group').addClass('has-error');
							if($(input).closest('.form-group').find('.mng-error').length > 0) $(input).closest('.form-group').find('.mng-error').replaceWith(error_html);
							else $(input).closest('.form-group').append(error_html);
						} else {
							$(input).closest('.form-group').removeClass('has-error').find('.mng-error').remove();
						}
					}

					$('.info-modal .form-control').live({
						keyup : function(e) { info_recheck_regexp($(this),'keyup');	},
						blur  : function(e) { info_recheck_regexp($(this),'blur');	}
					});

				});

    
				$('#member-memo').live('keyup', function() {
					var str = $(this).val();
					if(str.length > 0) $(this).closest('.form-group').find('.mng-error').remove();
					$(this).next('label').find('.write-count').text(str.length);
					if(str.length > 1000) {
						$(this).val($(this).val().substring(0, 1000));
					}
				});
				if(no_active_btn) $('.memberinfo-modal.cl-cmmodal .ok-button-dialog.btn-sm').addClass(no_active_btn);
			} else { // only show__
				var info_modal = $(this).showModalFlat($.lang[LANG]['manager.member.details.title'], modal_content, true, false, '', 'ok', '', 'member-waitlist cl-cmmodal cl-s-btn cover');
				if(no_active_btn) $('.member-waitlist.cl-cmmodal .ok-button-dialog.btn-sm').addClass(no_active_btn);
			}


		}, 'json');

	});

	/***************************************************************************************************************************************member-list page END*/





	/*********************************************************************************************************************************member-waitlist page START*/
	$('.approval-btn, .deny-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var position = $(this).closest('td'),
			uno = $(this).closest('tr').attr('data-uno'),
			uid = $(this).closest('tr').attr('data-uid'),
			result = ($(this).hasClass('approval-btn')) ? 'hand' : 'deny',
			wait_cnt = parseInt($(this).closest('.mng-wrap').find('.wait-count').text()),
			isDeny = $(this).hasClass('deny-btn') ? true : false,
			applyhtml = '';

		if(isDeny) $(this).parents('tr[data-uno="'+uno+'"]').find('.member-info').addClass('hide');

		$.post('/umember/update/type/approval', { sid : SID, val : result, uid : uid, uno : uno }, function(data) {
			if(typeof data.error != 'undefined' && data.error) {
				alert(data.error);
				return false;
			}
			
			applyhtml += '\
						<span>'+$.lang[LANG]['manager.wait-list.approval.'+result]+'</span>\
						<span>('+data.result.um_approvaldate+')</span>\
						';
			$('.mng-settings[data-type="member-waitlist"]').find('.wait-count').text(wait_cnt-1);
			position.html(applyhtml).addClass('approval-status');
		}, 'json');

	});
	/***********************************************************************************************************************************member-waitlist page END*/

	/********************************************************************************************************************************member-blocklist page START*/
	
	$('.block-add-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var mng_settings_el = $(this).closest('.mng-settings'),
			add_content = '\
			<div class="form-row">\
				<div class="form-inline clearfix">\
					<div class="form-group col-sm-5">\
						<select id="block-type" class="form-control" name="block-type" placeholder="Search">\
							<option value="id">회원 아이디</option>\
							<option value="ip">IP</option>\
						</select>\
					</div>\
					<div class="form-group col-sm-7"><input class="form-control" type="text" id="block-data"/></div>\
				</div>\
			</div>\
		';

		var modal = $(this).showModalFlat('Block data add', add_content, true, true, function() {
			var key = modal.find('#block-type').val(),
				val = modal.find('#block-data').val().trim(),
				regExp_ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/gi;

			if(key === null) {
				modal.find('#block-type').click();
				return false;
			} else if(modal.find('.error').length > 0) {
				modal.find('#block-data').focus();
				return false;
			} else if (modal.find('#block-data').val().trim().length == 0) {
				modal.find('#block-data').focus();
				modal.find('#block-data').parent().append('<span class="error">내용을 입력하세요</span>');
				return false;
			} else if (key == 'ip' && !regExp_ip.test(val)) {
				modal.find('#block-data').focus();
				modal.find('#block-data').parent().append('<span class="error">ip 형식이 올바르지 않습니다.</span>');
				return false;
			}

				$.ajax({
					type: 'POST',
					url: '/umember/set/type/block',
					data: { sid : SID, key : key, val : val },
					dataType: 'json',
					async: true,
					success: function(data) {

						if(typeof data.error != 'undefined' && data.error) {
							if(modal.find('.error').length == 0) modal.find('#block-data').focus().parent().append('<span class="error">' + data.error + '</span>');
							else modal.find('#block-data').focus().next('.error').text(data.error);
							return false;
						} else {
							modal.modal('hide');
							window.location.reload();
						}

					}
				});


		}, 'cancel','save', 'block-add-modal');

		$('#block-data').live({
			keyup: function() {
				$(this).parent().find('.error').remove();
			}
		});


	});

	$('.block-clear-btn').live('click', function() {
		if($(this).hasClass('member_disabled')) {
			siteNotice('manager');
			return false;
		}
		var block_type = $(this).closest('tr').find('.type').attr('data-type'),
			block_val = $(this).closest('tr').find('.val').text().trim(),
			block_id = $(this).closest('tr').find('.id').text().trim(),
			block_data = $(this).closest('tr').attr('data-id'),
			is_uadmin = $(this).parents('.mng-member').attr('data-uadmin');

		if(block_data == 0) return false;
		else {
			var modal_content = '\
				<div class="mng-modal-body clear-modal">\
					<p class="addressee-wrap">\
						'  + $.lang[LANG]['manager.block-list.block.clear.txt.1'] + '\
						<span class="addressee-name">' + block_id + '</span> \
						' + $.lang[LANG]['manager.block-list.block.clear.txt.2'] + '\
					</p>\
				</div>\
				';	

			var modal = $(this).showModalFlat($.lang[LANG]['manager.block-list.block.clear.title'], modal_content, true, true, function() {

				$.ajax({
					type: 'POST',
					url: '/umember/delete/type/block',
					data: { sid : SID, val : block_data, block_type : block_type, block_val : block_val },
					async: true,
					success: function(data) {
						if(typeof data.error != 'undefined' && data.error) {
							alert(data.error);
							return false;
						} else {
							var cntTr = $(this).parents('table').length;

							if(cntTr > 0) window.location.reload();
							else location.href = is_uadmin+'/member/blocklist';							
						}
					}
				});

			},'cancel','','cl-cmmodal cl-s-btn w560 cl-p130 cl-p0');

		}

	});

	/**********************************************************************************************************************************member-blocklist page END*/


	/********************************************************************************************************************************member-leavelist page START*/
	$('.leavelist .mng-selectboxlist select.form-control').live('change',function() {
		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/leavelist' : '/manager/member/leavelist',
			sfl_sort = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_sort').val(),
			sfl_view = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_view').val(),
			stx =  $(this).parents('.mng-list').find('.mng-search-box').find('#stx').val();

		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view);
	});

	$('.leavelist .mng-search-box .search-btn').live('click',function(e) {
		var url_str = ($('header').hasClass('_admin')) ?  '/_admin/member/leavelist' : '/manager/member/leavelist',
			sfl_sort = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_sort').val(),
			sfl_view = $(this).parents('.mng-list').find('.mng-subMenu-list').find('#sfl_view').val(),
			stx =  $(this).parents('.mng-search-box').find('#stx').val();

		if(checkEmojis(stx)) {
			e.preventDefault();
			errorEmojisModal();
			return false;
		}

		setSiteLogs('um.leavelist','search',{'stx':stx},'um.leavelist');

		if(stx.length > 0) stx = '/stx/'+stx;
		location.replace(url_str+'/page/1/sort/'+sfl_sort+'/view/'+sfl_view+stx);
	});


	/**********************************************************************************************************************************member-leavelist page END*/


	/****************************************************************************************************************************************Mypage Modal START*/	
	$('.my-cl-edit').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap'),
				sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid');

			var clInput = function(type, value) {
				if(type == 'id') return;
				var str = '\
						<div class="input-group my-cl-update-wrap">\
				';

				$.each(value, function(i,v) {

					if(type == 'addr') {
						var plan_type = (typeof property != 'undefined' && property) ? property.VALIDTYPE : VALIDTYPE,
							checkSM = (typeof plan_type != 'undefined' && (plan_type == 'SM' || plan_type == 'SHOPPING')) ? true : false,
							usedAddrSearchModal = (checkSM && i==1) ? 'readonly onclick="addrSearchModal(\'my-input\')"' : '';
							field_name = (i == 0) ? 'postcode' : type + i,
							hide_class = (i == 0) ? 'hide' : '';

						str += '\
								<input type="text" id="my-input-'+field_name+'" class="my-cl-update form-control ' + hide_class + '" placeholder="' + $.lang[LANG]['manager.join.cl.item.name.enter'] + '" value="' + v + '" data-type="' + type + '"/ ' + usedAddrSearchModal + '>\
						';
					} else {
						str += '\
								<input type="text" id="my-input-'+type+'" class="my-cl-update form-control" placeholder="' + $.lang[LANG]['manager.join.cl.item.name.enter'] + '" value="' + v + '" data-type="' + type + '"/>\
						';
					}

				});
				str += '\
						</div>\
				';
				return str;
			}
			$(this).hide();
			cl.find('.my-cl-cancel,.my-cl-save').show();
			cl.addClass('update-mode');
			cl.children().each(function() {
				var type = $(this).attr('data-type'),
					value = $(this).find('.my-data').map(function() { return $(this).text().trim(); }).get(),
					input_text = clInput(type,value);

				if(type != 'id') $(input_text).prependTo($(this).find('.mng-panel-body'));
				if(cl.children('.focus').length == 0) $(this).addClass('focus').find('input').focus();
			});



		}
	});

	$('.my-cl-cancel').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap');

			cl.find('.mng-error').remove();
			cl.find('.my-cl-cancel,.my-cl-save').hide();
			cl.find('.my-cl-edit').show();
			cl.removeClass('update-mode');
			cl.children().each(function() {
				$(this).find('.my-cl-update-wrap').remove();
			});
		}
	});

	$('.my-cl-save').live({
		click: function() {
			var cl = $('.mng-settings[data-type="profile"]').find('.cl-wrap'),
				sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid'),
				cl_data = {},
				check_error = false;

			if(cl.find('.has-error').length > 0) cl.find('.has-error').addClass('foucs').find('.my-cl-update').first().focus();

			var recheck_regexp = function(input) {
				var field = input.attr('data-type'),
					val = input.val(),
					reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

				if(reg_has && !reg.test(val)) {
					input.closest('.mng-panel-body').find('.mng-error').text(reg_ex);
				} else {
					input.closest('.mng-panel').removeClass('has-error').find('.mng-error').remove();
				}
			}

			$('#mypage-modal .mng-settings[data-type="profile"] .my-cl-update').live({
				focus: function(e) { $(this).closest('.mng-panel').addClass('focus').siblings().removeClass('foucs'); },
				keyup : function(e) { recheck_regexp($(this)); },
				blur  : function(e) { $(this).closest('.mng-panel').removeClass('focus'); }
			});

			cl.children('.mng-panel:not([data-type="id"])').each(function() {
				var field = $(this).attr('data-type'),
					optional = $(this).hasClass('optional') ? true : false,
					value = $(this).find('.my-cl-update').map(function() { return $(this).val().trim(); }).get(),
					this_cl = $(this),
					// prev_value = $(this).find('.my-data').map(function() { return $(this).text().trim(); }).get(),
					error_str = '',
					reg_has = (typeof COLLECTION_REGEX[field] != 'undefined' && COLLECTION_REGEX[field]) ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX[field]['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_ex = (reg_has) ? COLLECTION_REGEX[field]['ex'] : '';

				$.each(value, function(i,v) {

					if(field == 'addr' && i == 0) return true;

					var field_name = (field == 'addr') ? field + i : field,
						this_wrap = this_cl.find('.mng-panel-body'); 

					if(optional && v.length==0 && i==0) error_str = $.lang[LANG]['manager.check.required.message'];
					else if(reg_has && !reg.test(v)) {
						error_str = (v.length == 0 && !optional) ? '' : COLLECTION_REGEX[field]['error'];
					}
					
					if(error_str.length > 0)  {
						this_cl.addClass('has-error');
						if(this_wrap.find('.mng-error').length > 0) this_wrap.find('.mng-error').text(error_str);
						else this_wrap.append('<span class="mng-error">' + error_str + '</span>');

						if(cl.find('.mng-panel.focus').length == 0) this_cl.find('.my-input-'+field_name).focus();
					} else {
						this_cl.removeClass('has-error');
						this_wrap.find('.mng-error').remove();

						if(field == 'addr' && i == 1) {
							var postcode = $('#my-input-postcode').val();
							v = (typeof postcode != 'undefined' && postcode) ? postcode.trim() + '|| ' + v : ' || ' + v;
						}

						cl_data[field_name] = v;
					}
				});
			}).promise().done(function() {
				var check_error = (cl.find('.has-error').length == 0) ? true : false;

				if(!check_error) {
					cl.find('.has-error').first().first('input').focus();
				} else {
					$.ajax({
						type: 'POST',
						url: '/umember/update/type/member',
						data: { sid : sid, val: JSON.stringify(cl_data), uid : uid },
						dataType: 'json',
						async: true,
						success: function(data) {
							// if(typeof data.error != 'undefined' && data.error) {
							// 	alert(data.error);
							// 	return false;
							// }
							if(typeof data.error != 'undefined' && data.error) {
								$.each(data.error, function(key,str) {
									if(cl.find('#my-input-'+key).length > 0 ) {
										cl.find('#my-input-'+key).focus();
										cl.find('#my-input-'+key).closest('.mng-panel-body').append('<span class="mng-error">' + str + '</span>');
									} else { alert(str); return false; }
								});
								if(cl.find('.mng-error').length > 0) return false;
							}
							cl.find('.mng-error').remove();

							cl.find('.my-cl-cancel,.my-cl-save').hide();
							cl.find('.my-cl-edit').show();
							cl.removeClass('update-mode');
							$.each(cl_data,function(k,v) {

								if(k == 'addr1') {
									var addr_arr = v.split('||'),
										postcode_str = (addr_arr[0]) ? addr_arr[0].trim() : '';
									cl.find('.my-postcode').text(postcode_str);
									v = (addr_arr[1]) ? addr_arr[1].trim() : '';
								}

								cl.find('.my-'+k).text(v);

								if(k == 'nick') {
									if($('._admin_dashboard .site-info .site-data .site-username').length > 0) {
										$('._admin_dashboard .site-info .site-data .site-username').text(v).attr('data-user-name',v);
									}
									if($('#mobile-nav').length > 0) $('#mobile-nav .login-nick span').text(v);
								}
							});
							cl.find('.my-cl-update-wrap').remove();
						}
					});
				}

			});


		}
	});










	$('.mng-siteUM-modal .my-image-edit').live({
		click: function() {
			var sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid'),
				src = $('.mng-settings[data-type="profile"]').find('.my-image').attr('src');

			$.umember.showMyImageUploadModal(sid, uid, src);
		}
	});


	$('.mng-siteUM-modal .my-password-save').live({
		click: function() {
			var mypageModal = $('#mypage-modal'),
				myPasswordWrap = mypageModal.find('.mng-settings[data-type="password-change"]'),
				mng_settings_el = $(this).closest('.mng-settings');

			myPasswordWrap.find('input.form-control').each(function() {
				var field = $(this).attr('id').trim().replace(/input-/,''),
					val = $(this).val(),
					errorEL = $(this).next('.mng-error'),
					error_str = '',
					reg_has = (field != 'new-password-checked') ? true : false,
					reg_pattern = (reg_has) ? COLLECTION_REGEX['password']['pattern_j'] : '',
					reg = new RegExp(reg_pattern),
					reg_error = (reg_has) ? COLLECTION_REGEX['password']['error'] : '';

				if(val.length == 0) error_str = $.lang[LANG]['siteum.regexp.password.input'];
				else {
					if(reg_has && !reg.test($(this).val()) ) error_str = reg_error;
					else if( field == 'new-password-checked' && ($(this).val() != myPasswordWrap.find('#input-new-password').val())) error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];
				}

				if(error_str.length > 0) {
					if(errorEL.length > 0 ) errorEL.addClass('empty').text(error_str);
					else $(this).after('<span class="mng-error empty">'+ $.lang[LANG]['siteum.regexp.password.input'] + '</span>');

					if(myPasswordWrap.find('.mng-panel-body.focus').length == 0) $(this).focus();
					else { myPasswordWrap.find('.mng-panel-body.focus input').focus(); }
				} else {
					errorEL.remove();
					$(this).closest('.mng-panel-body').removeClass('focus');
				} 
			});


			if(myPasswordWrap.find('.mng-error').length == 0) {
				var uid = mypageModal.find('.my-id').text(),
					pw = hex_md5(myPasswordWrap.find('#input-password').val()),
					new_pw = hex_md5(myPasswordWrap.find('#input-new-password').val());

				$.post('/umember/password/change', { uid : uid, pw : pw, new_pw : new_pw }, function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						$.each(data.error, function(key,str) {
							if(mypageModal.find('#input-'+key).length > 0) {
								mypageModal.find('#input-'+key).closest('.mng-panel-body').append('<span class="mng-error">' + str + '</span>');
								mypageModal.find('#input-'+key).focus();
							} else { alert(str,'/manager/member'); return false; }
						});
						if(mypageModal.find('.mng-error').length > 0) return false;
					}
					mypageModal.find('input.form-control').val('');
					mngShowToast('check', $.lang[LANG]['siteum.forgot.pw.success'], mng_settings_el);

				}, 'json');
			}




		}
	});

	$('.mng-siteUM-modal .mng-settings[data-type="password-change"] input.form-control').live({
		focus: function() {
			$(this).closest('.mng-panel-body').addClass('focus').siblings().removeClass('focus');
		}, 
		blur: function() {
			$(this).closest('.mng-panel-body').removeClass('focus');
		},
		keyup: function() {

			var field = $(this).attr('id').trim().replace(/input-/,''),
				groupEl = $(this).closest('.mng-panel-body'),
				errorEL = $(this).next('.mng-error'),
				reg_pw = (field == 'new-password-checked') ? field : 'password',
				reg_has = (typeof COLLECTION_REGEX[reg_pw] != 'undefined' && COLLECTION_REGEX[reg_pw]) ? true : false,
				reg_pattern = (reg_has) ? COLLECTION_REGEX[reg_pw]['pattern_j'] : '',
				reg_ex = (reg_has) ? COLLECTION_REGEX[reg_pw]['ex'] : '';

			if(field == 'new-password' || field == 'new-password-checked') {
				var pwEl = $('.mng-settings[data-type="password-change"]').find('#input-new-password'),
					pw2El = $('.mng-settings[data-type="password-change"]').find('#input-new-password-checked'),
					error_str = $.lang[LANG]['siteum.regexp.pw.invalid'];

				if(pwEl.val() == pw2El.val()) { 
					pw2El.next('.mng-error').remove();
				} else {
					if(pw2El.val().length > 0) {
						if(pw2El.next('.mng-error').length > 0) pw2El.next('.mng-error').removeClass('empty').text(error_str);
						else pw2El.closest('.mng-panel-body').append('<span class="mng-error">'+ error_str + '</span>');
					}
				}

			}

			if(reg_has && errorEL.length > 0) { 
				var reg = new RegExp(reg_pattern);
				if(reg.test($(this).val())) errorEL.remove();
				else { errorEL.removeClass('empty').text(reg_ex); }
			}

		}
	});

	$('.mng-siteUM-modal .my-account-remove').live({
		click: function() {
			var sid = $('#mypage-modal').attr('data-sid'),
				uid = $('#mypage-modal').attr('data-uid');

			var content = '\
				<div class="mng-in-flat-modal-wrap">\
					<div class="my-account-remove-info text-left">\
						<strong>' + $.lang[LANG]['manager.mypage.my-remove.txt.1'] + '</strong>\
						<ol>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.2'] + '</li>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.3'] + '</li>\
							<li>' + $.lang[LANG]['manager.mypage.my-remove.txt.4'] + '</li>\
						</ol>\
					</div>\
					<div class="my-account-remove-check clearfix">\
						<div class="checkboxs hand">\
							<input type="checkbox" class="my-account-remove-agree" id="my-account-remove-agree">\
							<strong>' + $.lang[LANG]['manager.mypage.my-remove.agree.txt'] + '</strong>\
						</div>\
					</div>\
				</div>\
			';

			$('.my-account-remove-agree').live({
				click: function() {
					if($(this).prop('checked')) $(this).closest('.my-account-remove-check').find('.mng-error').remove();
				}
			});

			$('.my-account-remove-input-password').live({
				keyup: function() {
					if($(this).val().length > 0) $(this).closest('.form-group').find('.mng-error').remove();
				}
			});

			var agreeModal = $(this).showModalFlat('DELETE ACCOUNT', content, true, true, function() {
				var checked = agreeModal.find('#my-account-remove-agree').prop('checked'),
					errorEL = agreeModal.find('.my-account-remove-check').find('.mng-error'),
					error_str = (!checked) ? $.lang[LANG]['manager.mypage.my-remove.agree.check'] : '';

				if(!checked) {
					if(errorEL.length > 0) errorEL.text(error_str);
					else $('.my-account-remove-check').append('<span class="mng-error">' + error_str + '</span>');
					return false;
				}

				var udata_content = '\
					<div class="mng-in-flat-modal-wrap padding-top-0">\
						<p style="margin-bottom: 15px;">' + $.lang[LANG]['manager.mypage.my-remove.description'] + '</p>\
						<span class="form-group">\
							<input class="form-control" type="password" id="input-password" placeholder="' + $.lang[LANG]['siteum.regexp.password.input'] + '">\
						</span>\
					</div>\
				';

				var removeModal = $(this).showModalFlat('DELETE ACCOUNT', udata_content, true, true, function() {
					var pw = removeModal.find('#input-password').val();

					if(pw.length == 0) {
						if(removeModal.find('.mng-error').length > 0) removeModal.find('.mng-error').text($.lang[LANG]["siteum.regexp.password.input"]);
						else removeModal.find('.form-group').append('<span class="mng-error">' + $.lang[LANG]["siteum.regexp.password.input"] + '</span>');

						removeModal.find('#input-password').focus();
						return false;
					} else {
						$.processON('Deleting....');
						var remove_data = {
							'id' : uid,
							'password' : hex_md5(pw),
						};

						removeModal.find('.mng-error').remove();
						$.post('/umember/login/remove', { data : JSON.stringify(remove_data) }, function(data) {
							if(typeof data.error != 'undefined' && data.error) {
								$.processOFF();
								$.each(data.error, function(key,str) {
									if(removeModal.find('#input-'+key).length > 0 ) {
										removeModal.find('#input-'+key).closest('.form-group').append('<span class="mng-error">' + str + '</span>');
										removeModal.find('#input-'+key).focus();
									} else { alert(str); return false; }
								});
								if(removeModal.find('.mng-error').length > 0) return false;
							}

							removeModal.modal('hide');
							agreeModal.modal('hide');
							$('#mypage-modal').modal('hide');
							$.umember.init();
							setTimeout(function() {
								$.processOFF();
								var successModal = $(this).showModalFlat('INFORMATION', $.lang[LANG]['manager.mypage.my-remove.success'], true, false, '', 'ok');
							}, '1000');

						}, 'json');
					}

					
				}, 'cancel', 'manager.mypage.my-remove.last-btn', 'mng-mypage-modal'); /*removeModal:: END*/



			}, 'cancel', '', 'w480 mng-mypage-modal'); /*agreeModal:: END*/


		}
	});



	/******************************************************************************************************************************************Mypage Modal END*/

});

/***********************************************************************************************************************************member-config page START*/
var collectionSortable = function(cancel) {
	cancel = (cancel) ? cancel : '.collection-item.fix[data-type="email"], .collection-item-used, .collection-item-optional, .collection-name-input, button, .collection-edit, .collection-delete, label, .collection-item-type-select';

	$('#join-collections,#mjoin-collections').sortable({
		items: '.collection-item:not(.fix[data-type="email"])',
		cancel: cancel,
		scroll: true,
		placeholder: 'collection-item-placeholder',
		update: function(event,ui) {
			$.processON();

			var update_data = {},
				new_data = {},
				d_index = 0;
		
			
			$('#join-collections').children('.collection-item').each(function(i,v){
				var org_idx = $(this).attr('data-idx'),
					new_idx = $(this).index(),
					item_seq = $(this).attr('data-seq');
				
				if(org_idx!=new_idx) {
					$(this).attr('data-idx',new_idx);
					update_data[d_index] = {
						seq : item_seq,
						idx : new_idx
					}
					d_index++;
				}				
			});			
			
			$.ajax({
				type: 'POST',
				url: '/umember/setJoinCollections/type/jcol_update',
				data: { sid: SID, update_data: update_data },
				dataType: 'json',
				async: true,
				success: function(data) {
					if(typeof data.error != 'undefined' && data.error) {
						alert(data.error);
						return false;
					}
			
					var slog_field = {'field_name':$(ui.item).find('.collection-name').text().trim(),'field':$(ui.item).attr('data-type')};
					setSiteLogs('um.config.collection','sort',slog_field,'um.config.collection');
				},
				complete: function () {
					$.processOFF();
				}
			});
		}
	}).disableSelection();

}

var collectionItem = function(name,etc) {
	var types = '';

	$.each(COLLECTION_TYPES, function(k,v) {
		types = types + '<option value="' + k + '" '+((k == 'text') ? 'selected' : '')+'>' + v + '</option>';
	});

	var jcollection_select_type = ['text','memo','radio','check','select'],
		collectionAdd = (!name) ? 'additem' : '',
		str = '\
		<div class="collection-item ' + collectionAdd + '" data-type="etc' + etc + '" data-etc="' + etc + '" data-orgjcoltype="text" data-jcoltype="" data-seq="">\
			<div class="collection-info">\
				<span class="icons icon-move hand">\
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14">\
						<polygon points="14 7 11 4 11 6 8 6 8 3 10 3 7 0 4 3 6 3 6 6 3 6 3 4 0 7 3 10 3 8 6 8 6 11 4 11 7 14 10 11 8 11 8 8 11 8 11 10 "/>\
					</svg>\
				</span>\
				<span class="collection-name">' + name + '</span>\
			</div>\
			<input type="text" id="collection-name-text" name="name" class="setting-input collection-name-input hide jcol-text"  value="'+ name +'" placeholder="'+$.lang[LANG]['manager.config.jcollection.item.placeholder.collection-name-input']+'">\
			<div class="collection-config">\
				<div class="icons hand">\
					<svg class="collection-edit memberconfig-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13">\
						<path d="M4.32 8.05C4.2 8.39 4.46 8.71 4.79 8.71c0.05 0 0.11-0.01 0.16-0.03L7 8l6-6 -2-2L5 6 4.32 8.05zM5.87 6.54L11 1.41 11.59 2 6.46 7.13 5.58 7.42 5.87 6.54z"/>\
						<path d="M9 11c0 0.55-0.45 1-1 1H2c-0.55 0-1-0.45-1-1V4c0-0.55 0.45-1 1-1h3V2H2C0.9 2 0 2.9 0 4v7c0 1.1 0.9 2 2 2h6c1.1 0 2-0.9 2-2V8H9V11z"/>\
					</svg>\
				</div>\
				<div class="icons hand">\
					<svg class="collection-delete memberconfig-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 13" width="13" height="13">\
						<path d="M12 2h-1H9V0H3.02v2H1 0v1h1v8c0 1.1 0.9 2 2 2h6c1.1 0 2-0.9 2-2V3h1V2zM4.02 1H8v1H4.02V1zM10 11c0 0.55-0.45 1-1 1H3c-0.55 0-1-0.45-1-1V3h1.02H9h1V11z"/>\
						<rect x="4" y="4" width="1" height="7"/><rect x="7" y="4" width="1" height="7"/>\
					</svg>\
				</div>\
				<div class="use-option-check">\
					<div class="checkboxs hand newcheckbox">\
						<label>\
							<div class="newcheckboxSvg">\
								<input type="checkbox" class="collection-item-used" id="collection-item-used-additem"/>\
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path d="m1.4 2.6 2.2 2.2C2.2 5.9 1.1 7.3.5 9c1.2 3.5 4.6 6 8.5 6s2.7-.3 3.9-.9l2.5 2.5 1.2-1.2-14-14-1.2 1.2ZM9 13c-2.2 0-4-1.8-4-4s.3-1.5.7-2.1L6.8 8c-.2.3-.2.7-.2 1.1 0 1.4 1.1 2.5 2.5 2.5s.7 0 1.1-.2l1.1 1.1c-.6.4-1.3.7-2.1.7Zm.6-6.4c.9.2 1.6.9 1.9 1.9L9.6 6.6ZM8.1 5.1 6.4 3.4C7.2 3.1 8.1 3 9 3c3.9 0 7.2 2.5 8.5 6-.5 1.3-1.2 2.4-2.1 3.4l-2.5-2.5c0-.3.1-.6.1-.9 0-2.2-1.8-4-4-4s-.6 0-.9.1Z"/></svg>\
								<svg class="active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path d="M9 3C5.1 3 1.8 5.5.5 9c1.2 3.5 4.6 6 8.5 6s7.2-2.5 8.5-6C16.3 5.5 12.9 3 9 3Zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Zm2.5-4c0 1.4-1.1 2.5-2.5 2.5S6.5 10.4 6.5 9 7.6 6.5 9 6.5s2.5 1.1 2.5 2.5Z"/></svg>\
								<!--<label for="collection-item-used-additem"></label>-->\
							</div>\
						</label>\
					</div>\
					<div class="checkboxs hand newcheckbox">\
						<label>\
							<div class="newcheckboxSvg">\
								<input type="checkbox" class="collection-item-optional" id="collection-item-optional-additem"/>\
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">\
									<path d="M13 0H3C1.3 0 0 1.3 0 3v10c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3V3C16 1.3 14.7 0 13 0zM15 13c0 1.1-0.9 2-2 2H3c-1.1 0-2-0.9-2-2V3c0-1.1 0.9-2 2-2h10c1.1 0 2 0.9 2 2V13z"/>\
								</svg>\
								<svg class="active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">\
									<path d="M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0zM13.03 6.03l-5.5 5.5C7.38 11.68 7.19 11.75 7 11.75s-0.38-0.07-0.53-0.22l-3.5-3.5c-0.29-0.29-0.29-0.77 0-1.06s0.77-0.29 1.06 0L7 9.94l4.97-4.97c0.29-0.29 0.77-0.29 1.06 0S13.32 5.74 13.03 6.03z"/>\
								</svg>\
								<!--<label for="collection-item-optional-additem"></label>-->\
							</div>\
						</label>\
					</div>\
				</div>\
			</div>\
			<div class="clear"></div>\
			<div class="collection-item-content" style="display:none;">\
				<div class="collection-item-content-wrap">\
					<div class="collection-type-selectbox common-selectbox">\
						<select name="jcollection-select-type" class="setting-small-input selectpicker dropdown jcollection-select">\
					';
					$.each(jcollection_select_type, function(i,v){
						var selected = (v=='text') ? 'selected' : '';
		str +=			'<option class="jcollection-type-opt" value="'+v+'" '+selected+'>'+$.lang[LANG]['manager.config.siteUM.jcollections.'+v]+'</option>';
					});
		
		str +=		'\
						</select>\
						<svg viewBox="0 0 8 4" width="8" height="4"><polygon points="0 0 4 4 8 0 "></polygon></svg>\
					</div>	\
					<span class="collection-type-info hand">\
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5.5 12c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5Zm1 0c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5S15 6.5 12 6.5 6.5 9 6.5 12Zm5 3.5v-1h1v1h-1Zm0-2c0-.7.3-1.3.9-1.7.4-.3.7-.8.8-1.3 0-.5-.4-.9-.9-1h-.1c-.6 0-1 .1-1.1.8v.2h-1v-.2c0-1.1 1-1.9 2-1.8h.1c1 0 2 .7 2 1.8v.1c0 .7-.4 1.4-1 1.9-.6.6-.7.9-.7 1.2h-1Z"/></svg>\
					</span>\
				</div>\
				<div class="description-wrap hide">\
					<div class="description-input hide">\
						<div class="cl-common-form-wrap nonplace-holder">\
							<div class="cl-common-form-group">\
								<input type="text" id="collection-description-text" name="description" class="setting-input description-text jcol-text"  value="" placeholder="'+$.lang[LANG]['manager.config.siteUM.jcollections.description.placeholder']+'">\
							</div>\
						</div>\
					</div>\
					<div class="newcheckbox hand">\
						<label>\
							<div class="newcheckboxSvg">\
								<input type="checkbox" class="" id="collection-description" name="description" value="">\
								<svg viewBox="0 0 16 16" width="16" height="16">\
									<path class="st6" d="M3 0h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H3c-1.66 0-3-1.34-3-3V3C0 1.34 1.34 0 3 0z"></path>\
									<path class="st19" d="M13 1c1.1 0 2 0.9 2 2v10c0 1.1-0.9 2-2 2H3c-1.1 0-2-0.9-2-2V3c0-1.1 0.9-2 2-2H13M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0L13 0z"></path>\
								</svg>\
								<svg class="active" viewBox="0 0 16 16" width="16" height="16">\
									<rect x="2" y="2" class="st6" width="12" height="12"></rect>\
									<path class="st19" d="M13 0H3C1.34 0 0 1.34 0 3v10c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V3C16 1.34 14.66 0 13 0zM13.03 6.03l-5.5 5.5C7.38 11.68 7.19 11.75 7 11.75s-0.38-0.07-0.53-0.22l-3.5-3.5c-0.29-0.29-0.29-0.77 0-1.06s0.77-0.29 1.06 0L7 9.94l4.97-4.97c0.29-0.29 0.77-0.29 1.06 0S13.32 5.74 13.03 6.03z"></path>\
								</svg>\
							</div>\
							'+$.lang[LANG]['manager.config.siteUM.jcollections.description.text']+'\
						</label>\
					</div>\
				</div>\
				<div class="jcol-btn-wrap">\
					<div class="jcol-btn-cancel jcol-btn hand">\
						'+$.lang[LANG]['manager.config.jcollection.item.btn.cancel']+'\
					</div>\
					<div class="jcol-btn-save jcol-btn hand">\
						'+$.lang[LANG]['manager.config.jcollection.item.btn.save']+'\
					</div>\
				</div>\
			</div>\
		</div>\
	';
	return str;
}

var addCollectionInput = function(cl_name) {
	var cl_name = (typeof cl_name == 'undefined' || !cl_name) ? '' : cl_name,
		str = '\
		<div class="collection-update">\
			<div class="input-group">\
				<input type="text" class="collection-update-name form-control" placeholder="' + $.lang[LANG]['manager.join.cl.item.name.enter'] + '" value="' + cl_name + '"/>\
				<span class="input-group-btn">\
					<button class="collection-update-save btn btn-active">\
						<svg viewBox="0 0 15 10" width="15" height="10"><path d="M14.29 0L5.5 8.79 0.71 4 0 4.71l5.15 5.15C5.24 9.95 5.37 10 5.5 10s0.26-0.05 0.35-0.15L15 0.71 14.29 0z"/></svg>\
					</button>\
				</span>\
				<div class="collection-update-cancel"><svg viewBox="0 0 12 12" width="12" height="12"><polygon points="12 0.71 11.29 0 6 5.29 0.71 0 0 0.71 5.29 6 0 11.29 0.71 12 6 6.71 11.29 12 12 11.29 6.71 6"/></svg></div>\
			</div>\
		</div>\
	';
	return str;
}

//keyup birth
var auto_date_format = function( e, oThis ){        
    var num_arr = [ 
        97, 98, 99, 100, 101, 102, 103, 104, 105, 96,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57
    ]      

    var key_code = ( e.which ) ? e.which : e.keyCode;

    if((num_arr.indexOf( Number( key_code ) ) != -1) || (key_code != 229) || (key_code != 0)){
	    var len = oThis.value.length;
	    if( len == 4 && (key_code != 8)) oThis.value += '-';
	    if( len == 7 && (key_code != 8)) oThis.value += '-';
    }
}

var myinfoChangeBtn = function(e) {
    var sid = (typeof $(e).attr('data-sid')!='undefined') ? $(e).attr('data-sid') : property['SID'];
    if(property.UMEMBER.check_sns) {
        $(location).attr('href','/_myinfo');
        return false;
    }

    var str = '\
        <div>\
            <div class="cl-s-form-wrap">\
                <div class="cl-s-form-group">\
                    <input type="password" class="cl-s-form-control" id="check-password" required="required">\
                    <label for="input" class="cl-s-control-label">'+ $.lang[LANG]['manager.mypage.personal.info.pw.input'] +'</label>\
                </div>\
            </div>\
        </div>\
    ';

    $('.flat-modal .modal').modal('hide');
    var checkMyinfoPwMdoal = $(e).showModalFlat($.lang[LANG]['manager.mypage.personal.info.pw.title'],str,true,true,function () {

        var pw_val = $('#check-password').val().trim();
        if(!pw_val) {
            $('#check-password').closest('.cl-s-form-wrap').addClass('empty');
            $('#check-password').focus();
            return false;
        } else if(checkEmojis(pw_val)) {
            $('#check-password').focus();
            return false;
        }
        
        $.post('/_check_mypw', { sid:sid, pw:hex_md5(pw_val) }, function(data) {
            if(typeof data.error != 'undefined' && data.error) {
                $('#check-password').closest('.cl-s-form-wrap').removeClass('empty').addClass('error');
                if($('#check-password').closest('.cl-s-form-wrap').find('.cl-s-control-label.error').length > 0) {
                    $('#check-password').closest('.cl-s-form-wrap').find('.cl-s-control-label.error').html(data.error);
                } else {
                    $('#check-password').after('<label for="input" class="cl-s-control-label error">' + data.error + '</label>');
                }
                $('#check-password').val('').focus();
                return false;
            } else {
                checkMyinfoPwMdoal.modal('hide');
                $(location).attr('href','/_myinfo');
            }
        },'json');

    },'닫기',$.lang[LANG]['manager.mypage.personal.info.pw.btn'],'cl-s-product-pw cl-modal cl-s-btn w620',false,'', function() {

        $('.cl-s-product-pw .cl-s-form-group').on('click',function(e) {
            if($(e.target).hasClass('cl-s-form-group')) {
                $(e.target).find('.cl-s-form-control:not([type=hidden])').focus();
            }
        });

        $('.cl-s-product-pw .cl-s-form-control').on({
            keyup: function(e) {
                if($(this).val().trim().length == 0) {
                    $(this).closest('.cl-s-form-wrap').removeClass('error');
                    $(this).closest('.cl-s-form-wrap').find('.cl-s-control-label.error').remove();
                }
            },
            focus: function(e) {
                $(this).closest('.cl-s-form-wrap').addClass('active');
            },
            blur: function(e) {
                $(this).closest('.cl-s-form-wrap').removeClass('active');

                var val = $(this).val().trim();
                if(val.length == 0) {
                    $(this).closest('.cl-s-form-wrap').removeClass('error').addClass('empty');
                    $(this).closest('.cl-s-form-wrap').find('.cl-s-control-label.error').remove();
                    return false;
                } else if(checkEmojis(val)) {
                    $('#check-password').closest('.cl-s-form-wrap').removeClass('empty').addClass('error');
                    if($('#check-password').closest('.cl-s-form-wrap').find('.cl-s-control-label.error').length > 0) {
                        $('#check-password').closest('.cl-s-form-wrap').find('.cl-s-control-label.error').html($.lang[LANG]['config.unable.emoji']);
                    } else {
                        $('#check-password').after('<label for="input" class="cl-s-control-label error">' + $.lang[LANG]['config.unable.emoji'] + '</label>');
                    }
                    $('#check-password').val('').focus();
                    return false;
                }

                $(this).closest('.cl-s-form-wrap').removeClass('error').removeClass('empty');
                $(this).closest('.cl-s-form-wrap').find('.cl-s-control-label.error').remove();
            }
        });

    });
}

/*
var smsRechargeModal = function(sid) {
	var recharge_plan = {
		'plan-5000': { name : '5,000원', content: '250건', price: '20원'},
		'plan-10000': { name : '10,000원', content: '500건', price: '20원'},
		'plan-20000': { name : '20,000원', content: '1100건<span class="additional">(보너스 100건 포함)</span>', price: '18.2원'},
		'plan-30000': { name : '30,000원', content: '1800건<span class="additional">(보너스 300건 포함)</span>', price: '16.7원'},
		'plan-50000': { name : '50,000원', content: '3100건<span class="additional">(보너스 600건 포함)</span>', price: '16.1원'},
	}
	var modal_content = '\
		<div class="mng-modal-body recharge-modal">\
			<div class="row">\
				<div class="recharge-head clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-4 plan">금액별(VAT별도)</div>\
					<div class="col-xs-4 col-sm-4 col-md-6 content">충전 SMS 건수</div>\
					<div class="col-xs-4 col-sm-4 col-md-2 price">단가</div>\
				</div>\
	';
	$.each(recharge_plan, function(i,v) {
		modal_content = modal_content + '\
				<div class="recharge-item clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-4 plan">\
						<div class="radio-inline">\
							<input type="radio" id="recharge-'+ i + '" name="recharge-plan" value="'+ i +'">\
							<label for="recharge-' + i + '">' + v['name'] + '</label>\
						</div>\
					</div>\
					<div class="col-xs-4 col-sm-4 col-md-6 content">' + v['content'] + '</div>\
					<div class="col-xs-4 col-sm-4 col-md-2 price">' + v['price'] + '</div>\
				</div>\
		';
	});
	modal_content = modal_content + '\
				<div class="recharge-payment clearfix">\
					<div class="col-xs-4 col-sm-4 col-md-3">결제방법</div>\
					<div class="col-xs-4 col-sm-4 col-md-9">\
						<div class="radio-group">\
							<div class="radio-inline">\
								<input type="radio" class="payment-method-radio" id="payment-method-card" name="payment-method-radio" value="card">\
								<label for="payment-method-card">신용카드</label>\
							</div>\
							<div class="radio-inline">\
								<input type="radio" class="payment-method-radio" id="payment-method-vbank" name="payment-method-radio" value="vbank">\
								<label for="payment-method-vbank">가상계좌</label>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>\
	';

	var recharge_modal = $(this).showModalFlat('문자메시지(SMS) 충전', modal_content, true, true, function() {
		
		//문자메시지(SMS) 충전 기능 작업.


		recharge_modal.modal('hide');
	}, 'cancel', '충전하기', 'w480');

}
/*sms*/

var setJcolError = function(col_item, error_selector, error_text) {	
	var error_str = '\
		<div class="error_wrap '+error_selector+'-error">\
			<span class="error_svg">\
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13"><path d="M6.5 0C2.9 0 0 2.9 0 6.5S2.9 13 6.5 13 13 10.1 13 6.5 10.1 0 6.5 0Zm0 12C3.5 12 1 9.5 1 6.5S3.5 1 6.5 1 12 3.5 12 6.5 9.5 12 6.5 12ZM6 3h1v5H6V3Zm0 6h1v1H6V9Z"/></svg>\
			</span>\
			<span class="error_str">\
			'+$.lang[LANG]['manager.config.jcollection.item.error.'+error_text]+'\
			</span>\
		</div>';
		
	col_item.find('.'+error_selector+'.empty').removeClass('jcol_error').addClass('jcol_error');

	return error_str;
	
}

var getJcollectionItemOptionVal = function(t) {
	var opt_str = '';
	$.each(t.find('.jcollection-item-option'), function(i,v) {
		var opt_name = $(this).find('.jcol-option-name').val().trim(),
			split_str = (i==(t.find('.jcollection-item-option').length-1)) ? '' : '`',
			error_str = '';

		// if(!opt_name) {
		// 	$(this).find('.jcol-option-name').removeClass('empty').addClass('empty');
			
		// 	error_str = setJcolError(t, 'jcol-option-name', 'opt_name');
		// 	$(this).find('.error_wrap.jcol-option-name-error').remove();			
		// 	$(this).find('.jcol-option-name').after(error_str);
			
		// 	return false;
		// } else {
		// 	$(this).find('.jcol-option-name').removeClass('empty').removeClass('jcol_error');
		// 	$(this).find('.error_wrap.jcol-option-name-error').remove();
		// }

		// t.removeClass('empty');
		opt_str += opt_name + split_str;
	});

	return opt_str;
};

var setJoinCollectionData = function(t, sid){
	/*
		sid : sid
		mb_id : mb_id
		collection_type : email/addr/...etc1...
		used : true / false
		require : optional
		name : name
		type : type 	(text(단문형), memo(장문형), radio(단일선택형), check(다중선택형), select(목록선택형))
		idx : idx
		val : val      
		regdate : regdate
	*/

	var data = {};

	t.each(function(i,v) {
		var collection_type = (typeof $(this).attr('data-collectiontype')!='undefined') ? $(this).attr('data-collectiontype') : 'etc1',
			seq = (typeof $(this).attr('data-seq') != 'undefined') ? $(this).attr('data-seq') : '',
			used = (typeof $(this).attr('data-used') != 'undefined') ? $(this).attr('data-used') : 'false',
			require = (typeof $(this).attr('data-require')!='undefined') ? $(this).attr('data-require') : 'false',
			name = (typeof $(this).attr('data-name')!='undefined') ? (!$(this).attr('data-name') ? $(this).find('.jcollection_item_input').val() : $(this).attr('data-name')) : '',
			type = (typeof $(this).attr('data-type')!='undefined') ? $(this).attr('data-type') : 'text',
			idx = (typeof $(this).attr('data-idx')!='undefined') ? $(this).attr('data-idx') : '0',
			val = '';

		val = getJcollectionItemOptionVal($(this));
		
		used = (used===false) ? 'false' : 'true';
		require = (require===false) ? 'false' : 'true';
		
		data[collection_type] = {
			sid : sid,
			seq : seq,
			collection_type : collection_type,
			used : used,
			require : require,
			name : name,
			type : type,
			idx : idx,
			val : val
		}
	});
	console.log(data);

	return data;	
}















/*************************************************************************************************************************************member-config page END*/




/*************************************************************************************************************************************member-list page START*/
	
var getMemberListCheckData = function(el) {
	var select_count = el.closest('.mng-list').find('tr.active td.no input[type="checkbox"]:checked').length - 1,
		select_ids = el.closest('.mng-list').find('tr.active').map(function() {  return $(this).find('td.id').text().trim(); }).get(),
		select_name = '',
		select_names = '';

	if(select_count < 0) return { error: $.lang[LANG]['manager.list.member.selected.empty'] };
	el.closest('.mng-list').find('tr.active').map(function(i) { 
		if(i==0) select_name = $(this).find('td.id').text().trim();
		else select_names = select_names + ((select_names.length > 0) ? ', ' : '') + $(this).find('td.id').text().trim(); 
	});

	var result = {
		count	: select_count,
		ids 	: select_ids,
		name	: select_name,
		names	: select_names
	};

	return result;
}

// var dissmissCert = function(el, uid) {
// 	var id = $(el).attr('id');
// 	var dismiss = '';
// 	if(id == 'member-cert_date-button') {
// 		dismiss = 'cert';
// 	} else if (id == 'member-cert_adult_date-button') {
// 		dismiss = 'adult';
// 	}

// 	$.ajax({
// 		type: 'POST',
// 		url: '/umember/update/type/dismiss_cert',
// 		data: { sid : SID, uid : uid, dismiss : dismiss },
// 		dataType: 'json',
// 		async: true,
// 		success: function(data) {
// 			if(data.affected_rows > 0) {
// 				var modalTitle = '';
// 				if(data.um_cert == 'N') {
// 					modalTitle = '본인인증이 해제되었습니다.';
// 					$('.member-cert_date-wrap').html('');
// 				} else if (data.um_cert_adult == 'N') {
// 					modalTitle = '성인인증이 해제되었습니다.';
// 					$('.member-cert_adult_date-wrap').html('');
// 				}
// 				$(this).showModalFlat(modalTitle, '해당 계정의 인증이 해제되어 인증 이전 상태로 복구되었습니다.', true, false, function() {
// 					location.reload();
// 				}, 'ok', 'cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-close-btn');
// 			} else {
// 				alert('error');
// 			}
// 		}
// 	});
// }
/*************************************************************************************************************************************member-list page   END*/

var mngShowToast = function(icon,message,el,time) {
	if($('.mng-toast-wrap').length > 0 ) $('.mng-toast-wrap.remove').remove();
	if(typeof time == 'undefined') time = 800;
	var icon = "fa fa-"+icon,
		toast = '\
		<div class="mng-toast-wrap">\
			<div class="mng-toast">\
				<span class="mng-toast-icon"><i class="' + icon + '"></i></span>\
				<span class="mng-toast-message">' + message + ' </span>\
			</div>\
		</div>\
	';

	el.find('.mng-title, .mng-wrap').addClass('mng-toast-showing').animate({
		'opacity': 0.3,
		'pointer-events': 'none'
	}, { 
		duration: '.5s', 
		easing: 'easeInOutCubic'
	},50).delay(time).fadeIn(100, function() { 
		$(this).animate({
			'opacity': 1, 
			'pointer-events': 'auto'
		}, {
			duration: '.5s', 
			easing: 'easeInOutCubic'
		}, 100).removeClass('mng-toast-showing'); 
	});

	$(toast).appendTo(el).css({
		'opacity': 0,
		'margin-top': '-10px'
	}).animate({
		'opacity': 1,
		'margin-top': '0px'
	}, {
		duration: '.7s',
		easing: 'easeInOutCubic'
	},50).delay(time).fadeOut(100, function() { $(this).addClass('remove'); });

}

var howToApplyCert = function() {
	var mobile = (window.innerWidth<768) ? 'm.' : '',
	str = '\
			<div class="guide-top lang-'+LANG+'">\
				<h3 class="modal-title guidetitle">'+$.lang[LANG]['manager.cert.guide.title']+'</h3>\
				<div class="guide-menu">\
					<ul>';
					for (var i=0;i<3;i++) {
						var menuactive = (i==0) ? 'active' : '';
						str = str + '<li class="hand '+menuactive+'">';
						if(i==2) str = str + '<div class="line left"></div>';
						else if(i==1) {
							str = str +'\
								<div class="line left"></div>\
								<div class="line right"></div>\
							';	
						}
						str = str + '<p>'+$.lang[LANG]['manager.cert.guide.step.'+mobile+i]+'</p>';
						if(i==0) str = str + '<div class="line right"></div>';
						str = str + '</li>';
					};
		str +=	'\
					</ul>\
				</div>\
			</div>\
			<div class="guide-wrap">\
				<div class="step">\
					<div id="step1">\
						<h3>'+$.lang[LANG]['manager.cert.guide.step.1.title']+'</h3>\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.1.sub.title.1']+'</h4>\
						<p>'+$.lang[LANG]['manager.cert.guide.step.1.sub.1']+'</p>\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.1.sub.title.2']+'</h4>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_01_'+LANG+'.jpg">\
			';
			if(LANG == 'ko') {
				str +=	'\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.1.sub.title.3']+'</h4>\
						<p>'+$.lang[LANG]['manager.cert.guide.step.1.sub.3']+'</p>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_02_'+LANG+'.jpg">\
				';	
			}
			str +=	'\
					</div>\
					<hr class="line">\
					<div id="step2">\
						<h3>'+$.lang[LANG]['manager.cert.guide.step.2.title']+'</h3>\
						<div class="step2-step text-left"><span>STEP 01.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.1']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_03_'+LANG+'.jpg">\
						<div class="step2-step text-left"><span>STEP 02.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.2']+'</div>\
						<div class="step2-step text-left"><span>STEP 03.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.3']+'</div>\
				';
			if(LANG == 'ko') {
				str +=	'\
					 	<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_04_'+LANG+'.jpg">';
			} else {
				str +=	'\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_05_'+LANG+'.jpg">\
				';
			}
			str +=	'\
					 	<div class="step2-step text-left">\
					 		<span>STEP 04.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.4']+'\
					 	';
			if(LANG != 'ko') {
				str +=	'<p>'+$.lang[LANG]['manager.cert.guide.step.1.sub.3']+'</p>\
				';	
			}
			str += '\
					 	</div>';
			if(LANG == 'ko') {
				str += '\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_05_'+LANG+'.jpg">';
			}
			str += '\
					 	<div class="step2-step text-left"><span>STEP 05.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.5']+'</div>\
					 	<div class="step2-step text-left">\
					 		<span>STEP 06.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.6']+'\
					 		<p>'+$.lang[LANG]['manager.cert.guide.step.2.txt.6.sub']+'</p>\
					 	</div>\
					 	<div class="step2-step text-left"><span>STEP 07.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.7']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_06_'+LANG+'.jpg">\
						<div class="step2-step text-left"><span>STEP 08.</span>'+$.lang[LANG]['manager.cert.guide.step.2.txt.8']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_07_'+LANG+'.jpg">\
					</div>\
					<hr class="line">\
					<div id="step3">\
						<h3>'+$.lang[LANG]['manager.cert.guide.step.3.title']+'</h3>\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.3.sub.title.1']+'</h4>\
						<p>'+$.lang[LANG]['manager.cert.guide.step.3.txt.1-1']+'</p>\
						<div class="step3-step text-left"><span>STEP 01.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.1-2']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_08_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 02.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.1-3']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_09_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 03.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.1-4']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_10_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 04.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.1-5']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_11_'+LANG+'.jpg">\
						\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.3.sub.title.2']+'</h4>\
						<p>'+$.lang[LANG]['manager.cert.guide.step.3.txt.2-1']+'</p>\
						<div class="step3-step text-left"><span>STEP 01.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.2-2']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_12_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 02.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.2-3']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_13_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 03.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.2-4']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_14_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 04.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.2-5']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_15_'+LANG+'.jpg">\
						\
						<h4 class="text-left">'+$.lang[LANG]['manager.cert.guide.step.3.sub.title.3']+'</h4>\
						<p>'+$.lang[LANG]['manager.cert.guide.step.3.txt.3-1']+'</p>\
						<div class="step3-step text-left"><span>STEP 01.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.3-2']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_16_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 02.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.3-3']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_17_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 03.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.3-4']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_18_'+LANG+'.jpg">\
						<div class="step3-step text-left"><span>STEP 04.</span>'+$.lang[LANG]['manager.cert.guide.step.3.txt.3-5']+'</div>\
						<img class="img-responsive" src="//storage.googleapis.com/i.addblock.net/member/cert_guide/'+LANG+'/verification_guide_19_'+LANG+'.jpg">\
					</div>\
				</div>\
				<div class="modal-footer guideClose">\
					<button type="button" class="btn btn-default btn-sm close-button-dialog clostbtnfalse" data-dismiss="modal">'+$.lang[LANG]['config.close']+'</button>\
				</div>\
			</div>\
			';

	var certApplyGuideModal = $(this).showModalFlat('',str,true,false,'','close','','guidePopup cl-cmmodal cl-s-btn cover w700 cert-guide-modal', false ,'',function() {
		$(window).resize(function () {
			var mobile = (window.innerWidth<768) ? 'm.' : '';

			$('.cert-guide-modal .guide-menu li').each(function(i) {
				$(this).find('p').html($.lang[LANG]['manager.cert.guide.step.'+mobile+i]);
			});
		});
		$.guidePopup.scrollevent();
	});
}

