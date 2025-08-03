var isAosBlock = false;
var isgalleryView = false;
var pageLoad = true;
var menuClickMove = false;

var RENDER = {
    init: function (property) {
		var History = window.History; 
		var b = property,
			URI = (b.PUBLISH) ? '/' : '/render',
			param = (b.PUBLISH) ? '/publish/true' : '',
			selectEL = '',
			galleryEL = new Object();
		var CERT_USERID = '';
		
    	this.b = b;
		this.b.pageContent = {};
		this.b.pageContent[b.PAGE] = b.INITPAGE;
    	this.b.URL = URI;
    	this.b.param = param;
    	this.history = window.History;
    	this.b.MENULIST = [];
    	this.galleryEL = galleryEL;		
 
    	_this = this;
    	$(window).ready(function() {
    		if(b.VALIDPLAN && $.inArray(b.VALIDTYPE, ['BN','SM']) > -1 && (b.CERT_USE == 'Y' || b.CERT_USE == 'A')) {
    			if(b.CERT_USE == 'Y') {
    				if(b.UMEMBER.check_login == true) isUserCertified(history);
    			} else {
    				isUserCertified(history);
    			}
    		}	

    		if(!b.VALIDPLAN && b.CERT_USE == 'A') {
    			isUserCertified(history);
    		}

			var checkIOS = ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) ? true : false;
			if(checkIOS) $('body').addClass('ios-bg-attachment-scroll');
    	
	        (function(window){
	            var History = window.History;
	            if ( !History.enabled ) {
	                return false;
	            }

	            History.Adapter.bind(window,'statechange',function(){
					$('.error_404.new_design').remove();

	                var State = History.getState(),
	                	cUrl = new getLocation(State.url),
	                	loc = cUrl.pathname,
	                	uri = (b.PUBLISH) ? loc.replace(/^\//,'').replace(/\/$/,'') : loc.replace(/\/*(render)\/*/,''),
	                	uri = uri.replace('/view/',','),
	                	s = uri.split(','),							
	                	bookmark = '';
						
						if (b && b.MODOO === true) {
								const inSubmenu = Array.isArray(b.SMENU) &&
								b.SMENU.some(menu =>
									Array.isArray(menu.children) &&
									menu.children.some(child =>
									child.name.replace(/ /g, "-") === decodeURI(uri)
									)
								);
								if (inSubmenu) {
									//console.log('현재 페이지 서브메뉴 존재');
									$('.cl-nav-section.sub').show();
								} else {
									//console.log('현재 페이지 서브메뉴 없음');
									$('.cl-nav-section.sub').hide();
								}
						}

					if(uri.match(/^(psearch|\_checkout|\_forgot|\_mypayment|\_lang)\//gi) !== null) {
	                	location.href = '/'+uri;
	                	return false;
	                }

					if(uri.match(/^_product\//gi) !== null) {
						uri = (b.PUBLISH) ? uri : 'render/' + uri;
						location.href = '/'+uri;
						return false;
					}
					// naverLogCallback(function() {
					// 	if("naver_log" in b.SETTINGS) {
					// 		if (!wcs_add) var wcs_add={};
					// 		wcs_add["wa"] = b.SETTINGS.naver_log;
					// 		if (!_nasa) var _nasa={};
					// 		wcs_do(_nasa);
					// 	}
					// });
	                if($('.cl-flat-modal').length > 0) $('.cl-flat-modal .modal').modal('hide');

	                if(uri == b.URL || uri == '') {
	                	uri = (b.ONE) ? 'index' : b.MENULINK[0];
	                }

	                (typeof s[1] != 'undefined') ? b.VIEW = s[1] : b.VIEW = '';
	                b.PAGE = decodeURI(uri);
	                if(b.PAGE.indexOf('@')>-1) {
	                	var tmp = b.PAGE.split('@');
	                	b.PAGE = tmp[0];
	                	bookmark = tmp[1];
	                }

	                if((b.PAGE).indexOf(',')>-1) {
	                	var tmp = b.PAGE.split(',');
	                	b.VIEW = tmp[1];
	                }
					
					$('.el-footer').css('visibility', 'hidden');
					$.processON();
					
			    	getParent(s[0],b.VIEW,b.PAGE);
					var pageMove = true;
						
			    	if(b.VIEW && s[0] != 'forum' && s[0] != 'psearch' && b.COUNT == 0 && !b.PUBLISH) {
			    		$(this).showModalFlat('INFORMATION','Page not found',true,false,'','ok');
			    		History.back();
			    		pageMove = false;
			    	}
			    	if(pageMove) {
						clearDsgnbody();
			    		pageLoad = true;
			    		var is_templates = checkTemplateSite(b.SID),
							menuVer06 = ($('.el-menu .cl-menu-option').length > 0) ? true : false;

			    		var menu_name = (b.VIEW) ? b.PAGE.split(',') : [b.PAGE],
			    			tmp_url = (is_templates || b.PUBLISH === false) ? '/render' : '',
							tmp_href = 'a[href="'+tmp_url+'/' + menu_name[0]+'"]',
			    			pagemenu_link = '#tpl-menu.nav li '+tmp_href;

			    		if(!$(pagemenu_link).parent().hasClass('active')) {
			              	$('#tpl-menu li').removeClass('active').removeClass('open');

			              	$(pagemenu_link).parent().addClass('active');
			              	if($(pagemenu_link).closest('.dropdown-menu').length>0) {
			                  	if($('body').width() > 768) {
			                  		$(pagemenu_link).closest('.dropdown').addClass('active');
			                  	} else {
			                  		$(pagemenu_link).closest('.dropdown').addClass('open');
			                  	}
			              	} else {
			                	if($('.el-menu > header').hasClass('navbar-fheader')) $('#mobile-nav li.menu-has-children ul.dropdown-menu').hide();
				                else {
				                  if($('body').width() <= 768) $('#tpl-menu li.dropdown ul.dropdown-menu').hide();
				                }
			              	}
			            }

						if(menuVer06) {
							$('.el-menu .cl-moption-row').removeClass('active');
							$('.el-menu .cl-moption-row '+tmp_href).closest('.cl-moption-row').addClass('active');
							if($('.el-menu .cl-moption-row '+tmp_href).closest('.cl-moption-row[data-parent]').length > 0) $('.el-menu .cl-moption-row '+tmp_href).closest('.cl-moption-col').find('.cl-moption-row:not([data-parent])').addClass('active');

							$('#mobile-nav li.menu-has-children').removeClass('open');
							$('#mobile-nav li.menu-has-children ul.dropdown-menu').hide();
							$('#mobile-nav '+tmp_href).closest('li.menu-has-children').addClass('open');
							$('#mobile-nav '+tmp_href).closest(' ul.dropdown-menu').show();
						}


			            if($('.shopping-more-wrap').length > 0) $('.shopping-more-wrap').remove();
			            // console.log('pageMove', $.cookie('prev-forum-view'));
			            if(s[0] != 'forum' && $.cookie('prev-forum-view') === undefined) {
			            	// console.log('forum cookie');
			            	$.each(document.cookie.split(';'), function(index, cookie) {
								var name = cookie.split('=')[0].trim();
								if (name.indexOf('forum_') === 0) {
					                $.removeCookie(name, {path:'/'})
									// document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
								}
							});
			            }
			            $.removeCookie('prev-forum-view', {path:'/'});
		    			var page_draw_stop = false;

						$.ajax({
							url: '/template/conf',
							data: { sid : b.SID, page : b.PAGE, publish : b.PUBLISH, siteum : b.SITEUM },
							dataType: 'json',
							type: 'POST',
							async: true,
							cache: false,
							success: function (data) {
								if(typeof data.url != 'undefined' && data.url) {
									page_draw_stop = true;
									location.href = data.url;
									return false;
								}

								b.ISLOCK = data.islock;
								b.HEADER = (data.overlay) ? 1 : 0;

								var isHeaderOldVer = ($('header').hasClass('cl-nav') === false) ? true : false,
									isSidebar = $('header').hasClass('sidebar');
								if(isHeaderOldVer) {
									if(b.HEADER && !isSidebar) {
										$('.header-empty').css('height',0);
										$('.header.el-menu').removeClass('fixed');
										$('header.navbar').addClass('transparent');
									} else {
										$('header.navbar').removeClass('transparent');
									}
								}

								$('#pageScript').remove();
								if(data.pageScript) $('body').append(data.pageScript);
								if(data.meta != null) {
									$.each(data.meta, function(k,v) {
										$('meta[name="' + k + '"]').attr('content',v);
										if(k == 'title') {
											$(document).prop('title', htmlspecialchars_decode(v));
										}
									});
								}
								if(data.og_others != null) {
									$.each(data.og_others, function(ok,ov) {
										var og_property = ok.replace(/\_\_/gi,':');
										if(ov != '') {
											if($('meta[property="' + og_property + '"]').length > 0) $('meta[property="' + og_property + '"]').attr('content',ov);
											else $('meta[property^="og:"]').eq($('meta[property^="og:"]').length - 1).after('<meta property="' + og_property + '" content="' + ov + '" data-dynamic="true"/>');
										} else {
											if($('meta[property="' + og_property + '"]').length > 0) $('meta[property="' + og_property + '"]').remove();
										}
									});
								}

								if(page_draw_stop) return false;
								$('body').find('.galProjectCss').remove();
								if($('.popup').length) $('.popup').remove(); //clear Popup;
								showPageCallback(showPage, function() {
									var pgmove_vMode = (typeof $('.mobilepc_ch').attr('data-desktop-option')!='undefined') ? $('.mobilepc_ch').attr('data-desktop-option') : '';
									pgmove_vMode = $.mpcWeb.mpcGetVpmode(pgmove_vMode,b.SETTINGS);
									if(b.VALIDPLAN && b.VALIDTYPE != 'PK') {
										if(typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) $.mpcWeb.mpcWebhtml(pgmove_vMode,b.pageContent[b.PAGE],b.SETTINGS.zoom,'pagemove');
									}

									setTimeout(function() {
										if(b.VALIDPLAN && b.VALIDTYPE != 'PK') {
											if(b.ONE && !b.VIEW || (b.PAGE == b.MENULINK[0]) && !b.VIEW) setSitePopup();
											$.siteBanner.init(true,true);
										}

										if(b.VALIDPLAN && (b.VALIDTYPE == 'BN' || b.VALIDTYPE == 'SM')) {
											if(typeof b.SETTINGS.fnav != 'undefined' && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
										}
										if(b.VALIDPLAN && b.VALIDTYPE != 'PK') {
											if(typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) mobileWebfnavCheck(pgmove_vMode);
										}
									}, 500);
								});

								if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
									setTimeout(function() {
										moveGallery($.cookie('gallery-item'));
									},500);
								} else if(typeof $.cookie('gallery') != 'undefined' && b.VIEW == '') {
									setTimeout(function() {
										moveGallery($.cookie('gallery'));
									},500);
								} else if(typeof $.cookie('forum-item') != 'undefined' && b.VIEW == '') {
									// console.log('fm_view', $.cookie('forum_content_view'));
									setTimeout(function() {
										if(typeof $.cookie('forum_content_view') != 'undefined'){
											var fm_view = $.cookie('forum_content_view');
											var fv = (fm_view !== undefined && fm_view)? fm_view.split('&'):array();
											var pid = (fv)? fv[0]:'';
											var row_id = (fv)? fv[1]:'';

											scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"] .tpl-forum-list-title[data-id="'+row_id+'"]', 1000);
											$.removeCookie('forum-item', { path: '/' });
											
											$('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]').click();
											// $.removeCookie('forum_content_view', { path: '/', expires: 12 * 60 * 60 * 1000 });
										} else {
											scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"]', 1000);
											$.removeCookie('forum-item', { path: '/' });
										}
									}, 500);
								} else {
									var url = window.location;
									setTimeout(function() {
										moveScroll(0,url.href);
									},300);
								}
								if(typeof b.SETTINGS.google != 'undefined' && b.SETTINGS.google.length > 0) {
									var https_check = (location.protocol=='https:') ? 'https:' : 'http:',
										host_url = b.URL +  b.PAGE;

									host_url = (b.PARENT && b.PARENT.mode=='project') ? (host_url.replace(/,/g,"/view/")) : host_url;  

									if(b.SETTINGS.google.indexOf('UA-') > -1) ga('send', 'pageview', location.pathname);
									else if(b.SETTINGS.google.indexOf('G-') > -1) {
										gtag('config', b.SETTINGS.google, {
											page_title: b.TITLE,
											page_location: https_check + '//'+ b.HOST + host_url,
											page_path: host_url
										});
									}
									//else gtag('config', b.SETTINGS.google , {page_path : location.pathname});
									//console.log(https_check + '//'+ b.HOST + host_url);
									// console.log('google analytics send, pageview');
								}
								if(typeof b.SETTINGS.npay_setting != 'undefined' && b.SETTINGS.npay_setting.onoff == true && b.SETTINGS.npay_setting.naver_log.length > 0) {
									wcs_do();
									// console.log('naverpay log');
								} else {
									if(typeof b.SETTINGS.naver_log != 'undefined' && b.SETTINGS.naver_log.length > 0) {
										wcs.inflow();
										wcs_do(_nasa);
										// console.log('naver analytics send, pageview');
									}
								}
								if(typeof b.SETTINGS.gtag_event != 'undefined' && typeof b.SETTINGS.gtag_event.page != 'undefined' && b.SETTINGS.gtag_event.page.length > 0) {
									if(typeof b.SETTINGS.gtag_event.type != 'undefined' && b.SETTINGS.gtag_event.type == 'event' && b.SETTINGS.gtag_event.page == b.PAGE) {
										// console.log(b.SETTINGS.gtag_event);
										var v0 = b.SETTINGS.gtag_event.val[0],
											v1 = b.SETTINGS.gtag_event.val[1],
											v2 = b.SETTINGS.gtag_event.val[2];

										gtag(b.SETTINGS.gtag_event.type,v0,{v1:v2});
										// gtag(b.SETTINGS.gtag_event.type, b.SETTINGS.gtag_event.val[0], { b.SETTINGS.gtag_event.val[1] : b.SETTINGS.gtag_event.val[2] });
									}
								
								}

								// menu ver3 : fheader
								setTimeout(function() {
									if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();
								},400);


								// favicon refresh
								var favicon = b.RESOURCE + '/' + b.SID + '/' + b.SID + '-favicon.ico?_' + new Date().getTime();
								changeFavicon(favicon);

								if(typeof pageMoveCallback == 'function') pageMoveCallback();
								formTranslate(LANG);
				
							}
						});
			    	}
	            });

				History.Adapter.bind(window, 'popstate', function() { // history.js suggests statechange but it has a bug with urls with hashes not firing statechange
	                var State = History.getState(),
	                	cUrl = new getLocation(State.url),
	                	bUrl = new getLocation(window.location.href);

	                if(b.ONE) {
	                	if(cUrl.href!=window.location.href) {
	                		if(b.PAGE!='index') {
	                			var link = (!b.PUBLISH) ? '/render/index' : bUrl.pathname;
								var url = new getLocation(link);
					        	golink(_this,url);
								history.pushState('', '', link + bUrl.hash);
	                		} else {
	                			// if(bUrl.hash) {
	                			// 	var go = (bUrl.hash).replace('#','');
	                			// 	moveLinkPage(go);
	                			// }
	                		}
	                	}
	                }
				});

	        })(window);

		    $('.dsgn-body').addClass('mode-render');
	    	//$.modalON();

			if(typeof b.SETTINGS == 'undefined') return;
			// if(typeof b.SETTINGS.rightClick == 'undefined' || b.SETTINGS.rightClick === false) return;
			if(!b.VALIDTYPE || b.VALIDTYPE == 'PK' || typeof b.SETTINGS.rightClick == 'undefined' || b.SETTINGS.rightClick === false) {
				b.SETTINGS.rightClick = false;
				return;
			}
		    $('body').on('contextmenu', function(event){ return false; });
			$('body').on('selectstart', '.element, .forum-view, .comment-list', function(event){ return false; });
	    	$('body').on('dragstart', '.element, .forum-view, .comment-list',  function(event){ return false; });

	    	// MutationObserver의 콜백 함수 정의
			const observerCallback = function(mutationsList) {
			  	for (const mutation of mutationsList) {
			    	if (mutation.type === 'childList') {
			      		// DOM 변화가 감지되면 AOS.refresh 호출
			      		AOS.refresh();
			    	}
			  	}
			};
			// MutationObserver 인스턴스 생성
			const observer = new MutationObserver(observerCallback);
			// 관찰할 옵션 정의
			const config = { 
			  	childList: true, 
			  	subtree: true
			};
			// 감지할 요소 선택
			const targetNode = document.querySelector('.dsgn-body');
			if (targetNode) {
			  	observer.observe(targetNode, config);
			}
	    });

		Pace.on('done', function() {
			/*shopping more create*/
			if($('.shopping-wrap').length && $('.shopping-wrap').height() >= 800 && $('.shopping-more').length == 0) {
				var more_txt = (LANG == 'ko') ? '상품정보 더보기' : 'MORE';
				var review_chk = ($('.cl-s-product-review').length > 0) ? true : false,
					qna_chk = ($('.cl-s-product-qna').length > 0) ? true : false;
				var colorSet = shopping_more_color,
					sm_font = (!colorSet) ? '' : colorSet.color,
					sm_bgColor = (!colorSet) ? '' : colorSet.background_color,
					sm_border = (!colorSet) ? '' : colorSet.border_color;
				$('.shopping-wrap').css('max-height','800px')
								   .css('overflow','hidden')
								   .after('<div class="shopping-more-wrap"><div class="shopping-more">'+more_txt+'</div></div>');
				$('.shopping-wrap').removeClass('open');
				if(sm_font) $('.shopping-more').css('color',sm_font);
				if(sm_bgColor) $('.shopping-more').css('background-color',sm_bgColor);
				if(sm_border) $('.shopping-more').css('border-color',sm_border);
				if(!review_chk && !qna_chk) $('.shopping-more-wrap').css('padding-bottom','100px');
			}
			
			var header_h = $('header').outerHeight();
			var menu_logo = $('.menu-logo-top');
			var menu_logo_h = (menu_logo.length > 0) ? menu_logo.outerHeight() : 0;
			$('.dsgn-body')[0].style.setProperty('--menu-logo-height', menu_logo_h+'px');
			$('.dsgn-body')[0].style.setProperty('--header-height', header_h+'px');

			setTimeout(function() { 
				$('body').removeClass('pace-disable'); 
			},500);
			if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
				moveGallery($.cookie('gallery-item'));
			}
			$.modalOFF();
			if(!property.ONE) {
				moveScroll(0);
			} else {
				// onepage index movescroll
				if(b.PAGE=='index' && b.MODE == 'publish' && !menuClickMove) {
					var bUrl = new getLocation(window.location.href),
						moveId = (bUrl.pathname).replace('/','');
					if(moveId != 'index') moveLinkPage(moveId);
				}
			}
			
			$.each($('.element'), function(k,v) {
				var checkNotSupported = false,
					not_supported_mode = '',
					check_video_version = true,
					bg_vid_gfyposter = (typeof $(this).find('.bgvid source.display').attr('src') != 'undefined') ? $(this).find('.bgvid source.display').attr('src') : '',
					vid_regex = /gfycat\.com/gi;
			
				if($(this).attr('data-type') == 'video' && typeof $(this).attr('data-playtype') == 'undefined' && (vid_regex.test(bg_vid_gfyposter))) {
					check_video_version = false;
					checkNotSupported = true;
					not_supported_mode = $(this).attr('data-type'),
					el_seq = $(this).attr('data-id');
				
					if(checkNotSupported) {
						var upgrade_check = (!check_video_version) ? false : true;
						$.notSupported.set(property.SID, el_seq, not_supported_mode, upgrade_check);
					}
				}
			});				

			// gallery block category sticky
			var stickyElements = document.querySelectorAll('.gallery-category-wrap.float');
			var allProductsElement = document.querySelectorAll('.allProducts-sort-wrap.float');
			var isSidebar = document.querySelector('.dsgn-body').classList.contains('sidebar');
			var parent = document.querySelector('html');

			if (stickyElements.length > 0) {
				stickyElements.forEach((stickyElement) => {
					window.addEventListener('scroll', () => {
						var scrollY = window.scrollY;
						var header = document.querySelector('header').clientHeight;
						var offset = stickyElement.offsetTop;
						var input_gjs = Array.from(stickyElement.parentNode.children).filter(function(child) {
							return child !== stickyElement && child.classList.contains("gjs");
						});
						if(input_gjs.length == 0) {
							if (scrollY >= offset) {
								stickyElement.style.position = 'sticky';
								if(!isSidebar) stickyElement.style.top = header + 'px';
								else stickyElement.style.top = '0px';
								$(parent).removeClass('aos-overflowX aos-height');
							} else {
								stickyElement.style.position = 'static';
								$(parent).addClass('aos-overflowX aos-height');
							}
						}
					});
				});
			} else if(allProductsElement.length > 0) {
				//allProducts category sticky
				// var parent = document.querySelector('body');

				window.addEventListener('scroll', () => {
					var scrollY = window.scrollY;
					var header = document.querySelector('header').clientHeight;
					var offset = allProductsElement[0].offsetTop;
					$('.dsgn-body')[0].style.setProperty('--header-height', header+'px');
					// console.log('scrollY: '+scrollY+', offset: '+offset);
					if (scrollY >= offset) {
						allProductsElement[0].style.position = 'sticky';
						if(!isSidebar) allProductsElement[0].style.top = header + 'px';
						// else allProductsElement[0].style.top = '0px';
						$(parent).removeClass('aos-overflowX aos-height');
					} else {
						allProductsElement[0].style.position = 'static';
						$(parent).addClass('aos-overflowX aos-height');
					}
				});
			}
		});
		// naverLogCallback(function() {
		// 	if("naver_log" in b.SETTINGS) {
		// 		if (!wcs_add) var wcs_add={};
		// 		wcs_add["wa"] = b.SETTINGS.naver_log;
		// 		if (!_nasa) var _nasa={};
		// 		wcs_do(_nasa);
		// 	}
		// });
		
		if(typeof pageMoveCallback == 'function') pageMoveCallback();
		formTranslate(LANG);

	    $('.dsgn-body').addClass('mode-render');

		var is_templates = (typeof property.SID != 'undefined') ? checkTemplateSite(property.SID) : false;

		//갤러리 블럭에서 카테고리가 비었습니다 문구가 영문 템플릿에서 한글로 나오는 이슈로 아래 코드 추가, 문제 시 삭제 or 위치변경
		if(is_templates && property.SID.indexOf('_en') > -1) LANG = 'en';

	    if(property.VALIDPLAN || is_templates) {
			$('body,.dsgn-body').removeClass('with-creatorlink');
	    } else {
	    	$('body,.dsgn-body').addClass('with-creatorlink');
	    }
	    // $('button.navbar-toggle').addClass('hide');
    	// (b.WRAP) ? $('.dsgn-body').addClass('tiny') : $('.dsgn-body').removeClass('tiny');

		var _ready = (!$.isEmptyObject(property.SETTINGS.modoo || {})) ? '_ready' : '';
		$('header').wrap(`<div class="header el-menu ${_ready}" data-el="el-menu" data-name="menu"></div>`);
		var $tag = $('header');
		changeBrokenImages($tag);

		$tag.removeClass('tpl-menu');
		if(b.ONE){
			if(b.VIEW) $tag.find('#site-home').attr('href',URI).removeClass('mini-home');
			else $tag.find('#site-home').attr('href','javascript:;').addClass('mini-home');
		} else $tag.find('#site-home').attr('href',URI).removeClass('mini-home');


		var first_elname = (b.HEADER && Object.keys(b.CONTENTS).length > 0) ? Object.keys(b.CONTENTS)[0] : '';
		if(first_elname && typeof b.CONTENTS[first_elname] != 'undefined' && b.CONTENTS[first_elname]['element']['overlap'] == 0) {
			b.HEADER = 0;					
		}

		var isHeaderOldVer = ($('header').hasClass('cl-nav') === false) ? true : false;
		var isSidebar = $tag.hasClass('sidebar');
		var isSiteLock = b.SITELOCK;
		if(isHeaderOldVer) {
			if(isSidebar) {
				$('.dsgn-body').addClass('sidebar');
				$('.header.el-menu').addClass('sidebar');		
			} else if(b.HEADER) {
				$('header.navbar').addClass('transparent');
			}

			header_fixed = $('header.navbar').height();
			menu_color = $('header.navbar').css('background-color');
			if(menu_color==('rgba(0, 0, 0, 0)')) {
				$('header.navbar').css('background-color',$('dsgn-body').css('background-color'));
			}
		}


		if(isSidebar) {
			if($tag.hasClass('hide') && $('.dsgn-body').hasClass('sidebar'))
				$('.dsgn-body').removeClass('sidebar');

			// console.log(isSiteLock);
			if(isSiteLock == 'true') {
				$('.dsgn-body').addClass('site_lock');
			} else {
				$('.dsgn-body').removeClass('site_lock');
			}
		}
		
		// footer
		$('.footer-' + b.SID).addClass('el-footer').addClass('element').attr('data-type','footer');

	    $(window).on('scroll',function() {
	    	if($('.dsgn-body').hasClass('mobile-nav-active')) return false;

			if($(this).scrollTop() > 200) {
				$('#goto-top').addClass('show');
			} else {
				$('#goto-top').removeClass('show');
			}

	        if($('.dsgn-body').hasClass('sidebar')==false) {
	            fixedMenu();
	        }

	        if($(this).scrollTop() == 0 && $('header').hasClass('navbar-fheader')) {
				setTimeout(function() { $.fheader.position(); }, 200);
			}
	        scrollspy();
	        //parallax();

	    });

		$(window).on('orientationchange',function(){
			if($('.blueimp-gallery-display').length) {
				var $slide = $('.blueimp-gallery .slides .slide'),
					play = $('.blueimp-gallery-playing').length,
					idx = 0;
				$.each($slide, function(i,v) {
		        	var trans = $(this).attr('style');
		        	if(trans.indexOf('translate(0px, 0px)') > 0) {
		        		idx = $(this).attr('data-index');
		        	}
				});

				var gallery = $('.blueimp-gallery-display').attr('id');

				$('#' + gallery + ' .close').click();
				$.processON();
				setTimeout(function() { 
					$.processOFF() ; 
					$('.gallery-item[data-index="' + idx + '"] a[data-gallery="#' + gallery + '"]').click(); 
					$('.layout-grid').eq(idx).find('a[data-gallery="#' + gallery + '"]').click(); 
					if(play) $('#' + gallery + ' .play-pause').click();
				}, 1000);
			}
		});

		var currentWindowWidth = $(window).width();
		$(window).resize(function () {
			$('.config-image-view').hide();
			if($('body').width() <= 768 && $('.dsgn-body').hasClass('sidebar')) {
				if($('header.navbar').hasClass('sidebar')) {
					cssSidebar('off');
				}
				//$('.dsgn-body').removeClass('sidebar').addClass('removed-sidebar');
			} else if ($('body').width() > 768 /*&& $('.dsgn-body').hasClass('removed-sidebar')*/) {
				if($('header.navbar').hasClass('sidebar')) {
					cssSidebar('on');
				}
				//$('.dsgn-body').removeClass('removed-sidebar').addClass('sidebar');
				var top = ($('.creatorlink-header').length == 1) ? '55px' : '0px';
				$('.el_0').css('margin-top',top);
				if($('.header-empty').length > 0) $('.header-empty').remove();
			}

            if( $('.header-empty').length > 0 && $('.header-empty').height() != $('.el-menu').height() ) {
            	$('.header-empty').css('height',$('.el-menu').height()+'px');
            }

			// menu ver3 : fheader
			if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();
			
	        if($('body').width() <= 768) {
	            if($('#tpl-menu li.active.dropdown').length > 0) $('#tpl-menu li.active.dropdown').removeClass('active');
	        } else {
	            if($('#tpl-menu li.active').closest('ul').hasClass('dropdown-menu')) $('#tpl-menu li.active').closest('li.dropdown').addClass('active');
	            $('#tpl-menu ul.dropdown-menu').removeAttr('style');
	        }

			// gallery option - gh
			if($('.element[data-type="gallery"] .goption[data-gh]').length > 0) refreshGalleryHeight();
			if($('.element[data-type="video"] .lyoption[data-lyh]').length > 0) setLayoutHeight();

	        var vpmode_opt = $('.mobilepc_ch').attr('data-desktop-option'),
     	 	   	vpmode = vpmode_opt ? vpmode_opt : b.SETTINGS.viewportMode,
         	    vpModeOnoff = (property.SETTINGS.vpMode_onoff === true) ? true : false,
         	    checkFnav = ($('.fnav').length > 0 && vpmode=='mobile_web') ? true : false,
         	    WebType = $.mpcWeb.mpcCheckWebType();

	        if($('.fnav').length > 0) {
	            if($('body').width() <= 480) {
	            	if($('#cl-music-player-icon').length > 0) $('#goto-top,#cl-music-player-icon').addClass('movedOne');
	            } 
	        }

	        if(vpModeOnoff && WebType == 'MOBILE') $.mpcWeb.mpcMusicandGoTop(checkFnav,vpmode);

	        fixedMenu();
	        scrollspy();
			$('.element[data-type="video"], .element[data-type="others"]').each(function() {
				resizeVideoIframe($(this));
			});

			//premium gallery setFixedscroll
			if($('.element[data-feature*=fixedscroll]').length > 0) gjs01SetFixedscroll($('.element[data-feature*=fixedscroll]').eq(0));
	        
	        if($('.fr-view').length) {
	            setForumWrap();
	        }

	        if($('.blueimp-gallery-display').length) {
		        var $slide = $('.blueimp-gallery .slides .slide'),
		            play = $('.blueimp-gallery-playing').length,
		            idx = 0;
		        $.each($slide, function(i,v) {
		            var trans = $(this).attr('style');
		            if(trans.indexOf('translate(0px, 0px)') > 0) {
		                idx = $(this).attr('data-index');
		            }
		        });

		        var gallery = $('.blueimp-gallery-display').attr('id');

		        $('#' + gallery + ' .close').click();
		        $.processON();
		        setTimeout(function() { 
		            $.processOFF() ; 
		            $('.gallery-item[data-index="' + idx + '"] a[data-gallery="#' + gallery + '"]').click(); 
		            $('.layout-grid').eq(idx).find('a[data-gallery="#' + gallery + '"]').click(); 
		            if(play) $('#' + gallery + ' .play-pause').click();
		        }, 1000);
		    }
	        sitePopupResize();

	        if($('.element[data-type="contact"][data-type2="franchise map"]').length > 0) {
	        	let newWidth = $(window).width();
	        	if (currentWindowWidth !== newWidth) {
			        $('.element[data-type="contact"][data-type2="franchise map"]').each(function(idx, v){
		        		var el = $(v);
		        		fmapMobilePaging(el);
		        	});
			    }
			    
			    currentWindowWidth = newWidth;
	        }

	        var checkFixTypeMenu = (typeof $('header.navbar-fheader').attr('data-fixtype') != 'undefined' && $('header.navbar-fheader').attr('data-fixtype')) ? true : false;
			if(b.VALIDPLAN && checkFixTypeMenu) {
	            if(window.innerWidth < 769) {
		            $('header.navbar[data-fixtype]').find('.navbar-brand').css('line-height','');
		            return false;
		        }
				setTimeout(function(){
					setFixedMenuCss(false);
				},80);
	        }

			var header_h = $('header').outerHeight();
			$('.dsgn-body')[0].style.setProperty('--header-height', header_h+'px');
	    });
	    this.liveUpdate(b.SMENU);

	    var checkToggleShow = (!b.MENUCHECK.main && window.innerWidth > 768) ? false : true,
			loc_pathname = window.location.pathname,
	    	is_render = (loc_pathname.match(/^\/render/g)) ? true : false,
	    	is_templates = (typeof b.SID != 'undefined') ? checkTemplateSite(b.SID) : false;
	    if(is_render && !is_templates) {
			if(window.parent && window.parent != this && $('#previewmain', window.parent.document).length > 0) {
				if($('#previewmain', window.parent.document).find('.preview-hand .active').is('#desktop, #tablet') && !b.MENUCHECK.main) checkToggleShow = false;
			}
	    }
	    if(checkToggleShow) $('button.navbar-toggle').css('visibility','visible');

		if(b.PAGE == 'psearch') $.psearch.view();

		var displaySnsShare = function(pid) {
			var checkUrl = b.PAGE.split(','),
				type = (checkUrl[0] == 'forum') ? 'F' : 'P',
				check_view_empty = (b.VIEW && b.COUNT == 1 && $('.error_404.element[data-name="error_404"]').length == 1) ? true : false,
				checkGalleryProjectClass = (type=='P') ? 'galProjectBg' : '';

			if(type == 'P' && (b.COUNT == 0 || check_view_empty)) return false;

		    var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
		    	
		    if(typeof option.sns_share_display == 'undefined' || !option.sns_share_display) {
		     	return false;
		    } else if ( option.sns_share_display == 'ON') {
		    	if(type == 'F') $('.tpl-forum-list-footer .tpl-page-toolbar .tpl-forum-toolbar-button.share').removeClass('hide');
		    	else {
		    		//var checkCss = ($('.galProjectCss').text().indexOf('.galProjectBg svg') > -1) ? true : false;
		            // var g_color = (typeof $('.dsgn-body').attr('data-gcolor')!='undefined') ? $('.dsgn-body').attr('data-gcolor') : '';
		            // if(g_color) {
		            //     var pr_rgba = hexToRgba(g_color),
		            //         galProjectCssStr = ($('.galProjectCss').length>0) ? $('.galProjectCss').text() : '';

		            //     galProjectCssStr += '.dsgn-body[data-gcolor="'+g_color+'"] .galProjectBg svg {fill: rgba('+pr_rgba.r+','+pr_rgba.g+','+pr_rgba.b+',0.6);}\n';
		            //     $('.galProjectCss').text(galProjectCssStr);
		            // }            
		            $('.tpl-page-footer').removeClass( 'hide' ).removeClass(checkGalleryProjectClass).addClass(checkGalleryProjectClass);
		            $('.tpl-page-footer .tpl-forum-toolbar-button.share').removeClass( 'hide' );
		            if($('.tpl-page-footer').hasClass('galProjectBg')) $('.tpl-page-footer').removeAttr('style').css('padding','30px 0px');
		    	}
		    }
		}
		var displayLike = function(pid) {
			var checkUrl = b.PAGE.split(','),
				type = (checkUrl[0] == 'forum') ? 'F' : 'P',
				check_view_empty = (b.VIEW && b.COUNT == 1 && $('.error_404.element[data-name="error_404"]').length == 1) ? true : false,
				checkGalleryProjectClass = (type=='P') ? 'galProjectBg' : '',
				j = (b.PARENT.elcss)? CSSJSON.toJSON(htmlspecialchars_decode(b.PARENT.elcss)):{},
        		elname = '.' + b.PARENT.element;
			if(!b.VALIDPLAN) return false;
			if(type == 'P' && (b.COUNT == 0 || check_view_empty)) return false;

		    var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
		    
		    if(typeof option.like_display == 'undefined' || !option.like_display) {
		     	return false;
		    } else if ( option.like_display == 'ON') {
		    	if(type == 'F') {
		    		$('.tpl-forum-list-footer .tpl-page-toolbar .tpl-forum-toolbar-button.like').removeClass('hide');
		    	} else {
		    		var like_fill = (option.gl_like_color !== undefined)? option.gl_like_color : ((b.PARENT.mode=='project') ? '#505050':'#fff');
            		var likeActive_fill = (option.gl_likeActive_color !== undefined)? option.gl_likeActive_color:'#ee445f';
		            
		            galProjectCssStr = ($('.galProjectCss').length>0) ? $('.galProjectCss').text() : '';
		            galProjectCssStr += '.tpl-page-footer-wrap .tpl-forum-toolbar-button.like .forum-like-cnt{color:'+like_fill+';}\n';
		            galProjectCssStr += '.tpl-page-footer-wrap .tpl-forum-toolbar-button.like > svg{fill:'+like_fill+';}\n';
		            galProjectCssStr += '.tpl-page-footer-wrap .tpl-forum-toolbar-button.like.active .forum-like-cnt{color:'+likeActive_fill+';}\n';
		            galProjectCssStr += '.tpl-page-footer-wrap .tpl-forum-toolbar-button.like.active > svg, .tpl-page-footer-wrap .tpl-forum-toolbar-button.like.active > svg > path:first-child {fill:'+likeActive_fill+';}\n';

		            $('.galProjectCss').text(galProjectCssStr);

		            $('.tpl-page-footer').removeClass( 'hide' ).removeClass(checkGalleryProjectClass).addClass(checkGalleryProjectClass);
		            $('.tpl-page-footer .tpl-forum-toolbar-button.like').removeClass( 'hide' );
		            if($('.tpl-page-footer').hasClass('galProjectBg')) $('.tpl-page-footer').removeAttr('style').css('padding','30px 0px');
		    	}
		    }
		}
		var displayBottomNav = function(pid) {
			var checkUrl = b.PAGE.split(','),
				type = (checkUrl[0] == 'forum') ? 'F' : 'P',
				check_view_empty = (b.VIEW && b.COUNT == 1 && $('.error_404.element[data-name="error_404"]').length == 1) ? true : false,
				checkGalleryProjectClass = (type=='P') ? 'galProjectBg' : '';

			if(type == 'P' && (b.COUNT == 0 || check_view_empty)) return false;

		    var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
		    if(typeof option.bottomNav_display == 'undefined' || !option.bottomNav_display) {
		    	return false;
		    } else if ( option.bottomNav_display == 'ON') {
		    	if(type == 'F') $('.tpl-forum-list-footer .tpl-page-toolbar .bottom-navigation').removeClass('hide');
		    	else {
		    		//var checkCss = ($('.galProjectCss').text().indexOf('.galProjectBg svg') > -1) ? true : false;
		            // var g_color = (typeof $('.dsgn-body').attr('data-gcolor')!='undefined') ? $('.dsgn-body').attr('data-gcolor') : '';
		            // if(g_color) {
		            //     var pr_rgba = hexToRgba(g_color),
		            //         galProjectCssStr = ($('.galProjectCss').length>0) ? $('.galProjectCss').text() : '';

		            //     galProjectCssStr += '.dsgn-body[data-gcolor="'+g_color+'"] .galProjectBg svg {fill: rgba('+pr_rgba.r+','+pr_rgba.g+','+pr_rgba.b+',0.6);}\n';
		            //     $('.galProjectCss').text(galProjectCssStr);
		            // }            
		            $('.tpl-page-footer').removeClass( 'hide' ).removeClass(checkGalleryProjectClass).addClass(checkGalleryProjectClass);
		            $('.tpl-page-footer .bottom-navigation').removeClass( 'hide' );
		            if($('.tpl-page-footer').hasClass('galProjectBg')) $('.tpl-page-footer').removeAttr('style').css('padding','30px 0px');
		    	}
		    }
		}

		$('[data-imglink="true"][attr-link]').live('click',function(){
	    	if($(this).is('[attr-link=""]')) return false;

		    var imgtarget = $(this).attr('data-target'),
		        imgshlink = $(this).attr('data-shlink'),
		        imgblank = $(this).attr('data-blank');

		    if(imgblank == '_blank') {
		        var openNewWindow = window.open('about:blank');
		            openNewWindow.location.href=imgshlink; 
		    } else {
		        location.href=imgshlink;
		    }
		});

		$('.menu-inner').on('scroll', function() {
	        $(this).next('.fh-line').show();
	        if($(this).scrollTop()==0) $(this).next('.fh-line').hide();
	    });

	    $("#mobile-nav #tpl-menu").on('scroll', function() {
	       	$(this).next('.fh-line').show();
	       	if($(this).scrollTop()==0) $(this).next('.fh-line').hide();
	    });

		$('.siteLANG ul a, .siteLANG-dmenu-wrap ul li a').live({
			click: function(e) {
				if(LANGLINK) return;
				e.preventDefault();
				var sid = (typeof SID != 'undefined' && SID) ? SID : property.SID,
					slang_code = $(this).attr('data-code'),
					slang_str = $(this).text().trim();

				changeLanguage(slang_code);
			}
		});

		$('.sitePopupTodayHide, .sitePopupClose').live({
			click: function() {
				if($(this).hasClass('sitePopupTodayHide')) $(this).find('input').click();
				var selectedPopup = $(this).closest('.modal-popup').attr('id');
				$('#' + selectedPopup).find('.popup-close').click();
			}
		});

		$('.popup-close').live({
		    click: function() {
		        var selectedPopup = $(this).closest('.modal-popup').attr('id'),
		            idx = $(this).closest('.modal-popup').attr('data-idx'),
		            ptime = $(this).closest('.modal-popup').attr('data-time'),
		            isTodayHide = $(this).closest('.modal-popup').find('.sitePopupTodayHide input').prop('checked'),
		            date = new Date();
		            
		        var ptime_val = {
					'always'    : 0,
					'onlyone'   : 365 * 24 * 60 * 60 * 1000,
					'week'      : 7 * 24 * 60 * 60 * 1000, 
					'day'       : 24 * 60 * 60 * 1000, 
					'12hour'    : 12 * 60 * 60 * 1000, 
					'6hour'     : 6 * 60 * 60 * 1000, 
					'2hour'     : 2 * 60 * 60 * 1000, 
					'1hour'     : 60 * 60 * 1000, 
					'30min'     : 30 * 60 * 1000, 
					'10min'     : 10 * 60 * 1000
		        };

		        if(isTodayHide) {
		        	date.setTime(date.getTime() + ptime_val['day']);
		        } else { 
		        	date.setTime(date.getTime() + ptime_val[ptime]);
		        }
		        $('#' + selectedPopup).fadeOut();
		        if(isTodayHide || (typeof ptime !='undefined' && ptime != 'always' && ptime != '')) { $.cookie(selectedPopup, true, { path: '/', expires: date}); }
		        else { $.removeCookie(selectedPopup, { path: '/' }); }
		    }
		});

		var displayBottomList = function(pid) {
			var checkUrl = b.PAGE.split(','),
				type = (checkUrl[0] == 'forum') ? 'F' : 'P',
				check_view_empty = (b.VIEW && b.COUNT == 1 && $('.error_404.element[data-name="error_404"]').length == 1) ? true : false;
			if(type == 'P' && (b.COUNT == 0 || check_view_empty)) return false;

			var option = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
			if(typeof option.bottomlist_display == 'undefined' || !option.bottomlist_display) return false;
			else if (option.bottomlist_display == 'ON') $.bottomlist.init();
		}

		var moveScroll = function(interval, loc) {
			if(typeof $.cookie('forum_content_view') != 'undefined') {
		    	if(window.location.href.indexOf('/forum/view/') == -1) $.removeCookie('forum_content_view', { path: '/', expires: 12 * 60 * 60 * 1000 });
		    	return false;
		    }
			var this_url = (typeof loc == 'undefined') ? document.URL : loc,
				url = (typeof this_url != 'undefined' && this_url) ? decodeURIComponent(escape(this_url)) : '';
		    link = url.split('#').pop();

		    if($.inArray(link,b.MENULINK) > -1 && b.ONE && !b.VIEW) {
		        moveLinkPage(link,interval);
		        $.removeCookie('gallery', { path: '/' });
		        $.removeCookie('gallery-item', { path : '/' });
		    } else if (url.match(/\@/g)) {
		        link = url.split('\@').pop();
		        var bookmark_link = url.substr(url.lastIndexOf('/')+1);
		        if(link) moveLinkPage(bookmark_link,800,true);
		    } else {
		    	$(window).scrollTop(0);
		    	setTimeout(function() {
					if(location.hash) {
						var hashArr = location.hash.split('#');
						var hash = hashArr[1];
						var hashseq = hashArr[2];
						if(hash && $('.element[data-name="' + hash + '"]').length) {
							var header_check = $("header").attr("data-fh-type");
							if (header_check != "sidebar") { var header_height = $("header").outerHeight(true); }	
							else {var header_height = 0;}														
							// $(window).scrollTop($('.element[data-name="' + hash + '"]').offset().top - header_height);

							if($('.tpl-forum-list-cont[data-id="' + hashseq + '"]').length == 0) {
							var offset_top = $('.element[data-name="' + hash + '"]').find('.list-item').offset().top;
							var win = $(window);
							var winHeight = win.height();
							win.scrollTop(offset_top - (winHeight / 2) + (header_height / 2));   

							} else {
							var offset_top = $('.tpl-forum-list-cont[data-id="' + hashseq + '"]').closest('.list-item').offset().top - header_height;
							var screen_half = ($(window).height() - header_height) / 2;
							// $(window).scrollTop(offset_top)
							$(window).scrollTop(offset_top - screen_half)
							}	

							// console.log($('.tpl-forum-list-cont[data-id="72334"]').length);
						}
					}
				});
		    }
		}

		var moveBookmark = function(page,bookmark,interval,target) {
			var page_arr = (typeof page == 'undefined') ? new Array() : page.split('\,'),
				view = (page_arr.length > 1) ? page_arr[1] : '';

		    interval = (typeof interval == 'undefined') ? 1200 : interval;
		    target = (typeof target == 'undefined') ? '' : target;

		    if( (view!='' && view==b.VIEW && !target) || (view=='' && !b.VIEW && page_arr[0]==b.PAGE && !target) ) {
		        moveLinkPage(page_arr[0]+bookmark,interval,true);
		    } else {
		        var linkUrl = '';
		        if(b.ONE) {
		            linkUrl = (view.length>0) ? '/index/view/' + view : '/index';
		            linkUrl = (!b.PUBLISH) ? '/render' + linkUrl + bookmark : linkUrl + bookmark;
		        } else {
		        	var url_str = (view.length>0) ? page_arr[0] + '/view/' + view : page;
		            linkUrl = (URI=='/') ? '/' + url_str + bookmark : URI + '/' + url_str + bookmark;  
		        }

		        if(target) {
					var openLinkPage = window.open('about:blank');
					openLinkPage.location.href=linkUrl;
		        } else {
					var url = new getLocation(linkUrl);		        	
		        	golink(_this,url);
		        	// location.replace(linkUrl);
		        }
		        
		    }
		}

		var moveLinkPage = function(link,interval,isblock) {
			interval = (typeof interval == 'undefined') ? 1200 : interval;
			if(typeof isblock == 'undefined') isblock = '';

		    var isBookmark = false, bookmark_arr = new Array();
		    link = decodeURIComponent(link);
			if(link.match(/\@/g)) { 
				isBookmark = true;
				bookmark_arr = link.split('\@');

				var check_link = true,
					is_visible_menu = false;

				$.each(b.SMENU, function (idx, obj) {
					if(is_o_page == obj.name.replace(/ /g,'-')) {
						if(!obj.link) check_link = false;
						if(obj.display == 'on') is_visible_menu = false;
					}
					if(obj.children) {
						$.each(obj.children, function (i, v){
							if(is_o_page == v.name.replace(/ /g,'-')) {
								if(!v.link) check_link = false;
								if(v.display == 'on') is_visible_menu = false;
							}
						});
					}
				});

				var is_here = ($('.element[data-bookmark="' + bookmark_arr[1] + '"]').length > 0 ) ? true : false,
					is_page = (b.PAGE.toLowerCase()==bookmark_arr[0].toLowerCase() || b.VIEW && b.VIEW == bookmark_arr[0]) ? true : false,
					is_o_page = (bookmark_arr[0].indexOf(',') > -1 && !b.VIEW) ? bookmark_arr[0].substring(0,bookmark_arr[0].indexOf(',')) : (b.VIEW) ? 'index' : bookmark_arr[0],
					// is_visible_menu = ($.inArray(is_o_page,b.MENULINK)>-1) ? true : false,
					// check_link = ( $('#tpl-menu li a[href*="'+is_o_page+'"]').length > 0 && $('#tpl-menu li a[href*="'+is_o_page+'"]').text().trim().replace(/ /gi,'-') == is_o_page ) ? false : true,
					is_link = (check_link && is_visible_menu && is_o_page != 'INTRO') ? true : false,
					is_visible = (check_link && is_visible_menu && is_o_page != 'INTRO') ? true : false;

				if( ( !is_visible_menu && is_o_page!='index' ) ||
					( /*!is_page &&*/ ( is_link || is_visible ) ) ||
					( is_page && !is_here ) )  { 
					if(is_visible_menu==false) ;
					else return false; 
				}
				link = 'element[data-bookmark="' + bookmark_arr[1] + '"]';
				
			} else {
			    link = (isblock=='') ? 'link-to-' + link : link;
			}


			if(isHeaderOldVer) {
				var header_fixed = ($('.dsgn-body').width()<769) ? $('.el-menu .navbar-header').height()-1 : $('#tpl-menu').height();
				if($('header').hasClass('navbar-fheader')) {
					header_fixed = $('header.navbar').outerHeight() - 1;
					// if($('header').find('.menu-logo-top').length > 0 && !$('.'+link).hasClass('el_0')) {
					// 	var tmp_el = document.querySelector('header .menu-logo-top'),
					// 		tmp_cs = window.getComputedStyle(tmp_el),
					// 		tmp_offset = tmp_el.offsetHeight + parseInt(tmp_cs.marginTop, 10) + parseInt(tmp_cs.marginBottom, 10);
	
					// 	header_fixed -= tmp_offset;
					// }
				}

				var offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed;
				if($('header.navbar').hasClass('disableOffset') && !$('.'+link).hasClass('el_0')) offset = 0;
				offset = (window.innerWidth > 768) ? offset : -header_fixed;
			} else {
				var offset = 0;
			}

		    // $('body').scrollTo('.'+link,interval,{offset:offset,easing :'easeInOutQuart'});

    		if($('.'+link).length==0) return;
		    var sTop = $('.'+link).offset().top + offset,
		    	duration = (typeof $('#tpl-menu').attr('data-duration') != 'undefined') ? parseInt($('#tpl-menu').attr('data-duration')) : 1000;

			sTop = (isAosBlock && $('.'+link).hasClass('el_0')==false && $('.menu-logo-top').length>0 && $('.menu-logo-top').css('display')=='block') ? sTop + $('.menu-logo-top').outerHeight() : sTop;

			if(clCheckBrowser('safari') && clCheckBrowser('mobile')) duration = 0;
	    	$('html, body').animate({
		        scrollTop: sTop
		    }, duration, 'easeInOutQuart',function(){
		    	if(isAosBlock) {
			    	// $('.element').addClass('aos-init');
			    	// $('.element').addClass('aos-animate');
			    	$.each($('.element'),function(){
						var aos = $(this).attr('data-aos-ch');
						$(this).attr('data-aos',aos);
						$(this).removeAttr('data-aos-ch');
					});
			    }
		    });
	    	
		    var menuStr = (!isBookmark) ? link.replace('link-to-','') : bookmark_arr[0];
		    setTimeout(function() {
		    	
		    	$('header #tpl-menu li a[href=#' + menuStr + ']').closest('li').addClass('active').siblings().removeClass('active');
		    	if($('#mobile-nav #tpl-menu li').length) $('#mobile-nav #tpl-menu li a[href=#' + menuStr + ']').closest('li').addClass('active').siblings().removeClass('active');
		    },1100);
		}

		var getParent = function(parent,id,page) {
		    if(id) {
		    	parent = (parent == 'forum') ? parent : 'project';
				$.ajax({
					url:'/template/get/parent/' + parent + '/id/' + id + '/sid/' + _this.b.SID + '/page/' + encodeURIComponent(page) + _this.b.param,
					type:'get',
					async:false,
                	cache: false,
					dataType:'json',
					success:function(data) {
						property.PRODINFO = (data.prod_onoff == "on") ? data.PRODINFO : '';
						_this.b.PARENT = data.PARENT;
						_this.b.COUNT = data.COUNT;
					}
				});
		    } else {
				property.PRODINFO = "";
				_this.b.PARENT = {};
				_this.b.COUNT = 0;
		    }
		}

		var showPageCallback = function(func,callback) {
		    func(b.MCSS, b.MSTYLE, b.MTAG, true);
		    if(typeof callback=='function') {
		    	callback();
		    }
		}

		var showPage = function (css, style, tag, prop) {
			if($('.fmcss').length > 0) $('.fmcss').remove();
		    $.each(style.children,function(k,v) {
		        if(k!='.dsgn-body') {
		            delete style.children[k];
		        }
		    });
    		elFooter();

			var isHeaderOldVer = ($('header').hasClass('cl-nav') === false) ? true : false,
				isSidebar = $('header').hasClass('sidebar');
			if(isHeaderOldVer) {
				if(b.HEADER && b.PARENT.mode == 'shopping') b.HEADER = 0;
				if(b.HEADER && !isSidebar) $('header.navbar').addClass('transparent');
	
				menu_color = $('header.navbar').css('background-color');
				header_fixed = $('header.navbar').height();
				if(menu_color==('rgba(0, 0, 0, 0)')) {
					$('header.navbar').css('background-color',$('dsgn-body').css('background-color'));
				}
			}

		    if(b.SETTINGS.sitePermit === 3) {
		    	var checkSiteLock = isSitePasswordLock();
		    } 

		    var is_lock_block = 'active';
			isMenuLock(function() {
				if(b.ISLOCK == 'true' && is_lock_block == '' || b.ISLOCK != 'true') elPush(prop);
				else {
					$('.el-footer').css('visibility', 'visible');
					$.processOFF();
				}
			});

			// menu active
			/* 190710 -  menu or sub-menu 일부 같을때 첫번째 메뉴에 active error 생겨서 주석 처리. */
			// if(b.PARENT.page) {
			// 	$('#tpl-menu li').find('a:contains("' + b.PARENT.page + '")').parent().addClass('active');
			// } else {
			// 	if(b.ONE) {
			// 		if(b.SMENU[0].display == 'off') $('#tpl-menu li').first().addClass('active');
			// 	} else if(b.PAGE) {
			// 		$('#tpl-menu li').find('a:contains("' + b.PAGE + '")').parent().addClass('active');
			// 	}
			// };

		    RENDER.setLoginout(b.LOGINOUT, b.SID, b.PUBLISH, b.PROFILEIMG);
		    $('body,html').animate({scrollTop: 0}, 300,'easeInOutQuart');
		}

		var loadPush = function(data) {
			// console.log(' page draw 02:: loadPush');

			// premium block
			$('body,html').removeClass('aos-height aos-overflowX');
			$('body').removeClass('overflow-hidden');
			$('body').removeAttr('data-gjs');

			var deferred = $.Deferred();
			var pageID = b.PAGE.split(','),
				chgBG = false,
				tmpTag = '',
				currentPAGE = b.PAGE,
				default_t_css = '', default_m_css = '';

			var is_templates = checkTemplateSite(b.SID);
			
			var checkGalleryView = (b.VIEW && b.PAGE.match(/^forum,/g) === null) ? true : false,
				checkShoppingView = (b.VIEW && b.PARENT.mode == 'shopping') ? true : false,
				page_pos = 0,
				site_settings = (typeof b.SETTINGS != 'undefined' && b.SETTINGS) ? b.SETTINGS : {};

			if($('body').hasClass('openPopupBanner') && b.MENULINK[0] != currentPAGE) {
				$.siteBanner.init(false,true);
			}
			if(typeof $.clnav.s != 'undefined') $.clnav.init();

	        $('#el-empty').empty();
	        $('.gallery-popup, .psearch-block').remove();
	        b.COUNT = data.length;

			var check_modoo = $('.dsgn-body').hasClass('modoo') ? true : false,
				fl_data = {};
				
			if(check_modoo) {
				fl_data = draw_floating();
			}

			function drawData(idx, val) {
				// console.log('drawData('+idx+','+val+')');
				page_pos += 1;
				var tag = htmlspecialchars_decode(val.eltag,'ENT_QUOTES'),
					settings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {},
					block_lang = (typeof settings.blocklang != 'undefined' && settings.blocklang) ? settings.blocklang : LANG,
					checkGalleryListSample = false,
					checkGalleryListEmpty = true,
					fontload = [];

				if(idx == 0 && b.HEADER) {
					var checkMenuHideBlock = ($('.el-menu.header').find('.hideBlockWrap').length > 0) ? true : false,
						checkHideBlock = (typeof settings.block_display != 'undefined' && settings.block_display == 'OFF') ? true : false;
					if(checkMenuHideBlock || checkHideBlock || val.overlap == 0 || $('header').hasClass('sidebar')) {
						b.HEADER = 0;
						$('header').removeClass('transparent');
						if($('header').hasClass('navbar-fheader')) $.fheader.position();
					}
				}

				if(val.type == 'project' && val.eltag.charAt(0) == '\<') tag = val.eltag;

				if(typeof val.fonts != 'undefined') {
					$.each(val.fonts, function(i,v) {
						if(b.ELFONTS.indexOf(i) < 0 && v) {
							b.ELFONTS.push(i);
							$('#loadfonts').append(v);
						}
					});
				}
				if(typeof val.webfonts != 'undefined' && val.webfonts) {
					$.each(val.webfonts, function(i2,v2) {
						if(b.ELFONTS.indexOf(i2) < 0 && v2) {
							b.ELFONTS.push(i2);
							WebFont.load({ google : { families : [ v2 ] }});
						}
					})
				}
				
				if($.inArray(val.type, ['gallery','shopping']) > -1) {
					$('#el-empty').append($(tag));
					$('#el-empty').find('[data-loop="true"]').html('');

					var nodes = $(tag).find('[data-loop="true"]').children('.grid'),
						p = $('#el-empty').children(),
						g = p.clone().removeClass().addClass('galleryPL'+val.seq).addClass('gallery-popup'),
						i = [],
						view = $(tag).find('[data-loop="true"]').data('view'),
						g_number = $(tag).find("[data-loop='true']").data('gallery-no'),
						total = 0;

					var checkLoadmoreInLoop = ($(tag).find('[data-loop="true"] .loadmore-wrap').length) ? true : false,
						glm = $(tag).find('.loadmore-wrap');

					$('#el-empty').after(g);
					$(g).after('<div class="gallery-empty"></div>');

					galleryEL[val.seq] = {
						'seq' : val.seq,
						'elname' : val.elname,
						'eltag' : tag,
						'folder' : val.folder,
						'mode' : val.mode,
						'elsettings' : val.elsettings,
						'feature' : val.feature,
						'type' : val.type,
						'type2' : val.type2,
						'searches' : val.searches
					};

					if(typeof view == 'undefined') view = 10;
					var cookie_page = 1,
						cookie_view = view,
						cookie_gallery_category = '',
						is_gc_cookie = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined' && $.cookie('gallery-category-'+val.seq).length > 0) ? true : false;
            		var cookie_gallery_orderby = 'recent';

					var category_onoff = (typeof settings.category_display != 'undefined' && settings.category_display) ? settings.category_display : 'OFF';
					var product_orderby_onoff = (typeof settings.product_orderby != 'undefined' && settings.product_orderby) ? settings.product_orderby : 'OFF';
					var align_rnd_onoff = (typeof settings.align_rnd != 'undefined' && settings.align_rnd) ? settings.align_rnd : 'OFF';
					if(val.mode != 'shopping') product_orderby_onoff = 'OFF';
					// var adultonly_onoff = (typeof settings.adult_only != 'undefined' && settings.adult_only) ? settings.adult_only : 'OFF';
					
					if(typeof $.cookie('loadmore-' + val.seq) != 'undefined' && $.cookie('loadmore-' + val.seq).length > 0) {
						cookie_page = $.cookie('loadmore-'+val.seq);
						cookie_gallery_category = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined') ? $.cookie('gallery-category-'+val.seq) : '';
	                    cookie_gallery_orderby = (typeof $.cookie('gallery-orderby-' + val.seq) != 'undefined') ? $.cookie('gallery-orderby-' + val.seq) : '';
						cookie_view = cookie_page * view;
					} else { 
						var checkCateHomeHide = (category_onoff == 'ON' &&
												typeof settings.category != 'undefined' && settings.category && 
												typeof settings.category_home_hide != 'undefined' && settings.category_home_hide) ? true : false;
						if(checkCateHomeHide) {
							var gc = settings.category.replace(/\|/g,'').split(',');
							cookie_gallery_category = gc[0];
							is_gc_cookie = true;

							$.cookie('gallery-catehome-' + val.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
						}
					}
					
					if(val.seq == 'all_products') {
					// 	cookie_page = (typeof $.cookie('gallery-page-all_products') !== 'undefined' && $.cookie('gallery-page-all_products') != '')? $.cookie('gallery-page-all_products') : 1;
						cookie_gallery_category = setAllProductsCurrentCat(settings);
					// 	cookie_view = cookie_page * view;
					} else {
						if(!property.VIEW) $.removeCookie('gallery-page-all_products', { path: '/' });
					}
					
					$.cookie('gallery-page-' + val.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
					$.cookie('gallery-category-' + val.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
	                $.cookie('gallery-orderby-' + val.seq, cookie_gallery_orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
					$.removeCookie('loadmore-' + val.seq, { path : '/' });  

					var el_gh = $(tag).find('.goption').attr('data-gh'),
						checkGalleryHeight = (typeof el_gh != 'undefined' && el_gh) ? true : false,
						checkGallerySVG = ($(tag).find('.gimg-svg-wrap').length > 0) ? true : false,
						checkGFrameTitleOFF = (val.mode == 'gallery' && (typeof settings.gframe_title_visible != 'undefined' && settings.gframe_title_visible == 'OFF')) ? true : false;

					var checkUseComment = checkUseCommentFunc(val.mode, val.eltag);
					var checkUseLike = checkUseLikeFunc(val.mode, val.eltag);

					var uri = getSearchURL();
					if (isObjectEmpty(uri) && _this.b.LUX && val.mode == 'shopping') {
						uri = val.searches.uri;
					}
					// if(uri.category_no == '') {
					// 	uri.category_no = (typeof settings.lux_category_no != 'undefined') ? settings.lux_category_no : '';
					// }
					
					var res;
					
					$.ajax({
						url: '/template/gallery/list/pid/' + val.seq + '/sid/' + b.SID + '/spage/' + currentPAGE + '/view/' + cookie_view + param,
						data: { g_mode: val.mode,  visible: true, sfl: 'category', stx: cookie_gallery_category, uri : uri, only : val.only_category, orderby: cookie_gallery_orderby},
						dataType: 'json',
						type: 'POST',
						async: false,
						cache: false,
						success: function (data) {
							var check_only_cate = (typeof data.only_category != 'undefined' && data.only_category === true) ? true : false;
							if(check_only_cate) {
								localStorage.setItem('searches',JSON.stringify(new Array(val.searches.uri[0])));
							}
	
							res = data;
							$.each(data.list, function (idx, v) {
								i.push(v);
							});
							total = (typeof data.total.list_total == 'undefined') ?  data.total : data.total.list_total;
							cookie_view = ( cookie_view > total ) ? total : cookie_view;
							// cookie_view = (cookie_view < total) ? cookie_view : total;

							if( total > 0 ) checkGalleryListEmpty = false;
							if( i.length>0 || (i.length==0 && is_gc_cookie) ) {
								var loop_count = nodes.length, item_index = 0;
								var elem = [];
								$.each(data.list,function(index,v) {
									loop_pos = index%loop_count;
									c = nodes[loop_pos];
                                	var isTitle = (v.title.length > 0) ? true:false;

									$(c).find('.non_text').removeClass('non_text');
									if(val.mode != 'shopping') {
										if(v.title.length==0) $(c).find('.figure.title').removeClass('non_text').addClass('non_text');
										if(v.caption.length==0) $(c).find('.figure.caption').removeClass('non_text').addClass('non_text');
									}

									v.title = (v.title.length>0) ? v.title : $.lang[block_lang]['editor.block.gallery.sample.title'];
									v.caption = (v.caption.length>0) ? v.caption : $.lang[block_lang]['editor.block.gallery.sample.caption'];

									$(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);
									
									var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
										img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + '/' + _this.b.SID + '/',
										img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

									var folder = (val.folder == 0) ? '' : val.folder + '/',
										src = getServeImage(v.image,val.folder,img_path),
										src_s0 = getServeImage(v.image,'0',img_path);
									if($(c).find('img').length > 0) $(c).find('img').attr('src',src);
									if(val.mode == 'shopping') {
										if($(c).find('img').length > 0) $(c).find('img').attr('alt',v.title);
									} else {										
 									    alt_replace	= v.alt.replace(/\s+|\n+/g, '-');  
		    	          				alt_replace.replace(/-+/g, '-')	
										if($(c).find('img').length > 0) $(c).find('img').attr('alt',alt_replace);										
									}
									if($(c).find('.g-img').length > 0) $(c).find('.g-img').css('background-image', 'url('+src+')');

									if(checkGallerySVG) {
										var gimgSVG = $(c).find('.gimg-svg-wrap svg');
										gimgSVG.find('pattern').attr('id','gimgSvg_'+val.elname+'_'+index);
										gimgSVG.find('image').attr('xlink:href', src);
										gimgSVG.find('polygon').attr('fill', 'url(#gimgSvg_'+val.elname+'_'+index+')');
									}

									var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
										glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

									if(glink) {
										if(glink.match(/^\@/g) !== null) {															// link-type: link-bookmark ==> a[attr-bookmark]
											var bookmark_seq = glink.replace(/^\@/g,'');
											if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
												glink = '';
												glink_target = '';
											}
										} else if(glink.match(/^flink\@[0-9]/gi) !== null) {										// link-type: link-file     ==> a[attr-flink]
											glink_target = '';
										} else if($.inArray(glink.replace(/^\//g,'').replace(/ /g,'-'),_this.b.MENULIST) > -1) {	// link-type: link-menu     ==> a[data-user-link]
										} else {																					// link-type: link-out      ==> a[attr-link]
											if(checkBase64Encode(glink)) glink = Base64.decode(glink);
										}
									}

									$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link').removeAttr('attr-flink');
									if (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON' && property['SITEUM'] >= 1) {
										$(c).addClass('gallery-item').addClass('nonePrice');
										$(c).find('a').attr('href', '#');
									} else {
										if(glink) {
											var glink_val = makeLinkUrl(glink, b.ONE, b.VIEW);
											$(c).find('a').attr('href',glink_val);

											if(glink.match(/^\@/g)) {
												$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
											} else if(glink.match(/^flink\@[0-9]/g) !== null) {
												$(c).find('a').attr('attr-flink',glink.replace(/^flink\@/g,''));
											// IE ERROR_includes__H.20210603
											// } else if(_this.b.MENULIST.includes(glink.replace(/ /g,'-'))) {
											} else if($.inArray(glink.replace(/ /g,'-'),_this.b.MENULIST) > -1) {
												$(c).find('a').attr('data-user-link',glink_val);
											} else {
												$(c).find('a').attr('attr-link',glink);
											}
										} else {
											if (val.mode == 'gallery') {
												src_s0 = src_s0 + '?gpos='+v.pos;

												$(c).find('a').attr('href', src_s0);
												$(c).find('a').attr('data-gallery', '#gframe-' + val.seq);
											} else {
												if(val.seq == 'all_products') {
													$(c).find('a').attr('href', v.product_url);
												} else {
													if(_this.b.LUX) $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/_product/' + v.seq);
													else $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/' + _this.b.PAGE + '/view/' + v.seq);
						
													// $(c).find('a').attr('href', ((URI=='/') ? '' : URI) + '/' + b.PAGE + '/view/' + v.seq);
												}		
											}
										}
									}

									if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
									else $(c).find('a').removeAttr('target');

									if(checkGFrameTitleOFF || !isTitle) $(c).find('a').attr('data-title', '');
									else $(c).find('a').attr('data-title', v.title);

									// if(adultonly_onoff == 'ON') $(c).addClass('adultonly');

									if(val.mode == 'shopping') {
										if($(c).find('.figure.basket').length == 0) {
											$(c).find('.figure').last().after('<div class="figure basket" data-oldver="true"><span class="basket-btn">장바구니 담기</span></div>');
										}
									}

									// caption
									var ftitle = $(c).find('h5.figure'),
										fcaption = $(c).find('p.figure').not('.comment'),
										fdatetime = $(c).find('.figure.datetime'),
										fhashtag = $(c).find('.figure.hashtag'),
										fbrand = $(c).find('.figure.brand'),
										fprice = $(c).find('.figure.price'),
										freview = $(c).find('.figure.review'),
										fcomment = $(c).find('.figure.comment'),
										flike = $(c).find('.figure.like'),
										fbasket = $(c).find('.figure.basket');

									if(fcomment.length < 1 && settings.comment_display == 'ON' && checkUseComment) {
										$(c).find('figcaption p.figure.caption').after('<p class="figure comment old-gl hide"><svg  viewBox="0 0 14 14" width="14" height="14"><path d="M7 1C3.13 1 0 3.24 0 6c0 1.66 1.14 3.13 2.89 4.04C2.71 11 2.23 12.38 1 13c0 0 3.09 0 5.19-2.04.27.03.54.04.81.04 3.87 0 7-2.24 7-5s-3.13-5-7-5zm0 9c-.25 0-.49-.01-.73-.03l-.45-.04-.32.31c-.6.58-1.31.97-1.98 1.23.17-.43.28-.86.35-1.25l.14-.73-.66-.34C1.88 8.39 1 7.21 1 6c0-2.17 2.75-4 6-4s6 1.83 6 4-2.75 4-6 4z"/></svg><span class="figure-comment-cnt"></span></p>');
										fcomment = $(c).find('.figure.comment');
									}

									if(flike.length < 1 && settings.like_display == 'ON' && checkUseLike){
	                                    if (fcomment.length > 0) {
	                                    	if(index == 0) fcomment.after('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
	                                    	else fcomment.after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
	                                    } else {
	                                    	if(index == 0) $(c).find('figcaption:not(.top) .figure:last-child').after('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
	                                    	else $(c).find('figcaption:not(.top) .figure:last-child').after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
	                                    }
			                            flike = $(c).find('.figure.like');
			                        }

									$(c).find('figcaption').removeClass('hide');
									if (v.title || v.caption) {					
										var gallery_caption = v.caption;
										gallery_caption = gallery_caption.replace(/\n/g,'<br />');

										ftitle.html(v.title);
										fcaption.html(gallery_caption);
										if(fdatetime.length > 0) fdatetime.text(v.datetime);
										if(fhashtag.length > 0) fhashtag.text(v.hashtag);
									}

			                        if(g_number) {
			                            var g_index = String(index + 1),
			                                g_num = g_index.padStart(g_number, '0');
			                            $(c).find('.figure.number').text(g_num);
			                        }

									if(fbrand.length > 0) {
										var fbrand_name = (typeof v.brand_name != 'undefined' && v.brand_name) ? v.brand_name : '';
										fbrand.html(v.brand_name);
									}

									if(val.mode == 'shopping' || val.seq == 'all_products') {
										fcomment.addClass('hide');
										flike.addClass('hide');
										v.price = typeof v.price != 'undefined' ? parseFloat(v.price) : 0;
										v.sale = typeof v.sale != 'undefined' ? parseFloat(v.sale) : 0;
										var checkPriceHidden = (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON') ? true : false,
											gallery_price = (v.price && !checkPriceHidden) ? v.price : 0,
											gallery_sale_price = (typeof v.sale != 'undefined' && v.sale > 0 && v.sale > v.price && !checkPriceHidden) ? v.sale : 0,
											gallery_sale_per = (typeof v.sale_per != 'undefined' && v.sale_per && !checkPriceHidden) ? v.sale_per+'%' : '',
											product_soldout = '품절',
											product_no_sale = (typeof settings.sh_soldout == 'string') ? settings.sh_soldout : '구매불가',
											product_status = '';
										if(v.status == 'off' && !checkPriceHidden) {
											product_status = '<span class="cl-sh-soldout">' + product_no_sale + '</span>';
										} else if(v.quantity_on == 'on' && v.quantity < 1 && !checkPriceHidden) {
											product_status = '<span class="cl-sh-soldout">' + product_soldout + '</span>';
										}

										$(c).find('.cl-sh-soldout').remove();
										if(product_status != '') $(c).attr('data-soldout',true);
										else $(c).removeAttr('data-soldout');

										$(c).find('.product-badge').remove();
										product_status += drawBadgeList(v.use_badge, data.badge_settings);

										$(c).find('.cl-sh-limit').remove();
										if(v.status == 'lim') {
		                                    if(v.sale_now == false) {
		                                        var product_limit = '<p class="cl-sh-limit">상품 구매 가능 기간이 아닙니다.</p>';
					                            if(freview.length > 0) {
					                                freview.after(product_limit);
					                            } else {
					                                $(c).find('figcaption:not(.top) .figure:last-child').after(product_limit);
					                            }
		                                    }
		                                }

										if($(c).find('ul.figure.price').length > 0) {
											// var price_off = (v.sale_price > 0 && v.sale_price > v.price) ? 100 - Math.floor((v.price / v.sale_price) * 100) : 0,
											// 	off_str = (price_off > 0) ? price_off + '% ' : ''
											var off_str = (v.sale_rate > 0) ? v.sale_rate + '% ' : '';
											if(!_this.b.LUX) off_str = gallery_sale_per;
											//Ver2
											if(!checkPriceHidden) {
												$(c).find('ul.figure.price .price-val').html('￦' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
												$(c).find('ul.figure.price .price-val').removeClass('hide');

												if(gallery_sale_price > 0 && gallery_price < gallery_sale_price) {
													$(c).find('ul.figure.price .price-sale').html('￦' + gallery_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
													$(c).find('ul.figure.price .price-sale-per').html(off_str);
													$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').removeClass('hide');
													if(_this.b.LUX && (v.hashtag).indexOf('특가세일') > -1 && $(c).find('ul.figure.price .sp-price').length == 0) {
														$(c).find('ul.figure.price .price-sale').after('<li class="sp-price">특가세일</li>');
													}
												} else {
													$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').addClass('hide').html('');
												}
												
												if(v.product_unit_str) {
													$(c).find('ul.figure.price').append(`<li class="price-unit-pricing">${v.product_unit_str}</li>`); // 단위당 가격
												}
											} else {
												$(c).find('ul.figure.price .price-val').html('￦0');
												$(c).find('ul.figure.price .price-val').addClass('hide');
											}
											if(val.seq == 'all_products' && checkPriceHidden) $(c).find('ul.figure.price').html('');
											if(product_status) $(c).find('ul.figure.price').append('<li>'+product_status+'</li>');

											var badge_size = getBadgeSize(data.badge_settings);
											$(c).find('.cl-sh-soldout').removeClass('badge-small badge-medium badge-large');
											$(c).find('.cl-sh-limit').removeClass('badge-small badge-medium badge-large');
											if(badge_size) {
												$(c).find('.cl-sh-soldout').addClass(badge_size);
												$(c).find('.cl-sh-limit').addClass(badge_size);
											}
										} else {
											//Ver1
											if(fprice.length == 0) fprice = fcaption;
											
											if(checkPriceHidden) fprice.html('');
											else fprice.html('<span class="figure-krw">￦</span>' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + product_status);
										}

										if($(c).find('ul.figure.review').length > 0) {
											var gallery_review = (v.review_onoff && v.review_cnt) ? v.review_cnt : 0;
											if(gallery_review > 0) {
												$(c).find('ul.figure.review, ul.figure.review li').removeClass('hide');
												$(c).find('ul.figure.review .figure-review-cnt').html(gallery_review);
												$(c).find('ul.figure.review .figure-review-score').html(v.review_score);
											} else {
												$(c).find('ul.figure.review, ul.figure.review li').addClass('hide');
												$(c).find('ul.figure.review .figure-review-cnt, ul.figure.review .figure-review-score').html('');
											}
										}

										if(fbasket.length > 0) {
											var checkOldBlock = ($(c).find('.figure.basket[data-oldver="true"]').length > 0) ? true : false,
												checkOldverBasket = (typeof settings.field_oldver != 'undefined' && settings.field_oldver && settings.field_oldver.indexOf('basket') > -1) ? true : false,
												checkDisabledBasket = (typeof settings.field_disable != 'undefined' && settings.field_disable && settings.field_disable.indexOf('basket') > -1) ? true : false;
											if(v.basket_off) fbasket.addClass('cannotby hide');
											else if(val.seq == 'all_products') fbasket.removeClass('hide');
											else if(checkDisabledBasket || (!checkDisabledBasket && checkOldBlock && !checkOldverBasket)) fbasket.addClass('hide');
											else if(property.VALIDTYPE != 'SM') fbasket.addClass('hide');
											else fbasket.removeClass('hide');
										}

									} else {
										fbrand.addClass('hide');
										fprice.addClass('hide');
										freview.addClass('hide');
										fbasket.addClass('hide');

										if(val.mode == 'project' && fcomment.length > 0 && typeof v.comment_cnt != 'undefined' && v.comment_cnt > 0 && settings.comment_display == 'ON') {
											fcomment.find('.figure-comment-cnt').html(v.comment_cnt);
											if(settings.field_disable !== undefined && settings.field_disable.indexOf('comment') > -1) {
												fcomment.addClass('hide');
											} else {
												fcomment.removeClass('hide');
											}
										} else {
											fcomment.addClass('hide');
										}

										if(flike.length > 0 && settings.like_display == 'ON' && checkUseLike) {
		                                    flike.removeAttr('data-like').removeClass('hide active');
		                                    if(v.like !== undefined) {
		                                    	flike.find('.figure-like-cnt').html(v.like.cnt);
			                                    if(v.like.own) flike.attr('data-like', v.seq).addClass('active');
		                                    }
		                                    if(settings.field_disable !== undefined && settings.field_disable.indexOf('like') > -1) {
												flike.addClass('hide');
											} else {
												flike.removeClass('hide');
											}
		                                } else {
		                                    flike.addClass('hide');
		                                }

                                    	if(checkUseLike == false) flike.html('');
									}
									
									if(val.mode == 'gallery') {
										if(index < cookie_view) {
											$(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
										} else {
											$(c).find('figure').remove();
											$(g).find('[data-loop="true"]').append($(c)[0].outerHTML);
										}
										if (total == 2) {
											$(c).find('figure').remove();
											$('.gallery-empty').append($(c)[0].outerHTML);
										}
									} else {
										$(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
									}

								});
								
							} else {
								checkGalleryListSample = true;
								if(val.mode=='project' && b.TEMPLATE == false) {
									nodes.addClass('gallery-item');
									nodes.find('a').attr('href', ((URI=='/') ? '' : URI) + '/' + b.PAGE + '/view/template').removeAttr('data-gallery').find('img').attr('data-index',0);
								}
								if(b.TEMPLATE !== false) {
									if(settings.comment_display != 'ON' || (settings.field_disable !== undefined && settings.field_disable.indexOf('comment') > -1)) nodes.find('.figure.comment').addClass('hide');
									else nodes.find('.figure.comment').removeClass('hide');
									if(settings.like_display != 'ON' || (settings.field_disable !== undefined && settings.field_disable.indexOf('like') > -1)) nodes.find('.figure.like').addClass('hide');
									else nodes.find('.figure.like').removeClass('hide');
								}
								$(p).find('[data-loop="true"]').append(nodes);
							}
							if(checkLoadmoreInLoop) $(p).find('[data-loop="true"]').append(glm);

							tag = $(p)[0].outerHTML;

							if (val.mode == 'gallery' && total == 2) {
								$.each($('.gallery-empty').find('.gallery-item'), function(i,v) {
									$(g).find('[data-loop="true"]').append(v);
								});
							}
							$('#el-empty').empty();
							$('.gallery-empty').remove();
						}
					});
				} else {
					if(typeof pageID[1] != 'undefined' && idx==0 && pageID[1] != 'template' && b.COUNT==0) {
						d = document.createElement('div');
						$(d).addClass('temp-element').html(tag);
						var pTitle = (b.PARENT.title) ? b.PARENT.title : $.lang[block_lang]['editor.block.gallery.sample.title'];
							pCaption = (b.PARENT.caption) ? b.PARENT.caption : $.lang[block_lang]['editor.block.gallery.sample.caption'];
						pCaption = pCaption.replace(/\n/g, '<br />');

						$(d).find('.data-date').text(b.PARENT.datetime);
						$(d).find('.data-category').text(b.PARENT.category);
						$(d).find('h5.figure').text(pTitle);
						$(d).find('p.figure').not('.comment').html(pCaption);

						tag = $(d).html();
						$(d).remove();
						tmpTag = tag;
					}
				}

				//add style
				var $style_tag = $('<style type="text/css"></style>');
				$style_tag.attr('id','el_'+idx+'css');
				if(typeof val.elcss != 'undefined') {
					$style_tag.html(htmlspecialchars_decode(val.elcss));
					$('.header').before($style_tag);
				}

				//change carousel id
				var $tag = $(tag);
				$tag.find('video').attr({'playsinline': '','webkit-playsinline': ''});
				$.each($tag.find('[data-edit="true"]'), function(i,v) {
					var source = $(this).outerHTML();
					source = source.replace(/&lt;&nbsp;/g,'&lt;').replace(/&nbsp;&gt;/g,'&gt;').replace(/data-attr-bookmark/g,'attr-bookmark');
					$(this).replaceWith(source);
				});
				
				if(typeof total == 'undefined') total = 0;

				msny = (val.feature=='masonry') ? true : false;
				var blocklang = '';

				if(val.type == 'video') {
					if($tag.find('.video-gallery-url').length > 0) val.mode = 'zoom';
					else val.mode = 'thumb';
					resizeVideoIframe($tag);
				}

	            if (val.type == 'video' || val.type == 'others') {
	                var checkFullscreen = (typeof settings.fullscreen != 'undefined' && settings.fullscreen == 'ON') ? true : false;
	                if(checkFullscreen) {
	                    $tag.find('.video-wrap').addClass('video-fullscreen');
	                }
	            }

				//페이지 이동 
				$tag.addClass('el_' + idx)
					.attr('data-id', val.seq)
					.attr('data-el','el_' + idx)
					.attr('data-pos', idx+1)
					.attr('data-name', val.elname)
					.attr('data-msny', msny)
					.attr('data-type', val.type)
					.attr('data-type2', val.type2)
					.attr('data-feature', val.feature)
					.attr('data-mode', val.mode)
					.attr('data-width', val.folder)
					.attr('data-overlap',val.overlap);

				if($tag.hasClass('modoo')) {
					if(window.innerWidth <= 768 && $tag.find('._spotHomesite').hasClass('is_bottom')) {
						$tag.find('._spotHomesite').removeClass('is_bottom');
					}

					if($tag.find('._sectionSpot').hasClass('type_full') && window.innerWidth > 768) {
						var A = $tag.find('._areaLogin').length ? true : false,
							C = window.innerHeight;
	
						if (A) {
							C -= 50;
						}
						
						$tag.find("._sectionSpot .swiper-wrapper").css("height", C);
						$tag.find("._sectionSpot .swiper-slide").css("height", C);
						$tag.find("._sectionSpot ._imgCover").css("height", C).each(function(F, G) {
							var D = $(G);
							var E = D.attr("data-lazy-background-img-src");
							D.css({
								backgroundImage: "url(" + E + ")",
								filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + E + '}", sizingMethod="scale")'
							});
						});
						if (!$tag.find("._spotHomesite").hasClass("is_bottom")) {
							$tag.find("._spotHomesite").css("height", C);
						}
					}

					if($tag.find('.page-container-mobile').length > 0) {
						if(window.innerWidth <= 768) $tag.find('[data-role="page-container"]._content').hide();
						else $tag.find('[data-role="page-container"]._content').show();
					} 

					if($tag.parents('body').find('.header').hasClass('home') && $tag.attr('data-el')=='el_0') {
						$tag.find('._spotHomesite .site_info').append(fl_data.el_html);
					}
				}
				
				var checkNotSupported = (!is_templates) ? $.notSupported.check(val.type,val.type2,val.feature) : false;
				if(checkNotSupported) {
					$tag.html('').attr('class',`hide element ${val.elname} el_${idx}`);
					$last_el = ($('.fnav').length) ? $('.fnav').before($tag) : $('.el-footer').before($tag);
					$(`#el_${idx}css, #js_${idx}`).remove();
					return Promise.resolve();
				}

				if(typeof settings.blocklang != 'undefined') {
					blocklang = settings.blocklang;
					$tag.attr('data-blocklang',blocklang);
				}

				if (val.type == 'sync') {
					var sync_list_total = (typeof val.sync !='undefined' && typeof val.sync.list != 'undefined' && (val.sync.list).length > 0) ? (val.sync.list).length : 0;
					if($tag.find('.slick-page-label').length > 0) {
						var page_label = sync_list_total;
						if(val.type2 == 'imgpitem' && sync_list_total == 0) page_label = $tag.find('.slick .item').length;

	                    $tag.find('.slick-page-label .slick-page-now').text(1);
	                    $tag.find('.slick-page-label .slick-page-total').text(page_label);
					}

					if($tag.find('.sync-option').length > 0) {
						var sync_css = CSSJSON.toJSON(htmlspecialchars_decode(val.elcss));
							syncStyle = style.get(sync_css,val.elname),
							sync_view = (typeof syncStyle.__sync_view != 'undefined') ? syncStyle.__sync_view : 4,
							sync_view_t = (typeof syncStyle.__sync_view_t != 'undefined') ? syncStyle.__sync_view_t : 2,
							sync_view_m = (typeof syncStyle.__sync_view_m != 'undefined') ? syncStyle.__sync_view_m : 1,
							sync_space = (typeof syncStyle.__sync_space != 'undefined') ? syncStyle.__sync_space : 10,
							sync_space_top = (typeof syncStyle.__sync_space_top != 'undefined') ? syncStyle.__sync_space_top : 1,
							sync_height = (typeof syncStyle.__sync_height != 'undefined') ? syncStyle.__sync_height : 1,
							sync_page_unit = (typeof syncStyle.__sync_page_unit != 'undefined') ? syncStyle.__sync_page_unit : -1;

						$tag.find('.sync-option').attr({
							'data-sync-view': Number(sync_view),
							'data-sync-view-t': Number(sync_view_t),
							'data-sync-view-m': Number(sync_view_m),
							'data-sync-space': Number(sync_space),
							'data-sync-space-top': Number(sync_space_top),
							'data-sync-height': Number(sync_height)
						});
						if(sync_page_unit > -1) {
							$tag.find('.sync-option').attr('data-sync-hidden', (Number(sync_page_unit) + 1));

							if($tag.find('.sync-page-label').length > 0) {
								var sync_p_cnt = $tag.find('.sync-row .sync-item').length,
									sync_p_total = Math.ceil(sync_p_cnt / Number(sync_page_unit));
								$tag.find('.sync-page .sync-page-now').text(1);
								$tag.find('.sync-page .sync-page-total').text(sync_p_total);
									
								if(sync_p_total == 1) $tag.find('.sync-page-wrap').hide();
								else $tag.find('.sync-page-wrap').show();
							}
						}
					}

					var sync_loadmore_lang = block_lang;
					if(typeof settings.loadmore_lang != 'undefined' && settings.loadmore_lang && $.inArray(settings.loadmore_lang.toLowerCase(), ['ko','en']) > -1) sync_loadmore_lang = settings.loadmore_lang.toLowerCase();
					$tag.find('.sync-page-more-str').text($.lang[sync_loadmore_lang]['config.loadmore']);
				}

				// lux shopping
				if(b.LUX && typeof res != 'undefined') {
					if(val.type == 'gallery' && val.mode == 'shopping') {
						refreshGalleryHeight(val.name)
					}
				}
								
				if(checkGalleryView) {
					if(val.page == 'fixedblock_'+b.PARENT.pid) $tag.addClass('el-fixedblock');
					else $tag.removeClass('el-fixedblock');

					$tag.attr('data-pos', page_pos);
					// if(b.LUX && (val.orgpos == '1' || $tag.is('.lux-product-block'))) $tag.attr('data-ppos', (val.pos*1) + 1);
					// else $tag.attr('data-ppos', val.pos);
					$tag.attr('data-ppos', val.pos);
					$tag.attr('data-posby', val.elnew);
				}

				if(val.type == 'contact' && val.page == 'fixedcontact') {
					$.fixedContact.init($tag);
	            }

				if(val.type=='forum' || val.type=='latest') $tag.addClass('preloading');
			
				if(b.ONE && val.orgpos==1) {
					$tag.attr('data-link', val.orgpage);
					$tag.addClass('link-to-'+JSON.parse('"'+val.orgpage.replace(/ /g,'-')+'"'));
				}

				$tag.addClass('element');
				$last_el = ($('.fnav').length) ? $('.fnav') : $('.el-footer');

				if($tag.hasClass('error_404')==false) {
					if($tag.hasClass('el-footer')==false) {
						if($tag.hasClass('cl-s-product-detail')==false) {
							aosAddblock(site_settings,settings,$tag);
						}
					}
				}

				var data_aos_attr = '';
				if($tag.is('[data-aos]')) {
					data_aos_attr = $tag.attr('data-aos');
					$tag.removeAttr('data-aos');
					$tag.addClass('aos-init')
				}

				$last_el.before($tag);
				
				refreshGalleryHeight(val.elname); 
				if(data_aos_attr) {
					$tag.removeClass('aos-animate');
					$tag.addClass('render-aos');

					$tag.attr('data-aos-dummy', data_aos_attr);
				}
				
				if(val.type == 'calendar'){
					var dataId = $tag.attr('data-id');
					if(typeof dataId != 'undefined' && dataId && typeof b.SID != 'undefined') {	
						$.cl_calendar.init(b.SID,dataId);
					}
				}

				if(val.type == 'sns' && typeof val.type2 != 'undefined' && val.type2 == 'feed') {
					$tag.find('.data-feed-load-more').attr('data-feed-el',val.elname);
					$tag.find('.data-feed-load-more').removeAttr('style');
					$tag.find('.show-posts').removeClass('show-posts');

					if(val.mode == 'site') {
						if(!$.isEmptyObject(b.SOCIAL)) {
							var load_sns = {};
							if(!$.isEmptyObject(b.SOCIAL.instagram) && typeof settings.sns_instagram != 'undefined' && settings.sns_instagram == 'ON') load_sns['instagram'] = b.SOCIAL.instagram;
							if(!$.isEmptyObject(b.SOCIAL.twitter) && typeof settings.sns_twitter != 'undefined' && settings.sns_twitter == 'ON') load_sns['twitter'] = b.SOCIAL.twitter;
							
							if(!$.isEmptyObject(load_sns)) {
								loadingElement(val.elname,'loading posts...');
								updateFeed(val.elname,load_sns,function() {
									$('.'+val.elname+' .listprogress').remove();
								});
							}
						}
					} else {
						// SNS FEED:: before version
						if(typeof settings.sns != 'undefined' &&  settings.sns.twitter) {
							loadingElement(val.elname,'loading posts...');
							updateFeed(val.elname,settings.sns);
						}
					}
				}

				if(val.type == 'others' && typeof val.type2 != 'undefined' && val.type2 == 'countdown') {
					var el_dday = $tag.find('[data-dday="true"]'),
						cd_date = (el_dday.attr('data-countdown')) ? el_dday.attr('data-countdown') : new Date(),
						dateformat  = { days : '%D', hours: '%H', minutes: '%M', seconds: '%S' },
						dateendformat  = { days : '00', hours: '00', minutes: '00', seconds: '00' };
					
					if( typeof settings.countdown != 'undefined' && settings.countdown ) {  //set - block setting date 
						cd_date = settings.countdown;
					}
					if( !el_dday.attr('data-countdown') && typeof countdown == 'object' ) { //set - example date
						cd_date.setTime(cd_date.getTime() + (35*24*60*60*1000));
					}
					cd_date = moment(cd_date).format('YYYY/MM/DD HH:mm:ss');

					el_dday.countdown(cd_date, function(event) {
						$(this).find('.date-item[data-datetype]').each(function(i) {
							var dd_type = $(this).attr('data-datetype'),
								dd_format = $(this).attr('data-format'),
								dd_endformat = $(this).attr('data-finish');

							if(typeof dd_format == 'undefined' || !dd_format) dd_format = dateformat[dd_type];
							if(typeof dd_endformat == 'undefined' || !dd_endformat) dd_endformat = dateendformat[dd_type];

							if(event.elapsed) $(this).text(dd_endformat);
							else $(this).text(event.strftime(dd_format));
						});
					});

                	if($tag.find('[data-bg-video="true"]').length > 0) resizeVideoIframe($tag);
				}

				if(typeof settings.bookmark != 'undefined' && settings.bookmark) {
					$tag.attr('data-bookmark',val.seq);
				}

				if(val.type == 'gallery') {
					// gallery frame add
					if(val.mode == 'gallery' && total) tag = appendGalleryFrame($(tag), val.seq, val.elsettings, '', val.elcss);
					
					(checkGalleryListEmpty) ? $tag.addClass('emptyGallery') : $tag.removeClass('emptyGallery');

					$tag.attr('data-category',category_onoff);
					$tag.attr('data-product-orderby', product_orderby_onoff);
					$tag.attr('data-align-rnd', align_rnd_onoff);

					if(category_onoff == 'ON') {
						loadGalleryCategoryBlock($tag,val.seq,settings);

						if(!checkGalleryListSample) {
							$tag.find('.empty-txt').remove();
							$tag.find('.container:not(.fh-container),[data-loop="true"]').removeClass('empty');
							if(checkGalleryListEmpty) {
								var empty_info = (val.seq == 'all_products') ? $.lang[LANG]['editor.gallery.product.empty.list'] : $.lang[LANG]['editor.gallery.category.empty.list'],
									empty_info = (_this.b.LUX) ? $.lang[LANG]['editor.gallery.product.empty.list'] : empty_info,
									gallery_empty_str = '<div class="col-xs-12 col-sm-12 col-md grid empty-txt">' + empty_info + '</div>';
								if(val.feature=='masonry') {
									$tag.find('.container:not(.fh-container)').removeAttr('style').addClass('empty').append(gallery_empty_str);
								} else {
									$tag.find('[data-loop="true"]').addClass('empty').empty().append(gallery_empty_str);
								}

								// if(!is_gc_cookie) $tag.find('.gallery-category-nav').addClass('empty');
								// else $tag.find('[data-loop="true"]').addClass('empty').append(gallery_empty_str);
							}
						}
					}

					if($tag.find('.goption[data-gcol]').length > 0) {
						var gOption = $tag.find('.goption[data-gcol]'),
							gcol = gOption.attr('data-gcol'),
							gcol_t = gOption.attr('data-gcol-t'),
							gcol_m = gOption.attr('data-gcol-m');

						if(typeof gcol_t == 'undefined') { gOption.attr('data-gcol-t',gcol); gcol_t = gcol; }
						if(typeof gcol_m == 'undefined') { gOption.attr('data-gcol-m',gcol_t); }
					}

					var img_onoff = (typeof settings.img_original_display != 'undefined' && settings.img_original_display) ? settings.img_original_display : 'ON',
						title_onoff = (typeof settings.gframe_title_visible != 'undefined' && settings.gframe_title_visible == 'OFF') ? false : true;
        				like_onoff = (typeof settings.like_display != 'undefined' && settings.like_display == 'ON') ? settings.like_display : 'OFF';

					$tag.find('[data-gallery]').attr({'data-img-original':img_onoff, 'data-gallery-title':title_onoff, 'data-gallery-like':like_onoff});
					if(!title_onoff) $tag.find('[data-gallery]').attr('data-title','');

					if(typeof val.price_hidden != 'undefined' && val.price_hidden == 'ON') {
						$tag.find('.figure.price').html('');
					}

					refreshGalleryField($tag,settings);

					var $glmBtnWrap = $tag.find('.loadmore-wrap'),
						$glmBtn = $tag.find('.loadmore-wrap .gallery-loadmore'),
						checkLoadmore = (total > view && total > cookie_view && !checkGalleryListEmpty) ? true : false,
						glm_lang = LANG;

					if(typeof settings.loadmore_lang != 'undefined' && settings.loadmore_lang && $.inArray(settings.loadmore_lang.toLowerCase(), ['ko','en']) > -1) glm_lang = settings.loadmore_lang.toLowerCase();
					else if(typeof block_lang != 'undefined' && $.inArray(block_lang, ['ko','en']) > -1) glm_lang = block_lang;
					var glm_txt = $.lang[glm_lang]['config.loadmore'];

					if($glmBtnWrap.length == 0) {
						// gallery loadmore btn - default (ver1)
						if(checkLoadmore) {
							var glm_class = (val.feature=='masonry') ? 'gallery-loadmore masonry-layout' : 'gallery-loadmore',
								glm_btn = '<div class="' + glm_class + '" data-loadmore="true" data-selector=".gallery-loadmore" data-total="' + total + '" data-id="' + val.seq + '" data-page="' + (Number(cookie_page)+1) + '" data-view="' + view + '" data-folder="' + val.folder + '" data-mode="' + val.mode + '">' + glm_txt +' &nbsp;(<span class="display">' + cookie_view + '</span> / ' + number_format(total) + ')</div>';

							if($tag.find('.gallery-loadmore[data-id="'+val.seq+'"]').length > 0) $('.gallery-loadmore[data-id="'+selectID+'"]').replaceWith(glm_btn);
							else $tag.append(glm_btn);
						} else $tag.find('.gallery-loadmore').remove();

					} else {
						// gallery loadmore btn - custom (ver2)
						if(checkLoadmore) {
							if(val.feature=='masonry') $glmBtn.addClass('masonry-layout');
							else $glmBtn.removeClass('masonry-layout');
							$glmBtn.attr('data-loadmore','true').attr('data-id',val.seq).attr('data-total',total).attr('data-page',Number(cookie_page)+1).attr('data-view',view).attr('data-folder',val.folder).attr('data-mode',val.mode);
							$glmBtn.find('.label').text(glm_txt);
							$glmBtn.find('.display .view').text(cookie_view);
							$glmBtn.find('.display .total').text(total);
							$glmBtnWrap.removeClass('hide').fadeIn();
						} else {
							$glmBtnWrap.fadeOut().addClass('hide');
							$glmBtn.removeAttr('data-loadmore').removeAttr('data-id').removeAttr('data-total').removeAttr('data-page').removeAttr('data-view').removeAttr('data-folder').removeAttr('data-mode').removeClass('masonry-layout');
							$glmBtn.find('.label').text(glm_txt);
							$glmBtn.find('.display .view').text('0');
							$glmBtn.find('.display .total').text('0');
						}
					}
				}

				if(val.type == 'sync') {
					var sync_source = _this.syncUpdate($tag, val);
					$tag.html(sync_source);

					if($tag.find('[data-sync-loop="true"]').length > 0) {
						if(val.type2 == 'tab') $tag.find('[data-sync-loop="true"] > li[data-list-no="1"]').attr('data-list-no','');
						if(val.type2 == 'imgpitem' && sync_list_total > 0) $tag.find('[data-sync-loop="true"] > li:not([data-idx])').remove();
						$tag.find('[data-sync-loop="true"] > li').eq(0).addClass('active').siblings().removeClass('active');
					}
				}

				// tab block 우선순위 check
				if(val.type == 'tabs') {
					var el = $tag.attr('data-name'),
						len = $tag.find(".tab-box .tab:not(.hover)").length,
						motion_style = $tag.attr("tab-motion-style"),
						tab_count = $tag.attr("tab-count"),
						tab_case = $tag.attr("data-case"),
						motion = $tag.attr("tab-motion"),
						priority = Number($tag.find('.tab-box .tab.active').attr('data-order')),
						navigation_use = $tag.attr("navigation-use");
					if(navigation_use == '1') {
						if(motion_style == 1) {
							var motion = (((priority + 1) - Number(tab_count)) >= 0) ? priority - Number(tab_count) : 0;
							tabMotion(el, motion, "", len, motion_style, tab_count, tab_case);
						} else {
							var motion = Math.ceil(Number(priority) / Number(tab_count)) - 1;
							tabMotion(el, motion, "", len, motion_style, tab_count, tab_case);
						}
					}
				}

				if(val.seq == 'all_products') {
	                if (b.ONE) $tag.addClass('link-to-전체상품');
					loadAllproductSort($tag, settings, val.total.list_total);
				}

				
				if($tag.has('input.gjs').length) {
					var gjs_status = (typeof elGalleryJS[val.seq] != 'undefined') ? 'reload-block' : 'load-block';
					setGalleryJS(gjs_status,$tag);
				}
				
	            if(val.type == 'forum') {
	            	var view = $tag.find('[data-loop="true"]').attr('data-view');
	                if(typeof view == 'undefined') view = 10;
	                if(typeof $.cookie('forum_' + val.seq) != 'undefined' && $.cookie('forum_' + val.seq)) {
	                	$.forum.init(val.seq,b.PAGE,view,$.cookie('forum_' + val.seq),$.cookie('forum_'+ val.seq +'_sfl'),$.cookie('forum_'+ val.seq +'_stx'),$.cookie('forum_'+ val.seq +'_scate'));	          
	                } else {
	                	$.forum.init(val.seq,b.PAGE,view);
					}
	                	
	                $.removeCookie('forum', { path : '/' });
	                $.removeCookie('forum_'+val.seq, { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_sfl', { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_stx', { path : '/' });
	                $.removeCookie('forum_'+val.seq+'_scate', { path : '/' });

					if(val.type2 == 'guestbook') {						
	                    if(settings.input_updown == 'U') {                    	
	                        $tag.find('.default_top').removeClass('flex-value-order2').addClass('flex-value-order1');
	                        $tag.find('.default_bottom').removeClass('flex-value-order1').addClass('flex-value-order2');	                    
	                    } 
	                    else {
	                    	if (typeof settings.input_updown == 'undefined') {//블럭 추가 당시 세팅값 없을 때
                        	$tag.find('.default_top').removeClass('flex-value-order2').addClass('flex-value-order1');
                        	$tag.find('.default_bottom').removeClass('flex-value-order1').addClass('flex-value-order2');                            
                        	} else {
	                        $tag.find('.default_top').removeClass('flex-value-order1').addClass('flex-value-order2');
	                        $tag.find('.default_bottom').removeClass('flex-value-order2').addClass('flex-value-order1');
	                    	}
	                	}
	                }
				}

				if(b.LUX && typeof res != 'undefined') {
					shopHeaderDisplay($tag.find('.shop-filter-header'),res);
				}

				if(val.type == 'latest') {
					var latest_data = (typeof settings.latest_data != 'undefined' && settings.latest_data) ? settings.latest_data : {};
					$.latest.init(val.seq, latest_data);
					$tag.removeClass('preloading');
				}

				if(val.type == 'review') {
					galleryEL[val.seq] = {
						'seq' : val.seq,
						'elname' : val.elname,
						'eltag' : tag,
						'folder' : val.folder,
						'mode' : val.mode,
						'elsettings' : val.elsettings,
						'feature' : val.feature,
						'type' : val.type,
						'type2' : val.type2,
						'searches' : val.searches
					};
					var gallery_data = (typeof settings.gallery_data != 'undefined' && settings.gallery_data) ? settings.gallery_data : {};
					$.reviewContents.init(val.seq, gallery_data);
				}

				if(b.VIEW) {
					var img_onoff = (typeof settings.img_original_display != 'undefined' && settings.img_original_display) ? settings.img_original_display : 'OFF';
					$tag.find('img[data-attach="true"]').attr('data-img-original',img_onoff);

					var c_g_p = (typeof $.cookie('gallery-page-' + b.PARENT.pid) != 'undefined') ? $.cookie('gallery-page-' + b.PARENT.pid) : 1;
					$.cookie('gallery',b.PARENT.pid, { path: '/', expires: 12 * 60 * 60 * 1000 });
					$.cookie('loadmore-' + b.PARENT.pid, c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
					if(typeof $.cookie('gallery-page-all_products') !== 'undefined' && $.cookie('gallery-page-all_products')) {
						c_g_p = (typeof $.cookie('gallery-page-all_products') != 'undefined') ? $.cookie('gallery-page-all_products') : 1;
						$.cookie('gallery','all_products', { path: '/', expires: 12 * 60 * 60 * 1000 });
						$.cookie('loadmore-all_products', c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
					}
				}

				$tag.find('[data-fixed-width]').each(function() {
					$(this).css('width',$(this).attr('data-fixed-width')+'px');
				});


				$tag.find('[data-map="true"]:not(iframe)').each(function() {
					var map_url = $(this).attr('data-url');
					if(typeof map_url != 'undefined' && map_url) {
						var map_iframe = getMapURL(map_url,'html');
						$(this).replaceWith(map_iframe);
						if(map_iframe.indexOf('google-map disabled') === -1) $(this).next('.map-undefined').remove();
					}
				});

				if(val.type == 'contact' && val.type2 == 'franchise map') {
					$.each($tag.find('[data-fmap-loop="true"] .item .item-name'), function(i, v) {
                        let itemName = $(v).html();
                        itemName = itemName.replace(/&lt;&nbsp;/g, '&lt;').replace(/&nbsp;&gt;/g, '&gt;');
                        $(v).html(itemName);
                    });

                    var $mapItem = $tag.find('[data-fmap-loop="true"] > .item.selected');
                    drawMap($mapItem, $tag);
                    fmapMobilePaging($tag);
                } else {
                	if($tag.find('[data-map_kind="kakao"]').length && (typeof kakao == 'undefined' || typeof kakao.maps == 'undefined' || kakao.maps == null || property.VALIDPLAN == '')) {
						$tag.find('[data-map_kind="kakao"]').html('지도연결해제됨. Javascript키 확인');
						$tag.find('[data-map_kind="kakao"]').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
					} else {
						$tag.find('[data-map_kind="kakao"]').each(function() {
							var container = this;
	                        var lat = $(this).data("lat");
	                        var lng = $(this).data("lng");
	                        var zoomInOut = $(this).data("zoominout");
	                        var mapTitle = $(this).data("maptitle");
	                        var mapContent = $(this).data("mapcontent");
	                        var useTitle = $(this).data("usetitle");
	                        var useContent = $(this).data("usecontent");

	                        if (typeof zoomInOut == 'undefined' || !zoomInOut) zoomInOut = false;
	                        if (typeof mapTitle == 'undefined' || !mapTitle) mapTitle = '';
	                        if (typeof mapContent == 'undefined' || !mapContent) mapContent = '';
	                        if (typeof useTitle == 'undefined' || !useTitle) useTitle = false;
	                        if (typeof useContent == 'undefined' || !useContent) useContent = false;
	                        
	                        var options = { center: new kakao.maps.LatLng(lat, lng), level: 3 };
	                        var c_map = new kakao.maps.Map(container, options);
	                        var marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(lat, lng), map: c_map });
	                        
							if(zoomInOut == true) {
								// var mapTypeControl = new kakao.maps.MapTypeControl();
								// c_map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
								// var zoomControl = new kakao.maps.ZoomControl();
								// c_map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
								var zoomControlHtml = '';
								zoomControlHtml += '\
									<div class="zoom-control" style="margin-top: 8px; margin-right: 8px; right: 0; width: 30px; position: absolute; background-color: #fff; z-index: 1; border-radius: 3px; box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);">\
										<div class="btn-zoom-control" data-inout="I" style="cursor: pointer; width: 30px; height: 30px;">\
											<svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 11h-4V7c0-.55-.45-1-1-1s-1 .45-1 1v4H7c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
										</div>\
										<div class="slider-wrap-container" style="height: 130px;">\
											<div class="slider-wrap small" style="text-align: center; height: 100%;">\
												<div style="max-height: 100%;" class="zoom-control-slider"></div>\
											</div>\
										</div>\
										<div class="btn-zoom-control" data-inout="O" style="cursor: pointer; width: 30px; height: 30px;">\
											<svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 13H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>\
										</div>\
									</div>\
								';
								var $zoomController = $(zoomControlHtml);
								$(container).append($zoomController);
								var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
									'orientation': 'vertical',
									'min' : 1,
									'max' : 14,
									'step' : 1,
									'value' : 3,
									'handle' : '<div>dfafasdfas</div>',
									// 'reversed' : true,
									'tooltip' : 'hide',
								}).on('slide', function(data) {
									c_map.setLevel(data.value);
									c_map.setCenter(marker.getPosition());
								}).on('slideStop', function(data) {
									c_map.setLevel(data.value);
									c_map.setCenter(marker.getPosition());
								});

								$zoomController.find('.btn-zoom-control').on('click', function() {
									if($(this).data('inout') == 'I') {
										c_map.setLevel(c_map.getLevel() - 1);
										zoom_slider.slider('setValue', c_map.getLevel());
									} else if($(this).data('inout' == 'O')) {
										c_map.setLevel(c_map.getLevel() + 1);
										zoom_slider.slider('setValue', c_map.getLevel());
									}
								});

								kakao.maps.event.addListener(c_map, 'zoom_changed', function() {
									zoom_slider.slider('setValue', c_map.getLevel());
								});
							}

							if((useTitle == true || useContent == true) && (mapTitle || mapContent)) {
								var iwContent = '';
								if(useTitle == true && mapTitle) {
									iwContent = '<div class="title">' + mapTitle + '</div>';
								}
								if(useContent == true && mapContent) {
									iwContent += '<div class="content">' + mapContent + '</div>';
								}
								// var infowindow = new kakao.maps.InfoWindow({
								//     position: marker.getPosition(),
								//     content : iwContent
								// });
								// infowindow.open(c_map, marker);
								if(iwContent) {
									iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"></path></svg>' + iwContent + '</div>';
									var infoWindow = $(iwContent);
									$(container).append(infoWindow);
									// infoWindow.css('bottom', 'calc(-100% + ' + (infoWindow.outerHeight() + 36) + 'px)');  
								}
							}
							$(window).on("resize", function() {
								c_map.setCenter(marker.getPosition());
							});
						});
					}

					if($tag.find('[data-map_kind="naver"]').length && (typeof naver == 'undefined' || typeof naver.maps == 'undefined' || naver.maps == null || property.VALIDPLAN == '')) {
						$tag.find('[data-map_kind="naver"]').html('지도연결해제됨. Client ID 확인');
						$tag.find('[data-map_kind="naver"]').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
					} else {
						$tag.find('[data-map_kind="naver"]').each(function() {
							var container = this;
							var lat = $(this).data("lat");
							var lng = $(this).data("lng");
							var options = { center: new naver.maps.LatLng(lat, lng), zoom: 17};
							var c_map = new naver.maps.Map(container, options);
							var marker = new naver.maps.Marker({ position: new naver.maps.LatLng(lat, lng), map: c_map});
							var zoomInOut = $(this).data("zoominout");
							var mapTitle = $(this).data("maptitle");
							var mapContent = $(this).data("mapcontent");
							var useTitle = $(this).data("usetitle");
							var useContent = $(this).data("usecontent");
							if(typeof zoomInOut == 'undefined' || !zoomInOut) zoomInOut = false;
							if(typeof mapTitle == 'undefined' || !mapTitle) mapTitle = '';
							if(typeof mapContent == 'undefined' || !mapContent) mapContent = '';
							if(typeof useTitle == 'undefined' || !useTitle) useTitle = false;
							if(typeof useContent == 'undefined' || !useContent) useContent = false;
							if(zoomInOut == true) {
								// options.zoomControl = true;
								var zoomControlHtml = '';
								zoomControlHtml += '\
									<div class="zoom-control" style="margin-top: 8px; margin-right: 8px; right: 0; width: 30px; position: absolute; background-color: #fff; z-index: 1; border-radius: 3px; box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);">\
										<div class="btn-zoom-control" data-inout="I" style="cursor: pointer; width: 30px; height: 30px;">\
											<svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 11h-4V7c0-.55-.45-1-1-1s-1 .45-1 1v4H7c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
										</div>\
										<div class="slider-wrap-container" style="height: 130px;">\
											<div class="slider-wrap small" style="text-align: center; height: 100%;">\
												<div style="max-height: 100%;" class="zoom-control-slider"></div>\
											</div>\
										</div>\
										<div class="btn-zoom-control" data-inout="O" style="cursor: pointer; width: 30px; height: 30px;">\
											<svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 13H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>\
										</div>\
									</div>\
								';
								var $zoomController = $(zoomControlHtml);
								$(container).append($zoomController);
								var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
									'orientation': 'vertical',
									'min' : 6,
									'max' : 21,
									'step' : 1,
									'value' : 17,
									'handle' : '<div>dfafasdfas</div>',
									'reversed' : true,
									'tooltip' : 'hide',
								}).on('slide', function(data) {
									c_map.setZoom(data.value);
									c_map.setCenter(marker.getPosition());
								}).on('slideStop', function(data) {
									c_map.setZoom(data.value);
									c_map.setCenter(marker.getPosition());
								});
								$zoomController.find('.btn-zoom-control').on('click', function() {
									if($(this).data('inout') == 'I') {
										c_map.setZoom(c_map.getZoom() + 1);
										zoom_slider.slider('setValue', c_map.getZoom());
									} else if($(this).data('inout' == 'O')) {
										c_map.setZoom(c_map.getZoom() - 1);
										zoom_slider.slider('setValue', c_map.getZoom());
									}
								});

								naver.maps.Event.addListener(c_map, 'zoom_changed', function(zoom) {
									zoom_slider.slider('setValue', c_map.getZoom());
								});
							}

							if((useTitle == true || useContent == true) && (mapTitle || mapContent)) {
								var iwContent = '';
								if(useTitle == true && mapTitle) {
									iwContent = '<div class="title">' + mapTitle + '</div>';
								}
								if(useContent == true && mapContent) {
									iwContent += '<div class="content">' + mapContent + '</div>';
								}

								if(iwContent) {
									iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"></path></svg>' + iwContent + '</div>';
									var infoWindow = $(iwContent);
									$(container).append(infoWindow);
									// infoWindow.css('bottom', 'calc(-100% + ' + (infoWindow.outerHeight() + 36) + 'px)');  
								}
								// var infowindow = new naver.maps.InfoWindow({
								//     content : iwContent
								// });
								// infowindow.open(c_map, marker);
							}
							$(window).on("resize", function() {
								c_map.setCenter(marker.getPosition());
							});
						});
					}
                }

				if(val.type == 'form') {
					$.forms.init(val.seq);
				}

				//video block ::: gallery
				if(val.type == 'video') {
					if($tag.find('.video-gallery-url').length>0) {                                                  //재생방식 : 확대보기 
						$.each($tag.find('.item'),function(i,v){
							if(val.mode=='zoom') appendGalleryFrame($(this).parents('.element'),val.seq,'',val.type);
						});
					}
					resizeVideoIframe($tag);
				}

				//add script
				if(val.eljs){
					var js_string = val.eljs;
					var $script_tag = $('<script type="text/javascript" id="js_' + idx + '"></script>');
					$script_tag.html(js_string);
					$('.dsgn-body').append($script_tag);
				}

				if($tag.find('.slick').length > 0) {
					if (val.type == 'sync' && typeof syncSlickFn == 'function') syncSlickFn('.' + val.elname);
					else if($tag.is('[data-clslick]') && typeof clSlickFn == 'function') clSlickFn('.' + val.elname);
				}

				// log 
				if(typeof settings['google_track'] != 'undefined') {
					$('.dsgn-body').append("<script type='text/javascript' src='//www.googleadservices.com/pagead/conversion_async.js'></script>");
				}

				//add style
				var jcss = CSSJSON.toJSON(val.elcss),
					elpd = style.getPadding(jcss,val.elname);
				var pt = parseInt(elpd.top),
					pb = parseInt(elpd.bottom);
					
				if(pt>0||pb>0){
					default_t_css = default_t_css + '\n 	.'+val.elname + '{';
					if(Math.ceil(pt*0.8)>0)
					default_t_css = default_t_css + 'padding-top: '+Math.ceil(pt*0.8) + 'px!important;';
					if(Math.ceil(pb*0.8)>0)
					default_t_css = default_t_css + 'padding-bottom: '+Math.ceil(pb*0.8) + 'px!important;';
					default_t_css = default_t_css + '}';

					default_m_css = default_m_css + '\n 	.'+val.elname + '{';
					if(Math.ceil(pt*0.5)>0)
					default_m_css = default_m_css + 'padding-top: '+Math.ceil(pt*0.5) + 'px!important;';
					if(Math.ceil(pb*0.5)>0)
					default_m_css = default_m_css + 'padding-bottom: '+Math.ceil(pb*0.5) + 'px!important;';
					default_m_css = default_m_css + '}';
				}
				if(idx == data.length-1){
					var css = '@media only screen and (max-width:767px) {' + default_t_css + '\n}\n';
					css = css + '@media only screen and (max-width:480px) {' + default_m_css + '\n}';

					if($('#el-paddingcss').length == 0) $('.dsgn-body').find('#el_'+(data.length-1)+'css').after('<style id="el-paddingcss">'+css+'</style>');
					else $('#el-paddingcss').append(css);
				}
				
				if(val.type == 'product') {
					if(val.is_wishlist == true) {
						$('.product-detail-btn .btn-myfav .btn-myfav-icon').addClass('on');
					} else {
						$('.product-detail-btn .btn-myfav .btn-myfav-icon').removeClass('on');
					}
				}

				if($.inArray(val.type, ['contents', 'text', 'image']) > -1) {
					let ecs = enableContentsSlider(val.seq, val.type, settings);
					if(typeof settings.list_type != 'undefined' && settings.list_type == 's' && ecs) {
	                    $.contentsSlider.ready(val.seq).then(() => {$.contentsSlider.init(val.seq, settings)});
	                }
				}

				return new Promise(function(resolve) { setTimeout(resolve) });
			}

			if(check_modoo) {
				m_floating(fl_data);
			}
			var dataloop = async function(data) {
				var promises = data.map(async function(val, idx) {
					return await drawData(idx, val)
				});
				return await Promise.all(promises);
			}
			dataloop(data).then(function() {
				$('.el-footer').css('visibility', 'visible');
				$.processOFF();

				document.querySelectorAll('.element video').forEach(function(video) {
					if(video.readyState > 0) video.classList.add('loaded');
					video.addEventListener('loadeddata', function() {
						this.classList.add('loaded');
					});
				});

				$('.dsgn-body').fitVids();
				$('.carousel').carousel({
					pause: 'none'
				});
				
				$('[data-aos-dummy]').each(function() {
					$(this).attr('data-aos', $(this).attr('data-aos-dummy')).removeAttr('data-aos-dummy');
				});
				setTimeout(function() {
					$('.element[data-aos]').removeClass('render-aos').addClass('aos-animate');
					AOS.init({ disableMutationObserver: true });
				});
				changeBrokenImages('.element');
				
				$('.element').each(function(i,v){
					var $tag = $(v);
					var elFonts = $tag.css('font-family');
					elFonts = elFonts + ",'Nanum Gothic'";
					elFonts = elFonts.replace(/"/g, '\'');
					$tag.css('font-family', ($tag.css('font-family') + ",'Nanum Gothic'").replace(/"/g, '\''));
				});

				if(b.VIEW) {
					// prev next
					$('.data-page-prev').addClass('active');
					$('.data-page-next').addClass('active');

					if(b.PARENT.prev === null) $('.data-page-prev').removeClass('active');
					if(b.PARENT.next === null) $('.data-page-next').removeClass('active');

					if(b.PARENT.mode == 'shopping') {
						$('.data-page-prev, .data-page-next').removeClass('active');
						if(b.PARENT.prev) $('.data-page-prev').addClass('active');
						if(b.PARENT.next) $('.data-page-next').addClass('active');

						if(typeof property.PRODINFO === 'object') $.products.display_info();
						if($('#review-onoff').val() == 'true') $.products.review(b.VIEW,b.PAGE);
						if($('#qna-onoff').val() == 'true') $.products.qna(b.VIEW,b.PAGE);
					} else {
						if($('.page-comments[data-id="'+b.VIEW+'"]').length == 0) _this.displayComment();
						//상세페이지 배경 style 추가
						if(b.PARENT.mode) setGalleryProjectCss(b.PARENT,b.PARENT['elcss']);
						else $('body').find('.galProjectCss').remove();
						
						displayPageToolbar().then(function(pageToolbar){
		                    displayBottomList(b.PARENT.pid);

		                    if($('.page-bottomlist').length) {
		                        $('.page-bottomlist').before(pageToolbar);
		                    }
		                    if ($('.page-comments').length) {
		                        $('.page-comments').before(pageToolbar);
		                    }

		                    displaySnsShare(b.PARENT.pid);
							displayLike(b.PARENT.pid);
							displayBottomNav(b.PARENT.pid);

		                    var p_settings = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
							if((typeof p_settings.sns_share_display == 'undefined' || !p_settings.sns_share_display || p_settings.sns_share_display=='OFF') && 
								(typeof p_settings.bottomNav_display == 'undefined' || !p_settings.bottomNav_display || p_settings.bottomNav_display=='OFF') &&
								(typeof p_settings.like_display == 'undefined' || !p_settings.like_display || p_settings.like_display=='OFF')) {
								$('.tpl-page-footer').addClass('hide');
							} 
		                });
					}
				}

				var isPage = false;
				$.each(b.MENULIST, function(i,k) {
					isPage = (k.toUpperCase() == b.PAGE.toUpperCase()) ? true : isPage;
				});
			
				// if(!b.ONE && !b.VIEW && !isPage) location.replace(URL);
				
				// menu ver3 : fheader
				if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();

				// shopping wrap remove
				if($('.shopping-wrap').length || $('.shopping-more-wrap').length) {
					$('.shopping-wrap').remove();
					$('.shopping-more-wrap').remove();
				}

				// shopping wrap create
				if(!$('.dsgn-body').hasClass('mode-config') && $('.cl-s-product-detail').length > 0 && $('div[data-el*="el_"]').length > 1) {
					if(shopping_more == 'ON') {
						var prod_content = $('div[data-el*="el_"]').not('.cl-s-product-detail').addClass('hide');
						$('.product.cl-s-product-detail').after('<div class="shopping-wrap open"></div>');
						$('.shopping-wrap').html(prod_content);
						$('div[data-el*="el_"]').each(function(idx, v) {
							$(this).removeClass('hide');
							if($('.shopping-wrap').height() > 800) return false;
						});
					}
				}
				/*shopping more create*/
				if($('.shopping-wrap').length && $('.shopping-wrap').height() >= 800 && $('.shopping-more').length == 0) {
					var more_txt = (LANG == 'ko') ? '상품정보 더보기' : 'MORE';
					var colorSet = shopping_more_color,
						sm_font = (!colorSet) ? '' : colorSet.color,
						sm_bgColor = (!colorSet) ? '' : colorSet.background_color,
						sm_border = (!colorSet) ? '' : colorSet.border_color;
					var review_chk = ($('.cl-s-product-review').length > 0) ? true : false,
						qna_chk = ($('.cl-s-product-qna').length > 0) ? true : false;

					$('.shopping-wrap').css('max-height','800px')
									   .css('overflow','hidden')
									   .after('<div class="shopping-more-wrap"><div class="shopping-more">'+more_txt+'</div></div>');
					$('.shopping-wrap').removeClass('open');
					if(sm_font) $('.shopping-more').css('color',sm_font);
					if(sm_bgColor) $('.shopping-more').css('background-color',sm_bgColor);
					if(sm_border) $('.shopping-more').css('border-color',sm_border);
					if(!review_chk && !qna_chk) $('.shopping-more-wrap').css('padding-bottom','100px');
				}

				$('.el-footer').show();                

				if($('.element a[data-popup][data-popup-name]').length > 0 && (!b.VALIDPLAN || b.VALIDTYPE == 'PK')) {
					$('.element a[data-popup][data-popup-name]').addClass('disabled');
				}

				if($('.element[data-layout]').length > 0) {
					setLayoutHeight();
				}
				
				if(typeof fbq == 'function' && b.VALIDTYPE == 'SM') {
					if(b.VIEW) {
						var checkProduct = (b.PAGE.match(/^forum,/g) === null && typeof b.PARENT != 'undefined' && typeof b.PARENT.mode != 'undefined' && b.PARENT.mode == 'shopping') ? true : false,
							mn = (b.ONE) ? b.PARENT.opage : b.PARENT.ppage;
						if(checkProduct && typeof callbackEvtViewContent == 'function') callbackEvtViewContent(mn,b.PARENT.seq,b.PARENT.title,$('.total-price').text().replace(/[^0-9]/g,''));
					} else {
						var checkProductList = ($('.element[data-type="gallery"][data-mode="shopping"]').length > 0) ? true : false;
						if(checkProductList && typeof callbackEvtLead == 'function') callbackEvtLead(b.PAGE);
					}
				}

				deferred.resolve();
			});

			return deferred.promise();
		}

		var elPush = function (prop) {
		    /* prop - reorder list hide */
		    var pageID = b.PAGE.split(','),
		        chgBG = false,
		        tmpTag = '',
		        currentPAGE = '',
		        default_t_css = '', default_m_css = '';

			currentPAGE = b.PAGE;
			param = (currentPAGE=='index,template' && param.indexOf('/org/') == -1) ? param + '/org/' + b.PAGE : param;

			if(b.VALIDPLAN && $.inArray(b.VALIDTYPE, ['BN','SM']) > -1 && b.CERT_USE == 'Y') {
    			if(b.CERT_USE == 'Y') {
    				if(b.UMEMBER.check_login == true) isUserCertified(history);
    			}
    		}
	        if(pageID[0] == 'forum' && b.VIEW) {
		    	clearDsgnbody();

				var preloading = loadingScript({'forum':true});
				preloading.done(function() {
					var ps_fmview = $.forum.view(b.VIEW);
					ps_fmview.done(function() {
						_this.displayComment();
						$('.el-footer').show();
						$('.dsgn-body').animate({scrollTop: 0}, 0,'easeInOutQuart'); 
					}).fail(function(error_msg) {
						console.log(error_msg);
					});
					return false;
				});
	        }

			if(b.pageContent.hasOwnProperty(currentPAGE)) {
				var loadingContents = loadPush(b.pageContent[currentPAGE]);
				loadingContents.then(function() {
					$('.el-footer').css('visibility', 'visible');
					$.processOFF();
				});
	        } else {
	        	param = (b.PUBLISH) ? param : '/render/true';
				$.ajax({
					url: '/template/contents/sid/' + b.SID + '/page/' + encodeURIComponent(currentPAGE) + param,
					dataType: 'json',
					type: 'GET',
					async: true,
					success: function(data) {
						if(typeof data.error != 'undefined' || data.error) {
							if(currentPAGE!='index,template') {
								alert($.lang[LANG]['page.not.found']);
								location.replace('/');
							}
						}
						if(currentPAGE!='index,template') b.pageContent[currentPAGE] = data.contents;
						if(data.initContent !== undefined) property.INITPAGE = JSON.parse(data.initContent);
						
						var preloading = loadingScript(data.blocks_type);
						preloading.then(function() {
							var loadingContents = loadPush(data.contents);
							loadingContents.then(function() {
								$('.el-footer').css('visibility', 'visible');
								$.processOFF();
							});
						});
					}
				});
	        }
		}

		var scrollspy = function() {
		    if(!b.ONE) return false;
		    var top = 0,
		        active = '';

		    // top = ($('.dsgn-body').hasClass('sidebar')) ? 0 : $('.el-menu header').outerHeight();

		    $.each(b.MENULINK,function(i,v) {

		        var $el = ($.inArray(v,property.MENULIST) > -1) ? $('.link-to-'+v) : '';
		        if($el.length>0) {
		            var offset = $el.offset();
		           top = ($('.dsgn-body').hasClass('sidebar')) ? 0 : $('.el-menu header').outerHeight();
		            if((Math.floor(offset.top) - $(document).scrollTop())<= top) {		            	
		            	active = v;
		            }
		        }

		    });

		    
			if(!$('#tpl-menu li a[href="#'+active+'"]').parent().hasClass('active')) {
				
				$('#tpl-menu li').removeClass('active').removeClass('open');
				
				$('#tpl-menu li a[href="#'+active+'"]').parent().addClass('active');
				if( $('#tpl-menu li a[href="#'+active+'"]').closest('.dropdown-menu').length>0 ) {
					if($('body').width() > 768) $('#tpl-menu li a[href="#'+active+'"]').closest('.dropdown').addClass('active');
					else {
						//원페이지일 때 769~783 해상도에서 갤러리 위에 마우스 올리면 하위메뉴 열리는 현상 있어서 모바일에서만 open 클래스 추가 되도록 #mobile-nav 코드 추가.
						$('#mobile-nav #tpl-menu li a[href="#'+active+'"]').closest('.dropdown').addClass('open');
					}
				}
			}

		    if($(document).scrollTop() + $('body').height() == $('body').prop('scrollHeight')) {
		    	
		        var last = b.MENULINK[b.MENULINK.length-1],
		            $el = ($.inArray(last,property.MENULIST) > -1) ? $('.link-to-'+last) : '';

		        if($el.length>0) {
		            if($el.offset().top>top) {
		                $('#tpl-menu li').removeClass('active').removeClass('open');
		                
		                if($(document).scrollTop()!=0) 
		                	$('#tpl-menu li a[href="#'+last+'"]').parent().addClass('active');

						if($('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown-menu').length>0) {
							if($('body').width() > 768) $('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown').addClass('active');
							else $('#tpl-menu li a[href="#'+last+'"]').closest('.dropdown').addClass('open');
						}
		            }
		        }
		    }

		}

		var fixedMenu = function() {
			var isHeaderOldVer = ($('header').hasClass('cl-nav') === false) ? true : false;
			if(!isHeaderOldVer) return;

			if($('header.navbar').hasClass('navbar-fheader')) { // menu ver3 : fheader 
				if($('body').is('[data-gjs^="fixedscroll"]')) {
					return false;
				}
				
				var isSidebar = ($('header').hasClass('sidebar')) ? true : false;
				if($(document).scrollTop() > $('header.navbar').height()) {
					if(window.innerWidth > 768) {
						$('.menu-logo-top').hide();
						$('.el-menu').addClass('fixed-fheader');
					}
					if(b.HEADER && !isSidebar)  $('header.navbar').removeClass('transparent');
				} else if($(document).scrollTop() <= $('header.navbar').height()) {
					$('.el-menu').removeClass('fixed-fheader');
					$('.menu-logo-top').show();
					
					if(b.HEADER && !isSidebar) {
						$('header.navbar').addClass('transparent');
						$('.dsgn-body').css('padding-top','0px');
					}
				}

				return false;
			}

		    header_fixed = $('.header.el-menu').height();
		    var user_menu = $('.el-menu'),
				menu_color = $('header.navbar').css('background-color'),
				menu_bg_img = (typeof $('header.navbar').css('background-image') != 'undefined') ? $('header.navbar').css('background-image') : 'none',
				menu_bg_position = (typeof $('header.navbar').css('background-position') != 'undefined') ? $('header.navbar').css('background-position') : 'center center',
				menu_bg_repeat = (typeof $('header.navbar').css('background-repeat') != 'undefined') ? $('header.navbar').css('background-repeat') : 'no-repeat',
				menu_bg_size = (typeof $('header.navbar').css('background-size') != 'undefined') ? $('header.navbar').css('background-size') : 'cover';

		    if($(document).scrollTop() > header_fixed && user_menu.hasClass('fixed')==false && !$('.dsgn-body').hasClass('sidebar')) {
		        user_menu.fadeOut('fast', function() {
		            $(this).addClass('fixed').fadeIn('fast');
		            $('.fixed').addClass('fixed-position');
		            if(!b.HEADER || $('header.navbar').hasClass('sidebar') ) {
	                	var topval = ($('.creatorlink-header').length==1) ? '55px' : '0';
		            	$('.el_0').css('margin-top',topval);
		                var $header_empty = $('<div class="header-empty"></div>');
		                if($(".header-empty").length==0) {
		                	var topval = ($('.creatorlink-header').length==1) ? '55px' : '0';
			                $header_empty.css({
			                    'background-color' : $('header.navbar').css('background-color'),
								'background-image' : menu_bg_img,
								'background-position' : menu_bg_position,
								'background-repeat' : menu_bg_repeat,
								'background-size' : menu_bg_size,
			                    //'position' : 'relative',
			                    'width' : '100%',
			                    'height' : header_fixed+'px',
			                    'top' : topval,
			                    'z-index' : '1'
			                });
			                $('.dsgn-body').prepend($header_empty);
			            }
       		        	$('.header-empty').css('position','relative');
		            } else {
		            	$('header.navbar').removeClass('transparent');
		            }
		            if(window.innerWidth > 768) $('.menu-logo-top').hide();
		        });        
		    } else if($(document).scrollTop() < header_fixed && user_menu.hasClass('fixed') && !$('.dsgn-body').hasClass('sidebar')){
		        user_menu.fadeOut('fast', function(){
			        $('.header-empty').css('position','absolute');
		            $('.fixed').addClass('fixed-position');
		            user_menu.removeClass('fixed').fadeIn('fast');
		            if(!b.HEADER  || $('header.navbar').hasClass('sidebar') ) {
		            	$('.el_0').css('top','0');
		            } else {
		            	$('header.navbar').addClass('transparent');
		            	if($('.creatorlink-header').length == 1) $('div.header.fixed-position').addClass('top-zero');
		            }
		            $('.menu-logo-top').show();
		        });
		    }
		}

		var elFooter = function() {
			var error_style = '\
				<style type="text/css" id="error_css">\
				@import url("//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css");\
				.error_404.new_design { max-width: 348px; margin:auto; text-align: center; padding:100px 0; }\
				.error_404.new_design .text-center svg { fill:#eeeeee; }\
				.error_404.new_design h1,\
				.error_404.new_design h3,\
				.error_404.new_design p { margin:0; line-height: normal; }\
				.error_404.new_design h1 { margin-top:50px; font-size:60px; color:#2d343e; font-family:Inter; font-weight: bold; }\
				.error_404.new_design h3 { margin-top:10px; font-size:32px; color:#797f86;font-family: "Spoqa Han Sans Neo";font-weight: normal; }\
				.error_404.new_design p { margin-top:30px; font-size:14px; color:#797f86; word-break: keep-all; line-height: 1.6; font-weight:400;font-family: "Spoqa Han Sans Neo"; }\
				@media only screen and (max-width: 767px) {\
				.error_404.new_design h1 { margin-top:40px; font-size:46px; }\
				.error_404.new_design h3 { margin-top:5px; font-size:28px; }\
				.error_404.new_design p { margin-top:20px; font-size:13px; }\
				}\
				</style>';
			var error_html = '\
				<div class="error_404 new_design">\
					<div class="text-center">\
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 71" width="80" heigth="71">\
							<path d="M79.18 61.87 45.25 3.04C43.58.14 39.88-.86 36.99.81c-.93.53-1.7 1.3-2.23 2.23L.82 61.87a6.095 6.095 0 0 0 2.22 8.32c.92.52 1.96.81 3.03.81h67.86A6.094 6.094 0 0 0 80 64.89c0-1.06-.29-2.11-.82-3.02m-35.36-2.5a2.56 2.56 0 0 1-2.55 2.58h-2.59a2.56 2.56 0 0 1-2.57-2.56v-2.23c.01-.7.3-1.36.8-1.86.47-.51 1.14-.79 1.84-.78h2.45c.7-.01 1.36.27 1.85.77.5.47.78 1.13.78 1.81l-.01 2.27zm-1.19-15.53c-.04.69-.33 1.35-.83 1.84-.45.48-1.09.74-1.74.74-.7.02-1.37-.26-1.85-.77-.47-.49-.75-1.13-.78-1.81L36.18 23.8c-.05-.68.22-1.35.72-1.81.49-.5 1.15-.77 1.85-.77h2.57c.7 0 1.38.29 1.85.81.49.48.76 1.14.72 1.83l-1.26 19.98z"/>\
						</svg>\
					</div>\
					<h1>404</h1><h3>Page Not Found</h3>\
					<p>'+$.lang[LANG]['config.page.not.found.error']+'</p>\
				</div>\
				';
			if(typeof b.pageContent[b.PAGE] == 'undefined' && $('.error_404.new_design').length > 0) $('.error_404.new_design').remove();
			if($('.el-footer').length > 0) {
				setTimeout(function() { 
					if($('.element:not(.el-footer)').length < 1 && !(b.MENULIST.indexOf(b.PAGE) > -1) && !b.ONE && !b.VIEW) {
						if($('.error_404.new_design').length == 0) {
							$('style#el-footercss').after(error_style);
							$('.element.el-footer').before(error_html); //404 error
						}
					}
					$('.el-footer').show(); 
				}, 300);
				return false;
			}
			
			if(b.FTAG == '') b.FTAG = '<div class="footer-' + b.SID + '"></div>';
		    $footer = $(b.FTAG);
		    $footer.find('.link-site-home').prop('href',URI); 
		    $footer.addClass('element')
		           .addClass('el-footer')
		           .addClass('hide')
		           .attr('data-type','footer')
		           .attr('data-el','el-footer')
		           .attr('data-id','footer')
		           .attr('data-name','footer-' + b.SID);

		    $footer.appendTo($('.dsgn-body'));
		    $('.dsgn-body').prepend('<style id="el-footercss">' + b.FCSS + '</style>');

			/*180822 add*/
			// before v1 creatorlink-box remove
			if($('.el-footer').find('.creatorlink-box').length > 0 ) {
				if($('.el-footer').find('.creatorlink-box').prev().hasClass('col-md-10')) $('.el-footer').find('.creatorlink-box').prev().removeClass('col-md-10').addClass('col-md-12');
				$('.el-footer').find('.creatorlink-box').remove();
			}
			// before v2 creatorlink-footer remove
			if( $('.el-footer').find('.creatorlink-footer').length > 0) {
				$('.el-footer').find('.creatorlink-footer').remove();
			}

			// made it with Creatorlink
			if(!b.VALIDPLAN || b.VALIDTYPE == 'PK') {
				var is_templates = checkTemplateSite(b.SID);
				if(!is_templates) {
					$('.goto-top').addClass('moved');
					setMadeWithCreatorlink();
				}	
			}

			setCLEscrowFooter(b.SID, b.VALIDTYPE, b.SETTINGS.sm_escrow);

		 	var isfooterAttach = typeof $footer.attr('data-flogo') == 'undefined' ? false : $footer.attr('data-flogo'),
	 		   	checkFixTypeMenu = (typeof $('header.navbar-fheader').attr('data-fixtype') != 'undefined' && $('header.navbar-fheader').attr('data-fixtype')) ? true : false;

	    	if(isfooterAttach) {
				if(b.ONE){
					if(b.VIEW) $footer.find('#site-home-footer').attr('href',URI).removeClass('mini-home');
					else $footer.find('#site-home-footer').attr('href','javascript:;').addClass('mini-home');
				} else $footer.find('#site-home-footer').attr('href',URI).removeClass('mini-home');
			}

	    	/*var block_display = (typeof b.SETTINGS.block_display != 'undefined' && b.SETTINGS.block_display) ? b.SETTINGS.block_display : {},
        		footer_display = (typeof block_display.footer_display != 'undefined' && block_display.footer_display) ? block_display.footer_display : 'ON';

			if(footer_display=='OFF') $('.footer-'+b.SID+'.el-footer').hide();*/

			/*180822  delete - powered by Creatorlink
			// before creatorlink-box remove
			if($('.el-footer').find('.creatorlink-box').length > 0 ) { 
				if($('.el-footer').find('.creatorlink-box').prev().hasClass('col-md-10')) $('.el-footer').find('.creatorlink-box').prev().removeClass('col-md-10').addClass('col-md-12');
				$('.el-footer').find('.creatorlink-box').remove();
			}

			if($('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').length == 1 &&
				$('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').hasClass('col-md-10') ) {
				$('.el-footer').find('*[data-edit="true"]').first().closest('.row').children('div').removeClass('col-md-10').addClass('col-md-12');
			}

			if(typeof b.VALIDPLAN != 'undefined' && b.VALIDPLAN && b.VALIDTYPE != 'PK') {
				if( $('.el-footer').find('.creatorlink-footer').length > 0 ) $('.el-footer').find('.creatorlink-footer').remove();
			} else {
				var el_f_style = $('.el-footer').attr('style');
				if(typeof el_f_style != 'undefined' && 
					(el_f_style.indexOf('display') > -1 || el_f_style.indexOf('opacity') > -1 || el_f_style.indexOf('z-index') > -1) ) $('.el-footer').removeAttr('style');
				if($('.el-footer').css('display') == 'none') $('.el-footer').css('display','block');
				if($('.el-footer').css('opacity') < 1) $('.el-footer').css('opacity',1);
				if($('.el-footer').css('z-index') != 'auto') $('.el-footer').css('opacity','auto');

				if( $('.el-footer').find('.creatorlink-footer').length == 0) setFooterCretorlinkBox();
				setFooterLink();
			}
			*/
			if($('.element:not(.el-footer)').length < 1 && !(b.MENULIST.indexOf(b.PAGE) > -1) && !b.ONE && !b.VIEW && b.PAGE != 'psearch') {
				if($('.error_404.new_design').length == 0) {
					$('style#el-footercss').after(error_style);
					$('.element.el-footer').before(error_html); //404 error
				}
			}

			changeBrokenImages($footer);

		    if(!b.FTAG || b.FOOTER) {
		        // $footer.hide();
		    } else {
		    	if(b.VIEW && b.PARENT.mode == 'shopping' && $(document).width() < 768) {
		    		$('.el-footer').css('margin-bottom','55px');
		    	}

		    	var block_display = (typeof b.SETTINGS.block_display != 'undefined' && b.SETTINGS.block_display) ? b.SETTINGS.block_display : {},
		        	footer_display = (typeof block_display.footer_display != 'undefined' && block_display.footer_display) ? block_display.footer_display : 'ON';

	        	if(footer_display!='OFF') {
			    	setTimeout(function() {
			    		$footer.removeClass('hide');
			    	},300);
			    }

			    setTimeout(function(){
					if(checkFixTypeMenu) {
						if(b.VALIDPLAN) setFixedMenuCss(false);
						else {
							$('.el-menu header.navbar[data-fixtype]').find('#tpl-menu').css({
								'width': '100%'
							});
						}
					} 
			    },80);
		    }
		}

		var reloadMasonry = function(container,items) {
			$('.gallery-loading-status').remove();

			if(container.find('[data-loop="true"]').length > 0) container.find('[data-loop="true"]').append(items).closest('.container').masonry();
			else container.masonry().append(items);
		    container.masonry('appended',items).masonry();
		}		

		function setDefaultValue(value) {
			return (typeof value == 'undefined') ? '' : value;
		}

		function setDefaultValueEtc(type, el) {
			type = (typeof el.attr('data-contact-etc-type') != 'undefined' && el.attr('data-contact-etc-type') ) ? el.attr('data-contact-etc-type') : type;
            
            var input_type = ['text','email','number','tel','url'];
            if($.inArray(type,input_type)) {
				return (typeof el.val() == 'undefined') ? '' : el.val();
			} else if(type == 'checkbox') {
				return ( el.prop('checked') ) ? 'O' : 'X';
			} else if(type == "radio") {
				return el.find('input:radio:checked').val();
			} else if(type == 'selectbox') {
				var result = (el.find('option').length > 0 ) ? el.find('option:checked').val() : el.find('.active').find('.opval').text();
				return result;
			} else {
				return 'etc article';
			}
		}

		function setDefaultForm(el) {
			var ch_lang = getLang($(el + ' [form-idx]'), b.SID);
    		var type2 = $(el).attr('data-type2');
			
			$(el + ' [form-idx]').val('');
			$(el + ' [form-idx]').find('.form-date').val('');
			$(el + ' [form-idx]').find('.form-date').removeAttr('style')
			$(el).find('input:checkbox').removeAttr('checked');
			$(el).find('input:radio').removeAttr('checked');
			$(el + ' [form-type="file.upload"]').find('label .file-uploaded-number').text('(0/10)');
			$(el + ' [form-type="file.upload"]').find('input[type="file"]').val('');
            $(el + ' [form-type="file.upload"]').find('input[type="text"]').val('');
            $(el + ' [form-type="file.upload"]').find('.file-title').text($.lang[ch_lang]['form.file.nofile']);

            if($(el + ' [form-type="file.upload"]').find('.file-row').length > 0) {
            	$(el + ' [form-type="file.upload"]').find('.file-row').remove();
            	$(el + ' [form-type="file.upload"]').find('.file-uploaded-number').text('(0/10)');
		    	$(el + ' [form-type="file.upload"]').find('.file-title').removeClass('hide');
            }

            if(type2 == 'form' && $(el).attr('data-captcha') != 'false' && $(el).find('input.input-captcha').length > 0) {
            	$(el).find('input.input-captcha').val('');
            	load_form_kcaptcha($(el), $(el).attr('data-id'));
            }

            if($(el).attr('data-type2') == 'franchise bar') {
		        $(el).find('.view-privacy').removeClass('active');
		        // $(el).find('.form-privacy textarea').hide();
		    }
		}

		function setDefaultContactForm(el) {
			$(el + ' [data-contact-firstname]').val('');
			$(el + ' [data-contact-lastname]').val('');
			$(el + ' [data-contact-email]').val('');
			$(el + ' [data-contact-website]').val('');
			$(el + ' [data-contact-phone]').val('');
			$(el + ' [data-contact-subject]').val('');
			$(el + ' [data-contact-message]').val('');
			$(el).find('input:checkbox').removeAttr('checked');
			$(el).find('input:radio').removeAttr('checked');
			$(el + ' [form-type="file.upload"]').find('input[type="file"]').val('');
            $(el + ' [form-type="file.upload"]').find('input[type="text"]').val('');
            $(el + ' [form-type="file.upload"]').find('.file-title').text("첨부된 파일이 없습니다.");
		}

		function setDefaultContactFormEtc(el) {
			$(el).find('[data-contact-etc]').each(function(i) {
				var type = (typeof $(this).attr('data-contact-etc-type') != 'undefined' && $(this).attr('data-contact-etc-type') ) ? $(this).attr('data-contact-etc-type') : $(this).attr('type');
				
				var input_type = ['text','email','number','tel','url'];
				if($.inArray(type,input_type)) {
					$(this).val('');
				} else if(type == "checkbox") {
					$(this).removeAttr('checked');
				} else if(type == "radio") {
					$(this).find('input:radio').first().click();
				} else if(type == "selectbox") {
					if($(this).find('option').length > 0) {
						$(this).find('option:first').attr('selected','selected');
					} else {
						$(this).find('.active').removeClass('active');
						$(this).find('li').first().addClass('active');
					}
				}
			});
		}

		var ieLineClamp = function() {
		    if(isIE()) {
		        $('[data-ie-clamp]').each(function(index, element) {
		            var clamp = $(this).attr('data-ie-clamp').split(','),
		                line = new Array();

		            $.each(clamp,function(k,v) {
		                line.push(v);
		            });

		            for(i=line.length; i<3; i++) line[i] = 0;
		            var idx = getScreenIndex();
		            var apply = line[idx];

		            // console.log($(element).text());
		            //safeClamp(element, apply);
		            $clamp(element, {clamp:apply, useNativeClamp:false });
		        });
		    }
		}

		var safeClamp = function (selector, lines) {
			lines = lines || 3; // a default
			$(selector).each( function() {
				if($(this).text()) {
					$clamp( this, { clamp: lines, useNativeClamp:false  });
				}
			});
		}

		$('.data-page-back').live({
		    click : function() {
				var pPage = b.PARENT.page,
					page = b.PAGE.split(',');
					inMenu = ($.inArray(pPage,b.MENULIST) == -1 && page[0] != '_product') ? false : true;

				if(!inMenu) {
					$(this).showModalFlat('INFORMATION','이동할 수 없습니다',true,false,'','ok');
					return false;
				} else {
					if($.cookie('gallery') !== undefined && $.cookie('gallery') == 'all_products') {
						var c_g_p = (typeof $.cookie('gallery-page-all_products') != 'undefined') ? $.cookie('gallery-page-all_products') : 1;
				    	$.cookie('gallery', 'all_products', { path: '/', expires: 12 * 60 * 60 * 1000 });
				    	$.cookie('loadmore-all_products', c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
				    	
				    	var url_replace = (b.URL == '/') ? '' : b.URL;
				    	if(b.ONE) {
				    		_this.history.pushState(null,b.TITLE,url_replace + '/index#전체상품');
				    	} else {
				    		_this.history.pushState(null,b.TITLE,url_replace + '/전체상품');
				    	}
					} else {
						var c_g_p = (typeof $.cookie('gallery-page-' + b.PARENT.pid) != 'undefined') ? $.cookie('gallery-page-' + b.PARENT.pid) : 1;
				    	$.cookie('gallery',b.PARENT.pid, { path: '/', expires: 12 * 60 * 60 * 1000 });
				    	$.cookie('loadmore-' + b.PARENT.pid, c_g_p, { path: '/', expires: 12 * 60 * 60 * 1000 });
				    	
				    	var url_replace = (b.URL == '/') ? '' : b.URL;
				    	if(b.ONE) {
				    		_this.history.pushState(null,b.TITLE,url_replace + '/index#' + b.PARENT.page);
				    	} else {
				    		var page = b.PAGE.split(',');
				    		if(page[1]=='template') {
					    		_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0]);
				    		} else {
					    		_this.history.pushState(null,b.TITLE,url_replace + '/' + b.PARENT.page);
				    		}		    		
				    	}
					}
					
			    }
		    }
		});

	    $('#config-mode-view').click(function() {
	    	location.href = '//' + b.HOST + b.REFERER;
	    });

		$('body')
			.on('click','.mini-home, #goto-top, #quick-menu-top', function(event) { 
				event.preventDefault(); 
				$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
			})
			.on('click','#quick-menu-bottom', function(event) { 
				event.preventDefault(); 
				$('body,html').animate({scrollTop: document.body.scrollHeight}, 900,'easeInOutQuart'); 
			});

		$('.data-page-prev').live({
		    click : function(e) {
		        var page = b.PAGE.split(',');
		    	if(!$(this).hasClass('active') || b.PARENT.prev === null) return false;
		    	if(typeof b.PARENT.page == 'string' && $.inArray(b.PARENT.page,b.MENULIST) == -1 && page[0] != '_product') return false;
		    	var url_replace = (b.URL == '/') ? '' : b.URL;
		    	if(b.PARENT.prev)
		    		_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0] + '/view/' + b.PARENT.prev);
		    }
		});

		$('.data-page-next').live({
		    click : function() {
		        var page = b.PAGE.split(',');
		    	if(!$(this).hasClass('active') || b.PARENT.next === null) return false;
		    	if(typeof b.PARENT.page == 'string' && $.inArray(b.PARENT.page,b.MENULIST) == -1 && page[0] != '_product') return false;
		    	var url_replace = (b.URL == '/') ? '' : b.URL;
		    	if(b.PARENT.next)
		    		_this.history.pushState(null,b.TITLE,url_replace + '/' + page[0] + '/view/' + b.PARENT.next);
		    }
		});

		// [Menu nav link] Click
		$(`#tpl-menu.nav > li:not(.siteUM,.siteLANG) a:not([href="javascript:;"]):not([href*="flink@"]),
			.cl-moption > .cl-moption-col > .cl-moption-row > a:not([href="javascript:;"]):not([href*="flink@"]),
			.el-menu header.navbar a#site-home
		`).live({
		    click : function(e) {
		    	e.preventDefault();
				if(typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) { 
					return false; 
				}
				if(typeof $(this).attr('data-toggle') != 'undefined') { return false; }

				$.each($.cookie(), function(i,v) {
					if(i.indexOf('gallery-category-') > -1) {
						var gallery_seq = i.replace('gallery-category-','');
							gcate_home = (typeof $.cookie('gallery-catehome-'+gallery_seq) == 'undefined') ? '' : $.cookie('gallery-catehome-'+gallery_seq);
						$.cookie(i, gcate_home, { path : '/', expires: 12 * 60 * 60 * 1000 });
					}
					if(i.indexOf('gallery-page-') > -1) $.cookie(i, 1, { path : '/', expires: 12 * 60 * 60 * 1000 });
					if(i.indexOf('loadmore-') > -1) $.cookie(i, 1, { path : '/', expires: 0 });
				});

				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });

				var isClickMoption = ($(this).closest('.cl-moption-col').length > 0) ? true : false,
					isClickSiteHome = (typeof $(this).attr('id') != 'undefined' && $(this).attr('id') == 'site-home') ? true : false;

				var menuVer06 = ($('.el-menu .cl-menu-option').length > 0) ? true : false,
					menuVer03 = ($('.el-menu > header').hasClass('navbar-fheader')) ? true : false,
					menuVer02 = (!menuVer03 && $('.el-menu > header').hasClass('navbar-simple')) ? true : false,
					menuVer01 = (!menuVer03 && !menuVer02) ? true : false;

				if($('body').width() < 769)  {
					var clickNavbarToggle = ( (menuVer03 && $('.navbar-toggle').css('visibility') == 'hidden') && !isClickSiteHome ||
											  (menuVer02 && !isClickSiteHome) ||
											  menuVer01
											) ? true : false;
					if(clickNavbarToggle) $('.navbar-toggle').click();
				}

				if(isClickMoption && !property.ONE) $(this).closest('header').find('.cl-menu-option').removeClass('open');
				if(!isClickSiteHome) {
					if($(this).hasClass('loginout')) {
						if(b.URL == '/render') {
							$(this).showModalFlat('INFORMATION','미리보기에서는 제공되지 않습니다.',true,false,'','ok');
							return false;
						}
						$('#loginModal').modal('show');
						$('#loginModal').css('z-index',1042);
						$('.modal-backdrop.fade.in').css('z-index', 1041);
					} else {
						$('#tpl-menu li').removeClass('active').removeClass('open');
						$(this).parent().addClass('active');

						if($(this).closest('.dropdown-menu').length>0) {
							if($('body').width() > 768) {
								$(this).closest('.dropdown').addClass('active').siblings().removeClass('active');
							} else {
								if(menuVer03) {
									$(this).closest('.menu-has-children').addClass('open').siblings().removeClass('open');
									$('#tpl-menu .menu-has-children:not(.open) ul.dropdown-menu').hide();
								} else {
									$(this).closest('.dropdown').addClass('open').siblings().removeClass('open');
									$('#tpl-menu .dropdown:not(.open) ul.dropdown-menu').hide();
								}
							}
						} else {
							if(menuVer03) $('#mobile-nav li.menu-has-children ul.dropdown-menu').hide();
							else {
								if($('body').width() < 768) $('#tpl-menu li.dropdown ul.dropdown-menu').hide();
							}
						}

						if(menuVer06) {
							$('.el-menu .cl-moption-row').removeClass('active');
							if($(this).is(':not([attr-bookmark])')) {
								$(this).closest('.cl-moption-row').addClass('active');
								if($(this).closest('.cl-moption-row[data-parent]').length > 0) $(this).closest('.cl-moption-col').find('.cl-moption-row:not([data-parent])').addClass('active');
							}
						}
					}
				}

				var loc = $(this).attr('href'),
					uri = (b.PUBLISH) ? loc : loc.replace('/render/',''),
					blank = $(this).attr('target'),
					bookmark = $(this).attr('attr-bookmark');

				if(typeof bookmark !='undefined' && bookmark) return false;
				if(typeof blank != 'undefined' && (blank == '_blank' || blank == 'blank')) {
					window.open(loc);
					e.stopPropagation();
					return false;
				}

				if(loc.match('^(mailto:|tel:|sms:)')) {
					window.location.href = loc;
					return false;
				}

				if(b.ONE!='1') {

					if(loc == 'javascript:;') return false;

					if(uri == '/render' || uri == '/') {
						uri = b.MENULINK[0];
						$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
					}

                    if(loc.match(/\@/g) === null && loc.match(/\//g) === null || loc.match(/\?clgc\=/g) !== null) {
			    		window.location.href = loc;
			    		return false;
			    	}
			    	var url = new getLocation(loc);
				    golink(_this,url);
		    		// _this.history.pushState(null,b.TITLE,(b.PUBLISH) ? "/" + uri : "/render/" + uri);
		    	} else {
			    	if(loc == 'javascript:;') {
			    		loc = '#';
			    	}

			    	var hash = '';
					if(_this.b.PUBLISH) {
						if(loc.indexOf('/index/view/') > -1 && b.ONE) ;
						else loc = loc.replace('/index','');
					} else {
						if(loc.indexOf('/index/view/') > -1 && b.ONE) ;
						else loc = loc.replace('/render/index','');
					}
					hash = loc;

			    	var fstr = loc.charAt(0),
			    		pathname = window.location.pathname;
			    	switch(fstr) {
			    		case '#':
			    			if(_this.b.PAGE == 'index') {
			    				if(pathname.charAt(1) == '_' && pathname.match(/^\/\_lang\//gi) === null) {
				    				loc = (_this.b.PUBLISH) ? '/'+loc : '/render/'+loc;	
				    				window.location.href = loc;
			    				} else {
						    		if($(this).hasClass('mini-home')) {
						    			$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
						    			history.pushState('', '', hash);
						    			return false;
						    		}
				    				var urlType = (b.PUBLISH) ? '/index' : '/render';
									_this.history.pushState(null,b.TITLE,urlType + hash);
			    				}
			    			} else {
				    			loc = (_this.b.PUBLISH) ? '/index' : '/render/index';
								_this.history.pushState(null,b.TITLE,loc);
								history.pushState('', '', loc + hash);
			    			}
			    			break;
			    		case '@':

			    			break;
			    		case '/':
			    			if(loc == '/render' || loc == '/') {
			    				loc = (_this.b.PUBLISH) ? '/index' : '/render/index';	
				    			$('body,html').animate({scrollTop: 0}, 900,'easeInOutQuart'); 
			    			}
			    			
					    	var url = new getLocation(loc);
					    	golink(_this,url);
			    			break;
			    		default:
					    	// var url = new getLocation(loc);
					    	// golink(_this,url);
					    	window.location.href = loc;
			    			break;
			    	}
	
			    	// window.location.href = loc;
		    	}
		    }
		});

		// [Menu nav link] Click (onepage)
		$(`.nav li a[href*=#]:not([href="javascript:;"]), 
			.cl-moption > .cl-moption-col > .cl-moption-row > a[href*=#]:not([href="javascript:;"])
		`).live({
		    click : function(e) {
				if(typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					e.preventDefault();
					return false;
				}
		        menuClickMove = true;

		        var link = $(this).attr('href').replace('#','');
		        if(link.substring(0,1) == '/') link = link.substring(1,link.length);
		        if(b.MENULINK.indexOf(link) > -1) moveLinkPage(link);
		    }
		});

		$('.navbar-simple .nav li a .fa').live('click', function(e) {
			if($(this).closest('header').hasClass('navbar-simple')) {
				$(this).closest('a').next('ul.dropdown-menu').slideToggle(200).closest('li').toggleClass('open').siblings().removeClass('open').find('ul.dropdown-menu').slideUp(200);
				e.preventDefault();
				return false;
			} 
		});

		$('.navbar-simple .nav li a.dropdown-toggle[href="javascript:;"]').live('click', function(e) {
			e.preventDefault();
			if($('body').width() < 768) $(this).find('.fa').click();
			return false;
		});

		$('body').on('click', '.micon', function(e) { $('#goto-top').removeClass('show'); });

		$('body').on('touchstart.dropdown.data-api, click','header .siteUM-dmenu-wrap, header .siteLANG-dmenu-wrap', function(e) {
			if(e.target.className.indexOf('siteUM-dmenu-wrap') > -1 || e.target.className.indexOf('siteLANG-dmenu-wrap') > -1) {
				if($(this).hasClass('open')) {
					$(this).removeClass('open');
					$('#goto-top').addClass('show');
				}
			} 
		});

		$('body').on('touchstart.dropdown.data-api, click', 'header.navbar-simple .navbar-collapse.in', function(e) {
			if(e.target.className.indexOf('navbar-collapse') > -1) {
				$('.navbar-toggle').click();
			}
		});

		/* [Input URL link] Click ==> link-type: link-out*/
		$('a[href*=#][attr-link]').live({
		    click : function(e) {
				console.log('link click');
		    	if($(this).is('[attr-link=""]') || $(this).is('[data-imglink="true"]')) {
					e.preventDefault();
					return false;
				} 

				if(typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					e.preventDefault();
					return false;
				}

				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });
				
				if($(this).attr('target') != '_blank') {
					var link = $(this).attr('href').replace('#','');
					if(link.length > 0 && link != '/') {
						if(b.MENULINK.indexOf(link) > -1) {
							if($('.dsgn-body').width()<769) {
								setTimeout(function() {
									moveLinkPage(link);
								},250);
							} else moveLinkPage(link);
						} else if($('.' + link).length) {
							moveLinkPage(link,1200,true);
						}
					}
				}
		    }
		    
		});

		$('.fr-custom-button[data-external-link], .fr-fic[data-external-link]').live({
			click: function() {
				if($(this).is('[data-external-link=""]')) return false;
				var link = $(this).attr('data-external-link');
				if($(this).attr('target') != '_blank') {
					location.href = link;
				} else {
					window.open(link);
				}
			}
		});

		$('[data-type="gallery"] [data-loop="true"] > .grid').live({
			touchstart: function() {
				galleryStartHover();
			},
			touchend: function() {
				galleryCloseHover();
			},
			click: function() {
				galleryMovelink();
			}
		});

		$('.gallery-sort-nav .toggle-dropdown').live({
		    click: function(e) {
		        $(this).closest('.gallery-sort-nav').toggleClass('open');
		    }
		});

		$('.gallery-category-nav li a, .gallery-sort-nav li a').live({
		    click: function() {
		    	if($(this).closest('.gallery-category-nav').hasClass('empty')) {
		    		$(this).blur();
		    		return false;
		    	}

		        if($(this).closest('li').hasClass('active')) return;

		        var isProductSort = $(this).closest('.gallery-sort-nav').length;
		        var d = new Date(),
		            now = d.getTime(),
		            idx = $(this).attr('data-idx'),
		            orderby = 'recent',
		            sfl = 'category',
		            stx = (idx != '0') ? $(this).text().trim() : '',
		            pid = $(this).closest('.element[data-type="gallery"]').attr('data-id');

        		if (isProductSort > 0) {
        			var active_category = $('.element[data-id="'+pid+'"] .gallery-category-nav li.active a');
		            stx = (active_category.length > 0 && active_category.attr('data-idx') != '0')? active_category.text() : '';
		            orderby = $(this).attr('data-orderby');
		            $('.element[data-id="'+pid+'"] .gallery-sort-nav li').removeClass('active');
		            $('.element[data-id="'+pid+'"] .gallery-sort-nav li').eq(idx).addClass('active');
		            $('.element[data-id="'+pid+'"] .gallery-sort-nav .active-sort').text($(this).text().trim());
		            $(this).closest('.gallery-sort-nav').removeClass('open');
		        } else {
					if($(this).parent('li').hasClass('total')) return false;
		            orderby = $('.gallery-sort-nav li.active a').attr('data-orderby');
			        $('.element[data-id="'+pid+'"] .gallery-category-nav li').removeClass('active');
			        $('.element[data-id="'+pid+'"] .gallery-category-nav li').eq(idx).addClass('active');
		        }

		        if(pid == 'all_products') {
		       		sfl = 'orderby';
		       		stx = (idx != '0') ? idx : '';
					if(stx == '') stx = 'recent';
					else if(stx == '1') stx = 'lowprice';
					else if(stx == '2') stx = 'review_cnt';
					else if(stx == '3') stx = 'high_score';
					else if(stx == '4') stx = 'sales';
					else if(stx == '5') stx = 'hits';
		       		$('.allProducts-sort-wrap ul li a[data-idx="'+idx+'"]').closest('li').addClass('active');
		       		$('.allProducts-sort-mobile .dropdown-toggle span').text($('.allProducts-sort-mobile ul li a[data-idx="'+idx+'"]').text());
		       	}

		        $('#el-empty').empty();
      			$('#el-empty').after('<div class="gallery-empty"></div>');
		        
	            var val = _this.galleryEL[pid],
	                tag = htmlspecialchars_decode(val.eltag,'ENT_QUOTES'),
	                elsettings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {},
	                block_lang = ($(tag).attr('data-blocklang')) ? $(tag).attr('data-blocklang') : LANG,
					checkGalleryListSample = false,
					checkGalleryListEmpty = true;

                $('#el-empty').append($(tag));
                $('#el-empty').find('[data-loop="true"]').html('');

                var nodes = $(tag).find('[data-loop="true"]').children('.grid'),
                    p = $('#el-empty').children(),
                    i = [],
                    view = $(tag).find('[data-loop="true"]').data('view'),
                    g_number = $(tag).find("[data-loop='true']").data('gallery-no'),
                    total = 0,
                    display = 0;

				var checkLoadmoreInLoop = ($(tag).find('[data-loop="true"] .loadmore-wrap').length) ? true : false,
					glm = $(tag).find('.loadmore-wrap');

                if(typeof view == 'undefined') view = 10;
	            var cookie_page = 1,
	                cookie_view = view,
	                // cookie_gallery_category = (typeof escape(stx) != 'undefined') ? escape(stx) : '',
	                cookie_gallery_category = (typeof stx != 'undefined') ? stx : '',
	                is_gc_cookie = (typeof $.cookie('gallery-category-'+val.seq) != 'undefined' && $.cookie('gallery-category-'+val.seq).length > 0) ? true : false;
            	var cookie_gallery_orderby = (typeof orderby != 'undefined')? orderby : 'recent';

				// $.cookie('gallery',val.seq, { path: '/', expires: 12 * 60 * 60 * 1000 });
				// $.cookie('loadmore-' + val.seq, cookie_page, { path: '/', expires: 12 * 60 * 60 * 1000 });
				$.cookie('gallery-page-' + val.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
				$.cookie('gallery-category-' + val.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
	            $.cookie('gallery-orderby-' + val.seq, cookie_gallery_orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
				$.removeCookie('loadmore-' + val.seq, { path : '/' });
				$.removeCookie('gallery', { path : '/' });

				$('.galleryPL'+val.seq).find('[data-loop="true"]').empty();

				var el_gh = $(tag).find('.goption').attr('data-gh'),
					checkGalleryHeight = (typeof el_gh != 'undefined' && el_gh) ? true : false,
					checkGallerySVG = ($(tag).find('.gimg-svg-wrap').length > 0) ? true : false,
					checkGFrameTitleOFF = (val.mode == 'gallery' && (typeof elsettings.gframe_title_visible != 'undefined' && elsettings.gframe_title_visible == 'OFF')) ? true : false;

				var checkUseComment = checkUseCommentFunc(val.mode, val.eltag);
				var checkUseLike = checkUseLikeFunc(val.mode, val.eltag);

                $.ajax({
                    url: '/template/gallery/list/pid/' + val.seq + '/sid/' + b.SID + '/spage/' + b.PAGE + '/view/' + cookie_view + '/publish/' + b.PUBLISH + param,
                    data: { g_mode: val.mode, visible: true, sfl: sfl, stx: stx, orderby: cookie_gallery_orderby },
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    cache: false,
                    success: function (data) {
                        $.each(data.list, function (idx, value) {
                            i.push(value);
                        });

                        total = (typeof data.total.list_total != 'undefined') ? data.total.list_total : data.total;
                        display = data.list.length;

						if( total > 0 ) checkGalleryListEmpty = false;
                        if( i.length>0 || (i.length==0 && is_gc_cookie) ) {
                            var loop_count = nodes.length, item_index = 0;
                            var elem = [];
                            $.each(data.list,function(index,v) {
                                loop_pos = index%loop_count;
                                c = nodes[loop_pos];
                                var isTitle = (v.title.length > 0) ? true:false;

								$(c).find('.non_text').removeClass('non_text');
								if(val.mode != 'shopping') {
									if(v.title.length==0) $(c).find('.figure.title').removeClass('non_text').addClass('non_text');
									if(v.caption.length==0) $(c).find('.figure.caption').removeClass('non_text').addClass('non_text');
								}

								v.title = (v.title.length>0) ? v.title : $.lang[block_lang]['editor.block.gallery.sample.title'];
								v.caption = (v.caption.length>0) ? v.caption : $.lang[block_lang]['editor.block.gallery.sample.caption'];

								$(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);

                                var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
							        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + '/' + _this.b.SID + '/',
							        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

								var folder = (val.folder == 0) ? '' : val.folder + '/',
									src = getServeImage(v.image,val.folder,img_path),
									src_s0 = getServeImage(v.image,'0',img_path);
								if($(c).find('img').length > 0) $(c).find('img').attr('src',src);
								if($(c).find('.g-img').length > 0) $(c).find('.g-img').css('background-image', 'url('+src+')');
								if(checkGallerySVG) {
									var gimgSVG = $(c).find('.gimg-svg-wrap svg');
									gimgSVG.find('pattern').attr('id','gimgSvg_'+val.elname+'_'+index);
									gimgSVG.find('image').attr('xlink:href', src);
									gimgSVG.find('polygon').attr('fill', 'url(#gimgSvg_'+val.elname+'_'+index+')');
								}
								
								var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
									glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

								if(glink) {
									if(glink.match(/^\@/g) !== null) {															// link-type: link-bookmark ==> a[attr-bookmark]
										var bookmark_seq = glink.replace(/^\@/g,'');
										if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
											glink = '';
											glink_target = '';
										}
									} else if(glink.match(/^flink\@[0-9]/gi) !== null) {										// link-type: link-file     ==> a[attr-flink]
										glink_target = '';
									} else if($.inArray(glink.replace(/^\//g,'').replace(/ /g,'-'),_this.b.MENULIST) > -1) {	// link-type: link-menu     ==> a[data-user-link]
									} else {																					// link-type: link-out      ==> a[attr-link]
										if(checkBase64Encode(glink)) glink = Base64.decode(glink);
									}
								}

								$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link').removeAttr('attr-flink');
								if (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON' && property['SITEUM'] >= 1) {
									$(c).addClass('gallery-item').addClass('nonePrice');
									$(c).find('a').attr('href', '#');
								} else {
									if(glink) {
										var glink_val = makeLinkUrl(glink, b.ONE, b.VIEW);
										$(c).find('a').attr('href',glink_val);

										if(glink.match(/^\@/g)) {
											$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
										} else if(glink.match(/^flink\@[0-9]/g) !== null) {
											$(c).find('a').attr('attr-flink',glink.replace(/^flink\@/g,''));
										// IE ERROR_includes__H.20210603
										// } else if(_this.b.MENULIST.includes(glink.replace(/ /g,'-'))) {
										} else if($.inArray(glink.replace(/ /g,'-'),_this.b.MENULIST) > -1) {
											$(c).find('a').attr('data-user-link',glink_val);
										} else {
											$(c).find('a').attr('attr-link',glink);
										}
									} else {
										if (val.mode == 'gallery') {
											src_s0 = src_s0 + '?gpos='+v.pos;

											$(c).find('a').attr('href', src_s0);
											$(c).find('a').attr('data-gallery', '#gframe-' + val.seq);
										} else {
											if(val.seq == 'all_products') {
												$(c).find('a').attr('href', v.product_url);
											} else {
												if(_this.b.LUX) $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/_product/' + v.seq);
												else $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/' + _this.b.PAGE + '/view/' + v.seq);
				
												// $(c).find('a').attr('href', ((URI=='/') ? '' : URI) + '/' + b.PAGE + '/view/' + v.seq);
											}
										}
									}
								}

								if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
								else $(c).find('a').removeAttr('target');

								if(checkGFrameTitleOFF || !isTitle) $(c).find('a').attr('data-title', '');
								else $(c).find('a').attr('data-title', v.title);

								if(val.mode == 'shopping') {
									if($(c).find('.figure.basket').length == 0) {
										$(c).find('.figure').last().after('<div class="figure basket" data-oldver="true"><span class="basket-btn">장바구니 담기</span></div>');
									}
								}

                                // caption
                                var ftitle = $(c).find('h5.figure'),
                                    fcaption = $(c).find('p.figure').not('.comment'),
                                    fdatetime = $(c).find('.figure.datetime'),
                                    fhashtag = $(c).find('.figure.hashtag'),
                                    fbrand = $(c).find('.figure.brand'),
                                    fprice = $(c).find('.figure.price'),
									freview = $(c).find('.figure.review'),
									fcomment = $(c).find('.figure.comment'),
									flike = $(c).find('.figure.like'),
									fbasket = $(c).find('.figure.basket');

                                if(fcomment.length < 1 && checkUseComment && elsettings.comment_display == 'ON') {
									$(c).find('figcaption p.figure.caption').after('<p class="figure comment old-gl hide"><svg  viewBox="0 0 14 14" width="14" height="14"><path d="M7 1C3.13 1 0 3.24 0 6c0 1.66 1.14 3.13 2.89 4.04C2.71 11 2.23 12.38 1 13c0 0 3.09 0 5.19-2.04.27.03.54.04.81.04 3.87 0 7-2.24 7-5s-3.13-5-7-5zm0 9c-.25 0-.49-.01-.73-.03l-.45-.04-.32.31c-.6.58-1.31.97-1.98 1.23.17-.43.28-.86.35-1.25l.14-.73-.66-.34C1.88 8.39 1 7.21 1 6c0-2.17 2.75-4 6-4s6 1.83 6 4-2.75 4-6 4z"/></svg><span class="figure-comment-cnt"></span></p>');
									fcomment = $(c).find('.figure.comment');
								}

								if(flike.length < 1 && elsettings.like_display == 'ON' && checkUseLike){
                                    if (fcomment.length > 0) {
			                            fcomment.each(function(idx, v){
			                                if(idx == 0) $(v).after('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
			                                else $(v).after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
			                            });
		                        	} else {
		                        		$(c).find('figcaption:not(.top) .figure:last-child').each(function(idx, v){
			                                if(idx == 0) $(v).append('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
			                                else $(v).append('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
			                            });
		                        	}
		                            flike = $(c).find('.figure.like');
		                        }
		                        
                                $(c).find('figcaption').removeClass('hide');
                                if (v.title || v.caption) {
                                    var gallery_caption = v.caption;
                                    gallery_caption = gallery_caption.replace(/\n/g,'<br />');

                                    ftitle.html(v.title);
                                    fcaption.html(gallery_caption);
                                    if(fdatetime.length > 0) fdatetime.text(v.datetime);
                                    if(fhashtag.length > 0) fhashtag.text(v.hashtag);
                                }

		                        if(g_number) {
		                            var g_index = String(index + 1),
		                                g_num = g_index.padStart(g_number, '0');
		                            $(c).find('.figure.number').text(g_num);
		                        }

								if(fbrand.length > 0) {
									var fbrand_name = (typeof v.brand_name != 'undefined' && v.brand_name) ? v.brand_name : '';
									fbrand.html(v.brand_name);
								}

								if(val.mode == 'shopping' || val.seq == 'all_products') {
									fcomment.addClass('hide');
									flike.addClass('hide');
									v.price = typeof v.price != 'undefined' ? parseFloat(v.price) : 0;
									v.sale = typeof v.sale != 'undefined' ? parseFloat(v.sale) : 0;
									var checkPriceHidden = (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON') ? true : false,
										gallery_price = (v.price && !checkPriceHidden) ? v.price : 0,
										gallery_sale_price = (typeof v.sale != 'undefined' && v.sale > 0 && v.sale > v.price && !checkPriceHidden) ? v.sale : 0,
										gallery_sale_per = (typeof v.sale_per != 'undefined' && v.sale_per && !checkPriceHidden) ? v.sale_per+'%' : '',
										product_soldout = '품절',
										product_no_sale = (typeof elsettings.sh_soldout == 'string') ? elsettings.sh_soldout : '구매불가',
										product_status = '';
									if(v.status == 'off' && !checkPriceHidden) {
										product_status = '<span class="cl-sh-soldout">' + product_no_sale + '</span>';
									} else if(v.quantity_on == 'on' && v.quantity < 1 && !checkPriceHidden) {
										product_status = '<span class="cl-sh-soldout">' + product_soldout + '</span>';
									}
									$(c).find('.cl-sh-soldout').remove();
									if(product_status != '') $(c).attr('data-soldout',true);
									else $(c).removeAttr('data-soldout');

									$(c).find('.product-badge').remove();
									product_status += drawBadgeList(v.use_badge, data.badge_settings);

									$(c).find('.cl-sh-limit').remove();
									if(v.status == 'lim') {
	                                    if(v.sale_now == false) {
	                                        var product_limit = '<p class="cl-sh-limit">상품 구매 가능 기간이 아닙니다.</p>';
				                            if(freview.length > 0) {
				                                freview.after(product_limit);
				                            } else {
				                                $(c).find('figcaption:not(.top) .figure:last-child').after(product_limit);
				                            }
	                                    }
	                                }

									if($(c).find('ul.figure.price').length > 0) {
										// var price_off = (v.sale_price > 0 && v.sale_price > v.price) ? 100 - Math.floor((v.price / v.sale_price) * 100) : 0,
										// 	off_str = (price_off > 0) ? price_off + '% ' : ''
										var off_str = (v.sale_rate > 0) ? v.sale_rate + '% ' : '';
										if(!_this.b.LUX) off_str = gallery_sale_per;
										//Ver2
										if(!checkPriceHidden) {
											$(c).find('ul.figure.price .price-val').html('￦' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
											$(c).find('ul.figure.price .price-val').removeClass('hide');

											if(gallery_sale_price > 0 && gallery_price  < gallery_sale_price) {
												$(c).find('ul.figure.price .price-sale').html('￦' + gallery_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
												$(c).find('ul.figure.price .price-sale-per').html(off_str);
												$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').removeClass('hide');
												if(_this.b.LUX && (v.hashtag).indexOf('특가세일') > -1 && $(c).find('ul.figure.price .sp-price').length == 0) {
													$(c).find('ul.figure.price .price-sale').after('<li class="sp-price">특가세일</li>');
												}
											} else {
												$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').addClass('hide').html('');
											}
											
											if(v.product_unit_str) {
												$(c).find('ul.figure.price').append(`<li class="price-unit-pricing">${v.product_unit_str}</li>`); // 단위당 가격
											}
										} else {
                                            $(c).find('ul.figure.price .price-val').html('￦0');
                                            $(c).find('ul.figure.price .price-val').addClass('hide');
										}
										if(val.seq == 'all_products' && checkPriceHidden) $(c).find('ul.figure.price').html('');
										if(product_status) $(c).find('ul.figure.price').append('<li>'+product_status+'</li>');

										var badge_size = getBadgeSize(data.badge_settings);
										$(c).find('.cl-sh-soldout').removeClass('badge-small badge-medium badge-large');
										$(c).find('.cl-sh-limit').removeClass('badge-small badge-medium badge-large');
										if(badge_size) {
											$(c).find('.cl-sh-soldout').addClass(badge_size);
											$(c).find('.cl-sh-limit').addClass(badge_size);
										}
									} else {
										//Ver1
										if(fprice.length == 0) fprice = fcaption;
										
										if(checkPriceHidden) fprice.html('');
										else fprice.html('<span class="figure-krw">￦</span>' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + product_status);
									}

									if($(c).find('ul.figure.review').length > 0) {
										var gallery_review = (v.review_onoff && v.review_cnt) ? v.review_cnt : 0;
										if(gallery_review > 0) {
											$(c).find('ul.figure.review, ul.figure.review li').removeClass('hide');
											$(c).find('ul.figure.review .figure-review-cnt').html(gallery_review);
											$(c).find('ul.figure.review .figure-review-score').html(v.review_score);
										} else {
											$(c).find('ul.figure.review, ul.figure.review li').addClass('hide');
											$(c).find('ul.figure.review .figure-review-cnt, ul.figure.review .figure-review-score').html('');
										}
									}

									if(fbasket.length > 0) {
										var checkOldBlock = ($(c).find('.figure.basket[data-oldver="true"]').length > 0) ? true : false,
											checkOldverBasket = (typeof elsettings.field_oldver != 'undefined' && elsettings.field_oldver && elsettings.field_oldver.indexOf('basket') > -1) ? true : false,
											checkDisabledBasket = (typeof elsettings.field_disable != 'undefined' && elsettings.field_disable && elsettings.field_disable.indexOf('basket') > -1) ? true : false;
										if(v.basket_off) fbasket.addClass('cannotby hide');
										else if(val.seq == 'all_products') fbasket.removeClass('hide');
										else if(checkDisabledBasket || (!checkDisabledBasket && checkOldBlock && !checkOldverBasket)) fbasket.addClass('hide');
										else if(property.VALIDTYPE != 'SM') fbasket.addClass('hide');
										else fbasket.removeClass('hide');
									}

								} else {
									fbrand.addClass('hide');
									fprice.addClass('hide');
									freview.addClass('hide');
									fbasket.addClass('hide');

									if(val.mode == 'project' && fcomment.length > 0 && typeof v.comment_cnt != 'undefined' && v.comment_cnt > 0 && elsettings.comment_display == 'ON') {
                                        fcomment.find('.figure-comment-cnt').html(v.comment_cnt);
                                        if(elsettings.field_disable !== undefined && elsettings.field_disable.indexOf('comment') > -1) {
                                            fcomment.addClass('hide');
                                        } else {
                                            fcomment.removeClass('hide');
                                        }
                                    } else {
                                        fcomment.addClass('hide');
                                    }

                                    if(flike.length > 0 && elsettings.like_display == 'ON' && checkUseLike) {
	                                    flike.removeAttr('data-like').removeClass('hide active');
	                                    if(v.like !== undefined) {
	                                    	flike.find('.figure-like-cnt').html(v.like.cnt);
		                                    if(v.like.own) flike.attr('data-like', v.seq).addClass('active');
	                                    }
	                                    if(elsettings.field_disable !== undefined && elsettings.field_disable.indexOf('like') > -1) {
                                            flike.addClass('hide');
                                        } else {
                                            flike.removeClass('hide');
                                        }
	                                } else {
	                                    flike.addClass('hide');
	                                }
								}
                                
                            	if(checkUseLike == false) flike.html('');

                                if(val.mode == 'gallery') {
	                                if(index < cookie_view) {
										$(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
									} else {
										$(c).find('figure').remove();
										$('.galleryPL'+val.seq).find('[data-loop="true"]').append($(c)[0].outerHTML);
									}
									if (total == 2) {
										$(c).find('figure').remove();
										$('.gallery-empty').append($(c)[0].outerHTML);
									}
                                } else {
	                                $(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
                                }
                            });
                        } else {
                        	if(idx == '0') {
								checkGalleryListSample = true;
	                            nodes.find('a')
	                                .addClass('emptyGalleryItem')
	                                .attr('href', '/config/page/' + b.PAGE + '/view/template')
	                                .removeAttr('data-gallery')
									.removeAttr('data-user-link')
									.removeAttr('attr-bookmark')
									.removeAttr('attr-flink')
									.removeAttr('attr-link')
	                                .find('img')
	                                .attr('data-index',0);
	                            $(p).find('[data-loop="true"]').append(nodes);
                        	}

	                        $.cookie('gallery-category-'+val.seq,'',{ path: '/', expires: 12 * 60 * 60 * 1000 });
	                        $.cookie('gallery-orderby-' + val.seq, '', { path: '/', expires: 12 * 60 * 60 * 1000 });
                        }
                        if(checkLoadmoreInLoop) $(p).find('[data-loop="true"]').append(glm);

                        tag = $(p)[0].outerHTML;
						if (val.mode == 'gallery' && total == 2) {
							$.each($('.gallery-empty').find('.gallery-item'), function(i,v) {
								var gallerySeq = $(v).attr('data-seq');
								if($('.galleryPL'+val.seq).find('.gallery-item[data-seq='+gallerySeq+']').length == 0) $('.galleryPL'+val.seq).find('[data-loop="true"]').append($(v).attr('data-index', i+2));
							});
						}
                
                        if (val.mode == 'gallery' && total) tag = appendGalleryFrame($(tag), val.seq, val.elsettings, '', val.elcss);
                        $('#el-empty').empty();
                        $('.gallery-empty').remove();
                    }
                });

                var $tag = $(tag),
                	$galleryEL = $('.element[data-id="' + val.seq + '"]'),
                	g_settings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {};

				changeBrokenImages($tag);
                $.each($tag.find('[data-edit="true"]'), function() {
                    var source = $(this).html();
                    source = source.replace(/&lt;&nbsp;/g,'&lt;').replace(/&nbsp;&gt;/g,'&gt;');
                    $(this).html(source);
                });

                if(val.feature=='masonry') {
                    var $container = $galleryEL.find('.container'),
                        $gallery_items = $tag.find('[data-loop="true"]');

                    $container.html('');
                    $galleryEL.find('[data-loop="true"]').before('<div class="gallery-loading-status"><div class="loading-dots"></div></div>');

                    var process_index = 0,
		                last_view = (view > total) ? total : view; 
                    $gallery_items.imagesLoaded().progress(function(imgload, image) {
                        process_index++;
                        if(total>0 && last_view==process_index) {
                        	setTimeout(function() {
                        		reloadMasonry($container,$gallery_items);
								refreshGalleryField($galleryEL,g_settings);
                        	}, 30);
                        }
                    });
                    if(checkGalleryListSample && total == 0) {
                    	// category change sample masonry
		                $gallery_items.find('.emptyGalleryItem').attr('data-gallery','');
                    	setTimeout(function() {
                    		reloadMasonry($container,$gallery_items);
							refreshGalleryField($galleryEL,g_settings);
                    	}, 30);
                    }
                } else {
                    $galleryEL.find('[data-loop="true"]').replaceWith($tag.find('[data-loop="true"]'));
					refreshGalleryHeight();
					refreshGalleryField($galleryEL,g_settings);
                }

                if(!checkGalleryListSample) {
					$galleryEL.find('.empty-txt').remove();
					$galleryEL.find('.container:not(.fh-container),[data-loop="true"]').removeClass('empty');
					if(checkGalleryListEmpty) {
						var empty_info = (val.seq == 'all_products') ? $.lang[LANG]['editor.gallery.product.empty.list'] : $.lang[LANG]['editor.gallery.category.empty.list'],
							empty_info = (_this.b.LUX) ? $.lang[LANG]['editor.gallery.product.empty.list'] : empty_info,
							gallery_empty_str = '<div class="col-xs-12 col-sm-12 col-md grid empty-txt">' + empty_info + '</div>';
						
						if(val.feature=='masonry') {
							$galleryEL.find('.container:not(.fh-container)').removeAttr('style').addClass('empty').append(gallery_empty_str);
						} else {
							$galleryEL.find('[data-loop="true"]').addClass('empty').empty().append(gallery_empty_str);
						}
					}
                }

				var $glmBtnWrap = $galleryEL.find('.loadmore-wrap'),
					$glmBtn = $galleryEL.find('.loadmore-wrap .gallery-loadmore'),
					checkLoadmore = (total > view && total > cookie_view && !checkGalleryListEmpty) ? true : false,
					glm_lang = LANG;

				if(typeof g_settings.loadmore_lang != 'undefined' && g_settings.loadmore_lang && $.inArray(g_settings.loadmore_lang.toLowerCase(), ['ko','en']) > -1) glm_lang = g_settings.loadmore_lang.toLowerCase();
				else if(typeof block_lang != 'undefined' && $.inArray(block_lang, ['ko','en']) > -1) glm_lang = block_lang;
				var glm_txt = $.lang[glm_lang]['config.loadmore'];

				if($glmBtnWrap.length == 0) {
					// gallery loadmore btn - default (ver1)
					if(checkLoadmore) {
						var glm_class = (val.feature=='masonry') ? 'gallery-loadmore masonry-layout' : 'gallery-loadmore',
							glm_btn = '<div class="' + glm_class + '" data-loadmore="true" data-selector=".gallery-loadmore" data-total="' + total + '" data-id="' + val.seq + '" data-page="2" data-view="' + view + '" data-folder="' + val.folder + '" data-mode="' + val.mode + '">' + glm_txt +' &nbsp;(<span class="display">' + cookie_view + '</span> / ' + number_format(total) + ')</div>';

						if($galleryEL.find('.gallery-loadmore').length > 0) $galleryEL.find('.gallery-loadmore').replaceWith(glm_btn);
						else $galleryEL.append(glm_btn);
					} else $galleryEL.find('.gallery-loadmore').remove();

				} else {
					// gallery loadmore btn - custom (ver2)
					if(checkLoadmore) {
						if(val.feature=='masonry') $glmBtn.addClass('masonry-layout');
						else $glmBtn.removeClass('masonry-layout');
						$glmBtn.attr('data-loadmore','true').attr('data-id',val.seq).attr('data-total',total).attr('data-page',2).attr('data-view',view).attr('data-folder',val.folder).attr('data-mode',val.mode);
						$glmBtn.find('.label').text(glm_txt);
						$glmBtn.find('.display .view').text(cookie_view);
						$glmBtn.find('.display .total').text(total);
						$glmBtnWrap.removeClass('hide').fadeIn();
					} else {
						$glmBtnWrap.fadeOut().addClass('hide');
						$glmBtn.removeAttr('data-loadmore').removeAttr('data-id').removeAttr('data-total').removeAttr('data-page').removeAttr('data-view').removeAttr('data-folder').removeAttr('data-mode').removeClass('masonry-layout');
						$glmBtn.find('.label').text(glm_txt);
						$glmBtn.find('.display .view').text('0');
						$glmBtn.find('.display .total').text('0');
					}
				}

				if($galleryEL.has('input.gjs').length) setGalleryJS('change-loop',$galleryEL);

                if($galleryEL.find('*[data-direffect="true"]').length > 0 ) {
                    setTimeout(function() {
                        $galleryEL.find('.grid').each(function() {
                            $(this).hoverdir();
                        });
                    }, 400);
                }

				var header_h = $('header').css('height').replace(/[^0-9]/g, '');
				var isSidebar = $('.dsgn-body').hasClass('sidebar');
				// console.log(b.MODE); //demo / publish
				if(!isSidebar) {
					$('html').animate({ 
						'scrollTop': $('.'+val.elname).offset().top - (Number(header_h))
					}, 500);
				} else {
					$('html').animate({ 
						'scrollTop': $('.'+val.elname).offset().top
					}, 500);
				}
		    }
		});

		$(':not(.review-sample-block) .review-sort-nav .toggle-dropdown').live({
		    click: function(e) {
		        $(this).closest('.review-sort-nav').toggleClass('open');
		    }
		});

		$(':not(.review-sample-block) .review-sort-nav li a').live({
		    click: function() {
	        	if ($(this).closest('li').hasClass('active')) return;

	        	var review_block_id = $(this).closest('.element').attr('data-id');
	        	var idx = $(this).attr('data-idx'),
		            orderby = $(this).attr('data-orderby');
		        console.log('review_block_id', review_block_id);
	            $('.element[data-id="'+review_block_id+'"] .review-sort-nav li').removeClass('active');
	            $('.element[data-id="'+review_block_id+'"] .review-sort-nav li').eq(idx).addClass('active');
	            $('.element[data-id="'+review_block_id+'"] .review-sort-nav .active-sort').text($(this).text().trim());
	            $(this).closest('.review-sort-nav').removeClass('open');

	        	var val = _this.galleryEL[review_block_id];
            	var settings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {};
            	var gallery_data = (typeof settings.gallery_data != 'undefined' && settings.gallery_data) ? settings.gallery_data : {};
            	var cookie_review_orderby = (typeof orderby != 'undefined')? orderby : 'recent';

            	$.cookie('review-orderby-' + review_block_id, cookie_review_orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
            	$.reviewContents.init(review_block_id, gallery_data);
		    }
		});

		$(':not(.review-sample-block) .review-data-loadmore').live({
		    click: function() {
		    	var review_block_id = $(this).attr('data-id'),
					page_num = (typeof $(this).attr('data-page') != 'undefined') ? Number($(this).attr('data-page')) : 1,
					view = (typeof $(this).attr('data-view') != 'undefined') ? Number($(this).attr('data-view')) : 6,
					$review_elLoadmore = $(this),
					$review_el = $('.element[data-id="' + review_block_id + '"]'),
					$rContainer = $review_el.find('.container'),
					$rLoop = $review_el.find('[data-loop="true"]'),
		            $ro = $review_el.find('.review-sort-nav li.active a'),
		            orderby = ($ro.length > 0) ? $ro.attr('data-orderby') : 'recent';

		        var val = _this.galleryEL[review_block_id];
            	var settings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {};
            	var gallery_data = (typeof settings.gallery_data != 'undefined' && settings.gallery_data) ? settings.gallery_data : {};
            	// var cookie_review_orderby = (typeof orderby != 'undefined')? orderby : 'recent';

            	$.cookie('review-orderby-' + review_block_id, orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
            	$.reviewContents.update(review_block_id, gallery_data, orderby, page_num);
		    }
		});

		// menu ver3 : fheader - #mobile-nav show/hide function
		$(document)
			.on('click', 'ul li.siteSEARCH > a.psearch-btn, \
									ul li.siteSEARCH .psearch-overlay.open, \
									ul li.siteSEARCH .psearch-input', function(e) {
				e.preventDefault();
				var taret_nav = (window.innerWidth <= 768) ? $('#mobile-nav') : $('header.navbar-fheader'),
					check_psearch_area = (taret_nav.find('.psearch-wrap').is(e.target) || taret_nav.find('.psearch-wrap').has(e.target).length > 0) ? true : false;
		
				if(!check_psearch_area) {
					taret_nav.find('.psearch-overlay').toggleClass('open');
					setTimeout(function() {
						$.psearch.showSiteProjectSEARCH(false);
						taret_nav.find('.psearch-overlay').find('input.psearch-input').focus();
					},300);
				}
				return false;
			})
			.on('click', '#fixed-menu li.siteCART > a[href="javascript:;"], #fixed-menu-sub li.siteCART > a[href="javascript:;"]', function(e) {
				e.preventDefault();
				$(this).showModalFlat('INFORMATION',$.lang[LANG]['fheader.cart.no-support.render-mode'],true,false,'','ok');
				return false;
			})
			.on('click', '#mobile-nav .login-content:not(.siteUM)', function(e) {
				e.preventDefault();
				$('#mobile-nav #fixed-menu .siteUM a i').click();
				return false;
			})
			.on('click', '#mobile-nav .nav li.menu-has-children > a[href="javascript:;"]', function(e) {
				e.preventDefault();
				$(this).prev('.fa').click();
				return false;
			})
			.on('click', '#mobile-nav ul li.menu-has-children i', function(e) {
				if($(this).closest('li.menu-has-children').hasClass('open')) {
					$(this).closest('li.menu-has-children').removeClass('open');
					$(this).nextAll('ul').eq(0).slideToggle(200);
					// $(this).next().removeClass('menu-item-active');
					$(this).toggleClass('fa-chevron-down fa-chevron-up');
				} else {
					$(this).closest('li.menu-has-children').addClass('open').siblings('li.open').find('i').click();
					$(this).nextAll('ul').eq(0).slideToggle(200);
					// $(this).next().toggleClass('menu-item-active');
					$(this).toggleClass('fa-chevron-down fa-chevron-up');
				}
			})
			.on('click', 'header.navbar-fheader .navbar-toggle', function(e) {
				if( window.innerWidth > 768 &&
					$(this).closest('header').find('.cl-menu-option').length > 0 && 
					$(this).closest('header').find('.cl-menu-option').is('[data-moption="ntoggle"],.nfullDrop')
				) {
					e.preventDefault();
					return false;
				}

				if($('.dsgn-body').hasClass('mobile-nav-active')) {
					//close mobile menu
					$('header.navbar-fheader .navbar-toggle').css({'visibility':'visible'});
					$('.dsgn-body').removeClass('mobile-nav-active');
					$('#mobile-body-overly').removeClass('in');
					$('#mobile-nav .siteLANG.cl-fixbtn').hide();
				} else {
					//show mobile menu
					$('header.navbar-fheader .navbar-toggle').css({'visibility':'hidden'});
					$('.dsgn-body').addClass('mobile-nav-active');
					$('#mobile-body-overly').addClass('in');
					$('#mobile-nav .siteLANG.cl-fixbtn').show();
				}
			})
			.on('click', '#mobile-nav-toggle', function(e) {
				$('header.navbar-fheader .navbar-toggle').click();
			});

		$('header.navbar-simple .navbar-toggle').live('click',function(e) {
			var check = $(this).hasClass('collapsed') ? false : true;
			if(check) {
				var p_t = $('.el-menu header').height() + 'px';

				$('.element').each(function(){ $(this).addClass('blur-filter'); });
				$('.el-menu').addClass('blur-filter');

				if($('body').height() > ($('.el-menu').find('#tpl-menu').height() + 80)) $('.el-menu').find('#tpl-menu').addClass('center-position');
				else $('.el-menu').find('#tpl-menu').removeClass('center-position');
				
				$('.dsgn-body').bind('touchmove');
				$('#goto-top').removeClass('show');
			} else {
				$('.element').each(function(){ $(this).removeClass('blur-filter'); });
				$('.el-menu').removeClass('blur-filter');
		        $('.dsgn-body').unbind('touchmove');
				$('#goto-top').addClass('show');
			}
		});

		$('.element[data-type="gallery"]').live({
			mouseenter : function() {
				$(this).find('[data-direffect="true"] .grid').each(function() {
					$(this).hoverdir();
				});
			}
		});	

		$('.creatorlink-header .data-user > ul > li').live({
			click : function() {
				$(this).closest('.pull-right').toggleClass('open');
				if($(this).closest('.pull-right').hasClass('open')) {
					$('.popover').show();
				} else {
					$('.popover').hide();
				}
			}
		});

		/* [Menu link] Click ==> link-type: link-menu or link-inner*/
		$('*[data-user-link]').live('click',function(e) {
			if($.clnav.check 
				&& ($(this).closest('.clnav-nowrap-target').length > 0 || (typeof _d != 'undefined' && $(this).closest(_d.label.sidemobile.modal).length > 0))
			) {
				/* .cl-nav-option[data-nowrap="true"] */
				if ($.clnav.d.isDrag) {
					e.preventDefault();
					e.stopImmediatePropagation();
					return false;
				}
			}

			if(	$(this).is('[data-user-link=""]') 
				|| (typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple'))
			) {
				e.preventDefault();
				return false;
			}

			$.removeCookie('gallery', { path: '/' });
			$.removeCookie('gallery-item', { path : '/' });
			$.removeCookie('forum', { path : '/' });
			$.removeCookie('forum-item', { path : '/' });

		 	if(!selectEL || typeof selectEL == 'undefined') {
				selectEL = $(this).closest('.element').attr('data-el');
			}

			//latest block - table header click, set click table
			if(typeof $(this).attr('data-lt-header') != 'undefined') {
				var type = $(this).closest('.latest-table').attr('data-type'),
					pid = $(this).closest('.latest-table').attr('data-pid'),
					clickEL = (type == 'gallery') ? $('.gallery-item[data-seq="'+pid+'"]') : $('.element[data-id="' + pid + '"]'),
					checkThisPage = (b.ONE && clickEL.length > 0) ? true : false;

				if(checkThisPage) {
					if(type == 'forum') {
						scrollToBlock('.element[data-id="' + pid + '"]', 1000);
						return false;
					} else if(type == 'gallery') {
						moveGallery(pid);
						return false;
					}
				} else $.cookie(type+'-item',pid, { path: '/' });
			} else {
				if(typeof $(this).attr('data-forum-type') !== 'undefined' && $(this).attr('data-forum-type') == 'qna') {
		            var type = $(this).closest('.latest-table').attr('data-type'),
		                pid = $(this).closest('.latest-table').attr('data-pid'),
		                clickEL = $('.element[data-id="' + pid + '"]'),
		                checkThisPage = (b.ONE && clickEL.length > 0) ? true : false,
		                page_num = $(this).attr('data-page'),
		                row_id = $(this).closest('.latest-post-list-title').attr('data-id');
		            if(checkThisPage) {
		                scrollToBlock('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]', 1000);
		                $('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]').click();
		                // $.removeCookie('forum_content_view', { path: '/', expires: 12 * 60 * 60 * 1000 });
		                return false;
		            } else {
		                $.cookie(type+'-item',pid, { path: '/' });
		                $.cookie('forum_content_view', pid+'&'+row_id, { path: '/', expires: 12 * 60 * 60 * 1000 });
		                $.forum.setForumCookie(pid,page_num,'','','');
		            };
		        }
			}

			//psearch - project item(pitem) click, set click parent
			if($(this).closest('.psearch-view').length > 0) {
				if(typeof $(this).attr('data-psearch-seq') != 'undefined') {
					$.cookie('gallery-item',$(this).attr('data-psearch-seq'), { path: '/' });
				} else {
					$.cookie('gallery',$(this).attr('data-psearch-pid'), { path: '/' });
				}

				if(b.ONE && typeof $(this).attr('data-user-link') != 'undefined' &&  $(this).attr('data-user-link') == 'index') {
					location.replace('/');
					return false;
				}
			}

		 	var datatype = $('.'+selectEL).attr('data-type'),
    			isimglink = $('.'+selectEL).hasClass('imglink'),
    			hasalink = $(this).hasClass('sha_link'),
    			isshlink = $(this).is('[data-shlink]');

		    var userLink = ((datatype == 'showcase') && isimglink && isshlink) ? $(this).attr('data-shlink') : $(this).attr('href'),
        		target = '';


    		if((typeof $(this).attr('target') != 'undefined') || (typeof $(this).attr('data-blank') != 'undefined')) {
		        if((datatype == 'showcase') && isimglink && isshlink) {
		           target = $(this).attr('data-blank'); 
		        } else target = $(this).attr('target'); 
		    } 

		    if(userLink.match(/^mailto:|^tel:|^sms:/gi) !== null) {
		    	window.location.href = userLink;
		    	return false;
		    }

			if(typeof userLink == 'undefined' || $(this).attr('data-user-link') == '' ) {
				if(target == '_blank' || target == 'blank') {
			    	var openNewWindow = window.open(userLink);
			    	return false;
		    	} else  {
			    	var url = new getLocation(userLink);
			    	golink(_this,url);
			    	return false;
		    	}
			}

			e.preventDefault();
		    if(b.ONE) {
		    	if(userLink.charAt(0)=="/") {
				    var linkRegExp = /\/view\//gi;
				    var linkMatch = userLink.match(linkRegExp);
				    if(linkMatch && linkMatch[0]) {
					    var url = ((b.URL=="/") ? "" : b.URL) + userLink;
					    if(target == '_blank') {
					    	var openNewWindow = window.open(url);
					    } else { 
						    location.href=url;
						}
					    return false;
				    }
			    	userLink = userLink.charAt(0).replace("/","") + userLink.slice(1);
			    	if(target == '_blank') {
					    var url = ((b.URL=="/") ? "/" : b.URL) + '#' + userLink;
				    	var openNewWindow = window.open(url);
			    	} else { 
			    		if(b.VIEW) {
						    var url = ((b.URL=="/") ? "/" : b.URL) + '#' + userLink;
					    	url = new getLocation(url);
					    	golink(_this,url);
			    		} else {
			    			moveLinkPage(userLink);
			    		}
				    }
		    	} else {
		    		// alert('Invalid URL');
		    		return false;
		    	}
		    } else {
			    var url = ((b.URL=="/") ? "" : b.URL) + userLink;
			    if(target == '_blank' || target == 'blank') {
			    	var openNewWindow = window.open(url);
			    } else { 
			    	url = new getLocation(url);
			    	golink(_this,url);
				}
		    }
		});
		
		/* [Block Bookmark link] Click ==> link-type: link-bookmark*/
		$('a[attr-bookmark],*[data-imglink="true"][attr-bookmark],.fr-custom-button[attr-bookmark],.fr-fic[attr-bookmark]').live({
		    click : function(e) {
		        e.preventDefault();

				if($.clnav.check 
					&& ($(this).closest('.clnav-nowrap-target').length > 0 || $(this).closest(_d.label.sidemobile.modal).length > 0)
				) {
					/* .cl-nav-option[data-nowrap="true"] */
					if ($.clnav.d.isDrag) {
						e.stopImmediatePropagation();
						return false;
					}
				}

		    	if(	$(this).is('[attr-bookmark=""]') 
					|| (typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple'))
				) {
		        
				// if(typeof e.target.className == 'string' && e.target.className.indexOf('fa') > -1 && $(this).closest('header').hasClass('navbar-simple')) {
					return false;
				}

				if(!selectEL || typeof selectEL == 'undefined') {
					selectEL = $(this).closest('.element').attr('data-el');
				}
				var datatype = $('.'+selectEL).attr('data-type'),
            		isimglink = $('.'+selectEL).hasClass('imglink'),
            		hasalink = $(this).hasClass('sha_link'),
            		isshlink = $(this).is('[data-shlink]'),
            		blockBookmarkList = (typeof b.SETTINGS.blockBookmarkList != 'undefined' && b.SETTINGS.blockBookmarkList) ? b.SETTINGS.blockBookmarkList : {},
            		hideArray = (typeof blockBookmarkList.hide == 'undefined' || !blockBookmarkList.hide) ? {} : blockBookmarkList.hide;
				
				$.removeCookie('gallery', { path: '/' });
				$.removeCookie('gallery-item', { path : '/' });
				$.removeCookie('forum', { path : '/' });
				$.removeCookie('forum-item', { path : '/' });
				
		        var a_el = $(this),
		        	link = ((datatype == 'showcase') && isimglink && isshlink) ? $(this).attr('data-shlink').replace(/^\@/g,'') : $(this).attr('href').replace(/^\@/g,''),
		            target = '';

	            if(hideArray.length > 0) {
					// IE ERROR_includes__H.20210603
	            	// if(hideArray.includes(link)) {
	            	if($.inArray(link,hideArray) > -1) {
		        	    //blockbookmarkLink => 블럭 숨김 체크 
			            return false;
			        } 
	            }
	            


	            if((typeof $(this).attr('target') != 'undefined') || (typeof $(this).attr('data-blank') != 'undefined')) {
		            if((datatype == 'showcase') && isimglink && isshlink) {
		               target = $(this).attr('data-blank'); 
		            } else target = $(this).attr('target'); 
		        } 

		        if($('.element[data-bookmark="' + link + '"]').length > 0 && target != '_blank') {
		            moveLinkPage(b.PAGE+'\@'+link,1200,true);
		        } else {
		        	var attr_bookmark = $(this).attr('attr-bookmark');
		        	if(typeof attr_bookmark != 'undefined' && attr_bookmark && typeof b.SETTINGS.blockBookmarkList != 'undefined' && typeof b.SETTINGS.blockBookmarkList['bookmark' + attr_bookmark] != 'undefined') {
		        		// if(b.SETTINGS.blockBookmarkList['bookmark' + attr_bookmark] == link) {
		        			link = attr_bookmark;
		        		// }
		        	}
					if(typeof b.SETTINGS.blockBookmarkList == 'undefined'|| !b.SETTINGS.blockBookmarkList || typeof b.SETTINGS.blockBookmarkList['bookmark'+link] == 'undefined' ) {
						a_el.find('img[data-attach="true"]').unwrap();
						return false;
					}

		            $.post('/template/bookmarkBlock', {sid: b.SID, seq: link, publish : b.PUBLISH}, function(data) {
						if(data.length == 0) {
							console.log('Block Link Click :( Undefined block');
							return false;
						}

						var d = data[0];
						if(typeof d.orgpage == 'undefined' || d.orgpage.length == 0) d.orgpage = d.page;

						var	org_title = d.orgpage.replace(/-/g,' '),
							bb_o_page = (d.page.match(/^index/g) !== null ) ? org_title : d.page,
							bb_page = (bb_o_page.match(/\,/g) !== null) ? bb_o_page.substring(0,d.page.indexOf('\,')) : bb_o_page;


						var check_link = true,
							is_visible_menu = false;

						$.each(b.SMENU, function (idx, obj) {
							if(bb_page == obj.name.replace(/ /g,'-')) {
								if(!obj.link) check_link = false;
								if(obj.display == 'on') is_visible_menu = false;
							}
							if(obj.children) {
								$.each(obj.children, function (i, v){
									if(bb_page == v.name.replace(/ /g,'-')) {
										if(!v.link) check_link = false;
										if(v.display == 'on') is_visible_menu = false;
									}
								});
							}
						});

						var is_here = ($('.element[data-bookmark="' + link + '"]').length > 0 ) ? true : false,
							is_page = (b.PAGE.toLowerCase()==d.page.toLowerCase()) ? true : false,
							// is_visible_menu = ($.inArray(bb_page,b.MENULINK)>-1) ? true : false,
							// check_link = ( $('#tpl-menu li a[href*="'+bb_page+'"]').length > 0 && $('#tpl-menu li a[href*="'+bb_page+'"]').text().trim().replace(/ /gi,'-') == bb_page ) ? false : true,
							is_link = ( check_link && is_visible_menu && org_title != 'INTRO' ) ? true : false,
							is_visible = (check_link && is_visible_menu && org_title != 'INTRO') ? true : false;


						// console.log('is_visible_menu : ' + is_visible_menu);
						// console.log('bb_page : ' + bb_page);
						// console.log('d.glivisible : ' + d.glivisible);
						// console.log('is_link : ' + is_link);
						// console.log('is_visible : ' + is_visible);
						// console.log('is_here : ' + is_here);
						// console.log('is_page : ' + is_page);

						if( ( !is_visible_menu && bb_page!='index' ) || 
							( typeof d.glivisible!='undefined' && d.glivisible ) ||
							( /*( (is_here && target=='_blank') || !is_page ) &&*/ ( is_link || is_visible ) ) ||
							( !is_here && is_page ) )  {
								if(is_visible_menu == false) {
									moveBookmark(d.page,'\@'+link,1200,target);
								} else {
									a_el.find('img[data-attach="true"]').unwrap();
									return false;
								}
						} else {
							moveBookmark(d.page,'\@'+link,1200,target);
						}

		            }, 'json');
		        }
		        
		    }
		});

		/* [File link] Click ==> link-type: link-file*/
		$('a[attr-flink], .fr-custom-button[attr-flink], .fr-fic[attr-flink]').live({
			click : function(e) {
				e.preventDefault();

				if($.clnav.check 
					&& ($(this).closest('.clnav-nowrap-target').length > 0 || $(this).closest(_d.label.sidemobile.modal).length > 0)
				) {
					/* .cl-nav-option[data-nowrap="true"] */
					if ($.clnav.d.isDrag) {
						e.stopImmediatePropagation();
						return false;
					}
				}

		    	if(	!property.VALIDPLAN
					|| property.VALIDTYPE == 'PK'
					|| $(this).is('[attr-flink=""]') 
				) {
					return false;
				}

				var id = $(this).attr('attr-flink');
				if(typeof id == 'undefined' || !id) { return false;
				} else {
					// direct download
					// var flink_url = location.protocol + '//' + location.host +'/down/flink/' + id;
					// window.open(flink_url);

					// modal open
					$.getJSON('/down/flink/get/id/' + id , {}, function (data) {
						checkError(data);
						if(typeof data.data == 'object' && !$.isEmptyObject(data.data)) {
							var flink_link = data.data;
							var flinkDownModal = $(this).showModalFlat($.lang[LANG]['config.information'], $.lang[LANG]['editor.link.file.download.check'], true, true, function() {
								var flink_url = location.protocol + '//' + location.host +'/down/flink/' + id + '/sid/' + flink_link.sid + '/s/' + encodeURIComponent(flink_link.file) + '/name/' + encodeURIComponent(flink_link.name);
								window.open(flink_url);
								flinkDownModal.modal('hide');
							}, 'cancel', 'ok');
						} else {
							return false;
						}
					}, 'json');
				}

			}
		});

		$('.element img[data-attach="true"][data-img-original="ON"]').live({
			click: function(e) {
				$(this).mouseenter();
			},
			mouseenter : function(e) {
				if(!selectEL || typeof selectEL == 'undefined') {
					selectEL = $(this).closest('.element').attr('data-el');
				}
				if(typeof selectEL == 'undefined') return false;

				var offset = $(this).offset(),
			        left = $(this).width() + offset.left-25,
					top = offset.top;
				var index = $('.' + selectEL + ' img[data-attach="true"]').index(this);

				if(b.VIEW) {
					var src = $(this).prop('src').split('/'),
						file = src[src.length-1];
		            if(src.indexOf('googleusercontent') > -1) {
		            	file = src;
		            }
					$('.config-image-view').css({ top : top + 'px', left : left + 'px' }).attr('data-src',$(this).prop('src')).attr('data-index',index).show();
				}
			},
			mouseleave : function(e) {
				$('.config-image-view').hide();
			}
		});

		$('.config-image-view').live({
			mousemove : function(e) { $('.config-image-view').show(); },
			mouseout : function(e) { $('.config-image-view').show(); }
		});

	    $('.config-image-view').on({
			click: function (e) {
				$('.config-image-view').hide();

				var src = $(this).attr('data-src').split('/'),
					file = src[src.length-1],
	                free = (src[4]=='free') ? true : false;

	            var img_src = $(this).attr('data-src')
	            if(img_src.indexOf('googleusercontent') > -1) {
	            	file = img_src;
	            }
	            file = Base64.encode(file);
				if(b.SID && file) {
					$('.tooltip.in').removeClass('in');
			  		$(this).attr("href","/image/original/sid/" + b.SID + "/file/" + file + '/free/' + free);
				} else {
					// console.log('None:: sid or src');
					return false;
				}
	        }
	    });

		$('[data-lock-password]').live({
			'keydown.autocomplete': function(e) {
			    if (e.keyCode == 13) {
			    	$('[data-lock-submit]').click();
				}
			},
			'keyup': function() {
				if ($(this).val()) {
					$('[data-lock-submit]').addClass('btn-primary');
				} else {
					$('[data-lock-submit]').removeClass('btn-primary');
				}
			}
		});

		$('.form-control[type="number"]').live('keydown', function(e) {
			if (e.keyCode == 109 || e.keyCode == 189) {
				return false;
			}
		});

		$('[data-form-submit]').live('click', function() { 
            var is_templates = checkTemplateSite(b.SID);
            if($('#flat-modal').length || is_templates) return false;			
			if($('#flat-modal').length) return;
			var $parent = $(this).closest('.element'),
				$items = $parent.find('[form-idx]'),
				values = {},
				pid = $parent.attr('data-id'),
				submit = true,
				el = '.' + $(this).parents('.element').attr('data-name');

			if($parent.find('.required').length > 0) {
				$parent.find('.form-inline').removeClass('required required-mr required-privacy');
				$parent.find('.form-group').removeClass('required');
			}

			$parent.find('.error').remove();
			$.each($items, function(i,v) {
				var idx = $(this).attr('form-idx'),
					name = $(this).attr('form-name'),
					type = $(this).attr('form-type'),
					require = $(this).attr('form-require'),
					seq = $(this).attr('form-seq');

				switch(type) {
					case "radio":
					case "check":
						if(type == 'radio') {
							var val = $(this).find(':radio[name]:checked').val();
							values[seq] = (typeof val == 'undefined') ? '' : val;
						} else {
							values[seq] = $(this).find(':checkbox[name]:checked').map(function() { return this.value; } ).get().join();
						}

						if(typeof require != 'undefined' && require) {
							if(!values[seq]) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						break;
					case "date":
						var date = $(this).find('input').map(function() { return this.value.replace(/-/g, ''); } ).get(),
							valid = true;

						$.each(date, function(k,d) {
							if(d=='') valid = false;
						});

						if(typeof require != 'undefined' && require) {
							if(valid == false) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						values[seq] = date.join('');
						break;	
					case "date2":
						var date = $(v).find('input').val();
						if($(v).find('input').length > 1 && $(v).find('.date-yyyy').length > 0) { //old
							var ymd = $(v).find('.date-yyyy').val() + '-' + $(v).find('.date-mm').val() + '-' + $(v).find('.date-dd').val();
							var time = $(v).find('.date-hh').val() + ':' + $(v).find('.date-ii').val();
							date = ymd + ' ' + time;
						}
						values[seq] = date;
						if(typeof require != 'undefined' && require) {
							if(!values[seq]) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						
						break;
					case "file.upload":
						var fileArr = new Array();
						$(this).find('input[type="hidden"]').each(function(idx, v) {
							var f = '#FILE#||' + $(v).val();
							fileArr.push(f);
						});

						var val = fileArr.join(',');
                        values[seq] = (typeof val == 'undefined') ? '' : val;

                        if(typeof require != 'undefined' && require) {
                            if(!values[seq].replace('#FILE#||', '')) {
                                formRequireDisplay($(this),i+1);
                                submit = false;
                            }
                        }
						break;
					default : 
						values[seq] = $(this).val().trim();
						if(values[seq] && checkEmojis(values[seq])) {
							formRequireDisplay($(this),i+1,'emoji');
							submit = false;
						} else if(typeof require != 'undefined' && require) {
							if(!values[seq]) {
								formRequireDisplay($(this),i+1);
								submit = false;
							}
						}
						break;
				}
			});

			var $privacy = $parent.find('.form-privacy'),
				check;

			if($privacy.css('display')!='none') {
				check = $privacy.find('.check-privacy').prop('checked');
				if(check === false) {
					formRequireDisplay($privacy.find('.check-privacy'),'privacy');
					submit = false;
				}
			}

			var $captcha = $parent.find('.form-captcha');
			var formCaptcha = '';

			if($captcha.length > 0) {
				formCaptcha = $captcha.find('.input-captcha').val();
				if(formCaptcha == '') {
					formRequireDisplay($captcha.find('.input-captcha'),'captcha');
					submit = false;
				}
			}

			if(!$parent.hasClass('el-fixedcontact') && $('.form-inline .error').length > 0) {
				var $error = $parent.find('.error');
				var header_height = $('.navbar-fheader').height();
				$.each($error, function(i,v) {
					if(i==0) {
						var $form_group = $(v).parent().find('[form-type]');
						var type = $form_group.attr('form-type');
						var privacy = $(v).parent().hasClass('form-privacy');
						if(type=='radio'||type=='check'||privacy) {
							var form_offset = $(v).parents('.form-group').offset();
							$("html, body").animate({scrollTop: ($parent.attr('data-type') == 'form')? form_offset.top-header_height : $parent.offset().top-header_height});
						} else {
							$(v).parent().find('.form-control').first().focus();
						}
					}
				});
			}

			if(submit) {
				$.processON();
		        $.ajax({
		            url: '/template/forms/submit',
					data: { sid : b.SID, pid : pid, values : values, check : check, captcha : formCaptcha },
					dataType: 'json',
					type: 'POST',
		            async: true,
		            cache: false,
		            success: function (data) {
					    $.processOFF();
						checkError(data);

						if(typeof data.error != 'undefined' && data.error != '') {
							// $(this).showModalFlat('', data.error,true,false,'','ok','','cl-cmmodal cl-s-btn w560 cl-p130 cl-t80 cl-modal cl-none-title cl-close-btn','','',function() {
							// 	$(document).on('keydown', function(e) {
							// 		if(e.keyCode == 27) modal.modal('hide');
							// 	});
							// });
							return false;
						}

						if(typeof data.captcha_error != 'undefined' && data.captcha_error != '') {
							alert($.lang[LANG][data.captcha_error]);
							$captcha.find('.input-captcha').focus();
							return false;
						}

		    			$(this).showModalFlat('INFORMATION',data.done,true,false,'', 'ok', '', 'cl-modal cl-none-title cl-cmmodal cl-p130 cl-s-btn w560','','',function(){
							if(typeof formCallback == 'function') formCallback(pid);
						});

			    		setDefaultForm(el);
			    		
			    	}
				},'json');
			}
		});

		var formRequireDisplay = function($obj,idx,error_type) {
			if(typeof error_type == 'undefined') error_type = '';

			var isModoo = $obj.parents('.element').hasClass('modoo');

			var blang = $obj.parents('.element').attr('data-lang'),
				sdefault = '';

			var $el = $obj.parents('.element');

			if(typeof property.SLANG.select != 'undefined') {
				var _lang = property.SLANG.select;
				if(_lang.indexOf('한국어') > -1) {
					sdefault = '필수 입력 사항';
				} else if(_lang.indexOf('English') > -1) {
					sdefault = 'Required';
				} else if(_lang.indexOf('日本語') > -1) {
					sdefault = '必須';
				} else {
					sdefault = 'Required';
				}
			} else sdefault = '필수 입력 사항';


			if(error_type == 'emoji') {
				sdefault = $.lang[LANG]['config.unable.emoji'];
			}
			
			var $parent = (isModoo) ? $obj.parents('.box') : $obj.parents('.form-group'),
				$html = $('<div class="error">' + sdefault + '</div>');
			$parent.append($html);
			if($obj.parents('.form-inline').find('.error').length==1) {
				if(isNumber(idx)) $('body').scrollTo($('[form-idx="' + idx + '"]'), 0, { offset : -150 } );
				else  $('body').scrollTo($parent, 0, { offset : -150 } );
			}
			if($el.attr('data-type') == 'contact' && $el.attr('data-type2') == 'franchise bar') {
				$parent.addClass('required');
				$el.find('.form-inline').addClass('required');

				if($parent.hasClass('form-privacy')) {
					$el.find('.form-inline').addClass('required-privacy');
				} else {
					if(idx > 2) {
						$el.find('.form-inline').addClass('required-mr');
					}
				}
			}
		}

		$('.date-yyyy').live('keyup', function(e) {
			var val = $(this).val();
			if(val.length>=4) {
				if((e.target.selectionStart).length) ;
				else {
					if(isNaN(parseInt(val))) {
						$(this).val('1900');
					}
					$(this).parents('.form-group').find('.date-mm').focus();
				}
			}				
		}).live('blur', function(e) {
			var val = $(this).val();
			if(isNaN(parseInt(val))) {
				$(this).val('1900');
			} else {
				if(parseInt(val)<1900) {
					$(this).val('1900');
				}
			}
		});

		$('.date-mm, .date-dd, .date-hh, .date-ii').live('keyup', function(e) {
			var val = $(this).val();
			if(val.length>=2) {
				if((e.target.selectionStart).length) ;
				else {
					if(isNaN(parseInt(val))) {
						$(this).val('00');
					}
					if($(this).hasClass('date-mm')) {
						$(this).parents('.form-group').find('.date-dd').focus();
					} else if($(this).hasClass('date-dd')) {
						$(this).parents('.form-group').find('.date-hh').focus();
					} else if($(this).hasClass('date-hh')) {
						$(this).parents('.form-group').find('.date-ii').focus();
					} else if($(this).hasClass('date-ii')) {
						// $(this).parents('.form-group').next().find('input').focus();
					}
				}
			}				
		}).live('blur', function(e) {
			var val = $(this).val();
			if(isNaN(parseInt(val))) {
				$(this).val('01');
			} else {
				if(val.length==1) {
					$(this).val('0' + val);
				} else {
					if($(this).hasClass('date-mm') && parseInt(val)>12) {
						$(this).val('12');
					} else if($(this).hasClass('date-dd') && parseInt(val)>31) {
						$(this).val('31');
					} else if($(this).hasClass('date-hh') && parseInt(val)>23) {
						$(this).val('00');
					} else if($(this).hasClass('date-ii') && parseInt(val)>59) {
						$(this).val('00');
					}
				}
			}
		});

		$('[data-lock-submit]').live('click', function() { 
			var el = $(this).closest('.form-inline');
			var pw = el.find('[data-lock-password]').val().trim();
			if(pw.length == 0 ) {
				el.find('[data-lock-password]').focus();
				el.find('.error-text').text('! ' + $.lang[LANG]['config.enter-password']);
				return false;
			}

			$.modalON();
			let lockType = $(this).attr('data-lock');
			var url = (lockType == 'site')? '/template/siteLockController/type/pw_check':'/template/menuLockController/type/pw_check';
			$.post(url, {s: b.SMENU, sid: b.SID, page: b.PAGE, pw: pw, publish : b.PUBLISH}, function(data) {
				checkError(data);
				$.modalOFF();
				if(data.result) {
					if(lockType == 'site' && data.ss_site_lock) {
						localStorage.setItem('ss_' + b.SID + '_site_lock', data.ss_site_lock);
						localStorage.setItem('last_activity', data.last_activity);
					}
					window.location.reload(true);
				} else {
					el.find('[data-lock-password]').focus();
					el.find('.error-text').text('! ' + $.lang[LANG]['siteum.regexp.pw.invalid']);
				}
			}, 'json');
		});

		$('[data-contact-submit]').live('click',function(e) {
			var is_templates = checkTemplateSite(b.SID);
			// if($('#flat-modal').length || window.location != window.parent.location) return;

			//템플릿 추가 화면에서만 버튼 동작 안 되게끔 처리, 사용자 미리보기 화면에서는 동작
			if($('#flat-modal').length || is_templates) return;
			
			$.modalON();

		    var el = '.' + $(this).parents('.element').attr('data-name'),
		    	el_id = $(this).parents('.element').attr('data-id'),
		    	google_track = $(this).attr('data-google-track'),
		    	google_track_run = false,
		    	daum_track = $(this).attr('data-daum-track'),
		    	daum_track_run = false,
		    	naver_track = $(this).attr('data-naver-track'),
		    	naver_track_run = false;

			var hasEmoji = false;
			$(el+' .form-group .form-control:not([readonly])').each(function() {
				if(checkEmojis($(this).val().trim())) {
					hasEmoji = true;
					return false;
				}
			});

			if(hasEmoji) {
				e.preventDefault();
				$.modalOFF();
				errorEmojisModal();
				return false;
			}

			google_track_run = (typeof google_track != 'undefined') ? true : false;
			daum_track_run = (typeof daum_track != 'undefined') ? true : false;
			naver_track_run = (typeof naver_track != 'undefined') ? true : false;

		    if($(el).length==0 || $(el).length>1) {
		        alert('Invalid form data');
		        return false;
		    }


		    var firstname = ($(el + ' [data-contact-firstname]').length >0 ) ? setDefaultValue($(el + ' [data-contact-firstname]').val().trim()) : '',
		    	lastname = 	($(el + ' [data-contact-lastname]').length > 0) ? setDefaultValue($(el + ' [data-contact-lastname]').val().trim()) : '',
		    	email = 	($(el + ' [data-contact-email]').length > 0) ? setDefaultValue($(el + ' [data-contact-email]').val().trim()) : '',
		    	web = 		($(el + ' [data-contact-website]').length > 0) ? setDefaultValue($(el + ' [data-contact-website]').val().trim()) : '',
		    	phone = 	($(el + ' [data-contact-phone]').length > 0) ? setDefaultValue($(el + ' [data-contact-phone]').val().trim()) : '' ,
		    	subject = 	($(el + ' [data-contact-subject]').length > 0) ? setDefaultValue($(el + ' [data-contact-subject]').val().trim()) : '',
		    	message = 	($(el + ' [data-contact-message]').length > 0) ? setDefaultValue($(el + ' [data-contact-message]').val().trim()) : '',
		    	etc = {};
    		$(el + ' [data-contact-etc]').each(function(i) {
				var key = $(this).attr('data-contact-etc');
				etc[key] = setDefaultValueEtc($(this).attr('type'),$(this));
			});

		    var require_firstname 	= $(el + ' [data-contact-firstname]').attr('data-required'),
		    	require_lastname 	= $(el + ' [data-contact-lastname]').attr('data-required'),
		    	require_email		= $(el + ' [data-contact-email]').attr('data-required'),
		    	require_web			= $(el + ' [data-contact-website]').attr('data-required'),
		    	require_phone		= $(el + ' [data-contact-phone]').attr('data-required'),
		    	require_subject 	= $(el + ' [data-contact-subject]').attr('data-required');

		    /*default:: required[email,message] | optional[firstname,lastname,web,phone,subject]  // data-optional='true'->optional, 'false'->required */
		    var optional_firstname  = $(el + ' [data-contact-firstname]').attr('data-optional'),
		    	optional_lastname   = $(el + ' [data-contact-lastname]').attr('data-optional'),
		    	optional_email		= $(el + ' [data-contact-email]').attr('data-optional'),
		    	optional_web		= $(el + ' [data-contact-web]').attr('data-optional'),
		    	optional_phone		= $(el + ' [data-contact-phone]').attr('data-optional'),
		    	optional_subject	= $(el + ' [data-contact-subject]').attr('data-optional'),
		    	optional_message	= $(el + ' [data-contact-message]').attr('data-optional');
		    var optional_etc		= {};

    		$(el + ' [data-contact-etc]').each(function(i) {
				var key = $(this).attr('data-contact-etc');
				optional_etc[key] = $(this).attr('data-optional');
			});

    		var $parent = $(this).parents('.element'),
    			el = '.' + $(this).parents('.element').attr('data-name'),
		    	contprivacy = $(el+' .form-group.contact-privacy-area').css('display'),
        		contprivacy_display = (typeof contprivacy == 'undefined' || contprivacy == 'none') ? false : true,
    			privacy_check = $parent.find('.contact-checkbox-text'),
				privacy_chk = privacy_check.is(":checked"),
				check = true,
		    	check_option = [];

		    if(!firstname) {
		    	var name_text = ($(el + ' [data-contact-lastname]').length > 0) ? 'first name' : 'name';
		    	if(typeof optional_firstname != 'undefined' && optional_firstname == 'false') check = true;
		    	else if ($(el + ' [data-contact-firstname]').length == 0) check = true;
		    	else check = false;

		    	var str = ($(el + ' [data-contact-firstname]').length > 0 && $(el + ' [data-contact-firstname]').attr('data-contact-firstname').length > 0) ? $(el + ' [data-contact-firstname]').attr('data-contact-firstname') : name_text;
		    	if(!check) check_option.push(str);
		    }

		    if($(el + ' [data-contact-lastname]').length > 0 && !lastname) {
		    	if(typeof optional_lastname != 'undefined' && optional_lastname == 'false') check = true;
		    	else if ($(el + ' [data-contact-lastname]').length == 0) check = true;
		    	else check = false;
		    	
		    	var str = ($(el + ' [data-contact-lastname]').attr('data-contact-lastname').length > 0) ? $(el + ' [data-contact-lastname]').attr('data-contact-lastname') : 'last name';
		    	if(!check) check_option.push(str);
		    }

		    /*if((!firstname && typeof optional_firstname != 'undefined' && optional_firstname == "false") || (!lastname && typeof optional_lastname != 'undefined' && optional_lastname == "false")) {
		    	var str = ($(el + ' [data-contact-firstname]').attr('data-contact-firstname').length > 0) ? $(el + ' [data-contact-firstname]').attr('data-contact-firstname') : 'name';
		    	check_option.push(str);
		    }*/
		    
		    if(!web && typeof optional_web != 'undefined' && optional_web == 'false') {
		    	var str = ($(el + ' [data-contact-web]').attr('data-contact-web').length > 0) ? $(el + ' [data-contact-web]').attr('data-contact-web') : 'web';
		    	check_option.push(str);
		    }

		    if(!phone && typeof optional_phone != 'undefined' && optional_phone == 'false') {
		    	var str = ($(el + ' [data-contact-phone]').attr('data-contact-phone').length > 0) ? $(el + ' [data-contact-phone]').attr('data-contact-phone') : 'phone';
		    	check_option.push(str);
		    }

		    if(!subject && typeof optional_subject != 'undefined' && optional_subject == 'false') {
		    	var str = ($(el + ' [data-contact-subject]').attr('data-contact-subject').length > 0) ? $(el + ' [data-contact-subject]').attr('data-contact-subject') : 'subject';
		    	check_option.push(str);
		    }

		    if(!email) {
		    	if(typeof optional_email != 'undefined' && optional_email == 'true') check = true;
		    	else if ($(el + ' [data-contact-email]').length == 0) check = true;
		    	else check = false;
		    	
		    	var str = ($(el + ' [data-contact-email]').attr('data-contact-email').length > 0) ? $(el + ' [data-contact-email]').attr('data-contact-email') : 'email';
		    	if(!check) check_option.push(str);
		    }
		    if(!message) {
		    	if(typeof optional_message != 'undefined' && optional_message == 'true') check = true;
		    	else check = false;

		    	var str = ($(el + ' [data-contact-message]').attr('data-contact-message').length > 0) ? $(el + ' [data-contact-message]').attr('data-contact-message') : 'message';
		    	if(!check) check_option.push(str);
		    }

		   	$.each(etc,function(k,v){
		   		if(!etc[k] && typeof optional_etc[k] != 'undefined' & optional_etc[k] == 'false') {
		   			check_option.push(k);
		   		}
		   	});

		   	check = ((check_option.length == 0) && ((contprivacy_display == false) || (privacy_chk == true))) ? true : false;

		    if(require_firstname == 'true' && !firstname) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-firstname]').attr('placeholder') + $.lang[LANG]['check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_lastname == 'true' && !lastname) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-lastname]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_web == 'true' && !web) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-website]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_phone == 'true' && !phone) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-phone]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(require_subject == 'true' && !subject) {
		    	$(this).showModalFlat('INFORMATION',$(el + ' [data-contact-subject]').attr('placeholder') + $.lang[LANG]['message.check.required'], true, false, '', 'ok');
		    	return false;
		    }

		    if(check) {
		    	$.post('/template/update/type/contact',{
		    		id : b.SID,
		    		seq : el_id,
		    		s : 'message',
		    		firstname : firstname,
		    		lastname : lastname,
		    		email : email,
		    		web : web,
		    		phone : phone,
		    		subject : subject,
		    		message : message,
		    		etc : JSON.stringify(etc),
		    	}, function(data) {
		    		checkError(data);
		    		if(typeof data.error == 'undefined' || data.error == '') {
		    			var ch_lang = getLang($(el), b.SID),
		    				submit_txt = (typeof data.submitStr != 'undefined' && data.submitStr) ? data.submitStr : $.lang[ch_lang]['message.sent'];
		    				
			    		$(this).showModalFlat('INFORMATION',submit_txt,true,false, '', 'ok', '', 'cl-modal cl-none-title cl-cmmodal cl-p130 cl-s-btn w560');
			    		setDefaultContactForm(el);
			    		setDefaultContactFormEtc(el);
			    		if(typeof contactCallback == 'function')
			    			contactCallback(el_id);
		    		}
		    	},'json');
			    setTimeout(function() {
				    $.modalOFF();
			    },1000);
		    } else {
		    	$.modalOFF();
		    	var check_str = '';
		    	$.each(check_option,function(k,v) {
		    		check_str = (check_str) ? check_str + ' / ': '';
		    		check_str = check_str + v;
	            });
	            
		    	if(check_str) {
		    		var modal = $(this).showModalFlat('INFORMATION',check_str+ $.lang[LANG]['message.check.required'],true,false, '', 'ok', '', 'cl-modal cl-none-title cl-cmmodal cl-p130 cl-s-btn w560');
		    	} else {
		    		var modal = $(this).showModalFlat('INFORMATION',$.lang[LANG]['message.privacy.check.required'],true,false, '', 'ok');
		    	}
		    	
		    }					    
		});	
	
		$('.contact-privacy-text').live('click',function() {
			var contactEL = $(this).parents('.element'),
				contactPriavcy = $(contactEL).find('.form-inline .contact-privacy-area .contact-privacy-box'),
				checkType = (typeof $(contactEL).attr('data-type') != 'undefined' && $(contactEL).attr('data-type') == 'contact') ? true : false;

			if(checkType && contactPriavcy.length > 0) {
				if(contactPriavcy.css('display') == 'none') contactPriavcy.show();
				else contactPriavcy.hide();
			}
		});
		
		$('.element .gallery-loadmore').live({
		    click: function(e) {
				if(typeof $(this).data('id') == 'undefined' || typeof $(this).data('page') == 'undefined') {
					e.preventDefault();
					return false;
				}

				var id = $(this).attr('data-id'),
					gpage = (typeof $(this).attr('data-page') != 'undefined') ? Number($(this).attr('data-page')) : 1,
					view = (typeof $(this).attr('data-view') != 'undefined') ? Number($(this).attr('data-view')) : 6,
					mode = $(this).attr('data-mode'),
					$galleryELLoadmore = $(this),
					$galleryEL = $('.element[data-id="' + id + '"]'),
					$gContainer = $galleryEL.find('.container'),
					$gLoop = $galleryEL.find('[data-loop="true"]'),
					$gc =  $galleryEL.find('.gallery-category-nav li.active'),
		            $go = $galleryEL.find('.gallery-sort-nav li.active a'),
					sfl = ($gc.index() > 0) ? 'category' : '',
					stx = (sfl) ? $gc.text().trim() : '',
		            orderby = ($go.length > 0) ? $go.attr('data-orderby') : 'recent';

		        var val = galleryEL[id],
		        	tag = htmlspecialchars_decode(val.eltag,'ENT_QUOTES'),
		        	g_settings = (typeof val.elsettings != 'undefined' && val.elsettings) ? $.parseJSON(val.elsettings) : {},
		        	folder = (typeof val.folder != 'undefined' && val.folder > 0) ? val.folder : '',
		        	isMasonry = $galleryELLoadmore.hasClass('masonry-layout'),
		        	block_lang = (typeof g_settings.blocklang != 'undefined') ? g_settings.blocklang : LANG;

		        var nodes = $gLoop.clone().children('.grid'),
                    g_number = $gLoop.data('gallery-no'),
					total = 0,
					items = 0,
					gallery_item = '';

				var checkLoadmoreInLoop = ($(tag).find('[data-loop="true"] .loadmore-wrap').length) ? true : false,
					glm = $(tag).find('.loadmore-wrap');

				var el_gh = $(tag).find('.goption').attr('data-gh'),
					checkGalleryHeight = (typeof el_gh != 'undefined' && el_gh) ? true : false,
					checkGallerySVG = ($(tag).find('.gimg-svg-wrap').length > 0) ? true : false,
					checkGFrameTitleOFF = (val.mode == 'gallery' && (typeof g_settings.gframe_title_visible != 'undefined' && g_settings.gframe_title_visible == 'OFF')) ? true : false;

				if(id == 'all_products') {
		       		sfl = 'orderby';
		       		stx = (typeof $gc.find('a').attr('data-idx') != 'undefined') ? $gc.find('a').attr('data-idx') : $('.allProducts-sort-list>li:first-child').find('a').attr('data-idx');
		       	}				

		       	var checkUseComment = checkUseCommentFunc(val.mode, val.eltag);
				   var checkUseLike = checkUseLikeFunc(val.mode, val.eltag);
				var uri = getSearchURL();
				// if(uri.category_no == '') {
				// 	uri.category_no = (typeof g_settings.lux_category_no != 'undefined') ? g_settings.lux_category_no : '';
				// }
				if (isObjectEmpty(uri) && _this.b.LUX) {
					uri = val.searches.uri;
				}
	
		        $.ajax({
		            url: '/template/gallery/list/pid/' + id + '/sid/' + property.SID + '/spage/' + property.PAGE + '/page/' + gpage + '/view/' + view + '/publish/' + property.PUBLISH,
					data: { g_mode: mode, visible: true, sfl: sfl, stx: stx, orderby: orderby, total: true, uri : uri },
					dataType: 'json',
					type: 'POST',
		            async: false,
		            cache: false,
		            success: function (data) {
		            	$.cookie('gallery-page-' + id, gpage, { path: '/', expires: 12 * 60 * 60 * 1000 });
		                $.cookie('gallery-category-' + id, stx, { path: '/', expires: 12 * 60 * 60 * 1000 });
	                    $.cookie('gallery-orderby-' + id, orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
						if($galleryEL.is('[data-gjs]') && gpage > 1) setLoadmoreGalleryJS($galleryEL.attr('data-gjs'),id,true);

		                var loop_count = nodes.length;

                        total = (typeof data.total.list_total != 'undefined') ? data.total.list_total : data.total;
		                items = data.list.length;

		                var g_popup_remove = $('.galleryPL'+id+'.gallery-popup').find('.gallery-item');
		                $.each(g_popup_remove,function(i,v) {
		                	if(items > i) $(this).remove();
		                });

		                $.each(data.list,function(i,v) {
		                    loop_pos = i%loop_count;
		                    c = nodes[loop_pos];
		                    item_index = ((gpage-1)*view) + i;
                            var isTitle = (v.title.length > 0) ? true:false;
		                 console.log($(c));
							$(c).addClass('gallery-item').attr('data-index',item_index).attr('data-gpos',v.pos).attr('data-seq',v.seq);
							
                            var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
						        img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + '/' + _this.b.SID + '/',
						        img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;

							var src = getServeImage(v.image,val.folder,img_path),
								src_s0 = getServeImage(v.image,'0',img_path);
							if($(c).find('img').length > 0) $(c).find('img').attr('src',src);
							if($(c).find('.g-img').length > 0) $(c).find('.g-img').css('background-image', 'url('+src+')');
							if(checkGallerySVG) {
								var gimgSVG = $(c).find('.gimg-svg-wrap svg');
								gimgSVG.find('pattern').attr('id','gimgSvg_'+val.elname+'_'+item_index);
								gimgSVG.find('image').attr('xlink:href', src);
								gimgSVG.find('polygon').attr('fill', 'url(#gimgSvg_'+val.elname+'_'+item_index+')');
							}
							
							var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
								glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

							if(glink) {
								if(glink.match(/^\@/g) !== null) {															// link-type: link-bookmark ==> a[attr-bookmark]
									var bookmark_seq = glink.replace(/^\@/g,'');
									if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
										glink = '';
										glink_target = '';
									}
								} else if(glink.match(/^flink\@[0-9]/gi) !== null) {										// link-type: link-file     ==> a[attr-flink]
									glink_target = '';
								} else if($.inArray(glink.replace(/^\//g,'').replace(/ /g,'-'),_this.b.MENULIST) > -1) {	// link-type: link-menu     ==> a[data-user-link]
								} else {																					// link-type: link-out      ==> a[attr-link]
									if(checkBase64Encode(glink)) glink = Base64.decode(glink);
								}
							}

							$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link').removeAttr('attr-flink');
							if (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON' && property['SITEUM'] >= 1) {
								$(c).addClass('gallery-item').addClass('nonePrice');
								$(c).find('a').attr('href', '#');
							} else {
                                if(glink) {
									var glink_val = makeLinkUrl(glink, b.ONE, b.VIEW);
									$(c).find('a').attr('href',glink_val);

									if(glink.match(/^\@/g)) {
										$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
									} else if(glink.match(/^flink\@[0-9]/g)) {
										$(c).find('a').attr('attr-flink',glink.replace(/^flink\@/g,''));
									// IE ERROR_includes__H.20210603
									// } else if(_this.b.MENULIST.includes(glink.replace(/ /g,'-'))) {
									} else if($.inArray(glink.replace(/ /g,'-'),_this.b.MENULIST) > -1) {
										$(c).find('a').attr('data-user-link',glink_val);
									} else {
										$(c).find('a').attr('attr-link',glink);
									}
                                } else {
									if (val.mode == 'gallery') {
										src_s0 = src_s0 + '?gpos='+v.pos;

										$(c).find('a').attr('href', src_s0);
										$(c).find('a').attr('data-gallery', '#gframe-' + val.seq);
									} else {
										if(val.seq == 'all_products') {
											$(c).find('a').attr('href', v.product_url);
											$(c).removeClass('nonePrice');
										} else {
											if(_this.b.LUX) $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/_product/' + v.seq);
											else $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/' + _this.b.PAGE + '/view/' + v.seq);
			
											// $(c).find('a').attr('href', ((b.URL=='/') ? '' : b.URL) + '/' + b.PAGE + '/view/' + v.seq);
										}
									}
	                            }
	                        }

		                    if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
		                    else $(c).find('a').removeAttr('target');

							$(c).find('.non_text').removeClass('non_text');
							
							if(mode != 'shopping') {
								if(v.title.length==0) $(c).find('.figure.title').removeClass('non_text').addClass('non_text');
								if(v.caption.length==0) $(c).find('.figure.caption').removeClass('non_text').addClass('non_text');
							}

							if(v.title.length==0) v.title = $.lang[block_lang]['editor.block.gallery.sample.title'];
							if(v.caption.length==0) v.caption = $.lang[block_lang]['editor.block.gallery.sample.caption'];

							if(checkGFrameTitleOFF || !isTitle) $(c).find('a').attr('data-title', '');
							else $(c).find('a').attr('data-title', v.title);

							if(mode == 'shopping') {
								if($(c).find('.figure.basket').length == 0) {
									$(c).find('.figure').last().after('<div class="figure basket" data-oldver="true"><span class="basket-btn">장바구니 담기</span></div>');
								}
							}

		                    // caption
		                    var ftitle = $(c).find('h5.figure'),
		                        fcaption = $(c).find('p.figure').not('.comment'),
		                        fdatetime = $(c).find('.figure.datetime'),
		                        fhashtag = $(c).find('.figure.hashtag'),
		                        fbrand = $(c).find('.figure.brand'),
		                        fprice = $(c).find('.figure.price'),
								freview = $(c).find('.figure.review'),
								fcomment = $(c).find('.figure.comment'),
								flike = $(c).find('.figure.like'),
								fbasket = $(c).find('.figure.basket');

		                    if(fcomment.length < 1 && g_settings.comment_display == 'ON' && checkUseComment) {
								$(c).find('figcaption p.figure.caption').after('<p class="figure comment old-gl hide"><svg  viewBox="0 0 14 14" width="14" height="14"><path d="M7 1C3.13 1 0 3.24 0 6c0 1.66 1.14 3.13 2.89 4.04C2.71 11 2.23 12.38 1 13c0 0 3.09 0 5.19-2.04.27.03.54.04.81.04 3.87 0 7-2.24 7-5s-3.13-5-7-5zm0 9c-.25 0-.49-.01-.73-.03l-.45-.04-.32.31c-.6.58-1.31.97-1.98 1.23.17-.43.28-.86.35-1.25l.14-.73-.66-.34C1.88 8.39 1 7.21 1 6c0-2.17 2.75-4 6-4s6 1.83 6 4-2.75 4-6 4z"/></svg><span class="figure-comment-cnt"></span></p>');
								fcomment = $(c).find('.figure.comment');
							}

							if(flike.length < 1 && g_settings.like_display == 'ON' && checkUseLike){
								if (fcomment.length > 0) {
	                            	fcomment.after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
								} else {
	                            	$(c).find('figcaption:not(.top) .figure:last-child').after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
								}
	                            flike = $(c).find('.figure.like');
	                        }
                        
		                    $(c).find('figcaption').removeClass('hide');
							if(v.title || v.caption) {
								var gallery_caption = v.caption;
								gallery_caption = gallery_caption.replace(/\n/g,'<br />');

								ftitle.html(v.title);
								fcaption.html(gallery_caption);
								if(fdatetime.length > 0) fdatetime.text(v.datetime);
								if(fhashtag.length > 0) fhashtag.text(v.hashtag);
							}
							
	                        if(g_number) {
	                            var g_index = String(item_index + 1),
	                                g_num = g_index.padStart(g_number, '0');
	                            $(c).find('.figure.number').text(g_num);
	                        }

							if(fbrand.length > 0) {
								var fbrand_name = (typeof v.brand_name != 'undefined' && v.brand_name) ? v.brand_name : '';
								fbrand.html(v.brand_name);
							}

							if(mode == 'shopping' || id == 'all_products') {
								fcomment.addClass('hide');
								flike.addClass('hide');
								
								v.price = parseFloat(v.price);
								v.sale = parseFloat(v.sale);
								var checkPriceHidden = (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON') ? true : false,
									gallery_price = (v.price && !checkPriceHidden) ? v.price : 0,
									gallery_sale_price = (typeof v.sale != 'undefined' && v.sale > 0 && v.sale > v.price && !checkPriceHidden) ? v.sale : 0,
									gallery_sale_per = (typeof v.sale_per != 'undefined' && v.sale_per && !checkPriceHidden) ? v.sale_per+'%' : '',
									product_soldout = '품절',
									product_no_sale = (typeof g_settings.sh_soldout == 'string') ? g_settings.sh_soldout : '구매불가',
									product_status = '';
								if(v.status == 'off' && !checkPriceHidden) {
									product_status = '<span class="cl-sh-soldout">' + product_no_sale + '</span>';
								} else if(v.quantity_on == 'on' && v.quantity < 1 && !checkPriceHidden) {
									product_status = '<span class="cl-sh-soldout">' + product_soldout + '</span>';
								}

								$(c).find('.cl-sh-soldout').remove();
								if(product_status != '') $(c).attr('data-soldout',true);
								else $(c).removeAttr('data-soldout');

								$(c).find('.product-badge').remove();
								product_status += drawBadgeList(v.use_badge, data.badge_settings);

								$(c).find('.cl-sh-limit').remove();
								if(v.status == 'lim') {
                                    if(v.sale_now == false) {
                                        var product_limit = '<p class="cl-sh-limit">상품 구매 가능 기간이 아닙니다.</p>';
			                            if(freview.length > 0) {
			                                freview.after(product_limit);
			                            } else {
			                                $(c).find('figcaption:not(.top) .figure:last-child').after(product_limit);
			                            }
                                    }
                                }

								if($(c).find('ul.figure.price').length > 0) {
									// var price_off = (v.sale_price > 0 && v.sale_price > v.price) ? 100 - Math.floor((v.price / v.sale_price) * 100) : 0,
	                                //     off_str = (price_off > 0) ? price_off + '% ' : ''
									var off_str = (v.sale_rate > 0) ? v.sale_rate + '% ' : '';
									if(!_this.b.LUX) off_str = gallery_sale_per;
									//Ver02
									if(!checkPriceHidden) {
										$(c).find('ul.figure.price .price-val').html('￦' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
										$(c).find('ul.figure.price .price-val').removeClass('hide');

										if(gallery_sale_price > 0 && gallery_price  < gallery_sale_price) {
											$(c).find('ul.figure.price .price-sale').html('￦' + gallery_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
											$(c).find('ul.figure.price .price-sale-per').html(off_str);
											$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').removeClass('hide');
											if(_this.b.LUX && (v.hashtag).indexOf('특가세일') > -1 && $(c).find('ul.figure.price .sp-price').length == 0) {
												$(c).find('ul.figure.price .price-sale').after('<li class="sp-price">특가세일</li>');
											}
										} else {
											$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').addClass('hide').html('');
										}
										
                                        if(v.product_unit_str) {
                                            $(c).find('ul.figure.price').append(`<li class="price-unit-pricing">${v.product_unit_str}</li>`); // 단위당 가격
                                        }
									} else {
                                        $(c).find('ul.figure.price .price-val').html('￦0');
                                        $(c).find('ul.figure.price .price-val').addClass('hide');
									}
									if(id == 'all_products' && checkPriceHidden) $(c).find('ul.figure.price').html('');
									if(product_status) $(c).find('ul.figure.price').append('<li>'+product_status+'</li>');

									var badge_size = getBadgeSize(data.badge_settings);
									$(c).find('.cl-sh-soldout').removeClass('badge-small badge-medium badge-large');
									$(c).find('.cl-sh-limit').removeClass('badge-small badge-medium badge-large');
									if(badge_size) {
										$(c).find('.cl-sh-soldout').addClass(badge_size);
										$(c).find('.cl-sh-limit').addClass(badge_size);
									}
								} else {
									//Ver01
									if(fprice.length == 0) fprice = fcaption;

									if(checkPriceHidden) fprice.html('');
									else fprice.html('<span class="figure-krw">￦</span>' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + product_status);
								}

								if($(c).find('ul.figure.review').length > 0) {
									var gallery_review = (v.review_onoff && v.review_cnt) ? v.review_cnt : 0;
									if(gallery_review > 0) {
										$(c).find('ul.figure.review, ul.figure.review li').removeClass('hide');
										$(c).find('ul.figure.review .figure-review-cnt').html(gallery_review);
										$(c).find('ul.figure.review .figure-review-score').html(v.review_score);
									} else {
										$(c).find('ul.figure.review, ul.figure.review li').addClass('hide');
										$(c).find('ul.figure.review .figure-review-cnt, ul.figure.review .figure-review-score').html('');
									}
								}

								if(fbasket.length > 0) {
									var checkOldBlock = ($(c).find('.figure.basket[data-oldver="true"]').length > 0) ? true : false,
										checkOldverBasket = (typeof g_settings.field_oldver != 'undefined' && g_settings.field_oldver && g_settings.field_oldver.indexOf('basket') > -1) ? true : false,
										checkDisabledBasket = (typeof g_settings.field_disable != 'undefined' && g_settings.field_disable && g_settings.field_disable.indexOf('basket') > -1) ? true : false;
									if(v.basket_off) fbasket.addClass('cannotby hide');
									else if(id == 'all_products') fbasket.removeClass('hide');
									else if(checkDisabledBasket || (!checkDisabledBasket && checkOldBlock && !checkOldverBasket)) fbasket.addClass('hide');
									else if(property.VALIDTYPE != 'SM') fbasket.addClass('hide');
									else fbasket.removeClass('hide');
								}


							} else {
								fbrand.addClass('hide');
								fprice.addClass('hide');
								freview.addClass('hide')
								fbasket.addClass('hide');

								if(mode == 'project' && fcomment.length > 0 && typeof v.comment_cnt != 'undefined' && v.comment_cnt > 0 && g_settings.comment_display == 'ON') {
                                    fcomment.find('.figure-comment-cnt').html(v.comment_cnt);
                                    if(g_settings.field_disable !== undefined && g_settings.field_disable.indexOf('comment') > -1) {
                                        fcomment.addClass('hide');
                                    } else {
                                        fcomment.removeClass('hide');
                                    }
                                } else {
                                    fcomment.addClass('hide');
                                }

                                if(flike.length > 0 && g_settings.like_display == 'ON' && checkUseLike) {
                                    flike.removeAttr('data-like').removeClass('hide active');
	                                if(v.like !== undefined) {
                                    	flike.find('.figure-like-cnt').html(v.like.cnt);
	                                    if(v.like.own) flike.attr('data-like', v.seq).addClass('active');
                                    }
                                    if(g_settings.field_disable !== undefined && g_settings.field_disable.indexOf('like') > -1) {
                                        flike.addClass('hide');
                                    } else {
                                        flike.removeClass('hide');
                                    }
                                } else {
                                    flike.addClass('hide');
                                }
							}

                            if(checkUseLike == false) flike.html('');

							if(isMasonry) {
								gallery_item = gallery_item + $(c)[0].outerHTML;
							} else {
								if(checkLoadmoreInLoop) $gLoop.find('.loadmore-wrap').before($(c)[0].outerHTML);
								else $gLoop.append($(c)[0].outerHTML);
							}
		                });
		            }
		        });
				changeBrokenImages($galleryEL);

				if(isMasonry) {
					var $gallery_items = $(gallery_item);
					$gallery_items.hide();

					$('.gallery-loadmore[data-id="' + id + '"]').before('<div class="gallery-loading-status"><div class="loading-dots"></div></div>');
					var process_index = 0;		            
					$gallery_items.imagesLoaded().progress(function(imgload, image) {
						process_index++;
						var $item = $(image.img).parents('.grid');
						$item.show();
						if(items == process_index) {
							reloadMasonry($gContainer,$gallery_items);

							if(checkGalleryHeight) refreshGalleryHeight();
							refreshGalleryField($galleryEL,g_settings);
						}
					});
				} else {
					if(checkGalleryHeight) refreshGalleryHeight();
					refreshGalleryField($galleryEL,g_settings);
				}

				var cookie_page = gpage,
					new_view = (view > total) ? total : view,
					cookie_view = ( (cookie_page*new_view) > total ) ? total : cookie_page*new_view;

				$galleryEL.find('.display').text(cookie_view);

				var $glmBtnWrap = $galleryELLoadmore.closest('.loadmore-wrap'),
					$glmBtn = $galleryEL.find('.loadmore-wrap .gallery-loadmore'),
					checkLoadmore = (total > view && total > cookie_view) ? true : false;
				
				if($glmBtnWrap.length == 0) {
					// gallery loadmore btn - default (ver1)
					if(checkLoadmore) $galleryELLoadmore.attr('data-page', cookie_page + 1);
					else $galleryELLoadmore.remove();
				} else {
					// gallery loadmore btn - custom (ver2)
					if(checkLoadmore) {
						$glmBtn.attr('data-page', cookie_page + 1);
						$glmBtnWrap.removeClass('hide').fadeIn();
					} else {
						$glmBtnWrap.fadeOut().addClass('hide');
						$glmBtn.removeAttr('data-loadmore').removeAttr('data-id').removeAttr('data-total').removeAttr('data-page').removeAttr('data-view').removeAttr('data-folder').removeAttr('data-mode').removeClass('masonry-layout');
						$glmBtn.find('.display .view').text('0');
						$glmBtn.find('.display .total').text('0');
					}
				}

				if($galleryEL.has('input.gjs').length) setGalleryJS('add-loop',$galleryEL);
				
				if($galleryEL.find('*[data-direffect="true"]').length > 0 ) {
					setTimeout(function() {
						$galleryEL.find('.grid').each(function() {
							$(this).hoverdir();
						});
					}, 400);
				}
			}
		});

		$('.gallery-loadmore, .data-feed-load-more').live('touchstart', function (e) {
			var g_color = $(this).css('color'),
				g_bgcolor = $(this).css('background-color'),
				g_bdcolor = $(this).css('border-color');

			if(isMobile()) {
				$(this).css('color', g_color);
				$(this).css('background-color', g_bgcolor);
				$(this).css('border-color', g_bdcolor);
			}
		});
		
		$('.gallery-item a[title]').live('mouseenter', function () {
		    $(this).tooltip('destroy');
		});

		$('.gallery-item a:not([attr-flink])').live({
			click : function(e) {
		    	e.preventDefault();
				if($(e.target).is('.figure.basket') || $(e.target).is('.basket-btn')) return false;

				var loc = $(this).attr('href'),
					mode = $(this).attr('data-gallery'),
					menu_link = $(this).attr('data-user-link'),
					bookmark = $(this).attr('attr-bookmark'),
					blank = $(this).attr('target'),
					user_link = $(this).attr('attr-link');

				if( (typeof mode!='undefined' && mode.length>0) ||
					(typeof menu_link!='undefined' && menu_link.length>0) ||
					// (typeof user_link!='undefined' && user_link.length>0) ||
					(typeof bookmark!='undefined' && bookmark.length>0) 
				) return;

				if(typeof blank!='undefined' && blank.length) {
					var url = (typeof user_link != 'undefined' && user_link.match('^(tel:|mailto:|sms:)') === null) ? makeLinkUrl(user_link, b.ONE, b.VIEW) : loc;
					var openNewWindow = window.open(url);
				} else {
					if(typeof user_link != 'undefined' && user_link) {
						location.href=loc;
					} else {
						var url = new getLocation(loc);
						golink(_this,url);
					}
		    	}

		    	// 	uri = (b.PUBLISH) ? loc : loc.replace('/render/',''),
		    	// 	attr = $(this).attr('attr-link');

		    	// if(typeof attr!='undefined' && attr) return;
	    		// _this.history.pushState(null,b.TITLE,(b.PUBLISH) ? '/' : '/render/' + uri);
			}
		});
		$('.gallery-item .figure.like').live('click', function(e){
			e.preventDefault();
			return false;
		});
		$('.gallery-item .figure.basket, .pitem .basket-box').live('click', function(e) {
			e.preventDefault();
			var checkPsearch = ($(this).closest('.pitem').length > 0) ? true : false;
			if(b.PUBLISH) {
				if(!checkPsearch && $(this).closest('.gallery-item').hasClass('nonePrice')) {
					$(this).closest('.nonePrice').click();
					return false;
				}

				var tmp_pid = (checkPsearch) ? $(this).closest('.pitem').attr('data-pid') : $(this).closest('.element').attr('data-id'),
					tmp_seq = (checkPsearch) ? $(this).closest('.pitem').attr('data-gid') : $(this).closest('.gallery-item').attr('data-seq');
				$.quickbasket.init(b.SID,tmp_pid,tmp_seq);
			} else {
				$(this).showModalFlat($.lang[LANG]['config.information'], $.lang[LANG]['manager.check.no-support.render-mode'], true, false, '', 'ok', '', 'cl-cmmodal cl-s-btn w560 cl-p70 cl-p0');
				return false;
			}
		});

		// tab-box left-right button event
		$(document).on('click', '.left-arrow .arrow:not(.hide) .before', function(e){ //qwer
			var horizontal = $(this).closest('.tabs').attr('tab-horizontal'),
				motion = Number($(this).closest('.tabs').attr('tab-motion')),
				len = $(this).closest('.container').find('.tab-box .tab:not(.hover)').length,
				motion_style = $(this).closest('.tabs').attr('tab-motion-style'),
				tab_counted = $(this).closest('.tabs').attr('tab-count'),
				tab_interval_w = $(this).closest('.tabs').attr('tab-interval-w'),
				w = $(window).width(),
				tab_count = (w < 991 && tab_counted > 4) ? 4 : $(this).closest('.tabs').attr('tab-count'),
				tab_case = $(this).closest('.tabs').attr('data-case');
			
			if(!$(this).closest('.tabs').attr('tab-motion') || $(this).closest('.tabs').attr('tab-motion') == 'undefined') return false;
	
			if(horizontal == 1) { // 가로형
				var	tab_each = Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth()) + Number(tab_interval_w),
					max_width = Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth(true)) * len,
					tab_width = (Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth()) + Number(tab_interval_w)) * tab_count,
					length = max_width / tab_width,
					mo = Number(len) - tab_count;
				// console.log('motion:' + motion + ', len: ' + len + ', tab_count: ' + tab_count + ', tab_each: ' + tab_each + ', max_width: ' + max_width + ', tab_width: ' + tab_width + ',length: ' + length + ',mo: ' + mo);
			} 
	
			if(motion_style == 1) { // 한칸씩 이동
				$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', Number(motion) - 1);
				motion = motion - 1;
				if(motion < 0) {
					motion = mo;
					$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', motion);
				}
	
				tabMotion($(this).closest('.tabs').attr('data-name'), motion, tab_each, len, motion_style, tab_count, tab_case, tab_counted);
	
			} else { // 한페이지씩 이동
				$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', Number(motion) - 1);
				motion = motion - 1;
				if(motion < 0) {
					motion = length - 1;
					motion = Math.ceil(motion);
					$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', motion);
				}
	
				tabMotion($(this).closest('.tabs').attr('data-name'), motion, tab_width, length, motion_style, tab_count, tab_case, tab_counted);
			}
			
		});
		$(document).on('click', '.right-arrow .arrow:not(.hide) .after', function(e){ //qwer
			var horizontal = $(this).closest('.tabs').attr('tab-horizontal'),
				motion = Number($(this).closest('.tabs').attr('tab-motion')),
				len = $(this).closest('.container').find('.tab-box .tab:not(.hover)').length,
				motion_style = $(this).closest('.tabs').attr('tab-motion-style'),
				tab_counted = $(this).closest('.tabs').attr('tab-count'),
				tab_interval_w = $(this).closest('.tabs').attr('tab-interval-w'),
				w = $(window).width(),
				tab_count = (w < 991 && tab_counted > 4) ? 4 : $(this).closest('.tabs').attr('tab-count'),
				tab_case = $(this).closest('.tabs').attr('data-case');
			
			if(!$(this).closest('.tabs').attr('tab-motion') || $(this).closest('.tabs').attr('tab-motion') == 'undefined') return false;
	
			if(horizontal == 1) { // 가로형
				var	tab_each = Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth()) + Number(tab_interval_w),
					max_width = Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth(true)) * len,
					tab_width = (Number($(this).closest('.container').find('.tab-box .tab:not(.hover)').outerWidth()) + Number(tab_interval_w)) * tab_count,
					length = max_width / tab_width,
					mo = Number(len) - tab_count;
				// console.log('motion:' + motion + ', len: ' + len + ', tab_count: ' + tab_count + ', tab_each: ' + tab_each + ', max_width: ' + max_width + ', tab_width: ' + tab_width + ',length: ' + length + ',mo: ' + mo);
			} 
	
			if(motion_style == 1) { // 한칸씩 이동
				$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', Number(motion) + 1);
				motion = motion + 1;
				if(motion > mo) {
					motion = 0;
					$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', motion);
				}
	
				tabMotion($(this).closest('.tabs').attr('data-name'), motion, tab_each, len, motion_style, tab_count, tab_case, tab_counted);
	
			} else { // 한페이지씩 이동
				$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', Number(motion) + 1);
				motion = motion + 1;
				if(motion >= length) {
					motion = 0;
					$('.'+$(this).closest('.tabs').attr('data-name')).attr('tab-motion', motion);
				}
	
				tabMotion($(this).closest('.tabs').attr('data-name'), motion, tab_width, length, motion_style, tab_count, tab_case, tab_counted);
			}
		});
		$(document).on('click', '.tab-box .tab', function(){
			var w = $(document).outerWidth(),
				horizontal = $(this).closest('.tabs').attr('tab-horizontal');
			if(w < 767 && $(this).find('.tab-editor').hasClass('active')) {
				$(this).find('.tab-editor').removeClass('active');
			} else {
				var editor = $(this).index() + 1,
					order = $(this).attr('data-order');
					// num = $('.tab-editor.active.t'+order).outerHeight();
	
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
	
				if(horizontal == 0) { // 세로형
					$(this).closest('.tab-box').find('.tab .tab-editor').removeClass('active');
					$(this).closest('.tab-box').find('.tab .tab-editor.tabs'+order).addClass('active');
				} else { // 가로형
					$(this).closest('.tab-width').siblings('.editor-box').children('.tab-editor').removeClass('active');
					$(this).closest('.tab-width').siblings('.editor-box').children('.tab-editor.tabs'+order).addClass('active');
				}
			}
		});

		$('.tab-wrapper .tab-box .tab').live({
			click: function() {
				$(this).removeClass('hover');
			},
			mouseover: function() {
				$('.tab-wrapper .tab-box .tab:not(.hide)').removeClass('hover');
				if(!$(this).hasClass('active'))	$(this).addClass('hover');
			},
			mouseout: function() {
				$('.tab-wrapper .tab-box .tab:not(.hide)').removeClass('hover');
			}
		});

		$('.userELallProducts .gallery-category-nav li').live({
			mouseover: function() {
				$(this).addClass('hover');
				$(this).siblings().removeClass('hover');
			},
			mouseout: function() {
				$('.userELallProducts .gallery-category-nav li').removeClass('hover');
			}
		});

		//calendar 블럭
		let currentDate = new Date();
		$.cl_calendar = {
			active : '',
			events : [],
			// currentDate : new Date(),
			init : function(sid, pid) { 
				if(typeof sid  == 'undefined' || typeof pid == 'undefined') {
					alert('Undefined SID,PID');
					return false;
				}
				$.cl_calendar.id = '';
				$.cl_calendar.events = [];

				$.ajax({
					url: '/template/get_calendar',
					data: { sid: sid, pid: pid },
					type: 'POST',
					dataType: 'json',
					success: function(data) {
						$.cl_calendar.id = pid;
						$.cl_calendar.events = data;
						$.cl_calendar.draw();
						
						let s = '';
						if (data.length) {
							if ($('.element[data-id="' + pid + '"] .mobile-events').length == 0)
								$('.element[data-id="' + pid + '"] .scd_list').prepend('<div class="mobile-events"></div>');
							$('.element[data-id="' + pid + '"] .mobile-events').empty();
						
							const currentYear = currentDate.getFullYear();
							const currentMonth = currentDate.getMonth() + 1;
						
							let countThisMonth = 0;
							let eventMap = {};
						
							$.each(data, function (i, v) {
								const d = new Date(v.s_date);
								const year = d.getFullYear();
								const month = d.getMonth() + 1;
						
								if (year === currentYear && month === currentMonth) {
									countThisMonth++;
									const dateKey = v.s_date;
									const time = (v.fulltime == 'Y') ? '종일' : v.s_time + ' ~ ' + v.e_time;
						
									if (!eventMap[dateKey]) {
										eventMap[dateKey] = [];
									}
									eventMap[dateKey].push('<div class="event-memo"><span class="event-time">' + time + '</span>' + v.memo + '</div>');
								}
							});
						
							let s = '';
							if (countThisMonth === 0) {
								s += '\
								<div class="event-date"></div>\
								<div class="event-memo"><span class="event-time noschedule">이번달 일정이 없습니다.</span></div><br>';
							} else {
								const sortedDates = Object.keys(eventMap).sort();
								$.each(sortedDates, function (i, date) {
									s += '<div class="event-date">' + date_string(date) + '</div>';
									$.each(eventMap[date], function (j, memoHtml) {
										s += memoHtml;
									});
									s += '<br>';
								});
							}
						
							$('.element[data-id="' + pid + '"] .mobile-events').append(s);
						} else {
							if ($('.element[data-id="' + pid + '"] .mobile-events').length == 0)
								$('.element[data-id="' + pid + '"] .scd_list').prepend('<div class="mobile-events"></div>');
							$('.element[data-id="' + pid + '"] .mobile-events').empty();
							let s = '\
								<div class="event-date"></div>\
								<div class="event-memo"><span class="event-time noschedule">이번달 일정이 없습니다.</span></div><br>';
							$('.element[data-id="' + pid + '"] .mobile-events').append(s);
						}
					}
				});
				
			},
			draw: function() {
				const year = currentDate.getFullYear();
				const month = currentDate.getMonth();
				const firstDay = new Date(year, month, 1);
				const lastDay = new Date(year, month + 1, 0);
				const firstDayOfWeek = firstDay.getDay();
				const prevLastDay = new Date(year, month, 0).getDate();
				$('.days').empty();
				for (let i = firstDayOfWeek - 1; i >= 0; i--) {
					const day = prevLastDay - i;
					const curDate = new Date(year, month - 1, day);
					const dateString = formatDate(curDate);
					const dayElement = createDayElement(curDate, dateString, true);
					$('.days').append(dayElement);
				}
				
				// 현재 달의 날짜 표시
				for (let i = 1; i <= lastDay.getDate(); i++) {
					const curDate = new Date(year, month, i);
					const dateString = formatDate(curDate);
					const dayElement = createDayElement(curDate, dateString, false);
					$('.days').append(dayElement);
				}
				
				// 다음 달의 날짜 표시 (필요한 경우)
				const totalCellsNeeded = Math.ceil((firstDayOfWeek + lastDay.getDate()) / 7) * 7;
				const nextMonthschedule = totalCellsNeeded - (firstDayOfWeek + lastDay.getDate());
				
				for (let i = 1; i <= nextMonthschedule; i++) {
					const curDate = new Date(year, month + 1, i);
					const dateString = formatDate(curDate);
					const dayElement = createDayElement(curDate, dateString, true);
					$('.days').append(dayElement);
				}
				$('.date_wrap').children('a.date[data-type="year"]').attr('data-val', year).text(year);
            	$('.date_wrap').children('a.date[data-type="month"]').attr('data-val', month + 1).text(String(month + 1).padStart(2, "0"));
			},
			write: function(dateAttr) {
				selectedDate = dateAttr;
				openEventModal(dateAttr, $.cl_calendar.events);
			},
			modify: function(dateAttr) {
				selectedDate = dateAttr;
				openEventList(dateAttr, $.cl_calendar.events);
			},
			save: function(pid) {
				const eventId = $('#eventId').val();
				const eventSeq = $('#eventSeq').val();
				const eventSid = $('#eventSid').val();
				const eventStartDate = $('#eventStartDate').val();
				const eventStartTime = $('#eventStartTime').val();
				const eventEndDate = $('#eventEndDate').val();
				const eventEndTime = $('#eventEndTime').val();
				const eventMemo = $('#eventMemo').val();
				
				// 유효성 검사
				if (!eventStartDate || !eventStartTime || !eventEndDate || !eventEndTime || !eventMemo) {
					alert('필수 항목을 모두 입력해주세요.');
					return;
				}
				
				// 종료일시가 시작일시보다 늦은지 확인
				const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
				const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);
				
				if (endDateTime <= startDateTime) {
					alert('종료 일시는 시작 일시보다 나중이어야 합니다.');
					return;
				}
				
				// 이벤트 객체 생성
				const eventData = {
					sid: b.SID,
					seq: (eventSeq) ? eventSeq : '',
					pid: pid,
					month: eventStartDate.substring(0, 7),
					sdate: eventStartDate,
					stime: eventStartTime,
					edate: eventEndDate,
					etime: eventEndTime,
					fulltime: 'N',
					notice: '',
					memo: eventMemo
				};
				
				var url = '';
				if(eventSeq) {
					url = '/template/modify_calendar';
				} else {
					url = '/template/calendar';
				}

				$.ajax({
					url: url,
					data: { data: eventData },
					type: 'POST',
					dataType: 'json',
					success: function(data) {
						// checkError(data);
						$.cl_calendar.events = data; 
						$.cl_calendar.draw();
					},
					error: function (xhr, status, error) {
						
					}
				});
				
				// 폼 초기화
				$('#eventForm')[0].reset();
				$('#eventId').val('');
				$('.modal-schedule').fadeOut(300);
			}
		}

		// 날짜 셀 클릭 이벤트 (동적으로 생성된 요소에 대한 이벤트 처리)
		$(document).on('click', '.day_wrap', function() {
			var dateAttr = $(this).data('date');
			var isEvent = $(this).find('.event').length;

			if(isEvent > 0) $.cl_calendar.modify(dateAttr, $.cl_calendar.events);
		});


		// 이전 달 버튼 클릭 이벤트
		$(document).on('click', '._prev_month_btn', function() {
			var pid = $(this).closest('.calendar').attr('data-id');
			var getYear = currentDate.getFullYear(),
				getMonth = String(currentDate.getMonth() - 1).padStart(2, "0");
			currentDate.setMonth(getMonth);
			// console.log(currentDate.getMonth());
			$(this).siblings('.date_wrap').children('a.date[data-type="year"]').attr('data-val', getYear);
			$(this).siblings('.date_wrap').children('a.date[data-type="year"]').text(getYear);
			$(this).siblings('.date_wrap').children('a.date[data-type="month"]').attr('data-val', getMonth);
			$(this).siblings('.date_wrap').children('a.date[data-type="month"]').text(getMonth);
			$.cl_calendar.init(b.SID, pid);
		});

		// 다음 달 버튼 클릭 이벤트
		$(document).on('click', '._next_month_btn', function() {
			var pid = $(this).closest('.calendar').attr('data-id');
			var getYear = currentDate.getFullYear(),
				getMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
			currentDate.setMonth(getMonth);
			// console.log(currentDate.getMonth());
			$(this).siblings('.date_wrap').children('a.date[data-type="year"]').attr('data-val', getYear);
			$(this).siblings('.date_wrap').children('a.date[data-type="year"]').text(getYear);
			$(this).siblings('.date_wrap').children('a.date[data-type="month"]').attr('data-val', getMonth);
			$(this).siblings('.date_wrap').children('a.date[data-type="month"]').text(getMonth);
			// console.log(b.SID);
			// console.log(pid);
			$.cl_calendar.init(b.SID, pid);
		});

		$(document).on('click', '._today_btn', function() {
			var pid = $(this).closest('.calendar').attr('data-id');
			currentDate = new Date(); // 현재 날짜로 설정 (예제에서는 2025년 3월 18일)
			$(this).parent('.calendar_btn_area').siblings('.date_wrap').children('a.date[data-type="year"]').attr('data-val', currentDate.getFullYear());
			$(this).parent('.calendar_btn_area').siblings('.date_wrap').children('a.date[data-type="year"]').text(currentDate.getFullYear());
			$(this).parent('.calendar_btn_area').siblings('.date_wrap').children('a.date[data-type="month"]').attr('data-val', String(currentDate.getMonth()).padStart(2, "0"));
			$(this).parent('.calendar_btn_area').siblings('.date_wrap').children('a.date[data-type="month"]').text(String(currentDate.getMonth()).padStart(2, "0"));
			$.cl_calendar.init(b.SID, pid);
		});

		// 모달 닫기 버튼 클릭 이벤트
		$(document).on('click','.modal-close, #cancelBtn', function() {
			closeEventModal();
		});

		// 모달 외부 클릭 시 닫기
		$(document).on('click', '.modal-schedule', function(e) {
			if ($(e.target).hasClass('modal-schedule')) {
				closeEventModal();
			}
		});

		function openEventModify(sid, seq, sdate, stime, edate, etime, memo) {
			$('#eventForm')[0].reset();
			$('#eventId').val('');
			$('#eventSid').val(sid);
			$('#eventSeq').val(seq);
			$('#eventStartDate').val(sdate);
			$('#eventStartTime').val(stime);
			$('#eventEndDate').val(edate);
			$('#eventEndTime').val(etime);
			$('#eventMemo').val(memo);
			
			// 모달 표시
			$('.modal-overlay-modify').fadeOut(300);
			$('#eventModal').fadeIn(300);
		}

		function openEventModal(dateString) {
			selectedDate = dateString;
			
			// 폼 초기화
			$('#eventForm')[0].reset();
			$('#eventId').val('');
			$('#eventStartDate').val(dateString);
			$('#eventEndDate').val(dateString);
			
			// 종료일은 시작일 이후만 선택 가능하도록 설정
			$('#eventEndDate').attr('min', dateString);
			
			// 모달 표시
			$('#eventModal').fadeIn(300);
		}

		// 모달 열기(값이 있을때)
		function openEventList(dateString, eventData) {
			var dayOfWeek = getDayOfWeek(dateString);

			var match = [];
			for(var i=0; i < eventData.length; i++) {
				if(dateString == eventData[i].s_date) {
					match.push(eventData[i]);
				}
			}
			
			var html = '';
			html += '\
				<div class="modal-container">\
					<div class="modal-header">\
						<div class="modal-title">'+ dateString +'&nbsp;&nbsp;&nbsp;'+ dayOfWeek +'</div>\
						<button class="modal-close">&times;</button>\
					</div>\
					<hr>\
					<div class="modal-body">\
						<ul class="scd_list">\
					';
			if(match.length == 1) {
				var stime = match[0].s_time.substring(0,5),
					etime = match[0].e_time.substring(0,5);
				html += '<li data-index="" data-seq="" data-pid="" class="schedule_list _schedule_list">\
							<div class="info">\
								<span class="datetime">'+ dateString +'('+ dayOfWeek +') '+ stime +' ~ '+ etime +'</span>\
								<input type="hidden" name="sid" class="sid" value="'+ match[0].sid +'">\
								<input type="hidden" name="seq" class="seq" value="'+ match[0].seq +'">\
								<input type="hidden" name="pid" class="pid" value="'+ match[0].pid +'">\
								<input type="hidden" name="sdate" class="sdate" value="'+ match[0].s_date +'">\
								<input type="hidden" name="stime" class="stime" value="'+ match[0].s_time +'">\
								<input type="hidden" name="edate" class="edate" value="'+ match[0].e_date +'">\
								<input type="hidden" name="etime" class="etime" value="'+ match[0].e_time +'">\
								<input type="hidden" name="memo" class="memo" value="'+ match[0].memo +'">\
							</div>\
							<p class="txt">'+ match[0].memo +'</p>\
						</li>';
			} else if(match.length > 1) {
				for(var j=0; j < match.length; j++) {
					var stime = match[j].s_time.substring(0,5),
						etime = match[j].e_time.substring(0,5);
					html += '<li data-index="" data-seq="" data-pid="" class="schedule_list _schedule_list">\
							<div class="info">\
								<span class="datetime">'+ dateString +'('+ dayOfWeek +') '+ stime +' ~ '+ etime +'</span>\
								<input type="hidden" name="sid" class="sid" value="'+ match[j].sid +'">\
								<input type="hidden" name="seq" class="seq" value="'+ match[j].seq +'">\
								<input type="hidden" name="pid" class="pid" value="'+ match[j].pid +'">\
								<input type="hidden" name="sdate" class="sdate" value="'+ match[j].s_date +'">\
								<input type="hidden" name="stime" class="stime" value="'+ match[j].s_time +'">\
								<input type="hidden" name="edate" class="edate" value="'+ match[j].e_date +'">\
								<input type="hidden" name="etime" class="etime" value="'+ match[j].e_time +'">\
								<input type="hidden" name="memo" class="memo" value="'+ match[j].memo +'">\
							</div>\
							<p class="txt">'+ match[j].memo +'</p>\
						</li>';
				}
			}
			html += '</ul></div>\
				</div>\
			';
			$('#eventModalModify').empty();
			$('#eventModalModify').html(html);
			$('#eventModalModify').fadeIn(300);
		}

		// 모달 닫기 함수
		function closeEventModal() {
			$('.modal-schedule').fadeOut(300);
			selectedDate = null;
			currentEventId = null;
		}

		// 이벤트 수정 함수
		function editEvent(eventId) {
			const event = events.find(event => event.id === parseInt(eventId));
			if (event) {
				$('#eventId').val(event.id);
				$('#eventStartDate').val(event.startDate);
				$('#eventStartTime').val(event.startTime);
				$('#eventEndDate').val(event.endDate);
				$('#eventEndTime').val(event.endTime);
				// $('#eventTitle').val(event.title);
				$('#eventMemo').val(event.memo);
				
				// 종료일은 시작일 이후만 선택 가능하도록 설정
				$('#eventEndDate').attr('min', event.startDate);
				
				// 폼으로 스크롤
				$('.modal-body').scrollTop(0);
			}
		}

		function formatDate(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		}

		function getDayOfWeek(dateString) {
			const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
			const date = new Date(dateString);  // 문자열을 Date 객체로 변환
			return days[date.getDay()]; // 0(일) ~ 6(토)에 해당하는 요일 반환
		}

		function createDayElement(date, dateString, isOtherMonth) {
			// console.log('date: '+date+', dateString: '+dateString+', isOtherMonth:'+isOtherMonth);
			// console.log('$.cl_calendar.events',$.cl_calendar.events);
			
			const day = date.getDate();
			const dayOfWeek = date.getDay();
			const isToday = date.toDateString() === new Date().toDateString(); // 예제에서는 3월 18일이 오늘
			let className = 'day_wrap _day_wrap';
			if (dayOfWeek === 0) className += ' sunday';
			if (dayOfWeek === 6) className += ' saturday';
			if (isOtherMonth) className += ' other-month';
			if (isToday) className += ' today';
			
			const today_class = (isToday) ? 'today' : '';
			const today_themebg = (isToday) ? 'theme_background' : '';
			const today_themebd = (isToday) ? 'theme_border' : '';

			const dayElement = $('<div>', { 
				class: className,
				'data-date': dateString
			});
			
			// 일자 표시
			const dayNumber = $('<span>', { 
				class: `num _dateNum  ${today_themebg}`, 
				text: day 
			});

			// 오늘 표시
			if (isToday) {
				dayNumber.html(`<div class="today-indicator">${day}</div>`);
			}
			// console.log(today_class);
			dayElement.append(dayNumber);
			dayElement.find('._dateNum').wrap(`<a class="day_num ${today_class} ${today_themebd}"></a>`);
			dayElement.find('.day_num').append('<span class="theme_border"></span>');

			var count = 0;
			for (var i = 0; i < $.cl_calendar.events.length; i ++) {
				var time = '';
				if(dateString == $.cl_calendar.events[i].s_date ) {
					if($.cl_calendar.events[i].fulltime == 'Y') time = '종일일정';
            		else time = $.cl_calendar.events[i].s_time.substring(0, 5) + '-' + $.cl_calendar.events[i].e_time.substring(0, 5);
					dayElement.find('.day_num').append('<div class="event">'+ time +'</div>');
					dayElement.find('.day_num').append('<div class="event_memo">'+ $.cl_calendar.events[i].memo +'</div>');
					count++;
				}
			}
			if(count == 1) {
				dayElement.find('.day_num .event_memo').before('<div class="event_mobile">'+ count +'</div>');
			} else if(count > 1) {
				dayElement.find('.day_num .event').remove();
				dayElement.find('.day_num .event_memo').remove();
				dayElement.find('.day_num').append('<div class="event more">일정'+ count +'</div>');
				dayElement.find('.day_num .event_memo').before('<div class="event_mobile">' + count +'</div>');
			}
			
			return dayElement;
		}

		// $('.gallery-item').live('click', function(e) {
		// 	if($(this).find('[attr-flink]').length > 0 ) {
		// 		e.preventDefault();
		// 		return false;
		// 	}

		// 	if($(e.target).hasClass('like') || $(e.target).closest('.figure').hasClass('like')) {
		//         e.preventDefault(); 
		//         return false;
		//     }
			
		// 	var $el = $(this).parents('.element');
		// 	var pid = $el.attr('data-id');
		//     $('.blueimp-gallery').addClass('blueimp-gallery-controls');
		//     $('.blueimp-gallery a.zoom-in').remove();
		// 	$('.blueimp-gallery a.gallery-like').addClass('hide').removeClass('active').removeAttr('data-like');

		// 	var gid = $(this).find('a').attr('data-gallery');
		//     var totalSlide = $(gid).find('.slide').length;
		//     $('.blueimp-gallery .slide-index .total-slide').text(totalSlide);

		//     if($(this).find('a').attr('data-img-original') == 'ON') {
		// 	    $('.blueimp-gallery a.close').after('<a class="zoom-in" data-id="' + pid + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M24 22.94l-6.42-6.42C19.08 14.76 20 12.49 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c2.49 0 4.76-0.92 6.52-2.42L22.94 24 24 22.94zM1.5 10c0-4.69 3.81-8.5 8.5-8.5 4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5C5.31 18.5 1.5 14.69 1.5 10z"/><polygon points="10.75 6 9.25 6 9.25 9.25 6 9.25 6 10.75 9.25 10.75 9.25 14 10.75 14 10.75 10.75 14 10.75 14 9.25 10.75 9.25 "/></svg></a>');
		// 	}
			
		// 	$(gid).off('slide').off('slideend');
		// 	$(gid).on('slide', function (event, index, slide) {
		// 		if($(this).find('a').attr('data-gallery-like') === 'ON') $('.blueimp-gallery a.gallery-like').removeAttr('data-like').addClass('hide');
	    //     }).on('slideend', function(event, index, slide){
        // 		$('.blueimp-gallery .slide-index .current-slide').text(index+1);
	    //     	if($(this).find('a').attr('data-gallery-like') === 'ON') {
	    //     		var itemSeq = $el.find('.gallery-item').eq(index).attr('data-seq');
		//             if(itemSeq == undefined) {
		//                 itemSeq = $('.galleryPL'+pid+'.gallery-popup .gallery-item[data-index='+index+']').attr('data-seq');
		//             }
		// 			var l_position = setTimeout(function(){
		//                 if(!$(slide).hasClass('slide-loading')) {
		//                     galleryLikePosition(gid, slide, itemSeq);
		//                     clearTimeout(l_position);
		//                 }
		//             }, 600);
	    //     	}
	    //     });
		// 	$('.blueimp-gallery').find('h3.title').html($(this).find('a').attr('data-title'));

		//    	$.cookie('gallery-item', $(this).attr('data-seq'), { path : '/', expires: 12 * 60 * 60 * 1000 });
		//    	if(b.PARENT.prev != null) $('.data-page-prev').addClass('active');
		//    	if(b.PARENT.next != null) $('.data-page-next').addClass('active');
		// 	e.stopPropagation();
		// });

		// $('body').on('click','.blueimp-gallery a.zoom-in', function(e) {
		//     var idx = 0,
		//         eid = $(this).attr('data-id');
		//     $('#gframe-' + eid + ' .slide').each(function(i,v) {
		//         var trans = $(v).attr('style');
		//         if(trans.indexOf('translate(0px, 0px)') > -1 || trans.indexOf('transform: translate(0px) translateZ(0px)') > -1) {
		//             idx=i;
		//         }
		//     });
		//     // var src = $('#gframe-' + eid + ' .slide[data-index="' + idx + '"] > img').attr('src');

		//     // $('.blueimp-gallery a.zoom-in').attr('href',src).attr('target','_blank');
		//     e.stopPropagation();
		// });
``
		$('.element[data-type="contact"] .google-map .gm-fullscreen-control').live('click', function(e) {
			$(this).toggleClass('gm-open');

			if(!$(this).hasClass('gm-open')) {
				var el = $(this).closest('.element').attr('data-el');
				scrollToBlock('.'+el,300);
			}
		});

		$('#mobile-nav .siteLANG.cl-fixbtn.cl-visible .cl-lang').live({
			click: function(e) {
				if($('#mobile-nav .siteLANG.cl-fixbtn.cl-visible .dropdown-menu-wrap').hasClass('open')) {
					$('#mobile-nav #tpl-menu').css({
						'position':'relative',
						'z-index':'-1'
					});
				} else {
					$('#mobile-nav #tpl-menu').css({
						'position':'',
						'z-index':''
					});
				}
			}
		});

		$('#mobile-nav .dropdown-menu-wrap.open').live({
			click: function(e) {
				$('#mobile-nav .menu-has-children .dropdown-menu a').css('pointer-events','');
				$('#mobile-nav .menu-has-children i.fa-chevron-down').css('z-index','')
			}
		});
	

		/* page count */
		if(Object.keys(b.CONTENTS).length) {
			var ps_elupdate = this.contentUpdate(b.CONTENTS),
				vpmode = (typeof $('.mobilepc_ch').attr('data-desktop-option') != 'undefined') ? $('.mobilepc_ch').attr('data-desktop-option') : b.SETTINGS.viewportMode;

			ps_elupdate.done(function(r_data) {
				elFooter();
                if(typeof r_data != 'undefined' && typeof r_data.showOnlyFooter != 'undefined' && r_data.showOnlyFooter) {
                	return false;
                }
				if(b.COUNT) {
					if(b.PARENT.mode == 'shopping') {
						if(typeof property.PRODINFO === 'object') $.products.display_info();
						if($('#review-onoff').val() == 'true') $.products.review(b.VIEW,b.PAGE);
						if($('#qna-onoff').val() == 'true') $.products.qna(b.VIEW,b.PAGE);
					} else {
						if(b.VIEW) _this.displayComment();
					}
				}
			
				$('[data-aos-dummy]').each(function() {
					$(this).attr('data-aos', $(this).attr('data-aos-dummy')).removeAttr('data-aos-dummy');
				});
			}).then(function() {
		        // if(typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) {
		        // 	console.log(b.SETTINGS.zoom);
		        // 	$.mpcWeb.mpcWebhtml(vpmode,b.CONTENTS,b.SETTINGS.zoom);
		        // }
			}).then(function() {
				if(b.VIEW && b.PARENT.mode != 'shopping') {
					displayPageToolbar().then(function(pageToolbar){
	                    displayBottomList(b.PARENT.pid);

	                    if($('.page-bottomlist').length) {
	                        $('.page-bottomlist').before(pageToolbar);
	                    }
	                    if ($('.page-comments').length) {
	                        $('.page-comments').before(pageToolbar);
	                    }
	                });
				}
			}).then(function() {
	    		if(b.VIEW && b.PARENT.mode != 'shopping') displaySnsShare(b.PARENT.pid);
			}).then(function() {
	    		if(b.VIEW && b.PARENT.mode != 'shopping') displayLike(b.PARENT.pid);
			}).then(function() {
	    		if(b.VIEW && b.PARENT.mode != 'shopping') displayBottomNav(b.PARENT.pid);
	    	}).then(function() {
                if(typeof b.SETTINGS.hideScrollTop != 'undefined' && b.SETTINGS.hideScrollTop == true)  $('#goto-top').addClass('hide');
				if(b.VALIDPLAN && b.VALIDTYPE != 'PK') {
					var ismodeSm = ($('.cl-s-page').hasClass('mode-shopping')) ? true : false;
					if(!ismodeSm && b.ONE && !b.VIEW || b.PAGE == b.MENULINK[0] && !b.VIEW)	setSitePopup();
					$.siteBanner.init(true,true);
					// console.log(b);

					if(b.VALIDTYPE == 'BN' || b.VALIDTYPE == 'SM') {
						if(typeof b.SETTINGS.fnav != 'undefined' && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
					}
				}

				if(typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) mobileWebfnavCheck(vpmode);

				
				if($('#page-loading-css').length > 0) {
					if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();
					$('#page-loading-css').remove(); 
				}
	    	});
		} 
		else {
			var checkUrl = b.PAGE.split(","),
				vpmode = '';
				vpmode = $.mpcWeb.mpcGetVpmode(vpmode,b.SETTINGS);

			isMenuLock(function() {
				
				if($('#page-loading-css').length > 0) {
					if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();
					$('#page-loading-css').remove(); 
				}

				if(property.ISLOCK == 'false') {
					if(property.COUNT==0) {
						elFooter();
						if(checkUrl[0] == "forum" && b.VIEW) {				
							if(b.VALIDPLAN && b.VALIDTYPE != 'PK' && typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) {
								$.mpcWeb.mpcWebhtml(vpmode,b.CONTENTS,b.SETTINGS.zoom);
							}
							var ps_fmview = $.forum.view(b.VIEW);
							ps_fmview.done(function() {
								if($('.page-comments[data-id="'+b.VIEW+'"]').length == 0) _this.displayComment();

								setTimeout(function() {
									if(b.VIEW) {
										displaySnsShare(b.PARENT.pid);
										displayLike(b.PARENT.pid);
										displayBottomNav(b.PARENT.pid);
										displayBottomList(b.PARENT.pid);
									}
									if(b.VALIDPLAN && (b.VALIDTYPE == 'BN' || b.VALIDTYPE == 'SM')) {
										if(typeof b.SETTINGS.fnav != 'undefined' && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
									}
									if(b.VALIDPLAN && b.VALIDTYPE != 'PK' && typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) {
										$.mpcWeb.mpcWebhtml(vpmode,'',b.SETTINGS.zoom);
										mobileWebfnavCheck(vpmode);
									}
								}, 100);

							}).fail(function(error_msg) {
								console.log(error_msg);
							});
						}

						if(property.PAGE == 'psearch') {
							vpmode = $.mpcWeb.mpcGetVpmode(vpmode,property.SETTINGS);

							if(b.VALIDPLAN && b.VALIDTYPE != 'PK' && typeof property.SETTINGS.viewportMode != 'undefined' && property.SETTINGS.vpMode_onoff===true) $.mpcWeb.mpcWebhtml(vpmode,property.CONTENTS,property.SETTINGS.zoom);

							setTimeout(function() {
								if(property.VALIDPLAN && (property.VALIDTYPE == 'BN' || property.VALIDTYPE == 'SM')) {
									if(typeof property.SETTINGS.fnav != 'undefined' && !$.isEmptyObject(property.SETTINGS.fnav)) $.fnav.draw(property.SETTINGS.fnav);
								}
								if(typeof property.SETTINGS.viewportMode != 'undefined' && property.SETTINGS.vpMode_onoff===true) mobileWebfnavCheck(vpmode);
							}, 500);
						}

						var ismodeSm = ($('.cl-s-page').hasClass('mode-shopping')) ? true : false;
						if(b.VALIDPLAN && b.VALIDTYPE != 'PK') {
							if(!ismodeSm && b.ONE && !b.VIEW || b.PAGE == b.MENULINK[0] && !b.VIEW) setSitePopup(); 
							$.siteBanner.init(true,true);
						}
						if(b.VALIDPLAN && (b.VALIDTYPE == 'BN' || b.VALIDTYPE == 'SM')) {
							if(typeof b.SETTINGS.fnav != 'undefined' && !$.isEmptyObject(b.SETTINGS.fnav)) $.fnav.draw(b.SETTINGS.fnav);
						}

						if(b.VALIDPLAN && b.VALIDTYPE != 'PK' && typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) {
							$.mpcWeb.mpcWebhtml(vpmode,'',b.SETTINGS.zoom);
							mobileWebfnavCheck(vpmode);
						}

					}
				} else {
					elFooter();
				}
			});
		}

	    $(window).load(function() {
    	 	var p_settings = (b.PARENT.settings) ? jQuery.parseJSON(b.PARENT.settings) : {};
	 		if((typeof p_settings.sns_share_display == 'undefined' || !p_settings.sns_share_display || p_settings.sns_share_display=='OFF') && 
	 			(typeof p_settings.bottomNav_display == 'undefined' || !p_settings.bottomNav_display || p_settings.bottomNav_display=='OFF') &&
	 			(typeof p_settings.like_display == 'undefined' || !p_settings.like_display || p_settings.like_display=='OFF')) {
	 			$('.tpl-page-footer').addClass('hide');
	 		} 

	    	$('#no-fouc').css('opacity','1');
	        if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
	        	moveGallery($.cookie('gallery-item'));
	        }
	        
	        if(typeof $.cookie('forum_content_view') == 'undefined'){
		        moveScroll(0);
		    }
		    _this.loaded();
		    var musicPlay = true;
		    if(typeof b.SETTINGS.musicStop != 'undefined' && (b.SETTINGS.musicStop === true || b.SETTINGS.musicStop == 'true'))
		    	musicPlay = false;

		    if(typeof b.SETTINGS.musicUse != 'undefined' && (b.SETTINGS.musicUse === true || b.SETTINGS.musicUse == 'true'))
				$.musicON(musicPlay);

			if(musicPlay == false) $.musicPause();
			var used_disk_value = b.USED_DISK / 1024,
				used_disk = Math.ceil(used_disk_value); // byte으로 가져와서 megsabyte으로 변한다

			if(Number(b.DISK_SPACE) != -1 && (used_disk > b.DISK_SPACE) && (b.MB_LEVEL != 10)) setlimitdiskPopup();

			// menu sidebar - height overflow
			if($('body').width() > 768) {
				$('header.navbar-li:not([data-fixtype]) #fixed-menu > li.dropdown').live({
					mouseenter: function(e) {
						var this_bottom = $(this).find('.cl-icon').position().top + $(this).find('.cl-icon').height();
						$(this).find('.dropdown-menu').css({
							'top': this_bottom+'px',
						});
					},
					mouseleave: function(e) {
						$(this).find('.dropdown-menu').removeAttr('style');
					}
				});

				$('header.navbar-li[data-fixtype] #fixed-menu > li.dropdown').live({
					mouseenter: function(e) {
						var dropdown_cover = '<div class="dropdown_cover"></div>',
							this_bottom = 0,
			                is_fhAlign = (typeof $('.el-menu header.navbar[data-fixtype]').find('.container').attr('data-fh-align') != 'undefined') ? true : false,                         
			                checkSidebar = ($('.el-menu header.navbar').hasClass('sidebar')) ? true : false,
			                $cl_fixbtn = ($('header.navbar[data-fixtype] .cl-fixed-menu .cl-fixbtn.cl-visible').length>0) ? $('header.navbar[data-fixtype] .cl-fixed-menu .cl-fixbtn.cl-visible') : '',
			                visible_aHght = ($(this).find(' > a:visible').length>0) ? $(this).parents('.cl-fixed-menu').find('li.cl-fixbtn').height() : 10;
			                	
						var height_arr = [],
			        		height_max = '';

		        		$cl_fixbtn.find('> a:visible').each(function(){
		        			var fixbtn_height = ($(this).find('.cl-icon').length>0) ? $(this).find('.cl-icon').height() : $(this).height(),
		        				fixbtn_fsize = Number($(this).css('font-size').replace(/px/gi,''));

								// console.log($(this).height());
								// console.log($(this).parents('li.cl-fixbtn').height());
	        				if($(this).height() != $(this).parents('li.cl-fixbtn').height()) {
	        					fixbtn_height = ($(this).find('.cl-icon').height() > $(this).height()) ? $(this).find('.cl-icon').height() : 
		        				(($(this).find('.cl-icon').height() + fixbtn_fsize < $(this).height()) ? fixbtn_fsize : $(this).outerHeight());
	        				} 
		        		
        					height_arr.push(fixbtn_height);
		        		});

		        		height_max = Math.max(...height_arr);
				
						var li_Hght = 0;
						$(this).parents('.cl-fixed-menu').find('li.cl-fixbtn').each(function(i,v){
							var li_display = $(this).css('display');
							if(li_display!='none') {
								li_Hght = Number($(this).height());
								return false;
							}
						});

		        		var li_Hght_half = Number((li_Hght/2).toFixed(0)),
		        			height_max_half = Number((height_max/2).toFixed(0)),
		        			ul_height_max_cal = li_Hght_half - height_max_half;
		        		
		        		ul_height_max_cal = (ul_height_max_cal <= 0 && ul_height_max_cal>-3) ? 0 : ul_height_max_cal;
	        			this_bottom = ul_height_max_cal + Number(height_max.toFixed(0)) + 5;

		             	//if(!is_fhAlign && !checkSidebar && $(this).hasClass('siteLANG')) { this_bottom -= ul_height_max_cal;}

						if(checkSidebar) {
							var fixtype = $('.el-menu header.navbar').attr('data-fixtype'),
								fixtype_check_arr = ['01','02','03','08'];
							this_bottom = ($.inArray(fixtype,fixtype_check_arr)>-1) ? this_bottom : visible_aHght;
						} 
						
						if(!checkSidebar) {
			                $(this).find('.dropdown-menu').before(dropdown_cover);
			            }
					
			            $(this).find('.dropdown-menu').css({
							'top': this_bottom+'px'
						});


					},
					mouseleave: function(e) {
						$(this).find('.dropdown-menu').removeAttr('style');
            			$(this).find('.dropdown_cover').remove();
					}
				});

				$('.sidebar .nav li.dropdown').live({
					mouseenter: function(e) {
						var checkSubMenuPosition = $(this).find('.dropdown-menu').css('position');
						if(checkSubMenuPosition == 'absolute') {
							var this_top = $(this).offset().top - $(document).scrollTop();
							if($(this).closest('header').parent('#element-display').length > 0) this_top -= $(this).closest('header').parent('#element-display').offset().top;
							
							$(this).find('.dropdown-menu').css({
								'position': 'fixed',
								'top': this_top+'px',
								'left': '260px'
							});
						}
					},
					mouseleave: function(e) {
						$(this).find('.dropdown-menu').removeAttr('style');
					}
				});
			} else {
				$('header.navbar-li #fixed-menu > li.dropdown').find('.dropdown-menu').removeAttr('style');
				$('header.sidebar #tpl-menu > li.dropdown').find('.dropdown-menu').removeAttr('style');
			}


			if(typeof $.cookie('ci_goto-gallery') != 'undefined' && $.cookie('ci_goto-gallery')) {
				var goto_gallery = '.element[data-id="' + $.cookie('ci_goto-gallery') + '"]',
					cookie_domain =  (property.HOST.indexOf(':') > -1) ? property.HOST.substring(0,property.HOST.indexOf(':')) : property.HOST;
				if($(goto_gallery).length > 0) {
					scrollToBlock(goto_gallery, 1000);
				}
				$.cookie('ci_goto-gallery', '', { domain: '.' + cookie_domain,expires: -1 });
				$.cookie('ci_goto-gallery-cate', '', { domain: '.' + cookie_domain,expires: -1 });
			}

			if(isAosBlock) {
				$('body,html').addClass('aos-height aos-overflowX');
				if($('header.navbar').hasClass('navbar-fheader')) $.fheader.position();
			} else {
				$('body,html').removeClass('aos-height aos-overflowX');
			}

			if(typeof fbq == 'function' && b.VALIDTYPE == 'SM') {
				if(b.VIEW) {
					var checkProduct = (b.PAGE.match(/^forum,/g) === null && typeof b.PARENT != 'undefined' && typeof b.PARENT.mode != 'undefined' && b.PARENT.mode == 'shopping') ? true : false,
						mn = (b.ONE) ? b.PARENT.opage : b.PARENT.ppage;
					if(checkProduct && typeof callbackEvtViewContent == 'function') callbackEvtViewContent(mn,b.PARENT.seq,b.PARENT.title,$('.total-price').text().replace(/[^0-9]/g,''));
				} else {
					var checkProductList = ($('.element[data-type="gallery"][data-mode="shopping"]').length > 0) ? true : false;
					if(checkProductList && typeof callbackEvtLead == 'function') callbackEvtLead(b.PAGE);
				}
			}

	    });
    },
    contentUpdate : function(contents) {
    	// console.log(' page draw 01:: contentUpdate');
	    var deferred = $.Deferred();
    	var b = this.b,
    		_this = this,
    		idx = 0;
    	
    	var checkSiteLock = isSitePasswordLock();
		checkSiteLock.then(function() {
			isMenuLock(function() {
				var default_t_css = '', default_m_css  = '';
				var checkGalleryView = (b.VIEW && b.PAGE.match(/^forum,/g) === null) ? true : false,
					page_pos = 0,
					site_settings = (typeof b.SETTINGS != 'undefined' && b.SETTINGS) ? b.SETTINGS : {},
					vpmode = '';
                var is_templates = checkTemplateSite(b.SID);
				vpmode = $.mpcWeb.mpcGetVpmode(vpmode,b.SETTINGS);
				if(b.VALIDPLAN && b.VALIDTYPE != 'PK' && typeof b.SETTINGS.viewportMode != 'undefined' && b.SETTINGS.vpMode_onoff===true) {
					$.mpcWeb.mpcWebhtml(vpmode,b.CONTENTS,b.SETTINGS.zoom);
				}

				var check_modoo = $('.dsgn-body').hasClass('modoo') ? true : false,
					fl_data = {};
				if(check_modoo) {
					fl_data = draw_floating();
				}

				$.each(contents, function(i,v) {
		    		page_pos += 1;
					// console.log(`i: ${i}, v: `);console.log(v);
		    		var c = v.element,
		    			$el = $('.' + c.elname),
						settings = (c.elsettings == '' || typeof c.elsettings == 'undefined') ? {} : $.parseJSON(c.elsettings),
						block_lang = (typeof settings.blocklang != 'undefined') ? settings.blocklang : LANG
		    			msny = (c.feature=='masonry') ? true : false;

					if(c.type == 'video') {
						c.mode = ($el.find('.video-gallery-url').length > 0) ? 'zoom' : 'thumb';
					}

		            //처음 접속 시
		            $el.addClass('el_' + idx)
		            	.addClass('element')
		                .attr('data-id', c.seq)
		                .attr('data-el','el_' + idx)
		                .attr('data-pos', c.pos)
		                .attr('data-name', c.elname)
		                .attr('data-msny', msny)
		                .attr('data-type', c.type)
		                .attr('data-type2', c.type2)
						.attr('data-feature', c.feature)
		                .attr('data-mode', c.mode)
		                .attr('data-width', c.folder)
		                .attr('data-overlap',c.overlap);

					if($el.hasClass('modoo')) {
						if(window.innerWidth <= 768 && $el.find('._spotHomesite').hasClass('is_bottom')) {
							$el.find('._spotHomesite').removeClass('is_bottom');
						}
						
						if($el.find('._sectionSpot').hasClass('type_full') && window.innerWidth > 768) {
							var A = $el.find('._areaLogin').length ? true : false,
								C = window.innerHeight;
		
							if (A) {
								C -= 50;
							}
							
							$el.find("._sectionSpot .swiper-wrapper").css("height", C);
							$el.find("._sectionSpot .swiper-slide").css("height", C);
							$el.find("._sectionSpot ._imgCover").css("height", C).each(function(F, G) {
								var D = $(G);
								var E = D.attr("data-lazy-background-img-src");
								D.css({
									backgroundImage: "url(" + E + ")",
									filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + E + '}", sizingMethod="scale")'
								});
							});
							if (!$el.find("._spotHomesite").hasClass("is_bottom")) {
								$el.find("._spotHomesite").css("height", C);
							}
						}
						if($el.find('.page-container-mobile').length > 0) {
							if(window.innerWidth <= 768) $el.find('[data-role="page-container"]._content').hide();
							else $el.find('[data-role="page-container"]._content').show();
						} 

						if($el.parents('body').find('.header').hasClass('home') && $el.attr('data-el')=='el_0') {	
							$el.find('._spotHomesite .site_info').append(fl_data.el_html);
						}
					}

					if(b.ONE && c.orgpos==1)  $el.addClass('link-to-'+JSON.parse('"'+c.orgpage.replace(/ /g,'-')+'"'));

					var checkNotSupported = (!is_templates) ? $.notSupported.check(v.element.type,v.element.type2,v.element.feature) : false;
					if(checkNotSupported) {
						$(`.${v.element.elname}`).html('').attr('class',`hide element ${v.element.elname} el_${idx}`);
						$(`#el_${idx}css, #js_${idx}`).remove();
						idx++;
						return;
					}

					$el.find('video').attr({'playsinline': '','webkit-playsinline': ''});
					if(c.type == 'video' || c.type == 'others') {
						var checkFullscreen = (typeof settings.fullscreen != 'undefined' && settings.fullscreen == 'ON') ? true : false;
						if(checkFullscreen) $el.find('.video-wrap').addClass('video-fullscreen');
					}

		            if($el.length > 1 && c.type == 'showcase') {
			            $($el).each(function(i, v) {
			           		if(i>0) v.dataset['el'] = '';
			            });
		            }
					
					if($el.hasClass('error_404')==false) {
						if($el.hasClass('el-footer')==false) {
							if($el.hasClass('cl-s-product-detail')==false) {
								aosAddblock(site_settings,settings,$el);
							}						
						}
					}

					var data_aos_attr = '';
					if($el.is('[data-aos]')) {
						data_aos_attr = $el.attr('data-aos');
						$el.removeAttr('data-aos');
						$el.addClass('aos-init')
					}

	              	var blocklang = '';
					if(typeof settings.blocklang != 'undefined') {
		                blocklang = settings.blocklang;
		                $el.attr('data-blocklang',blocklang);
		            }

					if (c.type == 'sync') {
						var sync_list_total = (typeof v.element.sync !='undefined' && typeof v.element.sync.list != 'undefined' && (v.element.sync.list).length > 0) ? (v.element.sync.list).length : 0;
						if($el.find('.slick-page-label').length > 0) {
							var page_label = sync_list_total;
							if(c.type2 == 'imgpitem' && sync_list_total == 0) page_label = $el.find('.slick .item').length;

							$el.find('.slick-page-label .slick-page-now').text(1);
							$el.find('.slick-page-label .slick-page-total').text(page_label);
						}

						if($el.find('.sync-option').length > 0) {
							var sync_css = CSSJSON.toJSON(htmlspecialchars_decode(c.elcss));
								syncStyle = style.get(sync_css,c.elname),
								sync_view = (typeof syncStyle.__sync_view != 'undefined') ? syncStyle.__sync_view : 4,
								sync_view_t = (typeof syncStyle.__sync_view_t != 'undefined') ? syncStyle.__sync_view_t : 2,
								sync_view_m = (typeof syncStyle.__sync_view_m != 'undefined') ? syncStyle.__sync_view_m : 1,
								sync_space = (typeof syncStyle.__sync_space != 'undefined') ? syncStyle.__sync_space : 10,
								sync_space_top = (typeof syncStyle.__sync_space_top != 'undefined') ? syncStyle.__sync_space_top : 1,
								sync_height = (typeof syncStyle.__sync_height != 'undefined') ? syncStyle.__sync_height : 1,
								sync_page_unit = (typeof syncStyle.__sync_page_unit != 'undefined') ? syncStyle.__sync_page_unit : -1;

							$el.find('.sync-option').attr({
								'data-sync-view': Number(sync_view),
								'data-sync-view-t': Number(sync_view_t),
								'data-sync-view-m': Number(sync_view_m),
								'data-sync-space': Number(sync_space),
								'data-sync-space-top': Number(sync_space_top),
								'data-sync-height': Number(sync_height)
							});
							if(sync_page_unit > -1) {
								$el.find('.sync-option').attr('data-sync-hidden', (Number(sync_page_unit) + 1));

								if($el.find('.sync-page-label').length > 0) {
									var sync_p_cnt = $el.find('.sync-row .sync-item').length,
										sync_p_total = Math.ceil(sync_p_cnt / Number(sync_page_unit));
									$el.find('.sync-page .sync-page-now').text(1);
									$el.find('.sync-page .sync-page-total').text(sync_p_total);
									
									if(sync_p_total == 1) $el.find('.sync-page-wrap').hide();
									else $el.find('.sync-page-wrap').show();
								}
							}
						}

						var sync_loadmore_lang = block_lang;
						if(typeof settings.loadmore_lang != 'undefined' && settings.loadmore_lang && $.inArray(settings.loadmore_lang.toLowerCase(), ['ko','en']) > -1) sync_loadmore_lang = settings.loadmore_lang.toLowerCase();
						$el.find('.sync-page-more-str').text($.lang[sync_loadmore_lang]['config.loadmore']);
					}

					if(checkGalleryView) {
						if(c.page == 'fixedblock_'+b.PARENT.pid) $el.addClass('el-fixedblock');
						else $el.removeClass('el-fixedblock');

						$el.attr('data-pos', page_pos);
						// if(b.LUX && (c.orgpos == '1' || $el.is('.lux-product-block'))) $el.attr('data-ppos', (c.pos*1) + 1);
						// else $el.attr('data-ppos', c.pos);
						$el.attr('data-ppos', c.pos);
						$el.attr('data-posby', c.elnew);
					}

					if(c.type == 'contact' && c.page == 'fixedcontact') {
						$.fixedContact.init($el);
		            }

		            if(b.ISLOCK == 'false') $el.removeClass('hide');
		            else $el.addClass('locked');

		            if(c.type == 'forum' || c.type == 'latest' || c.type == 'sync') $el.addClass('preloading');

		            //add style
		            var jcss = CSSJSON.toJSON(c.elcss),
		            	elpd = style.getPadding(jcss,c.elname);

	            	var elFonts = $el.css('font-family');
	        		elFonts = elFonts + ",'Nanum Gothic'";
	        		var reFonts = elFonts.replace(/"/g, "\'");
	        		$el.css('font-family',reFonts);

		            var pt = parseInt(elpd.top),
		                pb = parseInt(elpd.bottom);
		                
		            if(pt>0||pb>0){
		                default_t_css = default_t_css + '\n 	.'+c.elname + '{';
		                if(Math.ceil(pt*0.8)>0)
		                default_t_css = default_t_css + 'padding-top: '+Math.ceil(pt*0.8) + 'px!important;';
		                if(Math.ceil(pb*0.8)>0)
		                default_t_css = default_t_css + 'padding-bottom: '+Math.ceil(pb*0.8) + 'px!important;';
		                default_t_css = default_t_css + '}';

		                default_m_css = default_m_css + '\n 	.'+c.elname + '{';
		                if(Math.ceil(pt*0.5)>0)
		                default_m_css = default_m_css + 'padding-top: '+Math.ceil(pt*0.5) + 'px!important;';
		                if(Math.ceil(pb*0.5)>0)
		                default_m_css = default_m_css + 'padding-bottom: '+Math.ceil(pb*0.5) + 'px!important;';
		                default_m_css = default_m_css + '}';
		            }
		            
		            if(idx == Object.keys(b.CONTENTS).length-1){
		                var css = '@media only screen and (max-width:767px) {' + default_t_css + '\n}\n';
		               	css = css + '@media only screen and (max-width:480px) {' + default_m_css + '\n}';

		                if($('#el-paddingcss').length == 0) $('.dsgn-body').find('#el_'+(Object.keys(b.CONTENTS).length-1)+'css').after('<style id="el-paddingcss">'+css+'</style>');
		                else $('#el-paddingcss').append(css);
		            }

		            var settings = (c.elsettings == '' || typeof c.elsettings == 'undefined') ? {} : $.parseJSON(c.elsettings);

					if(typeof settings.bookmark != 'undefined' && settings.bookmark) {
						$el.attr('data-bookmark',c.seq);
					}
					
					if(b.VIEW && (c.type == 'project' || c.type == 'product')) {
						$el.find('.data-page-prev').addClass('active');
						$el.find('.data-page-next').addClass('active');

	                    if(b.PARENT.prev == null) $el.find('.data-page-prev').removeClass('active');
	                    if(b.PARENT.next == null) $el.find('.data-page-next').removeClass('active');

	                    //상세페이지 배경 style 추가
	                    if(c.type == 'project') setGalleryProjectCss(b.PARENT,b.PARENT['elcss']);	                	
	                }

	                if(b.VIEW) {
		            	var img_onoff = (typeof settings.img_original_display != 'undefined' && settings.img_original_display) ? settings.img_original_display : 'OFF';
		            	$el.find('img[data-attach="true"]').attr('data-img-original',img_onoff);
	                }

					//video block ::: gallery
			        if(c.type == 'video') {
			            if($el.find('.video-gallery-url').length>0) { //재생방식 : 확대보기 
			                $.each($el.find('.item'),function(i,v){
			                    if(c.mode=='zoom') appendGalleryFrame($(this).parents('.element'),c.seq,'',c.type);
			                });
			            }
						resizeVideoIframe($el);
			        }

					if(c.type == 'forum') {
						var page_num = 1
						if (typeof $.cookie('forum_' + v.element.seq) != 'undefined' && $.cookie('forum_' + v.element.seq)) {
							page_num = $.cookie('forum_' + v.element.seq);
						} 
						_this.forumUpdate(v.element.seq, page_num, v.view, c.page, v.list);
					} else if(c.type == 'gallery') {
	                    _this.galleryEL[c.seq] = {
	                    	'seq' : c.seq,
	                    	'elname' : c.elname,
	                    	'eltag' : c.eltag,
	                    	'folder' : c.folder,
	                    	'mode' : c.mode,
	                    	'elsettings' : c.elsettings,
	                    	'feature' : c.feature,
	                    	'type' : c.type,
	                    	'type2' : c.type2,
							'searches' : c.searches
	                    };

						_this.galleryUpdate(c,v);
                        if(c.only_category) {
                            localStorage.setItem('searches',JSON.stringify(new Array(c.searches.uri[0])));
                        }

						if (typeof c.price_hidden != 'undefined' && c.price_hidden == 'ON') {
							$el.find('.figure.price').html('');
						}
					} else if(c.type == 'sync') {
						var sync_source = _this.syncUpdate($el,v.element);
						$el.html(sync_source);

						if($el.find('[data-sync-loop="true"]').length > 0) {
							if(c.type2 == 'tab') $el.find('[data-sync-loop="true"] > li[data-list-no="1"]').attr('data-list-no','');
							if(c.type2 == 'imgpitem' && sync_list_total > 0) $el.find('[data-sync-loop="true"] > li:not([data-idx])').remove();
							$el.find('[data-sync-loop="true"] > li').eq(0).addClass('active').siblings().removeClass('active');
						}
						
					} else if(c.type == 'tabs') {
						// tab block 우선순위 check
						var el = $el.attr('data-name'),
							len = $el.find(".tab-box .tab:not(.hover)").length,
							motion_style = $el.attr("tab-motion-style"),
							tab_count = $el.attr("tab-count"),
							tab_case = $el.attr("data-case"),
							motion = $el.attr("tab-motion"),
							priority = Number($el.find('.tab-box .tab.active').attr('data-order')),
							navigation_use = $el.attr("navigation-use");
						if(navigation_use == '1') {
							if(motion_style == 1) {
								var motion = (((priority + 1) - Number(tab_count)) >= 0) ? priority - Number(tab_count) : 0;
								tabMotion(el, motion, "", len, motion_style, tab_count, tab_case);
							} else {
								var motion = Math.ceil(Number(priority) / Number(tab_count)) - 1;
								tabMotion(el, motion, "", len, motion_style, tab_count, tab_case);
							}
						}

					} else if(c.type == 'sns' && c.type2 == 'feed') {
		                $el.find('.data-feed-load-more').attr('data-feed-el',c.elname);
		                $el.find('.data-feed-load-more').removeAttr('style');
		                $el.find('.show-posts').removeClass('show-posts');

		                if(c.mode == 'site') {
							if(!$.isEmptyObject(b.SOCIAL)) {
								var load_sns = {};
								if(!$.isEmptyObject(b.SOCIAL.instagram) && typeof settings.sns_instagram != 'undefined' && settings.sns_instagram == 'ON') load_sns['instagram'] = b.SOCIAL.instagram;
								if(!$.isEmptyObject(b.SOCIAL.twitter) && typeof settings.sns_twitter != 'undefined' && settings.sns_twitter == 'ON') load_sns['twitter'] = b.SOCIAL.twitter;

								if(!$.isEmptyObject(load_sns)) {
									loadingElement(c.elname,'loading posts...');
									updateFeed(c.elname,load_sns,function() {
										$('.'+c.elname+' .listprogress').remove();
									});
								}
							}
		                } else {
							// SNS FEED:: before version
							if(typeof settings.sns != 'undefined' && settings.sns.twitter) {
								loadingElement(c.elname,'loading posts...');
								updateFeed(c.elname,settings.sns);
							}
		                }

					} else if(c.type == 'others' && c.type2 == 'countdown') {
		                var el_dday = $el.find('[data-dday="true"]'),
		                	cd_date = (el_dday.attr('data-countdown')) ? el_dday.attr('data-countdown') : new Date(),
		                    dateformat  = { days : '%D', hours: '%H', minutes: '%M', seconds: '%S' },
		                    dateendformat  = { days : '00', hours: '00', minutes: '00', seconds: '00' };
						
						if( typeof settings.countdown != 'undefined' && settings.countdown ) {  //set - block setting date 
	                        cd_date = settings.countdown;
		                }
		                if( !el_dday.attr('data-countdown') && typeof cd_date == 'object' ) { //set - example date
		                    cd_date.setTime(cd_date.getTime() + (35*24*60*60*1000));
		                }
			            cd_date = moment(cd_date).format('YYYY/MM/DD HH:mm:ss');
			            
						el_dday.countdown(cd_date, function(event) {
							$(this).find('.date-item[data-datetype]').each(function(i) {
								var dd_type = $(this).attr('data-datetype'),
									dd_format = $(this).attr('data-format'),
									dd_endformat = $(this).attr('data-finish');

								if(typeof dd_format == 'undefined' || !dd_format) dd_format = dateformat[dd_type];
								if(typeof dd_endformat == 'undefined' || !dd_endformat) dd_endformat = dateendformat[dd_type];

								if(event.elapsed) $(this).text(dd_endformat);
								else $(this).text(event.strftime(dd_format));
							});
						});
                		if($el.find('[data-bg-video="true"]').length > 0) resizeVideoIframe($el);
					} else if (c.type == 'latest') {
						var latest_data = (typeof settings.latest_data != 'undefined' && settings.latest_data) ? settings.latest_data : {};
						$.latest.init(c.seq,latest_data);					
					} else if (c.type == 'review') {
						_this.galleryEL[c.seq] = {
							'seq' : c.seq,
							'elname' : c.elname,
							'eltag' : c.eltag,
							'folder' : c.folder,
							'mode' : c.mode,
							'elsettings' : c.elsettings,
							'feature' : c.feature,
							'type' : c.type,
							'type2' : c.type2,
							'searches' : c.searches
						};
		                var gallery_data = (typeof settings.gallery_data != 'undefined' && settings.gallery_data) ? settings.gallery_data : {};
                		$.reviewContents.init(c.seq, gallery_data);
		            } else if (c.type == 'form') {
						$.forms.init(c.seq);
		            } else if (c.type == 'contact') {
		            	if(c.type2 == 'franchise map') {
		            		$.each($el.find('[data-fmap-loop="true"] .item .item-name'), function(i, v) {
		                        let itemName = $(v).html();
		                        itemName = itemName.replace(/&lt;&nbsp;/g, '&lt;').replace(/&nbsp;&gt;/g, '&gt;');
		                        $(v).html(itemName);
		                    });
		                    
		            		var $mapItem = $el.find('[data-fmap-loop="true"] > .item.selected');
                    		drawMap($mapItem, $el);
                    		fmapMobilePaging($el);
		            	}
		            } else if (c.type == 'calendar') {
						$.cl_calendar.init(c.sid, c.seq);
					}

					if($el.find('.slick').length > 0) {
						if (c.type == 'sync' && typeof syncSlickFn == 'function') syncSlickFn('.' + c.elname);
						else if($el.is('[data-clslick]') && typeof clSlickFn == 'function') clSlickFn('.' + c.elname);
					}

					if(data_aos_attr) {
						$el.removeClass('aos-animate');
						$el.addClass('render-aos');
						setTimeout(function(){
							$el.removeClass('render-aos').addClass('aos-animate');
						})
						$el.attr('data-aos-dummy', data_aos_attr)
					}

					// console.log(c.seq, c.type, settings);
					if($.inArray(c.type, ['contents', 'text', 'image']) > -1) {
	            		let ecs = enableContentsSlider(c.seq, c.type, settings);
						if(typeof settings.list_type != 'undefined' && settings.list_type == 's' && ecs) {
							// console.log('enable slider');
		                    $.contentsSlider.ready(c.seq).then(() => {$.contentsSlider.init(c.seq, settings)});
		                }
		            }

					changeBrokenImages($el);

		            idx++;
		    	});
				
				// $('.tag.preloading').replaceWith(function () {
				//     return $(this).html();
				// });
			
				if(check_modoo) {
					m_floating(fl_data);
				}
				

				$('.preloading').removeClass('preloading');
				document.querySelectorAll('.element video').forEach(function(video) {
					if(video.readyState > 0) video.classList.add('loaded');
					video.addEventListener('loadeddata', function() {
						this.classList.add('loaded');
					});
				});

				if(b.ISLOCK == 'true') {
					$('.locked').remove();
					return deferred.resolve({'showOnlyFooter':true});
				}
				
            	if($('.element:not([data-type2="franchise map"]) [data-map_kind="kakao"]').length && (typeof kakao == 'undefined' || typeof kakao.maps == 'undefined' || kakao.maps == null || property.VALIDPLAN == '')) {
	                $('.element:not([data-type2="franchise map"]) [data-map_kind="kakao"]').html('지도연결해제됨. Javascript키 확인');
	                $('.element:not([data-type2="franchise map"]) [data-map_kind="kakao"]').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
	            } else {
					$('.element:not([data-type2="franchise map"]) [data-map_kind="kakao"]').each(function() {
						var container = this;
                        var lat = $(this).data("lat");
                        var lng = $(this).data("lng");
                        var zoomInOut = $(this).data("zoominout");
                        var mapTitle = $(this).data("maptitle");
                        var mapContent = $(this).data("mapcontent");
                        var useTitle = $(this).data("usetitle");
                        var useContent = $(this).data("usecontent");

                        if (typeof zoomInOut == 'undefined' || !zoomInOut) zoomInOut = false;
                        if (typeof mapTitle == 'undefined' || !mapTitle) mapTitle = '';
                        if (typeof mapContent == 'undefined' || !mapContent) mapContent = '';
                        if (typeof useTitle == 'undefined' || !useTitle) useTitle = false;
                        if (typeof useContent == 'undefined' || !useContent) useContent = false;
                        
                        var options = { center: new kakao.maps.LatLng(lat, lng), level: 3 };
                        var c_map = new kakao.maps.Map(container, options);
                        var marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(lat, lng), map: c_map });

		                if(zoomInOut == true) {
	                        var zoomControlHtml = '';
	                        zoomControlHtml += '\
	                            <div class="zoom-control" style="margin-top: 8px; margin-right: 8px; right: 0; width: 30px; position: absolute; background-color: #fff; z-index: 1; border-radius: 3px; box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);">\
	                                <div class="btn-zoom-control" data-inout="I" style="cursor: pointer; width: 30px; height: 30px;">\
	                                    <svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 11h-4V7c0-.55-.45-1-1-1s-1 .45-1 1v4H7c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
	                                </div>\
	                                <div class="slider-wrap-container" style="height: 130px;">\
	                                    <div class="slider-wrap small" style="text-align: center; height: 100%;">\
	                                        <div style="max-height: 100%;" class="zoom-control-slider"></div>\
	                                    </div>\
	                                </div>\
	                                <div class="btn-zoom-control" data-inout="O" style="cursor: pointer; width: 30px; height: 30px;">\
	                                    <svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 13H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>\
	                                </div>\
	                            </div>\
	                        ';
	                        var $zoomController = $(zoomControlHtml);
	                        $(container).append($zoomController);
	                        var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
	                            'orientation': 'vertical',
	                            'min' : 1,
	                            'max' : 14,
	                            'step' : 1,
	                            'value' : 3,
	                            'handle' : '<div>dfafasdfas</div>',
	                            // 'reversed' : true,
	                            'tooltip' : 'hide',
	                        }).on('slide', function(data) {
	                            c_map.setLevel(data.value);
	                            c_map.setCenter(marker.getPosition());
	                        }).on('slideStop', function(data) {
	                            c_map.setLevel(data.value);
	                            c_map.setCenter(marker.getPosition());
	                        });

	                        $zoomController.find('.btn-zoom-control').on('click', function() {
	                            if($(this).data('inout') == 'I') {
	                                c_map.setLevel(c_map.getLevel() - 1);
	                                zoom_slider.slider('setValue', c_map.getLevel());
	                            } else if($(this).data('inout' == 'O')) {
	                                c_map.setLevel(c_map.getLevel() + 1);
	                                zoom_slider.slider('setValue', c_map.getLevel());
	                            }
	                        });

			                kakao.maps.event.addListener(c_map, 'zoom_changed', function() {
			                    zoom_slider.slider('setValue', c_map.getLevel());
			                });
		                }

		                if((useTitle == true || useContent == true) && (mapTitle || mapContent)) {
		                    var iwContent = '';
		                    if(useTitle == true && mapTitle) {
		                        iwContent = '<div class="title">' + mapTitle + '</div>';
		                    }
		                    if(useContent == true && mapContent) {
		                        iwContent += '<div class="content">' + mapContent + '</div>';
		                    }
	                        if(iwContent) {
	                            iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"></path></svg>' + iwContent + '</div>';
	                            var infoWindow = $(iwContent);
	                            $(container).append(infoWindow);
	                        }
		                }
						$(window).on("resize", function() {
							c_map.relayout();
							c_map.setCenter(marker.getPosition());
						});
					});
				}

	            if($('.element:not([data-type2="franchise map"]) [data-map_kind="naver"]').length && (typeof naver == 'undefined' || typeof naver.maps == 'undefined' || naver.maps == null || property.VALIDPLAN == '')) {
	                $('.element:not([data-type2="franchise map"]) [data-map_kind="naver"]').html('지도연결해제됨. Client ID 확인');
	                $('.element:not([data-type2="franchise map"]) [data-map_kind="naver"]').html('<iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5659473821083!2d127.0282496015659!3d37.494568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca1598c361b2b%3A0xdbf9af292beff3c!2z6rCV64Ko!5e0!3m2!1sko!2skr!4v1637303748377!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');
	            } else {
					$('.element:not([data-type2="franchise map"]) [data-map_kind="naver"]').each(function() {
						var container = this;
						var lat = $(this).data("lat");
						var lng = $(this).data("lng");
						var options = { center: new naver.maps.LatLng(lat, lng), zoom: 17};
		                var zoomInOut = $(this).data("zoominout");
		                var zoom = $(this).data("zoom");
		                var mapTitle = $(this).data("maptitle");
		                var mapContent = $(this).data("mapcontent");
		                var useTitle = $(this).data("usetitle");
		                var useContent = $(this).data("usecontent");
		                if(typeof zoomInOut == 'undefined' || !zoomInOut) zoomInOut = false;
		                if(typeof mapTitle == 'undefined' || !mapTitle) mapTitle = '';
		                if(typeof mapContent == 'undefined' || !mapContent) mapContent = '';
		                if(typeof useTitle == 'undefined' || !useTitle) useTitle = false;
		                if(typeof useContent == 'undefined' || !useContent) useContent = false;
						var c_map = new naver.maps.Map(container, options);
						var marker = new naver.maps.Marker({ position: new naver.maps.LatLng(lat, lng), map: c_map});

		                if(zoomInOut == true) {
	                        var zoomControlHtml = '';
	                        zoomControlHtml += '\
	                            <div class="zoom-control" style="margin-top: 8px; margin-right: 8px; right: 0; width: 30px; position: absolute; background-color: #fff; z-index: 1; border-radius: 3px; box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);">\
	                                <div class="btn-zoom-control" data-inout="I" style="cursor: pointer; width: 30px; height: 30px;">\
	                                    <svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 11h-4V7c0-.55-.45-1-1-1s-1 .45-1 1v4H7c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
	                                </div>\
	                                <div class="slider-wrap-container" style="height: 130px;">\
	                                    <div class="slider-wrap small" style="text-align: center; height: 100%;">\
	                                        <div style="max-height: 100%;" class="zoom-control-slider"></div>\
	                                    </div>\
	                                </div>\
	                                <div class="btn-zoom-control" data-inout="O" style="cursor: pointer; width: 30px; height: 30px;">\
	                                    <svg style="fill: #6b6b6b; margin: 3px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 13H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>\
	                                </div>\
	                            </div>\
	                        ';
	                        var $zoomController = $(zoomControlHtml);
	                        $(container).append($zoomController);
	                        var zoom_slider = $zoomController.find('.zoom-control-slider').slider({
	                            'orientation': 'vertical',
	                            'min' : 6,
	                            'max' : 21,
	                            'step' : 1,
	                            'value' : 17,
	                            'handle' : '<div>dfafasdfas</div>',
	                            'reversed' : true,
	                            'tooltip' : 'hide',
	                        }).on('slide', function(data) {
	                            c_map.setZoom(data.value);
	                            c_map.setCenter(marker.getPosition());
	                        }).on('slideStop', function(data) {
	                            c_map.setZoom(data.value);
	                            c_map.setCenter(marker.getPosition());
	                        });

	                        $zoomController.find('.btn-zoom-control').on('click', function() {
	                            if($(this).data('inout') == 'I') {
	                                c_map.setZoom(c_map.getZoom() + 1);
	                                zoom_slider.slider('setValue', c_map.getZoom());
	                            } else if($(this).data('inout' == 'O')) {
	                                c_map.setZoom(c_map.getZoom() - 1);
	                                zoom_slider.slider('setValue', c_map.getZoom());
	                            }
	                        });

	                        naver.maps.Event.addListener(c_map, 'zoom_changed', function(zoom) {
	                            zoom_slider.slider('setValue', c_map.getZoom());
	                        });
		                }
		                
		                if((useTitle == true || useContent == true) && (mapTitle || mapContent)) {
		                    var iwContent = '';
		                    if(useTitle == true && mapTitle) {
		                        iwContent = '<div class="title">' + mapTitle + '</div>';
		                    }
		                    if(useContent == true && mapContent) {
		                        iwContent += '<div class="content">' + mapContent + '</div>';
		                    }
	                        if(iwContent) {
	                            iwContent = '<div class="contact-map-info-window"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C4.69 0 2 2.69 2 6s1 4 6 10c5-6 6-6.69 6-10s-2.69-6-6-6zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"></path></svg>' + iwContent + '</div>';
	                            var infoWindow = $(iwContent);
	                            $(container).append(infoWindow);
	                        }
		                }
						$(window).on("resize", function() {
							// c_map.relayout();
							c_map.setCenter(marker.getPosition());
						});
					});
				}

				$('.element [data-map="true"]:not(iframe)').each(function() {
					var map_url = $(this).attr('data-url');
					if(typeof map_url != 'undefined' && map_url) {
						var map_iframe = getMapURL(map_url,'html');
						$(this).replaceWith(map_iframe);
						if(map_iframe.indexOf('google-map disabled') === -1) $(this).next('.map-undefined').remove();
					}
				});
                
				if($('.element a[data-popup][data-popup-name]').length > 0 && (!b.VALIDPLAN || b.VALIDTYPE == 'PK')) {
					$('.element a[data-popup][data-popup-name]').addClass('disabled');
				}			
				if($('.element[data-layout]').length > 0) {
	                setLayoutHeight();
	            }
		    	$('.dsgn-body').fitVids();
				deferred.resolve();
		    });			
		});
		//parallax();
	    return deferred.promise();
    },
    setLoginout : function (show, sid, site, profileimg) {
		if(show=='1') {
			$.getJSON('/template/checkLogin', function(data) {
				if(data.user && site) {
					if($('#tpl-menu').find('.loginout')) $('#tpl-menu').find('.loginout').remove();
					setLoginoutNav(sid, function() {
						getProfileMember();
						getProfileAuthor(sid,profileimg);
						$('.el_0').css('margin-top','55px');
					});
				} else {
					$('#tpl-menu').append('<li class="loginout"><a href="javascript:;" title="CREATORLINK login"><i class="fa fa-user"></i></a></li>'); 
				}
			});
	    }
    },
    liveUpdate : function(obj) {
    	// console.log('liveUpdate');

    	var b = this.b;

		var checkSidebar = $('.el-menu > header').hasClass('sidebar'),
			checkClnav = ($('.el-menu > header.cl-nav').length > 0) ? true : false,
			menu_class = {
				'navlist': (checkClnav) ? 'cl-nav-list ' : '',
				'navitem': (checkClnav) ? 'cl-nav-item ' : '',
				'subnavlist': (checkClnav) ? 'cl-subnav-list ' : '',
				'subnavitem': (checkClnav) ? 'cl-subnav-item ' : '',
			},
			menu = (checkClnav) ? $('.el-menu > header.cl-nav .cl-nav-list') : $('#tpl-menu'),
	        idx = 0,
	        regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/,
	        regex2 = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/;
	    menu.empty();
    	
		if($('.fmcss').length > 0) $('.fmcss').remove(); //forum background css

	    $.each(obj, function (idx, obj) {
	    	if(obj.name == '전체상품') {
	    		if(b.LUX || b.VALIDTYPE != 'SM' || !b.SLANG || (typeof b.SLANG.select_code !== 'undefined' && b.SLANG.select_code != 'ko')){
	    			return true;
	    		}
	    	}
	    	
	        b.MENULIST.push(obj.name.replace(/ /g,'-'));
	        if(obj.children) {
	            $.each(obj.children, function (idx, obj){
	                b.MENULIST.push(obj.name.replace(/ /g,'-'));
	            });
	        }
	    });

		if(b.ONE) {
			linkUrl = (b.VIEW) ? '/#' : '#';
			linkUrl = (b.VIEW && !b.PUBLISH) ? '/render/index#' : linkUrl;
		} else {
			linkUrl = (b.URL=='/') ? '/' : b.URL + '/';  
		}

		for (i = 0; i < obj.length; i++) {
            var link = obj[i].name;
			if(b.MENULIST.includes(link.replace(/ /g, '-'))) link = link.replace(/ /g, '-');
			
            if(link == '전체상품') {
	            if(b.LUX || b.VALIDTYPE != 'SM' || !b.SLANG || (typeof b.SLANG.select_code !== 'undefined' && b.SLANG.select_code != 'ko')) {
	                continue;
	            }
	        }

			var parent = b.PAGE.split(','),
				link_text = '', 
				target = '', 
				name = (checkClnav) ? `<span class="cl-nav-name">${obj[i].name}</span>` : obj[i].name,
				isInner = '',
				isBookmark = '', 
				isFlink = '';

			if(i==0) {
				if(obj[i].display=='on') {
					b.MENUCHECK.intro = true;
					b.MENULINK.push(link);
				}
				continue;
			}

			if(obj[i].name =='전체상품') {
	            obj[i].link = '';
	        }

			var active = (link == b.PAGE || link == parent[0]) ? 'active' : '',
				sub = obj[i].children.length;

			if (obj[i].display == 'on') {
				b.MENUCHECK.main = true;

				var menuoption_child = [];
				var checkLink = (obj[i].link) ? true : false,
					checkLinkInner = (checkLink && $.inArray(obj[i].link.replace(/ /g,'-'), b.MENULIST) > -1) ? true : false,
					checkLinkBookmark = (typeof obj[i].link !='undefined' && obj[i].link.match(/^\@/g) !== null) ? true : false,
					checkLinkFile = (typeof obj[i].link !='undefined' && obj[i].link.match(/^flink\@[0-9]/gi) !== null) ? true : false;

				link = (checkLink) ? ((checkLinkInner) ? obj[i].link.replace(/ /g,'-') : obj[i].link) : link;
				isInner = (checkLinkInner) ? obj[i].link.replace(/ /g,'-') : '';
				isBookmark = (checkLinkBookmark) ? ` attr-bookmark="${link.replace(/^\@/g,'')}"` : '';
				isFlink = (checkLinkFile) ? ` attr-flink="${link.replace(/^flink\@/gi,'')}"` : '';
				target = (obj[i].ltarget == '_blank') ? 'target="_blank"' : '';

				if(checkLink && !checkLinkInner && !checkLinkBookmark) {												// link-type: link-out      ==> a[attr-link]
					if(checkBase64Encode(link)) link = Base64.decode(link);
				}

				if(link == 'folder-menu') {
					link_text = 'javascript:;';
					target = '';
					if(typeof menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') != 'undefined') target = ' data-toggle="dropdown" aria-expanded="false" data-submenu="true" ';
				} else {
					if(!checkLink) b.MENULINK.push(link);
					link_text = (b.MENULIST.includes(link)) ? linkUrl + link : (!regex2.test(link) && regex.test(link)) ? '//' + link : link;
				}

	            if (sub) {
	                var sub_menu = '',
	                    sub_show = 0;

	                sub_menu = `<ul class="${menu_class['subnavlist']} dropdown-menu">\r\n`;
	                for (j = 0; j < obj[i].children.length; j++) {
	                    var child = obj[i].children,
							checkChildLink = (child[j].link) ? true : false,
							checkChildLinkInner = (checkChildLink && b.MENULIST.includes(child[j].link.replace(/ /g, '-'))) ? true : false,
							checkChildLinkBookmark = (typeof child[j].link!='undefined' && child[j].link.match(/^\@/g) !== null) ? true : false,
							checkChildLinkFile = (typeof child[j].link!='undefined' && child[j].link.match(/^flink\@[0-9]/gi) !== null) ? true : false,
							child_link = (checkChildLink) ? ((checkChildLinkInner) ? child[j].link.replace(/ /g,'-') : child[j].link) : '',
							child_isInner = (checkChildLinkInner) ? child[j].link.replace(/ /g,'-') : '',
							child_isBookmark = (checkChildLinkBookmark) ? ` attr-bookmark="${child_link.replace(/^\@/g,'')}"` : '',
							child_isFlink = (checkChildLinkFile) ? ` attr-flink="${child_link.replace(/^flink\@/gi,'')}"` : '',
							sub_link = (child_link) ? child_link : child[j].name.replace(/ /g, "-"),
							sub_target = (child[j].ltarget == '_blank') ? 'target="_blank"' : '',
							sub_name = (checkClnav) ? `<span class="cl-subnav-name">${child[j].name}</span>` : child[j].name,
							sub_active = '', 
							sub_link_text = '';

						if(checkChildLink && !checkChildLinkInner && !checkChildLinkBookmark) {							// link-type: link-out      ==> a[attr-link]
							if(checkBase64Encode(child_link)) sub_link = Base64.decode(child_link);
						}

						var page_arr = (b.VIEW) ? b.PAGE.split(',') : [b.PAGE];
						if (!active && (sub_link == page_arr[0] || link == parent[0])) {
							sub_active = 'active';
							active = 'open';
							if(!checkClnav && $('body').width() > 768) active = 'active';
						}	                    	

	                    if (child[j].display == 'on') {
							b.MENUCHECK.sub = true;
							if(!checkChildLink) b.MENULINK.push(child[j].name.replace(/ /g, '-'));
	                        sub_link_text = ($.inArray(sub_link,b.MENULIST) > -1) ? linkUrl+sub_link : (!regex2.test(sub_link) && regex.test(sub_link)) ? '//'+sub_link : sub_link;
							sub_menu += `
								<li class="${menu_class['subnavitem'] + sub_active}"><a href="${sub_link_text}" ${sub_target + child_isBookmark + child_isFlink}>${sub_name}</a></li>\r\n
							`;
	                        sub_show++;

							menuoption_child.push({
								'idx0': b.MENUOPTION.length,
								'idx1': menuoption_child.length,
								'name': child[j].name,
								'active': sub_active,
								'href': sub_link_text,
								'target': sub_target,
								'isinner': child_isInner,
								'isbookmark': child_isBookmark,
								'isflink': child_isFlink,
								'depth': 1,
							});
	                    }
	                }
	                sub_menu = sub_menu +'</ul>\r\n';
	                var caret = (checkSidebar) ? ' <i class="fa fa-caret-right fa-1" aria-hidden="true"></i>' : ' <i class="fa fa-caret-down fa-1" aria-hidden="true"></i>';
	                
					if (sub_show) {
                		var sub_menu_open = (typeof menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') != 'undefined' && menu.closest('.navbar-menu-'+b.SID).attr('data-submenu') == 'open' && active != 'open') ? 'open' : '';
						menu.append(`\r\n<li class="${menu_class['navitem'] + active + sub_menu_open} dropdown"><a href="${link_text}" class="dropdown-toggle" ${target + isBookmark + isFlink}>${name + caret}</a></li>\r\n`);
	                } else {
	                	menu.append(`\r\n<li class="${menu_class['navitem'] + active}"><a href="${link_text}" ${target + isBookmark + isFlink}>${name}</a></li>\r\n`);
	                }
	                if(sub_show) menu.find('.dropdown:last').append(sub_menu);
	            } else {
	            	menu.append(`\r\n<li class="${menu_class['navitem'] + active}"><a href="${link_text}" ${target + isBookmark + isFlink}>${name}</a></li>\r\n`);
	            } 

				b.MENUOPTION.push({
					'idx0': b.MENUOPTION.length,
					'name': obj[i].name,
					'active': active,
					'href': link_text,
					'target': target,
					'isinner': isInner,
					'isbookmark': isBookmark,
					'isflink': isFlink,
					'depth': 0,
					'children': menuoption_child,
				});

	            idx++;
	        }
		}


		// menu ver3 : fheader
		//              - Add #fixed-menu, #mobile-nav
		//              - Set mobile-design
		if ($('.el-menu > header').hasClass('cl-nav')) $.clnav.init();
		else if ($('header.navbar').hasClass('navbar-fheader')) $.fheader.init();

		if(	typeof b.VALIDPLAN != 'undefined' && b.VALIDPLAN && 
			typeof b.VALIDTYPE != 'undefined' && b.VALIDTYPE != 'PK'
		) {
			if(b.VALIDTYPE == 'SM') {
				$.umember.init(b.SITEUM,b.SITEUMLANG,b.SITEUMDISPLAY, function() { 
					$.psearch.init();
					$.shopping.init();
					$.slang.init(b.SLANG);
				});
			} else if(b.VALIDTYPE == 'BN') {
				$.umember.init(b.SITEUM,b.SITEUMLANG,b.SITEUMDISPLAY, function() { 
					$.slang.init(b.SLANG); 
				});
			} else {
				$.slang.init(b.SLANG);
			}
		} else {
			$.slang.init();
		}

		// menu ver3 : fheader
		//             - Set site page top padding
		//             - Set menu config btn position
		if ($('header.navbar').hasClass('navbar-fheader')) $.fheader.set();

	    $('header .navbar-nav').removeClass('hide').removeClass('preloading');
	    $('body,html').animate({scrollTop: 0}, 300,'easeInOutQuart');

	},
	syncUpdate : function($el,data) {
		$('#el-empty').empty().append($el.outerHTML());
		var $sync = $('#el-empty'),
			nodes = $sync.find('.item'),
			$sync_row = ($sync.find('.sync-option').length > 0) ? $sync.find('.sync-row') : $sync.find('.slick'),
            $sync_loop = $sync.find('[data-sync-loop="true"]'),
            checkSyncGalleryFrame = false,
            checkSyncHtmlReplace = false,
            sync_gallery = {},
            p = _this.b.RESOURCE + '/' + _this.b.SID + '/';

		if(typeof data.sync !='undefined' && typeof data.sync.list != 'undefined' && (data.sync.list).length) {
			$sync_row.empty();
			var nodes_count = nodes.length;
			$.each(data.sync.list, function(i,v) {
				var nodes_pos = i % nodes_count,
					$item = $(nodes[nodes_pos]);
				var imgbg_check = (typeof $item.find('.img-bg').attr('style') == 'undefined') ? false : true,
					href = '/' + v.page + '/view/' + v.seq,
					alink = (_this.b.PUBLISH) ? href : '/render' + href;

                switch(v.type) {
                    case "gallery":
                        var img = getServeImage(v.image,'0',p);
                        (v.mode == 'project') ?
                            $item.find('a').attr('href', alink) :
                            $item.find('a').attr('href', img).attr('data-gallery','').attr('data-title',v.title); 
                        break;
                    case "shopping":
                    	if(typeof data.sync.member_only[v.pid] != 'undefined' && data.sync.member_only[v.pid] == 'ON') {
                        	if(_this.b.UMEMBER.check_login == true) {
                        		$item.find('a').attr('href',alink);
                        	} else {
                        		$item.find('a').attr('href','javascript:member_only_item();');
                        	}
                        } else $item.find('a').attr('href',alink);
                        break;

                    case "lux":
                        $item.find('a').attr('href',(_this.b.PUBLISH) ? '/_product/' + v.seq : '/render/_product/' + v.seq);
                        break;
                }
                var brand_name = (v.brand_name != 'undefined' && v.brand_name && v.brand_name != '-') ? v.brand_name : '';
				$item.find('img').attr('src',v.image);
				$item.find('.brand').html(brand_name);
				$item.find('.name').html(v.title);
				$item.find('.caption').html(v.caption);

                if(v.type == 'gallery' && v.mode == 'gallery') {
                    checkSyncGalleryFrame = true;
                    sync_gallery.elsettings = v.elsettings;
                    sync_gallery.type = 'gallery';
                }
                if(typeof data.sync.member_only[v.pid] != 'undefined' && data.sync.member_only[v.pid] == 'ON' && _this.b.UMEMBER.check_login == false) {
                    $item.find('.price').addClass('hidden');
                    $item.find('.sale').addClass('hidden');
                    $item.find('.price-sale').addClass('hidden');
                } else {
	                (v.price != '') ? $item.find('.price').text('₩'+number_format(v.price)) : $item.find('.price').text('₩0');
					
                    if(v.sale_rate > 0) $item.find('.sale').removeClass('hide').text(v.sale_rate + '%');
                    else {
                        if($item.find('.sale').parent().hasClass('img-content')) $item.find('.sale').addClass('hide');
                        $item.find('.sale').text('');
                    }

					if(v.sale > 0 && v.sale > v.price) $item.find('.price-sale').text('₩'+number_format(v.sale));
	                else $item.find('.price-sale').addClass('hidden');
                }

                if(imgbg_check) $item.find('.img-bg').attr('style','background-image: url("' + v.image + '"');
				if($item.find('.sync-label-number').length > 0) $item.find('.sync-label-number').text(i+1);
                if(v.soldout) $item.find('.soldout').removeClass('hidden');
				$sync_row.append($item.outerHTML());

				if(data.type2 == 'imgpitem' && $sync_loop.length > 0) {
					if($sync_loop.children('li').eq(i).length == 0) $sync_loop.append($sync_loop.children('li').eq(0).clone().removeClass('active'));
					$sync_loop.children('li').eq(i).attr('data-idx',i);
				}
                checkSyncHtmlReplace = true;				
			});

            if(checkSyncGalleryFrame && typeof sync_gallery.type != 'undefined') {
                syncAppendGalleryFrame($sync, data.seq, sync_gallery.elsettings, sync_gallery.type, '');
            }
            if(checkSyncHtmlReplace) tag = $sync.html();			
		}
		var r = $('#el-empty > .element:eq(0)').html();
		$('#el-empty').empty();
		// console.log(r);
		return r;		
	},
	galleryUpdate : function(el,data) {
		// console.log(`galleryUpdate: el ${el}`);

		var _this = this;
		$('#el-empty').append($(data.source));
		$('#el-empty').find('[data-loop="true"]').html('');

		var checkGalleryListSample = false,
			checkGalleryListEmpty = true,
			source = data.source,
			nodes = $(source).find('[data-loop="true"]').children('.grid'),
			p = $('#el-empty').children(),
			g = p.clone().removeClass().addClass('galleryPL'+el.seq).addClass('gallery-popup'),
            i = [],
            view = $(source).find('[data-loop="true"]').data('view'),
            g_number = $(tag).find("[data-loop='true']").data('gallery-no'),
            total = (typeof data.total != 'undefined' && data.total) ? data.total : 0;

        $('#el-empty').after(g);
        $(g).after('<div class="gallery-empty"></div>');

        if(typeof view == 'undefined') view = 10;

        var g_settings = (typeof el.elsettings == 'undefined' || el.elsettings == '') ? {} : $.parseJSON(el.elsettings),
        	cookie_page = 1,
            cookie_view = view,
            cookie_gallery_category = '',
            is_gc_cookie = (typeof $.cookie('gallery-category-'+el.seq) != 'undefined' && $.cookie('gallery-category-'+el.seq).length > 0) ? true : false,
            block_lang = (typeof g_settings.blocklang != 'undefined') ? g_settings.blocklang : LANG,
            field_oldver = (typeof g_settings.field_oldver != 'undefined' && g_settings.field_oldver.length > 0) ? g_settings.field_oldver : [];
            field_disable = (typeof g_settings.field_disable != 'undefined' && g_settings.field_disable.length > 0) ? g_settings.field_disable : [];
        var cookie_gallery_orderby = 'recent';

		var category_onoff = (typeof g_settings.category_display != 'undefined' && g_settings.category_display) ? g_settings.category_display : 'OFF';
        var product_orderby_onoff = (typeof g_settings.product_orderby != 'undefined' && g_settings.product_orderby) ? g_settings.product_orderby : 'OFF';
        var align_rnd_onoff = (typeof g_settings.align_rnd != 'undefined' && g_settings.align_rnd) ? g_settings.align_rnd : 'OFF';
		if(el.mode != 'shopping') product_orderby_onoff = 'OFF';

		// var adultonly_onoff = (typeof g_settings.adult_only != 'undefined' && g_settings.adult_only) ? g_settings.adult_only : 'OFF';
        if(	category_onoff == 'ON' &&
        	typeof $.cookie('ci_goto-gallery') != 'undefined' && $.cookie('ci_goto-gallery') == el.seq &&
        	typeof $.cookie('ci_goto-gallery-cate') != 'undefined' && g_settings.category.indexOf('|' + $.cookie('ci_goto-gallery-cate') + '|') > -1 &&
        	typeof g_settings.category != 'undefined' && g_settings.category 
    	) {
        	cookie_gallery_category = $.cookie('ci_goto-gallery-cate');
        	is_gc_cookie = true;
        } else if($.cookie('loadmore-' + el.seq)) {
			cookie_page = $.cookie('loadmore-'+el.seq);
			cookie_gallery_category = (typeof $.cookie('gallery-category-'+el.seq) != 'undefined') ? $.cookie('gallery-category-'+el.seq) : '';
            cookie_gallery_orderby = (typeof $.cookie('gallery-orderby-' + el.seq) != 'undefined') ? $.cookie('gallery-orderby-' + el.seq) : '';
			cookie_view = cookie_page * view;
        } else { 
			var checkCateHomeHide = (category_onoff == 'ON' &&
									typeof g_settings.category != 'undefined' && g_settings.category && 
									typeof g_settings.category_home_hide != 'undefined' && g_settings.category_home_hide) ? true : false;
			if(checkCateHomeHide) {
				var gc = g_settings.category.replace(/\|/g,'').split(',');
				cookie_gallery_category = gc[0];
				is_gc_cookie = true;

				$.cookie('gallery-catehome-' + el.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
			}
        }

        if(el.seq == 'all_products') {
        	// cookie_page = (typeof $.cookie('gallery-page-all_products') !== 'undefined' && $.cookie('gallery-page-all_products') != '')? $.cookie('gallery-page-all_products') : 1;
        	cookie_gallery_category = setAllProductsCurrentCat(g_settings);
        	// cookie_view = cookie_page * view;
        } else {
        	if(!property.VIEW) $.removeCookie('gallery-page-all_products', { path: '/' });
        }

		$.cookie('gallery-page-' + el.seq, cookie_page, { path : '/', expires: 12 * 60 * 60 * 1000 });
		$.cookie('gallery-category-' + el.seq, cookie_gallery_category, { path : '/', expires: 12 * 60 * 60 * 1000 });
	    $.cookie('gallery-orderby-' + el.seq, cookie_gallery_orderby, { path: '/', expires: 12 * 60 * 60 * 1000 });
        $.removeCookie('loadmore-' + el.seq, { path : '/' });

        var checkLoadmoreInLoop = ($(source).find('[data-loop="true"] .loadmore-wrap').length) ? true : false,
            glm = $(source).find('.loadmore-wrap');

		var el_gh = $(source).find('.goption').attr('data-gh'),
			checkGalleryHeight = (typeof el_gh != 'undefined' && el_gh) ? true : false,
			checkGallerySVG = ($(source).find('.gimg-svg-wrap').length > 0) ? true : false,
			checkGFrameTitleOFF = (el.mode == 'gallery' && (typeof g_settings.gframe_title_visible != 'undefined' && g_settings.gframe_title_visible == 'OFF')) ? true : false;

		var param = (el.page=='index,template' && property.param.indexOf('/org/') == -1) ? property.param + '/org/' + el.page : property.param;
		var post_data = { g_mode: el.mode, visible: true, sfl: 'category', stx: cookie_gallery_category };

		if(el.seq == 'all_products') {
			post_data = { g_mode: el.mode, visible: true, sfl: 'orderby', stx: cookie_gallery_category };
		}

		var g_data = {
			'list' : property.CONTENTS['el' + el.seq]['list'],
			'total' : property.CONTENTS['el' + el.seq]['total']
		}

		var checkUseComment = checkUseCommentFunc(el.mode, el.eltag);
		var checkUseLike = checkUseLikeFunc(el.mode, el.eltag);
		
		$.each(g_data.list, function (idx, v) {
			i.push(v);
		});
		
		total = (typeof g_data.total.list_total != 'undefined') ? g_data.total.list_total : g_data.total;
		// total = (typeof g_data.total.list_total != 'undefined') ? g_data.total.list_total : 0;
		cookie_view = (cookie_view < total) ? cookie_view : total;

		if( total > 0 ) checkGalleryListEmpty = false;
		if( i.length>0 || (i.length==0 && is_gc_cookie) ) {
			var loop_count = nodes.length, item_index = 0, elem = [];
			$.each(g_data.list,function(index,v) {
				loop_pos = index%loop_count;
				c = nodes[loop_pos];
				var isTitle = (v.title.length > 0) ? true:false;
				$(c).find('.non_text').removeClass('non_text');

				if(el.mode != 'shopping') {
					if(v.title.length==0) $(c).find('.figure.title').removeClass('non_text').addClass('non_text');
					if(v.caption.length==0) $(c).find('.figure.caption').removeClass('non_text').addClass('non_text');
				}

				v.title = (v.title.length>0) ? v.title : $.lang[block_lang]['editor.block.gallery.sample.title'];
				v.caption = (v.caption.length>0) ? v.caption : $.lang[block_lang]['editor.block.gallery.sample.caption'];

				$(c).addClass('gallery-item').attr('data-index',index).attr('data-seq',v.seq);
				

				var vgsettings = (typeof v.gsettings != 'undefined' && v.gsettings) ? $.parseJSON(v.gsettings) : {},
					img_path = (typeof vgsettings['storage'] != 'undefined') ? vgsettings['storage'] : _this.b.RESOURCE + '/' + _this.b.SID + '/',
					img_original = (typeof vgsettings['storage'] != 'undefined') ? img_path + '1920/' : img_path;
				
				var folder = (typeof data.element.folder == 'undefined' || data.element.folder == 0) ? '' : data.element.folder + '/',
					src = getServeImage(v.image,data.element.folder,img_path),
					src_s0 = getServeImage(v.image,'0',img_path);
				if($(c).find('img').length > 0) $(c).find('img').attr('src',src);

				if(el.mode == 'shopping') {
					if($(c).find('img').length > 0) $(c).find('img').attr('alt',v.title);
				} else if(typeof v.alt != 'undefined') {
				    alt_replace	= v.alt.replace(/\s+|\n+/g, '-');  
      				alt_replace.replace(/-+/g, '-')	
					if($(c).find('img').length > 0) $(c).find('img').attr('alt',alt_replace);						
				}

				if($(c).find('.g-img').length > 0) $(c).find('.g-img').css('background-image', 'url('+src+')');
				if(checkGallerySVG) {
					var gimgSVG = $(c).find('.gimg-svg-wrap svg');
					gimgSVG.find('pattern').attr('id','gimgSvg_'+el.elname+'_'+index);
					gimgSVG.find('image').attr('xlink:href', src);
					gimgSVG.find('polygon').attr('fill', 'url(#gimgSvg_'+el.elname+'_'+index+')');							
				}

				var glink = (typeof vgsettings['glink'] != 'undefined' && vgsettings['glink']) ? vgsettings['glink'] : '',
					glink_target = (typeof vgsettings['glink_target'] != 'undefined' && vgsettings['glink_target']) ? vgsettings['glink_target'] : '';

				if(glink) {
					if(glink.match(/^\@/g) !== null) {															// link-type: link-bookmark ==> a[attr-bookmark]
						var bookmark_seq = glink.replace(/^\@/g,'');
						if(typeof _this.b.SETTINGS.blockBookmarkList == 'undefined' || typeof _this.b.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
							glink = '';
							glink_target = '';
						}
					} else if(glink.match(/^flink\@[0-9]/gi) !== null) {										// link-type: link-file     ==> a[attr-flink]
						glink_target = '';
					} else if($.inArray(glink.replace(/^\//g,'').replace(/ /g,'-'),_this.b.MENULIST) > -1) {	// link-type: link-menu     ==> a[data-user-link]
					} else {																					// link-type: link-out      ==> a[attr-link]
						if(checkBase64Encode(glink)) glink = Base64.decode(glink);
					}
				}

				$(c).find('a').removeAttr('data-gallery').removeAttr('data-user-link').removeAttr('attr-bookmark').removeAttr('attr-link').removeAttr('attr-flink');
				if (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON' && property['SITEUM'] >= 1) {
					$(c).addClass('gallery-item').addClass('nonePrice');
					$(c).find('a').attr('href', '#');
				} else {
					if(glink) {
						var glink_val = makeLinkUrl(glink, _this.b.ONE, _this.b.VIEW);
						$(c).find('a').attr('href',glink_val);

						if(glink.match(/^\@/g) !== null) {
							$(c).find('a').attr('attr-bookmark',glink.replace(/^\@/g,''));
						} else if(glink.match(/^flink\@[0-9]/g) !== null) {
							$(c).find('a').attr('attr-flink',glink.replace(/^flink\@/g,''));
						// IE ERROR_includes__H.20210603
						// } else if(_this.b.MENULIST.includes(glink.replace(/ /g,'-'))) {
						} else if($.inArray(glink.replace(/ /g,'-'),_this.b.MENULIST) > -1) {
							$(c).find('a').attr('data-user-link',glink_val);
						} else {
							$(c).find('a').attr('attr-link',glink);
						}
					} else {
						if (el.mode == 'gallery') {
							src_s0 = src_s0 + '?gpos='+v.pos;

							$(c).find('a').attr('href', src_s0);
							$(c).find('a').attr('data-gallery', '#gframe-' + el.seq);
						} else {
							if(el.seq == "all_products") {
								$(c).find('a').attr('href', v.product_url);
							} else {
								if(typeof URI == 'function') URI = '/';
								if(_this.b.LUX && el.mode == 'shopping') $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/_product/' + v.seq);
								else $(c).find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/' + _this.b.PAGE + '/view/' + v.seq);
							}
						}
					}
				}

				if(glink_target == '_blank') $(c).find('a').attr('target','_blank');
				else $(c).find('a').removeAttr('target');

				if(checkGFrameTitleOFF || !isTitle) $(c).find('a').attr('data-title', '');
				else $(c).find('a').attr('data-title', v.title);

				// if(adultonly_onoff == 'ON') $(c).addClass('adultonly');

				if(el.mode == 'shopping') {
					if($(c).find('.figure.basket').length == 0) {
						$(c).find('.figure').last().after('<div class="figure basket" data-oldver="true"><span class="basket-btn">장바구니 담기</span></div>');
					}
				}
								
				// caption
				var ftitle = $(c).find('h5.figure'),
					fcaption = $(c).find('p.figure').not('.comment'),
					fdatetime = $(c).find('.figure.datetime'),
					fhashtag = $(c).find('.figure.hashtag'),
					fbrand = $(c).find('.figure.brand'),
					fprice = $(c).find('.figure.price'),
					freview = $(c).find('.figure.review'),
					fcomment = $(c).find('.figure.comment'),
					flike = $(c).find('.figure.like'),
					fbasket = $(c).find('.figure.basket');

				if(fcomment.length < 1 && g_settings.comment_display == 'ON' && checkUseComment) {
					$(c).find('figcaption p.figure.caption').after('<p class="figure comment old-gl hide"><svg  viewBox="0 0 14 14" width="14" height="14"><path d="M7 1C3.13 1 0 3.24 0 6c0 1.66 1.14 3.13 2.89 4.04C2.71 11 2.23 12.38 1 13c0 0 3.09 0 5.19-2.04.27.03.54.04.81.04 3.87 0 7-2.24 7-5s-3.13-5-7-5zm0 9c-.25 0-.49-.01-.73-.03l-.45-.04-.32.31c-.6.58-1.31.97-1.98 1.23.17-.43.28-.86.35-1.25l.14-.73-.66-.34C1.88 8.39 1 7.21 1 6c0-2.17 2.75-4 6-4s6 1.83 6 4-2.75 4-6 4z"/></svg><span class="figure-comment-cnt"></span></p>');
					fcomment = $(c).find('.figure.comment');
				}

				if(flike.length < 1 && g_settings.like_display == 'ON' && checkUseLike){
					if (fcomment.length > 0) {
						if(index == 0) fcomment.after('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
						else fcomment.after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
					} else {
						if(index == 0) $(c).find('figcaption:not(.top) .figure:last-child').after('<div class="figure like old-gl" data-selector=".figure.like" data-font="true" data-title="like" data-ie-clamp="2,2,2"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
						else $(c).find('figcaption:not(.top) .figure:last-child').after('<div class="figure like old-gl"><svg viewBox="0 0 28 28" width="28" height="28"><path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path><path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path></svg><span class="figure-like-cnt">0</span></div>');
					}
					flike = $(c).find('.figure.like');
				}

				$(c).find('figcaption').removeClass('hide');
				
				if (v.title || v.caption) {
					var gallery_caption = v.caption;
					gallery_caption = gallery_caption.trim().replace(/\n/g,'<br />');
					
					ftitle.html(v.title);
					fcaption.html(gallery_caption);
					if(fdatetime.length > 0) fdatetime.text(v.datetime);
					if(fhashtag.length > 0) fhashtag.text(v.hashtag);
				}

				if(g_number) {
					var g_index = String(index + 1),
						g_num = g_index.padStart(g_number, '0');
					$(c).find('.figure.number').text(g_num);
				}

				if(fbrand.length > 0) {
					var fbrand_name = (typeof v.brand_name != 'undefined' && v.brand_name) ? v.brand_name : '';
					fbrand.html(v.brand_name);
				}

				if(el.mode == 'shopping' || el.seq == 'all_products') {
					fcomment.addClass('hide');
					flike.addClass('hide');

					v.price = typeof v.price != 'undefined' ? parseFloat(v.price) : 0;
					v.sale = typeof v.sale != 'undefined' ? parseFloat(v.sale) : 0;

					var checkPriceHidden = (typeof v.price_hidden != 'undefined' && v.price_hidden == 'ON') ? true : false,
						gallery_price = (v.price && !checkPriceHidden) ? v.price : 0,
						gallery_sale_price = (typeof v.sale != 'undefined' && v.sale > 0 && v.sale > v.price && !checkPriceHidden) ? v.sale : 0,
						gallery_sale_per = (typeof v.sale_per != 'undefined' && v.sale_per && !checkPriceHidden) ? v.sale_per+'%' : '',
						product_soldout = '품절',
						product_no_sale = (typeof g_settings.sh_soldout == 'string') ? g_settings.sh_soldout : '구매불가',
						product_status = '';
					if(v.status == 'off' && !checkPriceHidden) {
						product_status = '<span class="cl-sh-soldout">' + product_no_sale + '</span>';
					} else if(v.quantity_on == 'on' && v.quantity < 1 && !checkPriceHidden) {
						product_status = '<span class="cl-sh-soldout">' + product_soldout + '</span>';
					}

					$(c).find('.cl-sh-soldout').remove();
					if(product_status != '') $(c).attr('data-soldout',true);
					else $(c).removeAttr('data-soldout');

					$(c).find('.product-badge').remove();
					product_status += drawBadgeList(v.use_badge, data.badge_settings);

					$(c).find('.cl-sh-limit').remove();
					if(v.status == 'lim') {
                        if(v.sale_now == false) {
                            var product_limit = '<p class="cl-sh-limit">상품 구매 가능 기간이 아닙니다.</p>';
                            if(freview.length > 0) {
                                freview.after(product_limit);
                            } else {
                                $(c).find('figcaption:not(.top) .figure:last-child').after(product_limit);
                            }
                        }
                    }

					if($(c).find('ul.figure.price').length > 0) {
						// var price_off = (v.sale_price > 0 && v.sale_price > v.price) ? 100 - Math.floor((v.price / v.sale_price) * 100) : 0,
						//         off_str = (price_off > 0) ? price_off + '% ' : ''
						var off_str = (v.sale_rate > 0) ? v.sale_rate + '% ' : '';
						if(!_this.b.LUX) off_str = gallery_sale_per;
						//Ver2
						if(!checkPriceHidden) {
							$(c).find('ul.figure.price .price-val').html('￦' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
							$(c).find('ul.figure.price .price-val').removeClass('hide');

							if(gallery_sale_price > 0 && gallery_price < gallery_sale_price) {
								$(c).find('ul.figure.price .price-sale').html('￦' + gallery_sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));
								$(c).find('ul.figure.price .price-sale-per').html(off_str);
								$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').removeClass('hide');
								if(_this.b.LUX && (v.hashtag).indexOf('특가세일') > -1 && $(c).find('ul.figure.price .sp-price').length == 0) {
									$(c).find('ul.figure.price .price-sale').after('<li class="sp-price">특가세일</li>');
								}
							} else {
								$(c).find('ul.figure.price .price-sale, ul.figure.price .price-sale-per').addClass('hide').html('');
							}
							
							if(v.product_unit_str) {
								$(c).find('ul.figure.price').append(`<li class="price-unit-pricing">${v.product_unit_str}</li>`); // 단위당 가격
							}
						} else {
							$(c).find('ul.figure.price .price-val').html('￦0');
							$(c).find('ul.figure.price .price-val').addClass('hide');
						}
						if(el.seq == 'all_products' && checkPriceHidden) $(c).find('ul.figure.price').html('');
						if(product_status) $(c).find('ul.figure.price').append('<li>'+product_status+'</li>');

						var badge_size = getBadgeSize(data.badge_settings);
						$(c).find('.cl-sh-soldout').removeClass('badge-small badge-medium badge-large');
						$(c).find('.cl-sh-limit').removeClass('badge-small badge-medium badge-large');
						if(badge_size) {
							$(c).find('.cl-sh-soldout').addClass(badge_size);
							$(c).find('.cl-sh-limit').addClass(badge_size);
						}
					} else {
						//Ver1
						if(fprice.length == 0) fprice = fcaption;
						if(checkPriceHidden) fprice.html('');
						else fprice.html('<span class="figure-krw">￦</span>' + gallery_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') + product_status);
					}

					if($(c).find('ul.figure.review').length > 0) {
						var gallery_review = (v.review_onoff && v.review_cnt) ? v.review_cnt : 0;
						if(gallery_review > 0) {
							$(c).find('ul.figure.review, ul.figure.review li').removeClass('hide');
							$(c).find('ul.figure.review .figure-review-cnt').html(gallery_review);
							$(c).find('ul.figure.review .figure-review-score').html(v.review_score);
						} else {
							$(c).find('ul.figure.review, ul.figure.review li').addClass('hide');
							$(c).find('ul.figure.review .figure-review-cnt, ul.figure.review .figure-review-score').html('');
						}
					}

					if(fbasket.length > 0) {
						var checkOldBlock = ($(c).find('.figure.basket[data-oldver="true"]').length > 0) ? true : false,
							checkOldverBasket = (typeof field_oldver != 'undefined' && field_oldver && field_oldver.indexOf('basket') > -1) ? true : false,
							checkDisabledBasket = (typeof field_disable != 'undefined' && field_disable && field_disable.indexOf('basket') > -1) ? true : false;
						if(v.basket_off) fbasket.addClass('cannotby hide');
						else if(el.seq == 'all_products') fbasket.removeClass('hide');
						else if(checkDisabledBasket || (!checkDisabledBasket && checkOldBlock && !checkOldverBasket)) fbasket.addClass('hide');
						else if(property.VALIDTYPE != 'SM') fbasket.addClass('hide');
						else fbasket.removeClass('hide');
					}

				} else {
					fbrand.addClass('hide');
					fprice.addClass('hide');
					freview.addClass('hide');
					fbasket.addClass('hide');

					if(el.mode == 'project' && fcomment.length > 0 && typeof v.comment_cnt != 'undefined' && v.comment_cnt > 0 && g_settings.comment_display == 'ON') {
						fcomment.find('.figure-comment-cnt').html(v.comment_cnt);
						if(field_disable !== undefined && field_disable.indexOf('comment') > -1) {
							fcomment.addClass('hide');
						} else {
							fcomment.removeClass('hide');
						}
					} else {
						fcomment.addClass('hide');
					}

					if(flike.length > 0 && g_settings.like_display == 'ON' && checkUseLike) {
						flike.removeAttr('data-like').removeClass('hide active');
						if(v.like !== undefined) {
							flike.find('.figure-like-cnt').html(v.like.cnt);
							if(v.like.own) flike.attr('data-like', v.seq).addClass('active');
						}
						if(field_disable !== undefined && field_disable.indexOf('like') > -1) {
							flike.addClass('hide');
						} else {
							flike.removeClass('hide');
						}
					} else {
						flike.addClass('hide');
					}
				}
				
				if(checkUseLike == false) flike.html('');

				// $(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
				if(el.mode == 'gallery') {
					if(index < data.view) {
						$(p).find('[data-loop="true"]').append($(c)[0].outerHTML); 
					} else {
						$(c).find('figure').remove();
						$(g).find('[data-loop="true"]').append($(c)[0].outerHTML);
					}
					if (total == 2) {
						$(c).find('figure').remove();
						$('.gallery-empty').append($(c)[0].outerHTML);
					}
				} else {
					$(p).find('[data-loop="true"]').append($(c)[0].outerHTML);
				}
			});
		} else {
			checkGalleryListSample = true;
			if(_this.b.LUX) {
				category_onoff = 'ON';
				checkGalleryListSample = false;
			}
			if(el.mode=='project' && _this.b.TEMPLATE == false) {
				nodes.addClass('gallery-item');
				nodes.find('a').attr('href', ((_this.b.URL=='/') ? '' : _this.b.URL) + '/' + _this.b.PAGE + '/view/template').removeAttr('data-gallery').find('img').attr('data-index',0);
			}
			if(_this.b.TEMPLATE !== false) {
				if(g_settings.comment_display != 'ON' || (field_disable !== undefined && field_disable.indexOf('comment') > -1)) nodes.find('.figure.comment').addClass('hide');
				else nodes.find('.figure.comment').removeClass('hide');
				if(g_settings.like_display != 'ON' || (field_disable !== undefined && field_disable.indexOf('like') > -1)) nodes.find('.figure.like').addClass('hide');
				else nodes.find('.figure.like').removeClass('hide');
			}
			$(p).find('[data-loop="true"]').append(nodes);
		}
		if(checkLoadmoreInLoop) $(p).find('[data-loop="true"]').append(glm);

        var tag = $(p)[0].outerHTML,
        	$galleryEL = $('.element[data-id="' + el.seq + '"]');

		if (el.mode == 'gallery' && total == 2) {
			$.each($('.gallery-empty').find('.gallery-item'), function(i,v) {
				$(g).find('[data-loop="true"]').append(v);
			});
		}
    	
		if (el.mode == 'gallery' && total) tag = appendGalleryFrame($(tag), el.seq, g_settings, '', el.elcss);
		$galleryEL.html($(tag).html()).removeClass('preloading');

		$('#el-empty').empty();
		$('.gallery-empty').remove();

		var $tag = $galleryEL.find('.shop-filter-header');

		if($tag.length) shopHeaderDisplay($tag,data);

		$galleryEL.attr('data-category',category_onoff);
		$galleryEL.attr('data-product-orderby', product_orderby_onoff);
		$galleryEL.attr('data-align-rnd', align_rnd_onoff);
		
		if(category_onoff == 'ON' || product_orderby_onoff == 'ON') {
			loadGalleryCategoryBlock($galleryEL,el.seq,g_settings);

			if(!checkGalleryListSample) {
				$galleryEL.find('.empty-txt').remove();
				$galleryEL.find('.container:not(.fh-container),[data-loop="true"]').removeClass('empty');
				if(checkGalleryListEmpty) {
					var empty_info = (el.seq == 'all_products') ? $.lang[LANG]['editor.gallery.product.empty.list'] : $.lang[LANG]['editor.gallery.category.empty.list'],
						empty_info = (_this.b.LUX) ? $.lang[LANG]['editor.gallery.product.empty.list'] : empty_info,
						gallery_empty_str = '<div class="col-xs-12 col-sm-12 col-md grid empty-txt">' + empty_info + '</div>';
					if(el.feature=='masonry') {
						$galleryEL.find('.container:not(.fh-container)').removeAttr('style').addClass('empty').append(gallery_empty_str);
					} else {
						$galleryEL.find('[data-loop="true"]').addClass('empty').empty().append(gallery_empty_str);
					}
				}
			}
		}

		if($galleryEL.find('.goption[data-gcol]').length > 0) {
			var gOption = $galleryEL.find('.goption[data-gcol]'),
				gcol = gOption.attr('data-gcol'),
				gcol_t = gOption.attr('data-gcol-t'),
				gcol_m = gOption.attr('data-gcol-m');

			if(typeof gcol_t == 'undefined') { gOption.attr('data-gcol-t',gcol); gcol_t = gcol; }
			if(typeof gcol_m == 'undefined') { gOption.attr('data-gcol-m',gcol_t); }
		}

		refreshGalleryField($galleryEL,g_settings);

		// gallery option - gh
		if ($galleryEL.find('.goption[data-gh]').length > 0) refreshGalleryHeight(el.elname);

		var $glmBtnWrap = $galleryEL.find('.loadmore-wrap'),
			$glmBtn = $galleryEL.find('.loadmore-wrap .gallery-loadmore'),
			checkLoadmore = (total > view && total > cookie_view && !checkGalleryListEmpty) ? true : false,
			glm_lang = LANG;

		if(typeof g_settings.loadmore_lang != 'undefined' && g_settings.loadmore_lang && $.inArray(g_settings.loadmore_lang.toLowerCase(), ['ko','en']) > -1) glm_lang = g_settings.loadmore_lang.toLowerCase();
		else if(typeof block_lang != 'undefined' && $.inArray(block_lang, ['ko','en']) > -1) glm_lang = block_lang;
		var glm_txt = $.lang[glm_lang]['config.loadmore'];

		if($glmBtnWrap.length == 0) {
			// gallery loadmore btn - default (ver1)
			if(checkLoadmore) {
				var glm_class = (el.feature=='masonry') ? 'gallery-loadmore masonry-layout' : 'gallery-loadmore',
				glm_btn = '<div class="' + glm_class + '" data-loadmore="true" data-selector=".gallery-loadmore" data-total="' + total + '" data-id="' + el.seq + '" data-page="' + (Number(cookie_page)+1) + '" data-view="' + view + '" data-folder="' + el.folder + '" data-mode="' + el.mode + '">' + glm_txt +' &nbsp;(<span class="display">' + cookie_view + '</span> / ' + number_format(total) + ')</div>';

				if($galleryEL.find('.gallery-loadmore').length > 0) $galleryEL.find('.gallery-loadmore').replaceWith(glm_btn);
				else $galleryEL.append(glm_btn);
			} else $galleryEL.find('.gallery-loadmore').remove();

		} else {
			// gallery loadmore btn - custom (ver2)
			if(checkLoadmore) {
				if(el.feature=='masonry') $glmBtn.addClass('masonry-layout');
				else $glmBtn.removeClass('masonry-layout');
				$glmBtn.attr('data-loadmore','true').attr('data-id',el.seq).attr('data-total',total).attr('data-page',Number(cookie_page)+1).attr('data-view',view).attr('data-folder',el.folder).attr('data-mode',el.mode);
				$glmBtn.find('.label').text(glm_txt);
				$glmBtn.find('.display .view').text(cookie_view);
				$glmBtn.find('.display .total').text(total);
				$glmBtnWrap.removeClass('hide').fadeIn();
			} else {
				$glmBtnWrap.fadeOut().addClass('hide');
				$glmBtn.removeAttr('data-loadmore').removeAttr('data-id').removeAttr('data-total').removeAttr('data-page').removeAttr('data-view').removeAttr('data-folder').removeAttr('data-mode').removeClass('masonry-layout');
				$glmBtn.find('.label').text(glm_txt);
				$glmBtn.find('.display .view').text('0');
				$glmBtn.find('.display .total').text('0');
			}
		}

		

		if(el.seq == 'all_products') {
			if(property.ONE) $galleryEL.addClass('link-to-전체상품');
			loadAllproductSort($galleryEL, g_settings, el.total.list_total);
		}
        if(el.feature=='masonry') this.refreshMasonry(el.elname);
		if($galleryEL.has('input.gjs').length) setGalleryJS('load-loop',$galleryEL);
	},
	forumUpdate : function(pid,page_num,view,page,data) {
		if(page_num > 1) {
			$.forum.init(pid, page, view, page_num,'', '', '');
		} else {
			$.forum.update(pid, page_num, view, page, '', '', '',data);
		}
	},
	refreshMasonry : function(el) {
	    var $container = $('.'+el+' .container');
	    $container.imagesLoaded(function () {

	        $container.masonry({
	            itemSelector: '.grid',
	            columnWidth: '.grid'
	        });
	        $container.masonry();

	        $container.find('img').off('load.'+el).on('load.'+el, function () {
	            $container.masonry();
	        });
	    });		
	},
	displayComment : function() {
		var checkUrl = this.b.PAGE.split(','),
			type = (checkUrl[0] == 'forum') ? 'F' : 'P',
			check_view_empty = (this.b.VIEW && this.b.COUNT == 1 && $('.error_404.element[data-name="error_404"]').length == 1) ? true : false;
		if(type == "P" && (this.b.COUNT == 0 || check_view_empty)) {
			$('.error_404.element[data-name="error_404"] *[data-lang]').each(function() {
				$(this).html($.lang[LANG][$(this).attr('data-lang')]);
			});
			return false;
		}

	    var option = (this.b.PARENT.settings) ? jQuery.parseJSON(this.b.PARENT.settings) : {};  

	    if(type == 'F') {
	    	var fv_settings = {};
		    $.ajax({
		    	url: '/fm/fmConfig',
				dataType: 'json',
				type: 'POST',
				data:  { id : this.b.VIEW },
				async: false,
				cache: false,
				success: function (fr_data) {
					var fmConf = fr_data.config;
					var comment_display = 'OFF';
					
					if(fmConf.fm_settings == null || typeof fmConf.fm_settings.comment_display == 'undefined') {
						comment_display = (typeof fmConf.elsettings.comment_display == 'undefined')? 'OFF': fmConf.elsettings.comment_display;
					} else {
						comment_display = fmConf.fm_settings.comment_display;
					}
					
					fv_settings = {comment_display : comment_display}
				}
			});
		    
		    if(fv_settings.comment_display == 'OFF') return false;
	    } else {
	    	if(typeof option.comment_display == 'undefined' || !option.comment_display || option.comment_display=='OFF') return false;
	    }
	     
	    $.comment.init();
	},
	loaded : function() {
		var b = _this.b;
		if($('body').width() <= 768 && $('.dsgn-body').hasClass('sidebar')) {
			if($('header.navbar').hasClass('sidebar')) {
				cssSidebar('off');
			}
			//$('.dsgn-body').removeClass('sidebar').addClass('removed-sidebar');
		} else if ($('body').width() > 768 /*&& $('.dsgn-body').hasClass('removed-sidebar')*/) {
			if($('header.navbar').hasClass('sidebar')) {
				cssSidebar('on');
			}
			//$('.dsgn-body').removeClass('removed-sidebar').addClass('sidebar');
		}

		$('.carousel').live('click',function(){
		    $('.carousel').carousel('cycle');
		});

		$('.carousel').live({
			click: function() {
				$('.carousel').carousel('cycle');
			},
			hover:  function(){
				$('.carousel').carousel('cycle');
			}
		});

        $('.carousel').carousel({
        	pause: 'none'
        });

        $('[data-fixed-width]').each(function() {
            $(this).css('width',$(this).attr('data-fixed-width')+'px');
        });
        
        SCREEN = getScreen();
        var targetUrl = document.URL,
        	isMoveLink = targetUrl.match(/#/g);

        $('.menu-logo-top').show();

    	if(typeof $.cookie('gallery-item') != 'undefined' && b.VIEW == '') {
    		moveGallery($.cookie('gallery-item'));
    	} else if(typeof $.cookie('forum-item') != 'undefined' && b.VIEW == '') {
    		// console.log('loaded', 'fm_view', $.cookie('forum_content_view'));	
    		if(typeof $.cookie('forum_content_view') != 'undefined'){
                var fm_view = $.cookie('forum_content_view');
                var fv = (fm_view !== undefined && fm_view)? fm_view.split('&'):array();
                var pid = (fv)? fv[0]:'';
                var row_id = (fv)? fv[1]:'';

                setTimeout(function(){
                	scrollToBlock('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]', 1000);
                }, 500);
    			$.removeCookie('forum-item', { path : '/' });

                $('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]').click();
            } else {
            	scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"]', 1000);
    			$.removeCookie('forum-item', { path : '/' });
            }
    	}   

    	if($('body').width() > 768) {
    		$('.form-date').attr('type','text');
    		$('.form-date').attr('maxlength','2');
    		$('.date-yyyy').attr('maxlength','4');
    	}

        $.modalOFF();
	},
	loadPage : function(page) {

	}
}

var aosAddblock = function(site_settings,settings,$el) {
	if($el.is('[data-type="gallery"][data-type2="premium"]') || $el.has('input.gjs').length || ($el.is('[data-type="contact"][data-type2="franchise bar"]') && typeof settings.bottom_fix != 'undefined' && settings.bottom_fix == 'ON')) {
		$el.attr('data-aosinfo',false);
		return false;
	}

	var block_aos_site =  (typeof site_settings.block_aos != 'undefined' && site_settings.block_aos) ? site_settings.block_aos : {},
		block_aosAll_site =  (typeof block_aos_site['all'] != 'undefined' && block_aos_site['all']) ? block_aos_site['all'] : {},
		aos_time_site = (typeof block_aosAll_site.t != 'undefined' && block_aosAll_site.t) ? block_aosAll_site.t : '',
		aos_motion_site = (typeof block_aosAll_site.m != 'undefined' && block_aosAll_site.m) ? block_aosAll_site.m : '',
		aos_duration_site = (typeof block_aosAll_site.d != 'undefined' && block_aosAll_site.d) ? block_aosAll_site.d : '700';

	var block_aos_page =  (typeof settings.block_aos != 'undefined' && settings.block_aos) ? settings.block_aos : {},
		aos_time_page = (typeof block_aos_page.t != 'undefined' && block_aos_page.t) ? block_aos_page.t : '',
		aos_motion_page = (typeof block_aos_page.m != 'undefined' && block_aos_page.m) ? block_aos_page.m : '',
		aos_duration_page = (typeof block_aos_page.d != 'undefined' && block_aos_page.d) ? block_aos_page.d : '700';


    if(block_aos_site && (aos_time_site > aos_time_page) && aos_motion_site!='no-motion' && 
    	$('body').find('.menu-lock-block').length<1 && $('body').find('.site-lock-block').length<1) { 
        $el.attr('data-aos',aos_motion_site)
        	.attr('data-aos-duration',aos_duration_site)

    	if(aos_motion_site == 'fade-zoom-in' || aos_motion_page =='fade-zoom-in') {	            
	    	$el.attr('data-aos-easing','ease-in-back');
		}
		isAosBlock = true;
		$el.attr('data-aosinfo',true);
    } else {
        if($.isEmptyObject(block_aos_page) == false && (aos_time_site < aos_time_page) && aos_motion_page!='no-motion' && 
        	$('body').find('.menu-lock-block').length<1 && $('body').find('.site-lock-block').length<1) {
            $el.attr('data-aos',aos_motion_page)
            	.attr('data-aos-duration',aos_duration_page);
        	if(aos_motion_site == 'fade-zoom-in' || aos_motion_page =='fade-zoom-in') {	            
		    	$el.attr('data-aos-easing','ease-in-back');
			}
        	isAosBlock = true;
        	$el.attr('data-aosinfo',true);
        } else $el.attr('data-aosinfo',false);
    }

	if(isAosBlock) {
		$('body,html').addClass('aos-height aos-overflowX');
	} else {
		$('body,html').removeClass('aos-height aos-overflowX');
	}
}

var mobileWebfnavCheck = function(vpmode) {
	var checkFnav = ($('.fnav').length > 0 && vpmode=="mobile_web") ? true : false,
		WebType = isMobile();
                
	if(checkFnav && WebType) {
		$('.fnav.fnav-mobile-fnav').css('margin-bottom','53px');
		$('.element.el-footer').css('margin-bottom','100px');
	} else {
		$('.mobilepc_ch').css('margin-bottom','0px');
		$('.element.el-footer').css('margin-bottom','0px');
	}	
	
	if(WebType) {
		$('.element.el-footer').addClass('mpcwebheight');	
		$.mpcWeb.mpcMusicandGoTop(checkFnav,vpmode); 
	}
}

var setlimitdiskPopup = function() {
	var icon = '<i class="site-space-icon fa fa-exclamation-circle"></i>',
		str = '<div class="site-space-disk">\
					<p>'+$.lang[LANG]['plan.disk-space.popup.limit.contents']+'</p>\
				</div>\
				';

	$(this).showModalFlat(icon + $.lang[LANG]['plan.disk-space.popup.limit.title'], str,false,false).addClass('flat-site-spacelimit-modal');
	$('.modal-backdrop.in').css('opacity','0');
}

var setSitePopup = function() {
    if(typeof property.SETTINGS != 'undefined' && property.SETTINGS.showPopup === true && typeof property.SETTINGS.sitePopup != 'undefined' && property.SITELOCK != 'true') {
        sitePopupOpen();
    }
}

var sitePopupOpen = function(idx,data) {
	var site_popup = (typeof data != 'undefined' & data) ? data : new Array();
	if(site_popup.length == 0)  site_popup = (typeof property.SETTINGS.sitePopup != 'undefined' && property.SETTINGS.sitePopup) ? property.SETTINGS.sitePopup : site_popup;
	if(site_popup.length > 0) {
        $('.refresh-popup').show().removeAttr('style');
        var isShow = true;

		if(typeof idx != 'undefined') {
			if($('#'+property.SID+'Popup'+idx).length == 0) isShow = false;
			else $('#'+property.SID+'Popup'+idx).fadeIn();
		} else {

			if($('.site-popup .modal-popup').length > 0) { 
				$('.site-popup .modal-popup').fadeIn();
			} else { 
				isShow = false; 
			}
		}

		if(!isShow) {
	        var modal = $(this).showPopupModal(site_popup,property.SID);
	        return modal;
	    }
	}
}

var sitePopupResize = function() {

	if($('.popup').find('.modal-popup').length == 0) return false;
	
	var img_w = new Array(),
		total_w = 0,
		add_w = 0,
		d_m = ($('.popup-modal').hasClass('popupimg-overflow-y')) ? 30 : 15;
		d_top = $('.header.el-menu').outerHeight() + 15,
		d_left = 0,
		x = 0, y = 0, y_r = 0;

	$('.modal-popup').each(function(i) {
		if($(this).css('display') != 'none') {
			img_w[i] = $(this).width();
			total_w += img_w[i] + d_m;
		}
	});


	var isOverflow = ($('.dsgn-body').width() < (Number($('.popup-modal').children().eq(0).css('left').replace('px',''))+total_w)) ? true : false,
		display_i = -1;

	if(isOverflow) { $('.popup-modal').addClass('popupimg-overflow-y');
	} else { $('.popup-modal').removeClass('popupimg-overflow-y'); }

	$('.modal-popup').each(function(i) {
		if($(this).css('display') != 'none') {
			display_i++;

			if(isOverflow) {
				x = (display_i==0) ? d_top : d_top + (display_i*30);
				y = d_left + ((display_i+1)*30);
				y_r = 120 - y;

				img_w[i] = 'auto';
			} else {
				d_left = ($('.dsgn-body').width() - total_w)/2;

				x = d_top;
				y = d_left + add_w + (i*15);
			}
			add_w = add_w + $(this).width();

			var css_val = (isOverflow) ? {'top': x +'px', 'left': y+'px', 'right': y_r+'px', 'margin-left': '0px', 'width': img_w[i], 'max-width': $(this).width()} : {'top': x +'px', 'left': y+'px' , 'width': img_w[i]};
			$(this).css(css_val);
		}
	});

}


var activeEL = function(el) {
    if(typeof el == 'undefined' || el=='') return;
    // header_fixed = $('header.navbar').height();
    // var offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed;
    // $('body').scrollTo('.'+el,0,{offset:offset});
   	scrollToBlock('.'+el);
}

var setLoginoutNav = function (sid, callback) {
	$('.creatorlink-header').remove();
	$('#tpl-menu li.loginout').remove();
	var str = '<div class="creatorlink-header">\n';
	str = str + '<div class="logo-text col-md-4 col-sm-6">\n';
	str = str + '	<a href="http://creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/site_creatorlink_logo.png" alt="" /></a>\n';
	str = str + '</div>\n';
	str = str + '<div class="data-site col-md-4 col-sm-6 col-xs-6">\n';
	str = str + '	<ul>\n';
	str = str + '		<li class="profile-img"></li>\n';
	str = str + '		<li><span class="text">' + sid + '</span></li>\n';
	str = str + '	</ul>\n';
	str = str + '</div>\n';
	str = str + '<div class="data-user col-md-4 col-sm-6 col-xs-6">\n';
	str = str + '	<ul class="pull-right">\n';
	str = str + '		<li class="profile-img"></li>\n';
	str = str + '		<li><span class="caret"></span></li>\n';
	str = str + '	</ul>\n';
	str = str + '	<div class="message"></div>\n';
	str = str + '</div>\n';
	str = str + '</div>\n';
	str = str + '\n';
	str = str + '\n';
	$('.header.el-menu').before(str);
	var top = ($('header').hasClass('transparent')) ? '0' : '55px';
	$('.header.el-menu').css('top',top);
	if(top == '0') $('.creatorlink-header + .popover + .fixed-position').css('top','0');

	if(typeof callback == 'function') callback();
}

var getProfileAuthor = function(sid,img) {
	var imgstr = (img == 'https://storage.googleapis.com/i.addblock.net/member/profile_default.jpg') ? 'https://storage.googleapis.com/i.addblock.net/member/profile_default_top.png' : img;
	var str = 		'<span class="hexagon">\n';
		str = str + '	<svg viewBox="0 0 32 32">\n';
		str = str + '		<pattern id="pfimg-" + sid +"" patternUnits="userSpaceOnUse" width="32" height="32">\n';
		str = str + '			<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""+imgstr+"" x="-2px" y="-2px" width="36" height="36"></image>\n';
		str = str + '		</pattern>\n';
		str = str + '		<polygon points="16 0 30 8 30 24 16 32 2 24 2 8" fill="url(#pfimg-" + sid +")"></polygon>\n';
		str = str + '	</svg>\n';
		str = str + '</span>\n';
	$('.data-site .profile-img').append(str);
}

var getProfileMember = function() {
	$.getJSON('/template/checkLogin', function(data) {
		// if(!data.user) { }
		var imgstr = (data.myimg == 'https://storage.googleapis.com/i.addblock.net/member/profile_default.jpg') ? 'https://storage.googleapis.com/i.addblock.net/member/profile_default_top.png' : data.myimg;
		var str = 		'<span class="hexagon">\n';
			str = str + '	<svg viewBox="0 0 32 32">\n';
			str = str + '		<pattern id="pfimg-" + data.user +"" patternUnits="userSpaceOnUse" width="32" height="32">\n';
			str = str + '			<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""+imgstr+"" x="-2px" y="-2px" width="36" height="36"></image>\n';
			str = str + '		</pattern>\n';
			str = str + '		<polygon points="16 0 30 8 30 24 16 32 2 24 2 8" fill="url(#pfimg-" + data.user +")"></polygon>\n';
			str = str + '	</svg>\n';
			str = str + '</span>\n';
		$('.data-user .profile-img').append(str);
		$('.data-user .profile-img').addClass('user-'+data.name);
		$('.data-user .user-name').append('<span>'+data.name+'</span>');
		// $('.data-user .logoutlink').before('<span>You&apos;re logged in as '+data.name+' </span>');

		var str3_mysite = '';
		if($('.data-site ul li span.text').text() == data.sid) {
			$('.data-site').text('');
			var isNewmessage = (data.newCount == 0 ) ? false : true;
			var str2 = 		'<ul class="sub-menu pull-right">\n';
				str2 = str2 + '	<li class="newCount">\n';
				str2 = str2 + '		<a href="/message/lists"><i class="fa fa-envelope"></i>\n';
				if(isNewmessage) str2 = str2 + '<span class="badge">"+data.newCount+"</span>\n';
				str2 = str2 + '</a>\n';
				str2 = str2 + '	</li>\n';
				str2 = str2 + '</ul>\n';
			$(".data-user .message").append(str2);
		} else {
			str3_mysite = '		<div class="item"><a href="http://'+data.sid+'.creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_mysite.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_mysite_active.png" class="active"/>'+ $.lang[LANG]['header.mysite'] + '</a></div>\n';
		}

		var str3 = 		'<div class="popover bottom" id="pop"+data.name+"">\n';
			str3 = str3 + '	<div class="arrow"></div>\n';
			str3 = str3 + '	<div class="popover-content">\n';
			str3 = str3 + '		<div class="user-name">"+data.name+"</div>\n';
			str3 = str3 + str3_mysite;
			str3 = str3 + '		<div class="item"><a href="http://creatorlink.net"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_dashboard.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_dashboard_active.png" class="active"/>'+ $.lang[LANG]['header.dashboard'] + '</a></div>\n';
			str3 = str3 + '		<div class="item"><a href="/mypage" ><img src="https://storage.googleapis.com/i.addblock.net/main/icon_acc.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_acc_active.png" class="active"/>'+ $.lang[LANG]['header.mypage'] +'</a></div>\n';
			str3 = str3 + '		<div class="item"><a href="/profile/myboard" ><img src="https://storage.googleapis.com/i.addblock.net/main/icon_qna.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_qna_active.png" class="active"/>'+ $.lang[LANG]['header.cts'] +'</a></div>\n';
			str3 = str3 + '		<div class="item user-logout"><a href="/member/login/out" class="logoutlink"><img src="https://storage.googleapis.com/i.addblock.net/main/icon_logout.png"/><img src="https://storage.googleapis.com/i.addblock.net/main/icon_logout_active.png" class="active"/>'+ $.lang[LANG]['header.logout'] + '</a></div>\n';
			str3 = str3 + '	</div>\n';
			str3 = str3 + '	</div>\n';
		$('.creatorlink-header').after(str3);

	});
}

var pageHeight = function() {
    $('.page-comments').css('margin-top','0px');
    $('.el-footer').css('margin-top','0px');
    var docHeight = $('.dsgn-body').height();
    $('.dsgn-body').wrapInner('<div class="dsgn-body-wrap"></div>');
    var dsgnHeight = $('.dsgn-body-wrap').height();
    var diff = docHeight - dsgnHeight;
    $('.dsgn-body > .dsgn-body-wrap').contents().unwrap();
    return (diff>0) ? diff : 0;
}

var setHeight = function(height) {
	if(typeof property.VIEW == 'undefined' || property.VIEW == "") return false;
    if(height>0) {
        height = (typeof MODE == 'undefined') ? height : height-35;
        if($('.page-comments').length) {
            $('.page-comments').css('margin-top',height+'px');
		} else if($('.page-bottomlist').length) {
			$('.page-bottomlist').css('margin-top',height+'px');
        } else if($('.el-footer').length) {
            $('.el-footer').css('margin-top',height+'px');
        }
    }
}

var appendGalleryFrame = function(tpl, seq, elsettings, bt_type, elcss) {
	var bt_type = (bt_type) ? bt_type : 'gallery';
	if(typeof property.TEMPLATE == 'undefined' || property.TEMPLATE == '') tpl.find('[data-gallery]').attr('data-gallery','#gframe-' + seq);

	var settings = (typeof elsettings == 'object') ? elsettings : {};
    if($.isEmptyObject(settings)) settings = (typeof elsettings != 'undefined' && ($.isEmptyObject(elsettings) === false)) ? $.parseJSON(elsettings) : {};

	var img_onoff = (settings != null && typeof settings.img_original_display != 'undefined' &&  settings.img_original_display) ? settings.img_original_display : 'ON',
		title_onoff = (settings != null && typeof settings.gframe_title_visible != 'undefined' && settings.gframe_title_visible == 'OFF') ? false : true,
		autoplay = (settings != null && typeof settings.gframe_autoplay != 'undefined' && settings.gframe_autoplay == 'ON') ? true : false,
		interval = (settings != null && typeof settings.gframe_interval != 'undefined' && settings.gframe_interval) ? settings.gframe_interval : 5000,
       	like_onoff = (settings != null && typeof settings.like_display != 'undefined' && settings.like_display == 'ON') ? settings.like_display : 'OFF';


	tpl.find('[data-gallery]').attr({'data-img-original':img_onoff, 'data-gallery-title':title_onoff, 'data-gallery-like':like_onoff});
	if(!title_onoff) {
		tpl.find('[data-gallery]').attr({'data-title':''});
	}

	galleryFrame(seq,autoplay,interval,bt_type);

    if(like_onoff == 'ON') galleryFrameCss(seq, settings);
	
	return tpl;
}

var galleryFrameCss = function(seq, elsettings) {
    var elname = '.userEL' + seq;
    var gframe = '#gframe-' + seq;
    if($('.gframeCss' + seq).length == 0) $('#dsgn-body').after('<style class="gframeCss' + seq + '"></style>');

    var like_fill = (elsettings.gl_like_color !== undefined)? elsettings.gl_like_color : ((property.PARENT.mode=='project') ? '#505050':'#8e9095');
    var likeActive_fill = (elsettings.gl_likeActive_color !== undefined)? elsettings.gl_likeActive_color:'#ee445f';
    var galleryStyle = '';
    
    galleryStyle += gframe+'.blueimp-gallery .gallery-like > svg{fill:'+like_fill+';}\n';
    galleryStyle += gframe+'.blueimp-gallery .gallery-like.active > svg, '+gframe+'.blueimp-gallery .gallery-like.active > svg > path:first-child {fill:'+likeActive_fill+';}\n';

    $('.gframeCss' + seq).text(galleryStyle);
}

var galleryFrame = function (id,autoplay,interval,bt_type) {
	var bt_type = (bt_type) ? bt_type : 'gallery';
    $('#gframe-' + id).remove();
    var str = '\
		<div id="gframe-' + id + '" class="blueimp-gallery blueimp-gallery-controls" data-start-slideshow="' + autoplay + '" data-slideshow-interval="' + interval + '">\
            <div class="slides"></div>\
            <div class="zoomable hide"></div>\
            <h3 class="title"></h3>\
            <a class="prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="M31.33 42 12 22 31.33 2l.67.69L13.34 22 32 41.31z"/></svg></a>\
            <a class="next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="M12.67 2 32 22 12.67 42l-.67-.69L30.66 22 12 2.69z"/></svg></a>\
            <div class="slide-index"><span class="current-slide"></span>/<span class="total-slide"></span></div>\
            <a class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22"><polygon points="22 1.06 20.94 0 11 9.94 1.06 0 0 1.06 9.94 11 0 20.94 1.06 22 11 12.06 20.94 22 22 20.94 12.06 11 "/></svg></a>\
            <a class="play-pause">\
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m5.3 4.08 17 9.92-17 9.92V4.08m-.4-2.1c-.73 0-1.4.58-1.4 1.4v21.24a1.397 1.397 0 0 0 2.1 1.21l18.19-10.62c.93-.54.93-1.88 0-2.42L5.61 2.17c-.23-.13-.47-.19-.71-.19z"/></svg>\
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g><path d="M7.6 25.5c-.77 0-1.4-.63-1.4-1.4V3.9c0-.77.63-1.4 1.4-1.4.77 0 1.4.63 1.4 1.4v20.2c0 .77-.63 1.4-1.4 1.4zM20.4 25.5c-.77 0-1.4-.63-1.4-1.4V3.9c0-.77.63-1.4 1.4-1.4.77 0 1.4.63 1.4 1.4v20.2c0 .77-.63 1.4-1.4 1.4z"/></g></svg>\
            </a>\
            <a class="gallery-like"></a>\
            <ol class="indicator"></ol>\
        </div>\
    ';
    $('.'+bt_type+'-frame').append(str);
}        


var makeLinkUrl = function(link, one, view) {
	var link_url = '',
		link_val = '',
		is_menu = ($.inArray(link.replace(/^\//g, '').replace(/ /g, '-'), property.MENULIST) > -1) ? true : false,
		regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/,
		regex2 = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,7}(\:[0-9]+)?(\/\S[^\{\}]*)?$/;

	if (one) {
    	link_url = (view) ? '/#' : '#';
    	link_url = (view && !property.PUBLISH) ? '/render/index#' : link_url;
    	if(is_menu) link_url = '/';
	} else {
        link_url = (property.URI=='/' || is_menu) ? '/' : property.URI + '/'; 
	}

	if (link) {
		if (link.match(/^\@/g) !== null) { // link-type: link-bookmark ==> a[attr-bookmark]
			var bookmark_seq = link.replace(/^\@/g, '');
			if (typeof property.SETTINGS.blockBookmarkList == 'undefined' || typeof property.SETTINGS.blockBookmarkList['bookmark' + bookmark_seq] == 'undefined') {
				return '';
			}
		} else if (link.match(/^flink\@[0-9]/gi) !== null) { // link-type: link-file     ==> a[attr-flink]
			return link;
		} else if ($.inArray(link.replace(/^\//g, '').replace(/ /g, '-'), property.MENULIST) > -1) { // link-type: link-menu     ==> a[data-user-link]
			link_val = link_url + link.replace(/ /g, '-');
		} else { // link-type: link-out      ==> a[attr-link]
			if(checkBase64Encode(decodeURIComponent(link))) link = Base64.decode(decodeURIComponent(link));
			else if (checkBase64Encode(link)) link = Base64.decode(link);

			if(!regex2.test(link) && regex.test(link)) link_val = '//' + link;
		}

		if(link_val == '') link_val = link;
	}
	return link_val;
}

var checkError = function(data) {
    if(typeof data.error != 'undefined' && data.error) {
        alert(data.error);
        if(data.error=='No user data') {
            location.href='/member/login';
        }
        return true;
    }
    return false;
}

var funcCallback = function(func,callback) {
    func();
    if(typeof callback=='function') {
        callback();
    }
}

var cssSidebar = function(onoff) {
	var width = (onoff == 'on') ? '260px' : '',
		dsgn_css = CSSJSON.toJSON($('#dsgn-body').text());

	if(width) {
		if(typeof dsgn_css['children']['.dsgn-body.sidebar'] == 'undefined') {
			dsgn_css['children']['.dsgn-body.sidebar'] = {'children' : {}, 'attributes' : { 'padding-left' : width, 'padding-top': '0px' }};
		}
	} else {
		if(typeof dsgn_css['children']['.dsgn-body.sidebar'] != 'undefined') {
			delete dsgn_css['children']['.dsgn-body.sidebar'];
		}
	}

	$('#dsgn-body').text(CSSJSON.toCSS(dsgn_css));
}

var getScreen = function() {
    var wid = window.innerWidth;

    var screen_size = 0;
    if (0 < wid && wid < 480) {
        screen_size = 320;
    } else if(wid <= 480 && wid <768) {
        screen_size = 480;
    } else if (768 <= wid && wid < 992) {
        screen_size = 768;
    } else if (992 <= wid && wid < 1200 ) {
        screen_size = 992;
    } else if (wid >= 1200) {
        screen_size = 1200;
    }

    return screen_size;
}

var getScreenIndex = function() {
    var idx = 0;
    switch(SCREEN) {
        case 320:
        case 480:
            idx = 2;
            break;
        case 769:
            idx = 1;
            break;

        case 992:
        case 1200:
            idx = 0;
            break;

        default : idx = 0; break;
    }
    return idx;
}
var moveGallery = function(element) {
    var header_fixed = $('header.navbar').height(),
    	offset = ($('.dsgn-body').hasClass('sidebar')) ? 0 : -header_fixed,
    	item = $('.gallery-item[data-seq="'+element+'"]');

    if($('header.navbar').hasClass('disableOffset') && !$('.'+link).hasClass('el_0')) offset = 0;
    if(item.length==0) {
    	if($('.element[data-id="'+element+'"]').length > 0) item = $('.element[data-id="'+element+'"]');
    	else return;
    }
    var sTop = item.offset().top + offset;
    $('html, body').animate({
        scrollTop: sTop
    }, 500, 'easeInOutQuart');		  

    $.removeCookie('gallery', { path: '/' });
    $.removeCookie('gallery-item', { path : '/' });
}

var scrollToBlock = function(el,interval) {
	if(typeof interval == 'undefined') interval = 1200;
	if(typeof el == 'undefined' || !el || $(el).length == 0) return;

	var header_fixed = $('header.navbar').outerHeight(),
		offset = $('.dsgn-body').scrollTop();

	if(!$('.dsgn-body').hasClass('sidebar') && !$('header.navbar').hasClass('disableOffset')) offset -= header_fixed;
	var sTop = $(el).offset().top + offset;
	$('html, body').animate({ scrollTop: sTop }, interval, 'easeInOutQuart');
}

var clearDsgnbody = function() {
	$('.element[data-id="all_products"]').remove();
	$('.psearch-view').remove();
	$('.menu-lock-block').remove();
	$('.site-lock-block').remove();
	$('.config-image-view').hide();
	$('.forum-view').remove();
	$('.page-comments').remove();
	$('.page-bottomlist').remove();
	$('.tpl-page-footer').remove();
	$('.el-footer').hide();
	var element = $('div.element[class*="el_"]:not([class*=el__]):not(.el-footer)'),
		css = $('style[id^="el_"]:not([id*=el__])'),
		js = $('script[id^="js_"]:not([id*=el__])');

	element.remove();
	css.remove();
	js.remove();
}

var golink = function(_this,link) {
	var wloc = window.location,
		local_link = (wloc.hostname == link.hostname) ? true : false,
		local_arr = ['/_register', '/_login'];

	if(local_link && $.inArray(link.pathname,local_arr) == -1) {
    	var loc = link.pathname,
    		uri = (_this.b.PUBLISH) ? loc : loc.replace('/render/','');

    	if((uri == '/render' || uri == '/') && !_this.b.ONE) {
    		uri = '';
    		$.each(_this.b.SMENU,function(i,v) {
    			var menu_name = (v.name).replace(' ','-');
    			var checkMenuName = (uri == menu_name) ? true : false,
    				checkMenuLink = (typeof v.link != 'undefined' && v.link) ? true : false;

    			if(checkMenuName && checkMenuLink) {
    				uri = (v.link).replace(' ','-');
    			}
    		});
    		
    	}

    	var go = (_this.b.PUBLISH) ? '/' + uri + link.hash: '/render/' + uri + link.hash;
		// 명품 쇼핑 검색 파라미터 처리
		if((link.search).length) go = go + link.search;
		_this.history.pushState(null,_this.b.TITLE,go);

		if(typeof $.cookie('forum-item') != 'undefined') {
			// console.log('fm_view', $.cookie('forum_content_view'));
			setTimeout(function() {
	    		if(typeof $.cookie('forum_content_view') != 'undefined'){
                    var fm_view = $.cookie('forum_content_view');
                    var fv = (fm_view !== undefined && fm_view)? fm_view.split('&'):array();
                    var pid = (fv)? fv[0]:'';
                    var row_id = (fv)? fv[1]:'';

                    scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"] .tpl-forum-list-title[data-id="'+row_id+'"]', 1000);
	    			$.removeCookie('forum-item', { path : '/' });

                    $('.element[data-id="' + pid + '"] .tpl-forum-list-title[data-id="'+row_id+'"]').click();
                    // $.removeCookie('forum_content_view', { path: '/', expires: 12 * 60 * 60 * 1000 });
                } else {
                	scrollToBlock('.element[data-id="' + $.cookie('forum-item') + '"]', 1000);
	    			$.removeCookie('forum-item', { path : '/' });
                }
			}, 300);
		}
	} else {
		location.href = link.href;
	}
}

var allProductSortNav = function(elsettings, total) {
    var settings = elsettings;
    var orderby = (typeof settings.orderby !== 'undefined') ? settings.orderby.split('||') : ['true', 'false', 'false', 'false', 'false', 'false'];
	// var orderby_val = (typeof settings.orderby_val !== 'undefined') ? settings.orderby_val :
    //             {'recent':'최신등록순',
    //             'lowprice':'낮은가격순',
    //             'review_cnt':'리뷰많은순',
    //             'high_score':'평점높은순',
    //             'sales':'누적판매순',
    //             'hits':'조회순'};
	var orderby_val = ['recent','lowprice','review_cnt','high_score','sales','hits'];
    var cookie_allproducts_orderby = $.cookie('gallery-category-all_products');
	
    var allproducts_sort_list = '';
    var i = 0;
    $.each(orderby_val, function(k, v){
        if (orderby[i] == 'true') {
            var active = (cookie_allproducts_orderby == k)? 'active':'';
            allproducts_sort_list += '<li class="' + active + '"><a href="javascript:;" data-idx="' + k + '">' + $.lang[LANG]['config.allproducts.'+v] + '</a></li>';
        }
        
        i++;
    });

	var orderby_set = '';
	switch(orderby_val[cookie_allproducts_orderby]) {
		case 'recent':
			orderby_set = $.lang[LANG]['config.allproducts.recent'];
			break;
		case 'lowprice':
			orderby_set = $.lang[LANG]['config.allproducts.lowprice'];
			break;
		case 'review_cnt':
			orderby_set = $.lang[LANG]['config.allproducts.review_cnt'];
			break;
		case 'high_score':
			orderby_set = $.lang[LANG]['config.allproducts.high_score'];
			break;
		case 'sales':
			orderby_set = $.lang[LANG]['config.allproducts.sales'];
			break;
		case 'hits':
			orderby_set = $.lang[LANG]['config.allproducts.hits'];
			break;
	}
	var allproducts_sticky = (settings.allproducts_sticky != 'undefined' && settings.allproducts_sticky == 'ON') ? 'float' : '',
        nosticky = (settings.allproducts_sticky != 'undefined' && settings.allproducts_sticky == 'ON') ? '' : 'nosticky';
    var html = '\
	    <div class="allProducts-sort-wrap '+ allproducts_sticky +' '+ nosticky +'">\
	    	<div class="allProducts-sort-mobile">\
	            <div class="dropdown">\
	                <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:;">\
		                <span>'+orderby_set+'</span>\
		                <svg viewBox="0 0 14 14" width="14" height="14"><polygon points="12.94 2.94 7 8.88 1.06 2.94 0 4 7 11 14 4 "></polygon></svg>\
	                </a>\
	                <ul class="gallery-category-nav goption-row dropdown-menu">\
	                    ' + allproducts_sort_list +
	                '</ul>\
	            </div>\
	            <div>'+ $.lang[LANG]['config.allproducts.total1'] +' ' + total + $.lang[LANG]['config.allproducts.total2'] +'</div>\
	        </div>\
		    <ul class="gallery-category-nav goption-row allProducts-sort-list">\
		        ' + allproducts_sort_list +
				'<li class="total"><a>'+ $.lang[LANG]['config.allproducts.total1'] +' ' + total + $.lang[LANG]['config.allproducts.total2'] +'</a></li>\
		    </div>\
	    </div>';

    return html;
}

var loadAllproductSort = function(el, elsettings, total) {
	var $el = el,
		margin_val = $el.find('[data-loop="true"]').css('margin-left'),
		padding_val = $el.find('.grid').first().css('padding-left');

	var checkMsny = ($el.is('[data-msny="true"]')) ? true : false,
		checkPremium = ($el.is('[data-type2="premium"]')) ? true : false,
        checkGjs = ($el.has('input.gjs').length) ? true : false,
		checkGalleryCate = (	(checkMsny && $el.children('.allProducts-sort-wrap').length > 0) ||
								(!checkMsny && $el.find('.container .allProducts-sort-wrap').length > 0)
							) ? true : false,
		allproducts_sort_html = allProductSortNav(elsettings, total);

	if(checkGalleryCate) {
		$el.find('.allProducts-sort-wrap').replaceWith(allproducts_sort_html);                
	} else {
		if($el.find('.allProducts-sort-wrap').length > 0) $el.find('.allProducts-sort-wrap').remove();

		if(checkMsny) {
			if($el.find('.goption').length > 0) $el.find('.goption').after(allproducts_sort_html);
			else $el.prepend(allproducts_sort_html);
		} else if(checkPremium || checkGjs) {
			var gcate_position = (typeof getGalleryCateNavPosition == 'function') ? getGalleryCateNavPosition($el) : '';
			if(gcate_position) $el.find(gcate_position).before(allproducts_sort_html);
		} else {
			$el.find('[data-loop="true"]').before(allproducts_sort_html);
		}
	}

	if($el.find('[data-loop="true"]').find('.emptyGalleryItem').length > 0  && $el.find('.allProducts-sort-list .active').index() == 0) $el.find('.allProducts-sort-list').addClass('empty');
}


var  setAllProductsCurrentCat = function(elsettings) {
	var orderby = (typeof elsettings.orderby !== 'undefined')? elsettings.orderby.split('||') : ['true', 'false', 'false', 'false', 'false', 'false'];
	// var orderby_val = (typeof elsettings.orderby_val !== 'undefined')? elsettings.orderby_val :
	// 					{'recent':'최신등록순',
	// 					'lowprice':'낮은가격순',
	// 					'review_cnt':'리뷰많은순',
	// 					'high_score':'평점높은순',
	// 					'sales':'누적판매순',
	// 					'hits':'조회순'};
	var orderby_val = ['recent','lowprice','review_cnt','high_score','sales','hits'];
	var orderby_key = new Array();
	var i = 0;
	$.each(Object.keys(orderby_val), function(idx, v){
		if(orderby[idx] == 'true') {
			orderby_key[i] = v;
			i++;
		}
	});
	var first_sort = orderby_key[0];
	var cookie_gallery_category = (typeof $.cookie('gallery-category-all_products') !== 'undefined' && $.cookie('gallery-category-all_products') != '')? $.cookie('gallery-category-all_products'):first_sort;
	if(orderby_key.indexOf(cookie_gallery_category) == -1) {
		cookie_gallery_category = first_sort;
		$.cookie('gallery-category-all_products', first_sort, { path: '/', expires: 12 * 60 * 60 * 1000 });
	}

	return first_sort;
}

function draw_floating() {
    var fl_section_html = '',
		fl_bottom_html = '',
		fl_circle_html = '',
		el_html = '',
		data = {};

    $.each($('.floating_item li'), function(fi, fv){
        var fl_class = $(this).find('.icon').attr('class'),
            cid = ($(this).find('a').attr('data-cid')) ? $(this).find('a').attr('data-cid') : '',
            fl_link = ($(this).find('a').attr('data-link')) ? $(this).find('a').attr('data-link') : '',
            type = ($(this).find('a').attr('data-type')) ? $(this).find('a').attr('data-type') : '',
            data = ($(this).find('a').attr('data-data')) ? $(this).find('a').attr('data-data') : '',
            name = ($(this).find('a').attr('data-name')) ? $(this).find('a').attr('data-name') : '',
            regexp = /[0-9]+/,
            fl_url = (type=='defaultPhone') ? 'tel:'+property.TEL_LINK : data;

            if(type=='top') return true;
            fl_icon_num = (type=='defaultPhone') ? '' : `${regexp.exec(fl_class)}`;
			// fl_link = (type=='address' || type=='page_move' || type=='storefarm') ? fl_link : '';
			fl_url = (type=='defaultPhone') ? fl_url : fl_link;
			fl_url = (type=='link') ? data : fl_url;
			fl_url = (type=='email') ? 'mailto:'+data : fl_url;
			fl_url = (type=='reservation') ? data : fl_url;
			fl_url = (type=='page_move' && data=='홈') ? '/' : fl_url;
			fl_url = (type=='sms') ? 'tel:'+ data : fl_url;
			if(fl_url.includes('pf.kakao')) {
				fl_url = 'https://' + fl_url;
			}
         
        fl_section_html += `
        <li class="" data-type="${type}" data-name="${name}" data-cid="${cid}" data-link="${fl_url}">
            <a class="btn btn_ic${fl_icon_num}" href="${fl_url}">
                <div class="in">${name}
                    <span class="ic theme_background"></span>
                </div>
            </a>
        </li>
        `;
        
		fl_icon_num = (type=='defaultPhone') ? '1' : fl_icon_num;
		fl_bottom_html += `
		<a class="link_item _button_navi" href="${fl_url}" data-type="${type}">
			<span class=" text _text">${name}</span><span class=" icon icon${fl_icon_num}"></span>
		</a>
		`;
		fl_circle_html += `
		<a class="link_item _button_navi _bizPhone float-navi-button mfl_hide" href="${fl_url}" data-type="${type}">
			<span class="text _text">${name}</span><span class=" icon icon${fl_icon_num} theme_background"></span>
		</a>
		`;

		// console.log(fl_url);
    });

    el_html += `
        <div class="btn_wrap m_floating">
			<ul class="btn_list">
				${fl_section_html}
			</ul>
		</div>
    `;

	data = {
		'fl_bottom_html' : fl_bottom_html,
		'fl_circle_html' : fl_circle_html,
		'el_html' : el_html
	}

	return data;
}
    

function m_floating(fl_data) {
	if($.isEmptyObject(fl_data)) return false;
	var	settings = (typeof property.SETTINGS !='undefined' && property.SETTINGS) ? property.SETTINGS : {},
		settings_modoo = (typeof settings.modoo !='undefined' && settings.modoo) ? settings.modoo : {},
		settings_mfloating = (typeof settings_modoo.mfloating !='undefined' && settings_modoo.mfloating) ? settings_modoo.mfloating : '';

	if(settings_mfloating!='' && settings_mfloating && $('ul.floating_item._floating.modoo').length>0) {
		var modoo_fnav_html = (settings_mfloating=='bottom') ? `
			<div class="floating_area _floating_area modoo" data-mfltype="${settings_mfloating}">
				<div class="floating_item floating_bottom _float_buttons">
					${fl_data.fl_bottom_html}
					<button type="button" class="btn_top _top_btn" data-type="top">
						<span class="blind">TOP</span><span class="icon_top"></span>
					</button>
				</div>
			</div>		
		` : `
		<div class="floating_area _floating_area modoo" data-mfltype="${settings_mfloating}">
			<div class="dimmed _bg_dimmed"></div>
			<div class="floating_item _float_buttons">
				${fl_data.fl_circle_html}
				<button type="button" class="btn_menu _toggle_btn" style="-webkit-tap-highlight-color: transparent;">
					<span class="icon nicon_more4 _icon_area theme_background"></span>
				</button>
			</div>
		</div>`
		;

		$('.dsgn-body.modoo').append(modoo_fnav_html);
	}
	
}

function isMenuLock(callback) {
	var deferred = $.Deferred();
    var is_lock_block = 'active', r;
    var display_target = (property.VIEW) ? '.cl-s-product-detail, .lux-product-block, .cl-s-product-review, .cl-s-product-qna, .tpl-page-footer, .tpl-page-toolbar, .page-comments, .page-bottomlist' : '';

    if(property.ISLOCK == 'true') { 
    	r = $.post('/template/menuLockController/type/lock_check', {s: property.SMENU, sid: property.SID, page: property.PAGE, publish : property.PUBLISH}, function(data) {
			var lock_type = data.lock_type,
				lock_error_type = (typeof data.error_data != 'undefined' && data.error_data.type) ? '.' + data.error_data.type : '';
			
			if(!data.error && data.result) { 
				property.ISLOCK = 'false';
			} else {
				// var checkGotoURL = '';
				// if((property.SITEUM == '1' || property.SITEUM == '2') && lock_error_type == '') checkGotoURL = '/_login';
				// else if(property.SITEUM == '2'&&  $.inArray(lock_error_type,['.unlikesite','.creatorlink']) > -1) checkGotoURL = '/_register';
				// if(checkGotoURL) {
				// 	location.href = checkGotoURL;
				// 	return false;
				// }

				var text = $.lang[LANG]['render.menu-lock.' + lock_type + '.text'];
				if (typeof data.menuLockMsg !== 'undefined' && data.menuLockMsg) {
					text = data.menuLockMsg;
				}

				if (lock_type=='umlevel') {
					if(lock_error_type == '' && property.SITEUM == '1') lock_error_type = '.onlylogin';

					text = $.lang[LANG]['render.menu-lock.' + lock_type + '.text' + lock_error_type ];
					if(lock_error_type == '.lowerlevel') text = text.replace(/\#/gi, data.error_data.umlevel);
				}

				var str = '\
							<div class="menu-lock-block">\
								<div class="inner-box text-center">\
									<div class="form-inline" role="form">\
										<div class="text">\
											<p> ' + text + ' </p>\
										</div>';
					if(lock_type=='password') {
						str = str + '\
										<div class="form-group">\
											<input class="form-control" type="password" placeholder="password" data-lock-password=""/>\
											<label class="error-text"></label>\
										</div>\
										<div class="form-group">\
											<span class="btn" data-edit="true" data-selector=".btn" data-lock-submit="">'+$.lang[LANG]['render.lock.password.submit']+'</span>\
										</div>\
						';
					}
					str = str + '\
									</div>\
								</div>\
							</div>\
				';
		        $('.header.el-menu').after(htmlspecialchars_decode(str));
		        $('#page-loading-css').remove();
			}
		    if(typeof callback == 'function') {
		    	callback();

		    	if(display_target) {
					setTimeout(function() {
				    	if(property.ISLOCK == 'true') $(display_target).addClass('hide');
				    	else $(display_target).removeClass('hide');
					},20);
		    	}
		    }

    	},'json');
    } else {
	    if(typeof callback == 'function') {
	    	callback();
			setTimeout(function() {
				$('.header.el-menu.hide').removeClass('hide');
				if(display_target) $(display_target).removeClass('hide');
			},20);
	    }
	}

	deferred.resolve();
	return deferred.promise();
}

function isSitePasswordLock() {
	var deferred = $.Deferred();
	let last_activity = localStorage.getItem("last_activity");
	let ss_site_lock = localStorage.getItem('ss_' + property.SID + '_site_lock');
    
    if (last_activity && ss_site_lock) {
    	let timeDiff = Math.floor(Date.now() / 1000) - Number(last_activity);
    	// console.log(Math.floor(Date.now() / 1000), Number(last_activity), timeDiff);
    	if (timeDiff > 3600) {
	    	// console.log('localStorage clear');
	        localStorage.removeItem('last_activity');
	        localStorage.removeItem('ss_' + property.SID + '_site_lock');
	        setTimeout(function(){
	        	location.href = '/';
	        });
	    }
    }

	if(property.SETTINGS.sitePermit == undefined) {
		property.SETTINGS.sitePermit = 1;
	}

	if(property.SETTINGS.sitePermit == 3) {
		let pw = (ss_site_lock)? ss_site_lock : '';
		r = $.post('/template/siteLockController/type/lock_check', {sid: property.SID, publish : property.PUBLISH, pw: pw}, function(data) {
			var lock_error_type = (typeof data.error_data != 'undefined' && data.error_data.type) ? '.' + data.error_data.type : '';
			if(!data.error && data.result) { 
				property.SETTINGS.sitePermit = 1;
			} else {
				var str = '\
					<div class="site-lock-block">\
						<div class="inner-box text-center">\
							<div class="form-inline" role="form">\
								<div class="text">\
									<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="625 326 116 116" width="114" height="114"><path d="M700.5 379.5h-36v-12c0-9.92 8.08-18 18-18s18 8.08 18 18v12zm-34-2h32v-10c0-8.82-7.18-16-16-16s-16 7.18-16 16v10z"/><path d="M700.88 415.5h-36.75c-4.2 0-7.63-3.42-7.63-7.63v-22.75c0-4.2 3.42-7.63 7.63-7.63h1.38v2h-1.38c-3.1 0-5.63 2.52-5.63 5.63v22.75c0 3.1 2.52 5.63 5.63 5.63h36.75c3.1 0 5.63-2.52 5.63-5.63v-22.75c0-3.1-2.52-5.63-5.63-5.63h-1.38v-2h1.38c4.2 0 7.63 3.42 7.63 7.63v22.75c-.01 4.21-3.43 7.63-7.63 7.63z"/><path d="M665.5 377.5h34v2h-34z"/><path d="M683 442c-31.98 0-58-26.02-58-58s26.02-58 58-58 58 26.02 58 58-26.02 58-58 58zm0-114c-30.88 0-56 25.12-56 56s25.12 56 56 56 56-25.12 56-56-25.12-56-56-56z"/><circle cx="683" cy="393" r="4"/><path d="M683 403c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1z"/></svg>';
						if(typeof data.sitelock_text != 'undefined' && data.sitelock_text) {
							str += '<p class="title">'+data.sitelock_text+'</p>';
						} else {
							str += '<p class="title">'+$.lang[LANG]['render.site-lock.password.text']+'</p>';
						}
						str += '</div>\
								<div class="form-group">\
									<div>\
										<input type="password" placeholder="'+$.lang[LANG]['render.site-lock.password.placeholder']+'" data-lock-password=""/>\
										<label class="error-text"></label>\
									</div>\
									<span class="btn" data-edit="true" data-selector=".btn" data-lock="site" data-lock-submit="">\
									<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="676 378.59 13 9.41" width="13" height="9"><path d="m681 388-5-5 1.41-1.41 3.59 3.58 6.59-6.58L689 380z"></path></svg>\
									</span>\
								</div>\
							</div>\
						</div>\
					</div>\
				';
		        $('.header.el-menu').after(htmlspecialchars_decode(str));
			}
			if(data.reload === true && data.result) {
				setTimeout(function(){
					location.reload();
				});
			}
		}, 'json');
	}
	
    deferred.resolve();
	return deferred.promise();
}

function isUserCertified(history) {
	var referrer = (document.referrer !== undefined)? document.referrer.replace(/^https?:\/\//, ''):'';
	var seg = referrer.split('/');

	if(property.CERT_USE == 'A' && property.VALIDTYPE != 'BN' && property.VALIDTYPE != 'SM') { //요금제 만료
		var str = '\
			<div class="site-lock-block">\
				<div class="inner-box text-center">\
					<div class="form-inline">\
						<div class="text">\
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 118" width="118" height="118"><path d="M76.88 52.5h-.38v-10c0-9.92-8.08-18-18-18s-18 8.08-18 18v10h-.38c-4.2 0-7.62 3.42-7.62 7.62v22.75c0 4.2 3.42 7.62 7.62 7.62h36.75c4.2 0 7.62-3.42 7.62-7.62V60.12c.01-4.2-3.41-7.62-7.61-7.62zm-34.38-10c0-8.82 7.18-16 16-16s16 7.18 16 16v10h-32v-10zm40 40.38c0 3.1-2.52 5.62-5.62 5.62H40.12c-3.1 0-5.62-2.52-5.62-5.62V60.12c0-3.1 2.52-5.62 5.62-5.62h36.76c3.1 0 5.62 2.52 5.62 5.62v22.76z"/><path d="M59 1C27.02 1 1 27.02 1 59s26.02 58 58 58 58-26.02 58-58S90.98 1 59 1zm0 114C28.12 115 3 89.88 3 59S28.12 3 59 3s56 25.12 56 56-25.12 56-56 56z"/><path d="M59 64c-2.21 0-4 1.79-4 4 0 1.86 1.28 3.41 3 3.86V77c0 .55.45 1 1 1s1-.45 1-1v-5.14c1.72-.45 3-2 3-3.86 0-2.21-1.79-4-4-4z"/></svg>\
							<p class="title">'+$.lang[LANG]['siteum.site.access.limit']+'</p>\
						</div>\
					</div>\
				</div>\
			</div>\
		';
		
		$('.header.el-menu').after(htmlspecialchars_decode(str));
		return false;
	}

	r = $.post('/template/isUserCertified', {sid: property.SID, publish : property.PUBLISH}, function(data) {
		var cert_form = '';
		if((property.CERT_USE == 'Y' && data.cert != 'Y') || (property.CERT_USE == 'A' && data.cert_adult != 'Y')) {
			var cert_conf = data.cert_conf;
			var ordr_idxx = init_orderid();
			cert_form = '\
				<form name="form_auth" method="post" action="/cert_req">\
					<input type="hidden" name="ordr_idxx" value="'+ordr_idxx+'"/>\
					<!-- 요청종류 -->\
			        <input type="hidden" name="req_tx"       value="cert"/>\
			        <!-- 요청구분 -->\
			        <input type="hidden" name="cert_method"  value="01"/>\
			        <!-- 웹사이트아이디 : ../cfg/cert_conf.php 파일에서 설정해주세요 -->\
			        <input type="hidden" name="web_siteid"   value="'+cert_conf.g_conf_web_siteid+'"/> \
			        <!-- 노출 통신사 default 처리시 아래의 주석을 해제하고 사용하십시요 \
			             SKT : SKT , KT : KTF , LGU+ : LGT\
			        <input type="hidden" name="fix_commid"      value="KTF"/>\
			        -->\
			        <!-- 사이트코드 : ../cfg/cert_conf.php 파일에서 설정해주세요 -->\
			        <input type="hidden" name="site_cd"      value="'+cert_conf.g_conf_site_cd+'" />\
			        <!-- Ret_URL : ../cfg/cert_conf.php 파일에서 설정해주세요 -->\
			        <input type="hidden" name="Ret_URL"      value="'+cert_conf.g_conf_Ret_URL+'" />\
			        <!-- cert_otp_use 필수 ( 메뉴얼 참고)\
			             Y : 실명 확인 + OTP 점유 확인 , N : 실명 확인 only\
			        -->\
			        <input type="hidden" name="cert_otp_use" value="Y"/>\
			        <!-- 리턴 암호화 고도화 -->\
			        <input type="hidden" name="cert_enc_use_ext" value="Y"/>\
\
			        <input type="hidden" name="res_cd"       value=""/>\
			        <input type="hidden" name="res_msg"      value=""/>\
\
			        <!-- up_hash 검증 을 위한 필드 -->\
			        <input type="hidden" name="veri_up_hash" value=""/>\
\
			        <!-- 본인확인 input 비활성화 -->\
			        <input type="hidden" name="cert_able_yn" value=""/>\
\
			        <!-- web_siteid 을 위한 필드 -->\
			        <input type="hidden" name="web_siteid_hashYN" value="Y"/>\
\
			        <!-- 가맹점 사용 필드 (인증완료시 리턴)-->\
			        <input type="hidden" name="param_opt_1"  value="myinfo"/>\
			        <input type="hidden" name="param_opt_2"  value="'+data.userid+'"/>\
				</form>\
				<iframe id="kcp_cert" name="kcp_cert" width="100%" frameborder="0" scrolling="no" style="display:none"></iframe>\
				<form name="myinfo_form" method="post" action="/_myinfo_proc">\
				<input type="hidden" id="cert_data" name="cert_data" value="">\
					<input type="hidden" id="up_hash" name="up_hash" value="">\
					<input type="hidden" id="cert_no" name="cert_no" value="">\
					<input type="hidden" id="input-name" name="name" value="'+data.name+'">\
					<input type="hidden" id="input-birth" name="birth" value="'+data.birth+'">\
					<input type="hidden" id="input-tel" name="tel" value="'+data.tel+'">\
					<input type="hidden" id="input-gender" name="gender" value="'+data.gender+'">\
					<input type="hidden" id="input-email" name="email" value="'+data.email+'">\
					<input type="hidden" id="input-id" name="id" value="'+data.userid+'">\
				</form>\
			';

			if(property.CERT_USE == 'Y'){
				if(property.SETTINGS.sitePermit == '2Y') {
					if(!data.userid){
						if(property.ONE && !property.VIEW) { //onepage site
							var onpage_seq = property.pageContent.index[0]['seq'];
							if(onpage_seq!='login' && onpage_seq!='register' && onpage_seq!='forgot'){
								location.href='/_login';
							}
						} else {
							if(property.PAGE!='_login' && property.PAGE!='_register' && property.PAGE!='_forgot') {
								location.href='/_login';
							}
						}
						
					} else {
						var str = '\
						<div class="site-lock-block useronly">\
							<div class="inner-box text-center">\
								<div class="form-inline">\
									<div class="text">\
									'+cert_form+'\
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><defs/><g><circle cx="-220.9" cy="60" r="24" class="cls-9"/></g><g/><g><circle cx="60" cy="24" r="22" style="fill:#dbdbdb;"/><path d="M54 52h12c16.56 0 30 13.44 30 30v12c0 4.42-3.58 8-8 8H32c-4.42 0-8-3.58-8-8V82c0-16.56 13.44-30 30-30Z" style="fill:#dbdbdb;"/><path d="m97.34 71.03 3.8 2.58c.67.46 1.43.77 2.23.92l4.51.86a5.95 5.95 0 0 1 4.73 4.73l.86 4.51c.15.8.47 1.56.92 2.23l2.58 3.8a5.942 5.942 0 0 1 0 6.68l-2.58 3.8c-.46.67-.77 1.43-.92 2.23l-.86 4.51a5.95 5.95 0 0 1-4.73 4.73l-4.51.86c-.8.15-1.56.47-2.23.92l-3.8 2.58a5.942 5.942 0 0 1-6.68 0l-3.8-2.58c-.67-.46-1.43-.77-2.23-.92l-4.51-.86a5.95 5.95 0 0 1-4.73-4.73l-.86-4.51c-.15-.8-.47-1.56-.92-2.23l-2.58-3.8a5.942 5.942 0 0 1 0-6.68l2.58-3.8c.46-.67.77-1.43.92-2.23l.86-4.51a5.95 5.95 0 0 1 4.73-4.73l4.51-.86c.8-.15 1.56-.47 2.23-.92l3.8-2.58a5.942 5.942 0 0 1 6.68 0Z" style="fill:#4D94FA"/><path d="M94 74c.39 0 .77.12 1.09.34l3.8 2.58c1.13.77 2.39 1.29 3.74 1.55l4.51.86c.79.15 1.39.76 1.54 1.54l.86 4.51c.26 1.35.78 2.6 1.55 3.74l2.58 3.8c.45.66.45 1.52 0 2.18l-2.58 3.8a9.941 9.941 0 0 0-1.55 3.74l-.86 4.51c-.15.79-.76 1.39-1.54 1.54l-4.51.86c-1.35.26-2.6.78-3.74 1.55l-3.8 2.58c-.32.22-.7.34-1.09.34s-.77-.12-1.09-.34l-3.8-2.58a9.941 9.941 0 0 0-3.74-1.55l-4.51-.86c-.79-.15-1.39-.76-1.54-1.54l-.86-4.51c-.26-1.35-.78-2.6-1.55-3.74l-2.58-3.8c-.45-.66-.45-1.52 0-2.18l2.58-3.8a9.941 9.941 0 0 0 1.55-3.74l.86-4.51c.15-.79.76-1.39 1.54-1.54l4.51-.86c1.35-.26 2.6-.78 3.74-1.55l3.8-2.58c.32-.22.7-.34 1.09-.34m0-4c-1.17 0-2.33.34-3.34 1.03l-3.8 2.58c-.67.46-1.43.77-2.23.92l-4.51.86a5.95 5.95 0 0 0-4.73 4.73l-.86 4.51c-.15.8-.47 1.56-.92 2.23l-2.58 3.8a5.942 5.942 0 0 0 0 6.68l2.58 3.8c.46.67.77 1.43.92 2.23l.86 4.51a5.95 5.95 0 0 0 4.73 4.73l4.51.86c.8.15 1.56.47 2.23.92l3.8 2.58c1.01.69 2.18 1.03 3.34 1.03s2.33-.34 3.34-1.03l3.8-2.58c.67-.46 1.43-.77 2.23-.92l4.51-.86a5.95 5.95 0 0 0 4.73-4.73l.86-4.51c.15-.8.47-1.56.92-2.23l2.58-3.8a5.942 5.942 0 0 0 0-6.68l-2.58-3.8c-.46-.67-.77-1.43-.92-2.23l-.86-4.51a5.95 5.95 0 0 0-4.73-4.73l-4.51-.86c-.8-.15-1.56-.47-2.23-.92l-3.8-2.58A5.919 5.919 0 0 0 94 70Z" style="fill: #4789e7;"/><path d="M91.59 101.71c-.51 0-1.02-.2-1.41-.59l-6.59-6.59c-.78-.78-.78-2.05 0-2.83s2.05-.78 2.83 0l5.17 5.17 10-10c.78-.78 2.05-.78 2.83 0s.78 2.05 0 2.83l-11.41 11.41c-.39.39-.9.59-1.41.59Z" style="fill:#fff"/></g></svg>\
										<p class="title">'+$.lang[LANG]['siteum.cert.user']+'</p>\
										'+$.lang[LANG]['siteum.cert.user.txt']+'\
										<button class="btn cl-s-btn cl-s-btn-full btn-cert" onclick="return auth_type_check(true);">\
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path d="M22 0H10C7.79 0 6 1.79 6 4v24c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zm2 28c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v24z"/><path d="M18 4h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
										'+$.lang[LANG]['siteum.cert.user.btn']+'</button>\
										<a class="btn cl-s-btn cl-s-btn-primary cl-s-btn-full logout" href="javascript:;">'+ $.lang[LANG]['siteum.cert.user.exit'] +'</a>\
									</div>\
								</div>\
							</div>\
						</div>\
						';
						$('.header.el-menu').after(htmlspecialchars_decode(str));

						$(document).on('click', '.btn.logout', function(e){
							e.preventDefault();
							$.getJSON('/umember/login/out', function(r) {
								if($.cookie('cert_popup') !== undefined) {
									$.removeCookie('cert_popup', true, { path: '/', expires: 12 * 60 * 60 * 1000 });
								}							
								location.reload();
							},'json');
						});
					}
				} else {
					if($.inArray(property.PAGE, ['_register', '_login', '_forgot', '_mypost', '_myinfo']) == -1) {
						var modal_content = '<p class="text-center">' + $.lang[LANG]['siteum.cert.identify.verification.txt.1'] + '</p>\
							<div class="info">\
							' + $.lang[LANG]['siteum.cert.identify.verification.txt.2'] + '\
							</div>';

						if(data.cert == 'N') {
				        	modal_content += cert_form;
							$(this).showModalFlat($.lang[LANG]['siteum.cert.identify.verification'], modal_content, true, true, function() {
								auth_type_check(true);
							}, $.lang[LANG]['siteum.cert.identify.colse.btn'], $.lang[LANG]['siteum.cert.identify.verification.btn'],'modal-dialog cl-cmmodal cl-s-btn w560 cl-p70 cl-modal cl-close-btn user-not-cert-modal', false, function(){ //close
								$.getJSON('/umember/login/out', function(r) {
									console.log(r);
									location.href = r.url;
									// location.href = '/';
								},'json');
							}, '', function() { //hide
								$.getJSON('/umember/login/out', function(r) {
									console.log(r);
									location.href = r.url;
									// location.href = '/';
								},'json');
							});
						}
					}
				}
			} else if(property.CERT_USE == 'A') {
				if(!data.userid){
					if(property.ONE && !property.VIEW) { //onepage site
						var onpage_seq = property.pageContent.index[0]['seq'];
						if(onpage_seq!='login' && onpage_seq!='register' && onpage_seq!='forgot'){
							location.href='/_login';
						}
					} else {
						if(property.PAGE!='_login' && property.PAGE!='_register' && property.PAGE!='_forgot') {
							location.href='/_login';
						}
					}
					
				} else {
					var str = '\
					<div class="site-lock-block adultonly">\
						<div class="inner-box text-center">\
							<div class="form-inline">\
								<div class="text">\
								'+cert_form+'\
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><path class="st54" d="M49.68 82.35h-4.82V41.79l-8 4.89v-4.76l8.57-5.52h4.25v45.95z"/><path class="st54" d="M80.58 44.77c.42 1.35.78 3.33 1.08 5.94.3 2.6.44 5.83.44 9.68 0 2.71-.18 5.34-.54 7.9-.36 2.56-.98 4.92-1.87 7.08-.97 2.24-2.34 4.04-4.09 5.4-1.76 1.35-3.99 2.03-6.7 2.03-1.86 0-3.54-.31-5.05-.92-1.5-.61-2.74-1.38-3.71-2.32a9.926 9.926 0 0 1-2.13-3.43c-.49-1.31-.73-2.52-.73-3.62h5.65c0 .51.1 1.2.29 2.06.19.87.52 1.6.98 2.19.46.59 1.11 1.1 1.94 1.52.83.42 1.79.63 2.89.63 1.48 0 2.78-.53 3.9-1.59s1.98-2.41 2.57-4.06c.59-1.65 1.03-3.37 1.3-5.17s.41-3.5.41-5.11v-2.41c-.85 1.23-1.9 2.22-3.17 2.98-1.61.97-3.28 1.46-5.01 1.46-2.12 0-3.9-.32-5.36-.95-1.46-.63-2.76-1.61-3.9-2.92-1.06-1.27-1.86-2.86-2.41-4.76s-.83-3.87-.83-5.9c0-1.99.29-3.92.86-5.81.57-1.88 1.39-3.48 2.44-4.79 1.14-1.27 2.55-2.21 4.22-2.83 1.67-.61 3.33-.92 4.98-.92 1.61 0 3.24.32 4.89.95s3.05 1.59 4.19 2.86c1.06 1.32 1.88 2.93 2.47 4.83zm-19.17 5.78c0 1.44.17 2.8.51 4.09.34 1.29.85 2.42 1.52 3.4.68.97 1.5 1.71 2.48 2.22.97.51 1.99.76 3.05.76 1.02 0 2.01-.25 2.98-.76.97-.51 1.82-1.25 2.54-2.22.63-.97 1.13-2.1 1.49-3.4.36-1.29.54-2.66.54-4.09 0-1.44-.18-2.8-.54-4.09-.36-1.29-.86-2.42-1.49-3.4a8.128 8.128 0 0 0-2.54-2.19c-.97-.53-1.97-.79-2.98-.79-1.06 0-2.07.26-3.05.79a7.51 7.51 0 0 0-2.48 2.19c-.68.97-1.19 2.11-1.52 3.4a15.97 15.97 0 0 0-.51 4.09z"/><path class="st54" d="M119 58h-9v-9h-4v9h-9v4h9v9h4v-9h9z"/><path d="M100.91 81C93.26 95.83 77.8 106 60 106c-25.36 0-46-20.64-46-46s20.64-46 46-46c17.8 0 33.26 10.17 40.91 25h4.47C97.44 21.88 80.11 10 60 10c-27.61 0-50 22.39-50 50s22.39 50 50 50c20.11 0 37.44-11.88 45.38-29h-4.47z" fill="#e00"/></svg>\
									<p class="title">'+$.lang[LANG]['siteum.cert.adult']+'</p>\
									'+$.lang[LANG]['siteum.cert.adult.txt']+'\
									<button class="btn cl-s-btn cl-s-btn-full btn-cert" onclick="return auth_type_check(true);">\
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path d="M22 0H10C7.79 0 6 1.79 6 4v24c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zm2 28c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v24z"/><path d="M18 4h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>\
									'+$.lang[LANG]['siteum.cert.adult.btn']+'</button>\
									<a class="btn cl-s-btn cl-s-btn-primary cl-s-btn-full logout" href="javascript:;">'+ $.lang[LANG]['manager.site-um.logout'] +'</a>\
								</div>\
							</div>\
						</div>\
					</div>\
					';
					$('.header.el-menu').after(htmlspecialchars_decode(str));

					$(document).on('click', '.btn.logout', function(e){
						e.preventDefault();
						$.getJSON('/umember/login/out', function(r) {
							if($.cookie('cert_popup') !== undefined) {
								$.removeCookie('cert_popup', true, { path: '/', expires: 12 * 60 * 60 * 1000 });
							}							
							location.reload();
						},'json');
					});
				}
	    	}
		}
	}, 'json');
}

function call_auth_data(frm) {
	auth_data(frm);
}

var fonts_ko = ["@Korean", "IBM Plex Sans KR", "KoPub Batang", "Black Han Sans", "Gmarket Sans", "Godo", "Kukdetopokki", "Nanum Gothic", "Nanum Gothic Coding", "Nanum Myeongjo", "Nanum Barun Gothic", "Nanum Pen Script", "Nanum Barun Pen", "Nanum Brush Script", "Nanum Square", "Nanum Square Round", "Daraehand", "Dohyeon", "Recipekorea", "Monsori", "Noto Sans KR", "Noto Serif CJK KR", "BB Tree Gothic","BB Tree Namu",  "BB Tree Hand", "Seoul Namsan", "Seoul Hangang", "Suit", "Spoqa Han Sans", "S CoreDream", "Yeonsung", "Oseong and HanEum", "Iropke Batang", "EASTARJET", "Jalnan", "Jeju Gothic", "Jeju Myeongjo", "Jeju Hallasan", "Jua", "Youth", "Pretendard", "Hangyule", "Hanna"],
    fonts_en = ["@English", "Abel", "Abril Fatface", "Alegreya", "Aliquam", "Archivo", "Cardo", "Chakra Petch", "Caveat", "Cookie", "Cutive Mono", "Dancing Script", "Dosis", "Fredoka One", "Great Vibes", "Ibarra Real Nova", "Inter", "Jost", "Krona One", "Lato", "League Spartan", "Libre Baskerville", "Lora", "Montserrat", "Muli", "Nixie One", "Noto Sans", "Open sans", "Oswald", "Parisienne", "Playball", "Playfair Display", "Poppins", "PT Sans", "PT Serif", "Questrial", "Quicksand", "Raleway", "Roboto", "Roboto Slab", "Source Code Pro", "Staatliches", "Stalemate", "Titillium Web"],
    fonts_ja = ["@Japanese", "Hannari", "Hokkori", "IoEI", "JKG", "MS Gothic", "MS Mincho", "Noto Sans JP", "Noto Serif JP"],
    fonts_th = ["@Thai", "Cyclin", "Hai Heritage Pro", "HFF Thai Dye", "Owah Tagu Siam NF"],
    fonts_ar = ["@Arabic", "Aceh Darusalam", "Amiri", "ArabDances", "Boecklins Universe", "Catharsis Bedouin", "Himchuli", "Kanisah", "Satyajit"],
    fonts_cr = ["@Cyrillic", "20db", "Alpha Echo", "Anonymous Pro", "Arsenal", "Bebas Neue", "Bitter", "Charis SIL", "Fira Mono", "Lato CR"],
    fonts_he = ["@Hebrew", "Alef", "Ezra SIL", "MendelSiddurMW"],
    fonts_ch = ["@Chinese", "cwTeXHei", "cwTeXKai", "cwTeXMing", "cwTeXYen", "Noto Sans SC", "Noto Serif SC"],
    fonts_vi = ["@Vietnamese", "Han Nom Gothic"];
    FONTS = [];

for(i=0; i<UFONTS.length; i++){
    var fonts = eval('fonts_'+UFONTS[i]);
    FONTS = arrayUnique(fonts.concat(FONTS));
}

function galleryStartHover() {
    $(this).find('figure').addClass('hover');
};
function galleryCloseHover() {
    $(this).find('figure').removeClass('hover');
};
function galleryMovelink() {
	$(this).find('a').click();
};

$(function () {
	$(document).on('click', '.modoo._floating_area[data-mfltype^="ci"] ._toggle_btn', function(){
		var navi_btn = $('.modoo._floating_area[data-mfltype^="ci"]').find('.float-navi-button');

		if(navi_btn.hasClass('mfl_hide')) {
			$('.modoo._floating_area[data-mfltype^="ci"]').removeClass('fl_open').addClass('fl_open');
			$('.modoo._floating_area[data-mfltype^="ci"]').find('.float-navi-button').removeClass('mfl_hide');
			$(this).removeClass('float-navi-open').addClass('float-navi-open');
			$(this).find('._icon_area').removeClass('nicon_more4').addClass('nicon_close');
		} else {
			$('.modoo._floating_area[data-mfltype^="ci"]').removeClass('fl_open');
			$('.modoo._floating_area[data-mfltype^="ci"]').find('.float-navi-button').addClass('mfl_hide');
			$(this).removeClass('float-navi-open');
			$(this).find('._icon_area').removeClass('nicon_close').addClass('nicon_more4');
		}
		
	});

	$(document).on('click', '.nonePrice', function () {
		alert('로그인 후 이용이 가능합니다.');
		if (property['VALIDTYPE'] != 'SM') {
			$('.login .cl_icon_profile').click();
		} else {
			location.href='/_login';
		}
		return false;
	});
});

var naverLogCallback = function(callback) {
	if($('#naverLogload').length == 0) {
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.id= 'naverLogload';
		script.src= '//wcs.naver.net/wcslog.js';
		script.addEventListener('load', callback);
		head.appendChild(script)
	} else {
		if(typeof callback == 'function') {
			callback();
		}
	}
}

var member_only_item = function() {
	alert('로그인 후 이용이 가능합니다');
	location.href = "/_login";
}

var syncAppendGalleryFrame = function(tpl, seq, elsettings, bt_type, elcss) {
    tpl.find('[data-gallery]').attr('data-gallery', '#sframe-' + seq);

    var settings = (typeof elsettings == 'object') ? elsettings : {};
    if ($.isEmptyObject(settings)) settings = (typeof elsettings != 'undefined' && elsettings) ? $.parseJSON(elsettings) : {};
    var img_onoff = (typeof settings.img_original_display != 'undefined' && settings.img_original_display) ? settings.img_original_display : 'OFF',
        title_onoff = (typeof settings.gframe_title_visible != 'undefined' && settings.gframe_title_visible == 'OFF') ? false : true,
        autoplay = (typeof settings.gframe_autoplay != 'undefined' && settings.gframe_autoplay == 'ON') ? true : false,
        interval = (typeof settings.gframe_interval != 'undefined' && settings.gframe_interval) ? settings.gframe_interval : 5000,
        like_onoff = (typeof settings.like_display != 'undefined' && settings.like_display == 'ON') ? settings.like_display : 'OFF';

    tpl.find('[data-gallery]').attr({ 'data-img-original': img_onoff, 'data-gallery-title': title_onoff, 'data-gallery-like': like_onoff });
    if (!title_onoff) {
        tpl.find('[data-gallery]').attr({ 'data-title': '' });
    }

    syncGalleryFrame(seq, autoplay, interval, bt_type);
    syncGalleryFrameCss(seq, settings);
    return tpl;
}

var syncGalleryFrameCss = function(seq, elsettings) {
    var elname = '.userEL' + seq;
    var gframe = '#sframe-' + seq;
    if($('.sframeCss' + seq).length == 0) $('#dsgn-body').after('<style class="sframeCss' + seq + '"></style>');
    var like_fill = (elsettings.gl_like_color !== undefined)? elsettings.gl_like_color : ((property.PARENT.mode=='project') ? '#505050':'#8e9095');
    var likeActive_fill = (elsettings.gl_likeActive_color !== undefined)? elsettings.gl_likeActive_color:'#ee445f';
    var galleryStyle = '';

    galleryStyle += gframe + '.blueimp-gallery .gallery-like > svg{fill:' + like_fill + ';}\n';
    galleryStyle += gframe + '.blueimp-gallery .gallery-like.active > svg, ' + gframe + '.blueimp-gallery .gallery-like.active > svg > path:first-child {fill:' + likeActive_fill + ';}\n';

    $('.sframeCss' + seq).text(galleryStyle);
}

var syncGalleryFrame = function(id, autoplay, interval, bt_type) {
    if (typeof bt_type == 'undefined' || !bt_type) bt_type = 'gallery';

    // $('#sframe-' + id).remove();
    if($('#sframe-' + id).length == 0) {
        var str = '\
        <div id="sframe-' + id + '" class="blueimp-gallery blueimp-gallery-controls" data-start-slideshow="' + autoplay + '" data-slideshow-interval="' + interval + '">\
            <div class="slides"></div>\
            <div class="zoomable hide"></div>\
            <h3 class="title"></h3>\
            <a class="prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="M31.33 42 12 22 31.33 2l.67.69L13.34 22 32 41.31z"/></svg></a>\
            <a class="next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44"><path d="M12.67 2 32 22 12.67 42l-.67-.69L30.66 22 12 2.69z"/></svg></a>\
            <a class="close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22"><polygon points="22 1.06 20.94 0 11 9.94 1.06 0 0 1.06 9.94 11 0 20.94 1.06 22 11 12.06 20.94 22 22 20.94 12.06 11 "/></svg></a>\
            <a class="play-pause">\
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path d="m5.3 4.08 17 9.92-17 9.92V4.08m-.4-2.1c-.73 0-1.4.58-1.4 1.4v21.24a1.397 1.397 0 0 0 2.1 1.21l18.19-10.62c.93-.54.93-1.88 0-2.42L5.61 2.17c-.23-.13-.47-.19-.71-.19z"/></svg>\
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g><path d="M7.6 25.5c-.77 0-1.4-.63-1.4-1.4V3.9c0-.77.63-1.4 1.4-1.4.77 0 1.4.63 1.4 1.4v20.2c0 .77-.63 1.4-1.4 1.4zM20.4 25.5c-.77 0-1.4-.63-1.4-1.4V3.9c0-.77.63-1.4 1.4-1.4.77 0 1.4.63 1.4 1.4v20.2c0 .77-.63 1.4-1.4 1.4z"/></g></svg>\
            </a>\
            <a class="gallery-like"></a>\
            <ol class="indicator"></ol>\
        </div>\
        ';

        $('.' + bt_type + '-frame').append(str);
    }
}