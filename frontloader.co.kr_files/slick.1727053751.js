var clSlickFnLoad = false;
var clSlickFn = function(block_selector) {
    if(clSlickFnLoad) return false;
    clSlickFnLoad = true;

    var slick_total = $(block_selector+' .slick:not(:empty)').length;
    if(slick_total < 1) {
        $(block_selector).removeClass('slick_row_op_0').find('.slick-loading-status').remove();
        clSlickFnLoad = false;
    } else {
        var slick_i = 0, 
            slick_col_i = (window.innerWidth > 991) ? 0 : ((window.innerWidth <= 480) ? 2 : 1),
            isElviewSlick = (typeof isElviewPage != 'undefined' && isElviewPage) ? isElviewPage : false;
        if(isElviewSlick) {
            var elview_d = (typeof isElviewDevice != 'undefined' && isElviewDevice) ? isElviewDevice : ''; 
            slick_col_i = (elview_d == 'm') ? 2 : 0;
        }

        $(block_selector+' .slick:not(:empty)').each(function() {
            slick_i++;
            var slickEL = $(this).closest('*[class*="el_"][data-clslick]'),
                slick_selector = '.' + slickEL.attr('data-name'),
                slick_v = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view'),
                slick_t = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view-t'),
                slick_m = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view-m'),
                slick_r = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-rows'),
                slick_dot = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-dot'),
                slick_arrow = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-arrow'),
                slick_draggable = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-draggable'),
                slick_speed = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-speed'),
                slick_autoplay = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-autoplay'),
                slick_autoplay_speed = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-autoplay-speed'),
                slick_toscroll = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-toscroll'),
                slick_infinite = false;
            slick_v = (typeof slick_v != 'undefined' && slick_v) ? Number(slick_v.trim()) : 3;
            slick_t = (typeof slick_t != 'undefined' && slick_t) ? Number(slick_t.trim()) : 2;
            slick_m = (typeof slick_m != 'undefined' && slick_m) ? Number(slick_m.trim()) : 2;
            slick_r = (typeof slick_r != 'undefined' && slick_r) ? Number(slick_r.trim()) : 1;
            slick_draggable = (typeof slick_draggable != 'undefined' && slick_draggable.replace(/\s/g,'') == 'false') ? false : true;
            slick_autoplay = (typeof slick_autoplay != 'undefined' && slick_autoplay.replace(/\s/g,'') == 'true') ? true : false;
            slick_autoplay_speed = (typeof slick_autoplay_speed != 'undefined' && slick_autoplay_speed) ? Number(slick_autoplay_speed) : 2000;
            if(slick_autoplay) slick_infinite = true;

            var slick_col = [slick_v,slick_t,slick_m],
                slick_options = {
                    rows: slick_r,
                    adaptiveHeight: false,
                    draggable: slick_draggable,
                    autoplay: slick_autoplay,
                    autoplaySpeed: slick_autoplay_speed,
                    slidesToShow: slick_col[slick_col_i],
                    slidesToScroll: (typeof slick_toscroll != 'undefined' && slick_toscroll.replace(/\s/g,'') == 'true') ? 1 : slick_col[slick_col_i],
                    infinite: slick_infinite
                };
                    // fade: true,
            if(typeof slick_speed != 'undefined' && slick_speed) {
                slick_options['speed'] = parseFloat(slick_speed.match(/\d+/)[0]);
            }
            if(typeof slick_dot != 'slick_dot' && slick_dot) {
                slick_options['dots'] = true;
                // slick_dot == 'true' , 블럭별 style 설정
                // slick_options['dotsClass'] = 'slick-dots slick-type'+slick_dot.trim();
            }

            if(typeof slick_arrow != 'undefined' && slick_arrow) {
                var slick_arrow_tmp = slick_arrow.trim().split(','),
                    slick_arrow_type = slick_arrow_tmp[0].trim(),
                    slick_arrow_w = slick_arrow_tmp[1].trim(),
                    slick_arrow_h = slick_arrow_tmp[2].trim(),
                    slick_prev = clSVG('clslick_arrow'+slick_arrow_type, slick_arrow_w, slick_arrow_h);

                if(slick_prev) {
                    slick_options['prevArrow'] = '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_prev+'</button>';
                    slick_options['nextArrow'] = '<button class="slick-next slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_prev+'</button>';
                }
            }

            if(slickEL.find('.slick-page-label').length > 0) {
                slickEL.find('.slick-page-label .slick-page-now').text(1);
                slickEL.find('.slick-page-label .slick-page-total').text(slickEL.find('.slick .item:not(.slick-cloned)').length);
            }

            if(slickEL.find('.slick').is('.slick-initialized')) slickEL.find('.slick').slick('unslick').off('beforeChange').off('init reInit afterChange');
            slickEL.find('.slick').slick(slick_options).on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
                if(slickEL.find('.slick-page-label').length > 0) {
                    var i = (currentSlide ? currentSlide : 0) + 1;
                    slickEL.find('.slick-page-label .slick-page-now').text(i);
                    slickEL.find('.slick-page-label .slick-page-total').text(slick.slideCount);
                }
            }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            });

            if($('#el-blockConfig').hasClass('open')) slickEL.find('.slick').slick('slickPause');

            if(slickEL.find('.slick-dots li').length == 1) slickEL.find('.slick-dots').addClass('hide');

            if(slick_i >= slick_total) {
                $(block_selector).removeClass('slick_row_op_0').find('.slick-loading-status').remove();
                clSlickFnLoad = false;
            }
        });

    }
}



