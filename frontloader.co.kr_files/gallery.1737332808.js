if(typeof isELVIEW == 'undefined') isELVIEW = false;
var elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';
var elGalleryJS = {};

// $('body').removeClass('off-config overflow-hidden');

var setGalleryJS = function(callPointStatus,gEL) {
	// console.log('set gallery js')
	/*
		0.	gjs00SetBody()			- body
			gjs01SetFixedscroll(gEL)- fixedscroll block
			
		// REMOVE (2024-10-22)
		1.	gjs10Load(gEL,g_js,g_js_code)	- Load CSS / Javacript File

		2.	gjs20Load(gEL,g_js,g_js_code)	- Load gjs
	*/

	if(gEL && gEL instanceof jQuery) gEL = gEL.get(0);
	var g_js = $(gEL).find('.gjs').attr('data-js');
	if(typeof g_js == 'undefined' || !g_js) return false;

	var g_js_code = $(gEL).find('.gjs').attr('data-js-code');
	if(typeof g_js_code == 'undefined' || !g_js_code) return false;

	if(g_js) $(gEL).attr('data-gjs',g_js+g_js_code);
	gjs01SetFixedscroll(gEL);

	var gjs = g_js+g_js_code,
		// gjs_selector = $(gEL).find('.gjs').attr('data-js-selector'),
		g_id = $(gEL).attr('data-id'),
		// g_name = $(gEL).attr('data-name'),
		// g_feature = $(gEL).attr('data-feature'),
		isOnlySet = ($('#el-blockConfig').hasClass('open')) ? true : false,
		isFirst = (typeof elGalleryJS[g_id] == 'undefined') ? true : false,
		isStart = false,
		isEmpty = ($(gEL).find('[data-loop="true"]').is('.empty') || $(gEL).find('[data-loop="true"] .grid.empty-txt').length > 0) ? true : false;

	var	move_gitem = '',
		cookie_g = $.cookie('gallery'),
		cookie_gitem = $.cookie('gallery-item');

	if(	typeof cookie_g != 'undefined' && 
		$(gEL).attr('data-id') == cookie_g && 
		$(gEL).find('.gallery-item[data-seq='+cookie_gitem+']').length > 0
	) {
		move_gitem = cookie_gitem;
		$.removeCookie('gallery', { path: '/' });
		$.removeCookie('gallery-item', { path : '/' });
	}

	if(typeof gEL == 'undefined' || $(gEL).length == 0 ) {
		gjs00SetBody();
		return false;
	}
	if($(gEL).find('input.gjs').length == 0) {
		$(gEL).removeAttr('data-gjs').removeAttr('data-fixedscroll');
		gjs00SetBody();
		return false;
	}
	// console.log('--[00: setGalleryJS(___'+callPointStatus+'____,' + $(gEL).attr('data-id') + ') ]-----------------------------------------------------------------------------------------------------');

	
	if(move_gitem != '') {
		// console.log('gjs: '+gjs);
		// console.log('g_id: '+g_id);
		// console.log('move_gitem: '+move_gitem);

		if($.inArray(gjs, ['touchslider1','fixedscroll3','fixedscroll4']) > -1) {
			// console.log('moveGallery  premium');
			setLoadmoreGalleryJS(gjs,g_id,true,move_gitem);
		} else {
			// console.log('moveGallery  default');
			var mh = getMenuHeight(),
				bh = $.siteBanner.getBandHeight(),
				enh = getEditNavbarHeight(),
				offset = ($('.dsgn-body').hasClass('sidebar')) ? ((bh > 0) ? -bh : 0) : -(mh+bh),
				delay_time = 1000,
				delay_time = 1000,
				isAnimate = false;
				$moveDiv = $('.dsgn-body'),
				$moveGitem = $(gEL).find('.gallery-item[data-seq="'+move_gitem+'"]');

			if($moveGitem.length == 0) return false;
			switch(gjs) {
				case 'fixedscroll1':
					$moveDiv = $(gEL);
					offset = -parseInt($moveGitem.css('margin-top'));
					break;

				case 'fixedscroll2':
					isAnimate = true;
					delay_time = 1500; //body top 자리 잡는 시간 추가
					$moveDiv = $('html');

				default:
					break;
			}

			setTimeout(function() {
				if(isAnimate) $moveDiv.animate({'scrollTop': $moveGitem.offset().top + offset}, 1000, 'easeInOutQuart');
				else $moveDiv.scrollTo($moveGitem, 1000,{offset: offset, easing: 'easeInOutQuart'});
			}, delay_time);
		}
	}

	// console.log(elGalleryJS);
	// console.log(elGalleryJS[g_id]);

	// console.log('gjs: '+gjs);
	// console.log('isOnlySet: '+isOnlySet);
	// console.log('isFirst: '+isFirst);
	// console.log('isEmpty: '+isEmpty);

	if(isEmpty) {
		if($.inArray(gjs, ['touchslider1','fixedscroll3']) > -1) {
			if(typeof elGalleryJS[g_id] == 'object' && typeof elGalleryJS[g_id].gjs_destroy == 'function') elGalleryJS[g_id].gjs_destroy();
		}
		if(gjs == 'fixedscroll1') isEmpty = false;
		if(gjs == 'fixedscroll3') $(gEL).find('.ready').removeClass('ready');
		if(gjs == 'fixedscroll4') $(gEL).find('.fs-container').removeAttr('style');
	}


	if(typeof callPointStatus == 'undefined') callPointStatus = '';
	switch(callPointStatus) {
		case 'elview-block':
			if(!isFirst) {
				elGalleryJS[g_id] = false;
				isOnlySet = true;
			}
			break;
		case 'reorder-block':
			// ModalPlugin.js - reorderModal
			if($.inArray(gjs,['touchslider1','fixedscroll4']) > -1) elGalleryJS[g_id] = false; 
			if($.inArray(gjs,['fixedscroll1']) > -1) isOnlySet = true;
			break;

		case 'wait-block':
			// gallery.js - gjs20Load() touchslider1 (페이지 내 같은 블럭 여러개 있을경우, 순차 처리)
		case 'load-block':
			// gallery.js - startGalleryJS() undefined
			// config.js - elPush
			if(!isFirst) {
				if(isOnlySet) {
					if($.inArray(gjs,['touchslider1','fixedscroll4']) > -1) elGalleryJS[g_id] = false;
					if($.inArray(gjs,['touchslider1']) > -1) $(gEL).attr('data-gjs-status', 'wait');
				}
			}
			break;

		case 'reload-block':
			// gallery.js - startGalleryJS() boolean
			// block_config.js - loadGalleryInitList
			if($.inArray(gjs,['touchslider1','fixedscroll3','fixedscroll4']) > -1) elGalleryJS[g_id] = false;
			if($.inArray(gjs,['touchslider1','fixedscroll3','fixedscroll4']) > -1) isOnlySet = false;
			break;

		case 'add-loop': 
			// config.js - gallery-loadmore click
			// render.js - gallery-loadmore click

			if(!isFirst) {
				if($.inArray(gjs,['touchslider1','fixedscroll4']) > -1) elGalleryJS[g_id] = false;
			}
			if($.inArray(gjs,['fixedscroll1', 'fixedscroll2']) > -1) isOnlySet = true;
			break;

		case 'change-loop':
			// config.js - gallery-category-nav li a click
			// render.js - gallery-category-nav li a click
			if(!isFirst) {
				if($.inArray(gjs,['touchslider1','fixedscroll4']) > -1) elGalleryJS[g_id] = false; 
				if($.inArray(gjs,['fixedscroll1']) > -1) isOnlySet = true;
			}
			break;

		case 'change-swiper':
			if(gjs == 'fixedscroll3') isStart = true;
			break;

		default:
			break;
	}

	// console.log('isFirst: '+isFirst);
	// console.log('isEmpty: '+isEmpty);
	// console.log('isStart: '+isStart);
	// console.log('isOnlySet: '+isOnlySet);

	// console.log('elGalleryJS: ');
	// console.log(elGalleryJS);

	if(isEmpty) return false;
	if(isStart) {
		startGalleryJS(gEL);
		return false;
	}

	if(isOnlySet) {
		// console.log('isOnlySet');
	} else {
		gjs20Load(gEL,g_js,String(g_js_code));
	}
}

