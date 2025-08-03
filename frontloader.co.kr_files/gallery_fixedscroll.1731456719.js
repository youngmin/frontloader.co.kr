
if(typeof MODE != 'undefined' && $.inArray(MODE, ['config','demo']) > -1) {
    var c_h = $('.editor-navbar').outerHeight(),
        m_h = ($('.el-menu > header').hasClass('sidebar')) ? 0 : $('header.navbar').outerHeight();
    $('.el_0_ctrl').css({
        'position': 'fixed',
        'top': (c_h+m_h + 5) + 'px',
        'right' : '15px',
        'z-index' : '126',
    });
}


/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------
	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll on
	overlap	:	0
	folder	:	800
	name	:	pGallery02

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="1" data-js-selector=".contain">
*/

let VisualVdoShow = class {
	constructor(gEL) { this.gjs_load(gEL); }
    gjs_check(gEL) {
        if( $(gEL).find('.gjs[data-js="fixedscroll"][data-js-code="1"][data-js-selector]').length == 0 ||
            $(gEL).find('[data-visual="true"]').length == 0  ||
            $(gEL).find('[data-visual="true"]').is('[data-visual-type="image"]')
        ) return false;
        else return true;
    }
    gjs_load(gEL) {
        if(this.gjs_check(gEL) === false) return false;

        this.DOM = { el : gEL };
        this.DOM.wrap = this.DOM.el.querySelector('[data-visual="true"]');
        this.DOM.loop = this.DOM.el.querySelector('[data-visual-attach="video"]');
        this.DOM.videoHide = ($.mpcWeb.mpcCheckWebType() == 'MOBILE') ? true : false;

        $(this.DOM.loop).attr('data-hide',this.DOM.videoHide);
        $(this.DOM.loop).find('.visual-item').eq(0).addClass('active').siblings().removeClass('active');
        if(this.DOM.videoHide) {
            this.DOM.play = setInterval(() => this.video_init(), 5000);
        } else {
            $(this.DOM.loop).find('.visual-item').eq(0).find('video').attr('autoplay','autoplay').siblings().removeAttr('autoplay');

            var vvs_this = this;
            $(this.DOM.loop).find('.visual-item video').on('ended', function() {
                var isReplay = ($(this).closest('[data-visual-attach="video"]').find('.visual-item').length < 2) ? true : false,
                    nextVisual = (isReplay) ? $(this).closest('.visual-item') : $(this).closest('.visual-item').next('.visual-item');
                if(nextVisual.length == 0) nextVisual = $(this).closest('[data-visual-attach="video"]').find('.visual-item').eq(0);

                if(isReplay) vvs_this.replay(nextVisual);
                else vvs_this.next($(this).closest('.visual-item'),nextVisual);
            });

            this.gjs_start();
        }

    }
    gjs_start() {
        if(typeof this.DOM == 'undefined') return false;

        if(this.DOM.videoHide) {
            this.DOM.play = setInterval(() => this.video_init(), 5000);
        } else {
            var vv_playPromise = this.DOM.loop.querySelector('.visual-item.active video').play();
            if(vv_playPromise !== undefined) {
                vv_playPromise.then(_ => {
                    // console.log('vv_playPromise start');
                }).catch(error => {
                    // console.log('vv_playPromise paused');
                });
            }
        }
    }
    gjs_stop() {
        if(typeof this.DOM == 'undefined') return false;

        if(this.DOM.videoHide) clearInterval(this.DOM.play);
        else  this.DOM.loop.querySelector('.visual-item.active video').pause();
    }
	replay(now) {
        if(this.DOM.videoHide === true) return false;

		$(now).find('video').load();
	}
	next(now,next) {
        if(this.DOM.videoHide === true) return false;

		$(now).find('video').removeAttr('autoplay');

		$(next).addClass('active').siblings().removeClass('active');
		$(next).find('video').attr('autoplay','autoplay').load();
	}
    video_init() {
        if(typeof this.DOM == 'undefined') return false;
        if(this.DOM.videoHide === false) return false;

		var isStop = (  $('#el-blockConfig').is('.open') || 
                        elDefaultClass == 'reorderBlock' ||
                        $(this.DOM.wrap).is('[data-visual-type="image"]') ||
                        ($(this.DOM.wrap).is('[data-visual-type="video"]') && $(this.DOM.wrap).find('[data-visual-attach="video"] .visual-item').length < 2)
                    ) ? true : false;
		if(isStop) {
			this.gjs_stop();
		} else {
            this.DOM.next = this.DOM.loop.querySelector('.visual-item.active').nextElementSibling;
            if($(this.DOM.next).length == 0) this.DOM.next = this.DOM.loop.querySelector('.visual-item');
            $(this.DOM.next).addClass('active').siblings().removeClass('active');
		}
    }

};