var syncSlickFnLoad = false;
var syncSlickFn = function(block_selector) {
    if(syncSlickFnLoad) return false;
    syncSlickFnLoad = true;

    var slick_cnt = 0,
        slick_total = $(block_selector+' .slick:not(:empty)').length;
    if(slick_total < 1) {
        $(block_selector).removeClass('sync_row_op_0').find('.sync-loading-status').remove();
        syncSlickFnLoad = false;
    } else {
        var slick_i = 0, 
            slick_col_i = (window.innerWidth > 991) ? 0 : ((window.innerWidth <= 480) ? 2 : 1),
            isElviewSlick = (typeof isElviewPage != 'undefined' && isElviewPage) ? isElviewPage : false;
        if(isElviewSlick) {
            var elview_d = (typeof isElviewDevice != 'undefined' && isElviewDevice) ? isElviewDevice : ''; 
            slick_col_i = (elview_d == 'm') ? 2 : 0;
        }

        $(block_selector+' .slick:not(:empty)').each(function() {
            slick_i++;
            var slickEL = $(this).closest('*[class*="el_"][data-type="sync"]'),
                slick_selector = '.' + slickEL.attr('data-name'),
                slick_type = slickEL.attr('data-type2'),
                slick_v = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view'),
                slick_t = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view-t'),
                slick_m = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-view-m'),
                slick_r = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-rows'),
                slick_dot = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-dot'),
                slick_arrow = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-arrow'),
                slick_speed = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-speed'),
                slick_autoplay = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-autoplay'),
                slick_autoplay_speed = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-autoplay-speed'),
                slick_toscroll = getComputedStyle(document.querySelector(slick_selector)).getPropertyValue('--slick-toscroll'),
            slick_v = (typeof slick_v != 'undefined' && slick_v) ? Number(slick_v.trim()) : 3;
            slick_t = (typeof slick_t != 'undefined' && slick_t) ? Number(slick_t.trim()) : 2;
            slick_m = (typeof slick_m != 'undefined' && slick_m) ? Number(slick_m.trim()) : 2;
            slick_r = (typeof slick_r != 'undefined' && slick_r) ? Number(slick_r.trim()) : 1;
            slick_autoplay = (typeof slick_autoplay != 'undefined' && slick_autoplay.replace(/\s/g,'') == 'true') ? true : false;
            slick_autoplay_speed = (typeof slick_autoplay_speed != 'undefined' && slick_autoplay_speed) ? Number(slick_autoplay_speed) : 2000;

            var slick_col = [slick_v,slick_t,slick_m],
                slick_options = {
                    rows: slick_r,
                    adaptiveHeight: false,
                    autoplay: slick_autoplay,
                    autoplaySpeed: slick_autoplay_speed,
                    slidesToShow: slick_col[slick_col_i],
                    slidesToScroll: (typeof slick_toscroll != 'undefined' && slick_toscroll.replace(/\s/g,'') == 'true') ? 1 : slick_col[slick_col_i],
                    infinite: true
                };
                    // fade: true,

            if(typeof slick_speed != 'undefined' && slick_speed) {
                slick_options['speed'] = parseFloat(slick_speed.match(/\d+/)[0]);
            }
            if(typeof slick_dot != 'slick_dot' && slick_dot) {
                slick_options['dots'] = true;
                // slick_dot == 'true' , 블럭별 style 설정
                // slick_options['dotsClass'] = 'slick-dots slick-type'+slick_dot.trim();
            }

            if(typeof slick_arrow != 'undefined' && slick_arrow) {
                var slick_arrow_tmp = slick_arrow.trim().split(','),
                    slick_arrow_type = slick_arrow_tmp[0].trim(),
                    slick_arrow_w = slick_arrow_tmp[1].trim(),
                    slick_arrow_h = slick_arrow_tmp[2].trim(),
                    slick_prev = slick_next = clSVG('sync_arrow'+slick_arrow_type, slick_arrow_w, slick_arrow_h);
                
                if(slick_prev == '') {
                    slick_prev = clSVG('sync_arrow'+slick_arrow_type+'_left', slick_arrow_w, slick_arrow_h);
                    slick_next = clSVG('sync_arrow'+slick_arrow_type+'_right', slick_arrow_w, slick_arrow_h);
                }

                if(slick_prev) {
                    slick_options['prevArrow'] = '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_prev+'</button>';
                    slick_options['nextArrow'] = '<button class="slick-next slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_next+'</button>';
                }
            }

            if(slickEL.find('.slick-page-label').length > 0) {
                slickEL.find('.slick-page-label .slick-page-now').text(1);
                slickEL.find('.slick-page-label .slick-page-total').text(slickEL.find('.slick .item.sync-item:not(.slick-cloned)').length);
            }

            if(slickEL.find('.slick').is('.slick-initialized')) slickEL.find('.slick').slick('unslick').off('beforeChange').off('init reInit afterChange');
            slickEL.find('.slick').slick(slick_options).on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
                if(slickEL.find('.slick-page-label').length > 0) {
                    var i = (currentSlide ? currentSlide : 0) + 1;
                    slickEL.find('.slick-page-label .slick-page-now').text(i);
                    slickEL.find('.slick-page-label .slick-page-total').text(slick.slideCount);
                }
            }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                if(slick_type == 'imgpitem' && slickEL.find('[data-sync-loop="true"][data-sync-type="image"]').length > 0) slickEL.find('[data-sync-loop="true"][data-sync-type="image"] > li').eq(nextSlide).addClass('active').siblings().removeClass('active');
            });

            if($('#el-blockConfig').hasClass('open')) slickEL.find('.slick').slick('slickPause');

            if(slickEL.find('.slick-dots li').length == 1) slickEL.find('.slick-dots').addClass('hide');

            if(slick_i >= slick_total) {
                $(block_selector).removeClass('sync_row_op_0').find('.sync-loading-status').remove();
                syncSlickFnLoad = false;
            }
        });


        $(block_selector+'[data-type="sync"][data-type2="imgshow"]').each(function() {
            if($(this).find('.sync-img-ul').length > 0 && $(this).find('.sync-img-pagination').length > 0) {
                var syncEL = $(this);

                //next slide 
                syncEL.find('.sync-img-btn.next').off('click').click(function(){
                    syncImgshowSlideRight($(this).closest(block_selector));
                });

                //previous slide
                syncEL.find('.sync-img-btn.prev').off('click').click(function(){
                    syncImgshowSlideLeft($(this).closest(block_selector));
                });

                //set imgshow width
                syncEL.imagesLoaded().progress(function(imgLoad, image) {
                    syncImgshowSlideWidthCheck(block_selector);
                }).done(function() {
                    syncImgshowSlideStart($(block_selector));
                    if($('#el-blockConfig').hasClass('open')) syncImgshowSlideStop($(block_selector));
                });

                syncEL.find('.sync-img-ul > li').each(function(idx) {
                    if(idx == 0) $(this).closest(block_selector).find('.sync-img-pagination').empty();
                    var siu_li = document.createElement('li');
                    $(this).closest(block_selector).find('.sync-img-pagination').append(siu_li);
                });

                syncImgshowSlidePagination(syncEL);

                syncEL.find('.sync-img-wrap').hover(
                    function() {
                        if($(this).find('.sync-img-ul > li').length < 2) $(this).addClass('slide-stop');
                        syncImgshowSlideStop($(this).closest('[data-type="sync"][data-type2="imgshow"]'));
                    },
                    function() {
                        $(this).removeClass('slide-stop');
                        syncImgshowSlideStart($(this).closest('[data-type="sync"][data-type2="imgshow"]'));
                    }
                );

            }
        });
    }
}