var gjs00SetBody = function(onclass,gjs) {
	console.log('--[00: gjs00SetBody('+onclass+','+gjs+') ]----------------------');

	if(typeof gjs == 'undefined' && gjs != 'fixedscroll2') $('body').removeClass('off-config overflow-hidden');

	if(	(typeof MODE != 'undefined' && $.inArray(MODE, ['config','demo']) > -1) && 
		(typeof onclass == 'string' && onclass)
	) {
		$('body').addClass(onclass);
		$('header.navbar').closest('.el-menu').css('z-index','126');
		if($('header.navbar').hasClass('sidebar')) {
		} else {
			$('header.navbar').css('width','100%');
		}
	}

	if(typeof gjs != 'undefined' && gjs) $('body').attr('data-gjs',gjs);
	else $('body').removeAttr('data-gjs');

	if(isELVIEW) $('body').attr('data-viewer',true);
	else $('body').removeAttr('data-viewer');
}

var gjs01SetFixedscroll = function(gEL) {
	// console.log('--[01: gjs01SetFixedscroll(gEL) ]----------------------');

	$('#goto-top').hide();
	
	if($(gEL).hasClass('reorderBlock')) elDefaultClass = 'reorderBlock';
	else elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';

	var g_name = $(gEL).attr('data-name'),
		g_js = ($(gEL).find('.gjs').length > 0) ? $(gEL).find('.gjs').attr('data-js') : '',
		g_js_code = (g_js) ? $(gEL).find('.gjs').attr('data-js-code') : '';

	$(gEL).attr('data-fixedscroll',true);
	
	if(g_js) $(gEL).attr('data-gjs',g_js+g_js_code);

	if(isELVIEW) {
		document.querySelector('.'+g_name).style.setProperty('--menu-height', '0px', null);
	} else {
		var __menu_height = getComputedStyle(document.querySelector('.'+g_name)).getPropertyValue('--menu-height');
		if(typeof __menu_height != 'undefined' && __menu_height) {
			var mh = getMenuHeight(),
				bh = $.siteBanner.getBandHeight();
			document.querySelector('.'+g_name).style.setProperty('--menu-height', (mh+bh)+'px', null);
		}
	}
}