let VisualImgShow = class {
	constructor(gEL) { this.gjs_load(gEL); }
    gjs_check(gEL) {
        if( $(gEL).find('.gjs[data-js="fixedscroll"][data-js-code="1"][data-js-selector]').length == 0 ||
            $(gEL).find('[data-visual="true"]').length == 0 ||
            $(gEL).find('[data-visual="true"]').is('[data-visual-type="video"]')
        ) return false;
        else return true;
    }
    gjs_load(gEL) {
        if(this.gjs_check(gEL) === false) return false;

        this.DOM = { el: gEL };
        this.DOM.wrap = this.DOM.el.querySelector('[data-visual="true"]');
        this.DOM.loop = this.DOM.el.querySelector('[data-visual-attach="image"]');

        $(this.DOM.loop).find('.visual-item').eq(0).addClass('active').siblings().removeClass('active');

        this.DOM.visual_interval = $(this.DOM.loop).attr('data-visual-interval');
        if(typeof this.DOM.visual_interval == 'undefined') this.DOM.visual_interval = 5000;

        this.DOM.play = setInterval(() => this.init(), this.DOM.visual_interval);
	}
    gjs_start() {
        if(typeof this.DOM == 'undefined') return false;

        this.DOM.play = setInterval(() => this.init(), this.DOM.visual_interval);
    }
    gjs_stop() {
        if(typeof this.DOM == 'undefined') return false;

        clearInterval(this.DOM.play);
    }
	init() {
        if(typeof this.DOM == 'undefined') return false;

		var isStop = (  $('#el-blockConfig').is('.open') || 
                        elDefaultClass == 'reorderBlock' ||
                        $(this.DOM.wrap).is('[data-visual-type="video"]') ||
                        ($(this.DOM.wrap).is('[data-visual-type="image"]') && $(this.DOM.wrap).find('[data-visual-attach="image"] .visual-item').length < 2)
                    ) ? true : false;
		if(isStop) {
			this.gjs_stop();
		} else {
			this.DOM.next = this.DOM.loop.querySelector('.visual-item.active').nextElementSibling;
			if($(this.DOM.next).length == 0) this.DOM.next = this.DOM.loop.querySelector('.visual-item');
			$(this.DOM.next).addClass('active').siblings().removeClass('active');
		}
	}
};


/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------
	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll on
	overlap	:	0
	folder	:	800
	name	:	pGallery03

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="2" data-js-selector=".fixed-box">
*/

var Fixedscroll2_isOnScreen = function(gItem) {
    if($(gItem).length == 0) return false;
    
    if($(gItem).closest('.reorderBlock').length > 0)  elDefaultClass = 'reorderBlock';
    else elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';

    var result = false,
        gel = $(gItem).closest('.'+elDefaultClass).attr('data-name'),
        gf = $(gItem).closest('.'+elDefaultClass).find('.gjs').attr('data-js-selector');

    var fwrap_height = $('.'+gel+' '+gf).outerHeight(),
        fwrap_top = $('.'+gel+' '+gf).offset().top,
        fwrap_bottom = fwrap_top + fwrap_height,
        fwrap_center = fwrap_top + (fwrap_height / 2);

    var g_height = $(gItem).outerHeight(),
        g_top = $(gItem).offset().top,
        g_bottom = g_top + g_height,
        g_center = g_top + (g_height / 2);

    if(fwrap_center >= g_top && fwrap_center < g_bottom ) result = true;
    return result;
}
var Fixedscroll2 = function(gEL) {
    if($(gEL).outerWidth() < 768) return false;

    var checkMobile = ($(gEL).outerWidth() < 768) ? true : false,
        checkEmpty = $(gEL).find('[data-loop="true"]').hasClass('empty'),
        checkScrollHide = ($(gEL).find('[data-loop="true"] .grid').length === 1 && $(gEL).find('.loadmore-wrap').hasClass('hide')) ? true : false;

    if(checkEmpty || checkScrollHide) $('body').addClass('overflow-hidden');
    else $('body').removeClass('overflow-hidden');

    if(checkScrollHide) $(gEL).find('.grid:first-child').addClass('active');
    else if(!checkMobile && !checkEmpty) {
        $(gEL).find('[data-loop="true"] .grid').each(function() {
            if(Fixedscroll2_isOnScreen($(this))) {
                $(this).addClass('active').siblings().removeClass('active');
            }
        }).promise().done(function() {
            if($(gEL).find('.grid.active').length == 0 && isELVIEW) $(gEL).find('.grid:first-child').addClass('active').siblings().removeClass('active');
        });
    }
}


/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------

	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll off
	overlap	:	0
	folder	:	800
	name	:	pGallery04

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="3" data-js-selector=".fs-container">
*/