var syncImgshowSlideWidthCheck = function(syncImgshowEL_selector) {
    if(typeof syncImgshowEL_selector == 'undefined' || $(syncImgshowEL_selector).length == 0) syncImgshowEL_selector = '[data-type="sync"][data-type2="imgshow"]';

    var checkParent = (window.parent && window.parent != this) ? true : false;
    var window_w = $(window).width();
    $(syncImgshowEL_selector).each(function() {
        if($(this).is('[data-type="sync"][data-type2="imgshow"]')) {
            if($(this).find('.sync-img-ul > li').length > 1) $(this).find('.sync-img-pagination-wrap, .sync-img-btn-wrap').removeClass('hide');
            else $(this).find('.sync-img-pagination-wrap, .sync-img-btn-wrap').addClass('hide');

            // var checkTemplateview = (checkParent && $('.template-iframe', window.parent.document).length > 0) ? true : false,
            //     checkPreview = (checkParent && $('.preview-iframe', window.parent.document).length > 0) ? true : false,
            //     checkElview = (checkParent && $('#elviewer', window.parent.document).length > 0) ? true : false;

            var s_total = $(this).find('.sync-img-ul > li').length,
                s_width = $(this).find('.sync-img-wrap').width();
            //     sis_iv_w = getComputedStyle(document.querySelector(syncImgshowEL_selector)).getPropertyValue('--sync-imgshow-width');
            // sis_iv_w = sis_iv_w.replace(/[^0-9\.]/g,'') * 1;

            $(this).find('.sync-img-ul').width(s_width*s_total);
            document.querySelector(syncImgshowEL_selector).style.setProperty('--sync-imgshow-width', s_width+'px', null);
        }
    });
}