var gjs20Load = function(gEL,g_js,g_js_code) {
	if(typeof gEL == 'undefined' || $(gEL).length == 0) return false;
	// console.log('--[02: gjs20Load(' + $(gEL).attr('data-id') + ','+g_js+','+g_js_code+') ]----------------------');

	var g_id = $(gEL).attr('data-id'),
		g_name = $(gEL).attr('data-name'),
		g_feature = $(gEL).attr('data-feature'),
		selector = $(gEL).find('.gjs').attr('data-js-selector');

	if(typeof g_id == 'undefined' || $('.'+g_name).length == 0) return false;

	var isFirst = (typeof elGalleryJS[g_id] == 'undefined') ? true : false,
		isReruning = (typeof elGalleryJS[g_id] == 'boolean') ? true : false;

	if(!isFirst) {
		var checkReorderBlock = ($(gEL).is('.reorderBlock') || $(gEL).closest('.new-dsgn-body').length > 0 || $(gEL).closest('.reorderModal').length > 0) ? true : false,
			checkReset = (isELVIEW && $.inArray(g_js+g_js_code, ['fixedscroll4']) > -1) ? true : false;

		if(checkReorderBlock || checkReset || isReruning) {
			isFirst = true;
			delete elGalleryJS[g_id];
		}
	}

	switch(g_js) {
		case 'touchslider':
			if(g_js_code == '1') { 
				if($(gEL).is('[data-feature*=fixedscroll]')) {
					gjs00SetBody();
				}
				if(typeof Touchslider1 == 'undefined') $(gEL).attr('data-gjs-status', 'wait');
				else {
					$(gEL).removeAttr('data-gjs-status');

					if(isFirst) {
						elGalleryJS[g_id] = new Touchslider1(document.querySelector('.'+g_name+' '+selector));
					} else {
						elGalleryJS[g_id].gjs_load(document.querySelector('.'+g_name+' '+selector));
					}

					if($('.element[data-gjs][data-gjs-status="wait"]').length > 0) setGalleryJS('wait-block',$('.element[data-gjs][data-gjs-status="wait"]').eq(0));
				}
			}
			break;

		case 'fixedscroll':
			if(g_js_code == '1') {
				if(typeof VisualImgShow == 'undefined' && typeof VisualVdoShow == 'undefined') return false;

				if($(gEL).is('[data-feature*=fixedscroll]')) {
					gjs00SetBody('',g_js+g_js_code);
				}

				if(isFirst) {
					var visual_type = $(gEL).find('[data-visual="true"]').attr('data-visual-type');
					elGalleryJS[g_id] = (visual_type == 'image') ? new VisualImgShow(document.querySelector('.'+g_name)) : new VisualVdoShow(document.querySelector('.'+g_name));
				} else {
					elGalleryJS[g_id].gjs_load(document.querySelector('.'+g_name));
				}
				
				// 내부 스크롤을 감지할 요소 선택
				if($(gEL).find('.content-wrap').length) {
					$(gEL).find('.content-wrap').get(0).addEventListener('wheel', function(event) {
						event.stopPropagation();
						// 스크롤의 최상단 또는 최하단에 도달했는지 확인
						const atTop = this.scrollTop === 0;
						const atBottom = this.scrollHeight - this.scrollTop === this.clientHeight;
						
						var elem = typeof PAGE_MODE != 'undefined' && PAGE_MODE == 'c' ? document.querySelector('.dsgn-body') : window;
						// 최상단 또는 최하단에 도달했을 때
						if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
							// HTML로 스크롤 이벤트 전달
							event.preventDefault(); // 기본 동작을 막아 내부 요소의 스크롤을 멈춤
							elem.scrollBy({
								top: event.deltaY, // 스크롤 방향에 따라 스크롤 이동
								// behavior: 'auto' // 부드러운 스크롤 효과 적용
							});
						}
					}, {passive: false });
				}
			} else if (g_js_code == '2') {
				if(typeof Fixedscroll2 == 'undefined') return false;

				if($(gEL).is('[data-feature*=fixedscroll]')) {
					gjs00SetBody('off-config',g_js+g_js_code);
				}
				var scroll_target = (isELVIEW) ? $('.elviewwrap') : $(window);
				if(isELVIEW) $('#element-display .elviewwrap').attr('data-addCSS','fixedscroll2');

				Fixedscroll2($(gEL));
				scroll_target.scroll(function(event) {
					Fixedscroll2($(gEL));
				});
				scroll_target.resize(function(event) {
					Fixedscroll2($(gEL));
				});

				// 내부 스크롤을 감지할 요소 선택
				if($(gEL).find('.content-wrap').length) {
					$(gEL).find('.content-wrap').get(0).addEventListener('wheel', function(event) {
						event.stopPropagation();
						// 스크롤의 최상단 또는 최하단에 도달했는지 확인
						const atTop = this.scrollTop === 0;
						const atBottom = this.scrollHeight - this.scrollTop === this.clientHeight;
						
						var elem = typeof PAGE_MODE != 'undefined' && PAGE_MODE == 'c' ? document.querySelector('.dsgn-body') : window;
						// 최상단 또는 최하단에 도달했을 때
						if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
							// HTML로 스크롤 이벤트 전달
							event.preventDefault(); // 기본 동작을 막아 내부 요소의 스크롤을 멈춤
							elem.scrollBy({
								top: event.deltaY, // 스크롤 방향에 따라 스크롤 이동
								// behavior: 'auto' // 부드러운 스크롤 효과 적용
							});
						}
					}, { passive: false });
				}
			} else if(g_js_code == '3') {
				if(typeof Fixedscroll3 == 'undefined') return false;
				if($(gEL).is('[data-feature*=fixedscroll]')) {
					gjs00SetBody('off-config overflow-hidden',g_js+g_js_code);
				}

				if(isFirst) {
					elGalleryJS[g_id] = new Fixedscroll3(document.querySelector('.'+g_name+' '+selector));
				} else {
					elGalleryJS[g_id].gjs_load(document.querySelector('.'+g_name+' '+selector));
				}


			} else if(g_js_code == '4') {
				if(typeof Fixedscroll4 == 'undefined') return false;
				
				if($(gEL).is('[data-feature*=fixedscroll]')) {
					gjs00SetBody('',g_js+g_js_code);
				}
				if(typeof elGalleryJS[g_id] == 'undefined') {
					elGalleryJS[g_id] = new Fixedscroll4(document.querySelector('.'+g_name+' '+selector));
				} else {
					elGalleryJS[g_id].gjs_load(document.querySelector('.'+g_name+' '+selector));
				}


			} else {
				gjs00SetBody();
			}


			/* 보류 */
			// if(g_js_code == 'hold1') {
			// 	if(typeof Fixedscrollhold1 == 'undefined') return false;

			// 	gjs00SetBody('off-config overflow-hidden');
			// 	var scroll_target = $(gEL).find(selector);
			// 	Fixedscrollhold1($(gEL),selector);
			// }

			break;

		default:
			gjs00SetBody();
			break;
	}

}



/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
var stopGalleryJS = function(gEL) {
	if(typeof gEL == 'undefined' || $(gEL).length == 0) return false;
	// console.log('--[ stopGalleryJS(' + $(gEL).attr('data-id') + ') ]-----------------------------------------------------------------------------------------------------');

	var g_id = $(gEL).attr('data-id'),
		g_name = $(gEL).attr('data-name'),
		g_feature = $(gEL).attr('data-feature'),
		selector = $(gEL).find('.gjs').attr('data-js-selector');

	if(	typeof g_id == 'undefined' || typeof elGalleryJS[g_id] == 'undefined') return false;

	if(	typeof elGalleryJS[g_id].gjs_stop == 'function' && 
		typeof elGalleryJS[g_id].DOM != 'undefined'
	) {
		elGalleryJS[g_id].gjs_stop();
	} else {
		// console.log('gjs_stop none..........'+$(gEL).attr('data-gjs'));
	}
}