let Fixedscroll3 = class {
	constructor(gTarget) {
        this.gjs_load(gTarget);
    }
    gjs_check(gTarget) {
        if($(gTarget).closest('.reorderBlock').length > 0) elDefaultClass = 'reorderBlock';
        else elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';

        if( !$(gTarget).closest('.'+elDefaultClass).find('input.gjs').length ||
            $(gTarget).closest('.'+elDefaultClass).find('.gjs[data-js="fixedscroll"][data-js-code="3"][data-js-selector]').length == 0 
        ) return false;
        else true;
    }
    gjs_load(gTarget) {
        if(this.gjs_check(gTarget) === false) return false;
        if(typeof this.DOM != 'undefined' && typeof this.DOM.swiper != 'undefined') {
            this.prev_slide_idx = (typeof this.DOM.swiper.previousIndex != 'undefined') ? this.DOM.swiper.previousIndex : 0;
            this.prev_slide_move = (typeof this.DOM.swiper.previousTranslate != 'undefined') ? this.DOM.swiper.previousTranslate : 0;

            this.DOM.swiper.destroy();
            delete this.DOM.swiper;
        } else {
            delete this.prev_slide_idx;
            delete this.prev_slide_move;
        }

        var gseq = $(gTarget).closest('.'+elDefaultClass).attr('data-id'),
            elname = $(gTarget).closest('.'+elDefaultClass).attr('data-name'),
            eLStyles = window.getComputedStyle(document.querySelector('.'+elname)),
            swp_space = eLStyles.getPropertyValue('--swiper-space'),
            swp_view = eLStyles.getPropertyValue('--swiper-view'),
            swp_view_t = eLStyles.getPropertyValue('--swiper-view-t'),
            swp_view_m = eLStyles.getPropertyValue('--swiper-view-m');

        swp_space = (typeof swp_space != 'undefined' && swp_space) ? Math.floor(swp_space) : 0;
        swp_view = (typeof swp_view != 'undefined' && swp_view) ? parseFloat(swp_view) : 2.3;
        swp_view_t = (typeof swp_view_t != 'undefined' && swp_view_t) ? parseFloat(swp_view_t) : 2.2;
        swp_view_m = (typeof swp_view_m != 'undefined' && swp_view_m) ? parseFloat(swp_view_m) : 1.2;

        var swp_view_d = (window.innerWidth > 991) ? swp_view : ((window.innerWidth < 768) ? swp_view_m : swp_view_t);


        this.DOM = { el: gTarget };
        if(typeof gseq != 'undefined' && gseq.match(/^[0-9]+$/) != null) {
            var tmpEL = $(gTarget).closest('.'+elDefaultClass).clone();

            var gactiveslider = (typeof $.cookie('gallery-\-' + gseq) != 'undefined') ? $.cookie('gallery-fixedscroll3-' + gseq) : null;
            if(gactiveslider !== null) {
                this.prev_slide_idx = gactiveslider;
                setLoadmoreGalleryJS('fixedscroll3',gseq,false);
            }

            $(gTarget).closest('.'+elDefaultClass).after(tmpEL);
            $(gTarget).closest('.'+elDefaultClass).remove();
            var selector = $('.'+elname).find('.gjs').attr('data-js-selector');

            this.DOM.el = document.querySelector('.'+elname+' '+selector);
            // if(typeof $(this.DOM.el).find('.gallery-loadmore').attr('data-loadmore') == 'undefined') $(this.DOM.el).find('.loadmore-wrap').addClass('hide');
        } 

		this.DOM.swiper = new Swiper(this.DOM.el, {
            direction: 'horizontal',
			updateOnWindowResize: true,
            freeMode: !0,
            roundLengths: true,
            setWrapperSize: !1,
            autoHeight: !1,
            spaceBetween: swp_space,
            slidesPerView: swp_view_d,
            resizeObserver: false,
            breakpoints: {
                '280': {
                    slidesPerView: swp_view_m
                },
                '768': {
                    slidesPerView: swp_view_t
                },
                '992': {
                    slidesPerView: swp_view
                },
            },
            observer: true,
            observeParents: true,
            initialSlide: this.prev_slide_idx,
            speed: 300,
            mousewheel: !0,
            on: {
                init: function (e) {
                	refreshGallerySwiperHeight(document.querySelector('.'+elname+'.'+elDefaultClass));

                    setTimeout(function() {
                        var selector = $('.'+elname).find('.gjs').attr('data-js-selector');
                        $('.'+elname+' '+selector).removeClass('ready');
                    }, 300);
                },
                afterInit: function() {
                    var selector = $('.'+elname).find('.gjs').attr('data-js-selector');
                    $('.'+elname+' '+selector).removeClass('ready');
                },
                resize: function() {
                    refreshGallerySwiperHeight(document.querySelector('.'+elname+'.'+elDefaultClass));

                    var selector = $('.'+elname).find('.gjs').attr('data-js-selector');
                    $('.'+elname+' '+selector).removeClass('ready');
                },
                slideChange: function() {
                    // console.log('활성화 슬라이드 변경');
                },
				imagesReady: function() { // 모든 내부 이미지 로드후 이벤트 시작
					// console.log('슬라이드 이미지 로드 후 실행');
				},
                reachEnd: function() {
                    // console.log('마지막 슬라이드 위치');
                }
            },
		});

        if(typeof this.prev_slide_move != 'undefined' && this.prev_slide_move) {
            this.DOM.swiper.setTranslate(this.prev_slide_move);
            // this.DOM.swiper.slideToLoop(this.prev_slide_idx,1000,true);
        }        
	}
    gjs_destroy() {
        if(typeof this.DOM == 'undefined') return false;

        $(this.DOM.el).find('.swiper-wrapper[data-loop="true"]').removeAttr('style');
        if(typeof this.DOM.swiper != 'undefined') this.DOM.swiper.destroy();
    }
    gjs_start() {
        if(typeof this.DOM == 'undefined') return false;

        this.DOM.swiper.destroy();
        this.gjs_load(this.DOM.el);
    }
};



/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------

	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll off
	overlap	:	0
	folder	:	800
	name	:	pGallery05

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="4" data-js-selector=".fs-container">
*/


const Fixedscroll4_MathUtils = {
	lineEq: (y2, y1, x2, x1, currentVal) => {
		// y = mx + b 
		var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
		return m * currentVal + b;
	},
	lerp: (a, b, n) =>  (1 - n) * a + n * b,
	distance: (x1, x2, y1, y2) => {
		var a = x1 - x2;
		var b = y1 - y2;
		return Math.hypot(a,b);
	},
	randomNumber: (min,max) => Math.floor(Math.random()*(max-min+1)+min)
};