var syncImgshowSlideRight = function(syncImgshowEL) {
    var sis_width = $(syncImgshowEL).find('.sync-img-wrap').width(),
        sis_total = $(syncImgshowEL).find('.sync-img-ul > li').length,
        sis_pos = $(syncImgshowEL).find('.sync-img-ul > li.active').index();

    sis_pos++;
    if(sis_pos >= sis_total) sis_pos = 0;
    $(syncImgshowEL).find('.sync-img-ul').animate({left: -(sis_width*sis_pos) + 'px'}, 1000, 'easeInOutQuart',function() { 
        $(syncImgshowEL).find('.sync-img-ul > li').eq(sis_pos).addClass('active').siblings().removeClass('active');
        syncImgshowSlidePagination(syncImgshowEL);
    });
}

var syncImgshowSlideLeft = function(syncImgshowEL) {
    var sis_width = $(syncImgshowEL).find('.sync-img-wrap').width(),
        sis_total = $(syncImgshowEL).find('.sync-img-ul > li').length,
        sis_pos = $(syncImgshowEL).find('.sync-img-ul > li.active').index();

    sis_pos--;
    if(sis_pos <= -1) sis_pos = sis_total-1;
    $(syncImgshowEL).find('.sync-img-ul').animate({left: -(sis_width*sis_pos) + 'px'}, 1000, 'easeInOutQuart',function() { 
        $(syncImgshowEL).find('.sync-img-ul > li').eq(sis_pos).addClass('active').siblings().removeClass('active');
        syncImgshowSlidePagination(syncImgshowEL);
    });
}

var syncImgshowSlidePagination = function(syncImgshowEL) {
    var sis_pos = $(syncImgshowEL).find('.sync-img-ul > li.active').index();
    $(syncImgshowEL).find('.sync-img-pagination > li').removeClass('active');
    $(syncImgshowEL).find('.sync-img-pagination > li:eq('+sis_pos+')').addClass('active');
}