var startGalleryJS = function(gEL) {
	if(typeof gEL == 'undefined' || $(gEL).length == 0) return false;
	
	// console.log('--[ startGalleryJS(' + $(gEL).attr('data-id') + ') ]-----------------------------------------------------------------------------------------------------');

	var g_id = $(gEL).attr('data-id'),
		g_name = $(gEL).attr('data-name'),
		g_feature = $(gEL).attr('data-feature'),
		selector = $(gEL).find('.gjs').attr('data-js-selector');

	if(typeof g_id == 'undefined') return false;

	if(	typeof elGalleryJS[g_id] == 'undefined' || typeof elGalleryJS[g_id] == 'boolean') {
		var gjs_status = (typeof elGalleryJS[g_id] == 'boolean') ? 'reload-block' : 'load-block';
		setGalleryJS(gjs_status,$(gEL));
	} else if(typeof elGalleryJS[g_id].gjs_start == 'function' && typeof elGalleryJS[g_id].DOM != 'undefined') {
		elGalleryJS[g_id].gjs_start();
	} else {
	}
	// else if(typeof elGalleryJS[g_id].gjs_load == 'function' && typeof elGalleryJS[g_id].DOM != 'undefined') {
	// 	loadGalleryJS(gEL);
	// }

}
/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

var setLoadmoreGalleryJS = function(gjs,id,onoff,move_gitem) {
	// console.log('--[ setLoadmoreGalleryJS('+gjs+','+id+','+onoff+','+move_gitem+') ]-----------------------------------------------------------------------------------------------------');
	var isMove = (typeof move_gitem != 'undefined' && move_gitem) ? true : false;

	if( typeof gjs != 'undefined' && gjs && typeof id != 'undefined' && id ) {
		if(typeof onoff == 'undefined') onoff = false;
		var cookie_val = onoff;

		var checkLoadMore = ['touchslider1', 'fixedscroll3', 'fixedscroll4'];
		if($.inArray(gjs,checkLoadMore) > -1) {
			if(onoff) {
				var $galleryEL = $('.element[data-id="' + id +'"]'),
					$galleryItem = (isMove) ? $galleryEL.find('.gallery-item[data-seq="'+move_gitem+'"]') : null;

				switch(gjs) {
					case 'touchslider1' :
						if(isMove) cookie_val = ($galleryItem.length > 0) ? -$galleryItem.position().left : null;
						else cookie_val = $galleryEL.find('.draggable').css('left').replace('px','');
						break;
					case 'fixedscroll3':
						if(isMove) cookie_val = ($galleryItem.length > 0) ? Number($galleryItem.attr('data-index')) : null;
						else cookie_val = null; // gallery-loadmore click시 미적용
						break;
					case 'fixedscroll4':
						if(isMove) cookie_val = ($galleryItem.length > 0) ? Number($galleryItem.attr('data-index')) : null;
						else cookie_val = Number($galleryEL.find('.grid.slide-left').attr('data-index')) + 1;
						break;

					default:
						break;
				}

				if(cookie_val === null) return false;
				else $.cookie('gallery-'+gjs+'-'+id, cookie_val, { path: '/', expires: 12 * 60 * 60 * 1000 });
			} else {
				$.removeCookie('gallery-'+gjs+'-'+id, { path: '/' });
			}
		}
	}
}

var getEditNavbarHeight = function() {
	if($('.editor-navbar').length == 0) return 0;
	if(typeof MODE != 'undefined' && $.inArray(MODE, ['config','demo']) > -1) {
		var en_h = document.querySelector('.editor-navbar').getBoundingClientRect().height;
		return parseInt(en_h+0.5);
	} else {
		return 0;
	}
}
var	getMenuHeight = function() {
	if($('.el-menu > header').length == 0) return 0;

	var checkSidebar = $('.el-menu > header').hasClass('sidebar');
	if(checkSidebar && window.parent && window.parent != this && $('.el-menu').outerWidth() < 523) checkSidebar = false;

	var m_c = getEditNavbarHeight(),
		m_h = (checkSidebar) ? 0 : document.querySelector('.el-menu > header').getBoundingClientRect().height;
	m_h = (typeof m_h == 'undefined') ? 60 : parseInt(m_h+0.5);

	return m_h+m_c;
}

var getGalleryCateNavPosition = function(gEL) {
	// console.log('--[ getGalleryCateNavPosition(' + $(gEL).attr('data-id') + ') ]-----------------------------------------------------------------------------------------------------');

    var g_name = $(gEL).attr('data-name'),
    	gjs_name = $(gEL).find('.gjs').attr('data-js'),
        gjs_code = $(gEL).find('.gjs').attr('data-js-code'),
        gjs = gjs_name + gjs_code,
        gcate_obj = {
            'touchslider1': '.ts-container',
            'fixedscroll1': '.fixed-wrap',
            'fixedscroll2': '.fixed-wrap',
        };

    if($(gEL).attr('data-feature').length > 0) {
        gcate_obj = {
            'touchslider1': '.ts-container',
            'fixedscroll1': '.content-wrap',
            'fixedscroll2': '.content-wrap',
        };
    }

    var gcate_position = (typeof gcate_obj[gjs] != 'undefined' && gcate_obj[gjs]) ? gcate_obj[gjs] : $(gEL).find('.gjs').attr('data-js-selector');

    /* position.before(gnav) */
    return gcate_position;
}

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

var galleryLikePosition = function(gid, slide, itemSeq) {
    // console.log('galleryLikePosition');
    if($(slide).find('img').length > 0) { 
        var likeSvg = '\
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">\
            <path d="m22.76 14.7-8.74 8.97-8.75-8.97m0 0c-2.31-2.32-2.37-6.14-.13-8.53 2.24-2.4 5.93-2.46 8.24-.14.23.23.44.48.63.75 1.93-2.67 5.59-3.2 8.16-1.2s3.09 5.79 1.16 8.45c-.18.24-.37.47-.58.68"></path>\
            <path d="M14.01 24.57c-.24 0-.48-.1-.64-.27l-8.74-8.97c-2.64-2.66-2.71-7.04-.15-9.78a6.576 6.576 0 0 1 4.74-2.12c1.79-.01 3.5.67 4.8 1.96a6.576 6.576 0 0 1 3.74-1.86c1.77-.25 3.54.22 4.97 1.34 2.95 2.29 3.55 6.64 1.33 9.69-.2.28-.42.54-.66.78l-.06.06-8.68 8.9c-.17.17-.4.27-.65.27zm-8.1-10.51c0 .01.01.01 0 0l8.1 8.32 8.1-8.31.06-.06c.15-.16.3-.33.43-.52 1.65-2.27 1.21-5.51-.98-7.22a4.723 4.723 0 0 0-3.61-.97c-1.31.2-2.47.91-3.27 2a.91.91 0 0 1-.73.37c-.29 0-.56-.14-.73-.38-.16-.22-.34-.44-.54-.64a4.78 4.78 0 0 0-3.49-1.43A4.83 4.83 0 0 0 5.8 6.78c-1.91 2.04-1.86 5.31.11 7.28z"></path>\
        </svg>\
        ';
        $(gid).find('a.gallery-like').removeClass('hide big-img fullscreen').removeAttr('style').attr('data-seq', itemSeq).html(likeSvg);

        var screenSize = getScreen();
        if(screenSize >= 1200) {
            var slideContent = $(slide).find('img.slide-content');
            var marginTop = Number(slideContent.css('margin-top').replace('px', ''));
            var marginLeft = Number(slideContent.css('margin-left').replace('px', ''));
            
            if(marginLeft >= 120) {
                var positionTop = slideContent.height() + marginTop - 46;
                var positionLeft = slideContent.width() + marginLeft + 20;
                $(gid).find('a.gallery-like').css({
                    'top': positionTop + 'px',
                    'left': positionLeft + 'px'
                });
            } else {
                $(gid).find('a.gallery-like').removeAttr('style').addClass('big-img');
            }
        }
        
        if(itemSeq !== undefined) {
            var like = getLike(itemSeq);
            like.done(function(data){
                if(typeof data.own != 'undefined' && data.own) {
                    like_id = data.view;
                    // console.log(like_id);

                    $(gid).find('a.gallery-like').addClass('active').attr('data-like', like_id);
                } else {
                    $(gid).find('a.gallery-like').removeClass('active').removeAttr('data-like');
                }
            });
        }
    }
}