let Fixedscroll4 = class {
	constructor(gTarget) {
		this.gjs_load(gTarget);
	}
    gjs_check(gTarget) {
        if($(gTarget).closest('.reorderBlock').length > 0)  elDefaultClass = 'reorderBlock';
        else elDefaultClass = (isELVIEW) ? 'el_viewblock' : 'element';

        if( !$(gTarget).closest('.'+elDefaultClass).find('input.gjs').length ||
            $(gTarget).closest('.'+elDefaultClass).find('.gjs[data-js="fixedscroll"][data-js-code="4"][data-js-selector]').length == 0 
        ) return false;
        else true;
    }
    gjs_load(gTarget) {
        if(this.gjs_check(gTarget) === false || typeof TweenMax == 'undefined') return false;

		this.winsize;

		var w = 0, h = 0;
		if(typeof window.innerWidth == 'number') {
			//Non-IE
			w = window.innerWidth;
			h = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}

        this.DOM = { el: gTarget };
        this.DOM.elname = $(gTarget).closest('.'+elDefaultClass).attr('data-name');
        this.DOM.total = $(gTarget).find('.grid').length;

        var gseq = $(gTarget).closest('.'+elDefaultClass).attr('data-id'),
            eLStyles = window.getComputedStyle(document.querySelector('.'+this.DOM.elname)),
            cursor_color = eLStyles.getPropertyValue('--cursor-color');
        if(typeof cursor_color != 'undefined' && cursor_color) {
            cursor_color = cursor_color.trim();
            cursor_color = cursor_color.replace('#','%23');
            var el = $(gTarget).closest('.element').attr('data-el');
            var name = $(gTarget).closest('.element').attr('data-name');

            var cursor_left = `
            url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='${cursor_color}' x='0px' y='0px' width='61px' height='44px' viewBox='0 0 61 44' xml:space='preserve'%3E %3Cpath d='M.613 21.671L21.584.7l5.642 5.642-11.74 11.74H60.45v7.978H15.487l11.74 11.739-5.643 5.642L.613 22.469a.57.57 0 0 1 0-.798z'/%3E %3C/svg%3E") 30 22, sw-resize
            `;
            $('.'+el).find('.slide-control.slide-left').css('cursor', cursor_left);
            
            var cursor_center = `
            url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='${cursor_color}' x='0px' y='0px' width='52px' height='52px' viewBox='0 0 52 52' xml:space='preserve'%3E %3Cpath d='M29.889 30.05l-.036 21.361c-.222.213-7.654.213-7.876 0l-.007-21.358-21.52.007v-7.978l21.518.036L21.96.571h7.978l-.037 21.56 21.388.037c.213.222.213 7.654 0 7.876l-21.401.007z'/%3E %3C/svg%3E") 26 26, crosshair
            `;
            $('.'+el).find('.slide-control.slide-center').css('cursor', cursor_center);
            
            var cursor_right = `
            url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='${cursor_color}' x='0px' y='0px' width='61px' height='44px' viewBox='0 0 61 44' xml:space='preserve'%3E %3Cpath d='M60.287 21.671L39.316.7l-5.642 5.642 11.74 11.74H.45v7.978h44.963l-11.74 11.739 5.643 5.642 20.971-20.972a.57.57 0 0 0 0-.798z'/%3E %3C/svg%3E") 61 22, ne-resize
            `;
            $('.'+el).find('.slide-control.slide-right').css('cursor', cursor_right);

            var cursor_left_m = `
            url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='none' stroke='${cursor_color}' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' x='0px' y='0px' width='24px' height='24px' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='M17 2 7 12l10 10'/%3E %3C/svg%3E") !important
            `;
            var cursor_right_m = `
            url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='none' stroke='${cursor_color}' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' x='0px' y='0px' width='24px' height='24px' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='m7 2 10 10L7 22'/%3E %3C/svg%3E") !important
            `;
            var cssJson = CSSJSON.toJSON($('#'+el+'css').text());
            
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-left::after'] = {};
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-left::after']['attributes'] = {};
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-left::after']['attributes']['content'] = cursor_left_m;
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-right::after'] = {};
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-right::after']['attributes'] = {};
            cssJson['children']['.' + name + ' .m-slide-control.m-slide-right::after']['attributes']['content'] = cursor_right_m;

            $('#'+el+'css').text(CSSJSON.toCSS(cssJson));
        }

        // Center slide's position
        this.center = 0;
        if(typeof gseq != 'undefined') {
            var tmpEL = $(gTarget).closest('.'+elDefaultClass).clone();

            var gactiveslider = (typeof $.cookie('gallery-fixedscroll4-' + gseq) != 'undefined') ? $.cookie('gallery-fixedscroll4-' + gseq) : null;
            if(gactiveslider !== null) {
                this.center = Number(gactiveslider);
                setLoadmoreGalleryJS('fixedscroll4',gseq,false);
            }

            if(gactiveslider == null)  $(tmpEL).find('.loadmore-wrap').removeClass('slide-center slide-right');
            if(gactiveslider !== null || isELVIEW) {
                $(tmpEL).find('.slide').removeClass('slide-center slide-right slide-left cursor-default hide').removeAttr('style');
                $(tmpEL).find('.slide-control').removeClass('cursor-default hide');
                this.isAnimating = false;
            }
            $(gTarget).closest('.'+elDefaultClass).after(tmpEL);
            $(gTarget).closest('.'+elDefaultClass).remove();
            var selector = $('.'+this.DOM.elname).find('.gjs').attr('data-js-selector');

            this.DOM.el = document.querySelector('.'+this.DOM.elname+' '+selector);
            if(typeof $(this.DOM.el).find('.gallery-loadmore').attr('data-loadmore') == 'undefined') $(this.DOM.el).find('.loadmore-wrap').addClass('hide');
        }

        var calcWinsize = () => {
            this.winsize = {width: w, height: h};
        };
        calcWinsize();
		window.addEventListener('resize', calcWinsize);

		this.mousepos = {x: this.winsize.width/2, y: this.winsize.height/2};
		window.addEventListener('mousemove', ev => this.mousepos = this.getMousePos(ev));

		this.slides = [];
        [...this.DOM.el.querySelectorAll('.slide:not(.hide)')].forEach((slide, pos) => this.slides.push(new Fixedscroll4_Slide(slide)));

        var number_full = $(this.DOM.el.querySelectorAll('.grid')).length.toString().length;
        if(number_full < 2) number_full = 2;
        $(this.DOM.el.querySelectorAll('.grid .figure.number')).each(function(i) {
            var slide_number = Number(i) + 1;
            $(this).html(slide_number.toString().padStart(number_full,'0'));
        });

		// Total number of slides
		this.slidesTotal = this.slides.length;
		if ( this.slidesTotal < this.DOM.total ) return;

		// Content Items
		this.DOM.slideLinks = [...this.DOM.el.querySelectorAll('.slide a, .slide .gallery-loadmore')];

		// Areas (left, center, right) where to attach the navigation events.
		this.DOM.control = {
            wrap: this.DOM.el.querySelector('.slide-control-wrap'),
			left: this.DOM.el.querySelector('.slide-control.slide-left'),
			center: this.DOM.el.querySelector('.slide-control.slide-center'),
			right: this.DOM.el.querySelector('.slide-control.slide-right')
		};

        this.setVisibleSlides();
        this.calculateGap();
        this.initEvents();

		var mouseMoveVals = {translation: 0, rotation: -8};
		var render = () => {
			mouseMoveVals.translation = Fixedscroll4_MathUtils.lerp(mouseMoveVals.translation, Fixedscroll4_MathUtils.lineEq(-15, 15, this.winsize.width, 0, this.mousepos.x), 0.03);
			for (var i = 0; i <= this.slidesTotal - 1; ++i) {
				TweenMax.set(this.slides[i].DOM.img, {x: mouseMoveVals.translation});
				TweenMax.set(this.DOM.el, {rotation: mouseMoveVals.rotation});
			}
		}
		requestAnimationFrame(render);

		// Preload all the images in the page
		imagesLoaded(this.DOM.el.querySelectorAll('.g-img'), {background: true}, () => document.body.classList.remove('loading'));

	}
    getMousePos(e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : posx, y : posy }
    }
	setVisibleSlides() {
        var checkNextSlide = (this.center+1 <= this.slidesTotal-1) ? true : false,
            checkPrevSlide = (this.center-1 >= 0) ? true : false;

		this.centerSlide = this.slides[this.center];
		this.rightSlide = this.slides[checkNextSlide ? this.center+1 : null];
		this.leftSlide = this.slides[checkPrevSlide ? this.center-1 : null];
		this.centerSlide.setCenter();
        if(this.centerSlide.DOM.isMoreBtn) $(this.DOM.control.center).addClass('cursor-default');
        else $(this.DOM.control.center).removeClass('cursor-default');

        $(this.DOM.control.left).removeClass('cursor-default');
        $(this.DOM.control.right).removeClass('cursor-default');

		if(this.rightSlide != null) {
            $(this.DOM.control.right).removeClass('hide');
            $(this.DOM.el).closest('.'+elDefaultClass).find('.m-slide-control.m-slide-right').removeClass('hide');
            this.rightSlide.setRight();
		} else {
			$(this.DOM.control.right).addClass('hide');
            $(this.DOM.el).closest('.'+elDefaultClass).find('.m-slide-control.m-slide-right').addClass('hide');
		}

		if(this.leftSlide != null) {
			$(this.DOM.control.left).removeClass('hide');
            $(this.DOM.el).closest('.'+elDefaultClass).find('.m-slide-control.m-slide-left').removeClass('hide');
			this.leftSlide.setLeft(); 
		} else {
			$(this.DOM.control.left).addClass('hide');
            $(this.DOM.el).closest('.'+elDefaultClass).find('.m-slide-control.m-slide-left').addClass('hide');
		}
	}
	// Distance between 2 slides 
	// The amount to translate the elements that move when we navigate the slideshow
	calculateGap() {
        var s1_idx = (this.center < 1) ? 0 : this.center,
            s2_idx = s1_idx + 1;

        if(this.slidesTotal == 1) s2_idx = s1_idx;
        else if(this.slidesTotal == 2) {
            s1_idx = 0;
            s2_idx = 1;
        } else if(s1_idx + 1 >= this.slidesTotal) {
            s1_idx = this.slidesTotal - 2;
            s2_idx = this.slidesTotal - 1;
        }

		var s1 = this.slides[s1_idx].DOM.el.getBoundingClientRect();
		var s2 = this.slides[s2_idx].DOM.el.getBoundingClientRect();
		this.gap = Fixedscroll4_MathUtils.distance(s1.left + s1.width/2, s2.left + s2.width/2, s1.top + s1.height/2, s2.top + s2.height/2);
	}
    // Initialize events
    initEvents() {
        this.clickRightFn = () => this.navigate('right');
        this.DOM.control.right.addEventListener('click', this.clickRightFn);

        this.clickLeftFn = () => this.navigate('left');
        this.DOM.control.left.addEventListener('click', this.clickLeftFn);

        this.clickCenterFn = () => this.clickSlide();
        this.DOM.control.center.addEventListener('click', this.clickCenterFn);

        this.mouseenterCenterFn = () => {
            if ( this.isAnimating ) {
                return;
            }
            
            if(this.centerSlide.DOM.isMoreBtn) {
                var centerBtnStyles = window.getComputedStyle(this.centerSlide.DOM.el),
                    default_color = centerBtnStyles.getPropertyValue('--btn-line'),
                    hover_color = centerBtnStyles.getPropertyValue('--btn-line-hover');

                if(typeof default_color == 'undefined') default_color = centerBtnStyles.getPropertyValue('--gallery-loadmore-default');
                if(typeof hover_color == 'undefined') hover_color = centerBtnStyles.getPropertyValue('--gallery-loadmore-hover');

                if(typeof default_color != 'undefined') {
                    default_color = default_color.trim();
                    hover_color = (typeof hover_color != 'undefined' && hover_color) ? hover_color.trim() : default_color;
                }
            }

            var tl = new TimelineMax();
            tl.to(this.centerSlide.DOM.imgWrap, 0.7, {
                ease: Expo.easeOut,
                scale: 1.02
            })
            .to(this.centerSlide.DOM.img, 1.7, {
                ease: Expo.easeOut,
                scale: 1.05
            }, 0);
            if(this.centerSlide.DOM.isMoreBtn) {
                tl.to(this.centerSlide.DOM.el.querySelector('.gallery-loadmore svg'), 1.7, {
                    ease: Expo.easeOut,
                    fill: Coloris.getColorInfo(hover_color,'rgba')
                }, 0);
            }
        };
        this.DOM.control.center.addEventListener('mouseenter', this.mouseenterCenterFn);

        this.mouseleaveCenterFn = () => {
            if ( this.isAnimating ) {
                return;
            }

            if(this.centerSlide.DOM.isMoreBtn) {
                var centerBtnStyles = window.getComputedStyle(this.centerSlide.DOM.el),
                    default_color = centerBtnStyles.getPropertyValue('--btn-line'),
                    hover_color = centerBtnStyles.getPropertyValue('--btn-line-hover');

                if(typeof default_color == 'undefined') default_color = centerBtnStyles.getPropertyValue('--gallery-loadmore-default');
                if(typeof hover_color == 'undefined') hover_color = centerBtnStyles.getPropertyValue('--gallery-loadmore-hover');

                if(typeof default_color != 'undefined') {
                    default_color = default_color.trim();
                    hover_color = (typeof hover_color != 'undefined' && hover_color) ? hover_color.trim() : default_color;
                }
            }

            var tl = new TimelineMax();
            tl.to(this.centerSlide.DOM.imgWrap, 0.7, {
                ease: Expo.easeOut,
                scale: 1
            })
            .to(this.centerSlide.DOM.img, 0.7, {
                ease: Expo.easeOut,
                scale: 1
            }, 0);
            if(this.centerSlide.DOM.isMoreBtn) {
                tl.to(this.centerSlide.DOM.el.querySelector('.gallery-loadmore svg'), 0.7, {
                    ease: Expo.easeOut,
                    fill: Coloris.getColorInfo(default_color,'rgba')
                }, 0);
            }
        };
        this.DOM.control.center.addEventListener('mouseleave', this.mouseleaveCenterFn);

        this.resizeFn = () => this.calculateGap();
        window.addEventListener('resize', this.resizeFn);

        $(this.DOM.control.wrap).attr('data-set',true);
    }
    navigate(direction) {
        if ( this.isAnimating || typeof TweenMax == 'undefined') {
            return false;
        }
        this.isAnimating = true;

        var upcomingPos = direction === 'right' ? 
                this.center < this.slidesTotal-2 ? this.center+2 : null:
                this.center >= 2 ? this.center-2 : null;

        // Update current.
        this.center = direction === 'right' ? 
                this.center < this.slidesTotal-1 ? this.center+1 : null :
                this.center > 0 ? this.center-1 : null;


        this.upcomingSlide = (upcomingPos != null) ? this.slides[upcomingPos] : null;
        if(this.upcomingSlide) TweenMax.set(this.upcomingSlide.DOM.el, {x: direction === 'right' ? this.gap*2 : this.gap*2*-1, opacity: 1});

        var movingSlides = (this.upcomingSlide) ?  [this.upcomingSlide, this.centerSlide] : [this.centerSlide];
        if(direction === 'right') {
            if(this.rightSlide) movingSlides.push(this.rightSlide);
            if(this.leftSlide) movingSlides.push(this.leftSlide);
        } else {
            if(this.leftSlide) movingSlides.push(this.leftSlide);
            if(this.rightSlide) movingSlides.push(this.rightSlide);
        }

        var promises = [];
        movingSlides.forEach(slide => promises.push(slide.move(direction === 'right' ? 'left' : 'right', this.gap)));
        Promise.all(promises).then(() => {
            // After all is moved, update the classes of the 3 visible slides and reset styles
            movingSlides.forEach(slide => slide.reset());
            // Set it again
            this.setVisibleSlides();
            this.isAnimating = false;
        });
    }
    clickSlide() {
        if ( this.isAnimating ) {
            return false;
        }

        var contentItem = this.DOM.slideLinks[this.center];
        if(!$(contentItem).closest('.element[data-type="gallery"]').hasClass('emptyGallery')) contentItem.click();
    }
};