var syncImgshowSlideStop = function(syncImgshowEL) {
    var $sisEL = (typeof syncImgshowEL != 'undefined' && $(syncImgshowEL).length > 0) ? $(syncImgshowEL) : $('[data-type="sync"][data-type2="imgshow"]');
    $sisEL.each(function() {
        if($(this).is('[data-type="sync"][data-type2="imgshow"]')) {
            var sis_elname = $(this).attr('data-name'),
                sis_seq = $(this).attr('data-id'),
                sis_selector = '.'+sis_elname+'[data-id="'+sis_seq+'"]',
                sis_iv_id = ($(sis_selector).length > 0) ? getComputedStyle(document.querySelector(sis_selector)).getPropertyValue('--sync-imgshow-id') : '';
            if(typeof sis_iv_id != 'undefined' && $.trim(sis_iv_id)) {
                clearInterval(sis_iv_id);
                document.querySelector(sis_selector).style.setProperty('--sync-imgshow-id', null, null);
            }
        }
    });
}
var syncImgshowSlideStart = function(syncImgshowEL) {
    var $sisEL = (typeof syncImgshowEL != 'undefined' && $(syncImgshowEL).length > 0) ? $(syncImgshowEL) : $('[data-type="sync"][data-type2="imgshow"]');
    $sisEL.each(function() {
        if($(this).is('[data-type="sync"][data-type2="imgshow"]')) {
            var sis_elname = $(this).attr('data-name'),
                sis_seq = $(this).attr('data-id'),
                sis_selector = '.'+sis_elname+'[data-id="'+sis_seq+'"]',
                sis_iv_id = ($(sis_selector).length > 0) ? getComputedStyle(document.querySelector(sis_selector)).getPropertyValue('--sync-imgshow-id') : '';
            if(typeof sis_iv_id != 'undefined' && $.trim(sis_iv_id)) {
                clearInterval(sis_iv_id);
                document.querySelector(sis_selector).style.setProperty('--sync-imgshow-id', null, null);
            }

            syncImgshowSlideWidthCheck(sis_selector);

            if($(this).find('.sync-img-ul > li').length > 1) {
                var sis_iv_nid = setInterval(syncImgshowSlideRight, 3500, $(this));
                document.querySelector(sis_selector).style.setProperty('--sync-imgshow-id', sis_iv_nid, null);
            }
        }
    });
}

var syncArrowLoad = function(syncEL) {
    var arrow_result = {'prev':'', 'next':''},
        tmp_arrow = getComputedStyle(document.querySelector('.'+syncEL)).getPropertyValue('--slick-arrow'),
        slick_arrow_tmp = tmp_arrow.trim().split(','),
        slick_arrow_type = slick_arrow_tmp[0].trim(),
        slick_arrow_w = slick_arrow_tmp[1].trim(),
        slick_arrow_h = slick_arrow_tmp[2].trim(),
        slick_prev = clSVG('sync_arrow'+slick_arrow_type, slick_arrow_w, slick_arrow_h);
       if(slick_arrow_type > 0) {
            arrow_result['prev'] = '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_prev+'</button>';
            arrow_result['next'] = '<button class="slick-next slick-arrow" aria-label="Previous" type="button" aria-disabled="false" data-arrow="'+slick_arrow_type+'">'+slick_prev+'</button>';
       }

    return arrow_result;
}