$('.gallery-item').die('click').live('click', function(e) {
    if($(this).find('[attr-flink]').length > 0 ) {
      e.preventDefault(); 
      return false;
    }

    if($(e.target).hasClass('like') || $(e.target).closest('.figure').hasClass('like')) {
        e.preventDefault(); 
        return false;
    }

    $('.gallery-frame .blueimp-gallery').addClass('blueimp-gallery-controls');
    $('.gallery-frame .blueimp-gallery a.zoom-in, .gallery-frame .blueimp-gallery a.zoom-out, .gallery-frame .blueimp-gallery a.view-original').remove();
    $('.gallery-frame .blueimp-gallery a.gallery-like').addClass('hide').removeClass('active').removeAttr('data-like');

    var $galleryItem = $(this);
    var $el = $galleryItem.parents('.element');
    var pid = (PAGE_MODE == 'c')? selectID : $el.attr('data-id');
    var gid = $galleryItem.find('a').attr('data-gallery');
    var eid = $galleryItem.closest('.element').attr('data-id');
    var parent = (PAGE_MODE == 'c')? PARENT:property.PARENT;
    var slideIndex = 0;

    // gallery images
    var gallerySeqArr = $('.element[data-id="'+eid+'"] .gallery-item, .galleryPL'+eid+'.gallery-popup .gallery-item').map(function() {
    	return $(this).attr('data-seq');
	}).get();
    
    var images = gallerySeqArr.reduce(function(acc, item) {
	    if (acc.indexOf(item) === -1) {
	        acc.push(item);
	    }
	    return acc;
	}, []);

    var totalSlide = (images.length == 2)? 2 : $(gid).find('.slide').length;
    // console.log('totalSlide', totalSlide);
    // console.log('images', images);
    $('.gallery-frame .blueimp-gallery .slide-index .total-slide').text(totalSlide);

    if($('.gallery-frame').find('.gallery-top-button').length < 1) $('.gallery-frame .blueimp-gallery a.close').wrap('<div class="gallery-top-button"></div>');

    if($galleryItem.find('a').attr('data-img-original') == 'ON') {
        var viewOriginal = '<a class="zoom-in" data-id="' + pid + '" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="확대"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 22.94l-6.42-6.42C19.08 14.76 20 12.49 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c2.49 0 4.76-0.92 6.52-2.42L22.94 24 24 22.94zM1.5 10c0-4.69 3.81-8.5 8.5-8.5 4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5C5.31 18.5 1.5 14.69 1.5 10z"/><polygon points="10.75 6 9.25 6 9.25 9.25 6 9.25 6 10.75 9.25 10.75 9.25 14 10.75 14 10.75 10.75 14 10.75 14 9.25 10.75 9.25 "/></svg></a>\
        <a class="zoom-out disabled" data-id="' + pid + '" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="축소"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23"><g><path d="m23 21.98-6.16-6.16a9.566 9.566 0 0 0 2.32-6.24C19.17 4.29 14.88 0 9.58 0S0 4.29 0 9.58s4.29 9.58 9.58 9.58c2.39 0 4.57-.88 6.24-2.32L21.98 23 23 21.98zM1.44 9.58c0-4.49 3.65-8.15 8.15-8.15 4.49 0 8.15 3.65 8.15 8.15s-3.65 8.15-8.15 8.15-8.15-3.66-8.15-8.15z"/><path d="M5.75 8.86h7.67v1.44H5.75z"/></g></svg></a>\
        <a class="view-original disabled" data-id="' + pid + '" data-toggle="tooltip" data-placement="bottom" data-html="true" data-original-title="화면 크기에 맞춰 확대">\
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27"><g><path d="M1 4.12v18.75h25V4.12H1zm23.5 17.26h-22V5.62h22v15.76z"/><path d="M8.03 18.19h1.56V8.81H6.47v1.57h1.56zM12.72 10.38h1.56v1.56h-1.56zM12.72 15.06h1.56v1.56h-1.56zM18.19 18.19h1.56V8.81h-3.13v1.57h1.57z"/></g></svg>\
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width="27" height="27"><path d="M24.03 4.03 24 4V3h-1l-.03-.03-.03.03H13.5v1.5h7.94L4.5 21.44V13.5H3v9.44l-.03.03L3 23v1h1l.03.03.03-.03h9.44v-1.5H5.56L22.5 5.56v7.94H24V4.06z"/></svg>\
        </a>\
        ';
        $('.gallery-frame .blueimp-gallery a.close').after(viewOriginal);
    }

    setSlideIconTooltip(gid);

    $(gid).off('slide').off('slideend');
    $(gid).on('slide', function (event, index, slide) {
        if($galleryItem.find('a').attr('data-gallery-like') === 'ON') $('.gallery-frame .blueimp-gallery a.gallery-like').removeAttr('data-like').addClass('hide');
        $('.gallery-frame .blueimp-gallery a.zoom-out').addClass('disabled');
        $('.gallery-frame .blueimp-gallery a.view-original').removeClass('fullscreen');
        $(gid).find('.slide').removeClass('fullscreen');
        $(gid).find('h3.title').removeClass('long-title visible');
        $('.gallery-frame .zoomable').removeClass('visible').addClass('hide');
        $('.gallery-frame .zoomable').find('img').remove();
    }).on('slideend', function(event, index, slide){
    	// console.log(index);
    	var itemSeq = $('.element[data-id="'+pid+'"] .gallery-item[data-index='+index+']').attr('data-seq');
    	var slideNumber = index + 1;

        if(itemSeq == undefined) {
            itemSeq = $('.galleryPL'+pid+'.gallery-popup .gallery-item[data-index='+index+']').attr('data-seq');
            if(totalSlide == 2 && index >= 2) slideNumber = index - 1;
        }
        
        $('.gallery-frame .blueimp-gallery .slide-index .current-slide').text(slideNumber);

		var setSlideIcon = function() {
			var windowWidth = $(window).width();
		    var $img = $(slide).find('.slide-content');

		    var title = $img.attr('title');
		    if(title) $img.attr('data-title', title);

		    $(gid).find('h3.title').html($img.attr('data-title'));
		    $img.removeAttr('title');
			
			if ($galleryItem.find('a').attr('data-img-original') === 'ON') {
    			var currentWidth = $img.width();
			    if(currentWidth >= windowWidth) {
			    	$(gid).find('.view-original').addClass('disabled');
			    } else {
			    	$(gid).find('.view-original').removeClass('disabled');
			    }
			}

            if($galleryItem.find('a').attr('data-gallery-like') === 'ON') {
                galleryLikePosition(gid, slide, itemSeq);
            }

            if(windowWidth <= 480) {
        		var titleWidth = $(gid).find('h3.title').width();
        		if(titleWidth >= (windowWidth - 207)) $(gid).find('h3.title').addClass('long-title');
		    }
		}

        if(!$(slide).hasClass('slide-loading')) {
            setSlideIcon();
        } else {
            // 이미지 로드를 대기하는 경우
            var checkLoaded = function () {
                if(!$(slide).hasClass('slide-loading')) {
                    setSlideIcon();
                } else {
                    // 이미지가 완전히 로드되지 않은 경우 재귀 호출
                    setTimeout(checkLoaded, 100);
                }
            };
            setTimeout(checkLoaded, 100);
        }
    });

    $('.gallery-frame .blueimp-gallery').find('h3.title').html($galleryItem.find('a').attr('data-title'));
    
    $.cookie('gallery-item', $galleryItem.attr('data-seq'), { path : '/', expires: 12 * 60 * 60 * 1000 });
    if(parent.prev != null) $('.data-page-prev').addClass('active');
    if(parent.next != null) $('.data-page-next').addClass('active');
    e.stopPropagation();

    $('body').off('dblclick', '.gallery-frame .blueimp-gallery .slide-content').on('dblclick', '.gallery-frame .blueimp-gallery .slide-content', function(e) {
        $('.gallery-frame .blueimp-gallery a.view-original').toggleClass('fullscreen');
        var idx = 0,
			eid = $('.gallery-frame .blueimp-gallery a.view-original').attr('data-id');
        
        var gid = '#gframe-' + eid;
        $(gid + ' .slide').each(function(i,v) {
            var trans = $(v).attr('style');
            if(trans.indexOf('translate(0px, 0px)') > -1 || trans.indexOf('transform: translate(0px) translateZ(0px)') > -1) {
                idx=i;
            }
        });

        var $slide = $(gid + ' .slide[data-index="' + idx + '"]');
        var $img = $slide.find('.slide-content');
        if($('.gallery-frame .blueimp-gallery a.view-original').hasClass('fullscreen')) {
    		var img = $img[0];

    		var currentWidth = $img.width();
		    var currentHeight = $img.height();
		    var windowWidth = $(window).width()-8;
		    var windowHeight = $(window).height();
	    	var naturalWidth = img.naturalWidth,
	            naturalHeight = img.naturalHeight;
	        
	        scale = (windowWidth / currentWidth).toFixed(15);
    	} else {
    		scale = 1;
    	}

        setSlideIconTooltip(gid);
        setSlideImgScale($slide, scale);
    });

    $('body').off('click','.gallery-frame .blueimp-gallery a.view-original').on('click','.gallery-frame .blueimp-gallery a.view-original', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('fullscreen');

        var idx = 0,
			eid = $(this).attr('data-id');
        
        var gid = '#gframe-' + eid;
        $(gid + ' .slide').each(function(i,v) {
            var trans = $(v).attr('style');
            if(trans.indexOf('translate(0px, 0px)') > -1 || trans.indexOf('transform: translate(0px) translateZ(0px)') > -1) {
                idx=i;
            }
        });
        setSlideIconTooltip(gid);
		$(gid).find('.view-original[data-toggle="tooltip"]').tooltip('show');

        var $slide = $(gid + ' .slide[data-index="' + idx + '"]');
        var $img = $slide.find('.slide-content');
        if($(this).hasClass('fullscreen')) {
    		var img = $img[0];

    		var currentWidth = $img.width();
		    var currentHeight = $img.height();
		    var windowWidth = $(window).width()-8;
		    var windowHeight = $(window).height();
	    	var naturalWidth = img.naturalWidth,
	            naturalHeight = img.naturalHeight;
	        
	        scale = (windowWidth / currentWidth).toFixed(15);
    	} else {
    		scale = 1;
    	}

        setSlideImgScale($slide, scale);
    });

    $('body').on('click','.gallery-frame .blueimp-gallery a.zoom-in, .gallery-frame .blueimp-gallery a.zoom-out', function(e) {
        var idx = 0,
            eid = $(this).attr('data-id');

        var gid = '#gframe-' + eid;
        $('#gframe-' + eid + ' .slide').each(function(i,v) {
            var trans = $(v).attr('style');
            if(trans.indexOf('translate(0px, 0px)') > -1 || trans.indexOf('transform: translate(0px) translateZ(0px)') > -1) {
                idx=i;
            }
        });

        var $slide = $(gid + ' .slide[data-index="' + idx + '"]');
        var scale = $('.gallery-frame .zoomable img').attr('data-scale');
        if(scale === undefined) scale = 1;

        if($(this).hasClass('zoom-in')) {
    		$('.gallery-frame .blueimp-gallery a.gallery-like').addClass('fullscreen');
    		$('.gallery-frame .blueimp-gallery a.view-original').removeClass('disabled').addClass('fullscreen');

            scale = Number(scale) + 0.5;
        } else {
            if(scale > 1) scale = Number(scale) - 0.5;
            if(scale < 1) scale = 1;
            if(scale == 1) {
    			$('.gallery-frame .blueimp-gallery a.gallery-like').removeClass('fullscreen');
    			$('.gallery-frame .blueimp-gallery a.view-original').removeClass('fullscreen');
            }
        }
        
        setSlideIconTooltip(gid);
        setSlideImgScale($slide, scale);
        
        e.stopPropagation();
    });

    $('body').off('click','.gallery-frame .blueimp-gallery a.play-pause').on('click','.gallery-frame .blueimp-gallery a.play-pause', function(e) {
	    setSlideIconTooltip(gid);
		$(this).tooltip('show');
    });

    $('body').off('click','.gallery-frame .blueimp-gallery .title.long-title').on('click','.gallery-frame .blueimp-gallery .title.long-title', function(e) {
    	$(this).toggleClass('visible');
    });
});