let Fixedscroll4_Slide = class {
    constructor(el) {
        this.DOM = {el: el};

        this.DOM.isMoreBtn = ($(this.DOM.el).find('.gallery-loadmore').length) ? true : false;
        if(this.DOM.isMoreBtn) {
            this.DOM.figcaptionTop = this.DOM.el.querySelector('.loadmore-wrap .loadmore-top');
            this.DOM.figcaptionBottom = this.DOM.el.querySelector('.loadmore-wrap .loadmore-bottom');
            this.DOM.imgWrap = this.DOM.el.querySelector('.gallery-loadmore[data-loadmore="true"]');
            this.DOM.img = this.DOM.el.querySelector('.loadmore-icon');

            var prev_slide = (this.DOM.el.previousSibling !== null) ? this.DOM.el.previousSibling : this.DOM.el.previousSibling.previousSibling,
                prev_f_top = (prev_slide !== null) ? prev_slide.querySelector('.grid figcaption.top') : null,
                prev_f_bottom = (prev_slide !== null) ? prev_slide.querySelector('.grid figcaption.bottom') : null,
                prev_t_h = (prev_f_top !== null) ? prev_f_top.clientHeight : 0,
                prev_b_h = (prev_f_bottom !== null) ? prev_f_bottom.clientHeight : 0;

            this.DOM.figcaptionTop.style.setProperty('height', prev_t_h+'px', null);
            this.DOM.figcaptionBottom.style.setProperty('height', prev_b_h+'px', null);
        } else {
            this.DOM.figcaptionTop = this.DOM.el.querySelector('figcaption.top');
            this.DOM.figcaptionBottom = this.DOM.el.querySelector('figcaption.bottom');
            this.DOM.imgWrap = this.DOM.el.querySelector('.img-wrapper');
            this.DOM.img = this.DOM.imgWrap.querySelector('.g-img');
        }
    }
    move(direction, val) {
        if(typeof this.DOM.el == 'undefined' || typeof TweenMax == 'undefined') return false;

        return new Promise((resolve, reject) => {
            var tx = direction === 'left' ? '+=' + val*-1 : '+=' + val;
            var duration = 1.2;

            new TimelineMax({onComplete: resolve})
            .to(this.DOM.imgWrap, duration, {
                x: tx,
                ease: Quart.easeInOut
            }, 0)
            .to(this.DOM.imgWrap, duration*.5, {
                scaleX: 1.3,
                ease: Quart.easeIn
            }, 0)
            .to(this.DOM.imgWrap, duration*.5, {
                scaleX: 1,
                ease: Quart.easeOut
            }, duration*.5) 
            .to(this.DOM.figcaptionTop, duration*.95, {
                x: tx,
                ease: Quint.easeInOut
            }, 0)
            .to(this.DOM.figcaptionBottom, duration*1.1, {
                x: tx,
                ease: Quart.easeInOut
            }, 0);
        });
    }
    setCenter() {
        if(typeof this.DOM.el == 'undefined' || typeof TweenMax == 'undefined') return false;

        this.isCenter = true;
        this.DOM.el.classList.add('slide-center');
        TweenMax.set([this.DOM.el], {opacity: 1});
    }
    setRight() {
        if(typeof this.DOM.el == 'undefined' || typeof TweenMax == 'undefined') return false;

        this.isRight = this.isCenter = false;
        this.isLeft = true;
        this.DOM.el.classList.add('slide-right');
        TweenMax.set([this.DOM.el], {opacity: 1});
    }
    setLeft() {
        if(typeof this.DOM.el == 'undefined' || typeof TweenMax == 'undefined') return false;

        this.isLeft = this.isCenter = false;
        this.isRight = true;
        this.DOM.el.classList.add('slide-left');
        TweenMax.set([this.DOM.el], {opacity: 1});
    }
    reset() {
        if(typeof this.DOM.el == 'undefined' || typeof TweenMax == 'undefined') return false;

        TweenMax.set([this.DOM.el, this.DOM.imgWrap, this.DOM.figcaptionTop, this.DOM.figcaptionBottom], {transform: 'none'});
        TweenMax.set([this.DOM.el], {opacity: 0});
        this.DOM.el.classList = (this.DOM.isMoreBtn) ? 'loadmore-wrap slide' : 'grid slide gallery-item';
    }
}