var loadSyncInitList = function(syncEL) {
    if(typeof syncEL == 'undefined' || $(syncEL).length == 0 || $(syncEL).attr('data-type') != 'sync') return false;

    var sync_sid = (typeof property != 'undefined') ? property.SID : SID,
        sync_spage = (typeof property != 'undefined') ? property.PAGE : PAGE,
        sync_publish = (typeof property != 'undefined') ? property.PUBLISH : false,
        $sync = $(syncEL),
        sync_row_selector = ($sync.find('.sync-option').length > 0) ? 'sync-row' : 'slick',
        $syncRow = $sync.find('.'+sync_row_selector),
        $syncLoop = $sync.find('[data-sync-loop="true"]'),
        sync_type = $sync.attr('data-type'),
        sync_type2 = $sync.attr('data-type2'),
        sync_bid = $sync.attr('data-id'),
        sync_lno = '';

    var checkEmptySample = false;

    $sync.addClass('sync_row_op_0');
    $syncRow.before('<div class="sync-loading-status"><div class="loading-dots"></div></div>');

    if( $.inArray(sync_type2, ['tab']) > -1 && 
        $sync.find('li.active[data-list-no]').length > 0
    ) {
        if($sync.find('li[data-list-no]').eq(0).hasClass('active') && !sync_publish) checkEmptySample = true;

        $syncRow.slick('unslick').off('beforeChange').off('init reInit afterChange');
        $syncRow.empty();

        sync_lno = $sync.find('li.active[data-list-no]').eq(0).attr('data-list-no');
        if(typeof sync_lno == 'undefined' || !sync_lno) sync_lno = '';
    }

    if(typeof sync_bid != 'undefined' && sync_bid) {
        $.ajax({
            type: 'POST',
            url: '/template/lux_sync_load',
            data: { sid: sync_sid, bid: sync_bid, lno: sync_lno, spage: sync_spage, publish: sync_publish },
            dataType: 'json',
            async: true,
            cache: false,
            success: function(r) {
                if (typeof r.error != 'undefined' && r.error) {
                    alert(r.error);
                    return false;
                }

                var $tmpEL = $(htmlspecialchars_decode(r.block.eltag,'ENT_QUOTES')),
                    $tmpRow = $('<div></div>'),
                    tmp_class = '';

                var sync_list_total = (r.data.length == 0) ? 0 : r.data.list.length;
                if($sync.find('.slick-page-label').length > 0) {
                    var page_label = sync_list_total;
                    if (r.block.type2 == 'imgpitem' && sync_list_total == 0) page_label = $sync.find('.slick .item').length;

                    $sync.find('.slick-page-label .slick-page-now').text(1);
                    $sync.find('.slick-page-label .slick-page-total').text(page_label);
                }

                if(sync_list_total > 0) {
                    var checkSyncGalleryFrame = false,
                        sync_gallery = {},
                        u_resource = (typeof property != 'undefined' && typeof property.RESOURCE != 'undefined') ? property.RESOURCE : RESOURCE,
                        u_sid = (typeof property != 'undefined' && typeof property.SID != 'undefined') ? property.SID : SID,
                        p = u_resource + '/' + u_sid;
                                                                            
                    $sync.removeClass('emptySync');
                    $sync.find('.sync-row-empty').remove();
                    var $tmpItem = $tmpEL.find('.item').eq(0).clone();

                    $.each(r.data.list, function(r_i,r_v) {
                        // $tmpItem.find('a').attr('href', '/config/page/_product/view/' + r_v.seq);
                        switch(r_v.type) {
                            case "lux"      : $tmpItem.find('a').attr('href', '/config/page/_product/view/' + r_v.seq); break;
                            case "shopping" : $tmpItem.find('a').attr('href', '/config/page/' + r_v.page + '/view/' + r_v.seq); break;
                            case "gallery"  : 
                                var img = getServeImage(r_v.image,'0',p);
                                (r_v.mode == 'project') ?
                                    $tmpItem.find('a').attr('href', '/config/page/' + r_v.page + '/view/' + r_v.seq) :
                                    $tmpItem.find('a').attr('href', img).attr('data-gallery','').attr('data-title',r_v.title); 
                                break;
                        }

                        if(r_v.type == 'gallery' && r_v.mode == 'gallery') {
                            checkSyncGalleryFrame = true;
                            sync_gallery.elsettings = r_v.elsettings;
                            sync_gallery.type = 'gallery';
                            sync_gallery.pid = r_v.pid;
                        }
                                                
                        $tmpItem.find('img').attr('src', r_v.image);
                        $tmpItem.find('.brand').text(r_v.brand_name);
                        $tmpItem.find('.name').text(r_v.title);
                        if (r_v.sale_rate > 0)
                            $tmpItem.find('.sale').text(r_v.sale_rate + '%');
                        (r_v.price != '') ? $tmpItem.find('.price').show().text('₩'+number_format(r_v.price)) : $tmpItem.find('.price').hide();
                        if (r_v.sale != '' && r_v.sale > 0 && r_v.sale > r_v.price) {
                            $tmpItem.find('.price-sale').show().text('₩'+number_format(r_v.sale));
                        } else $tmpItem.find('.price-sale').hide();
                        $syncRow.append($tmpItem.outerHTML());

                        if (r.block.type2 == 'imgpitem' && $syncLoop.length > 0) {
                            if ($syncLoop.children('li').eq(r_i).length == 0) $syncLoop.append($syncLoop.children('li').eq(0).clone().removeClass('active'));
                            $syncLoop.children('li').eq(r_i).attr('data-idx', r_i);
                        }
                    });
                    if(checkSyncGalleryFrame && typeof sync_gallery.type != 'undefined') {
                        syncAppendGalleryFrame($sync, sync_gallery.pid, sync_gallery.elsettings, sync_gallery.type, '');
                    }
                } else {
                    $sync.addClass('emptySync');
                    if(checkEmptySample) {
                        $syncRow.replaceWith($tmpEL.find('.'+sync_row_selector).outerHTML()).addClass('');
                    } else {
                        $syncRow.html('<div class="sync-row-empty">결과 없음</div>');
                    }
                }


                if($sync.find('.sync-row-empty').length == 0 && $syncRow.is('.slick')) syncSlickFn('.' + r.block.elname);
                else {
                    $sync.removeClass('sync_row_op_0').find('.sync-loading-status').remove();
                }
            },
            error: function(xhr, status, error) {
                $.processOFF();
                alert("Error " + xhr.status + " : 관리자에게 문의");
            }
        });
    }

}