var setSlideImgScale = function($slide, scale) {
	// used 01. gallery block gallery mode
	// used 002. resourcebox image

    var checkResourcebox = $slide.is('#rframe'),
		$img = $slide.find('.slide-content'),
		slideFrame = $slide.closest('.blueimp-gallery'),
		slideZoomable = slideFrame.find('.zoomable');

	var currentWidth = $img.width();
    var currentHeight = $img.height();

    if(slideZoomable.find('img').length == 0 || checkResourcebox) {
		if(checkResourcebox) slideZoomable.empty();

    	var $cloneImg = $slide.find('.slide-content').clone();
	    $cloneImg.addClass('clone').attr('data-width', currentWidth).attr('data-height', currentHeight);
	    slideZoomable.append($cloneImg);
    }

	var slideZoomableImg = slideZoomable.find('img');

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scaledWidth = currentWidth * scale;
    var scaledHeight = currentHeight * scale;

    var scrollTop = slideZoomable.scrollTop();
    var scrollLeft = slideZoomable.scrollLeft();

    var offsetX = ((windowWidth - currentWidth) > 0) ? (windowWidth - currentWidth) * 0.5 : 0;
    var offsetY = ((windowHeight - currentHeight) > 0) ? (windowHeight - currentHeight) * 0.5 : 0;
    var scaledOffsetX = ((windowWidth - scaledWidth - 8) > 0) ? (windowWidth - scaledWidth - 8) * 0.5 : 0;
    var scaledOffsetY = ((windowHeight - scaledHeight) > 0) ? (windowHeight - scaledHeight) * 0.5 : 0;
    var offset = {top: scaledOffsetY + 'px', left: scaledOffsetX + 'px'};
    var isScroll = false;
    var centerX = 0;
    var centerY = 0;
    var scrollPositionX = 0;
    var scrollPositionY = 0;

    slideZoomable.removeClass('scroll');

    if(scaledWidth > windowWidth) {
    	slideZoomable.css('width', scaledWidth);
    	isScroll = true;
    	offset = {top: scaledOffsetY+'px', left: 0};
    }

    if(scaledHeight > windowHeight) {
    	slideZoomable.css('height', scaledHeight);
    	isScroll = true;
    	offset = {top: 0, left: scaledOffsetX+'px'};
    } 

    if(scaledWidth >= windowWidth && scaledHeight >= windowHeight) {
    	offset = {top: 0, left: 0};
    }

    if(isScroll) {
    	slideZoomable.addClass('scroll');
    	var scrollOffsetX = scaledWidth - windowWidth;
    	var scrollOffsetY = scaledHeight - windowHeight;

    	centerX = (scrollOffsetX - 8) * 0.5;
    	centerY = (scrollOffsetY - 8) * 0.5;
    	
    	scrollPositionX = (slideZoomable.attr('data-scroll-left') !== undefined)? Number(slideZoomable.attr('data-scroll-left')) * scrollOffsetX : centerX;
    	scrollPositionY = (slideZoomable.attr('data-scroll-top') !== undefined)? Number(slideZoomable.attr('data-scroll-top')) * scrollOffsetY : centerY;

		// console.log('scrollPosition', scrollPositionX, scrollPositionY);
		// console.log('center', centerX, centerY);
    }

    var scaleAnimation = Object.assign({}, offset, {width: scaledWidth+'px', height: scaledHeight+'px', scrollLeft: scrollPositionX, scrollTop: scrollPositionY});

    if (scale > 1) {
		slideFrame.find('.zoom-out').removeClass('disabled');
    	slideFrame.find('.gallery-like').addClass('fullscreen');
    	slideZoomable.removeClass('hide');
    	var zoomWidth = slideZoomableImg.attr('data-width');
        var zoomHeight = slideZoomableImg.attr('data-height');
        var initialWidth = slideZoomableImg.width();
        var initialHeight = slideZoomableImg.height();

        if(Number(zoomWidth) == currentWidth) {
        	slideZoomableImg.css({width: currentWidth+'px', height: currentHeight+'px', top: offsetY+'px', left: offsetX+'px'});
        }

        slideZoomable.addClass('visible');
        setTimeout(function(){
    		$slide.addClass('fullscreen');
    		
    		slideZoomableImg.animate(scaleAnimation, 200);
    		// console.log(initialWidth, scaledWidth);
    		if(initialWidth < windowWidth && scaledWidth > windowWidth) {
    			scrollPositionX = centerX;
    			var scrollLeft = centerX / (scaledWidth - windowWidth);
	            slideZoomable.attr({'data-scroll-left': scrollLeft});
    		}
    		if(initialHeight < windowHeight && scaledHeight > windowHeight) {
    			scrollPositionY = centerY;
    			var scrollTop = centerY / (scaledHeight - windowHeight);
	            slideZoomable.attr({'data-scroll-top': scrollTop});
    		}

    		slideZoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 200); //scroll

    		// if(scaledWidth >= windowWidth && scaledHeight >= windowHeight) slideZoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 500);

	        slideZoomableImg.attr('data-scale', scale).attr('data-width', scaledWidth).attr('data-height', scaledHeight);

	        var isDragging = false;
	        var lastX, lastY;
	        slideZoomable.off('mousedown mousemove mouseup scroll');
	        slideZoomable.on("mousedown", function(e) {
	            isDragging = true;
	            lastX = e.clientX;
	            lastY = e.clientY;
	            $(this).addClass('dragging');
	            e.preventDefault();
	            e.stopPropagation();

	        }).on("mousemove", function(e) {
	            if (isDragging) {
					var deltaX = e.clientX - lastX;
					var deltaY = e.clientY - lastY;
					$(this).scrollLeft($(this).scrollLeft() - deltaX);
					$(this).scrollTop($(this).scrollTop() - deltaY);
					lastX = e.clientX;
					lastY = e.clientY;
					e.preventDefault();
					e.stopPropagation();
	            }
	        }).on("mouseup", function() {
	            isDragging = false;
	            $(this).removeClass('dragging');
	            var scrollLeft = (($(this)[0].scrollWidth - $(this)[0].clientWidth) > 0) ? $(this).scrollLeft() / ($(this)[0].scrollWidth - $(this)[0].clientWidth) : 0;  // 가로 스크롤 좌표
			    var scrollTop = (($(this)[0].scrollHeight - $(this)[0].clientHeight) > 0) ? $(this).scrollTop() / ($(this)[0].scrollHeight - $(this)[0].clientHeight) : 0;    // 세로 스크롤 좌표

	            slideZoomable.attr({'data-scroll-top': scrollTop, 'data-scroll-left': scrollLeft});
	        });

	        slideZoomable.on('mousewheel', function(e){
	            var scrollLeft = (($(this)[0].scrollWidth - $(this)[0].clientWidth) > 0) ? $(this).scrollLeft() / ($(this)[0].scrollWidth - $(this)[0].clientWidth) : 0;  // 가로 스크롤 좌표
			    var scrollTop = (($(this)[0].scrollHeight - $(this)[0].clientHeight) > 0) ? $(this).scrollTop() / ($(this)[0].scrollHeight - $(this)[0].clientHeight) : 0;    // 세로 스크롤 좌표

	            slideZoomable.attr({'data-scroll-top': scrollTop, 'data-scroll-left': scrollLeft});
	        });
	    }, 100);
    } else { //원본 크기
		slideZoomableImg.animate(scaleAnimation, 200);
    	slideZoomable.animate({scrollLeft: scrollPositionX, scrollTop: scrollPositionY}, 200);

		slideFrame.find('.zoom-out').addClass('disabled');
		slideFrame.find('.view-original, .gallery-like').removeClass('fullscreen');

        if(scaledWidth == $(window).width()) {
			slideFrame.find('.view-original').addClass('disabled');
        }

        setTimeout(function(){
        	$slide.removeClass('fullscreen');
        }, 100);
        setTimeout(function(){
        	slideZoomable.removeClass('visible').addClass('hide');
        	slideZoomable.removeAttr('data-scroll-top data-scroll-left')
        	slideZoomableImg.remove();
        }, 200);
    }
    
}