/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------

	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll off
	overlap	:	0
	folder	:	800
	name	:	pGallery00_SAMPLE

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="?" data-js-selector=".fs-container">
*/












/*
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------

	type	:	gallery
	type2	:	premium
	mode	:	 
	feature	:	fixedscroll on
	overlap	:	0
	folder	:	800
	name	:	pGalleryHold01

	<input class="gjs" type="hidden" data-js="fixedscroll" data-js-code="hold1" data-js-selector=".fs-container">
*/
var Fixedscrollhold1 = function(gEL,gTarget) {
	var g_el = $(gEL).attr('data-el'),
		g_elname = $(gEL).attr('data-name');
	gELStyles = window.getComputedStyle(document.querySelector('.'+g_elname));

	var fixe_h = innerHeight - $('header').outerHeight(),
		loop_h = $('.'+g_elname+' .loop').outerHeight(),
		inset = Math.ceil((fixe_h - loop_h ) / 2),
		grid_total = $('.'+g_elname+' .grid').length,
		grid_padding = Number(gELStyles.getPropertyValue('--grid-padding').replace('px','')),
		grid_width = Number(gELStyles.getPropertyValue('--grid-width').replace('px','')),
		grid_height = Number(gELStyles.getPropertyValue('--grid-height')),
		default_p = (70 * 100 / grid_padding) * 0.01,
		// default_p = 0.7,
		height_p = grid_total + 1 + default_p,
		padding_p = grid_total + default_p,
		// start_val = 'top ' + (inset + 20) + 'px',
		// end_val = 'bottom ' + ((inset + 20)* -2) + 'px';
		start_val = 'top ' + inset + 'px',
		// end_val = 'bottom ' + ((inset + 20)* -2) + 'px';
		end_val = '+=300%';

	document.querySelector('.'+g_elname+' .fs-row').style.setProperty('width', innerWidth+'px', null);
	document.querySelector('.'+g_elname+' .fs-row').style.setProperty('height', loop_h+'px', null);

	if(typeof gELStyles.getPropertyValue('--grid-total') != 'undefined' && gELStyles.getPropertyValue('--grid-total')) {
		document.querySelector('.'+g_elname).style.setProperty('--grid-total', grid_total, null);
	}

	gsap.registerPlugin(ScrollTrigger);
	var scroller = document.querySelector('.'+g_el+' '+gTarget),
	bodyScrollBar = Scrollbar.init(scroller, { damping: 0.08, thumbMinSize: 20, delegateTo: document, alwaysShowTracks: !0 });
	ScrollTrigger.scrollerProxy('.'+g_el+' '+gTarget, {
	    scrollTop(e) {
	        return arguments.length && (bodyScrollBar.scrollTop = e), bodyScrollBar.scrollTop;
	    },
	}),
	bodyScrollBar.addListener(ScrollTrigger.update),
	ScrollTrigger.defaults({ scroller: scroller });

	gsap.from('.'+g_elname+' .fs-row', {
	  scrollTrigger: {
	    trigger: '.'+g_elname+' .fs-row',
	    markers: true,
	    start: start_val ,
	    end: end_val,
	    scrub: 0.1,
	    pin: !0,
	    // toggleActions: 'play reverse none reverse',
	  },
	  ease: Linear.easeNone
	});

	// var move_x = (document.querySelector(".scroller").scrollTop < 10) ? 0 : (grid_total + 0.14) * -grid_width;
	// move_x = (grid_total + 0.14) * -grid_width;
	// move_x = (grid_total * grid_width) * -1;
	// var move_x = Math.ceil((grid_width + (grid_padding/2)) * (grid_total - 1) * -1);
	// var move_x = 4.14 * -innerWidth;
	// var move_x = -(grid_width+grid_padding);
	var move_x = (grid_total + 0.14) -(grid_width+grid_padding);
	var move_x = (grid_total + 1.14) -(grid_width+grid_padding);

	gsap.to('.'+g_elname+' .loop', {
	  scrollTrigger: {
	    trigger: '.'+g_elname+' .fs-row',
	    markers: true,
	    start: start_val,
	    end: end_val,
	    scrub: 0.1,
	  },
	  x: (grid_total - 1) * -grid_width, ease: "power1.out"
	});

	// (grid_width + grid_padding)
	  // x: (grid_total + 0.14) * -innerWidth, ease: "power1.out"
	// var box2tl = gsap.timeline({
	// 	scrollTrigger: {
	// 		trigger: '.s2',
	// 		start: 'top 5%',
	// 		pin: true,
	// 		scrub: true,
	// 		end: 'bottom 100%',

	// 		// markers: {startColor: "red", endColor: "blue", fontSize: "20px"},
	// 		toggleActions : 'play reverse none reverse',
	// 			// default : play none none none
	// 			// toggleActions : (onEnter, onLeave, onEnterBack, onLeaveBack) 값은 
	// 			// (play pause resume reset restart complete reverse none) 사용 가능  
	// 			// toggleActions : (트리거 시작할 때, 트리거 떠날 때, end방향으로 다시 진입할 때, start로 다시 진입할 때, start로 다시 나갈 때) 
	// 	}
	// });


	// box2tl.to('.s2', { x : 50 })
	// box2tl.to('.s2', { x : -50 });


	// $('.dsgn-body').attr('data-barba','wrapper');

	// gsap.registerPlugin(ScrollTrigger);
	// var scroller = document.querySelector(".scroller"),
	// 	bodyScrollBar = Scrollbar.init(scroller, { damping: 0.08, thumbMinSize: 20, delegateTo: document, alwaysShowTracks: !0 });
	// let myAnim;
	// ScrollTrigger.scrollerProxy(".scroller", {
	//     scrollTop(e) {
	//         return arguments.length && (bodyScrollBar.scrollTop = e), bodyScrollBar.scrollTop;
	//     },
	// }),
	// bodyScrollBar.addListener(ScrollTrigger.update),
	// ScrollTrigger.defaults({ scroller: scroller });

	// var scrollAnimation = () => {
	// 	// document.querySelectorAll('.dsgn-body'),document.querySelector('.container');

	// 	// gsap.to(".bg_home", { scrollTrigger: { trigger: ".s4", start: "start 50%", end: "bottom 100%", scrub: 0.1 }, backgroundColor: "#000", ease: "power1.out" }),
	// 	gsap.from(".s2", { scrollTrigger: { trigger: ".s2", start: "bottom 120%", end: "bottom -250%", scrub: 0.1, pin: !0 }, ease: Linear.easeNone }),
	// 	gsap.to("#carrusel", { scrollTrigger: { trigger: ".s2", start: "bottom 120%", end: "bottom -250%", scrub: 0.1 }, x: 4.14 * -innerWidth, ease: "power1.out" });

	// };

	// // function delay(e) {
	// //     return new Promise((a) => setTimeout(a, e));
	// // }

	// scrollAnimation();
}