$(function () {

    var slickFnTimer = null;
    $(window).on('resize', function(){
        clearTimeout(slickFnTimer);
        slickFnTimer = setTimeout(function(){
            if(typeof syncSlickFn == 'function') syncSlickFn('*[class*="el_"][data-type="sync"]');
            if(typeof clSlickFn == 'function') clSlickFn('*[class*="el_"][data-clslick]');
        }, 500);
    });
    

/*** .element[data-type="sync"] ***/
    $(document)
        .on('click', '[data-type="sync"] .sync-page-more', function(e) {
            if($(this).closest('.emptySync').length > 0) {
                e.preventDefault();
                return false;
            }

            var suncLoadMore = $(this),
                syncOption = $(this).closest('[data-type="sync"]').find('.sync-option'),
                sync_selector = $(this).closest('[data-type="sync"]').attr('data-name'),
                sync_p_unit = ($('.'+sync_selector).length > 0) ? getComputedStyle(document.querySelector('.'+sync_selector)).getPropertyValue('--sync-page-unit') : 1;
            sync_p_unit = (typeof sync_p_unit != 'undefined' && sync_p_unit) ? Number(sync_p_unit) : 1;

            var sync_p_now = (suncLoadMore.find('.sync-page-label').length > 0) ? suncLoadMore.find('.sync-page-label .sync-page-now').text() * 1 : 1,
                sunc_p_total = (suncLoadMore.find('.sync-page-label').length > 0) ? suncLoadMore.find('.sync-page-label .sync-page-total').text() * 1 : 1;

            sync_p_now++;
            syncOption.attr('data-sync-hidden', (sync_p_unit * sync_p_now) + 1);
            if(sunc_p_total == sync_p_now) suncLoadMore.closest('.sync-page-wrap').hide();
            else suncLoadMore.find('.sync-page-label .sync-page-now').text(sync_p_now);
        })
        .on('click', '[data-type="sync"][data-type2="tab"] .sync-tab-ul[data-sync-loop="true"] > li', function(e) {
            if($(this).is('.active')) {
                e.preventDefault();
                return false;
            }

            var syncEL = $(this).closest('[data-type="sync"][data-type2="tab"]'),
                sync_tab_idx = $(this).index();

            $(this).addClass('active').siblings().removeClass('active');
            if(syncEL.find('.sync-tabimg-ul').length > 0) syncEL.find('.sync-tabimg-ul').children().eq(sync_tab_idx).addClass('active').siblings().removeClass('active');
            if($(this).is('[data-list-no="1"]')) $(this).attr('data-list-no','');

            loadSyncInitList(syncEL);
        });

});