var setSlideIconTooltip = function(slideframe_selector){
	// used 01. gallery block gallery mode
	// used 002. resourcebox image

	$(slideframe_selector).find('.zoom-in, .zoom-out, .view-original, .view-original.fullscreen').attr({
		'data-toggle': 'tooltip',
		'data-placement': 'bottom',
		'data-html': 'true',
	});

	$(slideframe_selector).find('.zoom-in').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.zoom-in']);
	$(slideframe_selector).find('.zoom-out').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.zoom-out']);

	$(slideframe_selector).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.view-fullscreen']);
	if($(slideframe_selector).find('.view-original').hasClass('fullscreen')) {
		$(slideframe_selector).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.view-original']);
	} else {
		$(slideframe_selector).find('.view-original').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.view-fullscreen']);
	}

	$(slideframe_selector).find('.play-pause').attr({
		'data-toggle': 'tooltip',
		'data-placement': 'top',
		'data-html': 'true',
		'data-original-title': $.lang[LANG]['gallery.slide.tooltip.autoplay']
	});
	$(slideframe_selector+'.blueimp-gallery-playing').find('.play-pause').attr('data-original-title', $.lang[LANG]['gallery.slide.tooltip.pause']);
}

$(function() {
	var elem = typeof PAGE_MODE != 'undefined' && PAGE_MODE == 'c' ? document.querySelector('.dsgn-body') : document.querySelector('html');

	elem.addEventListener('wheel', function(event) {
		// 마우스 위치를 기준으로 해당 요소를 찾음
		const mouseX = event.clientX;
		const mouseY = event.clientY;
		const elementAtMouse = document.elementFromPoint(mouseX, mouseY);
		var target = elementAtMouse;

		// 해당 위치에 있는 요소가 fixedscroll 내의 content-wrap인지를 확인
		if ($(target).parents('[data-gjs*="fixedscroll"]').find('.content-wrap').length && $(target).closest('.content-wrap').length) {
			// 해당 요소에서 휠 이벤트가 발생한 경우 preventDefault 호출하여 기본 스크롤 차단
			event.preventDefault();

			// 휠 이벤트가 발생한 요소에서 수동으로 스크롤 처리
			var focus_elem = $(target).parents('[data-gjs*="fixedscroll"]').find('.content-wrap').get(0);
			const atTop = focus_elem.scrollTop === 0;
			const atBottom = focus_elem.scrollHeight - focus_elem.scrollTop === focus_elem.clientHeight;

			// 최상단 또는 최하단에 도달하지 않았을 때만 수동 스크롤 처리
			if ((!atBottom && event.deltaY > 0) || (!atTop && event.deltaY < 0)) {
				// 내부 요소에서만 스크롤 이동
				focus_elem.scrollBy({
					top: event.deltaY,  // 스크롤 방향에 따라 이동
					behavior: 'auto'    // 부드러운 스크롤 효과 적용 가능, 필요시 'smooth'로 변경 가능
				});

				// focus_elem에 포커스 설정
				focus_elem.focus();
			} else {
				// 내부에서 더 이상 스크롤이 진행되지 않으면 elem 요소에서 스크롤을 처리
				if(isELVIEW) elem = document.querySelector('.elviewwrap');
				elem.scrollBy({
					top: event.deltaY,
					behavior: 'auto'
				});
			}
		}
	}, { passive: false, capture: true });

});